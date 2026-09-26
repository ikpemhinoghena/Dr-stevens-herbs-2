// Prepare a separate Pages artifact; local dist URLs remain unchanged.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

process.chdir(path.dirname(fileURLToPath(import.meta.url)));
const url = new URL(process.env.PAGES_URL || 'https://ikpemhinoghena.github.io/Dr-stevens-herbs-2/');
const base = url.pathname.replace(/\/$/, '');
const origin = url.origin + base;
const output = path.resolve('../pages-dist');
execFileSync(process.execPath, ['build.mjs'], {stdio: 'inherit'});
execFileSync(process.execPath, ['verify.mjs'], {stdio: 'inherit'});
fs.mkdirSync(output, {recursive: true});
fs.cpSync('dist', output, {recursive: true});
for (const file of fs.readdirSync(output, {recursive: true})) {
  if (!/\.(html|js|json|css|xml|txt)$/.test(file)) continue;
  const target = path.join(output, file);
  let text = fs.readFileSync(target, 'utf8');
  text = text.replaceAll('https://dr-stevens-herbs.greatyoyo.chatgpt.site', origin);
  // Root-relative HTML attributes, JS strings and catalogue image URLs.
  text = text.replace(/(["'`])\/(?!\/)(?=[a-zA-Z]|["'`])/g, `$1${base}/`);
  text = text.replace(/url\(\/(?!\/)/g, `url(${base}/`);
  fs.writeFileSync(target, text);
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
let links = 0;
for (const file of fs.readdirSync(output, {recursive: true}).filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(output, file), 'utf8');
  for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)/g)) {
    assert.ok(match[1].startsWith(base + '/'), `Wrong Pages prefix: ${match[1]}`);
    let target = path.join(output, match[1].slice(base.length));
    if (!path.extname(target)) target = path.join(target, 'index.html');
    assert.ok(fs.existsSync(target), `${file}: missing ${match[1]}`);
    links++;
  }
}
for (const file of ['app.js', 'commerce.js']) {
  execFileSync(process.execPath, ['--check', path.join(output, 'assets', file)], {stdio: 'inherit'});
}
console.log(`Pages artifact ready: ${origin}/ (${links} links verified)`);
