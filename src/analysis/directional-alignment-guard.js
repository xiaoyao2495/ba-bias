import {validateAlignmentReplay} from './directional-schema.js';
import {validateNumericText,semanticViolations,isDenied,assertionSpans,referenceIds,maskIdentifiers} from './evidence-precision-validator.js';
const fields=a=>Object.entries({horizonReason:a.horizonReason,marketThesis:a.marketThesis,marketMechanism:a.marketMechanism,preferredScenario:a.preferredScenario,alternativeScenario:a.alternativeScenario,invalidation:a.invalidation.description,...Object.fromEntries(a.followUpChecks.map((s,i)=>['followUp'+i,s]))});
const refs=referenceIds;
const certaintyDenied=(span,index)=>isDenied(span,index);
export function guardAlignedDirectional(a,input){
 const errors=[],diagnostics=[];
 if(!validateAlignmentReplay(a))return {ok:false,errors:['DIRECTIONAL_SCHEMA_INVALID'],diagnostics:[{code:'DIRECTIONAL_SCHEMA_INVALID',schemaErrors:structuredClone(validateAlignmentReplay.errors)}]};
 const map=new Map(input.evidence.map(e=>[e.evidenceId,e])),w=input.windows.find(w=>w.horizon===a.horizon);
 if(!w)return {ok:false,errors:['UNKNOWN_HORIZON'],diagnostics};
 if(a.symbol!==input.symbol||a.evaluationTime!==input.evaluationTime)errors.push('SYMBOL_OR_EVALUATION_MISMATCH');
 const prose=fields(a),textIds=prose.flatMap(([,s])=>refs(s)),selected=[...a.supportingEvidenceIds,...a.conflictingEvidenceIds],used=[...new Set([...selected,...textIds])];
 for(const id of used){const e=map.get(id);if(!e||!id.startsWith(input.symbol+':'))errors.push('UNKNOWN_EVIDENCE');else if(e.dataTimes.some(t=>t>Date.parse(input.evaluationTime)))errors.push('FUTURE_EVIDENCE');}
 const p=Number(map.get(w.priceId)?.result),o=Number(map.get(w.oiId)?.result),prior=Number(map.get(w.previousPriceId)?.result);
 const primaryPrice=a.supportingEvidenceIds.includes(w.priceId);
 if(a.marketBias!=='NO_EDGE'&&!primaryPrice)errors.push('PRICE_BASIS_REQUIRED');
 const activeOI=a.supportingEvidenceIds.includes(w.oiId);
 if(activeOI&&!w.aligned)errors.push('PRICE_OI_NOT_ALIGNED');
 if(!w.aligned&&a.conviction!=='LOW')errors.push('LOW_REQUIRED_FOR_MISSING_OR_UNALIGNED_OI');
 // Supporting observations may be from different windows. They do not become
 // contemporaneous primary evidence simply by being placed in one array.
 for(const id of a.supportingEvidenceIds){const e=map.get(id),price=map.get(w.priceId);if(e?.window===a.horizon&&id!==w.previousPriceId&&price&&!id.includes('rolling24h')&&Math.abs(e.dataTimes.at(-1)-price.dataTimes.at(-1))>1)errors.push('SUPPORT_SAMPLES_NOT_ALIGNED');}
 if(a.marketBias.includes('REVERSAL')&&(!primaryPrice||!a.supportingEvidenceIds.includes(w.previousPriceId)||!Number.isFinite(prior)||p*prior>=0))errors.push('PRIOR_TREND_REQUIRED');
 const directionSign=a.marketBias.startsWith('BULLISH')?1:a.marketBias.startsWith('BEARISH')?-1:0;
 if(a.marketBias.includes('REVERSAL')&&p*directionSign<=0)errors.push('REVERSAL_DIRECTION_NOT_SUPPORTED');
 const otherPrice=selected.some(id=>{const e=map.get(id);return e&&/:(?:price\.closed|directional.price.previous)/.test(id)&&Number(e.result)*directionSign>0;});
 if(directionSign&&p*directionSign<0&&!otherPrice&&!(activeOI&&p*o<0&&/假设|倾向|可能|偏多|偏空/.test(a.marketThesis)))errors.push('FORECAST_REASONING_UNSUPPORTED');
 if(a.marketBias==='NO_EDGE'&&input.windows.some(x=>x.strongContinuation)&&!selected.some(id=>{const e=map.get(id);return e&&e.scope!=='PREVIOUS_PRICE_WINDOW'&&((/:(price\.closed|oi\.)/.test(id)&&Number(e.result)*p<0)||id.endsWith(':volume.relative1h')&&Number(e.result)<1);})&&w.aligned)errors.push('NO_EDGE_NEEDS_REAL_CONFLICT');
 if(a.conviction==='HIGH'&&(!w.strongContinuation||p*directionSign<=0||a.conflictingEvidenceIds.length||a.marketBias==='NO_EDGE'||a.marketBias.includes('REVERSAL')||!activeOI||!a.supportingEvidenceIds.includes(input.symbol+':volume.relative1h')||a.horizon!=='1h'||input.windows.some(x=>Number(map.get(x.priceId)?.result)*p<0)||Number(map.get(input.symbol+':volume.relative1h')?.result)<2))errors.push('HIGH_NOT_SUPPORTED');
 if(['LONG_SETUP','SHORT_SETUP'].includes(a.tradeOpportunity))errors.push('ACTIONABLE_STRUCTURE_NOT_AVAILABLE');
 if(a.marketBias==='NO_EDGE'&&!['NO_ACTIONABLE_SETUP','WAIT_FOR_CONFIRMATION'].includes(a.tradeOpportunity))errors.push('NO_EDGE_SETUP_CONTRADICTION');
 for(const id of a.invalidation.ruleIds)if(!input.rules.some(r=>r.id===id&&r.horizon===a.horizon))errors.push('UNKNOWN_OR_MIXED_INVALIDATION');
 if(a.invalidation.type==='PRICE_STRUCTURE_INVALIDATION')errors.push('STRUCTURE_NOT_AVAILABLE');
 if(a.invalidation.type==='OBSERVABLE_CONDITION'&&directionSign&&p*directionSign<0)errors.push('INVALIDATION_RULE_DIRECTION_CONFLICT');
 if(a.invalidation.type==='OBSERVABLE_CONDITION'&&a.marketBias!=='NO_EDGE'&&!a.invalidation.ruleIds.includes('PRICE_OPPOSITE_'+a.horizon))errors.push('PRICE_INVALIDATION_REQUIRED');
 if(a.invalidation.type==='METRIC_BASED_REASSESSMENT'&&a.invalidation.ruleIds.some(id=>input.rules.find(r=>r.id===id)?.outcome==='INVALIDATED'))errors.push('QUALITATIVE_REASSESSMENT_CANNOT_AUTO_INVALIDATE');
 if(a.invalidation.type==='INSUFFICIENT_STRUCTURE_DATA'&&a.invalidation.ruleIds.length)errors.push('INVALIDATION_TYPE_CONFLICT');
 const allCurrentRules=input.rules.filter(r=>r.horizon===a.horizon).map(r=>r.id);
 for(const [field,text] of prose){
  const role=field==='marketMechanism'?'MECHANISM':field==='horizonReason'?'OBSERVATION_AND_HORIZON':field==='invalidation'?'REASSESSMENT':'FORECAST_HYPOTHESIS';
  // Text references are explicit Registry observations, even when background
  // evidence is not selected as the model's primary support or conflict.
  const numericContext={...a,ruleContext:field==='invalidation'||field.startsWith('followUp'),supportingEvidenceIds:used,conflictingEvidenceIds:[],invalidation:{...a.invalidation,ruleIds:field==='invalidation'||field.startsWith('followUp')?allCurrentRules:a.invalidation.ruleIds}};
  const numeric=validateNumericText(text.replace(/非胜率|不代表胜率|不提供胜率|不是胜率/g,'定性强度'),input,numericContext);
  diagnostics.push(...numeric.diagnostics.map(d=>({...d,field,role})));if(!numeric.ok)errors.push('UNTRUSTED_NUMBER_OR_PROBABILITY');
  for(const d of semanticViolations(text)){
   let allowed=d.denied||d.code==='WRONG_ACCOUNT_OR_OI_SCOPE'&&/^OI[^，,；;。！？]{0,12}(?:不能证明|不代表|无法确定)(?:新增|多头|空头)/i.test(d.match);
   const h=d.span.match(/(?:^|[^\d])(1|4|24)(?:h|小时)/)?.[1],window=input.windows.find(x=>x.horizon===(h?h+'h':a.horizon));
   const price=map.get(window?.priceId),oi=map.get(window?.oiId),bound=Boolean(window?.aligned&&price&&oi&&used.includes(price.evidenceId)&&used.includes(oi.evidenceId));
   const conditional=/可能|假设|更符合|相容|或存量|而非/.test(d.span)&&!/已经|必然|确定|净增仓|持续加仓|说明|证实/.test(d.span);
   const closing=/回补|减仓|平仓/.test(d.match),opening=/加仓|建仓|开多|开空|开仓/.test(d.match);
   if(role==='MECHANISM'&&bound&&conditional&&(closing||opening)&&(!closing||Number(oi.result)<0)&&(!opening||Number(oi.result)>0))allowed=true;
   // An OI sentence denying/conferring a conditional single-side explanation
   // is not a factual assertion of an OI directional position share.
   if(d.code==='WRONG_ACCOUNT_OR_OI_SCOPE'&&role==='MECHANISM'&&bound&&conditional&&/^OI/i.test(d.match)&&!/仓位占比|持仓占比|资金比例/.test(d.span))allowed=true;
   if(d.code==='UNAVAILABLE_INDICATOR_OR_STRUCTURE'&&/^(突破|跌破)$/.test(d.match)&&/输入规则|反向阈值|指标阈值/.test(d.span)&&numeric.diagnostics.some(x=>x.code==='VERIFIED_RULE_LITERAL'))allowed=true;
   diagnostics.push({...d,field,role,allowed,code:allowed?'PERMITTED_'+d.code:d.code});if(!allowed)errors.push(d.code);
  }
  const record=code=>{errors.push(code);diagnostics.push({code,field,role,path:field==='invalidation'?'/invalidation/description':field.startsWith('followUp')?'/followUpChecks/'+field.slice(8):'/'+field});};
  const plain=maskIdentifiers(text,input);
  for(const span of assertionSpans(plain)){
   // Observed co-movement is a fact, unlike the forecast it may support.
   const h=span.match(/(?:^|[^\d])(1|4|24)(?:h|小时)/)?.[1],window=input.windows.find(x=>x.horizon===(h?h+'h':a.horizon));
   const price=Number(map.get(window?.priceId)?.result),oi=Number(map.get(window?.oiId)?.result);
   if(/价格与(?:OI|参与量|持仓量)(?:同步|同向)(?:扩张|上升|增长|走高|走弱|收缩)/.test(span)&&price*oi<=0&&!/若|如果|后续|未来/.test(span))record('QUALITATIVE_FACT_CONTRADICTION');
   for(const m of span.matchAll(/(?:敞口|仓位).{0,8}(?:与价格方向一致|在(?:偏多|偏空|上涨|下跌)方向(?:累积|建立))|(?:空方|多方|多头|空头).{0,6}更愿意持有/g))if(!certaintyDenied(span,m.index)&&!isDenied(span,m.index))record('OI_DIRECTION_OR_INTENT_UNSUPPORTED');
   for(const m of span.matchAll(/必涨|必跌|必然|保证|一定(?:上涨|下跌)|已经确定|(?:趋势|结构).{0,12}(?:已经|已确认|确认).{0,8}反转|反转.{0,5}(?:已确认|已经确认)/g))if(!certaintyDenied(span,m.index))record('FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED');
   for(const m of span.matchAll(/抛压已现|(?:追多|追空|多头|空头)拥挤/g))if(!isDenied(span,m.index)&&!/若|如果|可能|风险假设/.test(span.slice(0,m.index))&&!/^(?:可能|或许)/.test(span.slice(m.index+m[0].length)))record('UNVERIFIED_PARTICIPANT_STATE');
   if(/缺失|未接入|不可用/.test(span)&&/中性|看平/.test(span)&&!/不等于|不能|不代表/.test(span))record('MISSING_DATA_IS_NOT_NEUTRAL');
   if(/支付|付给|付费/.test(span)){
    const m=span.match(/多头(?:向空头支付|支付(?:给)?空头)|空头(?:向多头支付|支付(?:给)?多头)/),relation=m?.[0].startsWith('多头')?'多头支付空头':m?'空头支付多头':null;
    const funding=map.get(input.symbol+':funding.latest');if(!relation||!used.includes(funding?.evidenceId)||!funding?.phrase.includes(relation))record('FUNDING_DIRECTION_MUST_USE_EVIDENCE');
   }
   for(const m of span.matchAll(/\b[A-Za-z0-9]+USDT\b/gi))if(m[0]!==input.symbol)record('UNTRUSTED_SYMBOL_OR_METRIC');
   let words=span;for(const word of ['BULLISH_REVERSAL','BEARISH_REVERSAL','BULLISH','BEARISH','NO_EDGE','LONG','SHORT','OI','Funding','LOW','MODERATE','HIGH','USDT','THESIS_WARNING','INVALIDATED','INSUFFICIENT_STRUCTURE_DATA',...allCurrentRules])words=words.replaceAll(word,'');
   for(const m of words.matchAll(/\b[A-Z][A-Z0-9]{1,20}\b/g))if(!isDenied(words,m.index))record('UNTRUSTED_SYMBOL_OR_METRIC');
  }
 }
 const thesis=a.marketThesis;
 if(a.marketBias.startsWith('BEARISH')&&/倾向上涨|上涨延续|偏多|\bBULLISH\b/.test(thesis)||a.marketBias.startsWith('BULLISH')&&/倾向下跌|下跌延续|偏空|\bBEARISH\b/.test(thesis))errors.push('THESIS_DIRECTION_CONTRADICTION');
 if(errors.length){const paths={PRICE_BASIS_REQUIRED:'/supportingEvidenceIds',FORECAST_REASONING_UNSUPPORTED:'/marketThesis',NO_EDGE_NEEDS_REAL_CONFLICT:'/conflictingEvidenceIds',HIGH_NOT_SUPPORTED:'/conviction',PRIOR_TREND_REQUIRED:'/supportingEvidenceIds',REVERSAL_DIRECTION_NOT_SUPPORTED:'/marketBias',ACTIONABLE_STRUCTURE_NOT_AVAILABLE:'/tradeOpportunity',NO_EDGE_SETUP_CONTRADICTION:'/tradeOpportunity',THESIS_DIRECTION_CONTRADICTION:'/marketThesis'};for(const code of new Set(errors))if(!diagnostics.some(d=>d.code===code))diagnostics.push({code,path:paths[code]||(/INVALIDATION|STRUCTURE_NOT_AVAILABLE|REASSESSMENT/.test(code)?'/invalidation':'/')});return {ok:false,errors:[...new Set(errors)],diagnostics,contractVersion:'DIRECTIONAL_ANALYST_V2'};}
 const render=s=>s.replace(/\{\{([^{}]+)\}\}/g,(_,id)=>map.get(id).phrase);
 return {ok:true,errors:[],diagnostics,contractVersion:'DIRECTIONAL_ANALYST_V2',referencedEvidenceIds:used,rendered:Object.fromEntries(['horizonReason','marketThesis','marketMechanism','preferredScenario','alternativeScenario'].map(k=>[k,render(a[k])]).concat([['invalidationDescription',render(a.invalidation.description)],['followUpChecks',a.followUpChecks.map(render)]]))};
}
