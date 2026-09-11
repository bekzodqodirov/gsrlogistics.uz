/**
 * Locale registry.
 *
 * The site publishes FOUR locales but only THREE of them are written by hand:
 *
 *   uz   Uzbek, Latin script  — the source of truth, at the site root
 *   ru   Russian              — /ru/
 *   en   English              — /en/
 *   uzc  Uzbek, Cyrillic      — /kirill/, GENERATED from `uz` by transliteration
 *
 * ── Why there are two language types ──────────────────────────────────────────────────────
 *
 * `SourceLang` is the set a content file must provide: uz, ru, en. Nineteen i18n modules and
 * a handful of data modules declare `Record<Lang, T> = { uz, ru, en }`, and none of them should
 * ever have to grow a fourth branch — a hand-maintained Cyrillic copy is exactly what this
 * locale exists to avoid. So `Lang` still means those three, `Localized<T>` is the type new
 * code should reach for (three required, `uzc` optional), and `Locale` is the wider set used
 * by routing, hreflang and the language switcher.
 *
 * TypeScript cannot have this both ways: `Record<K, T>` has no way to make one member of K
 * optional, so widening `Lang` to include 'uzc' would break all 25 of those declarations at
 * once. Keeping `Lang` at three keeps them valid, unedited, and honest — none of them provides
 * a Cyrillic branch, and none of them needs to.
 *
 * ── Where the Cyrillic text comes from ────────────────────────────────────────────────────
 *
 * `pick(locale, record)` returns `record.uzc` when a file provides one and otherwise
 * transliterates the `uz` branch through `src/lib/cyrillic.ts`, memoised per record object.
 *
 * The Cyrillic exists BEFORE the HTML is assembled: every component takes a `Locale` and every
 * string goes through `pick`. It is not produced by transliterating a rendered page, because the
 * calculator and the two forms ship their whole i18n payload inside an HTML attribute, which a
 * text-node pass cannot reach — that route left the calculator computing in Latin under Cyrillic
 * chrome. See the architecture note that settled it.
 */
import { toCyrillic } from '@/lib/cyrillic';

/** The three hand-written locales — the only branches a content file must provide. */
export const sourceLocales = ['uz', 'ru', 'en'] as const;
export type SourceLang = (typeof sourceLocales)[number];

/**
 * Historical name for {@link SourceLang}. 25 modules declare `Record<Lang, T>` and every page
 * component takes `lang: Lang`; both mean "one of the three hand-written locales".
 */
export type Lang = SourceLang;

/** Every locale the site publishes, including the generated Cyrillic one. */
export const locales = ['uz', 'ru', 'en', 'uzc'] as const;
export type Locale = (typeof locales)[number];

export const defaultLang: SourceLang = 'uz';

/**
 * A value in every locale: the three hand-written ones are required, the generated Cyrillic one
 * is optional. A `Record<Lang, T>` literal satisfies this unchanged, which is the point.
 */
export type Localized<T> = Record<SourceLang, T> & Partial<Record<'uzc', T>>;

export interface LocaleMeta {
  label: string;
  short: string;
  /** BCP-47, for `<html lang>`, hreflang and `lang` attributes. */
  htmlLang: string;
  ogLocale: string;
  dir: 'ltr';
  /** The hand-written locale this one is written in or generated from. */
  source: SourceLang;
}

export const langMeta: Record<Locale, LocaleMeta> = {
  uz: { label: 'Oʻzbekcha', short: 'Oʻz', htmlLang: 'uz-Latn', ogLocale: 'uz_UZ', dir: 'ltr', source: 'uz' },
  uzc: { label: 'Ўзбекча', short: 'Ўз', htmlLang: 'uz-Cyrl', ogLocale: 'uz_Cyrl_UZ', dir: 'ltr', source: 'uz' },
  ru: { label: 'Русский', short: 'Ру', htmlLang: 'ru', ogLocale: 'ru_RU', dir: 'ltr', source: 'ru' },
  en: { label: 'English', short: 'En', htmlLang: 'en', ogLocale: 'en_US', dir: 'ltr', source: 'en' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Back-compat alias of {@link isLocale}. */
export const isLang = isLocale;

/** The hand-written locale a locale is rendered from: uzc → uz, everything else → itself. */
export function sourceOf(locale: Locale): SourceLang {
  return langMeta[locale].source;
}

/**
 * '' for the default locale, '/ru', '/en', '/kirill' otherwise.
 *
 * The Cyrillic prefix is ASCII on purpose: it is a routing namespace, not a keyword. The
 * keywords are the slugs that follow it, and those are Cyrillic (see `routes.ts`).
 */
export function langPrefix(locale: Locale): string {
  return locale === defaultLang ? '' : locale === 'uzc' ? '/kirill' : `/${locale}`;
}

/** Resolve the locale from a pathname such as '/ru/uslugi/' or '/kirill/нархлар/'. */
export function langFromPath(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  if (first === 'kirill') return 'uzc';
  return isLocale(first) && first !== 'uzc' ? first : defaultLang;
}

/* ── pick ─────────────────────────────────────────────────────────────────────────────────── */

/**
 * Transliterated `uz` branches, keyed by the record they came from. A build calls `pick()`
 * thousands of times; without this, every call on a uzc page would walk and transliterate the
 * whole subtree again. Keyed by the record object so the entry dies with the module.
 */
const cyrillicBranch = new WeakMap<object, unknown>();

/** Read the value at one key/index of a twin branch, or undefined if the shape does not line up. */
function at(value: unknown, key: string | number): unknown {
  return value === null || typeof value !== 'object' ? undefined : (value as Record<string | number, unknown>)[key];
}

/**
 * Deep copy of the `uz` branch with every string of PROSE transliterated, walked alongside the `ru`
 * and `en` branches of the same record.
 *
 * ── Why the twins are needed ──────────────────────────────────────────────────────────────────
 *
 * A localized record is not all prose. `common.nav[].key` is a `PageKey`, `segments.items[].icon`
 * is an `IconName`, `why.reasons[].link` names a service. Those are identifiers that the component
 * feeds straight back into `pagePath`, `Icon` or `serviceByKey`, and transliterating one turns
 * `'services'` into a word — which is either a crash (`pagePath` on an unknown key) or, worse, a
 * silent dead link and a blank icon.
 *
 * A name list ("skip anything called `link`") cannot tell them apart: `why.reasons[].link` is an
 * identifier and `trackSystem.shot.link` is a sentence. The values can:
 *
 *   A string that is BYTE-IDENTICAL in Uzbek, Russian and English is not Uzbek prose.
 *
 * Russian prose is Cyrillic and English prose is English, so three identical branches mean the
 * string is a token, a brand, a number or a unit — none of which the transliterator should touch,
 * and all of which it already leaves alone when it does. scripts/test-locale-tree.mjs closes the
 * loop: it collects every string this rule skips across the real content and fails if any of them
 * would have changed under `toCyrillic`, so the rule can never quietly leave Latin prose on a
 * Cyrillic page.
 */
function deepCyrillic(uz: unknown, ru: unknown, en: unknown): unknown {
  if (typeof uz === 'string') return uz === ru && uz === en ? uz : toCyrillic(uz);
  if (Array.isArray(uz)) return uz.map((v, i) => deepCyrillic(v, at(ru, i), at(en, i)));
  if (uz instanceof Date) return uz;
  if (uz && typeof uz === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(uz as Record<string, unknown>)) out[k] = deepCyrillic(v, at(ru, k), at(en, k));
    return out;
  }
  return uz;
}

/**
 * Pick a localized value.
 *
 * For uzc: the file's own `uzc` branch if it has one, otherwise the `uz` branch transliterated.
 * Nothing in the repo provides a `uzc` branch today and nothing has to — the override exists so
 * that a single stubborn sentence can be hand-corrected without forking the whole file.
 */
export function pick<T>(locale: Locale, record: Localized<T>): T {
  if (locale !== 'uzc') return record[locale] ?? record[defaultLang];
  if (record.uzc !== undefined) return record.uzc;
  const cached = cyrillicBranch.get(record);
  if (cached !== undefined) return cached as T;
  const generated = deepCyrillic(record[defaultLang], record.ru, record.en) as T;
  cyrillicBranch.set(record, generated);
  return generated;
}
