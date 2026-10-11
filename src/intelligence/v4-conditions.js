// Consumer semantics only. Never change the frozen V4 business output or rule math.
export function presentationRule(rule,direction){
  if(direction!=='NO_EDGE')return {...rule};
  const metric=rule.metric==='PRICE_CLOSED_CHANGE'?'新收盘滚动价格变化':'新采样精确OI数量变化';
  return {...rule,outcome:'REASSESSMENT_ONLY',description:`后续${rule.horizon}${metric}${rule.operator==='LTE'?'≤':'≥'}${Number(rule.threshold).toFixed(4)}%；重新评估是否形成方向优势，仅复核，不构成方向命题失效。`};
}
// Join only renderer-owned punctuation; never alter numeric text or use prose to deduplicate.
export const joinConditionText=items=>items.map(s=>s.replace(/[。；]+$/u,'')).filter(Boolean).join('；');
export function displayConditions(d){
  const noEdge=d?.analystVersion==='V4'&&d.analysis?.marketBias==='NO_EDGE';
  const rules=d.rules || [],follow=d.rendered?.followUpChecks || [];
  if(!noEdge){const descriptions=rules.length?rules.map(r=>r.description):[d.rendered?.invalidationDescription].filter(Boolean);return {label:rules.length?'失效/复核':'复核',descriptions,text:descriptions.join('；'),followUpChecks:follow,diagnostics:[],conditionIds:[]};}
  const raw=d.rawAnalysis || d.analysis,conditions=raw.reassessmentConditions || [],abstract=conditions.filter(c=>c.conditionType==='ABSTRACT_REASSESSMENT');
  const map=new Map([...(d.evidence || []),...(d.conflictingEvidence || [])].map(e=>[e.evidenceId,e]));
  const descriptions=[],ids=[],diagnostics=[],seen=new Set();let abstractIndex=0;
  const add=(identity,text)=>{const key=JSON.stringify(Object.keys(identity).sort().map(k=>[k,identity[k]]));if(seen.has(key))return;seen.add(key);ids.push(key);descriptions.push(text);};
  for(const c of conditions){
    if(c.conditionType==='PROGRAM_RULE'){
      const r=rules.find(r=>r.id===c.ruleId);if(!r){diagnostics.push({code:'MISSING_DISPLAY_RULE',ruleId:c.ruleId});continue;}
      // This exact official rule is a direction invalidation in the frozen input.
      // The older adapter's REASSESSMENT_ONLY alias does not change its source semantics.
      const source=d.input?.rules?.find(x=>x.id===r.id);
      if(source?.outcome==='INVALIDATED'||r.outcome==='INVALIDATED'||r.metric==='PRICE_CLOSED_CHANGE'&&r.id===`PRICE_OPPOSITE_${r.horizon}`){diagnostics.push({code:'NO_EDGE_DIRECTION_INVALIDATION_NOT_APPLICABLE',ruleId:r.id,sourceOutcome:'INVALIDATED',operator:r.operator,threshold:r.threshold});continue;}
      const metric=r.metric==='OI_QUANTITY_CHANGE'?'新采样精确OI数量变化':r.metric==='PRICE_CLOSED_CHANGE'?'新收盘滚动价格变化':null;
      if(!metric){diagnostics.push({code:'UNSUPPORTED_DISPLAY_METRIC',ruleId:r.id});continue;}
      add({conditionType:c.conditionType,metricType:r.metric,window:r.horizon,operator:r.operator,threshold:r.threshold,evidenceId:r.baselineEvidenceId},`后续${r.horizon}${metric}${r.operator==='LTE'?'≤':'≥'}${Number(r.threshold).toFixed(4)}%`);
    }else if(c.conditionType==='ABSTRACT_REASSESSMENT'){
      const index=abstractIndex++,e=map.get(c.metricOrStructureEvidenceId);
      const text=e?.phrase?`观察${e.phrase}是否出现新的变化`:follow.length===abstract.length?follow[index].replace(/；仅复核，不自动失效。$/u,''):null;
      if(text)add(c,text);else diagnostics.push({code:'MISSING_OBSERVATION_DESCRIPTION',evidenceId:c.metricOrStructureEvidenceId});
    }else if(c.conditionType==='STRUCTURE_BOUNDARY'){
      const e=map.get(c.metricOrStructureEvidenceId);
      if(c.consequence!=='REASSESS_ONLY'){diagnostics.push({code:'NO_EDGE_STRUCTURE_INVALIDATION_NOT_APPLICABLE',evidenceId:c.metricOrStructureEvidenceId});continue;}
      if(!e){diagnostics.push({code:'MISSING_STRUCTURE_EVIDENCE',evidenceId:c.metricOrStructureEvidenceId});continue;}
      add(c,`复核已验证单根K线边界：价格${c.operator==='LTE'?'≤':'≥'}${e.result??e.value} ${e.unit || 'USDT'}，不作为支撑阻力`);
    }else if(c.conditionType==='INSUFFICIENT_STRUCTURE_DATA')add(c,'缺少可靠结构数据，不设置机械失效位');
  }
  // Official V4 followUpChecks are the ordered ABSTRACT_REASSESSMENT descriptions.
  // Only a proved one-to-one binding can remove them from the separate follow-up field.
  const remaining=follow.length===abstract.length?[]:follow;
  if(remaining.length)diagnostics.push({code:'FOLLOW_UP_IDENTITY_UNAVAILABLE',count:remaining.length});
  return {label:'重新评估',descriptions,text:descriptions.length?joinConditionText(descriptions)+'。以上条件仅触发重新评估，不构成方向失效。':'没有可展示的合法复核条件；等待新的有效证据。',followUpChecks:remaining,diagnostics,conditionIds:ids};
}
