// Explicit test preload only. Allows loopback fixtures; denies outside networking and production writes.
import net from 'node:net';
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {syncBuiltinESMExports} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const allowedHost=h=>['localhost','127.0.0.1','::1'].includes(h);
const orig=net.Socket.prototype.connect;
net.Socket.prototype.connect=function(...args){const normalized=Array.isArray(args[0])?args[0]:args;const a=normalized[0];const obj=typeof a==='object'?a:null;const host=obj?.host??(typeof normalized[1]==='string'?normalized[1]:'localhost');if(!obj?.path&&!allowedHost(host))throw Error('OFFLINE_NETWORK_BLOCKED');return orig.apply(this,args);};
function checkDestination(args){const a=args[0];if(typeof a==='string'||a instanceof URL){if(!allowedHost(new URL(a).hostname))throw Error('OFFLINE_NETWORK_BLOCKED');}else if(a&&typeof a==='object'){if(!allowedHost(a.hostname||a.host||'localhost'))throw Error('OFFLINE_NETWORK_BLOCKED');if(/^https?:\/\//i.test(a.path||'')&&!allowedHost(new URL(a.path).hostname))throw Error('OFFLINE_PROXY_NETWORK_BLOCKED');}}
for(const mod of [http,https])for(const method of ['request','get']){const original=mod[method];mod[method]=(...args)=>{checkDestination(args);return original(...args);};}
const oldFetch=globalThis.fetch;
globalThis.fetch=(u,...args)=>{if(!allowedHost(new URL(typeof u==='string'||u instanceof URL?u:u.url).hostname))throw Error('OFFLINE_NETWORK_BLOCKED');return oldFetch(u,...args);};
function protect(x){if(typeof x!=='string'&&!(x instanceof URL)&&!Buffer.isBuffer(x))return;const q=path.resolve(x instanceof URL?x.pathname:String(x));if(q===root+'/data'||q===root+'/.env'||q===root+'/.web.env'||q===root+'/BA_BIAS_MARKET_BIAS_SPEC_V1.md'||q.startsWith(root+'/data/')||q.startsWith(root+'/audit/')||q.startsWith(root+'/design/'))throw Error('OFFLINE_PRODUCTION_WRITE_BLOCKED');}
for(const name of ['writeFile','appendFile','mkdir','rm','unlink','rename','link','copyFile']){const original=fsp[name];fsp[name]=(...args)=>{protect(args[0]);if(['rename','link','copyFile'].includes(name))protect(args[1]);return original(...args);};}
for(const name of ['writeFileSync','appendFileSync','mkdirSync','rmSync','unlinkSync','renameSync','copyFileSync']){const original=fs[name];fs[name]=(...args)=>{protect(args[0]);if(['renameSync','copyFileSync'].includes(name))protect(args[1]);return original(...args);};}
for(const mod of [fs,fsp]){const original=mod.open;mod.open=(...args)=>{if(typeof args[1]==='string'&&/[wa+]/.test(args[1]))protect(args[0]);return original(...args);};}
syncBuiltinESMExports();
