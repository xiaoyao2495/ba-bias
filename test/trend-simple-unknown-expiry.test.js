import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {openResearchLedger,researchEligibility,reserveResearch,UNKNOWN_PROTECTION_MS} from '../src/trend-simple/research-ledger.js';

test('UNKNOWN expires exactly three hours after reservation without erasing history or budget',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'v1-unknown-expiry-'));
 try {
  const t=Date.parse('2026-01-01T08:00:00Z'),symbol='BTCUSDT';
  let db=openResearchLedger(dir);
  assert.equal(reserveResearch(db,{id:'old',runId:'old',symbol,at:t}).ok,true);
  assert.equal(researchEligibility(db,symbol,t+UNKNOWN_PROTECTION_MS-1).reason,'REQUEST_UNKNOWN');
  db.close();
  db=openResearchLedger(dir);
  assert.equal(researchEligibility(db,symbol,t+UNKNOWN_PROTECTION_MS).ok,true);
  assert.equal(reserveResearch(db,{id:'new',runId:'new',symbol,at:t+UNKNOWN_PROTECTION_MS}).ok,true);
  assert.equal(researchEligibility(db,symbol,t+UNKNOWN_PROTECTION_MS+1).reason,'REQUEST_UNKNOWN');
  assert.deepEqual(db.prepare('SELECT status FROM requests ORDER BY reserved_at').all().map(x=>x.status),['UNKNOWN','UNKNOWN']);
  assert.equal(db.prepare('SELECT count(*) n FROM requests WHERE reserved_at>=? AND reserved_at<?').get(t,t+86400000).n,2);
  db.close();
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
});

test('pending finalization remains blocked and BULL cooldown and daily cap remain effective',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'v1-unknown-guards-'));
 try {
  const t=Date.parse('2026-01-01T08:00:00Z'),db=openResearchLedger(dir);
  reserveResearch(db,{id:'pending',runId:'pending',symbol:'BTCUSDT',at:t});
  db.prepare("UPDATE requests SET status='BULL_PENDING' WHERE id='pending'").run();
  assert.equal(researchEligibility(db,'BTCUSDT',t+UNKNOWN_PROTECTION_MS*2).reason,'REQUEST_UNKNOWN');
  db.prepare("INSERT INTO symbols(symbol,bias,cooldown_until) VALUES('ETHUSDT','BULL',?)").run(t+UNKNOWN_PROTECTION_MS+1);
  assert.equal(researchEligibility(db,'ETHUSDT',t+UNKNOWN_PROTECTION_MS).reason,'BULL_COOLDOWN');
  for(let i=0;i<287;i++)db.prepare("INSERT INTO requests VALUES(?,?,?,?,'FAILED')").run(`p${i}`,`run${i}`,`S${i}USDT`,t);
  assert.equal(reserveResearch(db,{id:'limit',runId:'limit',symbol:'XRPUSDT',at:t+UNKNOWN_PROTECTION_MS}).reason,'DAILY_BUDGET_EXHAUSTED');
  db.close();
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
