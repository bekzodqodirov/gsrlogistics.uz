import type { Lang } from './config';

/**
 * Home hero + proof strip strings (DESIGN_BRIEF §2). Toponyms come from `src/data/route.ts`;
 * phone, hours and the Telegram draft from `src/lib/site.ts` / `common.ts`; day ranges from `tariffs.json`.
 */
export interface HeroStrings {
  eyebrow: string;
  /** H1 line 1 (in `--fg`). */
  h1a: string;
  /** H1 line 2 (in `--fg-2`). */
  h1b: string;
  /** Documented A/B alternate for line 2 — not rendered by default (needs native-reader sign-off, DESIGN_BRIEF §2.1). */
  h1b_alt: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Accessible name of the route drawing, e.g. "Yoʻnalish: Ivu → … → Toshkent". */
  drawingLabel: string;
  /** Second line under the Xorgos tick. */
  khorgosRole: string;
  /** Desktop-only coordinate line under Toshkent. */
  coords: string;
  /** Accessible description of the km readout. */
  readoutLabel: string;
  unitDays: string;
  proof: {
    truck: string;
    air: string;
    yiwuValue: string;
    yiwu: string;
    sinceValue: string;
    since: string;
  };
  proofLabel: string;
}

const uz: HeroStrings = {
  eyebrow: 'Xitoy → Oʻzbekiston · yigʻma yuk, avia, temir yoʻl',
  h1a: 'Xitoydan Toshkentga kargo.',
  h1b: 'Har kilo, har kun — hisobda.',
  h1b_alt: 'Yoʻlning har kilometri — koʻz oʻngingizda.',
  sub: 'Ivu omboridan Xorgos orqali Toshkentgacha: yigʻma yuk taxminan 15–25 kun, avia 5–10 kun. Xitoyda uchta qabul manzili — Ivu, Guanchjou va Qashqar. Qabul va tekshiruv, foto-hisobot, Toshkentda bojxona rasmiylashtiruvi — bitta shartnoma, bitta menejer. 2018-yildan beri Xitoy bilan ishlaymiz.',
  ctaPrimary: 'Narxni hisoblang',
  ctaSecondary: 'Telegramga yozing',
  drawingLabel: 'Yoʻnalish',
  khorgosRole: 'bojxona',
  coords: '41.32° N 69.25° E',
  readoutLabel: 'Yoʻl uzunligi va muddati',
  unitDays: 'kun',
  proof: {
    truck: 'Yigʻma yuk (avto), Xitoy omboridan joʻnatilgach, taxminan',
    air: 'Avia kargo, taxminan',
    yiwuValue: '3',
    yiwu: 'Qabul manzili Xitoyda, 1 ofis Toshkentda · har qabulda foto-hisobot',
    sinceValue: '2018-yildan',
    since: 'Shu yildan beri Xitoy bilan ishlaymiz · menejerlar oʻzbek, rus, xitoy tilida',
  },
  proofLabel: 'Asosiy faktlar',
};

const ru: HeroStrings = {
  eyebrow: 'Китай → Узбекистан · сборный груз, авиа, ж/д',
  h1a: 'Карго из Китая в Ташкент.',
  h1b: 'Каждый килограмм и день — на счету.',
  h1b_alt: 'Каждый километр пути — как на ладони.',
  sub: 'Со склада в Иу через Хоргос до Ташкента: сборный груз — ориентировочно 15–25 дней, авиа — 5–10. В Китае три адреса приёма: Иу, Гуанчжоу и Кашгар. Приёмка и проверка, фотоотчёт, растаможка в Ташкенте — один договор, один менеджер. Работаем с Китаем с 2018 года.',
  ctaPrimary: 'Рассчитать стоимость',
  ctaSecondary: 'Написать в Telegram',
  drawingLabel: 'Маршрут',
  khorgosRole: 'таможня',
  coords: '41.32° с. ш. 69.25° в. д.',
  readoutLabel: 'Протяжённость и срок в пути',
  unitDays: 'дней',
  proof: {
    truck: 'Сборный груз (авто), после отправки со склада в Китае, ориентировочно',
    air: 'Авиа карго, ориентировочно',
    yiwuValue: '3',
    yiwu: 'Адреса приёма в Китае, 1 офис в Ташкенте · фотоотчёт при каждой приёмке',
    sinceValue: 'с 2018 года',
    since: 'С тех пор работаем с Китаем · менеджеры говорят по-узбекски, по-русски и по-китайски',
  },
  proofLabel: 'Ключевые факты',
};

const en: HeroStrings = {
  eyebrow: 'China → Uzbekistan · consolidated, air, rail',
  h1a: 'Cargo from China to Tashkent.',
  h1b: 'Every kilo, every day — accounted for.',
  h1b_alt: 'Every kilometre in plain sight.',
  sub: 'From the Yiwu warehouse via Khorgos to Tashkent: consolidated truck freight in roughly 15–25 days, air in 5–10. Three receiving addresses in China — Yiwu, Guangzhou and Kashgar. Receiving and inspection, photo reports, customs clearance in Tashkent — one contract, one manager. Working with China since 2018.',
  ctaPrimary: 'Estimate the price',
  ctaSecondary: 'Message us on Telegram',
  drawingLabel: 'Route',
  khorgosRole: 'customs',
  coords: '41.32° N 69.25° E',
  readoutLabel: 'Route length and transit time',
  unitDays: 'days',
  proof: {
    truck: 'Consolidated truck cargo, from departure from the China warehouse, roughly',
    air: 'Air cargo, roughly',
    yiwuValue: '3',
    yiwu: 'Receiving addresses in China, 1 office in Tashkent · photo report at every intake',
    sinceValue: 'since 2018',
    since: 'Working with China since then · managers speak Uzbek, Russian and Chinese',
  },
  proofLabel: 'Key facts',
};

export const hero: Record<Lang, HeroStrings> = { uz, ru, en };
