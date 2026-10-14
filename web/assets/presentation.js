// Display-only adapters: never score candidates, infer a direction, or write records.
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
