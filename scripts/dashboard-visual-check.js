// Optional browser acceptance tool: local server and stored records only.
// Install/use Playwright separately; it is not a runtime Dashboard dependency.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createWebServer} from '../src/web/server.js';
import {hashPassword} from '../src/web/security.js';
import {Reader} from '../src/web/reader.js';
import {projectRoot} from '../src/web/config.js';
const moduleName=process.env.BA_WEB_PLAYWRIGHT_MODULE||'playwright';
const {chromium}=await import(path.isAbsolute(moduleName)?pathToFileURL(moduleName).href:moduleName);
const directory=path.join(projectRoot,'validation/BA_BIAS_MOBILE_WEB_DASHBOARD_V1');await fs.mkdir(directory,{recursive:true});
const password='local-visual-only-'+Date.now(),config={host:'127.0.0.1',port:8799,origin:'http://127.0.0.1:8799',passwordHash:await hashPassword(password),secure:false,sessionMs:3600000,staleMs:7200000,dataDir:path.join(projectRoot,'data'),projectRoot};
const reader=new Reader(config.dataDir),{server}=createWebServer(config,{reader,log:()=>{}});await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(config.port,config.host,resolve);});
let browser;const results=[],consoleErrors=[],requests=[];
try{
 browser=await chromium.launch({headless:true,...(process.env.BA_WEB_BROWSER_PATH?{executablePath:process.env.BA_WEB_BROWSER_PATH}:{})});
 const context=await browser.newContext();await context.route('**/*',route=>{requests.push(route.request().url());if(!route.request().url().startsWith(config.origin+'/'))return route.abort();return route.continue();});
 const page=await context.newPage();page.on('pageerror',e=>consoleErrors.push(e.message));await page.goto(config.origin);await page.locator('input[name="password"]').fill(password);await page.getByRole('button',{name:'登录',exact:true}).click();await page.locator('h2',{hasText:'当前运行'}).waitFor();
 const paths=process.env.BA_WEB_VISUAL_QUICK==='1'?['/']:['/','/selector?runId=hourly_20261011_1900','/symbol/LUMIAUSDT?runId=hourly_20261011_1900','/runs','/runs/hourly_20261011_1600','/system'];
 for(const width of (process.env.BA_WEB_VISUAL_QUICK==='1'?[375,390,430,1280]:[320,375,390,430,1280])){
  await page.setViewportSize({width,height:width>=1000?900:844});
  for(let i=0;i<paths.length;i++){
   await page.waitForTimeout(2500); // Respect the same request limit as a normal user.
   await page.goto(config.origin+paths[i]);await page.waitForFunction(()=>!document.querySelector('.skeleton')&&!document.querySelector('.login'));await page.waitForTimeout(150);
   const dimensions=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth,bodyText:document.querySelector('main').textContent}));
   const overflow=dimensions.scrollWidth>dimensions.innerWidth;if(overflow)throw Error(`GLOBAL_OVERFLOW:${width}:${paths[i]}`);
   if(dimensions.bodyText.includes('读取失败'))throw Error(`READ_FAILURE:${paths[i]}:${dimensions.bodyText}`);
   await page.screenshot({path:path.join(directory,`dark-${width}-${i}.png`),fullPage:true});results.push({width,path:paths[i],overflow,screenshot:`dark-${width}-${i}.png`});
  }
 }
 await page.setViewportSize({width:375,height:844});await page.goto(config.origin+'/');await page.locator('h2',{hasText:'当前运行'}).waitFor();await page.locator('#theme').click();await page.screenshot({path:path.join(directory,'light-375.png'),fullPage:true});results.push({width:375,theme:'light',screenshot:'light-375.png'});
 // Expand stored evidence, readable delivery parts and interactive compare controls.
 await page.goto(config.origin+'/symbol/LUMIAUSDT?runId=hourly_20261011_1900');await page.getByText('事实概览',{exact:true}).waitFor();await page.getByText(/^Evidence ·/).click();await page.screenshot({path:path.join(directory,'evidence-375.png'),fullPage:true});
 await page.getByText('完整研究与实际钉钉分片',{exact:true}).click();await page.getByText(/^实际保存分片 1/).click();await page.screenshot({path:path.join(directory,'message-375.png'),fullPage:true});
 const body=await page.locator('main').innerText();if(!body.includes('BEARISH')&&!body.includes('偏空延续'))throw Error('DIRECTION_MISSING');
 if(consoleErrors.length)throw Error('BROWSER_ERRORS:'+consoleErrors.join(';'));
 await fs.writeFile(path.join(directory,process.env.BA_WEB_VISUAL_QUICK==='1'?'visual-final-overview.json':'visual-results.json'),JSON.stringify({results,consoleErrors,externalRequests:requests.filter(x=>!x.startsWith(config.origin+'/')),platform:process.platform,windowsVerified:false},null,2));
 console.log(JSON.stringify({screenshots:results.length+2,consoleErrors:consoleErrors.length,externalRequests:0,windowsVerified:false}));
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
