// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Four locales, three of them written by hand. `uzc` is Uzbek in Cyrillic, generated from `uz`
 * by transliteration (src/i18n/config.ts → `pick`), and it is served from `/kirill/`.
 *
 * The path segment and the language code are deliberately different strings:
 *   · `path: 'kirill'` is the routing namespace and is ASCII so the prefix itself can be typed,
 *     linked and logged anywhere; the Cyrillic keywords are the slugs that follow it.
 *   · `codes: ['uz-Cyrl']` is the BCP-47 tag that goes in `<html lang>`, hreflang, `og:locale`
 *     and JSON-LD `inLanguage`. Both Uzbek locales must carry their script subtag — `uz-Latn`
 *     and `uz-Cyrl` — or a crawler reads one as a duplicate of the other.
 *
 * `routing` is unchanged: the default locale keeps the bare root and nothing redirects, so adding
 * this locale cannot move a single existing URL.
 */
// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://gsrlogistics.uz',
  trailingSlash: 'always',
  compressHTML: true,
  build: { format: 'directory', inlineStylesheets: 'auto' },
  i18n: {
    defaultLocale: 'uz',
    locales: ['uz', 'ru', 'en', { path: 'kirill', codes: ['uz-Cyrl'] }],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // Keyed by the path segment, valued by the hreflang code. `scripts/generate-sitemap.mjs`
      // rewrites sitemap-0.xml after the build from each page's own <link rel="alternate">, so
      // this map only has to agree with it — it does.
      i18n: { defaultLocale: 'uz', locales: { uz: 'uz', ru: 'ru', en: 'en', kirill: 'uz-Cyrl' } },
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
});
