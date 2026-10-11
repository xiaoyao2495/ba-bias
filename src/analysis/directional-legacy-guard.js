// Frozen VALIDATION_RECOVERY_V1 semantics for V1 snapshots.
import {validateDirectional} from './directional-schema.js';
import {validateNumericText,semanticViolations,isDenied,assertionSpans} from './evidence-text-validator.js';
const idFunding=e=>e?.evidenceId.endsWith(':funding.latest');
const proseFields=a=>[a.horizonReason,a.marketThesis,a.marketMechanism,a.preferredScenario,a.alternativeScenario,a.invalidation.description,...a.followUpChecks];
export function guardLegacyDirectional(a,input){
  const errors=[],diagnostics=[];if(!validateDirectional(a))return {ok:false,errors:['DIRECTIONAL_SCHEMA_INVALID'],diagnostics:[{code:'DIRECTIONAL_SCHEMA_INVALID',schemaErrors:structuredClone(validateDirectional.errors)}]};
  if(a.symbol!==input.symbol||a.evaluationTime!==input.evaluationTime)errors.push('SYMBOL_OR_EVALUATION_MISMATCH');
  const map=new Map(input.evidence.map(e=>[e.evidenceId,e])),w=input.windows.find(w=>w.horizon===a.horizon);
  if(!w.allowedBiases.includes(a.marketBias))errors.push('PRICE_DIRECTION_OR_REVERSAL_UNSUPPORTED');
  const ids=[...a.supportingEvidenceIds,...a.conflictingEvidenceIds];
  for(const id of ids){const e=map.get(id);if(!e)errors.push('UNKNOWN_EVIDENCE');else if(e.dataTimes.some(t=>t>Date.parse(input.evaluationTime)))errors.push('FUTURE_EVIDENCE');}
  for(const id of a.supportingEvidenceIds){const e=map.get(id);if(e?.window&&e.window!==a.horizon)errors.push('MIXED_SUPPORT_WINDOWS');}
  for(const id of a.supportingEvidenceIds){const e=map.get(id),price=map.get(w.priceId);if(e?.window&&id!==w.previousPriceId&&price&&Math.abs(e.dataTimes.at(-1)-price.dataTimes.at(-1))>1)errors.push('SUPPORT_SAMPLES_NOT_ALIGNED');}
  if(a.marketBias!=='NO_EDGE'&&(!w.priceId||!a.supportingEvidenceIds.includes(w.priceId)))errors.push('PRICE_BASIS_REQUIRED');
  if(a.marketBias.includes('REVERSAL')&&(!w.previousPriceId||!a.supportingEvidenceIds.includes(w.previousPriceId)))errors.push('PRIOR_TREND_REQUIRED');
  if(w.oiId&&a.supportingEvidenceIds.includes(w.oiId)&&!w.aligned)errors.push('PRICE_OI_NOT_ALIGNED');
  if(a.marketBias==='NO_EDGE'&&input.windows.some(x=>x.strongContinuation)&&!a.conflictingEvidenceIds.some(id=>{const e=map.get(id);return e&&e.scope!=='PREVIOUS_PRICE_WINDOW'&&((e.window&&['price','oi'].some(k=>id.includes(':'+k+'.'))&&Number(e.result)*Number(map.get(w.priceId)?.result)<0)||id.includes('topGlobal.divergence'));}))errors.push('NO_EDGE_NEEDS_REAL_CONFLICT');
  if(!w.aligned&&a.conviction!=='LOW')errors.push('LOW_REQUIRED_FOR_MISSING_OR_UNALIGNED_OI');
  if(a.conviction==='HIGH'&&(!w.strongContinuation||a.conflictingEvidenceIds.length||a.marketBias==='NO_EDGE'||a.marketBias.includes('REVERSAL')||!a.supportingEvidenceIds.includes(w.oiId)||!a.supportingEvidenceIds.includes(input.symbol+':volume.relative1h')||a.horizon!=='1h'||input.windows.some(x=>x.priceId&&Number(map.get(x.priceId)?.result)*Number(map.get(w.priceId)?.result)<0)||Number(map.get(input.symbol+':volume.relative1h')?.result)<2))errors.push('HIGH_NOT_SUPPORTED');
  if(['LONG_SETUP','SHORT_SETUP'].includes(a.tradeOpportunity))errors.push('ACTIONABLE_STRUCTURE_NOT_AVAILABLE');
  if(a.marketBias==='NO_EDGE'&&a.tradeOpportunity!=='NO_ACTIONABLE_SETUP'&&a.tradeOpportunity!=='WAIT_FOR_CONFIRMATION')errors.push('NO_EDGE_SETUP_CONTRADICTION');
  if(a.marketBias!=='NO_EDGE'&&a.invalidation.type==='OBSERVABLE_CONDITION'&&!a.invalidation.ruleIds.includes('PRICE_OPPOSITE_'+a.horizon))errors.push('PRICE_INVALIDATION_REQUIRED');
  if(a.invalidation.type==='INSUFFICIENT_STRUCTURE_DATA'&&a.invalidation.ruleIds.length)errors.push('INVALIDATION_TYPE_CONFLICT');
  for(const id of a.invalidation.ruleIds)if(!input.rules.some(r=>r.id===id&&r.horizon===a.horizon))errors.push('UNKNOWN_OR_MIXED_INVALIDATION');
  // Literal facts are verified against the declared evidence registry; unavailable
  // measurements and causal assertions still fail. Placeholders render exactly.
  for(const [fieldIndex,text] of proseFields(a).entries()){
    const refs=[...text.matchAll(/\{\{([^{}]+)\}\}/g)].map(m=>m[1]);
    for(const id of refs)if(!ids.includes(id)||!map.has(id))errors.push('UNDECLARED_TEXT_EVIDENCE');
    const p=text.replace(/\{\{[^{}]+\}\}/g,'');
    const numeric=validateNumericText(text,input,a);diagnostics.push(...numeric.diagnostics.map(d=>({...d,fieldIndex})));
    if(!numeric.ok)errors.push('UNTRUSTED_NUMBER_OR_PROBABILITY');
    const semantic=semanticViolations(text);diagnostics.push(...semantic.map(d=>({...d,fieldIndex})));
    for(const d of semantic)if(!d.denied)errors.push(d.code);
    for(const span of assertionSpans(text))if(/支付|付给|付费/.test(span)){
      const payment=span.match(/多头支付空头|空头支付多头|多头向空头支付|空头向多头支付|多头支付给空头|空头支付给多头/);
      const relation=payment?.[0].startsWith('多头')?'多头支付空头':payment?'空头支付多头':null;
      const funding=refs.map(id=>map.get(id)).find(e=>idFunding(e)&&ids.includes(e.evidenceId));
      if(!payment||!funding||!funding.phrase.includes(relation))errors.push('FUNDING_DIRECTION_MUST_USE_EVIDENCE');
    }
    for(const flip of p.matchAll(/(SHORT|LONG)\s*(?:→|转为|转|->)\s*(SHORT|LONG)/g)){
      const verified=refs.map(id=>map.get(id)).some(e=>e?.evidenceId.endsWith(':global.flip')&&e.phrase.includes(flip[1]+' → '+flip[2]));
      if(!verified)errors.push('UNVERIFIED_ACCOUNT_FLIP_DESCRIPTION');
    }
    // Known contract labels are vocabulary, never new market measurements.
    const vocabulary=['OI','Funding','NO_EDGE','BULLISH_REVERSAL','BEARISH_REVERSAL','BULLISH','BEARISH','SHORT','LONG','THESIS_WARNING',...a.invalidation.ruleIds];
    let untrusted=p;for(const token of vocabulary)untrusted=untrusted.replaceAll(token,'');
    for(const span of assertionSpans(untrusted))for(const m of span.matchAll(/\b[A-Z][A-Z0-9]{1,20}\b/g))if(!isDenied(span,m.index))errors.push('UNTRUSTED_SYMBOL_OR_METRIC');
  }
  const directionalProse=[a.marketThesis,a.preferredScenario].join(' ');
  if(a.marketBias.startsWith('BEARISH')&&/倾向上涨|上涨延续|偏多|\bBULLISH(?:_REVERSAL)?\b/.test(directionalProse)||a.marketBias.startsWith('BULLISH')&&/倾向下跌|下跌延续|偏空|\bBEARISH(?:_REVERSAL)?\b/.test(directionalProse))errors.push('THESIS_DIRECTION_CONTRADICTION');
  if(errors.length)return {ok:false,errors:[...new Set(errors)],diagnostics};
  const render=s=>s.replace(/\{\{([^{}]+)\}\}/g,(_,id)=>map.get(id).phrase);
  return {ok:true,errors:[],diagnostics,rendered:Object.fromEntries(['horizonReason','marketThesis','marketMechanism','preferredScenario','alternativeScenario'].map(k=>[k,render(a[k])]).concat([['invalidationDescription',render(a.invalidation.description)],['followUpChecks',a.followUpChecks.map(render)]]))};
}
