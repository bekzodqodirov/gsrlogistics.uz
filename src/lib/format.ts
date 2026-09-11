import type { Locale } from '@/i18n/config';

/*
 * Every function here takes a `Locale`, so a /kirill/ page formats its own numbers and dates
 * instead of borrowing the Latin ones. Where Cyrillic needs its own wording the string is written
 * out below rather than produced by calling the transliterator: `fmtSom` and `fmtNumber` are
 * bundled into the calculator's client script, and importing `src/lib/cyrillic.ts` here would ship
 * the whole dictionary to the browser on every pricing page. scripts/test-format-locale.mjs pins
 * each of these literals to `toCyrillic()` of its Uzbek Latin twin, so the dictionary stays the
 * authority and drift fails a test rather than reaching a page.
 */

/** Locale-aware number formatting: "1 200 000" (uz/uzc/ru, space groups, decimal comma) / "1,200,000" (en). */
export function fmtNumber(value: number, lang: Locale, maxFraction = 2): string {
  const fixed = Number.isInteger(value) ? String(value) : value.toFixed(maxFraction).replace(/\.?0+$/, '');
  const [int, frac] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' ');
  if (!frac) return grouped;
  return lang === 'en' ? `${grouped}.${frac}` : `${grouped},${frac}`;
}

/** Bare dollar figure without the sign: "5,5" (uz/uzc/ru) or "5.50" (en — non-integers always carry two decimals). */
export function fmtUsdNumber(value: number, lang: Locale, maxFraction = 2): string {
  if (lang === 'en' && !Number.isInteger(value)) {
    const [int, frac] = value.toFixed(2).split('.');
    return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${frac}`;
  }
  return fmtNumber(value, lang, maxFraction);
}

/** "5,5 $" (uz/uzc/ru) or "$5.50" (en). */
export function fmtUsd(value: number, lang: Locale, maxFraction = 2): string {
  const n = fmtUsdNumber(value, lang, maxFraction);
  return lang === 'en' ? `$${n}` : `${n} $`;
}

/** "110 $/m³ dan" (uz and uzc — postposition) vs "от 110 $/м³" / "from $110/m³" (ru/en — preposition). */
export function withFrom(value: string, lang: Locale, from: string): string {
  return lang === 'uz' || lang === 'uzc' ? `${value} ${from}` : `${from} ${value}`;
}

/** Russian plural of "день" for a count: 1 день, 3 дня, 5 дней, 21 день, 22 дня. */
export function ruDays(n: number): string {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'день';
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'дня';
  return 'дней';
}

/** Localised day word for a count: uz "kun", uzc "кун", en "days", ru declined via ruDays — uz/uzc/en pass their own word in as `fallback`. */
export function daysWord(n: number, lang: Locale, fallback: string): string {
  return lang === 'ru' ? ruDays(n) : fallback;
}

/** "1 200 000 soʻm" / "1 200 000 сўм" / "1 200 000 сум" / "UZS 1,200,000". */
export function fmtSom(value: number, lang: Locale): string {
  const n = fmtNumber(Math.round(value), lang, 0);
  // Uzbek Cyrillic writes сўм (Ў), which is not the Russian сум — the two are different words on
  // the same page when a Russian speaker opens /kirill/.
  return lang === 'uz' ? `${n} soʻm` : lang === 'uzc' ? `${n} сўм` : lang === 'ru' ? `${n} сум` : `UZS ${n}`;
}

const MONTHS: Record<Locale, string[]> = {
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  // Uzbek Cyrillic keeps the Russian month names, soft sign and all — see the `months` table in
  // src/lib/cyrillic.terms.ts, which is where this ruling was made and where it is explained.
  uzc: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

/** "2026-yil 8-sentabr" / "2026-йил 8-сентябрь" / "8 сентября 2026 г." / "September 8, 2026". */
export function fmtDate(iso: string | Date, lang: Locale): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  const y = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate();
  if (lang === 'uz') return `${y}-yil ${day}-${MONTHS.uz[m]}`;
  if (lang === 'uzc') return `${y}-йил ${day}-${MONTHS.uzc[m]}`;
  if (lang === 'ru') return `${day} ${MONTHS.ru[m]} ${y} г.`;
  return `${MONTHS.en[m]} ${day}, ${y}`;
}

/** "15–25 kun" style ranges. */
export function fmtRange(a: number, b: number, unit: string, lang: Locale): string {
  return `${fmtNumber(a, lang)}–${fmtNumber(b, lang)} ${unit}`;
}

/** Rough reading time from plain text. */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 180));
}
