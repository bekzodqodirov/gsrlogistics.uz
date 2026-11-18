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
 *                 en.*, zh.*, fa.*): where GSR delivers, who answers in Persian, what may be said
 *                 about the Afghanistan direction and — since 2026-11-17 — about the employees' Chinese
 *                 (the HSK level and its certificate), that no price or quality result is promised and — since
 *                 2026-11-18 — that no factory visit is part of the service. A rule marked `block` reads one
 *                 block of a page at a time (a paragraph, a heading, a list item, a table row) instead of the
 *                 joined text.
 *   WHOLESALE_PAGE_RULES  the rules of one page (the wholesale-buying service, 2026-11-18): check-content.mjs reads them
 *                 as page-scoped rules of that page only.
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
 * below (ON_ROUTE, ELSEWHERE — its cities are listed first, as TOWNS — and SERVED), one row per place and one column per language — uz, uzc, ru, en, zh, fa — so that the six lists cannot
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
 * The cities among the places GSR does not deliver to: Afghan ones other than Hairatan and Mazar-i-Sharif (Kabul,
 * Herat, Kandahar, and Kunduz, Pul-e-Khumri and Sheberghan next to Mazar-i-Sharif), and Tehran, Mashhad, Isfahan and
 * the port of Bandar Abbas. The site has no other business with them, so their NAME is a claim
 * wherever it stands — a third delivery point in a list ("Hairatan · Mazar-i-Sharif · Kabul"), an answer without
 * a verb ("to one of two points: Tehran or Mashhad") — unless the sentence denies it or asks.
 */
const TOWNS = [
  ['Kobul / Qobul', 'Кобул / Қобул', 'в Кабул / до Кабула', 'Kabul', '喀布尔', 'کابل'],
  ['Hirot / Herot', 'Ҳирот / Ҳерот', 'в Герат / до Герата', 'Herat', '赫拉特', 'هرات'],
  ['Qandahor / Kandagar', 'Қандаҳор / Кандагар', 'в Кандагар / до Кандагара', 'Kandahar / Qandahar', '坎大哈', 'قندهار / کندهار'],
  ['Tehron / Tegeran', 'Теҳрон / Тегеран', 'в Тегеран / до Тегерана', 'Tehran / Teheran', '德黑兰', 'تهران'],
  ['Mashhad / Meshxed', 'Машҳад / Мешхед', 'в Мешхед / до Мешхеда / в Машхад / до Машхада', 'Mashhad / Meshed', '马什哈德', 'مشهد'],
  ['Qunduz', 'Қундуз', 'в Кундуз / до Кундуза', 'Kunduz', '昆都士', 'قندوز / کندز'],
  ['Puli Xumri / Puli-Xumri', 'Пули Хумри / Пули-Хумри', 'в Пули-Хумри / до Пули-Хумри', 'Pul-e-Khumri / Pul-i-Khumri / Puli Khumri', '普勒胡姆里', 'پلخمری / پل خمری'],
  ['Shibirgʻon', 'Шибирғон', 'в Шибарган / до Шибаргана / в Шеберган / до Шебергана', 'Sheberghan / Shibirghan', '希比尔甘', 'شبرغان'],
  ['Bandar Abbos / Bandar-Abbos', 'Бандар Аббос / Бандар-Аббос', 'в Бендер-Аббас / до Бендер-Аббаса / в Бандар-Аббас / до Бандар-Аббаса', 'Bandar Abbas', '阿巴斯港', 'بندرعباس / بندر عباس'],
  ['Isfahon', 'Исфаҳон', 'в Исфахан / до Исфахана', 'Isfahan / Esfahan', '伊斯法罕', 'اصفهان'],
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
/** The Afghan names in the six languages as one expression: check-content.mjs reads the answer to a question that names one. */
export const AFGHAN_NAME = new RegExp(`Afg${AP}?on|Hayraton|Mozori|Афғон|Ҳайратон|Мозори|Афган|Хайратон|Мазари|Afghan|Ha[iy]rat[ao]n|Mazar|阿富汗|海拉顿|马扎里沙里夫|افغان|حیرتان|مزار[\\s\\p{Cf}]?شریف`, 'iu');
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
  `(?![^.!?]{0,80}(?:\\?|\\b(?:not|never)\\b|\\bno\\b(?!\\s+(?:extra|additional|hidden|delays?|waiting|queues?|hassle|paperwork)\\b)|n[’']t\\b|${UZ_DENIED}|(?<![a-zʻʼ])(?:yo${AP}?q|emas)(?![a-zʻʼ])))`;
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
  `|←\\s?(?:${FA_ELSEWHERE})(?!\\p{Script=Arabic})(?![^${FA_STOP}]{0,60}←)` +
  // «در کابل» is the city, not a cable: «ما در کابل هم بار تحویل می‌دهیم», «شرکای ما در کابل هم ترخیص …»
  `|(?<!\\p{Script=Arabic})در\\sکابل(?!\\p{Script=Arabic})(?!\\s(?:برق|مسی|شبکه|فیبر))(?<!(?:نمی|ندار|نیست|نشد|بدون)[^${FA_STOP}]{0,60})(?![^${FA_STOP}]{0,80}(?:نمی|ندار|نیست|نشد|؟))`;
const DEST_MSG = (lang) => `names a country or city GSR does not serve as a destination (${lang}) — it delivers in Uzbekistan and, in Afghanistan, to Hairatan and Mazar-i-Sharif only (owner, 2026-11-11); the cities of the TOWNS table (Kabul, Herat, Kandahar, Kunduz, Pul-e-Khumri, Sheberghan, Tehran, Mashhad, Isfahan, Bandar Abbas) may be named only in a denial or a question`;

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
  return `(?:${B}(?:${o.staff})${o.letter}*[^.!?;]{0,60}?${lang}` +
    // «Tillar: oʻzbek, rus, ingliz, fors», «forsiyzabon menejer»
    `|${B}(?:${o.tillar})\\s*[:—–-]\\s*[^.!?;]{0,60}?${B}(?:${o.persian})(?:${o.cha})?${E}|${B}(?:${o.persian})${o.zabon}\\s+(?:${o.staff})` + // «Menejerlar … fors tillarida»
    `|${lang}\\s+(?:${o.too}\\s+)?(?:${o.speak}|(?:${o.knowing})[^.!?;]{0,20}?${B}(?:${o.staff})))` + // «forscha javob beramiz», «fors tilini biladigan menejer»
    `(?<!${o.translator}[^.!?;]{0,160})(?![^.!?;]{0,40}(?:\\?|${o.neg}|${o.translator}))`;
};
const UZ_STAFF = uzbekStaff({
  letter: '[a-zʻʼ]', persian: 'fors(?:iy)?|dariy?|pushtu|pashtu|tojik', tillar: 'tillar(?:imiz)?', zabon: 'zabon', cha: 'cha', til: 'til(?:i|ida|ini|da|ni|lari|larida|larini|larda|larni)', too: 'ham',
  staff: 'menejer|xodim|mutaxassis|operator|maslahatchi|jamoa', knowing: 'biladigan|bilguvchi|tushunadigan',
  speak: `gaplash|so${AP}?zlash|gapir|javob\\s+ber|muloqot\\s+qil|maslahat\\s+ber|xizmat\\s+ko${AP}?rsat|qo${AP}?llab[-\\s]quvvatla|bil(?:adi(?!gan)|amiz|ishadi)`,
  neg: `(?<![a-zʻʼ])(?:emas|yo${AP}?q)(?![a-zʻʼ])|${UZ_NOT_VERB}`, translator: 'tarjimon',
});
const UZC_STAFF = uzbekStaff({
  letter: '[а-яёўқғҳ]', persian: 'форс(?:ий)?|дарий?|пушту|пашту|тожик', tillar: 'тиллар(?:имиз)?', zabon: 'забон', cha: 'ча', til: 'тил(?:и|ида|ини|да|ни|лари|ларида|ларини|ларда|ларни)', too: 'ҳам',
  staff: 'менежер|ходим|мутахассис|оператор|маслаҳатчи|жамоа', knowing: 'биладиган|билгувчи|тушунадиган',
  speak: 'гаплаш|сўзлаш|гапир|жавоб\\s+бер|мулоқот\\s+қил|маслаҳат\\s+бер|хизмат\\s+кўрсат|қўллаб[-\\s]қувватла|бил(?:ади(?!ган)|амиз|ишади)',
  neg: `(?<![а-яёўқғҳ])(?:эмас|йўқ)(?![а-яёўқғҳ])|${UZC_NOT_VERB}`, translator: 'таржимон',
});
const RU_PERSIAN = '(?:фарси|персидск[а-яё]+|дари|пушту|таджикск[а-яё]+)(?![а-яё])';
const RU_WHO = '(?:менеджер|сотрудник|специалист|оператор|консультант|команд|персонал)';
const RU_VERB_NOT = `(?<!${RU_B}(?:не|ни)\\s[а-яё]+)`; // right after the verb: «не говорят»
// «на узбекском, русском и фарси»: the languages before the Persian one
const RU_IN = `(?:на\\s+)?(?:[а-яё-]+(?:\\s*,\\s*|\\s*,?\\s+(?:и|или)\\s+)){0,4}(?:на\\s+)?(?:языке\\s+)?${RU_PERSIAN}`;
const RU_STAFF =
  '(?:' +
  // «Языки: узбекский, русский, фарси», «носитель фарси», «говорящий на дари менеджер», «переписку на фарси ведём сами», «дари — родной язык»
  `${RU_B}языки\\s*[:—–-]\\s*[^.!?;]{0,60}?${RU_B}${RU_PERSIAN}|${RU_B}носител[а-яё]+\\s+(?:языка\\s+)?${RU_PERSIAN}|${RU_B}говорящ[а-яё]+\\s+на\\s+(?:языке\\s+)?${RU_PERSIAN}|${RU_B}(?:переписк[а-яё]+|общение)\\s+на\\s+(?:языке\\s+)?${RU_PERSIAN}|${RU_B}${RU_PERSIAN}\\s*[—–-]\\s*родной|` +
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
const EN_PERSIAN = '(?:Persian|Farsi|Dari|Pashto|Pushto|Tajik)';
const EN_WHO = '(?:managers?|staff|team|specialists?|operators?|employees?|consultants?|agents?|representatives?|colleagues?)';
const EN_VERB_NOT = `(?<!\\b(?:not|no|never|cannot)\\s[a-z]+|n[’']t\\s[a-z]+)`; // right after the verb: "do not speak"
const EN_NOBODY = '(?<!\\b(?:nobody|no\\s?one|none|no|neither|nor)\\b[^.!?;:—–]{0,45})'; // right after the subject: "nobody on our team"
const EN_STAFF =
  '(?:' +
  // "Languages: Uzbek, Russian, Persian", "a native Farsi speaker", "talk to us in Dari", "we communicate in Dari", "we handle correspondence in Persian"
  `(?<!\\b(?:site|website|page)\\s)\\blanguages?(?:\\s+spoken)?\\s*[:—–-]\\s*[^.!?;]{0,60}?\\b${EN_PERSIAN}\\b|\\bnative\\s+${EN_PERSIAN}\\s+speakers?\\b|\\b(?:talk|speak)\\s+to\\s+us\\s+in\\s+${EN_PERSIAN}\\b` +
  `|\\b(?:${EN_WHO}|we)\\b${EN_NOBODY}[^.!?;]{0,60}?\\b(?:communicates?|talks?|corresponds?|correspondence)\\b${EN_VERB_NOT}[^.!?;]{0,40}?\\b${EN_PERSIAN}\\b|` +
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
const ZH_PERSIAN = '(?:波斯语|达里语|法尔西语|普什图语|塔吉克语)';
const ZH_WHO = '(?:客户经理|经理|员工|工作人员|团队|同事|客服|我们)';
const ZH_STAFF =
  '(?:' +
  // 语言：乌兹别克语、俄语、波斯语; 母语为波斯语的经理; 达里语…我们的经理听得懂; 波斯语函件由我们自行处理
  `(?<!网站|站点|页面)语言\\s?[:：]\\s?[^${ZH_STOP}]{0,40}?${ZH_PERSIAN}|母语(?:为|是)${ZH_PERSIAN}|${ZH_PERSIAN}[^${ZH_STOP}]{0,12}?(?:听得懂|能听懂)|${ZH_PERSIAN}[^${ZH_STOP}，,]{0,8}?(?:由我们|我们自行|我们自己)|` +
  `${ZH_WHO}[^${ZH_STOP}]{0,20}?(?:会说|会讲|可用|使用|通晓|精通|懂|讲)${zhNot(8)}[^${ZH_STOP}]{0,20}?${ZH_PERSIAN}` +
  // 用中文、俄语和波斯语回复
  `|(?:用|以)(?:[\\p{Script=Han}A-Za-z]{1,6}[、，,和及或与]){0,4}${ZH_PERSIAN}${zhNot(24)}(?:[、和及或与]${ZH_PERSIAN})?[^${ZH_STOP}，,]{0,4}?(?:回复|答复|沟通|交流|接待|服务|联系)` +
  // 波斯语客服, 会波斯语的客户经理 — not 没有波斯语客服
  `|${ZH_PERSIAN}${zhNot(12)}(?:客服|服务|支持|沟通|接待|咨询)(?![^${ZH_STOP}]{0,8}[不没无未])` +
  `|(?:会说?|会讲|懂|通晓|精通|讲)${ZH_PERSIAN}${zhNot(12)}(?:[、和及或与]${ZH_PERSIAN})?的${ZH_WHO}(?![^${ZH_STOP}]{0,8}[不没无未])` +
  `)(?<!翻译[^${ZH_STOP}]{0,60})(?![^${ZH_STOP}]{0,12}翻译)${ZH_ASKS}`;
const FA_NAME = '(?:فارسی|پارسی|دری|پشتو|تاجیکی)';
const FA_PERSIAN = `${FA_NAME}(?!\\p{Script=Arabic})`; // دری, not دریافت or دریایی
const FA_NOT_SOON = `(?![^${FA_STOP}؛;]{0,12}(?:نمی|ندار|نیست|نشد))`; // the verb that follows denies: پاسخ نمی‌دهیم, نداریم
const FA_STAFF =
  '(?:' +
  // «زبان‌ها: ازبکی، روسی، فارسی», «زبان مادری‌اش فارسی است», «به دری هم گفت‌وگو می‌کنیم», «مکاتبه به فارسی», «به دری حرف بزنید»
  `زبان[\\s\\p{Cf}]?ها\\s?[:：][^${FA_STOP}؛;]{0,60}?${FA_PERSIAN}|زبان\\sمادری[\\p{Script=Arabic}\\p{Cf}\\p{Mn}]*\\s${FA_PERSIAN}|${FA_PERSIAN}\\s(?:هم\\s)?(?:گفت[\\s\\p{Cf}]?و[\\s\\p{Cf}]?گو|حرف)\\s?${FA_MI}(?:کنیم|زنیم)|مکاتبه\\s(?:به\\s)?(?:زبان\\s)?${FA_PERSIAN}|به\\s${FA_PERSIAN}\\sحرف\\sبزنید|` +
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
const figure = (range, time, money) => `(?<![\\d.,+])(?:${NUM}(?:\\s?(?:[–—-]|${range})\\s?${NUM})?\\s?-?\\s?(?:${time}|${money})|[$€¥]\\s?\\d|${NUM}\\s?%)`;
const beside = (name, fig, stop) => `${name}[^${stop}]{0,60}?${fig}|${fig}[^${stop}]{0,60}?${name}`;
// "calendar" may stand between the number and the day, as "working" may: "10 calendar days", «10 kalendar kun»,
// «10 календарь кун» (the spelling of the generated Cyrillic twin), «10 календарных дней», 10 个日历日 / 10 个自然日 —
// the house vocabulary of the guides since 2026-11 (premerge review, 2026-11-13). Persian puts the adjective after
// the day («۱۰ روز تقویمی»), so روز was always read.
const UZ_FIGURE = figure('dan', '(?:(?:ish|kalendar)\\s+)?kun|sutka|hafta|soat', `\\$|USD|dollar|AQSH\\s+dollari|so${AP}?m|UZS|yuan|€|EUR`);
const UZC_FIGURE = figure('дан', '(?:(?:иш|календарь?)\\s+)?кун|сутка|ҳафта|соат', '\\$|USD|доллар|АҚШ\\s+доллари|сўм|UZS|юан|€|EUR');
const RU_FIGURE = figure('до', '(?:(?:рабоч|календарн)[а-яё]+\\s+)?(?:дн[еяй]|день|суток|сутки)|недел[ьюией]|час(?:а|ов)?(?![а-яё])', '\\$|USD|доллар|сум(?![а-яё])|сумов|UZS|юан|€|EUR|евро');
const EN_FIGURE = figure('to', '(?:working\\s+|business\\s+|calendar\\s+)?days?\\b|weeks?\\b|hours?\\b', '\\$|USD|US\\s?dollars?|dollars?\\b|UZS|soums?\\b|sums?\\b|yuan|CNY|€|EUR|euros?\\b');
// 日 only as a duration (3 日内送达), not the day of a date (11月12日); 周 is a week, not 周一 or 周末; 天, not 天津
const ZH_FIGURE = figure('至|到|~|～', '个?工作日|个?(?:日历|自然)日|天(?!津)|日(?=内|之内|左右|以内|可达|送达|到达|抵达|运抵)|周(?![一二三四五六日末年期边围])|个?星期|个?小时', '\\$|USD|美元|美金|元|人民币|苏姆|UZS|€|欧元');
const FA_FIGURE = figure('تا|الی', '(?:روزه?|هفته|ساعته?)(?!\\p{Script=Arabic})', '\\$|USD|دلار|سوم(?!\\p{Script=Arabic})|یوان|تومان|ریال|€|یورو');
const FIGURE_MSG = (lang) => `a number of days or a price beside Afghanistan, Hairatan or Mazar-i-Sharif (${lang}) — on this direction price and time are on request; the site's figures are China → Tashkent only (say so in a sentence of its own)`;
const mode = (o) => {
  const stop = o.stop ?? '.!?;';
  const after = o.after ?? 48; // the name is a stem: its ending and three or four words fit before the mode word
  return `(?:(?:${o.mode})[^${stop}]{0,30}?${o.name}(?![^${stop}]{0,30}(?:${o.truck}))|${o.name}[^${stop}]{0,${after}}?(?:${o.mode}))` +
    `(?<!(?:${o.no})[^${stop}]{0,90})(?![^${stop}]{0,40}(?:${o.no}|${o.asks}))`;
};
// Look-alikes kept out: goods that carry the word (air conditioners, воздушные фильтры, вагонка, 钢铁运输), «поездка» (a trip),
// "we train our drivers", «تریلی» (a trailer truck — it holds «ریلی») and «آب و هوایی» (the weather).
const EN_AIR_GOODS = '\\s*-?\\s*(?:condition|compress|purif|fry|filter|cool|dry|pump|mattress|bag|duct|curtain|gun|tool|freshener|quality)';
const UZ_MODE = mode({ name: AFGHAN[0], mode: `temir[\\s-]*yo${AP}?l|poyezd(?!ka)|vagon(?!ka)|avia|samolyot|uchoq|havo\\s+yo${AP}?l|havo\\s+(?:orqali|transporti)|aeroport|charter|(?<![a-zʻʼ])kema|dengiz|multimodal`, truck: 'fura|avto|yuk\\s+mashina', asks: '\\?',
  no: `${UZ_DENIED}|(?<![a-zʻʼ])(?:yo${AP}?q|emas)(?![a-zʻʼ])|(?<![a-zʻʼ])faqat\\s+fura` });
const UZC_MODE = mode({ name: AFGHAN[1], mode: 'темир[\\s-]*йўл|поезд(?!ка)|вагон(?!ка)|авиа|самолёт|учоқ|ҳаво\\s+йўл|ҳаво\\s+(?:орқали|транспорти)|аэропорт|чартер|(?<![а-яёўқғҳ])кема|денгиз|мултимодал', truck: 'фура|авто|юк\\s+машина', asks: '\\?',
  no: `${UZC_DENIED}|(?<![а-яёўқғҳ])(?:йўқ|эмас)(?![а-яёўқғҳ])|(?<![а-яёўқғҳ])фақат\\s+фура` });
const RU_MODE = mode({ name: AFGHAN[2], mode: 'железн[а-яё]+\\s+дорог|железнодорожн|ж/д|ж\\.-?\\s?д\\.|(?<![а-яё])жд(?![а-яё])|поезд(?!к)|вагон(?!к)|авиа|самол[её]т|воздушн[а-яё]+\\s+(?:транспорт|перевоз|сообщени|пут|достав|лини|судн|мост|коридор)|по\\s+воздуху|(?<![а-яё])борт(?:ом|ами)(?![а-яё])|чартер|(?<![а-яё])морем(?![а-яё])|морск[а-яё]+\\s+(?:перевоз|фрахт|путь|пут[её]м|доставк)|мультимодал|по\\s+рельсам', truck: 'фур|автомобил|автотранспорт', asks: '\\?',
  no: '(?<![а-яё])(?:не|нет|ни)(?![а-яё])|только\\s+фур' });
const EN_MODE = mode({ name: AFGHAN[3], mode: `\\brail(?:way|road|car|freight)?s?\\b|\\btrains?\\b(?!\\s+(?:our|their|its|your|all|new|drivers?|staff)\\b)|\\bwagons?\\b|\\bair\\b(?!${EN_AIR_GOODS})|\\bair(?:freight|craft|lift|planes?|lines?)\\b|\\bplanes?\\b|\\bflights?\\b|\\bfl(?:y|ies|ew|own|ying)\\b|\\bsea\\b|\\bocean\\b|\\bvessels?\\b|\\bmultimodal\\b|\\bintermodal\\b|\\bcharter\\b|\\bairports?\\b`, truck: '\\btrucks?\\b|\\blorr(?:y|ies)\\b', asks: '\\?',
  no: `\\b(?:not|no|never|without)\\b|n[’']t\\b|\\bonly\\s+by\\s+truck\\b|\\btruck\\s+only\\b` });
const ZH_MODE = mode({ name: AFGHAN[4], mode: '铁路|(?<!钢)铁运|火车|班列|专列|列车|车皮|空运|空派|航空|航班|飞机|直飞|飞往|海运|多式联运|包机|铁道|机场', truck: '汽运|卡车|货车|公路', stop: ZH_STOP, after: 30, asks: '吗|？|\\?',
  no: '[不没无未]|只走汽运|仅走汽运|只有汽运|仅限汽运' });
const FA_MODE = mode({ name: AFGHAN[5], mode: '(?<!ت)ریلی|(?<!\\p{Script=Arabic})ریل(?!\\p{Script=Arabic})|(?:راه|خط)[\\s\\p{Cf}]?آهن|قطار|واگن|(?<!آب[\\s\\p{Cf}]?و[\\s\\p{Cf}]?)هوایی|هواپیما|طیاره|دریایی|(?<!\\p{Script=Arabic})دریا(?!\\p{Script=Arabic})|کشتی|چندوجهی|پرواز|(?<!\\p{Script=Arabic})ترن(?!\\p{Script=Arabic})|فرودگاه|میدان\\sهوایی', truck: 'کامیون|تریلی|لاری|موتر', stop: `${FA_STOP}؛;`, asks: '؟',
  no: 'نمی|ندار|نیست|نشده|بدون|فقط\\sبا\\sکامیون' });
const MODE_MSG = (lang) => `offers rail, wagon or air carriage to Afghanistan (${lang}) — that direction is by truck only (a denial passes; a contrast goes into two sentences)`;

/*
 * 4. Three more things the Afghanistan direction never says (owner, 2026-11-11: the smallest lot is on request, the
 * direction is new, and GSR has no office or representative there; owner, 2026-11-12: its partners there are customs
 * agents (declarants) — §4a below). An audit of 2026-11-12 found that nothing stopped them. Block rules too; each
 * reads one sentence.
 *
 *   afghanVolume    a volume figure (m³, cubic metres) within 60 characters of Afghanistan, Hairatan or
 *                   Mazar-i-Sharif. The 1 m³ minimum is China → Tashkent's: say so in a sentence of its own.
 *   afghanPresence  an office, a branch, a representative, an employee, "our man", a terminal or a pick-up point IN
 *                   Afghanistan, Hairatan or Mazar-i-Sharif (always; also as "we have staff / a warehouse there",
 *                   «у нас есть склад», «omborimiz bor», 我们在…有仓库, «انبار داریم»), and partners, agents or brokers there — unless
 *                   the sentence names them as customs agents (declarants) and gives them nothing to do with the
 *                   cargo (§4a). A sentence that names the partner customs agents and has them receive, store,
 *                   deliver or hand over the cargo is stopped wherever the Afghan name stands in it.
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
const EN_NO = `\\b(?:not|never)\\b|\\bno\\b(?!\\s+(?:extra|additional|hidden|delays?|waiting|queues?|hassle|paperwork)\\b)|\\bwithout\\b(?!\\s+(?:delays?|waiting|extra|additional|hassle|queues?)\\b)|n[’']t\\b`;
const ZH_NO = '(?!(?:无需|不必|不用)(?:您|亲自|到|前往|跑|额外|另外|另行|付费|付款))[不没无未]';
const FA_NO = 'نمی|ندار|نیست|نشده|بدون(?!\\s(?:معطلی|تأخیر|تاخیر|دردسر|هزینه))';
/*
 * 4a. GSR's partners on the Afghan side (owner, 2026-11-12, FACTS §12.1: «partnerlar bor deklarant agentlar»): customs
 * on the Afghan side is cleared by GSR's PARTNERS, who are customs agents (declarants). A sentence may say so when it
 * names them AS such — a partner word AND a customs-agent / declarant word in the same sentence, either order, within
 * about 40 characters of each other (row 82: "On the Afghan side, customs clearance is done by our partners — customs agents
 * (declarants)."). afghanPresence and afghanCustoms let that sentence through, unless the same sentence also
 *   · has the cargo handled — received, taken or handed over, delivered, stored, unloaded, collected, picked up or met:
 *     the partners are customs agents only, never "our partners receive / store / hand over the cargo";
 *   · says "ourselves", or names GSR's own customs broker (he files the transit declaration in Uzbekistan): the two
 *     sides of the border go into two sentences;
 *   · names the consignee (the consignee's agent is not confirmed);
 *   · says who pays the Afghan duties, or that they are included — DDP, "duties included", «boj va soliq … narxga
 *     kiradi», «пошлины включены», 包税 / 含关税, «عوارض گمرکی در قیمت»: who pays them is not confirmed.
 * Never let through, partners or not: an office, a branch, a representative, an employee, staff, "our man", a warehouse,
 * a depot, a terminal or a pick-up point in Afghanistan (afghanPresence), and an Incoterm or a payment of the duties
 * (afghanCustoms). And a sentence that names the partner customs agents together with one of the words above is stopped
 * wherever in it the Afghan name stands — an apposition («— customs agents (declarants) —») is longer than the 40
 * characters the families read around the name. (The partners' names are never printed either, FACTS §12.1; no rule
 * can know them.)
 * A sentence ends at . ! ? ; (zh 。！？；, fa ؟ ؛ as well) — never at a comma or a dash.
 */
/** The partner customs agents in one sentence: a partner word and an agent word, either order, at most 40 characters apart. */
const partnerAgents = (o) => `(?:(?:${o.partner})[^${o.stop}]{0,40}?(?:${o.agent})|(?:${o.agent})[^${o.stop}]{0,40}?(?:${o.partner}))`;
/**
 * The start of the sentence that holds the current position, inside a look-behind: a look-behind is matched right to
 * left, so `(?<=^|[stop])` — written last, read first — keeps the look-aheads before it from being tried at every
 * other position of the sentence while `[^stop]*` gives characters back.
 */
const sentenceStart = (stop) => `(?<=^|[${stop}])[^${stop}]*`;
/**
 * Written right after a hit: the hit is let through when the sentence that holds it — from the sentence end before it
 * to the next one — names the partner customs agents and none of the words that cancel the exemption (`o.cancel`).
 */
const partnersOk = (o) => `(?<!(?=[^${o.stop}]*?${partnerAgents(o)})(?![^${o.stop}]*?(?:${o.cancel}))${sentenceStart(o.stop)})`;
/**
 * One sentence that names the Afghan side, the partner customs agents and one of `words`, at any distance — unless it
 * denies or asks. The match starts at the Afghan name (rare: the sentence is read only where one stands) and runs to
 * the end of the sentence. A denial counts only within 25 characters of the word (guard verification, 2026-11-13):
 * "they do not receive the cargo" is one, "… receive the cargo with no extra paperwork" is not.
 */
const partnerSentence = (o, words, asks = o.asks) => `(?:${o.name})(?<=(?=[^${o.stop}]*?${partnerAgents(o)})(?=[^${o.stop}]*?(?<!(?:${o.no})[^${o.stop}]{0,25})(?![^${o.stop}]{0,25}?(?:${o.no}))(?:${words}))(?![^${o.stop}]*?(?:${asks}))${sentenceStart(o.stop)})[^${o.stop}]*`;
/**
 * The words that cancel the exemption, in one expression: the cargo handled (`handling` — received, handed over,
 * delivered, stored, unloaded, collected, met; also carried, escorted, "everything else"), "ourselves" or GSR's own
 * broker, the consignee, and who pays the duties (`incl`). `afghanDuties` is the Afghan duties named as included or paid
 * in so many words («Afgʻoniston boji narxga kiradi», "the price includes the Afghan duties") — a claim of its own,
 * however far from a place name.
 */
const partnerWords = (o) => ({ ...o, cancel: [o.handling, o.ourselves, o.consignee, o.incl].join('|') });
// Duties paid or included (never let through, §4a). Not «bojxona toʻlovlari taʼminoti», «обеспечение уплаты таможенных
// платежей», 海关税费担保, «تضمین پرداخت‌های گمرکی»: the security for customs payments of a transit is GSR's service in Uzbekistan.
const UZ_INCL = `(?<![a-z])DDP(?![a-z])|(?<![a-zʻʼ])boj\\s+va\\s+soliq(?![a-zʻʼ]*siz)|(?<![a-zʻʼ])(?:boj(?:lar)?|soliq(?:lar)?|yig${AP}?im(?:lar)?)(?:i|ni|ini|lari|larini|ning)?\\s+(?:ham\\s+)?(?:to${AP}?la|narx)|(?<![a-zʻʼ])bojxona\\s+to${AP}?lov[a-zʻʼ]*\\s+(?:ham\\s+)?to${AP}?la|(?<![a-zʻʼ])(?:boj|soliq|to${AP}?lov|yig${AP}?im)[a-zʻʼ]*[^.!?;]{0,30}?narx(?:i|ga|imiz(?:ga)?|ingiz(?:ga)?)?\\s+(?:ham\\s+)?(?:ichida|kir|qo${AP}?sh)|(?<![a-zʻʼ])(?:boj|soliq)(?:lar)?(?:ni|ini|larni)?\\s+(?:siz|biz|mijoz|hamkor|importyor|yuk\\s+oluvchi)[a-zʻʼ]*\\s+(?:o${AP}?zi\\s+)?to${AP}?la|(?<![a-zʻʼ])eshikdan\\s+eshikka|(?<![a-zʻʼ])(?:hisobimizdan|(?:mijoz|importyor|yuk\\s+oluvchi)(?:ning)?\\s+hisobidan|o${AP}?z\\s+hisobingizdan|qo${AP}?shimcha\\s+to${AP}?lovsiz)(?![a-zʻʼ])|(?<![a-zʻʼ])narx(?:i|ga|imiz(?:ga)?|ingiz(?:ga)?)\\s+(?:ham\\s+)?(?:kiradi|kiritilgan|qo${AP}?shilgan)`;
const UZC_INCL = '(?<![a-zа-яёўқғҳ])(?:DDP|ДДП)(?![a-zа-яёўқғҳ])|(?<![а-яёўқғҳ])бож\\s+ва\\s+солиқ(?![а-яёўқғҳ]*сиз)|(?<![а-яёўқғҳ])(?:бож(?:лар)?|солиқ(?:лар)?|йиғим(?:лар)?)(?:и|ни|ини|лари|ларини|нинг)?\\s+(?:ҳам\\s+)?(?:тўла|нарх)|(?<![а-яёўқғҳ])божхона\\s+тўлов[а-яёўқғҳ]*\\s+(?:ҳам\\s+)?тўла|(?<![а-яёўқғҳ])(?:бож|солиқ|тўлов|йиғим)[а-яёўқғҳ]*[^.!?;]{0,30}?нарх(?:и|га|имиз(?:га)?|ингиз(?:га)?)?\\s+(?:ҳам\\s+)?(?:ичида|кир|қўш)|(?<![а-яёўқғҳ])(?:бож|солиқ)(?:лар)?(?:ни|ини|ларни)?\\s+(?:сиз|биз|мижоз|ҳамкор|импорт[её]р|юк\\s+олувчи)[а-яёўқғҳ]*\\s+(?:ўзи\\s+)?тўла|(?<![а-яёўқғҳ])эшикдан\\s+эшикка|(?<![а-яёўқғҳ])(?:ҳисобимиздан|(?:мижоз|импорт[её]р|юк\\s+олувчи)(?:нинг)?\\s+ҳисобидан|ўз\\s+ҳисобингиздан|қўшимча\\s+тўловсиз)(?![а-яёўқғҳ])|(?<![а-яёўқғҳ])нарх(?:и|га|имиз(?:га)?|ингиз(?:га)?)\\s+(?:ҳам\\s+)?(?:киради|киритилган|қўшилган)';
const RU_INCL = '(?<![a-z])DDP(?![a-z])|пошлин[а-яё]*\\s+(?:и\\s+налог[а-яё]*\\s+)?(?:уже\\s+)?(?:включен|оплачен|входят|учт[её]н)|(?<!(?:обеспечени|гаранти)[а-яё]*\\s)(?<!без\\s)(?<![а-яё])(?:оплат|уплат|оплач|уплач|заплат|плат(?:ят|ит|им|ить))[а-яё]*\\s+(?:[а-яё]+\\s+){0,2}?(?:таможенн[а-яё]*\\s+)?(?:пошлин|налог|платеж|сбор)|в\\s+(?:цену|стоимость)\\s+(?:[а-яё]+\\s+){0,2}?(?:пошлин|налог)|(?<![а-яё])(?:пошлин|налог)[а-яё]*[^.!?;]{0,25}?в\\s+(?:цен|стоимост)|(?<![а-яё])под\\s+ключ|(?<![а-яё])(?:включа|включ[её]н|с\\s+уч[её]том)[а-яё]*\\s+(?:[а-яё]+\\s+){0,2}?(?:пошлин|налог)|(?<![а-яё])(?:пошлин|налог)[а-яё]*\\s+(?:[а-яё]+\\s+)?(?:оплачива|плат[яи]т|уплачива|заплат)[а-яё]*|(?:от\\s+двери\\s+до\\s+двери|дверь[\\s-]+в[\\s-]+дверь)[^.!?;]{0,60}?(?:таможн|растамож)|(?<![а-яё])за\\s+(?:наш|ваш|св[оа]й)[а-яё]*\\s+сч[её]т|(?<![а-яё])за\\s+сч[её]т\\s+(?:клиент|получател|покупател|импорт[её]р|заказчик)|(?<![а-яё])без\\s+(?:доплат|дополнительн[а-яё]*\\s+(?:оплат|плат))|(?<![а-яё])(?:входит|входят|включен[а-яё]*)\\s+в\\s+(?:цену|стоимость|тариф)';
const EN_INCL = '\\bDDP\\b|\\bduty[\\s-]paid\\b|\\b(?:customs\\s+)?(?:duties|duty|taxes)\\b(?:\\s+and\\s+taxes)?\\s+(?:are\\s+|is\\s+|were\\s+)?(?:already\\s+)?(?:included|paid|covered|prepaid)\\b|\\b(?:duties|duty|taxes)\\b[^.!?;]{0,25}?\\b(?:included|in\\s+the\\s+(?:price|rate|quote))\\b|\\b(?:pay|pays|paid|paying|cover|covers|covered|covering)\\s+(?:for\\s+)?(?:(?:the|all|your|any)\\s+){0,2}(?:Afghan\\s+)?(?:customs\\s+)?(?:duties|duty|taxes|fees|charges)\\b|\\bdoor[\\s-]to[\\s-]door\\b[^.!?;]{0,60}?\\b(?:customs|clearance)\\b|\\b(?:customs|clearance)\\b[^.!?;]{0,60}?\\bdoor[\\s-]to[\\s-]door\\b|\\ball[\\s-]inclusive\\b|\\bclearance\\s+(?:is\\s+)?included\\b|\\binclud(?:e|es|ed|ing)\\s+(?:(?:the|all|any)\\s+)?(?:Afghan\\s+)?(?:customs\\s+)?(?:import\\s+)?(?:duties|duty|taxes)\\b|\\b(?:take|takes|taking|took)\\s+care\\s+of\\s+(?:(?:the|all|your|any)\\s+){0,2}(?:Afghan\\s+)?(?:customs\\s+)?(?:duties|duty|taxes)\\b|\\b(?:duties|duty|taxes)\\b[^.!?;]{0,40}?\\b(?:responsibility|paid\\s+by|borne\\s+by|one\\s+price|on\\s+us)\\b|\\bat\\s+(?:our|your|the\\s+(?:client|importer|buyer|consignee)[’\']s)\\s+(?:own\\s+)?(?:expense|cost)\\b|\\bat\\s+no\\s+(?:extra\\s+|additional\\s+)?(?:charge|cost)\\b|\\bfree\\s+of\\s+charge\\b|\\bincluded\\s+in\\s+(?:the|our|your)\\s+(?:price|rate|quote|freight)\\b';
const ZH_INCL = `含关?税|包税|双清|DDP|(?:关税|税费|进口税|税款)[^${ZH_STOP}]{0,8}?(?:已含|包含在|含在|全包|包干|由(?:我们|我方|合作伙伴|合作方|客户|收货人|进口商|您)(?:自行|自己)?(?:承担|支付|缴纳|负担|自付|付))|(?:代缴|代付|代垫|缴纳|支付|承担|垫付|负担|包括|包含)(?:阿富汗的?)?(?:关税|税费|进口税|税款|规费|手续费)|门到门(?:清关|含税|包税)|包清关|含清关|清关由我们(?:负责|办理|代办)|由我们(?:负责|办理|代办)清关|承担(?:全部|所有|相关)?费用|(?:清关|报关)?费用[^${ZH_STOP}]{0,6}?(?:已含|已包含|包含在|含在)|(?:无需|不用|不必)(?:额外|另外|另行)(?:付费|付款|收费|支付)|不另(?:外)?收费`;
const FA_INCL = `DDP|عوارض\\sگمرکی\\sدر\\sقیمت|(?<!\\p{Script=Arabic})(?:حقوق|عوارض|مالیات|هزینه(?:\\p{Mn}|[\\s\\p{Cf}]?(?:ی|های|ها))?\\sگمرکی)(?!\\p{Script=Arabic})[^${FA_STOP}؛;]{0,25}?(?:در\\s(?:قیمت|نرخ|هزینه)|شامل|${FA_MI}پرداز|پرداخت\\s?(?:${FA_MI}(?:کنیم|کنند|کند|شود)|شده)|بر\\sعهده)|(?<!\\p{Script=Arabic})(?:پرداخت|تسویه)\\s(?:حقوق|عوارض|مالیات)|شامل\\s(?:[\\p{Script=Arabic}\\p{Cf}]+\\s){0,2}?(?:حقوق|عوارض)|درب\\sبه\\sدرب|(?:همراه\\s)?با\\sترخیص(?:\\sگمرکی)?\\sو\\s(?:عوارض|حقوق)|همراه\\sبا\\sترخیص|(?<!\\p{Script=Arabic})هزینه(?:[\\s\\p{Cf}]?(?:اش|ها|های))?\\sبا\\s(?:ما|شما|مشتری)|بدون\\sهزینه`;
// The partner customs agents and what cancels the exemption, per language. «hujjatlarni topshiradi» (hands in the
// documents), «передают документы», "receive your documents" are a customs agent's work, not cargo handling.
const UZ_DOCS = `(?:hujjat|deklaratsiya|ariza|ma${AP}?lumot|invoys)[a-zʻʼ]*\\s+(?:[a-zʻʼ]+\\s+){0,2}`;
const UZ_PARTNERS = partnerWords({
  stop: '.!?;', name: AFGHAN[0], no: UZ_NO, asks: '\\?',
  partner: '(?<![a-zʻʼ])(?:hamkor|partn(?:y?o|e)r)', agent: '(?<![a-zʻʼ])(?:deklarant|bojxona\\s+(?:agent|broker))',
  handling: `(?<![a-zʻʼ])(?<!${UZ_DOCS})(?:qabul\\s+qil|topshir|yubor|uzat)|(?<![a-zʻʼ])(?:yetkaz|saqla|tushir|kutib\\s+ol|olib\\s+(?:ket|bor|kel)|(?:qayta\\s+)?yukla(?!r)|ombor)` +
    `|(?<![a-zʻʼ])yuk(?:ni|ingizni|lar(?:ni)?|laringizni)\\s+(?:[a-zʻʼ]+\\s+){0,3}?(?:tashi|jo${AP}?nat|(?<!ib\\s)ber)|(?<![a-zʻʼ])fura(?:ni|lar(?:ni)?)\\s+(?:[a-zʻʼ]+\\s+){0,3}?kuzatib` +
    '|(?<![a-zʻʼ])(?:hammasini|barchasini|qolganini|(?:qolgan|boshqa|hamma|barcha)\\s+ishlar)|(?<![a-zʻʼ])ort(?:adi|amiz|iladi|ilgan|ishadi|ish)(?![a-zʻʼ])',
  ourselves: `(?<![a-zʻʼ])(?:o${AP}?zimiz|o${AP}?z\\s+kuchimiz|o${AP}?z\\s+(?:bojxona\\s+)?(?:broker|agent|deklarant)|bojxona\\s+brokerimiz|(?<!${UZ_DOCS})rasmiylashtiramiz(?![a-zʻʼ]))`,
  consignee: '(?<![a-zʻʼ])(?:(?:yuk\\s+)?oluvchi|(?:importyor|xaridor|mijoz)(?:ning|ingiz)\\s+(?:bojxona\\s+)?(?:agent|broker|deklarant))|(?<![a-zʻʼ])siz(?:ning)?\\s+(?:tanla|bojxona\\s+(?:agent|broker)|deklarant)', incl: UZ_INCL,
  afghanDuties: `(?<![a-zʻʼ])Afg${AP}?oniston(?:dagi|\\s+tomonidagi)?\\s+(?:bojxona\\s+)?(?:boj|soliq)[a-zʻʼ]*[^.!?;]{0,40}?(?:narx[a-zʻʼ]*\\s+(?:ichida|ga\\s+kir|ga\\s+qo${AP}?sh)|to${AP}?la|kiradi)`,
});
const UZC_DOCS = '(?:ҳужжат|декларация|ариза|маълумот|инвойс)[а-яёўқғҳ]*\\s+(?:[а-яёўқғҳ]+\\s+){0,2}';
const UZC_PARTNERS = partnerWords({
  stop: '.!?;', name: AFGHAN[1], no: UZC_NO, asks: '\\?',
  partner: '(?<![а-яёўқғҳ])(?:ҳамкор|партн[её]р)', agent: '(?<![а-яёўқғҳ])(?:декларант|божхона\\s+(?:агент|брокер))',
  handling: `(?<![а-яёўқғҳ])(?<!${UZC_DOCS})(?:қабул\\s+қил|топшир|юбор|узат)|(?<![а-яёўқғҳ])(?:етказ|сақла|тушир|кутиб\\s+ол|олиб\\s+(?:кет|бор|кел)|(?:қайта\\s+)?юкла(?!р)|омбор)` +
    '|(?<![а-яёўқғҳ])юк(?:ни|ингизни|лар(?:ни)?|ларингизни)\\s+(?:[а-яёўқғҳ]+\\s+){0,3}?(?:таши|жўнат|(?<!иб\\s)бер)|(?<![а-яёўқғҳ])фура(?:ни|лар(?:ни)?)\\s+(?:[а-яёўқғҳ]+\\s+){0,3}?кузатиб' +
    '|(?<![а-яёўқғҳ])(?:ҳаммасини|барчасини|қолганини|(?:қолган|бошқа|ҳамма|барча)\\s+ишлар)|(?<![а-яёўқғҳ])орт(?:ади|амиз|илади|илган|ишади|иш)(?![а-яёўқғҳ])',
  ourselves: '(?<![а-яёўқғҳ])(?:ўзимиз|ўз\\s+кучимиз|ўз\\s+(?:божхона\\s+)?(?:брокер|агент|декларант)|божхона\\s+брокеримиз|(?<!(?:ҳужжат|декларация|ариза|маълумот|инвойс)[а-яёўқғҳ]*\\s+(?:[а-яёўқғҳ]+\\s+){0,2})расмийлаштирамиз(?![а-яёўқғҳ]))',
  consignee: '(?<![а-яёўқғҳ])(?:(?:юк\\s+)?олувчи|(?:импорт[её]р|харидор|мижоз)(?:нинг|ингиз)\\s+(?:божхона\\s+)?(?:агент|брокер|декларант))|(?<![а-яёўқғҳ])сиз(?:нинг)?\\s+(?:танла|божхона\\s+(?:агент|брокер)|декларант)', incl: UZC_INCL,
  afghanDuties: '(?<![а-яёўқғҳ])Афғонистон(?:даги|\\s+томонидаги)?\\s+(?:божхона\\s+)?(?:бож|солиқ)[а-яёўқғҳ]*[^.!?;]{0,40}?(?:нарх[а-яёўқғҳ]*\\s+(?:ичида|га\\s+кир|га\\s+қўш)|тўла|киради)',
});
const RU_PARTNERS = partnerWords({
  stop: '.!?;', name: AFGHAN[2], no: RU_NO, asks: '\\?',
  partner: '(?<![а-яё])партн[её]р', agent: '(?<![а-яё])(?:таможенн[а-яё]*\\s+(?:агент|брокер|представител)|декларант|агент[а-яё]*\\s+по\\s+таможенн)',
  handling: '(?<![а-яё])(?:приним|прим[уеё]т|приня|переда|достав|выгру[жз]|встре[тч]|выда[ёеюв]|выдач|забира|забер[уеёя]|отгру[жз]|погру[жз]|перегру[жз]|складир)[а-яё]*(?![а-яё])(?!\\s+(?:[а-яё]+\\s+)?(?:документ|деклараци|бумаг|сведени|инвойс))|хран|(?<![а-яё])склад|(?<![а-яё])получ(?:а[а-яё]*|ат|ит|ил[а-яё]*)\\s+(?:[а-яё]+\\s+){0,2}?груз' +
    '|(?<![а-яё])(?:везут|везёт|везет|возят|возит|довоз[а-яё]*|перевоз(?:ят|ит|или|ил)|отвоз[а-яё]*|сопровожд[а-яё]*|сопроводят)(?![а-яё])' +
    '|(?<![а-яё])(?:вс[её]\\s+остальн[а-яё]*|вс[её]\\s+за\\s+вас|все\\s+вопросы)' +
    '|(?<![а-яё])(?:отда|вруч|отправля|отправ[ия]т|довез|отвез|перевез|привез)[а-яё]*(?![а-яё])(?!\\s+(?:[а-яё]+\\s+)?(?:документ|деклараци|бумаг|сведени|инвойс))|(?<![а-яё])получ(?:а[а-яё]*|ат|ит|ил[а-яё]*)\\s+(?:[а-яё]+\\s+){0,2}?товар|(?<![а-яё])дальнейш[а-яё]*\\s+(?:перевозк|доставк|отправк)',
  ourselves: '(?<![а-яё])(?:сами|самостоятельно)(?![а-яё])|(?:своими|собственными)\\s+силами|(?<![а-яё])(?:собственн|сво|наш)[а-яё]*\\s+(?:собственн[а-яё]*\\s+)?(?:таможенн[а-яё]*\\s+)?брокер|(?<![а-яё])(?:растаможиваем|растаможим)(?![а-яё])|(?:таможенн[а-яё]*\\s+(?:оформлени|очистк|формальност)[а-яё]*|растаможк[а-яё]*)[^.!?;]{0,30}?(?<![а-яё])(?:(?:оформля|провод|выполня|осуществля|организу)ем|(?:оформ|провод|провед|организу)им)(?![а-яё])|(?<![а-яё])(?:оформля|провод|выполня|осуществля|организу)ем\\s+(?:[а-яё]+\\s+){0,2}?(?:таможенн|растаможк)|(?<![а-яё])(?:оформ|провод|провед|организу)им\\s+(?:[а-яё]+\\s+){0,2}?(?:таможенн|растаможк)|(?<![а-яё])бер[её]м\\s+на\\s+себя|(?<![а-яё])(?:собственн|сво)[а-яё]*\\s+(?:таможенн[а-яё]*\\s+)?(?:агент|декларант)',
  consignee: 'получател|(?:агент|брокер|декларант|представител)[а-яё]*\\s+(?:[а-яё]+\\s+)?(?:импорт[её]р|покупател)|(?<![а-яё])ваш[а-яё]*\\s+(?:собственн[а-яё]*\\s+)?(?:таможенн[а-яё]*\\s+)?(?:агент|брокер|декларант)|(?:агент|брокер|декларант)[а-яё]*\\s+(?:клиент|заказчик)|(?<![а-яё])(?:выбер|выбира|назнач)[а-яё]*\\s+вы(?![а-яё])|(?<![а-яё])вы\\s+(?:выбер|выбира|назнач)', incl: RU_INCL,
  afghanDuties: '(?<![а-яё])афганск[а-яё]+\\s+(?:таможенн[а-яё]+\\s+)?(?:пошлин|налог)[а-яё]*[^.!?;]{0,40}?(?:включен|оплач|входят|учт[её]н|в\\s+цен|в\\s+стоимост)|(?<![а-яё])(?:включа[а-яё]*|включен[а-яё]*|оплачива[а-яё]+|оплатим|платим|уплачива[а-яё]+|входят)\\s+(?:[а-яё]+\\s+){0,2}?афганск[а-яё]+\\s+(?:таможенн[а-яё]+\\s+)?(?:пошлин|налог)|(?<![а-яё])(?:пошлин|налог)[а-яё]*\\s+(?:в\\s+)?Афганистан[ае]?(?![а-яё])[^.!?;]{0,40}?(?:включен|оплач|входят|в\\s+цен|в\\s+стоимост)',
});
const EN_PARTNERS = partnerWords({
  stop: '.!?;', name: AFGHAN[3], no: EN_NO, asks: '\\?',
  partner: '\\bpartner', agent: '\\b(?:customs[\\s-]+(?:clearing[\\s-]+|clearance[\\s-]+)?(?:agents?|brokers?)|declarants?|clearing[\\s-]+agents?)\\b',
  handling: `\\b(?:receiv(?:e|es|ed|ing)|accept(?:s|ed|ing)?|(?:take|takes|taking|took|taken)\\s+(?:[a-z’']+\\s+){0,3}?over|hand(?:s|ed|ing)?\\s+(?:[a-z’']+\\s+){0,3}?over|handover|deliver(?:s|ed|ing|y|ies)?|stor(?:e|es|ed|ing|age)|warehous(?:e|es|ed|ing)|(?:un|re)?load(?:s|ed|ing)?|collect(?:s|ed|ing|ion)?|pick(?:s|ed|ing)?[\\s-]+(?:[a-z’']+\\s+){0,3}?up|meet(?:s|ing)?|met|releas(?:e|es|ed|ing))\\b(?!\\s+(?:the\\s+|your\\s+|all\\s+|its\\s+|their\\s+)?(?:documents?|papers?|paperwork|declarations?|invoices?|packing\\s+lists?)\\b)` +
    '|\\b(?:take|takes|taking|took|taken|transport(?:s|ed|ing)?|carr(?:y|ies|ied|ying)|bring(?:s|ing)?|brought|haul(?:s|ed|ing)?|mov(?:e|es|ed|ing)|forward(?:s|ed|ing)?|ship(?:s|ped|ping)?|escort(?:s|ed|ing)?|accompan(?:y|ies|ied|ying))\\s+(?:the\\s+|your\\s+|all\\s+|this\\s+|their\\s+)?(?:cargo|goods|shipments?|consignments?|loads?|trucks?|lorr(?:y|ies))\\b' +
    '|\\b(?:take|takes|taking|took|taken|bring|brings|bringing|brought|carr(?:y|ies|ied|ying))\\s+(?:it|them)\\s+(?:on\\s+)?to\\b|\\blook(?:s|ed|ing)?\\s+after\\s+(?:the\\s+|your\\s+)?(?:cargo|goods|trucks?)\\b|\\b(?:onward\\s+)?(?:trucking|transportation|haulage)\\b' +
    '|\\b(?:everything|(?:all\\s+)?the\\s+rest(?!\\s+of\\b)|all\\s+else|anything\\s+else)\\b' +
    '|\\b(?:give|gives|giving|gave|given|pass(?:es|ed|ing)?|send(?:s|ing)?|sent|keep(?:s|ing)?|kept|hold(?:s|ing)?|held|dispatch(?:es|ed|ing)?|hand(?:s|ed|ing)?)\\s+(?:(?:you|it|them)\\s+)?(?:the\\s+|your\\s+|all\\s+|this\\s+|their\\s+)?(?:cargo|goods|shipments?|consignments?|loads?|trucks?)\\b|\\b(?:take|takes|taking|took)\\s+care\\s+of\\s+(?:the\\s+|your\\s+)?(?:cargo|goods|shipments?|trucks?)\\b|\\b(?:terminals?|depots?|yards?)\\b|\\bhanded\\s+(?:to|over)\\b|\\bonward\\s+(?:trucks?|carriage|delivery|transport)\\b',
  ourselves: '\\b(?:ourselves|on\\s+our\\s+own|in-house)\\b|\\bour\\s+own\\s+(?:customs\\s+)?(?:brokers?|agents?|declarants?|staff|people|team|specialists?|employees?)\\b|\\bour\\s+customs\\s+brokers?\\b|\\bwe\\s+(?:(?:also|then|can|will|now)\\s+)?(?:clear(?!\\s+(?:the\\s+|your\\s+)?(?:documents?|papers?|paperwork)\\b)|(?:handle|arrange|manage|do|organi[sz]e|process|take\\s+care\\s+of)\\s+(?:(?:the|all|any)\\s+)?(?:Afghan\\s+)?(?:customs|clearance|formalities))\\b',
  consignee: '\\b(?:consignees?|recipients?|receivers?|buyers?)\\b|\\bimporter[’\']?s?[’\']?\\s+(?:own\\s+)?(?:customs\\s+)?(?:agents?|brokers?|declarants?)\\b|\\b(?:agents?|brokers?|declarants?)\\s+(?:of|for)\\s+the\\s+importer\\b|\\byour\\s+(?:own\\s+)?(?:customs\\s+)?(?:agents?|brokers?|declarants?)\\b|\\b(?:you|the\\s+client)\\s+(?:choose|chooses|chose|select|selects|pick|picks|appoint|appoints|hire|hires)\\b', incl: EN_INCL,
  afghanDuties: '\\bAfghan\\s+(?:import\\s+)?(?:customs\\s+)?(?:duties|duty|taxes)\\b[^.!?;]{0,40}?\\b(?:included|paid|covered|prepaid|in\\s+the\\s+(?:price|rate|quote))\\b|\\b(?:includes?|including|included|covers?|covering|pay|pays|paid|paying|takes?\\s+care\\s+of|took\\s+care\\s+of|taking\\s+care\\s+of)\\s+(?:for\\s+)?(?:(?:the|all|any)\\s+){0,2}Afghan\\s+(?:import\\s+)?(?:customs\\s+)?(?:duties|duty|taxes)\\b|\\b(?:duties|duty|taxes)\\s+(?:in|of)\\s+Afghanistan\\b[^.!?;]{0,40}?\\b(?:included|paid|covered|in\\s+the\\s+(?:price|rate|quote)|responsibility|borne\\s+by)\\b',
});
const ZH_PARTNERS = partnerWords({
  stop: ZH_STOP, name: AFGHAN[4], no: ZH_NO, asks: '吗|？|\\?',
  partner: '合作伙伴|合作方|合作的|伙伴', agent: '报关代理|报关企业|报关行|报关员|申报人|清关代理',
  handling: '接货|交货|提货|送货|仓储|仓库|卸货|交接|收货|存放|保管|装卸|派送|配送|交付|移交|转交|送至|送到|送达|代收|(?:将|把)(?:您的)?货物?(?:运|送|转|带|交)|运送货物|运输货物|承运货物|押运|护送|一切|其余|全部手续|所有手续|货物?交给|交给(?:您|客户|收货人)|(?<!塔什干[^。！？!?；;，,]{0,4})(?:转运|中转)|领取|取货|存储|储存|暂存|装(?:上|车|到|载)|堆场|货场',
  ourselves: '自己|自行|亲自|自有|我们(?:借助|通过|依靠|会同|联合)[^。！？!?；;，,]{0,8}?(?:合作伙伴|合作方|伙伴|报关代理|申报人)|我们的报关(?:行|员)|我方报关(?:行|员)', consignee: '收件人|买方|买家|(?:进口商|客户|您)(?:自己)?的(?:报关代理|报关行|报关员|申报人|代理)|您(?:选择|指定|委托)的', incl: ZH_INCL,
  afghanDuties: `阿富汗(?:的)?(?:进口)?(?:关税|税费|进口税)[^${ZH_STOP}]{0,10}?(?:已含|包含|含在|全包|包干|已付|由(?:我们|我方|合作伙伴|合作方|客户|收货人|您)(?:承担|支付|缴纳|负担))|(?:包含|包括|含|代缴|代付|代垫|缴纳|支付|承担|垫付|负担)阿富汗(?:的)?(?:进口)?(?:关税|税费|进口税)`,
});
const FA_PARTNERS = partnerWords({
  stop: `${FA_STOP}؛;`, name: AFGHAN[5], no: FA_NO, asks: '؟',
  partner: '(?<!\\p{Script=Arabic})(?:شریک|شرکا|همکار)', agent: '(?<!\\p{Script=Arabic})(?:کارگزار|اظهار[\\s\\p{Cf}]?کنند(?:ه|گان)|حق[\\s\\p{Cf}]?العمل[\\s\\p{Cf}]?کار|نمایند(?:ه(?:\\p{Mn}|\\p{Cf}?ی)?|ۀ|گان)\\sگمرکی)',
  handling: 'تحویل|نگهداری|تخلیه|(?<!اطلاع[\\s\\p{Cf}]?)رسان|انبار|گدام|بارگیری|بارگذاری|(?<!(?:اسناد|مدارک|سند|اظهارنامه)(?:\\s(?:را|شما|بار|کالا|محموله))*\\s)(?:دریافت|ارسال)(?!\\s(?:اسناد|مدارک|سند|اظهارنامه))|سپار|سپرد|نگه[\\s\\p{Cf}]?(?:می[\\s\\p{Cf}]?)?دار|منتقل|ذخیره' +
    `|(?<!\\p{Script=Arabic})بار(?!\\p{Script=Arabic})(?:\\s(?:شما|را))*\\s(?:[^\\s${FA_STOP}؛;]+\\s){0,5}?(?:${FA_MI}(?:برند|برد|آورند|آورد)|حمل\\s?${FA_MI}(?:کنند|کند))|(?:کامیون|موتر)[^${FA_STOP}؛;]{0,20}?همراهی` +
    '|همه[\\s\\p{Cf}]?چیز|(?:همهٔ|همه‌ی|بقیهٔ|بقیه‌ی|سایر)\\sکارها' + `|ترمینال|(?<!\\p{Script=Arabic})بار\\s${FA_MI}زن`,
  ourselves: `خودمان|(?<!\\p{Script=Arabic})خود\\sما(?!\\p{Script=Arabic})|ترخیص\\s?${FA_MI}کنیم|ترخیص[^${FA_STOP}؛;،]{0,120}?انجام\\s?${FA_MI}دهیم|(?<!\\p{Script=Arabic})کارگزار(?:\\p{Mn}|ی)?\\sگمرکی(?:\\p{Mn}|ی)?\\sما(?!\\p{Script=Arabic})`, consignee: 'گیرنده|خریدار|(?:کارگزار|اظهار[\\s\\p{Cf}]?کننده)(?:\\p{Mn}|ی)?(?:\\sگمرکی(?:\\p{Mn}|ی)?)?\\s(?:شما(?!\\p{Script=Arabic})|وارد[\\s\\p{Cf}]?کننده)|انتخاب\\s(?:شما|خودتان)', incl: FA_INCL,
  afghanDuties: `(?<!\\p{Script=Arabic})(?:حقوق|عوارض|مالیات|هزینه)(?:\\p{Mn}|ی|[\\s\\p{Cf}]?(?:های|ها))?(?:\\s(?:و|گمرکی|گمرک|حقوق|عوارض|مالیات)(?:\\p{Mn}|ی)?)*\\s(?:در\\s)?افغانستان(?!\\p{Script=Arabic})[^${FA_STOP}؛;]{0,30}?(?:در\\s(?:قیمت|نرخ|هزینه)|شامل|${FA_MI}پرداز|پرداخت\\s?(?:${FA_MI}(?:کنیم|کنند|کند|شود)|شده)|بر\\sعهده)`,
});
// "IN Afghanistan": the locative, so that «Ofisimiz Toshkentda; Afgʻonistonga fura bilan…» and «в Афганистан возим» pass.
// Two kinds of word (§4a): what would be GSR's own there (`own` — never let through), and a partner, an agent or a
// broker there (`partners` — let through when the sentence names the partner customs agents); and the partner
// customs agents with the cargo in their hands, anywhere in the sentence. Since the guard verification (2026-11-13) an
// `own` word anywhere in that sentence stops it too ("our representative works with our partners — customs agents"), and
// "on the Afghan side" is a place of presence like "in Afghanistan".
const presence = (o) => `(?:${nearName({ ...o, words: o.own })})|(?:${nearName({ ...o, words: o.partners })}${partnersOk(o.ok)})|(?:${partnerSentence(o.ok, [o.ok.handling, o.own].join('|'))})`;
/*
 * "We have …" (guard hardening, 2026-11-13): a have form beside the locative name, with a place of presence or people,
 * is GSR's own (`own`: never let through) — "We have an employee in Afghanistan", "In Afghanistan we have staff who meet
 * the truck", "There is a warehouse of ours in Hairatan", «В Мазари-Шарифе у нас есть склад», «У нас в Хайратоне работает
 * команда», «Mozori Sharifda omborimiz bor», 我们在马扎里沙里夫有仓库, 我们在海拉顿设有堆场, «در مزار شریف انبار داریم». Places and
 * people only: a partner, an agent or a broker stays with the partners' exemption ("We have partners — customs agents
 * (declarants) — …"), and a partner's warehouse is not GSR's ("a warehouse partner", «склад партнёра», 合作方的仓库,
 * «انبار شریک»). A denial or a question passes, as before.
 */
const EN_SITE = `(?:employees?|staff|personnel|people|teams?|workers?|m[ae]n|persons?|someone|somebody|contact(?:\\s+persons?)?(?!s)|colleagues?|warehouses?|depots?|terminals?|yards?|storage|pick-?up\\s+points?)\\b(?![\\s-]+partners?\\b|\\s+of\\s+(?:a|an|our|the|its|their)\\s+(?:[a-z’'-]+\\s+)?partner)`;
// … not when the site is placed somewhere else ("We have a team in Tashkent, and in Afghanistan …": two facts) — unless the
// list goes on to an Afghan place ("staff in Tashkent and in Hairatan").
const EN_SITE_AWAY = `(?!\\s+(?:(?:is|are)\\s+)?(?:based\\s+|located\\s+)?(?:in|at)\\s+(?:Tashkent|Uzbekistan|Termez|China|Yiwu|Guangzhou|Kashgar|Kazakhstan)\\b(?!\\s+(?:and|or)\\s+(?:(?:in|at)\\s+)?(?:Afghanistan|Ha[iy]rat[ao]n|Mazar)))`;
const EN_HAVE = `\\b(?:we(?:[’']ve|\\s+(?:(?:also|now|already|still|even|currently|do)\\s+)?(?:have|had|own|run|operate|maintain|keep|employ|rent|lease))|(?:GSR(?:\\s+Logistics)?|our\\s+company)\\s+(?:(?:also|now|already|still)\\s+)?(?:has|had|owns|runs|operates|maintains|keeps|employs|rents|leases))\\b(?:\\s+got\\b)?\\s+(?:(?!(?:to|in|at|on|for|with|from|into|by|of|and|or|but|that|which|who|where|no|not|any|never)\\b)[a-z’'-]+\\s+){0,3}?${EN_SITE}${EN_SITE_AWAY}|\\b${EN_SITE}\\s+of\\s+(?:ours|our\\s+own)\\b${EN_SITE_AWAY}`;
const RU_SITE = '(?:склад(?!ск)[а-яё]*(?![а-яё]*\\s+(?:[а-яё]+\\s+)?партн[её]р)|сотрудник[а-яё]*|работник[а-яё]*|персонал[а-яё]*|команд(?:а|ы|у|ой|е)|люд(?:и|ей|ьми|ям)|человек[а-яё]*|терминал[а-яё]*|площадк[а-яё]*|стоянк[а-яё]*|ангар[а-яё]*|депо|офис[а-яё]*|филиал[а-яё]*|представител[а-яё]*)(?![а-яё])';
const RU_HAVE_WORD = '(?<![а-яё])(?:у\\s+(?:нас|GSR)|(?:мы\\s+)?(?:име(?:ем|ли)|располага(?:ем|ли)|держ(?:им|али)|содерж(?:им|али)|арендуем|арендовали|открыли|открываем))(?![а-яё])';
// «у нас (есть / тоже есть / работает …) склад» — not «у нас в Ташкенте команда» (no «в / на» between) — and «склад у нас …»;
// not «команда в Ташкенте» (two facts) unless the list goes on to an Afghan place («в Ташкенте и в Хайратоне»).
const RU_SITE_AWAY = '(?!\\s+(?:в|на)\\s+(?:Ташкент|Узбекистан|Термез|Кита|Иу|Гуанчжоу|Кашгар|Казахстан)[а-яё]*(?![а-яё])(?!\\s+и\\s+(?:в\\s+|на\\s+)?(?:Афганистан|Хайратон|Мазари)))';
const RU_HAVE = `${RU_HAVE_WORD}\\s+(?:(?!(?:не|нет|ни|в|во|на)(?![а-яё]))[а-яё]+\\s+){0,2}?${RU_SITE}${RU_SITE_AWAY}|${RU_SITE}\\s+(?:[а-яё]+\\s+)?у\\s+нас(?![а-яё])${RU_SITE_AWAY}`;
// Uzbek: the possessive is the have form («omborimiz bor»); «bizda / bizning» + a site noun. Not «bazamiz» ("our database").
const UZ_SITE = '(?:ombor|sklad|depo|xodim|odam|jamoa|hamkasb|ishchi|xizmatchi|terminal|punkt|ofis|filial|vakil)';
const UZC_SITE = '(?:омбор|склад|депо|ходим|одам|жамоа|ҳамкасб|ишчи|хизматчи|терминал|пункт|офис|филиал|вакил)';
// (not «Bizda Toshkentda jamoa bor, Afgʻonistonda esa …»: two facts — unless the list goes on, «Toshkentda va Hayratonda»)
const UZ_SITE_AWAY = `(?:Toshkent|O${AP}?zbekiston|Termiz|Xitoy|Ivu|Guanchjou|Qashqar|Qozog${AP}?iston)`;
const UZC_SITE_AWAY = '(?:Тошкент|Ўзбекистон|Термиз|Хитой|Иву|Гуанчжоу|Қашқар|Қозоғистон)';
const UZ_HAVE = `ombor(?:xona)?(?:lar)?i?miz|sklad(?:lar)?imiz|depo(?:larimiz|miz)|(?<![a-zʻʼ])biz(?:da|ning)\\s+(?:(?!(?:yo${AP}?q|emas)(?![a-zʻʼ])|${UZ_SITE_AWAY})[a-zʻʼ]+\\s+){0,2}?${UZ_SITE}(?![a-zʻʼ]*\\s+${UZ_SITE_AWAY}[a-zʻʼ]*(?![a-zʻʼ])(?!\\s+(?:va|yoki)\\s+(?:Afg${AP}?oniston|Hayraton|Mozori)))`;
const UZC_HAVE = `омбор(?:хона)?(?:лар)?и?миз|склад(?:лар)?имиз|депо(?:ларимиз|миз)|(?<![а-яёўқғҳ])биз(?:да|нинг)\\s+(?:(?!(?:йўқ|эмас)(?![а-яёўқғҳ])|${UZC_SITE_AWAY})[а-яёўқғҳ]+\\s+){0,2}?${UZC_SITE}(?![а-яёўқғҳ]*\\s+${UZC_SITE_AWAY}[а-яёўқғҳ]*(?![а-яёўқғҳ])(?!\\s+(?:ва|ёки)\\s+(?:Афғонистон|Ҳайратон|Мозори)))`;
// Chinese: a have verb with 我们 / 我司 / 本公司 / 我方 before it (海拉顿口岸设有… names no owner), closed modifiers only (so not
// 有合作方的仓库), then a place or people.
const ZH_HAVE = '(?:有|设有|拥有|建有|开设|设立|自建|自营|租用|租有|配备|驻有|派驻|雇有|雇用|聘用|聘有)(?:了|着)?(?:自己的|自有的?|我们的|专属的?|当地的?|本地的?|常驻的?|固定的?|一个|一座|一处|一家|一支|一批|多个|几个|若干|两个|多名|几名|一名|小型|大型)*';
const ZH_SITE = '(?:仓库|货仓|库房|仓储(?:中心|设施|点)?|堆场|货场|场站|场地|停车场|中转站|货站|转运站|人员|职员|雇员|工作人员|团队|同事|人手|员工)';
// 我们 … 有: not with another place between them (我们在塔什干有团队，在阿富汗一侧… is two facts) — unless an Afghan one is there too
const ZH_SITE_AWAY = '塔什干|乌兹别克斯坦|铁尔梅兹|中国|义乌|广州|喀什|哈萨克斯坦';
// (the look-ahead first: the look-behind is then tried only where a have verb starts — without it, at every character)
const ZH_WE_HAVE = `(?=[有设拥建开自租配驻派雇聘])(?<=(?:我们|我司|本公司|我方)(?:[^${ZH_STOP}]{0,12}?${AFGHAN[4]}[^${ZH_STOP}]{0,12}?|(?:(?!${ZH_SITE_AWAY})[^${ZH_STOP}]){0,12}))${ZH_HAVE}${ZH_SITE}`;
// Persian: a site noun (not شریک / شرکا / همکار between it and the verb) + «داریم / داشتیم / داشته‌ایم / خواهیم داشت» — «نداریم»
// is never read, a space stands before the verb — and the possessive suffix («انبارمان», «کارمندانمان»).
const FA_SITE = '(?<!\\p{Script=Arabic})(?:انبار|گدام|کارمند|کارکن|پرسنل|نیرو|نفر|تیم|ترمینال|پایانه|کارگر)(?:ان|[\\s\\p{Cf}]?(?:ها|های))?';
// (not «در تاشکند تیم داریم و در افغانستان …»: the site placed somewhere else, two facts — unless an Afghan place comes
// first in the same list: «در حیرتان و در تاشکند انبار داریم»)
const FA_SITE_AWAY = 'تاشکند|ازبکستان|ترمذ|چین|ییوو|کاشغر|گوانگ[\\s\\p{Cf}]?(?:ژو|جو)|قزاقستان';
const FA_HAVE = `(?<!(?<!(?:حیرتان|افغانستان|مزار[\\s\\p{Cf}]?شریف)[^${FA_STOP}؛;،]{0,20})(?:${FA_SITE_AWAY})[\\s\\p{Cf}](?:یک[\\s\\p{Cf}])?)${FA_SITE}(?:\\p{Mn}|ی|یی)?(?:\\s(?!(?:شریک|شرکا|همکار|${FA_SITE_AWAY}))[^\\s${FA_STOP}؛;]+){0,2}?\\s(?:هم\\s|نیز\\s)?(?:داریم|داشتیم|داشته[\\s\\p{Cf}]?ایم|خواهیم\\sداشت)(?!\\p{Script=Arabic})|${FA_SITE}\\p{Cf}?مان(?!\\p{Script=Arabic})`;
/** The have form with the place inside it — «У нас в Хайратоне работает команда», «Bizda Hayratonda ombor bor» — unless the sentence denies it or asks. */
const haveAround = (o) => `(?:${o.have})\\s+(?:[^\\s.!?;]+\\s+){0,2}?(?:${o.name})\\s+(?:[^\\s.!?;]+\\s+){0,2}?(?:${o.site})(?<!(?:${o.no})[^.!?;]{0,90})(?![^.!?;]{0,40}(?:${o.no}|${o.asks}))`;
/** …and the site first, the place in the middle, the have word last — «کارمند در حیرتان داریم», «Склад в Хайратоне у нас есть», «Ombor Hayratonda bizda bor». */
const haveAfter = (o, stop = '.!?;', gap = 2) => `(?:${o.site})(?:\\s+[^\\s${stop}]+){0,${gap}}?\\s+(?:${o.name})(?:\\s+[^\\s${stop}]+){0,2}?\\s+(?:${o.have})(?<!(?:${o.no})[^${stop}]{0,90})(?![^${stop}]{0,40}(?:${o.no}|${o.asks}))`;
const UZ_AT = `(?:(?:Afg${AP}?oniston|Hayraton|Mozori\\s+Sharif)(?:da|dagi)|Afg${AP}?oniston\\s+tomoni(?:da|dagi))(?![a-zʻʼ])`;
const UZC_AT = '(?:(?:Афғонистон|Ҳайратон|Мозори\\s+Шариф)(?:да|даги)|Афғонистон\\s+томони(?:да|даги))(?![а-яёўқғҳ])';
const RU_AT = '(?<![а-яё])(?:в\\s+(?:Афганистане|Хайратоне|Мазари[\\s-]*Шарифе)|на\\s+афганской\\s+стороне)';
const UZ_PRESENCE = presence({ name: UZ_AT, own: `ofis|filial|vakolatxona|vakil|xodim(?:lar)?imiz|odam(?:lar)?imiz|hamkasb(?:lar)?imiz|punktimiz|jamoamiz|terminal|${UZ_HAVE}|(?<![a-zʻʼ])${UZ_SITE}[a-zʻʼ]*\\s+(?:ham\\s+)?biz(?:da|ning)(?![a-zʻʼ])`, partners: '(?<![a-zʻʼ])(?:hamkor|partn(?:y?o|e)r)|agent|broker|deklarant', no: UZ_NO, asks: '\\?', ok: UZ_PARTNERS }) +
  `|${haveAround({ have: '(?<![a-zʻʼ])biz(?:da|ning)(?![a-zʻʼ])', name: UZ_AT, site: UZ_SITE, no: UZ_NO, asks: '\\?' })}` +
  `|${haveAfter({ site: `(?<![a-zʻʼ])${UZ_SITE}[a-zʻʼ]*`, name: UZ_AT, have: '(?:ham\\s+)?biz(?:da|ning)(?![a-zʻʼ])', no: UZ_NO, asks: '\\?' })}`;
const UZC_PRESENCE = presence({ name: UZC_AT, own: `офис|филиал|ваколатхона|вакил|ходим(?:лар)?имиз|одам(?:лар)?имиз|ҳамкасб(?:лар)?имиз|пунктимиз|жамоамиз|терминал|${UZC_HAVE}|(?<![а-яёўқғҳ])${UZC_SITE}[а-яёўқғҳ]*\\s+(?:ҳам\\s+)?биз(?:да|нинг)(?![а-яёўқғҳ])`, partners: '(?<![а-яёўқғҳ])(?:ҳамкор|партн[её]р)|агент|брокер|декларант', no: UZC_NO, asks: '\\?', ok: UZC_PARTNERS }) +
  `|${haveAround({ have: '(?<![а-яёўқғҳ])биз(?:да|нинг)(?![а-яёўқғҳ])', name: UZC_AT, site: UZC_SITE, no: UZC_NO, asks: '\\?' })}` +
  `|${haveAfter({ site: `(?<![а-яёўқғҳ])${UZC_SITE}[а-яёўқғҳ]*`, name: UZC_AT, have: '(?:ҳам\\s+)?биз(?:да|нинг)(?![а-яёўқғҳ])', no: UZC_NO, asks: '\\?' })}`;
const RU_PRESENCE = presence({ name: RU_AT, own: `офис|филиал|представительств|(?<![а-яё])представител|(?<![а-яё])наш[а-яё]{0,3}\\s+(?:сотрудник|человек|люди|коллег|контакт|команд|склад(?!ск)|терминал|площадк|стоянк|персонал|работник)[а-яё]*|(?<![а-яё])терминал|пункт[а-яё]{0,2}\\s+выдачи|${RU_HAVE}`, partners: '(?<![а-яё])(?:партн[её]р|агент|брокер|декларант)', no: RU_NO, asks: '\\?', ok: RU_PARTNERS }) +
  `|${haveAround({ have: RU_HAVE_WORD, name: RU_AT, site: RU_SITE, no: RU_NO, asks: '\\?' })}` +
  `|${haveAfter({ site: `(?<![а-яё])${RU_SITE}`, name: RU_AT, have: RU_HAVE_WORD, no: RU_NO, asks: '\\?' })}`;
const EN_PRESENCE = presence({ name: `\\b(?:(?:in|at)\\s+(?:Afghanistan|Ha[iy]rat[ao]n|Mazar[\\s-]*[ie][\\s-]*Sharif)|on\\s+the\\s+Afghan\\s+side)`,
  own: `(?<!customs\\s)\\boffices?\\b|\\bbranch(?:es)?\\b|\\brepresentatives?\\b|\\bour\\s+(?:own\\s+|local\\s+)?(?:employees?|staff|people|team|man|person|contact|colleagues?|warehouse|depot|terminal|pick-?up\\s+point)\\b|${EN_HAVE}`,
  partners: '\\bpartners?\\b|\\bour\\s+(?:own\\s+|local\\s+)?(?:customs\\s+)?(?:agents?|brokers?|declarants?)\\b|\\b(?:an|a\\s+local|local)\\s+(?:customs\\s+)?agents?\\b', no: EN_NO, asks: '\\?', ok: EN_PARTNERS }) +
  `|\\bour\\s+Afghan\\s+(?:offices?|branch(?:es)?|team|staff|warehouse|representatives?)\\b(?![^.!?;]{0,40}(?:${EN_NO}|\\?))` +
  `|\\bour\\s+Afghan\\s+(?:partners?|agents?|brokers?)\\b(?![^.!?;]{0,40}(?:${EN_NO}|\\?))${partnersOk(EN_PARTNERS)}`;
const ZH_PRESENCE = presence({ name: '(?:阿富汗|海拉顿|马扎里沙里夫)', own: `办事处|分公司|代表处|办公室|分支机构|员工|站点|提货点|网点|我们的代表|(?:有|设有|派驻)(?:常驻)?代表(?!处)|(?:设有|派驻)(?:常驻)?(?:联络人|联系人)|(?:自己|我们)的(?:团队|人员|员工|同事|仓库|货仓|库房|堆场|货场|场站)|${ZH_WE_HAVE}`, partners: '合作伙伴|合作方|伙伴|代理|报关行|报关员|申报人', span: 10, stop: `${ZH_STOP}，,、`, no: ZH_NO, asks: '吗|？|\\?', ok: ZH_PARTNERS }) +
  `|我(?:们|司)在${AFGHAN[4]}的(?:人员|同事|联系人|团队|仓库)` +
  // 在阿富汗，我们设有仓库 / 在阿富汗，我们的员工… — the comma after a fronted place, which the window above stops at
  `|在${AFGHAN[4]}[，,]\\s?(?:(?:我们|我司|本公司|我方)(?:也|还|都|已经?|目前|现在|另外|同样)?${ZH_HAVE}(?:${ZH_SITE}|办事处|分公司|代表处|办公室|分支机构|站点|提货点|网点|代表(?!处)|联络人|联系人)|我(?:们|司)(?:自己)?的(?:员工|团队|人员|同事|代表|联络人|联系人|仓库|货仓|库房|堆场|货场|场站|办事处|办公室))(?<!(?:${ZH_NO})[^${ZH_STOP}]{0,90})(?![^${ZH_STOP}]{0,40}(?:${ZH_NO}|吗|？|\\?))` +
  // 仓库我们在海拉顿也有 — the site first
  `|${ZH_SITE}[，,]?\\s?(?:我们|我司|本公司|我方)(?:也|还|都)?在${AFGHAN[4]}(?:也|还|都|已经?)?(?:有|设有|拥有|建有|配备)(?<!(?:${ZH_NO})[^${ZH_STOP}]{0,90})(?![^${ZH_STOP}]{0,40}(?:${ZH_NO}|吗|？|\\?))`;
const FA_PRESENCE = presence({ name: '(?:در\\s(?:سمت\\s)?افغانستان|سمت\\sافغانستان|در\\s(?:حیرتان|مزار[\\s\\p{Cf}]?شریف))', own: `دفتر(?!چه)|نمایندگی|نماینده|نمایندگان\\s(?:ما|خودمان)(?!\\p{Script=Arabic})|شعبه|(?:کارمند(?:ان)?|نفر|نیرو|تیم|ترمینال|گدام|انبار)(?:\\p{Mn}|ی)?\\s(?:ما|خودمان)(?!\\p{Script=Arabic})|${FA_HAVE}`, partners: '(?:همکار(?:ان)?)(?:\\p{Mn}|ی)?\\s(?:ما|خودمان)(?!\\p{Script=Arabic})|عامل(?!\\p{Script=Arabic})|(?<!\\p{Script=Arabic})(?:شریک|شرکا|کارگزار)', stop: `${FA_STOP}؛;`, no: FA_NO, asks: '؟', ok: FA_PARTNERS }) +
  `|${haveAfter({ site: `${FA_SITE}(?:\\p{Mn}|ی|یی)?`, name: '(?:در\\s(?:سمت\\s)?افغانستان|سمت\\sافغانستان|در\\s(?:حیرتان|مزار[\\s\\p{Cf}]?شریف))', have: '(?:هم\\s|نیز\\s)?(?:داریم|داشتیم|داشته[\\s\\p{Cf}]?ایم|خواهیم\\sداشت)(?!\\p{Script=Arabic})', no: FA_NO, asks: '؟' }, `${FA_STOP}؛;`, 3)}`;
const PRESENCE_MSG = (lang) => `claims an office, a branch, a representative, an employee or a terminal in Afghanistan, or partners, agents or brokers there who are not named as customs agents (declarants) or who handle the cargo (${lang}) — owner, 2026-11-12: GSR's partners on the Afghan side are customs agents (declarants), named as such in the same sentence, and they only clear customs; GSR still has no office, branch, representative, employee or warehouse there, and who pays the Afghan duties is not confirmed: no DDP, no "duties included" (a denial passes)`;
const UZ_SCHEDULE = nearName({ name: AFGHAN[0], words: `har\\s+(?:hafta|kuni?)(?![a-zʻʼ])|haftasiga|haftalik|kuniga|muntazam\\s+(?:reys|qatnov|jo${AP}?nat|ravishda)|jadval\\s+bo${AP}?yicha|har\\s+(?:dushanba|seshanba|chorshanba|payshanba|juma|shanba|yakshanba)|oyiga\\s+[a-zʻʼ]+\\s+marta|doimiy\\s+(?:ravishda\\s+)?qatn|reyslar\\s+jadvali`, no: UZ_NO, asks: '\\?' });
const UZC_SCHEDULE = nearName({ name: AFGHAN[1], words: 'ҳар\\s+(?:ҳафта|куни?)(?![а-яёўқғҳ])|ҳафтасига|ҳафталик|кунига|мунтазам\\s+(?:рейс|қатнов|жўнат|равишда)|жадвал\\s+бўйича|ҳар\\s+(?:душанба|сешанба|чоршанба|пайшанба|жума|шанба|якшанба)|ойига\\s+[а-яёўқғҳ]+\\s+марта|доимий\\s+(?:равишда\\s+)?қатн|рейслар\\s+жадвали', no: UZC_NO, asks: '\\?' });
const RU_SCHEDULE = nearName({ name: AFGHAN[2], words: 'еженедельн|ежедневн|кажд(?:ую|ый|ые|ое)\\s+(?:неделю|день|месяц|понедельник|вторник|среду|четверг|пятницу|субботу|воскресенье)|(?:раза?|дважды|трижды)\\s+в\\s+(?:неделю|месяц)|ежемесячн|регулярн[а-яё]+\\s+(?:рейс|отправ|отгруз|сообщени)|по\\s+расписани|по\\s+(?:понедельникам|вторникам|средам|четвергам|пятницам|субботам|воскресеньям)|(?:ходят|уходят|отправляются)\\s+постоянно|(?:стабильн|постоянн)[а-яё]+\\s+(?:рейс|отправ)|[а-яё]+\\s+фур[ыа]?\\s+в\\s+(?:месяц|неделю)', no: RU_NO, asks: '\\?' });
const EN_SCHEDULE = nearName({ name: AFGHAN[3], words: '\\bweekly\\b|\\bdaily\\b|\\b(?:every|each)\\s+(?:week|day|month|(?:mon|tues|wednes|thurs|fri|satur|sun)day)\\b|\\b(?:once|twice|(?:\\d+|two|three|four|five)\\s+times)\\s+(?:(?:a|per|every)\\s+(?:week|month)|weekly|monthly)\\b|\\b(?:monthly|fortnightly)\\s+(?:departures?|trucks?|services?|runs?|shipments?|dispatch(?:es)?)\\b|\\bregular\\s+(?:departures?|trucks?|services?|runs?|schedules?|shipments?)\\b|\\bscheduled\\s+departures?\\b|\\bon\\s+(?:mon|tues|wednes|thurs|fri|satur|sun)days\\b|\\b(?:steady|fixed|set)\\s+schedules?\\b|\\btimetable\\b|\\b(?:two|three|four|five|six|seven|eight|nine|ten|\\d+)\\s+trucks?\\s+(?:a|per|every)\\s+(?:week|month)\\b|\\ball\\s+the\\s+time\\b', no: EN_NO, asks: '\\?' });
const ZH_SCHEDULE = nearName({ name: AFGHAN[4], words: '每周|每天|每日|定期发|定期班|固定班期|固定发车|周[一二三四五六日]发|常年|班期稳定|每月[^。！？!?；;]{0,8}?(?:[一二两三四五六七八九十几数]|\\d)+\\s?(?:车|趟|班|次)', stop: ZH_STOP, no: '不(?!断|间断)|[没无未]', asks: '吗|？|\\?' }) +
  `|每月(?:向|往|至|到|发往)?${AFGHAN[4]}[^${ZH_STOP}]{0,8}?(?:[一二两三四五六七八九十几数]|\\d)+\\s?(?:车|趟|班|次)`;
const FA_SCHEDULE = nearName({ name: AFGHAN[5], words: 'هر\\s(?:هفته|روز|ماه|دوشنبه|سه[\\s\\p{Cf}]?شنبه|چهارشنبه|پنج[\\s\\p{Cf}]?شنبه|جمعه|شنبه|یکشنبه)(?!\\p{Script=Arabic})|(?:هفته|ماه)[\\s\\p{Cf}]?ای\\s[\\p{Script=Arabic}]+\\sبار(?!\\p{Script=Arabic})|ماهی\\s[\\p{Script=Arabic}]+\\s(?:بار|مرتبه|نوبت)(?!\\p{Script=Arabic})|هفتگی|روزانه|ماهانه|منظم|(?:دوشنبه|سه[\\s\\p{Cf}]?شنبه|چهارشنبه|پنج[\\s\\p{Cf}]?شنبه|جمعه|شنبه|یکشنبه)[\\s\\p{Cf}]?ها|پیوسته|برنامه(?:\\p{Mn}|ی)?\\sثابت|ماهی\\s[\\p{Script=Arabic}]+\\sکامیون', stop: `${FA_STOP}؛;`, no: FA_NO, asks: '؟' });
const SCHEDULE_MSG = (lang) => `claims regular or scheduled departures to Afghanistan (${lang}) — the direction is new and no schedule is confirmed (a denial passes)`;


/*
 * 5. What an audit of 2026-11-12 found open (385 false sentences in wording nobody had tried: 7 were stopped). The
 * rules below close the ones a future editor is likely to write. All are block rules; each reads one sentence.
 *
 *   afghanFigure    now also reads a time or a price in WORDS («bir haftada», «за неделю», "within a week", 一周内,
 *                   «ظرف یک هفته», "three thousand dollars") and the day counted from departure («uchinchi kuni»).
 *   afghanRecord    years of work, counts of trucks or clients, "experience" beside the direction: it is new.
 *   afghanOrigin    cargo FROM Afghanistan (import, return loads, Afghan exports): not confirmed.
 *   afghanAnywhere  "all / any / other cities of Afghanistan", "across Afghanistan": two points only.
 *   any.iranian     the adjective, in every language: nothing about Iran is published.
 */
const UZ_ONES = `bir|ikki|uch|to${AP}?rt|besh|olti|yetti|sakkiz|to${AP}?qqiz|o${AP}?n|yigirma|o${AP}?ttiz|qirq|ellik|yarim|bir\\s+necha`;
const UZC_ONES = 'бир|икки|уч|тўрт|беш|олти|етти|саккиз|тўққиз|ўн|йигирма|ўттиз|қирқ|эллик|ярим|бир\\s+неча';
const UZ_WORDFIG = `(?<![a-zʻʼ])(?:(?:${UZ_ONES})(?:[\\s–-]+(?:${UZ_ONES}))?\\s+(?:(?:ish|kalendar)\\s+)?(?:kun|sutka|hafta|oy|soat)(?:da|dan|ga|gacha|lik|ni|i|ida)?|(?:ikkinchi|uchinchi|to${AP}?rtinchi|beshinchi|ertasi)\\s+kun[a-zʻʼ]*|(?:yuz|ming|million)\\s+(?:AQSH\\s+)?(?:dollar|so${AP}?m|yuan|yevro)[a-zʻʼ]*)(?![a-zʻʼ])`;
const UZC_WORDFIG = `(?<![а-яёўқғҳ])(?:(?:${UZC_ONES})(?:[\\s–-]+(?:${UZC_ONES}))?\\s+(?:(?:иш|календарь?)\\s+)?(?:кун|сутка|ҳафта|ой|соат)(?:да|дан|га|гача|лик|ни|и|ида)?|(?:иккинчи|учинчи|тўртинчи|бешинчи|эртаси)\\s+кун[а-яёўқғҳ]*|(?:юз|минг|миллион)\\s+(?:АҚШ\\s+)?(?:доллар|сўм|юан|евро)[а-яёўқғҳ]*)(?![а-яёўқғҳ])`;
const RU_ONES = 'один|одн[аоуи]|дв[ае]|двух|три|тр[её]х|четыр[её]х?|пят[ьи]|шест[ьи]|сем[ьи]|восем[ьи]|девят[ьи]|десят[ьи]|(?:один|две|три|четыр|пят|шест|сем|восем|девят)надцат[ьи]|двадцат[ьи]|тридцат[ьи]|сорока?|нескольк[оих]{1,2}|пар[ау]|полтор[аы]';
const RU_WORDFIG = `(?<![а-яё])(?:(?:${RU_ONES})(?:[\\s–-]+(?:${RU_ONES}))?\\s+(?:(?:рабоч|календарн)[а-яё]+\\s+)?(?:дн(?:ей|я|ям|ях)|день|суток|сутки|недел[ьюией]|месяц(?:а|ев)?|час(?:а|ов)?)|за\\s+(?:день|сутки|неделю|месяц)|на\\s+(?:второй|третий|четв[её]ртый|пятый|следующий)\\s+день|около\\s+(?:недели|месяца)|(?:тысяч[аиу]?|сот(?:ен|ни|ня)?|миллион(?:а|ов)?)\\s+(?:долларов|доллар[аы]?|сум(?:ов)?|евро|юаней))(?![а-яё])`;
const EN_ONES = 'two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|(?:thir|four|fif|six|seven|eigh|nine)teen|twenty|thirty|forty|fifty|sixty|ninety|a\\s+dozen';
const EN_WORDFIG = `\\b(?:(?:${EN_ONES}|a\\s+few|few|several|a\\s+couple\\s+of)(?:\\s+(?:to|or)\\s+(?:${EN_ONES}))?\\s+(?:working\\s+|business\\s+|calendar\\s+)?(?:days?|weeks?|months?|hours?)|(?:in|within|about|around|roughly|after|takes?)\\s+(?:a|one)\\s+(?:day|week|month|fortnight)|(?:a|one)\\s+(?:day|week|month|fortnight)\\s+(?:after|later)|(?:second|third|fourth|fifth|next|same)\\s+day|overnight|(?:hundred|thousand|million)\\s+(?:US\\s+)?(?:dollars?|soums?|sums?|yuan|euros?))\\b`;
const ZH_ONES = '[一二两三四五六七八九十数半]'; // not 几: 几天 is also "how many days?"
const ZH_WORDFIG = `(?:${ZH_ONES}{1,3}(?:[到至~～-]${ZH_ONES}{1,2})?\\s?(?:个?工作日|个?(?:日历|自然)日|天(?!津)|周(?![一二三四五六日末年期边围])|个?星期|个月|个?小时)|第[二三四五六七八九十]天|当天|次日|隔天|${ZH_ONES}{1,3}[千百万]\\s?(?:美元|美金|元|人民币))`;
const FA_ONES = 'یک|دو|سه|چهار|پنج|شش|هفت|هشت|ده|یازده|دوازده|سیزده|چهارده|پانزده|شانزده|هفده|هجده|نوزده|بیست|سی|چهل|پنجاه|نیم'; // not چند («چند روز؟» asks) and not نه (nine, and "no")
const FA_WORDFIG = `(?<!\\p{Script=Arabic})(?:(?:${FA_ONES})(?:\\s(?:تا|الی|یا)\\s(?:${FA_ONES}))?\\s(?:روزه?|هفته|ماه|ساعته?)|روز\\s(?:دوم|سوم|چهارم|پنجم|بعد)|(?:هزار|صد|میلیون)\\s(?:دلار|سوم|یوان|یورو|تومان))(?!\\p{Script=Arabic})`;
const either = (a, b) => `(?:${a}|${b})`;

// years of work, counts of trucks / clients, "experience" — within 40 characters of an Afghan name, unless denied or asked
const UZ_RECORD = nearName({ name: AFGHAN[0], words: `(?<![\\d.,+-])\\d{1,2}\\s?yil(?:dan|lik|dir|da)?(?![a-zʻʼ])|(?<![\\d.,+])\\d{1,5}\\s?(?:\\+\\s?)?(?:ta\\s+|(?:ta)?dan\\s+(?:ortiq|ziyod|ko${AP}?p)\\s+)?(?:fura|mijoz|konteyner|reys|yuk\\s+mashina)|tajriba|(?<![a-zʻʼ])(?:tez(?:da|kor|roq)?|zudlik\\s+bilan|navbatsiz)(?![a-zʻʼ])`, no: UZ_NO, asks: '\\?' });
const UZC_RECORD = nearName({ name: AFGHAN[1], words: '(?<![\\d.,+-])\\d{1,2}\\s?йил(?:дан|лик|дир|да)?(?![а-яёўқғҳ])|(?<![\\d.,+])\\d{1,5}\\s?(?:\\+\\s?)?(?:та\\s+|(?:та)?дан\\s+(?:ортиқ|зиёд|кўп)\\s+)?(?:фура|мижоз|контейнер|рейс|юк\\s+машина)|тажриба|(?<![а-яёўқғҳ])(?:тез(?:да|кор|роқ)?|зудлик\\s+билан|навбатсиз)(?![а-яёўқғҳ])', no: UZC_NO, asks: '\\?' });
const RU_RECORD = nearName({ name: AFGHAN[2], words: '(?<![\\d.,+])\\d{1,2}\\s?(?:лет|года?)(?![а-яё])|(?<![\\d.,+])\\d{1,5}\\s?(?:\\+\\s?)?(?:фур|клиент|контейнер|рейс|машин)|(?<![а-яё])опыт|(?<![а-яё])(?:быстр|оперативн|срочн)[а-яё]*|(?<![а-яё])без\\s+(?:очередей|задержек|простоев)', no: RU_NO, asks: '\\?' });
const EN_RECORD = nearName({ name: AFGHAN[3], words: '(?<![\\d.,+])\\d{1,2}\\s?(?:\\+\\s?)?years?\\b|(?<![\\d.,+])\\d{1,5}\\s?(?:\\+\\s?)?(?:trucks?|clients?|customers?|containers?|shipments?|departures?)\\b|\\bexperienced?\\b|\\btrack\\s+record\\b|\\b(?:fast(?:er|est)?|quick(?:ly|er|est)?|rapid(?:ly)?|swift(?:ly)?|speedy|express)\\b|\\b(?:without|no)\\s+(?:delays?|queues?|waiting)\\b', no: EN_NO, asks: '\\?' });
const ZH_RECORD = nearName({ name: AFGHAN[4], words: '(?<![\\d.,+])\\d{1,2}\\s?多?年(?![\\d月])|(?<![\\d.,+])\\d{1,5}\\s?(?:\\+|多|余)?\\s?(?:辆|车|趟|位|家|名)|经验|快速|快捷|迅速|尽快|极速|加急|免排队', stop: ZH_STOP, no: ZH_NO, asks: '吗|？|\\?' });
const FA_RECORD = nearName({ name: AFGHAN[5], words: '(?<![\\d.,+])\\d{1,2}\\s?سال(?!\\p{Script=Arabic})|(?<![\\d.,+])\\d{1,5}\\s?(?:\\+\\s?)?(?:کامیون|مشتری|کانتینر|محموله)|تجربه|(?<!\\p{Script=Arabic})(?:سریع|فوری|بدون\\s(?:معطلی|تأخیر|تاخیر))', stop: `${FA_STOP}؛;`, no: FA_NO, asks: '؟' });
const RECORD_MSG = (lang) => `years of work, a count of trucks or clients, "experience", or speed ("fast", "quickly", "without queues") beside Afghanistan (${lang}) — the direction is new (owner, 2026-11-11) and price and timing are on request: no figure, no experience or speed claim (a denial passes)`;

// a claim, unless the sentence denies it or asks (as mode() and nearName() do)
const unlessDenied = (claim, o) => { const stop = o.stop ?? '.!?;'; return `(?:${claim})(?<!(?:${o.no})[^${stop}]{0,90})(?![^${stop}]{0,40}(?:${o.no}|${o.asks}))`; };
const AF_UZ = `(?:Afg${AP}?oniston|Hayraton|Mozori\\s+Sharif)`;
const AF_UZC = '(?:Афғонистон|Ҳайратон|Мозори\\s+Шариф)';
const AF_RU_GEN = '(?:Афганистана|Хайратона|Мазари[\\s-]*Шарифа)';
const AF_EN = '(?:Afghanistan|Ha[iy]rat[ao]n|Mazar[\\s-]*[ie][\\s-]*Sharif)';
const AF_FA = '(?:افغانستان|حیرتان|مزار[\\s\\p{Cf}]?شریف)';
// "Afgʻonistondan Oʻzbekistonga", "Afgʻonistondan yuk / meva / eksport …", "Afgʻoniston yuklarini …"
const UZ_ORIGIN = unlessDenied(`(?<![a-zʻʼ])${AF_UZ}dan\\s+(?:ham\\s+)?(?:(?:${UZ_SERVED}|${UZ_UNSERVED}|Xitoy)(?:ga|gacha|ka|qa)|(?:yuk|tovar|mahsulot|meva|eksport|import)[a-zʻʼ]*)(?![a-zʻʼ])|(?<![a-zʻʼ])Afg${AP}?oniston\\s+(?:yuk|eksport|tovar)lari[a-zʻʼ]*`, { no: UZ_NO, asks: '\\?' });
const UZC_ORIGIN = unlessDenied(`(?<![а-яёўқғҳ])${AF_UZC}дан\\s+(?:ҳам\\s+)?(?:(?:${UZC_SERVED}|${UZC_UNSERVED}|Хитой)(?:га|гача|ка|қа)|(?:юк|товар|маҳсулот|мева|экспорт|импорт)[а-яёўқғҳ]*)(?![а-яёўқғҳ])|(?<![а-яёўқғҳ])Афғонистон\\s+(?:юк|экспорт|товар)лари[а-яёўқғҳ]*`, { no: UZC_NO, asks: '\\?' });
// «из Афганистана в Узбекистан», «грузы из Афганистана», «везёт из Афганистана», «афганские грузы»
const RU_ORIGIN = unlessDenied(`(?<![а-яё])из\\s+${AF_RU_GEN}\\s+(?:в|во|на|до)\\s+(?:${RU_SERVED}|${RU_UNSERVED}|Китай|Китая)(?![а-яё])|(?<![а-яё])(?:грузы?|груза|грузов|товары?|товаров|продукци[а-яё]+|[а-яё]*фрукт[а-яё]*|экспорт[а-яё]*|импорт[а-яё]*)\\s+из\\s+${AF_RU_GEN}|(?<![а-яё])(?:возим|возит|вез[её]м|вез[её]т|привозим|привез[её]м|привозит|забираем|вывозим|перевозим|доставляем|доставим)\\s+(?:[а-яё-]+\\s+){0,2}?из\\s+${AF_RU_GEN}|(?<![а-яё])афганск[а-яё]+\\s+(?:грузы?|груза|грузов|товар[а-яё]*|экспорт[а-яё]*)`, { no: RU_NO, asks: '\\?' });
// "from Afghanistan to Uzbekistan", "cargo from Afghanistan", "brings fruit from Afghanistan", "Afghan cargo"
const EN_ORIGIN = unlessDenied(`\\bfrom\\s+${AF_EN}\\s+(?:to|into)\\s+(?:the\\s+)?(?:${EN_SERVED}|${EN_UNSERVED}|China)\\b|\\b(?:cargo|freight|goods|shipments?|loads?|exports?|imports?|produce|fruit)\\s+from\\s+${AF_EN}|\\b(?:carry|carries|carried|ship|ships|deliver|delivers|bring|brings|import|imports|collect|collects|haul|hauls)\\s+(?:[a-z’'-]+\\s+){0,3}?from\\s+${AF_EN}|\\bAfghan\\s+(?:cargo|exports?|goods|freight)\\b`, { no: EN_NO, asks: '\\?' });
// 从阿富汗到/运往/运回…, 阿富汗的出口货物, 阿富汗货物过境运往…
const ZH_ORIGIN = unlessDenied('从(?:阿富汗|海拉顿|马扎里沙里夫)[^。！？!?；;，,]{0,6}?(?:到|至|运往|运回|运到|发往|发出|起运|进口|出口)|阿富汗(?:的)?(?:出口货物|出口货|货物过境|货物运往)', { stop: ZH_STOP, no: ZH_NO, asks: '吗|？|\\?' });
// «از افغانستان به ازبکستان», «بار صادراتی افغانستان», «از افغانستان … می‌آوریم / می‌آورد», «ترانزیت بار افغانستان»
const FA_ORIGIN = unlessDenied(`(?<!\\p{Script=Arabic})از\\s${AF_FA}\\s(?:هم\\s)?(?:به|تا)\\s|(?:بار|کالا|محموله)(?:\\p{Mn}|ی)?\\s(?:صادراتی|وارداتی)\\s${AF_FA}|(?<!\\p{Script=Arabic})از\\s${AF_FA}[^${FA_STOP}؛;،]{0,25}?${FA_MI}(?:آوریم|آورد|آورند)|ترانزیت\\s(?:بار|کالا)(?:\\p{Mn}|ی)?\\s${AF_FA}`, { stop: `${FA_STOP}؛;`, no: FA_NO, asks: '؟' });
const ORIGIN_MSG = (lang) => `cargo FROM Afghanistan (${lang}) — only cargo TO Afghanistan is confirmed: from China in transit through Uzbekistan, and from Uzbekistan (a denial passes)`;

// "all / any / other cities of Afghanistan", "across Afghanistan"
const UZ_ANYWHERE = unlessDenied(`(?<![a-zʻʼ])Afg${AP}?oniston(?:ning)?\\s+(?:barcha|hamma|boshqa|istalgan|har\\s+qanday|har\\s+bir)\\s+(?:shaha?r|viloyat|hudud|tuman|nuqta)[a-zʻʼ]*|(?<![a-zʻʼ])Afg${AP}?oniston\\s+bo${AP}?ylab|(?<![a-zʻʼ])(?:Balx|Samangon|Bag${AP}?lon|Qunduz|Javzjon)\\s+viloyati(?:ning)?\\s+(?:barcha|hamma|boshqa|istalgan|har\\s+qanday|har\\s+bir)\\s+(?:shaha?r|tuman|hudud|nuqta)|(?<![a-zʻʼ])(?:Balx|Samangon|Bag${AP}?lon|Qunduz|Javzjon)\\s+viloyati\\s+bo${AP}?ylab|(?<![a-zʻʼ])(?:Balx|Samangon|Bag${AP}?lon|Qunduz|Javzjon)\\s*(?:,|va)\\s*(?:Balx|Samangon|Bag${AP}?lon|Qunduz|Javzjon)`, { no: UZ_NO, asks: '\\?' });
const UZC_ANYWHERE = unlessDenied('(?<![а-яёўқғҳ])Афғонистон(?:нинг)?\\s+(?:барча|ҳамма|бошқа|исталган|ҳар\\s+қандай|ҳар\\s+бир)\\s+(?:шаҳа?р|вилоят|ҳудуд|туман|нуқта)[а-яёўқғҳ]*|(?<![а-яёўқғҳ])Афғонистон\\s+бўйлаб|(?<![а-яёўқғҳ])(?:Балх|Самангон|Бағлон|Қундуз|Жавзжон)\\s+вилояти(?:нинг)?\\s+(?:барча|ҳамма|бошқа|исталган|ҳар\\s+қандай|ҳар\\s+бир)\\s+(?:шаҳа?р|туман|ҳудуд|нуқта)|(?<![а-яёўқғҳ])(?:Балх|Самангон|Бағлон|Қундуз|Жавзжон)\\s+вилояти\\s+бўйлаб|(?<![а-яёўқғҳ])(?:Балх|Самангон|Бағлон|Қундуз|Жавзжон)\\s*(?:,|ва)\\s*(?:Балх|Самангон|Бағлон|Қундуз|Жавзжон)', { no: UZC_NO, asks: '\\?' });
const RU_ANYWHERE = unlessDenied('(?<![а-яё])(?:все|всех|всем|всеми|любой|любые|любого|другие|других|другим|остальные|остальных)\\s+(?:город|провинци|регион)[а-яё]*\\s+Афганистана|по\\s+вс(?:ему|ей\\s+территории)\\s+Афганистан[ау]|(?<![а-яё])(?:все|всех|всем|любой|любые|любого|другие|других|другим|остальные|остальных)\\s+(?:город|район|уезд)[а-яё]*\\s+(?:провинции\\s+)?(?:Балх|Саманган|Баглан|Кундуз|Джаузджан)|(?<![а-яё])по\\s+всей\\s+провинции\\s+(?:Балх|Саманган|Баглан|Кундуз|Джаузджан)|(?<![а-яё])(?:Балх|Саманган|Баглан|Кундуз|Джаузджан)\\s*(?:,|и)\\s*(?:Балх|Саманган|Баглан|Кундуз|Джаузджан)', { no: RU_NO, asks: '\\?' });
const EN_ANYWHERE = unlessDenied('\\b(?:all|any|every|other|more)\\s+(?:Afghan\\s+)?(?:cit(?:y|ies)|towns?|provinces?|regions?)\\s+(?:in|of|across)\\s+Afghanistan\\b|\\b(?:all|any|every|other)\\s+Afghan\\s+(?:cit(?:y|ies)|towns?|provinces?)\\b|\\b(?:across|throughout|anywhere\\s+in|all\\s+over|all\\s+of)\\s+Afghanistan\\b|\\bnationwide\\b[^.!?;]{0,30}\\bAfghanistan\\b|\\b(?:other|all|any|every)\\s+(?:towns?|cit(?:y|ies)|districts?|places|points)\\s+(?:of|in|across)\\s+(?:the\\s+)?(?:Balkh|Samangan|Baghlan|Kunduz|Jowzjan)\\b|\\b(?:across|throughout|anywhere\\s+in|all\\s+over)\\s+(?:the\\s+)?(?:Balkh|Samangan|Baghlan|Kunduz|Jowzjan)\\b|\\b(?:Balkh|Samangan|Baghlan|Kunduz|Jowzjan)\\s*(?:,|and)\\s*(?:Balkh|Samangan|Baghlan|Kunduz|Jowzjan)\\b', { no: EN_NO, asks: '\\?' });
const ZH_ANYWHERE = unlessDenied('阿富汗(?:全境|全国|各地|各大城市|所有城市|任何城市|其他城市|其他城镇|各省)|(?:巴尔赫|萨曼甘|巴格兰|昆都士|朱兹詹)省(?:全境|各地|各县|其他|所有|任何|内的?其他)|(?:巴尔赫|萨曼甘|巴格兰|昆都士|朱兹詹)省?[、和及与](?:巴尔赫|萨曼甘|巴格兰|昆都士|朱兹詹)', { stop: ZH_STOP, no: ZH_NO, asks: '吗|？|\\?' });
const FA_ANYWHERE = unlessDenied('(?<!\\p{Script=Arabic})(?:همه|تمام|هر|دیگر|سایر)(?:\\p{Mn}|ی)?\\s(?:شهر|ولایت|ولسوالی)[\\p{Script=Arabic}\\p{Cf}\\p{Mn}]*\\s(?:ولایت\\s)?(?:افغانستان|بلخ)|شهرهای\\sدیگر\\sافغانستان|سراسر\\sافغانستان|ولایت[\\p{Cf}]?های\\s(?:بلخ|سمنگان|بغلان)', { stop: `${FA_STOP}؛;`, no: FA_NO, asks: '؟' });
const ANYWHERE_MSG = (lang) => `delivery to all, any or other places in Afghanistan (${lang}) — GSR delivers to Hairatan and Mazar-i-Sharif only (a denial or a question passes)`;

/**
 * Any time, price, volume or area figure — in digits or in words, in any language of the site. For the pages of the
 * on-request services only (check-content.mjs → PAGE_CLAIMS): there no such figure may stand at all, whatever is
 * beside it — a hero fact «7–10 kun», a table cell, "storage up to 30 days", "2,000 m²" — unless its sentence names
 * the China → Tashkent route (REQUEST_FIGURE_OK: "the 1 m³ minimum … from China to Tashkent").
 */
const LONG_TIME = [
  `(?<![\\d.,+-])(?:\\d{1,3}|${UZ_ONES})\\s+(?:oy|yil)(?:gacha|da|dan|ga|lik)?(?![a-zʻʼ])`,
  `(?<![\\d.,+-])(?:\\d{1,3}|${UZC_ONES})\\s+(?:ой|йил)(?:гача|да|дан|га|лик)?(?![а-яёўқғҳ])`,
  `(?<![\\d.,+а-яё])(?:\\d{1,3}|${RU_ONES})\\s+(?:месяц(?:а|ев)?|лет|года?)(?![а-яё])`,
  `(?<![\\d.,+])\\b(?:\\d{1,3}|${EN_ONES}|one)\\s+(?:months?|years?)\\b`,
  `(?<![\\d.,+])(?:\\d{1,3}|${ZH_ONES}{1,3})\\s?(?:个月|年(?![\\d月代]))`,
  `(?<![\\d.,+\\p{Script=Arabic}])(?:\\d{1,3}|${FA_ONES})\\s(?:ماه|سال)(?!\\p{Script=Arabic})`,
];
const AREA = '(?<![\\d.,+])\\d[\\d\\s.,]*\\s?(?:m[²2]|м[²2]|кв\\.?\\s?м|sq\\.?\\s?(?:m|ft)\\b|square\\s+(?:met|feet)|平方米?|平米|متر\\s?مربع)';
export const REQUEST_FIGURE = new RegExp([UZ_FIGURE, UZC_FIGURE, RU_FIGURE, EN_FIGURE, ZH_FIGURE, FA_FIGURE, UZ_WORDFIG, UZC_WORDFIG, RU_WORDFIG, EN_WORDFIG, ZH_WORDFIG, FA_WORDFIG,
  UZ_CBM, UZC_CBM, RU_CBM, EN_CBM, ZH_CBM, FA_CBM, ...LONG_TIME, AREA].join('|'), 'iu');
const CHINA = '(?:Xitoy|Хитой|Кита[йяею]|China|中国|چین)';
const TASHKENT = '(?:Toshkent|Тошкент|Ташкент|Tashkent|塔什干|تاشکند)';
export const REQUEST_FIGURE_OK = new RegExp(`${CHINA}[\\s\\S]*${TASHKENT}|${TASHKENT}[\\s\\S]*${CHINA}`, 'iu');
/**
 * A sentence that names its SOURCE OF LAW, in any language of the site: an article with its number and its act, a
 * named code, a numbered resolution or decree, a named convention, a Regulation "approved by …", "the same
 * Regulation" — never "the law" alone. For the two guides about the on-request services
 * (check-content.mjs → PAGE_CLAIMS, guide.figure): a guide prints the figures of the law — the 10 calendar days of
 * Article 218 of the Customs Code, the 30 days of the Regulation — which a service page never does. On a guide a
 * time, price, volume or area figure passes only in a sentence that says whose figure it is: this, or the China →
 * Tashkent route (REQUEST_FIGURE_OK). A figure of the company has no article to name. «modda» and «ماده» are also
 * "a substance" and count with their number only; "Code" with its name only (an HS code is not a law); «qarori»
 * with its possessive ending («737-son qarori» — not «qaror qildik», we decided) or, in any other case form, after
 * the number of the document («737-son qarorning 3-1-bandi»; «2-sonli terminal» names no document). The Cyrillic
 * «конвенсия» is what the transliterator printed for «konvensiya» before src/lib/cyrillic.terms.ts respelled it
 * (2026-11-13); both spellings are still accepted.
 */
// A NAMED or NUMBERED instrument, not a keyword: «положение» is also a situation, «qarori» a manager's decision, «nizom» a
// company's charter, 条例 and مقررات a company's rules, 第 2 条 a route, "Article 5" a contract's, "the law" anything.
const LAW_SOURCE = new RegExp([
  // uz: «737-son qarori», «400-son Qonun», «Bojxona kodeksi», «kodeksining 218-moddasi», «CMR konvensiyasi», «shu Nizom»
  String.raw`\d\s?-\s?son(?:li)?\s+(?:qaror|qonun|farmon|buyruq)|(?<![a-zʻʼ])(?:bojxona|soliq|fuqarolik|jinoyat)\s+kodeks|(?:kodeks|qonun|konvensiya|nizom|qaror)[a-zʻʼ]*\s+\d+(?:[.-]\d+)*\s?-\s?modda|(?<![a-zʻʼ])(?:TIR|CMR)\s+konvensiya|(?<![a-zʻʼ])(?:shu|ushbu|mazkur|o[ʻ'’‘]sha)\s+(?:nizom|qaror|kodeks|qonun|konvensiya|modda)|(?<![a-zʻʼ])nizom(?:ga|da|ning)\s+(?:ko[ʻ'’‘]ra|\d)`,
  String.raw`\d\s?-\s?сон(?:ли)?\s+(?:қарор|қонун|фармон|буйруқ)|(?<![а-яёўқғҳ])(?:божхона|солиқ|фуқаролик|жиноят)\s+кодекс|(?:кодекс|қонун|конвен[цс]ия|низом|қарор)[а-яёўқғҳ]*\s+\d+(?:[.-]\d+)*\s?-\s?модда|(?:TIR|CMR)\s+конвен[цс]ия|(?<![а-яёўқғҳ])(?:шу|ушбу|мазкур|ўша)\s+(?:низом|қарор|кодекс|қонун|конвен[цс]ия|модда)|(?<![а-яёўқғҳ])низом(?:га|да|нинг)\s+(?:кўра|\d)`,
  // ru: «Таможенный кодекс», «Кодекс … об административной …», «постановлением № 737», «Указ … УП-174», «Конвенция МДП»,
  // «статья 218 Таможенного кодекса», «п. 12 Положения», «Положение, утверждённое …», «по тому же Положению»
  String.raw`(?<![а-яё])(?:таможенн|налогов|гражданск|уголовн)[а-яё]*\s+кодекс|кодекс[а-яё]*\s+(?:[а-яё]+\s+){0,3}?об\s+административн|(?<![а-яё])(?:постановлени|указ|закон|положени)[а-яё]*[^!?;]{0,60}?№\s?(?:[А-ЯЁA-Z]{1,4}-)?\d|(?<![а-яё])(?:указ|закон)[а-яё]*\s+[^!?;]{0,40}?(?:УП|ПП|ПФ|ЗРУ)-\d|конвенци[а-яё]*\s+(?:МДП|TIR|CMR|КДПГ|о\s+договоре|о\s+международн)|(?<![а-яё])(?:стать[яиеюёй]|ст\.|пункт[а-яё]*|п\.)\s?\d+[^.!?;]{0,40}?(?:кодекс|закон|конвенци|положени|постановлени)|(?<![а-яё])положени[а-яё]*,?\s+утвержд[её]нн|(?<![а-яё])(?:т(?:ого|ому|ем|ой|ом)\s+же|эт(?:ого|ому|им|ой|ом)|данн(?:ого|ому|ым|ой|ом)|указанн(?:ого|ому|ым|ой|ом))\s+(?:положени|постановлени|кодекс|закон|конвенци|стать)`,
  // en: "Customs Code", "Resolution No. 737", "Decree No. UP-174", "TIR Convention", "Article 218 of the Customs Code",
  // "the Regulation approved by", "the same Regulation"
  String.raw`\b(?:customs|tax|civil|criminal|administrative(?:\s+liability)?)\s+code\b|\b(?:resolution|decree|law|regulation)\s+No\.?\s?(?:[A-Z]{1,4}-)?\d|\b(?:TIR|CMR)\s+convention\b|\bconvention\s+on\s+the\s+(?:contract|international)\b|\b(?:articles?|art\.)\s?\d+[\w()-]*\s+of\s+the\s+(?:[\w-]+\s+){0,4}?(?:code|convention|law|regulation|resolution|decree)\b|\bregulation\s+approved\s+by\b|\b(?:the\s+same|this|that)\s+(?:regulation|resolution|code|convention|law|decree|article)\b`,
  // zh: 《海关法典》, 第 737 号决议, TIR 公约, 该条例
  String.raw`《[^》]{1,30}(?:法典|法|公约|条例|决议|规定)》|第\s?\d+\s?号(?:决议|总统令|令|法)|(?:TIR|CMR)\s?公约|(?:该|同一|上述|此)(?:条例|决议|法典|公约|法律|条)`,
  // fa: «مادهٔ ۲۱۸ قانون گمرک», «قانون گمرک», «مصوبهٔ شمارهٔ ۷۳۷», «کنوانسیون TIR», «همین مقررات»
  String.raw`ماده(?:\p{Mn}|ی|\p{Cf}ی)?\s\d+\s(?:[\p{Script=Arabic}\p{Cf}\p{Mn}]+\s){0,2}?(?:قانون|کنوانسیون|مقررات|آیین[\s\p{Cf}]?نامه|مصوبه)|قانون\s(?:گمرک|مالیات|مدنی|مجازات)|مصوبه(?:\p{Mn}|ی)?\s(?:شماره(?:\p{Mn}|ی)?\s)?\d|کنوانسیون\s(?:TIR|CMR|تیر)|(?<!\p{Script=Arabic})(?:همین|این|آن)\s(?:مقررات|مصوبه|قانون|آیین[\s\p{Cf}]?نامه|کنوانسیون|ماده)(?!\p{Script=Arabic})`,
].join('|'), 'iu');
/** What lets a figure through on a guide page: its source of law in the same sentence, or the China → Tashkent route. */
export const GUIDE_FIGURE_OK = { test: (s) => REQUEST_FIGURE_OK.test(s) || LAW_SOURCE.test(s) };

// Who clears customs on the Afghan side (owner, 2026-11-12, FACTS §12.1): GSR's partners, customs agents (declarants).
// A clearance word beside "in Afghanistan / on the Afghan side" passes only in a sentence that names them as such and
// gives them nothing more to do (§4a: no cargo handled, not "ourselves", not the consignee's agent, nobody paying the
// duties); an Incoterm or a payment of the duties (DDP, "duties included", «boj va soliq … narxga kiradi», 包税 / 含关税,
// «عوارض گمرکی در قیمت») never does — who pays the Afghan duties is not confirmed. The manager still explains which
// procedure and which documents apply there (row 76), in a sentence of its own or beside the partner sentence.
// Since the guard verification (2026-11-13) the Incoterm / duties words are read beside the Afghan name in ANY case form
// («Afgʻonistonga DDP shartida», "to Afghanistan on DDP terms"), and in a partner sentence across ";" as well: a table row
// "…our partners — customs agents (declarants); duties included." is the same claim (the other cancel words keep ";").
const customs = (o) => `(?:${nearName({ ...o, words: o.clear })}${partnersOk(o.ok)})|(?:${nearName({ ...o, name: o.ok.name, words: o.ok.incl })})|(?:${unlessDenied(o.ok.afghanDuties, { stop: o.ok.stop, no: o.ok.no, asks: o.asks })})` +
  `|(?:${partnerSentence(o.ok, [o.ok.ourselves, o.ok.consignee].join('|'), o.asks)})|(?:${partnerSentence({ ...o.ok, stop: o.ok.stop.replace(/[;؛；]/g, '') }, o.ok.incl, o.asks)})`;
const UZ_CUSTOMS = customs({ name: `(?<![a-zʻʼ])(?:Afg${AP}?oniston(?:da|dagi|\\s+tomon[a-zʻʼ]*|\\s+bojxona[a-zʻʼ]*)|(?:Hayraton|Mozori\\s+Sharif)(?:da|dagi|gacha))(?![a-zʻʼ])`, clear: `bojxona(?:ni|sini|dan|da)?\\s+(?:ham\\s+)?(?:rasmiylashtir|o${AP}?zimiz|o${AP}?tkaz)|bojxona\\s+rasmiylashtiruv[a-zʻʼ]*|rastamojka|(?<![a-zʻʼ])(?<!${UZ_DOCS})rasmiylashtiramiz(?![a-zʻʼ])`, no: UZ_NO, asks: '\\?', ok: UZ_PARTNERS });
const UZC_CUSTOMS = customs({ name: '(?<![а-яёўқғҳ])(?:Афғонистон(?:да|даги|\\s+томон[а-яёўқғҳ]*|\\s+божхона[а-яёўқғҳ]*)|(?:Ҳайратон|Мозори\\s+Шариф)(?:да|даги|гача))(?![а-яёўқғҳ])', clear: 'божхона(?:ни|сини|дан|да)?\\s+(?:ҳам\\s+)?(?:расмийлаштир|ўзимиз|ўтказ)|божхона\\s+расмийлаштирув[а-яёўқғҳ]*|растаможка|(?<![а-яёўқғҳ])(?<!(?:ҳужжат|декларация|ариза|маълумот|инвойс)[а-яёўқғҳ]*\\s+(?:[а-яёўқғҳ]+\\s+){0,2})расмийлаштирамиз(?![а-яёўқғҳ])', no: UZC_NO, asks: '\\?', ok: UZC_PARTNERS });
const RU_CUSTOMS = customs({ name: '(?<![а-яё])(?:в\\s+(?:Афганистане|Хайратоне|Мазари[\\s-]*Шарифе)|на\\s+афганской\\s+(?:стороне|границе)|афганск[а-яё]+\\s+(?:таможн|границ)[а-яё]+|до\\s+(?:Хайратона|Мазари[\\s-]*Шарифа))', clear: 'растамож[а-яё]+|таможенн[а-яё]+\\s+(?:оформлени|очистк|формальност)[а-яё]*|(?<![а-яё])оформ(?:им|ит|ят|ляем|ляет|ляют|ление|лением|ления|лять|ить)\\s+(?:[а-яё]+\\s+){0,3}?(?:на\\s+|через\\s+)?таможн[а-яё]*|(?<![а-яё])таможн(?:ю|е)\\s+(?:[а-яё]+\\s+){0,2}?оформ[а-яё]*', no: RU_NO, asks: '\\?', ok: RU_PARTNERS });
const EN_CUSTOMS = customs({ name: '\\b(?:in\\s+Afghanistan|on\\s+the\\s+Afghan\\s+side|Afghan\\s+(?:customs|border|frontier)|(?:to|at|in)\\s+(?:Ha[iy]rat[ao]n|Mazar[\\s-]*[ie][\\s-]*Sharif))\\b', clear: '\\b(?:customs\\s+)?clearance\\b|\\bclear(?:s|ed|ing)?\\s+(?:the\\s+|your\\s+|all\\s+)?(?:(?:cargo|goods|shipments?|consignments?|trucks?|loads?)\\s+(?:through\\s+|at\\s+|with\\s+)?)?customs\\b|\\bclear(?:s|ed|ing)?\\s+(?:the\\s+|your\\s+)?(?:cargo|goods|shipments?|consignments?)\\b|\\b(?:handle[sd]?|handling|arrange[sd]?|arranging|manage[sd]?|managing|take\\s+care\\s+of|takes\\s+care\\s+of|took\\s+care\\s+of)\\s+(?:the\\s+|all\\s+)?customs\\b|\\bcustoms\\s+(?:formalities|paperwork|brokerage)\\b|\\bdeclar(?:e|es|ed|ing)\\s+(?:the\\s+|your\\s+)?(?:cargo|goods)\\b', no: EN_NO, asks: '\\?', ok: EN_PARTNERS });
const ZH_CUSTOMS = customs({ name: '(?:阿富汗(?:一侧|境内|方面|海关|边境)|在阿富汗|(?:至|到|在)(?:海拉顿|马扎里沙里夫))', clear: '清关|报关|通关|海关手续', span: 14, stop: ZH_STOP, no: ZH_NO, asks: '吗|？|\\?|说明|告知', ok: ZH_PARTNERS });
const FA_CUSTOMS = customs({ name: '(?<!\\p{Script=Arabic})(?:در\\s(?:سمت\\s)?افغانستان|سمت\\sافغانستان|گمرک\\sافغانستان|در\\s(?:حیرتان|مزار[\\s\\p{Cf}]?شریف))', clear: 'ترخیص|طی\\sمراحل\\sگمرکی|تشریفات\\sگمرکی', stop: `${FA_STOP}؛;`, no: FA_NO, asks: '؟', ok: FA_PARTNERS });
const CUSTOMS_MSG = (lang) => `customs clearance in Afghanistan not by GSR's partners named as customs agents (declarants) — or with the cargo handled, "ourselves", GSR's own broker or the consignee in the sentence — or a DDP / "duties included" / who-pays claim (${lang}) — owner, 2026-11-12: on the Afghan side customs is cleared by GSR's partners, customs agents (declarants), named as such in the same sentence; still no office, branch, representative, employee or warehouse there; who pays the Afghan duties is not confirmed: no DDP, no "duties included" (a denial passes)`;

/* ── Wholesale buying: the employees' Chinese, no promise on price or quality, no factory visit ──────────────────── */

/*
 * Owner, 2026-11-17: the company has employees who know Chinese, with experience of purchasing in China, who work on buying
 * from factories and buying wholesale from sellers. Owner, 2026-11-18 (second message): they are FOUR — THREE work in Tashkent
 * and ONE in Yiwu. Owner, 2026-11-18 (third and fourth messages): TWO of the four hold an official HSK 6 certificate (the two
 * others hold lower levels, which the owner chose not to publish), so "four employees who know Chinese at HSK 6 level" is
 * WITHDRAWN; the employees negotiate with factories without travelling there, and the client may have the company send its
 * employee in China to the factory for an additional fee. Which holder works where is not known. And no result is promised to
 * a buyer: not the best or the cheapest price, no guaranteed quality, no "100%", no "no risk". Five rule families, each in all
 * five written languages, the Uzbek ones with their Cyrillic twin:
 *
 *   hskCertificate  «HSK» beside a diploma, "certified", native-speaker, translator / interpreter, sinologist or "fluent" word
 *                   (`*_HSK_PAPER`); beside a holding word — "holds / holders / passed / obtained HSK 6", «topshirgan»,
 *                   «… HSK 6 bor», «сдали», 持有 / 通过, «دارند» (`*_HSK_HOLD`) — or a certificate word (`*_HSK_CERT`, in a
 *                   sentence that names a holder: staff, "we / our / they") that is not the two's: no exact two (`*_HSK_TWO`)
 *                   in its clause; and any HSK level other than 6 (HSK 1–5, 7–9; no live page names one). In one sentence —
 *                   a semicolon does not end it. The window is 40 characters before «HSK» and 80 after it (ru 80 before and
 *                   40 after, zh 20 / 30, fa 40 / 60). What passes: "two of them hold an HSK 6 certificate", "two with an
 *                   HSK 6 certificate", «HSK 6 — 2 employees with this certificate»; the test's own certificate in a sentence
 *                   that names no holder ("its certificate shows the level passed", "what is an HSK 6 certificate, and who
 *                   holds one?"); what the test is — for people whose first language is NOT Chinese («ona tili boʻlmagan /
 *                   hisoblanmaydigan», «не носителей», "whose native language is not Chinese", 非中文母语者, «زبان مادری‌شان
 *                   … نیست / غیر از چینی»); and "you need no interpreter" («tarjimon kerak emas», «переводчик не нужен», 不用请
 *                   翻译, «به مترجم نیاز ندارید»). Stopped: a certificate for all, four, three, one or every employee,
 *                   "certified staff / team / translators", HSK 5, HSK 3; a credential for staff without «HSK» ("all four
 *                   are certified", `*_STAFF_CREDENTIAL`).
 *   hskPlace        the certificate tied to a place (`*_HSK_PLACE`; review fixes, 2026-11-18): "two of them" right after a
 *                   place ("…and one in Yiwu, and two of them hold an HSK 6 certificate"), a two with a place in one clause
 *                   ("two of our employees in Tashkent hold …", «Toshkentdagi ikki xodimimizda …», 我们在塔什干的两名员工…).
 *                   After a place clause the two is "of the four" (DESIGN §14a), and that passes. Its own family: inside
 *                   hskCertificate the Uzbek pattern grew past 20 KB, which V8 does not optimise.
 *   hskCount        the count of people that stands NEAREST to «HSK» in its sentence is not an exact two (hskNearest): a
 *                   count before «HSK» with no two between them and none after «HSK» in its clause, or a count after «HSK»
 *                   in its clause with no two before it. Stopped: "four employees who know Chinese at HSK 6 level" (the
 *                   round-3 sentence), "all four … HSK 6", "three of them hold an HSK 6 certificate", «HSK 6 — 4 employees»,
 *                   «12 nafar», "a team of 12", "10+ employees", "dozens of", «несколько сотрудников», 十多名员工, a two made
 *                   vague or part of a range ("more than two", "2+", "2–3", "two or three", «ikki-uch», 两到三名, «دو یا سه»).
 *                   Passes: "we have four employees who know Chinese; two of them hold an HSK 6 certificate", "four employees
 *                   who know Chinese: three work in Tashkent and one in Yiwu, and two of the four hold an HSK 6 certificate",
 *                   "two of our four employees …". Also stopped (hskLevel): the withdrawn predicate "know Chinese at HSK 6
 *                   level" said of staff with no two in its clause, even with no count ("we have employees who know Chinese
 *                   at HSK 6 level", «HSK 6 darajasida biladigan xodimlarimiz», «на уровне HSK 6», 达到 HSK 6 级水平,
 *                   «در سطح HSK 6»). A BLOCK rule (`block: true`): its unit is the sentence, and in the joined
 *                   text of a page the number, the name and the one-liner of a card run on without a full stop. The 6 of
 *                   «HSK 6» is the level, never a count; a count of anything but people — «5 000 ta soʻz», "9 levels", "six
 *                   steps and employees who …", 4 个阶段, 3 个工作日 — is none either, and neither is the one manager a client
 *                   works with («1 ta menejer bilan», «один менеджер», 一位客户经理, «یک کارشناس»).
 *   pricePromise    "the best / the cheapest price", "we guarantee the … price / quality", "quality guarantee",
 *                   "guaranteed quality / prices", "our prices are the lowest", "100%", "no risk", "risk-free". What
 *                   passes: a denial in the same sentence, in its usual wordings and on the side the language puts it
 *                   ("we do not promise the best price", "nobody can promise …", «kafolatlamaymiz», «никто не пообещает»,
 *                   最便宜的价格我们不承诺, «نمی‌توانیم … تضمین کنیم»); the word inside quotation marks («100% kafolat» …
 *                   demaymiz); a question answered "No" ("Does a sample guarantee the quality …? No."); a price statement
 *                   that is nobody's promise ("the cheapest price is not always the best choice"); a platform's own price
 *                   with the platform as its subject ("Pinduoduo has the cheapest prices of the three platforms", «… eng
 *                   arzon narxlar Pinduoduoda», «самые дешёвые цены — на Pinduoduo»); a factory's warranty («заводская
 *                   гарантия качества», «zavodning sifat kafolati», 质量保证期). A bare "lowest price" is not read: the guides
 *                   say "the lowest price shown in the listing is for the largest batch", which is a seller's price and
 *                   nobody's promise.
 *   factoryVisit    "we / our employees visit (go to, travel to) the factory", "we inspect / audit the factory on site / in
 *                   person", "we send our employee to the factory", "a factory visit is included / part of the service" —
 *                   unless the same sentence denies it or makes it the client's choice or an extra (see the block above
 *                   VISIT_MSG). The published "if needed, visit the factory" of the sourcing page passes for that reason.
 */
const HSK = '(?<![A-Za-z])HSK(?:(?:ning|ni|ga|dan|dagi|da)(?![A-Za-zʻʼ]))?(?![A-Za-z])';
/** `words` within `span` characters of «HSK», either order, in one sentence. */
const besideHsk = (words, stop, before = 40, after = before) => `${HSK}[^${stop}]{0,${after}}?(?:${words})|(?:${words})[^${stop}]{0,${before}}?${HSK}`;
// «ona tili» with its negation after it, «носитель» / "native" with it before, 母语 with 非 on either side: the definition of the test.
// Owner, 2026-11-18: TWO of the four employees hold an HSK 6 certificate. So the words split in three: `*_HSK_PAPER` is never
// beside HSK (diploma, "certified", native speaker, translator, sinologist, "fluent"); `*_HSK_HOLD` (holds / holders / passed /
// «bor» / 持有 / «دارند») and `*_HSK_CERT` (certificate) are beside HSK only as the two's (`notTwos`); a certificate in a sentence
// that names no holder at all — «its certificate shows the level passed», "what is an HSK 6 certificate?" — is the test's own.
const UZ_HSK_PAPER = `diplom|attestat|ona\\s+til(?:i|idek|iday)(?![^.!?;]{0,30}(?:bo${AP}?lma(?:gan|ydi)|hisoblanma(?:gan|ydi)|bilma(?:gan|ydi)|emas))|sinolog|xitoyshunos|tarjimon(?!siz(?![a-zʻʼ])|(?:ga|ni)?\\s+(?:[a-zʻʼ]+\\s+){0,2}?(?:(?:kerak|shart|zarur|lozim|hojat)\\s+(?:emas|yo${AP}?q)|kerak\\s+bo${AP}?lmaydi))`;
const UZC_HSK_PAPER = 'диплом|аттестат|она\\s+тил(?:и|идек|идай)(?![^.!?;]{0,30}(?:бўлма(?:ган|йди)|ҳисобланма(?:ган|йди)|билма(?:ган|йди)|эмас))|синолог|хитойшунос|таржимон(?!сиз(?![а-яёўқғҳ])|(?:га|ни)?\\s+(?:[а-яёўқғҳ]+\\s+){0,2}?(?:(?:керак|шарт|зарур|лозим|ҳожат)\\s+(?:эмас|йўқ)|керак\\s+бўлмайди))';
const RU_HSK_PAPER = 'сертифицирован|диплом|аттестат|(?<!(?<![а-яё])не(?:\\s*|\\s+(?:[а-яё]+\\s+){1,2}))носител[а-яё]+|как\\s+(?:на\\s+)?родн|синолог|китаист|свободно\\s+владе|в\\s+совершенстве|(?<!(?<![а-яё])(?:без\\s+|не\\s+(?:нужно|надо|нужен|нужны|прид[её]тся|понадобится|понадобятся|требуется)\\s+(?:[а-яё]+\\s+){0,2}?))переводчик(?![а-яё]*\\s+(?:[а-яё]+\\s+){0,2}?не\\s+(?:нуж|понадоб|потреб|прид[её]тся|требу))';
const EN_HSK_PAPER = `\\bcertified\\b|\\bdiploma|\\bnative[-\\s](?:level|like|fluency|proficiency|Chinese)\\b|\\bnear[-\\s]native\\b|\\b(?:like|as)\\s+(?:an?\\s+)?native\\b(?!\\s+(?:language|tongue))|(?<!\\bnon[-\\s]|\\bnot\\s+|n[’']t\\s+)\\bnative\\s+speakers?\\b|(?<!\\b(?:not|n[’']t)\\s+(?:[a-z]+\\s+){0,3})\\b(?:like|as)\\s+(?:their|his|her|a)\\s+native\\s+(?:language|tongue)\\b|\\bsinolog|\\bfluent|(?<!\\b(?:no|nor|neither|without)\\s+(?:an?\\s+|any\\s+)?|(?:\\bnot|n[’']t|\\bnever)\\s+(?:(?:have|need)\\s+to\\s+)?(?:need|hire|find|bring|pay\\s+for|look\\s+for)\\s+(?:an?\\s+|any\\s+|your\\s+own\\s+|a\\s+separate\\s+)?|\\bno\\s+need\\s+(?:for|to\\s+(?:hire|find|bring|pay\\s+for|look\\s+for))\\s+(?:an?\\s+|any\\s+|your\\s+own\\s+|a\\s+separate\\s+)?|\\bwithout\\s+(?:hiring|finding|bringing|paying\\s+for)\\s+(?:an?\\s+|any\\s+)?)\\b(?:translators?|interpreters?)\\b(?!\\s+(?:is|are)\\s+not\\s+(?:needed|required|necessary))`;
const ZH_HSK_PAPER = `认证|(?<!非(?:中文|汉语|华语|普通话)?)母语(?!非|不是|并非)|汉学|精通|文凭|${zhNot(6)}翻译`;
const FA_HSK_PAPER = `دیپلم|زبان\\sمادری(?![^${FA_STOP}؛;]{0,30}(?:نیست|نباشد|غیر[\\s\\p{Cf}]?(?:از|چینی)))|(?<!بدون\\s)مترجم(?![^${FA_STOP}؛;:]{0,20}(?:نیست|ندار|نمی[\\s\\p{Cf}]?خواه))|مسلط|چین[\\s\\p{Cf}]?شناس`;
// holding the level: the verb or the "holder" — allowed for two only
const UZ_HSK_HOLD = `imtihon[a-zʻʼ]*\\s+topshir(?:gan|di|ishgan|ib)|(?<=HSK[a-z-]{0,5}\\s(?:\\d\\s)?)topshir(?:gan|di|ishgan|ib)|daraja[a-zʻʼ]*\\s+olgan|(?<=HSK\\s?\\d?\\s)bor(?![a-zʻʼ])`;
const UZC_HSK_HOLD = 'имтиҳон[а-яёўқғҳ]*\\s+топшир(?:ган|ди|ишган|иб)|(?<=HSK[а-яёўқғҳ-]{0,5}\\s(?:\\d\\s)?)топшир(?:ган|ди|ишган|иб)|даража[а-яёўқғҳ]*\\s+олган|(?<=HSK\\s?\\d?\\s)бор(?![а-яёўқғҳ])';
const RU_HSK_HOLD = '(?<![а-яё])(?:сда(?:л|ли|ла|вш)[а-яё]*|получи(?:л|ли|ла|вш)[а-яё]*|подтверди(?:л|ли|ла|вш)[а-яё]*|есть)(?=\\s+(?:экзамен\\s+|уровень\\s+)?HSK)';
const EN_HSK_HOLD = `\\bholders?\\b|\\b(?:have|has|having)(?=\\s+(?:(?:an?|the|their)\\s+)?(?:official\\s+)?HSK)|(?<!\\bwho\\s+)\\b(?:holds?|holding)\\b|\\b(?:pass(?:ed|es|ing)?|took|taken|sat|earned|obtained|achieved)(?=\\s+(?:(?:the|an?|their)\\s+)?HSK)`;
const ZH_HSK_HOLD = `持证|${zhNot(6)}持有|(?:通过|考取|考过|考了|取得|获得|拿到|拥有)了?(?=\\s?HSK)|有(?=\\s?HSK\\s?\\d\\s?级(?!水平))`;
const FA_HSK_HOLD = '(?<=HSK\\s?\\d?\\s(?:را\\s)?)(?:گذراند|قبول\\sشد|دار(?:ند|د|یم)(?!\\p{Script=Arabic}))';
// the certificate itself — not the test's own («its certificate»)
const UZ_HSK_CERT = '(?<!uning\\s+)(?:sertifikat|guvohnoma)';
const UZC_HSK_CERT = '(?<!унинг\\s+)(?:сертификат|гувоҳнома)';
const RU_HSK_CERT = '(?<!(?<![а-яё])(?:его|её|ее)\\s+)(?:сертификат|свидетельств)';
const EN_HSK_CERT = '(?<!\\bits\\s+)\\bcertificat(?:e|es|ion)\\b';
const ZH_HSK_CERT = '(?<![其该])证书';
const FA_HSK_CERT = '(?:گواهی|مدرک)(?![\\s\\p{Cf}]?(?:آن|اش)(?!\\p{Script=Arabic}))';
// who could hold it: staff words and "we / our / they" — a sentence without one of them speaks of the test, not of a holder
const UZ_HSK_HOLDER = `(?<![a-zʻʼ])(?:xodim|hodim|mutaxassis|menejer|tarjimon|xaridor|jamoa|GSR|hamma|barcha|har\\s+bir|(?:biz|ular)(?:da|ning)?(?![a-zʻʼ])|(?:to${AP}?rt|uch|bit)ta(?:la)?(?:si)?(?:da|ning)?(?![a-zʻʼ]))`;
const UZC_HSK_HOLDER = '(?<![а-яёўқғҳ])(?:ходим|мутахассис|менежер|таржимон|харидор|жамоа|GSR|ҳамма|барча|ҳар\\s+бир|(?:биз|улар)(?:да|нинг)?(?![а-яёўқғҳ])|(?:тўрт|уч|бит)та(?:ла)?(?:си)?(?:да|нинг)?(?![а-яёўқғҳ]))';
const RU_HSK_HOLDER = '(?<![а-яё])(?:сотрудник[а-яё]*|специалист[а-яё]*|менеджер[а-яё]*|закупщик[а-яё]*|байер[а-яё]*|переводчик[а-яё]*|команд[а-яё]*|персонал[а-яё]*|мы|нас|наш[а-яё]*|они|их|них|GSR|все|всех|оба|обе|обоих|кажд[а-яё]*|четверо|четверых|трое|троих|один|одного|одному|одним)(?![а-яё])';
const EN_HSK_HOLDER = '\\b(?:employees?|staff|team|buyers?|specialists?|managers?|translators?|interpreters?|colleagues?|personnel|we|our|us|they|them|GSR|all|both|each|every(?:one|body)?|one|three|four)\\b';
const ZH_HSK_HOLDER = '员工|专员|采购员|经理|翻译|人员|团队|我们|我司|他们|其中';
const FA_HSK_HOLDER = '(?<!\\p{Script=Arabic})(?:(?:کارمند|کارکن|کارشناس|خریدار|مترجم|همکار)[\\p{Script=Arabic}\\p{Cf}]*|تیم|ما|آنان|آنها|ایشان)(?!\\p{Script=Arabic})';
// any HSK level but 6 (owner, 2026-11-18: HSK 5 and HSK 3 are not published; no live page names another level)
const HSK_OTHER_LEVEL = '(?<![A-Za-z])HSK[\\s-]?(?:\\(?\\s?(?:level|daraja|даража|уровень|уровня|سطح)\\s?)?(?:[1-57-9](?![\\d])|[一二三四五七八九]\\s?级)|(?<![A-Za-z])HSK[\\s-](?:one|two|three|four|five|seven|eight|nine)\\b';
/**
 * Exactly TWO, the count the owner confirmed for the certificate (2026-11-18): the digit 2 or the word, not made vague ("more
 * than two", «kamida ikkita», «не менее двух», 至少两名, «بیش از دو»), not the second number of a range or a choice ("1–2",
 * "one or two"), not the first of one ("2–3", «ikki-uch», «два-три», 两到三名, «دو یا سه»), and not a figure of anything else
 * ("2%", "2 days", «2 kun», «2 дня», «۲ روز»). In Chinese only with 名 / 位 / 人.
 */
const EN_HSK_TWO = '(?<!\\b(?:more\\s+than|over|at\\s+least|up\\s+to|about|around|roughly|nearly|almost|approximately|fewer\\s+than|less\\s+than|under|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)[\\s-]+)(?<![+$])(?<!(?:(?<!HSK\\s?)\\d|\\b(?:one|two|three|four|five|six|seven|eight|nine|ten))(?:\\s?[–-]\\s?|\\s+(?:or|to)\\s+))\\b(?:2|two)\\b(?!\\+|[.,]\\d|\\s?[–-]\\s?(?:\\d|one|two|three|four|five|six)\\b|\\s+(?:or|to)\\s+(?:\\d|one|three|four|five|six|seven|eight|nine|ten)\\b|\\s+(?:or|and)\\s+(?:more|over|above)\\b|[\\s-]?plus\\b|\\s?%|\\s+(?:percent|per\\s?cent|days?|weeks?|months?|years?|hours?|kg|times|levels?|steps?|routes?|ways?)\\b)';
const UZ_HSK_TWO = `(?<!(?<![a-zʻʼ])(?:kamida|taxminan|tahminan|qariyb|deyarli|o${AP}?n|yigirma|o${AP}?ttiz|qirq|ellik|oltmish|yetmish|sakson|to${AP}?qson|yuz)\\s+)(?<![+$])(?<!(?:(?<!HSK\\s?)\\d|(?<![a-zʻʼ])(?:bir|ikki|uch|to${AP}?rt|besh|olti|yetti|sakkiz|to${AP}?qqiz|o${AP}?n)(?:ta)?)(?:\\s?[–-]\\s?|\\s+yoki\\s+))(?:(?<![\\d.,])2(?![\\d.,+])(?!\\s?(?:%|foiz|kun|hafta|oy(?![a-zʻʼ])|yil|soat|kg|marta|daraja|bosqich))|(?<![a-zʻʼ])ikki(?=ta|ov|ala|(?![a-zʻʼ])))(?![^.!?;:,]{0,16}?dan\\s+(?:ortiq|ko${AP}?p|ziyod|oshiq|kam))(?![a-zʻʼ]*\\s?[–-]\\s?(?:uch|to${AP}?rt|besh|\\d))(?![a-zʻʼ]*\\s+yoki\\s+(?:uch|to${AP}?rt|besh|\\d))`;
const UZC_HSK_TWO = '(?<!(?<![а-яёўқғҳ])(?:камида|тахминан|қарийб|деярли|ўн|йигирма|ўттиз|қирқ|эллик|олтмиш|етмиш|саксон|тўқсон|юз)\\s+)(?<![+$])(?<!(?:(?<!HSK\\s?)\\d|(?<![а-яёўқғҳ])(?:бир|икки|уч|тўрт|беш|олти|етти|саккиз|тўққиз|ўн)(?:та)?)(?:\\s?[–-]\\s?|\\s+ёки\\s+))(?:(?<![\\d.,])2(?![\\d.,+])(?!\\s?(?:%|фоиз|кун|ҳафта|ой(?![а-яёўқғҳ])|йил|соат|кг|марта|даража|босқич))|(?<![а-яёўқғҳ])икки(?=та|ов|ала|(?![а-яёўқғҳ])))(?![^.!?;:,]{0,16}?дан\\s+(?:ортиқ|кўп|зиёд|ошиқ|кам))(?![а-яёўқғҳ]*\\s?[–-]\\s?(?:уч|тўрт|беш|\\d))(?![а-яёўқғҳ]*\\s+ёки\\s+(?:уч|тўрт|беш|\\d))';
const RU_HSK_TWO = '(?<!(?<![а-яё])(?:более|больше|свыше|около|почти|порядка|примерно|приблизительно|до|от|менее|меньше|чем|двадцат[ьи]|тридцат[ьи]|сорок|пятьдесят|шестьдесят|семьдесят|восемьдесят|девяносто|сто)\\s+)(?<![+$])(?<!(?:(?<!HSK\\s?)\\d|(?<![а-яё])(?:один|одна|два|две|двое|три|трое|четыре|четверо|пять|пятеро|шесть|шестеро))(?:\\s?[–-]\\s?|\\s+или\\s+))(?:(?<![\\d.,])2(?![\\d.,+])(?!\\s?(?:%|процент|дн|недел|месяц|год|лет|час|кг|раз(?![а-яё])|уровн|шаг|этап))|(?<![а-яё])(?:два|две|двое|двоих|двух|двум|двумя|двоим|двоими)(?![а-яё]))(?!\\s?[–-]\\s?(?:три|трое|четыре|\\d))(?!\\s+или\\s+(?:три|трое|четыре|\\d))(?!\\s+(?:и|или)\\s+(?:более|больше)(?![а-яё]))';
const ZH_HSK_VAGUE = '超过|超出|至少|不少于|多于|将近|大约|约|近|不到|少于|最多|多达';
const ZH_HSK_TWO = `(?<!(?:${ZH_HSK_VAGUE})\\s?)(?<![+\\d]\\s?)(?<![一二三四五六七八九十百千\\d](?:\\s?(?:[–~～-]|至|到|或)\\s?)?)(?:2|两|二)\\s?(?:名|位|人|个人)(?![及或]?以[上下]|多|余|来|到|至|或|[–~～-])`;
const FA_HSK_TWO = `(?<!(?<!\\p{Script=Arabic})(?:(?:بیش|بیشتر|کمتر|کم[\\s\\p{Cf}]تر)\\sاز|حدود|حدوداً|تقریباً|تقریبا|دست[\\s\\p{Cf}]?کم|حداقل|حداکثر|تا|نزدیک[\\s\\p{Cf}]به|بالغ\\sبر|بیست|سی|چهل|پنجاه|شصت|هفتاد|هشتاد|نود|صد)(?:\\sو)?\\s)(?<![+$])(?<!(?:\\d|(?<!\\p{Script=Arabic})(?:یک|دو|سه|چهار|پنج|شش|هفت|هشت|ده))(?:\\s?[–-]\\s?|\\sیا\\s))(?:(?<![\\d.,])2(?![\\d.,+%٪])(?!\\s?(?:روز|هفته|ماه|سال|ساعت|کیلو|بار(?!\\p{Script=Arabic})|سطح|مرحله))|(?<!\\p{Script=Arabic})دو(?!\\p{Script=Arabic}))(?![^${FA_STOP}؛;،,]{0,20}?\\s(?:یا|و)\\sبیشتر)(?!\\s?[–-]\\s?(?:\\d|سه|چهار))(?!\\sیا\\s(?:\\d|سه|چهار|پنج))`;
/** A certificate word that is not the two's: no exact two in its clause, up to 60 characters before it or 40 after it. */
const notTwos = (words, two, clause) => `(?=(?:${words}))(?<!(?:${two})[^${clause}]{0,60}?)(?:${words})(?![^${clause}]{0,40}?(?:${two}))`; // the lookahead first: the lookbehind runs where a word starts only
/** …unless the sentence asks ("how many of your employees hold one?" — the answer is the claim, and it is read). */
const NO_QUESTION = (stop) => `(?![^${stop}]*[?？؟])`;
/**
 * hskCertificate in one language: a PAPER word beside «HSK»; a HOLD word beside it that is not the two's; a CERT word beside it
 * that is not the two's, in a sentence that names a holder; another HSK level than 6. The holding and the certificate parts do not read a question.
 */
const hskPaper = ({ paper, hold, cert, holder, two, stop, clause, before, after }) => [
  besideHsk(paper, stop, before, after),
  `(?:${besideHsk(notTwos(hold, two, clause), stop, before, after)})${NO_QUESTION(stop)}`,
  `(?<=^|[${stop}])(?=[^${stop}]*?(?:${holder}))[^${stop}]*?(?:${besideHsk(notTwos(cert, two, clause), stop, before, after)})${NO_QUESTION(stop)}`,
  HSK_OTHER_LEVEL,
].map((part) => `(?:${part})`).join('|');
// A credential for staff without «HSK» in the sentence ("all four are certified", "certified translators"; owner, 2026-11-18:
// only two hold a certificate, and it is an HSK 6 one — see HSK_PAPER_MSG). Read beside a staff word or a quantifier only:
// "a certified producer", "certified with an electronic digital signature" are not about staff.
const EN_STAFF_CREDENTIAL = '\\b(?:all|both|each|every(?:one)?|four|three|one|we|they|employees?|staff|team|buyers?|specialists?|translators?|interpreters?)\\b[^.!?;]{0,40}?\\b(?:are|is|were|been|being)\\s+(?:all\\s+|also\\s+|fully\\s+|officially\\s+)?certified\\b|\\bcertified\\s+(?:Chinese[-\\s])?(?:translators?|interpreters?|staff|team|employees?|buyers?|specialists?|linguists?)\\b';
const RU_STAFF_CREDENTIAL = '(?<![а-яё])(?:все|оба|обе|каждый|четверо|трое|мы|они|наш[а-яё]*|сотрудник[а-яё]*|специалист[а-яё]*|переводчик[а-яё]*|закупщик[а-яё]*|команд[а-яё]*)(?![а-яё])[^.!?;]{0,40}?(?<![а-яё])сертифицирован|(?<![а-яё])сертифицированн[а-яё]+\\s+(?:переводчик|сотрудник|специалист|закупщик|команд|персонал)';
const UZ_STAFF_CREDENTIAL = `(?<![a-zʻʼ])(?:hamma|barcha|har\\s+bir|(?:to${AP}?rt|uch|bit)ta|biz|ular|xodim|hodim|mutaxassis|tarjimon|xaridor|jamoa)[^.!?;]{0,40}?sertifikatlan|sertifikatlangan\\s+(?:tarjimon|xodim|hodim|mutaxassis|xaridor|jamoa)`;
const UZC_STAFF_CREDENTIAL = '(?<![а-яёўқғҳ])(?:ҳамма|барча|ҳар\\s+бир|(?:тўрт|уч|бит)та|биз|улар|ходим|мутахассис|таржимон|харидор|жамоа)[^.!?;]{0,40}?сертификатлан|сертификатланган\\s+(?:таржимон|ходим|мутахассис|харидор|жамоа)';
const ZH_STAFF_CREDENTIAL = '(?:员工|专员|采购员|翻译|人员|团队|我们|他们|[一三四]名|四人|每人)[^。！？!?；;]{0,10}?(?:均|都)?(?:已)?(?:获得|通过|取得)了?(?:专业)?认证|(?:持证|认证|专业认证)的?(?:翻译|员工|专员|采购员|人员|团队)';
const FA_STAFF_CREDENTIAL = '(?<!\\p{Script=Arabic})(?:همه|هر\\s(?:چهار|سه)|کارمندان|کارکنان|کارشناسان|مترجمان|تیم)[^.؟!?؛;]{0,30}?(?:گواهی|مدرک)(?:[\\s\\p{Cf}]?نامه)?\\s(?:رسمی|معتبر)(?![^.؟!?؛;]{0,40}HSK)|مترجم(?:ان)?(?:[\\s\\p{Cf}]?(?:ما|مان))?\\s(?:رسمی|قسم[\\s\\p{Cf}]?خورده)';
// hskPlace — the certificate tied to a place (owner, 2026-11-18: which of the four holds a certificate and where each works is NOT known —
// "never combine a certificate with a place", DESIGN §14.1 and §14a). Stopped: the two's partitive of "them" right after a place
// ("…three work in Tashkent and one in Yiwu, and two of them hold an HSK 6 certificate": "them" reads as the one in Yiwu or the
// three in Tashkent), and a two with a place in one clause ("two of our employees in Tashkent hold …", «Toshkentdagi ikki
// xodimimiz…»). The two "of the four" names the whole group and passes: "…and one in Yiwu, and two of the four hold an official
// HSK 6 certificate", «…bittasi Ivuda ishlaydi; toʻrttasidan ikkitasi…», «…один — в Иу; у двоих из четырёх…», 「…一名在义乌工作；
// 四人中有两名…」, «…یک نفر در ییوو؛ دو نفر از این چهار نفر…».
const EN_HSK_PLACE_WORD = '\\b(?:Tashkent|Yiwu)\\b';
const EN_NOT_OF_FOUR = '(?!\\s+of\\s+(?:the|our|its|these|all|GSR[’\']s)\\s+(?:four|4)\\b)';
const EN_HSK_PLACE = [
  `(?=Tashkent|Yiwu)${EN_HSK_PLACE_WORD}[^.!?]{0,24}?\\b(?:two|2)\\b${EN_NOT_OF_FOUR}[^.!?]{0,80}?${HSK}`,
  `\\b(?:two|2)\\b${EN_NOT_OF_FOUR}[^.!?;,:()—–]{0,40}?\\b(?:in|at|from)\\s+${EN_HSK_PLACE_WORD}[^.!?;]{0,60}?${HSK}`,
  // the place after the certificate: "two … hold an HSK 6 certificate; one of them works in Yiwu" (final code review, 2026-11-18)
  `\\b(?:two|2)\\b${EN_NOT_OF_FOUR}[^.!?]{0,60}?${HSK}[^.!?]{0,60}?\\b(?:(?:one|both|each|either|neither)\\s+of\\s+them|both|they)\\b[^.!?]{0,30}?\\b(?:in|at|from)\\s+${EN_HSK_PLACE_WORD}`,
].join('|');
const UZ_HSK_PLACE_WORD = '(?:Toshkent|Ivu)(?:da|dagi)(?![a-zʻʼ])';
const UZ_HSK_PLACE_TWO = `(?<!to${AP}?rt(?:ta|tala)(?:si)?dan\\s)(?<![a-zʻʼ])(?:ulardan\\s+)?ikki(?:ta|ov|ala)?(?:si)?(?:da|ning)?(?![a-zʻʼ])`;
const UZC_HSK_PLACE_WORD = '(?:Тошкент|Иву)(?:да|даги)(?![а-яёўқғҳ])';
const UZC_HSK_PLACE_TWO = '(?<!тўрт(?:та|тала)(?:си)?дан\\s)(?<![а-яёўқғҳ])(?:улардан\\s+)?икки(?:та|ов|ала)?(?:си)?(?:да|нинг)?(?![а-яёўқғҳ])';
const UZ_HSK_PLACE = [
  `(?=Toshkent|Ivu)${UZ_HSK_PLACE_WORD}[^.!?]{0,24}?${UZ_HSK_PLACE_TWO}[^.!?]{0,80}?${HSK}`,
  `(?=ulardan|ikki)${UZ_HSK_PLACE_TWO}[^.!?;,:()—–]{0,40}?${UZ_HSK_PLACE_WORD}[^.!?;]{0,60}?${HSK}`,
  `(?=Тошкент|Иву)${UZC_HSK_PLACE_WORD}[^.!?]{0,24}?${UZC_HSK_PLACE_TWO}[^.!?]{0,80}?${HSK}`,
  `(?=улардан|икки)${UZC_HSK_PLACE_TWO}[^.!?;,:()—–]{0,40}?${UZC_HSK_PLACE_WORD}[^.!?;]{0,60}?${HSK}`,
  // the place after the certificate: «ikkitasida HSK 6 sertifikati bor, ulardan biri Ivuda ishlaydi» (final code review, 2026-11-18)
  `(?=ulardan|ikki)${UZ_HSK_PLACE_TWO}[^.!?]{0,60}?${HSK}[^.!?]{0,60}?(?<![a-zʻʼ])(?:ulardan\\s+(?:biri|bittasi|ikkalasi)|ikkalasi|ular)(?![a-zʻʼ])[^.!?]{0,30}?${UZ_HSK_PLACE_WORD}`,
  `(?=улардан|икки)${UZC_HSK_PLACE_TWO}[^.!?]{0,60}?${HSK}[^.!?]{0,60}?(?<![а-яёўқғҳ])(?:улардан\\s+(?:бири|биттаси|иккаласи)|иккаласи|улар)(?![а-яёўқғҳ])[^.!?]{0,30}?${UZC_HSK_PLACE_WORD}`,
].join('|');
const RU_HSK_PLACE_WORD = '(?<![а-яё])(?:Ташкент[а-яё]*|Иу(?![а-яё]))';
const RU_NOT_OF_FOUR = '(?!\\s+из\\s+(?:(?:этих|всех|наших)\\s+)?(?:четыр[её]х|4)(?![а-яё\\d]))';
const RU_HSK_PLACE = [
  `(?=Ташкент|Иу)${RU_HSK_PLACE_WORD}[^.!?]{0,24}?(?<![а-яё])(?:двоих|двое|двух)(?![а-яё])${RU_NOT_OF_FOUR}[^.!?]{0,80}?${HSK}`,
  `(?=дво|дву|два|две)(?<![а-яё])(?:двое|двоих|двух|два|две)(?![а-яё])${RU_NOT_OF_FOUR}[^.!?;,:()—–]{0,40}?(?<![а-яё])(?:в|из)\\s+${RU_HSK_PLACE_WORD}[^.!?;]{0,60}?${HSK}`,
  // the place after the certificate: «у двоих … сертификат HSK 6, один из них работает в Иу» (final code review, 2026-11-18)
  `(?=дво|дву|два|две)(?<![а-яё])(?:двое|двоих|двух|два|две)(?![а-яё])${RU_NOT_OF_FOUR}[^.!?]{0,60}?${HSK}[^.!?]{0,60}?(?<![а-яё])(?:(?:один|одна|оба|обе|каждый)\\s+из\\s+них|оба|обе|они)(?![а-яё])[^.!?]{0,30}?(?<![а-яё])(?:в|из)\\s+${RU_HSK_PLACE_WORD}`,
].join('|');
const ZH_HSK_PLACE = [
  `(?:塔什干|义乌)[^。！？!?]{0,12}?(?<!四人中有?|四名员工中有?|四人之中有?)(?:两|二|2)\\s?(?:名|位|人)[^。！？!?]{0,30}?${HSK}`,
  `(?:两|二|2)\\s?(?:名|位)[^。！？!?；;，,：:（）()]{0,10}?(?:在|于|驻)(?:塔什干|义乌)[^。！？!?]{0,30}?${HSK}`,
].join('|');
const FA_HSK_PLACE_WORD = '(?:تاشکند|ییوو)';
const FA_NOT_OF_FOUR = '(?!(?:\\s(?:نفر|تن|کارمند))?\\sاز\\s(?:(?:این|آن|همین)\\s)?(?:چهار|4)(?!\\p{Script=Arabic}|\\d))';
const FA_HSK_PLACE = [
  `(?=${FA_HSK_PLACE_WORD})${FA_HSK_PLACE_WORD}[^${FA_STOP}]{0,24}?(?<!\\p{Script=Arabic})(?:دو|2)(?!\\p{Script=Arabic}|\\d)${FA_NOT_OF_FOUR}[^${FA_STOP}]{0,80}?HSK`,
  `(?=دو|2)(?<!\\p{Script=Arabic})(?:دو|2)(?!\\p{Script=Arabic}|\\d)${FA_NOT_OF_FOUR}[^${FA_STOP}؛;،,:()—–]{0,40}?(?<!\\p{Script=Arabic})در\\s${FA_HSK_PLACE_WORD}[^${FA_STOP}؛;]{0,60}?HSK`,
].join('|');
const HSK_PLACE_MSG = (lang) => `the HSK 6 certificate tied to a place (${lang}) — owner, 2026-11-18: GSR Logistics has four employees who know Chinese, three in Tashkent and one in Yiwu, and TWO of the four hold an HSK 6 certificate; which of them holds it and where each works is NOT known (FACTS §8.1: never combine a certificate with a place). After "three work in Tashkent and one in Yiwu" write "two of the four" («toʻrttasidan ikkitasi», «у двоих из четырёх», 四人中有两名, «دو نفر از این چهار نفر»), not "two of them"; no "two of our employees in Tashkent / in Yiwu"`;
const HSK_PAPER_MSG = (lang) => `HSK beside a certificate that is not the two's, a credential, "native", "translator" or "sinologist" word, or another HSK level than 6 (${lang}) — owner, 2026-11-18: GSR Logistics has four employees who know Chinese, and TWO of them hold an (official) HSK 6 certificate. Write the certificate as the two's ("two of them hold an HSK 6 certificate", «ikkitasi HSK 6 sertifikatiga ega», «у двоих из них есть сертификат HSK 6», 其中两名持有 HSK 6 级证书, «دو نفر از آنان گواهی HSK 6 دارند»); never a certificate for all, four, three, one or every employee, "certified staff / team / translators", "native", "interpreter", HSK 5 or HSK 3 (the owner chose not to publish them) or any other level. Never tie the certificate to a place: after "three work in Tashkent and one in Yiwu" write "two of the four" («toʻrttasidan ikkitasi», «у двоих из четырёх», 四人中有两名, «دو نفر از این چهار نفر»), not "two of them", and no "two of our employees in Tashkent" (which holder works where is not known). What passes: the test's own certificate in a sentence that names no holder ("its certificate shows the level passed", "what is an HSK 6 certificate?") and "you need no interpreter"`;
// People only. Uzbek counts people with «nafar» or «kishi»; «ta» counts anything («5 000 ta soʻz»), so it is read only
// before a staff word — as Chinese 个 is read only right before one; 名 and 位 count people on their own. «bir», «один», 一 and «یک»
// are also "a / an": they count only as «bitta / bir nafar», «один … сотрудник», 一名 / 一位, «یک نفر / یک کارمند», and the one
// manager a client works with is no headcount in any language («1 ta menejer», «один менеджер», 一位客户经理, «یک کارشناس»).
// Owner, 2026-11-18 (fourth message): four employees who know Chinese — three in Tashkent, one in Yiwu — and TWO of them hold an
// HSK 6 certificate. So the count that stands NEAREST to «HSK» must be an exact two (`*_HSK_TWO`): a count before «HSK» with no
// two between them and none after «HSK» in its clause ("four employees who know Chinese at HSK 6 level" — the withdrawn sentence —
// stops; "four employees who know Chinese: three … and one …, and two of the four hold an HSK 6 certificate" passes), or a count
// after «HSK» in its clause with no two before it («HSK 6 — 4 employees with this level of Chinese»). "Two of our four
// employees" is the two's (the `lead` lookbehind of hskNearest).
const UZ_STAFF_WORD = 'xodim|hodim|mutaxassis|menejer|tarjimon|xaridor|sinolog';
const UZC_STAFF_WORD = 'ходим|мутахассис|менежер|таржимон|харидор|синолог';
const UZ_MANY = `o${AP}?nlab|yuzlab|bitta|bir(?=\\s+(?:nafar|kishi))|ikki|uch|to${AP}?rt|besh|olti|yetti|sakkiz|to${AP}?qqiz|o${AP}?n(?:\\s+(?:bir|ikki|uch|to${AP}?rt|besh|olti|yetti|sakkiz|to${AP}?qqiz))?|yigirma|o${AP}?ttiz|qirq|ellik|bir\\s+nech(?:a|ta)`;
const UZ_HEADCOUNT = `(?<!HSK\\s?)(?<![\\d.,])(?!1\\s?(?:ta\\s+)?menejer)(?!${UZ_HSK_TWO})\\d{1,3}\\+?\\s?(?:(?:ta)?dan\\s+(?:ortiq|ko${AP}?p|ziyod)\\s+)?(?:(?:nafar|kishi)|(?:ta\\s+)?(?:HSK\\s?\\d?\\s+)?(?:${UZ_STAFF_WORD}))|(?<![a-zʻʼ])(?!${UZ_HSK_TWO})(?!bitta\\s+menejer)(?:${UZ_MANY})(?:(?:\\s?ta)?dan\\s+(?:ortiq|ko${AP}?p|ziyod)|\\s+va\\s+undan\\s+(?:ortiq|ko${AP}?p))?(?:\\s+(?:nafar|kishi)|(?:\\s?ta)?\\s+(?:HSK\\s?\\d?\\s+)?(?:${UZ_STAFF_WORD}))|(?<![a-zʻʼ])(?:bit|uch|to${AP}?rt|besh|olti)ta(?:si|la(?:si)?)(?:da|ning|ga|ni)?(?![a-zʻʼ])`;
const UZC_MANY = 'ўнлаб|юзлаб|битта|бир(?=\\s+(?:нафар|киши))|икки|уч|тўрт|беш|олти|етти|саккиз|тўққиз|ўн(?:\\s+(?:бир|икки|уч|тўрт|беш|олти|етти|саккиз|тўққиз))?|йигирма|ўттиз|қирқ|эллик|бир\\s+неч(?:а|та)';
const UZC_HEADCOUNT = `(?<!HSK\\s?)(?<![\\d.,])(?!1\\s?(?:та\\s+)?менежер)(?!${UZC_HSK_TWO})\\d{1,3}\\+?\\s?(?:(?:та)?дан\\s+(?:ортиқ|кўп|зиёд)\\s+)?(?:(?:нафар|киши)|(?:та\\s+)?(?:HSK\\s?\\d?\\s+)?(?:${UZC_STAFF_WORD}))|(?<![а-яёўқғҳ])(?!${UZC_HSK_TWO})(?!битта\\s+менежер)(?:${UZC_MANY})(?:(?:\\s?та)?дан\\s+(?:ортиқ|кўп|зиёд)|\\s+ва\\s+ундан\\s+(?:ортиқ|кўп))?(?:\\s+(?:нафар|киши)|(?:\\s?та)?\\s+(?:HSK\\s?\\d?\\s+)?(?:${UZC_STAFF_WORD}))|(?<![а-яёўқғҳ])(?:бит|уч|тўрт|беш|олти)та(?:си|ла(?:си)?)(?:да|нинг|га|ни)?(?![а-яёўқғҳ])`;
const RU_COUNTED = '(?:сотрудник|специалист|закупщик|менеджер|байер|переводчик)(?![иы](?![а-яё]))';
const RU_MANY = 'один|одна|одного|одной|одному|одним|одну|тремя|четырьмя|пятью|шестью|двое|трое|четверо|пятеро|шестеро|семеро|двоих|троих|четверых|пятерых|два|две|двух|три|тр[её]х|четыре|четыр[её]х|пять|пяти|шесть|шести|семь|семи|восемь|восьми|девять|девяти|десять|десяти|одиннадцат[ьи]|двенадцат[ьи]|тринадцат[ьи]|четырнадцат[ьи]|пятнадцат[ьи]|шестнадцат[ьи]|семнадцат[ьи]|восемнадцат[ьи]|девятнадцат[ьи]|двадцат[ьи]|тридцат[ьи]|сорок[а]?|пятьдесят|пятидесяти|несколько|нескольких|десяток|десятка|десятки|десятков|десятками|дюжин[аыу]';
const RU_HEADCOUNT = `(?<!HSK\\s?)(?<![\\d.,])(?!1\\s+менеджер)(?!${RU_HSK_TWO})\\d{1,3}(?:\\+(?=\\s+(?:сотрудник|специалист|закупщик|менеджер|байер|переводчик|человек)))?\\s+(?:HSK\\s?\\d?\\s+)?(?:[а-яё-]+\\s){0,2}?(?:${RU_COUNTED}|человека?(?![а-яё]))|(?<![а-яё])(?!${RU_HSK_TWO})(?!од(?:ин|ним|ному|ного)\\s+(?:персональн[а-яё]+\\s+)?менеджер)(?:${RU_MANY})\\s+(?:[а-яё-]+\\s){0,2}?(?:${RU_COUNTED}|человека?(?![а-яё]))|(?<![а-яё])(?!${RU_HSK_TWO})(?:один|одна|одного|одной|трое|троих|три|тр[её]х|четверо|четверых|четыре|четыр[её]х|пятеро|пятерых)\\s+из\\s+(?:них|нас|этих|наших)(?![а-яё])`;
const EN_COUNTED_WORDS = '(?:of\\s+(?:our|the)\\s+|(?:(?!(?:and|or|but|the|our|your|their|its|a|an|to|for|in|on|at|by|from|with|while|when|where|then|that|which|who)\\s)[a-z-]+\\s){0,2}?)';
const EN_HEADCOUNT = `(?<!HSK\\s?)(?<![\\d.,])\\b(?!${EN_HSK_TWO})\\d{1,3}(?:\\+(?=\\s+(?:employees|specialists|staff\\b|buyers|managers|people|translators|interpreters|purchasers)))?(?:\\s+(?:or|and)\\s+(?:more|over|above)|[\\s-]?plus)?\\s+(?:HSK\\s?\\d?\\s+)?${EN_COUNTED_WORDS}(?:employees?|specialists?|staff\\b|buyers?|managers?|people|translators?|interpreters?|purchasers?)|\\b(?!${EN_HSK_TWO})(?!one\\s+(?:personal\\s+)?manager)(?:one|${EN_ONES}|several|dozens|scores|hundreds)(?:\\s+(?:or|and)\\s+(?:more|over|above)|[\\s-]?plus)?\\s+(?:HSK\\s?\\d?\\s+)?${EN_COUNTED_WORDS}(?:employees?|specialists?|buyers?|managers?|people\\b|translators?|interpreters?|purchasers?)|\\bteam\\s+of\\s+(?!${EN_HSK_TWO})(?:\\d|(?:${EN_ONES})\\b)|\\b(?!${EN_HSK_TWO})(?:one|three|four|five|six|seven|eight|nine|ten|all|each|every\\s+one)\\s+of\\s+(?:them|these|those|whom|us)\\b`;
const ZH_HSK_STAFF = '员工|专员|采购员|经理|翻译|人员';
const ZH_HEADCOUNT = `(?<!HSK\\s?)(?<![\\d.,])(?!1\\s?(?:名|位)(?:客户)?经理)(?!${ZH_HSK_TWO})\\d{1,3}\\s?\\+?\\s?(?:多|余)?\\s?(?:(?:(?:名|位)[\\p{Script=Han}A-Za-z0-9\\s]{0,20}?|个(?!工作日|阶段|步骤|环节|小时|星期|月)[\\p{Script=Han}A-Za-z0-9\\s]{0,8}?)(?:${ZH_HSK_STAFF})|人(?!民))|(?<![一两二三四五六七八九十百千万零几数第前])(?!${ZH_HSK_TWO})(?!一\\s?(?:名|位)(?:客户)?经理)[一两二三四五六七八九十百几数]+多?(?:名|位)(?:[\\p{Script=Han}A-Za-z0-9\\s]{0,20}?(?:${ZH_HSK_STAFF})|(?=持有|拥有|有|通过|考取|获得|均|都|的中文|中文))|(?:多|数)(?:名|位)(?:${ZH_HSK_STAFF})|(?<![一两二三四五六七八九十百千万零几数])(?!${ZH_HSK_TWO})[一两二三四五六七八九十]+人(?:的|团队|小组)`;
// not «نه» (nine, and "no") and not «چند» («چند کارمند…؟» asks), as in FA_ONES
const FA_MANY = 'ده[\\s\\p{Cf}]?ها|صدها|یک|دو|سه|چهار|پنج|شش|هفت|هشت|ده|یازده|دوازده|سیزده|چهارده|پانزده|شانزده|هفده|هجده|نوزده|بیست|سی|چندین'; // not «نه» and not «چند»
const FA_HEADCOUNT = `(?<!HSK\\s?)(?<![\\d.,])(?!1\\s(?:کارشناس|مدیر))(?!${FA_HSK_TWO})\\d{1,3}\\s(?:نفر|تن\\sاز|کارمند|کارشناس|خریدار|مترجم|کارکن)|(?<!\\p{Script=Arabic})(?!${FA_HSK_TWO})(?!یک\\s(?:کارشناس|مدیر))(?:${FA_MANY})[\\s\\p{Cf}](?:نفر|تن\\sاز|کارمند|کارشناس|خریدار|مترجم)`;
/** "Two of our four employees …": a count right after the two's partitive is the two's. */
const EN_TWO_OF = '(?<!\\b(?:two|2)\\s+of\\s+(?:(?:our|the|these|its|GSR[’\']s)\\s+)?)';
const RU_TWO_OF = '(?<!(?<![а-яё])(?:двое|двоих|двух|два|две|2)\\s+из\\s+(?:(?:наших|этих|своих)\\s+)?)';
const FA_TWO_OF = '(?<!(?<!\\p{Script=Arabic})(?:دو|2)(?:\\s(?:نفر|تن|کارمند))?\\sاز\\s(?:[\\p{Script=Arabic}\\p{Cf}]+\\s)?)';
/**
 * hskCount in one language: in a sentence (`stop`) that says HSK, the people-count nearest to «HSK» is not an exact two —
 * `count` before «HSK» with no `two` between them and none after «HSK» in its clause (`clause`), or `count` after «HSK» in its
 * clause with no `two` before it. `lead` keeps a partitive two's count out ("two of our four employees").
 */
const hskNearest = (count, two, stop, clause, lead = '') =>
  `(?=(?:${count}))${lead}(?:(?!${two})[^${stop}])*?${HSK}(?![^${clause}]*?(?:${two}))|${HSK}(?:(?!${two})[^${clause}])*?(?:${count})`;
// The withdrawn predicate (DESIGN §14.1: "at HSK 6 level" for the four is withdrawn everywhere; owner, 2026-11-18: TWO hold an HSK 6
// certificate): "know Chinese at HSK 6 level" said of staff — a holder word in the sentence (`*_HSK_HOLDER`) — with no exact two in
// its clause, even with no count at all ("We have employees who know Chinese at HSK 6 level", «Xitoy tilini HSK 6 darajasida
// biladigan xodimlarimiz bor», «Сотрудники, которые знают китайский на уровне HSK 6», 我们有中文达到 HSK 6 级水平的员工, «کارمندانی
// داریم که زبان چینی را در سطح HSK 6 می‌دانند»). The test's own level passes ("level 6 expects 5,000 words", «HSK 6 darajasi nima?»).
const EN_HSK_LEVEL = '\\bat\\s+(?:the\\s+)?HSK\\s?6\\s+level\\b|\\bHSK\\s?6[-\\s]level\\s+(?:Chinese|employees?|staff|speakers?|buyers?|specialists?)\\b';
const UZ_HSK_LEVEL = `HSK\\s?6(?:-|\\s+)darajas(?:ida|idagi)(?![a-zʻʼ])`;
const UZC_HSK_LEVEL = 'HSK\\s?6(?:-|\\s+)даражас(?:ида|идаги)(?![а-яёўқғҳ])';
const RU_HSK_LEVEL = '(?<![а-яё])на\\s+уровне\\s+HSK';
const ZH_HSK_LEVEL = 'HSK\\s?6\\s?级水平|达到\\s?HSK\\s?6\\s?级';
const FA_HSK_LEVEL = '(?<!\\p{Script=Arabic})در\\sسطح\\sHSK';
/** The withdrawn predicate in one language: `level` in a sentence (`stop`) that names a `holder`, with no `two` in its clause. */
const hskLevel = ({ level, holder, two, stop, clause }) =>
  `(?<=^|[${stop}])(?=[^${stop}]*?(?:${level}))(?=[^${stop}]*?(?:${holder}))[^${stop}]*?${notTwos(level, two, clause)}`;
const HSK_COUNT_MSG = (lang) => `a number of people beside HSK other than two (${lang}) — owner, 2026-11-18: GSR Logistics has four employees who know Chinese (three in Tashkent, one in Yiwu), and TWO of them hold an HSK 6 certificate. The count nearest to «HSK» must be two ("we have four employees who know Chinese; two of them hold an HSK 6 certificate", "HSK 6 — Certificate held by 2 of our employees"). Withdrawn: "four employees who know Chinese at HSK 6 level", "all four … HSK 6", "three … HSK 6", "4 … HSK 6", and the predicate "know Chinese at HSK 6 level" said of staff even with no count ("we have employees who know Chinese at HSK 6 level"); also any other number, a two made vague ("more than two", "2+"), or a range or a choice ("2–3", "two or three"). A count of other people (managers, a client's staff) goes into a sentence of its own`;

/*
 * factoryVisit (owner, 2026-11-18): the employees do NOT go to the factories as part of the service — they negotiate with them
 * without travelling there; if the client wants, the company can send its employee in China to the factory for an additional fee
 * (amount agreed separately). So no claim that "we" or our employees visit, travel to, or inspect / audit on site a factory — unless
 * the same sentence denies it ("is not part of the service", "without travelling there", «bormasdan», «не выезжая», 无需前往,
 * «بدون رفتن») or makes it the client's choice or an extra ("if you want", "if needed", "on request", "for an additional fee",
 * «xohlasangiz», «kerak boʻlsa», «при необходимости», «за дополнительную плату», 必要时, 另行收费, «در صورت نیاز», «با هزینهٔ اضافی»).
 * Published sentences that pass on purpose: "order samples and, if needed, visit the factory" (sourcing) and its four translations;
 * "we organise the visit" (equipment: the client's own visit); "a visit by your own staff or a third-party inspection" (guides); "we
 * check the factory’s business licence" (a check on paper). What it does not read: a check without an in-person word («zavodni
 * tekshiramiz», 验厂), "factory audit" as a priced extra ("complex searches with a factory audit"), anybody else's visit.
 * The passive form is read in its own clause (`*_VISIT_BY`, review fixes 2026-11-18): "samples and factory checks are done by our
 * staff in Yiwu" — the site FAQ's withdrawn answer (DESIGN §14a, drafts/crossfaq.<lang>.json "noChinese") — stops in all five
 * languages, even after "you do not need to travel to China either:".
 */
const EN_VISIT_NO = '\\b(?:not|no|never|without|neither|nor|cannot|can[’\']t|don[’\']t|doesn[’\']t|won[’\']t|isn[’\']t|aren[’\']t|if\\s+(?:you\\s+(?:want|wish|ask|need|like|prefer)|needed|necessary|required|the\\s+client\\s+(?:wants|wishes|asks))|where\\s+needed|when\\s+needed|on\\s+(?:your\\s+)?request|at\\s+your\\s+request|upon\\s+request|for\\s+an?\\s+(?:additional|extra|separate)\\s+(?:fee|charge|cost|payment)|at\\s+(?:an?\\s+)?(?:additional|extra)\\s+(?:fee|charge|cost)|agreed\\s+separately|optional(?:ly)?)\\b';
const EN_VISIT_WHO = '\\b(?:we|our\\s+(?:own\\s+)?(?:(?:Chinese-speaking|Yiwu|China|local)\\s+)?(?:employees?|staff(?:\\s+members?)?|team|buyers?|specialists?|managers?|colleagues?|agents?|people)|GSR(?:\\s+Logistics)?(?:[’\']s?\\s+(?:employees?|staff|team|buyers?))?)\\b';
const EN_VISIT_SITE = '(?:(?:the|a|an|each|every|your|all|its|their|the\\s+(?:supplier|seller|maker|manufacturer)[’\']s)\\s+)?(?:factor(?:y|ies)|plants?|workshops?|manufacturers?|production\\s+(?:sites?|lines?|floors?)|premises)\\b';
const EN_VISIT = [
  // we / our employees … visit / go to / travel to the factory (a few words between: "we order samples and visit the factory")
  `${EN_VISIT_WHO}(?:(?!${EN_VISIT_NO})[^.!?;]){0,60}?\\b(?:visit(?:s|ed|ing)?|go(?:es)?\\s+(?:out\\s+)?to|went\\s+to|travel(?:s|led|ling)?\\s+to|fly\\s+to|come\\s+to|drive\\s+to)\\s+${EN_VISIT_SITE}`,
  // … inspect / audit / check the factory in person, on site
  `${EN_VISIT_WHO}(?:(?!${EN_VISIT_NO})[^.!?;]){0,60}?\\b(?:inspect(?:s|ed)?|audit(?:s|ed)?|check(?:s|ed)?|verif(?:y|ies|ied)|see|examine[sd]?)\\s+${EN_VISIT_SITE}\\s+(?:in\\s+person|on[-\\s]site|on\\s+the\\s+spot|ourselves|themselves|personally)\\b`,
  // send our employee to the factory
  `\\bsend(?:s|ing)?\\s+(?:(?:our|an?|one\\s+of\\s+our)\\s+)?(?:own\\s+)?(?:employees?|staff(?:\\s+members?)?|buyers?|specialists?|people|someone)(?:\\s+(?:in|from)\\s+(?:China|Yiwu))?\\s+to\\s+${EN_VISIT_SITE}`,
  // a factory visit is included / part of the service
  `\\b(?:(?:factory|on[-\\s]site|in[-\\s]person|site)\\s+(?:visits?|audits?|inspections?)|visits?\\s+to\\s+(?:the\\s+)?(?:factor(?:y|ies)|suppliers?|workshops?))(?:\\s+by\\s+our\\s+(?:employees?|staff|team|buyers?))?\\s+(?:(?:is|are)\\s+(?:always\\s+|also\\s+)?(?:included|part\\s+of\\s+(?:the|our|every)\\s+(?:service|order|purchase|price)|free|standard)|comes?\\s+with)\\b`,
].join('|');
const EN_VISIT_BY = `\\b(?:factory|on[-\\s]site)\\s+(?:checks?|visits?|inspections?|audits?)\\s+(?:are|is)\\s+(?:done|carried\\s+out|made|handled|performed|conducted)\\s+by\\s+(?:our|GSR)\\b`;
const EN_VISIT_CLAIM = `(?=(?:${EN_VISIT}))(?<!${EN_VISIT_NO}[^.!?]{0,120})(?:${EN_VISIT})(?![^.!?]{0,80}${EN_VISIT_NO})(?![^.!?]*\\?)|(?=${EN_VISIT_BY})(?<!${EN_VISIT_NO}[^.!?;:]{0,60})${EN_VISIT_BY}(?![^.!?;]{0,80}${EN_VISIT_NO})(?![^.!?]*\\?)`;
const UZ_VISIT_NO = `(?:kerak|zarur|lozim)\\s+bo${AP}?lsa|xohlasa(?:ngiz|lar)?|hohlasa(?:ngiz|lar)?|istasa(?:ngiz|lar)?|so${AP}?rov(?:ingiz)?(?:ga\\s+ko${AP}?ra|\\s+bo${AP}?yicha)|iltimos(?:ingiz)?ga\\s+ko${AP}?ra|qo${AP}?shimcha\\s+(?:to${AP}?lov|haq)|alohida\\s+(?:to${AP}?lov|haq|kelishil)|${UZ_DENIED}|(?<![a-zʻʼ])(?:emas|yo${AP}?q|bormay|bormasdan)(?![a-zʻʼ])`;
const UZC_VISIT_NO = `(?:керак|зарур|лозим)\\s+бўлса|хоҳласа(?:нгиз|лар)?|истаса(?:нгиз|лар)?|сўров(?:ингиз)?(?:га\\s+кўра|\\s+бўйича)|илтимос(?:ингиз)?га\\s+кўра|қўшимча\\s+(?:тўлов|ҳақ)|алоҳида\\s+(?:тўлов|ҳақ|келишил)|${UZC_DENIED}|(?<![а-яёўқғҳ])(?:эмас|йўқ|бормай|бормасдан)(?![а-яёўқғҳ])`;
const UZ_VISIT_SITE = `(?<![a-zʻʼ])(?:zavod|fabrika|ishlab\\s+chiqaruvchi|sex)(?:lar)?(?:imiz)?`;
const UZ_VISIT = [
  `${UZ_VISIT_SITE}ga(?:\\s+[a-zʻʼ]+){0,3}?\\s+(?:bor(?:amiz|adi|ishadi|adilar|ib,?\\s+(?:[a-zʻʼ]+\\s+){0,2}?[a-zʻʼ]+(?:amiz|adi|ishadi|adilar))|tashrif\\s+buyur(?:amiz|adi|ishadi|adilar)|yubor(?:amiz|adi|ishimiz\\s+mumkin)|jo${AP}?nat(?:amiz|adi|ishimiz\\s+mumkin)|olib\\s+boramiz)(?![a-zʻʼ])`,
  `${UZ_VISIT_SITE}(?:ni|lar(?:ni)?)\\s+(?:o${AP}?zimiz\\s+|o${AP}?zlari\\s+)?(?:joyida|borib|shaxsan)\\s+(?:tekshir|ko${AP}?r|audit\\s+qil)(?:amiz|adi|ishadi|adilar)(?![a-zʻʼ])`,
  `${UZ_VISIT_SITE}(?:ga|ni)?\\s+(?:tashrif|borish|audit|joyida\\s+tekshir(?:ish|uv))(?:i)?\\s+(?:ham\\s+)?(?:xizmat(?:ga|imizga)?\\s+kiradi|bepul|narxga\\s+kiradi)(?![a-zʻʼ])`,
].join('|');
const UZC_VISIT_SITE = '(?<![а-яёўқғҳ])(?:завод|фабрика|ишлаб\\s+чиқарувчи|цех)(?:лар)?(?:имиз)?';
const UZC_VISIT = [
  `${UZC_VISIT_SITE}га(?:\\s+[а-яёўқғҳ]+){0,3}?\\s+(?:бор(?:амиз|ади|ишади|адилар|иб,?\\s+(?:[а-яёўқғҳ]+\\s+){0,2}?[а-яёўқғҳ]+(?:амиз|ади|ишади|адилар))|ташриф\\s+буюр(?:амиз|ади|ишади|адилар)|юбор(?:амиз|ади|ишимиз\\s+мумкин)|жўнат(?:амиз|ади|ишимиз\\s+мумкин)|олиб\\s+борамиз)(?![а-яёўқғҳ])`,
  `${UZC_VISIT_SITE}(?:ни|лар(?:ни)?)\\s+(?:ўзимиз\\s+|ўзлари\\s+)?(?:жойида|бориб|шахсан)\\s+(?:текшир|кўр|аудит\\s+қил)(?:амиз|ади|ишади|адилар)(?![а-яёўқғҳ])`,
  `${UZC_VISIT_SITE}(?:га|ни)?\\s+(?:ташриф|бориш|аудит|жойида\\s+текшир(?:иш|ув))(?:и)?\\s+(?:ҳам\\s+)?(?:хизмат(?:га|имизга)?\\s+киради|бепул|нархга\\s+киради)(?![а-яёўқғҳ])`,
].join('|');
const UZ_VISIT_BY = `zavod\\s+tekshiruv(?:i|ini)\\s+(?:[a-zʻʼ]+\\s+){0,2}?xodim(?:lar)?imiz\\s+(?:qiladi|bajaradi|olib\\s+boradi|amalga\\s+oshiradi)(?![a-zʻʼ])`;
const UZC_VISIT_BY = 'завод\\s+текширув(?:и|ини)\\s+(?:[а-яёўқғҳ]+\\s+){0,2}?ходим(?:лар)?имиз\\s+(?:қилади|бажаради|олиб\\s+боради|амалга\\s+оширади)(?![а-яёўқғҳ])';
const UZ_VISIT_CLAIM = `(?=${UZ_VISIT_BY})(?<!(?:${UZ_VISIT_NO})[^.!?;:]{0,60})${UZ_VISIT_BY}|(?=${UZC_VISIT_BY})(?<!(?:${UZC_VISIT_NO})[^.!?;:]{0,60})${UZC_VISIT_BY}|(?=(?:${UZ_VISIT}))(?<!(?:${UZ_VISIT_NO})[^.!?]{0,120})(?:${UZ_VISIT})(?![^.!?]{0,80}(?:${UZ_VISIT_NO}))(?![^.!?]*\\?)|(?=(?:${UZC_VISIT}))(?<!(?:${UZC_VISIT_NO})[^.!?]{0,120})(?:${UZC_VISIT})(?![^.!?]{0,80}(?:${UZC_VISIT_NO}))(?![^.!?]*\\?)`;
const RU_VISIT_NO = '(?<![а-яё])(?:не|нет|ни|без|при\\s+необходимости|если\\s+(?:это\\s+)?(?:нужно|необходимо|потребуется|хотите|вы\\s+хотите|пожелаете|клиент\\s+(?:хочет|пожелает))|по\\s+(?:вашему\\s+)?(?:желанию|запросу|просьбе)|по\\s+желанию\\s+клиента|за\\s+(?:дополнительную|отдельную)\\s+(?:плату|оплату)|за\\s+доплату|оплачивается\\s+отдельно|согласуется\\s+отдельно|по\\s+договор[её]нности)(?![а-яё])';
const RU_VISIT_SITE = '(?:на|в)\\s+(?:(?:кажд|люб|эт|вс)[а-яё]*\\s+)?(?:фабрик|завод|производств|цех|предприяти)[а-яё]*';
const RU_VISIT = [
  // «выезжаем на фабрику» (the verb says "we"), «наши сотрудники посещают фабрики»
  `(?<![а-яё])(?:выезжаем|ездим|едем|поедем|приезжаем|приедем|выедем)\\s+(?:сами\\s+|лично\\s+)?${RU_VISIT_SITE}`,
  `(?<![а-яё])(?:мы|наши\\s+(?:сотрудники|специалисты|закупщики|менеджеры|байеры)|наш\\s+(?:сотрудник|специалист|закупщик|менеджер|байер)|сотрудники\\s+GSR(?:\\s+Logistics)?)(?:(?!${RU_VISIT_NO})[^.!?;]){0,60}?(?<![а-яё])(?:выезжа(?:ем|ют|ет)|езд(?:им|ят|ит)|ед(?:ем|ут|ет)|поед(?:ем|ут|ет)|приезжа(?:ем|ют|ет)|посеща(?:ем|ют|ет)|посетим|посетят|посетит|бывают|бываем)\\s+(?:сами\\s+|лично\\s+)?(?:${RU_VISIT_SITE}|фабрик[а-яё]*|завод[а-яё]*|производств[а-яё]*|цех[а-яё]*)`,
  `(?<![а-яё])(?:проверя(?:ем|ют|ет)|провер(?:им|ят|ит)|инспектиру(?:ем|ют|ет)|осматрива(?:ем|ют|ет)|осмотрим|аудиру(?:ем|ют|ет))\\s+(?:фабрик|завод|производств|цех|предприяти)[а-яё]*\\s+(?:на\\s+месте|лично|сами|своими\\s+глазами)(?![а-яё])`,
  `(?<![а-яё])(?:отправ(?:им|ляем|ляет)|направ(?:им|ляем|ляет)|пошл[её]м|командиру(?:ем|ет))\\s+(?:(?:нашего|своего)\\s+)?(?:сотрудника|специалиста|закупщика|байера)(?:\\s+(?:в\\s+Китае|в\\s+Иу|из\\s+Иу))?\\s+${RU_VISIT_SITE}`,
  `(?<![а-яё])(?:выезд|визит|поездк[аи]|посещени[ея])\\s+(?:${RU_VISIT_SITE}|фабрики|завода|производства|цеха)\\s+(?:тоже\\s+|также\\s+)?(?:входит|включ[её]н[а-яё]*|бесплатн[а-яё]*|в\\s+стоимост)`,
].join('|');
const RU_VISIT_BY = '(?<![а-яё])проверк[уаи]\\s+(?:фабрик|завод|производств)[а-яё]*\\s+(?:дела(?:ют|ет)|провод(?:ят|ит)|выполня(?:ют|ет)|осуществля(?:ют|ет))\\s+наш[а-яё]*\\s+(?:сотрудник|специалист|закупщик)';
const RU_VISIT_CLAIM = `(?=${RU_VISIT_BY})(?<!${RU_VISIT_NO}[^.!?;:]{0,60})${RU_VISIT_BY}|(?=(?:${RU_VISIT}))(?<!${RU_VISIT_NO}[^.!?]{0,120})(?:${RU_VISIT})(?![^.!?]{0,80}${RU_VISIT_NO})(?![^.!?]*\\?)`;
const ZH_VISIT_NO = '不|无需|无须|没有|并不|不必|不用|必要时|如有需要|如需|如果需要|若需|如您需要|如果您(?:需要|希望|愿意|想)|若您|应您(?:的)?要求|根据您的要求|按您的要求|另行收费|额外(?:付费|收费|费用)|另付费|另外收费|费用另行商定|费用另议|单独商定|另行商定';
const ZH_VISIT_SITE = '(?:每一?家|各家?|这家|该)?(?:工厂|厂家|厂区|车间|生产线|生产现场|供应商)';
const ZH_VISIT = [
  `(?:我们|我司|我方|员工|采购员|工作人员|团队)(?:(?!${ZH_VISIT_NO})[^${ZH_STOP}]){0,20}?(?:亲自|实地|上门)?(?:到|去|前往|赴|走访|拜访|探访|参观|考察|访问)${ZH_VISIT_SITE}`,
  `(?:我们|我司|我方|员工|采购员|工作人员|团队)(?:(?!${ZH_VISIT_NO})[^${ZH_STOP}]){0,20}?(?:亲自|实地|现场|上门)(?:验厂|考察|走访|审核|检查|查看|核查)`,
  `派(?:遣|驻|出)?(?:我们|我司)?(?:在中国|在义乌)?的?(?:员工|采购员|工作人员)(?:前往|到|去|赴)${ZH_VISIT_SITE}`,
  `(?:验厂|实地考察|到厂考察|工厂考察|走访工厂|实地验厂)(?:服务)?(?:包含在|属于本?服务|已含|免费|是本?服务的一部分|包括在)`,
].join('|');
const ZH_VISIT_BY = '(?:验厂|工厂检查|实地考察)由(?:我们|我司)[^。！？!?；;，,：:]{0,10}?(?:员工|工作人员|采购员|团队)(?:负责|完成|进行)';
const ZH_VISIT_CLAIM = `(?=${ZH_VISIT_BY})(?<!(?:${ZH_VISIT_NO})[^${ZH_STOP}，,：:]{0,20})${ZH_VISIT_BY}|(?=(?:${ZH_VISIT}))(?<!(?:${ZH_VISIT_NO})[^${ZH_STOP}]{0,40})(?:${ZH_VISIT})(?![^${ZH_STOP}]{0,40}(?:${ZH_VISIT_NO}))(?![^${ZH_STOP}]*[？?])`;
const FA_VISIT_NO = `نمی|(?<!\\p{Script=Arabic})نه(?!\\p{Script=Arabic})|بدون|ندار|نیست|نخواه|در\\sصورت\\s(?:نیاز|درخواست|تمایل)|اگر\\s(?:بخواهید|مایل\\sباشید|لازم\\sباشد|نیاز\\sباشد|مشتری\\sبخواهد)|به\\sدرخواست|با\\sهزینه(?:\\p{Mn}|ی)?\\s(?:اضافی|جداگانه)|با\\sپرداخت\\sهزینه|هزینه(?:\\p{Mn}|ی)?\\s(?:اضافی|جداگانه)|جداگانه\\sتوافق`;
const FA_VISIT_SITE = '(?:کارخانه|کارگاه|تولیدکننده|محل\\sتولید)(?:\\p{Mn}|ی|ها|[\\s\\p{Cf}]ها)?';
const FA_VISIT = [
  `(?<!\\p{Script=Arabic})از\\s${FA_VISIT_SITE}(?:\\s[\\p{Script=Arabic}\\p{Cf}]+){0,3}?\\sبازدید\\s${FA_MI}(?:کنیم|کنند|کند)(?!\\p{Script=Arabic})`,
  `(?<!\\p{Script=Arabic})به\\s${FA_VISIT_SITE}(?:\\s[\\p{Script=Arabic}\\p{Cf}]+){0,3}?\\s(?:${FA_MI}(?:رویم|روند|رود)|سر\\s${FA_MI}(?:زنیم|زنند))(?!\\p{Script=Arabic})`,
  `${FA_VISIT_SITE}\\sرا\\s(?:(?:در\\sمحل|حضوری|خودمان|شخصاً)\\s){1,2}(?:بررسی|بازرسی|ممیزی)\\s${FA_MI}(?:کنیم|کنند)(?!\\p{Script=Arabic})`,
  `(?:کارمند|همکار)(?:ان)?(?:[\\s\\p{Cf}]?(?:مان|خود|ما))?(?:\\s[\\p{Script=Arabic}\\p{Cf}]+){0,3}?\\sرا\\sبه\\s${FA_VISIT_SITE}\\s(?:${FA_MI}فرستیم|بفرستیم|اعزام\\s${FA_MI}کنیم)`,
  `بازدید\\sاز\\s${FA_VISIT_SITE}\\s(?:هم\\s)?(?:جزو|بخشی\\sاز|شامل)\\s(?:خدمت|خدمات|سفارش)`,
].join('|');
const FA_VISIT_BY = `بررسی\\sکارخانه\\sرا\\s(?:کارکنان|کارمندان|همکاران)(?:[\\s\\p{Cf}]?(?:ما|مان))?(?:\\s[\\p{Script=Arabic}\\p{Cf}]+){0,3}?\\sانجام\\s${FA_MI}(?:دهند|دهیم)`;
const FA_VISIT_CLAIM = `(?=${FA_VISIT_BY})(?<!(?:${FA_VISIT_NO})[^${FA_STOP}؛;:]{0,60})${FA_VISIT_BY}|(?=(?:${FA_VISIT}))(?<!(?:${FA_VISIT_NO})[^${FA_STOP}]{0,120})(?:${FA_VISIT})(?![^${FA_STOP}]{0,80}(?:${FA_VISIT_NO}))(?![^${FA_STOP}]*؟)`;
const VISIT_MSG = (lang) => `a factory visit, or an on-site factory inspection or audit, claimed as part of the service (${lang}) — owner, 2026-11-18: the employees negotiate with factories without travelling there; if the client wants, the company can send its employee in China to the factory for an additional fee, agreed separately. Say so in the sentence ("if you want, we can send our employee in China to the factory for an additional fee"); a denial passes ("a visit to the factory is not part of the service")`;

/*
 * The wholesale-buying page only (owner, 2026-11-18): clothing and medicines are NOT bought (all other goods are). So on that page
 * clothing, footwear or medicines stand only in an exclusion ("except clothing and medicines", "not for clothing or medicines",
 * "Does not fit: clothing, medicines", «kiyim-kechak va dori-darmondan tashqari», «кроме одежды и лекарств», 服装和药品除外,
 * «به‌جز پوشاک و دارو»), never as an example of what is bought ("for example clothing", «masalan, kiyim», «например, одежду»,
 * 例如服装, «برای مثال پوشاک»). The sourcing and the 1688 & Taobao pages keep their published examples (a question to the owner), so
 * these patterns are read by scripts/check-content.mjs as page-scoped rules of that one page (PAGE_CLAIMS, WHOLESALE_PAGE),
 * sentence by sentence; their sentences are asserted here and there.
 */
const EN_CATEGORY = '\\b(?:cloth(?:ing|es)|garments?|apparel|footwear|shoes|sneakers|medicines?|medications?|pharmaceuticals?|drugs)\\b';
const EN_CATEGORY_OK = `(?=${EN_CATEGORY})(?<!\\b(?:except|excluding|other\\s+than|apart\\s+from|but\\s+not|not\\s+for|not\\s+buy|not\\s+bought|do\\s+not|does\\s+not|don[’']t|doesn[’']t|never|no|nor|neither|without|exclusions?)\\b[^.!?;]{0,80})(?:${EN_CATEGORY})(?![^.!?;]{0,60}\\b(?:(?:is|are)\\s+not|(?:isn|aren)[’']t|not\\s+(?:bought|accepted|purchased|included)|excluded)\\b)`;
const UZ_CATEGORY = `(?<![a-zʻʼ])(?:kiyim(?:-kechak)?|oyoq\\s+kiyim|poyabzal|dori(?:-darmon|lar|vor)?|medikament|farmatsevt)[a-zʻʼ-]*`;
// an example marker before the word («masalan, kiyim …») or «kabi» after it makes it an example, whatever follows; otherwise a
// list that ends in «…dan tashqari» / «mustasno» or a denied verb in the sentence makes it an exclusion
const UZ_CATEGORY_EXAMPLE = `(?<=(?<![a-zʻʼ])(?:masalan|misol\\s+uchun|jumladan|xususan)[^.!?;]{0,40})`;
const UZ_CATEGORY_OK = `(?=${UZ_CATEGORY})(?<!(?:mos\\s+kelmaydi|olinmaydi|olmaymiz|emas|tashqari|mustasno)[^.!?;]{0,60})(?:${UZ_CATEGORY_EXAMPLE}(?:${UZ_CATEGORY})(?![a-zʻʼ-])(?!(?<=dan)\\s+tashqari)|(?:${UZ_CATEGORY})(?![a-zʻʼ-])(?=[^.!?;]{0,20}?\\skabi(?![a-zʻʼ]))|(?:${UZ_CATEGORY})(?![a-zʻʼ-])(?!(?<=dan)\\s+tashqari)(?![^.!?;]{0,150}?(?:dan\\s+tashqari|mustasno|uchun\\s+emas|(?<![a-zʻʼ])[a-zʻʼ]+ma(?:y(?:miz|di|dilar)|ydi|ydigan)(?![a-zʻʼ]))))`;
const UZC_CATEGORY = '(?<![а-яёўқғҳ])(?:кийим(?:-кечак)?|оёқ\\s+кийим|пойабзал|дори(?:-дармон|лар|вор)?|медикамент|фармацевт)[а-яёўқғҳ-]*';
const UZC_CATEGORY_EXAMPLE = '(?<=(?<![а-яёўқғҳ])(?:масалан|мисол\\s+учун|жумладан|хусусан)[^.!?;]{0,40})';
const UZC_CATEGORY_OK = `(?=${UZC_CATEGORY})(?<!(?:мос\\s+келмайди|олинмайди|олмаймиз|эмас|ташқари|мустасно)[^.!?;]{0,60})(?:${UZC_CATEGORY_EXAMPLE}(?:${UZC_CATEGORY})(?![а-яёўқғҳ-])(?!(?<=дан)\\s+ташқари)|(?:${UZC_CATEGORY})(?![а-яёўқғҳ-])(?=[^.!?;]{0,20}?\\sкаби(?![а-яёўқғҳ]))|(?:${UZC_CATEGORY})(?![а-яёўқғҳ-])(?!(?<=дан)\\s+ташқари)(?![^.!?;]{0,150}?(?:дан\\s+ташқари|мустасно|учун\\s+эмас|(?<![а-яёўқғҳ])[а-яёўқғҳ]+ма(?:й(?:миз|ди|дилар)|йди|йдиган)(?![а-яёўқғҳ]))))`;
const RU_CATEGORY = '(?<![а-яё])(?:одежд|обув|лекарств|медикамент|фармацевт)[а-яё]*';
const RU_CATEGORY_OK = `(?=${RU_CATEGORY})(?<!(?<![а-яё])(?:кроме|за\\s+исключением|исключая|не\\s+(?:для|закупаем|покупаем|бер[её]м|возим|принимаем|подходит|подходят|занимаемся)|не\\s+подходит|ни|нет|без)(?![а-яё])[^.!?;]{0,60})(?:${RU_CATEGORY})(?![а-яё])(?![^.!?;]{0,40}(?<![а-яё])(?:не\\s+(?:закупа|покупа|бер|принима|подход|входят|относ)|исключ))`;
const ZH_CATEGORY = '服装|衣服|服饰|衣物|鞋类|鞋子|鞋靴|鞋(?!架|柜)|药品|药物|医药|西药|中药|药材';
const ZH_CATEGORY_OK = `(?=${ZH_CATEGORY})(?<!(?:除|不含|不包括|不包含|不涵盖|不采购|不购买|不代购|不经营|不接|不受理|不提供|不适用|不适合|但不|不做|不收)[^${ZH_STOP}]{0,30})(?:${ZH_CATEGORY})(?![^${ZH_STOP}]{0,20}(?:除外|以外|之外|不在|不采购|不代购|不包括|不购买|不属于|均不|都不))`;
const FA_CATEGORY = '(?<!\\p{Script=Arabic})(?:پوشاک|لباس(?![\\s\\p{Cf}]?شویی)|البسه|کفش|دارو)';
const FA_CATEGORY_OK = `(?=${FA_CATEGORY})(?<!(?:به[\\s\\p{Cf}]?جز|بجز|(?<!\\p{Script=Arabic})جز|غیر\\sاز|به[\\s\\p{Cf}]?غیر\\sاز|مگر|نمی|ندار|بدون|مناسب\\sنیست)[^${FA_STOP}؛;]{0,60})(?:${FA_CATEGORY})(?![^${FA_STOP}؛;]{0,60}(?:(?<!\\p{Script=Arabic})نمی[\\s\\p{Cf}]?\\p{Script=Arabic}+|خریداری\\sنمی|مستثنا|استثنا|نیست|ندارد))`;
const CATEGORY_MSG = (lang) => `clothing, footwear or medicines as goods the wholesale-buying service buys (${lang}) — owner, 2026-11-18: machine tools, construction materials and all other goods EXCEPT clothing and medicines. On this page they stand only in an exclusion ("except clothing and medicines", "not for clothing or medicines", "Does not fit: clothing, medicines"), never as an example ("for example clothing", "such as clothing", "including clothing")`;
// The denial that lets a promise word through: the promise refused in the same sentence, or the word inside quotation marks.
const UZ_UNPROMISED = `(?<!«[^»]{0,20})(?!la(?:may|mas|y\\s+olma[sy])|lan(?:may|mas)|\\s+ber(?:may|mas|a\\s+olma[sy])|[^.!?;]{0,60}(?:va${AP}?da\\s+(?:qil|ber)(?:may|mas|a\\s+olma[sy])|kafolat(?:la(?:may|mas|y\\s+olma[sy])|\\s+ber(?:may|mas|a\\s+olma[sy]))|(?:ber|de|ayt)maymiz))`;
const UZC_UNPROMISED = '(?<!«[^»]{0,20})(?!ла(?:май|мас|й\\s+олма[сй])|лан(?:май|мас)|\\s+бер(?:май|мас|а\\s+олма[сй])|[^.!?;]{0,60}(?:ваъда\\s+(?:қил|бер)(?:май|мас|а\\s+олма[сй])|кафолат(?:ла(?:май|мас|й\\s+олма[сй])|\\s+бер(?:май|мас|а\\s+олма[сй]))|(?:бер|де|айт)маймиз))';
const RU_UNPROMISED = `(?<!«[^»]{0,20})(?<!${RU_NO}[^.!?;]{0,40})(?<!(?<![а-яё])не\\s+(?:обеща|гарантиру|говор)[а-яё]*[^.!?;]{0,60})(?![^.!?;]{0,40}(?<![а-яё])(?:не\\s+(?:(?:по)?обеща|гарантиру|говор)|никто\\s+(?:[а-яё]+\\s+){0,2}?не\\s+(?:по)?(?:обеща|гарантир)))(?![а-яё]*\\s+(?:мы\\s+)?не\\s+(?:да[её]м|дадим|бывает|существует)(?![а-яё]))`;
const EN_UNPROMISED = `(?<![“"][^”"]{0,20})(?<!\\b(?:not|never|cannot|don[’']t|doesn[’']t|won[’']t|nobody)\\b[^.!?;]{0,40})(?<!(?:\\b(?:not|never|cannot|nobody|no\\s+one)|n[’']t)\\s+(?:[a-z]+\\s+){0,3}?(?:promise|guarantee|offer|say|claim)[a-z]*\\b[^.!?;]{0,60})`;
const ZH_UNPROMISED = `${zhNot(12)}(?<![“"][^”"]{0,12})`;
const ZH_REFUSED = `(?![^${ZH_STOP}，,]{0,10}(?:不承诺|不保证|不敢保证|不能保证|无法保证|无法承诺|我们也?(?:给不了|做不到)))`; // the object first: 最便宜的价格我们不承诺
const FA_UNPROMISED = `(?<!«[^»]{0,20})(?<!(?:هیچ[\\s\\p{Cf}]?کس\\s+نمی[\\s\\p{Cf}]?تواند|نمی[\\s\\p{Cf}]?توان(?:یم|م))(?!\\p{Script=Arabic})[^${FA_STOP}؛;]{0,60})(?![^${FA_STOP}؛;]{0,40}(?:نمی|ندار|نیست))`;
const UZ_PROMISE = `(?:(?<![a-zʻʼ])eng\\s+(?:arzon|yaxshi|qulay|foydali)\\s+narx(?!(?:lar)?\\s+(?:Pinduoduo|Taobao|Tmall|Alibaba|AliExpress|1688)-?da(?![a-zʻʼ]))(?![^.!?;,:]{0,20}(?<![a-zʻʼ])(?:har\\s+doim|doim|hamisha|har\\s+safar)(?![a-zʻʼ])[^.!?;,:]{0,40}(?<![a-zʻʼ])emas(?![a-zʻʼ]))|(?<![a-zʻʼ])(?<!(?<![a-zʻʼ])(?:zavod|fabrika)(?:ning)?\\s+)(?:narx|sifat)(?:lar)?(?:ni|i|ini|ga|iga)?\\s+kafolat(?![^.!?;]{0,60}\\?(?:\\s*$|\\s+Yo${AP}?q\\s*[.,;:—–-]))|(?<![a-zʻʼ])kafolatlangan\\s+(?:narx|sifat)|(?<![\\d.,])100\\s?(?:%|foiz)\\s+(?:sifat|kafolat|natija)|(?<![a-zʻʼ])risk(?:siz|\\s+yo${AP}?q)(?![a-zʻʼ])|(?<![a-zʻʼ])narx(?:lar)?imiz\\s+eng\\s+(?:arzon|past)(?![a-zʻʼ])|(?<![a-zʻʼ])xavf\\s+yo${AP}?q(?![a-zʻʼ]))${UZ_UNPROMISED}`;
const UZC_PROMISE = `(?:(?<![а-яёўқғҳ])энг\\s+(?:арзон|яхши|қулай|фойдали)\\s+нарх(?!(?:лар)?\\s+(?:Pinduoduo|Taobao|Tmall|Alibaba|AliExpress|1688)-?да(?![а-яёўқғҳ]))(?![^.!?;,:]{0,20}(?<![а-яёўқғҳ])(?:ҳар\\s+доим|доим|ҳамиша|ҳар\\s+сафар)(?![а-яёўқғҳ])[^.!?;,:]{0,40}(?<![а-яёўқғҳ])эмас(?![а-яёўқғҳ]))|(?<![а-яёўқғҳ])(?<!(?<![а-яёўқғҳ])(?:завод|фабрика)(?:нинг)?\\s+)(?:нарх|сифат)(?:лар)?(?:ни|и|ини|га|ига)?\\s+кафолат(?![^.!?;]{0,60}\\?(?:\\s*$|\\s+Йўқ\\s*[.,;:—–-]))|(?<![а-яёўқғҳ])кафолатланган\\s+(?:нарх|сифат)|(?<![\\d.,])100\\s?(?:%|фоиз)\\s+(?:сифат|кафолат|натижа)|(?<![а-яёўқғҳ])риск(?:сиз|\\s+йўқ)(?![а-яёўқғҳ])|(?<![а-яёўқғҳ])нарх(?:лар)?имиз\\s+энг\\s+(?:арзон|паст)(?![а-яёўқғҳ])|(?<![а-яёўқғҳ])хавф\\s+йўқ(?![а-яёўқғҳ]))${UZC_UNPROMISED}`;
const RU_PROMISE = `(?:(?<![а-яё])(?:сам[а-яё]{2,3}\\s+(?:выгодн|лучш|дешёв|дешев)[а-яё]+|(?<!(?<![а-яё])тем\\s+)лучш[а-яё]+)\\s+цен(?![а-яё]*\\s+[—–-]\\s+на\\s+(?:Pinduoduo|Taobao|Tmall|Alibaba|AliExpress|1688)(?![A-Za-z0-9]))|(?<![а-яё])гарантировать\\s+(?:[а-яё]+\\s){0,3}?(?:цен|качеств)(?![^.!?;]{0,60}(?<![а-яё])не\\s+(?:можем|сможем|бер[её]мся|станем|будем|могу)(?![а-яё]))(?![^.!?;]{0,60}\\?(?:\\s*$|\\s+Нет\\s*[.,;:—–-]))|(?<![а-яё])гарантир(?!овать(?![а-яё]))[а-яё]+\\s+(?:[а-яё]+\\s){0,3}?(?:цен|качеств)(?![^.!?;]{0,60}\\?(?:\\s*$|\\s+Нет\\s*[.,;:—–-]))|(?<!(?<![а-яё])(?:заводск[а-яё]+|фабричн[а-яё]+|завода|фабрики|производителя|изготовителя)\\s+)(?<![а-яё])гаранти[а-яё]{1,3}\\s+(?:[а-яё]+\\s)?(?:качеств|цен|результат)(?![а-яё]*\\s+(?:от\\s+)?(?:завода|фабрики|производителя|изготовителя)(?![а-яё]))|(?<![а-яё])(?:цен|качеств)[а-яё]{1,2}\\s+(?:(?!не\\s)[а-яё]+\\s)?гарантир[а-яё]+|(?:(?<![\\d.,])100\\s?%|(?<![а-яё])стопроцентн[а-яё]+)\\s+(?:гаранти|качеств|результат)|(?<![а-яё])(?:без|никакого|никаких)\\s+риск(?:а|ов)(?![а-яё])|(?<![а-яё])наши\\s+цены\\s+(?:[—–-]\\s+)?сам[а-яё]{2}\\s+(?:низк|дешёв|дешев|выгодн)[а-яё]+|(?<![а-яё])у\\s+нас\\s+сам[а-яё]{2,3}\\s+низк[а-яё]+\\s+цен)${RU_UNPROMISED}`;
const EN_PROMISE = `(?:(?<!\\b(?:Pinduoduo|Taobao|Tmall|Alibaba|AliExpress|1688)(?:[’']s)?\\s+(?:has|have|offers?|shows?)\\s+(?:the\\s+)?)\\b(?:best|cheapest)\\s+(?:possible\\s+|factory\\s+)?(?:prices?|deals?)\\b(?!\\s+(?:(?:is|are)\\s+(?:not\\s+(?:always|necessarily|everything|the\\s+same)|rarely|seldom)|(?:isn[’']t|aren[’']t)\\s+(?:always|necessarily|everything))\\b)|\\bguarantee[sd]?\\s+(?:(?:you|the|a|our)\\s+){0,2}(?:best|lowest|quality|prices?)\\b(?![^.!?;]{0,60}\\?(?:\\s*$|\\s+(?:No|Not\\s+(?:always|necessarily|really|quite))\\s*[.,;:—–-]))|\\bguarantee[sd]?\\s+(?:that\\s+)?(?:[a-z’']+\\s+){0,4}?(?:best|lowest|cheapest)\\s+(?:possible\\s+)?prices?\\b(?![^.!?;]{0,60}\\?(?:\\s*$|\\s+Not?\\b))|\\bour\\s+prices?\\s+(?:is|are)\\s+(?:the\\s+)?(?:cheapest|best|lowest)\\b|\\b(?:prices?|quality)\\s*,\\s+guaranteed\\b|(?<!\\bno\\s+)(?!(?<=\\b(?:factory|manufacturer|maker)(?:[’']s)?\\s+)(?:quality|price)\\s+guarantee(?:\\s+\\(warranty\\))?\\s+(?:usually\\s+|normally\\s+|typically\\s+|often\\s+)?(?:lasts|runs|covers|is\\s+(?:usually\\s+|normally\\s+|typically\\s+)?\\d))(?!(?:quality|price)\\s+guarantee\\s+(?:from|of)\\s+the\\s+(?:factory|manufacturer|maker)\\s+(?:usually\\s+|normally\\s+|typically\\s+|often\\s+)?(?:lasts|runs|covers|is\\s+(?:usually\\s+|normally\\s+|typically\\s+)?\\d))\\b(?:quality|price)\\s+guarantee\\b|(?<!\\bno\\s+)\\bguaranteed\\s+(?:quality|prices?|results?)\\b|\\b(?:prices?|quality)\\s+(?:is\\s+|are\\s+)?guaranteed\\b|(?<![\\d.,])100\\s?%\\s+(?:quality|guarantee|satisfaction)|\\bno\\s+risk\\b(?![-\\s]free)|(?<!\\bno\\s+)(?<!\\bno\\s+[a-z-]+\\s+(?:is|are)\\s+(?:ever\\s+|really\\s+|entirely\\s+)?)\\brisk[-\\s]free\\b)${EN_UNPROMISED}`;
const ZH_PROMISE = `${ZH_UNPROMISED}(?:(?:最(?:便宜|优惠|好|优|佳)的?(?:价格|价(?!值))|(?:我们|本公司|我司)的?价格是?最(?:便宜|低|优惠))(?![^${ZH_STOP}，,]{0,10}(?:不一定|未必|并不(?:一定|总是|等于|代表|意味)))|保证[^${ZH_STOP}，,]{0,4}?(?:质量|品质)(?![^${ZH_STOP}]{0,12}[？?]\\s*(?:$|(?:不能|不会|不是|不可以|不保证|不一定|没有|无法|否)[。，,；;：:！!]))|保证[^${ZH_STOP}，,]{0,4}?(?:价格|最低)|保证拿到|(?:质量|品质)有?(?:保证|保障)(?!期|金)|(?:100%|百分之?百)\\s?(?:保证|保障|质量)|零风险|无风险)${ZH_REFUSED}`;
const FA_PROMISE = `(?:(?:بهترین|ارزان[\\s\\p{Cf}]?ترین)\\sقیمت(?![\\p{Script=Arabic}\\p{Cf}]*\\sدر\\s(?:پین[\\s\\p{Cf}]?دودو|تائوبائو|تی[\\s\\p{Cf}]?مال|علی[\\s\\p{Cf}]?بابا|1688)\\sاست(?!\\p{Script=Arabic}))|(?:تضمین|ضمانت)\\s(?:100%\\s)?(?:کیفیت|قیمت)(?!\\sکارخانه(?![\\p{Script=Arabic}\\p{Cf}]))|قیمت[\\p{Script=Arabic}\\p{Cf}]*\\sما\\s(?:ارزان|پایین)[\\s\\p{Cf}]?ترین(?!\\p{Script=Arabic})|(?:کیفیت|قیمت)(?:\\p{Mn}|ی)?\\s(?:[\\p{Script=Arabic}\\p{Cf}]+\\s){0,3}?(?:تضمین|ضمانت)(?![^${FA_STOP}؛;]{0,40}؟(?:\\s*$|\\s+(?:خیر|نه)\\s*[.،,؛:—–-]))|(?:100%|صد[\\s\\p{Cf}]?در[\\s\\p{Cf}]?صد)\\s?(?:تضمین|ضمانت)|بدون\\s(?:هیچ[\\s\\p{Cf}]?(?:گونه\\s)?)?ریسک)${FA_UNPROMISED}|(?<!\\p{Script=Arabic})هیچ\\sریسکی\\s(?:وجود\\s)?ندارد`;
const PROMISE_MSG = (lang) => `a result promise on price or quality (${lang}) — "the best / the cheapest price", "guaranteed quality", "100%", "no risk": nothing of the kind is confirmed (owner, 2026-11-17), and the site promises no price, no quality and no result. What passes: a denial in the same sentence ("we do not promise the lowest price"), the word inside quotation marks, and a question answered "No". A seller's, a platform's or a market's own price is "the lowest price" (eng past narx · самая низкая цена · 最低价 · پایین‌ترین قیمت), not "the cheapest / the best price"; a factory's warranty is written without "quality" (warranty · zavod kafolati · гарантия завода · 质保 · ضمانت کارخانه)`;

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

  /* — tracking is stage-by-stage QR scanning: never real-time, never GPS (the GPS word and the tracking word up to 30 zh /
   *   60 fa characters apart, either order — guard hardening, 2026-11-13) — */
  { id: 'zh.realTime', msg: 'says real-time (zh) — tracking is stage-by-stage QR scanning',
    re: /(?<![不非没无未][^。！？!?；;]{0,10})实时|即时(?:追踪|跟踪|定位|位置|查询|更新|监控|动态)/iu,
    bad: ['提供实时追踪', '即时追踪您的货物'],
    good: ['这不是车辆的实时位置。', '即时估价'] },
  { id: 'zh.livePos', msg: 'claims a live position (zh) — tracking is stage-by-stage QR scanning',
    re: /(?<![不非没无未][^。！？!?；;]{0,10})(?:实时|动态|即时|在线|实况)[^。！？!?；;]{0,4}(?:车辆|卡车|货车|货物)?(?:的)?(?:位置|定位|坐标|轨迹)/iu,
    bad: ['在线查看货车位置'],
    good: ['这不是车辆的实时位置', '仓库位置在义乌', '在线地图上查看仓库位置', '官方在线平台'] },
  { id: 'zh.gps', msg: 'implies live GPS position (zh) — tracking is stage-by-stage QR scanning',
    re: /(?<![不非没无未][^。！？!?；;]{0,10})(?:GPS|北斗|卫星)(?!\s?(?:追踪器|跟踪器|定位器|tracker))(?:\s?(?:定位|追踪|跟踪|监控|实时)|(?![^。！？!?；;]{0,2}(?:不(?!断|间断|仅|同)|没|无(?!论)|未|非(?!常)))[^。！？!?；;]{0,30}?(?:定位(?!器|设备|装置|仪)|追踪(?!器)|跟踪(?!器)|监控(?!器|摄像|设备)|实时))|(?<![不非没无未][^。！？!?；;]{0,10})(?:追踪|跟踪|定位|查询)[^。！？!?；;]{0,30}(?<!(?:不(?!断|间断|仅|同)|没|无(?!论)|未|非(?!常))[^。！？!?；;]{0,2})GPS(?!\s?(?:追踪器|跟踪器|定位器|tracker))/iu,
    bad: ['GPS定位追踪您的货物', '卫星定位',
      // guard hardening (2026-11-13): GPS and the tracking word up to 30 characters apart, either order; a denial at the GPS word passes
      '您可以通过GPS，在我们的ERP系统和Telegram中跟踪货物。', '通过GPS经由我们在Telegram中的ERP系统追踪货物。'],
    good: ['无人机、GPS 追踪器、带 SIM 卡的智能手表', '这不是 GPS 定位',
      // guard hardening (2026-11-13): GPS and the tracking word up to 30 characters apart, either order; a denial at the GPS word passes
      'GPS不用于跟踪货物：您通过我们的ERP系统在Telegram中跟踪货物。', '跟踪货物不靠GPS，而是通过我们的ERP系统。'] },
  { id: 'fa.realTime', msg: 'says real-time (fa) — tracking is stage-by-stage QR scanning',
    re: /(?<!(?:نه|نیست)[^.؟!?]{0,20})(?:بلادرنگ|ریل[\s\p{Cf}]?تایم|real[\s-]?time|به[\s\p{Cf}]?صورت\s(?:زنده|لحظه[\s\p{Cf}]?ای|آنی)|لحظه[\s\p{Cf}]?به[\s\p{Cf}]?لحظه|لحظه[\s\p{Cf}]?ای(?!\p{Script=Arabic}))(?![^.؟!?]{0,30}(?:نیست|نمی[\s\p{Cf}]?(?:دهد|کند|شود|بینید)|ندارد))/iu,
    bad: ['ردیابی بلادرنگ', 'اطلاعات لحظه‌ای بار'],
    good: ['وضعیت مرحله به مرحله تغییر می‌کند', 'این ردیابی لحظه‌ای نیست'] },
  { id: 'fa.livePos', msg: 'claims a live position (fa) — tracking is stage-by-stage QR scanning',
    re: /(?:موقعیت|مکان|لوکیشن|ردیابی|رهگیری|پیگیری)(?:[\s\p{Cf}]?(?:ی|\p{Mn}))?\s(?:زنده|لحظه[\s\p{Cf}]?ای|آنی|آنلاین|بلادرنگ)(?![^.؟!?]{0,40}(?:نیست|نمی[\s\p{Cf}]?(?:دهد|کند|شود|بینید)|ندارد))/iu,
    bad: ['موقعیت زنده کامیون را ببینید', 'ردیابی لحظه‌ای محموله', 'پیگیری آنلاین بار'],
    good: ['این موقعیت زنده‌ی خودرو نیست.', 'حیوانات زنده و گیاهان', 'پلتفرم آنلاین رسمی بازار'] },
  { id: 'fa.gps', msg: 'implies live GPS position (fa) — tracking is stage-by-stage QR scanning',
    re: /(?<!(?:نه|نیست|بدون)[^.؟!?]{0,15})(?:GPS|جی[\s\p{Cf}]?پی[\s\p{Cf}]?اس|ماهواره(?:ای)?)(?![\s\p{Cf}]?(?:tracker|ترکر))[^.؟!?]{0,60}(?:ردیابی|رهگیری|پیگیری|موقعیت[\s\p{Cf}]?یابی)|(?:ردیابی|رهگیری|پیگیری)[^.؟!?]{0,60}(?<!(?<!\p{Script=Arabic})(?:نه|بدون)[\s\p{Cf}](?:(?:با|از|به|از\sطریق|به\sکمک|با\sکمک|استفاده\sاز)[\s\p{Cf}])?)(?:GPS|جی[\s\p{Cf}]?پی[\s\p{Cf}]?اس)/iu,
    bad: ['ردیابی با GPS', 'پیگیری با جی‌پی‌اس',
      // guard hardening (2026-11-13): GPS and the tracking word up to 60 characters apart, either order; «نه با GPS», «بدون GPS» pass
      'بار را با GPS از طریق سیستم ERP ما در تلگرام پیگیری می‌کنید.', 'ردیابی کامیون از طریق سیستم ERP ما در تلگرام با جی‌پی‌اس است.'],
    good: ['پهپادها، ردیاب‌های GPS، ساعت‌های هوشمند',
      // guard hardening (2026-11-13): GPS and the tracking word up to 60 characters apart, either order; «نه با GPS», «بدون GPS» pass
      'پیگیری بار از طریق سیستم ERP ما در تلگرام است، نه با GPS.', 'پیگیری بار بدون GPS و از طریق سیستم ERP ما در تلگرام است.'] },

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
    re: /(?<!不是|并非)我(?:们|司)(?:自己)?的\s?(?:义乌|广州|喀什|中国)?\s?(?:的)?\s?(?:仓库|货仓|库房|仓储中心|收货点)|我(?:们|司)(?:自己)?在\s?(?:义乌|广州|喀什|中国)\s?的\s?(?:仓库|货仓|库房|仓储中心|收货点)|我司\s?(?:义乌|广州|喀什)?\s?仓库|自有(?:的)?(?:仓库|收货点)|自营仓库|(?<![\w./@-])GSR(?:\s?Logistics)?\s?(?:自有的?|自己的)\s?(?:义乌|广州|喀什|中国)?\s?(?:的)?\s?(?:仓库|收货点)|(?<![\w./@-])GSR(?:\s?Logistics)?\s?的?\s?(?:(?:义乌|广州|喀什|中国)\s?(?:的)?\s?(?:仓库|收货点)|收货点)/iu,
    bad: ['我们的义乌仓库', '我们的仓库工作人员', 'GSR的义乌仓库', 'GSR Logistics 义乌仓库', '我们在义乌的仓库', '我们的收货点', 'GSR自己的仓库', 'GSR 的收货点'],
    // The contact page lists facebook.com/gsrlogistics right above its "中国收货点" heading: a handle
    // or URL is not the company's name.
    good: ['我们在义乌仓库为您验货', '义乌收货点', '仓库工作人员在每个环节扫描二维码', '我们在义乌的员工', '提交报关单（GTD）后运抵 GSR 仓库。', '货物运抵 GSR 的仓库', 'Facebook facebook.com/gsrlogistics 中国收货点', '频道 t.me/gsrlogistics 中国收货点',
      // The warehouse under customs control in Tashkent is a PARTNER's (owner, 2026-11-11): GSR allocates space in it.
      '这不是我们自己的仓库。', '我们没有自己的仓库，仓位安排在合作方的仓库里。', '在塔什干仓库为客户分配仓位', '合作方的仓库', '在合作方的监管仓库安排仓位；可车对车换装，或经仓库换装。', '仓库属于我们的合作方；货物在那里处于海关监管之下。'] },
  { id: 'fa.ourWarehouse', msg: 'claims a China receiving point as our own (fa)',
    re: /انبار(?:\p{Cf}?(?:های|ها))?(?:\p{Mn}|ی)?\s?(?:ما|خودمان|خود\sما)(?!\p{Script=Arabic})(?![^.؟!?؛;]{0,25}(?:ندار|نیست))|انبار(?:\p{Cf}?(?:های|ها))?مان(?!\p{Script=Arabic})|انبار(?:\p{Mn}|ی)?\s?(?:GSR|جی[\s\p{Cf}]?اس[\s\p{Cf}]?آر)[^.؟!?،]{0,14}(?:ییوو|گوانگ[\s\p{Cf}]?(?:ژو|جو)|کاشغر|چین)|انبار(?:\p{Mn}|ی)?\s?(?:ییوو|گوانگ[\s\p{Cf}]?(?:ژو|جو)|کاشغر)(?:\p{Mn}|ی)?\s?(?:GSR|جی[\s\p{Cf}]?اس[\s\p{Cf}]?آر)|(?:محل|نقطه|نشانی|مرکز)(?:\p{Mn}|ی)?\s(?:تحویل|دریافت)(?:\sبار)?(?:\p{Mn}|ی)?\s(?:ما|خودمان|GSR|جی[\s\p{Cf}]?اس[\s\p{Cf}]?آر)(?!\p{Script=Arabic})/iu,
    bad: ['انبار ما در ییوو', 'انبارمان', 'انبار GSR در ییوو', 'انبار ییووی GSR', 'انبار GSR در چین', 'محل تحویل بار ما در ییوو', 'محل تحویل بار GSR'],
    good: ['انبار ییوو', 'نقطه دریافت ییوو', 'انبار ماشین‌آلات', 'کارکنان ما در ییوو', 'نشانی ما در تاشکند', 'بار وارد انبار نگهداری موقت می‌شود، اظهارنامهٔ گمرکی (GTD) ثبت می‌شود و کالا به انبار GSR می‌رسد.', 'انبار GSR در تاشکند',
      // As in zh: the warehouse under customs control in Tashkent is a partner's.
      'انبار خودمان را نداریم؛ جا را در انبار همکارمان اختصاص می‌دهیم.', 'این انبار مال ما نیست: متعلق به همکار ماست.', 'در انبار تاشکند فضا اختصاص می‌دهیم', 'انبار همکار ما', 'در انبار همکار ما جا اختصاص می‌دهیم؛ بار را از کامیون به کامیون یا از راه انبار جابه‌جا می‌کنیم.', 'انبار متعلق به همکار ماست؛ بار در آنجا تحت نظارت گمرک نگهداری می‌شود.'] },
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
    bad: ['Menejerlarimiz tojik tilini biladi, afgʻonistonlik mijozlar bilan bemalol gaplashadi.', 'Менежерларимиз тожик тилини билади.', 'Forsiyzabon menejerimiz siz bilan bogʻlanadi.', 'Tillar: oʻzbek, rus, ingliz, fors.', 'Dari tilini tushunadigan menejer ajratamiz.', 'Pushtu tilida ham gaplashamiz', 'Тиллар: ўзбек, рус, инглиз, форс.',
      'Menejerlar oʻzbek, rus, xitoy va fors tillarida gaplashadi', 'Menejerlarimiz forscha javob beradi', 'Xodimlarimiz dari tilida gaplashadi', 'Fors tilida ham gaplashamiz', 'Forscha javob beramiz',
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
    bad: ['Наши менеджеры знают таджикский и свободно объясняются с клиентами из Афганистана.', 'С вами свяжется менеджер — носитель фарси.', 'Языки: узбекский, русский, английский, фарси.', 'Говорящий на дари менеджер ответит вам.', 'Переписку на фарси ведём сами.', 'Есть менеджер, для которого дари — родной язык.', 'Отвечаем на пушту',
      'Менеджеры говорят на узбекском, русском, китайском и фарси', 'поддержка на персидском', 'Наши сотрудники владеют дари', 'Отвечаем на фарси', 'Говорим на персидском и дари',
      'Фарсиязычные менеджеры', 'Говорим по-персидски', 'Менеджер со знанием фарси', 'Отвечаем на языке дари', 'Консультируем на фарси', 'Наши менеджеры знают узбекский, русский и дари', 'Отвечаем на русском, узбекском и фарси'],
    good: ['Если напишете на фарси или дари, ответим на фарси с помощью переводчика', 'Можно ли писать на фарси или дари и куда писать?', 'Менеджеры говорят на узбекском, русском и китайском', 'Менеджеры не говорят на фарси',
      'Менеджеры говорят на узбекском и русском; сайт есть и на фарси.', 'Сайт доступен на фарси', 'Отвечаем также на английском, русском и узбекском', 'Форс-мажор оговаривается в договоре', 'Мы подарим вам образец',
      'На фарси не говорим', 'Менеджеры не знают фарси и дари', 'Поддержки на фарси нет', 'Консультации на фарси не проводим', 'Менеджеров со знанием фарси нет', 'Фарсиязычных менеджеров у нас нет',
      'Говорите ли вы на фарси?', 'через порты Персидского залива', 'Клиенты могут писать на фарси', 'Менеджеры знают рынок и требования таможни'] },
  { id: 'en.persianStaff', msg: STAFF_MSG('en'),
    re: new RegExp(EN_STAFF, 'iu'),
    bad: ['Our managers know Tajik, so they talk to clients from Afghanistan freely.', 'A native Farsi speaker will contact you.', 'Languages: Uzbek, Russian, English, Persian.', 'We also communicate in Pashto and Dari.', 'We handle correspondence in Persian ourselves.', 'Talk to us in Dari — our manager will understand you.',
      'Our managers speak Uzbek, Russian, Chinese and Persian', 'Farsi-speaking staff', 'support in Dari', 'We answer in Persian', 'Our team replies in Dari and Persian', 'Our managers also answer in Dari',
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
    bad: ['我们的经理懂塔吉克语，能与阿富汗客户顺畅交流。', '母语为波斯语的经理会与您联系。', '语言：乌兹别克语、俄语、英语、波斯语。', '波斯语往来函件由我们自行处理。', '您可以直接说达里语，我们的经理听得懂。', '我们也讲普什图语。',
      '客户经理会说乌兹别克语、俄语、中文和波斯语', '波斯语客服', '我们用波斯语回复', '我们的团队通晓达里语', '会波斯语的客户经理', '我们用中文、俄语和波斯语回复', '我们提供波斯语服务', '支持波斯语沟通',
      '客户经理懂乌兹别克语、俄语和达里语'],
    good: ['您可以用波斯语或达里语来信，我们会借助翻译用波斯语回复', '可以用波斯语、达里语留言吗？发到哪里？', '客户经理可用乌兹别克语、俄语和中文沟通', '客户经理不会说波斯语', '客户经理说乌兹别克语和俄语；本网站也有波斯语版本。', '本网站也有波斯语版本', '我们也用英语、俄语和乌兹别克语回复',
      '我们没有波斯语客服', '我们不提供波斯语服务', '没有会波斯语的客户经理', '我们不用波斯语回复', '团队里没有人会说达里语', '你们会说波斯语吗？', '波斯湾港口', '客户可以用波斯语来信'] },
  { id: 'fa.persianStaff', msg: STAFF_MSG('fa'),
    re: new RegExp(FA_STAFF, 'iu'),
    bad: ['کارشناسان ما تاجیکی می‌دانند و با مشتریان افغانستان راحت گفت‌وگو می‌کنند.', 'کارشناسی که زبان مادری‌اش فارسی است با شما تماس می‌گیرد.', 'زبان‌ها: ازبکی، روسی، انگلیسی، فارسی.', 'به پشتو و دری هم گفت‌وگو می‌کنیم.', 'مکاتبه به فارسی را خودمان انجام می‌دهیم.', 'با ما به دری حرف بزنید؛ کارشناس ما می‌فهمد.',
      'مدیران ما به فارسی پاسخ می‌دهند', 'مدیران ما فارسی صحبت می‌کنند', 'پشتیبانی به زبان فارسی', 'کارمند فارسی‌زبان داریم', 'کارشناس دری‌زبان', 'کارشناس ما فارسی صحبت می‌کند', 'کارشناسان ما دری می‌دانند', 'به فارسی پاسخ می‌دهیم', 'فارسی هم صحبت می‌کنیم',
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
      'Hairatan · Mazar-i-Sharif · Kabul', 'To one of two points: Tehran or Mashhad.', 'Mashhad — we deliver the cargo to the city.', 'A new direction: Iran, transit and warehouse', 'Iran', 'Kazakhstan',
      // guard-verify H5 (2026-11-13): a negation word used as a quantifier ("no extra …", «вам не нужно …», 您无需…) is not a denial
      'Our partners — customs agents (declarants) — clear cargo for Kabul too, with no delays.',
      'Our partners — customs agents (declarants) — clear customs in Kabul as well, with no extra cost to you.'],
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
      'حیرتان • مزار شریف • هرات', 'تا یکی از این دو نقطه: تهران یا مشهد.', 'مشهد — بار را تا خود شهر می‌رسانیم.', 'مسیر تازه: ایران، ترانزیت و انبار', 'دو مسیر به ایران', 'ایران', 'قزاقستان',
      // guard-verify H10 (2026-11-13): Persian «در کابل» (in Kabul) — not a cable
      'شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — در کابل هم ترخیص گمرکی را انجام می‌دهند.', 'از طریق شرکای ما — کارگزاران گمرکی — بار در کابل هم ترخیص و تحویل می‌شود.',
      'شرکای ما در کابل هم بار شما را تحویل می‌گیرند.', 'ما در کابل هم بار تحویل می‌دهیم.'],
    good: ['اکنون با کامیون به افغانستان هم بار می‌بریم', 'شرکت لجستیک GSR Logistics در تاشکند اکنون با کامیون به افغانستان هم بار می‌برد', 'حمل بار به افغانستان', 'حمل بار با کامیون به افغانستان از چین و از ازبکستان', 'تا مزار شریف می‌رسانیم', 'تا حیرتان و مزار شریف می‌رسانیم', 'بار را تا خود شهر می‌رسانیم', 'چین ← افغانستان', 'حمل بار از ازبکستان به افغانستان',
      'از طریق قزاقستان به تاشکند می‌رسد', 'با راه‌آهن قزاقستان به تاشکند می‌آوریم', 'تا مرز ترکمنستان می‌رسانیم', 'ترانزیت قزاقستان ۱ تا ۳ روز طول می‌کشد', 'اظهارنامهٔ ترانزیت در سمت قزاقستان', 'کابل شارژ را به تاشکند می‌فرستیم', 'خورگوس (مرز قزاقستان) ← آلماتی ← شیمکنت ← تاشکند',
      'کامیون از چین به قزاقستان وارد می‌شود', 'کامیون بار را به قزاقستان می‌برد و از آنجا به تاشکند می‌آید', 'خورگوس: چین ← قزاقستان', 'ممنوعیت ارسال واگن‌های مسطح خالی به دوستیک و آلتین‌کول', 'کارخانه‌هایی که صادرات به اروپا دارند',
      'به قزاقستان ارسال نمی‌کنیم', 'به ایران بار نمی‌بریم', 'حمل بار به قزاقستان نداریم', 'حمل بار به هندوستان انجام نمی‌شود', 'آیا حمل بار به روسیه هم دارید؟', 'آیا به ایران هم بار می‌برید؟',
      'مسیر ایران نداریم', 'مسیر افغانستان', 'مسیر تازه: حمل بار با کامیون به افغانستان', 'انتقال پول به چین', 'حمل و نقل به افغانستان',
      'به کابل، هرات و قندهار بار نمی‌بریم', 'آیا تا هرات هم می‌رسانید؟', 'حیرتان • مزار شریف', 'افغانستان', 'ازبکستان', 'جواهرات و اشیای عتیقه', 'کابل شارژ و چراغ LED',
      // guard-verify true2 (2026-11-13): true sentences next to what these fixes read: LV b8 «без уплаты» / «soliqsiz» / 无需缴纳 / «بدون پرداخت», "since 2026", possessives, «کابل شارژ»
      'کابل شارژ، هدفون و لوازم برقی از کالاهای رایج بار به افغانستان است.'] },

  /* — the Afghanistan direction: no number of days and no price (block rules: one paragraph, heading, list item
       or table row at a time) — */
  { id: 'uz.afghanFigure', block: true, msg: FIGURE_MSG('uz'),
    re: new RegExp(`${beside(AFGHAN[0], either(UZ_FIGURE, UZ_WORDFIG), '.!?;')}|${beside(AFGHAN[1], either(UZC_FIGURE, UZC_WORDFIG), '.!?;')}`, 'iu'),
    bad: ['Hayratongacha yoʻl yigirma kun davom etadi.', 'Ҳайратонгача йўл йигирма кун давом этади.', 'Afgʻonistonga yetkazish Toshkentga yetkazishdan atigi 20% qimmat.', 'Afgʻonistonga yuk bir haftada yetib boradi.', 'Hayratongacha ikki-uch kunda yetkazamiz.', 'Toshkentdan chiqqan fura Mozori Sharifga uchinchi kuni yetib boradi.', 'Xitoydan Hayratongacha — taxminan bir oy.', 'Afgʻonistonga fura narxi uch ming dollardan boshlanadi.', 'Афғонистонга юк бир ҳафтада етиб боради.',
      'Afgʻonistonga 10–12 kunda yetkazamiz', 'Hayratongacha 5–7 kun', 'Mozori Sharifgacha yetkazish — 1 200 $ dan', 'Toshkentdan Hayratonga 3 kun, narxi 900 dollar', '2 hafta ichida Afgʻonistonga', '12 000 000 soʻm — Mozori Sharifgacha', 'Hayratonda 2–3 soat kutiladi',
      'Афғонистонга 10–12 кунда етказамиз', 'Ҳайратонгача 5–7 кун', 'Мозори Шарифгача 1 200 $ дан',
      // "calendar" between the number and the day (premerge review, 2026-11-13)
      'Hayratonga yetkazish 10 kalendar kun davom etadi.', 'Yuk Hayratonga oʻn kalendar kunda yetadi.', 'Ҳайратонга етказиш 10 календарь кун давом этади.', 'Юк Ҳайратонга ўн календарь кунда етади.'],
    good: ['Xitoydan Toshkentga yigʻma yuk 15–25 kunda keladi; Afgʻoniston boʻyicha muddatni menejer hisoblaydi.', 'Ikki yoʻnalishda: Xitoydan Afgʻonistonga va Oʻzbekistondan Afgʻonistonga.', 'Bugungi kunda yetkazish nuqtalari shu ikkita: Hayraton va Mozori Sharif.',
      'Xitoydan Toshkentga 15–25 kun', 'Saytdagi tariflar, kalkulyator va muddatlar faqat Xitoy → Toshkent yoʻnalishiga tegishli.', 'Narx va muddat — soʻrov boʻyicha: menejer ularni yukingiz boʻyicha hisoblab beradi.',
      'Xizmat 11 — Afgʻoniston', 'WhatsApp (+998 00 000 00 00) yoki Telegramga yozing: yuk nima, hajmi yoki ogʻirligi qancha, hozir qayerda va qayerga borishi kerak — Hayratongami yoki Mozori Sharifgami.',
      'Yigʻma yuk 15–25 kun. Afgʻonistonga yuk — narx va muddat soʻrov boʻyicha.', 'Afgʻonistonga yuk tashishni 2026-yilda boshladik.',
      'Saytdagi 1 m³ minimum Xitoydan Toshkentga keladigan yigʻma yukka tegishli.',
      'Хитойдан Тошкентга 15–25 кун', 'Хизмат 11 — Афғонистон',
      // printed by the guides (2026-11): every rule must let these through
      'Soʻng fura Termizga boradi va Hayratonga oʻtadi. Bojxona kodeksining 218-moddasiga koʻra, bojxona nazorati ostida avtotransportda tashilayotgan tovarlar 10 kalendar kun ichida yetkazilishi kerak.', 'Mozori Sharif Hayratondan taxminan 80 km uzoqlikda joylashgan.', 'Сўнг фура Термизга боради ва Ҳайратонга ўтади. Божхона кодексининг 218-моддасига кўра, божхона назорати остида автотранспортда ташилаётган товарлар 10 календарь кун ичида етказилиши керак.', 'Мозори Шариф Ҳайратондан тахминан 80 км узоқликда жойлашган.'] },
  { id: 'ru.afghanFigure', block: true, msg: FIGURE_MSG('ru'),
    re: new RegExp(beside(AFGHAN[2], either(RU_FIGURE, RU_WORDFIG), '.!?;'), 'iu'),
    bad: ['До Хайратона груз идёт двенадцать дней.', 'До Хайратона груз доходит примерно за десять дней.', 'Доставка в Афганистан всего на 20% дороже, чем в Ташкент.', 'До Хайратона довозим за неделю.', 'В Мазари-Шариф фура приходит на третий день.', 'Из Китая до Хайратона — около месяца.', 'Доставка в Афганистан занимает две-три недели.', 'Фура в Афганистан стоит от трёх тысяч долларов.',
      'В Афганистан — 10–14 дней', 'До Хайратона 5–7 дней', 'Доставка до Мазари-Шарифа от 1 200 $', 'за 3 дня до Хайратона', 'от 5 до 7 дней до Мазари-Шарифа', 'В Афганистан за 2 недели', 'до Хайратона — за 2 суток',
      // "calendar" between the number and the day (premerge review, 2026-11-13)
      'Доставка в Хайратон занимает 10 календарных дней.', 'Груз доходит до Хайратона за десять календарных дней.'],
    good: ['Сборный груз из Китая в Ташкент идёт 15–25 дней; по Афганистану срок считает менеджер.', 'Два направления: из Китая в Афганистан и из Узбекистана в Афганистан.',
      'Из Китая в Ташкент 15–25 дней', 'Тарифы, калькулятор и сроки на сайте относятся только к направлению Китай → Ташкент.', 'Цена и срок — по запросу: менеджер считает их под ваш груз.', 'Услуга 11 — Афганистан',
      'Напишите в WhatsApp (+998 00 000 00 00) или в Telegram: что за груз, какой у него объём или вес, где он сейчас и куда его везти — в Хайратон или в Мазари-Шариф.', 'Сборный груз 15–25 дней. Грузы в Афганистан — цена и срок по запросу.',
      'Минимум 1 м³, указанный на сайте, относится к сборному грузу из Китая в Ташкент.',
      // printed by the guides (2026-11): every rule must let these through
      'Затем фура едет в Термез и переезжает в Хайратон. По статье 218 Таможенного кодекса товары, перевозимые автотранспортом под таможенным контролем, должны быть доставлены в течение 10 календарных дней.', 'От Хайратона до Мазари-Шарифа около 80 км.'] },
  { id: 'en.afghanFigure', block: true, msg: FIGURE_MSG('en'),
    re: new RegExp(beside(AFGHAN[3], either(EN_FIGURE, EN_WORDFIG), '.!?;'), 'iu'),
    bad: ['Delivery to Mazar-i-Sharif takes about twelve days.', 'Expect your goods in Mazar-i-Sharif a fortnight after loading.', 'Shipping to Afghanistan is only 20% more expensive than to Tashkent.', 'Cargo reaches Hairatan within a week.', 'The truck arrives in Mazar-i-Sharif on the third day.', 'From China to Hairatan in about a month.', 'Delivery to Afghanistan takes two to three weeks.', 'A truck to Afghanistan starts at three thousand dollars.',
      'Cargo to Afghanistan in 10–14 days', 'To Hairatan in 5–7 days', 'from $1,200 to Mazar-i-Sharif', 'Delivery to Mazar-i-Sharif takes 3 days', '2 weeks to Hairatan', 'Afghanistan: from 900 USD per truck', 'The truck reaches Hairatan within 48 hours',
      // "calendar" between the number and the day (premerge review, 2026-11-13)
      'Delivery to Hairatan takes 10 calendar days.', 'The truck reaches Hairatan in ten calendar days.'],
    good: ['Consolidated cargo from China to Tashkent takes 15–25 days; for Afghanistan the manager calculates the time.', 'Two: from China to Afghanistan and from Uzbekistan to Afghanistan.', 'Today these are the two delivery points: Hairatan and Mazar-i-Sharif.',
      'From China to Tashkent in 15–25 days', 'The tariffs, the calculator and the transit times on this site apply to the China → Tashkent direction only.', 'Price and timing are on request: the manager calculates them for your cargo.', 'Service 11 — Afghanistan',
      'Message us on WhatsApp (+998 00 000 00 00) or Telegram: what the cargo is, its volume or weight, where it is now and where it has to go — Hairatan or Mazar-i-Sharif.',
      'Consolidated truck cargo takes 15–25 days. Cargo to Afghanistan is quoted on request.', 'The 1 m³ minimum published on this site applies to consolidated cargo from China to Tashkent.',
      'Regulation No. 737 of 31 December 2022 applies to transit to Afghanistan',
      // printed by the guides (2026-11): every rule must let these through
      'The truck then drives to Termez and crosses to Hairatan. Under Article 218 of the Customs Code, goods carried by road under customs control must be delivered within 10 calendar days.', 'Mazar-i-Sharif is about 80 km from Hairatan.'] },
  { id: 'zh.afghanFigure', block: true, msg: FIGURE_MSG('zh'),
    re: new RegExp(beside(AFGHAN[4], either(ZH_FIGURE, ZH_WORDFIG), ZH_STOP), 'iu'),
    bad: ['发往阿富汗只比发往塔什干贵 20%。', '货物一周内到达海拉顿。', '卡车第三天抵达马扎里沙里夫。', '从中国到海拉顿大约一个月。', '发往阿富汗需要两到三周。', '发往阿富汗的整车运费三千美元起。',
      '发往阿富汗约 10–14 天', '到海拉顿 5–7 天', '送至马扎里沙里夫 1,200 美元起', '3 天到海拉顿', '发往阿富汗 2 周内送达', '海拉顿口岸 48 小时内放行',
      // calendar days (premerge review, 2026-11-13)
      '运往海拉顿需要 10 个日历日。', '货物十个自然日内运抵马扎里沙里夫。'],
    good: ['两个方向：中国至阿富汗，以及乌兹别克斯坦至阿富汗。', '目前交货地点只有这两个：海拉顿和马扎里沙里夫。',
      '中国到塔什干 15–25 天', '本网站上的运价、运费计算器和时效仅适用于中国 → 塔什干方向。', '价格和时效按需报价：由客户经理按您的货物核算。', '服务 11 — 阿富汗',
      '通过 WhatsApp（+998 00 000 00 00）或 Telegram 告诉我们：货物品名、体积或重量、货物目前在哪里、要送到哪里——海拉顿还是马扎里沙里夫。', '汽运拼货约 15–25 天。发往阿富汗的货物按需报价。',
      '更新日期：2026年11月12日 阿富汗货运', '周一至周六 9:00–19:00 周日休息 阿富汗货运', '根据2022年12月31日第737号决议办理发往阿富汗的过境手续', '本网站公布的 1 m³ 最低起运量，适用于从中国发往塔什干的拼货。',
      // printed by the guides (2026-11): every rule must let these through
      '随后卡车开往铁尔梅兹，过境进入海拉顿。根据《海关法典》第 218 条，在海关监管下经公路运输的货物须在 10 个日历日内运抵。', '马扎里沙里夫距海拉顿约 80 公里。'] },
  { id: 'fa.afghanFigure', block: true, msg: FIGURE_MSG('fa'),
    re: new RegExp(beside(AFGHAN[5], either(FA_FIGURE, FA_WORDFIG), `${FA_STOP}؛;`), 'iu'),
    bad: ['بار دوازده روزه به حیرتان می‌رسد.', 'حمل به افغانستان فقط ۲۰٪ گران‌تر از تاشکند است.', 'بار ظرف یک هفته به حیرتان می‌رسد.', 'کامیون روز سوم به مزار شریف می‌رسد.', 'از چین تا حیرتان حدود یک ماه.', 'حمل به افغانستان دو تا سه هفته طول می‌کشد.', 'کرایهٔ کامیون به افغانستان از سه هزار دلار شروع می‌شود.',
      'حمل بار به افغانستان در ۱۰ تا ۱۴ روز', 'تا حیرتان ۵ تا ۷ روز', 'تا مزار شریف از ۱٬۲۰۰ دلار', '۳ روز تا حیرتان', 'به افغانستان در ۲ هفته', 'تحویل ۱۰ روزه تا حیرتان',
      // calendar days: «روز تقویمی» — the day first, so it was always read; kept so that it stays so (premerge review, 2026-11-13)
      'رسیدن بار به حیرتان ۱۰ روز تقویمی طول می‌کشد.'],
    good: ['بار تجمیعی از چین تا تاشکند ۱۵ تا ۲۵ روز در راه است؛ زمان حمل به افغانستان را کارشناس ما محاسبه می‌کند.', 'در دو مسیر: از چین به افغانستان و از ازبکستان به افغانستان.',
      'از چین تا تاشکند ۱۵ تا ۲۵ روز', 'تعرفه‌ها، ماشین‌حساب و زمان‌های حمل در این سایت فقط مربوط به مسیر چین ← تاشکند است.', 'قیمت و زمان با استعلام اعلام می‌شود: کارشناس ما آن‌ها را برای بار شما محاسبه می‌کند.', 'خدمت ۱۱ — افغانستان',
      'در WhatsApp (+998 00 000 00 00) یا Telegram بنویسید: بار چیست، حجم یا وزن آن چقدر است، اکنون کجاست و باید به کجا برود — حیرتان یا مزار شریف.', 'بار تجمیعی ۱۵ تا ۲۵ روز. حمل بار به افغانستان با استعلام است.', 'حداقل ۱ متر مکعب که در این سایت آمده، مربوط به بار تجمیعی از چین به تاشکند است.',
      // printed by the guides (2026-11): every rule must let these through
      'سپس کامیون به ترمذ می‌رود و از مرز به حیرتان می‌گذرد. طبق مادهٔ ۲۱۸ قانون گمرک، کالایی که تحت نظارت گمرک با حمل‌ونقل جاده‌ای برده می‌شود باید ظرف ۱۰ روز تقویمی تحویل شود.', 'مزار شریف حدود ۸۰ کیلومتر با حیرتان فاصله دارد.'] },

  /* — the Afghanistan direction: by truck only (block rules too) — */
  { id: 'uz.afghanMode', block: true, msg: MODE_MSG('uz'),
    re: new RegExp(`${UZ_MODE}|${UZC_MODE}`, 'iu'),
    bad: ['Afgʻoniston yoʻnalishida yuk Termizgacha temir yoʻlda, soʻng fura bilan boradi.', 'Afgʻonistonga yukni Karachi porti orqali kemada ham joʻnatamiz.', 'Afgʻonistonga havo orqali ham yuk yetkazamiz.', 'Mozori Sharifga multimodal tashuv: dengiz va fura.', 'Shoshilinch yuklar Mozori Sharif aeroportiga charter reysi bilan boradi.', 'Afgʻonistonga dengiz orqali ham yuk joʻnatamiz.',
      'Afgʻonistonga temir yoʻl orqali ham yuk tashiymiz', 'Hayratonga vagonda yetkazamiz', 'Afgʻonistonga avia yuk', 'Temir yoʻlda Afgʻonistonga yuk tashish', 'Mozori Sharifgacha samolyot bilan', 'Afgʻonistonga fura, temir yoʻl va avia orqali yuk tashiymiz', 'Afgʻonistonga temiryoʻl orqali yuk tashiymiz', 'Hayratonga konteyner poyezdi', 'Afgʻonistonga uchoqda yetkazamiz',
      'Афғонистонга темир йўл орқали ҳам юк ташиймиз', 'Ҳайратонга вагонда етказамиз', 'Афғонистонга авиа юк', 'Афғонистонга темирйўл орқали юк ташиймиз'],
    good: ['Ikkala holda ham yuk faqat fura bilan tashiladi.', 'Afgʻonistonga ham fura bilan yuk tashiymiz', 'Afgʻonistonga temir yoʻl yoki avia orqali yuk tashimaymiz', 'Afgʻonistonga faqat fura bilan; temir yoʻl va avia yoʻq',
      'Afgʻonistonga faqat fura bilan tashiymiz: temir yoʻl va avia bu yoʻnalishda yoʻq', 'Afgʻonistonga temir yoʻl orqali ham tashiysizmi?', 'Avia, temir yoʻl va fura — Xitoydan Toshkentga; Afgʻonistonga — fura bilan',
      'Xitoydan Oʻzbekistonga avia va temir yoʻl, Afgʻonistonga esa fura bilan yuk tashiymiz', 'Afgʻonistonga konditsioner va mebel ham tashiymiz', 'Afgʻonistonga temiryoʻl orqali tashimaymiz',
      'Афғонистонга ҳам фура билан юк ташиймиз', 'Афғонистонга темир йўл ёки авиа орқали юк ташимаймиз',
      // printed by the guides (2026-11): every rule must let these through
      'Xitoydan Hayratonga konteyner poyezdlari ham qatnaydi, lekin biz ularda tashimaymiz: faqat fura bilan.', 'Хитойдан Ҳайратонга контейнер поездлари ҳам қатнайди, лекин биз уларда ташимаймиз: фақат фура билан.'] },
  { id: 'ru.afghanMode', block: true, msg: MODE_MSG('ru'),
    re: new RegExp(RU_MODE, 'iu'),
    bad: ['Груз в афганском направлении до Термеза идёт по железной дороге, затем перегружается на фуру.', 'В Афганистан доставим и по воздуху.', 'Срочные грузы в Мазари-Шариф отправляем чартерным бортом.', 'В Афганистан — мультимодально: морем и автотранспортом.', 'До Хайратона груз идёт по рельсам, дальше — фурой.', 'В Афганистан отправляем и морем через порт Карачи.',
      'В Афганистан возим и по железной дороге', 'Вагонами до Хайратона', 'Авиадоставка в Афганистан', 'ж/д перевозки в Мазари-Шариф', 'в Афганистан самолётом', 'в Афганистан фурой, по железной дороге и авиа', 'Железнодорожные перевозки в Афганистан', 'Доставка в Афганистан железнодорожным транспортом', 'контейнерные поезда до Хайратона',
      'Авиаперевозки в Афганистан', 'воздушным транспортом в Мазари-Шариф'],
    good: ['В обоих случаях груз едет только фурой.', 'теперь возим грузы фурами и в Афганистан', 'В Афганистан не возим по железной дороге и авиа', 'В Афганистан — только фурой; железной дороги и авиа нет',
      'В Афганистан — только фурой; ж/д и авиа — для Китая', 'Возите ли вы в Афганистан по железной дороге?', 'Авиа, ж/д и фура — из Китая в Ташкент; в Афганистан — фурой', 'Из Китая в Узбекистан авиа и ж/д, а в Афганистан возим фурой',
      'Железнодорожных и авиаперевозок в Афганистан нет', 'За одну поездку в Афганистан фура везёт до 22 тонн', 'Фура делает поездку до Мазари-Шарифа', 'Воздушные фильтры и вагонку везём в Афганистан фурой',
      // printed by the guides (2026-11): every rule must let these through
      'Контейнерные поезда из Китая в Хайратон ходят, но мы ими не возим: только фурой.'] },
  { id: 'en.afghanMode', block: true, msg: MODE_MSG('en'),
    re: new RegExp(EN_MODE, 'iu'),
    bad: ['Cargo for the Afghanistan direction travels to Termez by rail and is then reloaded onto a truck.', 'Urgent parcels go to Mazar-i-Sharif by express courier, by plane.', 'For Afghanistan we also offer sea freight via Karachi.', 'Multimodal delivery to Afghanistan: ocean and truck.', 'Charter flights to the Mazar-i-Sharif airport.',
      'We also carry cargo to Afghanistan by rail', 'Rail freight to Hairatan', 'Air cargo to Afghanistan', 'wagons to Hairatan', 'to Mazar-i-Sharif by air', 'Afghanistan: rail and air on request', 'to Afghanistan by truck, rail or air', 'railcars to Hairatan', 'Container trains to Hairatan', 'Cargo is flown to Mazar-i-Sharif', 'aircraft charter to Afghanistan'],
    good: ['In both cases the cargo travels by truck only.', 'We now also carry cargo to Afghanistan by truck', 'We do not carry cargo to Afghanistan by rail or by air', 'Cargo to Afghanistan goes by truck only; there is no rail or air service',
      'We carry cargo to Afghanistan by truck — rail and air are not offered on this direction', 'Unlike air or rail, cargo to Afghanistan goes by truck', 'Do you carry cargo to Afghanistan by rail?',
      'Air, rail and truck from China to Tashkent; truck cargo to Afghanistan', 'air cargo and rail containers from China to Uzbekistan, and now truck cargo to Afghanistan',
      'Cargo to Afghanistan: air conditioners, tiles, furniture', 'air compressors for Afghanistan', 'We train our drivers for the Afghanistan route',
      // printed by the guides (2026-11): every rule must let these through
      'Container trains from China also run to Hairatan, but we do not carry cargo by rail on this direction: our service is by truck only.'] },
  { id: 'zh.afghanMode', block: true, msg: MODE_MSG('zh'),
    re: new RegExp(ZH_MODE, 'iu'),
    bad: ['阿富汗方向可提供经卡拉奇的海运。', '多式联运至阿富汗：海运加汽运。', '发往阿富汗的急件可走包机。',
      '铁路运往阿富汗', '发往阿富汗的空运货物', '经铁路至海拉顿', '阿富汗空运', '班列直达马扎里沙里夫', '货运列车直达海拉顿', '专列发往阿富汗', '发往阿富汗的铁运货物', '航班直飞马扎里沙里夫'],
    good: ['两个方向的货物都只走汽运。', '现在也承接发往阿富汗的汽运货物', '发往阿富汗的货物不走铁路和空运', '发往阿富汗只走汽运，没有铁路和空运', '阿富汗方向只走汽运，铁路和空运仅用于中国至塔什干', '发往阿富汗可以走铁路吗？',
      '中国到塔什干有空运、铁路和汽运；发往阿富汗走汽运', '发往阿富汗的空调和家具', '钢铁运输到阿富汗走汽运', '发往阿富汗不走列车',
      // printed by the guides (2026-11): every rule must let these through
      '从中国也有集装箱班列开往海拉顿，但这个方向我们不承运铁路货物：只走汽运。'] },
  { id: 'fa.afghanMode', block: true, msg: MODE_MSG('fa'),
    re: new RegExp(FA_MODE, 'iu'),
    bad: ['حمل چندوجهی به افغانستان: دریا و کامیون.', 'برای افغانستان حمل دریایی از راه کراچی هم داریم.', 'حمل چندوجهی به افغانستان از راه دریا.', 'بارهای فوری با پرواز چارتر به مزار شریف می‌رسد.', 'بار را با کشتی تا کراچی و از آنجا به افغانستان می‌فرستیم.',
      'حمل ریلی به افغانستان', 'با قطار تا حیرتان', 'حمل هوایی به افغانستان', 'به مزار شریف با هواپیما', 'واگن به حیرتان', 'از طریق خط آهن تا حیرتان', 'با ریل تا حیرتان', 'با طیاره به مزار شریف'],
    good: ['در هر دو مسیر بار فقط با کامیون حمل می‌شود.', 'اکنون با کامیون به افغانستان هم بار می‌بریم', 'به افغانستان حمل ریلی و هوایی نداریم', 'به افغانستان فقط با کامیون؛ حمل ریلی و هوایی نداریم', 'آیا به افغانستان حمل ریلی هم دارید؟',
      'حمل هوایی، ریلی و زمینی از چین به تاشکند؛ به افغانستان با کامیون', 'با تریلی تا حیرتان می‌رسانیم', 'بار را با تریلی به افغانستان می‌بریم', 'شرایط آب و هوایی افغانستان', 'به افغانستان از طریق خط آهن بار نمی‌بریم',
      // printed by the guides (2026-11): every rule must let these through
      'قطارهای کانتینری از چین تا حیرتان هم می‌آیند، اما ما با قطار بار نمی‌بریم: فقط با کامیون.'] },

  /* — the Afghanistan direction: no volume figure (the 1 m³ minimum is China → Tashkent's) — */
  { id: 'uz.afghanVolume', block: true, msg: VOLUME_MSG('uz'),
    re: new RegExp(`${beside(AFGHAN[0], UZ_CBM, '.!?;')}|${beside(AFGHAN[1], UZC_CBM, '.!?;')}`, 'iu'),
    bad: ['Afgʻonistonga yigʻma yuk 1 m³ dan qabul qilinadi', 'Afgʻonistonga minimal hajm 1 m³', 'Hayratongacha kamida 5 kub yuk olamiz', 'Mozori Sharifga 10 m3 dan', '2 kubdan boshlab Afgʻonistonga',
      'Афғонистонга йиғма юк 1 м³ дан қабул қилинади', 'Ҳайратонгача камида 5 куб'],
    good: ['Saytdagi 1 m³ minimum Xitoydan Toshkentga keladigan yigʻma yukka tegishli.', 'Eng kichik partiya hajmi menejer bilan kelishiladi — bu sahifada son koʻrsatilmagan.', 'Yigʻma yuk 1 m³ dan. Afgʻonistonga yuk — soʻrov boʻyicha.',
      'Xitoydan Toshkentga yigʻma yuk kamida 1 m³ dan qabul qilinadi', 'Сайтдаги 1 м³ минимум Хитойдан Тошкентга келадиган йиғма юкка тегишли.'] },
  { id: 'ru.afghanVolume', block: true, msg: VOLUME_MSG('ru'),
    re: new RegExp(beside(AFGHAN[2], RU_CBM, '.!?;'), 'iu'),
    bad: ['В Афганистан сборный груз от 1 м³', 'Минимальный объём в Афганистан — 1 м³', 'до Хайратона от 5 кубов', 'В Мазари-Шариф принимаем от 2 куб. м', 'в Афганистан от 3 кубометров'],
    good: ['Минимум 1 м³, указанный на сайте, относится к сборному грузу из Китая в Ташкент.', 'Минимальный размер партии согласуется с менеджером — на этой странице цифры нет.', 'Сборный груз — от 1 м³. Грузы в Афганистан — по запросу.',
      'Сборный груз из Китая в Ташкент принимаем от 1 м³'] },
  { id: 'en.afghanVolume', block: true, msg: VOLUME_MSG('en'),
    re: new RegExp(beside(AFGHAN[3], EN_CBM, '.!?;'), 'iu'),
    bad: ['Consolidated cargo to Afghanistan from 1 m³', 'Minimum volume to Afghanistan: 1 m³', 'from 5 cbm to Hairatan', 'to Mazar-i-Sharif from 2 cubic metres', 'Afghanistan: lots from 3 m3'],
    good: ['The 1 m³ minimum published on this site applies to consolidated cargo from China to Tashkent.', 'The smallest lot is agreed with the manager — this page gives no figure.', 'Consolidated cargo is accepted from 1 m³. Cargo to Afghanistan is quoted on request.',
      'Consolidated truck cargo from China to Tashkent is accepted from 1 m³ per shipment'] },
  { id: 'zh.afghanVolume', block: true, msg: VOLUME_MSG('zh'),
    re: new RegExp(beside(AFGHAN[4], ZH_CBM, ZH_STOP), 'iu'),
    bad: ['发往阿富汗的拼货 1 m³ 起运', '阿富汗方向最低起运量 1 立方米', '到海拉顿 5 方起', '送至马扎里沙里夫 2 立方起'],
    good: ['本网站公布的 1 m³ 最低起运量，适用于从中国发往塔什干的拼货。', '最小起运量由客户经理与您商定——本页不列具体数字。', '拼货 1 m³ 起运。发往阿富汗的货物按需报价。', '中国到塔什干的拼货 1 m³ 起运'] },
  { id: 'fa.afghanVolume', block: true, msg: VOLUME_MSG('fa'),
    re: new RegExp(beside(AFGHAN[5], FA_CBM, `${FA_STOP}؛;`), 'iu'),
    bad: ['بار تجمیعی به افغانستان از ۱ متر مکعب', 'حداقل حجم برای افغانستان ۱ متر مکعب است', 'تا حیرتان از ۵ متر مکعب', 'به مزار شریف از ۲ مترمکعب'],
    good: ['حداقل ۱ متر مکعب که در این سایت آمده، مربوط به بار تجمیعی از چین به تاشکند است.', 'حداقل حجم محموله با کارشناس ما توافق می‌شود — در این صفحه رقمی نیامده است.', 'بار تجمیعی از ۱ متر مکعب. حمل بار به افغانستان با استعلام است.',
      'بار تجمیعی از چین به تاشکند از ۱ متر مکعب پذیرفته می‌شود'] },

  /* — the Afghanistan direction: no office, branch or representative there — */
  { id: 'uz.afghanPresence', block: true, msg: PRESENCE_MSG('uz'),
    re: new RegExp(`${UZ_PRESENCE}|${UZC_PRESENCE}`, 'iu'),
    bad: ['Hayratondagi odamimiz yukni qabul qiluvchiga topshiradi.', 'Afgʻonistondagi hamkorlarimiz yukni Mozori Sharifda qabul qilib oladi.', 'Hayratonda oʻz xodimimiz yukni kutib oladi.', 'Mozori Sharifda yukni topshirish punktimiz ishlaydi.', 'Afgʻonistonda agentimiz bor.', 'Mozori Sharifdagi terminalimizdan yukni olib ketasiz.', 'Афғонистонда агентимиз бор.',
      'Mozori Sharifda ofisimiz bor', 'Afgʻonistonda vakilimiz ishlaydi', 'Hayratondagi filialimiz yukni qabul qiladi', 'Ofisimiz Mozori Sharifda joylashgan',
      'Афғонистонда офисимиз бор', 'Мозори Шарифдаги вакилимиз',
      // partners on the Afghan side (owner, 2026-11-12) are customs agents only: not with the cargo in their hands, not
      // without the agent word, never beside an office
      'Afgʻonistondagi hamkorlarimiz — bojxona agentlari — yukni Mozori Sharifda topshiradi.', 'Hayratondagi hamkor agentlarimiz yukni saqlaydi.', 'Afgʻonistonda ofisimiz ham, hamkorlarimiz — bojxona agentlari ham bor.',
      'Afgʻoniston tomonida hamkorlarimiz — deklarant agentlar — yukni qabul qilib, bojxonadan oʻtkazadi.', 'Afgʻonistonda hamkorlarimiz bor, ular yukni Hayratonda qabul qilib oladi.',
      'Афғонистондаги ҳамкорларимиз — божхона агентлари — юкни Мозори Шарифда топширади.', 'Ҳайратондаги ҳамкор агентларимиз юкни сақлайди.', 'Афғонистонда офисимиз ҳам, ҳамкорларимиз — божхона агентлари ҳам бор.',
      'Афғонистон томонида ҳамкорларимиз — декларант агентлар — юкни қабул қилиб, божхонадан ўтказади.', 'Афғонистонда ҳамкорларимиз бор, улар юкни Ҳайратонда қабул қилиб олади.',
      'Afgʻonistonda hamkorlarimiz — deklarant agentlar — siz uchun hammasini bajaradi.', 'Afgʻonistondagi hamkorlarimiz — deklarant agentlar — yukni Mozori Sharifgacha tashiydi.',
      'Афғонистонда ҳамкорларимиз — декларант агентлар — сиз учун ҳаммасини бажаради.', 'Афғонистондаги ҳамкорларимиз — декларант агентлар — юкни Мозори Шарифгача ташийди.',
      // guard-verify H4 (2026-11-13): the partner customs agents handle the cargo (hand over, send, keep, collect, store …)
      'Hamkorlarimiz — deklarant agentlar — Afgʻoniston tomonida bojxonani rasmiylashtiradi va Mozori Sharifda yukni sizga beradi.',
      'Afgʻonistonda hamkorlarimiz — deklarant agentlar — yukni Mozori Sharifga yuboradi.', 'Hamkorlarimiz — deklarant agentlar — yukingizni Hayratonda sizga uzatadi.',
      'Ҳамкорларимиз — декларант агентлар — Афғонистон томонида божхонани расмийлаштиради ва Мозори Шарифда юкни сизга беради.',
      'Афғонистонда ҳамкорларимиз — декларант агентлар — юкни Мозори Шарифга юборади.', 'Ҳамкорларимиз — декларант агентлар — юкингизни Ҳайратонда сизга узатади.',
      'Афғонистонда партнерларимиз — декларант агентлар — юкни Мозори Шарифга юборади.',
      // guard-verify H5 (2026-11-13): a negation word used as a quantifier ("no extra …", «вам не нужно …», 您无需…) is not a denial
      'Hamkorlarimiz — deklarant agentlar — Hayratonda yukni qabul qiladi, siz chegaraga bormaysiz.',
      'Ҳамкорларимиз — декларант агентлар — Ҳайратонда юкни қабул қилади, сиз чегарага бормайсиз.',
      // guard-verify H6 (2026-11-13): an office, a representative or own declarants beside the partners, or "on the Afghan side"
      'Mozori Sharifda hamkorlarimiz — deklarant agentlar bilan umumiy ofisimiz bor.', 'Afgʻonistonda oʻz deklarantlarimiz bor.',
      'Afgʻoniston tomonida vakilimiz hamkorlarimiz — deklarant agentlar bilan ishlaydi.', 'Afgʻoniston tomonida vakilimiz bor.', 'Afgʻoniston tomonida ofisimiz bor.',
      'Мозори Шарифда ҳамкорларимиз — декларант агентлар билан умумий офисимиз бор.', 'Афғонистонда ўз декларантларимиз бор.',
      'Афғонистон томонида вакилимиз ҳамкорларимиз — декларант агентлар билан ишлайди.', 'Ҳайратонда ҳамкорларимиз — декларант агентлар билан бирга ишлайдиган вакилимиз бор.',
      'Афғонистон томонида вакилимиз бор.', 'Афғонистон томонида офисимиз бор.',
      // guard-verify H17 (2026-11-13): the partners carry the cargo on, hand it over or reload it
      'Hamkorlarimiz — deklarant agentlar — Hayratonda yukni boshqa furaga ortadi.', 'Ҳамкорларимиз — декларант агентлар — Ҳайратонда юкни бошқа фурага ортади.',
      // guard-verify H18 (2026-11-13): "our team" in Afghanistan
      'Afgʻonistondagi jamoamiz hamkorlarimiz — deklarant agentlar bilan ishlaydi.', 'Афғонистондаги жамоамиз ҳамкорларимиз — декларант агентлар билан ишлайди.',
      // guard hardening (2026-11-13): a have form with a place or people in Afghanistan — the possessive («omborimiz bor»), «bizda / bizning …»; a denial passes; the same site placed in Tashkent etc. is two facts (passes) unless the list goes on to an Afghan place
      'Mozori Sharifda omborimiz bor.', 'Hayratonda omborxonamiz ishlaydi.', 'Afgʻonistonda jamoamiz bor.', 'Мозори Шарифда омборимиз бор.', 'Ҳайратонда омборхонамиз ишлайди.', 'Афғонистонда жамоамиз бор.', 'Bizda Hayratonda ombor bor.', 'Бизда Ҳайратонда омбор бор.', 'Mozori Sharifda bizda xodimlar bor.', 'Мозори Шарифда бизда ходимлар бор.', 'Bizda xodimlar Toshkentda va Hayratonda bor.', 'Бизда ходимлар Тошкентда ва Ҳайратонда бор.', 'Ombor Hayratonda bizda bor.', 'Омбор Ҳайратонда бизда бор.', 'Hayratonda ombor bizda bor.', 'Ҳайратонда омбор бизда бор.'],
    good: ['Afgʻonistonda ofisimiz yoki vakilimiz yoʻq.', 'Hayraton — Afgʻoniston tomonidagi chegara shaharchasi: yukni shu yerda oʻzingiz qabul qilib olasiz', 'Afgʻonistonda ofisimiz yoʻq', 'Ofisimiz Toshkentda; Afgʻonistonga fura bilan yuk tashiymiz', 'Afgʻonistonda ofisingiz bormi?', 'Ofis faqat Toshkentda', 'Афғонистонда офисимиз йўқ',
      // the partner customs agents named as such (owner, 2026-11-12; DESIGN-GUIDES row 82): every rule must let these through
      'Afgʻoniston tomonida bojxona rasmiylashtiruvini hamkorlarimiz — deklarant agentlar bajaradi.', 'Afgʻonistondagi hamkorlarimiz — deklarant agentlar — yukni u yerda bojxonadan oʻtkazadi.', 'Termiz–Hayraton: yuk Oʻzbekistondan chiqadi va bojxona tranziti tugaydi; Afgʻoniston tomonida bojxonani hamkorlarimiz — deklarant agentlar rasmiylashtiradi.',
      'Афғонистон томонида божхона расмийлаштирувини ҳамкорларимиз — декларант агентлар бажаради.', 'Афғонистондаги ҳамкорларимиз — декларант агентлар — юкни у ерда божхонадан ўтказади.', 'Термиз–Ҳайратон: юк Ўзбекистондан чиқади ва божхона транзити тугайди; Афғонистон томонида божхонани ҳамкорларимиз — декларант агентлар расмийлаштиради.',
      // guard hardening (2026-11-13): a have form with a place or people in Afghanistan — the possessive («omborimiz bor»), «bizda / bizning …»; a denial passes; the same site placed in Tashkent etc. is two facts (passes) unless the list goes on to an Afghan place
      'Afgʻonistonda omborimiz yoʻq.', 'Hayraton va Mozori Sharifda xodimlarimiz yoʻq.', 'Bizda Afgʻonistonda ombor yoʻq.', 'Афғонистонда омборимиз йўқ.', 'Ҳайратон ва Мозори Шарифда ходимларимиз йўқ.', 'Бизда Афғонистонда омбор йўқ.', 'Bizning menejerimiz Afgʻoniston tomonida qaysi tartib va hujjatlar qoʻllanishini tushuntiradi.', 'Бизнинг менежеримиз Афғонистон томонида қайси тартиб ва ҳужжатлар қўлланишини тушунтиради.', 'Bizda Toshkentda jamoa bor, Hayratonda esa yukni oʻzingiz qabul qilib olasiz.', 'Бизда Тошкентда жамоа бор, Ҳайратонда эса юкни ўзингиз қабул қилиб оласиз.', 'Ombor Hayratonda bizda yoʻq.', 'Омбор Ҳайратонда бизда йўқ.'] },
  { id: 'ru.afghanPresence', block: true, msg: PRESENCE_MSG('ru'),
    re: new RegExp(RU_PRESENCE, 'iu'),
    bad: ['Наш человек в Хайратоне передаст груз получателю.', 'Наши партнёры в Афганистане принимают груз в Мазари-Шарифе.', 'В Хайратоне груз встречает наш сотрудник.', 'У нас есть агент в Афганистане.', 'Пункт выдачи в Мазари-Шарифе открыт для клиентов.', 'Груз выдаём с нашего терминала в Мазари-Шарифе.',
      'Наш офис в Мазари-Шарифе', 'В Афганистане работает наш представитель', 'филиал в Хайратоне принимает грузы', 'В Афганистане у нас есть представительство',
      // partners on the Afghan side (owner, 2026-11-12) are customs agents only: not with the cargo in their hands, not
      // without the agent word, never beside an office
      'Наши партнёры в Афганистане — таможенные агенты — передают груз в Мазари-Шарифе.', 'Наши партнёры-агенты в Хайратоне хранят груз.', 'У нас есть офис в Афганистане и партнёры там — таможенные агенты.',
      'На афганской стороне наши партнёры — таможенные агенты (декларанты) — принимают груз и оформляют его на таможне.', 'В Афганистане у нас есть партнёры, которые принимают груз в Хайратоне.',
      'В Афганистане наши партнёры — таможенные агенты (декларанты) — берут на себя всё остальное.', 'Наши партнёры в Афганистане — таможенные агенты (декларанты) — перевозят груз в Мазари-Шариф.',
      // guard-verify H4 (2026-11-13): the partner customs agents handle the cargo (hand over, send, keep, collect, store …)
      'Наши партнёры — таможенные агенты (декларанты) — проводят таможенное оформление на афганской стороне и отдают вам груз в Мазари-Шарифе.',
      'Наши партнёры — таможенные агенты (декларанты) — оформляют груз в Хайратоне и отправляют его дальше в Мазари-Шариф.',
      'Наши партнёры — таможенные агенты (декларанты) — довезут груз до Мазари-Шарифа.',
      'В Мазари-Шарифе наши партнёры — таможенные агенты (декларанты) — вручают вам груз после оформления.',
      'Наши партнёры — таможенные агенты (декларанты) — получают ваши товары в Хайратоне.',
      'На афганской стороне наши партнеры — таможенные агенты (декларанты) — сделают все за вас.',
      // guard-verify H5 (2026-11-13): a negation word used as a quantifier ("no extra …", «вам не нужно …», 您无需…) is not a denial
      'На афганской стороне наши партнёры — таможенные агенты (декларанты) — принимают груз в Хайратоне, и вам не нужно ехать на границу.',
      // guard-verify H6 (2026-11-13): an office, a representative or own declarants beside the partners, or "on the Afghan side"
      'Наши партнёры — таможенные агенты (декларанты) — и наш представитель работают на афганской стороне.', 'У нас есть свои декларанты в Афганистане.',
      'На афганской стороне у нас есть представитель.', 'Наш сотрудник на афганской стороне встречает фуру.',
      'В Хайратоне наши партнёры — таможенные агенты (декларанты) — располагают собственным терминалом.',
      // guard-verify H17 (2026-11-13): the partners carry the cargo on, hand it over or reload it
      'Наши партнёры — таможенные агенты (декларанты) — в Хайратоне организуют дальнейшую перевозку до Мазари-Шарифа.',
      // guard-verify H18 (2026-11-13): "our team" in Afghanistan
      'Наша команда в Афганистане работает с партнёрами — таможенными агентами (декларантами).',
      // guard hardening (2026-11-13): «у нас (есть / имеется / работает …)», «имеем …», «склад у нас …», «наш склад» with a place or people in Afghanistan; a denial passes, a partner is not a place; the same site placed in Tashkent etc. is two facts (passes) unless the list goes on to an Afghan place
      'В Мазари-Шарифе у нас есть склад.', 'В Афганистане у нас есть сотрудник.', 'У нас в Хайратоне работает команда.', 'В Афганистане у нас имеется офис.', 'Мы имеем в Хайратоне склад.', 'Склад у нас есть в Хайратоне.', 'В Хайратоне располагается наш склад.', 'У нас есть сотрудники в Ташкенте и в Хайратоне.', 'Склад в Хайратоне у нас есть.'],
    good: ['Офиса и представителя в Афганистане у нас нет.','Хайратон — приграничный город на афганской стороне: здесь вы принимаете груз сами.', 'Офиса в Афганистане у нас нет', 'Офис — в Ташкенте; в Афганистан возим фурой', 'Есть ли у вас офис в Афганистане?', 'Представителя в Афганистане нет',
      // the partner customs agents named as such (owner, 2026-11-12; DESIGN-GUIDES row 82): every rule must let these through
      'На афганской стороне таможенное оформление проводят наши партнёры — таможенные агенты (декларанты).', 'Наши партнёры в Афганистане — таможенные агенты (декларанты) — проводят там таможенное оформление груза.',
      'Термез — Хайратон: груз выходит из Узбекистана, и таможенный транзит завершается; на афганской стороне таможенное оформление проводят наши партнёры — таможенные агенты (декларанты).',
      // guard hardening (2026-11-13): «у нас (есть / имеется / работает …)», «имеем …», «склад у нас …», «наш склад» with a place or people in Afghanistan; a denial passes, a partner is not a place; the same site placed in Tashkent etc. is two facts (passes) unless the list goes on to an Afghan place
      'В Афганистане у нас нет ни офиса, ни склада, ни сотрудников.', 'Склада и сотрудников в Хайратоне и Мазари-Шарифе у нас нет.', 'Своего склада у нас нет — ни в Хайратоне, ни в Мазари-Шарифе.', 'На афганской стороне у нас есть партнёры — таможенные агенты (декларанты).', 'У нас в Ташкенте работает команда, а в Хайратоне груз вы забираете сами.', 'Менеджер у нас объясняет, какие процедуры и документы нужны на афганской стороне.', 'У нас есть команда в Ташкенте, а в Хайратоне груз вы забираете сами.', 'Склада в Хайратоне у нас нет.'] },
  { id: 'en.afghanPresence', block: true, msg: PRESENCE_MSG('en'),
    re: new RegExp(EN_PRESENCE, 'iu'),
    bad: ['Our man in Hairatan hands the cargo over to the consignee.', 'Our partners in Afghanistan receive the cargo in Mazar-i-Sharif.', 'Our employee meets the cargo in Hairatan.', 'We have an agent in Afghanistan.', 'Our warehouse in Mazar-i-Sharif hands the cargo over.', 'Our Afghan office helps with paperwork.', 'Collect your cargo from our terminal in Mazar-i-Sharif.',
      'Our office in Mazar-i-Sharif', 'We have a representative in Afghanistan', 'our branch at Hairatan receives the cargo', 'In Afghanistan our office helps with customs',
      // partners on the Afghan side (owner, 2026-11-12) are customs agents only: not with the cargo in their hands, not
      // without the agent word, never beside an office
      'Our partners in Afghanistan — customs agents — hand the cargo over in Mazar-i-Sharif.', 'Our partner agents in Hairatan store the cargo.', 'We have an office in Afghanistan and partners there — customs agents.',
      'On the Afghan side, our partners — customs agents (declarants) — receive the cargo and clear it through customs.', 'We have partners in Afghanistan who take the cargo over at Hairatan.',
      'In Afghanistan, our partners — customs agents (declarants) — handle everything for you.', 'Our partners in Afghanistan — customs agents (declarants) — transport the cargo to Mazar-i-Sharif.',
      // guard-verify H4 (2026-11-13): the partner customs agents handle the cargo (hand over, send, keep, collect, store …)
      'Our partners — customs agents (declarants) — clear customs on the Afghan side and hand the cargo to you in Mazar-i-Sharif.',
      'Our partners — customs agents (declarants) — clear customs in Hairatan and send the cargo on to Mazar-i-Sharif.',
      'Our partners — customs agents (declarants) — keep the cargo at their yard in Hairatan until it is cleared.',
      'In Mazar-i-Sharif our partners — customs agents (declarants) — give you the cargo after clearance.',
      'At Hairatan, our partners — customs agents (declarants) — take care of the cargo for you.',
      // guard-verify H5 (2026-11-13): a negation word used as a quantifier ("no extra …", «вам не нужно …», 您无需…) is not a denial
      'On the Afghan side, our partners — customs agents (declarants) — receive the cargo at Hairatan with no extra paperwork.',
      'Our partners in Afghanistan store the cargo at no extra cost.', 'Our partners — customs agents (declarants) — meet your truck in Hairatan, so you do not have to.',
      // guard-verify H6 (2026-11-13): an office, a representative or own declarants beside the partners, or "on the Afghan side"
      'In Hairatan you will find our partners — customs agents (declarants) — and our local office.',
      'On the Afghan side we have a representative who works with our partners — customs agents (declarants).', 'Our representative on the Afghan side meets the truck.',
      'On the Afghan side we have our own office.',
      // guard-verify H15 (2026-11-13): the partners' terminal, depot or yard
      'Our partners — customs agents (declarants) — run a terminal in Hairatan.', 'Our partners — customs agents (declarants) — have a depot in Mazar-i-Sharif.',
      'Your goods are cleared by our partners — customs agents (declarants) — and wait for you at their yard in Hairatan.',
      // guard-verify H17 (2026-11-13): the partners carry the cargo on, hand it over or reload it
      'Our partner customs agents (declarants) in Hairatan also arrange the onward truck to Mazar-i-Sharif.',
      'With our partners — customs agents (declarants) — the cargo is cleared in Hairatan and handed to you there.',
      // guard hardening (2026-11-13): "we have / we've got / own / run / operate …", "GSR has …", "… of ours" with a place or people in Afghanistan; a denial passes, a partner or a manager is not a place; the same site placed in Tashkent etc. is two facts (passes) unless the list goes on to an Afghan place
      'We have an employee in Afghanistan.', 'We have a terminal in Mazar-i-Sharif.', 'In Afghanistan we have staff who meet the truck.', 'There is a warehouse of ours in Hairatan.', 'We have people in Hairatan who hand over the cargo.', 'We\'ve got staff in Hairatan.', 'GSR has a warehouse in Mazar-i-Sharif.', 'We operate a terminal at Hairatan.', 'We have staff in Tashkent and in Hairatan.'],
    good: ['We have no office or representative in Afghanistan.', 'Hairatan — the border town on the Afghan side: you collect the cargo there yourself.', 'We have no office in Afghanistan', 'Our office is in Tashkent; cargo to Afghanistan goes by truck', 'Do you have an office in Afghanistan?', 'the customs office in Hairatan', 'We do not have a representative in Afghanistan',
      // the partner customs agents named as such (owner, 2026-11-12; DESIGN-GUIDES row 82): every rule must let these through
      'On the Afghan side, customs clearance is done by our partners — customs agents (declarants).', 'Our partners in Afghanistan — customs agents (declarants) — clear the cargo through customs there.',
      'Termez–Hairatan: the cargo leaves Uzbekistan and the transit regime ends; on the Afghan side our partners — customs agents (declarants) — clear customs.',
      // guard hardening (2026-11-13): "we have / we've got / own / run / operate …", "GSR has …", "… of ours" with a place or people in Afghanistan; a denial passes, a partner or a manager is not a place; the same site placed in Tashkent etc. is two facts (passes) unless the list goes on to an Afghan place
      'We have no office or employee in Afghanistan.', 'We have no warehouse, terminal or staff in Hairatan or Mazar-i-Sharif.', 'We do not have a warehouse in Afghanistan.', 'We have partners on the Afghan side — customs agents (declarants) — who clear customs there.', 'We have a manager who explains which procedure and which documents apply on the Afghan side for your cargo.', 'We have a team in Tashkent, and at Hairatan you collect the cargo yourself.'] },
  { id: 'zh.afghanPresence', block: true, msg: PRESENCE_MSG('zh'),
    re: new RegExp(ZH_PRESENCE, 'iu'),
    bad: ['我们在海拉顿的人员负责交接货物。', '我们在阿富汗的合作伙伴在马扎里沙里夫接货。', '我们的员工在海拉顿接货。', '我们在阿富汗有代理。', '马扎里沙里夫设有提货点。', '请到我们在马扎里沙里夫的站点提货。',
      '我们在阿富汗设有办事处', '马扎里沙里夫办事处', '在海拉顿设有分公司', '办事处设在马扎里沙里夫',
      // partners on the Afghan side (owner, 2026-11-12) are customs agents only: not with the cargo in their hands, not
      // without the agent word, never beside an office
      '我们在阿富汗的合作伙伴——报关代理——在马扎里沙里夫交货。', '我们在海拉顿的合作代理负责货物仓储。', '我们在阿富汗设有办事处，当地还有合作伙伴——报关代理。',
      '在阿富汗一侧，我们的合作伙伴——报关代理（申报人）——接货并办理清关。', '我们在阿富汗有合作伙伴，他们在海拉顿接货。',
      '在阿富汗，我们的合作伙伴——报关代理（申报人）——为您办理一切。', '我们在阿富汗的合作伙伴——报关代理（申报人）——将货物运至马扎里沙里夫。',
      // guard-verify H4 (2026-11-13): the partner customs agents handle the cargo (hand over, send, keep, collect, store …)
      '在阿富汗一侧，我们的合作伙伴——报关代理（申报人）——办理清关后在马扎里沙里夫将货物交给您。', '在海拉顿，我们的合作伙伴——报关代理（申报人）——负责转运。', '在阿富汗，我们的合作伙伴——报关代理（申报人）——为您领取货物。', '我们在马扎里沙里夫的合作伙伴——报关代理（申报人）——存储您的货物。',
      // guard-verify H5 (2026-11-13): a negation word used as a quantifier ("no extra …", «вам не нужно …», 您无需…) is not a denial
      '在海拉顿，我们的合作伙伴——报关代理（申报人）——接货，您无需亲自到边境。',
      // guard-verify H6 (2026-11-13): an office, a representative or own declarants beside the partners, or "on the Afghan side"
      '在马扎里沙里夫，我们与合作伙伴——报关代理（申报人）——共用办公室。', '我们在阿富汗有自己的申报人。', '我们在阿富汗有代表。', '我们在马扎里沙里夫有自己的团队。',
      // guard-verify H13 (2026-11-13): an own liaison set up in Afghanistan (MAY fix F13)
      '我们在阿富汗设有联络人，并与合作伙伴——报关代理（申报人）——合作。',
      // guard-verify H15 (2026-11-13): the partners' terminal, depot or yard
      '我们的合作伙伴——报关代理（申报人）——在海拉顿经营堆场。',
      // guard-verify H17 (2026-11-13): the partners carry the cargo on, hand it over or reload it
      '我们的合作伙伴——报关代理（申报人）——在海拉顿把货物装上当地卡车。',
      // guard hardening (2026-11-13): 我们 / 我司 + 有 / 设有 / 拥有 / 建有 … + a place or people in Afghanistan, 我们的仓库, and 在…，我们有…; a denial passes, 合作方的仓库 is not ours; the same site placed in Tashkent etc. is two facts (passes) unless the list goes on to an Afghan place
      '我们在马扎里沙里夫有仓库。', '我们在海拉顿设有堆场。', '在阿富汗我们有员工接车。', '在阿富汗，我们设有仓库。', '海拉顿有我们的仓库。', '我司在马扎里沙里夫建有货场。', '我们在塔什干和海拉顿都有仓库。', '在阿富汗，我们的员工负责接货。', '仓库我们在海拉顿也有。'],
    good: ['我们在阿富汗没有办事处或代表。', '海拉顿——阿富汗一侧的边境城镇：您在当地自行提货。', '我们在阿富汗没有办事处', '办事处设在塔什干，发往阿富汗的货物走汽运', '你们在阿富汗有办事处吗？', '公司在阿富汗未设代表处',
      // the partner customs agents named as such (owner, 2026-11-12; DESIGN-GUIDES row 82): every rule must let these through
      '在阿富汗一侧，清关由我们的合作伙伴——报关代理（申报人）——办理。', '我们在阿富汗的合作伙伴——报关代理（申报人）——在当地为货物办理清关。',
      '铁尔梅兹—海拉顿：货物离开乌兹别克斯坦，海关过境结束；在阿富汗一侧，由我们的合作伙伴——报关代理（申报人）——办理清关。',
      // guard hardening (2026-11-13): 我们 / 我司 + 有 / 设有 / 拥有 / 建有 … + a place or people in Afghanistan, 我们的仓库, and 在…，我们有…; a denial passes, 合作方的仓库 is not ours; the same site placed in Tashkent etc. is two facts (passes) unless the list goes on to an Afghan place
      '我们在阿富汗没有仓库或员工。', '我们在海拉顿和马扎里沙里夫没有办事处、仓库或堆场。', '在阿富汗，我们没有仓库，也没有员工。', '我们在塔什干有合作方的仓库，货物从那里发往海拉顿。', '我们在阿富汗有合作伙伴——报关代理（申报人）。', '我们在塔什干有团队，在海拉顿由您自行提货。', '在海拉顿，我们的客户自行提货。', '仓库我们在海拉顿没有。'] },
  { id: 'fa.afghanPresence', block: true, msg: PRESENCE_MSG('fa'),
    re: new RegExp(FA_PRESENCE, 'iu'),
    bad: ['نفر ما در حیرتان بار را به گیرنده تحویل می‌دهد.', 'همکاران ما در افغانستان بار را در مزار شریف تحویل می‌گیرند.', 'کارمند ما در حیرتان بار را تحویل می‌گیرد.', 'در افغانستان عامل داریم.', 'گدام ما در حیرتان بار را تحویل می‌دهد.', 'بار را از ترمینال ما در مزار شریف تحویل بگیرید.',
      'دفتر ما در مزار شریف', 'در افغانستان نماینده داریم', 'شعبهٔ ما در حیرتان بار را تحویل می‌گیرد', 'نمایندگی ما در افغانستان',
      // partners on the Afghan side (owner, 2026-11-12) are customs agents only: not with the cargo in their hands, not
      // without the agent word, never beside an office
      'شرکای ما در افغانستان — کارگزاران گمرکی — بار را در مزار شریف تحویل می‌دهند.', 'کارگزاران شریک ما در حیرتان بار را نگهداری می‌کنند.', 'در افغانستان دفتر داریم و شرکایی هم آنجا داریم — کارگزاران گمرکی.',
      'در سمت افغانستان، شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — بار را تحویل می‌گیرند و ترخیص می‌کنند.', 'در افغانستان شرکایی داریم که بار را در حیرتان تحویل می‌گیرند.',
      'در افغانستان، شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — همه‌چیز را برای شما انجام می‌دهند.', 'شرکای ما در افغانستان — کارگزاران گمرکی (اظهارکنندگان) — بار را با کامیون تا مزار شریف حمل می‌کنند.',
      // guard-verify H4 (2026-11-13): the partner customs agents handle the cargo (hand over, send, keep, collect, store …)
      'در سمت افغانستان، شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — بار را در حیرتان دریافت می‌کنند.', 'شرکای ما — کارگزاران گمرکی — بار را در مزار شریف به شما می‌سپارند.',
      'شرکای ما در افغانستان — کارگزاران گمرکی (اظهارکنندگان) — بار را به مزار شریف ارسال می‌کنند.', 'شرکای ما — کارگزاران گمرکی — کالای شما را در حیرتان نگه می‌دارند.',
      'شرکای ما در افغانستان — کارگزاران گمرکی — کالا را تا مزار شریف منتقل می‌کنند.',
      // guard-verify H5 (2026-11-13): a negation word used as a quantifier ("no extra …", «вам не нужно …», 您无需…) is not a denial
      'شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — بار را بدون معطلی در حیرتان تحویل می‌گیرند.',
      // guard-verify H6 (2026-11-13): an office, a representative or own declarants beside the partners, or "on the Afghan side"
      'در مزار شریف ما و شرکایمان — کارگزاران گمرکی (اظهارکنندگان) — در یک دفتر کار می‌کنیم.', 'در سمت افغانستان نمایندهٔ ما با شرکای ما — کارگزاران گمرکی — کار می‌کند.',
      'در سمت افغانستان نماینده داریم.', 'نمایندگان ما در افغانستان بار را تحویل می‌گیرند.', 'در سمت افغانستان دفتر خودمان را داریم.',
      // guard-verify H15 (2026-11-13): the partners' terminal, depot or yard
      'شرکای ما — کارگزاران گمرکی — در حیرتان ترمینال دارند.',
      // guard-verify H17 (2026-11-13): the partners carry the cargo on, hand it over or reload it
      'شرکای ما — کارگزاران گمرکی — بار را در حیرتان به کامیون دیگری بار می‌زنند.',
      // guard-verify H18 (2026-11-13): "our team" in Afghanistan
      'تیم ما در افغانستان با شرکای ما — کارگزاران گمرکی — کار می‌کند.',
      // guard hardening (2026-11-13): a place or people + «داریم / داشته‌ایم …» in Afghanistan, and «…مان» («کارمندانمان»); «نداریم» passes, a partner is not a place; the same site placed in Tashkent etc. is two facts (passes) unless the list goes on to an Afghan place
      'در مزار شریف انبار داریم.', 'در حیرتان کارمند داریم.', 'در افغانستان گدام داریم.', 'در حیرتان کارمندانمان بار را تحویل می‌گیرند.', 'انبار داریم در مزار شریف.', 'در مزار شریف ترمینال داشته‌ایم.', 'در حیرتان و در تاشکند انبار داریم.', 'کارمند در حیرتان داریم.', 'ما کارمندانی در افغانستان داریم.', 'کارمند در تاشکند و در حیرتان داریم.'],
    good: ['در افغانستان دفتر یا نماینده نداریم.', 'حیرتان — شهرک مرزی در سمت افغانستان: بار را همان‌جا خودتان تحویل می‌گیرید.', 'در افغانستان دفتر نداریم', 'دفتر ما در تاشکند است؛ به افغانستان با کامیون بار می‌بریم', 'آیا در افغانستان دفتر دارید؟', 'در افغانستان نماینده‌ای نداریم',
      // the partner customs agents named as such (owner, 2026-11-12; DESIGN-GUIDES row 82): every rule must let these through
      'در سمت افغانستان، ترخیص گمرکی را شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — انجام می‌دهند.', 'شرکای ما در افغانستان — کارگزاران گمرکی (اظهارکنندگان) — ترخیص گمرکی بار را در آنجا انجام می‌دهند.',
      'ترمذ–حیرتان: بار از ازبکستان خارج می‌شود و ترانزیت گمرکی پایان می‌یابد؛ در سمت افغانستان، ترخیص گمرکی را شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — انجام می‌دهند.',
      // guard hardening (2026-11-13): a place or people + «داریم / داشته‌ایم …» in Afghanistan, and «…مان» («کارمندانمان»); «نداریم» passes, a partner is not a place; the same site placed in Tashkent etc. is two facts (passes) unless the list goes on to an Afghan place
      'در افغانستان انبار یا کارمند نداریم.', 'در حیرتان و مزار شریف دفتر، گدام یا کارمند نداریم.', 'در سمت افغانستان شریک داریم: کارگزاران گمرکی (اظهارکنندگان).', 'ما در تاشکند تیم داریم و در حیرتان بار را خودتان تحویل می‌گیرید.', 'کارمند در حیرتان نداریم.', 'کارمند در تاشکند داریم و در حیرتان بار را خودتان تحویل می‌گیرید.'] },

  /* — the Afghanistan direction: no schedule and no "regular" departures — */
  { id: 'uz.afghanSchedule', block: true, msg: SCHEDULE_MSG('uz'),
    re: new RegExp(`${UZ_SCHEDULE}|${UZC_SCHEDULE}`, 'iu'),
    bad: ['Afgʻonistonga furalar doimiy ravishda qatnaydi.', 'Hayratonga har dushanba va payshanba kuni fura joʻnaydi.', 'Afgʻonistonga oyiga toʻrt marta fura joʻnatamiz.', 'Mozori Sharif yoʻnalishida reyslar jadvali belgilangan.',
      'Afgʻonistonga haftasiga ikki marta fura joʻnatamiz', 'Har hafta Hayratonga fura chiqadi', 'Afgʻonistonga muntazam reyslar', 'Mozori Sharifga haftalik fura',
      'Афғонистонга ҳафтасига икки марта фура жўнатамиз', 'Ҳар ҳафта Ҳайратонга фура чиқади'],
    good: ['Afgʻonistonga jadval yoʻq: fura yuk yigʻilganda joʻnaydi.', 'Afgʻoniston — biz uchun yangi yoʻnalish.', 'Afgʻonistonga muntazam reys yoʻq: fura yuk yigʻilganda joʻnaydi', 'Afgʻonistonga har hafta fura joʻnatasizmi?', 'Fura qachon joʻnashini menejer aytadi', 'Афғонистон — биз учун янги йўналиш.',
      // printed on the site (2026-11-12): every rule must let these through
      '2018-yildan beri. Endi Afgʻonistonga ham yuk tashiymiz va tranzit hujjatlarini rasmiylashtiramiz.', '2018-йилдан бери. Энди Афғонистонга ҳам юк ташиймиз ва транзит ҳужжатларини расмийлаштирамиз.'] },
  { id: 'ru.afghanSchedule', block: true, msg: SCHEDULE_MSG('ru'),
    re: new RegExp(RU_SCHEDULE, 'iu'),
    bad: ['Машина на Афганистан уходит каждую пятницу.', 'Фуры в Афганистан ходят постоянно.', 'Отправки в Хайратон — по понедельникам и четвергам.', 'В Афганистан отправляем четыре фуры в месяц.', 'Стабильные рейсы до Мазари-Шарифа.',
      'Еженедельные отправки в Афганистан', 'Каждую неделю фура уходит в Хайратон', 'В Афганистан два раза в неделю', 'Регулярные рейсы до Мазари-Шарифа', 'в Афганистан по расписанию'],
    good: ['Расписания в Афганистан нет: фура уходит, когда груз собран.', 'Афганистан — новое для нас направление.', 'Регулярных рейсов в Афганистан нет: фура уходит по мере набора груза', 'Отправляете ли вы фуры в Афганистан каждую неделю?', 'Когда уходит фура, скажет менеджер',
      // printed on the site (2026-11-12): every rule must let these through
      'С 2018 года. Теперь возим грузы и в Афганистан и оформляем транзитные документы.'] },
  { id: 'en.afghanSchedule', block: true, msg: SCHEDULE_MSG('en'),
    re: new RegExp(EN_SCHEDULE, 'iu'),
    bad: ['We dispatch a truck to Afghanistan each Friday.', 'Deliveries to Afghanistan leave Tashkent twice monthly.', 'Trucks to Afghanistan run all the time.', 'Departures for Hairatan on Mondays and Thursdays.', 'We send four trucks a month to Afghanistan.', 'A steady schedule to Mazar-i-Sharif.',
      'Weekly departures to Afghanistan', 'A truck leaves for Hairatan every week', 'Twice a week to Mazar-i-Sharif', 'Regular departures to Afghanistan', 'daily trucks to Hairatan'],
    good: ['There is no fixed schedule to Afghanistan: the truck leaves when the cargo is ready.', 'Afghanistan is a new direction for us.', 'There are no weekly departures to Afghanistan: the truck leaves when the cargo is collected', 'Do you send trucks to Afghanistan every week?', 'The manager tells you when the truck leaves',
      // printed on the site (2026-11-12): every rule must let these through
      'Since 2018. We now also carry cargo to Afghanistan and handle transit documents.'] },
  { id: 'zh.afghanSchedule', block: true, msg: SCHEDULE_MSG('zh'),
    re: new RegExp(ZH_SCHEDULE, 'iu'),
    bad: ['每月两次发往阿富汗。', '阿富汗方向车辆常年不断发运。', '我们每月向阿富汗发四车货。', '阿富汗方向车辆常年发运。', '阿富汗方向每月发四车货。', '马扎里沙里夫线路班期稳定。',
      '每周发车前往阿富汗', '发往阿富汗的货物每周发运', '海拉顿方向定期发车', '每天都有车发往马扎里沙里夫'],
    good: ['阿富汗对我们来说是新方向。', '发往阿富汗没有固定班期，货物集齐后发车', '发往阿富汗每周都发车吗？', '发车时间由客户经理告知',
      // printed on the site (2026-11-12): every rule must let these through
      '新方向：承接发往阿富汗的汽运货物，办理乌兹别克斯坦过境单证，并在塔什干的海关监管仓库安排仓位。', '我们也用中文、英语、俄语和乌兹别克语回复。', '始于 2018 年。现在也承接阿富汗货运，并办理过境单证。', '协助外籍卡车办理行车许可证'] },
  { id: 'fa.afghanSchedule', block: true, msg: SCHEDULE_MSG('fa'),
    re: new RegExp(FA_SCHEDULE, 'iu'),
    bad: ['هر جمعه یک کامیون به افغانستان می‌فرستیم.', 'ماهی دو بار به افغانستان بار می‌فرستیم.', 'کامیون‌ها پیوسته به افغانستان حرکت می‌کنند.', 'حرکت به حیرتان دوشنبه‌ها و پنج‌شنبه‌ها.', 'ماهی چهار کامیون به افغانستان می‌فرستیم.', 'برنامهٔ ثابت حرکت به مزار شریف.',
      'هر هفته به افغانستان کامیون می‌فرستیم', 'حرکت هفتگی به حیرتان', 'روزانه به مزار شریف بار می‌بریم', 'حمل منظم بار به افغانستان'],
    good: ['برای افغانستان برنامهٔ ثابت نداریم: کامیون پس از جمع شدن بار حرکت می‌کند.', 'افغانستان برای ما مسیر تازه‌ای است.', 'به افغانستان حرکت هفتگی نداریم: کامیون پس از جمع شدن بار راه می‌افتد', 'آیا هر هفته به افغانستان کامیون می‌فرستید؟', 'زمان حرکت کامیون را کارشناس ما اعلام می‌کند',
      // printed on the site (2026-11-12): every rule must let these through
      'در واتساپ (+998 00 000 00 00) یا تلگرام بنویسید: بار چیست، حجم یا وزن آن چقدر است، اکنون کجاست و باید به کجا برود — حیرتان یا مزار شریف.', 'حمل بار (کارگو) با کامیون از چین و ازبکستان به افغانستان', 'حمل بار از چین و ازبکستان به افغانستان با کامیون', 'از سال ۲۰۱۸. اکنون به افغانستان هم بار می‌بریم و اسناد ترانزیت آماده می‌کنیم.'] },

  /* — the Afghanistan direction is new: no years of work, no counts of trucks or clients, no "experience" — */
  { id: 'uz.afghanRecord', block: true, msg: RECORD_MSG('uz'),
    re: new RegExp(`${UZ_RECORD}|${UZC_RECORD}`, 'iu'),
    bad: ['Afgʻonistonga 5 yildan beri yuk tashiymiz.', 'Afgʻonistonga 200 dan ortiq fura joʻnatdik.', 'Afgʻonistonlik 50 dan ortiq mijozimiz bor.', 'Afgʻoniston yoʻnalishida katta tajribamiz bor.',
      'Афғонистонга 5 йилдан бери юк ташиймиз.', 'Афғонистон йўналишида катта тажрибамиз бор.',
      // guard-verify H19 (2026-11-13): speed beside an Afghan name ("fast", "quickly", "without queues"): price and timing are on request
      'Mozori Sharifga yukni tez yetkazamiz.', 'Мозори Шарифга юкни тез етказамиз.', 'Hamkorlarimiz — deklarant agentlar — Hayratonda navbatsiz rasmiylashtiradi.',
      'Ҳамкорларимиз — декларант агентлар — Ҳайратонда навбатсиз расмийлаштиради.'],
    good: ['Afgʻoniston — biz uchun yangi yoʻnalish.', 'Afgʻonistonga yuk tashishni 2026-yilda boshladik.', 'Afgʻoniston yoʻnalishini 2026-yilda ochdik.', 'Xizmat 11 — Afgʻoniston', 'Afgʻoniston yoʻnalishida tajribamiz hali yoʻq — bu yangi yoʻnalish.',
      'Афғонистон — биз учун янги йўналиш.'] },
  { id: 'ru.afghanRecord', block: true, msg: RECORD_MSG('ru'),
    re: new RegExp(RU_RECORD, 'iu'),
    bad: ['Возим грузы в Афганистан уже 5 лет.', 'Отправили в Афганистан более 200 фур.', 'У нас более 50 клиентов из Афганистана.', 'Большой опыт перевозок в Афганистан.',
      // guard-verify H19 (2026-11-13): speed beside an Afghan name ("fast", "quickly", "without queues"): price and timing are on request
      'Наши партнёры — таможенные агенты (декларанты) — быстро проводят таможенное оформление в Афганистане.'],
    good: ['Афганистан — новое для нас направление.', 'Направление Афганистан мы открыли в 2026 году.', 'Услуга 11 — Афганистан', 'Обновлено: 12 ноября 2026 г. Грузы в Афганистан'] },
  { id: 'en.afghanRecord', block: true, msg: RECORD_MSG('en'),
    re: new RegExp(EN_RECORD, 'iu'),
    bad: ['We have carried cargo to Afghanistan for 5 years.', 'More than 200 trucks sent to Afghanistan.', 'Over 50 clients from Afghanistan trust us.', 'Extensive experience on the Afghanistan route.',
      // guard-verify H19 (2026-11-13): speed beside an Afghan name ("fast", "quickly", "without queues"): price and timing are on request
      'Our partners — customs agents (declarants) — clear customs in Afghanistan quickly.',
      'Our partners — customs agents (declarants) — clear customs at Hairatan without queues.', 'We deliver to Mazar-i-Sharif fast.'],
    good: ['Afghanistan is a new direction for us.', 'We started the Afghanistan direction in 2026.', 'Service 11 — Afghanistan', 'Regulation No. 737 of 31 December 2022 applies to transit to Afghanistan'] },
  { id: 'zh.afghanRecord', block: true, msg: RECORD_MSG('zh'),
    re: new RegExp(ZH_RECORD, 'iu'),
    bad: ['我们承运阿富汗货物已有 5 年。', '已向阿富汗发运 200 多车货物。', '我们有 50 多位阿富汗客户。', '在阿富汗线路上经验丰富。',
      // guard-verify H19 (2026-11-13): speed beside an Afghan name ("fast", "quickly", "without queues"): price and timing are on request
      '我们快速把货物运到马扎里沙里夫。', '在海拉顿，我们的合作伙伴——报关代理（申报人）——快速办理清关。'],
    good: ['阿富汗对我们来说是新方向。', '阿富汗方向是我们 2026 年新开的。', '服务 11 — 阿富汗', '更新日期：2026年11月12日 阿富汗货运'] },
  { id: 'fa.afghanRecord', block: true, msg: RECORD_MSG('fa'),
    re: new RegExp(FA_RECORD, 'iu'),
    bad: ['۵ سال است که به افغانستان بار می‌بریم.', 'بیش از ۲۰۰ کامیون به افغانستان فرستاده‌ایم.', 'در مسیر افغانستان تجربهٔ فراوان داریم.',
      // guard-verify H19 (2026-11-13): speed beside an Afghan name ("fast", "quickly", "without queues"): price and timing are on request
      'بار را سریع به مزار شریف می‌رسانیم.', 'شرکای ما — کارگزاران گمرکی — در حیرتان بدون معطلی ترخیص می‌کنند.'],
    good: ['افغانستان برای ما مسیر تازه‌ای است.', 'مسیر افغانستان را در سال ۲۰۲۶ آغاز کردیم.', 'خدمت ۱۱ — افغانستان'] },

  /* — cargo FROM Afghanistan is not confirmed — */
  { id: 'uz.afghanOrigin', block: true, msg: ORIGIN_MSG('uz'),
    re: new RegExp(`${UZ_ORIGIN}|${UZC_ORIGIN}`, 'iu'),
    bad: ['Afgʻonistondan Oʻzbekistonga ham yuk olib kelamiz.', 'Afgʻonistondan Xitoyga eksport yuklarini tashiymiz.', 'Afgʻoniston yuklarini Oʻzbekiston orqali uchinchi davlatlarga tranzit qilamiz.', 'Qaytishda fura Afgʻonistondan meva olib keladi.',
      'Афғонистондан Ўзбекистонга ҳам юк олиб келамиз.', 'Қайтишда фура Афғонистондан мева олиб келади.'],
    good: ['Afgʻonistondan yuk olib kelmaymiz.', 'Afgʻonistondan yuk olib kelasizmi?', 'Xitoydan Afgʻonistonga va Oʻzbekistondan Afgʻonistonga', 'Xitoyda tovar topish va sotib olish xizmati afgʻonistonlik tadbirkorlar uchun ham ishlaydi: tovarni topamiz, sotib olamiz va fura bilan Hayraton yoki Mozori Sharifgacha yetkazamiz.',
      'Afgʻonistondan yozsangiz, WhatsAppga yozing.', 'Афғонистондан юк олиб келмаймиз.'] },
  { id: 'ru.afghanOrigin', block: true, msg: ORIGIN_MSG('ru'),
    re: new RegExp(RU_ORIGIN, 'iu'),
    bad: ['Возим грузы и из Афганистана в Узбекистан.', 'Экспортные грузы из Афганистана доставляем в Китай.', 'Обратным рейсом фура везёт из Афганистана сухофрукты.', 'Оформляем транзит афганских грузов в третьи страны.'],
    good: ['Грузы из Афганистана мы не возим.', 'Возите ли вы грузы из Афганистана?', 'из Китая в Афганистан и из Узбекистана в Афганистан', 'Поиск и выкуп товаров в Китае доступны и предпринимателям из Афганистана: находим товар, выкупаем и доставляем фурой до Хайратона или Мазари-Шарифа.',
      'Найдёте и выкупите ли вы товар в Китае для предпринимателя из Афганистана?', 'Хайратон — приграничный город на афганской стороне.'] },
  { id: 'en.afghanOrigin', block: true, msg: ORIGIN_MSG('en'),
    re: new RegExp(EN_ORIGIN, 'iu'),
    bad: ['We also carry cargo from Afghanistan to Uzbekistan.', 'Export cargo from Afghanistan is delivered to China.', 'On the way back the truck brings dried fruit from Afghanistan.', 'We arrange transit of Afghan cargo to third countries.'],
    good: ['We do not carry cargo from Afghanistan.', 'Do you carry cargo from Afghanistan?', 'from China to Afghanistan and from Uzbekistan to Afghanistan', 'Our sourcing and buying service in China is open to Afghan businesspeople too: we find the goods, buy them and deliver them by truck to Hairatan or Mazar-i-Sharif.',
      'Customers from Afghanistan can write to us in Dari.', 'Hairatan is the border town on the Afghan side.'] },
  { id: 'zh.afghanOrigin', block: true, msg: ORIGIN_MSG('zh'),
    re: new RegExp(ZH_ORIGIN, 'iu'),
    bad: ['我们也承运从阿富汗到乌兹别克斯坦的货物。', '阿富汗的出口货物可运往中国。', '回程时卡车从阿富汗运回干果。', '阿富汗货物过境运往哈萨克斯坦。'],
    good: ['我们不承运从阿富汗发出的货物。', '你们承运从阿富汗发出的货物吗？', '从乌兹别克斯坦发往阿富汗', '我们在中国的寻找货源和代采购服务同样面向阿富汗客商：我们找货、采购，并用卡车运至海拉顿或马扎里沙里夫。', '海拉顿是阿富汗一侧的边境城镇。'] },
  { id: 'fa.afghanOrigin', block: true, msg: ORIGIN_MSG('fa'),
    re: new RegExp(FA_ORIGIN, 'iu'),
    bad: ['از افغانستان به ازبکستان هم بار می‌آوریم.', 'بار صادراتی افغانستان را به چین می‌رسانیم.', 'در برگشت، کامیون از افغانستان میوهٔ خشک می‌آورد.', 'ترانزیت بار افغانستان به کشورهای ثالث را انجام می‌دهیم.'],
    good: ['از افغانستان بار نمی‌آوریم.', 'آیا از افغانستان هم بار می‌آورید؟', 'حمل بار از ازبکستان به افغانستان', 'آیا برای تاجری از افغانستان در چین کالا پیدا می‌کنید و می‌خرید؟', 'مشتریان افغانستان می‌توانند به دری برای ما بنویسند.'] },

  /* — two delivery points only: not "all", "any" or "other" cities of Afghanistan — */
  { id: 'uz.afghanAnywhere', block: true, msg: ANYWHERE_MSG('uz'),
    re: new RegExp(`${UZ_ANYWHERE}|${UZC_ANYWHERE}`, 'iu'),
    bad: ['Mozori Sharifdan tashqari Balx viloyatining boshqa tumanlariga ham olib boramiz.', 'Балх вилоятининг бошқа туманларига ҳам олиб борамиз.', 'Afgʻonistonning barcha shaharlariga yetkazib beramiz.', 'Afgʻoniston boʻylab eshikdan eshikkacha yetkazamiz.', 'Afgʻonistonning istalgan shahriga yetkazib berish mumkin.', 'Afgʻonistonning boshqa shaharlariga ham olib boramiz.',
      'Афғонистоннинг барча шаҳарларига етказиб берамиз.', 'Афғонистон бўйлаб эшикдан эшиккача етказамиз.'],
    good: ['Mozori Sharif — Balx viloyatining markazi.', 'Мозори Шариф — Балх вилоятининг маркази.', 'Afgʻonistonning boshqa shaharlariga yetkazasizmi? Hozircha yoʻq — faqat Hayraton va Mozori Sharif.', 'Afgʻonistonning boshqa shaharlariga yetkazmaymiz.', 'Bugungi kunda yetkazish nuqtalari shu ikkita.', 'Yukni Hayraton chegara postigacha yoki Mozori Sharifgacha yetkazamiz',
      'Афғонистоннинг бошқа шаҳарларига етказмаймиз.'] },
  { id: 'ru.afghanAnywhere', block: true, msg: ANYWHERE_MSG('ru'),
    re: new RegExp(RU_ANYWHERE, 'iu'),
    bad: ['Кроме Мазари-Шарифа, довозим и до других городов провинции Балх.', 'Возим грузы во все города Афганистана.', 'Доставка по всему Афганистану от двери до двери.', 'Доставим в любой город Афганистана.', 'Работаем с провинциями Балх, Саманган и Баглан.'],
    good: ['Мазари-Шариф — центр провинции Балх.', 'Можно ли доставить в другие города Афганистана? Пока нет — только Хайратон и Мазари-Шариф.', 'В другие города Афганистана не возим.', 'Другие города Афганистана — Кабул, Герат, Кандагар — не обслуживаем', 'доставляем фурой до Хайратона или Мазари-Шарифа'] },
  { id: 'en.afghanAnywhere', block: true, msg: ANYWHERE_MSG('en'),
    re: new RegExp(EN_ANYWHERE, 'iu'),
    bad: ['Besides Mazar-i-Sharif we reach other towns of Balkh province.', 'Delivery to every city in Afghanistan.', 'Door-to-door delivery across Afghanistan.', 'Nationwide coverage in Afghanistan.', 'Onward delivery to any Afghan city can be arranged.', 'We serve Balkh, Samangan and Baghlan provinces.'],
    good: ['Mazar-i-Sharif is the capital of Balkh province.', 'Is delivery to other Afghan cities possible? Not today: only Hairatan and Mazar-i-Sharif.', 'We do not deliver to other cities in Afghanistan.', 'Other Afghan cities — Kabul, Herat, Kandahar — are not served', 'Today these are the two delivery points.', 'we deliver them by truck to Hairatan or Mazar-i-Sharif'] },
  { id: 'zh.afghanAnywhere', block: true, msg: ANYWHERE_MSG('zh'),
    re: new RegExp(ZH_ANYWHERE, 'iu'),
    bad: ['除马扎里沙里夫外，也可送到巴尔赫省其他城镇。', '可送达阿富汗所有城市。', '阿富汗全境门到门配送。', '可安排转运至阿富汗任何城市。', '覆盖巴尔赫省、萨曼甘省和巴格兰省。'],
    good: ['马扎里沙里夫是巴尔赫省的首府。', '可以送到阿富汗其他城市吗？目前不行，只送海拉顿和马扎里沙里夫。', '我们不送阿富汗其他城市。', '目前交货地点只有这两个。', '货物送至海拉顿口岸或马扎里沙里夫'] },
  { id: 'fa.afghanAnywhere', block: true, msg: ANYWHERE_MSG('fa'),
    re: new RegExp(FA_ANYWHERE, 'iu'),
    bad: ['افزون بر مزار شریف، تا دیگر شهرهای ولایت بلخ هم می‌رسانیم.', 'به همهٔ شهرهای افغانستان بار می‌بریم.', 'تحویل درب به درب در سراسر افغانستان.', 'انتقال بار به هر شهر افغانستان ممکن است.', 'ولایت‌های بلخ، سمنگان و بغلان را پوشش می‌دهیم.'],
    good: ['مزار شریف مرکز ولایت بلخ است.', 'آیا تحویل در شهرهای دیگر افغانستان ممکن است؟ فعلاً نه؛ فقط حیرتان و مزار شریف.', 'به شهرهای دیگر افغانستان بار نمی‌بریم.', 'تا حیرتان و مزار شریف می‌رسانیم', 'امروز همین دو نقطهٔ تحویل را داریم.'] },

  /* — nothing about Iran is published (decision of 2026-11-12): the adjective, in every language of the site — */
  { id: 'any.iranian', msg: 'names something Iranian — nothing about Iran is published in this release: no Iranian partners, carriers, trucks or businesspeople (FACTS: Iran is on hold)',
    re: /(?<![a-zʻʼ])eronlik|(?<![а-яёўқғҳ])эронлик|(?<![a-zʻʼ])Eron\s+(?:fura|kompaniya|firma|tashuvchi|tadbirkor|biznesmen|hamkor)|(?<![а-яёўқғҳ])Эрон\s+(?:фура|компания|фирма|ташувчи|тадбиркор|бизнесмен|ҳамкор)|(?<![а-яё])иранск[а-яё]+|\bIranians?\b|伊朗(?:和[\p{Script=Han}]{2,6})?(?:的)?(?:运输|物流|货运)?(?:公司|企业|卡车|货车|承运人|客商|商人|伙伴|合作方|客户|港口)|ایرانی(?!\p{Script=Arabic})|(?<![a-zʻʼ])Eron\s+bilan\s+(?:ishla|hamkor)|(?<![а-яёўқғҳ])Эрон\s+билан\s+(?:ишла|ҳамкор)|(?<!Afg[ʻʼ'’‘`]?oniston\s)Islom\s+Respublikasi|(?<!Афғонистон\s)Ислом\s+Республикаси|Исламск[а-яё]+\s+Республик[а-яё]+(?!\s+Афганистан)|\bIslamic\s+Republic\b(?!\s+of\s+Afghanistan)|(?<!阿富汗)伊斯兰共和国|جمهوری\sاسلامی(?!\sافغانستان)/iu,
    bad: ['Eron Islom Respublikasi bilan ishlaydigan tashuvchilar uchun agentlik xizmati.', 'Агент в Узбекистане для перевозчиков из Исламской Республики.', 'Your agent in Uzbekistan for carriers from the Islamic Republic.', '为来自伊斯兰共和国的承运人在乌兹别克斯坦提供代理服务。', 'نمایندهٔ شما در ازبکستان برای شرکت‌های حمل از جمهوری اسلامی.', 'Eron furalari uchun Oʻzbekistondan qaytish yukini topamiz.', 'Эрон фуралари учун Ўзбекистондан қайтиш юкини топамиз.', 'Eronlik transport kompaniyalariga hamkorlik taklif qilamiz.', 'Eronlik va afgʻonistonlik tadbirkorlar uchun Xitoydan tovar topamiz.', 'Эронлик транспорт компанияларига ҳамкорлик таклиф қиламиз.', 'Предлагаем сотрудничество иранским транспортным компаниям.', 'Находим обратные грузы для иранских фур.',
      'We offer partnership to Iranian transport companies.', 'Sourcing and buying in China for Iranian and Afghan businesspeople.', '我们向伊朗运输公司提供合作。', '为伊朗卡车寻找回程货。', '为伊朗和阿富汗客商在中国找货并代采购。', 'به شرکت‌های حمل‌ونقل ایرانی پیشنهاد همکاری می‌دهیم.', 'برای کامیون‌های ایرانی بار برگشتی پیدا می‌کنیم.'],
    good: ['One Persian text for readers in Iran and Afghanistan', 'afgʻonistonlik tadbirkorlar uchun ham', 'предпринимателям из Афганистана', 'for Afghan businesspeople too', '同样面向阿富汗客商', 'برای تاجران افغانستان هم', 'Fevral uchun zaxirani dekabrda buyurtma qiling.'] },

  /* — who clears customs on the Afghan side: GSR's partners, customs agents (declarants), named as such (owner, 2026-11-12) — */
  { id: 'uz.afghanCustoms', block: true, msg: CUSTOMS_MSG('uz'),
    re: new RegExp(`${UZ_CUSTOMS}|${UZC_CUSTOMS}`, 'iu'),
    bad: ['Afgʻoniston tomonidagi bojxona rasmiylashtiruvini ham oʻzimiz qilamiz.', 'Mozori Sharifgacha DDP shartida yetkazamiz: boj va soliqlar narxga kiradi.', 'Afgʻonistonda bojxonani ham rasmiylashtiramiz.', 'Афғонистонда божхонани ҳам расмийлаштирамиз.',
      // a guide may not say it either (2026-11)
      'Afgʻonistondagi bojxona rasmiylashtiruvini yuk oluvchi yoki uning bojxona agenti bajaradi.', 'Афғонистондаги божхона расмийлаштирувини юк олувчи ёки унинг божхона агенти бажаради.',
      // partners who are not named as customs agents, the consignee's agent, "ourselves", our own broker, who pays (2026-11-12)
      'Hamkorlarimiz — bojxona agentlari — Afgʻonistonda bojxonani rasmiylashtiradi, boj va soliqlar esa narxga kiradi.', 'Afgʻonistonda bojxonani oʻzimiz rasmiylashtiramiz.', 'Afgʻonistondagi hamkorlarimiz u yerda bojxonani rasmiylashtiradi.',
      'Afgʻoniston tomonida bojxona rasmiylashtiruvini yuk oluvchining bojxona agenti — hamkorimiz bajaradi.', 'Afgʻoniston tomonida hamkorlarimiz — deklarant agentlar — bojxonani rasmiylashtiradi va siz uchun bojni toʻlaydi.',
      'Afgʻonistonda bojxonani oʻz bojxona brokerimiz hamkorlarimiz — deklarant agentlar bilan birga rasmiylashtiradi.',
      'Ҳамкорларимиз — божхона агентлари — Афғонистонда божхонани расмийлаштиради, бож ва солиқлар эса нархга киради.', 'Афғонистонда божхонани ўзимиз расмийлаштирамиз.', 'Афғонистондаги ҳамкорларимиз у ерда божхонани расмийлаштиради.',
      'Афғонистон томонида божхона расмийлаштирувини юк олувчининг божхона агенти — ҳамкоримиз бажаради.', 'Афғонистон томонида ҳамкорларимиз — декларант агентлар — божхонани расмийлаштиради ва сиз учун божни тўлайди.',
      'Афғонистонда божхонани ўз божхона брокеримиз ҳамкорларимиз — декларант агентлар билан бирга расмийлаштиради.',
      'Hamkorlarimiz — deklarant agentlar — Afgʻonistonda bojxonani rasmiylashtiradi; Afgʻoniston boji narxga kiradi.', 'Ҳамкорларимиз — декларант агентлар — Афғонистонда божхонани расмийлаштиради; Афғонистон божи нархга киради.',
      // guard-verify H1 (2026-11-13): DDP / "duties included" / door to door beside ANY form of the name (the dative / destination case)
      'Afgʻonistonga DDP shartida yetkazamiz.', 'Mozori Sharifga DDP shartida yetkazamiz.', 'Афғонистонга ДДП шартида етказамиз.', 'Мозори Шарифга ДДП шартида етказамиз.',
      'Афғонистонга DDP шартида етказамиз.', 'Afgʻonistonga eshikdan eshikkacha, bojxona rasmiylashtiruvi bilan yetkazamiz.',
      'Афғонистонга эшикдан эшиккача, божхона расмийлаштируви билан етказамиз.', 'Afgʻonistonga boj va soliqlar toʻlangan holda yetkazamiz.',
      'Афғонистонга бож ва солиқлар тўланган ҳолда етказамиз.',
      // guard-verify H2 (2026-11-13): who pays the Afghan duties, or "included", in other words (the uz «narxga kiradi» form among them)
      'Afgʻonistondagi bojxona toʻlovlari narxga kiritilgan.', 'Afgʻonistonda bojni siz toʻlaysiz.', 'Афғонистондаги божхона тўловлари нархга киритилган.',
      'Афғонистонда божни сиз тўлайсиз.', 'Афғонистонда божни мижоз тўлайди.', 'Afg\'onistonda bojxona to\'lovlari ham narxga kiradi.',
      // guard-verify H3 (2026-11-13): "…; duties included": a semicolon does not split the claim off the partner sentence
      'Afgʻoniston tomonida bojxona rasmiylashtiruvini hamkorlarimiz — deklarant agentlar bajaradi; boj va soliqlar narxga kiradi.',
      'Афғонистон томонида божхона расмийлаштирувини ҳамкорларимиз — декларант агентлар бажаради; бож ва солиқлар нархга киради.',
      // guard-verify H7 (2026-11-13): "we clear customs (with our partners' help)", "our customs broker" without "own"
      'Afgʻonistonda bojxonani hamkorlarimiz — deklarant agentlar yordamida rasmiylashtiramiz.',
      'Bojxona brokerimiz hamkorlarimiz — deklarant agentlar bilan birga Afgʻonistonda bojxonani rasmiylashtiradi.',
      'Афғонистонда божхонани ҳамкорларимиз — декларант агентлар ёрдамида расмийлаштирамиз.',
      'Божхона брокеримиз ҳамкорларимиз — декларант агентлар билан бирга Афғонистонда божхонани расмийлаштиради.',
      'Афғонистон томонида божхонани ҳамкорларимиз — божхона брокерлари орқали расмийлаштирамиз.',
      // guard-verify H8 (2026-11-13): a third party's customs agent (the importer's, the client's, "yours", "one you choose")
      'Afgʻonistonda bojxona rasmiylashtiruvini importyorning bojxona agenti — hamkorimiz bajaradi.',
      'Afgʻonistonda bojxona rasmiylashtiruvini mijozning bojxona agenti — hamkorimiz bajaradi.',
      'Afgʻonistonda bojxona rasmiylashtiruvini siz tanlagan deklarant yoki hamkorimiz bajaradi.',
      'Афғонистонда божхона расмийлаштирувини импортёрнинг божхона агенти — ҳамкоримиз бажаради.',
      'Афғонистонда божхона расмийлаштирувини мижознинг божхона агенти — ҳамкоримиз бажаради.',
      'Афғонистонда божхона расмийлаштирувини сиз танлаган декларант ёки ҳамкоримиз бажаради.',
      // guard-verify H9 (2026-11-13): customs at Hairatan, Mazar-i-Sharif or the Afghan border; «bojxonada … oʻzimiz»
      'Afgʻonistonda yukni bojxonada oʻzimiz rasmiylashtiramiz.', 'Afgʻoniston bojxonasida yukni oʻzimiz rasmiylashtiramiz.',
      'Афғонистонда юкни божхонада ўзимиз расмийлаштирамиз.', 'Афғонистон божхонасида юкни ўзимиз расмийлаштирамиз.',
      // guard-verify H14 (2026-11-13): our own customs agents / declarants beside the partners
      'Afgʻonistonda oʻz bojxona agentlarimiz va hamkorlarimiz ishlaydi.', 'Афғонистонда ўз божхона агентларимиз ва ҳамкорларимиз ишлайди.',
      // guard-verify H16 (2026-11-13): "at our expense", "at no extra charge", "included in our price" …
      'Bojxona rasmiylashtiruvi Afgʻoniston tomonida ham narxga kiradi: uni hamkorlarimiz — deklarant agentlar bajaradi.',
      'Божхона расмийлаштируви Афғонистон томонида ҳам нархга киради: уни ҳамкорларимиз — декларант агентлар бажаради.',
      'Afgʻoniston tomonidagi bojxona rasmiylashtiruvini hamkorlarimiz — deklarant agentlar bizning hisobimizdan bajaradi.',
      'Афғонистон томонидаги божхона расмийлаштирувини ҳамкорларимиз — декларант агентлар бизнинг ҳисобимиздан бажаради.'],
    good: ['Afgʻoniston tomonida qanday tartib va qaysi hujjatlar kerakligini menejer yukingiz boʻyicha tushuntiradi.', 'Oʻzbekistonda tranzit hujjatlarini rasmiylashtiramiz.', 'Afgʻoniston tomoni va eksport',
      'Афғонистон томонида қандай тартиб ва қайси ҳужжатлар кераклигини менежер юкингиз бўйича тушунтиради.',
      // the partner customs agents named as such (owner, 2026-11-12; DESIGN-GUIDES row 82): every rule must let these through
      'Afgʻoniston tomonida bojxona rasmiylashtiruvini hamkorlarimiz — deklarant agentlar bajaradi.', 'Afgʻonistondagi hamkorlarimiz — deklarant agentlar — yukni u yerda bojxonadan oʻtkazadi.', 'Termiz–Hayraton: yuk Oʻzbekistondan chiqadi va bojxona tranziti tugaydi; Afgʻoniston tomonida bojxonani hamkorlarimiz — deklarant agentlar rasmiylashtiradi.',
      'Афғонистон томонида божхона расмийлаштирувини ҳамкорларимиз — декларант агентлар бажаради.', 'Афғонистондаги ҳамкорларимиз — декларант агентлар — юкни у ерда божхонадан ўтказади.', 'Термиз–Ҳайратон: юк Ўзбекистондан чиқади ва божхона транзити тугайди; Афғонистон томонида божхонани ҳамкорларимиз — декларант агентлар расмийлаштиради.',
      // guard-verify true3 (2026-11-13): two facts in one sentence, true (GSR's own work beside the partner sentence): pins the narrowing of the new cancel words
      'Hujjatlarni Oʻzbekistonda biz tayyorlaymiz, Afgʻoniston tomonida esa bojxona rasmiylashtiruvini hamkorlarimiz — deklarant agentlar bajaradi.',
      'Ҳужжатларни Ўзбекистонда биз тайёрлаймиз, Афғонистон томонида эса божхона расмийлаштирувини ҳамкорларимиз — декларант агентлар бажаради.',
      'Tashishni biz tashkil qilamiz, Afgʻoniston tomonida esa bojxona rasmiylashtiruvini hamkorlarimiz — deklarant agentlar bajaradi.',
      'Ташишни биз ташкил қиламиз, Афғонистон томонида эса божхона расмийлаштирувини ҳамкорларимиз — декларант агентлар бажаради.',
      'Yukni Hayratonga yoki Mozori Sharifga biz olib boramiz; Afgʻoniston tomonida bojxona rasmiylashtiruvini hamkorlarimiz — deklarant agentlar bajaradi.',
      'Юкни Ҳайратонга ёки Мозори Шарифга биз олиб борамиз; Афғонистон томонида божхона расмийлаштирувини ҳамкорларимиз — декларант агентлар бажаради.',
      // guard-verify deny (2026-11-13): denials pass: a denial next to the claim still lets it through
      'Afgʻonistonga DDP shartida yetkazmaymiz.', 'Афғонистонга ДДП шартида етказмаймиз.',
      'Hamkorlarimiz — deklarant agentlar — yukni qabul qilmaydi va saqlamaydi: ular Afgʻoniston tomonida faqat bojxona rasmiylashtiruvini bajaradi.',
      'Ҳамкорларимиз — декларант агентлар — юкни қабул қилмайди ва сақламайди: улар Афғонистон томонида фақат божхона расмийлаштирувини бажаради.',
      // guard-verify true2 (2026-11-13): true sentences next to what these fixes read: LV b8 «без уплаты» / «soliqsiz» / 无需缴纳 / «بدون پرداخت», "since 2026", possessives, «کابل شارژ»
      'Afgʻon importyorlari Afgʻoniston tomonida bojxonani kim rasmiylashtirishini soʻraydi: hamkorlarimiz — deklarant agentlar.',
      'Afgʻoniston tomonida hamkorlarimiz — deklarant agentlar yukni bojxonadan oʻtkazib beradi.',
      'Bojxona tranziti rejimida Afgʻonistonga boradigan yuk uchun Oʻzbekistonda boj va soliqlar toʻlanmaydi (Bojxona kodeksi).',
      'Ofisimiz Toshkentda; Afgʻoniston tomonida bojxona rasmiylashtiruvini hamkorlarimiz — deklarant agentlar bajaradi.',
      '2026-yildan Afgʻonistonga ham fura bilan yuk tashiymiz.', 'Invoys va qadoqlash roʻyxatini fura Afgʻonistonga yoʻlga chiqishidan oldin yuboring.',
      'Afgʻonistonga boradigan yuk Oʻzbekistondan tranzit rejimida boj va soliqsiz oʻtadi (Bojxona kodeksi).',
      'Афғон импортёрлари Афғонистон томонида божхонани ким расмийлаштиришини сўрайди: ҳамкорларимиз — декларант агентлар.',
      'Афғонистон томонида ҳамкорларимиз — декларант агентлар юкни божхонадан ўтказиб беради.',
      'Божхона транзити режимида Афғонистонга борадиган юк учун Ўзбекистонда бож ва солиқлар тўланмайди (Божхона кодекси).',
      'Офисимиз Тошкентда; Афғонистон томонида божхона расмийлаштирувини ҳамкорларимиз — декларант агентлар бажаради.', '2026-йилдан Афғонистонга ҳам фура билан юк ташиймиз.',
      'Инвойс ва қадоқлаш рўйхатини фура Афғонистонга йўлга чиқишидан олдин юборинг.',
      'Афғонистонга борадиган юк Ўзбекистондан транзит режимида бож ва солиқсиз ўтади (Божхона кодекси).'] },
  { id: 'ru.afghanCustoms', block: true, msg: CUSTOMS_MSG('ru'),
    re: new RegExp(RU_CUSTOMS, 'iu'),
    bad: ['Растаможку в Афганистане берём на себя.', 'Доставка до Мазари-Шарифа на условиях DDP: пошлины включены.', 'Таможенное оформление на афганской стороне — наше.',
      // a guide may not say it either (2026-11)
      'Таможенное оформление в Афганистане делает получатель или его таможенный агент.',
      // partners who are not named as customs agents, the consignee's agent, "ourselves", our own broker, who pays (2026-11-12)
      'Наши партнёры — таможенные агенты — проводят таможенное оформление в Афганистане, а пошлины уже включены в цену.', 'Таможенное оформление в Афганистане мы проводим сами.', 'Наши партнёры проводят таможенное оформление в Афганистане.',
      'Таможенное оформление в Афганистане проводит таможенный агент получателя — наш партнёр.', 'На афганской стороне наши партнёры — таможенные агенты (декларанты) — проводят таможенное оформление и платят за вас пошлины.',
      'Таможенное оформление в Афганистане проводит наш собственный таможенный брокер вместе с партнёрами — таможенными агентами (декларантами).',
      'Наши партнёры — таможенные агенты (декларанты) — проводят таможенное оформление в Афганистане; афганские пошлины уже включены в цену.',
      // guard-verify H1 (2026-11-13): DDP / "duties included" / door to door beside ANY form of the name (the dative / destination case)
      'Доставка в Афганистан под ключ, с растаможкой.', 'Доставим груз в Мазари-Шариф с уплаченными афганскими пошлинами.', 'Доставляем в Афганистан на условиях DDP.',
      // guard-verify H2 (2026-11-13): who pays the Afghan duties, or "included", in other words (the uz «narxga kiradi» form among them)
      'Наша цена включает таможенные пошлины в Афганистане.', 'В Афганистане пошлины платит клиент.',
      // guard-verify H3 (2026-11-13): "…; duties included": a semicolon does not split the claim off the partner sentence
      'На афганской стороне таможенное оформление проводят наши партнёры — таможенные агенты (декларанты); пошлины уже включены.',
      // guard-verify H7 (2026-11-13): "we clear customs (with our partners' help)", "our customs broker" without "own"
      'Таможенное оформление в Афганистане мы проводим с помощью наших партнёров — таможенных агентов (декларантов).',
      'Наш таможенный брокер вместе с партнёрами — таможенными агентами (декларантами) — проводит таможенное оформление в Афганистане.',
      'Через наших партнёров — таможенных агентов (декларантов) — мы растаможиваем груз в Хайратоне.',
      // guard-verify H8 (2026-11-13): a third party's customs agent (the importer's, the client's, "yours", "one you choose")
      'Таможенное оформление в Афганистане проводит таможенный агент импортёра — наш партнёр.',
      'Таможенное оформление в Афганистане проводит таможенный агент покупателя — наш партнёр.',
      'Таможенное оформление в Афганистане проводит декларант, которого выберете вы, или наш партнёр.',
      // guard-verify H9 (2026-11-13): customs at Hairatan, Mazar-i-Sharif or the Afghan border; «bojxonada … oʻzimiz»
      'Растаможку в Хайратоне берём на себя.', 'Таможенное оформление на афганской границе проводим сами.', 'Таможенное оформление в Мазари-Шарифе проводим сами.',
      // guard-verify H14 (2026-11-13): our own customs agents / declarants beside the partners
      'В Афганистане работают наши собственные таможенные агенты и партнёры.',
      // guard-verify H16 (2026-11-13): "at our expense", "at no extra charge", "included in our price" …
      'Таможенное оформление в Афганистане проводят наши партнёры — таможенные агенты (декларанты), за наш счёт.',
      'Растаможка в Афганистане входит в стоимость: её проводят наши партнёры — таможенные агенты (декларанты).',
      'Таможенное оформление на афганской стороне проводят наши партнёры — таможенные агенты (декларанты) — без доплат.'],
    good: ['Какой порядок и какие документы нужны на афганской стороне, менеджер объясняет под ваш груз.', 'Афганская сторона и экспорт', 'Таможенное оформление в Ташкенте',
      // the partner customs agents named as such (owner, 2026-11-12; DESIGN-GUIDES row 82): every rule must let these through
      'На афганской стороне таможенное оформление проводят наши партнёры — таможенные агенты (декларанты).', 'Наши партнёры в Афганистане — таможенные агенты (декларанты) — проводят там таможенное оформление груза.',
      'Термез — Хайратон: груз выходит из Узбекистана, и таможенный транзит завершается; на афганской стороне таможенное оформление проводят наши партнёры — таможенные агенты (декларанты).',
      // guard-verify true3 (2026-11-13): two facts in one sentence, true (GSR's own work beside the partner sentence): pins the narrowing of the new cancel words
      'Мы организуем перевозку до Хайратона, а на афганской стороне таможенное оформление проводят наши партнёры — таможенные агенты (декларанты).',
      'Документы в Узбекистане оформляем мы, а на афганской стороне таможенное оформление проводят наши партнёры — таможенные агенты (декларанты).',
      'Груз мы доставляем до Хайратона или Мазари-Шарифа; таможенное оформление на афганской стороне проводят наши партнёры — таможенные агенты (декларанты).',
      // guard-verify deny (2026-11-13): denials pass: a denial next to the claim still lets it through
      'Доставку в Афганистан на условиях DDP мы не предлагаем.',
      'Наши партнёры — таможенные агенты (декларанты) — не принимают и не хранят груз: они проводят таможенное оформление на афганской стороне.',
      // guard-verify true2 (2026-11-13): true sentences next to what these fixes read: LV b8 «без уплаты» / «soliqsiz» / 无需缴纳 / «بدون پرداخت», "since 2026", possessives, «کابل شارژ»
      'Афганские импортёры часто спрашивают, кто проводит таможенное оформление на афганской стороне: наши партнёры — таможенные агенты (декларанты).',
      'В режиме таможенного транзита груз для Афганистана проходит через Узбекистан без уплаты таможенных пошлин и налогов (Таможенный кодекс, статьи 116 и 289).',
      'Офис компании — в Ташкенте; на афганской стороне таможенное оформление проводят наши партнёры — таможенные агенты (декларанты).',
      'С 2026 года мы возим грузы фурой и в Афганистан.',
      'В Хайратоне вы принимаете груз сами; таможенное оформление на афганской стороне проводят наши партнёры — таможенные агенты (декларанты).',
      'Отправьте нам инвойс и упаковочный лист до того, как фура выйдет в Афганистан.',
      'Груз для Мазари-Шарифа проходит Узбекистан в режиме транзита без уплаты пошлин и налогов (Таможенный кодекс, статья 116).'] },
  { id: 'en.afghanCustoms', block: true, msg: CUSTOMS_MSG('en'),
    re: new RegExp(EN_CUSTOMS, 'iu'),
    bad: ['We handle customs clearance in Afghanistan for you.', 'Delivery to Mazar-i-Sharif on DDP terms, duties included.', 'We clear customs on the Afghan side as well.',
      // a guide may not say it either (2026-11)
      'Customs clearance in Afghanistan is done by the consignee or the consignee’s customs agent.',
      // partners who are not named as customs agents, the consignee's agent, "ourselves", our own broker, who pays (2026-11-12)
      'Our partners — customs agents — clear customs in Afghanistan, and the duties are included in the price.', 'We clear customs in Afghanistan ourselves.', 'Our partners clear customs in Afghanistan.',
      'Customs clearance in Afghanistan is done by the consignee’s customs agent, one of our partners.', 'On the Afghan side, our partners — customs agents (declarants) — clear customs and pay the duties for you.',
      'Our own customs broker clears customs in Afghanistan together with our partners — customs agents (declarants).',
      'Our partners — customs agents (declarants) — clear customs in Afghanistan; the price includes the Afghan duties.',
      // guard-verify H1 (2026-11-13): DDP / "duties included" / door to door beside ANY form of the name (the dative / destination case)
      'We deliver to Afghanistan on DDP terms.', 'Door-to-door delivery to Afghanistan, customs clearance included.', 'We deliver to Afghanistan duty paid.',
      // guard-verify H2 (2026-11-13): who pays the Afghan duties, or "included", in other words (the uz «narxga kiradi» form among them)
      'Our price includes customs duties in Afghanistan.', 'We take care of the Afghan duties and taxes.', 'The duties in Afghanistan are the importer’s responsibility.',
      'With our partners — customs agents (declarants) — the Afghan customs clearance and the duties come in one price.',
      'Customs in Afghanistan is cleared by our partners — customs agents (declarants) — and the Afghan duties are on us.',
      // guard-verify H3 (2026-11-13): "…; duties included": a semicolon does not split the claim off the partner sentence
      'Customs clearance in Afghanistan: our partners — customs agents (declarants); duties included.',
      'Our partners — customs agents (declarants) — clear customs in Afghanistan; the duties are paid by you.',
      // guard-verify H7 (2026-11-13): "we clear customs (with our partners' help)", "our customs broker" without "own"
      'We clear customs in Afghanistan with the help of our partners — customs agents (declarants).',
      'Our customs broker, together with our partners — customs agents (declarants) — clears customs in Afghanistan.',
      // guard-verify H8 (2026-11-13): a third party's customs agent (the importer's, the client's, "yours", "one you choose")
      'Customs clearance in Afghanistan is done by the importer’s customs agent, one of our partners.',
      'Customs clearance in Afghanistan is done by a declarant you choose or by one of our partners.',
      // guard-verify H9 (2026-11-13): customs at Hairatan, Mazar-i-Sharif or the Afghan border; «bojxonada … oʻzimiz»
      'We clear the cargo through customs at the Afghan border.',
      // guard-verify H14 (2026-11-13): our own customs agents / declarants beside the partners
      'In Afghanistan, our own customs agents work together with our partners.',
      // guard-verify H16 (2026-11-13): "at our expense", "at no extra charge", "included in our price" …
      'Customs clearance in Afghanistan is done by our partners — customs agents (declarants) — at our expense.',
      'Customs clearance in Afghanistan is done by our partners — customs agents (declarants) — at no extra charge.',
      'Customs clearance on the Afghan side is included in our price: our partners — customs agents (declarants) — do it.'],
    good: ['The manager explains which procedure and which documents apply on the Afghan side for your cargo.', 'The Afghan side, and export', 'Customs clearance in Tashkent',
      // the partner customs agents named as such (owner, 2026-11-12; DESIGN-GUIDES row 82): every rule must let these through
      'On the Afghan side, customs clearance is done by our partners — customs agents (declarants).', 'Our partners in Afghanistan — customs agents (declarants) — clear the cargo through customs there.',
      'Termez–Hairatan: the cargo leaves Uzbekistan and the transit regime ends; on the Afghan side our partners — customs agents (declarants) — clear customs.',
      // guard-verify true3 (2026-11-13): two facts in one sentence, true (GSR's own work beside the partner sentence): pins the narrowing of the new cancel words
      'We arrange the carriage to Hairatan, and on the Afghan side customs clearance is done by our partners — customs agents (declarants).',
      'We handle the documents in Uzbekistan, and on the Afghan side customs clearance is done by our partners — customs agents (declarants).',
      'On the Afghan side, customs clearance is done by our partners — customs agents (declarants) — and the manager explains which documents apply for your cargo.',
      'GSR Logistics carries the cargo to Hairatan or Mazar-i-Sharif; customs clearance on the Afghan side is done by its partners — customs agents (declarants).',
      'We do the paperwork in Uzbekistan; in Afghanistan, our partners — customs agents (declarants) — clear customs.',
      // guard-verify deny (2026-11-13): denials pass: a denial next to the claim still lets it through
      'We do not deliver to Afghanistan on DDP terms.', 'The Afghan duties are not included in our price.',
      // guard-verify true2 (2026-11-13): true sentences next to what these fixes read: LV b8 «без уплаты» / «soliqsiz» / 无需缴纳 / «بدون پرداخت», "since 2026", possessives, «کابل شارژ»
      'Afghan importers often ask who clears customs on the Afghan side: our partners — customs agents (declarants).',
      'For Afghan importers: on the Afghan side, customs clearance is done by our partners — customs agents (declarants).',
      'Cargo for Afghanistan crosses Uzbekistan without payment of customs duties and taxes (Customs Code, Articles 116 and 289).',
      'Our office is in Tashkent; on the Afghan side, customs clearance is done by our partners — customs agents (declarants).',
      'GSR Logistics has carried cargo from China to Uzbekistan since 2018 and now also carries cargo to Afghanistan by truck.',
      'Since 2026 we also carry cargo to Afghanistan by truck.',
      'You do not need to come to the border: on the Afghan side, customs clearance is done by our partners — customs agents (declarants).',
      'In Hairatan, customs clearance on the Afghan side is done by our partners — customs agents (declarants).',
      'Send us the invoice and the packing list before the truck leaves for Afghanistan.',
      'At Hairatan you collect the cargo yourself; to Mazar-i-Sharif we deliver it to the city.',
      'The manager explains which procedure and which documents apply on the Afghan side for your cargo, and our partners — customs agents (declarants) — clear customs there.'] },
  { id: 'zh.afghanCustoms', block: true, msg: CUSTOMS_MSG('zh'),
    re: new RegExp(ZH_CUSTOMS, 'iu'),
    bad: ['阿富汗一侧的清关由我们代办。', '按 DDP 条款送至马扎里沙里夫，含关税。', '我们在阿富汗也可代办报关。',
      // partners who are not named as customs agents, the consignee's agent, "ourselves", our own broker, who pays (2026-11-12)
      '我们的合作伙伴——报关代理——在阿富汗办理清关，关税已含在价格中。', '我们在阿富汗自行办理清关。', '我们在阿富汗的合作伙伴负责清关。',
      '在阿富汗，清关由收货人的报关代理办理，该代理是我们的合作伙伴。', '在阿富汗一侧，我们的合作伙伴——报关代理（申报人）——办理清关并为您缴纳关税。',
      '在阿富汗，清关由我们自有的报关行与合作伙伴——报关代理（申报人）——共同办理。',
      '我们的合作伙伴——报关代理（申报人）——在阿富汗办理清关；价格已包含阿富汗关税。',
      // guard-verify H1 (2026-11-13): DDP / "duties included" / door to door beside ANY form of the name (the dative / destination case)
      '发往阿富汗的货物按DDP条款交付。', '发往阿富汗，门到门包清关。', '到阿富汗的货物，清关由我们负责。', '我们按DDP条款把货物运到阿富汗。',
      // guard-verify H2 (2026-11-13): who pays the Afghan duties, or "included", in other words (the uz «narxga kiradi» form among them)
      '价格包括阿富汗的关税。', '阿富汗一侧的清关由我们的合作伙伴——报关代理（申报人）——办理，关税由客户自付。',
      // guard-verify H3 (2026-11-13): "…; duties included": a semicolon does not split the claim off the partner sentence
      '阿富汗一侧：清关由我们的合作伙伴——报关代理（申报人）——办理；关税已含在运费中。',
      // guard-verify H7 (2026-11-13): "we clear customs (with our partners' help)", "our customs broker" without "own"
      '我们借助合作伙伴——报关代理（申报人）——在阿富汗办理清关。', '我们的报关行与合作伙伴——报关代理（申报人）——在阿富汗共同办理清关。',
      // guard-verify H8 (2026-11-13): a third party's customs agent (the importer's, the client's, "yours", "one you choose")
      '在阿富汗，清关由进口商的报关代理办理，该代理是我们的合作伙伴。', '在阿富汗，清关由客户的报关代理或我们的合作伙伴办理。',
      // guard-verify H9 (2026-11-13): customs at Hairatan, Mazar-i-Sharif or the Afghan border; «bojxonada … oʻzimiz»
      '我们在海拉顿办理清关。',
      // guard-verify H16 (2026-11-13): "at our expense", "at no extra charge", "included in our price" …
      '阿富汗一侧的清关费用已包含在运费中，由我们的合作伙伴——报关代理（申报人）——办理。', '我们的合作伙伴——报关代理（申报人）——在阿富汗为您清关并承担费用。', '阿富汗清关由我们的合作伙伴——报关代理（申报人）——办理，无需额外付费。'],
    good: ['阿富汗一侧适用哪些手续、需要哪些单证，由客户经理根据您的货物情况说明。', '阿富汗一侧的手续与出口', '在塔什干办理清关',
      // the partner customs agents named as such (owner, 2026-11-12; DESIGN-GUIDES row 82): every rule must let these through
      '在阿富汗一侧，清关由我们的合作伙伴——报关代理（申报人）——办理。', '我们在阿富汗的合作伙伴——报关代理（申报人）——在当地为货物办理清关。',
      '铁尔梅兹—海拉顿：货物离开乌兹别克斯坦，海关过境结束；在阿富汗一侧，由我们的合作伙伴——报关代理（申报人）——办理清关。',
      // guard-verify true3 (2026-11-13): two facts in one sentence, true (GSR's own work beside the partner sentence): pins the narrowing of the new cancel words
      '货物可在塔什干转运，阿富汗一侧的清关由我们的合作伙伴——报关代理（申报人）——办理。', '我们负责运输到海拉顿，阿富汗一侧的清关由我们的合作伙伴——报关代理（申报人）——办理。',
      // guard-verify deny (2026-11-13): denials pass: a denial next to the claim still lets it through
      '我们不按DDP条款向阿富汗交货。',
      // guard-verify true2 (2026-11-13): true sentences next to what these fixes read: LV b8 «без уплаты» / «soliqsiz» / 无需缴纳 / «بدون پرداخت», "since 2026", possessives, «کابل شارژ»
      '阿富汗进口商常问，阿富汗一侧由谁清关：由我们的合作伙伴——报关代理（申报人）——办理。', '在海关过境制度下，阿富汗过境货物在乌兹别克斯坦无需缴纳关税和税款。', '办事处设在塔什干；在阿富汗一侧，清关由我们的合作伙伴——报关代理（申报人）——办理。', '自2026年起，我们也承运发往阿富汗的货物。',
      '在海拉顿，您自行提货；阿富汗一侧的清关由我们的合作伙伴——报关代理（申报人）——办理。', '卡车出发前往阿富汗之前，请把发票和装箱单发给我们。'] },
  { id: 'fa.afghanCustoms', block: true, msg: CUSTOMS_MSG('fa'),
    re: new RegExp(FA_CUSTOMS, 'iu'),
    bad: ['ترخیص گمرکی در افغانستان را هم خودمان انجام می‌دهیم.', 'تحویل در مزار شریف با شرایط DDP؛ عوارض گمرکی در قیمت است.', 'ترخیص در سمت افغانستان با ماست.',
      // a guide may not say it either (2026-11)
      'ترخیص گمرکی در افغانستان را گیرندهٔ بار یا کارگزار گمرکی او انجام می‌دهد.',
      // partners who are not named as customs agents, the consignee's agent, "ourselves", our own broker, who pays (2026-11-12)
      'شرکای ما — کارگزاران گمرکی — ترخیص گمرکی را در افغانستان انجام می‌دهند و عوارض گمرکی در قیمت است.', 'ترخیص گمرکی در افغانستان را خودمان انجام می‌دهیم.', 'شرکای ما در افغانستان ترخیص گمرکی را انجام می‌دهند.',
      'در افغانستان، ترخیص گمرکی را کارگزار گمرکی گیرندهٔ بار، یکی از شرکای ما، انجام می‌دهد.', 'در سمت افغانستان، شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — ترخیص گمرکی را انجام می‌دهند و عوارض را به جای شما می‌پردازند.',
      'ترخیص گمرکی در افغانستان را کارگزار گمرکی خودمان همراه با شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — انجام می‌دهد.',
      'شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — ترخیص گمرکی را در افغانستان انجام می‌دهند؛ عوارض گمرکی افغانستان در قیمت است.',
      // guard-verify H1 (2026-11-13): DDP / "duties included" / door to door beside ANY form of the name (the dative / destination case)
      'حمل بار به افغانستان با شرایط DDP.', 'حمل درب به درب به افغانستان همراه با ترخیص گمرکی.', 'ارسال بار به مزار شریف با ترخیص و عوارض گمرکی.',
      'بار را با شرایط DDP به افغانستان می‌رسانیم.',
      // guard-verify H2 (2026-11-13): who pays the Afghan duties, or "included", in other words (the uz «narxga kiradi» form among them)
      'هزینهٔ گمرکی در افغانستان در قیمت ما شامل است.', 'در افغانستان، عوارض گمرکی را مشتری پرداخت می‌کند.',
      'در سمت افغانستان، ترخیص گمرکی را شرکای ما — کارگزاران گمرکی — انجام می‌دهند و هزینه‌ی گمرکی در قیمت است.', 'حقوقِ گمرکیِ افغانستان در قیمت ما شامل است.',
      // guard-verify H3 (2026-11-13): "…; duties included": a semicolon does not split the claim off the partner sentence
      'در سمت افغانستان، ترخیص گمرکی را شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — انجام می‌دهند؛ عوارض گمرکی در قیمت است.',
      // guard-verify H7 (2026-11-13): "we clear customs (with our partners' help)", "our customs broker" without "own"
      'ترخیص گمرکی در افغانستان را با کمک شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — انجام می‌دهیم.',
      'کارگزار گمرکی ما همراه با شرکای ما — کارگزاران گمرکی — ترخیص را در افغانستان انجام می‌دهد.',
      // guard-verify H8 (2026-11-13): a third party's customs agent (the importer's, the client's, "yours", "one you choose")
      'در افغانستان، ترخیص گمرکی را کارگزار گمرکی واردکننده، که از شرکای ماست، انجام می‌دهد.', 'در افغانستان، ترخیص گمرکی را کارگزار گمرکی شما یا یکی از شرکای ما انجام می‌دهد.',
      // guard-verify H16 (2026-11-13): "at our expense", "at no extra charge", "included in our price" …
      'ترخیص گمرکی در افغانستان را شرکای ما — کارگزاران گمرکی — انجام می‌دهند و هزینه‌اش با ماست.'],
    good: ['اینکه در سمت افغانستان چه مراحلی باید طی شود و چه اسنادی لازم است، کارشناس ما برای بار شما توضیح می‌دهد.', 'سمت افغانستان و صادرات', 'ترخیص گمرکی در تاشکند',
      // the partner customs agents named as such (owner, 2026-11-12; DESIGN-GUIDES row 82): every rule must let these through
      'در سمت افغانستان، ترخیص گمرکی را شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — انجام می‌دهند.', 'شرکای ما در افغانستان — کارگزاران گمرکی (اظهارکنندگان) — ترخیص گمرکی بار را در آنجا انجام می‌دهند.',
      'ترمذ–حیرتان: بار از ازبکستان خارج می‌شود و ترانزیت گمرکی پایان می‌یابد؛ در سمت افغانستان، ترخیص گمرکی را شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — انجام می‌دهند.',
      // guard-verify true3 (2026-11-13): two facts in one sentence, true (GSR's own work beside the partner sentence): pins the narrowing of the new cancel words
      'ما بار را تا حیرتان می‌بریم و در سمت افغانستان، ترخیص گمرکی را شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — انجام می‌دهند.',
      'بار در تاشکند جابه‌جا می‌شود؛ در سمت افغانستان، ترخیص گمرکی را شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — انجام می‌دهند.',
      // guard-verify deny (2026-11-13): denials pass: a denial next to the claim still lets it through
      'بار را با شرایط DDP به افغانستان نمی‌رسانیم.',
      // guard-verify true2 (2026-11-13): true sentences next to what these fixes read: LV b8 «без уплаты» / «soliqsiz» / 无需缴纳 / «بدون پرداخت», "since 2026", possessives, «کابل شارژ»
      'واردکنندگان افغان معمولاً می‌پرسند ترخیص گمرکی در سمت افغانستان را چه کسی انجام می‌دهد: شرکای ما — کارگزاران گمرکی (اظهارکنندگان).',
      'در رژیم ترانزیت گمرکی، برای بار ترانزیتی به مقصد افغانستان در ازبکستان حقوق و عوارض گمرکی پرداخت نمی‌شود.',
      'دفتر ما در تاشکند است؛ در سمت افغانستان، ترخیص گمرکی را شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — انجام می‌دهند.',
      'از سال ۲۰۲۶ به افغانستان هم با کامیون بار حمل می‌کنیم.',
      'لازم نیست به مرز بیایید: در سمت افغانستان، ترخیص گمرکی را شرکای ما — کارگزاران گمرکی (اظهارکنندگان) — انجام می‌دهند.',
      'پیش از حرکت کامیون به افغانستان، فاکتور و فهرست بسته‌بندی را برای ما ارسال کنید.',
      'بار ترانزیتی به مقصد افغانستان بدون پرداخت حقوق و عوارض گمرکی از ازبکستان عبور می‌کند.'] },

  /* — wholesale buying: the employees' Chinese — owner, 2026-11-18: four know Chinese, TWO hold an HSK 6 certificate; no other certificate, no "native", no translators — */
  { id: 'uz.hskCertificate', msg: HSK_PAPER_MSG('uz'),
    re: new RegExp(`${hskPaper({ paper: UZ_HSK_PAPER, hold: UZ_HSK_HOLD, cert: UZ_HSK_CERT, holder: UZ_HSK_HOLDER, two: UZ_HSK_TWO, stop: '.!?', clause: ',;:()', before: 40, after: 80 })}|${hskPaper({ paper: UZC_HSK_PAPER, hold: UZC_HSK_HOLD, cert: UZC_HSK_CERT, holder: UZC_HSK_HOLDER, two: `${UZC_HSK_TWO}|${RU_HSK_TWO}`, stop: '.!?', clause: ',;:()', before: 40, after: 80 })}|${UZ_STAFF_CREDENTIAL}|${UZC_STAFF_CREDENTIAL}`, 'iu'),
    bad: ['Hammasi sertifikatlangan.', 'Ҳаммаси сертификатланган.', 'Bizda sertifikatlangan tarjimonlar bor.', 'Hammasida HSK 6 sertifikati bor.', 'Har birida HSK 6 sertifikati bor.', 'Ҳаммасида HSK 6 сертификати бор.', 'Xitoy tilini HSK 6 darajasida biladigan xodimlarimiz — tajribali tarjimonlar.', 'Xitoy tilini HSK 6 darajasida biladigan xodimlarimiz tegishli sertifikatga ega.', 'GSR Logisticsʼda xitoy tilini HSK 6 darajasida biladigan xodimlar bor: ularning hammasida xalqaro sertifikat bor.', 'Xodimlarimiz HSK 6 imtihonini topshirgan.', 'Xodimlarimiz HSK 6 darajasini olgan.', 'Xodimlarimizda HSK 6 bor.', 'HSKning 6-daraja sertifikatiga ega xodimlarimiz bor.', 'Xitoyshunos xodimlarimiz HSK 6 darajasida.', 'Ходимларимиз HSK 6 имтиҳонини топширган.', 'Tarjimon kerak emas: tarjimonlarimiz HSK 6 darajasida.', 'HSK 6 sertifikatiga ega xodimlarimiz zavod bilan muzokara olib boradi.', 'Xodimlarimiz HSK 6 diplomiga ega.', 'Xodimlarimiz xitoy tilini ona tilidek biladi — HSK 6 darajasida.', 'HSK 6 darajasidagi tarjimonlarimiz muzokarani olib boradi.',
      'HSK 6 сертификатига эга ходимларимиз завод билан музокара олиб боради.', 'Ходимларимиз хитой тилини она тилидек билади — HSK 6 даражасида.',
      // owner, 2026-11-18: the certificate is the two's — not all four's, not three's or one's, and no level but 6
      'Xitoy tilini biladigan toʻrtta xodimimizning hammasida HSK 6 sertifikati bor.', 'Toʻrttala xodimimiz HSK 6 sertifikatiga ega.', 'Uchta xodimimizda HSK 6 sertifikati bor.', 'Xodimlarimizdan birida HSK 5 sertifikati bor.', 'Bitta xodimimiz xitoy tilini HSK 3 darajasida biladi.',
      'Sertifikatlangan jamoamiz xitoy tilini HSK 6 darajasida biladi.', 'Xodimlarimiz HSK 6 sertifikatiga ega tarjimonlar.', 'Тўрттала ходимимиз HSK 6 сертификатига эга.', 'Ходимларимиздан бирида HSK 5 сертификати бор.', 'Учта ходимимизда HSK 6 сертификати бор.'],
    good: [
      // review fixes S2/S3 (2026-11-18): the same sentences in their round-4 form (DESIGN §14a, E of §14.8)
      'GSR Logistics-да хитой тилини биладиган тўртта ходим бор: учтаси Тошкентда, биттаси Ивуда ишлайди; тўрттасидан иккитаси расмий HSK 6 сертификатига эга.', 'Xitoy tilini biladigan 4 xodim bor (3 tasi Toshkentda, 1 tasi Ivuda); toʻrttasidan ikkitasida rasmiy HSK 6 sertifikati bor.', 'Tarjimon kerak emas: xitoy tilini biladigan toʻrtta xodimimiz bor; ikkitasi HSK 6 sertifikatiga ega.', 'Yoʻq, Xitoyga borish ham, tarjimon yollash ham shart emas: xitoy tilini biladigan toʻrtta xodimimiz bor; ikkitasi HSK 6 sertifikatiga ega.', 'Таржимон керак эмас: хитой тилини биладиган тўртта ходимимиз бор; иккитаси HSK 6 сертификатига эга.', 'Xitoyga oʻzim borishim yoki tarjimon yollashim shartmi? Yoʻq. Xitoy tilini biladigan toʻrtta xodimimiz bor; ikkitasi HSK 6 sertifikatiga ega.',
      'HSK imtihonini xitoy tili ona tili hisoblanmaydigan kishilar topshiradi; HSK 6 — uning darajalaridan biri.', // what the test is: «ona tili boʻlmaganlar» is its audience
      'HSK — xitoy tili ona tili boʻlmaganlar uchun moʻljallangan, Xitoyning standartlashtirilgan til bilish imtihoni; uning 6-darajasi 5 000 va undan ortiq soʻzni bilishni talab qiladi.',
      'HSK — хитой тили она тили бўлмаганлар учун мўлжалланган, Хитойнинг стандартлаштирилган тил билиш имтиҳони; унинг 6-даражаси 5 000 ва ундан ортиқ сўзни билишни талаб қилади.',
      // the question may name an interpreter: the answer is a sentence of its own
      'Sertifikatli ishlab chiqaruvchidan toʻgʻridan-toʻgʻri.',
      // owner, 2026-11-18: two of the four hold an HSK 6 certificate (DESIGN §14.8 sentence E and the page's sentences)
      'Xitoy tilini biladigan toʻrtta xodimimiz bor; ikkitasi HSK 6 sertifikatiga ega.', 'Хитой тилини биладиган тўртта ходимимиз бор; иккитаси HSK 6 сертификатига эга.',
      'Xitoy tilini biladigan toʻrtta xodim, ulardan ikkitasida HSK 6 sertifikati bor, zavod va sotuvchilardan xarid qiladi.',
      'HSK 6 — shu sertifikatga ega 2 xodim', 'Ulgurji xaridlar boʻyicha kim ishlaydi va HSK 6 sertifikati nima?', 'HSK 6 sertifikati nimani anglatadi va u kimda bor?',
      'HSK — xitoy tili ona tili boʻlmaganlar uchun moʻljallangan, Xitoyning standartlashtirilgan til bilish imtihoni, uning sertifikati topshirilgan darajani koʻrsatadi; 6-darajasi 5 000 va undan ortiq soʻzni bilishni talab qiladi.',
      // the writers' round-4 forms (W/drafts/page.uz.json, 2026-11-18 15:18)
      'GSR Logisticsʼda xitoy tilini biladigan toʻrtta xodim bor: uchtasi Toshkentda, bittasi Ivuda ishlaydi; toʻrttasidan ikkitasi rasmiy HSK 6 sertifikatiga ega.', 'HSK 6 — Bu sertifikat 2 ta xodimimizda bor', 'HSK 6 sertifikati nima va u nechta xodimingizda bor?',
      'Zavod yoki sotuvchidan — xitoy tilini biladigan toʻrtta xodim bilan; ikkitasi HSK 6 sertifikatiga ega.', 'Xitoy tilini bilishingiz shart emas: uni biladigan toʻrtta xodimimiz bor, ulardan ikkitasi HSK 6 sertifikatiga ega.'] },
  { id: 'ru.hskCertificate', msg: HSK_PAPER_MSG('ru'),
    re: new RegExp(`${hskPaper({ paper: RU_HSK_PAPER, hold: RU_HSK_HOLD, cert: RU_HSK_CERT, holder: RU_HSK_HOLDER, two: `${RU_HSK_TWO}|${UZC_HSK_TWO}`, stop: '.!?', clause: ',;:()', before: 80, after: 40 })}|${RU_STAFF_CREDENTIAL}`, 'iu'),
    bad: ['Все четверо сертифицированы.', 'У нас сертифицированные переводчики китайского языка.', 'Все четверо имеют сертификат HSK 6.', 'Все четверо — с сертификатом HSK 6.', 'Сертификаты есть у всех сотрудников, которые знают китайский язык на уровне HSK 6.', 'Наши переводчики — сотрудники, которые знают китайский язык на уровне HSK 6.', 'Наши сотрудники сдали HSK 6.', 'Наши сотрудники получили HSK 6.', 'У наших сотрудников есть HSK 6.', 'Наши сотрудники свободно владеют китайским (HSK 6).', 'Переводчик не нужен: наши переводчики имеют HSK 6.', 'Готовы нанять переводчика с HSK 6 для вашей сделки.', 'Сотрудники с сертификатом HSK 6 ведут переговоры с фабрикой за вас.', 'Наши переводчики с HSK 6 ведут переговоры.', 'Сотрудники говорят по-китайски как на родном: уровень HSK 6.', 'Наши закупщики — носители китайского языка с HSK 6.',
      // owner, 2026-11-18: the certificate is the two's — not all four's, not three's or one's, and no level but 6
      'У всех четырёх сотрудников есть сертификат HSK 6.', 'Все наши сотрудники имеют сертификат HSK 6.', 'У троих сотрудников есть сертификат HSK 6.', 'Один сотрудник сдал HSK 5.', 'Наша сертифицированная команда знает китайский на уровне HSK 6.', 'У одного из сотрудников есть сертификат HSK 3.'],
    good: [
      // review fixes S2/S3 (2026-11-18): the same sentences in their round-4 form (DESIGN §14a, E of §14.8)
      'В GSR Logistics четыре сотрудника, которые знают китайский язык: трое работают в Ташкенте, один — в Иу, и у двоих из четырёх есть официальный сертификат HSK 6.', 'Каждую оптовую закупку ведёт один из четырёх сотрудников, которые знают китайский язык: трое работают в Ташкенте, один — в Иу, а у двоих из четырёх есть сертификат HSK 6.', 'Нет, ни ехать в Китай, ни нанимать переводчика не нужно: у нас четыре сотрудника, которые знают китайский язык; у двоих из них есть сертификат HSK 6.', 'Нужно ли ехать в Китай или нанимать переводчика? Нет. У нас четыре сотрудника, которые знают китайский язык; у двоих из них есть сертификат HSK 6.',
      'Строители хотят плитку, сантехнику, электротовары — напрямую от сертифицированного производителя.', 'HSK сдают те, для кого китайский язык не родной; HSK 6 — один из уровней экзамена.', 'HSK (Hanyu Shuiping Kaoshi) — стандартизированный экзамен Китая по китайскому языку для тех, для кого он не родной; уровень 6 предполагает словарный запас от 5 000 слов.',
      'HSK — экзамен для не носителей китайского языка.', // owner, 2026-11-18: two of the four hold an HSK 6 certificate (DESIGN §14.8 sentence E and the page's sentences)
      'У нас четыре сотрудника, которые знают китайский язык; у двоих из них есть сертификат HSK 6.',
      'Четыре сотрудника, которые знают китайский язык, двое из них — с сертификатом HSK 6, закупают у фабрик и оптовых продавцов.', 'HSK 6 — 2 сотрудника с этим сертификатом',
      'Кто работает над оптовыми закупками и что такое сертификат HSK 6?', 'Что значит сертификат HSK 6 и у кого он есть?',
      'HSK (Hanyu Shuiping Kaoshi) — стандартизированный экзамен Китая по китайскому языку для тех, для кого он не родной, а его сертификат подтверждает сданный уровень; уровень 6 предполагает словарный запас от 5 000 слов.',
      // the writers' round-4 forms (W/drafts/page.ru.json, 2026-11-18 15:20)
      'В GSR Logistics есть четыре сотрудника, которые знают китайский язык: трое — в Ташкенте, один — в Иу; у двоих из четырёх есть официальный сертификат HSK 6.', 'HSK 6 — Сертификат есть у 2 наших сотрудников',
      'Что такое сертификат HSK 6 и у скольких ваших сотрудников он есть?', 'Четыре сотрудника знают китайский и закупают у фабрик и продавцов; у двоих — сертификат HSK 6.'] },
  { id: 'en.hskCertificate', msg: HSK_PAPER_MSG('en'),
    re: new RegExp(`${hskPaper({ paper: EN_HSK_PAPER, hold: EN_HSK_HOLD, cert: EN_HSK_CERT, holder: EN_HSK_HOLDER, two: EN_HSK_TWO, stop: '.!?', clause: ',;:()', before: 40, after: 80 })}|${EN_STAFF_CREDENTIAL}`, 'iu'),
    bad: ['All four are certified.', 'We have four employees who know Chinese, and all four are certified.', 'We have certified translators of Chinese.', 'All four have an HSK 6 certificate.', 'All four have HSK 6.', 'We have employees who know Chinese at HSK 6 level and speak it like their native language.', 'We have employees who know Chinese at HSK 6 level, and every one of them holds an international certificate.', 'GSR Logistics has employees who know Chinese at HSK 6 level; they are professional translators with experience of purchasing in China.', 'Our employees passed HSK 6.', 'Our employees hold HSK 6.', 'Every buyer on our team has taken the HSK 6 exam.', 'Our employees are fluent in Chinese (HSK 6).', 'You need our interpreters with HSK 6.', 'No need to worry: our interpreters have HSK 6.', 'Our employees speak native Chinese, and HSK 6 is not their limit.', 'We hire interpreters with HSK 6.', 'We find interpreters with HSK 6 for you.', 'Our HSK 6 certified staff negotiate with the factory for you.', 'Every buyer on our team holds an HSK 6 certificate.', 'HSK 6 certificate holders talk to the factory.', 'Our buyers speak Chinese at native level, above HSK 6.', 'Our HSK 6 interpreters negotiate with the factory.',
      // owner, 2026-11-18: the certificate is the two's — not all four's, not three's or one's, and no level but 6
      'All four employees hold an HSK 6 certificate.', 'Each of our four employees has an HSK 6 certificate.', 'Three of our employees hold an HSK 6 certificate.', 'Our employees are HSK 6 certificate holders.', 'One of them holds an HSK 5 certificate and one an HSK 3 certificate.',
      'Our team is HSK 6 certified.', 'We have four employees who know Chinese; all of them hold an HSK 6 certificate.', 'Four employees who know Chinese, all with an HSK 6 certificate, buy from factories.', 'Two of them hold an HSK 6 certificate, the other two an HSK 5 certificate.', 'Our employees passed HSK 4.'],
    good: [
      // review fixes S2/S3 (2026-11-18): the same sentences in their round-4 form (DESIGN §14a, E of §14.8)
      'GSR Logistics has four employees who know Chinese: three work in Tashkent and one in Yiwu, and two of the four hold an official HSK 6 certificate.', 'Every wholesale purchase is handled by one of four employees who know Chinese: three work in Tashkent and one in Yiwu, and two of the four hold an HSK 6 certificate.', 'You do not need an interpreter: we have four employees who know Chinese; two of them hold an HSK 6 certificate.', 'No — you need neither a trip to China nor an interpreter: we have four employees who know Chinese; two of them hold an HSK 6 certificate.', 'Do I have to travel to China or hire an interpreter? No. We have four employees who know Chinese; two of them hold an HSK 6 certificate.',
      'Builders want tiles, plumbing or electrical goods straight from a certified producer.', 'HSK is a test of Chinese for people who do not speak it as their native language.', 'HSK is the Chinese test for people whose native language is not Chinese.', 'HSK (Hanyu Shuiping Kaoshi) is China’s standardised test of Chinese for people whose first language is not Chinese; level 6 expects a vocabulary of 5,000 or more words.',
      'HSK is a test of Chinese for non-native speakers.', // owner, 2026-11-18: two of the four hold an HSK 6 certificate (DESIGN §14.8 sentence E; W/drafts/page.en.json, extras.en.json)
      'We have four employees who know Chinese; two of them hold an HSK 6 certificate.',
      'Your wholesale purchase is handled by one of our four employees who know Chinese; two of them hold an HSK 6 certificate.',
      'Wholesale buying in China for businesses in Uzbekistan: employees who know Chinese, two with an HSK 6 certificate, buy from factories and wholesale sellers.',
      'Four employees who know Chinese, two with an HSK 6 certificate, buy from factories and sellers.', 'No Chinese needed: we have four employees who know Chinese, and two of them hold an HSK 6 certificate.',
      'HSK 6 — 2 employees with this certificate', 'Who works on wholesale purchases, and what is an HSK 6 certificate?', 'What does an HSK 6 certificate mean, and who holds one?',
      'HSK (Hanyu Shuiping Kaoshi) is China’s standardised test of Chinese for people whose first language is not Chinese, and its certificate shows the level passed; level 6 expects a vocabulary of 5,000 or more words.',
      'Two of our four employees hold an official HSK 6 certificate.',
      // the master as it stands at 15:06 (W/drafts/page.en.json, extras.en.json)
      'What is an HSK 6 certificate, and how many of your employees hold one?', 'HSK 6 — Certificate held by 2 of our employees', 'Four employees who know Chinese buy from factories and sellers; two hold an HSK 6 certificate.',
      'GSR Logistics has four employees who know Chinese — three work in Tashkent and one in Yiwu — and two of the four hold an official HSK 6 certificate.',
      'every wholesale purchase is handled by one of four employees who know Chinese, two of whom hold an HSK 6 certificate (three of the four work in Tashkent, one in Yiwu)'] },
  { id: 'zh.hskCertificate', msg: HSK_PAPER_MSG('zh'),
    re: new RegExp(`${hskPaper({ paper: ZH_HSK_PAPER, hold: ZH_HSK_HOLD, cert: ZH_HSK_CERT, holder: ZH_HSK_HOLDER, two: ZH_HSK_TWO, stop: '。！？!?', clause: '，,；;：:、（）()', before: 20, after: 30 })}|${ZH_STAFF_CREDENTIAL}`, 'iu'),
    bad: ['我们的四名员工均已获得认证。', '我们有认证翻译。', 'GSR Logistics 有中文达到 HSK 6 级水平的员工；他们的中文接近母语水平。', '我们的员工已通过 HSK 6 级考试。', '我们的员工考取了 HSK 6 级。', '我们的员工都有 HSK 6 级。', '我们的员工拥有 HSK 6 级文凭。', '我们的员工精通中文（HSK 6 级）。', '不用请翻译，我们的翻译有 HSK 6 级。', '我们持有 HSK 6 级证书的员工替您与工厂谈判。', '员工均通过 HSK 6 级认证。', '我们的员工中文达到母语水平，高于 HSK 6 级。', '我们的 HSK 6 级翻译替您与工厂谈判。',
      // owner, 2026-11-18: the certificate is the two's — not all four's, not three's or one's, and no level but 6
      '我们的四名员工都持有 HSK 6 级证书。', '全体员工均持有 HSK 6 级证书。', '三名员工持有 HSK 6 级证书。', '一名员工持有 HSK 5 级证书。', '我们的翻译团队持有 HSK 6 级证书。', '我们的员工有 HSK 3 级证书。'],
    good: [
      // review fixes S2/S3 (2026-11-18): the same sentences in their round-4 form (DESIGN §14a, E of §14.8)
      'GSR Logistics 有四名懂中文的员工：三名在塔什干工作，一名在义乌工作；四人中有两名持有 HSK 6 级官方证书。', '每一笔批发采购都由四名懂中文的员工之一负责：三名在塔什干工作，一名在义乌工作；四人中有两名持有 HSK 6 级证书。', '您无需持有中国银行卡，我们有四名懂中文的员工，其中两名持有 HSK 6 级证书。', '不需要亲自去中国，也不用请翻译：我们有四名懂中文的员工，其中两名持有 HSK 6 级证书。', '您无需聘请翻译，我们有四名懂中文的员工，其中两名持有 HSK 6 级证书。', '需要亲自去中国或请翻译吗？不需要。我们有四名懂中文的员工，其中两名持有 HSK 6 级证书。',
      'HSK 是面向非中文母语者的中文水平考试；HSK 6 级是其中的一个等级。', 'HSK（中文水平考试）是面向中文非第一语言学习者的国际标准化考试；6 级要求掌握 5,000 个及以上词语。', 'HSK 是面向母语非汉语者的标准化考试。',
      // owner, 2026-11-18: two of the four hold an HSK 6 certificate (DESIGN §14.8 sentence E and the page's sentences)
      '我们有四名懂中文的员工，其中两名持有 HSK 6 级证书。', '懂中文的员工（其中两名持有 HSK 6 级证书）为您向工厂和批发商户采购。',
      'HSK 6 — 2 名员工持有该证书', '谁负责批发采购？HSK 6 级证书是什么？', 'HSK 6 级证书代表什么？谁持有？', 'HSK（中文水平考试）是面向中文非第一语言学习者的国际标准化考试，其证书证明考生通过的等级；6 级要求掌握 5,000 个及以上词语。',
      // the writers' round-4 forms (W/drafts/page.zh.json, 2026-11-18 15:13)
      'GSR Logistics 有四名懂中文的员工（三名在塔什干工作，一名在义乌工作），四人中有两名持有 HSK 6 级官方证书。', 'HSK 6 — 我们有 2 名员工持有此证书', '什么是 HSK 6 级证书？你们有几名员工持有该证书？'] },
  { id: 'fa.hskCertificate', msg: HSK_PAPER_MSG('fa'),
    re: new RegExp(`${hskPaper({ paper: FA_HSK_PAPER, hold: FA_HSK_HOLD, cert: FA_HSK_CERT, holder: FA_HSK_HOLDER, two: FA_HSK_TWO, stop: FA_STOP, clause: '،,؛;:()', before: 40, after: 60 })}|${FA_STAFF_CREDENTIAL}`, 'iu'),
    bad: ['همهٔ کارمندان ما گواهی رسمی دارند.', 'مترجمان رسمی داریم.', 'کارمندانی داریم که زبان چینی را در سطح HSK 6 می‌دانند؛ آنان مترجمان حرفه‌ای هستند.', 'کارمندان ما آزمون HSK 6 را گذرانده‌اند.', 'کارمندان ما در آزمون HSK 6 قبول شده‌اند.', 'کارمندان ما HSK 6 دارند.', 'کارمندان ما به زبان چینی مسلط هستند (HSK 6).', 'به مترجم نیاز ندارید: مترجمان ما HSK 6 دارند.', 'کارکنان دارای مدرک HSK 6 از طرف شما با کارخانه مذاکره می‌کنند.', 'گواهی HSK 6 دارند.', 'کارمندان ما چینی را مثل زبان مادری می‌دانند و HSK 6 دارند.', 'مترجمان ما با سطح HSK 6 مذاکره می‌کنند.',
      // owner, 2026-11-18: the certificate is the two's — not all four's, not three's or one's, and no level but 6
      'همهٔ چهار کارمند ما گواهی HSK 6 دارند.', 'سه کارمند ما گواهی HSK 6 دارند.', 'یک نفر از آنان گواهی HSK 5 دارد.', 'تیم دارای گواهی HSK 6 ما با کارخانه مذاکره می‌کند.', 'کارمندان ما مدرک HSK 3 دارند.'],
    good: [
      // review fixes S2/S3 (2026-11-18): the same sentences in their round-4 form (DESIGN §14a, E of §14.8)
      'GSR Logistics چهار کارمند دارد که زبان چینی می‌دانند: سه نفر در تاشکند و یک نفر در ییوو کار می‌کنند و دو نفر از این چهار نفر گواهی رسمی HSK 6 دارند.', 'به مترجم نیاز ندارید: چهار کارمند داریم که زبان چینی می‌دانند؛ دو نفر از آنان گواهی HSK 6 دارند.', 'آیا باید به چین سفر کنم یا مترجم بگیرم؟ خیر. چهار کارمند داریم که زبان چینی می‌دانند؛ دو نفر از آنان گواهی HSK 6 دارند.',
      'HSK آزمون زبان چینی برای افرادی است که زبان مادری‌شان زبانی غیر از چینی است.', 'HSK (Hanyu Shuiping Kaoshi) آزمون استاندارد چین برای سنجش مهارت زبان چینی کسانی است که زبان مادری‌شان چینی نیست؛ سطح ۶ آن دانستن ۵٬۰۰۰ واژه یا بیشتر را می‌طلبد.',
      'HSK آزمونی برای کسانی است که زبان مادری‌شان چینی نیست.', // owner, 2026-11-18: two of the four hold an HSK 6 certificate (DESIGN §14.8 sentence E and the page's sentences)
      'چهار کارمند داریم که زبان چینی می‌دانند؛ دو نفر از آنان گواهی HSK 6 دارند.', 'هر خرید عمده را یکی از چهار کارمندی انجام می‌دهد که زبان چینی می‌دانند؛ دو نفر از آنان گواهی HSK 6 دارند.', 'کارمندانی که زبان چینی می‌دانند و دو نفر از آنان گواهی HSK 6 دارند، از کارخانه‌ها و فروشندگان عمده برای شما خرید می‌کنند.',
      'HSK 6 — ۲ کارمند با این گواهی', 'چه کسانی روی خریدهای عمده کار می‌کنند و گواهی HSK 6 چیست؟', 'گواهی HSK 6 یعنی چه و چه کسی آن را دارد؟',
      // the writers' round-4 forms (W/drafts/page.fa.json, 2026-11-18 15:17)
      'در GSR Logistics چهار کارمند هستند که زبان چینی می‌دانند: سه نفر از آنان در تاشکند کار می‌کنند و یک نفر در ییوو؛ دو نفر از این چهار نفر گواهی رسمی HSK 6 دارند.', 'HSK 6 — ۲ نفر از کارمندان ما این گواهی را دارند',
      'گواهی HSK 6 چیست و چند نفر از کارمندان شما آن را دارند؟', 'چهار کارمندی که چینی می‌دانند، از کارخانه‌ها و فروشندگان می‌خرند؛ دو نفرشان گواهی HSK 6 دارند.',
      'HSK (Hanyu Shuiping Kaoshi) آزمون استاندارد چین برای سنجش مهارت زبان چینی کسانی است که زبان مادری‌شان چینی نیست و گواهی آن سطحِ قبول‌شده را نشان می‌دهد؛ سطح ۶ آن دانستن ۵٬۰۰۰ واژه یا بیشتر را می‌طلبد.'] },

  /* — wholesale buying: the certificate tied to no place — owner, 2026-11-18: which of the four holds a certificate and where each works is not known — */
  { id: 'uz.hskPlace', msg: HSK_PLACE_MSG('uz'),
    re: new RegExp(UZ_HSK_PLACE, 'iu'),
    bad: ['GSR Logisticsʼda xitoy tilini biladigan toʻrtta xodim bor: uchtasi Toshkentda, bittasi Ivuda ishlaydi, ikkitasida esa rasmiy HSK 6 sertifikati bor.', 'GSR Logistics-да хитой тилини биладиган тўртта ходим бор: учтаси Тошкентда, биттаси Ивуда ишлайди, иккитасида эса расмий HSK 6 сертификати бор.', 'Xitoy tilini biladigan 4 xodim bor (3 tasi Toshkentda, 1 tasi Ivuda); ikkitasida rasmiy HSK 6 sertifikati bor.', 'Har bir ulgurji xarid bilan xitoy tilini biladigan toʻrtta xodimdan biri shugʻullanadi: uchtasi Toshkentda, bittasi Ivuda ishlaydi, ikkitasida HSK 6 sertifikati bor.',
      'Toshkentdagi ikki xodimimizda HSK 6 sertifikati bor.', 'Тошкентдаги икки ходимимизда HSK 6 сертификати бор.', 'Uchtasi Toshkentda, bittasi Ivuda ishlaydi; ulardan ikkitasi HSK 6 sertifikatiga ega.', 'Ikkita xodimimizda HSK 6 sertifikati bor, ulardan biri Ivuda ishlaydi.', 'Иккита ходимимизда HSK 6 сертификати бор, улардан бири Ивуда ишлайди.'],
    good: ['GSR Logisticsʼda xitoy tilini biladigan toʻrtta xodim bor: uchtasi Toshkentda, bittasi Ivuda ishlaydi; toʻrttasidan ikkitasi rasmiy HSK 6 sertifikatiga ega.', 'GSR Logistics-да хитой тилини биладиган тўртта ходим бор: учтаси Тошкентда, биттаси Ивуда ишлайди; тўрттасидан иккитаси расмий HSK 6 сертификатига эга.', 'Xitoy tilini biladigan 4 xodim bor (3 tasi Toshkentda, 1 tasi Ivuda); toʻrttasidan ikkitasida rasmiy HSK 6 sertifikati bor.', 'Xitoy tilini biladigan toʻrtta xodimimiz bor; ikkitasi HSK 6 sertifikatiga ega.', 'Har bir ulgurji xaridni xitoy tilini biladigan toʻrtta xodimimizdan biri olib boradi: uchtasi Toshkentda, bittasi Ivuda ishlaydi; toʻrttasidan ikkitasi HSK 6 sertifikatiga ega.'] },
  { id: 'ru.hskPlace', msg: HSK_PLACE_MSG('ru'),
    re: new RegExp(RU_HSK_PLACE, 'iu'),
    bad: ['В GSR Logistics четыре сотрудника, которые знают китайский язык: трое работают в Ташкенте, один — в Иу, и у двоих из них есть официальный сертификат HSK 6.', 'Каждую оптовую закупку ведёт один из четырёх сотрудников, которые знают китайский язык: трое работают в Ташкенте, один — в Иу, а у двоих из них есть сертификат HSK 6.',
      'Двое наших сотрудников в Ташкенте имеют сертификат HSK 6.', 'Трое работают в Ташкенте, один — в Иу; у двоих из них есть сертификат HSK 6.', 'У двоих наших сотрудников есть сертификат HSK 6, один из них работает в Иу.'],
    good: ['В GSR Logistics есть четыре сотрудника, которые знают китайский язык: трое — в Ташкенте, один — в Иу; у двоих из четырёх есть официальный сертификат HSK 6.', 'У нас четыре сотрудника, которые знают китайский язык; у двоих из них есть сертификат HSK 6.', 'Каждую оптовую закупку ведёт один из четырёх сотрудников, которые знают китайский язык: трое работают в Ташкенте, один — в Иу, а у двоих из четырёх есть сертификат HSK 6.'] },
  { id: 'en.hskPlace', msg: HSK_PLACE_MSG('en'),
    re: new RegExp(EN_HSK_PLACE, 'iu'),
    bad: ['GSR Logistics has four employees who know Chinese: three work in Tashkent and one in Yiwu, and two of them hold an official HSK 6 certificate.', 'Every wholesale purchase is handled by one of four employees who know Chinese: three work in Tashkent and one in Yiwu, and two of them hold an HSK 6 certificate.', 'GSR Logistics has four employees who know Chinese — three work in Tashkent and one in Yiwu — and two of them hold an official HSK 6 certificate.', 'every wholesale purchase is handled by one of four employees who know Chinese (three in Tashkent, one in Yiwu), two of whom hold an HSK 6 certificate',
      'Two of our employees in Tashkent hold an HSK 6 certificate.', 'In Yiwu, two of our employees hold an HSK 6 certificate.', 'Our two employees in Yiwu and Tashkent hold an HSK 6 certificate.', 'Two of our employees hold an HSK 6 certificate; one of them works in Yiwu.'],
    good: ['GSR Logistics has four employees who know Chinese: three work in Tashkent and one in Yiwu, and two of the four hold an official HSK 6 certificate.', 'GSR Logistics has four employees who know Chinese — three work in Tashkent and one in Yiwu — and two of the four hold an official HSK 6 certificate.', 'every wholesale purchase is handled by one of four employees who know Chinese, two of whom hold an HSK 6 certificate (three of the four work in Tashkent, one in Yiwu)', 'We have four employees who know Chinese; two of them hold an HSK 6 certificate.', 'Samples are received at the Yiwu warehouse, and two of the four employees hold an HSK 6 certificate.'] },
  { id: 'zh.hskPlace', msg: HSK_PLACE_MSG('zh'),
    re: new RegExp(ZH_HSK_PLACE, 'iu'),
    bad: ['GSR Logistics 有四名懂中文的员工：三名在塔什干工作，一名在义乌工作，其中两名持有 HSK 6 级官方证书。', '每一笔批发采购都由四名懂中文的员工之一负责：三名在塔什干工作，一名在义乌工作，其中两名持有 HSK 6 级证书。',
      '我们在塔什干的两名员工持有 HSK 6 级证书。', '两名在义乌工作的员工持有 HSK 6 级证书。'],
    good: ['GSR Logistics 有四名懂中文的员工：三名在塔什干工作，一名在义乌工作；四人中有两名持有 HSK 6 级官方证书。', 'GSR Logistics 有四名懂中文的员工（三名在塔什干工作，一名在义乌工作），四人中有两名持有 HSK 6 级官方证书。', '我们有四名懂中文的员工，其中两名持有 HSK 6 级证书。'] },
  { id: 'fa.hskPlace', msg: HSK_PLACE_MSG('fa'),
    re: new RegExp(FA_HSK_PLACE, 'iu'),
    bad: ['GSR Logistics چهار کارمند دارد که زبان چینی می‌دانند: سه نفر در تاشکند و یک نفر در ییوو کار می‌کنند و دو نفر از آنان گواهی رسمی HSK 6 دارند.',
      'دو کارمند ما در تاشکند گواهی HSK 6 دارند.'],
    good: ['در GSR Logistics چهار کارمند هستند که زبان چینی می‌دانند: سه نفر از آنان در تاشکند کار می‌کنند و یک نفر در ییوو؛ دو نفر از این چهار نفر گواهی رسمی HSK 6 دارند.', 'GSR Logistics چهار کارمند دارد که زبان چینی می‌دانند: سه نفر در تاشکند و یک نفر در ییوو کار می‌کنند و دو نفر از این چهار نفر گواهی رسمی HSK 6 دارند.', 'چهار کارمند داریم که زبان چینی می‌دانند؛ دو نفر از آنان گواهی HSK 6 دارند.'] },
  /* — wholesale buying: how many — owner, 2026-11-18: four know Chinese (three in Tashkent, one in Yiwu), two hold an HSK 6 certificate; the count beside HSK is two — */
  { id: 'uz.hskCount', block: true, msg: HSK_COUNT_MSG('uz'),
    re: new RegExp(`${hskNearest(`${UZ_HEADCOUNT}|${UZC_HEADCOUNT}`, `${UZ_HSK_TWO}|${UZC_HSK_TWO}`, '.!?;', '.!?;:,')}|${hskLevel({ level: UZ_HSK_LEVEL, holder: UZ_HSK_HOLDER, two: UZ_HSK_TWO, stop: '.!?;', clause: '.!?;:,' })}|${hskLevel({ level: UZC_HSK_LEVEL, holder: UZC_HSK_HOLDER, two: `${UZC_HSK_TWO}|${RU_HSK_TWO}`, stop: '.!?;', clause: '.!?;:,' })}`, 'iu'),
    bad: [
      // review fixes S3 (2026-11-18): the withdrawn predicate "at HSK 6 level" said of staff, with or without a count (DESIGN §14.1)
      'Qaysi xizmatni tanlasangiz ham 1 ta menejer bilan ishlaysiz, xitoy tilini HSK 6 darajasida biladigan xodimlarimiz ham bor.', 'Қайси хизматни танласангиз ҳам 1 та менежер билан ишлайсиз, хитой тилини HSK 6 даражасида биладиган ходимларимиз ҳам бор.', 'GSR Logisticsʼning 400+ mijozi va xitoy tilini HSK 6 darajasida biladigan xodimlari bor.', 'Xitoy tilini HSK 6 darajasida biladigan xodimlarimiz bor.', 'Bu xaridlar boʻyicha xitoy tilini HSK 6 darajasida biladigan, Xitoyda sotib olish bilan shugʻullangan xodimlarimiz ishlaydi.', 'Soʻrovni topshirganingizdan keyin xarid boʻyicha xitoy tilini HSK 6 darajasida biladigan xodimlar ishlaydi.', 'Xarid boʻyicha xitoy tilini HSK 6 darajasida biladigan xodimlar ishlaydi, deklaratsiyani esa bojxona brokerimiz topshiradi.', 'Tarjimon kerak emas: xitoy tilini HSK 6 darajasida biladigan xodimlarimiz bor.', 'Yoʻq, Xitoyga borish ham, tarjimon yollash ham shart emas: xitoy tilini HSK 6 darajasida biladigan xodimlarimiz bor.', 'Таржимон керак эмас: хитой тилини HSK 6 даражасида биладиган ходимларимиз бор.', 'GSR Logisticsʼda xitoy tilini HSK 6 darajasida biladigan xodimlar bor: ular Xitoyda sotib olish bilan shugʻullangan va zavodlardan sotib olish hamda sotuvchilardan ulgurji (optom) xarid qilish boʻyicha ishlaydi.', 'Хитой тилини HSK 6 даражасида биладиган ходимларимиз бор.', 'Zavoddan yoki ulgurji sotuvchidan — xitoy tilini HSK 6 darajasida biladigan xodimlar bilan.', 'Xitoyga oʻzim borishim yoki tarjimon yollashim shartmi? Yoʻq. Xitoy tilini HSK 6 darajasida biladigan xodimlarimiz bor.',
      'Xitoy tilini HSK 6 darajasida biladigan oʻndan ortiq xodimimiz bor.', 'Хитой тилини HSK 6 даражасида биладиган ўндан ортиқ ходимимиз бор.', '5 nafar xodimimiz xitoy tilini HSK 6 darajasida biladi.',
      '6 ta xodimimiz xitoy tilini HSK 6 darajasida biladi.', 'Beshta HSK 6 mutaxassisi buyurtmangiz bilan ishlaydi.', '10 dan ortiq xodimimiz xitoy tilini HSK 6 darajasida biladi.', '10+ xodimimiz xitoy tilini HSK 6 darajasida biladi.',
      'Bir necha xodimimiz xitoy tilini HSK 6 darajasida biladi.', 'Yigirma nafar xodimimiz xitoy tilini HSK 6 darajasida biladi.', 'HSKni topshirgan 5 nafar xodimimiz bor.', '12 nafar HSK 6 mutaxassisimiz Ivu va Guanchjouda ishlaydi.',
      'Xitoy tilini HSK 6 darajasida biladigan olti nafar xodimimiz bor.', 'Xitoy tilini HSK 6 darajasida biladigan 5 ta xodimimiz bor.', 'Jamoamizda HSK 6 darajasidagi oʻnta mutaxassis ishlaydi.', '12 нафар HSK 6 мутахассисимиз Иву ва Гуанчжоуда ишлайди.',
      'Хитой тилини HSK 6 даражасида биладиган олти нафар ходимимиз бор.',
      'Xitoy tilini HSK 6 darajasida biladigan beshta xodimimiz bor.', 'Xitoy tilini HSK 6 darajasida biladigan 10 nafar xodimimiz bor.', 'Xitoy tilini HSK 6 darajasida biladigan uchtadan ortiq xodimimiz bor.',
      'Xitoy tilini HSK 6 darajasida biladigan toʻrt nafardan koʻp xodimimiz bor.', '3 dan ortiq xodimimiz xitoy tilini HSK 6 darajasida biladi.', '4+ xodimimiz xitoy tilini HSK 6 darajasida biladi.',
      'Kamida toʻrtta xodimimiz xitoy tilini HSK 6 darajasida biladi.', 'Toʻrt va undan ortiq xodimimiz xitoy tilini HSK 6 darajasida biladi.', 'Yigirma toʻrt nafar xodimimiz xitoy tilini HSK 6 darajasida biladi.',
      'Oʻnlab xodimlarimiz xitoy tilini HSK 6 darajasida biladi.', 'Хитой тилини HSK 6 даражасида биладиган бешта ходимимиз бор.', 'Хитой тилини HSK 6 даражасида биладиган учтадан ортиқ ходимимиз бор.',
      'Камида тўртта ходимимиз хитой тилини HSK 6 даражасида билади.', 'Йигирма тўрт нафар ходимимиз хитой тилини HSK 6 даражасида билади.', 'Ўнлаб ходимларимиз хитой тилини HSK 6 даражасида билади.',
      'Тўрт ва ундан ортиқ ходимимиз хитой тилини HSK 6 даражасида билади.',
      'Uch-toʻrt nafar xodimimiz xitoy tilini HSK 6 darajasida biladi.', '3–4 nafar xodimimiz xitoy tilini HSK 6 darajasida biladi.', 'Уч-тўрт нафар ходимимиз хитой тилини HSK 6 даражасида билади.',
      // owner, 2026-11-18: withdrawn — the round-3 sentences that put the four at HSK 6 level
      'Xitoy tilini HSK 6 darajasida biladigan toʻrtta xodimimiz bor.', 'Хитой тилини HSK 6 даражасида биладиган тўртта ходимимиз бор.', 'GSR Logisticsʼda xitoy tilini HSK 6 darajasida biladigan toʻrtta xodim bor: uchtasi Toshkentda, bittasi Ivuda ishlaydi.',
      'GSR Logistics-да хитой тилини HSK 6 даражасида биладиган тўртта ходим бор: учтаси Тошкентда, биттаси Ивуда ишлайди.', 'Har bir ulgurji xarid bilan xitoy tilini HSK 6 darajasida biladigan toʻrtta xodimdan biri shugʻullanadi: uch xodim Toshkentda, bitta xodim Ivuda ishlaydi.',
      'Ҳар бир улгуржи харид билан хитой тилини HSK 6 даражасида биладиган тўртта ходимдан бири шуғулланади: уч ходим Тошкентда, битта ходим Ивуда ишлайди.', 'Xitoy tilini HSK 6 darajasida biladigan toʻrt nafar xodimimizdan uch nafari Toshkentda, bir nafari Ivuda ishlaydi.',
      'Хитой тилини HSK 6 даражасида биладиган тўрт нафар ходимимиздан уч нафари Тошкентда, бир нафари Ивуда ишлайди.', 'Xitoy tilini HSK 6 darajasida biladigan 4 nafar xodimimiz bor: 3 nafari Toshkentda, 1 nafari Ivuda ishlaydi.',
      'Хитой тилини HSK 6 даражасида биладиган 4 нафар ходимимиз бор: 3 нафари Тошкентда, 1 нафари Ивуда ишлайди.', 'HSK 6 — xitoy tilini shu darajada biladigan 4 xodim', 'HSK 6 — хитой тилини шу даражада биладиган 4 ходим',
      'Zavod yoki ulgurji sotuvchidan — xitoy tilini HSK 6 darajasida biladigan toʻrtta xodim bilan.',
      // … and no certificate count but two
      'Xitoy tilini biladigan toʻrtta xodimimizning toʻrttasida ham HSK 6 sertifikati bor.', 'Uchta xodimimizda HSK 6 sertifikati bor.', 'Bitta xodimimiz xitoy tilini HSK 6 darajasida biladi.', 'HSK 6 — shu sertifikatga ega 4 xodim', 'Toʻrttala xodimimizda HSK 6 sertifikati bor.', 'Учта ходимимизда HSK 6 сертификати бор.'],
    good: [
      // review fixes S3 (2026-11-18): counts of anything but people beside «HSK» (steps, clients, the one manager), in round-4 sentences
      'Qaysi xizmatni tanlasangiz ham 1 ta menejer bilan ishlaysiz; xitoy tilini biladigan toʻrtta xodimimiz bor, ikkitasi HSK 6 sertifikatiga ega.', 'Қайси хизматни танласангиз ҳам 1 та менежер билан ишлайсиз; хитой тилини биладиган тўртта ходимимиз бор, иккитаси HSK 6 сертификатига эга.', 'GSR Logisticsʼning 400+ mijozi va xitoy tilini biladigan toʻrtta xodimi bor; ikkitasi HSK 6 sertifikatiga ega.',
      
      // review fixes S2/S3 (2026-11-18): the same sentences in their round-4 form (DESIGN §14a, E of §14.8)
      'GSR Logisticsʼda xitoy tilini biladigan toʻrtta xodim bor: uchtasi Toshkentda, bittasi Ivuda ishlaydi; toʻrttasidan ikkitasi rasmiy HSK 6 sertifikatiga ega.', 'GSR Logistics-да хитой тилини биладиган тўртта ходим бор: учтаси Тошкентда, биттаси Ивуда ишлайди; тўрттасидан иккитаси расмий HSK 6 сертификатига эга.', 'Har bir ulgurji xarid bilan xitoy tilini biladigan toʻrtta xodimdan biri shugʻullanadi: uchtasi Toshkentda, bittasi Ivuda ishlaydi; toʻrttasidan ikkitasida HSK 6 sertifikati bor.', 'Xitoy tilini biladigan 4 xodim bor (3 tasi Toshkentda, 1 tasi Ivuda); toʻrttasidan ikkitasida rasmiy HSK 6 sertifikati bor.',
      // «ta» counts words and levels too: only people are a headcount
      'HSK 6 darajasi 5 000 ta va undan ortiq soʻzni bilishni talab qiladi.', 'HSK imtihoni 9 ta darajadan iborat.', 'HSK имтиҳони 9 та даражадан иборат.', 'Xizmat 06 — Ulgurji xarid', 'HSK 6 Xitoy tilini shu darajada biladigan xodimlarimiz bor',
      // owner, 2026-11-18: four know Chinese, two hold an HSK 6 certificate (DESIGN §14.8 sentence E and the page's sentences)
      'Xitoy tilini biladigan toʻrtta xodimimiz bor; ikkitasi HSK 6 sertifikatiga ega.', 'Хитой тилини биладиган тўртта ходимимиз бор; иккитаси HSK 6 сертификатига эга.',
      'Xitoy tilini biladigan toʻrtta xodim, ulardan ikkitasida HSK 6 sertifikati bor, zavod va sotuvchilardan xarid qiladi.',
      'Toʻrtta xodimimizdan ikkitasida HSK 6 sertifikati bor.', '…, bittasi Ivuda ishlaydi, rasmiy HSK 6 sertifikati esa ikkitasida bor.', 'HSK 6 — shu sertifikatga ega 2 xodim', 'HSK 6 — шу сертификатга эга 2 ходим'] },
  { id: 'ru.hskCount', block: true, msg: HSK_COUNT_MSG('ru'),
    re: new RegExp(`${hskNearest(RU_HEADCOUNT, RU_HSK_TWO, '.!?;', '.!?;:,', RU_TWO_OF)}|${hskLevel({ level: RU_HSK_LEVEL, holder: RU_HSK_HOLDER, two: RU_HSK_TWO, stop: '.!?;', clause: '.!?;:,' })}`, 'iu'),
    bad: [
      // review fixes S3 (2026-11-18): the withdrawn predicate "at HSK 6 level" said of staff, with or without a count (DESIGN §14.1)
      'С вами работает 1 менеджер, и у нас есть сотрудники, которые знают китайский на уровне HSK 6.', 'Как устроена закупка: шесть шагов и сотрудники, которые знают китайский на уровне HSK 6.', 'У GSR Logistics 400+ клиентов и сотрудники, которые знают китайский на уровне HSK 6.', 'У нас есть сотрудники, которые знают китайский язык на уровне HSK 6.', 'Над этими закупками работают сотрудники, которые знают китайский язык на уровне HSK 6 и занимались закупками в Китае.', 'Вы получили предложения — дальше над закупкой работают сотрудники, которые знают китайский на уровне HSK 6.', 'Нет, ни ехать в Китай, ни нанимать переводчика не нужно: у нас есть сотрудники, которые знают китайский язык на уровне HSK 6.', 'Переводчик не нужен — есть сотрудники, знающие китайский на уровне HSK 6.', 'В GSR Logistics есть сотрудники, которые знают китайский язык на уровне HSK 6: они занимались закупками в Китае и работают над закупками у фабрик и оптовыми закупками у продавцов.', 'У фабрик и у оптовых продавцов — с сотрудниками, знающими китайский на уровне HSK 6.', 'Нужно ли ехать в Китай или нанимать переводчика? Нет. У нас есть сотрудники, которые знают китайский язык на уровне HSK 6.',
      'У нас более десяти сотрудников, которые знают китайский на уровне HSK 6.', '5 сотрудников знают китайский на уровне HSK 6.', '10+ сотрудников знают китайский на уровне HSK 6.', 'Наша команда из семи человек говорит по-китайски на уровне HSK 6.',
      'Двенадцать наших сотрудников знают китайский на уровне HSK 6.', 'Несколько наших сотрудников знают китайский на уровне HSK 6.', 'Команда из пяти специалистов с HSK 6.', '6 наших сотрудников знают китайский на уровне HSK 6.',
      'Пять специалистов с HSK 6 работают над вашим заказом.', '21 сотрудник знает китайский на уровне HSK 6.', 'Работаем с 5 сотрудниками, которые знают китайский на уровне HSK 6.', '12 специалистов с уровнем HSK 6 работают в Иу и Гуанчжоу.',
      'Пятеро наших сотрудников знают китайский на уровне HSK 6.', 'В команде 5 человек с уровнем HSK 6.',
      'У нас шесть сотрудников, которые знают китайский язык на уровне HSK 6.', 'У нас пять сотрудников, которые знают китайский язык на уровне HSK 6.', '10 сотрудников знают китайский на уровне HSK 6.',
      'Более трёх сотрудников знают китайский на уровне HSK 6.', 'Не менее четырёх сотрудников знают китайский на уровне HSK 6.', 'Четыре и более сотрудников знают китайский на уровне HSK 6.', '4+ сотрудника знают китайский на уровне HSK 6.',
      'Двадцать четыре сотрудника знают китайский на уровне HSK 6.', 'Десятки наших сотрудников знают китайский на уровне HSK 6.', 'Дюжина сотрудников знает китайский на уровне HSK 6.', 'Четырнадцать сотрудников знают китайский язык на уровне HSK 6.', 'Тридцать сотрудников знают китайский язык на уровне HSK 6.',
      'Три-четыре сотрудника знают китайский язык на уровне HSK 6.', '3–4 сотрудника знают китайский язык на уровне HSK 6.',
      // owner, 2026-11-18: withdrawn — the round-3 sentences that put the four at HSK 6 level
      'У нас есть четыре сотрудника, которые знают китайский язык на уровне HSK 6.', 'В GSR Logistics четыре сотрудника, которые знают китайский язык на уровне HSK 6: трое работают в Ташкенте, один — в Иу.',
      'Каждую оптовую закупку ведёт один из четырёх сотрудников, которые знают китайский язык на уровне HSK 6: трое работают в Ташкенте, один — в Иу.', 'Четверо наших сотрудников знают китайский язык на уровне HSK 6: три сотрудника работают в Ташкенте, один сотрудник — в Иу.',
      'Китайский язык на уровне HSK 6 знают 4 сотрудника: 3 работают в Ташкенте, 1 — в Иу.', 'HSK 6 — 4 сотрудника с таким уровнем китайского', 'У фабрик и у оптовых продавцов — с четырьмя сотрудниками, знающими китайский на уровне HSK 6.',
      // … and no certificate count but two
      'Три сотрудника имеют сертификат HSK 6.', 'Все четыре сотрудника знают китайский на уровне HSK 6.', 'Один сотрудник знает китайский на уровне HSK 6.', 'У троих из них есть сертификат HSK 6.', 'HSK 6 — 4 сотрудника с этим сертификатом'],
    good: [
      // review fixes S3 (2026-11-18): counts of anything but people beside «HSK» (steps, clients, the one manager), in round-4 sentences
      'Закупка идёт в шесть шагов, а у двоих наших сотрудников есть сертификат HSK 6.', 'У GSR Logistics 400+ клиентов и четыре сотрудника, которые знают китайский язык; у двоих из них есть сертификат HSK 6.',
      
      // review fixes S2/S3 (2026-11-18): the same sentences in their round-4 form (DESIGN §14a, E of §14.8)
      'С вами работает 1 менеджер, и у нас четыре сотрудника, которые знают китайский язык; у двоих из них есть сертификат HSK 6.', 'В GSR Logistics четыре сотрудника, которые знают китайский язык: трое работают в Ташкенте, один — в Иу, и у двоих из четырёх есть официальный сертификат HSK 6.', 'Каждую оптовую закупку ведёт один из четырёх сотрудников, которые знают китайский язык: трое работают в Ташкенте, один — в Иу, а у двоих из четырёх есть сертификат HSK 6.',
      'Экзамен HSK состоит из 9 уровней.', 'Услуга 06 — Оптовые закупки', 'HSK 6 У нас есть сотрудники с таким уровнем китайского', 'С вами работает один менеджер, а сертификат HSK 6 есть у двоих наших сотрудников.',
      // owner, 2026-11-18: four know Chinese, two hold an HSK 6 certificate (DESIGN §14.8 sentence E and the page's sentences)
      'У нас четыре сотрудника, которые знают китайский язык; у двоих из них есть сертификат HSK 6.',
      'Четыре сотрудника, которые знают китайский язык, двое из них — с сертификатом HSK 6, закупают у фабрик и оптовых продавцов.', 'Двое из четырёх наших сотрудников имеют сертификат HSK 6.', 'HSK 6 — 2 сотрудника с этим сертификатом'] },
  { id: 'en.hskCount', block: true, msg: HSK_COUNT_MSG('en'),
    re: new RegExp(`${hskNearest(EN_HEADCOUNT, EN_HSK_TWO, '.!?;', '.!?;:,', EN_TWO_OF)}|${hskLevel({ level: EN_HSK_LEVEL, holder: EN_HSK_HOLDER, two: EN_HSK_TWO, stop: '.!?;', clause: '.!?;:,' })}`, 'iu'),
    bad: [
      // review fixes S3 (2026-11-18): the withdrawn predicate "at HSK 6 level" said of staff, with or without a count (DESIGN §14.1)
      'A wholesale purchase runs in six steps and employees who know Chinese at HSK 6 level work on these purchases.', 'A wholesale purchase runs in 6 steps and employees who know Chinese at HSK 6 level work on these purchases.', 'GSR Logistics has 400+ clients and employees who know Chinese at HSK 6 level.', 'We have employees who know Chinese at HSK 6 level.', 'Employees who know Chinese at HSK 6 level work on buying from factories and wholesale sellers.', 'Employees who know Chinese at HSK 6 level work on these purchases, and the goods pass customs in Tashkent.', 'You do not need an interpreter: we have employees who know Chinese at HSK 6 level.', 'No — you need neither a trip to China nor an interpreter: we have employees who know Chinese at HSK 6 level.', 'GSR Logistics has employees who know Chinese at HSK 6 level; they have experience of purchasing in China and work on buying from factories and buying wholesale from sellers.', 'Employees who know Chinese at HSK 6 level and have experience of purchasing in China work on these purchases.', 'Do I have to travel to China or hire an interpreter? No. We have employees who know Chinese at HSK 6 level.',
      'Five HSK 6 specialists work on your order.', '10+ employees know Chinese at HSK 6 level.', 'Our team of seven speaks Chinese at HSK 6 level.', 'A dozen of our people know Chinese at HSK 6 level.',
      'Five of the employees know Chinese at HSK 6 level.', '12 full-time employees know Chinese at HSK 6 level.', 'Our team of 12 HSK 6 specialists works in Yiwu and Guangzhou.', 'Six of our employees know Chinese at HSK 6 level.',
      '12 employees know Chinese at HSK 6 level.', 'Sixteen buyers on our staff know Chinese at HSK 6 level.', 'We have 5 HSK 6 level employees.',
      'We have six employees who know Chinese at HSK 6 level.', 'We have five employees who know Chinese at HSK 6 level.', 'Ten employees know Chinese at HSK 6 level.', 'More than ten employees know Chinese at HSK 6 level.',
      'A dozen employees know Chinese at HSK 6 level.', 'Dozens of our employees know Chinese at HSK 6 level.', 'More than three employees know Chinese at HSK 6 level.', 'At least four employees know Chinese at HSK 6 level.',
      '4+ employees know Chinese at HSK 6 level.', 'We have four or more employees who know Chinese at HSK 6 level.', 'Four-plus employees know Chinese at HSK 6 level.', 'Twenty-four employees know Chinese at HSK 6 level.', 'Our team of 5 knows Chinese at HSK 6 level.',
      'Three or four employees know Chinese at HSK 6 level.', '3–4 employees know Chinese at HSK 6 level.',
      // owner, 2026-11-18: withdrawn — the round-3 sentences that put the four at HSK 6 level
      'GSR Logistics has four employees who know Chinese at HSK 6 level: three work in Tashkent and one in Yiwu.', 'Every such purchase is handled by one of four employees who know Chinese at HSK 6 level: three work in Tashkent and one in Yiwu.',
      'Your purchase is handled by one of our four employees who know Chinese at HSK 6 level.', 'We have four employees who know Chinese at HSK 6 level.', 'No Chinese needed: we have four employees who know Chinese at HSK 6 level.',
      'Four employees who know Chinese at HSK 6 level buy for you from factories and wholesale sellers.', 'Wholesale buying in China for businesses in Uzbekistan: four employees who know Chinese at HSK 6 level buy from factories and wholesale sellers for you.',
      'every wholesale purchase is handled by one of four employees who know Chinese at HSK 6 level (three in Tashkent, one in Yiwu)', 'HSK 6 — 4 employees with this level of Chinese', 'Three employees who know Chinese at HSK 6 level work in Tashkent and one works in Yiwu.',
      // … and no certificate count but two
      'All four employees hold an HSK 6 certificate.', 'Three of them hold an HSK 6 certificate.', 'One employee holds an HSK 6 certificate.', 'HSK 6 — 4 employees with this certificate', 'More than two employees hold an HSK 6 certificate.', '2–3 employees hold an HSK 6 certificate.', 'Two or three employees hold an HSK 6 certificate.'],
    good: [
      // review fixes S3 (2026-11-18): counts of anything but people beside «HSK» (steps, clients, the one manager), in round-4 sentences
      'A wholesale purchase runs in six steps, and two of our employees hold an HSK 6 certificate.', 'GSR Logistics has 400+ clients and four employees who know Chinese; two of them hold an HSK 6 certificate.', 'You work with 1 manager, and two of our four employees hold an HSK 6 certificate.',
      
      // review fixes S2/S3 (2026-11-18): the same sentences in their round-4 form (DESIGN §14a, E of §14.8)
      'GSR Logistics has four employees who know Chinese: three work in Tashkent and one in Yiwu, and two of the four hold an official HSK 6 certificate.', 'Every wholesale purchase is handled by one of four employees who know Chinese: three work in Tashkent and one in Yiwu, and two of the four hold an HSK 6 certificate.',
      'The HSK test has 9 levels.', 'Service 06 — Wholesale buying', 'HSK 6 We have employees at this level of Chinese', 'You work with one manager, and two of our employees hold an HSK 6 certificate.',
      // owner, 2026-11-18: four know Chinese, two hold an HSK 6 certificate (DESIGN §14.8 sentence E; W/drafts/page.en.json, extras.en.json)
      'We have four employees who know Chinese; two of them hold an HSK 6 certificate.',
      'Your wholesale purchase is handled by one of our four employees who know Chinese; two of them hold an HSK 6 certificate.',
      'Wholesale buying in China for businesses in Uzbekistan: employees who know Chinese, two with an HSK 6 certificate, buy from factories and wholesale sellers.',
      'Four employees who know Chinese, two with an HSK 6 certificate, buy from factories and sellers.', '06 Wholesale buying in China Four employees who know Chinese, two with an HSK 6 certificate, buy from factories and sellers. commission 1–3%',
      'No Chinese needed: we have four employees who know Chinese, and two of them hold an HSK 6 certificate.', 'HSK 6 — 2 employees with this certificate',
      'Two of our four employees hold an official HSK 6 certificate.',
      // the master as it stands at 15:06 (W/drafts/page.en.json, extras.en.json)
      'What is an HSK 6 certificate, and how many of your employees hold one?', 'HSK 6 — Certificate held by 2 of our employees', 'Four employees who know Chinese buy from factories and sellers; two hold an HSK 6 certificate.',
      'GSR Logistics has four employees who know Chinese — three work in Tashkent and one in Yiwu — and two of the four hold an official HSK 6 certificate.',
      'every wholesale purchase is handled by one of four employees who know Chinese, two of whom hold an HSK 6 certificate (three of the four work in Tashkent, one in Yiwu)'] },
  { id: 'zh.hskCount', block: true, msg: HSK_COUNT_MSG('zh'),
    re: new RegExp(`${hskNearest(ZH_HEADCOUNT, ZH_HSK_TWO, ZH_STOP, `${ZH_STOP}，,：:`)}|${hskLevel({ level: ZH_HSK_LEVEL, holder: ZH_HSK_HOLDER, two: ZH_HSK_TWO, stop: ZH_STOP, clause: `${ZH_STOP}，,：:` })}`, 'iu'),
    bad: [
      // review fixes S3 (2026-11-18): the withdrawn predicate "at HSK 6 level" said of staff, with or without a count (DESIGN §14.1)
      '三项服务由 1 位客户经理负责，我们有中文达到 HSK 6 级水平的员工。', '中文达到 HSK 6 级水平的员工在 3 个工作日内由经理回复您。', '多位卖家的货物集中到义乌仓库，中文达到 HSK 6 级水平的员工从事这些采购工作。', 'GSR Logistics 有 400+ 客户，也有中文达到 HSK 6 级水平的员工。', '我们有中文达到 HSK 6 级水平的员工。', '中文达到 HSK 6 级水平的员工从事向工厂和批发商户采购的工作。', '您无需持有中国银行卡，我们有中文达到 HSK 6 级水平的员工。', '中文达到 HSK 6 级水平的员工从事这些采购工作，客户经理通过 Telegram 与您联系。', '我们核查工厂资质，中文达到 HSK 6 级水平的员工从事这些采购工作。', '不需要亲自去中国，也不用请翻译：我们有中文达到 HSK 6 级水平的员工。', '您无需聘请翻译，我们有中文达到 HSK 6 级水平的员工。', 'GSR Logistics 有中文达到 HSK 6 级水平的员工；他们有在中国采购的经验，从事向工厂采购和向卖家批量采购的工作。', '需要亲自去中国或请翻译吗？不需要。我们有中文达到 HSK 6 级水平的员工。',
      '我们有十多名中文达到 HSK 6 级水平的员工。', '6 名员工中文达到 HSK 6 级水平。', '一支 5 人的 HSK 6 级采购团队。', '10 多名员工中文达到 HSK 6 级水平。', '10+ 名员工中文达到 HSK 6 级水平。', '我们的七人团队中文达到 HSK 6 级水平。', '多名员工中文达到 HSK 6 级水平。', 'HSK 6 级员工共 5 人。',
      '12 名 HSK 6 级专员常驻义乌和广州。', '我们有六名员工中文达到 HSK 6 级水平。', '我们有 5 名中文达到 HSK 6 级水平的员工。',
      '我们有五名中文达到 HSK 6 级水平的员工。', '我们有 10 名中文达到 HSK 6 级水平的员工。', '超过三名员工的中文达到 HSK 6 级水平。', '至少四名员工的中文达到 HSK 6 级水平。', '四名以上员工的中文达到 HSK 6 级水平。', '4 名以上员工的中文达到 HSK 6 级水平。', '十四名员工的中文达到 HSK 6 级水平。', '十一名员工的中文达到 HSK 6 级水平。',
      '数十名员工的中文达到 HSK 6 级水平。', '3–4 名员工的中文达到 HSK 6 级水平。', '三到四名员工的中文达到 HSK 6 级水平。',
      // owner, 2026-11-18: withdrawn — the round-3 sentences that put the four at HSK 6 level
      '我们有四名中文达到 HSK 6 级水平的员工。', '我们有四位中文达到 HSK 6 级水平的员工。', 'GSR Logistics 有四名中文达到 HSK 6 级水平的员工：三名在塔什干工作，一名在义乌工作。', '每一笔批发采购都由四名中文达到 HSK 6 级水平的员工之一负责：其中三名员工在塔什干，一名员工在义乌。', '4 名员工的中文达到 HSK 6 级水平：3 名在塔什干工作，1 名在义乌工作。',
      'HSK 6 — 4 名员工达到这一中文水平', '四名中文达到 HSK 6 级水平的员工为您向工厂和批发商户采购。',
      // … and no certificate count but two
      '四名员工均持有 HSK 6 级证书。', '其中三名持有 HSK 6 级证书。', '一名员工持有 HSK 6 级证书。', '超过两名员工持有 HSK 6 级证书。', '两到三名员工持有 HSK 6 级证书。'],
    good: [
      // review fixes S3 (2026-11-18): counts of anything but people beside «HSK» (steps, clients, the one manager), in round-4 sentences
      '多位卖家的货物集中到义乌仓库；我们有四名懂中文的员工，其中两名持有 HSK 6 级证书。', 'GSR Logistics 有 400+ 客户，也有四名懂中文的员工，其中两名持有 HSK 6 级证书。',
      
      // review fixes S2/S3 (2026-11-18): the same sentences in their round-4 form (DESIGN §14a, E of §14.8)
      '三项服务由 1 位客户经理负责，我们有四名懂中文的员工，其中两名持有 HSK 6 级证书。', 'GSR Logistics 有四名懂中文的员工：三名在塔什干工作，一名在义乌工作；四人中有两名持有 HSK 6 级官方证书。', '每一笔批发采购都由四名懂中文的员工之一负责：三名在塔什干工作，一名在义乌工作；四人中有两名持有 HSK 6 级证书。',
      'HSK 考试共分 9 个等级。', '一个订单经过 4 个阶段。', '服务 06 — 批发代采购', '三项服务由一位客户经理负责，其中两名员工持有 HSK 6 级证书。',
      // owner, 2026-11-18: four know Chinese, two hold an HSK 6 certificate (DESIGN §14.8 sentence E and the page's sentences)
      '我们有四名懂中文的员工，其中两名持有 HSK 6 级证书。', '懂中文的员工（其中两名持有 HSK 6 级证书）为您向工厂和批发商户采购。',
      '四名员工中有两名持有 HSK 6 级证书。', 'HSK 6 — 2 名员工持有该证书'] },
  { id: 'fa.hskCount', block: true, msg: HSK_COUNT_MSG('fa'),
    re: new RegExp(`${hskNearest(FA_HEADCOUNT, FA_HSK_TWO, `${FA_STOP}؛;`, `${FA_STOP}؛;،,:`, FA_TWO_OF)}|${hskLevel({ level: FA_HSK_LEVEL, holder: FA_HSK_HOLDER, two: FA_HSK_TWO, stop: `${FA_STOP}؛;`, clause: `${FA_STOP}؛;،,:` })}`, 'iu'),
    bad: [
      // review fixes S3 (2026-11-18): the withdrawn predicate "at HSK 6 level" said of staff, with or without a count (DESIGN §14.1)
      'با ۱ کارشناس کار می‌کنید و کارمندانی داریم که زبان چینی را در سطح HSK 6 می‌دانند.', 'کارمندانی داریم که زبان چینی را در سطح HSK 6 می‌دانند.', 'کارمندانی که زبان چینی را در سطح HSK 6 می‌دانند، در خرید از کارخانه‌ها و فروشندگان عمده کار می‌کنند.', 'GSR Logistics کارمندانی دارد که زبان چینی را در سطح HSK 6 می‌دانند.', 'به مترجم نیاز ندارید: کارمندانی داریم که چینی را در سطح HSK 6 می‌دانند.', 'در GSR Logistics کارمندانی هستند که زبان چینی را در سطح HSK 6 می‌دانند؛ آنان تجربهٔ خرید در چین دارند و در خرید از کارخانه‌ها و خرید عمده از فروشندگان کار می‌کنند.', 'آیا باید به چین سفر کنم یا مترجم بگیرم؟ خیر. کارمندانی داریم که زبان چینی را در سطح HSK 6 می‌دانند.',
      '۵ کارمند ما زبان چینی را در سطح HSK 6 می‌دانند.', 'تیم هفت‌نفرهٔ ما زبان چینی را در سطح HSK 6 می‌داند.', 'دوازده کارمند ما زبان چینی را در سطح HSK 6 می‌دانند.', '۱۲ کارشناس با سطح HSK 6 در ییوو و گوانگجو کار می‌کنند.',
      'شش کارمند ما زبان چینی را در سطح HSK 6 می‌دانند.',
      'پنج کارمند داریم که زبان چینی را در سطح HSK 6 می‌دانند.', '۱۰ کارمند داریم که زبان چینی را در سطح HSK 6 می‌دانند.', 'بیش از سه کارمند ما زبان چینی را در سطح HSK 6 می‌دانند.', 'دست‌کم چهار کارمند ما زبان چینی را در سطح HSK 6 می‌دانند.',
      'بیست و چهار کارمند ما زبان چینی را در سطح HSK 6 می‌دانند.', 'ده‌ها کارمند ما زبان چینی را در سطح HSK 6 می‌دانند.', 'چهار کارمند یا بیشتر زبان چینی را در سطح HSK 6 می‌دانند.', '+۴ کارمند زبان چینی را در سطح HSK 6 می‌دانند.', 'سه یا چهار کارمند زبان چینی را در سطح HSK 6 می‌دانند.',
      // owner, 2026-11-18: withdrawn — the round-3 sentences that put the four at HSK 6 level
      'چهار کارمند داریم که زبان چینی را در سطح HSK 6 می‌دانند.', 'GSR Logistics چهار کارمند دارد که زبان چینی را در سطح HSK 6 می‌دانند: سه نفر در تاشکند و یک نفر در ییوو کار می‌کنند.', 'هر خرید عمده را یکی از چهار کارمندی انجام می‌دهد که زبان چینی را در سطح HSK 6 می‌دانند.',
      '۳ کارمند در تاشکند و ۱ کارمند در ییوو زبان چینی را در سطح HSK 6 می‌دانند.', 'HSK 6 — ۴ کارمند با این سطح زبان چینی', 'چهار کارمندی که چینی را در سطح HSK 6 می‌دانند، از کارخانه‌ها و فروشندگان عمده برای شما می‌خرند.',
      // … and no certificate count but two
      'همهٔ چهار کارمند ما گواهی HSK 6 دارند.', 'سه نفر از آنان گواهی HSK 6 دارند.', 'یک کارمند گواهی HSK 6 دارد.', 'بیش از دو کارمند گواهی HSK 6 دارند.', 'دو یا سه کارمند گواهی HSK 6 دارند.'],
    good: [
      // review fixes S2/S3 (2026-11-18): the same sentences in their round-4 form (DESIGN §14a, E of §14.8)
      'با ۱ کارشناس کار می‌کنید و چهار کارمند داریم که زبان چینی می‌دانند؛ دو نفر از آنان گواهی HSK 6 دارند.', 'GSR Logistics چهار کارمند دارد که زبان چینی می‌دانند: سه نفر در تاشکند و یک نفر در ییوو کار می‌کنند و دو نفر از این چهار نفر گواهی رسمی HSK 6 دارند.',
      'HSK آزمون بین‌المللی سنجش زبان چینی است؛ HSK 6 سطح ششم آن است.', 'آزمون HSK نه سطح دارد.', 'خدمت ۰۶ — خرید عمده', 'با یک کارشناس کار می‌کنید و دو نفر از کارمندان ما گواهی HSK 6 دارند.',
      // owner, 2026-11-18: four know Chinese, two hold an HSK 6 certificate (DESIGN §14.8 sentence E and the page's sentences)
      'چهار کارمند داریم که زبان چینی می‌دانند؛ دو نفر از آنان گواهی HSK 6 دارند.', 'هر خرید عمده را یکی از چهار کارمندی انجام می‌دهد که زبان چینی می‌دانند؛ دو نفر از آنان گواهی HSK 6 دارند.', 'کارمندانی که زبان چینی می‌دانند و دو نفر از آنان گواهی HSK 6 دارند، از کارخانه‌ها و فروشندگان عمده برای شما خرید می‌کنند.',
      'دو نفر از چهار کارمند ما گواهی HSK 6 دارند.', 'HSK 6 — ۲ کارمند با این گواهی'] },

  /* — wholesale buying: no result is promised — not the best or the cheapest price, no guaranteed quality, no "100%", no "no risk" — */
  { id: 'uz.pricePromise', msg: PROMISE_MSG('uz'),
    re: new RegExp(`${UZ_PROMISE}|${UZC_PROMISE}`, 'iu'),
    bad: ['Eng arzon narxlar bizda.', 'Eng arzon narxlarni Pinduoduoda topib beramiz.', 'Xitoydan risksiz xarid.', '100 foiz kafolat beramiz.', 'Narxlarimiz eng arzon.', 'Hech qanday risk yoʻq.', 'Sifat kafolati — bizning zimmamizda.', 'Narxlarimiz eng past.', 'Eng arzon narx biz uchun muammo emas.', 'Sifatni kafolatlaymizmi? Albatta!', 'Eng yaxshi narxni kafolatlay olamiz.', 'Eng yaxshi narxni kafolatlaymiz.', 'Eng arzon narxda zavoddan toʻgʻridan-toʻgʻri olib beramiz, vositachisiz.', '100% sifat kafolati, xaridor uchun xavf yoʻq.', 'Sifat kafolati bilan ishlaymiz.', 'Tovar sifatiga kafolat beramiz.', 'Энг яхши нархни кафолатлаймиз.', 'Товар сифатига кафолат берамиз.'],
    good: ['Uchala platformadan eng arzon narxlar Pinduoduoda, lekin sifat partiyadan partiyaga farq qiladi.', 'Учала платформадан энг арзон нархлар Pinduoduo-да, лекин сифат партиядан партияга фарқ қилади.', 'Uchala platformadan Pinduoduoda narxlar eng past, lekin sifat partiyadan partiyaga farq qiladi.', 'Zavodning sifat kafolati odatda 12 oy.', 'Заводнинг сифат кафолати одатда 12 ой.', 'Sifatni kafolatlamaymiz: tovarni Ivu omborida tekshiramiz.', 'Tovar sifatini kafolatlay olmaymiz: uni Ivu omborida tekshiramiz.', 'Narxni kafolatlamaymiz: narxni zavod yoki sotuvchi belgilaydi.', 'Hech kim sizga Xitoydagi eng yaxshi narxni kafolatlay olmaydi.', 'Eng arzon narx har doim ham eng yaxshi tanlov emas: material, minimal partiya va ishlab chiqarish muddatini ham solishtiring.', 'Namuna butun partiya sifatini kafolatlaydimi? Yoʻq. Namuna material va ishlov sifatini koʻrsatadi.', 'Сифатни кафолатламаймиз: товарни Иву омборида текширамиз.', 'Eng past narxni vaʼda qilmaymiz.', 'Eng arzon narxni vaʼda qilmaymiz.', 'Энг арзон нархни ваъда қилмаймиз.', 'Tovar sifatiga kafolat bermaymiz.', 'Komissiya buyurtma summasining 3% dan.',
      // sentences the site prints today
      'Rasmda koʻrinadigan eng past narx — eng katta partiya uchun.', '«Bojsiz», «100% kafolat», «eng tez» degan gaplarni aytmaymiz.', 'Namuna — eng arzon sugʻurta.', 'bojxona toʻlovlari taʼminotini (kafolatni) rasmiylashtirishda yordam beramiz'] },
  { id: 'ru.pricePromise', msg: PROMISE_MSG('ru'),
    re: new RegExp(RU_PROMISE, 'iu'),
    bad: ['Самые дешёвые цены на Pinduoduo — у нас.', 'Самые дешёвые цены — у нас.', 'Гарантируем вам самую низкую цену.', 'Работаем с гарантией качества.', 'Закупка в Китае без рисков.', 'Стопроцентная гарантия.', 'Гарантия качества от нашей компании.', 'Наши цены — самые низкие.', 'У нас самые низкие цены.', 'Гарантируем ли мы качество? Да!', 'Лучшая цена — не мечта: мы её гарантируем.', 'Гарантировать качество мы можем и гарантируем.', 'Лучшая цена — и вы не будете переплачивать.', 'Гарантируем качество — вы не можете ошибиться.', 'Лучшая цена: никто не предложит ниже.', 'Гарантия качества: мы не даём браку пройти.', 'У нас лучше цены, чем у конкурентов.', 'Гарантируем ли мы качество? Нет проблем!', 'Гарантируем лучшую цену от фабрики.', 'Вы получаете самую выгодную цену в Китае, без посредников.', '100% гарантия качества, никакого риска для покупателя.', 'Качество товара гарантировано.'],
    good: ['Из трёх площадок самые дешёвые цены — на Pinduoduo, но качество меняется от партии к партии.', 'Из трёх площадок самые низкие цены — на Pinduoduo, но качество меняется от партии к партии.', 'Завод обычно даёт 12 месяцев гарантии.', 'Заводская гарантия качества — обычно 12 месяцев.', 'Гарантия качества от завода — обычно 12 месяцев.', 'Мы не обещаем, что найдём для вас самую выгодную цену в Китае: показываем каждое предложение, выбор за вами.', 'Лучшую цену в Китае вам никто честно не пообещает.', 'Гарантировать качество чужого товара мы не можем — мы его проверяем на складе в Иу.', 'Гарантии качества не даём: товар проверяем на складе в Иу.', 'Закупок без риска не бывает; образец и проверка риск снижают.', 'Чем больше партия, тем лучше цена: минимальную партию каждый продавец устанавливает сам.', 'Гарантирует ли образец качество всей партии? Нет. Образец показывает материал и работу.', 'Самую низкую цену не обещаем.', 'Лучшую цену не обещаем.', 'Качество не гарантируем: товар проверяем на складе.', 'Комиссия — от 3% суммы заказа.',
      'Самая низкая цена на картинке — для самой большой партии.', 'Образец — самая дешёвая страховка.', 'помогаем оформить обеспечение уплаты таможенных платежей (гарантию)'] },
  { id: 'en.pricePromise', msg: PROMISE_MSG('en'),
    re: new RegExp(EN_PROMISE, 'iu'),
    bad: ['Risk-free wholesale buying in China.', 'We give a quality guarantee on every factory order.', 'The factory’s quality guarantee is our promise too.', 'Our quality guarantee lasts 12 months.', 'We have the cheapest prices on Pinduoduo.', 'On Pinduoduo we always get you the cheapest price.', 'We guarantee that you get the lowest price.', 'Our prices are the cheapest.', 'Our prices are the lowest.', 'The lowest prices, guaranteed.', 'Do we guarantee quality? Yes, we do.', 'The best price is not a problem for us.', 'Our offer can’t be beaten: the best price in China.', 'Neither a trip nor a deposit: we guarantee the best price.', 'We do not charge for the search, and you always get the cheapest price.', 'Do we guarantee quality? No doubt!', 'We guarantee the best price from the factory.', 'You get the cheapest price in China, with no middlemen.', '100% quality guarantee, no risk for the buyer.', 'Factory prices guaranteed.'],
    good: ['There is no risk-free purchase: order a sample first.', 'The factory’s quality guarantee (warranty) usually lasts 12 months.', 'A quality guarantee from the factory usually lasts 12 months.', 'Pinduoduo has the cheapest prices of the three platforms, but quality varies from batch to batch.', 'Pinduoduo’s prices are the lowest of the three platforms, but quality varies from batch to batch.', 'We never promise that you will get the cheapest price: you see every offer and choose yourself.', 'Nobody can honestly promise you the cheapest price in China.', 'No one can guarantee the quality of goods that nobody has checked — that is what the sample is for.', 'We give no price guarantee: the price is the factory’s or the seller’s.', 'We can’t guarantee the best price, and we do not say we can.', 'No purchase is risk-free; a sample and an inspection lower the risk.', 'The cheapest price is not always the best choice: compare the material, the minimum and the production time.', 'Does a sample guarantee the quality of the whole batch? No. A sample shows the material and the workmanship.', 'Do you guarantee the lowest price?', 'We do not promise the lowest price.', 'We do not promise the best price in China.', 'Commission from 3% of the order value.',
      'The lowest price shown in the listing is for the largest batch.', 'A sample is the cheapest insurance.', 'Air is the best option for samples.', 'help with security for customs payments'] },
  { id: 'zh.pricePromise', msg: PROMISE_MSG('zh'),
    re: new RegExp(ZH_PROMISE, 'iu'),
    bad: ['为您找到最好的价格。', '我们保证货物质量。', '保证给您最低的价格。', '百分之百保证。', '我们的价格最便宜。', '品质有保障。', '质量保证，价格实惠。', '我们的价格最低。', '最便宜的价格并不难：我们帮您拿到。', '我们保证质量吗？当然！', '我们保证质量吗？不难！', '最便宜的价格别人做不到，我们可以。', '保证质量不一定要多花钱。', '我们保证拿到工厂最低价。', '保证质量，假一赔十。', '您能拿到全中国最便宜的价格，没有中间商。', '100% 质量保证，买家零风险。', '品质有保证，请放心下单。'],
    good: ['三个平台中拼多多的价格最便宜，但每批货的质量不一样。', '寄样品，空运是最好的选择。', '工厂通常提供 12 个月质保。', '质量保证期通常为 12 个月；质保期内损坏的零件由工厂免费寄出。', '合同可约定质量保证金，在验收后支付。', '最便宜的价格我们不承诺，但每一份报价都会发给您，由您选择。', '质量保证我们给不了，我们能做的是到货查验。', '最便宜的价格不一定是最好的选择：还要比较材料、起订量和生产周期。', '样品能保证质量吗？不能。样品体现的是材料和做工。', '我们不承诺最低价。', '我们不承诺全中国最便宜的价格。', '我们不保证品质。', '佣金为订单金额的 3% 起。',
      '商品页上标出的最低价，对应的是最大批量。', '样品是最便宜的保险', '我们从不说“免税”、“100%保证”或“最快”。'] },
  { id: 'fa.pricePromise', msg: PROMISE_MSG('fa'),
    re: new RegExp(FA_PROMISE, 'iu'),
    bad: ['بدون هیچ ریسکی برای خریدار.', 'ارزان‌ترین قیمت‌ها نزد ما است.', 'ارزان‌ترین قیمت را در پین‌دودو برای شما پیدا می‌کنیم.', 'پایین‌ترین قیمت را برای شما تضمین می‌کنیم.', 'تضمین ۱۰۰٪ کیفیت برای هر سفارش.', 'کیفیت را ضمانت می‌کنیم.', 'صددرصد تضمینی.', 'قیمت‌های ما ارزان‌ترین است.', 'هیچ ریسکی ندارد.', 'تضمین کیفیت کارخانه‌ای برای هر سفارش.', 'قیمت‌های ما پایین‌ترین است.', 'آیا کیفیت را تضمین می‌کنیم؟ بله!', 'نمی‌توانید رد کنید: بهترین قیمت را تضمین می‌کنیم.', 'هیچ‌کس مثل ما نیست: بهترین قیمت را می‌گیریم.', 'رقیب نمی‌تواند: بهترین قیمت را ما می‌دهیم.', 'بهترین قیمت کارخانه را تضمین می‌کنیم.', 'ارزان‌ترین قیمت چین را بدون واسطه می‌گیرید.', '۱۰۰٪ تضمین کیفیت، بدون ریسک برای خریدار.'],
    good: ['از میان سه پلتفرم، ارزان‌ترین قیمت‌ها در پین‌دودو است، اما کیفیت از محموله‌ای به محمولهٔ دیگر فرق می‌کند.', 'از میان سه پلتفرم، پایین‌ترین قیمت‌ها در پین‌دودو است، اما کیفیت از محموله‌ای به محمولهٔ دیگر فرق می‌کند.', 'کارخانه‌ها معمولاً ۱۲ ماه ضمانت می‌دهند.', 'تضمین کیفیت کارخانه معمولاً ۱۲ ماه است.', 'هیچ‌کس نمی‌تواند ارزان‌ترین قیمت چین را به شما قول بدهد.', 'نمی‌توانیم کیفیت را تضمین کنیم؛ کالا را در انبار ییوو بررسی می‌کنیم.', 'آیا نمونه کیفیت را تضمین می‌کند؟ خیر. نمونه جنس و ساخت را نشان می‌دهد.', 'پایین‌ترین قیمت را وعده نمی‌دهیم.', 'ارزان‌ترین قیمت چین را وعده نمی‌دهیم.', 'کارمزد از ۳٪ ارزش سفارش.',
      'پین‌دودو پایین‌ترین قیمت‌های خرده‌فروشی را دارد، اما کیفیت متفاوت است.', 'بهترین گزینه برای نمونه‌ها', 'تضمین پرداخت‌های گمرکی'] },

  /* — wholesale buying: no factory visit as part of the service — owner, 2026-11-18: our employee in China goes to the factory only if the client wants, for an additional fee — */
  { id: 'uz.factoryVisit', msg: VISIT_MSG('uz'),
    re: new RegExp(UZ_VISIT_CLAIM, 'iu'),
    bad: ['Xitoyga borish ham shart emas: namuna va zavod tekshiruvini Ivudagi xodimlarimiz qiladi.', 'Хитойга бориш ҳам шарт эмас: намуна ва завод текширувини Ивудаги ходимларимиз қилади.', 'Xodimlarimiz har bir zavodga borib, tovarni joyida tekshiradi.', 'Zavodga oʻzimiz boramiz va ishlab chiqarishni koʻramiz.', 'Ivudagi xodimimiz zavodga tashrif buyuradi.', 'Zavodni joyida tekshiramiz.', 'Har bir buyurtmada xodimimiz zavodga boradi.', 'Zavodga tashrif xizmatga kiradi.', 'Xitoydagi xodimimizni zavodga yuboramiz.',
      'Ходимларимиз ҳар бир заводга бориб, товарни жойида текширади.', 'Заводга ташриф хизматга киради.', 'Заводни жойида текширамиз.'],
    good: ['Xitoyga borish ham shart emas: namuna Ivu omborida qabul qilinadi va suratga olinadi, zavodlar bilan esa ularga bormasdan muzokara olib boramiz; xohlasangiz, Xitoydagi xodimimiz alohida kelishiladigan qoʻshimcha toʻlov evaziga zavodga bora oladi.', 'Zavodga tashrif xizmatga kirmaydi: xodimlarimiz zavodlar bilan u yerga bormasdan muzokara olib boradi.', 'Xohlasangiz, qoʻshimcha toʻlov evaziga Xitoydagi xodimimizni zavodga yuborishimiz mumkin; toʻlov alohida kelishiladi.',
      'Заводга ташриф хизматга кирмайди: ходимларимиз заводлар билан у ерга бормасдан музокара олиб боради.', 'Хоҳласангиз, қўшимча тўлов эвазига Хитойдаги ходимимизни заводга юборишимиз мумкин; тўлов алоҳида келишилади.',
      // published (sourcing, equipment, guides): a visit if needed, the client's own visit, a check on paper
      '2–3 ta ishlab chiqaruvchini narxi, MOQ (minimal partiya) va ishlab chiqarish muddati bilan taqqoslab beramiz, namuna buyurtma qilamiz, kerak boʻlsa zavodga boramiz.',
      'Video-qoʻngʻiroq bepul; tashrifni oʻzimiz uyushtiramiz — siz ham bora olasiz, xodimimiz tarjima qiladi.',
      'Zavodga oʻzim borib koʻrsam boʻladimi?', 'Ha. Tashrifni biz uyushtiramiz: zavod bilan kelishuv, kutib olish, tarjimon-xodim.', 'Zavodni tekshiramiz, sotib olamiz, yogʻoch yashikka joylab Toshkentga olib kelamiz.',
      'Zavod auditi. Katta buyurtma oldidan sexni koʻring: video-qoʻngʻiroq, oʻz xodimingiz yoki uchinchi tomon inspeksiyasi tashrifi.', 'Kerak boʻlsa, oʻxshash sexni koʻrib, topshiriqni birga tuzamiz.'] },
  { id: 'ru.factoryVisit', msg: VISIT_MSG('ru'),
    re: new RegExp(RU_VISIT_CLAIM, 'iu'),
    bad: ['Ехать в Китай тоже не нужно: образцы и проверку фабрики делают наши сотрудники в Иу.', 'Наши сотрудники выезжают на каждую фабрику и проверяют товар на месте.', 'Мы выезжаем на фабрику перед каждым заказом.', 'Наш сотрудник в Иу посещает фабрики.', 'Проверяем фабрику на месте.', 'Выезд на фабрику входит в услугу.', 'Отправим нашего сотрудника на фабрику.', 'Мы сами ездим на заводы и смотрим производство.'],
    good: ['Ехать в Китай тоже не нужно: образцы принимают и фотографируют на складе в Иу, а переговоры с фабриками мы ведём, не выезжая к ним; если вам нужен выезд на фабрику, туда может съездить наш сотрудник в Китае за дополнительную плату, которую согласуем отдельно.', 'Выезд на фабрику не входит в услугу: наши сотрудники ведут переговоры с фабриками, не выезжая к ним.', 'Если хотите, за дополнительную плату отправим нашего сотрудника в Китае на фабрику; сумма согласуется отдельно.',
      // published (sourcing, equipment, guides): a visit if needed, the client's own visit, a check on paper
      'По описанию или образцу сравниваем 2–3 производителей по цене, MOQ (минимальной партии) и сроку производства, заказываем образцы, при необходимости выезжаем на фабрику.',
      'Видеозвонок — бесплатно; визит организуем сами — вы тоже можете поехать, наш сотрудник переводит.', 'Да. Визит организуем мы: договорённость с заводом, встреча, сотрудник-переводчик.', 'Могу ли я сам поехать на завод?',
      'Проверка. Бизнес-лицензия, право на экспорт, статус на платформе; при необходимости видеозвонок или визит на фабрику.', 'Благодаря этому вы, не выезжая в Китай, получаете фотоотчёт.',
      'Перед заказом на фабрике проверяем её бизнес-лицензию, производственные мощности и экспортный опыт.'] },
  { id: 'en.factoryVisit', msg: VISIT_MSG('en'),
    re: new RegExp(EN_VISIT_CLAIM, 'iu'),
    bad: ['You do not need to travel to China either: samples and factory checks are done by our staff in Yiwu.', 'Our employees visit every factory before the order.', 'We visit the factory and check the goods ourselves.', 'Our employee in Yiwu goes to the factory for every order.', 'We inspect the factory on site.', 'A factory visit is included in the service.', 'Visits to the factory are part of the service.', 'We send our employee in China to the factory.',
      'GSR Logistics staff travel to factories across China.', 'We order samples and visit the factory.', 'Our buyers audit the factory in person.'],
    good: ['You do not need to travel to China either: samples are received and photographed at the Yiwu warehouse, and we negotiate with factories without travelling there; if you want a visit to the factory, our employee in China can go there for an additional fee, agreed separately.', 'A visit to the factory is not part of the service: our employees negotiate with factories without travelling there.', 'If you want, we can send our employee in China to the factory for an additional fee, agreed separately.',
      'If you want a visit to the factory, our employee in China can go there for an additional fee, agreed separately.', 'Our employees negotiate with the factory without travelling there; if you want, we can send our employee in China to the factory for an additional fee, agreed separately.',
      'the employees negotiate with factories without visiting them, and on request an employee in China can be sent to the factory for an additional fee',
      // published (sourcing, equipment, guides): a visit if needed, the client's own visit, a check on paper
      'From a description or a sample we compare 2–3 manufacturers by price, MOQ and production lead time, order samples and, if needed, visit the factory.',
      'A video call is free; we organise a visit ourselves — you can come along, our staff interpret.',
      'Can I visit the factory myself?', 'Yes. We organise the visit: arrangements with the factory, pick-up, an interpreting staff member.',
      'Factory audit. Before a large order, see the workshop: a video call (machines, warehouse, QC station), a visit by your own staff or a third-party inspection.',
      'The “Verified Supplier” badge on Alibaba means a third party (SGS, TÜV, Intertek) inspected the factory on site.', 'Before a factory order we check the factory’s business licence, production capacity and export record.',
      'The commission starts at 3% of the order value; complex searches with a factory audit go up to 5%.'] },
  { id: 'zh.factoryVisit', msg: VISIT_MSG('zh'),
    re: new RegExp(ZH_VISIT_CLAIM, 'iu'),
    bad: ['您也不必亲自去中国：样品和验厂由我们在义乌的员工负责。', '您也不必亲自去中国：样品和验厂由我们在义乌的工作人员完成。', '我们的员工会亲自到工厂验货。', '我们每次下单前都实地验厂。', '我们在义乌的员工走访每一家工厂。', '实地验厂包含在服务中。', '我们会派员工前往工厂。', '我们亲自考察工厂。'],
    good: ['您也不必亲自去中国：样品在义乌仓库接收并拍照，我们与工厂洽谈，无需前往工厂；如您希望安排实地走访工厂，我们在中国的员工可以前往，需另行付费，金额单独商定。', '到工厂实地考察不属于本服务：我们的员工与工厂洽谈，无需前往工厂。', '如果您希望，我们可以派我们在中国的员工前往工厂，另行收费，费用单独商定。',
      // published (sourcing, equipment, guides): a visit if needed, the client's own visit, a check on paper
      '根据描述或样品，我们按价格、起订量（MOQ）和生产周期比较 2–3 家厂家，订购样品，必要时实地验厂。', '200–500 kg 的机器可以走拼货运输：我们验厂、采购、打木箱并运到塔什干。',
      '视频通话免费；实地考察由我们安排——您可以同行，由我们的员工担任翻译。', '我可以亲自去工厂考察吗？', '验厂。下大单之前，先看看车间：视频通话、由您自己的人实地走访，或委托第三方检验。'] },
  { id: 'fa.factoryVisit', msg: VISIT_MSG('fa'),
    re: new RegExp(FA_VISIT_CLAIM, 'iu'),
    bad: ['از کارخانه بازدید می‌کنیم و نمونه را بررسی می‌کنیم.', 'لازم هم نیست به چین سفر کنید: تهیهٔ نمونه و بررسی کارخانه را کارکنان ما در ییوو انجام می‌دهند.', 'کارمندان ما پیش از هر سفارش از کارخانه بازدید می‌کنند.', 'ما به کارخانه می‌رویم و کالا را بررسی می‌کنیم.', 'کارخانه را در محل بازرسی می‌کنیم.', 'بازدید از کارخانه جزو خدمت است.', 'کارمندمان در چین را به کارخانه می‌فرستیم.'],
    good: ['لازم هم نیست به چین سفر کنید: نمونه‌ها را در انبار ییوو تحویل می‌گیریم و از آن‌ها عکس می‌گیریم، و بی‌آنکه به کارخانه‌ها برویم، با آن‌ها مذاکره می‌کنیم؛ اگر بازدید از کارخانه را بخواهید، کارمند ما در چین می‌تواند با هزینه‌ای اضافی که جداگانه توافق می‌شود به آنجا برود.', 'بازدید از کارخانه جزو خدمت نیست: کارمندان ما بدون رفتن به کارخانه با آن مذاکره می‌کنند.', 'اگر بخواهید، می‌توانیم کارمندمان در چین را با هزینهٔ اضافی که جداگانه توافق می‌شود به کارخانه بفرستیم.',
      // published (sourcing, equipment, guides): a visit if needed, the client's own visit, a check on paper
      'بر اساس توضیحات یا نمونه، ۲ تا ۳ تولیدکننده را از نظر قیمت مقایسه می‌کنیم، نمونه سفارش می‌دهیم و در صورت نیاز از کارخانه بازدید می‌کنیم.',
      'در صورت نیاز، از یک کارگاه مشابه بازدید می‌کنیم و شرح نیاز را همراه شما تنظیم می‌کنیم.', 'تماس تصویری رایگان است؛ بازدید را خودمان ترتیب می‌دهیم — شما هم می‌توانید همراه شوید و همکار ما ترجمه می‌کند.',
      'آیا خودم می‌توانم از کارخانه بازدید کنم؟', 'بله. بازدید را ما ترتیب می‌دهیم: هماهنگی با کارخانه، استقبال از شما و همراهی یکی از همکاران ما به‌عنوان مترجم.', 'کارخانه را بررسی می‌کنیم، دستگاه را می‌خریم و به تاشکند می‌آوریم.'] },
];
/** The name this list had while it held the Chinese and Persian rules only; tools written against it read the whole list. */
export const ZH_FA_FORBIDDEN = CLAIM_RULES;
/**
 * The rules of ONE page, the wholesale-buying service (owner, 2026-11-18): no clothing, footwear or medicine as an example of what
 * is bought — they stand there only in an exclusion. scripts/check-content.mjs reads them as page-scoped rules (PAGE_CLAIMS, on the
 * six URLs of WHOLESALE_SLUGS, sentence by sentence, the title and the descriptions included); selfTest() asserts their sentences
 * here like those of the claim rules, and every good sentence must pass every claim rule too.
 */
export const WHOLESALE_PAGE_RULES = [
  { id: 'uz.wholesaleCategory', msg: CATEGORY_MSG('uz'),
    re: new RegExp(`${UZ_CATEGORY_OK}|${UZC_CATEGORY_OK}`, 'iu'),
    bad: ['Doʻkon egalari va ulgurji savdogarlar (Abu Sahiy, Chorsu, Bek Baraka bozorlari): sotish uchun tovarni partiya bilan oladi — masalan, kiyim, oyoq kiyim yoki uy-roʻzgʻor mollari.',
      'Mijoz Xitoydan ulgurji sotib olmoqchi boʻlgan har qanday tovarni GSR Logistics sotib olib beradi — masalan, kiyim, oyoq kiyim, telefon aksessuarlari, ehtiyot qismlar (zapchastlar), mebel, uy-roʻzgʻor mollari va oʻyinchoqlar',
      'Kiyim va poyabzalni ulgurji sotib olamiz.', 'Masalan, dori-darmon va kosmetika.', 'Masalan, kiyim, mebel va oʻyinchoqlar — kontrafaktdan tashqari.', 'Kiyim kabi tovarlarni ham olib beramiz.', 'Дўкон эгалари ва улгуржи савдогарлар: товарни партия билан олади — масалан, кийим, оёқ кийим ёки уй-рўзғор моллари.', 'Масалан, дори-дармон ва косметика.'],
    good: ['Kiyim-kechak va dori-darmondan tashqari hamma tovarni sotib olamiz: stanoklar, qurilish mollari va boshqalar.', 'Ulgurji xarid kiyim-kechak va dori-darmon uchun emas.', 'Mos kelmaydi: kiyim-kechak, dori-darmon, bitta dona tovar.', 'Kiyim va dori olinmaydi.',
      'Stanoklar, qurilish mollari va boshqa har qanday tovar — masalan, telefon aksessuarlari, ehtiyot qismlar, mebel — kiyim-kechak va dori-darmondan tashqari.', 'Tovarning havolasi, rasmi yoki tavsifini, miqdorini va talablaringizni yuboring.',
      // the writers' round-4 forms (W/drafts/page.uz.json, 2026-11-18 15:18): a list that ends in «…dan tashqari», a denied verb
      'GSR Logisticsʼdagi ulgurji xarid xizmati mijoz Xitoydan ulgurji sotib olmoqchi boʻlgan stanoklar, qurilish mollari va boshqa har qanday tovar uchun moʻljallangan — kiyim-kechak, dori-darmon, kontrafakt va taqiqlangan tovarlar roʻyxatidagi mahsulotlardan tashqari.',
      'GSR Logistics kiyim-kechak va dori-darmonni ulgurji sotib olmaydi, kontrafakt va taqiqlangan tovarlar roʻyxatidagi mahsulotlarni ham sotib olmaydi.',
      'Кийим-кечак ва дори-дармондан ташқари ҳамма товарни сотиб оламиз: станоклар, қурилиш моллари ва бошқалар.', 'Товарнинг ҳаволаси, расми ёки тавсифини, миқдорини ва талабларингизни юборинг.'] },
  { id: 'ru.wholesaleCategory', msg: CATEGORY_MSG('ru'),
    re: new RegExp(RU_CATEGORY_OK, 'iu'),
    bad: ['Владельцы магазинов и оптовики (рынки Абу Сахий, Чорсу, Бек Барака), которые закупают товар партиями, например одежду, обувь или товары для дома.',
      'GSR Logistics закупает любой товар, который клиент хочет купить в Китае оптом (например, одежду, обувь, аксессуары для телефонов, запчасти, мебель, товары для дома и игрушки), кроме контрафакта и товаров из списка запрещённых.',
      'Закупаем одежду и обувь оптом.', 'В том числе лекарства и косметику.'],
    good: ['Оптовые закупки GSR Logistics охватывают станки, строительные материалы и любые другие товары, кроме одежды и лекарств, контрафакта и товаров из списка запрещённых.', 'Оптовые закупки не подходят для одежды и лекарств, для единичного товара и для заказа дешевле 3 000 $ в товаре.',
      'Не подходит: одежда, лекарства, единичный товар, заказ дешевле 3 000 $ в товаре.', 'Мы закупаем станки, строительные материалы и любые другие товары — например, аксессуары для телефонов, запчасти, мебель, товары для дома и игрушки, — кроме одежды и лекарств.', 'Одежду и лекарства мы не закупаем.'] },
  { id: 'en.wholesaleCategory', msg: CATEGORY_MSG('en'),
    re: new RegExp(EN_CATEGORY_OK, 'iu'),
    bad: ['Shop owners and wholesalers (Abu Sahiy, Chorsu, Bek Baraka markets) who buy stock by the batch — for example clothing, footwear or household goods.',
      'GSR Logistics buys any kind of goods a client wants to buy wholesale from China — for example clothing, footwear, phone accessories, spare parts, furniture, household goods and toys — except counterfeit goods and goods on the prohibited list.',
      'We buy clothing, shoes and toys wholesale.', 'Such as clothing and textiles.', 'Including medicines and cosmetics.', 'We buy footwear from factories in Guangzhou.'],
    good: ['Wholesale buying at GSR Logistics covers machine tools, construction materials and any other goods a client wants to buy wholesale from China, except clothing, medicines, counterfeit goods and goods on the prohibited list.',
      'Wholesale buying is not for clothing or medicines, for a single item or for an order worth less than $3,000 in goods.',
      'GSR Logistics buys machine tools, construction materials and any other goods a client wants to buy wholesale from China — for example phone accessories, spare parts, furniture, household goods and toys — except clothing and medicines.',
      'Does not fit: clothing, medicines, a single item, an order under $3,000 in goods or under 1 m³ in total, counterfeit goods, goods on the prohibited list.', 'Machine tools, construction materials and other goods, except clothing and medicines.',
      'Clothing and medicines are not bought.', 'We do not buy clothing or medicines.'] },
  { id: 'zh.wholesaleCategory', msg: CATEGORY_MSG('zh'),
    re: new RegExp(ZH_CATEGORY_OK, 'iu'),
    bad: ['店主和批发商（Abu Sahiy、Chorsu、Bek Baraka 市场）：成批进货，例如服装、鞋类或家居用品。', '客户想从中国批量采购的任何种类的货物，GSR Logistics 都代为采购，例如服装、鞋类、手机配件、零配件、家具、家居用品和玩具，但假冒商品和禁运物品除外。', '我们代购服装和鞋子。', '包括药品和化妆品。'],
    good: ['批发代采购涵盖机床、建材以及客户想从中国批量采购的其他任何货物，服装、药品、假冒商品和禁运物品除外。', '服装和药品除外。', '批发代采购不适用于服装和药品、单件商品以及货值低于 3,000 美元的订单。', '除服装和药品外，我们采购机床、建材等各类货物。', '不适合：服装、药品、单件商品。', '我们也采购鞋架等家居用品。', '批发代采购不涵盖服装和药品，也不适用于单件商品。'] },
  { id: 'fa.wholesaleCategory', msg: CATEGORY_MSG('fa'),
    re: new RegExp(FA_CATEGORY_OK, 'iu'),
    bad: ['صاحبان فروشگاه و عمده‌فروشان (بازارهای ابوسخی، چارسو و بک‌برکه) که کالای خود را به‌صورت محموله می‌خرند — برای مثال پوشاک، کفش یا لوازم خانگی.',
      'شرکت GSR Logistics هر نوع کالایی را که مشتری خواهان خرید عمدهٔ آن از چین باشد می‌خرد — برای مثال پوشاک، کفش، لوازم جانبی تلفن همراه، قطعات یدکی، مبلمان، لوازم خانگی و اسباب‌بازی — به‌جز کالای تقلبی و کالاهایی که در فهرست کالاهای ممنوع هستند.',
      'پوشاک و کفش را به‌صورت عمده می‌خریم.', 'از جمله دارو و لوازم آرایشی.'],
    good: ['خرید عمده شامل ماشین‌ابزار، مصالح ساختمانی و هر کالای دیگری است، به‌جز پوشاک و دارو.', 'خرید عمده برای پوشاک و دارو مناسب نیست.', 'پوشاک و دارو نمی‌خریم.', 'ماشین لباسشویی و یخچال را هم می‌خریم.', 'مناسب نیست: پوشاک، دارو، یک قلم کالا.', 'خرید عمده پوشاک و دارو را در بر نمی‌گیرد و برای یک کالای تکی نیست.', 'شرکت GSR Logistics پوشاک و دارو را به‌صورت عمده نمی‌خرد.'] },
];
/** The rule families that exist in all five written languages (selfTest() fails when one of the five is missing). */
const RULE_FAMILIES = ['persianStaff', 'destination', 'afghanFigure', 'afghanMode', 'afghanVolume', 'afghanPresence', 'afghanSchedule', 'afghanRecord', 'afghanOrigin', 'afghanAnywhere', 'afghanCustoms', 'hskCertificate', 'hskPlace', 'hskCount', 'pricePromise', 'factoryVisit'];
/** The number of bad + good sentences the claim rules and WHOLESALE_PAGE_RULES carried when this floor was last raised (2026-11-18,
 * round 4: the HSK rules reworked, factoryVisit and the wholesale page's category rules added; then the review fixes — "all four"
 * certificates, the passive visit, the staff credential, hskPlace, the withdrawn predicate): a guard against
 * quietly deleted fixtures. */
const FIXTURE_FLOOR = 3073;


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
  // The rules of the wholesale-buying page (read there only, by check-content.mjs): their own sentences, and what that page may say
  // passes every claim rule too.
  for (const r of WHOLESALE_PAGE_RULES) {
    for (const s of r.bad) if (!r.re.test(normalize(s))) bad.push(`${r.id} misses its bad sentence: ${s}`);
    for (const s of r.good) {
      const n = normalize(s);
      if (r.re.test(n)) bad.push(`${r.id} fires on its good sentence: ${s}`);
      for (const o of CLAIM_RULES) if (o.re.test(n)) bad.push(`${o.id} fires on the good sentence of ${r.id}: ${s}`);
    }
    if (!r.bad.length || !r.good.length) bad.push(`${r.id} has no ${r.bad.length ? 'good' : 'bad'} sentence — a rule must carry what it catches and what it lets through`);
  }
  for (const lang of ['uz', 'ru', 'en', 'zh', 'fa']) if (!WHOLESALE_PAGE_RULES.some((r) => r.id === `${lang}.wholesaleCategory`)) bad.push(`the rule ${lang}.wholesaleCategory is missing — the wholesale page's category rules exist in uz, ru, en, zh and fa`);
  const ids = [...CLAIM_RULES, ...WHOLESALE_PAGE_RULES].map((r) => r.id);
  // A rule without its sentences proves nothing: deleting the fixtures of a rule must not pass in silence.
  for (const r of CLAIM_RULES) if (!Array.isArray(r.bad) || !Array.isArray(r.good) || !r.bad.length || !r.good.length) bad.push(`${r.id} has no ${Array.isArray(r.bad) && r.bad.length ? 'good' : 'bad'} sentence — a rule must carry what it catches and what it lets through`);
  // The rules written since 2026-11-12 (RULE_FAMILIES) exist in all five written languages; one that is deleted leaves its language free to make the claim.
  for (const family of RULE_FAMILIES) for (const lang of ['uz', 'ru', 'en', 'zh', 'fa']) if (!ids.includes(`${lang}.${family}`)) bad.push(`the rule ${lang}.${family} is missing — the ${family} rules exist in uz, ru, en, zh and fa`);
  // … and so do the Chinese and Persian twins of the older rules.
  for (const id of ids) { const m = /^(zh|fa)\.(.+)$/.exec(id); if (m && !RULE_FAMILIES.includes(m[2]) && m[2] !== 'wechat' && !ids.includes(`${m[1] === 'zh' ? 'fa' : 'zh'}.${m[2]}`)) bad.push(`the rule ${id} has no ${m[1] === 'zh' ? 'fa' : 'zh'} twin`); }
  const sentences = [...CLAIM_RULES, ...WHOLESALE_PAGE_RULES].reduce((n, r) => n + r.bad.length + r.good.length, 0);
  if (sentences < FIXTURE_FLOOR) bad.push(`the claim rules carry ${sentences} sentences, fewer than the ${FIXTURE_FLOOR} they had when the floor was last raised — fixtures were deleted (lower FIXTURE_FLOOR in the same commit if that is meant)`);
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
  // The cities of TOWNS: the name alone, as a third point in a list, is stopped. (Persian «کابل» is also a cable.)
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
