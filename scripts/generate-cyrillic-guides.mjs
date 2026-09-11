/**
 * Generate the Uzbek Cyrillic guide articles from the Latin ones.
 *
 *   src/content/guides/uz/*.md   →   src/content/guides/uzc/*.md
 *
 * Runs as npm's `prebuild` hook, so `npm run build` always regenerates before Astro reads the
 * content collection. The output folder is build output: it is gitignored, pruned on every run,
 * and byte-identical between runs (`--check` asserts that).
 *
 * Latin stays the single source of truth. Nothing in src/content/guides/uzc is ever edited by
 * hand — a change there is lost on the next build.
 *
 * ── What converts and what does not ────────────────────────────────────────────────────────
 *
 *   Frontmatter   `title`, `description`, `faq[].q/a` and `sources[].title` are prose and are
 *                 transliterated. `translationKey`, `publishDate`, `updatedDate`, `tags`,
 *                 `author`, `draft` and `sources[].url` are machinery and are copied byte for
 *                 byte. `lang` becomes `uzc`. `slug` becomes Cyrillic (see below).
 *   Markdown      Only human-readable text converts. Fenced code, inline code spans, HTML tags,
 *                 autolinks and link/image targets are copied out verbatim; headings, list
 *                 markers, table pipes, emphasis and blockquote markers are not letters, so they
 *                 pass through the transliterator untouched.
 *   Link text     Converts. Link HREF does not — except an internal link to another page of this
 *                 site, which is rewritten to its /kirill/ equivalent. A Cyrillic reader who
 *                 clicks "bojxona toʻlovlari" must stay in the Cyrillic site.
 *
 * ── Slugs ──────────────────────────────────────────────────────────────────────────────────
 *
 * The owner asked for Cyrillic slugs, because a Cyrillic keyword in the path is what a Cyrillic
 * query matches on: /kirill/қўлланма/карго-луғати/.
 *
 * The Cyrillic slug is built from the Latin slug word by word, so the two URLs stay parallel and
 * a redirect map is trivial. But the Latin slug is ASCII-folded — `qoʻllanma` was flattened to
 * `qollanma`, `toʻlovlari` to `tolovlari` — and transliterating that fold gives қолланма, which
 * is a different word. So each slug word is first RECOVERED to its real spelling by looking it up
 * in the article's own prose (title, description, FAQ, body): the article says "Kargo lugʻati",
 * so `lugati` → `lugʻati` → `луғати`. A slug word that appears nowhere in the prose fails the
 * build unless it is listed in SLUG_WORDS below with the reason.
 */

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { register } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const rel = (p) => path.relative(process.cwd(), p) || '.';

/* ── Let plain Node read the site's TypeScript modules ─────────────────────────────────────── */
// Astro resolves `@/x` and extensionless imports; Node does not. Same hook the transliterator
// tests use, so this script reads the site's real registries instead of a copy of them.
// Node ≥ 22.18 strips the types itself.
const HOOK = `
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const ROOT = ${JSON.stringify(ROOT.href)};
export async function resolve(spec, ctx, next) {
  let s;
  if (spec.startsWith('@/')) s = new URL('src/' + spec.slice(2), ROOT).href;
  else if (spec.startsWith('./') || spec.startsWith('../')) s = new URL(spec, ctx.parentURL ?? ROOT).href;
  else return next(spec, ctx);
  if (!['.ts', '.js', '.mjs', '.json'].some((e) => s.endsWith(e))) {
    for (const ext of ['.ts', '.js', '.json']) {
      if (existsSync(fileURLToPath(s + ext))) { s = s + ext; break; }
    }
  }
  return next(s, ctx);
}
`;
register('data:text/javascript,' + encodeURIComponent(HOOK));

const { toCyrillic, toCyrillicChunks, toCyrillicSlug } = await import(new URL('src/lib/cyrillic.ts', ROOT).href);
const routes = await import(new URL('src/i18n/routes.ts', ROOT).href);
const { routeSlugs } = routes;
/** The locale registry keeps the Cyrillic item slugs in these two tables (src/i18n/routes.ts). */
const serviceSlugsUzc = routes.serviceSlugsUzc ?? {};
const guideSlugsUzc = routes.guideSlugsUzc ?? {};
const { services } = await import(new URL('src/data/services.ts', ROOT).href);
const { common } = await import(new URL('src/i18n/common.ts', ROOT).href);
const { guideSlugs } = await import(new URL('src/data/guides.ts', ROOT).href);

/* ── Settings ──────────────────────────────────────────────────────────────────────────────── */

const SRC_DIR = fileURLToPath(new URL('src/content/guides/uz/', ROOT));
const OUT_DIR = fileURLToPath(new URL('src/content/guides/uzc/', ROOT));
/** The /kirill/ namespace prefix. ASCII on purpose: it is routing, not a keyword. */
const PREFIX = '/kirill';

/**
 * Slug words that exist ONLY in the ASCII slug and nowhere in the article's prose, so there is no
 * spelling to recover them from. Each maps to the Latin form the site itself uses for that name;
 * it is transliterated from there like any other word. Anything not listed here and not found in
 * the prose fails the build.
 */
const SLUG_WORDS = {
  // The slug uses the English romanisations; the Uzbek copy calls the cities Ivu (义乌) and
  // Guanchjou (广州), and those are the spellings a Cyrillic reader searches for.
  yiwu: 'Ivu',
  guangzhou: 'Guanchjou',
};

/**
 * Transliterate prose.
 *
 * This script used to carry its own hold-out table of Latin tokens that appear in the articles and
 * nowhere else on the site — Incoterms, Yiwugo, Huaqiang Electronics World, the cited publishers —
 * because src/lib/cyrillic.terms.ts had only ever been built from src/i18n and src/data and would
 * spell them out letter by letter (`Incoterms` → `Инcотермс`). Those entries now live in that file,
 * with the brands and Incoterm codes they belong beside, and the guide corpus is part of the
 * transliterator's own test suite (`node scripts/test-cyrillic.mjs`). So there is nothing left to
 * hold out here: one engine decides what stays Latin, for the guides and for the pages alike, and
 * the leftover guard below is what proves it.
 */
const toCyrillicProse = (text) => toCyrillic(text);

/** Frontmatter keys whose scalar value is prose and must be transliterated. */
const PROSE_KEYS = new Set(['title', 'description', 'q', 'a']);
/** Frontmatter keys copied byte for byte. `title` inside `sources` is handled as prose above. */
const VERBATIM_KEYS = new Set(['translationKey', 'publishDate', 'updatedDate', 'tags', 'author', 'draft', 'url', 'date']);

/* ── Small helpers ─────────────────────────────────────────────────────────────────────────── */

const APOSTROPHES = /[ʻʼ‘’'`´ʹ′‵ʽʿ]/g;
/** The fold that produced the ASCII slugs: drop apostrophes, lowercase, keep [a-z0-9]. */
const fold = (word) => word.replace(APOSTROPHES, '').toLowerCase().replace(/[^a-z0-9]/g, '');

const fail = (msg) => {
  console.error(`\ngenerate-cyrillic-guides: ${msg}\n`);
  process.exit(1);
};

/* ── Orthography recovery ──────────────────────────────────────────────────────────────────── */

/**
 * Index every Latin word of a document by its ASCII fold, so `lugati` can find `lugʻati`.
 * When a fold has several spellings the most frequent wins; a genuine tie between a spelling
 * with an apostrophe and one without is reported rather than guessed.
 */
function orthographyIndex(text) {
  const counts = new Map();
  for (const word of text.match(/[A-Za-zʻʼ‘’'`´ʹ′‵ʽʿ]+/g) ?? []) {
    const key = fold(word);
    if (!key) continue;
    const bucket = counts.get(key) ?? new Map();
    bucket.set(word, (bucket.get(word) ?? 0) + 1);
    counts.set(key, bucket);
  }
  const index = new Map();
  for (const [key, bucket] of counts) {
    const ranked = [...bucket].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const [best] = ranked;
    // Case and the flavour of apostrophe are noise (Kargo/kargo, oʻ/o‘). A tie between two
    // spellings that put the apostrophe in different places is a real ambiguity, and is reported.
    const spelling = (w) => w.toLowerCase().replace(APOSTROPHES, 'ʻ');
    const rival = ranked.find((r) => spelling(r[0]) !== spelling(best[0]));
    const ambiguous = rival && rival[1] === best[1];
    index.set(key, { word: best[0], ambiguous: ambiguous ? [best[0], rival[0]] : null });
  }
  return index;
}

/**
 * Cyrillic slug for a Latin slug, word by word, each word recovered to its real spelling first.
 * `bojxona-tolovlari-2026` → `божхона-тўловлари-2026`.
 */
function cyrillicSlug(latinSlug, index, where, problems, strict = true) {
  const parts = latinSlug.split('-').filter(Boolean).map((token) => {
    if (/^[0-9]+$/.test(token)) return token;
    const hit = index.get(fold(token));
    if (hit?.ambiguous) problems.push(`${where}: slug word "${token}" is spelled both ${hit.ambiguous.join(' and ')} in the article — no way to tell which the slug meant`);
    const source = SLUG_WORDS[token] ?? hit?.word;
    if (!source) {
      // Guide slugs are this script's own output, so an unrecoverable word is a build failure.
      // A fallback route segment is only a stand-in for the locale registry, so it transliterates
      // the bare token and says so — the registry, once it has uzc, overrules it anyway.
      if (strict) problems.push(`${where}: slug word "${token}" appears nowhere in the article's prose, so its real spelling (oʻ? gʻ?) cannot be recovered. Add it to SLUG_WORDS in scripts/generate-cyrillic-guides.mjs with a comment saying why.`);
      return toCyrillicSlug(token);
    }
    return toCyrillicSlug(source);
  });
  return parts.filter(Boolean).join('-');
}

/* ── Where an internal link goes in the Cyrillic site ──────────────────────────────────────── */

/**
 * Every internal path the Latin site can be linked to, mapped to its Cyrillic twin.
 * Built from the site's own registries (src/i18n/routes.ts, src/data/services.ts) so a renamed
 * page cannot leave a Cyrillic reader pointing at a Latin URL.
 *
 * The uzc slugs come from the registry once the locale is registered there. Until then they are
 * derived the same way the registry will derive them — transliterate the visible Uzbek label —
 * and the derivation is reported, so nobody mistakes it for a decision made here.
 */
function buildPathMap(guides, siteIndex) {
  const derived = [];
  const navLabel = new Map(common.uz.nav.map((n) => [n.key, n.label]));

  /** uzc segment for a route key: the registry's value, or the nav label transliterated. */
  const routeSegment = (key) => {
    const registered = routeSlugs[key]?.uzc;
    if (typeof registered === 'string') return registered;
    const label = navLabel.get(key);
    const latin = routeSlugs[key]?.uz ?? '';
    if (!latin) return '';
    // Recover the label's real spelling (`Qoʻllanma`) for the ASCII-folded slug (`qollanma`).
    const source = label && fold(label) === fold(latin) ? label : latin;
    const seg = cyrillicSlug(latin, orthographyIndex(source), `route/${key}`, derived, false);
    derived.push(`${key}: /${latin}/ → ${PREFIX}/${seg}/`);
    return seg;
  };

  const map = new Map();
  const add = (latinPath, cyrPath) => map.set(latinPath, cyrPath);

  for (const key of Object.keys(routeSlugs)) {
    const latin = routeSlugs[key].uz;
    const cyr = routeSegment(key);
    add(latin ? `/${latin}/` : '/', latin ? `${PREFIX}/${cyr}/` : `${PREFIX}/`);
  }

  const servicesSeg = routeSegment('services');
  for (const s of services) {
    const registered = serviceSlugsUzc[s.slug.uz] ?? s.slug.uzc;
    let seg = registered;
    if (typeof seg !== 'string') {
      // The service slug is ASCII-folded too (`temir-yol-konteyner`); recover it from the site's
      // own Uzbek copy, which spells the word properly (`Temir yoʻl va konteyner`).
      seg = cyrillicSlug(s.slug.uz, siteIndex, `services/${s.key}`, derived, false);
      derived.push(`service ${s.key}: /${routeSlugs.services.uz}/${s.slug.uz}/ → ${PREFIX}/${servicesSeg}/${seg}/`);
    }
    add(`/${routeSlugs.services.uz}/${s.slug.uz}/`, `${PREFIX}/${servicesSeg}/${seg}/`);
  }

  const guidesSeg = routeSegment('guides');
  for (const g of guides) {
    add(`/${routeSlugs.guides.uz}/${g.latinSlug}/`, `${PREFIX}/${guidesSeg}/${g.cyrSlug}/`);
  }

  return { map, derived, guidesSeg };
}

/* ── Markdown ──────────────────────────────────────────────────────────────────────────────── */

/**
 * One pass over a line of markdown. Everything that is not human-readable text is copied out:
 * code spans, HTML tags, autolinks, and the target of every link and image.
 */
const INLINE_SRC = [
    '(`+)([\\s\\S]*?)\\1', // 1,2  inline code span (any number of backticks)
    '(!?)\\[([^\\]]*)\\]\\(([^()\\s]*)((?:\\s+(?:"[^"]*"|\'[^\']*\'))?)\\)', // 3,4,5,6  link / image
    '<((?:https?:|mailto:|tel:)[^>\\s]*)>', // 7  autolink
    '<(/?[A-Za-z!][^>]*)>', // 8  HTML tag
].join('|');

function transformInline(text, ctx) {
  let out = '';
  let last = 0;
  // A fresh regex per call: this function recurses into link labels, and a shared /g regex's
  // lastIndex would be clobbered by the inner scan.
  const inline = new RegExp(INLINE_SRC, 'g');
  for (let m = inline.exec(text); m; m = inline.exec(text)) {
    out += toCyrillicProse(text.slice(last, m.index));
    last = m.index + m[0].length;
    if (m[1] !== undefined) out += m[0]; // code span, verbatim
    else if (m[3] !== undefined) {
      const [, , , bang, label, href, title] = m;
      // An image's alt text is prose; a link's label may itself contain code or emphasis.
      const text2 = bang ? toCyrillicProse(label) : transformInline(label, ctx);
      out += `${bang}[${text2}](${rewriteHref(href, ctx)}${title ? transformInline(title, ctx) : ''})`;
    } else out += m[0]; // autolink or HTML tag, verbatim
  }
  return out + toCyrillicProse(text.slice(last));
}

/** Link targets: external ones are untouched, internal ones move into the Cyrillic site. */
function rewriteHref(href, ctx) {
  if (href === '') return href;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return href; // http(s), mailto, tel, protocol-relative
  if (href.startsWith('#')) {
    // Heading ids are generated from the heading text, so a Cyrillic page has Cyrillic ids.
    ctx.problems.push(`${ctx.where}: in-page link "${href}" — heading ids change with the text, so this anchor has to be remapped. No guide uses one today; teach this function github-slugger when the first one appears.`);
    return href;
  }
  if (!href.startsWith('/')) {
    ctx.problems.push(`${ctx.where}: relative link "${href}" — every internal link in these guides is an absolute site path, so this one has no known Cyrillic target.`);
    return href;
  }
  const [pathname, tail = ''] = [href.replace(/[?#].*$/, ''), (href.match(/[?#].*$/) ?? [''])[0]];
  const target = ctx.pathMap.get(pathname);
  if (!target) {
    ctx.problems.push(`${ctx.where}: internal link "${pathname}" has no Cyrillic equivalent — it is not a page of this site, or its route is missing from src/i18n/routes.ts / src/data/services.ts.`);
    return href;
  }
  ctx.links.push([pathname, target]);
  return target + tail;
}

/** Transliterate a markdown body, leaving the structure exactly where it was. */
function transformBody(body, ctx) {
  const lines = body.split('\n');
  let fence = null;
  return lines
    .map((line) => {
      const open = line.match(/^\s{0,3}(```+|~~~+)/);
      if (fence) {
        if (open && open[1][0] === fence[0] && open[1].length >= fence.length) fence = null;
        return line; // inside a fenced code block: verbatim
      }
      if (open) {
        fence = open[1];
        return line; // the fence line itself (it carries the language id): verbatim
      }
      return transformInline(line, ctx);
    })
    .join('\n');
}

/* ── Frontmatter ───────────────────────────────────────────────────────────────────────────── */

/**
 * Transliterate the frontmatter line by line rather than re-serialising it through a YAML
 * writer: keys, indentation, quoting and list shape then come out exactly as the author wrote
 * them, and only the prose inside the quotes changes.
 */
function transformFrontmatter(fm, article, ctx) {
  return fm
    .split('\n')
    .map((line) => {
      const m = line.match(/^(\s*(?:-\s+)?)([A-Za-z][A-Za-z0-9_]*):(\s*)(.*)$/);
      if (!m) {
        if (line.trim() && !line.trim().startsWith('#')) ctx.problems.push(`${ctx.where}: frontmatter line is neither a key nor a comment, and this generator only knows how to transliterate "key: value" — ${JSON.stringify(line)}`);
        return line;
      }
      const [, indent, key, gap, value] = m;
      if (key === 'lang') return `${indent}lang:${gap}uzc`;
      if (key === 'slug') return `${indent}slug:${gap}${article.cyrSlug}`;
      if (VERBATIM_KEYS.has(key)) return line;
      if (value === '') return line; // `faq:` / `sources:` — the block header
      if (!PROSE_KEYS.has(key)) {
        ctx.problems.push(`${ctx.where}: unknown frontmatter key "${key}" — decide in scripts/generate-cyrillic-guides.mjs whether it is prose (transliterate) or machinery (copy).`);
        return line;
      }
      const quoted = value.match(/^"([\s\S]*)"$/);
      if (!quoted) {
        ctx.problems.push(`${ctx.where}: prose value for "${key}" is not a double-quoted scalar; this generator does not handle block scalars or folded strings — ${JSON.stringify(value)}`);
        return line;
      }
      return `${indent}${key}:${gap}"${transformInline(quoted[1], ctx)}"`;
    })
    .join('\n');
}

/** Everything in an article a human reads: quoted frontmatter scalars plus the body text. */
function proseOf(fm, body) {
  const fromFm = fm
    .split('\n')
    .map((line) => line.match(/^\s*(?:-\s+)?([A-Za-z][A-Za-z0-9_]*):\s*"([\s\S]*)"$/))
    .filter((m) => m && PROSE_KEYS.has(m[1]))
    .map((m) => m[2]);
  // Link targets and code spans are machinery inside the body, too.
  const fromBody = body.replace(/`+[\s\S]*?`+/g, ' ').replace(/\]\([^)]*\)/g, '] ').replace(/<[^>]*>/g, ' ');
  return [...fromFm, fromBody].join('\n');
}

/* ── Read ──────────────────────────────────────────────────────────────────────────────────── */

const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.md')).sort();
if (!files.length) fail(`no source articles in ${rel(SRC_DIR)}`);

const problems = [];
const articles = files.map((file) => {
  const raw = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) fail(`${file}: no frontmatter`);
  const [, fm, body] = m;
  const latinSlug = (fm.match(/^slug:\s*(.+)$/m) ?? [])[1]?.trim();
  const translationKey = (fm.match(/^translationKey:\s*(.+)$/m) ?? [])[1]?.trim();
  if (!latinSlug) fail(`${file}: no slug in frontmatter`);
  // Recover spellings from PROSE only. The machinery lines carry the ASCII fold itself — the
  // `slug:` line and the `tags:` list both say "yonalishlar" — and indexing those would let the
  // fold outvote the real spelling `yoʻnalishlar` that the article's sentences use.
  const proseText = proseOf(fm, body);
  const index = orthographyIndex(proseText);
  const cyrSlug = cyrillicSlug(latinSlug, index, file, problems);
  return { file, raw, fm, body, proseText, latinSlug, translationKey, cyrSlug };
});
if (problems.length) fail(problems.join('\n'));

/* Slug sanity: unique, Cyrillic, and the same value the hreflang registry expects. */
const seen = new Map();
for (const a of articles) {
  if (!/^[Ѐ-ӿ0-9]+(?:-[Ѐ-ӿ0-9]+)*$/.test(a.cyrSlug)) problems.push(`${a.file}: generated slug "${a.cyrSlug}" is not a clean Cyrillic slug`);
  if (seen.has(a.cyrSlug)) problems.push(`${a.file}: slug "${a.cyrSlug}" collides with ${seen.get(a.cyrSlug)}`);
  seen.set(a.cyrSlug, a.file);
  // The locale registry writes the same slugs out by hand, so that a transliterator change can
  // never silently rewrite a live URL. If the two ever disagree, hreflang would point at a page
  // that does not exist — so they are compared here rather than trusted.
  for (const [where, registered] of [
    ['src/i18n/routes.ts guideSlugsUzc', guideSlugsUzc[a.latinSlug]],
    ['src/data/guides.ts', guideSlugs[a.translationKey]?.uzc],
  ]) {
    if (typeof registered === 'string' && registered !== a.cyrSlug) problems.push(`${a.file}: ${where} registers uzc slug "${registered}", but this article generates "${a.cyrSlug}" — hreflang and the route would disagree.`);
  }
}
if (problems.length) fail(problems.join('\n'));

// One recovery index over every Uzbek string this script can see, for the fallback segments.
const siteIndex = orthographyIndex([
  ...articles.map((a) => a.proseText),
  ...services.flatMap((s) => [s.name.uz, s.short.uz]),
  ...common.uz.nav.map((n) => n.label),
].join('\n'));
const { map: pathMap, derived, guidesSeg } = buildPathMap(articles, siteIndex);

/* ── Transform ─────────────────────────────────────────────────────────────────────────────── */

const links = [];
const outputs = articles.map((a) => {
  const ctx = { where: a.file, pathMap, problems, links };
  const fm = transformFrontmatter(a.fm, a, ctx);
  const body = transformBody(a.body, ctx);
  const header = `# GENERATED from ../uz/${a.file} by scripts/generate-cyrillic-guides.mjs — do not edit.`;
  return { name: `${a.cyrSlug}.md`, text: `---\n${header}\n${fm}\n---\n${body}`, fm, body, article: a };
});

/* ── Guards ────────────────────────────────────────────────────────────── */

/** Strip the runs that are Latin by design — code spans, HTML tags, link targets. */
const prose = (s) => s.replace(/`+[\s\S]*?`+/g, ' ').replace(/\]\([^)]*\)/g, '] ').replace(/<[^>]*>/g, ' ');

/**
 * Words of transliterated prose that still carry a Latin letter the transliterator did not
 * deliberately keep — reported whole (`Логистиcснинг`, not `c`), because the whole word is what
 * a reader would see and what somebody has to make a decision about. Words the transliterator
 * kept on purpose (`power bank`, `Telegramda`) are not mangled and are not reported.
 */
function mangledWords(text) {
  const chunks = toCyrillicChunks(text);
  const full = chunks.map((c) => c.text).join('');
  const isWord = /[\p{L}\p{N}ʻʼ'-]/u;
  const words = new Set();
  let at = 0;
  for (const c of chunks) {
    if (!c.kept) {
      for (const m of c.text.matchAll(/[A-Za-z]+/g)) {
        let s = at + m.index;
        let e = s + m[0].length;
        while (s > 0 && isWord.test(full[s - 1])) s -= 1;
        while (e < full.length && isWord.test(full[e])) e += 1;
        words.add(full.slice(s, e));
      }
    }
    at += c.text.length;
  }
  return [...words];
}

/** Guard: no Latin left anywhere the transliterator was not deliberately keeping it. */
for (const { fm, body, article } of outputs) {
  const leftovers = new Set();
  // Frontmatter: only the quoted scalars are prose; keys, dates, tags and urls are machinery.
  for (const line of fm.split('\n')) {
    const value = (line.match(/^\s*(?:-\s+)?[A-Za-z][A-Za-z0-9_]*:\s*"([\s\S]*)"$/) ?? [])[1];
    if (value !== undefined) for (const run of mangledWords(prose(value))) leftovers.add(run);
  }
  // Body: every line except the inside of a fenced code block.
  let fence = null;
  for (const line of body.split('\n')) {
    const open = line.match(/^\s{0,3}(```+|~~~+)/);
    if (fence) { if (open && open[1][0] === fence[0] && open[1].length >= fence.length) fence = null; continue; }
    if (open) { fence = open[1]; continue; }
    for (const run of mangledWords(prose(line))) leftovers.add(run);
  }
  if (leftovers.size) problems.push(`${article.file}: Latin survived transliteration in ${leftovers.size} word(s): ${[...leftovers].join(', ')}`);
}

/** Guard: the markdown structure of every article survived, frontmatter and body separately. */
const shape = (s) => ({
  lines: s.split('\n').length,
  headings: (s.match(/^#{1,6} /gm) ?? []).length,
  tableRows: (s.match(/^\s*\|/gm) ?? []).length,
  pipes: (s.match(/\|/g) ?? []).length,
  links: (s.match(/\]\(/g) ?? []).length,
  images: (s.match(/!\[/g) ?? []).length,
  bold: (s.match(/\*\*/g) ?? []).length,
  listItems: (s.match(/^\s*(?:[-*+]|\d+\.)\s/gm) ?? []).length,
  quotes: (s.match(/"/g) ?? []).length,
  fences: (s.match(/^\s{0,3}(?:```|~~~)/gm) ?? []).length,
});
for (const { fm, body, article } of outputs) {
  for (const [part, before, after] of [['frontmatter', shape(article.fm), shape(fm)], ['body', shape(article.body), shape(body)]]) {
    for (const k of Object.keys(before)) {
      if (before[k] !== after[k]) problems.push(`${article.file}: ${part} structure changed — ${k} ${before[k]} → ${after[k]}`);
    }
  }
}

/** Guard: every link target that is not an internal site path came through byte-identical. */
const outboundHrefs = (s) => (s.match(/\]\([^()\s]*/g) ?? []).map((h) => h.slice(2)).filter((h) => !h.startsWith('/'));
for (const { body, article } of outputs) {
  const before = outboundHrefs(article.body).join('\n');
  const after = outboundHrefs(body).join('\n');
  if (before !== after) problems.push(`${article.file}: an outbound link target changed:\n${before}\n---\n${after}`);
}
if (problems.length) fail(problems.join('\n'));

/* ── Write ─────────────────────────────────────────────────────────────────────────────────── */

const check = process.argv.includes('--check');
const quiet = process.argv.includes('--quiet');
fs.mkdirSync(OUT_DIR, { recursive: true });

const wanted = new Map(outputs.map((o) => [o.name, o.text]));
let written = 0;
let stale = 0;
const drift = [];
for (const existing of fs.readdirSync(OUT_DIR)) {
  if (!wanted.has(existing)) {
    if (check) drift.push(`${existing} is not generated by this script any more`);
    else { fs.rmSync(path.join(OUT_DIR, existing), { recursive: true }); stale += 1; }
  }
}
for (const [name, text] of wanted) {
  const dest = path.join(OUT_DIR, name);
  const current = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null;
  if (current === text) continue;
  if (check) drift.push(`${name} differs from the generated output`);
  else { fs.writeFileSync(dest, text); written += 1; }
}
if (check && drift.length) fail(`--check: ${rel(OUT_DIR)} is not what this script generates:\n  ${drift.join('\n  ')}`);

/* ── Report ────────────────────────────────────────────────────────────────────────────────── */

if (!quiet) {
  const digest = createHash('sha256').update([...wanted].map(([n, t]) => n + '\0' + t).join('\0')).digest('hex').slice(0, 12);
  console.log(`generate-cyrillic-guides: ${wanted.size} articles → ${rel(OUT_DIR)}${check ? ' (check only)' : `, ${written} written, ${stale} stale removed`} · ${digest}`);
  for (const a of articles) console.log(`  /${routeSlugs.guides.uz}/${a.latinSlug}/  →  ${PREFIX}/${guidesSeg}/${a.cyrSlug}/`);
  const unique = [...new Set(links.map(([a, b]) => `${a} → ${b}`))].sort();
  console.log(`  ${links.length} internal links rewritten (${unique.length} distinct targets)`);
  if (derived.length) {
    console.log(`  NOTE: ${derived.length} route/service segments were DERIVED — src/i18n/routes.ts and src/data/services.ts have no uzc entry yet.`);
    console.log(`        Once the locale is registered there, the registry wins and these lines disappear:`);
    for (const d of derived) console.log(`          ${d}`);
  }
}
