import {publicDTO} from './public-dto.js';
import {publicRoute,publicGet} from './public-routes.js';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {webConfig,loadWebEnvironment,projectRoot} from './config.js';
import {Reader,validate,RUN,SYMBOL} from './reader.js';
import {sessions,limiter,verifyPassword,sanitize} from './security.js';
import {scannerProcesses} from './process.js';
const staticFiles={'/':'index.html','/assets/app.js':'assets/app.js','/assets/style.css':'assets/style.css','/assets/presentation.js':'assets/presentation.js'};
const pagePattern=/^\/(?:selector|history|system|runs(?:\/[A-Za-z0-9_-]{1,100})?|symbol\/[\p{L}\p{N}]{1,40}USDT)$/u;
const integer=(value,fallback,max)=>{if(value===null)return fallback;const n=Number(value);if(!Number.isInteger(n)||n<1||n>max)throw Object.assign(Error('INVALID_PAGINATION'),{status:400});return n;};
async function body(req){let text='';for await(const b of req){text+=b.toString('utf8');if(Buffer.byteLength(text)>4096)throw Object.assign(Error('BODY_TOO_LARGE'),{status:413});}try{return JSON.parse(text);}catch{throw Object.assign(Error('INVALID_JSON'),{status:400});}}
export function createWebServer(config,{reader=new Reader(config.dataDir,{maxEntries:config.publicReadonly?100:500,maxFileBytes:config.publicReadonly?2*1024*1024:16*1024*1024,maxHistoryBytes:16*1024*1024,secrets:Object.entries(process.env).filter(([k])=>/KEY|TOKEN|PASSWORD|WEBHOOK|SECRET/i.test(k)).map(([,v])=>v)}),now=Date.now,processProbe=scannerProcesses,log=event=>console.log(JSON.stringify({service:'ba-bias-web',event}))}={}){
 const auth=config.publicReadonly?null:sessions({now,ttl:config.sessionMs}),rate=limiter({now,max:config.publicReadonly?60:180}),loginRate=limiter({now,max:5,windowMs:15*60000}),globalLoginRate=limiter({now,max:20,windowMs:60000});let publicActive=0;let healthCache=null,healthAt=0,healthPending=null;let systemCache=null,systemAt=0,systemPending=null;
 const dto=publicDTO(reader.secrets||Object.entries(process.env).filter(([k])=>/KEY|TOKEN|PASSWORD|WEBHOOK|SECRET/i.test(k)).map(([,v])=>v)),publicRate=limiter({now,max:600,capacity:1});
 const clean=v=>reader.clean(v);const cookie=(id,expired=false)=>`ba_bias_session=${id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${expired?0:config.sessionMs/1000}${config.secure?'; Secure':''}`;
 async function health(){if(healthCache&&now()-healthAt<15000)return healthCache;if(healthPending)return healthPending;
  healthPending=(async()=>{const lock=await reader.json('state/run.lock'),probe=await processProbe(config.projectRoot,lock.value?.pid),idx=await reader.runsIndex(),latest=idx.items[0]?await reader.run(idx.items[0].runId).catch(()=>null):null;let heartbeat=null;try{const file=await reader.contained('state/run.lease');heartbeat=(await fs.stat(file)).mtimeMs;}catch{}
   let state=probe.state;if(state==='RUNNING'&&probe.instances>1)state='DEGRADED';else if(state==='RUNNING'&&latest?.record.dataCutoff!=null&&now()-latest.record.dataCutoff>config.staleMs)state='STALE';else if(state==='RUNNING'&&latest?.record.status==='FAILED')state='DEGRADED';
   const successful=idx.items.find(r=>r.status==='COMPLETE');healthCache=clean({web:'RUNNING',scanner:state,process:probe,currentRun:latest?.record.status==='RUNNING'?latest.record.runId:null,latestRun:latest?.record??null,lastSuccessfulRun:successful??null,leaseHeartbeatAt:heartbeat,heartbeatMeaning:'filesystem lease renewal while research/delivery lock is held; absent while waiting',observedAt:now(),dataStale:latest?.record.dataCutoff==null?null:now()-latest.record.dataCutoff>config.staleMs,deploymentMode:'UNKNOWN (scanner launch mechanism not recorded)',readError:idx.indexError});healthAt=now();return healthCache;
  })();try{return await healthPending;}finally{healthPending=null;}}
 async function system(){if(systemCache&&now()-systemAt<30000)return systemCache;if(systemPending)return systemPending;systemPending=(async()=>{const [h,index]=await Promise.all([health(),reader.runsIndex()]);const latest=index.items[0]?await reader.run(index.items[0].runId).catch(()=>null):null;
  let noEdge=null;if(latest?.record.analystVersion==='V4'){noEdge=0;for(const file of (await reader.names(`runs/${latest.record.runId}/directional`)).filter(n=>n.endsWith('.json')&&SYMBOL.test(n.slice(0,-5))).slice(0,1000)){const r=await reader.json(`runs/${latest.record.runId}/directional/${file}`);if(r.value?.analystVersion==='V4'&&r.value.status==='VALIDATED'&&r.value.analysis?.direction==='NO_EDGE')noEdge++;}}
  const names=(await reader.names('outbox')).filter(n=>/^[A-Za-z0-9_-]+_[\p{L}\p{N}]{1,40}USDT\.json$/u.test(n)),counts={},errors=[];let lastAcknowledgedAt=null;
  for(const file of names.slice(0,1000)){const r=await reader.json('outbox/'+file);if(!r.value){errors.push({error:r.error});continue;}const d=r.value.delivery,st=d?.status||'UNKNOWN';counts[st]=(counts[st]||0)+1;if(st==='SENT'&&d.acknowledgement?.errcode===0&&Number.isSafeInteger(d.acknowledgedAt))lastAcknowledgedAt=Math.max(lastAcknowledgedAt??0,d.acknowledgedAt);}
  systemCache=clean({health:h,latest,cost:latest?.cost??{usageStatus:'UNKNOWN'},analyst:{valid:latest?.counters.v4Valid??null,failed:latest?.counters.v4Failed??null,noEdge},outbox:{counts,readErrors:errors,coverage:names.length>1000?'PARTIAL':'COMPLETE',scanned:Math.min(names.length,1000),totalFiles:names.length,lastAcknowledgedAt,sentMeaning:'DingTalk API confirmed; not user read receipt'},timeZone:'Asia/Shanghai'});systemAt=now();return systemCache;})();try{return await systemPending;}finally{systemPending=null;}
 }
 const server=http.createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");if(config.secure)res.setHeader('Strict-Transport-Security','max-age=31536000');
  const send=(code,value)=>{const json=JSON.stringify(clean(value));if(config.publicReadonly&&Buffer.byteLength(json)>1048576){res.writeHead(503,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify({error:'PUBLIC_RESPONSE_LIMIT'}));return;}res.writeHead(code,{'Content-Type':'application/json; charset=utf-8'});res.end(json);};
  try{
   if(req.headers.host!==new URL(config.origin).host)return send(400,{error:'UNTRUSTED_HOST'});
   if(req.headers.origin&&req.headers.origin!==config.origin)return send(403,{error:'UNTRUSTED_ORIGIN'});
   if(req.headers['sec-fetch-site']==='cross-site')return send(403,{error:'CROSS_SITE_REQUEST'});
   const ip=req.socket.remoteAddress||'unknown';if(!rate(ip))return send(429,{error:'RATE_LIMITED'});
   if(/%2f|%5c|%00|\.\.|\\/i.test(req.url))return send(400,{error:'PATH_REJECTED'});
   if(config.publicReadonly&&(req.url.length>2048))return send(414,{error:'PUBLIC_URL_LIMIT'});
   if(config.publicReadonly&&(Number(req.headers['content-length']||0)>0||req.headers['transfer-encoding']))return send(413,{error:'PUBLIC_BODY_FORBIDDEN'});
   const url=new URL(req.url,config.origin),pathname=decodeURIComponent(url.pathname),q=url.searchParams;
   if(pathname==='/api/web-mode'&&req.method==='GET'){if(config.publicReadonly)res.setHeader('Set-Cookie',cookie('',true));return send(200,{mode:config.publicReadonly?'PUBLIC_READONLY':'PRIVATE_AUTHENTICATED'});}
   if(config.publicReadonly){
    if(req.method!=='GET')return send(405,{error:'PUBLIC_READ_ONLY'});
    if(!publicRate('public'))return send(429,{error:'RATE_LIMITED'});
    const route=publicRoute(pathname);if(!route)return send(403,{error:'PUBLIC_ROUTE_FORBIDDEN'});
    // Ignore and expire legacy cookies; never create a public session.
    res.setHeader('Set-Cookie',cookie('',true));
    if(route==='API'){if(publicActive>=4)return send(503,{error:'PUBLIC_BUSY'});publicActive++;try{const output=await publicGet(pathname,q,reader,dto);return send(200,{...output,servedAt:now()});}finally{publicActive--;}}
    // Approved static requests continue to the same fixed resource map below.
   }
   const id=config.publicReadonly?undefined:req.headers.cookie?.match(/(?:^|;\s*)ba_bias_session=([a-f0-9]{64})(?:;|$)/)?.[1],session=auth?.get(id);
   if(!config.publicReadonly&&pathname==='/api/login'&&req.method==='POST'){
    if(req.headers.origin!==config.origin||!req.headers['content-type']?.startsWith('application/json'))return send(403,{error:'LOGIN_ORIGIN_REQUIRED'});
    if(!loginRate(ip)||!globalLoginRate('global'))return send(429,{error:'LOGIN_RATE_LIMITED'});
    const input=await body(req);if(!await verifyPassword(input.password,config.passwordHash)){log('LOGIN_FAILED');return send(401,{error:'INVALID_CREDENTIALS'});}
    const created=auth.create();res.setHeader('Set-Cookie',cookie(created.id));log('LOGIN_SUCCEEDED');return send(200,{ok:true,csrf:created.csrf});
   }
   if(!config.publicReadonly&&pathname.startsWith('/api/')){
    if(!session)return send(401,{error:'AUTHENTICATION_REQUIRED'});
    if(pathname==='/api/logout'&&req.method==='POST'){if(req.headers.origin!==config.origin||req.headers['x-csrf-token']!==session.csrf)return send(403,{error:'CSRF_REJECTED'});auth.remove(id);res.setHeader('Set-Cookie',cookie('',true));return send(200,{ok:true});}
    if(req.method!=='GET')return send(405,{error:'READ_ONLY_API'});
    if(pathname==='/api/session')return send(200,{authenticated:true,csrf:session.csrf,expiresAt:session.expires});
    const pagination={page:integer(q.get('page'),1,10000),limit:integer(q.get('limit'),24,50)};
    let output;
    if(pathname==='/api/health')output=await health();
    else if(pathname==='/api/overview')output=await reader.overview();
    else if(pathname==='/api/system')output=await system();
    else if(pathname==='/api/runs'){
     const opts=Object.fromEntries(['q','status','symbol','notification','v4','delivery','from','to'].map(k=>[k,q.get(k)||'']));if(Object.values(opts).some(v=>v.length>100))throw Object.assign(Error('FILTER_TOO_LONG'),{status:400});for(const k of ['from','to'])if(opts[k]&&!Number.isFinite(Date.parse(opts[k])))throw Object.assign(Error('INVALID_TIME_FILTER'),{status:400});output=await reader.listRuns({...pagination,...opts});
    }else if(/^\/api\/runs\/[^/]+$/.test(pathname))output=await reader.run(validate(pathname.split('/')[3],'run'));
    else if(pathname==='/api/selector'){const runId=q.get('runId')||(await reader.runsIndex()).items[0]?.runId;if(!runId)output={rows:[],available:false,reason:'NO_RUNS'};else{validate(runId,'run');const run=await reader.run(runId);output={runId,...run.selector,policy:run.record.selector?.policy??null,dataSource:run.dataSource,snapshotState:run.snapshotState};}}
    else if(/^\/api\/symbols\/[^/]+$/.test(pathname)){const symbol=validate(pathname.split('/')[3],'symbol');output=q.get('runId')?await reader.research(validate(q.get('runId'),'run'),symbol):await reader.symbolTimeline(symbol,{...pagination,limit:Math.min(pagination.limit,20)});if(output.total===0)return send(404,{error:'SYMBOL_NOT_FOUND'});}
    else return send(404,{error:'NOT_FOUND'});
    return send(200,{...output,servedAt:now()});
   }
   if(req.method!=='GET')return send(405,{error:'METHOD_NOT_ALLOWED'});
   const relative=staticFiles[pathname]||(pagePattern.test(pathname)?'index.html':null);if(!relative)return send(404,{error:'NOT_FOUND'});
   let text=await fs.readFile(path.join(projectRoot,'web',relative));if(config.publicReadonly&&relative==='index.html')text=Buffer.from(text.toString('utf8').replace('id="system-status"','id="system-status" hidden'));res.writeHead(200,{'Content-Type':relative.endsWith('.css')?'text/css; charset=utf-8':relative.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});res.end(text);
  }catch(e){const status=e.status||500;log(status===500?'READ_ERROR':'REQUEST_REJECTED');send(status,{error:config.publicReadonly?'PUBLIC_READ_ERROR':status===500?'WEB_READ_ERROR':e.message});}
 });
 server.requestTimeout=15000;server.headersTimeout=10000;server.keepAliveTimeout=5000;server.maxRequestsPerSocket=100;
 return {server,reader,health,system};
}
export async function startWeb(){loadWebEnvironment();const config=webConfig(),{server}=createWebServer(config);await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(config.port,config.host,resolve);});console.log(JSON.stringify({service:'ba-bias-web',event:'LISTENING',origin:config.origin,mode:config.mode,readOnly:true}));const stop=()=>server.close(()=>{process.exitCode=0;});process.once('SIGINT',stop);process.once('SIGTERM',stop);return server;}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)startWeb().catch(e=>{console.error(e.code==='EADDRINUSE'?'WEB_PORT_IN_USE':e.message);process.exitCode=1;});
