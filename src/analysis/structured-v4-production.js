import {presentationRule} from '../intelligence/v4-conditions.js';
import fs from 'node:fs';import crypto from 'node:crypto';
import {buildStructuredInput} from './experimental/structured-v4-input.js';
import {guardStructuredAnalysis} from './experimental/structured-v4-guard.js';
import {renderStructuredAnalysis} from './experimental/structured-v4-renderer.js';
import {createProductionV4Adapter,createProductionMockV4Adapter} from './experimental/structured-v4-provenance.js';
import {productionOutputSchema,validateProductionOutput} from './experimental/structured-v4-schema.js';
import {safeError} from '../config.js';
const prompt=JSON.parse(fs.readFileSync(new URL('./structured-v4-prompt.json',import.meta.url)));
export const V4_SYSTEM=prompt.system,V4_RECOVERY=prompt.recovery;
export function v4Readiness(){return {analystVersion:'V4',contractVersion:'STRUCTURED_ANALYST_V4',schemaValid:productionOutputSchema.properties.direction.enum.length===5,promptVersion:prompt.version,promptHash:crypto.createHash('sha256').update(V4_SYSTEM).digest('hex')};}
export function productionAdapter({mockClient,signal}={}){
 if(!mockClient)return createProductionV4Adapter({signal});
 // Injected tests are always MOCK. Caller JSON cannot mint LIVE provenance.
 return createProductionMockV4Adapter({respond:async({system,input,maxTokens})=>({model:'mock-model',choices:[{message:{content:JSON.stringify(await mockClient.json(system,input,{maxTokens}))}}]})});
}
const mechanism={CO_MOVEMENT_ONLY:'价格与OI出现同期变化，不能确定具体参与者行为。',CONTRACT_EXPANSION_COMPATIBLE:'价格变化伴随未平仓规模扩张，不能确认新增仓位来自哪一侧。',CONTRACT_CONTRACTION_COMPATIBLE:'价格变化伴随未平仓规模收缩，不能确认具体开平仓或强平行为。',UNDETERMINED:'目前无法确定市场机制。'};
const thesis={CONTINUATION:'短线存在延续当前方向的可能，仍是条件性假设。',TURN:'前期与近期价格发生转向，后续反转延续仍需确认。',COUNTER_MOVE:'存在逆当前走势的竞争假设，需后续事实确认。',NO_CLEAR_EDGE:'证据不足以支持清晰方向优势。'};
const alternative={OPPOSITE_MOVE:'价格可能向相反方向变化。',CONSOLIDATION:'价格可能转入震荡。',CONTINUATION:'原走势也可能继续。'};
export function consumeV4(result){
 const validation=result?.status==='VALIDATED'&&result?.envelope&&result?.input?guardStructuredAnalysis(result.envelope,result.input):{ok:false};
 if(!validation.ok)return {analystVersion:'V4',status:'FAILED',displayState:'ANALYST_UNAVAILABLE',analysis:null,rendered:null,rules:[],evidence:[],conflictingEvidence:[],fallbackHorizon:result?.input?.windows.find(w=>w.priceId)?.horizon||'1h'};
 const a=validation.analysis,input=result.input,map=new Map(input.evidence.map(e=>[e.evidenceId,e])),ruleIds=a.reassessmentConditions.filter(c=>c.conditionType==='PROGRAM_RULE').map(c=>c.ruleId),rules=input.rules.filter(r=>ruleIds.includes(r.id)).map(r=>presentationRule(r,a.direction));
 const describe=e=>({evidenceId:e.evidenceId,result:e.value,phrase:e.semanticDescription,scope:e.scope,window:e.window,unit:e.unit,dataTimes:e.dataTimes});
 const conditions=a.reassessmentConditions.map(c=>c.conditionType==='PROGRAM_RULE'?rules.find(r=>r.id===c.ruleId).description:c.conditionType==='ABSTRACT_REASSESSMENT'?`观察${map.get(c.metricOrStructureEvidenceId).semanticDescription}是否变化；仅复核，不自动失效。`:c.conditionType==='INSUFFICIENT_STRUCTURE_DATA'?'没有可靠结构失效位，不编造支撑、阻力或价格。':`仅复核已验证的单根K线边界 ${map.get(c.metricOrStructureEvidenceId).value} USDT，不作为支撑阻力。`);
 return {analystVersion:'V4',contractVersion:'STRUCTURED_ANALYST_V4',status:'VALIDATED',displayState:a.direction==='NO_EDGE'?'VALID_NO_EDGE':'VALID_DIRECTION',rawAnalysis:a,analysis:{...a,marketBias:a.direction,invalidation:{type:a.direction==='NO_EDGE'?'REASSESSMENT_ONLY':ruleIds.length?'OBSERVABLE_CONDITION':'INSUFFICIENT_STRUCTURE_DATA',ruleIds,description:conditions.join('；')}},rules,evidence:a.supportingEvidenceIds.map(id=>describe(map.get(id))),conflictingEvidence:a.conflictingEvidenceIds.map(id=>describe(map.get(id))),rendered:{marketThesis:thesis[a.directionalRationale.hypothesis],marketMechanism:mechanism[a.mechanismHypothesis.type],horizonReason:'历史观察窗口与未来研究周期分开；预测从持久化确认后开始。',alternativeScenario:alternative[a.directionalRationale.alternative],invalidationDescription:conditions.join('；'),followUpChecks:conditions.filter((_,i)=>a.reassessmentConditions[i].conditionType==='ABSTRACT_REASSESSMENT')},trustedProvenance:validation.provenance,time:result.time,causalBacktestEligible:false};
}
export async function analyzeV4(adapter,facts,{signal,now=Date.now}={}){
 const frozen=structuredClone(facts),factsFrozenAt=Date.now(),attempts=[];let input;
 try{input=buildStructuredInput(frozen,{production:true});}
 catch(e){return {analystVersion:'V4',contractVersion:'STRUCTURED_ANALYST_V4',generationVersion:prompt.version,status:'FAILED',input:{symbol:frozen.symbol,evaluationTime:new Date(frozen.dataCutoff).toISOString(),windows:[],rules:[],evidence:[]},envelope:null,analysis:null,rendered:null,deterministicText:null,validation:{ok:false,provenanceValid:false,analysisValid:false,errors:['INPUT_BUILD_FAILED']},attempts:[{attempt:0,errors:['INPUT_BUILD_FAILED'],error:safeError(e)}],time:{factsFrozenAt,predictionCommittedAt:null,probeMode:'LIVE_CAUSAL_INCOMPLETE',causalBacktestEligible:false,evaluationEligibility:'INPUT_BUILD_FAILED'},failureReason:'INPUT_BUILD_FAILED'};}
 const sourceDataTime=Object.fromEntries(input.evidence.map(e=>[e.evidenceId,e.dataTimes]));
 const sourceObservations=Object.fromEntries(Object.entries(frozen.sources).map(([k,s])=>[k,Number.isSafeInteger(s.retrievedAt)?s.retrievedAt:null]));
 // retrievedAt is the client-observed acquisition completion, not exchange event time.
 const time={evaluationTime:frozen.dataCutoff,marketEventTime:Object.fromEntries(input.evidence.map(e=>[e.evidenceId,e.observedAt])),sourceDataTime,firstObservedAt:sourceObservations,factsFrozenAt,analystRequestedAt:null,analystCompletedAt:null,predictionCommittedAt:null,probeMode:'LIVE_CAUSAL_INCOMPLETE',causalBacktestEligible:false,evaluationEligibility:'INCOMPLETE_NO_POST_COMMIT_BASELINE',factsHash:crypto.createHash('sha256').update(JSON.stringify(frozen)).digest('hex')};
 let envelope=null,validation=null,rendered=null;
 for(let n=0;n<2;n++){
  signal?.throwIfAborted();
  const last=attempts.at(-1),system=n?V4_SYSTEM+'\n'+V4_RECOVERY+JSON.stringify({originalOutput:last?.raw??null,validationErrors:last?.errors??[],diagnostics:last?.diagnostics??[]}):V4_SYSTEM;
  try{
   envelope=await adapter.receive({system,input,maxTokens:6000});validation=guardStructuredAnalysis(envelope,input);rendered=renderStructuredAnalysis(envelope,input);
   time.analystRequestedAt=Date.parse(envelope.provenance.requestedAt);time.analystCompletedAt=Date.parse(envelope.provenance.receivedAt);
   attempts.push({attempt:n+1,raw:envelope.analysis,provenance:envelope.provenance,rawResponse:adapter.records().at(-1)?.rawResponse??null,errors:validation.errors,diagnostics:validation.diagnostics??[],schemaValid:Boolean(validateProductionOutput(envelope.analysis)),validation,rendered:rendered.text});
   if(validation.ok)break;if(!validation.provenanceValid)break;
  }catch(e){if(signal?.aborted)throw e;attempts.push({attempt:n+1,error:safeError(e),errors:[safeError(e)]});break;}
 }
 const base={analystVersion:'V4',contractVersion:'STRUCTURED_ANALYST_V4',generationVersion:prompt.version,status:validation?.ok?'VALIDATED':'FAILED',input,envelope,validation,deterministicText:validation?.ok?rendered.text:null,time,attempts,sourceFactsHash:crypto.createHash('sha256').update(JSON.stringify(frozen.sources)).digest('hex')};
 const mapped=consumeV4(base);return {...base,analysis:mapped.analysis,rendered:mapped.rendered,failureReason:validation?.ok?null:'ANALYST_VALIDATION_OR_REQUEST_FAILED'};
}
export function groundedV4(result,facts){
 if(result?.sourceFactsHash!==crypto.createHash('sha256').update(JSON.stringify(facts.sources)).digest('hex')||result.input?.symbol!==facts.symbol||result.input?.evaluationTime!==new Date(facts.dataCutoff).toISOString())return {analystVersion:'V4',status:'FAILED',analysis:null,rendered:null,rules:[],evidence:[],conflictingEvidence:[],fallbackHorizon:'1h'};
 return consumeV4(result);
}
