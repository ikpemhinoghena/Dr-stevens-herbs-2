// Persistent server state: Supabase in production, SQLite only for isolated local mode.
import {createHash,randomBytes} from 'node:crypto';
import {db} from './store.mjs';
import {enabled,cloudRequest} from './cloud.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex');
export async function getSession(req){
 const token=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('stevens_session='))?.slice('stevens_session='.length);
 if(!token||!/^[a-f0-9]{64}$/.test(token))return null;
 const tokenHash=hash(token);
 if(enabled){const rows=await cloudRequest('/rest/v1/app_sessions?token=eq.'+tokenHash+'&expires=gt.'+Date.now()+'&select=user_id');if(!rows.length)return null;const membership=await cloudRequest('/rest/v1/product_admins?user_id=eq.'+rows[0].user_id+'&select=user_id');if(!membership.length)return null;}
 else{const row=db.prepare('SELECT expires FROM sessions WHERE token=?').get(tokenHash);if(!row||row.expires<=Date.now())return null;}
 return {token,csrf:hash(token+':csrf')};
}
export async function createSession(res,origin,userId){
 const token=randomBytes(32).toString('hex'),expires=Date.now()+43200000;
 if(enabled)await cloudRequest('/rest/v1/app_sessions',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({token:hash(token),user_id:userId,expires})});
 else{db.prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());db.prepare('INSERT INTO sessions VALUES(?,?)').run(hash(token),expires);}
 res.setHeader('Set-Cookie',`stevens_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200${origin.startsWith('https:')?'; Secure':''}`);
 return hash(token+':csrf');
}
export async function endSession(token){if(enabled)await cloudRequest('/rest/v1/app_sessions?token=eq.'+hash(token),{method:'DELETE'});else db.prepare('DELETE FROM sessions WHERE token=?').run(hash(token));}
export async function rateLimit(req,scope,maximum,windowMs){
 // On Vercel the platform supplies the trusted forwarded address; outside it use the socket.
 const address=process.env.VERCEL?String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim():req.socket?.remoteAddress||'unknown';
 const key=hash(scope+':'+address);
 if(enabled){const allowed=await cloudRequest('/rest/v1/rpc/check_app_rate_limit',{method:'POST',body:JSON.stringify({rate_key:key,maximum,window_ms:windowMs})});if(!allowed){const e=Error('Too many attempts. Please try again later.');e.status=429;throw e}}
 else{const attempt=db.prepare('SELECT * FROM attempts WHERE address=?').get(key);if(attempt&&attempt.expires>Date.now()&&attempt.count>=maximum){const e=Error('Too many attempts. Please try again later.');e.status=429;throw e}db.prepare('INSERT OR REPLACE INTO attempts VALUES(?,?,?)').run(key,attempt?.expires>Date.now()?attempt.count+1:1,attempt?.expires>Date.now()?attempt.expires:Date.now()+windowMs);}
}
const defaults={businessName:'Dr Stevens Herbs',email:'orderherbs.steven@gmail.com'};
export async function getPreferences(){if(enabled){const rows=await cloudRequest('/rest/v1/app_settings?key=eq.preferences&select=value');return rows[0]?.value||defaults}return JSON.parse(db.prepare("SELECT value FROM settings WHERE key='preferences'").get()?.value||JSON.stringify(defaults));}
export async function savePreferences(value){if(enabled)return cloudRequest('/rest/v1/app_settings',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({key:'preferences',value})});db.prepare("INSERT OR REPLACE INTO settings VALUES('preferences',?)").run(JSON.stringify(value));}
