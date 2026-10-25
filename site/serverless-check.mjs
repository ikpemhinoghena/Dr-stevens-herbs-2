// Two independent function-like processes must share auth state without a local database.
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const credentials=fs.readFileSync('storage/admin-login.txt','utf8');
const email=credentials.match(/Email: (.+)/)[1],password=credentials.match(/Password: (.+)/)[1];
const first='http://127.0.0.1:4175',second='http://127.0.0.1:4176';
const directories=[1,2].map(n=>path.resolve('test-results','function-'+Date.now()+'-'+n));
const code="import http from 'node:http';const {default:handler}=await import('./api/index.mjs');const {db}=await import('./store.mjs');if(db!==null)throw Error('Cloud mode must not open SQLite');http.createServer(handler).listen(Number(process.env.PORT),'127.0.0.1');";
const children=[4175,4176].map((port,i)=>spawn(process.execPath,['--input-type=module','-e',code],{env:{...process.env,VERCEL:'1',NODE_ENV:'test',PORT:String(port),PUBLIC_ORIGIN:first,DATA_BACKEND:'supabase',DATA_DIR:directories[i]},stdio:'pipe'}));
const headers={Origin:first,'Content-Type':'application/json'};let cookie,csrf;
try{
 for(const base of [first,second]){let ready=false;for(let n=0;n<50;n++){try{if((await fetch(base+'/api/session')).ok){ready=true;break}}catch{}await new Promise(resolve=>setTimeout(resolve,200))}assert.ok(ready,'Function process did not start');}
 const login=await fetch(first+'/api/login',{method:'POST',headers,body:JSON.stringify({email,password})});assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];csrf=(await login.json()).csrf;
 const session=await (await fetch(second+'/api/session',{headers:{Cookie:cookie}})).json();assert.equal(session.authenticated,true);assert.equal(session.csrf,csrf);
 const preferences=await fetch(second+'/api/preferences',{headers:{Cookie:cookie}});assert.equal(preferences.status,200);
 const home=await fetch(second+'/');assert.equal(home.status,200);assert.match(await home.text(),/Dr Stevens/);
 const logout=await fetch(second+'/api/logout',{method:'POST',headers:{...headers,Cookie:cookie,'x-csrf-token':csrf}});assert.equal(logout.status,200);
 const ended=await (await fetch(first+'/api/session',{headers:{Cookie:cookie}})).json();assert.equal(ended.authenticated,false);cookie=null;
 console.log('Passed: Vercel-style function entry, no cloud SQLite, sessions shared across independent processes, cloud preferences, public rendering and cross-instance logout.');
}finally{
 if(cookie)await fetch(first+'/api/logout',{method:'POST',headers:{...headers,Cookie:cookie,'x-csrf-token':csrf}}).catch(()=>{});
 for(const child of children){child.kill();await new Promise(resolve=>child.once('exit',resolve));}
 for(const directory of directories){assert.ok(directory.startsWith(path.resolve('test-results')+path.sep));fs.rmSync(directory,{recursive:true,force:true});}
}
