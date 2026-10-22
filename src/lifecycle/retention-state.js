import fs from 'node:fs/promises';
import path from 'node:path';
export const RETENTION_CONTRACT='BA_BIAS_SIMPLE_RETENTION_5D_V1';
export const RETENTION_DAYS=5;
export const RETENTION_MS=RETENTION_DAYS*24*3600000;
export const RETENTION_DIR='retention-v1';
export async function retentionState(root){
 const dir=path.join(root,RETENTION_DIR),file=path.join(dir,'state.json');let r={contract:RETENTION_CONTRACT,pending:null,retiredRuns:{}};
 try{if((await fs.lstat(dir)).isSymbolicLink())throw Error('RETENTION_STATE_INVALID');const s=await fs.lstat(file);if(!s.isFile()||s.isSymbolicLink()||s.size>65536)throw Error('RETENTION_STATE_INVALID');r=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
 if(r.contract!==RETENTION_CONTRACT||!r.retiredRuns||Array.isArray(r.retiredRuns)||typeof r.retiredRuns!=='object'||Object.keys(r.retiredRuns).length>10||Object.keys(r.retiredRuns).some(id=>!(/^[A-Za-z0-9_-]{1,100}$/).test(id))||r.pending!==null&&!/^retention_[a-f0-9]{64}$/.test(r.pending))throw Error('RETENTION_STATE_INVALID');
 for(const name of ['manifest-v2.json','transactions'])try{await fs.lstat(path.join(dir,name));throw Error('RETENTION_OLD_PROTOTYPE_REQUIRES_REVIEW');}catch(e){if(e.code!=='ENOENT')throw e;}
 try{const s=await fs.lstat(path.join(dir,'active.json'));if(!s.isFile()||s.isSymbolicLink())throw Error('RETENTION_STATE_INVALID');if(!r.pending){const t=JSON.parse(await fs.readFile(path.join(dir,'active.json'),'utf8'));if(t.planId!==r.lastCompleted)r.pending=t.planId||'ORPHAN';}}catch(e){if(e.code!=='ENOENT')throw e;}
 return r;
}
export async function assertRetentionIdle(root){let r;try{r=await retentionState(root);}catch(e){e.status=503;throw e;}if(r.pending)throw Object.assign(Error('RETENTION_RECOVERY_REQUIRED'),{status:503});return r;}
