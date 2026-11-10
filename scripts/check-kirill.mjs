/**
 * Post-build audit of the six-locale URL surface (uz-Latn, ru, en, uz-Cyrl, zh-Hans, fa). Fails the
 * build. The file keeps its historical name: the Cyrillic locale is where these checks started.
 *
 * Usage: node scripts/check-kirill.mjs [dist]
 *
 * The locales, their prefixes and hreflang tags come from scripts/locales.mjs, the one table every
 * script shares. A locale that is still PENDING there (src/i18n/config.ts `PendingLang`) may lack a
 * page that has not been translated yet — a zh/fa guide — and that is counted, not failed. Every
 * other rule holds for every locale from day one.
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
 *   2. hreflang  — all six locales plus x-default on every page, no duplicates, no unknown tag. A
 *      pending locale may be missing only where its page does not exist at all.
 *   3. reciprocal — every alternate exists in dist, lies inside its own locale's tree, AND names this
 *      page back, with this page's own hreflang code. A one-way alternate is ignored by Google,
 *      silently.
 *   4. x-default  — the Uzbek Latin URL, on every page
 *   5. encoding   — every absolute URL is already in its canonical percent-encoded form, and the
 *      raw path it decodes to is the file that exists
 *   5b. English slugs — the zh-Hans and fa alternates are the en alternate with /zh or /fa in
 *      place of /en, character for character (zh and fa publish the English slugs)
 *   6. internal links — every site-relative href resolves to a built file, and a page links out of
 *      its own locale's tree only to its OWN alternates (the language switcher). A translated
 *      guide that kept an /en/… link from the article it was translated from fails here.
 *   7. sitemap   — one <loc> per indexable page, byte-identical to that page's canonical, carrying
 *      the same alternates
 *   8. llms.txt / llms-full.txt — every locale is announced, every gsrlogistics.uz URL they name
 *      exists, and the Cyrillic, Chinese and Persian pages are NOT dumped into llms-full.txt (they
 *      are translations of a section that is; each one is named on its source page's block)
 *   9. 404.html — carries the copy, the home link and the text direction of all six locales, its
 *      script recognises every prefix, its Cyrillic copy is actually transliterated, and the zh/fa
 *      copy is not the English fallback (counted, not failed, while the locale is pending)
 */
import fs from 'node:fs';
import path from 'node:path';
import { LOCALES as TABLE, LOCALE_CODES, CODE_BY_HREFLANG, isPending, localeOfPath, homePath, unprefixed } from './locales.mjs';

const dist = process.argv[2] || 'dist';
const SITE = 'https://gsrlogistics.uz';
/** hreflang code → path prefix, from the shared table (`langMeta` in src/i18n/config.ts is the source). */
const LOCALES = Object.fromEntries(Object.values(TABLE).map((l) => [l.htmlLang, l.prefix]));
const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
/** Pending-locale gaps: hreflang code → number of pages that lack that alternate. */
const pendingMissing = {};
/** Pending-locale gaps: locale code → links to a page of that locale that is not written yet. */
const pendingLinks = {};
const pendingNotes = [];

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'index.html' ? [path.join(d, e.name)] : []));

/** The site path a built index.html answers on, raw UTF-8, with the trailing slash. */
const pathOf = (file) => {
  const rel = path.relative(dist, path.dirname(file)).split(path.sep).filter((s) => s && s !== '.');
  // NFC, because the comparison is against a path decoded from a URL, and the two must agree on
  // one normalisation of `ў`/`қ`/`ҳ` — a filesystem is free to hand back the other one.
  return `/${rel.join('/')}${rel.length ? '/' : ''}`.normalize('NFC');
};
/** The hreflang code of the locale a site path belongs to. */
const localeOf = (p) => TABLE[localeOfPath(p)].htmlLang;
const decodedPath = (href) => decodeURIComponent(new URL(href).pathname).normalize('NFC');

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

  // 2. hreflang: six locales, no duplicates, plus x-default.
  const byLang = new Map();
  for (const a of pg.alts) {
    if (a.lang === 'x-default') continue;
    if (byLang.has(a.lang)) err(pg.file, `duplicate hreflang ${a.lang}`);
    byLang.set(a.lang, a.href);
  }
  for (const code of Object.keys(LOCALES)) {
    if (byLang.has(code)) continue;
    // A pending locale (zh/fa) may lack the page — a guide nobody has translated yet — but never
    // when the page is THERE: zh and fa publish the English slugs, so the page this one should
    // name is the en alternate with the prefix swapped.
    const en = byLang.get('en');
    const expected = en && TABLE[CODE_BY_HREFLANG[code]].prefix + unprefixed(decodedPath(en), 'en');
    if (isPending(CODE_BY_HREFLANG[code]) && !(expected && pages.has(expected))) pendingMissing[code] = (pendingMissing[code] ?? 0) + 1;
    else err(pg.file, `missing hreflang ${code}${expected && pages.has(expected) ? ` — ${expected} exists` : ''}`);
  }
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
    const target = decodedPath(href);
    // By the locale the path RESOLVES to, not by a prefix test: the Uzbek Latin prefix is '', which
    // a startsWith() test lets every path through, /zh/ and /ru/ included.
    if (code in LOCALES && localeOf(target) !== code) err(pg.file, `hreflang ${code} points outside its locale: ${target}`);
    const other = pages.get(target);
    if (!other) { err(pg.file, `hreflang ${code} → ${target} — no such page in ${dist}`); continue; }
    const back = other.alts.find((a) => a.lang === pg.locale);
    if (!back) err(pg.file, `hreflang ${code} → ${target} does not link back (no ${pg.locale} alternate there)`);
    else if (back.href !== canonical) err(pg.file, `hreflang ${code} → ${target} links back to ${back.href}, not to ${canonical}`);
  }

  // 5b. zh and fa publish the English slugs: /zh/services/air-cargo/ is /en/services/air-cargo/
  //     with the prefix swapped. A translated slug, or a slug map that forgot zh/fa, would still
  //     produce a valid-looking URL — a different one, which nothing else would notice.
  const en = byLang.get('en');
  for (const code of ['zh', 'fa']) {
    const href = byLang.get(TABLE[code].htmlLang);
    if (!en || !href) continue;
    const want = unprefixed(decodedPath(en), 'en');
    const got = unprefixed(decodedPath(href), code);
    if (got !== want) err(pg.file, `hreflang ${TABLE[code].htmlLang} is ${decodedPath(href)}, but zh/fa use the English slug: ${TABLE[code].prefix}${want}`);
  }
}

/* ── 6: internal links ────────────────────────────────────────────────────────────────────── */

const assetish = (p) => /\.(png|jpe?g|svg|webp|ico|txt|xml|json|webmanifest|woff2?|css|js|pdf)$/i.test(p) || p.startsWith('/_astro/') || p.startsWith('/api/');
let kirillLinks = 0;
let escapedLinks = 0;
const linksByLocale = {};
for (const pg of pages.values()) {
  // The only door out of a locale's tree is the language switcher, and its targets are exactly
  // this page's OWN alternates — not "some page's alternate somewhere on the site".
  const ownAlternates = new Set(pg.alts.map((a) => decodedPath(a.href)));
  const altLocales = new Set(pg.alts.map((a) => a.lang));
  for (const href of new Set(pg.hrefs)) {
    if (assetish(href)) continue;
    let raw;
    try { raw = decodeURIComponent(href.endsWith('/') ? href : `${href}/`).normalize('NFC'); } catch { err(pg.file, `internal link ${href} is not valid percent-encoding`); continue; }
    const target = pages.get(raw);
    if (!target) {
      // A page of a pending locale that is not written yet — a zh/fa guide that a zh/fa service
      // page already lists — is a gap to count, but only from a page of that same locale: any other
      // page has no business linking into that tree (the rule below), written or not. Anything else
      // is a dead link.
      const l = localeOfPath(raw);
      if (isPending(l) && localeOf(raw) === pg.locale && pages.has(TABLE.en.prefix + unprefixed(raw, l))) { pendingLinks[l] = (pendingLinks[l] ?? 0) + 1; continue; }
      err(pg.file, `internal link ${href} → no such page in ${dist}`);
      continue;
    }
    if (href !== decodeURIComponent(href)) escapedLinks += 1;
    // The link, the target page's canonical and the file on disk must be one URL, not three.
    const want = new URL(onePath(raw), SITE).toString();
    if (target.canonicals[0] && target.canonicals[0] !== want) err(pg.file, `internal link ${href} normalises to ${want}, but that page's canonical is ${target.canonicals[0]}`);
    linksByLocale[pg.locale] = (linksByLocale[pg.locale] ?? 0) + 1;
    if (pg.locale === 'uz-Cyrl') kirillLinks += 1;
    // …or, for a locale this page has no alternate in, that locale's home: the switcher's fallback.
    const switcherFallback = raw === homePath(localeOfPath(raw)) && !altLocales.has(localeOf(raw));
    if (localeOf(raw) !== pg.locale && !ownAlternates.has(raw) && !switcherFallback) {
      err(pg.file, pg.locale === 'uz-Cyrl'
        ? `Cyrillic page links out of /kirill/ to ${href}`
        : `${pg.locale} page links out of its locale to ${href} (${localeOf(raw)}), which is not one of its own alternates`);
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
let llmsUrls = 0;
if (!fs.existsSync(llms)) errors.push('llms.txt: missing');
else {
  const txt = fs.readFileSync(llms, 'utf8');
  for (const code of LOCALE_CODES) {
    if (!TABLE[code].prefix) continue;
    if (!txt.includes(`${TABLE[code].prefix}/`)) errors.push(`llms.txt: does not mention the ${TABLE[code].prefix}/ locale`);
  }
  // Every URL on the site it names, not only the Cyrillic ones: a model quotes these verbatim.
  for (const m of txt.matchAll(/https:\/\/gsrlogistics\.uz(\/[^)\s]*)/g)) {
    const written = m[1].replace(/[.,;:!?»”]+$/, '');
    let target;
    try { target = decodeURIComponent(written).normalize('NFC'); } catch { errors.push(`llms.txt: ${written} is not valid percent-encoding`); continue; }
    llmsUrls += 1;
    if (/\.[a-z0-9]{2,5}$/i.test(target)) { if (!fs.existsSync(path.join(dist, target))) errors.push(`llms.txt: ${written} → no such file in ${dist}`); }
    else if (!pages.has(target.endsWith('/') ? target : `${target}/`)) errors.push(`llms.txt: ${written} → no such page in ${dist}`);
  }
}
const full = path.join(dist, 'llms-full.txt');
if (fs.existsSync(full)) {
  const txt = fs.readFileSync(full, 'utf8');
  const head = txt.slice(0, 3000);
  if (!/uz-Cyrl|kirill/.test(head)) errors.push('llms-full.txt: its header does not announce the Cyrillic locale');
  if (!/zh-Hans/.test(head) || !/\/zh\//.test(head)) errors.push('llms-full.txt: its header does not announce the Chinese locale (zh-Hans, /zh/)');
  if (!/\(fa,/.test(head) || !/\/fa\//.test(head)) errors.push('llms-full.txt: its header does not announce the Persian locale (fa, /fa/)');
  // The Cyrillic pages must not be dumped a second time: their own URLs never head a page block.
  const dumped = [...txt.matchAll(/^URL: \S*\/kirill\//gm)].length;
  if (dumped) errors.push(`llms-full.txt: ${dumped} Cyrillic pages dumped in full — they are the Uzbek text transliterated, announce them instead`);
  // Nor the Chinese and Persian ones: they are the English pages translated, named on each English
  // page's block. A /zh/ page filed under "Oʻzbekcha" is the failure this replaces.
  for (const code of ['zh', 'fa']) {
    const n = [...txt.matchAll(new RegExp(`^URL: https://gsrlogistics\\.uz${TABLE[code].prefix}/`, 'gm'))].length;
    if (n) errors.push(`llms-full.txt: ${n} ${TABLE[code].name} pages dumped in full — announce them on the English blocks instead`);
  }
  // Every announced URL exists, and every English page that has a zh/fa alternate announces it.
  const announced = { zh: new Set(), fa: new Set() };
  for (const m of txt.matchAll(/^(Chinese|Persian): (\S+)$/gm)) {
    const code = m[1] === 'Chinese' ? 'zh' : 'fa';
    announced[code].add(m[2]);
    let target;
    try { target = decodedPath(m[2]); } catch { errors.push(`llms-full.txt: ${m[2]} is not a valid URL`); continue; }
    if (!pages.has(target)) errors.push(`llms-full.txt: ${m[1]} ${m[2]} → no such page in ${dist}`);
    else if (localeOf(target) !== TABLE[code].htmlLang) errors.push(`llms-full.txt: ${m[1]} ${m[2]} is not a ${TABLE[code].name} page`);
  }
  for (const pg of indexable) {
    if (pg.locale !== 'en') continue;
    for (const code of ['zh', 'fa']) {
      const alt = pg.alts.find((a) => a.lang === TABLE[code].htmlLang);
      if (alt && !announced[code].has(alt.href)) errors.push(`llms-full.txt: the block of ${pg.canonicals[0]} does not name its ${TABLE[code].name} page ${alt.href}`);
    }
  }
}

/* ── 9: the 404 answers in every locale ───────────────────────────────────────────────────── */

// 404.html is rendered once, in Uzbek Latin, and an inline script swaps the block when the URL sits
// under another locale's prefix — so the only place the other five locales exist is the `data-nf`
// payload. A missing locale there is a 404 page that silently answers in the wrong language, and a
// missing `dir` is a Persian 404 laid out left to right.
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
      for (const locale of LOCALE_CODES) {
        const prefix = homePath(locale);
        const entry = nf[locale];
        if (!entry) { errors.push(`404.html: no ${locale} copy in data-nf`); continue; }
        if (entry.homeHref !== prefix) errors.push(`404.html: ${locale} home link is ${entry.homeHref}, expected ${prefix}`);
        if (!pages.has(entry.homeHref)) errors.push(`404.html: ${locale} home link ${entry.homeHref} → no such page in ${dist}`);
        for (const k of ['title', 'text', 'home', 'tg']) if (!entry[k]) errors.push(`404.html: ${locale} copy has no ${k}`);
        if (entry.lang !== TABLE[locale].htmlLang) errors.push(`404.html: ${locale} copy declares lang ${entry.lang}, expected ${TABLE[locale].htmlLang}`);
        if (entry.dir !== TABLE[locale].dir) errors.push(`404.html: ${locale} copy declares dir ${entry.dir}, expected ${TABLE[locale].dir}`);
      }
      if (nf.uzc && nf.uzc.title === nf.uz.title) errors.push('404.html: the Cyrillic copy is byte-identical to the Latin one — it was not transliterated');
      if (!/\/kirill/.test(html)) errors.push('404.html: its script never tests for the /kirill/ prefix');
      for (const code of ['zh', 'fa']) {
        if (!html.includes(`'${TABLE[code].prefix}/'`)) errors.push(`404.html: its script never tests for the ${TABLE[code].prefix}/ prefix`);
        // pick() hands a pending locale the English branch; once the locale is finished, the same
        // title means somebody's branch is missing and the 404 answers in English.
        const fellBack = nf[code] && (nf[code].title === nf.uz?.title || nf[code].title === nf.en?.title);
        if (fellBack && isPending(code)) pendingNotes.push(`404.html: the ${code} copy is still the fallback text`);
        else if (fellBack) errors.push(`404.html: the ${code} copy is byte-identical to the uz or en one — the ${code} branch of common.notFound is missing`);
      }
      if (!/documentElement\.setAttribute\('dir'|documentElement\.dir\s*=/.test(html)) errors.push('404.html: its script never sets the document direction — a Persian 404 would render left to right');
    }
  }
}

/* ── Report ───────────────────────────────────────────────────────────────────────────────── */

const byLocale = (code) => indexable.filter((pg) => pg.locale === code).length;
const pendingReport = () => {
  const gaps = Object.entries(pendingMissing).map(([code, n]) => `${n} pages have no ${code} alternate yet (the page does not exist)`);
  const links = Object.entries(pendingLinks).map(([code, n]) => `${n} links point at ${TABLE[code].prefix}/ pages that are not written yet (their English twin exists)`);
  const lines = [...gaps, ...links, ...pendingNotes];
  if (lines.length) console.log(`check-kirill: pending locales (${LOCALE_CODES.filter(isPending).join(', ')}) — counted, not failed:\n  ` + lines.join('\n  '));
};
/** How many problems to print (CHECK_MAX=… shows more when a whole locale breaks at once). */
const SHOW = Number(process.env.CHECK_MAX ?? 40);
if (errors.length) {
  console.error(`check-kirill: ${errors.length} problem(s)\n  ` + errors.slice(0, SHOW).join('\n  '));
  if (errors.length > SHOW) console.error(`  … and ${errors.length - SHOW} more`);
  pendingReport();
  process.exit(1);
}
pendingReport();
console.log(
  `check-kirill: ${indexable.length} indexable pages ` +
    `(${LOCALE_CODES.map((c) => `${c} ${byLocale(TABLE[c].htmlLang)}`).join(' · ')}) · ` +
    `${altCount} hreflang links, all reciprocal · ` +
    `${Object.values(linksByLocale).reduce((a, b) => a + b, 0)} internal links resolve and stay in their locale, ${kirillLinks} of them Cyrillic ` +
    `(${escapedLinks} written escaped by the markdown pipeline, all normalising to the same URL) · ` +
    `${llmsUrls} llms.txt URLs exist`,
);
