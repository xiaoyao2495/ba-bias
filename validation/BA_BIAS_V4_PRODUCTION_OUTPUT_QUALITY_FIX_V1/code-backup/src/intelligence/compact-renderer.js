import {times} from '../config.js';

// Presentation only: consume the persisted, verified packet; never judge eligibility
// or derive a new market conclusion. Important text is never truncated.
const labels={PRICE_24H:'滚动24h价格异动',PRICE_1H:'1h价格异动',OI_4H:'4h OI数量异动',FUNDING_EXTREME:'结算费率异常',FUNDING_CHANGE:'结算费率变化',FUNDING_FLIP:'结算费率翻转',VOLUME_SPIKE:'成交量异常',ACCOUNT_DISTRIBUTION_SHIFT:'全市场账户分布变化',ACCOUNT_DOMINANCE_FLIP:'多空账户翻转（已有记录）',TOP_ACCOUNT_DISTRIBUTION_SHIFT:'顶部账户分布变化',TOP_POSITION_DISTRIBUTION_SHIFT:'顶部持仓份额变化',TOP_GLOBAL_DIVERGENCE:'顶部与全市场账户背离'};
const biases={BULLISH:'偏多延续',BEARISH:'偏空延续',BULLISH_REVERSAL:'偏向上反弹/反转',BEARISH_REVERSAL:'偏向下回落/反转',NO_EDGE:'暂无明确方向优势'};
const opportunities={LONG_SETUP:'多头方案',SHORT_SETUP:'空头方案',WAIT_FOR_PULLBACK:'等待回踩',WAIT_FOR_CONFIRMATION:'等待确认',AVOID_CHASING:'避免追价',NO_ACTIONABLE_SETUP:'暂无可执行方案'};
const finite=v=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v));
const number=(v,digits=2,sign=false)=>finite(v)?`${sign&&Number(v)>0?'+':''}${Number(v).toFixed(digits)}`:'缺失';
const time=v=>Number.isFinite(Number(v))&&Number(v)>0?times(Number(v)).shanghai.slice(5,16).replace('T',' '):'时间缺失';
export function directionalDisplayState(d){
  return d?.status==='VALIDATED'&&d.analysis&&d.rendered&&['LOW','MODERATE','HIGH'].includes(d.analysis.conviction)&&opportunities[d.analysis.tradeOpportunity]&&biases[d.analysis.marketBias]&&['1h','4h','24h'].includes(d.analysis.horizon)
    ?d.analysis.marketBias==='NO_EDGE'?'VALID_NO_EDGE':'VALID_DIRECTION':'ANALYST_UNAVAILABLE';
}
export function compactIntelligenceText(p,{runId}={}){
  const map=new Map((p.evidence || []).map(e=>[e.evidenceId,e]));
  const evidence=key=>map.get(`${p.symbol}:${key}`),kinds=new Set((p.anomalies || []).map(a=>a.kind));
  const lines=[`检测 · ${p.symbol}｜${p.storyType==='MATERIAL_UPDATE'?'重要变化：':''}${[...kinds].map(k=>labels[k] || k).join('、') || '市场异常'}`,
    p.storyType==='MATERIAL_UPDATE'?'重要变化（MATERIAL_UPDATE）：本轮有实质新证据，见下列已验证数据。':'首次情报（NEW_STORY）：以下为本轮已核实的异常事实。'];
  if(p.identity?.projectName)lines.push(`身份：${p.identity.projectName}`);
  const shown=new Set();
  const add=(key,label,digits=2,signed=true,suffix='%')=>{const e=evidence(key);if(e){shown.add(e.evidenceId);return finite(e.result)?`${label} ${number(e.result,digits,signed)}${suffix}`:`${label} 缺失`;}return `${label} 缺失`;};
  const priceEnd=evidence('price.closed1h')?.dataTimes?.at(-1)?.ms,oiEnd=evidence('oi.1h')?.dataTimes?.at(-1)?.ms;
  const priceTime=finite(priceEnd)&&time(Number(priceEnd)+1)!==time(p.dataCutoff)?`，截至${time(Number(priceEnd)+1)}（北京）`:'';
  const oiTime=finite(oiEnd)&&time(oiEnd)!==time(p.dataCutoff)?`（采样${time(oiEnd)}，北京）`:'';
  lines.push(`价格（已收盘${priceTime}）：`+['1h','4h','24h'].map(h=>add('price.closed'+h,h)).join('｜'));
  lines.push(`OI数量${oiTime}：`+['1h','4h','24h'].map(h=>add('oi.'+h,h)).join('｜'));
  if(kinds.has('PRICE_24H'))lines.push(add('price.rolling24h','滚动24h价格（独立口径）：'));
  // Program-selected event evidence precedes supporting cost/volume metrics.
  // No truncation or default value: missing core facts are explicit.
  for(const id of p.coreEventEvidenceIds || [])if(!shown.has(id)){
    const e=map.get(id);
    if(/:price\./.test(id)){
      lines.push(e?.phrase || '核心价格事件证据缺失，无法展示。');shown.add(id);
    }
  }
  const lsEvent=[...kinds].some(k=>/ACCOUNT|POSITION|DIVERGENCE/.test(k));
  if(lsEvent){
    for(const [key,label,prefix,needed] of [['global','全市场账户','global',true],['topAccounts','顶部交易员账户','topAccounts',kinds.has('TOP_ACCOUNT_DISTRIBUTION_SHIFT')||kinds.has('TOP_GLOBAL_DIVERGENCE')],['topPositions','顶部交易员持仓份额','topPositions',kinds.has('TOP_POSITION_DISTRIBUTION_SHIFT')]]){
      if(!needed)continue;const s=p.longShort?.[key];
      if(!s?.quality?.available){lines.push(`${label}：数据缺失，无法比较。`);continue;}
      const latest=s.latestLongAccountPct ?? s.topLongPositionShare;
      lines.push(`${label}：多 ${number(latest)}%、空 ${number(s.latestShortAccountPct ?? s.topShortPositionShare)}%`);
      const windows=['1h','4h','24h'].map(h=>{const w=s.windows?.[h];return `${h} ${w&&!w.reason?number(w.longChangePp,2,true):'缺失'}`;});
      lines.push(`多方变化（百分点）：${windows.join('｜')}`);
      const w=s.windows?.['24h'],e=evidence(prefix+'.long.change24h'),raw=e?.raw;
      if(w&&!w.reason&&raw?.length>=2&&finite(raw[0].longPct)&&finite(raw.at(-1).longPct))lines.push(`24h多方：${number(raw[0].longPct)}% → ${number(raw.at(-1).longPct)}%`);
      if(s.dominanceFlip&&s.flip)lines.push(`已有翻转记录：${s.flip.from==='LONG'?'多':'空'} → ${s.flip.to==='LONG'?'多':'空'}；${time(s.flip.timestamp)}（北京）；${s.flip.status==='CONFIRMED'?'后续样本确认':'单点/未持续确认'}。实际事件时间仍需复核。`);
      for(const id of s.evidence?.map(e=>e.evidenceId) || [])shown.add(id);
    }
    if(kinds.has('TOP_GLOBAL_DIVERGENCE')){
      const d=p.longShort?.divergence;lines.push(d&&finite(d.gapPp)?`同时间顶部−全市场多头账户差：${number(d.gapPp,2,true)}个百分点；4h多方变化 ${number(d.topLongChange4hPp,2,true)} / ${number(d.globalLongChange4hPp,2,true)}个百分点。`:'账户背离比较：对齐数据缺失。');shown.add(p.symbol+':topGlobal.divergence');
    }
  }
  if(kinds.has('VOLUME_SPIKE')||lsEvent||[...kinds].some(k=>/PRICE|OI/.test(k)))lines.push(add('volume.relative1h','1h成交量：前24根小时K线均值的',2,false,'倍'));
  if([...kinds].some(k=>k.startsWith('FUNDING'))){
    const latest=evidence('funding.latest');lines.push(latest?`已结算Funding：${number(latest.result,4,true)}%；${time(latest.dataTimes?.at(-1)?.ms)}（北京）${latest.phrase?.match(/多头支付空头|空头支付多头/)?.[0]?'；'+latest.phrase.match(/多头支付空头|空头支付多头/)[0]:''}。`:'已结算Funding：数据缺失。');if(latest)shown.add(latest.evidenceId);
    const change=evidence('funding.change');if(change){lines.push(`相邻实际结算：${time(change.dataTimes?.[0]?.ms)} → ${time(change.dataTimes?.at(-1)?.ms)}（北京），变化 ${number(change.result,4,true)}个百分点。`);shown.add(change.evidenceId);}
  }
  // Keep every remaining trigger fact (including a 5m volume trigger); do not
  // silently replace it with a convenient metric from another time window.
  for(const a of p.anomalies || [])for(const id of a.evidenceIds || [])if(!shown.has(id)){const e=map.get(id);lines.push(e?.phrase || `关键异常证据缺失：${labels[a.kind] || a.kind}`);shown.add(id);}
  if(p.storyType==='MATERIAL_UPDATE'&&p.whatChanged?.previousRunId){
    const keys={price:['滚动24h价格','price.rolling24h'],oi:['4h OI数量','oi.4h'],oi1:['1h OI数量','oi.1h'],oi24:['24h OI数量','oi.24h'],funding:['已结算Funding','funding.latest']};
    for(const c of p.whatChanged.changes || []){const spec=keys[c.metric],e=spec&&evidence(spec[1]);if(e&&finite(c.previous)&&finite(c.current)&&Number(e.result)===Number(c.current))lines.push(`相较上一轮${spec[0]}：${number(c.previous, c.metric==='funding'?4:2,true)}% → ${number(c.current,c.metric==='funding'?4:2,true)}%`);}
  }
  if(p.storyType==='MATERIAL_UPDATE'&&p.whatChanged?.previousRunId){
    const c=p.whatChanged.changes?.find(c=>c.metric==='longShort');
    for(const [key,label] of [['global','全市场账户'],['topAccounts','顶部账户'],['topPositions','顶部持仓份额']]){
      const before=c?.previous?.[key]?.longPct,after=c?.current?.[key]?.longPct,s=p.longShort?.[key];
      if(s?.quality?.available&&finite(before)&&finite(after)&&Number(before)>=0&&Number(before)<=100&&Number(after)===Number(s.latestLongAccountPct ?? s.topLongPositionShare)&&Number(before)!==Number(after))lines.push(`相较上一轮${label}多方：${number(before)}% → ${number(after)}%`);
    }
  }
  const d=p.directional,state=directionalDisplayState(d);
  if(state==='ANALYST_UNAVAILABLE'){
    lines.push('市场判断：方向研判不可用，需人工复核。',`观察周期：${d?.fallbackHorizon || '未确定'}（仅供复核，非有效方向结论）。`,'观察：复核异常记录及后续同期价格、OI与成交量变化。');
  }else{
    const a=d.analysis,r=d.rendered;
    lines.push(`方向${d.analystVersion==='V4'?'（V4）':''}：${biases[a.marketBias]}｜周期：${a.horizon}｜强度：${{LOW:'低',MODERATE:'中等',HIGH:'较强'}[a.conviction] || '未确定'}（定性，非胜率）`);
    if(biases[d.previousValidatedDirection]&&d.previousValidatedDirection!==a.marketBias&&p.storyType==='MATERIAL_UPDATE'&&p.whatChanged?.previousRunId&&p.whatChanged?.reason==='MATERIAL_EVIDENCE_AND_DIRECTION_CHANGE')lines.push(`方向更新：此前${biases[d.previousValidatedDirection]} → 当前${biases[a.marketBias]}`);
    if(r.marketThesis)lines.push(r.marketThesis);
    if(d.analystVersion==='V4'&&r.marketMechanism)lines.push(r.marketMechanism);
    for(const e of d.conflictingEvidence || [])if(e.phrase)lines.push(`竞争证据：${e.phrase}`);
    lines.push(`交易观察：${opportunities[a.tradeOpportunity] || '待人工复核'}`);
    const rules=(d.rules || []).map(r=>r.description).filter(Boolean);
    if(rules.length)lines.push(`失效/复核：${rules.join('；')}`);else if(r.invalidationDescription)lines.push(`复核：${r.invalidationDescription}`);else lines.push('失效条件：可靠数据缺失，不能给出结构或价格位置。');
    if(r.alternativeScenario)lines.push(`替代情景：${r.alternativeScenario}`);
    if(r.followUpChecks?.length)lines.push(`后续：${r.followUpChecks.join('；')}`);
  }
  lines.push(lsEvent?'风险：账户分布与OI不证明具体开平仓、资金流向或价格必然反转；顶部持仓份额不是全市场OI占比。':'风险：统计异动不证明确定性因果或资金流向，方向仅为条件性研究假设。');
  if(lsEvent&&!p.longShort?.topAccounts?.quality?.available&&!kinds.has('TOP_GLOBAL_DIVERGENCE'))lines.push('顶部账户数据缺失，不能验证顶部与全市场背离。');
  lines.push(`数据截止：${time(p.dataCutoff)}（北京）`,`RunId：${runId || '未提供'}｜来源：Binance USDⓈ-M Futures`);
  return lines.join('\n');
}
