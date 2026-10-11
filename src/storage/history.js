import {flipRole} from '../intelligence/notification-evidence.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import properLockfile from 'proper-lockfile';
import {config,dayKey} from '../config.js';
export async function atomicWrite(file,value,{overwrite=true}={}){
  await fs.mkdir(path.dirname(file),{recursive:true});
  const tmp=file+'.'+process.pid+'.'+crypto.randomUUID()+'.tmp';
  try{await fs.writeFile(tmp,JSON.stringify(value,null,2)+'\n',{mode:0o600});if(overwrite)await fs.rename(tmp,file);else {try{await fs.link(tmp,file);}catch(e){if(e.code!=='EEXIST')throw e;}}}finally{await fs.rm(tmp,{force:true});}
}
export async function readJson(file,fallback){try{return JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')return fallback;throw new Error('CORRUPT_STATE:'+path.basename(file));}}
export async function lock(dir,{onCompromised=()=>{}}={}){
  const state=path.resolve(dir,'state');await fs.mkdir(state,{recursive:true});
  const file=path.join(state,'run.lock'),lease=path.join(state,'run.lease');
  let compromised=false;
  let releaseLease;
  try{releaseLease=await properLockfile.lock(state,{lockfilePath:lease,stale:5000,update:1000,retries:0,
    onCompromised:()=>{compromised=true;onCompromised();}});}catch(e){if(e.code==='ELOCKED')throw new Error('RUN_ALREADY_LOCKED');throw e;}
  const token=crypto.randomUUID();let handle;
  try{
    let previous;
    try{previous=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){
      if(e.code!=='ENOENT'){
        const stat=await fs.stat(file);
        if(Date.now()-stat.mtimeMs<5000)throw new Error('RUN_ALREADY_LOCKED');
        await fs.unlink(file);
      }
    }
    if(previous){
      let alive=true;
      try{process.kill(previous.pid,0);}catch(e){if(e.code==='ESRCH')alive=false;else if(e.code!=='EPERM')alive=false;}
      if(previous.pid===process.pid && previous.started<Date.now()-process.uptime()*1000-1000)alive=false;
      if(alive)throw new Error('RUN_ALREADY_LOCKED');
      await fs.unlink(file);
    }
    handle=await fs.open(file,'wx',0o600);
    await handle.writeFile(JSON.stringify({pid:process.pid,started:Date.now(),token}));
  }catch(e){if(handle)await handle.close();await releaseLease();throw e;}
  let released=false;
  return async()=>{
    if(released)return;released=true;
    try{await handle.close();const current=await readJson(file,null);if(current?.token===token)await fs.unlink(file);}
    finally{if(!compromised)await releaseLease();}
  };
}
export const emptyHistory=()=>({version:1,runs:{},stories:{},snapshot:{},rotation:0,generated:0,sent:0});
export function longShortSummary(ls){
  if(!ls)return null;
  const value={};
  for(const key of ['global','topAccounts','topPositions']){
    const s=ls[key];if(!s?.quality.available)continue;
    value[key]={longPct:s.latestLongAccountPct ?? s.topLongPositionShare,shortPct:s.latestShortAccountPct ?? s.topShortPositionShare,
      changes:Object.fromEntries(Object.entries(s.windows).map(([h,w])=>[h,w.longChangePp])),dominantSide:s.currentDominantSide ?? null,
      flip:s.dominanceFlip?{status:s.flip.status,from:s.flip.from,to:s.flip.to,timestamp:s.flip.timestamp}:null};
  }
  if(ls.divergence?.gapPp!==null&&ls.divergence?.gapPp!==undefined)value.divergence={gapPp:ls.divergence.gapPp,globalChange4hPp:ls.divergence.globalLongChange4hPp,topChange4hPp:ls.divergence.topLongChange4hPp};
  return value;
}
export function longShortMaterial(current,old,{previousObservedAt}={}){
  if(!current)return false;
  // A proved later global flip remains new evidence even if earlier ratios were unavailable.
  if(Number.isSafeInteger(previousObservedAt)&&Number.isSafeInteger(current.global?.flip?.timestamp)&&current.global.flip.timestamp>previousObservedAt)return true;
  if(!old)return false; // first availability alone is not a material claim
  const delta=(a,b)=>a!==null&&a!==undefined&&b!==null&&b!==undefined&&Math.abs(Number(a)-Number(b))>=config.longShort.thresholds.materialChangePp;
  for(const key of ['global','topAccounts','topPositions']){
    const a=current[key],b=old[key];if(!a||!b)continue;
    if(delta(a.longPct,b.longPct)||delta(a.shortPct,b.shortPct)||['1h','4h','24h'].some(h=>delta(a.changes[h],b.changes[h]))||a.dominantSide!==b.dominantSide)return true;
    // Same flip event with more confirming samples is stable after CONFIRMED.
    if(a.flip&&flipRole(a.flip,b.flip,previousObservedAt)!=='PREVIOUSLY_KNOWN_FLIP_CONTEXT')return true;
  }
  return delta(current.divergence?.gapPp,old.divergence?.gapPp)||delta(current.divergence?.globalChange4hPp,old.divergence?.globalChange4hPp)||delta(current.divergence?.topChange4hPp,old.divergence?.topChange4hPp);
}
export const summary=f=>({longShort:longShortSummary(f.longShort),anomalies:f.anomalies.map(a=>a.kind).sort(),price:Number(f.price.rolling24h?.result),oi:Number(f.openInterest.windows['4h']?.result),oi1:Number(f.openInterest.windows['1h']?.result),oi24:Number(f.openInterest.windows['24h']?.result),funding:Number(f.funding.settledLatest?.result),volume:Number(f.volume.relative1h?.result)});
export function compare(f,previous){
  const current=summary(f);
  if(!previous)return {eligible:true,storyType:'NEW_STORY',reason:'NO_PREVIOUS_OUTPUT',current,previous:null};
  const old=previous.summary;
  const changed=longShortMaterial(current.longShort,old.longShort,{previousObservedAt:previous.lastResearchTime}) || JSON.stringify(current.anomalies.filter(k=>k!=='ACCOUNT_DOMINANCE_FLIP'))!==JSON.stringify(old.anomalies.filter(k=>k!=='ACCOUNT_DOMINANCE_FLIP')) || (Number.isFinite(current.price)&&Number.isFinite(old.price)&&Math.sign(current.price)!==Math.sign(old.price)) || (Number.isFinite(current.oi)&&Number.isFinite(old.oi)&&Math.sign(current.oi)!==Math.sign(old.oi)) || (Number.isFinite(current.funding)&&Number.isFinite(old.funding)&&Math.sign(current.funding)!==Math.sign(old.funding)) || (Number.isFinite(current.price)&&Number.isFinite(old.price)&&Math.abs(current.price-old.price)>=15) || (Number.isFinite(current.oi)&&Number.isFinite(old.oi)&&Math.abs(current.oi-old.oi)>=10) || (Number.isFinite(current.oi1)&&Number.isFinite(old.oi1)&&Math.abs(current.oi1-old.oi1)>=10) || (Number.isFinite(current.oi24)&&Number.isFinite(old.oi24)&&Math.abs(current.oi24-old.oi24)>=10) || (Number.isFinite(current.funding)&&Number.isFinite(old.funding)&&Math.abs(current.funding-old.funding)>=0.05) || (Number.isFinite(old.volume)&&current.volume>=2 && Math.abs(current.volume-old.volume)>=2);
  return {eligible:changed,storyType:'MATERIAL_UPDATE',reason:changed?'MATERIAL_EVIDENCE_CHANGE':'NO_MATERIAL_CHANGE',current,previous};
}
export const storyKey=(f,comparison)=>crypto.createHash('sha256').update(JSON.stringify({symbol:f.symbol,summary:comparison.current})).digest('hex').slice(0,24);
export async function loadOutbox(dir){
  await fs.mkdir(path.join(dir,'outbox'),{recursive:true});
  const files=(await fs.readdir(path.join(dir,'outbox'))).filter(f=>f.endsWith('.json'));
  return Promise.all(files.map(async f=>{const file=path.join(dir,'outbox',f),record=await readJson(file,null);
    if(record?.delivery?.queueVersion===1){for(const part of record.delivery.parts || [])if(part.status==='SENDING'){part.status='UNKNOWN';part.error='RECOVERED_UNCONFIRMED_DELIVERY';}if(record.delivery.parts?.some(p=>p.status==='UNKNOWN')){record.delivery.status='UNKNOWN';record.delivery.sent=false;}await atomicWrite(file,record);}
    if(['SENDING','ATTEMPTED_UNKNOWN','FAILED_OR_UNKNOWN'].includes(record?.delivery?.status)){record.delivery={...record.delivery,status:'UNKNOWN',sent:false,error:'RECOVERED_UNCONFIRMED_DELIVERY'};await atomicWrite(file,record);}
    return record;}));
}
export const dailyCount=(outbox,ms)=>outbox.filter(a=>dayKey(a.generatedAt)===dayKey(ms)).length;
export function reconcile(history,outbox){
  history.generated=outbox.length;history.sent=outbox.filter(a=>a.delivery.status==='SENT').length;
  history.daily={};for(const a of outbox){const day=dayKey(a.generatedAt);history.daily[day] ||= {generated:0,sent:0};history.daily[day].generated++;if(a.delivery.status==='SENT')history.daily[day].sent++;}
  for(const a of outbox.sort((x,y)=>x.generatedAt-y.generatedAt))history.stories[a.symbol]={storyKey:a.storyKey,summary:a.summary,lastResearchTime:a.evaluationTime,lastOutputTime:a.generatedAt,status:'OUTBOX',runId:a.runId,evidenceIds:a.evidenceIds,article:a.article,directional:a.directional ?? null,delivery:a.delivery};
  return history;
}
