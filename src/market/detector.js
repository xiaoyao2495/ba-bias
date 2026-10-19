import {detectLongShort} from './long-short-detector.js';
import {config} from '../config.js';
import Big from 'big.js';
const tradfi=/STOCK|EQUITY|TRADFI|COMMOD|FOREX|ETF|GOLD|SILVER|OIL|BOND|TREASURY|TOKENIZED|RWA|INDEX/i;
const excludedBase=/^(XAU|XAG|XAUT|PAXG|GOLD|SILVER|OIL|WTI|BRENT|EUR|GBP|JPY|AUD|CHF|CNH|SPX|SP500|NDX|NAS100|US30|DOW|AAPL|TSLA|NVDA|MSFT|AMZN|GOOGL|META|COIN|PLTR|MSTR)(USDT|X)?$/i;
export function classify(s) {
  if(s.status!=='TRADING'||s.contractType!=='PERPETUAL'||s.quoteAsset!=='USDT')return {eligible:false,reason:'NOT_TRADING_USDT_PERPETUAL'};
  if(excludedBase.test(s.baseAsset || '') || tradfi.test([s.underlyingType,...(s.underlyingSubType || [])].join(' ')))return {eligible:false,reason:'TRADFI_OR_TRACKER_HARD_EXCLUSION'};
  if(!/^[\p{L}\p{N}]{1,40}USDT$/u.test(s.symbol || '') || s.underlyingType!=='COIN' || !s.baseAsset || s.symbol!==s.baseAsset+'USDT' || !Array.isArray(s.underlyingSubType))return {eligible:false,reason:'AMBIGUOUS_OFFICIAL_CLASSIFICATION'};
  return {eligible:true,reason:'Official exchangeInfo COIN metadata, base/symbol match, no TradFi/tracker flags; name unverified'};
}
export function detect(f,thresholds=config.thresholds){
  const a=[];
  // Funding Facts are decimal percentage strings. Dividing by the decimal 0.1
  // in binary can turn exact 1.5/3 into values just below the research gate.
  // Decimal division preserves those boundaries without tolerances or rounding.
  const test=(kind,e,threshold)=>{if(e?.evidenceId && Math.abs(Number(e.result))>=threshold)a.push({kind,evidenceIds:[e.evidenceId],value:e.result,threshold,strength:Math.min(5,kind==='FUNDING_EXTREME'?new Big(e.result).abs().div(threshold).toNumber():Math.abs(Number(e.result))/threshold)});};
  test('PRICE_24H',f.price.rolling24h,thresholds.price24);test('PRICE_1H',f.price.closedWindows['1h'],thresholds.price1);
  test('OI_4H',f.openInterest.windows['4h'],thresholds.oi4);test('FUNDING_EXTREME',f.funding.settledLatest,thresholds.funding);
  for(const e of [f.volume.relative1h,f.volume.relative5m])if(e&&Number(e.result)>=thresholds.volume)test('VOLUME_SPIKE',e,thresholds.volume);
  if(f.funding.change && (Math.abs(Number(f.funding.change.deltaPercentagePoints))>=thresholds.fundingDelta || f.funding.change.signFlip))a.push({kind:f.funding.change.signFlip?'FUNDING_FLIP':'FUNDING_CHANGE',evidenceIds:[f.funding.change.evidenceId,f.funding.settledLatest.evidenceId],value:f.funding.change.deltaPercentagePoints,strength:1});
  a.push(...detectLongShort(f.longShort));
  f.anomalies=a;f.candidateScore=Number(a.reduce((n,x)=>n+10*x.strength,0).toFixed(2));return f;
}
