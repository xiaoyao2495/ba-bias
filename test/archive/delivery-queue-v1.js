// ARCHIVED TEST HELPER ONLY: validates immutable legacy snapshots; NEVER imported by src/scripts/web.
import {splitBody} from '../../src/storage/message-boundaries.js';
import path from 'node:path';
import {setTimeout as pause} from 'node:timers/promises';
import {config,safeError} from '../../src/config.js';
import {Http} from '../../src/clients/http.js';
import {sendText} from '../../src/clients/dingtalk.js';
import {compactIntelligenceText} from './compact-renderer-v1.js';
import {atomicWrite,readJson,loadOutbox,reconcile,emptyHistory,lock} from '../../src/storage/history.js';
import {deliveryId,deliveryFailure} from '../../src/storage/delivery.js';
export const MESSAGE_BYTES=1800,SPACING_MS=3500,MAX_ATTEMPTS=5;
export function splitMessage(text,{id,symbol,maxBytes=MESSAGE_BYTES,onBoundaryFallback=()=>{}}={}){
  // Reserve bytes for a keyword, symbol, delivery ID and stable numbered part header.
  const header=`检测 · BA-BIAS / ${symbol}\nDeliveryId：${id}\n`,budget=maxBytes-Buffer.byteLength(header)-80;
  if(budget<4)throw new Error('INVALID_MESSAGE_BUDGET');
  const chunks=splitBody(text,budget,{onBoundaryFallback});
  return chunks.map((chunk,i)=>`${header}分片 ${i+1}/${chunks.length}\n${chunk}`);
}
export function prepareDelivery(record){
  const id=deliveryId(record),enabled=record.delivery.status==='PENDING';
  const boundaryDiagnostics=[];
  const parts=splitMessage(compactIntelligenceText(record.intelligence,record),{id,symbol:record.symbol,onBoundaryFallback:d=>boundaryDiagnostics.push(d)}).map((content,i)=>({
    deliveryId:`${id}_part_${i+1}`,content,status:enabled?'PENDING':'SHADOW',attempts:0,nextAttemptAt:0}));
  return {...record.delivery,deliveryId:id,queueVersion:1,parts,boundaryDiagnostics};
}
function deliveryStatus(parts){
  if(parts.some(p=>p.status==='UNKNOWN'))return 'UNKNOWN';
  if(parts.every(p=>p.status==='SENT'))return 'SENT';
  if(parts.some(p=>p.status==='FAILED'&&(p.retryable===false||p.attempts>=MAX_ATTEMPTS)))return 'FAILED';
  return 'PENDING';
}
export function queueEligible(record){
  const d=record.delivery;
  return record.intelligence?.version===1 && d?.queueVersion===1 && record.approval?.judgeEligible && record.approval?.intelligenceGuardPassed &&
    ['PENDING','FAILED'].includes(d.status) && d.parts?.some(p=>['PENDING','FAILED'].includes(p.status)&&p.attempts<MAX_ATTEMPTS&&p.retryable!==false);
}
export async function drainDeliveryQueue(records,{dataDir=config.dataDir,signal,now=Date.now,sleep=pause,http=new Http({signal,retries:0}),sender=sendText,spacingMs=SPACING_MS,persist}={}){
  const counters={sent:0,failed:0,unknown:0,pending:0};
  const rateFile=path.join(dataDir,'state','dingtalk-rate.json');
  const save=persist || (r=>atomicWrite(path.join(dataDir,'outbox',`${r.runId}_${r.symbol}.json`),r));
  for(const record of records){
    if(signal?.aborted)break;
    if(!queueEligible(record))continue;
    const d=record.delivery;
    for(const part of d.parts){
      if(signal?.aborted || !['PENDING','FAILED'].includes(part.status) || part.attempts>=MAX_ATTEMPTS || part.retryable===false || part.nextAttemptAt>now())continue;
      const rate=await readJson(rateFile,{lastAttemptAt:0,cooldownUntil:0});
      if(rate.cooldownUntil>now())break;
      try{await sleep(Math.max(0,rate.lastAttemptAt+spacingMs-now()),undefined,{signal});}catch{break;}
      if(signal?.aborted)break;
      part.status='SENDING';part.attempts++;part.attemptedAt=now();d.status='SENDING';d.sent=false;
      await save(record); // Ambiguous interruption after this point must never be retried.
      await atomicWrite(rateFile,{...rate,lastAttemptAt:now()});
      try{
        const ack=await sender(part.content,{http,now});
        if(ack?.acknowledgement?.errcode!==0 || ack.status!=='SENT')throw Object.assign(Error('DINGTALK_ACK_UNKNOWN'),{code:'DINGTALK_ACK_UNKNOWN'});
        Object.assign(part,ack,{finishedAt:now()});
        d.status=deliveryStatus(d.parts);d.sent=d.status==='SENT';
        if(d.sent){d.acknowledgement={errcode:0};d.acknowledgedAt=now();}
        await save(record);
      }catch(e){
        const failure=deliveryFailure(e),rateLimited=e.httpStatus===429 || e.response?.status===429 || e.rateLimited;
        Object.assign(part,failure,{finishedAt:now(),nextAttemptAt:now()+(rateLimited?Math.max(600000,e.retryAfterMs || 0):failure.retryAfterMs)});
        part.retryable=Boolean(failure.retryable);
        if(rateLimited)await atomicWrite(rateFile,{lastAttemptAt:now(),cooldownUntil:part.nextAttemptAt});
        d.status=failure.status==='UNKNOWN'?'UNKNOWN':part.retryable&&part.attempts<MAX_ATTEMPTS?'PENDING':'FAILED';
        d.sent=false;d.error=failure.error;d.businessCode=failure.businessCode;await save(record);
        break; // Continue to the next intelligence record; preserve all unsent parts.
      }
    }
    if(d.status==='SENT')counters.sent++;else if(d.status==='UNKNOWN')counters.unknown++;else if(d.status==='FAILED')counters.failed++;else counters.pending++;
  }
  return counters;
}
// Foreground scanner polls only this explicitly enabled v1 intelligence queue.
// Legacy articles, dry runs and ambiguous/SENT deliveries cannot enter it.
export async function flushDeliveryQueue({dataDir=config.dataDir,signal,now=Date.now,log=()=>{}}={},deps={}){
  let release;const controller=new AbortController(),budget=AbortSignal.timeout(120000),combined=AbortSignal.any([controller.signal,budget,...(signal?[signal]:[])]);
  try{
    release=await lock(dataDir,{onCompromised:()=>controller.abort(new Error('LOCK_COMPROMISED'))});const outbox=await loadOutbox(dataDir);
    const result=await drainDeliveryQueue(outbox,{dataDir,signal:combined,now,...deps});
    const file=path.join(dataDir,'state','history.json');const history=await readJson(file,emptyHistory());reconcile(history,outbox);await atomicWrite(file,history);
    if(result.sent || result.failed || result.unknown)log('Delivery queue',{...result});
    return result;
  }catch(e){if(e.message!=='RUN_ALREADY_LOCKED')log('Delivery queue failed',{error:safeError(e)});return {busy:e.message==='RUN_ALREADY_LOCKED'};}
  finally{if(release)await release();}
}
