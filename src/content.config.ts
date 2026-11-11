import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Guides: markdown files at src/content/guides/<lang>/<slug>.md
 * `translationKey` links the language versions of one article for hreflang.
 *
 * `uz`, `ru`, `en`, `zh` and `fa` are written by hand. `uzc` (Uzbek Cyrillic) is GENERATED from `uz` by
 * scripts/generate-cyrillic-guides.mjs on every build (npm prebuild) and is gitignored — its
 * files are never edited, and a change made there is lost on the next build.
 */
const guides = defineCollection({
  // The entry id is the file's path ('en/prohibited-goods', 'zh/prohibited-goods'), never the
  // frontmatter slug: zh and fa articles share the English slug, and the loader's default id
  // (data.slug) would make the three silently overwrite one another.
  loader: glob({ pattern: '**/*.md', base: './src/content/guides', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(320),
    lang: z.enum(['uz', 'ru', 'en', 'uzc', 'zh', 'fa']),
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

/**
 * Works — "Ishlarimizdan lavhalar": videos and photos of the work in progress, shown newest first on
 * the `works` page (/ishlarimiz/) and, the latest three, on the home page.
 *
 * ONE FOLDER PER BLOCK, so the owner adds a block by adding a folder:
 *
 *   src/content/works/2026-11-11-route-video/
 *     index.md       frontmatter only — the date, the media and the texts below
 *     *.mp4          the video, if any (H.264 MP4, re-encoded as the README says)
 *     poster.jpg     the video's poster frame
 *     *.jpg …        photos, if any
 *
 * The media stay in the folder and are built from there: the MP4 through Vite (src/lib/works.ts globs
 * every *.mp4 here with ?url, so it ships under /_astro/ with a hashed name), the poster and the photos
 * through `image()`, so Astro optimises them.
 *
 * `title` and `text` hold the hand-written languages: `uz` is required and is the source; `uzc` is
 * NEVER written here, it is always transliterated from `uz`. A language left out gets NO text on its
 * pages — the block shows its media and its date there, never another language's words — and the
 * build prints a note naming the block and the languages it lacks (src/lib/works.ts).
 * scripts/check-content.mjs checks after the build that every block's media exist, that no video is
 * over 50 MB, and that no locale shows a block's text in another language.
 */
/** A text one language may leave out: a blank value counts as left out. */
const optText = z.string().trim().optional().transform((s) => s || undefined);
/** A title or text: `uz` required, the other hand-written languages optional, nothing else (no `uzc`). */
const blockText = z.strictObject({
  uz: z.string().trim().min(1, { error: 'oʻzbekcha matn shart' }),
  ru: optText,
  en: optText,
  zh: optText,
  fa: optText,
});
/** A photo's alt: every language optional (a missing one falls back to the block's title in that language). */
const altText = z.strictObject({ uz: optText, ru: optText, en: optText, zh: optText, fa: optText });
const works = defineCollection({
  // The entry id is the folder name ('2026-11-11-route-video'): it is the block's anchor on the page.
  loader: glob({ pattern: '*/index.md', base: './src/content/works', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) =>
    z
      .strictObject({
        date: z.coerce.date(),
        /** An MP4 in the block's own folder, its name in Latin letters, digits, - and _: './gsr-route.mp4'. */
        video: z.string().regex(/^\.\/[A-Za-z0-9_-][A-Za-z0-9._-]*\.mp4$/i, { error: 'shu papkadagi .mp4 fayl, nomida faqat lotin harflari, raqam, - va _ (masalan ./video.mp4)' }).optional(),
        /** The video's poster frame (required with a video). */
        poster: image().optional(),
        /** The video's length in seconds — printed beside it and given to search engines. */
        duration: z.number().int().positive().optional(),
        photos: z.array(z.strictObject({ src: image(), alt: altText.optional() })).default([]),
        title: blockText,
        text: blockText.optional(),
        draft: z.boolean().default(false),
      })
      .refine((d) => d.video !== undefined || d.photos.length > 0, { error: 'blokda video yoki kamida bitta surat boʻlishi kerak', path: ['video'] })
      .refine((d) => d.video === undefined || d.poster !== undefined, { error: 'videoga poster kerak (masalan poster: ./poster.jpg)', path: ['poster'] }),
});

export const collections = { guides, works };
