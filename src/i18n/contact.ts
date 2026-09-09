import type { Lang } from './config';

/**
 * Strings for the contact page (/aloqa/), the lead form and the closing CTA band.
 * Phones, address, hours and links come from `src/lib/site.ts` — never typed here.
 */
export interface LeadFormStrings {
  title: string;
  lead: string;
  name: string;
  namePlaceholder: string;
  phone: string;
  phoneHint: string;
  route: string;
  routeOptions: { air: string; truck: string; rail: string; sourcing: string; other: string };
  routePlaceholder: string;
  cargo: string;
  cargoPlaceholder: string;
  cargoHint: string;
  /** "{link}" is replaced with the privacy-policy link. */
  consent: string;
  consentLink: string;
  submit: string;
  sending: string;
  errors: { name: string; phone: string; cargo: string; consent: string };
  success: { title: string; text: string; again: string };
  /** Shown when the endpoint is missing or fails: Telegram deep link + copyable text. */
  fallback: { title: string; text: string; open: string; copy: string; copied: string; copyFail: string };
  noJs: string;
  /** Labels used inside the composed Telegram message. */
  draft: { intro: string; name: string; phone: string; route: string; cargo: string; page: string };
}

export interface ContactStrings {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  h1: string;
  /** ≤70-word answer paragraph; {address} {hours} substituted from site.ts. */
  intro: string;
  card: { title: string; addressLabel: string; phoneLabel: string; phone2Label: string; phone2Note: string; hoursLabel: string; emailLabel: string; whatsappLabel: string; telegramLabel: string; telegramDirect: string; telegramGroup: string; telegramChannel: string; socialLabel: string; instagram: string; facebook: string };
  /** The three China receiving points from the company's own address card (src/lib/site.ts). */
  china: { title: string; lead: string; contactLabel: string; phoneLabel: string; markTitle: string; markText: string };
  map: { title: string; metro: string; street: string; building: string; yandex: string; google: string; coords: string };
  visit: { title: string; text: string; steps: string[]; note: string };
  reasons: { title: string; items: Array<{ title: string; text: string }> };
  form: LeadFormStrings;
  cta: { eyebrow: string; h2: string; text: string; telegram: string; call: string; addressLabel: string; hoursLabel: string };
}

const uz: ContactStrings = {
  seoTitle: 'Aloqa — GSR Logistics, Toshkent, Alisher Navoiy koʻchasi 27',
  seoDescription: 'GSR Logistics bilan bogʻlaning: Toshkent, Alisher Navoiy koʻchasi 27 (metro yonida), Du–Sha 9:00–19:00. Telegram, telefon, Instagram va soʻrov formasi — Xitoydan yuk boʻyicha.',
  eyebrow: 'Aloqa',
  h1: 'Aloqa',
  intro: 'GSR Logistics ofisi — {address}, Alisher Navoiy metro bekati yonida. Ish vaqti: {hours}. Telegramda yozishingiz, telefon qilishingiz yoki quyidagi formani toʻldirishingiz mumkin.',
  card: {
    title: 'Rekvizitlar',
    addressLabel: 'Manzil',
    phoneLabel: 'Telefon',
    phone2Label: 'Qoʻshimcha telefon',
    phone2Note: 'WhatsApp shu raqamda',
    hoursLabel: 'Ish vaqti',
    emailLabel: 'E-mail',
    whatsappLabel: 'WhatsApp',
    telegramLabel: 'Telegram',
    telegramDirect: 'Menejerga yozish',
    telegramGroup: 'Guruh',
    telegramChannel: 'Kanal',
    socialLabel: 'Ijtimoiy tarmoqlar',
    instagram: 'Instagram',
    facebook: 'Facebook',
  },
  china: {
    title: 'Xitoydagi qabul punktlari',
    lead: 'Yetkazib beruvchingiz tovarni shu manzillardan biriga joʻnatadi. Qaysi biri sizga toʻgʻri kelishini menejer aytadi.',
    contactLabel: 'Qabul qiluvchi',
    phoneLabel: 'Telefon',
    markTitle: 'GS kod (markirovka)',
    markText: 'Joʻnatishdan oldin har bir joyga GS kodingizni yozdiring. Kodsiz yuk kimniki ekani bilinmaydi va omborda ushlanib qoladi.',
  },
  map: {
    title: 'Xaritada',
    metro: 'Alisher Navoiy',
    street: 'Alisher Navoiy koʻchasi',
    building: '27-uy',
    yandex: 'Yandex Xarita',
    google: 'Google Maps',
    coords: '41.32° N · 69.25° E',
  },
  visit: {
    title: 'Kelib koʻrishingiz mumkin',
    text: 'Ofis Alisher Navoiy metro bekati yonida, shahar markazida. Shartnoma, hujjatlar, toʻlov va maslahat — shu yerda.',
    steps: [
      'Metroda «Alisher Navoiy» bekatida tushing (Oʻzbekiston yoki Chilonzor liniyasi).',
      'Alisher Navoiy koʻchasi boʻylab 27-uyga yuring — piyoda bir necha daqiqa.',
      'Taksida manzilni koʻrsating: Alisher Navoiy koʻchasi, 27.',
    ],
    note: 'Kelishdan oldin Telegramda yozing — menejer sizni kutib oladi.',
  },
  reasons: {
    title: 'Xabarda nimani yozish kerak?',
    items: [
      { title: 'Yuk', text: 'Nima, taxminan necha kg yoki m³, Xitoyning qaysi shahrida.' },
      { title: 'Muddat', text: 'Qachongacha kerak — shunga qarab avto, avia yoki temir yoʻlni taklif qilamiz.' },
      { title: 'Holat', text: 'Tovar allaqachon sotib olinganmi yoki uni topish kerakmi.' },
    ],
  },
  form: {
    title: 'Soʻrov qoldiring',
    lead: 'Formani toʻldiring — menejer ish vaqtida Telegram yoki telefon orqali bogʻlanadi.',
    name: 'Ismingiz',
    namePlaceholder: 'Ism',
    phone: 'Telefon',
    phoneHint: 'Oʻzbekiston raqami: +998 XX XXX XX XX',
    route: 'Yoʻnalish',
    routeOptions: { air: 'Avia kargo', truck: 'Avto kargo (yigʻma yuk)', rail: 'Temir yoʻl / konteyner', sourcing: 'Tovar topish va sotib olish', other: 'Boshqa savol' },
    routePlaceholder: 'Tanlang',
    cargo: 'Yuk haqida',
    cargoPlaceholder: 'Masalan: 120 kg poyabzal, Ivu, oktabr oxirigacha kerak',
    cargoHint: 'Nima, qancha, qayerdan va qachongacha — bir-ikki jumla yetarli.',
    consent: 'Maʼlumotlarim menejer bilan bogʻlanish uchun ishlatilishiga roziman — {link}.',
    consentLink: 'maxfiylik siyosati',
    submit: 'Soʻrov qoldiring',
    sending: 'Yuborilmoqda…',
    errors: {
      name: 'Ismingizni kiriting.',
      phone: 'Telefon raqamini +998 bilan toʻliq kiriting.',
      cargo: 'Yuk haqida qisqacha yozing.',
      consent: 'Davom etish uchun rozilik belgisini qoʻying.',
    },
    success: { title: 'Soʻrovingiz qabul qilindi.', text: 'Ish vaqtida javob beramiz. Shoshilinch boʻlsa — Telegramda yozing.', again: 'Yana soʻrov yuborish' },
    fallback: {
      title: 'Soʻrovni Telegramda yuboring',
      text: 'Soʻrovlar Telegram orqali qabul qilinadi. Xabar tayyor — Telegramda ochib yuboring yoki matnni nusxalab menejerga joʻnating.',
      open: 'Telegramda ochish',
      copy: 'Matnni nusxalash',
      copied: 'Nusxalandi',
      copyFail: 'Nusxalab boʻlmadi — matnni qoʻlda belgilang.',
    },
    noJs: 'Tugma Telegramni ochadi. Xabarga ismingiz va telefon raqamingizni ham qoʻshing.',
    draft: { intro: 'Assalomu alaykum! Saytdan soʻrov qoldiryapman.', name: 'Ism', phone: 'Telefon', route: 'Yoʻnalish', cargo: 'Yuk', page: 'Sahifa' },
  },
  cta: {
    eyebrow: 'Aloqa',
    h2: 'Keyingi qadam — bitta xabar.',
    text: 'Yukingiz Xitoyda boʻlsa ham, hali topilmagan boʻlsa ham — yozing: yuk, shahar va muddatni aytasiz, biz narx va yoʻnalishni taklif qilamiz.',
    telegram: 'Telegramga yozing',
    call: 'Qoʻngʻiroq qiling',
    addressLabel: 'Ofis',
    hoursLabel: 'Ish vaqti',
  },
};

const ru: ContactStrings = {
  seoTitle: 'Контакты — GSR Logistics, Ташкент, ул. Алишера Навои 27',
  seoDescription: 'Свяжитесь с GSR Logistics: Ташкент, ул. Алишера Навои 27 (у метро), Пн–Сб 9:00–19:00. Telegram, телефон, Instagram и форма заявки по грузам из Китая.',
  eyebrow: 'Контакты',
  h1: 'Контакты',
  intro: 'Офис GSR Logistics — {address}, рядом со станцией метро «Алишер Навои». Часы работы: {hours}. Telegram — самый удобный канал: напишите, и менеджер ответит в рабочее время. Можно также позвонить или заполнить форму ниже.',
  card: {
    title: 'Реквизиты',
    addressLabel: 'Адрес',
    phoneLabel: 'Телефон',
    phone2Label: 'Дополнительный телефон',
    phone2Note: 'WhatsApp на этом номере',
    hoursLabel: 'Часы работы',
    emailLabel: 'E-mail',
    whatsappLabel: 'WhatsApp',
    telegramLabel: 'Telegram',
    telegramDirect: 'Написать менеджеру',
    telegramGroup: 'Группа',
    telegramChannel: 'Канал',
    socialLabel: 'Соцсети',
    instagram: 'Instagram',
    facebook: 'Facebook',
  },
  china: {
    title: 'Пункты приёма в Китае',
    lead: 'Поставщик отправляет товар на один из этих адресов. Какой именно подходит вам — скажет менеджер.',
    contactLabel: 'Получатель',
    phoneLabel: 'Телефон',
    markTitle: 'GS-код (маркировка)',
    markText: 'Перед отправкой попросите поставщика написать ваш GS-код на каждом месте. Без кода непонятно, чей это груз, и он задержится на складе.',
  },
  map: {
    title: 'На карте',
    metro: 'Алишер Навои',
    street: 'ул. Алишера Навои',
    building: 'дом 27',
    yandex: 'Яндекс Карты',
    google: 'Google Maps',
    coords: '41.32° с. ш. · 69.25° в. д.',
  },
  visit: {
    title: 'Можно приехать',
    text: 'Офис рядом со станцией метро «Алишер Навои», в центре города. Договор, документы, оплата и консультация — здесь.',
    steps: [
      'Выйдите на станции метро «Алишер Навои» (Узбекистанская или Чиланзарская линия).',
      'Пройдите по улице Алишера Навои до дома 27 — несколько минут пешком.',
      'В такси укажите адрес: ул. Алишера Навои, 27.',
    ],
    note: 'Перед визитом напишите в Telegram — менеджер вас встретит.',
  },
  reasons: {
    title: 'Что написать в сообщении?',
    items: [
      { title: 'Груз', text: 'Что везём, примерно сколько кг или м³, из какого города Китая.' },
      { title: 'Сроки', text: 'К какой дате нужно — от этого зависит выбор между авто, авиа и ж/д.' },
      { title: 'Статус', text: 'Товар уже куплен или его ещё нужно найти.' },
    ],
  },
  form: {
    title: 'Оставить заявку',
    lead: 'Заполните форму — менеджер свяжется в рабочее время через Telegram или по телефону.',
    name: 'Ваше имя',
    namePlaceholder: 'Имя',
    phone: 'Телефон',
    phoneHint: 'Номер в Узбекистане: +998 XX XXX XX XX',
    route: 'Направление',
    routeOptions: { air: 'Авиа карго', truck: 'Авто карго (сборный груз)', rail: 'Ж/д / контейнер', sourcing: 'Поиск и выкуп товара', other: 'Другой вопрос' },
    routePlaceholder: 'Выберите',
    cargo: 'О грузе',
    cargoPlaceholder: 'Например: 120 кг обуви, Иу, нужно до конца октября',
    cargoHint: 'Что, сколько, откуда и к какому сроку — достаточно одной-двух фраз.',
    consent: 'Согласен на обработку данных для связи с менеджером — {link}.',
    consentLink: 'политика конфиденциальности',
    submit: 'Оставить заявку',
    sending: 'Отправляем…',
    errors: {
      name: 'Укажите имя.',
      phone: 'Введите номер телефона полностью, начиная с +998.',
      cargo: 'Коротко опишите груз.',
      consent: 'Чтобы продолжить, поставьте отметку о согласии.',
    },
    success: { title: 'Заявка принята.', text: 'Ответим в рабочее время. Если срочно — напишите в Telegram.', again: 'Отправить ещё одну заявку' },
    fallback: {
      title: 'Отправьте заявку в Telegram',
      text: 'Заявки принимаются через Telegram. Сообщение уже собрано — откройте его в Telegram или скопируйте текст и отправьте менеджеру.',
      open: 'Открыть в Telegram',
      copy: 'Скопировать текст',
      copied: 'Скопировано',
      copyFail: 'Не удалось скопировать — выделите текст вручную.',
    },
    noJs: 'Кнопка откроет Telegram. Добавьте в сообщение своё имя и номер телефона.',
    draft: { intro: 'Здравствуйте! Оставляю заявку с сайта.', name: 'Имя', phone: 'Телефон', route: 'Направление', cargo: 'Груз', page: 'Страница' },
  },
  cta: {
    eyebrow: 'Контакты',
    h2: 'Следующий шаг — одно сообщение.',
    text: 'Груз уже в Китае или его ещё предстоит найти — напишите: груз, город, сроки, а мы предложим цену и маршрут.',
    telegram: 'Написать в Telegram',
    call: 'Позвонить',
    addressLabel: 'Офис',
    hoursLabel: 'Часы работы',
  },
};

const en: ContactStrings = {
  seoTitle: 'Contact — GSR Logistics, 27 Alisher Navoiy St., Tashkent',
  seoDescription: 'Contact GSR Logistics: 27 Alisher Navoiy St., Tashkent (next to the metro), Mon–Sat 9:00–19:00. Telegram, phone, Instagram and a request form for cargo from China.',
  eyebrow: 'Contact',
  h1: 'Contact',
  intro: 'The GSR Logistics office is at {address}, next to Alisher Navoiy metro station. Hours: {hours}. Telegram is the easiest channel: leave a message and a manager replies during working hours. You can also call or use the form below.',
  card: {
    title: 'Details',
    addressLabel: 'Address',
    phoneLabel: 'Phone',
    phone2Label: 'Second phone',
    phone2Note: 'WhatsApp is on this number',
    hoursLabel: 'Hours',
    emailLabel: 'Email',
    whatsappLabel: 'WhatsApp',
    telegramLabel: 'Telegram',
    telegramDirect: 'Message a manager',
    telegramGroup: 'Group',
    telegramChannel: 'Channel',
    socialLabel: 'Social',
    instagram: 'Instagram',
    facebook: 'Facebook',
  },
  china: {
    title: 'Receiving points in China',
    lead: 'Your supplier ships the goods to one of these addresses. Your manager tells you which one applies to you.',
    contactLabel: 'Receiver',
    phoneLabel: 'Phone',
    markTitle: 'GS code (marking)',
    markText: 'Before dispatch, have your supplier write your GS code on every piece. Without it nobody can tell whose cargo it is and it waits at the warehouse.',
  },
  map: {
    title: 'On the map',
    metro: 'Alisher Navoiy',
    street: 'Alisher Navoiy Street',
    building: 'No. 27',
    yandex: 'Yandex Maps',
    google: 'Google Maps',
    coords: '41.32° N · 69.25° E',
  },
  visit: {
    title: 'Visit us',
    text: 'The office is next to Alisher Navoiy metro station in the city centre. Contracts, documents, payments and advice happen here.',
    steps: [
      'Get off at Alisher Navoiy metro station (Uzbekistan or Chilonzor line).',
      'Walk along Alisher Navoiy Street to building 27 — a few minutes on foot.',
      'By taxi, give the address: 27 Alisher Navoiy Street.',
    ],
    note: 'Message us on Telegram before you come — a manager will meet you.',
  },
  reasons: {
    title: 'What to put in your message',
    items: [
      { title: 'Cargo', text: 'What it is, roughly how many kg or m³, and which city in China.' },
      { title: 'Deadline', text: 'When you need it — that decides between truck, air and rail.' },
      { title: 'Status', text: 'Whether the goods are already bought or still need to be found.' },
    ],
  },
  form: {
    title: 'Leave a request',
    lead: 'Fill in the form — a manager gets back to you during working hours on Telegram or by phone.',
    name: 'Your name',
    namePlaceholder: 'Name',
    phone: 'Phone',
    phoneHint: 'Uzbekistan number: +998 XX XXX XX XX',
    route: 'Service',
    routeOptions: { air: 'Air cargo', truck: 'Truck cargo (consolidated)', rail: 'Rail / container', sourcing: 'Sourcing and buying', other: 'Something else' },
    routePlaceholder: 'Choose',
    cargo: 'About the cargo',
    cargoPlaceholder: 'For example: 120 kg of shoes, Yiwu, needed by the end of October',
    cargoHint: 'What, how much, from where and by when — a sentence or two is enough.',
    consent: 'I agree that my details are used to contact me about this request — {link}.',
    consentLink: 'privacy policy',
    submit: 'Leave a request',
    sending: 'Sending…',
    errors: {
      name: 'Please enter your name.',
      phone: 'Enter the full phone number starting with +998.',
      cargo: 'Tell us briefly about the cargo.',
      consent: 'Tick the consent box to continue.',
    },
    success: { title: 'Request received.', text: 'We reply during working hours. In a hurry? Message us on Telegram.', again: 'Send another request' },
    fallback: {
      title: 'Send your request on Telegram',
      text: 'Requests are taken over Telegram. Your message is ready — open it in Telegram, or copy the text and send it to a manager.',
      open: 'Open in Telegram',
      copy: 'Copy text',
      copied: 'Copied',
      copyFail: 'Could not copy — select the text manually.',
    },
    noJs: 'The button opens Telegram. Add your name and phone number to the message.',
    draft: { intro: 'Hello! I am sending a request from the website.', name: 'Name', phone: 'Phone', route: 'Service', cargo: 'Cargo', page: 'Page' },
  },
  cta: {
    eyebrow: 'Contact',
    h2: 'The next step is one message.',
    text: 'Whether your goods are already in China or still to be found — write to us: cargo, city, deadline, and we propose a price and a route.',
    telegram: 'Message us on Telegram',
    call: 'Call us',
    addressLabel: 'Office',
    hoursLabel: 'Hours',
  },
};

export const contact: Record<Lang, ContactStrings> = { uz, ru, en };

/** Tiny template helper: "{key}" → vars[key]. */
export function fill(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}
