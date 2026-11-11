import type { Localized } from '@/i18n/config';
import { uzcSub } from '@/i18n/routes';

/**
 * Registry of guide translationKeys → per-locale slugs (must match the frontmatter of
 * src/content/guides/<lang>/<slug>.md).
 *
 * This is what hreflang and the canonical URL of an article page are built from: `GuidePage`
 * passes the row for the article's translationKey straight to the layout as `subs`, so a locale
 * missing from the row is a locale missing from that page's alternates.
 *
 * zh and fa use the English slug, written out like every other slug.
 *
 * The `uzc` slug is NOT transliterated here at runtime — it is looked up in the hand-written
 * table in src/i18n/routes.ts, the single place where the Cyrillic slugs of this site are
 * written down. A slug is permanent; computing one would let a change in the transliterator
 * silently move a live URL. `uzcSub` throws for a guide with no entry, so a new article cannot
 * ship with a Cyrillic sibling that quietly disappears from hreflang.
 */
const latin = {
  'shipping-from-china': { uz: 'xitoydan-yuk-olib-kelish', ru: 'dostavka-gruza-iz-kitaya-v-uzbekistan', en: 'shipping-from-china-to-uzbekistan', zh: 'shipping-from-china-to-uzbekistan', fa: 'shipping-from-china-to-uzbekistan' },
  'cargo-pricing': { uz: 'kargo-narxlari-qanday-hisoblanadi', ru: 'kak-schitaetsya-stoimost-kargo', en: 'how-cargo-prices-are-calculated', zh: 'how-cargo-prices-are-calculated', fa: 'how-cargo-prices-are-calculated' },
  'air-vs-truck-vs-rail': { uz: 'avia-avto-temir-yol-taqqoslash', ru: 'avia-avto-zhd-sravnenie', en: 'air-vs-truck-vs-rail', zh: 'air-vs-truck-vs-rail', fa: 'air-vs-truck-vs-rail' },
  'order-from-1688': { uz: '1688-orqali-buyurtma-berish', ru: 'kak-zakazat-s-1688', en: 'how-to-order-from-1688', zh: 'how-to-order-from-1688', fa: 'how-to-order-from-1688' },
  'customs-2026': { uz: 'bojxona-tolovlari-2026', ru: 'tamozhennye-platezhi-2026', en: 'uzbekistan-customs-duties-2026', zh: 'uzbekistan-customs-duties-2026', fa: 'uzbekistan-customs-duties-2026' },
  'find-supplier': { uz: 'xitoydan-ishlab-chiqaruvchi-topish', ru: 'kak-najti-postavshchika-v-kitae', en: 'finding-a-supplier-in-china', zh: 'finding-a-supplier-in-china', fa: 'finding-a-supplier-in-china' },
  'yiwu-guangzhou': { uz: 'yiwu-va-guangzhou-bozorlari', ru: 'rynki-iu-i-guanchzhou', en: 'yiwu-and-guangzhou-markets', zh: 'yiwu-and-guangzhou-markets', fa: 'yiwu-and-guangzhou-markets' },
  'prohibited-goods': { uz: 'taqiqlangan-tovarlar', ru: 'zapreshchennye-tovary', en: 'prohibited-goods', zh: 'prohibited-goods', fa: 'prohibited-goods' },
  'glossary': { uz: 'kargo-lugati', ru: 'slovar-kargo', en: 'cargo-glossary', zh: 'cargo-glossary', fa: 'cargo-glossary' },
  'routes': { uz: 'xitoydan-toshkentga-yonalishlar', ru: 'marshruty-kitay-tashkent', en: 'china-tashkent-routes', zh: 'china-tashkent-routes', fa: 'china-tashkent-routes' },
};

export const guideSlugs: Record<string, Localized<string>> = Object.fromEntries(
  Object.entries(latin).map(([key, slugs]) => [key, { ...slugs, uzc: uzcSub('guides', slugs.uz) }]),
);
export const guideKeys = Object.keys(guideSlugs);
