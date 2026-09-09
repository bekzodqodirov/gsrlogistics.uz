import type { Lang } from './config';

/** Labels for the FAQ page (/savol-javob/) and the home FAQ section. Questions and answers live in src/data/faq.ts. */
export interface FaqStrings {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  h1: string;
  /** Placeholders: {count} {truckDays} {airDays} {truckFrom} */
  intro: string;
  navLabel: string;
  navTitle: string;
  questionsWord: string;
  /** Placeholder: {date} */
  priceMeta: string;
  cta: { title: string; text: string };
  home: { eyebrow: string; h2: string; sub: string; all: string };
}

const uz: FaqStrings = {
  seoTitle: 'Xitoydan kargo boʻyicha savol-javob — narx, muddat, bojxona | GSR Logistics',
  seoDescription: 'Xitoydan Oʻzbekistonga yuk tashish haqida 32 savolga aniq javob: yigʻma yuk 15–25 kun, avia 5–10 kun, narx kg yoki m³ boʻyicha, 200 $ limit, boj va QQS, taqiqlangan tovarlar, sugʻurta, 1688 orqali sotib olish.',
  eyebrow: 'Savol-javob',
  h1: 'Xitoydan kargo: eng koʻp beriladigan savollar',
  intro: 'Bu sahifada Xitoydan Oʻzbekistonga yuk tashish boʻyicha {count} ta savolga qisqa javob bor: yigʻma yuk taxminan {truckDays} kun, avia {airDays} kun, narx {truckFrom}/m³ dan, bojxona — rasmiy, GTD bilan. Savolingiz topilmasa, Telegramda yozing — menejer yukingiz boʻyicha aniq raqam bilan javob beradi.',
  navLabel: 'Savol boʻlimlari',
  navTitle: 'Boʻlimlar',
  questionsWord: 'savol',
  priceMeta: 'Narxlar taxminiy · Yangilangan: {date}',
  cta: { title: 'Savolingiz qoldimi?', text: 'Yuk, shahar va muddatni yozing — narx va yoʻnalishni taklif qilamiz. Menejerlar oʻzbek, rus va xitoy tillarida javob beradi.' },
  home: { eyebrow: 'Savol-javob', h2: 'Birinchi marta olib kelyapsizmi?', sub: 'Yoki yuzinchi — javoblar bir xil aniq.', all: 'Barcha savollar' },
};

const ru: FaqStrings = {
  seoTitle: 'Вопросы и ответы о карго из Китая — цены, сроки, таможня | GSR Logistics',
  seoDescription: 'Точные ответы на 32 вопроса о доставке грузов из Китая в Узбекистан: сборный груз 15–25 дней, авиа 5–10 дней, расчёт по кг или м³, лимит 200 $, пошлины и НДС, запрещённые товары, страховка, выкуп с 1688.',
  eyebrow: 'Вопросы и ответы',
  h1: 'Карго из Китая: ответы на частые вопросы',
  intro: 'На этой странице — короткие ответы на {count} вопроса о доставке грузов из Китая в Узбекистан: сборный груз ориентировочно {truckDays} дней, авиа {airDays} дней, цена от {truckFrom}/м³, таможенное оформление официальное, с ГТД. Не нашли ответ — напишите в Telegram, менеджер посчитает именно ваш груз.',
  navLabel: 'Разделы вопросов',
  navTitle: 'Разделы',
  questionsWord: 'вопр.',
  priceMeta: 'Цены ориентировочные · Обновлено: {date}',
  cta: { title: 'Остался вопрос?', text: 'Напишите, что за груз, из какого города и к какому сроку — предложим цену и маршрут. Менеджеры отвечают на узбекском, русском и китайском.' },
  home: { eyebrow: 'Вопросы', h2: 'Везёте впервые?', sub: 'Или в сотый раз — ответы одинаково точные.', all: 'Все вопросы' },
};

const en: FaqStrings = {
  seoTitle: 'China cargo FAQ — prices, transit times, customs | GSR Logistics',
  seoDescription: 'Straight answers to 32 questions about shipping from China to Uzbekistan: consolidated truck freight in 15–25 days, air in 5–10, pricing per kg or m³, the $200 personal limit, duties and VAT, prohibited goods, insurance, buying on 1688.',
  eyebrow: 'FAQ',
  h1: 'Cargo from China: the questions we get most',
  intro: 'This page answers {count} questions about shipping from China to Uzbekistan in a few sentences each: consolidated truck freight takes roughly {truckDays} days, air {airDays} days, rates start at {truckFrom}/m³, and customs clearance is official, with a customs declaration. If your question is not here, message us on Telegram and a manager will answer with figures for your shipment.',
  navLabel: 'Question groups',
  navTitle: 'Groups',
  questionsWord: 'questions',
  priceMeta: 'Prices are estimates · Updated {date}',
  cta: { title: 'Still have a question?', text: 'Tell us the goods, the city in China and your deadline — we propose a price and a route. Our managers reply in Uzbek, Russian and Chinese.' },
  home: { eyebrow: 'FAQ', h2: 'Importing for the first time?', sub: 'Or the hundredth — the answers are just as exact.', all: 'All questions' },
};

export const faqStrings: Record<Lang, FaqStrings> = { uz, ru, en };

/** Tiny {key} interpolation for the strings above. */
export function faqTpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}
