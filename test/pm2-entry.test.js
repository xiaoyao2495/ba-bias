import test from 'node:test';
import assert from 'node:assert/strict';
import {fork} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
const modes=['direct','import','fork-original','entry-direct','fork-entry','missing-key','missing-webhook','start-failed','signal-SIGINT','signal-SIGTERM'];
for(const platform of ['posix','windows'])for(const mode of modes)test(`PM2 isolated ESM ${platform} ${mode}`,()=>{
 const out=execFileSync(process.execPath,['--experimental-vm-modules','test/pm2-entry-fixture.js',mode,platform],{cwd:process.cwd(),encoding:'utf8',timeout:10000,stdio:['ignore','pipe','pipe']});const result=JSON.parse(out);assert.equal(result.marketCalls,0);assert.equal(result.deliveryCalls,0);assert.equal(result.mockOnly,true);
});
test('PM2 entry calls Scanner exactly once, has no timers or business calls',()=>{const source=fs.readFileSync('src/scan-pm2-entry.js','utf8');assert.equal((source.match(/await startScanner\(\)/g)||[]).length,1);assert.ok(!/runResearch|setInterval|setTimeout|createScanner/.test(source));assert.ok(source.includes('process.exit(1)'));});
test('npm scan and original direct ESM guard remain intact',()=>{const p=JSON.parse(fs.readFileSync('package.json','utf8'));assert.equal(p.scripts.scan,'node src/scan-daemon.js');const s=fs.readFileSync('src/scan-daemon.js','utf8');assert.ok(s.includes('if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)'));});

for(const missing of ['key','webhook'])test(`actual PM2 entry exits 1 with IPC when ${missing} is missing`,async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ba-pm2-no-env-')),entry=path.resolve('src/scan-pm2-entry.js');let child;
 try{const result=await new Promise((resolve,reject)=>{
  child=fork(entry,[],{cwd:dir,silent:true,env:{...process.env,DEEPSEEK_API_KEY:missing==='key'?'':'MOCK_KEY_DO_NOT_LEAK',DINGTALK_WEBHOOK:missing==='webhook'?'':'https://example.invalid/MOCK_WEBHOOK_DO_NOT_LEAK'}});let stdout='',stderr='';child.stdout.on('data',d=>stdout+=d);child.stderr.on('data',d=>stderr+=d);const timeout=setTimeout(()=>{child.kill();reject(Error('INIT_FAILURE_MUST_EXIT'));},10000);child.on('error',e=>{clearTimeout(timeout);reject(e);});child.on('close',(code,signal)=>{clearTimeout(timeout);resolve({code,signal,stdout,stderr});});
 });assert.equal(result.code,1);assert.equal(result.stdout,'');assert.ok(result.stderr.includes('MISSING_SCANNER_ENVIRONMENT'));assert.ok(!result.stderr.includes('MOCK_KEY_DO_NOT_LEAK'));assert.ok(!result.stderr.includes('MOCK_WEBHOOK_DO_NOT_LEAK'));assert.ok(!fs.existsSync(path.join(dir,'data')));
 }finally{if(child&&child.exitCode===null)child.kill();fs.rmSync(dir,{recursive:true,force:true});}
});
