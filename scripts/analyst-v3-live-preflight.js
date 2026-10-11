// Read-only source audit. No HTTP/client/pipeline imports; no model request can be made here.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
import {config} from '../src/config.js';import {generationRules,recoveryRules,GENERATION_VERSION,INPUT_FORMAT_VERSION} from '../src/analysis/directional-generation.js';
import {directionalSchemaV2} from '../src/analysis/directional-schema.js';
export const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);
export function availability(source,evaluationTime){
 // retrievedAt proves actual acquisition by that time, not first exchange publication.
 // If acquired later, we cannot assume earlier availability from event timestamps.
 if(!Number.isSafeInteger(evaluationTime))return {ok:false,reason:'INVALID_EVALUATION_TIME'};
 if(!Number.isSafeInteger(source?.retrievedAt))return {ok:false,reason:'HISTORICAL_AVAILABILITY_NOT_RECORDED'};
 if(source.retrievedAt>evaluationTime)return {ok:false,reason:'NOT_PROVEN_AVAILABLE_AT_EVALUATION',retrievedAt:source.retrievedAt,delayMs:source.retrievedAt-evaluationTime};
 return {ok:true,reason:'ACQUIRED_BY_EVALUATION',retrievedAt:source.retrievedAt,delayMs:source.retrievedAt-evaluationTime};
}
export function inspectFacts(file){const f=JSON.parse(fs.readFileSync(file)),evaluationTime=f.dataCutoff;
 const keys=['exchange','ticker','hour','five','oi','funding',...['accounts','topAccounts','topPositions'].filter(k=>Array.isArray(f.sources?.[k]?.raw)&&f.sources[k].raw.length)];
 const sources=keys.map(key=>({key,endpoint:f.sources?.[key]?.endpoint??null,...availability(f.sources?.[key],evaluationTime)}));
 return {sampleId:f.runId+'|'+f.symbol+'|'+evaluationTime,symbol:f.symbol,runId:f.runId,evaluationTime:Number.isSafeInteger(evaluationTime)?new Date(evaluationTime).toISOString():null,
 originalFactsPath:file,originalFactsHash:hash(file),originalEvidenceCount:f.evidence?.length??null,sources,status:sources.every(s=>s.ok)?'AVAILABILITY_PRECHECK_PASS':'EXCLUDED_CAUSAL_AVAILABILITY',
 reason:sources.filter(s=>!s.ok).map(s=>({key:s.key,reason:s.reason,delayMs:s.delayMs??null})),
 interpretation:'Later retrieval is not proof of future market events; without earlier acquisition/publication records, historical availability remains unproven.'};}
export function inventory(data='data'){return walk(data).filter(p=>/\/facts\/[^/]+\.json$/.test(p)).sort().map(inspectFacts);}
export function assertFrozen(frozen){for(const [p,h]of Object.entries(frozen.files))if(hash(p)!==h)throw Error('FROZEN_CONTRACT_CHANGED');if(hash('src/clients/deepseek.js')!==frozen.modelClientHash||hash('src/config.js')!==frozen.configHash||config.deepseekModel!==frozen.modelParameters.model)throw Error('FROZEN_CLIENT_OR_PARAMETERS_CHANGED');}
function main(){const dir='validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1';if(fs.existsSync(dir))throw Error('NO_OVERWRITE');fs.mkdirSync(dir,{recursive:true});
 const frozen=JSON.parse(fs.readFileSync('validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/frozen-contract.json'));assertFrozen(frozen);
 const files=[...walk('data'),...walk('src'),...walk('test'),...walk('scripts'),...walk('validation').filter(p=>!p.startsWith(dir+'/')),...fs.readdirSync('.').filter(p=>p.endsWith('.md')||p.endsWith('SCHEMA.json')||['.env','package.json','package-lock.json'].includes(p))];
 const before=Object.fromEntries(files.map(p=>[p,hash(p)])),rows=inventory(),selected=rows.filter(r=>r.status==='AVAILABILITY_PRECHECK_PASS');
 const write=(name,value)=>fs.writeFileSync(dir+'/'+name,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
 write('before-hashes.json',before);write('sample_inventory.json',rows);write('selected_samples.json',{planned:10,actualExecutable:selected.length,selected,reason:'No historical package proves complete core evidence acquired by its original evaluationTime. Excluding uncertain fields removes mandatory core input; original evaluationTime is not shifted.'});
 write('manifest.json',{task:'BA_BIAS_ANALYST_V3_LIVE_PROBE_V1',status:selected.length?'PREFLIGHT_ONLY':'BLOCKED_CAUSAL_AVAILABILITY',recordedAt:new Date().toISOString(),gitCommit:null,gitReason:'NOT_A_GIT_REPOSITORY',generationVersion:GENERATION_VERSION,inputFormatVersion:INPUT_FORMAT_VERSION,outputSchemaVersion:'DIRECTIONAL_ANALYST_V2',frozenContract:frozen,
 initialSystemHash:crypto.createHash('sha256').update(generationRules+'输出严格遵守Schema：'+JSON.stringify(directionalSchemaV2)).digest('hex'),recoveryPromptHash:crypto.createHash('sha256').update(recoveryRules).digest('hex'),
 deepseekKeyPresent:!!config.deepseekKey,deepseekOriginApproved:new URL(config.deepseekBase).origin==='https://api.deepseek.com',proxyEnabled:process.env.DEEPSEEK_PROXY_ENABLED==='1',proxyConfigured:!!config.proxy,
 productionMaximumCalls:2,authorizedProbeMaximumCalls:3,probeBudget:{samples:10,perSample:3,physicalRequests:30,includesInternalRetries:true},networkAttempted:false,
 isolation:'This preflight imports no HTTP clients, scanner, scheduler, pipeline, delivery or storage writers. Config only loads existing .env. All writes are isolated.'});
 write('summary.json',{status:'BLOCKED_CAUSAL_AVAILABILITY',plannedSamples:10,inspectedFacts:rows.length,availabilityPass:selected.length,attemptedSamples:0,completedFirstResponses:0,physicalRequests:0,apiFailures:0,responses:0,firstSchemaValid:0,firstFullValid:0,recovery1Valid:0,recovery2Valid:0,eventuallyValid:0,finalInvalid:0,notAttempted:rows.length,
 firstSuccessRate:null,firstSuccessOverAttempts:null,finalSuccessRate:null,biasCounts:Object.fromEntries(['BULLISH','BEARISH','BULLISH_REVERSAL','BEARISH_REVERSAL','NO_EDGE'].map(b=>[b,0])),qualityReview:'NOT_TESTED',productionIntegration:'NOT_TESTED',comparison:'UNPAIRED_DESCRIPTIVE_COMPARISON — no V3 observations',tokens:null,estimatedCost:null});
 console.log(JSON.stringify({inspected:rows.length,eligible:selected.length,physicalRequests:0,status:'BLOCKED_CAUSAL_AVAILABILITY'}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
