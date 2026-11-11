import { langMeta, pick, type Locale, type Localized } from '@/i18n/config';
import { pagePath, pageUrl, type PageKey } from '@/i18n/routes';
import { hero } from '@/i18n/hero';
import { site, telegramUrl, telegramGroupUrl, telegramBotUrl, telegramBotHandle, instagramUrl, facebookUrl, whatsappUrl } from './site';
import ivuShot from '@/assets/photos/ivu-qabul-punkti.jpg';
import loadingShot from '@/assets/photos/yuklash-fura.jpg';
import qrShot from '@/assets/photos/qr-stiker.jpg';

const SITE = site.url;
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;

/**
 * ── Locales and identity in the graph ─────────────────────────────────────────────────────────
 *
 * `inLanguage` is per page and carries the BCP-47 tag from `langMeta`, so a /kirill/ page declares
 * `uz-Cyrl` and a `/` page `uz-Latn`. Google reads the script subtag, and the two Uzbek scripts
 * must not both claim `uz` or one gets treated as a duplicate of the other.
 *
 * The `@id`s work the other way round and are deliberately NOT per locale:
 *   · ORG_ID and WEBSITE_ID are one organization and one website seen in every language, so every
 *     locale points at the same node. Minting `#organization-uzc` would invent a second company.
 *   · webPageNode/articleNode/serviceNode hang their `@id` off the page's own URL, which IS per
 *     locale — and must be the canonical URL, percent-encoded exactly as `pageUrl` returns it, so
 *     the node id, `url`, `<link rel=canonical>` and the sitemap `<loc>` are one string.
 * `knowsLanguage` lists the languages a human at GSR answers in (schema.org puts `availableLanguage`
 * on a ContactPoint, not on an Organization); Latin and Cyrillic Uzbek are one spoken language, so the
 * script variant is not added there. These are facts about people, not about pages: publishing a
 * Persian page is not evidence that anybody at GSR answers in Persian, so 'fa' is in none of these
 * lists, and scripts/test-seo.mjs fails the build if it appears in one.
 */
const descriptions: Localized<string> = {
  uz: 'GSR Logistics — Xitoydan Oʻzbekistonga yigʻma yuk, avia va temir yoʻl kargo, tovar topish va sotib olish, bojxona rasmiylashtiruvi. Toshkent, 2018-yildan; oyiga 10+ fura, 400+ mijoz; Xitoyda uchta qabul punkti — Ivu, Guanchjou, Qashqar.',
  ru: 'GSR Logistics — сборные грузы, авиа и ж/д карго из Китая в Узбекистан, поиск и выкуп товаров, таможенное оформление. Ташкент, с 2018 года; 10+ фур в месяц, 400+ клиентов; три пункта приёма в Китае — Иу, Гуанчжоу, Кашгар.',
  en: 'GSR Logistics — consolidated truck, air and rail cargo from China to Uzbekistan, product sourcing and buying, customs clearance. Tashkent, since 2018; 10+ trucks a month, 400+ clients; three receiving points in China — Yiwu, Guangzhou, Kashgar.',
  // Translated from the English line above (GLOSSARY.md terms); Persian figures in Persian digits.
  zh: 'GSR Logistics——从中国到乌兹别克斯坦的汽运拼货、空运和铁路货运，寻找货源与代采购，清关。塔什干，自 2018 年起；每月 10+ 辆卡车，400+ 客户；在中国有 3 个收货点——义乌、广州、喀什。',
  fa: 'GSR Logistics — حمل بار تجمیعی با کامیون، حمل هوایی و ریلی از چین به ازبکستان، یافتن و خرید کالا، ترخیص گمرکی. تاشکند، از ۲۰۱۸؛ ماهانه بیش از ۱۰ کامیون، بیش از ۴۰۰ مشتری؛ سه محل تحویل بار در چین — ییوو، گوانگجو، کاشغر.',
};

/** How a China receiving point is labelled in structured data — never as a GSR facility. */
const receivingPoint: Localized<string> = { uz: 'qabul punkti', ru: 'пункт приёма', en: 'receiving point', zh: '收货点', fa: 'محل تحویل بار' };

/** Organization + LocalBusiness node, shared @id across locales. */
export function organizationNode(lang: Locale) {
  const point = pick(lang, receivingPoint);
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': ORG_ID,
    name: site.name,
    legalName: site.legalName,
    alternateName: ['GSR Group', 'The Great Silk Road Group'],
    url: SITE,
    logo: { '@type': 'ImageObject', url: `${SITE}/icons/icon-512.png`, width: 512, height: 512 },
    /* The owner's own photographs first — the Yiwu receiving point under the GSR banner, loading,
       the QR label going on — then the branded card. For a LocalBusiness these are "images of the
       business", and real ones are the evidence an assistant or a map can check a name against.
       Reading `.src` is also what makes Astro emit the original JPEG, so these URLs resolve. */
    image: [ivuShot, loadingShot, qrShot].map((i) => `${SITE}${i.src}`).concat(`${SITE}/og/default.png`),
    description: pick(lang, descriptions),
    slogan: pick(lang, hero).h1b,
    telephone: [site.phoneE164, site.phone2E164],
    email: site.email,
    foundingDate: String(site.foundingYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.streetAddress,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: [site.yandexMapsUrl, site.googleMapsUrl],
    openingHoursSpecification: site.openingHoursSpec.map((s) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: s.days, opens: s.opens, closes: s.closes })),
    priceRange: '$$',
    currenciesAccepted: 'UZS, USD',
    areaServed: [
      { '@type': 'Country', name: 'Uzbekistan' },
      { '@type': 'Country', name: 'China' },
    ],
    knowsLanguage: ['uz', 'ru', 'en', 'zh'],
    knowsAbout: ['freight forwarding', 'China to Uzbekistan cargo', 'consolidated cargo', 'customs clearance Uzbekistan', 'product sourcing in China', '1688 buying agent'],
    // Every profile that is the company's own: an assistant checking "is this the same GSR" matches on these.
    sameAs: [telegramUrl, telegramGroupUrl, instagramUrl, facebookUrl, site.yandexMapsUrl, site.googleMapsUrl].filter(Boolean),
    contactPoint: [
      { '@type': 'ContactPoint', telephone: site.phoneE164, contactType: 'sales', availableLanguage: ['uz', 'ru', 'en', 'zh'], url: site.telegramDirect },
      { '@type': 'ContactPoint', name: 'WhatsApp', telephone: site.phone2E164, contactType: 'customer support', availableLanguage: ['uz', 'ru'], url: whatsappUrl },
      // The cargo-tracking bot is a real contact channel and the only one that is open at 3am: it
      // answers without a person, which is what makes the 24/7 hours below true.
      {
        '@type': 'ContactPoint',
        name: telegramBotHandle,
        contactType: 'customer service',
        url: telegramBotUrl,
        // No availableLanguage: which languages the bot itself speaks is not established, and a
        // guess here is a guess a customer finds out about at 3am.
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      },
    ],
    // The three China receiving points, so an assistant answering "where do I send my goods" has them.
    // Named "receiving point", not "GSR Logistics <city>": who operates each one is not established.
    location: site.chinaWarehouses.map((w) => ({
      '@type': 'Place',
      // On the Chinese pages the city's name IS the Chinese one: "义乌 — 收货点", not "义乌 (义乌)".
      name: lang === 'zh' ? `${w.cityZh} — ${point}` : `${pick(lang, w.city)} (${w.cityZh}) — ${point}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: w.localityZh,
        addressRegion: w.regionZh,
        addressCountry: 'CN',
        ...(site.publishChinaAddresses ? { streetAddress: w.address } : {}),
      },
    })),
  };
}

export function websiteNode(lang: Locale) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE,
    name: site.name,
    inLanguage: langMeta[lang].htmlLang,
    publisher: { '@id': ORG_ID },
  };
}

export function webPageNode(lang: Locale, opts: { url: string; name: string; description: string; datePublished?: string; dateModified?: string; type?: string }) {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: langMeta[lang].htmlLang,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
  };
}

export interface Crumb { name: string; key?: PageKey; sub?: string; url?: string }

export function breadcrumbNode(lang: Locale, crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url ?? (c.key ? pageUrl(SITE, lang, c.key, c.sub) : undefined),
    })),
  };
}

export function faqNode(items: Array<{ q: string; a: string }>) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  };
}

export interface ServiceOffer {
  price?: number;
  /** A published range (containers): minPrice–maxPrice instead of one price. */
  minPrice?: number;
  maxPrice?: number;
  unitCode?: 'KGM' | 'MTQ';
  /** Free-text unit where no UN/CEFACT code fits ("20 ft container", "% of the order value"). */
  unitText?: string;
  /** A commission: the number is a percentage, so no currency is attached to it. */
  percent?: boolean;
  /**
   * The smallest shipment the offer applies to, in m³ (consolidated cargo: owner, 2026-11-08, nothing
   * under 1 m³ is carried by truck). Emitted as `eligibleQuantity`, so a reader of the graph learns the
   * minimum without parsing the page.
   */
  minM3?: number;
  validThrough: string;
  description?: string;
}

export function serviceNode(lang: Locale, opts: { name: string; description: string; url: string; serviceType: string; offers?: ServiceOffer[] }) {
  return {
    '@type': 'Service',
    '@id': `${opts.url}#service`,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: opts.serviceType,
    provider: { '@id': ORG_ID },
    areaServed: [{ '@type': 'Country', name: 'Uzbekistan' }, { '@type': 'Country', name: 'China' }],
    availableLanguage: ['uz', 'ru', 'en'],
    ...(opts.offers?.length
      ? {
          offers: opts.offers.map((o) => ({
            '@type': 'Offer',
            ...(o.percent ? {} : { priceCurrency: 'USD' }),
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              ...(o.price !== undefined ? { price: o.price } : {}),
              ...(o.minPrice !== undefined ? { minPrice: o.minPrice } : {}),
              ...(o.maxPrice !== undefined ? { maxPrice: o.maxPrice } : {}),
              ...(o.percent ? {} : { priceCurrency: 'USD' }),
              ...(o.unitCode ? { unitCode: o.unitCode } : {}),
              ...(o.unitText ? { unitText: o.unitText } : {}),
              validThrough: o.validThrough,
              ...(o.description ? { description: o.description } : {}),
            },
            ...(o.minM3 ? { eligibleQuantity: { '@type': 'QuantitativeValue', minValue: o.minM3, unitCode: 'MTQ' } } : {}),
            availability: 'https://schema.org/InStock',
            url: opts.url,
          })),
        }
      : {}),
  };
}

export function articleNode(lang: Locale, opts: { url: string; headline: string; description: string; datePublished: string; dateModified: string; image?: string }) {
  return {
    '@type': 'Article',
    '@id': `${opts.url}#article`,
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    inLanguage: langMeta[lang].htmlLang,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    image: opts.image ?? `${SITE}/og/default.png`,
    mainEntityOfPage: { '@id': `${opts.url}#webpage` },
  };
}

/** Helper: absolute URL of the localized home page. */
export function homeUrl(lang: Locale) { return pageUrl(SITE, lang, 'home'); }
export { pagePath };
