import { defaultLang, langPrefix, locales, type Lang } from './config';

/**
 * Every static page of the site, with its localized slug.
 * Item pages (services, guides) append the item's own localized slug.
 */
export const routeSlugs = {
  home: { uz: '', ru: '', en: '' },
  services: { uz: 'xizmatlar', ru: 'uslugi', en: 'services' },
  pricing: { uz: 'narxlar', ru: 'ceny', en: 'pricing' },
  calculator: { uz: 'kalkulyator', ru: 'kalkulyator', en: 'calculator' },
  tracking: { uz: 'kuzatuv', ru: 'otslezhivanie', en: 'tracking' },
  about: { uz: 'biz-haqimizda', ru: 'o-nas', en: 'about' },
  faq: { uz: 'savol-javob', ru: 'faq', en: 'faq' },
  contact: { uz: 'aloqa', ru: 'kontakty', en: 'contact' },
  guides: { uz: 'qollanma', ru: 'gid', en: 'guides' },
  privacy: { uz: 'maxfiylik', ru: 'konfidencialnost', en: 'privacy' },
} as const satisfies Record<string, Record<Lang, string>>;

export type PageKey = keyof typeof routeSlugs;

/** Build a localized, trailing-slash path. `sub` is an item slug already localized. */
export function pagePath(lang: Lang, key: PageKey, sub?: string): string {
  const slug = routeSlugs[key][lang];
  const parts = [slug, sub].filter((p): p is string => Boolean(p));
  const path = parts.length ? `/${parts.join('/')}/` : '/';
  return `${langPrefix(lang)}${path}`;
}

/** Absolute URL for hreflang / canonical. */
export function pageUrl(site: URL | string, lang: Lang, key: PageKey, sub?: string): string {
  return new URL(pagePath(lang, key, sub), site).toString();
}

/**
 * hreflang alternates for a page. `subs` maps each locale to the item slug in
 * that locale (omit for static pages). Locales missing from `subs` are skipped.
 */
export function alternates(
  site: URL | string,
  key: PageKey,
  subs?: Partial<Record<Lang, string>>,
): Array<{ lang: Lang; href: string }> {
  return locales
    .filter((l) => !subs || subs[l] !== undefined)
    .map((l) => ({ lang: l, href: pageUrl(site, l, key, subs?.[l]) }));
}

export { defaultLang };
