import {CONTRACT} from './common.js';
import {validateResearch} from './parser.js';
export const BIASES={BULLISH:'当前偏多',BEARISH:'当前偏空',NO_EDGE:'当前无明确方向优势'};
export function bindText(text,input){const facts=new Map([...(input?.currentFacts||[]),...(input?.previousFacts||[])].map(e=>[e.factRef,e]));return String(text??'').replace(/\{\{([^}]+)\}\}/g,(_,ref)=>{const e=facts.get(ref);if(!e)throw Error('RENDER_FACT_REFERENCE_MISSING');return `${typeof e.value==='object'?JSON.stringify(e.value):e.value} ${e.unit} [${e.originalId}]`;});}
// Input audit is used only for numeric template binding. It is never serialized to HTTP.
export function publicAnalysis(r,input){if(!r||r.contract!==CONTRACT||!validateResearch(r)||r.executionState!=='VALIDATED')return {status:'UNAVAILABLE',bias:null,label:'研究不可用',strength:null,errorCode:r?.error?.code??'RESEARCH_UNAVAILABLE'};
 if(r.researchFormat==='MINIMAL_MARKET_RESEARCH_V1')return {status:'VALIDATED',contract:CONTRACT,symbol:r.symbol,...structuredClone(r.analysis),label:BIASES[r.analysis.bias],strength:null,asOf:r.asOf,generatedAt:r.asOf.decisionCompletedAt,mode:r.mode,reviewStatus:r.reviewStatus,dataQuality:r.dataQuality,semanticReview:'技术有效；金融解释待人工审阅'};
 const a=structuredClone(r.analysis);function walk(x){if(typeof x==='string'&&x.includes('{{'))return bindText(x,input);if(Array.isArray(x))return x.map(walk);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,walk(v)]));return x;}
 return {status:'VALIDATED',...walk(a),label:BIASES[a.bias],asOf:r.asOf,dataQuality:r.dataQuality,generatedAt:r.asOf.decisionCompletedAt,semanticReview:'自动校验不证明金融解释必然正确'};
}
export function renderResearch(r,input){const a=publicAnalysis(r,input);if(a.status!=='VALIDATED')throw Error('RESEARCH_UNAVAILABLE');
 if(r.researchFormat==='MINIMAL_MARKET_RESEARCH_V1')return [`当前Bias：${a.bias}（${a.label}）`,`模式：${a.mode}；审核：${a.reviewStatus}`,'市场状态：',a.marketState,'金融解释：',a.financialInterpretation,'支持证据：',...a.supportingEvidence,'竞争证据：',...a.competingEvidence,'判断依据：',a.decisionBasis,'重要未知：',...a.uncertainties].join('\n');
 const lines=[`当前Bias：${a.bias}（${a.label}）`];if(a.strength!==null)lines.push(`证据强度：${a.strength}（定性，非概率）`);
 lines.push('市场解释：',...a.marketInterpretation.map(i=>i.interpretation),'支持证据：',...a.supportingEvidence.map(e=>e.relevance),'竞争证据：',...(a.conflictingEvidence.length?a.conflictingEvidence.map(e=>e.relevance):[a.decisionBasis.noImportantConflictReason]),'判断依据：',a.decisionBasis.synthesis,...a.decisionBasis.conflictAssessments.map(c=>c.reason),'无法确认：',...a.uncertainties.map(u=>u.description),a.decisionBasis.unknownInformationImpact,'后续复核：',...a.reassessmentTriggers.map(t=>t.description));
 if(a.bias==='NO_EDGE')lines.push(`无优势原因：${a.noEdgeReasons.join('、')}`);return lines.join('\n');
}
