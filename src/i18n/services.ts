import type { Lang } from './config';
import type { ServiceKey } from '@/data/services';

/**
 * Strings for the home Services grid, the services index page and the service page template.
 * Service names/short lines come from `src/data/services.ts`; long-form page copy from
 * `src/data/services/<key>.content.ts`; every figure from `src/data/tariffs.json`.
 * Templates use `{n}` for a number and `{name}` for a service name.
 */
export interface ServicesStrings {
  home: {
    eyebrow: string;
    h2: string;
    intro: string;
    flagshipBadge: string;
    /** "Batafsil" — ghost link on every card. */
    details: string;
    /** Accessible name of the grid. */
    listLabel: string;
    compare: {
      title: string;
      truck: string;
      air: string;
      rail: string;
    };
    /** Meta line under the grid: "Muddatlar va narxlar taxminiy · Yangilangan: …" */
    meta: string;
  };
  /** Building blocks of the one-line "number line" under each card name. */
  line: {
    days: string;
    fromKg: string;
    commissionFrom: string;
    yuanPayment: string;
    containers: string;
    turnkey: string;
    customs: string;
    photoEveryReceipt: string;
    insurance: string;
    toOrder: string;
    withCustoms: string;
  };
  index: {
    seoTitle: string;
    seoDescription: string;
    eyebrow: string;
    h1: string;
    intro: string;
    groups: { shipping: string; buying: string; paperwork: string; vehicles: string };
    groupLead: { shipping: string; buying: string; paperwork: string; vehicles: string };
    compareTitle: string;
    compareIntro: string;
    compareHead: { mode: string; days: string; min: string; rule: string; fits: string };
    compareRows: {
      truck: { min: string; rule: string; fits: string };
      air: { min: string; rule: string; fits: string };
      rail: { min: string; rule: string; fits: string };
    };
    howTitle: string;
    how: string;
    ctaTitle: string;
    ctaText: string;
  };
  page: {
    /** "Xizmat {n}" — eyebrow prefix when content has no eyebrow. */
    serviceIndex: string;
    factsLabel: string;
    stickyLabel: string;
    stickyDays: string;
    stickyHint: string;
    sectionsLabel: string;
    faqTitle: string;
    relatedTitle: string;
    guidesTitle: string;
    guidesIntro: string;
    ctaEyebrow: string;
    /** Used when the content file does not exist yet. */
    fallback: {
      seoTitle: string;
      seoDescription: string;
      eyebrow: string;
      intro: string;
      facts: Array<{ label: string; value: string }>;
      sectionTitle: string;
      sectionBody: string[];
      ctaTitle: string;
      ctaText: string;
      draft: string;
    };
  };
  /** Short titles of the 10 guides, keyed by translationKey (slugs live in src/data/guides.ts). */
  guideTitles: Record<string, string>;
}

const uz: ServicesStrings = {
  home: {
    eyebrow: '02 — Xizmatlar',
    h2: 'Xitoy bilan bogʻliq har bir ish. Bir joyda.',
    intro: 'Tovar topishdan eshigingizgacha — bitta menejer, bitta shartnoma.',
    flagshipBadge: 'Asosiy xizmat',
    details: 'Batafsil',
    listLabel: 'Xizmatlar roʻyxati',
    compare: {
      title: 'Qaysi yoʻnalish sizga mos?',
      truck: 'ogʻir va hajmli yuk',
      air: 'shoshilinch, qimmat, yengil',
      rail: 'konteyner, 20ft/40ft',
    },
    meta: 'Muddatlar va narxlar taxminiy, yuk Xitoy omboridan joʻnatilgandan keyin hisoblanadi · Yangilangan: {date}',
  },
  line: {
    days: 'kun',
    fromKg: '{n} kg dan',
    commissionFrom: 'komissiya {n}% dan',
    yuanPayment: 'yuanda toʻlov',
    containers: '20ft / 40ft',
    turnkey: 'kalit topshirish',
    customs: 'GTD · boj va QQS hisobi',
    photoEveryReceipt: 'foto-hisobot har qabulda',
    insurance: 'sugʻurta {n}%',
    toOrder: 'buyurtma asosida',
    withCustoms: 'bojxona bilan',
  },
  index: {
    seoTitle: 'Xitoydan yuk tashish va xarid xizmatlari — kargo, tovar topish, bojxona',
    seoDescription: 'GSR Logistics xizmatlari: Xitoydan Toshkentga yigʻma yuk 15–25 kun, avia 5–10 kun, temir yoʻl konteynerlari, tovar topish, 1688 va Taobaodan sotib olish, uskunalar importi, bojxona rasmiylashtiruvi, Xitoyda uchta qabul manzili (Ivu, Guanchjou, Qashqar) va avtomobil importi.',
    eyebrow: 'Xizmatlar',
    h1: 'Xitoydan yuk tashish va xarid boʻyicha xizmatlar',
    intro: 'GSR Logistics Xitoy bilan bogʻliq toʻqqiz ishni bajaradi: Xitoyda uchta qabul manzili — Ivu, Guanchjou va Qashqar; Ivu omboridan Xorgos orqali Toshkentga yigʻma yuk taxminan 15–25 kunda, avia kargo 5–10 kunda, temir yoʻl konteynerlari 20–35 kunda keladi. Tovar topamiz, 1688 va Taobaodan sotib olamiz, uskunalarni «kalit topshirish» sharti bilan keltiramiz, bojxonani rasmiylashtiramiz. Bitta menejer, bitta shartnoma — 2018-yildan beri.',
    groups: { shipping: 'Yuk tashish', buying: 'Xitoyda topish va sotib olish', paperwork: 'Rasmiylashtiruv va nazorat', vehicles: 'Avtomobillar' },
    groupLead: {
      shipping: 'Uch yoʻnalish — avto, avia, temir yoʻl. Muddat va narx yukning ogʻirligi, hajmi va shoshilinchligiga bogʻliq.',
      buying: 'Xitoy tilini bilishingiz shart emas: menejerlar zavod bilan gaplashadi, yuanda toʻlaydi, namunani tekshiradi.',
      paperwork: 'Hujjatlar, deklaratsiya, GTD va sifat nazorati — yuk yoʻlga chiqishidan oldin.',
      vehicles: 'Buyurtma asosida avtomobil va elektromobil — tanlovdan rasmiylashtiruvgacha.',
    },
    compareTitle: 'Qaysi yoʻnalishni tanlash kerak?',
    compareIntro: 'Uch yoʻnalishni bir jadvalda taqqoslang. Muddatlar taxminiy, yuk Xitoy omboridan joʻnatilgandan keyin hisoblanadi.',
    compareHead: { mode: 'Yoʻnalish', days: 'Muddat', min: 'Minimal', rule: 'Narx qoidasi', fits: 'Kimga mos' },
    compareRows: {
      truck: { min: '1 kg', rule: 'zichlik ≥ 170 kg/m³ — kg boʻyicha, past — m³ boʻyicha', fits: 'ulgurji partiya, ogʻir va hajmli yuk' },
      air: { min: '0,5 kg', rule: 'kg boʻyicha, hajmiy vazn ÷ 5 000', fits: 'shoshilinch, qimmat va yengil tovar' },
      rail: { min: '20ft konteyner', rule: 'konteyner uchun, FCL yoki LCL', fits: 'katta partiya, uskunalar' },
    },
    howTitle: 'Qanday boshlaymiz?',
    how: 'Telegramda yoki telefon orqali yozasiz: yuk, shahar va muddatni aytasiz. Menejer yoʻnalish va narxni taklif qiladi, shartnoma tuzamiz va Xitoydagi qabul manzilini beramiz — Ivu, Guanchjou yoki Qashqar, qaysi biriga joʻnatish kerakligini menejer aytadi. Shundan soʻng yuk yoʻlga chiqadi.',
    ctaTitle: 'Qaysi xizmat kerakligini bilmaysizmi?',
    ctaText: 'Yozing — yukingizni tavsiflang, biz yoʻnalish, muddat va narxni taklif qilamiz.',
  },
  page: {
    serviceIndex: 'Xizmat {n}',
    factsLabel: 'Asosiy faktlar',
    stickyLabel: 'Narx va muddat',
    stickyDays: 'Muddat, taxminan',
    stickyHint: 'Aniq narxni yukingiz boʻyicha aytamiz — yozing.',
    sectionsLabel: 'Xizmat haqida',
    faqTitle: 'Koʻp beriladigan savollar',
    relatedTitle: 'Bogʻliq xizmatlar',
    guidesTitle: 'Qoʻllanmadan oʻqing',
    guidesIntro: 'Mavzu boʻyicha batafsil maqolalar — narx qoidalari, bojxona, yoʻnalishlar.',
    ctaEyebrow: 'Aloqa',
    fallback: {
      seoTitle: '{name} — Xitoydan Oʻzbekistonga',
      seoDescription: '{short} GSR Logistics, Toshkent — 2018-yildan beri Xitoy bilan ishlaymiz.',
      eyebrow: 'Xizmat',
      intro: '{short} Yukni Xitoydagi qabul manzilida — Ivu, Guanchjou yoki Qashqarda — qabul qilamiz, tekshiramiz va foto-hisobot yuboramiz, Toshkentda rasmiy rasmiylashtiramiz. Bitta shartnoma, bitta menejer — 2018-yildan beri Xitoy bilan ishlaymiz.',
      facts: [
        { label: 'Xitoydagi qabul manzillari', value: 'Ivu · Guanchjou · Qashqar' },
        { label: 'Xitoy bilan', value: '2018-yildan' },
        { label: 'Hisobot', value: 'Foto-hisobot' },
        { label: 'Menejer tillari', value: 'Oʻzbek · rus · xitoy' },
      ],
      sectionTitle: 'Qanday ishlaymiz?',
      sectionBody: [
        'Soʻrov qoldirasiz — Telegramda yoki telefon orqali. Menejer yuk, shahar va muddatni aniqlashtiradi, yoʻnalish va narxni taklif qiladi.',
        'Shartnoma tuzamiz: narx, muddat va javobgarlik qogʻozda. Yuk Xitoydagi qabul manziliga kelgach tortiladi, oʻlchanadi va suratga olinadi — hisobot Telegramga keladi.',
        'Toshkentda bojxona rasmiylashtiruvini biz bajaramiz, boj va QQS qonun boʻyicha toʻlanadi. Yukni ombordan olib ketasiz yoki viloyatga joʻnatamiz.',
      ],
      ctaTitle: 'Bu xizmat boʻyicha savolingiz bormi?',
      ctaText: 'Yozing — yuk, shahar va muddatni aytasiz, biz narx va yoʻnalishni taklif qilamiz.',
      draft: 'Assalomu alaykum! «{name}» xizmati boʻyicha savolim bor.',
    },
  },
  guideTitles: {
    'shipping-from-china': 'Xitoydan yuk olib kelish — 2026 qoʻllanmasi',
    'cargo-pricing': 'Kargo narxi qanday hisoblanadi',
    'air-vs-truck-vs-rail': 'Avia, avto yoki temir yoʻl — taqqoslash',
    'order-from-1688': '1688 orqali buyurtma berish',
    'customs-2026': 'Bojxona toʻlovlari 2026',
    'find-supplier': 'Xitoydan ishlab chiqaruvchi topish',
    'yiwu-guangzhou': 'Ivu va Guanchjou bozorlari',
    'prohibited-goods': 'Taqiqlangan tovarlar',
    'glossary': 'Kargo lugʻati',
    'routes': 'Xitoydan Toshkentga yoʻnalishlar',
  },
};

const ru: ServicesStrings = {
  home: {
    eyebrow: '02 — Услуги',
    h2: 'Всё, что связано с Китаем. В одном месте.',
    intro: 'От поиска товара до вашей двери — один менеджер, один договор.',
    flagshipBadge: 'Основная услуга',
    details: 'Подробнее',
    listLabel: 'Список услуг',
    compare: {
      title: 'Какой способ вам подходит?',
      truck: 'тяжёлый и объёмный груз',
      air: 'срочный, дорогой, лёгкий',
      rail: 'контейнер, 20ft/40ft',
    },
    meta: 'Сроки и цены ориентировочные, считаются после отправки со склада в Китае · Обновлено: {date}',
  },
  line: {
    days: 'дней',
    fromKg: 'от {n} кг',
    commissionFrom: 'комиссия от {n}%',
    yuanPayment: 'оплата в юанях',
    containers: '20ft / 40ft',
    turnkey: 'под ключ',
    customs: 'ГТД · расчёт пошлин и НДС',
    photoEveryReceipt: 'фотоотчёт при каждой приёмке',
    insurance: 'страховка {n}%',
    toOrder: 'под заказ',
    withCustoms: 'с растаможкой',
  },
  index: {
    seoTitle: 'Услуги доставки и выкупа из Китая — карго, поиск товаров, растаможка',
    seoDescription: 'Услуги GSR Logistics: сборный груз из Китая в Ташкент за 15–25 дней, авиа за 5–10, ж/д контейнеры, поиск товаров, выкуп с 1688 и Taobao, импорт оборудования, таможенное оформление, три адреса приёма в Китае (Иу, Гуанчжоу, Кашгар) и авто из Китая.',
    eyebrow: 'Услуги',
    h1: 'Услуги доставки и закупок в Китае',
    intro: 'GSR Logistics закрывает девять задач, связанных с Китаем: в Китае три адреса приёма — Иу, Гуанчжоу и Кашгар; сборный груз со склада в Иу через Хоргос в Ташкент — ориентировочно 15–25 дней, авиа карго — 5–10, ж/д контейнеры — 20–35. Находим товар, выкупаем на 1688 и Taobao, привозим оборудование под ключ, оформляем таможню. Один менеджер, один договор — с 2018 года.',
    groups: { shipping: 'Доставка грузов', buying: 'Поиск и выкуп в Китае', paperwork: 'Оформление и контроль', vehicles: 'Автомобили' },
    groupLead: {
      shipping: 'Три способа — авто, авиа, ж/д. Срок и цена зависят от веса, объёма и срочности груза.',
      buying: 'Знать китайский не нужно: менеджеры общаются с фабрикой, платят в юанях, проверяют образец.',
      paperwork: 'Документы, декларация, ГТД и контроль качества — до того, как груз отправится.',
      vehicles: 'Автомобили и электромобили под заказ — от выбора до оформления.',
    },
    compareTitle: 'Какой способ доставки выбрать?',
    compareIntro: 'Сравните три способа в одной таблице. Сроки ориентировочные, считаются после отправки со склада в Китае.',
    compareHead: { mode: 'Способ', days: 'Срок', min: 'Минимум', rule: 'Правило цены', fits: 'Кому подходит' },
    compareRows: {
      truck: { min: '1 кг', rule: 'плотность ≥ 170 кг/м³ — по кг, ниже — по м³', fits: 'оптовые партии, тяжёлый и объёмный груз' },
      air: { min: '0,5 кг', rule: 'по кг, объёмный вес ÷ 5 000', fits: 'срочный, дорогой и лёгкий товар' },
      rail: { min: 'контейнер 20ft', rule: 'за контейнер, FCL или LCL', fits: 'крупные партии, оборудование' },
    },
    howTitle: 'С чего начать?',
    how: 'Напишите в Telegram или позвоните: груз, город, сроки. Менеджер предложит способ и цену, заключаем договор и даём адрес приёма в Китае — Иу, Гуанчжоу или Кашгар, на какой отправлять — скажет менеджер. После этого груз отправляется.',
    ctaTitle: 'Не знаете, какая услуга нужна?',
    ctaText: 'Напишите — опишите груз, а мы предложим способ, срок и цену.',
  },
  page: {
    serviceIndex: 'Услуга {n}',
    factsLabel: 'Ключевые факты',
    stickyLabel: 'Цена и срок',
    stickyDays: 'Срок, ориентировочно',
    stickyHint: 'Точную цену назовём по вашему грузу — напишите.',
    sectionsLabel: 'Об услуге',
    faqTitle: 'Частые вопросы',
    relatedTitle: 'Смежные услуги',
    guidesTitle: 'Читайте в гиде',
    guidesIntro: 'Подробные статьи по теме — правила расчёта, таможня, маршруты.',
    ctaEyebrow: 'Контакты',
    fallback: {
      seoTitle: '{name} — из Китая в Узбекистан',
      seoDescription: '{short} GSR Logistics, Ташкент — работаем с Китаем с 2018 года.',
      eyebrow: 'Услуга',
      intro: '{short} Принимаем груз по адресу приёма в Китае — в Иу, Гуанчжоу или Кашгаре, — проверяем и отправляем фотоотчёт, оформляем в Ташкенте официально. Один договор, один менеджер — работаем с Китаем с 2018 года.',
      facts: [
        { label: 'Адреса приёма в Китае', value: 'Иу · Гуанчжоу · Кашгар' },
        { label: 'С Китаем', value: 'с 2018 года' },
        { label: 'Отчёт', value: 'Фотоотчёт' },
        { label: 'Языки менеджеров', value: 'Узбекский · русский · китайский' },
      ],
      sectionTitle: 'Как мы работаем?',
      sectionBody: [
        'Вы оставляете заявку — в Telegram или по телефону. Менеджер уточняет груз, город и сроки, предлагает способ и цену.',
        'Заключаем договор: цена, срок и ответственность — на бумаге. Груз, пришедший на адрес приёма в Китае, взвешиваем, обмеряем и фотографируем — отчёт приходит в Telegram.',
        'Таможенное оформление в Ташкенте берём на себя, пошлина и НДС платятся по закону. Груз забираете со склада или отправляем в регион.',
      ],
      ctaTitle: 'Есть вопрос по этой услуге?',
      ctaText: 'Напишите — груз, город, сроки, а мы предложим цену и способ доставки.',
      draft: 'Здравствуйте! У меня вопрос по услуге «{name}».',
    },
  },
  guideTitles: {
    'shipping-from-china': 'Доставка груза из Китая в Узбекистан — гид 2026',
    'cargo-pricing': 'Как считается стоимость карго',
    'air-vs-truck-vs-rail': 'Авиа, авто или ж/д — сравнение',
    'order-from-1688': 'Как заказать с 1688',
    'customs-2026': 'Таможенные платежи 2026',
    'find-supplier': 'Как найти поставщика в Китае',
    'yiwu-guangzhou': 'Рынки Иу и Гуанчжоу',
    'prohibited-goods': 'Запрещённые товары',
    'glossary': 'Словарь карго',
    'routes': 'Маршруты Китай — Ташкент',
  },
};

const en: ServicesStrings = {
  home: {
    eyebrow: '02 — Services',
    h2: 'Everything China. In one place.',
    intro: 'From sourcing to your door — one manager, one contract.',
    flagshipBadge: 'Core service',
    details: 'Learn more',
    listLabel: 'List of services',
    compare: {
      title: 'Which mode suits you?',
      truck: 'heavy and bulky cargo',
      air: 'urgent, valuable, light',
      rail: 'containers, 20ft/40ft',
    },
    meta: 'Transit times and rates are indicative and count from departure from the China warehouse · Updated {date}',
  },
  line: {
    days: 'days',
    fromKg: 'from {n} kg',
    commissionFrom: 'commission from {n}%',
    yuanPayment: 'payment in yuan',
    containers: '20ft / 40ft',
    turnkey: 'turnkey',
    customs: 'customs declaration · duty and VAT',
    photoEveryReceipt: 'photo report on every receipt',
    insurance: 'insurance {n}%',
    toOrder: 'made to order',
    withCustoms: 'customs included',
  },
  index: {
    seoTitle: 'China shipping and buying services — cargo, sourcing, customs',
    seoDescription: 'GSR Logistics services: consolidated truck cargo from China to Tashkent in 15–25 days, air in 5–10, rail containers, product sourcing, buying from 1688 and Taobao, equipment import, customs clearance, three receiving addresses in China (Yiwu, Guangzhou, Kashgar) and car import.',
    eyebrow: 'Services',
    h1: 'Shipping and buying services for China',
    intro: 'GSR Logistics handles nine China-related jobs: three receiving addresses in China — Yiwu, Guangzhou and Kashgar; consolidated truck cargo from the Yiwu warehouse via Khorgos to Tashkent in roughly 15–25 days, air cargo in 5–10, rail containers in 20–35. We source products, buy on 1688 and Taobao, import equipment turnkey and clear customs. One manager, one contract — since 2018.',
    groups: { shipping: 'Freight', buying: 'Sourcing and buying in China', paperwork: 'Paperwork and control', vehicles: 'Vehicles' },
    groupLead: {
      shipping: 'Three modes — truck, air, rail. Time and price depend on weight, volume and urgency.',
      buying: 'No Chinese needed: our managers talk to the factory, pay in yuan and check the sample.',
      paperwork: 'Documents, declaration, customs entry and quality control — before the cargo leaves.',
      vehicles: 'Cars and EVs made to order — from choosing the model to registration paperwork.',
    },
    compareTitle: 'Which mode should you choose?',
    compareIntro: 'Compare the three modes in one table. Transit times are indicative and count from departure from the China warehouse.',
    compareHead: { mode: 'Mode', days: 'Transit', min: 'Minimum', rule: 'Pricing rule', fits: 'Best for' },
    compareRows: {
      truck: { min: '1 kg', rule: 'density ≥ 170 kg/m³ — per kg, lower — per m³', fits: 'wholesale lots, heavy and bulky cargo' },
      air: { min: '0.5 kg', rule: 'per kg, volumetric weight ÷ 5,000', fits: 'urgent, valuable and light goods' },
      rail: { min: '20ft container', rule: 'per container, FCL or LCL', fits: 'large lots, machinery' },
    },
    howTitle: 'How do we start?',
    how: 'Message us on Telegram or call: cargo, city, deadline. Your manager proposes a mode and a price, we sign a contract and give you a receiving address in China — Yiwu, Guangzhou or Kashgar, whichever one your manager names — and the cargo is on its way.',
    ctaTitle: 'Not sure which service you need?',
    ctaText: 'Write to us — describe the cargo and we propose the mode, transit time and price.',
  },
  page: {
    serviceIndex: 'Service {n}',
    factsLabel: 'Key facts',
    stickyLabel: 'Price and time',
    stickyDays: 'Transit, roughly',
    stickyHint: 'We quote the exact price for your cargo — write to us.',
    sectionsLabel: 'About the service',
    faqTitle: 'Frequently asked questions',
    relatedTitle: 'Related services',
    guidesTitle: 'Read in the guides',
    guidesIntro: 'In-depth articles on the topic — pricing rules, customs, routes.',
    ctaEyebrow: 'Contact',
    fallback: {
      seoTitle: '{name} — from China to Uzbekistan',
      seoDescription: '{short} GSR Logistics, Tashkent — working with China since 2018.',
      eyebrow: 'Service',
      intro: '{short} We receive your cargo at a receiving address in China — Yiwu, Guangzhou or Kashgar — inspect it and send a photo report, and clear customs officially in Tashkent. One contract, one manager — working with China since 2018.',
      facts: [
        { label: 'Receiving addresses in China', value: 'Yiwu · Guangzhou · Kashgar' },
        { label: 'With China', value: 'since 2018' },
        { label: 'Reporting', value: 'Photo report' },
        { label: 'Manager languages', value: 'Uzbek · Russian · Chinese' },
      ],
      sectionTitle: 'How do we work?',
      sectionBody: [
        'You send a request — on Telegram or by phone. Your manager clarifies the cargo, city and deadline, then proposes a mode and a price.',
        'We sign a contract: price, transit time and liability on paper. At the receiving address in China the cargo is weighed, measured and photographed — the report lands in your Telegram.',
        'Customs clearance in Tashkent is on us; duty and VAT are paid as the law requires. You collect the cargo from the warehouse or we forward it to your region.',
      ],
      ctaTitle: 'Have a question about this service?',
      ctaText: 'Write to us — cargo, city, deadline — and we propose a price and a route.',
      draft: 'Hello! I have a question about the "{name}" service.',
    },
  },
  guideTitles: {
    'shipping-from-china': 'Shipping from China to Uzbekistan — the 2026 guide',
    'cargo-pricing': 'How cargo prices are calculated',
    'air-vs-truck-vs-rail': 'Air vs truck vs rail',
    'order-from-1688': 'How to order from 1688',
    'customs-2026': 'Uzbekistan customs duties 2026',
    'find-supplier': 'Finding a supplier in China',
    'yiwu-guangzhou': 'Yiwu and Guangzhou markets',
    'prohibited-goods': 'Prohibited goods',
    'glossary': 'Cargo glossary',
    'routes': 'China to Tashkent routes',
  },
};

export const servicesStrings: Record<Lang, ServicesStrings> = { uz, ru, en };

/** Fill `{n}` / `{name}` / `{short}` / `{date}` placeholders. */
export function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Which service pages group together on the index page. */
export const serviceGroups: Array<{ id: 'shipping' | 'buying' | 'paperwork' | 'vehicles'; keys: ServiceKey[] }> = [
  { id: 'shipping', keys: ['truck', 'air', 'rail'] },
  { id: 'buying', keys: ['sourcing', 'buying', 'equipment'] },
  { id: 'paperwork', keys: ['customs', 'warehouse'] },
  { id: 'vehicles', keys: ['cars'] },
];

import tariffs from '@/data/tariffs.json';
import { fmtNumber } from '@/lib/format';

/** One tabular "number line" per service card, composed only from tariffs.json values. */
export function serviceNumberLine(lang: Lang, key: ServiceKey): string {
  const t = servicesStrings[lang].line;
  const range = (a: number, b: number) => `${fmtNumber(a, lang)}–${fmtNumber(b, lang)} ${t.days}`;
  switch (key) {
    case 'truck': return `${range(tariffs.truck.days[0], tariffs.truck.days[1])} · ${tpl(t.fromKg, { n: 1 })}`;
    case 'air': return `${range(tariffs.air.days[0], tariffs.air.days[1])} · ${tpl(t.fromKg, { n: fmtNumber(tariffs.air.minKg, lang) })}`;
    case 'rail': return `${range(tariffs.rail.days[0], tariffs.rail.days[1])} · ${t.containers}`;
    case 'sourcing': return tpl(t.commissionFrom, { n: tariffs.extras.sourcingCommissionPct });
    case 'buying': return `${t.yuanPayment} · ${tpl(t.commissionFrom, { n: tariffs.extras.sourcingCommissionPct })}`;
    case 'equipment': return `${t.containers} · ${t.turnkey}`;
    case 'customs': return t.customs;
    case 'warehouse': return `${t.photoEveryReceipt} · ${tpl(t.insurance, { n: tariffs.extras.insurancePct })}`;
    case 'cars': return `${t.toOrder} · ${t.withCustoms}`;
  }
}
