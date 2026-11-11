/**
 * Chinese (zh) display text for the about, FAQ and guide pages: zhBreaksHtml() (src/lib/zh-breaks.ts — a <wbr>
 * between words, clause-first when every clause fits a 320px line) plus one more break opportunity: before a
 * country name that follows another word directly.
 *
 * zh-breaks.ts joins a lone character to the words on both sides of it, which can glue a country name into a unit
 * wider than the line: «从中国运到乌兹别克斯坦？» is 12 ideographs, more than a 390px h1 (11.2) or a 320px guide card
 * (7.8) holds. `word-break: keep-all` then has no break left, and the overflow-wrap emergency break fell before the
 * question mark («…乌兹别克斯坦 / ？禁运…» at 390–414px) or inside the name. «从中国运到 / 乌兹别克斯坦？» is the break
 * a Chinese typesetter makes.
 */
import { zhBreaksHtml } from './zh-breaks';

/** A long country name right after an ideograph (not after a tag, a <wbr> or a space). */
const NAME = /(?<=[㐀-鿿])(乌兹别克斯坦|哈萨克斯坦|吉尔吉斯斯坦|塔吉克斯坦)/gu;

/** `text` as HTML for a span.zw (see zh-breaks.ts for `clauseMax`). */
export function zhDisplayHtml(text: string, clauseMax = 0): string {
  return zhBreaksHtml(text, clauseMax).replace(NAME, '<wbr>$1');
}
