// Chinese headings: keep each clause on one line. Pass 4 of polish-html.mjs, Chinese pages only.
//
// Han text may break between any two ideographs, and headings are set with `text-wrap: balance`,
// which picks the break nearest the middle of the line. On the Chinese pages that tore words apart:
// «每一公斤、每一 / 天，都有据可查。», «把货物交给我们 / 的，是这些客户。», «精确报价，只 / 需一条消息。».
// A Chinese typesetter breaks a heading at a clause boundary instead: after its comma, enumeration
// comma, colon, question mark or dash.
//
// So in a heading (h1–h4) or an FAQ question (<summary>) whose text holds such a stop with more text
// after it, each clause becomes an inline-block span (.zh-ph — `display: inline-block` in global.css,
// under :root:lang(zh)): the line may break between clauses but not inside one, and balancing then
// chooses among those breaks. The clauses of one text node sit in one plain span (.zh-phs), so where
// the text is a flex item (an FAQ question) it stays a single item.
//
// Only where every clause fits one line of that heading on a 320px phone — at most K full-width
// units: 8 for .display-2 (32px), 10 for an FAQ question (17px), 9 for any other h1–h4. A heading
// with a longer clause is left exactly as it was. Even an inline-block that turns out too wide for
// its line wraps inside itself by the normal rules, so this never overflows and never starts a line
// with a stop (which `word-break: keep-all` + `overflow-wrap: anywhere` did: «…沟通吗 / ？»).
// Text decoration does not reach inside an inline-block: no heading this changes sits in a link.
//
// Idempotent: the text in a clause span ends at its stop, so a second run finds no stop with text
// after it and changes nothing.

const HAN = /[㐀-鿿豈-﫿]/;
// A clause stop that more text follows, within one text node.
const CLAUSE = /(?:[，、。；：？！]|——)\s*\S/;
const SPLIT = /(?<=[，、。；：？！]|——)(?=\s*\S)/;
// A heading element with its own end tag; its inner part never holds another heading.
const HEADING = /(<(h[1-4]|summary)(?:\s[^>]*)?>)([\s\S]*?)(<\/\2\s*>)/gi;

/** Width of a clause in em: Han and full-width punctuation 1, a space 0.3, Latin letters and digits about 0.62. */
const units = (s) => [...s].reduce((a, c) => a + (/[⺀-鿿豈-﫿＀-｠　-〿—…“”]/.test(c) ? 1 : /\s/.test(c) ? 0.3 : 0.62), 0);

/** The longest clause (em) that still fits one line of this heading on a 320px screen. */
function limit(name, open) {
  const cls = /\sclass\s*=\s*"([^"]*)"/i.exec(open)?.[1] ?? '';
  if (/(?:^|\s)display-2(?:\s|$)/.test(cls)) return 8;
  return name === 'summary' ? 10 : 9;
}

/** Wrap the clauses of the headings in a Chinese page. Returns the new HTML and how many headings changed. */
export function zhPhrases(html) {
  let headings = 0;
  const out = html.replace(HEADING, (whole, open, name, inner, close) => {
    const K = limit(name.toLowerCase(), open);
    let svg = 0;
    let changed = false;
    const next = inner.replace(/(<[^>]*>)|([^<]+)/g, (_piece, tag, text) => {
      if (tag) {
        if (/^<svg[\s>]/i.test(tag) && !tag.endsWith('/>')) svg += 1;
        else if (/^<\/svg\s*>/i.test(tag)) svg -= 1;
        return tag;
      }
      if (svg > 0 || !HAN.test(text) || !CLAUSE.test(text)) return text;
      const parts = text.split(SPLIT);
      if (parts.length < 2 || parts.some((p) => units(p.trim()) > K)) return text;
      changed = true;
      return `<span class="zh-phs">${parts.map((p) => `<span class="zh-ph">${p}</span>`).join('')}</span>`;
    });
    if (!changed) return whole;
    headings += 1;
    return open + next + close;
  });
  return { html: out, headings };
}
