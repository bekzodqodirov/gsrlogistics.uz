import type { Localized } from './config';
import { zh } from './zh/works';
import { fa } from './fa/works';

/**
 * "Ishlarimizdan lavhalar" — the strings around the video and photo blocks: the `works` page
 * (/ishlarimiz/) and its home-page section. The blocks' own titles and texts are not here: each
 * block carries them in its folder (src/content/works/<block>/index.md).
 *
 * The home section's heading is the proverb each language has for "seeing beats hearing" — uz «Ming
 * eshitgandan bir koʻrgan afzal», ru «Лучше один раз увидеть», en "Seeing is believing", zh 百闻不如一见,
 * fa «شنیدن کی بود مانند دیدن» — so the translations are each language's own saying, not a rendering.
 */
export interface WorksStrings {
  seoTitle: string;
  seoDescription: string;
  /** The page's short name: the footer link and the breadcrumb. */
  navLabel: string;
  eyebrow: string;
  h1: string;
  intro: string;
  /** Shown on the page while no block is published. */
  empty: string;
  /** Media words on a block's date line: "2026-yil 11-noyabr · Video · 0:40". */
  video: string;
  photos: string;
  /** The accessible name of a video whose block has no title in this language. {date}: the block's date. */
  videoLabel: string;
  /** The alt of a photo with no alt and no block title in this language. {n}: its number; {date}: the block's date. */
  photoLabel: string;
  /** The name of a block's photos as a whole (structured data) when the block has no title in this language. {date}: the block's date. */
  photosLabel: string;
  home: {
    eyebrow: string;
    h2: string;
    intro: string;
    /** The link to the page. */
    all: string;
  };
}

const uz: WorksStrings = {
  seoTitle: 'Ishlarimizdan lavhalar: video va suratlar',
  seoDescription: 'GSR Logistics ishidan video va suratlar: Xitoyda yukni qabul qilish, bitta furaga jamlash, Xorgos va Qozogʻiston orqali Toshkentga yoʻl, bojxona va hujjatlar.',
  navLabel: 'Ishlarimiz',
  eyebrow: 'Ishlarimiz',
  h1: 'Ishlarimizdan lavhalar',
  intro: 'Bajarilayotgan ishlarimizdan video va suratlar — Xitoydagi qabuldan Toshkentgacha. Yangi lavhalarni shu yerga qoʻshib boramiz.',
  empty: 'Hozircha bu yerda lavha yoʻq.',
  video: 'Video',
  photos: 'Suratlar',
  videoLabel: 'Ishimizdan video, {date}',
  photoLabel: 'Ishimizdan surat {n}, {date}',
  photosLabel: 'Ishimizdan suratlar, {date}',
  home: {
    eyebrow: 'Ishlarimizdan lavhalar',
    h2: 'Ming eshitgandan bir koʻrgan afzal.',
    intro: 'Bajarilayotgan ishlardan video va suratlar. Yangilarini shu yerga qoʻshib boramiz.',
    all: 'Barcha lavhalar',
  },
};

const ru: WorksStrings = {
  seoTitle: 'Наша работа в кадрах: видео и фото',
  seoDescription: 'Видео и фото из работы GSR Logistics: приёмка груза в Китае, консолидация в одну фуру, путь через Хоргос и Казахстан в Ташкент, таможня и документы.',
  navLabel: 'Наши работы',
  eyebrow: 'Наши работы',
  h1: 'Наша работа в кадрах',
  intro: 'Видео и фото нашей текущей работы — от приёмки в Китае до Ташкента. Новые кадры добавляем сюда по мере появления.',
  empty: 'Здесь пока ничего нет.',
  video: 'Видео',
  photos: 'Фото',
  videoLabel: 'Видео из нашей работы, {date}',
  photoLabel: 'Фото {n} из нашей работы, {date}',
  photosLabel: 'Фото из нашей работы, {date}',
  home: {
    eyebrow: 'Наша работа в кадрах',
    h2: 'Лучше один раз увидеть.',
    intro: 'Видео и фото текущей работы. Новые добавляем сюда по мере появления.',
    all: 'Все видео и фото',
  },
};

const en: WorksStrings = {
  seoTitle: 'Our work in pictures: videos and photos',
  seoDescription: 'GSR Logistics on video and in photos: receiving in China, consolidation into one truck, the road via Khorgos and Kazakhstan to Tashkent, customs and documents.',
  navLabel: 'Our work',
  eyebrow: 'Our work',
  h1: 'Our work in pictures',
  intro: 'Videos and photos of our work in progress, from receiving in China to Tashkent. We add new ones here as they come.',
  empty: 'Nothing here yet.',
  video: 'Video',
  photos: 'Photos',
  videoLabel: 'Video from our work, {date}',
  photoLabel: 'Photo {n} from our work, {date}',
  photosLabel: 'Photos from our work, {date}',
  home: {
    eyebrow: 'Our work in pictures',
    h2: 'Seeing is believing.',
    intro: 'Videos and photos of the work as it happens. We add new ones here as they come.',
    all: 'All videos and photos',
  },
};

export const worksStrings: Localized<WorksStrings> = { uz, ru, en, zh, fa };
