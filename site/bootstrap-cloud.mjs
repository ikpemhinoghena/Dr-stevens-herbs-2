// Run once after schema.sql. Credentials are written only to ignored local storage.
import fs from 'node:fs';
import {randomBytes} from 'node:crypto';
import {enabled,cloudRequest,importProducts} from './cloud.mjs';
import {products} from './data.mjs';
if(!enabled)throw Error('Select DATA_BACKEND=supabase in .env.');
await importProducts(products);
const email='orderherbs.steven@gmail.com';
const users=await cloudRequest('/auth/v1/admin/users?page=1&per_page=100');
let user=users.users.find(u=>u.email===email);
if(!user){
 const password='DS!'+randomBytes(16).toString('base64url');
 user=await cloudRequest('/auth/v1/admin/users',{method:'POST',body:JSON.stringify({email,password,email_confirm:true})});
 fs.mkdirSync('storage',{recursive:true});
 fs.writeFileSync('storage/admin-login.txt',`Admin URL: http://127.0.0.1:4173/admin/\nEmail: ${email}\nPassword: ${password}\nDatabase: Supabase\n`,{mode:0o600});
}
await cloudRequest('/rest/v1/product_admins',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({user_id:user.id})});
console.log('Supabase catalogue imported and administrator configured. Login details are in storage/admin-login.txt.');
