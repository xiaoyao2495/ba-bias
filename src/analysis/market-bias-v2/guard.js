import {inputAsOfAvailable} from './source-time.js';
import {validateAnalysis,validateResearch} from './parser.js';
import {sha,canonical} from './common.js';
export function guardAnalysis(a,input){
 const errors=[],reviewItems=[];if(!validateAnalysis(a))errors.push('V2_SCHEMA_INVALID');
 if(!input?.dataQuality?.validForResearch)errors.push('INVALID_INPUT_FACTS');
 if(a&&input){const text=JSON.stringify(a),known=new Set(input.currentFacts.map(e=>e.factId));
  // Only explicit identifiers can be resolved reliably; free-text numbers need review.
  for(const m of text.matchAll(/[\p{L}\p{N}]+USDT:(?:price|oi|volume|funding|accounts|global|topAccounts|topPositions)\.[\w.]+/gu))if(!known.has(m[0]))reviewItems.push('UNVERIFIED_EXPLICIT_FACT_ID:'+m[0]);
 }
 return {ok:errors.length===0,errors,semanticReviewRequired:true,reviewItems,semanticLimits:'Technical checks only. Financial reasoning and free-text numeric claims require manual review.'};
}
export function guardResearch(r,input){
 if(!validateResearch(r))return {ok:false,errors:['V2_ENVELOPE_INVALID']};
 if(!input||r.contextId!==input.contextId||r.symbol!==input.symbol||r.factsPackageSha256!==input.factsPackageSha256||r.asOf.factsAsOf!==input.factsAsOf||r.asOf.factsAvailableAt!==input.factsAvailableAt||r.knowledgeRegistrySha256!==input.knowledgeRegistrySha256)return {ok:false,errors:['ENVELOPE_CONTEXT_MISMATCH']};
 if(input.contextId!==sha(Object.fromEntries(Object.entries(input).filter(([k])=>k!=='contextId'))))return {ok:false,errors:['INPUT_HASH_MISMATCH']};
 if(r.researchFormat!=='MINIMAL_MARKET_RESEARCH_V1')return {ok:true,errors:[],semanticReviewRequired:true}; // legacy read-only envelope, never generation
 if(r.executionState==='VALIDATED'&&r.rawResponse){try{if(canonical(JSON.parse(r.rawResponse.choices[0].message.content))!==canonical(r.analysis))return {ok:false,errors:['RAW_ANALYSIS_MISMATCH']};}catch{return {ok:false,errors:['RAW_ANALYSIS_MISMATCH']};}}
 if(r.mode!==input.mode||r.asOf.factsCollectedAt!==input.factsCollectedAt||canonical(r.dataQuality)!==canonical(input.dataQuality))return {ok:false,errors:['RESEARCH_METADATA_MISMATCH']};
 const t=r.asOf;
 if(r.executionState==='VALIDATED'&&!(inputAsOfAvailable(input)&&t.factsAvailableAt<=t.researchRequestedAt&&t.researchRequestedAt<=t.decisionCompletedAt&&t.decisionCompletedAt<=t.validationCompletedAt))return {ok:false,errors:['CAUSAL_TIME_ORDER_INVALID']};
 return r.executionState==='VALIDATED'?guardAnalysis(r.analysis,input):{ok:true,errors:[]};
}
