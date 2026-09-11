/**
 * Uzbek Latin (1995 alphabet) → Uzbek Cyrillic (1940 alphabet) transliteration.
 *
 * The Cyrillic locale of this site is GENERATED from the Latin source. Latin stays the single
 * source of truth: nobody edits the same sentence twice, and the two copies cannot drift.
 * That makes this file load-bearing — a wrong letter here is a wrong letter on every Cyrillic
 * page at once — so every rule below is pinned by a case in `scripts/test-cyrillic.mjs`,
 * and the test additionally runs the site's entire real `uz` corpus through it.
 *
 * Pure TypeScript, no Astro or Vite imports, so Node can run it directly with type stripping.
 *
 * ── The rules that are not one-to-one ──────────────────────────────────────────────────────
 *
 *   Digraphs      oʻ→ў  gʻ→ғ  sh→ш  ch→ч. Every look-alike apostrophe (ʻ U+02BB, ʼ U+02BC,
 *                 ‘ ’ ` ´ ′) is accepted as the same character, because copy-paste and older
 *                 files carry all of them. An apostrophe after o or g is always a digraph
 *                 (no Uzbek word takes a tutuq belgisi there); anywhere else it is ъ.
 *   ng            Stays нг. Not a digraph, not a separate Cyrillic letter — no rule needed.
 *   e             э at the start of a word and after a vowel, е after a consonant:
 *                 eshik→эшик, aeroport→аэропорт, but kelasiz→келасиз.
 *   ye yo yu ya   One Cyrillic letter each — е ё ю я — in every position, including after a
 *                 consonant: kalkulyator→калькулятор, byudjet→бюджет, dunyo→дунё. A bare y is
 *                 й: yigʻma→йиғма, tayyor→тайёр. `yoʻ` is y + oʻ, not ye/yo: yoʻq→йўқ.
 *   ts            ц only before i or e, and not where Uzbek's own -siz/-sin suffixes put t and
 *                 s next to each other: deklaratsiya→декларация, litsenziya→лицензия, but
 *                 hujjatsiz→ҳужжатсиз, yetsa→етса, aytsin→айтсин. Every other ц on this site
 *                 (stansiya, funksiya, aksiz, sex) is a dictionary entry, because after a
 *                 consonant nothing distinguishes it from native с: kursi, taksi, aksincha.
 *   sh / ch       Always the digraph. Uzbek has no suffix beginning with h, and no standalone
 *                 letter c, so s+h and c+h cannot meet across a morpheme boundary. Confirmed
 *                 against the real content: all 492 words containing "sh" and all 273
 *                 containing "ch" are genuine ш and ч. No machinery was built for a case that
 *                 does not occur; if one ever appears (Isʼhoq and friends), it is one line in
 *                 `respell`.
 *
 * ── What is not transliterated ─────────────────────────────────────────────────────────────
 *
 *   See `./cyrillic.terms.ts`. Brands, cargo codes, unit symbols, URLs, e-mails, phone numbers,
 *   file names and `{placeholders}` are copied out verbatim; a handful of abbreviations and
 *   loanwords have their own Cyrillic spelling rather than a transliterated one. Text that is
 *   already Cyrillic, Chinese or any other script is left exactly as it is — only ASCII Latin
 *   letters are ever touched.
 *
 *   A protected token that takes an Uzbek ending keeps its Latin spelling and gets the ending
 *   in Cyrillic after a hyphen — `Taobaodan` → `Taobao-дан`. The rule, and why it is not the
 *   other two options, is written out at `uzbekSuffix` in `./cyrillic.terms.ts`.
 *
 * ── Slugs are not words ────────────────────────────────────────────────────────────────────
 *
 *   `toCyrillicSlug` is NOT `toCyrillic` plus lowercase. An ASCII slug has already lost the
 *   letters that decide the answer — `qoʻllanma` was written `qollanma` — so it is looked up in
 *   `slugWords` before any rule runs. Nothing else in this file is allowed to invent a URL.
 */

import { isUzbekSuffix, keepLatin, protectedPatterns, respell, slugWords } from './cyrillic.terms';

/* ── Alphabet ──────────────────────────────────────────────────────────────────────────────── */

/** Every apostrophe-shaped character a source file might carry, treated as one letter. */
const APOSTROPHES = new Set(['ʻ', 'ʼ', '‘', '’', "'", '`', '´', 'ʹ', '′', '‵', 'ʽ', 'ʿ']);

const isApostrophe = (c: string | undefined): boolean => c !== undefined && APOSTROPHES.has(c);

/** The one-to-one half of the 1995 → 1940 alphabet. `c` and `w` are absent from Uzbek Latin. */
const SINGLE: Record<string, string> = {
  a: 'а', b: 'б', d: 'д', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л',
  m: 'м', n: 'н', o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в',
  x: 'х', y: 'й', z: 'з',
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

/** y + one of these is a single Cyrillic letter, not й + vowel. */
const IOTATED: Record<string, string | undefined> = { e: 'е', o: 'ё', u: 'ю', a: 'я' };

const isLatinLetter = (c: string | undefined): boolean => c !== undefined && c >= 'A' && c <= 'z' && /[A-Za-z]/.test(c);
const isWordChar = (c: string | undefined): boolean =>
  c !== undefined && (/[A-Za-z0-9]/.test(c) || isApostrophe(c) || /[Ѐ-ӿ]/.test(c));

/** Uppercase the output when the Latin source was uppercase. */
const matchCase = (cyr: string, sourceIsUpper: boolean): string => (sourceIsUpper ? cyr.toUpperCase() : cyr);

/* ── ts → ц ────────────────────────────────────────────────────────────────────────────────── */

/**
 * Uzbek Cyrillic ц became Latin "ts" between vowels. The same two letters also meet whenever a
 * stem ending in t takes one of Uzbek's own s-initial suffixes, and those must stay тс.
 *
 *   -siz "without"  hujjatsiz, hujjatsizlik        → ҳужжатсиз
 *   -sin imperative aytsin, aytsinlar              → айтсин
 *   -sa  conditional yetsa, ketsa, chiqsa          → етса   (never followed by i, so it cannot
 *                                                            reach this test at all)
 *
 * The suffixes are excluded by shape: "iz"/"in" followed by a consonant or the end of the word.
 * A loanword keeps its ц because a vowel follows instead — vaktsina → вакцина.
 */
function tsIsTse(rest: string): boolean {
  const next = rest[0]?.toLowerCase();
  if (next === 'e') return true;
  if (next !== 'i') return false;
  const tail = rest.slice(1).toLowerCase();
  if (tail === '') return false;                                  // ...tsi at the end of a word
  if (/^(?:z|n)(?![aeiou])/.test(tail)) return false;             // -siz / -sin and their suffixes
  return true;
}

/* ── Dictionary index ──────────────────────────────────────────────────────────────────────── */

/** Longest first, so `GSR Logistics` wins over `GSR`, and `GSR` over `GS`. */
const byLengthDesc = <T extends { latin: string }>(list: T[]): T[] =>
  [...list].sort((a, b) => b.latin.length - a.latin.length);

const KEEP = byLengthDesc(keepLatin);
const RESPELL = byLengthDesc(respell);

/** Case-insensitive literal match of `term` at `i`, respecting word boundaries on the left. */
function matchesAt(text: string, i: number, term: string, exactCase: boolean): boolean {
  if (i > 0 && isWordChar(text[i - 1])) return false;
  const slice = text.slice(i, i + term.length);
  if (slice.length !== term.length) return false;
  return exactCase ? slice === term : slice.toLowerCase() === term.toLowerCase();
}

/** Length of the Uzbek suffix glued directly onto a token (`Telegram|da`, `avtomobil|ga`). */
function suffixLength(text: string, from: number): number {
  let j = from;
  while (j < text.length && (isLatinLetter(text[j]) || isApostrophe(text[j]))) j += 1;
  return j - from;
}

/* ── Engine ────────────────────────────────────────────────────────────────────────────────── */

/** One run of output, and whether it was copied out verbatim rather than transliterated. */
export interface Chunk {
  text: string;
  /** True for URLs, brands, codes, units — anything deliberately left in the Latin alphabet. */
  kept: boolean;
}

/**
 * Transliterate, keeping the protected runs separable so callers can audit what survived.
 * `toCyrillic` is this joined back together.
 */
export function toCyrillicChunks(input: string): Chunk[] {
  if (!input) return [];

  const out: Chunk[] = [];
  /** The previous Latin source character in the current word; '' at a word boundary. */
  let prev = '';
  let i = 0;

  const push = (s: string, newPrev: string) => {
    const last = out[out.length - 1];
    if (last && !last.kept) last.text += s;
    else out.push({ text: s, kept: false });
    prev = newPrev;
  };
  const keep = (s: string) => {
    out.push({ text: s, kept: true });
    prev = '';
  };

  outer: while (i < input.length) {
    // Patterns and dictionary terms can only begin where a token begins, which keeps this from
    // trying a hundred candidates against every character of every page.
    const atTokenStart = i === 0 || !isWordChar(input[i - 1]);

    if (atTokenStart) {
      const rest = input.slice(i);

      // 1. Shapes that are never words: URLs, placeholders, handles, numbers with units.
      for (const { re } of protectedPatterns) {
        const m = re.exec(rest);
        if (m && m[0].length > 0) {
          keep(m[0]);
          i += m[0].length;
          continue outer;
        }
      }

      // 2. Tokens that stay Latin. An Uzbek ending glued onto one is written in Cyrillic after
      //    a hyphen — `Taobaodan` → `Taobao-дан`; see `uzbekSuffix` in ./cyrillic.terms.ts.
      for (const term of KEEP) {
        if (!matchesAt(input, i, term.latin, term.exactCase === true)) continue;
        const end = i + term.latin.length;
        const suffix = suffixLength(input, end);
        if (suffix === 0) {
          keep(input.slice(i, end));
          i = end;
          continue outer;
        }
        if (term.suffixable !== true) continue; // a longer, different word — keep looking
        // The Latin copy may already mark the seam with an apostrophe — `GSR Logisticsʼning`.
        // That is the same seam; the Cyrillic side writes it as a hyphen either way, so the
        // page never shows two conventions for one thing.
        const tail = input.slice(end, end + suffix).replace(/^[ʻʼ‘’'`´ʹ′‵ʽʿ]+/, '');
        if (isUzbekSuffix(tail)) {
          keep(input.slice(i, end));
          push(`-${toCyrillic(tail)}`, tail[tail.length - 1]);
        } else {
          // Not an ending: an English compound, a model number, a word this token only starts.
          // Keep the whole thing Latin rather than transliterate a tail nobody has decided on.
          keep(input.slice(i, end + suffix));
        }
        i = end + suffix;
        continue outer;
      }

      // 3. Tokens with their own Cyrillic form.
      for (const term of RESPELL) {
        if (!matchesAt(input, i, term.latin, term.exactCase === true)) continue;
        const source = input.slice(i, i + term.latin.length);
        const hasSuffix = suffixLength(input, i + term.latin.length) > 0;
        let cyr = hasSuffix ? (term.stem ?? term.cyrillic) : term.cyrillic;
        if (/^[A-Z]/.test(source)) {
          const allCaps = source.length > 1 && source === source.toUpperCase();
          cyr = allCaps ? cyr.toUpperCase() : cyr[0].toUpperCase() + cyr.slice(1);
        }
        // A following suffix is transliterated normally, so the e-rule needs the stem's last letter.
        push(cyr, term.latin[term.latin.length - 1]);
        i += term.latin.length;
        continue outer;
      }
    }

    // 4. One Latin letter (or digraph) at a time.
    const ch = input[i];
    const lower = ch.toLowerCase();
    const upper = ch !== lower;
    const n1 = input[i + 1];
    const n1l = n1?.toLowerCase();

    if (isApostrophe(ch)) {
      // Not consumed by oʻ/gʻ above, so it is the tutuq belgisi.
      push('ъ', ch);
      i += 1;
      continue;
    }

    if (!isLatinLetter(ch)) {
      push(ch, isWordChar(ch) ? ch : '');
      i += 1;
      continue;
    }

    // Digraphs.
    if (lower === 'o' && isApostrophe(n1)) { push(matchCase('ў', upper), 'o'); i += 2; continue; }
    if (lower === 'g' && isApostrophe(n1)) { push(matchCase('ғ', upper), 'g'); i += 2; continue; }
    if (lower === 's' && n1l === 'h') { push(matchCase('ш', upper), 'h'); i += 2; continue; }
    if (lower === 'c' && n1l === 'h') { push(matchCase('ч', upper), 'h'); i += 2; continue; }
    if (lower === 't' && n1l === 's' && tsIsTse(input.slice(i + 2))) {
      push(matchCase('ц', upper), 's');
      i += 2;
      continue;
    }

    // y: iotated vowel, or the consonant й.
    if (lower === 'y') {
      // yoʻ is y + oʻ (yoʻq → йўқ), never the single letter ё.
      const isYoDigraph = n1l === 'o' && isApostrophe(input[i + 2]);
      const iotated = isYoDigraph || n1l === undefined ? undefined : IOTATED[n1l];
      if (iotated !== undefined && n1l !== undefined) {
        push(matchCase(iotated, upper), n1l);
        i += 2;
        continue;
      }
      push(matchCase('й', upper), 'y');
      i += 1;
      continue;
    }

    // e: э at the start of a word and after a vowel, е after a consonant.
    if (lower === 'e') {
      const initialOrAfterVowel = prev === '' || VOWELS.has(prev.toLowerCase());
      push(matchCase(initialOrAfterVowel ? 'э' : 'е', upper), 'e');
      i += 1;
      continue;
    }

    // c and w outside a protected token: they are not in the Uzbek Latin alphabet at all.
    // Left as-is on purpose, so `latinLeftovers` reports them and somebody makes a decision
    // in `cyrillic.terms.ts` instead of the engine guessing.
    const mapped = SINGLE[lower] ?? ch;
    push(mapped === ch ? ch : matchCase(mapped, upper), ch);
    i += 1;
  }

  return out;
}

/**
 * Transliterate Uzbek Latin text to Uzbek Cyrillic.
 *
 * Safe to call on a whole sentence, a heading, a slug fragment or a string that is already
 * Cyrillic — anything it does not recognise as Uzbek Latin is passed through untouched.
 */
export function toCyrillic(input: string): string {
  if (!input) return input;
  let s = '';
  for (const chunk of toCyrillicChunks(input)) s += chunk.text;
  return s;
}

/* ── Helpers ───────────────────────────────────────────────────────────────────────────────── */

/**
 * Latin letters that came out of the transliterator without being deliberately protected.
 * Empty is the healthy answer. Anything here is either a missing dictionary entry or a letter
 * the engine does not know — used as the corpus assertion in `scripts/test-cyrillic.mjs`, and
 * available to the Cyrillic locale build as a content guard.
 */
export function latinLeftovers(source: string): string[] {
  const runs: string[] = [];
  for (const chunk of toCyrillicChunks(source)) {
    if (chunk.kept) continue;
    runs.push(...(chunk.text.match(/[A-Za-z]+/g) ?? []));
  }
  return runs;
}

/** Every run this transliterator deliberately left in the Latin alphabet. */
export function keptLatin(source: string): string[] {
  return toCyrillicChunks(source).filter((c) => c.kept).map((c) => c.text);
}

/**
 * A Cyrillic URL slug: `Kargo lugʻati` → `карго-луғати`, and `kargo-lugati` → the same thing.
 *
 * Segment by segment, not string at once, because a slug is not prose:
 *
 *   1. Each segment is looked up in `slugWords` FIRST, under the fold the ASCII slug went
 *      through (lowercase, apostrophes removed). That is the whole fix for the ʻ the URL drops:
 *      `qollanma` and `qoʻllanma` both find the one entry and both give `қўлланма`. Without it
 *      the first spells `қолланма`, a different word and a permanently wrong URL.
 *   2. Anything else is transliterated by the ordinary rules.
 *   3. The soft and hard signs are KEPT: `kalkulyator` → `калькулятор`, `avtomobil-importi` →
 *      `автомобиль-импорти`. They are letters of the word, and the Cyrillic spelling is what a
 *      Cyrillic searcher types. Dropping them to look tidy misspells the keyword in the URL.
 *   4. A protected Latin run (a brand, a code) survives, lowercased, instead of being deleted:
 *      a slug that quietly loses a word is worse than one that admits it has a Latin word in it.
 */
export function toCyrillicSlug(input: string): string {
  const segments = input.match(/[A-Za-z0-9Ѐ-ӿʻʼ‘’'`´ʹ′‵ʽʿ]+/g) ?? [];
  return segments
    .map((segment) => {
      const folded = segment.toLowerCase().replace(/[ʻʼ‘’'`´ʹ′‵ʽʿ]/g, '');
      const known = Object.prototype.hasOwnProperty.call(slugWords, folded)
        ? slugWords[folded]
        : undefined;
      if (known !== undefined) return known;
      // The hyphen survives because the engine writes one itself, in `Taobao-дан`.
      return toCyrillic(segment).toLowerCase().replace(/[^a-z0-9Ѐ-ӿ-]+/g, '');
    })
    .join('-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}
