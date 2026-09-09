// Content guard rails: run after every build (npm run check:content).
// Fails on forbidden claims, wrong apostrophes, inconsistent number/percent style and
// language leaks between the uz/ru/en trees. Keeps the site honest as content changes.
import fs from 'node:fs';
import path from 'node:path';
const dist = process.argv[2] || 'dist';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'index.html' ? [path.join(d, e.name)] : []);
const strip = (html) => {
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [''])[0]
    .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ');
  return main.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
};
const errors = [];
const warn = [];
const FORBIDDEN = [
  // "bojsiz" is legitimate when denying the promise ("«bojsiz» degan vaʼda bermaymiz") or naming the
  // statutory duty-free allowance; flag it only when the site promises it.
  [/(?<!«)bojsiz(?!» degan|\s+olib kirish normalari|\s+emas)\s+(olib kelamiz|yetkazamiz|keltiramiz|kargo)/i, 'promises duty-free (bojsiz)'],
  [/hujjatsiz olib kel/i, 'claims shipping without documents'],
  [/rastamojka kerak emas/i, 'claims no customs needed'],
  [/без пошлин\s+(привезём|доставим|возим)/i, 'promises duty-free (RU)'],
  [/eng yaxshi (kargo|logistika)/i, 'unprovable superlative'],
  [/xalqaro kompaniya/i, 'unprovable "international company"'],
  [/\b(1[0-9]{3}|[0-9]{3})\+ mijoz/i, 'invented client counter'],
  [/One Belt|Bir makon, bir yoʻl assotsiatsiyasining rasmiy vakili/i, 'unverified association claim'],
  [/viloyat filial/i, 'claims regional branches'],
  // Who operates each of the three China receiving points is unverified — the Guangzhou and Kashgar
  // cards both name third-party logistics firms — so none of them is ever "ours".
  [/omborimiz|наш(его|ем|) склад|our (Yiwu|Guangzhou|Kashgar)[^.]{0,12}warehouse/i, 'claims a China receiving point as our own'],
  // ...and equally, we no longer receive Guangzhou cargo only "through partners": there is an address.
  [/(Guanchjou|Гуанчжоу|Guangzhou)[^.!?]{0,80}(hamkorlar orqali|через партнёров|through partners)/i, 'stale "through partners" claim for Guangzhou'],
  [/(hamkorlar orqali|через партнёров|through partners)[^.!?]{0,80}(Guanchjou|Гуанчжоу|Guangzhou)/i, 'stale "through partners" claim for Guangzhou'],
  // Contact details the owner replaced on 2026-09-09; none of them may come back.
  [/\+998 ?97 ?333 ?39 ?33|998973333933/, 'retired second phone number'],
  [/info@gsrlogistics\.uz/i, 'retired e-mail address'],
  [/t\.me\/\+998950183333/, 'retired Telegram phone deep link — use the manager username'],
  // No promise about how fast a reply arrives: the channel is dormant and nobody has staffed a target.
  [/hozir javob beramiz|отвечаем сейчас|answer now, not|Eng tez javob|[Бб]ыстрее всего|fastest reply/i, 'promises a reply speed'],
  [/uzel(ini|i)\b/i, 'Russian loan "uzel" → "tugun"'],
  [/powerbank/i, 'powerbank → power bank'],
];
for (const file of walk(dist)) {
  const url = '/' + path.relative(dist, path.dirname(file)).replace(/\\/g, '/') + '/';
  const html = fs.readFileSync(file, 'utf8');
  const text = strip(html);
  const lang = /^\/ru\//.test(url) ? 'ru' : /^\/en\//.test(url) ? 'en' : 'uz';
  for (const [re, msg] of FORBIDDEN) if (re.test(text)) errors.push(`${url}: ${msg}`);
  if (lang === 'uz') {
    const bad = text.match(/\b[a-zA-Z]+['’][a-z]{1,4}\b/g) || [];
    const real = bad.filter((w) => !/^(don|isn|doesn|won|can|it|that|Alibaba|Logistics)/i.test(w));
    if (real.length) warn.push(`${url}: ASCII/typographic apostrophe in Uzbek: ${[...new Set(real)].slice(0, 4).join(', ')}`);
    for (const [re, msg] of [[/\bKitay\b/, 'Kitay → Xitoy'], [/\bzayavka\b/i, 'zayavka → soʻrov'], [/amalga oshiramiz/i, 'calque "amalga oshiramiz"'], [/\btomonidan\b/, 'passive "tomonidan"'], [/Sizning yukingiz/, 'calque "Sizning yukingiz"']])
      if (re.test(text)) errors.push(`${url}: ${msg}`);
    // A parenthesised English form is a deliberate glossary gloss: "Xorgos (Khorgos)".
    if (/(?<!\()\b(Guangzhou|Shenzhen|Almaty|Shymkent|Khorgos|Yiwu)\b(?!\))/.test(text)) warn.push(`${url}: English toponym in Uzbek copy`);
  }
  if (/\d %/.test(text)) warn.push(`${url}: spaced percent`);
  if (/÷ ?\d{4}\b/.test(text)) warn.push(`${url}: unseparated divisor`);
  // Uzbek terms glossed for the reader ("in Uzbek it is yigʻma yuk") are intentional.
  if (lang !== 'uz' && /(?<!(in Uzbek it is |по-узбекски — ))(Ivu ombor|yigʻma yuk|bojxona rasmiylashtiruvi)/.test(text)) warn.push(`${url}: Uzbek word in ${lang} copy`);
  if (lang === 'en' && /soʻm/.test(text)) warn.push(`${url}: "soʻm" in English copy (use UZS)`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${url}: ${h1} h1 elements`);
}
const out = (label, list) => { if (list.length) { console.log(`\n${label} (${list.length}):`); for (const l of list.slice(0, 40)) console.log('  ' + l); } };
out('WARNINGS', warn);
out('ERRORS', errors);
console.log(`\nchecked ${walk(dist).length} pages · ${errors.length} errors · ${warn.length} warnings`);
process.exit(errors.length ? 1 : 0);
