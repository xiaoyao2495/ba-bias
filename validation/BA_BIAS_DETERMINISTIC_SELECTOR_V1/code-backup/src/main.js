import path from 'node:path';
import {activeAnalyst} from './analysis/active-analyst.js';
import {analyzeV4,productionAdapter,v4Readiness} from './analysis/structured-v4-production.js';
import {analyzeDirectional} from './analysis/directional-analyst.js';
import {saveDirectionalSnapshot,refreshDirectionalOutcomes} from './analysis/directional-history.js';
import {pathToFileURL} from 'node:url';
import {config,times,safeError} from './config.js';
import {Http} from './clients/http.js';
import {Binance,endpoints} from './clients/binance.js';
import {DeepSeek} from './clients/deepseek.js';
import {scan} from './market/scanner.js';
import {judgeStory} from './content/story-judge.js';
import {writeDraft} from './content/draft-writer.js';
import {guardDraft} from './content/claim-guard.js';
import {atomicWrite,readJson,lock,emptyHistory,compare,storyKey,loadOutbox,reconcile} from './storage/history.js';
import {buildIntelligence,verifiedFacts} from './intelligence/packet.js';
import {prepareDelivery,drainDeliveryQueue} from './storage/delivery-queue.js';
export function parseArgs(args){
  const mode=args.shift() || 'once';if(!['once','scan','doctor'].includes(mode))throw new Error('INVALID_MODE');
  const options={mode,send:false,liveDeepseek:false,writeDrafts:false,runId:null};
  while(args.length){const a=args.shift();if(a==='--send'&&mode==='once')options.send=true;else if(a==='--live-deepseek'&&mode==='doctor')options.liveDeepseek=true;else if(a==='--write-drafts'&&mode==='once')options.writeDrafts=true;else if(a==='--run-id')options.runId=args.shift();else throw new Error('INVALID_ARGUMENT');}
  if(options.runId!==null && (!options.runId||! /^[A-Za-z0-9_-]{1,100}$/.test(options.runId)))throw new Error('INVALID_RUN_ID');
  return options;
}
export function runSummary({runId,mode='once',scheduledAt=null,startedAt=null,triggerType='MANUAL',sendEnabled=false,status='RUNNING'}){
  return {runId,mode,status,triggerType,scheduledAt,startedAt,finishedAt:null,evaluationTime:null,dataCutoff:null,
    scannedSymbols:0,deepResearchedSymbols:0,factPackagesCount:0,judgedCandidates:0,eligibleStories:0,generatedArticles:0,rejectedArticles:0,rejectionReasons:[],
    dingTalkSent:0,dingTalkFailed:0,dingTalkUnknown:0,tokenUsage:{promptTokens:0,completionTokens:0,totalTokens:0},totalDurationMs:0,
    generatedIntelligence:0,candidateEvaluations:[],unassessedCandidates:[],dingTalkPending:0,generated:0,sent:0,sendRequested:sendEnabled,articles:[],rejections:[],errors:[],processingDuration:null,deepseekUsage:[]};
}
export async function saveSkippedRun({runId,scheduledAt,status,reason,now=Date.now,dataDir=config.dataDir}){
  const file=path.join(dataDir,'runs',runId,'result.json');
  if(await readJson(file,null))return;
  const r=runSummary({runId,scheduledAt,triggerType:'HOURLY',sendEnabled:true,status});
  r.finishedAt=now();r.errors=[{stage:'schedule',error:reason || status}];
  await atomicWrite(file,r,{overwrite:false});
}
async function recoverInterruptedRuns(history,outbox,{now=Date.now}={}){
  for(const [id,entry] of Object.entries(history.runs)){
    if(entry.status!=='RUNNING' || !/^[A-Za-z0-9_-]{1,100}$/.test(id))continue;
    const dir=path.join(config.dataDir,'runs',id),file=path.join(dir,'result.json');
    let result=await readJson(file,null);
    if(result && result.status!=='RUNNING'){history.runs[id]={...entry,status:result.status,finishedAt:result.finishedAt ?? null};continue;}
    result ||= runSummary({runId:id,startedAt:entry.startedAt,status:'RUNNING'});
    const scanned=await readJson(path.join(dir,'scan.json'),null);
    result.candidateEvaluations ||= (scanned?.researchCandidates || scanned?.candidates || []).map(c=>({symbol:c.symbol,status:c.status || 'NOT_EVALUATED',reason:c.reason}));
    for(let i=0;i<result.candidateEvaluations.length;i++){
      let c=result.candidateEvaluations[i];
      const saved=await readJson(path.join(dir,'evaluations',c.symbol+'.json'),null);if(saved)c=result.candidateEvaluations[i]=saved;
      const output=outbox.find(r=>r.runId===id&&r.symbol===c.symbol&&r.approval?.intelligenceGuardPassed);
      if(output){c.status=output.storyType==='MATERIAL_UPDATE'?'MATERIAL_UPDATE':'ELIGIBLE';c.reason=output.deduplication;}
      else if(['NOT_EVALUATED','FACTS_READY'].includes(c.status)){c.status='NOT_EVALUATED';c.reason='PROCESS_CRASH_BEFORE_EVALUATION_COMPLETED';}
      await atomicWrite(path.join(dir,'evaluations',c.symbol+'.json'),c);
    }
    result.status='INTERRUPTED';result.recoveredAt=now();result.unassessedCandidates=result.candidateEvaluations.filter(c=>c.status==='NOT_EVALUATED');
    result.errors ||= [];result.errors.push({stage:'recovery',error:'RECOVERED_AFTER_PROCESS_CRASH'});
    const records=outbox.filter(r=>r.runId===id);result.generated=records.length;result.sent=records.filter(r=>r.delivery.status==='SENT').length;
    await atomicWrite(file,result);history.runs[id]={...entry,status:'INTERRUPTED',recoveredAt:result.recoveredAt};
  }
}
export async function runResearch(options,{binance,llm,directionalLlm,analystVersion,deliveryHttp,deliverySender,deliverySleep,deliverySpacingMs,now=Date.now,log=(event,details)=>console.log(JSON.stringify({event,...details}))}={}){
  if(options.runId && !/^[A-Za-z0-9_-]{1,100}$/.test(options.runId))throw new Error('INVALID_RUN_ID');
  if(options.mode && !['once','scan','doctor'].includes(options.mode))throw new Error('INVALID_MODE');
  const mockLlm=llm,selectedAnalyst=analystVersion||activeAnalyst();
  const start=now(),controller=new AbortController();
  const mode=options.mode || 'once',sendEnabled=options.sendEnabled ?? options.send ?? false;
  const cancel=()=>controller.abort(new Error('RUN_INTERRUPTED'));
  const parentAbort=()=>controller.abort(options.signal.reason);
  const handleSignals=options.handleSignals!==false;
  if(handleSignals){process.once('SIGINT',cancel);process.once('SIGTERM',cancel);}
  if(options.signal){if(options.signal.aborted)parentAbort();else options.signal.addEventListener('abort',parentAbort,{once:true});}
  const timer=setTimeout(()=>controller.abort(new Error('RUN_TIMEOUT')),config.runTimeoutMs);
  binance ||= new Binance(new Http({signal:controller.signal}));llm ||= new DeepSeek(new Http({signal:controller.signal,concurrency:1,spacing:0,retries:1}));
  if(binance.http)binance.http.signal=controller.signal;
  if(llm.http)llm.http.signal=controller.signal;
  let unlock,history,result,save,outbox,analystAdapter;
  const statePath=path.join(config.dataDir,'state','history.json');
  const runId=options.runId || `${mode}_${times(start).shanghai.slice(0,13).replace(/[^0-9]/g,'')}`;
  const emit=(event,details={})=>log(event,{runId,...details});
  try{
    if(mode==='doctor'){
      const report={node:process.version,nodeSupported:Number(process.versions.node.split('.')[0])>=22,environment:Object.fromEntries(['ICT_PROXY_HOST','ICT_PROXY_PORT','DEEPSEEK_API_KEY','DINGTALK_WEBHOOK'].map(k=>[k,Boolean(process.env[k])])),proxy:config.proxy?{enabled:true,protocol:'http',hostConfigured:true,portConfigured:true}:{enabled:false},binance:null,deepseek:'NOT_CALLED',dingtalk:'NOT_CALLED',analyst:{activeVersion:selectedAnalyst,...v4Readiness()}};
      try{report.binance=(await binance.get(endpoints.time)).raw;}catch(e){report.binance={error:safeError(e)};process.exitCode=1;}
      if(options.liveDeepseek){report.deepseek=await llm.json('Return JSON {"ok":true}.',{purpose:'explicit connectivity check'});report.usage=llm.calls.map(c=>c.usage);}
      console.log(JSON.stringify(report,null,2));return report;
    }
    controller.signal.throwIfAborted();
    unlock=await lock(config.dataDir,{onCompromised:()=>controller.abort(new Error('LOCK_COMPROMISED'))});
    history=await readJson(statePath,emptyHistory());
    outbox=await loadOutbox(config.dataDir);reconcile(history,outbox);await recoverInterruptedRuns(history,outbox,{now});await atomicWrite(statePath,history);
    const disk=await readJson(path.join(config.dataDir,'runs',runId,'result.json'),null);
    const old=history.runs[runId] || disk;
    if(old){emit('Run already executed',{status:old.status});return old;}
    save=(file,value)=>atomicWrite(path.join(config.dataDir,'runs',runId,file),value);
    result=runSummary({runId,mode,scheduledAt:options.scheduledAt ?? null,startedAt:start,triggerType:options.triggerType || 'MANUAL',sendEnabled});
    history.runs[runId]={status:'RUNNING',scheduledAt:result.scheduledAt,startedAt:start};await atomicWrite(statePath,history);await save('result.json',result);
    emit('Binance market scan started');
    const scanned=await scan(binance,{runId,history,save});result.scan=scanned.result;result.evaluationTime=scanned.result.evaluationTime;result.dataCutoff=result.evaluationTime;
    result.scannedSymbols=scanned.result.universeCount;result.deepResearchedSymbols=scanned.result.researched;result.factPackagesCount=scanned.result.researched;
    emit('Symbols',{count:result.scannedSymbols});emit('Deep candidates',{count:result.deepResearchedSymbols});emit('Facts packages',{count:result.factPackagesCount,eligible:scanned.facts.length});
    const observations=await Promise.all((scanned.result.researchCandidates || []).map(c=>readJson(path.join(config.dataDir,'runs',runId,'facts',c.symbol+'.json'),null)));
    result.directionalOutcomes=await refreshDirectionalOutcomes(config.dataDir,observations.filter(Boolean),history);
    result.directionalAnalyses=0;result.directionalFailures=0;
    result.candidateEvaluations=(scanned.result.researchCandidates || scanned.facts.map(f=>({symbol:f.symbol,status:'FACTS_READY'}))).map(c=>({...c,status:c.status==='FACTS_READY'?'NOT_EVALUATED':c.status,reason:c.status==='FACTS_READY'?(mode==='scan'?'SCAN_ONLY':'AWAITING_JUDGE'):c.reason}));
    await save('result.json',result);
    const evaluate=async(symbol,status,reason,extra={})=>{
      const entry=result.candidateEvaluations.find(c=>c.symbol===symbol);
      Object.assign(entry,{status,reason,...extra});await save(`evaluations/${symbol}.json`,entry);await save('result.json',result);
    };
    controller.signal.throwIfAborted();
    if(mode==='once'){
      // Dry-run archives do not suppress a first real notification. Reserved new
      // queue records still participate in deduplication to prevent new retry copies.
      const v4Adapter=analystAdapter=selectedAnalyst==='V4'?productionAdapter({mockClient:directionalLlm||mockLlm,signal:controller.signal}):null;
      result.analystVersion=selectedAnalyst;
      const researchStories=sendEnabled?reconcile(emptyHistory(),outbox.filter(r=>['SENT','UNKNOWN'].includes(r.delivery.status)||(r.intelligence?.version===1&&r.delivery.status!=='SHADOW'))).stories:history.stories;
      // All valid deep-research candidates are judged; no output or LLM-count quota.
      for(const f of scanned.facts){
        controller.signal.throwIfAborted();let stage='facts';
        try{
          const verified=verifiedFacts(f);
          const comparison=compare(verified,researchStories[f.symbol]);
          stage='judge';emit('Story Judge started',{symbol:f.symbol});result.judgedCandidates++;
          const judge=await judgeStory(llm,verified,comparison);await save(`stories/${f.symbol}.judge.json`,judge);
          if(judge.contractValidation)await save(`stories/${f.symbol}.judge-validation.json`,judge.contractValidation);
          if(!judge.eligible){result.rejections.push({symbol:f.symbol,reason:judge.reason});await evaluate(f.symbol,'NOT_NEWSWORTHY',judge.reason,{judge});continue;}
          stage='directional';result.directionalAnalyses++;
          const directional=selectedAnalyst==='V4'?await analyzeV4(v4Adapter,verified,{signal:controller.signal,now}):await analyzeDirectional(directionalLlm || llm,verified,{signal:controller.signal});
          if(directional.status==='FAILED'){result.directionalFailures++;emit('Directional Analyst degraded',{symbol:f.symbol});}
          await save(`directional/${f.symbol}.json`,directional);
          let snapshot;
          try{snapshot=await saveDirectionalSnapshot(config.dataDir,{runId,facts:verified,result:directional,history,now});}
          catch(e){result.errors.push({symbol:f.symbol,stage:'directional-persist',error:safeError(e)});snapshot={id:null};if(directional.status==='VALIDATED')result.directionalFailures++;directional.status='FAILED';directional.failureReason='ANALYST_SNAPSHOT_PERSIST_FAILED';directional.analysis=null;directional.rendered=null;}
          await atomicWrite(statePath,history);
          const previousAnalysis=researchStories[f.symbol]?.directional;
          const previousDirection=previousAnalysis?.status==='VALIDATED'&&previousAnalysis.analysis.horizon===directional.analysis?.horizon?previousAnalysis.analysis.marketBias:null;
          if(comparison.eligible && comparison.previous && directional.status==='VALIDATED' && previousDirection && previousDirection!==directional.analysis.marketBias)comparison.reason='MATERIAL_EVIDENCE_AND_DIRECTION_CHANGE';
          if(!comparison.eligible){result.rejections.push({symbol:f.symbol,reason:comparison.reason});await evaluate(f.symbol,'DUPLICATE',comparison.reason,{judge,directionalId:snapshot.id});continue;}
          stage='intelligence';
          const {packet,article}=buildIntelligence(f,judge,comparison,{directional:{...directional,snapshotId:snapshot.id}});
          result.eligibleStories++;emit('Intelligence Guard passed',{symbol:f.symbol});
          stage='persist';await save(`intelligence/${f.symbol}.json`,packet);
          controller.signal.throwIfAborted();
          const key=storyKey(f,comparison),file=path.join(config.dataDir,'outbox',runId+'_'+f.symbol+'.json');
          const record={runId,symbol:f.symbol,storyType:judge.storyType,storyKey:key,summary:comparison.current,scheduledAt:result.scheduledAt,evaluationTime:f.dataCutoff,generatedAt:now(),candidateScore:f.candidateScore,evidenceIds:packet.evidenceIds,intelligence:packet,article,deduplication:comparison.reason,
            directional:{analystVersion:directional.analystVersion||'V3',snapshotId:snapshot.id,status:directional.status,analysis:directional.analysis},approval:{judgeEligible:true,intelligenceGuardPassed:true,claimGuardPassed:true},delivery:{status:sendEnabled?'PENDING':'SHADOW',sent:false},factsPath:path.resolve(config.dataDir,'runs',runId,'facts',f.symbol+'.json')};
          record.delivery=prepareDelivery(record);
          await atomicWrite(file,record);result.generated++;result.articles.push(path.resolve(file));outbox.push(record);emit('Outbox saved',{symbol:f.symbol});
          await evaluate(f.symbol,judge.storyType==='MATERIAL_UPDATE'?'MATERIAL_UPDATE':'ELIGIBLE',comparison.reason,{judge,directionalId:snapshot.id,directionalStatus:directional.status,outboxPath:path.resolve(file)});
          reconcile(history,outbox);await atomicWrite(statePath,history);
        }catch(e){
          if(controller.signal.aborted)throw e;
          if(stage==='judge'&&e.diagnostics)await save(`stories/${f.symbol}.judge-validation.json`,e.diagnostics);
          const error=safeError(e),status=stage==='judge'?'JUDGE_FAILED':stage==='intelligence'||e.message==='INSUFFICIENT_EVIDENCE'?'INSUFFICIENT_EVIDENCE':'DATA_ERROR';
          await evaluate(f.symbol,status,error);result.errors.push({symbol:f.symbol,stage,error});result.rejections.push({symbol:f.symbol,reason:error});emit('Candidate failed',{symbol:f.symbol,status,error});
        }
      }
      // Writing is explicitly optional and starts only after every Judge evaluation.
      if(options.writeDrafts){
        for(const record of outbox.filter(r=>r.runId===runId)){
          if(controller.signal.aborted)break;
          const f=scanned.facts.find(f=>f.symbol===record.symbol),judge=result.candidateEvaluations.find(c=>c.symbol===record.symbol).judge;
          try{
            let draft=await writeDraft(llm,f,judge);await save(`stories/${f.symbol}.draft.json`,draft);
            let guard=guardDraft(draft,f,judge);await save(`stories/${f.symbol}.guard.json`,guard);
            if(!guard.ok){draft=await writeDraft(llm,f,judge,{previousDraft:draft,errors:guard.errors});await save(`stories/${f.symbol}.repair.json`,draft);guard=guardDraft(draft,f,judge);await save(`stories/${f.symbol}.repair-guard.json`,guard);}
            record.optionalDraft={status:guard.ok?'COMPLETE':'REJECTED',errors:guard.errors,article:guard.ok?guard.article:null};
            if(!guard.ok)result.rejectedArticles++;
          }catch(e){record.optionalDraft={status:'FAILED',error:safeError(e)};}
          await atomicWrite(path.join(config.dataDir,'outbox',`${runId}_${record.symbol}.json`),record);
        }
      }
      if(sendEnabled){
        await drainDeliveryQueue(outbox,{dataDir:config.dataDir,signal:controller.signal,now,http:deliveryHttp || new Http({signal:controller.signal,retries:0}),
          ...(deliverySender?{sender:deliverySender}:{}),...(deliverySleep?{sleep:deliverySleep}:{}),...(deliverySpacingMs!==undefined?{spacingMs:deliverySpacingMs}:{})});
        const current=outbox.filter(r=>r.runId===runId);
        result.sent=current.filter(r=>r.delivery.status==='SENT').length;
        result.dingTalkFailed=current.filter(r=>r.delivery.status==='FAILED').length;result.dingTalkUnknown=current.filter(r=>r.delivery.status==='UNKNOWN').length;
        result.dingTalkPending=current.filter(r=>r.delivery.status==='PENDING').length;
        for(const record of current.filter(r=>['FAILED','UNKNOWN'].includes(r.delivery.status)))result.errors.push({symbol:record.symbol,stage:'delivery',status:record.delivery.status,error:record.delivery.error});
        emit('DingTalk sent',{count:result.sent,pending:result.dingTalkPending});reconcile(history,outbox);
      }
    }
    result.status=result.errors.length||result.candidateEvaluations.some(c=>c.status==='NOT_EVALUATED'&&mode==='once')?'PARTIAL':'COMPLETE';return result;
  }catch(e){
    if(!result && options.triggerType==='HOURLY' && e.message==='RUN_ALREADY_LOCKED'){
      await saveSkippedRun({runId,scheduledAt:options.scheduledAt,status:'SKIPPED_OVERLAP',now});emit('SKIPPED_OVERLAP');return {runId,status:'SKIPPED_OVERLAP'};
    }
    if(result){result.status=controller.signal.aborted?'INTERRUPTED':'FAILED';result.errors.push({stage:'run',error:safeError(e)});}else throw e;
    if(options.setExitCode!==false && !controller.signal.aborted)process.exitCode=1;return result;
  }finally{
    clearTimeout(timer);if(handleSignals){process.removeListener('SIGINT',cancel);process.removeListener('SIGTERM',cancel);}options.signal?.removeEventListener('abort',parentAbort);
    if(result){
      result.finishedAt=now();result.processingDuration=result.finishedAt-start;result.totalDurationMs=result.processingDuration;
      for(const entry of result.candidateEvaluations){if(entry.status==='NOT_EVALUATED' && entry.reason==='AWAITING_JUDGE')entry.reason=controller.signal.aborted?'RUN_INTERRUPTED_OR_TIMEOUT':'RUN_FAILED_BEFORE_EVALUATION';}
      result.unassessedCandidates=result.candidateEvaluations.filter(c=>c.status==='NOT_EVALUATED');
      if(outbox){const current=outbox.filter(r=>r.runId===runId);result.sent=current.filter(r=>r.delivery.status==='SENT').length;result.dingTalkFailed=current.filter(r=>r.delivery.status==='FAILED').length;result.dingTalkUnknown=current.filter(r=>r.delivery.status==='UNKNOWN').length;result.dingTalkPending=current.filter(r=>r.delivery.status==='PENDING').length;reconcile(history,outbox);}
      result.generatedIntelligence=result.generated;result.generatedArticles=result.generated;result.dingTalkSent=result.sent;result.rejectionReasons=result.rejections;
      result.deepseekUsage=[...(llm.calls?.map(c=>({model:c.model,usage:c.usage,durationMs:c.durationMs})) || []),...(analystAdapter?.records().map(r=>({analystVersion:'V4',model:r.model,usage:r.rawResponse?.usage??null,physicalRequests:r.physicalRequests})) || [])];
      for(const c of result.deepseekUsage){result.tokenUsage.promptTokens+=c.usage?.prompt_tokens || 0;result.tokenUsage.completionTokens+=c.usage?.completion_tokens || 0;result.tokenUsage.totalTokens+=c.usage?.total_tokens || 0;}
      try{for(const entry of result.candidateEvaluations)await save(`evaluations/${entry.symbol}.json`,entry);
        await save('deepseek-calls.json',llm.calls || []);await save('result.json',result);
        history.runs[runId]={status:result.status,scheduledAt:result.scheduledAt,startedAt:start,finishedAt:result.finishedAt,generated:result.generated,sent:result.sent,lastResearchTime:result.evaluationTime};await atomicWrite(statePath,history);
        emit('Run completed',{status:result.status,generated:result.generated,sent:result.sent,durationMs:result.totalDurationMs,output:path.resolve(config.dataDir,'runs',runId)});
        if(!result.generated)emit('DingTalk skipped: no eligible stories');
      }finally{if(unlock)await unlock();}
    }else if(unlock)await unlock();
  }
}
export const run=runResearch;
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  try{runResearch(parseArgs(process.argv.slice(2))).catch(e=>{console.error(JSON.stringify({error:safeError(e)}));process.exitCode=1;});}
  catch(e){console.error(JSON.stringify({error:safeError(e)}));process.exitCode=1;}
}
