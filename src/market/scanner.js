import Big from 'big.js';
import {discoverAccounts} from './long-short-discovery.js';
import {config,safeError} from '../config.js';
import {endpoints} from '../clients/binance.js';
import {classify,detect} from './detector.js';
import {buildFacts,valid} from './facts-engine.js';
import {scanDiagnostics,scanCounts} from './run-diagnostics.js';
export const MIN_QUOTE_VOLUME_24H=10000000; // USDT; strict greater-than admission.
export async function scan(binance,options){
  const previousSignal=binance.http.signal;
  const budgetSignal=AbortSignal.timeout(config.scanTimeoutMs);
  binance.http.signal=previousSignal?AbortSignal.any([previousSignal,budgetSignal]):budgetSignal;
  try{return await scanInternal(binance,{...options,budgetSignal});}finally{binance.http.signal=previousSignal;}
}
async function scanInternal(binance,{runId,history,save,budgetSignal,scheduledAt=null,onDiagnostics,diagnosticNow=Date.now}){
  const time=await binance.get(endpoints.time);
  const initial=time.raw.serverTime;
  const exchange=await binance.get(endpoints.exchange);
  const tickerSource=await binance.get(endpoints.ticker);
  const premiumSource=await binance.get(endpoints.premium);
  const end=await binance.get(endpoints.time);
  const cutoff=end.raw.serverTime;
  if(!Number.isSafeInteger(initial)||!Number.isSafeInteger(cutoff)||cutoff<initial)throw new Error('INVALID_SERVER_TIME');
  const diagnostics=scanDiagnostics({runId,scheduledAt,cutoff,symbols:exchange.raw.symbols,now:diagnosticNow}),diagnosticRows=new Map(diagnostics.rows.map(r=>[r.symbol,r]));
  onDiagnostics?.(diagnostics);
  const limit=exchange.raw.rateLimits?.find(r=>r.rateLimitType==='REQUEST_WEIGHT'&&r.interval==='MINUTE')?.limit;
  if(limit)binance.http.weightLimit=limit;
  let fundingInfo;
  try{fundingInfo=await binance.get(endpoints.fundingInfo);}catch(e){fundingInfo={endpoint:endpoints.fundingInfo,params:{},raw:[],error:safeError(e)};}
  const rejected=[],eligible=[],crypto=[];
  const tickers=new Map(tickerSource.raw.map(t=>[t.symbol,t])),premiums=new Map(premiumSource.raw.map(t=>[t.symbol,t]));
  for(const s of exchange.raw.symbols){const c=classify(s),d=diagnosticRows.get(s.symbol);d.identity=c;if(!c.eligible){rejected.push({symbol:s.symbol,reason:c.reason});continue;}
    crypto.push(s);
    const t=tickers.get(s.symbol),p=premiums.get(s.symbol);
    if(!t || !valid(t.priceChangePercent)||!valid(t.quoteVolume)){d.liquidity={eligible:false,reason:'INVALID_TICKER'};rejected.push({symbol:s.symbol,reason:'INVALID_TICKER'});continue;}
    if(!new Big(t.quoteVolume).gt(MIN_QUOTE_VOLUME_24H)){d.liquidity={eligible:false,reason:'QUOTE_VOLUME_24H_NOT_ABOVE_MINIMUM'};rejected.push({symbol:s.symbol,reason:'QUOTE_VOLUME_24H_NOT_ABOVE_MINIMUM',quoteVolume24h:t.quoteVolume,minimumExclusive:MIN_QUOTE_VOLUME_24H});continue;}
    d.liquidity={eligible:true,reason:null};
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
  const triggeredSymbols=new Set(triggered.map(e=>e.s.symbol)),probeSymbols=new Set(probes.map(e=>e.s.symbol));
  for(const e of eligible){const d=diagnosticRows.get(e.s.symbol);d.trigger={matched:e.trigger,selected:triggeredSymbols.has(e.s.symbol),reason:e.trigger?(triggeredSymbols.has(e.s.symbol)?'TRIGGER_SELECTED':'TRIGGER_RANK_BELOW_BUDGET'):'NO_INITIAL_TRIGGER'};d.rotation={selected:probeSymbols.has(e.s.symbol),reason:triggeredSymbols.has(e.s.symbol)?'ALREADY_TRIGGER_SELECTED':probeSymbols.has(e.s.symbol)?'ROTATION_SELECTED':'NO_ROTATION_OPPORTUNITY'};}
  const discovery=await discoverAccounts(binance,{symbols:eligible.map(e=>e.s.symbol),cutoff,history,save});
  diagnostics.accountCoverage={requested:discovery.coverage.requested,fullyEvaluated:discovery.coverage.fullyEvaluated,insufficientData:discovery.coverage.insufficientData,budgetExceeded:discovery.coverage.budgetExceeded};
  for(const entry of discovery.coverage.entries||[]){const d=diagnosticRows.get(entry.symbol);if(d)d.accountDiscovery={status:entry.status,complete:entry.complete??false,reason:entry.reason??null,anomalyKinds:entry.anomalyKinds||[]};}
  for(const d of diagnostics.rows)if(!d.liquidity?.eligible)d.accountDiscovery={status:'NOT_APPLICABLE',reason:'NOT_IN_LIQUIDITY_POOL'};
  const original=[...triggered,...probes];
  const selected=[...new Map([...original,...eligible.filter(e=>discovery.anomalous.has(e.s.symbol))].map(e=>[e.s.symbol,e])).values()],facts=[];
  for(const e of selected){const d=diagnosticRows.get(e.s.symbol);d.deep.planned=true;d.deep.status='PLANNED';d.deep.channels=[...(triggeredSymbols.has(e.s.symbol)?['TRIGGER']:[]),...(probeSymbols.has(e.s.symbol)?['ROTATION']:[]),...(discovery.anomalous.has(e.s.symbol)?['ACCOUNT_ANOMALY']:[])];}
  history.rotation=liquid.length?(rotation+probes.length)%liquid.length:0;
  history.snapshot=Object.fromEntries(eligible.map(e=>[e.s.symbol,{rate:e.p?.lastFundingRate ?? null,time:e.p?.time ?? null}]));
  let index=0;
  async function worker(){while(index<selected.length){if(binance.http.signal?.aborted)return;const e=selected[index++],d=diagnosticRows.get(e.s.symbol).deep;d.startedAt=diagnosticNow();d.status='STARTED';
    try{
      const sources={clockStart:time,serverTime:end,exchange:{...exchange,raw:e.s},ticker:{...tickerSource,raw:e.t},premium:{...premiumSource,raw:e.p || null},fundingInfo:{...fundingInfo,raw:fundingInfo.raw.filter(r=>r.symbol===e.s.symbol)}};
      for(const [key,endpoint,params] of [
        ['hour',endpoints.klines,{symbol:e.s.symbol,interval:'1h',limit:80,endTime:cutoff}],
        ['five',endpoints.klines,{symbol:e.s.symbol,interval:'5m',limit:40,endTime:cutoff}],
        ['oi',endpoints.oi,{symbol:e.s.symbol,period:'1h',limit:30,endTime:cutoff}],
        ['funding',endpoints.funding,{symbol:e.s.symbol,startTime:cutoff-172800000,endTime:cutoff,limit:1000}],
        ['accounts',endpoints.accounts,{symbol:e.s.symbol,period:'1h',limit:config.longShort.sampleLimit,endTime:cutoff}],
        ['topAccounts',endpoints.topAccounts,{symbol:e.s.symbol,period:'1h',limit:config.longShort.sampleLimit,endTime:cutoff}],
        ['topPositions',endpoints.topPositions,{symbol:e.s.symbol,period:'1h',limit:config.longShort.sampleLimit,endTime:cutoff}]
      ]){try{sources[key]=key==='accounts'&&discovery.sources.has(e.s.symbol)?discovery.sources.get(e.s.symbol):await binance.get(endpoint,params);}catch(err){d.sourceErrors.push({source:key,error:safeError(err)});sources[key]={endpoint,params,raw:[],retrievedAt:Date.now(),error:safeError(err)};}}
      const identity={symbol:e.s.symbol,baseAsset:e.s.baseAsset,quoteAsset:e.s.quoteAsset,underlyingType:e.s.underlyingType,underlyingSubType:e.s.underlyingSubType,classification:classify(e.s),projectName:null,metadataSource:endpoints.exchange};
      const f=detect(buildFacts({runId,symbol:e.s.symbol,identity,ticker:e.t,sources,cutoff}));
      await save(`facts/${f.symbol}.json`,f);facts.push(f);
      d.factsSaved=true;d.factsComplete=f.dataCompleteness.eligible;d.anomalyCount=f.anomalies.length;d.status=!d.factsComplete?'INSUFFICIENT_EVIDENCE':d.anomalyCount?'COMPLETE_WITH_ANOMALY':'COMPLETE_NO_ANOMALY';d.reason=!d.factsComplete?f.dataCompleteness.reason:d.anomalyCount?null:'NO_DEEP_ANOMALY';
      if(!f.dataCompleteness.eligible && binance.http.signal?.aborted)rejected.push({symbol:f.symbol,reason:'SCAN_TIME_BUDGET_EXHAUSTED'});
      else if(!f.dataCompleteness.eligible || !f.anomalies.length)rejected.push({symbol:f.symbol,reason:!f.dataCompleteness.eligible?f.dataCompleteness.reason:'NO_DEEP_ANOMALY'});
    }catch(err){d.status='FAILED';d.reason=safeError(err);rejected.push({symbol:e.s.symbol,reason:safeError(err)});}finally{d.finishedAt=diagnosticNow();}
  }}
  await Promise.all(Array.from({length:config.concurrency},worker));
  for(const e of selected.slice(index)){const d=diagnosticRows.get(e.s.symbol).deep;d.status='NOT_STARTED';d.reason=budgetSignal.aborted?'SCAN_TIME_BUDGET_EXHAUSTED':'SCAN_OR_RUN_ABORTED';rejected.push({symbol:e.s.symbol,reason:'SCAN_TIME_BUDGET_EXHAUSTED'});}
  const ranked=facts.filter(f=>f.dataCompleteness.eligible&&f.anomalies.length).sort((a,b)=>b.candidateScore-a.candidateScore);
  const result={runId,evaluationTime:cutoff,universeCount:exchange.raw.symbols.length,cryptoCount:eligible.length,nativeCryptoCount:crypto.length,liquidityFilter:{field:'quoteVolume',endpoint:endpoints.ticker,window:'rolling24h',unit:'USDT',operator:'>',minimum:MIN_QUOTE_VOLUME_24H,eligibleCount:eligible.length,rejectedCount:rejected.filter(r=>r.reason==='QUOTE_VOLUME_24H_NOT_ABOVE_MINIMUM').length},longShortCoverage:discovery.coverage,researched: facts.length,scanBudgetExceeded:budgetSignal.aborted,httpMetrics:binance.http.metrics || null,selection:{triggerSlots:slots,rotatingLiquidityProbes:probes.length,accountAnomalyAdditions:selected.filter(e=>!original.some(o=>o.s.symbol===e.s.symbol)).length,coverage:'Original bounded probe set: 1h/OI/volume-only anomalies outside probes can be missed; rotation advances each scan. Independent global-account discovery adds all detected symbols without a candidate quota'},researchCandidates:selected.map(e=>{const f=facts.find(f=>f.symbol===e.s.symbol),rejection=rejected.find(r=>r.symbol===e.s.symbol);return {symbol:e.s.symbol,status:f?.dataCompleteness.eligible&&f.anomalies.length?'FACTS_READY':rejection?.reason==='SCAN_TIME_BUDGET_EXHAUSTED'?'NOT_EVALUATED':f&&!f.dataCompleteness.eligible?'INSUFFICIENT_EVIDENCE':f?'NOT_NEWSWORTHY':'DATA_ERROR',reason:rejection?.reason || null};}),candidates:ranked.map(f=>({symbol:f.symbol,candidateScore:f.candidateScore,anomalies:f.anomalies})),rejected};
  diagnostics.scanBudgetExceeded=budgetSignal.aborted;diagnostics.aborted=Boolean(binance.http.signal?.aborted);
  diagnostics.complete=true;diagnostics.finishedAt=diagnosticNow();diagnostics.counts=scanCounts(diagnostics);
  try{await save('scan-coverage.json',diagnostics);}catch(e){diagnostics.persistenceError=safeError(e);}
  result.coverageSummary={...diagnostics.counts,persistenceError:diagnostics.persistenceError??null};
  await save('scan.json',result);return {result,facts:ranked,diagnostics};
}
