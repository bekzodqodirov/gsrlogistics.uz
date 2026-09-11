// Post-build: rewrites dist/sitemap-0.xml so every URL carries xhtml:link hreflang alternates
// (read from each page's own <link rel="alternate">), plus lastmod from the page's dateModified meta.
//
// Every <loc> is the page's own <link rel="canonical">, copied byte for byte. That matters most for
// the Cyrillic locale, whose URLs are percent-encoded (`/kirill/%D0%BD%D0%B0%D1%80%D1%85...`): a
// sitemap entry that spelled the same page any other way would offer Google a second URL for one
// page. scripts/check-kirill.mjs asserts the two are identical, entry for entry.
import fs from 'node:fs';
import path from 'node:path';
const dist = process.argv[2] || 'dist';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'index.html' ? [path.join(d, e.name)] : []);
const today = new Date().toISOString().slice(0, 10);
const entries = [];
for (const f of walk(dist)) {
  const html = fs.readFileSync(f, 'utf8');
  if (/name="robots" content="noindex/i.test(html)) continue;
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!canonical) continue;
  const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ lang: m[1], href: m[2] }));
  const mod = (html.match(/property="article:modified_time" content="([^"]+)"/) || [])[1] || today;
  // Priority is judged on the DECODED path: the Cyrillic slugs arrive percent-encoded, so a regex
  // over the raw canonical would score every /kirill/ page 0.7 — the Cyrillic home included.
  const p = decodeURIComponent(new URL(canonical).pathname);
  const home = p === '/' || /^\/(ru|en|kirill)\/$/.test(p);
  const money = /xizmatlar|uslugi|services|хизматлар|narxlar|ceny|pricing|нархлар/.test(p);
  const pri = home ? '1.0' : money ? '0.9' : '0.7';
  entries.push({ loc: canonical, alts, mod: mod.slice(0, 10), pri });
}
entries.sort((a, b) => a.loc.localeCompare(b.loc));
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  entries.map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.mod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${e.pri}</priority>\n` + e.alts.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`).join('\n') + `\n  </url>`).join('\n') + `\n</urlset>\n`;
fs.writeFileSync(path.join(dist, 'sitemap-0.xml'), xml);
fs.writeFileSync(path.join(dist, 'sitemap-index.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>https://gsrlogistics.uz/sitemap-0.xml</loc></sitemap>\n</sitemapindex>\n`);
console.log(`sitemap: ${entries.length} URLs with hreflang alternates`);
