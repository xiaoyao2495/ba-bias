import {config,safeError} from '../config.js';
import {endpoints} from '../clients/binance.js';
import {parseLongShortSeries} from './long-short-facts.js';
import {detectLongShort} from './long-short-detector.js';

// Uses the shared HTTP client's spacing, concurrency, retry and IP cooldowns.
// Reserve half the scan budget for deep research. Rotation ensures a timed-out
// suffix is first next hour; an unrequested symbol is never classified normal.
export async function discoverAccounts(binance,{symbols,cutoff,history,save}){
  const previousSignal=binance.http.signal;
  const phaseSignal=AbortSignal.timeout(Math.max(1,Math.min(config.longShort.discoveryTimeoutMs,Math.floor(config.scanTimeoutMs/2))));
  binance.http.signal=previousSignal?AbortSignal.any([previousSignal,phaseSignal]):phaseSignal;
  const start=(history.longShortDiscoveryRotation || 0)%Math.max(1,symbols.length);
  const ordered=symbols.map((_,i)=>symbols[(start+i)%symbols.length]);
  const sources=new Map(),entries=[],anomalous=new Set();let index=0;
  async function worker(){while(index<ordered.length){
    if(binance.http.signal.aborted)return;
    const symbol=ordered[index++],params={symbol,period:'1h',limit:config.longShort.sampleLimit,endTime:cutoff};
    let source;try{source=await binance.get(endpoints.accounts,params);}catch(err){source={endpoint:endpoints.accounts,params,raw:[],retrievedAt:Date.now(),error:safeError(err)};}
    sources.set(symbol,source);
    const metrics=parseLongShortSeries(source,symbol,cutoff,'global'),anomalies=detectLongShort({global:metrics});
    if(anomalies.length)anomalous.add(symbol);
    const complete=metrics.quality.available&&Object.values(metrics.windows).every(w=>!w.reason);
    entries.push({symbol,complete,windows:Object.fromEntries(Object.entries(metrics.windows).map(([h,w])=>[h,{evaluated:!w.reason,reason:w.reason}])),status:anomalies.length?'ANOMALY':complete?'EVALUATED_NO_ANOMALY':'INSUFFICIENT_DATA',reason:metrics.quality.reason || Object.values(metrics.windows).find(w=>w.reason)?.reason || null,anomalyKinds:anomalies.map(a=>a.kind)});
    await save(`accounts-discovery/${symbol}.json`,{symbol,evaluationTime:cutoff,source,metrics,anomalies});
  }}
  try{
    const workers=await Promise.allSettled(Array.from({length:config.concurrency},worker));
    const failed=workers.find(w=>w.status==='rejected');if(failed)throw failed.reason;
  }finally{binance.http.signal=previousSignal;}
  const pending=ordered.slice(index).map(symbol=>({symbol,status:'NOT_COVERED',reason:previousSignal?.aborted?'SCAN_OR_RUN_ABORTED':'ACCOUNT_DISCOVERY_TIME_BUDGET_EXHAUSTED'}));
  entries.push(...pending);
  history.longShortDiscoveryRotation=ordered.length?(start+index)%ordered.length:0;
  const coverage={scope:'ALL_NATIVE_CRYPTO_USDT_PERPETUALS',total:symbols.length,requested:sources.size,fullyEvaluated:entries.filter(e=>e.complete).length,insufficientData:entries.filter(e=>e.status==='INSUFFICIENT_DATA'||e.status==='ANOMALY'&&!e.complete).length,anomalous:anomalous.size,unrequested:pending,uncovered:entries.filter(e=>!e.complete),budgetExceeded:phaseSignal.aborted,entries};
  history.longShortCoverage={evaluationTime:cutoff,...coverage};
  await save('accounts-coverage.json',coverage);
  return {sources,anomalous,coverage};
}
