// Three passes over the built HTML, all of which need the same careful walk over text
// nodes, so they share one:
//
//   1. Wrap Chinese runs in <span lang="zh"> (<tspan> inside SVG) so screen readers switch
//      voice instead of reading 义乌 with an Uzbek or Russian one, and so search engines see
//      the language of the address they are indexing.
//      · NOT on the Chinese pages: the whole document is already <html lang="zh-Hans">, and
//        wrapping every run would only downgrade it to plain "zh" and bloat the page.
//      · On right-to-left pages (Persian) the span also gets dir="ltr", which isolates it, so
//        an address next to Persian punctuation or digits keeps its own order.
//   2. Drop build-time HTML comments. They are notes to whoever maintains a component and
//      have no business being served: 17.9 KB across the site, 5.6 KB on the home page, in
//      English, on a site whose visitors read Uzbek. Nothing in dist displays markup with a
//      comment in it (checked), and comments inside script/style/pre/code are left alone by
//      the same opaque-element rule the language pass uses. This runs on EVERY page, the
//      Chinese ones included.
//   3. On right-to-left pages only, a backstop for the left-to-right islands: a phone number
//      (+998 95 018 33 33), an e-mail, an @handle or a t.me / https link sitting in Persian
//      text is displayed backwards by the bidi algorithm ('33 33 018 95 998+') unless it is
//      isolated. Components isolate the ones they render; translated prose embeds them where no
//      component can reach. So any such run that the markup has NOT already isolated — no
//      ancestor with dir="ltr", no LRI…PDI around it — is wrapped in <span dir="ltr">. The
//      tel:, mailto: and t.me link texts are exactly these runs. Number ranges, prices and dates
//      are deliberately left alone: they read correctly inside Persian text.
//
// Every pass is idempotent: a second run finds the runs already declared or isolated and
// changes nothing.
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
// Elements with no end tag: never on the open-element stack.
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
// Text-only content models: a <span> injected there is dropped or misparsed.
const NO_MARKUP = new Set(['option', 'optgroup', 'select', 'datalist']);

// Pass 3: the runs that must read left to right inside right-to-left text. E-mail before @handle,
// so an address is taken whole; a handle may hold dots (@gsrgroup.uz) but never ends on one; a
// phone number is international (+ and 7–15 digits) — a bare digit group is as likely a quantity,
// which reads correctly in Persian and must not be isolated.
const LTR_RUN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|https?:\/\/[^\s<>"'«»]+|(?<![\w/.])t\.me\/[A-Za-z0-9_+/]+|(?<![\w@.])@[A-Za-z0-9_](?:[A-Za-z0-9_.]{2,30}[A-Za-z0-9_])(?![\w@])|\+\d{1,3}(?:(?:[ \xA0\u{202F}-]|&nbsp;|&#160;)?\d){6,14}/gu;
// A sentence's own punctuation after a URL is not part of it: '… https://t.me/gsrlogistics.'
const TRAILING = /[.,;:!?؛،)]+$/;
// Already isolated in the text itself: LRI/FSI/LRE/LRO just before the run, as a character or an entity.
const OPENS_ISOLATE = /(?:[\u{2066}\u{2068}\u{202A}\u{202D}]|&#x0*(?:2066|2068|202a|202d);|&#0*(?:8294|8296|8234|8237);)$/iu;

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const p = join(dir, name);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
});

/** One attribute of the document's <html> start tag. */
const htmlAttr = (html, name) => {
  const tag = (html.match(/<html\b[^>]*>/i) || [''])[0];
  const m = new RegExp(`\\s${name}\\s*=\\s*["']?([^"'\\s>]+)`, 'i').exec(tag);
  return m ? m[1].toLowerCase() : '';
};

/** Wrap Han runs and isolate LTR runs in the text nodes of `html`, leaving tags and opaque elements alone. */
function wrap(html) {
  let out = '';
  let i = 0;
  let skipUntil = null; // closing tag we are waiting for, e.g. '</script'
  let stripped = 0;     // bytes of comment removed
  let svgDepth = 0;     // >0 while inside an <svg>: wrap with <tspan>, never <span>
  let wrapped = 0;
  let isolated = 0;
  // Read once per document: a zh-Hans document is Chinese throughout (pass 1 is off); an rtl one
  // gets pass 3 and isolated Chinese spans.
  const docZh = /^zh(?:-|$)/.test(htmlAttr(html, 'lang'));
  const rtl = htmlAttr(html, 'dir') === 'rtl';
  // Open elements, for pass 3: is any ancestor dir="ltr" (already isolated), or text-only?
  const stack = [];
  const ltrAncestor = () => stack.some((e) => e.ltr);
  const markupForbidden = () => stack.some((e) => NO_MARKUP.has(e.name));

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
    const opening = !tag.startsWith('</') && !tag.endsWith('/>');
    // Opaque elements, and anything already declared Chinese, are left as they are — except the
    // document element itself: <html lang="zh-Hans"> declares the page, it is not an island to skip
    // (skipping it once kept every build comment on every Chinese page).
    if (opening && name !== 'html' && (OPAQUE.has(name) || /\slang\s*=\s*["']?zh/i.test(tag))) {
      skipUntil = `</${name}`;
    } else if (tag.startsWith('</')) {
      const at = stack.map((e) => e.name).lastIndexOf(name);
      if (at !== -1) stack.length = at; // an end tag with no open element is ignored
    } else if (opening && !VOID.has(name)) {
      stack.push({ name, ltr: /\sdir\s*=\s*["']?ltr\b/i.test(tag) });
    }
  }

  function text(chunk) {
    let s = chunk;
    if (rtl && svgDepth === 0 && !ltrAncestor() && !markupForbidden()) {
      s = s.replace(LTR_RUN, (run, offset, whole) => {
        if (OPENS_ISOLATE.test(whole.slice(0, offset))) return run;
        const tail = /^https?:|^t\.me\//.test(run) ? (TRAILING.exec(run)?.[0] ?? '') : '';
        isolated += 1;
        return `<span dir="ltr">${run.slice(0, run.length - tail.length)}</span>${tail}`;
      });
    }
    if (docZh || !HAS_HAN.test(s)) return s;
    const el = svgDepth > 0 ? 'tspan' : 'span';
    const attrs = el === 'span' && rtl ? ' lang="zh" dir="ltr"' : ' lang="zh"';
    return s.replace(RUN, (run) => { wrapped += 1; return `<${el}${attrs}>${run}</${el}>`; });
  }

  return { html: out, wrapped, stripped, isolated, docZh, rtl };
}

let files = 0, runs = 0, bytes = 0, ltrRuns = 0;
const perKind = { zh: 0, rtl: 0 };
for (const file of walk(root)) {
  const before = readFileSync(file, 'utf8');
  if (!HAS_HAN.test(before) && !before.includes('<!--') && !/<html\b[^>]*\sdir=["']?rtl/i.test(before)) continue;
  const { html, wrapped, stripped, isolated, docZh, rtl } = wrap(before);
  if (docZh) perKind.zh += 1;
  if (rtl) perKind.rtl += 1;
  if (html !== before) { writeFileSync(file, html); files += 1; runs += wrapped; bytes += stripped; ltrRuns += isolated; }
}
console.log(
  `polish: ${runs} Chinese runs declared, ${(bytes / 1024).toFixed(1)} KB of build comments dropped, ${files} pages` +
    ` · ${perKind.zh} Chinese pages left unwrapped (already zh-Hans) · ${ltrRuns} LTR runs isolated on ${perKind.rtl} right-to-left pages`,
);
