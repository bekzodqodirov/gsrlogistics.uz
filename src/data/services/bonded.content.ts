import type { ServiceContentSource } from './types';

/**
 * Toshkentda bojxona nazoratidagi ombor va qayta yuklash — long-form page content (service 12, written 2026-11-12).
 * Every claim about GSR is the owner's answer of 2026-11-11 and nothing more:
 *   - the warehouse is in Tashkent and belongs to a PARTNER; GSR allocates space there to its clients;
 *   - cargo is stored there UNDER CUSTOMS CONTROL;
 *   - transshipment in Tashkent: truck to truck, or through the warehouse;
 *   - the transit documents are GSR's work (its own customs broker files the transit declaration);
 *   - contact: WhatsApp and Telegram; Persian or Dari is answered in Persian through a translator.
 * NOT confirmed, never printed: which legal type of warehouse it is (so the prose says "warehouse under customs
 * control", never "customs warehouse", "bonded warehouse" or "temporary-storage warehouse"); a storage time
 * limit; area, capacity, address; a storage price; a warehouse near any border; sorting, repacking or any other
 * handling service. Never "our warehouse" — it is a partner's.
 * Storage time, price and space are ON REQUEST: no price, no number of days, no hero fact with a digit. The only
 * figures are one law reference and the WhatsApp number. The site's tariffs, calculator and free storage days
 * belong to China → Tashkent cargo, and the page says so once.
 * Law quoted as neutral explanation (lex.uz, Uzbek and Russian texts re-read on 2026-11-12): Customs Code
 * art. 119 — goods in customs transit may be reloaded onto another vehicle under the control of an
 * intermediate customs office. Its time limits are never printed.
 * The existing "Tashkent warehouse" where cleared cargo from China is handed over is a different service and
 * is not described here. uz, ru and en keep the same structure (zh and fa are translated from en): key,
 * related, guideKeys, updated and callout tones must stay byte-identical in all three.
 */
const content: ServiceContentSource = {
  uz: {
    key: 'bonded',
    seo: {
      title: 'Toshkentda bojxona nazoratidagi ombor va qayta yuklash',
      description:
        'Toshkentda hamkorimizning bojxona nazoratidagi omborida joy, furadan furaga yoki ombor orqali qayta yuklash. Narx — soʻrov boʻyicha.',
    },
    hero: {
      eyebrow: 'Xizmat 12 — Ombor',
      h1: 'Toshkentda bojxona nazoratidagi ombor va yukni qayta yuklash',
      intro:
        'GSR Logistics endi Toshkentda mijozlari uchun bojxona nazoratidagi ombordan ham joy ajratadi. Ombor hamkorimizga tegishli. Yuk u yerda bojxona nazorati ostida saqlanadi. Yukni Toshkentda qayta yuklaymiz ham — furadan furaga yoki ombor orqali. Tranzit hujjatlarini ham biz rasmiylashtiramiz. Saqlash muddati va narxi har bir yuk uchun alohida kelishiladi.',
      facts: [
        { label: 'Qayerda', value: 'Toshkent' },
        { label: 'Ombor', value: 'Bojxona nazoratida' },
        { label: 'Qayta yuklash', value: 'Furadan furaga' },
        { label: 'Narx', value: 'Soʻrov boʻyicha' },
      ],
    },
    sections: [
      {
        heading: 'Bu qanday ombor?',
        body: [
          'Bu — hamkorimizning Toshkentdagi ombori: yuk unda bojxona nazorati ostida saqlanadi. Ombor GSRga emas, hamkorimizga tegishli. Biz undan mijozlarimiz uchun joy ajratamiz.',
        ],
        table: {
          caption: 'Ombor haqida qisqacha',
          head: ['Savol', 'Javob'],
          rows: [
            ['Qayerda joylashgan', 'Toshkentda'],
            ['Kimga tegishli', 'Hamkorimizga; GSR mijozlari uchun joy ajratadi'],
            ['Yuk qanday saqlanadi', 'Bojxona nazorati ostida'],
            ['GSR nima qiladi', 'Joy ajratadi, yukni qayta yuklaydi, tranzit hujjatlarini rasmiylashtiradi'],
          ],
          note: 'Ajratiladigan joy hajmi, saqlash narxi va muddati bu sahifada koʻrsatilmagan: ular har bir yuk uchun alohida kelishiladi.',
        },
      },
      {
        heading: 'Bunday ombor qachon kerak boʻladi?',
        body: [
          'Yuk Toshkentda bojxona nazorati ostida kutib turishi yoki boshqa furaga oʻtishi kerak boʻlganda. Bir necha misol:',
        ],
        bullets: [
          'Tranzit yuki keyingi furani kutmoqda',
          'Yuk Toshkentda bir furadan boshqasiga oʻtadi',
          'Yuk hujjatlari hali tayyorlanmoqda',
        ],
        callout: {
          title: 'Bular misol, vaʼda emas',
          text: 'Yukingiz uchun nima mumkinligi bojxona tartibiga bogʻliq. Yuk va uning hujjatlari haqida yozing — menejer aniqlab beradi.',
          tone: 'info',
        },
      },
      {
        heading: 'Yuk qanday qayta yuklanadi?',
        body: [
          'Ikki usulda: furadan furaga yoki ombor orqali. Ikkalasini ham Toshkentda bajaramiz.',
          'Oʻzbekiston Bojxona kodeksining 119-moddasiga koʻra, tranzit yukini oraliq bojxona organi nazorati ostida boshqa transport vositasiga qayta yuklashga yoʻl qoʻyiladi.',
          'Afgʻonistonga ketayotgan yukni ham shu yerda qayta yuklash mumkin.',
        ],
        table: {
          caption: 'Qayta yuklashning ikki usuli',
          head: ['Usul', 'Qanday bajariladi'],
          rows: [
            ['Furadan furaga', 'Yuk bir furadan ikkinchisiga toʻgʻridan-toʻgʻri oʻtkaziladi'],
            ['Ombor orqali', 'Yuk avval omborga tushiriladi, keyinroq boshqa furaga yuklanadi'],
          ],
          note: 'Qaysi usul mos kelishini menejer yuk va hujjatlarga qarab aytadi.',
        },
      },
      {
        heading: 'Hujjatlarni kim rasmiylashtiradi?',
        body: [
          'Tranzit hujjatlarini biz rasmiylashtiramiz. Tranzit deklaratsiyasini bojxonaga oʻz bojxona brokerimiz topshiradi. CMR va TIR hujjatlarini tayyorlaymiz va tekshiramiz. Batafsil — «Oʻzbekiston orqali tranzit hujjatlari» sahifasida.',
        ],
      },
      {
        heading: 'Nimalar har bir yuk uchun alohida kelishiladi?',
        body: [
          'Saqlash muddati, narx va joy hajmi. Shuning uchun bu sahifada ular boʻyicha raqam yoʻq.',
        ],
        bullets: [
          'Saqlash muddati: bojxona tartibiga bogʻliq — menejer yukingiz boʻyicha aytadi',
          'Narx: soʻrov boʻyicha — menejer hisoblab beradi',
          'Joy hajmi: yuk hajmiga qarab kelishiladi',
        ],
        callout: {
          title: 'Saytdagi raqamlar boshqa xizmatga tegishli',
          text: 'Saytdagi tariflar, kalkulyator va bepul saqlash kunlari faqat Xitoydan Toshkentga keladigan yukka tegishli.',
          tone: 'warn',
        },
      },
      {
        heading: 'Ishni qanday boshlaymiz?',
        body: [
          'WhatsApp yoki Telegramga yozing — ish shundan boshlanadi.',
        ],
        steps: [
          { title: 'Bizga yozasiz', text: 'Yuk nima ekanini, hajmi yoki ogʻirligini, qayerdan kelib qayerga ketishini va qaysi hujjatlari borligini yozing.' },
          { title: 'Menejer shartlarni aytadi', text: 'Joy ajratish mumkinmi, saqlash shartlari qanday va narx qancha — menejer yukingiz boʻyicha aytadi.' },
          { title: 'Hujjatlar rasmiylashtiriladi', text: 'Tranzit hujjatlarini rasmiylashtiramiz; tranzit deklaratsiyasini oʻz bojxona brokerimiz topshiradi.' },
          { title: 'Saqlash yoki qayta yuklash', text: 'Yuk hamkorimizning omborida bojxona nazorati ostida saqlanadi yoki boshqa furaga qayta yuklanadi — furadan furaga yoki ombor orqali.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Ombor kimniki?',
        a: 'Ombor hamkorimizga tegishli, GSRga emas. Biz undan mijozlarimiz uchun joy ajratamiz. Yuk u yerda bojxona nazorati ostida saqlanadi.',
      },
      {
        q: 'Yuk omborda qancha vaqt turishi mumkin?',
        a: 'Bu yuk qaysi bojxona tartibida turganiga bogʻliq, shuning uchun sahifada muddat koʻrsatilmagan. Yuk va uning hujjatlari haqida yozing — menejer yukingiz boʻyicha aytadi.',
      },
      {
        q: 'Saqlash va qayta yuklash qancha turadi?',
        a: 'Narx — soʻrov boʻyicha: menejer uni yuk hajmi, saqlash muddati va qayta yuklash usuliga qarab hisoblab beradi. Saytdagi tariflar va kalkulyator faqat Xitoy → Toshkent yoʻnalishiga tegishli.',
      },
      {
        q: 'Afgʻonistonga ketayotgan yukni shu yerda qayta yuklash mumkinmi?',
        a: 'Ha. Afgʻonistonga ketayotgan yukni Toshkentda furadan furaga yoki ombor orqali qayta yuklaymiz. Xitoydan kelayotgan yuk Oʻzbekiston orqali tranzit tartibida oʻtadi. Uning tranzit hujjatlarini ham biz rasmiylashtiramiz.',
      },
      {
        q: 'Bu Xitoydan kelgan yuk topshiriladigan Toshkent ombori bilan bir narsami?',
        a: 'Yoʻq, bular ikki xil xizmat. Bu sahifa hamkorimizning omborida bojxona nazorati ostida ajratiladigan joy haqida. Xitoydan kelgan yukni Toshkentda topshirish alohida xizmat boʻlib, oʻz sahifalarida yozilgan.',
      },
      {
        q: 'Qaysi tilda va qayerga yozsam boʻladi?',
        a: 'WhatsApp (+998 90 175 78 00) yoki Telegramga yozing. Fors yoki dari tilida yozsangiz, tarjimon yordamida forscha javob beramiz. Ingliz, rus va oʻzbek tillarida ham javob beramiz.',
      },
    ],
    related: ['transit', 'afghanistan', 'warehouse'],
    guideKeys: ['uzbekistan-transit', 'china-afghanistan'],
    cta: {
      title: 'Toshkentda joy yoki qayta yuklash kerakmi? Yozing.',
      text: 'Yuk nima ekanini, hajmi yoki ogʻirligini, qayerdan kelib qayerga ketishini va qancha vaqt turishi kerakligini WhatsApp yoki Telegramga yozing. Menejer shartlar va narxni aytadi.',
      draft: 'Salom! Toshkentda bojxona nazoratidagi ombor va qayta yuklash boʻyicha savolim bor. Yuk: … Hajmi yoki ogʻirligi: … Yoʻnalish: …',
    },
    updated: '2026-11-13',
  },

  ru: {
    key: 'bonded',
    seo: {
      title: 'Склад под таможенным контролем в Ташкенте и перегрузка',
      description:
        'Место на складе партнёра под таможенным контролем в Ташкенте, перегрузка из фуры в фуру или через склад. Цена — по запросу.',
    },
    hero: {
      eyebrow: 'Услуга 12 — Склад',
      h1: 'Склад под таможенным контролем в Ташкенте и перегрузка груза',
      intro:
        'GSR Logistics теперь выделяет клиентам и место на складе под таможенным контролем в Ташкенте. Склад принадлежит нашему партнёру. Груз хранится там под таможенным контролем. В Ташкенте мы также перегружаем груз — из фуры в фуру или через склад. Транзитные документы тоже оформляем мы. Срок хранения и цена согласуются отдельно для каждого груза.',
      facts: [
        { label: 'Где', value: 'Ташкент' },
        { label: 'Склад', value: 'Под таможенным контролем' },
        { label: 'Перегрузка', value: 'Из фуры в фуру' },
        { label: 'Цена', value: 'По запросу' },
      ],
    },
    sections: [
      {
        heading: 'Что это за склад?',
        body: [
          'Это склад нашего партнёра в Ташкенте: груз хранится на нём под таможенным контролем. Склад принадлежит партнёру, а не GSR. Мы выделяем на нём место для своих клиентов.',
        ],
        table: {
          caption: 'Коротко о складе',
          head: ['Вопрос', 'Ответ'],
          rows: [
            ['Где находится', 'В Ташкенте'],
            ['Кому принадлежит', 'Партнёру; GSR выделяет место своим клиентам'],
            ['Как хранится груз', 'Под таможенным контролем'],
            ['Что делает GSR', 'Выделяет место, перегружает груз, оформляет транзитные документы'],
          ],
          note: 'Объём места, цена и срок хранения на этой странице не указаны: они согласуются отдельно под каждый груз.',
        },
      },
      {
        heading: 'Когда нужен такой склад?',
        body: [
          'Когда грузу нужно подождать в Ташкенте под таможенным контролем или перейти на другую фуру. Несколько примеров:',
        ],
        bullets: [
          'Транзитный груз ждёт следующую фуру',
          'Груз переходит в Ташкенте с одной фуры на другую',
          'Документы на груз ещё готовятся',
        ],
        callout: {
          title: 'Это примеры, а не обещания',
          text: 'Что возможно для вашего груза, зависит от таможенной процедуры. Напишите о грузе и его документах — менеджер уточнит.',
          tone: 'info',
        },
      },
      {
        heading: 'Как проходит перегрузка (перевалка) груза?',
        body: [
          'Двумя способами: из фуры в фуру или через склад. И то и другое делаем в Ташкенте.',
          'По статье 119 Таможенного кодекса Узбекистана транзитный товар разрешается перегружать на другое транспортное средство под контролем промежуточного таможенного органа.',
          'Груз, который идёт в Афганистан, тоже можно перегрузить здесь.',
        ],
        table: {
          caption: 'Два способа перегрузки',
          head: ['Способ', 'Как это происходит'],
          rows: [
            ['Из фуры в фуру', 'Груз переносят напрямую из одной фуры в другую'],
            ['Через склад', 'Груз сначала выгружают на склад, а позже грузят в другую фуру'],
          ],
          note: 'Какой способ подходит, менеджер скажет по грузу и документам.',
        },
      },
      {
        heading: 'Кто оформляет документы?',
        body: [
          'Транзитные документы оформляем мы. Транзитную декларацию подаёт в таможню наш собственный таможенный брокер. Документы CMR и TIR мы готовим и проверяем. Подробнее — на странице «Транзитные документы в Узбекистане».',
        ],
      },
      {
        heading: 'Что согласуется отдельно под каждый груз?',
        body: [
          'Срок хранения, цена и объём места. Поэтому цифр по ним на этой странице нет.',
        ],
        bullets: [
          'Срок хранения: зависит от таможенной процедуры — менеджер назовёт его под ваш груз',
          'Цена: по запросу — её считает менеджер',
          'Объём места: согласуется по объёму груза',
        ],
        callout: {
          title: 'Цифры на сайте относятся к другой услуге',
          text: 'Тарифы, калькулятор и дни бесплатного хранения на сайте относятся только к грузам, которые идут из Китая в Ташкент.',
          tone: 'warn',
        },
      },
      {
        heading: 'С чего начать?',
        body: [
          'Напишите в WhatsApp или Telegram — с этого начинается работа.',
        ],
        steps: [
          { title: 'Вы пишете нам', text: 'Напишите, что за груз, его объём или вес, откуда он идёт и куда, какие документы на него есть.' },
          { title: 'Менеджер называет условия', text: 'Можно ли выделить место, каковы условия хранения и сколько это стоит — менеджер скажет под ваш груз.' },
          { title: 'Оформляются документы', text: 'Оформляем транзитные документы; транзитную декларацию подаёт наш собственный таможенный брокер.' },
          { title: 'Хранение или перегрузка', text: 'Груз хранится на складе партнёра под таможенным контролем или перегружается на другую фуру — из фуры в фуру или через склад.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Чей это склад?',
        a: 'Склад принадлежит партнёру, а не GSR. Мы выделяем на нём место для своих клиентов. Груз хранится там под таможенным контролем.',
      },
      {
        q: 'Сколько груз может находиться на складе?',
        a: 'Это зависит от таможенной процедуры, под которой находится груз, поэтому срок на странице не указан. Напишите о грузе и его документах — менеджер ответит по вашему грузу.',
      },
      {
        q: 'Сколько стоят хранение и перегрузка?',
        a: 'Цена — по запросу: менеджер считает её по объёму груза, сроку хранения и способу перегрузки. Тарифы и калькулятор на сайте относятся только к направлению Китай → Ташкент.',
      },
      {
        q: 'Можно ли перегрузить здесь груз, который идёт в Афганистан?',
        a: 'Да. Груз, который идёт в Афганистан, мы перегружаем в Ташкенте из фуры в фуру или через склад. Груз из Китая идёт через Узбекистан транзитом. Транзитные документы на него тоже оформляем мы.',
      },
      {
        q: 'Это то же самое, что склад в Ташкенте, где выдают грузы из Китая?',
        a: 'Нет, это две разные услуги. Эта страница — о месте под таможенным контролем на складе партнёра. Выдача в Ташкенте грузов, пришедших из Китая, — отдельная услуга, она описана на своих страницах.',
      },
      {
        q: 'На каком языке и куда писать?',
        a: 'Пишите в WhatsApp (+998 90 175 78 00) или в Telegram. Если напишете на фарси или дари, ответим на фарси с помощью переводчика. Отвечаем также на английском, русском и узбекском.',
      },
    ],
    related: ['transit', 'afghanistan', 'warehouse'],
    guideKeys: ['uzbekistan-transit', 'china-afghanistan'],
    cta: {
      title: 'Нужно место или перегрузка в Ташкенте? Напишите нам.',
      text: 'Напишите в WhatsApp или Telegram, что за груз, его объём или вес, откуда он идёт и куда, сколько ему нужно простоять. Менеджер назовёт условия и цену.',
      draft: 'Здравствуйте! У меня вопрос по складу под таможенным контролем и перегрузке в Ташкенте. Груз: … Объём или вес: … Маршрут: …',
    },
    updated: '2026-11-13',
  },

  en: {
    key: 'bonded',
    seo: {
      title: 'Warehouse under customs control in Tashkent & transshipment',
      description:
        'Space in a partner’s warehouse under customs control in Tashkent, and transshipment truck to truck or through the warehouse. Price on request.',
    },
    hero: {
      eyebrow: 'Service 12 — Warehouse',
      h1: 'Warehouse under customs control in Tashkent, and transshipment',
      intro:
        'GSR Logistics now also allocates space for its clients in a warehouse under customs control in Tashkent. The warehouse belongs to our partner. Cargo is stored there under customs control. We also reload cargo in Tashkent — truck to truck or through the warehouse. We handle the transit documents as well. The storage time and the price are agreed for each cargo separately.',
      facts: [
        { label: 'Where', value: 'Tashkent' },
        { label: 'Warehouse', value: 'Under customs control' },
        { label: 'Transshipment', value: 'Truck to truck' },
        { label: 'Price', value: 'On request' },
      ],
    },
    sections: [
      {
        heading: 'What kind of warehouse is it?',
        body: [
          'It is a partner’s warehouse in Tashkent, where cargo is stored under customs control. The warehouse belongs to the partner, not to GSR. We allocate space in it for our clients.',
        ],
        table: {
          caption: 'The warehouse in brief',
          head: ['Question', 'Answer'],
          rows: [
            ['Where it is', 'In Tashkent'],
            ['Who it belongs to', 'A partner; GSR allocates space for its clients'],
            ['How cargo is stored', 'Under customs control'],
            ['What GSR does', 'Allocates space, reloads cargo, handles the transit documents'],
          ],
          note: 'This page states no amount of space, storage price or storage time: they are agreed separately for each cargo.',
        },
      },
      {
        heading: 'When is such a warehouse needed?',
        body: [
          'When cargo has to wait in Tashkent under customs control or move to another truck. A few examples:',
        ],
        bullets: [
          'Transit cargo is waiting for its next truck',
          'Cargo moves from one truck to another in Tashkent',
          'The documents for the cargo are still being prepared',
        ],
        callout: {
          title: 'These are examples, not promises',
          text: 'What is possible for your cargo depends on the customs procedure. Tell us about the cargo and its documents, and the manager will check.',
          tone: 'info',
        },
      },
      {
        heading: 'How is cargo reloaded?',
        body: [
          'In two ways: truck to truck, or through the warehouse. We do both in Tashkent.',
          'Under Article 119 of the Customs Code of Uzbekistan, goods in transit may be reloaded onto another vehicle under the control of an intermediate customs office.',
          'Cargo bound for Afghanistan can be reloaded here as well.',
        ],
        table: {
          caption: 'Two ways to reload cargo',
          head: ['Method', 'How it works'],
          rows: [
            ['Truck to truck', 'The cargo is moved straight from one truck to the other'],
            ['Through the warehouse', 'The cargo is first unloaded into the warehouse and later loaded onto another truck'],
          ],
          note: 'The manager tells you which method suits your cargo and its documents.',
        },
      },
      {
        heading: 'Who handles the documents?',
        body: [
          'We handle the transit documents. Our own customs broker files the transit declaration at customs. We prepare and check the CMR and TIR documents. Details are on the page “Transit documents in Uzbekistan”.',
        ],
      },
      {
        heading: 'What is agreed separately for each cargo?',
        body: [
          'The storage time, the price and the amount of space. That is why this page gives no figures for them.',
        ],
        bullets: [
          'Storage time: it depends on the customs procedure; the manager tells you for your cargo',
          'Price: on request; the manager calculates it',
          'Amount of space: agreed to match the volume of the cargo',
        ],
        callout: {
          title: 'The figures on this site belong to another service',
          text: 'The tariffs, the calculator and the free storage days on this site apply only to cargo that travels from China to Tashkent.',
          tone: 'warn',
        },
      },
      {
        heading: 'How do I start?',
        body: [
          'Message us on WhatsApp or Telegram — that is where the work starts.',
        ],
        steps: [
          { title: 'You write to us', text: 'Tell us what the cargo is, its volume or weight, where it comes from and where it is going, and which documents it has.' },
          { title: 'The manager states the terms', text: 'Whether space can be allocated, what the storage terms are and what it costs — the manager tells you for your cargo.' },
          { title: 'The documents are prepared', text: 'We handle the transit documents; our own customs broker files the transit declaration.' },
          { title: 'Storage or transshipment', text: 'The cargo is stored in the partner’s warehouse under customs control, or reloaded onto another truck — truck to truck or through the warehouse.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Whose warehouse is it?',
        a: 'The warehouse belongs to a partner, not to GSR. We allocate space in it for our clients. The cargo is stored there under customs control.',
      },
      {
        q: 'How long can cargo stay in the warehouse?',
        a: 'It depends on the customs procedure the cargo is under, so this page states no time limit. Tell us about the cargo and its documents, and the manager will answer for your cargo.',
      },
      {
        q: 'What do storage and transshipment cost?',
        a: 'The price is on request: the manager calculates it from the volume of the cargo, the storage time and the way it is reloaded. The tariffs and the calculator on this site apply to the China → Tashkent direction only.',
      },
      {
        q: 'Can cargo going to Afghanistan be reloaded here?',
        a: 'Yes. We reload cargo bound for Afghanistan in Tashkent, truck to truck or through the warehouse. Cargo from China crosses Uzbekistan in transit. We handle its transit documents too.',
      },
      {
        q: 'Is this the same as the Tashkent warehouse where cargo from China is handed over?',
        a: 'No, these are two different services. This page is about space under customs control in a partner’s warehouse. Handing over cargo from China in Tashkent is a separate service, described on its own pages.',
      },
      {
        q: 'In which language can I write, and where?',
        a: 'Write on WhatsApp (+998 90 175 78 00) or Telegram. Write to us in Persian or Dari — we answer in Persian with the help of a translator. We also answer in English, Russian and Uzbek.',
      },
    ],
    related: ['transit', 'afghanistan', 'warehouse'],
    guideKeys: ['uzbekistan-transit', 'china-afghanistan'],
    cta: {
      title: 'Need space or transshipment in Tashkent? Write to us.',
      text: 'Tell us on WhatsApp or Telegram what the cargo is, its volume or weight, where it comes from and where it is going, and how long it needs to stay. The manager will tell you the terms and the price.',
      draft: 'Hello! I have a question about the warehouse under customs control and transshipment in Tashkent. Cargo: … Volume or weight: … Route: …',
    },
    updated: '2026-11-13',
  },
};

export default content;
