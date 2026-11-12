/**
 * The content guards of scripts/check-content.mjs that carry the sentences proving each one works.
 * check-content.mjs runs `selfTest()` before it reads a single page and fails the build if any rule
 * misfires on its own fixtures — nobody can eyeball a Persian or Chinese regex, so every rule carries
 * the sentences it must catch (`bad`) and the ones it must let through (`good`), the denial wording of
 * the claim among them ("this is not a real-time position"). A `good` sentence is one the site may
 * say, so it has to pass EVERY rule, not only its own.
 *
 *   CLAIM_RULES   business claims: run on EVERY page, on normalised text — any language can appear on
 *                 any page (the China addresses are on every locale). Most are the Chinese and Persian
 *                 twins of the uz/ru/en FORBIDDEN list in check-content.mjs (GLOSSARY.md §1.4 and the
 *                 owner's rules behind that list; ids zh.* and fa.*). The rules written since
 *                 2026-11-12 exist in all five languages and in Uzbek Cyrillic at once (ids uz.*, ru.*,
 *                 en.*, zh.*, fa.*): where GSR delivers, who answers in Persian, and what may be said
 *                 about the Afghanistan direction. A rule marked `block` reads one block of a page at a
 *                 time (a paragraph, a heading, a list item, a table row) instead of the joined text.
 *   PAGE_RULES    orthography of one language: run on that language's pages only, on the RAW text
 *                 (normalising would hide exactly what they look for).
 *   leakRuns()    untranslated English / Uzbek / Russian prose on a zh or fa page.
 *
 * All new expressions use the `u` flag and Unicode property escapes. Code points are written
 * \u{…}; Persian and Chinese letters are written as themselves.
 */
import { readFileSync } from 'node:fs';

/* ── Normalisation ──────────────────────────────────────────────────────────────────────────── */

const DIGIT_BLOCKS = [[0x06f0, 0x06f9], [0x0660, 0x0669], [0xff10, 0xff19]]; // Persian, Arabic-Indic, full-width
const CJK = '[\\p{Script=Han}\\u{3000}-\\u{303F}\\u{FF01}-\\u{FF60}]';
const CJK_GAP = new RegExp(`(?<=${CJK})\\s+(?=${CJK})`, 'gu');

/**
 * The text the claim rules read. Without it, Persian digits and RTL marks slip past even the
 * language-neutral rules (retired phone, 0.1 m³, 400+), and a tag between two Chinese words —
 * 我们的<strong>义乌</strong>仓库, which the tag stripper turns into 我们的 义乌 仓库 — defeats every
 * adjacency pattern.
 *   1. bidi controls (LRM, RLM, LRE…RLO, LRI…PDI) are deleted;
 *   2. Persian, Arabic-Indic and full-width digits become 0–9; ٫ (decimal) → ',', ٬ (thousands) → '',
 *      ٪ and ％ → '%', ＋ → '+';
 *   3. Arabic ي ى → Persian ی and Arabic ك → Persian ک;
 *   4. whitespace between two CJK characters is deleted.
 */
export function normalize(t) {
  let s = t.replace(/[\u{200E}\u{200F}\u{202A}-\u{202E}\u{2066}-\u{2069}]/gu, '');
  for (const [lo, hi] of DIGIT_BLOCKS) {
    s = s.replace(new RegExp(`[\\u{${lo.toString(16)}}-\\u{${hi.toString(16)}}]`, 'gu'), (d) => String(d.codePointAt(0) - lo));
  }
  return s
    .replace(/\u{066B}/gu, ',').replace(/\u{066C}/gu, '')
    .replace(/[\u{066A}\u{FF05}]/gu, '%').replace(/\u{FF0B}/gu, '+')
    .replace(/[\u{064A}\u{0649}]/gu, 'ی').replace(/\u{0643}/gu, 'ک')
    .replace(CJK_GAP, '');
}

/* ── Business claims, Chinese and Persian ───────────────────────────────────────────────────── */

/*
 * The monthly volume, owner 2026-11-11: 50–100 containers a month (zh 每月 50–100 个集装箱, fa ماهانه ۵۰ تا ۱۰۰
 * کانتینر), as in check-content.mjs VOLUME_RULES. A container count is a claim when it carries a "+" (多, 余,
 * 以上), or when a month word stands beside it in the same sentence — on either side, since the about page's
 * tile prints "50–100" and then "个集装箱每月…" / "کانتینر در ماه…". The one range that passes is 50–100
 * (50 至/到 100, ۵۰ تا ۱۰۰). Written for the normalised text: ASCII digits, no gap between Chinese characters.
 */
const ZH_BOX = '(?:个|只)?\\s?(?:集装箱|货柜|标准箱|标箱|TEU)';
// 每月 is a rate wherever it stands; 一个月 only before the count (一个月内运送…) — after it, it is a
// duration (2 个集装箱约一个月抵达), as "in about a month" is in check-content.mjs.
const ZH_PER_MONTH = '(?:每月|每个月|月均)';
const ZH_MONTH = '(?:每月|每个月|月均|一个月)';
const ZH_TO = '\\s?(?:[–—−~～-]|至|到)\\s?';
// A number or range that does not start inside another one (the "100" of "50–100"), and is not 50–100.
const ZH_COUNT = `(?!50${ZH_TO}100(?![\\d+多余]|\\s?以上))(?<![\\d.,+]|\\d${ZH_TO})\\d{1,5}(?:${ZH_TO}\\d{1,5})?\\s?(?:\\+|多|余|以上)?\\s?`;
// A count in words: the inflating ones (上百, 上千…) are claims anywhere, as a "+" is; beside a month word
// so are 数十, 百余, 近百…. "N 个以上(的)" is N+, and the box may come first: 每月发运集装箱 200 个.
const ZH_WORDNUM = '(?:数十|几十|上百|数百|几百|百余|近百|逾百|过百|成百上千|上千|数千|几千|千余|上万|数万|万余|成千上万)\\s?';
const ZH_VOLUME = new RegExp(`(?<![\\d+])\\d{1,5}\\s?(?:\\+|多|余|(?:个|只)\\s?以上\\s?的?)\\s?${ZH_BOX}|(?:上百|数百|几百|上千|数千|几千|成千上万)${ZH_BOX}|${ZH_MONTH}[^。！？!?；;]{0,12}?(?:${ZH_COUNT}|${ZH_WORDNUM})${ZH_BOX}|(?:${ZH_COUNT}|${ZH_WORDNUM})(?:${ZH_BOX}[^。！？!?；;]{0,8}?${ZH_PER_MONTH}|${ZH_PER_MONTH}[^。！？!?；;]{0,4}?${ZH_BOX})|${ZH_PER_MONTH}[^。！？!?；;\\d]{0,8}?(?:集装箱|货柜|标准箱|标箱|TEU)[^。！？!?；;\\d]{0,4}?(?:${ZH_COUNT}|${ZH_WORDNUM})(?:个|只)`, 'iu');
const FA_BOX = 'کانتینر(?:\\p{Cf}?(?:های|ها))?';
// «در ماه» is "a month" — not «در ماه آینده/بعد/قبل/گذشته/جاری» (next, last, this month) nor «در ماه‌های…» (in the months of…).
const FA_MONTH = '(?:ماهانه|ماهیانه|در\\sماه(?![\\s\\p{Cf}]?(?:آینده|بعد|قبل|گذشته|پیش|جاری|اخیر|نخست|اول|دیگر|های|ها))|هر\\sماه)';
const FA_TO = '(?:\\s?[–—−-]\\s?|\\sتا\\s)';
const FA_COUNT = `(?!50${FA_TO}100(?![\\d+]))(?<![\\d.,+]|\\d${FA_TO})\\d{1,5}(?:${FA_TO}\\d{1,5})?\\s?`;
// A count in words: صدها / هزاران (hundreds, thousands) anywhere, as a "+" is; ده‌ها (dozens) beside a month word.
const FA_WORDNUM = '(?:ده[\\s\\p{Cf}]?ها|صدها|هزاران)\\s';
const FA_VOLUME = new RegExp(`(?<![\\d+])(?:\\+\\s?\\d{1,5}|\\d{1,5}\\s?\\+)\\s?${FA_BOX}|(?:صدها|هزاران)\\s${FA_BOX}|${FA_MONTH}[^.؟!?]{0,20}?(?:${FA_COUNT}|${FA_WORDNUM})${FA_BOX}|(?:${FA_COUNT}|${FA_WORDNUM})${FA_BOX}[^.؟!?]{0,20}?${FA_MONTH}`, 'iu');

/* ── Where GSR delivers; who answers in Persian; the Afghanistan direction ────────────────────── */

/*
 * What the site may say since 2026-11-12 (the owner's answers of 2026-11-11): GSR delivers in Uzbekistan and — by
 * truck only, price and time on request — to two points in Afghanistan, Hairatan and Mazar-i-Sharif. No other
 * country is served — not Iran, not Kazakhstan, not Russia — and no other Afghan city. Nobody at GSR speaks
 * Persian or Dari: a Persian message is answered in Persian with the help of a translator.
 *
 * These rules exist in all five written languages and in Uzbek Cyrillic (the /kirill/ pages are the Uzbek text
 * transliterated, so every Uzbek rule carries its Cyrillic twin). The place names are kept in the three tables
 * below (ON_ROUTE, ELSEWHERE — its five cities are listed first, as TOWNS — and SERVED), one row per place and one column per language — uz, uzc, ru, en, zh, fa — so that the six lists cannot
 * drift apart: a place is added, or leaves when the owner confirms it, in ONE row. A cell holds the spellings of
 * the name as plain text, separated by " / ":
 *
 *   uz   the bare name; the rule adds the ending (-ga, -gacha). ʻ stands for any apostrophe or none
 *        (Qozogʻiston, Qozog'iston, Qozogiston).
 *   uzc  what src/lib/cyrillic.ts prints for each uz spelling (checked with toCyrillic).
 *   ru   each spelling with its preposition — «в Иран», «до Ирана» — because the case decides: «доставка в Россию»
 *        names a destination, «перевозки в России» (in Russia) does not. A bare spelling (Россия) is the form after
 *        an arrow, where it differs.
 *
 * A row that is a column short stops the build. selfTest() then tries every spelling of every row in the plainest
 * claim of its language ("We deliver to …"): the rule must reach each one — its ending, its word boundary, a
 * name of two words — or that language is free to make the claim.
 */
const AP = "[ʻʼ'’‘`]";
/**
 * The two countries a China → Tashkent route crosses. Route copy names them all the time — "across Kazakhstan",
 * "the China–Kazakhstan border", "from China into Kazakhstan" — so for them only a statement that GSR SENDS
 * cargo there is a claim ("we deliver to Kazakhstan", "cargo to Kyrgyzstan").
 */
const ON_ROUTE = [
  ['Qozogʻiston', 'Қозоғистон', 'в Казахстан / до Казахстана', 'Kazakhstan', '哈萨克斯坦', 'قزاقستان'],
  ['Qirgʻiziston', 'Қирғизистон', 'в Кыргызстан / до Кыргызстана / в Киргизию / до Киргизии / Киргизия', 'Kyrgyzstan', '吉尔吉斯斯坦', 'قرقیزستان / قرغیزستان / قرغزستان'],
];
/**
 * The five cities among the places GSR does not deliver to: the Afghan ones other than Hairatan and
 * Mazar-i-Sharif, and Tehran and Mashhad. The site has no other business with them, so their NAME is a claim
 * wherever it stands — a third delivery point in a list ("Hairatan · Mazar-i-Sharif · Kabul"), an answer without
 * a verb ("to one of two points: Tehran or Mashhad") — unless the sentence denies it or asks.
 */
const TOWNS = [
  ['Kobul / Qobul', 'Кобул / Қобул', 'в Кабул / до Кабула', 'Kabul', '喀布尔', 'کابل'],
  ['Hirot / Herot', 'Ҳирот / Ҳерот', 'в Герат / до Герата', 'Herat', '赫拉特', 'هرات'],
  ['Qandahor / Kandagar', 'Қандаҳор / Кандагар', 'в Кандагар / до Кандагара', 'Kandahar / Qandahar', '坎大哈', 'قندهار / کندهار'],
  ['Tehron / Tegeran', 'Теҳрон / Тегеран', 'в Тегеран / до Тегерана', 'Tehran / Teheran', '德黑兰', 'تهران'],
  ['Mashhad / Meshxed', 'Машҳад / Мешхед', 'в Мешхед / до Мешхеда / в Машхад / до Машхада', 'Mashhad / Meshed', '马什哈德', 'مشهد'],
];
/**
 * Everywhere else GSR does not deliver: Iran first (a country like any other here: not served), the neighbours
 * and trade partners a wider offer invites, and the cities — the Afghan ones other than Hairatan and
 * Mazar-i-Sharif, and Tehran and Mashhad. No route of GSR's goes near any of them, so "from China to …" and
 * "China → …" are claims as well. A deny-list is never complete; it names what the copy is likely to say.
 */
const ELSEWHERE = [
  ['Eron / Iran', 'Эрон / Иран', 'в Иран / до Ирана', 'Iran', '伊朗', 'ایران'],
  ['Tojikiston', 'Тожикистон', 'в Таджикистан / до Таджикистана', 'Tajikistan', '塔吉克斯坦', 'تاجیکستان / تاجکستان'],
  ['Turkmaniston', 'Туркманистон', 'в Туркменистан / до Туркменистана / в Туркмению / до Туркмении / Туркмения', 'Turkmenistan', '土库曼斯坦', 'ترکمنستان'],
  ['Pokiston', 'Покистон', 'в Пакистан / до Пакистана', 'Pakistan', '巴基斯坦', 'پاکستان'],
  ['Rossiya', 'Россия', 'в Россию / до России / Россия', 'Russia', '俄罗斯', 'روسیه'],
  ['Belarus / Belorussiya', 'Беларус / Белоруссия', 'в Беларусь / до Беларуси / в Белоруссию / до Белоруссии / Белоруссия', 'Belarus', '白俄罗斯', 'بلاروس'],
  ['Ozarbayjon', 'Озарбайжон', 'в Азербайджан / до Азербайджана', 'Azerbaijan', '阿塞拜疆', 'آذربایجان'],
  ['Gruziya', 'Грузия', 'в Грузию / до Грузии / Грузия', 'Georgia', '格鲁吉亚', 'گرجستان'],
  ['Armaniston', 'Арманистон', 'в Армению / до Армении / Армения', 'Armenia', '亚美尼亚', 'ارمنستان'],
  ['Turkiya', 'Туркия', 'в Турцию / до Турции / Турция', 'Turkey / Türkiye', '土耳其', 'ترکیه'],
  ['Iroq', 'Ироқ', 'в Ирак / до Ирака', 'Iraq', '伊拉克', 'عراق'],
  ['BAA / Birlashgan Arab Amirliklari', 'БАА / Бирлашган Араб Амирликлари', 'в ОАЭ / до ОАЭ / в Эмираты / до Эмиратов', 'the UAE / UAE / the Emirates', '阿联酋', 'امارات'],
  ['Dubay', 'Дубай', 'в Дубай / до Дубая', 'Dubai', '迪拜', 'دبی'],
  ['Hindiston', 'Ҳиндистон', 'в Индию / до Индии / Индия', 'India', '印度', 'هند / هندوستان'],
  ['Moʻgʻuliston / Mongoliya', 'Мўғулистон / Монголия', 'в Монголию / до Монголии / Монголия', 'Mongolia', '蒙古', 'مغولستان'],
  ['Yevropa / Evropa / Yevropa Ittifoqi / Evropa Ittifoqi', 'Европа / Эвропа / Европа Иттифоқи / Эвропа Иттифоқи', 'в Европу / до Европы / Европа / в Евросоюз / до Евросоюза / в ЕС / до ЕС', 'Europe / the EU / the European Union', '欧洲 / 欧盟', 'اروپا'],
  ...TOWNS,
];
/** What GSR does deliver to (with Tashkent and Termez), as it stands beside a not-served place in a list: "to Afghanistan and Iran". */
const SERVED = [
  ['Afgʻoniston', 'Афғонистон', 'в Афганистан / до Афганистана', 'Afghanistan', '阿富汗', 'افغانستان'],
  ['Oʻzbekiston', 'Ўзбекистон', 'в Узбекистан / до Узбекистана', 'Uzbekistan', '乌兹别克斯坦', 'ازبکستان'],
  ['Hayraton', 'Ҳайратон', 'в Хайратон / до Хайратона', 'Hairatan / Hayratan / Hairaton', '海拉顿', 'حیرتان'],
  ['Mozori Sharif / Mozori-Sharif', 'Мозори Шариф / Мозори-Шариф', 'в Мазари-Шариф / до Мазари-Шарифа', 'Mazar-i-Sharif / Mazar-e-Sharif / Mazar-i Sharif / Mazar-e Sharif', '马扎里沙里夫', 'مزار شریف / مزارشریف'],
  ['Toshkent', 'Тошкент', 'в Ташкент / до Ташкента', 'Tashkent', '塔什干', 'تاشکند'],
  ['Termiz', 'Термиз', 'в Термез / до Термеза', 'Termez', '铁尔梅兹', 'ترمذ'],
];
const PLACE_TABLES = { ON_ROUTE, ELSEWHERE, SERVED };
const PLACE_LANGS = ['uz', 'uzc', 'ru', 'en', 'zh', 'fa'];
for (const [table, rows] of Object.entries(PLACE_TABLES)) {
  for (const row of rows) {
    // A row that is one column short would leave that language free to make the claim.
    if (row.length !== PLACE_LANGS.length || row.some((cell) => typeof cell !== 'string' || !cell.trim())) {
      throw new Error(`scripts/content-rules.mjs: the ${table} row «${row[0]}» must name its place in six columns (${PLACE_LANGS.join(', ')})`);
    }
  }
}
const spellings = (cell) => cell.split(' / ');
/** A Russian spelling without its preposition: «в Иран» → «Иран». */
const ruName = (spelling) => spelling.replace(/^(?:в|до) /, '');
/** A spelling as an expression: ʻ is any apostrophe or none, a space any white space or a ZWNJ (مزار‌شریف). */
const spelled = (name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ʻ/g, `${AP}?`).replace(/ /g, '[\\s\\p{Cf}]+');
const alternation = (names) => `(?:${[...new Set(names)].sort((a, b) => b.length - a.length).map(spelled).join('|')})`;
/** Every spelling of one language in a table, the longest first (Yevropa Ittifoqi before Yevropa, هندوستان before هند); Russian in any case form. */
const column = (rows, i) => alternation(rows.flatMap((row) => spellings(row[i])).map((s) => (PLACE_LANGS[i] === 'ru' ? ruName(s) : s)));
/** The Russian spellings of a table that stand after one preposition: «в» (Иран, Россию) or «до» (Ирана, России). */
const ruAfter = (rows, prep) => alternation(rows.flatMap((row) => spellings(row[2])).filter((s) => s.startsWith(`${prep} `)).map(ruName));
const [UZ_UNSERVED, UZC_UNSERVED, RU_UNSERVED, EN_UNSERVED, ZH_UNSERVED, FA_UNSERVED] = PLACE_LANGS.map((_, i) => column([...ON_ROUTE, ...ELSEWHERE], i));
const [UZ_ELSEWHERE, UZC_ELSEWHERE, RU_ELSEWHERE, EN_ELSEWHERE, ZH_ELSEWHERE, FA_ELSEWHERE] = PLACE_LANGS.map((_, i) => column(ELSEWHERE, i));
const [UZ_SERVED, UZC_SERVED, RU_SERVED, EN_SERVED, ZH_SERVED, FA_SERVED] = PLACE_LANGS.map((_, i) => column(SERVED, i));
// The cities by name. Russian: the form after «в» is the nominative too (Кабул, Мешхед). Persian leaves Kabul to the
// rules that read «به / تا» before it: «کابل» is also a cable.
const [UZ_TOWNS, UZC_TOWNS, , EN_TOWNS, ZH_TOWNS] = PLACE_LANGS.map((_, i) => column(TOWNS, i));
const RU_TOWNS = ruAfter(TOWNS, 'в');
const NOT_A_CABLE = (row) => row[3] !== 'Kabul';
const FA_TOWNS = column(TOWNS.filter(NOT_A_CABLE), 5);
const FA_UNSERVED_NAME = column([...ON_ROUTE, ...ELSEWHERE].filter(NOT_A_CABLE), 5);
/**
 * The Afghan names a figure or a rail / air word may not stand beside, as stems (Afgʻonistonga, афганский,
 * Afghan) — expressions, not spellings: uz, uzc, ru, en, zh, fa.
 */
const AFGHAN = [`(?:Afg${AP}?on|Hayraton|Mozori)`, '(?:Афғон|Ҳайратон|Мозори)', '(?:Афган|Хайратон|Мазари)', '(?:Afghan|Ha[iy]rat[ao]n|Mazar)', '(?:阿富汗|海拉顿|马扎里沙里夫)', '(?:افغان|حیرتان|مزار[\\s\\p{Cf}]?شریف)'];

/*
 * 1. Destinations. A claim is (a) a sending verb or a cargo noun with a not-served place as its goal — "we
 * deliver to Kazakhstan", "Eronga ham fura bilan yuk tashiymiz", «Грузы в Иран», 发往伊朗, «حمل بار به ایران»,
 * also as the second name of a list ("to Afghanistan and Iran", «Eron va Afgʻonistonga») — or (b), for the
 * places of ELSEWHERE only, a bare route or a direction of its own: "from China to Iran", "China → Iran", "our
 * Iran route", «Eron yoʻnalishi», «направление Иран», 伊朗方向, «مسیر ایران» — or (c) the name of one of the five
 * cities of TOWNS, or (d) a string that is nothing but the name of a not-served place (a value of the structured
 * data: areaServed). The denial and the question pass
 * ("we do not deliver to Kazakhstan", "Do you ship to Russia?"), and so does a route THROUGH a country ("via
 * Kazakhstan", "across", "the Kazakhstan border", "→ Kazakhstan railway → Saryagash"). What a third party does
 * is not GSR's claim either, so the verbs are those of carrying, never "exports to" (a factory exports to Europe).
 * In a list, the last name stands after "and / or": a bare comma before it starts the next clause («в Ташкент,
 * Казахстан мы проезжаем транзитом»).
 */
/** Uzbek, in either script: the place stands in the dative ("Eronga", "Tehrongacha") before the verb. */
const uzbekDestination = (o) => {
  const B = `(?<!${o.letter})`;
  const E = `(?!${o.letter})`;
  const W = `(?:${o.letter}|[\\d'’‘\`-])+`;
  // "Eronga", "Tehron shahrigacha"; each place with its own ending — "Eronga ham, Afgʻonistonga ham"; or a list
  // that takes one ending at its end — "Eron va Afgʻonistonga", "Eron va boshqa mamlakatlarga".
  const dative = `${B}(?:${o.any})(?:(?:\\s+${o.city})?${o.to}(?:\\s+${o.too})?(?:${o.and}(?:${o.served}|${o.any})${o.to}(?:\\s+${o.too})?){0,3}` +
    `|(?:${o.and}(?:${o.served}|${o.any})){0,2}${o.and}(?:${o.served}|${o.other}\\s+${W}?)${o.to})${E}`;
  const later = `(?![^.!?]{0,60}(?:\\?|${B}(?:${o.no})${E}))`;
  return (
    `${dative}(?:` +
    // a sending verb, up to five words on (never another word in -ga / -gacha: that is the next leg of a route) …
    `(?:\\s+(?!${W}?${o.leg}${E})${W}){0,5}?\\s+(?:${o.verb})(?!${o.notVerb})` +
    // … or the cargo itself: "Eronga yuk", "Eronga fura bilan yigʻma yuk", "Eronga ketayotgan yukni", "Eronga ikki yoʻnalish"
    `|(?:\\s+(?:${o.withCargo})){0,3}\\s+(?:${o.cargo})(?:${o.cargoEnd})?${E}(?![^.!?]{0,40}(?:${o.denied}))` +
    `)${later}` +
    // "Xitoydan Eronga": from … to the place
    `|${B}${W}?${o.from}\\s+${B}(?:${o.far})${o.to}${E}(?![^.!?]{0,60}(?:\\?|${o.denied}|${B}(?:${o.no})${E}))` +
    // "Xitoy → Eron" (not the middle of a route)
    `|→\\s*(?:${o.far})${E}(?![^.!?]{0,80}→)` +
    // "Eron yoʻnalishi", "Eron yoʻnalishida yuk tashiymiz": a direction of its own
    `|${B}(?:${o.far})\\s+(?:${o.route})${o.letter}*(?![^.!?]{0,60}(?:\\?|${o.denied}|${B}(?:${o.no})${E}))` +
    // "Yangi yoʻnalish: Eron, tranzit va ombor"
    `|${B}(?:${o.route})${o.letter}*\\s*[:—–-]\\s*(?:${o.far})${E}(?![^.!?]{0,60}(?:\\?|${o.denied}|${B}(?:${o.no})${E}))` +
    // a city GSR does not deliver to, wherever it is named — unless the sentence denies or asks
    `|${B}(?:${o.towns})${o.letter}*${o.nameOk}` +
    // the whole string is the name: a value of the structured data
    `|^\\s*(?:${o.any})\\s*$`
  );
};
// "…maymiz, …maydi, …magan": a verb that denies, anywhere after a noun ("Eronga yuk tashimaymiz").
const UZ_DENIED = '[a-zʻʼ]+ma(?:y(?:miz|di|siz|man|dilar)|ydigan|gan|sdan)(?![a-zʻʼ])';
const UZC_DENIED = '[а-яёўқғҳ]+ма(?:й(?:миз|ди|сиз|ман|дилар)|йдиган|ган|сдан)(?![а-яёўқғҳ])';
// A city of TOWNS by its name alone. Its spelling can be the same in two languages of one script — Mashhad in Uzbek
// and English, Кандагар in Uzbek Cyrillic and Russian — and every rule reads every page, so the denial and the
// question of BOTH languages let the name through: "We do not deliver to Mashhad", «Mashhadga yetkazmaymiz».
const LATIN_NAME_OK = `(?<!(?:\\b(?:no|not|never|without|cannot|except|beyond)\\b|n[’']t\\b)[^.!?]{0,90})` +
  `(?![^.!?]{0,80}(?:\\?|\\b(?:not|no|never)\\b|n[’']t\\b|${UZ_DENIED}|(?<![a-zʻʼ])(?:yo${AP}?q|emas)(?![a-zʻʼ])))`;
const CYRILLIC_NAME_OK = '(?<!(?<![а-яёўқғҳ])(?:не|нет|ни|кроме|без)(?![а-яёўқғҳ])[^.!?]{0,90})' +
  `(?![^.!?]{0,80}(?:\\?|(?<![а-яёўқғҳ])(?:не|нет|йўқ|эмас)(?![а-яёўқғҳ])|${UZC_DENIED}))`;
const UZ_DEST = uzbekDestination({
  letter: '[a-zʻʼ]', any: UZ_UNSERVED, far: UZ_ELSEWHERE, towns: UZ_TOWNS, nameOk: LATIN_NAME_OK, served: UZ_SERVED, city: 'shahri', other: 'boshqa', too: 'ham',
  to: '(?:ga|gacha|ka|kacha|qa|qacha)', leg: '(?:ga|gacha)', from: 'dan', and: '(?:\\s*,\\s*|\\s+(?:va|hamda|yoki)\\s+)',
  verb: `yetkaz|jo${AP}?nat|yubor|tashi|olib\\s+bor|elt|eksport\\s+qil(?=amiz|yapmiz)`,
  // the denial ("yetkazmaymiz", "yetkazilmaydi", "yetkazib bermaymiz") and the question ("yetkazasizmi"); "tashimalar" is a noun
  notVerb: '(?:il)?ma(?:y|s|d|g|ng)|ib\\s+ber(?:il)?ma(?:y|s|d|g|ng)|[a-zʻʼ]*mi(?![a-zʻʼ])',
  cargo: `yuk|kargo|yo${AP}?nalish`, cargoEnd: 'ni|ning|lar|larni|ingiz|ingizni',
  withCargo: `ham|fura\\s+bilan|yig${AP}?ma|butun|ikki|yangi|ketayotgan|boradigan|jo${AP}?natiladigan|yuboriladigan`,
  denied: UZ_DENIED, no: `yo${AP}?q|emas`, route: `yo${AP}?nalish`,
});
const UZC_DEST = uzbekDestination({
  letter: '[а-яёўқғҳ]', any: UZC_UNSERVED, far: UZC_ELSEWHERE, towns: UZC_TOWNS, nameOk: CYRILLIC_NAME_OK, served: UZC_SERVED, city: 'шаҳри', other: 'бошқа', too: 'ҳам',
  to: '(?:га|гача|ка|кача|қа|қача)', leg: '(?:га|гача)', from: 'дан', and: '(?:\\s*,\\s*|\\s+(?:ва|ҳамда|ёки)\\s+)',
  verb: 'етказ|жўнат|юбор|таши|олиб\\s+бор|элт|экспорт\\s+қил(?=амиз|япмиз)',
  notVerb: '(?:ил)?ма(?:й|с|д|г|нг)|иб\\s+бер(?:ил)?ма(?:й|с|д|г|нг)|[а-яёўқғҳ]*ми(?![а-яёўқғҳ])',
  cargo: 'юк|карго|йўналиш', cargoEnd: 'ни|нинг|лар|ларни|ингиз|ингизни',
  withCargo: 'ҳам|фура\\s+билан|йиғма|бутун|икки|янги|кетаётган|борадиган|жўнатиладиган|юбориладиган',
  denied: UZC_DENIED, no: 'йўқ|эмас', route: 'йўналиш',
});

const RU_E = '(?![а-яё])';
const RU_B = '(?<![а-яё])';
const RU_W = '[а-яё-]+';
const RU_VERB = '(?:достав(?:им|ляем|ляет|ляется|ляются|ить|лять)|довез[ёе]м|довоз(?:им|ит)|вез[ёе]м|вез[ёе]т|везти|возим|возит|возить|привез[ёе]м|привозим|отправ(?:им|ляем|ляет|ляется|ить|лять)|перевоз(?:им|ит|ить)|перевез[ёе]м|экспортируем)';
const RU_NOUN = '(?:доставк[аиуе]|доставкой|отправк[аиуе]|[а-яё]*перевоз(?:к[аиуе]|кой|ок)|карго|грузы?|груза|грузов|направлени[еяй])';
const RU_ITEM = `(?:${RU_SERVED}|${RU_UNSERVED})`;
// «в Иран», «до Тегерана» — the case its preposition takes, so not «в России» (in Russia); and the last name of a
// list: «в Афганистан и Иран», «до Хайратона, Мазари-Шарифа и Мешхеда», «в Хайратон или в Тегеран»
const ruTo = (rows) => {
  const acc = ruAfter(rows, 'в');
  const gen = ruAfter(rows, 'до');
  const one = `(?:(?:в|во|на)\\s+${acc}|до\\s+${gen})`;
  const list = `(?:${RU_ITEM}(?:\\s*,\\s*|\\s+(?:и|или)\\s+)(?:(?:в|во|до|на)\\s+)?){0,2}${RU_ITEM}\\s*,?\\s+(?:и|или)\\s+`;
  return `(?:${one}|(?:в|во|на)\\s+${list}(?:${one}|${acc})|до\\s+${list}(?:${one}|${gen}))${RU_E}`;
};
const RU_TO_UNSERVED = ruTo([...ON_ROUTE, ...ELSEWHERE]);
const RU_TO_ELSEWHERE = ruTo(ELSEWHERE);
// Stands right after the verb or the noun: «не возим грузы в …», «не планируем доставку в …».
const RU_NOT = `(?<!${RU_B}(?:не|нет)\\s(?:${RU_W}\\s){0,3}${RU_W})`;
const RU_NOT_AFTER = `(?![^.!?]{0,40}(?:\\?|${RU_B}(?:нет|не)${RU_E}))`;
const RU_DEST =
  // «возим грузы фурами и в Иран», «куда его везти — в Тегеран»: a sending verb, up to six words on (never «через …»)
  `${RU_B}${RU_VERB}${RU_E}${RU_NOT}(?:\\s+(?!(?:через|из|по|от|транзитом|не)${RU_E})${RU_W}){0,6}?\\s+(?:[—–:-]\\s+)?${RU_TO_UNSERVED}${RU_NOT_AFTER}` +
  // «Грузы в Иран», «Доставка грузов фурой из Китая в Иран»: the noun, and only cargo words between
  `|${RU_B}${RU_NOUN}${RU_E}${RU_NOT}(?:\\s+(?:грузы?|груза|грузов|товары?|товара|товаров|фурой|фурами|и|также|тоже|из\\s+${RU_W}(?:\\s+и(?:\\s+из)?\\s+${RU_W})?)){0,4}\\s+${RU_TO_UNSERVED}${RU_NOT_AFTER}` +
  // «в Иран возим фурами», «до Тегерана доставляем»
  `|${RU_B}${RU_TO_UNSERVED}(?:\\s+(?!не${RU_E})${RU_W}){0,3}?\\s+${RU_VERB}${RU_E}${RU_NOT_AFTER}` +
  // «из Китая в Иран»
  `|${RU_B}из${RU_NOT}\\s+${RU_W}\\s+${RU_TO_ELSEWHERE}${RU_NOT_AFTER}` +
  // «груз, который идёт в Иран»: cargo on its way to a place no route of GSR's leads to
  `|${RU_B}(?:ид[её]т|идут|следу[её]т|следуют|едет|едут|уходит|уходят)${RU_E}${RU_NOT}\\s+${RU_TO_ELSEWHERE}${RU_NOT_AFTER}` +
  // «направление Иран», «по направлению Китай — Иран»
  `|${RU_B}направлени(?:е|я|ю|и|ем)${RU_E}${RU_NOT}\\s*[:—–-]?\\s*(?:${RU_W}\\s*[—–-]\\s*)?(?:${RU_ELSEWHERE})${RU_E}${RU_NOT_AFTER}` +
  // «Тегеран · Мешхед»: a city GSR does not deliver to, wherever it is named — unless the sentence denies or asks
  `|${RU_B}(?:${RU_TOWNS})[а-яё]{0,3}${RU_E}${CYRILLIC_NAME_OK}` +
  // the whole string is the name: a value of the structured data
  `|^\\s*(?:${RU_UNSERVED})\\s*$` +
  `|→\\s*(?:${RU_ELSEWHERE})${RU_E}(?![^.!?]{0,80}→)`;

const EN_VERB = '(?:deliver(?:s|ed|ing)?|ship(?:s|ped|ping)?|send(?:s|ing)?|sent|carry|carries|carried|carrying|forward(?:s|ed|ing)?|transport(?:s|ed|ing)?|haul(?:s|ed|ing)?|dispatch(?:es|ed|ing)?|trucking)';
const EN_NOUN = '(?:deliver(?:y|ies)|shipments?|cargo|freight|carriage|haulage|trucks?|services?|directions?)';
const EN_ITEM = `(?:the\\s+)?(?:${EN_SERVED}|${EN_UNSERVED})(?:\\s+border(?:\\s+crossing)?)?`;
// "to Iran", "to Afghanistan and Iran", "to the Hairatan border crossing, to Mazar-i-Sharif or to Tehran" — not "to the Kazakhstan border"
const enTo = (P) => `(?:to|into)\\s+(?:(?:${EN_ITEM}(?:\\s*,\\s*|\\s+(?:and|or)\\s+)(?:to\\s+)?){0,2}${EN_ITEM}\\s*,?\\s+(?:and|or)\\s+(?:to\\s+)?)?(?:${P})\\b(?!\\s+(?:border|side)|[’']s\\s+border)`;
// Stands right after the verb or the noun: "we do not deliver …", "there is no cargo service …".
const EN_NOT = `(?<!\\b(?:not|never|no|don[’']t|doesn[’']t|cannot|can[’']t|won[’']t)\\s(?:[a-z’']+\\s){0,4}[a-z’']+)`;
const EN_ASKS = '(?![^.!?]{0,40}\\?)';
// "cargo to Iran is not accepted"
const EN_NOT_AFTER = `(?![^.!?]{0,30}\\b(?:(?:is|are)\\s+not|(?:is|are)n[’']t|not)\\s+(?:accepted|offered|available|possible|served|handled|carried|delivered)\\b)`;
const EN_DEST =
  // "we now also carry cargo to Iran": a sending verb, up to six words on (never "via …": that is a route)
  `\\b${EN_VERB}${EN_NOT}\\s+(?:(?!(?:via|through|across)\\b)[a-z’']+\\s+){0,6}?${enTo(EN_UNSERVED)}${EN_ASKS}` +
  // "Cargo to Iran", "freight from China to Kyrgyzstan", "the truck service to Iran": the noun, and only cargo words between
  `|\\b${EN_NOUN}${EN_NOT}(?:\\s+(?:cargo|freight|goods|loads?|services?|by\\s+truck|going|bound|headed|destined|from\\s+[a-z’'-]+(?:\\s+and\\s+(?:from\\s+)?[a-z’'-]+)?)){0,3}\\s+${enTo(EN_UNSERVED)}${EN_ASKS}${EN_NOT_AFTER}` +
  // "cargo bound for Iran", "from China to Iran"
  `|\\b(?:bound|destined|headed)${EN_NOT}\\s+for\\s+(?:${EN_ELSEWHERE})\\b${EN_ASKS}${EN_NOT_AFTER}` +
  // "Iran-bound cargo", "our Iran route", "we serve Iran"
  `|\\b(?:${EN_ELSEWHERE})(?:-bound\\b|\\s+(?:routes?|directions?|lanes?|corridors?|services?)\\b)${EN_NOT}${EN_ASKS}${EN_NOT_AFTER}` +
  `|\\b(?:serve[sd]?|serving)${EN_NOT}\\s+(?:${EN_ITEM}(?:\\s*,\\s*|\\s+(?:and|or)\\s+)){0,2}(?:${EN_ELSEWHERE})\\b${EN_ASKS}` +
  `|\\bfrom${EN_NOT}\\s+[a-z’'-]+\\s+${enTo(EN_ELSEWHERE)}${EN_ASKS}` +
  // "A new direction: Iran, transit and warehouse"
  `|\\b(?:directions?|routes?)${EN_NOT}\\s*[:—–-]\\s*(?:the\\s+)?(?:${EN_ELSEWHERE})\\b${EN_ASKS}` +
  // "Tehran · Mashhad": a city GSR does not deliver to, wherever it is named — unless the sentence denies or asks
  `|\\b(?:${EN_TOWNS})\\b${LATIN_NAME_OK}` +
  // the whole string is the name: a value of the structured data
  `|^\\s*(?:${EN_UNSERVED})\\s*$` +
  `|→\\s*(?:${EN_ELSEWHERE})\\b(?![^.!?]{0,80}→)`;

const ZH_STOP = '。！？!?；;';
const ZH_VERB = '(?:运往|运到|运至|运抵|运送到|运送至|运输到|运输至|送到|送往|送至|送达|发往|发到|发至|发运到|发运至|发货到|发货至|送货到|送货至|直达|寄往|寄到|转运到|转运至|配送到|配送至|派送到|派送至)';
const ZH_FREIGHT = '(?:货运|运输|物流|拼货|空运|陆运|汽运|铁路运输|专线|货物)';
// Stands right after the verb or the place, and reads back over it: 我们不运往…, 目前没有发往…的线路.
const zhNot = (n) => `(?<![不非没无未][^${ZH_STOP}]{0,${n}})`;
const ZH_ASKS = `(?![^${ZH_STOP}]{0,12}(?:吗|？|\\?))`;
// 运到哈萨克斯坦边境, 运抵哈萨克斯坦一侧的口岸: a point on the route, not a destination
const ZH_ON_THE_WAY = '(?!边境|边界|口岸|过境|境内|一侧|段)';
const ZH_DEST =
  // 发往伊朗, 送至海拉顿、马扎里沙里夫和德黑兰
  `${ZH_VERB}${zhNot(11)}\\s?(?:(?:${ZH_SERVED}|${ZH_UNSERVED})(?:口岸)?(?:和|、|及|与|或者|或|以及)){0,3}(?:${ZH_UNSERVED})${ZH_ON_THE_WAY}${ZH_ASKS}` +
  // 伊朗货运, 伊朗专线 (蒙古专线, not 内蒙古专线); 至伊朗汽运, 到俄罗斯的拼货
  `|(?<!内)(?:${ZH_UNSERVED})${zhNot(13)}(?:货运|专线)(?!公司|代理|企业|市场|行业)${ZH_ASKS}` +
  `|(?:至|到|往)${zhNot(9)}\\s?(?:${ZH_UNSERVED})的?${ZH_FREIGHT}${ZH_ASKS}` +
  // 伊朗物流专线, 伊朗运输服务, 伊朗方向的货物; 可发伊朗
  `|(?<!内)(?:${ZH_ELSEWHERE})${zhNot(13)}(?:(?:物流|运输|货运|汽运|陆运)(?:专线|服务|线路)|方向|线路)${ZH_ASKS}` +
  `|(?:可发|可运|可送)${zhNot(6)}(?:${ZH_ELSEWHERE})${ZH_ON_THE_WAY}${ZH_ASKS}` +
  // 中国至伊朗
  `|(?:中国|乌兹别克斯坦|塔什干)(?:至|到)${zhNot(14)}(?:${ZH_ELSEWHERE})${ZH_ON_THE_WAY}${ZH_ASKS}` +
  // 新方向：伊朗、过境与仓储
  `|(?:方向|线路)${zhNot(8)}\\s?[:：—–-]\\s?(?:${ZH_ELSEWHERE})${ZH_ASKS}` +
  // 德黑兰 · 马什哈德: a city GSR does not deliver to, wherever it is named — unless the sentence denies or asks
  `|(?:${ZH_TOWNS})(?<![不非没无未][^${ZH_STOP}]{0,40})(?![^${ZH_STOP}]{0,30}(?:[不没无未]|吗|？|\\?))` +
  // the whole string is the name: a value of the structured data
  `|^\\s*(?:${ZH_UNSERVED})\\s*$` +
  `|→\\s?(?:${ZH_ELSEWHERE})(?![^${ZH_STOP}]{0,40}→)`;

const FA_STOP = '.؟!?';
const FA_NOT_INSIDE = '(?<!\\p{Script=Arabic})'; // the start of a word: به, not the end of جعبه
const FA_ITEM = `(?:${FA_SERVED}|${FA_UNSERVED})`;
// «به ایران», «تا تهران», «به افغانستان و ایران», «تا حیرتان، مزار شریف یا تهران» — هند, not هندسه
const faTo = (P) => `${FA_NOT_INSIDE}(?:به|تا)\\s(?:(?:${FA_ITEM}(?:\\s?،\\s?|\\s(?:و|یا)\\s)(?:(?:به|تا)\\s)?){0,2}${FA_ITEM}\\s?،?\\s(?:و|یا)\\s(?:(?:به|تا)\\s)?)?(?:${P})(?!\\p{Script=Arabic})`;
const FA_MI = '(?<!ن)می[\\s\\p{Cf}]?';
// "we carry / send / deliver": a claim for every place …
const FA_WE = `(?:${FA_MI}(?:رسانیم|فرستیم|آوریم|بریم)|(?:حمل|ارسال|ترانزیت|صادر|منتقل)\\s?${FA_MI}کنیم|تحویل\\s?${FA_MI}دهیم)`;
// … "(GSR) carries", "(the cargo) is carried": for the places of ELSEWHERE only — «کامیون بار را به قزاقستان می‌برد» is a route.
// The question «آیا به ایران هم بار می‌برید؟» has another ending and passes.
const FA_IT = `(?:${FA_MI}(?:رساند|فرستد|برد)|(?:حمل|ارسال|ترانزیت|صادر|منتقل)\\s?${FA_MI}(?:کند|شود)|تحویل\\s?${FA_MI}(?:دهد|شود)|(?:رسانده|فرستاده|برده)\\s?${FA_MI}شود)(?!\\p{Script=Arabic})`;
const FA_NOT_AFTER = `(?![^${FA_STOP}]{0,25}(?:نمی|ندار|نیست|؟))`;
const FA_DEST =
  `${faTo(FA_UNSERVED)}[^${FA_STOP}]{0,25}?${FA_WE}(?![^${FA_STOP}]{0,12}؟)` +
  `|${faTo(FA_ELSEWHERE)}[^${FA_STOP}]{0,25}?${FA_IT}(?![^${FA_STOP}]{0,12}؟)` +
  // «حمل بار به ایران», «حمل بار با کامیون از چین به ایران»
  `|${FA_NOT_INSIDE}(?:حمل(?:[\\s\\p{Cf}]?و[\\s\\p{Cf}]?نقل)?|ارسال|ترانزیت|کارگو|باربری|ترابری|انتقال(?=\\s(?:بار|کالا|محموله)))(?:\\s(?:بار|کالا|محموله))?(?:\\sبا\\sکامیون)?(?:\\sاز\\s[^${FA_STOP}،]{1,20})?\\s${faTo(FA_UNSERVED)}${FA_NOT_AFTER}` +
  // «از چین به ایران»; «باری که مقصدش ایران است»
  `|${FA_NOT_INSIDE}از\\s(?:چین|ازبکستان|تاشکند)\\s${faTo(FA_ELSEWHERE)}${FA_NOT_AFTER}` +
  `|${FA_NOT_INSIDE}مقصد(?:ش|\\sآن)?\\s(?:${FA_ELSEWHERE})(?!\\p{Script=Arabic})${FA_NOT_AFTER}` +
  // «مسیر ایران», «مسیر چین–ایران»
  `|${FA_NOT_INSIDE}مسیر\\s(?:به\\s)?(?:(?:چین|ازبکستان|تاشکند)\\s?[–—-]\\s?)?(?:${FA_ELSEWHERE})(?!\\p{Script=Arabic})${FA_NOT_AFTER}` +
  // «مسیر تازه: ایران، ترانزیت و انبار»
  `|${FA_NOT_INSIDE}مسیر(?:\\s[\\p{Script=Arabic}\\p{Cf}]+)?\\s?[:：—–-]\\s?(?:${FA_ELSEWHERE})(?!\\p{Script=Arabic})${FA_NOT_AFTER}` +
  // «تهران • مشهد»: a city GSR does not deliver to, wherever it is named — unless the sentence denies or asks
  `|${FA_NOT_INSIDE}(?:${FA_TOWNS})(?!\\p{Script=Arabic})(?![^${FA_STOP}]{0,80}(?:نمی|ندار|نیست|نشد|؟))` +
  // the whole string is the name: a value of the structured data
  `|^\\s*(?:${FA_UNSERVED_NAME})\\s*$` +
  `|←\\s?(?:${FA_ELSEWHERE})(?!\\p{Script=Arabic})(?![^${FA_STOP}]{0,60}←)`;
const DEST_MSG = (lang) => `names a country or city GSR does not serve as a destination (${lang}) — it delivers in Uzbekistan and, in Afghanistan, to Hairatan and Mazar-i-Sharif only (owner, 2026-11-11); Kabul, Herat, Kandahar, Tehran and Mashhad may be named only in a denial or a question`;

/*
 * 2. Persian-speaking staff. A claim is staff who "speak / answer in / know" Persian or Dari, "we answer in
 * Persian", "Persian-speaking staff", "support in Persian". The site says instead, in every language: write in
 * Persian or Dari and we answer in Persian WITH THE HELP OF A TRANSLATOR — so a sentence that names the
 * translator passes, wherever in the sentence it does. "The site is published in Persian", "Persian-speaking
 * readers", a question and the denial — "our managers do not speak Persian", "there is no support in Persian" —
 * pass too: the site has to be able to say what is true. (scripts/test-seo.mjs guards the structured data: no
 * Persian in knowsLanguage / availableLanguage.)
 */
// …maydi, …maymiz, …magan: the verb denies. Unlike UZ_DENIED it may begin at «ma» — the rule has already read the verb's stem (gaplash|maydi).
const UZ_NOT_VERB = '[a-zʻʼ]*ma(?:y(?:miz|di|siz|man|dilar)|ydigan|gan|sdan)(?![a-zʻʼ])';
const UZC_NOT_VERB = '[а-яёўқғҳ]*ма(?:й(?:миз|ди|сиз|ман|дилар)|йдиган|ган|сдан)(?![а-яёўқғҳ])';
const uzbekStaff = (o) => {
  const B = `(?<!${o.letter})`;
  const E = `(?!${o.letter})`;
  const lang = `${B}(?:${o.persian})(?:${o.cha}${E}|\\s+${o.til}${E})`; // forscha, fors tilida, forsiy tilda, dari tillarini
  return `(?:${B}(?:${o.staff})${o.letter}*[^.!?;]{0,60}?${lang}` + // «Menejerlar … fors tillarida»
    `|${lang}\\s+(?:${o.too}\\s+)?(?:${o.speak}|(?:${o.knowing})[^.!?;]{0,20}?${B}(?:${o.staff})))` + // «forscha javob beramiz», «fors tilini biladigan menejer»
    `(?<!${o.translator}[^.!?;]{0,160})(?![^.!?;]{0,40}(?:\\?|${o.neg}|${o.translator}))`;
};
const UZ_STAFF = uzbekStaff({
  letter: '[a-zʻʼ]', persian: 'fors(?:iy)?|dariy?', cha: 'cha', til: 'til(?:i|ida|ini|da|ni|lari|larida|larini|larda|larni)', too: 'ham',
  staff: 'menejer|xodim|mutaxassis|operator|maslahatchi|jamoa', knowing: 'biladigan|bilguvchi',
  speak: `gaplash|so${AP}?zlash|gapir|javob\\s+ber|muloqot\\s+qil|maslahat\\s+ber|xizmat\\s+ko${AP}?rsat|qo${AP}?llab[-\\s]quvvatla|bil(?:adi(?!gan)|amiz|ishadi)`,
  neg: `(?<![a-zʻʼ])(?:emas|yo${AP}?q)(?![a-zʻʼ])|${UZ_NOT_VERB}`, translator: 'tarjimon',
});
const UZC_STAFF = uzbekStaff({
  letter: '[а-яёўқғҳ]', persian: 'форс(?:ий)?|дарий?', cha: 'ча', til: 'тил(?:и|ида|ини|да|ни|лари|ларида|ларини|ларда|ларни)', too: 'ҳам',
  staff: 'менежер|ходим|мутахассис|оператор|маслаҳатчи|жамоа', knowing: 'биладиган|билгувчи',
  speak: 'гаплаш|сўзлаш|гапир|жавоб\\s+бер|мулоқот\\s+қил|маслаҳат\\s+бер|хизмат\\s+кўрсат|қўллаб[-\\s]қувватла|бил(?:ади(?!ган)|амиз|ишади)',
  neg: `(?<![а-яёўқғҳ])(?:эмас|йўқ)(?![а-яёўқғҳ])|${UZC_NOT_VERB}`, translator: 'таржимон',
});
const RU_PERSIAN = '(?:фарси|персидск[а-яё]+|дари)(?![а-яё])';
const RU_WHO = '(?:менеджер|сотрудник|специалист|оператор|консультант|команд|персонал)';
const RU_VERB_NOT = `(?<!${RU_B}(?:не|ни)\\s[а-яё]+)`; // right after the verb: «не говорят»
// «на узбекском, русском и фарси»: the languages before the Persian one
const RU_IN = `(?:на\\s+)?(?:[а-яё-]+(?:\\s*,\\s*|\\s*,?\\s+(?:и|или)\\s+)){0,4}(?:на\\s+)?(?:языке\\s+)?${RU_PERSIAN}`;
const RU_STAFF =
  '(?:' +
  // «менеджеры говорят на узбекском, русском и фарси»
  `${RU_B}${RU_WHO}[а-яё]*[^.!?;]{0,60}?${RU_B}(?:говор|отвеча|ответ|владе|общаю|общае|пиш|разговарива)[а-яё]*${RU_VERB_NOT}[^.!?;]{0,40}?${RU_B}${RU_PERSIAN}` +
  // «знают дари», «консультируем на русском и фарси» — the language right after the verb
  `|${RU_B}(?:зна(?:ет|ют|ем)|понима(?:ет|ют|ем)|консультиру(?:ет|ют|ем)|обслужива(?:ет|ют|ем))${RU_VERB_NOT}\\s+${RU_IN}` +
  // «отвечаем на фарси», «говорим по-персидски»
  `|${RU_B}(?:говорим|отвечаем|ответим|общаемся|владеем|пишем|разговариваем)${RU_VERB_NOT}\\s+(?:(?:и|также|тоже)\\s+)?(?:${RU_IN}|по-персидски${RU_E})` +
  // «поддержка на фарси», «менеджер со знанием дари», «фарсиязычные менеджеры» — unless the clause denies it
  `|(?:${RU_B}(?:поддержк[аиуе]|поддержкой|консультаци[яию]|обслуживание|помощь)\\s+на\\s+(?:языке\\s+)?${RU_PERSIAN}` +
  `|${RU_B}со\\s+знанием\\s+(?:языка\\s+)?${RU_PERSIAN}` +
  `|${RU_B}(?:фарси|персо|дари)язычн[а-яё]*\\s+(?:${RU_WHO}|поддержк)[а-яё]*)` +
  `(?<!${RU_B}(?:не|нет|без|ни|никто|никого)${RU_E}[^.!?;:—–]{0,70})(?![^.!?;:—–]{0,30}${RU_B}(?:не|нет)${RU_E})` +
  ')(?<!переводчик[а-яё]*[^.!?;]{0,160})(?![^.!?;]{0,40}переводчик)(?![^.!?]{0,60}\\?)';
const EN_PERSIAN = '(?:Persian|Farsi|Dari)';
const EN_WHO = '(?:managers?|staff|team|specialists?|operators?|employees?|consultants?|agents?|representatives?|colleagues?)';
const EN_VERB_NOT = `(?<!\\b(?:not|no|never|cannot)\\s[a-z]+|n[’']t\\s[a-z]+)`; // right after the verb: "do not speak"
const EN_NOBODY = '(?<!\\b(?:nobody|no\\s?one|none|no|neither|nor)\\b[^.!?;:—–]{0,45})'; // right after the subject: "nobody on our team"
const EN_STAFF =
  '(?:' +
  // "our managers speak Uzbek, Russian and Persian", "we answer in Dari"
  `\\b(?:${EN_WHO}|we)\\b${EN_NOBODY}[^.!?;]{0,60}?\\b(?:speaks?|answers?|repl(?:y|ies)|writes?|fluent)\\b${EN_VERB_NOT}[^.!?;]{0,40}?\\b${EN_PERSIAN}\\b` +
  // "our managers know Dari", "we understand Farsi" — the language right after the verb
  `|\\b(?:${EN_WHO}|we)\\b${EN_NOBODY}[^.!?;]{0,30}?\\b(?:knows?|understands?)\\b${EN_VERB_NOT}\\s+(?:[a-z]+(?:\\s*,\\s*|\\s*,?\\s+(?:and|or)\\s+)){0,4}${EN_PERSIAN}\\b` +
  // "Persian-speaking staff", "support in Dari", "Farsi support", "Dari speakers on our team" — unless the clause denies it
  `|(?:\\b${EN_PERSIAN}[-\\s]speaking\\s+(?:${EN_WHO}|support)\\b` +
  `|\\b(?:support|customer\\s+service|assistance|consultations?|help(?:line)?)\\s+in\\s+${EN_PERSIAN}\\b` +
  `|\\b${EN_PERSIAN}(?:[-\\s]language)?\\s+(?:support|helpline|hotline|customer\\s+service|assistance)\\b` +
  `|\\b${EN_PERSIAN}\\s+speakers?\\b[^.!?;]{0,20}?\\bon\\s+(?:our\\s+|the\\s+)?(?:staff|team)\\b)` +
  `(?<!(?:\\b(?:no|not|never|without|cannot|nobody|none|neither|nor)\\b|n[’']t\\b)[^.!?;:—–]{0,70})(?![^.!?;:—–]{0,30}(?:\\b(?:not|never|no\\s+longer)\\b|n[’']t\\b))` +
  ')(?<!\\b(?:translator|interpreter)\\b[^.!?;]{0,160})(?![^.!?;]{0,60}\\b(?:translator|interpreter)\\b)(?![^.!?]{0,60}\\?)';
const ZH_PERSIAN = '(?:波斯语|达里语|法尔西语)';
const ZH_WHO = '(?:客户经理|经理|员工|工作人员|团队|同事|客服|我们)';
const ZH_STAFF =
  '(?:' +
  `${ZH_WHO}[^${ZH_STOP}]{0,20}?(?:会说|会讲|可用|使用|通晓|精通|懂|讲)${zhNot(8)}[^${ZH_STOP}]{0,20}?${ZH_PERSIAN}` +
  // 用中文、俄语和波斯语回复
  `|(?:用|以)(?:[\\p{Script=Han}A-Za-z]{1,6}[、，,和及或与]){0,4}${ZH_PERSIAN}${zhNot(24)}(?:[、和及或与]${ZH_PERSIAN})?[^${ZH_STOP}，,]{0,4}?(?:回复|答复|沟通|交流|接待|服务|联系)` +
  // 波斯语客服, 会波斯语的客户经理 — not 没有波斯语客服
  `|${ZH_PERSIAN}${zhNot(12)}(?:客服|服务|支持|沟通|接待|咨询)(?![^${ZH_STOP}]{0,8}[不没无未])` +
  `|(?:会说?|会讲|懂|通晓|精通|讲)${ZH_PERSIAN}${zhNot(12)}(?:[、和及或与]${ZH_PERSIAN})?的${ZH_WHO}(?![^${ZH_STOP}]{0,8}[不没无未])` +
  `)(?<!翻译[^${ZH_STOP}]{0,60})(?![^${ZH_STOP}]{0,12}翻译)${ZH_ASKS}`;
const FA_NAME = '(?:فارسی|پارسی|دری)';
const FA_PERSIAN = `${FA_NAME}(?!\\p{Script=Arabic})`; // دری, not دریافت or دریایی
const FA_NOT_SOON = `(?![^${FA_STOP}؛;]{0,12}(?:نمی|ندار|نیست|نشد))`; // the verb that follows denies: پاسخ نمی‌دهیم, نداریم
const FA_STAFF =
  '(?:' +
  `(?:(?:مدیر|کارشناس|مشاور|همکار|کارمند)(?:ان)?|کارکنان)(?:\\sما)?[^${FA_STOP}؛;]{0,40}?${FA_PERSIAN}\\s?(?:صحبت|پاسخ|${FA_MI}(?:دانند|داند)|بلدند|بلد\\sاست|مسلط)${FA_NOT_SOON}` +
  `|(?:پشتیبانی|مشاوره|خدمات|پاسخ[\\s\\p{Cf}]?گویی)\\s(?:به\\s)?(?:زبان\\s)?${FA_PERSIAN}${FA_NOT_SOON}` +
  `|(?:به\\s)?زبان\\s${FA_PERSIAN}\\sپاسخ${FA_NOT_SOON}` +
  // «به فارسی پاسخ می‌دهیم», «فارسی هم صحبت می‌کنیم»
  `|${FA_PERSIAN}\\s(?:هم\\s)?(?:(?:پاسخ|جواب)\\s?${FA_MI}(?:دهیم|گوییم)|صحبت\\s?${FA_MI}کنیم)` +
  // «کارمند مسلط به فارسی»
  `|مسلط\\sبه\\s(?:زبان\\s)?${FA_PERSIAN}(?![^${FA_STOP}؛;]{0,25}(?:ندار|نیست))` +
  // «کارمند فارسی‌زبان», «کارشناس دری‌زبان» — not «مشتریان فارسی‌زبان»
  `|(?:(?:مدیر|کارشناس|مشاور|همکار|کارمند|پشتیبان|اپراتور)(?:ان|[\\s\\p{Cf}]?های?)?|کارکنان|تیم)(?:\\p{Mn}|ی)?\\s${FA_NAME}[\\s\\p{Cf}]?زبان(?![^${FA_STOP}؛;]{0,25}(?:ندار|نیست))` +
  `)(?<!مترجم[^${FA_STOP}؛;]{0,160})(?![^${FA_STOP}؛;]{0,40}مترجم)(?![^${FA_STOP}]{0,60}؟)`;
const STAFF_MSG = (lang) => `claims Persian- or Dari-speaking staff (${lang}) — nobody at GSR speaks Persian: a Persian message is answered with the help of a translator (say so in the same sentence)`;

/*
 * 3. The Afghanistan direction, a new one (owner, 2026-11-11): no price and no number of days is published for
 * it, and it is carried by truck only. Both rules are BLOCK rules (`block: true`): they read one block of a page
 * at a time — a paragraph, a heading, a list item, a table row — because their windows would otherwise reach
 * from one card into the next: on the home page «20–35 kun» of the rail card stands right before the heading
 * «Yangi yoʻnalish: Afgʻoniston…».
 *
 *   afghanFigure  a number of days, weeks or hours, or a price, within 60 characters of Afghanistan, Hairatan or
 *                 Mazar-i-Sharif in one sentence. No exception for a denial: "15–25 days is China → Tashkent"
 *                 goes into a sentence of its own.
 *   afghanMode    a rail, wagon or air word within 30 characters of such a name in one sentence — unless the
 *                 sentence denies it ("not by rail", "by truck only") or asks. "…by air and rail, and to
 *                 Afghanistan by truck" is the contrast, not the claim: a truck word right after the name passes.
 */
const NUM = '\\d{1,4}(?:[.,]\\d{1,3})*';
// "5–7 kun", "от 5 до 7 дней", "3 days", "1,200 USD", "$900" — never the tail of a longer number or of a phone
const figure = (range, time, money) => `(?<![\\d.,+])(?:${NUM}(?:\\s?(?:[–—-]|${range})\\s?${NUM})?\\s?-?\\s?(?:${time}|${money})|[$€¥]\\s?\\d)`;
const beside = (name, fig, stop) => `${name}[^${stop}]{0,60}?${fig}|${fig}[^${stop}]{0,60}?${name}`;
const UZ_FIGURE = figure('dan', '(?:ish\\s+)?kun|sutka|hafta|soat', `\\$|USD|dollar|AQSH\\s+dollari|so${AP}?m|UZS|yuan|€|EUR`);
const UZC_FIGURE = figure('дан', '(?:иш\\s+)?кун|сутка|ҳафта|соат', '\\$|USD|доллар|АҚШ\\s+доллари|сўм|UZS|юан|€|EUR');
const RU_FIGURE = figure('до', '(?:рабоч[а-яё]+\\s+)?(?:дн[еяй]|день|суток|сутки)|недел[ьюией]|час(?:а|ов)?(?![а-яё])', '\\$|USD|доллар|сум(?![а-яё])|сумов|UZS|юан|€|EUR|евро');
const EN_FIGURE = figure('to', '(?:working\\s+|business\\s+)?days?\\b|weeks?\\b|hours?\\b', '\\$|USD|US\\s?dollars?|dollars?\\b|UZS|soums?\\b|sums?\\b|yuan|CNY|€|EUR|euros?\\b');
// 日 only as a duration (3 日内送达), not the day of a date (11月12日); 周 is a week, not 周一 or 周末; 天, not 天津
const ZH_FIGURE = figure('至|到|~|～', '个?工作日|天(?!津)|日(?=内|之内|左右|以内|可达|送达|到达|抵达|运抵)|周(?![一二三四五六日末年期边围])|个?星期|个?小时', '\\$|USD|美元|美金|元|人民币|苏姆|UZS|€|欧元');
const FA_FIGURE = figure('تا|الی', '(?:روزه?|هفته|ساعته?)(?!\\p{Script=Arabic})', '\\$|USD|دلار|سوم(?!\\p{Script=Arabic})|یوان|تومان|ریال|€|یورو');
const FIGURE_MSG = (lang) => `a number of days or a price beside Afghanistan, Hairatan or Mazar-i-Sharif (${lang}) — on this direction price and time are on request; the site's figures are China → Tashkent only (say so in a sentence of its own)`;
const mode = (o) => {
  const stop = o.stop ?? '.!?;';
  return `(?:(?:${o.mode})[^${stop}]{0,30}?${o.name}(?![^${stop}]{0,30}(?:${o.truck}))|${o.name}[^${stop}]{0,30}?(?:${o.mode}))` +
    `(?<!(?:${o.no})[^${stop}]{0,90})(?![^${stop}]{0,40}(?:${o.no}|${o.asks}))`;
};
// Look-alikes kept out: goods that carry the word (air conditioners, воздушные фильтры, вагонка, 钢铁运输), «поездка» (a trip),
// "we train our drivers", «تریلی» (a trailer truck — it holds «ریلی») and «آب و هوایی» (the weather).
const EN_AIR_GOODS = '\\s*-?\\s*(?:condition|compress|purif|fry|filter|cool|dry|pump|mattress|bag|duct|curtain|gun|tool|freshener|quality)';
const UZ_MODE = mode({ name: AFGHAN[0], mode: `temir[\\s-]*yo${AP}?l|poyezd(?!ka)|vagon(?!ka)|avia|samolyot|uchoq|havo\\s+yo${AP}?l`, truck: 'fura|avto|yuk\\s+mashina', asks: '\\?',
  no: `${UZ_DENIED}|(?<![a-zʻʼ])(?:yo${AP}?q|emas)(?![a-zʻʼ])|(?<![a-zʻʼ])faqat\\s+fura` });
const UZC_MODE = mode({ name: AFGHAN[1], mode: 'темир[\\s-]*йўл|поезд(?!ка)|вагон(?!ка)|авиа|самолёт|учоқ|ҳаво\\s+йўл', truck: 'фура|авто|юк\\s+машина', asks: '\\?',
  no: `${UZC_DENIED}|(?<![а-яёўқғҳ])(?:йўқ|эмас)(?![а-яёўқғҳ])|(?<![а-яёўқғҳ])фақат\\s+фура` });
const RU_MODE = mode({ name: AFGHAN[2], mode: 'железн[а-яё]+\\s+дорог|железнодорожн|ж/д|ж\\.-?\\s?д\\.|(?<![а-яё])жд(?![а-яё])|поезд(?!к)|вагон(?!к)|авиа|самол[её]т|воздушн[а-яё]+\\s+(?:транспорт|перевоз|сообщени|пут|достав|лини|судн|мост|коридор)', truck: 'фур|автомобил|автотранспорт', asks: '\\?',
  no: '(?<![а-яё])(?:не|нет|ни)(?![а-яё])|только\\s+фур' });
const EN_MODE = mode({ name: AFGHAN[3], mode: `\\brail(?:way|road|car|freight)?s?\\b|\\btrains?\\b(?!\\s+(?:our|their|its|your|all|new|drivers?|staff)\\b)|\\bwagons?\\b|\\bair\\b(?!${EN_AIR_GOODS})|\\bair(?:freight|craft|lift|planes?|lines?)\\b|\\bplanes?\\b|\\bflights?\\b|\\bfl(?:y|ies|ew|own|ying)\\b`, truck: '\\btrucks?\\b|\\blorr(?:y|ies)\\b', asks: '\\?',
  no: `\\b(?:not|no|never|without)\\b|n[’']t\\b|\\bonly\\s+by\\s+truck\\b|\\btruck\\s+only\\b` });
const ZH_MODE = mode({ name: AFGHAN[4], mode: '铁路|(?<!钢)铁运|火车|班列|专列|列车|车皮|空运|空派|航空|航班|飞机|直飞|飞往', truck: '汽运|卡车|货车|公路', stop: ZH_STOP, asks: '吗|？|\\?',
  no: '[不没无未]|只走汽运|仅走汽运|只有汽运|仅限汽运' });
const FA_MODE = mode({ name: AFGHAN[5], mode: '(?<!ت)ریلی|(?<!\\p{Script=Arabic})ریل(?!\\p{Script=Arabic})|(?:راه|خط)[\\s\\p{Cf}]?آهن|قطار|واگن|(?<!آب[\\s\\p{Cf}]?و[\\s\\p{Cf}]?)هوایی|هواپیما|طیاره', truck: 'کامیون|تریلی|لاری|موتر', stop: `${FA_STOP}؛;`, asks: '؟',
  no: 'نمی|ندار|نیست|نشده|بدون|فقط\\sبا\\sکامیون' });
const MODE_MSG = (lang) => `offers rail, wagon or air carriage to Afghanistan (${lang}) — that direction is by truck only (a denial passes; a contrast goes into two sentences)`;

/*
 * 4. Three more things the Afghanistan direction never says (owner, 2026-11-11: the smallest lot is on request, the
 * direction is new, and GSR has no office, representative or partner there). An audit of 2026-11-12 found that
 * nothing stopped them. Block rules too; each reads one sentence.
 *
 *   afghanVolume    a volume figure (m³, cubic metres) within 60 characters of Afghanistan, Hairatan or
 *                   Mazar-i-Sharif. The 1 m³ minimum is China → Tashkent's: say so in a sentence of its own.
 *   afghanPresence  an office, a branch or a representative IN Afghanistan, Hairatan or Mazar-i-Sharif.
 *   afghanSchedule  weekly, daily or "regular" departures within 40 characters of such a name.
 * A denial ("we have no office in Afghanistan", "no weekly departures") or a question passes the last two.
 */
const cbm = (unit) => `(?<![\\d.,+])${NUM}(?:\\s?[–—-]\\s?${NUM})?\\s?(?:${unit})`;
const UZ_CBM = cbm('m[³3]|kub|metr\\s+kub');
const UZC_CBM = cbm('м[³3]|куб|метр\\s+куб');
const RU_CBM = cbm('м[³3]|куб');
const EN_CBM = cbm('m[³3]|cbm\\b|cubic\\s+met(?:er|re)s?\\b');
const ZH_CBM = cbm('m[³3]|立方|方(?![面向案式法便形])|cbm');
const FA_CBM = cbm('متر[\\s\\p{Cf}]?مکعب|m[³3]');
const VOLUME_MSG = (lang) => `a volume figure beside Afghanistan, Hairatan or Mazar-i-Sharif (${lang}) — the smallest lot on this direction is agreed with the manager; the 1 m³ minimum is China → Tashkent's (say so in a sentence of its own)`;
// `words` within `span` characters of `name`, in one sentence — unless the sentence denies it or asks (as mode() does)
const nearName = (o) => {
  const stop = o.stop ?? '.!?;';
  const span = o.span ?? 40;
  return `(?:(?:${o.words})[^${stop}]{0,${span}}?${o.name}|${o.name}[^${stop}]{0,${span}}?(?:${o.words}))` +
    `(?<!(?:${o.no})[^${stop}]{0,90})(?![^${stop}]{0,40}(?:${o.no}|${o.asks}))`;
};
const UZ_NO = `${UZ_DENIED}|(?<![a-zʻʼ])(?:yo${AP}?q|emas)(?![a-zʻʼ])`;
const UZC_NO = `${UZC_DENIED}|(?<![а-яёўқғҳ])(?:йўқ|эмас)(?![а-яёўқғҳ])`;
const RU_NO = '(?<![а-яё])(?:не|нет|ни)(?![а-яё])';
const EN_NO = `\\b(?:not|no|never|without)\\b|n[’']t\\b`;
const ZH_NO = '[不没无未]';
const FA_NO = 'نمی|ندار|نیست|نشده|بدون';
// "IN Afghanistan": the locative, so that «Ofisimiz Toshkentda; Afgʻonistonga fura bilan…» and «в Афганистан возим» pass
const UZ_PRESENCE = nearName({ name: `(?:Afg${AP}?oniston|Hayraton|Mozori\\s+Sharif)(?:da|dagi)(?![a-zʻʼ])`, words: 'ofis|filial|vakolatxona|vakil', no: UZ_NO, asks: '\\?' });
const UZC_PRESENCE = nearName({ name: '(?:Афғонистон|Ҳайратон|Мозори\\s+Шариф)(?:да|даги)(?![а-яёўқғҳ])', words: 'офис|филиал|ваколатхона|вакил', no: UZC_NO, asks: '\\?' });
const RU_PRESENCE = nearName({ name: '(?<![а-яё])в\\s+(?:Афганистане|Хайратоне|Мазари[\\s-]*Шарифе)', words: 'офис|филиал|представительств|(?<![а-яё])представител', no: RU_NO, asks: '\\?' });
const EN_PRESENCE = nearName({ name: `\\b(?:in|at)\\s+(?:Afghanistan|Ha[iy]rat[ao]n|Mazar[\\s-]*[ie][\\s-]*Sharif)`, words: '(?<!customs\\s)\\boffices?\\b|\\bbranch(?:es)?\\b|\\brepresentatives?\\b', no: EN_NO, asks: '\\?' });
const ZH_PRESENCE = nearName({ name: '(?:阿富汗|海拉顿|马扎里沙里夫)', words: '办事处|分公司|代表处|办公室|分支机构', span: 10, stop: `${ZH_STOP}，,、`, no: ZH_NO, asks: '吗|？|\\?' });
const FA_PRESENCE = nearName({ name: 'در\\s(?:افغانستان|حیرتان|مزار[\\s\\p{Cf}]?شریف)', words: 'دفتر(?!چه)|نمایندگی|نماینده|شعبه', stop: `${FA_STOP}؛;`, no: FA_NO, asks: '؟' });
const PRESENCE_MSG = (lang) => `claims an office, a branch or a representative in Afghanistan (${lang}) — GSR has none there (a denial passes)`;
const UZ_SCHEDULE = nearName({ name: AFGHAN[0], words: `har\\s+(?:hafta|kuni?)(?![a-zʻʼ])|haftasiga|haftalik|kuniga|muntazam\\s+(?:reys|qatnov|jo${AP}?nat|ravishda)|jadval\\s+bo${AP}?yicha`, no: UZ_NO, asks: '\\?' });
const UZC_SCHEDULE = nearName({ name: AFGHAN[1], words: 'ҳар\\s+(?:ҳафта|куни?)(?![а-яёўқғҳ])|ҳафтасига|ҳафталик|кунига|мунтазам\\s+(?:рейс|қатнов|жўнат|равишда)|жадвал\\s+бўйича', no: UZC_NO, asks: '\\?' });
const RU_SCHEDULE = nearName({ name: AFGHAN[2], words: 'еженедельн|ежедневн|кажд(?:ую|ый|ые)\\s+(?:неделю|день)|раза?\\s+в\\s+(?:неделю|месяц)|регулярн[а-яё]+\\s+(?:рейс|отправ|отгруз|сообщени)|по\\s+расписани', no: RU_NO, asks: '\\?' });
const EN_SCHEDULE = nearName({ name: AFGHAN[3], words: '\\bweekly\\b|\\bdaily\\b|\\bevery\\s+(?:week|day|month|(?:mon|tues|wednes|thurs|fri|satur|sun)day)\\b|\\b(?:once|twice|\\d+\\s+times)\\s+a\\s+(?:week|month)\\b|\\bregular\\s+(?:departures?|trucks?|services?|runs?|schedules?|shipments?)\\b|\\bscheduled\\s+departures?\\b', no: EN_NO, asks: '\\?' });
const ZH_SCHEDULE = nearName({ name: AFGHAN[4], words: '每周|每天|每日|定期发|定期班|固定班期|固定发车|周[一二三四五六日]发', stop: ZH_STOP, no: ZH_NO, asks: '吗|？|\\?' });
const FA_SCHEDULE = nearName({ name: AFGHAN[5], words: 'هر\\s(?:هفته|روز)(?!\\p{Script=Arabic})|هفتگی|روزانه|منظم', stop: `${FA_STOP}؛;`, no: FA_NO, asks: '؟' });
const SCHEDULE_MSG = (lang) => `claims regular or scheduled departures to Afghanistan (${lang}) — the direction is new and no schedule is confirmed (a denial passes)`;

/**
 * Each rule: `{ id, msg, re, bad, good }`, and `block: true` where it reads one block of a page at a time.
 * In the Persian patterns `[\s\p{Cf}]` is "a space or a ZWNJ" (نیم‌فاصله), `(?<!ن)می` keeps the
 * negative نمی… (the denial) out, and `\p{Mn}` is the kasra/hamza of an ezafe. In the Chinese ones
 * `(?<![不非没无未]…)` is the negation the denial wording puts in front of the claim.
 */
export const CLAIM_RULES = [
  /* — customs and documents (the uz/ru "bojsiz / без пошлин" rules) — */
  { id: 'zh.dutyFree', msg: 'promises duty-free shipping (zh)',
    // 个人免税进口限额 is the statutory allowance (Cabinet Resolution No. 244), not a promise — as in
    // the uz rule's "bojsiz olib kirish normalari".
    re: /(?<![不非没无未][^。！？!?]{0,12})(?<!个人|自然人)(?:免税|免关税|包税)\s?(?:运输|运送|送达|发货|进口(?!限额|额度|限值|限制|标准|规定|政策|门槛|上限|配额)|清关|到门|到家|直达|专线)|双清包税|包税包清关|包清关包税/iu,
    bad: ['我们免税运输到塔什干', '双清包税专线', '免税进口到乌兹别克斯坦'],
    good: ['我们从不承诺“免税”、“100%保证”或“最快”。', '个人免税额度为每月 200 美元', '我们不提供免税进口', '内阁第 244 号决议——个人免税进口限额（每月 200 美元）', '免税进口限额为每月 200 美元'] },
  { id: 'zh.noCustoms', msg: 'claims no customs clearance is needed (zh)',
    re: /(?:无需|不需要|不用|免)\s?(?:清关|报关)(?!费|单|员|行)/iu,
    bad: ['无需清关，直接送到', '不用报关'],
    good: ['清关费另计', '需要清关', '小件个人包裹不需要报关单'] },
  { id: 'zh.noDocs', msg: 'claims shipping without documents (zh)',
    re: /(?:无需|不需要|不用|免)(?:任何)?(?:文件|单据|单证|报关单|手续)(?:即可)?(?:进口|运输|发货|清关|运到|送到)/iu,
    bad: ['无需任何文件即可进口'],
    good: ['没有文件的货物不予接收'] },
  { id: 'fa.dutyFree', msg: 'promises duty-free shipping (fa)',
    re: /(?<!«)(?:بدون|بی)[\s\p{Cf}]?(?:پرداخت\s)?(?:گمرک|عوارض(?:\sگمرکی)?|حقوق\sگمرکی|مالیات)[^.؟!?]{0,25}(?:(?<!ن)می[\s\p{Cf}]?(?:رسانیم|آوریم|فرستیم)|حمل\s?(?<!ن)می[\s\p{Cf}]?کنیم|وارد\s?(?<!ن)می[\s\p{Cf}]?کنیم|تحویل\s?(?<!ن)می[\s\p{Cf}]?دهیم)/iu,
    bad: ['بدون گمرک به تاشکند می‌رسانیم'],
    good: ['ما هرگز «بدون گمرک» نمی‌گوییم', 'کالا را بدون گمرک نمی‌رسانیم', 'تا ۲۰۰ دلار در ماه بدون پرداخت حقوق گمرکی دریافت کنید'] },
  { id: 'fa.noCustoms', msg: 'claims no customs clearance is needed (fa)',
    re: /(?:نیازی\sبه|بدون\sنیاز\sبه)\sترخیص|ترخیص(?:\sگمرکی)?\s(?:لازم|ضروری)\sنیست/iu,
    bad: ['نیازی به ترخیص نیست'],
    good: ['برای بسته‌های شخصی تا ۲۰۰ دلار، پرداخت گمرک لازم نیست'] },
  { id: 'fa.noDocs', msg: 'claims shipping without documents (fa)',
    re: /(?:بدون|بی)[\s\p{Cf}]?(?:مدرک|مدارک|اسناد|سند)[^.؟!?]{0,20}(?:(?<!ن)می[\s\p{Cf}]?(?:آوریم|رسانیم|فرستیم)|حمل\s?(?<!ن)می[\s\p{Cf}]?کنیم|وارد\s?(?<!ن)می[\s\p{Cf}]?کنیم)/iu,
    bad: ['بدون مدرک وارد می‌کنیم'],
    good: ['محموله بدون مدرک پذیرفته نمی‌شود'] },

  /* — unprovable claims about the company — */
  { id: 'zh.superlative', msg: 'unprovable superlative (zh)',
    re: /(?:最好|最佳|最优|顶级|最专业|最大|最便宜|最快)的?\s?(?:货运|物流|货代|运输|清关|国际货运)?\s?(?:公司|服务商|企业|品牌)|(?:货运|物流|货代)(?:行业)?(?:第一|之首|龙头|领导者|领导品牌)|排名第一|首屈一指/iu,
    bad: ['我们是最好的物流公司', '货运行业第一'],
    good: ['空运是最快的运输方式', '最适合电子配件', '我们从不说“免税”、“100%保证”或“最快”。', '全球最大的小商品批发市场', '样品是最便宜的保险'] },
  { id: 'zh.intlCompany', msg: 'unprovable "international company" (zh)',
    re: /(?:国际|跨国)(?:性)?(?:物流|货运)?(?:公司|集团|企业)/iu,
    bad: ['GSR是一家国际物流公司'],
    good: ['国际货运的基本知识', '义乌国际商贸城', '国际快递包裹'] },
  { id: 'fa.superlative', msg: 'unprovable superlative (fa)',
    re: /(?<!«)(?:بهترین|برترین|سریع[\s\p{Cf}]?ترین|ارزان[\s\p{Cf}]?ترین|بزرگ[\s\p{Cf}]?ترین|معتبرترین|شماره\s?(?:یک|1))\s(?:شرکت|کارگو|باربری|لجستیک|ارائه[\s\p{Cf}]?دهنده)/iu,
    bad: ['بهترین شرکت کارگو در تاشکند', 'معتبرترین لجستیک'],
    good: ['بهترین گزینه برای نمونه‌ها', 'ما هرگز «سریع‌ترین» نمی‌گوییم', 'حمل هوایی سریع‌ترین حمل‌ونقل است', 'بزرگ‌ترین بازار عمده‌فروشی جهان'] },
  { id: 'fa.intlCompany', msg: 'unprovable "international company" (fa)',
    re: /شرکت(?:ی)?\s?(?:بین[\s\p{Cf}]?(?:ال)?مللی|چند[\s\p{Cf}]?ملیتی)(?![\p{Cf}]?های)|(?:بین[\s\p{Cf}]?(?:ال)?مللی|چند[\s\p{Cf}]?ملیتی)\sهستیم/iu,
    bad: ['ما یک شرکت بین‌المللی هستیم'],
    good: ['شرکت‌های بین‌المللی پست', 'حمل بین‌المللی', 'اتاق بازرگانی بین‌المللی'] },
  { id: 'zh.association', msg: 'unverified association claim (zh)',
    re: /一带一路[^。！？!?；;]{0,20}(?:协会|联盟|官方代表|正式代表|会员|成员单位)|(?:协会|联盟)[^。！？!?；;]{0,10}(?:官方代表|正式代表|正式会员)/iu,
    bad: ['一带一路协会官方代表'],
    good: ['一带一路倡议下的中吉乌铁路'] },
  { id: 'fa.association', msg: 'unverified association claim (fa)',
    re: /(?:یک\sکمربند|کمربند\sو\sجاده|One Belt)[^.؟!?]{0,40}(?:انجمن|نماینده|عضو)|نماینده(?:\p{Mn}|ی)?\sرسمی[^.؟!?]{0,30}انجمن/iu,
    bad: ['نماینده رسمی انجمن یک کمربند'],
    good: ['کمربند و جاده'] },
  { id: 'zh.branches', msg: 'claims regional branches (zh)',
    re: /(?:各州|各地区|各地|全国各地|各省)(?:均|都)?(?:设有|开设|拥有|有)(?:我们的)?(?:分公司|分部|分支机构|办事处)|(?:我们|(?<![\w./@-])GSR|公司)(?:在)?[^。！？!?；;]{0,10}(?:设有|开设|拥有)[^。！？!?；;]{0,6}(?:分公司|分部|分支机构)/iu,
    bad: ['我们在各州设有分公司'],
    good: ['免费送到您所在地区的网点', '我们在塔什干设有办公室'] },
  { id: 'fa.branches', msg: 'claims regional branches (fa)',
    re: /(?:شعبه|نمایندگی)(?:[\s\p{Cf}]?(?:های|ها))?\s?(?:ما|خودمان)\s?(?:در|در\sتمام|در\sهمه(?:\p{Mn}|ی)?)\s?(?:استان|ولایت|شهر)|(?:در|در\sتمام|در\sهمه(?:\p{Mn}|ی)?)\s(?:استان|ولایت)(?:[\s\p{Cf}]?(?:های|ها))?[^.؟!?]{0,20}(?:شعبه|نمایندگی)\s?(?:داریم|دارد|دارند)/iu,
    bad: ['شعبه‌های ما در تمام ولایت‌ها'],
    good: ['تحویل رایگان تا شعبه در ولایت شما'] },

  /* — the QR system: staff scan, the client never does — */
  { id: 'zh.scan', msg: 'tells the client to scan the QR (zh) — staff scan, the client never does',
    re: /(?<![不非没无未][^。！？!?]{0,8})(?:(?:您|你)(?:需要|必须|得|要|可以|应该|应|可)?(?:自己|亲自)?|请(?:您|你)?(?:自己|亲自)?)\s?(?:扫描|扫码|扫一扫)|(?:扫描|扫码|扫一扫)(?:二维码|QR码?)?(?:即可|就能|就可以|来|以)?(?:查询|查看|跟踪|追踪)/iu,
    bad: ['您需要扫描二维码', '请扫描纸箱上的二维码', '扫码查询物流'],
    good: ['我需要自己扫描二维码吗？不需要。我们在中国收货时贴上二维码，工作人员在每个环节扫描。', '您无需扫描任何东西', '不需要您扫描', '工作人员扫描二维码，您在机器人中查看'] },
  { id: 'fa.scan', msg: 'tells the client to scan the QR (fa) — staff scan, the client never does',
    re: /(?<!(?:نیست|ندارد|نه|نیازی|لازم)[^.؟!?]{0,40})(?:اسکن\s?(?:کنید|نمایید|بکنید|می[\s\p{Cf}]?(?:کنید|نمایید))|(?:خودتان|شما\sباید|باید\sخودتان)[^.؟!?]{0,25}اسکن\s?(?:کنید|نمایید))/iu,
    bad: ['کد QR را اسکن کنید', 'شما QR را اسکن می‌کنید'],
    good: ['لازم نیست شما چیزی را اسکن کنید', 'آیا خودم باید QR را اسکن کنم؟ نه.', 'کارکنان انبار در هر مرحله QR را اسکن می‌کنند', 'لازم نیست خودتان اسکن کنید'] },

  /* — tracking is stage-by-stage QR scanning: never real-time, never GPS — */
  { id: 'zh.realTime', msg: 'says real-time (zh) — tracking is stage-by-stage QR scanning',
    re: /(?<![不非没无未][^。！？!?；;]{0,10})实时|即时(?:追踪|跟踪|定位|位置|查询|更新|监控|动态)/iu,
    bad: ['提供实时追踪', '即时追踪您的货物'],
    good: ['这不是车辆的实时位置。', '即时估价'] },
  { id: 'zh.livePos', msg: 'claims a live position (zh) — tracking is stage-by-stage QR scanning',
    re: /(?<![不非没无未][^。！？!?；;]{0,10})(?:实时|动态|即时|在线|实况)[^。！？!?；;]{0,4}(?:车辆|卡车|货车|货物)?(?:的)?(?:位置|定位|坐标|轨迹)/iu,
    bad: ['在线查看货车位置'],
    good: ['这不是车辆的实时位置', '仓库位置在义乌', '在线地图上查看仓库位置', '官方在线平台'] },
  { id: 'zh.gps', msg: 'implies live GPS position (zh) — tracking is stage-by-stage QR scanning',
    re: /(?<![不非没无未][^。！？!?；;]{0,10})(?:GPS|北斗|卫星)(?!\s?(?:追踪器|跟踪器|定位器|tracker))\s?(?:定位|追踪|跟踪|监控|实时)|(?<![不非没无未][^。！？!?；;]{0,10})(?:追踪|跟踪|定位|查询)[^。！？!?；;]{0,20}GPS(?!\s?(?:追踪器|跟踪器|定位器|tracker))/iu,
    bad: ['GPS定位追踪您的货物', '卫星定位'],
    good: ['无人机、GPS 追踪器、带 SIM 卡的智能手表', '这不是 GPS 定位'] },
  { id: 'fa.realTime', msg: 'says real-time (fa) — tracking is stage-by-stage QR scanning',
    re: /(?<!(?:نه|نیست)[^.؟!?]{0,20})(?:بلادرنگ|ریل[\s\p{Cf}]?تایم|real[\s-]?time|به[\s\p{Cf}]?صورت\s(?:زنده|لحظه[\s\p{Cf}]?ای|آنی)|لحظه[\s\p{Cf}]?به[\s\p{Cf}]?لحظه|لحظه[\s\p{Cf}]?ای(?!\p{Script=Arabic}))(?![^.؟!?]{0,30}(?:نیست|نمی[\s\p{Cf}]?(?:دهد|کند|شود|بینید)|ندارد))/iu,
    bad: ['ردیابی بلادرنگ', 'اطلاعات لحظه‌ای بار'],
    good: ['وضعیت مرحله به مرحله تغییر می‌کند', 'این ردیابی لحظه‌ای نیست'] },
  { id: 'fa.livePos', msg: 'claims a live position (fa) — tracking is stage-by-stage QR scanning',
    re: /(?:موقعیت|مکان|لوکیشن|ردیابی|رهگیری|پیگیری)(?:[\s\p{Cf}]?(?:ی|\p{Mn}))?\s(?:زنده|لحظه[\s\p{Cf}]?ای|آنی|آنلاین|بلادرنگ)(?![^.؟!?]{0,40}(?:نیست|نمی[\s\p{Cf}]?(?:دهد|کند|شود|بینید)|ندارد))/iu,
    bad: ['موقعیت زنده کامیون را ببینید', 'ردیابی لحظه‌ای محموله', 'پیگیری آنلاین بار'],
    good: ['این موقعیت زنده‌ی خودرو نیست.', 'حیوانات زنده و گیاهان', 'پلتفرم آنلاین رسمی بازار'] },
  { id: 'fa.gps', msg: 'implies live GPS position (fa) — tracking is stage-by-stage QR scanning',
    re: /(?<!(?:نه|نیست|بدون)[^.؟!?]{0,15})(?:GPS|جی[\s\p{Cf}]?پی[\s\p{Cf}]?اس|ماهواره(?:ای)?)(?![\s\p{Cf}]?(?:tracker|ترکر))[^.؟!?]{0,30}(?:ردیابی|رهگیری|پیگیری|موقعیت[\s\p{Cf}]?یابی)|(?:ردیابی|رهگیری|پیگیری)[^.؟!?]{0,30}(?:GPS|جی[\s\p{Cf}]?پی[\s\p{Cf}]?اس)/iu,
    bad: ['ردیابی با GPS', 'پیگیری با جی‌پی‌اس'],
    good: ['پهپادها، ردیاب‌های GPS، ساعت‌های هوشمند'] },

  /* — the owner-confirmed figures: 400+ clients, 50–100 containers a month (2026-11-11; no truck count any
       more), GSR 8+ years (2018), the TEAM 15 years — */
  { id: 'zh.clients', msg: 'client count other than the confirmed 400+ (zh)',
    // Like the uz/ru/en rule, a count is a claim when it carries its "+" (多, 余, 以上): "一辆装有 100 位
    // 客户货物的卡车" — a truck carrying 100 clients' goods — is arithmetic, not a client count.
    re: /(?<![\d+])(?!400(?!\d)|1688(?!\d))\d{2,5}\s?(?:\+|多|余|以上)\s?(?:位|家|名)?\s?(?:客户|顾客)|(?:客户|顾客)(?:数|数量|总数)?\s?[:：]?\s?(?!400(?!\d))\d{2,5}\s?(?:\+|多|余)|(?:上千|数千|几千|上万|数万|成千上万)(?:位|家|名)?(?:客户|顾客)/iu,
    bad: ['500多位客户', '客户 1000+', '服务过上千家客户', '已服务 600+ 位客户'],
    good: ['400+客户', '客户 400+', '已服务400多位客户', '2018年客户', '一辆装有 100 位客户货物的卡车', '04 客户经理'] },
  { id: 'zh.trucks', msg: 'truck count (zh) — the confirmed volume is 50–100 containers a month, no truck figure is published',
    // Until 2026-11-11 GSR's figure was a monthly truck count; now no truck count is GSR's. A truck count is
    // a claim when it carries the "+" or is a monthly count; "吐尔尕特口岸每天通行 300 多辆卡车" (a border
    // post's capacity) is not GSR's fleet. A count in words beside a month word (每月上百辆) is a monthly count too.
    re: /(?<![\d+])\d{1,4}\s?\+\s?(?:(?:辆|台|趟|车次)\s?)?(?:卡车|货车|大车|重卡|车(?!\p{Script=Han}))|(?:每月|每个月|月均)[^。！？!?；;]{0,8}?(?<![\d+])(?:\d{1,4}\s?(?:\+|多|余|以上)?|数十|几十|上百|数百|几百|百余|近百|逾百|过百|上千|数千|几千|千余)\s?(?:辆|趟|车次)|(?<![\d+])(?:\d{1,4}\s?(?:\+|多|余|以上)?|数十|几十|上百|数百|几百|百余|近百|逾百|过百|上千|数千|几千|千余)\s?(?:辆|趟|车次)(?:卡车|货车|重卡)?[^。！？!?；;]{0,4}?(?:每月|每个月)/iu,
    bad: ['每月20多辆卡车', '每月 20+ 辆。', '20+ 辆卡车', '每月超过 15 辆', '每月10+辆卡车', '每月有 10+ 辆卡车从中国抵达塔什干', '每月发车 10+ 辆', '10+ 辆卡车每月从中国发往塔什干', '每月 50–100 辆卡车',
      '每月上百辆卡车', '每月发车数十趟', '百余辆卡车每月从中国发往塔什干'],
    good: ['3–4天', '20 多台车床', '超过 3 台设备', '超过 20 辆汽车', '吐尔尕特口岸每天通行 300 多辆卡车', '每月 50–100 个集装箱', '一辆装有 100 位客户货物的卡车', '口岸每天通行数百辆卡车'] },
  { id: 'zh.volume', msg: 'monthly volume other than the confirmed 50–100 containers a month (zh)',
    re: ZH_VOLUME,
    bad: ['每月 40–50 个集装箱', '每月 40 至 50 个集装箱', '每月超过 100 个集装箱', '每月运送 200 个集装箱', '每月 60–120 个货柜', '100+ 个集装箱', '100 多个集装箱每月',
      '每月 50+ 个集装箱', '每月 50–100 多个集装箱', '40–50 每月发运集装箱', '上千个集装箱', '一个月内运送 200 个集装箱',
      '每月数十个集装箱', '每月百余个集装箱', '每月近百个集装箱', '每月 100 个以上的集装箱', '100 个以上集装箱', '每月发运集装箱 200 个', '每月发运集装箱上百个'],
    good: ['每月 50–100 个集装箱', '每月有 50–100 个集装箱从中国运抵塔什干，我们已服务 400+ 位客户。', '50–100 个集装箱每月从中国发往塔什干', '每月 50 至 100 个集装箱',
      '自 2018 年起开展中国业务，每月运送 50–100 个集装箱，服务客户 400+ 家。', '定期进口的批发商：每月一个集装箱，价格和时效事先明确。', '2 个集装箱已装车，约一个月抵达塔什干',
      '超过 10 m³ 的货物：20 英尺或 40 英尺集装箱（25 天，20 英尺约 2,800 美元）', '一个 40 英尺集装箱', '每月 200 美元以内的商品免征关税', '家用电器——每月 1 件',
      '每月发运集装箱 50–100 个'] },
  { id: 'zh.age', msg: 'company age other than the confirmed 8+ years (zh; GSR since 2018)',
    re: /(?<![\d+])(?!8(?!\d))\d{1,3}\s?\+\s?年|(?:(?<![\w./@-])GSR|我们|我司|本公司)(?![^。！？!?；;]{0,8}团队)[^。！？!?；;]{0,12}(?:(?<![\d+])(?!8(?!\d))\d{1,3}\s?(?:多|余)?\s?年(?:以上|多|有余)?(?:的)?(?:经验|历史|经营|运营|合作|从业)|(?:超过|逾|近)\s?(?!8(?!\d))\d{1,3}\s?年|(?:成立于|创立于|创办于|始建于)\s?(?!2018)(?:19|20)\d{2})/iu,
    bad: ['10+年', '我们有10年经验', 'GSR 成立于 2015 年', 'GSR Logistics，成立于 2015 年'],
    good: ['GSR — 自2018年起 8+年', '我们的团队拥有15年货运经验', '自2026年起，关税按新规计算', '车龄超过3年的汽车', '公司成立于2018年', '义乌国际商贸城始建于 2002 年', '供应商在平台上超过 5 年为佳'] },
  { id: 'zh.team15', msg: '15 years belongs to the team, not to GSR (zh; GSR is 8+ years, since 2018)',
    re: /(?:^|[。！？!?；;])(?![^。！？!?；;]*团队)[^。！？!?；;]*?(?<![\d+])15\s?年(?!代)/iu,
    bad: ['GSR拥有15年经验。'],
    good: ['团队拥有15年的货运经验。', '关于公司 GSR — 自2018年起 8+年 团队货运经验 15年 客户 400+'] },
  { id: 'fa.clients', msg: 'client count other than the confirmed 400+ (fa)',
    // As in zh: the count is a claim with its "+" or "بیش از" (more than) — not "the goods of 100 clients".
    re: /(?<![\d+])(?:\+\s?(?!400(?!\d))\d{2,5}|(?!400(?!\d))\d{2,5}\s?\+)\s?(?:مشتری|مشتریان)|(?:بیش\s?از|بالای|بالغ\s?بر|افزون\s?بر)\s?(?!400(?!\d))\d{2,5}\s?(?:مشتری|مشتریان)|مشتری(?:ان|\p{Cf}ها)?\s?[:：]?\s?(?:\+\s?(?!400(?!\d))\d{2,5}|(?!400(?!\d))\d{2,5}\s?\+)|(?:هزاران|صدها\sهزار)\sمشتری/iu,
    bad: ['بیش از ۵۰۰ مشتری', 'مشتریان ۱۰۰۰+', 'هزاران مشتری', '+۶۰۰ مشتری'],
    good: ['۴۰۰+ مشتری', '+۴۰۰ مشتری', 'بیش از ۴۰۰ مشتری', 'کامیونی که بار ۱۰۰ مشتری را حمل می‌کند'] },
  { id: 'fa.trucks', msg: 'truck count (fa) — the confirmed volume is 50–100 containers a month, no truck figure is published',
    // As in zh: no truck count is GSR's any more (it was a monthly figure until 2026-11-11); a border post's
    // daily capacity is not a claim. A count in words beside a month word (ماهانه صدها کامیون) is a monthly count too.
    re: /(?<![\d+])(?:\+\s?\d{1,4}|\d{1,4}\s?\+)\s?(?:کامیون|تریلی|تریلر|لاری)|(?:ماهانه|ماهیانه|در\sماه(?![\s\p{Cf}]?(?:آینده|بعد|قبل|گذشته|پیش|جاری|اخیر|نخست|اول|دیگر|های|ها))|هر\sماه)[^.؟!?]{0,15}?(?:بیش\s?از|بالای|افزون\s?بر)?\s?(?<![\d+])(?:\d{1,4}\s?|(?:ده[\s\p{Cf}]?ها|صدها|هزاران)\s)(?:کامیون|تریلی|تریلر|لاری)|(?<![\d+])(?:\d{1,4}\s?|(?:ده[\s\p{Cf}]?ها|صدها|هزاران)\s)(?:کامیون|تریلی|تریلر|لاری)(?:\p{Cf}?(?:های|ها))?[^.؟!?]{0,15}(?:ماهانه|ماهیانه|در\sماه(?![\s\p{Cf}]?(?:آینده|بعد|قبل|گذشته|پیش|جاری|اخیر|نخست|اول|دیگر|های|ها))|هر\sماه)/iu,
    bad: ['ماهانه +۲۰ کامیون', 'ماهانه بیش از ۱۵ تریلی', 'بیش از ۲۰ کامیون در ماه', 'ماهانه ۱۰+ کامیون', 'ماهانه بیش از ۱۰ کامیون', 'بیش از ۱۰ کامیون در ماه از چین به تاشکند', '۱۰+ کامیون در ماه از چین به تاشکند', '۲۰ کامیون در ماه',
      'ماهانه صدها کامیون', 'ده‌ها کامیون در ماه از چین به تاشکند'],
    good: ['بیش از ۳ موتر', 'تروگارت روزانه بیش از ۳۰۰ کامیون را رد می‌کند', 'ماهانه ۵۰ تا ۱۰۰ کانتینر', 'روزانه ۳۰۰ کامیون و هدف ۱٬۰۰۰ کامیون در روز است', 'کامیونی که بار ۱۰۰ مشتری را حمل می‌کند', '۳ کامیون در ماه آینده به تاشکند می‌رسد',
      'روزانه صدها کامیون از مرز خورگوس می‌گذرد', 'در ماه جاری ۲ کامیون از ییوو حرکت کرد'] },
  { id: 'fa.volume', msg: 'monthly volume other than the confirmed 50–100 containers a month (fa)',
    re: FA_VOLUME,
    bad: ['ماهانه ۴۰ تا ۵۰ کانتینر', 'ماهانه ۵۰ تا ۱۲۰ کانتینر', 'ماهانه بیش از ۱۰۰ کانتینر', '+۱۰۰ کانتینر', '۲۰۰ کانتینر در ماه', '۱۰۰+ کانتینر در ماه', '۴۰–۵۰ کانتینر در ماه', 'هزاران کانتینر', 'ماهانه ده‌ها کانتینر', 'ده‌ها کانتینر در ماه'],
    good: ['ماهانه ۵۰ تا ۱۰۰ کانتینر', '۵۰ تا ۱۰۰ کانتینر در ماه', '۵۰–۱۰۰ کانتینر در ماه از چین به تاشکند', 'ماهانه ۵۰ تا ۱۰۰ کانتینر از چین به تاشکند می‌رسد و تاکنون به بیش از ۴۰۰ مشتری خدمت داده‌ایم.',
      'از سال ۲۰۱۸ با چین کار می‌کنیم، ۵۰ تا ۱۰۰ کانتینر در ماه و بیش از ۴۰۰ مشتری.', 'عمده‌فروشانی که به‌طور منظم واردات دارند: ماهانه یک کانتینر، با قیمت و زمان حمل از پیش مشخص.',
      'محموله‌های بیش از ۱۰ متر مکعب: کانتینر ۲۰ یا ۴۰ فوتی', 'کانتینر ۲۰ فوتی حدود ۲٬۸۰۰ تا ۵٬۵۰۰ دلار', '۲ کانتینر در ماه آینده به تاشکند می‌رسد',
      '۲ کانتینر بارگیری شد و حدود یک ماه بعد به تاشکند می‌رسد', 'در ماه جاری ۳ کانتینر از ییوو بارگیری شد',
      '۳ کانتینر در ماه قبل به تاشکند رسید'] },
  { id: 'fa.age', msg: 'company age other than the confirmed 8+ years (fa; GSR since 2018)',
    re: /(?<![\d+])(?:\+\s?(?!8(?!\d))\d{1,3}|(?!8(?!\d))\d{1,3}\s?\+)\s?سال(?![م\p{Mn}ن])|(?:(?<![\w./@-])GSR|شرکت\sما|(?<!\p{Script=Arabic})ما(?!\p{Script=Arabic}))(?![^.؟!?]{0,20}تیم)[^.؟!?]{0,20}(?:بیش\s?از|بالای|افزون\s?بر)\s?(?!8(?!\d))\d{1,3}\s?سال|(?:تأسیس|تاسیس|آغاز\sبه\sکار)[^.؟!?]{0,20}(?!2018)(?:19|20)\d{2}/iu,
    bad: ['+۱۰ سال', 'شرکت ما بیش از ۱۰ سال سابقه دارد', 'تأسیس در ۲۰۱۵'],
    good: ['۸+ سال', 'از سال ۲۰۱۸ با چین کار می‌کنیم', 'تیم ما ۱۵ سال تجربه دارد', 'سابقهٔ فروشنده در پلتفرم بیش از ۵ سال خوب است'] },
  { id: 'fa.team15', msg: '15 years belongs to the team, not to GSR (fa; GSR is 8+ years, since 2018)',
    re: /(?:^|[.؟!?؛;])(?![^.؟!?؛;]*(?:تیم|کارکنان|همکاران))[^.؟!?؛;]*?(?<![\d+])15\s?سال/iu,
    bad: ['GSR ۱۵ سال سابقه دارد.'],
    good: ['تیم ما ۱۵ سال تجربه در حمل‌ونقل دارد.'] },

  /* — the three China receiving points are never GSR's own — */
  // "Our warehouse" is banned outright, as uz "omborimiz" and ru "наш склад" are. "GSR's warehouse"
  // only with a China place, as the uz/ru/en rule ("GSR Logistics' Yiwu warehouse"): the English
  // routes guide ends at "the GSR warehouse" — the one in Tashkent — and its translation must pass.
  { id: 'zh.ourWarehouse', msg: 'claims a China receiving point as our own (zh)',
    re: /我(?:们|司)(?:自己)?的\s?(?:义乌|广州|喀什|中国)?\s?(?:的)?\s?(?:仓库|货仓|库房|仓储中心|收货点)|我(?:们|司)(?:自己)?在\s?(?:义乌|广州|喀什|中国)\s?的\s?(?:仓库|货仓|库房|仓储中心|收货点)|我司\s?(?:义乌|广州|喀什)?\s?仓库|自有(?:的)?(?:仓库|收货点)|自营仓库|(?<![\w./@-])GSR(?:\s?Logistics)?\s?(?:自有的?|自己的)\s?(?:义乌|广州|喀什|中国)?\s?(?:的)?\s?(?:仓库|收货点)|(?<![\w./@-])GSR(?:\s?Logistics)?\s?的?\s?(?:(?:义乌|广州|喀什|中国)\s?(?:的)?\s?(?:仓库|收货点)|收货点)/iu,
    bad: ['我们的义乌仓库', '我们的仓库工作人员', 'GSR的义乌仓库', 'GSR Logistics 义乌仓库', '我们在义乌的仓库', '我们的收货点', 'GSR自己的仓库', 'GSR 的收货点'],
    // The contact page lists facebook.com/gsrlogistics right above its "中国收货点" heading: a handle
    // or URL is not the company's name.
    good: ['我们在义乌仓库为您验货', '义乌收货点', '仓库工作人员在每个环节扫描二维码', '我们在义乌的员工', '提交报关单（GTD）后运抵 GSR 仓库。', '货物运抵 GSR 的仓库', 'Facebook facebook.com/gsrlogistics 中国收货点', '频道 t.me/gsrlogistics 中国收货点',
      // The warehouse under customs control in Tashkent is a PARTNER's (owner, 2026-11-11): GSR allocates space in it.
      '在塔什干仓库为客户分配仓位', '合作方的仓库', '在合作方的监管仓库安排仓位；可车对车换装，或经仓库换装。', '仓库属于我们的合作方；货物在那里处于海关监管之下。'] },
  { id: 'fa.ourWarehouse', msg: 'claims a China receiving point as our own (fa)',
    re: /انبار(?:\p{Cf}?(?:های|ها))?(?:\p{Mn}|ی)?\s?(?:ما|خودمان|خود\sما)(?!\p{Script=Arabic})|انبار(?:\p{Cf}?(?:های|ها))?مان(?!\p{Script=Arabic})|انبار(?:\p{Mn}|ی)?\s?(?:GSR|جی[\s\p{Cf}]?اس[\s\p{Cf}]?آر)[^.؟!?،]{0,14}(?:ییوو|گوانگ[\s\p{Cf}]?(?:ژو|جو)|کاشغر|چین)|انبار(?:\p{Mn}|ی)?\s?(?:ییوو|گوانگ[\s\p{Cf}]?(?:ژو|جو)|کاشغر)(?:\p{Mn}|ی)?\s?(?:GSR|جی[\s\p{Cf}]?اس[\s\p{Cf}]?آر)|(?:محل|نقطه|نشانی|مرکز)(?:\p{Mn}|ی)?\s(?:تحویل|دریافت)(?:\sبار)?(?:\p{Mn}|ی)?\s(?:ما|خودمان|GSR|جی[\s\p{Cf}]?اس[\s\p{Cf}]?آر)(?!\p{Script=Arabic})/iu,
    bad: ['انبار ما در ییوو', 'انبارمان', 'انبار GSR در ییوو', 'انبار ییووی GSR', 'انبار GSR در چین', 'محل تحویل بار ما در ییوو', 'محل تحویل بار GSR'],
    good: ['انبار ییوو', 'نقطه دریافت ییوو', 'انبار ماشین‌آلات', 'کارکنان ما در ییوو', 'نشانی ما در تاشکند', 'بار وارد انبار نگهداری موقت می‌شود، اظهارنامهٔ گمرکی (GTD) ثبت می‌شود و کالا به انبار GSR می‌رسد.', 'انبار GSR در تاشکند',
      // As in zh: the warehouse under customs control in Tashkent is a partner's.
      'در انبار تاشکند فضا اختصاص می‌دهیم', 'انبار همکار ما', 'در انبار همکار ما جا اختصاص می‌دهیم؛ بار را از کامیون به کامیون یا از راه انبار جابه‌جا می‌کنیم.', 'انبار متعلق به همکار ماست؛ بار در آنجا تحت نظارت گمرک نگهداری می‌شود.'] },
  { id: 'zh.partners', msg: 'stale "through partners" claim for Guangzhou (zh)',
    re: /广州[^。！？!?；;]{0,40}(?:通过|经由)(?:合作伙伴|合作方)|(?:通过|经由)(?:合作伙伴|合作方)[^。！？!?；;]{0,40}广州/iu,
    bad: ['广州的货物通过合作伙伴接收'],
    good: ['广州收货点有地址'] },
  { id: 'fa.partners', msg: 'stale "through partners" claim for Guangzhou (fa)',
    re: /گوانگ[\s\p{Cf}]?(?:ژو|جو)[^.؟!?]{0,60}(?:از\sطریق|توسط)\s(?:شرکا|شرکای|همکاران)|(?:از\sطریق|توسط)\s(?:شرکا|شرکای|همکاران)[^.؟!?]{0,60}گوانگ[\s\p{Cf}]?(?:ژو|جو)/iu,
    bad: ['بار گوانگجو را از طریق شرکا دریافت می‌کنیم', 'بار گوانگژو را از طریق شرکا دریافت می‌کنیم'],
    good: ['گوانگجو یک نشانی دریافت دارد'] },

  /* — consolidated cargo: by truck only, from 1 m³; nothing smaller by truck, no single items — */
  { id: 'zh.m3', msg: 'stale truck minimum 0.1 m³ (zh) — consolidated cargo starts at 1 m³',
    re: /(?<![\d.,])0[.,]1\s?(?:立方米|立方|方|CBM|m³|m3)(?!\d)/iu,
    bad: ['最低0.1立方米'],
    good: ['拼货1立方米起'] },
  { id: 'zh.small', msg: 'offers small orders or sub-minimum truck cargo (zh) — the minimum is 1 m³',
    // "1 件起" is an offer only when it is GSR's: 1688's own filter 一件代发 ("ships from 1 piece") is
    // quoted in the 1688 guide and is not one.
    re: /(?:我们|我司|(?<![\w./@-])GSR|代购|代采购)[^。！？!?；;]{0,10}(?<![\d.,一二三四五六七八九十百千])(?:1|一)\s?件起(?:购|买|订|发|运)?|(?<![不非没无未][^。！？!?；;]{0,6})单件(?:起|也可|代购|起购|起运)|(?:不足|小于|低于|少于)\s?(?:1|一)\s?(?:立方米|立方|方|CBM|m³)(?![^。！？!?；;]{0,16}空运)[^。！？!?；;]{0,10}(?:也|亦|均)(?:可|能|收|接)|小(?:件|包裹|包)(?:也|亦)(?:可以|可|能够|能)?(?:拼|并入|加入|发)/iu,
    bad: ['我们一件起购', '代采购 1 件起', '不足1立方米也可以', '小件也可以拼', '单件代购'],
    good: ['一件代发（1 件起发）', '不足1立方米的货物请走空运', '卡车拼货1立方米起', '21 件起', '不接受单件代购', '不足 1 立方米的货物也可以走空运'] },
  { id: 'fa.m3', msg: 'stale truck minimum 0.1 m³ (fa) — consolidated cargo starts at 1 m³',
    re: /(?<![\d.,])0[.,]1\s?(?:متر[\s\p{Cf}]?مکعب|مترمکعب|m³|m3|CBM)(?!\d)/iu,
    bad: ['حداقل ۰٫۱ متر مکعب'],
    good: ['از ۱ متر مکعب'] },
  { id: 'fa.small', msg: 'offers small orders or sub-minimum truck cargo (fa) — the minimum is 1 m³',
    re: /(?:(?<!\p{Script=Arabic})از\s(?:یک|1)\s(?:عدد|قلم|دانه|تکه)(?!\p{Script=Arabic})[^.؟!?]{0,20}(?<!ن)می[\s\p{Cf}]?(?:خریم|پذیریم|گیریم|فرستیم)|(?:خرید\s(?:تکی|تک[\s\p{Cf}]?عددی|یک[\s\p{Cf}]?عددی)|بسته(?:\p{Cf}?های|\p{Cf}?ها)?\s(?:کوچک|خرد)\s(?:را\s)?(?:هم|نیز))(?![^.؟!?]{0,30}(?:نمی[\s\p{Cf}]|نه\s|ندار|نیست|ممنوع)))|(?:کمتر|کوچک[\s\p{Cf}]?تر)\sاز\s(?:یک|1)\sمتر[\s\p{Cf}]?مکعب(?![^.؟!?]{0,40}هوایی)[^.؟!?]{0,20}(?:هم|نیز)\s(?:می[\s\p{Cf}]?پذیریم|قبول\sمی[\s\p{Cf}]?کنیم|حمل\sمی[\s\p{Cf}]?کنیم)/iu,
    bad: ['از یک عدد می‌خریم', 'کمتر از ۱ متر مکعب هم می‌پذیریم', 'خرید تکی انجام می‌دهیم'],
    good: ['از ۱ متر مکعب', 'خرید تکی انجام نمی‌دهیم', 'بار کمتر از ۱ متر مکعب را فقط هوایی می‌فرستیم', '一件代发 (ارسال از ۱ عدد)', 'حداقل سفارش ۱ عدد'] },

  /* — rail takes whole containers only: no consolidated (LCL) cargo by rail — */
  { id: 'zh.fclOrLcl', msg: 'offers a choice of FCL or LCL (zh) — rail takes whole containers only',
    re: /FCL\s?(?:或|或者|还是)\s?LCL|LCL\s?(?:或|或者|还是)\s?FCL|整柜\s?(?:或|或者|还是)\s?拼(?:柜|箱)|拼(?:柜|箱)\s?(?:或|或者|还是)\s?整柜/iu,
    bad: ['FCL或LCL', '整柜还是拼箱'],
    good: ['什么是FCL和LCL？'] },
  { id: 'zh.railLcl', msg: 'offers consolidated (LCL) cargo or shared container space by rail (zh) — rail takes whole containers only',
    re: /(?<![不非没无未][^。！？!?；;]{0,6})(?:铁路|班列|火车)(?![^。！？!?；;]{0,12}(?:不|没有|无|只|仅|唯))[^。！？!?；;]{0,12}(?:拼箱|拼柜|拼货|LCL|散货|零担)|集装箱(?:中|里|内)?的?\s?(?:舱位|位置|空间|一部分|部分空间)|(?:共享|合用|共用)(?:一个)?(?:集装箱|货柜)/iu,
    bad: ['铁路也可以拼箱', '集装箱里的舱位', '与其他客户共用一个集装箱'],
    good: ['铁路只运整柜，不做拼箱', 'LCL（拼货）：多个客户的货物共用一辆卡车', '我们不做铁路拼货。', '铁路没有拼货服务'] },
  { id: 'zh.truckOrContainer', msg: 'puts consolidated cargo "in a truck or container" (zh) — consolidated cargo is truck only',
    re: /(?:卡车|货车|汽运|公路运输)\s?(?:或|或者|还是)\s?(?:集装箱|货柜)/iu,
    bad: ['卡车或集装箱'],
    good: ['卡车拼货'] },
  { id: 'fa.fclOrLcl', msg: 'offers a choice of FCL or LCL (fa) — rail takes whole containers only',
    re: /FCL\s(?:یا|و\sیا)\sLCL|LCL\s(?:یا|و\sیا)\sFCL|کانتینر\s(?:کامل|دربست)\s(?:یا|و\sیا)\s(?:بخشی|قسمتی|جا|فضا|نیمه|اشتراکی)/iu,
    bad: ['FCL یا LCL'],
    good: ['FCL و LCL چیست؟'] },
  { id: 'fa.railLcl', msg: 'offers consolidated (LCL) cargo or shared container space by rail (fa) — rail takes whole containers only',
    re: /(?:ریل(?:ی)?|راه[\s\p{Cf}]?آهن|قطار)(?![^.؟!?]{0,25}(?:فقط|تنها|نمی|(?<!\p{Script=Arabic})نه(?!\p{Script=Arabic})|ندارد|نداریم))[^.؟!?]{0,25}(?:LCL|خرده[\s\p{Cf}]?بار|بار\s(?:تجمیعی|اشتراکی|مجموعی)|گروپاژ)|(?:جا|فضا|بخشی|قسمتی)\s(?:از|در)\s(?:یک\s)?کانتینر|کانتینر(?:\p{Cf}?های)?\s(?:مشترک|اشتراکی)/iu,
    bad: ['در حمل ریلی هم بار تجمیعی می‌پذیریم', 'جا در یک کانتینر'],
    good: ['حمل ریلی فقط با کانتینر کامل است؛ در ریل بار تجمیعی نداریم', 'فقط هزینهٔ فضای خود را می‌پردازید، نه کل کانتینر'] },
  { id: 'fa.truckOrContainer', msg: 'puts consolidated cargo "in a truck or container" (fa) — consolidated cargo is truck only',
    re: /(?:کامیون|تریلی|لاری)\s(?:یا|و\sیا)\sکانتینر|کانتینر\s(?:یا|و\sیا)\s(?:کامیون|تریلی|لاری)/iu,
    bad: ['کامیون یا کانتینر'],
    good: ['کامیون و قطار'] },

  /* — no promise about how fast a reply arrives — */
  { id: 'zh.reply', msg: 'promises a reply speed (zh)',
    re: /(?:马上|立即|立刻|即时|秒|迅速|及时|第一时间|\d+\s?分钟(?:内|之内)?|几分钟(?:内)?)\s?(?:回复|答复|回应|回覆|响应)|最快(?:的)?(?:回复|答复|联系方式)|回复最快/iu,
    bad: ['我们马上回复', '5分钟内回复'],
    good: ['我们在工作时间内回复', '个人数据请求我们会在10个工作日内回复'] },
  { id: 'fa.reply', msg: 'promises a reply speed (fa)',
    re: /(?:فوری|فورا\p{Mn}|فورا|بلافاصله|سریعا\p{Mn}|سریعا|در\sاسرع\sوقت|در\s(?:کمتر\sاز\s)?\d+\sدقیقه|ظرف\s(?:چند|\d+)\sدقیقه)[^.؟!?]{0,15}(?:پاسخ|جواب)|(?:پاسخ|جواب)(?:[\s\p{Cf}]?(?:گویی|دهی))?[^.؟!?]{0,10}(?:فوری|سریع|بلافاصله|آنی)|سریع[\s\p{Cf}]?ترین\s(?:پاسخ|جواب|راه\s(?:تماس|ارتباط))/iu,
    bad: ['فوراً پاسخ می‌دهیم', 'سریع‌ترین راه تماس'],
    good: ['در ساعات کاری پاسخ می‌دهیم', 'ظرف ۱۰ روز کاری پاسخ می‌دهیم'] },

  /* — what the Chinese site invites a reader to assume, and nothing confirms — */
  { id: 'zh.wechat', msg: 'offers a WeChat/QQ contact (zh) — GSR has no such account; the channels are Telegram, WhatsApp, phone and e-mail',
    re: /(?:添加|加)(?:我们的?)?\s?(?:微信|WeChat|QQ)|(?:微信|WeChat|QQ)\s?(?:号|联系|咨询|客服|二维码)|联系(?:我们)?(?:的)?(?:方式)?\s?[：:]?\s?(?:微信|WeChat|QQ)(?!支付|Pay)/iu,
    bad: ['添加我们的微信', '请通过微信联系我们', '联系我们：微信'],
    good: ['绝不要付款到个人微信或银行卡', '通过支付宝或微信支付向卖家付款'] },

  /* — who answers in Persian: nobody at GSR speaks it; a translator helps (owner, 2026-11-11). The first good
       sentence of each rule is the one the site prints — it must always pass — */
  { id: 'uz.persianStaff', msg: STAFF_MSG('uz'),
    re: new RegExp(`${UZ_STAFF}|${UZC_STAFF}`, 'iu'),
    bad: ['Menejerlar oʻzbek, rus, xitoy va fors tillarida gaplashadi', 'Menejerlarimiz forscha javob beradi', 'Xodimlarimiz dari tilida gaplashadi', 'Fors tilida ham gaplashamiz', 'Forscha javob beramiz',
      'Менежерлар ўзбек, рус, хитой ва форс тилларида гаплашади', 'Менежерларимиз форсча жавоб беради', 'Форсча жавоб берамиз',
      'Fors tilini biladigan menejerimiz bor', 'Forscha gapiradigan xodimlarimiz bor', 'Forsiy tilda ham gaplashamiz', 'Fors tilida maslahat beramiz', 'Fors tilida qoʻllab-quvvatlash', 'Fors tilini bilamiz',
      'Rus, ingliz va fors tillarida javob beramiz', 'Fors tilida gaplashamiz va maslahat beramiz', 'Форс тилини биладиган менежеримиз бор', 'Форс тилида қўллаб-қувватлаш'],
    good: ['Fors yoki dari tilida yozsangiz, tarjimon yordamida forscha javob beramiz', 'Fors yoki dari tilida yozsam boʻladimi va qayerga yozaman?', 'Menejerlar oʻzbek, rus va xitoy tillarida gaplashadi', 'Menejerlar fors tilida gaplashmaydi',
      'Menejerlar oʻzbek va rus tillarida gaplashadi; sayt fors tilida ham bor.', 'Sayt fors tilida ham bor', 'Ingliz, rus va oʻzbek tillarida ham javob beramiz', 'Fors-major holatlari shartnomada yozilgan',
      'Форс ёки дари тилида ёзсангиз, таржимон ёрдамида форсча жавоб берамиз', 'Менежерлар ўзбек, рус ва хитой тилларида гаплашади', 'Менежерлар форс тилида гаплашмайди',
      'Fors tilida gaplashmaymiz', 'Forscha javob bermaymiz', 'Menejerlar fors va dari tillarini bilmaydi', 'Fors tilida qoʻllab-quvvatlash yoʻq', 'Fors tilini biladigan xodimimiz yoʻq', 'Fors tilida gaplashasizmi?',
      'Fors koʻrfazi portlari orqali yuk tashimaymiz', 'Mijozlar fors tilida yozishi mumkin', 'Форс тилини биладиган ходимимиз йўқ'] },
  { id: 'ru.persianStaff', msg: STAFF_MSG('ru'),
    re: new RegExp(RU_STAFF, 'iu'),
    bad: ['Менеджеры говорят на узбекском, русском, китайском и фарси', 'поддержка на персидском', 'Наши сотрудники владеют дари', 'Отвечаем на фарси', 'Говорим на персидском и дари',
      'Фарсиязычные менеджеры', 'Говорим по-персидски', 'Менеджер со знанием фарси', 'Отвечаем на языке дари', 'Консультируем на фарси', 'Наши менеджеры знают узбекский, русский и дари', 'Отвечаем на русском, узбекском и фарси'],
    good: ['Если напишете на фарси или дари, ответим на фарси с помощью переводчика', 'Можно ли писать на фарси или дари и куда писать?', 'Менеджеры говорят на узбекском, русском и китайском', 'Менеджеры не говорят на фарси',
      'Менеджеры говорят на узбекском и русском; сайт есть и на фарси.', 'Сайт доступен на фарси', 'Отвечаем также на английском, русском и узбекском', 'Форс-мажор оговаривается в договоре', 'Мы подарим вам образец',
      'На фарси не говорим', 'Менеджеры не знают фарси и дари', 'Поддержки на фарси нет', 'Консультации на фарси не проводим', 'Менеджеров со знанием фарси нет', 'Фарсиязычных менеджеров у нас нет',
      'Говорите ли вы на фарси?', 'через порты Персидского залива', 'Клиенты могут писать на фарси', 'Менеджеры знают рынок и требования таможни'] },
  { id: 'en.persianStaff', msg: STAFF_MSG('en'),
    re: new RegExp(EN_STAFF, 'iu'),
    bad: ['Our managers speak Uzbek, Russian, Chinese and Persian', 'Farsi-speaking staff', 'support in Dari', 'We answer in Persian', 'Our team replies in Dari and Persian', 'Our managers also answer in Dari',
      'Farsi support', 'Customer service in Persian', 'We have native Persian speakers on our team', 'Persian-language support', 'Our managers know Dari', 'We understand Farsi', 'Persian-speaking consultants',
      'We answer in English, Russian and Persian'],
    good: ['Write to us in Persian or Dari — we answer in Persian with the help of a translator', 'Write to us in Persian or Dari — we answer in Persian with the help of a translator; we also answer in English, Russian and Uzbek.',
      'Can I write in Persian or Dari, and where?', 'managers who speak Uzbek, Russian and Chinese', 'Our managers do not speak Persian', 'Managers speak Uzbek and Russian; the site is also in Persian.',
      'The team answers in English, Russian and Uzbek; Persian messages go through a translator', 'The site is also published in Persian under /fa/', 'Chinese (Simplified, /zh/) and Persian (/fa/)',
      'We also answer in English, Russian and Uzbek', 'for Persian-speaking readers in Afghanistan',
      'We do not speak Persian', 'There is no support in Persian', 'We have no Persian-speaking staff', 'Nobody on our team speaks Persian or Dari', 'No Farsi support is offered', 'We cannot offer customer service in Persian',
      'There are no Persian speakers on our team', 'Do you speak Persian?', 'Is there support in Dari?', 'Persian Gulf ports', 'Customers can write to us in Persian'] },
  { id: 'zh.persianStaff', msg: STAFF_MSG('zh'),
    re: new RegExp(ZH_STAFF, 'iu'),
    bad: ['客户经理会说乌兹别克语、俄语、中文和波斯语', '波斯语客服', '我们用波斯语回复', '我们的团队通晓达里语', '会波斯语的客户经理', '我们用中文、俄语和波斯语回复', '我们提供波斯语服务', '支持波斯语沟通',
      '客户经理懂乌兹别克语、俄语和达里语'],
    good: ['您可以用波斯语或达里语来信，我们会借助翻译用波斯语回复', '可以用波斯语、达里语留言吗？发到哪里？', '客户经理可用乌兹别克语、俄语和中文沟通', '客户经理不会说波斯语', '客户经理说乌兹别克语和俄语；本网站也有波斯语版本。', '本网站也有波斯语版本', '我们也用英语、俄语和乌兹别克语回复',
      '我们没有波斯语客服', '我们不提供波斯语服务', '没有会波斯语的客户经理', '我们不用波斯语回复', '团队里没有人会说达里语', '你们会说波斯语吗？', '波斯湾港口', '客户可以用波斯语来信'] },
  { id: 'fa.persianStaff', msg: STAFF_MSG('fa'),
    re: new RegExp(FA_STAFF, 'iu'),
    bad: ['مدیران ما به فارسی پاسخ می‌دهند', 'مدیران ما فارسی صحبت می‌کنند', 'پشتیبانی به زبان فارسی', 'کارمند فارسی‌زبان داریم', 'کارشناس دری‌زبان', 'کارشناس ما فارسی صحبت می‌کند', 'کارشناسان ما دری می‌دانند', 'به فارسی پاسخ می‌دهیم', 'فارسی هم صحبت می‌کنیم',
      'کارمندان ما به فارسی مسلط هستند', 'کارمندان مسلط به فارسی', 'پارسی صحبت می‌کنیم', 'مشاوره به زبان فارسی', 'خدمات به زبان فارسی', 'پاسخگویی به زبان دری', 'به انگلیسی، روسی و فارسی پاسخ می‌دهیم'],
    good: ['اگر به فارسی یا دری بنویسید، با کمک مترجم به فارسی پاسخ می‌دهیم', 'آیا می‌توانم به فارسی یا دری بنویسم، و کجا؟', 'کارشناسان ما به ازبکی، روسی و چینی پاسخ می‌دهند', 'کارشناسان ما فارسی نمی‌دانند', 'کارمند فارسی‌زبان نداریم',
      'این صفحه به فارسی نوشته شده است', 'کارشناسان ما با کمک مترجم به فارسی پاسخ می‌دهند', 'کارشناسان ما پیام‌های فارسی را با کمک مترجم پاسخ می‌دهند', 'برای مشتریان فارسی‌زبان در افغانستان',
      'پشتیبانی به زبان فارسی نداریم', 'به زبان فارسی پاسخ نمی‌دهیم', 'کارشناسان ما به فارسی پاسخ نمی‌دهند', 'کارشناسان ما فارسی صحبت نمی‌کنند', 'کارمند مسلط به فارسی نداریم', 'همکاران ما به دری مسلط نیستند',
      'آیا کارشناس فارسی‌زبان دارید؟', 'آیا به فارسی پاسخ می‌دهید؟', 'پشتیبانی دریافت بار در چین', 'پشتیبانی دریایی', 'بنادر خلیج فارس', 'مشتریان می‌توانند به فارسی بنویسند'] },

  /* — where GSR delivers: Uzbekistan, and Hairatan and Mazar-i-Sharif in Afghanistan. Not Iran, not Kabul, Herat
       or Kandahar, not any other country — */
  { id: 'uz.destination', msg: DEST_MSG('uz'),
    re: new RegExp(`${UZ_DEST}|${UZC_DEST}`, 'iu'),
    bad: ['Eronga ham fura bilan yuk tashiymiz', 'Eron va Afgʻonistonga yuk tashiymiz', 'Eron, Afgʻonistonga yuk tashiymiz', 'Afgʻoniston va Eronga yuk tashishni boshladik', 'Eronga yuk tashish: Xitoydan va Oʻzbekistondan, fura bilan',
      'GSR Logistics kompaniyasi endi Eronga ham fura bilan yuk tashiydi', 'Yukni Eron chegarasigacha yoki Tehrongacha yetkazamiz', 'Tehron va Mashhadga yetkazib beramiz', 'Yukni Tehron shahriga yetkazamiz', 'Xitoydan Eronga va Oʻzbekistondan Eronga', 'Eronga ikki yoʻnalish', 'Xitoy → Eron',
      'Eronga ketayotgan yukni ham shu yerda qayta yuklash mumkin', 'Eronga ham, Afgʻonistonga ham yuk tashiymiz', 'Eron va boshqa mamlakatlarga yuk joʻnatamiz', 'Yangi yoʻnalish: Eronga fura bilan yuk, Oʻzbekiston orqali tranzit hujjatlari',
      'Kobulgacha olib boramiz', 'Hirot va Qandahorga ham yetkazamiz', 'Qozogistonga ham yetkazamiz', 'Eronga qisqa muddatda yetkazamiz', 'Eronga 20 tonna yuk tashiymiz', 'Tegeranga yuk tashimalari',
      'Qozogʻistonga ham yetkazamiz', 'Rossiyaga yuk tashiymiz', 'Qirgʻizistonga yuk joʻnatamiz', 'Pokistonga yuk tashish', 'Iroqqa yuk yuboramiz', 'Yevropa Ittifoqiga eksport qilamiz',
      'Эронга ҳам фура билан юк ташиймиз', 'Эрон ва Афғонистонга юк ташиймиз', 'Теҳрон шаҳрига етказамиз', 'Хитойдан Эронга', 'Хитой → Эрон', 'Қозоғистонга ҳам етказамиз', 'Россияга юк ташиймиз', 'Кобулгача олиб борамиз', 'Машҳад, Ҳирот ва Қандаҳорга етказамиз', 'Юкни Теҳрон ёки Машҳадгача етказамиз',
      'Eron yoʻnalishida yuk tashiymiz', 'Eron yoʻnalishi boʻyicha yuk tashish', 'Эрон йўналишида юк ташиймиз',
      'Hayraton · Mozori Sharif · Kobul', 'Ikki nuqtadan birigacha: Tehrongacha yoki Mashhadgacha.', 'Mashhad — yukni shahargacha yetkazamiz.', 'Yangi yoʻnalish: Eron, tranzit va ombor', 'Eron', 'Qozogʻiston',
      'Теҳрон · Машҳад', 'Янги йўналиш: Эрон, транзит ва омбор'],
    good: ['Endi Afgʻonistonga ham fura bilan yuk tashiymiz', 'Afgʻonistonga yuk tashish: Xitoydan va Oʻzbekistondan, fura bilan', 'Yukni Hayraton chegara postigacha yoki Mozori Sharifgacha yetkazamiz', 'Xitoy → Afgʻoniston',
      'tovarni topamiz, sotib olamiz va fura bilan Hayraton yoki Mozori Sharifgacha yetkazamiz', 'Afgonistonga ham fura bilan yuk tashiymiz', 'Termizgacha, soʻng Hayratonga yetkazamiz',
      'Xorgos va Qozogʻiston orqali Toshkentga yoʻl', 'Qozogʻiston boʻylab 1 000 km', 'chegara stansiyalari → Qozogʻiston temir yoʻli → Saryagash → Toshkent', 'Hozir barcha temir yoʻl yuklari Qozogʻiston orqali keladi',
      'Yuk Xitoydan Qozogʻistonga oʻtadi, soʻng Toshkentga keladi', 'Yuk Qozogʻistonga kirgach, Toshkentga yetkaziladi', 'Qozogʻistonga kirayotgan yuk Nur Joʻli postida tekshiriladi', 'Xorgos: Xitoy → Qozogʻiston',
      'Eronga yuk tashimaymiz', 'Eronga yuk tashish xizmatimiz yoʻq', 'Qozogʻistonga yetkazmaymiz', 'Qozogʻistonga yetkazib bermaymiz', 'Rossiyaga yuk tashimaymiz', 'Qozogʻistonga ham yetkazasizmi?', 'Eronga yuk tashiysizmi?',
      'Энди Афғонистонга ҳам фура билан юк ташиймиз', 'Юкни Ҳайратон чегара постигача ёки Мозори Шарифгача етказамиз', 'Қозоғистонга етказмаймиз', 'Эронга юк ташимаймиз', 'Хоргос ва Қозоғистон орқали Тошкентга йўл',
      'Eron yoʻnalishi yoʻq', 'Eron yoʻnalishida ishlamaymiz', 'Afgʻoniston yoʻnalishi', 'Yangi yoʻnalish: Afgʻoniston, tranzit va ombor', 'Qirgʻiziston yoʻnalishi orqali ham yuk keladi',
      'Kobul, Hirot va Qandahorga yetkazmaymiz', 'Tehron va Mashhad shaharlariga yetkazmaymiz', 'Теҳрон ва Кандагарга етказмаймиз', 'Kobulgacha yetkazasizmi?', 'Hayraton · Mozori Sharif', 'Afgʻoniston', 'Oʻzbekiston', 'Qabul punkti — Ivu', 'Ҳайратон · Мозори Шариф'] },
  { id: 'ru.destination', msg: DEST_MSG('ru'),
    re: new RegExp(RU_DEST, 'iu'),
    bad: ['Теперь возим грузы фурами и в Иран', 'GSR Logistics теперь возит грузы фурами и в Иран', 'Возим грузы в Иран и Афганистан', 'возим грузы в Афганистан и Иран', 'возим грузы в Афганистан, Иран и Пакистан', 'Грузы в Иран: из Китая и из Узбекистана, фурой', 'Доставка грузов в Иран фурой из Китая и Узбекистана',
      'груз доставляется до границы или до Тегерана', 'В обоих случаях груз доставляется до пограничного перехода Хайратон или до Мешхеда', 'доставляем до Хайратона, Мазари-Шарифа и Мешхеда', 'куда его везти — в Тегеран или в Мешхед', 'мы довозим его до Тегерана', 'из Китая в Иран и из Узбекистана в Иран',
      'Два направления в Иран', 'Китай → Иран', 'В Иран возим фурами', 'У меня вопрос по перевозке груза в Иран',
      'Доставляем в Казахстан', 'возим грузы в Россию', 'Доставка до России', 'Китай → Россия', 'доставка в Кыргызстан', 'перевозка до Кабула', 'карго в Пакистан', 'отправим груз в Турцию', 'грузоперевозки в Европу', 'везём груз в Дубай', 'Доставляем в Герат и Кандагар', 'довозим груз до Кандагара', 'Доставка до Герата', 'Автоперевозки в Иран', 'Работаем по направлению Иран', 'Направление: Иран', 'направление Китай — Иран',
      'Хайратон · Мазари-Шариф · Кабул', 'В одну из двух точек: в Тегеран или в Мешхед.', 'Мешхед — довозим груз до города.', 'Новое направление: Иран, транзит и склад', 'Груз, который идёт в Иран, тоже можно перегрузить здесь.',
      'Иран', 'Казахстан'],
    good: ['Да, теперь возим грузы фурами и в Афганистан — до пограничного перехода Хайратон или до Мазари-Шарифа', 'Грузы в Афганистан: из Китая и из Узбекистана, фурой', 'доставляем фурой до Хайратона или Мазари-Шарифа', 'доставляем в Хайратон и в Мазари-Шариф', 'Китай → Афганистан',
      'путь через Хоргос и Казахстан в Ташкент', 'транзит по Казахстану', 'Доставка в Ташкент, Казахстан мы проезжаем транзитом', 'Груз из Китая идёт через Узбекистан транзитом', 'Груз идёт транзитом через Казахстан и Кыргызстан в Ташкент',
      'Доставляем из Китая в Ташкент через Казахстан', 'Груз въезжает из Китая в Казахстан через Хоргос', 'Груз следует до границы Казахстана', 'Хоргос: Китай → Казахстан',
      'Правила перевозки в России и Турции другие', 'Грузы в Киргизии перегружают в Оше',
      'не доставляем в Казахстан', 'В Иран грузы не возим', 'Доставки в Иран нет', 'Мы не возим грузы в Иран', 'Есть ли доставка в Россию?', 'Возите ли вы грузы в Иран?', 'Направления Иран у нас нет', 'Нет доставки в Иран', 'Направление: Афганистан', 'Новое направление: Афганистан, транзит и склад',
      'В Кабул, Герат и Кандагар не возим', 'Другие города Афганистана — Кабул, Герат, Кандагар — не обслуживаем', 'Возите ли вы до Кабула?', 'Хайратон · Мазари-Шариф', 'Афганистан', 'Узбекистан',
      'Груз идёт в Казахстан, затем в Ташкент'] },
  { id: 'en.destination', msg: DEST_MSG('en'),
    re: new RegExp(EN_DEST, 'iu'),
    bad: ['We now also carry cargo to Iran by truck', 'GSR Logistics now also carries cargo to Iran by truck', 'We deliver to Iran and Afghanistan', 'We carry cargo to Afghanistan and Iran', 'We carry cargo to Afghanistan, Iran and Pakistan', 'Cargo is delivered to Mashhad',
      'Cargo to Iran: from China and from Uzbekistan, by truck', 'Truck cargo to Iran from China and from Uzbekistan', 'We deliver to the Hairatan border crossing, to Mazar-i-Sharif or to Tehran', 'we find the goods, buy them and deliver them by truck to Hairatan or Mashhad',
      'Two: from China to Iran and from Uzbekistan to Iran', 'Two directions to Iran', 'China → Iran', 'cargo going to Iran can be reloaded here', 'Cargo bound for Iran can be reloaded here as well', 'the new truck service to Iran', 'I have a question about cargo to Iran',
      'We also deliver to Kazakhstan', 'cargo to Russia', 'freight from China to Kyrgyzstan', 'We ship to Kabul', 'trucking to Kandahar', 'We deliver to Teheran and to the UAE', 'delivery to Herat', 'shipments to the UAE', 'Iran-bound cargo is accepted', 'Our Iran route', 'We serve Iran', 'serving Afghanistan and Iran',
      'Hairatan · Mazar-i-Sharif · Kabul', 'To one of two points: Tehran or Mashhad.', 'Mashhad — we deliver the cargo to the city.', 'A new direction: Iran, transit and warehouse', 'Iran', 'Kazakhstan'],
    good: ['We now also carry cargo to Afghanistan by truck — to the Hairatan border crossing or to Mazar-i-Sharif', 'Cargo to Afghanistan: from China and from Uzbekistan, by truck', 'we deliver them by truck to Hairatan or Mazar-i-Sharif', 'We deliver to Hairatan and to Mazar-i-Sharif', 'China → Afghanistan',
      'the road via Khorgos and Kazakhstan to Tashkent', 'cargo reaches the Kazakhstan border', 'freight goes via Khorgos to Kazakhstan and on to Tashkent', 'a transit declaration on the Kazakh side', 'Delivery by truck from China through Kazakhstan to Tashkent',
      'Khorgos (Kazakhstan border) → Almaty → Shymkent → Yallama crossing → Tashkent', 'The truck crosses from China to Kazakhstan at Khorgos', 'Cargo crosses into Kazakhstan at Khorgos', 'Khorgos: China → Kazakhstan',
      'We deliver to Tashkent, Kazakhstan is only crossed in transit', 'Factories that export to Europe usually keep better records', 'One Persian text for readers in Iran and Afghanistan',
      'We do not deliver to Kazakhstan', 'We do not carry cargo to Iran', 'There is no cargo service to Iran', 'Do you ship to Russia?', 'Do you carry cargo to Iran?',
      'Cargo to Iran is not accepted', 'We have no Iran route', 'Our Afghanistan route', 'A new direction: Afghanistan, transit and warehouse', 'We serve Afghanistan',
      'We do not deliver to Kabul, Herat or Kandahar', 'We do not deliver to Tehran or Mashhad', 'Other Afghan cities — Kabul, Herat, Kandahar — are not served', 'Do you deliver to Kabul?', 'Hairatan · Mazar-i-Sharif', 'Afghanistan', 'Uzbekistan', 'China'] },
  { id: 'zh.destination', msg: DEST_MSG('zh'),
    re: new RegExp(ZH_DEST, 'iu'),
    bad: ['现在也承接发往伊朗的汽运货物', '我们也可以运往伊朗', '直达伊朗', '货物送至海拉顿、马扎里沙里夫和德黑兰', '两个方向的货物均送至德黑兰口岸或马什哈德', '发往阿富汗和伊朗', '我们承接发往阿富汗、伊朗的货物', '伊朗货运：从中国和乌兹别克斯坦汽运发货', '伊朗专线', '中国至伊朗汽运', '两个方向：中国至伊朗，以及乌兹别克斯坦至伊朗', '中国 → 伊朗',
      '我们也可以运往哈萨克斯坦', '直达俄罗斯', '我们也可以运往喀布尔', '直达德黑兰', '货物可发往巴基斯坦', '运往土耳其', '哈萨克斯坦专线', '俄罗斯货运专线', '货物运抵俄罗斯', '我们也可以运往坎大哈', '中国至哈萨克斯坦货运', '到俄罗斯的拼货', '运往马什哈德', '送至赫拉特', '伊朗物流专线', '提供伊朗运输服务', '我们发货到伊朗', '送货到土库曼斯坦', '伊朗方向的货物', '可发伊朗',
      '海拉顿 · 马扎里沙里夫 · 喀布尔', '送到以下两个地点之一：德黑兰或马什哈德。', '新方向：伊朗、过境与仓储', '伊朗', '哈萨克斯坦'],
    good: ['现在也承接发往阿富汗的汽运货物', '我们也可以运往阿富汗', '货物送至海拉顿口岸或马扎里沙里夫', '阿富汗货运：从中国和乌兹别克斯坦汽运发货', '中国至阿富汗汽运', '中国 → 阿富汗', '从乌兹别克斯坦发往阿富汗',
      '经哈萨克斯坦运到塔什干', '从义乌经霍尔果斯直达塔什干', '货物运到哈萨克斯坦边境', '经哈萨克斯坦过境', '货物运抵哈萨克斯坦一侧的努尔饶勒口岸', '到哈萨克斯坦边境的运输', '边境站 → 哈萨克斯坦铁路 → 萨雷阿加什 → 塔什干', '客户经理会建议改走多斯特克或吉尔吉斯斯坦线路',
      '霍尔果斯：中国 → 哈萨克斯坦', '车辆从中国到哈萨克斯坦后办理过境手续', '该工厂的产品出口到欧洲和俄罗斯',
      '我们不运往哈萨克斯坦', '我们不承接发往伊朗的货物', '目前没有发往巴基斯坦的线路', '你们运往俄罗斯吗？', '有到俄罗斯的货运吗？', '你们承运发往伊朗的货物吗？', '没有伊朗方向的线路', '阿富汗方向', '新方向：汽运货物发往阿富汗', '我们不发货到伊朗',
      '我们不送喀布尔、赫拉特和坎大哈', '喀布尔、赫拉特和坎大哈暂不送达', '可以送到喀布尔吗？', '海拉顿 · 马扎里沙里夫', '阿富汗', '乌兹别克斯坦'] },
  { id: 'fa.destination', msg: DEST_MSG('fa'),
    re: new RegExp(FA_DEST, 'iu'),
    bad: ['اکنون با کامیون به ایران هم بار می‌بریم', 'GSR با کامیون به ایران هم بار می‌برد', 'به افغانستان و ایران بار می‌بریم', 'بار را به افغانستان، ایران و پاکستان می‌بریم', 'حمل بار به ایران', 'حمل بار با کامیون به ایران از چین و از ازبکستان', 'بار را تا حیرتان، مزار شریف یا تهران می‌رسانیم', 'تا مشهد می‌رسانیم',
      'کالا را می‌خریم و تا تهران می‌رسانیم', 'در دو مسیر: از چین به ایران و از ازبکستان به ایران', 'چین ← ایران', 'بار تا تهران رسانده می‌شود', 'ترانزیت به ایران از راه ترکمنستان', 'باری که مقصدش ایران است نیز می‌تواند همین‌جا جابه‌جا شود',
      'بار را به قزاقستان هم می‌رسانیم', 'به روسیه ارسال می‌کنیم', 'بار را به کابل هم می‌رسانیم', 'تا هرات حمل می‌کنیم', 'حمل بار به قزاقستان', 'ارسال کالا از چین به پاکستان', 'ترانزیت به ترکمنستان', 'به تاجکستان حمل می‌کنیم', 'کارگو به روسیه', 'بار را به ترکیه ترانزیت می‌کنیم', 'تا کندهار می‌رسانیم', 'باربری به ایران', 'ترابری به ایران', 'حمل و نقل به ترکمنستان', 'مسیر ایران', 'انتقال بار به ایران',
      'حیرتان • مزار شریف • هرات', 'تا یکی از این دو نقطه: تهران یا مشهد.', 'مشهد — بار را تا خود شهر می‌رسانیم.', 'مسیر تازه: ایران، ترانزیت و انبار', 'دو مسیر به ایران', 'ایران', 'قزاقستان'],
    good: ['اکنون با کامیون به افغانستان هم بار می‌بریم', 'شرکت لجستیک GSR Logistics در تاشکند اکنون با کامیون به افغانستان هم بار می‌برد', 'حمل بار به افغانستان', 'حمل بار با کامیون به افغانستان از چین و از ازبکستان', 'تا مزار شریف می‌رسانیم', 'تا حیرتان و مزار شریف می‌رسانیم', 'بار را تا خود شهر می‌رسانیم', 'چین ← افغانستان', 'حمل بار از ازبکستان به افغانستان',
      'از طریق قزاقستان به تاشکند می‌رسد', 'با راه‌آهن قزاقستان به تاشکند می‌آوریم', 'تا مرز ترکمنستان می‌رسانیم', 'ترانزیت قزاقستان ۱ تا ۳ روز طول می‌کشد', 'اظهارنامهٔ ترانزیت در سمت قزاقستان', 'کابل شارژ را به تاشکند می‌فرستیم', 'خورگوس (مرز قزاقستان) ← آلماتی ← شیمکنت ← تاشکند',
      'کامیون از چین به قزاقستان وارد می‌شود', 'کامیون بار را به قزاقستان می‌برد و از آنجا به تاشکند می‌آید', 'خورگوس: چین ← قزاقستان', 'ممنوعیت ارسال واگن‌های مسطح خالی به دوستیک و آلتین‌کول', 'کارخانه‌هایی که صادرات به اروپا دارند',
      'به قزاقستان ارسال نمی‌کنیم', 'به ایران بار نمی‌بریم', 'حمل بار به قزاقستان نداریم', 'حمل بار به هندوستان انجام نمی‌شود', 'آیا حمل بار به روسیه هم دارید؟', 'آیا به ایران هم بار می‌برید؟',
      'مسیر ایران نداریم', 'مسیر افغانستان', 'مسیر تازه: حمل بار با کامیون به افغانستان', 'انتقال پول به چین', 'حمل و نقل به افغانستان',
      'به کابل، هرات و قندهار بار نمی‌بریم', 'آیا تا هرات هم می‌رسانید؟', 'حیرتان • مزار شریف', 'افغانستان', 'ازبکستان', 'جواهرات و اشیای عتیقه', 'کابل شارژ و چراغ LED'] },

  /* — the Afghanistan direction: no number of days and no price (block rules: one paragraph, heading, list item
       or table row at a time) — */
  { id: 'uz.afghanFigure', block: true, msg: FIGURE_MSG('uz'),
    re: new RegExp(`${beside(AFGHAN[0], UZ_FIGURE, '.!?')}|${beside(AFGHAN[1], UZC_FIGURE, '.!?')}`, 'iu'),
    bad: ['Afgʻonistonga 10–12 kunda yetkazamiz', 'Hayratongacha 5–7 kun', 'Mozori Sharifgacha yetkazish — 1 200 $ dan', 'Toshkentdan Hayratonga 3 kun, narxi 900 dollar', '2 hafta ichida Afgʻonistonga', '12 000 000 soʻm — Mozori Sharifgacha', 'Hayratonda 2–3 soat kutiladi',
      'Афғонистонга 10–12 кунда етказамиз', 'Ҳайратонгача 5–7 кун', 'Мозори Шарифгача 1 200 $ дан'],
    good: ['Xitoydan Toshkentga 15–25 kun', 'Saytdagi tariflar, kalkulyator va muddatlar faqat Xitoy → Toshkent yoʻnalishiga tegishli.', 'Narx va muddat — soʻrov boʻyicha: menejer ularni yukingiz boʻyicha hisoblab beradi.',
      'Xizmat 10 — Afgʻoniston', 'WhatsApp (+998 00 000 00 00) yoki Telegramga yozing: yuk nima, hajmi yoki ogʻirligi qancha, hozir qayerda va qayerga borishi kerak — Hayratongami yoki Mozori Sharifgami.',
      'Yigʻma yuk 15–25 kun. Afgʻonistonga yuk — narx va muddat soʻrov boʻyicha.', 'Afgʻonistonga yuk tashishni 2026-yilda boshladik.',
      'Saytdagi 1 m³ minimum Xitoydan Toshkentga keladigan yigʻma yukka tegishli.',
      'Хитойдан Тошкентга 15–25 кун', 'Хизмат 10 — Афғонистон'] },
  { id: 'ru.afghanFigure', block: true, msg: FIGURE_MSG('ru'),
    re: new RegExp(beside(AFGHAN[2], RU_FIGURE, '.!?'), 'iu'),
    bad: ['В Афганистан — 10–14 дней', 'До Хайратона 5–7 дней', 'Доставка до Мазари-Шарифа от 1 200 $', 'за 3 дня до Хайратона', 'от 5 до 7 дней до Мазари-Шарифа', 'В Афганистан за 2 недели', 'до Хайратона — за 2 суток'],
    good: ['Из Китая в Ташкент 15–25 дней', 'Тарифы, калькулятор и сроки на сайте относятся только к направлению Китай → Ташкент.', 'Цена и срок — по запросу: менеджер считает их под ваш груз.', 'Услуга 10 — Афганистан',
      'Напишите в WhatsApp (+998 00 000 00 00) или в Telegram: что за груз, какой у него объём или вес, где он сейчас и куда его везти — в Хайратон или в Мазари-Шариф.', 'Сборный груз 15–25 дней. Грузы в Афганистан — цена и срок по запросу.',
      'Минимум 1 м³, указанный на сайте, относится к сборному грузу из Китая в Ташкент.'] },
  { id: 'en.afghanFigure', block: true, msg: FIGURE_MSG('en'),
    re: new RegExp(beside(AFGHAN[3], EN_FIGURE, '.!?'), 'iu'),
    bad: ['Cargo to Afghanistan in 10–14 days', 'To Hairatan in 5–7 days', 'from $1,200 to Mazar-i-Sharif', 'Delivery to Mazar-i-Sharif takes 3 days', '2 weeks to Hairatan', 'Afghanistan: from 900 USD per truck', 'The truck reaches Hairatan within 48 hours'],
    good: ['From China to Tashkent in 15–25 days', 'The tariffs, the calculator and the transit times on this site apply to the China → Tashkent direction only.', 'Price and timing are on request: the manager calculates them for your cargo.', 'Service 10 — Afghanistan',
      'Message us on WhatsApp (+998 00 000 00 00) or Telegram: what the cargo is, its volume or weight, where it is now and where it has to go — Hairatan or Mazar-i-Sharif.',
      'Consolidated truck cargo takes 15–25 days. Cargo to Afghanistan is quoted on request.', 'The 1 m³ minimum published on this site applies to consolidated cargo from China to Tashkent.',
      'Regulation No. 737 of 31 December 2022 applies to transit to Afghanistan'] },
  { id: 'zh.afghanFigure', block: true, msg: FIGURE_MSG('zh'),
    re: new RegExp(beside(AFGHAN[4], ZH_FIGURE, ZH_STOP), 'iu'),
    bad: ['发往阿富汗约 10–14 天', '到海拉顿 5–7 天', '送至马扎里沙里夫 1,200 美元起', '3 天到海拉顿', '发往阿富汗 2 周内送达', '海拉顿口岸 48 小时内放行'],
    good: ['中国到塔什干 15–25 天', '本网站上的运价、运费计算器和时效仅适用于中国 → 塔什干方向。', '价格和时效按需报价：由客户经理按您的货物核算。', '服务 10 — 阿富汗',
      '通过 WhatsApp（+998 00 000 00 00）或 Telegram 告诉我们：货物品名、体积或重量、货物目前在哪里、要送到哪里——海拉顿还是马扎里沙里夫。', '汽运拼货约 15–25 天。发往阿富汗的货物按需报价。',
      '更新日期：2026年11月12日 阿富汗货运', '周一至周六 9:00–19:00 周日休息 阿富汗货运', '根据2022年12月31日第737号决议办理发往阿富汗的过境手续', '本网站公布的 1 m³ 最低起运量，适用于从中国发往塔什干的拼货。'] },
  { id: 'fa.afghanFigure', block: true, msg: FIGURE_MSG('fa'),
    re: new RegExp(beside(AFGHAN[5], FA_FIGURE, FA_STOP), 'iu'),
    bad: ['حمل بار به افغانستان در ۱۰ تا ۱۴ روز', 'تا حیرتان ۵ تا ۷ روز', 'تا مزار شریف از ۱٬۲۰۰ دلار', '۳ روز تا حیرتان', 'به افغانستان در ۲ هفته', 'تحویل ۱۰ روزه تا حیرتان'],
    good: ['از چین تا تاشکند ۱۵ تا ۲۵ روز', 'تعرفه‌ها، ماشین‌حساب و زمان‌های حمل در این سایت فقط مربوط به مسیر چین ← تاشکند است.', 'قیمت و زمان با استعلام اعلام می‌شود: کارشناس ما آن‌ها را برای بار شما محاسبه می‌کند.', 'خدمت ۱۰ — افغانستان',
      'در WhatsApp (+998 00 000 00 00) یا Telegram بنویسید: بار چیست، حجم یا وزن آن چقدر است، اکنون کجاست و باید به کجا برود — حیرتان یا مزار شریف.', 'بار تجمیعی ۱۵ تا ۲۵ روز. حمل بار به افغانستان با استعلام است.', 'حداقل ۱ متر مکعب که در این سایت آمده، مربوط به بار تجمیعی از چین به تاشکند است.'] },

  /* — the Afghanistan direction: by truck only (block rules too) — */
  { id: 'uz.afghanMode', block: true, msg: MODE_MSG('uz'),
    re: new RegExp(`${UZ_MODE}|${UZC_MODE}`, 'iu'),
    bad: ['Afgʻonistonga temir yoʻl orqali ham yuk tashiymiz', 'Hayratonga vagonda yetkazamiz', 'Afgʻonistonga avia yuk', 'Temir yoʻlda Afgʻonistonga yuk tashish', 'Mozori Sharifgacha samolyot bilan', 'Afgʻonistonga fura, temir yoʻl va avia orqali yuk tashiymiz', 'Afgʻonistonga temiryoʻl orqali yuk tashiymiz', 'Hayratonga konteyner poyezdi', 'Afgʻonistonga uchoqda yetkazamiz',
      'Афғонистонга темир йўл орқали ҳам юк ташиймиз', 'Ҳайратонга вагонда етказамиз', 'Афғонистонга авиа юк', 'Афғонистонга темирйўл орқали юк ташиймиз'],
    good: ['Ikkala holda ham yuk faqat fura bilan tashiladi.', 'Afgʻonistonga ham fura bilan yuk tashiymiz', 'Afgʻonistonga temir yoʻl yoki avia orqali yuk tashimaymiz', 'Afgʻonistonga faqat fura bilan; temir yoʻl va avia yoʻq',
      'Afgʻonistonga faqat fura bilan tashiymiz: temir yoʻl va avia bu yoʻnalishda yoʻq', 'Afgʻonistonga temir yoʻl orqali ham tashiysizmi?', 'Avia, temir yoʻl va fura — Xitoydan Toshkentga; Afgʻonistonga — fura bilan',
      'Xitoydan Oʻzbekistonga avia va temir yoʻl, Afgʻonistonga esa fura bilan yuk tashiymiz', 'Afgʻonistonga konditsioner va mebel ham tashiymiz', 'Afgʻonistonga temiryoʻl orqali tashimaymiz',
      'Афғонистонга ҳам фура билан юк ташиймиз', 'Афғонистонга темир йўл ёки авиа орқали юк ташимаймиз'] },
  { id: 'ru.afghanMode', block: true, msg: MODE_MSG('ru'),
    re: new RegExp(RU_MODE, 'iu'),
    bad: ['В Афганистан возим и по железной дороге', 'Вагонами до Хайратона', 'Авиадоставка в Афганистан', 'ж/д перевозки в Мазари-Шариф', 'в Афганистан самолётом', 'в Афганистан фурой, по железной дороге и авиа', 'Железнодорожные перевозки в Афганистан', 'Доставка в Афганистан железнодорожным транспортом', 'контейнерные поезда до Хайратона',
      'Авиаперевозки в Афганистан', 'воздушным транспортом в Мазари-Шариф'],
    good: ['В обоих случаях груз едет только фурой.', 'теперь возим грузы фурами и в Афганистан', 'В Афганистан не возим по железной дороге и авиа', 'В Афганистан — только фурой; железной дороги и авиа нет',
      'В Афганистан — только фурой; ж/д и авиа — для Китая', 'Возите ли вы в Афганистан по железной дороге?', 'Авиа, ж/д и фура — из Китая в Ташкент; в Афганистан — фурой', 'Из Китая в Узбекистан авиа и ж/д, а в Афганистан возим фурой',
      'Железнодорожных и авиаперевозок в Афганистан нет', 'За одну поездку в Афганистан фура везёт до 22 тонн', 'Фура делает поездку до Мазари-Шарифа', 'Воздушные фильтры и вагонку везём в Афганистан фурой'] },
  { id: 'en.afghanMode', block: true, msg: MODE_MSG('en'),
    re: new RegExp(EN_MODE, 'iu'),
    bad: ['We also carry cargo to Afghanistan by rail', 'Rail freight to Hairatan', 'Air cargo to Afghanistan', 'wagons to Hairatan', 'to Mazar-i-Sharif by air', 'Afghanistan: rail and air on request', 'to Afghanistan by truck, rail or air', 'railcars to Hairatan', 'Container trains to Hairatan', 'Cargo is flown to Mazar-i-Sharif', 'aircraft charter to Afghanistan'],
    good: ['In both cases the cargo travels by truck only.', 'We now also carry cargo to Afghanistan by truck', 'We do not carry cargo to Afghanistan by rail or by air', 'Cargo to Afghanistan goes by truck only; there is no rail or air service',
      'We carry cargo to Afghanistan by truck — rail and air are not offered on this direction', 'Unlike air or rail, cargo to Afghanistan goes by truck', 'Do you carry cargo to Afghanistan by rail?',
      'Air, rail and truck from China to Tashkent; truck cargo to Afghanistan', 'air cargo and rail containers from China to Uzbekistan, and now truck cargo to Afghanistan',
      'Cargo to Afghanistan: air conditioners, tiles, furniture', 'air compressors for Afghanistan', 'We train our drivers for the Afghanistan route'] },
  { id: 'zh.afghanMode', block: true, msg: MODE_MSG('zh'),
    re: new RegExp(ZH_MODE, 'iu'),
    bad: ['铁路运往阿富汗', '发往阿富汗的空运货物', '经铁路至海拉顿', '阿富汗空运', '班列直达马扎里沙里夫', '货运列车直达海拉顿', '专列发往阿富汗', '发往阿富汗的铁运货物', '航班直飞马扎里沙里夫'],
    good: ['两个方向的货物都只走汽运。', '现在也承接发往阿富汗的汽运货物', '发往阿富汗的货物不走铁路和空运', '发往阿富汗只走汽运，没有铁路和空运', '阿富汗方向只走汽运，铁路和空运仅用于中国至塔什干', '发往阿富汗可以走铁路吗？',
      '中国到塔什干有空运、铁路和汽运；发往阿富汗走汽运', '发往阿富汗的空调和家具', '钢铁运输到阿富汗走汽运', '发往阿富汗不走列车'] },
  { id: 'fa.afghanMode', block: true, msg: MODE_MSG('fa'),
    re: new RegExp(FA_MODE, 'iu'),
    bad: ['حمل ریلی به افغانستان', 'با قطار تا حیرتان', 'حمل هوایی به افغانستان', 'به مزار شریف با هواپیما', 'واگن به حیرتان', 'از طریق خط آهن تا حیرتان', 'با ریل تا حیرتان', 'با طیاره به مزار شریف'],
    good: ['در هر دو مسیر بار فقط با کامیون حمل می‌شود.', 'اکنون با کامیون به افغانستان هم بار می‌بریم', 'به افغانستان حمل ریلی و هوایی نداریم', 'به افغانستان فقط با کامیون؛ حمل ریلی و هوایی نداریم', 'آیا به افغانستان حمل ریلی هم دارید؟',
      'حمل هوایی، ریلی و زمینی از چین به تاشکند؛ به افغانستان با کامیون', 'با تریلی تا حیرتان می‌رسانیم', 'بار را با تریلی به افغانستان می‌بریم', 'شرایط آب و هوایی افغانستان', 'به افغانستان از طریق خط آهن بار نمی‌بریم'] },

  /* — the Afghanistan direction: no volume figure (the 1 m³ minimum is China → Tashkent's) — */
  { id: 'uz.afghanVolume', block: true, msg: VOLUME_MSG('uz'),
    re: new RegExp(`${beside(AFGHAN[0], UZ_CBM, '.!?')}|${beside(AFGHAN[1], UZC_CBM, '.!?')}`, 'iu'),
    bad: ['Afgʻonistonga yigʻma yuk 1 m³ dan qabul qilinadi', 'Afgʻonistonga minimal hajm 1 m³', 'Hayratongacha kamida 5 kub yuk olamiz', 'Mozori Sharifga 10 m3 dan', '2 kubdan boshlab Afgʻonistonga',
      'Афғонистонга йиғма юк 1 м³ дан қабул қилинади', 'Ҳайратонгача камида 5 куб'],
    good: ['Saytdagi 1 m³ minimum Xitoydan Toshkentga keladigan yigʻma yukka tegishli.', 'Eng kichik partiya hajmi menejer bilan kelishiladi — bu sahifada son koʻrsatilmagan.', 'Yigʻma yuk 1 m³ dan. Afgʻonistonga yuk — soʻrov boʻyicha.',
      'Xitoydan Toshkentga yigʻma yuk kamida 1 m³ dan qabul qilinadi', 'Сайтдаги 1 м³ минимум Хитойдан Тошкентга келадиган йиғма юкка тегишли.'] },
  { id: 'ru.afghanVolume', block: true, msg: VOLUME_MSG('ru'),
    re: new RegExp(beside(AFGHAN[2], RU_CBM, '.!?'), 'iu'),
    bad: ['В Афганистан сборный груз от 1 м³', 'Минимальный объём в Афганистан — 1 м³', 'до Хайратона от 5 кубов', 'В Мазари-Шариф принимаем от 2 куб. м', 'в Афганистан от 3 кубометров'],
    good: ['Минимум 1 м³, указанный на сайте, относится к сборному грузу из Китая в Ташкент.', 'Минимальный размер партии согласуется с менеджером — на этой странице цифры нет.', 'Сборный груз — от 1 м³. Грузы в Афганистан — по запросу.',
      'Сборный груз из Китая в Ташкент принимаем от 1 м³'] },
  { id: 'en.afghanVolume', block: true, msg: VOLUME_MSG('en'),
    re: new RegExp(beside(AFGHAN[3], EN_CBM, '.!?'), 'iu'),
    bad: ['Consolidated cargo to Afghanistan from 1 m³', 'Minimum volume to Afghanistan: 1 m³', 'from 5 cbm to Hairatan', 'to Mazar-i-Sharif from 2 cubic metres', 'Afghanistan: lots from 3 m3'],
    good: ['The 1 m³ minimum published on this site applies to consolidated cargo from China to Tashkent.', 'The smallest lot is agreed with the manager — this page gives no figure.', 'Consolidated cargo is accepted from 1 m³. Cargo to Afghanistan is quoted on request.',
      'Consolidated truck cargo from China to Tashkent is accepted from 1 m³ per shipment'] },
  { id: 'zh.afghanVolume', block: true, msg: VOLUME_MSG('zh'),
    re: new RegExp(beside(AFGHAN[4], ZH_CBM, ZH_STOP), 'iu'),
    bad: ['发往阿富汗的拼货 1 m³ 起运', '阿富汗方向最低起运量 1 立方米', '到海拉顿 5 方起', '送至马扎里沙里夫 2 立方起'],
    good: ['本网站公布的 1 m³ 最低起运量，适用于从中国发往塔什干的拼货。', '最小起运量由客户经理与您商定——本页不列具体数字。', '拼货 1 m³ 起运。发往阿富汗的货物按需报价。', '中国到塔什干的拼货 1 m³ 起运'] },
  { id: 'fa.afghanVolume', block: true, msg: VOLUME_MSG('fa'),
    re: new RegExp(beside(AFGHAN[5], FA_CBM, FA_STOP), 'iu'),
    bad: ['بار تجمیعی به افغانستان از ۱ متر مکعب', 'حداقل حجم برای افغانستان ۱ متر مکعب است', 'تا حیرتان از ۵ متر مکعب', 'به مزار شریف از ۲ مترمکعب'],
    good: ['حداقل ۱ متر مکعب که در این سایت آمده، مربوط به بار تجمیعی از چین به تاشکند است.', 'حداقل حجم محموله با کارشناس ما توافق می‌شود — در این صفحه رقمی نیامده است.', 'بار تجمیعی از ۱ متر مکعب. حمل بار به افغانستان با استعلام است.',
      'بار تجمیعی از چین به تاشکند از ۱ متر مکعب پذیرفته می‌شود'] },

  /* — the Afghanistan direction: no office, branch or representative there — */
  { id: 'uz.afghanPresence', block: true, msg: PRESENCE_MSG('uz'),
    re: new RegExp(`${UZ_PRESENCE}|${UZC_PRESENCE}`, 'iu'),
    bad: ['Mozori Sharifda ofisimiz bor', 'Afgʻonistonda vakilimiz ishlaydi', 'Hayratondagi filialimiz yukni qabul qiladi', 'Ofisimiz Mozori Sharifda joylashgan',
      'Афғонистонда офисимиз бор', 'Мозори Шарифдаги вакилимиз'],
    good: ['Afgʻonistonda ofisimiz yoʻq', 'Ofisimiz Toshkentda; Afgʻonistonga fura bilan yuk tashiymiz', 'Afgʻonistonda ofisingiz bormi?', 'Ofis faqat Toshkentda', 'Афғонистонда офисимиз йўқ'] },
  { id: 'ru.afghanPresence', block: true, msg: PRESENCE_MSG('ru'),
    re: new RegExp(RU_PRESENCE, 'iu'),
    bad: ['Наш офис в Мазари-Шарифе', 'В Афганистане работает наш представитель', 'филиал в Хайратоне принимает грузы', 'В Афганистане у нас есть представительство'],
    good: ['Офиса в Афганистане у нас нет', 'Офис — в Ташкенте; в Афганистан возим фурой', 'Есть ли у вас офис в Афганистане?', 'Представителя в Афганистане нет'] },
  { id: 'en.afghanPresence', block: true, msg: PRESENCE_MSG('en'),
    re: new RegExp(EN_PRESENCE, 'iu'),
    bad: ['Our office in Mazar-i-Sharif', 'We have a representative in Afghanistan', 'our branch at Hairatan receives the cargo', 'In Afghanistan our office helps with customs'],
    good: ['We have no office in Afghanistan', 'Our office is in Tashkent; cargo to Afghanistan goes by truck', 'Do you have an office in Afghanistan?', 'the customs office in Hairatan', 'We do not have a representative in Afghanistan'] },
  { id: 'zh.afghanPresence', block: true, msg: PRESENCE_MSG('zh'),
    re: new RegExp(ZH_PRESENCE, 'iu'),
    bad: ['我们在阿富汗设有办事处', '马扎里沙里夫办事处', '在海拉顿设有分公司', '办事处设在马扎里沙里夫'],
    good: ['我们在阿富汗没有办事处', '办事处设在塔什干，发往阿富汗的货物走汽运', '你们在阿富汗有办事处吗？', '公司在阿富汗未设代表处'] },
  { id: 'fa.afghanPresence', block: true, msg: PRESENCE_MSG('fa'),
    re: new RegExp(FA_PRESENCE, 'iu'),
    bad: ['دفتر ما در مزار شریف', 'در افغانستان نماینده داریم', 'شعبهٔ ما در حیرتان بار را تحویل می‌گیرد', 'نمایندگی ما در افغانستان'],
    good: ['در افغانستان دفتر نداریم', 'دفتر ما در تاشکند است؛ به افغانستان با کامیون بار می‌بریم', 'آیا در افغانستان دفتر دارید؟', 'در افغانستان نماینده‌ای نداریم'] },

  /* — the Afghanistan direction: no schedule and no "regular" departures — */
  { id: 'uz.afghanSchedule', block: true, msg: SCHEDULE_MSG('uz'),
    re: new RegExp(`${UZ_SCHEDULE}|${UZC_SCHEDULE}`, 'iu'),
    bad: ['Afgʻonistonga haftasiga ikki marta fura joʻnatamiz', 'Har hafta Hayratonga fura chiqadi', 'Afgʻonistonga muntazam reyslar', 'Mozori Sharifga haftalik fura',
      'Афғонистонга ҳафтасига икки марта фура жўнатамиз', 'Ҳар ҳафта Ҳайратонга фура чиқади'],
    good: ['Afgʻoniston — biz uchun yangi yoʻnalish.', 'Afgʻonistonga muntazam reys yoʻq: fura yuk yigʻilganda joʻnaydi', 'Afgʻonistonga har hafta fura joʻnatasizmi?', 'Fura qachon joʻnashini menejer aytadi', 'Афғонистон — биз учун янги йўналиш.'] },
  { id: 'ru.afghanSchedule', block: true, msg: SCHEDULE_MSG('ru'),
    re: new RegExp(RU_SCHEDULE, 'iu'),
    bad: ['Еженедельные отправки в Афганистан', 'Каждую неделю фура уходит в Хайратон', 'В Афганистан два раза в неделю', 'Регулярные рейсы до Мазари-Шарифа', 'в Афганистан по расписанию'],
    good: ['Афганистан — новое для нас направление.', 'Регулярных рейсов в Афганистан нет: фура уходит по мере набора груза', 'Отправляете ли вы фуры в Афганистан каждую неделю?', 'Когда уходит фура, скажет менеджер'] },
  { id: 'en.afghanSchedule', block: true, msg: SCHEDULE_MSG('en'),
    re: new RegExp(EN_SCHEDULE, 'iu'),
    bad: ['Weekly departures to Afghanistan', 'A truck leaves for Hairatan every week', 'Twice a week to Mazar-i-Sharif', 'Regular departures to Afghanistan', 'daily trucks to Hairatan'],
    good: ['Afghanistan is a new direction for us.', 'There are no weekly departures to Afghanistan: the truck leaves when the cargo is collected', 'Do you send trucks to Afghanistan every week?', 'The manager tells you when the truck leaves'] },
  { id: 'zh.afghanSchedule', block: true, msg: SCHEDULE_MSG('zh'),
    re: new RegExp(ZH_SCHEDULE, 'iu'),
    bad: ['每周发车前往阿富汗', '发往阿富汗的货物每周发运', '海拉顿方向定期发车', '每天都有车发往马扎里沙里夫'],
    good: ['阿富汗对我们来说是新方向。', '发往阿富汗没有固定班期，货物集齐后发车', '发往阿富汗每周都发车吗？', '发车时间由客户经理告知'] },
  { id: 'fa.afghanSchedule', block: true, msg: SCHEDULE_MSG('fa'),
    re: new RegExp(FA_SCHEDULE, 'iu'),
    bad: ['هر هفته به افغانستان کامیون می‌فرستیم', 'حرکت هفتگی به حیرتان', 'روزانه به مزار شریف بار می‌بریم', 'حمل منظم بار به افغانستان'],
    good: ['افغانستان برای ما مسیر تازه‌ای است.', 'به افغانستان حرکت هفتگی نداریم: کامیون پس از جمع شدن بار راه می‌افتد', 'آیا هر هفته به افغانستان کامیون می‌فرستید؟', 'زمان حرکت کامیون را کارشناس ما اعلام می‌کند'] },
];
/** The name this list had while it held the Chinese and Persian rules only; tools written against it read the whole list. */
export const ZH_FA_FORBIDDEN = CLAIM_RULES;


/* ── Orthography, per page language (raw text) ──────────────────────────────────────────────── */

// Persian letters (not digits, harakat or punctuation of the Arabic block).
const FA_LETTER = '[\\u{0620}-\\u{064A}\\u{066E}-\\u{06D3}\\u{06D5}\\u{06FA}-\\u{06FF}]';
// Any Arabic-script character: letters and the Persian digits ۰–۹.
const FA_ANY = '\\p{Script=Arabic}';
/**
 * A number whose digit groups are separated by a space (U+0020, NBSP, NNBSP, thin or ideographic
 * space), written with the digits of the class `digits`. A phone number (+998 95 018 33 33) is not
 * one: anything after a "+" and its digits is left alone.
 */
function spaceGrouped(digits) {
  const space = '[ \\u{00A0}\\u{202F}\\u{2009}\\u{3000}]';
  return new RegExp(`(?<![${digits}\\u{066B}\\u{066C}.,]|\\+[${digits} \\u{00A0}\\u{202F}\\u{2009}-]{0,20})[${digits}]{1,3}(?:${space}[${digits}]{3})+(?![${digits}])`, 'u');
}

/**
 * level: 'error' fails the build on any page of that language; 'warn' is reported. A rule marked
 * `textNode` is matched against each text node (and the title and description) on its own instead
 * of against the page's text joined across tags.
 */
export const PAGE_RULES = {
  zh: [
    { id: 'zh.traditional', level: 'error', msg: 'Traditional Chinese character on a zh-Hans page',
      re: /[們這貨運關門國車價買賣東華區號際應會與對從過網務電話覽頁說請問題種類點擊報錢費稅單據聯絡讓幫]/u,
      bad: ['我們的貨運'], good: ['我们的货运'] },
    // Also after a space: the usual way it reaches a page is a code-level "label: value" join, which
    // prints "更新日期: 2026年9月8日" — a half-width colon and a space between Chinese and a figure.
    { id: 'zh.halfPunct', level: 'warn', msg: 'half-width , ; : ? ! after a Chinese character (use ，；：？！ — a "label: value" join in code prints "更新日期: 2026年9月8日")',
      re: /(?<=\p{Script=Han})[,;:?!](?=\s?\p{Script=Han})|(?<=\p{Script=Han})[,;:]\s?(?=\d)/u,
      bad: ['运输,清关', '更新日期: 2026年9月8日', '客户经理: 复制', '输入: 20 kg'], good: ['运输，清关', 'GSR Logistics, Tashkent', '更新日期：2026年9月8日', '周一至周六 9:00–19:00', 'Q: 什么是 FCL？'] },
    // zh groups thousands with a comma (DECISIONS.md §1: 2,800). A space of any kind between digit
    // groups is another locale's formatter on a Chinese page (uz/ru group with U+202F). Checked per
    // text node: a table's neighbouring cells ("100 | 110 美元") are not one number.
    { id: 'zh.spaceGrouping', level: 'warn', textNode: true, msg: 'digits grouped with a space — zh groups thousands with a comma (2,800) through src/lib/format.ts',
      re: spaceGrouped('0-9'),
      bad: ['2 800 美元', '1\u{202F}200\u{202F}000 苏姆', '÷ 5 000'], good: ['2,800 美元', '+86 138 0013 8000', '+998 95 018 33 33', '15–25 天', '2026年9月8日', '2025 2026'] },
    { id: 'zh.pinyin', level: 'warn', msg: 'pinyin place name inside Chinese text (义乌, 广州, 喀什 …; a gloss in parentheses is fine)',
      re: /(?<=\p{Script=Han}\s?)(?:Yiwu|Guangzhou|Kashgar|Shenzhen|Urumqi|Lanzhou|Khorgos)\b(?!\s?[)）])|(?<![(（]\s?)\b(?:Yiwu|Guangzhou|Kashgar|Shenzhen|Urumqi|Lanzhou|Khorgos)(?=\s?\p{Script=Han})/u,
      bad: ['从Yiwu发货', '从 Guangzhou 发货'], good: ['义乌（Yiwu）', '义乌 (Yiwu)', 'from Yiwu to Tashkent'] },
  ],
  fa: [
    { id: 'fa.arabicLetters', level: 'error', msg: 'Arabic ي / ك / ى in Persian text (write ی and ک)',
      re: /[\u{064A}\u{0643}\u{0649}]/u,
      bad: ['\u{0643}ارگو', 'ی\u{064A}وو'], good: ['کارگو', 'ییوو'] },
    // DECISIONS.md: Persian digits in every displayed quantity, price, date, duration, count and year;
    // ASCII only inside identifiers (phones, codes, 1688, 20GP, HS codes, URLs). So an ASCII figure
    // that a Persian unit or percent sign follows, or that از / تا (from / to) introduces, is a figure
    // printed past src/lib/format.ts — "20–35 روز", "از 2018", "مالیات 12%". Phones, codes and 1688
    // are left alone, and so is the English fallback of a pending page ("12% VAT"): the percent sign
    // counts only next to a Persian word. An ERROR, like every other rule of DECISIONS.md §1.
    { id: 'fa.asciiFigure', level: 'error', msg: 'ASCII digits in a Persian figure (format it with src/lib/format.ts: ۱۵ تا ۲۵ روز, از ۲۰۱۸, ۱۲٪)',
      re: new RegExp(`(?<![\\w.+/@#-])\\d+(?:[.,]\\d+)?(?:\\s?[–-]\\s?\\d+(?:[.,]\\d+)?)?[\\s\\p{Cf}]{0,2}(?:روز|ساعت|دقیقه|ثانیه|هفته|ماه|سال|کیلوگرم|کیلو|گرم|تن|مترمکعب|متر|کیلومتر|دلار|سوم|درصد|عدد|کامیون|مشتری)(?!${FA_LETTER})|(?<!${FA_LETTER})(?:از|تا)[\\s\\p{Cf}](?!1688(?!\\d))\\d+(?![\\w/])|(?<=${FA_LETTER}[\\s\\p{Cf}]{1,2})\\d+(?:[.,]\\d+)?\\s?[%\\u{066A}]|(?<![\\w.+/@#-])\\d+(?:[.,]\\d+)?\\s?[%\\u{066A}](?=[\\s\\p{Cf}]{0,2}${FA_LETTER})`, 'u'),
      bad: ['Rail 20–35 روز', 'از 2018', '۱۵ تا 25 روز', '110 دلار', 'مالیات بر ارزش افزوده 12%', '20% حقوق گمرکی', 'کارمزد 3٪', 'مسیر در 40 ثانیه', '12 دقیقه'], good: ['۲۰ تا ۳۵ روز', 'از ۲۰۱۸', 'مسیر در ۴۰ ثانیه', '۱۲ دقیقه', 'سفارش از 1688', '+998 95 018 33 33', 'کانتینر 40HQ', 'کد HS 8471 برای پاور بانک', '۱۲٪ مالیات بر ارزش افزوده', 'duty 20% and 12% VAT', 'UTC+5'] },
    // DECISIONS.md §1: never U+0020 between digit groups — in a right-to-left line the two groups are
    // two numbers, laid out right to left ("۵ ۰۰۰" displays as "۰۰۰ ۵"); and the no-break spaces are
    // how uz/ru group, not fa (۵٬۰۰۰). Checked per text node: neighbouring table cells are not one number.
    { id: 'fa.spaceGrouping', level: 'error', textNode: true, msg: 'digits grouped with a space — a right-to-left line shows "۵ ۰۰۰" as "۰۰۰ ۵"; group thousands with ٬ through src/lib/format.ts (۵٬۰۰۰)',
      re: spaceGrouped('0-9\\u{06F0}-\\u{06F9}'),
      bad: ['÷ ۵ ۰۰۰', '۲ ۸۰۰ تا ۵ ۵۰۰ دلار', '20 000 سوم', '۱\u{202F}۲۰۰\u{202F}۰۰۰ سوم'], good: ['۵٬۰۰۰', '+998 95 018 33 33', '+86 138 0013 8000', '۱۵ تا ۲۵ روز', '۲۰۲۶/۰۹/۰۸', '۹:۰۰ تا ۱۹:۰۰', 'کانتینر 40HQ', '۲۰۲۵ ۲۰۲۶'] },
    { id: 'fa.arabicIndicDigits', level: 'error', msg: 'Arabic-Indic digits ٠–٩ (write the Persian ۰–۹)',
      re: /[\u{0660}-\u{0669}]/u,
      bad: ['\u{0664}\u{0665}\u{0660}'], good: ['۴۵۰', '450'] },
    { id: 'fa.rightArrow', level: 'error', msg: '"→" next to Persian text — it does not mirror in RTL; write "←" (ییوو ← تاشکند)',
      re: new RegExp(`${FA_ANY}[\\s\\p{Cf}]{0,3}→|→[\\s\\p{Cf}]{0,3}${FA_ANY}`, 'u'),
      bad: ['ییوو → تاشکند', '→ تاشکند'], good: ['ییوو ← تاشکند', 'CN → KZ'] },
    { id: 'fa.middleDot', level: 'error', msg: '"·" next to Persian text — it reads as the Persian zero ۰; write " • "',
      re: new RegExp(`${FA_ANY}[\\s\\p{Cf}]{0,3}\\u{00B7}|\\u{00B7}[\\s\\p{Cf}]{0,3}${FA_ANY}`, 'u'),
      bad: ['هوایی · زمینی', '۱۵ · ۲۵'], good: ['هوایی • زمینی', 'BYD · Zeekr · Li Auto'] },
    { id: 'fa.presentationForms', level: 'error', msg: 'Arabic presentation forms (text pasted from a PDF: it breaks search and copy)',
      re: /[\u{FB50}-\u{FDFB}\u{FDFD}-\u{FDFF}\u{FE70}-\u{FEFC}]/u,
      bad: ['\u{FEDB}\u{FE8E}\u{FEAE}\u{FB94}\u{FEEE}'], good: ['کارگو'] },
    { id: 'fa.embedding', level: 'warn', msg: 'bidi embedding/override control (U+202A–U+202E): isolate with dir="ltr" or LRI…PDI instead',
      re: /[\u{202A}-\u{202E}]/u,
      bad: ['\u{202B}کارگو\u{202C}'], good: ['\u{2066}+998 95 018 33 33\u{2069}'] },
    { id: 'fa.latinPunct', level: 'warn', msg: 'Latin , ; ? between Persian words (write ، ؛ ؟)',
      re: new RegExp(`(?<=${FA_LETTER})\\s?[,;?](?=\\s?${FA_LETTER})`, 'u'),
      bad: ['کارگو, هوایی'], good: ['کارگو، هوایی', '۱۵, ۲۵'] },
    { id: 'fa.miSpace', level: 'warn', msg: 'می / نمی followed by a space instead of a ZWNJ (می‌شود)',
      re: new RegExp(`(?<!${FA_LETTER})ن?می (?=${FA_LETTER}{2,})`, 'u'),
      bad: ['می شود', 'نمی پذیریم'], good: ['می‌شود', 'نمی‌پذیریم'] },
  ],
};

/* ── Untranslated text on a zh or fa page ───────────────────────────────────────────────────── */

/**
 * The office's official street address, `site.address.streetAddress` in src/lib/site.ts
 * ("Alisher Navoiy koʻchasi, 27"). A translation may print it as it is written in Uzbek — the Chinese
 * contact page gives it for the taxi driver, followed by its Chinese rendering — so leakRuns() lets
 * exactly this string through, when Chinese or Persian text surrounds it. Nothing else of it: «koʻchasi»
 * on its own, the street name inside an Uzbek sentence, or the address with Uzbek or English words
 * beside it, is still untranslated text. Read from the source as text, the way
 * scripts/locales.mjs reads config.ts: these scripts run under plain Node, without TypeScript.
 */
export function parseStreetAddress(source) {
  const m = /^\s*streetAddress:\s*'((?:[^'\\\n]|\\.)+)'/m.exec(source);
  if (!m) throw new Error("scripts/content-rules.mjs: no `streetAddress: '…'` line in src/lib/site.ts");
  return m[1].replace(/\\(.)/g, '$1');
}
export const STREET_ADDRESS = parseStreetAddress(readFileSync(new URL('../src/lib/site.ts', import.meta.url), 'utf8'));
/** Spaces, punctuation, symbols and bidi/format marks: what may stand between the address and its neighbours. */
const ADDRESS_EDGE = '[\\s\\p{P}\\p{S}\\p{Cf}]*';
/**
 * STREET_ADDRESS as a whole token ("…koʻchasi, 270" or "…koʻchasi, 27a" is not the official address)
 * that stands among Chinese or Persian text: the nearest letter on either side, across spaces and
 * punctuation, must not be Latin. Otherwise the words around it are Uzbek or English — "bizning ofis
 * …", "Toshkent, Shayxontohur tumani, …", "… yonida" — and cutting the address out would leave too few
 * of them for the three-word rule below, hiding a real leak that the address's «koʻchasi» exposes.
 */
const STREET_ADDRESS_RE = new RegExp(
  `(?<![\\p{Script=Latin}ʻʼ]${ADDRESS_EDGE})(?<!\\p{Nd})${STREET_ADDRESS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\p{Nd})(?!${ADDRESS_EDGE}[\\p{Script=Latin}ʻʼ])`,
  'gu',
);

/**
 * Foreign terms a translation keeps on purpose (GLOSSARY.md §3): the Russian customs code name.
 * Anything else in Cyrillic, or with the Uzbek ʻ/ʼ letters, is allowed only where the English page
 * the translation was made from quotes it too ("in Russian сборный груз", "kitay kargo").
 */
export const QUOTED_TERMS = ['ТН ВЭД'];
/** English toponyms that carry an Uzbek-looking apostrophe and still have to be translated. */
const NEVER_QUOTED = /^Xi[ʼ'’]an$/;

const UNITS = new Set(['kg', 'km', 'cm', 'mm', 'm', 'ft', 'pcs', 'g', 't', 'cbm', 'x', 'h', 'min']);
const LATIN_WORD = "[A-Za-zʻʼ][A-Za-zʻʼ'’\\-]*";
const SEPARATOR = "[\\s\\d.,:;!?()\"“”'‘’«»/&+%$°×·•²³–—\\-]";
const LATIN_RUN = new RegExp(`${LATIN_WORD}(?:${SEPARATOR}+${LATIN_WORD})*`, 'gu');
const CYRILLIC_RUN = /[\u{0400}-\u{04FF}][\u{0400}-\u{04FF}\-]*(?:[\s,/]+[\u{0400}-\u{04FF}][\u{0400}-\u{04FF}\-]*)*/gu;
const UZBEK_WORD = /(?<![A-Za-zʻʼ])[A-Za-z]*[ʻʼ][A-Za-zʻʼ]*|(?<![A-Za-z])(?:uchun|bilan|yoki|boʻyicha|qilamiz|yetkazib|olib\skelish)(?![A-Za-z])/gu;
const NOT_PROSE = /https?:\/\/\S+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|@[A-Za-z0-9_]{3,}|\b[\w-]+\.(?:uz|com|ru|cn|org|net|io)\b(?:\/\S*)?/gu;

/** The Cyrillic runs and Uzbek-looking words of a text — what a translation may quote from its source. */
export function quotedForeign(text) {
  const s = text.replace(NOT_PROSE, ' ');
  return new Set([...(s.match(CYRILLIC_RUN) ?? []), ...(s.match(UZBEK_WORD) ?? [])].map((w) => w.trim()).filter((w) => !NEVER_QUOTED.test(w)));
}

const GLOSS_SKIPS = /^(?:a|an|and|by|for|in|of|on|per|than|the|to)$/i;
/**
 * The English words spell out an acronym that stands right beside them, in the run or within a few
 * characters of it — "起订量（MOQ，minimum order quantity）", "MOQ (minimum order quantity)". Such a
 * gloss is kept on purpose; English prose that merely happens to sit near an acronym is not one.
 */
function spellsOut(words, near) {
  const acronyms = new Set([...(near.match(/(?<![A-Za-z])[A-Z]{2,6}(?![A-Za-z])/g) ?? []), ...words.filter((w) => /^[A-Z]{2,6}$/.test(w))]);
  if (!acronyms.size) return false;
  const rest = words.filter((w) => !acronyms.has(w));
  const initials = (ws) => ws.map((w) => w[0]).join('').toUpperCase();
  return rest.length >= 2 && [initials(rest), initials(rest.filter((w) => !GLOSS_SKIPS.test(w)))].some((i) => acronyms.has(i));
}

/**
 * Runs of English, Uzbek or Russian prose in the text of a zh or fa page: a Latin run with three or
 * more lowercase words (brands, codes, units and proper names are capitalised or listed), any Uzbek
 * word, any Cyrillic run — minus what `allowed` (the English source page's own quotes) contains,
 * minus the English expansion of an acronym standing beside it (spellsOut), and minus the official
 * street address, written exactly as site.ts writes it (STREET_ADDRESS).
 */
export function leakRuns(text, allowed = new Set()) {
  const s = text.replace(STREET_ADDRESS_RE, ' ').replace(NOT_PROSE, ' ');
  const runs = [];
  for (const m of s.matchAll(LATIN_RUN)) {
    const run = m[0];
    const words = run.match(new RegExp(LATIN_WORD, 'gu')) ?? [];
    const prose = words.filter((w) => /^[a-zʻʼ]/u.test(w) && w.length >= 2 && !UNITS.has(w.toLowerCase()));
    const near = `${s.slice(Math.max(0, m.index - 12), m.index)} ${s.slice(m.index + run.length, m.index + run.length + 12)}`;
    if (prose.length >= 3 && !spellsOut(words, near)) runs.push(run.trim());
  }
  const quoted = (w) => allowed.has(w) || QUOTED_TERMS.includes(w);
  for (const w of s.match(UZBEK_WORD) ?? []) if (!quoted(w.trim()) || NEVER_QUOTED.test(w.trim())) runs.push(w.trim());
  for (const r of s.match(CYRILLIC_RUN) ?? []) if (!quoted(r.trim()) && ![...allowed].some((a) => a.includes(r.trim()))) runs.push(r.trim());
  return [...new Set(runs)];
}

const LEAK_FIXTURES = {
  bad: ['Cargo from China to Tashkent in 15–25 days', 'Xitoydan Toshkentga yuk tashish uchun', 'Сборный груз из Китая в Ташкент', '途经 Xiʼan 和兰州', '查看 the status of your cargo here', 'MOQ 是 the smallest quantity a factory accepts', 'MOQ (the smallest quantity a factory accepts)'],
  good: ['义乌（Yiwu）发往塔什干', 'GSR Logistics 的客户经理', 'Imex services LLC', '拼货（LCL）', 'حمل بار از چین به تاشکند با GSR Logistics', '每公斤 9 美元起，1 m³ 起', '海关编码（HS 编码，ТН ВЭД）', '写信给 @GSR_GROUP_AGENT_bot 或 b.e.kodirov@gmail.com', 'BYD · Zeekr · Li Auto', 'power bank', '起订量（MOQ，minimum order quantity）是工厂接受的最小数量', 'حداقل سفارش (MOQ, minimum order quantity)', '国际通用术语为 LCL（Less than Container Load，拼箱）'],
};

/** The street address: written out in full it is the official address, not untranslated text. */
const ADDRESS_FIXTURES = {
  good: [
    `乘出租车时，向司机出示地址：${STREET_ADDRESS}（阿利舍尔·纳沃伊街 27 号）。`,
    `اگر با تاکسی می‌آیید، این نشانی را به راننده نشان دهید: ${STREET_ADDRESS}`,
    `نشانی: ${STREET_ADDRESS}، تاشکند`,
  ],
  bad: [
    '向司机出示地址：koʻchasi 27',
    '沿 Alisher Navoiy koʻchasi 步行至 27 号楼',
    'Alisher Navoiy koʻchasi boʻylab 27-uyga yuring',
    '地址：Alisher Navoiy koʻchasi, 28',
    `地址：${STREET_ADDRESS}0 号`,
    // The address is the official one, but the Uzbek words around it are untranslated text.
    `地址：${STREET_ADDRESS} yonida`,
    `bizning ofis ${STREET_ADDRESS}`,
    `Toshkent, Shayxontohur tumani, ${STREET_ADDRESS}`,
    `Manzil: ${STREET_ADDRESS}`,
    `نشانی ما ${STREET_ADDRESS} ga keling`,
  ],
};

/* ── The self-test ──────────────────────────────────────────────────────────────────────────── */

/** The plainest claim of each language, for the place tables: "We deliver to <place>". Uzbek adds its ending to the name (-qa after q). */
const PLAIN_CLAIM = {
  uz: (place) => `${place}${/q$/.test(place) ? 'qa' : 'ga'} yuk tashiymiz`,
  uzc: (place) => `${place}${/қ$/.test(place) ? 'қа' : 'га'} юк ташиймиз`,
  ru: (place) => `Доставка ${place}`, // the cell spells the preposition: «в Иран», «до Ирана»
  en: (place) => `We deliver to ${place}`,
  zh: (place) => `运往${place}`,
  fa: (place) => `به ${place} ارسال می‌کنیم`,
};
/** …and the bare route: "China → <place>". */
const PLAIN_ROUTE = {
  uz: (place) => `Xitoy → ${place}`,
  uzc: (place) => `Хитой → ${place}`,
  ru: (place) => `Китай → ${ruName(place)}`,
  en: (place) => `China → ${place}`,
  zh: (place) => `中国 → ${place}`,
  fa: (place) => `چین ← ${place}`,
};

/** Every rule against its own sentences. Returns the list of misfires (empty when all is well). */
export function selfTest() {
  const bad = [];
  for (const r of CLAIM_RULES) {
    for (const s of r.bad) if (!r.re.test(normalize(s))) bad.push(`${r.id} misses its bad sentence: ${s}`);
    for (const s of r.good) if (r.re.test(normalize(s))) bad.push(`${r.id} fires on its good sentence: ${s}`);
  }
  // A good sentence is one the site may say, so no OTHER rule may stop it either: the translator sentence has to
  // pass the destination rules, an Afghanistan sentence the figure rules, and so on. (check-content.mjs asserts
  // the same against its uz/ru/en FORBIDDEN list.)
  for (const owner of CLAIM_RULES) {
    for (const s of owner.good) {
      const n = normalize(s);
      for (const r of CLAIM_RULES) if (r !== owner && r.re.test(n)) bad.push(`${r.id} fires on the good sentence of ${owner.id}: ${s}`);
    }
  }
  const ids = CLAIM_RULES.map((r) => r.id);
  for (const id of new Set(ids.filter((x, i) => ids.indexOf(x) !== i))) bad.push(`two rules are called ${id}`);
  // The place tables, spelling by spelling. In the plainest claim of its language ("We deliver to …") a place GSR
  // does not serve must be stopped by that language's rule, and a place it serves must pass every rule. After an
  // arrow ("China → …") a place of ELSEWHERE must be stopped, and a country a route crosses (ON_ROUTE) must pass.
  const destination = Object.fromEntries(CLAIM_RULES.filter((r) => r.id.endsWith('.destination')).map((r) => [r.id.split('.')[0], r]));
  for (const [table, rows] of Object.entries(PLACE_TABLES)) {
    for (const row of rows) {
      PLACE_LANGS.forEach((lang, i) => {
        const rule = destination[lang === 'uzc' ? 'uz' : lang];
        for (const place of spellings(row[i])) {
          const claim = normalize(PLAIN_CLAIM[lang](place));
          const route = normalize(PLAIN_ROUTE[lang](place));
          if (table === 'SERVED') {
            for (const r of CLAIM_RULES) for (const s of [claim, route]) if (r.re.test(s)) bad.push(`${r.id} fires on a place GSR serves: ${s}`);
          } else {
            // (a bare Russian spelling — «Россия» — is the form after an arrow only)
            if (!(lang === 'ru' && place === ruName(place)) && !rule.re.test(claim)) bad.push(`${rule.id} misses a place of ${table} in ${lang}: ${claim}`);
            if (rule.re.test(route) !== (table === 'ELSEWHERE')) bad.push(`${rule.id} ${table === 'ELSEWHERE' ? 'misses' : 'fires on'} the route form of a place of ${table} in ${lang}: ${route}`);
          }
        }
      });
    }
  }
  // The five cities: the name alone, as a third point in a list, is stopped. (Persian «کابل» is also a cable.)
  for (const row of TOWNS) {
    PLACE_LANGS.forEach((lang, i) => {
      const rule = destination[lang === 'uzc' ? 'uz' : lang];
      for (const place of spellings(row[i])) {
        if (lang === 'ru' && !place.startsWith('в ')) continue; // the nominative is the form after «в»
        if (lang === 'fa' && !NOT_A_CABLE(row)) continue;
        const label = normalize(`· ${lang === 'ru' ? ruName(place) : place} ·`);
        if (!rule.re.test(label)) bad.push(`${rule.id} lets the name of a city pass in ${lang}: ${label}`);
      }
    });
  }
  for (const rules of Object.values(PAGE_RULES)) {
    for (const r of rules) {
      for (const s of r.bad) if (!r.re.test(s)) bad.push(`${r.id} misses its bad sentence: ${s}`);
      for (const s of r.good) if (r.re.test(s)) bad.push(`${r.id} fires on its good sentence: ${s}`);
    }
  }
  for (const s of LEAK_FIXTURES.bad) if (!leakRuns(s).length) bad.push(`leakRuns misses: ${s}`);
  for (const s of LEAK_FIXTURES.good) if (leakRuns(s).length) bad.push(`leakRuns fires on: ${s} → ${leakRuns(s).join(' | ')}`);
  // The official street address passes exactly as site.ts writes it — the zh contact page's taxi line —
  // and nothing else of it does: the bare word, the street inside an Uzbek sentence, a misspelling.
  // (A stray short value would be cut out of every page's text, so it must look like an address.)
  if (STREET_ADDRESS.trim().length < 8 || !/\p{L}{3,}.*\s/u.test(STREET_ADDRESS)) bad.push(`parseStreetAddress() read "${STREET_ADDRESS}" from src/lib/site.ts, which is not a street address`);
  for (const s of ADDRESS_FIXTURES.good) if (leakRuns(s).length) bad.push(`leakRuns fires on the official street address: ${s} → ${leakRuns(s).join(' | ')}`);
  for (const s of ADDRESS_FIXTURES.bad) if (!leakRuns(s).length) bad.push(`leakRuns lets a part of the street address through: ${s}`);
  if (parseStreetAddress("  streetAddress: 'Amir Temur shoh koʻchasi, 1',\n") !== 'Amir Temur shoh koʻchasi, 1') bad.push('parseStreetAddress() misreads a streetAddress line');
  // The quotes of the English source page are allowed on its translation, and only those.
  if (leakRuns('拼货（俄语 сборный груз）', quotedForeign('in Russian сборный груз')).length) bad.push('leakRuns rejects a quote its English source carries');
  if (!leakRuns('拼货（俄语 сборный груз）', quotedForeign('consolidated cargo')).length) bad.push('leakRuns accepts a Cyrillic quote its English source does not carry');
  // The normaliser itself: Persian digits, bidi marks, Arabic letters and CJK gaps.
  const n = normalize('\u{200F}+۹۹۸ ٩٧ ۳۳۳ ۳۹ ۳۳ ۰٫۱ ۲٬۸۰۰ ۱۲٪ ي ك 我们的 义乌 仓库');
  if (n !== '+998 97 333 39 33 0,1 2800 12% ی ک 我们的义乌仓库') bad.push(`normalize() gives "${n}"`);
  return bad;
}
