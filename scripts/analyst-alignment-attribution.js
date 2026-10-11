// Phase A: saved response-level diagnosis, before implementation changes.
import fs from 'node:fs';
const dir='validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1';
const read=p=>JSON.parse(fs.readFileSync(p));
const audit=read('BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_ANALYSIS.json'),prev=read('validation/BA_BIAS_VALIDATION_RECOVERY_V1/replay.json');
const rows=[];
for(const a of prev.attempts){
 const record=audit.analysts.find(r=>r.symbol===a.symbol&&r.runId===a.runId),d=read(record.file),f=read(a.factsReference||`data/runs/${a.runId}/facts/${a.symbol}.json`),raw=d.attempts[a.attempt-1].raw,issues=[];
 if(!raw)issues.push({category:'OTHER',reason:'INVALID_LLM_JSON'});
 else{
  if(a.schemaPass===false)issues.push({category:'OTHER',reason:'SCHEMA_CONTRACT_FAILURE_NOT_PROMPT_REQUIRED',schemaErrors:record.attempts[a.attempt-1].schemaErrors});
  const texts=[raw.horizonReason,raw.marketThesis,raw.marketMechanism,raw.preferredScenario,raw.alternativeScenario,raw.invalidation?.description,...raw.followUpChecks||[]].filter(t=>typeof t==='string');
  const all=texts.join('\n');
  for(const e of a.newErrors){
   let category=e.includes('WINDOW')||e.includes('ALIGNED')?'WINDOW_MISMATCH':e.includes('INVALIDATION')?'INVALIDATION_CONTRACT_ERROR':e.includes('STRUCTURE')?'HYPOTHESIS_FALSE_REJECTION':e.includes('FUNDING')?'OTHER':null;
   if(e.includes('CAUSE'))category=/假设|可能|相容|需要/.test(raw.marketMechanism||'')?'HYPOTHESIS_FALSE_REJECTION':'UNSUPPORTED_CAUSAL_CLAIM';
   if(e.includes('NUMBER'))category=a.diagnostics?.some(d=>d.code==='UNKNOWN_NUMERIC_RULE')?'INVALIDATION_CONTRACT_ERROR':'NUMERIC_FACT_ERROR';
   if(category)issues.push({category,reason:e,certainty:e.includes('CAUSE')||e.includes('STRUCTURE')?'REQUIRES_CLAUSE_REVIEW':'ERROR_PATH_CONFIRMED'});
  }
  const refs=[...new Set([...(raw.supportingEvidenceIds||[]),...(raw.conflictingEvidenceIds||[]),...texts.flatMap(t=>[...t.matchAll(/\{\{([^{}]+)\}\}/g)].map(m=>m[1]))])];
  for(const id of refs){
   if(d.input.evidence.some(e=>e.evidenceId===id)){if(![...(raw.supportingEvidenceIds||[]),...(raw.conflictingEvidenceIds||[])].includes(id))issues.push({category:'PROMPT_SCHEMA_CONFLICT',reason:'正文中的真实Registry引用被附加必须列入支持/冲突列表的限制拒绝；列表上限8',evidenceId:id});}
   else issues.push({category:f.evidence.some(e=>e.evidenceId===id)?'EVIDENCE_NOT_EXPOSED':'EVIDENCE_HALLUCINATED',reason:'引用不在实际输入Registry',evidenceId:id});
  }
 }
 rows.push({runId:a.runId,symbol:a.symbol,attempt:a.attempt,baselineValid:a.newValid,reference:a.reference,oldErrors:a.newErrors,categories:[...new Set(issues.map(i=>i.category))],issues});
}
const failedKeys=new Set(prev.research.filter(r=>r.newStatus!=='VALIDATED').map(r=>r.runId+':'+r.symbol));
function counts(selected){return Object.fromEntries(['PROMPT_SCHEMA_CONFLICT','EVIDENCE_NOT_EXPOSED','EVIDENCE_HALLUCINATED','WINDOW_MISMATCH','NUMERIC_FACT_ERROR','HYPOTHESIS_FALSE_REJECTION','UNSUPPORTED_CAUSAL_CLAIM','INVALIDATION_CONTRACT_ERROR','OTHER'].map(c=>[c,{responses:selected.filter(r=>r.categories.includes(c)).length,research:new Set(selected.filter(r=>r.categories.includes(c)).map(r=>r.runId+':'+r.symbol)).size,blocksBaseline:'Only in conjunction with other validation failures; counts overlap'}]));}
const result={independentResearch:prev.summary.independentResearch,responses:prev.summary.modelResponses,schemaPass:prev.summary.schemaPass,completePass:prev.summary.newPassingResearch,unavailableResearch:prev.summary.stillFailedResearch,missing:prev.summary.missingRecords,categoriesAllResponses:counts(rows),categories69FailedResearch:counts(rows.filter(r=>failedKeys.has(r.runId+':'+r.symbol))),rows,limitations:'Clause-level hypothesis labels are candidate false rejections, not a blanket assertion that these whole responses should pass. Schema failure itself is OTHER unless a prompt requirement truly conflicts. Numeric rules are invalidation errors, not invented observed values.'};
fs.writeFileSync(dir+'/baseline-attribution.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result.categories69FailedResearch,null,2));
