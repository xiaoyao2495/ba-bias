import {generationRules,recoveryRules,generationInput,recoveryInput,GENERATION_VERSION} from './directional-generation.js';
import {suggestedHorizon} from './directional-context.js';
import {safeError} from '../config.js';
import {guardLegacyDirectional} from './directional-legacy-guard.js';
import {guardAlignedDirectional} from './directional-alignment-guard.js';
import {directionalSchemaV2} from './directional-schema.js';
export const analystRules=generationRules;
export function guardDirectional(a,input,{replayContractVersion}={}){
  return a?.version==='DIRECTIONAL_ANALYST_V2'||replayContractVersion==='DIRECTIONAL_ANALYST_V2'?guardAlignedDirectional(a,input):guardLegacyDirectional(a,input);
}
export function fallbackAnalyst(input,reason='ANALYST_FAILED'){
  const horizon=suggestedHorizon(input),w=input.windows.find(w=>w.horizon===horizon),ids=[w.priceId || input.entryReference?.evidenceId || input.evidence[0]?.evidenceId].filter(Boolean);
  return {version:input.contractVersion || 'DIRECTIONAL_ANALYST_V1',symbol:input.symbol,evaluationTime:input.evaluationTime,marketBias:'NO_EDGE',horizon,horizonReason:'研判服务未通过验证，保留可见事实供人工研究。',conviction:'LOW',marketThesis:'方向研判不可用，事实异常仍值得研究。',marketMechanism:'尚不能形成验证通过的方向解释。',supportingEvidenceIds:ids,conflictingEvidenceIds:[],tradeOpportunity:'NO_ACTIONABLE_SETUP',preferredScenario:'等待独立方向研究。',invalidation:{type:'INSUFFICIENT_STRUCTURE_DATA',ruleIds:[],description:'尚无可靠结构失效数据；需要后续完整价格和OI样本。'},alternativeScenario:'异常可能延续，也可能回归。',followUpChecks:['核对后续价格与OI变化。']};
}
export async function analyzeDirectional(llm,f,{signal}={}){
  const input=generationInput(f),attempts=[];
  for(let attempt=0;attempt<2;attempt++){
    signal?.throwIfAborted();
    try{
      const a=await llm.json(analystRules+(attempt?'\n'+recoveryRules:'')+'输出严格遵守Schema：'+JSON.stringify(directionalSchemaV2),attempt?recoveryInput(input,attempts.at(-1)):input,{maxTokens:6000});
      const guard=!a?.version||a.version==='DIRECTIONAL_ANALYST_V2'?guardDirectional(a,input,{replayContractVersion:'DIRECTIONAL_ANALYST_V2'}):{ok:false,errors:['OUTPUT_CONTRACT_VERSION_MISMATCH'],diagnostics:[{code:'OUTPUT_CONTRACT_VERSION_MISMATCH',path:'/version'}]};attempts.push({attempt:attempt+1,raw:a,errors:guard.errors,diagnostics:guard.diagnostics});
      if(guard.ok)return {status:'VALIDATED',validationRoute:attempt?'CONTROLLED_RECOVERY_PASS':'FIRST_PASS',contractVersion:'DIRECTIONAL_ANALYST_V2',generationVersion:GENERATION_VERSION,input,analysis:a,rendered:guard.rendered,attempts};
    }catch(e){if(signal?.aborted)throw e;attempts.push({attempt:attempt+1,error:safeError(e),errors:[safeError(e)]});if(!['INVALID_LLM_JSON','EMPTY_LLM_RESPONSE'].includes(e.message))break;}
  }
  return {status:'FAILED',validationRoute:'FINAL_FAILED',contractVersion:'DIRECTIONAL_ANALYST_V2',generationVersion:GENERATION_VERSION,failureReason:'ANALYST_VALIDATION_OR_REQUEST_FAILED',input,analysis:fallbackAnalyst(input),rendered:null,attempts};
}
