// Notify Bing/Yandex/Naver/Seznam (IndexNow) about changed URLs after a deploy.
// Usage: node scripts/indexnow.mjs [dist] [--dry]
import fs from 'node:fs';
import path from 'node:path';
const KEY = '98c92c618942ec4f59a5448c62c9b486'; // must match public/<KEY>.txt
const HOST = 'gsrlogistics.uz';
const dist = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'dist';
const dry = process.argv.includes('--dry');
const xml = fs.readFileSync(path.join(dist, 'sitemap-0.xml'), 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`IndexNow: ${urls.length} URLs`);
if (dry) { console.log(urls.join('\n')); process.exit(0); }
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log('IndexNow response:', res.status, await res.text());
