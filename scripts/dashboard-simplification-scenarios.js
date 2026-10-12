// Browser response mocks only. Does not create or alter any production record.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {createWebServer} from '../src/web/server.js';
import {hashPassword} from '../src/web/security.js';
import {Reader} from '../src/web/reader.js';
import {projectRoot} from '../src/web/config.js';
const moduleName=process.env.BA_WEB_PLAYWRIGHT_MODULE||'playwright';
const {chromium}=await import(path.isAbsolute(moduleName)?pathToFileURL(moduleName).href:moduleName);
const cutoff=1791716400000,runId='MOCK_UI_ONLY',symbol='MOCKUSDT';
const base={record:{runId,status:'COMPLETE',finishedAt:cutoff+10,dataCutoff:cutoff},snapshotState:'COMPLETED_RECORD',counters:{qualified:1,selected:1},selector:{rows:[{symbol,status:'SELECTED'}]}};
const research={symbol,runId,dataCutoff:cutoff,metrics:{},evidence:[],selection:{status:'SELECTED',rank:1},storyType:'NEW_STORY',analysis:{status:'VALIDATED',direction:'NO_EDGE',label:'无清晰优势',conviction:'LOW',supportingEvidenceIds:[],conflictingEvidenceIds:[]}};
const config={host:'127.0.0.1',port:8797,origin:'http://127.0.0.1:8797',passwordHash:await hashPassword('isolated-scenario-password'),secure:false,sessionMs:3600000,staleMs:7200000,dataDir:path.join(projectRoot,'data'),projectRoot};
const {server}=createWebServer(config,{reader:new Reader(config.dataDir),log:()=>{}});await new Promise((r,j)=>{server.once('error',j);server.listen(config.port,config.host,r);});let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.BA_WEB_BROWSER_PATH?{executablePath:process.env.BA_WEB_BROWSER_PATH}:{})});const context=await browser.newContext();await context.route('**/*',r=>r.request().url().startsWith(config.origin+'/')?r.continue():r.abort());const page=await context.newPage();await page.goto(config.origin);await page.locator('input[name=password]').fill('isolated-scenario-password');await page.getByRole('button',{name:'登录',exact:true}).click();await page.getByRole('heading',{name:'观察',exact:true}).waitFor();
 let kind='NO_EDGE';await page.route('**/api/**',route=>{const p=new URL(route.request().url()).pathname;let data;const complete=structuredClone(base),r=structuredClone(research);
 if(kind==='NO_QUALIFIED'){complete.counters={qualified:0,selected:0};complete.selector.rows=[];}if(kind==='NO_SELECTED'){complete.counters={qualified:2,selected:0};complete.selector.rows=[];}
 if(kind==='V4_UNAVAILABLE')r.analysis={status:'ANALYST_UNAVAILABLE',direction:'ANALYST_UNAVAILABLE',label:'研判不可用'};
 if(p==='/api/overview')data={latest:kind==='NO_HISTORY'?null:kind==='IN_PROGRESS'?{record:{runId:'MOCK_IN_PROGRESS',status:'RUNNING'},snapshotState:'IN_PROGRESS'}:complete,cards:[],researchRun:null};
 else if(p==='/api/health')data={scanner:'STOPPED',dataStale:true};
 else if(p==='/api/runs')data={items:kind==='NO_HISTORY'?[]:[complete.record],total:kind==='NO_HISTORY'?0:1};
 else if(p.startsWith('/api/runs/'))data=complete;
 else if(p.startsWith('/api/symbols/'))data=r;
 if(data)return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});return route.continue();});
 const results=[];
 for(const [name,text,cards]of [['NO_EDGE','无清晰优势',1],['NO_QUALIFIED','本轮没有合格候选',0],['NO_SELECTED','本轮没有选中研究对象',0],['V4_UNAVAILABLE','有选中对象但V4不可用',0],['IN_PROGRESS','最新扫描尚未完成',1],['NO_HISTORY','历史数据不存在',0]]){kind=name;await page.goto(config.origin);await page.getByRole('heading',{name:'观察',exact:true}).waitFor();await page.waitForTimeout(50);assert.ok((await page.locator('main').innerText()).includes(text),name);assert.equal(await page.locator('.observation-card').count(),cards,name);results.push({name,passed:true,mockOnly:true});}
 const text=await page.locator('main').innerText();assert.ok(text.includes('Scanner停止'));assert.ok(text.includes('已过期'));results.push({name:'STOPPED_AND_STALE',passed:true,mockOnly:true});
 await fs.writeFile('validation/BA_BIAS_DASHBOARD_SIMPLIFICATION_V1/browser-scenarios.json',JSON.stringify({results,source:'IN_MEMORY_HTTP_RESPONSE_MOCK_ONLY',productionFilesWritten:0},null,2)+'\n');console.log('Browser scenarios: '+results.length+' passed');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
