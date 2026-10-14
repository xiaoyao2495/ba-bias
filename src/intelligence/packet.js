import {CONTRACT} from '../analysis/market-bias-v2/common.js';
import {renderResearch,publicAnalysis} from '../analysis/market-bias-v2/render.js';
import {flipRole,comparisonBaseline} from './notification-evidence.js';
import {buildFacts} from '../market/facts-engine.js';
import {classify,detect} from '../market/detector.js';
import {guardDraft} from '../content/claim-guard.js';
import {times,config} from '../config.js';

// Rebuild all displayed evidence from the saved API sources. Model prose is never
// treated as evidence or used as an asserted explanation in an intelligence packet.
export function verifiedFacts(f){
  const identity=f.sources?.exchange?.raw || f.identity;
  if(!classify(identity).eligible)throw new Error('IDENTITY_NOT_VERIFIED');
  const canonical=detect(buildFacts({runId:f.runId,symbol:f.symbol,identity:{symbol:identity.symbol,baseAsset:identity.baseAsset,quoteAsset:identity.quoteAsset,underlyingType:identity.underlyingType,underlyingSubType:identity.underlyingSubType,classification:classify(identity),projectName:null,metadataSource:'/fapi/v1/exchangeInfo'},
    ticker:f.sources?.ticker?.raw,sources:f.sources,cutoff:f.dataCutoff}));
  if(!f.dataCompleteness.eligible || !canonical.dataCompleteness.eligible)throw new Error('INSUFFICIENT_EVIDENCE');
  if(!canonical.anomalies.length)throw new Error('NO_DEEP_ANOMALY');
  return canonical;
}
const metricKeys=['price.rolling24h','price.closed1h','price.closed4h','price.closed24h','price.rangeLowHigh',
  'oi.1h','oi.4h','oi.24h','funding.latest','funding.sum24h','funding.change','volume.relative1h','volume.relative5m','volume.rolling24h','accounts.short'];
// Selected price event facts can change the meaning of a story. Remaining
// selected indicators support research and already have their standard display.
export function coreEventEvidenceIds(canonical,judge){
  const map=new Map(canonical.evidence.map(e=>[e.evidenceId,e]));
  const selected=judge.keyEvidenceIds.filter(id=>/:(?:price\.(?:drawdown|rangeLowHigh|closed(?:1|4|24)h|rolling24h))$/.test(id));
  const core=[...new Set([...selected,...canonical.anomalies.flatMap(a=>a.evidenceIds || [])])];
  if(core.some(id=>!map.has(id)))throw new Error('CORE_EVENT_EVIDENCE_MISSING');
  return core;
}
export function buildIntelligence(f,judge,comparison,{biasResearch,biasInput}={}){
  const canonical=verifiedFacts(f),map=new Map(canonical.evidence.map(e=>[e.evidenceId,e]));
  if(judge.keyEvidenceIds.some(id=>!map.has(id)))throw new Error('JUDGE_EVIDENCE_NOT_VERIFIED');
  const ids=[...new Set([...judge.keyEvidenceIds,...canonical.evidence.map(e=>e.evidenceId)])].slice(0,4);
  // Retain the original Claim Guard as an additional check, independent of prose quality.
  const guard=guardDraft({symbol:f.symbol,storyType:judge.storyType,title:'{{symbol}}市场情报',
    body:ids.map(id=>'{{'+id+'}}').join('\n'),observation:'后续观察价格、合约数量、成交量与结算费率的变化。',evidenceIds:ids},canonical,judge);
  if(!guard.ok)throw new Error('INTELLIGENCE_GUARD_FAILED');
  const coreIds=coreEventEvidenceIds(canonical,judge);
  const evidence=[...new Map([...metricKeys.map(key=>map.get(f.symbol+':'+key)).filter(Boolean),...canonical.longShort.evidence,...coreIds.map(id=>map.get(id))].map(e=>[e.evidenceId,e])).values()];
  const changedMetrics=Object.entries(comparison.current).filter(([key,value])=>JSON.stringify(value)!==JSON.stringify(comparison.previous?.summary?.[key]));
  const newEvidence=comparison.previous?evidence.filter(e=>!comparison.previous.evidenceIds?.includes(e.evidenceId)):evidence;
  const anomalies=canonical.anomalies.map(a=>({kind:a.kind,evidenceIds:a.evidenceIds,value:a.value,threshold:a.threshold ?? null}));
  const packet={version:1,symbol:f.symbol,storyType:judge.storyType,identity:canonical.identity,
    evaluationTime:canonical.evaluationTime,dataCutoff:f.dataCutoff,newsworthinessScore:judge.newsworthinessScore,
    longShort:canonical.longShort,anomalies,coreEventEvidenceIds:coreIds,evidenceRoles:Object.fromEntries(evidence.map(e=>[e.evidenceId,coreIds.includes(e.evidenceId)?'CORE_EVENT_EVIDENCE':'SUPPORTING_EVIDENCE'])),evidence,evidenceIds:evidence.map(e=>e.evidenceId),
    flipEvents:Object.fromEntries(['global','topAccounts'].map(k=>[k,{role:flipRole(comparison.current.longShort?.[k]?.flip,comparison.previous?.summary?.longShort?.[k]?.flip,comparison.previous?.lastResearchTime),eventTime:comparison.current.longShort?.[k]?.flip?.timestamp??null}])),
    whatChanged:{...comparisonBaseline(comparison.previous,f.dataCutoff),reason:comparison.reason,previousRunId:comparison.previous?.runId ?? null,changes:changedMetrics.map(([metric,current])=>({metric,previous:comparison.previous?.summary?.[metric] ?? null,current}))},
    newEvidence:{addedEvidenceIds:newEvidence.map(e=>e.evidenceId),updatedEvidenceIds:comparison.previous?evidence.filter(e=>!newEvidence.includes(e)).map(e=>e.evidenceId):[],note:comparison.previous?'同ID指标为新截止时间的观测，实质变化见WHAT_CHANGED。':'首次输出的已验证证据。'},
    whyMaterial:{judgeScore:judge.newsworthinessScore,threshold:config.storyThreshold,reason:comparison.reason,qualifyingAnomalies:anomalies},
    unconfirmed:['异动原因未确认；价格、OI和费率不能证明资金净流入、持仓方向或确定性因果。','账户分布不证明具体开平仓或资金流向；顶部持仓份额不是全市场OI多空占比；翻转或背离不确认价格趋势反转。','项目全名没有权威来源时不猜测。'],
    observations:['观察价格、OI多周期、成交量与后续实际结算费率是否延续或背离。','观察账户翻转是否获得后续小时样本确认，以及顶部与全市场分布差异是否延续。'],
    sources:[...new Set(evidence.map(e=>e.endpoint))],guard:{ok:true,evidenceRebuilt:true,claimGuardPassed:true}};
  if(judge.eligibilitySource==='DETERMINISTIC_SELECTOR_V1'){packet.eligibilitySource=judge.eligibilitySource;packet.selection={score:judge.newsworthinessScore,rank:judge.selection.rank,dimensions:judge.selection.dimensions,gate:judge.selection.gate,materialEvidence:judge.selection.materialEvidence};packet.whyMaterial={source:judge.eligibilitySource,score:judge.newsworthinessScore,reason:comparison.reason,qualifyingAnomalies:anomalies};}
  if(biasResearch){if(biasResearch.contract!==CONTRACT||biasResearch.executionState!=='VALIDATED'||biasResearch.symbol!==f.symbol||biasResearch.asOf.factsAsOf!==f.dataCutoff)throw Error('V2_RESEARCH_NOT_VALIDATED');packet.contract=CONTRACT;packet.version=2;packet.biasResearch=biasResearch;packet.biasDisplay=publicAnalysis(biasResearch,biasInput);packet.biasText=renderResearch(biasResearch,biasInput);}
  return {packet,article:guard.article};
}
export function intelligenceText(packet,{runId,scheduledAt}={}){
  const name=packet.identity.projectName || '项目全名未核实';
  const changes=packet.whatChanged.changes.filter(c=>c.metric!=='longShort').map(c=>`${c.metric}: ${JSON.stringify(c.previous)} → ${JSON.stringify(c.current)}`).join('\n');
  const evidence=packet.evidence.filter(e=>!e.scope&&!(packet.longShort?.global.quality.available&&e.evidenceId.endsWith(':accounts.short'))).map(e=>`• ${e.phrase}\n  数据时间：${e.dataTimes.map(t=>t.shanghai).join(' / ')}；来源：${e.endpoint}`).join('\n');
  const ls=longShortText(packet.longShort,packet.anomalies);
  const lsChange=longShortChangeText(packet.whatChanged.changes.find(c=>c.metric==='longShort'));
  return `检测 · BA-BIAS 市场情报\n\n币种：$${packet.symbol}\nRunId：${runId}\n身份：${packet.identity.baseAsset} / ${packet.identity.underlyingType}；${name}\n类型：${packet.storyType}\n异常类型：${packet.anomalies.map(a=>a.kind).join(', ')}\n计划时间：${scheduledAt?times(scheduledAt).shanghai:'手动运行'}\n数据截止：${times(packet.dataCutoff).shanghai}${packet.biasResearch?'\n\n'+packet.biasText:''}\n\n关键已验证事实：\n${evidence}${ls?'\n\n多空分布研究：\n'+ls:''}\n\nWHAT_CHANGED：\n${packet.whatChanged.reason}\n${changes}${lsChange?'\n'+lsChange:''}\n\nNEW_EVIDENCE：\n新增：${packet.newEvidence.addedEvidenceIds.join(', ') || '无新增指标类型'}\n更新：${packet.newEvidence.updatedEvidenceIds.join(', ') || '无'}\n${packet.newEvidence.note}\n\nWHY_MATERIAL：\n${packet.eligibilitySource==='DETERMINISTIC_SELECTOR_V1'?'确定性研究价值评分 '+packet.newsworthinessScore+'（非胜率）':'新闻价值评分 '+packet.newsworthinessScore+'，通过阈值 '+packet.whyMaterial.threshold}；${packet.anomalies.map(a=>a.kind).join(', ')}达到既有异常规则，历史比较为${packet.whatChanged.reason}。\n\n尚未确认：\n${packet.unconfirmed.join('\n')}\n后续观察：\n${packet.observations.join('\n')}\n\nRunId：${runId}\n来源：BA-BIAS / Binance USDⓈ-M Futures 官方API\n状态：仅供人工审核，未自动发布`;
}

export function longShortText(ls,anomalies=[]){
  if(!ls)return '';
  const lines=[];
  const fmt=v=>v===null||v===undefined?'不可计算':Number(v).toFixed(2);
  for(const [key,label] of [['global','全市场账户'],['topAccounts','顶部交易员账户'],['topPositions','顶部交易员持仓份额']]){
    const s=ls[key];if(!s?.quality.available){lines.push(`${label}：缺失（${s?.quality.reason || 'SOURCE_MISSING'}）`);continue;}
    lines.push(`${label}：多 ${fmt(s.latestLongAccountPct ?? s.topLongPositionShare)}%、空 ${fmt(s.latestShortAccountPct ?? s.topShortPositionShare)}%`);
    for(const h of ['1h','4h','24h']){const w=s.windows[h];lines.push(`  ${h}：多 ${fmt(w.longChangePp)} / 空 ${fmt(w.shortChangePp)} 个百分点；${times(w.from).shanghai.slice(5,16)} → ${times(w.to).shanghai.slice(5,16)}${w.reason?'；'+w.reason:''}`);}
    if(s.dominanceFlip)lines.push(`  主导侧 ${s.flip.from} → ${s.flip.to}；${s.flip.status}，连续 ${s.flip.confirmationSamples} 个小时样本`);
    lines.push(`  采样：${times(s.dataTimestamp).shanghai}；来源：${s.source.endpoint}`);
  }
  const d=ls.divergence;
  lines.push(d?.gapPp===null?`顶部/全市场账户比较：缺失（${d.reason}）`:`同时间顶部−全市场多头账户差：${fmt(d?.gapPp)} 个百分点；4h多头变化分别 ${fmt(d?.topLongChange4hPp)} / ${fmt(d?.globalLongChange4hPp)} 个百分点`);
  if(d?.gapPp!==null)lines.push(`账户背离规则：${anomalies.some(a=>a.kind==='TOP_GLOBAL_DIVERGENCE')?'达到':'未达到'}；仅账户对账户比较，不预测价格方向。`);
  return lines.join('\n');
}

function longShortChangeText(change){
  if(!change)return '';
  if(!change.previous)return '多空分布：首次保存已验证比例和精确历史变化。';
  const lines=[],fmt=v=>v===null||v===undefined?'缺失':Number(v).toFixed(2);
  for(const [key,label] of [['global','全市场账户'],['topAccounts','顶部账户'],['topPositions','顶部持仓份额']]){
    const a=change.current?.[key],b=change.previous?.[key];if(!a||!b)continue;
    if(a.longPct!==b.longPct)lines.push(`${label}多方：${fmt(b.longPct)}% → ${fmt(a.longPct)}%`);
    for(const h of ['1h','4h','24h'])if(a.changes[h]!==b.changes[h])lines.push(`${label}${h}多方变化：${fmt(b.changes[h])} → ${fmt(a.changes[h])} 个百分点`);
    if(JSON.stringify(a.flip)!==JSON.stringify(b.flip))lines.push(`${label}翻转状态：${b.flip?.status || 'NONE'} → ${a.flip?.status || 'NONE'}`);
  }
  if(change.current?.divergence?.gapPp!==change.previous?.divergence?.gapPp)lines.push(`顶部−全市场多头账户差：${fmt(change.previous?.divergence?.gapPp)} → ${fmt(change.current?.divergence?.gapPp)} 个百分点`);
  return lines.join('\n');
}

export function directionalText(){throw Error('LEGACY_RESEARCH_RETIRED');}
