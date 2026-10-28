import {INTERVAL,TREND_SIMPLE_CONFIG as C} from './config.js';
export function validateCandles(rows,evaluationTime,{minimum=C.candles.minimumWarmupBars,latestRequired=true}={}){
 if(!Number.isSafeInteger(evaluationTime)||evaluationTime%INTERVAL)throw Error('INVALID_EVALUATION_TIME');
 if(!Array.isArray(rows)||rows.length<minimum)throw Error('INSUFFICIENT_WARMUP');
 return rows.map((r,i)=>{const b=Array.isArray(r)?{openTime:r[0],open:Number(r[1]),high:Number(r[2]),low:Number(r[3]),close:Number(r[4]),volume:Number(r[5]),exchangeCloseTime:r[6]}:{...r};
  if(!Number.isSafeInteger(b.openTime)||b.openTime%INTERVAL||i&&b.openTime!==rows[i-1].openTime+INTERVAL&&!Array.isArray(rows[i-1]))throw Error('INVALID_CANDLE_TIME');
  if(i&&b.openTime!==(Array.isArray(rows[i-1])?rows[i-1][0]:rows[i-1].openTime)+INTERVAL)throw Error('CANDLE_GAP_OR_DUPLICATE');
  if(b.openTime+INTERVAL>evaluationTime)throw Error('UNCLOSED_CANDLE');if(b.exchangeCloseTime!==undefined&&b.exchangeCloseTime!==b.openTime+INTERVAL-1)throw Error('INVALID_EXCHANGE_CLOSE');
  if(![b.open,b.high,b.low,b.close].every(x=>Number.isFinite(x)&&x>0)||!Number.isFinite(b.volume)||b.volume<0||b.high<Math.max(b.open,b.close)||b.low>Math.min(b.open,b.close)||b.low>b.high)throw Error('INVALID_OHLCV');
  if(latestRequired&&i===rows.length-1&&b.openTime+INTERVAL!==evaluationTime)throw Error('STALE_CANDLE');return {openTime:b.openTime,intervalEnd:b.openTime+INTERVAL,open:b.open,high:b.high,low:b.low,close:b.close,volume:b.volume};});}
