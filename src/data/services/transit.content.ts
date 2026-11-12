import type { ServiceContentSource } from './types';

/**
 * Oʻzbekiston orqali tranzit hujjatlari — long-form page content (service 11, written 2026-11-12).
 * Every claim about GSR is the owner's answer of 2026-11-11 and nothing more:
 *   - the transit declaration is filed at customs by GSR's OWN customs broker;
 *   - CMR and TIR documents are prepared and checked;
 *   - help obtaining permits ("ruxsatnoma", colloquially "dozvol") for foreign trucks; the truck is met at
 *     the border and seen off — NO border crossing is named, the manager answers for the route;
 *   - help with security (a guarantee) for customs payments on transit cargo;
 *   - the warehouse under customs control in Tashkent is a PARTNER's; transshipment truck to truck or through
 *     the warehouse; help with certificates and permits; cargo insurance for the time of carriage;
 *   - contact: WhatsApp and Telegram; Persian or Dari is answered in Persian through a translator.
 * The price is ON REQUEST: no price, no number of days, no fee, no time limit, and no hero fact with a digit.
 * The only figures are the law references and the WhatsApp number.
 * Law quoted as neutral explanation (lex.uz texts downloaded 2026-11-11, re-read 2026-11-12): Customs Code
 * art. 118 (transit declaration + accompanying documents), art. 119 (reloading and temporary storage of
 * transit goods under an intermediate customs office), art. 222 (security for customs payments is one of the
 * measures for foreign goods carried under customs control); Cabinet of Ministers resolution No. 737 of
 * 31.12.2022 as amended on 20.07.2026 — point 2 and Regulation points 2, 3, 6, 7, 8, 13 (electronic filing in
 * "E-Tranzit" or "us-uz.gov.uz", before or at the crossing; who files; the documents for road transit; a TIR
 * Carnet with advance information is accepted as the transit declaration). Never print the time limits, fees
 * or escort rules of those texts.
 * Never add: a country or a destination the owner has not confirmed; a named border crossing; a claim of
 * experience, volume or schedule; "our warehouse"; a storage time limit.
 * uz, ru and en keep the same structure (zh and fa are translated from en): key, related, guideKeys, updated
 * and callout tones must stay byte-identical in all three.
 */
const content: ServiceContentSource = {
  uz: {
    key: 'transit',
    seo: {
      title: 'Oʻzbekistonda tranzit hujjatlari: deklaratsiya, CMR, TIR',
      description:
        'Oʻzbekiston orqali tranzit hujjatlari: deklaratsiyani oʻz bojxona brokerimiz topshiradi. CMR, TIR, ruxsatnoma, chegarada kutib olish.',
    },
    hero: {
      eyebrow: 'Xizmat 11 — Tranzit',
      h1: 'Oʻzbekiston orqali tranzit: hujjatlarni biz rasmiylashtiramiz',
      intro:
        'Toshkentdagi GSR Logistics kompaniyasi endi Oʻzbekiston orqali tranzit tartibida oʻtadigan yuklarning hujjatlarini ham rasmiylashtiradi. Tranzit deklaratsiyasini bojxonaga oʻz bojxona brokerimiz topshiradi. CMR va TIR hujjatlarini tayyorlaymiz va tekshiramiz. Xorijiy furalar uchun ruxsatnoma olishda yordam beramiz, furani chegarada kutib olamiz va kuzatib qoʻyamiz. Tranzit yuki uchun bojxona toʻlovlari toʻlanishini taʼminlashda ham yordam beramiz. Narx har bir yuk uchun alohida hisoblanadi.',
      facts: [
        { label: 'Tranzit deklaratsiyasi', value: 'Oʻz bojxona brokerimiz' },
        { label: 'Avtotashuv hujjatlari', value: 'CMR · TIR' },
        { label: 'Chegarada', value: 'Kutib olamiz' },
        { label: 'Narx', value: 'Soʻrov boʻyicha' },
      ],
    },
    sections: [
      {
        heading: 'Tranzit boʻyicha aniq nima qilamiz?',
        body: [
          'Toʻrt ishni bajaramiz: tranzit deklaratsiyasini topshiramiz, CMR va TIR hujjatlarini tayyorlaymiz, ruxsatnoma olishda yordam beramiz va furani chegarada kutib olamiz, bojxona toʻlovlari toʻlanishini taʼminlashda koʻmaklashamiz.',
          'Bularning qaysi biri kerakligini menejer yukingiz va yoʻnalishingizga qarab aytadi.',
        ],
        table: {
          caption: 'Tranzit boʻyicha toʻrt xizmat',
          head: ['Xizmat', 'Nima qilamiz'],
          rows: [
            ['Tranzit deklaratsiyasi', 'Deklaratsiyani bojxonaga oʻz bojxona brokerimiz topshiradi'],
            ['CMR va TIR hujjatlari', 'Xalqaro avtomobil tashuvi hujjatlarini tayyorlaymiz va tekshiramiz'],
            ['Ruxsatnoma va chegara', 'Xorijiy furalar uchun ruxsatnoma («dozvol») olishda yordam beramiz, furani chegarada kutib olamiz va kuzatib qoʻyamiz'],
            ['Bojxona toʻlovlari toʻlanishini taʼminlash', 'Tranzit yuki uchun taʼminotni (kafolatni) rasmiylashtirishda yordam beramiz'],
          ],
          note: 'Narx — soʻrov boʻyicha: menejer uni yukingiz boʻyicha hisoblab beradi.',
        },
      },
      {
        heading: 'Tranzit deklaratsiyasi nima va uni kim topshiradi?',
        body: [
          'Tranzit deklaratsiyasi — Oʻzbekiston orqali tranzit tartibida oʻtadigan yuk uchun bojxona organiga topshiriladigan hujjat. Unda tovar va transport vositasi haqidagi maʼlumotlar koʻrsatiladi. Bojxona shu hujjat asosida yukni joʻnatuvchi bojxona organidan tovar kelib tushadigan bojxona organigacha nazorat qiladi.',
          'Vazirlar Mahkamasining 2022-yil 31-dekabrdagi 737-son qaroriga koʻra, deklaratsiyani deklarantning oʻzi yoki bojxona rasmiylashtiruvi boʻyicha mutaxassis topshiradi. Bunday mutaxassis deklarantning yoki u bilan shartnoma tuzgan bojxona brokerining xodimi boʻladi. GSRning oʻz bojxona brokeri bor — tranzit deklaratsiyasini oʻzimiz topshiramiz.',
          'Deklaratsiya elektron shaklda topshiriladi — bojxonaning «E-Tranzit» axborot tizimi yoki us-uz.gov.uz tizimi orqali, elektron raqamli imzo bilan. U yuk bojxona chegarasini kesib oʻtgunga qadar yoki kesib oʻtayotgan vaqtda topshiriladi. Bu tartib ham shu qaror bilan belgilangan.',
        ],
        callout: {
          title: 'Oldindan yozing',
          text: 'Deklaratsiyani yuk chegaraga yetib kelmasidan oldin ham topshirish mumkin. Shuning uchun fura yoʻlga chiqishidan oldin yozing — hujjatlarni tekshirishga vaqt qoladi.',
          tone: 'info',
        },
      },
      {
        heading: 'Avtotransportda tranzit uchun qaysi hujjatlar kerak?',
        body: [
          'Tranzit deklaratsiyasi va tovarning kuzatuv hujjatlari kerak — buni Oʻzbekiston Bojxona kodeksining 118-moddasi belgilaydi. Kuzatuv hujjatlari deklaratsiyaga elektron nusxada ilova qilinadi. Vazirlar Mahkamasining 737-son qarori bilan tasdiqlangan nizom (2026-yil noyabr holatiga koʻra) avtotransport uchun ularni quyidagicha sanab oʻtadi:',
        ],
        bullets: [
          'Avtotransport vositasini roʻyxatdan oʻtkazish toʻgʻrisidagi guvohnoma',
          'Xorijiy avtotransport vositasi uchun ruxsatnoma — Oʻzbekistonning xalqaro shartnomalarida nazarda tutilgan hollarda',
          'CMR — xalqaro tovar-transport yukxati',
          'Tijorat hujjatlari — masalan, invoys va qadoqlash roʻyxati',
          'Taqiq va cheklovlarga rioya etilganini tasdiqlovchi hujjatlar — tovarni faqat shunday hujjatlar bilan olib oʻtish mumkin boʻlsa',
        ],
        callout: {
          title: 'Aniq roʻyxat yukka bogʻliq',
          text: 'Aynan yukingizga qaysi hujjatlar kerakligini menejer aytadi. Qoʻlingizdagi hujjatlar roʻyxatini yuboring — tekshirib beramiz. Yuk TIR daftarchasi bilan tashilsa, tartib boshqacha: bu haqda quyidagi savol-javobda yozilgan.',
          tone: 'info',
        },
      },
      {
        heading: 'Ruxsatnoma va chegara: nimada yordam beramiz?',
        body: [
          'Xorijiy furalar uchun ruxsatnoma olishda yordam beramiz, furani chegarada kutib olamiz va kuzatib qoʻyamiz.',
          'Ruxsatnoma — xorijiy avtotransport vositasining Oʻzbekiston hududiga kirishi, undan chiqishi va tranzit tartibida oʻtishi uchun vakolatli organ beradigan hujjat. U Oʻzbekistonning xalqaro shartnomalarida nazarda tutilgan hollarda talab qilinadi. Tashuvchilar uni koʻpincha «dozvol» deb ataydi.',
          'Fura Oʻzbekistonga qaysi chegara postidan kirishini va qayerdan chiqishini yozing. Menejer shu yoʻnalish boʻyicha javob beradi: ruxsatnoma kerakmi va fura chegarada qanday kutib olinadi.',
        ],
      },
      {
        heading: 'Bojxona toʻlovlari toʻlanishini taʼminlash nima?',
        body: [
          'Bojxona toʻlovlari toʻlanishini taʼminlash — chet el tovari bojxona nazorati ostida tashilayotganda Bojxona kodeksida nazarda tutilgan choralardan biri. Bojxona uchun bu — bojxona toʻlovlari toʻlanishining kafolati. Kundalik tilda uni bojxona kafolati deb atashadi.',
          'Tranzit yuki uchun shunday taʼminotni rasmiylashtirishda yordam beramiz. Yukingizga taʼminot kerakmi va u qanday rasmiylashtiriladi — menejer aniqlab beradi.',
        ],
      },
      {
        heading: 'Yuk toʻxtashi yoki boshqa furaga oʻtishi kerak boʻlsa-chi?',
        body: [
          'Bunday holda yukni Toshkentda bojxona nazorati ostida saqlash va qayta yuklash mumkin. Bojxona kodeksining 119-moddasiga koʻra, tranzit yukini oraliq bojxona organi nazorati ostida boshqa transport vositasiga qayta yuklashga va vaqtincha saqlash uchun tushirishga yoʻl qoʻyiladi.',
          'Toshkentda hamkorimizning bojxona nazoratidagi omboridan joy ajratamiz. Yukni furadan furaga yoki ombor orqali qayta yuklaymiz. Batafsil — «Toshkentda bojxona nazoratidagi ombor» sahifasida.',
        ],
      },
      {
        heading: 'Bu xizmat kimlar uchun?',
        body: [
          'Xizmat yuki Oʻzbekiston orqali oʻtadigan tashuvchilar, ekspeditorlar va yuk egalari uchun — xorijiy boʻlsa ham, oʻzbekistonlik boʻlsa ham.',
        ],
        bullets: [
          'Tashuvchilar va transport kompaniyalariga: tranzit deklaratsiyasini topshiramiz, ruxsatnoma olishda yordam beramiz, furani chegarada kutib olamiz va kuzatib qoʻyamiz',
          'Ekspeditorlarga: yukning Oʻzbekiston hududidagi tranzit hujjatlarini rasmiylashtiramiz, CMR va TIR hujjatlarini tekshiramiz',
          'Yuk egalariga: tranzit hujjatlarini rasmiylashtiramiz, bojxona toʻlovlari toʻlanishini taʼminlashda yordam beramiz, zarur boʻlsa — Toshkentda bojxona nazoratidagi ombordan joy ajratamiz',
          'Yukini Xitoydan Afgʻonistonga oʻzimiz tashiydigan mijozlarga: tranzit hujjatlarini shu tartibda rasmiylashtiramiz',
        ],
        callout: {
          title: 'Qoʻshimcha xizmatlar',
          text: 'Tovar uchun sertifikat va ruxsat beruvchi hujjatlarni olishda yordam beramiz: muvofiqlik sertifikati, fitosanitariya sertifikati va boshqa hujjatlar. Tashish vaqti uchun yuk sugʻurtasi ham bor.',
          tone: 'info',
        },
      },
    ],
    faq: [
      {
        q: 'Furam yoki yukim uchun tranzit deklaratsiyasini topshirib bera olasizmi?',
        a: 'Ha. GSRning oʻz bojxona brokeri bor, tranzit deklaratsiyasini bojxonaga oʻzimiz topshiramiz. Yuk nima ekanini, qayerdan qayerga ketayotganini va fura qaysi chegara postidan kirishini yozing — menejer kerakli hujjatlar roʻyxatini aytadi.',
      },
      {
        q: 'TIR daftarchasi boʻlsa, alohida tranzit deklaratsiyasi kerakmi?',
        a: 'Yoʻq — Vazirlar Mahkamasining 737-son qarori bilan tasdiqlangan nizomga koʻra, yuk TIR daftarchasi (xalqaro yoʻllarda tashish daftarchasi) asosida, bojxonaga dastlabki axborot taqdim etilgan holda tashilsa, tranzit deklaratsiyasi talab etilmaydi. Bunday holda TIR daftarchasining oʻzi tranzit deklaratsiyasi sifatida qabul qilinadi. Tashuvingizga nima tegishli ekanini menejer tasdiqlaydi.',
      },
      {
        q: 'Furani qaysi chegara postida kutib olasiz?',
        a: 'Bu furaning yoʻnalishiga bogʻliq, shuning uchun sahifada chegara postlari sanab oʻtilmagan. Fura Oʻzbekistonga qayerdan kirishini yozing — menejer shu post boʻyicha javob beradi.',
      },
      {
        q: 'Tranzit hujjatlari qancha turadi?',
        a: 'Narx — soʻrov boʻyicha: menejer uni yuk, yoʻnalish va kerakli hujjatlarga qarab hisoblab beradi. Bu sahifada tarif yoʻq. Saytdagi tariflar va kalkulyator faqat Xitoy → Toshkent yoʻnalishiga tegishli.',
      },
      {
        q: 'Xorijiy tashuvchilar va ekspeditorlar bilan ishlaysizmi?',
        a: 'Ha, bu xizmat aynan ular uchun. Yuki yoki furasi Oʻzbekiston orqali oʻtadigan xorijiy va mahalliy tashuvchilar, ekspeditorlar hamda yuk egalari uchun tranzit hujjatlarini rasmiylashtiramiz.',
      },
      {
        q: 'Qaysi tilda va qayerga yozsam boʻladi?',
        a: 'WhatsApp (+998 90 175 78 00) yoki Telegramga yozing. Fors yoki dari tilida yozsangiz, tarjimon yordamida forscha javob beramiz. Ingliz, rus va oʻzbek tillarida ham javob beramiz.',
      },
    ],
    related: ['bonded', 'afghanistan', 'customs'],
    guideKeys: [],
    cta: {
      title: 'Yukingiz Oʻzbekiston orqali oʻtadimi? Yozing.',
      text: 'Yuk nima ekanini, qayerdan qayerga ketayotganini, fura qaysi chegara postidan kirishini va qoʻlingizda qaysi hujjatlar borligini WhatsApp yoki Telegramga yozing. Menejer kerakli hujjatlar va narxni aytadi.',
      draft: 'Salom! Oʻzbekiston orqali tranzit hujjatlari boʻyicha savolim bor. Yuk: … Yoʻnalish: … Chegara posti: …',
    },
    updated: '2026-11-12',
  },

  ru: {
    key: 'transit',
    seo: {
      title: 'Транзитные документы в Узбекистане: декларация, CMR, TIR',
      description:
        'Транзит через Узбекистан: декларацию подаёт наш собственный таможенный брокер. CMR, TIR, разрешения, встреча фуры на границе.',
    },
    hero: {
      eyebrow: 'Услуга 11 — Транзит',
      h1: 'Транзит через Узбекистан: документы оформляем мы',
      intro:
        'GSR Logistics, логистическая компания из Ташкента, теперь оформляет и транзитные документы на грузы, которые идут через Узбекистан транзитом. Транзитную декларацию подаёт в таможню наш собственный таможенный брокер. Документы CMR и TIR мы готовим и проверяем. Помогаем получить разрешения для иностранных фур, встречаем фуру на границе и провожаем её. Помогаем и с обеспечением уплаты таможенных платежей по транзитному грузу. Цена считается отдельно для каждого груза.',
      facts: [
        { label: 'Транзитная декларация', value: 'Свой таможенный брокер' },
        { label: 'Автотранспортные документы', value: 'CMR · TIR' },
        { label: 'На границе', value: 'Встречаем фуру' },
        { label: 'Цена', value: 'По запросу' },
      ],
    },
    sections: [
      {
        heading: 'Что именно мы делаем по транзиту?',
        body: [
          'Четыре вещи: подаём транзитную декларацию, готовим документы CMR и TIR, помогаем получить разрешения и встречаем фуру на границе, помогаем с обеспечением уплаты таможенных платежей.',
          'Что из этого нужно вам, менеджер скажет по вашему грузу и маршруту.',
        ],
        table: {
          caption: 'Четыре услуги по транзиту',
          head: ['Услуга', 'Что делаем'],
          rows: [
            ['Транзитная декларация', 'Декларацию подаёт в таможню наш собственный таможенный брокер'],
            ['Документы CMR и TIR', 'Готовим и проверяем международные автотранспортные документы'],
            ['Разрешения и граница', 'Помогаем получить разрешение («дозвол») для иностранных фур, встречаем фуру на границе и провожаем её'],
            ['Обеспечение уплаты таможенных платежей', 'Помогаем оформить обеспечение (гарантию) для транзитного груза'],
          ],
          note: 'Цена — по запросу: менеджер считает её под ваш груз.',
        },
      },
      {
        heading: 'Что такое транзитная декларация и кто её подаёт?',
        body: [
          'Транзитная декларация — документ, который подаётся в таможенный орган на груз, идущий через Узбекистан транзитом. В ней указываются сведения о товаре и о транспортном средстве. По этому документу таможня контролирует груз от таможенного органа отправления до таможенного органа назначения.',
          'По постановлению Кабинета Министров № 737 от 31 декабря 2022 г. декларацию подаёт сам декларант или специалист по таможенному оформлению. Такой специалист работает у декларанта или у таможенного брокера, с которым декларант заключил договор. У GSR есть свой таможенный брокер — транзитную декларацию мы подаём сами.',
          'Декларация подаётся в электронном виде — через информационную систему таможни «E-Tranzit» или систему us-uz.gov.uz, с электронной цифровой подписью. Её подают до пересечения таможенной границы или в момент пересечения. Этот порядок установлен тем же постановлением.',
        ],
        callout: {
          title: 'Пишите заранее',
          text: 'Декларацию можно подать и до того, как груз подошёл к границе. Поэтому пишите до выезда фуры — останется время проверить документы.',
          tone: 'info',
        },
      },
      {
        heading: 'Какие документы нужны для транзита автотранспортом?',
        body: [
          'Нужны транзитная декларация и товаросопроводительные документы — так требует статья 118 Таможенного кодекса Узбекистана. Товаросопроводительные документы прилагаются к декларации в виде электронных копий. Положение, утверждённое постановлением Кабинета Министров № 737 (в редакции на ноябрь 2026 г.), перечисляет их для автотранспорта так:',
        ],
        bullets: [
          'Свидетельство о регистрации автотранспортного средства',
          'Разрешение для иностранного автотранспортного средства — в случаях, предусмотренных международными договорами Узбекистана',
          'CMR — международная товарно-транспортная накладная',
          'Коммерческие документы — например, инвойс и упаковочный лист',
          'Документы, подтверждающие соблюдение запретов и ограничений, — если товар можно перемещать только при их наличии',
        ],
        callout: {
          title: 'Точный набор зависит от груза',
          text: 'Какие документы нужны именно вашему грузу, скажет менеджер. Пришлите список документов, которые у вас есть, — мы его проверим. Если груз идёт по книжке МДП (TIR Carnet), порядок другой: об этом написано в вопросах и ответах ниже.',
          tone: 'info',
        },
      },
      {
        heading: 'Разрешения и граница: чем мы помогаем?',
        body: [
          'Помогаем получить разрешения для иностранных фур, встречаем фуру на границе и провожаем её.',
          'Разрешение — документ уполномоченного органа на въезд иностранного автотранспортного средства в Узбекистан, выезд из него и транзитный проезд. Оно требуется в случаях, предусмотренных международными договорами Узбекистана. Перевозчики часто называют его «дозвол».',
          'Напишите, через какой пограничный переход фура въезжает в Узбекистан и где выезжает. Менеджер ответит по этому маршруту: нужно ли разрешение и как фуру встретят на границе.',
        ],
      },
      {
        heading: 'Что такое обеспечение уплаты таможенных платежей?',
        body: [
          'Обеспечение уплаты таможенных платежей — одна из мер, которые Таможенный кодекс предусматривает при перевозке иностранного товара под таможенным контролем. Для таможни это гарантия того, что таможенные платежи будут уплачены. В обиходе его называют таможенной гарантией.',
          'Мы помогаем оформить такое обеспечение для транзитного груза. Нужно ли оно вашему грузу и как оно оформляется, уточнит менеджер.',
        ],
      },
      {
        heading: 'А если грузу нужно остановиться или перейти на другую фуру?',
        body: [
          'Тогда груз можно хранить и перегружать в Ташкенте под таможенным контролем. По статье 119 Таможенного кодекса транзитный товар разрешается под контролем промежуточного таможенного органа перегружать на другое транспортное средство и разгружать для временного складирования.',
          'В Ташкенте мы выделяем место на складе партнёра, где груз хранится под таможенным контролем. Перегружаем груз из фуры в фуру или через склад. Подробнее — на странице «Склад под таможенным контролем в Ташкенте».',
        ],
      },
      {
        heading: 'Для кого эта услуга?',
        body: [
          'Услуга — для перевозчиков, экспедиторов и владельцев грузов, чей груз идёт через Узбекистан: и иностранных, и узбекистанских.',
        ],
        bullets: [
          'Перевозчикам и транспортным компаниям: подаём транзитную декларацию, помогаем получить разрешения, встречаем фуру на границе и провожаем её',
          'Экспедиторам: оформляем транзитные документы на груз на территории Узбекистана, проверяем документы CMR и TIR',
          'Владельцам грузов: оформляем транзитные документы, помогаем с обеспечением уплаты таможенных платежей, при необходимости выделяем место на складе под таможенным контролем в Ташкенте',
          'Клиентам, чей груз мы сами везём из Китая в Афганистан: оформляем транзитные документы в том же порядке',
        ],
        callout: {
          title: 'Дополнительные услуги',
          text: 'Помогаем получить сертификаты и разрешительные документы на товар: сертификат соответствия, фитосанитарный сертификат и другие. Есть и страхование груза на время перевозки.',
          tone: 'info',
        },
      },
    ],
    faq: [
      {
        q: 'Можете ли вы подать транзитную декларацию на мою фуру или груз?',
        a: 'Да. У GSR есть свой таможенный брокер, транзитную декларацию мы подаём в таможню сами. Напишите, что за груз, откуда и куда он идёт и через какой пограничный переход въезжает фура, — менеджер назовёт список нужных документов.',
      },
      {
        q: 'Нужна ли отдельная транзитная декларация, если есть книжка МДП?',
        a: 'Нет — по положению, утверждённому постановлением Кабинета Министров № 737, транзитная декларация не требуется, если груз перевозится по книжке МДП (TIR Carnet) и в таможню подана предварительная информация. В этом случае сама книжка МДП принимается как транзитная декларация. Что относится к вашей перевозке, подтвердит менеджер.',
      },
      {
        q: 'На каком пограничном переходе вы встречаете фуру?',
        a: 'Это зависит от маршрута фуры, поэтому пограничные переходы на странице не перечислены. Напишите, где фура въезжает в Узбекистан, — менеджер ответит по этому переходу.',
      },
      {
        q: 'Сколько стоит оформление транзитных документов?',
        a: 'Цена — по запросу: менеджер считает её по грузу, маршруту и набору нужных документов. Тарифа на этой странице нет. Тарифы и калькулятор на сайте относятся только к направлению Китай → Ташкент.',
      },
      {
        q: 'Работаете ли вы с иностранными перевозчиками и экспедиторами?',
        a: 'Да, эта услуга рассчитана именно на них. Мы оформляем транзитные документы для иностранных и местных перевозчиков, экспедиторов и владельцев грузов, чей груз или фура идёт через Узбекистан.',
      },
      {
        q: 'На каком языке и куда писать?',
        a: 'Пишите в WhatsApp (+998 90 175 78 00) или в Telegram. Если напишете на фарси или дари, ответим на фарси с помощью переводчика. Отвечаем также на английском, русском и узбекском.',
      },
    ],
    related: ['bonded', 'afghanistan', 'customs'],
    guideKeys: [],
    cta: {
      title: 'Ваш груз идёт через Узбекистан? Напишите нам.',
      text: 'Напишите в WhatsApp или Telegram, что за груз, откуда и куда он идёт, через какой пограничный переход въезжает фура и какие документы уже есть. Менеджер назовёт нужные документы и цену.',
      draft: 'Здравствуйте! У меня вопрос по транзитным документам в Узбекистане. Груз: … Маршрут: … Пограничный переход: …',
    },
    updated: '2026-11-12',
  },

  en: {
    key: 'transit',
    seo: {
      title: 'Transit documents in Uzbekistan: declaration, CMR, TIR',
      description:
        'Transit documents for cargo crossing Uzbekistan: our own customs broker files the declaration. CMR, TIR, permits, meeting the truck at the border.',
    },
    hero: {
      eyebrow: 'Service 11 — Transit',
      h1: 'Transit through Uzbekistan: we handle the paperwork',
      intro:
        'GSR Logistics, a logistics company in Tashkent, now also handles transit documents for cargo crossing Uzbekistan. Our own customs broker files the transit declaration at customs. We prepare and check the CMR and TIR documents. We help foreign trucks obtain permits, meet the truck at the border and see it off. We also help with security for customs payments on transit cargo. The price is calculated for each cargo separately.',
      facts: [
        { label: 'Transit declaration', value: 'Our own customs broker' },
        { label: 'Road documents', value: 'CMR · TIR' },
        { label: 'At the border', value: 'We meet the truck' },
        { label: 'Price', value: 'On request' },
      ],
    },
    sections: [
      {
        heading: 'What exactly do we do for transit cargo?',
        body: [
          'Four things: we file the transit declaration, prepare the CMR and TIR documents, help obtain permits and meet the truck at the border, and help with security for customs payments.',
          'The manager tells you which of these your cargo and route need.',
        ],
        table: {
          caption: 'The four transit services',
          head: ['Service', 'What we do'],
          rows: [
            ['Transit declaration', 'Our own customs broker files the declaration at customs'],
            ['CMR and TIR documents', 'We prepare and check the international road transport documents'],
            ['Permits and the border', 'We help foreign trucks obtain a permit (“dozvol”), meet the truck at the border and see it off'],
            ['Security for customs payments', 'We help arrange the security (a guarantee) for transit cargo'],
          ],
          note: 'The price is on request: the manager calculates it for your cargo.',
        },
      },
      {
        heading: 'What is a transit declaration, and who files it?',
        body: [
          'A transit declaration is the document filed with customs for cargo that crosses Uzbekistan in transit. It states the details of the goods and of the vehicle. Customs uses it to control the cargo from the customs office of departure to the customs office of destination.',
          'Under Cabinet of Ministers Resolution No. 737 of December 31, 2022, the declaration is filed by the declarant or by a customs clearance specialist. The specialist works for the declarant or for a customs broker that has a contract with the declarant. GSR has its own customs broker, so we file the transit declaration ourselves.',
          'The declaration is filed electronically, through the customs information system E-Tranzit or the us-uz.gov.uz system, with an electronic digital signature. It is filed before the cargo crosses the customs border or at the moment of crossing. This procedure is set by the same resolution.',
        ],
        callout: {
          title: 'Write ahead of time',
          text: 'The declaration can also be filed before the cargo reaches the border. So write to us before the truck sets off — that leaves time to check the documents.',
          tone: 'info',
        },
      },
      {
        heading: 'Which documents does road transit need?',
        body: [
          'A transit declaration and the accompanying documents — that is what Article 118 of the Customs Code of Uzbekistan requires. The accompanying documents are attached to the declaration as electronic copies. The regulation approved by Cabinet of Ministers Resolution No. 737 (as in force in November 2026) lists them for road transport as follows:',
        ],
        bullets: [
          'The vehicle registration certificate',
          'A permit for a foreign vehicle, where Uzbekistan’s international treaties provide for one',
          'The CMR consignment note',
          'Commercial documents, for example the invoice and the packing list',
          'Documents confirming that prohibitions and restrictions are observed, where the goods may be moved only with such documents',
        ],
        callout: {
          title: 'The exact set depends on the cargo',
          text: 'The manager tells you which documents your cargo needs. Send the list of the documents you already have and we will check it. If the cargo travels under a TIR Carnet the procedure is different: see the questions and answers below.',
          tone: 'info',
        },
      },
      {
        heading: 'Permits and the border: how do we help?',
        body: [
          'We help foreign trucks obtain permits, meet the truck at the border and see it off.',
          'A permit is the document a competent authority issues for a foreign vehicle to enter Uzbekistan, to leave it and to cross it in transit. It is required where Uzbekistan’s international treaties provide for it. Carriers often call it a “dozvol”.',
          'Tell us at which border crossing the truck enters Uzbekistan and where it leaves. The manager answers for that route: whether a permit is needed and how the truck is met at the border.',
        ],
      },
      {
        heading: 'What is security for customs payments?',
        body: [
          'Security for customs payments is one of the measures the Customs Code provides for when foreign goods are carried under customs control. For customs it is a guarantee that the customs payments will be paid. In everyday speech it is called a customs guarantee.',
          'We help arrange this security for transit cargo. The manager checks whether your cargo needs it and how it is arranged.',
        ],
      },
      {
        heading: 'What if the cargo has to stop or change trucks?',
        body: [
          'Then the cargo can be stored and reloaded in Tashkent under customs control. Under Article 119 of the Customs Code, goods in transit may be reloaded onto another vehicle and unloaded for temporary storage under the control of an intermediate customs office.',
          'In Tashkent we allocate space in a partner’s warehouse where cargo is stored under customs control. We reload cargo truck to truck or through the warehouse. Details are on the page “Warehouse under customs control in Tashkent”.',
        ],
      },
      {
        heading: 'Who is this service for?',
        body: [
          'The service is for carriers, forwarders and cargo owners whose cargo crosses Uzbekistan, whether they are foreign or from Uzbekistan.',
        ],
        bullets: [
          'For carriers and transport companies: we file the transit declaration, help obtain permits, meet the truck at the border and see it off',
          'For forwarders: we handle the transit documents for the cargo inside Uzbekistan and check the CMR and TIR documents',
          'For cargo owners: we handle the transit documents, help with security for customs payments and, if needed, allocate space in a warehouse under customs control in Tashkent',
          'For clients whose cargo we carry from China to Afghanistan ourselves: we handle the transit documents in the same way',
        ],
        callout: {
          title: 'Additional services',
          text: 'We help obtain certificates and permits for the goods: a certificate of conformity, a phytosanitary certificate and other documents. Cargo insurance for the time of carriage is available too.',
          tone: 'info',
        },
      },
    ],
    faq: [
      {
        q: 'Can you file a transit declaration for my truck or cargo?',
        a: 'Yes. GSR has its own customs broker, and we file the transit declaration at customs ourselves. Tell us what the cargo is, where it is going from and to, and at which border crossing the truck enters — the manager will list the documents needed.',
      },
      {
        q: 'With a TIR Carnet, is a separate transit declaration needed?',
        a: 'No — under the regulation approved by Cabinet of Ministers Resolution No. 737, a transit declaration is not required when the cargo is carried under a TIR Carnet and advance information has been submitted to customs. In that case the TIR Carnet itself is accepted as the transit declaration. The manager confirms what applies to your carriage.',
      },
      {
        q: 'At which border crossing do you meet the truck?',
        a: 'It depends on the truck’s route, so this page lists no border crossings. Tell us where the truck enters Uzbekistan and the manager will answer for that crossing.',
      },
      {
        q: 'What does the transit paperwork cost?',
        a: 'The price is on request: the manager calculates it from the cargo, the route and the documents needed. This page shows no tariff. The tariffs and the calculator on this site apply to the China → Tashkent direction only.',
      },
      {
        q: 'Do you work with foreign carriers and forwarders?',
        a: 'Yes, this service is meant for them. We handle the transit documents for foreign and local carriers, forwarders and cargo owners whose cargo or truck crosses Uzbekistan.',
      },
      {
        q: 'In which language can I write, and where?',
        a: 'Write on WhatsApp (+998 90 175 78 00) or Telegram. Write to us in Persian or Dari — we answer in Persian with the help of a translator. We also answer in English, Russian and Uzbek.',
      },
    ],
    related: ['bonded', 'afghanistan', 'customs'],
    guideKeys: [],
    cta: {
      title: 'Is your cargo crossing Uzbekistan? Write to us.',
      text: 'Tell us on WhatsApp or Telegram what the cargo is, where it is going from and to, at which border crossing the truck enters and which documents you already have. The manager will name the documents needed and the price.',
      draft: 'Hello! I have a question about transit documents in Uzbekistan. Cargo: … Route: … Border crossing: …',
    },
    updated: '2026-11-12',
  },
};

export default content;
