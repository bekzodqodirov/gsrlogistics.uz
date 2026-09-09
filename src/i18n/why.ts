import type { Lang } from './config';

/**
 * Home "Nima uchun GSR" section — six specific reasons, each with a checkable fact.
 * Numbers in `fact` strings are templated ({div}, {th}, {rate}, {year}, {address}) and filled
 * from tariffs.json / site.ts in WhyGsr.astro so no figure is typed here.
 */
export interface WhyReason {
  glyph: 'warehouse' | 'languages' | 'camera' | 'document' | 'scale' | 'calendar';
  title: string;
  text: string;
  /** Short tabular fact line under the sentence; may contain {placeholders}. */
  fact: string;
  /** Optional link label; the href is chosen in the component by `link` key. */
  link?: 'pricing' | 'customs' | 'warehouse' | 'contact';
  linkLabel?: string;
}
export interface WhyStrings {
  eyebrow: string;
  h2: string;
  intro: string;
  listLabel: string;
  reasons: [WhyReason, WhyReason, WhyReason, WhyReason, WhyReason, WhyReason];
  /** Meta line under the grid; {date} is filled from tariffs.updated. */
  meta: string;
}

const uz: WhyStrings = {
  eyebrow: 'Nima uchun GSR',
  h2: 'Vaʼdalar emas — aniq faktlar.',
  intro: 'Ishonch — raqamlarda va manzilda. Quyidagilarning hammasini tekshirishingiz mumkin.',
  listLabel: 'Olti sabab',
  reasons: [
    {
      glyph: 'warehouse',
      title: 'Xitoyda uchta qabul punkti va konsolidatsiya',
      text: 'Bir necha yetkazib beruvchidan kelgan yukni bitta joyda yigʻamiz, tortamiz, oʻlchaymiz va qayta qadoqlaymiz. Xitoyda uchta qabul punkti bor: Ivu, Guanchjou va Qashqar — qaysi biriga joʻnatish kerakligini menejer aytadi.',
      fact: 'Ivu 义乌 · Guanchjou 广州 · Qashqar 喀什 · bitta joy raqami, bitta hisob',
      link: 'warehouse',
      linkLabel: 'Ombor va sifat nazorati',
    },
    {
      glyph: 'languages',
      title: 'Menejerlar oʻzbek, rus va xitoy tilida',
      text: 'Yetkazib beruvchi bilan biz gaplashamiz: narx, namunalar, joʻnatish sanasi. Xitoy tilini bilishingiz shart emas.',
      fact: '3 til · bitta menejer',
    },
    {
      glyph: 'camera',
      title: 'Foto-hisobot har bosqichda',
      text: 'Qabulda, oʻlchovda va yuklashda surat olamiz. Yukingizni oʻz koʻzingiz bilan koʻrasiz — Telegramda, soʻramasdan ham.',
      fact: 'Qabul · oʻlchov · yuklash',
    },
    {
      glyph: 'document',
      title: 'Bojxona rasmiylashtiruvi va hujjatlar',
      text: 'Invoys, qadoqlash roʻyxati, TN VED kodi, deklaratsiya — bizning zimmamizda. Import qiluvchi kim boʻlishi — kompaniyangiz yoki biz — ish modeliga bogʻliq; buni birinchi suhbatdayoq kelishamiz. Boj va QQS qonun boʻyicha toʻlanadi, summani oldindan hisoblab beramiz.',
      fact: 'GTD · boj va QQS hisobi oldindan',
      link: 'customs',
      linkLabel: 'Bojxona haqida',
    },
    {
      glyph: 'scale',
      title: 'Shaffof narx: kg yoki m³',
      text: 'Hajmiy vazn formulasi ochiq: uzunlik × en × balandlik (sm) ÷ {div}. Zichlik {th} kg/m³ dan yuqori — kg boʻyicha, past — m³ boʻyicha. Yashirin toʻlovlarsiz.',
      fact: 'Yigʻma yuk {rate} dan · ÷ {div} · {th} kg/m³',
      link: 'pricing',
      linkLabel: 'Barcha tariflar',
    },
    {
      glyph: 'calendar',
      title: '{year}-yildan beri Xitoy bilan',
      text: 'Avval tovar topish va sotib olish, keyin yigʻma yuk. Jismoniy shaxs ham, yuridik shaxs ham — bir quti ham, konteyner ham: yondashuv bir xil aniq.',
      fact: 'Toshkent, {address} · kelib koʻrishingiz mumkin',
      link: 'contact',
      linkLabel: 'Manzil va aloqa',
    },
  ],
  meta: 'Narxlar taxminiy · Yangilangan: {date}',
};

const ru: WhyStrings = {
  eyebrow: 'Почему GSR',
  h2: 'Не обещания — факты.',
  intro: 'Доверие — в цифрах и адресе. Всё ниже можно проверить.',
  listLabel: 'Шесть причин',
  reasons: [
    {
      glyph: 'warehouse',
      title: 'Три пункта приёма в Китае и консолидация',
      text: 'Грузы от нескольких поставщиков собираем в одном месте, взвешиваем, обмеряем и переупаковываем. В Китае три пункта приёма: Иу, Гуанчжоу и Кашгар — на какой отправлять, скажет менеджер.',
      fact: 'Иу 义乌 · Гуанчжоу 广州 · Кашгар 喀什 · один номер места, один счёт',
      link: 'warehouse',
      linkLabel: 'Склад и проверка качества',
    },
    {
      glyph: 'languages',
      title: 'Три языка: узбекский, русский, китайский',
      text: 'С поставщиком разговариваем мы: цена, образцы, дата отгрузки. Знать китайский вам не нужно.',
      fact: '3 языка · один менеджер',
    },
    {
      glyph: 'camera',
      title: 'Фотоотчёт на каждом этапе',
      text: 'Снимаем при приёмке, обмере и погрузке. Вы видите свой груз своими глазами — в Telegram, без напоминаний.',
      fact: 'Приёмка · обмер · погрузка',
    },
    {
      glyph: 'document',
      title: 'Растаможка и документы',
      text: 'Инвойс, упаковочный лист, код ТН ВЭД, декларация — берём на себя. Кто выступает импортёром — ваша компания или мы — зависит от схемы работы; договариваемся об этом в первом разговоре. Пошлина и НДС платятся по закону, сумму считаем заранее.',
      fact: 'ГТД · расчёт пошлины и НДС заранее',
      link: 'customs',
      linkLabel: 'О таможне',
    },
    {
      glyph: 'scale',
      title: 'Прозрачная цена: кг или м³',
      text: 'Формула объёмного веса открыта: длина × ширина × высота (см) ÷ {div}. Плотность выше {th} кг/м³ — считаем по кг, ниже — по м³. Без скрытых платежей.',
      fact: 'Сборный груз от {rate} · ÷ {div} · {th} кг/м³',
      link: 'pricing',
      linkLabel: 'Все тарифы',
    },
    {
      glyph: 'calendar',
      title: 'С Китаем с {year} года',
      text: 'Сначала поиск и выкуп товаров, затем сборные грузы. Частное лицо или компания, одна коробка или контейнер — подход одинаково точный.',
      fact: 'Ташкент, {address} · можно приехать',
      link: 'contact',
      linkLabel: 'Адрес и контакты',
    },
  ],
  meta: 'Цены ориентировочные · Обновлено: {date}',
};

const en: WhyStrings = {
  eyebrow: 'Why GSR',
  h2: 'Facts, not promises.',
  intro: 'Trust lives in numbers and an address. Everything below can be checked.',
  listLabel: 'Six reasons',
  reasons: [
    {
      glyph: 'warehouse',
      title: 'Three receiving points in China and consolidation',
      text: 'Goods from several suppliers are gathered in one place, weighed, measured and repacked. There are three receiving points in China — Yiwu, Guangzhou and Kashgar; your manager tells you which one applies.',
      fact: 'Yiwu 义乌 · Guangzhou 广州 · Kashgar 喀什 · one lot number, one invoice',
      link: 'warehouse',
      linkLabel: 'Warehouse and quality control',
    },
    {
      glyph: 'languages',
      title: 'Managers speak Uzbek, Russian and Chinese',
      text: 'We talk to the supplier for you: price, samples, shipping date. You do not need any Chinese.',
      fact: '3 languages · one manager',
    },
    {
      glyph: 'camera',
      title: 'Photo report at every stage',
      text: 'We photograph intake, measuring and loading. You see your cargo with your own eyes — on Telegram, without asking.',
      fact: 'Intake · measuring · loading',
    },
    {
      glyph: 'document',
      title: 'Customs clearance and paperwork',
      text: 'Invoice, packing list, HS code, declaration — on us. Who acts as importer of record — your company or ours — depends on the working model; we settle it in the first conversation. Duty and VAT are paid as the law requires, and we calculate the amount in advance.',
      fact: 'Customs declaration · duty and VAT estimated up front',
      link: 'customs',
      linkLabel: 'About customs',
    },
    {
      glyph: 'scale',
      title: 'Transparent pricing: per kg or per m³',
      text: 'The volumetric formula is public: length × width × height (cm) ÷ {div}. Density above {th} kg/m³ is priced per kg, below — per m³. No hidden fees.',
      fact: 'Consolidated cargo from {rate} · ÷ {div} · {th} kg/m³',
      link: 'pricing',
      linkLabel: 'All rates',
    },
    {
      glyph: 'calendar',
      title: 'Working with China since {year}',
      text: 'First sourcing and buying, then consolidated cargo. Private individual or company, one box or a container — the approach is equally exact.',
      fact: 'Tashkent, {address} · visitors welcome',
      link: 'contact',
      linkLabel: 'Address and contact',
    },
  ],
  meta: 'Prices are estimates · Updated {date}',
};

export const whyStrings: Record<Lang, WhyStrings> = { uz, ru, en };

/** Fill {placeholders} in a dictionary string. */
export function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}
