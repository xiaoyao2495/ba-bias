import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {runSimpleRound, SLOT} from '../src/trend-simple/engine.js';
import {openResearchLedger, reserveResearch, completeResearch} from '../src/trend-simple/research-ledger.js';
import {setLlmControl} from '../src/trend-simple/llm-control.js';
import {endpoints} from '../src/clients/binance.js';

const symbols = ['AAAUSDT', 'BBBUSDT', 'CCCUSDT', 'DDDUSDT', 'EEEUSDT'];
const start = Date.parse('2026-01-01T20:00:00Z');
const neutral = () => ({bias: 'NEUTRAL', phase: 'NONE', evidenceStrength: 'WEAK', supportingFactIds: [], conflictingFactIds: []});

function client(cycle) {
 return {get: async (endpoint) => {
  if (endpoint === endpoints.exchange) return {raw: {symbols: symbols.map(symbol => ({symbol, baseAsset: symbol.slice(0, -4), quoteAsset: 'USDT', status: 'TRADING', contractType: 'PERPETUAL', underlyingType: 'COIN', underlyingSubType: []}))}};
  if (endpoint === endpoints.ticker) return {raw: symbols.map(symbol => ({symbol, quoteVolume: '50000000'}))};
  assert.equal(endpoint, endpoints.klines);
  return {raw: Array.from({length: 300}, (_, i) => {const time = cycle - (300 - i) * SLOT, close = 100 + i; return [time, close, close + 1, close - 1, close, 10, time + SLOT - 1];})};
 }};
}

async function fixture(t, blocked = [], paused = false) {
 const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'simple-top3-'));
 t.after(() => fs.rm(dir, {recursive: true, force: true}));
 const db = openResearchLedger(dir);
 try {
  for (const [index, reason] of blocked.entries()) {
   const symbol = symbols[index], id = `seed-${index}`;
   assert.equal(reserveResearch(db, {id, symbol, runId: id, at: start - SLOT}).ok, true);
   if (reason === 'BULL_COOLDOWN') completeResearch(db, {id, symbol, runId: id, at: start - SLOT, result: {symbol, status: 'ASSESSED', validationContract: 'STRUCTURED_V1', bias: 'BULL', facts: {symbol, timeframe: '5m'}}});
   else assert.equal(reason, 'REQUEST_UNKNOWN');
  }
 } finally {db.close();}
 if (paused) setLlmControl(dir, false);
 return dir;
}

for (const {name, blocked, expected} of [
 {name: 'cooling first place does not promote fourth place', blocked: ['BULL_COOLDOWN'], expected: symbols.slice(1, 3)},
 {name: 'UNKNOWN first place does not promote fourth place', blocked: ['REQUEST_UNKNOWN'], expected: symbols.slice(1, 3)},
 {name: 'cooldown and UNKNOWN leave only original third place', blocked: ['BULL_COOLDOWN', 'REQUEST_UNKNOWN'], expected: [symbols[2]]},
 {name: 'all original Top3 protected produces zero calls despite eligible lower ranks', blocked: ['BULL_COOLDOWN', 'REQUEST_UNKNOWN', 'BULL_COOLDOWN'], expected: []}
]) test(name, async t => {
 const dir = await fixture(t, blocked), calls = [];
 const run = await runSimpleRound({cycle: start, dataDir: dir, client: client(start), now: () => start + 10000, call: async (_, input) => {calls.push(input.symbol); return neutral();}});
 assert.equal(run.status, 'COMPLETE');
 assert.deepEqual(run.selected.map(x => x.symbol), expected);
 assert.deepEqual(calls, expected);
 assert.equal(run.calls, expected.length);
 const snapshot = JSON.parse(await fs.readFile(path.join(dir, 'trend-simple-5m-v1', 'runs', run.runId, 'candidate-ranking.json'), 'utf8'));
 assert.deepEqual(snapshot.candidates.map(x => x.symbol), symbols);
 assert.deepEqual(snapshot.candidates.map(x => x.originalRank), [1, 2, 3, 4, 5]);
 assert.deepEqual(snapshot.candidates.filter(x => x.selectedForLLM).map(x => x.symbol), expected);
 for (const [index, reason] of blocked.entries()) assert.equal(snapshot.candidates[index].exclusionReason, reason);
 assert.equal(snapshot.candidates[3].excludedFromLLM, false);
 assert.equal(snapshot.candidates[3].selectedForLLM, false);
 const db = openResearchLedger(dir);
 try {
  assert.deepEqual(db.prepare('SELECT symbol FROM requests WHERE run_id=? ORDER BY symbol').all(run.runId).map(x => x.symbol), expected);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM requests').get().n, blocked.length + expected.length);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM requests WHERE symbol IN (?,?)').get(symbols[3], symbols[4]).n, 0);
 } finally {db.close();}
});

test('paused LLM still scans and preserves all ranks without any reservations', async t => {
 const dir = await fixture(t, [], true);
 const run = await runSimpleRound({cycle: start, dataDir: dir, client: client(start), now: () => start + 10000, call: async () => assert.fail('Paused LLM must not be called')});
 assert.equal(run.status, 'COMPLETE');
 assert.equal(run.coverage.valid, symbols.length);
 assert.equal(run.bullishCandidates, symbols.length);
 assert.deepEqual(run.selected, []);
 assert.equal(run.calls, 0);
 const snapshot = JSON.parse(await fs.readFile(path.join(dir, 'trend-simple-5m-v1', 'runs', run.runId, 'candidate-ranking.json'), 'utf8'));
 assert.deepEqual(snapshot.candidates.map(x => x.symbol), symbols);
 assert.ok(snapshot.candidates.every(x => !x.selectedForLLM && x.exclusionReason === 'LLM_PAUSED'));
 const db = openResearchLedger(dir);
 try {assert.equal(db.prepare('SELECT COUNT(*) n FROM requests').get().n, 0);} finally {db.close();}
});

test('NEUTRAL original Top3 remain researchable every five minutes without promoting lower ranks', async t => {
 const dir = await fixture(t), calls = [];
 for (const cycle of [start, start + SLOT]) {
  const run = await runSimpleRound({cycle, dataDir: dir, client: client(cycle), now: () => cycle + 10000, call: async (_, input) => {calls.push(input.symbol); return neutral();}});
  assert.equal(run.status, 'COMPLETE');
  assert.deepEqual(run.selected.map(x => x.symbol), symbols.slice(0, 3));
  assert.equal(run.calls, 3);
  assert.ok(run.results.every(x => x.status === 'ASSESSED' && x.bias === 'NEUTRAL'));
 }
 assert.deepEqual(calls, [...symbols.slice(0, 3), ...symbols.slice(0, 3)]);
 const db = openResearchLedger(dir);
 try {
  assert.equal(db.prepare('SELECT COUNT(*) n FROM requests').get().n, 6);
  assert.ok(db.prepare('SELECT status FROM requests').all().every(x => x.status === 'COMPLETED'));
  assert.ok(db.prepare('SELECT bias,cooldown_until FROM symbols').all().every(x => x.bias === 'NEUTRAL' && x.cooldown_until === null));
 } finally {db.close();}
});

test('failed original Top3 calls never trigger replacement requests', async t => {
 const dir = await fixture(t), calls = [];
 const run = await runSimpleRound({cycle: start, dataDir: dir, client: client(start), now: () => start + 10000, call: async (_, input) => {calls.push(input.symbol); throw Error('MOCK_TIMEOUT');}});
 assert.equal(run.status, 'COMPLETE');
 assert.deepEqual(calls, symbols.slice(0, 3));
 assert.equal(run.calls, 3);
 assert.equal(run.results.length, 3);
 assert.ok(run.results.every(x => x.status === 'FAILED'));
 const db = openResearchLedger(dir);
 try {
  assert.equal(db.prepare('SELECT COUNT(*) n FROM requests').get().n, 3);
  assert.ok(db.prepare('SELECT status FROM requests').all().every(x => x.status === 'UNKNOWN'));
 } finally {db.close();}
});
