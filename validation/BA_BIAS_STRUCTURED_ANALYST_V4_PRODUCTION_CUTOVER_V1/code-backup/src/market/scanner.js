import {discoverAccounts} from './long-short-discovery.js';
import {config,safeError} from '../config.js';
import {endpoints} from '../clients/binance.js';
import {classify,detect} from './detector.js';
import {buildFacts,valid} from './facts-engine.js';
export async function scan(binance,options){
  const previousSignal=binance.http.signal;
  const budgetSignal=AbortSignal.timeout(config.scanTimeoutMs);
  binance.http.signal=previousSignal?AbortSignal.any([previousSignal,budgetSignal]):budgetSignal;
  try{return await scanInternal(binance,{...options,budgetSignal});}finally{binance.http.signal=previousSignal;}
}
async function scanInternal(binance,{runId,history,save,budgetSignal}){
  const time=await binance.get(endpoints.time);
  const initial=time.raw.serverTime;
  const exchange=await binance.get(endpoints.exchange);
  const tickerSource=await binance.get(endpoints.ticker);
  const premiumSource=await binance.get(endpoints.premium);
  const end=await binance.get(endpoints.time);
  const cutoff=end.raw.serverTime;
  if(!Number.isSafeInteger(initial)||!Number.isSafeInteger(cutoff)||cutoff<initial)throw new Error('INVALID_SERVER_TIME');
  const limit=exchange.raw.rateLimits?.find(r=>r.rateLimitType==='REQUEST_WEIGHT'&&r.interval==='MINUTE')?.limit;
  if(limit)binance.http.weightLimit=limit;
  let fundingInfo;
  try{fundingInfo=await binance.get(endpoints.fundingInfo);}catch(e){fundingInfo={endpoint:endpoints.fundingInfo,params:{},raw:[],error:safeError(e)};}
  const rejected=[],eligible=[],crypto=[];
  const tickers=new Map(tickerSource.raw.map(t=>[t.symbol,t])),premiums=new Map(premiumSource.raw.map(t=>[t.symbol,t]));
  for(const s of exchange.raw.symbols){const c=classify(s);if(!c.eligible){rejected.push({symbol:s.symbol,reason:c.reason});continue;}
    crypto.push(s);
    const t=tickers.get(s.symbol),p=premiums.get(s.symbol);
    if(!t || !valid(t.priceChangePercent)||!valid(t.quoteVolume)){rejected.push({symbol:s.symbol,reason:'INVALID_TICKER'});continue;}
    const trigger=Math.abs(Number(t.priceChangePercent))>=config.thresholds.price24|| (valid(p?.lastFundingRate)&&Math.abs(Number(p.lastFundingRate)*100)>=config.thresholds.funding);
    const prior=history.snapshot?.[s.symbol];
    const fundingChange=prior&&valid(prior.rate)&&valid(p?.lastFundingRate) && (Math.abs((Number(p.lastFundingRate)-Number(prior.rate))*100)>=config.thresholds.fundingDelta || Number(p.lastFundingRate)*Number(prior.rate)<0);
    eligible.push({s,t,p,trigger:trigger||fundingChange,score:Math.abs(Number(t.priceChangePercent))/config.thresholds.price24+(valid(p?.lastFundingRate)?Math.abs(Number(p.lastFundingRate)*100)/config.thresholds.funding:0)});
  }
  const slots=Math.floor(config.maxCandidates/2);
  const triggered=eligible.filter(e=>e.trigger).sort((a,b)=>b.score-a.score).slice(0,slots);
  const liquid=eligible.filter(e=>!triggered.some(t=>t.s.symbol===e.s.symbol)).sort((a,b)=>Number(b.t.quoteVolume)-Number(a.t.quoteVolume));
  const rotation=history.rotation || 0;
  const probes=Array.from({length:Math.min(config.maxCandidates-triggered.length,liquid.length)},(_,i)=>liquid[(rotation+i)%liquid.length]);
  const discovery=await discoverAccounts(binance,{symbols:crypto.map(s=>s.symbol),cutoff,history,save});
  const original=[...triggered,...probes];
  const selected=[...new Map([...original,...crypto.filter(s=>discovery.anomalous.has(s.symbol)).map(s=>({s,t:tickers.get(s.symbol),p:premiums.get(s.symbol)}))].map(e=>[e.s.symbol,e])).values()],facts=[];
  history.rotation=liquid.length?(rotation+probes.length)%liquid.length:0;
  history.snapshot=Object.fromEntries(eligible.map(e=>[e.s.symbol,{rate:e.p?.lastFundingRate ?? null,time:e.p?.time ?? null}]));
  let index=0;
  async function worker(){while(index<selected.length){if(binance.http.signal?.aborted)return;const e=selected[index++];
    try{
      const sources={exchange:{...exchange,raw:e.s},ticker:{...tickerSource,raw:e.t},premium:{...premiumSource,raw:e.p || null},fundingInfo:{...fundingInfo,raw:fundingInfo.raw.filter(r=>r.symbol===e.s.symbol)}};
      for(const [key,endpoint,params] of [
        ['hour',endpoints.klines,{symbol:e.s.symbol,interval:'1h',limit:80,endTime:cutoff}],
        ['five',endpoints.klines,{symbol:e.s.symbol,interval:'5m',limit:40,endTime:cutoff}],
        ['oi',endpoints.oi,{symbol:e.s.symbol,period:'1h',limit:30,endTime:cutoff}],
        ['funding',endpoints.funding,{symbol:e.s.symbol,startTime:cutoff-172800000,endTime:cutoff,limit:1000}],
        ['accounts',endpoints.accounts,{symbol:e.s.symbol,period:'1h',limit:config.longShort.sampleLimit,endTime:cutoff}],
        ['topAccounts',endpoints.topAccounts,{symbol:e.s.symbol,period:'1h',limit:config.longShort.sampleLimit,endTime:cutoff}],
        ['topPositions',endpoints.topPositions,{symbol:e.s.symbol,period:'1h',limit:config.longShort.sampleLimit,endTime:cutoff}]
      ]){try{sources[key]=key==='accounts'&&discovery.sources.has(e.s.symbol)?discovery.sources.get(e.s.symbol):await binance.get(endpoint,params);}catch(err){sources[key]={endpoint,params,raw:[],retrievedAt:Date.now(),error:safeError(err)};}}
      const identity={symbol:e.s.symbol,baseAsset:e.s.baseAsset,quoteAsset:e.s.quoteAsset,underlyingType:e.s.underlyingType,underlyingSubType:e.s.underlyingSubType,classification:classify(e.s),projectName:null,metadataSource:endpoints.exchange};
      const f=detect(buildFacts({runId,symbol:e.s.symbol,identity,ticker:e.t,sources,cutoff}));
      await save(`facts/${f.symbol}.json`,f);facts.push(f);
      if(!f.dataCompleteness.eligible && binance.http.signal?.aborted)rejected.push({symbol:f.symbol,reason:'SCAN_TIME_BUDGET_EXHAUSTED'});
      else if(!f.dataCompleteness.eligible || !f.anomalies.length)rejected.push({symbol:f.symbol,reason:!f.dataCompleteness.eligible?f.dataCompleteness.reason:'NO_DEEP_ANOMALY'});
    }catch(err){rejected.push({symbol:e.s.symbol,reason:safeError(err)});}
  }}
  await Promise.all(Array.from({length:config.concurrency},worker));
  for(const e of selected.slice(index))rejected.push({symbol:e.s.symbol,reason:'SCAN_TIME_BUDGET_EXHAUSTED'});
  const ranked=facts.filter(f=>f.dataCompleteness.eligible&&f.anomalies.length).sort((a,b)=>b.candidateScore-a.candidateScore);
  const result={runId,evaluationTime:cutoff,universeCount:exchange.raw.symbols.length,cryptoCount:eligible.length,nativeCryptoCount:crypto.length,longShortCoverage:discovery.coverage,researched: facts.length,scanBudgetExceeded:budgetSignal.aborted,httpMetrics:binance.http.metrics || null,selection:{triggerSlots:slots,rotatingLiquidityProbes:probes.length,accountAnomalyAdditions:selected.filter(e=>!original.some(o=>o.s.symbol===e.s.symbol)).length,coverage:'Original bounded probe set: 1h/OI/volume-only anomalies outside probes can be missed; rotation advances each scan. Independent global-account discovery adds all detected symbols without a candidate quota'},researchCandidates:selected.map(e=>{const f=facts.find(f=>f.symbol===e.s.symbol),rejection=rejected.find(r=>r.symbol===e.s.symbol);return {symbol:e.s.symbol,status:f?.dataCompleteness.eligible&&f.anomalies.length?'FACTS_READY':rejection?.reason==='SCAN_TIME_BUDGET_EXHAUSTED'?'NOT_EVALUATED':f&&!f.dataCompleteness.eligible?'INSUFFICIENT_EVIDENCE':f?'NOT_NEWSWORTHY':'DATA_ERROR',reason:rejection?.reason || null};}),candidates:ranked.map(f=>({symbol:f.symbol,candidateScore:f.candidateScore,anomalies:f.anomalies})),rejected};
  await save('scan.json',result);return {result,facts:ranked};
}
