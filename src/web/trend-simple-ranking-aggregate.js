const SYMBOL=/^[\p{L}\p{N}]{1,40}USDT$/u;
const finite=value=>typeof value==='number'&&Number.isFinite(value)?value:null;
const category=value=>['BOTH_BULLISH','INDICATOR_BULLISH','STRUCTURE_BULLISH'].includes(value)?value:null;

export function aggregateRankingSnapshots(snapshots,windowSize=6){
 const rounds=(Array.isArray(snapshots)?snapshots:[]).filter(x=>x?.schemaVersion==='BULL_CANDIDATE_RANKING_V1'&&Array.isArray(x.candidates)).slice(0,windowSize);
 const rows=new Map();
 for(let roundIndex=0;roundIndex<rounds.length;roundIndex++){
  const snapshot=rounds[roundIndex],candidates=snapshot.candidates.filter(x=>SYMBOL.test(x?.symbol||'')),count=candidates.length;
  for(const candidate of candidates){
   const rank=finite(candidate.originalRank??candidate.rank);if(!Number.isInteger(rank)||rank<1||rank>count)continue;
   let row=rows.get(candidate.symbol);if(!row){row={symbol:candidate.symbol,scoreTotal:0,appearances:0,rankTotal:0,bestRank:Infinity,selectedCount:0,adxTotal:0,adxCount:0,erTotal:0,erCount:0,categories:{BOTH_BULLISH:0,INDICATOR_BULLISH:0,STRUCTURE_BULLISH:0},latest:null};rows.set(candidate.symbol,row);}
   row.scoreTotal+=100*(count-rank+1)/count;row.appearances++;row.rankTotal+=rank;row.bestRank=Math.min(row.bestRank,rank);if(candidate.selectedForLLM===true)row.selectedCount++;
   const adx=finite(candidate.adx14),er=finite(candidate.er20);if(adx!==null){row.adxTotal+=adx;row.adxCount++;}if(er!==null){row.erTotal+=er;row.erCount++;}
   const kind=category(candidate.candidateCategory);if(kind)row.categories[kind]++;
   if(!row.latest)row.latest={cycle:finite(snapshot.evaluationTime),rank,category:kind,selectedForLLM:candidate.selectedForLLM===true,excludedFromLLM:candidate.excludedFromLLM===true,exclusionReason:['BULL_COOLDOWN','REQUEST_UNKNOWN','LLM_PAUSED','DAILY_BUDGET_EXHAUSTED'].includes(candidate.exclusionReason)?candidate.exclusionReason:null,cooldownUntil:finite(candidate.cooldownUntil)};
  }
 }
 const denominator=rounds.length||1,items=[...rows.values()].map(row=>({symbol:row.symbol,averageScore:row.scoreTotal/denominator,appearances:row.appearances,appearanceRate:row.appearances/denominator,averageRank:row.rankTotal/row.appearances,bestRank:row.bestRank,selectedCount:row.selectedCount,averageAdx14:row.adxCount?row.adxTotal/row.adxCount:null,averageEr20:row.erCount?row.erTotal/row.erCount:null,categories:row.categories,latest:row.latest})).sort((a,b)=>b.averageScore-a.averageScore||b.appearances-a.appearances||(b.averageAdx14??-Infinity)-(a.averageAdx14??-Infinity)||a.symbol.localeCompare(b.symbol,'en'));
 return {roundsUsed:rounds.length,fromCycle:finite(rounds.at(-1)?.evaluationTime),toCycle:finite(rounds[0]?.evaluationTime),items:items.map((row,index)=>({aggregateRank:index+1,...row}))};
}
