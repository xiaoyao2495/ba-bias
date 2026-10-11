import Big from 'big.js';
import {buildLongShortFacts,longShortRowError} from './long-short-facts.js';
import {times} from '../config.js';
Big.DP=24;
export const valid = (v,{positive=false}={}) => {
  if(v===null || v===undefined || v==='')return false;
  try {const n=new Big(v);return !positive || n.gt(0);}catch{return false;}
};
export const pct=(end,start)=>valid(end)&&valid(start,{positive:true})?new Big(end).div(start).minus(1).times(100).toFixed(8):null;
export const fundingDirection=rate=>new Big(rate).gt(0)?'多头支付空头':new Big(rate).lt(0)?'空头支付多头':'无资金费支付';
export const closedKlines=(raw,cutoff,intervalMs)=>raw.filter(k=>Array.isArray(k)&&k.length>=8 && Number.isSafeInteger(k[0]) && Number.isSafeInteger(k[6]) && k[6]<=cutoff && k[0]+intervalMs-1===k[6] && k.slice(1,5).every(v=>valid(v,{positive:true})) && valid(k[5]) && new Big(k[5]).gte(0) && valid(k[7]) && new Big(k[7]).gte(0)).sort((a,b)=>a[0]-b[0]);
export function oiWindow(raw,symbol,cutoff,hours) {
  const rows=raw.filter(r=>r.symbol===symbol && Number.isSafeInteger(r.timestamp) && r.timestamp<=cutoff && valid(r.sumOpenInterest,{positive:true}) && valid(r.sumOpenInterestValue)).sort((a,b)=>a.timestamp-b.timestamp);
  const end=rows.at(-1);if(!end || cutoff-end.timestamp>3600000)return {value:null,reason:'OI_MISSING_OR_STALE'};
  const start=rows.find(r=>r.timestamp===end.timestamp-hours*3600000);
  if(!start)return {value:null,reason:'OI_EXACT_SAMPLE_MISSING'};
  return {value:pct(end.sumOpenInterest,start.sumOpenInterest),start,end,formula:'(sumOpenInterest_end / sumOpenInterest_start - 1) * 100',unit:'API sumOpenInterest quantity; underlying coin multiplier unverified',timestampMeaning:'period_end'};
}
export function fundingRecords(raw,symbol,cutoff){
  const rows=raw.filter(r=>r.symbol===symbol && Number.isSafeInteger(r.fundingTime) && r.fundingTime<=cutoff && valid(r.fundingRate)).sort((a,b)=>a.fundingTime-b.fundingTime);
  if(new Set(rows.map(r=>r.fundingTime)).size!==rows.length)throw new Error('DUPLICATE_FUNDING_TIME');
  return rows.map(r=>({...r,percent:new Big(r.fundingRate).times(100).toFixed(8),direction:fundingDirection(r.fundingRate),time:times(r.fundingTime)}));
}
export const accountDescription=row=>`统计口径下净空头账户占比 ${new Big(row.shortAccount).times(100).toFixed(2)}%；不代表仓位、资金或散户占比`;
export function buildFacts({runId,symbol,identity,ticker,sources,cutoff,candidateScore=0}) {
  const evidence=[],warnings=[];
  const add=(id,source,raw,timestamps,formula,value,phrase)=>{
    if(value===null || value===undefined){warnings.push(`${id}: missing/invalid`);return null;}
    if(!timestamps.length || timestamps.some(t=>!Number.isSafeInteger(t)||t>cutoff)) {warnings.push(`${id}: future/invalid time`);return null;}
    const e={evidenceId:`${symbol}:${id}`,endpoint:source.endpoint,params:source.params,raw,dataTimes:timestamps.map(times),timestampMeaning:source.endpoint.includes('openInterestHist')?'period_end':source.endpoint.includes('fundingRate')?'actual_settlement':source.endpoint.includes('klines')?'kline_open_and_close_boundaries; any additional ticker timestamp is snapshot closeTime':source.endpoint.includes('AccountRatio')?'period_end':source.endpoint.includes('premiumIndex')?'display_snapshot_time':'ticker_rolling_window_openTime_and_closeTime',formula,result:value,phrase};
    evidence.push(e);return e;
  };
  const get=key=>sources[key] || {raw:[],endpoint:'unavailable',params:{}};
  const hour=closedKlines(get('hour').raw,cutoff,3600000),five=closedKlines(get('five').raw,cutoff,300000);
  const price={rolling24h:null,closedWindows:{},range:null,current:null};
  const volume={closed1h:null,relative1h:null,relative5m:null};
  const tickerSource=get('ticker');
  if(ticker && ticker.symbol===symbol && Number.isSafeInteger(ticker.closeTime) && cutoff-ticker.closeTime<=120000 && ticker.closeTime<=cutoff && valid(ticker.lastPrice,{positive:true}) && valid(ticker.openPrice,{positive:true}) && valid(ticker.highPrice,{positive:true}) && valid(ticker.lowPrice,{positive:true}) && valid(ticker.quoteVolume) && valid(ticker.priceChangePercent)) {
    const rolling=pct(ticker.lastPrice,ticker.openPrice);
    if(Math.abs(Number(rolling)-Number(ticker.priceChangePercent))>0.02)warnings.push('TICKER_PRICE_CHANGE_INCONSISTENT');
    else price.rolling24h=add('price.rolling24h',tickerSource,ticker,[ticker.openTime,ticker.closeTime],'(lastPrice/openPrice-1)*100',rolling,`滚动24小时价格变化 ${new Big(rolling).toFixed(2)}%`);
    price.current=add('price.last',tickerSource,ticker,[ticker.closeTime],'lastPrice',ticker.lastPrice,`快照最新价格 ${ticker.lastPrice} USDT`);
    volume.rollingQuote=add('volume.rolling24h',tickerSource,ticker,[ticker.openTime,ticker.closeTime],'quoteVolume',ticker.quoteVolume,`滚动24小时成交额 ${new Big(ticker.quoteVolume).toFixed(2)} USDT`);
  }else warnings.push('TICKER_MISSING_STALE_OR_FUTURE');
  for(const n of [1,4,24]){
    const bars=hour.slice(-n),expectedEnd=Math.floor((cutoff+1)/3600000)*3600000-1;
    const ok=bars.length===n && bars.at(-1)[6]===expectedEnd && bars.every((b,i)=>i===0||b[0]-bars[i-1][0]===3600000);
    price.closedWindows[n+'h']=ok?add(`price.closed${n}h`,get('hour'),bars,[bars[0][0],bars.at(-1)[6]],'(close_end/open_start-1)*100',pct(bars.at(-1)[4],bars[0][1]),`截至北京时间${times(bars.at(-1)[6]+1).shanghai.slice(11,16)}，已收盘${n}小时价格变化 ${new Big(pct(bars.at(-1)[4],bars[0][1])).toFixed(2)}%`):null;
    if(!ok)warnings.push(`CLOSED_${n}H_INCOMPLETE_OR_STALE`);
  }
  const rangeBars=hour.slice(-24);
  if(price.closedWindows['24h']) {
    const high=rangeBars.reduce((v,b)=>new Big(b[2]).gt(v)?b[2]:v,rangeBars[0][2]);
    const low=rangeBars.reduce((v,b)=>new Big(b[3]).lt(v)?b[3]:v,rangeBars[0][3]);
    price.range={high,low,lowToHigh:add('price.rangeLowHigh',get('hour'),rangeBars,[rangeBars[0][0],rangeBars.at(-1)[6]],'(high/low-1)*100',pct(high,low),`已收盘24小时区间低点至高点幅度 ${new Big(pct(high,low)).toFixed(2)}%`),drawdownToLatest:null};
    if(price.current)price.range.drawdownToLatest=add('price.drawdown',get('hour'),{klines:rangeBars,ticker},[rangeBars.at(-1)[6],ticker.closeTime],'(lastPrice/high-1)*100',pct(ticker.lastPrice,high),`已收盘24小时区间高点至快照最新价变化 ${new Big(pct(ticker.lastPrice,high)).toFixed(2)}%`);
  }
  function relative(bars,count,source,label,intervalMs) {
    const sample=bars.slice(-(count+1));
    const expectedEnd=Math.floor((cutoff+1)/intervalMs)*intervalMs-1;
    if(sample.length!==count+1 || sample.at(-1)[6]!==expectedEnd || !sample.every((b,i)=>i===0||b[0]-sample[i-1][0]===intervalMs))return null;
    const previous=sample.slice(0,-1),current=sample.at(-1);
    const mean=previous.reduce((v,b)=>v.plus(b[5]),new Big(0)).div(count);
    if(!mean.gt(0))return null;
    const value=new Big(current[5]).div(mean).toFixed(8);
    return add('volume.'+label,source,sample,[sample[0][0],current[6]],'last closed base volume / preceding '+count+' closed bars mean',value,`最近已收盘${label==='relative1h'?'1小时':'5分钟'}成交量为前${count}根均值的 ${new Big(value).toFixed(2)} 倍`);
  }
  volume.relative1h=relative(hour,24,get('hour'),'relative1h',3600000);
  volume.relative5m=relative(five,24,get('five'),'relative5m',300000);
  if(price.closedWindows['1h']){const bar=hour.at(-1);volume.closed1h=add('volume.closed1h',get('hour'),bar,[bar[0],bar[6]],'quoteAssetVolume field 7',bar[7],`最近已收盘1小时成交额 ${new Big(bar[7]).toFixed(2)} USDT`);}
  const openInterest={unit:'sumOpenInterest API quantity; do not label as underlying coin count',windows:{},nominalValue:null};
  for(const h of [1,4,24]){
    const w=oiWindow(get('oi').raw,symbol,cutoff,h);
    openInterest.windows[h+'h']=w.value===null?{value:null,reason:w.reason}:add(`oi.${h}h`,get('oi'),[w.start,w.end],[w.start.timestamp,w.end.timestamp],w.formula,w.value,`${h}小时OI数量变化 ${new Big(w.value).toFixed(2)}%（不代表资金净流入或多空加仓方向）`);
    if(w.value!==null)openInterest.nominalValue={value:w.end.sumOpenInterestValue,unit:'USDT',timestamp:w.end.timestamp,meaning:'nominal value only, not quantity growth'};
  }
  const records=fundingRecords(get('funding').raw,symbol,cutoff);
  const recent=records.filter(r=>r.fundingTime>cutoff-86400000);
  const last=records.at(-1);
  const funding={records,currentDisplay:null,settledLatest:null,sum24h:null,change:null,intervalAssumed:false,configuration:get('fundingInfo').raw};
  // History older than 24h is retained but cannot trigger a current story.
  if(last && cutoff-last.fundingTime<=86400000)funding.settledLatest=add('funding.latest',get('funding'),last,[last.fundingTime],'fundingRate*100',last.percent,`北京时间${last.time.shanghai.slice(5,16).replace('T',' ')}已结算Funding ${new Big(last.percent).toFixed(4)}%，${last.direction}`);
  if(recent.length)funding.sum24h=add('funding.sum24h',get('funding'),recent,recent.map(r=>r.fundingTime),'sum(actual settled fundingRate)*100',recent.reduce((v,r)=>v.plus(r.fundingRate),new Big(0)).times(100).toFixed(8),`过去24小时实际${recent.length}次结算费率之和 ${recent.reduce((v,r)=>v.plus(r.fundingRate),new Big(0)).times(100).toFixed(4)}%（非收益率）`);
  if(records.length>=2 && funding.settledLatest){const prev=records.at(-2);const delta=new Big(last.percent).minus(prev.percent).toFixed(8);const changeEvidence=add('funding.change',get('funding'),[prev,last],[prev.fundingTime,last.fundingTime],'(last.fundingRate - previous.fundingRate)*100',delta,`相邻实际结算Funding变化 ${new Big(delta).toFixed(4)} 个百分点（保留各周期时间，不假设周期相同）`);funding.change={evidenceId:changeEvidence.evidenceId,deltaPercentagePoints:delta,signFlip:new Big(last.fundingRate).times(prev.fundingRate).lt(0),from:prev.fundingTime,to:last.fundingTime};}
  const premium=get('premium').raw;
  if(premium?.symbol===symbol && premium.time<=cutoff && cutoff-premium.time<=120000 && valid(premium.lastFundingRate))funding.currentDisplay=add('funding.display',get('premium'),premium,[premium.time],'lastFundingRate*100; snapshot display only',new Big(premium.lastFundingRate).times(100).toFixed(8),`快照展示Funding ${new Big(premium.lastFundingRate).times(100).toFixed(4)}%（不作为历史结算记录）`);
  const accounts=(Array.isArray(get('accounts').raw)?get('accounts').raw:[]).filter(r=>r.symbol===symbol && (r.longShortRatio===undefined || !longShortRowError(r,symbol)) && r.timestamp<=cutoff && cutoff-r.timestamp<=3600000 && valid(r.shortAccount)&&valid(r.longAccount) && new Big(r.shortAccount).gte(0)&&new Big(r.shortAccount).lte(1) && new Big(r.longAccount).plus(r.shortAccount).minus(1).abs().lte('0.001')).sort((a,b)=>a.timestamp-b.timestamp).at(-1);
  const longShortAccounts=accounts?add('accounts.short',get('accounts'),accounts,[accounts.timestamp],'shortAccount*100',new Big(accounts.shortAccount).times(100).toFixed(8),accountDescription(accounts)):null;
  if(!longShortAccounts)warnings.push('ACCOUNTS_MISSING_OR_STALE');
  const longShort=buildLongShortFacts(sources,symbol,cutoff);
  evidence.push(...longShort.evidence);
  for(const key of ['global','topAccounts','topPositions'])if(!longShort[key].quality.available)warnings.push(`LONG_SHORT_${key}:${longShort[key].quality.reason}`);
  const hasOi=Boolean(openInterest.windows['4h']?.evidenceId),hasFunding=Boolean(funding.settledLatest);
  const complete=Boolean(price.rolling24h && price.closedWindows['1h'] && price.closedWindows['4h'] && price.closedWindows['24h'] && volume.relative1h && hasOi && hasFunding);
  return {schemaVersion:'BA_BIAS_FACTS_V1',runId,symbol,evaluationTime:times(cutoff),dataCutoff:cutoff,identity,candidateScore,price,volume,openInterest,funding,longShortAccounts,longShort,anomalies:[],evidence,warnings,dataCompleteness:{eligible:complete,reason:complete?null:'CORE_PRICE_VOLUME_OI_FUNDING_INCOMPLETE',hasOi,hasFunding},sources};
}
