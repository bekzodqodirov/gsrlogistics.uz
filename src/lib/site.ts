/**
 * Single source of truth for company facts used in SEO, JSON-LD, header/footer and contact
 * sections. ⚠️ Values marked TODO are placeholders — replace them with the real company data
 * before going live (see README → "Kompaniya ma'lumotlarini kiritish").
 *
 * Owner-confirmed on 2026-09-09: the manager's Telegram username, the legal entity, the second
 * phone (which is the WhatsApp number), the e-mail, and the three China receiving addresses.
 */
export const site = {
  name: 'GSR Logistics',
  legalName: 'Imex services LLC', // confirmed by the owner; no tax number (STIR) supplied yet
  domain: 'gsrlogistics.uz',
  url: 'https://gsrlogistics.uz',
  foundingYear: 2018, // brand active since 2018 (Telegram channel July 2018) — TODO: confirm legal founding year
  phoneDisplay: '+998 95 018 33 33', // primary number from the Telegram channel
  phoneE164: '+998950183333',
  whatsapp: '998901757800', // WhatsApp runs on the SECOND number, not the primary one
  telegram: 'gsrlogistics', // public channel @gsrlogistics (GSR Group)
  /** Direct chat target for CTAs — the manager's Telegram username. */
  telegramDirect: 'https://t.me/bekzodkodirov556',
  telegramGroup: 'gsrgroupchat',
  telegramBot: '', // optional: tracking bot username, e.g. 'gsr_cargo_bot'
  email: 'b.e.kodirov@gmail.com',
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
  legalEntity: 'Imex services LLC', // TODO: add the STIR when the owner supplies it
  phone2Display: '+998 90 175 78 00',
  phone2E164: '+998901757800',
  /**
   * China receiving points, transcribed from the company's own address card. Whether each one is
   * owned or run by a partner is NOT established — copy says "Ivu ombori", never "our warehouse".
   * Flip publishChinaAddresses to false to keep the full street addresses off the public pages;
   * the city names stay either way.
   */
  publishChinaAddresses: true,
  chinaWarehouses: [
    {
      key: 'yiwu',
      city: { uz: 'Ivu', ru: 'Иу', en: 'Yiwu' },
      cityZh: '义乌',
      address: '浙江省义乌市稠江街道荷花南街2255号',
      contact: '周先生（小周）',
      note: '',
      phones: [{ display: '+86 134 2908 9596', e164: '+8613429089596' }],
    },
    {
      key: 'guangzhou',
      city: { uz: 'Guanchjou', ru: 'Гуанчжоу', en: 'Guangzhou' },
      cityZh: '广州',
      address: '广州市白云区钟落潭镇小罗永宁路89号 嘉宇物流有限公司',
      contact: '',
      note: '高德导航', // the card tells the sender to navigate with Amap
      phones: [
        { display: '+86 185 8851 5113', e164: '+8618588515113' },
        { display: '+86 186 2077 6057', e164: '+8618620776057' },
      ],
    },
    {
      key: 'kashgar',
      city: { uz: 'Kashgar', ru: 'Кашгар', en: 'Kashgar' },
      cityZh: '喀什',
      address: '新疆维吾尔自治区克孜勒苏柯尔克孜自治州乌恰县黑孜苇派出所西南侧250米 陆途仓储',
      contact: '小买',
      note: '',
      phones: [{ display: '+86 183 0908 2036', e164: '+8618309082036' }],
    },
  ],
  /** The marking every carton must carry before the supplier ships it — the company's own term. */
  cargoMark: 'GS',
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
