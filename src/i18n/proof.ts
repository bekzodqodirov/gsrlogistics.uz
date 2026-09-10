import type { Lang } from './config';

/**
 * Home dark section "Nima olasiz" — what the client actually receives, as a checklist in
 * chronological order, plus a route-facts strip. Distance comes from src/data/route.ts,
 * day ranges from tariffs.json; nothing here is a counter or a promise.
 *
 * Item 4 used to read "you ask your manager for the current status by GS code", which was written
 * before we knew there was a bot. Two sections above, HowWeTrack now says the client sees every
 * carton "hech kimdan soʻramasdan" — without asking anyone — so the old line contradicted the
 * page's strongest claim, and it also listed five transit stages where the tracking page (and the
 * bot) have six. It now says what the client actually gets: an account in the bot, one line per
 * carton, and the six-stage list stays on the tracking page this item links to.
 */
export interface ProofItem {
  title: string;
  text: string;
  /** Short "when" tag, 1–3 words: "Shartnomadan keyin". */
  when: string;
  /** Optional link to a page (key resolved in Proof.astro). */
  link?: 'tracking' | 'pricing' | 'contact';
  linkLabel?: string;
}
export interface ProofStrings {
  eyebrow: string;
  h2: string;
  intro: string;
  listLabel: string;
  items: [ProofItem, ProofItem, ProofItem, ProofItem, ProofItem];
  facts: {
    label: string;
    /** Caption under the km value. */
    distance: string;
    /** Unit word after the border count: "chegara". */
    bordersUnit: string;
    /** Caption listing the two crossings. */
    borders: string;
    daysUnit: string;
    /** Caption under the day range. */
    days: string;
    /** Footnote: estimates, counted from departure. */
    note: string;
    /** Route mini-drawing labels in travel order (origin, border 1, border 2, destination). */
    nodes: [string, string, string, string];
    drawingLabel: string;
  };
  /**
   * Company credentials, in the same column as the route facts — the point in the page where a
   * visitor is deciding whether to hand a stranger a container of stock.
   *
   * WORDING RULE, owner-confirmed 2026-09-10: GSR itself is 8+ years old (2018). The 15 years
   * belong to the TEAM's experience in the freight business and must never be attributed to the
   * company, so every label here names its subject explicitly.
   */
  company: {
    label: string;
    rows: [
      { value: string; unit?: string; label: string },
      { value: string; unit?: string; label: string },
      { value: string; unit?: string; label: string },
    ];
  };
}

const uz: ProofStrings = {
  eyebrow: 'Nima olasiz',
  h2: 'Qoʻlingizda qoladigan narsalar.',
  intro: 'Har bosqichda sizga hujjat, kod yoki surat qoladi. Roʻyxat — vaqt tartibida.',
  listLabel: 'Mijoz oladigan narsalar',
  items: [
    { when: 'Boshida', title: 'Shartnoma va hisob-faktura', text: 'Narx, muddat va javobgarlik — qogʻozda. Toʻlov hisob-faktura boʻyicha, yakunda — bajarilgan ish dalolatnomasi.' },
    { when: 'Shartnomadan keyin', title: 'Xitoydagi qabul manzili va GS kodi', text: 'Menejer Xitoydagi uchta qabul manzilidan qaysi biriga joʻnatishni aytadi. Yetkazib beruvchingiz GS kodini (markirovkani) joʻnatishdan oldin har bir qutiga yozadi — yukingiz boshqaniki bilan aralashmaydi.' },
    { when: 'Qabul punktida', title: 'Foto-hisobot', text: 'Qabulda, oʻlchovda va yuklashda. Vazn, hajm va joy raqami surat bilan birga Telegramga keladi.' },
    { when: 'Yoʻlda', title: 'Botda oʻz kabinetingiz', text: 'Har bir qutingiz botda alohida koʻrinadi: oltita bosqichning qaysi birida ekani — sutkaning istalgan vaqtida.', link: 'tracking', linkLabel: 'Kuzatuv sahifasi' },
    { when: 'Toshkentda', title: 'Toshkent omborida qabul yoki uygacha yetkazish', text: 'Yuk kelgach menejer xabar beradi. Oʻzingiz olib ketasiz yoki manzilingizga, viloyatga joʻnatamiz.', link: 'pricing', linkLabel: 'Yetkazish shartlari' },
  ],
  facts: {
    label: 'Yoʻl faktlari',
    distance: 'Ivu → Toshkent, avto yoʻl',
    bordersUnit: 'chegara',
    borders: 'Xorgos (Xitoy–Qozogʻiston) · Yallama yoki Gʻishtkoʻprik (Qozogʻiston–Oʻzbekiston)',
    daysUnit: 'kun',
    days: 'Yigʻma yuk, taxminan',
    note: 'Muddatlar taxminiy, yuk Xitoy omboridan joʻnatilgandan keyin hisoblanadi.',
    nodes: ['Ivu', 'Xorgos', 'Yallama', 'Toshkent'],
    drawingLabel: 'Yoʻnalish: Ivu, Xorgos, Yallama, Toshkent',
  },
  company: {
    label: 'Kompaniya haqida',
    rows: [
      { value: '8+', unit: 'yil', label: 'GSR — 2018-yildan beri' },
      { value: '15', unit: 'yil', label: 'Jamoaning yuk tashish sohasidagi tajribasi' },
      { value: '400+', label: 'Mijozlar' },
    ],
  },
};

const ru: ProofStrings = {
  eyebrow: 'Что вы получаете',
  h2: 'То, что остаётся у вас на руках.',
  intro: 'На каждом этапе у вас остаётся документ, код или фото. Список — в хронологическом порядке.',
  listLabel: 'Что получает клиент',
  items: [
    { when: 'В начале', title: 'Договор и счёт-фактура', text: 'Цена, сроки и ответственность — на бумаге. Оплата по счёту, по завершении — акт выполненных работ.' },
    { when: 'После договора', title: 'Адрес приёма в Китае и GS-код', text: 'В Китае три адреса приёма — на какой отправлять, скажет менеджер. GS-код (маркировку) поставщик пишет на каждой коробке до отправки — ваш груз не смешается с чужим.' },
    { when: 'В пункте приёма', title: 'Фотоотчёт', text: 'При приёмке, обмере и погрузке. Вес, объём и номер места приходят в Telegram вместе с фото.' },
    { when: 'В пути', title: 'Свой кабинет в боте', text: 'Каждая ваша коробка видна в боте отдельно: на каком из шести этапов она сейчас — в любое время суток.', link: 'tracking', linkLabel: 'Страница отслеживания' },
    { when: 'В Ташкенте', title: 'Получение на складе в Ташкенте или доставка до двери', text: 'Когда груз прибыл, менеджер сообщает. Забираете сами или отправляем по вашему адресу, в регион.', link: 'pricing', linkLabel: 'Условия доставки' },
  ],
  facts: {
    label: 'Факты о маршруте',
    distance: 'Иу → Ташкент, автодорога',
    bordersUnit: 'границы',
    borders: 'Хоргос (Китай–Казахстан) · Яллама или Гишткуприк (Казахстан–Узбекистан)',
    daysUnit: 'дней',
    days: 'Сборный груз, ориентировочно',
    note: 'Сроки ориентировочные, считаются после отправки со склада в Китае.',
    nodes: ['Иу', 'Хоргос', 'Яллама', 'Ташкент'],
    drawingLabel: 'Маршрут: Иу, Хоргос, Яллама, Ташкент',
  },
  company: {
    label: 'О компании',
    rows: [
      { value: '8+', unit: 'лет', label: 'GSR — с 2018 года' },
      { value: '15', unit: 'лет', label: 'Опыт команды в грузоперевозках' },
      { value: '400+', label: 'Клиентов' },
    ],
  },
};

const en: ProofStrings = {
  eyebrow: 'What you get',
  h2: 'What stays in your hands.',
  intro: 'At every stage you keep a document, a code or a photo. The list is in chronological order.',
  listLabel: 'What the client receives',
  items: [
    { when: 'At the start', title: 'Contract and invoice', text: 'Price, transit time and liability — on paper. Payment against the invoice; a completion act at the end.' },
    { when: 'After signing', title: 'China receiving address and GS code', text: 'There are three receiving addresses in China — your manager tells you which one applies. Your supplier writes the GS code (shipping mark) on every carton before dispatch, so your cargo never mixes with anyone else’s.' },
    { when: 'At the receiving point', title: 'Photo report', text: 'At intake, measuring and loading. Weight, volume and lot number arrive on Telegram together with the photos.' },
    { when: 'In transit', title: 'Your own account in the bot', text: 'Every carton shows up separately in the bot: which of the six stages it is at, at any hour of the day.', link: 'tracking', linkLabel: 'Tracking page' },
    { when: 'In Tashkent', title: 'Pick-up at the Tashkent warehouse or door delivery', text: 'Your manager lets you know when the cargo arrives. Collect it yourself or we deliver to your address or region.', link: 'pricing', linkLabel: 'Delivery terms' },
  ],
  facts: {
    label: 'Route facts',
    distance: 'Yiwu → Tashkent by road',
    bordersUnit: 'borders',
    borders: 'Khorgos (China–Kazakhstan) · Yallama or Gishtkuprik (Kazakhstan–Uzbekistan)',
    daysUnit: 'days',
    days: 'Consolidated truck cargo, roughly',
    note: 'Transit times are indicative and count from departure from the China warehouse.',
    nodes: ['Yiwu', 'Khorgos', 'Yallama', 'Tashkent'],
    drawingLabel: 'Route: Yiwu, Khorgos, Yallama, Tashkent',
  },
  company: {
    label: 'About the company',
    rows: [
      { value: '8+', unit: 'years', label: 'GSR — since 2018' },
      { value: '15', unit: 'years', label: 'The team’s experience in freight' },
      { value: '400+', label: 'Clients' },
    ],
  },
};

export const proofStrings: Record<Lang, ProofStrings> = { uz, ru, en };
