import path from 'node:path';
import {activeAnalyst} from './analysis/active-analyst.js';
import {analyze,createAdapter,readiness} from './analysis/market-bias-v2/executor.js';
import {CONTRACT,sha} from './analysis/market-bias-v2/common.js';
import {validateResearch} from './analysis/market-bias-v2/parser.js';
import {guardResearch} from './analysis/market-bias-v2/guard.js';
import {saveResearch,previousResearch} from './analysis/market-bias-v2/storage.js';
import {assertPrepared,loadV2Outbox,reconcileV2,selectorStories,v2Dir,immutableWrite} from './storage/market-bias-v2-state.js';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {config,times,safeError} from './config.js';
import {Http} from './clients/http.js';
import {Binance,endpoints} from './clients/binance.js';
import {DeepSeek} from './clients/deepseek.js';
import {scan} from './market/scanner.js';
import {selectOpportunities,eligibilityCompatibility} from './market/opportunity-selector.js';
import {createRunDiagnostics,recordSelection,recordResearch,finishRunDiagnostics} from './market/run-diagnostics.js';
import {atomicWrite,readJson,lock,emptyHistory,compare,storyKey} from './storage/history.js';
import {buildIntelligence,verifiedFacts} from './intelligence/packet.js';
import {prepareDelivery,drainDeliveryQueue} from './storage/delivery-queue.js';
export function parseArgs(args){
  const mode=args.shift() || 'once';if(!['once','scan','doctor'].includes(mode))throw new Error('INVALID_MODE');
  const options={mode,send:false,liveDeepseek:false,writeDrafts:false,runId:null};
  while(args.length){const a=args.shift();if(a==='--send'&&mode==='once')options.send=true;else if(a==='--live-deepseek'&&mode==='doctor')options.liveDeepseek=true;else if(a==='--run-id')options.runId=args.shift();else throw new Error('INVALID_ARGUMENT');}
  if(options.runId!==null && (!options.runId||! /^[A-Za-z0-9_-]{1,100}$/.test(options.runId)))throw new Error('INVALID_RUN_ID');
  return options;
}
export function runSummary({runId,mode='once',scheduledAt=null,startedAt=null,triggerType='MANUAL',sendEnabled=false,status='RUNNING'}){
  return {contract:CONTRACT,runId,mode,status,triggerType,scheduledAt,startedAt,finishedAt:null,evaluationTime:null,dataCutoff:null,
    scannedSymbols:0,deepResearchedSymbols:0,factPackagesCount:0,judgedCandidates:0,eligibleStories:0,generatedArticles:0,rejectedArticles:0,rejectionReasons:[],
    dingTalkSent:0,dingTalkFailed:0,dingTalkUnknown:0,tokenUsage:{promptTokens:0,completionTokens:0,totalTokens:0},totalDurationMs:0,
    generatedIntelligence:0,candidateEvaluations:[],unassessedCandidates:[],dingTalkPending:0,generated:0,sent:0,sendRequested:sendEnabled,articles:[],rejections:[],errors:[],processingDuration:null,deepseekUsage:[]};
}
export async function saveSkippedRun({runId,scheduledAt,status,reason,now=Date.now,dataDir=config.dataDir}){
  const file=path.join(dataDir,'runs',runId,'result.json');
  const index=async record=>{if(await readJson(path.join(v2Dir(dataDir),'state','cutover-manifest.json'),null))
    await immutableWrite(path.join(v2Dir(dataDir),'skips',runId+'.json'),record);};
  const existing=await readJson(file,null);
  if(existing){if(existing.contract===CONTRACT&&existing.triggerType==='HOURLY'&&existing.startedAt===null)await index(existing);return;}
  const r=runSummary({runId,scheduledAt,triggerType:'HOURLY',sendEnabled:true,status});
  r.finishedAt=now();r.errors=[{stage:'schedule',error:reason || status}];
  await atomicWrite(file,r,{overwrite:false});
  // A skip can be recorded while the research lock is held. Its separate V2
  // marker lets the read-only index find it without racing a history rewrite.
  await index(r);
}
async function recoverInterruptedRuns(history,outbox,manifest,{now=Date.now}={}){
  for(const [id,entry] of Object.entries(history.runs)){
    if(entry.contract!==CONTRACT || entry.status!=='RUNNING' || !/^[A-Za-z0-9_-]{1,100}$/.test(id))continue;
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
      else if(['ELIGIBLE','MATERIAL_UPDATE'].includes(c.status)||result.articles?.some(p=>path.basename(p)===`${id}_${c.symbol}.json`)){
        c.status='DATA_ERROR';c.reason='RECOVERY_OUTBOX_MISSING';result.errors ||= [];result.errors.push({symbol:c.symbol,stage:'recovery',error:c.reason});
      }
      else if(['NOT_EVALUATED','FACTS_READY'].includes(c.status)&&!result.articles?.some(p=>path.basename(p)===`${id}_${c.symbol}.json`)){
        const sealed=await readJson(path.join(v2Dir(config.dataDir),'research',id,c.symbol+'.json'),null);
        if(sealed){
          try{
            if(!validateResearch(sealed)||sealed.runId!==id||sealed.symbol!==c.symbol)throw Error('SEALED_RESEARCH_INVALID');
            const receiptFile=path.join(v2Dir(config.dataDir),'receipts',sealed.recordId+'.json');
            const receipt=await readJson(receiptFile,null);
            if(receipt&&receipt.researchSha256!==sha(sealed))throw Error('RECOVERY_RECEIPT_MISMATCH');
            if(!receipt)await immutableWrite(receiptFile,{contract:CONTRACT,recordId:sealed.recordId,researchSha256:sha(sealed),persistedAt:now()});
            history.research[sealed.recordId]={contract:CONTRACT,recordId:sealed.recordId,runId:id,symbol:c.symbol,factsAsOf:sealed.asOf.factsAsOf,executionState:sealed.executionState,researchSha256:sha(sealed)};
            if(sealed.executionState==='UNAVAILABLE'){c.status='JUDGE_FAILED';c.reason=sealed.error?.code||'RESEARCH_UNAVAILABLE';}
            else if(sealed.researchFormat==='MINIMAL_MARKET_RESEARCH_V1'){c.status='RESEARCH_READY';c.reason='PENDING_MANUAL_REVIEW';c.researchId=sealed.recordId;}
            else{
              const audit=await readJson(path.join(v2Dir(config.dataDir),'audit',id,c.symbol+'.json'),null);
              const factsBytes=await fs.readFile(path.join(dir,'facts',c.symbol+'.json'));
              const f=JSON.parse(factsBytes),row=await readJson(path.join(dir,'selection',c.symbol+'.json'),null);
              if(!audit?.input||audit.inputHash!==sha(audit.input)||sha(factsBytes)!==sealed.factsPackageSha256||!guardResearch(sealed,audit.input).ok||row?.status!=='SELECTED'||f.symbol!==c.symbol||f.runId!==id)throw Error('RECOVERY_INPUT_BINDING_FAILED');
              if(!row.comparison?.eligible){c.status='DUPLICATE';c.reason=row.comparison?.reason||'NO_MATERIAL_UPDATE';}
              else{
                const judge=eligibilityCompatibility(row),{packet}=buildIntelligence(f,judge,row.comparison,{biasResearch:sealed,biasInput:audit.input});
                await immutableWrite(path.join(dir,'intelligence',c.symbol+'.json'),packet);
                const file=path.join(v2Dir(config.dataDir),'outbox',id+'_'+c.symbol+'.json');
                const record={contract:CONTRACT,runId:id,symbol:c.symbol,storyType:judge.storyType,storyKey:storyKey(f,row.comparison),summary:row.comparison.current,scheduledAt:result.scheduledAt,evaluationTime:f.dataCutoff,generatedAt:now(),candidateScore:f.candidateScore,evidenceIds:packet.evidenceIds,intelligence:packet,intelligenceSha256:sha(packet),deduplication:row.comparison.reason,researchId:sealed.recordId,approval:{eligibilitySource:'DETERMINISTIC_SELECTOR_V1',selectorEligible:true,intelligenceGuardPassed:true,claimGuardPassed:true},delivery:{status:result.sendRequested?'PENDING':'SHADOW',sent:false}};
                record.delivery=prepareDelivery(record);
                if(manifest.blockedDeliveryIds.includes(record.delivery.deliveryId))throw Error('LEGACY_DELIVERY_ID_COLLISION');
                await immutableWrite(file,record);outbox.push(record);result.articles ||= [];result.articles.push(path.resolve(file));
                c.status=judge.storyType==='MATERIAL_UPDATE'?'MATERIAL_UPDATE':'ELIGIBLE';c.reason=row.comparison.reason;c.researchId=sealed.recordId;c.researchState='VALIDATED';
              }
            }
          }catch(e){c.status='DATA_ERROR';c.reason='RECOVERY_'+safeError(e);result.errors ||= [];result.errors.push({symbol:c.symbol,stage:'recovery',error:c.reason});}
        }else{c.status='NOT_EVALUATED';c.reason='PROCESS_CRASH_BEFORE_EVALUATION_COMPLETED';}
      }
      else if(['NOT_EVALUATED','FACTS_READY'].includes(c.status)){c.status='NOT_EVALUATED';c.reason='PROCESS_CRASH_BEFORE_EVALUATION_COMPLETED';}
      await atomicWrite(path.join(dir,'evaluations',c.symbol+'.json'),c);
    }
    result.status='INTERRUPTED';result.recoveredAt=now();result.unassessedCandidates=result.candidateEvaluations.filter(c=>c.status==='NOT_EVALUATED');
    result.errors ||= [];result.errors.push({stage:'recovery',error:'RECOVERED_AFTER_PROCESS_CRASH'});
    const records=outbox.filter(r=>r.runId===id);result.generated=records.length;result.sent=records.filter(r=>r.delivery.status==='SENT').length;
    await atomicWrite(file,result);history.runs[id]={...entry,status:'INTERRUPTED',recoveredAt:result.recoveredAt};
  }
}
export async function runResearch(options,{binance,llm,biasLlm,analystVersion,opportunitySelector=selectOpportunities,deliveryHttp,deliverySender,deliverySleep,deliverySpacingMs,now=Date.now,log=(event,details)=>console.log(JSON.stringify({event,...details}))}={}){
  if(options.runId && !/^[A-Za-z0-9_-]{1,100}$/.test(options.runId))throw new Error('INVALID_RUN_ID');
  if(options.mode && !['once','scan','doctor'].includes(options.mode))throw new Error('INVALID_MODE');
  const mockLlm=llm,selectedAnalyst=analystVersion||activeAnalyst();
  if(selectedAnalyst!==CONTRACT)throw Error('ONLY_V2_PRODUCTION_ANALYST');
  if(options.writeDrafts)throw Error('LLM_WRITER_REMOVED_FROM_PRODUCTION');
  const start=now(),controller=new AbortController();
  const mode=options.mode || 'once',sendEnabled=options.sendEnabled ?? options.send ?? false;
  const cancel=()=>controller.abort(new Error('RUN_INTERRUPTED'));
  const parentAbort=()=>controller.abort(options.signal.reason);
  const handleSignals=options.handleSignals!==false;
  if(handleSignals){process.once('SIGINT',cancel);process.once('SIGTERM',cancel);}
  if(options.signal){if(options.signal.aborted)parentAbort();else options.signal.addEventListener('abort',parentAbort,{once:true});}
  const timer=setTimeout(()=>controller.abort(new Error('RUN_TIMEOUT')),config.runTimeoutMs);
  binance ||= new Binance(new Http({signal:controller.signal}));if(mode==='doctor')llm ||= new DeepSeek(new Http({signal:controller.signal,concurrency:1,spacing:0,retries:1}));
  if(binance.http)binance.http.signal=controller.signal;
  if(llm?.http)llm.http.signal=controller.signal;
  let unlock,history,result,save,outbox,analystAdapter,runDiagnostics;
  const statePath=path.join(v2Dir(config.dataDir),'state','history.json');
  const runId=options.runId || `${mode}_${times(start).shanghai.slice(0,13).replace(/[^0-9]/g,'')}`;
  const emit=(event,details={})=>log(event,{runId,...details});
  try{
    if(mode==='doctor'){
      const report={node:process.version,nodeSupported:Number(process.versions.node.split('.')[0])>=22,environment:Object.fromEntries(['ICT_PROXY_HOST','ICT_PROXY_PORT','DEEPSEEK_API_KEY','DINGTALK_WEBHOOK'].map(k=>[k,Boolean(process.env[k])])),proxy:config.proxy?{enabled:true,protocol:'http',hostConfigured:true,portConfigured:true}:{enabled:false},binance:null,deepseek:'NOT_CALLED',dingtalk:'NOT_CALLED',analyst:{activeVersion:selectedAnalyst,...readiness()}};
      try{report.binance=(await binance.get(endpoints.time)).raw;}catch(e){report.binance={error:safeError(e)};process.exitCode=1;}
      if(options.liveDeepseek){report.deepseek=await llm.json('Return JSON {"ok":true}.',{purpose:'explicit connectivity check'});report.usage=llm.calls.map(c=>c.usage);}
      console.log(JSON.stringify(report,null,2));return report;
    }
    controller.signal.throwIfAborted();
    unlock=await lock(config.dataDir,{onCompromised:()=>controller.abort(new Error('LOCK_COMPROMISED'))});
    const prepared=await assertPrepared(config.dataDir);history=prepared.history;
    outbox=await loadV2Outbox(config.dataDir);reconcileV2(history,outbox);await recoverInterruptedRuns(history,outbox,prepared.manifest,{now});reconcileV2(history,outbox);await atomicWrite(statePath,history);
    const disk=await readJson(path.join(config.dataDir,'runs',runId,'result.json'),null);
    const old=history.runs[runId] || history.legacyRunIds[runId] || disk;
    if(old){emit('Run already executed',{status:old.status});return old;}
    save=(file,value)=>atomicWrite(path.join(config.dataDir,'runs',runId,file),value);
    result=runSummary({runId,mode,scheduledAt:options.scheduledAt ?? null,startedAt:start,triggerType:options.triggerType || 'MANUAL',sendEnabled});
    runDiagnostics=createRunDiagnostics({runId,scheduledAt:result.scheduledAt,now});
    history.runs[runId]={contract:CONTRACT,status:'RUNNING',scheduledAt:result.scheduledAt,startedAt:start};await atomicWrite(statePath,history);await save('result.json',result);
    emit('Binance market scan started');
    const scanned=await scan(binance,{runId,history,save,scheduledAt:result.scheduledAt,diagnosticNow:now,onDiagnostics:d=>{runDiagnostics.scan=d;}});result.scan=scanned.result;result.evaluationTime=scanned.result.evaluationTime;result.dataCutoff=result.evaluationTime;
    result.scannedSymbols=scanned.result.universeCount;result.deepResearchedSymbols=scanned.result.researched;result.factPackagesCount=scanned.result.researched;
    emit('Symbols',{count:result.scannedSymbols});emit('Deep candidates',{count:result.deepResearchedSymbols});emit('Facts packages',{count:result.factPackagesCount,eligible:scanned.facts.length});
    result.biasAnalyses=0;result.biasFailures=0;result.analystRecoveryRequests=0;
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
      analystAdapter=createAdapter({mockClient:biasLlm||mockLlm,signal:controller.signal,now});
      result.analystVersion=CONTRACT;
      const researchStories=selectorStories(history,outbox,{includeShadow:!sendEnabled});
      const selection=opportunitySelector(scanned.facts,researchStories);
      recordSelection(runDiagnostics,selection);
      for(const candidate of runDiagnostics.candidates)candidate.historicalBaseline=selection.decisions.find(r=>r.symbol===candidate.symbol)?.historicalBaseline??null;
      result.selector={version:selection.version,policy:selection.policy,qualifiedCount:selection.qualifiedCount,selected:selection.selected.map(r=>r.symbol)};
      result.selectorEvaluated=selection.decisions.length;
      for(const row of selection.decisions){
        const audit={...row};delete audit.facts;
        await save(`selection/${row.symbol}.json`,audit);
        if(row.status!=='SELECTED'){result.rejections.push({symbol:row.symbol,reason:row.reason});await evaluate(row.symbol,row.status,row.reason,{selection:audit});}
        else await evaluate(row.symbol,'NOT_EVALUATED','AWAITING_ANALYST',{selection:audit});
      }
      for(const row of selection.selected){
        controller.signal.throwIfAborted();let stage='facts',researchRecord=null;const modelRecordStart=analystAdapter.records().length;
        const f=row.facts;
        try{
          const verified=verifiedFacts(f),comparison=row.comparison,judge=eligibilityCompatibility(row);
          stage='research';result.biasAnalyses++;
          const diagnosticCandidate=runDiagnostics.candidates.find(c=>c.symbol===f.symbol&&c.selected);
          const prior=await previousResearch(config.dataDir,history,f.symbol,f.dataCutoff,{onDecision:decision=>{if(diagnosticCandidate)diagnosticCandidate.v2.previousResearch=decision;}});
          if(prior&&['INSUFFICIENT_HISTORICAL_EVIDENCE','INVALID_OR_NON_PRIOR_HISTORY'].includes(prior.status))throw Error(prior.status);
          const factsBytes=await fs.readFile(path.join(config.dataDir,'runs',runId,'facts',f.symbol+'.json'));
          const existing=await readJson(path.join(v2Dir(config.dataDir),'research',runId,f.symbol+'.json'),null);
          if(existing)throw Error('RESEARCH_ALREADY_SEALED');
          if(diagnosticCandidate)diagnosticCandidate.v2.pipelineEntered=true;
          const researched=await analyze(analystAdapter,verified,{signal:controller.signal,now,previousFacts:prior?.facts??null,factsPackageSha256:sha(factsBytes),materialEvidence:row.materialEvidence});
          researchRecord=researched.research;
          result.analystRecoveryRequests+=researched.attempts.filter(a=>a.attempt>1).length;
          const sealed=await saveResearch(config.dataDir,researched,history,{now});
          await atomicWrite(statePath,history);
          if(sealed.research.executionState!=='VALIDATED'){result.biasFailures++;await evaluate(f.symbol,'JUDGE_FAILED',sealed.research.error.code,{researchId:sealed.research.recordId,researchState:'UNAVAILABLE'});result.errors.push({symbol:f.symbol,stage:'research',error:sealed.research.error.code});continue;}
          history.selectorBaseline[f.symbol]={storyKey:row.storyKey,summary:row.comparison.current,lastResearchTime:f.dataCutoff,lastOutputTime:history.selectorBaseline[f.symbol]?.lastOutputTime??null,status:'RESEARCH',runId};
          await atomicWrite(statePath,history);
          await evaluate(f.symbol,'RESEARCH_READY','PENDING_MANUAL_REVIEW',{researchId:sealed.research.recordId,researchState:'VALIDATED'});

        }catch(e){
          if(controller.signal.aborted)throw e;
          const error=safeError(e),status=stage==='intelligence'||e.message==='INSUFFICIENT_EVIDENCE'?'INSUFFICIENT_EVIDENCE':'DATA_ERROR';
          await evaluate(f.symbol,status,error);result.errors.push({symbol:f.symbol,stage,error});result.rejections.push({symbol:f.symbol,reason:error});emit('Candidate failed',{symbol:f.symbol,status,error});
        }finally{recordResearch(runDiagnostics,f.symbol,{research:researchRecord,records:analystAdapter.records().slice(modelRecordStart),evaluation:controller.signal.aborted?{reason:'RUN_INTERRUPTED_OR_TIMEOUT'}:result.candidateEvaluations.find(c=>c.symbol===f.symbol)});}
      }
      // Research is saved above. Outbox/Delivery remain paused pending manual approval.

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
      for(const entry of result.candidateEvaluations){if(entry.status==='NOT_EVALUATED' && ['AWAITING_JUDGE','AWAITING_ANALYST'].includes(entry.reason))entry.reason=controller.signal.aborted?'RUN_INTERRUPTED_OR_TIMEOUT':'RUN_FAILED_BEFORE_EVALUATION';}
      result.unassessedCandidates=result.candidateEvaluations.filter(c=>c.status==='NOT_EVALUATED');
      if(outbox){const current=outbox.filter(r=>r.runId===runId);result.sent=current.filter(r=>r.delivery.status==='SENT').length;result.dingTalkFailed=current.filter(r=>r.delivery.status==='FAILED').length;result.dingTalkUnknown=current.filter(r=>r.delivery.status==='UNKNOWN').length;result.dingTalkPending=current.filter(r=>r.delivery.status==='PENDING').length;reconcileV2(history,outbox);}
      result.generatedIntelligence=result.generated;result.generatedArticles=result.generated;result.dingTalkSent=result.sent;result.rejectionReasons=result.rejections;
      result.deepseekUsage=[...(analystAdapter?.records().map(r=>({analystVersion:CONTRACT,model:r.model,usage:r.rawResponse?.usage??null,physicalRequests:r.physicalRequests})) || [])];
      const records=analystAdapter?.records()||[];
      const usageKnown=records.every(r=>r.rawResponse?.usage&&['prompt_tokens','completion_tokens','total_tokens'].every(k=>Number.isFinite(r.rawResponse.usage[k])));
      result.analystCost={requests:records.length,physicalRequests:records.reduce((n,r)=>n+(r.physicalRequests||0),0),recoveryRequests:result.analystRecoveryRequests||0,usageStatus:usageKnown?'KNOWN':'UNKNOWN',estimatedTokens:null};
      for(const c of result.deepseekUsage){result.tokenUsage.promptTokens+=c.usage?.prompt_tokens || 0;result.tokenUsage.completionTokens+=c.usage?.completion_tokens || 0;result.tokenUsage.totalTokens+=c.usage?.total_tokens || 0;}
      Object.assign(result.analystCost,{inputTokens:usageKnown?result.tokenUsage.promptTokens:null,outputTokens:usageKnown?result.tokenUsage.completionTokens:null,totalTokens:usageKnown?result.tokenUsage.totalTokens:null});
      try{for(const entry of result.candidateEvaluations)await save(`evaluations/${entry.symbol}.json`,entry);
        if(records.length)await immutableWrite(path.join(v2Dir(config.dataDir),'audit',runId,'model-calls.json'),{contract:CONTRACT,records});
        if(runDiagnostics){try{finishRunDiagnostics(runDiagnostics,result,{now});await save('run-diagnostics.json',runDiagnostics);result.diagnostics={version:runDiagnostics.version,status:'SAVED',counts:runDiagnostics.counts};emit('Run coverage',runDiagnostics.counts);}catch(e){result.diagnostics={status:'WRITE_FAILED',error:safeError(e)};emit('Diagnostics persistence failed',{error:safeError(e)});}}
        await save('deepseek-calls.json',llm?.calls || []);await save('result.json',result);
        history.runs[runId]={contract:CONTRACT,status:result.status,scheduledAt:result.scheduledAt,startedAt:start,finishedAt:result.finishedAt,generated:result.generated,sent:result.sent,lastResearchTime:result.evaluationTime};await atomicWrite(statePath,history);
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
