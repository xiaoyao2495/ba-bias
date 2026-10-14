import fs from 'node:fs';
import {DeepSeek} from '../../clients/deepseek.js';
import {Http} from '../../clients/http.js';
import {config,safeError} from '../../config.js';
import {buildInput,knowledgeHash} from './input.js';
import {CONTRACT,recordId,sha,fail} from './common.js';
import {parseAnalysis,validateResearch} from './parser.js';
import {guardResearch,guardAnalysis} from './guard.js';
const pointer=JSON.parse(fs.readFileSync(new URL('./prompt.json',import.meta.url)));
const document=fs.readFileSync(new URL(pointer.source,import.meta.url),'utf8'),blocks=[...document.matchAll(/```text\n([\s\S]*?)\n```/g)];
if(blocks.length!==1||sha(blocks[0][1])!==pointer.blockSha256)throw fail('FROZEN_PROMPT_IDENTITY_MISMATCH');
export const SYSTEM=blocks[0][1],PROMPT_HASH=sha(SYSTEM),V2_MAX_OUTPUT_TOKENS=8000;
export function readiness(){return {contract:CONTRACT,researchFormat:'MINIMAL_MARKET_RESEARCH_V1',schemaValid:true,knowledgeRegistrySha256:knowledgeHash,promptHash:PROMPT_HASH,automaticFallback:false,automaticRetries:0,manualReviewRequired:true};}
export function createAdapter({mockClient,signal,now=Date.now}={}){
 const endpoint=new URL(config.deepseekBase);if(!mockClient&&(endpoint.protocol!=='https:'||endpoint.hostname!=='api.deepseek.com'||endpoint.pathname!=='/'||endpoint.search||endpoint.hash||endpoint.username||endpoint.password))throw fail('UNTRUSTED_DEEPSEEK_ENDPOINT','LLM');
 const http=mockClient?null:new Http({signal,concurrency:1,spacing:0,retries:0}),client=mockClient||new DeepSeek(http),records=[];
 return {isMock:Boolean(mockClient),records:()=>structuredClone(records),async receive(system,input){
  const r={model:mockClient?'MOCK':config.deepseekModel,executionKind:mockClient?'MOCK':'LIVE_API',requestedAt:now(),inputHash:sha(input),requestHash:sha({system,input,maxTokens:V2_MAX_OUTPUT_TOKENS}),physicalRequests:0};records.push(r);
  const before=client.calls?.length||0,physicalBefore=http?.metrics.requests||0;
  try{const value=await client.json(system,input,{maxTokens:V2_MAX_OUTPUT_TOKENS});r.receivedAt=now();const raw=client.calls?.[before]?.raw;
   if(!mockClient&&!raw)throw fail('CONTROLLED_RESPONSE_NOT_RECORDED','LLM');
   if(!mockClient&&raw.model!==config.deepseekModel)throw fail('LIVE_MODEL_MISMATCH','LLM');
   r.rawResponse=raw||{model:'MOCK',choices:[{finish_reason:'stop',message:{content:typeof value==='string'?value:JSON.stringify(value)}}]};
   if(r.rawResponse.choices?.[0]?.finish_reason!=='stop')throw fail('V2_OUTPUT_TRUNCATED','LLM');
   r.responseHash=sha(r.rawResponse);return {text:r.rawResponse.choices?.[0]?.message?.content,receivedAt:r.receivedAt};
  }catch(e){r.receivedAt=now();const raw=client.calls?.[before]?.raw;if(raw){r.rawResponse=raw;r.responseHash=sha(raw);}r.error=safeError(e);throw e;}
  finally{r.physicalRequests=http?http.metrics.requests-physicalBefore:1;}
 }};
}
export async function analyze(adapter,f,{signal,now=Date.now,mode='LIVE',factsAvailableAt,factsPackageSha256=sha(f)}={}){
 const recordStart=adapter.records?.().length||0;
 const frozen=structuredClone(f),attempts=[];let input=null,analysis=null,error=null;
 const times={factsAsOf:f.dataCutoff,factsAvailableAt:null,factsCollectedAt:null,researchRequestedAt:null,decisionCompletedAt:null,validationCompletedAt:null};
 try{
  input=buildInput(frozen,{mode,factsAvailableAt:factsAvailableAt??(adapter.isMock?now():undefined),factsPackageSha256,allowUnknownAcquisition:adapter.isMock});
  times.factsAvailableAt=input.factsAvailableAt;times.factsCollectedAt=input.factsCollectedAt;
  if(mode==='LIVE'&&(!Number.isSafeInteger(input.factsCollectedAt)||now()-input.factsCollectedAt>config.maxSnapshotAgeMinutes*60000))throw fail('SNAPSHOT_STALE','CLOCK');
  if(now()<input.factsAvailableAt)throw fail('FACTS_NOT_YET_AVAILABLE','CLOCK');
  signal?.throwIfAborted();times.researchRequestedAt=now();
  const response=await adapter.receive(SYSTEM,input);times.decisionCompletedAt=response.receivedAt;
  const candidate=parseAnalysis(response.text),g=guardAnalysis(candidate,input);attempts.push({attempt:1,errors:g.errors,rawResponseHash:sha(response.text||''),semanticReviewRequired:true,semanticReviewItems:g.reviewItems});
  if(!g.ok)throw fail(g.errors[0],'SCHEMA');analysis=candidate;times.validationCompletedAt=now();
 }catch(e){if(signal?.aborted)throw e;error={stage:e.stage||'LLM',code:e.code||(/^[A-Z][A-Z0-9_]+$/.test(e.message)?e.message:'LLM_REQUEST_FAILED'),message:safeError(e),affectedFactIds:[],retryable:false};if(!attempts.length&&times.researchRequestedAt!==null)attempts.push({attempt:1,errors:[error.code]});}
 const records=(adapter.records?.()||[]).slice(recordStart),last=records.at(-1),contextId=input?.contextId||sha({contract:CONTRACT,runId:f.runId,symbol:f.symbol,factsPackageSha256});
 const research={contract:CONTRACT,researchFormat:'MINIMAL_MARKET_RESEARCH_V1',recordId:recordId({runId:f.runId,symbol:f.symbol,contextId}),runId:f.runId,symbol:f.symbol,factsPackageSha256,knowledgeRegistrySha256:knowledgeHash,contextId,asOf:times,mode,reviewStatus:'PENDING_MANUAL_REVIEW',promptHash:PROMPT_HASH,model:last?.model??null,modelParameters:{temperature:0,thinking:{type:'disabled'},max_tokens:V2_MAX_OUTPUT_TOKENS},rawResponse:last?.rawResponse??null,rawResponseHash:last?.responseHash??null,executionState:analysis?'VALIDATED':'UNAVAILABLE',analysis,dataQuality:input?.dataQuality||{validForResearch:false,unavailableRequiredFactIds:['CORE_FACTS'],unavailableOptionalFactIds:[],sourceAcquisitionTimeUnknownFactIds:[],limitations:[],qualitySource:'RUNNER_VERIFIED_FACTS'},error:analysis?null:error};
 if(!validateResearch(research))throw fail('RUNNER_ENVELOPE_INVALID','SCHEMA');
 if(analysis&&!guardResearch(research,input).ok)throw fail('RUNNER_INPUT_BINDING_INVALID','CLOCK');
 return {research,input,attempts};
}
