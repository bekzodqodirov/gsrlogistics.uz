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
/** The one tracking bot (owner-confirmed 2026-09-10). Any other bot handle on a page is a typo. */
const BOT = 'GSR_GROUP_AGENT_bot';
const FORBIDDEN = [
  // "bojsiz" is legitimate when denying the promise ("«bojsiz» degan vaʼda bermaymiz") or naming the
  // statutory duty-free allowance; flag it only when the site promises it.
  [/(?<!«)bojsiz(?!» degan|\s+olib kirish normalari|\s+emas)\s+(olib kelamiz|yetkazamiz|keltiramiz|kargo)/i, 'promises duty-free (bojsiz)'],
  [/hujjatsiz olib kel/i, 'claims shipping without documents'],
  [/rastamojka kerak emas/i, 'claims no customs needed'],
  [/без пошлин\s+(привезём|доставим|возим)/i, 'promises duty-free (RU)'],
  [/eng yaxshi (kargo|logistika)/i, 'unprovable superlative'],
  [/xalqaro kompaniya/i, 'unprovable "international company"'],
  // ---- the QR / bot system, owner-confirmed 2026-09-10 -------------------------------------
  // Staff scan; the client never does. Telling a client to scan is the kind of promise they find
  // out about while standing over a carton, so only the imperative and "you scan" forms are
  // banned — "do I have to scan it myself?" answered with "no" is exactly the copy we want.
  [/\bskanerlang\b|\bskanerlaysiz\b|\bskanerlab oling\b/i, 'tells the client to scan the QR — staff scan, the client never does'],
  // No \b around Cyrillic: JS word boundaries only know ASCII, so \bсканируйте never matches.
  [/про?сканируйте|отсканируйте|сканируйте|вы сканируете|сканируете сами/i, 'tells the client to scan the QR (RU) — staff scan, the client never does'],
  [/\byou (?:can |must |need to |have to )?scan\b|\bscan[^.?!]{0,24}\byourself\b/i, 'tells the client to scan the QR (EN) — staff scan, the client never does'],
  // "skanerlashim kerakmi?" (may I / must I, 1st person, answered "no") is the copy we want;
  // "skanerlashingiz kerak" (you must) is the promise that fails over a carton.
  [/skanerlashingiz\s+(?:kerak|lozim|zarur|shart)/i, 'tells the client they must scan the QR — staff scan, the client never does'],
  // Order matters: "Вам сканировать ничего не нужно" is the denial we publish, "вам нужно
  // сканировать" is the claim we must never publish.
  [/вам\s+(?:нужно|надо|необходимо|придётся|придется)[^.?!]{0,30}сканировать/i, 'tells the client they must scan the QR (RU) — staff scan, the client never does'],
  // Stage-by-stage scanning is not a live position, and saying otherwise invites "why has it not
  // moved since Tuesday". "GPS-trekker" in the prohibited-goods lists is a different thing.
  [/real[\s-]?time|в реальном времени|\breal vaqt/i, 'says real-time — tracking is stage-by-stage QR scanning'],
  // The three ways of saying "live position" — each allowed only inside its own denial, which is
  // exactly how the tracking page uses them ("Bu … jonli joylashuvi emas" / "Это не живая
  // координата машины" / "It is not a live vehicle position").
  [/jonli joylashuv(?![^.!?]{0,12}emas)/i, 'claims a live position — tracking is stage-by-stage QR scanning'],
  [/(?<!не )жив(?:ая|ой|ую|ое) (?:координат|местополож|геолокац)/i, 'claims a live position (RU) — tracking is stage-by-stage QR scanning'],
  [/(?<!not )\ba live (?:vehicle |truck |cargo )?(?:position|location)\b/i, 'claims a live position (EN) — tracking is stage-by-stage QR scanning'],
  [/\bGPS\b(?![\s-]?(?:tracker|trekker|трекер))[^.!?]{0,50}(?:kuzat|отслеж|track)|(?:kuzatuv|kuzatib|отслеживани|tracking)[^.!?]{0,50}\bGPS\b(?![\s-]?(?:tracker|trekker|трекер))/i, 'implies live GPS position — tracking is stage-by-stage QR scanning'],
  // The four figures the owner confirmed on 2026-09-10 are publishable at exactly those values.
  // A drifted number is an invented one; and 15 years belongs to the TEAM, never to GSR, which
  // was founded in 2018 and is written "8+ yil".
  [/(?<!\d)(?!400\+)\d{2,5}\+\s?(?:mijoz|клиент|clients)/i, 'client count other than the confirmed 400+'],
  [/(?<!\d)(?!10\+)\d{1,4}\+\s?(?:fura|фур|trucks?)/i, 'truck count other than the confirmed 10+ a month'],
  // Proof's fact list prints the LABEL first and the number second ("Mijozlar 400+"), so the rule
  // above — which reads number-then-label — never sees the one place this figure actually lives on
  // the home page. Mirror it, with the plural forms only: a bare "клиент 5+" or "fura 40+ tonna"
  // would be a unit, not a count, and a guard that cries wolf gets deleted.
  [/(?:mijozlar|клиентов|клиенты|clients)\s(?!400\+)\d{2,5}\+/i, 'client count other than the confirmed 400+'],
  // GSR itself is 8+ years (2018). No other "N+ years" figure exists on the site, so pinning the
  // whole shape is safe — and it is the one number a drifting "12+ yil" would sail past.
  // `\b` cannot close this one: JS word boundaries are ASCII-only, so "20+ лет" would sail past a
  // trailing \b exactly the way "\bсканируйте" never matches. Close it with an explicit letter class.
  [/(?<!\d)(?!8\+)\d{1,3}\+\s?(?:yil|лет|года|years)(?![a-zA-Zа-яёʻʼ])/i, 'company age other than the confirmed 8+ years (GSR, since 2018)'],
  [/GSR(?![^.!?]{0,24}(?:jamoa|команд|team))[^.!?]{0,24}15\s?(?:yil|лет|years)/i, '15 years belongs to the team, not to GSR (GSR is 8+ years, since 2018)'],
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
  // One bot, one username, everywhere — visible text, hrefs and JSON-LD alike (so this reads the
  // raw HTML, not the stripped copy). A single wrong character hands a client to a stranger's bot.
  const bots = new Set();
  for (const m of html.matchAll(/(?:@|t\.me\/)([A-Za-z0-9_]{4,32})(?![A-Za-z0-9_.@-])/g))
    if (/bot$/i.test(m[1]) && m[1] !== BOT) bots.add(m[1]);
  for (const b of bots) errors.push(`${url}: unknown Telegram bot @${b} — the only one is @${BOT}`);
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
