/**
 * Single source of truth for company facts used in SEO, JSON-LD, header/footer and contact
 * sections. ⚠️ Values marked TODO are placeholders — replace them with the real company data
 * before going live (see README → "Kompaniya ma'lumotlarini kiritish").
 *
 * Owner-confirmed on 2026-09-09: the manager's Telegram username, the legal entity, the second
 * phone (which is the WhatsApp number), the e-mail, and the three China receiving addresses.
 *
 * Owner-confirmed on 2026-09-10: the cargo-tracking Telegram bot and the four company figures.
 */
export const site = {
  name: 'GSR Logistics',
  legalName: 'Imex services LLC', // confirmed by the owner; no tax number (STIR) supplied yet
  domain: 'gsrlogistics.uz',
  url: 'https://gsrlogistics.uz',
  foundingYear: 2018, // brand active since 2018 (Telegram channel July 2018) — TODO: confirm legal founding year
  /**
   * The two "years" numbers are NOT interchangeable. `foundingYear` is GSR the company and is
   * written "8+ yil" / "2018-yildan"; `teamYears` is how long the team has worked in the freight
   * business and is only ever attributed to the TEAM — "GSR 15 yil" is false, and
   * scripts/check-content.mjs fails the build on it.
   */
  teamYears: 15, // owner, 2026-09-10: "sohada ishlayotganimga 15 yil boldi"
  trucksPerMonth: 10, // "oyiga 10+ truck olib kelamiz" — always written with the plus
  clients: 400, // "400dan oshiq mijoz" — always written with the plus
  phoneDisplay: '+998 95 018 33 33', // primary number from the Telegram channel
  phoneE164: '+998950183333',
  whatsapp: '998901757800', // WhatsApp runs on the SECOND number, not the primary one
  telegram: 'gsrlogistics', // public channel @gsrlogistics (GSR Group)
  /** Direct chat target for CTAs — the manager's Telegram username. */
  telegramDirect: 'https://t.me/bekzodkodirov556',
  telegramGroup: 'gsrgroupchat',
  /**
   * The cargo-tracking bot. Staff scan the QR on every carton at each stage and the client watches
   * those scans here, per carton, in their own account, 24/7 — the bot answers, not a person.
   * This exact username is the only one allowed on the site (check-content.mjs enforces it): a typo
   * sends a client to a stranger's bot.
   */
  telegramBot: 'GSR_GROUP_AGENT_bot',
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
   *
   * The city labels are the company's own, taken from its address card — the third point is billed as
   * KASHI (KASHGAR) although the street address sits in Wuqia County, Kizilsu prefecture. Keep the
   * company's label (it is what the manager will say on the phone) and let the Chinese address carry
   * the precision. Uzbek spells the city «Qashqar» everywhere else on the site; match that.
   */
  publishChinaAddresses: true,
  chinaWarehouses: [
    {
      key: 'yiwu',
      city: { uz: 'Ivu', ru: 'Иу', en: 'Yiwu' },
      cityZh: '义乌',
      localityZh: '义乌市',
      regionZh: '浙江省',
      address: '浙江省义乌市稠江街道荷花南街2255号',
      contact: '周先生（小周）',
      note: '',
      phones: [{ display: '+86 134 2908 9596', e164: '+8613429089596' }],
    },
    {
      key: 'guangzhou',
      city: { uz: 'Guanchjou', ru: 'Гуанчжоу', en: 'Guangzhou' },
      cityZh: '广州',
      localityZh: '广州市白云区',
      regionZh: '广东省',
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
      city: { uz: 'Qashqar', ru: 'Кашгар', en: 'Kashgar' },
      cityZh: '喀什',
      localityZh: '乌恰县',
      regionZh: '新疆维吾尔自治区',
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
/** Tracking bot: `@GSR_GROUP_AGENT_bot` for display, this for the link. */
export const telegramBotHandle = `@${site.telegramBot}`;
export const telegramBotUrl = `https://t.me/${site.telegramBot}`;
/** Deep link that opens a chat with a prefilled draft (user-initiated, nothing is collected by the site). */
export const telegramChat = (text?: string) => text ? `${site.telegramDirect}?text=${encodeURIComponent(text)}` : site.telegramDirect;
export const facebookUrl = `https://facebook.com/${site.facebook}`;
export const phone2Url = `tel:${site.phone2E164}`;
export const whatsappUrl = `https://wa.me/${site.whatsapp}`;
export const phoneUrl = `tel:${site.phoneE164}`;
export const instagramUrl = `https://instagram.com/${site.instagram}`;
