/**
 * The works blocks — "Ishlarimizdan lavhalar" (src/content/works/, one folder per block; the schema
 * and the folder layout are explained in src/content.config.ts). Build-time only: it reads the
 * collection and the disk, so no browser script may import it.
 *
 * ── Texts ────────────────────────────────────────────────────────────────────────────────────
 *
 * A block's `title` and `text` carry the hand-written languages. `uzc` is the `uz` text transliterated,
 * always. Every other locale shows its OWN text or none: `blockText()` never falls back to another
 * language, so a block without Chinese text shows its media and its date on /zh/ and nothing else.
 * The build prints one note listing such blocks (`noteMissing`); scripts/check-content.mjs fails the
 * build if a page shows a block's text in a language other than its own.
 *
 * ── The video file ───────────────────────────────────────────────────────────────────────────
 *
 * The MP4 stays in the block's folder. `import.meta.glob(…, { query: '?url' })` hands every one of
 * them to Vite, which copies it into the build under /_astro/ with a content hash in its name — the
 * same mechanism Base.astro uses for the font files — so the page links the hashed URL, and a new
 * file always gets a new URL (no stale cache). A block naming a file that is not there fails the build.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { toCyrillic } from '@/lib/cyrillic';
import { sourceLocales, type Locale, type SourceLang } from '@/i18n/config';

/** Every MP4 in a block folder → its URL in the build ('/_astro/<name>.<hash>.mp4'). */
const VIDEO_URLS = import.meta.glob<string>('/src/content/works/*/*.{mp4,MP4}', { query: '?url', import: 'default', eager: true });

type BlockText = Partial<Record<SourceLang, string>>;

export interface Work {
  /** The folder name, which is also the block's anchor on the page: '2026-11-11-route-video'. */
  id: string;
  date: Date;
  /** The date as YYYY-MM-DD (for `<time datetime>` and JSON-LD). */
  iso: string;
  title: BlockText & { uz: string };
  text?: BlockText & { uz: string };
  video?: {
    /** Site-relative URL of the MP4 in the build. */
    url: string;
    poster: ImageMetadata;
    /** Seconds, when the frontmatter gives it. */
    duration?: number;
  };
  photos: Array<{ src: ImageMetadata; alt?: BlockText }>;
}

const toWork = (e: CollectionEntry<'works'>): Work => {
  const d = e.data;
  let video: Work['video'];
  if (d.video) {
    // filePath: 'src/content/works/<id>/index.md' → the glob key '/src/content/works/<id>/<file>.mp4'.
    const folder = (e.filePath ?? `src/content/works/${e.id}/index.md`).replace(/\\/g, '/').replace(/\/index\.md$/, '');
    const key = `/${folder}/${d.video.replace(/^\.\//, '')}`;
    const url = VIDEO_URLS[key];
    if (!url) throw new Error(`[works] ${e.id}: video "${d.video}" is not in ${folder}/ — put the MP4 into the block's folder (README: «Yangi blok qoʻshish»).`);
    // The schema requires a poster whenever there is a video.
    video = { url, poster: d.poster!, duration: d.duration };
  }
  return {
    id: e.id,
    date: d.date,
    iso: d.date.toISOString().slice(0, 10),
    title: d.title,
    text: d.text,
    video,
    photos: d.photos,
  };
};

let cache: Promise<Work[]> | undefined;

/** Every published block (no drafts), newest first; blocks of one day in reverse folder order. */
export function getWorks(): Promise<Work[]> {
  cache ??= getCollection('works', (e) => !e.data.draft).then((entries) => {
    const works = entries.map(toWork).sort((a, b) => b.date.getTime() - a.date.getTime() || b.id.localeCompare(a.id));
    noteMissing(works);
    return works;
  });
  return cache;
}

/**
 * The text a locale shows for a map of block texts: its own, `uz` transliterated for uzc, and
 * otherwise nothing — never another language's.
 */
export function localText(map: BlockText | undefined, lang: Locale): string | undefined {
  if (!map) return undefined;
  if (lang === 'uzc') return map.uz ? toCyrillic(map.uz) : undefined;
  return map[lang];
}

/** A block's title and text in one locale (see `localText`). */
export function blockText(work: Work, lang: Locale): { title?: string; text?: string } {
  return { title: localText(work.title, lang), text: localText(work.text, lang) };
}

/**
 * Once per build: the blocks whose title (or text, where the block has one) is missing in a
 * hand-written language. A note, not an error — that language's pages show the block's media and
 * date only, or its title without the text.
 */
function noteMissing(works: Work[]) {
  const lines = works.flatMap((w) => {
    const gaps = sourceLocales
      .map((l) => ({ l, what: [!w.title[l] && 'title', w.text && !w.text[l] && 'text'].filter(Boolean) }))
      .filter((g) => g.what.length)
      .map((g) => `${g.l} (${g.what.join(', ')})`);
    return gaps.length ? [`  ${w.id}: no ${gaps.join(', ')}`] : [];
  });
  if (lines.length) console.warn(`\n[works] note: blocks without their own text in some languages — those pages show the media and the date without it:\n${lines.join('\n')}`);
}
