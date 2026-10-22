import {config} from '../config.js';
import {compare,longShortMaterial,storyKey,summary} from '../storage/history.js';
import {verifiedFacts} from '../intelligence/packet.js';
import {historicalFreshness} from '../analysis/historical-freshness.js';
const family=kind=>kind.startsWith('PRICE')?'PRICE_EXTREMITY':kind.startsWith('OI_')?'OI_ABNORMALITY':kind.startsWith('FUNDING')?'FUNDING_EXTREMITY':kind==='VOLUME_SPIKE'?'VOLUME_ABNORMALITY':/ACCOUNT|POSITION|DIVERGENCE/.test(kind)?'ACCOUNT_DISTRIBUTION':null;
const numeric=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x));
export function materialEvidence(f,previous,policy=config.selector){
 if(!previous)return [{type:'NEW_STORY',evidenceIds:f.anomalies.flatMap(a=>a.evidenceIds)}];
 const old=previous.summary,now=f.dataCutoff;if(!old||!Number.isSafeInteger(previous.lastResearchTime)||now<=previous.lastResearchTime)return [];
 const changes=[];
 const delta=(key,e,min)=>{if(e&&numeric(e.result)&&numeric(old[key])&&Math.abs(Number(e.result)-Number(old[key]))>=min)changes.push({type:'METRIC_DELTA',metric:key,previous:old[key],current:e.result,delta:Number(e.result)-Number(old[key]),threshold:min,evidenceIds:[e.evidenceId]});};
 delta('price',f.price.rolling24h,policy.material.pricePp);for(const [k,w] of [['oi','4h'],['oi1','1h'],['oi24','24h']])delta(k,f.openInterest.windows[w],policy.material.oiPp);
 delta('funding',f.funding.settledLatest,policy.material.fundingPp);if(Number(f.volume.relative1h?.result)>=config.thresholds.volume)delta('volume',f.volume.relative1h,policy.material.volumeRatio);
 const cmp={current:summary(f)};
 if(longShortMaterial(cmp.current.longShort,old.longShort,{previousObservedAt:previous.lastResearchTime})){
  // A one-point dominant-side crossing alone is not a material event.
  const clean=x=>x&&Object.fromEntries(Object.entries(x).map(([k,v])=>[k,['global','topAccounts','topPositions'].includes(k)?{...v,dominantSide:null,flip:null}:v]));
  const flip=cmp.current.longShort?.global?.flip;
  if(longShortMaterial(clean(cmp.current.longShort),clean(old.longShort))||flip?.status==='CONFIRMED'&&flip.timestamp>previous.lastResearchTime)changes.push({type:'ACCOUNT_MATERIAL_CHANGE',evidenceIds:f.anomalies.filter(a=>family(a.kind)==='ACCOUNT_DISTRIBUTION').flatMap(a=>a.evidenceIds)});
 }
 for(const a of f.anomalies)if(Array.isArray(old.anomalies)&&!old.anomalies.includes(a.kind)&&a.kind!=='ACCOUNT_DOMINANCE_FLIP'&&a.strength>=policy.resonanceStrength)changes.push({type:'NEW_IMPORTANT_ANOMALY',kind:a.kind,evidenceIds:a.evidenceIds});
 return changes;
}
export function selectOpportunities(facts,stories={}, {policy=config.selector}={}){
 if(!Number.isInteger(policy.maxCandidates)||policy.maxCandidates<0)throw Error('INVALID_SELECTOR_TOP_K');
 const seen=new Set(),decisions=[];
 for(const original of [...facts].sort((a,b)=>a.symbol.localeCompare(b.symbol,'en'))){
  const row={symbol:original.symbol,status:'REJECTED',reason:null,score:null,dimensions:[],rank:null};decisions.push(row);
  let f;try{f=verifiedFacts(original);}catch(e){row.reason=e.message;row.status=e.message==='NO_DEEP_ANOMALY'?'LOW_RESEARCH_VALUE':'INSUFFICIENT_EVIDENCE';continue;}
  row.facts=f;const map=new Map(f.evidence.map(e=>[e.evidenceId,e]));
  if(f.anomalies.some(a=>a.evidenceIds.some(id=>!map.has(id)||map.get(id).dataTimes?.some(t=>Number(t.ms)>f.dataCutoff)))){row.status='INSUFFICIENT_EVIDENCE';row.reason='FUTURE_OR_MISSING_EVENT_EVIDENCE';continue;}
  const groups=new Map();for(const a of f.anomalies){const key=family(a.kind);if(!key||!numeric(a.strength))continue;const prior=groups.get(key);if(!prior||a.strength>prior.strength)groups.set(key,a);}
  const strengths=[...groups.values()].map(a=>a.strength),max=Math.max(0,...strengths);
  row.gate={families:groups.size,strongest:max,extreme:max>=policy.extremeStrength,resonance:groups.size>=policy.minimumFamilies&&max>=policy.resonanceStrength};
  if(!row.gate.extreme&&!row.gate.resonance){row.status='LOW_RESEARCH_VALUE';row.reason='BELOW_RESEARCH_GATE';continue;}
  const previous=stories[f.symbol];
  const freshness=previous?historicalFreshness(f.dataCutoff,previous.lastResearchTime,config.previousResearchFreshnessHours):{status:'NO_HISTORY',ageMs:null,windowMs:config.previousResearchFreshnessHours*3600000};
  const expired=freshness.status==='EXPIRED_FOR_CURRENT_COMPARISON';
  row.historicalBaseline={...freshness,source:previous?.status==='OUTBOX'?'OUTBOX_PROJECTION':previous?'SELECTOR_BASELINE':null,runId:previous?.runId??null,historicalFactsAsOf:previous?.lastResearchTime??null,purpose:freshness.status==='EXPIRED_FOR_CURRENT_COMPARISON'?'ARCHIVED_EVENT_DEDUP_ONLY':'CURRENT_COMPARISON',dedupDecision:'NOT_EVALUATED'};
  if(previous&&(!Array.isArray(previous.summary?.anomalies)||expired&&(['price','oi','oi1','oi24','funding','volume'].some(k=>typeof previous.summary[k]!=='number'||!Number.isFinite(previous.summary[k]))||previous.summary.anomalies.some(k=>typeof k!=='string'))||['INSUFFICIENT_HISTORICAL_EVIDENCE','INVALID_OR_NON_PRIOR_HISTORY'].includes(freshness.status))){row.status='INSUFFICIENT_EVIDENCE';row.reason=freshness.status==='INVALID_OR_NON_PRIOR_HISTORY'?freshness.status:'INSUFFICIENT_HISTORICAL_EVIDENCE';row.historicalBaseline.status=row.reason;row.historicalBaseline.dedupDecision='INSUFFICIENT_EVIDENCE';continue;}
  // Archived summaries retain their event-dedup purpose. Age alone never earns
  // eligibility; reuse the exact existing material rules, including small drift.
  let changes;
  try{changes=materialEvidence(f,previous,policy);}catch(e){if(!expired)throw e;row.status='INSUFFICIENT_EVIDENCE';row.reason='INSUFFICIENT_HISTORICAL_EVIDENCE';row.historicalBaseline.status=row.reason;row.historicalBaseline.dedupDecision='INSUFFICIENT_EVIDENCE';continue;}
  row.materialEvidence=changes;
  row.historicalBaseline.dedupDecision=previous?(changes.length?'MATERIAL_CHANGE':'NO_MATERIAL_CHANGE'):'NEW_STORY';
  if(previous&&!changes.length){row.status='NO_MATERIAL_UPDATE';row.reason='NO_MATERIAL_CHANGE';continue;}
  const cmp=expired?{current:summary(f),previous:null,storyType:'MATERIAL_UPDATE',historicalContext:row.historicalBaseline}:compare(f,previous);row.comparison={...cmp,eligible:true,reason:previous?'MATERIAL_EVIDENCE_CHANGE':'NO_PREVIOUS_OUTPUT'};row.storyKey=storyKey(f,row.comparison);
  for(const [key,a] of groups){const weight=policy.weights[key];row.dimensions.push({dimension:key,points:weight*Math.min(a.strength,policy.strengthCap)/policy.strengthCap,strength:a.strength,cap:policy.strengthCap,weight,kind:a.kind,evidenceIds:a.evidenceIds});}
  row.dimensions.push({dimension:'CROSS_METRIC_CONFIRMATION',points:policy.crossMetricPoints*Math.min(groups.size-1,policy.crossMetricCap),families:[...groups.keys()]});
  row.dimensions.push({dimension:previous?'MATERIAL_CHANGE':'EVENT_NOVELTY',points:policy.noveltyPoints,evidenceIds:[...new Set(changes.flatMap(c=>c.evidenceIds))]});
  row.historicalRarity={status:'UNKNOWN',points:0,reason:'No complete prior anomaly observation denominator; sent-story frequency is not market rarity'};
  row.score=Number(row.dimensions.reduce((n,d)=>n+d.points,0).toFixed(6));row.status='QUALIFIED';row.reason='RESEARCH_GATE_AND_NOVELTY_PASSED';
 }
 const ranked=decisions.filter(d=>d.status==='QUALIFIED').sort((a,b)=>b.score-a.score||a.symbol.localeCompare(b.symbol,'en')),qualified=[];
 for(const row of ranked){if(seen.has(row.symbol)){row.status='DUPLICATE';row.reason='DUPLICATE_SYMBOL';}else{seen.add(row.symbol);qualified.push(row);}}
 qualified.forEach((d,i)=>{d.rank=i+1;d.status=i<policy.maxCandidates?'SELECTED':'QUALIFIED_BUT_NOT_SELECTED';d.reason=i<policy.maxCandidates?'TOP_K':'RANK_BELOW_TOP_K';});
 return {version:'DETERMINISTIC_SELECTOR_V1',policy:structuredClone(policy),decisions,selected:qualified.filter(d=>d.status==='SELECTED'),qualifiedCount:qualified.length};
}
export function eligibilityCompatibility(row){
 const {facts,...audit}=row;
 return {eligible:true,storyType:row.comparison.storyType,newsworthinessScore:row.score,reason:row.comparison.reason,keyEvidenceIds:[...new Set(row.dimensions.flatMap(d=>d.evidenceIds||[]))].slice(0,12),risks:[],storyAngle:'程序筛选的已验证异常；不构成方向判断',eligibilitySource:'DETERMINISTIC_SELECTOR_V1',selection:audit};
}
