import type { Locale, Localized } from '@/i18n/config';
import { fmtNumber, unitSymbol } from '@/lib/format';

/** Road distance Yiwu → Tashkent via Urumqi/Khorgos/Almaty/Shymkent. TODO(owner): verify with a routing engine; while unverified the site prints "5 000+ km". */
export const ROUTE_KM = 5000;
export const ROUTE_KM_VERIFIED = false;
/**
 * The road distance as a figure and its unit: "5 000+" + "km" (the "+" goes once the owner verifies
 * the distance). The figure is fmtNumber's — never a plain-space group, which RTL text would split —
 * and the unit is the label symbol, so the four older locales keep their Latin "km" and zh/fa get
 * 公里 / کیلومتر.
 */
export const routeKm = (lang: Locale) => ({
  value: `${fmtNumber(ROUTE_KM, lang)}${ROUTE_KM_VERIFIED ? '' : '+'}`,
  unit: unitSymbol('km', lang),
});
export const routeKmLabel = (lang: Locale) => { const km = routeKm(lang); return `${km.value} ${km.unit}`; };

/** The eight route nodes in travel order with localized names (DESIGN_BRIEF §10.3) and map coordinates (viewBox 0 0 1600 923). */
export interface RouteNode { id: string; x: number; y: number; name: Localized<string>; zh?: string; role?: 'origin' | 'border' | 'destination' }
export const routeNodes: RouteNode[] = [
  { id: 'yiwu', x: 1478.9, y: 670.4, name: { uz: 'Ivu', ru: 'Иу', en: 'Yiwu', zh: '义乌', fa: 'ییوو' }, zh: '义乌', role: 'origin' },
  { id: 'xian', x: 1204.9, y: 524.5, name: { uz: 'Sian', ru: 'Сиань', en: 'Xiʼan', zh: '西安', fa: 'شیان' } },
  { id: 'lanzhou', x: 1079.1, y: 472.7, name: { uz: 'Lanchjou', ru: 'Ланьчжоу', en: 'Lanzhou', zh: '兰州', fa: 'لانژو' } },
  { id: 'urumqi', x: 680.0, y: 222.7, name: { uz: 'Urumchi', ru: 'Урумчи', en: 'Urumqi', zh: '乌鲁木齐', fa: 'ارومچی' } },
  { id: 'khorgos', x: 502.7, y: 209.7, name: { uz: 'Xorgos', ru: 'Хоргос', en: 'Khorgos', zh: '霍尔果斯', fa: 'خورگوس' }, role: 'border' },
  { id: 'almaty', x: 417.3, y: 242.8, name: { uz: 'Olmaota', ru: 'Алматы', en: 'Almaty', zh: '阿拉木图', fa: 'آلماتی' } },
  { id: 'shymkent', x: 236.4, y: 273.6, name: { uz: 'Shimkent', ru: 'Шымкент', en: 'Shymkent', zh: '奇姆肯特', fa: 'شیمکنت' } },
  { id: 'tashkent', x: 228.5, y: 307.0, name: { uz: 'Toshkent', ru: 'Ташкент', en: 'Tashkent', zh: '塔什干', fa: 'تاشکند' }, role: 'destination' },
];
export const extraPlaces = {
  guangzhou: { x: 1311.3, y: 840.1, name: { uz: 'Guanchjou', ru: 'Гуанчжоу', en: 'Guangzhou', zh: '广州', fa: 'گوانگجو' } as Localized<string> },
  dostyk: { x: 504.7, y: 173.7, name: { uz: 'Dostiq', ru: 'Достык', en: 'Dostyk', zh: '多斯特克', fa: 'دوستیک' } as Localized<string> },
  kashgar: { x: 393.7, y: 366.5, name: { uz: 'Qashqar', ru: 'Кашгар', en: 'Kashgar', zh: '喀什', fa: 'کاشغر' } as Localized<string> },
  irkeshtam: { x: 342.7, y: 359.8, name: { uz: 'Irkeshtam', ru: 'Иркештам', en: 'Irkeshtam', zh: '伊尔克什坦', fa: 'ایرکشتام' } as Localized<string> },
  osh: { x: 315.1, y: 332.4, name: { uz: 'Oʻsh', ru: 'Ош', en: 'Osh', zh: '奥什', fa: 'اوش' } as Localized<string> },
  andijan: { x: 303.8, y: 324.3, name: { uz: 'Andijon', ru: 'Андижан', en: 'Andijan', zh: '安集延', fa: 'اندیجان' } as Localized<string> },
};
