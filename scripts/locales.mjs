/**
 * The locale table every build and test script reads — ONE copy instead of one per script.
 *
 * It mirrors `langMeta` and `langPrefix()` in src/i18n/config.ts (scripts/test-locale.mjs asserts
 * that it does, field by field, in the same order as `locales`). The scripts cannot import
 * config.ts itself: they run under plain Node after the build, and config.ts pulls in the
 * transliterator and TypeScript.
 *
 *   code      the site's locale key (`Locale` in config.ts)
 *   htmlLang  BCP-47 tag: `<html lang>`, hreflang, `inLanguage` in JSON-LD
 *   prefix    URL prefix: '' for the default locale at the site root
 *   ogLocale  og:locale
 *   dir       text direction of the whole document
 *   name      English name, for reports and llms-full.txt
 *
 * ── Pending locales ───────────────────────────────────────────────────────────────────────────
 *
 * `PENDING` is read from the `type PendingLang = …` line of src/i18n/config.ts, the same line that
 * makes a locale's branches optional for the compiler and sends `pick()` to the English fallback.
 * While a locale is pending, the scripts REPORT what it still lacks (untranslated text, a guide
 * with no translation, a record without its branch) instead of failing on it. Flipping that line
 * to `type PendingLang = never;` switches the compiler and every script here at once: the compiler
 * then requires every branch and every script treats the locale as finished, with no second list
 * for the scripts to keep in step. (config.ts states the same fact as a value, `pendingLocales`,
 * for the service loader; `astro check` fails until its flags agree with the line, and
 * scripts/test-locale.mjs asserts that they do.)
 *
 * `GSR_PENDING_LOCALES` (comma-separated codes, or `none`) overrides the line for one run, so the
 * strict post-flip behaviour can be exercised without editing config.ts.
 */
import { readFileSync } from 'node:fs';

/** In the order of `locales` in src/i18n/config.ts. */
export const LOCALES = {
  uz: { code: 'uz', htmlLang: 'uz-Latn', prefix: '', ogLocale: 'uz_UZ', dir: 'ltr', name: 'Uzbek (Latin)' },
  ru: { code: 'ru', htmlLang: 'ru', prefix: '/ru', ogLocale: 'ru_RU', dir: 'ltr', name: 'Russian' },
  en: { code: 'en', htmlLang: 'en', prefix: '/en', ogLocale: 'en_US', dir: 'ltr', name: 'English' },
  uzc: { code: 'uzc', htmlLang: 'uz-Cyrl', prefix: '/kirill', ogLocale: 'uz_Cyrl_UZ', dir: 'ltr', name: 'Uzbek (Cyrillic)' },
  zh: { code: 'zh', htmlLang: 'zh-Hans', prefix: '/zh', ogLocale: 'zh_CN', dir: 'ltr', name: 'Chinese (Simplified)' },
  fa: { code: 'fa', htmlLang: 'fa', prefix: '/fa', ogLocale: 'fa_IR', dir: 'rtl', name: 'Persian' },
};
export const LOCALE_CODES = Object.keys(LOCALES);
/** The x-default target: the Uzbek Latin page. */
export const DEFAULT_LOCALE = 'uz';

/** hreflang tag → locale code. */
export const CODE_BY_HREFLANG = Object.fromEntries(Object.values(LOCALES).map((l) => [l.htmlLang, l.code]));

/** The site path of a locale's home page: '/', '/ru/', '/kirill/', … */
export const homePath = (code) => `${LOCALES[code].prefix}/`;

/**
 * The locale a site path belongs to — the same answer as `langFromPath()` in config.ts: the first
 * path segment names the locale ('kirill' for uzc), anything else is the default locale.
 */
export function localeOfPath(pathname) {
  const first = String(pathname).split('/').filter(Boolean)[0];
  if (first === 'kirill') return 'uzc';
  return first && first !== 'uzc' && first !== DEFAULT_LOCALE && first in LOCALES ? first : DEFAULT_LOCALE;
}

/** Strip a locale's prefix from a site path: ('/zh/pricing/', 'zh') → '/pricing/'. */
export const unprefixed = (pathname, code) => {
  const { prefix } = LOCALES[code];
  return prefix && (pathname === prefix || pathname.startsWith(prefix + '/')) ? pathname.slice(prefix.length) || '/' : pathname;
};

/** Parse the `type PendingLang = …;` line of config.ts source text into a list of locale codes. */
export function parsePending(source) {
  const m = /^\s*(?:export\s+)?type\s+PendingLang\s*=\s*([^;]+);/m.exec(source);
  if (!m) throw new Error('scripts/locales.mjs: no `type PendingLang = …;` line in src/i18n/config.ts');
  const body = m[1].trim();
  if (body === 'never') return [];
  const codes = body.split('|').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
  for (const c of codes) if (!(c in LOCALES)) throw new Error(`scripts/locales.mjs: PendingLang names "${c}", which is not a locale`);
  return codes;
}

const override = process.env.GSR_PENDING_LOCALES;
/** Locales whose hand-written branches are still being written (see the header). */
export const PENDING = new Set(
  override !== undefined
    ? override.split(',').map((s) => s.trim()).filter((s) => s && s !== 'none')
    : parsePending(readFileSync(new URL('../src/i18n/config.ts', import.meta.url), 'utf8')),
);
for (const c of PENDING) if (!(c in LOCALES)) throw new Error(`GSR_PENDING_LOCALES names "${c}", which is not a locale`);
export const isPending = (code) => PENDING.has(code);
