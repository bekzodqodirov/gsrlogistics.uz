/**
 * Post-build audit of the four-locale URL surface. Fails the build.
 *
 * Usage: node scripts/check-kirill.mjs [dist]
 *
 * The Cyrillic locale makes one class of mistake easy and expensive: the same page reachable under
 * three different spellings of one URL. `/kirill/нархлар/` can be written raw (UTF-8 in the path),
 * percent-encoded (`/kirill/%D0%BD…/`), or — if anything lowercases the escapes — `%d0%bd…`, and a
 * crawler treats all three as different URLs. So the encoding is decided ONCE and asserted here:
 *
 *   THE ONE FORM   — percent-encoded UTF-8, uppercase hex: `encodeURI(decodeURIComponent(u))`,
 *                    exactly what `new URL()` and every browser produce (RFC 3986 §2.1). Every URL
 *                    in the build is checked against it, and two URLs are the same URL only when
 *                    their one form is byte-identical.
 *   ABSOLUTE URLS  — canonical, hreflang, og:url, <loc> in the sitemap — are EMITTED in that form
 *                    already, by `pageUrl()` in src/i18n/routes.ts. A crawler compares them as
 *                    strings, so they must not merely be equivalent; they must match byte for byte.
 *   PAGE HREFS     — the links inside the document may be written raw (`/kirill/нархлар/`, what
 *                    `pagePath()` returns and what keeps the keyword visible in the markup) or
 *                    already escaped — the markdown pipeline normalises every link destination in
 *                    an article body, so guide pages carry the escaped spelling and nothing can
 *                    stop it. Both are the same URL: the browser sends the escaped bytes either
 *                    way. What is checked is that each one normalises to the ONE form of a page
 *                    that exists, and that that page's canonical is that same string.
 *   ON DISK        — the directory name is raw UTF-8, the percent-decoding of the one form.
 *
 * Checked here, over every built page and not a sample:
 *   1. canonical — exactly one, absolute, points at the page's own path on disk
 *   2. hreflang  — all four locales plus x-default on every page, no duplicates
 *   3. reciprocal — every alternate exists in dist AND names this page back, with this page's own
 *      hreflang code. A one-way alternate is ignored by Google, silently.
 *   4. x-default  — the Uzbek Latin URL, on every page
 *   5. encoding   — every absolute URL is already in its canonical percent-encoded form, and the
 *      raw path it decodes to is the file that exists
 *   6. internal links — every site-relative href on a /kirill/ page resolves to a built file, and
 *      the Cyrillic pages link into the Cyrillic tree (the language switcher excepted)
 *   7. sitemap   — one <loc> per indexable page, byte-identical to that page's canonical, carrying
 *      the same alternates
 *   8. llms.txt / llms-full.txt — the locale is announced, every /kirill/ URL they name exists, and
 *      the Cyrillic pages are NOT dumped a second time into llms-full.txt
 *   9. 404.html — carries the copy and the home link of all four locales, and its Cyrillic copy is
 *      actually transliterated, not a copy of the Latin one
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = process.argv[2] || 'dist';
const SITE = 'https://gsrlogistics.uz';
/** hreflang code → path prefix. `langMeta` in src/i18n/config.ts is the source of these. */
const LOCALES = { 'uz-Latn': '', ru: '/ru', en: '/en', 'uz-Cyrl': '/kirill' };
const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'index.html' ? [path.join(d, e.name)] : []));

/** The site path a built index.html answers on, raw UTF-8, with the trailing slash. */
const pathOf = (file) => {
  const rel = path.relative(dist, path.dirname(file)).split(path.sep).filter((s) => s && s !== '.');
  // NFC, because the comparison is against a path decoded from a URL, and the two must agree on
  // one normalisation of `ў`/`қ`/`ҳ` — a filesystem is free to hand back the other one.
  return `/${rel.join('/')}${rel.length ? '/' : ''}`.normalize('NFC');
};
const localeOf = (p) => (p.startsWith('/kirill/') || p === '/kirill/' ? 'uz-Cyrl' : p.startsWith('/ru/') ? 'ru' : p.startsWith('/en/') ? 'en' : 'uz-Latn');

/** The one form of an absolute URL: percent-encoded UTF-8, uppercase hex, as `new URL()` writes it. */
const canonicalForm = (url) => new URL(url).toString();
/** The one form of a site path, whether it was written raw or already escaped. */
const onePath = (p) => encodeURI(decodeURIComponent(p));

const pages = new Map(); // site path (raw) → page record
for (const file of walk(dist)) {
  const html = fs.readFileSync(file, 'utf8');
  const p = pathOf(file);
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
  const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ lang: m[1], href: m[2] }));
  pages.set(p, {
    file: path.relative(dist, file),
    sitePath: p,
    locale: localeOf(p),
    noindex: /name="robots" content="noindex/i.test(html),
    canonicals,
    alts,
    hrefs: [...html.matchAll(/\shref="(\/[^"#?]*)(?:[#?][^"]*)?"/g)].map((m) => m[1]),
    ogUrl: (html.match(/<meta property="og:url" content="([^"]+)"/) || [])[1],
  });
}

/* ── 1–5: canonical, hreflang, reciprocity, x-default, encoding ───────────────────────────── */

const indexable = [...pages.values()].filter((pg) => !pg.noindex);
let altCount = 0;
for (const pg of indexable) {
  if (pg.canonicals.length !== 1) { err(pg.file, `${pg.canonicals.length} canonical tags, expected 1`); continue; }
  const canonical = pg.canonicals[0];

  // 5. encoding — the absolute URL is already in canonical form, and decodes to this file's path.
  if (canonical !== canonicalForm(canonical)) err(pg.file, `canonical is not in canonical percent-encoded form: ${canonical} ≠ ${canonicalForm(canonical)}`);
  const canonPath = decodeURIComponent(new URL(canonical).pathname).normalize('NFC');
  // 1. canonical points at itself.
  if (canonPath !== pg.sitePath) err(pg.file, `canonical says ${canonPath}, page is at ${pg.sitePath}`);
  if (!canonical.startsWith(SITE)) err(pg.file, `canonical is not absolute on ${SITE}: ${canonical}`);
  if (pg.ogUrl && pg.ogUrl !== canonical) err(pg.file, `og:url ${pg.ogUrl} ≠ canonical ${canonical}`);

  // 2. hreflang: four locales, no duplicates, plus x-default.
  const byLang = new Map();
  for (const a of pg.alts) {
    if (a.lang === 'x-default') continue;
    if (byLang.has(a.lang)) err(pg.file, `duplicate hreflang ${a.lang}`);
    byLang.set(a.lang, a.href);
  }
  for (const code of Object.keys(LOCALES)) if (!byLang.has(code)) err(pg.file, `missing hreflang ${code}`);
  for (const code of byLang.keys()) if (!(code in LOCALES)) err(pg.file, `unexpected hreflang ${code}`);

  // 4. x-default is the Uzbek Latin URL.
  const xd = pg.alts.filter((a) => a.lang === 'x-default');
  if (xd.length !== 1) err(pg.file, `${xd.length} x-default links, expected 1`);
  else if (xd[0].href !== byLang.get('uz-Latn')) err(pg.file, `x-default ${xd[0].href} ≠ uz-Latn ${byLang.get('uz-Latn')}`);

  // The page's own hreflang entry must be its canonical, byte for byte.
  if (byLang.get(pg.locale) !== canonical) err(pg.file, `self hreflang ${pg.locale} = ${byLang.get(pg.locale)} ≠ canonical ${canonical}`);

  // 3. reciprocity — the target exists and names this page back under this page's own code.
  for (const [code, href] of byLang) {
    altCount += 1;
    if (href !== canonicalForm(href)) err(pg.file, `hreflang ${code} is not in canonical percent-encoded form: ${href}`);
    const target = decodeURIComponent(new URL(href).pathname).normalize('NFC');
    if (!target.startsWith(LOCALES[code] + '/') && !(LOCALES[code] === '' && target.startsWith('/'))) err(pg.file, `hreflang ${code} points outside its locale: ${target}`);
    const other = pages.get(target);
    if (!other) { err(pg.file, `hreflang ${code} → ${target} — no such page in ${dist}`); continue; }
    const back = other.alts.find((a) => a.lang === pg.locale);
    if (!back) err(pg.file, `hreflang ${code} → ${target} does not link back (no ${pg.locale} alternate there)`);
    else if (back.href !== canonical) err(pg.file, `hreflang ${code} → ${target} links back to ${back.href}, not to ${canonical}`);
  }
}

/* ── 6: internal links ────────────────────────────────────────────────────────────────────── */

const assetish = (p) => /\.(png|jpe?g|svg|webp|ico|txt|xml|json|webmanifest|woff2?|css|js|pdf)$/i.test(p) || p.startsWith('/_astro/') || p.startsWith('/api/');
const switcherTargets = new Set(indexable.flatMap((pg) => pg.alts.map((a) => decodeURIComponent(new URL(a.href).pathname).normalize('NFC'))));
let kirillLinks = 0;
let escapedLinks = 0;
for (const pg of pages.values()) {
  for (const href of new Set(pg.hrefs)) {
    if (assetish(href)) continue;
    let raw;
    try { raw = decodeURIComponent(href.endsWith('/') ? href : `${href}/`).normalize('NFC'); } catch { err(pg.file, `internal link ${href} is not valid percent-encoding`); continue; }
    const target = pages.get(raw);
    if (!target) { err(pg.file, `internal link ${href} → no such page in ${dist}`); continue; }
    if (href !== decodeURIComponent(href)) escapedLinks += 1;
    // The link, the target page's canonical and the file on disk must be one URL, not three.
    const want = new URL(onePath(raw), SITE).toString();
    if (target.canonicals[0] && target.canonicals[0] !== want) err(pg.file, `internal link ${href} normalises to ${want}, but that page's canonical is ${target.canonicals[0]}`);
    if (pg.locale === 'uz-Cyrl') {
      kirillLinks += 1;
      // A Cyrillic page may only leave its tree through the language switcher, whose targets are
      // exactly this page's own alternates.
      if (localeOf(raw) !== 'uz-Cyrl' && !switcherTargets.has(raw)) err(pg.file, `Cyrillic page links out of /kirill/ to ${href}`);
    }
  }
}

/* ── 7: sitemap ───────────────────────────────────────────────────────────────────────────── */

const sitemapFile = path.join(dist, 'sitemap-0.xml');
if (!fs.existsSync(sitemapFile)) errors.push('sitemap-0.xml: missing');
else {
  const xml = fs.readFileSync(sitemapFile, 'utf8');
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1],
    alts: [...m[1].matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((a) => ({ lang: a[1], href: a[2] })),
  }));
  const locs = new Set(urls.map((u) => u.loc));
  if (locs.size !== urls.length) errors.push('sitemap-0.xml: duplicate <loc> entries');
  for (const pg of indexable) {
    const canonical = pg.canonicals[0];
    if (!locs.has(canonical)) errors.push(`sitemap-0.xml: no <loc> for ${canonical}`);
  }
  for (const u of urls) {
    if (!u.loc) { errors.push('sitemap-0.xml: <url> without <loc>'); continue; }
    if (u.loc !== canonicalForm(u.loc)) errors.push(`sitemap-0.xml: <loc> not in canonical percent-encoded form: ${u.loc}`);
    const pg = pages.get(decodeURIComponent(new URL(u.loc).pathname).normalize('NFC'));
    if (!pg) { errors.push(`sitemap-0.xml: <loc> ${u.loc} has no page in ${dist}`); continue; }
    if (pg.noindex) errors.push(`sitemap-0.xml: <loc> ${u.loc} is noindex`);
    const want = pg.alts.filter((a) => a.lang !== 'x-default').map((a) => `${a.lang} ${a.href}`).sort().join('|');
    const got = u.alts.filter((a) => a.lang !== 'x-default').map((a) => `${a.lang} ${a.href}`).sort().join('|');
    if (want !== got) errors.push(`sitemap-0.xml: alternates for ${u.loc} differ from the page's own`);
  }
}

/* ── 8: llms.txt names the locale and every URL it names exists ───────────────────────────── */

const llms = path.join(dist, 'llms.txt');
if (!fs.existsSync(llms)) errors.push('llms.txt: missing');
else {
  const txt = fs.readFileSync(llms, 'utf8');
  if (!/\/kirill\//.test(txt)) errors.push('llms.txt: does not mention the /kirill/ locale');
  for (const m of txt.matchAll(/https:\/\/gsrlogistics\.uz(\/kirill\/[^)\s]*)/g)) {
    let target;
    try { target = decodeURIComponent(m[1]).normalize('NFC'); } catch { errors.push(`llms.txt: ${m[1]} is not valid percent-encoding`); continue; }
    if (!pages.has(target)) errors.push(`llms.txt: ${m[1]} → no such page in ${dist}`);
  }
}
const full = path.join(dist, 'llms-full.txt');
if (fs.existsSync(full)) {
  const txt = fs.readFileSync(full, 'utf8');
  if (!/uz-Cyrl|kirill/.test(txt.slice(0, 2000))) errors.push('llms-full.txt: its header does not announce the Cyrillic locale');
  // The Cyrillic pages must not be dumped a second time: their own URLs never head a page block.
  const dumped = [...txt.matchAll(/^URL: \S*\/kirill\//gm)].length;
  if (dumped) errors.push(`llms-full.txt: ${dumped} Cyrillic pages dumped in full — they are the Uzbek text transliterated, announce them instead`);
}

/* ── 9: the 404 answers in every locale ───────────────────────────────────────────────────── */

// 404.html is rendered once, in Uzbek Latin, and an inline script swaps the block when the URL sits
// under another locale's prefix — so the only place the other three locales exist is the `data-nf`
// payload. A missing locale there is a 404 page that silently answers in the wrong language.
const nfFile = path.join(dist, '404.html');
if (!fs.existsSync(nfFile)) errors.push('404.html: missing');
else {
  const html = fs.readFileSync(nfFile, 'utf8');
  const raw = (html.match(/data-nf="([^"]*)"/) || [])[1];
  if (!raw) errors.push('404.html: no data-nf payload — the script cannot switch locale');
  else {
    let nf;
    try { nf = JSON.parse(raw.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'")); } catch { errors.push('404.html: data-nf is not valid JSON'); }
    if (nf) {
      for (const [locale, prefix] of [['uz', '/'], ['ru', '/ru/'], ['en', '/en/'], ['uzc', '/kirill/']]) {
        const entry = nf[locale];
        if (!entry) { errors.push(`404.html: no ${locale} copy in data-nf`); continue; }
        if (entry.homeHref !== prefix) errors.push(`404.html: ${locale} home link is ${entry.homeHref}, expected ${prefix}`);
        if (!pages.has(entry.homeHref)) errors.push(`404.html: ${locale} home link ${entry.homeHref} → no such page in ${dist}`);
        for (const k of ['title', 'text', 'home', 'tg']) if (!entry[k]) errors.push(`404.html: ${locale} copy has no ${k}`);
      }
      if (nf.uzc && nf.uzc.title === nf.uz.title) errors.push('404.html: the Cyrillic copy is byte-identical to the Latin one — it was not transliterated');
      if (!/\/kirill/.test(html)) errors.push('404.html: its script never tests for the /kirill/ prefix');
    }
  }
}

/* ── Report ───────────────────────────────────────────────────────────────────────────────── */

const byLocale = (code) => indexable.filter((pg) => pg.locale === code).length;
if (errors.length) {
  console.error(`check-kirill: ${errors.length} problem(s)\n  ` + errors.slice(0, 40).join('\n  '));
  if (errors.length > 40) console.error(`  … and ${errors.length - 40} more`);
  process.exit(1);
}
console.log(
  `check-kirill: ${indexable.length} indexable pages ` +
    `(uz ${byLocale('uz-Latn')} · ru ${byLocale('ru')} · en ${byLocale('en')} · uzc ${byLocale('uz-Cyrl')}) · ` +
    `${altCount} hreflang links, all reciprocal · ${kirillLinks} Cyrillic internal links resolve ` +
    `(${escapedLinks} written escaped by the markdown pipeline, all normalising to the same URL)`,
);
