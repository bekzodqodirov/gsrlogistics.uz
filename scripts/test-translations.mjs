// Tests that every Chinese (zh) and Persian (fa) translation is a TRANSLATION of the English branch
// it was made from: same shape, same placeholders, same identifiers, same numbers.
// Run: node scripts/test-translations.mjs
//
// What it reads:
//   · every localized record (an object with uz, ru and en branches) exported by src/i18n/*.ts —
//     whose zh/fa branches live in src/i18n/{zh,fa}/<module>.ts — and by src/data/services.ts,
//     src/data/route.ts, src/data/faq.ts and src/lib/site.ts;
//   · every service page, src/data/services/<key>.content.ts, against its translations in
//     src/data/services/{zh,fa}/<key>.content.ts;
//   · every guide, src/content/guides/{zh,fa}/<slug>.md, against src/content/guides/en/<slug>.md;
//   · every works block, src/content/works/<block>/index.md: the zh/fa title, text and photo alts it has,
//     against its English ones — numbers only (a block may leave a language out: that page then shows the
//     block's media and date, never another language's text).
//
// What it compares, zh and fa each against en:
//   1. structure — the same keys, the same array lengths (so the same bullets, steps, FAQ entries
//      and table rows and columns); guides: the same frontmatter keys, FAQ count and sources, the
//      same headings (count and level), tables (rows and columns) and list items. FAILS.
//   2. placeholders — the same multiset of {name} tokens. FAILS.
//   3. identifiers — a string that is byte-identical in uz, ru and en and contains a Latin letter
//      (a key, an icon, a brand, a code: 'truck', 'Telegram', '20GP') or is a code of four or more
//      digits (HS 8443, 1688) is copied unchanged — fa may write its list separator " • " where the
//      source has " · ". The one other way through: a brand or unit with a standard native form
//      (fa تلگرام, zh 淘宝 / 拼多多, 20 英尺) listed in the `tokens` of scripts/test-translations.allow.json —
//      that exact value, in that locale, at that exact place, while the source still reads as listed,
//      each with its reason. Fields that are data whatever they hold (key, related, guideKeys, updated,
//      icon, glyph, tone, slug) and ISO dates are copied unchanged whenever uz, ru and en agree on
//      them (an 'updated' that is a translated label is not data). Guides: slug,
//      translationKey, tags, publishDate and the sources' URLs and dates; internal links point at
//      the translation's own locale with the same English slug. FAILS.
//   4. numbers — the set of figure values: a value the source has and the translation lacks, or the
//      other way round, FAILS; the same value said once more or once less ("不足 0.5 kg 的货物按
//      0.5 kg 计费" for "billed as 0.5 kg") is the same figure. After the digits are normalised (Persian ۰–۹,
//      Arabic-Indic ٠–٩ and full-width digits; ٫ is the decimal point, ٬ , and narrow spaces group
//      thousands; English month names become their numbers, so "September 8, 2026",
//      "2026年9月8日" and "۲۰۲۶/۰۹/۰۸" agree). A UTC offset after the hours is not counted (the
//      glossary allows adding "UTC+5"). FAILS, unless the place is listed with a reason in
//      scripts/test-translations.allow.json — the phone-number hints, for one, deliberately differ.
//
// A locale that is still PENDING (src/i18n/config.ts `type PendingLang`) may lack a branch, a service
// file or a guide: that is counted and reported, not failed. Once the locale leaves PendingLang,
// a missing translation fails like everything else.
//
// TypeScript modules are loaded the way the site's own toolchain resolves them: bundled by esbuild
// (the '@/' alias from tsconfig.json, extensionless and JSON imports) into memory and imported from
// there, so the test reads exactly the values the pages are built from.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import yaml from 'js-yaml';
import { PENDING } from './locales.mjs';
import { readBlocks } from './works-blocks.mjs';

const ROOT = new URL('../', import.meta.url);
const ROOT_DIR = fileURLToPath(ROOT);
const TARGETS = ['zh', 'fa'];
const ALLOW_FILE = new URL('test-translations.allow.json', import.meta.url);

/* ── Loading ────────────────────────────────────────────────────────────────────────────────── */

async function load(rel) {
  const out = await build({
    entryPoints: [fileURLToPath(new URL(rel, ROOT))],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    absWorkingDir: ROOT_DIR,
    logLevel: 'silent',
  });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);
}

const failures = { structure: [], placeholders: [], identifiers: [], numbers: [], load: [] };
const fail = (kind, where, msg) => failures[kind].push(`${where}: ${msg}`);
const missing = Object.fromEntries(TARGETS.map((t) => [t, []]));
const counts = { records: 0, leaves: 0, services: 0, guides: 0, works: 0 };
const allowed = JSON.parse(readFileSync(ALLOW_FILE, 'utf8'));
const allowNumbers = (allowed.numbers ?? []).map((a) => ({ ...a, used: false, re: new RegExp(`^${a.where.split('*').map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`) }));
let allowedHits = 0;
/**
 * Native forms of brand and unit tokens (fa تلگرام for Telegram, zh 淘宝 / 拼多多): each entry names one
 * place exactly (no wildcards), one locale, the source token it replaces and the one value allowed, with
 * the reason. Nothing else about the identifier rule is relaxed.
 */
const allowTokens = (allowed.tokens ?? []).map((a) => ({ ...a, used: false }));
for (const [i, a] of allowTokens.entries()) {
  const bad = ['path', 'locale', 'source', 'value', 'reason'].filter((k) => typeof a[k] !== 'string' || !a[k].trim());
  if (bad.length) fail('load', `${ALLOW_FILE.pathname.split('/').pop()} tokens[${i}]`, `needs ${bad.join(', ')}`);
  else if (!TARGETS.includes(a.locale)) fail('load', `${ALLOW_FILE.pathname.split('/').pop()} tokens[${i}]`, `locale "${a.locale}" is not one of ${TARGETS.join(', ')}`);
  else if (a.path.includes('*')) fail('load', `${ALLOW_FILE.pathname.split('/').pop()} tokens[${i}]`, `path "${a.path}" has a wildcard — a token entry names one place`);
}
let tokenHits = 0;
/** The allow-list entry for a token at this place in this locale, if any (used or not). */
const tokenEntry = (where, lang) => allowTokens.find((a) => a.path === where && a.locale === lang);

/* ── Numbers ────────────────────────────────────────────────────────────────────────────────── */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NAMES = MONTHS.flatMap((m) => [m, m.slice(0, 3), ...(m === 'September' ? ['Sept'] : [])]).join('|');
/**
 * A figure written as a word may stay a word or become digits in a translation ("three addresses" →
 * "3 个收货地址"). Month names count the same way: "September 8, 2026" is 2026年9月8日 in Chinese and
 * ۲۰۲۶/۰۹/۰۸ in Persian, "late January" may stay a phrase — the day and the year are digits in all three.
 */
const WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30,
  forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000,
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, once: 1, twice: 2,
  twofold: 2, threefold: 3, fourfold: 4, fivefold: 5, tenfold: 10, double: 2, triple: 3,
};
const WORD_RE = new RegExp(`\\b(?:${MONTH_NAMES}|${Object.keys(WORDS).join('|')})\\b`, 'gi');
const monthNo = (m) => MONTHS.findIndex((x) => x.slice(0, 3).toLowerCase() === m.replace('.', '').slice(0, 3).toLowerCase()) + 1;
const wordValue = (w) => WORDS[w.toLowerCase()] ?? monthNo(w);
const DIGITS = [[0x06f0, 0x06f9], [0x0660, 0x0669], [0xff10, 0xff19]];
/** Scale words: "$10–20k", "1 million", "100 万", "۲ میلیون". */
const SCALE = { k: 1e3, thousand: 1e3, million: 1e6, mln: 1e6, billion: 1e9, bn: 1e9, '千': 1e3, '万': 1e4, '亿': 1e8, 'هزار': 1e3, 'میلیون': 1e6, 'میلیارد': 1e9 };
const SCALED = /(\d+(?:\.\d+)?)(?:\s?(?:[–~-]|to|تا|至|到)\s?(\d+(?:\.\d+)?))?\s?(?:多|余)?\s?(k|thousand|million|mln|billion|bn|千|万|亿|هزار|میلیون|میلیارد)(?![A-Za-z])/gu;
const canon = (n) => String(Number(n));

/**
 * The figures of a string. `required` are the digits; `optional` (English only) are the figures it
 * writes in words, which a translation may write either way.
 */
export function figuresOf(s, lang) {
  let t = s;
  for (const [lo, hi] of DIGITS) t = t.replace(new RegExp(`[\\u{${lo.toString(16)}}-\\u{${hi.toString(16)}}]`, 'gu'), (d) => String(d.codePointAt(0) - lo));
  t = t.replace(/\u{066B}/gu, '.').replace(/\u{066C}/gu, ',').replace(/[\u{066A}\u{FF05}]/gu, '%');
  // The glossary lets zh/fa add the time zone after the office hours: "（塔什干时间，UTC+5）".
  t = t.replace(/\bUTC\s?[+−-]\s?\d{1,2}(?::\d\d)?/g, ' ');
  const optional = [];
  const monthWords = [];
  // Digits inside a Chinese term the English text quotes ("48小时发货 (ships within 48 hours)"): the
  // Chinese translation keeps the term and has no use for the English gloss that repeats the figure.
  const inHan = lang === 'en' ? (t.match(/\d+(?=\p{Script=Han})|(?<=\p{Script=Han})\d+/gu) ?? []).map(canon) : [];
  if (lang === 'en') {
    t = t.replace(WORD_RE, (w) => {
      const v = String(wordValue(w));
      optional.push(v);
      if (!(w.toLowerCase() in WORDS)) monthWords.push(v);
      return ' ';
    });
  }
  // Group separators between digit groups: "1,200,000", "5 000", "۲٬۸۰۰" are all one number.
  t = t.replace(/(\d)[,\s\u{00A0}\u{202F}\u{2009}](?=\d{3}(?!\d))/gu, '$1');
  const required = [];
  t = t.replace(SCALED, (m, a, b, unit) => {
    // "$10–20k": both ends are thousands; "$500,000–1 million": only the second one is scaled.
    if (b === undefined) required.push(canon(Number(a) * SCALE[unit]));
    else required.push(canon(Number(a) < Number(b) ? Number(a) * SCALE[unit] : Number(a)), canon(Number(b) * SCALE[unit]));
    return ' ';
  });
  for (const n of t.match(/\d+(?:\.\d+)?/g) ?? []) required.push(canon(n));
  return { required, optional, monthWords, inHan };
}

/**
 * Do the figures of a translation match the English ones? Every English digit must be there; every
 * other figure of the translation must be an English figure written in words. With `subset` (SEO
 * titles and descriptions, cut to a SERP budget) figures may be left out but none may be added.
 * "11.11" (the sales day) and "۱۱/۱۱" are the same figures, so a decimal may pair with its two halves.
 */
export function figuresMatch(en, tr, subset = false, lang = '') {
  const required = [...en.required];
  const optional = [...en.optional];
  if (lang === 'zh') {
    for (const n of en.inHan ?? []) {
      if (required.filter((x) => x === n).length > 1) { required.splice(required.indexOf(n), 1); optional.push(n); }
    }
  }
  const rest = [...tr.required];
  const take = (list, n) => { const i = list.indexOf(n); if (i === -1) return false; list.splice(i, 1); return true; };
  const missing = required.filter((n) => !take(rest, n));
  const pairUp = (from, into) => {
    for (const d of [...from]) {
      if (!d.includes('.')) continue;
      const [a, b] = d.split('.').map(canon);
      const ia = into.indexOf(a);
      const ib = into.findIndex((x, i) => x === b && i !== ia);
      if (ia !== -1 && ib !== -1) { from.splice(from.indexOf(d), 1); into.splice(Math.max(ia, ib), 1); into.splice(Math.min(ia, ib), 1); }
    }
  };
  pairUp(missing, rest); // "11.11" ↔ "۱۱/۱۱", before a month word can take one of the halves
  for (const n of optional) take(rest, n);
  const extra = rest;
  pairUp(extra, missing);
  // A month with no year ("September medians") has no numeric Persian form without one (۲۰۲۶/۰۹):
  // a translation may repeat a year the English string already names, when it names a month.
  if (en.optional.some((n) => en.monthWords?.includes(n))) {
    for (const y of [...extra]) if (/^(?:19|20)\d\d$/.test(y) && en.required.includes(y)) extra.splice(extra.indexOf(y), 1);
  }
  // A figure said once more, or once less, is the same figure: "不足 0.5 kg 的货物按 0.5 kg 计费" restates
  // the 0.5 of "Lighter shipments are billed as 0.5 kg". What must match is the set of VALUES — a value
  // the source lacks is still extra, and one the translation lacks entirely is still missing.
  const restated = (n, list) => list.some((x) => x === n || (Number.isFinite(Number(x)) && canon(x) === canon(n)));
  const extraValues = extra.filter((n) => !restated(n, en.required));
  const missingValues = missing.filter((n) => !restated(n, tr.required));
  return { ok: !extraValues.length && (subset || !missingValues.length), missing: missingValues, extra: extraValues };
}

/** The number rules on known sentences — run first, so a change to the matcher cannot pass silently. */
const FIGURE_CASES = [
  // [en, translation, lang, subset, expected]
  ['$5.50 per kg', '۵٫۵ دلار برای هر کیلوگرم', 'fa', false, true],
  ['1,200,000 UZS', '۱٬۲۰۰٬۰۰۰ سوم', 'fa', false, true],
  ['15–25 days', '۱۵ تا ۲۵ روز', 'fa', false, true],
  ['15–25 days', '15–20 天', 'zh', false, false],
  ['400+ clients', '500+ 客户', 'zh', false, false],
  ['Updated September 8, 2026', '更新于 2026年9月8日', 'zh', false, true],
  ['Updated September 8, 2026', 'به‌روزرسانی ۲۰۲۶/۰۹/۰۸', 'fa', false, true],
  ['Updated September 8, 2026', '更新于 2026年9月9日', 'zh', false, false],
  ['three receiving addresses', '3 个收货地址', 'zh', false, true],
  ['three receiving addresses', '4 个收货地址', 'zh', false, false],
  ['$10–20k — 1.5 BRV', '10,000–20,000 美元 — 1.5 BRV', 'zh', false, true],
  ['$500,000–1 million', '۵۰۰٬۰۰۰ دلار تا ۱ میلیون', 'fa', false, true],
  ['over 2 million product lines', '200 多万种商品', 'zh', false, true],
  ['after the 11.11 sales', 'پس از حراج‌های ۱۱/۱۱', 'fa', false, true],
  ['Mon–Sat 9:00–19:00', '周一至周六 9:00–19:00（塔什干时间，UTC+5）', 'zh', false, true],
  ['48小时发货 (ships within 48 hours)', '48小时发货', 'zh', false, true],
  ['from $110/m³, 15–25 days, rail from $2,800', '110 美元/m³ 起，15–25 天', 'zh', true, true],
  ['from $110/m³, 15–25 days', '120 美元/m³ 起', 'zh', true, false],
  ['Yes, 0.5 kg. Lighter shipments are billed as 0.5 kg.', '有，0.5 kg。不足 0.5 kg 的货物按 0.5 kg 计费。', 'zh', false, true],
  ['0.5 kg minimum, 100 kg and over quoted individually', '最低 0.5 kg，0.5 kg 以上单独报价', 'zh', false, false],
  ['15–25 days by truck, 5–10 days by air', '۱۵ تا ۲۵ روز زمینی، ۱۵ تا ۲۵ روز هوایی', 'fa', false, false],
];

/** SEO strings are cut to a SERP budget (GLOSSARY §7): they may drop a figure, never add or change one. */
const SEO_FIELD = /(?:^|\.)(?:seo[A-Za-z]*|seo\.(?:title|description))(?:$|\.)|#(?:title|description)$/;

const PLACEHOLDER = /\{[A-Za-z_][A-Za-z0-9_]*\}/g;
const placeholdersOf = (s) => (s.match(PLACEHOLDER) ?? []).sort();
const sameList = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

function checkNumbers(where, lang, en, x) {
  const subset = SEO_FIELD.test(where.replace(/\.(?:zh|fa)\./, '.'));
  const r = figuresMatch(figuresOf(en, 'en'), figuresOf(x, lang), subset, lang);
  if (r.ok) return;
  const allow = allowNumbers.find((e) => e.lang === lang && e.re.test(where));
  if (allow) { allow.used = true; allowedHits += 1; return; }
  const what = [r.missing.length && !subset ? `missing ${r.missing.join(', ')}` : '', r.extra.length ? `not in en ${r.extra.join(', ')}` : ''].filter(Boolean).join('; ');
  fail('numbers', where, `${what}${subset ? ' (SEO string: figures may be dropped, never added)' : ''}\n      en: ${en.slice(0, 170)}\n      ${lang}: ${x.slice(0, 170)}`);
}

for (const [en, tr, lang, subset, want] of FIGURE_CASES) {
  const got = figuresMatch(figuresOf(en, 'en'), figuresOf(tr, lang), subset, lang).ok;
  if (got !== want) fail('load', 'number matcher self-test', `expected ${want ? 'a match' : 'a mismatch'}: "${en}" vs "${tr}"`);
}

/* ── Records ────────────────────────────────────────────────────────────────────────────────── */

/** Fields that are data, never prose, whatever they hold. */
const DATA_KEYS = new Set(['key', 'related', 'guideKeys', 'updated', 'icon', 'glyph', 'tone', 'slug']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** A string identical in uz, ru and en is an identifier when it holds a Latin letter or is a 4+-digit code. */
const identifierLike = (s) => /[A-Za-z]/.test(s) || /^\d{4,}$/.test(s);
const at = (v, k) => (v !== null && typeof v === 'object' ? v[k] : undefined);

function compare(en, x, uz, ru, where, lang, dataKey) {
  if (typeof en === 'string') {
    counts.leaves += 1;
    if (typeof x !== 'string') return fail('structure', where, `en is a string, ${lang} is ${Array.isArray(x) ? 'an array' : typeof x}`);
    if (en.trim() && !x.trim()) return fail('structure', where, `${lang} is empty`);
    // A data field (key, related, updated, icon…) or an ISO date that reads the same in uz, ru and en
    // is data, whatever it looks like: it is copied unchanged. The same key holding a translated
    // label ("Updated", "Related guides") is prose and goes through the checks below.
    if ((dataKey || ISO_DATE.test(en)) && uz === en && ru === en) {
      if (x !== en) fail('identifiers', where, `data copied unchanged in every language: "${en}", ${lang} has "${x}"`);
      return;
    }
    if (uz === en && ru === en && identifierLike(en)) {
      if (x === en || (lang === 'fa' && x === en.replaceAll(' · ', ' • '))) return;
      // A listed native form: this place, this locale, this source token, this value — nothing looser.
      const entry = tokenEntry(where, lang);
      if (entry && entry.source === en && entry.value === x) { entry.used = true; tokenHits += 1; return; }
      const listed = entry ? ` (scripts/test-translations.allow.json lists "${entry.value}" for the source "${entry.source}" here)` : '';
      fail('identifiers', where, `"${en}" is identical in uz, ru and en (an identifier, brand or code) — ${lang} has "${x}"${listed}`);
      return;
    }
    const pa = placeholdersOf(en);
    const pb = placeholdersOf(x);
    if (!sameList(pa, pb)) fail('placeholders', where, `en has [${pa.join(' ')}], ${lang} has [${pb.join(' ')}]`);
    checkNumbers(where, lang, en, x);
    return;
  }
  if (Array.isArray(en)) {
    if (!Array.isArray(x)) return fail('structure', where, `en is an array, ${lang} is ${typeof x}`);
    if (x.length !== en.length) fail('structure', where, `en has ${en.length} items, ${lang} has ${x.length}`);
    en.forEach((v, i) => { if (i < x.length) compare(v, x[i], at(uz, i), at(ru, i), `${where}[${i}]`, lang, dataKey); });
    return;
  }
  if (en !== null && typeof en === 'object') {
    if (x === null || typeof x !== 'object' || Array.isArray(x)) return fail('structure', where, `en is an object, ${lang} is ${Array.isArray(x) ? 'an array' : typeof x}`);
    const ka = Object.keys(en).filter((k) => en[k] !== undefined).sort();
    const kb = Object.keys(x).filter((k) => x[k] !== undefined).sort();
    if (!sameList(ka, kb)) fail('structure', where, `keys differ — only in en: [${ka.filter((k) => !kb.includes(k)).join(', ')}], only in ${lang}: [${kb.filter((k) => !ka.includes(k)).join(', ')}]`);
    for (const k of ka) if (k in x) compare(en[k], x[k], at(uz, k), at(ru, k), `${where}.${k}`, lang, dataKey || DATA_KEYS.has(k));
    return;
  }
  if (typeof en === 'function') return;
  counts.leaves += 1;
  if (x !== en) fail('identifiers', where, `en is ${JSON.stringify(en)}, ${lang} is ${JSON.stringify(x)} — numbers and flags are data`);
}

const isLocalized = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) && v.uz !== undefined && v.ru !== undefined && v.en !== undefined;

function checkRecord(record, where, parentKey) {
  counts.records += 1;
  for (const lang of TARGETS) {
    if (record[lang] === undefined) {
      if (PENDING.has(lang)) missing[lang].push(where);
      else fail('structure', where, `no ${lang} branch`);
      continue;
    }
    compare(record.en, record[lang], record.uz, record.ru, `${where}.${lang}`, lang, DATA_KEYS.has(parentKey));
  }
}

function collect(value, where, seen, parentKey, depth = 0) {
  if (value === null || typeof value !== 'object' || depth > 8 || seen.has(value)) return;
  seen.add(value);
  if (isLocalized(value)) return checkRecord(value, where, parentKey);
  for (const [k, v] of Array.isArray(value) ? value.map((v, i) => [i, v]) : Object.entries(value)) collect(v, `${where}.${k}`, seen, typeof k === 'string' ? k : parentKey, depth + 1);
}

const MODULES = [
  ...readdirSync(new URL('src/i18n/', ROOT)).filter((f) => f.endsWith('.ts') && f !== 'config.ts' && f !== 'routes.ts').sort().map((f) => `src/i18n/${f}`),
  'src/data/services.ts', 'src/data/route.ts', 'src/data/faq.ts', 'src/lib/site.ts',
];
for (const m of MODULES) {
  let mod;
  try { mod = await load(m); } catch (e) { fail('load', m, e.message.split('\n')[0]); continue; }
  const seen = new Set();
  for (const [name, value] of Object.entries(mod)) collect(value, `${m}:${name}`, seen, name);
}

/* ── Service pages ──────────────────────────────────────────────────────────────────────────── */

const serviceDir = new URL('src/data/services/', ROOT);
for (const file of readdirSync(serviceDir).filter((f) => f.endsWith('.content.ts')).sort()) {
  const key = file.replace('.content.ts', '');
  let source;
  try { source = (await load(`src/data/services/${file}`)).default; } catch (e) { fail('load', `src/data/services/${file}`, e.message.split('\n')[0]); continue; }
  counts.services += 1;
  for (const lang of TARGETS) {
    const rel = `src/data/services/${lang}/${file}`;
    if (!existsSync(new URL(rel, ROOT))) {
      if (PENDING.has(lang)) missing[lang].push(rel);
      else fail('structure', rel, `missing — the ${key} service page has no ${lang} translation`);
      continue;
    }
    let tr;
    try { tr = (await load(rel)).default; } catch (e) { fail('load', rel, e.message.split('\n')[0]); continue; }
    if (tr?.key !== key) fail('identifiers', rel, `declares key "${tr?.key}", the file is ${key}`);
    compare(source.en, tr, source.uz, source.ru, `${rel}:content`, lang, false);
  }
}

/* ── Guides ─────────────────────────────────────────────────────────────────────────────────── */

function splitGuide(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) throw new Error('no frontmatter');
  return { fm: yaml.load(m[1]), body: m[2] };
}

/** The countable shape of a markdown body, plus its text per section and its link targets. */
function shapeOf(body, lang) {
  const headings = [];
  const tables = [];
  let list = 0;
  let table = null;
  let fence = false;
  const sections = [[]];
  const links = [];
  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; continue; }
    if (fence) continue;
    for (const m of line.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) links.push(m[1]);
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) { headings.push(h[1].length); sections.push([h[2]]); table = null; continue; }
    if (/^\s*\|/.test(line)) {
      if (!table) { table = { rows: 0, cols: line.split('|').length - 2 }; tables.push(table); }
      if (!/^\s*\|(?:\s*:?-{2,}:?\s*\|)+\s*$/.test(line)) table.rows += 1;
      sections.at(-1).push(line);
      continue;
    }
    table = null;
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(line)) list += 1;
    sections.at(-1).push(line);
  }
  // Internal links compared without the locale prefix: /zh/pricing/ and /en/pricing/ are the same link.
  const own = `/${lang}/`;
  const norm = links.map((l) => (l.startsWith(own) ? `/${l.slice(own.length)}` : l)).sort();
  const text = sections.map((s) => s.join('\n').replace(/\]\([^)]*\)/g, ']').replace(/<[^>]+>/g, ' '));
  return { headings, tables, list, text, links: norm };
}

const guideDir = (l) => new URL(`src/content/guides/${l}/`, ROOT);
for (const file of readdirSync(guideDir('en')).filter((f) => f.endsWith('.md')).sort()) {
  const en = splitGuide(readFileSync(new URL(file, guideDir('en')), 'utf8'));
  counts.guides += 1;
  const enShape = shapeOf(en.body, 'en');
  for (const lang of TARGETS) {
    const rel = `src/content/guides/${lang}/${file}`;
    if (!existsSync(new URL(file, guideDir(lang)))) {
      if (PENDING.has(lang)) missing[lang].push(rel);
      else fail('structure', rel, `missing — the guide ${file} has no ${lang} translation`);
      continue;
    }
    let tr;
    try { tr = splitGuide(readFileSync(new URL(file, guideDir(lang)), 'utf8')); } catch (e) { fail('load', rel, `frontmatter does not parse: ${e.message.split('\n')[0]}`); continue; }
    const fa = en.fm;
    const fb = tr.fm ?? {};
    const ka = Object.keys(fa).sort();
    const kb = Object.keys(fb).sort();
    if (!sameList(ka, kb)) fail('structure', `${rel} frontmatter`, `keys differ — en [${ka.join(', ')}], ${lang} [${kb.join(', ')}]`);
    if (fb.lang !== lang) fail('identifiers', `${rel} frontmatter`, `lang is "${fb.lang}", expected "${lang}"`);
    for (const k of ['slug', 'translationKey']) if (fb[k] !== fa[k]) fail('identifiers', `${rel} frontmatter`, `${k} is "${fb[k]}", the English guide's is "${fa[k]}"`);
    if (JSON.stringify(fb.tags ?? []) !== JSON.stringify(fa.tags ?? [])) fail('identifiers', `${rel} frontmatter`, `tags are ${JSON.stringify(fb.tags)}, the English guide's are ${JSON.stringify(fa.tags)}`);
    if (String(fb.publishDate) !== String(fa.publishDate)) fail('identifiers', `${rel} frontmatter`, `publishDate is ${fb.publishDate}, the English guide's is ${fa.publishDate}`);
    for (const k of ['title', 'description']) if (typeof fa[k] === 'string') checkNumbers(`${rel}#${k}`, lang, fa[k], String(fb[k] ?? ''));
    const qa = fa.faq ?? [];
    const qb = fb.faq ?? [];
    if (qa.length !== qb.length) fail('structure', `${rel} frontmatter`, `en has ${qa.length} FAQ entries, ${lang} has ${qb.length}`);
    qa.forEach((q, i) => { if (qb[i]) for (const k of ['q', 'a']) checkNumbers(`${rel}#faq[${i}].${k}`, lang, q[k], String(qb[i][k] ?? '')); });
    const sa = fa.sources ?? [];
    const sb = fb.sources ?? [];
    if (sa.length !== sb.length) fail('structure', `${rel} frontmatter`, `en cites ${sa.length} sources, ${lang} cites ${sb.length}`);
    sa.forEach((s, i) => {
      if (!sb[i]) return;
      if (sb[i].url !== s.url) fail('identifiers', `${rel}#sources[${i}]`, `url is ${sb[i].url}, the English guide's is ${s.url}`);
      if (String(sb[i].date ?? '') !== String(s.date ?? '')) fail('identifiers', `${rel}#sources[${i}]`, `date is ${sb[i].date}, the English guide's is ${s.date}`);
      checkNumbers(`${rel}#sources[${i}].title`, lang, s.title, String(sb[i].title ?? ''));
    });
    const shape = shapeOf(tr.body, lang);
    if (!sameList(shape.headings, enShape.headings)) fail('structure', rel, `headings [${shape.headings.map((l) => '#'.repeat(l)).join(' ')}] ≠ en [${enShape.headings.map((l) => '#'.repeat(l)).join(' ')}]`);
    if (shape.tables.length !== enShape.tables.length) fail('structure', rel, `${shape.tables.length} tables, en has ${enShape.tables.length}`);
    enShape.tables.forEach((t, i) => {
      const u = shape.tables[i];
      if (u && (u.rows !== t.rows || u.cols !== t.cols)) fail('structure', rel, `table ${i + 1} is ${u.rows} rows × ${u.cols} columns, en is ${t.rows} × ${t.cols}`);
    });
    if (shape.list !== enShape.list) fail('structure', rel, `${shape.list} list items, en has ${enShape.list}`);
    if (!sameList(shape.links, enShape.links)) {
      const onlyEn = enShape.links.filter((l) => !shape.links.includes(l));
      const onlyTr = shape.links.filter((l) => !enShape.links.includes(l));
      fail('identifiers', rel, `links differ (internal links compared without /en/ and /${lang}/) — only in en: [${onlyEn.join(', ')}], only in ${lang}: [${onlyTr.join(', ')}]`);
    }
    if (shape.text.length === enShape.text.length) enShape.text.forEach((t, i) => checkNumbers(`${rel}#section-${i}`, lang, t, shape.text[i]));
  }
}

/* ── Works blocks ─────────────────────────────────────────────────────────────────────────────── */

// A block's zh and fa texts keep the figures of its English ones: «yoʻl 40 soniyada» is 40 秒 and ۴۰ ثانیه, never
// another number. Only the translations a block has are compared — a language it leaves out is allowed.
for (const b of readBlocks()) {
  const rel = `src/content/works/${b.id}/index.md`;
  if (b.error) { fail('load', rel, b.error); continue; }
  const fields = [['title', b.data.title], ['text', b.data.text], ...(b.data.photos ?? []).map((p, i) => [`photos[${i}].alt`, p?.alt])];
  for (const [name, map] of fields) {
    if (typeof map?.en !== 'string') continue;
    for (const lang of TARGETS) {
      if (typeof map[lang] !== 'string') continue;
      counts.works += 1;
      checkNumbers(`${rel}#${name}.${lang}`, lang, map.en, map[lang]);
    }
  }
}

/* ── Report ─────────────────────────────────────────────────────────────────────────────────── */

const LABEL = {
  load: 'modules or files that do not load, or a matcher that fails its own cases',
  structure: 'structure (keys, array lengths, tables, headings, list items, missing translations)',
  placeholders: '{placeholder} tokens',
  identifiers: 'identifiers, data fields and links copied unchanged',
  numbers: 'numbers (not listed in scripts/test-translations.allow.json)',
};
let total = 0;
for (const [kind, list] of Object.entries(failures)) {
  if (!list.length) continue;
  total += list.length;
  console.log(`\nFAIL ${LABEL[kind]} — ${list.length}:`);
  for (const l of list.slice(0, 60)) console.log(`  ${l}`);
  if (list.length > 60) console.log(`  … and ${list.length - 60} more`);
}
for (const a of allowNumbers) if (!a.used) console.log(`  note: allow-list entry no longer needed — ${a.lang} ${a.where}`);
for (const a of allowTokens) if (!a.used) console.log(`  note: allow-list token entry not used — ${a.locale} ${a.path} ("${a.source}" → "${a.value}")`);
for (const lang of TARGETS) {
  if (missing[lang].length) {
    const files = missing[lang].filter((w) => w.startsWith('src/data/services/') || w.startsWith('src/content/'));
    console.log(`  pending ${lang}: ${missing[lang].length - files.length} records without a ${lang} branch, ${files.length} service/guide files not written yet — counted, not failed`);
  }
}
console.log(
  `\ntest-translations: ${total ? `${total} problem(s)` : 'ok'} — ${counts.records} localized records (${counts.leaves} leaves compared), ` +
    `${counts.services} service pages, ${counts.guides} guides, ${counts.works} works-block texts, ${allowedHits} number differences and ${tokenHits} native token forms allowed by the list` +
    `${PENDING.size ? ` · pending: ${[...PENDING].join(', ')}` : ''}`,
);
process.exit(total ? 1 : 0);
