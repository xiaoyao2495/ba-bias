import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import syncFs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {config} from '../src/config.js';
import {historicalFreshness} from '../src/analysis/historical-freshness.js';
import {selectOpportunities,materialEvidence} from '../src/market/opportunity-selector.js';
import {compare,summary,storyKey,longShortMaterial,atomicWrite} from '../src/storage/history.js';
import {verifiedFacts} from '../src/intelligence/packet.js';
import {previousResearch} from '../src/analysis/market-bias-v2/storage.js';
import {sha} from '../src/analysis/market-bias-v2/common.js';
import {validateResearch} from '../src/analysis/market-bias-v2/parser.js';
import {webResearch,mockBias} from './market-bias-v2-fixture.js';
import {precisionFacts,precisionMarket} from './selector-precision-fixture.js';
import {runResearch} from '../src/main.js';
import {initializeV2,assertPrepared,immutableWrite,v2Dir,checkLegacyIntegrity,loadV2Outbox} from '../src/storage/market-bias-v2-state.js';
import {Reader} from '../src/web/reader.js';
const H=3600000,ages=[1,12,24,48,48+1/H,48+1000/H,72,168,720];
const base=precisionFacts({price:40}),T=base.dataCutoff;
const prior=(age=1,f=base)=>({runId:'OLD_RUN',status:'RESEARCH',summary:summary(f),storyKey:storyKey(f,{current:summary(f)}),lastResearchTime:f.dataCutoff-age*H});
const source=syncFs.readFileSync(new URL('./fixtures/selector-pre-historical-freshness.txt',import.meta.url),'utf8');
const legacy=new Function('config','compare','longShortMaterial','storyKey','summary','verifiedFacts',source.replace(/^import .*;\n/gm,'').replaceAll('export function','function')+'\nreturn {selectOpportunities};')(config,compare,longShortMaterial,storyKey,summary,verifiedFacts).selectOpportunities;
const policy={...config.selector,maxCandidates:5};
const core=r=>r.decisions.map(x=>({symbol:x.symbol,status:x.status,reason:x.reason,score:x.score,rank:x.rank,gate:x.gate,dimensions:x.dimensions,materialEvidence:x.materialEvidence,storyType:x.comparison?.storyType,storyKey:x.storyKey}));

test('freshness defaults, immutable original Selector identity and unchanged policy',()=>{
 assert.equal(config.previousResearchFreshnessHours,48);
 assert.equal(sha(source),'0d96f55cafba6c73df6fa1603cd5937b2ae15ee6e03f1cbfee79a256668d8c26');
 assert.equal(config.selector.maxCandidates,5);
 assert.deepEqual(config.selector.material,{pricePp:15,oiPp:10,fundingPp:.05,volumeRatio:2});
 assert.deepEqual(config.thresholds,{price24:8,price1:3,oi4:10,funding:.1,fundingDelta:.05,volume:2});
});
for(const age of ages)test('freshness exact boundary '+age+'h',()=>{
 const r=historicalFreshness(T,T-age*H,48);
 assert.equal(r.ageMs,age*H);
 assert.equal(r.status,age<=48?'WITHIN_FRESHNESS_WINDOW':'EXPIRED_FOR_CURRENT_COMPARISON');
});
for(const [name,old,current,expected]of [
 ['same',T,T,'INVALID_OR_NON_PRIOR_HISTORY'],['future',T+1,T,'INVALID_OR_NON_PRIOR_HISTORY'],
 ['missing',undefined,T,'INSUFFICIENT_HISTORICAL_EVIDENCE'],['string',String(T),T,'INSUFFICIENT_HISTORICAL_EVIDENCE'],
 ['NaN',NaN,T,'INSUFFICIENT_HISTORICAL_EVIDENCE'],['fraction',T-.1,T,'INSUFFICIENT_HISTORICAL_EVIDENCE'],
 ['invalid current',T,undefined,'INSUFFICIENT_HISTORICAL_EVIDENCE']
])test('freshness rejects '+name,()=>assert.equal(historicalFreshness(current,old,48).status,expected));
test('one shared configurable window, no wall clock/timezone dependency',()=>{
 const old=config.previousResearchFreshnessHours;try{
 config.previousResearchFreshnessHours=24;
 assert.equal(selectOpportunities([base],{[base.symbol]:prior(25)}).decisions[0].historicalBaseline.status,'EXPIRED_FOR_CURRENT_COMPARISON');
 assert.equal(historicalFreshness(T,T-24*H,24).status,'WITHIN_FRESHNESS_WINDOW');
 assert.equal(historicalFreshness(T,T-25*H,72).status,'WITHIN_FRESHNESS_WINDOW');
 }finally{config.previousResearchFreshnessHours=old;}
});
const scenarios=[
 ['same',{},false],['price drift',{price:40.001},false],['OI drift',{price:40,oi:.001},false],
 ['Funding drift',{price:40,funding:.00001},false],['price reversal',{price:-40},true],
 ['OI material',{price:40,oi:40},true],['Funding material',{price:40,funding:-.3},true]
];
for(const age of ages)for(const [name,options,accepted]of scenarios)test('Selector '+age+'h '+name,()=>{
 const f=name==='same'?base:precisionFacts(options),stories={[f.symbol]:prior(age)},before=JSON.stringify(stories);
 const a=selectOpportunities([f],stories,{policy}),b=legacy([f],stories,{policy});
 assert.deepEqual(core(a),core(b));assert.equal(a.selected.length,accepted?1:0);assert.equal(JSON.stringify(stories),before);
 const row=a.decisions[0];assert.equal(row.historicalBaseline.dedupDecision,accepted?'MATERIAL_CHANGE':'NO_MATERIAL_CHANGE');
 if(age>48&&accepted){assert.equal(row.comparison.previous,null);assert.equal(row.comparison.historicalContext.purpose,'ARCHIVED_EVENT_DEDUP_ONLY');assert.equal(row.comparison.storyType,'MATERIAL_UPDATE');assert(!row.dimensions.some(x=>x.dimension==='EVENT_NOVELTY'));}
 if(age<=48&&accepted)assert.deepEqual(row.comparison,b.decisions[0].comparison);
});
test('expired incomplete summary cannot be new eligibility; invalid time is explicit',()=>{
 for(const bad of [{summary:{}},{summary:{anomalies:[]}},{lastResearchTime:null},{lastResearchTime:'invalid'},{summary:{...summary(base),price:null}}]){
  const r=selectOpportunities([precisionFacts({price:-40})],{[base.symbol]:{...prior(168),...bad}}).decisions[0];assert.equal(r.status,'INSUFFICIENT_EVIDENCE');assert.equal(r.reason,'INSUFFICIENT_HISTORICAL_EVIDENCE');assert.equal(r.historicalBaseline.status,r.reason);
 }
 for(const time of [T,T+H])assert.equal(selectOpportunities([base],{[base.symbol]:{...prior(),lastResearchTime:time}}).decisions[0].reason,'INVALID_OR_NON_PRIOR_HISTORY');
});
test('unknown interruption gap does not create a new episode; same facts still duplicate',()=>{
 assert.equal(selectOpportunities([base],{[base.symbol]:prior(720)}).decisions[0].reason,'NO_MATERIAL_CHANGE');
 assert.equal(materialEvidence(base,prior(720)).length,0);
});
test('expired historical identity is distinct from absent history; both still need Gate',()=>{
 const fresh=selectOpportunities([base]).selected[0];assert.equal(fresh.historicalBaseline.status,'NO_HISTORY');assert.equal(fresh.comparison.storyType,'NEW_STORY');
 for(const stories of [{},{[base.symbol]:prior(168)}])assert.equal(selectOpportunities([precisionFacts({price:8})],stories).decisions[0].reason,'BELOW_RESEARCH_GATE');
});
test('seven expired repeats cannot displace a genuine new candidate; material variants keep ranks',()=>{
 const facts=['AA','BB','CC','DD','EE','FF','GG'].map(s=>precisionFacts({symbol:s+'USDT',price:40}));const stories=Object.fromEntries(facts.map(f=>[f.symbol,prior(192,f)]));const fresh=precisionFacts({symbol:'ZZUSDT',price:40});
 assert.deepEqual(selectOpportunities([...facts,fresh],stories,{policy}).selected.map(x=>x.symbol),['ZZUSDT']);
 const naive=legacy([...facts,fresh],{},{policy});assert.equal(naive.selected.length,5);assert(!naive.selected.some(x=>x.symbol===fresh.symbol));
 const changed=facts.map((f,i)=>precisionFacts({symbol:f.symbol,price:-40,oi:i*10,funding:i%2?.3:0}));
 assert.deepEqual(core(selectOpportunities([...changed,fresh],stories,{policy})),core(legacy([...changed,fresh],stories,{policy})));
});
test('independent Symbol age and separate OUTBOX source identity',()=>{
 const a=precisionFacts({symbol:'AAUSDT',price:-40}),b=precisionFacts({symbol:'BBUSDT',price:-40});
 const r=selectOpportunities([a,b],{AAUSDT:{...prior(1),runId:'OUTBOX_RUN',status:'OUTBOX'},BBUSDT:prior(192)});
 assert.equal(r.decisions[0].historicalBaseline.source,'OUTBOX_PROJECTION');assert.equal(r.decisions[0].historicalBaseline.runId,'OUTBOX_RUN');
 assert.equal(r.decisions[1].historicalBaseline.ageMs,192*H);assert.equal(r.decisions[1].historicalBaseline.purpose,'ARCHIVED_EVENT_DEDUP_ONLY');
});
test('seven day hourly replay: legacy=0, naive TTL=3, fixed=0 repeat studies',()=>{
 const advance=(f,d)=>JSON.parse(JSON.stringify(f),(_k,v)=>typeof v==='number'&&v>1e12?v+d:v);
 function replay(select,ttl){let stories={[base.symbol]:prior(0)},count=0;for(let h=1;h<=168;h++){
  const f=advance(base,h*H),s=ttl&&f.dataCutoff-stories[f.symbol].lastResearchTime>48*H?{}:stories;
  const r=select([f],s);if(r.selected.length){count++;stories={[f.symbol]:{...prior(0,f),runId:'MOCK_'+h}};}
 }return count;}
 assert.equal(replay(legacy,false),0);assert.equal(replay(legacy,true),3);assert.equal(replay(selectOpportunities,false),0);
});
function memoryHistory(age=1){
 const f=JSON.parse(JSON.stringify(base),(_k,v)=>typeof v==='number'&&v>1e12?v-age*H:v);f.runId='OLD_RUN';
 const {research:r}=webResearch(f),bytes=Buffer.from(JSON.stringify(f));r.factsPackageSha256=sha(bytes);assert(validateResearch(r));
 const entry={contract:r.contract,runId:r.runId,symbol:r.symbol,recordId:r.recordId,factsAsOf:r.asOf.factsAsOf,executionState:r.executionState,researchSha256:sha(r)};
 return {r,bytes,h:{research:{[r.recordId]:entry}}};
}
async function memoryRead(t,age,damage='NONE',options={}){
 const x=memoryHistory(age),reads=[],decisions=[];const root='/__FRESHNESS_MEMORY__';
 const orig=fs.readFile;t.mock.method(fs,'readFile',async(file,encoding)=>{
  if(!String(file).startsWith(root))return orig(file,encoding);reads.push(String(file));
  let value;if(String(file).includes('/research/')){if(damage==='RESEARCH_MISSING')throw Object.assign(Error('MOCK_MISSING'),{code:'ENOENT'});value=Buffer.from(JSON.stringify(x.r));}
  else {if(damage==='MISSING')throw Object.assign(Error('MOCK_MISSING'),{code:'ENOENT'});value=damage==='HASH'?Buffer.from('{}'):x.bytes;}
  return encoding?value.toString():value;
 });
 const call=()=>previousResearch(root,x.h,base.symbol,T,{onDecision:d=>decisions.push(d),...options});return {...x,reads,decisions,call};
}
for(const age of ages)for(const damage of ['NONE','MISSING','HASH','RESEARCH_MISSING'])test('storage '+age+'h '+damage,async t=>{
 const x=await memoryRead(t,age,damage),before=JSON.stringify(x.h);
 if(age>48){const r=await x.call();assert.equal(r.status,'EXPIRED_FOR_CURRENT_COMPARISON');assert.equal(r.research,null);assert.equal(r.facts,null);assert.equal(r.integrity,'NOT_REVALIDATED');assert.equal(r.previousFactsReadSkipped,true);assert.equal(r.runId,'OLD_RUN');assert.equal(x.reads.length,0);}
 else if(damage==='NONE'){const r=await x.call();assert.equal(r.status,'WITHIN_FRESHNESS_WINDOW');assert.equal(r.integrity,'VERIFIED');assert.equal(x.reads.length,2);assert.deepEqual(r.facts,JSON.parse(x.bytes));}
 else await assert.rejects(x.call,damage==='MISSING'?/MOCK_MISSING/:damage==='HASH'?/PREVIOUS_FACTS_HASH_MISMATCH/:/PREVIOUS_RESEARCH_CORRUPT/);
 assert.equal(JSON.stringify(x.h),before);
});
test('storage uses shared configured window',async t=>{const old=config.previousResearchFreshnessHours;try{config.previousResearchFreshnessHours=24;const x=await memoryRead(t,25);assert.equal((await x.call()).status,'EXPIRED_FOR_CURRENT_COMPARISON');assert.equal(x.reads.length,0);}finally{config.previousResearchFreshnessHours=old;}});
for(const age of [0,-1])test('non-prior storage history is not null/no history '+age,async t=>{const x=await memoryRead(t,age);assert.equal((await x.call()).status,'INVALID_OR_NON_PRIOR_HISTORY');assert.equal(x.reads.length,0);});
test('bad index is rejected even if claimed old; UNAVAILABLE never replaces valid',async t=>{
 const x=await memoryRead(t,168);const e=Object.values(x.h.research)[0];e.researchSha256='bad';await assert.rejects(x.call,/INSUFFICIENT_HISTORICAL_EVIDENCE/);assert.equal(x.reads.length,0);
 e.researchSha256=sha(x.r);e.factsAsOf='old';await assert.rejects(x.call,/INSUFFICIENT_HISTORICAL_EVIDENCE/);
 e.factsAsOf=T-168*H;x.h.research.failed={...e,executionState:'UNAVAILABLE',factsAsOf:T-1};assert.equal((await x.call()).runId,'OLD_RUN');
 assert.equal(await previousResearch('unused',{research:{}},base.symbol,T),null);
 await assert.rejects(()=>previousResearch('unused',{research:[]},base.symbol,T),/INSUFFICIENT_HISTORICAL_EVIDENCE/);
});
test('latest strictly prior wins; no fallback around corrupt in-window Facts',async t=>{
 const x=await memoryRead(t,1,'HASH'),entry=Object.values(x.h.research)[0];x.h.research.older={...entry,recordId:'older',factsAsOf:T-100*H};
 // Index corruption must be explicit, not silently treated as absent or expired.
 await assert.rejects(x.call,/INSUFFICIENT_HISTORICAL_EVIDENCE/);
 delete x.h.research.older;await assert.rejects(x.call,/PREVIOUS_FACTS_HASH_MISMATCH/);
});

test('Mock pipeline: separate source diagnostics, expired missing files, unchanged archive/Manifest; no delivery',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'freshness-e2e-')),oldDir=config.dataDir;config.dataDir=dir;let calls=0,sends=0;
 try{
  await atomicWrite(path.join(dir,'state/history.json'),{runs:{LEGACY:{status:'COMPLETE'}}});await atomicWrite(path.join(dir,'runs/LEGACY/scan.json'),{legacy:true});
  await initializeV2(dir);const prepared=await assertPrepared(dir),h=prepared.history;
  const oldResearch=memoryHistory(192);h.research=oldResearch.h.research;
  h.selectorBaseline[base.symbol]={...prior(72),runId:'DIFFERENT_OUTBOX_RUN',status:'OUTBOX'};
  await atomicWrite(path.join(v2Dir(dir),'state/history.json'),h);
  const manifestBefore=await fs.readFile(path.join(v2Dir(dir),'state/cutover-manifest.json'));
  const deps={binance:precisionMarket([{symbol:base.symbol,price:-40}]),llm:{json:async(_s,i)=>{calls++;return mockBias(i);}},deliverySender:async()=>{sends++;throw Error('NO_DELIVERY');},log:()=>{}};
  const r=await runResearch({runId:'NEW_FRESHNESS_RUN',mode:'once',sendEnabled:false,handleSignals:false,setExitCode:false},deps);
  assert.equal(r.status,'COMPLETE');assert.equal(calls,1);assert.equal(sends,0);
  const d=JSON.parse(await fs.readFile(path.join(dir,'runs/NEW_FRESHNESS_RUN/run-diagnostics.json'),'utf8')).candidates[0];
  assert.equal(d.historicalBaseline.ageMs,72*H);assert.equal(d.historicalBaseline.runId,'DIFFERENT_OUTBOX_RUN');assert.equal(d.v2.previousResearch.ageMs,192*H);assert.equal(d.v2.previousResearch.runId,'OLD_RUN');assert.equal(d.v2.previousResearch.previousFactsReadSkipped,true);
  assert.equal((await new Reader(dir).research('NEW_FRESHNESS_RUN',base.symbol)).analysis.status,'VALIDATED');
  assert((await checkLegacyIntegrity(dir)).ok);assert.deepEqual(await fs.readFile(path.join(v2Dir(dir),'state/cutover-manifest.json')),manifestBefore);assert.equal((await loadV2Outbox(dir)).length,0);
  assert.equal((await assertPrepared(dir)).history.research[oldResearch.r.recordId].factsAsOf,T-192*H);
 }finally{config.dataDir=oldDir;await fs.rm(dir,{recursive:true,force:true});}
});
test('Mock failures retain baseline and repeat existing retry semantics, never fill sixth slot',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'freshness-fail-')),oldDir=config.dataDir;config.dataDir=dir;let calls=0;
 try{await initializeV2(dir);const h=(await assertPrepared(dir)).history;const rows=Array.from({length:6},(_,i)=>({symbol:`FAIL${i}USDT`,price:-40}));
 for(const row of rows){const f=precisionFacts({symbol:row.symbol,price:40});h.selectorBaseline[row.symbol]=prior(192,f);}await atomicWrite(path.join(v2Dir(dir),'state/history.json'),h);
 for(let n=0;n<2;n++){const r=await runResearch({runId:'FAIL_ROUND_'+n,mode:'once',handleSignals:false,setExitCode:false},{binance:precisionMarket(rows),llm:{json:async()=>{calls++;throw Error('MOCK_FAILURE');}},log:()=>{}});assert.equal(r.selector.selected.length,5);assert.equal(r.biasFailures,5);}
 assert.equal(calls,10);assert.deepEqual((await assertPrepared(dir)).history.selectorBaseline,h.selectorBaseline);assert.equal((await loadV2Outbox(dir)).length,0);
 }finally{config.dataDir=oldDir;await fs.rm(dir,{recursive:true,force:true});}
});
for(const age of [1,0,-1])test('Mock main blocks missing/inapplicable Research before model, age '+age,async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'freshness-block-')),oldDir=config.dataDir;config.dataDir=dir;let calls=0;
 try{await initializeV2(dir);const h=(await assertPrepared(dir)).history;h.research=memoryHistory(age).h.research;h.selectorBaseline[base.symbol]=prior(1);await atomicWrite(path.join(v2Dir(dir),'state/history.json'),h);
 const r=await runResearch({runId:'BLOCKED_RESEARCH',mode:'once',handleSignals:false,setExitCode:false},{binance:precisionMarket([{symbol:base.symbol,price:-40}]),llm:{json:async()=>{calls++;return mockBias({});}},log:()=>{}});
 assert.equal(calls,0);assert.equal(r.status,'PARTIAL');assert.equal(r.candidateEvaluations[0].status,'DATA_ERROR');assert.equal(r.candidateEvaluations[0].reason,age===1?'PREVIOUS_RESEARCH_CORRUPT':'INVALID_OR_NON_PRIOR_HISTORY');assert.deepEqual((await assertPrepared(dir)).history.selectorBaseline,h.selectorBaseline);
 }finally{config.dataDir=oldDir;await fs.rm(dir,{recursive:true,force:true});}
});
test('invalid cutoff cannot be disguised as no history; optional old summary gaps fail closed',async()=>{
 await assert.rejects(()=>previousResearch('unused',{research:{}},base.symbol,NaN),/INSUFFICIENT_HISTORICAL_EVIDENCE/);
 for(const k of ['oi1','oi24']){const p=prior(168);delete p.summary[k];assert.equal(selectOpportunities([precisionFacts({price:-40})],{[base.symbol]:p}).decisions[0].reason,'INSUFFICIENT_HISTORICAL_EVIDENCE');}
});
test('valid prior research remains selectable when another index entry is future',async t=>{
 const x=await memoryRead(t,1),e=Object.values(x.h.research)[0],id='bias_'+'a'.repeat(32);
 x.h.research[id]={...e,recordId:id,runId:'FUTURE_RUN',factsAsOf:T+H};
 assert.equal((await x.call()).runId,'OLD_RUN');assert.equal(x.reads.length,2);
});
test('materialEvidence source and all original financial policy values remain identical',()=>{
 const current=syncFs.readFileSync(new URL('../src/market/opportunity-selector.js',import.meta.url),'utf8');
 const body=s=>s.slice(s.indexOf('export function materialEvidence'),s.indexOf('export function selectOpportunities'));
 assert.equal(body(current),body(source));
 assert.deepEqual(config.selector,{maxCandidates:5,minimumFamilies:2,resonanceStrength:1.5,extremeStrength:3,strengthCap:3,crossMetricPoints:5,crossMetricCap:3,noveltyPoints:5,weights:{PRICE_EXTREMITY:20,OI_ABNORMALITY:20,FUNDING_EXTREMITY:20,VOLUME_ABNORMALITY:10,ACCOUNT_DISTRIBUTION:15},material:{pricePp:15,oiPp:10,fundingPp:.05,volumeRatio:2}});
});
test('in-window Research hash corruption is not bypassed and never advances to Facts',async t=>{
 const x=await memoryRead(t,1);x.r.analysis.bias='BEARISH';await assert.rejects(x.call,/PREVIOUS_RESEARCH_CORRUPT/);assert.equal(x.reads.length,1);
});
test('corrupt expired scalar/nested summaries fail closed rather than renew eligibility',()=>{
 for(const price of [false,'40',NaN,Infinity]){const p=prior(168);p.summary.price=price;assert.equal(selectOpportunities([precisionFacts({price:-40})],{[base.symbol]:p}).decisions[0].reason,'INSUFFICIENT_HISTORICAL_EVIDENCE');}
 const p=prior(168);p.summary.longShort={global:{longPct:50,shortPct:50,changes:null}};assert.equal(selectOpportunities([base],{[base.symbol]:p}).decisions[0].reason,'INSUFFICIENT_HISTORICAL_EVIDENCE');
});
