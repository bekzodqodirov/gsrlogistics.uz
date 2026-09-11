/**
 * Post-build SEO audit of the four-locale surface. Fails the build.
 *
 * Usage: node scripts/test-seo.mjs [dist]
 *
 * This is the SECOND half of the post-build URL audit, and it deliberately checks nothing that
 * `scripts/check-kirill.mjs` already checks. That script owns the URL surface — canonical,
 * hreflang reciprocity, x-default, percent-encoding, the sitemap, internal links. This one owns
 * what a crawler reads ONCE it has the page: the declared language, the structured data, and the
 * two strings Google actually prints in a result.
 *
 * ── Why a Cyrillic locale needs its own pass over these ───────────────────────────────────────
 *
 * The /kirill/ pages are the Uzbek pages transliterated. Everything that makes them a SEPARATE
 * result rather than a duplicate of the Latin page is a declaration, and every one of those
 * declarations is generated, not written:
 *
 *   · `<html lang>` and `og:locale` come from `langMeta`, and `inLanguage` from `src/lib/schema.ts`.
 *     If any of them says `uz-Latn` on a Cyrillic page, the page contradicts its own hreflang and
 *     Google is entitled to ignore the annotation and treat the two as one page.
 *   · Every absolute URL inside the JSON-LD — `WebPage.@id`, `Service.url`, the breadcrumb items —
 *     is composed from the SAME route helpers as the canonical. A `pick()` where an `itemUrl()`
 *     belonged makes a Cyrillic page describe itself with a Latin URL, which is the structured-data
 *     spelling of "canonicalise me to my twin". Nothing else in the build would notice.
 *   · `<title>` and `<meta name="description">` are cut to a budget in `src/components/Seo.astro`.
 *     The budget is in CHARACTERS, the SERP is in PIXELS, and Cyrillic is about 11% wider per
 *     character than Latin — so the Cyrillic titles are the ones that overflow first, and a cut
 *     that lands mid-word is the difference between a shortened title and a broken one.
 *
 * Checked here, over every built page and not a sample:
 *   1. one non-empty <title>, one <meta name="description">, exactly one <h1>
 *   2. no truncation MID-WORD — where the page also carries the untruncated string in its JSON-LD,
 *      the ellipsis is proved to sit on a word boundary
 *   3. <html lang> and og:locale match the locale the page is served from
 *   4. every application/ld+json block parses
 *   5. every JSON-LD `inLanguage` is this page's BCP-47 tag — uz-Latn / uz-Cyrl / ru / en
 *   6. no absolute gsrlogistics.uz URL anywhere in the JSON-LD leaves this page's own locale
 *   7. hreflang cluster parity — the four locales' pages form groups of exactly four, and every
 *      page is in its own group (the counting check that catches a whole locale losing a page)
 *   8. SERP width — reported for every locale, and failed only past a ceiling no title should
 *      ever reach, because the budget itself is a design decision and not this script's to make
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = process.argv[2] || 'dist';
const SITE = 'https://gsrlogistics.uz';

/** locale → the BCP-47 tag it must declare everywhere, and its og:locale. `langMeta` is the source. */
const LOCALES = {
  uz: { prefix: '', htmlLang: 'uz-Latn', ogLocale: 'uz_UZ' },
  ru: { prefix: '/ru', htmlLang: 'ru', ogLocale: 'ru_RU' },
  en: { prefix: '/en', htmlLang: 'en', ogLocale: 'en_US' },
  uzc: { prefix: '/kirill', htmlLang: 'uz-Cyrl', ogLocale: 'uz_Cyrl_UZ' },
};

/**
 * Arial advance widths in em, measured once in Chromium and grouped by width.
 *
 * Google renders a desktop title link in ~20px Arial and a snippet in ~14px Arial, and cuts on
 * PIXELS, not characters — which is the whole reason this table exists rather than a `.length`.
 * Only the 151 characters the built titles and descriptions actually use are listed; anything
 * else falls back to 0.55em, close to the average. Reconstruction agrees with a live
 * `getBoundingClientRect()` to within 0.5% on the longest titles in all four locales, which is
 * far inside the ±20px of slop in Google's own cut-off.
 */
const WIDTH_GROUPS = {
  0.206: '’',
  0.222: 'ijlʻʼ',
  0.262: 'f',
  0.278: ' ,./:;It',
  0.333: '()-r³',
  0.365: 'гғ',
  0.438: 'кқ',
  0.448: 'з',
  0.458: 'т',
  0.489: '1',
  0.5: 'cksvxyzсухўҳ',
  0.51: 'э',
  0.521: 'чь',
  0.531: 'в',
  0.542: 'Гпя',
  0.549: '÷',
  0.552: 'н',
  0.556: '$023456789?L_abdeghnopqu«»аеорё–',
  0.559: 'ий',
  0.573: 'бц',
  0.583: 'КдлҚ',
  0.584: '+',
  0.604: 'З',
  0.611: 'FTZТ',
  0.625: 'ъ',
  0.635: 'ЎУ',
  0.656: 'Б',
  0.667: 'ABEKPSVXYАВРХҲ',
  0.669: 'ж',
  0.677: 'Д',
  0.688: 'м',
  0.719: 'ИПЭы',
  0.722: 'CDHNRUwНСЯ',
  0.74: 'Ц',
  0.75: 'ю',
  0.76: 'Ф',
  0.778: 'GOQО',
  0.802: 'ш',
  0.823: 'фщ',
  0.833: 'MmМ',
  0.889: '%',
  0.917: 'Ш',
  0.923: 'Ж',
  0.944: 'W',
  1: '—…→',
  1.01: 'Ю',
  1.015: '@',
};
const EM = new Map();
for (const [w, chars] of Object.entries(WIDTH_GROUPS)) for (const c of chars) EM.set(c, Number(w));
const serpPx = (text, size) => {
  let em = 0;
  for (const c of text) em += EM.get(c) ?? 0.55;
  return em * size;
};
/** Where Google's desktop title link runs out of room, and the ceiling this script will fail. */
const TITLE_PX = 580;
const TITLE_PX_HARD = 700;
/** Two lines of desktop snippet. */
const DESC_PX = 920;
const DESC_PX_HARD = 1200;

const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'index.html' ? [path.join(d, e.name)] : []));
const pathOf = (file) => {
  const rel = path.relative(dist, path.dirname(file)).split(path.sep).filter((s) => s && s !== '.');
  return `/${rel.join('/')}${rel.length ? '/' : ''}`.normalize('NFC');
};
const localeOf = (p) => (p.startsWith('/kirill/') ? 'uzc' : p.startsWith('/ru/') ? 'ru' : p.startsWith('/en/') ? 'en' : 'uz');
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const decodePath = (u) => { try { return decodeURIComponent(new URL(u).pathname).normalize('NFC'); } catch { return null; } };
/** A character that can sit inside a word — so a cut BETWEEN two of them is a cut mid-word. */
const wordish = (c) => Boolean(c) && (/[\p{L}\p{N}]/u.test(c) || c === 'ʻ' || c === 'ʼ' || c === '’');

const pages = [];
for (const file of walk(dist)) {
  const html = fs.readFileSync(file, 'utf8');
  const p = pathOf(file);
  const one = (re) => { const m = html.match(re); return m ? unesc(m[1]) : undefined; };
  pages.push({
    file: path.relative(dist, file),
    sitePath: p,
    locale: localeOf(p),
    noindex: /name="robots" content="noindex/i.test(html),
    htmlLang: one(/<html lang="([^"]+)"/),
    ogLocale: one(/<meta property="og:locale" content="([^"]*)"/),
    titles: [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => unesc(m[1])),
    descs: [...html.matchAll(/<meta name="description" content="([^"]*)"/g)].map((m) => unesc(m[1])),
    h1s: [...html.matchAll(/<h1[\s>]/g)].length,
    alts: [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ lang: m[1], href: m[2] })),
    ld: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => unesc(m[1])),
  });
}
if (!pages.length) { console.error(`test-seo: no pages found in ${dist} — build first`); process.exit(1); }

/* ── 1–3: the two strings Google prints, and the language the page declares ───────────────── */

const widths = { uz: [], ru: [], en: [], uzc: [] };
for (const pg of pages) {
  const meta = LOCALES[pg.locale];
  if (pg.htmlLang !== meta.htmlLang) err(pg.file, `<html lang="${pg.htmlLang}"> — a ${pg.locale} page must declare ${meta.htmlLang}`);
  if (pg.ogLocale !== meta.ogLocale) err(pg.file, `og:locale ${pg.ogLocale} — a ${pg.locale} page must declare ${meta.ogLocale}`);

  if (pg.titles.length !== 1) err(pg.file, `${pg.titles.length} <title> tags, expected 1`);
  if (pg.descs.length !== 1) err(pg.file, `${pg.descs.length} meta descriptions, expected 1`);
  if (pg.h1s !== 1) err(pg.file, `${pg.h1s} <h1>, expected 1`);
  const title = pg.titles[0] ?? '';
  const desc = pg.descs[0] ?? '';
  if (!title.trim()) err(pg.file, 'empty <title>');
  if (!desc.trim()) err(pg.file, 'empty meta description');
  if (!pg.noindex) widths[pg.locale].push({ file: pg.file, t: serpPx(title, 20), d: serpPx(desc, 14), title });
  if (serpPx(title, 20) > TITLE_PX_HARD) err(pg.file, `<title> is ${serpPx(title, 20).toFixed(0)}px in a SERP (ceiling ${TITLE_PX_HARD}px): ${title}`);
  if (serpPx(desc, 14) > DESC_PX_HARD) err(pg.file, `meta description is ${serpPx(desc, 14).toFixed(0)}px in a SERP (ceiling ${DESC_PX_HARD}px)`);
}

/* ── 4–6: structured data ─────────────────────────────────────────────────────────────────── */

let ldNodes = 0;
let inLangNodes = 0;
for (const pg of pages) {
  const want = LOCALES[pg.locale].htmlLang;
  if (!pg.ld.length) { err(pg.file, 'no application/ld+json block'); continue; }
  for (const raw of pg.ld) {
    let parsed;
    try { parsed = JSON.parse(raw); } catch (e) { err(pg.file, `JSON-LD does not parse: ${e.message}`); continue; }

    // 5. inLanguage, on every node at any depth that declares one.
    const nodes = [];
    (function collect(v) {
      if (Array.isArray(v)) return v.forEach(collect);
      if (v && typeof v === 'object') { nodes.push(v); Object.values(v).forEach(collect); }
    })(parsed['@graph'] ?? parsed);
    ldNodes += nodes.length;
    for (const n of nodes) {
      if (!('inLanguage' in n)) continue;
      inLangNodes += 1;
      const t = Array.isArray(n['@type']) ? n['@type'].join('+') : n['@type'];
      if (n.inLanguage !== want) err(pg.file, `${t}.inLanguage is "${n.inLanguage}", a ${pg.locale} page must say "${want}"`);
    }

    // 6. Every absolute site URL in the JSON-LD belongs to THIS page's locale. A Latin URL on a
    //    Cyrillic page is the structured-data way of pointing a crawler at the twin.
    for (const m of JSON.stringify(parsed).matchAll(/"(https:\/\/gsrlogistics\.uz\/[^"\\]*)"/g)) {
      const target = decodePath(m[1].split('#')[0]);
      if (target === null) { err(pg.file, `JSON-LD URL is not valid percent-encoding: ${m[1]}`); continue; }
      if (/\.[a-z0-9]{2,5}$/i.test(target) || target === '/') continue; // assets, and the bare origin
      if (localeOf(target) !== pg.locale) err(pg.file, `JSON-LD names ${target} (${localeOf(target)}) on a ${pg.locale} page`);
    }
  }
}

/* ── 2: the ellipsis sits on a word boundary ──────────────────────────────────────────────── */

// `Seo.astro` cuts the title and the description to a budget; the JSON-LD keeps the untruncated
// string, so where both exist the cut can be PROVED to land between words rather than inside one.
let proved = 0;
for (const pg of pages) {
  let full;
  for (const raw of pg.ld) {
    let parsed; try { parsed = JSON.parse(raw); } catch { continue; }
    for (const n of parsed['@graph'] ?? [parsed]) {
      if (/Page$|^Article$/.test(Array.isArray(n['@type']) ? '' : String(n['@type'])) && n.name) { full ??= { name: n.name, description: n.description }; }
    }
  }
  if (!full) continue;
  for (const [what, cut, whole] of [['<title>', pg.titles[0], full.name], ['meta description', pg.descs[0], full.description]]) {
    if (!cut || !whole || !cut.endsWith('…')) continue;
    const stem = cut.slice(0, -1);
    if (!whole.startsWith(stem)) continue; // the title also gets a brand appended; not comparable
    proved += 1;
    if (wordish(stem.at(-1)) && wordish(whole[stem.length])) err(pg.file, `${what} is cut MID-WORD: …${stem.slice(-28)}| ${whole.slice(stem.length, stem.length + 14)}…`);
  }
}

/* ── 7: hreflang cluster parity ───────────────────────────────────────────────────────────── */

const clusters = new Map();
const indexable = pages.filter((pg) => !pg.noindex);
for (const pg of indexable) {
  const key = pg.alts.filter((a) => a.lang !== 'x-default').map((a) => a.href).sort().join('|');
  if (!clusters.has(key)) clusters.set(key, []);
  clusters.get(key).push(pg);
}
for (const [key, group] of clusters) {
  const hrefs = key ? key.split('|') : [];
  if (hrefs.length !== 4) errors.push(`hreflang cluster with ${hrefs.length} alternates, expected 4: ${group.map((g) => g.file).join(', ')}`);
  if (group.length !== 4) errors.push(`hreflang cluster shared by ${group.length} pages, expected 4 (one per locale): ${group.map((g) => g.file).join(', ')}`);
  const seen = new Set(group.map((g) => g.locale));
  for (const l of Object.keys(LOCALES)) if (!seen.has(l)) errors.push(`hreflang cluster has no ${l} page: ${group.map((g) => g.file).join(', ')}`);
  for (const pg of group) {
    const self = new URL(pg.sitePath, SITE).toString();
    if (!hrefs.includes(self)) err(pg.file, `not listed in its own hreflang cluster (expected ${self})`);
  }
}

/* ── Report ───────────────────────────────────────────────────────────────────────────────── */

const row = (l) => {
  const w = widths[l];
  const over = (arr, lim) => arr.filter((x) => x > lim).length;
  const t = w.map((x) => x.t);
  const d = w.map((x) => x.d);
  const avg = (a) => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(0);
  return `  ${l.padEnd(4)} title ${avg(t)}px avg, ${Math.max(...t).toFixed(0)}px max, ${String(over(t, TITLE_PX)).padStart(2)}/${w.length} over ${TITLE_PX}px  ·  description ${avg(d)}px avg, ${over(d, DESC_PX)}/${w.length} over ${DESC_PX}px`;
};
console.log('test-seo: SERP width (Arial, title 20px / snippet 14px — Google cuts on pixels, not characters)');
for (const l of Object.keys(LOCALES)) console.log(row(l));

if (errors.length) {
  console.error(`\ntest-seo: ${errors.length} problem(s)\n  ` + errors.slice(0, 40).join('\n  '));
  if (errors.length > 40) console.error(`  … and ${errors.length - 40} more`);
  process.exit(1);
}
console.log(
  `test-seo: ${pages.length} pages · ${ldNodes} JSON-LD nodes parse, ${inLangNodes} declare inLanguage and all match their locale · ` +
    `${clusters.size} hreflang clusters of 4 · ${proved} truncations proved to fall on a word boundary`,
);
