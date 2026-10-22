// Manual-only retention. No scheduler, network or implicit APPLY.
import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {CONTRACT,sha} from '../analysis/market-bias-v2/common.js';
import {validateResearch} from '../analysis/market-bias-v2/parser.js';
import {guardResearch} from '../analysis/market-bias-v2/guard.js';
import {atomicWrite,lock} from './history.js';
import {SIMPLE_MANIFEST,canonicalLegacyPaths,inspectManifest,retentionPlanHash} from './retention-manifest.js';
import {assertPrepared} from './market-bias-v2-state.js';
import {RETENTION_CONTRACT,RETENTION_MS,RETENTION_DIR,retentionState} from '../lifecycle/retention-state.js';
const historyRel='market-bias-v2/state/history.json',manifestRel='market-bias-v2/state/cutover-manifest.json';
const idPattern=/^hourly_(\d{4})(\d{2})(\d{2})_(\d{2})00$/;
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const stamp=x=>Number.isSafeInteger(x)&&x>0;
const planHash=retentionPlanHash;
const json=async p=>{const s=await fs.lstat(p);if(!s.isFile()||s.isSymbolicLink()||s.size>16*1024*1024)throw Error('RETENTION_METADATA_UNSAFE');return JSON.parse(await fs.readFile(p,'utf8'));};
async function digest(file){const h=crypto.createHash('sha256');for await(const part of createReadStream(file))h.update(part);return h.digest('hex');}
async function exists(p){try{await fs.lstat(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}}
async function contained(root,rel){
 if(typeof rel!=='string'||!rel||path.isAbsolute(rel)||rel.includes('\\')||rel.split('/').some(x=>!x||x==='.'||x==='..'))throw Error('RETENTION_PATH_REJECTED');
 let current=root;for(const part of rel.split('/')){current=path.join(current,part);const s=await fs.lstat(current);if(s.isSymbolicLink())throw Error('RETENTION_LINK_REJECTED');}
 const real=await fs.realpath(current);if(!real.startsWith(root+path.sep))throw Error('RETENTION_PATH_REJECTED');return current;
}
async function inventory(root){
 const out=[];async function walk(dir,rel=''){for(const e of await fs.readdir(dir,{withFileTypes:true})){const r=rel?rel+'/'+e.name:e.name;
 const p=await contained(root,r),s=await fs.lstat(p);if(r===RETENTION_DIR||/^state\/run\.(lock|lease)(\/|$)/.test(r))continue;if(s.isDirectory())await walk(p,r);else if(s.isFile()){out.push({path:r,bytes:s.size});}else throw Error('RETENTION_FILE_TYPE_UNKNOWN');}}
 await walk(root);return out.sort((a,b)=>a.path.localeCompare(b.path,'en'));
}
export function retentionAge(result,now){
 const m=idPattern.exec(result?.runId||'');if(!stamp(now)||!m)return {status:'EXPIRED_BUT_PROTECTED',reason:'UNRECOGNIZED_RUN_ID'};
 const scheduled=Date.UTC(+m[1],+m[2]-1,+m[3],+m[4])-8*3600000;
 const iso=new Date(scheduled+8*3600000).toISOString().replace(/[-:TZ]/g,'');
 if(iso.slice(0,12)!==m.slice(1).join('')+'00'||!['COMPLETE','PARTIAL','FAILED','INTERRUPTED'].includes(result.status)||!stamp(result.startedAt)||!stamp(result.finishedAt)||!stamp(result.dataCutoff))return {status:'EXPIRED_BUT_PROTECTED',reason:'TIME_OR_TERMINAL_STATE_UNPROVEN'};
 if(result.scheduledAt!==scheduled||scheduled>result.startedAt||result.startedAt>result.finishedAt||result.dataCutoff>result.finishedAt||result.dataCutoff<result.startedAt||result.finishedAt>now)return {status:'EXPIRED_BUT_PROTECTED',reason:'CONFLICTING_OR_FUTURE_TIME'};
 const anchor=Math.max(result.finishedAt,result.dataCutoff),ageMs=now-anchor;
 return {status:ageMs>=RETENTION_MS?'EXPIRED_CANDIDATE':'RETAIN',reason:null,anchor,ageMs,scheduledAt:scheduled};
}
async function buildPlan(root,now,ownsLock=false){
 if(!stamp(now))throw Error('INVALID_RETENTION_CLOCK');root=await fs.realpath(root);const state=await retentionState(root);if(state.pending)throw Error('RETENTION_RECOVERY_REQUIRED');
 const {history,manifest}=await assertPrepared(root),files=await inventory(root),byPath=new Map(files.map(f=>[f.path,f]));
 const busy=!ownsLock&&(await exists(path.join(root,'state/run.lock'))||await exists(path.join(root,'state/run.lease')));
 const manifestPaths=new Set(canonicalLegacyPaths(manifest).keys());
 const integrity=await inspectManifest(root,manifest,state);
 if(!integrity.ok)throw Error('RETENTION_MANIFEST_INTEGRITY_FAILED');
 const units=[],issues=[];const dirs=await fs.readdir(path.join(root,'runs')).catch(e=>{if(e.code==='ENOENT')return [];throw e;});
 const outboxes=files.filter(f=>/^((market-bias-v2\/)?outbox|directional|directional-commits)\//.test(f.path)&&f.path.endsWith('.json'));
 const dependencies=[];for(const f of outboxes){try{dependencies.push({path:f.path,record:await json(path.join(root,f.path))});}catch{issues.push('UNREADABLE_OPERATIONAL_DEPENDENCY:'+f.path);}}
 for(const e of Object.values(history.research))if(!dirs.includes(e.runId))issues.push('RESEARCH_RUN_MISSING:'+e.runId);
 for(const id of dirs){if(state.retiredRuns[id])continue;const prefix='runs/'+id+'/',runFiles=files.filter(f=>f.path.startsWith(prefix));let r;
 try{r=await json(await contained(root,prefix+'result.json'));}catch{units.push({runId:id,status:'EXPIRED_BUT_PROTECTED',reasons:['RESULT_UNAVAILABLE'],files:runFiles,bytes:runFiles.reduce((n,f)=>n+f.bytes,0)});continue;}
 const age=retentionAge(r,now),reasons=[];if(age.reason)reasons.push(age.reason);if(r.runId!==id||r.contract!==CONTRACT)reasons.push('UNKNOWN_OR_LEGACY_VERSION');
 if(dependencies.some(d=>/^(directional|directional-commits)\//.test(d.path)))reasons.push('LEGACY_TRACKING_CONSUMER');
 if(Object.values(history.runs).some(e=>e.status==='RUNNING'))reasons.push('RECOVERY_RUN_PRESENT');
 for(const field of ['selectorBaseline','stories'])if(Object.values(history[field]||{}).some(e=>e.runId===id&&(!stamp(e.lastResearchTime)||e.lastResearchTime!==r.dataCutoff)))reasons.push('BASELINE_TIME_CONFLICT');
 if(busy)reasons.push('ACTIVE_SHARED_LOCK');if(issues.length)reasons.push('GLOBAL_INTEGRITY_BLOCKER');
 if((r.candidateEvaluations||[]).some(e=>['NOT_EVALUATED','FACTS_READY'].includes(e.status))||(r.unassessedCandidates||[]).length)reasons.push('UNFINISHED_EVALUATION');
 const indexed=history.runs[id];if(!indexed||indexed.status!==r.status||indexed.finishedAt!==r.finishedAt)reasons.push('HISTORY_RUN_MISMATCH');
 const refs=Object.values(history.research).filter(e=>e.runId===id);const researchFiles=files.filter(f=>f.path.startsWith('market-bias-v2/research/'+id+'/'));
 if(researchFiles.length!==refs.length)reasons.push('UNINDEXED_OR_MISSING_RESEARCH');
 if((r.candidateEvaluations||[]).some(e=>e.status==='RESEARCH_READY'&&!refs.some(x=>x.symbol===e.symbol)))reasons.push('UNSEALED_RESEARCH');
 let unitFiles=files.filter(f=>f.path.startsWith(prefix)||f.path.startsWith('market-bias-v2/research/'+id+'/')||f.path.startsWith('market-bias-v2/audit/'+id+'/')||f.path==='market-bias-v2/skips/'+id+'.json');
 for(const e of refs){const receipt='market-bias-v2/receipts/'+e.recordId+'.json';if(byPath.has(receipt))unitFiles.push(byPath.get(receipt));
 try{
  const rp='market-bias-v2/research/'+id+'/'+e.symbol+'.json',ap='market-bias-v2/audit/'+id+'/'+e.symbol+'.json',fp=prefix+'facts/'+e.symbol+'.json';
  const [research,input,rec]=await Promise.all([json(await contained(root,rp)),json(await contained(root,ap)),json(await contained(root,receipt))]);
  if(!validateResearch(research)||research.researchFormat!=='MINIMAL_MARKET_RESEARCH_V1'||research.executionState!=='VALIDATED'||research.runId!==id||research.symbol!==e.symbol||research.recordId!==e.recordId||research.asOf.factsAsOf!==r.dataCutoff||sha(research)!==e.researchSha256||input.inputHash!==sha(input.input)||!guardResearch(research,input.input).ok||rec.recordId!==e.recordId||rec.researchSha256!==sha(research)||!stamp(rec.persistedAt)||rec.persistedAt>now||rec.persistedAt<research.asOf.validationCompletedAt||await digest(await contained(root,fp))!==research.factsPackageSha256)throw Error('RESEARCH_BINDING');
  // previousFacts is an embedded copy, not a path dependency on the previous Run.
  age.anchor=Math.max(age.anchor||0,rec.persistedAt,research.asOf.validationCompletedAt);age.ageMs=now-age.anchor;if(age.ageMs<RETENTION_MS&&age.status==='EXPIRED_CANDIDATE')age.status='RETAIN';
 }catch{reasons.push('RESEARCH_INPUT_RECEIPT_OR_FACTS_UNVERIFIED');}}
 for(const ref of dependencies)if(ref.record.runId===id)reasons.push('OPERATIONAL_REFERENCE:'+ref.path+':'+(ref.record.delivery?.status||'TRACKING'));

 if(runFiles.some(f=>!/^runs\/[^/]+\/(?:(?:facts|accounts-discovery|selection|evaluations)\/[^/]+\.json|(?:result|scan|scan-coverage|run-diagnostics|accounts-coverage|deepseek-calls)\.json)$/.test(f.path)))reasons.push('UNKNOWN_RUN_ARTIFACT');
 unitFiles=[...new Map(unitFiles.map(f=>[f.path,f])).values()];const status=age.status==='RETAIN'?'RETAIN':reasons.length?'EXPIRED_BUT_PROTECTED':age.status;
 if(status==='EXPIRED_CANDIDATE')for(const f of unitFiles)f.sha256=await digest(await contained(root,f.path));
 units.push({runId:id,...age,status,manifestLifecycle:status==='RETAIN'?'ACTIVE':status==='EXPIRED_CANDIDATE'?'EXPIRED_CANDIDATE':'PRUNE_BLOCKED',reasons:[...new Set(reasons)],files:unitFiles,bytes:unitFiles.reduce((n,f)=>n+f.bytes,0),researchIds:refs.map(e=>e.recordId),historyReference:Boolean(indexed),manifestProtected:unitFiles.some(f=>manifestPaths.has(f.path))});
 }
 const plan={contract:RETENTION_CONTRACT,retentionMs:RETENTION_MS,root,evaluatedAt:now,historySha256:await digest(path.join(root,historyRel)),manifestSha256:await digest(path.join(root,manifestRel)),legacyIntegrity:{status:'VERIFIED',files:manifestPaths.size},units,issues,
 metrics:{logicalBytesScope:'BUSINESS_FILES_EXCLUDING_LIFECYCLE_METADATA_AND_LOCKS',lastCleanup:state.lastResult??null,cleanupFailures:state.cleanupFailures??0,expiredRuns:units.filter(u=>u.ageMs>=RETENTION_MS).length,logicalBytes:files.reduce((n,f)=>n+f.bytes,0),candidateBytes:units.filter(u=>u.status==='EXPIRED_CANDIDATE').reduce((n,u)=>n+u.bytes,0),protectedOverdueBytes:units.filter(u=>u.status==='EXPIRED_BUT_PROTECTED'&&u.ageMs>=RETENTION_MS).reduce((n,u)=>n+u.bytes,0),ntfsAllocatedBytes:null,allocationStatus:'NOT_VERIFIED',recent24hRuns:units.filter(u=>u.scheduledAt&&now-u.scheduledAt>=0&&now-u.scheduledAt<=86400000).length}};
 try{const disk=await fs.statfs(root);plan.metrics.availableBytes=Number(disk.bavail)*Number(disk.bsize);}catch(e){if(!['ENOSYS','ENOTSUP'].includes(e.code))throw e;plan.metrics.availableBytes=null;}return {...plan,planId:'retention_'+planHash(plan)};
}
export const planRetention=(root,{now=Date.now()}={})=>buildPlan(root,now);
async function authorizedRoot(root,{enabled=false,confirm,confirmRoot}={}){
 if(!enabled)throw Error('RETENTION_APPLY_DISABLED');if(confirm!=='DELETE_EXPIRED_RUNS'||!path.isAbsolute(root))throw Error('RETENTION_EXPLICIT_CONFIRMATION_REQUIRED');
 const real=await fs.realpath(root);if(confirmRoot!==real||real===path.parse(real).root||real===project||(await fs.lstat(root)).isSymbolicLink())throw Error('RETENTION_ROOT_CONFIRMATION_MISMATCH');
 for(const rel of [RETENTION_DIR,RETENTION_DIR+'/active.json',RETENTION_DIR+'/state.json'])if(await exists(path.join(real,rel)))await contained(real,rel);return real;
}
function nextHistory(history,units,at){const h=structuredClone(history),ids=new Set(units.map(u=>u.runId));
 for(const id of ids){delete h.runs[id];h.legacyRunIds[id]={status:'RETIRED',retiredAt:at,reason:'RETENTION_120H'};}
 for(const [key,e]of Object.entries(h.research))if(ids.has(e.runId))delete h.research[key];return h;
}
function nextManifest(manifest,units,at,originalHash){const m=structuredClone(manifest),paths=new Set(units.flatMap(u=>u.files.map(f=>f.path)));
 for(const rel of Object.keys(m.legacyHashes))if(paths.has(rel.replaceAll('\\','/')))delete m.legacyHashes[rel];
 m.legacyHandling=SIMPLE_MANIFEST;m.retention={contract:RETENTION_CONTRACT,retentionMs:RETENTION_MS,activatedAt:m.retention?.activatedAt??at,originalManifestSha256:m.retention?.originalManifestSha256??originalHash,lastPrunedAt:at};return m;
}
async function writeTransaction(file,tx){if(Buffer.byteLength(JSON.stringify(tx,null,2))>15*1024*1024)throw Error('RETENTION_TRANSACTION_TOO_LARGE');await atomicWrite(file,tx);}
export async function applyRetention(root,plan=null,options={}){
 root=await authorizedRoot(root,options);let compromised=false;const release=await lock(root,{onCompromised:()=>{compromised=true;}}),assertLock=()=>{if(compromised)throw Error('RETENTION_LOCK_COMPROMISED');};const sf=path.join(root,RETENTION_DIR,'state.json'),tf=path.join(root,RETENTION_DIR,'active.json');
 try{
  let state=await retentionState(root),tx=await json(tf).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
  if(tx&&!state.pending&&tx.planId===state.lastCompleted){await fs.unlink(tf);tx=null;}
  if(plan&&state.lastCompleted===plan.planId&&!state.pending)return state.lastResult;
  const now=options.now??Date.now();if(!stamp(now))throw Error('RETENTION_CLOCK_INVALID');
  if(tx){
   if(tx.contract!==RETENTION_CONTRACT||!tx.plan||tx.plan.root!==root||tx.planId!==tx.plan.planId||tx.planId!=='retention_'+planHash((({planId,...body})=>body)(tx.plan))||!['PREPARED','INDEX_COMMITTED'].includes(tx.phase)||!Number.isSafeInteger(tx.cursor)||tx.cursor<0)throw Error('RETENTION_TRANSACTION_CORRUPT');
   if(!Array.isArray(tx.units)||!tx.units.length||tx.units.length>10||new Set(tx.units.map(u=>u.runId)).size!==tx.units.length||tx.units.some(u=>u.status!=='EXPIRED_CANDIDATE'||sha(u)!==sha(tx.plan.units.find(x=>x.runId===u.runId))))throw Error('RETENTION_TRANSACTION_CORRUPT');
   if(plan&&plan.planId!==tx.planId)throw Error('RETENTION_OTHER_TRANSACTION_PENDING');plan=tx.plan;if(now<tx.preparedAt)throw Error('RETENTION_CLOCK_INVALID');
  }else{
   if(state.pending)throw Error('RETENTION_TRANSACTION_MISSING');
   plan??=await buildPlan(root,now,true);const {planId,...body}=plan;
   if(plan.contract!==RETENTION_CONTRACT||plan.root!==root||planId!=='retention_'+planHash(body))throw Error('RETENTION_PLAN_IDENTITY_MISMATCH');
   if(now<plan.evaluatedAt||now-plan.evaluatedAt>3600000)throw Error('RETENTION_PLAN_STALE');
   if((await buildPlan(root,plan.evaluatedAt,true)).planId!==planId)throw Error('RETENTION_PLAN_CHANGED');
   const maxRuns=options.maxRuns??3,maxBytes=options.maxBytes??1024**3;
   if(!Number.isSafeInteger(maxRuns)||maxRuns<1||maxRuns>10||!Number.isSafeInteger(maxBytes)||maxBytes<1||maxBytes>1024**3)throw Error('RETENTION_ENGINEERING_BUDGET');
   const units=plan.units.filter(u=>u.status==='EXPIRED_CANDIDATE').sort((a,b)=>a.anchor-b.anchor||a.runId.localeCompare(b.runId)).slice(0,maxRuns);
   if(!units.length)return {status:'NO_CANDIDATES',deletedFiles:0};if(units.reduce((n,u)=>n+u.bytes,0)>maxBytes)throw Error('RETENTION_ENGINEERING_BUDGET');
   const h=await json(path.join(root,historyRel)),m=await json(path.join(root,manifestRel));
   tx={contract:RETENTION_CONTRACT,planId,plan,units,phase:'PREPARED',preparedAt:now,beforeHistorySha256:sha(h),afterHistorySha256:sha(nextHistory(h,units,now)),beforeManifestSha256:sha(m),afterManifestSha256:sha(nextManifest(m,units,now,plan.manifestSha256)),cursor:0,unlinkPrepared:false,deletedFiles:0};
   await writeTransaction(tf,tx);options.fault?.('AFTER_TRANSACTION');
  }
  assertLock();state={...state,pending:tx.planId};await atomicWrite(sf,state);options.fault?.('AFTER_PREPARED');
  let h=await json(path.join(root,historyRel)),m=await json(path.join(root,manifestRel));
  if(sha(h)===tx.beforeHistorySha256){h=nextHistory(h,tx.units,tx.preparedAt);if(sha(h)!==tx.afterHistorySha256)throw Error('RETENTION_HISTORY_TARGET_MISMATCH');await atomicWrite(path.join(root,historyRel),h);}if(sha(h)!==tx.afterHistorySha256)throw Error('RETENTION_HISTORY_CHANGED');
  options.fault?.('AFTER_HISTORY');
  if(sha(m)===tx.beforeManifestSha256){m=nextManifest(m,tx.units,tx.preparedAt,plan.manifestSha256);if(sha(m)!==tx.afterManifestSha256)throw Error('RETENTION_MANIFEST_TARGET_MISMATCH');await atomicWrite(path.join(root,manifestRel),m);}if(sha(m)!==tx.afterManifestSha256)throw Error('RETENTION_MANIFEST_CHANGED');
  options.fault?.('AFTER_MANIFEST');tx.phase='INDEX_COMMITTED';await writeTransaction(tf,tx);
  const files=tx.units.flatMap(u=>u.files);if(tx.cursor>files.length)throw Error('RETENTION_TRANSACTION_CORRUPT');
  for(let i=0;i<files.length;i++){
   assertLock();const f=files[i],present=await exists(path.join(root,f.path));
   if(!present){if(i>tx.cursor||i===tx.cursor&&!tx.unlinkPrepared)throw Error('RETENTION_UNAUTHORIZED_MISSING');continue;}
   if(i<tx.cursor)throw Error('RETENTION_RETIRED_FILE_REAPPEARED');
   const p=await contained(root,f.path);if((await fs.lstat(p)).size!==f.bytes||await digest(p)!==f.sha256)throw Error('RETENTION_GC_FILE_CHANGED');
   tx.cursor=i;tx.unlinkPrepared=true;await writeTransaction(tf,tx);options.fault?.('BEFORE_UNLINK',f.path);assertLock();await fs.unlink(p);tx.deletedFiles++;options.fault?.('AFTER_UNLINK',f.path);tx.cursor=i+1;tx.unlinkPrepared=false;await writeTransaction(tf,tx);
  }
  const remaining=await inventory(root);if(remaining.some(f=>tx.units.some(u=>f.path.startsWith('runs/'+u.runId+'/')||f.path.startsWith('market-bias-v2/research/'+u.runId+'/')||f.path.startsWith('market-bias-v2/audit/'+u.runId+'/'))))throw Error('RETENTION_NEW_FILES_AFTER_COMMIT');
  options.fault?.('BEFORE_VERIFY');assertLock();
  if(sha(await json(path.join(root,historyRel)))!==tx.afterHistorySha256||sha(await json(path.join(root,manifestRel)))!==tx.afterManifestSha256)throw Error('RETENTION_COMMIT_VERIFY_FAILED');
  const manifestSha256=await digest(path.join(root,manifestRel));if(!(await inspectManifest(root,m,{manifestSha256})).ok)throw Error('RETENTION_COMMIT_VERIFY_FAILED');
  const result={planId:tx.planId,status:'COMPLETED',phase:'COMPLETED',completedAt:now,deletedFiles:tx.deletedFiles,logicalBytes:tx.units.reduce((n,u)=>n+u.bytes,0),runIds:tx.units.map(u=>u.runId)};
  state={contract:RETENTION_CONTRACT,pending:null,lastCompleted:tx.planId,lastResult:result,manifestSha256,retiredRuns:Object.fromEntries(tx.units.map(u=>[u.runId,{retiredAt:now}]))};
  await atomicWrite(sf,state);options.fault?.('AFTER_VERIFIED');await fs.unlink(tf);
  // Remove only empty directories in known retired units; never recursively remove unknown files.
  for(const u of tx.units)for(const rel of ['runs/'+u.runId,'market-bias-v2/research/'+u.runId,'market-bias-v2/audit/'+u.runId])await removeEmpty(root,rel);return result;
 }catch(e){try{if(compromised)throw e;const state=await retentionState(root);if(state.pending)await atomicWrite(sf,{...state,lastError:{code:/^[A-Z_]+$/.test(e.code||e.message)?e.code||e.message:'RETENTION_FAILED',at:options.now??Date.now()}});}catch{}throw e;}
 finally{await release();}
}
async function removeEmpty(root,rel){try{const dir=await contained(root,rel);for(const e of await fs.readdir(dir,{withFileTypes:true}))if(e.isDirectory()&&!e.isSymbolicLink())await removeEmpty(root,rel+'/'+e.name);await fs.rmdir(dir);}catch(e){if(!['ENOENT','ENOTEMPTY'].includes(e.code))throw e;}}
export async function verifyRetention(root,{now=Date.now()}={}){
 const state=await retentionState(root);if(state.pending)return {ok:false,status:'RETENTION_RECOVERY_REQUIRED',pending:state.pending};const {history,manifest}=await assertPrepared(root),report=await inspectManifest(root,manifest,state),dangling=[];
 for(const e of Object.values(history.research))if(!await exists(path.join(root,'market-bias-v2/research',e.runId,e.symbol+'.json'))||!await exists(path.join(root,'runs',e.runId,'facts',e.symbol+'.json'))||!await exists(path.join(root,'market-bias-v2/audit',e.runId,e.symbol+'.json'))||!await exists(path.join(root,'market-bias-v2/receipts',e.recordId+'.json')))dangling.push(e.recordId);
 if(!report.ok)return {...report,ok:false,dangling};const plan=await planRetention(root,{now}),invalid=plan.units.filter(u=>u.reasons.some(r=>/UNVERIFIED|MISMATCH|UNSEALED|UNINDEXED/.test(r)));return {ok:!dangling.length&&!invalid.length,legacyDifferences:report.errors.map(e=>e.path),dangling,invalidUnits:invalid.map(u=>u.runId),metrics:plan.metrics,state};
}
