import fs from 'node:fs';
import {buildSite} from './build.mjs';
buildSite();
fs.mkdirSync('public/assets',{recursive:true});
fs.cpSync('dist/assets','public/assets',{recursive:true,filter:source=>!source.endsWith('catalogue.json')});
// Public pages and the catalogue are served by the function from Supabase.
// Only immutable source assets are copied to the CDN output directory.
console.log('Vercel assets prepared; all pages and API routes use the Node handler.');
