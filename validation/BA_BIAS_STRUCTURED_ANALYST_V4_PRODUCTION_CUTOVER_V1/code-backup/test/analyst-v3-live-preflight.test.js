import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {availability,assertFrozen,inventory} from '../scripts/analyst-v3-live-preflight.js';
test('V3 live causal precheck never uses later retrieval as earlier availability',()=>assert.equal(availability({retrievedAt:101},100).reason,'NOT_PROVEN_AVAILABLE_AT_EVALUATION'));
test('missing historical acquisition time does not pass by event time',()=>assert.equal(availability({raw:[{timestamp:1}]},100).ok,false));
test('recorded acquisition by evaluation is accepted',()=>assert.equal(availability({retrievedAt:99},100).ok,true));
test('invalid evaluation time fails before sample selection',()=>assert.equal(availability({retrievedAt:99},NaN).ok,false));
test('frozen V3 files and actual model configuration still match',()=>assert.doesNotThrow(()=>assertFrozen(JSON.parse(fs.readFileSync('validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/frozen-contract.json')))));
test('preflight has no client/scanner/delivery imports or API execution',()=>{const code=fs.readFileSync('scripts/analyst-v3-live-preflight.js','utf8');const imports=code.match(/^import .*$/gm).join('\n');assert.doesNotMatch(imports,/clients|scanner|scheduler|packet|storage|notification/);assert.doesNotMatch(code,/fetch\(|axios\.|\.json\(.*maxTokens/);});
test('all inventory rows preserve original evaluation and unique identities',()=>{const rows=inventory();assert.equal(new Set(rows.map(r=>r.sampleId)).size,rows.length);for(const r of rows){const f=JSON.parse(fs.readFileSync(r.originalFactsPath));assert.equal(Date.parse(r.evaluationTime),f.dataCutoff);assert.equal(r.originalEvidenceCount,f.evidence.length);}});
