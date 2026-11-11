/**
 * The works blocks ("Ishlarimizdan lavhalar", src/content/works/<block>/index.md — one folder per
 * block, see src/content.config.ts) as the build scripts see them, plus the post-build check that
 * scripts/check-content.mjs runs over them.
 *
 *   readBlocks()      every block folder: its id, frontmatter and files, read straight from disk
 *                     (the scripts run under plain Node, without Astro's content layer)
 *   checkWorks(dist)  the media exist, no video is over MAX_VIDEO_BYTES, a video is H.264 (a warning above
 *                     level 4.2) and has its poster,
 *                     every published block is on the works page of all six locales and the newest
 *                     three on each home page (drafts nowhere), the built video and poster files are
 *                     there — and NO PAGE SHOWS A BLOCK'S TEXT IN ANOTHER LANGUAGE: within a block,
 *                     and in its JSON-LD nodes, the page's own title/text/alt may appear, the other
 *                     languages' never (uzc's own is the uz text transliterated, by the site's own
 *                     transliterator).
 *
 * Also read by scripts/test-translations.mjs (the zh/fa block texts keep the English figures) and
 * scripts/test-cyrillic.mjs (the uz block texts are part of the transliteration corpus).
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { LOCALE_CODES, localeOfPath, homePath } from './locales.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const WORKS_DIR = path.join(ROOT, 'src/content/works');
/** The largest video a block may carry: 50 MB. The README's ffmpeg command makes a 40 s 1080p film ~6 MB. */
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
/** The hand-written languages a block's title and text carry; uzc is transliterated from uz. */
export const BLOCK_LANGS = ['uz', 'ru', 'en', 'zh', 'fa'];

/** Every block folder, sorted by name: { id, dir, data, error? }. A folder without index.md is reported, not skipped. */
export function readBlocks() {
  if (!fs.existsSync(WORKS_DIR)) return [];
  return fs
    .readdirSync(WORKS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
    .map((id) => {
      const dir = path.join(WORKS_DIR, id);
      const file = path.join(dir, 'index.md');
      if (!fs.existsSync(file)) return { id, dir, data: {}, error: 'no index.md in the folder' };
      const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(fs.readFileSync(file, 'utf8'));
      if (!m) return { id, dir, data: {}, error: 'index.md has no frontmatter' };
      try {
        return { id, dir, data: yaml.load(m[1]) ?? {} };
      } catch (e) {
        return { id, dir, data: {}, error: `frontmatter does not parse: ${e.message.split('\n')[0]}` };
      }
    });
}

/** The ISO date of a block (js-yaml reads `date: 2026-11-11` as a Date). */
const isoOf = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? ''));

/** Every text of a block in one hand-written language: title and text, and with `alts` the photos' alts too. */
export function blockStrings(data, lang, { alts = true } = {}) {
  return [data.title?.[lang], data.text?.[lang], ...(alts ? (data.photos ?? []).map((p) => p?.alt?.[lang]) : [])].filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim());
}

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
/**
 * A block's HTML as text, attributes included (alt, aria-label): polish-html's <wbr> and <span> wrappers
 * (Chinese line breaks, Chinese runs, LTR islands) vanish without a trace, every other tag becomes a space.
 */
const flatten = (html) =>
  decode(
    html
      .replace(/<\/?(?:wbr|span)\b[^>]*>/gi, '')
      .replace(/<[a-z][^>]*?\s(?:alt|aria-label|title)="([^"]*)"[^>]*>/gi, ' $1 ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ');
const norm = (s) => s.replace(/\s+/g, ' ').trim();

/** The <article data-work="id"> elements of a page, as { id, html }. */
function articles(html) {
  const out = [];
  const re = /<article\b[^>]*\sdata-work="([^"]+)"[^>]*>/g;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    const end = html.indexOf('</article>', m.index);
    out.push({ id: m[1], html: html.slice(m.index, end === -1 ? undefined : end) });
  }
  return out;
}

/** Every string inside the JSON-LD nodes of one block (its VideoObject and ImageGallery, by @id). */
function ldStrings(html, id) {
  const out = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let ld;
    try { ld = JSON.parse(m[1]); } catch { continue; }
    for (const n of ld['@graph'] ?? [ld]) {
      if (typeof n?.['@id'] !== 'string' || !(n['@id'].endsWith(`#${id}`) || n['@id'].endsWith(`#${id}-photos`))) continue;
      (function collect(v) {
        if (typeof v === 'string') out.push(v);
        else if (Array.isArray(v)) v.forEach(collect);
        else if (v && typeof v === 'object') Object.values(v).forEach(collect);
      })(n);
    }
  }
  return out;
}

/** The site's transliterator (src/lib/cyrillic.ts), bundled by esbuild as the test scripts load TypeScript. */
async function loadToCyrillic() {
  const { build } = await import('esbuild');
  const out = await build({ entryPoints: [path.join(ROOT, 'src/lib/cyrillic.ts')], bundle: true, write: false, format: 'esm', platform: 'node', absWorkingDir: ROOT, logLevel: 'silent' });
  return (await import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`)).toCyrillic;
}

/** The first bytes of an MP4: is it one, and is its index (moov) ahead of the media (mdat), so playback can start at once? */
function mp4Layout(file) {
  const fd = fs.openSync(file, 'r');
  try {
    const head = Buffer.alloc(8);
    let pos = 0;
    const seen = [];
    const size = fs.fstatSync(fd).size;
    while (pos + 8 <= size && seen.length < 12) {
      fs.readSync(fd, head, 0, 8, pos);
      let len = head.readUInt32BE(0);
      const type = head.toString('latin1', 4, 8);
      if (len === 1) { const big = Buffer.alloc(8); fs.readSync(fd, big, 0, 8, pos + 8); len = Number(big.readBigUInt64BE(0)); }
      seen.push(type);
      if (type === 'moov' || type === 'mdat' || len < 8) break;
      pos += len;
    }
    return { mp4: seen[0] === 'ftyp', faststart: seen.includes('moov') };
  } finally {
    fs.closeSync(fd);
  }
}

/** The child boxes of buf[start, end) as { type, start, end } (start = the payload, after the box header). */
function mp4Boxes(buf, start, end) {
  const out = [];
  for (let p = start; p + 8 <= end; ) {
    let len = buf.readUInt32BE(p);
    let hdr = 8;
    if (len === 1) { if (p + 16 > end) break; len = Number(buf.readBigUInt64BE(p + 8)); hdr = 16; } else if (len === 0) len = end - p;
    if (len < hdr || p + len > end) break;
    out.push({ type: buf.toString('latin1', p + 4, p + 8), start: p + hdr, end: p + len });
    p += len;
  }
  return out;
}

/**
 * The first video track of an MP4, from its sample description (moov/trak/mdia/minf/stbl/stsd):
 * { codec: 'avc1' | 'hvc1' | …, level?: 40 } — `level` is the H.264 level_idc of the avcC box (40 = 4.0).
 * null when the file has no readable video track.
 */
function mp4VideoTrack(file) {
  const fd = fs.openSync(file, 'r');
  try {
    const size = fs.fstatSync(fd).size;
    const head = Buffer.alloc(16);
    for (let pos = 0; pos + 8 <= size; ) {
      fs.readSync(fd, head, 0, 16, pos);
      let len = head.readUInt32BE(0);
      if (len === 1) len = Number(head.readBigUInt64BE(8));
      else if (len === 0) len = size - pos;
      if (len < 8) return null;
      if (head.toString('latin1', 4, 8) !== 'moov') { pos += len; continue; }
      const moov = Buffer.alloc(Math.min(len, size - pos));
      fs.readSync(fd, moov, 0, moov.length, pos);
      const box = (parent, type) => parent && mp4Boxes(moov, parent.start, parent.end).find((b) => b.type === type);
      const root = { start: head.readUInt32BE(0) === 1 ? 16 : 8, end: moov.length };
      for (const trak of mp4Boxes(moov, root.start, root.end).filter((b) => b.type === 'trak')) {
        const mdia = box(trak, 'mdia');
        const hdlr = box(mdia, 'hdlr');
        if (!hdlr || moov.toString('latin1', hdlr.start + 8, hdlr.start + 12) !== 'vide') continue;
        const stsd = box(box(box(mdia, 'minf'), 'stbl'), 'stsd');
        // stsd: version/flags and entry count (8 bytes), then the sample entries; a visual sample entry has
        // 78 bytes of fields before its own boxes (avcC, hvcC, pasp…).
        const entry = stsd && mp4Boxes(moov, stsd.start + 8, stsd.end)[0];
        if (!entry) return null;
        const avcC = mp4Boxes(moov, entry.start + 78, entry.end).find((b) => b.type === 'avcC');
        return { codec: entry.type, ...(avcC && avcC.end - avcC.start >= 4 ? { level: moov[avcC.start + 3] } : {}) };
      }
      return null;
    }
    return null;
  } finally {
    fs.closeSync(fd);
  }
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'index.html' ? [path.join(d, e.name)] : []));

/** The post-build check (see the header). Returns { errors, warnings, summary }. */
export async function checkWorks(dist) {
  const errors = [];
  const warnings = [];
  const blocks = readBlocks();
  const toCyrillic = await loadToCyrillic();

  /* ── The folders ───────────────────────────────────────────────────────────────────────── */
  let videos = 0;
  let largest = 0;
  const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const sourceHash = new Map(); // block id → SHA-256 of its MP4
  for (const b of blocks) {
    // The folder name is the block's anchor on the page and the end of its JSON-LD @id (README «Yangi blok qoʻshish»).
    if (!/^[A-Za-z0-9][A-Za-z0-9-]*$/.test(b.id)) errors.push(`${b.id}: a block folder is named with Latin letters, digits and hyphens only (YYYY-MM-DD-name, e.g. 2026-12-01-ivuda-yuklash) — the name is the block's link anchor`);
    if (b.error) { errors.push(`${b.id}: ${b.error}`); continue; }
    const d = b.data;
    const here = (rel) => path.join(b.dir, String(rel).replace(/^\.\//, ''));
    if (d.video) {
      const file = here(d.video);
      if (!/\.mp4$/i.test(file) || !fs.existsSync(file)) errors.push(`${b.id}: video ${d.video} is not an .mp4 file in the block's folder`);
      else {
        const bytes = fs.statSync(file).size;
        sourceHash.set(b.id, sha256(file));
        videos += 1;
        largest = Math.max(largest, bytes);
        if (bytes > MAX_VIDEO_BYTES) errors.push(`${b.id}: video ${d.video} is ${(bytes / 1048576).toFixed(1)} MB — the limit is ${MAX_VIDEO_BYTES / 1048576} MB; re-encode it with the README's ffmpeg command`);
        const layout = mp4Layout(file);
        if (!layout.mp4) errors.push(`${b.id}: video ${d.video} is not an MP4 file (no ftyp box)`);
        else if (!layout.faststart) warnings.push(`${b.id}: video ${d.video} keeps its index at the end (no -movflags +faststart): it plays only after a longer wait — re-encode it with the README's ffmpeg command`);
        if (layout.mp4) {
          // H.264 plays in every browser and on every phone; HEVC (an iPhone's default), AV1 or VP9 in an MP4 do not.
          // Above level 4.2 (x264's -preset slow without -refs 4 signals 5.0 for 1080p) some older phones refuse it.
          const track = mp4VideoTrack(file);
          if (!track) warnings.push(`${b.id}: video ${d.video} — its video track could not be read; check that it plays, or re-encode it with the README's ffmpeg command`);
          else if (!/^avc[13]$/.test(track.codec)) errors.push(`${b.id}: video ${d.video} is ${/^(hvc1|hev1)$/.test(track.codec) ? 'HEVC (H.265)' : track.codec}, not H.264 — many browsers and phones cannot play it; re-encode it with the README's ffmpeg command`);
          else if (track.level > 42) warnings.push(`${b.id}: video ${d.video} is H.264 level ${(track.level / 10).toFixed(1)} — older phones play up to 4.2; re-encode it with the README's ffmpeg command (-refs 4)`);
        }
      }
      if (!d.poster) errors.push(`${b.id}: a video needs its poster (poster: ./poster.jpg)`);
      else if (!fs.existsSync(here(d.poster))) errors.push(`${b.id}: poster ${d.poster} is not in the block's folder`);
    }
    for (const p of d.photos ?? []) if (!p?.src || !fs.existsSync(here(p.src))) errors.push(`${b.id}: photo ${p?.src} is not in the block's folder`);
    if (!d.video && !(d.photos ?? []).length) errors.push(`${b.id}: the block has neither a video nor a photo`);
  }
  const published = blocks
    .filter((b) => !b.error && b.data.draft !== true)
    .sort((a, b) => isoOf(b.data.date).localeCompare(isoOf(a.data.date)) || b.id.localeCompare(a.id));
  const drafts = blocks.filter((b) => !b.error && b.data.draft === true).map((b) => b.id);

  /* ── The built pages ───────────────────────────────────────────────────────────────────── */
  const pages = walk(dist).map((f) => ({ file: f, url: '/' + path.relative(dist, path.dirname(f)).split(path.sep).filter((s) => s && s !== '.').map((s) => `${s}/`).join('') }));
  /** The texts a locale shows for a block: its own, or for uzc the uz ones transliterated. */
  const ownText = (data, lang, opts) => (lang === 'uzc' ? blockStrings(data, 'uz', opts).map((s) => norm(toCyrillic(s))) : blockStrings(data, lang, opts).map(norm));
  const builtHash = new Map(); // built MP4 → its SHA-256 (twelve pages play the same file)
  const hashOf = (file) => builtHash.get(file) ?? builtHash.set(file, sha256(file)).get(file);
  let scanned = 0;
  for (const code of LOCALE_CODES) {
    const inLocale = pages.filter((p) => localeOfPath(p.url) === code);
    const worksPages = inLocale.filter((p) => fs.readFileSync(p.file, 'utf8').includes('data-works-page'));
    if (worksPages.length !== 1) { errors.push(`${code}: ${worksPages.length} works pages (data-works-page), expected 1`); continue; }
    const home = inLocale.find((p) => p.url === homePath(code));
    for (const [kind, page] of [['works page', worksPages[0]], ['home page', home]]) {
      if (!page) { errors.push(`${code}: no ${kind}`); continue; }
      const html = fs.readFileSync(page.file, 'utf8');
      const found = articles(html);
      const ids = found.map((a) => a.id);
      const want = kind === 'works page' ? published.map((b) => b.id) : published.slice(0, 3).map((b) => b.id);
      if (ids.join() !== want.join()) errors.push(`${page.url}: shows blocks [${ids.join(', ')}], expected [${want.join(', ')}] (newest first${kind === 'home page' ? ', at most three' : ''})`);
      if (kind === 'home page' && !want.length && html.includes('data-works-home')) errors.push(`${page.url}: the works section is rendered with no published block`);
      for (const id of drafts) if (html.includes(`data-work="${id}"`)) errors.push(`${page.url}: shows the draft block ${id}`);
      for (const a of found) {
        const b = published.find((x) => x.id === a.id);
        if (!b) continue;
        scanned += 1;
        const text = flatten(a.html);
        const ld = kind === 'works page' ? ldStrings(html, a.id).map(norm) : [];
        const own = new Set(ownText(b.data, code));
        // Its own title and text are there (not every alt: the home section shows three photos of a block)…
        for (const s of ownText(b.data, code, { alts: false })) if (!text.includes(s)) errors.push(`${page.url}: block ${a.id} does not show its ${code} text «${s.slice(0, 50)}»`);
        // …and no other language is, in the page or in the block's structured data.
        for (const lang of BLOCK_LANGS) {
          if (lang === code) continue;
          for (const s of blockStrings(b.data, lang).map(norm)) {
            if (own.has(s)) continue;
            if (text.includes(s)) errors.push(`${page.url}: block ${a.id} shows its ${lang} text on the ${code} page — «${s.slice(0, 50)}»`);
            if (ld.some((x) => x.includes(s))) errors.push(`${page.url}: the JSON-LD of block ${a.id} carries its ${lang} text — «${s.slice(0, 50)}»`);
          }
        }
        // The media the block links to are in the build: the video byte for byte, the poster and the photos.
        for (const m of a.html.matchAll(/<source\b[^>]*\ssrc="([^"]+)"/g)) {
          const built = path.join(dist, decodeURI(m[1]));
          if (!fs.existsSync(built)) errors.push(`${page.url}: block ${a.id} plays ${m[1]}, which is not in ${dist}`);
          else if (hashOf(built) !== sourceHash.get(a.id)) errors.push(`${page.url}: block ${a.id} plays ${m[1]}, which is not byte for byte the folder's video`);
        }
        for (const m of a.html.matchAll(/\s(?:poster|href)="(\/_astro\/[^"]+)"/g)) if (!fs.existsSync(path.join(dist, decodeURI(m[1])))) errors.push(`${page.url}: block ${a.id} links ${m[1]}, which is not in ${dist}`);
        if (b.data.video && !/<video\b[^>]*\sposter="\/_astro\//.test(a.html)) errors.push(`${page.url}: block ${a.id} has a video without its poster`);
      }
    }
  }
  const mb = (n) => `${(n / 1048576).toFixed(1)} MB`;
  return {
    errors,
    warnings,
    summary: `works: ${published.length} published block(s)${drafts.length ? ` + ${drafts.length} draft(s)` : ''}, ${videos} video(s)${videos ? `, the largest ${mb(largest)} (limit ${MAX_VIDEO_BYTES / 1048576} MB)` : ''}, ${scanned} block views on the works and home pages of ${LOCALE_CODES.length} locales checked for their own language only`,
  };
}
