// Deterministic protocol fixture: never calls any model or network.
export function mockDirectional(input,{bias,horizon,conviction='MODERATE',opportunity}={}){
  const w=input.windows.find(w=>w.horizon===(horizon || input.windows.find(w=>w.strongContinuation)?.horizon || input.windows.find(w=>w.priceId)?.horizon || '1h'));
  const p=Number(input.evidence.find(e=>e.evidenceId===w.priceId)?.result);
  bias ||= w.priceId&&p!==0?(p>0?'BULLISH':'BEARISH'):'NO_EDGE';
  const supporting=[w.priceId,w.oiId,...(bias.includes('REVERSAL')?[w.previousPriceId]:[])].filter(Boolean);
  if(!supporting.length)supporting.push(input.evidence[0].evidenceId);
  return {version:input.contractVersion || 'DIRECTIONAL_ANALYST_V1',symbol:input.symbol,evaluationTime:input.evaluationTime,marketBias:bias,horizon:w.horizon,horizonReason:'采用已有价格及敞口变化所支持的观察尺度。',conviction,marketThesis:bias==='NO_EDGE'?'方向证据不足，保留异常事实。':bias.startsWith('BULLISH')?'短线偏多，作为后续可检验的研究假设。':'短线偏空，作为后续可检验的研究假设。',
    marketMechanism:'价格变化与未平仓规模变化同时出现，因果机制仍需观察。',supportingEvidenceIds:supporting,conflictingEvidenceIds:[],tradeOpportunity:opportunity || (bias==='NO_EDGE'?'NO_ACTIONABLE_SETUP':'WAIT_FOR_CONFIRMATION'),preferredScenario:'观察价格变化是否延续。',
    invalidation:{type:bias==='NO_EDGE'?'INSUFFICIENT_STRUCTURE_DATA':'OBSERVABLE_CONDITION',ruleIds:bias==='NO_EDGE'?[]:input.rules.filter(r=>r.horizon===w.horizon).map(r=>r.id),description:'使用输入定义的可观察条件复核原方向，等待可靠结构数据。'},alternativeScenario:'价格变化未能延续，进入相反方向或震荡。',followUpChecks:['复核后续完整价格与OI样本。']};
}
