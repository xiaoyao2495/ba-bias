// Local anonymous browser acceptance only. Explicit real-record reads, no business calls.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {createWebServer} from '../src/web/server.js';
import {hashPassword} from '../src/web/security.js';
import {Reader} from '../src/web/reader.js';
import {webConfig,loadWebEnvironment,projectRoot} from '../src/web/config.js';
const moduleName=process.env.BA_WEB_PLAYWRIGHT_MODULE||'playwright';
const {chromium,webkit}=await import(path.isAbsolute(moduleName)?pathToFileURL(moduleName).href:moduleName);
loadWebEnvironment();
const dir=path.join(projectRoot,'validation/BA_BIAS_PUBLIC_READONLY_WEB_V1');await fs.mkdir(dir,{recursive:true});
const config=webConfig({BA_BIAS_WEB_PUBLIC_READONLY:'1',BA_BIAS_WEB_HOST:'127.0.0.1',BA_BIAS_WEB_PORT:'8796',BA_BIAS_WEB_ORIGIN:'http://127.0.0.1:8796'});
const secrets=Object.entries(process.env).filter(([k])=>/KEY|TOKEN|PASSWORD|WEBHOOK|SECRET/i.test(k)).map(([,v])=>v);
let fakeClock=Date.now(),processCalls=0;const reader=new Reader(path.join(projectRoot,'data'),{secrets,maxEntries:100,maxFileBytes:2*1024*1024,maxHistoryBytes:16*1024*1024}),{server}=createWebServer(config,{reader,now:()=>{fakeClock+=61000;return fakeClock;},processProbe:async()=>{processCalls++;throw Error('PUBLIC_MUST_NOT_INSPECT');},log:()=>{}});
await new Promise((r,j)=>{server.once('error',j);server.listen(config.port,config.host,r);});
let browser,rollbackServer;const errors=[],requests=[],screenshots=[],checks=[];let webkitStatus;
try{
 browser=await chromium.launch({headless:true,...(process.env.BA_WEB_BROWSER_PATH?{executablePath:process.env.BA_WEB_BROWSER_PATH}:{})});
 const context=await browser.newContext();await context.route('**/*',route=>{const r=route.request();requests.push({url:r.url(),method:r.method(),cookie:!!r.headers().cookie});if(!r.url().startsWith(config.origin+'/'))return route.abort();return route.continue();});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const paths=['/','/selector?runId=hourly_20261011_1900','/history?mode=symbol&symbol=LUMIAUSDT','/history?mode=runs','/symbol/LUMIAUSDT?runId=hourly_20261011_1900','/runs/hourly_20261011_1900'];
 for(const width of [320,375,390,430,1280]){await page.setViewportSize({width,height:width>1000?900:844});for(let i=0;i<paths.length;i++){
  await page.goto(config.origin+paths[i]);await page.waitForFunction(()=>!document.querySelector('.skeleton')&&!document.querySelector('.login'));await page.waitForTimeout(80);
  const d=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,text:document.querySelector('main').textContent,nav:document.querySelectorAll('nav a').length,statusHidden:document.querySelector('#system-status').hidden,logoutHidden:document.querySelector('#logout').hidden}));
  assert.ok(d.scrollWidth<=d.width,`overflow ${width} ${paths[i]}`);assert.equal(d.nav,3);assert.ok(d.statusHidden&&d.logoutHidden);assert.ok(!d.text.includes('读取失败'),d.text);assert.ok(!d.text.includes('DeliveryId')&&!d.text.includes('真实请求与Token'));
  const screenshot=`public-${width}-${i}.png`;await page.screenshot({path:path.join(dir,screenshot),fullPage:true});screenshots.push({width,path:paths[i],screenshot,overflow:false});
 }}
 await page.setViewportSize({width:390,height:844});await page.goto(config.origin+'/symbol/LUMIAUSDT?runId=hourly_20261011_1900');await page.getByText(/^Evidence ·/).click();await page.screenshot({path:path.join(dir,'public-evidence-390.png'),fullPage:true});checks.push('Evidence expands');
 await page.reload();await page.waitForFunction(()=>!document.querySelector('.skeleton'));assert.equal(await page.locator('.login').count(),0);checks.push('reload remains anonymous');
 await page.goto(config.origin+'/history?mode=symbol&symbol=LUMIAUSDT');await page.getByRole('heading',{name:'历史',exact:true}).waitFor();await page.locator('nav a[href="/selector"]').click();await page.getByRole('heading',{name:'研究优先级'}).waitFor();await page.goBack();await page.getByRole('heading',{name:'历史',exact:true}).waitFor();assert.ok(page.url().includes('symbol=LUMIAUSDT'));checks.push('browser Back preserves Symbol query');
 await page.goto(config.origin+'/');await page.getByRole('heading',{name:'观察',exact:true}).waitFor();const original=await page.locator('main').innerText();await page.route('**/api/**',r=>r.abort());await page.locator('#refresh').click();await page.waitForTimeout(200);assert.equal(await page.locator('main').innerText(),original);assert.ok((await page.locator('#notice').innerText()).includes('数据已过期'));await page.unroute('**/api/**');await page.locator('#refresh').click();await page.waitForFunction(()=>document.querySelector('#notice').hidden);checks.push('offline retains facts and reconnect recovers');
 const n=requests.length;await page.waitForTimeout(31000);assert.ok(requests.length>n);assert.equal(await page.locator('.login').count(),0);checks.push('30-second anonymous polling');
 for(const p of ['/api/system','/api/health','/api/session','/system','/.env','/api/outbox'])assert.equal((await context.request.get(config.origin+p)).status(),403);
 assert.equal((await context.cookies()).length,0);assert.equal(processCalls,0);assert.equal(errors.length,0);assert.ok(requests.every(r=>r.url.startsWith(config.origin+'/')));assert.ok(requests.filter(r=>r.url.includes('/api/')).every(r=>!r.cookie));assert.ok(!requests.some(r=>/\/api\/(?:session|health|system|login|logout)/.test(r.url)));
 try{const safari=await webkit.launch({headless:true});try{const c=await safari.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await c.newPage();await p.goto(config.origin);await p.getByRole('heading',{name:'观察',exact:true}).waitFor();await p.screenshot({path:path.join(dir,'public-webkit-390.png'),fullPage:true});webkitStatus='WEBKIT_EMULATION_PASS_NOT_ACTUAL_IPHONE';}finally{await safari.close();}}catch{webkitStatus='WEBKIT_RUNTIME_UNAVAILABLE_ACTUAL_IPHONE_UNVERIFIED';}
 // Simulate a service restart back to the original private mode; no configuration files written.
 await context.close();await new Promise(r=>server.close(r));
 const rollbackPassword='ISOLATED_PRIVATE_ROLLBACK_ONLY';const privateConfig=webConfig({BA_BIAS_WEB_PASSWORD_HASH:await hashPassword(rollbackPassword),BA_BIAS_WEB_PORT:'8796',BA_BIAS_WEB_ORIGIN:config.origin,BA_BIAS_WEB_PUBLIC_READONLY:'0'});
 rollbackServer=createWebServer(privateConfig,{reader,processProbe:async()=>({state:'STOPPED',instances:0,basis:'isolated rollback observation'}),log:()=>{}}).server;await new Promise((r,j)=>{rollbackServer.once('error',j);rollbackServer.listen(config.port,config.host,r);});
 const privateContext=await browser.newContext({viewport:{width:390,height:844}});await privateContext.route('**/*',r=>r.request().url().startsWith(config.origin+'/')?r.continue():r.abort());const privatePage=await privateContext.newPage();privatePage.on('pageerror',e=>errors.push(e.message));await privatePage.goto(config.origin);await privatePage.locator('input[name=password]').fill(rollbackPassword);await privatePage.getByRole('button',{name:'登录',exact:true}).click();await privatePage.getByRole('heading',{name:'观察',exact:true}).waitFor();assert.equal(await privatePage.locator('#system-status').isVisible(),true);assert.equal(await privatePage.locator('#logout').isVisible(),true);await privatePage.reload();await privatePage.getByRole('heading',{name:'观察',exact:true}).waitFor();assert.equal(await privatePage.locator('.login').count(),0);await privatePage.locator('#logout').click();await privatePage.locator('input[name=password]').waitFor();checks.push('rollback to private: login, Session refresh, diagnostics and logout');await privateContext.close();await new Promise(r=>rollbackServer.close(r));rollbackServer=null;assert.equal(errors.length,0);
 await fs.writeFile(path.join(dir,'visual-results.json'),JSON.stringify({screenshots,checks,errors,externalRequests:requests.filter(r=>!r.url.startsWith(config.origin+'/')),publicApiCookies:requests.filter(r=>r.url.includes('/api/')&&r.cookie).length,processCalls,webkitStatus,windowsVerified:false,mode:'PUBLIC_READONLY',readSource:'existing local records; no history generation',testClock:'security clock advances per request to isolate visual QA from rate test; facts timestamps unchanged'},null,2)+'\n');console.log(JSON.stringify({screenshots:screenshots.length+1,checks,errors,processCalls,webkitStatus}));
}finally{await browser?.close();if(rollbackServer)await new Promise(r=>rollbackServer.close(r));await new Promise(r=>server.close(r));}
