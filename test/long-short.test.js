import {mockBias} from './market-bias-v2-fixture.js';
import {initializeV2,loadV2Outbox,v2Dir,assertPrepared} from '../src/storage/market-bias-v2-state.js';
import {mockDirectional} from './directional-fixture.js';
// Synthetic MOCK data only. No exchange, LLM or notification network requests.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import Big from 'big.js';
import {setTimeout as delay} from 'node:timers/promises';
import {Binance,endpoints} from '../src/clients/binance.js';
import {Http} from '../src/clients/http.js';
import {config} from '../src/config.js';
import {parseLongShortSeries,buildLongShortFacts,HOUR} from '../src/market/long-short-facts.js';
import {detectLongShort} from '../src/market/long-short-detector.js';
import {discoverAccounts} from '../src/market/long-short-discovery.js';
import {scan} from '../src/market/scanner.js';
import {buildFacts} from '../src/market/facts-engine.js';
import {detect} from '../src/market/detector.js';
import {emptyHistory,summary,compare} from '../src/storage/history.js';
import {llmFacts,judgeStory,marketRules} from '../src/content/story-judge.js';
import {guardDraft} from '../src/content/claim-guard.js';
import {buildIntelligence,intelligenceText,verifiedFacts} from '../src/intelligence/packet.js';
import {runResearch} from '../src/main.js';
import {fixture,identity,symbol,cutoff} from './fixtures.js';
const end=Math.floor(cutoff/HOUR)*HOUR;
function source(kind='global',values=Array(30).fill(0.6),sym=symbol){
  const endpoint=kind==='global'?endpoints.accounts:endpoints[kind];
  return {endpoint,params:{symbol:sym,period:'1h',limit:30,endTime:cutoff},retrievedAt:cutoff+1000,
    raw:values.map((v,i)=>{const l=new Big(v),s=new Big(1).minus(l);return {symbol:sym,timestamp:end-(values.length-1-i)*HOUR,longAccount:l.toFixed(4),shortAccount:s.toFixed(4),longShortRatio:s.gt(0)?l.div(s).toFixed(4):'0'};})};
}
function shifted(){const v=Array(30).fill(0.6);v.splice(-4,4,0.55,0.5,0.45,0.4);return v;}
function ls(values=shifted(),top=Array(30).fill(0.7),positions=Array(30).fill(0.65)){
  return buildLongShortFacts({accounts:source('global',values),topAccounts:source('topAccounts',top),topPositions:source('topPositions',positions)},symbol,cutoff);
}
function deep(values=shifted()) {const x=fixture();x.sources.accounts=source('global',values);x.sources.topAccounts=source('topAccounts');x.sources.topPositions=source('topPositions');return detect(buildFacts(x));}
for(const [kind,scope] of [['global','GLOBAL_ACCOUNTS'],['topAccounts','TOP_TRADER_ACCOUNTS'],['topPositions','TOP_TRADER_POSITIONS']])test(`${kind}: response parsed with raw query provenance and scope`,()=>{
  const s=source(kind),m=parseLongShortSeries(s,symbol,cutoff,kind);assert.equal(m.scope,scope);assert.equal(m.quality.available,true);assert.equal(m.samples.length,30);assert.deepEqual(m.raw,s.raw);assert.deepEqual(m.source.params,s.params);assert.equal(m.source.retrievedAt,s.retrievedAt);assert.equal(m.valueUnit,'percent');
});
test('top position shares never become account percentages or global OI shares',()=>{const m=ls();assert.equal(m.topPositions.topLongPositionShare,'65.00000000');assert.equal(m.topPositions.latestLongAccountPct,undefined);assert.match(m.topPositions.evidence[0].phrase,/不是全市场OI/);assert.notEqual(m.topPositions.scope,m.topAccounts.scope);});
test('exact 1h 4h 24h percentage points are deterministic, not relative percent',()=>{const m=ls().global;assert.equal(m.shortAccountChange1hPp,'5.00000000');assert.equal(m.shortAccountChange4hPp,'20.00000000');assert.equal(m.shortAccountChange24hPp,'20.00000000');assert.equal(m.longAccountChange4hPp,'-20.00000000');assert.equal(m.dataTimestamp,end);});
test('top accounts and top positions have exact historical deltas independently',()=>{const m=ls(Array(30).fill(.6),shifted(),shifted());assert.equal(m.topAccounts.longAccountChange4hPp,'-20.00000000');assert.equal(m.topPositions.topLongPositionShareChange24hPp,'-20.00000000');assert.ok(detectLongShort(m).some(a=>a.kind==='TOP_ACCOUNT_DISTRIBUTION_SHIFT'));assert.ok(detectLongShort(m).some(a=>a.kind==='TOP_POSITION_DISTRIBUTION_SHIFT'));});
test('strict single sample dominance crossing is not confirmed',()=>{const v=Array(30).fill(.6);v[29]=.4;const m=ls(v).global;assert.equal(m.previousDominantSide,'LONG');assert.equal(m.currentDominantSide,'SHORT');assert.equal(m.flip.status,'SINGLE_SAMPLE');assert.equal(m.dominanceFlip,true);});
test('two consecutive new side samples confirm flip; short return is transient',()=>{const v=Array(30).fill(.6);v[28]=.4;v[29]=.4;assert.equal(ls(v).global.flip.status,'CONFIRMED');v[29]=.6;assert.equal(ls(v).global.flip.status,'TRANSIENT_RETURN');});
test('50/50 and missing intermediate sample do not confirm a flip',()=>{const v=Array(30).fill(.6);v[28]=.5;v[29]=.4;assert.equal(ls(v).global.dominanceFlip,false);const s=source('global',v);s.raw.splice(-2,1);assert.equal(parseLongShortSeries(s,symbol,cutoff).dominanceFlip,false);});
test('aligned top/global gap is account divergence, never compared with positions',()=>{const m=ls();assert.equal(m.divergence.gapPp,'30.00000000');assert.equal(m.divergence.scope,'TOP_TRADER_ACCOUNTS_VS_GLOBAL_ACCOUNTS');assert.ok(detectLongShort(m).some(a=>a.kind==='TOP_GLOBAL_DIVERGENCE'));assert.ok(m.evidence.find(e=>e.evidenceId===symbol+':topGlobal.divergence').sources.length===2);});
test('opposite 4h account directions qualify even with small current gap',()=>{const g=Array(30).fill(.6),t=Array(30).fill(.4);g.splice(-4,4,.55,.52,.5,.5);t.splice(-4,4,.45,.48,.5,.5);const m=ls(g,t);const a=detectLongShort(m).find(a=>a.kind==='TOP_GLOBAL_DIVERGENCE');assert.equal(a.oppositeChangeDirections,true);assert.equal(m.divergence.gapPp,'0.00000000');});
test('mismatched sampling time prevents top/global comparison',()=>{const sources={accounts:source(),topAccounts:source('topAccounts')};sources.topAccounts.raw.at(-1).timestamp-=1000;const m=buildLongShortFacts(sources,symbol,cutoff);assert.equal(m.divergence.gapPp,null);assert.equal(m.divergence.evidenceId,null);});
test('future row stays in raw but cannot change latest, deltas or flip',()=>{const s=source();const future={...s.raw.at(-1),timestamp:end+HOUR,longAccount:'.1',shortAccount:'.9',longShortRatio:'.1111'};s.raw.push(future);const m=parseLongShortSeries(s,symbol,cutoff);assert.equal(m.latestLongAccountPct,'60.00000000');assert.equal(m.longAccountChange1hPp,'0.00000000');assert.equal(m.raw.length,31);assert.equal(m.samples.length,30);assert.ok(m.quality.issues.some(i=>i.reason==='FUTURE_SAMPLE_EXCLUDED'));assert.ok(m.evidence.every(e=>e.dataTimes.every(t=>t.ms<=cutoff)));});
test('missing 4h start does not substitute nearest or interpolate',()=>{const s=source('global',shifted());s.raw=s.raw.filter(r=>r.timestamp!==end-4*HOUR);const m=parseLongShortSeries(s,symbol,cutoff);assert.equal(m.longAccountChange4hPp,null);assert.equal(m.windows['4h'].reason,'EXACT_START_SAMPLE_MISSING');assert.equal(m.longAccountChange1hPp,'-5.00000000');assert.equal(m.longAccountChange24hPp,null);});
test('intermediate gap invalidates window despite valid endpoints',()=>{const s=source();s.raw=s.raw.filter(r=>r.timestamp!==end-2*HOUR);const m=parseLongShortSeries(s,symbol,cutoff);assert.equal(m.windows['4h'].reason,'NON_CONTINUOUS_SAMPLES');assert.equal(m.shortAccountChange4hPp,null);});
for(const [name,edit] of [
  ['wrong symbol',s=>s.raw.at(-1).symbol='OTHERUSDT'],['wrong period',s=>s.params.period='4h'],['wrong endpoint',s=>s.endpoint=endpoints.topPositions],
  ['zero denominator',s=>{s.raw.at(-1).shortAccount='0';s.raw.at(-1).longAccount='1';}],['invalid range',s=>s.raw.at(-1).longAccount='1.1'],
  ['inconsistent ratio',s=>s.raw.at(-1).longShortRatio='99'],['duplicate time',s=>s.raw.push({...s.raw.at(-1)})],['stale',s=>s.raw.pop()]
])test(`${name} suppresses unreliable latest conclusion`,()=>{const s=source();edit(s);const m=parseLongShortSeries(s,symbol,cutoff);assert.equal(m.quality.available,false);assert.equal(m.shortAccountChange4hPp,null);assert.equal(m.latestLongAccountPct,null);assert.equal(m.evidence.length,0);});
test('top interfaces absent or forbidden degrade while global metrics remain usable',()=>{const m=buildLongShortFacts({accounts:source('global',shifted()),topAccounts:{...source('topAccounts'),raw:[],error:'HTTP_403'}},symbol,cutoff);assert.equal(m.topAccounts.quality.reason,'HTTP_403');assert.equal(m.topPositions.quality.reason,'SOURCE_MISSING');assert.ok(detectLongShort(m).some(a=>a.kind==='ACCOUNT_DISTRIBUTION_SHIFT'));});
test('top key absent makes no request; configured key only reaches top headers, not persisted source',async()=>{const requests=[];const http={request:async x=>{requests.push(x);return [];}};const b=new Binance(http,{marketDataKey:null});await assert.rejects(b.get(endpoints.topAccounts),/KEY_MISSING/);assert.equal(requests.length,0);const keyed=new Binance(http,{marketDataKey:'MOCK_READ_ONLY_KEY'});const s=await keyed.get(endpoints.topPositions,{symbol,period:'1h'});assert.equal(requests[0].headers['X-MBX-APIKEY'],'MOCK_READ_ONLY_KEY');assert.ok(!JSON.stringify(s).includes('MOCK_READ_ONLY_KEY'));await keyed.get(endpoints.accounts);assert.equal(requests[1].headers,undefined);});
test('facts, Judge and packet retain long/short evidence and contextual price OI',async()=>{const f=deep(),comparison=compare(f),ids=[symbol+':global.short.change4h',symbol+':topGlobal.divergence'];let input;const judge=await judgeStory({json:async(_prompt,data)=>{input=data;return {eligible:true,storyType:'NEW_STORY',newsworthinessScore:80,reason:'MOCK',keyEvidenceIds:ids,risks:[],storyAngle:'账户变化与OI交叉观察'};}},f,comparison);assert.equal(input.facts.longShort.global.longAccountChange4hPp,'-20.00000000');assert.ok(input.facts.openInterest.windows['4h']);assert.ok(input.facts.price.closedWindows['4h']);assert.ok(input.facts.evidence.find(e=>e.evidenceId===ids[0]).endpoint);const {packet}=buildIntelligence(f,judge,comparison);assert.ok(packet.evidenceIds.includes(ids[0]));const text=intelligenceText(packet,{runId:'MOCK'});for(const re of [/全市场账户/,/顶部交易员账户/,/顶部交易员持仓份额/,/个百分点/,/账户分布不证明具体开平仓/])assert.match(text,re);assert.ok(packet.guard.evidenceRebuilt);});
test('original price OI Funding detection remains identical when new data constant',()=>{const old=detect(buildFacts(fixture()));const f=deep(Array(30).fill(.6));assert.deepEqual(f.anomalies.filter(a=>!a.kind.startsWith('ACCOUNT')&&!a.kind.startsWith('TOP_')),old.anomalies);assert.deepEqual(config.thresholds,{price24:8,price1:3,oi4:10,funding:.1,fundingDelta:.05,volume:2});});
test('verified rebuild rejects tampered long/short conclusions and uses raw',()=>{const f=deep();f.longShort.global.shortAccountChange4hPp='99';const verified=verifiedFacts(f);assert.equal(verified.longShort.global.shortAccountChange4hPp,'20.00000000');});
test('long/short change alone makes MATERIAL_UPDATE; unchanged observation is duplicate',()=>{const a=deep(),previous={summary:summary(a)},b=deep();assert.equal(compare(b,previous).eligible,false);const values=shifted();values[29]=.34;const c=deep(values);assert.equal(compare(c,previous).storyType,'MATERIAL_UPDATE');assert.equal(compare(c,previous).eligible,true);});
test('single flip later confirmed is material, extra confirmed samples alone are stable',()=>{const v=Array(30).fill(.6);v[29]=.4;const a=deep(v),b=deep(v);b.longShort.global.flip.status='CONFIRMED';assert.equal(compare(b,{summary:summary(a)}).eligible,true);const c=deep(v);c.longShort.global.flip.status='CONFIRMED';c.longShort.global.flip.confirmationSamples=3;assert.equal(compare(c,{summary:summary(b)}).eligible,false);});
for(const phrase of ['空头账户增加表明空头持续加仓','多头账户下降是多头获利了结','OI增加证明大量新空头入场','顶部交易员比例高说明聪明钱看多','背离意味着价格即将反转','账户翻转说明趋势已经确认反转'])test(`Claim Guard rejects unsupported interpretation: ${phrase}`,()=>{const f=deep(),id=f.evidence[0].evidenceId;const r=guardDraft({symbol,storyType:'NEW_STORY',title:'{{symbol}}情报',body:'{{'+id+'}}\n'+phrase,observation:'观察后续变化。',evidenceIds:[id,f.evidence[1].evidenceId]},f,{storyType:'NEW_STORY',keyEvidenceIds:[id]});assert.equal(r.ok,false);assert.ok(r.errors.some(e=>e.includes('UNSUPPORTED')));});
test('Judge rules explicitly distinguish all three scopes and prohibit trade-cause inference',()=>{assert.match(marketRules,/TOP_TRADER_ACCOUNTS/);assert.match(marketRules,/TOP_TRADER_POSITIONS/);assert.match(marketRules,/不能证明持续加仓/);assert.ok(llmFacts(deep()).longShort);});

function market(symbols,{accountAnomalies=new Set(),topFailure=false,delaySymbol}={}){
  const x=fixture(),requests=[];let active=0,maxActive=0;
  const convert=(r,s)=>Array.isArray(r)?r.map(v=>convert(v,s)):({...r,...(r.symbol?{symbol:s}:{})});
  const b={http:{},requests,get:async(endpoint,params={})=>{
    requests.push({endpoint,params});active++;maxActive=Math.max(maxActive,active);
    try{
      if(params.symbol===delaySymbol)await delay(100,undefined,{signal:b.http.signal});
      let raw;
      if(endpoint===endpoints.time)raw={serverTime:cutoff};else if(endpoint===endpoints.exchange)raw={symbols:symbols.map(s=>({...identity,symbol:s,baseAsset:s.slice(0,-4)})),rateLimits:[]};
      else if(endpoint===endpoints.ticker)raw=symbols.map((s,i)=>({...x.ticker,symbol:s,lastPrice:'100',priceChangePercent:'0',quoteVolume:String(1000000-i)}));
      else if(endpoint===endpoints.premium)raw=symbols.map(s=>({...x.sources.premium.raw,symbol:s,lastFundingRate:'0'}));else if(endpoint===endpoints.fundingInfo)raw=[];
      else if(endpoint===endpoints.accounts)raw=source('global',accountAnomalies.has(params.symbol)?shifted():Array(30).fill(.6),params.symbol).raw;
      else if([endpoints.topAccounts,endpoints.topPositions].includes(endpoint)){if(topFailure)throw Object.assign(new Error('MOCK_FORBIDDEN'),{code:'HTTP_403'});raw=source(endpoint===endpoints.topAccounts?'topAccounts':'topPositions',Array(30).fill(.6),params.symbol).raw;}
      else if(endpoint===endpoints.klines){raw=structuredClone(params.interval==='1h'?x.sources.hour.raw:x.sources.five.raw);for(const r of raw){r[4]='100';r[5]='10';}}
      else if(endpoint===endpoints.oi){raw=convert(x.sources.oi.raw,params.symbol);for(const r of raw)r.sumOpenInterest='100';}
      else if(endpoint===endpoints.funding){raw=convert(x.sources.funding.raw,params.symbol);for(const r of raw)r.fundingRate='0';}
      return {endpoint,params,raw,retrievedAt:cutoff+1000};
    }finally{active--;}
  }};Object.defineProperty(b,'maxActive',{get:()=>maxActive});return b;
}
test('independent accounts cover whole Crypto set, join old probes and deduplicate',async()=>{
  const old=config.maxCandidates;config.maxCandidates=2;const symbols=['AAAUSDT','BBBUSDT','CCCUSDT','DDDUSDT'];const b=market(symbols,{accountAnomalies:new Set(['AAAUSDT','DDDUSDT']),topFailure:true}),saved=new Map();
  try{const r=await scan(b,{runId:'MOCK',history:emptyHistory(),save:async(k,v)=>saved.set(k,v)});assert.equal(r.result.longShortCoverage.requested,4);assert.equal(r.result.longShortCoverage.uncovered.length,0);assert.equal(r.result.researchCandidates.length,3);assert.equal(r.result.selection.accountAnomalyAdditions,1);assert.equal(r.facts.length,2);assert.ok(r.facts.some(f=>f.symbol==='DDDUSDT'&&f.anomalies.some(a=>a.kind==='ACCOUNT_DISTRIBUTION_SHIFT')));assert.equal(b.requests.filter(r=>r.endpoint===endpoints.accounts).length,4);assert.ok(b.requests.filter(r=>r.endpoint===endpoints.accounts).every(r=>r.params.limit===30));assert.ok(b.maxActive<=3);assert.ok(saved.has('accounts-coverage.json'));assert.equal(r.facts[0].longShort.topAccounts.quality.reason,'HTTP_403');}finally{config.maxCandidates=old;}
});
test('time budget persists uncovered symbols/reasons and rotates them first next run',async()=>{const old=config.scanTimeoutMs;config.scanTimeoutMs=40;const b=market(['AAAUSDT','BBBUSDT','CCCUSDT','DDDUSDT','EEEUSDT'],{delaySymbol:'AAAUSDT'}),history=emptyHistory(),saved=new Map();
  // Make every request block until cancellation, leaving a genuine unrequested suffix.
  b.get=async()=>{await delay(100,undefined,{signal:b.http.signal});return source();};
  try{const r=await discoverAccounts(b,{symbols:['AAAUSDT','BBBUSDT','CCCUSDT','DDDUSDT','EEEUSDT'],cutoff,history,save:async(k,v)=>saved.set(k,v)});assert.equal(r.coverage.requested,3);assert.equal(r.coverage.unrequested.length,2);assert.equal(r.coverage.uncovered.length,5);assert.ok(r.coverage.unrequested.every(e=>e.status==='NOT_COVERED'&&e.reason.includes('TIME_BUDGET')));assert.equal(history.longShortDiscoveryRotation,3);assert.equal(r.coverage.insufficientData,3);assert.equal(b.http.signal,undefined);const calls=[];b.get=async(_endpoint,params)=>{calls.push(params.symbol);return source('global',Array(30).fill(.6),params.symbol);};await discoverAccounts(b,{symbols:['AAAUSDT','BBBUSDT','CCCUSDT','DDDUSDT','EEEUSDT'],cutoff,history,save:async()=>{}});assert.equal(calls[0],'DDDUSDT');}finally{config.scanTimeoutMs=old;}
});
test('statistics request ceiling observes cooldown using MOCK time and counts retries',async()=>{let now=300000;const starts=[];const h=new Http({now:()=>now,sleep:async ms=>{now+=ms;},spacing:0,transport:async()=>{starts.push(now);return {data:[]};}});h.futuresDataStarts=Array(1000).fill(100);await h.request({url:'https://fapi.binance.com/futures/data/globalLongShortAccountRatio'});assert.ok(starts[0]>=300100);assert.equal(h.metrics.cooldowns,1);});
test('HTTP 429 during account discovery remains insufficient, never normal',async()=>{const h={};const b={http:h,get:async()=>{throw Object.assign(new Error('MOCK_LIMIT'),{code:'HTTP_429'});}};const r=await discoverAccounts(b,{symbols:[symbol],cutoff,history:emptyHistory(),save:async()=>{}});assert.equal(r.coverage.insufficientData,1);assert.equal(r.coverage.fullyEvaluated,0);assert.equal(r.coverage.entries[0].reason,'HTTP_429');});
test('seven account-only candidates retain full discovery while only top three reach minimal V2',async()=>{const oldDir=config.dataDir,oldMax=config.maxCandidates,dir=await fs.mkdtemp(path.join(os.tmpdir(),'ba-long-short-'));config.dataDir=dir;config.maxCandidates=2;const syms=Array.from({length:7},(_,i)=>'MOCK'+i+'USDT'),b=market(syms,{accountAnomalies:new Set(syms)});let judged=0;const originalGet=b.get;b.get=async(e,p)=>{const v=await originalGet(e,p);if(e===endpoints.accounts){const last=v.raw.at(-1);Object.assign(last,{longAccount:'0.2',shortAccount:'0.8',longShortRatio:'0.25'});}return v;};
  const llm={tokenUsage:{},json:async(_prompt,input)=>{if(input.contract==='BA_BIAS_MARKET_BIAS_V2')return mockBias(input);judged++;assert.ok(input.facts.longShort.global);return {eligible:true,storyType:input.comparison.storyType,newsworthinessScore:80,reason:'MOCK',keyEvidenceIds:input.facts.evidence.filter(e=>e.scope==='GLOBAL_ACCOUNTS').slice(0,2).map(e=>e.evidenceId),risks:[],storyAngle:'账户异常'};}};
  try{await initializeV2(dir);const r=await runResearch({mode:'once',runId:'MOCK_LONG_SHORT',send:false,handleSignals:false},{binance:b,llm,log:()=>{}});assert.equal(judged,0);assert.equal(r.generated,0);assert.equal(r.biasAnalyses,3);assert.equal(r.judgedCandidates,0);assert.equal((await loadV2Outbox(dir)).length,0);assert.equal(r.sent,0);}finally{config.dataDir=oldDir;config.maxCandidates=oldMax;await fs.rm(dir,{recursive:true,force:true});}
});

test('consistent off-hour sample phase uses exact offsets, never rounded hour substitutes',()=>{const s=source('global',shifted());for(const r of s.raw)r.timestamp-=1234;const m=parseLongShortSeries(s,symbol,cutoff);assert.equal(m.quality.available,true);assert.equal(m.windows['4h'].to,end-1234);assert.equal(m.windows['4h'].from,end-1234-4*HOUR);assert.equal(m.longAccountChange4hPp,'-20.00000000');});
test('partial valid anomaly is retained while missing windows stay uncovered',async()=>{const b={http:{},get:async()=>{const s=source('global',shifted());s.raw=s.raw.filter(r=>r.timestamp!==end-24*HOUR);return s;}};const r=await discoverAccounts(b,{symbols:[symbol],cutoff,history:emptyHistory(),save:async()=>{}});assert.ok(r.anomalous.has(symbol));assert.equal(r.coverage.anomalous,1);assert.equal(r.coverage.fullyEvaluated,0);assert.equal(r.coverage.insufficientData,1);assert.equal(r.coverage.uncovered.length,1);assert.equal(r.coverage.entries[0].windows['24h'].evaluated,false);});
test('material account changes show previous and current values in notification',()=>{const a=deep(),values=shifted();values[29]=.34;const b=deep(values),comparison=compare(b,{summary:summary(a),evidenceIds:a.evidence.map(e=>e.evidenceId),runId:'MOCK_PREVIOUS'});const judge={eligible:true,storyType:'MATERIAL_UPDATE',newsworthinessScore:80,keyEvidenceIds:[symbol+':global.short.change4h',symbol+':global.long.latest']};const {packet}=buildIntelligence(b,judge,comparison);assert.match(intelligenceText(packet,{runId:'MOCK'}),/全市场账户多方：40.00% → 34.00%/);});

test('invalid ratio cannot reappear through the legacy account snapshot',()=>{const x=fixture();x.sources.accounts=source();x.sources.accounts.raw.at(-1).longShortRatio='99';const f=buildFacts(x);assert.equal(f.longShort.global.quality.available,false);assert.equal(f.longShortAccounts,null);});
test('identical observed distribution at next hour does not become material through timestamps alone',()=>{const a=deep(Array(30).fill(.6)),b=deep(Array(30).fill(.6));for(const key of ['global','topAccounts','topPositions']){b.longShort[key].dataTimestamp+=HOUR;for(const w of Object.values(b.longShort[key].windows)){w.from+=HOUR;w.to+=HOUR;}}assert.equal(compare(b,{summary:summary(a)}).eligible,false);});

test('discovery persistence failure awaits other workers before restoring shared signal',async()=>{const b={http:{},get:async(_e,p)=>{if(p.symbol==='BBBUSDT')await delay(10);return source('global',Array(30).fill(.6),p.symbol);}};let finished=false;await assert.rejects(discoverAccounts(b,{symbols:['AAAUSDT','BBBUSDT'],cutoff,history:emptyHistory(),save:async(_file,value)=>{if(value.symbol==='AAAUSDT')throw new Error('MOCK_DISK_FAILURE');if(value.symbol==='BBBUSDT'){assert.ok(b.http.signal);finished=true;}}}),/MOCK_DISK_FAILURE/);assert.equal(finished,true);assert.equal(b.http.signal,undefined);});
