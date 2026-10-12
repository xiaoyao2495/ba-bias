import fs from 'node:fs/promises';
import path from 'node:path';
import {sanitize} from './security.js';
export const RUN=/^[A-Za-z0-9_-]{1,100}$/;
export const SYMBOL=/^[\p{L}\p{N}]{1,40}USDT$/u;
export const DIRECTIONS={BULLISH:'偏多延续',BEARISH:'偏空延续',BULLISH_REVERSAL:'偏多反转',BEARISH_REVERSAL:'偏空反转',NO_EDGE:'暂无方向优势',ANALYST_UNAVAILABLE:'研判不可用'};
export function validate(value,kind){if(!(kind==='run'?RUN:SYMBOL).test(value))throw Object.assign(Error('INVALID_'+kind.toUpperCase()),{status:400});return value;}
const pick=(o,keys)=>Object.fromEntries(keys.map(k=>[k,o?.[k]??null]));
const time=r=>r?.scheduledAt??r?.startedAt??r?.evaluationTime??null;
export class Reader{
 constructor(dataDir,{now=Date.now,secrets=[],ttl=10000,maxEntries=500,maxFileBytes=16*1024*1024,maxHistoryBytes=maxFileBytes}={}){this.root=path.resolve(dataDir);this.now=now;this.secrets=secrets;this.ttl=ttl;this.maxEntries=maxEntries;this.maxFileBytes=maxFileBytes;this.maxHistoryBytes=maxHistoryBytes;this.cache=new Map();this.pending=new Map();this.index=null;this.indexAt=0;this.namesCache=new Map();this.readCount=0;}
 async contained(relative){
  if(path.isAbsolute(relative)||relative.split(/[\\/]/).includes('..'))throw Error('PATH_REJECTED');
  const target=path.resolve(this.root,relative);if(!target.startsWith(this.root+path.sep))throw Error('PATH_REJECTED');
  const [base,real]=await Promise.all([fs.realpath(this.root),fs.realpath(target)]);if(!real.startsWith(base+path.sep))throw Error('PATH_REJECTED');return target;
 }
 async json(relative){
  const cached=this.cache.get(relative);if(cached&&this.now()-cached.at<this.ttl)return cached.result;
  if(this.pending.has(relative))return this.pending.get(relative);
  const p=(async()=>{let result;try{const target=await this.contained(relative),before=await fs.stat(target);if(!before.isFile()||before.size>(relative==='state/history.json'?this.maxHistoryBytes:this.maxFileBytes))throw Error('FILE_TOO_LARGE');const text=await fs.readFile(target,'utf8');this.readCount++;const after=await fs.stat(target);if(before.size!==after.size||before.mtimeMs!==after.mtimeMs)throw Error('SNAPSHOT_CHANGING');const value=JSON.parse(text);if(!value||typeof value!=='object')throw Error('INVALID_JSON_RECORD');result={value,error:null};}catch(e){result={value:null,error:e.code==='ENOENT'?'MISSING':e.code==='EACCES'?'READ_PERMISSION_DENIED':e instanceof SyntaxError?'CORRUPT_JSON':['PATH_REJECTED','FILE_TOO_LARGE','SNAPSHOT_CHANGING','INVALID_JSON_RECORD'].includes(e.message)?e.message:'READ_FAILED'};}
   if(this.cache.size>=this.maxEntries)this.cache.delete(this.cache.keys().next().value);this.cache.set(relative,{at:this.now(),result});return result;
  })();this.pending.set(relative,p);try{return await p;}finally{this.pending.delete(relative);}
 }
 async names(relative){const c=this.namesCache.get(relative);if(c&&this.now()-c.at<this.ttl)return c.value;let value=[];try{const target=await this.contained(relative);value=await fs.readdir(target);}catch{}if(this.namesCache.size>=500)this.namesCache.delete(this.namesCache.keys().next().value);this.namesCache.set(relative,{at:this.now(),value});return value;}
 async runsIndex(){
  if(this.index&&this.now()-this.indexAt<this.ttl)return this.index;
  if(this.indexPending)return this.indexPending;
  this.indexPending=(async()=>{const h=await this.json('state/history.json'),entries=new Map();for(const [id,r]of Object.entries(h.value?.runs||{}))if(RUN.test(id))entries.set(id,{runId:id,...pick(r,['status','scheduledAt','startedAt','finishedAt','generated','sent']),indexTime:time(r)});
   const dirs=await this.names('runs'),unknown=dirs.filter(id=>RUN.test(id)&&!entries.has(id));
   // Bounded orphan discovery; established production history is the authoritative index.
   for(const id of unknown.slice(0,100)){const r=await this.json(`runs/${id}/result.json`);if(r.value?.runId===id)entries.set(id,{...pick(r.value,['runId','status','scheduledAt','startedAt','finishedAt','generated','sent']),indexTime:time(r.value)});else entries.set(id,{runId:id,status:'UNKNOWN',indexTime:null,readError:r.error});}
   this.index={items:[...entries.values()].sort((a,b)=>(b.indexTime??-Infinity)-(a.indexTime??-Infinity)||a.runId.localeCompare(b.runId)),indexError:h.error,unindexedBeyondLimit:Math.max(0,unknown.length-100)};this.indexAt=this.now();return this.index;
  })();try{return await this.indexPending;}finally{this.indexPending=null;}
 }
 clean(v){return sanitize(v,this.secrets);}
 async result(id){validate(id,'run');const r=await this.json(`runs/${id}/result.json`);if(r.value?.runId!==id)return {value:null,error:r.error||'RUN_ID_MISMATCH'};return r;}
 async selections(id){validate(id,'run');const names=(await this.names(`runs/${id}/selection`)).filter(n=>n.endsWith('.json')&&SYMBOL.test(n.slice(0,-5)));const rows=[],errors=[];
  for(const name of names.slice(0,1500)){const r=await this.json(`runs/${id}/selection/${name}`),s=name.slice(0,-5);if(r.value?.symbol!==s){errors.push({symbol:s,error:r.error||'SYMBOL_MISMATCH'});continue;}rows.push(this.clean(pick(r.value,['symbol','status','reason','score','rank','gate','dimensions','materialEvidence','comparison','historicalRarity'])));}
  rows.sort((a,b)=>(a.rank??Infinity)-(b.rank??Infinity)||a.symbol.localeCompare(b.symbol,'en'));return {rows,errors,available:names.length>0,source:'saved production selection; no recomputation',truncated:names.length>1500};
 }
 async outboxes(id){validate(id,'run');const names=(await this.names('outbox')).filter(n=>n.startsWith(id+'_')&&n.endsWith('.json')&&SYMBOL.test(n.slice(id.length+1,-5)));const result=[];
  for(const name of names.slice(0,1500)){const r=await this.json(`outbox/${name}`);if(r.value?.runId===id&&r.value.symbol===name.slice(id.length+1,-5))result.push(r.value);}
  return result;
 }
 async run(id){const record=await this.result(id);if(!record.value)throw Object.assign(Error(record.error==='MISSING'?'RUN_NOT_FOUND':record.error),{status:record.error==='MISSING'?404:422});
  const r=record.value,[selector,boxes]=await Promise.all([this.selections(id),this.outboxes(id)]),newSelector=r.selector?.version==='DETERMINISTIC_SELECTOR_V1';
  const counters={scanned:r.scannedSymbols??null,facts:r.factPackagesCount??null,selectorEvaluated:newSelector?r.selectorEvaluated??null:null,hardGatePassed:selector.available?selector.rows.filter(x=>x.gate?.extreme||x.gate?.resonance).length:null,noMaterial:selector.available?selector.rows.filter(x=>['NO_MATERIAL_UPDATE','DUPLICATE'].includes(x.status)).length:null,qualified:newSelector?r.selector?.qualifiedCount??null:null,selected:newSelector?r.selector?.selected?.length??null:null,v4Valid:r.directionalAnalyses!=null&&r.directionalFailures!=null&&r.analystVersion==='V4'?r.directionalAnalyses-r.directionalFailures:null,v4Failed:r.analystVersion==='V4'?r.directionalFailures??null:null,outbox:r.generated??null,sent:r.sent??null};
  return this.clean({record:pick(r,['runId','status','mode','triggerType','scheduledAt','startedAt','finishedAt','evaluationTime','dataCutoff','totalDurationMs','errors','rejections','candidateEvaluations','selector','analystVersion','analystCost','deepseekUsage','unassessedCandidates','scanBudgetExceeded']),counters,selector,dataSource:newSelector?'DETERMINISTIC_SELECTOR_V1':'LEGACY_RUN_NO_SELECTOR_RANKING',delivery:boxes.map(o=>({symbol:o.symbol,storyType:o.storyType,generatedAt:o.generatedAt,directionalId:o.directional?.snapshotId,...pick(o.delivery,['deliveryId','status','acknowledgedAt','error','businessCode','parts'])})),noMessageReason:noMessageReason(r,boxes,counters),snapshotState:r.finishedAt!=null&&r.status!=='RUNNING'?'COMPLETED_RECORD':'IN_PROGRESS',cost:{...r.analystCost,usageStatus:r.analystCost?.usageStatus||'UNKNOWN',legacyRecordedUsage:r.analystCost?null:r.tokenUsage??null,moneyCost:null,moneyCostStatus:'UNKNOWN_NO_PRICING_RECORD'}});
 }
 async listRuns({page=1,limit=24,q='',status='',symbol='',notification='',v4='',delivery='',from='',to='',completedOnly=false}={}){
  const index=await this.runsIndex();let rows=index.items.filter(r=>(!completedOnly||(r.finishedAt!=null&&r.status!=='RUNNING'))&&(!q||r.runId.includes(q))&&(!status||r.status===status)&&(!notification||(notification==='yes'?r.sent>0:r.sent===0))&&(!from||r.indexTime>=Date.parse(from))&&(!to||r.indexTime<=Date.parse(to)));
  let filterPartial=false;
  if(symbol){validate(symbol,'symbol');const matched=[];for(const r of rows.slice(0,100)){const f=await this.json(`runs/${r.runId}/facts/${symbol}.json`);if(f.value?.symbol===symbol)matched.push(r);}filterPartial=rows.length>100;rows=matched;}
  if(v4||delivery){const matched=[];for(const r of rows.slice(0,100)){const detail=await this.run(r.runId).catch(()=>null);if(detail&&(!v4||(v4==='failed'?detail.counters.v4Failed>0:detail.counters.v4Valid>0))&&(!delivery||detail.delivery.some(d=>d.status===delivery)))matched.push(r);}filterPartial ||= rows.length>100;rows=matched;}
  const selected=rows.slice((page-1)*limit,page*limit),items=await Promise.all(selected.map(async r=>{const detail=await this.run(r.runId).catch(()=>null);return detail?{...r,...detail.record,counters:detail.counters,noMessageReason:detail.noMessageReason,dataSource:detail.dataSource}:r;}));
  return this.clean({items,total:rows.length,page,limit,filterPartial,indexError:index.indexError,unindexedBeyondLimit:index.unindexedBeyondLimit});
 }
 async research(id,symbol){validate(id,'run');validate(symbol,'symbol');const [result,fr,dr,sr,boxes]=await Promise.all([this.result(id),this.json(`runs/${id}/facts/${symbol}.json`),this.json(`runs/${id}/directional/${symbol}.json`),this.json(`runs/${id}/selection/${symbol}.json`),this.outboxes(id)]);
  const f=fr.value;if(!f)throw Object.assign(Error(fr.error==='MISSING'?'SYMBOL_NOT_FOUND':fr.error),{status:fr.error==='MISSING'?404:422});
  if(f.symbol!==symbol||f.runId!==id||f.dataCutoff!==result.value?.dataCutoff)throw Object.assign(Error('FACTS_RUN_OR_TIME_MISMATCH'),{status:422});
  if(f.schemaVersion!=='BA_BIAS_FACTS_V1')throw Object.assign(Error('UNSUPPORTED_FACTS_SCHEMA'),{status:422});
  const box=boxes.find(x=>x.symbol===symbol),reference=box?.directional?.snapshotId||result.value?.candidateEvaluations?.find(x=>x.symbol===symbol)?.directionalId;
  let snap=null;if(reference&&/^[a-f0-9]{32}$/.test(reference))snap=(await this.json(`directional/${reference}.json`)).value;
  if(snap&&(snap.runId!==id||snap.symbol!==symbol||snap.evaluationTime!==f.dataCutoff))snap=null;
  const d=dr.value;const analysis=analystView(d,snap,symbol,f.dataCutoff),selection=sr.value?.symbol===symbol?pick(sr.value,['symbol','status','reason','score','rank','gate','dimensions','historicalRarity','materialEvidence']):null;
  const evidence=(f.evidence||[]).map(e=>({...pick(e,['evidenceId','endpoint','params','dataTimes','timestampMeaning','formula','result','phrase']),unit:unitFor(e.evidenceId),role:analysis.supportingEvidenceIds.includes(e.evidenceId)?'SUPPORTING':analysis.conflictingEvidenceIds.includes(e.evidenceId)?'CONFLICTING':'FACT',event:(f.anomalies||[]).filter(a=>a.evidenceIds?.includes(e.evidenceId)).map(a=>pick(a,['kind','strength']))}));
  // Directional builder evidence (e.g. previous price window) is distinct, and comes from the stored input.
  for(const e of d?.input?.evidence||snap?.input?.evidence||[])if(!evidence.some(x=>x.evidenceId===e.evidenceId))evidence.push({...pick(e,['evidenceId','type','unit','scope','window','dataTimes','observedAt','semanticDescription']),result:e.value,role:analysis.supportingEvidenceIds.includes(e.evidenceId)?'SUPPORTING':analysis.conflictingEvidenceIds.includes(e.evidenceId)?'CONFLICTING':'FACT',source:'saved V4 input; not regenerated'});
  return this.clean({runId:id,symbol,evaluationTime:f.evaluationTime,dataCutoff:f.dataCutoff,schemaVersion:f.schemaVersion,identity:f.identity,metrics:metrics(f),anomalies:f.anomalies,longShort:longShortView(f.longShort),selection,analysis,evidence,delivery:box?{...pick(box.delivery,['deliveryId','status','acknowledgedAt','parts']),generatedAt:box.generatedAt}:null,storyType:box?.storyType??null,whatChanged:box?.intelligence?.whatChanged??null,newEvidence:box?.intelligence?.newEvidence??null,whyMaterial:box?.intelligence?.whyMaterial??null,unconfirmed:box?.intelligence?.unconfirmed??null,observations:box?.intelligence?.observations??null,message:{text:snap?.deterministicText??d?.deterministicText??null,source:'saved V4 deterministicText; not the complete sent message',article:box?.article?.text??null,articleSource:'saved article snapshot; may differ from delivery parts',parts:box?.delivery?.parts??null},warnings:f.warnings??[],dataCompleteness:f.dataCompleteness,readErrors:{analyst:dr.error,selection:sr.error}});
 }
 async symbolTimeline(symbol,{page=1,limit=20,completedOnly=false}={}){validate(symbol,'symbol');const idx=await this.runsIndex(),nodes=[];let inspected=0;
  // Bounded read per page, no full Facts histories in response. Directory membership is cheap.
  const ids=[];for(const r of idx.items.slice(0,500)){if(completedOnly&&(r.finishedAt==null||r.status==='RUNNING'))continue;const names=await this.names(`runs/${r.runId}/facts`);if(names.includes(symbol+'.json'))ids.push(r.runId);}
  for(const id of ids.slice((page-1)*limit,page*limit)){inspected++;try{const detail=await this.research(id,symbol);nodes.push(detail);}catch(e){nodes.push({runId:id,symbol,error:e.message});}}
  nodes.sort((a,b)=>(b.dataCutoff??0)-(a.dataCutoff??0));
  for(let i=0;i<nodes.length-1;i++){const current=nodes[i],older=nodes.slice(i+1).find(n=>n.analysis?.status==='VALIDATED');if(current.analysis?.status==='VALIDATED'&&older&&current.dataCutoff>older.dataCutoff&&current.analysis.horizon===older.analysis.horizon&&current.analysis.direction!==older.analysis.direction)current.directionChange={previous:older.analysis.direction,current:current.analysis.direction,previousRunId:older.runId,meaning:'saved same-horizon research evolution; not confirmed trend reversal'};}
  return {items:nodes,page,limit,total:ids.length,inspected,coverage:idx.items.length>500?'PARTIAL_RECENT_500_RUNS':'COMPLETE'};
 }
 async overview(){const idx=await this.runsIndex(),latest=idx.items[0];if(!latest)return {latest:null,researchRun:null,cards:[],emptyState:'尚无历史运行记录',lastSuccessfulAt:null};
  const run=await this.run(latest.runId).catch(()=>null);let cards=[],researchRun=null;
  // Keep the latest run and last valid research visibly separate, never mix their counters.
  for(const row of idx.items.slice(0,24)){const r=await this.result(row.runId);if(!r.value?.finishedAt||r.value.status==='RUNNING')continue;const boxes=await this.outboxes(row.runId),valid=boxes.filter(b=>b.directional?.analystVersion==='V4'&&b.directional.status==='VALIDATED');if(valid.length){researchRun=row.runId;for(const b of valid.slice(0,3))cards.push(await this.research(row.runId,b.symbol).catch(()=>({symbol:b.symbol,error:'READ_FAILED'})));break;}}
  const lastSuccessful=idx.items.find(r=>r.status==='COMPLETE');return {latest:run,researchRun,cards,emptyState:run?.noMessageReason||'原因未能确定',lastSuccessfulAt:lastSuccessful?.finishedAt??null,stale:run?.record.dataCutoff==null?null:this.now()-run.record.dataCutoff>2*3600000};
 }
}
export function unitFor(id=''){return /change\d+h|funding.change/.test(id)?'百分点':/volume.relative/.test(id)?'×':/price\.(?:closed|rolling|range|drawdown)|oi\.|funding|Account|Position|\.long|\.short/.test(id)?'%':null;}
export function metrics(f){const e=(v,unit,meaning)=>v?{value:v.result??null,unit,meaning,evidenceId:v.evidenceId??null,dataTimes:v.dataTimes??null}:null;return {price1h:e(f.price?.closedWindows?.['1h'],'%','closed rolling 1h'),price4h:e(f.price?.closedWindows?.['4h'],'%','closed rolling 4h'),price24h:e(f.price?.closedWindows?.['24h'],'%','closed rolling 24h'),priceRolling24h:e(f.price?.rolling24h,'%','ticker rolling 24h; distinct window'),oi1h:e(f.openInterest?.windows?.['1h'],'%','sumOpenInterest quantity, exact 1h'),oi4h:e(f.openInterest?.windows?.['4h'],'%','sumOpenInterest quantity, exact 4h'),oi24h:e(f.openInterest?.windows?.['24h'],'%','sumOpenInterest quantity, exact 24h'),volume1h:e(f.volume?.relative1h,'×','closed 1h volume / previous 24 bars mean'),fundingSettled:e(f.funding?.settledLatest,'%','actual settlement'),fundingDisplay:e(f.funding?.currentDisplay,'%','display snapshot; not settlement'),globalLong:f.longShort?.global?.latestLongAccountPct??null,topAccountLong:f.longShort?.topAccounts?.latestLongAccountPct??null};}
export function analystView(d,snap,symbol,cutoff){
 const record=d||snap,a=record?.analysis??record?.originalAnalysis,valid=record?.analystVersion==='V4'&&(record.status==='VALIDATED'||record.analystStatus==='VALIDATED')&&a?.symbol===symbol&&Date.parse(a.evaluationTime)===cutoff&&DIRECTIONS[a.direction];
 if(!valid)return {status:'ANALYST_UNAVAILABLE',direction:'ANALYST_UNAVAILABLE',label:DIRECTIONS.ANALYST_UNAVAILABLE,horizon:null,conviction:null,supportingEvidenceIds:[],conflictingEvidenceIds:[],errors:record?.validation?.errors??record?.attempts?.flatMap(x=>x.errors||[])??[],failureReason:record?.failureReason??null,legacy:record?.analystVersion!==undefined&&record.analystVersion!=='V4'};
 return {status:'VALIDATED',direction:a.direction,label:DIRECTIONS[a.direction],horizon:a.horizon??null,conviction:a.conviction??null,supportingEvidenceIds:a.supportingEvidenceIds??[],conflictingEvidenceIds:a.conflictingEvidenceIds??[],reassessmentConditions:a.reassessmentConditions??[],invalidation:a.direction==='NO_EDGE'?null:a.invalidation??null,rendered:a.direction==='NO_EDGE'?{...record.rendered,invalidationDescription:'仅重新评估已保存的条件；NO_EDGE没有方向命题失效。'}:record.rendered??null,originalAnalysis:pick(a,['version','symbol','evaluationTime','direction','horizon','conviction','supportingEvidenceIds','conflictingEvidenceIds','structureEvidenceIds','mechanismHypothesis','directionalRationale','tradeOpportunity','reassessmentConditions']),generatedAt:record.time?.analystCompletedAt??null,causalBacktestEligible:false,errors:[]};
}
export function noMessageReason(r,boxes,c){
 if(r.status==='RUNNING'||r.finishedAt==null)return '本轮尚未完成';
 if(r.errors?.some(e=>e.stage==='scan')||r.status==='FAILED'&&r.factPackagesCount===0)return '扫描失败';
 if(boxes.some(b=>b.delivery?.status==='UNKNOWN'||b.delivery?.status==='SENDING'))return '投递状态未知';
 if(boxes.some(b=>b.delivery?.status==='FAILED'))return 'Outbox投递失败';
 if(boxes.some(b=>b.delivery?.status==='PENDING'))return 'Outbox待投递';
 if(c.sent>0)return '已确认投递（不代表用户已阅读）';
 if(c.selected===0){if(c.qualified>0)return 'Top K为0';if(c.noMaterial>0&&c.noMaterial===c.hardGatePassed)return '全部没有实质更新';if(c.hardGatePassed===0&&c.selectorEvaluated>0)return '全部未通过研究门槛';return '本轮没有合格异常';}
 if(c.v4Failed>0&&c.v4Valid===0)return '本轮V4全部失败';
 if(c.outbox===0&&c.selected>0)return 'Outbox没有创建';
 if(boxes.length&&boxes.every(b=>b.delivery?.status==='SHADOW'))return '仅保存SHADOW，未请求投递';
 if(r.status==='COMPLETE'&&c.selectorEvaluated===0)return '正常完成且没有候选';
 if(r.candidateEvaluations?.some(e=>e.status==='JUDGE_FAILED'))return '旧运行Story Judge失败，未执行新Selector';
 return '原因未能确定';
}

export function longShortView(ls){return ls?Object.fromEntries(Object.entries(ls).map(([k,v])=>[k,v&&typeof v==='object'?pick(v,['scope','symbol','period','dataTimestamp','sampleStart','sampleEnd','quality','latestLongAccountPct','latestShortAccountPct','topLongPositionShare','topShortPositionShare','longAccountChange1hPp','longAccountChange4hPp','longAccountChange24hPp','topLongPositionShareChange1hPp','topLongPositionShareChange4hPp','topLongPositionShareChange24hPp','currentDominantSide','previousDominantSide','flip','valueUnit','changeUnit']):v])):null;}
