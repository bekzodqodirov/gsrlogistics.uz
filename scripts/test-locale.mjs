// Tests for the SIX-LOCALE contract: src/i18n/config.ts (`pick`), src/lib/format.ts, src/i18n/routes.ts
// and the scripts' own locale table, scripts/locales.mjs.
// Run: node scripts/test-locale.mjs
// Node ≥ 22.18 strips types natively; on older 22.x add --experimental-strip-types.
//
// zh and fa are hand-written like uz/ru/en, but while a locale is PENDING (src/i18n/config.ts
// `type PendingLang`) its branches are optional and pick() hands it the English one. The record
// tests below are pending-aware: a missing zh/fa branch is counted and reported, never failed,
// until the locale leaves PendingLang — and then the same test requires every branch.
//
// scripts/test-cyrillic.mjs proves the dictionary turns Uzbek Latin into Uzbek Cyrillic. This file
// proves the three things the COMPONENT TREE needs on top of that, none of which the dictionary can
// check on its own:
//
//   1. uz, ru and en are untouched. `pick` must hand back the very object the content file wrote —
//      not a copy, not a transliteration. This is the guard on a live site: 88 pages in three
//      languages must render exactly as they did before the Cyrillic locale existed.
//   2. `pick` does not transliterate identifiers. A localized record carries prose AND tokens the
//      component feeds straight back into code (`nav[].key` → `pagePath`, `items[].icon` → `Icon`,
//      `reasons[].link` → `serviceByKey`). `deepCyrillic` leaves a string alone when it is
//      byte-identical in all three hand-written languages; this file pins the complete list of
//      strings that rule rescues, so a new identifier cannot slip in unnoticed AND a piece of prose
//      cannot be silently skipped.
//   3. The Cyrillic that `src/lib/format.ts` writes out by hand — month names, "йил", "сўм" — is
//      exactly what the dictionary would have produced. format.ts cannot import the transliterator
//      (it is bundled into the calculator's client script, and the dictionary is 20 KB the browser
//      does not need), so the literals are pinned here instead.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';

const ROOT = new URL('../', import.meta.url);

/* ── Let plain Node read the site's modules (same hook as test-cyrillic.mjs) ────────────────── */
const HOOK = `
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const ROOT = ${JSON.stringify(ROOT.href)};
export async function resolve(spec, ctx, next) {
  let s;
  if (spec.startsWith('@/')) s = new URL('src/' + spec.slice(2), ROOT).href;
  else if (spec.startsWith('./') || spec.startsWith('../')) s = new URL(spec, ctx.parentURL ?? ROOT).href;
  else return next(spec, ctx);
  if (!['.ts', '.js', '.mjs', '.json'].some((e) => s.endsWith(e))) {
    for (const ext of ['.ts', '.js', '.json']) {
      if (existsSync(fileURLToPath(s + ext))) { s = s + ext; break; }
    }
  }
  if (s.endsWith('.json')) {
    const r = await next(s, { ...ctx, importAttributes: { type: 'json' } });
    return { ...r, format: 'json', importAttributes: { type: 'json' } };
  }
  return next(s, ctx);
}
`;
register('data:text/javascript,' + encodeURIComponent(HOOK));

const load = (p) => import(new URL(p, ROOT).href);
const { toCyrillic } = await load('src/lib/cyrillic.ts');
const { pick, locales, sourceLocales, switcherOrder, langMeta, langPrefix, langFromPath, sourceOf, isLocale, pendingLocales } = await load('src/i18n/config.ts');
const scriptLocales = await load('scripts/locales.mjs');
const { PENDING } = scriptLocales;
const { fmtDate, fmtSom, fmtNumber, fmtUsd, withFrom, fmtRange, daysWord } = await load('src/lib/format.ts');
const { monthYear, pricingStrings } = await load('src/i18n/pricing.ts');
const routes = await load('src/i18n/routes.ts');
const servicesModule = await load('src/data/services.ts');
const guidesModule = await load('src/data/guides.ts');

/** The thousands separator src/lib/format.ts prints: U+202F, a narrow no-break space. */
const NBSP = '\u202f';

/* ── Harness ───────────────────────────────────────────────────────────────────────────────── */
let passed = 0;
let failed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`ok - ${name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL - ${name}\n    ${String(e.message).split('\n').join('\n    ')}`);
  }
}

/* ── The corpus: every localized record the site ships ─────────────────────────────────────── */
// A "localized record" is any object carrying uz, ru and en — the i18n modules, the service and
// guide registries, `site.address`, `site.hours`, each China receiving point's city name.
const MODULES = [
  'src/i18n/about.ts', 'src/i18n/common.ts', 'src/i18n/contact.ts', 'src/i18n/faq.ts',
  'src/i18n/guides.ts', 'src/i18n/hero.ts', 'src/i18n/journey.ts', 'src/i18n/parcel.ts',
  'src/i18n/pricing.ts', 'src/i18n/privacy.ts', 'src/i18n/process.ts', 'src/i18n/proof.ts',
  'src/i18n/segments.ts', 'src/i18n/services.ts', 'src/i18n/track-system.ts', 'src/i18n/tracking.ts',
  'src/i18n/why.ts', 'src/i18n/works.ts', 'src/data/faq.ts', 'src/data/services.ts', 'src/data/route.ts', 'src/lib/site.ts',
];
/** Modules the completeness test also covers (they carry zh/fa branches too). */
const MORE_MODULES = ['src/i18n/lead.ts'];

const isLocalized = (v) =>
  v !== null && typeof v === 'object' && !Array.isArray(v) &&
  typeof v.uz !== 'undefined' && typeof v.ru !== 'undefined' && typeof v.en !== 'undefined';

/** Every localized record in the site, as { path, record }. Nested records are collected too. */
const records = [];
const seen = new Set();
function collect(value, path, depth = 0) {
  if (value === null || typeof value !== 'object' || depth > 8) return;
  if (seen.has(value)) return;
  seen.add(value);
  if (isLocalized(value)) records.push({ path, record: value });
  const entries = Array.isArray(value) ? value.map((v, i) => [i, v]) : Object.entries(value);
  for (const [k, v] of entries) collect(v, `${path}.${k}`, depth + 1);
}
// A module that fails to load is a FAILURE, not a skip: the zh/fa branches are imported into these
// modules from src/i18n/{zh,fa}/, and one unparsable translation would otherwise quietly shrink
// what every test below covers.
const loadFailures = [];
const moreRecords = [];
for (const m of [...MODULES, ...MORE_MODULES]) {
  let mod;
  try {
    mod = await load(m);
  } catch (e) {
    loadFailures.push(`${m}: ${e.message.split('\n')[0]}`);
    continue;
  }
  // The twin-rule corpus below is pinned to MODULES; the extra modules only join the branch tests.
  const into = MODULES.includes(m) ? records : moreRecords;
  for (const [name, value] of Object.entries(mod)) {
    const before = records.length;
    collect(value, `${m.split('/').pop()}:${name}`);
    if (into === moreRecords) moreRecords.push(...records.splice(before));
  }
}

test(`the corpus loaded (${records.length} localized records from ${MODULES.length} modules, +${moreRecords.length} from ${MORE_MODULES.join(', ')})`, () => {
  assert.deepEqual(loadFailures, [], `modules failed to load:\n    ${loadFailures.join('\n    ')}`);
  assert.ok(records.length > 25, `only ${records.length} localized records found — the walker is not seeing the content`);
});

/* ── 1. uz / ru / en must come back untouched ──────────────────────────────────────────────── */

/** Missing branches of pending locales: locale → record paths. Reported at the end, never failed. */
const pendingGaps = Object.fromEntries([...PENDING].map((l) => [l, []]));

test('pick returns the hand-written branch itself for every source locale — same object, not a copy', () => {
  const bad = [];
  for (const { path, record } of [...records, ...moreRecords]) {
    for (const l of sourceLocales) {
      const got = pick(l, record);
      if (record[l] === undefined && PENDING.has(l)) {
        // Still being written: pick() must hand back the fallback branch — English for zh and fa,
        // the very object, so the page is the English page and not a mix.
        pendingGaps[l].push(path);
        if (!Object.is(got, record[langMeta[l].fallback])) bad.push(`${path} [${l}: missing, and pick() did not fall back to ${langMeta[l].fallback}]`);
        continue;
      }
      // Object.is, not deepEqual: a copy would already mean the live pages are being rebuilt from
      // something other than the file, and a transliterating copy is exactly the failure to catch.
      if (!Object.is(got, record[l])) bad.push(`${path} [${l}${record[l] === undefined ? ': missing' : ''}]`);
    }
  }
  assert.deepEqual(bad, [], `pick() did not return the source branch for:\n    ${bad.join('\n    ')}`);
});

test('zh and fa fall back to English, never to Uzbek, while their branches are being written', () => {
  for (const l of ['zh', 'fa']) {
    assert.equal(langMeta[l].fallback, 'en', `langMeta.${l}.fallback`);
    const rec = { uz: 'Xitoydan', ru: 'Из Китая', en: 'From China' };
    assert.equal(pick(l, rec), 'From China', `pick('${l}') of a record without a ${l} branch`);
    assert.equal(pick(l, { ...rec, [l]: 'OWN' }), 'OWN', `pick('${l}') of a record with a ${l} branch`);
  }
  for (const l of ['uz', 'ru', 'en', 'uzc']) assert.equal(langMeta[l].fallback, 'uz', `langMeta.${l}.fallback`);
});

test('pick is memoised: the uzc branch of one record is built once', () => {
  const rec = records.find((r) => typeof r.record.uz === 'object')?.record ?? records[0].record;
  assert.ok(Object.is(pick('uzc', rec), pick('uzc', rec)), 'two pick() calls returned different objects');
});

test('a hand-written uzc override wins over the transliterator', () => {
  const rec = { uz: 'Xitoydan', ru: 'Из Китая', en: 'From China', uzc: 'ҚЎЛДА ЁЗИЛГАН' };
  assert.equal(pick('uzc', rec), 'ҚЎЛДА ЁЗИЛГАН');
  assert.equal(pick('uz', rec), 'Xitoydan');
});

/* ── 2. pick must not transliterate identifiers ────────────────────────────────────────────── */

/**
 * Every string in the real content that `deepCyrillic` leaves in Latin because it is byte-identical
 * in Uzbek, Russian and English AND that the transliterator would otherwise have changed.
 *
 * In other words: the complete list of values the rule actually rescues. Each one is an identifier a
 * component feeds back into code, and transliterating it would be a crash or a dead link:
 *
 *   nav[].key        → pagePath(lang, key)         'services' → `сервичес` is not a route
 *   reasons[].link   → serviceByKey(link)          'warehouse' → undefined → the card loses its link
 *   items[].link     → a page key in Proof.astro
 *   items[].icon     → <Icon name>                 'cart' → a blank 24×24 box
 *   services[].key   → the service registry's own key
 *
 * A new entry appearing here is a decision, not an accident: either it is another identifier (add
 * it) or a piece of prose that happens to read the same in all three languages (rewrite it, or the
 * Cyrillic page will print it in Latin).
 */
const RESCUED = [
  // common.nav[].key — a PageKey, handed to pagePath()
  'about', 'calculator', 'contact', 'guides', 'pricing', 'services', 'tracking',
  // proof.items[].link and why.reasons[].link — a page key or a ServiceKey, resolved in the component
  'customs', 'warehouse',
  // process.steps[].glyph, why.reasons[].glyph, segments.items[].icon — an IconName
  'box', 'calendar', 'camera', 'cart', 'chat', 'container', 'contract', 'document', 'exchange',
  'factory', 'languages', 'parcel', 'pin', 'scale',
];

test('the "identical in all three languages" rule rescues only identifiers nobody wants transliterated', () => {
  const found = new Map(); // value -> paths
  const walk = (uz, ru, en, path) => {
    if (typeof uz === 'string') {
      if (uz === ru && uz === en && toCyrillic(uz) !== uz) {
        if (!found.has(uz)) found.set(uz, []);
        found.get(uz).push(path);
      }
      return;
    }
    if (uz === null || typeof uz !== 'object') return;
    const at = (v, k) => (v === null || typeof v !== 'object' ? undefined : v[k]);
    const keys = Array.isArray(uz) ? uz.map((_, i) => i) : Object.keys(uz);
    for (const k of keys) walk(uz[k], at(ru, k), at(en, k), `${path}.${k}`);
  };
  for (const { path, record } of records) walk(record.uz, record.ru, record.en, path);

  const values = [...found.keys()].sort();
  assert.deepEqual(
    values,
    [...RESCUED].sort(),
    'The set of strings the rule leaves in Latin has changed.\n' +
      '    Every one of them is a string that is identical in uz, ru and en and that the dictionary\n' +
      '    WOULD have transliterated. Decide what each new one is:\n' +
      '      · an identifier a component passes back into code → add it to RESCUED here;\n' +
      '      · prose → it will print in Latin on /kirill/; reword it or give the record a `uzc` branch.\n' +
      `    now:  ${JSON.stringify(values)}\n` +
      `    pinned: ${JSON.stringify([...RESCUED].sort())}\n` +
      '    where:\n      ' +
      [...found.entries()].map(([v, p]) => `${JSON.stringify(v)} at ${p.join(', ')}`).join('\n      '),
  );
});

test('the identifiers survive pick() and still resolve — nav keys are real routes', () => {
  const { common } = records.find((r) => r.path.endsWith('common.ts:common')).record.uz
    ? { common: records.find((r) => r.path.endsWith('common.ts:common')).record }
    : {};
  const navUzc = pick('uzc', common).nav;
  const navUz = common.uz.nav;
  assert.equal(navUzc.length, navUz.length);
  navUzc.forEach((n, i) => {
    assert.equal(n.key, navUz[i].key, `nav[${i}].key was transliterated: ${navUz[i].key} → ${n.key}`);
    assert.ok(n.key in routes.routeSlugs, `nav[${i}].key "${n.key}" is not a route`);
    // …and the label beside it DID become Cyrillic, or the rule is skipping too much.
    assert.equal(n.label, toCyrillic(navUz[i].label), `nav[${i}].label was not transliterated`);
    assert.ok(/[Ѐ-ӿ]/.test(n.label), `nav[${i}].label "${n.label}" has no Cyrillic in it`);
  });
});

test('every route key reachable from the Cyrillic nav builds a real /kirill/ path', () => {
  const common = records.find((r) => r.path.endsWith('common.ts:common')).record;
  for (const n of pick('uzc', common).nav) {
    const p = routes.pagePath('uzc', n.key);
    assert.ok(p.startsWith('/kirill/'), `pagePath('uzc', '${n.key}') = ${p}`);
    assert.ok(p.endsWith('/'), `pagePath('uzc', '${n.key}') has no trailing slash`);
  }
});

/* ── 3. format.ts's hand-written Cyrillic must equal the dictionary's ──────────────────────── */

test('fmtDate: the Cyrillic date is exactly toCyrillic() of the Uzbek Latin one, all 12 months', () => {
  const bad = [];
  for (let m = 0; m < 12; m++) {
    for (const day of [1, 8, 21, 28]) {
      const iso = new Date(Date.UTC(2026, m, day)).toISOString().slice(0, 10);
      const uz = fmtDate(iso, 'uz');
      const uzc = fmtDate(iso, 'uzc');
      if (uzc !== toCyrillic(uz)) bad.push(`${iso}: uzc=${uzc} but toCyrillic(${uz})=${toCyrillic(uz)}`);
    }
  }
  assert.deepEqual(bad, [], `format.ts and the dictionary disagree:\n    ${bad.join('\n    ')}`);
  assert.equal(fmtDate('2026-09-08', 'uzc'), '2026-йил 8-сентябрь');
  // and the other three locales are untouched
  assert.equal(fmtDate('2026-09-08', 'uz'), '2026-yil 8-sentabr');
  assert.equal(fmtDate('2026-09-08', 'ru'), '8 сентября 2026 г.');
  assert.equal(fmtDate('2026-09-08', 'en'), 'September 8, 2026');
});

test('fmtSom: сўм, not сум — the Uzbek word, not the Russian one', () => {
  for (const v of [0, 1, 999, 12000, 2548800, 1200000.4]) {
    assert.equal(fmtSom(v, 'uzc'), toCyrillic(fmtSom(v, 'uz')), `fmtSom(${v})`);
  }
  assert.equal(fmtSom(1200000, 'uzc'), `1${NBSP}200${NBSP}000 сўм`);
  assert.equal(fmtSom(1200000, 'uz'), `1${NBSP}200${NBSP}000 soʻm`);
  assert.equal(fmtSom(1200000, 'ru'), `1${NBSP}200${NBSP}000 сум`);
  assert.equal(fmtSom(1200000, 'en'), 'UZS 1,200,000');
});

test('monthYear: the pricing page\'s "2026-yil sentabr" line is Cyrillic on /kirill/', () => {
  for (let m = 0; m < 12; m++) {
    const iso = new Date(Date.UTC(2026, m, 15)).toISOString().slice(0, 10);
    assert.equal(monthYear(iso, 'uzc'), toCyrillic(monthYear(iso, 'uz')), iso);
  }
  assert.equal(monthYear('2026-09-08', 'uzc'), '2026-йил сентябрь');
  assert.equal(monthYear('2026-09-08', 'ru'), pricingStrings.ru.months[8] + ' 2026');
});

test('withFrom: Uzbek puts the "from" word after the figure in BOTH scripts', () => {
  assert.equal(withFrom('110 $/m³', 'uz', 'dan'), '110 $/m³ dan');
  assert.equal(withFrom('110 $/m³', 'uzc', 'дан'), '110 $/m³ дан');
  assert.equal(withFrom('110 $/м³', 'ru', 'от'), 'от 110 $/м³');
  assert.equal(withFrom('$110/m³', 'en', 'from'), 'from $110/m³');
});

test('numbers group the Uzbek way in both scripts and the English way in English', () => {
  for (const v of [1200000, 5000, 0.8, 12.5]) {
    assert.equal(fmtNumber(v, 'uzc'), fmtNumber(v, 'uz'), `fmtNumber(${v})`);
    assert.equal(fmtUsd(v, 'uzc'), fmtUsd(v, 'uz'), `fmtUsd(${v})`);
  }
  assert.equal(fmtNumber(1200000, 'uzc'), `1${NBSP}200${NBSP}000`);
  assert.equal(fmtNumber(1200000, 'en'), '1,200,000');
  assert.equal(fmtUsd(5.5, 'uzc'), '5,5 $');
  assert.equal(fmtRange(15, 25, 'кун', 'uzc'), '15–25 кун');
  // The day word: ru declines it, the other three print the word the caller passes in.
  assert.equal(daysWord(3, 'ru', 'кун'), 'дня');
  assert.equal(daysWord(3, 'uzc', 'кун'), 'кун');
  assert.equal(daysWord(1, 'uz', 'kun'), 'kun');
});

/* ── 4. The locale registry itself ─────────────────────────────────────────────────────────── */

test('the six locales route, tag and resolve consistently', () => {
  // zh and fa are APPENDED: the four older locales keep their order in hreflang, og:locale:alternate
  // and the 404 payload, so their pages stay byte-identical.
  assert.deepEqual([...locales], ['uz', 'ru', 'en', 'uzc', 'zh', 'fa']);
  assert.deepEqual([...sourceLocales], ['uz', 'ru', 'en', 'zh', 'fa']);
  // The switchers list both Uzbek scripts side by side.
  assert.deepEqual([...switcherOrder], ['uz', 'uzc', 'ru', 'en', 'zh', 'fa']);
  assert.equal(langPrefix('uz'), '');
  assert.equal(langPrefix('uzc'), '/kirill');
  assert.equal(langPrefix('zh'), '/zh');
  assert.equal(langPrefix('fa'), '/fa');
  assert.equal(langFromPath('/kirill/нархлар/'), 'uzc');
  assert.equal(langFromPath('/kirill'), 'uzc');
  assert.equal(langFromPath('/ru/uslugi/'), 'ru');
  assert.equal(langFromPath('/narxlar/'), 'uz');
  assert.equal(langFromPath('/zh/pricing/'), 'zh');
  assert.equal(langFromPath('/fa/'), 'fa');
  assert.equal(langFromPath('/fa'), 'fa');
  assert.equal(langFromPath('/uzc/x/'), 'uz', '"uzc" is a locale key, not a URL prefix');
  assert.equal(sourceOf('uzc'), 'uz');
  assert.equal(sourceOf('zh'), 'zh');
  assert.equal(sourceOf('fa'), 'fa');
  // Both Uzbek locales must carry a script subtag, or a crawler treats one as a copy of the other.
  assert.equal(langMeta.uz.htmlLang, 'uz-Latn');
  assert.equal(langMeta.uzc.htmlLang, 'uz-Cyrl');
  // Simplified Chinese: zh-Hans picks the Simplified glyph forms; one Persian text for Iran and
  // Afghanistan: fa without a region (Dari has no ISO 639-1 code; Facebook has no fa_AF).
  assert.equal(langMeta.zh.htmlLang, 'zh-Hans');
  assert.equal(langMeta.zh.ogLocale, 'zh_CN');
  assert.equal(langMeta.fa.htmlLang, 'fa');
  assert.equal(langMeta.fa.ogLocale, 'fa_IR');
  for (const l of locales) assert.equal(langMeta[l].dir, l === 'fa' ? 'rtl' : 'ltr', `langMeta.${l}.dir`);
  assert.equal(langMeta.zh.label, '中文');
  assert.equal(langMeta.fa.label, 'فارسی');
  const tags = new Set(locales.map((l) => langMeta[l].htmlLang));
  assert.equal(tags.size, locales.length, 'two locales share an hreflang tag');
  const og = new Set(locales.map((l) => langMeta[l].ogLocale));
  assert.equal(og.size, locales.length, 'two locales share an og:locale');
});

test('scripts/locales.mjs — the table every build script reads — equals langMeta and langPrefix', () => {
  const { LOCALES, LOCALE_CODES, localeOfPath, homePath, parsePending } = scriptLocales;
  assert.deepEqual(LOCALE_CODES, [...locales], 'same locales, same order');
  for (const l of locales) {
    const row = LOCALES[l];
    assert.equal(row.code, l);
    assert.equal(row.htmlLang, langMeta[l].htmlLang, `${l}.htmlLang`);
    assert.equal(row.ogLocale, langMeta[l].ogLocale, `${l}.ogLocale`);
    assert.equal(row.dir, langMeta[l].dir, `${l}.dir`);
    assert.equal(row.prefix, langPrefix(l), `${l}.prefix`);
    assert.equal(homePath(l), routes.pagePath(l, 'home'), `${l} home path`);
  }
  for (const p of ['/', '/narxlar/', '/ru/uslugi/', '/en/', '/kirill/нархлар/', '/kirill', '/zh/pricing/', '/fa/', '/uzc/x/', '/zhx/'])
    assert.equal(localeOfPath(p), langFromPath(p), `localeOfPath('${p}')`);
  // PENDING is read from the one line that also drives the compiler and pick()'s fallback.
  const source = readFileSync(new URL('src/i18n/config.ts', ROOT), 'utf8');
  const fromSource = parsePending(source);
  for (const l of fromSource) {
    assert.ok(isLocale(l) && sourceLocales.includes(l), `PendingLang names ${l}, which is not a hand-written locale`);
    assert.notEqual(langMeta[l].fallback, l, `pending ${l} must fall back to another locale`);
  }
  if (process.env.GSR_PENDING_LOCALES === undefined) assert.deepEqual([...PENDING], fromSource);
  // …and `pendingLocales`, the same fact as a value (the service loader reads it), says the same:
  // `astro check` enforces this through `satisfies`, plain Node does not type-check.
  assert.deepEqual(Object.keys(pendingLocales).sort(), [...sourceLocales].sort(), 'pendingLocales has one flag per hand-written locale');
  assert.deepEqual(sourceLocales.filter((l) => pendingLocales[l] === true).sort(), [...fromSource].sort(), 'pendingLocales agrees with the PendingLang line');
  assert.ok(Object.values(pendingLocales).every((v) => typeof v === 'boolean'), 'pendingLocales flags are booleans');
  assert.deepEqual(parsePending("type PendingLang = 'zh' | 'fa';"), ['zh', 'fa']);
  assert.deepEqual(parsePending('type PendingLang = never;'), []);
  assert.throws(() => parsePending("type PendingLang = 'xx';"), /not a locale/);
});

test('subFor / itemPath resolve a Cyrillic item slug from a uz/ru/en-only map', () => {
  // This is the map a content file hands the layout: no uzc branch at all.
  const subs = { uz: 'temir-yol-konteyner', ru: 'zhd-konteyner', en: 'rail-container' };
  assert.equal(routes.subFor('uz', 'services', subs), 'temir-yol-konteyner');
  assert.equal(routes.subFor('uzc', 'services', subs), 'темир-йўл-контейнер');
  assert.equal(routes.itemPath('uzc', 'services', subs), '/kirill/хизматлар/темир-йўл-контейнер/');
  assert.equal(routes.itemPath('ru', 'services', subs), '/ru/uslugi/zhd-konteyner/');
  assert.equal(
    routes.itemUrl('https://gsrlogistics.uz', 'uzc', 'services', subs),
    'https://gsrlogistics.uz/kirill/%D1%85%D0%B8%D0%B7%D0%BC%D0%B0%D1%82%D0%BB%D0%B0%D1%80/%D1%82%D0%B5%D0%BC%D0%B8%D1%80-%D0%B9%D1%9E%D0%BB-%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%B9%D0%BD%D0%B5%D1%80/',
  );
  // …and it refuses to guess for an item nobody has written a Cyrillic slug for.
  assert.throws(() => routes.subFor('uzc', 'services', { uz: 'brand-new-service' }), /No Cyrillic slug/);
});

test('itemPath is what a slug goes through — pick() would mangle it', () => {
  // The trap this helper exists to close: `pick` transliterates a WORD, and a slug is not a word.
  const subs = { uz: 'temir-yol-konteyner', ru: 'zhd-konteyner', en: 'rail-container' };
  assert.notEqual(pick('uzc', subs), routes.subFor('uzc', 'services', subs));
});

test('zh and fa publish the English slugs, written out — pages, services and guides — and no two of the six locales collide', () => {
  for (const [key, slugs] of Object.entries(routes.routeSlugs)) {
    assert.equal(slugs.zh, slugs.en, `routeSlugs.${key}.zh`);
    assert.equal(slugs.fa, slugs.en, `routeSlugs.${key}.fa`);
  }
  for (const l of ['zh', 'fa']) {
    for (const k of Object.keys(routes.routeSlugs)) assert.ok(routes.pagePath(l, k).startsWith(`/${l}/`), `pagePath('${l}', '${k}')`);
  }
  const all = locales.flatMap((l) => Object.keys(routes.routeSlugs).map((k) => routes.pagePath(l, k)));
  assert.equal(new Set(all).size, all.length, 'two pages of the six locales share a path');
  const { services, serviceSubs } = servicesModule;
  for (const s of services) {
    assert.equal(s.slug.zh, s.slug.en, `services ${s.key} slug.zh`);
    assert.equal(s.slug.fa, s.slug.en, `services ${s.key} slug.fa`);
    const subs = serviceSubs(s);
    for (const l of ['zh', 'fa']) assert.equal(routes.itemPath(l, 'services', subs), `/${l}/services/${s.slug.en}/`, `itemPath('${l}', ${s.key})`);
  }
  for (const [key, slugs] of Object.entries(guidesModule.guideSlugs)) {
    assert.equal(slugs.zh, slugs.en, `guideSlugs.${key}.zh`);
    assert.equal(slugs.fa, slugs.en, `guideSlugs.${key}.fa`);
  }
  assert.equal(routes.itemPath('zh', 'services', { uz: 'temir-yol-konteyner', ru: 'zhd-konteyner', en: 'rail-container', zh: 'rail-container', fa: 'rail-container' }), '/zh/services/rail-container/');
});

test('every page and item slug in routes.ts has a uzc entry, and none collide', () => {
  for (const [key, slugs] of Object.entries(routes.routeSlugs)) {
    assert.ok('uzc' in slugs, `routeSlugs.${key} has no uzc slug`);
  }
  const paths = Object.keys(routes.routeSlugs).map((k) => routes.pagePath('uzc', k));
  assert.equal(new Set(paths).size, paths.length, `two /kirill/ pages share a path: ${paths.join(' ')}`);
  for (const table of [routes.serviceSlugsUzc, routes.guideSlugsUzc]) {
    const v = Object.values(table);
    assert.equal(new Set(v).size, v.length, `two items share a Cyrillic slug: ${v.join(' ')}`);
    for (const s of v) assert.ok(!/[a-zA-Z]/.test(s.replace(/\d/g, '')), `slug "${s}" still has Latin letters`);
  }
});

for (const [l, paths] of Object.entries(pendingGaps)) {
  if (paths.length) console.log(`  pending ${l}: ${paths.length} of ${records.length + moreRecords.length} records have no ${l} branch yet (pick() shows ${langMeta[l].fallback}) — counted, not failed`);
}
console.log(
  `\n${passed} passed, ${failed} failed — ${records.length + moreRecords.length} localized records, ` +
    `${locales.length} locales${PENDING.size ? `, pending: ${[...PENDING].join(', ')}` : ''}.`,
);
process.exit(failed ? 1 : 0);
