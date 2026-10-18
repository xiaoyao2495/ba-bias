// Web-only aggregation of saved research. No detector, scoring, scheduler or write imports.
export const WATCH_HOUR=3600000;
export function watchWindow(now){
 if(!Number.isSafeInteger(now)||now<3*WATCH_HOUR)throw Error('INVALID_WATCH_CLOCK');
 const anchor=Math.floor(now/WATCH_HOUR)*WATCH_HOUR;
 // Asia/Shanghai is UTC+8 with hourly boundaries matching UTC boundaries.
 const slots=Array.from({length:4},(_,i)=>{const scheduledAt=anchor-(3-i)*WATCH_HOUR,s=new Date(scheduledAt+8*WATCH_HOUR).toISOString();return {scheduledAt,runId:`hourly_${s.slice(0,10).replaceAll('-','')}_${s.slice(11,13)}00`};});
 return {version:'4H_MARKET_WATCH_V1',timeZone:'Asia/Shanghai',schedule:'0 * * * *',windowMeaning:'FOUR_SCHEDULED_HOURLY_SLOTS',windowStart:slots[0].scheduledAt,windowEnd:anchor,observedAt:now,expectedSlots:4,slots};
}
export const watchScore=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0?v:null;
export function aggregateWatch(window,slots,observations){
 const grouped=new Map(),seen=new Set();
 for(const o of observations){const key=o.symbol+'/'+o.runId;if(seen.has(key))continue;seen.add(key);if(!grouped.has(o.symbol))grouped.set(o.symbol,[]);grouped.get(o.symbol).push(o);}
 const items=[...grouped].map(([symbol,rows])=>{
  rows.sort((a,b)=>b.researchTime-a.researchTime||b.scheduledAt-a.scheduledAt||a.runId.localeCompare(b.runId,'en'));
  const latest=rows[0],scores=rows.map(r=>r.score).filter(v=>watchScore(v)!==null),highestScore=scores.length?Math.max(...scores):null;
  return {symbol,firstSeenAt:Math.min(...rows.map(r=>r.scheduledAt)),latestResearchAt:latest.researchTime,occurrenceCount:rows.length,highestScore,scoreStatus:highestScore===null?'MISSING':'AVAILABLE',scoreSourceRunIds:rows.filter(r=>highestScore!==null&&r.score===highestScore).map(r=>r.runId),latestBias:latest.bias,latestRunId:latest.runId,anomalyTypes:latest.anomalyTypes,dataCutoff:latest.dataCutoff,stale:window.observedAt-latest.dataCutoff>2*WATCH_HOUR,metrics:latest.metrics,runIds:rows.map(r=>r.runId),occurrences:rows};
 }).sort((a,b)=>(a.highestScore===null)-(b.highestScore===null)||(b.highestScore??0)-(a.highestScore??0)||b.latestResearchAt-a.latestResearchAt||(a.symbol<b.symbol?-1:a.symbol>b.symbol?1:0));
 const completed=slots.filter(s=>['COMPLETE','PARTIAL'].includes(s.status)),lastValidScanAt=completed.length?Math.max(...completed.map(s=>s.dataCutoff)):null;
 const counts={completed:completed.length,complete:slots.filter(s=>s.status==='COMPLETE').length,partial:slots.filter(s=>s.status==='PARTIAL').length,failed:slots.filter(s=>['FAILED','INTERRUPTED'].includes(s.status)).length,missing:slots.filter(s=>s.status==='MISSING').length,skipped:slots.filter(s=>s.status.startsWith('SKIPPED_')).length,running:slots.filter(s=>s.status==='RUNNING').length,incomplete:slots.filter(s=>s.status==='INCOMPLETE').length,invalid:slots.filter(s=>s.status==='INVALID').length};
 return {...window,slots,counts,lastValidScanAt,stale:lastValidScanAt===null||window.observedAt-lastValidScanAt>2*WATCH_HOUR,totalSymbols:items.length,limit:10,sortRule:'HIGHEST_VALID_SELECTOR_SCORE_DESC__LATEST_RESEARCH_DESC__SYMBOL_ASC; MISSING_SCORES_LAST',occurrenceMeaning:'VALIDATED_LIVE_RESEARCH_PER_SYMBOL_PER_COMPLETED_SLOT; NOT_CONTINUING_STRENGTH',items:items.slice(0,10),emptyState:items.length?null:completed.length?'NO_VALID_RESEARCH':'NO_COMPLETED_SLOTS'};
}
