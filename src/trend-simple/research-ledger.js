import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {llmEnabled} from './llm-control.js';

export const BULL_COOLDOWN_MS=90*60000;
export const DAILY_LIMIT=288;

// This is a V1-only ledger. Committed reservations are never refunded.
export function openResearchLedger(dataDir,{currentRunId=null,currentAt=Date.now()}={}){
 const dir=path.resolve(dataDir,'trend-simple-5m-v1');fs.mkdirSync(dir,{recursive:true});
 const file=path.join(dir,'research-ledger.sqlite'), marker=path.join(dir,'research-ledger.initialized');
 const existed=fs.existsSync(file);if(!existed&&fs.existsSync(marker))throw Error('V1_LEDGER_MISSING');
 const db=new DatabaseSync(file);
 try{
  db.exec('PRAGMA busy_timeout=5000');
  const mode=db.prepare('PRAGMA journal_mode=WAL').get();if(String(Object.values(mode)[0]).toLowerCase()!=='wal')throw Error('V1_LEDGER_WAL_UNAVAILABLE');
  db.exec('PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000');
  if(Number(Object.values(db.prepare('PRAGMA synchronous').get())[0])!==2)throw Error('V1_LEDGER_SYNC_UNAVAILABLE');
  if(existed){if(!fs.existsSync(marker))throw Error('V1_LEDGER_INIT_INCOMPLETE');if(Object.values(db.prepare('PRAGMA quick_check').get())[0]!=='ok')throw Error('V1_LEDGER_CORRUPT');const tables=new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(x=>x.name));if(!tables.has('requests')||!tables.has('symbols')||!tables.has('ledger_meta'))throw Error('V1_LEDGER_SCHEMA_MISSING');}
  db.exec(`CREATE TABLE IF NOT EXISTS requests (id TEXT PRIMARY KEY,run_id TEXT NOT NULL,symbol TEXT NOT NULL,reserved_at INTEGER NOT NULL,status TEXT NOT NULL, UNIQUE(run_id,symbol));
CREATE TABLE IF NOT EXISTS symbols (symbol TEXT PRIMARY KEY,bias TEXT,judged_at INTEGER,cooldown_until INTEGER,scan_at INTEGER,data_status TEXT,eligible INTEGER,indicator_path TEXT,structure_path TEXT,research_run TEXT,research_json TEXT);
CREATE TABLE IF NOT EXISTS ledger_meta (key TEXT PRIMARY KEY,value INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS research_results (request_id TEXT PRIMARY KEY,run_id TEXT NOT NULL,symbol TEXT NOT NULL,result_json TEXT NOT NULL);`);
  if(!existed){
   const runs=path.join(dir,'runs');let names=[];try{names=fs.readdirSync(runs).filter(x=>/^TREND_SIMPLE_5M_V1_\d{8}_\d{4}$/.test(x)).sort();}catch(e){if(e.code!=='ENOENT')throw e;}
   txn(db,()=>{const up=db.prepare(`INSERT INTO symbols(symbol,bias,judged_at,cooldown_until,research_run,research_json,data_status) VALUES(?,?,?,?,?,?,'UNKNOWN') ON CONFLICT(symbol) DO UPDATE SET bias=excluded.bias,judged_at=excluded.judged_at,cooldown_until=excluded.cooldown_until,research_run=excluded.research_run,research_json=excluded.research_json WHERE excluded.judged_at>=symbols.judged_at`);let lastFinished=-Infinity;for(const name of names){let r;try{r=JSON.parse(fs.readFileSync(path.join(runs,name,'run.json'),'utf8'));}catch{if(name!==currentRunId)db.prepare("INSERT OR REPLACE INTO ledger_meta VALUES('migration_history_uncertain_at',?)").run(currentAt);continue;}if(r.status!=='COMPLETE'){if(name!==currentRunId)db.prepare("INSERT OR REPLACE INTO ledger_meta VALUES('migration_history_uncertain_at',?)").run(currentAt);const observed=r.finishedAt??r.startedAt;if(name!==currentRunId&&Number.isSafeInteger(observed)&&observed<=currentAt&&currentAt-observed<BULL_COOLDOWN_MS)db.prepare("INSERT OR REPLACE INTO ledger_meta VALUES('migration_unknown_block_until',?)").run(currentAt+BULL_COOLDOWN_MS);continue;}if(!Number.isSafeInteger(r.finishedAt)||!Array.isArray(r.results)){db.prepare("INSERT OR REPLACE INTO ledger_meta VALUES('migration_history_uncertain_at',?)").run(currentAt);continue;}if(r.finishedAt<lastFinished||r.finishedAt>currentAt)db.prepare("INSERT OR REPLACE INTO ledger_meta VALUES('migration_history_uncertain_at',?)").run(currentAt);lastFinished=Math.max(lastFinished,r.finishedAt);for(const x of r.results){if(x?.status!=='ASSESSED'||x.validationContract!=='STRUCTURED_V1'||!['BULL','BEAR','NEUTRAL'].includes(x.bias)||!/^[\p{L}\p{N}]{1,40}USDT$/u.test(x.symbol||''))continue;up.run(x.symbol,x.bias,r.finishedAt,x.bias==='BULL'?r.finishedAt+BULL_COOLDOWN_MS:null,name,JSON.stringify(x));}}});
   const fd=fs.openSync(marker,'wx',0o600);try{fs.writeFileSync(fd,'V1_LEDGER_V1\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
  }else if(!fs.existsSync(marker))throw Error('V1_LEDGER_INIT_INCOMPLETE');
  return db;
 }catch(e){db.close();throw e;}
}
function txn(db,fn){db.exec('BEGIN IMMEDIATE');try{const x=fn();db.exec('COMMIT');return x;}catch(e){db.exec('ROLLBACK');throw e;}}
export function researchEligibility(db,symbol,at){
 const x=db.prepare('SELECT bias,cooldown_until FROM symbols WHERE symbol=?').get(symbol);
 if(x?.bias==='BULL'&&x.cooldown_until>at)return {ok:false,reason:'BULL_COOLDOWN',cooldownUntil:x.cooldown_until};
 if(db.prepare("SELECT 1 FROM requests WHERE symbol=? AND status IN ('UNKNOWN','BULL_PENDING') LIMIT 1").get(symbol))return {ok:false,reason:'REQUEST_UNKNOWN'};
 return {ok:true,cooldownUntil:x?.cooldown_until??null};
}
export function reserveResearch(db,{id,runId,symbol,at}){return txn(db,()=>{
 if(!llmEnabled(db))return {ok:false,reason:'LLM_PAUSED'};
 const unknown=db.prepare("SELECT value FROM ledger_meta WHERE key='migration_unknown_block_until'").get();if(unknown&&at<unknown.value)return {ok:false,reason:'MIGRATION_REQUEST_UNKNOWN'};
 const last=db.prepare('SELECT MAX(reserved_at) AS at FROM requests').get().at;if(last!==null&&at<last)throw Error('V1_CLOCK_ROLLBACK');
 const eligibility=researchEligibility(db,symbol,at);if(!eligibility.ok)return eligibility;
 if(db.prepare('SELECT 1 FROM requests WHERE run_id=? AND symbol=?').get(runId,symbol))return {ok:false,reason:'DUPLICATE_REQUEST'};
 const day=Math.floor(at/86400000)*86400000,n=db.prepare('SELECT COUNT(*) AS n FROM requests WHERE reserved_at>=? AND reserved_at<?').get(day,day+86400000).n;
 if(n>=DAILY_LIMIT)return {ok:false,reason:'DAILY_BUDGET_EXHAUSTED'};
 db.prepare("INSERT INTO requests VALUES(?,?,?,?,'UNKNOWN')").run(id,runId,symbol,at);return {ok:true};
});}
// The result is durable before the cooldown clock is read. A crash between the
// two transactions leaves BULL_PENDING, which blocks reservations indefinitely.
export function completeResearch(db,{id,symbol,runId,at,result,now=()=>at}){
 txn(db,()=>{
  const row=db.prepare('SELECT status FROM requests WHERE id=? AND run_id=? AND symbol=?').get(id,runId,symbol);if(row?.status!=='UNKNOWN')throw Error('V1_RESERVATION_INVALID');
  if(result.status!=='ASSESSED'||result.validationContract!=='STRUCTURED_V1'||!['BULL','BEAR','NEUTRAL'].includes(result.bias))throw Error('V1_RESEARCH_INVALID');
  db.prepare('INSERT INTO research_results VALUES(?,?,?,?)').run(id,runId,symbol,JSON.stringify(result));
  db.prepare("UPDATE requests SET status='BULL_PENDING' WHERE id=?").run(id);
 });
 finalizeResearch(db,{id,now});
}
export function finalizeResearch(db,{id,now=Date.now}){return txn(db,()=>{
 const row=db.prepare("SELECT r.symbol,r.run_id,r.status,x.result_json FROM requests r JOIN research_results x ON x.request_id=r.id WHERE r.id=?").get(id);
 if(!row||row.status!=='BULL_PENDING')throw Error('V1_PENDING_INVALID');
 const result=JSON.parse(row.result_json),at=now();if(!Number.isSafeInteger(at))throw Error('V1_INVALID_TIME');
 db.prepare(`INSERT INTO symbols(symbol,bias,judged_at,cooldown_until,research_run,research_json) VALUES(?,?,?,?,?,?) ON CONFLICT(symbol) DO UPDATE SET bias=excluded.bias,judged_at=excluded.judged_at,cooldown_until=excluded.cooldown_until,research_run=excluded.research_run,research_json=excluded.research_json WHERE symbols.judged_at IS NULL OR excluded.judged_at>=symbols.judged_at`).run(row.symbol,result.bias,at,result.bias==='BULL'?at+BULL_COOLDOWN_MS:null,row.run_id,row.result_json);
 db.prepare("UPDATE requests SET status='COMPLETED' WHERE id=?").run(id);
});}
export function recoverPendingResearch(db,{now=Date.now}={}){
 const rows=db.prepare("SELECT id FROM requests WHERE status='BULL_PENDING' ORDER BY reserved_at,id").all();
 for(const row of rows)finalizeResearch(db,{id:row.id,now});return rows.length;
}
export function failKnownResearch(db,{id,symbol,runId}){return txn(db,()=>{
 const update=db.prepare("UPDATE requests SET status='FAILED' WHERE id=? AND run_id=? AND symbol=? AND status='UNKNOWN'").run(id,runId,symbol);if(update.changes!==1)throw Error('V1_RESERVATION_INVALID');
});}
export function updateMarketFacts(db,{cycle,rows,symbols,failed}){return txn(db,()=>{
 const tracked=db.prepare('SELECT symbol FROM symbols').all(),map=new Map(rows.map(x=>[x.symbol,x])), universe=new Set(symbols), errors=new Set(failed);
 const update=db.prepare('UPDATE symbols SET scan_at=?,data_status=?,eligible=?,indicator_path=?,structure_path=? WHERE symbol=? AND (scan_at IS NULL OR scan_at<=?)');
 for(const x of tracked){const row=map.get(x.symbol);if(!row){db.prepare('UPDATE symbols SET data_status=? WHERE symbol=? AND (scan_at IS NULL OR scan_at<=?)').run(errors.has(x.symbol)?'DATA_UNAVAILABLE':universe.has(x.symbol)?'DATA_UNAVAILABLE':'UNIVERSE_UNAVAILABLE',x.symbol,cycle);continue;}
  const f=row.facts,i=f.indicatorPath,s=f.structurePath,eligible=i!=='BEARISH_INDICATORS'&&s!=='BEARISH_STRUCTURE'&&(i==='BULLISH_INDICATORS'||s==='BULLISH_STRUCTURE');
  update.run(cycle,'OK',Number(eligible),i,s,x.symbol,cycle);
 }
});}
