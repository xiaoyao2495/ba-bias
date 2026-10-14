import {endpoints} from '../../clients/binance.js';
import {fail} from './common.js';
const DOMAIN='BINANCE_USDM',ms=t=>Number.isSafeInteger(t)&&t>=1e12&&t<1e14;
// Engineering rejection rails, NOT tolerance added to an event or cutoff.
const MAX_RTT=2000,MAX_OFFSET=300000,MAX_SPAN=900000;
function window(s){
 if(s?.clockDomain!==DOMAIN||!ms(s.requestStartedAt)||!ms(s.retrievedAt)||s.retrievedAt<s.requestStartedAt)throw fail('SOURCE_CLOCK_EVIDENCE_INSUFFICIENT','CLOCK');
 if(!Number.isFinite(s.requestElapsedMs)||s.requestElapsedMs<0||Math.abs(s.retrievedAt-s.requestStartedAt-s.requestElapsedMs)>100)throw fail('LOCAL_CLOCK_DISCONTINUITY','CLOCK');
 return {start:s.requestStartedAt,end:s.retrievedAt};
}
export function clockEvidence(sources){
 const anchors=[sources.clockStart,sources.serverTime,sources.clockEnd].filter(Boolean);
 if(!anchors.length)throw fail('EXCHANGE_CLOCK_EVIDENCE_INSUFFICIENT','CLOCK');
 const evidence=anchors.map(s=>{
  const w=window(s);if(s.endpoint!==endpoints.time||!ms(s.raw?.serverTime))throw fail('INVALID_EXCHANGE_CLOCK_OR_UNIT','CLOCK');
  const lower=s.raw.serverTime-w.end,upper=s.raw.serverTime-w.start;
  if(w.end-w.start>MAX_RTT)throw fail('EXCHANGE_CLOCK_UNCERTAINTY_EXCESSIVE','CLOCK');
  if(Math.max(Math.abs(lower),Math.abs(upper))>MAX_OFFSET)throw fail('EXCHANGE_CLOCK_OFFSET_EXTREME','CLOCK');
  return {requestStartedAt:w.start,retrievedAt:w.end,requestElapsedMs:s.requestElapsedMs,exchangeServerTime:s.raw.serverTime,lower,upper};
 });
 const lower=Math.max(...evidence.map(a=>a.lower)),upper=Math.min(...evidence.map(a=>a.upper));
 if(lower>upper)throw fail('EXCHANGE_CLOCK_INTERVALS_INCONSISTENT','CLOCK');
 return {clockDomain:DOMAIN,lowerOffsetMs:lower,upperOffsetMs:upper,anchors:evidence,assumption:'Binance USD-M clock domain is stable within this bounded snapshot; inconsistent anchors are rejected.',historicalAvailabilityAtObservationCutoffProven:false};
}
export function validateAcquisition(source,dataTimes,cutoff,available,clock){
 const w=window(source);if(!ms(cutoff)||!ms(available)||dataTimes.some(t=>!ms(t)))throw fail('INVALID_SOURCE_TIME_UNIT','CLOCK');
 if(w.end>available)throw fail('SOURCE_NOT_AVAILABLE_AT_FREEZE','CLOCK');
 const first=Math.min(...clock.anchors.map(a=>a.requestStartedAt)),last=Math.max(...clock.anchors.map(a=>a.retrievedAt));
 if(w.start<first-MAX_SPAN||w.end>last+MAX_SPAN||last-first>MAX_SPAN)throw fail('EXCHANGE_CLOCK_EVIDENCE_STALE','CLOCK');
 // All event/window times stay in EXCHANGE time. No calibrated tolerance on cutoff.
 if(dataTimes.some(t=>t>cutoff))throw fail('FUTURE_OR_INVALID_FACT_TIME','FACT_GUARD');
 // Earliest exchange-time receive compatible with observed RTT interval.
 if(dataTimes.some(t=>t>w.end+clock.lowerOffsetMs))throw fail('SOURCE_AVAILABLE_TIME_CONFLICT','CLOCK');
 return {clockDomain:DOMAIN,requestStartedAt:w.start,responseReceivedAt:w.end,earliestExchangeReceiveTime:w.end+clock.lowerOffsetMs,latestExchangeReceiveTime:w.end+clock.upperOffsetMs,availableBeforeInputFreeze:true,observationCutoffProven:true};
}
export function inputAsOfAvailable(input){
 const c=input.sourceTimeValidation;
 if(!c)return input.factsAsOf<=input.factsAvailableAt; // old immutable records/explicit mock compatibility
 try{
  const sources=Object.fromEntries(c.anchors.map((a,i)=>[['clockStart','serverTime','clockEnd'][i],{endpoint:endpoints.time,clockDomain:DOMAIN,requestStartedAt:a.requestStartedAt,retrievedAt:a.retrievedAt,requestElapsedMs:a.requestElapsedMs,raw:{serverTime:a.exchangeServerTime}}]));
  const verified=clockEvidence(sources);
  return verified.lowerOffsetMs===c.lowerOffsetMs&&verified.upperOffsetMs===c.upperOffsetMs&&input.factsAsOf<=input.factsAvailableAt+verified.lowerOffsetMs;
 }catch{return false;}
}
