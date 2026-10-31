import {TREND_SIMPLE_CONFIG} from './config.js';
// Observes the already-ranked production array; it does not rank or select candidates.
export function buildRankingSnapshot({ranked,selected,runId,cycle,startedAt,scannedCount,validCount,failedCount}){
 const chosen=new Set(selected.map(x=>x.symbol));
 return {schemaVersion:'BULL_CANDIDATE_RANKING_V1',researchMode:'TREND_SIMPLE_V1',timeframe:'5m',runId,scanTime:cycle,evaluationTime:cycle,startedAt,status:'COMPLETE',universe:{scannedCount,validCount,failedCount,bullishCandidateCount:ranked.length},selection:{topK:Math.min(TREND_SIMPLE_CONFIG.selection.topK,TREND_SIMPLE_CONFIG.llm.maxSymbolsPerRound),rankingRuleVersion:'BULLISH_PATH_ADX_ER_SYMBOL_V1'},candidates:ranked.map((row,index)=>({rank:index+1,symbol:row.symbol,candidateCategory:({1:'BOTH_BULLISH',2:'INDICATOR_BULLISH',3:'STRUCTURE_BULLISH'})[row.priority],priority:row.priority,indicatorPath:row.facts.indicatorPath,structurePath:row.facts.structurePath,adx14:row.facts.indicators.adx14??null,er20:row.facts.indicators.er20??null,price:row.facts.price,selectedForLLM:chosen.has(row.symbol)}))};
}
