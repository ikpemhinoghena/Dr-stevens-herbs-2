// Server-only. Never send SUPABASE_SERVICE_ROLE_KEY to a browser.
export const enabled=process.env.DATA_BACKEND==='supabase';
export const project=(process.env.SUPABASE_URL||'').replace(/\/$/,'');
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(enabled&&(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(project)||!key))throw Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in site/.env before selecting Supabase.');
let cached=[];
export const cloudProducts=()=>cached;
async function request(route,options={}){
 const response=await fetch(project+route,{...options,headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',...options.headers},signal:AbortSignal.timeout(15000)});
 if(!response.ok){const e=Error('Supabase could not complete the request. Check the connection and database setup.');e.status=502;throw e}
 const text=await response.text();return text?JSON.parse(text):null;
}
export const cloudRequest=request;
export async function syncCloud(){if(!enabled)return;const rows=await request('/rest/v1/products?select=*&order=created_at.asc');cached=rows.map(row=>({...row.body,id:row.id,status:row.status,revision:row.revision,updatedAt:row.updated_at}));}
export async function saveCloud(p,existing){
 const body={id:p.id,body:p,status:p.status,revision:existing?existing.revision+1:1,updated_at:new Date().toISOString()};
 const result=await request('/rest/v1/products'+(existing?'?id=eq.'+p.id+'&revision=eq.'+p.revision:''),{method:existing?'PATCH':'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
 if(existing&&!result.length){const e=Error('This product changed in another window. Reload it before saving.');e.status=409;throw e}await syncCloud();
}
export function isCloudPhoto(image){return enabled&&typeof image==='string'&&image.startsWith(project+'/storage/v1/object/public/product-images/')&&/\/([a-f0-9]+)\.(jpg|png|webp)$/.test(image)}
export async function uploadCloud(bytes,ext,name){await request('/storage/v1/object/product-images/'+name+'.'+ext,{method:'POST',headers:{'Content-Type':ext==='jpg'?'image/jpeg':'image/'+ext},body:bytes});return project+'/storage/v1/object/public/product-images/'+name+'.'+ext;}
export async function loginCloud(email,password){
 if(typeof email!=='string'||typeof password!=='string'||password.length>200)return false;
 const response=await fetch(project+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email,password}),signal:AbortSignal.timeout(15000)});
 if(!response.ok)return false;const token=await response.json();if(!token.user?.id)return false;
 const allowed=await request('/rest/v1/product_admins?user_id=eq.'+encodeURIComponent(token.user.id)+'&select=user_id');return allowed.length===1?token.user.id:false;
}
export async function importProducts(products){return request('/rest/v1/products',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates'},body:JSON.stringify(products.map(p=>({id:p.id,body:p,status:'published'})))});}
