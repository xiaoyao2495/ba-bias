// Read-only replay. Does not import Scanner/main or create a model/network client.
import fs from 'node:fs';
import {config} from '../../src/config.js';
import {selectOpportunities} from '../../src/market/opportunity-selector.js';
import {compare,summary,storyKey,longShortMaterial,reconcile,emptyHistory} from '../../src/storage/history.js';
import {verifiedFacts} from '../../src/intelligence/packet.js';
import {precisionFacts} from '../../test/selector-precision-fixture.js';
const original=fs.readFileSync('test/fixtures/selector-pre-historical-freshness.txt','utf8');
const before=new Function('config','compare','longShortMaterial','storyKey','summary','verifiedFacts',original.replace(/^import .*;\n/gm,'').replaceAll('export function','function')+'\nreturn selectOpportunities;')(config,compare,longShortMaterial,storyKey,summary,verifiedFacts);
const H=3600000,ages=[1,12,24,48,48+1/H,48+1000/H,72,168,720],base=precisionFacts({price:40}),T=base.dataCutoff;
const scenarios=[['SAME',{}],['PRICE_DRIFT',{price:40.001}],['OI_DRIFT',{price:40,oi:.001}],['FUNDING_DRIFT',{price:40,funding:.00001}],['REVERSAL',{price:-40}],['OI_MATERIAL',{price:40,oi:40}],['FUNDING_MATERIAL',{price:40,funding:-.3}]];
const take=r=>r.decisions.map(x=>({symbol:x.symbol,status:x.status,reason:x.reason,score:x.score,rank:x.rank,storyType:x.comparison?.storyType}));
const synthetic=[];for(const age of ages)for(const [name,options]of scenarios){const f=name==='SAME'?base:precisionFacts(options),stories={[f.symbol]:{summary:summary(base),lastResearchTime:T-age*H,runId:'OLD',status:'RESEARCH'}};synthetic.push({ageHours:age,name,before:take(before([f],stories))[0],after:take(selectOpportunities([f],stories))[0]});}
const archive=[],boxes=fs.existsSync('data/outbox')?fs.readdirSync('data/outbox').filter(n=>n.endsWith('.json')).map(n=>JSON.parse(fs.readFileSync('data/outbox/'+n))):[];
for(const id of ['hourly_20261011_1200','hourly_20261011_1400','hourly_20261011_1600']){
 const dir='data/runs/'+id;if(!fs.existsSync(dir)){archive.push({runId:id,status:'NOT_AVAILABLE'});continue;}
 const r=JSON.parse(fs.readFileSync(dir+'/result.json')),facts=fs.readdirSync(dir+'/facts').map(n=>JSON.parse(fs.readFileSync(dir+'/facts/'+n))).filter(f=>Number(f.sources?.ticker?.raw?.quoteVolume)>1e7);
 const prior=boxes.filter(b=>b.generatedAt<r.startedAt&&b.evaluationTime<=r.evaluationTime&&b.delivery.status==='SENT'&&b.delivery.acknowledgedAt<r.startedAt);
 const stories=reconcile(emptyHistory(),structuredClone(prior)).stories,a=before(facts,stories),b=selectOpportunities(facts,stories),shape=x=>({qualified:x.qualifiedCount,selected:x.selected.map(r=>({symbol:r.symbol,score:r.score})),noMaterial:x.decisions.filter(r=>r.reason==='NO_MATERIAL_CHANGE').length,rows:take(x)});
 archive.push({runId:id,status:'LOCAL_LEGACY_READONLY_REPLAY_NOT_WINDOWS_PRODUCTION',facts:facts.length,before:shape(a),after:shape(b),same:JSON.stringify(shape(a))===JSON.stringify(shape(b)),expiredSummaries:b.decisions.filter(r=>r.historicalBaseline?.status==='EXPIRED_FOR_CURRENT_COMPARISON').length});
}
console.log(JSON.stringify({synthetic,archive,externalCalls:0,modelCalls:0,writes:0},null,2));
