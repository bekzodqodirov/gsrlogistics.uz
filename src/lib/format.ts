import type { Locale } from '@/i18n/config';

/*
 * Every number, price, date and code-printed unit on the site comes out of this file, from ONE
 * table with a row per locale (`FORMATS` below). Components never choose a separator, a currency
 * position, a unit word or where the "from" word goes: they call these helpers. zh and fa get their
 * own forms from their rows, and the four older locales keep theirs byte for byte —
 * scripts/test-pricing.mjs pins every helper in all six locales, and pins the uz/uzc/ru/en output
 * to the hand-written formatters this table replaced.
 *
 * Dependency-free on purpose (the only import is a type): the calculator, the tracking form and
 * the hero and journey km counters bundle this module into their browser scripts.
 *
 * Every function takes a `Locale`, so a /kirill/ page formats its own numbers and dates instead of
 * borrowing the Latin ones. Where Cyrillic needs its own wording the string is written out below
 * rather than produced by calling the transliterator: importing `src/lib/cyrillic.ts` here would
 * ship the whole dictionary to the browser on every pricing page. scripts/test-locale.mjs pins each
 * of these literals to `toCyrillic()` of its Uzbek Latin twin, so the dictionary stays the authority
 * and drift fails a test rather than reaching a page.
 *
 * Persian (fa) prints Persian digits ۰–۹, '٬' (U+066C) between thousands and '٫' (U+066B) before
 * decimals: its row formats with ASCII digits like every other row, and its `digits` replace them in
 * one last step. Identifiers — phone numbers, GSR-/GS codes, 20GP/40HQ, HS codes, URLs — never pass
 * through these helpers and keep ASCII digits. Input goes the other way: `toAsciiDigits` and
 * `parseNumber` read ASCII, Persian, Arabic-Indic and full-width digits alike.
 */

/** A unit the code prints itself. Most units arrive inside the i18n strings instead. */
export type Unit = 'km' | 'kg' | 'm3';

interface LocaleFormat {
  /** Thousands separator. Never U+0020: a plain space lets the bidi algorithm split a figure in RTL text. */
  group: string;
  decimal: string;
  /** The locale's digits 0–9, swapped in as the last step. ASCII when absent. */
  digits?: string;
  /** Non-integer dollar figures always show two decimals: "$5.50", "5.50 美元". Otherwise trailing zeros go: "5,5 $". */
  cents: boolean;
  /** The dollar mark the way the locale writes it next to a figure: the sign, or a word. */
  usdMark: string;
  /** Whether that mark is the sign "$", which a price table may repeat on both ends of a range. */
  usdSign: boolean;
  usd: (n: string) => string;
  /** A dollar range with the mark printed once. */
  usdRange: (a: string, b: string) => string;
  som: (n: string) => string;
  somRange: (a: string, b: string) => string;
  /** A range of bare figures: "15–25", "۱۵ تا ۲۵". */
  span: (a: string, b: string) => string;
  /** The "from" word follows the figure (a postposition: uz "dan", zh "起") instead of preceding it. */
  fromAfter: boolean;
  percent: (n: string) => string;
  /** Month `m` is 0-based. */
  date: (y: number, m: number, d: number) => string;
  monthYear: (y: number, m: number) => string;
  /** The separator of code-level joins ("phone · hours"). U+00B7 reads as the Persian zero ۰, so fa has its own. */
  sep: string;
  /** The route arrow of code-level joins. U+2192 does not mirror in RTL text, so fa writes ←. */
  arrow: string;
  /** Sentence terminator. */
  stop: string;
  /** A unit in running text (Russian copy writes Cyrillic units). */
  unit: Record<Unit, string>;
  /**
   * A unit in the figure labels that print the international symbol in every Latin- and Cyrillic-script
   * locale, Russian included (WhyGsr's rate, Proof's distance): the live pages are written that way and
   * those four rows keep it. zh and fa have one spelling each.
   */
  symbol: Record<Unit, string>;
  /**
   * How a typed figure is read (parseNumber). false: uz, uzc, ru and en read exactly as the calculator
   * always read them (spaces dropped, the FIRST comma is the decimal mark). true: zh and fa also group,
   * as their visitors write figures: a comma shaped like thousands groups ("1,200") groups, and with
   * both marks the later one is the decimal ("1,200.5").
   */
  readGroups: boolean;
  /** "/" typed as the decimal mark: Persian writers often type it for ٫ ("۲/۵" is 2.5, not 25). */
  slashDecimal?: boolean;
}

const NNBSP = ' '; // narrow no-break space: a CS-class separator that holds a figure together
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const pad2 = (n: number) => String(n).padStart(2, '0');

const MONTHS = {
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  // Uzbek Cyrillic keeps the Russian month names, soft sign and all — see the `months` table in
  // src/lib/cyrillic.terms.ts, which is where this ruling was made and where it is explained.
  uzc: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  /** Genitive, for a date: "8 сентября 2026 г.". */
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  /** Nominative, for a month and year: "сентябрь 2026". */
  ruMonth: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const LATIN_UNITS: Record<Unit, string> = { km: 'km', kg: 'kg', m3: 'm³' };

/**
 * One row per locale. zh dates need no month names. fa dates are numeric Gregorian on purpose: Iran
 * and Afghanistan name the months differently, and the tariff and guide dates are Gregorian.
 */
const FORMATS: Record<Locale, LocaleFormat> = {
  uz: {
    group: NNBSP, decimal: ',', cents: false, readGroups: false,
    usdMark: '$', usdSign: true, usd: (n) => `${n} $`, usdRange: (a, b) => `${a}–${b} $`,
    som: (n) => `${n} soʻm`, somRange: (a, b) => `${a}–${b} soʻm`,
    span: (a, b) => `${a}–${b}`, fromAfter: true, percent: (n) => `${n}%`,
    date: (y, m, d) => `${y}-yil ${d}-${MONTHS.uz[m]}`, monthYear: (y, m) => `${y}-yil ${MONTHS.uz[m]}`,
    sep: ' · ', arrow: ' → ', stop: '.', unit: LATIN_UNITS, symbol: LATIN_UNITS,
  },
  // Uzbek Cyrillic writes сўм (Ў), which is not the Russian сум — the two are different words on
  // the same page when a Russian speaker opens /kirill/.
  uzc: {
    group: NNBSP, decimal: ',', cents: false, readGroups: false,
    usdMark: '$', usdSign: true, usd: (n) => `${n} $`, usdRange: (a, b) => `${a}–${b} $`,
    som: (n) => `${n} сўм`, somRange: (a, b) => `${a}–${b} сўм`,
    span: (a, b) => `${a}–${b}`, fromAfter: true, percent: (n) => `${n}%`,
    date: (y, m, d) => `${y}-йил ${d}-${MONTHS.uzc[m]}`, monthYear: (y, m) => `${y}-йил ${MONTHS.uzc[m]}`,
    sep: ' · ', arrow: ' → ', stop: '.', unit: LATIN_UNITS, symbol: LATIN_UNITS,
  },
  ru: {
    group: NNBSP, decimal: ',', cents: false, readGroups: false,
    usdMark: '$', usdSign: true, usd: (n) => `${n} $`, usdRange: (a, b) => `${a}–${b} $`,
    som: (n) => `${n} сум`, somRange: (a, b) => `${a}–${b} сум`,
    span: (a, b) => `${a}–${b}`, fromAfter: false, percent: (n) => `${n}%`,
    date: (y, m, d) => `${d} ${MONTHS.ru[m]} ${y} г.`, monthYear: (y, m) => `${MONTHS.ruMonth[m]} ${y}`,
    sep: ' · ', arrow: ' → ', stop: '.', unit: { km: 'км', kg: 'кг', m3: 'м³' }, symbol: LATIN_UNITS,
  },
  en: {
    group: ',', decimal: '.', cents: true, readGroups: false,
    usdMark: '$', usdSign: true, usd: (n) => `$${n}`, usdRange: (a, b) => `$${a}–${b}`,
    som: (n) => `UZS ${n}`, somRange: (a, b) => `UZS ${a}–${b}`,
    span: (a, b) => `${a}–${b}`, fromAfter: false, percent: (n) => `${n}%`,
    date: (y, m, d) => `${MONTHS.en[m]} ${d}, ${y}`, monthYear: (y, m) => `${MONTHS.en[m]} ${y}`,
    sep: ' · ', arrow: ' → ', stop: '.', unit: LATIN_UNITS, symbol: LATIN_UNITS,
  },
  // CLDR zh groups and decimals like en. The currency is the word 美元 after the figure, and 起 ("from")
  // is a postposition: "110 美元/m³ 起".
  zh: {
    group: ',', decimal: '.', cents: true, readGroups: true,
    usdMark: '美元', usdSign: false, usd: (n) => `${n} 美元`, usdRange: (a, b) => `${a}–${b} 美元`,
    som: (n) => `${n} 苏姆`, somRange: (a, b) => `${a}–${b} 苏姆`,
    span: (a, b) => `${a}–${b}`, fromAfter: true, percent: (n) => `${n}%`,
    date: (y, m, d) => `${y}年${m + 1}月${d}日`, monthYear: (y, m) => `${y}年${m + 1}月`,
    sep: ' · ', arrow: ' → ', stop: '。',
    unit: { km: '公里', kg: 'kg', m3: 'm³' }, symbol: { km: '公里', kg: 'kg', m3: 'm³' },
  },
  // Persian digits with ٬ and ٫ (CLDR fa); the currency is the word دلار after the figure (a bare "$"
  // is reordered around digits in RTL text); از ("from") is a preposition; ranges read "X تا Y".
  fa: {
    group: '٬', decimal: '٫', digits: PERSIAN_DIGITS, cents: false, readGroups: true, slashDecimal: true,
    usdMark: 'دلار', usdSign: false, usd: (n) => `${n} دلار`, usdRange: (a, b) => `${a} تا ${b} دلار`,
    som: (n) => `${n} سوم`, somRange: (a, b) => `${a} تا ${b} سوم`,
    span: (a, b) => `${a} تا ${b}`, fromAfter: false, percent: (n) => `${n}٪`,
    date: (y, m, d) => `${y}/${pad2(m + 1)}/${pad2(d)}`, monthYear: (y, m) => `${y}/${pad2(m + 1)}`,
    sep: ' • ', arrow: ' ← ', stop: '.',
    unit: { km: 'کیلومتر', kg: 'کیلوگرم', m3: 'متر مکعب' }, symbol: { km: 'کیلومتر', kg: 'کیلوگرم', m3: 'متر مکعب' },
  },
};

/** The last step: ASCII digits → the locale's own (fa). Idempotent, so composed helpers may apply it twice. */
const localDigits = (s: string, f: LocaleFormat) => (f.digits ? s.replace(/[0-9]/g, (d) => f.digits![+d]) : s);

/** "1234.5" (ASCII, as toFixed/String write it) → grouped, with the locale's decimal mark. */
function groupFixed(fixed: string, f: LocaleFormat): string {
  const [int, frac] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, f.group);
  return frac ? `${grouped}${f.decimal}${frac}` : grouped;
}

/* ── Numbers ─────────────────────────────────────────────────────────────────────────────────── */

/**
 * Locale-aware number: "1 200 000,5" (uz/uzc/ru: narrow no-break space groups, decimal comma),
 * "1,200,000.5" (en, zh), "۱٬۲۰۰٬۰۰۰٫۵" (fa). At most `maxFraction` decimals, trailing zeros dropped.
 */
export function fmtNumber(value: number, lang: Locale, maxFraction = 2): string {
  const f = FORMATS[lang];
  let fixed = Number.isInteger(value) ? String(value) : value.toFixed(maxFraction);
  // Only a fraction loses its trailing zeros: toFixed(0) writes no point, and "10" must not become "1".
  if (fixed.includes('.')) fixed = fixed.replace(/\.?0+$/, '');
  return localDigits(groupFixed(fixed, f), f);
}

/**
 * Digits only, never grouped — years, minutes, indices: "2026" / "۲۰۲۶" where fmtNumber would print
 * "2 026". `minDigits` zero-pads an index: fmtInt(3, lang, 2) → "03" / "۰۳".
 */
export function fmtInt(value: number, lang: Locale, minDigits = 1): string {
  const n = Math.round(value);
  const digits = String(Math.abs(n)).padStart(minDigits, '0');
  return localDigits(n < 0 ? `-${digits}` : digits, FORMATS[lang]);
}

/**
 * A figure the code already holds as text ("03", "24/7") in the locale's digits. For figures only:
 * an identifier (phone, code, URL) must never pass through here.
 */
export function fmtDigits(text: string, lang: Locale): string {
  return localDigits(text, FORMATS[lang]);
}

/** A range of bare figures: "15–25" (uz/uzc/ru/en/zh) / "۱۵ تا ۲۵" (fa). */
export function fmtNumRange(a: number, b: number, lang: Locale, maxFraction = 2): string {
  return FORMATS[lang].span(fmtNumber(a, lang, maxFraction), fmtNumber(b, lang, maxFraction));
}

/** "15–25 kun" / "15–25 天" / "۱۵ تا ۲۵ روز". An empty unit gives the bare range. */
export function fmtRange(a: number, b: number, unit: string, lang: Locale): string {
  const span = fmtNumRange(a, b, lang);
  return unit ? `${span} ${unit}` : span;
}

/** "5%" / "۵٪" (fa writes the Arabic percent sign U+066A). */
export function fmtPercent(value: number, lang: Locale, maxFraction = 2): string {
  return FORMATS[lang].percent(fmtNumber(value, lang, maxFraction));
}

/* ── Money ───────────────────────────────────────────────────────────────────────────────────── */

/** Bare dollar figure without the mark: "5,5" (uz/uzc/ru), "5.50" (en, zh — non-integers always carry two decimals), "۵٫۵" (fa). */
export function fmtUsdNumber(value: number, lang: Locale, maxFraction = 2): string {
  const f = FORMATS[lang];
  if (f.cents && !Number.isInteger(value)) return localDigits(groupFixed(value.toFixed(2), f), f);
  return fmtNumber(value, lang, maxFraction);
}

/** "5,5 $" (uz/uzc/ru), "$5.50" (en), "5.50 美元" (zh), "۵٫۵ دلار" (fa). */
export function fmtUsd(value: number, lang: Locale, maxFraction = 2): string {
  return FORMATS[lang].usd(fmtUsdNumber(value, lang, maxFraction));
}

/**
 * A dollar range: "2 800–5 500 $" / "$2,800–5,500" / "2,800–5,500 美元" / "۲٬۸۰۰ تا ۵٬۵۰۰ دلار".
 * `each` is the price tables' form, which repeats the sign on both ends ("2 800 $–5 500 $",
 * "$2,800–$5,500"); zh and fa write their currency word once either way.
 */
export function fmtUsdRange(lo: number, hi: number, lang: Locale, opts: { each?: boolean } = {}): string {
  const f = FORMATS[lang];
  if (opts.each && f.usdSign) return `${fmtUsd(lo, lang)}–${fmtUsd(hi, lang)}`;
  return f.usdRange(fmtUsdNumber(lo, lang), fmtUsdNumber(hi, lang));
}

/** The dollar mark as the locale writes it beside a figure: "$", "美元", "دلار". */
export function usdMark(lang: Locale): string {
  return FORMATS[lang].usdMark;
}

/** "1 200 000 soʻm" / "1 200 000 сўм" / "1 200 000 сум" / "UZS 1,200,000" / "1,200,000 苏姆" / "۱٬۲۰۰٬۰۰۰ سوم". */
export function fmtSom(value: number, lang: Locale): string {
  return FORMATS[lang].som(fmtNumber(Math.round(value), lang, 0));
}

/** A som range with the unit printed once: "20 000–30 000 soʻm" / "UZS 20,000–30,000" / "۲۰٬۰۰۰ تا ۳۰٬۰۰۰ سوم". */
export function fmtSomRange(lo: number, hi: number, lang: Locale): string {
  return FORMATS[lang].somRange(fmtNumber(Math.round(lo), lang, 0), fmtNumber(Math.round(hi), lang, 0));
}

/* ── Words around figures ────────────────────────────────────────────────────────────────────── */

/** Whether the "from" word comes after the figure (uz, uzc "dan"; zh "起") or before it (ru, en, fa). */
export function fromPosition(lang: Locale): 'before' | 'after' {
  return FORMATS[lang].fromAfter ? 'after' : 'before';
}

/** A Chinese character or full-width punctuation at the end: no space before a following 起. */
const CJK_END = /[　-〿㐀-䶿一-鿿豈-﫿＀-￯]$/;

/**
 * "110 $/m³ dan" (uz, uzc), "110 美元/m³ 起" / "110 美元起" (zh — no space after a Chinese character):
 * postpositions. "от 110 $/м³", "from $110/m³", "از ۱۱۰ دلار/متر مکعب" (ru, en, fa): prepositions.
 */
export function withFrom(value: string, lang: Locale, from: string): string {
  if (!from) return value;
  if (!FORMATS[lang].fromAfter) return `${from} ${value}`;
  return !value || CJK_END.test(value) ? `${value}${from}` : `${value} ${from}`;
}

/** Russian plural of "день" for a count: 1 день, 3 дня, 5 дней, 21 день, 22 дня. */
export function ruDays(n: number): string {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'день';
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'дня';
  return 'дней';
}

/**
 * Localised day word for a count: ru declined via ruDays; every other locale passes its own word in
 * as `fallback` (uz "kun", uzc "кун", en "days" — and zh 天 / fa روز, which do not inflect after a numeral).
 */
export function daysWord(n: number, lang: Locale, fallback: string): string {
  return lang === 'ru' ? ruDays(n) : fallback;
}

/** A unit the code prints in running text: uz/uzc/en "km", ru "км", zh "公里", fa "کیلومتر". */
export function unitWord(unit: Unit, lang: Locale): string {
  return FORMATS[lang].unit[unit];
}

/** A unit in a figure label printed with the international symbol on the four older locales ("m³" in Russian too); zh/fa as unitWord. */
export function unitSymbol(unit: Unit, lang: Locale): string {
  return FORMATS[lang].symbol[unit];
}

/** The separator of a code-level join, with its spaces: " · " (fa: " • "). */
export function sep(lang: Locale): string {
  return FORMATS[lang].sep;
}

/** The separator glyph alone, for markup that spaces it with CSS: "·" (fa: "•"). */
export function sepMark(lang: Locale): string {
  return FORMATS[lang].sep.trim();
}

/** The route arrow of a code-level join, with its spaces: " → " (fa: " ← ", since U+2192 does not mirror). */
export function arrow(lang: Locale): string {
  return FORMATS[lang].arrow;
}

/** End a sentence the code assembles: adds the locale's full stop ("." / zh "。") unless the text already ends in one ("2026 г."). */
export function endSentence(text: string, lang: Locale): string {
  return /[.!?。！？…]$/.test(text) ? text : `${text}${FORMATS[lang].stop}`;
}

/* ── Dates ───────────────────────────────────────────────────────────────────────────────────── */

const toDate = (iso: string | Date) => (typeof iso === 'string' ? new Date(iso) : iso);

/** "2026-yil 8-sentabr" / "2026-йил 8-сентябрь" / "8 сентября 2026 г." / "September 8, 2026" / "2026年9月8日" / "۲۰۲۶/۰۹/۰۸". */
export function fmtDate(iso: string | Date, lang: Locale): string {
  const d = toDate(iso);
  const f = FORMATS[lang];
  return localDigits(f.date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), f);
}

/** "2026-yil sentabr" / "2026-йил сентябрь" / "сентябрь 2026" / "September 2026" / "2026年9月" / "۲۰۲۶/۰۹". */
export function fmtMonthYear(iso: string | Date, lang: Locale): string {
  const d = toDate(iso);
  const f = FORMATS[lang];
  return localDigits(f.monthYear(d.getUTCFullYear(), d.getUTCMonth()), f);
}

/* ── Reading time ────────────────────────────────────────────────────────────────────────────── */

/** CJK ideographs (written without spaces). Explicit ranges, not \p{Script=Han}: older in-app WebViews lack property escapes. */
const HAN = /[㐀-䶿一-鿿豈-﫿]/g;

/**
 * Rough reading time from plain text: words ÷ 180 a minute for every space-separated script
 * (Persian included — ZWNJ is not a space). Chinese has no spaces, so where Han characters outnumber
 * the words the text is counted as Chinese: about 400 characters a minute, plus the Latin words and
 * figures between them. A few Han names inside an Uzbek or English guide leave its count alone.
 */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  const han = text.match(HAN)?.length ?? 0;
  if (han <= words) return Math.max(1, Math.round(words / 180));
  const others = text.replace(HAN, ' ').split(/\s+/).filter((w) => /[A-Za-z0-9À-ɏЀ-ӿ]/.test(w)).length;
  return Math.max(1, Math.round(han / 400 + others / 180));
}

/* ── Input ───────────────────────────────────────────────────────────────────────────────────── */

/**
 * Normalise typed or pasted text to ASCII digits before parsing or validating: Persian ۰–۹ and
 * Arabic-Indic ٠–٩ become 0–9; the full-width forms a Chinese IME types (０–９, ．，＋－ and the
 * letters) become ASCII, and so does the ideographic full stop '。' a Chinese IME in Chinese-punctuation
 * mode types for the point ("0。8" is 0.8, not 8); '٫' (Arabic decimal separator) becomes '.', '،'
 * (Arabic comma) ',', and '٬' (Arabic thousands separator — it only ever groups) is dropped.
 * Everything else is left alone.
 */
export function toAsciiDigits(text: string): string {
  return text.replace(/[٠-٩۰-۹٫٬،　。！-～]/g, (ch) => {
    const c = ch.charCodeAt(0);
    if (c >= 0x06f0 && c <= 0x06f9) return String(c - 0x06f0);
    if (c >= 0x0660 && c <= 0x0669) return String(c - 0x0660);
    if (c === 0x066b || c === 0x3002) return '.';
    if (c === 0x066c) return '';
    if (c === 0x060c) return ',';
    if (c === 0x3000) return ' ';
    return String.fromCharCode(c - 0xfee0);
  });
}

/**
 * Read a typed decimal in any of the digit sets above. NaN when there is no figure. A minus sign is
 * not rejected here; the caller decides.
 *  - uz, uzc, ru, en: exactly the calculator's original reading, now over every digit set. Spaces
 *    are dropped, the first comma is the decimal mark ("0,8"), anything else is ignored.
 *  - zh, fa (`readGroups`): as those visitors write figures. A comma shaped like thousands groups
 *    groups ("1,200", "12,500,000"); otherwise it is the decimal mark ("0,8"). With both marks the
 *    later one is the decimal ("1,200.5", "1.200,5"). fa also reads "/" as ٫ (`slashDecimal`).
 */
export function parseNumber(raw: string, lang: Locale): number {
  const f = FORMATS[lang];
  let s = toAsciiDigits(raw).replace(/\s/g, '');
  if (!f.readGroups) return parseFloat(s.replace(',', '.').replace(/[^0-9.]/g, ''));
  if (f.slashDecimal) s = s.replace(/\//g, '.');
  s = s.replace(/['’]/g, '');
  const dot = s.lastIndexOf('.'), comma = s.lastIndexOf(',');
  if (dot >= 0 && comma >= 0) s = comma > dot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  else if (comma >= 0) s = /^\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.');
  return parseFloat(s.replace(/[^0-9.]/g, ''));
}

/**
 * The `pattern` of a decimal input, checked natively when Enter submits the form. It keeps the shape
 * the calculator's fields always had: digits, at most one decimal mark, then digits. It accepts every
 * digit set parseNumber reads (ASCII, Persian, Arabic-Indic, full-width) and the Persian thousands
 * mark ٬ in the whole part. zh and fa also take a comma-grouped figure ("1,200,000.5"), and fa takes
 * "/" as the decimal mark. Browsers compile it with the `v` flag, which needs "/" escaped; a pattern
 * that does not compile is silently dropped.
 */
export function decimalPattern(lang: Locale): string {
  const f = FORMATS[lang];
  const d = '0-9۰-۹٠-٩０-９';
  const point = `.٫．。${f.slashDecimal ? '\\/' : ''}`;
  const plain = `[${d}٬]*[,،，${point}]?[${d}]*`;
  return f.readGroups ? `${plain}|[${d}]{1,3}(?:[,，][${d}]{3})+(?:[${point}][${d}]*)?` : plain;
}
