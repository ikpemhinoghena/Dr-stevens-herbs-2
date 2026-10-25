import {tmpdir} from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import {randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
import {products as seeds} from './data.mjs';
import {enabled,cloudProducts,saveCloud,isCloudPhoto} from './cloud.mjs';
import {categories,formats,publishIssues} from './catalogue-options.mjs';

export const storage=path.resolve(process.env.DATA_DIR||(process.env.VERCEL?path.join(tmpdir(),'dr-stevens-runtime'):'storage'));
fs.mkdirSync(path.join(storage,'uploads'),{recursive:true});
export const db=enabled?null:new (await import('node:sqlite')).DatabaseSync(path.join(storage,'catalogue.sqlite'));
db?.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS products(id TEXT PRIMARY KEY, body TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('draft','published','archived')), revision INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS uploads(path TEXT PRIMARY KEY,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,action TEXT NOT NULL,product_id TEXT,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS attempts(address TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);`);
const now=()=>new Date().toISOString();
if(db&&!db.prepare("SELECT value FROM settings WHERE key='seeded'").get()){
 db.exec('BEGIN');
 try{for(const p of seeds)db.prepare('INSERT INTO products VALUES(?,?,?,?,?)').run(p.id,JSON.stringify(p),'published',1,now());db.prepare('INSERT INTO settings VALUES(?,?)').run('seeded','yes');db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}
}
export const configured=()=>enabled||!!db.prepare("SELECT value FROM settings WHERE key='password'").get();
export function setPassword(password){
 if(typeof password!=='string'||password.length<12||password.length>200)throw Error('Choose a password of 12 to 200 characters.');
 const salt=randomBytes(16).toString('hex');
 db.prepare("INSERT OR REPLACE INTO settings VALUES('password',?)").run(salt+':'+scryptSync(password,salt,64).toString('hex'));
 db.exec('DELETE FROM sessions');
}
export function verifyPassword(password){const saved=db.prepare("SELECT value FROM settings WHERE key='password'").get()?.value;if(!saved||typeof password!=='string'||password.length>200)return false;const [salt,hash]=saved.split(':');return timingSafeEqual(Buffer.from(hash,'hex'),scryptSync(password,salt,64))}
export const listProducts=(publicOnly=false)=>enabled?cloudProducts().filter(p=>!publicOnly||p.status==='published'):db.prepare('SELECT * FROM products'+(publicOnly?" WHERE status='published'":'')+' ORDER BY rowid').all().map(row=>({...JSON.parse(row.body),status:row.status,revision:row.revision,updatedAt:row.updated_at}));
export async function saveProduct(product,existing){
 if(enabled)return saveCloud(product,existing);
 const stamp=now();
 if(existing){const result=db.prepare('UPDATE products SET body=?,status=?,revision=revision+1,updated_at=? WHERE id=? AND revision=?').run(JSON.stringify(product),product.status,stamp,product.id,product.revision);if(!result.changes){const e=Error('This product changed in another window. Reload it before saving.');e.status=409;throw e}}
 else db.prepare('INSERT INTO products VALUES(?,?,?,?,?)').run(product.id,JSON.stringify(product),product.status,1,stamp);
 db.prepare('INSERT INTO audit(action,product_id,created_at) VALUES(?,?,?)').run(existing?'update':'create',product.id,stamp);
}
export function validateProduct(input,existing){
 const p={};
 const fields={name:140,type:80,category:80,weight:60,tag:100,tagline:240,desc:6000,imageAlt:240,usage:4000,suitability:4000,ingredientsInfo:4000,warnings:4000,reference:80,sku:80,botanicalName:800,allergens:1200,storageInstructions:1200,shelfLife:300};
 for(const [key,max] of Object.entries(fields)){if(input[key]!==undefined&&typeof input[key]!=='string')throw Error('Invalid '+key);p[key]=(input[key]||'').trim();if(p[key].length>max)throw Error(key+' is too long.');}
 if(!p.name)throw Error('Please complete the product name.');
 if(p.category&&!categories.includes(p.category))throw Error('Choose an approved product category.');
 if(p.type&&!formats.includes(p.type))throw Error('Choose an approved product format.');
 if(p.sku&&listProducts().some(item=>item.id!==existing?.id&&item.sku?.toLowerCase()===p.sku.toLowerCase()))throw Error('That SKU is already assigned to another product.');
 p.id=existing?.id||String(input.id||p.name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);
 if(!p.id)throw Error('Choose a product name with letters or numbers.');
 if(!existing&&listProducts().some(item=>item.id===p.id)){const e=Error('That product URL already exists. Choose another name or URL.');e.status=409;throw e}
 p.status=input.status||'draft';if(!['draft','published','archived'].includes(p.status))throw Error('Invalid product status.');
 p.tone=['green','olive','sand','clay','forest','cream'].includes(input.tone)?input.tone:'green';
 p.stock=input.stock===''||input.stock===null||input.stock===undefined?null:Number(input.stock);if(p.stock!==null&&(!Number.isInteger(p.stock)||p.stock<0||p.stock>1000000))throw Error('Stock must be a whole number from 0 to 1,000,000.');
 p.price=input.price===''||input.price===null||input.price===undefined?null:Number(input.price);if(p.price!==null&&(!Number.isFinite(p.price)||p.price<0||p.price>10000000))throw Error('Enter a valid reference price.');
 p.currency=input.currency||'USD';if(!/^[A-Z]{3}$/.test(p.currency))throw Error('Use a three-letter currency code.');
 if(!Array.isArray(input.images)||input.images.length>8)throw Error('Choose up to 8 photos.');
 p.images=[...new Set(input.images)];
 for(const image of p.images){if(isCloudPhoto(image))continue;if(typeof image!=='string'||!/^\/(?:assets|uploads)\/[a-zA-Z0-9_.-]+\.(?:png|jpe?g|webp)$/i.test(image))throw Error('Invalid photo.');const local=image.startsWith('/uploads/')?path.join(storage,image):path.resolve('dist','.'+image);if(!fs.existsSync(local))throw Error('A photo is missing. Please upload it again.');}
 p.image=p.images[0]||'/assets/botanical-story.png';
 const contentFields=Object.keys(fields).filter(field=>!['sku','reference'].includes(field));
 const inventoryOnly=existing?.status==='published'&&p.status==='published'&&contentFields.every(field=>p[field]===String(existing[field]||'').trim())&&JSON.stringify(p.images)===JSON.stringify(existing.images?.length?existing.images:[existing.image]);
 if(p.status==='published'&&!inventoryOnly){const missing=publishIssues(p);if(missing.length)throw Error('Before publishing, complete: '+missing.map(issue=>issue.label).join(', ')+'.');}
 p.ailments=existing?.ailments||[];p.isTemporary=existing?.isTemporary||false;
 if(existing){if(!Number.isInteger(input.revision))throw Error('Reload this product before saving.');p.revision=input.revision;}
 return p;
}
