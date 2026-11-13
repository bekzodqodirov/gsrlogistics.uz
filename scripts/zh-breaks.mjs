// Chinese line breaking for display text: pass 4 of polish-html.mjs, on the Chinese pages only.
//
// Han may break between any two ideographs, so a narrow line tore words apart: «中国至塔什干铁 / 路与集装箱运输»,
// «从中国运货到乌兹别 / 克斯坦有哪些方式？», «每一公斤、每一 / 天，都有据可查。», and a table column of «最低» / «中等»
// was squeezed to one character (a Han run's narrowest width is one ideograph). A Chinese typesetter breaks a
// heading at a clause boundary first, and otherwise between words.
//
// WHERE. Display text: every h1–h6, FAQ question (<summary>), table cell (th, td), caption and figcaption, and
// whatever sits inside an element with one of the CLASSES below (fact labels, callout titles, card titles and
// blurbs, the guide TOC and related lists, the service pages' guide links) — markdown headings and tables in the
// guide bodies included. Running prose is left alone: breaking anywhere is normal in Chinese body text; so is text
// for screen readers only. Inside a figure cell or another element meant not to wrap (NOWRAP: .num, .fig …, set
// `white-space: nowrap`) the words are kept whole but get no <wbr>: Chrome breaks at a <wbr> even under nowrap
// («价格 / （中国 → 塔什干）»), and a service table's .num header wraps on phones («大约用时» stays whole). The
// components print plain text in every locale; this pass is the one place that decides where Chinese display text
// may break, so no other locale's HTML is touched.
//
// HOW. Each such text node with two or more ideographs becomes <span class="zw">…</span> (`word-break: keep-all`
// in global.css, under :root:lang(zh): no break between ideographs) with a <wbr> wherever a line may break:
//  - Clause first: when the text has a clause stop (，、。；：？！ or ——) followed by more text, and every clause
//    fits one line of that element on a 320px phone (clauseLimit: 7 em for .display-1, 8 for .display-2, 9 for
//    any other heading, caption or figcaption, 10 for an FAQ question or a callout title), each clause becomes an
//    inline-block <span class="zc"> and the text breaks between clauses only, not even at a space inside one:
//    «从中国进口设备， / 关税真的是 0% 吗？». Balancing (`text-wrap: balance`) then chooses among those breaks.
//  - Otherwise between words: a <wbr> between two Han words, after a clause stop, before an opening bracket and
//    after a closing one, never before closing punctuation.
// Only <wbr> and <span> are inserted, so the text (textContent) and every attribute stay as they were. One span
// per text node keeps a flex parent (an FAQ <summary>) at the flex items it had.
//
// WORDS come from the ICU dictionary (Intl.Segmenter), which does not know transliterated names or every compound,
// so its pieces are regrouped:
//  - consecutive single-character pieces stay together: 塔|什|干, 多|斯|特|克, 霍|尔|果|斯 are names;
//  - such a run hands a leading suffix-like character (的, 次, 上 …) to the word before it and a trailing
//    prefix-like one (在, 下, 代 …) to the word after it: 在|下|一批|次 → 在下一批次;
//  - a lone character joins the word before it when suffix-like (的, 吗, 线, 宝: 生产线, 充电宝), the word after it
//    when prefix-like (和, 从, 按: 从中国), and both words otherwise;
//  - KEEP lists words the dictionary splits into mixed pieces (乌|兹|别|克|斯坦, 人民|币).
// THE CAP. Joining may glue a run of names or a chain of lone characters into a unit wider than a phone line:
// «从中国运到乌兹别克斯坦» (11 ideographs), «经伊尔克什坦或吐尔尕特的» (12). keep-all then has no break left, and the
// emergency break falls inside a name or before «？». So a unit longer than CAP (6) ideographs is split back at
// its cheapest seam (see capped()): «从中国运到 / 乌兹别克斯坦», «经伊尔克什坦 / 或吐尔尕特的». A final particle may
// still close a full unit (乌兹别克斯坦吗), so it never starts a line; one dictionary word stays whole. Six
// ideographs and their punctuation fit the narrowest display line (a 40px .display-1 at 320px, ≈ 7.2 em);
// `overflow-wrap: break-word` stays the fallback.
//
// The <wbr> positions follow Node's ICU data (checked with Node 22 / ICU 77).
//
// Idempotent: a text node inside a span.zw is never touched again, so a second run changes nothing.

const HAN_WORD = /^[㐀-鿿豈-﫿]+$/u;
const HAN = /[㐀-鿿豈-﫿]/u;
const HAN_G = /[㐀-鿿豈-﫿]/gu;
/** Suffix-like characters: a lone one joins the word before it. */
const LEFT = new Set([...'的了着过们吗呢吧啊等性化者上中里内外后前时起线器机车费税价量率期单号地得之处方品类件次天年月日个种位份款批箱吨米元区市省州港站口场局部门家厂店商证书表法式型度值额金宝重包货']);
/** Prefix-like characters (prepositions, conjunctions, adverbs, verbs): a lone one joins the word after it. */
const RIGHT = new Set([...'和与或及从在按至到对向把将为由被给经以自往比跟同并而但只就都也又再很最更不没未已会能可要需应该是有让使请第每各这那哪一两几多少下走用配找发送装寄办交做看选签付买卖拿带去来回进出代']);
/** Inside a run of single characters (names), a seam at one of these is where a new name starts (经伊尔克什坦 / 或吐尔尕特的). */
const JOINER = new Set([...'和与或及并从在至到经往向自对']);
/** Final particles: they may close a unit that is already CAP long. */
const PARTICLE = new Set([...'的了吗呢吧啊']);
/** Words the dictionary splits into mixed pieces. */
const KEEP = ['乌兹别克斯坦', '汽运', '哈萨克斯坦', '吉尔吉斯斯坦', '塔吉克斯坦', '阿拉木图', '阿拉山口', '比亚迪', '乌兹别克语', '人民币', '拼多多', '笔记本电脑', '充电宝', '个体工商户', '起订量', '起运量', '税费', '卖家', '发往', '阿富汗', '海拉顿', '马扎里沙里夫', '铁尔梅兹', '行车许可证', '海关监管仓库', '土库曼斯坦', '阿姆河', '友谊桥', '波斯语', '单证', '运往', '拼货', '承运人', '发货人', '报关行', '报关员', '起运地', '海关法典', '押运', '批准证明书'];
/** The longest unit (in ideographs) that joining pieces may build. */
export const CAP = 6;
/** A clause stop: a break may follow it (never precede it). */
const STOP = /[，、。；：？！]$|——$/u;
/** Punctuation that may not start a line. */
const CLOSE = /^[，、。；：？！）」』”’〉》】〕…]/u;
/** An opening bracket or quote (a line may break before it) and a closing one (a line may break after it). */
const OPEN = /^[（“‘「『〈《【〔]/u;
const SHUT = /[）」』”’〉》】〕]$/u;

let segmenter;
const count = (s) => [...s].length;

const text = (parts) => parts.map((p) => p.s).join('');

/**
 * A unit over the cap, split back at the seam between two of its pieces that costs least, again until every part
 * fits. A seam inside a run of single characters (a name) is dear unless a joiner (和, 或, 经 …) or 的 stands at it;
 * a seam before a suffix (的, 线 …) or one that leaves a character alone costs more, and a suffix is never left
 * alone; balanced parts cost less. One dictionary word longer than the cap has no seam and stays whole.
 */
function capped(parts) {
  const len = count(text(parts));
  if (len <= CAP || (len === CAP + 1 && PARTICLE.has(parts[parts.length - 1].s))) return [parts];
  let best;
  for (let j = 1; j < parts.length; j++) {
    const a = count(text(parts.slice(0, j)));
    const b = len - a;
    const l = parts[j - 1], r = parts[j];
    let cost = l.name && r.name ? (JOINER.has(r.s) || JOINER.has(l.s) || l.s === '的' ? 2 : 10) : 1;
    if (LEFT.has(r.s)) cost += b === 1 ? 20 : 1;
    else if (b === 1) cost += 4;
    if (a === 1) cost += RIGHT.has(l.s) ? 2 : 4;
    cost += Math.abs(a - b) * 0.2;
    if (!best || cost < best.cost) best = { j, cost };
  }
  if (!best) return [parts];
  return [...capped(parts.slice(0, best.j)), ...capped(parts.slice(best.j))];
}

/** One run of Han pieces → the units a line may separate. */
function hanUnits(run) {
  // M: a dictionary word; R: a run of single-character pieces (`name`: probably a transliterated name); L: one lone character.
  const blocks = [];
  for (let k = 0; k < run.length;) {
    if (count(run[k]) === 1) {
      let z = k;
      while (z < run.length && count(run[z]) === 1) z++;
      blocks.push({ parts: run.slice(k, z).map((s) => ({ s, name: z - k > 1 })), kind: z - k === 1 ? 'L' : 'R' });
      k = z;
    } else blocks.push({ parts: [{ s: run[k++], name: false }], kind: 'M' });
  }
  for (let k = 0; k < blocks.length; k++) {
    if (blocks[k].kind !== 'R') continue;
    let parts = blocks[k].parts;
    if (k > 0 && parts.length >= 2 && LEFT.has(parts[0].s)) {
      const prev = blocks[k - 1];
      blocks[k - 1] = { parts: [...prev.parts, { s: parts[0].s, name: false }], kind: prev.kind === 'L' ? 'R' : prev.kind };
      parts = parts.slice(1);
    }
    if (k < blocks.length - 1 && parts.length >= 2 && RIGHT.has(parts[parts.length - 1].s)) {
      const next = blocks[k + 1];
      blocks[k + 1] = { parts: [{ s: parts[parts.length - 1].s, name: false }, ...next.parts], kind: next.kind === 'L' ? 'R' : next.kind };
      parts = parts.slice(0, -1);
    }
    blocks[k] = parts.length === 1 ? { parts: [{ s: parts[0].s, name: false }], kind: 'L' } : { parts, kind: 'R' };
  }
  const units = [];
  let glueNext = false;
  blocks.forEach((b, k) => {
    const s = text(b.parts);
    const last = units.length - 1;
    const hasPrev = last >= 0;
    const hasNext = k < blocks.length - 1;
    if (glueNext) { units[last].push(...b.parts); glueNext = b.kind === 'L' && !LEFT.has(s) && hasNext; return; }
    if (b.kind !== 'L') { units.push([...b.parts]); return; }
    if (LEFT.has(s) && hasPrev) { units[last].push(...b.parts); return; }
    if (RIGHT.has(s) && hasNext) { units.push([...b.parts]); glueNext = true; return; }
    if (hasPrev) units[last].push(...b.parts); else units.push([...b.parts]);
    glueNext = hasNext;
  });
  return units.flatMap(capped).map(text);
}

/** Width in em: Han and full-width punctuation 1, a space 0.3, anything else 0.62. */
const width = (s) => [...s.trim()].reduce((a, c) => a + (/[⺀-鿿豈-﫿＀-｠　-〿—…“”]/u.test(c) ? 1 : /\s/.test(c) ? 0.3 : 0.62), 0);

/**
 * Where `text` (plain text, not HTML) may break: `{ clauses }` — the offsets that start its 2nd, 3rd … clause —
 * when every clause is at most `clauseMax` em wide, else `{ breaks }` — the offsets that take a <wbr>.
 * Offsets are UTF-16 indexes into `text`, ascending. `clauseMax` 0 asks for word breaks only.
 */
export function zhBreakPlan(text, clauseMax = 0) {
  if (!HAN.test(text)) return { breaks: [] };
  segmenter ??= new Intl.Segmenter('zh-Hans', { granularity: 'word' });
  const keep = [];
  for (const w of KEEP) for (let i = text.indexOf(w); i >= 0; i = text.indexOf(w, i + 1)) keep.push([i, i + w.length]);
  const pieces = [];
  for (const { segment, index } of segmenter.segment(text)) {
    if (pieces.length && keep.some(([a, z]) => index > a && index < z)) pieces[pieces.length - 1] += segment;
    else pieces.push(segment);
  }
  // units: Han runs regrouped, everything else (spaces, Latin, digits, punctuation) as it comes
  const units = [];
  for (let i = 0; i < pieces.length;) {
    if (!HAN_WORD.test(pieces[i])) {
      const last = units[units.length - 1];
      // the dictionary returns «——» as two pieces; it is one stop
      if (pieces[i] === '—' && last && !last.han && last.s.endsWith('—')) last.s += pieces[i++];
      else units.push({ s: pieces[i++], han: false });
      continue;
    }
    const run = [];
    while (i < pieces.length && HAN_WORD.test(pieces[i])) run.push(pieces[i++]);
    for (const s of hanUnits(run)) units.push({ s, han: true });
  }
  const at = [];
  units.reduce((o, u) => (at.push(o), o + u.s.length), 0);
  const blank = (x) => /^\s*$/.test(x.s);
  const stopAt = (k) => k > 0 && STOP.test(units[k - 1].s) && !blank(units[k]) && !CLOSE.test(units[k].s);
  if (clauseMax > 0 && units.some((_, k) => stopAt(k))) {
    const starts = units.map((_, k) => k).filter(stopAt);
    const edges = [0, ...starts.map((k) => at[k]), text.length];
    if (edges.slice(1).every((z, j) => width(text.slice(edges[j], z)) <= clauseMax)) return { clauses: starts.map((k) => at[k]) };
  }
  const breaks = [];
  units.forEach((u, k) => {
    const prev = units[k - 1];
    if (prev && (stopAt(k)
      || (prev.han && u.han)
      || (OPEN.test(u.s) && !blank(prev) && !OPEN.test(prev.s.slice(-1)))
      || (SHUT.test(prev.s) && (u.han || OPEN.test(u.s))))) breaks.push(at[k]);
  });
  return { breaks };
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** `text` (plain text) as the HTML this pass gives it: escaped, with its <wbr> and clause spans (no .zw wrapper). */
export function zhBreaksHtml(text, clauseMax = 0) {
  const plan = zhBreakPlan(text, clauseMax);
  if (plan.clauses) {
    const edges = [0, ...plan.clauses, text.length];
    return edges.slice(1).map((z, j) => `<span class="zc">${escape(text.slice(edges[j], z))}</span>`).join('<wbr>');
  }
  let html = '', from = 0;
  for (const b of plan.breaks) { html += escape(text.slice(from, b)) + '<wbr>'; from = b; }
  return html + escape(text.slice(from));
}

// ---------------------------------------------------------------- the pass over a built page

/** Display text: these elements, and anything inside an element with one of the CLASSES. */
const TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'summary', 'th', 'td', 'caption', 'figcaption']);
const CLASSES = ['fact-label', 'callout-title', 'side-hint', 'rel-short', 'guides-intro', 'g-title', 'toc', 'rel-list', 'guide-link', 'tail-text', 'row-short'];
/** Never inside these: not prose, not HTML text (SVG), or text-only content models. */
const OPAQUE = new Set(['script', 'style', 'pre', 'code', 'kbd', 'samp', 'textarea', 'title', 'svg', 'math', 'template', 'noscript', 'select', 'option', 'optgroup', 'datalist', 'iframe', 'object']);
/** Text for screen readers only: it never wraps on screen. */
const UNSEEN = ['sr-only', 'visually-hidden'];
/** `white-space: nowrap` (mostly): words kept whole (span.zw), no <wbr> — Chrome would break at one even there. */
const NOWRAP = ['num', 'fig', 'nowrap', 'lang-trigger'];
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

/** The clause limit (em) an element sets for the text inside it, or undefined when it sets none. */
function clauseLimit(name, cls) {
  if (/^h[1-6]$/.test(name)) return cls.includes('display-1') ? 7 : cls.includes('display-2') ? 8 : 9;
  if (name === 'summary') return 10;
  if (name === 'caption' || name === 'figcaption') return 9;
  if (cls.includes('callout-title')) return 10;
  return undefined;
}

const ATOM = /&(?:#[xX][0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);|[\s\S]/gu;
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00A0' };
/** A raw HTML text as atoms (one entity or one character each) with their decoded text. */
function atoms(raw) {
  const out = [];
  for (const m of raw.matchAll(ATOM)) {
    const a = m[0];
    let dec = a;
    if (a.length > 1 && a[0] === '&') {
      const body = a.slice(1, -1);
      const hex = body[1] === 'x' || body[1] === 'X';
      const cp = body[0] === '#' ? parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10) : NaN;
      // an entity this pass does not know stands for one non-Han character (U+FFFC): no break is placed next to it
      dec = body[0] === '#' ? (cp <= 0x10ffff ? String.fromCodePoint(cp) : '\uFFFC') : NAMED[body] ?? '\uFFFC';
    }
    out.push({ raw: a, dec });
  }
  return out;
}

/**
 * One raw text node of display text → its HTML with the span.zw, <wbr> and clause spans, or null to keep it.
 * `breaks` false: the span.zw only (keep-all keeps its words whole), no <wbr> and no clause spans.
 */
function breakTextNode(raw, clauseMax, breaks = true) {
  const lead = /^[ \t\n\r\f]*/.exec(raw)[0];
  const trail = /[ \t\n\r\f]*$/.exec(raw.slice(lead.length))[0];
  const core = raw.slice(lead.length, raw.length - trail.length);
  const list = atoms(core);
  const text = list.map((a) => a.dec).join('');
  if ((text.match(HAN_G) ?? []).length < 2) return null;
  if (!breaks) return `${lead}<span class="zw">${core}</span>${trail}`;
  // decoded offset → raw offset, at atom boundaries only
  const rawAt = new Map();
  let d = 0, r = 0;
  for (const a of list) { rawAt.set(d, r); d += a.dec.length; r += a.raw.length; }
  rawAt.set(d, r);
  const plan = zhBreakPlan(text, clauseMax);
  const cuts = (plan.clauses ?? plan.breaks).filter((o) => rawAt.has(o)).map((o) => rawAt.get(o));
  let inner;
  if (plan.clauses) {
    const edges = [0, ...cuts, core.length];
    inner = edges.slice(1).map((z, j) => `<span class="zc">${core.slice(edges[j], z)}</span>`).join('<wbr>');
  } else {
    inner = '';
    let from = 0;
    for (const c of cuts) { inner += core.slice(from, c) + '<wbr>'; from = c; }
    inner += core.slice(from);
  }
  return `${lead}<span class="zw">${inner}</span>${trail}`;
}

const classesOf = (tag) => (/\sclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag)?.slice(1).find((v) => v !== undefined) ?? '').split(/\s+/).filter(Boolean);

/**
 * The Chinese page `html` with its display text marked up for line breaking. Returns the new HTML and how many
 * text nodes changed. Comments and the content of opaque elements pass through untouched.
 */
export function zhBreaks(html) {
  let out = '';
  let i = 0;
  let changed = 0;
  // open elements: { name, display (inside display text), limit (clause em), whole (NOWRAP: no <wbr>),
  // skip (opaque, a .zw, screen-reader text, another language) }
  const stack = [];
  const top = () => stack[stack.length - 1];
  let rawUntil = null; // inside <script>/<style>/…: their text is not HTML, copy until the end tag
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    const textEnd = lt === -1 ? html.length : lt;
    if (textEnd > i) {
      const raw = html.slice(i, textEnd);
      const t = top();
      const next = !rawUntil && t && t.display && !t.skip && HAN.test(raw) ? breakTextNode(raw, t.limit ?? 0, !t.whole) : null;
      if (next !== null) { out += next; changed += 1; } else out += raw;
    }
    if (lt === -1) break;
    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt);
      const stop = end === -1 ? html.length : end + 3;
      out += html.slice(lt, stop);
      i = stop;
      continue;
    }
    const gt = html.indexOf('>', lt);
    if (gt === -1) { out += html.slice(lt); break; }
    const tag = html.slice(lt, gt + 1);
    out += tag;
    i = gt + 1;
    const name = /^<\/?([a-zA-Z][a-zA-Z0-9-]*)/.exec(tag)?.[1]?.toLowerCase();
    if (!name) continue;
    if (rawUntil) {
      if (tag.startsWith('</') && name === rawUntil) { rawUntil = null; stack.pop(); }
      continue;
    }
    if (tag.startsWith('</')) {
      const at = stack.map((e) => e.name).lastIndexOf(name);
      if (at !== -1) stack.length = at; // an end tag with no open element is ignored
      continue;
    }
    if (VOID.has(name) || tag.endsWith('/>')) continue;
    const parent = top();
    const cls = classesOf(tag);
    const lang = /\slang\s*=\s*["']?([A-Za-z-]+)/i.exec(tag)?.[1];
    const display = !!parent?.display || TAGS.has(name) || cls.some((c) => CLASSES.includes(c));
    const skip = !!parent?.skip || OPAQUE.has(name) || cls.includes('zw') || cls.some((c) => UNSEEN.includes(c)) || (lang !== undefined && !/^zh/i.test(lang));
    const whole = !!parent?.whole || cls.some((c) => NOWRAP.includes(c));
    stack.push({ name, display, skip, whole, limit: clauseLimit(name, cls) ?? parent?.limit });
    if (name === 'script' || name === 'style' || name === 'textarea' || name === 'title') rawUntil = name;
  }
  return { html: out, changed };
}
