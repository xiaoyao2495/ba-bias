// Explicit anonymous GET whitelist. No private authentication/diagnostic dispatch here.
import {validate} from './reader.js';
export const publicPages=new Set(['/','/selector','/history','/runs']);
export const publicAssets=new Set(['/assets/app.js','/assets/style.css','/assets/presentation.js']);
export function publicRoute(path){
 if(publicPages.has(path)||publicAssets.has(path)||/^\/runs\/[A-Za-z0-9_-]{1,100}$/.test(path)||/^\/symbol\/[\p{L}\p{N}]{1,40}USDT$/u.test(path))return 'STATIC';
 if(['/api/overview','/api/runs','/api/selector','/api/trend-simple','/api/trend-simple/history'].includes(path)||/^\/api\/runs\/[A-Za-z0-9_-]{1,100}$/.test(path)||/^\/api\/symbols\/[\p{L}\p{N}]{1,40}USDT$/u.test(path))return 'API';
 return null;
}
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
const pageInt=(v,fallback,max)=>{if(v===null)return fallback;const n=Number(v);if(!Number.isInteger(n)||n<1||n>max)fail('INVALID_PUBLIC_PAGINATION');return n;};
export async function publicGet(path,q,reader,dto){
 const index=await reader.runsIndex();if(index.indexError&&(index.indexError!=='MISSING'||index.items.length))fail('PUBLIC_SOURCE_UNAVAILABLE',503);
 const symbolPath=path.startsWith('/api/symbols/'),runPath=path.startsWith('/api/runs/');
 const keys=path==='/api/runs'?['page','limit','q','symbol','status','from','to']:path==='/api/selector'?['runId']:symbolPath?['page','limit','runId']:[];
 for(const [key,v]of q){if(!keys.includes(key)||v.length>100)fail('INVALID_PUBLIC_QUERY');}
 const paging={page:pageInt(q.get('page'),1,10000),limit:pageInt(q.get('limit'),12,12)};
 const completed=async id=>{const r=await reader.run(id);if(r.snapshotState!=='COMPLETED_RECORD')fail('PUBLIC_RESEARCH_NOT_READY',404);return r;};
 if(path==='/api/overview')return dto.overview(await reader.overview());
 if(path==='/api/runs'){
  const status=q.get('status')||'';if(status&&!['COMPLETE','PARTIAL','FAILED','INTERRUPTED','SKIPPED_MISSED','SKIPPED_OVERLAP'].includes(status))fail('INVALID_PUBLIC_STATUS');
  for(const k of ['from','to'])if(q.get(k)&&(!/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(q.get(k))||!Number.isFinite(Date.parse(q.get(k)))))fail('INVALID_PUBLIC_TIME');
  return dto.runs(await reader.listRuns({page:paging.page,limit:paging.limit,q:q.get('q')||'',symbol:q.get('symbol')||'',status,from:q.get('from')||'',to:q.get('to')||'',completedOnly:true}));
 }
 if(runPath)return dto.run(await completed(validate(path.slice('/api/runs/'.length),'run')));
 if(path==='/api/selector'){
  const id=q.get('runId')||(await reader.listRuns({limit:1,completedOnly:true})).items[0]?.runId;
  if(!id)return dto.selector({available:false,rows:[]});const r=await completed(validate(id,'run'));
  return dto.selector({runId:id,available:r.selector.available,rows:r.selector.rows,policy:r.record.selector?.policy,snapshotState:r.snapshotState,dataSource:r.dataSource});
 }
 if(symbolPath){const s=validate(path.slice('/api/symbols/'.length),'symbol');if(q.get('runId')){const id=validate(q.get('runId'),'run');await completed(id);return dto.research(await reader.research(id,s));}const t=await reader.symbolTimeline(s,{page:paging.page,limit:paging.limit,completedOnly:true});const checks=await Promise.all(t.items.map(async r=>{const result=await reader.result(r.runId);return result.value?.finishedAt!=null&&result.value.status!=='RUNNING'?r:null;}));return dto.timeline({items:checks.filter(Boolean),page:t.page,limit:t.limit,total:t.total,coverage:t.coverage});}
 fail('PUBLIC_ROUTE_FORBIDDEN',403);
}
