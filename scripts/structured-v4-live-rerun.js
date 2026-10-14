import {pathToFileURL as retiredEntryURL} from 'node:url';
// Old CLI is audit-only; the production research entry is V2 exclusively.
if(process.argv[1]&&import.meta.url===retiredEntryURL(process.argv[1]).href)throw Error('LEGACY_LIVE_RESEARCH_RETIRED');
// Independent, append-only historical contract experiment. No production entry point.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {config,safeError} from '../src/config.js';
import {buildStructuredInput} from '../src/analysis/experimental/structured-v4-input.js';
import {modelOutputSchema,validateModelOutput} from '../src/analysis/experimental/structured-v4-schema.js';
import {executeStructuredExperiment} from '../src/analysis/experimental/structured-v4-executor.js';
import {createLiveV4Adapter} from '../src/analysis/experimental/structured-v4-provenance.js';
import {verifiedFacts} from '../src/intelligence/packet.js';
import {closedKlines,pct} from '../src/market/facts-engine.js';
export const DIR='validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN';
export const MODE='POST_COLLECTION_HISTORICAL_RESEARCH';
export const PARAMETERS=Object.freeze({temperature:0,thinking:{type:'disabled'},max_tokens:6000,response_format:{type:'json_object'},transportRetries:0,concurrency:1,timeoutMs:60000});
// Initial invocation template for the existing system-argument API; no existing
// V4 core prompt is replaced. Both templates frozen before the first dispatch.
export const SYSTEM=`You are an independent historical crypto directional researcher. Return ONLY JSON matching the supplied business schema. This is NOT_PRODUCTION, POST_COLLECTION_HISTORICAL_RESEARCH, causalBacktestEligible=false. evaluationTime is the original observation cutoff, not now. Choose your own uncertain future 1h/4h/24h hypothesis from the five directions; do not merely map the last price sign. Consider all relevant contemporaneous evidence and competing windows. No outcome data is supplied. No invented facts, prose, source/provenance fields, targets, probabilities, structures, or thresholds.
Use only exact evidence IDs from input. Supporting and conflicting roles must be disjoint and relevant. Reference the primary closed price evidence for your chosen horizon in support AND directionalRationale. Rationale evidence must be selected support/conflict. Preserve indicator type, unit, window and timestamp. Same-horizon supporting evidence except previous-price/rolling-price must end within 1ms of the primary closed price; other facts can be background or explicitly labelled conflict. Unaligned OI cannot support a price/OI mechanism; unaligned windows require LOW conviction.
Non-UNDETERMINED mechanisms require EXACTLY the chosen horizon's aligned price and OI IDs, both supporting. Expansion requires positive OI quantity change; contraction negative. This is compatibility only, never confirmed participant behavior or funds flow. UNDETERMINED may reference selected evidence. Account percentages are not positions; top positions are not global OI shares. Funding settlement does not determine future direction.
REVERSAL needs supported prior equal-length and current opposite-sign price evidence, direction matching current sign, hypothesis TURN. TURN is exclusive to REVERSAL. Counter-current directions require COUNTER_MOVE and actual competing price evidence or opposite price/OI signs. NO_EDGE requires NO_CLEAR_EDGE, no actionable setup/wait for confirmation; in strong continuation it requires an actual selected conflict (opposite price/OI evidence or relative volume below 1). Do not use NO_EDGE to hide invalid output. HIGH is allowed only for genuinely aligned strong 1h continuation with price and OI plus relative1h volume >=2 in support, no selected conflicts, no opposite window prices, and no reversal/NO_EDGE. MODERATE/LOW remain available.
structures is normally empty: no ranges, support/resistance, invented price levels or actionable LONG_SETUP/SHORT_SETUP. Select exact supplied same-horizon PROGRAM_RULE IDs with their baseline evidence supporting, or ABSTRACT_REASSESSMENT of a real evidence ID (MONITOR_CHANGE, REASSESS_ONLY), or INSUFFICIENT_STRUCTURE_DATA. An INVALIDATED price rule conflicting with a counter-current hypothesis is not a valid directional invalidation. Direction and trade opportunity are separate. Evidence verifies observations, not future truth.
BUSINESS_SCHEMA=${JSON.stringify(modelOutputSchema)}`;
export const RECOVERY=`CONTROLLED_CONTRACT_RECOVERY_V1: Reconsider the preceding response using only the unchanged original input, exact allowed evidence, schema and complete validation errors below. Return a fresh complete business JSON. You may retain or change your hypothesis only with supported evidence; do not force NO_EDGE, invent evidence, change times, or claim source. No future data or new facts are available. Diagnostics follow (not authoritative facts):\n`;
export const read=p=>JSON.parse(fs.readFileSync(p));
export const digest=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
export const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export function walk(root){return fs.existsSync(root)?fs.readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(root,e.name)):e.isFile()?[path.join(root,e.name)]:[]):[];}
export function write(file,value){
 const root=path.resolve('validation'),target=path.resolve(file);
 if(!target.startsWith(root+path.sep))throw Error('ISOLATED_STORAGE_REQUIRED');
 for(let p=path.dirname(target);p!==path.dirname(root);p=path.dirname(p))if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())throw Error('SYMLINK_STORAGE_FORBIDDEN');
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
}
export function protect(before){
 const changed=Object.entries(before).filter(([p,h])=>!fs.existsSync(p)||hash(p)!==h).map(([p])=>p);
 const newData=walk('data').filter(p=>!Object.hasOwn(before,p));
 if(changed.length||newData.length)throw Error('PRODUCTION_OR_PRIOR_FILE_CHANGED: '+JSON.stringify({changed,newData}));
 return {protectedFiles:Object.keys(before).length,productionFiles:walk('data').length,changed,newData};
}
export function inspectFacts(file){
 const facts=read(file),input=buildStructuredInput(facts),canonical=verifiedFacts(facts),cutoff=facts.dataCutoff;
 if(input.evaluationTime!==new Date(cutoff).toISOString()||input.originalEvaluationTime!==input.evaluationTime||input.evidence.some(e=>!e.dataTimes.length||e.dataTimes.some(t=>!Number.isSafeInteger(t)||t>cutoff)))throw Error('FUTURE_OR_INVALID_INPUT_TIME');
 const original=new Map(facts.evidence.map(e=>[e.evidenceId,e]));
 for(const e of input.evidence){const old=original.get(e.evidenceId);if(old&&(String(old.result)!==String(e.value)||old.phrase!==e.semanticDescription))throw Error('ORIGINAL_EVIDENCE_CHANGED');}
 const sources=Object.entries(facts.sources),times=sources.map(([,s])=>s.retrievedAt),known=times.length&&times.every(Number.isSafeInteger);
 const isolatedFutureRows=[];
 for(const [key,s] of sources){if(!Array.isArray(s.raw))continue;const times=s.raw.map(r=>Array.isArray(r)?Number(r[6]):Number(r.timestamp??r.fundingTime)).filter(Number.isFinite);if(times.some(t=>t>cutoff))isolatedFutureRows.push({source:key,rows:times.filter(t=>t>cutoff).length,policy:'Existing canonical engine excludes post-cutoff observations/unfinished bars; no retained input evidence exceeds cutoff'});}
 // Single snapshots cannot be safely repaired by truncating an individual field.
 if(Number(facts.sources.ticker?.raw?.closeTime)>cutoff)throw Error('FUTURE_TICKER_SNAPSHOT_NOT_ISOLATABLE');
 return {facts,input,canonical,timeAudit:{probeMode:MODE,originalEvaluationTime:input.originalEvaluationTime,collectionCompletedAt:known?new Date(Math.max(...times)).toISOString():'UNKNOWN',availability:'UNKNOWN',causalBacktestEligible:false,isolatedFutureRows,retainedFutureEvidence:0,meaning:'Acquisition availability is unproven; later market observations are not part of retained evidence.'}};
}
const TAGS=['PRICE_UP_OI_EXPANSION','PRICE_DOWN_OI_EXPANSION','PRICE_UP_OI_CONTRACTION','PRICE_DOWN_OI_CONTRACTION','FUNDING_ABNORMAL','ACCOUNT_CHANGE_OR_FLIP','DRAWDOWN','MULTI_WINDOW_CONFLICT','REAL_PRICE_TURN','LOW_DISPLACEMENT'];
export function selectSamples(){
 const prior=read('validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/selected_samples.json');
 if(prior.selected?.length){const selected=prior.selected.map(s=>{const file=s.factsPath??s.originalFactsPath;if(hash(file)!==(s.factsHash??s.originalFactsHash))throw Error('PRIOR_FROZEN_FACTS_CHANGED');return s;});return {selected,reused:true};}
 const spike=read('validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/v4-offline-experiments.json');
 const exposed=new Set(spike.experiments.map(e=>e.input.symbol+'|'+e.input.evaluationTime)),pool=[],excluded=[];
 for(const file of walk('data/runs').filter(p=>/\/facts\/[^/]+\.json$/.test(p)).sort()){
  try{const {facts,input,timeAudit}=inspectFacts(file),key=input.symbol+'|'+input.evaluationTime;if(exposed.has(key)){excluded.push({file,reason:'PRIOR_V4_SPIKE_EVENT'});continue;}
   const v=id=>Number(input.evidence.find(e=>e.evidenceId===id)?.value),w=input.windows.find(w=>w.horizon==='4h'),p=v(w.priceId),o=v(w.oiId),tags=[];
   if(p>0&&o>0)tags.push(TAGS[0]);if(p<0&&o>0)tags.push(TAGS[1]);if(p>0&&o<0)tags.push(TAGS[2]);if(p<0&&o<0)tags.push(TAGS[3]);
   if(input.evidence.some(e=>e.evidenceId.endsWith(':funding.latest')&&Math.abs(Number(e.value))>=.1))tags.push(TAGS[4]);
   if(input.evidence.some(e=>e.evidenceId.includes(':global.')&&(e.evidenceId.endsWith('.flip')||e.evidenceId.includes('.change')&&Math.abs(Number(e.value))>=5)))tags.push(TAGS[5]);
   if(v(input.symbol+':price.drawdown')<=-10)tags.push(TAGS[6]);if(new Set(input.windows.map(w=>w.observedPriceSign).filter(Boolean)).size>1)tags.push(TAGS[7]);if(input.windows.some(w=>w.reversalEvidenceAvailable))tags.push(TAGS[8]);if(Math.abs(p)<1&&Math.abs(o)<1)tags.push(TAGS[9]);
   pool.push({sampleId:`s_${facts.runId}_${input.symbol}`,symbol:input.symbol,runId:facts.runId,originalEvaluationTime:input.originalEvaluationTime,factsPath:file,factsHash:hash(file),evidenceCount:input.evidence.length,scenarioTags:tags,probeMode:MODE,causalBacktestEligible:false,timeAudit});
  }catch(e){excluded.push({file,reason:safeError(e)});}
 }
 const selected=[],used=new Set();for(const tag of TAGS){const s=pool.find(s=>!used.has(s.symbol+'|'+s.originalEvaluationTime)&&s.scenarioTags.includes(tag));if(s){selected.push({...s,selectionReason:'Deterministic original-facts scenario coverage: '+tag});used.add(s.symbol+'|'+s.originalEvaluationTime);}}
 for(const s of pool){if(selected.length>=10)break;if(!used.has(s.symbol+'|'+s.originalEvaluationTime)){selected.push({...s,selectionReason:'Deterministic complete-Facts fallback'});used.add(s.symbol+'|'+s.originalEvaluationTime);}}
 return {reused:false,previousSelectionStatus:prior.status,poolSize:pool.length,selected:selected.slice(0,10),missingScenarios:TAGS.filter(t=>!selected.some(s=>s.scenarioTags.includes(t))),excluded};
}
export class Budget{constructor(){this.total=0;this.samples=new Map();}charge(id){const n=this.samples.get(id)||0;if(n>=3||this.total>=30)throw Error('REQUEST_BUDGET_EXHAUSTED');this.total++;this.samples.set(id,n+1);}}
export function rendererAudit(result,facts){
 if(!result.validation.ok)return {ok:result.rendered.text===null,status:'FAILED_NO_TEXT',claims:[]};
 const canonical=verifiedFacts(facts),fresh=buildStructuredInput(facts),errors=[],claims=[];
 if(JSON.stringify(fresh)!==JSON.stringify(result.input))errors.push('INPUT_REBUILD_MISMATCH');
 for(const line of result.rendered.text.split('\n').filter(l=>/^(支持|冲突): /.test(l))){const id=line.split(' | ')[0].replace(/^(支持|冲突): /,''),e=fresh.evidence.find(e=>e.evidenceId===id);if(!e){errors.push('UNKNOWN_RENDERED_ID');continue;}
  const i=facts.evidence.findIndex(x=>x.evidenceId===id),ce=canonical.evidence.find(x=>x.evidenceId===id);
  let fields;if(i>=0){fields=[`evidence[${i}].result`,`evidence[${i}].phrase`,`evidence[${i}].dataTimes`,`evidence[${i}].formula`,`sources.${Object.keys(facts.sources).find(k=>facts.sources[k].endpoint===e.source.endpoint)}.raw`];if(!ce||String(ce.result)!==String(e.value)||ce.phrase!==e.semanticDescription)errors.push('CANONICAL_FACT_MISMATCH');}
  else if(e.metricType==='PREVIOUS_PRICE_CHANGE'){const h=parseInt(e.window),bars=closedKlines(facts.sources.hour.raw,facts.dataCutoff,3600000),prior=bars.slice(-2*h).slice(0,h);if(prior.length!==h||pct(prior.at(-1)[4],prior[0][1])!==e.value)errors.push('PREVIOUS_PRICE_RECALCULATION_FAILED');fields=['sources.hour.raw (previous equal-length closed bars: [1] open, [4] close, [0]/[6] times)'];}
  else if(ce&&String(ce.result)===String(e.value)&&ce.phrase===e.semanticDescription){const keys=Object.keys(facts.sources).filter(k=>facts.sources[k].endpoint===e.source.endpoint);fields=keys.map(k=>`sources.${k}.raw (canonical deterministic formula: ${e.source.formula}; exact retained dataTimes: ${e.dataTimes.join(',')})`);if(!fields.length)errors.push('NO_ORIGINAL_SOURCE_FIELD');}
  else {errors.push('NO_ORIGINAL_FACT_FIELD');fields=[];}
  const expected=`${id} | ${e.metricType} | ${typeof e.value==='object'?JSON.stringify(e.value):e.value} ${e.unit} | window=${e.window??'UNDECLARED'} | observedAt=${new Date(e.observedAt).toISOString()} | availableAt=${e.availableAt} | ${e.source.endpoint} | ${e.semanticDescription}`;
  if(line.replace(/^(支持|冲突): /,'')!==expected)errors.push('RENDERED_VALUE_UNIT_WINDOW_OR_PHRASE_CHANGED');
  claims.push({renderedClaim:line,evidenceId:id,factsFields:fields,value:e.value,unit:e.unit,window:e.window,scope:e.scope,dataTimes:e.dataTimes,source:e.source,additionalPhraseNumbers:'All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose.'});
 }
 const rules=result.validation.analysis.reassessmentConditions.filter(c=>c.conditionType==='PROGRAM_RULE').map(c=>fresh.rules.find(r=>r.id===c.ruleId));
 if(result.input.structures.length||result.validation.analysis.structureEvidenceIds.length)errors.push('UNEXPECTED_STRUCTURE_IN_DEFAULT_PROBE');
 if(!result.rendered.text.includes(result.envelope.provenance.sourceType)||!result.rendered.text.includes(MODE)||!result.rendered.text.includes('causalBacktestEligible=false'))errors.push('SOURCE_OR_TIME_LABEL_MISSING');
 return {ok:!errors.length,status:errors.length?'AUDIT_FAILED':'PASS',errors,claims,programRules:rules.map(r=>({renderedRule:r,baselineFactsEvidenceId:r.baselineEvidenceId,thresholdSource:'Existing deterministic directionalInput rule formula (not a market observation)',formula:r.metric==='PRICE_CLOSED_CHANGE'?'opposite sign * max(1, abs(current price change)/2)':'opposite sign * max(5, abs(current OI quantity change)/2)'})),otherNumerals:'Version/horizon/time metadata and existing deterministic rule thresholds; no model market numerical fields are allowed by strict business schema.'};
}
export function qualityReview(result){
 if(!result.validation.ok)return {status:'NOT_APPLICABLE',reason:'No final legal analysis; do not replace contract failure with quality review.'};
 const a=result.validation.analysis,i=result.input,w=i.windows.find(w=>w.horizon===a.horizon),map=new Map(i.evidence.map(e=>[e.evidenceId,e])),p=Number(map.get(w.priceId)?.value),sign=a.direction.startsWith('BULLISH')?1:a.direction.startsWith('BEARISH')?-1:0;
 const opposing=i.windows.filter(x=>x.horizon!==a.horizon&&Number(map.get(x.priceId)?.value)*p<0).map(x=>x.priceId),selected=new Set([...a.supportingEvidenceIds,...a.conflictingEvidenceIds]),unaddressed=opposing.filter(id=>!selected.has(id));
 return {status:unaddressed.length?'FAIL':'UNCERTAIN',directionalInclination:sign?'PASS':'NOT_APPLICABLE',futureHorizon:'PASS',supportEvidence:'PASS',majorConflictConsideration:unaddressed.length?'FAIL':'PASS',unaddressedOpposingPriceIds:unaddressed,unsupportedCausality:'PASS',beyondPastFactRecap:'UNCERTAIN',conditionalHypothesis:'PASS',observableReassessment:a.reassessmentConditions.every(c=>c.conditionType==='INSUFFICIENT_STRUCTURE_DATA')?'FAIL':a.reassessmentConditions.some(c=>c.conditionType==='PROGRAM_RULE')?'PASS':'UNCERTAIN',concreteTradeOpportunity:'NOT_APPLICABLE',directionSeparatedFromTrade:'PASS',noEdgeReason:a.direction==='NO_EDGE'?'UNCERTAIN':'NOT_APPLICABLE',limitation:'Finite hypothesis/evidence enums cannot expose detailed reasoning or prove predictive edge. Correct IDs do not establish interpretive relevance; no outcome-based assessment performed.'};
}
export async function runProbe({selected,adapter,dir,check=()=>{},gate=()=>({ok:true}),expectedSource='LIVE_MODEL_RESPONSE'}){
 if(selected.length>10||new Set(selected.map(s=>s.symbol+'|'+s.originalEvaluationTime)).size!==selected.length)throw Error('SAMPLE_BUDGET_OR_DUPLICATE');
 const budget=new Budget(),results=[],ledger=[];let stopReason=null,batchGate=null;
 for(let index=0;index<selected.length;index++){
  if(index===5&&!stopReason){check();batchGate=await gate(results);write(dir+'/batch_a_gate.json',batchGate);if(!batchGate.ok)stopReason='BATCH_A_SAFETY_GATE_FAILED';}
  const sample=selected[index];if(stopReason){results.push({...sample,finalStatus:'BLOCKED',stopReason,attempts:[]});continue;}
  check();if(hash(sample.factsPath)!==sample.factsHash)throw Error('FROZEN_FACTS_CHANGED');const {facts,timeAudit}=inspectFacts(sample.factsPath),attempts=[];
  for(let n=0;n<3;n++){
   check();budget.charge(sample.sampleId);const intentId=crypto.randomUUID(),last=attempts.at(-1),system=n?SYSTEM+'\n'+RECOVERY+JSON.stringify({originalOutput:last?.rawText??null,validationErrors:last?.validation?.errors??[],diagnostics:last?.validation?.diagnostics??[]}):SYSTEM;
   write(dir+'/requests/'+intentId+'.json',{intentId,sampleId:sample.sampleId,attempt:n+1,originalEvaluationTime:sample.originalEvaluationTime,probeMode:MODE,causalBacktestEligible:false,system,input:buildStructuredInput(facts),parameters:PARAMETERS,budgetReservedBeforeDispatch:budget.total});
   let result,error=null;try{result=await executeStructuredExperiment({facts,adapter,system,maxTokens:PARAMETERS.max_tokens});}catch(e){error=safeError(e);}
   const record=adapter.records().at(-1),id=record?.requestId??intentId;
   const raw=record?.rawResponse??null,rawText=raw?.choices?.[0]?.message?.content??null,schemaValid=result?Boolean(validateModelOutput(result.envelope.analysis)):false;
   const attempt={intentId,requestId:id,requestIdKind:record?.requestIdKind??'LOCAL_TRACKING_ID',sampleId:sample.sampleId,attempt:n+1,...timeAudit,researchExecutedAt:record?.requestedAt??null,receivedAt:record?.receivedAt??null,actualModel:raw?.model??null,physicalRequests:record?.physicalRequests??0,apiResponseStatus:error?'API_ERROR':'SUCCESS_RESPONSE_RETURNED',httpStatus:'UNKNOWN_CLIENT_DOES_NOT_EXPOSE_STATUS',serverResponseId:raw?.id??null,serverRequestId:null,rawText,jsonParseable:!!result&&!result.envelope.audit.parseError,schemaValid,validation:result?.validation??{ok:false,errors:['API_ERROR'],error},trustedProvenance:result?.envelope.provenance??null,analysis:result?.envelope.analysis??null,rendererAudit:result?rendererAudit(result,facts):null,renderedText:result?.rendered.text??null,qualityReview:result?qualityReview(result):{status:'NOT_APPLICABLE'},tokenUsage:raw?.usage??null,rawResponsePath:dir+'/raw_responses/'+id+'.json',error};
   // Receipt-bound validator and renderer have already run; only now serialize.
   write(attempt.rawResponsePath,{requestId:id,sampleId:sample.sampleId,raw,record});
   write(dir+'/provenance/'+id+'.json',{sampleId:sample.sampleId,provenance:attempt.trustedProvenance,validation:attempt.validation});
   write(dir+'/validation/'+id+'.json',attempt);write(dir+'/rendered/'+id+'.json',{sampleId:sample.sampleId,text:attempt.renderedText,audit:attempt.rendererAudit});write(dir+'/quality_review/'+id+'.json',attempt.qualityReview);
   attempts.push(attempt);ledger.push({sampleId:sample.sampleId,attempt:n+1,requestId:id,intentId,physicalRequests:attempt.physicalRequests,requestedAt:attempt.researchExecutedAt,apiResponseStatus:attempt.apiResponseStatus,sourceType:attempt.trustedProvenance?.sourceType??null});write(dir+'/ledger_entries/'+String(ledger.length).padStart(2,'0')+'.json',ledger.at(-1));
   console.log(`${index<5?'A':'B'} ${sample.symbol} attempt=${n+1} schema=${schemaValid} full=${attempt.validation.ok} errors=${attempt.validation.errors.join(',')} physical=${adapter.counts().livePhysicalRequests}`);
   check();if(error){stopReason='API_ERROR';break;}
   if(attempt.trustedProvenance.sourceType!==expectedSource||!attempt.validation.provenanceValid){stopReason='PROVENANCE_BINDING_FAILURE';break;}
   if(!attempt.rendererAudit.ok){stopReason='RENDERER_FACT_SAFETY_FAILURE';break;}
   if(attempt.validation.ok)break;
  }
  const final=attempts.at(-1),finalStatus=final?.error?'API_ERROR':final?.validation.ok?(attempts.length===1?'FIRST_PASS_VALID':`RECOVERY_${attempts.length-1}_VALID`):stopReason?'BLOCKED':'FINAL_INVALID';
  const result={...sample,finalStatus,attempts,analysis:final?.validation.ok?final.analysis:null};results.push(result);write(dir+'/samples/'+sample.sampleId+'.json',result);
 }
 if(!batchGate){batchGate={ok:false,status:'NOT_REACHED',stopReason};write(dir+'/batch_a_gate.json',batchGate);}
 write(dir+'/request_ledger.json',{probeMode:MODE,causalBacktestEligible:false,budgetReservations:budget.total,adapterCounts:adapter.counts(),entries:ledger});write(dir+'/results.json',{probeMode:MODE,causalBacktestEligible:false,stopReason,batchGate,results});return {results,stopReason,batchGate,budget,ledger};
}
export function safetyGate(results){
 const attempts=results.flatMap(r=>r.attempts),errors=[];
 if(results.length!==5)errors.push('INCOMPLETE_BATCH_A');
 if(attempts.some(a=>!a.validation.provenanceValid||a.trustedProvenance?.sourceType!=='LIVE_MODEL_RESPONSE'))errors.push('PROVENANCE_FAILURE');
 if(attempts.some(a=>!a.rendererAudit?.ok||!a.validation.ok&&a.renderedText!==null))errors.push('FACT_RENDERER_FAILURE');
 if(results.every(r=>r.finalStatus==='FINAL_INVALID')){const sets=results.map(r=>r.attempts.at(-1).validation.errors);const common=sets[0]?.filter(e=>sets.every(s=>s.includes(e)))??[];if(common.length)errors.push('SHARED_FIXED_FAILURE_WITH_NO_VALID_DIAGNOSTIC_PROGRESS:'+common.join(','));}
 return {ok:!errors.length,errors,reviewedSamples:results.length,reviewedAttempts:attempts.length,review:'Independent original-Facts rebuild and source/renderer audit, full guard preserved, no structure objects supplied, failures never relabelled NO_EDGE; subjective quality separately recorded.',at:new Date().toISOString()};
}
export function summarize(run){
 const samples=run.results,executed=samples.filter(s=>s.attempts.length),attempts=executed.flatMap(s=>s.attempts),first=executed.map(s=>s.attempts[0]),valid=executed.filter(s=>s.analysis),distribution=Object.fromEntries(['BULLISH','BEARISH','BULLISH_REVERSAL','BEARISH_REVERSAL','NO_EDGE'].map(d=>[d,valid.filter(s=>s.analysis.direction===d).length]));
 return {probeMode:MODE,causalBacktestEligible:false,plannedSamples:samples.length,executedSamples:executed.length,completedFirstResponses:first.filter(a=>!a.error).length,firstJsonParseable:first.filter(a=>a.jsonParseable).length,firstSchemaValid:first.filter(a=>a.schemaValid).length,firstFullValid:first.filter(a=>a.validation.ok).length,recovery1Valid:samples.filter(s=>s.finalStatus==='RECOVERY_1_VALID').length,recovery2Valid:samples.filter(s=>s.finalStatus==='RECOVERY_2_VALID').length,finalValid:valid.length,finalFailed:executed.filter(s=>!s.analysis).length,notExecuted:samples.length-executed.length,physicalRequests:attempts.reduce((n,a)=>n+a.physicalRequests,0),conservativeBudgetReservations:run.budget.total,apiErrors:attempts.filter(a=>a.error).length,validDirectionDistribution:distribution,invalidResponseDirections:attempts.filter(a=>!a.validation.ok).map(a=>({sampleId:a.sampleId,attempt:a.attempt,direction:a.analysis?.direction??null,errors:a.validation.errors})),tokenUsage:attempts.reduce((total,a)=>{for(const [k,v] of Object.entries(a.tokenUsage??{}))if(typeof v==='number')total[k]=(total[k]??0)+v;return total;},{}),cost:null,costReason:'No billed cost field captured; no guessed pricing.',validationErrors:Object.fromEntries([...new Set(attempts.flatMap(a=>a.validation.errors))].map(e=>[e,attempts.filter(a=>a.validation.errors.includes(e)).length])),batchGate:run.batchGate,stopReason:run.stopReason};
}
const CORE=['schema','input','guard','renderer','provenance','executor'].map(n=>`src/analysis/experimental/structured-v4-${n}.js`);
function frozenFiles(){return [...walk('src'),...walk('scripts'),...walk('test'),'package.json','package-lock.json'];}
function assertContract(manifest){for(const [p,h] of Object.entries(manifest.fileHashes))if(hash(p)!==h)throw Error('FROZEN_CONTRACT_CHANGED:'+p);if(digest(SYSTEM)!==manifest.prompt.sha256||digest(RECOVERY)!==manifest.recoveryPrompt.sha256||config.deepseekModel!==manifest.model||process.env.DEEPSEEK_PROXY_ENABLED==='1'!==manifest.proxyEnabled)throw Error('FROZEN_PARAMETERS_CHANGED');if(hash(DIR+'/selected_samples.json')!==manifest.sampleListHash)throw Error('FROZEN_SELECTION_CHANGED');}
export function prepare(){
 if(fs.existsSync(DIR+'/contract_manifest.json'))throw Error('ALREADY_FROZEN_NO_OVERWRITE');
 const selection=selectSamples();if(selection.selected.length!==10)throw Error('INSUFFICIENT_SAFE_HISTORICAL_SAMPLES');
 write(DIR+'/selected_samples.json',selection);write(DIR+'/prompt.json',{version:'V4_ISOLATED_INITIAL_INVOCATION_V1',system:SYSTEM,recoveryVersion:'V4_CONTROLLED_CONTRACT_RECOVERY_V1',recovery:RECOVERY,establishedBeforeAnyDispatch:true,existingCorePromptModified:false});
 const manifest={version:'V4_LIVE_RERUN_FROZEN_CONTRACT_V1',probeMode:MODE,causalBacktestEligible:false,gitCommit:null,gitReason:'NOT_A_GIT_REPOSITORY',prompt:{version:'V4_ISOLATED_INITIAL_INVOCATION_V1',sha256:digest(SYSTEM)},recoveryPrompt:{version:'V4_CONTROLLED_CONTRACT_RECOVERY_V1',sha256:digest(RECOVERY)},schema:{version:'STRUCTURED_ANALYST_V4_EXPERIMENT',sha256:digest(modelOutputSchema)},provenanceVersion:'V4_PROVENANCE_ENVELOPE_V1',coreHashes:Object.fromEntries(CORE.map(p=>[p,hash(p)])),fileHashes:Object.fromEntries(frozenFiles().map(p=>[p,hash(p)])),model:config.deepseekModel,provider:'deepseek',endpointOrigin:'https://api.deepseek.com',parameters:PARAMETERS,budget:{samples:10,perSample:3,recoveriesPerSample:2,physicalRequests:30},node:process.version,proxyEnabled:process.env.DEEPSEEK_PROXY_ENABLED==='1',proxyConfigured:!!config.proxy,sampleListHash:hash(DIR+'/selected_samples.json'),startedAt:new Date().toISOString()};write(DIR+'/contract_manifest.json',manifest);
 const before=read(DIR+'/before-hashes.json');write(DIR+'/preflight.json',{...protect(before),frozenCoreMatchesBaseline:CORE.every(p=>hash(p)===before[p]),samples:selection.selected.map(s=>({sampleId:s.sampleId,...inspectFacts(s.factsPath).timeAudit})),keyPresent:!!config.deepseekKey,actualDeepSeekCalls:0,binanceCalls:0,dingTalkCalls:0,scannerStarted:false});console.log('FROZEN_SAFE_SAMPLES='+selection.selected.length+' missingScenarios='+selection.missingScenarios.join(','));
}
async function live(){
 if(fs.existsSync(DIR+'/request_ledger.json')||walk(DIR+'/requests').length)throw Error('NO_RESTART_OR_OVERWRITE');
 if(!config.deepseekKey)throw Error('MISSING_DEEPSEEK_API_KEY');const manifest=read(DIR+'/contract_manifest.json'),before=read(DIR+'/before-hashes.json');
 const check=()=>{assertContract(manifest);protect(before);};check();
 const adapter=createLiveV4Adapter({maxRequests:30});
 const run=await runProbe({selected:read(DIR+'/selected_samples.json').selected,adapter,dir:DIR,check,gate:results=>{check();return {...safetyGate(results),integrity:protect(before),budget:adapter.counts(),binanceRequests:0,dingTalkRequests:0,scannerStarted:false};}});
 write(DIR+'/summary.json',summarize(run));write(DIR+'/integrity-after-live.json',{...protect(before),coreUnchanged:true,binanceRequests:0,dingTalkRequests:0,scannerStarted:false});console.log(JSON.stringify(read(DIR+'/summary.json')));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const mode=process.argv[2];Promise.resolve().then(()=>mode==='--prepare'?prepare():mode==='--live'?live():Promise.reject(Error('EXPLICIT_PREPARE_OR_LIVE_REQUIRED'))).catch(e=>{console.error(safeError(e));process.exitCode=1;});
}
