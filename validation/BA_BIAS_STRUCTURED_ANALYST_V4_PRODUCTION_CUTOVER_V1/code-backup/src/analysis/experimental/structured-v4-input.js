import {verifiedFacts} from '../../intelligence/packet.js';
import {directionalInput} from '../directional-context.js';
import {closedKlines} from '../../market/facts-engine.js';
import {EXPERIMENT} from './structured-v4-schema.js';
// Trusted in-process input capability: deserialized/model-mutated registries must
// be rebuilt from verified Facts, never treated as authoritative input.
const trusted=new WeakMap();
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
function typeOf(id){
 const key=id.split(':').slice(1).join(':');
 if(key==='price.last')return ['PRICE_SNAPSHOT','USDT'];
 if(key.startsWith('price.closed'))return ['PRICE_CLOSED_CHANGE','%'];
 if(key.startsWith('directional.price.previous'))return ['PREVIOUS_PRICE_CHANGE','%'];
 if(key==='price.rolling24h')return ['PRICE_ROLLING_CHANGE','%'];
 if(key==='price.drawdown')return ['SNAPSHOT_DRAWDOWN','%'];
 if(key==='price.rangeLowHigh')return ['RANGE_AMPLITUDE_NOT_BOUNDARY','%'];
 if(key.startsWith('oi.'))return ['OI_QUANTITY_CHANGE','%'];
 if(key.startsWith('volume.relative'))return ['RELATIVE_VOLUME','multiple'];
 if(key.startsWith('volume.'))return ['QUOTE_VOLUME','USDT'];
 if(key.startsWith('funding.'))return [key==='funding.change'?'SETTLED_FUNDING_CHANGE':'SETTLED_FUNDING',key==='funding.change'?'pp':'%'];
 if(/^(global|topAccounts|topPositions)\.(long|short)\.(latest|change)/.test(key))return [key.startsWith('topPositions')?'TOP_POSITION_SHARE':key.startsWith('topAccounts')?'TOP_ACCOUNT_SHARE':'GLOBAL_ACCOUNT_SHARE',key.includes('.change')?'pp':'%'];
 if(key.endsWith('.flip'))return ['ACCOUNT_DOMINANCE_FLIP','status'];
 if(key.includes('divergence'))return ['ACCOUNT_DIVERGENCE','pp'];
 return ['UNKNOWN','UNKNOWN'];
}
export function buildStructuredInput(originalFacts,{experimentalBarBoundaries=[]}={}){
 // Existing official arithmetic and validation, no new market requests/indicators.
 const facts=verifiedFacts(originalFacts),base=directionalInput(facts,{contractVersion:'DIRECTIONAL_ANALYST_V2'});
 const evidence=base.evidence.map(e=>{const [metricType,unit]=typeOf(e.evidenceId);return {evidenceId:e.evidenceId,symbol:base.symbol,metricType,value:e.result,unit,window:e.window??(e.evidenceId.endsWith('relative5m')?'5m':e.evidenceId.endsWith('closed1h')?'1h':null),scope:e.scope,observedAt:Math.max(...e.dataTimes),availableAt:'UNKNOWN',dataTimes:e.dataTimes,source:{endpoint:e.endpoint,params:e.params,formula:e.formula},semanticDescription:e.phrase};});
 const structures=[];
 // Optional explicit experimental source-row boundary, not inferred support,
 // resistance or a range. Default real-Facts path creates NO structure objects.
 // A supplied boundary must exactly name a closed source bar and its LOW/HIGH.
 const bars=closedKlines(facts.sources.hour?.raw||[],facts.dataCutoff,3600000);
 for(const b of experimentalBarBoundaries){
  if(Object.keys(b).sort().join(',')!=='kind,openTime'||!['BAR_LOW','BAR_HIGH'].includes(b.kind))throw Error('INVALID_STRUCTURE_PROOF');
  const row=bars.find(r=>r[0]===b.openTime);if(!row)throw Error('UNVERIFIED_STRUCTURE_SOURCE');
  const id=`${facts.symbol}:experimental.${b.kind}.${row[0]}`;
  if(structures.some(x=>x.evidenceId===id))throw Error('DUPLICATE_STRUCTURE_PROOF');
  const e={evidenceId:id,symbol:facts.symbol,metricType:b.kind,value:String(row[b.kind==='BAR_LOW'?3:2]),unit:'USDT',window:'1h',scope:'EXPLICIT_CLOSED_BAR_BOUNDARY_NOT_SUPPORT_RESISTANCE',observedAt:row[6],availableAt:'UNKNOWN',dataTimes:[row[0],row[6]],source:{endpoint:facts.sources.hour.endpoint,params:facts.sources.hour.params,formula:'exact supplied closed source row field '+(b.kind==='BAR_LOW'?'3':'2')},semanticDescription:`明确引用的已收盘单根小时K线${b.kind==='BAR_LOW'?'最低':'最高'}价；不等于区间边界或支撑阻力`};
  evidence.push(e);structures.push({evidenceId:id,kind:b.kind});
 }
 const input=freeze({version:EXPERIMENT,status:'NOT_PRODUCTION',causalBacktestEligible:false,probeMode:'POST_COLLECTION_HISTORICAL_RESEARCH',symbol:base.symbol,evaluationTime:base.evaluationTime,originalEvaluationTime:base.evaluationTime,availability:'UNKNOWN',evidence,structures,windows:base.windows,rules:base.rules});
 trusted.set(input,JSON.stringify(input));return input;
}
export function isTrustedInput(input){return trusted.has(input)&&trusted.get(input)===JSON.stringify(input);}
