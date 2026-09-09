import type { Lang } from './config';

/**
 * Strings for the pinned cargo-journey section (src/components/journey/Journey.astro).
 * Six stages: Yiwu warehouse → loading → transit → Khorgos customs → Tashkent warehouse → delivered.
 * Day ranges are NOT typed here — they come from src/data/tariffs.json at render time.
 */
export interface JourneyStage {
  /** h3 of the caption card */
  title: string;
  /** short form for the progress rail's aria-label */
  short: string;
  /** ≤ 22 words, active verbs */
  body: string;
  /** fact row, joined with " · " */
  facts: string[];
}

export interface JourneyStrings {
  eyebrow: string;
  title: string;
  sub: string;
  /** "Bosqich" — used as "Bosqich 4: Xorgos" */
  stageWord: string;
  railLabel: string;
  stages: [JourneyStage, JourneyStage, JourneyStage, JourneyStage, JourneyStage, JourneyStage];
  chipsLabel: string;
  chips: { truck: string; rail: string; air: string };
  daysUnit: string;
  /** daysCaption: the caption tail per active mode chip — "avto, taxminan" + the day range from tariffs */
  km: { unit: string; caption: string; daysCaption: { truck: string; rail: string; air: string } };
  footnote: string;
  done: string;
  map: { aria: string; border: string; altRoute: string; warehouse: string };
}

const uz: JourneyStrings = {
  eyebrow: '01 — Yoʻl',
  title: 'Ivudan eshigingizgacha.',
  sub: 'Har bosqich — koʻz oʻngingizda.',
  stageWord: 'Bosqich',
  railLabel: 'Yoʻl bosqichlari',
  stages: [
    { title: 'Ivu ombori', short: 'Ivu ombori', body: 'Har bir joyni tortamiz, oʻlchaymiz, raqamlaymiz. Foto-hisobot Telegramga keladi.', facts: ['Qabul', 'oʻlchov', 'foto-hisobot'] },
    { title: 'Yuklash', short: 'Yuklash', body: 'Yukingiz fura yoki konteynerda joy oladi. Butun konteyner shart emas — faqat oʻz joyingiz uchun toʻlaysiz.', facts: ['Joy raqami', 'yuklash sanasi'] },
    { title: 'Yoʻlda', short: 'Yoʻlda', body: 'Urumchi orqali Xorgosgacha, soʻng Qozogʻiston boʻylab. Yoʻnalishni siz tanlaysiz.', facts: [] },
    { title: 'Xorgos. Chegara va bojxona', short: 'Xorgos', body: 'Invoys, qadoqlash roʻyxati va TN VED kodi oldindan tayyor. Bojxona rasmiylashtiruvi — bizning zimmamizda.', facts: ['Deklaratsiya', 'boj va QQS hisobi', 'GTD'] },
    { title: 'Toshkent ombori', short: 'Toshkent ombori', body: 'Yuk omborga tushdi — menejer xabar beradi. Oʻzingiz olib ketasiz yoki viloyatga joʻnatamiz.', facts: ['Toshkent', 'olib ketish yoki viloyatga joʻnatish'] },
    { title: 'Topshirildi', short: 'Topshirildi', body: 'Yukni qabul qilasiz. Keyingisini hisoblaymizmi?', facts: [] },
  ],
  chipsLabel: 'Yetkazish turi',
  chips: { truck: 'Avto', rail: 'Temir yoʻl', air: 'Avia' },
  daysUnit: 'kun',
  km: { unit: 'km', caption: 'Ivu → Toshkent, Xorgos orqali', daysCaption: { truck: 'avto, taxminan', rail: 'temir yoʻl, taxminan', air: 'avia, taxminan' } },
  footnote: 'Muddatlar taxminiy, yuk Xitoy omboridan joʻnatilgandan keyin hisoblanadi.',
  done: 'bajarildi',
  map: {
    aria: 'Ivudan Toshkentgacha yoʻl xaritasi: Ivu, Sian, Lanchjou, Urumchi, Xorgos, Olmaota, Shimkent, Toshkent',
    border: 'bojxona',
    altRoute: 'muqobil yoʻl',
    warehouse: 'ombor',
  },
};

const ru: JourneyStrings = {
  eyebrow: '01 — Маршрут',
  title: 'Из Иу до вашей двери.',
  sub: 'Каждый этап — как на ладони.',
  stageWord: 'Этап',
  railLabel: 'Этапы маршрута',
  stages: [
    { title: 'Склад в Иу', short: 'Склад в Иу', body: 'Каждое место взвешиваем, обмеряем, нумеруем. Фотоотчёт приходит в Telegram.', facts: ['Приёмка', 'обмер', 'фотоотчёт'] },
    { title: 'Погрузка', short: 'Погрузка', body: 'Груз занимает место в фуре или контейнере. Целый контейнер не нужен — платите только за своё место.', facts: ['Номер места', 'дата погрузки'] },
    { title: 'В пути', short: 'В пути', body: 'Через Урумчи до Хоргоса, дальше по Казахстану. Способ доставки выбираете вы.', facts: [] },
    { title: 'Хоргос. Граница и таможня', short: 'Хоргос', body: 'Инвойс, упаковочный лист и код ТН ВЭД готовы заранее. Таможенное оформление берём на себя.', facts: ['Декларация', 'расчёт пошлины и НДС', 'ГТД'] },
    { title: 'Склад в Ташкенте', short: 'Склад в Ташкенте', body: 'Груз на складе — менеджер сообщит. Забираете сами или отправляем в регион.', facts: ['Ташкент', 'самовывоз или отправка в регион'] },
    { title: 'Выдан', short: 'Выдан', body: 'Вы принимаете груз. Посчитаем следующий?', facts: [] },
  ],
  chipsLabel: 'Способ доставки',
  chips: { truck: 'Авто', rail: 'Ж/д', air: 'Авиа' },
  daysUnit: 'дней',
  km: { unit: 'км', caption: 'Иу → Ташкент через Хоргос', daysCaption: { truck: 'авто, ориентировочно', rail: 'ж/д, ориентировочно', air: 'авиа, ориентировочно' } },
  footnote: 'Сроки ориентировочные, считаются после отправки со склада в Китае.',
  done: 'выполнено',
  map: {
    aria: 'Карта маршрута из Иу в Ташкент: Иу, Сиань, Ланьчжоу, Урумчи, Хоргос, Алматы, Шымкент, Ташкент',
    border: 'таможня',
    altRoute: 'альтернативный маршрут',
    warehouse: 'склад',
  },
};

const en: JourneyStrings = {
  eyebrow: '01 — The route',
  title: 'From Yiwu to your door.',
  sub: 'Every stage in plain sight.',
  stageWord: 'Stage',
  railLabel: 'Route stages',
  stages: [
    { title: 'Yiwu warehouse', short: 'Yiwu warehouse', body: 'We weigh, measure and number every piece. The photo report lands in your Telegram.', facts: ['Receiving', 'measuring', 'photo report'] },
    { title: 'Loading', short: 'Loading', body: 'Your cargo takes its place in a truck or container. No whole container needed — you pay for your space only.', facts: ['Piece number', 'loading date'] },
    { title: 'In transit', short: 'In transit', body: 'Via Urumqi to Khorgos, then across Kazakhstan. You choose the mode.', facts: [] },
    { title: 'Khorgos. Border and customs', short: 'Khorgos', body: 'Invoice, packing list and HS code ready in advance. Customs clearance is on us.', facts: ['Declaration', 'duty and VAT estimate', 'customs declaration'] },
    { title: 'Tashkent warehouse', short: 'Tashkent warehouse', body: 'Cargo unloaded — your manager lets you know. Collect it yourself or we forward it to your region.', facts: ['Tashkent', 'pick-up or forwarding to your region'] },
    { title: 'Delivered', short: 'Delivered', body: 'You receive your cargo. Shall we price the next one?', facts: [] },
  ],
  chipsLabel: 'Shipping mode',
  chips: { truck: 'Truck', rail: 'Rail', air: 'Air' },
  daysUnit: 'days',
  km: { unit: 'km', caption: 'Yiwu → Tashkent via Khorgos', daysCaption: { truck: 'truck, roughly', rail: 'rail, roughly', air: 'air, roughly' } },
  footnote: 'Transit times are indicative and count from departure from the China warehouse.',
  done: 'done',
  map: {
    aria: 'Route map from Yiwu to Tashkent: Yiwu, Xiʼan, Lanzhou, Urumqi, Khorgos, Almaty, Shymkent, Tashkent',
    border: 'customs',
    altRoute: 'alternative route',
    warehouse: 'warehouse',
  },
};

export const journey: Record<Lang, JourneyStrings> = { uz, ru, en };
