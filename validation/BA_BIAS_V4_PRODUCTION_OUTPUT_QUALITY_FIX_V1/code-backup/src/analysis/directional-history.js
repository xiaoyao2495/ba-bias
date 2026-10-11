import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import Big from 'big.js';
import {safeError} from '../config.js';
import {atomicWrite,readJson} from '../storage/history.js';
import {closedKlines,pct,oiWindow} from '../market/facts-engine.js';
const HOUR=3600000,FIVE=300000;
export async function saveDirectionalSnapshot(dataDir,{runId,facts,result,history,now=Date.now}){
  if(result.analystVersion==='V4')return saveV4Snapshot(dataDir,{runId,facts,result,history,now});
  const a=result.analysis,evaluationTime=facts.dataCutoff,horizonEndTime=evaluationTime+parseInt(a.horizon)*HOUR;
  const id=crypto.createHash('sha256').update(JSON.stringify({runId,symbol:facts.symbol,evaluationTime,analysis:a})).digest('hex').slice(0,32);
  const snapshot={factsPath:path.resolve(dataDir,'runs',runId,'facts',facts.symbol+'.json'),id,runId,symbol:facts.symbol,version:'DIRECTIONAL_SNAPSHOT_V1',evaluationTime,horizonEndTime,
    entryReferencePrice:result.input.entryReference?.price ?? null,entryReferenceTimestamp:result.input.entryReference?.timestamp ?? null,
    direction:a.marketBias,horizon:a.horizon,conviction:a.conviction,originalEvidenceIds:[...a.supportingEvidenceIds,...a.conflictingEvidenceIds],
    invalidation:a.invalidation,rules:result.input.rules.filter(r=>a.invalidation.ruleIds.includes(r.id)),originalAnalysis:a,rendered:result.rendered,
    analystStatus:result.status,lifecycleStatus:result.status==='FAILED'?'ANALYST_FAILED':a.marketBias==='NO_EDGE'?'NO_EDGE':'ACTIVE',input:result.input,attempts:result.attempts};
  const file=path.join(dataDir,'directional',id+'.json');
  await atomicWrite(file,snapshot,{overwrite:false});
  const existing=await readJson(file,null);if(JSON.stringify(existing)!==JSON.stringify(snapshot))throw new Error('DIRECTIONAL_SNAPSHOT_CONFLICT');
  history.directionalSnapshots ||= {};history.directionalSnapshots[id]={symbol:snapshot.symbol,evaluationTime,horizonEndTime,direction:snapshot.direction,horizon:snapshot.horizon,conviction:snapshot.conviction,status:snapshot.lifecycleStatus,path:path.resolve(file)};
  return snapshot;
}
async function appendArchivedObservations(dataDir,snapshot,current,history,cache){
  if(!/^[\p{L}\p{N}]{1,40}USDT$/u.test(snapshot.symbol))throw new Error('INVALID_SNAPSHOT_SYMBOL');
  const observations=[current];
  for(const [runId,run] of Object.entries(history.runs || {})){
    if(!/^[A-Za-z0-9_-]{1,100}$/.test(runId))continue;
    const t=run.lastResearchTime;
    if(!Number.isSafeInteger(t)||t<snapshot.evaluationTime||t>Math.min(current.dataCutoff,snapshot.horizonEndTime+HOUR))continue;
    const key=runId+':'+snapshot.symbol;
    if(!cache.has(key))cache.set(key,await readJson(path.join(dataDir,'runs',runId,'facts',snapshot.symbol+'.json'),null));
    const f=cache.get(key);if(f?.symbol===snapshot.symbol&&Number.isSafeInteger(f.dataCutoff)&&f.dataCutoff<=current.dataCutoff&&f.dataCutoff>=snapshot.evaluationTime)observations.push(f);
  }
  const sources={...current.sources};
  for(const [key,interval] of [['hour','1h'],['five','5m'],['oi',null]]){
    const map=new Map(),conflicts=new Set();
    for(const f of observations){const s=f.sources?.[key];
      if(!s||s.params?.symbol&&s.params.symbol!==snapshot.symbol||interval&&s.params?.interval&&s.params.interval!==interval||!Array.isArray(s.raw))continue;
      for(const r of s.raw){const time=interval?r?.[0]:r?.timestamp;if(!Number.isSafeInteger(time))continue;
        const fingerprint=interval?JSON.stringify([r.slice(0,5),r[6]]):JSON.stringify([r.symbol,r.timestamp,r.sumOpenInterest]);
        if(map.has(time)&&map.get(time).fingerprint!==fingerprint)conflicts.add(time);
        else map.set(time,{fingerprint,row:r});
      }
    }
    sources[key]={...(sources[key] || {}),raw:[...map.entries()].filter(([t])=>!conflicts.has(t)).sort((a,b)=>a[0]-b[0]).map(([,v])=>v.row),archivedPriceConflicts:[...conflicts],mergedRunIds:[...new Set(observations.map(f=>f.runId).filter(Boolean))]};
  }
  return {...current,sources};
}
function matched(value,r){return r.operator==='LTE'?Number(value)<=r.threshold:Number(value)>=r.threshold;}
export function evaluateDirectionalSnapshot(snapshot,observed,{commitReceipt}={}){
  if(snapshot.analystVersion==='V4'){
    const start=commitReceipt?.predictionStartTime,validReceipt=commitReceipt?.snapshotId===snapshot.id&&commitReceipt.snapshotHash===crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex')&&Number.isSafeInteger(start)&&start>=snapshot.time.analystCompletedAt;
    let lifecycle={snapshotId:snapshot.id,asOf:observed.dataCutoff,lifecycleStatus:snapshot.lifecycleStatus,conditionObservations:[],checks:[]};
    if(validReceipt&&observed.dataCutoff>=start){
      const ruleIds=(snapshot.originalAnalysis?.reassessmentConditions||[]).filter(c=>c.conditionType==='PROGRAM_RULE').map(c=>c.ruleId);
      lifecycle=evaluateDirectionalSnapshot({...snapshot,analystVersion:undefined,evaluationTime:start,horizonEndTime:start+parseInt(snapshot.horizon)*HOUR,entryReferencePrice:null,rules:snapshot.input.rules.filter(r=>ruleIds.includes(r.id))},observed);
    }
    return {...lifecycle,analystVersion:'V4',predictionCommittedAt:validReceipt?start:null,resultStatus:'INELIGIBLE_CAUSAL',reason:'NO_VERIFIED_POST_COMMIT_BASELINE_AND_COMPLETE_CAUSAL_TIMES',causalBacktestEligible:false,netPriceChangePct:null,mfePct:null,maePct:null,directionConsistent:null};
  }
  const asOf=observed.dataCutoff,entry=snapshot.entryReferencePrice;
  if(observed.symbol!==snapshot.symbol)throw new Error('OUTCOME_SYMBOL_MISMATCH');
  if(asOf<snapshot.evaluationTime)throw new Error('OUTCOME_BEFORE_SNAPSHOT');
  const hour=closedKlines(observed.sources.hour?.raw || [],asOf,HOUR),five=closedKlines(observed.sources.five?.raw || [],asOf,FIVE);
  const checks=[],conditionObservations=[];
  for(const r of snapshot.rules){
    const n=parseInt(r.horizon),duration=n*HOUR;
    // Price conditions use complete equal-length rolling windows newly closed after publication.
    // OI similarly requires exact endpoints, whose endpoint becomes visible after publication.
    if(r.metric==='PRICE_CLOSED_CHANGE')for(let i=n-1;i<hour.length;i++){
      const bars=hour.slice(i-n+1,i+1),time=bars.at(-1)[6];
      if(time<=snapshot.evaluationTime||time>snapshot.horizonEndTime||bars.some((b,j)=>j&&b[0]!==bars[j-1][0]+HOUR))continue;
      const value=pct(bars.at(-1)[4],bars[0][1]);conditionObservations.push({ruleId:r.id,timestamp:time,value,triggered:matched(value,r)});if(matched(value,r))checks.push({ruleId:r.id,status:r.outcome,timestamp:time,value,source:observed.sources.hour.endpoint});
    }
    else for(const row of observed.sources.oi?.raw || []){
      if(row.symbol!==snapshot.symbol||!Number.isSafeInteger(row.timestamp)||row.timestamp>asOf||row.timestamp>snapshot.horizonEndTime||row.timestamp<=snapshot.evaluationTime)continue;
      const w=oiWindow(observed.sources.oi.raw,snapshot.symbol,row.timestamp,n);
      const samples=(observed.sources.oi.raw || []).filter(x=>x.symbol===snapshot.symbol&&x.timestamp>=row.timestamp-duration&&x.timestamp<=row.timestamp).sort((a,b)=>a.timestamp-b.timestamp);
      if(w.value!==null&&samples.length===n+1&&samples.every((x,i)=>x.timestamp===row.timestamp-duration+i*HOUR)&&w.end.timestamp===row.timestamp){conditionObservations.push({ruleId:r.id,timestamp:row.timestamp,value:w.value,triggered:matched(w.value,r)});if(matched(w.value,r))checks.push({ruleId:r.id,status:r.outcome,timestamp:row.timestamp,value:w.value,source:observed.sources.oi.endpoint});}
    }
  }
  const invalidated=checks.some(c=>c.status==='INVALIDATED'),warning=checks.some(c=>c.status==='THESIS_WARNING');
  const base={snapshotId:snapshot.id,asOf,sourceRunIds:[...new Set(Object.values(observed.sources).flatMap(s=>s?.mergedRunIds || []))],conditionObservations,checks,conditionCoverage:'Only exact rolling windows newly sampled or closed inside the horizon are tested; missing windows are unknown',invalidationTriggered:invalidated?true:null,
    lifecycleStatus:invalidated?'INVALIDATED':asOf>=snapshot.horizonEndTime?'HORIZON_EXPIRED':warning?'THESIS_WARNING':snapshot.lifecycleStatus,
    resultStatus:asOf<snapshot.horizonEndTime?'PENDING':'INSUFFICIENT_DATA',endPrice:null,endPriceTimestamp:null,endObservationLagMs:null,netPriceChangePct:null,mfePct:null,maePct:null,observedMfePct:null,observedMaePct:null,directionConsistent:null,
    tradingProfitability:'NOT_EVALUATED',reason:asOf<snapshot.horizonEndTime?'HORIZON_NOT_FINISHED':'FOLLOW_UP_PRICE_DATA_INCOMPLETE'};
  const invalidationRules=snapshot.rules.filter(r=>r.outcome==='INVALIDATED');
  const invalidationCovered=invalidationRules.length&&invalidationRules.every(r=>{
    const required=[];for(let t=Math.floor(snapshot.evaluationTime/HOUR)*HOUR+HOUR-1;t<=snapshot.horizonEndTime;t+=HOUR)if(t>snapshot.evaluationTime)required.push(t);
    return required.length&&required.every(t=>conditionObservations.some(c=>c.ruleId===r.id&&c.timestamp===t));
  });
  if(!invalidated&&asOf>=snapshot.horizonEndTime&&invalidationCovered)base.invalidationTriggered=false;
  // No terminal price score or excursions are calculated before the horizon ends.
  if(asOf<snapshot.horizonEndTime||!entry)return base;
  const samples=five.filter(b=>b[0]>=snapshot.evaluationTime&&b[6]<=snapshot.horizonEndTime),last=samples.at(-1);
  const uninterrupted=samples.length&&samples.every((b,i)=>!i||b[0]===samples[i-1][0]+FIVE);
  const startGap=samples[0]?.[0]-snapshot.evaluationTime,endLag=last?snapshot.horizonEndTime-(last[6]+1):Infinity;
  if(!uninterrupted||startGap<0||startGap>=FIVE||endLag<0||endLag>=FIVE)return base;
  const net=pct(last[4],entry),high=samples.reduce((v,b)=>new Big(b[2]).gt(v)?b[2]:v,entry),low=samples.reduce((v,b)=>new Big(b[3]).lt(v)?b[3]:v,entry);
  const bullish=['BULLISH','BULLISH_REVERSAL'].includes(snapshot.direction),bearish=['BEARISH','BEARISH_REVERSAL'].includes(snapshot.direction);
  const observedMfe=bearish?new Big(pct(low,entry)).neg().toFixed(8):pct(high,entry),observedMae=bearish?new Big(pct(high,entry)).neg().toFixed(8):pct(low,entry);
  // Boundary bars spanning pre-publication or post-horizon data are excluded.
  // Full MFE/MAE remain null unless the entire horizon is covered exactly.
  const full=startGap===0&&endLag===0;
  Object.assign(base,{resultStatus:'EVALUATED',endPrice:last[4],endPriceTimestamp:last[6],endObservationLagMs:snapshot.horizonEndTime-last[6],netPriceChangePct:net,
    mfePct:full&&snapshot.direction!=='NO_EDGE'?observedMfe:null,maePct:full&&snapshot.direction!=='NO_EDGE'?observedMae:null,observedMfePct:snapshot.direction==='NO_EDGE'?null:observedMfe,observedMaePct:snapshot.direction==='NO_EDGE'?null:observedMae,
    directionConsistent:bullish?Number(net)>0:bearish?Number(net)<0:null,reason:full?'EXACT_CLOSED_5M_HORIZON':'CLOSED_5M_OBSERVATIONS_WITH_EXPLICIT_BOUNDARY_GAPS',sampling:{interval:'5m',startGapMs:startGap,endGapMs:endLag,fullHorizonCovered:full,source:observed.sources.five.endpoint}});
  return base;
}
export async function refreshDirectionalOutcomes(dataDir,observations,history){
  const dir=path.join(dataDir,'directional');let files;try{files=await fs.readdir(dir);}catch(e){if(e.code==='ENOENT')return [];return [{resultStatus:'TRACKING_FAILED',error:safeError(e)}];}
  const updates=[],cache=new Map();
  for(const file of files.filter(f=>/^[a-f0-9]{32}\.json$/.test(f))){
    try{
    const snapshot=await readJson(path.join(dir,file),null),observed=observations.find(f=>f.symbol===snapshot.symbol&&f.dataCutoff>=snapshot.evaluationTime);
    if(!observed||snapshot.analystStatus==='FAILED')continue;
    const collected=await appendArchivedObservations(dataDir,snapshot,observed,history,cache);
    const commitReceipt=snapshot.analystVersion==='V4'?await readJson(snapshot.commitReceiptPath,null):null;
    const result=evaluateDirectionalSnapshot(snapshot,collected,{commitReceipt});
    result.analystVersion ||= 'V3';
    const resultDir=path.join(dataDir,'directional-results',snapshot.id);
    let previousFiles=[];try{previousFiles=await fs.readdir(resultDir);}catch(e){if(e.code!=='ENOENT')throw e;}
    const preceding=previousFiles.filter(name=>/^\d+\.json$/.test(name)&&Number(name.slice(0,-5))<result.asOf).sort((a,b)=>Number(b.slice(0,-5))-Number(a.slice(0,-5)))[0];
    if(preceding){const previous=await readJson(path.join(resultDir,preceding),null);if(previous.lifecycleStatus==='INVALIDATED'){result.lifecycleStatus='INVALIDATED';result.invalidationTriggered=true;result.previouslyInvalidatedAt=previous.previouslyInvalidatedAt ?? previous.asOf;}}

    const resultPath=path.join(dataDir,'directional-results',snapshot.id,String(result.asOf)+'.json');
    await atomicWrite(resultPath,result,{overwrite:false});
    const stored=await readJson(resultPath,null);if(JSON.stringify(stored)!==JSON.stringify(result))throw new Error('DIRECTIONAL_RESULT_CONFLICT');
    const entry=(history.directionalSnapshots ||= {})[snapshot.id] ||= {symbol:snapshot.symbol,evaluationTime:snapshot.evaluationTime,horizonEndTime:snapshot.horizonEndTime,path:path.resolve(dir,file)};
    // Lifecycle never recovers an invalidated view. Older stored opinions remain
    // immutable; results are append-only observations with their own asOf.
    entry.status=entry.status==='INVALIDATED'?'INVALIDATED':result.lifecycleStatus;entry.latestResultPath=path.resolve(resultPath);updates.push(result);
    }catch(e){updates.push({snapshotId:file.slice(0,-5),resultStatus:'TRACKING_FAILED',error:safeError(e)});}
  }
  return updates;
}

async function saveV4Snapshot(dataDir,{runId,facts,result,history,now}){
 const a=result.envelope?.analysis,valid=result.status==='VALIDATED',horizon=valid?a.horizon:result.input.windows.find(w=>w.priceId)?.horizon||'1h';
 const id=crypto.createHash('sha256').update(JSON.stringify({runId,symbol:facts.symbol,version:'V4',requestId:result.envelope?.provenance.requestId??null,attempts:result.attempts})).digest('hex').slice(0,32);
 const snapshot={id,version:'DIRECTIONAL_SNAPSHOT_V4',analystVersion:'V4',contractVersion:result.contractVersion,runId,symbol:facts.symbol,evaluationTime:facts.dataCutoff,horizon,horizonEndTime:null,direction:valid?a.direction:null,conviction:valid?a.conviction:null,entryReferencePrice:null,entryReferenceTimestamp:null,analystStatus:result.status,lifecycleStatus:valid?a.direction==='NO_EDGE'?'NO_EDGE':'ACTIVE':'ANALYST_FAILED',originalAnalysis:a??null,input:result.input,attempts:result.attempts,validation:result.validation,provenance:result.envelope?.provenance??null,rendered:result.rendered,deterministicText:result.deterministicText,time:result.time,causalBacktestEligible:false,predictionCommittedAt:null,commitReceiptPath:path.resolve(dataDir,'directional-commits',id+'.json'),factsPath:path.resolve(dataDir,'runs',runId,'facts',facts.symbol+'.json')};
 const file=path.join(dataDir,'directional',id+'.json');await atomicWrite(file,snapshot,{overwrite:false});
 if(JSON.stringify(await readJson(file,null))!==JSON.stringify(snapshot))throw Error('DIRECTIONAL_SNAPSHOT_CONFLICT');
 // Snapshot acknowledgment precedes commit timestamp; no pre-generation entry price.
 const committedAt=valid?Date.now():null,predictionStartTime=committedAt!==null&&committedAt>=result.time.analystCompletedAt?committedAt:null,receipt={snapshotId:id,analystVersion:'V4',predictionCommittedAt:committedAt,predictionStartTime,horizonEndTime:predictionStartTime===null?null:predictionStartTime+parseInt(horizon)*HOUR,causalBacktestEligible:false,eligibility:'INCOMPLETE_NO_POST_COMMIT_BASELINE',snapshotHash:crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex')};
 await atomicWrite(snapshot.commitReceiptPath,receipt,{overwrite:false});
 if(JSON.stringify(await readJson(snapshot.commitReceiptPath,null))!==JSON.stringify(receipt))throw Error('DIRECTIONAL_COMMIT_CONFLICT');
 const entry={symbol:snapshot.symbol,analystVersion:'V4',evaluationTime:snapshot.evaluationTime,horizonEndTime:receipt.horizonEndTime,direction:snapshot.direction,horizon,conviction:snapshot.conviction,status:snapshot.lifecycleStatus,path:path.resolve(file),commitReceiptPath:snapshot.commitReceiptPath,predictionCommittedAt:committedAt,causalBacktestEligible:false};
 (history.directionalSnapshots ||= {})[id]=entry;
 return {...snapshot,predictionCommittedAt:committedAt,commitReceipt:receipt};
}
