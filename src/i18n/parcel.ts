import type { Lang } from './config';

/**
 * Strings for the home "one carton, six stages" diagram (`components/process/ParcelFlow.astro`).
 *
 * The six stage NAMES are deliberately NOT here: they are read from `tracking[lang].stages[k].short`
 * through `STAGE_KEYS`, so the word under each dot is the exact word the manager sends on Telegram
 * and the exact word the tracking page prints.
 *
 * `{rate}`, `{truckDays}`, `{airDays}` and `{railDays}` are replaced in the component's frontmatter
 * from `src/data/tariffs.json`. Never write a price or a transit range as a literal in this file.
 */

export interface ParcelStep {
  /** One sentence: what happens to the customer's own carton at this stage. */
  text: string;
  /** Two or three short chips. Kept to one line each — they are `white-space: nowrap`. */
  facts: string[];
}

/** Six steps, in `STAGE_KEYS` order. The tuple length is what keeps the three languages parallel. */
export type ParcelSteps = [ParcelStep, ParcelStep, ParcelStep, ParcelStep, ParcelStep, ParcelStep];

export interface ParcelStrings {
  title: string;
  hint: string;
  /** Accessible name of the radio group. It picks a picture; the six texts are always readable. */
  pickerLabel: string;
  note: string;
  trackLink: string;
  steps: ParcelSteps;
}

const uz: ParcelStrings = {
  title: 'Bitta quti — oltita bosqich.',
  hint: 'Bosqichni tanlang: qutingizga nima boʻlishini koʻrasiz.',
  pickerLabel: 'Bosqich rasmini tanlash',
  note: 'Har bir qutida — sizning GS kodingiz.',
  trackLink: 'GS kodi bilan kuzatish',
  steps: [
    {
      text: 'Qutilaringiz qabul manziliga keladi: tortiladi, oʻlchanadi, suratga olinadi.',
      facts: ['Ivu · Guanchjou · Qashqar', 'kg va m³', 'foto-hisobot'],
    },
    {
      text: 'Qutingiz boshqa mijozlar yuki bilan bitta furaga joylanadi.',
      facts: ['butun fura shart emas', '{rate}/m³ dan'],
    },
    {
      text: 'Fura yoʻlga chiqadi. Turini siz tanlaysiz: avto, avia yoki temir yoʻl.',
      facts: ['avto {truckDays} kun', 'avia {airDays}', 'temir yoʻl {railDays}'],
    },
    {
      text: 'Ikki chegara: Xorgos, keyin Yallama yoki Gʻishtkoʻprik.',
      facts: ['Xorgos — Xitoy/Qozogʻiston', 'deklaratsiya, boj, QQS'],
    },
    {
      text: 'Quti Toshkent omboriga tushadi — menejer sizga xabar beradi.',
      facts: ['Toshkent ombori', 'bojxona rasmiylashtiruvi bizda'],
    },
    {
      text: 'Qutini oʻzingiz olasiz yoki viloyatingizga joʻnatamiz.',
      facts: ['olib ketish', 'viloyatga joʻnatish', 'hisob-faktura'],
    },
  ],
};

const ru: ParcelStrings = {
  title: 'Одна коробка — шесть этапов.',
  hint: 'Выберите этап: увидите, что происходит с вашей коробкой.',
  pickerLabel: 'Выбрать картинку этапа',
  note: 'На каждой коробке — ваш GS-код.',
  trackLink: 'Отследить по GS-коду',
  steps: [
    {
      text: 'Ваши коробки приходят на адрес приёма: их взвешивают, обмеряют и фотографируют.',
      facts: ['Иу · Гуанчжоу · Кашгар', 'кг и м³', 'фотоотчёт'],
    },
    {
      text: 'Ваша коробка едет в одной фуре с грузами других клиентов.',
      facts: ['целая фура не нужна', 'от {rate}/м³'],
    },
    {
      text: 'Фура выходит в путь. Способ вы выбираете сами: авто, авиа или ж/д.',
      facts: ['авто {truckDays} дней', 'авиа {airDays}', 'ж/д {railDays}'],
    },
    {
      text: 'Две границы: Хоргос, затем Яллама или Гишткуприк.',
      facts: ['Хоргос — Китай/Казахстан', 'декларация, пошлина, НДС'],
    },
    {
      text: 'Коробка приходит на склад в Ташкенте — менеджер сообщает вам.',
      facts: ['склад в Ташкенте', 'оформление — на нас'],
    },
    {
      text: 'Забираете коробку сами или отправляем её в ваш регион.',
      facts: ['самовывоз', 'отправка в регион', 'счёт-фактура'],
    },
  ],
};

const en: ParcelStrings = {
  title: 'One carton, six stages.',
  hint: 'Pick a stage: see what happens to your carton.',
  pickerLabel: 'Choose a stage picture',
  note: 'Every carton carries your GS code.',
  trackLink: 'Track with your GS code',
  steps: [
    {
      text: 'Your cartons reach the receiving address: weighed, measured, photographed.',
      facts: ['Yiwu · Guangzhou · Kashgar', 'kg and m³', 'photo report'],
    },
    {
      text: 'Your carton shares one truck with other clients’ cargo.',
      facts: ['no whole truck needed', 'from {rate}/m³'],
    },
    {
      text: 'The truck sets off. You choose the mode: truck, air or rail.',
      facts: ['truck {truckDays} days', 'air {airDays}', 'rail {railDays}'],
    },
    {
      text: 'Two borders: Khorgos, then Yallama or Gishtkuprik.',
      facts: ['Khorgos — China/Kazakhstan', 'declaration, duty, VAT'],
    },
    {
      text: 'The carton reaches the Tashkent warehouse — your manager tells you.',
      facts: ['Tashkent warehouse', 'we clear customs'],
    },
    {
      text: 'Collect the carton yourself, or we forward it to your region.',
      facts: ['pick-up', 'forwarding', 'invoice'],
    },
  ],
};

export const parcel: Record<Lang, ParcelStrings> = { uz, ru, en };
