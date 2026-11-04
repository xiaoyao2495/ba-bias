import {validateCandles} from '../trend-simple/candles.js';
import {ema,indicators} from '../trend-v1/indicators.js';
import {structureAt} from '../trend-simple/structure.js';
import {INTERVAL} from '../trend-simple/config.js';

// Match V1 ER20: a flat denominator is unavailable, not zero.
export function efficiencyRatio(values, period=10) {
 if(values.length<=period)return null;
 const relevant=values.slice(-period-1);
 if(!relevant.every(Number.isFinite))throw Error('INDICATOR_CALCULATION_INVALID');
 let denominator=0;for(let i=1;i<relevant.length;i++)denominator+=Math.abs(relevant[i]-relevant[i-1]);
 return denominator===0?null:Math.abs(relevant.at(-1)-relevant[0])/denominator;
}
export function indicatorGates({ema10,ema30,adx14,adx14Prev,adx14Prev2,adx14Prev3,er10}) {
 const values=[ema10,ema30,adx14,adx14Prev,adx14Prev2,adx14Prev3,er10];
 if(values.some(v=>v===null||v===undefined))throw Error('INSUFFICIENT_INDICATORS');
 if(!values.every(Number.isFinite))throw Error('INDICATOR_CALCULATION_INVALID');
 const emaBullishAlignment=ema10>ema30,adx14Rising3=adx14>adx14Prev&&adx14Prev>adx14Prev2&&adx14Prev2>adx14Prev3;
 return {emaBullishAlignment,adx14Rising3,aIndicators:emaBullishAlignment&&(adx14>=18||adx14Rising3)&&er10>=.25,bIndicators:emaBullishAlignment&&er10>=.20};
}
export function evaluateTrendA({close,ema20,ema20Previous2,ema10,ema30,plusDI14,minusDI14,closesAboveEMA20Last8,closePrevious12}) {
 const fields={close,ema20,ema20Previous2,ema10,ema30,plusDI14,minusDI14,closesAboveEMA20Last8,closePrevious12};
 const missing=Object.entries(fields).filter(([,v])=>!Number.isFinite(v)).map(([k])=>k);
 const checks={aboveEMA20:close>ema20,emaAlignment:ema10>ema30,ema20Rising:ema20>ema20Previous2,diBullish:plusDI14>minusDI14,aboveEMA20Count:closesAboveEMA20Last8>=5,positiveChange12:close>closePrevious12};
 return {eligible:missing.length===0&&Object.values(checks).every(Boolean),checks,missing};
}
// The caller supplies only bars closed at cutoff; each prefix recomputes structure causally.
function at(bars,t,{aMultiplier,bMultiplier,hlGraceBars}) {
 const n=bars.length, series=indicators(bars),current=series[n-1],prev=series[n-2],older=series[n-3];
 const close=bars[n-1].close, displacement=close-bars[n-4].close, atrPrev=prev?.atr14;
 if(![current?.ema20,older?.ema20,atrPrev,close,displacement].every(Number.isFinite)||atrPrev<=0)throw Error('INSUFFICIENT_INDICATORS');
 const closes=bars.map(b=>b.close);
 let ema10=null,ema30=null,adx14=null,adx14Prev=null,er10=null,emaBullishAlignment=null,adx14Rising3=null,indicatorStatus='AVAILABLE';
 try {
  const finite=x=>Number.isFinite(x)?x:null;
  ema10=finite(ema(closes,10).at(-1));ema30=finite(ema(closes,30).at(-1));
  adx14=finite(current.adx14);adx14Prev=finite(prev.adx14);er10=finite(efficiencyRatio(closes,10));
  if(ema10!==null&&ema30!==null)emaBullishAlignment=ema10>ema30;
  const adxSequence=[current.adx14,prev.adx14,older.adx14,series[n-4]?.adx14];
  if(adxSequence.every(Number.isFinite))adx14Rising3=adxSequence[0]>adxSequence[1]&&adxSequence[1]>adxSequence[2]&&adxSequence[2]>adxSequence[3];
  if([ema10,ema30,adx14,adx14Prev,er10,adx14Rising3].some(x=>x===null))indicatorStatus='PARTIAL';
 } catch { indicatorStatus='ERROR'; }
 let upClosesLast3=0;for(let j=n-3;j<n;j++)if(bars[j].close>bars[j-1].close)upClosesLast3++;
 const common=close>current.ema20;
 const trend=evaluateTrendA({close,ema20:current.ema20,ema20Previous2:older.ema20,ema10,ema30,plusDI14:current.plusDI14,minusDI14:current.minusDI14,closesAboveEMA20Last8:current.barsCloseAboveEma20Last8,closePrevious12:bars[n-13]?.close});
 const A=trend.eligible;
 const structure=structureAt(bars),swings=structure.canonicalSwings;
 const hl=swings.filter(s=>s.type==='LOW'&&s.classification==='HL'&&s.confirmedAt<=t&&t-s.confirmedAt<=hlGraceBars*INTERVAL&&!structure.events.some(e=>e.referencePivotId===s.id)&&!bars.some(b=>b.openTime+INTERVAL>=s.confirmedAt&&b.close<s.price)).at(-1);
 const B=!!hl&&common&&close>bars[n-2].close&&displacement>=bMultiplier*atrPrev;
 return {A,B,ema10,ema30,adx14,adx14Prev,adx14Rising3,er10,er20:Number.isFinite(current.er20)?current.er20:null,emaBullishAlignment,indicatorStatus,ema20Previous2:older.ema20,plusDI14:Number.isFinite(current.plusDI14)?current.plusDI14:null,minusDI14:Number.isFinite(current.minusDI14)?current.minusDI14:null,closesAboveEMA20Last8:current.barsCloseAboveEma20Last8??null,netChange12:Number.isFinite(bars[n-13]?.close)?close-bars[n-13].close:null,netChange12Pct:Number.isFinite(bars[n-13]?.close)?(close/bars[n-13].close-1)*100:null,aConditions:trend,hl:B?{id:hl.id,price:hl.price,pivotOpenTime:hl.pivotOpenTime,confirmedAt:hl.confirmedAt,lockStatus:hl.lockStatus}:null,close,ema20:current.ema20,atr14Prev:atrPrev,displacement,displacementAtr:displacement/atrPrev,upClosesLast3};
}
export function evaluateCandidate(symbol,rows,evaluationTime,{aMultiplier=.8,bMultiplier=.5,hlGraceBars=2}={}) {
 if(!Number.isFinite(aMultiplier)||aMultiplier<0||!Number.isFinite(bMultiplier)||bMultiplier<0||!Number.isInteger(hlGraceBars)||hlGraceBars<0)throw Error('INVALID_PARAMETERS');
 const bars=validateCandles(rows,evaluationTime),cfg={aMultiplier,bMultiplier,hlGraceBars},result=at(bars,evaluationTime,cfg);
 if(result.B){for(let n=1;n<=hlGraceBars;n++){const earlier=bars.slice(0,-n);if(earlier.length<200){result.B=false;result.hl=null;result.bReason='DEDUP_HISTORY_INSUFFICIENT';break;}const prior=at(earlier,evaluationTime-n*INTERVAL,cfg);if(prior.B&&prior.hl.id===result.hl.id){result.B=false;result.hl=null;break;}}}
 return {symbol,evaluationTime,...result,candidate:result.A||result.B};
}
