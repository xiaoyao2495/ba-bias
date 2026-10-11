import Big from 'big.js';
import {closedKlines,pct} from '../market/facts-engine.js';
import {validateInput} from './directional-schema.js';
const HOUR=3600000;
function windowOf(id){const m=id.match(/:(?:price\.closed|oi\.)(1|4|24)h$/)||id.match(/:(?:global|topAccounts|topPositions)\.(?:long|short)\.change(1|4|24)h$/);return m?m[1]+'h':[':price.rolling24h',':price.rangeLowHigh',':price.drawdown',':volume.rolling24h'].some(key=>id.endsWith(key))?'24h':id.endsWith(':volume.relative1h')?'1h':id.includes('directional.price.previous')?id.match(/(1|4|24)h$/)[1]+'h':null;}
export function directionalInput(f,{contractVersion='DIRECTIONAL_ANALYST_V1'}={}){
  const cutoff=f.dataCutoff,ev=[];
  // Rebuilt Facts are the only input. Legacy unvalidated account snapshots and
  // display funding cannot become a directional basis.
  for(const e of f.evidence){
    if(!e.dataTimes?.length||e.dataTimes.some(t=>!Number.isSafeInteger(t.ms)||t.ms>cutoff))continue;
    if(e.evidenceId.endsWith(':accounts.short')||e.evidenceId.endsWith(':funding.display')||contractVersion!=='DIRECTIONAL_ANALYST_V2'&&e.evidenceId.endsWith(':volume.relative5m'))continue;
    ev.push({evidenceId:e.evidenceId,result:e.result,phrase:e.phrase,dataTimes:e.dataTimes.map(t=>t.ms),formula:e.formula,endpoint:e.endpoint,params:e.params || {},scope:e.scope ?? null,window:windowOf(e.evidenceId)});
  }
  const bars=closedKlines(f.sources.hour?.raw || [],cutoff,HOUR);
  const windows=[],rules=[];
  for(const h of [1,4,24]){
    const horizon=h+'h',price=f.price.closedWindows[horizon],oi=f.openInterest.windows[horizon];
    let previousPriceId=null;
    // Previous equal-length closed price window is deterministic arithmetic on
    // existing validated hourly bars, not a newly invented structure indicator.
    const sequence=bars.slice(-h*2),prior=sequence.slice(0,h);
    if(price&&sequence.length===h*2&&sequence.every((b,i)=>!i||b[0]===sequence[i-1][0]+HOUR)){
      previousPriceId=f.symbol+':directional.price.previous'+horizon;
      ev.push({evidenceId:previousPriceId,result:pct(prior.at(-1)[4],prior[0][1]),phrase:`此前已收盘${h}小时价格变化 ${new Big(pct(prior.at(-1)[4],prior[0][1])).toFixed(2)}%`,dataTimes:[prior[0][0],prior.at(-1)[6]],formula:'(previous equal-length closed window close/open - 1)*100',endpoint:f.sources.hour.endpoint,params:f.sources.hour.params,scope:'PREVIOUS_PRICE_WINDOW',window:horizon});
    }
    const aligned=Boolean(price&&oi?.evidenceId&&Math.abs(price.dataTimes.at(-1).ms-oi.dataTimes.at(-1).ms)<=1);
    const p=Number(price?.result),o=Number(oi?.result),priorP=Number(ev.find(e=>e.evidenceId===previousPriceId)?.result);
    const allowedBiases=['NO_EDGE'];
    if(price&&p!==0){allowedBiases.push(p>0?'BULLISH':'BEARISH');if(previousPriceId&&p*priorP<0)allowedBiases.push(p>0?'BULLISH_REVERSAL':'BEARISH_REVERSAL');}
    // Strength requires meaningful price displacement and aligned contract size
    // expansion; account/funding extremes cannot mechanically force a bias.
    const strongContinuation=aligned&&Math.abs(p)>=1&&o>=5&&!(previousPriceId&&p*priorP<0);
    windows.push({horizon,priceId:price?.evidenceId || null,oiId:oi?.evidenceId || null,previousPriceId,aligned,allowedBiases,strongContinuation});
    if(price&&p!==0){const threshold=Math.max(1,Math.abs(p)/2)*(p>0?-1:1);rules.push({id:`PRICE_OPPOSITE_${horizon}`,horizon,metric:'PRICE_CLOSED_CHANGE',operator:p>0?'LTE':'GTE',threshold,outcome:'INVALIDATED',description:`后续新收盘滚动${horizon}价格变化${p>0?'≤':'≥'}${threshold.toFixed(4)}%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守`,baselineEvidenceId:price.evidenceId});}
    if(aligned&&o!==0){const threshold=Math.max(5,Math.abs(o)/2)*(o>0?-1:1);rules.push({id:`OI_REVERSED_${horizon}`,horizon,metric:'OI_QUANTITY_CHANGE',operator:o>0?'LTE':'GTE',threshold,outcome:'THESIS_WARNING',description:`后续新采样精确${horizon} OI数量变化${o>0?'≤':'≥'}${threshold.toFixed(4)}%，原敞口变化条件明显逆转，只触发复核`,baselineEvidenceId:oi.evidenceId});}
  }
  const ref=f.price.current;
  const input={version:'DIRECTIONAL_INPUT_V1',symbol:f.symbol,evaluationTime:new Date(cutoff).toISOString(),entryReference:ref?{price:String(ref.result),timestamp:ref.dataTimes.at(-1).ms,evidenceId:ref.evidenceId}:null,
    capabilities:{priceStructure:false,takerFlow:false,cvd:false,basis:false,oiMarketCap:false},evidence:ev,windows,rules,unavailable:['未接入可靠价格结构、主动买卖量、CVD、Basis、OI/流通市值',...['topAccounts','topPositions'].filter(k=>!f.longShort?.[k]?.quality.available).map(k=>`${k}:${f.longShort?.[k]?.quality.reason || 'SOURCE_MISSING'}`)]};
  if(contractVersion==='DIRECTIONAL_ANALYST_V2'){
    input.contractVersion=contractVersion;
    input.windows=input.windows.map(w=>{const {allowedBiases,...window}=w;return {...window,observedPriceSign:Math.sign(Number(ev.find(e=>e.evidenceId===w.priceId)?.result)||0),reversalEvidenceAvailable:Boolean(w.previousPriceId&&Number(ev.find(e=>e.evidenceId===w.previousPriceId)?.result)*Number(ev.find(e=>e.evidenceId===w.priceId)?.result)<0)};});
    input.evidenceGuide={allowedEvidenceIds:ev.map(e=>e.evidenceId),primaryPriceByHorizon:Object.fromEntries(windows.map(w=>[w.horizon,w.priceId])),previousPriceByHorizon:Object.fromEntries(windows.map(w=>[w.horizon,w.previousPriceId])),referenceRule:'All textual references must exist in evidence. Supporting/conflicting arrays describe argumentative roles, not an exhaustive list of background observations. Different windows retain their own labels and times.'};
    input.contentContract={observation:'Registry facts only; exact metric/unit/window/scope, no future observations.',mechanism:'Conditional possible explanation supported by price and OI; not a confirmed opening, closing, liquidation or funds-flow claim.',forecast:'marketThesis/preferredScenario/alternativeScenario are uncertain horizon-bound hypotheses; evidence verifies inputs, not future truth.',invalidation:'Only selected predefined INVALIDATED rules automate invalidation. Qualitative reassessment does not.'};
  }
  if(!validateInput(input))throw new Error('DIRECTIONAL_INPUT_INVALID');return input;
}
export function suggestedHorizon(input){
  return input.windows.find(w=>w.strongContinuation)?.horizon || input.windows.find(w=>w.priceId&&Number(input.evidence.find(e=>e.evidenceId===w.priceId).result)!==0)?.horizon || '1h';
}
