import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
for(const platform of ['posix','windows'])for(const mode of ['direct','import','fork-original','entry-direct','fork-entry','missing-hash','bind-failed','signal-SIGINT','signal-SIGTERM'])test(`Web PM2 isolated ESM ${platform} ${mode}`,()=>{
 const result=JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules','test/web-pm2-fixture.js',mode,platform],{cwd:process.cwd(),timeout:10000,encoding:'utf8',stdio:['ignore','pipe','pipe']}));assert.equal(result.reads,0);assert.equal(result.inspected,0);
});
test('Web PM2 entry explicitly starts once and cannot start Scanner',()=>{const s=fs.readFileSync('src/web/pm2-entry.js','utf8');assert.equal((s.match(/await startWeb\(\)/g)||[]).length,1);assert.ok(!/startScanner|runResearch|setInterval|setTimeout/.test(s));assert.ok(s.includes('process.exit(1)'));});
test('Original web command and direct guard retained',()=>{assert.equal(JSON.parse(fs.readFileSync('package.json')).scripts.web,'node src/web/server.js');assert.ok(fs.readFileSync('src/web/server.js','utf8').includes('import.meta.url===pathToFileURL(process.argv[1]).href'));});
