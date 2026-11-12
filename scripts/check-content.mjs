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
//     meta/OG/Twitter descriptions and every JSON-LD string; on the site header and footer (once per locale); then on dist/llms.txt and the hand-written header of dist/llms-full.txt. A rule
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
import { AFGHAN_NAME, CLAIM_RULES, PAGE_RULES, REQUEST_FIGURE, REQUEST_FIGURE_OK, normalize, leakRuns, quotedForeign, selfTest } from './content-rules.mjs';
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
const blocksOf = (markup) => entities(markup
  .replace(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)[^>]*>/g, (_, closing, name) => (INLINE.has(name.toLowerCase()) || (closing && name.toLowerCase() === 'dt') ? ' ' : '\n'))
  .replace(/<[^>]+>/g, ' '))
  .split('\n').map((block) => block.replace(/\s+/g, ' ').trim()).filter(Boolean);
const blocks = (html) => blocksOf(mainMarkup(html));
/**
 * The page's chrome — the site header (the menu of all services, with their one-line descriptions) and the footer
 * (the company sentence, the list of services). It stands outside <main> on every page, so until 2026-11-12 no claim
 * rule read it, although the footer sentence names Afghanistan in six languages.
 */
const chromeMarkup = (html) => [...html.matchAll(/<(header|footer)\b[^>]*\bid="site-(?:header|footer)"[\s\S]*?<\/\1>/g)].map((m) => m[0]).join('\n')
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ');
/** The sentences of a block: a full stop, a question or exclamation mark, a semicolon, in any script of the site. */
const sentences = (block) => block.split(/(?<=[.!?;؟؛])\s+|(?<=[。！？；])/u).map((s) => s.trim()).filter(Boolean);
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
  [/omborimiz(?!\s+(?:yo[ʻ'’‘`]?q|emas)(?![a-zʻʼ]))|омборимиз(?!\s+(?:йўқ|эмас)(?![а-яёўқғҳ]))|наш(его|ем|) склад(?!ск)(?!а(?:\s+[а-яёА-ЯЁ]+){0,3}\s+нет(?![а-яё]))|our (Yiwu|Guangzhou|Kashgar)[^.]{0,12}warehouse/i, 'claims a China receiving point as our own'],
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
  bad: ['Ivudagi omborimiz', 'Ивудаги омборимиз', 'Omborimiz yoʻnalishning boshida joylashgan', 'Toshkentdagi omborimizdan joy ajratamiz', 'наш склад в Иу', 'на нашем складе нет очередей', 'место на нашем складе в Ташкенте', 'our Yiwu warehouse', 'GSR Logistics’ Yiwu warehouse', 'склад GSR Logistics в Иу'],
  good: [
    'Oʻz omborimiz yoʻq — joyni hamkor omboridan ajratamiz.', 'Bu bizning omborimiz emas', 'Ўз омборимиз йўқ', 'Нашего склада в Ташкенте нет: склад принадлежит партнёру.', 'У нашего складского партнёра груз хранится под таможенным контролем.',
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
/*
 * PAGE-SCOPED RULES — the pages of the three on-request services (cargo to Afghanistan, transit documents, the
 * warehouse under customs control), in all six locales. What is true everywhere else is false there:
 *
 *   request.ours      English, Chinese and Persian may say "our warehouse" of the warehouse where cargo from China is
 *                     handed over; on these pages the only warehouse is the PARTNER's, so nothing may call a
 *                     warehouse "ours" — in any wording: «bizning ombor», «oʻz omborida», «наш таможенный склад»,
 *                     «на своём складе», "our Tashkent customs warehouse", "its own bonded warehouse", 自有的监管
 *                     场所, «گدام ما» (the Afghan word the fa pages themselves use). The denial passes: "this is not
 *                     our own warehouse" is the fact the page has to state.
 *   request.figure    no price, no time, no volume and no area is published for these services, so NO such figure
 *                     may stand on the page at all — a hero fact «7–10 kun», a table cell, "storage up to 30 days",
 *                     "2,000 m²" — unless its sentence names the China → Tashkent route («1 m³ … Xitoydan
 *                     Toshkentga»). The claim rules *.afghanFigure need the place name in the same sentence; a fact
 *                     tile or the next sentence has none. The cards of the related services are read too:
 *                     since 2026-11-12 a tariff service prints no number line on these pages.
 *   request.type      the legal regime of the warehouse is not confirmed (owner, 2026-11-11): never "customs
 *                     warehouse", "bonded", «СВХ», 保税 — the pages say "warehouse under customs control".
 *   request.sanction  the owner decided to print no sentence about sanctioned goods on these pages (FACTS §11).
 *
 * `units`: 'blocks' reads one block of <main> at a time, 'sentences' one sentence of a block. Each rule also reads
 * the <title> and the descriptions of the page. Each carries its sentences, asserted below like every other rule.
 */
const REQUEST_SLUGS = ['afgonistonga-yuk-tashish', 'афғонистонга-юк-ташиш', 'gruzy-v-afganistan', 'cargo-to-afghanistan', 'tranzit-hujjatlari', 'транзит-ҳужжатлари', 'tranzitnye-dokumenty', 'transit-documents', 'bojxona-ombori', 'божхона-омбори', 'tamozhennyj-sklad', 'customs-warehouse-tashkent'];
const ON_REQUEST_PAGE = new RegExp(`/(?:${REQUEST_SLUGS.join('|')})/$`);
const OUR_WAREHOUSE = new RegExp([
  // en: "our (own) (Tashkent customs) warehouse", "GSR's warehouse", "its own bonded warehouse", "our own facility" — not "our warehouse partner", not "not our own warehouse"
  String.raw`(?<!\bnot\s)\b(?:our|its|GSR(?:\s+Logistics)?[’']s?)\s+(?:(?:own|Tashkent|customs(?:-controlled)?|bonded|secure|supervised|licensed|temporary|storage)\s+){0,3}(?:warehouses?(?!\s+partner)|facilit(?:y|ies)|depots?)\b|\b(?:warehouse|facility)\s+(?:is\s+)?(?:owned|operated|run)\s+by\s+(?:us|GSR)`,
  // zh: 我们(自己)的…仓库 (not 我们的合作方仓库, not 不是我们的仓库), 自有/自己的仓库 (not 没有自己的仓库), GSR 经营的…仓库
  String.raw`(?<!不是|并非)我(?:们|司)(?:自己)?的(?!合作)[\p{Script=Han}]{0,6}?(?:仓库|库房|场所)|我方仓库|(?<!没有|不是|并非|我们|我司)(?:自有|自己)的?(?:保税|海关监管|监管)?(?:仓库|库房|场所)|GSR\s?(?:Logistics\s?)?(?:经营|运营|拥有)的?[\p{Script=Han}]{0,6}?(?:仓库|库房)`,
  // fa: «انبار ما», «انبارمان», «گدام ما», «انبار گمرکی خودش», «محوطهٔ خودمان» — not «انبار خودمان را نداریم»
  String.raw`(?:(?:انبار|گدام)(?:[\s\p{Cf}]?مان(?!\p{Script=Arabic})|\sما(?!\p{Script=Arabic})|\s(?:[\p{Script=Arabic}\p{Cf}]+\s){0,2}?(?:خودمان|خودش|خود\sما)(?!\p{Script=Arabic}))|(?:محوطه|مرکز)(?:\p{Mn}|ی)?\sخودمان)(?![^.؟!?؛;]{0,25}(?:ندار|نیست))`,
  // uz, both scripts: «bizning (bojxona) ombor», «omborxonamiz», «oʻz (bojxona) ombori(da)» — not «oʻz omborimiz yoʻq»
  String.raw`(?<![a-zʻʼ])(?:bizning\s+(?:[a-zʻʼ]+\s+){0,2}?ombor|omborxonamiz|o[ʻ'’‘]?z\s+(?:bojxona\s+)?ombor)(?![a-zʻʼ]*\s+(?:yo[ʻ'’‘]?q|emas)(?![a-zʻʼ]))`,
  String.raw`(?<![а-яёўқғҳ])(?:бизнинг\s+(?:[а-яёўқғҳ]+\s+){0,2}?омбор|омборхонамиз|ўз\s+(?:божхона\s+)?омбор)(?![а-яёўқғҳ]*\s+(?:йўқ|эмас)(?![а-яёўқғҳ]))`,
  // ru: «наш / свой / собственный (таможенный) склад» — not «нашего складского партнёра», not «своего склада у нас нет»
  String.raw`(?<![а-яё])(?:наш[а-яё]{0,3}|сво(?:й|его|ему|им|[её]м|и|их)|собственн[а-яё]+)\s+(?:(?!партн)[а-яё]+\s+){0,2}?склад(?!ск)(?![а-яё]*(?:\s+[а-яё]+){0,3}\s+нет(?![а-яё]))|склад[а-яё]*\s+(?:компании\s+)?GSR`,
  // the predicate: "the warehouse is ours", «склад наш», «ombor oʻzimizniki», 仓库是我们自己的, «انبار مال ماست» — not "is not ours", not "belongs to our partner"
  String.raw`\b(?:warehouses?|facilit(?:y|ies))\s+(?:(?:is|are)\s+(?:ours|our\s+own)|belongs?\s+to\s+(?:us|GSR))\b`,
  String.raw`(?<![а-яё])склад[а-яё]*\s+(?:[—–-]\s+)?(?:наш|свой|собственный)(?![а-яё])|(?<![а-яё])склад[а-яё]*\s+принадлежит\s+(?:нам|GSR|нашей\s+компании)(?![а-яё])`,
  String.raw`(?<![a-zʻʼ])ombor(?:imiz|xona)?\s+(?:o[ʻ'’‘]?zimizniki|bizniki|(?:bizga|o[ʻ'’‘]?zimizga)\s+tegishli)(?![a-zʻʼ])(?!\s+emas)|(?<![а-яёўқғҳ])омбор(?:имиз|хона)?\s+(?:ўзимизники|бизники|(?:бизга|ўзимизга)\s+тегишли)(?![а-яёўқғҳ])(?!\s+эмас)`,
  String.raw`(?:仓库|库房)(?:是|属于|归)(?:我们|我司|GSR)(?!的?(?:合作|伙伴))(?:自己)?(?:的|所有)?`,
  String.raw`(?:انبار|گدام)\s(?:مال|متعلق\sبه|از\sآن)\s(?:ما(?:ست)?|خودمان)(?!\p{Script=Arabic})(?![^.؟!?؛;]{0,25}(?:ندار|نیست))`,
].join('|'), 'iu');
const WAREHOUSE_TYPE = new RegExp([
  String.raw`(?<![a-zʻʼ])bojxona\s+ombor(?:i|ini|iga|ida|idan|lari|xonasi)?(?![a-zʻʼ])|vaqtincha\s+saqlash\s+ombor`,
  String.raw`(?<![а-яёўқғҳ])божхона\s+омбор(?:и|ини|ига|ида|идан|лари|хонаси)?(?![а-яёўқғҳ])|вақтинча\s+сақлаш\s+омбор`,
  String.raw`(?<![а-яё])таможенн(?:ый|ого|ом|ому|ым|ые|ых)\s+склад|(?<![А-ЯЁа-яё])СВХ(?![А-ЯЁа-яё])|склад[а-яё]*\s+временного\s+хранения`,
  String.raw`\bcustoms\s+warehouses?\b|\bbonded\b|\btemporary\s+storage\s+warehouses?\b|\bTSW\b`,
  String.raw`保税|海关仓库|临时存储仓库|临时仓库`,
  String.raw`انبار\sگمرکی|انبار\sنگهداری\sموقت`,
].join('|'), 'iu');
const SANCTION = /sanksiya|санкси|санкци|\bsanction|制裁|تحریم/iu;
const PAGE_CLAIMS = [
  { id: 'request.ours', pages: ON_REQUEST_PAGE, re: OUR_WAREHOUSE, units: 'blocks',
    msg: 'calls a warehouse "ours" on a page of the on-request services — the warehouse under customs control is a partner\'s (a denial passes)',
    bad: ['Our own customs-controlled warehouse in Tashkent — GSR', 'The warehouse is ours, so storage terms are flexible.', 'The warehouse belongs to GSR.', 'Склад наш, поэтому условия хранения гибкие.', 'Ombor oʻzimizniki, shuning uchun saqlash shartlari moslashuvchan.', 'Омбор ўзимизники.', '仓库是我们自己的，所以仓储条件灵活。', 'انبار متعلق به ماست.',
      'our warehouse in Tashkent', 'Our own customs warehouse', 'GSR’s warehouse under customs control', 'Our Tashkent customs warehouse is in the Sergeli district.', 'GSR has its own bonded warehouse in Tashkent.', 'We store your cargo in our own facility under customs control.',
      '我们的仓库', '我们的海关监管仓库', '自有仓库', 'GSR 在塔什干拥有自己的保税仓库。', '我司的海关监管仓库位于谢尔盖利区。', '我们把货物存放在自有的监管场所。', 'GSR 经营的临时存储仓库。',
      'انبار ما در تاشکند', 'انبارمان', 'انبار خودمان', 'گدام ما در ناحیهٔ سرگلی تاشکند است.', 'GSR در تاشکند انبار گمرکی خودش را دارد.', 'بار شما را در محوطهٔ خودمان زیر نظارت گمرک نگه می‌داریم.',
      'Bizning ombor Sergeli tumanida joylashgan.', 'Omborxonamiz bojxona nazoratida ishlaydi.', 'GSR oʻz bojxona omboriga ega.', 'Yukni oʻz omborida bojxona nazorati ostida saqlaymiz.', 'Бизнинг омбор Сергели туманида жойлашган.',
      'Наш таможенный склад находится в Сергелийском районе.', 'У GSR собственный таможенный склад в Ташкенте.', 'Размещаем груз на своём складе под таможенным контролем.'],
    good: ['The warehouse is not ours: it belongs to our partner.', 'Склад не наш: он принадлежит партнёру.', '仓库不是我们的，属于合作方。',
      'a partner’s warehouse', 'The warehouse belongs to our partner; cargo is stored there under customs control.', 'We allocate space for our clients in a warehouse under customs control', 'Our warehouse partner in Tashkent stores the cargo under customs control.', 'This is not our own warehouse.',
      'A partner’s warehouse under customs control — not a warehouse of our own.', 'Do you have your own warehouse? No — the warehouse belongs to our partner.', 'Our own customs broker files the transit declaration.',
      '合作方的仓库', '该仓库属于我们的合作方', '我们在合作方的监管仓库安排仓位', '这不是我们自己的仓库。', '我们没有自己的仓库，仓位安排在合作方的仓库里。', '过境报关单由我们自有的报关行申报。',
      'انبار همکار ما', 'این انبار متعلق به همکار ماست', 'انبار ماشین‌آلات', 'انبار خودمان را نداریم؛ جا را در انبار همکارمان اختصاص می‌دهیم.', 'این انبار مال ما نیست: متعلق به همکار ماست.', 'اظهارنامهٔ ترانزیت را کارگزار گمرکی خودمان ثبت می‌کند.',
      'Ombor hamkorimizga tegishli; yuk u yerda bojxona nazorati ostida saqlanadi.', 'Oʻz omborimiz yoʻq — joyni hamkor omboridan ajratamiz.', 'Tranzit deklaratsiyasini oʻz bojxona brokerimiz topshiradi.', 'Ombor bizniki emas: u hamkorimizga tegishli.',
      'Склад принадлежит нашему партнёру; груз хранится там под таможенным контролем.', 'Склад нашего партнёра находится под таможенным контролем.', 'У нашего складского партнёра груз хранится под таможенным контролем.', 'Своего склада у нас нет — место выделяем на складе партнёра.',
      'Транзитную декларацию подаёт наш собственный таможенный брокер.'] },
  { id: 'request.figure', pages: ON_REQUEST_PAGE, re: REQUEST_FIGURE, ok: REQUEST_FIGURE_OK, units: 'sentences',
    msg: 'a time, a price, a volume or an area on a page of the on-request services — nothing is published for them: "on request" (a figure of the China → Tashkent route passes in a sentence that names China and Tashkent)',
    bad: ['7–10 kun Muddat', 'Butun fura 5–7 kun', 'Butun fura narxi — 3 000 dollardan.', 'Yoʻl 5–7 kun davom etadi.', 'Yuk omborda 30 kungacha saqlanadi.', 'Bu rejimda yuk uch yilgacha saqlanishi mumkin.', 'Ombor maydoni 2 000 m².', 'Saqlash narxi: 1 m³ uchun kuniga 0,5 $.', '7–10 кун Муддат',
      '7–10 дней Срок', 'Фура целиком — от 3 000 долларов.', 'Груз хранится на складе до 30 дней.', 'Хранение до трёх лет.', 'Площадь склада — 2 000 м².',
      '7–10 days Transit time', 'A full truck costs from $3,000.', 'Cargo can stay in the warehouse for up to 30 days.', 'Storage for up to three years.', 'The warehouse covers 2,000 m².', 'It is on the road for 5–7 days.',
      '7–10 天 时效', '整车运费 3000 美元起。', '货物可在仓库存放最长 30 天。', '最长可存放三年。', '仓库面积 2,000 平方米。',
      '۷ تا ۱۰ روز زمان حمل', 'کرایهٔ کامیون دربست از ۳٬۰۰۰ دلار.', 'بار تا ۳۰ روز در انبار می‌ماند.', 'نگهداری تا سه سال.', 'مساحت انبار ۲٬۰۰۰ متر مربع است.'],
    good: ['Saytdagi 1 m³ minimum Xitoydan Toshkentga keladigan yigʻma yukka tegishli.', 'Сайтдаги 1 м³ минимум Хитойдан Тошкентга келадиган йиғма юкка тегишли.', 'Минимум 1 м³, указанный на сайте, относится к сборному грузу из Китая в Ташкент.',
      'The 1 m³ minimum published on this site applies to consolidated cargo from China to Tashkent.', '本网站公布的 1 m³ 最低起运量，适用于从中国发往塔什干的拼货。', 'حداقل ۱ متر مکعب که در این سایت آمده، مربوط به بار تجمیعی از چین به تاشکند است.',
      'Soʻrov boʻyicha Narx va muddat', 'Du–Sha 9:00–19:00', '+998 00 000 00 00', 'Yangilangan: 2026-yil 12-noyabr', 'Обновлено: 12 ноября 2026 г.', 'Updated: November 12, 2026', '更新日期：2026年11月12日', '周一至周六 9:00–19:00', 'همه روزه به‌جز یکشنبه، ۹:۰۰ تا ۱۹:۰۰', 'آخرین به‌روزرسانی: ۲۰۲۶/۱۱/۱۲',
      'Vazirlar Mahkamasining 2022-yil 31-dekabrdagi 737-son qaroriga koʻra', 'Under Article 119 of the Customs Code of Uzbekistan', '部长内阁第 737 号决议批准的条例（2026年11月现行版本）', 'طبق مصوبهٔ شمارهٔ ۷۳۷ هیئت وزیران ازبکستان مورخ ۲۰۲۲/۱۲/۳۱', 'Xizmat 10 — Afgʻoniston', '01',
      'Bugungi kunda yetkazish nuqtalari shu ikkita.', 'Today these are the two delivery points.', 'Saqlash muddati va narxini menejer yukingiz boʻyicha aytadi.'] },
  { id: 'request.type', pages: ON_REQUEST_PAGE, re: WAREHOUSE_TYPE, units: 'blocks',
    msg: 'names a legal regime of the warehouse on a page of the on-request services ("customs warehouse", "bonded", СВХ) — the regime is not confirmed: write "warehouse under customs control"',
    bad: ['Bu — bojxona ombori rejimi.', 'Vaqtincha saqlash ombori xizmati.', 'Бу — божхона омбори режими.', 'Это режим таможенного склада.', 'Склад временного хранения (СВХ) GSR.', 'This is the customs warehouse procedure.', 'a bonded warehouse in Tashkent', 'A temporary storage warehouse operated by a partner.',
      '这是海关仓库制度。', '保税仓库', 'این رویهٔ انبار گمرکی است.', 'انبار نگهداری موقت'],
    good: ['Toshkentda bojxona nazoratidagi ombor', 'Тошкентда божхона назоратидаги омбор', 'Склад под таможенным контролем в Ташкенте', 'Warehouse under customs control in Tashkent', '塔什干海关监管仓库', 'انبار تحت نظارت گمرک در تاشکند',
      'boshqa transport vositasiga qayta yuklashga va vaqtincha saqlash uchun tushirishga yoʻl qoʻyiladi.', 'goods in transit may be reloaded onto another vehicle and unloaded for temporary storage under the control of an intermediate customs office.', '过境货物可以换装到另一运输工具上，也可以卸下临时存放。',
      'می‌توان کالای ترانزیتی را به وسیلهٔ نقلیهٔ دیگری منتقل کرد و برای نگهداری موقت تخلیه کرد.', 'https://gsrlogistics.uz/en/services/customs-warehouse-tashkent/'] },
  { id: 'request.sanction', pages: ON_REQUEST_PAGE, re: SANCTION, units: 'blocks',
    msg: 'a sentence about sanctions on a page of the on-request services — the owner decided to print none (FACTS §11)',
    bad: ['Sanksiya ostidagi tovarlarni tashimaymiz.', 'Санксия остидаги товарларни ташимаймиз.', 'Подсанкционные товары не перевозим.', 'We do not carry sanctioned goods.', '我们不承运受制裁货物。', 'کالاهای تحریمی حمل نمی‌کنیم.'],
    good: ['Taqiq va cheklovlarga rioya etilganini tasdiqlovchi hujjatlar', 'Документы, подтверждающие соблюдение запретов и ограничений', 'Documents confirming that prohibitions and restrictions are observed', '证明已遵守禁止和限制规定的文件', 'اسنادی که رعایت ممنوعیت‌ها و محدودیت‌ها را تأیید می‌کند'] },
];
/** The <title> and the description / OG / Twitter strings of a page — without the JSON-LD, which repeats the page and the company. */
const metaStrings = (html) => [decodeEntities((html.match(/<title>([\s\S]*?)<\/title>/) || ['', ''])[1]), ...[...html.matchAll(/<meta (?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)" content="([^"]*)"/g)].map((m) => decodeEntities(m[1]))].filter(Boolean);
/** One page-scoped rule on one text unit (normalised): the figure rule lets a sentence of the China → Tashkent route through. */
const pageHit = (r, unit) => (r.re.test(unit) && !(r.ok && r.ok.test(unit)) ? unit.match(r.re)[0] : null);
/** The units a page-scoped rule reads: the blocks of <main> — the cards of the related services included — or their sentences. */
const pageUnits = (html, units) => { const list = blocksOf(mainMarkup(html)).map(normalize); return units === 'sentences' ? list.flatMap(sentences) : list; };
/**
 * A question and its answer are two blocks: «How long does delivery to Afghanistan take?» — «Usually 5–7 days.» has
 * no name beside the figure, and on the FAQ page or the home page no page-scoped rule reads it. So wherever a
 * question names Afghanistan, Hairatan or Mazar-i-Sharif, its answer is read like a page of the on-request
 * services: no time, price or volume — unless the sentence names China and Tashkent (whose figure it then is).
 */
const faqPairs = (html) => [...mainMarkup(html).matchAll(/<details\b[^>]*\bclass="[^"]*\bfaq-item\b[^"]*"[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)]
  .map((m) => [normalize(entities(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()), blocksOf(m[2]).map(normalize)]);
const afghanAnswerFigure = (question, answer) => (AFGHAN_NAME.test(question)
  ? answer.flatMap(sentences).map((s) => (REQUEST_FIGURE.test(s) && !REQUEST_FIGURE_OK.test(s) ? s.match(REQUEST_FIGURE)[0] : null)).find(Boolean) ?? null
  : null);
const FAQ_FIXTURES = {
  bad: [
    '<details class="faq-item" id="q36"><summary><span class="q">How long does delivery to Afghanistan take?</span></summary><div class="faq-body"><p>Usually 5–7 days from Tashkent.</p></div></details>',
    '<details class="faq-item reveal"><summary><span class="q">Afgʻonistonga yetkazish qancha turadi?</span></summary><div class="faq-body"><p>Butun fura — 3 000 dollardan.</p></div></details>',
    '<details class="faq-item"><summary><span class="q">Сколько идёт груз до Мазари-Шарифа?</span></summary><div class="faq-body"><p>Обычно около недели.</p></div></details>',
    '<details class="faq-item"><summary><span class="q">发往阿富汗需要多久？</span></summary><div class="faq-body"><p>一般 5–7 天。</p></div></details>',
    '<details class="faq-item"><summary><span class="q">حمل بار به افغانستان چقدر طول می‌کشد؟</span></summary><div class="faq-body"><p>معمولاً ۵ تا ۷ روز.</p></div></details>',
  ],
  good: [
    '<details class="faq-item"><summary><span class="q">How long does delivery to Afghanistan take?</span></summary><div class="faq-body"><p>The manager calculates the time for your cargo. The 15–25 days on this site is the truck route from China to Tashkent.</p></div></details>',
    '<details class="faq-item"><summary><span class="q">How long does a truck from China take?</span></summary><div class="faq-body"><p>15–25 days.</p></div></details>',
    '<details class="faq-item"><summary><span class="q">Afgʻonistonga yuk tashiysizmi va qayergacha?</span></summary><div class="faq-body"><p>Ha, fura bilan — Hayraton chegara punktigacha yoki Mozori Sharifgacha. Bugungi kunda yetkazish nuqtalari shu ikkita.</p></div></details>',
  ],
};
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
/**
 * The slugs of REQUEST_SLUGS are written out (the text above must evaluate on its own: scratch tools cut it out of
 * this file), so they are compared here with the registry: every service marked `quote: 'request'` in
 * src/data/services.ts, in its five written slugs and its Cyrillic one (src/i18n/routes.ts). A fourth on-request
 * service that is not added to the list would otherwise be a page no page-scoped rule reads.
 */
function registryMisfit() {
  const read = (rel) => fs.readFileSync(new URL(rel, import.meta.url), 'utf8');
  const expected = new Set();
  let services = 0;
  for (const row of read('../src/data/services.ts').matchAll(/\{ key: '(\w+)'[^\n]*\bquote: 'request'[^\n]*\bslug: \{([^}]*)\}/g)) {
    services += 1;
    const slugs = Object.fromEntries([...row[2].matchAll(/(\w+): '([^']+)'/g)].map((m) => [m[1], m[2]]));
    for (const s of Object.values(slugs)) expected.add(s);
    const cyr = new RegExp(`['"]?${slugs.uz}['"]?:\\s*'([^']+)'`).exec(read('../src/i18n/routes.ts'));
    if (cyr) expected.add(cyr[1]); else return [`no Cyrillic slug for the on-request service «${row[1]}» in src/i18n/routes.ts`];
  }
  if (services < 3) return [`src/data/services.ts: found ${services} services marked quote: 'request' (three exist) — registryMisfit() in scripts/check-content.mjs no longer reads the registry`];
  const listed = new Set(REQUEST_SLUGS);
  return [...[...expected].filter((s) => !listed.has(s)).map((s) => `REQUEST_SLUGS in scripts/check-content.mjs lacks the on-request service page «${s}» — the page-scoped rules would not read it`),
    ...[...listed].filter((s) => !expected.has(s)).map((s) => `REQUEST_SLUGS in scripts/check-content.mjs names «${s}», which is not an on-request service page`)];
}
const markupHits = (html) => claimHits(normalize(strip(`<main>${html}</main>`)), blocks(`<main>${html}</main>`).map(normalize));
const fixtureMisfires = [
  ...VOLUME_FIXTURES.bad.filter((s) => !VOLUME_RULES.some(([re]) => re.test(s) || re.test(normalize(s)))).map((s) => `the volume rules miss their bad sentence: ${s}`),
  ...VOLUME_FIXTURES.good.flatMap((s) => stoppedBy(s).map((msg) => `«${msg}» fires on the good volume sentence: ${s}`)),
  ...WAREHOUSE_FIXTURES.bad.filter((s) => !WAREHOUSE_RULES.some(([re]) => re.test(s) || re.test(normalize(s)))).map((s) => `the "our warehouse" rules miss their bad sentence: ${s}`),
  ...WAREHOUSE_FIXTURES.good.flatMap((s) => stoppedBy(s).map((msg) => `«${msg}» fires on the good warehouse sentence: ${s}`)),
  ...PAGE_CLAIMS.flatMap((r) => [
    ...r.bad.flatMap((s) => (r.units === 'sentences' ? sentences(normalize(s)) : [normalize(s)]).some((u) => pageHit(r, u)) ? [] : [`${r.id} misses its bad sentence: ${s}`]),
    ...r.good.flatMap((s) => (r.units === 'sentences' ? sentences(normalize(s)) : [normalize(s)]).some((u) => pageHit(r, u)) ? [`${r.id} fires on its good sentence: ${s}`] : []),
    // what the pages may say has to pass every other rule too
    ...r.good.flatMap((s) => stoppedBy(s).map((msg) => `«${msg}» fires on the good sentence of ${r.id}: ${s}`)),
  ]),
  // a list of sentences that has been emptied proves nothing
  ...Object.entries({ VOLUME_FIXTURES, WAREHOUSE_FIXTURES, BLOCK_FIXTURES, FAQ_FIXTURES, ...Object.fromEntries(PAGE_CLAIMS.map((r) => [r.id, r])) }).flatMap(([name, f]) => ['bad', 'good'].filter((k) => !Array.isArray(f[k]) || !f[k].length).map((k) => `${name} has no ${k} sentence`)),
  ...registryMisfit(),
  ...CLAIM_RULES.flatMap((r) => r.good.flatMap((s) => FORBIDDEN.filter(([re]) => re.test(s) || re.test(normalize(s))).map(([, msg]) => `«${msg}» fires on the good sentence of ${r.id}: ${s}`))),
  ...BLOCK_FIXTURES.good.flatMap((html) => markupHits(html).map((msg) => `a block rule reads two blocks as one — «${msg}» on: ${html}`)),
  ...BLOCK_FIXTURES.bad.filter((html) => !markupHits(html).length).map((html) => `the block rules miss one block: ${html}`),
  ...FAQ_FIXTURES.bad.filter((html) => !faqPairs(`<main>${html}</main>`).some(([q, a]) => afghanAnswerFigure(q, a))).map((html) => `the question-and-answer rule misses: ${html}`),
  ...FAQ_FIXTURES.good.filter((html) => faqPairs(`<main>${html}</main>`).some(([q, a]) => afghanAnswerFigure(q, a))).map((html) => `the question-and-answer rule fires on: ${html}`),
  ...FAQ_FIXTURES.good.filter((html) => !faqPairs(`<main>${html}</main>`).length).map((html) => `faqPairs() no longer finds the question in: ${html}`),
];
const misfires = [...selfTest(), ...fixtureMisfires];
if (misfires.length) {
  console.error(`check-content: ${misfires.length} guard rule(s) fail their own fixtures (scripts/content-rules.mjs; VOLUME_FIXTURES, WAREHOUSE_FIXTURES, BLOCK_FIXTURES and PAGE_CLAIMS in scripts/check-content.mjs):\n  ${misfires.join('\n  ')}`);
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
const chromeSeen = new Set(); // locale|message — a claim in the header or footer is reported once per locale
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
  for (const r of PAGE_CLAIMS) {
    if (!r.pages.test(url)) continue;
    const head = [...new Set(metaStrings(html))].map(normalize); // the title and the descriptions; the JSON-LD repeats the page
    const found = [...pageUnits(html, r.units), ...(r.units === 'sentences' ? head.flatMap(sentences) : head)].map((u) => pageHit(r, u)).find(Boolean);
    if (found) errors.push(`${url}: ${r.msg} — «${found.trim().slice(0, 60)}»`);
  }
  // A question about Afghanistan outside the on-request pages (they read every sentence already): its answer carries no figure.
  if (!ON_REQUEST_PAGE.test(url)) for (const [question, answer] of faqPairs(html)) {
    const found = afghanAnswerFigure(question, answer);
    if (found) errors.push(`${url}: a time, a price or a volume in the answer to a question about Afghanistan — nothing is published for that direction (a figure of the China → Tashkent route passes in a sentence that names China and Tashkent) — «${question.slice(0, 48)}» → «${found.trim()}»`);
  }
  // The header and the footer are the same on every page of a locale: read them on each page, report once per locale.
  const chrome = chromeMarkup(html);
  if (chrome) {
    const chromeText = entities(chrome.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
    for (const msg of claims(chromeText, normalize(chromeText), blocksOf(chrome).map(normalize))) {
      const key = `${code}|${msg}`;
      if (!chromeSeen.has(key)) { chromeSeen.add(key); errors.push(`${url} (header / footer — the same on every ${code} page): ${msg}`); }
    }
  } else if (!/\/404\/$/.test(url)) errors.push(`${url}: no <header id="site-header"> / <footer id="site-footer"> found — the claim rules cannot read the page's chrome`);
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
// llms-full.txt repeats the pages, which are read above; its first lines are written by hand in scripts/generate-llms-full.mjs
// and stand in no page, so the same claims are read there.
const fullFile = path.join(dist, 'llms-full.txt');
if (fs.existsSync(fullFile)) {
  const head = fs.readFileSync(fullFile, 'utf8').split(/\n# =====/)[0];
  for (const msg of claims(head, normalize(head), paragraphs(head).map(normalize))) errors.push(`llms-full.txt (its header, written in scripts/generate-llms-full.mjs): ${msg}`);
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
console.log(`\nchecked ${walk(dist).length} pages · ${errors.length} errors · ${warn.length} warnings (errors/warnings per locale: ${byLocale}) · ${CLAIM_RULES.length} claim rules and ${PAGE_CLAIMS.length} page-scoped rules passed their fixtures (${CLAIM_RULES.reduce((n, r) => n + r.bad.length + r.good.length, 0) + PAGE_CLAIMS.reduce((n, r) => n + r.bad.length + r.good.length, 0)} sentences)${pending.length ? ` · ${pending.length} pending-locale pages with untranslated text` : ''}\n${works.summary}`);
process.exit(errors.length ? 1 : 0);
