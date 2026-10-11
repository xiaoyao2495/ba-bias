// Deterministic protocol fixture: never calls any model or network.
export function mockDirectional(input,{bias,horizon,conviction='MODERATE',opportunity}={}){
  const w=input.windows.find(w=>w.horizon===(horizon || input.windows.find(w=>w.strongContinuation)?.horizon || input.windows.find(w=>w.priceId)?.horizon || '1h'));
  if(input.version==='STRUCTURED_ANALYST_V4')return mockStructuredV4(input,{bias,horizon,conviction,opportunity});
  const p=Number(input.evidence.find(e=>e.evidenceId===w.priceId)?.result);
  bias ||= w.priceId&&p!==0?(p>0?'BULLISH':'BEARISH'):'NO_EDGE';
  const supporting=[w.priceId,w.oiId,...(bias.includes('REVERSAL')?[w.previousPriceId]:[])].filter(Boolean);
  if(!supporting.length)supporting.push(input.evidence[0].evidenceId);
  return {version:input.contractVersion || 'DIRECTIONAL_ANALYST_V1',symbol:input.symbol,evaluationTime:input.evaluationTime,marketBias:bias,horizon:w.horizon,horizonReason:'采用已有价格及敞口变化所支持的观察尺度。',conviction,marketThesis:bias==='NO_EDGE'?'方向证据不足，保留异常事实。':bias.startsWith('BULLISH')?'短线偏多，作为后续可检验的研究假设。':'短线偏空，作为后续可检验的研究假设。',
    marketMechanism:'价格变化与未平仓规模变化同时出现，因果机制仍需观察。',supportingEvidenceIds:supporting,conflictingEvidenceIds:[],tradeOpportunity:opportunity || (bias==='NO_EDGE'?'NO_ACTIONABLE_SETUP':'WAIT_FOR_CONFIRMATION'),preferredScenario:'观察价格变化是否延续。',
    invalidation:{type:bias==='NO_EDGE'?'INSUFFICIENT_STRUCTURE_DATA':'OBSERVABLE_CONDITION',ruleIds:bias==='NO_EDGE'?[]:input.rules.filter(r=>r.horizon===w.horizon).map(r=>r.id),description:'使用输入定义的可观察条件复核原方向，等待可靠结构数据。'},alternativeScenario:'价格变化未能延续，进入相反方向或震荡。',followUpChecks:['复核后续完整价格与OI样本。']};
}

export function mockStructuredV4(input,{bias,horizon,conviction='LOW',opportunity}={}){
 const w=input.windows.find(w=>w.horizon===(horizon||'1h')),map=new Map(input.evidence.map(e=>[e.evidenceId,e])),p=Number(map.get(w.priceId)?.value),o=Number(map.get(w.oiId)?.value);bias ||= p>0?'BULLISH':p<0?'BEARISH':'NO_EDGE';
 const ids=[w.priceId,...(w.aligned?[w.oiId]:[]),...(bias.includes('REVERSAL')?[w.previousPriceId]:[])].filter(Boolean);
 return {version:'STRUCTURED_ANALYST_V4',status:'PRODUCTION',causalBacktestEligible:false,symbol:input.symbol,evaluationTime:input.evaluationTime,direction:bias,horizon:w.horizon,conviction:w.aligned?conviction:'LOW',supportingEvidenceIds:ids,conflictingEvidenceIds:[],structureEvidenceIds:[],mechanismHypothesis:{type:w.aligned?(o>0?'CONTRACT_EXPANSION_COMPATIBLE':o<0?'CONTRACT_CONTRACTION_COMPATIBLE':'CO_MOVEMENT_ONLY'):'UNDETERMINED',evidenceIds:w.aligned?[w.priceId,w.oiId]:[w.priceId],limitation:'PARTICIPANT_BEHAVIOR_UNCONFIRMED'},directionalRationale:{hypothesis:bias==='NO_EDGE'?'NO_CLEAR_EDGE':bias.includes('REVERSAL')?'TURN':'CONTINUATION',evidenceIds:ids,alternative:'OPPOSITE_MOVE',certainty:'CONDITIONAL_NOT_CONFIRMED'},tradeOpportunity:opportunity||(bias==='NO_EDGE'?'NO_ACTIONABLE_SETUP':'WAIT_FOR_CONFIRMATION'),reassessmentConditions:bias==='NO_EDGE'?[{conditionType:'INSUFFICIENT_STRUCTURE_DATA',consequence:'NO_MECHANICAL_INVALIDATION'}]:input.rules.filter(r=>r.horizon===w.horizon&&ids.includes(r.baselineEvidenceId)).map(r=>({conditionType:'PROGRAM_RULE',ruleId:r.id}))};
}
