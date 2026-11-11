// Content guard rails: run after every build (npm run check:content).
// Fails on forbidden claims, wrong apostrophes, inconsistent number/percent style and
// language leaks between the six locale trees. Keeps the site honest as content changes.
//
// What runs where — the page's locale comes from scripts/locales.mjs, the table every script shares:
//   · FORBIDDEN (uz/ru/en claims) and ZH_FA_FORBIDDEN (the same business rules in Chinese and
//     Persian, scripts/content-rules.mjs) run on EVERY page: on the <main> text, raw and
//     normalised (Persian/Arabic-Indic/full-width digits, bidi marks, Arabic ي/ك, spaces between
//     CJK characters — see normalize()), and on the <title>, the meta/OG/Twitter descriptions and
//     every JSON-LD string; then once on dist/llms.txt.
//   · The Uzbek style rules run on uz and uzc pages only; the "Uzbek word in ru/en copy" rule on
//     ru and en. Chinese and Persian pages get their own orthography rules instead (PAGE_RULES)
//     and an untranslated-text check: English, Uzbek or Russian prose on a zh/fa page is an ERROR
//     once the locale is finished, and a counted WARNING while it is still pending
//     (src/i18n/config.ts `PendingLang`), because until then pick() shows the English branch.
//     The office's official street address, exactly as src/lib/site.ts writes it, is not prose:
//     a translation may print it for a taxi driver (STREET_ADDRESS in content-rules.mjs).
//   · Every new rule carries the sentences it must catch and the ones it must let through, and
//     they are asserted before any page is read: a rule that misfires on its own fixtures fails
//     the build.
import fs from 'node:fs';
import path from 'node:path';
import { LOCALES, LOCALE_CODES, isPending, localeOfPath, unprefixed } from './locales.mjs';
import { ZH_FA_FORBIDDEN, PAGE_RULES, normalize, leakRuns, quotedForeign, selfTest } from './content-rules.mjs';
const dist = process.argv[2] || 'dist';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'index.html' ? [path.join(d, e.name)] : []);
const strip = (html) => {
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [''])[0]
    .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ');
  return main.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
};
const decodeEntities = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, '\xA0').replace(/&amp;/g, '&');
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const UNSEEN = new Set(['script', 'style', 'svg', 'template', 'title']);
/**
 * The visible text of a page's <body> that is the page's OWN language: header, main and footer,
 * minus scripts, styles, SVG and every element whose `lang` names another language (the language
 * switcher's endonyms, a Chinese address on a Persian page). This is what a zh/fa reader reads, so
 * it is what the untranslated-text and orthography checks of those locales run on. With `nodes`,
 * the same text is also collected one text node at a time, for the rules that must not read across
 * a tag (two table cells side by side are not one number).
 */
function proseText(html, pageLang, nodes) {
  const start = html.search(/<body\b/i);
  const body = start === -1 ? html : html.slice(start);
  const primary = pageLang.split('-')[0].toLowerCase();
  let out = '';
  let i = 0;
  const stack = [];
  while (i < body.length) {
    const lt = body.indexOf('<', i);
    const chunk = lt === -1 ? body.slice(i) : body.slice(i, lt);
    if (!stack.some((e) => e.skip)) {
      out += chunk;
      if (nodes && chunk.trim()) nodes.push(decodeEntities(chunk));
    }
    if (lt === -1) break;
    if (body.startsWith('<!--', lt)) { const e = body.indexOf('-->', lt); i = e === -1 ? body.length : e + 3; continue; }
    const gt = body.indexOf('>', lt);
    if (gt === -1) break;
    const tag = body.slice(lt, gt + 1);
    i = gt + 1;
    out += ' ';
    const m = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)/.exec(tag);
    if (!m) continue;
    const name = m[2].toLowerCase();
    if (m[1]) { const at = stack.map((e) => e.name).lastIndexOf(name); if (at !== -1) stack.length = at; continue; }
    if (tag.endsWith('/>') || VOID.has(name)) continue;
    const lang = /\slang\s*=\s*["']?([A-Za-z-]+)/i.exec(tag)?.[1];
    stack.push({ name, skip: UNSEEN.has(name) || (lang !== undefined && lang.split('-')[0].toLowerCase() !== primary) });
    if (name === 'script' || name === 'style') { const end = body.toLowerCase().indexOf(`</${name}`, i); if (end !== -1) i = end; }
  }
  return decodeEntities(out).replace(/\s+/g, ' ');
}
/** The strings a SERP, a link preview and a structured-data reader show: title, descriptions, JSON-LD. */
function headStrings(html) {
  const out = [];
  const title = html.match(/<title>([\s\S]*?)<\/title>/);
  if (title) out.push(decodeEntities(title[1]));
  for (const m of html.matchAll(/<meta (?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)" content="([^"]*)"/g)) out.push(decodeEntities(m[1]));
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let ld;
    try { ld = JSON.parse(m[1]); } catch { continue; } // test-seo.mjs fails an unparsable block
    (function collect(v) {
      if (typeof v === 'string') out.push(v);
      else if (Array.isArray(v)) v.forEach(collect);
      else if (v && typeof v === 'object') Object.values(v).forEach(collect);
    })(ld);
  }
  return out;
}
const errors = [];
const warn = [];
/** The one tracking bot (owner-confirmed 2026-09-10). Any other bot handle on a page is a typo. */
const BOT = 'GSR_GROUP_AGENT_bot';
const FORBIDDEN = [
  // "bojsiz" is legitimate when denying the promise ("«bojsiz» degan vaʼda bermaymiz") or naming the
  // statutory duty-free allowance; flag it only when the site promises it.
  [/(?<!«)bojsiz(?!» degan|\s+olib kirish normalari|\s+emas)\s+(olib kelamiz|yetkazamiz|keltiramiz|kargo)/i, 'promises duty-free (bojsiz)'],
  [/hujjatsiz olib kel/i, 'claims shipping without documents'],
  [/rastamojka kerak emas/i, 'claims no customs needed'],
  [/без пошлин\s+(привезём|доставим|возим)/i, 'promises duty-free (RU)'],
  [/eng yaxshi (kargo|logistika)/i, 'unprovable superlative'],
  [/xalqaro kompaniya/i, 'unprovable "international company"'],
  // ---- the QR / bot system, owner-confirmed 2026-09-10 -------------------------------------
  // Staff scan; the client never does. Telling a client to scan is the kind of promise they find
  // out about while standing over a carton, so only the imperative and "you scan" forms are
  // banned — "do I have to scan it myself?" answered with "no" is exactly the copy we want.
  [/\bskanerlang\b|\bskanerlaysiz\b|\bskanerlab oling\b/i, 'tells the client to scan the QR — staff scan, the client never does'],
  // No \b around Cyrillic: JS word boundaries only know ASCII, so \bсканируйте never matches.
  [/про?сканируйте|отсканируйте|сканируйте|вы сканируете|сканируете сами/i, 'tells the client to scan the QR (RU) — staff scan, the client never does'],
  [/\byou (?:can |must |need to |have to )?scan\b|\bscan[^.?!]{0,24}\byourself\b/i, 'tells the client to scan the QR (EN) — staff scan, the client never does'],
  // "skanerlashim kerakmi?" (may I / must I, 1st person, answered "no") is the copy we want;
  // "skanerlashingiz kerak" (you must) is the promise that fails over a carton.
  [/skanerlashingiz\s+(?:kerak|lozim|zarur|shart)/i, 'tells the client they must scan the QR — staff scan, the client never does'],
  // Order matters: "Вам сканировать ничего не нужно" is the denial we publish, "вам нужно
  // сканировать" is the claim we must never publish.
  [/вам\s+(?:нужно|надо|необходимо|придётся|придется)[^.?!]{0,30}сканировать/i, 'tells the client they must scan the QR (RU) — staff scan, the client never does'],
  // Stage-by-stage scanning is not a live position, and saying otherwise invites "why has it not
  // moved since Tuesday". "GPS-trekker" in the prohibited-goods lists is a different thing.
  [/real[\s-]?time|в реальном времени|\breal vaqt/i, 'says real-time — tracking is stage-by-stage QR scanning'],
  // The three ways of saying "live position" — each allowed only inside its own denial, which is
  // exactly how the tracking page uses them ("Bu … jonli joylashuvi emas" / "Это не живая
  // координата машины" / "It is not a live vehicle position").
  [/jonli joylashuv(?![^.!?]{0,12}emas)/i, 'claims a live position — tracking is stage-by-stage QR scanning'],
  [/(?<!не )жив(?:ая|ой|ую|ое) (?:координат|местополож|геолокац)/i, 'claims a live position (RU) — tracking is stage-by-stage QR scanning'],
  [/(?<!not )\ba live (?:vehicle |truck |cargo )?(?:position|location)\b/i, 'claims a live position (EN) — tracking is stage-by-stage QR scanning'],
  [/\bGPS\b(?![\s-]?(?:tracker|trekker|трекер))[^.!?]{0,50}(?:kuzat|отслеж|track)|(?:kuzatuv|kuzatib|отслеживани|tracking)[^.!?]{0,50}\bGPS\b(?![\s-]?(?:tracker|trekker|трекер))/i, 'implies live GPS position — tracking is stage-by-stage QR scanning'],
  // The four figures the owner confirmed on 2026-09-10 are publishable at exactly those values.
  // A drifted number is an invented one; and 15 years belongs to the TEAM, never to GSR, which
  // was founded in 2018 and is written "8+ yil".
  [/(?<!\d)(?!400\+)\d{2,5}\+\s?(?:mijoz|клиент|clients)/i, 'client count other than the confirmed 400+'],
  [/(?<!\d)(?!10\+)\d{1,4}\+\s?(?:fura|фур|trucks?)/i, 'truck count other than the confirmed 10+ a month'],
  // Proof's fact list prints the LABEL first and the number second ("Mijozlar 400+"), so the rule
  // above — which reads number-then-label — never sees the one place this figure actually lives on
  // the home page. Mirror it, with the plural forms only: a bare "клиент 5+" or "fura 40+ tonna"
  // would be a unit, not a count, and a guard that cries wolf gets deleted.
  [/(?:mijozlar|клиентов|клиенты|clients)\s(?!400\+)\d{2,5}\+/i, 'client count other than the confirmed 400+'],
  // GSR itself is 8+ years (2018). No other "N+ years" figure exists on the site, so pinning the
  // whole shape is safe — and it is the one number a drifting "12+ yil" would sail past.
  // `\b` cannot close this one: JS word boundaries are ASCII-only, so "20+ лет" would sail past a
  // trailing \b exactly the way "\bсканируйте" never matches. Close it with an explicit letter class.
  [/(?<!\d)(?!8\+)\d{1,3}\+\s?(?:yil|лет|года|years)(?![a-zA-Zа-яёʻʼ])/i, 'company age other than the confirmed 8+ years (GSR, since 2018)'],
  [/GSR(?![^.!?]{0,24}(?:jamoa|команд|team))[^.!?]{0,24}15\s?(?:yil|лет|years)/i, '15 years belongs to the team, not to GSR (GSR is 8+ years, since 2018)'],
  [/One Belt|Bir makon, bir yoʻl assotsiatsiyasining rasmiy vakili/i, 'unverified association claim'],
  [/viloyat filial/i, 'claims regional branches'],
  // Who operates each of the three China receiving points is unverified — the Guangzhou and Kashgar
  // cards both name third-party logistics firms — so none of them is ever "ours".
  [/omborimiz|наш(его|ем|) склад|our (Yiwu|Guangzhou|Kashgar)[^.]{0,12}warehouse/i, 'claims a China receiving point as our own'],
  // ...nor is it ever "GSR Logistics' Yiwu warehouse" — the possessive says the same thing as "ours".
  [/GSR Logistics(?:ning|нинг|’|')?\s+(?:Ivu|Yiwu|Иву|Иу)\s+(?:ombor|омбор|warehouse|склад)|склад[а-яё]*\s+GSR Logistics\s+в\s+Иу/i, 'names a China receiving point as GSR Logistics’ own'],
  // ...and equally, we no longer receive Guangzhou cargo only "through partners": there is an address.
  [/(Guanchjou|Гуанчжоу|Guangzhou)[^.!?]{0,80}(hamkorlar orqali|через партнёров|through partners)/i, 'stale "through partners" claim for Guangzhou'],
  [/(hamkorlar orqali|через партнёров|through partners)[^.!?]{0,80}(Guanchjou|Гуанчжоу|Guangzhou)/i, 'stale "through partners" claim for Guangzhou'],
  // Owner, 2026-11-08: consolidated cargo starts at 1 m³ and nothing smaller is carried by truck. The old
  // 0,1 m³ billing floor and the small-order offers must not come back (the Cyrillic pages print м³).
  [/(?<![\d.,])0[.,]1\s?(?:m³|м³|m3)(?!\d)/i, 'stale truck minimum 0,1 m³ — consolidated cargo starts at 1 m³'],
  [/1 donadan olamiz|выкупаем от 1 шт|we buy from 1 piece|undan kichik joyni ham olamiz|место меньше мы примем|we take a smaller piece|Kichik posilkalarni ham yigʻma yukka|Small parcels join the consolidated/i, 'offers small orders or sub-minimum truck cargo — the minimum is 1 m³'],
  // Owner, 2026-11-09: rail takes whole containers only (20GP, 40GP, 40HQ and other types); there is
  // no consolidated (LCL) cargo by rail, and consolidated cargo travels by truck only. The FCL/LCL
  // glossary definitions stay; what must not come back is an offer of rail LCL: a choice between FCL
  // and LCL, a "space / part of a container", or consolidated cargo "in a truck or container".
  [/\bFCL\s(?:yoki|или|or)\sLCL\b|\bLCL\s(?:yoki|или|or)\sFCL\b/i, 'offers a choice of FCL or LCL — rail takes whole containers only, no LCL'],
  [/konteynerdagi joy|konteynerda joy oladi|место в контейнере|space in (?:a |one |the )?container|space in one \(LCL|shared containers?\b|konteynerning bir qismi|(?:uning|его) (?:bir qismini|части) \(LCL\)|част[ьи] контейнера|part of (?:a |one )?container|part of one \(LCL\)|temir yoʻl(?:da)? LCL|rail LCL|LCL by rail|ж\/д LCL|LCL по ж\/д/i, 'offers space in a shared container (rail LCL) — rail takes whole containers only'],
  [/(?:fura|furada|furaga) yoki konteyner|фур[аеуы] или контейнер|truck or (?:a )?container\b/i, 'puts consolidated cargo "in a truck or container" — consolidated cargo is truck only; a container means a whole rail container'],
  // Contact details the owner replaced on 2026-09-09; none of them may come back.
  [/\+998 ?97 ?333 ?39 ?33|998973333933/, 'retired second phone number'],
  [/info@gsrlogistics\.uz/i, 'retired e-mail address'],
  [/t\.me\/\+998950183333/, 'retired Telegram phone deep link — use the manager username'],
  // No promise about how fast a reply arrives: the channel is dormant and nobody has staffed a target.
  [/hozir javob beramiz|отвечаем сейчас|answer now, not|Eng tez javob|[Бб]ыстрее всего|fastest reply/i, 'promises a reply speed'],
  [/uzel(ini|i)\b/i, 'Russian loan "uzel" → "tugun"'],
  [/powerbank/i, 'powerbank → power bank'],
];
// The new rules prove themselves before they judge a page.
const misfires = selfTest();
if (misfires.length) {
  console.error(`check-content: ${misfires.length} guard rule(s) fail their own fixtures in scripts/content-rules.mjs:\n  ${misfires.join('\n  ')}`);
  process.exit(1);
}
/** Old rules on the raw text OR its normalised copy (strictly more than before); new rules on the normalised copy. */
const claims = (raw, norm = normalize(raw)) => [
  ...FORBIDDEN.filter(([re]) => re.test(raw) || re.test(norm)).map(([, msg]) => msg),
  ...ZH_FA_FORBIDDEN.filter((r) => r.re.test(norm)).map((r) => `${r.msg} — «${norm.match(r.re)[0].trim().slice(0, 48)}»`),
];
/** The retired second phone, however it is spaced or hyphenated. */
const retiredPhone = (norm) => /998973333933/.test(norm.replace(/[\s\-–.()\xA0\u{202F}]/gu, ''));
const perLocale = Object.fromEntries(LOCALE_CODES.map((c) => [c, { errors: 0, warnings: 0 }]));
const pending = []; // { url, runs } — untranslated text on a pending locale's page
const quotesOf = new Map(); // en page url → the foreign quotes its translations may keep
const enQuotes = (url) => {
  if (!quotesOf.has(url)) {
    const f = path.join(dist, ...url.split('/').filter(Boolean), 'index.html');
    quotesOf.set(url, fs.existsSync(f) ? quotedForeign(proseText(fs.readFileSync(f, 'utf8'), LOCALES.en.htmlLang)) : new Set());
  }
  return quotesOf.get(url);
};
for (const file of walk(dist)) {
  const url = '/' + path.relative(dist, path.dirname(file)).replace(/\\/g, '/') + '/';
  const html = fs.readFileSync(file, 'utf8');
  const text = strip(html);
  const norm = normalize(text);
  const code = localeOfPath(url);
  // uz and the Cyrillic uzc share the Uzbek rules, exactly as before there was a locale table.
  const lang = code === 'uzc' ? 'uz' : code;
  const errorsBefore = errors.length;
  const warnBefore = warn.length;
  for (const [re, msg] of FORBIDDEN) if (re.test(text) || re.test(norm)) errors.push(`${url}: ${msg}`);
  for (const r of ZH_FA_FORBIDDEN) if (r.re.test(norm)) errors.push(`${url}: ${r.msg} — «${norm.match(r.re)[0].trim().slice(0, 48)}»`);
  if (retiredPhone(norm) && !errors.slice(errorsBefore).some((e) => e.endsWith('retired second phone number'))) errors.push(`${url}: retired second phone number`);
  // One bot, one username, everywhere — visible text, hrefs and JSON-LD alike (so this reads the
  // raw HTML, not the stripped copy). A single wrong character hands a client to a stranger's bot.
  const bots = new Set();
  for (const m of html.matchAll(/(?:@|t\.me\/)([A-Za-z0-9_]{4,32})(?![A-Za-z0-9_.@-])/g))
    if (/bot$/i.test(m[1]) && m[1] !== BOT) bots.add(m[1]);
  for (const b of bots) errors.push(`${url}: unknown Telegram bot @${b} — the only one is @${BOT}`);
  if (lang === 'uz') {
    const bad = text.match(/\b[a-zA-Z]+['’][a-z]{1,4}\b/g) || [];
    const real = bad.filter((w) => !/^(don|isn|doesn|won|can|it|that|Alibaba|Logistics)/i.test(w));
    if (real.length) warn.push(`${url}: ASCII/typographic apostrophe in Uzbek: ${[...new Set(real)].slice(0, 4).join(', ')}`);
    for (const [re, msg] of [[/\bKitay\b/, 'Kitay → Xitoy'], [/\bzayavka\b/i, 'zayavka → soʻrov'], [/amalga oshiramiz/i, 'calque "amalga oshiramiz"'], [/\btomonidan\b/, 'passive "tomonidan"'], [/Sizning yukingiz/, 'calque "Sizning yukingiz"']])
      if (re.test(text)) errors.push(`${url}: ${msg}`);
    // A parenthesised English form is a deliberate glossary gloss: "Xorgos (Khorgos)".
    if (/(?<!\()\b(Guangzhou|Shenzhen|Almaty|Shymkent|Khorgos|Yiwu)\b(?!\))/.test(text)) warn.push(`${url}: English toponym in Uzbek copy`);
  }
  // The two style rules read Persian digits too, but keep the Persian thousands separator as one:
  // "÷ ۵٬۰۰۰" is separated, so it must not turn into "÷ 5000" here.
  const styled = normalize(text.replace(/\u{066C}/gu, ','));
  if (/\d %/.test(text) || /\d %/.test(styled)) warn.push(`${url}: spaced percent`);
  if (/÷ ?\d{4}\b/.test(text) || /÷ ?\d{4}\b/.test(styled)) warn.push(`${url}: unseparated divisor`);
  // Uzbek terms glossed for the reader ("in Uzbek it is yigʻma yuk") are intentional.
  if ((lang === 'ru' || lang === 'en') && /(?<!(in Uzbek it is |по-узбекски — ))(Ivu ombor|yigʻma yuk|bojxona rasmiylashtiruvi)/.test(text)) warn.push(`${url}: Uzbek word in ${lang} copy`);
  if (lang === 'en' && /soʻm/.test(text)) warn.push(`${url}: "soʻm" in English copy (use UZS)`);
  if ((lang === 'zh' || lang === 'fa') && /soʻm/.test(text)) warn.push(`${url}: "soʻm" in ${lang} copy (zh 苏姆, fa سوم)`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${url}: ${h1} h1 elements`);

  // The strings outside <main> that a SERP, a link preview or a structured-data reader quotes.
  const surfaces = new Set();
  for (const s of headStrings(html)) for (const msg of claims(s)) surfaces.add(msg);
  for (const s of headStrings(html)) if (retiredPhone(normalize(s))) surfaces.add('retired second phone number');
  for (const msg of surfaces) errors.push(`${url} (title/meta/JSON-LD): ${msg}`);

  // Chinese and Persian pages: their own orthography, and no untranslated text.
  if (lang === 'zh' || lang === 'fa') {
    const nodes = [];
    const head = [...headStrings(html).slice(0, 1), decodeEntities((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? '')];
    const own = [proseText(html, LOCALES[lang].htmlLang, nodes), ...head].join(' \n ');
    nodes.push(...head);
    for (const r of PAGE_RULES[lang]) {
      for (const t of r.textNode ? nodes : [own]) {
        const m = t.match(r.re);
        if (!m) continue;
        (r.level === 'error' ? errors : warn).push(`${url}: ${r.msg} — «${t.slice(Math.max(0, m.index - 12), m.index + m[0].length + 12).trim()}»`);
        break;
      }
    }
    const runs = leakRuns(own, enQuotes(`${LOCALES.en.prefix}${unprefixed(url, lang)}`));
    if (runs.length && isPending(lang)) pending.push({ url, lang, runs });
    else if (runs.length) errors.push(`${url}: ${runs.length} run(s) of untranslated English/Uzbek/Russian text — «${runs[0].slice(0, 60)}»${runs.length > 1 ? `, «${runs[1].slice(0, 40)}»…` : ''}`);
  }
  perLocale[code].errors += errors.length - errorsBefore;
  perLocale[code].warnings += warn.length - warnBefore;
}
// llms.txt is hand-written and read by every assistant that cites the site: the same claims apply.
const llmsFile = path.join(dist, 'llms.txt');
if (fs.existsSync(llmsFile)) {
  const txt = fs.readFileSync(llmsFile, 'utf8');
  for (const msg of claims(txt)) errors.push(`llms.txt: ${msg}`);
  if (retiredPhone(normalize(txt)) && !claims(txt).includes('retired second phone number')) errors.push('llms.txt: retired second phone number');
}
/** How many lines to print per list (CHECK_MAX=… shows more, as in check-kirill.mjs, when one component breaks a whole locale). */
const SHOW = Number(process.env.CHECK_MAX ?? 40);
const out = (label, list) => { if (list.length) { console.log(`\n${label} (${list.length}):`); for (const l of list.slice(0, SHOW)) console.log('  ' + l); if (list.length > SHOW) console.log(`  … and ${list.length - SHOW} more`); } };
out('WARNINGS', warn);
out('ERRORS', errors);
if (pending.length) {
  const words = (p) => p.runs.join(' ').split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
  const langs = [...new Set(pending.map((p) => p.lang))].sort().join(', ');
  console.log(`\nPENDING (${langs} — still being translated; counted, not failed): untranslated text on ${pending.length} pages, ~${pending.reduce((n, p) => n + words(p), 0)} words`);
  for (const p of pending.slice(0, 40)) console.log(`  ${p.url}: ~${words(p)} words in ${p.runs.length} runs — «${p.runs[0].slice(0, 60)}»`);
  if (pending.length > 40) console.log(`  … and ${pending.length - 40} more pages`);
}
const byLocale = LOCALE_CODES.map((c) => `${c} ${perLocale[c].errors}/${perLocale[c].warnings}`).join(' · ');
console.log(`\nchecked ${walk(dist).length} pages · ${errors.length} errors · ${warn.length} warnings (errors/warnings per locale: ${byLocale}) · ${ZH_FA_FORBIDDEN.length} zh/fa claim rules passed their fixtures${pending.length ? ` · ${pending.length} pending-locale pages with untranslated text` : ''}`);
process.exit(errors.length ? 1 : 0);
