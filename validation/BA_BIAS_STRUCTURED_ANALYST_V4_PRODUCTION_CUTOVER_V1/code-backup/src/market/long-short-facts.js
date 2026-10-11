import Big from 'big.js';
import {times} from '../config.js';
import {endpoints} from '../clients/binance.js';
export const HOUR=3600000;
const definitions={
  global:{endpoint:endpoints.accounts,scope:'GLOBAL_ACCOUNTS',label:'全市场净多/净空头账户',prefix:'global',positions:false},
  topAccounts:{endpoint:endpoints.topAccounts,scope:'TOP_TRADER_ACCOUNTS',label:'顶部交易员净多/净空头账户',prefix:'topAccounts',positions:false},
  topPositions:{endpoint:endpoints.topPositions,scope:'TOP_TRADER_POSITIONS',label:'顶部交易员多/空持仓份额',prefix:'topPositions',positions:true}
};
const side=p=>new Big(p).gt(50)?'LONG':new Big(p).lt(50)?'SHORT':'BALANCED';
const decimal=v=>v!==null&&v!==undefined&&v!==''&&new Big(v);
// Binance publishes rounded fractions and ratios independently. Check agreement
// within their published four-decimal precision rather than requiring equality.
export function longShortRowError(r,symbol){
  if(r?.symbol!==symbol)return 'SYMBOL_MISMATCH';
  if(!Number.isSafeInteger(r.timestamp)||r.timestamp<0)return 'INVALID_HOURLY_TIMESTAMP';
  try{
    const l=decimal(r.longAccount),s=decimal(r.shortAccount),ratio=decimal(r.longShortRatio);
    if(!l||!s||!ratio||l.lt(0)||l.gt(1)||s.lte(0)||s.gt(1)||ratio.lt(0))return 'INVALID_RATIO_OR_DENOMINATOR';
    if(l.plus(s).minus(1).abs().gt('0.0002'))return 'SHARES_DO_NOT_SUM_TO_ONE';
    // Compare l - ratio*s: tolerates independent rounding even near s=0.
    if(l.minus(ratio.times(s)).abs().gt(new Big('0.00015').times(ratio.plus(1))))return 'RATIO_INCONSISTENT';
    return null;
  }catch{return 'NON_NUMERIC_RATIO';}
}
export function parseLongShortSeries(source,symbol,cutoff,kind='global'){
  const d=definitions[kind];if(!d)throw new Error('UNKNOWN_LONG_SHORT_SCOPE');
  const evidence=[],issues=[],rows=[];
  let reason=source?.error || (!source?'SOURCE_MISSING':null);
  if(!reason&&(source.endpoint!==d.endpoint||source.params?.symbol!==symbol||source.params?.period!=='1h'))reason='SOURCE_SYMBOL_PERIOD_OR_ENDPOINT_MISMATCH';
  if(!reason&&!Array.isArray(source.raw))reason='INVALID_RESPONSE';
  const raw=Array.isArray(source?.raw)?source.raw:[];
  const counts=new Map();for(const r of raw)if(Number.isSafeInteger(r?.timestamp)&&r.timestamp<=cutoff)counts.set(r.timestamp,(counts.get(r.timestamp)||0)+1);
  if(!reason)for(const r of raw){
    if(Number.isSafeInteger(r?.timestamp)&&r.timestamp>cutoff){issues.push({timestamp:r.timestamp,reason:'FUTURE_SAMPLE_EXCLUDED'});continue;}
    const error=longShortRowError(r,symbol)||(counts.get(r.timestamp)>1?'DUPLICATE_TIMESTAMP':null);
    if(error){issues.push({timestamp:r?.timestamp ?? null,reason:error});continue;}
    rows.push({...r,longPct:new Big(r.longAccount).times(100).toFixed(8),shortPct:new Big(r.shortAccount).times(100).toFixed(8)});
  }
  rows.sort((a,b)=>a.timestamp-b.timestamp);
  const latest=rows.at(-1);
  const rawLatest=raw.reduce((t,r)=>Number.isSafeInteger(r?.timestamp)&&r.timestamp<=cutoff?Math.max(t,r.timestamp):t,-1);
  if(!reason&&latest&&latest.timestamp!==rawLatest)reason='LATEST_SAMPLE_INVALID';
  // Use the API's actual end sample, with a strict one-hour freshness bound.
  // Exact h*HOUR offsets below support a consistent non-zero sampling phase;
  // no wall-clock rounding or nearby point is substituted for either endpoint.
  const expected=latest?.timestamp ?? Math.floor(cutoff/HOUR)*HOUR;
  if(!reason&&(!latest||cutoff-latest.timestamp>=HOUR))reason=latest?'LATEST_EXACT_SAMPLE_MISSING_OR_STALE':'NO_VALID_SAMPLES';
  const result={valueUnit:'percent',changeUnit:'percentage_points',scope:d.scope,symbol,period:'1h',source:{endpoint:d.endpoint,params:source?.params ?? null,retrievedAt:source?.retrievedAt ?? null,error:source?.error ?? null},raw,
    samples:rows,dataTimestamp:reason?null:latest.timestamp,sampleStart:rows[0]?.timestamp ?? null,sampleEnd:latest?.timestamp ?? null,
    quality:{available:!reason,reason,issues,latestSampleAnchor:reason?null:expected,freshnessLimitMs:HOUR,validSamples:rows.length},windows:{},evidence};
  const add=(id,selection,value,formula,phrase)=>{
    const e={evidenceId:`${symbol}:${d.prefix}.${id}`,scope:d.scope,endpoint:d.endpoint,params:source.params,retrievedAt:source.retrievedAt ?? null,raw:selection,
      dataTimes:selection.map(r=>times(r.timestamp)),timestampMeaning:'Binance hourly statistical sample timestamp; not trade or settlement time',formula,result:value,phrase};
    evidence.push(e);return e;
  };
  const longKey=d.positions?'topLongPositionShare':'latestLongAccountPct',shortKey=d.positions?'topShortPositionShare':'latestShortAccountPct';
  result[longKey]=reason?null:latest.longPct;result[shortKey]=reason?null:latest.shortPct;
  if(!reason){add('long.latest',[latest],latest.longPct,'longAccount * 100',`${d.label}：多 ${new Big(latest.longPct).toFixed(2)}%、空 ${new Big(latest.shortPct).toFixed(2)}%（${d.positions?'不是全市场OI的多空占比':'账户比例不代表仓位或资金比例'}）`);}
  for(const h of [1,4,24]){
    const start=rows.find(r=>r.timestamp===expected-h*HOUR);
    const selected=rows.filter(r=>r.timestamp>=expected-h*HOUR&&r.timestamp<=expected);
    const why=reason || (!start?'EXACT_START_SAMPLE_MISSING':selected.length!==h+1||selected.some((r,i)=>r.timestamp!==expected-(h-i)*HOUR)?'NON_CONTINUOUS_SAMPLES':null);
    const long=why?null:new Big(latest.longPct).minus(start.longPct).toFixed(8),short=why?null:new Big(latest.shortPct).minus(start.shortPct).toFixed(8);
    result.windows[h+'h']={from:expected-h*HOUR,to:expected,longChangePp:long,shortChangePp:short,reason:why,evidenceIds:[]};
    const key=d.positions?'topLongPositionShareChange':'longAccountChange';result[key+h+'hPp']=long;
    const sk=d.positions?'topShortPositionShareChange':'shortAccountChange';result[sk+h+'hPp']=short;
    if(!why){const e=add(`short.change${h}h`,[start,latest],short,'(shortAccount_end - shortAccount_start) * 100; percentage points',`${d.label}空方占比${h}小时从 ${new Big(start.shortPct).toFixed(2)}% 到 ${new Big(latest.shortPct).toFixed(2)}%，变化 ${new Big(short).toFixed(2)} 个百分点；多方变化 ${new Big(long).toFixed(2)} 个百分点`);const le={...e,evidenceId:`${symbol}:${d.prefix}.long.change${h}h`,formula:'(longAccount_end - longAccount_start) * 100; percentage points',result:long};evidence.push(le);result.windows[h+'h'].evidenceIds=[e.evidenceId,le.evidenceId];}
  }
  if(!d.positions){
    result.currentDominantSide=reason?null:side(latest.longPct);
    const previous=rows.find(r=>r.timestamp===expected-HOUR);
    result.previousDominantSide=reason||!previous?null:side(previous.longPct);
    result.dominanceFlip=false;result.flip={status:'UNAVAILABLE',from:null,to:null,timestamp:null,confirmationSamples:0,evidenceId:null};
    // Follow consecutive samples backwards to the most recent opposite side.
    // Equal 50/50 or a gap never confirms a flip. A return after one sample is
    // explicitly labelled transient; a run of >=2 new-side samples is confirmed.
    if(!reason&&previous){
      const current=result.currentDominantSide;let i=rows.length-1,count=0;
      while(i>=0&&side(rows[i].longPct)===current&&rows[i].timestamp===expected-count*HOUR&&current!=='BALANCED'){count++;i--;}
      const before=rows[i],opposite=before&&before.timestamp===expected-count*HOUR&&side(before.longPct)!=='BALANCED'&&side(before.longPct)!==current;
      result.flip={status:'NONE',from:null,to:current,timestamp:null,confirmationSamples:count,evidenceId:null};
      if(opposite&&count<=24){
        const earlier=rows[i-1];
        const transient=count===1&&earlier?.timestamp===before.timestamp-HOUR&&side(earlier.longPct)===current;
        const status=transient?'TRANSIENT_RETURN':count>=2?'CONFIRMED':'SINGLE_SAMPLE';
        result.dominanceFlip=true;
        const e=add('flip',[before,...rows.slice(i+1)],status,'strict crossing of 50%; consecutive hourly samples; no price direction inference',`${d.label}主导侧 ${side(before.longPct)} → ${current}；${status==='CONFIRMED'?'后续连续样本确认':status==='TRANSIENT_RETURN'?'单小时翻转后返回，属短暂翻转':'仅单个样本，尚未持续确认'}（不代表价格趋势反转）`);
        result.flip={status,from:side(before.longPct),to:current,timestamp:rows[i+1].timestamp,confirmationSamples:count,evidenceId:e.evidenceId};
      }
    }
  }
  return result;
}
export function buildLongShortFacts(sources,symbol,cutoff){
  const global=parseLongShortSeries(sources.accounts,symbol,cutoff,'global');
  const topAccounts=parseLongShortSeries(sources.topAccounts,symbol,cutoff,'topAccounts');
  const topPositions=parseLongShortSeries(sources.topPositions,symbol,cutoff,'topPositions');
  const evidence=[...global.evidence,...topAccounts.evidence,...topPositions.evidence];
  const aligned=global.quality.available&&topAccounts.quality.available&&global.period===topAccounts.period&&global.dataTimestamp===topAccounts.dataTimestamp;
  const g=global.windows['4h'],t=topAccounts.windows['4h'];
  const divergence={scope:'TOP_TRADER_ACCOUNTS_VS_GLOBAL_ACCOUNTS',period:'1h',dataTimestamp:aligned?global.dataTimestamp:null,
    gapPp:aligned?new Big(topAccounts.latestLongAccountPct).minus(global.latestLongAccountPct).toFixed(8):null,
    globalLongChange4hPp:aligned?g.longChangePp:null,topLongChange4hPp:aligned?t.longChangePp:null,
    reason:aligned?null:'ACCOUNT_SAMPLES_NOT_ALIGNED_OR_UNAVAILABLE',changeReason:aligned?(g.reason||t.reason):'ACCOUNT_SAMPLES_NOT_ALIGNED_OR_UNAVAILABLE',evidenceId:null};
  if(aligned){
    const selected=[global.samples.at(-1),topAccounts.samples.at(-1)],hasChange=!divergence.changeReason;
    const e={evidenceId:`${symbol}:topGlobal.divergence`,scope:divergence.scope,endpoint:[global.source.endpoint,topAccounts.source.endpoint].join(' + '),
      sources:[global.source,topAccounts.source],params:{symbol,period:'1h'},raw:{global:hasChange?[global.samples.find(r=>r.timestamp===g.from),selected[0]]:[selected[0]],topAccounts:hasChange?[topAccounts.samples.find(r=>r.timestamp===t.from),selected[1]]:[selected[1]]},
      dataTimes:(hasChange?[g.from,global.dataTimestamp]:[global.dataTimestamp]).map(times),timestampMeaning:'exact matched hourly account samples',formula:'top longAccount% - global longAccount%; exact 4h change directions when available',result:divergence.gapPp,
      phrase:`同时间顶部与全市场多头账户占比差 ${new Big(divergence.gapPp).toFixed(2)} 个百分点${hasChange?`；4小时多头账户变化分别 ${new Big(t.longChangePp).toFixed(2)} / ${new Big(g.longChangePp).toFixed(2)} 个百分点`: '；4小时变化样本不足'}（账户口径，不能预测价格反转）`};
    evidence.push(e);divergence.evidenceId=e.evidenceId;
  }
  return {version:1,global,topAccounts,topPositions,divergence,evidence,interpretationBoundary:'账户分布、顶部持仓份额均不能确认具体开平仓行为、资金流向、聪明钱观点或价格反转'};
}
