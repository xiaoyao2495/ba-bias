// Current retained-file contract. Completed file-level cleanup plans are not permanent archives.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {sha} from '../analysis/market-bias-v2/common.js';
export const SIMPLE_MANIFEST='BOUNDED_RUN_RETENTION_120H_V1';
export const ORIGINAL_MANIFEST='market-bias-v2/state/cutover-manifest.json';
export const retentionPlanHash=p=>sha({...p,metrics:{...p.metrics,availableBytes:null}});
export async function fileHash(p){const h=createHash('sha256');for await(const b of createReadStream(p))h.update(b);return h.digest('hex');}
export function canonicalLegacyPaths(manifest){
 if(manifest.contract!=='BA_BIAS_MARKET_BIAS_V2'||!['IMMUTABLE_LEGACY_ARCHIVE',SIMPLE_MANIFEST].includes(manifest.legacyHandling))throw Error('RETENTION_MANIFEST_VERSION_UNKNOWN');
 const result=new Map(),folded=new Set();
 for(const [original,hash]of Object.entries(manifest.legacyHashes||{})){
  const rel=original.replaceAll('\\','/'),parts=rel.split('/');
  if(!rel||parts.some(p=>!p||p==='.'||p==='..'||/[\x00-\x1f:]/.test(p)||/[. ]$/.test(p)||/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(p))||!/^[a-f0-9]{64}$/.test(hash)||folded.has(rel.toLowerCase()))throw Error('RETENTION_MANIFEST_PATH_UNSAFE');
  folded.add(rel.toLowerCase());result.set(rel,hash);
 }return result;
}
export async function safeFile(root,rel){
 if(typeof rel!=='string'||rel.includes('\\')||rel.split('/').some(p=>!p||p==='.'||p==='..'||p.includes(':')))throw Error('RETENTION_PATH_REJECTED');
 let current=root;for(const part of rel.split('/')){current=path.join(current,part);const s=await fs.lstat(current);if(s.isSymbolicLink())throw Error('RETENTION_LINK_REJECTED');}
 if(!(await fs.realpath(current)).startsWith(await fs.realpath(root)+path.sep))throw Error('RETENTION_PATH_REJECTED');return current;
}
export async function boundedJson(root,rel){const p=await safeFile(root,rel),s=await fs.lstat(p);if(!s.isFile()||s.size>16*1024*1024)throw Error('RETENTION_METADATA_UNSAFE');return JSON.parse(await fs.readFile(p,'utf8'));}
export async function inspectManifest(root,manifest,state={}){
 canonicalLegacyPaths(manifest);const errors=[];
 if(manifest.legacyHandling===SIMPLE_MANIFEST&&(!state.manifestSha256||await fileHash(await safeFile(root,ORIGINAL_MANIFEST))!==state.manifestSha256))throw Error('RETENTION_MANIFEST_BINDING_INVALID');
 for(const [original,expected]of Object.entries(manifest.legacyHashes))try{if(await fileHash(await safeFile(root,original.replaceAll('\\','/')))!==expected)errors.push({path:original,status:'HASH_MISMATCH'});}catch(e){errors.push({path:original,status:e.code==='ENOENT'?'UNAUTHORIZED_MISSING':'FILE_UNVERIFIABLE'});}
 return {ok:errors.length===0,contract:manifest.legacyHandling,errors,files:Object.keys(manifest.legacyHashes).length};
}
