/**
 * Chinese (zh) only: where a short display text — a heading, an FAQ question, a table cell — may break.
 *
 * Han may break between any two ideographs, so a narrow line tore words apart: «中国至塔什干铁 / 路与集装箱运输»,
 * «按订单从中国进 / 口汽车», «义乌 → 广州 / 乌鲁 / 木齐», and a table column of «最低» / «中等» was squeezed to one
 * character (a Han run's narrowest width is one ideograph). zhBreaksHtml() returns the text as HTML with a <wbr>
 * between words and after a clause stop; the caller sets `word-break: keep-all`, which forbids every other break
 * between ideographs. Line breaks then fall between words, and a cell is never narrower than its longest word.
 *
 * Words come from the ICU dictionary (Intl.Segmenter), which does not know transliterated names or every compound,
 * so its pieces are regrouped:
 *  - consecutive single-character pieces stay together: 塔|什|干, 多|斯|特|克, 霍|尔|果|斯 are names;
 *  - such a run hands a leading suffix-like character (的, 次, 上 …) to the word before it and a trailing
 *    prefix-like one (在, 下, 代 …) to the word after it: 在|下|一批|次 → 在下一批次;
 *  - a lone character joins the word before it when suffix-like (的, 吗, 线, 宝: 生产线, 充电宝), the word after it
 *    when prefix-like (和, 从, 按: 从中国), and both words otherwise;
 *  - KEEP lists words the dictionary splits into mixed pieces (乌|兹|别|克|斯坦, 人民|币).
 * The longest unit on the service pages is 8 characters (≈ 256px at the 32px display size), so keeping units
 * whole cannot overflow a 320px screen; `overflow-wrap: break-word` stays the fallback.
 */
const HAN_WORD = /^[㐀-鿿豈-﫿]+$/u;
const HAN = /[㐀-鿿豈-﫿]/u;
/** Suffix-like characters: a lone one joins the word before it. */
const LEFT = new Set([...'的了着过们吗呢吧啊等性化者上中里内外后前时起线器机车费税价量率期单号地得之处方品类件次天年月日个种位份款批箱吨米元区市省州港站口场局部门家厂店商证书表法式型度值额金宝重包货']);
/** Prefix-like characters (prepositions, conjunctions, adverbs, verbs): a lone one joins the word after it. */
const RIGHT = new Set([...'和与或及从在按至到对向把将为由被给经以自往比跟同并而但只就都也又再很最更不没未已会能可要需应该是有让使请第每各这那哪一两几多少下走用配找发送装寄办交做看选签付买卖拿带去来回进出代']);
/** Words the dictionary splits into mixed pieces. */
const KEEP = ['乌兹别克斯坦', '汽运', '哈萨克斯坦', '吉尔吉斯斯坦', '塔吉克斯坦', '阿拉木图', '阿拉山口', '比亚迪', '乌兹别克语', '人民币', '拼多多', '笔记本电脑', '充电宝', '个体工商户', '起订量', '税费', '卖家', '发往'];
/** A clause stop: a break may follow it (never precede it). */
const STOP = /[，、。；：？！]$|——$/u;
/** Punctuation that may not start a line. */
const CLOSE = /^[，、。；：？！）」』”’〉》】〕…]/u;
/** An opening bracket or quote (a line may break before it) and a closing one (a line may break after it). */
const OPEN = /^[（“‘「『〈《【〔]/u;
const SHUT = /[）」』”’〉》】〕]$/u;

let segmenter: Intl.Segmenter | undefined;

interface Block { s: string; kind: 'R' | 'L' | 'M' }

/** One run of Han pieces → units that a line may separate. */
function hanUnits(run: string[]): string[] {
  const blocks: Block[] = [];
  for (let k = 0; k < run.length;) {
    if ([...run[k]].length === 1) {
      let z = k;
      while (z < run.length && [...run[z]].length === 1) z++;
      blocks.push({ s: run.slice(k, z).join(''), kind: z - k === 1 ? 'L' : 'R' });
      k = z;
    } else blocks.push({ s: run[k++], kind: 'M' });
  }
  for (let k = 0; k < blocks.length; k++) {
    if (blocks[k].kind !== 'R') continue;
    let chars = [...blocks[k].s];
    if (k > 0 && chars.length >= 2 && LEFT.has(chars[0])) {
      blocks[k - 1] = { s: blocks[k - 1].s + chars[0], kind: blocks[k - 1].kind === 'L' ? 'R' : blocks[k - 1].kind };
      chars = chars.slice(1);
    }
    if (k < blocks.length - 1 && chars.length >= 2 && RIGHT.has(chars[chars.length - 1])) {
      blocks[k + 1] = { s: chars[chars.length - 1] + blocks[k + 1].s, kind: blocks[k + 1].kind === 'L' ? 'R' : blocks[k + 1].kind };
      chars = chars.slice(0, -1);
    }
    blocks[k] = { s: chars.join(''), kind: chars.length === 1 ? 'L' : 'R' };
  }
  const units: string[] = [];
  let glueNext = false;
  blocks.forEach((b, k) => {
    const hasPrev = units.length > 0;
    const hasNext = k < blocks.length - 1;
    if (glueNext) { units[units.length - 1] += b.s; glueNext = b.kind === 'L' && !LEFT.has(b.s) && hasNext; return; }
    if (b.kind !== 'L') { units.push(b.s); return; }
    if (LEFT.has(b.s) && hasPrev) { units[units.length - 1] += b.s; return; }
    if (RIGHT.has(b.s) && hasNext) { units.push(b.s); glueNext = true; return; }
    if (hasPrev) units[units.length - 1] += b.s; else units.push(b.s);
    glueNext = hasNext;
  });
  return units;
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * `text` as HTML: escaped, with a <wbr> wherever a line may break inside a Chinese run (see above).
 * `clauseMax` (em): when every clause of the text is at most this wide, it breaks after its clause stops only —
 * 8 for a 32px display heading, 9 for h1–h4, 10 for a 17px FAQ question (what fits one line on a 320px phone).
 */
export function zhBreaksHtml(text: string, clauseMax = 0): string {
  if (!HAN.test(text)) return escape(text);
  segmenter ??= new Intl.Segmenter('zh-Hans', { granularity: 'word' });
  const keep: Array<[number, number]> = [];
  for (const w of KEEP) for (let i = text.indexOf(w); i >= 0; i = text.indexOf(w, i + 1)) keep.push([i, i + w.length]);
  const pieces: string[] = [];
  for (const { segment, index } of segmenter.segment(text)) {
    if (pieces.length && keep.some(([a, z]) => index > a && index < z)) pieces[pieces.length - 1] += segment;
    else pieces.push(segment);
  }
  // units: Han runs regrouped, everything else (spaces, Latin, digits, punctuation) as it comes
  const units: Array<{ s: string; han: boolean }> = [];
  for (let i = 0; i < pieces.length;) {
    if (!HAN_WORD.test(pieces[i])) {
      const last = units[units.length - 1];
      // the dictionary returns «——» as two pieces; it is one stop
      if (pieces[i] === '—' && last && !last.han && last.s.endsWith('—')) last.s += pieces[i++];
      else units.push({ s: pieces[i++], han: false });
      continue;
    }
    const run: string[] = [];
    while (i < pieces.length && HAN_WORD.test(pieces[i])) run.push(pieces[i++]);
    for (const s of hanUnits(run)) units.push({ s, han: true });
  }
  const blank = (x: { s: string }) => /^\s*$/.test(x.s);
  const stopAt = (k: number) => k > 0 && STOP.test(units[k - 1].s) && !blank(units[k]) && !CLOSE.test(units[k].s);
  // Clause first (the rule scripts/zh-phrases.mjs applies to the other Chinese headings): when every clause fits
  // one line on a 320px phone, the text breaks after its clause stops only.
  // Each clause is then one inline-block (.zc), so not even a space inside it can break: «从中国进口设备， / 关税真的是 0% 吗？».
  if (clauseMax > 0 && units.some((_, k) => stopAt(k))) {
    const parts = clauses(units, stopAt);
    if (parts.every((c) => width(c) <= clauseMax)) return parts.map((c) => `<span class="zc">${escape(c)}</span>`).join('<wbr>');
  }
  let html = '';
  units.forEach((u, k) => {
    const prev = units[k - 1];
    const after = !!prev && (stopAt(k)
      || (prev.han && u.han)
      || (OPEN.test(u.s) && !blank(prev) && !OPEN.test(prev.s.slice(-1)))
      || (SHUT.test(prev.s) && (u.han || OPEN.test(u.s))));
    html += (after ? '<wbr>' : '') + escape(u.s);
  });
  return html;
}

/** The clauses of a unit list, as text. */
function clauses(units: Array<{ s: string }>, stopAt: (k: number) => boolean): string[] {
  const out = [''];
  units.forEach((u, k) => { if (stopAt(k)) out.push(''); out[out.length - 1] += u.s; });
  return out;
}

/** Width in em, as scripts/zh-phrases.mjs counts it: Han and full-width punctuation 1, a space 0.3, anything else 0.62. */
const width = (s: string) => [...s.trim()].reduce((a, c) => a + (/[⺀-鿿豈-﫿＀-｠　-〿—…“”]/u.test(c) ? 1 : /\s/.test(c) ? 0.3 : 0.62), 0);
