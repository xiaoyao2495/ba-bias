import {guardStructuredAnalysis} from './structured-v4-guard.js';
import {provenanceLabel} from './structured-v4-provenance.js';
const mechanism={CO_MOVEMENT_ONLY:'仅描述价格与OI的同期变化',CONTRACT_EXPANSION_COMPATIBLE:'与合约规模扩张相容，不确认单侧新增仓位',CONTRACT_CONTRACTION_COMPATIBLE:'与合约规模收缩相容，不确认具体开平仓行为',UNDETERMINED:'机制无法确定'};
const hypothesis={CONTINUATION:'条件性延续假设',TURN:'有前期与近期价格证据的条件性转向假设',COUNTER_MOVE:'逆当前价格变化的条件性竞争假设',NO_CLEAR_EDGE:'证据不足以支持清晰方向优势'};
export function renderStructuredAnalysis(output,input){
 const validation=guardStructuredAnalysis(output,input);if(!validation.ok)return {status:'FAILED',validation,text:null};
 output=validation.analysis;
 const map=new Map(input.evidence.map(e=>[e.evidenceId,e]));
 const describe=id=>{const e=map.get(id);return `${id} | ${e.metricType} | ${typeof e.value==='object'?JSON.stringify(e.value):e.value} ${e.unit} | window=${e.window??'UNDECLARED'} | observedAt=${new Date(e.observedAt).toISOString()} | availableAt=${e.availableAt} | ${e.source.endpoint} | ${e.semanticDescription}`;};
 const conditions=output.reassessmentConditions.map(c=>{
  if(c.conditionType==='PROGRAM_RULE'){const r=input.rules.find(r=>r.id===c.ruleId);return `${r.id}: ${r.metric} ${r.operator} ${r.threshold}% => ${r.outcome}; ${r.description}`;}
  if(c.conditionType==='ABSTRACT_REASSESSMENT')return `${c.metricOrStructureEvidenceId}: 观察变化，仅复核，不自动失效`;
  if(c.conditionType==='STRUCTURE_BOUNDARY'){const e=map.get(c.metricOrStructureEvidenceId);return `${e.evidenceId}: 后续价格 ${c.operator} ${e.value} ${e.unit} => ${c.consequence}；仅对应明确单根K线边界`;}return '结构数据不足；不设置机械失效';
 });
 return {status:'EXPERIMENT_VALIDATED',validation,text:[input.version,`${input.status} | ${provenanceLabel(validation.provenance)} | causalBacktestEligible=false`,`${output.symbol} ${output.direction} / ${output.horizon} / ${output.conviction}`,`originalEvaluationTime=${input.originalEvaluationTime}; ${input.probeMode}`,...output.supportingEvidenceIds.map(id=>'支持: '+describe(id)),...output.conflictingEvidenceIds.map(id=>'冲突: '+describe(id)),`机制假设: ${mechanism[output.mechanismHypothesis.type]}。不能凭这些统计确认具体参与者开仓、平仓、强平或资金流向。`,`未来研究: ${hypothesis[output.directionalRationale.hypothesis]}；竞争情景=${output.directionalRationale.alternative}，并非已证实事实。`,`交易机会: ${output.tradeOpportunity}`,...conditions].join('\n')};
}
