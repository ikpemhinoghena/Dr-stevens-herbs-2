// Isolated local test. Never touches the configured Supabase database.
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/etiuz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const{chromium}=require('playwright');
const directory=path.resolve('test-results','isolated-'+Date.now());fs.mkdirSync(directory,{recursive:true});
const base='http://127.0.0.1:4174';
const server=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:'4174',PUBLIC_ORIGIN:base,DATA_BACKEND:'local',DATA_DIR:directory},stdio:'pipe'});let browser;
try{
 for(let n=0;n<30;n++){try{if((await fetch(base+'/api/session')).ok)break}catch{}await new Promise(resolve=>setTimeout(resolve,200))}
 const key=fs.readFileSync(path.join(directory,'setup-key'),'utf8');
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:390,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/admin/#setup='+key);await page.locator('#password').fill('Isolated-QA-only-2841');await page.locator('#login-button').click();await page.locator('#studio').waitFor({state:'visible'});
 await page.locator('[data-view=orders]').click();await page.locator('#manual-order').click();
 for(const [field,value]of Object.entries({name:'Local QA Customer',phone:'+15555550123',email:'local@example.test',country:'Nigeria',state:'Lagos',city:'Lagos',address:'10 Test Street'}))await page.locator('#manual-'+field).fill(value);
 await page.locator('.manual-product').selectOption('life-herbal-plus');await page.locator('#manual-consent').check();await page.locator('#manual-save').click();await page.locator('#order-dialog[open]').waitFor();assert.match(await page.locator('#order-customer').innerText(),/Local QA Customer/);await page.locator('#order-dialog .dialog-close').click();
 await page.locator('[data-view=customers]').click();await page.locator('.customer-profile-open').click();await page.locator('#customer-profile[open]').waitFor();assert.match(await page.locator('#customer-profile').innerText(),/Local QA Customer/);await page.locator('#customer-profile .dialog-close').click();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.locator('.top-logout').click();await page.locator('#auth').waitFor({state:'visible'});assert.equal((await page.request.get(base+'/api/orders')).status(),401);assert.deepEqual(errors,[]);
 console.log('Passed: isolated local setup, manual order entry, customer profile, mobile layout and sign-out access revocation.');
}finally{await browser?.close();server.kill();await new Promise(resolve=>server.once('exit',resolve));assert.ok(directory.startsWith(path.resolve('test-results')+path.sep));fs.rmSync(directory,{recursive:true,force:true});}
