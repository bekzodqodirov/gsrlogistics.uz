import { defaultLang, langPrefix, locales, type Locale, type Localized } from './config';

/**
 * Every static page of the site, with its localized slug.
 * Item pages (services, guides) append the item's own localized slug.
 *
 * ── The Cyrillic slugs ────────────────────────────────────────────────────────────────────
 *
 * They are WRITTEN OUT here, never computed, because a slug is permanent: the moment one is
 * indexed, changing it costs a redirect and a ranking. Computing them at runtime would mean a
 * change in the transliterator could silently rewrite live URLs.
 *
 * Each one was transliterated from the Uzbek WORD, not from the ASCII slug — the ASCII slug has
 * already lost the letters that decide the answer. `qollanma` slugifies to `қолланма`, but the
 * word is `Qoʻllanma` → `қўлланма`; `kargo-lugati` → `карго-лугати`, but `lugʻati` → `луғати`;
 * `temir-yol` → `темир-ёл`, but `yoʻl` → `йўл`. Every entry below was checked by eye against the
 * word the page actually uses.
 */
export const routeSlugs = {
  home: { uz: '', ru: '', en: '', uzc: '' },
  services: { uz: 'xizmatlar', ru: 'uslugi', en: 'services', uzc: 'хизматлар' },
  pricing: { uz: 'narxlar', ru: 'ceny', en: 'pricing', uzc: 'нархлар' },
  // kalkulyator → калькулятор: the soft sign is part of the word, and it is what a Cyrillic
  // searcher types. `toCyrillicSlug` drops ь by slug convention; here the spelling wins.
  calculator: { uz: 'kalkulyator', ru: 'kalkulyator', en: 'calculator', uzc: 'калькулятор' },
  tracking: { uz: 'kuzatuv', ru: 'otslezhivanie', en: 'tracking', uzc: 'кузатув' },
  about: { uz: 'biz-haqimizda', ru: 'o-nas', en: 'about', uzc: 'биз-ҳақимизда' },
  faq: { uz: 'savol-javob', ru: 'faq', en: 'faq', uzc: 'савол-жавоб' },
  contact: { uz: 'aloqa', ru: 'kontakty', en: 'contact', uzc: 'алоқа' },
  guides: { uz: 'qollanma', ru: 'gid', en: 'guides', uzc: 'қўлланма' },
  privacy: { uz: 'maxfiylik', ru: 'konfidencialnost', en: 'privacy', uzc: 'махфийлик' },
} as const satisfies Record<string, Localized<string>>;

export type PageKey = keyof typeof routeSlugs;

/**
 * Cyrillic slugs of the SERVICE pages, keyed by the Uzbek Latin slug in `src/data/services.ts`.
 * Checked by eye: `temir-yol-konteyner` is `Temir yoʻl konteyner` → `темир-йўл-контейнер`, and
 * `avtomobil-importi` is `Avtomobil importi` → `автомобиль-импорти` (soft sign, as in the word).
 */
export const serviceSlugsUzc: Record<string, string> = {
  'avto-kargo': 'авто-карго',
  'avia-kargo': 'авиа-карго',
  'temir-yol-konteyner': 'темир-йўл-контейнер',
  'tovar-topish': 'товар-топиш',
  'sotib-olish': 'сотиб-олиш',
  'uskunalar-importi': 'ускуналар-импорти',
  bojxona: 'божхона',
  'ombor-sifat-nazorati': 'омбор-сифат-назорати',
  'avtomobil-importi': 'автомобиль-импорти',
};

/**
 * Cyrillic slugs of the GUIDE pages, keyed by the Uzbek Latin slug in `src/data/guides.ts`.
 * Checked by eye against each article's own title: `tolovlari` is `toʻlovlari` → `тўловлари`,
 * `yonalishlar` is `yoʻnalishlar` → `йўналишлар`, and the Yiwu/Guangzhou article is called
 * "Ivu va Guanchjou bozorlari" on the site, so the slug follows the page, not the English names.
 */
export const guideSlugsUzc: Record<string, string> = {
  '1688-orqali-buyurtma-berish': '1688-орқали-буюртма-бериш',
  'avia-avto-temir-yol-taqqoslash': 'авиа-авто-темир-йўл-таққослаш',
  'bojxona-tolovlari-2026': 'божхона-тўловлари-2026',
  'kargo-lugati': 'карго-луғати',
  'kargo-narxlari-qanday-hisoblanadi': 'карго-нархлари-қандай-ҳисобланади',
  'taqiqlangan-tovarlar': 'тақиқланган-товарлар',
  'xitoydan-ishlab-chiqaruvchi-topish': 'хитойдан-ишлаб-чиқарувчи-топиш',
  'xitoydan-toshkentga-yonalishlar': 'хитойдан-тошкентга-йўналишлар',
  'xitoydan-yuk-olib-kelish': 'хитойдан-юк-олиб-келиш',
  'yiwu-va-guangzhou-bozorlari': 'иву-ва-гуанчжоу-бозорлари',
};

/**
 * The Cyrillic item slug for an Uzbek Latin one. Throws rather than guessing: a new guide or
 * service with no entry above would otherwise ship a page whose Cyrillic sibling silently
 * disappears from hreflang, which is the one failure nobody notices for a month.
 */
export function uzcSub(key: PageKey, uzSub: string): string {
  const table = key === 'services' ? serviceSlugsUzc : key === 'guides' ? guideSlugsUzc : undefined;
  const hit = table?.[uzSub];
  if (!hit) throw new Error(`No Cyrillic slug for ${key} "${uzSub}" — add it to src/i18n/routes.ts`);
  return hit;
}

/** Build a localized, trailing-slash path. `sub` is an item slug already localized. */
export function pagePath(locale: Locale, key: PageKey, sub?: string): string {
  const slug = routeSlugs[key][locale];
  const parts = [slug, sub].filter((p): p is string => Boolean(p));
  const path = parts.length ? `/${parts.join('/')}/` : '/';
  return `${langPrefix(locale)}${path}`;
}

/**
 * Absolute URL for hreflang / canonical / sitemap.
 *
 * `URL` percent-encodes the Cyrillic slugs (RFC 3986), which is deliberate: canonical, hreflang
 * and `<loc>` must all carry the same bytes for a crawler to treat them as one URL, and the
 * escaped form is the only one every crawler parses identically. Visible `href`s keep the raw
 * UTF-8 (see `pagePath`) — browsers encode those on the way out to exactly this string.
 */
export function pageUrl(site: URL | string, locale: Locale, key: PageKey, sub?: string): string {
  return new URL(pagePath(locale, key, sub), site).toString();
}

/**
 * The item slug of one page in one locale.
 *
 * Call this instead of `subs[locale]` anywhere a page resolves its OWN slug — canonical, the
 * current path, the language switcher. Most `subs` maps are `Record<Lang, string>` built from
 * content that only knows the three hand-written locales, so `subs['uzc']` is `undefined` and a
 * Cyrillic service page would canonicalise itself to `/kirill/хизматлар/` — the index, not the
 * page. Here uzc falls back to the hand-written table above, which is the whole point of it.
 */
export function subFor(locale: Locale, key: PageKey, subs: Partial<Record<Locale, string>>): string | undefined {
  if (locale !== 'uzc') return subs[locale];
  if (subs.uzc !== undefined) return subs.uzc;
  return subs.uz === undefined ? undefined : uzcSub(key, subs.uz);
}

/**
 * Path / absolute URL of an ITEM page (a service, a guide) from its per-locale slug map.
 *
 * Use these, never `pagePath(locale, key, pick(locale, slugs))`. `pick` transliterates, and a slug
 * is not a word to transliterate — `temir-yol-konteyner` would come out as a letter-by-letter
 * reading of the ASCII, not as `темир-йўл-контейнер`, which is the URL this site publishes. The
 * Cyrillic slugs live in the tables above and `subFor` is the only thing that may read them.
 */
export function itemPath(locale: Locale, key: PageKey, subs: Partial<Record<Locale, string>>): string {
  return pagePath(locale, key, subFor(locale, key, subs));
}
export function itemUrl(site: URL | string, locale: Locale, key: PageKey, subs: Partial<Record<Locale, string>>): string {
  return pageUrl(site, locale, key, subFor(locale, key, subs));
}

/**
 * hreflang alternates for a page. `subs` maps each locale to the item slug in that locale (omit
 * for static pages). Locales missing from `subs` are skipped — uzc is derived from `subs.uz`, so
 * an item page that exists in Uzbek always has a Cyrillic sibling.
 */
export function alternates(
  site: URL | string,
  key: PageKey,
  subs?: Partial<Record<Locale, string>>,
): Array<{ lang: Locale; href: string }> {
  return locales
    .filter((l) => !subs || subFor(l, key, subs) !== undefined)
    .map((l) => ({ lang: l, href: pageUrl(site, l, key, subs ? subFor(l, key, subs) : undefined) }));
}

export { defaultLang };
