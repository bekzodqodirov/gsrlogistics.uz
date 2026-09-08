/**
 * Single source of truth for company facts used in SEO, JSON-LD, header/footer and contact
 * sections. ⚠️ Values marked TODO are placeholders — replace them with the real company data
 * before going live (see README → "Kompaniya ma'lumotlarini kiritish").
 */
export const site = {
  name: 'GSR Logistics',
  legalName: 'GSR Group — The Great Silk Road Group',
  domain: 'gsrlogistics.uz',
  url: 'https://gsrlogistics.uz',
  foundingYear: 2018, // brand active since 2018 (Telegram channel July 2018) — TODO: confirm legal founding year
  phoneDisplay: '+998 95 018 33 33', // primary number from the Telegram channel
  phoneE164: '+998950183333',
  whatsapp: '998950183333', // TODO: confirm this number has WhatsApp
  telegram: 'gsrlogistics', // public channel @gsrlogistics (GSR Group)
  /** Direct chat target for CTAs. TODO: replace with the manager's @username (e.g. 'gsr_manager'); a phone link works only if that number is on Telegram. */
  telegramDirect: 'https://t.me/+998950183333',
  telegramGroup: 'gsrgroupchat',
  telegramBot: '', // optional: tracking bot username, e.g. 'gsr_cargo_bot'
  email: 'info@gsrlogistics.uz', // TODO: confirm mailbox exists
  instagram: 'gsrgroup.uz',
  facebook: 'gsrlogistics',
  address: {
    uz: 'Toshkent, Shayxontohur tumani, Alisher Navoiy koʻchasi, 27-uy',
    ru: 'г. Ташкент, Шайхантахурский р-н, ул. Алишера Навои, дом 27',
    en: '27 Alisher Navoiy Street, Shaykhantakhur district, Tashkent',
    streetAddress: 'Alisher Navoiy koʻchasi, 27',
    locality: 'Tashkent',
    region: 'Toshkent',
    postalCode: '100011',
    country: 'UZ',
  },
  geo: { lat: 41.3208, lng: 69.2531 }, // Yandex Maps card, near Alisher Navoiy metro — TODO: verify pin
  yandexMapsUrl: 'https://yandex.uz/maps/org/98882247475/',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=41.3208,69.2531',
  legalEntity: '', // TODO: 'GSR ... MChJ', STIR — required for the privacy page and schema.org identifier
  phone2Display: '+998 97 333 39 33', // TODO: confirm still live
  phone2E164: '+998973333933',
  chinaWarehouses: [
    { city: 'Yiwu', cityUz: 'Ivu (Yiwu)', cityRu: 'Иу (Yiwu)', cityZh: '义乌', address: '' }, // TODO: full Chinese address, receiver, +86, WeChat
  ],
  sourcingCommissionPct: 3, // TODO: confirm ("3% dan")
  insurancePct: 1, // TODO: confirm (% of declared value)
  hours: { uz: 'Du–Sha 9:00–19:00', ru: 'Пн–Сб 9:00–19:00', en: 'Mon–Sat 9:00–19:00' },
  openingHoursSpec: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '19:00' }],
} as const;

export const telegramUrl = `https://t.me/${site.telegram}`;
export const telegramGroupUrl = `https://t.me/${site.telegramGroup}`;
/** Deep link that opens a chat with a prefilled draft (user-initiated, nothing is collected by the site). */
export const telegramChat = (text?: string) => text ? `${site.telegramDirect}?text=${encodeURIComponent(text)}` : site.telegramDirect;
export const facebookUrl = `https://facebook.com/${site.facebook}`;
export const phone2Url = `tel:${site.phone2E164}`;
export const whatsappUrl = `https://wa.me/${site.whatsapp}`;
export const phoneUrl = `tel:${site.phoneE164}`;
export const instagramUrl = `https://instagram.com/${site.instagram}`;
