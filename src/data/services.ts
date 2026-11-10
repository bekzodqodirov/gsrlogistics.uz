import type { Lang, Locale, Localized } from '@/i18n/config';
import type { IconName } from '@/components/ui/Icon.astro';

/**
 * Service registry — the ORDER here is the display order everywhere.
 * Long-form page content lives in src/data/services/<key>.ts (owned by the content agents);
 * this file holds only routing + short labels used by header/footer/cards.
 */
export type ServiceKey = 'truck' | 'air' | 'rail' | 'sourcing' | 'buying' | 'equipment' | 'customs' | 'warehouse' | 'cars';
export interface ServiceMeta {
  key: ServiceKey;
  /** Item slugs; zh and fa use the English slug, written out (a slug is permanent, never computed). */
  slug: Record<Lang, string>;
  name: Localized<string>;
  short: Localized<string>;
  icon: IconName;
  flagship?: boolean;
}
export const services: ServiceMeta[] = [
  { key: 'truck', flagship: true, icon: 'truck', slug: { uz: 'avto-kargo', ru: 'avto-kargo', en: 'truck-cargo', zh: 'truck-cargo', fa: 'truck-cargo' },
    name: { uz: 'Avto kargo (yigʻma yuk)', ru: 'Авто карго (сборный груз)', en: 'Truck cargo (consolidated)', zh: '汽运（拼货）', fa: 'حمل زمینی (بار تجمیعی)' },
    short: { uz: 'Xitoydan Toshkentga yigʻma yuk — m³ hisobida, stavka zichlikka qarab.', ru: 'Сборный груз из Китая в Ташкент — по м³, ставка по плотности.', en: 'Consolidated cargo from China to Tashkent, priced per m³ by density.', zh: '中国至塔什干拼货运输，按 m³ 计费，费率取决于密度。', fa: 'بار تجمیعی از چین به تاشکند — قیمت بر اساس متر مکعب، نرخ بر حسب چگالی.' } },
  { key: 'air', icon: 'plane', slug: { uz: 'avia-kargo', ru: 'avia-kargo', en: 'air-cargo', zh: 'air-cargo', fa: 'air-cargo' },
    name: { uz: 'Avia kargo', ru: 'Авиа карго', en: 'Air cargo', zh: '空运', fa: 'حمل هوایی' },
    short: { uz: 'Shoshilinch va qimmat yuklar uchun tez yetkazib berish.', ru: 'Быстрая доставка срочных и ценных грузов.', en: 'Fast delivery for urgent and high-value goods.', zh: '急件和高货值货物的快速运输。', fa: 'تحویل سریع برای کالاهای فوری و باارزش.' } },
  { key: 'rail', icon: 'train', slug: { uz: 'temir-yol-konteyner', ru: 'zhd-konteyner', en: 'rail-container', zh: 'rail-container', fa: 'rail-container' },
    name: { uz: 'Temir yoʻl va konteyner', ru: 'Ж/д и контейнеры', en: 'Rail & containers', zh: '铁路与集装箱运输', fa: 'حمل ریلی و کانتینری' },
    short: { uz: 'Faqat butun konteyner: 20 va 40 fut (20GP, 40HQ va boshqalar) — katta partiyalar uchun.', ru: 'Только целый контейнер: 20 и 40 футов (20GP, 40HQ и другие) — для крупных партий.', en: 'Full containers only: 20 and 40 ft (20GP, 40HQ and others), for large shipments.', zh: '仅限整柜：20 英尺和 40 英尺（20GP、40HQ 及其他），适合大批量货物。', fa: 'فقط کانتینر کامل: ۲۰ و ۴۰ فوت (20GP، 40HQ و انواع دیگر) — برای محموله‌های بزرگ.' } },
  { key: 'sourcing', icon: 'search', slug: { uz: 'tovar-topish', ru: 'poisk-tovarov', en: 'sourcing', zh: 'sourcing', fa: 'sourcing' },
    name: { uz: 'Tovar va ishlab chiqaruvchi topish', ru: 'Поиск товаров и производителей', en: 'Product & supplier sourcing', zh: '寻找货源和生产厂家', fa: 'یافتن کالا و تأمین‌کننده' },
    short: { uz: 'Kerakli tovarni zavoddan topamiz, namunani tekshiramiz, narxni kelishamiz.', ru: 'Найдём товар на фабрике, проверим образец, договоримся о цене.', en: 'We find the product at the factory, check samples and negotiate the price.', zh: '我们在工厂找到所需商品，检验样品，洽谈价格。', fa: 'کالای مورد نیاز را در کارخانه پیدا می‌کنیم، نمونه را بررسی می‌کنیم و دربارهٔ قیمت توافق می‌کنیم.' } },
  { key: 'buying', icon: 'cart', slug: { uz: 'sotib-olish', ru: 'vykup-tovarov', en: 'buying-agent', zh: 'buying-agent', fa: 'buying-agent' },
    name: { uz: '1688 va Taobaodan sotib olish', ru: 'Выкуп с 1688 и Taobao', en: 'Buying from 1688 & Taobao', zh: '1688 和淘宝代采购', fa: 'خرید از 1688 و تائوبائو' },
    short: { uz: 'Siz tanlaysiz — biz sotib olamiz, yuanda toʻlaymiz va Toshkentga keltiramiz.', ru: 'Вы выбираете — мы выкупаем, платим в юанях и привозим в Ташкент.', en: 'You choose, we buy, pay in yuan and deliver to Tashkent.', zh: '您来挑选，我们代为购买、用人民币付款并运至塔什干。', fa: 'شما انتخاب می‌کنید — ما می‌خریم، به یوان پرداخت می‌کنیم و به تاشکند می‌آوریم.' } },
  { key: 'equipment', icon: 'factory', slug: { uz: 'uskunalar-importi', ru: 'import-oborudovaniya', en: 'equipment-import', zh: 'equipment-import', fa: 'equipment-import' },
    name: { uz: 'Uskunalar importi', ru: 'Импорт оборудования', en: 'Equipment import', zh: '设备进口', fa: 'واردات تجهیزات و ماشین‌آلات' },
    short: { uz: 'Dastgoh va ishlab chiqarish liniyalari — qidiruvdan oʻrnatishgacha.', ru: 'Станки и производственные линии — от поиска до монтажа.', en: 'Machinery and production lines, from search to installation.', zh: '机床和生产线——从寻找到安装。', fa: 'ماشین‌آلات و خطوط تولید — از جست‌وجو تا نصب.' } },
  { key: 'customs', icon: 'stamp', slug: { uz: 'bojxona', ru: 'tamozhnya', en: 'customs', zh: 'customs', fa: 'customs' },
    name: { uz: 'Bojxona rasmiylashtiruvi', ru: 'Таможенное оформление', en: 'Customs clearance', zh: '清关', fa: 'ترخیص گمرکی' },
    short: { uz: 'Hujjatlar, deklaratsiya, boj va QQS hisob-kitobi — hammasi bizning zimmamizda.', ru: 'Документы, декларация, расчёт пошлин и НДС — всё берём на себя.', en: 'Documents, declaration, duty and VAT calculation handled for you.', zh: '单证、申报、关税和增值税计算——全部由我们负责。', fa: 'اسناد، اظهارنامه، محاسبهٔ حقوق گمرکی و مالیات بر ارزش افزوده — همه بر عهدهٔ ما.' } },
  { key: 'warehouse', icon: 'warehouse', slug: { uz: 'ombor-sifat-nazorati', ru: 'sklad-proverka', en: 'warehouse-quality-control', zh: 'warehouse-quality-control', fa: 'warehouse-quality-control' },
    name: { uz: 'Xitoyda ombor va sifat nazorati', ru: 'Склад в Китае и проверка качества', en: 'China warehouse & quality control', zh: '中国仓储与质检', fa: 'انبار در چین و کنترل کیفیت' },
    short: { uz: 'Qabul, tekshiruv, foto-hisobot, qadoqlash va sugʻurta — Xitoyning oʻzida.', ru: 'Приёмка, проверка, фотоотчёт, упаковка и страховка — ещё в Китае.', en: 'Receiving, inspection, photo report, packing and insurance in China.', zh: '收货、验货、照片报告、包装和保险——在中国就地完成。', fa: 'دریافت بار، بازرسی، گزارش تصویری، بسته‌بندی و بیمه — در خود چین.' } },
  { key: 'cars', icon: 'car', slug: { uz: 'avtomobil-importi', ru: 'avto-iz-kitaya', en: 'car-import', zh: 'car-import', fa: 'car-import' },
    name: { uz: 'Avtomobil va elektromobil', ru: 'Авто и электромобили', en: 'Cars & EVs from China', zh: '汽车和电动车进口', fa: 'خودرو و خودروی برقی از چین' },
    short: { uz: 'Xitoydan avtomobil va elektromobillarni buyurtma asosida olib kelamiz.', ru: 'Привозим автомобили и электромобили из Китая под заказ.', en: 'Cars and electric vehicles from China, made to order.', zh: '按订单从中国进口汽车和电动车。', fa: 'خودرو و خودروی برقی را بر اساس سفارش از چین می‌آوریم.' } },
];
export const serviceByKey = (key: ServiceKey) => services.find((s) => s.key === key)!;
export const serviceBySlug = (lang: Lang, slug: string) => services.find((s) => s.slug[lang] === slug);
/**
 * Per-locale slugs of one service, for hreflang alternates and the canonical. Every hand-written
 * locale is listed (uzc is derived from `uz` by `subFor`): a locale left out here would drop out of
 * the page's hreflang and canonicalise its service page to the services index.
 */
export const serviceSubs = (s: ServiceMeta): Partial<Record<Locale, string>> => ({ ...s.slug });
