import Big from 'big.js';

// A small, conservative grammar, not a bag of all numbers in the registry.
// Each literal is bound to a declared metric, scope, window and unit. Ambiguous
// prose fails closed; placeholders remain the preferred lossless representation.
const numeric=/[+-]?\d+(?:\.\d+)?\s*(?:个百分点|百分点|%|％|倍|USDT)?/g;
const horizon=/(1|4|24)\s*(?:h|小时)|5\s*(?:m|分钟)/gi;
const rounded=(actual,literal)=>{try{const d=(literal.split('.')[1]||'').length;return new Big(actual).round(d,Big.roundHalfUp).eq(literal.replace(/^\+/,''));}catch{return false;}};
function metric(e){
  const k=e.evidenceId.split(':').slice(1).join(':');
  if(k==='price.last')return {kind:'priceLevel',unit:'USDT'};
  if(/^price\.(closed|rolling)/.test(k))return {kind:'price',unit:'%',previous:false,rolling:k.includes('rolling')};
  if(k.startsWith('directional.price.previous'))return {kind:'price',unit:'%',previous:true,rolling:false};
  if(k==='price.drawdown')return {kind:'drawdown',unit:'%'};
  if(k==='price.rangeLowHigh')return {kind:'range',unit:'%'};
  if(/^oi\./.test(k))return {kind:'oi',unit:'%'};
  if(k==='funding.sum24h')return {kind:'funding',unit:'%',variant:'sum24h'};
  if(/^funding\./.test(k))return {kind:'funding',unit:k==='funding.change'?'pp':'%',variant:k.split('.')[1]};
  if(/^volume\.relative(?:1h|5m)$/.test(k))return {kind:'volume',unit:'倍',window:k.endsWith('5m')?'5m':'1h'};
  const ls=k.match(/^(global|topAccounts|topPositions)\.(long|short)\.(latest|change(?:1|4|24)h)$/);
  if(ls)return {kind:'ratio',unit:ls[3]==='latest'?'%':'pp',scope:ls[1],side:ls[2]};
  return null;
}
// Exact token identity is checked against the input, never a coin whitelist.
const idPattern=/[A-Z0-9]+:[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z0-9]+)+/gi;
export function referenceIds(text){return [...new Set([...text.matchAll(/\{\{([^{}]+)\}\}/g)].map(m=>m[1]).concat([...text.matchAll(idPattern)].map(m=>m[0])))];}
export function maskIdentifiers(text,input){
 const ids=new Set(input.evidence.map(e=>e.evidenceId));
 let clean=text.replace(/\{\{[^{}]+\}\}/g,m=>' '.repeat(m.length));
 clean=clean.replace(idPattern,m=>ids.has(m)?' '.repeat(m.length):m);
 return clean.replace(/[A-Za-z0-9_]+/g,m=>m===input.symbol||['DIRECTIONAL_ANALYST_V1','DIRECTIONAL_ANALYST_V2','DIRECTIONAL_INPUT_V1'].includes(m)?' '.repeat(m.length):m);
}
function normalizeText(text){
 const digits={零:0,〇:0,一:1,二:2,两:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9};
 const number=s=>{const [whole,fraction]=s.split('点');let n;if(whole.includes('十')){const [a,b]=whole.split('十');n=(a?digits[a]:1)*10+(b?digits[b]:0);}else n=digits[whole];return Number.isFinite(n)&&(!fraction||[...fraction].every(c=>c in digits))?String(n)+(fraction?'.'+[...fraction].map(c=>digits[c]).join(''):''):null;};
 return text.normalize('NFKC').replace(/百分之([零〇一二两三四五六七八九十]+(?:点[零〇一二两三四五六七八九]+)?)/g,(m,n)=>number(n)===null?m:number(n)+'%').replace(/percentage points?/gi,'个百分点').replace(/percent/gi,'%').replace(/hours?/gi,'h').replace(/times/gi,'倍').replace(/\bprice\b(?!\.)/gi,'价格').replace(/open interest(?: quantity)?/gi,'OI数量').replace(/\bfunding\b(?!\.)/gi,'Funding').replace(/\bvolume\b(?!\.)/gi,'成交量').replace(/increased|increases|grew|growth|rose|rises/gi,'增长').replace(/decreased|decreases|fell|falls|declined|declines/gi,'下降').replace(/\b(?:previous|prior)\b(?!\.)/gi,'此前').replace(/\b(?:latest|current)\b/gi,'当前');
}
function described(prefix){
 const tokens=[...prefix.matchAll(/OI|未平仓(?:合约)?(?:数量|规模)?|Funding|费率|价格|回撤|高点至|低点至高点|区间幅度|成交量|相对量(?:能)?|量能|多头账户|空头账户|多方账户|空方账户|账户多方|账户空方|多方(?:占比|变化)|空方(?:占比|变化)|当前多方|当前空方|多头持仓份额|空头持仓份额/gi)];
 const last=tokens.at(-1),word=last?.[0];if(!word)return null;
 // Previous/rolling adjectives belong to the current metric, not an earlier one.
 const start=Math.max(tokens.at(-2)?.index+tokens.at(-2)?.[0].length||0,prefix.lastIndexOf('（')+1,prefix.lastIndexOf('(')+1);
 const local=prefix.slice(start),tail=prefix.slice(last.index);
 if(/OI|未平仓/i.test(word))return {kind:/OI.{0,8}(?:价值|金额|市值|总额)|未平仓.{0,10}(?:价值|金额)/i.test(tail)?'unavailableOiValue':'oi'};
 if(/Funding|费率/i.test(word))return {kind:/年化|收益|展示|预估/.test(local)?'unavailableFunding':'funding',variant:/相邻|变化|百分点/.test(tail)?'change':/之和|合计|结算之和/.test(tail)?'sum24h':'latest'};
 if(/回撤|高点至/.test(word))return {kind:'drawdown'};
 if(/低点至高点|区间幅度/.test(word))return {kind:'range'};
 if(word==='价格')return {kind:'price',rolling:/滚动/.test(local),previous:/此前|前段|前一|上一/.test(local)};
 if(/成交量|相对量|量能/.test(word))return {kind:'volume'};
 return {kind:'ratio',side:/空/.test(word)?'short':'long',scope:/顶部/.test(prefix)?/持仓份额/.test(prefix)?'topPositions':'topAccounts':/全市场|账户多方|账户空方/.test(prefix)?'global':null};
}
export function validateNumericText(text,input,analysis){
  text=normalizeText(text);
  const diagnostics=[]; // The provided Registry is verified; argumentative lists are not a background whitelist.
  const available=input.evidence.filter(e=>!e.dataTimes.some(t=>t>Date.parse(input.evaluationTime))).flatMap(e=>{
    const base={...e,typed:metric(e)},list=[base];
    const latest=e.phrase.match(/多 ([\d.]+)%、空 ([\d.]+)%/);
    const endpoints=e.phrase.match(/从 ([\d.]+)% 到 ([\d.]+)%/);
    if(base.typed?.kind==='ratio'&&base.typed.unit==='pp'&&endpoints)for(const [i,variant] of ['start','end'].entries())list.push({...e,result:endpoints[i+1],typed:{...base.typed,unit:'%',endpointVariant:variant}});
    if(base.typed?.kind==='ratio'&&base.typed.unit==='%'&&latest&&new Big(latest[1]).plus(latest[2]).eq(100))list.push({...e,result:latest[2],typed:{...base.typed,side:'short'}});
    return list;
  });
  for(const id of referenceIds(text))if(input.evidence.some(e=>e.evidenceId===id))diagnostics.push({code:'VERIFIED_EVIDENCE_IDENTIFIER',literal:id,numberType:'EVIDENCE_IDENTIFIER'});
  for(const m of text.matchAll(/[A-Za-z0-9_]+/g))if(m[0]===input.symbol||/^DIRECTIONAL_(?:ANALYST_V[12]|INPUT_V1)$/.test(m[0]))diagnostics.push({code:'VERIFIED_PROTOCOL_IDENTIFIER',literal:m[0],numberType:m[0]===input.symbol?'SYMBOL_IDENTIFIER':'VERSION_IDENTIFIER'});
  let clean=maskIdentifiers(text,input);
  const mask=(start,length)=>{clean=clean.slice(0,start)+' '.repeat(length)+clean.slice(start+length);};
  const timestamps=new Set([Date.parse(input.evaluationTime),...available.flatMap(e=>e.dataTimes)].filter(t=>Number.isFinite(t)&&t<=Date.parse(input.evaluationTime)));
  for(const m of [...clean.matchAll(/\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?/g)]){
   const valid=m[0].includes('T')?timestamps.has(Date.parse(m[0])):[...timestamps].some(t=>new Date(t).toISOString().slice(0,10)===m[0]);
   diagnostics.push({code:valid?'VERIFIED_TIMESTAMP':'UNVERIFIED_TIMESTAMP',literal:m[0],numberType:'TIMESTAMP'});mask(m.index,m[0].length);
  }
  // Exact program rule names are references, not invented indicators or values.
  for(const m of [...clean.matchAll(/(?:PRICE_OPPOSITE|OI_REVERSED)_(?:1|4|24)h/g)]){
    if(input.rules.some(r=>r.id===m[0]&&analysis.invalidation.ruleIds.includes(r.id)))mask(m.index,m[0].length);
    else diagnostics.push({code:'UNKNOWN_NUMERIC_RULE',literal:m[0]});
  }
  for(const m of [...clean.matchAll(horizon)]){
    const h=m[1]?m[1]+'h':'5m';if(h==='5m'?available.some(e=>e.evidenceId.endsWith(':volume.relative5m')):input.windows.some(w=>w.horizon===h&&(w.priceId||w.oiId)))mask(m.index,m[0].length);
    else diagnostics.push({code:'UNVERIFIED_TIME_WINDOW',literal:m[0]});
  }
  // The lookback is allowed only with the declared relative-volume evidence.
  for(const m of [...clean.matchAll(/24\s*根/g)])if(available.some(e=>e.evidenceId.endsWith(':volume.relative1h')&&/前24根/.test(e.phrase)))mask(m.index,m[0].length);
  // An explicitly ordered price/OI pair has two typed slots, never a bag of values.
  const ordered=new Map();
  for(const m of text.matchAll(/(1|4|24)h价格与OI(?:数量)?(?:均|都)[^()0-9%]{0,16}\(([+-]?\d+(?:\.\d+)?%)[、,]([+-]?\d+(?:\.\d+)?%)\)/g)){
   const first=m.index+m[0].indexOf(m[2]),second=m.index+m[0].lastIndexOf(m[3]);
   ordered.set(first,{kind:{kind:'price',previous:false,rolling:false},window:m[1]+'h'});ordered.set(second,{kind:{kind:'oi'},window:m[1]+'h'});
  }
  for(const m of text.matchAll(/(1|4|24)h与(1|4|24)h(?:价格)?已?转(?:为)?(?:下跌|跌)[^()0-9%]{0,5}\(([+-]?\d+(?:\.\d+)?%)[、,]([+-]?\d+(?:\.\d+)?%)\)/g)){
   ordered.set(m.index+m[0].indexOf(m[3]),{kind:{kind:'price',previous:false,rolling:false},window:m[1]+'h'});
   ordered.set(m.index+m[0].lastIndexOf(m[4]),{kind:{kind:'price',previous:false,rolling:false},window:m[2]+'h'});
  }
  for(const m of text.matchAll(/(1|4|24)h与(1|4|24)h(?:价格)?已?转(?:为)?(?:下跌|跌)[^()0-9%]{0,5}\([+-]?\d+(?:\.\d+)?%[、,][+-]?\d+(?:\.\d+)?%\)[，,](?:且)?同期OI数量分别([+-]?\d+(?:\.\d+)?%)[、,]([+-]?\d+(?:\.\d+)?%)/g)){
   const offset=m[0].indexOf('分别')+2,tail=m[0].slice(offset);
   ordered.set(m.index+offset+tail.indexOf(m[3]),{kind:{kind:'oi'},window:m[1]+'h'});ordered.set(m.index+offset+tail.lastIndexOf(m[4]),{kind:{kind:'oi'},window:m[2]+'h'});
  }
  for(const m of text.matchAll(/1h\/5m相对量([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)倍/g)){
   const offset=m[0].indexOf('相对量')+3,tail=m[0].slice(offset);
   ordered.set(m.index+offset+tail.indexOf(m[1]),{kind:{kind:'volume'},window:'1h',unit:'倍'});ordered.set(m.index+offset+tail.lastIndexOf(m[2]),{kind:{kind:'volume'},window:'5m',unit:'倍'});
  }
  for(const m of text.matchAll(/全市场账户多空比([+-]?\d+(?:\.\d+)?%)\/([+-]?\d+(?:\.\d+)?%)/g)){
   ordered.set(m.index+m[0].indexOf(m[1]),{kind:{kind:'ratio',scope:'global',side:'long'},window:null});ordered.set(m.index+m[0].lastIndexOf(m[2]),{kind:{kind:'ratio',scope:'global',side:'short'},window:null});
  }
  let carriedWindow=null;
  // Sentence boundaries reset window context; commas may share an explicit window.
  let cursor=0;
  for(const clause of text.split(/([，,；;。！？\n])/)){
    const start=cursor;cursor+=clause.length;
    if(/^[。！？\n；;]$/.test(clause)){carriedWindow=null;continue;}
    const raw=maskIdentifiers(clause,input);
    const localWindows=[...raw.matchAll(horizon)].map(m=>({index:m.index,h:m[1]?m[1]+'h':'5m'}));
    const refs=referenceIds(clause);
    const clauseClean=clean.slice(start,start+clause.length);
    for(const m of clauseClean.matchAll(numeric)){
      const prefix=raw.slice(0,m.index);let kind=described(prefix);let win=localWindows.filter(w=>w.index<m.index).at(-1)?.h || carriedWindow || analysis.horizon;
      const slot=ordered.get(start+m.index);if(slot){kind=slot.kind;win=slot.window;}
      if(kind?.kind==='price'&&/转为\s*$/.test(prefix))kind={...kind,previous:false};
      const n=m[0].match(/^([+-]?\d+(?:\.\d+)?)/)[1];let unit=m[0].slice(n.length).trim().replace('％','%').replace(/个百分点|百分点/,'pp');
      if(slot?.unit&&!unit)unit=slot.unit;
      let value=n;
      if(kind?.kind==='price'&&unit==='USDT'&&/当前|最新|快照|现价/.test(prefix))kind={kind:'priceLevel'};
      if(!unit&&/^\d{13}$/.test(n)&&/采样时间|时间戳|timestamp/i.test(prefix)&&timestamps.has(Number(n))){diagnostics.push({code:'VERIFIED_TIMESTAMP',literal:m[0],numberType:'TIMESTAMP'});continue;}
      const adjacentAfter=clause.slice(m.index+m[0].length).match(/^\s*[（(]([^()（）]*)[)）]/)?.[1]||'';
      const preceding=clause.slice(0,m.index).match(/(?:\{\{([^{}]+)\}\}|([A-Z0-9]+:[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z0-9]+)+))(?:[）)]\s*)?(?:为|的|变化|数值|:)?\s*$/);
      const nextClause=text.slice(start+m.index+m[0].length).match(/^\s*[，,]\s*([A-Z0-9]+:[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z0-9]+)+)(?=[；;)）])/ )?.[1];
      const localRefs=referenceIds(adjacentAfter).concat(nextClause?[nextClause]:[]).concat(preceding?[preceding[1]||preceding[2]]:[]);
      const referenced=available.filter(e=>localRefs.includes(e.evidenceId)&&e.typed?.unit===unit);
      if(!kind&&referenced.length===1)kind={...referenced[0].typed};
      if(!kind&&/已收盘(?:1|4|24)(?:h|小时)[^\d%]{0,4}$/.test(prefix)&&unit==='%')kind={kind:'price',previous:/此前|前一|上一/.test(prefix),rolling:false};
      if(!kind&&/区间高点[^%]{0,25}(?:当前回落|回撤)/.test(prefix)&&unit==='%')kind={kind:'drawdown'};
      if(referenced.length===1&&referenced[0].typed?.previous&&kind?.kind==='price'&&/此前|前一|上一|前段/.test(prefix)&&!/当前价格|最新价格/.test(prefix))kind={...kind,previous:true};
      if(referenced.length===1&&/各自/.test(prefix)&&referenced[0].typed?.previous&&localWindows.some(w=>w.h===referenced[0].window))win=referenced[0].window;
      if(!kind&&/此前|上一|前段/.test(prefix)&&unit==='%')kind={kind:'price',previous:true,rolling:false};
      if(referenced.length===1&&kind?.kind==='price'&&/(?:1|4|24)h与(?:1|4|24)h价格/.test(prefix)&&localWindows.some(w=>w.h===referenced[0].window))win=referenced[0].window;
      // Settlement count is independently tied to the sum's actual source timestamps.
      if(!unit&&/^(?:次|个)结算/.test(raw.slice(m.index+m[0].length))&&/过去|已结算/.test(raw)&&!/未来|预计|后续/.test(raw)){
       const e=available.find(e=>e.evidenceId.endsWith(':funding.sum24h'));
       diagnostics.push({code:e&&Number(n)===e.dataTimes.length?'VERIFIED_SETTLEMENT_COUNT':'UNVERIFIED_SETTLEMENT_COUNT',literal:m[0],numberType:'COUNT',evidenceIds:e?[e.evidenceId]:[]});continue;
      }

      const deniedCopy=raw.match(/^不能根据.*OI(?:数量)?(?:增长|增加|下降|减少)([+-]?\d+(?:\.\d+)?)%就断定(?:多头|空头)(?:加仓|开仓)\d+(?:\.\d+)?%/);
      if(deniedCopy&&prefix.includes('就断定')&&rounded(deniedCopy[1],n)&&diagnostics.some(d=>d.code==='VERIFIED_NUMERIC_FACT'&&d.metric?.kind==='oi'&&d.window===win&&rounded(d.literal.replace('%','').trim(),n))){diagnostics.push({code:'VERIFIED_DENIED_INFERENCE_COPY',literal:m[0],window:win});continue;}
      const lastMetric=[...prefix.matchAll(/(?:价格|OI|未平仓|Funding|费率|占比|份额|回撤|回落|高点至|区间幅度|低点至高点|成交量|相对量)/gi)].at(-1)?.index ?? 0;
      const tail=prefix.slice(lastMetric);
      if(!/^[+-]/.test(n)&&/下降|下跌|减少|收缩|回撤|回落/.test(tail)&&!(kind?.kind==='ratio'&&unit==='%')&&!(kind?.kind==='funding'&&kind.variant==='latest'))value='-'+n;
      const candidates=available.filter(e=>{const k=e.typed;if(!k||!kind||k.kind!==kind.kind||k.unit!==unit)return false;
        if((e.window||k.window)&&(e.window||k.window)!==win)return false;
        if(localRefs.length&&!localRefs.includes(e.evidenceId))return false;
        if(kind.kind==='price'&&(k.previous!==kind.previous||k.rolling!==kind.rolling))return false;
        if(kind.kind==='ratio'&&(k.scope!==kind.scope||k.side!==kind.side))return false;
        if(kind.kind==='ratio'&&unit==='%'&&/从|到/.test(prefix)){
         const variant=prefix.lastIndexOf('到')>prefix.lastIndexOf('从')?'end':'start';if(k.endpointVariant!==variant)return false;
        }
        if(kind.kind==='funding'&&k.variant!==kind.variant)return false;
        // More than one unlabelled window is ambiguous even with equal values.
        return Boolean(win||!e.window||refs.includes(e.evidenceId));});
      const comparison=prefix.match(/(≤|≥|<=|>=|小于|大于)\s*$/)?.[1];
      const up=/上涨|上升|增长|增加|扩张/.test(tail),down=/下跌|下降|减少|收缩|回撤|回落/.test(tail);
      const signConsistent=e=>kind?.kind==='ratio'&&unit==='%'?!up&&!down:(!up||new Big(e.result).gte(0))&&(!down||new Big(e.result).lte(0));
      const futureIndex=[...prefix.matchAll(/未来|预计|预测|明天|后续|目标|将上涨|将下跌|future|forecast|target/gi)].at(-1)?.index ?? -1;
      const observedIndex=[...prefix.matchAll(/已收盘|过去|此前|参考|背景|基线|当前/gi)].at(-1)?.index ?? -1;
      const future=futureIndex>=0&&futureIndex>=observedIndex;
      if(kind?.kind==='volume'&&unit==='倍'&&Number(n)===1&&/回到|回升至|恢复至|均值|高于/.test(prefix)&&(/以上/.test(raw.slice(m.index+m[0].length))||/高于/.test(prefix))&&available.some(e=>e.typed?.kind==='volume'&&e.window===win&&/preceding 24 closed bars mean/.test(e.formula))){diagnostics.push({code:'VERIFIED_VOLUME_NORMALIZATION_BASELINE',literal:m[0],numberType:'MARKET_VALUE',window:win,evidenceIds:available.filter(e=>e.typed?.kind==='volume'&&e.window===win).map(e=>e.evidenceId)});continue;}
      let matched=future?[]:candidates.filter(e=>signConsistent(e)&&rounded(e.result,value));
      let rule=null;
      const ruleName=adjacentAfter.match(/(?:PRICE_OPPOSITE|OI_REVERSED)_(?:1|4|24)h/)?.[0]||prefix.match(/(?:PRICE_OPPOSITE|OI_REVERSED)_(?:1|4|24)h[^\d%]{0,5}$/)?.[0]?.match(/(?:PRICE_OPPOSITE|OI_REVERSED)_(?:1|4|24)h/)?.[0];
      if(!kind&&ruleName)kind={kind:ruleName.startsWith('PRICE')?'price':'oi'};
      const thresholdContext=/阈值|触及|接近|达到/.test(raw)&&(analysis.ruleContext||/后续|观察|跟踪/.test(raw));
      if(unit==='%'&&kind&&(ruleName||thresholdContext))rule=input.rules.find(r=>analysis.invalidation.ruleIds.includes(r.id)&&(!ruleName||r.id===ruleName)&&r.horizon===win&&r.metric===(kind.kind==='price'?'PRICE_CLOSED_CHANGE':kind.kind==='oi'?'OI_QUANTITY_CHANGE':null)&&rounded(r.threshold,n));

      if(unit==='%'&&comparison&&/≤|≥|<=|>=/.test(comparison)&&kind&&(analysis.ruleContext||/后续|观察|若|未来|回踩/.test(raw))){
        const operator=/≤|<=|小于/.test(comparison)?'LTE':'GTE';
        rule=input.rules.find(r=>analysis.invalidation.ruleIds.includes(r.id)&&r.horizon===win&&r.operator===operator&&r.metric===(kind.kind==='price'?'PRICE_CLOSED_CHANGE':kind.kind==='oi'?'OI_QUANTITY_CHANGE':null)&&rounded(r.threshold,n));
      }else if(comparison){
        matched=future?[]:candidates.filter(e=>{try{if(!signConsistent(e))return false;const v=new Big(e.result),b=new Big(n);return /≤|<=/.test(comparison)?v.lte(b):/≥|>=/.test(comparison)?v.gte(b):comparison==='小于'?v.lt(b):v.gt(b);}catch{return false;}});
      }
      diagnostics.push({code:rule?'VERIFIED_RULE_LITERAL':matched.length===1?'VERIFIED_NUMERIC_FACT':matched.length>1?'AMBIGUOUS_NUMERIC_FACT':'UNVERIFIED_NUMERIC_FACT',literal:m[0],numberType:unit==='pp'?'PERCENTAGE_POINT':unit==='%'?(kind?.kind==='funding'||kind?.kind==='ratio'?'MARKET_VALUE':'PERCENT_CHANGE'):unit==='倍'?'MARKET_VALUE':'OTHER',window:win,metric:kind,evidenceIds:matched.map(e=>e.evidenceId),ruleId:rule?.id ?? null});
    }
    if(localWindows.length)carriedWindow=localWindows.at(-1).h;
  }
  // Unsupported spellings, bare %, braces and non-Arabic numeric claims remain closed.
  const residue=clean.replace(numeric,'');
  if(/[{}%％０-９]|[零〇一二两三四五六七八九十百千万亿半]+\s*(小时|分钟|天|成|倍|元|美金|USDT)|百分之|千分之|胜率|准确率|概率|收益率|probability|win rate|accuracy/.test(residue))diagnostics.push({code:'UNSUPPORTED_NUMERIC_OR_PROBABILITY_LANGUAGE'});
  return {ok:diagnostics.every(d=>d.code.startsWith('VERIFIED_')),diagnostics};
}

// Denial applies to one assertion span. Contrast/conjunctions split it, so a
// neighbouring affirmative claim cannot borrow a negation from another span.
export function assertionSpans(text){return text.replace(/\{\{[^{}]+\}\}/g,' ').split(/[，,；;。！？\n]|但是|但|然而|不过|同时|而且|并且|因此|所以|可见|事实上|实际上|却|\bbut\b|\bhowever\b|\band\b/i).filter(Boolean);}
export function isDenied(span,index,allowScopeSuffix=false){
 const before=span.slice(0,index),after=span.slice(index);
 if(/不是不能|并非没有|不能否认|无法否认|并非不|不是不|not impossible|cannot deny|not unconfirmed/i.test(span))return false;
 const adjacentNegative=/(?:不|非)$/.test(before)&&/^(?:保证|一定|必然)/.test(after)||/\bnot\s*$/i.test(before)&&/^guarantee/i.test(after);
 const prefix=/(?:不能(?:仅凭|根据|据此)?|不(?:能|代表|证明|意味着|等于|构成|确认|保证|一定)|无法(?:据此|仅凭[^，,；;。！？]{0,15})?(?:确认|证明|定义|给出|判断)|未(?:接入|获取|确认)|缺乏|缺少|没有(?:可靠|明确|证据)?|无(?:明确|可靠|方向性)|而非|并非|不是|cannot(?: confirm| prove| infer)?|does not (?:prove|mean|imply|guarantee)|not guaranteed)[^，,；;。！？]{0,55}$/i.test(before);
 const suffix=allowScopeSuffix&&/^[^，,；;。！？]{0,25}(?:不能证明|不代表|不证明|不等于|并不意味着)/.test(after);
 return (prefix||suffix||adjacentNegative)&&!/但|却|就是|therefore|proves|guarantees/i.test(after)&&!/因此|所以|可以确定|已证实/.test(before.slice(Math.max(before.lastIndexOf('不能'),before.lastIndexOf('无法'),before.lastIndexOf('不证明'))));
}
export function semanticViolations(text){
 const patterns={UNAVAILABLE_INDICATOR_OR_STRUCTURE:/突破|跌破|支撑位|支撑价|支撑区|下方支撑|阻力|结构失效|高低点失守|MSS|BOS|FVG|CVD|Basis|基差|主动买|主动卖|流通市值|市值比|support (?:price|level)|resistance|confirmed structural reversal/gi,
  UNSUPPORTED_CAUSE_OR_ORDER:/资金.{0,6}(?:流入|流出)|净流入|净流出|加仓|减仓|回补|建仓|开多|开空|开仓|平仓|多头仓位|空头仓位|爆仓|强平|庄家|主力|聪明钱|获利了结|必涨|必跌|必然|保证|下单|杠杆|仓位大小|liquidations?|new (?:long|short) positions|(?:long|short) positions opened|capital inflows?|smart money|guarantee/gi,
  WRONG_ACCOUNT_OR_OI_SCOPE:/账户.{0,12}(?:持仓|仓位|资金(?!费率))|OI.{0,12}(?:多头|空头)|account ratio.{0,12}(?:position|capital)/gi};
 const diagnostics=[];
 for(const span of assertionSpans(text))for(const [code,re] of Object.entries(patterns))for(const m of span.replace(/未平仓/g,'合约').matchAll(re))diagnostics.push({code,match:m[0],span,denied:isDenied(span,m.index,code==='WRONG_ACCOUNT_OR_OI_SCOPE')});
 return diagnostics;
}
