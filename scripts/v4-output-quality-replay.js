import {pathToFileURL as retiredAuditEntryURL} from 'node:url';
// Immutable old reports are retained; this legacy replay CLI cannot run after hard cutover.
if(process.argv[1]&&import.meta.url===retiredAuditEntryURL(process.argv[1]).href)throw Error('LEGACY_REPLAY_RETIRED_USE_V2_OFFLINE_TESTS');
// Offline, read-only production audit. No scanner, model client, or queue drain.
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {compactIntelligenceText} from '../src/intelligence/compact-renderer.js';
import {splitMessage} from '../src/storage/delivery-queue.js';
import {compare} from '../src/storage/history.js';
import {config} from '../src/config.js';
import {verifiedFacts} from '../src/intelligence/packet.js';
import {flipRole,comparisonBaseline} from '../src/intelligence/notification-evidence.js';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url))),dir=path.join(root,'validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1'),runId='hourly_20261011_1200';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
async function original(rel){let source=await fs.readFile(path.join(dir,'code-backup',rel),'utf8');source=source.replace(/from '([^']+)'/g,(_,r)=>`from '${r.startsWith('.')?new URL(r,new URL(rel,'file://'+root+'/')).href:import.meta.resolve(r)}'`);return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));}
const oldRenderer=await original('src/intelligence/compact-renderer.js'),oldQueue=await original('src/storage/delivery-queue.js'),oldHistory=await original('src/storage/history.js');
const files=(await fs.readdir(path.join(root,'data/outbox'))).filter(f=>f.endsWith('.json')),boxes=await Promise.all(files.map(f=>read(path.join(root,'data/outbox',f))));

function triggerEvidence(current,previous,{old=false}={}){
 if(!previous)return [{type:'FIRST_OUTPUT',basis:'NO_PREVIOUS_OUTPUT'}];
 const b=previous.summary,rows=[],add=(metric,kind,now,prior)=>rows.push({metric,kind,previous:prior,current:now,previousRunId:previous.runId,previousObservedAt:previous.lastResearchTime,comparisonSnapshotId:previous.storyKey});
 for(const [k,t] of [['price',15],['oi',10],['oi1',10],['oi24',10],['funding',0.05]]){
  if(!Number.isFinite(current[k])||!Number.isFinite(b[k]))continue;
  if(['price','oi','funding'].includes(k)&&Math.sign(current[k])!==Math.sign(b[k]))add(k,'EXISTING_SIGN_CHANGE_RULE',current[k],b[k]);
  if(Math.abs(current[k]-b[k])>=t)add(k,'EXISTING_DELTA_RULE',current[k],b[k]);
 }
 const kinds=x=>x.filter(k=>old||k!=='ACCOUNT_DOMINANCE_FLIP');
 if(JSON.stringify(kinds(current.anomalies))!==JSON.stringify(kinds(b.anomalies)))add('anomalies','EXISTING_ANOMALY_SET_CHANGE',current.anomalies,b.anomalies);
 if(current.volume>=2&&Math.abs(current.volume-b.volume)>=2)add('volume','EXISTING_VOLUME_DELTA_RULE',current.volume,b.volume);
 const delta=(a,b)=>a!=null&&b!=null&&Math.abs(Number(a)-Number(b))>=config.longShort.thresholds.materialChangePp;
 for(const k of ['global','topAccounts','topPositions']){
  const a=current.longShort?.[k],o=b.longShort?.[k];if(!a||!o)continue;
  for(const metric of ['longPct','shortPct'])if(delta(a[metric],o[metric]))add(k+'.'+metric,'EXISTING_ACCOUNT_DELTA_RULE',a[metric],o[metric]);
  for(const h of ['1h','4h','24h'])if(delta(a.changes[h],o.changes[h]))add(k+'.change'+h,'EXISTING_ACCOUNT_DELTA_RULE',a.changes[h],o.changes[h]);
  if(a.dominantSide!==o.dominantSide)add(k+'.dominantSide','EXISTING_DOMINANT_SIDE_CHANGE',a.dominantSide,o.dominantSide);
  if(a.flip&&(old?JSON.stringify(a.flip)!==JSON.stringify(o.flip):flipRole(a.flip,o.flip,previous.lastResearchTime)!=='PREVIOUSLY_KNOWN_FLIP_CONTEXT'))add(k+'.flip','FLIP_IDENTITY_OR_STATE_CHANGE',a.flip,o.flip);
 }
 for(const k of ['gapPp','globalChange4hPp','topChange4hPp'])if(delta(current.longShort?.divergence?.[k],b.longShort?.divergence?.[k]))add('divergence.'+k,'EXISTING_DIVERGENCE_DELTA_RULE',current.longShort.divergence[k],b.longShort.divergence[k]);
 return rows;
}
function brokenBoundaries(text,parts){
 let offset=0;const ends=parts.slice(0,-1).map(p=>{offset+=p.split('\n').slice(3).join('\n').length;return offset;});
 const ranges=[...text.matchAll(/[+-]?\d+(?:\.\d+)?%?|[A-Za-z0-9_]+(?:[-/:.][A-Za-z0-9_]+)*|失效\/复核|交易观察|替代情景/gu)].map(m=>({start:m.index,end:m.index+m[0].length,token:m[0]}));
 return ends.flatMap(i=>ranges.filter(r=>i>r.start&&i<r.end).map(r=>({offset:i,token:r.token})));
}

const before=[],after=[],fidelity=[],counts={sameSign:0,oppositeSign:0,noEdge:0,invalid:0,horizon:{},conviction:{}};
for(const record of boxes.filter(r=>r.runId===runId).sort((a,b)=>a.symbol.localeCompare(b.symbol))){
 const fPath=path.join(root,'data/runs',runId,'facts',record.symbol+'.json'),dPath=path.join(root,'data/runs',runId,'directional',record.symbol+'.json');
 const facts=await read(fPath),v4=await read(dPath),canonical=verifiedFacts(facts),packet=structuredClone(record.intelligence),previousBox=boxes.find(b=>b.runId===packet.whatChanged.previousRunId&&b.symbol===record.symbol);
 const previous=previousBox?{summary:previousBox.summary,runId:previousBox.runId,storyKey:previousBox.storyKey,lastResearchTime:previousBox.evaluationTime,lastOutputTime:previousBox.generatedAt,evidenceIds:previousBox.evidenceIds}:null;
 const oldDecision=oldHistory.compare(canonical,previous),newDecision=compare(canonical,previous);
 packet.whatChanged={...packet.whatChanged,...comparisonBaseline(previous,facts.dataCutoff)};
 packet.flipEvents=Object.fromEntries(['global','topAccounts'].map(k=>[k,{role:flipRole(newDecision.current.longShort?.[k]?.flip,previous?.summary?.longShort?.[k]?.flip,previous?.lastResearchTime),eventTime:newDecision.current.longShort?.[k]?.flip?.timestamp??null}]));
 const oldText=oldRenderer.compactIntelligenceText(record.intelligence,record),newText=compactIntelligenceText(packet,record),id=record.delivery.deliveryId,oldFragments=record.delivery.parts.map(p=>p.content),diagnostics=[],newFragments=splitMessage(newText,{id,symbol:record.symbol,onBoundaryFallback:d=>diagnostics.push(d)});
 const body=parts=>parts.map(p=>p.split('\n').slice(3).join('\n')).join('');
 if(body(oldFragments)!==oldText)throw Error('OLD_OUTPUT_RECONSTRUCTION_MISMATCH:'+record.symbol);
 if(body(newFragments)!==newText)throw Error('NEW_OUTPUT_LOSS:'+record.symbol);
 const a=v4.envelope?.analysis,valid=v4.status==='VALIDATED',p1=Number(canonical.evidence.find(e=>e.evidenceId.endsWith(':price.closed1h'))?.result);
 const fidelityRow={symbol:record.symbol,valid,originalDirection:a?.direction??null,displayDirection:packet.directional.analysis?.marketBias??null,originalHorizon:a?.horizon??null,displayHorizon:packet.directional.analysis?.horizon??null,originalConviction:a?.conviction??null,displayConviction:packet.directional.analysis?.conviction??null,supportingEvidenceIds:a?.supportingEvidenceIds??[],conflictingEvidenceIds:a?.conflictingEvidenceIds??[],mechanism:a?.mechanismHypothesis??null,tradeOpportunity:a?.tradeOpportunity??null,p1};
 if(valid){if(a.direction!==fidelityRow.displayDirection||a.horizon!==fidelityRow.displayHorizon||a.conviction!==fidelityRow.displayConviction)throw Error('DIRECTION_CHANGED');counts.horizon[a.horizon]=(counts.horizon[a.horizon]||0)+1;counts.conviction[a.conviction]=(counts.conviction[a.conviction]||0)+1;if(a.direction==='NO_EDGE')counts.noEdge++;else if((a.direction.startsWith('BULLISH')?1:-1)===Math.sign(p1))counts.sameSign++;else counts.oppositeSign++;}else counts.invalid++;
 fidelity.push(fidelityRow);
 const kinds=[];if(valid&&a.direction==='NO_EDGE')kinds.push('NO_EDGE_SEMANTIC_CORRECTION');if(Math.max(oldFragments.length,newFragments.length)>1&&JSON.stringify(oldFragments)!==JSON.stringify(newFragments))kinds.push('FRAGMENT_BOUNDARY_CORRECTION');if(previous)kinds.push('COMPARISON_LABEL_CORRECTION');if(Object.values(packet.flipEvents).some(e=>e.eventTime))kinds.push('EVENT_FRESHNESS_CORRECTION');if(oldDecision.eligible!==newDecision.eligible)kinds.push('MATERIAL_UPDATE_EVIDENCE_CORRECTION');
 const changes=Object.entries(newDecision.current).filter(([k,v])=>JSON.stringify(v)!==JSON.stringify(previous?.summary[k])).map(([metric,current])=>({metric,previous:previous?.summary[metric]??null,current}));
 const eventDetails={};for(const k of ['global','topAccounts']){const s=facts.longShort[k];if(!s?.dominanceFlip)continue;const matching=boxes.filter(b=>b.symbol===record.symbol&&b.generatedAt<record.generatedAt&&b.summary?.longShort?.[k]?.flip?.timestamp===s.flip.timestamp);eventDetails[k]={...packet.flipEvents[k],rawFlip:s.flip,dataTimestamp:s.dataTimestamp,confirmationTime:s.flip.status==='CONFIRMED'?s.flip.timestamp+3600000:null,firstObservedAt:facts.sources[k==='global'?'accounts':'topAccounts']?.retrievedAt??null,previouslyOutputInRuns:matching.map(b=>b.runId)};}
 const base={symbol:record.symbol,originalRunId:runId,originalDeliveryId:id,originalStoryDecision:record.storyType,originalV4Direction:valid?a.direction:'INVALID',originalHorizon:valid?a.horizon:null,originalConviction:valid?a.conviction:null,OldDecision:{eligible:oldDecision.eligible,storyType:oldDecision.storyType,judgeEligible:record.approval.judgeEligible},NewDecision:{eligible:newDecision.eligible,storyType:newDecision.storyType,judgeEligible:record.approval.judgeEligible},qualificationChanged:oldDecision.eligible!==newDecision.eligible,OldTriggerEvidence:triggerEvidence(oldDecision.current,previous,{old:true}),NewTriggerEvidence:triggerEvidence(newDecision.current,previous),comparedFacts:changes,oldBoundaryViolations:brokenBoundaries(oldText,oldFragments),newBoundaryViolations:brokenBoundaries(newText,newFragments),eventDetails,comparisonBaseline:packet.whatChanged,originalNotificationReason:record.deduplication,oldNotificationReason:oldDecision.reason,newNotificationReason:newDecision.reason,changeClassification:kinds.length?kinds:['NO_CHANGE'],changedFields:kinds,changeReason:'消费端条件语义、比较时点、事件角色和无损分片；不改Facts、Judge及模型结果。',factsPath:fPath,v4Path:dPath,outboxPath:path.join(root,'data/outbox',`${runId}_${record.symbol}.json`),factsSha256:crypto.createHash('sha256').update(await fs.readFile(fPath)).digest('hex'),diagnostics};
 if(base.newBoundaryViolations.length)throw Error('NEW_UNSAFE_BOUNDARY:'+record.symbol);
 before.push({...base,oldRenderedText:oldText,oldFragmentCount:oldFragments.length,fragments:oldFragments});after.push({...base,newRenderedText:newText,newFragmentCount:newFragments.length,fragments:newFragments,lossless:true,originalDeliveryStatus:record.delivery.status});
}
await fs.writeFile(path.join(dir,'before_output_audit.json'),JSON.stringify(before,null,2)+'\n');await fs.writeFile(path.join(dir,'after_output_audit.json'),JSON.stringify(after,null,2)+'\n');await fs.writeFile(path.join(dir,'direction-output-audit.json'),JSON.stringify({counts,fidelity},null,2)+'\n');
console.log(JSON.stringify({runId,outputs:after.length,materialUpdates:after.filter(r=>r.originalStoryDecision==='MATERIAL_UPDATE').length,oldFragments:before.reduce((n,r)=>n+r.oldFragmentCount,0),newFragments:after.reduce((n,r)=>n+r.newFragmentCount,0),eligibilityChanges:after.filter(r=>r.qualificationChanged).map(r=>r.symbol),counts}));
