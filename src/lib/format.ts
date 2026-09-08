import type { Lang } from '@/i18n/config';

/** Locale-aware number formatting: "1 200 000" (uz/ru, space groups, decimal comma) / "1,200,000" (en). */
export function fmtNumber(value: number, lang: Lang, maxFraction = 2): string {
  const fixed = Number.isInteger(value) ? String(value) : value.toFixed(maxFraction).replace(/\.?0+$/, '');
  const [int, frac] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' ');
  if (!frac) return grouped;
  return lang === 'en' ? `${grouped}.${frac}` : `${grouped},${frac}`;
}

/** "5,5 $" (uz/ru) or "$5.50" (en). */
export function fmtUsd(value: number, lang: Lang, maxFraction = 2): string {
  const n = fmtNumber(value, lang, maxFraction);
  return lang === 'en' ? `$${n}` : `${n} $`;
}

/** "1 200 000 soʻm" / "1 200 000 сум" / "UZS 1,200,000". */
export function fmtSom(value: number, lang: Lang): string {
  const n = fmtNumber(Math.round(value), lang, 0);
  return lang === 'uz' ? `${n} soʻm` : lang === 'ru' ? `${n} сум` : `UZS ${n}`;
}

const MONTHS: Record<Lang, string[]> = {
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

/** "2026-yil 8-sentabr" / "8 сентября 2026 г." / "September 8, 2026". */
export function fmtDate(iso: string | Date, lang: Lang): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  const y = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate();
  if (lang === 'uz') return `${y}-yil ${day}-${MONTHS.uz[m]}`;
  if (lang === 'ru') return `${day} ${MONTHS.ru[m]} ${y} г.`;
  return `${MONTHS.en[m]} ${day}, ${y}`;
}

/** "15–25 kun" style ranges. */
export function fmtRange(a: number, b: number, unit: string, lang: Lang): string {
  return `${fmtNumber(a, lang)}–${fmtNumber(b, lang)} ${unit}`;
}

/** Rough reading time from plain text. */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 180));
}
