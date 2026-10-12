import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {Reader} from '../src/web/reader.js';
import {projectRoot} from '../src/web/config.js';
const root=path.join(projectRoot,'data'),reader=new Reader(root),runs=[];
for(const runId of ['hourly_20261011_1200','hourly_20261011_1400','hourly_20261011_1600','hourly_20261011_1900']){
 const view=await reader.run(runId);const original=JSON.parse(await fs.readFile(path.join(root,'runs',runId,'result.json'),'utf8'));assert.equal(view.record.dataCutoff,original.dataCutoff);
 runs.push({runId,status:view.record.status,dataSource:view.dataSource,counters:view.counters,selectorRecorded:view.selector.available,noMessageReason:view.noMessageReason});
}
const symbols=[];
for(const symbol of ['BULLAUSDT','LUMIAUSDT','RLCUSDT']){
 const runId='hourly_20261011_1900',view=await reader.research(runId,symbol),original=JSON.parse(await fs.readFile(path.join(root,'runs',runId,'facts',symbol+'.json'),'utf8')),selection=JSON.parse(await fs.readFile(path.join(root,'runs',runId,'selection',symbol+'.json'),'utf8')),directional=JSON.parse(await fs.readFile(path.join(root,'runs',runId,'directional',symbol+'.json'),'utf8')),outbox=JSON.parse(await fs.readFile(path.join(root,'outbox',runId+'_'+symbol+'.json'),'utf8'));
 for(const [key,source]of [['price1h',original.price.closedWindows['1h']],['price4h',original.price.closedWindows['4h']],['price24h',original.price.closedWindows['24h']],['oi1h',original.openInterest.windows['1h']],['oi4h',original.openInterest.windows['4h']],['oi24h',original.openInterest.windows['24h']],['fundingSettled',original.funding.settledLatest]])assert.equal(view.metrics[key]?.value??null,source?.result??null);
 assert.equal(view.analysis.direction,directional.analysis.direction);assert.equal(view.analysis.horizon,directional.analysis.horizon);assert.equal(view.analysis.conviction,directional.analysis.conviction);assert.equal(view.selection.score,selection.score);assert.equal(view.selection.rank,selection.rank);assert.deepEqual(view.message.parts.map(p=>p.content),outbox.delivery.parts.map(p=>p.content));assert.equal(view.delivery.status,outbox.delivery.status);
 symbols.push({symbol,runId,rank:view.selection.rank,score:view.selection.score,direction:view.analysis.direction,horizon:view.analysis.horizon,conviction:view.analysis.conviction,delivery:view.delivery.status,metricComparison:'ALL_MATCHED'});
}
const timeline=await reader.symbolTimeline('LUMIAUSDT',{limit:20}),change=timeline.items.find(x=>x.runId==='hourly_20261011_1900')?.directionChange;assert.equal(change.previousRunId,'hourly_20261011_1400');assert.equal(change.previous,'BULLISH');assert.equal(change.current,'BEARISH');
const output=path.join(projectRoot,'validation/BA_BIAS_MOBILE_WEB_DASHBOARD_V1');await fs.mkdir(output,{recursive:true});await fs.writeFile(path.join(output,'real-replay.json'),JSON.stringify({runs,symbols,lumiaChange:change,externalCalls:0},null,2));console.log(JSON.stringify({runs:runs.length,symbols:symbols.length,allMatched:true,externalCalls:0}));
