import type { Lang } from './config';

// operatorFallback: the trade name («GSR Logistics») shown next to site.legalEntity («Imex services LLC», src/lib/site.ts); it also stands alone if that value is ever emptied. The STIR is still missing — add it in site.ts when the owner supplies it; never invent one.
export interface PrivacySection { heading: string; paragraphs?: string[]; bullets?: string[] }
export interface PrivacyStrings { seoTitle: string; seoDescription: string; eyebrow: string; h1: string; effective: string; intro: string; operatorLabel: string; operatorFallback: string; sections: PrivacySection[]; contactHeading: string; contactText: string }

const uz: PrivacyStrings = {
  seoTitle: 'Maxfiylik siyosati — GSR Logistics',
  seoDescription: 'GSR Logistics saytida shaxsga doir maʼlumotlar qanday yigʻiladi, nima maqsadda ishlatiladi, kimga uzatiladi va qancha saqlanadi. Oʻzbekiston Respublikasining «Shaxsga doir maʼlumotlar toʻgʻrisida»gi qonuniga (OʻRQ-547) muvofiq.',
  eyebrow: 'Maxfiylik', h1: 'Maxfiylik siyosati', effective: 'Amal qilish sanasi: 2026-yil 8-sentabr',
  intro: 'Bu sahifa gsrlogistics.uz sayti orqali biz bilan bogʻlanganingizda qanday maʼlumotlar yigʻilishi, ular nima uchun kerakligi va kimga uzatilishini tushuntiradi. Sayt cookie-banner ishlatmaydi va reklama trekerlarini yuklamaydi.',
  operatorLabel: 'Operator', operatorFallback: 'GSR Logistics',
  sections: [
    { heading: 'Qanday maʼlumotlar yigʻiladi?', bullets: ['Siz yuborgan maʼlumotlar: ism, telefon raqami, Telegram foydalanuvchi nomi, xabar matni, yuk haqidagi tavsif, yuk kodi.', 'Texnik maʼlumotlar: IP-manzil, brauzer va qurilma turi, sahifaga kirish vaqti — faqat hosting server jurnallarida. Saytda hisoblagich va reklama skriptlari yoʻq.', 'Kalkulyator hisob-kitobni brauzeringizda bajaradi — kiritgan vazn va hajmingiz bizga yuborilmaydi. Kuzatuv formasida esa yuk kodi holatni topish uchun serverga yuboriladi.'] },
    { heading: 'Maʼlumotlar nima uchun kerak?', bullets: ['Soʻrovingizga javob berish, narx va yoʻnalishni taklif qilish.', 'Shartnoma tuzish va yukni yetkazib berish boʻyicha majburiyatlarni bajarish.', 'Yuk holati haqida xabar berish.', 'Saytning ishlashini taʼminlash va xatolarni aniqlash.'] },
    { heading: 'Huquqiy asos', paragraphs: ['Maʼlumotlar sizning roziligingiz asosida (formadagi belgi yoki Telegramda oʻzingiz yozganingizda) va shartnomani bajarish uchun ishlanadi. Rozilikni istalgan vaqtda qaytarib olishingiz mumkin.'] },
    { heading: 'Kimga uzatiladi?', bullets: ['Telegram (Telegram FZ-LLC, serverlari Oʻzbekistondan tashqarida) — siz Telegram orqali yozganingizda yoki forma xabari Telegramga uzatilganda.', 'GitHub, Inc. (AQSH) — sayt hostingi (GitHub Pages); server jurnallarida IP-manzil, soʻrov vaqti va soʻralgan sahifa qayd etiladi.', 'Google Sheets (AQSH) — faqat yuk kuzatuvi uchun shaxsga tegishli boʻlmagan maʼlumotlar (kod, bosqich, sana), agar bu funksiya yoqilgan boʻlsa.', 'Davlat organlari — faqat qonun talab qilgan hollarda.'] },
    { heading: 'Qancha saqlanadi?', paragraphs: ['Soʻrov xabarlari — soʻrov yopilgunga qadar va shartnoma boʻyicha hisob-kitob muddati davomida (odatda 3 yilgacha). Server jurnallari — 90 kungacha. Siz soʻrasangiz, maʼlumotlar muddatidan oldin oʻchiriladi, agar qonun saqlashni talab qilmasa.'] },
    { heading: 'Sizning huquqlaringiz', bullets: ['Qaysi maʼlumotlaringiz bizda borligini bilish va nusxasini olish.', 'Notoʻgʻri maʼlumotlarni tuzatish.', 'Maʼlumotlarni oʻchirishni yoki ishlashni toʻxtatishni talab qilish.', 'Rozilikni qaytarib olish.', 'Oʻzbekiston Respublikasi Prezidenti huzuridagi Personallashtirish agentligiga shikoyat qilish.'] },
    { heading: 'Xavfsizlik', paragraphs: ['Sayt faqat HTTPS orqali ishlaydi. Forma maʼlumotlarni maʼlumotlar bazasida saqlamaydi: matn tayyorlanadi va siz uni Telegram orqali menejerga oʻzingiz yuborasiz. Maʼlumotlarga faqat vakolatli xodimlar kiradi.'] },
    { heading: 'Oʻzgarishlar', paragraphs: ['Siyosat oʻzgarganda bu sahifadagi sana yangilanadi. Muhim oʻzgarishlar haqida saytda alohida xabar beramiz.'] },
  ],
  contactHeading: 'Savollar uchun', contactText: 'Shaxsga doir maʼlumotlar boʻyicha soʻrovlarni Telegram yoki elektron pochta orqali yuboring — 10 ish kuni ichida javob beramiz.',
};

const ru: PrivacyStrings = {
  seoTitle: 'Политика конфиденциальности — GSR Logistics',
  seoDescription: 'Какие персональные данные собирает сайт GSR Logistics, зачем, кому передаются и сколько хранятся. В соответствии с Законом Республики Узбекистан «О персональных данных» (ЗРУ-547).',
  eyebrow: 'Конфиденциальность', h1: 'Политика конфиденциальности', effective: 'Дата вступления в силу: 8 сентября 2026 г.',
  intro: 'На этой странице объясняется, какие данные собираются, когда вы связываетесь с нами через сайт gsrlogistics.uz, зачем они нужны и кому передаются. Сайт не использует cookie-баннер и не загружает рекламные трекеры.',
  operatorLabel: 'Оператор', operatorFallback: 'GSR Logistics',
  sections: [
    { heading: 'Какие данные собираются?', bullets: ['Данные, которые вы отправляете сами: имя, номер телефона, имя пользователя Telegram, текст сообщения, описание груза, код груза.', 'Технические данные: IP-адрес, тип браузера и устройства, время посещения — только в журналах сервера хостинга. Счётчиков аналитики и рекламных скриптов на сайте нет.', 'Калькулятор считает в вашем браузере — введённые вес и объём нам не передаются. А в форме отслеживания код груза отправляется на сервер, чтобы найти статус.'] },
    { heading: 'Зачем нужны данные?', bullets: ['Ответить на запрос, предложить цену и маршрут.', 'Заключить договор и выполнить обязательства по доставке.', 'Сообщать о статусе груза.', 'Обеспечивать работу сайта и находить ошибки.'] },
    { heading: 'Правовое основание', paragraphs: ['Данные обрабатываются на основании вашего согласия (отметка в форме или ваше сообщение в Telegram) и для исполнения договора. Согласие можно отозвать в любой момент.'] },
    { heading: 'Кому передаются?', bullets: ['Telegram (Telegram FZ-LLC, серверы за пределами Узбекистана) — когда вы пишете нам в Telegram или сообщение формы передаётся в Telegram.', 'GitHub, Inc. (США) — хостинг сайта (GitHub Pages); в журналах сервера фиксируются IP-адрес, время запроса и запрошенная страница.', 'Google Sheets (США) — только неперсональные данные для отслеживания груза (код, этап, дата), если функция включена.', 'Государственные органы — только в случаях, предусмотренных законом.'] },
    { heading: 'Сколько хранятся?', paragraphs: ['Сообщения по запросам — до закрытия запроса и в течение срока расчётов по договору (обычно до 3 лет). Журналы сервера — до 90 дней. По вашей просьбе данные удаляются раньше, если закон не требует их хранения.'] },
    { heading: 'Ваши права', bullets: ['Узнать, какие ваши данные у нас есть, и получить копию.', 'Исправить неточные данные.', 'Потребовать удаления данных или прекращения обработки.', 'Отозвать согласие.', 'Подать жалобу в Агентство по персонализации при Президенте Республики Узбекистан.'] },
    { heading: 'Безопасность', paragraphs: ['Сайт работает только по HTTPS. Форма не хранит данные в базе: текст готовится, а отправляете вы его менеджеру сами через Telegram. Доступ к данным имеют только уполномоченные сотрудники.'] },
    { heading: 'Изменения', paragraphs: ['При изменении политики обновляется дата на этой странице. О существенных изменениях мы сообщаем на сайте отдельно.'] },
  ],
  contactHeading: 'Вопросы', contactText: 'Запросы по персональным данным направляйте в Telegram или на электронную почту — ответим в течение 10 рабочих дней.',
};

const en: PrivacyStrings = {
  seoTitle: 'Privacy policy — GSR Logistics',
  seoDescription: 'What personal data the GSR Logistics website collects, why, who receives it and how long it is kept. In line with the Law of the Republic of Uzbekistan “On Personal Data” (ZRU-547).',
  eyebrow: 'Privacy', h1: 'Privacy policy', effective: 'Effective date: September 8, 2026',
  intro: 'This page explains what data is collected when you contact us through gsrlogistics.uz, why it is needed and who receives it. The site uses no cookie banner and loads no advertising trackers.',
  operatorLabel: 'Data controller', operatorFallback: 'GSR Logistics',
  sections: [
    { heading: 'What data is collected?', bullets: ['Data you send: name, phone number, Telegram username, message text, cargo description, cargo code.', 'Technical data: IP address, browser and device type, time of visit — only in the hosting server logs. The site carries no analytics counter and no advertising scripts.', 'The calculator computes in your browser — the weight and volume you enter are not sent to us. The tracking form does send the cargo code to the server in order to look up its status.'] },
    { heading: 'Why is the data needed?', bullets: ['To answer your request and propose a price and route.', 'To sign a contract and fulfil delivery obligations.', 'To inform you about cargo status.', 'To keep the site running and find errors.'] },
    { heading: 'Legal basis', paragraphs: ['Data is processed on the basis of your consent (the checkbox in the form or your own message on Telegram) and for the performance of a contract. You may withdraw consent at any time.'] },
    { heading: 'Who receives it?', bullets: ['Telegram (Telegram FZ-LLC, servers outside Uzbekistan) — when you message us on Telegram or a form message is forwarded to Telegram.', 'GitHub, Inc. (USA) — site hosting (GitHub Pages); server logs record the IP address, the time of the request and the page requested.', 'Google Sheets (USA) — non-personal tracking data only (code, stage, date), if this feature is enabled.', 'Public authorities — only where required by law.'] },
    { heading: 'How long is it kept?', paragraphs: ['Request messages — until the request is closed and for the settlement period of the contract (usually up to 3 years). Server logs — up to 90 days. On request data is deleted earlier unless the law requires retention.'] },
    { heading: 'Your rights', bullets: ['To know which of your data we hold and to receive a copy.', 'To correct inaccurate data.', 'To request deletion or the end of processing.', 'To withdraw consent.', 'To lodge a complaint with the Personalisation Agency under the President of the Republic of Uzbekistan.'] },
    { heading: 'Security', paragraphs: ['The site works over HTTPS only. The form stores nothing in a database: it prepares the message and you send it to the manager yourself over Telegram. Only authorised staff have access to data.'] },
    { heading: 'Changes', paragraphs: ['When the policy changes, the date on this page is updated. Significant changes are announced separately on the site.'] },
  ],
  contactHeading: 'Questions', contactText: 'Send personal-data requests via Telegram or email — we reply within 10 working days.',
};

export const privacy: Record<Lang, PrivacyStrings> = { uz, ru, en };
