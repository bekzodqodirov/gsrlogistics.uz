import type { Lang } from './config';

export interface GuidesStrings {
  seoTitle: string; seoDescription: string; eyebrow: string; h1: string; intro: string;
  readMore: string; minutes: string; toc: string; sources: string; faq: string; related: string; relatedServices: string;
  askTitle: string; askText: string; author: string; updated: string; published: string; allGuides: string; tags: string;
  /** Localized names for the frontmatter tag keys (guide cards). Keys missing here are not shown. */
  tagLabels: Record<string, string>;
}
const uz: GuidesStrings = {
  seoTitle: 'Qoʻllanma: Xitoydan yuk olib kelish, kargo narxlari, bojxona, 1688 — GSR Logistics',
  seoDescription: 'Xitoydan Oʻzbekistonga yuk olib kelish boʻyicha amaliy qoʻllanmalar: kargo narxi qanday hisoblanadi, avia/avto/temir yoʻl taqqoslash, 1688 orqali buyurtma, 2026-yil bojxona toʻlovlari, ishlab chiqaruvchi topish, Ivu va Guanchjou bozorlari, taqiqlangan tovarlar, lugʻat, yoʻnalishlar.',
  eyebrow: 'Qoʻllanma', h1: 'Xitoydan yuk olib kelish: qoʻllanmalar',
  intro: 'Bu yerda Xitoydan Oʻzbekistonga yuk olib kelishning har bir bosqichi raqamlar bilan tushuntirilgan: narx qanday hisoblanadi, qaysi yoʻnalish qachon mos, bojxonada nima boʻladi, 1688ʼdan qanday buyurtma beriladi. Maqolalar 2026-yil sentabr holatiga yangilangan.',
  readMore: 'Oʻqish', minutes: 'daqiqa', toc: 'Mundarija', sources: 'Manbalar', faq: 'Koʻp beriladigan savollar', related: 'Oʻxshash maqolalar', relatedServices: 'Bogʻliq xizmatlar',
  askTitle: 'Savolingiz qoldimi?', askText: 'Telegramda yozing — menejer sizning yukingiz boʻyicha aniq javob beradi.', author: 'Muallif', updated: 'Yangilangan', published: 'Chop etilgan', allGuides: 'Barcha qoʻllanmalar', tags: 'Mavzular',
  tagLabels: { truck: 'Avto kargo', air: 'Avia', rail: 'Temir yoʻl', customs: 'Bojxona', warehouse: 'Ombor', sourcing: 'Tovar topish', buying: 'Xarid', suppliers: 'Yetkazib beruvchilar', import: 'Import', '1688': '1688', glossary: 'Lugʻat', lugat: 'Lugʻat', slovar: 'Lugʻat', routes: 'Yoʻnalishlar', yonalishlar: 'Yoʻnalishlar', marshruty: 'Yoʻnalishlar', taqqoslash: 'Taqqoslash', bozorlar: 'Bozorlar' },
};
const ru: GuidesStrings = {
  seoTitle: 'Гид: доставка из Китая, цены на карго, таможня, 1688 — GSR Logistics',
  seoDescription: 'Практические гиды по доставке грузов из Китая в Узбекистан: как считается стоимость карго, авиа/авто/ж/д, заказ с 1688, таможенные платежи 2026, поиск поставщика, рынки Иу и Гуанчжоу, запрещённые товары, словарь, маршруты.',
  eyebrow: 'Гид', h1: 'Доставка из Китая: гиды',
  intro: 'Здесь каждый этап доставки из Китая в Узбекистан объяснён с цифрами: как считается цена, какой способ когда подходит, что происходит на таможне, как заказать с 1688. Статьи обновлены по состоянию на сентябрь 2026 года.',
  readMore: 'Читать', minutes: 'мин', toc: 'Содержание', sources: 'Источники', faq: 'Частые вопросы', related: 'Похожие статьи', relatedServices: 'Связанные услуги',
  askTitle: 'Остался вопрос?', askText: 'Напишите в Telegram — менеджер ответит точно по вашему грузу.', author: 'Автор', updated: 'Обновлено', published: 'Опубликовано', allGuides: 'Все гиды', tags: 'Темы',
  tagLabels: { truck: 'Авто', air: 'Авиа', rail: 'Ж/д', customs: 'Таможня', warehouse: 'Склад', sourcing: 'Поиск товаров', buying: 'Выкуп', suppliers: 'Поставщики', import: 'Импорт', '1688': '1688', glossary: 'Словарь', lugat: 'Словарь', slovar: 'Словарь', routes: 'Маршруты', yonalishlar: 'Маршруты', marshruty: 'Маршруты', taqqoslash: 'Сравнение', bozorlar: 'Рынки' },
};
const en: GuidesStrings = {
  seoTitle: 'Guides: shipping from China, cargo prices, customs, 1688 — GSR Logistics',
  seoDescription: 'Practical guides on shipping from China to Uzbekistan: how cargo prices are calculated, air vs truck vs rail, ordering from 1688, customs duties 2026, finding a supplier, Yiwu and Guangzhou markets, prohibited goods, glossary, routes.',
  eyebrow: 'Guides', h1: 'Shipping from China: guides',
  intro: 'Every stage of shipping from China to Uzbekistan explained with numbers: how the price is calculated, which mode fits when, what happens at customs, how to order from 1688. Updated as of September 2026.',
  readMore: 'Read', minutes: 'min', toc: 'Contents', sources: 'Sources', faq: 'Frequently asked questions', related: 'Related guides', relatedServices: 'Related services',
  askTitle: 'Still have a question?', askText: 'Message us on Telegram — a manager answers for your specific cargo.', author: 'Author', updated: 'Updated', published: 'Published', allGuides: 'All guides', tags: 'Topics',
  tagLabels: { truck: 'Truck', air: 'Air', rail: 'Rail', customs: 'Customs', warehouse: 'Warehouse', sourcing: 'Sourcing', buying: 'Buying', suppliers: 'Suppliers', import: 'Import', '1688': '1688', glossary: 'Glossary', lugat: 'Glossary', slovar: 'Glossary', routes: 'Routes', yonalishlar: 'Routes', marshruty: 'Routes', taqqoslash: 'Comparison', bozorlar: 'Markets' },
};
export const guidesStrings: Record<Lang, GuidesStrings> = { uz, ru, en };
