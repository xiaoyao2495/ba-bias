// Consumer semantics only. Never change the frozen V4 business output or rule math.
export function presentationRule(rule,direction){
  if(direction!=='NO_EDGE')return {...rule};
  const metric=rule.metric==='PRICE_CLOSED_CHANGE'?'新收盘滚动价格变化':'新采样精确OI数量变化';
  return {...rule,outcome:'REASSESSMENT_ONLY',description:`后续${rule.horizon}${metric}${rule.operator==='LTE'?'≤':'≥'}${Number(rule.threshold).toFixed(4)}%；重新评估是否形成方向优势，仅复核，不构成方向命题失效。`};
}
export function displayConditions(d){
  const noEdge=d?.analystVersion==='V4'&&d.analysis?.marketBias==='NO_EDGE';
  const rules=(d.rules || []).map(r=>presentationRule(r,noEdge?'NO_EDGE':d.analysis?.marketBias));
  if(!noEdge)return {label:rules.length?'失效/复核':'复核',descriptions:rules.length?rules.map(r=>r.description):[d.rendered?.invalidationDescription].filter(Boolean)};
  return {label:'重新评估',descriptions:[...rules.map(r=>r.description),...(d.rendered?.followUpChecks || [])].filter(Boolean)};
}
