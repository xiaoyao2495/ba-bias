import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {openResearchLedger,researchEligibility,reserveResearch,completeResearch,failKnownResearch,updateMarketFacts,recoverPendingResearch} from './research-ledger.js';
import {atomicWrite,readJson} from '../storage/history.js';
import {endpoints} from '../clients/binance.js';
import {classify} from '../market/detector.js';
import {buildFacts} from './facts.js';
import {TREND_SIMPLE_CONFIG,DATA_NAMESPACE} from './config.js';
export {TREND_SIMPLE_CONFIG} from './config.js';
const judgeInput=f=>({symbol:f.symbol,timeframe:f.timeframe,evaluationTime:f.evaluationTime,price:f.price,priceChange5m:f.priceChange5m,indicators:f.indicators,indicatorHistory:f.indicatorHistory,structurePath:f.structurePath,indicatorPath:f.indicatorPath,structure:f.structure,factIds:f.factIds,dataQuality:f.dataQuality});
import {SIMPLE_TREND_PROMPT,checkSimpleJudge} from './structured-judge.js';
export {SIMPLE_TREND_PROMPT} from './structured-judge.js';
import {safeError} from '../config.js';
import {buildRankingSnapshot} from './ranking-snapshot.js';

export const SLOT=300000;
export function roundId(cycle){if(!Number.isSafeInteger(cycle)||cycle%SLOT)throw Error('INVALID_CYCLE');const s=new Date(cycle).toISOString();return `TREND_SIMPLE_5M_V1_${s.slice(0,10).replaceAll('-','')}_${s.slice(11,16).replace(':','')}`;}
export function rankBullishCandidates(rows){const unique=new Map();for(const r of rows){if(!r?.facts||!r.symbol||unique.has(r.symbol))continue;const i=r.facts.indicatorPath,s=r.facts.structurePath;if(i==='BEARISH_INDICATORS'||s==='BEARISH_STRUCTURE')continue;const ib=i==='BULLISH_INDICATORS',sb=s==='BULLISH_STRUCTURE';if(!ib&&!sb)continue;if(!ib&&!['MIXED_INDICATORS','INSUFFICIENT_INDICATORS'].includes(i))continue;if(!sb&&!['MIXED_STRUCTURE','INSUFFICIENT_STRUCTURE'].includes(s))continue;unique.set(r.symbol,{...r,priority:ib&&sb?1:ib?2:3});}return [...unique.values()].sort((a,b)=>a.priority-b.priority||(b.facts.indicators.adx14??-Infinity)-(a.facts.indicators.adx14??-Infinity)||(b.facts.indicators.er20??-Infinity)-(a.facts.indicators.er20??-Infinity)||(a.symbol<b.symbol?-1:a.symbol>b.symbol?1:0));}
export function selectCandidates(rows){return rankBullishCandidates(rows).slice(0,Math.min(TREND_SIMPLE_CONFIG.selection.topK,TREND_SIMPLE_CONFIG.llm.maxSymbolsPerRound));}
async function pool(items,limit,fn){let i=0;await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(i<items.length){const n=i++;await fn(items[n],n);}}));}
export async function recoverInterrupted(dataDir,{now=Date.now,onProjectionSaved=()=>{}}={}){
 const root=path.resolve(dataDir,DATA_NAMESPACE,'runs');let entries=[];
 try{entries=await fs.readdir(root,{withFileTypes:true});}catch(e){if(e.code!=='ENOENT')throw e;}
 let ledger=null,count=0;
 try{
  const ledgerFile=path.resolve(dataDir,DATA_NAMESPACE,'research-ledger.sqlite');
  try{await fs.access(ledgerFile);ledger=openResearchLedger(dataDir,{currentAt:now()});recoverPendingResearch(ledger,{now});}catch(e){if(e.code!=='ENOENT')throw e;}
  const ids=new Set(entries.filter(e=>e.isDirectory()&&/^TREND_SIMPLE_5M_V1_\d{8}_\d{4}$/.test(e.name)).map(e=>e.name));
  if(ledger)for(const row of ledger.prepare('SELECT DISTINCT run_id FROM research_results').all())if(/^TREND_SIMPLE_5M_V1_\d{8}_\d{4}$/.test(row.run_id))ids.add(row.run_id);
  for(const id of ids){
   const file=path.join(root,id,'run.json'),projection=path.join(root,id,'recovery.json');let record=null,reason=null;
   try{record=await readJson(file,null);if(!record)reason='MISSING_RUN';else if(record.runId!==id||(!Array.isArray(record.results)&&record.status!=='RUNNING'))reason='INCOMPLETE_RUN';}catch{reason='CORRUPT_RUN';}
   const persisted=ledger?ledger.prepare('SELECT request_id,result_json FROM research_results WHERE run_id=? ORDER BY request_id').all(id):[];
   const results=persisted.map(row=>({...JSON.parse(row.result_json),requestId:row.request_id}));
   if(!reason&&results.some(x=>!(record.results||[]).some(r=>r?.symbol===x.symbol&&r?.status==='ASSESSED'&&r?.bias===x.bias)))reason='RESULT_MISMATCH';
   if(reason&&results.length){
    const recovered={version:'TREND_SIMPLE_5M_V1',timeframe:'5m',runId:id,status:'INTERRUPTED',recoveryStatus:'INCOMPLETE_RECOVERED_RESULTS',recoveryReason:reason,recoverySource:'SQLITE',results};
    let old=null;try{old=await readJson(projection,null);}catch{throw Error('V1_RECOVERY_PROJECTION_CORRUPT');}
    if(JSON.stringify(old)!==JSON.stringify(recovered)){await atomicWrite(projection,recovered);count++;await onProjectionSaved(id);}
   }
   if(!reason&&record.status==='RUNNING'){await atomicWrite(file,{...record,status:'INTERRUPTED',error:'PREVIOUS_RUN_INTERRUPTED',finishedAt:now()});count++;}
  }
  return count;
 }finally{ledger?.close();}
}
export async function runSimpleRound({cycle,dataDir,client,call,now=Date.now,signal}){
 const id=roundId(cycle),root=path.resolve(dataDir,DATA_NAMESPACE),dir=path.join(root,'runs',id),record=path.join(dir,'run.json');await fs.mkdir(dir,{recursive:true});let h;try{h=await fs.open(record,'wx',0o600);}catch(e){if(e.code!=='EEXIST')throw e;const previous=await readJson(record,null).catch(()=>null);if(previous?.status==='RUNNING'){previous.status='INTERRUPTED';previous.error='PREVIOUS_RUN_INTERRUPTED';await atomicWrite(record,previous);}return {runId:id,status:previous?.status||'INTERRUPTED',duplicate:true};}
 const result={version:'TREND_SIMPLE_5M_V1',timeframe:'5m',runId:id,cycle,status:'RUNNING',startedAt:now(),dataCutoff:cycle,source:'BINANCE_USDM',results:[],errors:[],calls:0};try{await h.writeFile(JSON.stringify(result)+'\n');await h.sync();}finally{await h.close();}
 try{signal?.throwIfAborted();const exchange=await client.get(endpoints.exchange),tickers=await client.get(endpoints.ticker);if(!Array.isArray(exchange.raw?.symbols)||!Array.isArray(tickers.raw))throw Error('INVALID_UNIVERSE');const map=new Map(tickers.raw.map(t=>[t.symbol,t])),symbols=[...new Set(exchange.raw.symbols.filter(s=>{const v=map.get(s.symbol)?.quoteVolume;return classify(s).eligible&&v!==''&&v!=null&&Number.isFinite(Number(v))&&Number(v)>=10000000;}).map(s=>s.symbol))].sort();result.universe={count:symbols.length,generatedAt:now(),sources:[endpoints.exchange,endpoints.ticker]};const rows=[];let failed=0;
 await pool(symbols,5,async symbol=>{try{signal?.throwIfAborted();const src=await client.get(endpoints.klines,{symbol,interval:TREND_SIMPLE_CONFIG.timeframe,limit:TREND_SIMPLE_CONFIG.candles.historyBars,endTime:cycle-1});const facts=buildFacts(symbol,src.raw,cycle);rows.push({symbol,facts});}catch(e){failed++;result.errors.push({symbol,stage:'DATA',error:safeError(e)});}});signal?.throwIfAborted();const ranked=rankBullishCandidates(rows);const ledger=openResearchLedger(dataDir,{currentRunId:id,currentAt:now()});try{recoverPendingResearch(ledger,{now});const exclusions=new Map(ranked.map(x=>[x.symbol,researchEligibility(ledger,x.symbol,now())]));const selected=ranked.filter(x=>exclusions.get(x.symbol).ok).slice(0,Math.min(TREND_SIMPLE_CONFIG.selection.topK,TREND_SIMPLE_CONFIG.llm.maxSymbolsPerRound));updateMarketFacts(ledger,{cycle,rows,symbols,failed:result.errors.filter(e=>e.stage==='DATA').map(e=>e.symbol)});result.coverage={requested:symbols.length,valid:rows.length,failed};result.bullishCandidates=ranked.length;result.selected=selected.map(x=>({symbol:x.symbol,priority:x.priority}));result.results=Array(selected.length);
 try{const snapshot=buildRankingSnapshot({ranked,selected,exclusions,runId:id,cycle,startedAt:result.startedAt,scannedCount:symbols.length,validCount:rows.length,failedCount:failed});await atomicWrite(path.join(dir,'candidate-ranking.json'),snapshot);result.rankingSnapshot={status:'COMPLETE'};}catch(e){result.rankingSnapshot={status:'FAILED',error:'RANKING_SNAPSHOT_WRITE_FAILED'};result.errors.push({stage:'RANKING_SNAPSHOT',error:'RANKING_SNAPSHOT_WRITE_FAILED'});}
 await pool(selected,TREND_SIMPLE_CONFIG.llm.concurrency,async(row,index)=>{let status='FAILED',output=null,error=null,validationIssues=[],checked=null,rawBias=null,responseReceived=false;const requestId=randomUUID();const reserved=reserveResearch(ledger,{id:requestId,runId:id,symbol:row.symbol,at:now()});if(!reserved.ok){if(reserved.reason==='DAILY_BUDGET_EXHAUSTED')console.log(`TREND_SIMPLE_RESEARCH_BLOCKED ${id} reason=${reserved.reason}`);result.errors.push({symbol:row.symbol,stage:'RESERVATION',error:reserved.reason});result.results[index]={symbol:row.symbol,status:'NOT_EVALUATED',error:reserved.reason};return;}try{signal?.throwIfAborted();result.calls++;const raw=await call(SIMPLE_TREND_PROMPT,judgeInput(row.facts),signal);responseReceived=true;let v=typeof raw==='string'?JSON.parse(raw):raw;if(v?.symbol!==undefined){if(v.symbol!==row.symbol)throw Error('SYMBOL_MISMATCH');v={...v};delete v.symbol;}rawBias=['BULL','BEAR','NEUTRAL'].includes(v?.bias)?v.bias:null;checked=checkSimpleJudge(v,row.facts);if(!checked.ok){validationIssues=checked.issues||[];throw Error(checked.error);}output=v;status='ASSESSED';}catch(e){error=safeError(e);}result.results[index]={symbol:row.symbol,priority:row.priority,status,validationContract:checked?.ok?'STRUCTURED_V1':null,rawBias,bias:output?.bias??null,phase:checked?.ok?checked.phase:null,phaseStatus:checked?.ok?checked.phaseStatus:null,evidenceStrength:output?.evidenceStrength??null,displayReason:checked?.ok?checked.displayReason:null,reason:checked?.ok?checked.displayReason:null,supportingFactIds:output?.supportingFactIds??[],conflictingFactIds:output?.conflictingFactIds??[],facts:row.facts,error,validationIssues};if(status==='ASSESSED')completeResearch(ledger,{id:requestId,symbol:row.symbol,runId:id,at:now(),now,result:result.results[index]});else if(responseReceived)failKnownResearch(ledger,{id:requestId,symbol:row.symbol,runId:id});});
 updateMarketFacts(ledger,{cycle,rows,symbols,failed:result.errors.filter(e=>e.stage==='DATA').map(e=>e.symbol)});
 signal?.throwIfAborted();result.statistics={scannedSymbols:result.coverage.requested,bullishCandidates:result.bullishCandidates,llmCalls:result.calls,validatedBullCount:result.results.filter(r=>r.status==='ASSESSED'&&r.bias==='BULL').length,rejectedCount:result.results.filter(r=>r.status==='ASSESSED'&&['BEAR','NEUTRAL'].includes(r.bias)).length,failedCount:result.results.filter(r=>r.status==='FAILED').length};result.status='COMPLETE';result.finishedAt=now();await atomicWrite(record,result);await atomicWrite(path.join(root,'latest.json'),result);return result;}finally{ledger.close();}
 }catch(e){result.status=signal?.aborted?'INTERRUPTED':'FAILED';result.finishedAt=now();result.errors.push({stage:'RUN',error:safeError(e)});await atomicWrite(record,result);return result;}}
