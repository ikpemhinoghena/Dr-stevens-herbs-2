import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const files=fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html'));let links=0;
for(const file of files){const html=fs.readFileSync(path.join('dist',file),'utf8');assert.match(html,/<title>.+Dr Stevens Herbs<\/title>/);assert.match(html,/<meta name="description"/);assert.match(html,/<h1>/);for(const m of html.matchAll(/(?:href|src)="(\/[^"?#]*)/g)){let local=path.join('dist',m[1]);if(!path.extname(local))local=path.join(local,'index.html');assert.ok(fs.existsSync(local),`${file}: missing ${m[1]}`);links++}}
console.log(`Verified ${files.length} HTML files and ${links} internal links/assets.`);
