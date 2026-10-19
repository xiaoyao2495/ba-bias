import fs from 'node:fs';
import {precisionFacts,precisionMarket} from '../../test/selector-precision-fixture.js';
import {selectOpportunities} from '../../src/market/opportunity-selector.js';
import {scan} from '../../src/market/scanner.js';
import {emptyHistory,reconcile,summary} from '../../src/storage/history.js';
const take=r=>({symbol:r.symbol,gate:r.gate,status:r.status,reason:r.reason,score:r.score,rank:r.rank}),boundaries=[];
for(const sign of [1,-1])for(const [funding,price]of [[.149999,8.8],[.15,8.8],[.150001,8.8],[.299999,0],[.3,0],[.300001,0]])boundaries.push({funding:sign*funding,price,...take(selectOpportunities([precisionFacts({funding:sign*funding,price})]).decisions[0])});
const inputs=Array.from({length:7},(_,i)=>precisionFacts({symbol:`ROW${i}USDT`,price:40+i,funding:i%2?.2:0}));
const hist=inputs[0];const fixture=selectOpportunities(inputs,{[hist.symbol]:{summary:summary(hist),lastResearchTime:hist.dataCutoff-1}}).decisions.map(take);
const read=p=>JSON.parse(fs.readFileSync(p)),boxes=fs.readdirSync('data/outbox').filter(n=>n.endsWith('.json')).map(n=>read('data/outbox/'+n)),archive=[];
for(const id of ['hourly_20261011_1200','hourly_20261011_1400','hourly_20261011_1600']){const r=read(`data/runs/${id}/result.json`),all=fs.readdirSync(`data/runs/${id}/facts`).map(n=>read(`data/runs/${id}/facts/${n}`)).filter(f=>Number(f.sources?.ticker?.raw?.quoteVolume)>1e7),prior=boxes.filter(b=>b.generatedAt<r.startedAt&&b.evaluationTime<=r.evaluationTime&&b.delivery.status==='SENT'&&b.delivery.acknowledgedAt<r.startedAt);archive.push({runId:id,rows:selectOpportunities(all,reconcile(emptyHistory(),structuredClone(prior)).stories).decisions.map(take)});}
const market=precisionMarket(Array.from({length:50},(_,i)=>({symbol:`SCAN${i}USDT`,price:i<30?40+i:0,accountShift:i===49?15:0}))),history=emptyHistory(),saved=[];
const scanned=await scan(market,{runId:'MOCK_COMPARE',history,save:async(k,v)=>{if(k.startsWith('facts/'))saved.push(k);}});
console.log(JSON.stringify({boundaries,fixture,archive,scan:{candidates:scanned.result.researchCandidates,selected:scanned.result.candidates,deepOrder:saved,rotation:history.rotation,discoveryRotation:history.longShortDiscoveryRotation,calls:market.calls}},null,2));
