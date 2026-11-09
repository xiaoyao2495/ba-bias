import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';

const key='llm_enabled';
export function llmEnabled(db){const row=db.prepare('SELECT value FROM ledger_meta WHERE key=?').get(key);if(!row)return true;if(row.value!==0&&row.value!==1)throw Error('INVALID_LLM_CONTROL');return row.value===1;}
export function readLlmControl(dataDir){const file=path.resolve(dataDir,'trend-simple-5m-v1','research-ledger.sqlite');if(!fs.existsSync(file))return {status:'NOT_AVAILABLE',enabled:null};let db;try{db=new DatabaseSync(file,{readOnly:true});return {status:'OK',enabled:llmEnabled(db),lastResearchAt:db.prepare('SELECT MAX(judged_at) AS at FROM symbols').get().at??null};}catch{return {status:'UNAVAILABLE',enabled:null};}finally{db?.close();}}
export function setLlmControl(dataDir,enabled){if(typeof enabled!=='boolean')throw Error('INVALID_LLM_CONTROL');const dir=path.resolve(dataDir,'trend-simple-5m-v1'),file=path.join(dir,'research-ledger.sqlite');if(!fs.existsSync(file)||!fs.existsSync(path.join(dir,'research-ledger.initialized')))throw Error('LEDGER_NOT_AVAILABLE');const db=new DatabaseSync(file);try{db.exec('PRAGMA busy_timeout=5000; BEGIN IMMEDIATE');try{db.prepare('INSERT INTO ledger_meta(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,Number(enabled));db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}return {status:'OK',enabled};}finally{db.close();}}
