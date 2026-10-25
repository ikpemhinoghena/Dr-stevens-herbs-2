import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
process.chdir(path.dirname(fileURLToPath(import.meta.url)));
if(fs.existsSync('.env'))process.loadEnvFile('.env');
const {default:handler}=await import('./api-server.mjs');
export default handler;
