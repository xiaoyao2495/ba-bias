import {selectOpportunities} from '../src/market/opportunity-selector.js';
import {mockDirectional} from './directional-fixture.js';
// TEST FIXTURE / MOCK CLOCK ONLY. No Binance, DeepSeek or DingTalk network calls.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {EventEmitter} from 'node:events';
import cron from 'node-cron';
import {createScanner,isScheduledAt,hourlyRunId,nextScheduledAt,SCHEDULE,TIMEZONE} from '../src/scan-daemon.js';
import {runResearch,run,saveSkippedRun} from '../src/main.js';
import {config,times,dayKey} from '../src/config.js';
import {lock,atomicWrite,readJson,loadOutbox,emptyHistory,reconcile,compare} from '../src/storage/history.js';
import {deliverNewArticle,deliveryId} from '../src/storage/delivery.js';
import {sendNotification,notification} from '../src/clients/dingtalk.js';
import {Http} from '../src/clients/http.js';
import {buildIntelligence,verifiedFacts} from '../src/intelligence/packet.js';
import {buildFacts} from '../src/market/facts-engine.js';
import {detect} from '../src/market/detector.js';
import {prepareDelivery,drainDeliveryQueue,flushDeliveryQueue,splitMessage,queueEligible,MESSAGE_BYTES,MAX_ATTEMPTS,SPACING_MS} from '../src/storage/delivery-queue.js';
import {terminalLogger} from '../src/logging.js';
import {fixture,identity,symbol,cutoff} from './fixtures.js';
import {endpoints} from '../src/clients/binance.js';
const ms=local=>Date.parse(local+'+08:00');
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
class Clock {
  constructor(start){this.value=start;this.timers=[];this.delays=[];}
  now=()=>this.value;
  sleep=(delay,_,{signal}={})=>new Promise((resolve,reject)=>{
    this.delays.push(delay);if(signal?.aborted){reject(signal.reason);return;}
    const t={time:this.value+delay,resolve:()=>{signal?.removeEventListener('abort',abort);resolve();}};
    const abort=()=>{this.timers=this.timers.filter(x=>x!==t);reject(signal.reason);};
    signal?.addEventListener('abort',abort,{once:true});this.timers.push(t);
  });
  async advance(target){while(true){const t=this.timers.sort((a,b)=>a.time-b.time)[0];if(!t || t.time>target)break;this.timers.shift();this.value=t.time;t.resolve();await flush();}this.value=target;await flush();}
}
function harness(start=ms('2026-10-10T08:59:00'),research=async()=>{},extra={}){
  const clock=new Clock(start),events=[],skips=[],signals=new EventEmitter();let callback,taskOptions;
  const task={started:0,stopped:0,destroyed:0,start(){this.started++;},stop(){this.stopped++;},destroy(){this.destroyed++;},on(){}};
  const scheduler={createTask(expression,cb,options){assert.equal(expression,SCHEDULE);callback=cb;taskOptions=options;return task;}};
  const scanner=createScanner({scheduler,research,deliveryWorker:null,recordSkipped:async x=>skips.push(x),now:clock.now,sleep:clock.sleep,signals,log:(...x)=>events.push(x),write:x=>events.push(['banner',x]),...extra});
  return {clock,events,skips,signals,task,scanner,trigger:date=>callback({date:new Date(date)}),get taskOptions(){return taskOptions;}};
}
async function pipeline({runId='TEST_HOURLY',mode='once',sendEnabled=true,judgeEligible=true,invalidDraft=false,syms=[symbol],transport=async()=>({errcode:0}),options={},before,after,mutateFixture,judgeFailureSymbol,judgePredicate}={}){
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'ba-hourly-'));
  const oldDir=config.dataDir,oldWebhook=config.webhook;config.dataDir=dir;config.webhook='https://example.invalid/robot/send?access_token=TEST_FIXTURE';
  const x=fixture(),events=[];if(mutateFixture)mutateFixture(x);let llmCalls=0,sends=0,apis=0;
  const convert=(raw,s)=>Array.isArray(raw)?raw.map(r=>Array.isArray(r)?r:{...r,symbol:s}):{...raw,symbol:s};
  const binance={http:{},get:async(endpoint,params={})=>{apis++;let raw;const s=params.symbol;
    if(endpoint===endpoints.time)raw={serverTime:x.cutoff};else if(endpoint===endpoints.exchange)raw={symbols:syms.map(s=>({...identity,symbol:s,baseAsset:s.slice(0,-4)})),rateLimits:[]};else if(endpoint===endpoints.ticker)raw=syms.map(s=>convert(x.ticker,s));else if(endpoint===endpoints.premium)raw=syms.map(s=>convert(x.sources.premium.raw,s));else if(endpoint===endpoints.fundingInfo)raw=[];else if(endpoint===endpoints.klines)raw=params.interval==='1h'?x.sources.hour.raw:x.sources.five.raw;else if(endpoint===endpoints.oi)raw=convert(x.sources.oi.raw,s);else if(endpoint===endpoints.funding)raw=convert(x.sources.funding.raw,s);else if(endpoint===endpoints.accounts)raw=convert(x.sources.accounts.raw,s);return {endpoint,params,raw};}};
  const llm={calls:[],json:async(_,input)=>{llmCalls++;if(['DIRECTIONAL_INPUT_V1','STRUCTURED_ANALYST_V4'].includes(input.version))return mockDirectional(input);const f=input.facts;if(!input.judge){if(f.symbol===judgeFailureSymbol)throw Object.assign(Error('TEST_JUDGE_FAILURE'),{code:'TEST_JUDGE_FAILURE'});const eligible=judgePredicate?judgePredicate(f):judgeEligible;return {eligible,storyType:input.comparison.storyType,newsworthinessScore:eligible?80:20,reason:'TEST FIXTURE',keyEvidenceIds:eligible?f.evidence.slice(0,2).map(e=>e.evidenceId):[],risks:[],storyAngle:'TEST FIXTURE'};}const ids=input.allowedEvidenceIds.slice(0,2);return {symbol:f.symbol,storyType:input.judge.storyType,title:'{{symbol}}行情观察',body:`{{${ids[0]}}}。{{${ids[1]}}}。这是值得关注的变化，但后续能否延续仍需要观察，保持谨慎。`,observation:invalidDraft?'上涨99%':'后续价格变化是否延续需要观察。',evidenceIds:ids};}};
  const deliveryHttp={request:async request=>{sends++;return transport(request);}};
  const deps={opportunitySelector:(facts,h)=>selectOpportunities(facts,h,{policy:judgeEligible?config.selector:{...config.selector,minimumFamilies:99,extremeStrength:99}}),binance,llm,deliveryHttp,deliverySpacingMs:0,log:(event,details)=>events.push({event,details})};
  try{if(before)await before(dir);const r=await runResearch({mode,runId,sendEnabled,handleSignals:false,setExitCode:false,...options},deps);
    const box=await loadOutbox(dir),history=await readJson(path.join(dir,'state','history.json'),emptyHistory());
    if(after)await after({r,dir,box,history,deps,fixture:x,get sends(){return sends;},get apis(){return apis;}});
    return {r,box,history,events,sends,llmCalls,apis,lockRemaining:await fs.access(path.join(dir,'state','run.lock')).then(()=>true,()=>false)};
  }finally{config.dataDir=oldDir;config.webhook=oldWebhook;await fs.rm(dir,{recursive:true,force:true});}
}
const record=()=>({runId:'TEST_CURRENT',symbol,storyKey:'TEST_FIXTURE_KEY',generatedAt:100,article:{},approval:{judgeEligible:true,claimGuardPassed:true},delivery:{status:'PENDING',attempts:0},risks:[]});
const ack=()=>({status:'SENT',sent:true,acknowledgement:{errcode:0}});
test('cron explicitly matches Asia/Shanghai 00-23 with exactly 24 daily slots',async()=>{
  const task=cron.createTask(SCHEDULE,()=>{throw Error('NEVER_EXECUTE');},{timezone:TIMEZONE});
  try{let matched=0;for(let h=0;h<24;h++){const t=ms(`2026-10-10T${String(h).padStart(2,'0')}:00:00`);assert.equal(task.match(new Date(t)),true);if(task.match(new Date(t)))matched++;assert.equal(isScheduledAt(t),true);}assert.equal(matched,24);}finally{await task.destroy();}
});
test('23:00 rolls to next day 00:00; early hours use the next hour',()=>{for(const time of ['23:00:00','23:00:10','23:59:59'])assert.equal(times(nextScheduledAt(ms('2026-10-10T'+time))).shanghai,'2026-10-11T00:00:00.000+08:00');assert.equal(times(nextScheduledAt(ms('2026-10-10T04:00:00'))).shanghai,'2026-10-10T05:00:00.000+08:00');});
test('startup at scheduled hour does not scan immediately or catch up',async()=>{let runs=0;const h=harness(ms('2026-10-10T10:00:00'),async()=>runs++);await h.scanner.start();assert.equal(runs,0);assert.equal(h.taskOptions.timezone,TIMEZONE);await h.trigger(ms('2026-10-10T10:00:00'));await h.trigger(ms('2026-10-10T09:00:00'));assert.equal(runs,0);assert.equal(h.clock.timers.length,0);await h.scanner.stop();});
test('non-hourly events never scan',async()=>{let runs=0;const h=harness(ms('2026-10-10T00:00:00'),async()=>runs++);await h.scanner.start();for(const t of ['08:00:01','10:01:00','23:59:00']){h.clock.value=ms('2026-10-10T'+t);await h.trigger(h.clock.value);}assert.equal(runs,0);await h.scanner.stop();});
test('scheduled slot waits 10 seconds, stable hourly runId and enabled notices',async()=>{
  let received,deps;const h=harness(undefined,async(o,d)=>{received=o;deps=d;});await h.scanner.start();const slot=ms('2026-10-10T09:00:00');h.clock.value=slot;const p=h.trigger(slot);await h.clock.advance(slot+9999);assert.equal(received,undefined);await h.clock.advance(slot+10000);await p;
  assert.equal(received.runId,'hourly_20261010_0900');assert.equal(received.scheduledAt,slot);assert.equal(received.mode,'once');assert.equal(received.sendEnabled,true);assert.equal(received.triggerType,'HOURLY');assert.equal(received.handleSignals,false);assert.equal(deps.now,h.clock.now);await h.scanner.stop();
});
test('missed slots do not catch up when process resumes later',async()=>{let runs=0;const h=harness(undefined,async()=>runs++);await h.scanner.start();const slot=ms('2026-10-10T09:00:00');h.clock.value=slot+3600000;await h.trigger(slot);assert.equal(runs,0);assert.equal(h.skips[0].status,'SKIPPED_MISSED');await h.scanner.stop();});
test('same process same scheduled hour executes only once',async()=>{let runs=0;const h=harness(undefined,async()=>runs++);await h.scanner.start();const slot=ms('2026-10-10T09:00:00');h.clock.value=slot;const p=h.trigger(slot);await h.clock.advance(slot+10000);await p;await h.trigger(slot);assert.equal(runs,1);await h.scanner.stop();});
test('overlap is recorded without queueing and next future hour remains usable',async()=>{
  let finish,runs=0;const h=harness(undefined,async()=>{runs++;if(runs===1)await new Promise(r=>finish=r);});await h.scanner.start();const slot=ms('2026-10-10T09:00:00');h.clock.value=slot;const first=h.trigger(slot);await h.clock.advance(slot+10000);h.clock.value=slot+3600000;await h.trigger(h.clock.value);assert.equal(h.skips[0].status,'SKIPPED_OVERLAP');assert.equal(runs,1);finish();await first;
  h.clock.value=slot+7200000;const next=h.trigger(h.clock.value);await h.clock.advance(h.clock.value+10000);await next;assert.equal(runs,2);await h.scanner.stop();
});
test('run failure preserves foreground scheduler for next hour',async()=>{let runs=0;const h=harness(undefined,async()=>{runs++;if(runs===1)throw Object.assign(Error('secret url'),{code:'MOCK_FAIL'});});await h.scanner.start();for(const hour of ['09','10']){const slot=ms(`2026-10-10T${hour}:00:00`);h.clock.value=slot;const p=h.trigger(slot);await h.clock.advance(slot+10000);await p;}assert.equal(runs,2);assert.equal(h.skips[0].status,'FAILED');assert.ok(!JSON.stringify(h.events).includes('secret url'));await h.scanner.stop();});
test('SIGINT stops pending delay, removes listeners and starts no research',async()=>{let runs=0;const h=harness(undefined,async()=>runs++);await h.scanner.start();h.clock.value=ms('2026-10-10T09:00:00');const p=h.trigger(h.clock.value);h.signals.emit('SIGINT');await h.scanner.stop();await p;assert.equal(runs,0);assert.equal(h.clock.timers.length,0);assert.equal(h.signals.listenerCount('SIGINT'),0);assert.equal(h.task.destroyed,1);});
test('SIGTERM aborts active research and waits for persistence before stopping',async()=>{
  let persisted=false;const h=harness(undefined,async options=>{await new Promise(resolve=>options.signal.addEventListener('abort',resolve,{once:true}));await flush();persisted=true;});await h.scanner.start();h.clock.value=ms('2026-10-10T09:00:00');const p=h.trigger(h.clock.value);await h.clock.advance(h.clock.value+10000);h.signals.emit('SIGTERM');await h.scanner.stop();await p;assert.equal(persisted,true);assert.equal(h.scanner.state.running,false);assert.equal(h.task.stopped,1);
});
test('manual and hourly modes share exactly the same research function',()=>{assert.equal(run,runResearch);assert.equal(hourlyRunId(ms('2026-10-10T10:00:00')),'hourly_20261010_1000');assert.equal(hourlyRunId(ms('2026-10-10T08:00:00')),'hourly_20261010_0800');assert.throws(()=>hourlyRunId(ms('2026-10-10T08:00:01')));});
test('new intelligence is saved first, then all DingTalk parts confirmed and counted',async()=>{
  const messages=[];const p=await pipeline({options:{triggerType:'HOURLY',scheduledAt:ms('2026-10-10T10:00:00')},transport:async request=>{messages.push(request.data.text.content);return {errcode:0};}});
  const text=messages.join('');assert.match(text,/检测 · BA-BIAS/);assert.match(text,/检测 · TESTUSDT｜/);assert.match(text,/RunId：TEST_HOURLY/);assert.match(text,/风险：/);
  assert.equal(p.r.generatedIntelligence,1);assert.equal(p.r.dingTalkSent,1);assert.equal(p.sends,p.box[0].delivery.parts.length);assert.equal(p.box[0].delivery.status,'SENT');assert.equal(p.box[0].delivery.acknowledgement.errcode,0);assert.equal(p.box[0].delivery.deliveryId,deliveryId(p.box[0]));assert.equal(p.history.sent,1);assert.ok(p.events.findIndex(e=>e.event==='Outbox saved')<p.events.findIndex(e=>e.event==='DingTalk sent'));assert.equal(p.lockRemaining,false);
});
test('no eligible story saves empty summary and never sends a status message',async()=>{const p=await pipeline({judgeEligible:false});assert.equal(p.sends,0);assert.equal(p.r.generatedArticles,0);assert.equal(p.r.judgedCandidates,0);assert.equal(p.r.eligibleStories,0);assert.ok(p.r.finishedAt>=p.r.startedAt);for(const key of ['scheduledAt','dataCutoff','scannedSymbols','deepResearchedSymbols','factPackagesCount','rejectedArticles','rejectionReasons','dingTalkFailed','tokenUsage','totalDurationMs','errors'])assert.ok(key in p.r,key);});
test('production rejects optional LLM Writer before creating any work',async()=>{await assert.rejects(()=>pipeline({options:{writeDrafts:true}}),/LLM_WRITER_REMOVED_FROM_PRODUCTION/);});
test('manual dry-run and scan-only still never notify',async()=>{const manual=await pipeline({sendEnabled:false});assert.equal(manual.r.generated,1);assert.equal(manual.sends,0);assert.equal(manual.box[0].delivery.status,'SHADOW');const scanOnly=await pipeline({mode:'scan',sendEnabled:false});assert.equal(scanOnly.llmCalls,0);assert.equal(scanOnly.sends,0);});
test('restart sees completed runId and never repeats API or notification',async()=>{await pipeline({after:async p=>{const api=p.apis,sends=p.sends;const repeated=await runResearch({mode:'once',runId:'TEST_HOURLY',sendEnabled:true,handleSignals:false},p.deps);assert.equal(repeated.status,'COMPLETE');assert.equal(p.apis,api);assert.equal(p.sends,sends);}});});
test('HTTP 200 with nonzero errcode is FAILED, never SENT',async()=>{const p=await pipeline({transport:async()=>({errcode:310000,errmsg:'TEST FIXTURE'})});assert.equal(p.sends,1);assert.equal(p.box[0].delivery.status,'FAILED');assert.equal(p.r.dingTalkFailed,1);assert.equal(p.r.sent,0);assert.equal(p.box[0].delivery.businessCode,310000);});
test('network timeout is UNKNOWN and receives no retry',async()=>{const p=await pipeline({transport:async()=>{throw Object.assign(Error('sensitive webhook'),{code:'ECONNABORTED'});}});assert.equal(p.sends,1);assert.equal(p.box[0].delivery.status,'UNKNOWN');assert.equal(p.r.dingTalkUnknown,1);assert.equal(p.r.sent,0);assert.ok(!JSON.stringify(p.box).includes('sensitive webhook'));});
test('explicit rejection permits at most two attempts; no infinite retry',async()=>{const r=record(),states=[];let calls=0;const response=await deliverNewArticle(r,{}, {send:true,runId:r.runId,persist:async x=>states.push(x.delivery.status),notifier:async()=>{calls++;throw Object.assign(Error('TEST'),{httpStatus:429});},sleep:async()=>{},now:()=>100});assert.equal(calls,2);assert.equal(response.status,'FAILED');assert.equal(response.attempts,2);assert.deepEqual(states,['PENDING','SENDING','FAILED','SENDING','FAILED']);});
test('confirmed SENT and ambiguous UNKNOWN/SENDING cannot resend',async()=>{for(const status of ['SENT','UNKNOWN','SENDING']){const r=record();r.delivery.status=status;let calls=0;await deliverNewArticle(r,{}, {send:true,runId:r.runId,persist:async()=>{},notifier:async()=>{calls++;return ack();}});assert.equal(calls,0);}});
test('concurrent same article dispatch reserves single deliveryId',async()=>{const r=record();let calls=0,finish;const options={send:true,runId:r.runId,persist:async()=>{},notifier:async()=>{calls++;await new Promise(resolve=>finish=resolve);return ack();}};const first=deliverNewArticle(r,{},options);await flush();await deliverNewArticle(r,{},options);finish();await first;assert.equal(calls,1);});
test('old Outbox, wrong runId or missing approval cannot dispatch',async()=>{for(const change of ['old','wrong','approval','shadow']){const r=record();if(change==='old')r.generatedAt=1;if(change==='wrong')r.runId='TEST_OLD';if(change==='approval')r.approval.claimGuardPassed=false;if(change==='shadow')r.delivery.status='SHADOW';let calls=0;await deliverNewArticle(r,{}, {send:true,runId:'TEST_CURRENT',minimumGeneratedAt:50,persist:async()=>{},notifier:async()=>{calls++;return ack();}});assert.equal(calls,0,change);}});
test('crash during SENDING recovers UNKNOWN without sending old articles',async()=>{const dir=await fs.mkdtemp(path.join(os.tmpdir(),'ba-delivery-'));try{const r=record();r.delivery={status:'SENDING',deliveryId:deliveryId(r),attempts:1};await atomicWrite(path.join(dir,'outbox','TEST.json'),r);const loaded=await loadOutbox(dir);assert.equal(loaded[0].delivery.status,'UNKNOWN');assert.equal((await readJson(path.join(dir,'outbox','TEST.json'))).delivery.status,'UNKNOWN');}finally{await fs.rm(dir,{recursive:true,force:true});}});
test('dead PID and stale lease recover automatically and parallel winner stays exclusive',async()=>{const dir=await fs.mkdtemp(path.join(os.tmpdir(),'ba-lock-recovery-'));try{const state=path.join(dir,'state');await fs.mkdir(state,{recursive:true});await atomicWrite(path.join(state,'run.lock'),{pid:2147483647,started:1,token:'TEST_OLD'});await fs.mkdir(path.join(state,'run.lease'));await fs.utimes(path.join(state,'run.lease'),new Date(0),new Date(0));const recovered=await Promise.allSettled([lock(dir),lock(dir)]);assert.equal(recovered.filter(r=>r.status==='fulfilled').length,1);await recovered.find(r=>r.status==='fulfilled').value();assert.equal(await fs.access(path.join(state,'run.lock')).then(()=>true,()=>false),false);}finally{await fs.rm(dir,{recursive:true,force:true});}});
test('active owner cannot be stolen and a released lock can be acquired again',async()=>{const dir=await fs.mkdtemp(path.join(os.tmpdir(),'ba-lock-live-'));try{const release=await lock(dir);await assert.rejects(lock(dir),/RUN_ALREADY_LOCKED/);await release();const next=await lock(dir);await next();}finally{await fs.rm(dir,{recursive:true,force:true});}});
test('scheduled overlap summaries persist and cannot overwrite completed run',async()=>{const dir=await fs.mkdtemp(path.join(os.tmpdir(),'ba-skip-'));try{const runId='hourly_20261010_1000',scheduledAt=ms('2026-10-10T10:00:00');await saveSkippedRun({runId,scheduledAt,status:'SKIPPED_OVERLAP',dataDir:dir,now:()=>scheduledAt});const file=path.join(dir,'runs',runId,'result.json');assert.equal((await readJson(file)).status,'SKIPPED_OVERLAP');await atomicWrite(file,{runId,status:'COMPLETE'});await saveSkippedRun({runId,scheduledAt,status:'SKIPPED_OVERLAP',dataDir:dir});assert.equal((await readJson(file)).status,'COMPLETE');}finally{await fs.rm(dir,{recursive:true,force:true});}});
test('hourly pipeline outputs all three and keeps independent daily sent counts',async()=>{const p=await pipeline({syms:['ALPHAUSDT','BETAUSDT','GAMMAUSDT']});assert.equal(p.r.generated,3);assert.equal(p.r.judgedCandidates,0);assert.equal(p.r.sent,3);const day=dayKey(p.box[0].generatedAt);assert.equal(p.history.daily[day].generated,3);assert.equal(p.history.daily[day].sent,3);});
test('DingTalk keyword mode sends the original webhook without signature parameters',async()=>{const old=config.webhook;config.webhook='https://example.invalid/send?access_token=TEST';try{let request;await sendNotification({symbol:'TEST',storyType:'PRICE',title:'TEST',body:'TEST',evidenceIds:[],observation:'TEST'},{runId:'TEST',evaluationTime:{ms:Date.now()},evidence:[]},{send:true,http:{request:async r=>{request=r;return {errcode:0};}}});assert.equal(request.url,config.webhook);assert.equal(request.data.msgtype,'text');assert.ok(request.data.text.content.includes('检测'));assert.equal(new URL(request.url).searchParams.has('sign'),false);assert.equal(new URL(request.url).searchParams.has('timestamp'),false);}finally{config.webhook=old;}});
test('logs show Shanghai clock and omit secret fields',()=>{const lines=[];const log=terminalLogger({now:()=>ms('2026-10-10T10:00:00'),write:x=>lines.push(x)});log('TEST',{count:3,webhook:'TEST_SECRET',secret:'TEST_SECRET',key:'TEST_SECRET',url:'TEST_SECRET'});assert.equal(lines[0],'[10:00:00] TEST count=3');});

test('concurrent skipped writes preserve an existing complete run atomically',async()=>{const dir=await fs.mkdtemp(path.join(os.tmpdir(),'ba-skip-race-'));try{const file=path.join(dir,'runs','TEST_RACE','result.json');await Promise.all([saveSkippedRun({runId:'TEST_RACE',scheduledAt:1,status:'SKIPPED_OVERLAP',dataDir:dir}),atomicWrite(file,{status:'COMPLETE'})]);assert.equal((await readJson(file)).status,'COMPLETE');}finally{await fs.rm(dir,{recursive:true,force:true});}});
test('stopping during close delay records interrupted slot without research',async()=>{let runs=0;const h=harness(undefined,async()=>runs++);await h.scanner.start();const slot=ms('2026-10-10T09:00:00');h.clock.value=slot;const p=h.trigger(slot);await h.scanner.stop();await p;assert.equal(runs,0);assert.equal(h.skips[0].status,'INTERRUPTED');});
test('scheduler start failure cleans up tasks and signal handlers',async()=>{const h=harness();h.task.start=async()=>{throw Error('TEST_START_FAILURE');};await assert.rejects(h.scanner.start(),/TEST_START_FAILURE/);assert.equal(h.task.destroyed,1);assert.equal(h.signals.listenerCount('SIGINT'),0);assert.equal(h.signals.listenerCount('SIGTERM'),0);});

test('seven qualified candidates are all scored, only top three researched',async()=>{
  const syms=['ALPHAUSDT','BETAUSDT','GAMMAUSDT','DELTAUSDT','EPSILONUSDT','ZETAUSDT','KAIAUSDT'];
  const p=await pipeline({syms});assert.equal(p.r.judgedCandidates,0);assert.equal(p.llmCalls,3);assert.equal(p.box.length,3);assert.equal(p.r.sent,3);
  assert.equal(p.r.candidateEvaluations.filter(c=>c.status==='ELIGIBLE').length,3);assert.equal(p.r.candidateEvaluations.filter(c=>c.status==='QUALIFIED_BUT_NOT_SELECTED').length,4);assert.equal(p.r.unassessedCandidates.length,0);
  assert.ok(p.r.candidateEvaluations.find(r=>r.symbol==='KAIAUSDT')); assert.ok(p.box.every(r=>r.delivery.parts.every(part=>part.status==='SENT')));
});
test('existing daily thirty entries do not block selected research',async()=>{
  const p=await pipeline({syms:['ALPHAUSDT','BETAUSDT','GAMMAUSDT','DELTAUSDT','EPSILONUSDT','ZETAUSDT','ETAUSDT'],before:async dir=>{
    for(let i=0;i<31;i++)await atomicWrite(path.join(dir,'outbox',`TEST_OLD_${i}.json`),{runId:'TEST_OLD',symbol:'OLDUSDT',storyKey:'TEST_FIXTURE',generatedAt:Date.now(),evaluationTime:cutoff,summary:{},delivery:{status:'SENT'}});
  }});assert.equal(p.r.judgedCandidates,0);assert.equal(p.r.generated,3);assert.equal(p.r.sent,3);const counts=p.history.daily[dayKey(p.box.at(-1).generatedAt)];assert.equal(counts.generated,34);assert.equal(counts.sent,34);
});
test('duplicate receives explicit terminal state and no second intelligence notification',async()=>{
  await pipeline({after:async p=>{const before=p.sends;const r=await runResearch({mode:'once',runId:'TEST_DUP',sendEnabled:true,handleSignals:false,setExitCode:false},p.deps);
    assert.equal(r.judgedCandidates,0);assert.equal(r.generated,0);assert.equal(r.candidateEvaluations[0].status,'NO_MATERIAL_UPDATE');assert.equal(r.candidateEvaluations[0].reason,'NO_MATERIAL_CHANGE');assert.equal(p.sends,before);
  }});
});
test('material price update is judged, persisted with comparison and sent again with new deliveryId',async()=>{
  await pipeline({after:async p=>{const firstId=p.box[0].delivery.deliveryId;p.fixture.cutoff+=1000;p.fixture.ticker.lastPrice='150';p.fixture.ticker.priceChangePercent='50';
    const r=await runResearch({mode:'once',runId:'TEST_UPDATE',sendEnabled:true,handleSignals:false,setExitCode:false},p.deps);
    assert.equal(r.generated,1);assert.equal(r.sent,1);assert.equal(r.candidateEvaluations[0].status,'MATERIAL_UPDATE');
    const box=await loadOutbox(p.dir),updated=box.find(x=>x.runId==='TEST_UPDATE');assert.notEqual(updated.delivery.deliveryId,firstId);assert.equal(updated.intelligence.whatChanged.previousRunId,'TEST_HOURLY');assert.ok(updated.intelligence.whatChanged.changes.some(c=>c.metric==='price'));assert.equal(updated.intelligence.storyType,'MATERIAL_UPDATE');
  }});
});
test('failure of one intelligence delivery does not lose any later intelligence',async()=>{
  const p=await pipeline({syms:['ALPHAUSDT','BETAUSDT','GAMMAUSDT'],transport:async request=>request.data.text.content.includes('/ ALPHAUSDT')?{errcode:310000,errmsg:'TEST rejection'}:{errcode:0}});
  assert.equal(p.r.generated,3);assert.equal(p.r.sent,2);assert.equal(p.box.find(r=>r.symbol==='ALPHAUSDT').delivery.status,'FAILED');assert.ok(p.box.filter(r=>r.symbol!=='ALPHAUSDT').every(r=>r.delivery.status==='SENT'));
});
test('removed Judge failure injection is never called and cannot block candidates',async()=>{const p=await pipeline({syms:['ALPHAUSDT','BETAUSDT','GAMMAUSDT'],judgeFailureSymbol:'ALPHAUSDT'});assert.equal(p.r.judgedCandidates,0);assert.equal(p.r.generated,3);assert(!p.r.candidateEvaluations.some(c=>c.status==='JUDGE_FAILED'));});
test('interrupted evaluation lists unfinished candidates without claiming not-newsworthy',async()=>{
  const controller=new AbortController();await pipeline({syms:['ALPHAUSDT','BETAUSDT','GAMMAUSDT'],options:{signal:controller.signal},before:async()=>{},after:async p=>{
    p.fixture.cutoff+=1000;p.fixture.ticker.lastPrice='170';p.fixture.ticker.priceChangePercent='70';const original=p.deps.llm.json;p.deps.llm.json=async(system,input)=>{controller.abort(Error('TEST_ABORT'));return original(system,input);};
    const r=await runResearch({mode:'once',runId:'TEST_INTERRUPTED',sendEnabled:false,signal:controller.signal,handleSignals:false,setExitCode:false},p.deps);
    assert.equal(r.status,'INTERRUPTED');assert.ok(r.unassessedCandidates.length>0);assert.ok(r.unassessedCandidates.every(c=>c.status==='NOT_EVALUATED'&&c.reason==='RUN_INTERRUPTED_OR_TIMEOUT'));
    assert.ok(r.candidateEvaluations.every(c=>c.status!=='NOT_NEWSWORTHY'));
  }});
});
test('intelligence uses rebuilt facts and never asserts unvalidated Judge narrative',()=>{
  const f=detect(buildFacts(fixture())),j={eligible:true,storyType:'NEW_STORY',newsworthinessScore:80,keyEvidenceIds:f.evidence.slice(0,2).map(e=>e.evidenceId),reason:'主力保证上涨',storyAngle:'确定资金净流入'};
  const {packet}=buildIntelligence(f,j,compare(f));assert.equal(packet.guard.evidenceRebuilt,true);assert.ok(!JSON.stringify(packet).includes('主力保证上涨'));assert.ok(!JSON.stringify(packet).includes('确定资金净流入'));
  f.evidence[0].phrase='伪造事实';const built=buildIntelligence(f,j,compare(f));assert.ok(!JSON.stringify(built.packet).includes('伪造事实'));assert.throws(()=>verifiedFacts({...f,sources:{...f.sources,oi:{...f.sources.oi,raw:[]}}}),/INSUFFICIENT_EVIDENCE/);
});
function queuedRecord(){
  const f=detect(buildFacts(fixture())),j={storyType:'NEW_STORY',newsworthinessScore:80,keyEvidenceIds:f.evidence.slice(0,2).map(e=>e.evidenceId)};
  const {packet,article}=buildIntelligence(f,j,compare(f));const r={runId:'TEST_QUEUE',symbol,storyKey:'TEST_FIXTURE',generatedAt:cutoff,intelligence:packet,article,approval:{judgeEligible:true,intelligenceGuardPassed:true},delivery:{status:'PENDING',sent:false}};r.delivery=prepareDelivery(r);
  // Explicit persisted multipart fixture: ordinary compact messages now fit one part.
  r.delivery.parts=splitMessage('既有长消息快照🙂'.repeat(500),{id:r.delivery.deliveryId,symbol}).map((content,i)=>({deliveryId:r.delivery.deliveryId+'_part_'+(i+1),content,status:'PENDING',attempts:0,nextAttemptAt:0}));return r;
}
async function queueFixture(work){const dir=await fs.mkdtemp(path.join(os.tmpdir(),'ba-queue-'));try{await work(dir);}finally{await fs.rm(dir,{recursive:true,force:true});}}
test('long Unicode messages split without losing text or exceeding UTF-8 budget',()=>{
  const original='情报🙂'.repeat(2000),parts=splitMessage(original,{id:'TEST',symbol:'TESTUSDT'});assert.ok(parts.length>2);assert.ok(parts.every(p=>Buffer.byteLength(p)<=MESSAGE_BYTES&&p.includes('检测')));
  assert.equal(parts.map(p=>p.split('\n').slice(3).join('\n')).join(''),original);
});
test('per-message pacing persists across worker restarts',async()=>queueFixture(async dir=>{
  const r=queuedRecord();let current=cutoff;const stamps=[];const deps={dataDir:dir,now:()=>current,sleep:async delay=>{current+=delay;},sender:async()=>{stamps.push(current);return ack();},persist:x=>atomicWrite(path.join(dir,'outbox','TEST_QUEUE_TESTUSDT.json'),x)};
  await drainDeliveryQueue([r],deps);assert.ok(stamps.length>1);for(let i=1;i<stamps.length;i++)assert.ok(stamps[i]-stamps[i-1]>=SPACING_MS);
  const next=queuedRecord();next.runId='TEST_NEXT';next.delivery=prepareDelivery(next);await drainDeliveryQueue([next],deps);assert.ok(stamps.at(-1)-stamps.at(-2)>=SPACING_MS);
}));
test('429 keeps durable PENDING with cooldown and resumes after restart without resending SENT parts',async()=>queueFixture(async dir=>{
  let current=cutoff,calls=0;const r=queuedRecord();const file=path.join(dir,'outbox','TEST_QUEUE_TESTUSDT.json');await atomicWrite(file,r);
  const deps={dataDir:dir,now:()=>current,sleep:async ms=>{current+=ms;},sender:async()=>{calls++;if(calls===2)throw Object.assign(Error('TEST_RATE_LIMIT'),{httpStatus:429});return ack();}};
  await drainDeliveryQueue([r],deps);assert.equal(r.delivery.status,'PENDING');assert.equal(r.delivery.parts[0].status,'SENT');assert.equal(r.delivery.parts[1].status,'FAILED');assert.ok(r.delivery.parts[1].nextAttemptAt>=cutoff+600000);
  const count=calls;await drainDeliveryQueue([r],deps);assert.equal(calls,count);
  current+=600000;const loaded=await loadOutbox(dir);await flushDeliveryQueue({dataDir:dir,now:()=>current}, {...deps});
  const done=await readJson(file);assert.equal(done.delivery.status,'SENT');assert.equal(done.delivery.parts[0].attempts,1);const final=calls;await drainDeliveryQueue(await loadOutbox(dir),deps);assert.equal(calls,final);
}));
test('unknown multipart delivery never blindly resends and full unsent content remains',async()=>queueFixture(async dir=>{
  const r=queuedRecord();let calls=0;const deps={dataDir:dir,spacingMs:0,sender:async()=>{calls++;throw Object.assign(Error('TEST_TIMEOUT'),{code:'ECONNABORTED'});}};
  await drainDeliveryQueue([r],deps);assert.equal(r.delivery.status,'UNKNOWN');const loaded=await loadOutbox(dir);await drainDeliveryQueue(loaded,deps);assert.equal(calls,1);assert.ok(loaded[0].delivery.parts.slice(1).every(p=>p.status==='PENDING'&&p.content));
}));
test('queue cancellation leaves pending intelligence for a later worker',async()=>queueFixture(async dir=>{
  const r=queuedRecord(),controller=new AbortController();await atomicWrite(path.join(dir,'outbox','TEST_QUEUE_TESTUSDT.json'),r);controller.abort();let calls=0;
  await drainDeliveryQueue([r],{dataDir:dir,signal:controller.signal,sender:async()=>{calls++;return ack();}});assert.equal(calls,0);assert.equal(r.delivery.status,'PENDING');
  await drainDeliveryQueue([r],{dataDir:dir,spacingMs:0,sender:async()=>{calls++;return ack();}});assert.equal(r.delivery.status,'SENT');
}));
test('transient retry attempts are finite per part and retained after exhaustion',async()=>queueFixture(async dir=>{
  const r=queuedRecord();let current=cutoff,calls=0;const deps={dataDir:dir,now:()=>current,sleep:async delay=>{current+=delay;},sender:async()=>{calls++;throw Object.assign(Error('TEST_REFUSED'),{code:'ECONNREFUSED'});}};
  for(let i=0;i<r.delivery.parts.length*MAX_ATTEMPTS+2;i++){current+=600000;await drainDeliveryQueue([r],deps);}
  assert.equal(calls,r.delivery.parts.length*MAX_ATTEMPTS);assert.ok(r.delivery.parts.every(p=>p.attempts===MAX_ATTEMPTS));assert.equal(queueEligible(r),false);assert.equal(r.delivery.status,'FAILED');
}));
test('queue recovery turns only uncertain sending parts UNKNOWN; excludes legacy/dry-run records',async()=>queueFixture(async dir=>{
  const r=queuedRecord();r.delivery.status='SENDING';r.delivery.parts[0].status='SENT';r.delivery.parts[1].status='SENDING';await atomicWrite(path.join(dir,'outbox','TEST_QUEUE_TESTUSDT.json'),r);
  const loaded=(await loadOutbox(dir))[0];assert.equal(loaded.delivery.status,'UNKNOWN');assert.equal(loaded.delivery.parts[0].status,'SENT');assert.equal(loaded.delivery.parts[1].status,'UNKNOWN');assert.equal(queueEligible(loaded),false);
  assert.equal(queueEligible({...queuedRecord(),intelligence:undefined}),false);const dry=queuedRecord();dry.delivery.status='SHADOW';assert.equal(queueEligible(dry),false);
}));

test('scheduled research cancels and awaits queue worker before requesting research lock',async()=>{
  let tick,workerStopped=false,researchStarted=false;const h=harness(undefined,async()=>{assert.equal(workerStopped,true);researchStarted=true;},{
    scheduleQueuePoll:callback=>{tick=callback;return {};},cancelQueuePoll:()=>{},deliveryWorker:async({signal})=>{await new Promise(resolve=>signal.addEventListener('abort',resolve,{once:true}));workerStopped=true;}
  });await h.scanner.start();tick();await flush();const slot=ms('2026-10-10T09:00:00');h.clock.value=slot;const p=h.trigger(slot);await flush();await h.clock.advance(slot+10000);await p;assert.equal(researchStarted,true);await h.scanner.stop();
});
test('SIGTERM aborts delivery worker and waits for its persistence',async()=>{
  let tick,cleared=false,persisted=false;const h=harness(undefined,async()=>{}, {scheduleQueuePoll:callback=>{tick=callback;return {};},cancelQueuePoll:()=>{cleared=true;},deliveryWorker:async({signal})=>{await new Promise(resolve=>signal.addEventListener('abort',resolve,{once:true}));await flush();persisted=true;}});
  await h.scanner.start();tick();await flush();h.signals.emit('SIGTERM');await h.scanner.stop();assert.equal(cleared,true);assert.equal(persisted,true);
});
test('concurrent queue workers use the shared exclusive run lock',async()=>queueFixture(async dir=>{
  const r=queuedRecord();await atomicWrite(path.join(dir,'outbox','TEST_QUEUE_TESTUSDT.json'),r);let entered,release;const started=new Promise(resolve=>entered=resolve),gate=new Promise(resolve=>release=resolve);let calls=0;
  const deps={spacingMs:0,sender:async()=>{calls++;entered();await gate;return ack();}};
  const first=flushDeliveryQueue({dataDir:dir},deps);await started;const second=await flushDeliveryQueue({dataDir:dir},deps);assert.equal(second.busy,true);release();await first;assert.equal(calls,r.delivery.parts.length);assert.equal((await readJson(path.join(dir,'outbox','TEST_QUEUE_TESTUSDT.json'))).delivery.status,'SENT');
}));
test('DingTalk business frequency rejection is persisted for cooldown instead of UNKNOWN',async()=>queueFixture(async dir=>{
  for(const message of ['机器人发送频率超过限制','send too fast','message frequency too high']){
    await fs.rm(path.join(dir,'state','dingtalk-rate.json'),{force:true});
    const r=queuedRecord();let current=cutoff;await drainDeliveryQueue([r],{dataDir:dir,now:()=>current,spacingMs:0,http:{request:async()=>({errcode:130101,errmsg:message})}});
    assert.equal(r.delivery.status,'PENDING');assert.equal(r.delivery.parts[0].businessCode,130101);assert.equal(r.delivery.parts[0].retryable,true);assert.ok(r.delivery.parts[0].nextAttemptAt>=current+600000);
  }
}));
test('incomplete deep facts get a persisted evidence terminal state without calling Judge',async()=>{
  const p=await pipeline({mutateFixture:x=>{x.sources.oi.raw=[];}});assert.equal(p.r.judgedCandidates,0);assert.equal(p.r.generated,0);assert.equal(p.sends,0);assert.equal(p.r.candidateEvaluations[0].status,'INSUFFICIENT_EVIDENCE');assert.ok(p.r.candidateEvaluations[0].reason);
});

test('nineteen candidates are all scored and only top three are researched',async()=>{
  const syms=Array.from({length:19},(_,i)=>`NEWS${i}USDT`),accepted=new Set(syms.slice(0,7));const p=await pipeline({syms,judgePredicate:f=>accepted.has(f.symbol)});
  assert.equal(p.r.judgedCandidates,0);assert.equal(p.llmCalls,3);assert.equal(p.r.generated,3);assert.equal(p.r.sent,3);assert.equal(p.r.candidateEvaluations.filter(c=>c.status==='QUALIFIED_BUT_NOT_SELECTED').length,16);assert.equal(p.r.unassessedCandidates.length,0);
});
test('two same-day rounds each respect top three and independent identities',async()=>{
  const syms=Array.from({length:19},(_,i)=>`FIRST${i}USDT`);await pipeline({syms,after:async p=>{
    assert.equal(p.r.generated,3);assert.equal(p.r.sent,3);syms.splice(0,syms.length,...Array.from({length:19},(_,i)=>`NEXT${i}USDT`));
    const second=await runResearch({mode:'once',runId:'TEST_SAME_DAY_NEXT',sendEnabled:true,handleSignals:false,setExitCode:false},p.deps);assert.equal(second.judgedCandidates,0);assert.equal(second.generated,3);assert.equal(second.sent,3);
    const box=await loadOutbox(p.dir),history=await readJson(path.join(p.dir,'state','history.json'));assert.equal(box.length,6);assert.equal(history.daily[dayKey(box[0].generatedAt)].generated,6);assert.equal(history.daily[dayKey(box[0].generatedAt)].sent,6);
  }});
});

test('dry-run archives do not suppress a fresh real-mode intelligence notification or resend the archived record',async()=>{
  await pipeline({sendEnabled:false,after:async p=>{
    assert.equal(p.box[0].delivery.status,'SHADOW');assert.equal(p.sends,0);
    const r=await runResearch({mode:'once',runId:'TEST_FIRST_ENABLED',sendEnabled:true,handleSignals:false,setExitCode:false},p.deps);assert.equal(r.generated,1);assert.equal(r.sent,1);
    const box=await loadOutbox(p.dir);assert.equal(box.find(r=>r.runId==='TEST_HOURLY').delivery.status,'SHADOW');assert.equal(box.find(r=>r.runId==='TEST_FIRST_ENABLED').delivery.status,'SENT');
  }});
});

test('crash recovery preserves completed evaluations and explicitly identifies unfinished candidates',async()=>{
  await pipeline({runId:'TEST_CRASH',before:async dir=>{
    const history=emptyHistory();history.runs.TEST_CRASH={status:'RUNNING',startedAt:cutoff};await atomicWrite(path.join(dir,'state','history.json'),history);
    await atomicWrite(path.join(dir,'runs','TEST_CRASH','result.json'),{runId:'TEST_CRASH',mode:'once',status:'RUNNING',candidateEvaluations:[{symbol:'ALPHAUSDT',status:'JUDGE_FAILED',reason:'TEST_SCHEMA_ERROR'},{symbol:'BETAUSDT',status:'NOT_EVALUATED',reason:'AWAITING_JUDGE'}],errors:[]});
  },after:async p=>{
    const r=await readJson(path.join(p.dir,'runs','TEST_CRASH','result.json'));assert.equal(r.status,'INTERRUPTED');assert.equal(r.candidateEvaluations[0].status,'JUDGE_FAILED');assert.equal(r.unassessedCandidates[0].symbol,'BETAUSDT');assert.equal(r.unassessedCandidates[0].reason,'PROCESS_CRASH_BEFORE_EVALUATION_COMPLETED');assert.equal(p.apis,0);assert.equal(p.sends,0);
  }});
});

test('recovery does not downgrade a completed summary when history commit was interrupted',async()=>{
  await pipeline({sendEnabled:false,after:async p=>{
    const file=path.join(p.dir,'state','history.json'),history=await readJson(file);history.runs.TEST_HOURLY.status='RUNNING';await atomicWrite(file,history);
    const before=p.apis;const r=await runResearch({mode:'once',runId:'TEST_HOURLY',sendEnabled:false,handleSignals:false},p.deps);assert.equal(r.status,'COMPLETE');assert.equal(p.apis,before);assert.equal((await readJson(path.join(p.dir,'runs','TEST_HOURLY','result.json'))).status,'COMPLETE');
  }});
});

// 24H schedule acceptance: Fake Clock, injected research, no external requests.
for(const hour of ['00','01','08','09','23'])test(`24H ${hour}:00 uses Shanghai hour and original runId`,async()=>{
 const slot=ms(`2026-10-12T${hour}:00:00`),calls=[];const h=harness(slot-60000,async o=>calls.push(o));
 await h.scanner.start();try{assert.equal(calls.length,0);h.clock.value=slot;const pending=h.trigger(slot);await h.clock.advance(slot+9999);assert.equal(calls.length,0);await h.clock.advance(slot+10000);await pending;assert.equal(calls.length,1);assert.equal(calls[0].runId,`hourly_20261012_${hour}00`);assert.equal(calls[0].scheduledAt,slot);await h.trigger(slot);assert.equal(calls.length,1);}finally{await h.scanner.stop();}
});
test('24H full day has exactly 24 unique executions, no extra 25th from duplicate events',async()=>{
 const midnight=ms('2026-10-12T00:00:00'),calls=[],h=harness(midnight-1000,async o=>calls.push(o));await h.scanner.start();
 try{for(let hour=0;hour<24;hour++){const slot=midnight+hour*3600000;h.clock.value=slot;const p=h.trigger(slot);await h.clock.advance(slot+10000);await p;await h.trigger(slot);}assert.equal(calls.length,24);assert.equal(new Set(calls.map(c=>c.runId)).size,24);assert.equal(calls.at(-1).runId,'hourly_20261012_2300');assert.equal(h.skips.length,0);h.clock.value=midnight+86400000;assert.equal(calls.length,24);assert.equal(nextScheduledAt(midnight+86399999),midnight+86400000);}finally{await h.scanner.stop();}
});
test('24H 23:00 then next midnight preserves date-specific run identity',async()=>{
 const slot=ms('2026-10-12T23:00:00'),calls=[],h=harness(slot-1000,async o=>calls.push(o.runId));await h.scanner.start();
 try{for(const t of [slot,slot+3600000]){h.clock.value=t;const p=h.trigger(t);await h.clock.advance(t+10000);await p;}assert.deepEqual(calls,['hourly_20261012_2300','hourly_20261013_0000']);}finally{await h.scanner.stop();}
});
test('24H 23:59:59 startup waits for midnight; never runs an extra startup scan',async()=>{
 const slot=ms('2026-10-13T00:00:00'),calls=[],h=harness(slot-1000,async o=>calls.push(o.runId));await h.scanner.start();
 try{assert.equal(calls.length,0);assert.equal(nextScheduledAt(h.clock.value),slot);await h.trigger(slot-3600000);assert.equal(calls.length,0);h.clock.value=slot;const p=h.trigger(slot);await h.clock.advance(slot+10000);await p;assert.deepEqual(calls,['hourly_20261013_0000']);}finally{await h.scanner.stop();}
});
test('24H non-hour startup at 00:17 does not backfill newly enabled night hours',async()=>{
 const start=ms('2026-10-12T00:17:00'),calls=[],h=harness(start,async o=>calls.push(o));await h.scanner.start();
 try{for(const t of [ms('2026-10-11T23:00:00'),ms('2026-10-12T00:00:00')])await h.trigger(t);assert.equal(calls.length,0);assert.equal(h.skips.length,0);assert.equal(nextScheduledAt(start),ms('2026-10-12T01:00:00'));}finally{await h.scanner.stop();}
});
test('24H start is idempotent: only one cron task registered per Scanner instance',async()=>{const h=harness();await h.scanner.start();try{await h.scanner.start();assert.equal(h.task.started,1);assert.equal(h.signals.listenerCount('SIGINT'),1);assert.equal(h.taskOptions.timezone,'Asia/Shanghai');assert.ok(h.events.some(([k,v])=>k==='banner'&&v.includes('Schedule: 0 * * * *')));}finally{await h.scanner.stop();}});
test('24H long 23:00 run skips midnight overlap and resumes next future hour',async()=>{
 const slot=ms('2026-10-12T23:00:00'),calls=[];let finish;const h=harness(slot-1000,async o=>{calls.push(o.runId);if(calls.length===1)await new Promise(r=>finish=r);});await h.scanner.start();
 try{h.clock.value=slot;const first=h.trigger(slot);await h.clock.advance(slot+10000);h.clock.value=slot+3600000;await h.trigger(h.clock.value);assert.equal(calls.length,1);assert.equal(h.skips[0].status,'SKIPPED_OVERLAP');assert.equal(h.skips[0].runId,'hourly_20261013_0000');finish();await first;h.clock.value=slot+7200000;const next=h.trigger(h.clock.value);await h.clock.advance(h.clock.value+10000);await next;assert.deepEqual(calls,['hourly_20261012_2300','hourly_20261013_0100']);}finally{finish?.();await h.scanner.stop();}
});
for(const delay of [59999,60000])test(`24H missed boundary unchanged at ${delay}ms`,async()=>{
 const slot=ms('2026-10-12T00:00:00'),calls=[],h=harness(slot-1000,async o=>calls.push(o));await h.scanner.start();
 try{h.clock.value=slot+delay;const p=h.trigger(slot);await h.clock.advance(slot+delay);await p;assert.equal(calls.length,delay<60000?1:0);assert.equal(h.skips.length,delay<60000?0:1);if(delay===60000)assert.equal(h.skips[0].status,'SKIPPED_MISSED');}finally{await h.scanner.stop();}
});
test('24H suspension during close delay still skips late run instead of catching up',async()=>{
 const slot=ms('2026-10-12T00:00:00');let calls=0;const h=harness(slot-1000,async()=>calls++);await h.scanner.start();
 try{h.clock.value=slot;const p=h.trigger(slot);h.clock.value=slot+60000;h.clock.timers.shift().resolve();await flush();await p;assert.equal(calls,0);assert.equal(h.skips[0].status,'SKIPPED_MISSED');}finally{await h.scanner.stop();}
});
for(const zone of ['America/Los_Angeles','Pacific/Honolulu','UTC'])test(`24H OS timezone ${zone} cannot alter Shanghai schedule`,()=>{
 const code=`import assert from 'node:assert/strict';import cron from 'node-cron';import {SCHEDULE,TIMEZONE,hourlyRunId,nextScheduledAt} from './src/scan-daemon.js';const t=Date.parse('2026-10-11T16:00:00Z');const task=cron.createTask(SCHEDULE,()=>{throw Error('NO_REAL_RUN');},{timezone:TIMEZONE});assert.equal(TIMEZONE,'Asia/Shanghai');assert.equal(task.match(new Date(t)),true);assert.equal(task.match(new Date(t+1000)),false);assert.equal(hourlyRunId(t),'hourly_20261012_0000');assert.equal(nextScheduledAt(t-1000),t);await task.destroy();`;
 execFileSync(process.execPath,['--input-type=module','-e',code],{cwd:process.cwd(),env:{...process.env,TZ:zone},timeout:10000});
});
test('24H already persisted midnight run cannot repeat any market, model or delivery call',async()=>{
 await pipeline({runId:'hourly_20261012_0000',before:async dir=>{await atomicWrite(path.join(dir,'state','history.json'),{...emptyHistory(),runs:{hourly_20261012_0000:{status:'COMPLETE',scheduledAt:ms('2026-10-12T00:00:00')}}});},after:async p=>{assert.equal(p.apis,0);assert.equal(p.sends,0);assert.equal(p.r.status,'COMPLETE');}});
});
