import type { Lang } from '@/i18n/config';
import type { IconName } from '@/components/ui/Icon.astro';

/**
 * Service registry — the ORDER here is the display order everywhere.
 * Long-form page content lives in src/data/services/<key>.ts (owned by the content agents);
 * this file holds only routing + short labels used by header/footer/cards.
 */
export type ServiceKey = 'truck' | 'air' | 'rail' | 'sourcing' | 'buying' | 'equipment' | 'customs' | 'warehouse' | 'cars';
export interface ServiceMeta {
  key: ServiceKey;
  slug: Record<Lang, string>;
  name: Record<Lang, string>;
  short: Record<Lang, string>;
  icon: IconName;
  flagship?: boolean;
}
export const services: ServiceMeta[] = [
  { key: 'truck', flagship: true, icon: 'truck', slug: { uz: 'avto-kargo', ru: 'avto-kargo', en: 'truck-cargo' },
    name: { uz: 'Avto kargo (yigʻma yuk)', ru: 'Авто карго (сборный груз)', en: 'Truck cargo (consolidated)' },
    short: { uz: 'Xitoydan Toshkentga yigʻma yuk — m³ hisobida, stavka zichlikka qarab.', ru: 'Сборный груз из Китая в Ташкент — по м³, ставка по плотности.', en: 'Consolidated cargo from China to Tashkent, priced per m³ by density.' } },
  { key: 'air', icon: 'plane', slug: { uz: 'avia-kargo', ru: 'avia-kargo', en: 'air-cargo' },
    name: { uz: 'Avia kargo', ru: 'Авиа карго', en: 'Air cargo' },
    short: { uz: 'Shoshilinch va qimmat yuklar uchun tez yetkazib berish.', ru: 'Быстрая доставка срочных и ценных грузов.', en: 'Fast delivery for urgent and high-value goods.' } },
  { key: 'rail', icon: 'train', slug: { uz: 'temir-yol-konteyner', ru: 'zhd-konteyner', en: 'rail-container' },
    name: { uz: 'Temir yoʻl va konteyner', ru: 'Ж/д и контейнеры', en: 'Rail & containers' },
    short: { uz: '20 va 40 futlik konteynerlar, FCL va LCL — katta partiyalar uchun.', ru: 'Контейнеры 20 и 40 футов, FCL и LCL — для крупных партий.', en: '20ft and 40ft containers, FCL and LCL for large shipments.' } },
  { key: 'sourcing', icon: 'search', slug: { uz: 'tovar-topish', ru: 'poisk-tovarov', en: 'sourcing' },
    name: { uz: 'Tovar va ishlab chiqaruvchi topish', ru: 'Поиск товаров и производителей', en: 'Product & supplier sourcing' },
    short: { uz: 'Kerakli tovarni zavoddan topamiz, namunani tekshiramiz, narxni kelishamiz.', ru: 'Найдём товар на фабрике, проверим образец, договоримся о цене.', en: 'We find the product at the factory, check samples and negotiate the price.' } },
  { key: 'buying', icon: 'cart', slug: { uz: 'sotib-olish', ru: 'vykup-tovarov', en: 'buying-agent' },
    name: { uz: '1688 va Taobaodan sotib olish', ru: 'Выкуп с 1688 и Taobao', en: 'Buying from 1688 & Taobao' },
    short: { uz: 'Siz tanlaysiz — biz sotib olamiz, yuanda toʻlaymiz va Toshkentga keltiramiz.', ru: 'Вы выбираете — мы выкупаем, платим в юанях и привозим в Ташкент.', en: 'You choose, we buy, pay in yuan and deliver to Tashkent.' } },
  { key: 'equipment', icon: 'factory', slug: { uz: 'uskunalar-importi', ru: 'import-oborudovaniya', en: 'equipment-import' },
    name: { uz: 'Uskunalar importi', ru: 'Импорт оборудования', en: 'Equipment import' },
    short: { uz: 'Dastgoh va ishlab chiqarish liniyalari — qidiruvdan oʻrnatishgacha.', ru: 'Станки и производственные линии — от поиска до монтажа.', en: 'Machinery and production lines, from search to installation.' } },
  { key: 'customs', icon: 'stamp', slug: { uz: 'bojxona', ru: 'tamozhnya', en: 'customs' },
    name: { uz: 'Bojxona rasmiylashtiruvi', ru: 'Таможенное оформление', en: 'Customs clearance' },
    short: { uz: 'Hujjatlar, deklaratsiya, boj va QQS hisob-kitobi — hammasi bizning zimmamizda.', ru: 'Документы, декларация, расчёт пошлин и НДС — всё берём на себя.', en: 'Documents, declaration, duty and VAT calculation handled for you.' } },
  { key: 'warehouse', icon: 'warehouse', slug: { uz: 'ombor-sifat-nazorati', ru: 'sklad-proverka', en: 'warehouse-quality-control' },
    name: { uz: 'Xitoyda ombor va sifat nazorati', ru: 'Склад в Китае и проверка качества', en: 'China warehouse & quality control' },
    short: { uz: 'Qabul, tekshiruv, foto-hisobot, qadoqlash va sugʻurta — Xitoyning oʻzida.', ru: 'Приёмка, проверка, фотоотчёт, упаковка и страховка — ещё в Китае.', en: 'Receiving, inspection, photo report, packing and insurance in China.' } },
  { key: 'cars', icon: 'car', slug: { uz: 'avtomobil-importi', ru: 'avto-iz-kitaya', en: 'car-import' },
    name: { uz: 'Avtomobil va elektromobil', ru: 'Авто и электромобили', en: 'Cars & EVs from China' },
    short: { uz: 'Xitoydan avtomobil va elektromobillarni buyurtma asosida olib kelamiz.', ru: 'Привозим автомобили и электромобили из Китая под заказ.', en: 'Cars and electric vehicles from China, made to order.' } },
];
export const serviceByKey = (key: ServiceKey) => services.find((s) => s.key === key)!;
export const serviceBySlug = (lang: Lang, slug: string) => services.find((s) => s.slug[lang] === slug);
/** Per-locale slugs of one service, for hreflang alternates. */
export const serviceSubs = (s: ServiceMeta): Record<Lang, string> => ({ uz: s.slug.uz, ru: s.slug.ru, en: s.slug.en });
