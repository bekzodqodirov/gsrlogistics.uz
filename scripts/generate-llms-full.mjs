// Post-build: writes dist/llms-full.txt — every page as Markdown-ish plain text grouped by language.
// Usage: node scripts/generate-llms-full.mjs [dist]
import fs from 'node:fs';
import path from 'node:path';
const dist = process.argv[2] || 'dist';
const SITE = 'https://gsrlogistics.uz';
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name === 'index.html' ? [path.join(dir, e.name)] : []);
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
const strip = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
function extract(html) {
  const title = strip((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '');
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || '');
  let main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [])[1] || '';
  main = main.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<svg[\s\S]*?<\/svg>/gi, '').replace(/<nav[\s\S]*?<\/nav>/gi, '');
  const out = [];
  const re = /<(h1|h2|h3|p|li|th|td|summary|dt|dd)[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(main))) {
    const tag = m[1].toLowerCase(); const text = strip(m[2]);
    if (!text || text.length < 2) continue;
    if (tag === 'h1') out.push(`\n# ${text}`); else if (tag === 'h2') out.push(`\n## ${text}`); else if (tag === 'h3' || tag === 'summary' || tag === 'dt') out.push(`\n### ${text}`); else if (tag === 'li') out.push(`- ${text}`); else if (tag === 'th' || tag === 'td') out.push(`| ${text}`); else out.push(text);
  }
  return { title, desc, body: out.join('\n') };
}
const pages = walk(dist).map((f) => ({ file: f, url: SITE + '/' + path.relative(dist, path.dirname(f)).replace(/\\/g, '/') + '/' })).map((p) => ({ ...p, url: p.url.replace(/\/\.\/$/, '/').replace(/\/\/$/, '/') })).filter((p) => !/\/404\//.test(p.url) && !/\/dev-/.test(p.url));
const lang = (u) => (/\/ru\//.test(u) ? 'ru' : /\/en\//.test(u) ? 'en' : 'uz');
const groups = { uz: [], ru: [], en: [] };
for (const p of pages) { const html = fs.readFileSync(p.file, 'utf8'); if (/name="robots" content="noindex/i.test(html)) continue; groups[lang(p.url)].push({ ...p, ...extract(html) }); }
let out = `# GSR Logistics — full site text\n\n> Cargo from China to Uzbekistan: consolidated truck (15–25 days), air (5–10), rail (20–35); sourcing, buying on 1688/Taobao, customs clearance, Yiwu warehouse. Tashkent. Generated ${new Date().toISOString().slice(0, 10)}.\n`;
for (const [l, name] of [['uz', 'Oʻzbekcha'], ['ru', 'Русский'], ['en', 'English']]) {
  out += `\n\n# ===== ${name} (${l}) =====\n`;
  for (const p of groups[l].sort((a, b) => a.url.localeCompare(b.url))) out += `\n\n---\nURL: ${p.url}\nTitle: ${p.title}\nDescription: ${p.desc}\n${p.body}\n`;
}
fs.writeFileSync(path.join(dist, 'llms-full.txt'), out);
console.log(`llms-full.txt: ${pages.length} pages, ${(out.length / 1024).toFixed(0)} KB`);
