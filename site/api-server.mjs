import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {db,storage,configured,setPassword,verifyPassword,listProducts,validateProduct,saveProduct} from './store.mjs';
import {buildSite} from './build.mjs';
import {enabled,syncCloud,loginCloud,uploadCloud,project,cloudRequest} from './cloud.mjs';
import {orders,createOrder,updateOrder} from './orders.mjs';
import {categories,formats,publishFields} from './catalogue-options.mjs';
import {getSession,createSession,endSession,rateLimit,getPreferences,savePreferences} from './runtime-state.mjs';
const root=path.resolve('dist'), generated=path.join(storage,'pages');
const equal=(a,b)=>typeof a==='string'&&typeof b==='string'&&Buffer.byteLength(a)===Buffer.byteLength(b)&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
const setupPath=path.join(storage,'setup-key');
if(!configured()&&!fs.existsSync(setupPath))fs.writeFileSync(setupPath,randomBytes(24).toString('hex'),{mode:0o600});
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const publicCatalogue=()=>listProducts(true).map(({price,currency,sku,revision,updatedAt,status,...product})=>product);
function refresh(){
 const products=listProducts(true).map(p=>Object.fromEntries(Object.entries(p).map(([k,v])=>[k,typeof v==='string'?escape(v):Array.isArray(v)?v.map(escape):v])));
 buildSite(products,generated);
 fs.writeFileSync(path.join(generated,'assets/catalogue.json'),JSON.stringify(publicCatalogue()));
}
let ready;
function initialize(){return ready||=(async()=>{await syncCloud();refresh()})().catch(error=>{ready=null;throw error})}
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'};
const port=Number(process.env.PORT||4173), host=process.env.HOST||'127.0.0.1';
const origin=process.env.PUBLIC_ORIGIN||`http://127.0.0.1:${port}`;
const allowedOrigins=new Set([origin]);
for(const domain of [process.env.VERCEL_URL,process.env.VERCEL_BRANCH_URL,process.env.VERCEL_PROJECT_PRODUCTION_URL])if(domain)allowedOrigins.add('https://'+domain);
for(const extra of (process.env.ALLOWED_ORIGINS||'').split(',').filter(Boolean)){const value=new URL(extra);if(value.protocol!=='https:')throw Error('Additional origins must use HTTPS.');allowedOrigins.add(value.origin);}
if(process.env.NODE_ENV!=='production'&&/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin)){allowedOrigins.add(`http://localhost:${port}`);allowedOrigins.add(`http://127.0.0.1:${port}`)}
if(process.env.NODE_ENV==='production'&&!origin.startsWith('https://'))throw Error('Set PUBLIC_ORIGIN to the HTTPS website address in production.');
if(process.env.NODE_ENV==='production'&&!enabled)throw Error('Set DATA_BACKEND=supabase in production.');
function send(res,status,value){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value))}
function fail(message,status=400){const e=Error(message);e.status=status;throw e}
async function body(req,limit=70000){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>limit)fail('This upload is too large.',413);chunks.push(chunk)}return Buffer.concat(chunks)}
async function json(req){if(!req.headers['content-type']?.startsWith('application/json'))fail('Expected JSON.',415);try{return JSON.parse((await body(req)).toString())}catch(e){if(e.status)throw e;fail('Invalid JSON.')}}
export default async function handler(req,res){
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','DENY');
 try{
 await initialize();
 const url=new URL(req.url,origin);let pathname;try{pathname=path.posix.normalize(decodeURIComponent(url.pathname).replaceAll('\\','/'))}catch{fail('Invalid URL.')}
 if(pathname.startsWith('/api/')){
  const auth=await getSession(req),mutation=!['GET','HEAD'].includes(req.method);
  if(mutation&&!allowedOrigins.has(req.headers.origin))fail('Please use the admin page on this website.',403);
  if(pathname==='/api/orders'&&req.method==='POST'){
   await rateLimit(req,'order',20,3600000);await syncCloud();
   try{return send(res,201,await createOrder(await json(req)))}catch(e){e.status||=400;throw e}
  }
  if(pathname==='/api/session'&&req.method==='GET')return send(res,200,{authenticated:!!auth,configured:enabled||configured(),csrf:auth?.csrf,backend:enabled?'supabase':'local'});
  if(pathname==='/api/setup'&&req.method==='POST'){
   await rateLimit(req,'login',10,900000);if(enabled||configured())fail('Admin account is already configured.',409);
   const input=await json(req);if(!equal(input.key,fs.readFileSync(setupPath,'utf8')))fail('Invalid setup key.',403);
   try{setPassword(input.password)}catch(e){fail(e.message)}fs.unlinkSync(setupPath);return send(res,201,{csrf:await createSession(res,origin)});
  }
  if(pathname==='/api/login'&&req.method==='POST'){await rateLimit(req,'login',10,900000);const input=await json(req);const userId=enabled?await loginCloud(input.email,input.password):verifyPassword(input.password);if(!userId)fail('Incorrect sign-in or this account is not an administrator.',401);return send(res,200,{csrf:await createSession(res,origin,userId)});}
  if(!auth)fail('Please sign in.',401);
  if(mutation&&!equal(req.headers['x-csrf-token'],auth.csrf))fail('Your session changed. Reload and try again.',403);
  if(pathname==='/api/logout'&&req.method==='POST'){await endSession(auth.token);res.setHeader('Set-Cookie','stevens_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return send(res,200,{ok:true})}
  if(pathname==='/api/products'&&req.method==='GET'){await syncCloud();if(enabled)refresh();return send(res,200,listProducts());}
  if(pathname==='/api/catalogue-options'&&req.method==='GET')return send(res,200,{categories,formats,publishFields});
  if(pathname==='/api/orders'&&req.method==='GET')return send(res,200,await orders());
  if(pathname==='/api/manual-orders'&&req.method==='POST'){await syncCloud();try{return send(res,201,await createOrder(await json(req)))}catch(e){e.status||=400;throw e}}
  if(pathname==='/api/team'&&req.method==='GET'){if(!enabled)return send(res,200,[{email:'Local administrator',lastSignIn:null}]);const admins=await cloudRequest('/rest/v1/product_admins?select=user_id');const result=await cloudRequest('/auth/v1/admin/users?page=1&per_page=100');return send(res,200,result.users.filter(u=>admins.some(a=>a.user_id===u.id)).map(u=>({email:u.email,lastSignIn:u.last_sign_in_at,createdAt:u.created_at})));}
  const orderRoute=pathname.match(/^\/api\/orders\/(DS-[A-Z0-9-]+)$/);
  if(orderRoute&&req.method==='PUT'){try{return send(res,200,await updateOrder(orderRoute[1],await json(req)))}catch(e){e.status||=400;throw e}}
  if(pathname==='/api/preferences'&&req.method==='GET')return send(res,200,await getPreferences());
  if(pathname==='/api/preferences'&&req.method==='PUT'){const p=await json(req);if(typeof p.businessName!=='string'||p.businessName.length>100||!p.businessName.trim()||typeof p.email!=='string'||p.email.length>120||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))fail('Please check the business name and email.');await savePreferences({businessName:p.businessName.trim(),email:p.email.trim()});return send(res,200,{ok:true})}
  if(pathname==='/api/uploads'&&req.method==='POST'){
   const bytes=await body(req,4*1024*1024);let ext;
   if(bytes.length>24&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))ext='png';
   else if(bytes.length>4&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)ext='jpg';
   else if(bytes.length>12&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP')ext='webp';
   if(!ext)fail('Upload a JPEG, PNG or WebP photo.',415);
   const name=randomBytes(18).toString('hex');
   if(enabled)return send(res,201,{image:await uploadCloud(bytes,ext,name)});
   const image='/uploads/'+name+'.'+ext;
   fs.writeFileSync(path.join(storage,image),bytes,{flag:'wx'});db.prepare('INSERT INTO uploads VALUES(?,?)').run(image,new Date().toISOString());return send(res,201,{image});
  }
  const productRoute=pathname.match(/^\/api\/products(?:\/([a-z0-9-]+))?$/);
  if(productRoute&&['POST','PUT'].includes(req.method)){
   const id=productRoute[1];if((req.method==='PUT')!==!!id)fail('Invalid product route.',405);
   await syncCloud();const existing=id?listProducts().find(p=>p.id===id):null;if(id&&!existing)fail('Product not found.',404);
   let p;try{p=validateProduct(await json(req),existing)}catch(e){e.status||=400;throw e}
   if(enabled){await saveProduct(p,existing);refresh()}
   else{db.exec('BEGIN');try{await saveProduct(p,existing);refresh();db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');refresh();throw e}}
   return send(res,existing?200:201,listProducts().find(item=>item.id===p.id));
  }
  fail('API route not found.',404);
 }
 if(!['GET','HEAD'].includes(req.method))fail('Method not allowed.',405);
 if(pathname==='/assets/catalogue.json'&&enabled){await syncCloud();return send(res,200,publicCatalogue())}
 if(enabled&&!pathname.startsWith('/admin/')&&!pathname.startsWith('/assets/')&&!pathname.startsWith('/uploads/')){await syncCloud();refresh();}
 if(pathname==='/admin'){res.writeHead(302,{Location:'/admin/'});return res.end()}
 let file;
 if(pathname.startsWith('/admin/')){
  const relative=pathname.slice(7)||'index.html';if(!['index.html','admin.js','admin.css','dashboard.js','operations.js','workspace.js'].includes(relative))fail('Page not found.',404);
  file=path.resolve('admin',relative);res.setHeader('Cache-Control','no-store');res.setHeader('Content-Security-Policy',`default-src 'self'; img-src 'self' blob: ${enabled?project:''}; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'`);res.setHeader('X-Robots-Tag','noindex, nofollow');
 }else if(pathname.startsWith('/uploads/')){
  if(!/^\/uploads\/[a-f0-9]+\.(jpg|png|webp)$/.test(pathname))fail('Photo not found.',404);file=path.join(storage,pathname);
 }else{
  let relative=pathname;if(!path.extname(relative))relative=relative.replace(/\/$/,'')+'/index.html';
  file=path.resolve(generated,'.'+relative);if(!file.startsWith(generated+path.sep))fail('Invalid path.',403);
  if(pathname.startsWith('/assets/')&&!fs.existsSync(file)){file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep))fail('Invalid path.',403)}
  const herb=pathname.match(/^\/herbs\/([^/]+)(?:\/|$)/);
  if(!fs.existsSync(file)||(herb&&!listProducts(true).some(p=>p.id===herb[1]))){res.statusCode=404;file=path.join(generated,'404.html')}
 }
 if(!fs.existsSync(file)||!fs.statSync(file).isFile())fail('File not found.',404);
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
 if(!res.hasHeader('Cache-Control'))res.setHeader('Cache-Control',pathname.startsWith('/uploads/')?'public, max-age=31536000, immutable':'no-cache');
 if(req.method==='HEAD')return res.end();fs.createReadStream(file).pipe(res);
 }catch(e){if(!res.headersSent)send(res,e.status||500,{error:e.status?e.message:'Something went wrong. Please try again.'});else res.end();if(!e.status)console.error(e.message)}
}
if(!process.env.VERCEL){await initialize();http.createServer(handler).listen(port,host,()=>console.log('Website: '+origin+'\nDashboard: '+origin+'/admin/\nDatabase: '+(enabled?'Supabase Postgres':storage)));}
