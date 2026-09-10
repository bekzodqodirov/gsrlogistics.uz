// Two passes over the built HTML, both of which need the same careful walk over text
// nodes, so they share one:
//
//   1. Wrap Chinese runs in <span lang="zh"> (<tspan> inside SVG) so screen readers switch
//      voice instead of reading 义乌 with an Uzbek or Russian one, and so search engines see
//      the language of the address they are indexing.
//   2. Drop build-time HTML comments. They are notes to whoever maintains a component and
//      have no business being served: 17.9 KB across the site, 5.6 KB on the home page, in
//      English, on a site whose visitors read Uzbek. Nothing in dist displays markup with a
//      comment in it (checked), and comments inside script/style/pre/code are left alone by
//      the same opaque-element rule the language pass uses.
//
// Runs last in the postbuild chain: check-content.mjs and generate-llms-full.mjs read the
// plain HTML before this pass touches it.
//
// Usage: node scripts/polish-html.mjs dist
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] || 'dist';

// Han characters plus the CJK punctuation and digits that sit inside an address
// ("荷花南街2255号"). A run always begins and ends on a Han character, so a Latin
// word between two Chinese ones can never swallow them into one span.
const HAN = '\\u3400-\\u4DBF\\u4E00-\\u9FFF\\uF900-\\uFAFF';
const INNER = HAN + '0-9\\u3000-\\u303F\\uFF01-\\uFF65';
const RUN = new RegExp(`[${HAN}](?:[${INNER}]*[${HAN}])?`, 'g');
const HAS_HAN = new RegExp(`[${HAN}]`);

// Elements whose text is not prose: never rewrite inside them.
const OPAQUE = new Set(['script', 'style', 'pre', 'code', 'textarea', 'title']);
// Inside an <svg>, <span> is an HTML foreign-content breakout tag: the parser closes the SVG at it and
// everything after lands in the HTML namespace, so the rest of the drawing silently stops rendering.
// SVG text takes <tspan> instead. Elements that end foreign content when nested in one.
const SVG_TEXT = new Set(['text', 'tspan', 'textpath']);

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const p = join(dir, name);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
});

/** Wrap Han runs in the text nodes of `html`, leaving tags and opaque elements alone. */
function wrap(html) {
  let out = '';
  let i = 0;
  let skipUntil = null; // closing tag we are waiting for, e.g. '</script'
  let stripped = 0;     // bytes of comment removed
  let svgDepth = 0;     // >0 while inside an <svg>: wrap with <tspan>, never <span>
  let wrapped = 0;

  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) { out += skipUntil ? html.slice(i) : text(html.slice(i)); break; }

    // Text between the previous tag and this one.
    out += skipUntil ? html.slice(i, lt) : text(html.slice(i, lt));

    // Comments: dropped outside opaque elements, kept verbatim inside them.
    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt);
      const stop = end === -1 ? html.length : end + 3;
      if (skipUntil) out += html.slice(lt, stop);
      else stripped += stop - lt;
      i = stop; continue;
    }

    const gt = html.indexOf('>', lt);
    if (gt === -1) { out += skipUntil ? html.slice(lt) : text(html.slice(lt)); break; }
    const tag = html.slice(lt, gt + 1);
    out += tag;
    i = gt + 1;

    const name = /^<\/?([a-zA-Z0-9-]+)/.exec(tag)?.[1]?.toLowerCase();
    if (!name) continue;
    if (skipUntil) {
      if (tag.startsWith('</') && `</${name}` === skipUntil) skipUntil = null;
      continue;
    }
    if (name === 'svg' && !tag.endsWith('/>')) svgDepth += tag.startsWith('</') ? -1 : 1;
    // Opaque elements, and anything already declared Chinese, are left as they are.
    if (!tag.startsWith('</') && !tag.endsWith('/>') &&
        (OPAQUE.has(name) || /\slang\s*=\s*["']?zh/i.test(tag))) {
      skipUntil = `</${name}`;
    }
  }

  function text(chunk) {
    if (!HAS_HAN.test(chunk)) return chunk;
    const el = svgDepth > 0 ? 'tspan' : 'span';
    return chunk.replace(RUN, (run) => { wrapped += 1; return `<${el} lang="zh">${run}</${el}>`; });
  }

  return { html: out, wrapped, stripped };
}

let files = 0, runs = 0, bytes = 0;
for (const file of walk(root)) {
  const before = readFileSync(file, 'utf8');
  if (!HAS_HAN.test(before) && !before.includes('<!--')) continue;
  const { html, wrapped, stripped } = wrap(before);
  if (wrapped || stripped) { writeFileSync(file, html); files += 1; runs += wrapped; bytes += stripped; }
}
console.log(`polish: ${runs} Chinese runs declared, ${(bytes / 1024).toFixed(1)} KB of build comments dropped, ${files} pages`);
