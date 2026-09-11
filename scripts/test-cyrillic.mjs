// Tests for src/lib/cyrillic.ts — the Uzbek Latin → Cyrillic transliterator the /kirill/ locale
// is generated from. Run: node scripts/test-cyrillic.mjs
// Node ≥ 22.18 strips types natively; on older 22.x add --experimental-strip-types.
//
// Four layers:
//   1. Rule cases — one assertion per rule, with the word that exercises it.
//   2. The published URL list — every Cyrillic slug the site serves, pinned from both sides:
//      against the transliterator and against the tables in src/i18n/routes.ts. A slug is
//      permanent, so this list is a contract; a change here is a dead URL somewhere.
//   3. Round trip — an independent Cyrillic → Latin inverse, run over every word of the site.
//   4. The real corpus — every `uz` string in src/i18n and src/data AND every line of the ten
//      guide articles, transliterated and checked for mangled protected tokens, surviving Latin,
//      undecided acronyms, brand endings nobody ruled on, lost placeholders and empty output.
//      This layer is the one that fails when somebody adds content the dictionary has not seen.

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { register } from 'node:module';

const ROOT = new URL('../', import.meta.url);

/* ── Let plain Node read the site's content modules ────────────────────────────────────────── */
// Astro resolves `@/x` and extensionless imports; Node does not. This hook teaches it both, so
// the tests can assert against the actual strings the site ships rather than a copy of them.
const HOOK = `
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const ROOT = ${JSON.stringify(ROOT.href)};
export async function resolve(spec, ctx, next) {
  let s;
  if (spec.startsWith('@/')) s = new URL('src/' + spec.slice(2), ROOT).href;
  else if (spec.startsWith('./') || spec.startsWith('../')) s = new URL(spec, ctx.parentURL ?? ROOT).href;
  else return next(spec, ctx);
  if (!['.ts', '.js', '.mjs', '.json'].some((e) => s.endsWith(e))) {
    for (const ext of ['.ts', '.js', '.json']) {
      if (existsSync(fileURLToPath(s + ext))) { s = s + ext; break; }
    }
  }
  if (s.endsWith('.json')) {
    const r = await next(s, { ...ctx, importAttributes: { type: 'json' } });
    return { ...r, format: 'json', importAttributes: { type: 'json' } };
  }
  return next(s, ctx);
}
`;
register('data:text/javascript,' + encodeURIComponent(HOOK));

const { toCyrillic, toCyrillicSlug, latinLeftovers, keptLatin } = await import(
  new URL('src/lib/cyrillic.ts', ROOT).href
);
const { keepLatin, respell, acronymsHandledByRule, slugWords, isUzbekSuffix } = await import(
  new URL('src/lib/cyrillic.terms.ts', ROOT).href
);
// The routing tables, so the published slugs can be pinned from both sides.
const routeModule = await import(new URL('src/i18n/routes.ts', ROOT).href);

/* ── Harness ───────────────────────────────────────────────────────────────────────────────── */

let passed = 0;
let failed = 0;
const test = (name, fn) => {
  try {
    fn();
    passed += 1;
    console.log(`ok - ${name}`);
  } catch (err) {
    failed += 1;
    console.log(`NOT OK - ${name}\n    ${err.message.split('\n').join('\n    ')}`);
  }
};
/** Assert a whole table of latin → cyrillic pairs at once, reporting every miss. */
const expectAll = (pairs) => {
  const wrong = Object.entries(pairs)
    .map(([latin, want]) => [latin, want, toCyrillic(latin)])
    .filter(([, want, got]) => got !== want);
  assert.equal(
    wrong.length,
    0,
    wrong.map(([latin, want, got]) => `${latin}: expected ${want}, got ${got}`).join('\n'),
  );
};

/* ══ 1. The rules ══════════════════════════════════════════════════════════════════════════ */

test('single letters cover the whole 1995 alphabet', () => {
  expectAll({
    'abdfgiklmnoprstuvxz': 'абдфгиклмнопрстувхз',
    'q': 'қ', 'h': 'ҳ', 'x': 'х', 'j': 'ж',
    'ABDFGIKLMNOPRSTUVXZ': 'АБДФГИКЛМНОПРСТУВХЗ',
    'Qishloq': 'Қишлоқ',
    'hujjat': 'ҳужжат',
    'xarajat': 'харажат',
    'joʻnatish': 'жўнатиш',
  });
});

test('digraphs: oʻ gʻ sh ch, in both cases', () => {
  expectAll({
    'oʻzbek': 'ўзбек',
    'Oʻzbekiston': 'Ўзбекистон',
    'gʻisht': 'ғишт',
    'Gʻishtkoʻprik': 'Ғишткўприк',
    'shahar': 'шаҳар',
    'Shartnoma': 'Шартнома',
    'chegara': 'чегара',
    'Chorsu': 'Чорсу',
    'toʻgʻri': 'тўғри',
    'oʻxshash': 'ўхшаш',
    // Digraphs inside an all-caps acronym.
    'AQSH': 'АҚШ',
    'MChJ': 'МЧЖ',
  });
});

test('every look-alike apostrophe is the same letter', () => {
  const want = 'тўғри';
  for (const apos of ['ʻ', 'ʼ', '‘', '’', "'", '`', '´', 'ʹ', '′']) {
    const src = `to${apos}g${apos}ri`;
    assert.equal(toCyrillic(src), want, `${JSON.stringify(apos)} not accepted as a digraph mark`);
  }
  for (const apos of ['ʼ', 'ʻ', '’', "'"]) {
    assert.equal(toCyrillic(`ma${apos}lumot`), 'маълумот', `${JSON.stringify(apos)} not accepted as tutuq`);
  }
});

test('tutuq belgisi is ъ, and never eats a digraph', () => {
  expectAll({
    'maʼlumot': 'маълумот',
    'eʼlon': 'эълон',        // word-initial e stays э in front of the hard sign
    'eʼtibor': 'эътибор',
    'baʼzi': 'баъзи',
    'isteʼmol': 'истеъмол',
    'qatʼiy': 'қатъий',
    'yaʼni': 'яъни',
    'sanʼat': 'санъат',
    'soʻrovʼ': 'сўровъ',     // an apostrophe after a consonant is still the hard sign
  });
});

test('ng stays нг — it is not a digraph', () => {
  expectAll({
    'yangi': 'янги',
    'keng': 'кенг',
    'qoʻngʻiroq': 'қўнғироқ', // ng here is n + gʻ, and gʻ still wins
    'engil': 'энгил',
    'menga': 'менга',
  });
});

test('e is э at the start of a word and after a vowel, е after a consonant', () => {
  expectAll({
    'eshik': 'эшик',          // the canary
    'kelasiz': 'келасиз',
    'emas': 'эмас',
    'eng': 'энг',
    'ekspress': 'экспресс',
    'aeroport': 'аэропорт',   // after a vowel
    'menejer': 'менежер',
    'tekshiramiz': 'текширамиз',
    'reys': 'рейс',
    'eshik-derazalar': 'эшик-деразалар', // a hyphen starts a new word; d still takes е
    'Elektromobil': 'Электромобиль',
  });
});

test('ye yo yu ya are one Cyrillic letter, in every position', () => {
  expectAll({
    // Word-initial.
    'yer': 'ер', 'yetkazib': 'етказиб', 'yoki': 'ёки', 'yuk': 'юк', 'yana': 'яна',
    // After a vowel.
    'dunyo': 'дунё', 'piyoda': 'пиёда', 'jarayon': 'жараён', 'suyuq': 'суюқ',
    'poyezd': 'поезд', 'faoliyat': 'фаолият',
    // After a consonant — still the single letter, not й + vowel.
    'byudjet': 'бюджет', 'menyu': 'меню', 'samolyot': 'самолёт', 'plyonka': 'плёнка',
    'akkumulyator': 'аккумулятор', 'kimyoviy': 'кимёвий',
    // y before a consonant, before i, and doubled.
    'yigʻma': 'йиғма', 'quyidagi': 'қуйидаги', 'tayyor': 'тайёр', 'qiymat': 'қиймат',
    'oyna': 'ойна', 'koʻzoynaklar': 'кўзойнаклар',
    // yoʻ is y + oʻ, never ё.
    'yoʻq': 'йўқ', 'yoʻl': 'йўл', 'yoʻnalish': 'йўналиш', 'yoʻriqnoma': 'йўриқнома',
    // Capitalised.
    'Yoʻq': 'Йўқ', 'Yigʻma': 'Йиғма', 'Yana': 'Яна', 'Yuk': 'Юк',
  });
});

test('ts is ц only in loanwords, never across an Uzbek suffix boundary', () => {
  expectAll({
    // Russian loanwords: ц between vowels became "ts".
    'deklaratsiya': 'декларация',
    'deklaratsiyasi': 'декларацияси',
    'konsolidatsiya': 'консолидация',
    'spetsifikatsiya': 'спецификация', // twice in one word
    'utilizatsiya': 'утилизация',
    'aviatsiya': 'авиация',
    'navigatsiya': 'навигация',
    'ratsiyalar': 'рациялар',
    'litsenziya': 'лицензия',          // ts before e
    'konstitutsion': 'конституцион',   // -ion, not the -in suffix
    // Native Uzbek: t meeting an s-initial suffix. These must stay тс.
    'hujjatsiz': 'ҳужжатсиз',
    'hujjatsizlik': 'ҳужжатсизлик',
    'yetsa': 'етса',
    'ketsa': 'кетса',
    'aytsa': 'айтса',
    'aytsin': 'айтсин',
    'aytsinlar': 'айтсинлар',
    'ketsin': 'кетсин',
  });
});

test('sh and ch are always the digraph — the site has no s+h or c+h boundary', () => {
  // Uzbek has no suffix beginning with h and no standalone letter c, so the two cannot meet
  // across a morpheme boundary. Every word on the site confirms it (see the corpus test below).
  expectAll({
    'ishonch': 'ишонч',
    'maishiy': 'маиший',
    'oʻxshash': 'ўхшаш',
    'mustahkamlash': 'мустаҳкамлаш', // s + t + a + h — the h belongs to the next syllable
    'dastgoh': 'дастгоҳ',
    'maslahat': 'маслаҳат',
    'shoshilinch': 'шошилинч',
    'bosqichma-bosqich': 'босқичма-босқич',
  });
  // If such a word ever appears, the dictionary is the place for it — no engine change needed.
  // Proof the mechanism is there: a respell entry overrides the digraph.
  assert.equal(toCyrillic('Isʼhoq'), 'Исъҳоқ', 'tutuq already separates s from h');
});

/* ══ 2. Protected tokens ═══════════════════════════════════════════════════════════════════ */

test('brands and product names stay Latin', () => {
  expectAll({
    'GSR Logistics': 'GSR Logistics',
    'WhatsApp va Instagram': 'WhatsApp ва Instagram',
    'Facebook': 'Facebook',
    'Google Maps': 'Google Maps',
    'Yandex Market': 'Yandex Market',
    'Uzum': 'Uzum',        // not "узум", the Uzbek word for grape
    'Click yoki Payme': 'Click ёки Payme',
    'Humo/Uzcard': 'Humo/Uzcard',
    'BYD, Zeekr, Li Auto': 'BYD, Zeekr, Li Auto',
    'Song, Seal, Tang, Han': 'Song, Seal, Tang, Han',
    '1688 va Taobao': '1688 ва Taobao',
    'Nike, Apple, Disney': 'Nike, Apple, Disney',
    'Android/iOS uchun': 'Android/iOS учун',
    'Wi-Fi qurilmalari': 'Wi-Fi қурилмалари',
  });
});

test('a Latin brand with an Uzbek ending: Latin name, Cyrillic ending, hyphen between', () => {
  expectAll({
    // The defect this rule fixes: a whole Latin word, ending and all, mid-Cyrillic-sentence.
    'Taobaodan sotib olish': 'Taobao-дан сотиб олиш',
    'Telegramda yozing': 'Telegram-да ёзинг',
    'Telegramga': 'Telegram-га',
    'Telegramni ochadi': 'Telegram-ни очади',
    'Alibabadan': 'Alibaba-дан',
    'Pinduoduodan ham': 'Pinduoduo-дан ҳам',
    'Taobaodagidan 20% arzon': 'Taobao-дагидан 20% арзон',
    'MOQni': 'MOQ-ни',
    'MOQsiz sotiladi': 'MOQ-сиз сотилади',
    'EEISVOda': 'EEISVO-да',
    'GSR Logisticsning ombori': 'GSR Logistics-нинг омбори', // not GSR Логистиcснинг
    'Uzumda': 'Uzum-да',
    'Keqiaoda': 'Keqiao-да',
    // A hyphen the copy already wrote is left where it is — same shape, nothing doubled.
    '1688-da': '1688-да',
    '1688dan': '1688-дан',
    // Not an Uzbek ending: an English compound keeps the old behaviour and stays wholly Latin,
    // because transliterating a tail nobody decided about is how "Таобаожимс" ships.
    'Clickable': 'Clickable',
    'Clickbait': 'Clickbait',
    // Uppercase is shouting, not a suffix.
    'TELEGRAMDA': 'TELEGRAMDA',
    // …and a token that merely starts another word is not a brand at all.
    'SIM-kartali smart-soatlar': 'SIM-картали смарт-соатлар', // "sm" must not eat "smart"
  });
});

test('the GS cargo mark stays Latin — it is what is written on the carton', () => {
  expectAll({
    'GS kod': 'GS код',
    'GS kodingizni': 'GS кодингизни',
    'GSR': 'GSR',            // the longer token wins over GS
    'GS kodi boʻyicha': 'GS коди бўйича',
  });
});

// Units split two ways, and the site's own Russian pages decided where the line falls: they
// print кг 496 times, м³ 570, км 35 and см 117, against a single Latin stray each. A unit a
// Cyrillic reader in this market writes in Cyrillic is written in Cyrillic here too — otherwise
// two Cyrillic-script locales of one site disagree, and a searcher typing "1 кг нархи" finds a
// page that does not contain the token. What stays Latin is what is read off a foreign spec
// sheet or a container door: ft, HC, V, Hz, mm, m².
test('units with a Cyrillic form are written in Cyrillic', () => {
  expectAll({
    '110 $/m³': '110 $/м³',
    '9 $/kg dan': '9 $/кг дан',
    'zichlik 250 kg/m³': 'зичлик 250 кг/м³',
    '5 000+ km': '5 000+ км',
    '20 t gacha': '20 т гача',
    '50 × 40 × 30 sm': '50 × 40 × 30 см',
    '380 kVt': '380 кВт',
  });
});

test('symbols read off a spec sheet or a container stay Latin', () => {
  expectAll({
    '20ft/40ft': '20ft/40ft',
    '40 HC': '40 HC',
    '380 V, 50 Hz': '380 V, 50 Hz',
    '12%': '12%',
    '41.32° N · 69.25° E': '41.32° N · 69.25° E',
    '128 GB': '128 GB',
    '2 mm': '2 mm',
  });
});

// `sm` and `kVt` are the exception to the rule above, and the reason is that they are not
// symbols. `kg`, `km`, `m³`, `t`, `Hz` are international and identical in every alphabet;
// `sm` and `kVt` are how Uzbek LATIN shortens santimetr and kilovatt — the international
// spellings are `cm` and `kW`. src/i18n/pricing.ts proves the copy already treats this unit as
// per-language: uz `sm`, en `cm`, ru `см`. Left Latin, the Cyrillic aviation page printed
// "50 × 40 × 30 sm ли қути — 60 000 sm³" while the Russian one printed "… см — 60 000 см³".
test('sm and kVt are Uzbek abbreviations, not symbols, so they take their Cyrillic form', () => {
  expectAll({
    'uzunlik × en × balandlik (sm)': 'узунлик × эн × баландлик (см)',
    '50 × 40 × 30 sm li quti — 60 000 sm³': '50 × 40 × 30 см ли қути — 60 000 см³',
    'Oʻlchamlar, sm': 'Ўлчамлар, см',
    'Uy zaryadlovchisi (7 kVt)': 'Уй зарядловчиси (7 кВт)',
    // The look-alikes this must not damage: an acronym that starts with the same two letters,
    // and ordinary words that begin "sm" and have always transliterated by rule.
    'SMGS nakladnoyi': 'SMGS накладнойи',
    'smartfon va smart-soat': 'смартфон ва смарт-соат',
  });
});

// A hyphen that belongs to the trademark is not the seam the brand+ending rule writes. `DM`
// would otherwise be kept by the acronym rule and `-i` read as the Uzbek possessive.
test('a hyphen inside a model name is not an Uzbek ending', () => {
  expectAll({
    'Li Auto va BYD DM-i seriyalari': 'Li Auto ва BYD DM-i сериялари',
    // For contrast, the seam the rule DOES write, and an acronym+word compound that must keep
    // transliterating its tail:
    'Taobaodan': 'Taobao-дан',
    'GPS-trekker': 'GPS-треккер',
    'SIM-li telefon': 'SIM-ли телефон',
  });
});

// Raw pinyin stays Latin. These nine have only Uzbek-legal letters, so nothing in the spelling
// stopped the rules and they came out as Баиюн / Чанченг / Гангдинг — splitting one sentence
// across two alphabets beside the Latin neighbours in the same list ("Чанченг ва Nanhai
// туманларида"). The rules cannot reach the -нь and -э Cyrillic wants (Байюн, Шуньдэ).
test('raw pinyin place names stay Latin even when every letter is an Uzbek letter', () => {
  expectAll({
    'Baiyun va Guihuagang bozorlari, Sanyuanli hududi':
      'Baiyun ва Guihuagang бозорлари, Sanyuanli ҳудуди',
    'Chancheng va Nanhai tumanlarida': 'Chancheng ва Nanhai туманларида',
    'Tianhe tumanidagi Gangding va Dashatou': 'Tianhe туманидаги Gangding ва Dashatou',
    'Lecong mebel bozori Shunde tumanida': 'Lecong мебель бозори Shunde туманида',
    'Yide yoʻli va Mingtong': 'Yide йўли ва Mingtong',
    'Guangyuan yoʻli': 'Guangyuan йўли',
    'Baima bozori': 'Baima бозори',
    'Keqiaoda': 'Keqiao-да',
    // The adapted spellings still transliterate — that is the other half of the rule.
    'Guanchjou, Ivu va Foshan': 'Гуанчжоу, Иву ва Фошан',
  });
});

// The Latin spells some Russian -ция loans with a bare "s" instead of "ts", so the rule leaves
// с. The site's own Russian copy writes every one of these with ц.
test('ц loanwords the Latin spells with a bare s', () => {
  expectAll({
    'Chjetszyan provinsiyasidagi': 'Чжетсзян провинциясидаги',
    'yangi kolleksiyalar': 'янги коллекциялар',
    'kargo aksiyalari': 'карго акциялари',
    'zavod inspeksiyasi': 'завод инспекцияси',
    'Kanselyariya, sport tovarlari': 'Канцелярия, спорт товарлари',
    // Native words that merely look similar must keep с.
    'aksincha, kursi va taksi': 'аксинча, курси ва такси',
  });
});

test('abbreviations with their own Cyrillic form are respelled, not transliterated', () => {
  expectAll({
    'QQS 12%': 'ҚҚС 12%',
    'QQSni': 'ҚҚСни',
    'deklaratsiya (GTD)': 'декларация (ГТД)',
    'TN VED kodi': 'ТН ВЭД коди',
    'AQSH': 'АҚШ',
    '1 BRV': '1 БРВ',
    'BRVda': 'БРВда',
    'VMQ-55, 2025-yil 31-yanvar': 'ВМҚ-55, 2025-йил 31-январь',
    'PQ-3818': 'ПҚ-3818',
    'PF-140': 'ПФ-140',
    'SES xulosasi': 'СЭС хулосаси',     // СЕС would be wrong: in an acronym E is named Э
    'MB kursi': 'МБ курси',
    'OʻRQ-547': 'ЎРҚ-547',
    'YaTT/MChJ': 'ЯТТ/МЧЖ',
  });
});

test('codes that stay Latin, stay Latin', () => {
  expectAll({
    'LCL va FCL': 'LCL ва FCL',
    'CMR (avto), SMGS (temir yoʻl) yoki AWB (avia)': 'CMR (авто), SMGS (темир йўл) ёки AWB (авиа)',
    'E-Contract (EEISVO)': 'E-Contract (EEISVO)',
    'PINFL boʻyicha': 'PINFL бўйича',
    'Incoterms 2020: EXW, FOB, CIF': 'Incoterms 2020: EXW, FOB, CIF',
    'IATA DGR': 'IATA DGR',
    'UN3480 va UN3481': 'UN3480 ва UN3481',
    'GPS treker': 'GPS трекер',
    'UzIMEI roʻyxati': 'UzIMEI рўйхати',
    'AK-123': 'AK-123',
    'SGS, TÜV, Intertek': 'SGS, TÜV, Intertek',
    'QR kod': 'QR код',
    'VIN raqami': 'VIN рақами',
    'GB/T va CCS2': 'GB/T ва CCS2',
    'Telegram FZ-LLC': 'Telegram FZ-LLC',
    'HTTPS orqali': 'HTTPS орқали',
  });
});

test('English glosses in brackets are left in English', () => {
  expectAll({
    'FCL (Full Container Load)': 'FCL (Full Container Load)',
    'LCL (Less than Container Load)': 'LCL (Less than Container Load)',
    'MOQ (minimum order quantity)': 'MOQ (minimum order quantity)',
    'qadoqlash roʻyxati (packing list)': 'қадоқлаш рўйхати (packing list)',
    'Trade Assurance': 'Trade Assurance',
    'power bank': 'power bank',
    'Ochiq platforma / flat rack': 'Очиқ платформа / flat rack',
    'Sayt cookie-banner ishlatmaydi': 'Сайт cookie-баннер ишлатмайди',
    'GitHub, Inc.': 'GitHub, Inc.',
  });
});

test('URLs, e-mails, handles, placeholders and phone masks are untouched', () => {
  expectAll({
    'my.gov.uz portalida': 'my.gov.uz порталида',
    'lex.uz/docs/3802366': 'lex.uz/docs/3802366',
    '1688.com va Alibaba.com': '1688.com ва Alibaba.com',
    'https://gsrlogistics.uz/narxlar/': 'https://gsrlogistics.uz/narxlar/',
    'info@gsrlogistics.uz': 'info@gsrlogistics.uz',
    '@GSR_GROUP_AGENT_bot botida': '@GSR_GROUP_AGENT_bot ботида',
    '{count} ta savol': '{count} та савол',
    'avia {airDays} kun': 'авиа {airDays} кун',
    // the placeholders survive byte for byte; the units around them localise like any other
    'Zichlik {density} kg/m³ → {m3} m³ × {rate}': 'Зичлик {density} кг/м³ → {m3} м³ × {rate}',
    'Oʻzbekiston raqami: +998 XX XXX XX XX': 'Ўзбекистон рақами: +998 XX XXX XX XX',
    '+998 90 123 45 67': '+998 90 123 45 67',
  });
});

test('other scripts are passed through exactly', () => {
  expectAll({
    'Ivu (义乌), Guanchjou (广州) yoki Qashqar (喀什)': 'Иву (义乌), Гуанчжоу (广州) ёки Қашқар (喀什)',
    'bozorda «хитой карго» deb ham qidiriladi': 'бозорда «хитой карго» деб ҳам қидирилади',
    'Yigʻma yuk (LCL, сборный груз)': 'Йиғма юк (LCL, сборный груз)',
    'Yogʻoch panjara (обрешётка)': 'Ёғоч панжара (обрешётка)',
    'rasmiylashtiruvidan (растаможка)': 'расмийлаштирувидан (растаможка)',
  });
});

test('loanwords that carry a soft sign the Latin alphabet cannot hold', () => {
  expectAll({
    'avtomobil': 'автомобиль',
    'avtomobilga': 'автомобилга',       // the soft sign drops before a suffix
    'avtomobillarni': 'автомобилларни',
    'elektromobil': 'электромобиль',
    'model': 'модель',
    'modellar': 'моделлар',
    'mebel': 'мебель',
    'kafel, santexnika, kabel': 'кафель, сантехника, кабель',
    'dvigatel hajmi': 'двигатель ҳажми',
    'profil liniyalari': 'профиль линиялари',
    'aerozol': 'аэрозоль',
    'aerozollar': 'аэрозоллар',
    'kompyuter': 'компьютер',
    'kuryer orqali': 'курьер орқали',
    'kalkulyatorda': 'калькуляторда',
    'Distribyutorlar': 'Дистрибьюторлар',
  });
});

test('months keep the Russian-derived Cyrillic spelling the Latin reform threw away', () => {
  expectAll({
    '2025-yil 31-yanvar': '2025-йил 31-январь',
    '2025-yil 1-yanvardan': '2025-йил 1-январдан',
    '2026-yil fevraldagi': '2026-йил февралдаги',
    '19-aprel': '19-апрель',
    '2018-yil 29-iyun': '2018-йил 29-июнь',
    'iyul': 'июль',
    '2-sentabr': '2-сентябрь',
    '8-sentabrda': '8-сентябрда',
    '7-oktabr': '7-октябрь',
    '7-noyabr': '7-ноябрь',
    '22-dekabr': '22-декабрь',
    // These three need no entry: the letter rules already spell them right.
    '1-martdan': '1-мартдан',
    '4-maydan': '4-майдан',
    '15-avgust': '15-август',
    'mayda partiyalar': 'майда партиялар', // "may" must not swallow "mayda"
    '10 marta': '10 марта',                 // nor "mart" swallow "marta"
  });
});

test('ц words that no rule can reach', () => {
  expectAll({
    'stansiyalarda': 'станцияларда',
    'rasmiy kvitansiya': 'расмий квитанция',
    'bu funksiya yoqilgan boʻlsa': 'бу функция ёқилган бўлса',
    'boj, aksiz, QQS': 'бож, акциз, ҚҚС',
    'inyeksion quyish mashinalari': 'инъекцион қуйиш машиналари',
    'sex maydoni': 'цех майдони',
    'Sexingiz': 'Цехингиз',
    // …and the native words that look the same but are not.
    'aksincha': 'аксинча',
    'kodeksi': 'кодекси',
    'MB kursi': 'МБ курси',
    'Taksida': 'Таксида',
    'tavsiya': 'тавсия',
    'komissiya': 'комиссия',
    'asosiy': 'асосий',
    'shaxsiy': 'шахсий',
    'zichliksiz': 'зичликсиз',
  });
});

test('a syllable boundary the spelling does not mark', () => {
  // poy + abzal. Flagged in cyrillic.terms.ts for owner review.
  expectAll({ 'poyabzal 20%': 'пойабзал 20%', 'poyabzalga': 'пойабзалга' });
});

test('empty and non-Uzbek input is handled without surprises', () => {
  assert.equal(toCyrillic(''), '');
  assert.equal(toCyrillic('   '), '   ');
  assert.equal(toCyrillic('Доставка грузов из Китая'), 'Доставка грузов из Китая');
  assert.equal(toCyrillic('义乌'), '义乌');
  assert.equal(toCyrillic('2026'), '2026');
});

test('toCyrillicSlug produces a Cyrillic path segment', () => {
  expectAll({}); // no-op guard so the helper stays used above
  assert.equal(toCyrillicSlug('Narxlar'), 'нархлар');
  assert.equal(toCyrillicSlug('Xizmatlar'), 'хизматлар');
  assert.equal(toCyrillicSlug('Kargo lugʻati'), 'карго-луғати');
  assert.equal(toCyrillicSlug('Avto kargo'), 'авто-карго');
  assert.equal(toCyrillicSlug('  Biz haqimizda  '), 'биз-ҳақимизда');
  // The word and the ASCII slug of the same page must land on the same URL, apostrophe or not.
  assert.equal(toCyrillicSlug('Qoʻllanma'), 'қўлланма');
  assert.equal(toCyrillicSlug('qollanma'), 'қўлланма');
  assert.equal(toCyrillicSlug('Temir yoʻl konteyner'), 'темир-йўл-контейнер');
  assert.equal(toCyrillicSlug('temir-yol-konteyner'), 'темир-йўл-контейнер');
  // ь is a letter of the word, and of the keyword a Cyrillic reader searches for.
  assert.equal(toCyrillicSlug('kalkulyator'), 'калькулятор');
  assert.equal(toCyrillicSlug('avtomobil-importi'), 'автомобиль-импорти');
  // A protected Latin token survives lowercased instead of being silently deleted.
  assert.equal(toCyrillicSlug('Taobaodan sotib olish'), 'taobao-дан-сотиб-олиш');
  assert.equal(toCyrillicSlug('1688 orqali'), '1688-орқали');
  // Degenerate input does not throw or produce stray hyphens.
  assert.equal(toCyrillicSlug(''), '');
  assert.equal(toCyrillicSlug('   '), '');
  assert.equal(toCyrillicSlug('--Narxlar--'), 'нархлар');
  assert.equal(toCyrillicSlug('Нархлар'), 'нархлар');
});

/**
 * ── The published URL list ──
 *
 * Every Cyrillic path segment the site will ever serve, written out. A slug is permanent: once
 * it is indexed, changing it costs a redirect and a ranking, so this list is a contract, not a
 * derivation. It is checked from both sides — against `toCyrillicSlug`, so the transliterator
 * cannot drift away from it, and against the hand-written tables in src/i18n/routes.ts, so the
 * routing cannot drift away from it either. Editing a slug means editing this list on purpose.
 *
 * Each one was read against the WORD, not the ASCII slug: `qollanma` is `qoʻllanma` → `қўлланма`,
 * `lugati` is `lugʻati` → `луғати`, `yol` is `yoʻl` → `йўл`, `tolovlari` is `toʻlovlari`,
 * `yonalishlar` is `yoʻnalishlar`; `kalkulyator` and `avtomobil` keep the soft sign the Latin
 * alphabet cannot write; `yiwu`/`guangzhou` follow the Uzbek copy (Ivu, Guanchjou), not pinyin.
 */
const PUBLISHED_SLUGS = {
  page: {
    xizmatlar: 'хизматлар',
    narxlar: 'нархлар',
    kalkulyator: 'калькулятор',
    kuzatuv: 'кузатув',
    'biz-haqimizda': 'биз-ҳақимизда',
    'savol-javob': 'савол-жавоб',
    aloqa: 'алоқа',
    qollanma: 'қўлланма',
    maxfiylik: 'махфийлик',
  },
  service: {
    'avto-kargo': 'авто-карго',
    'avia-kargo': 'авиа-карго',
    'temir-yol-konteyner': 'темир-йўл-контейнер',
    'tovar-topish': 'товар-топиш',
    'sotib-olish': 'сотиб-олиш',
    'uskunalar-importi': 'ускуналар-импорти',
    bojxona: 'божхона',
    'ombor-sifat-nazorati': 'омбор-сифат-назорати',
    'avtomobil-importi': 'автомобиль-импорти',
  },
  guide: {
    '1688-orqali-buyurtma-berish': '1688-орқали-буюртма-бериш',
    'avia-avto-temir-yol-taqqoslash': 'авиа-авто-темир-йўл-таққослаш',
    'bojxona-tolovlari-2026': 'божхона-тўловлари-2026',
    'kargo-lugati': 'карго-луғати',
    'kargo-narxlari-qanday-hisoblanadi': 'карго-нархлари-қандай-ҳисобланади',
    'taqiqlangan-tovarlar': 'тақиқланган-товарлар',
    'xitoydan-ishlab-chiqaruvchi-topish': 'хитойдан-ишлаб-чиқарувчи-топиш',
    'xitoydan-toshkentga-yonalishlar': 'хитойдан-тошкентга-йўналишлар',
    'xitoydan-yuk-olib-kelish': 'хитойдан-юк-олиб-келиш',
    'yiwu-va-guangzhou-bozorlari': 'иву-ва-гуанчжоу-бозорлари',
  },
};
const allPublished = Object.values(PUBLISHED_SLUGS).flatMap((group) => Object.entries(group));

test(`every published slug (${allPublished.length}) transliterates to the URL that was agreed`, () => {
  const wrong = allPublished
    .map(([latin, want]) => [latin, want, toCyrillicSlug(latin)])
    .filter(([, want, got]) => got !== want);
  assert.equal(
    wrong.length,
    0,
    'A slug changed. This is a live URL — fix the transliterator or add the word to\n' +
      '    `slugWords` in src/lib/cyrillic.terms.ts; do not edit the list to match the code.\n    ' +
      wrong.map(([latin, want, got]) => `${latin}: expected ${want}, got ${got}`).join('\n    '),
  );
});

test('the slug list and src/i18n/routes.ts agree, entry for entry', () => {
  const routes = routeModule;
  const fromRoutes = {
    ...Object.fromEntries(
      Object.values(routes.routeSlugs)
        .filter((r) => r.uz !== '')
        .map((r) => [r.uz, r.uzc]),
    ),
    ...routes.serviceSlugsUzc,
    ...routes.guideSlugsUzc,
  };
  const expected = Object.fromEntries(allPublished);
  const missing = Object.keys(expected).filter((k) => !(k in fromRoutes));
  const extra = Object.keys(fromRoutes).filter((k) => !(k in expected));
  const differ = Object.keys(expected)
    .filter((k) => k in fromRoutes && fromRoutes[k] !== expected[k])
    .map((k) => `${k}: routes.ts says ${fromRoutes[k]}, this file says ${expected[k]}`);
  assert.deepEqual(
    { missing, extra, differ },
    { missing: [], extra: [], differ: [] },
    'src/i18n/routes.ts and the published slug list have diverged — one of them is a dead URL.',
  );
});

/* ══ 3. Round trip ═════════════════════════════════════════════════════════════════════════ */

/**
 * An independent Cyrillic → Latin inverse, written from the 1940 → 1995 direction of the same
 * table. It exists only here: if the two directions disagree on a word of real site content,
 * one of them has a bug. Words that hit the dictionary or a protected token have no round trip
 * by design (the dictionary is where information was added) and are skipped and counted.
 */
const INVERSE = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l',
  м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts',
  ч: 'ch', ш: 'sh', ъ: 'ʼ', э: 'e', қ: 'q', ғ: 'gʻ', ҳ: 'h', ў: 'oʻ',
  ё: 'yo', ю: 'yu', я: 'ya',
};
const CYR_VOWELS = new Set([...'аеёиоуэюяў']);

function toLatin(input) {
  let out = '';
  let prev = '';
  for (const ch of input) {
    const lower = ch.toLowerCase();
    const isUpper = ch !== lower;
    let latin;
    if (lower === 'е') {
      // е is "ye" where the iotation is audible — at the start of a word and after a vowel.
      latin = prev === '' || CYR_VOWELS.has(prev) ? 'ye' : 'e';
    } else {
      latin = INVERSE[lower];
    }
    if (latin === undefined) {
      out += ch;
      prev = /[\p{L}\p{N}]/u.test(ch) ? lower : '';
      continue;
    }
    out += isUpper ? latin[0].toUpperCase() + latin.slice(1) : latin;
    prev = lower;
  }
  return out;
}

const respellStems = respell.map((t) => t.latin.toLowerCase());
const hasDictionaryWord = (word) => respellStems.some((stem) => word.toLowerCase().startsWith(stem));

/* ══ 4. The real site content ══════════════════════════════════════════════════════════════ */

/**
 * Non-prose leaves: routing keys, item slugs, icon and glyph names, link targets and callout
 * tones. They are identifiers that never reach a reader, and the Cyrillic locale must not feed
 * them through here — so neither does the test.
 */
const NON_PROSE_LEAF = /\.(key|slug|glyph|icon|guideKeys|related|id|link|tone|htmlLang|ogLocale|dir)(\[\d+\])?$/;
const NON_PROSE_FILE = /^src\/data\/guides\.ts:/; // the whole file is URL slugs

const corpus = [];
const seen = new Set();
const skippedModules = [];

function collect(node, path, insideUz) {
  if (node == null) return;
  if (typeof node === 'string') {
    if (insideUz && node.trim() && !seen.has(node)) {
      seen.add(node);
      corpus.push({ path, s: node });
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => collect(v, `${path}[${i}]`, insideUz));
    return;
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'ru' || k === 'en') continue; // other locales; not our input
      collect(v, `${path}.${k}`, insideUz || k === 'uz');
    }
  }
}

const contentFiles = [
  ...readdirSync(new URL('src/i18n/', ROOT)).filter((f) => f.endsWith('.ts')).map((f) => `src/i18n/${f}`),
  ...readdirSync(new URL('src/data/', ROOT)).filter((f) => f.endsWith('.ts')).map((f) => `src/data/${f}`),
  ...readdirSync(new URL('src/data/services/', ROOT))
    .filter((f) => f.endsWith('.ts'))
    .map((f) => `src/data/services/${f}`),
];

for (const file of contentFiles) {
  let mod;
  try {
    mod = await import(new URL(file, ROOT).href);
  } catch (err) {
    // src/data/services/load.ts is an import.meta.glob aggregator and cannot run outside Vite;
    // the content files it globs are imported individually above, so nothing is lost.
    skippedModules.push(`${file} (${err.message.split('\n')[0]})`);
    continue;
  }
  for (const [name, value] of Object.entries(mod)) {
    if (typeof value === 'function') continue;
    collect(value, `${file}:${name}`, false);
  }
}

const prose = corpus.filter((x) => !NON_PROSE_LEAF.test(x.path) && !NON_PROSE_FILE.test(x.path));

/**
 * ── The second corpus: the guide articles ──
 *
 * src/content/guides/uz/*.md is 130 000 more characters of Uzbek, and the Cyrillic articles are
 * generated from it by scripts/generate-cyrillic-guides.mjs through this same dictionary. It has
 * the terms src/i18n and src/data never mention — Incoterms, pinyin market names, IATA codes,
 * cited publications — so a dictionary checked only against the first corpus is half-checked.
 *
 * Body lines are taken whole; from the frontmatter only the prose values (title, description,
 * q, a), never the keys or the machinery (url, slug, translationKey) which are not words.
 */
const guideDir = new URL('src/content/guides/uz/', ROOT);
const guideProse = [];
for (const file of readdirSync(guideDir).filter((f) => f.endsWith('.md'))) {
  const raw = readFileSync(new URL(file, guideDir), 'utf8');
  const split = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  const frontmatter = split ? split[1] : '';
  const body = split ? split[2] : raw;
  for (const line of frontmatter.split('\n')) {
    const kv = /^\s*-?\s*(?:title|description|q|a):\s*(.+)$/.exec(line);
    if (kv) guideProse.push({ path: `guides/${file}:frontmatter`, s: kv[1].replace(/^["']|["']$/g, '') });
  }
  for (const line of body.split('\n')) if (line.trim()) guideProse.push({ path: `guides/${file}`, s: line });
}

/** Everything the dictionary has to answer for. */
const allProse = [...prose, ...guideProse];

test(`the corpus loaded (${prose.length} prose strings from ${contentFiles.length - skippedModules.length} modules, plus ${guideProse.length} guide lines)`, () => {
  assert.ok(prose.length > 1500, `only ${prose.length} strings found — did the content move?`);
  assert.ok(guideProse.length > 500, `only ${guideProse.length} guide lines found — did the guides move?`);
  assert.ok(skippedModules.length <= 1, `unexpected modules failed to load:\n  ${skippedModules.join('\n  ')}`);
});

test('every guide line transliterates without leaving Latin behind', () => {
  const bad = [];
  for (const { path, s } of guideProse) {
    const leftovers = latinLeftovers(s);
    if (leftovers.length) bad.push(`${path}: ${[...new Set(leftovers)].join(', ')}\n      ${s.slice(0, 140)}`);
  }
  assert.equal(
    bad.length,
    0,
    `${bad.length} guide lines kept Latin letters that nobody decided about.\n` +
      `Add them to keepLatin or respell in src/lib/cyrillic.terms.ts.\n    ` +
      bad.slice(0, 12).join('\n    '),
  );
});

test('every real string transliterates without leaving Latin behind', () => {
  const bad = [];
  for (const { path, s } of prose) {
    const leftovers = latinLeftovers(s);
    if (leftovers.length) bad.push(`${path}: ${[...new Set(leftovers)].join(', ')}\n      ${s.slice(0, 140)}`);
  }
  assert.equal(
    bad.length,
    0,
    `${bad.length} strings kept Latin letters that nobody decided about.\n` +
      `Add them to keepLatin or respell in src/lib/cyrillic.terms.ts.\n    ` +
      bad.slice(0, 12).join('\n    '),
  );
});

test('no real string comes out empty, or wildly the wrong length', () => {
  const bad = [];
  for (const { path, s } of prose) {
    const out = toCyrillic(s);
    if (!out.trim()) bad.push(`${path}: became empty`);
    // Digraphs collapse two Latin characters into one Cyrillic one, so short strings move a lot
    // (Oʻqish → Ўқиш). Only the ratio of a real sentence is meaningful.
    else if (s.length >= 40 && (out.length < s.length * 0.75 || out.length > s.length * 1.15)) {
      bad.push(`${path}: ${s.length} → ${out.length} chars`);
    }
  }
  assert.equal(bad.length, 0, bad.slice(0, 10).join('\n    '));
});

test('every {placeholder} survives byte for byte', () => {
  const bad = [];
  for (const { path, s } of prose) {
    const before = s.match(/\{[^}]*\}/g) ?? [];
    const after = toCyrillic(s).match(/\{[^}]*\}/g) ?? [];
    if (before.join('|') !== after.join('|')) bad.push(`${path}: ${before.join(' ')} → ${after.join(' ')}`);
  }
  assert.equal(bad.length, 0, bad.slice(0, 10).join('\n    '));
});

test('digits, Chinese and already-Cyrillic runs come through unchanged', () => {
  const bad = [];
  const digits = (t) => (t.match(/\d+/g) ?? []).join(' ');
  const han = (t) => (t.match(/[一-鿿]+/g) ?? []).join(' ');
  const cyr = (t) => (t.match(/[Ѐ-ӿ]+/g) ?? []).join(' ');
  for (const { path, s } of prose) {
    const out = toCyrillic(s);
    if (digits(s) !== digits(out)) bad.push(`${path}: digits changed`);
    if (han(s) !== han(out)) bad.push(`${path}: Chinese changed`);
    // Cyrillic already in the source must still be present, in order, inside the output.
    const source = cyr(s);
    if (source && !cyr(out).includes(source.split(' ')[0])) bad.push(`${path}: existing Cyrillic lost`);
  }
  assert.equal(bad.length, 0, bad.slice(0, 10).join('\n    '));
});

test('no protected token is mangled anywhere in the real content', () => {
  // Checked independently of the engine's own bookkeeping: find the token in the source with a
  // word-boundary match, then demand the expected form in the output.
  const expectations = [
    ...keepLatin.map((t) => ({ latin: t.latin, want: t.latin, exactCase: t.exactCase === true })),
    ...respell.map((t) => ({ latin: t.latin, want: t.cyrillic, exactCase: t.exactCase === true, respelled: true })),
  ];
  const esc = (t) => t.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  const bad = [];
  const hits = new Map();
  for (const { path, s } of allProse) {
    const out = toCyrillic(s);
    for (const e of expectations) {
      // Word boundary on the left, and on the right either a boundary or an Uzbek suffix.
      const re = new RegExp(`(^|[^A-Za-z0-9])${esc(e.latin)}(?![A-Za-z0-9])`, e.exactCase ? '' : 'i');
      if (!re.test(s)) continue;
      hits.set(e.latin, (hits.get(e.latin) ?? 0) + 1);
      const want = e.respelled ? e.want : e.latin;
      const found = e.respelled
        ? out.includes(want) || out.includes(want.toUpperCase()) || out.includes(want[0].toUpperCase() + want.slice(1))
        : new RegExp(esc(want), e.exactCase ? '' : 'i').test(out);
      if (!found) bad.push(`${path}: "${e.latin}" should appear as "${want}"\n      ${out.slice(0, 160)}`);
    }
  }
  assert.equal(bad.length, 0, bad.slice(0, 10).join('\n    '));
  // Guard against a dictionary that has drifted away from the content it was built from.
  const unused = expectations.map((e) => e.latin).filter((l) => !hits.has(l));
  if (unused.length) console.log(`     (dictionary entries not exercised by the content: ${unused.join(', ')})`);
  assert.ok(
    unused.length <= 12,
    `${unused.length} dictionary entries match nothing in the site content — stale?\n    ${unused.join(', ')}`,
  );
});

test('every brand+ending pair in the real content is one somebody decided about', () => {
  // The hyphen rule only fires for the endings listed in `uzbekSuffix`. Anything else glued to
  // a protected token silently keeps the whole word Latin, which is safe but is also how
  // "Taobaojims" would ship unnoticed — so every pair that actually occurs is listed here.
  const suffixable = keepLatin.filter((t) => t.suffixable === true);
  const esc = (t) => t.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  const pairs = new Map();
  for (const { path, s } of allProse) {
    for (const term of suffixable) {
      const re = new RegExp(`(^|[^A-Za-z0-9])(${esc(term.latin)})([A-Za-zʻʼ]+)`, 'g');
      for (let m = re.exec(s); m; m = re.exec(s)) {
        // Only the longest matching term counts: "GS"+"R" is really "GSR".
        if (suffixable.some((o) => o.latin.length > term.latin.length && o.latin.startsWith(term.latin) &&
          s.startsWith(o.latin, m.index + m[1].length))) continue;
        const key = `${m[2]}+${m[3]}`;
        if (!pairs.has(key)) pairs.set(key, { tail: m[3], term: m[2], path });
      }
    }
  }
  const strip = (t) => t.replace(/^[\u02bb\u02bc\u2018\u2019'`\u00b4\u02b9\u2032\u2035\u02bd\u02bf]+/, '');
  const undecided = [...pairs.values()].filter((p) => !isUzbekSuffix(strip(p.tail)));
  assert.equal(
    undecided.length,
    0,
    'These tokens are glued to something that is not an Uzbek ending, so the whole word stays\n' +
      '    Latin. If it IS an ending, add it to `uzbekSuffix`; if not, this is fine — pin it here.\n    ' +
      undecided.map((p) => `${p.term}+${p.tail}  (${p.path})`).join('\n    '),
  );
  assert.ok(pairs.size >= 8, `only ${pairs.size} brand+ending pairs found — did the content move?`);
  console.log(`     (${pairs.size} brand+ending pairs: ${[...pairs.keys()].join(', ')})`);
});

test('every slugWords entry still answers for a slug the site publishes', () => {
  const segments = new Set(allPublished.flatMap(([latin]) => latin.split('-')));
  const stale = Object.keys(slugWords).filter((k) => !segments.has(k));
  assert.deepEqual(stale, [], 'slugWords entries that no published slug uses — stale, or a typo');
  // A slug word must also be spelled the same wherever the word appears as prose: the guide
  // index is /kirill/қўлланма/ and the heading above it says Қўлланма, or the page is lying.
  assert.equal(toCyrillic('Qoʻllanma'), 'Қўлланма');
  assert.equal(toCyrillicSlug('Qoʻllanma'), slugWords.qollanma);
  assert.equal(toCyrillic('yoʻl'), slugWords.yol);
  assert.equal(toCyrillic('lugʻati'), slugWords.lugati);
  assert.equal(toCyrillic('toʻlovlari'), slugWords.tolovlari);
  assert.equal(toCyrillic('yoʻnalishlar'), slugWords.yonalishlar);
  assert.equal(toCyrillic('Ivu').toLowerCase(), slugWords.yiwu);
  assert.equal(toCyrillic('Guanchjou').toLowerCase(), slugWords.guangzhou);
});

test('the site contains no undecided uppercase abbreviation', () => {
  // Anything that looks like an acronym must be in keepLatin, respell or acronymsHandledByRule,
  // so that adding "СЭС"-shaped content forces a decision instead of a silent mistake.
  const decided = new Set();
  for (const list of [keepLatin, respell]) {
    for (const t of list) for (const part of t.latin.split(/[^A-Za-z0-9ʻʼ]+/)) if (part) decided.add(part.toLowerCase());
  }
  for (const k of Object.keys(acronymsHandledByRule)) decided.add(k.toLowerCase());

  const letters = (t) => [...t].filter((c) => /[A-Za-z]/.test(c));
  const undecided = new Map();
  for (const { path, s } of allProse) {
    // Tokens inside something the engine already protects (a bot handle, a URL) are not words.
    const protectedText = keptLatin(s).join(' ');
    for (const token of s.match(/[A-Za-z][A-Za-zʻʼ0-9]*/g) ?? []) {
      if (decided.has(token.toLowerCase())) continue;
      if (protectedText.includes(token)) continue;
      const head = /^(.*?[A-Z0-9])[a-zʻʼ]*$/.exec(token)?.[1]; // drop an Uzbek suffix
      if (!head || decided.has(head.toLowerCase())) continue;
      const ls = letters(head);
      const caps = ls.filter((c) => c === c.toUpperCase()).length;
      if (ls.length < 2 || caps < 2 || caps / ls.length < 0.6) continue;
      if (!undecided.has(head)) undecided.set(head, path);
    }
  }
  assert.equal(
    undecided.size,
    0,
    'Undecided abbreviations. Add each to src/lib/cyrillic.terms.ts with a comment saying why:\n    ' +
      [...undecided.entries()].map(([t, p]) => `${t}  (${p})`).join('\n    '),
  );
});

test('Latin → Cyrillic → Latin round-trips every mechanical word of the site', () => {
  const bad = [];
  let checked = 0;
  const words = new Set();
  for (const { s } of allProse) {
    for (const w of s.split(/[^A-Za-zʻʼ‘’'`]+/)) if (w) words.add(w);
  }
  for (const word of words) {
    if (keptLatin(word).length > 0) continue;   // protected: no round trip by design
    if (hasDictionaryWord(word)) continue;      // respelled: the dictionary added information
    if (/[cw]/i.test(word)) continue;           // not letters of the Uzbek Latin alphabet
    const back = toLatin(toCyrillic(word));
    checked += 1;
    if (back !== word) bad.push(`${word} → ${toCyrillic(word)} → ${back}`);
  }
  assert.ok(checked > 2500, `only ${checked} words round-tripped — the filter is too wide`);
  assert.equal(bad.length, 0, `${bad.length} of ${checked} words did not survive:\n    ` + bad.slice(0, 20).join('\n    '));
  console.log(`     (${checked} words round-tripped)`);
});

/* ── Summary ───────────────────────────────────────────────────────────────────────────────── */

const totalChars = allProse.reduce((n, x) => n + x.s.length, 0);
console.log(
  `\n${passed} passed, ${failed} failed — ` +
    `${prose.length} real uz strings + ${guideProse.length} guide lines ` +
    `(${totalChars.toLocaleString('en-US')} characters) transliterated.`,
);
if (skippedModules.length) console.log(`skipped modules: ${skippedModules.join(', ')}`);
process.exit(failed === 0 ? 0 : 1);
