// Observability only: never selects candidates, calculates scores, or makes requests.
const family=k=>k.startsWith('PRICE')?'PRICE_EXTREMITY':k.startsWith('OI_')?'OI_ABNORMALITY':k.startsWith('FUNDING')?'FUNDING_EXTREMITY':k==='VOLUME_SPIKE'?'VOLUME_ABNORMALITY':/ACCOUNT|POSITION|DIVERGENCE/.test(k)?'ACCOUNT_DISTRIBUTION':null;
export function scanDiagnostics({runId,scheduledAt=null,cutoff,symbols,now=Date.now}){
 const rows=symbols.map(s=>({symbol:s.symbol,identity:null,liquidity:null,trigger:null,rotation:null,accountDiscovery:{status:'NOT_EVALUATED',reason:'DISCOVERY_NOT_COMPLETED'},deep:{planned:false,channels:[],status:'NOT_PLANNED',startedAt:null,finishedAt:null,factsSaved:false,factsComplete:null,anomalyCount:null,reason:null,sourceErrors:[]}}));
 return {version:'BA_BIAS_RUN_DIAGNOSTICS_V1',runId,scheduledAt,evaluationTime:cutoff,startedAt:now(),finishedAt:null,complete:false,accountCoverage:null,counts:{universe:symbols.length},rows};
}
export function scanCounts(d){
 const c={universe:d.rows.length,identityEligible:0,liquidityEligible:0,triggerMatched:0,triggerSelected:0,rotationSelected:0,accountAnomalies:0,accountAdded:0,accountNotEvaluated:0,accountInsufficient:0,plannedDeep:0,startedDeep:0,factsSaved:0,completeFacts:0,factsIncomplete:0,noAnomaly:0,deepFailed:0,sourceRequestFailures:0,plannedNotStarted:0,selectorInput:0};
 for(const r of d.rows){const x=r.deep;
  if(r.identity?.eligible)c.identityEligible++;if(r.liquidity?.eligible)c.liquidityEligible++;if(r.trigger?.matched)c.triggerMatched++;if(r.trigger?.selected)c.triggerSelected++;if(r.rotation?.selected)c.rotationSelected++;
  const a=r.accountDiscovery;if(a.status==='ANOMALY')c.accountAnomalies++;if(a.status==='NOT_EVALUATED'||a.status==='NOT_COVERED')c.accountNotEvaluated++;if(a.status==='INSUFFICIENT_DATA'||a.status==='ANOMALY'&&a.complete===false)c.accountInsufficient++;
  if(x.channels.includes('ACCOUNT_ANOMALY')&&!x.channels.some(k=>k==='TRIGGER'||k==='ROTATION'))c.accountAdded++;
  if(x.planned)c.plannedDeep++;if(x.startedAt!==null)c.startedDeep++;if(x.factsSaved)c.factsSaved++;if(x.factsComplete===true)c.completeFacts++;if(x.factsSaved&&x.factsComplete===false)c.factsIncomplete++;if(x.status==='COMPLETE_NO_ANOMALY')c.noAnomaly++;if(x.status==='FAILED')c.deepFailed++;c.sourceRequestFailures+=x.sourceErrors.length;if(x.planned&&x.startedAt===null)c.plannedNotStarted++;if(x.factsComplete===true&&x.anomalyCount>0)c.selectorInput++;
 }if(!d.accountCoverage){c.accountAnomalies=null;c.accountInsufficient=null;}c.accountRequested=d.accountCoverage?.requested??null;return c;
}
export function createRunDiagnostics({runId,scheduledAt=null,now=Date.now}){return {version:'BA_BIAS_RUN_DIAGNOSTICS_V1',runId,scheduledAt,startedAt:now(),finishedAt:null,scan:null,selector:null,candidates:[],complete:false,limitations:['No extra market requests. Uncovered discovery is not evidence of no anomaly. Counts describe observed stages, not hypothetical full-market eligibility.']};}
export function recordSelection(d,selection){
 d.selector={version:selection.version,policy:selection.policy};
 d.candidates=selection.decisions.map(r=>{
  const groups=new Map();for(const a of r.facts?.anomalies||[]){const k=family(a.kind);if(!k)continue;const old=groups.get(k);if(!old||a.strength>old.strength)groups.set(k,{family:k,strength:a.strength,kind:a.kind,evidenceIds:a.evidenceIds});}
  const scored=r.score!==null&&r.score!==undefined;
  return {runId:d.runId,symbol:r.symbol,factsComplete:r.facts?.dataCompleteness?.eligible??null,events:(r.facts?.anomalies||[]).map(a=>({kind:a.kind,scope:a.scope??null,window:a.window??null,rawValue:a.value,threshold:a.threshold??null,strength:a.strength,evidenceIds:a.evidenceIds})),families:[...groups.values()],gate:r.gate?{...r.gate,passed:r.gate.extreme||r.gate.resonance}:null,gateReason:r.reason==='BELOW_RESEARCH_GATE'?r.reason:null,materialUpdate:r.materialEvidence?{passed:r.materialEvidence.length>0,evidence:r.materialEvidence,storyType:r.comparison?.storyType??null}:null,score:scored?r.score:null,dimensions:r.dimensions,rank:r.rank??null,status:r.status,reason:r.reason,selected:r.status==='SELECTED',v2:{pipelineEntered:false,attempted:false,requestRecords:0,physicalRequests:0,technicalState:'NOT_STARTED',reason:r.status==='SELECTED'?'AWAITING_ANALYST':r.reason}};
 });
}
export function recordResearch(d,symbol,{entered=false,research,records=[],evaluation}={}){
 const row=d?.candidates.find(r=>r.symbol===symbol&&r.selected);if(!row)return;
 const v=row.v2;v.pipelineEntered ||= entered;v.requestRecords+=records.length;v.physicalRequests+=records.reduce((n,r)=>n+(r.physicalRequests||0),0);v.attempted=v.requestRecords>0;
 if(research){v.technicalState=research.executionState;v.reason=research.error?.code??research.reviewStatus;v.recordId=research.recordId;v.decisionCompletedAt=research.asOf?.decisionCompletedAt??null;}
 if(evaluation){v.pipelineStatus=evaluation.status??null;v.pipelineReason=evaluation.reason;v.persistedAndReady=evaluation.status==='RESEARCH_READY';}
 if(!research&&evaluation){v.technicalState=v.attempted?'FAILED':'NOT_EVALUATED';v.reason=evaluation.reason;}
}
export function finishRunDiagnostics(d,result,{now=Date.now}={}){
 d.finishedAt=now();d.runStatus=result.status;d.complete=true;
 if(d.scan){d.scan.counts=scanCounts(d.scan);if(!d.scan.complete){d.scan.interruptionReason=result.status==='INTERRUPTED'?'RUN_INTERRUPTED_OR_TIMEOUT':'SCAN_DID_NOT_COMPLETE';for(const r of d.scan.rows)if(r.deep.planned&&r.deep.startedAt===null)r.deep.reason=d.scan.interruptionReason;}}
 const evaluations=new Map((result.candidateEvaluations||[]).map(e=>[e.symbol,e]));
 for(const row of d.candidates){if(!row.selected||['VALIDATED','UNAVAILABLE','FAILED'].includes(row.v2.technicalState))continue;const e=evaluations.get(row.symbol);row.v2.technicalState='NOT_EVALUATED';row.v2.reason=e?.reason||'RUN_ENDED_BEFORE_RESEARCH';}
 d.counts={scan:d.scan?.counts??null,selector:d.selector?{evaluated:d.candidates.length,gatePassed:d.candidates.filter(r=>r.gate?.passed).length,historyPassed:d.candidates.filter(r=>r.materialUpdate?.passed).length,qualified:d.candidates.filter(r=>r.status==='SELECTED'||r.status==='QUALIFIED_BUT_NOT_SELECTED').length,selected:d.candidates.filter(r=>r.selected).length,qualifiedNotSelected:d.candidates.filter(r=>r.status==='QUALIFIED_BUT_NOT_SELECTED').length}:null,research:{attempted:d.candidates.filter(r=>r.v2.attempted).length,succeeded:d.candidates.filter(r=>r.v2.technicalState==='VALIDATED'&&r.v2.persistedAndReady).length,unavailable:d.candidates.filter(r=>r.v2.technicalState==='UNAVAILABLE').length,failed:d.candidates.filter(r=>r.v2.technicalState==='FAILED'||r.selected&&['DATA_ERROR','INSUFFICIENT_EVIDENCE'].includes(r.v2.pipelineStatus)).length,notEvaluated:d.candidates.filter(r=>r.selected&&r.v2.technicalState==='NOT_EVALUATED').length}};
 return d;
}
