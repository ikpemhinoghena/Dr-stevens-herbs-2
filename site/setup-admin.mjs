import {setPassword} from './store.mjs';
import {createInterface} from 'node:readline/promises';
if(process.env.ADMIN_PASSWORD){setPassword(process.env.ADMIN_PASSWORD);console.log('Admin password set. Existing sessions signed out.');}
else{const readline=createInterface({input:process.stdin,output:process.stdout});console.log('Set your admin password (input is visible in this terminal).');try{const password=await readline.question('Password (at least 12 characters): ');setPassword(password);console.log('Admin password set. Open /admin/.');}finally{readline.close()}}
