/**
 * Locale registry. Uzbek (Latin) is the default and lives at the site root;
 * Russian and English are prefixed with /ru and /en.
 */
export const locales = ['uz', 'ru', 'en'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'uz';

export const langMeta: Record<
  Lang,
  { label: string; short: string; htmlLang: string; ogLocale: string; dir: 'ltr' }
> = {
  uz: { label: 'Oʻzbekcha', short: 'UZ', htmlLang: 'uz-Latn', ogLocale: 'uz_UZ', dir: 'ltr' },
  ru: { label: 'Русский', short: 'RU', htmlLang: 'ru', ogLocale: 'ru_RU', dir: 'ltr' },
  en: { label: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US', dir: 'ltr' },
};

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** '' for the default locale, '/ru' or '/en' otherwise. */
export function langPrefix(lang: Lang): string {
  return lang === defaultLang ? '' : `/${lang}`;
}

/** Resolve the locale from a pathname such as '/ru/uslugi/'. */
export function langFromPath(pathname: string): Lang {
  const first = pathname.split('/').filter(Boolean)[0];
  return isLang(first) ? first : defaultLang;
}

/** Pick a localized value from a {uz, ru, en} record. */
export function pick<T>(lang: Lang, record: Record<Lang, T>): T {
  return record[lang] ?? record[defaultLang];
}
