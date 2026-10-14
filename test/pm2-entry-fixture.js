// VM ESM harness only. Actual Scanner/entry source; every side-effect dependency mocked.
import vm from 'node:vm';
import fs from 'node:fs/promises';
import {EventEmitter} from 'node:events';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const mode=process.argv[2],platform=process.argv[3]||'posix';
const win=platform==='windows';
const root=win?'file:///C:/git/ba-bias/src/':'file:///isolated/ba-bias/src/';
const target=mode==='direct'?'scan-daemon.js':'scan-pm2-entry.js';
const directPath=win?`C:\\git\\ba-bias\\src\\${target}`:`/isolated/ba-bias/src/${target}`;
const container=win?'C:\\pm2\\lib\\ProcessContainerFork.js':'/isolated/pm2/lib/ProcessContainerFork.js';
const argvPath=['direct','entry-direct'].includes(mode)?directPath:container;
const outputs=[],errors=[],events=[],tasks=[],polls=[];let marketCalls=0,deliveryCalls=0,skips=0,exited=null;
const proc=new EventEmitter();Object.assign(proc,{argv:['node',argvPath],exitCode:0,exit:code=>{exited=code;},connected:true});
const nativePathToUrl=p=>win?new URL('file:///'+p.replaceAll('\\','/')):pathToFileURL(p);
const now=Date.parse('2026-10-12T00:17:00+08:00');
const times=ms=>({shanghai:new Date(ms+28800000).toISOString().replace('Z','+08:00')});
const config={deepseekKey:mode==='missing-key'?'':'MOCK_KEY_ONLY',webhook:mode==='missing-webhook'?'':'MOCK_WEBHOOK_ONLY'};
const cron={createTask(expression,cb,options){const task={expression,cb,options,startCount:0,stopCount:0,destroyCount:0,async start(){this.startCount++;if(mode==='start-failed')throw Object.assign(Error('SECRET_MUST_NOT_LEAK'),{code:'MOCK_START_FAILURE'});},async stop(){this.stopCount++;},async destroy(){this.destroyCount++;},on(){}};tasks.push(task);return task;}};
const context=vm.createContext({process:proc,console:{log:x=>outputs.push(x),error:x=>errors.push(x)},Date:class extends Date{static now(){return now;}},AbortController,AbortSignal,setInterval:(fn,delay)=>{const p={fn,delay,cleared:false,unref(){}};polls.push(p);return p;},clearInterval:p=>{if(p)p.cleared=true;}});
const synthetic=(identifier,exports)=>new vm.SyntheticModule(Object.keys(exports),function(){for(const [k,v]of Object.entries(exports))this.setExport(k,v);},{context,identifier});
const map=new Map([
 ['./storage/market-bias-v2-state.js',synthetic('v2-state',{assertPrepared:async()=>({})})],
 ['node-cron',synthetic('node-cron',{default:cron})],
 ['node:timers/promises',synthetic('timers',{setTimeout:async()=>{throw Error('NO_RESEARCH_SLEEP_AT_STARTUP');}})],
 ['node:url',synthetic('url',{pathToFileURL:nativePathToUrl})],
 ['./config.js',synthetic('config',{config,times,safeError:e=>e.code||'MISSING_SCANNER_ENVIRONMENT'})],
 ['./main.js',synthetic('main',{runResearch:async()=>{marketCalls++;throw Error('NO_MARKET_CALL');},saveSkippedRun:async()=>{skips++;}})],
 ['./storage/delivery-queue.js',synthetic('delivery',{flushDeliveryQueue:async()=>{deliveryCalls++;throw Error('NO_DELIVERY_CALL');}})],
 ['./logging.js',synthetic('logging',{terminalLogger:()=>((event,details)=>events.push({event,details}))})],
]);
async function source(file){const s=await fs.readFile(path.resolve('src',file),'utf8');return new vm.SourceTextModule(s,{context,identifier:root+file,initializeImportMeta:meta=>{meta.url=root+file;}});}
const daemon=await source('scan-daemon.js');map.set('./scan-daemon.js',daemon);
const selected=['direct','import','fork-original'].includes(mode)?daemon:await source('scan-pm2-entry.js');
await selected.link(specifier=>{const m=map.get(specifier);if(!m)throw Error('UNMOCKED_IMPORT:'+specifier);return m;});
await selected.evaluate();for(let i=0;i<20;i++)await Promise.resolve();
const expectedStarted=!['import','fork-original','missing-key','missing-webhook'].includes(mode);
assert.equal(tasks.length,expectedStarted?1:0);assert.equal(marketCalls,0);assert.equal(deliveryCalls,0);assert.equal(skips,0);
if(['missing-key','missing-webhook','start-failed'].includes(mode)){assert.equal(exited,1);assert.equal(errors.length,1);assert.ok(!errors[0].includes('SECRET_MUST_NOT_LEAK'));assert.equal(proc.listenerCount('SIGINT'),0);assert.equal(proc.listenerCount('SIGTERM'),0);assert.ok(polls.length===0);}
else if(expectedStarted){assert.equal(tasks[0].startCount,1);assert.equal(tasks[0].expression,daemon.namespace.SCHEDULE);assert.equal(tasks[0].options.timezone,'Asia/Shanghai');assert.ok(outputs.some(x=>x.includes('Schedule: '+daemon.namespace.SCHEDULE)&&x.includes('Status: WAITING')));assert.ok(events.some(x=>x.event==='Next run'));assert.equal(proc.listenerCount('SIGINT'),1);assert.equal(proc.listenerCount('SIGTERM'),1);assert.equal(polls.length,1);
 for(const signal of ['SIGINT','SIGTERM']){if(mode==='signal-'+signal){proc.emit(signal);for(let i=0;i<30;i++)await Promise.resolve();assert.equal(tasks[0].stopCount,1);assert.equal(tasks[0].destroyCount,1);assert.equal(proc.listenerCount('SIGINT'),0);assert.equal(proc.listenerCount('SIGTERM'),0);assert.equal(polls[0].cleared,true);assert.ok(events.some(x=>x.event==='Status: STOPPED'));}}
}else{assert.equal(outputs.length,0);assert.equal(errors.length,0);assert.equal(polls.length,0);assert.equal(proc.listenerCount('SIGINT'),0);}
console.log(JSON.stringify({mode,platform,argv1:argvPath,moduleURL:selected.identifier,schedulerCreated:tasks.length,cron:tasks[0]?.expression??null,startupLog:outputs,events,errors,exited,marketCalls,deliveryCalls,skips,mockOnly:true,node:process.version}));
