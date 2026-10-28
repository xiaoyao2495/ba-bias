// Display-only adapters: never score candidates, infer a direction, or write records.
export const bullishWatchItems=items=>(Array.isArray(items)?items:[]).filter(r=>r?.status==='ASSESSED'&&r.validationContract==='STRUCTURED_V1'&&r.bias==='BULL');
export function copySymbolFallback(symbol,doc=globalThis.document){
 if(!doc?.body||typeof doc.execCommand!=='function')return false;
 const previous=doc.activeElement,field=doc.createElement('textarea');field.value=symbol;field.setAttribute('readonly','');field.setAttribute('aria-hidden','true');Object.assign(field.style,{position:'fixed',left:'-9999px',top:'0',opacity:'0'});
 try{doc.body.appendChild(field);field.focus();field.select();field.setSelectionRange(0,symbol.length);return doc.execCommand('copy')===true;}
 catch{return false;}
 finally{field.remove();try{previous?.focus?.({preventScroll:true});}catch{}}
}
export function bindSymbolCopy(button,feedback,symbol,{clipboard=globalThis.navigator?.clipboard,document=globalThis.document,setTimer=setTimeout,clearTimer=clearTimeout}={}){
 let timer=null,sequence=0;
 button.addEventListener('click',async event=>{event.preventDefault();event.stopPropagation();const turn=++sequence;if(timer!==null){clearTimer(timer);timer=null;}
  try{if(typeof clipboard?.writeText==='function')await clipboard.writeText(symbol);else if(!copySymbolFallback(symbol,document))throw Error('CLIPBOARD_UNAVAILABLE');if(turn!==sequence)return;button.dataset.copyState='success';feedback.textContent='已复制';}
  catch{if(turn!==sequence)return;button.dataset.copyState='error';feedback.textContent='复制失败';}
  timer=setTimer(()=>{if(turn===sequence){button.dataset.copyState='';feedback.textContent='';timer=null;}},1500);
 });
}
const trendLabels=Object.freeze({INDICATORS_BULLISH:'指标看涨',STRUCTURE_BULLISH:'结构看涨',INDICATORS_BEARISH:'指标看跌',STRUCTURE_BEARISH:'结构看跌',INDICATOR_PATH:'指标路径',STRUCTURE:'价格结构',BULLISH_INDICATORS:'看涨',BEARISH_INDICATORS:'看跌',MIXED_INDICATORS:'混合',INSUFFICIENT_INDICATORS:'证据不足',BULLISH_STRUCTURE:'上涨结构',BEARISH_STRUCTURE:'下跌结构',MIXED_STRUCTURE:'结构混合',INSUFFICIENT_STRUCTURE:'结构不足',ACTIVE_LEG:'活动结构腿（未锁定）',LOCKED:'已确认锁定',STRONG:'强',MODERATE:'中',WEAK:'弱',ADVANCING:'趋势推进',PULLBACK:'趋势回调',CONSOLIDATING:'整理',NONE:'无明确阶段',COMPLETE:'已完成',INTERRUPTED:'已中断',RUNNING:'运行中',FAILED:'失败',NOT_EVALUATED:'未评估',INVALID_DATA:'数据异常',STALE:'已过期',EXPIRED:'已失效',UNVERIFIED:'未验证'});
export const formatTrendLabel=value=>trendLabels[value]||'未知状态';
export function trendDirection(row){if(row?.status!=='ASSESSED'||row?.validationContract!=='STRUCTURED_V1')return row?.status==='FAILED'?'—（失败）':row?.status==='INVALID_DATA'?'—（数据异常）':'—（未评估）';return {BULL:'L',BEAR:'S',NEUTRAL:'N'}[row.bias]||'—（未知状态）';}
export const formatTrendNumber=(value,digits,scale=1,suffix='')=>typeof value==='number'&&Number.isFinite(value)?`${(value*scale).toFixed(digits)}${suffix}`:'暂无数据';
export function recentTrendRuns(items){return (Array.isArray(items)?items:[]).filter(x=>x&&typeof x.runId==='string'&&Number.isFinite(x.cycle)).slice().sort((a,b)=>b.cycle-a.cycle||a.runId.localeCompare(b.runId)).slice(0,6);}
export function symbolTrendHistory(latest,history,symbol){
 if(!latest||typeof latest.runId!=='string'||!Number.isFinite(latest.cycle)||typeof symbol!=='string')return [];
 const seen=new Set([latest.runId]);const earlier=(Array.isArray(history)?history:[]).filter(r=>r&&typeof r.runId==='string'&&Number.isFinite(r.cycle)&&r.cycle<latest.cycle).slice().sort((a,b)=>b.cycle-a.cycle||a.runId.localeCompare(b.runId)).filter(r=>{if(seen.has(r.runId))return false;seen.add(r.runId);return true;}).slice(0,5).reverse();
 return [...earlier,latest].map(run=>{const row=Array.isArray(run.items)?run.items.find(x=>x?.symbol===symbol):null;let mark='—';if(row?.status==='FAILED'&&run.status==='COMPLETE')mark='F';else if(row?.status==='ASSESSED'&&row.validationContract==='STRUCTURED_V1')mark=({BULL:'L',BEAR:'S',NEUTRAL:'N'})[row.bias]||'—';return {runId:run.runId,cycle:run.cycle,mark};});
}
export function trendReason(row){const parts=[];if(row?.indicatorPath==='BULLISH_INDICATORS')parts.push('指标看涨');else if(row?.indicatorPath==='BEARISH_INDICATORS')parts.push('指标看跌');if(row?.structurePath==='BULLISH_STRUCTURE')parts.push('价格结构偏多');else if(row?.structurePath==='BEARISH_STRUCTURE')parts.push('价格结构偏空');else if(row?.structurePath==='INSUFFICIENT_STRUCTURE')parts.push('结构证据不足');else if(row?.structurePath==='MIXED_STRUCTURE')parts.push('结构混合');if(row?.derivedStructureState==='ACTIVE_LEG')parts.push('当前活动结构腿未锁定');else if(row?.derivedStructureState==='LOCKED')parts.push('最近结构已锁定');return parts.length?parts.join('；')+'。':'暂无可展示的事实说明。';}
export const strengthLabel=v=>({LOW:'低',MEDIUM:'中等',HIGH:'高'})[v]||(v===null?'不适用':'强度未记录');
const finite=v=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v));
export function validMetric(row,key){
 const m=row.metrics?.[key],definitions={price1h:['%','closed rolling 1h'],oi1h:['%','sumOpenInterest quantity, exact 1h'],volume1h:['×','closed 1h volume / previous 24 bars mean'],fundingSettled:['%','actual settlement']};
 const d=definitions[key];if(!d||!m||!finite(m.value)||m.unit!==d[0]||m.meaning!==d[1]||!m.evidenceId||!finite(row.dataCutoff))return null;
 const times=m.dataTimes?.map(t=>typeof t==='number'?t:t.ms);
 if(!times?.length||times.some(t=>!finite(t)||Number(t)>Number(row.dataCutoff)))return null;
 if(!row.evidence?.some(e=>e.evidenceId===m.evidenceId&&finite(e.result)&&Number(e.result)===Number(m.value)))return null;
 if(['price1h','oi1h'].includes(key)){
  const span=Number(times.at(-1))-Number(times[0]);if(span!==3600000&&!(key==='price1h'&&span===3599999))return null;
  if(Math.abs(Math.floor(Number(row.dataCutoff)/3600000)*3600000-Number(times.at(-1)))>1)return null;
 }
 if(key==='volume1h'&&(Number(m.value)<0||Math.abs(Math.floor(Number(row.dataCutoff)/3600000)*3600000-Math.max(...times.map(Number)))>1))return null;
 if(key==='fundingSettled'&&Number(row.dataCutoff)-Math.max(...times.map(Number))>24*3600000)return null;
 return m;
}
export function factTags(row){
 const out=[],push=(label,ids)=>out.push({label,evidenceIds:ids});
 for(const [key,positive,negative,zero]of [['price1h','1h上涨','1h下跌','1h价格未变'],['oi1h','1h OI扩张','1h OI收缩','1h OI未变']]){const m=validMetric(row,key);if(m)push(Number(m.value)>0?positive:Number(m.value)<0?negative:zero,[m.evidenceId]);}
 const volume=validMetric(row,'volume1h');if(volume&&row.anomalies?.some(a=>a.kind==='VOLUME_SPIKE'&&a.evidenceIds?.includes(volume.evidenceId)))push('1h放量',[volume.evidenceId]);
 const divergence=row.anomalies?.find(a=>a.kind==='TOP_GLOBAL_DIVERGENCE'&&a.scope==='TOP_TRADER_ACCOUNTS_VS_GLOBAL_ACCOUNTS');
 const global=row.longShort?.global,top=row.longShort?.topAccounts;
 const accountValid=s=>s?.quality?.available&&s.period==='1h'&&Number(s.dataTimestamp)===Math.floor(Number(row.dataCutoff)/3600000)*3600000&&finite(s.latestLongAccountPct)&&Number(s.latestLongAccountPct)>=0&&Number(s.latestLongAccountPct)<=100;
 if(divergence&&global?.scope==='GLOBAL_ACCOUNTS'&&top?.scope==='TOP_TRADER_ACCOUNTS'&&accountValid(global)&&accountValid(top)&&divergence.evidenceIds?.length&&divergence.evidenceIds.every(id=>row.evidence?.some(e=>e.evidenceId===id)))push('账户分歧',divergence.evidenceIds);
 else if(accountValid(global)&&global.scope==='GLOBAL_ACCOUNTS'){
  const e=row.evidence?.find(e=>e.evidenceId===`${row.symbol}:global.long.latest`&&finite(e.result)&&Number(e.result)===Number(global.latestLongAccountPct));
  if(e&&Number(global.latestLongAccountPct)!==50)push(Number(global.latestLongAccountPct)>50?'全市场账户偏多':'全市场账户偏空',[e.evidenceId]);
 }
 const funding=validMetric(row,'fundingSettled');if(funding){if(row.anomalies?.some(a=>a.kind==='FUNDING_EXTREME'&&a.evidenceIds?.includes(funding.evidenceId)))push('结算Funding异常',[funding.evidenceId]);else if(Number(funding.value)!==0)push(Number(funding.value)>0?'正结算资金费率':'负结算资金费率',[funding.evidenceId]);}
 return out.slice(0,4);
}
export function evidenceSummary(row){return factTags(row).map(x=>x.label).join('，')||'可核实摘要不足，请查看完整证据。';}
export function observationState(latest,completed,research){
 const messages=[];if(!latest?.record)return {cards:[],messages:['历史数据不存在']};
 if(latest.snapshotState==='IN_PROGRESS'||!latest.record.finishedAt||latest.record.status==='RUNNING')messages.push('最新扫描尚未完成；以下仅展示已完成运行。');
 if(!completed)return {cards:[],messages:[...messages,'尚无可读取的完成运行']};
 if(!completed.record?.finishedAt||completed.record.status==='RUNNING'||completed.snapshotState==='IN_PROGRESS')return {cards:[],messages:[...messages,'完成档案状态发生变化，请稍后刷新']};
 const c=completed.counters||{};
 if(c.qualified===0)messages.push('本轮没有合格候选');else if(c.selected===0)messages.push('本轮没有选中研究对象');
 const selected=new Set(completed.selector?.rows?.filter(x=>x.status==='SELECTED').map(x=>x.symbol)||[]);
 const cards=research.filter(r=>r.runId===completed.record.runId&&selected.has(r.symbol)&&r.selection?.status==='SELECTED'&&r.analysis?.status==='VALIDATED').sort((a,b)=>(a.selection.rank??Infinity)-(b.selection.rank??Infinity)).slice(0,3);
 if(c.selected>0&&!cards.length)messages.push('有选中对象但V2不可用或研究记录无法读取');
 if(!cards.length&&!messages.length)messages.push('本轮没有有效V2研究；历史资格记录可能缺失');
 return {cards,messages};
}
export const categoryLabel=v=>({PRICE_EXTREMITY:'价格',OI_ABNORMALITY:'OI',VOLUME_ABNORMALITY:'成交量',FUNDING_EXTREMITY:'Funding',ACCOUNT_DISTRIBUTION:'账户',CROSS_METRIC_CONFIRMATION:'共振加分',MATERIAL_CHANGE:'实质更新',EVENT_NOVELTY:'新事件',HISTORICAL_RARITY:'历史稀有性'})[v]||v;
export const mainNavigation=p=>p==='/selector'?'/selector':p==='/history'||p.startsWith('/runs')||p.startsWith('/symbol/')?'/history':p==='/'?'/':null;

// Display labels only: repeated research never means strengthening or a price probability.
export const watchSlotLabel=s=>({COMPLETE:'已完成',PARTIAL:'部分完成',FAILED:'运行失败',INTERRUPTED:'运行中断',SKIPPED_MISSED:'漏执行',SKIPPED_OVERLAP:'重叠跳过',RUNNING:'运行中',MISSING:'记录缺失',INVALID:'时间或记录无效',INCOMPLETE:'尚未完成'})[s]||'状态未知';
export const watchBiasLabel=b=>({BULLISH:'当前偏多',BEARISH:'当前偏空',NO_EDGE:'当前无明确方向优势'})[b]||'研究方向未记录';
export function marketWatchView(w){return {items:Array.isArray(w?.items)?w.items.slice(0,10):[],emptyMessage:!w?'4H聚合暂不可用；可查看最近扫描或历史。':w.emptyState==='NO_COMPLETED_SLOTS'?'四个时槽内暂无有效的已完成运行，请查看时槽状态。':'四个时槽内暂无有效研究；不等同于Scanner运行失败。',staleMessage:w?.stale?'最近有效扫描已过期或缺失；保存研究不代表当前行情。':null};}

// Compact4H display adapters. Only persisted bias enums map to direction letters.
const biasMarks=Object.freeze({BULLISH:'L',BEARISH:'S',NO_EDGE:'N'});
export const watchBiasMark=b=>Object.hasOwn(biasMarks,b)?biasMarks[b]:'?';
const validTime=t=>Number.isSafeInteger(t)&&t>=0&&t<=8640000000000000-28800000;
export function compactWatchTime(t,reference=Date.now()){
 if(!validTime(t)||!validTime(reference))return '—';
 const s=new Date(t+28800000).toISOString(),r=new Date(reference+28800000).toISOString();
 return (s.slice(0,10)===r.slice(0,10)?'':s.slice(5,10).replace('-','/')+' ')+s.slice(11,16);
}
export function compactAnomalyLabels(kinds=[]){
 const labels=[];for(const k of kinds){let label;
  if(['PRICE_1H','PRICE_4H','PRICE_24H'].includes(k))label='价格';
  else if(['FUNDING_EXTREME','FUNDING_CHANGE','FUNDING_FLIP'].includes(k))label='资金费率';
  else if(/^OI_/.test(k))label='持仓量';else if(/^VOLUME_/.test(k))label='成交量';
  else if(['ACCOUNT_DISTRIBUTION_SHIFT','ACCOUNT_DOMINANCE_FLIP','TOP_ACCOUNT_DISTRIBUTION_SHIFT','TOP_GLOBAL_DIVERGENCE'].includes(k))label='账户分布';
  else if(k==='TOP_POSITION_DISTRIBUTION_SHIFT')label='顶部持仓';else label=String(k||'异常未记录');
  if(!labels.includes(label))labels.push(label);
 }return labels;
}
export const orderedWatchSlots=slots=>[...(Array.isArray(slots)?slots:[])].slice(0,4).sort((a,b)=>a.scheduledAt-b.scheduledAt);
export function watchHistory(item,slots){
 return orderedWatchSlots(slots).map(slot=>{
  const base={scheduledAt:slot.scheduledAt,runId:slot.runId,slotStatus:slot.status,mark:'—',bias:null,researchTime:null,dataCutoff:null};
  if(!['COMPLETE','PARTIAL'].includes(slot.status))return {...base,state:'SLOT_UNAVAILABLE',label:watchSlotLabel(slot.status)+'；没有可用方向研究'};
  // The V1 API only supplies validated research. Match both slot identity fields;
  // duplicate entries follow its newest researchTime then dataCutoff convention.
  const rows=(item.occurrences||[]).filter(o=>o.runId===slot.runId&&o.scheduledAt===slot.scheduledAt&&validTime(o.researchTime)).sort((a,b)=>b.researchTime-a.researchTime||(b.dataCutoff??0)-(a.dataCutoff??0));
  const o=rows[0];if(!o)return {...base,state:slot.status==='PARTIAL'?'PARTIAL_NO_VALID_RESEARCH':'NO_VALID_RESEARCH',label:slot.status==='PARTIAL'?'运行部分完成；该币无有效方向研究':'运行已完成；该币无有效研究记录（未入选或研究不可用）'};
  const mark=watchBiasMark(o.bias);return {...base,bias:o.bias??null,researchTime:o.researchTime,dataCutoff:o.dataCutoff,mark,state:mark==='?'?'UNKNOWN_DIRECTION':'VALID_RESEARCH',label:mark==='?'?'未识别方向：'+String(o.bias??'未记录'):watchBiasLabel(o.bias),record:o};
 });
}
export const compactWatch=Object.freeze({time:compactWatchTime,anomalies:compactAnomalyLabels,slots:orderedWatchSlots,history:watchHistory,mark:watchBiasMark,score:v=>typeof v==='number'&&Number.isFinite(v)&&v>=0?v.toFixed(1):'—'});
