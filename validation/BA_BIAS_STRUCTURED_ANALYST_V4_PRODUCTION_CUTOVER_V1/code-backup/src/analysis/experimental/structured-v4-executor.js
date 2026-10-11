import fs from 'node:fs';import path from 'node:path';
import {buildStructuredInput} from './structured-v4-input.js';
import {guardStructuredAnalysis} from './structured-v4-guard.js';
import {renderStructuredAnalysis} from './structured-v4-renderer.js';
export async function executeStructuredExperiment({facts,adapter,system,maxTokens=6000}){
 const input=buildStructuredInput(facts);const envelope=await adapter.receive({system,input,maxTokens});
 const validation=guardStructuredAnalysis(envelope,input),rendered=renderStructuredAnalysis(envelope,input);
 return {version:'V4_PROVENANCE_EXPERIMENT_RESULT_V1',status:'NOT_PRODUCTION',probeMode:input.probeMode,originalEvaluationTime:input.originalEvaluationTime,collectionCompletedAt:'UNKNOWN',researchExecutedAt:envelope.provenance.requestedAt,causalBacktestEligible:false,input,envelope,validation,rendered,requestRecords:adapter.records(),counts:adapter.counts()};
}
export function saveIsolatedExperiment(directory,result){
 const root=path.resolve('validation'),target=path.resolve(directory);
 if(!target.startsWith(root+path.sep))throw Error('ISOLATED_VALIDATION_DIRECTORY_REQUIRED');
 for(let current=target;current!==path.dirname(root);current=path.dirname(current)){if(fs.existsSync(current)&&fs.lstatSync(current).isSymbolicLink())throw Error('SYMLINK_STORAGE_FORBIDDEN');}
 // No production directory, no overwritten existing response or experiment.
 fs.mkdirSync(target,{recursive:true});const file=path.join(target,result.envelope.provenance.requestId+'.json');fs.writeFileSync(file,JSON.stringify(result,null,2)+'\n',{flag:'wx'});return file;
}
