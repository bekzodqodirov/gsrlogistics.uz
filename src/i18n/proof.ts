import type { Lang } from './config';

/**
 * Home dark section "Nima olasiz" — what the client actually receives, as a checklist in
 * chronological order, plus a route-facts strip. Distance comes from src/data/route.ts,
 * day ranges from tariffs.json; nothing here is a counter or a promise.
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
}

const uz: ProofStrings = {
  eyebrow: 'Nima olasiz',
  h2: 'Qoʻlingizda qoladigan narsalar.',
  intro: 'Har bosqichda sizga hujjat, kod yoki surat qoladi. Roʻyxat — vaqt tartibida.',
  listLabel: 'Mijoz oladigan narsalar',
  items: [
    { when: 'Boshida', title: 'Shartnoma va hisob-faktura', text: 'Narx, muddat va javobgarlik — qogʻozda. Toʻlov hisob-faktura boʻyicha, yakunda — bajarilgan ish dalolatnomasi.' },
    { when: 'Shartnomadan keyin', title: 'Xitoydagi qabul manzili va GS kodi', text: 'Menejer Xitoydagi uchta qabul manzilidan qaysi biriga joʻnatishni aytadi. Yetkazib beruvchingiz GS kodini (markirovka) joʻnatishdan oldin har bir qutiga yozadi — yukingiz boshqaniki bilan aralashmaydi.' },
    { when: 'Qabul punktida', title: 'Foto-hisobot', text: 'Qabulda, oʻlchovda va yuklashda. Vazn, hajm va joy raqami surat bilan birga Telegramga keladi.' },
    { when: 'Yoʻlda', title: 'GS kodi bilan kuzatuv', text: 'Shu GS kod boʻyicha menejerdan joriy holat va suratni soʻraysiz: qabul punktida, yoʻlda, Xorgosda, Toshkent omborida, yetkazildi.', link: 'tracking', linkLabel: 'Kuzatuv sahifasi' },
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
    { when: 'В пути', title: 'Отслеживание по GS-коду', text: 'По тому же GS-коду запрашиваете у менеджера текущий статус и фото: в пункте приёма, в пути, на Хоргосе, на складе в Ташкенте, доставлено.', link: 'tracking', linkLabel: 'Страница отслеживания' },
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
    { when: 'In transit', title: 'Tracking by GS code', text: 'Quote the same GS code and your manager sends the current status and a photo: at the receiving point, in transit, at Khorgos, at the Tashkent warehouse, delivered.', link: 'tracking', linkLabel: 'Tracking page' },
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
};

export const proofStrings: Record<Lang, ProofStrings> = { uz, ru, en };
