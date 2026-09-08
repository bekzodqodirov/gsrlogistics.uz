import type { Lang } from '@/i18n/config';

/** Registry of guide translationKeys → per-locale slugs (must match frontmatter of src/content/guides/<lang>/<slug>.md). */
export const guideSlugs: Record<string, Record<Lang, string>> = {
  'shipping-from-china': { uz: 'xitoydan-yuk-olib-kelish', ru: 'dostavka-gruza-iz-kitaya-v-uzbekistan', en: 'shipping-from-china-to-uzbekistan' },
  'cargo-pricing': { uz: 'kargo-narxlari-qanday-hisoblanadi', ru: 'kak-schitaetsya-stoimost-kargo', en: 'how-cargo-prices-are-calculated' },
  'air-vs-truck-vs-rail': { uz: 'avia-avto-temir-yol-taqqoslash', ru: 'avia-avto-zhd-sravnenie', en: 'air-vs-truck-vs-rail' },
  'order-from-1688': { uz: '1688-orqali-buyurtma-berish', ru: 'kak-zakazat-s-1688', en: 'how-to-order-from-1688' },
  'customs-2026': { uz: 'bojxona-tolovlari-2026', ru: 'tamozhennye-platezhi-2026', en: 'uzbekistan-customs-duties-2026' },
  'find-supplier': { uz: 'xitoydan-ishlab-chiqaruvchi-topish', ru: 'kak-najti-postavshchika-v-kitae', en: 'finding-a-supplier-in-china' },
  'yiwu-guangzhou': { uz: 'yiwu-va-guangzhou-bozorlari', ru: 'rynki-iu-i-guanchzhou', en: 'yiwu-and-guangzhou-markets' },
  'prohibited-goods': { uz: 'taqiqlangan-tovarlar', ru: 'zapreshchennye-tovary', en: 'prohibited-goods' },
  'glossary': { uz: 'kargo-lugati', ru: 'slovar-kargo', en: 'cargo-glossary' },
  'routes': { uz: 'xitoydan-toshkentga-yonalishlar', ru: 'marshruty-kitay-tashkent', en: 'china-tashkent-routes' },
};
export const guideKeys = Object.keys(guideSlugs);
