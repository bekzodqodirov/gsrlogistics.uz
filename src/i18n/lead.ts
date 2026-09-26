import type { Lang } from './config';

/**
 * The one-question picker that opens before Telegram on every general "write to us" button
 * (components/ContactPicker.astro). It exists so a message lands with the manager who handles that
 * work — owner, 2026-09-26: cargo and buying are separate people. See lib/leads.ts.
 *
 * Two taps at most: the topic, then one detail. Every final choice opens Telegram with a draft the
 * visitor can still edit — nothing is sent by the site, and the footnote says so.
 *
 * Drafts end with no reply-time promise (check-content.mjs bans those), and the machine tag and page
 * path are appended by lib/leads.ts, not written here.
 */
interface Choice { label: string; /** What goes into the draft for this choice. */ msg: string }
export interface LeadStrings {
  title: string;
  lead: string;
  close: string;
  back: string;
  footnote: string;
  cargo: { label: string; sub: string; question: string; draft: string; choices: [Choice, Choice, Choice, Choice] };
  buying: { label: string; sub: string; question: string; draft: string; choices: [Choice, Choice, Choice] };
  track: { label: string; sub: string };
  other: { label: string; sub: string; draft: string };
}

const uz: LeadStrings = {
  title: 'Nima boʻyicha yozasiz?',
  lead: 'Xabaringiz aynan shu ish bilan shugʻullanadigan menejerga tushadi.',
  close: 'Yopish',
  back: 'Orqaga',
  footnote: 'Telegram tayyor xabar bilan ochiladi — yuborishni oʻzingiz bosasiz.',
  cargo: {
    label: 'Yuk olib kelish',
    sub: 'Yigʻma yuk, avia, temir yoʻl, bojxona',
    question: 'Yuk taxminan qancha?',
    draft: 'Assalomu alaykum! Yuk olib kelish boʻyicha yozyapman. Hajmi: {v}.',
    choices: [
      { label: '1 m³ gacha', msg: '1 m³ gacha' },
      { label: '1–5 m³', msg: '1–5 m³' },
      { label: '5 m³ dan koʻp', msg: '5 m³ dan koʻp' },
      { label: 'Hali bilmayman', msg: 'hali bilmayman' },
    ],
  },
  buying: {
    label: 'Tovar topish va sotib olish',
    sub: '1688, Taobao, zavoddan; uskuna va avtomobil',
    question: 'Nima kerak?',
    draft: 'Assalomu alaykum! Tovar sotib olish boʻyicha yozyapman: {v}.',
    choices: [
      { label: 'Havolam bor — sotib olib berish kerak', msg: 'havolam bor, sotib olib berish kerak' },
      { label: 'Tovarni topib berish kerak', msg: 'tovarni topib berish kerak' },
      { label: 'Uskuna yoki avtomobil', msg: 'uskuna yoki avtomobil kerak' },
    ],
  },
  track: { label: 'Yukim qayerda?', sub: 'Har bir qutingiz holati — botda, sutkaning istalgan vaqtida' },
  other: { label: 'Boshqa savol', sub: 'Umumiy menejerga', draft: 'Assalomu alaykum! Savolim bor: ' },
};

const ru: LeadStrings = {
  title: 'По какому вопросу пишете?',
  lead: 'Сообщение попадёт к менеджеру, который занимается именно этим.',
  close: 'Закрыть',
  back: 'Назад',
  footnote: 'Откроется Telegram с готовым сообщением — отправляете вы сами.',
  cargo: {
    label: 'Доставка груза',
    sub: 'Сборный груз, авиа, ж/д, растаможка',
    question: 'Примерный объём?',
    draft: 'Здравствуйте! Пишу по доставке груза. Объём: {v}.',
    choices: [
      { label: 'до 1 м³', msg: 'до 1 м³' },
      { label: '1–5 м³', msg: '1–5 м³' },
      { label: 'больше 5 м³', msg: 'больше 5 м³' },
      { label: 'Пока не знаю', msg: 'пока не знаю' },
    ],
  },
  buying: {
    label: 'Поиск и выкуп товара',
    sub: '1688, Taobao, с фабрики; оборудование и авто',
    question: 'Что нужно?',
    draft: 'Здравствуйте! Пишу по выкупу товара: {v}.',
    choices: [
      { label: 'Есть ссылка — нужно выкупить', msg: 'есть ссылка, нужно выкупить' },
      { label: 'Нужно найти товар', msg: 'нужно найти товар' },
      { label: 'Оборудование или автомобиль', msg: 'нужно оборудование или автомобиль' },
    ],
  },
  track: { label: 'Где мой груз?', sub: 'Статус каждой коробки — в боте, в любое время суток' },
  other: { label: 'Другой вопрос', sub: 'Общему менеджеру', draft: 'Здравствуйте! У меня вопрос: ' },
};

const en: LeadStrings = {
  title: 'What is it about?',
  lead: 'Your message goes to the manager who handles exactly this.',
  close: 'Close',
  back: 'Back',
  footnote: 'Telegram opens with the message ready — you press send.',
  cargo: {
    label: 'Shipping cargo',
    sub: 'Consolidated truck, air, rail, customs',
    question: 'Roughly how much?',
    draft: 'Hello! I’m writing about shipping cargo. Volume: {v}.',
    choices: [
      { label: 'Under 1 m³', msg: 'under 1 m³' },
      { label: '1–5 m³', msg: '1–5 m³' },
      { label: 'Over 5 m³', msg: 'over 5 m³' },
      { label: 'Not sure yet', msg: 'not sure yet' },
    ],
  },
  buying: {
    label: 'Finding and buying goods',
    sub: '1688, Taobao, factories; equipment and cars',
    question: 'What do you need?',
    draft: 'Hello! I’m writing about buying goods: {v}.',
    choices: [
      { label: 'I have a link — buy it for me', msg: 'I have a link and need it bought' },
      { label: 'Find the product for me', msg: 'I need the product found' },
      { label: 'Equipment or a car', msg: 'I need equipment or a car' },
    ],
  },
  track: { label: 'Where is my cargo?', sub: 'Every carton’s status — in the bot, at any hour' },
  other: { label: 'Something else', sub: 'To the general manager', draft: 'Hello! I have a question: ' },
};

export const leadStrings: Record<Lang, LeadStrings> = { uz, ru, en };
