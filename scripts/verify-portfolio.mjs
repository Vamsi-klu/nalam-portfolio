import { chromium } from 'playwright';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import sharp from 'sharp';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
fs.mkdirSync('output/playwright', { recursive: true });
const url = process.env.AUDIT_URL || 'http://localhost:3000';
const label = (process.env.AUDIT_LABEL || 'native-4k-local').replace(/[^a-zA-Z0-9_-]/g, '-');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage(); const errors=[],failed=[],consoleErrors=[];
 page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400 && !r.url().includes('/_vercel/insights/')) failed.push({url:r.url(),status:r.status()});});
 const response=await page.goto(url,{waitUntil:'networkidle'}); assert.equal(response.status(),200);
 await page.getByRole('heading',{level:1}).waitFor();
 assert.match(await page.title(),/Ramachandra Nalam/);
 const base=page.url().split('?')[0].split('#')[0];
 const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
 const masters=[];
 for (const [file,width,height] of [
   ['signal-sculpture-4k.webp',3840,2160],
   ['signal-sculpture-mobile-4k.webp',3072,3840],
   ['event-stream-4k.webp',3840,2160],
   ['warehouse-strata-4k.webp',3840,2160],
 ]) {
   const asset=await context.request.get(new URL(file,base).href);
   assert.equal(asset.status(),200,file+' source response');
   const body=await asset.body();
   const metadata=await sharp(body).metadata();
   assert.equal(metadata.width,width,file+' native width');
   assert.equal(metadata.height,height,file+' native height');
   assert.equal(metadata.format,'webp');
   const sha256=hash(body);
   assert.equal(sha256,hash(fs.readFileSync('public/'+file)),file+' committed source matches deployment');
   masters.push({file,width,height,bytes:body.length,sha256});
 }
 const lightingFile='signal-environment.bin.gz';
 const lightingResponse=await context.request.get(new URL(lightingFile,base).href);
 assert.equal(lightingResponse.status(),200,'Studio lighting source response');
 const lightingBody=await lightingResponse.body();
 const lightingSha256=hash(lightingBody);
 assert.equal(lightingSha256,hash(fs.readFileSync('public/'+lightingFile)),'Committed studio lighting matches deployment');
 const lightingRaw=gunzipSync(lightingBody,{maxOutputLength:6_291_472});
 assert.equal(lightingRaw.length,6_291_472,'Studio lighting header and RGBA half-float payload length');
 assert.equal(lightingRaw.toString('ascii',0,4),'SIGE','Studio lighting format marker');
 assert.equal(lightingRaw.readUInt32LE(4),1,'Studio lighting format version');
 assert.equal(lightingRaw.readUInt32LE(8),768,'Studio lighting atlas width');
 assert.equal(lightingRaw.readUInt32LE(12),1024,'Studio lighting atlas height');
 let nonzeroSamples=0;
 for(let offset=16;offset<lightingRaw.length;offset+=2) {
   const sample=lightingRaw.readUInt16LE(offset);
   if((sample & 0x7c00)===0x7c00) assert.fail('Studio lighting sample must be finite at byte '+offset);
   if(sample & 0x7fff) nonzeroSamples++;
 }
 assert(nonzeroSamples>0,'Studio lighting must contain nonzero samples');
 const environment={file:lightingFile,bytes:lightingBody.length,sha256:lightingSha256,decodedBytes:lightingRaw.length,decodedSha256:hash(lightingRaw),version:1,width:768,height:1024,nonzeroSamples};
 const heroImage=page.locator('.hero-artwork img');
 await heroImage.waitFor();
 assert.equal(await heroImage.evaluate(el=>el.complete && el.naturalWidth>0),true);
 assert.equal(await heroImage.getAttribute('loading'),'eager');
 assert.equal(await heroImage.getAttribute('fetchpriority'),'high');
 assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://nalam-portfolio.vercel.app');
 const imageChecks=[];
 assert.match(await heroImage.evaluate(el=>el.currentSrc),/signal-sculpture-4k/);
 for(const [id,file]of[['streaming-analytics','event-stream-4k.webp'],['aws-data-platform','warehouse-strata-4k.webp']]){
  const img=page.locator('.work-story-'+id+' img');await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
  const data=await img.evaluate(el=>({src:new URL(el.currentSrc).searchParams.get('url'),complete:el.complete,width:el.naturalWidth,height:el.naturalHeight}));
  assert.equal(await img.evaluate(el=>new URL(el.currentSrc).searchParams.get('q')),'95');assert.equal(data.src,'/'+file);assert(data.complete&&data.width>0);imageChecks.push({id,...data});
 }
 const anchors=[];
 for(const id of ['work','oss','builds','about','experience','contact']) {
   await page.locator('.main-nav a[href="#'+id+'"]').click();
   await page.waitForTimeout(1050);
   const top=await page.locator('#'+id).evaluate(el=>el.getBoundingClientRect().top);
   assert(top>=70 && top<150, id+' anchor top '+top); anchors.push(id);
 }
 await page.getByRole('tab').first().focus();
 await page.keyboard.press('ArrowDown');
 assert.equal(await page.getByRole('tab').nth(1).getAttribute('aria-selected'),'true');
 assert.equal(await page.getByRole('tabpanel').count(),1);
 await page.keyboard.press('End');
 assert.equal(await page.getByRole('tab').nth(2).getAttribute('aria-selected'),'true');
 await page.keyboard.press('Home');
 assert.equal(await page.getByRole('tab').first().getAttribute('aria-selected'),'true');
 await page.getByRole('button',{name:'Copy email'}).click();
 await page.getByRole('button',{name:'Email copied'}).waitFor();
 assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'nrcvamsi@gmail.com');
 assert.equal(await page.locator('a[href="mailto:nrcvamsi@gmail.com"]').count(),1);
 await page.locator('#builds').scrollIntoViewIfNeeded();
 const gallery=page.locator('.project-gallery-track');
 const initialScroll=await gallery.evaluate(el=>el.scrollLeft);
 await page.getByRole('button',{name:'Next projects'}).click();
 await page.waitForTimeout(600);
 assert((await gallery.evaluate(el=>el.scrollLeft))>initialScroll,'Gallery next button');
 await page.getByRole('button',{name:'Previous projects'}).click();
 await page.waitForTimeout(600);
 assert((await gallery.evaluate(el=>el.scrollLeft))<=initialScroll+1,'Gallery previous button');
 const external=await page.locator('a[href^="https://"]').evaluateAll(els=>els.map(el=>({href:el.href,target:el.target,rel:el.rel})));
 assert(external.every(el=>el.target==='_blank' && el.rel.includes('noopener')));
 assert(!external.some(el=>/jobkanban|prompt-optimizer/.test(el.href)));
 const widths=[];
 for(const width of [320,390,768,1024,1440]) {
   await page.setViewportSize({width,height:900});
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.waitForTimeout(250);
   await heroImage.evaluate(el=>el.decode());
   assert.equal(await heroImage.evaluate(el=>new URL(el.currentSrc).searchParams.get('q')),'95');assert.match(await heroImage.evaluate(el=>el.currentSrc),width<=800?/signal-sculpture-mobile-4k/:/signal-sculpture-4k/);
   const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
   assert(scrollWidth<=width,width+' overflow '+scrollWidth); widths.push({width,scrollWidth});
 }
 await page.screenshot({path:'output/playwright/'+label+'-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 const trigger=page.getByRole('button',{name:'Open navigation'});
 await trigger.click();
 assert.equal(await page.locator('dialog').evaluate(el=>el.open),true);
 await page.keyboard.press('Escape');
 await page.waitForFunction(()=>document.body.style.overflow!=='hidden');
 assert.equal(await trigger.evaluate(el=>el===document.activeElement),true);
 assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
 await trigger.click();
 await page.getByRole('dialog').getByRole('link',{name:'builds',exact:true}).click();
 await page.waitForTimeout(1050);
 assert.equal(await page.locator('dialog').evaluate(el=>el.open),false);
 assert.equal(new URL(page.url()).hash,'#builds');
 const top=await page.locator('#builds').evaluate(el=>el.getBoundingClientRect().top);
 assert(top>=70 && top<150,'mobile anchor '+top);
 assert.equal(await page.locator('#builds h2').evaluate(el=>el===document.activeElement),true);
 await page.keyboard.press('Tab');
 assert.equal(await page.evaluate(()=>!!document.activeElement.closest('#builds')),true);
 await trigger.click();
 await page.setViewportSize({width:1024,height:900});
 await page.waitForTimeout(100);
 assert.equal(await page.locator('dialog').evaluate(el=>el.open),false);
 assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForTimeout(200);
 assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
 assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running' && a.effect.getTiming().iterations===Infinity).length),0);
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'output/playwright/'+label+'-mobile.png'});
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000},storageState:await context.storageState()});
 const plain=await nojs.newPage(); await plain.goto(base);
 assert.equal(await plain.getByRole('heading',{level:1}).isVisible(),true);
 assert.equal(await plain.locator('#work h2').isVisible(),true);
 assert.equal(await plain.locator('#contact h2').isVisible(),true);
 const cold=await browser.newContext({reducedMotion:'reduce',storageState:await context.storageState()});
 const coldPage=await cold.newPage(); const hydrationErrors=[];
 coldPage.on('pageerror',e=>hydrationErrors.push(e.message));
 coldPage.on('console',m=>{if(m.type()==='error' && /hydration|hydrated|server rendered|Minified React/.test(m.text()))hydrationErrors.push(m.text());});
 await coldPage.goto(base,{waitUntil:'networkidle'});
 assert.equal(await coldPage.getByRole('heading',{level:1}).isVisible(),true);
 assert.equal(await coldPage.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
 assert.equal(hydrationErrors.length,0,JSON.stringify(hydrationErrors));
 assert.equal(errors.length,0,JSON.stringify(errors)); assert.equal(failed.length,0,JSON.stringify(failed));
 if(base.startsWith('https:'))assert.equal(consoleErrors.length,0,JSON.stringify(consoleErrors));
 const report={base,masters,environment,imageChecks,anchors,widths,externalLinks:external.length,heroImage:true,keyboardTabs:true,clipboard:true,mobileMenu:true,reducedMotion:true,coldReducedMotion:true,noJsContent:true,errors,failed,consoleErrors};
 fs.writeFileSync('output/playwright/'+label+'-audit.json',JSON.stringify(report,null,2)); console.log(JSON.stringify(report,null,2));
 await browser.close();
})().catch(e=>{console.error(String(e.stack || e).replace(/([?&]_vercel_share=)[^&\s]+/g, '$1[redacted]'));process.exit(1)});
