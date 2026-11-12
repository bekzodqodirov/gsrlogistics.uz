// Post-build: writes dist/llms-full.txt — every page as Markdown-ish plain text grouped by language.
// Usage: node scripts/generate-llms-full.mjs [dist]
//
// Three of the six locales are written out in full: Uzbek Latin, Russian and English. The other
// three are DELIBERATELY not dumped, and each is announced once at the top instead:
//
//   · Uzbek Cyrillic (/kirill/) is the Uzbek section transliterated — the same sentences, figures
//     and tables in the other script — so emitting it would add ~300 KB and not one new fact, and
//     would make a model reading this file believe the site says everything twice. Each Uzbek page
//     carries its Cyrillic URL, read from that page's own uz-Cyrl alternate.
//   · Chinese (/zh/) and Persian (/fa/) are hand translations of the English pages, at the English
//     slugs, with no fact the English page does not state. Each English page carries its "Chinese:"
//     and "Persian:" URLs, read from that page's own zh-Hans and fa alternates — so a page whose
//     translation is not published yet names none, and anything that needs to cite or link the
//     translated page has the exact URL without the text being repeated.
import fs from 'node:fs';
import path from 'node:path';
import { localeOfPath } from './locales.mjs';
const dist = process.argv[2] || 'dist';
const SITE = 'https://gsrlogistics.uz';
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name === 'index.html' ? [path.join(dir, e.name)] : []);
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
const strip = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
function extract(html) {
  const title = strip((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '');
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || '');
  let main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [])[1] || '';
  // Comments first: this runs before polish-html.mjs strips them from dist, so a maintainer's note
  // inside a component would otherwise be served to every AI reader as page text. Then the UI that
  // is not content: dialogs, templates, noscript fallbacks.
  main = main.replace(/<!--[\s\S]*?-->/g, '').replace(/<(dialog|template|noscript)\b[\s\S]*?<\/\1>/gi, '');
  main = main.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<svg[\s\S]*?<\/svg>/gi, '').replace(/<nav[\s\S]*?<\/nav>/gi, '');
  // The bidi islands around phones, e-mails and @handles (a bare <span dir="ltr"> or <bdi>, nothing
  // else on the tag) are invisible: unwrap them before every tag turns into a space below, or the
  // privacy line's "…@gmail.com</span>." would read "…@gmail.com ." here.
  main = main.replace(/<(span|bdi)((?:\s+(?:dir="[a-z]+"|data-astro-cid-[\w-]+))+)\s*>([^<]*)<\/\1>/gi, (m, _tag, attrs, text) => (/\sdir="/.test(attrs) ? text : m));
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
const lang = (u) => localeOfPath(new URL(u).pathname);
const groups = { uz: [], ru: [], en: [] };
const announced = { uzc: 0, zh: 0, fa: 0 };
/** A page's own alternate in one locale: already percent-encoded, the one spelling of that URL. */
const alternate = (html, hreflang) => (html.match(new RegExp(`<link rel="alternate" hreflang="${hreflang}" href="([^"]+)"`)) || [])[1];
for (const p of pages) {
  const html = fs.readFileSync(p.file, 'utf8');
  if (/name="robots" content="noindex/i.test(html)) continue;
  if (lang(p.url) in announced) { announced[lang(p.url)] += 1; continue; } // announced at the top, not repeated
  groups[lang(p.url)].push({ ...p, uzc: alternate(html, 'uz-Cyrl'), zh: alternate(html, 'zh-Hans'), fa: alternate(html, 'fa'), ...extract(html) });
}
const cyrillic = announced.uzc;
let out = `# GSR Logistics — full site text\n\n> Cargo from China to Uzbekistan: consolidated truck (15–25 days), air (5–10), rail (20–35); sourcing, buying on 1688/Taobao, customs clearance, Yiwu warehouse. New direction: truck cargo to Afghanistan (to Hairatan and Mazar-i-Sharif), transit documents in Uzbekistan and space in a partner's warehouse under customs control in Tashkent — price and timing on request. Tashkent. Generated ${new Date().toISOString().slice(0, 10)}.\n`;
out += `> The site publishes six locales: Uzbek Latin (uz, at /), Russian (ru, /ru/), English (en, /en/), Uzbek Cyrillic (uz-Cyrl, /kirill/), Chinese (zh-Hans, /zh/) and Persian (fa, /fa/). The Cyrillic locale is the Uzbek one transliterated script-for-script — same pages, same numbers, Cyrillic slugs — so its ${cyrillic} pages are NOT repeated below; each Uzbek page names its Cyrillic URL on its own "Uzbek Cyrillic:" line, and every Cyrillic URL is in https://gsrlogistics.uz/sitemap-0.xml with hreflang.\n`;
out += `> The Chinese (Simplified, /zh/) and Persian (right-to-left, /fa/) pages are translations of the English pages at the same English slugs (https://gsrlogistics.uz/en/pricing/ → https://gsrlogistics.uz/zh/pricing/ and https://gsrlogistics.uz/fa/pricing/), with the same facts and figures, so their ${announced.zh} and ${announced.fa} pages are NOT repeated below either; each English page names its translations on its own "Chinese:" and "Persian:" lines.\n`;
for (const [l, name] of [['uz', 'Oʻzbekcha'], ['ru', 'Русский'], ['en', 'English']]) {
  out += `\n\n# ===== ${name} (${l}) =====\n`;
  for (const p of groups[l].sort((a, b) => a.url.localeCompare(b.url))) {
    const twins = l === 'uz' && p.uzc ? `Uzbek Cyrillic: ${p.uzc}\n` : l === 'en' ? `${p.zh ? `Chinese: ${p.zh}\n` : ''}${p.fa ? `Persian: ${p.fa}\n` : ''}` : '';
    out += `\n\n---\nURL: ${p.url}\n${twins}Title: ${p.title}\nDescription: ${p.desc}\n${p.body}\n`;
  }
}
fs.writeFileSync(path.join(dist, 'llms-full.txt'), out);
const written = groups.uz.length + groups.ru.length + groups.en.length;
console.log(`llms-full.txt: ${written} pages, ${(out.length / 1024).toFixed(0)} KB (+${cyrillic} Cyrillic, ${announced.zh} Chinese and ${announced.fa} Persian pages announced, not duplicated)`);
