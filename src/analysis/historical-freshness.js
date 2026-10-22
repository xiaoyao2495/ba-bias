// Epoch milliseconds from Facts/History only; never wall-clock or completion time.
export function historicalFreshness(currentFactsAsOf,historicalFactsAsOf,hours){
 if(!Number.isSafeInteger(hours)||hours<=0||!Number.isSafeInteger(hours*3600000))throw Error('INVALID_PREVIOUS_RESEARCH_FRESHNESS');
 const windowMs=hours*3600000;
 if(!Number.isSafeInteger(currentFactsAsOf)||currentFactsAsOf<=0||!Number.isSafeInteger(historicalFactsAsOf)||historicalFactsAsOf<=0)return {status:'INSUFFICIENT_HISTORICAL_EVIDENCE',ageMs:null,windowMs};
 const ageMs=currentFactsAsOf-historicalFactsAsOf;
 if(!Number.isSafeInteger(ageMs))return {status:'INSUFFICIENT_HISTORICAL_EVIDENCE',ageMs:null,windowMs};
 return {status:ageMs<=0?'INVALID_OR_NON_PRIOR_HISTORY':ageMs>windowMs?'EXPIRED_FOR_CURRENT_COMPARISON':'WITHIN_FRESHNESS_WINDOW',ageMs,windowMs};
}
