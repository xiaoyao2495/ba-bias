// Actual Web/entry source in an isolated ESM graph; no sockets or production reads.
import vm from 'node:vm';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {EventEmitter} from 'node:events';
import assert from 'node:assert/strict';
const mode=process.argv[2],win=process.argv[3]==='windows',root=win?'file:///C:/git/ba-bias/src/web/':'file:///isolated/ba-bias/src/web/';
const file=mode==='direct'?'server.js':'pm2-entry.js',argv=['direct','entry-direct'].includes(mode)?win?`C:\\git\\ba-bias\\src\\web\\${file}`:`/isolated/ba-bias/src/web/${file}`:win?'C:\\pm2\\lib\\ProcessContainerFork.js':'/isolated/pm2/lib/ProcessContainerFork.js';
const proc=new EventEmitter();let exited=null;Object.assign(proc,{argv:['node',argv],env:{},exitCode:0,exit:n=>{exited=n;}});
const stdout=[],stderr=[];let loaded=0,created=0,reads=0,inspected=0,closed=0,listenCount=0;
const context=vm.createContext({process:proc,console:{log:x=>stdout.push(x),error:x=>stderr.push(x)},URL,Date});
const cfg={origin:'http://127.0.0.1:8787',host:'127.0.0.1',port:8787,dataDir:'MOCK',projectRoot:'MOCK',sessionMs:3600000};
if(mode==='public-start'){cfg.publicReadonly=true;cfg.mode='PUBLIC_READONLY';cfg.host='0.0.0.0';cfg.origin='http://203.0.113.1:8787';}
const fakeHTTP={createServer(){created++;const server=new EventEmitter();server.listen=(port,host,cb)=>{listenCount++;assert.equal(port,8787);assert.equal(host,mode==='public-start'?'0.0.0.0':'127.0.0.1');if(mode==='bind-failed')server.emit('error',Object.assign(Error('DO_NOT_LEAK_BIND_DETAILS'),{code:'EADDRINUSE'}));else cb();};server.close=cb=>{closed++;cb();};return server;}};
const synthetic=(name,exports)=>new vm.SyntheticModule(Object.keys(exports),function(){for(const [k,v]of Object.entries(exports))this.setExport(k,v);},{context,identifier:name});
const modules=new Map([
 ['./public-dto.js',synthetic('public-dto',{publicDTO:()=>({})})],['./public-routes.js',synthetic('public-routes',{publicRoute:()=>{throw Error('NO_PUBLIC_REQUEST');},publicGet:()=>{throw Error('NO_PUBLIC_REQUEST');}})],
 ['node:http',synthetic('http',{default:fakeHTTP})],['node:fs/promises',synthetic('fs',{default:{readFile:()=>{reads++;throw Error('NO_FILE_READ');}}})],['node:path',synthetic('path',{default:path})],['node:url',synthetic('url',{pathToFileURL:p=>win?new URL('file:///'+p.replaceAll('\\','/')):pathToFileURL(p)})],
 ['./config.js',synthetic('config',{projectRoot:'MOCK',loadWebEnvironment:()=>{loaded++;},webConfig:()=>{if(mode==='missing-hash')throw Error('WEB_PASSWORD_HASH_REQUIRED');return cfg;}})],
 ['./reader.js',synthetic('reader',{Reader:class{clean(v){return v;}},validate:v=>v,RUN:/x/,SYMBOL:/x/})],
 ['./security.js',synthetic('security',{sessions:()=>({}),limiter:()=>()=>true,verifyPassword:()=>{throw Error('NO_REQUEST');},sanitize:v=>v})],['./process.js',synthetic('process',{scannerProcesses:()=>{inspected++;throw Error('NO_SCANNER_ACTION');}})]
]);
async function source(f){return new vm.SourceTextModule(await fs.readFile(path.resolve('src/web',f),'utf8'),{context,identifier:root+f,initializeImportMeta:m=>{m.url=root+f;}});}
const server=await source('server.js');modules.set('./server.js',server);const selected=['direct','import','fork-original'].includes(mode)?server:await source('pm2-entry.js');
await selected.link(s=>{const m=modules.get(s);if(!m)throw Error('UNMOCKED_IMPORT:'+s);return m;});await selected.evaluate();for(let i=0;i<20;i++)await Promise.resolve();
const noStart=['import','fork-original'].includes(mode),failed=['missing-hash','bind-failed'].includes(mode);
assert.equal(loaded,noStart?0:1);assert.equal(created,noStart||mode==='missing-hash'?0:1);assert.equal(reads,0);assert.equal(inspected,0);
if(noStart){assert.equal(stdout.length,0);assert.equal(stderr.length,0);}
else if(failed){assert.equal(exited,1);assert.equal(stdout.length,0);assert.deepEqual(stderr,[mode==='missing-hash'?'WEB_PASSWORD_HASH_REQUIRED':'WEB_PORT_IN_USE']);}
else{assert.equal(listenCount,1);assert.equal(stdout.length,1);assert.equal(JSON.parse(stdout[0]).event,'LISTENING');assert.equal(proc.listenerCount('SIGINT'),1);assert.equal(proc.listenerCount('SIGTERM'),1);if(mode.startsWith('signal-')){proc.emit(mode.slice(7));assert.equal(closed,1);}}
console.log(JSON.stringify({mode,platform:win?'windows-model':'posix',argv1:argv,moduleURL:selected.identifier,loaded,created,listenCount,stdout,stderr,exited,reads,inspected,mockOnly:true}));
