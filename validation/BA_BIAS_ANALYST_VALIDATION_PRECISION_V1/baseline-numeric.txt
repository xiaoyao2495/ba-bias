import Big from 'big.js';

// A small, conservative grammar, not a bag of all numbers in the registry.
// Each literal is bound to a declared metric, scope, window and unit. Ambiguous
// prose fails closed; placeholders remain the preferred lossless representation.
const numeric=/[+-]?\d+(?:\.\d+)?\s*(?:个百分点|百分点|%|％|倍|USDT)?/g;
const horizon=/(1|4|24)\s*(?:h|小时)/gi;
const rounded=(actual,literal)=>{try{const d=(literal.split('.')[1]||'').length;return new Big(actual).round(d,Big.roundHalfUp).eq(literal);}catch{return false;}};
function metric(e){
  const k=e.evidenceId.split(':').slice(1).join(':');
  if(/^price\.(closed|rolling)/.test(k))return {kind:'price',unit:'%',previous:false,rolling:k.includes('rolling')};
  if(k.startsWith('directional.price.previous'))return {kind:'price',unit:'%',previous:true,rolling:false};
  if(k==='price.drawdown')return {kind:'drawdown',unit:'%'};
  if(k==='price.rangeLowHigh')return {kind:'range',unit:'%'};
  if(/^oi\./.test(k))return {kind:'oi',unit:'%'};
  if(/^funding\./.test(k))return {kind:'funding',unit:k==='funding.change'?'pp':'%',variant:k.split('.')[1]};
  if(k==='volume.relative1h')return {kind:'volume',unit:'倍'};
  const ls=k.match(/^(global|topAccounts|topPositions)\.(long|short)\.(latest|change(?:1|4|24)h)$/);
  if(ls)return {kind:'ratio',unit:ls[3]==='latest'?'%':'pp',scope:ls[1],side:ls[2]};
  return null;
}
function described(prefix){
  const tokens=[...prefix.matchAll(/OI|未平仓(?:合约)?(?:数量|规模)?|Funding|费率|价格|回撤|高点至|低点至高点|区间幅度|成交量|多头账户|空头账户|多方(?:占比|变化)|空方(?:占比|变化)|多头持仓份额|空头持仓份额/gi)];
  const word=tokens.at(-1)?.[0];if(!word)return null;
  if(/OI|未平仓/i.test(word))return {kind:/OI.{0,6}(?:价值|金额|市值|总额)|未平仓.{0,10}(?:价值|金额)/i.test(prefix)?'unavailableOiValue':'oi'};
  if(/Funding|费率/i.test(word))return {kind:/年化|收益|展示|预估/.test(prefix)?'unavailableFunding':'funding',variant:/相邻|变化|百分点/.test(prefix)?'change':/之和|合计/.test(prefix)?'sum24h':'latest'};
  if(/回撤|高点至/.test(word))return {kind:'drawdown'};
  if(/低点至高点|区间幅度/.test(word))return {kind:'range'};
  if(word==='价格')return {kind:'price',rolling:/滚动/.test(prefix),previous:/此前|前段|上一/.test(prefix)};
  if(word==='成交量')return {kind:'volume'};
  return {kind:'ratio',side:/空/.test(word)?'short':'long',scope:/顶部/.test(prefix)?/持仓份额/.test(prefix)?'topPositions':'topAccounts':/全市场/.test(prefix)?'global':null};
}
export function validateNumericText(text,input,analysis){
  const diagnostics=[];const declared=new Set([...analysis.supportingEvidenceIds,...analysis.conflictingEvidenceIds]);
  const available=input.evidence.filter(e=>declared.has(e.evidenceId)&&!e.dataTimes.some(t=>t>Date.parse(input.evaluationTime))).flatMap(e=>{
    const base={...e,typed:metric(e)},list=[base];
    const latest=e.phrase.match(/多 ([\d.]+)%、空 ([\d.]+)%/);
    if(base.typed?.kind==='ratio'&&base.typed.unit==='%'&&latest&&new Big(latest[1]).plus(latest[2]).eq(100))list.push({...e,result:latest[2],typed:{...base.typed,side:'short'}});
    return list;
  });
  let clean=text.replace(/\{\{[^{}]+\}\}/g,m=>' '.repeat(m.length));
  const mask=(start,length)=>{clean=clean.slice(0,start)+' '.repeat(length)+clean.slice(start+length);};
  // Exact program rule names are references, not invented indicators or values.
  for(const m of [...clean.matchAll(/(?:PRICE_OPPOSITE|OI_REVERSED)_(?:1|4|24)h/g)]){
    if(input.rules.some(r=>r.id===m[0]&&analysis.invalidation.ruleIds.includes(r.id)))mask(m.index,m[0].length);
    else diagnostics.push({code:'UNKNOWN_NUMERIC_RULE',literal:m[0]});
  }
  for(const m of [...clean.matchAll(horizon)]){
    const h=m[1]+'h';if(input.windows.some(w=>w.horizon===h&&(w.priceId||w.oiId)))mask(m.index,m[0].length);
    else diagnostics.push({code:'UNVERIFIED_TIME_WINDOW',literal:m[0]});
  }
  // The lookback is allowed only with the declared relative-volume evidence.
  for(const m of [...clean.matchAll(/24\s*根/g)])if(available.some(e=>e.evidenceId.endsWith(':volume.relative1h')&&/前24根/.test(e.phrase)))mask(m.index,m[0].length);
  let carriedWindow=null;
  // Sentence boundaries reset window context; commas may share an explicit window.
  let cursor=0;
  for(const clause of text.split(/([，,；;。！？\n])/)){
    const start=cursor;cursor+=clause.length;
    if(/^[。！？\n；;]$/.test(clause)){carriedWindow=null;continue;}
    const raw=clause.replace(/\{\{[^{}]+\}\}/g,m=>' '.repeat(m.length));
    const localWindows=[...raw.matchAll(horizon)].map(m=>({index:m.index,h:m[1]+'h'}));
    const refs=[...clause.matchAll(/\{\{([^{}]+)\}\}/g)].map(m=>m[1]);
    const clauseClean=clean.slice(start,start+clause.length);
    for(const m of clauseClean.matchAll(numeric)){
      const prefix=raw.slice(0,m.index);let kind=described(prefix);const win=localWindows.filter(w=>w.index<m.index).at(-1)?.h || carriedWindow || analysis.horizon;
      const n=m[0].match(/^([+-]?\d+(?:\.\d+)?)/)[1];const unit=m[0].slice(n.length).trim().replace('％','%').replace(/个百分点|百分点/,'pp');
      let value=n;
      const deniedCopy=raw.match(/^不能根据.*OI(?:数量)?(?:增长|增加|下降|减少)([+-]?\d+(?:\.\d+)?)%就断定(?:多头|空头)(?:加仓|开仓)\d+(?:\.\d+)?%/);
      if(deniedCopy&&prefix.includes('就断定')&&rounded(deniedCopy[1],n)&&diagnostics.some(d=>d.code==='VERIFIED_NUMERIC_FACT'&&d.metric?.kind==='oi'&&d.window===win&&rounded(d.literal.replace('%','').trim(),n))){diagnostics.push({code:'VERIFIED_DENIED_INFERENCE_COPY',literal:m[0],window:win});continue;}
      if(!/^[+-]/.test(n)&&/下降|下跌|减少|收缩|回撤|回落/.test(prefix.slice(Math.max(0,prefix.lastIndexOf(kind?.kind==='oi'?'OI':'价格')))))value='-'+n;
      const candidates=available.filter(e=>{const k=e.typed;if(!k||!kind||k.kind!==kind.kind||k.unit!==unit)return false;
        if(e.window&&e.window!==win)return false;
        if(kind.kind==='price'&&(k.previous!==kind.previous||k.rolling!==kind.rolling))return false;
        if(kind.kind==='ratio'&&(k.scope!==kind.scope||k.side!==kind.side))return false;
        if(kind.kind==='funding'&&k.variant!==kind.variant)return false;
        // More than one unlabelled window is ambiguous even with equal values.
        return Boolean(win||!e.window||refs.includes(e.evidenceId));});
      const comparison=prefix.match(/(≤|≥|<=|>=|小于|大于)\s*$/)?.[1];
      const lastMetric=[...prefix.matchAll(/(?:价格|OI|未平仓|占比|份额)/gi)].at(-1)?.index ?? 0;const tail=prefix.slice(lastMetric);
      const up=/上涨|上升|增长|增加|扩张/.test(tail),down=/下跌|下降|减少|收缩|回撤|回落/.test(tail);
      const signConsistent=e=>kind?.kind==='ratio'&&unit==='%'?!up&&!down:(!up||new Big(e.result).gte(0))&&(!down||new Big(e.result).lte(0));
      const future=/未来|预计|预测|明天|后续|目标|将上涨|将下跌/.test(raw);
      let matched=future?[]:candidates.filter(e=>signConsistent(e)&&rounded(e.result,value));
      let rule=null;
      if(comparison&&/≤|≥|<=|>=/.test(comparison)&&kind&&/后续|观察|若/.test(raw)){
        const operator=/≤|<=|小于/.test(comparison)?'LTE':'GTE';
        rule=input.rules.find(r=>analysis.invalidation.ruleIds.includes(r.id)&&r.horizon===win&&r.operator===operator&&r.metric===(kind.kind==='price'?'PRICE_CLOSED_CHANGE':kind.kind==='oi'?'OI_QUANTITY_CHANGE':null)&&rounded(r.threshold,n));
      }else if(comparison){
        matched=future?[]:candidates.filter(e=>{try{if(!signConsistent(e))return false;const v=new Big(e.result),b=new Big(n);return /≤|<=/.test(comparison)?v.lte(b):/≥|>=/.test(comparison)?v.gte(b):comparison==='小于'?v.lt(b):v.gt(b);}catch{return false;}});
      }
      diagnostics.push({code:rule?'VERIFIED_RULE_LITERAL':matched.length===1?'VERIFIED_NUMERIC_FACT':matched.length>1?'AMBIGUOUS_NUMERIC_FACT':'UNVERIFIED_NUMERIC_FACT',literal:m[0],window:win,metric:kind,evidenceIds:matched.map(e=>e.evidenceId),ruleId:rule?.id ?? null});
    }
    if(localWindows.length)carriedWindow=localWindows.at(-1).h;
  }
  // Unsupported spellings, bare %, braces and non-Arabic numeric claims remain closed.
  const residue=clean.replace(numeric,'');
  if(/[{}%％０-９]|[零〇一二两三四五六七八九十百千万亿半]+\s*(小时|分钟|天|成|倍|元|美金|USDT)|百分之|千分之|胜率|准确率|概率|收益率/.test(residue))diagnostics.push({code:'UNSUPPORTED_NUMERIC_OR_PROBABILITY_LANGUAGE'});
  return {ok:diagnostics.every(d=>d.code.startsWith('VERIFIED_')),diagnostics};
}

// Denial applies to one assertion span. Contrast/conjunctions split it, so a
// neighbouring affirmative claim cannot borrow a negation from another span.
export function assertionSpans(text){return text.replace(/\{\{[^{}]+\}\}/g,' ').split(/[，,；;。！？\n]|但是|但|然而|不过|同时|而且|并且/).filter(Boolean);}
export function isDenied(span,index,allowScopeSuffix=false){
  const before=span.slice(0,index),after=span.slice(index);
  const prefix=/(?:不能(?:仅凭|根据)?|不(?:能|代表|证明|意味着|等于|构成|确认)|无法(?:确认|证明|定义|给出|判断)|未(?:接入|获取|确认)|缺乏|缺少|没有(?:可靠|明确|证据)?|无(?:明确|可靠|方向性)|而非|并非|不是)[^，,；;。！？]{0,55}$/.test(before);
  const suffix=allowScopeSuffix&&/^[^，,；;。！？]{0,25}(?:不代表|不证明|不等于|并不意味着)/.test(after);
  // A denial that subsequently contains a positive certainty is ambiguous.
  return (prefix||suffix)&&!/但|却|已经|必然|确定(?:是|为)|就是/.test(span.slice(index));
}
export function semanticViolations(text){
  const patterns={UNAVAILABLE_INDICATOR_OR_STRUCTURE:/突破|跌破|支撑位|支撑价|支撑区|下方支撑|阻力|结构失效|高低点失守|MSS|BOS|FVG|CVD|Basis|基差|主动买|主动卖|流通市值|市值比/gi,
    UNSUPPORTED_CAUSE_OR_ORDER:/资金.{0,6}(?:流入|流出)|净流入|净流出|加仓|减仓|回补|建仓|开多|开空|开仓|平仓|多头仓位|空头仓位|爆仓|强平|庄家|主力|聪明钱|获利了结|必涨|必跌|必然|保证|下单|杠杆|仓位大小/g,
    WRONG_ACCOUNT_OR_OI_SCOPE:/账户.{0,12}(?:持仓|仓位|资金)|OI.{0,12}(?:多头|空头)/gi};
  const diagnostics=[];
  for(const span of assertionSpans(text))for(const [code,re] of Object.entries(patterns))for(const m of span.replace(/未平仓/g,'合约').matchAll(re))diagnostics.push({code,match:m[0],span,denied:isDenied(span,m.index,code==='WRONG_ACCOUNT_OR_OI_SCOPE')});
  return diagnostics;
}
