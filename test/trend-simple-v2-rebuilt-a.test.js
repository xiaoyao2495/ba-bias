import {test} from 'node:test';
import assert from 'node:assert/strict';
import {evaluateTrendA} from '../src/trend-simple-v2/candidates.js';
import {evaluateCandidate} from '../src/trend-simple-v2/candidates.js';
import {requestPayload} from '../src/trend-simple-v2/live-research.js';
import fs from 'node:fs';

test('rebuilt A enforces strict boundaries and fails closed on missing indicators',()=>{
 const x={close:12,ema20:10,ema20Previous2:9,ema10:11,ema30:10,plusDI14:20,minusDI14:10,closesAboveEMA20Last8:5,closePrevious12:11};
 assert.equal(evaluateTrendA(x).eligible,true);
 for(const change of [{ema10:10},{ema20Previous2:10},{plusDI14:10},{closesAboveEMA20Last8:4},{closePrevious12:12},{plusDI14:null},{ema10:NaN}]) assert.equal(evaluateTrendA({...x,...change}).eligible,false);
 assert.deepEqual(evaluateTrendA({...x,plusDI14:null}).missing,['plusDI14']);
});

test('real fixture supports trend A with negative displacement and rejects a momentum-only case',()=>{
 const raw=JSON.parse(fs.readFileSync(new URL('../research/bull-discovery-latency-v1/raw/IDOLUSDT.json',import.meta.url)));
 const at=t=>{const rows=raw.filter(x=>x[0]<t).slice(-300);return {rows,result:evaluateCandidate('IDOLUSDT',rows,t)}};
 const added=at(1793354400000),filtered=at(1793372700000);
 assert.equal(added.result.A,true);assert.ok(added.result.displacementAtr<0);
 assert.equal(filtered.result.A,false);assert.ok(filtered.result.displacementAtr>=0.8);
 assert.deepEqual(evaluateCandidate('IDOLUSDT',added.rows,1793354400000),added.result);
 const payload=requestPayload(added.result,added.rows,'deepseek-flash',1024);
 assert.ok(Buffer.byteLength(JSON.stringify(payload))<=32768);
});
