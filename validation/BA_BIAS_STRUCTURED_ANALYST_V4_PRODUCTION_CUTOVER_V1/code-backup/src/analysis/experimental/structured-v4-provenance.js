import crypto from 'node:crypto';
import {DeepSeek} from '../../clients/deepseek.js';
import {Http} from '../../clients/http.js';
import {config,safeError} from '../../config.js';
import {validateEnvelope,validateOutput} from './structured-v4-schema.js';
const receipts=new WeakMap();
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
function issueEnvelope(raw,input,record,kind){
 const provenance={sourceType:kind==='LIVE_API'?'LIVE_MODEL_RESPONSE':'SYNTHETIC_OR_CONVERTED',executionKind:kind,provider:kind==='LIVE_API'?'deepseek':'mock',model:typeof raw?.model==='string'?raw.model:null,requestedModel:record.model,requestId:record.requestId,requestIdKind:'LOCAL_TRACKING_ID',serverResponseId:typeof raw?.id==='string'?raw.id:null,requestedAt:record.requestedAt,receivedAt:new Date().toISOString(),requestHash:record.requestHash,responseHash:hash(raw),inputHash:hash(input)};
 let analysis=null,audit={legacySyntheticFieldRemoved:false,businessSourceConflict:false,parseError:null};
 try{
  const text=raw?.choices?.[0]?.message?.content;if(typeof text!=='string')throw Error('EMPTY_LLM_RESPONSE');analysis=JSON.parse(text);
  if(analysis&&typeof analysis==='object'&&!Array.isArray(analysis)){
   // Only the explicitly synthetic legacy field is removable in MOCK. No
   // business content is changed, and LIVE never silently accepts this field.
   if(kind==='MOCK'&&analysis.provenance==='SYNTHETIC_OR_CONVERTED'){delete analysis.provenance;audit.legacySyntheticFieldRemoved=true;}
   audit.businessSourceConflict=['provenance','source','sourceType'].some(k=>Object.hasOwn(analysis,k));
  }
 }catch(e){audit.parseError=e.message==='EMPTY_LLM_RESPONSE'?'EMPTY_LLM_RESPONSE':'INVALID_LLM_JSON';}
 const envelope=freeze({version:'V4_PROVENANCE_ENVELOPE_V1',provenance,analysis,audit});
 receipts.set(envelope,{fingerprint:hash(envelope),inputHash:hash(input),record:structuredClone(record),raw:structuredClone(raw)});return envelope;
}
export function resolveProvenance(output,input){
 if(output?.version!=='V4_PROVENANCE_ENVELOPE_V1'){
  if(!Object.hasOwn(output||{},'provenance'))return {provenanceValid:false,errors:['PROVENANCE_MISSING']};
  if(output.provenance==='LIVE_MODEL_RESPONSE')return {provenanceValid:false,errors:['UNTRUSTED_LIVE_PROVENANCE']};
  if(output.provenance!=='SYNTHETIC_OR_CONVERTED'){validateOutput(output);return {provenanceValid:false,errors:['V4_SCHEMA_INVALID'],diagnostics:structuredClone(validateOutput.errors||[])};}
  const {provenance,...analysis}=structuredClone(output);
  return {provenanceValid:true,analysis,provenance:{sourceType:provenance,executionKind:'OFFLINE_LEGACY',provider:null,model:null,requestId:null,serverResponseId:null},analysisSourceError:null};
 }
 if(!validateEnvelope(output))return {provenanceValid:false,errors:['PROVENANCE_SCHEMA_INVALID'],diagnostics:structuredClone(validateEnvelope.errors)};
 const p=output.provenance,r=receipts.get(output);
 // Even a serialized synthetic envelope requires its in-process call receipt;
 // use the explicit legacy synthetic compatibility path for offline records.
 if(!r||r.fingerprint!==hash(output)||r.inputHash!==hash(input))return {provenanceValid:false,errors:['PROVENANCE_UNVERIFIED_REQUEST_RESPONSE']};
 if(!p.requestId||p.requestIdKind!=='LOCAL_TRACKING_ID'||p.requestId!==r.record.requestId)return {provenanceValid:false,errors:['PROVENANCE_REQUEST_ID_MISMATCH']};
 if(!p.model||p.model!==p.requestedModel||p.model!==r.record.model)return {provenanceValid:false,errors:['PROVENANCE_MODEL_MISMATCH']};
 if(p.sourceType==='LIVE_MODEL_RESPONSE'&&(p.executionKind!=='LIVE_API'||p.provider!=='deepseek'))return {provenanceValid:false,errors:['PROVENANCE_SOURCE_CONTEXT_MISMATCH']};
 return {provenanceValid:true,analysis:output.analysis,provenance:p,analysisSourceError:output.audit.businessSourceConflict?'BUSINESS_PROVENANCE_CONFLICT':output.audit.parseError};
}
function adapter(kind,dispatch,model,maxRequests){
 if(!Number.isInteger(maxRequests)||maxRequests<1||maxRequests>30)throw Error('INVALID_EXPERIMENT_REQUEST_BUDGET');
 let count=0,inFlight=false;const records=[];
 return Object.freeze({
  async receive({system,input,maxTokens=6000}){
   if(inFlight)throw Error('ADAPTER_REQUEST_IN_FLIGHT');
   if(count>=maxRequests)throw Error('EXPERIMENT_REQUEST_BUDGET_EXHAUSTED');
   inFlight=true;
   const record={requestId:crypto.randomUUID(),requestIdKind:'LOCAL_TRACKING_ID',model,requestedAt:new Date().toISOString(),requestHash:hash({system,input,maxTokens,model}),inputHash:hash(input),executionKind:kind,physicalRequests:0};count++;records.push(record);
   try{const raw=await dispatch({system,input,maxTokens},record);const envelope=issueEnvelope(raw,input,record,kind);record.responseHash=envelope.provenance.responseHash;record.receivedAt=envelope.provenance.receivedAt;record.serverResponseId=envelope.provenance.serverResponseId;record.rawResponse=structuredClone(raw);return envelope;}
   catch(e){record.error=safeError(e);throw Error(record.error);}
   finally{inFlight=false;}
  },
  records:()=>structuredClone(records),
  counts:()=>({transportAttempts:count,livePhysicalRequests:kind==='LIVE_API'?records.reduce((n,r)=>n+r.physicalRequests,0):0,mockCalls:kind==='MOCK'?count:0})
 });
}
export function createMockV4Adapter({respond,model='mock-model',maxRequests=30}){
 if(typeof respond!=='function')throw Error('MOCK_RESPONDER_REQUIRED');
 return adapter('MOCK',respond,model,maxRequests);
}
export function createLiveV4Adapter(options={}){
 if(Object.keys(options).some(k=>k!=='maxRequests'))throw Error('LIVE_TRANSPORT_INJECTION_FORBIDDEN');
 // No arbitrary client/JSON can be inserted into the LIVE branch. The closure
 // owns the existing DeepSeek+Http client; no client reference is exposed.
 const assertEndpoint=()=>{const url=new URL(config.deepseekBase);if(url.protocol!=='https:'||url.hostname!=='api.deepseek.com'||url.username||url.password)throw Error('UNTRUSTED_DEEPSEEK_ENDPOINT');};
 assertEndpoint();
 const http=new Http({concurrency:1,spacing:0,retries:0}),client=new DeepSeek(http);
 return adapter('LIVE_API',async ({system,input,maxTokens},record)=>{
  assertEndpoint();
  const before=client.calls.length,physicalBefore=http.metrics.requests;
  try{await client.json(system,input,{maxTokens});}
  catch(e){if(!['INVALID_LLM_JSON','EMPTY_LLM_RESPONSE'].includes(e.message))throw e;}
  finally{record.physicalRequests=http.metrics.requests-physicalBefore;}
  const call=client.calls[before];if(!call?.raw)throw Error('CONTROLLED_RESPONSE_NOT_RECORDED');return call.raw;
 },config.deepseekModel,options.maxRequests??30);
}
export function provenanceLabel(p){return p.sourceType==='LIVE_MODEL_RESPONSE'?'LIVE_MODEL_RESPONSE':'SYNTHETIC_OR_CONVERTED';}
