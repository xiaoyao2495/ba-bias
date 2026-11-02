import {validateCandles} from '../trend-simple/candles.js';
import {indicators} from '../trend-v1/indicators.js';
import {structureAt} from '../trend-simple/structure.js';
import {INTERVAL} from '../trend-simple/config.js';

// The caller supplies only bars closed at cutoff; each prefix recomputes structure causally.
function at(bars,t,{aMultiplier,bMultiplier,hlGraceBars}) {
 const n=bars.length, series=indicators(bars),current=series[n-1],prev=series[n-2],older=series[n-3];
 const close=bars[n-1].close, displacement=close-bars[n-4].close, atrPrev=prev?.atr14;
 if(![current?.ema20,older?.ema20,atrPrev,close,displacement].every(Number.isFinite)||atrPrev<=0)throw Error('INSUFFICIENT_INDICATORS');
 let upClosesLast3=0;for(let j=n-3;j<n;j++)if(bars[j].close>bars[j-1].close)upClosesLast3++;
 const common=close>current.ema20;
 const A=common&&current.ema20>older.ema20&&displacement>=aMultiplier*atrPrev&&upClosesLast3>=2;
 const structure=structureAt(bars),swings=structure.canonicalSwings;
 const hl=swings.filter(s=>s.type==='LOW'&&s.classification==='HL'&&s.confirmedAt<=t&&t-s.confirmedAt<=hlGraceBars*INTERVAL&&!structure.events.some(e=>e.referencePivotId===s.id)&&!bars.some(b=>b.openTime+INTERVAL>=s.confirmedAt&&b.close<s.price)).at(-1);
 const B=!!hl&&common&&close>bars[n-2].close&&displacement>=bMultiplier*atrPrev;
 return {A,B,hl:B?{id:hl.id,price:hl.price,pivotOpenTime:hl.pivotOpenTime,confirmedAt:hl.confirmedAt,lockStatus:hl.lockStatus}:null,close,ema20:current.ema20,atr14Prev:atrPrev,displacement,displacementAtr:displacement/atrPrev,upClosesLast3};
}
export function evaluateCandidate(symbol,rows,evaluationTime,{aMultiplier=.8,bMultiplier=.5,hlGraceBars=2}={}) {
 if(!Number.isFinite(aMultiplier)||aMultiplier<0||!Number.isFinite(bMultiplier)||bMultiplier<0||!Number.isInteger(hlGraceBars)||hlGraceBars<0)throw Error('INVALID_PARAMETERS');
 const bars=validateCandles(rows,evaluationTime),cfg={aMultiplier,bMultiplier,hlGraceBars},result=at(bars,evaluationTime,cfg);
 if(result.B){for(let n=1;n<=hlGraceBars;n++){const earlier=bars.slice(0,-n);if(earlier.length<200){result.B=false;result.hl=null;result.bReason='DEDUP_HISTORY_INSUFFICIENT';break;}const prior=at(earlier,evaluationTime-n*INTERVAL,cfg);if(prior.B&&prior.hl.id===result.hl.id){result.B=false;result.hl=null;break;}}}
 return {symbol,evaluationTime,...result,candidate:result.A||result.B};
}
