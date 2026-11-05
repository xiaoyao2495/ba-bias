import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {simpleDTO} from './trend-simple-dto.js';

export function readSimplePool(dataDir,now=Date.now()){
 const file=path.resolve(dataDir,'trend-simple-5m-v1','research-ledger.sqlite');
 if(!fs.existsSync(file))return {items:[],status:'NOT_AVAILABLE'};
 let db;
 try{
  db=new DatabaseSync(file,{readOnly:true});
  const uncertainty=db.prepare("SELECT value FROM ledger_meta WHERE key='migration_history_uncertain_at'").get()?.value;
  const rows=db.prepare("SELECT s.*, EXISTS(SELECT 1 FROM requests r WHERE r.symbol=s.symbol AND r.status IN ('UNKNOWN','BULL_PENDING') AND r.reserved_at>=s.judged_at) AS request_unknown FROM symbols s WHERE s.bias='BULL' ORDER BY s.judged_at DESC,s.symbol ASC").all();
  const items=rows.map(x=>{const historyUncertain=uncertainty!==undefined&&x.judged_at<=uncertainty;const stale=historyUncertain||!!x.request_unknown||!Number.isSafeInteger(x.scan_at)||now<x.scan_at||now-x.scan_at>15*60000||x.data_status!=='OK';const state=stale?'STALE':x.eligible?'ACTIVE_BULL':'NEEDS_RECHECK';const reason=stale?(historyUncertain?'HISTORY_UNCERTAIN':x.request_unknown?'REQUEST_UNKNOWN':x.data_status==='OK'?'FACTS_STALE':x.data_status??'UNKNOWN'):x.eligible?null:(x.indicator_path==='BEARISH_INDICATORS'||x.structure_path==='BEARISH_STRUCTURE')?'BEARISH_VETO':'NOT_ELIGIBLE';let result=null;try{result=JSON.parse(x.research_json);}catch{}const dto=simpleDTO({timeframe:'5m',results:result?[result]:[]}).items[0];return {symbol:x.symbol,bias:'BULL',judgedAt:x.judged_at,scanAt:x.scan_at,cooldownUntil:x.cooldown_until,state:dto?state:'STALE',reason:dto?reason:'RESEARCH_DETAIL_UNAVAILABLE',dataStatus:x.data_status,indicatorPath:x.indicator_path,structurePath:x.structure_path,researchRun:x.research_run,details:dto??null,researchDetails:result?{supportingFactIds:Array.isArray(result.supportingFactIds)?result.supportingFactIds:[],conflictingFactIds:Array.isArray(result.conflictingFactIds)?result.conflictingFactIds:[],displayReason:typeof result.displayReason==='string'?result.displayReason:null,evaluationTime:result.facts?.evaluationTime??null}:null};});
  return {items,status:'OK'};
 }catch{return {items:[],status:'UNAVAILABLE'};}finally{db?.close();}
}
