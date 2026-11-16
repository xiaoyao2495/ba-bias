import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {createWebServer} from '../src/web/server.js';import {projectRoot} from '../src/web/config.js';
test('V1 ranking HTTP serves multi-round average and retains exact-run compatibility',async()=>{const dir=await fs.mkdtemp(path.join(os.tmpdir(),'simple-rank-web-'));let app;try{const id='TREND_SIMPLE_5M_V1_20260101_2000',folder=path.join(dir,'trend-simple-5m-v1','runs',id);await fs.mkdir(folder,{recursive:true});await fs.writeFile(path.join(folder,'candidate-ranking.json'),JSON.stringify({schemaVersion:'BULL_CANDIDATE_RANKING_V1',runId:id,evaluationTime:1,selection:{topK:3},candidates:[{symbol:'AAAUSDT',originalRank:1,candidateCategory:'BOTH_BULLISH',adx14:25,er20:.4,excludedFromLLM:true,exclusionReason:'BULL_COOLDOWN',cooldownUntil:10},{symbol:'BBBUSDT',rank:2,candidateCategory:'INDICATOR_BULLISH',selectedForLLM:true}]}));const cfg={host:'127.0.0.1',origin:'http://127.0.0.1',publicReadonly:true,secure:false,sessionMs:1000,staleMs:1000,dataDir:dir,projectRoot,researchMode:'TREND_SIMPLE_V1'};app=createWebServer(cfg,{log:()=>{}});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));cfg.origin=`http://127.0.0.1:${app.server.address().port}`;let response=await fetch(cfg.origin+'/api/trend-simple/ranking?window=24'),v=await response.json();assert.equal(response.status,200);assert.equal(v.mode,'MULTI_ROUND_AVERAGE');assert.equal(v.roundsRequested,24);assert.equal(v.roundsUsed,1);assert.equal(v.partial,true);assert.deepEqual(v.items.map(x=>x.symbol),['AAAUSDT','BBBUSDT']);assert.equal(v.items[0].averageScore,100);response=await fetch(cfg.origin+'/api/trend-simple/ranking?runId='+id);v=await response.json();assert.equal(v.mode,'SINGLE_ROUND');assert.deepEqual(v.candidates.map(x=>x.symbol),['AAAUSDT','BBBUSDT']);assert.equal(v.candidates[0].exclusionReason,'BULL_COOLDOWN');assert.equal(v.candidates[1].selectedForLLM,true);for(const window of [6,10,7,49])assert.equal((await fetch(cfg.origin+'/api/trend-simple/ranking?window='+window)).status,400);assert.equal((await fetch(cfg.origin+'/api/trend-simple/ranking?runId=invalid')).status,400);const missing=await(await fetch(cfg.origin+'/api/trend-simple/ranking?runId=TREND_SIMPLE_5M_V1_20260101_2010')).json();assert.equal(missing.available,false);}finally{if(app?.server.listening)await new Promise(r=>app.server.close(r));await fs.rm(dir,{recursive:true,force:true});}});

test('V1 ranking HTTP averages the actual latest 24 or 48 persisted rounds',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'simple-rank-window-'));let app;
 const start=Date.parse('2026-01-01T00:00:00Z'),slot=300000;
 try{
  for(let i=0;i<50;i++){
   const cycle=start+i*slot,iso=new Date(cycle).toISOString(),id=`TREND_SIMPLE_5M_V1_${iso.slice(0,10).replaceAll('-','')}_${iso.slice(11,16).replace(':','')}`;
   const folder=path.join(dir,'trend-simple-5m-v1','runs',id);
   const candidates=[{symbol:'STEADYUSDT',originalRank:1}];
   const extra=({1:'OUTSIDEUSDT',2:'WIDEUSDT',25:'MIDDLEUSDT',26:'SHORTUSDT'})[i];
   if(extra)candidates.push({symbol:extra,originalRank:2});
   await fs.mkdir(folder,{recursive:true});
   await fs.writeFile(path.join(folder,'candidate-ranking.json'),JSON.stringify({schemaVersion:'BULL_CANDIDATE_RANKING_V1',runId:id,evaluationTime:cycle,candidates}));
  }
  const cfg={host:'127.0.0.1',origin:'http://127.0.0.1',publicReadonly:true,secure:false,sessionMs:1000,staleMs:1000,dataDir:dir,projectRoot,researchMode:'TREND_SIMPLE_V1'};
  app=createWebServer(cfg,{log:()=>{}});
  await new Promise((resolve,reject)=>{app.server.once('error',reject);app.server.listen(0,'127.0.0.1',resolve);});
  cfg.origin=`http://127.0.0.1:${app.server.address().port}`;
  for(const [query,window,first,expected] of [
   ['',24,26,['STEADYUSDT','SHORTUSDT']],
   ['?window=24',24,26,['STEADYUSDT','SHORTUSDT']],
   ['?window=48',48,2,['STEADYUSDT','SHORTUSDT','MIDDLEUSDT','WIDEUSDT']]
  ]){
   const response=await fetch(cfg.origin+'/api/trend-simple/ranking'+query),body=await response.json();
   assert.equal(response.status,200);
   assert.equal(body.window,window);
   assert.equal(body.roundsRequested,window);
   assert.equal(body.roundsUsed,window);
   assert.equal(body.partial,false);
   assert.equal(body.fromCycle,start+first*slot);
   assert.equal(body.toCycle,start+49*slot);
   assert.deepEqual(body.items.map(x=>x.symbol).sort(),expected.slice().sort());
   assert.equal(body.items[0].symbol,'STEADYUSDT');
   assert.equal(body.items[0].averageScore,100);
   assert.equal(body.items[0].appearances,window);
   assert.equal(body.items.find(x=>x.symbol==='SHORTUSDT').averageScore,50/window);
  }
 }finally{
  if(app?.server.listening)await new Promise(r=>app.server.close(r));
  await fs.rm(dir,{recursive:true,force:true});
 }
});
