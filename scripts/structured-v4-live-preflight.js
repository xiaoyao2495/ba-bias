import {pathToFileURL as retiredEntryURL} from 'node:url';
// Old CLI is audit-only; the production research entry is V2 exclusively.
if(process.argv[1]&&import.meta.url===retiredEntryURL(process.argv[1]).href)throw Error('LEGACY_LIVE_RESEARCH_RETIRED');
// Contract preflight only. No API client, secrets, state writer or scanner import.
import fs from 'node:fs';import crypto from 'node:crypto';import {pathToFileURL} from 'node:url';
import {buildStructuredInput} from '../src/analysis/experimental/structured-v4-input.js';
import {outputSchema,envelopeSchema} from '../src/analysis/experimental/structured-v4-schema.js';
import {guardStructuredAnalysis} from '../src/analysis/experimental/structured-v4-guard.js';
import {renderStructuredAnalysis} from '../src/analysis/experimental/structured-v4-renderer.js';
const read=p=>JSON.parse(fs.readFileSync(p));const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export function inspectV4LiveContract(facts,syntheticOutput){
 const input=buildStructuredInput(facts),control=guardStructuredAnalysis(syntheticOutput,input);
 const realOutput={...structuredClone(syntheticOutput),provenance:'REAL_MODEL_OUTPUT'};
 const actualValidator=guardStructuredAnalysis(realOutput,input),actualRenderer=renderStructuredAnalysis(realOutput,input);
 const controlRenderer=renderStructuredAnalysis(syntheticOutput,input);
 const sourceReady=envelopeSchema.properties.provenance.properties.sourceType.enum.includes('LIVE_MODEL_RESPONSE');
 return {verdict:sourceReady?'V4_PROVENANCE_CONTRACT_READY':'V4_CONTRACT_FIX_REQUIRED',executionAllowed:false,phase:'A_PRECHECK',reason:'Legacy self-declared live JSON remains rejected. The new controlled envelope admits live receipts; this preflight does not dispatch or constitute a live probe.',schemaProvenance:outputSchema.properties.provenance,liveProvenanceDiagnostic:actualValidator,liveRenderedText:actualRenderer.text,syntheticControl:{validation:control,rendererLabelsSynthetic:controlRenderer.text?.includes('SYNTHETIC_OR_CONVERTED')??false},inputCheck:{symbol:input.symbol,evaluationTime:input.evaluationTime,originalEvaluationTime:input.originalEvaluationTime,evidenceCount:input.evidence.length,allObservedWithinOriginalCutoff:input.evidence.every(e=>e.dataTimes.every(t=>t<=Date.parse(input.evaluationTime))),availability:input.availability,probeMode:input.probeMode,causalBacktestEligible:input.causalBacktestEligible},reproductionProvenance:'SYNTHETIC_OR_CONVERTED — offline counterexample, NOT a new model response',newExternalCalls:0};
}
export async function runV4LivePreflight({facts,syntheticOutput,request}){
 const preflight=inspectV4LiveContract(facts,syntheticOutput);
 // Even a supplied transport cannot be invoked until a separately reviewed
 // live contract exists. This file is not a claimed live execution adapter.
 if(!preflight.executionAllowed)return preflight;
 throw Error('LIVE_EXECUTION_NOT_IMPLEMENTED');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const out='validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1';const sample=read('validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/v4-offline-experiments.json').experiments[0];
 const result=await runV4LivePreflight({facts:read(sample.sourceFacts),syntheticOutput:sample.output,request:()=>{throw Error('UNAUTHORIZED_DISPATCH');}});
 const files=['src/analysis/experimental/structured-v4-schema.js','src/analysis/experimental/structured-v4-input.js','src/analysis/experimental/structured-v4-guard.js','src/analysis/experimental/structured-v4-renderer.js','scripts/structured-v4-live-preflight.js'];
 const write=(name,x)=>fs.writeFileSync(out+'/'+name,JSON.stringify(x,null,2)+'\n',{flag:'wx'});
 write('preflight.json',{...result,reproductionFactsPath:sample.sourceFacts,reproductionSource:'Prior explicitly converted V4 offline control; not a selected live sample'});
 write('contract_manifest.json',{createdAt:new Date().toISOString(),status:'PRECHECK_BLOCKED_NOT_LIVE_FROZEN',gitCommit:null,gitReason:'No Git repository at project root',promptVersion:null,promptSHA256:null,promptReason:'No existing V4 real-model Prompt; not authored because core contract is already blocked',schemaVersion:'STRUCTURED_ANALYST_V4_EXPERIMENT_SYNTHETIC_ONLY',files:Object.fromEntries(files.map(p=>[p,hash(p)])),recoveryPromptVersion:null,maxRecoveries:2,maxSamples:10,maxPhysicalRequests:30,plannedBatches:[5,5],generationParameters:null,parametersReason:'NOT_SELECTED — no live generation contract frozen',runtime:{node:process.version,platform:process.platform,arch:process.arch},externalCalls:0});
 write('selected_samples.json',{planned:10,selected:[],status:'NOT_SELECTED_PRECHECK_BLOCKED',reason:'Stopped at stage A/B contract compatibility; source control is not counted as a live sample'});
 write('summary.json',{verdict:result.verdict,phase:'A_PRECHECK',plannedSamples:10,executedSamples:0,completedFirstResponses:0,physicalRequests:0,validApiResponses:0,apiFailures:0,firstSchemaValid:0,firstFullValid:0,eventuallyFullValid:0,failedIndependentAnalyses:0,notExecutedSamples:10,rates:{firstSchema:null,firstFull:null,eventualFull:null,reason:'NOT_TESTED — denominator zero'},batches:{first:'NOT_EXECUTED_PRECHECK_BLOCKED',firstSafetyGate:'NOT_APPLICABLE',second:'NOT_EXECUTED_PRECHECK_BLOCKED'},directionCounts:null,structureReferenceCounts:null,rendererNumericCounts:null,tokens:null,contractReliability:'BLOCKED_LIVE_PROVENANCE',factualSafety:'NOT_TESTED_LIVE',directionalUsefulness:'UNKNOWN',productionIntegration:'NOT_TESTED',comparison:'UNPAIRED_DESCRIPTIVE_COMPARISON — no V4 live observations',probeMode:'POST_COLLECTION_HISTORICAL_RESEARCH',causalBacktestEligible:false,collectionCompletedAt:'NOT_APPLICABLE_NO_SELECTED_LIVE_SAMPLE',researchExecutedAt:'NOT_APPLICABLE_NO_REQUEST',externalCalls:0,notifications:0});
 console.log(JSON.stringify({verdict:result.verdict,requests:0,syntheticControlValid:result.syntheticControl.validation.ok,realProvenanceErrors:result.liveProvenanceDiagnostic.errors}));
}
