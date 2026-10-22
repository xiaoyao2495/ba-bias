import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';import os from 'node:os';
import {config} from '../src/config.js';import {sha,CONTRACT} from '../src/analysis/market-bias-v2/common.js';
import {precisionFacts,precisionMarket} from './selector-precision-fixture.js';import {webResearch,mockBias} from './market-bias-v2-fixture.js';
import {initializeV2,assertPrepared,checkLegacyIntegrity,v2Dir} from '../src/storage/market-bias-v2-state.js';
import {atomicWrite,lock} from '../src/storage/history.js';import {planRetention,applyRetention,verifyRetention,retentionAge} from '../src/storage/retention.js';
import {RETENTION_CONTRACT,RETENTION_MS,retentionState} from '../src/lifecycle/retention-state.js';
export const H=3600000,NOW=Date.UTC(2026,9,22,4,2),D=RETENTION_MS;
const idFor=t=>'hourly_'+new Date(t+8*H).toISOString().slice(0,16).replace(/[-T:]/g,'').replace(/(\d{8})(\d{4})$/,'$1_$2');
export async function root(t){const r=await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(),'ba-retention-test-')));t.after(()=>fs.rm(r,{recursive:true,force:true}));await initializeV2(r);return r;}
async function read(p){return JSON.parse(await fs.readFile(p,'utf8'));}
export async function unit(r,age=D+1,{bias='BULLISH',symbols=['TESTUSDT'],research=true}={}){
 const end=NOW-age,scheduled=Math.floor(end/H)*H,start=scheduled+10000,cutoff=scheduled+20000,id=idFor(scheduled),h=(await assertPrepared(r)).history,records=[];
 for(const symbol of symbols){let f=precisionFacts({symbol,price:40});const delta=cutoff-f.dataCutoff;f=JSON.parse(JSON.stringify(f),(_k,v)=>typeof v==='number'&&v>1e12?v+delta:v);f.runId=id;const bytes=Buffer.from(JSON.stringify(f)),file=path.join(r,'runs',id,'facts',symbol+'.json');await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,bytes);
 if(research){const a=webResearch(f,{bias}),res=a.research;res.factsPackageSha256=sha(bytes);await atomicWrite(path.join(v2Dir(r),'research',id,symbol+'.json'),res);await atomicWrite(path.join(v2Dir(r),'audit',id,symbol+'.json'),{contract:CONTRACT,input:a.input,inputHash:a.inputHash,attempts:[]});await atomicWrite(path.join(v2Dir(r),'receipts',res.recordId+'.json'),{contract:CONTRACT,recordId:res.recordId,researchSha256:sha(res),persistedAt:end});h.research[res.recordId]={contract:CONTRACT,runId:id,symbol,recordId:res.recordId,executionState:'VALIDATED',factsAsOf:cutoff,researchSha256:sha(res)};h.selectorBaseline[symbol]={runId:id,status:'RESEARCH',summary:{anomalies:[]},lastResearchTime:cutoff};records.push(res);}}
 const result={contract:CONTRACT,runId:id,status:'COMPLETE',scheduledAt:scheduled,startedAt:start,finishedAt:end,dataCutoff:cutoff,evaluationTime:cutoff,candidateEvaluations:research?symbols.map(symbol=>({symbol,status:'RESEARCH_READY'})):[]};await atomicWrite(path.join(r,'runs',id,'result.json'),result);h.runs[id]={...result};await atomicWrite(path.join(v2Dir(r),'state/history.json'),h);return {id,result,records};
}
export const opts=r=>({enabled:true,confirm:'DELETE_EXPIRED_RUNS',confirmRoot:r,now:NOW,maxRuns:10});
export async function snapshot(r){const out={};async function walk(d,rel=''){for(const e of await fs.readdir(d,{withFileTypes:true})){const k=rel?rel+'/'+e.name:e.name;if(e.isDirectory())await walk(path.join(d,e.name),k);else out[k]=sha(await fs.readFile(path.join(d,e.name)));}}await walk(r);return out;}

export async function legacy(t){const r=await root(t),units=[];for(const [age,bias,symbol,research] of [[240,'BULLISH','LONGUSDT',true],[241,'BEARISH','SHORTUSDT',true],[242,'NO_EDGE','NEUTRALUSDT',true],[243,'NO_EDGE','NONERESEARCHUSDT',false],[24,'BULLISH','RECENTUSDT',true],[72,'BEARISH','THREEDAYUSDT',true]])units.push(await unit(r,age*H,{bias,symbols:[symbol],research}));
 const mfile=path.join(v2Dir(r),'state/cutover-manifest.json'),m=await read(mfile),before=await snapshot(r);for(const [rel,hash]of Object.entries(before))if(rel.startsWith('runs/'))m.legacyHashes[rel]=hash;await atomicWrite(mfile,m);return {r,units,mfile};}
