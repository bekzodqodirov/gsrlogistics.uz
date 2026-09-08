import type { Lang } from './config';
import type { PageKey } from './routes';

/** Strings shared by header, footer, mobile bar, breadcrumbs and generic CTAs. */
export interface CommonStrings {
  siteTagline: string;
  nav: Array<{ key: PageKey; label: string }>;
  cta: { telegram: string; call: string; quote: string; calculate: string; track: string; details: string; all: string; back: string; readMore: string; contact: string; sendRequest: string; copy: string; copied: string; };
  footer: { services: string; company: string; contacts: string; guides: string; address: string; hours: string; rights: string; privacy: string; madeWith: string; languages: string; channel: string; group: string; desc: string; };
  header: { menu: string; close: string; langLabel: string; phoneLabel: string };
  breadcrumbHome: string;
  updated: string;
  published: string;
  readingTime: string;
  minutes: string;
  estimate: string;
  telegramDraft: { general: string; quote: string; track: string };
  notFound: { title: string; text: string; home: string };
}

const uz: CommonStrings = {
  siteTagline: 'Xitoydan Oʻzbekistonga yuk tashish, tovar topish va sotib olish',
  nav: [
    { key: 'services', label: 'Xizmatlar' },
    { key: 'pricing', label: 'Narxlar' },
    { key: 'calculator', label: 'Kalkulyator' },
    { key: 'tracking', label: 'Kuzatuv' },
    { key: 'guides', label: 'Qoʻllanma' },
    { key: 'about', label: 'Biz haqimizda' },
    { key: 'contact', label: 'Aloqa' },
  ],
  cta: { telegram: 'Telegramga yozing', call: 'Qoʻngʻiroq qiling', quote: 'Narx soʻrang', calculate: 'Narxni hisoblang', track: 'Yukni kuzating', details: 'Batafsil', all: 'Barchasi', back: 'Orqaga', readMore: 'Oʻqish', contact: 'Bogʻlanish', sendRequest: 'Soʻrov yuboring', copy: 'Nusxa olish', copied: 'Nusxalandi' },
  footer: { services: 'Xizmatlar', company: 'Kompaniya', contacts: 'Aloqa', guides: 'Qoʻllanma', address: 'Manzil', hours: 'Ish vaqti', rights: 'Barcha huquqlar himoyalangan.', privacy: 'Maxfiylik siyosati', madeWith: 'Toshkentda ishlab chiqilgan', languages: 'Til', channel: 'Telegram kanal', group: 'Telegram guruh', desc: 'Xitoydan Oʻzbekistonga yigʻma yuk, avia va temir yoʻl kargo, tovar topish, sotib olish va bojxona rasmiylashtiruvi. 2018-yildan beri.' },
  header: { menu: 'Menyu', close: 'Yopish', langLabel: 'Tilni tanlang', phoneLabel: 'Telefon' },
  breadcrumbHome: 'Bosh sahifa',
  updated: 'Yangilangan',
  published: 'Chop etilgan',
  readingTime: 'Oʻqish vaqti',
  minutes: 'daqiqa',
  estimate: 'Taxminiy narx',
  telegramDraft: {
    general: 'Assalomu alaykum! Xitoydan yuk olib kelish boʻyicha maslahat kerak edi.',
    quote: 'Assalomu alaykum! Yuk uchun narx bilmoqchi edim: ',
    track: 'Assalomu alaykum! Yuk kodi: ',
  },
  notFound: { title: 'Sahifa topilmadi', text: 'Bu manzil mavjud emas yoki koʻchirilgan. Bosh sahifaga qayting yoki Telegramda yozing.', home: 'Bosh sahifaga' },
};

const ru: CommonStrings = {
  siteTagline: 'Доставка грузов из Китая в Узбекистан, поиск и выкуп товаров',
  nav: [
    { key: 'services', label: 'Услуги' },
    { key: 'pricing', label: 'Цены' },
    { key: 'calculator', label: 'Калькулятор' },
    { key: 'tracking', label: 'Отслеживание' },
    { key: 'guides', label: 'Гид' },
    { key: 'about', label: 'О компании' },
    { key: 'contact', label: 'Контакты' },
  ],
  cta: { telegram: 'Написать в Telegram', call: 'Позвонить', quote: 'Узнать цену', calculate: 'Рассчитать стоимость', track: 'Отследить груз', details: 'Подробнее', all: 'Все', back: 'Назад', readMore: 'Читать', contact: 'Связаться', sendRequest: 'Отправить запрос', copy: 'Скопировать', copied: 'Скопировано' },
  footer: { services: 'Услуги', company: 'Компания', contacts: 'Контакты', guides: 'Гид', address: 'Адрес', hours: 'Часы работы', rights: 'Все права защищены.', privacy: 'Политика конфиденциальности', madeWith: 'Сделано в Ташкенте', languages: 'Язык', channel: 'Telegram-канал', group: 'Telegram-группа', desc: 'Сборные грузы, авиа и ж/д карго из Китая в Узбекистан, поиск и выкуп товаров, таможенное оформление. С 2018 года.' },
  header: { menu: 'Меню', close: 'Закрыть', langLabel: 'Выбор языка', phoneLabel: 'Телефон' },
  breadcrumbHome: 'Главная',
  updated: 'Обновлено',
  published: 'Опубликовано',
  readingTime: 'Время чтения',
  minutes: 'мин',
  estimate: 'Ориентировочная цена',
  telegramDraft: {
    general: 'Здравствуйте! Нужна консультация по доставке груза из Китая.',
    quote: 'Здравствуйте! Хочу узнать стоимость доставки: ',
    track: 'Здравствуйте! Код груза: ',
  },
  notFound: { title: 'Страница не найдена', text: 'Такого адреса нет или он был перемещён. Вернитесь на главную или напишите нам в Telegram.', home: 'На главную' },
};

const en: CommonStrings = {
  siteTagline: 'Cargo from China to Uzbekistan, product sourcing and buying',
  nav: [
    { key: 'services', label: 'Services' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'calculator', label: 'Calculator' },
    { key: 'tracking', label: 'Tracking' },
    { key: 'guides', label: 'Guides' },
    { key: 'about', label: 'About' },
    { key: 'contact', label: 'Contact' },
  ],
  cta: { telegram: 'Message on Telegram', call: 'Call us', quote: 'Get a quote', calculate: 'Estimate the cost', track: 'Track cargo', details: 'Learn more', all: 'All', back: 'Back', readMore: 'Read', contact: 'Contact us', sendRequest: 'Send request', copy: 'Copy', copied: 'Copied' },
  footer: { services: 'Services', company: 'Company', contacts: 'Contacts', guides: 'Guides', address: 'Address', hours: 'Hours', rights: 'All rights reserved.', privacy: 'Privacy policy', madeWith: 'Made in Tashkent', languages: 'Language', channel: 'Telegram channel', group: 'Telegram group', desc: 'Consolidated truck, air and rail cargo from China to Uzbekistan, product sourcing and buying, customs clearance. Since 2018.' },
  header: { menu: 'Menu', close: 'Close', langLabel: 'Choose language', phoneLabel: 'Phone' },
  breadcrumbHome: 'Home',
  updated: 'Updated',
  published: 'Published',
  readingTime: 'Reading time',
  minutes: 'min',
  estimate: 'Estimated price',
  telegramDraft: {
    general: 'Hello! I need advice on shipping cargo from China to Uzbekistan.',
    quote: 'Hello! I would like a shipping quote: ',
    track: 'Hello! Cargo code: ',
  },
  notFound: { title: 'Page not found', text: 'This address does not exist or has moved. Go back home or message us on Telegram.', home: 'Back home' },
};

export const common: Record<Lang, CommonStrings> = { uz, ru, en };
