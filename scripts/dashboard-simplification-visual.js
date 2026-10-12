// Isolated local browser acceptance; never starts Scanner or loads business credentials.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {createWebServer} from '../src/web/server.js';
import {hashPassword} from '../src/web/security.js';
import {Reader} from '../src/web/reader.js';
import {projectRoot} from '../src/web/config.js';
const moduleName=process.env.BA_WEB_PLAYWRIGHT_MODULE||'playwright';
const {chromium}=await import(path.isAbsolute(moduleName)?pathToFileURL(moduleName).href:moduleName);
const dir=path.join(projectRoot,'validation/BA_BIAS_DASHBOARD_SIMPLIFICATION_V1');
await fs.mkdir(dir,{recursive:true});
const password='isolated-local-visual-password',config={host:'127.0.0.1',port:8798,origin:'http://127.0.0.1:8798',passwordHash:await hashPassword(password),secure:false,sessionMs:3600000,staleMs:7200000,dataDir:path.join(projectRoot,'data'),projectRoot};
const reader=new Reader(config.dataDir),{server}=createWebServer(config,{reader,processProbe:async()=>({state:'STOPPED',instances:0,basis:'isolated visual probe; no scanner start'}),log:()=>{}});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(config.port,config.host,resolve);});
const results=[],errors=[],external=[];let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.BA_WEB_BROWSER_PATH?{executablePath:process.env.BA_WEB_BROWSER_PATH}:{})});
 const context=await browser.newContext();await context.route('**/*',route=>{if(!route.request().url().startsWith(config.origin+'/')){external.push(route.request().url());return route.abort();}return route.continue();});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(config.origin);await page.locator('input[name=password]').fill(password);await page.getByRole('button',{name:'登录',exact:true}).click();await page.getByRole('heading',{name:'观察',exact:true}).waitFor();
 const paths=['/','/selector?runId=hourly_20261011_1900','/history?mode=symbol&symbol=LUMIAUSDT','/history?mode=runs','/symbol/LUMIAUSDT?runId=hourly_20261011_1900','/runs/hourly_20261011_1900','/system'];
 for(const width of [320,375,390,430,1280]){await page.setViewportSize({width,height:width>1000?900:844});for(let i=0;i<paths.length;i++){
  await page.waitForTimeout(2200);await page.goto(config.origin+paths[i]);await page.waitForFunction(()=>!document.querySelector('.skeleton')&&!document.querySelector('.login'));await page.waitForTimeout(150);
  const d=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,text:document.querySelector('main').textContent,nav:document.querySelectorAll('nav a').length,padding:parseFloat(getComputedStyle(document.querySelector('main')).paddingBottom),navHeight:document.querySelector('nav').getBoundingClientRect().height}));
  assert.ok(d.scrollWidth<=d.width,`overflow ${width} ${paths[i]}`);assert.equal(d.nav,3);assert.ok(d.padding>=d.navHeight);assert.ok(!d.text.includes('读取失败'),d.text);
  const screenshot=`dark-${width}-${i}.png`;await page.screenshot({path:path.join(dir,screenshot),fullPage:true});results.push({width,path:paths[i],overflow:false,bottomClear:true,screenshot});
 }}
 await page.setViewportSize({width:375,height:844});
 await page.waitForTimeout(2200);await page.goto(config.origin+'/selector?runId=hourly_20261011_1900');await page.getByText('评分、实质更新与证据',{exact:true}).first().click();await page.screenshot({path:path.join(dir,'selector-expanded.png'),fullPage:true});assert.ok((await page.locator('main').innerText()).includes('Reason code'));
 await page.waitForTimeout(2200);await page.goto(config.origin+'/history?mode=symbol&symbol=LUMIAUSDT');await page.getByRole('heading',{name:'历史',exact:true}).waitFor();const history=await page.locator('main').innerText();assert.ok(history.includes('BULLISH → BEARISH'));assert.ok(history.includes('MATERIAL_UPDATE'));
 // Bottom navigation remembers Symbol query and browser Back preserves route.
 await page.locator('nav a[href="/selector"]').click();await page.waitForTimeout(2200);await page.locator('nav a[href="/history"]').click();await page.waitForTimeout(2200);assert.ok(page.url().includes('symbol=LUMIAUSDT'));await page.goBack();await page.waitForTimeout(2200);assert.ok(page.url().includes('/selector'));
 // A failed refresh retains last successfully loaded facts.
 await page.goto(config.origin+'/');await page.getByRole('heading',{name:'观察',exact:true}).waitFor();const original=await page.locator('main').innerText();await page.route('**/api/**',route=>route.abort());await page.locator('#refresh').click();await page.waitForTimeout(600);assert.equal(await page.locator('main').innerText(),original);assert.ok((await page.locator('#notice').innerText()).includes('数据已过期'));await page.unroute('**/api/**');
 // Expand detail Evidence without erasing original research capabilities.
 await page.waitForTimeout(2200);await page.goto(config.origin+'/symbol/LUMIAUSDT?runId=hourly_20261011_1900');await page.getByText(/^Evidence ·/).click();await page.screenshot({path:path.join(dir,'evidence-expanded.png'),fullPage:true});await page.getByText('完整研究与实际钉钉分片',{exact:true}).click();await page.screenshot({path:path.join(dir,'research-expanded.png'),fullPage:true});
 assert.equal(errors.length,0);assert.equal(external.length,0);
 await fs.writeFile(path.join(dir,'visual-results.json'),JSON.stringify({results,errors,externalRequests:external,checks:{historyEvolution:true,filterPersistence:true,browserBack:true,failedRefreshRetainsFacts:true,evidenceExpansion:true},browser:'macOS Chrome (not actual iPhone Safari)',windowsVerified:false},null,2)+'\n');console.log(JSON.stringify({screenshots:results.length+3,errors,externalRequests:external.length}));
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
