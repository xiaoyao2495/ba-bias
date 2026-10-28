import Ajv from 'ajv';

export const SIMPLE_TREND_PROMPT=`Assess whether this 15-minute bullish candidate actually has an established upward trend using only supplied facts. BULL means supported upward trend, NEUTRAL means insufficient or conflicting evidence, and BEAR means facts better support a downtrend; do not force BULL. Return exactly one JSON object with five fields: bias, phase, evidenceStrength, supportingFactIds, conflictingFactIds. Do not return free text or other fields. bias: BULL, BEAR, or NEUTRAL. phase: ADVANCING, PULLBACK, CONSOLIDATING, or NONE; NEUTRAL uses NONE. evidenceStrength: STRONG, MODERATE, or WEAK. Both fact ID fields are arrays of unique exact supplied IDs and must not overlap. BULL needs INDICATORS_BULLISH or STRUCTURE_BULLISH support; BEAR needs INDICATORS_BEARISH or STRUCTURE_BEARISH support. NEUTRAL may have empty supporting facts. BEARISH_STRUCTURE_DAMAGED means a prior bearish structure was damaged; it neither establishes a bullish trend nor automatically contradicts BULL. Supporting and conflicting IDs must reflect their factual meaning; omit uncertain evidence. An ACTIVE_LEG HH is not a locked or confirmed locked HH. Do not infer a reverse trend solely from structure damage. Do not predict or recommend trades.`;
const schema={type:'object',additionalProperties:false,required:['bias','phase','evidenceStrength','supportingFactIds','conflictingFactIds'],properties:{bias:{enum:['BULL','BEAR','NEUTRAL']},phase:{enum:['ADVANCING','PULLBACK','CONSOLIDATING','NONE']},evidenceStrength:{enum:['STRONG','MODERATE','WEAK']},supportingFactIds:{type:'array',uniqueItems:true,items:{type:'string'}},conflictingFactIds:{type:'array',uniqueItems:true,items:{type:'string'}}}};
const validate=new Ajv({allErrors:true}).compile(schema);

function direction(id, entry, facts){
 const v=entry.value;
 const i=facts.indicators||{},common=Number.isFinite(i.adx14)&&i.adx14>=20&&Number.isFinite(i.er20)&&i.er20>=0.30;
 const bull=common&&i.ema20>i.ema50&&i.ema20Slope4>0&&i.plusDI14>i.minusDI14&&i.netChange20>0&&i.barsCloseAboveEma20Last8>=5;
 const bear=common&&i.ema20<i.ema50&&i.ema20Slope4<0&&i.minusDI14>i.plusDI14&&i.netChange20<0&&i.barsCloseBelowEma20Last8>=5;
 if(id==='INDICATORS_BULLISH')return v==='BULLISH_INDICATORS'&&facts.indicatorPath===v&&bull?'BULL':'INVALID';
 if(id==='INDICATORS_BEARISH')return v==='BEARISH_INDICATORS'&&facts.indicatorPath===v&&bear?'BEAR':'INVALID';
 if(id==='STRUCTURE_BULLISH')return v==='BULLISH_STRUCTURE'&&facts.structurePath===v&&facts.structure?.path===v?'BULL':'INVALID';
 if(id==='STRUCTURE_BEARISH')return v==='BEARISH_STRUCTURE'&&facts.structurePath===v&&facts.structure?.path===v?'BEAR':'INVALID';
 if(id==='INDICATOR_PATH')return v===facts.indicatorPath?({'BULLISH_INDICATORS':'BULL','BEARISH_INDICATORS':'BEAR'}[v]||null):'INVALID';
 if(id==='STRUCTURE')return v===facts.structurePath&&v===facts.structure?.path?({'BULLISH_STRUCTURE':'BULL','BEARISH_STRUCTURE':'BEAR'}[v]||null):'INVALID';
 if(id==='PRICE_15M')return Number.isFinite(v)&&v===facts.priceChange15m?(v>0?'BULL':v<0?'BEAR':null):'INVALID';
 if(id==='INDICATORS')return JSON.stringify(v)===JSON.stringify(facts.indicators)?null:'INVALID';
 // Structure damage is not evidence that the opposite trend exists.
 if(id.startsWith('BREAK_'))return Array.isArray(facts.structure?.events)&&facts.structure.events.some(e=>`BREAK_${e.referencePivotId}`===id&&JSON.stringify(e)===JSON.stringify(v)&&e.eventTime<=facts.evaluationTime)?null:'INVALID';
 if(/^(?:HIGH|LOW|AMBIGUOUS_DUAL_PIVOT)_\d+$/.test(id))return Array.isArray(facts.structure?.rawPivots)&&facts.structure.rawPivots.some(p=>p.id===id&&JSON.stringify(p)===JSON.stringify(v)&&p.confirmedAt<=facts.evaluationTime)?null:'INVALID';
 return null;
}
function displayReason(value,facts){
 const ids=value.supportingFactIds.concat(value.conflictingFactIds),parts=[];
 if(ids.some(id=>id==='INDICATORS'||id==='INDICATOR_PATH'||id.startsWith('INDICATORS_'))){const path=facts.indicatorPath;parts.push(path==='BULLISH_INDICATORS'?'15m 指标路径看涨':path==='BEARISH_INDICATORS'?'15m 指标路径看跌':'15m 指标方向不明确');const i=facts.indicators;if(i&&Number.isFinite(i.ema20)&&Number.isFinite(i.ema50))parts.push(`EMA20 ${i.ema20}，EMA50 ${i.ema50}`);}
 if(ids.some(id=>id==='STRUCTURE'||id.startsWith('STRUCTURE_'))){const structure=facts.structure;parts.push(structure?.path==='BULLISH_STRUCTURE'?'结构路径看涨':structure?.path==='BEARISH_STRUCTURE'?'结构路径看跌':'结构证据不足');const swings=Array.isArray(structure?.canonicalSwings)?structure.canonicalSwings:[];const last=swings.at(-1);if(last&&['HH','HL','LH','LL'].includes(last.classification)&&last.confirmedAt<=facts.evaluationTime){if(last.lockStatus==='LOCKED')parts.push(`已锁定结构 ${last.classification}`);else if(last.lockStatus==='ACTIVE_LEG')parts.push(`当前活动结构腿 ${last.classification}（未锁定）`);}}
 if(ids.some(id=>id==='INDICATOR_PATH'||id.startsWith('INDICATORS_'))&&ids.some(id=>id==='STRUCTURE'||id.startsWith('STRUCTURE_'))&&((facts.indicatorPath==='BULLISH_INDICATORS'&&facts.structurePath==='BEARISH_STRUCTURE')||(facts.indicatorPath==='BEARISH_INDICATORS'&&facts.structurePath==='BULLISH_STRUCTURE')))parts.push('指标与结构方向存在冲突');
 if(ids.some(id=>id.startsWith('BREAK_')))parts.push('引用了历史结构受损事件；不据此推断反向趋势');
 if(!parts.length)parts.push('引用的事实不足以生成方向说明');
 return parts.join('；')+'。';
}
export function checkSimpleJudge(value,facts){
 if(!validate(value)){const fields=new Set(Object.keys(schema.properties));return {ok:false,error:'SCHEMA_INVALID',issues:(validate.errors||[]).slice(0,20).map(e=>{const field=e.instancePath.split('/')[1]||e.params?.missingProperty;return {field:fields.has(field)?field:null,rule:e.keyword};})};}
 if(value.bias==='NEUTRAL'&&value.phase!=='NONE')return {ok:false,error:'NEUTRAL_PHASE_INVALID'};
 if(!Number.isSafeInteger(facts?.evaluationTime)||!facts.factIds||typeof facts.factIds!=='object')return {ok:false,error:'INVALID_FACTS'};
 const ids=[...value.supportingFactIds,...value.conflictingFactIds];
 if(ids.some(id=>!Object.hasOwn(facts.factIds,id)))return {ok:false,error:'UNKNOWN_FACT_ID'};
 if(ids.some(id=>{const f=facts.factIds[id];return !f||!Number.isSafeInteger(f.availableAt)||f.availableAt>facts.evaluationTime||(f.expiresAt!=null&&(!Number.isSafeInteger(f.expiresAt)||f.expiresAt<facts.evaluationTime));}))return {ok:false,error:'FACT_TIME_INVALID'};
 if(value.supportingFactIds.some(id=>value.conflictingFactIds.includes(id)))return {ok:false,error:'CONFLICTING_FACT_ROLES'};
 const directions=Object.fromEntries(ids.map(id=>[id,direction(id,facts.factIds[id],facts)]));
 if(Object.values(directions).includes('INVALID'))return {ok:false,error:'FACT_CONTENT_MISMATCH'};
 const opposite=value.bias==='BULL'?'BEAR':value.bias==='BEAR'?'BULL':null;
 if(opposite&&value.supportingFactIds.some(id=>directions[id]===opposite))return {ok:false,error:'SUPPORT_DIRECTION_CONFLICT'};
 if(opposite&&value.supportingFactIds.some(id=>id.startsWith('BREAK_')&&facts.factIds[id].value?.eventType===(value.bias==='BULL'?'BULLISH_STRUCTURE_DAMAGED':'BEARISH_STRUCTURE_DAMAGED')))return {ok:false,error:'SUPPORT_STRUCTURE_DAMAGE_MISMATCH'};
 if(opposite&&value.conflictingFactIds.some(id=>directions[id]===value.bias))return {ok:false,error:'CONFLICT_DIRECTION_MISMATCH'};
 // Damage to the opposite structure is not conflicting evidence against the
 // chosen direction, and damage does not itself establish a reverse trend.
 if(opposite&&value.conflictingFactIds.some(id=>id.startsWith('BREAK_')&&facts.factIds[id].value?.eventType===(value.bias==='BULL'?'BEARISH_STRUCTURE_DAMAGED':'BULLISH_STRUCTURE_DAMAGED')))return {ok:false,error:'CONFLICT_STRUCTURE_DAMAGE_MISMATCH'};
 if(opposite&&!value.supportingFactIds.some(id=>['INDICATORS_'+(value.bias==='BULL'?'BULLISH':'BEARISH'),'STRUCTURE_'+(value.bias==='BULL'?'BULLISH':'BEARISH')].includes(id)&&directions[id]===value.bias))return {ok:false,error:'UNSUPPORTED_CLASSIFICATION'};
 const phaseValid=value.phase==='NONE';
 return {ok:true,phase:phaseValid?'NONE':null,phaseStatus:phaseValid?'VALID':'UNVERIFIED',displayReason:displayReason(value,facts)};
}
