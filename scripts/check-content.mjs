// Content guard rails: run after every build (npm run check:content).
// Fails on forbidden claims, wrong apostrophes, inconsistent number/percent style and
// language leaks between the six locale trees. Keeps the site honest as content changes.
//
// What runs where — the page's locale comes from scripts/locales.mjs, the table every script shares:
//   · FORBIDDEN (uz/ru/en claims) and CLAIM_RULES (scripts/content-rules.mjs: the same business
//     rules in Chinese and Persian, and the rules written for all five languages and Uzbek Cyrillic
//     at once — where GSR delivers, who answers in Persian, the Afghanistan direction) run on EVERY
//     page: on the <main> text, raw and normalised (Persian/Arabic-Indic/full-width digits, bidi
//     marks, Arabic ي/ك, spaces between CJK characters — see normalize()), and on the <title>, the
//     meta/OG/Twitter descriptions and every JSON-LD string; then once on dist/llms.txt. A rule
//     marked `block` reads the same text one block at a time (blocks(), paragraphs()): a paragraph,
//     a heading, a list item, a table row — its window must not reach from one card into the next.
//   · The Uzbek style rules run on uz and uzc pages only; the "Uzbek word in ru/en copy" rule on
//     ru and en. Chinese and Persian pages get their own orthography rules instead (PAGE_RULES)
//     and an untranslated-text check: English, Uzbek or Russian prose on a zh/fa page is an ERROR
//     once the locale is finished (zh and fa both are), and only counted in a PENDING list while a
//     locale is still listed in src/i18n/config.ts `PendingLang`, because until then pick() shows
//     the English branch. The office's official street address, exactly as src/lib/site.ts writes
//     it, is not prose where Chinese or Persian text surrounds it: a translation may print it for a
//     taxi driver (STREET_ADDRESS in content-rules.mjs). With an Uzbek or English word beside it, it
//     is untranslated text like any other.
//   · Every new rule carries the sentences it must catch and the ones it must let through, and
//     they are asserted before any page is read: a rule that misfires on its own fixtures fails
//     the build. A sentence a rule lets through is one the site may say, so it must pass every
//     other rule as well — the uz/ru/en FORBIDDEN list included.
import fs from 'node:fs';
import path from 'node:path';
import { LOCALES, LOCALE_CODES, isPending, localeOfPath, unprefixed } from './locales.mjs';
import { CLAIM_RULES, PAGE_RULES, normalize, leakRuns, quotedForeign, selfTest } from './content-rules.mjs';
import { checkWorks } from './works-blocks.mjs';
const dist = process.argv[2] || 'dist';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'index.html' ? [path.join(d, e.name)] : []);
/** The <main> element without what nobody reads: scripts, styles, inline SVG. */
const mainMarkup = (html) => (html.match(/<main[\s\S]*?<\/main>/) || [''])[0]
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ');
const entities = (text) => text.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
const strip = (html) => entities(mainMarkup(html).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
/**
 * Elements that do not end a statement: phrasing content, the cells of one table row ("China → Afghanistan | by
 * truck") and the value of a term ("Truck cargo | from … /m³": <dt> starts the statement, and neither </dt> nor
 * <dd> ends it).
 */
const INLINE = new Set(['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dd', 'del', 'dfn', 'em', 'i', 'ins', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'td', 'th', 'time', 'u', 'var', 'wbr']);
/**
 * The text of strip(), one block at a time: a paragraph, a heading, a list item, a table row, a term with its
 * value, a caption. The rules marked `block` in content-rules.mjs read these instead of the joined text. A
 * window of 60 characters around "Afghanistan" would otherwise reach from one card into the next: on the home
 * page «20–35 kun» of the rail card stands right before the heading «Yangi yoʻnalish: Afgʻoniston…», and a rule
 * that fails the build on that is a rule that gets deleted. (Two blocks are never read together: a figure in
 * one paragraph and the place in the next pass. BLOCK_FIXTURES below pins what is one statement.)
 */
const blocks = (html) => entities(mainMarkup(html)
  .replace(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)[^>]*>/g, (_, closing, name) => (INLINE.has(name.toLowerCase()) || (closing && name.toLowerCase() === 'dt') ? ' ' : '\n'))
  .replace(/<[^>]+>/g, ' '))
  .split('\n').map((block) => block.replace(/\s+/g, ' ').trim()).filter(Boolean);
/** llms.txt one paragraph or list item at a time: its lines are hard-wrapped, so a line is not a statement — and a list item is. */
const paragraphs = (txt) => txt.split(/\n\s*\n|\n(?=\s*(?:[-*#>]|\d+\.)\s)/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
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
/*
 * The monthly volume. Owner, 2026-11-11: «hozirda bizda 1 oyda 50–100 ta konteyner tashiyapmiz» — GSR
 * carries 50–100 containers a month. It replaces the monthly truck count of 2026-09-10, so a truck count
 * with a "+" is stale wherever it stands, and a figure "a month" is publishable only as 50–100 containers,
 * however it is phrased: «oyiga 50–100 (ta) konteyner», «50 dan 100 gacha konteyner», «от 50 до 100
 * контейнеров в месяц», «50 to 100 containers a month». Any other number of trucks or containers a month,
 * or a container count with a "+", is an invented figure. The month word may stand on either side of the
 * count, within one sentence (the about page's tile prints "50–100" and then "containers a month").
 * Like the zh/fa rules, these prove themselves on VOLUME_FIXTURES before any page is read.
 */
const VOL_NOUN = '(?:fura|фур|trucks?|lorr(?:y|ies)|konteyner|контейнер|containers?|TEU)';
// "A month" as a rate. After a count, a duration is not a volume ("2 containers, arriving in about a month",
// "bir oyda yetib keladi", "дойдут за месяц"), so the count-first rule reads only these words.
const VOL_PER_MONTH = "(?:(?<![a-zʻ’'ʼ])(?:oyiga|har oy)|/oy(?![a-zʻ’'ʼ])|(?<![а-яёўқғҳ])(?:ойига|ҳар ой)|/ой(?![а-яёўқғҳ])|в месяц|ежемесячно|каждый месяц|/мес|(?<!(?:in|within|about|around|roughly|nearly|almost|after|for|over|under|than|takes|take|took) )a month|per month|monthly|each month|every month|/month|/mo(?![a-z]))";
// Before a count, "1 oyda", "за месяц" and "in a month" are rates too («1 oyda 50–100 ta konteyner tashiyapmiz»).
// The letter guards keep "oyda" inside "foydalanish" out; "shu / bu / oʻtgan / kelasi oyda" is one month, not a
// rate («Shu oyda Ivuda 3 ta konteyner yuklandi» in a works caption), as "this month" and "в этом месяце" are.
const VOL_MONTH = `(?:${VOL_PER_MONTH}|(?<![a-zʻ’'ʼ])(?<!(?:shu|bu|o[ʻ'’‘]tgan|kelasi|keyingi|joriy|oxirgi|birinchi|ikkinchi) )oyda|(?<![а-яёўқғҳ])(?<!(?:шу|бу|ўтган|келаси|кейинги|жорий|охирги|биринчи|иккинчи) )ойда|за месяц|in a month)`;
// A range: "50–100", "50 - 100", "50 to 100", "от 50 до 100", "50 dan 100 gacha", "between 50 and 100" (the
// Cyrillic pages print the Uzbek one as "50 дан 100 гача").
const VOL_SEP = '(?:\\s?[‒–—−-]\\s?|\\s(?:to|до|dan|дан|and|va|ва|и)\\s)';
// "Up to": "100 gacha", "100 tagacha" (Cyrillic "100 тагача").
const VOL_UPTO = '(?:\\s?(?:ta|та)?(?:gacha|гача))?';
// A number or a range that does not start inside another one: the "100" of "50–100" is not a count of its own.
const VOL_NUM = `(?<!\\d|\\d[.,]|\\d${VOL_SEP})\\d{1,5}(?:${VOL_SEP}\\d{1,5})?${VOL_UPTO}`;
// "More than 100": "100 (ta)dan ortiq / koʻp(roq)", "100 с лишним", "100-odd", "100-plus", "100 or so".
const VOL_MORE = "(?:\\s(?:ta|та)?(?:dan|дан)\\s(?:ortiq|ziyod|oshiq|ko[ʻ'’‘`]p|ортиқ|зиёд|ошиқ|кўп)(?:roq|роқ)?|\\sс\\s(?:лишним|небольшим)|-?\\s?(?:odd|plus)(?![a-z])|\\sor\\sso)";
// A count in words, the vague and inflating kind: "yuzlab", "yuzdan ortiq", "сотни", "hundreds of", "a hundred".
const VOL_WORDNUM = "(?:(?:yuz|ming|o[ʻ'’‘`]n)(?:lab|larcha)|(?:юз|минг|ўн)(?:лаб|ларча)|(?:yuz|ming|юз|минг)(?:ta|та)(?:gacha|гача)?|(?:yuz|ming|юз|минг)(?:ta|та)?(?:dan|дан)\\s(?:ortiq|ziyod|oshiq|ko[ʻ'’‘`]p|ортиқ|зиёд|ошиқ|кўп)(?:roq|роқ)?|сот(?:ни|ен|ня|ню)|тысяч[аиу]?|десят(?:ки|ков|ок)|(?:hundreds|thousands|dozens|tens) of|a (?:hundred|thousand))";
const VOL_OK = `(?!50${VOL_SEP}100(?!\\d)${VOL_UPTO}\\s?(?:ta\\s|та\\s)?(?:konteyner|контейнер|container))`;
const VOL_COUNT = `(?:${VOL_OK}${VOL_NUM}${VOL_MORE}?|(?<![a-zа-яёўқғҳʻ’'ʼ])${VOL_WORDNUM})\\s?(?:\\+\\s?)?(?:ta\\s|та\\s)?${VOL_NOUN}`;
const VOLUME_RULES = [
  [new RegExp(`(?<!\\d)\\d{1,5}\\s?\\+\\s?(?:ta\\s|та\\s)?${VOL_NOUN}`, 'i'), 'truck or container count with a "+" — the confirmed volume is 50–100 containers a month (owner, 2026-11-11), and no truck count is published'],
  [new RegExp(`${VOL_MONTH}[^.!?]{0,40}?${VOL_COUNT}`, 'i'), 'monthly volume other than the confirmed 50–100 containers a month'],
  [new RegExp(`${VOL_COUNT}[^.!?]{0,40}?${VOL_PER_MONTH}`, 'i'), 'monthly volume other than the confirmed 50–100 containers a month'],
];
const VOLUME_FIXTURES = {
  bad: [
    // the retired figure, as the pages printed it until 2026-11-11
    'Oyiga 10+ fura Xitoydan Toshkentga keladi', '10+ fura oyiga, Xitoydan Toshkentga', 'Ойига 10+ фура Хитойдан Тошкентга',
    '10+ фур в месяц из Китая в Ташкент', 'В месяц из Китая в Ташкент приходит 10+ фур', '10+ trucks a month arrive from China in Tashkent',
    'Tashkent, since 2018; 10+ trucks a month, 400+ clients',
    // any other monthly count, and container counts with a "+"
    'Oyiga 20 fura keladi', 'oyiga 10 dan ortiq fura', '50–100 trucks a month', '40–50 konteyner/oy', 'oyiga 200 konteyner',
    'oyiga 100 dan ortiq konteyner', '1 oyda 50–200 ta konteyner', '100+ konteyner', '4000+ containers', 'в месяц приходит 60–120 контейнеров',
    'от 40 до 50 контейнеров в месяц', '40 to 50 containers a month', 'over 100 containers a month', '50+ containers a month',
    '50–100+ containers a month', 'between 60 and 120 containers every month', 'har oy 30 ta fura keladi',
    'In a month we carry 200 containers', 'за месяц перевозим 200 контейнеров',
    // "more than", "up to" and counts in words
    'Oyiga 100 tadan ortiq konteyner keladi', 'oyiga 10 tadan koʻp fura', 'oyiga 100 dan koʻproq konteyner', 'Ойига 100 тадан ортиқ контейнер келади',
    'Oyiga 100 tagacha konteyner tashiymiz', 'Ойига 40 дан 50 гача контейнер', 'oyiga yuzlab konteyner', 'Oyiga oʻnlab fura Xitoydan keladi',
    'oyiga yuzdan ortiq konteyner', 'сотни контейнеров в месяц', 'Каждый месяц — десятки фур из Китая', 'около сотни контейнеров в месяц',
    '100 с лишним контейнеров в месяц', 'hundreds of containers a month', 'dozens of trucks every month', 'over a hundred containers a month',
    '100-odd containers a month', '100-plus containers a month', '100 or so containers a month',
    'Oyda 200 ta konteyner tashiymiz', 'Bir oyda 120 ta konteyner', 'oyiga yuzta konteyner', 'oyiga yuzlarcha fura', 'перевозим сотню контейнеров в месяц',
  ],
  good: [
    'Oyiga 50–100 konteyner Xitoydan Toshkentga keladi, 400+ mijozga xizmat koʻrsatganmiz.', 'hozirda bizda 1 oyda 50–100 ta konteyner tashiyapmiz',
    '50–100 konteyner oyiga, Xitoydan Toshkentga', '50 dan 100 gacha konteyner oyiga', 'Ойига 50–100 контейнер Хитойдан Тошкентга келади',
    'В месяц из Китая в Ташкент приходит 50–100 контейнеров, обслужено 400+ клиентов.', 'от 50 до 100 контейнеров в месяц',
    'Tashkent, since 2018; 50–100 containers a month, 400+ clients;', '50 to 100 containers a month', 'between 50 and 100 containers a month',
    '50-100 containers per month',
    // counts that are not GSR's monthly volume
    'Regular wholesale importers: one container a month, with price and timing known in advance.', 'Muntazam import qiluvchi ulgurjichilar: oyiga bir konteyner',
    'Регулярный опт: контейнер в месяц — цена и срок известны заранее.', '20 futlik konteyner Xitoydan Toshkentgacha taxminan 2 800–5 500 $',
    'Lots above 10 m³: a 20 ft or 40 ft container', 'Torugart handles over 300 trucks a day', 'shaxsiy foydalanish uchun 10 konteyner',
    'telefon — oyiga 1 dona', 'up to $200 per month by courier', '2 containers loaded in Yiwu, arriving in about a month',
    '2 ta konteyner yuklandi, bir oyda Toshkentga yetib keladi', '2 контейнера дойдут до Ташкента за месяц', '3 trucks left today; they take a month',
    'Ойига 50 дан 100 гача контейнер келади', 'oyiga 50 dan 100 tagacha konteyner', 'Hundreds of trucks cross Khorgos every day',
    'a truck carrying a hundred clients’ cargo',
    // one named month is not a rate (works captions)
    'Shu oyda Ivuda 3 ta konteyner yuklandi', 'Oʻtgan oyda 4 ta fura joʻnatildi', 'Шу ойда Ивуда 3 та контейнер юкланди',
  ],
};
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
  // The figures the owner confirmed (2026-09-10; the monthly volume on 2026-11-11, VOLUME_RULES above)
  // are publishable at exactly those values. A drifted number is an invented one; and 15 years belongs
  // to the TEAM, never to GSR, which was founded in 2018 and is written "8+ yil".
  [/(?<!\d)(?!400\+)\d{2,5}\+\s?(?:mijoz|клиент|clients)/i, 'client count other than the confirmed 400+'],
  ...VOLUME_RULES,
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
/*
 * "Our warehouse". The two rules above are as they were. Since 2026-11-11 GSR also allocates space in a warehouse
 * under customs control in Tashkent, and that warehouse is a PARTNER's (owner) — so it is never "our warehouse"
 * either, and «omborimiz» / «наш склад» stay banned wherever the warehouse stands. What the pages say instead is
 * pinned here (the Chinese and Persian twins are fixtures of zh.ourWarehouse and fa.ourWarehouse).
 */
const WAREHOUSE_RULES = FORBIDDEN.filter(([, msg]) => msg.includes('China receiving point'));
const WAREHOUSE_FIXTURES = {
  bad: ['Ivudagi omborimiz', 'Toshkentdagi omborimizdan joy ajratamiz', 'наш склад в Иу', 'место на нашем складе в Ташкенте', 'our Yiwu warehouse', 'GSR Logistics’ Yiwu warehouse', 'склад GSR Logistics в Иу'],
  good: [
    'Toshkentdagi ombordan joy ajratamiz', 'Hamkor omboridan joy ajratamiz; yukni furadan furaga yoki ombor orqali qayta yuklaymiz.', 'hamkorimizning ombori',
    'Ombor hamkorimizga tegishli; yuk u yerda bojxona nazorati ostida saqlanadi.', 'Ivu ombori', 'Toshkent ombori',
    'Выделяем место на складе в Ташкенте', 'Выделяем место на складе партнёра; перегружаем груз из фуры в фуру или через склад.', 'склад партнёра',
    'Склад принадлежит нашему партнёру; груз хранится там под таможенным контролем.',
    'We allocate warehouse space in Tashkent', 'Space in a partner’s warehouse; transshipment truck to truck or through the warehouse.', 'a partner’s warehouse',
    'The warehouse belongs to our partner; cargo is stored there under customs control.',
  ],
};
// The new rules prove themselves before they judge a page. A sentence a rule must let through is one the site
// may say, so it has to pass EVERY rule that reads a page: this list and the claim rules of content-rules.mjs
// (selfTest() has checked those against one another). stoppedBy() names every rule that would stop a sentence.
const stoppedBy = (s, norm = normalize(s)) => [
  ...FORBIDDEN.filter(([re]) => re.test(s) || re.test(norm)).map(([, msg]) => msg),
  ...CLAIM_RULES.filter((r) => r.re.test(norm)).map((r) => r.msg),
];
/**
 * The claim rules of content-rules.mjs on one normalised text. A `block` rule reads `parts` — the same text one
 * block at a time — and its excerpt is longer: what it found is two things up to 60 characters apart.
 */
const claimHits = (norm, parts = [norm]) => CLAIM_RULES.flatMap((r) => {
  let found = null;
  for (const text of r.block ? parts : [norm]) if ((found = text.match(r.re))) break;
  return found ? [`${r.msg} — «${found[0].trim().slice(0, r.block ? 96 : 48)}»`] : [];
});
/*
 * blocks() and the `block` rules together, on markup: what is one statement and what is two. Without them the
 * first good fixture — the home page's rail card and the heading after it — fails the build on every locale.
 */
const BLOCK_FIXTURES = {
  good: [
    '<li><h3>Temir yoʻl va konteyner</h3><p>20–35 kun</p></li></ul><h3>Yangi yoʻnalish: Afgʻoniston, tranzit va ombor</h3>',
    '<p>Rail and containers: 20–35 days</p><h3>A new direction: Afghanistan, transit and warehouse</h3>',
    '<p class="side-line">Hairatan · Mazar-i-Sharif</p><p class="side-phone">+998 00 000 00 00</p><p>Mon–Sat 9:00–19:00</p><h3>Customs clearance</h3><p>1–3 days</p>',
  ],
  bad: [
    '<table><tr><th>China → Afghanistan</th><td>by truck</td><td>12–15 days</td></tr></table>',
    '<dl><dt>To Hairatan</dt><dd>5–7 days</dd></dl>',
    '<p>To <strong>Mazar-i-Sharif</strong> in <span>5–7 days</span></p>',
    '<li><span>Hayratongacha</span> <span>5–7 kun</span></li>',
  ],
};
const markupHits = (html) => claimHits(normalize(strip(`<main>${html}</main>`)), blocks(`<main>${html}</main>`).map(normalize));
const fixtureMisfires = [
  ...VOLUME_FIXTURES.bad.filter((s) => !VOLUME_RULES.some(([re]) => re.test(s) || re.test(normalize(s)))).map((s) => `the volume rules miss their bad sentence: ${s}`),
  ...VOLUME_FIXTURES.good.flatMap((s) => stoppedBy(s).map((msg) => `«${msg}» fires on the good volume sentence: ${s}`)),
  ...WAREHOUSE_FIXTURES.bad.filter((s) => !WAREHOUSE_RULES.some(([re]) => re.test(s) || re.test(normalize(s)))).map((s) => `the "our warehouse" rules miss their bad sentence: ${s}`),
  ...WAREHOUSE_FIXTURES.good.flatMap((s) => stoppedBy(s).map((msg) => `«${msg}» fires on the good warehouse sentence: ${s}`)),
  ...CLAIM_RULES.flatMap((r) => r.good.flatMap((s) => FORBIDDEN.filter(([re]) => re.test(s) || re.test(normalize(s))).map(([, msg]) => `«${msg}» fires on the good sentence of ${r.id}: ${s}`))),
  ...BLOCK_FIXTURES.good.flatMap((html) => markupHits(html).map((msg) => `a block rule reads two blocks as one — «${msg}» on: ${html}`)),
  ...BLOCK_FIXTURES.bad.filter((html) => !markupHits(html).length).map((html) => `the block rules miss one block: ${html}`),
];
const misfires = [...selfTest(), ...fixtureMisfires];
if (misfires.length) {
  console.error(`check-content: ${misfires.length} guard rule(s) fail their own fixtures (scripts/content-rules.mjs; VOLUME_FIXTURES, WAREHOUSE_FIXTURES and BLOCK_FIXTURES in scripts/check-content.mjs):\n  ${misfires.join('\n  ')}`);
  process.exit(1);
}
/** Old rules on the raw text OR its normalised copy (strictly more than before); the claim rules on the normalised copy. */
const claims = (raw, norm = normalize(raw), parts = [norm]) => [
  ...FORBIDDEN.filter(([re]) => re.test(raw) || re.test(norm)).map(([, msg]) => msg),
  ...claimHits(norm, parts),
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
  for (const msg of claimHits(norm, blocks(html).map(normalize))) errors.push(`${url}: ${msg}`);
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
// The works blocks (src/content/works/): their media and the 50 MB video limit, every published block on each
// locale's works page and the newest three on its home page, and no block text in a language other than the page's
// own — the page text, the alts and labels, and the block's JSON-LD (scripts/works-blocks.mjs).
const works = await checkWorks(dist);
for (const e of works.errors) errors.push(`works: ${e}`);
for (const w of works.warnings) warn.push(`works: ${w}`);
// llms.txt is hand-written and read by every assistant that cites the site: the same claims apply.
const llmsFile = path.join(dist, 'llms.txt');
if (fs.existsSync(llmsFile)) {
  const txt = fs.readFileSync(llmsFile, 'utf8');
  const found = claims(txt, normalize(txt), paragraphs(txt).map(normalize));
  for (const msg of found) errors.push(`llms.txt: ${msg}`);
  if (retiredPhone(normalize(txt)) && !found.includes('retired second phone number')) errors.push('llms.txt: retired second phone number');
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
console.log(`\nchecked ${walk(dist).length} pages · ${errors.length} errors · ${warn.length} warnings (errors/warnings per locale: ${byLocale}) · ${CLAIM_RULES.length} claim rules passed their fixtures${pending.length ? ` · ${pending.length} pending-locale pages with untranslated text` : ''}\n${works.summary}`);
process.exit(errors.length ? 1 : 0);
