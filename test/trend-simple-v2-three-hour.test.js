import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initializeLiveLedger, openLiveLedger, reserveLive } from '../src/trend-simple-v2/live-ledger.js';

test('LIVE reservations enforce three hours and preserve existing expiry', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'v2-cooldown-'));
  let db;
  try {
    const file = path.join(dir, 'ledger.sqlite');
    initializeLiveLedger(file);
    db = openLiveLedger(file);
    const base = { symbol: 'BTCUSDT', tokenUnits: 1, dailyRequests: 30, dailyTokenUnits: 30 };
    const reserve = (id, at) => reserveLive(db, { ...base, requestId: id, researchId: id, reservedAt: at });
    const start = 1000;
    assert.equal(reserve('a', start).cooldownUntil, start + 3 * 3600000);
    assert.equal(reserve('b', start + 3 * 3600000 - 1).reason, 'COOLDOWN');
    assert.equal(reserve('c', start + 3 * 3600000).ok, true);
    db.prepare('UPDATE reservations SET cooldown_until=? WHERE request_id=?').run(start + 7 * 3600000, 'c');
    assert.equal(reserve('d', start + 6 * 3600000).reason, 'COOLDOWN');
    assert.equal(reserve('e', start + 7 * 3600000).ok, true);
  } finally {
    db?.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
