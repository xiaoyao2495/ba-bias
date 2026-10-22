import fs from 'node:fs/promises';
import path from 'node:path';
import {readJson,atomicWrite,lock,emptyHistory} from './history.js';
import {CONTRACT,NAMESPACE,sha,fail} from '../analysis/market-bias-v2/common.js';
import {validateResearch} from '../analysis/market-bias-v2/parser.js';
import {inspectManifest,SIMPLE_MANIFEST,fileHash} from './retention-manifest.js';
import {assertRetentionIdle} from '../lifecycle/retention-state.js';
export const v2Dir=root=>path.join(root,NAMESPACE);
const projection=o=>Object.fromEntries(['storyKey','summary','lastResearchTime','lastOutputTime','runId','evidenceIds','status'].filter(k=>o[k]!==undefined).map(k=>[k,structuredClone(o[k])]));
export async function immutableWrite(file,value){await atomicWrite(file,value,{overwrite:false});const read=await readJson(file,null);if(sha(read)!==sha(value))throw fail('IMMUTABLE_RECORD_COLLISION','PERSISTENCE');return read;}
export async function legacyInventory(root){
 const out={};async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true}).catch(e=>{if(e.code==='ENOENT')return [];throw e;})){const file=path.join(dir,e.name),relative=path.relative(root,file);if(relative===NAMESPACE||relative.startsWith(NAMESPACE+path.sep)||/^state[\\/]run\.(?:lock|lease)(?:[\\/]|$)|^state[\\/]dingtalk-rate\.json$/.test(relative))continue;if(e.isSymbolicLink())throw fail('LEGACY_SYMLINK_REJECTED','PERSISTENCE');if(e.isDirectory())await walk(file);else if(e.isFile())out[relative]=sha(await fs.readFile(file));}}
 await walk(root);return out;
}
export async function planCutover(root,{now=Date.now}={}){
 const inventory=await legacyInventory(root),old=await readJson(path.join(root,'state','history.json'),null);
 if(!old&&Object.keys(inventory).some(p=>p.startsWith('runs'+path.sep)||p.startsWith('outbox'+path.sep)))throw fail('LEGACY_LEDGER_MISSING','PERSISTENCE');
 const history={...emptyHistory(),contract:CONTRACT,research:{},selectorBaseline:{},legacyRunIds:{}};
 for(const k of ['snapshot','rotation','longShortDiscoveryRotation','longShortCoverage'])if(old?.[k]!==undefined)history[k]=structuredClone(old[k]);
 for(const [id,r]of Object.entries(old?.runs||{})){if(!/^[A-Za-z0-9_-]{1,100}$/.test(id))throw fail('INVALID_LEGACY_RUN_ID');history.legacyRunIds[id]=Object.fromEntries(['status','scheduledAt','startedAt','finishedAt'].filter(k=>r[k]!==undefined).map(k=>[k,r[k]]));}
 const boxes=[];for(const file of await fs.readdir(path.join(root,'outbox')).catch(e=>{if(e.code==='ENOENT')return [];throw e;})){if(!file.endsWith('.json'))continue;const r=await readJson(path.join(root,'outbox',file),null);if(r)boxes.push(r);}
 const blockedDeliveryIds=[];for(const r of boxes.sort((a,b)=>a.generatedAt-b.generatedAt)){
  if(r.delivery?.deliveryId)blockedDeliveryIds.push(r.delivery.deliveryId);
  if(!(['SENT','UNKNOWN'].includes(r.delivery?.status)||(r.intelligence?.version===1&&r.delivery?.status!=='SHADOW')))continue;
  if(!r.summary||!Number.isSafeInteger(r.evaluationTime)||!r.symbol)throw fail('LEGACY_SELECTOR_STATE_INVALID');
  history.selectorBaseline[r.symbol]=projection({storyKey:r.storyKey,summary:r.summary,lastResearchTime:r.evaluationTime,lastOutputTime:r.generatedAt,status:'OUTBOX',runId:r.runId,evidenceIds:r.evidenceIds});
 }
 // Old run files independently guard reuse even if absent from old history.
 for(const rel of Object.keys(inventory)){const m=rel.replaceAll('\\','/').match(/^runs\/([A-Za-z0-9_-]{1,100})\/result\.json$/);if(m&&!history.legacyRunIds[m[1]]){const r=await readJson(path.join(root,rel),null);history.legacyRunIds[m[1]]={status:r?.status||'UNKNOWN'};}}
 const manifest={contract:CONTRACT,preparedAt:now(),legacyHandling:'IMMUTABLE_LEGACY_ARCHIVE',legacyHashes:inventory,blockedDeliveryIds:[...new Set(blockedDeliveryIds)],seedSha256:sha(history),legacyRunIds:Object.keys(history.legacyRunIds)};
 return {history,manifest};
}
export async function initializeV2(root,{now=Date.now}={}){
 const release=await lock(root);try{
  const dir=v2Dir(root),existing=await readJson(path.join(dir,'state','cutover-manifest.json'),null);if(existing)throw fail('V2_ALREADY_PREPARED','PERSISTENCE');
  const {history,manifest}=await planCutover(root,{now});await immutableWrite(path.join(dir,'state','history.json'),history);await immutableWrite(path.join(dir,'state','cutover-manifest.json'),manifest);return manifest;
 }finally{await release();}
}
export async function assertPrepared(root){
 const lifecycle=await assertRetentionIdle(root);
 const dir=v2Dir(root),[manifest,history]=await Promise.all([readJson(path.join(dir,'state','cutover-manifest.json'),null),readJson(path.join(dir,'state','history.json'),null)]);
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x),id=/^[A-Za-z0-9_-]{1,100}$/;
 if(manifest?.contract!==CONTRACT||history?.contract!==CONTRACT||!object(manifest.legacyHashes)||!object(history.selectorBaseline)||!object(history.legacyRunIds)||!object(history.research)||!object(history.runs)||!Number.isSafeInteger(manifest.preparedAt)||!Array.isArray(manifest.blockedDeliveryIds)||!Array.isArray(manifest.legacyRunIds)||!/^([a-f0-9]{64})$/.test(manifest.seedSha256))throw fail('V2_CUTOVER_NOT_PREPARED','PERSISTENCE');
 if(Object.entries(manifest.legacyHashes).some(([p,h])=>path.isAbsolute(p)||p.split(/[\\/]/).includes('..')||!(/^[a-f0-9]{64}$/).test(h))||manifest.legacyRunIds.some(r=>!id.test(r))||manifest.blockedDeliveryIds.some(d=>typeof d!=='string'||d.length>200)||Object.keys(history.runs).some(r=>!id.test(r)))throw fail('V2_STATE_CORRUPT','PERSISTENCE');
 for(const [key,r]of Object.entries(history.research))if(r.contract!==CONTRACT||!/^bias_[a-f0-9]{32}$/.test(key)||r.recordId!==key||!id.test(r.runId)||!(/^[\p{L}\p{N}]{1,40}USDT$/u).test(r.symbol)||!Number.isSafeInteger(r.factsAsOf)||!['VALIDATED','UNAVAILABLE'].includes(r.executionState)||!(/^[a-f0-9]{64}$/).test(r.researchSha256))throw fail('V2_RESEARCH_INDEX_CORRUPT','PERSISTENCE');
 if(manifest.legacyHandling===SIMPLE_MANIFEST&&(!lifecycle.manifestSha256||await fileHash(path.join(dir,'state/cutover-manifest.json'))!==lifecycle.manifestSha256))throw fail('RETENTION_MANIFEST_BINDING_INVALID','PERSISTENCE');
 return {manifest,history};
}
export async function checkLegacyIntegrity(root){const {manifest}=await assertPrepared(root),state=await assertRetentionIdle(root);const report=await inspectManifest(root,manifest,state);return {...report,differences:report.errors.map(e=>e.path)};}
export async function loadV2Outbox(root){
 const dir=path.join(v2Dir(root),'outbox'),files=await fs.readdir(dir).catch(e=>{if(e.code==='ENOENT')return [];throw e;});const records=[];
 for(const file of files){if(!/^[A-Za-z0-9_-]+_[\p{L}\p{N}]{1,40}USDT\.json$/u.test(file))continue;const r=await readJson(path.join(dir,file),null);if(r?.contract!==CONTRACT||r.intelligence?.contract!==CONTRACT||!validateResearch(r.intelligence.biasResearch)||r.intelligence.biasResearch.executionState!=='VALIDATED'||r.intelligenceSha256!==sha(r.intelligence))throw fail('FOREIGN_QUEUE_RECORD','PERSISTENCE');
  const research=await readJson(path.join(v2Dir(root),'research',r.runId,r.symbol+'.json'),null),receipt=await readJson(path.join(v2Dir(root),'receipts',r.researchId+'.json'),null);
  if(!research||research.runId!==r.runId||research.symbol!==r.symbol||research.recordId!==r.researchId||sha(research)!==sha(r.intelligence.biasResearch)||receipt?.researchSha256!==sha(research)||r.delivery.parts.some(p=>p.contentSha256!==sha(p.content)))throw fail('QUEUE_RESEARCH_BINDING_MISMATCH','PERSISTENCE');
  let changed=false;for(const p of r.delivery?.parts||[])if(p.status==='SENDING'){p.status='UNKNOWN';p.error='RECOVERED_UNCONFIRMED_DELIVERY';changed=true;}if(changed){r.delivery.status='UNKNOWN';r.delivery.sent=false;await atomicWrite(path.join(dir,file),r);}records.push(r);
 }return records;
}
export const saveV2Outbox=(root,r)=>atomicWrite(path.join(v2Dir(root),'outbox',`${r.runId}_${r.symbol}.json`),r);
export function selectorStories(history,records,{includeShadow=false}={}){const stories=structuredClone(history.selectorBaseline);for(const r of [...records].sort((a,b)=>a.generatedAt-b.generatedAt))if((includeShadow||r.delivery.status!=='SHADOW')&&(!stories[r.symbol]||r.evaluationTime>stories[r.symbol].lastResearchTime))stories[r.symbol]=projection({storyKey:r.storyKey,summary:r.summary,lastResearchTime:r.evaluationTime,lastOutputTime:r.generatedAt,status:'OUTBOX',runId:r.runId,evidenceIds:r.evidenceIds});return stories;}
export function reconcileV2(history,records){
 history.generated=records.length;history.sent=records.filter(r=>r.delivery?.status==='SENT').length;history.stories=structuredClone(history.selectorBaseline);history.daily={};
 for(const r of records){const day=new Date(r.generatedAt+28800000).toISOString().slice(0,10);history.daily[day]||={generated:0,sent:0};history.daily[day].generated++;if(r.delivery.status==='SENT')history.daily[day].sent++;}
 history.stories=selectorStories(history,records);return history;
}
