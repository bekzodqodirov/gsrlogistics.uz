import type { Lang, Locale } from '@/i18n/config';

/** Road distance Yiwu → Tashkent via Urumqi/Khorgos/Almaty/Shymkent. TODO(owner): verify with a routing engine; while unverified the site prints "5 000+ km". */
export const ROUTE_KM = 5000;
export const ROUTE_KM_VERIFIED = false;
export const routeKmLabel = (lang: Locale) => (ROUTE_KM_VERIFIED ? `${ROUTE_KM.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU').replace(/,/g, ' ')} km` : `${(lang === 'en' ? '5,000' : '5 000')}+ km`);

/** The eight route nodes in travel order with localized names (DESIGN_BRIEF §10.3) and map coordinates (viewBox 0 0 1600 923). */
export interface RouteNode { id: string; x: number; y: number; name: Record<Lang, string>; zh?: string; role?: 'origin' | 'border' | 'destination' }
export const routeNodes: RouteNode[] = [
  { id: 'yiwu', x: 1478.9, y: 670.4, name: { uz: 'Ivu', ru: 'Иу', en: 'Yiwu' }, zh: '义乌', role: 'origin' },
  { id: 'xian', x: 1204.9, y: 524.5, name: { uz: 'Sian', ru: 'Сиань', en: 'Xiʼan' } },
  { id: 'lanzhou', x: 1079.1, y: 472.7, name: { uz: 'Lanchjou', ru: 'Ланьчжоу', en: 'Lanzhou' } },
  { id: 'urumqi', x: 680.0, y: 222.7, name: { uz: 'Urumchi', ru: 'Урумчи', en: 'Urumqi' } },
  { id: 'khorgos', x: 502.7, y: 209.7, name: { uz: 'Xorgos', ru: 'Хоргос', en: 'Khorgos' }, role: 'border' },
  { id: 'almaty', x: 417.3, y: 242.8, name: { uz: 'Olmaota', ru: 'Алматы', en: 'Almaty' } },
  { id: 'shymkent', x: 236.4, y: 273.6, name: { uz: 'Shimkent', ru: 'Шымкент', en: 'Shymkent' } },
  { id: 'tashkent', x: 228.5, y: 307.0, name: { uz: 'Toshkent', ru: 'Ташкент', en: 'Tashkent' }, role: 'destination' },
];
export const extraPlaces = {
  guangzhou: { x: 1311.3, y: 840.1, name: { uz: 'Guanchjou', ru: 'Гуанчжоу', en: 'Guangzhou' } as Record<Lang, string> },
  dostyk: { x: 504.7, y: 173.7, name: { uz: 'Dostiq', ru: 'Достык', en: 'Dostyk' } as Record<Lang, string> },
  kashgar: { x: 393.7, y: 366.5, name: { uz: 'Qashqar', ru: 'Кашгар', en: 'Kashgar' } as Record<Lang, string> },
  irkeshtam: { x: 342.7, y: 359.8, name: { uz: 'Irkeshtam', ru: 'Иркештам', en: 'Irkeshtam' } as Record<Lang, string> },
  osh: { x: 315.1, y: 332.4, name: { uz: 'Oʻsh', ru: 'Ош', en: 'Osh' } as Record<Lang, string> },
  andijan: { x: 303.8, y: 324.3, name: { uz: 'Andijon', ru: 'Андижан', en: 'Andijan' } as Record<Lang, string> },
};
