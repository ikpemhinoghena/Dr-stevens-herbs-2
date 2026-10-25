import {randomBytes} from 'node:crypto';
import {db,listProducts} from './store.mjs';
import {enabled,cloudRequest} from './cloud.mjs';
db.exec(`CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,body TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS order_requests(request_key TEXT PRIMARY KEY,order_id TEXT NOT NULL);`);
export const statuses=['new','confirmed','preparing','in_transit','delivered','cancelled'];
export async function orders(){if(enabled){const rows=await cloudRequest('/rest/v1/orders?select=*&order=created_at.desc');return rows.map(r=>({...r.body,id:r.id,revision:r.revision,createdAt:r.created_at}))}return db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all().map(r=>({...JSON.parse(r.body),id:r.id,revision:r.revision,createdAt:r.created_at}));}
function text(value,max,required=false){if(typeof value!=='string'||value.trim().length>max||(required&&!value.trim()))throw Error('Please check your contact and delivery details.');return value.trim()}
export async function createOrder(input){
 if(!input||input.consent!==true)throw Error('Please agree to share your details for this enquiry.');
 if(typeof input.requestKey!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(input.requestKey))throw Error('Please reload the checkout and try again.');
 const existing=enabled?(await cloudRequest('/rest/v1/orders?request_key=eq.'+input.requestKey+'&select=id'))[0]?.id:db.prepare('SELECT order_id FROM order_requests WHERE request_key=?').get(input.requestKey)?.order_id;
 if(existing)return {id:existing};
 const d=input.details||{};const details={};for(const [field,max]of Object.entries({name:100,phone:25,email:120,country:100,state:80,city:100,address:300,postcode:20,notes:300}))details[field]=text(d[field]??'',max,!['email','postcode','notes'].includes(field));
 if(!/^[+\d\s().-]{7,25}$/.test(details.phone)||details.phone.replace(/\D/g,'').length<7||details.phone.replace(/\D/g,'').length>15)throw Error('Please check the phone number.');
 if(details.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email))throw Error('Please check the email address.');
 if(!Array.isArray(input.items)||!input.items.length||input.items.length>50)throw Error('Please check your shopping bag.');
 const catalogue=listProducts(true);const seen=new Set();const items=input.items.map(item=>{const p=catalogue.find(p=>p.id===item.id);if(!p||seen.has(p.id)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>99||(p.stock!==null&&p.stock!==undefined&&p.stock<item.quantity))throw Error('A product in your bag is unavailable in the requested quantity. Please refresh your bag.');seen.add(p.id);return {id:p.id,name:p.name,quantity:item.quantity,image:p.image}});
 const id='DS-'+new Date().toISOString().slice(2,10).replaceAll('-','')+'-'+randomBytes(4).toString('hex').toUpperCase();const createdAt=new Date().toISOString();
 const order={id,details,items,status:'new',payment:'unpaid',tracking:'',carrier:'',internalNotes:'',total:null,currency:'USD',revision:1,createdAt,updatedAt:createdAt,history:[{at:createdAt,event:'Order enquiry received'}]};
 if(enabled)await cloudRequest('/rest/v1/orders',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({id,request_key:input.requestKey,body:order,revision:1})});
 else{db.exec('BEGIN');try{db.prepare('INSERT INTO orders VALUES(?,?,?,?)').run(id,JSON.stringify(order),1,createdAt);db.prepare('INSERT INTO order_requests VALUES(?,?)').run(input.requestKey,id);db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}}
 return {id};
}
export async function updateOrder(id,input){const old=(await orders()).find(o=>o.id===id);if(!old){const e=Error('Order not found.');e.status=404;throw e}if(input.revision!==old.revision){const e=Error('This order changed. Reload before saving.');e.status=409;throw e}
 if(!statuses.includes(input.status)||!['unpaid','awaiting','paid','refunded'].includes(input.payment))throw Error('Choose a valid order and payment status.');
 const tracking=text(input.tracking??'',200),carrier=text(input.carrier??'',100),internalNotes=text(input.internalNotes??'',4000);
 if(!/^[A-Z]{3}$/.test(input.currency||''))throw Error('Use a three-letter currency code.');
 const total=input.total===null||input.total===''?null:Number(input.total);if(total!==null&&(!Number.isFinite(total)||total<0||total>10000000))throw Error('Enter a valid agreed total.');
 const stamp=new Date().toISOString();const changes=[];if(old.status!==input.status)changes.push('Status: '+old.status+' → '+input.status);if(old.payment!==input.payment)changes.push('Payment: '+old.payment+' → '+input.payment);if(old.tracking!==tracking||old.carrier!==carrier)changes.push('Shipping details updated');if(old.internalNotes!==internalNotes)changes.push('Internal notes updated');if(old.total!==total||old.currency!==input.currency)changes.push('Agreed total updated');
 if(!changes.length)return old;
 const order={...old,status:input.status,payment:input.payment,tracking,carrier,internalNotes,total,currency:input.currency,updatedAt:stamp,revision:old.revision+1,history:[...old.history,{at:stamp,event:changes.join('; ')}]};
 if(enabled){const rows=await cloudRequest('/rest/v1/orders?id=eq.'+id+'&revision=eq.'+old.revision,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({body:order,revision:order.revision})});if(!rows.length){const e=Error('This order changed. Reload before saving.');e.status=409;throw e}}
 else{const result=db.prepare('UPDATE orders SET body=?,revision=? WHERE id=? AND revision=?').run(JSON.stringify(order),order.revision,id,old.revision);if(!result.changes){const e=Error('This order changed. Reload before saving.');e.status=409;throw e}}
 return order;
}
