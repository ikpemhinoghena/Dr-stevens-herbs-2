import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {cloudRequest} from './cloud.mjs';
const require=createRequire('C:/Users/etiuz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const base='http://127.0.0.1:4173';
const credentials=fs.readFileSync('storage/admin-login.txt','utf8');
const email=credentials.match(/Email: (.+)/)[1],password=credentials.match(/Password: (.+)/)[1];
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1050}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const name='QA catalogue check '+Date.now(),id=name.toLowerCase().replaceAll(' ','-');
let orderId,photo;
fs.mkdirSync('test-results',{recursive:true});
try{
 assert.equal((await page.request.get(base+'/api/orders')).status(),401);
 await page.goto(base+'/admin/');await page.locator('#email').fill(email);await page.locator('#password').fill(password);await page.locator('#login-button').click();await page.locator('#studio').waitFor({state:'visible'});await page.locator('#dashboard-metrics .metric').first().waitFor();
 assert.equal(await page.locator('#connection-label').innerText(),'Supabase connected');
 await page.locator('[data-view=collection]').click();await page.locator('#new-product').click();
 await page.locator('#name').fill(name);await page.locator('#type').selectOption('Tea');await page.locator('#category').selectOption('Botanical Infusion');await page.locator('#desc').fill('A test description <script>window.bad=true</script>');
 await page.locator('#save').click();await page.waitForFunction(()=>document.querySelector('#save-state').textContent.startsWith('Saved'));const draftState=await (await page.request.get(base+'/api/session')).json();const draftProduct=(await (await page.request.get(base+'/api/products')).json()).find(p=>p.id===id);const incomplete=await page.request.put(base+'/api/products/'+id,{headers:{Origin:base,'x-csrf-token':draftState.csrf},data:{...draftProduct,status:'published'}});assert.equal(incomplete.status(),400);assert.match((await incomplete.json()).error,/Before publishing/);const invalidCategory=await page.request.put(base+'/api/products/'+id,{headers:{Origin:base,'x-csrf-token':draftState.csrf},data:{...draftProduct,category:'Unapproved category'}});assert.equal(invalidCategory.status(),400);
 assert.equal((await page.request.get(base+'/herbs/'+id+'/')).status(),404);
 await page.locator('#photos').setInputFiles('dist/assets/life-herbal-plus.jpeg');await page.waitForFunction(()=>document.querySelector('#upload-status').textContent.includes('uploaded.'));
 photo=await page.locator('#photo-grid img').getAttribute('src');
 await page.locator('#imageAlt').fill('QA bottle photo');for(const [field,value]of Object.entries({weight:'100g',ingredientsInfo:'QA ingredient label text',allergens:'QA allergen label information',usage:'QA preparation label text',suitability:'QA intended-user label information',warnings:'Test warning',storageInstructions:'QA storage label information'}))await page.locator('#'+field).fill(value);await page.locator('#status').selectOption('published');await page.locator('#save').click();await page.waitForFunction(()=>document.querySelector('#save').textContent.includes('Save product'));
 const storefront=await browser.newPage();storefront.on('pageerror',e=>errors.push(e.message));await storefront.goto(base+'/shop/');await storefront.locator('#category').selectOption('Botanical Infusion');await storefront.locator('#search').fill(name);assert.equal(await storefront.locator('#catalogue .product-card:visible').count(),1);assert.match(await storefront.locator('#catalogue .product-card:visible').innerText(),new RegExp(name));await storefront.goto(base+'/herbs/'+id+'/');assert.match(await storefront.locator('main').innerText(),/<script>/);assert.equal(await storefront.evaluate(()=>window.bad),undefined);assert.match(await storefront.locator('main').innerText(),/Test warning/);
 await storefront.locator('.button-row [data-add="'+id+'"]').click();await storefront.goto(base+'/checkout/');
 for(const [field,value]of Object.entries({name:'QA Test Customer',phone:'+15555550123',email:'qa@example.test',state:'Test region',city:'Test city',address:'10 Test Street'}))await storefront.locator('#customer-'+field).fill(value);
 await storefront.locator('#customer-country').selectOption('Nigeria');await storefront.locator('#checkout-consent').check();await storefront.locator('.review-button').click();await storefront.locator('#checkout-send').click();await storefront.locator('dialog[open]').waitFor();
 const handoff=await storefront.locator('#handoff-note').innerText();orderId=handoff.match(/DS-[A-Z0-9-]+/)[0];
 const state=await (await page.request.get(base+'/api/session')).json();
 const denied=await page.request.put(base+'/api/orders/'+orderId,{headers:{Origin:base},data:{}});assert.equal(denied.status(),403);
 await storefront.locator('.contact-close').click();await storefront.close();
 await page.locator('#back').click();await page.locator('[data-view=orders]').click();await page.locator('#orders [data-order="'+orderId+'"]').waitFor({state:'visible',timeout:2000}).catch(async()=>{await page.locator('[data-view=overview]').click();await page.locator('#refresh-dashboard').click();await page.locator('[data-view=orders]').click()});
 await page.locator('#orders [data-order="'+orderId+'"]').click();await page.locator('#order-status').selectOption('in_transit');await page.locator('#order-carrier').fill('Test courier');await page.locator('#order-tracking').fill('QA123');await page.locator('#save-order').click();await page.waitForFunction(()=>document.querySelector('#customer-message').value.includes('in transit'));
 assert.match(await page.locator('#update-whatsapp').getAttribute('href'),/15555550123/);assert.match(decodeURIComponent(await page.locator('#update-email').getAttribute('href')),/QA123/);
 const orderList=await (await page.request.get(base+'/api/orders')).json();const saved=orderList.find(o=>o.id===orderId);assert.equal(saved.status,'in_transit');assert.equal(saved.history.length,2);
 const stale=await page.request.put(base+'/api/orders/'+orderId,{headers:{Origin:base,'x-csrf-token':state.csrf},data:{...saved,revision:1}});assert.equal(stale.status(),409);
 await page.locator('#order-dialog .dialog-close').click();await page.locator('[data-view=customers]').click();assert.match(await page.locator('#customers-body').innerText(),/QA Test Customer/);
 await page.locator('[data-view=inventory]').click();assert.match(await page.locator('#inventory-body').innerText(),new RegExp(name));await page.locator('[data-view=analytics]').click();assert.match(await page.locator('#analytics-total').innerText(),/enquiries/);await page.locator('[data-view=activity]').click();assert.match(await page.locator('#workspace-activity').innerText(),/Status:/);await page.locator('[data-view=settings]').click();assert.match(await page.locator('#settings-backend').innerText(),/Supabase/);
 await page.locator('#command-open').click();await page.locator('#command-input').fill(name);assert.match(await page.locator('#command-results').innerText(),new RegExp(name));await page.locator('#command-dialog button[aria-label]').click();const latest=(await (await page.request.get(base+'/api/products')).json()).find(p=>p.id===id);const archived=await page.request.put(base+'/api/products/'+id,{headers:{Origin:base,'x-csrf-token':state.csrf},data:{...latest,status:'archived'}});assert.equal(archived.status(),200);for(const suffix of ['/','/index.html','//index.html'])assert.equal((await page.request.get(base+'/herbs/'+id+suffix)).status(),404);assert.deepEqual(errors,[]);
 console.log('Passed: real Supabase login, product draft/publish, photo upload, HTML escaping, checkout enquiry capture, order status/history, customer directory, WhatsApp/email composition, unauthorized access, CSRF and stale-update protection.');
}catch(error){console.error("Workflow failure:",error.message);throw error;}finally{
 if(orderId)await cloudRequest('/rest/v1/orders?id=eq.'+orderId,{method:'DELETE'});
 await cloudRequest('/rest/v1/products?id=eq.'+id,{method:'DELETE'});
 if(photo){const file=photo.split('/').pop();await cloudRequest('/storage/v1/object/product-images',{method:'DELETE',body:JSON.stringify({prefixes:[file]})})}
 await page.request.get(base+'/api/products');
 await page.goto(base+'/admin/');await page.locator('#studio').waitFor({state:'visible'});await page.locator('#dashboard-metrics .metric').first().waitFor();await page.screenshot({path:'test-results/admin-desktop.png',fullPage:true});
 for(const width of [390,320]){await page.setViewportSize({width,height:900});console.log('Viewport',width,'overflow',await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);for(const view of ['collection','orders','customers','inventory','analytics','activity','settings']){await page.locator('[data-view='+view+']').click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,view+' overflow at '+width)}await page.locator('[data-view=overview]').click();if(width===390)await page.screenshot({path:'test-results/admin-mobile.png',fullPage:true})}
 await browser.close();
}
