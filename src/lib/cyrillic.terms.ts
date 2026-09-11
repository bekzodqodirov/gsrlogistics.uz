/**
 * The dictionary half of the Uzbek Latin → Cyrillic transliterator.
 *
 * Everything here is a DECISION, not a rule. The engine in `./cyrillic.ts` is mechanical;
 * this file lists the words the mechanics would get wrong, and says why for each one.
 *
 * Every entry below was found by grepping the real site content — the `uz` values in
 * `src/i18n/*.ts` and `src/data/**` — not invented. `scripts/test-cyrillic.mjs` re-derives
 * that corpus on every run and FAILS if it finds an uppercase abbreviation that nobody has
 * decided about yet, so new content cannot quietly ship a wrong acronym.
 *
 * Four buckets:
 *   1. `protectedPatterns` — shapes (URLs, placeholders, handles) that are never words.
 *   2. `keepLatin`         — tokens that stay in the Latin alphabet inside Cyrillic prose.
 *   3. `respell`           — tokens that have their OWN Cyrillic form, not a transliterated one.
 *   4. `slugWords`         — URL slug segments whose word the ASCII slug no longer spells.
 */

/** A token that must survive untouched inside Cyrillic text. */
export interface KeepLatin {
  /**
   * Literal source text. May contain spaces, dots, slashes and hyphens.
   * Longer entries win, so `GSR Logistics` is matched before `GSR`.
   */
  latin: string;
  /**
   * Allow an Uzbek case/possessive suffix glued straight onto it: `Telegramda`, `Taobaodan`,
   * `MOQni`. See `uzbekSuffix` below for what happens to the suffix.
   */
  suffixable?: boolean;
  /** Match the source's capitalisation exactly. For tokens that are ordinary words elsewhere. */
  exactCase?: boolean;
}

/**
 * ── A Latin brand with an Uzbek ending: `Taobao-дан`, not `Taobaodan` and not `Таобаодан` ──
 *
 * THE RULE: the name keeps its Latin spelling, the ending is written in Cyrillic, and a hyphen
 * marks the seam. It is the ordinary Cyrillic convention for declining a Latin-script name (the
 * site already writes `1688-da`), it keeps the trademark searchable and the grammar readable,
 * and the hyphen stops the reader taking the ending for part of the name.
 *
 * The alternatives both fail: `Taobaodan сотиб олиш` leaves a whole Latin word, ending and all,
 * in the middle of a Cyrillic sentence — the defect this rule fixes; and `Таобаодан` throws away
 * the name the customer has to type into a search box, into 1688 and onto a payment.
 *
 * Only these endings trigger it. A token that is glued to something else — `Clickable`, an
 * English compound, a model number — keeps the old behaviour and stays wholly Latin, because
 * transliterating an unknown tail is how `Таобаожимс` gets shipped. `scripts/test-cyrillic.mjs`
 * lists every brand+tail pair in the real content, so a tail nobody has decided about shows up.
 *
 * Morpheme order: plural, then possessive, then case. Lowercase only — `TELEGRAMDA` is not a
 * suffix, it is somebody shouting, and it stays Latin.
 */
export const uzbekSuffix =
  /^(?:lar)?(?:im|ing|ingiz|imiz|lari|si|i)?(?:ning|ni|nga|ga|ka|qa|dan|tan|dagidan|dagi|da|ta|gacha|siz|lik|li|chi|day|dek|cha)?$/;

/** True when `tail`, glued onto a protected token, is an Uzbek ending and not another word. */
export const isUzbekSuffix = (tail: string): boolean =>
  tail.length > 0 && tail === tail.toLowerCase() && uzbekSuffix.test(tail);

/** A token whose Cyrillic spelling is not what letter-by-letter transliteration produces. */
export interface Respell {
  /** Latin source, matched case-insensitively at a word boundary. */
  latin: string;
  /** Cyrillic form when the word ends here. */
  cyrillic: string;
  /**
   * Cyrillic stem to use when an Uzbek suffix follows. Uzbek drops the soft sign before a
   * suffix: `автомобиль` but `автомобилга`. Omit when the two are identical.
   */
  stem?: string;
  /** Match capitalisation exactly. Set on short acronyms that collide with real Uzbek words. */
  exactCase?: boolean;
}

/* ------------------------------------------------------------------------------------------ */
/* 1. Shapes that are never Uzbek words.                                                        */
/* ------------------------------------------------------------------------------------------ */

/**
 * Tried first, anchored at the current position. The matched run is copied out verbatim.
 * Order matters: the first match wins, so longer/more specific shapes come first.
 */
export const protectedPatterns: Array<{ name: string; re: RegExp }> = [
  // `{count}`, `{truckDays}` — i18n placeholders. `tpl()`/`fill()` substitute these by exact
  // string match after transliteration, so a single mangled letter breaks the page silently.
  { name: 'placeholder', re: /^\{[A-Za-z0-9_.-]+\}/ },

  // Full URLs.
  { name: 'url', re: /^(?:https?:\/\/|www\.)[^\s<>«»"']+/i },

  // E-mail addresses.
  { name: 'email', re: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/ },

  // `@GSR_GROUP_AGENT_bot` — the Telegram bot handle, typed verbatim by the visitor.
  { name: 'handle', re: /^@[A-Za-z0-9_]{3,}/ },

  // Bare domains and document paths in prose: `1688.com`, `my.gov.uz`, `lex.uz/docs/3802366`.
  // A closed TLD list keeps `sentence.Next` from being swallowed.
  {
    name: 'domain',
    re: /^[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9-]+)*\.(?:uz|com|net|org|ru|cn|io|co|info|biz|gov|edu|dev|app)\b(?:\/[^\s,;)»"]*)?/i,
  },

  // Coordinates: `41.32° N`, `69.25° E`. N/E are compass letters, not Uzbek words.
  { name: 'coordinate', re: /^\d+(?:[.,]\d+)?\s*°\s*[NSEW]\b/ },

  // A number followed by a unit symbol: `380 V`, `50 Hz`, `40 HC`, `20 ft`, `0,1 m³`.
  // Single-letter units are only safe in this shape — bare `V` is rare, bare `U` is the Uzbek
  // pronoun "u" at the start of a sentence.
  // The units with a Cyrillic form in this market's writing are deliberately absent — `kg`,
  // `km`, `m³`, `t`, `sm`, `kVt`. Protecting them here would shield them from that form, which
  // is what `uzbekUnits` exists to give them. `mm`, `m²` and the electrical symbols stay.
  {
    name: 'number+unit',
    re: /^\d+(?:[.,   ]\d{3})*(?:[.,]\d+)?\s*(?:kWh|kW|Hz|ft|mm|m²|MB|GB|HC|V|W|A)\b/,
  },

  // Phone numbers and the `+998 XX XXX XX XX` mask.
  { name: 'phone', re: /^\+\d[\d\s  X()-]{6,}\d/ },

  // UN dangerous-goods numbers: `UN3480`, `UN3481`, `UN2807`. Printed on the box and on the
  // air waybill in Latin; "УН3480" would match nothing a handler or an inspector looks for.
  { name: 'un-number', re: /^UN\d{4}\b/ },

  // Anything with an underscore is an identifier, not prose: `uz_UZ`, `air-per-kg` stays a word.
  { name: 'identifier', re: /^[A-Za-z][A-Za-z0-9]*_[A-Za-z0-9_]+/ },

  // File names.
  { name: 'filename', re: /^[A-Za-z0-9_-]+\.(?:png|jpe?g|svg|webp|avif|pdf|json|csv|zip)\b/i },
];

/* ------------------------------------------------------------------------------------------ */
/* 2. Tokens that stay Latin.                                                                   */
/* ------------------------------------------------------------------------------------------ */

const brands: KeepLatin[] = [
  // Company and product names that are Latin in every language, including the owner's own.
  // `suffixable` because Uzbek glues its cases on: Telegram-да, Telegram-га, Taobao-дан.
  { latin: 'GSR Logistics', suffixable: true }, // the guides use the possessive: GSR Logistics-нинг
  { latin: 'GSR', suffixable: true },
  { latin: 'Telegram', suffixable: true },
  { latin: 'WhatsApp', suffixable: true },
  { latin: 'Instagram', suffixable: true },
  { latin: 'Facebook', suffixable: true },
  { latin: 'WeChat Pay' },
  { latin: 'WeChat', suffixable: true },
  { latin: 'Alipay', suffixable: true },
  { latin: 'Taobao', suffixable: true },
  { latin: 'Alibaba', suffixable: true },
  { latin: 'Pinduoduo', suffixable: true },
  { latin: 'Tmall', suffixable: true },
  { latin: '1688', suffixable: true }, // the copy writes `1688-da`; `1688da` would also work
  { latin: 'Google Translate' },
  { latin: 'Google Sheets' },
  { latin: 'Google Maps' },
  { latin: 'Google', suffixable: true },
  { latin: 'Yandex Market' },
  { latin: 'Yandex', suffixable: true },
  { latin: 'GitHub Pages' },
  { latin: 'GitHub', suffixable: true },
  { latin: 'JavaScript', suffixable: true },
  { latin: 'Astro', suffixable: true },
  { latin: 'Android', suffixable: true },
  { latin: 'Chrome', suffixable: true },
  { latin: 'iOS', exactCase: true },
  { latin: 'Wi-Fi' }, // written Wi-Fi in Uzbek Cyrillic too
  { latin: 'Visa', exactCase: true }, // the card scheme, in the 1688 payment table

  // Trademarks the guides name as counterfeit risks. Transliterating a trademark is the one
  // thing you must not do to it — the reader is being told to recognise the real logo.
  { latin: 'Apple', suffixable: true },
  { latin: 'Nike', suffixable: true },
  { latin: 'Disney', suffixable: true },
  { latin: 'Zara', exactCase: true },

  // Uzbek payment and marketplace brands. Their own logos and apps are Latin-only.
  // `Uzum` especially: transliterated it collides with "узум", the Uzbek word for grape.
  { latin: 'Uzum', suffixable: true },
  { latin: 'Uzcard', suffixable: true },
  { latin: 'Humo', suffixable: true },
  { latin: 'Payme', suffixable: true },
  { latin: 'Click', suffixable: true },

  // Car makes and models the site quotes. Written Latin on the car and in every Uzbek price list.
  { latin: 'Li Auto' },
  { latin: 'Lixiang', suffixable: true },
  { latin: 'Leapmotor', suffixable: true },
  { latin: 'Zeekr', suffixable: true },
  { latin: 'Xiaomi', suffixable: true },
  { latin: 'Geely', suffixable: true },
  { latin: 'Chery', suffixable: true },
  { latin: 'Changan', suffixable: true },
  { latin: 'Haval', suffixable: true },
  { latin: 'BYD', suffixable: true },
  // Model names. `exactCase` because these are ordinary English words; only the capitalised
  // form inside the BYD/Zeekr/Leapmotor list is a model.
  // BYD's hybrid drivetrain. The hyphen belongs to the trademark, so the `-i` is NOT an Uzbek
  // possessive: without this entry `DM` is kept by the acronym rule and the tail is read as the
  // word "i", giving `BYD DM-и` — a model name no search box and no dealer would match. Listed
  // before the shorter tokens so it wins, and not `suffixable`: nothing may be glued to it.
  { latin: 'DM-i' },
  { latin: 'Song', exactCase: true },
  { latin: 'Seal', exactCase: true },
  { latin: 'Tang', exactCase: true },
  { latin: 'Han', exactCase: true },
  { latin: 'L6' }, { latin: 'L7' }, { latin: 'L9' },
  { latin: 'C10' }, { latin: 'C11' }, { latin: 'C16' },
  { latin: '7X' },
];

const codes: KeepLatin[] = [
  // The cargo mark. "GS" is what is physically written on the cartons in China; a Cyrillic
  // "ГС" on the website and a Latin "GS" on the box is how a pallet goes missing.
  { latin: 'GS', suffixable: true },

  // Incoterms, shipping and container codes. International, always Latin, and what the
  // freight forwarder writes on the paperwork.
  { latin: 'LCL' }, { latin: 'FCL' },
  { latin: '20ft' }, { latin: '40ft' },
  { latin: 'HC', exactCase: true }, // high cube container
  { latin: 'FOB' }, { latin: 'EXW' }, { latin: 'CIF' },
  { latin: 'Incoterms', suffixable: true }, // the standard itself; its codes are above
  { latin: 'ICC' },  // International Chamber of Commerce, which publishes Incoterms
  { latin: 'CMR' },  // road consignment note
  { latin: 'SMGS' }, // rail consignment note
  { latin: 'AWB' },  // air waybill
  { latin: 'MFN' },  // most-favoured-nation tariff
  { latin: 'IATA' }, // the airline body whose dangerous-goods rules the air pages cite
  { latin: 'DGR' },  // IATA Dangerous Goods Regulations, cited by name
  { latin: 'CNY' },  // ISO 4217 code for the yuan
  { latin: 'AK', exactCase: true }, // `AK-123` — the consignment number written on the paperwork
  { latin: 'PI', exactCase: true }, // proforma invoice, the abbreviation the factory uses

  // Documents and systems whose names are issued in Latin.
  { latin: 'E-Contract' }, // the Uzbek foreign-trade contract registry, branded in Latin
  { latin: 'EEISVO', suffixable: true }, // its Uzbek acronym, used alongside E-Contract
  { latin: 'PINFL' },      // printed in Latin on the Uzbek ID card
  { latin: 'VIN', exactCase: true },
  { latin: 'QR', suffixable: true },
  { latin: 'E-mail' },

  // Technical.
  // `exactCase` on the short ones: "sim" is the Uzbek word for wire, and two-letter codes are
  // too easy to hit by accident.
  { latin: 'GB/T' }, { latin: 'CCS2' }, // EV charge ports
  { latin: 'CNC' }, { latin: 'FAT' }, { latin: 'PSI' },
  { latin: 'LED' }, { latin: 'ISO' }, { latin: 'CE', exactCase: true }, { latin: 'SIM', exactCase: true },
  { latin: 'BEV' }, { latin: 'PHEV' }, { latin: 'EREV' }, { latin: 'DM', exactCase: true },
  { latin: 'IP', exactCase: true }, { latin: 'HTTPS' }, { latin: 'USD' },
  { latin: 'Telegram FZ-LLC' }, { latin: 'LLC' }, { latin: 'FZ', exactCase: true },
  { latin: 'MOQ', suffixable: true }, // minimum order quantity — the trade term buyers search for
  { latin: 'GPS' },  // written GPS in Uzbek Cyrillic; ГПС is nobody's spelling
  { latin: 'IMEI' }, { latin: 'UzIMEI', suffixable: true }, // the phone registry, branded in Latin
  { latin: 'B2B' },
  { latin: 'SGS' }, { latin: 'TÜV' }, { latin: 'Intertek' }, // the inspection firms, by name

  // Phone-number mask. Not words.
  { latin: 'XXX' }, { latin: 'XX' },
];

/**
 * Place names the guides print in raw pinyin, with the hanzi beside them.
 *
 * THE RULE: a Chinese name the Uzbek copy has already ADAPTED — Ivu, Guanchjou, Shenchjen,
 * Xanchjou, Lanchjou, Foshan, Urumchi — is Uzbek spelling and transliterates correctly, so it
 * gets no entry. A name still in pinyin does not: pinyin `q`, `x`, `zh`, `h`, `c` and `w` are
 * not the Uzbek letters they look like, so the engine turns 华强北 into `Ҳуақиангбеи` and 柯桥
 * into `Кеқиао` — spellings that exist nowhere and that no reader, map or taxi driver knows.
 * They stay Latin, exactly as the guides already keep Lecong and Wanling, and the hanzi printed
 * in the same sentence carries the pronunciation.
 */
const pinyinPlaces: KeepLatin[] = [
  { latin: 'Huaqiang Electronics World' },
  { latin: 'Huaqiangbei', suffixable: true },
  { latin: 'Huaqiang', suffixable: true },
  { latin: 'Huangyuan', suffixable: true },  // h — Хуанъюань, never Ҳуангюан
  { latin: 'Guihuagang', suffixable: true },
  { latin: 'Haizhu', suffixable: true },
  { latin: 'Pazhou', suffixable: true },
  { latin: 'Zhongshan', suffixable: true },
  { latin: 'Zhongda', suffixable: true },
  { latin: 'Zhanxi', suffixable: true },
  { latin: 'Guzhen', suffixable: true },
  { latin: 'Shaoxing', suffixable: true },
  { latin: 'Xingfa', suffixable: true },
  { latin: 'Shisanhang', suffixable: true },
  { latin: 'Shahe', suffixable: true },
  { latin: 'Nanhai', suffixable: true },
  { latin: 'Tianhe', suffixable: true },
  { latin: 'Keqiao', suffixable: true },
  { latin: 'Lecong', suffixable: true },
  { latin: 'Wanling', suffixable: true },
  { latin: 'Yuanwang', suffixable: true },
  { latin: 'Yiwugo', suffixable: true },     // 义乌购, the market's own platform
  // These leaked through until a read of the rendered markets guide caught them: every letter
  // in them is also an Uzbek letter, so nothing in the spelling stopped the rules, and they
  // came out as Баиюн, Баима, Санюанли, Гуангюан, Чанченг, Шунде, Йиде, Гангдинг, Мингтонг.
  // That split one sentence across two alphabets — "Чанченг ва Nanhai туманларида" names two
  // neighbouring Foshan districts, and "Tianhe туманидаги Гангдинг ... ва Дашатоу" two markets
  // in one district. They are raw pinyin like the rest of this list, so they stay Latin: the
  // rules cannot produce the -нь and -э a Cyrillic reader expects (Байюн, Саньюаньли, Шуньдэ).
  { latin: 'Baiyun', suffixable: true },
  { latin: 'Baima', suffixable: true },
  { latin: 'Sanyuanli', suffixable: true },
  { latin: 'Guangyuan', suffixable: true },
  { latin: 'Chancheng', suffixable: true },
  { latin: 'Shunde', suffixable: true },
  { latin: 'Dashatou', suffixable: true },
  { latin: 'Gangding', suffixable: true },
  { latin: 'Mingtong', suffixable: true },
  { latin: 'Yide', suffixable: true },
  { latin: 'Plaza', exactCase: true },       // SEG Plaza, Xingfa Plaza, Wanling Plaza
  { latin: 'SEG' },
  { latin: 'Canton Fair' },

  // Kazakh and international spellings the copy prints in brackets beside the Uzbek name —
  // `Xorgos (Khorgos)`, `Doʻstiq (Dostyk)`. The bracket exists to give the OTHER spelling;
  // transliterating it back produces `Кҳоргос` and destroys the only thing it was there for.
  { latin: 'Khorgos' }, { latin: 'Dostyk' }, { latin: 'Altynkol' },
];

/**
 * Publications and companies the guides cite as sources. A reader who wants to check a figure
 * has to be able to search the name, so it stays in the alphabet the source publishes in.
 */
const sources: KeepLatin[] = [
  { latin: 'RZD-Partner' },
  { latin: 'Ritm Eurasia' },
  { latin: 'PwC Tax Summaries' }, { latin: 'PwC' },
  { latin: 'MK Express' },
  { latin: 'Cargorating', suffixable: true },
  { latin: 'iCargo', suffixable: true },
  { latin: 'Transasia' },
  { latin: 'Logistan' },
  { latin: 'Gratanet' },
  { latin: 'Sputnik', exactCase: true }, // the news agency; lowercase "sputnik" is a satellite
  { latin: 'AGL' },
];

const units: KeepLatin[] = [
  // Symbols with no Cyrillic form in this market's writing. `ft` is the container's foot, `Hz`
  // the frequency on an equipment label, `mm` a tolerance — all three are read off a foreign
  // spec sheet and are written Latin in Russian copy too.
  { latin: 'm²' }, { latin: 'mm' }, { latin: 'ft' }, { latin: 'Hz' },
  // `kg`, `km`, `m³`, `t`, `sm` and `kVt` are NOT here. They looked like international symbols,
  // but the site itself settles it: the Russian pages of this same site print кг 496 times, м³
  // 570, км 35 and см 117, with a single Latin stray each. Leaving them Latin on the Cyrillic
  // pages put two Cyrillic-script locales of one site in disagreement, printed the calculator's
  // own line as "баландлик (м) ёки сиз киритган m³" — bare metre Cyrillic, cubic metre Latin,
  // one clause apart — and quoted a Cabinet decree as "камида 3 $/kg" where lex.uz publishes
  // "кг". It also cost the locale its reason for existing: a Cyrillic searcher types "1 кг
  // нархи" and the /kirill/ pages contained "кг" zero times. See `uzbekUnits`.
];

const englishGlosses: KeepLatin[] = [
  // English expansions the copy puts in brackets after an abbreviation, plus loan phrases that
  // are quoted in English on purpose. Transliterating these produces nonsense ("Фулл Контаинер").
  { latin: 'Full Container Load' },
  { latin: 'Less than Container Load' },
  { latin: 'minimum order quantity' },
  { latin: 'packing list' },
  { latin: 'Trade Assurance' },
  { latin: 'Verified Supplier' }, // the Alibaba badge, read off the screen in English
  { latin: 'Lithium Batteries' }, // the title of the IATA document, cited as a source
  { latin: 'power bank' },
  { latin: 'flat rack' },
  { latin: 'demurrage' }, // the container demurrage charge, quoted in English in the rail copy
  { latin: 'cookie' }, // "cookie-banner" — the web term, Latin in Uzbek and Russian alike
  { latin: 'Inc' },
];

export const keepLatin: KeepLatin[] = [
  ...brands,
  ...codes,
  ...pinyinPlaces,
  ...sources,
  ...units,
  ...englishGlosses,
];

/* ------------------------------------------------------------------------------------------ */
/* 3. Tokens with their own Cyrillic form.                                                      */
/* ------------------------------------------------------------------------------------------ */

// All matched case-sensitively: these are written in capitals, and lowercase look-alikes
// ("pq", "mb", "ses") must not be rewritten if they ever turn up inside a word.
const abbreviations: Respell[] = [
  // Uzbek and Soviet-era abbreviations. A Cyrillic reader has never seen these in Latin, and
  // these are exactly the words a Cyrillic search query is built from.
  { latin: 'QQS', cyrillic: 'ҚҚС', exactCase: true },       // qoʻshilgan qiymat soligʻi — VAT
  { latin: 'GTD', cyrillic: 'ГТД', exactCase: true },       // customs declaration, Russian ГТД
  { latin: 'TN VED', cyrillic: 'ТН ВЭД', exactCase: true }, // tariff nomenclature; own Cyrillic form
  { latin: 'AQSH', cyrillic: 'АҚШ', exactCase: true },      // the USA
  { latin: 'BRV', cyrillic: 'БРВ', exactCase: true },       // bazaviy hisoblash miqdori
  { latin: 'VMQ', cyrillic: 'ВМҚ', exactCase: true },       // Vazirlar Mahkamasi qarori
  { latin: 'PQ', cyrillic: 'ПҚ', exactCase: true },         // Prezident qarori
  { latin: 'PF', cyrillic: 'ПФ', exactCase: true },         // Prezident farmoni
  { latin: 'SES', cyrillic: 'СЭС', exactCase: true },       // sanitary-epidemiological service.
  //   Letter-by-letter gives СЕС: inside an acronym the letter E is named Э, not Е.
  { latin: 'MB', cyrillic: 'МБ', exactCase: true },         // Markaziy bank — the CB exchange rate
  { latin: 'PVZ', cyrillic: 'ПВЗ', exactCase: true },       // пункт выдачи заказов — the pickup point
];

const months: Respell[] = [
  // Uzbek Cyrillic took the month names straight from Russian, soft signs and all; the 1995
  // Latin alphabet respelled them. Dates appear on nearly every page of this site.
  // The soft sign is dropped before a suffix: январь, but январдан.
  { latin: 'yanvar', cyrillic: 'январь', stem: 'январ' },
  { latin: 'fevral', cyrillic: 'февраль', stem: 'феврал' },
  { latin: 'aprel', cyrillic: 'апрель', stem: 'апрел' },
  { latin: 'iyun', cyrillic: 'июнь', stem: 'июн' },
  { latin: 'iyul', cyrillic: 'июль', stem: 'июл' },
  { latin: 'sentabr', cyrillic: 'сентябрь', stem: 'сентябр' }, // note та → тя as well as the ь
  { latin: 'oktabr', cyrillic: 'октябрь', stem: 'октябр' },
  { latin: 'noyabr', cyrillic: 'ноябрь', stem: 'ноябр' },
  { latin: 'dekabr', cyrillic: 'декабрь', stem: 'декабр' },
  // mart, may and avgust need no entry: the letter rules already produce март, май, август.
];

const softSignLoanwords: Respell[] = [
  // The 1995 Latin alphabet has no soft sign, so it cannot be recovered by rule. These are the
  // words on this site whose Uzbek Cyrillic spelling carries one. `stem` drops it before a suffix.
  //
  // Found by sweeping every word of the site (3 730 in src/i18n + src/data, 1 768 more in the
  // guides) for the two shapes a ь can hide in: a Russian loan ending in -l, and the softened
  // consonant the Latin writes as a bare y — kalkulyator, kompyuter, kuryer, distribyutor.
  // The near-misses were checked too and take NO soft sign: akkumulyator → аккумулятор,
  // byudjet → бюджет, samolyot → самолёт, kapital, material, universal, normal, metall.
  { latin: 'avtomobil', cyrillic: 'автомобиль', stem: 'автомобил' },
  { latin: 'elektromobil', cyrillic: 'электромобиль', stem: 'электромобил' },
  { latin: 'model', cyrillic: 'модель', stem: 'модел' },
  { latin: 'mebel', cyrillic: 'мебель', stem: 'мебел' },
  { latin: 'kabel', cyrillic: 'кабель', stem: 'кабел' },
  { latin: 'kafel', cyrillic: 'кафель', stem: 'кафел' },
  { latin: 'profil', cyrillic: 'профиль', stem: 'профил' },
  { latin: 'dvigatel', cyrillic: 'двигатель', stem: 'двигател' },
  { latin: 'aerozol', cyrillic: 'аэрозоль', stem: 'аэрозол' },
  { latin: 'kompyuter', cyrillic: 'компьютер' },
  { latin: 'kuryer', cyrillic: 'курьер' },
  { latin: 'kalkulyator', cyrillic: 'калькулятор' },
  { latin: 'distribyutor', cyrillic: 'дистрибьютор' },
  { latin: 'kalendar', cyrillic: 'календарь', stem: 'календар' }, // "kalendar oyiga" — календарь ой
  { latin: 'alkogol', cyrillic: 'алкоголь', stem: 'алкогол' },
  { latin: 'filtr', cyrillic: 'фильтр' },  // "Filtrlarni qoʻying" → фильтрларни
];

const xNotH: Respell[] = [
  // Uzbek keeps ҳ and х apart, and the Latin keeps them apart too — h/x. But a Russian loan
  // written with h in the Latin copy is still the Russian [x]: хостинг, not ҳостинг. Only
  // loanwords qualify; every native h on this site (ҳужжат, шаҳар, ҳисоб) is a genuine ҳ.
  { latin: 'hosting', cyrillic: 'хостинг' },
];

const tseLoanwords: Respell[] = [
  // Cyrillic ц became Latin "s" after a consonant and "ts" between vowels. The engine handles
  // the productive -tsiya ending by rule; these are the ones where ц follows a consonant, and
  // no rule can tell them from native words (aksincha, kursi, taksi, kodeksi all keep с).
  { latin: 'stansiya', cyrillic: 'станция' },
  { latin: 'kvitansiya', cyrillic: 'квитанция' },
  { latin: 'funksiya', cyrillic: 'функция' },
  { latin: 'aksiz', cyrillic: 'акциз' },
  { latin: 'inyeksion', cyrillic: 'инъекцион' }, // also recovers the hard sign: инъекция
  // Same trap without the ц: Russian ъ before е is written as a bare y in the Latin, so the
  // rules give "обект". The word is объект — "intellektual mulk obyektlari" → объектлари.
  { latin: 'obyekt', cyrillic: 'объект' },
  // Word-initial ц became a bare "s". Only one such word is on the site, and context settles it:
  // "sex maydoni", "sex videosi" — a factory workshop, цех, never the English word.
  { latin: 'sex', cyrillic: 'цех' },
  // Same shape, found by reading the rendered pages: the Latin spells these with a bare "s"
  // where the other five spell it "ts", so the rule leaves с and the page prints провинсия,
  // коллексия, аксия, инспексия, канселярия. The site's own Russian copy writes every one of
  // them with ц — провинции, коллекция, акции, инспекция, канцелярия — so this is the house
  // spelling, not a preference. None of them is a prefix of a native word.
  { latin: 'provinsiya', cyrillic: 'провинция' },
  { latin: 'kolleksiya', cyrillic: 'коллекция' },
  { latin: 'inspeksiya', cyrillic: 'инспекция' },
  { latin: 'kanselyariya', cyrillic: 'канцелярия' },
  { latin: 'aksiya', cyrillic: 'акция' }, // "aksincha", "aksi" are native and keep с — not matched
];

const uzbekUnits: Respell[] = [
  // The abbreviation that is spelled per language, not the symbol that is the same everywhere.
  // `kg`, `km`, `m³` are international symbols and stay Latin on every locale; `sm` and `kVt`
  // are not — they are how Uzbek LATIN shortens santimetr and kilovatt. The proof is the site
  // itself: src/i18n/pricing.ts gives the unit three spellings, uz `sm`, en `cm`, ru `см`, so
  // the copy already localises this one. Leaving it Latin printed the Cyrillic line
  // "50 × 40 × 30 sm ли қути — 60 000 sm³" beside the Russian "50 × 40 × 30 см — 60 000 см³".
  // Safe against look-alikes: `SMGS` is matched by keepLatin first, and `smart`/`smartfon`
  // reach the same Cyrillic through this entry as they did through the letter rules.
  { latin: 'sm', cyrillic: 'см' },
  { latin: 'kVt', cyrillic: 'кВт', exactCase: true },
  // The four that were in `units` until the Russian branch of this same site was counted.
  { latin: 'kg', cyrillic: 'кг' },
  { latin: 'km', cyrillic: 'км' },
  { latin: 'm³', cyrillic: 'м³' },
  // Tonnes. Every occurrence in the content is a capacity after a digit — "20 t", "26 t", "2 t"
  // — and the word is tonna in both scripts, so the letter is т. Lower-case only: `T` alone is
  // not a unit anywhere in this content.
  { latin: 't', cyrillic: 'т', exactCase: true },
];

const compounds: Respell[] = [
  // poy + abzal. The Latin "ya" here is a syllable boundary (й + а), not the single letter я,
  // and nothing in the spelling says so. FLAGGED FOR OWNER REVIEW: if the house style is
  // "поябзал", change this one line.
  { latin: 'poyabzal', cyrillic: 'пойабзал' },
  // Sary + agash, the Kazakh border station. Same trap as poyabzal: the Latin "ya" is a
  // boundary, not я, so the rules give "Сарягаш" — three syllables where the name has four.
  // FLAGGED FOR OWNER REVIEW: Uzbek maps also print Сариоғоч.
  { latin: 'saryagash', cyrillic: 'сариагаш' },
];

export const respell: Respell[] = [
  ...abbreviations,
  ...months,
  ...softSignLoanwords,
  ...xNotH,
  ...tseLoanwords,
  ...uzbekUnits,
  ...compounds,
];

/* ------------------------------------------------------------------------------------------ */
/* 4. Slug segments whose word the ASCII slug no longer spells.                                 */
/* ------------------------------------------------------------------------------------------ */

/**
 * ── Why a slug cannot be transliterated like a word ──
 *
 * A URL slug has already been through a fold that DESTROYS information: `qoʻllanma` was written
 * `qollanma` because URLs drop the ʻ. Transliterating what is left gives `қолланма`; the word is
 * `қўлланма`. Nothing in the string `qollanma` can tell the engine which it was — and a wrong
 * slug is not a wrong letter, it is a dead URL the day Google indexes it.
 *
 * So every segment the fold damaged is WRITTEN OUT here, keyed by the ASCII segment, and
 * `toCyrillicSlug` looks the key up before it transliterates anything. The comment on each line
 * is the word, with the letters the URL threw away.
 *
 * The full published slug list — 10 page slugs, 9 service slugs, 10 guide slugs — is asserted in
 * `scripts/test-cyrillic.mjs` against both this table and the hand-written tables in
 * `src/i18n/routes.ts`, so neither side can change a live URL without the other noticing.
 *
 * Keys are folded the way the ASCII slug was folded: lowercased, apostrophes removed. That way
 * the same entry answers for `qollanma` and for `Qoʻllanma`.
 */
export const slugWords: Record<string, string> = {
  // oʻ — the digraph the URL dropped. Four of the site's slugs turn on it.
  qollanma: 'қўлланма',       // qoʻllanma — guide index
  yol: 'йўл',                 // yoʻl — "temir yoʻl", in two slugs
  yonalishlar: 'йўналишлар',  // yoʻnalishlar — routes
  tolovlari: 'тўловлари',     // toʻlovlari — customs charges
  // gʻ — same story.
  lugati: 'луғати',           // lugʻati — "Kargo lugʻati", the glossary
  // Chinese names romanised from pinyin in the slug but written in Uzbek in the copy: the page
  // is titled "Ivu va Guanchjou bozorlari", so the Cyrillic URL follows the page, not the pinyin.
  yiwu: 'иву',                // Ivu (义乌)
  guangzhou: 'гуанчжоу',      // Guanchjou (广州)
};

/**
 * Uppercase abbreviations that appear in the site content and have been deliberately decided
 * about — either here or in `keepLatin`. `scripts/test-cyrillic.mjs` scans the real `uz` strings
 * and fails on any all-caps token that is in neither list, so a new acronym cannot ship
 * un-reviewed. Listed here only when the mechanical rules already produce the right Cyrillic.
 */
export const acronymsHandledByRule: Record<string, string> = {
  // Uzbek legal-form abbreviations. The digraph rules already spell these correctly.
  YaTT: 'ЯТТ',  // yakka tartibdagi tadbirkor — sole trader
  MChJ: 'МЧЖ',  // masʼuliyati cheklangan jamiyat — LLC
  // Uzbek legislation codes. Oʻ→Ў and Q→Қ already give the right letters.
  'OʻRQ': 'ЎРҚ', // Oʻzbekiston Respublikasi Qonuni — a law of the Republic

  // Institutions and legal codes named in the guides. Letter-by-letter is right for all of
  // these, but each one is a decision: they are Cyrillic because an Uzbek or Russian reader
  // has never met them in Latin, unlike IATA, GPS or CIF above, which are never Cyrillic.
  MDH: 'МДҲ',   // Mustaqil Davlatlar Hamdoʻstligi — the CIS
  STIR: 'СТИР', // soliq toʻlovchining identifikatsiya raqami — taxpayer number
  VM: 'ВМ',     // Vazirlar Mahkamasi — the Cabinet, in "VM 191-son qarori"
  JK: 'ЖК',     // Jinoyat kodeksi — the Criminal Code
  SSV: 'ССВ',   // Sogʻliqni saqlash vazirligi — the Health Ministry
  IM: 'ИМ',     // intellektual mulk — the IP registry
  EMM: 'ЭММ',   // elektromagnit moslashuv — the radio-equipment authority
  BAD: 'БАД',   // biologik faol dobavka — food supplements, Russian БАД
  XXR: 'ХХР',   // Xitoy Xalq Respublikasi — the PRC
};
