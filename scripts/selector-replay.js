import fs from 'node:fs';import {selectOpportunities} from '../src/market/opportunity-selector.js';import {emptyHistory,reconcile} from '../src/storage/history.js';
const dir='validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1',read=p=>JSON.parse(fs.readFileSync(p)),outbox=fs.readdirSync('data/outbox').filter(f=>f.endsWith('.json')).map(f=>read('data/outbox/'+f)),results=[];
for(const runId of ['hourly_20261011_1200','hourly_20261011_1400','hourly_20261011_1600']){
 const root='data/runs/'+runId,r=read(root+'/result.json'),facts=fs.readdirSync(root+'/facts').map(f=>read(root+'/facts/'+f));
 // Do not use stories first acknowledged after the historical decision time.
 const historical=outbox.filter(b=>b.generatedAt<r.startedAt&&b.evaluationTime<=r.evaluationTime&&b.delivery.status==='SENT'&&b.delivery.acknowledgedAt<r.startedAt);
 const selection=selectOpportunities(facts,reconcile(emptyHistory(),structuredClone(historical)).stories),statuses=selection.decisions.reduce((a,d)=>(a[d.status]=(a[d.status]||0)+1,a),{});
 const decisions=selection.decisions.map(d=>{const {facts,...rest}=d;return rest;});
 results.push({runId,factsCount:facts.length,initialCandidates:r.scan.candidates.length,statuses,qualified:selection.qualifiedCount,selected:selection.selected.map(d=>d.symbol),expectedFirstV4Requests:selection.selected.length,originalJudgeLogicalCalls:r.judgedCandidates,originalV4FirstCalls:r.directionalAnalyses,originalOutputs:r.generated,externalRequests:0,historyCutoff:r.startedAt,historySourceCount:historical.length,policy:selection.policy,decisions});
}
fs.writeFileSync(dir+'/replay.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(({decisions,policy,...r})=>r)));
