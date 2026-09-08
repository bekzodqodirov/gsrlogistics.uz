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
  foundingYear: 2018, // TODO: confirm founding year with the owner
  phoneDisplay: '+998 95 018 33 33', // primary number from the Telegram channel
  phoneE164: '+998950183333',
  whatsapp: '998950183333', // TODO: confirm this number has WhatsApp
  telegram: 'gsrlogistics', // public channel @gsrlogistics (GSR Group)
  telegramManager: 'gsrlogistics', // TODO: personal manager username for direct chats (without @)
  telegramBot: '', // optional: tracking bot username, e.g. 'gsr_cargo_bot'
  email: 'info@gsrlogistics.uz', // TODO: confirm mailbox exists
  instagram: 'gsrlogistics', // TODO: confirm Instagram handle
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
  geo: { lat: 41.3111, lng: 69.2497 }, // approx. Alisher Navoiy ko'chasi 27 — TODO: verify pin
  extraPhones: ['+998 97 333 39 33', '+998 99 093 33 33', '+998 99 083 33 33', '+998 95 019 33 33'],
  association: {
    uz: '«Bir makon, bir yoʻl» assotsiatsiyasining rasmiy vakili',
    ru: 'Официальный представитель ассоциации «Один пояс и один путь»',
    en: 'Official representative of the "One Belt, One Road" association',
  },
  chinaWarehouses: [
    { city: 'Guangzhou', cityUz: 'Guanchjou', cityRu: 'Гуанчжоу', cityZh: '广州' },
    { city: 'Yiwu', cityUz: 'Ivu', cityRu: 'Иу', cityZh: '义乌' },
  ],
  hours: { uz: 'Du–Sha 9:00–19:00', ru: 'Пн–Сб 9:00–19:00', en: 'Mon–Sat 9:00–19:00' },
  openingHoursSpec: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '19:00' }],
} as const;

export const telegramUrl = `https://t.me/${site.telegram}`;
export const whatsappUrl = `https://wa.me/${site.whatsapp}`;
export const phoneUrl = `tel:${site.phoneE164}`;
export const instagramUrl = `https://instagram.com/${site.instagram}`;
