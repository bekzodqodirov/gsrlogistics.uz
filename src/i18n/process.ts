import type { Lang } from './config';

/**
 * Home "Jarayon" section — the company's five steps (PROJECT_BRIEF §2, DESIGN_BRIEF §3.5).
 * No timing promises anywhere. CTA labels come from common.ts.
 */
export interface ProcessStep {
  /** Step title, 2–5 words, verb-final. */
  title: string;
  /** One or two short sentences, ≤ 22 words. */
  text: string;
  /** Glyph key drawn inline in HowItWorks.astro. */
  glyph: 'chat' | 'exchange' | 'contract' | 'pin' | 'parcel';
}
export interface ProcessStrings {
  /** Bare noun after the section number: "Jarayon". */
  eyebrow: string;
  h2: string;
  intro: string;
  /** aria-label of the ordered list. */
  listLabel: string;
  /** Word before the step number for screen readers: "Qadam". */
  stepWord: string;
  steps: [ProcessStep, ProcessStep, ProcessStep, ProcessStep, ProcessStep];
  /** Footnote under the CTA row. */
  note: string;
}

const uz: ProcessStrings = {
  eyebrow: 'Jarayon',
  h2: 'Besh qadam. Birinchisi — bir xabar.',
  intro: 'Soʻrovdan yukni qabul qilishgacha — bitta menejer va bitta shartnoma. Har qadamda nima boʻlishini oldindan bilasiz.',
  listLabel: 'Ish tartibi: besh qadam',
  stepWord: 'Qadam',
  steps: [
    { glyph: 'chat', title: 'Soʻrov qoldirasiz', text: 'Telegramda yoki telefon orqali. Yuk turi, taxminiy vazn va shahar — boshlash uchun shu kifoya.' },
    { glyph: 'exchange', title: 'Buyurtmani muhokama qilamiz', text: 'Transport turi, hujjatlar, qadoqlash va narx qoidasi — kg yoki m³. Savollaringizga menejer javob beradi.' },
    { glyph: 'contract', title: 'Hujjatlar — va ish boshlanadi', text: 'Shartnoma, Ivu ombor manzili va mijoz kodi. Yetkazib beruvchingiz yukni shu manzilga joʻnatadi.' },
    { glyph: 'pin', title: 'Menejer yoʻlda hamroh', text: 'Yuk qayerdaligi va foto-hisobot Telegramga keladi: qabul, yuklash, chegara, Toshkent.' },
    { glyph: 'parcel', title: 'Yukni qabul qilasiz', text: 'Toshkentda oʻzingiz olib ketasiz yoki viloyatingizga joʻnatamiz. Hisob-faktura — qoʻlingizda.' },
  ],
  note: 'Birinchi xabar hech narsaga majbur qilmaydi: yuk, shahar va muddatni aytasiz — narx va yoʻnalishni taklif qilamiz.',
};

const ru: ProcessStrings = {
  eyebrow: 'Как это работает',
  h2: 'Пять шагов. Первый — одно сообщение.',
  intro: 'От заявки до получения груза — один менеджер и один договор. На каждом шаге вы заранее знаете, что будет дальше.',
  listLabel: 'Порядок работы: пять шагов',
  stepWord: 'Шаг',
  steps: [
    { glyph: 'chat', title: 'Оставляете заявку', text: 'В Telegram или по телефону. Тип груза, примерный вес и город — для начала этого достаточно.' },
    { glyph: 'exchange', title: 'Обсуждаем заказ', text: 'Вид транспорта, документы, упаковка и правило расчёта — по кг или м³. Менеджер отвечает на вопросы.' },
    { glyph: 'contract', title: 'Документы — и работа началась', text: 'Договор, адрес склада в Иу и ваш код клиента. Поставщик отправляет груз на этот адрес.' },
    { glyph: 'pin', title: 'Менеджер сопровождает груз', text: 'Где груз и фотоотчёт — в Telegram: приёмка, погрузка, граница, Ташкент.' },
    { glyph: 'parcel', title: 'Принимаете груз', text: 'В Ташкенте забираете сами или отправляем в ваш регион. Счёт-фактура — у вас на руках.' },
  ],
  note: 'Первое сообщение ни к чему не обязывает: вы называете груз, город и сроки — мы предлагаем цену и маршрут.',
};

const en: ProcessStrings = {
  eyebrow: 'How it works',
  h2: 'Five steps. The first is one message.',
  intro: 'From request to hand-over — one manager and one contract. At every step you know in advance what happens next.',
  listLabel: 'How we work: five steps',
  stepWord: 'Step',
  steps: [
    { glyph: 'chat', title: 'You send a request', text: 'On Telegram or by phone. Cargo type, rough weight and city are enough to start.' },
    { glyph: 'exchange', title: 'We discuss the order', text: 'Transport mode, documents, packing and the pricing rule — per kg or per m³. Your manager answers every question.' },
    { glyph: 'contract', title: 'Documents — and work begins', text: 'Contract, the Yiwu warehouse address and your client code. Your supplier ships to that address.' },
    { glyph: 'pin', title: 'Your manager rides along', text: 'Location updates and photo reports arrive on Telegram: intake, loading, border, Tashkent.' },
    { glyph: 'parcel', title: 'You receive the cargo', text: 'Collect it in Tashkent or we forward it to your region. The invoice is in your hands.' },
  ],
  note: 'The first message commits you to nothing: tell us the cargo, city and deadline — we propose a price and a route.',
};

export const processStrings: Record<Lang, ProcessStrings> = { uz, ru, en };
