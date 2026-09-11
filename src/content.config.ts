import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Guides: markdown files at src/content/guides/<lang>/<slug>.md
 * `translationKey` links the language versions of one article for hreflang.
 *
 * `uz`, `ru` and `en` are written by hand. `uzc` (Uzbek Cyrillic) is GENERATED from `uz` by
 * scripts/generate-cyrillic-guides.mjs on every build (npm prebuild) and is gitignored — its
 * files are never edited, and a change made there is lost on the next build.
 */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(320),
    lang: z.enum(['uz', 'ru', 'en', 'uzc']),
    translationKey: z.string(),
    slug: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    author: z.string().default('GSR Logistics'),
    tags: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    sources: z.array(z.object({ title: z.string(), url: z.string(), date: z.string().optional() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { guides };
