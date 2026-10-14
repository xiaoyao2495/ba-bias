import fs from 'node:fs';
import {clockEvidence,validateAcquisition,inputAsOfAvailable} from './source-time.js';
import {endpoints} from '../../clients/binance.js';
import {buildFacts} from '../../market/facts-engine.js';
import {classify} from '../../market/detector.js';
import {CONTRACT,canonical,sha,freeze,fail} from './common.js';
export const knowledge=freeze(JSON.parse(fs.readFileSync(new URL('./knowledge.json',import.meta.url))));
export const knowledgeHash=sha(knowledge);
const clauses=knowledge.clauses.filter(k=>k.enabled&&['VERIFIED_MECHANISM','SUPPORTED_CONDITIONAL'].includes(k.verification)),sources=new Set(clauses.flatMap(k=>k.sourceIds));
export const reliableKnowledge=freeze({...knowledge,clauses,sources:knowledge.sources.filter(s=>sources.has(s.id))});
const positionFact=e=>e.endpoint===endpoints.topPositions||e.scope==='TOP_TRADER_POSITIONS'||/:topPositions\./u.test(e.evidenceId);
const positionWarning=w=>/topPositions|TOP_TRADER_POSITIONS|TOP_POSITION|顶部交易员.*持仓/u.test(w);
export function factType(id){return /:price\./u.test(id)?'PRICE':/:oi\./u.test(id)?'OPEN_INTEREST':/:volume\./u.test(id)?'VOLUME':/:funding\./u.test(id)?'FUNDING':'POSITIONING';}
export function buildInput(f,{factsAvailableAt,mode='LIVE',factsPackageSha256=sha(f),allowUnknownAcquisition=false}={}){
 if(!['LIVE','HISTORICAL_REPLAY'].includes(mode)||!Number.isSafeInteger(f.dataCutoff))throw fail('INVALID_RESEARCH_MODE_OR_CLOCK');
 const expected={exchange:endpoints.exchange,ticker:endpoints.ticker,premium:endpoints.premium,hour:endpoints.klines,five:endpoints.klines,oi:endpoints.oi,funding:endpoints.funding,accounts:endpoints.accounts,topAccounts:endpoints.topAccounts,topPositions:endpoints.topPositions,fundingInfo:endpoints.fundingInfo,serverTime:endpoints.time};
 const queryKeys=new Set(['symbol','interval','period','limit','startTime','endTime']);
 for(const [key,endpoint] of Object.entries(expected)){const source=f.sources?.[key];if(!source)continue;if(source.endpoint!==endpoint)throw fail('SOURCE_ENDPOINT_MISMATCH','FACT_GUARD');if(source.params?.symbol&&source.params.symbol!==f.symbol)throw fail('SOURCE_SYMBOL_MISMATCH','FACT_GUARD');if(Object.keys(source.params||{}).some(k=>!queryKeys.has(k)))throw fail('UNEXPECTED_SOURCE_QUERY_METADATA','FACT_GUARD');}
 const identity=f.sources?.exchange?.raw||f.identity;if(identity?.symbol!==f.symbol||!classify(identity).eligible)throw fail('IDENTITY_NOT_VERIFIED','FACTS');
 // Reuse the official arithmetic/verification only; no duplicated metric engine.
 const checked=buildFacts({runId:f.runId,symbol:f.symbol,identity:f.identity,ticker:f.sources?.ticker?.raw,sources:f.sources,cutoff:f.dataCutoff});
 if(!checked.price.closedWindows['1h']||!checked.volume.relative1h||!checked.openInterest.windows['4h']?.evidenceId)throw fail('INSUFFICIENT_EVIDENCE','FACTS');
 const original=new Map((f.evidence||[]).map(e=>[e.evidenceId,e]));
 if(original.size!==(f.evidence||[]).length)throw fail('DUPLICATE_FACT_ID','FACTS');
 for(const e of checked.evidence){const old=original.get(e.evidenceId);if(old&&(canonical(old.result)!==canonical(e.result)||canonical(old.dataTimes)!==canonical(e.dataTimes)))throw fail('FACT_SOURCE_VALUE_MISMATCH','FACT_GUARD');}
 if([...original.keys()].some(id=>!checked.evidence.some(e=>e.evidenceId===id)))throw fail('UNKNOWN_SOURCE_FACT','FACT_GUARD');
 const acquisition=Object.values(f.sources||{}).filter(s=>!s.error).map(s=>s.retrievedAt).filter(Number.isSafeInteger);
 const collected=acquisition.length?Math.max(...acquisition):null;
 const available=factsAvailableAt??collected;
 const hasClockMetadata=Object.values(f.sources||{}).some(s=>s.clockDomain||s.requestStartedAt!==undefined);
 const sourceTimeValidation=hasClockMetadata?clockEvidence(f.sources):null;
 if(!Number.isSafeInteger(available)||!inputAsOfAvailable({factsAsOf:f.dataCutoff,factsAvailableAt:available,sourceTimeValidation})||collected>available)throw fail('FACTS_AVAILABLE_TIME_UNPROVEN','CLOCK');
 if(mode==='LIVE'&&!allowUnknownAcquisition&&!sourceTimeValidation)throw fail('EXCHANGE_CLOCK_EVIDENCE_INSUFFICIENT','CLOCK');

 const excludedFacts=[],currentFacts=[],unknown=[];
 for(const e of checked.evidence){
  // Excluded at projection only: raw Facts and their arithmetic/source checks stay intact.
  if(positionFact(e))continue;
  if(e.evidenceId.endsWith(':topGlobal.divergence')){excludedFacts.push({factId:e.evidenceId,reason:'CONFIRMED_SEMANTIC_PRESENTATION_DEFECT'});continue;}
  const dataTimes=e.dataTimes.map(t=>t.ms);if(dataTimes.some(t=>!Number.isSafeInteger(t)||t>f.dataCutoff))throw fail('FUTURE_OR_INVALID_FACT_TIME','FACT_GUARD');
  const source=Object.values(f.sources).find(s=>s.endpoint===e.endpoint&&canonical(s.params||{})===canonical(e.params||{}));
  if(!source)throw fail('FACT_SOURCE_MISSING','FACT_GUARD');
  const retrievedAt=Number.isSafeInteger(source.retrievedAt)?source.retrievedAt:null;
  let timeProof=null;
  if(retrievedAt===null)unknown.push(e.evidenceId);else if(sourceTimeValidation)timeProof=validateAcquisition(source,dataTimes,f.dataCutoff,available,sourceTimeValidation);else if(retrievedAt>available||retrievedAt<Math.max(...dataTimes))throw fail('SOURCE_AVAILABLE_TIME_CONFLICT','CLOCK');
  const category=factType(e.evidenceId),suffix=e.evidenceId.split(':')[1],scope=e.scope||(/^(global|accounts)\./.test(suffix)?'GLOBAL_ACCOUNTS':suffix.startsWith('topAccounts.')?'TOP_TRADER_ACCOUNTS':suffix.startsWith('topPositions.')?'TOP_TRADER_POSITIONS':category);
  const unit=e.unit||(suffix.endsWith('.flip')?'status':/change\d+h|funding.change/.test(suffix)?'percentage_points':/volume.relative/.test(suffix)?'ratio':/volume\.(rolling24h|closed1h)|price.last/.test(suffix)?'USDT':'percent');
  const window=e.window||suffix.match(/(?:closed|change|relative|\.)(1|4|24|5)(h|m)/)?.slice(1).join('')||null;
  const denominator=scope==='GLOBAL_ACCOUNTS'?'global statistical net-direction accounts':scope==='TOP_TRADER_ACCOUNTS'?'top margin-balance sample accounts':scope==='TOP_TRADER_POSITIONS'?'top sample open position shares, not global OI':category==='OPEN_INTEREST'?'sumOpenInterest API quantity; multiplier unverified':e.formula;
  const fact={factId:e.evidenceId,originalId:e.evidenceId,category,scope,window,unit,denominator,value:structuredClone(e.result),dataTimes,sampleStart:Math.min(...dataTimes),sampleEnd:Math.max(...dataTimes),source:{endpoint:e.endpoint,params:e.params,retrievedAt},...(timeProof?{timeValidation:timeProof}:{}),timestampMeaning:e.timestampMeaning,formula:e.formula,description:e.phrase,status:suffix==='funding.display'?'DISPLAY_SNAPSHOT_NOT_SETTLED':category==='FUNDING'?'ACTUAL_SETTLEMENT':'OBSERVATION'};
  if(category==='VOLUME'&&suffix.includes('relative')){const bars=e.raw;fact.observationInterval={start:bars.at(-1)[0],end:bars.at(-1)[6]};fact.comparisonBaseline={start:bars[0][0],end:bars.at(-2)[6],count:bars.length-1};}
  currentFacts.push(fact);
 }
 if(mode==='LIVE'&&unknown.length&&!allowUnknownAcquisition)throw fail('SOURCE_ACQUISITION_TIME_UNKNOWN','CLOCK');
 const dataQuality={validForResearch:true,unavailableRequiredFactIds:[],unavailableOptionalFactIds:['global','topAccounts'].filter(k=>!checked.longShort[k]?.quality.available),sourceAcquisitionTimeUnknownFactIds:unknown,limitations:checked.warnings.filter(w=>!positionWarning(w)),qualitySource:'RUNNER_VERIFIED_FACTS'};
 const value={contract:CONTRACT,projectionVersion:'V2_ACCOUNT_RATIOS_ONLY_V1',symbol:f.symbol,mode,factsAsOf:f.dataCutoff,factsAvailableAt:available,factsCollectedAt:collected??(allowUnknownAcquisition?available:null),factsPackageSha256,...(sourceTimeValidation?{sourceTimeValidation}:{}),knowledgeRegistrySha256:knowledgeHash,currentFacts,excludedFacts,dataQuality,knowledge:reliableKnowledge};
 return freeze({...value,contextId:sha(value)});
}
