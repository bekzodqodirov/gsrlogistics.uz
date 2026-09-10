import type { Lang } from './config';
import type { IconName } from '@/components/ui/Icon.astro';

/**
 * Home band "Kim bilan ishlaymiz" — the four kinds of business that actually send us cargo,
 * so a shop owner recognises himself in one line, plus the owner's own closing "and any
 * businessman bringing goods from China" (his words, 2026-09-10).
 *
 * SOURCING RULE for this file: every descriptor has to name work the site already documents —
 * 1688/Taobao buying, sourcing the factory, equipment import, FCL/LCL containers. Nothing here
 * may describe a kind of client we have not been told about, promise a volume we have not
 * published, or restrict who may ship with us. The one figure, the minimum billable volume, is
 * templated as {min} and filled from tariffs.json in Segments.astro, so no number is typed here.
 *
 * It also has to avoid saying what the rest of the page already says: "bitta menejer, bitta
 * shartnoma" is the hero's line and stays the hero's line.
 */
export interface SegmentItem {
  icon: IconName;
  name: string;
  text: string;
}
export interface SegmentsStrings {
  eyebrow: string;
  h2: string;
  /** Contains {min} — the minimum billable volume in m³. */
  intro: string;
  listLabel: string;
  items: [SegmentItem, SegmentItem, SegmentItem, SegmentItem];
  /** The owner's own line: shops, importers, manufacturers, distributors "and any businessman". */
  everyone: string;
}

const uz: SegmentsStrings = {
  eyebrow: 'Kim bilan ishlaymiz',
  h2: 'Kimlar bizga yuk topshiradi.',
  intro: 'Hajmi muhim emas — bir necha qutidan konteynergacha. Minimal hisob hajmi {min}\u00A0m³, yuqori chegara yoʻq.',
  listLabel: 'Mijozlar toifalari',
  items: [
    { icon: 'cart', name: 'Doʻkonlar va onlayn savdo', text: 'Siz 1688 yoki Taobaoda tanlaysiz — xarid, qabul va yetkazish bizda.' },
    { icon: 'box', name: 'Importchilar', text: 'Har oy muntazam partiyalar: qabul, tortish, oʻlchash va bojxona — bitta joyda.' },
    { icon: 'factory', name: 'Ishlab chiqaruvchilar', text: 'Dastgoh va ishlab chiqarish liniyalari — zavodini topishdan oʻrnatishgacha.' },
    { icon: 'container', name: 'Distribyutorlar va ulgurji savdo', text: 'Katta partiyalar: butun konteyner (FCL) yoki furadagi ulush (LCL).' },
  ],
  everyone: 'Va Xitoydan tovar olib kelayotgan har qanday tadbirkor.',
};

const ru: SegmentsStrings = {
  eyebrow: 'С кем мы работаем',
  h2: 'Кто передаёт нам груз.',
  intro: 'Объём не важен — от нескольких коробок до контейнера. Минимальный расчётный объём {min}\u00A0м³, верхней границы нет.',
  listLabel: 'Категории клиентов',
  items: [
    { icon: 'cart', name: 'Магазины и онлайн-торговля', text: 'Вы выбираете на 1688 или Taobao — выкуп, приёмка и доставка на нас.' },
    { icon: 'box', name: 'Импортёры', text: 'Регулярные партии каждый месяц: приёмка, взвешивание, обмер и растаможка — в одном месте.' },
    { icon: 'factory', name: 'Производства', text: 'Станки и производственные линии — от поиска завода до монтажа.' },
    { icon: 'container', name: 'Дистрибьюторы и опт', text: 'Крупные партии: целый контейнер (FCL) или доля в фуре (LCL).' },
  ],
  everyone: 'И любой предприниматель, который везёт товар из Китая.',
};

const en: SegmentsStrings = {
  eyebrow: 'Who we work with',
  h2: 'Who hands us their cargo.',
  intro: 'Volume is not the point — from a few cartons to a container. The minimum billable volume is {min}\u00A0m³, and there is no upper limit.',
  listLabel: 'Kinds of client',
  items: [
    { icon: 'cart', name: 'Shops and online sellers', text: 'You pick it on 1688 or Taobao — the buying, the intake and the delivery are ours.' },
    { icon: 'box', name: 'Importers', text: 'Regular shipments every month: intake, weighing, measuring and customs in one place.' },
    { icon: 'factory', name: 'Manufacturers', text: 'Machinery and production lines — from finding the factory to installation.' },
    { icon: 'container', name: 'Distributors and wholesale', text: 'Large lots: a whole container (FCL) or a share of a truck (LCL).' },
  ],
  everyone: 'And any businessman bringing goods in from China.',
};

export const segmentsStrings: Record<Lang, SegmentsStrings> = { uz, ru, en };
