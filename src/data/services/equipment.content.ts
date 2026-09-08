import type { ServiceContentByLang } from './types';

/**
 * Uskunalar importi «kalit topshirish» (turnkey equipment import) — long-form page content.
 * Figures: rail 20ft 2 800–5 500 $, 40ft 5 200–6 800 $, 20–35 days; truck 15–25 days; insurance 1% — tariffs.json (2026-09-08).
 * Customs: PP-3818 Annex 1 as amended by PP-58 of 11.02.2026 (lex.uz/docs/3802366) — machinery HS 8479/8467/8443 0%, motors 8501 5%;
 * VAT 12%; clearance fee ladder in BRV per PKM-55/2025; UP-250 of 17.12.2025 (preliminary declaration −20% fee, instalments). Research wf/12 §2.
 * "30% oldindan, qolgani kelganda" is the company's historical practice from its Telegram posts — presented as such, owner to confirm.
 */
const content: ServiceContentByLang = {
  uz: {
    key: 'equipment',
    seo: {
      title: 'Xitoydan uskunalar importi «kalit topshirish» — qidiruvdan oʻrnatishgacha',
      description:
        'Dastgoh va ishlab chiqarish liniyalarini Xitoyda topamiz, zavodni tekshiramiz, shartnoma va toʻlovni tuzamiz, Toshkentga tashiymiz, bojxonadan oʻtkazamiz va oʻrnatamiz. Koʻp sanoat uskunalari uchun boj 0%, QQS 12%.',
    },
    hero: {
      eyebrow: 'Xizmat 06 — Uskunalar',
      h1: 'Xitoydan uskunalar importi «kalit topshirish»',
      intro:
        'Uskunalar importi «kalit topshirish» — bu Xitoyda dastgoh yoki ishlab chiqarish liniyasini topish, zavodni tekshirish, shartnoma va toʻlov, Toshkentgacha tashish, bojxona rasmiylashtiruvi va oʻrnatish — hammasi bitta shartnoma va bitta menejer bilan. Koʻp sanoat uskunalari uchun boj stavkasi 0% (PP-3818, 2026-yil 11-fevraldagi PP-58 tahririda), QQS 12%. Yoʻl: alohida fura yoki yigʻma yuk bilan taxminan 15–25 kun, konteynerda temir yoʻl bilan 20–35 kun.',
      facts: [
        { label: 'Boj, koʻp sanoat uskunalari', value: '0%' },
        { label: 'QQS, bojxona qiymatidan', value: '12%' },
        { label: 'Muddat, konteyner / fura', value: '20–35 · 15–25 kun' },
        { label: 'Oʻrnatish', value: 'shartnomada' },
      ],
    },
    sections: [
      {
        heading: 'Qaysi uskunalarni olib kelamiz?',
        body: [
          'Xitoy — dunyodagi eng katta sanoat uskunalari ishlab chiqaruvchisi va Oʻzbekistondagi yangi sexlarning aksariyati aynan shu yerdan jihozlanadi. Biz 2018-yildan beri Xitoy bilan ishlaymiz; uskunalar importi — GSR Group uchun ustuvor yoʻnalishlardan biri. Odatiy buyurtmalar:',
        ],
        bullets: [
          'Metallga ishlov berish: CNC dastgohlar, lazer va plazma kesish, press va bukish uskunalari',
          'Plastmassa va qadoqlash: inyeksion quyish mashinalari, ekstruderlar, plyonka va qop ishlab chiqarish liniyalari',
          'Oziq-ovqat: un, makaron, konditer, sut va ichimlik liniyalari, sovutish kameralari',
          'Tikuv va toʻqimachilik: tikuv mashinalari, kashta, trikotaj va boʻyash uskunalari',
          'Qurilish materiallari: gʻisht, blok, penoplast, plastik oyna va profil liniyalari',
          'Yogʻoch va mebel: kesish, silliqlash, qirra yopishtirish dastgohlari',
          'Ehtiyot qismlar va butlovchi: ishlayotgan liniya uchun qismlar, elektr shkaflari, dvigatellar',
        ],
        callout: {
          title: 'Kichik dastgoh ham boʻladi',
          text: '200–500 kg li dastgoh (tikuv, kichik CNC, qadoqlash mashinasi) yigʻma yuk bilan keladi va uskuna shartnomasi shart emas: zavodni tekshiramiz, sotib olamiz, yogʻoch yashikka joylab Toshkentga olib kelamiz. Katta liniyalar uchun quyidagi toʻliq jarayon ishlaydi.',
          tone: 'info',
        },
      },
      {
        heading: 'Jarayon qanday boʻladi?',
        body: [
          'Uskuna — bu tovar emas, loyiha: unda spetsifikatsiya, sinov, gabarit tashish, bojxona kodi va oʻrnatish bor. Shuning uchun jarayon yetti bosqichdan iborat va har birida Siz natijani hujjat yoki video bilan koʻrasiz.',
        ],
        steps: [
          { title: 'Texnik topshiriq', text: 'Nima ishlab chiqarmoqchisiz, qanday quvvat (soatiga/kuniga), xomashyo, elektr tarmogʻi (380 V, 50 Hz), sex maydoni va byudjet. Kerak boʻlsa, oʻxshash sexni koʻrib, topshiriqni birga tuzamiz.' },
          { title: 'Zavod qidiruvi va takliflar', text: 'Xitoy boʻylab 3–5 ta zavoddan spetsifikatsiya, narx (EXW yoki FOB), ishlab chiqarish muddati, kafolat va ehtiyot qismlar sharti bilan taklif yigʻamiz. Takliflarni bitta jadvalda taqqoslab beramiz.' },
          { title: 'Zavodni tekshirish', text: 'Biznes-litsenziya, eksport tajribasi, sex va sinov maydonchasi. Video-qoʻngʻiroq bepul; tashrifni oʻzimiz uyushtiramiz — Siz ham bora olasiz, xodimimiz tarjima qiladi.' },
          { title: 'Shartnoma va toʻlov', text: 'Xitoy va rus tilida shartnoma: spetsifikatsiya, sinov mezonlari, kechikish jarimasi, kafolat (odatda 12 oy), oʻrnatish sharti. Toʻlovni zavodga yuanda yoki dollarda biz oʻtkazamiz; Siz E-Contract orqali oʻz firmangiz nomidan rasmiylashtirasiz.' },
          { title: 'Ishlab chiqarish va zavodda sinov', text: 'Ishlab chiqarish odatda 30–60 kun. Yuklashdan oldin uskuna zavodda Sizning xomashyongiz bilan sinovdan oʻtkaziladi (FAT), video va hisobot yuboriladi. Faqat shundan keyin qolgan toʻlov va yuklash.' },
          { title: 'Tashish va bojxona', text: 'Yogʻoch yashik, namlikdan himoya, gabarit oʻlchov. Konteyner (temir yoʻl, 20–35 kun) yoki alohida fura (15–25 kun). TN VED kodi, GTD, sertifikat — bojxona rasmiylashtiruvi bizning zimmamizda; boj va QQS oldindan hisoblab beriladi.' },
          { title: 'Oʻrnatish va ishga tushirish', text: 'Zavod muhandisi kelib oʻrnatadi va xodimlaringizni oʻrgatadi, yoki bizning hamkor montaj guruhi zavod bilan video aloqada ishga tushiradi. Ishga tushirish dalolatnomasi — loyihaning yakuni.' },
        ],
      },
      {
        heading: 'Bojxona: boj va QQS qancha?',
        body: [
          'Oʻzbekistonda import boji Vazirlar Mahkamasining PP-3818 qaroriga (2018-yil 29-iyun) 1-ilova boʻyicha, 2026-yil 11-fevraldagi PP-58 tahririda hisoblanadi. Koʻp sanoat mashinalari va mexanik uskunalar uchun stavka 0% — bu ishlab chiqarishni ragʻbatlantirish siyosati. Lekin stavka aniq 10 xonali TN VED kodiga bogʻliq: liniya tarkibidagi elektr dvigatel, kompressor yoki nazorat bloki boshqa kod bilan oʻtishi mumkin.',
          'Boj ustiga bojxona qiymatidan (uskuna narxi + tashish + sugʻurta) 12% QQS toʻlanadi; QQS toʻlovchi korxona uchun u hisobga olinadi. Bojxona rasmiylashtiruv yigʻimi BRV da: 10 000 $ gacha — 1 BRV, 10–20 ming $ — 1,5 BRV, 20–40 ming $ — 2,5 BRV, 40–60 ming $ — 4 BRV, 60–100 ming $ — 7 BRV (PKM-55/2025).',
        ],
        table: {
          caption: 'Uskunalar uchun boj stavkalari (PP-3818, PP-58 tahririda, 2026-yil 11-fevral)',
          head: ['TN VED guruhi', 'Nima kiradi', 'Boj', 'QQS'],
          rows: [
            ['8479', 'alohida vazifali mashina va mexanik qurilmalar (koʻp ishlab chiqarish liniyalari)', '0%', '12%'],
            ['8467', 'qoʻl asboblari — pnevmatik, gidravlik, elektr dvigatelli', '0%', '12%'],
            ['8443', 'bosma va nusxalash uskunalari', '0%', '12%'],
            ['8471', 'kompyuterlar va boshqaruv bloklari', '0%', '12%'],
            ['8501', 'elektr dvigatellar va generatorlar', '5%', '12%'],
          ],
          note: 'Manba: lex.uz/docs/3802366 (2026-yil 8-sentabr holatiga koʻra). Stavka kelib chiqish sertifikati (MFN) bilan qoʻllanadi; usiz ikki barobar. Aniq kodni va summani shartnomadan oldin hisoblab beramiz.',
        },
        callout: {
          title: 'Yangi imkoniyat: boʻlib toʻlash',
          text: 'Prezidentning 2025-yil 17-dekabrdagi UP-250 farmoni boʻyicha 2026-yil 1-martdan dastlabki deklaratsiya bilan rasmiylashtirilsa yigʻim 20% ga kam, 2026-yil 1-iyundan esa bojxona toʻlovlarini 120 kungacha kechiktirish yoki boʻlib toʻlash mumkin. Katta liniya uchun bu QQSni ishga tushirgandan keyin toʻlash degani.',
          tone: 'success',
        },
      },
      {
        heading: 'Ogʻir va gabarit yukni qanday tashiymiz?',
        body: [
          'Uskuna oddiy yigʻma yukdan ogʻirligi, oʻlchami va sinuvchanligi bilan farq qiladi. Yoʻlni ogʻirlik va gabaritga qarab tanlaymiz; sugʻurta eʼlon qilingan qiymatning 1% — uskuna uchun har doim tavsiya qilamiz.',
        ],
        table: {
          caption: 'Uskuna tashish variantlari, Xitoy → Toshkent',
          head: ['Variant', 'Qachon mos', 'Chegara', 'Taxminiy narx', 'Muddat'],
          rows: [
            ['Yigʻma yuk (fura ichida joy)', 'kichik dastgoh, ehtiyot qismlar', '2 t va 2,3 m balandlikkacha bir joy', 'kg yoki m³ hisobida', '15–25 kun'],
            ['Alohida fura', 'liniya 10–20 t, tez kerak', '20–22 t, 13,6 m uzunlik', 'yoʻnalishga qarab kelishiladi', '15–25 kun'],
            ['20 ft konteyner, temir yoʻl', 'zich va ogʻir uskuna', '28 t gacha, 33 m³', '2 800–5 500 $', '20–35 kun'],
            ['40 ft konteyner, temir yoʻl', 'butun liniya, hajmli', '26 t gacha, 67 m³', '5 200–6 800 $', '20–35 kun'],
            ['Ochiq platforma / flat rack', 'gabaritdan katta agregat', 'alohida ruxsatnoma bilan', 'loyiha boʻyicha', '25–40 kun'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. Yogʻoch yashik (fumigatsiya belgisi bilan), moy va suvni oqizish, yuklash-tushirish uchun kran alohida hisoblanadi.',
        },
      },
      {
        heading: 'Oʻrnatish va kafolat qanday hal qilinadi?',
        body: [
          'Katta liniya uchun oʻrnatish shartnomaga zavod muhandisining kelishi bilan yoziladi: yoʻl, viza va turar joy xarajatlari odatda mijoz hisobidan, kunlik ish haqi zavod bilan kelishiladi. Bizning xodimimiz muhandis bilan birga keladi va tarjima qiladi. Kichik uskuna uchun zavod video-yoʻriqnoma beradi va bizning hamkor montaj guruhi ishga tushiradi.',
          'Kafolat odatda 12 oy; kafolat davrida sinadigan qismlarni zavod bepul yuboradi, biz ularni yigʻma yuk yoki avia bilan olib kelamiz. Shartnoma tuzishda tez sinadigan qismlar roʻyxatini va birinchi yil uchun zaxira toʻplamini soʻraymiz — bu liniyaning toʻxtab qolishidan saqlaydi.',
        ],
        callout: {
          title: 'Menejer maslahati',
          text: 'Zavoddan uskunani Oʻzbekiston tarmogʻiga — 380 V / 50 Hz — moslab yigʻishni shartnomada aniq yozdiring. Xitoyning oʻz standarti ham 380 V / 50 Hz, lekin eksport uchun baʼzi zavodlar 220 V yoki 60 Hz variantni sukut boʻyicha qoʻyadi, va buni Toshkentda tuzatish qimmat.',
          tone: 'success',
        },
      },
      {
        heading: 'Toʻlov qanday tartibda boʻladi?',
        body: [
          'Avvalgi loyihalarimizda toʻlov odatda ikki bosqichda boʻlgan: 30% oldindan — ishlab chiqarishni boshlash uchun, qolgani uskuna kelganda. Bu bizning tarixiy amaliyotimiz; har bir shartnomada jadval summaga, muddatga va zavodning shartiga qarab alohida kelishiladi. Xitoy zavodlarining oʻzi odatda 30% avans va yuklashdan oldin 70% soʻraydi; farqni biz moliyalashtirsak, bu xizmat haqida hisobga olinadi.',
          'Zavodga toʻlovni yuanda yoki dollarda biz oʻtkazamiz. Siz oʻz firmangizdan bank oʻtkazmasi bilan toʻlaysiz; shartnoma E-Contract tizimida roʻyxatdan oʻtadi va oldindan toʻlangan tovar 180 kun ichida kelishi shart (PKM-283/2020) — buni muddat rejalashtirishda hisobga olamiz.',
        ],
      },
    ],
    faq: [
      {
        q: 'Xitoydan uskuna olib kelganda boj haqiqatan 0% mi?',
        a: 'Koʻp sanoat mashinalari uchun — ha: PP-3818 ga 1-ilovada (PP-58 tahriri, 2026-yil 11-fevral) 8479, 8467, 8443, 8471 kodlari 0%. Lekin elektr dvigatel (8501) 5%, boshqa qismlar boshqacha boʻlishi mumkin. QQS 12% har doim toʻlanadi. Aniq kodni oldindan hisoblab beramiz.',
      },
      {
        q: 'Uskuna necha kunda keladi?',
        a: 'Ishlab chiqarish odatda 30–60 kun, keyin yoʻl: alohida fura yoki yigʻma yuk bilan taxminan 15–25 kun, konteynerda temir yoʻl bilan 20–35 kun. Bojxona rasmiylashtiruvi hujjatlar tayyor boʻlsa 2–5 kun oladi.',
      },
      {
        q: 'Oldindan toʻlov qancha?',
        a: 'Avvalgi loyihalarda odatda 30% oldindan, qolgani uskuna kelganda — bu tarixiy amaliyotimiz, har shartnomada alohida kelishiladi. Zavodlarning oʻzi odatda 30% avans va yuklashdan oldin 70% soʻraydi.',
      },
      {
        q: 'Oʻrnatishni kim qiladi?',
        a: 'Katta liniya uchun zavod muhandisi keladi (yoʻl va yashash xarajati odatda mijoz hisobidan), bizning xodim tarjima qiladi. Kichik uskunani zavodning video-yoʻriqnomasi asosida hamkor montaj guruhimiz ishga tushiradi.',
      },
      {
        q: 'Zavodga oʻzim borib koʻrsam boʻladimi?',
        a: 'Ha. Tashrifni biz uyushtiramiz: zavod bilan kelishuv, kutib olish, tarjimon-xodim. Bormasangiz — video-qoʻngʻiroq bepul, yuklashdan oldingi sinovni (FAT) video bilan yuboramiz.',
      },
      {
        q: 'Kafolat va ehtiyot qismlar qanday?',
        a: 'Zavod odatda 12 oy kafolat beradi; sinadigan qismlar bepul yuboriladi, biz olib kelamiz. Shartnomada tez sinadigan qismlar roʻyxati va birinchi yil uchun zaxira toʻplamini soʻraymiz.',
      },
      {
        q: 'Ishlatilgan (b/u) uskunani olib kelasizmi?',
        a: 'Har bir holatda alohida koʻrib chiqamiz: b/u uskuna uchun sertifikatlash va bojxona talablari qatʼiyroq, zavod kafolati boʻlmaydi. Koʻpincha yangi xitoy uskunasi umumiy hisobda arzon chiqadi — taqqoslab beramiz.',
      },
      {
        q: 'Sertifikat kerakmi?',
        a: 'TN VED kodiga bogʻliq: koʻp uskunalar uchun muvofiqlik sertifikati talab qilinadi va u yuk chiqarilgunga qadar olinishi kerak (PKM-554, 2025-yil 2-sentabr). Zavoddan CE/ISO hujjatlarini oldindan olamiz — bu sertifikatlashni tezlashtiradi.',
      },
    ],
    related: ['rail', 'customs', 'sourcing'],
    guideKeys: ['customs-2026', 'find-supplier', 'air-vs-truck-vs-rail', 'routes'],
    cta: {
      title: 'Sexingiz uchun liniya — bitta shartnoma bilan.',
      text: 'Nima ishlab chiqarmoqchi ekaningizni, kerakli quvvatni va byudjetni yozing. Bir necha zavoddan taklif, boj va QQS hisobi bilan taqqoslash jadvalini tayyorlaymiz.',
      draft: 'Assalomu alaykum! Xitoydan uskuna kerak. Uskuna turi: … Quvvat: … Byudjet: … Sex qayerda: …',
    },
    updated: '2026-09-08',
  },

  ru: {
    key: 'equipment',
    seo: {
      title: 'Импорт оборудования из Китая «под ключ» — от поиска до монтажа',
      description:
        'Находим станки и производственные линии в Китае, проверяем завод, оформляем договор и оплату, везём в Ташкент, растамаживаем и монтируем. Для большинства промышленного оборудования пошлина 0%, НДС 12%.',
    },
    hero: {
      eyebrow: 'Услуга 06 — Оборудование',
      h1: 'Импорт оборудования из Китая «под ключ»',
      intro:
        'Импорт оборудования «под ключ» — это поиск станка или производственной линии в Китае, проверка завода, договор и оплата, перевозка до Ташкента, таможенное оформление и монтаж — всё по одному договору и с одним менеджером. Для большинства промышленного оборудования ставка пошлины 0% (ПП-3818 в редакции ПП-58 от 11 февраля 2026 г.), НДС 12%. В пути: отдельной фурой или сборным грузом ориентировочно 15–25 дней, контейнером по железной дороге — 20–35 дней.',
      facts: [
        { label: 'Пошлина, большинство промоборудования', value: '0%' },
        { label: 'НДС от таможенной стоимости', value: '12%' },
        { label: 'Срок, контейнер / фура', value: '20–35 · 15–25 дней' },
        { label: 'Монтаж', value: 'по договору' },
      ],
    },
    sections: [
      {
        heading: 'Какое оборудование мы привозим?',
        body: [
          'Китай — крупнейший в мире производитель промышленного оборудования, и большинство новых цехов в Узбекистане оснащаются именно оттуда. Мы работаем с Китаем с 2018 года; импорт оборудования — одно из приоритетных направлений GSR Group. Типичные заказы:',
        ],
        bullets: [
          'Металлообработка: станки с ЧПУ, лазерная и плазменная резка, прессы и гибочное оборудование',
          'Пластик и упаковка: термопластавтоматы, экструдеры, линии по производству плёнки и мешков',
          'Пищевая промышленность: мукомольные, макаронные, кондитерские, молочные линии и линии розлива, холодильные камеры',
          'Швейное и текстильное: швейные машины, вышивальные, вязальные и красильные машины',
          'Стройматериалы: линии для кирпича, блоков, пенопласта, пластиковых окон и профиля',
          'Дерево и мебель: раскроечные, шлифовальные и кромкооблицовочные станки',
          'Запчасти и комплектующие: узлы для работающих линий, электрошкафы, двигатели',
        ],
        callout: {
          title: 'Небольшой станок — тоже можно',
          text: 'Станок весом 200–500 кг (швейный, малый ЧПУ, упаковочная машина) едет сборным грузом, и отдельный договор на оборудование не нужен: проверяем завод, выкупаем, упаковываем в деревянный ящик и привозим в Ташкент. Для крупных линий работает полный процесс ниже.',
          tone: 'info',
        },
      },
      {
        heading: 'Как проходит процесс?',
        body: [
          'Оборудование — не товар, а проект: в нём есть спецификация, испытания, негабаритная перевозка, таможенный код и монтаж. Поэтому процесс состоит из семи этапов, и на каждом вы видите результат в документе или на видео.',
        ],
        steps: [
          { title: 'Техническое задание', text: 'Что вы будете производить, какая мощность (в час/в сутки), сырьё, электросеть (380 В, 50 Гц), площадь цеха и бюджет. При необходимости смотрим похожий цех и составляем ТЗ вместе.' },
          { title: 'Поиск завода и предложения', text: 'Собираем по Китаю 3–5 предложений от заводов со спецификацией, ценой (EXW или FOB), сроком производства, гарантией и условиями по запчастям. Сводим их в одну сравнительную таблицу.' },
          { title: 'Проверка завода', text: 'Бизнес-лицензия, экспортный опыт, цех и испытательная площадка. Видеозвонок — бесплатно; визит организуем сами — вы тоже можете поехать, наш сотрудник переводит.' },
          { title: 'Договор и оплата', text: 'Договор на китайском и русском: спецификация, критерии испытаний, штраф за задержку, гарантия (обычно 12 месяцев), условия монтажа. Платёж заводу в юанях или долларах проводим мы; вы оформляете импорт на свою фирму через E-Contract.' },
          { title: 'Производство и заводские испытания', text: 'Производство обычно занимает 30–60 дней. Перед отгрузкой оборудование испытывают на заводе на вашем сырье (FAT), присылают видео и протокол. Только после этого — остаток оплаты и погрузка.' },
          { title: 'Перевозка и таможня', text: 'Деревянный ящик, защита от влаги, обмер габаритов. Контейнер (ж/д, 20–35 дней) или отдельная фура (15–25 дней). Код ТН ВЭД, ГТД, сертификат — таможенное оформление берём на себя; пошлину и НДС считаем заранее.' },
          { title: 'Монтаж и пусконаладка', text: 'Инженер завода приезжает, монтирует и обучает ваших сотрудников, либо наша партнёрская монтажная бригада запускает линию на видеосвязи с заводом. Акт пусконаладки — финал проекта.' },
        ],
      },
      {
        heading: 'Таможня: сколько пошлина и НДС?',
        body: [
          'Ввозная пошлина в Узбекистане считается по приложению 1 к постановлению ПП-3818 (29 июня 2018 г.) в редакции ПП-58 от 11 февраля 2026 г. Для большинства промышленных машин и механического оборудования ставка 0% — так государство стимулирует производство. Но ставка зависит от точного 10-значного кода ТН ВЭД: электродвигатель, компрессор или блок управления в составе линии могут проходить под другим кодом.',
          'Сверх пошлины платится НДС 12% от таможенной стоимости (цена оборудования + перевозка + страховка); для плательщика НДС он принимается к зачёту. Сбор за таможенное оформление — в БРВ: до 10 000 $ — 1 БРВ, 10–20 тыс. $ — 1,5 БРВ, 20–40 тыс. $ — 2,5 БРВ, 40–60 тыс. $ — 4 БРВ, 60–100 тыс. $ — 7 БРВ (ПКМ-55/2025).',
        ],
        table: {
          caption: 'Ставки пошлин на оборудование (ПП-3818 в редакции ПП-58 от 11 февраля 2026 г.)',
          head: ['Группа ТН ВЭД', 'Что входит', 'Пошлина', 'НДС'],
          rows: [
            ['8479', 'машины и механические устройства специального назначения (большинство производственных линий)', '0%', '12%'],
            ['8467', 'ручной инструмент — пневматический, гидравлический, с электродвигателем', '0%', '12%'],
            ['8443', 'печатное и копировальное оборудование', '0%', '12%'],
            ['8471', 'компьютеры и блоки управления', '0%', '12%'],
            ['8501', 'электродвигатели и генераторы', '5%', '12%'],
          ],
          note: 'Источник: lex.uz/docs/3802366 (по состоянию на 8 сентября 2026 г.). Ставка применяется при наличии сертификата происхождения (РНБ); без него — в двойном размере. Точный код и сумму считаем до подписания договора.',
        },
        callout: {
          title: 'Новая возможность: рассрочка',
          text: 'По Указу Президента УП-250 от 17 декабря 2025 г. с 1 марта 2026 г. оформление по предварительной декларации снижает сбор на 20%, а с 1 июня 2026 г. таможенные платежи можно отсрочить или разбить на срок до 120 дней. Для крупной линии это значит платить НДС уже после запуска.',
          tone: 'success',
        },
      },
      {
        heading: 'Как везём тяжёлый и негабаритный груз?',
        body: [
          'Оборудование отличается от обычного сборного груза весом, размерами и хрупкостью. Способ перевозки выбираем по весу и габаритам; страховка — 1% от объявленной стоимости — для оборудования рекомендуем всегда.',
        ],
        table: {
          caption: 'Варианты перевозки оборудования, Китай → Ташкент',
          head: ['Вариант', 'Когда подходит', 'Ограничения', 'Ориентировочная цена', 'Срок'],
          rows: [
            ['Сборный груз (место в фуре)', 'небольшой станок, запчасти', 'до 2 т и 2,3 м высоты на место', 'по кг или м³', '15–25 дней'],
            ['Отдельная фура', 'линия 10–20 т, нужно быстро', '20–22 т, длина 13,6 м', 'договорная по маршруту', '15–25 дней'],
            ['Контейнер 20 футов, ж/д', 'плотное и тяжёлое оборудование', 'до 28 т, 33 м³', '2 800–5 500 $', '20–35 дней'],
            ['Контейнер 40 футов, ж/д', 'целая линия, объёмная', 'до 26 т, 67 м³', '5 200–6 800 $', '20–35 дней'],
            ['Открытая платформа / flat rack', 'негабаритный агрегат', 'по отдельному разрешению', 'по проекту', '25–40 дней'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. Деревянный ящик (с отметкой о фумигации), слив масла и воды, кран для погрузки-разгрузки считаются отдельно.',
        },
      },
      {
        heading: 'Как решаются монтаж и гарантия?',
        body: [
          'Для крупной линии монтаж прописывается в договоре как приезд инженера завода: дорога, виза и проживание обычно за счёт клиента, дневная ставка согласуется с заводом. Наш сотрудник приезжает вместе с инженером и переводит. Для небольшого оборудования завод даёт видеоинструкцию, а запуск выполняет наша партнёрская монтажная бригада.',
          'Гарантия обычно 12 месяцев; вышедшие из строя детали в гарантийный период завод отправляет бесплатно, мы привозим их сборным грузом или авиа. При заключении договора запрашиваем перечень быстроизнашивающихся деталей и комплект запаса на первый год — это защищает от простоя линии.',
        ],
        callout: {
          title: 'Совет менеджера',
          text: 'Пропишите в договоре, что оборудование собирается под сеть Узбекистана — 380 В / 50 Гц. В Китае стандарт тот же, но на экспорт некоторые заводы по умолчанию ставят вариант 220 В или 60 Гц, и переделывать это в Ташкенте дорого.',
          tone: 'success',
        },
      },
      {
        heading: 'Какой порядок оплаты?',
        body: [
          'В наших прошлых проектах оплата обычно проходила в два этапа: 30% аванс — для запуска производства, остаток — по прибытии оборудования. Это наша сложившаяся практика; в каждом договоре график согласуется отдельно в зависимости от суммы, сроков и условий завода. Сами китайские заводы обычно просят 30% аванса и 70% перед отгрузкой; если разницу финансируем мы, это учитывается в стоимости услуги.',
          'Платёж заводу в юанях или долларах проводим мы. Вы платите банковским переводом со своей фирмы; договор регистрируется в системе E-Contract, а предоплаченный товар должен поступить в течение 180 дней (ПКМ-283/2020) — это учитываем при планировании сроков.',
        ],
      },
    ],
    faq: [
      {
        q: 'Пошлина на оборудование из Китая действительно 0%?',
        a: 'Для большинства промышленных машин — да: в приложении 1 к ПП-3818 (редакция ПП-58 от 11 февраля 2026 г.) коды 8479, 8467, 8443, 8471 имеют ставку 0%. Но электродвигатели (8501) — 5%, другие узлы могут отличаться. НДС 12% платится всегда. Точный код считаем заранее.',
      },
      {
        q: 'За сколько дней придёт оборудование?',
        a: 'Производство обычно 30–60 дней, затем дорога: отдельной фурой или сборным грузом ориентировочно 15–25 дней, контейнером по железной дороге — 20–35 дней. Таможенное оформление при готовых документах занимает 2–5 дней.',
      },
      {
        q: 'Какая предоплата?',
        a: 'В прошлых проектах обычно 30% аванс, остаток — по прибытии оборудования; это сложившаяся практика, в каждом договоре график согласуется отдельно. Сами заводы обычно просят 30% аванса и 70% перед отгрузкой.',
      },
      {
        q: 'Кто выполняет монтаж?',
        a: 'Для крупной линии приезжает инженер завода (дорога и проживание обычно за счёт клиента), наш сотрудник переводит. Небольшое оборудование запускает наша партнёрская монтажная бригада по видеоинструкции завода.',
      },
      {
        q: 'Могу ли я сам поехать на завод?',
        a: 'Да. Визит организуем мы: договорённость с заводом, встреча, сотрудник-переводчик. Если не едете — видеозвонок бесплатно, заводские испытания перед отгрузкой (FAT) присылаем на видео.',
      },
      {
        q: 'Как с гарантией и запчастями?',
        a: 'Завод обычно даёт 12 месяцев гарантии; вышедшие из строя детали отправляет бесплатно, мы их привозим. В договоре запрашиваем перечень быстроизнашивающихся деталей и комплект запаса на первый год.',
      },
      {
        q: 'Привозите ли б/у оборудование?',
        a: 'Рассматриваем каждый случай отдельно: для б/у оборудования строже требования сертификации и таможни, нет заводской гарантии. Часто новое китайское оборудование в общем счёте выходит дешевле — сравним.',
      },
      {
        q: 'Нужен ли сертификат?',
        a: 'Зависит от кода ТН ВЭД: для большинства оборудования требуется сертификат соответствия, и получить его нужно до выпуска груза (ПКМ-554 от 2 сентября 2025 г.). Документы CE/ISO берём у завода заранее — это ускоряет сертификацию.',
      },
    ],
    related: ['rail', 'customs', 'sourcing'],
    guideKeys: ['customs-2026', 'find-supplier', 'air-vs-truck-vs-rail', 'routes'],
    cta: {
      title: 'Линия для вашего цеха — по одному договору.',
      text: 'Напишите, что вы будете производить, какая нужна мощность и бюджет. Подготовим предложения от нескольких заводов и сравнительную таблицу с расчётом пошлины и НДС.',
      draft: 'Здравствуйте! Нужно оборудование из Китая. Тип оборудования: … Мощность: … Бюджет: … Где цех: …',
    },
    updated: '2026-09-08',
  },

  en: {
    key: 'equipment',
    seo: {
      title: 'Turnkey equipment import from China — from search to installation',
      description:
        'We find machinery and production lines in China, verify the factory, arrange the contract and payment, ship to Tashkent, clear customs and install. Most industrial equipment carries 0% import duty, VAT 12%.',
    },
    hero: {
      eyebrow: 'Service 06 — Equipment',
      h1: 'Turnkey equipment import from China',
      intro:
        'Turnkey equipment import means finding a machine or production line in China, verifying the factory, arranging the contract and payment, shipping to Tashkent, clearing customs and installing — all under one contract with one manager. Most industrial equipment carries a 0% import duty (Resolution PP-3818 as amended by PP-58 of February 11, 2026) plus 12% VAT. Transit: roughly 15–25 days by dedicated or consolidated truck, 20–35 days by rail container.',
      facts: [
        { label: 'Duty, most industrial equipment', value: '0%' },
        { label: 'VAT on customs value', value: '12%' },
        { label: 'Transit, container / truck', value: '20–35 · 15–25 days' },
        { label: 'Installation', value: 'in the contract' },
      ],
    },
    sections: [
      {
        heading: 'What equipment do we import?',
        body: [
          'China is the world’s largest producer of industrial equipment, and most new workshops in Uzbekistan are fitted out from there. We have worked with China since 2018, and equipment import is one of GSR Group’s priority lines. Typical orders:',
        ],
        bullets: [
          'Metalworking: CNC machines, laser and plasma cutting, presses and bending machines',
          'Plastics and packaging: injection moulding machines, extruders, film and bag production lines',
          'Food: flour, pasta, confectionery, dairy and bottling lines, cold rooms',
          'Garment and textile: sewing, embroidery, knitting and dyeing machines',
          'Building materials: brick, block, foam, PVC window and profile lines',
          'Wood and furniture: panel saws, sanders, edge banders',
          'Spare parts and components: units for running lines, electrical cabinets, motors',
        ],
        callout: {
          title: 'Small machines are fine too',
          text: 'A 200–500 kg machine (sewing, small CNC, packaging) travels as consolidated cargo and needs no separate equipment contract: we verify the factory, buy, crate and deliver to Tashkent. For large lines the full process below applies.',
          tone: 'info',
        },
      },
      {
        heading: 'How does the process work?',
        body: [
          'Equipment is a project, not a product: it involves a specification, testing, oversized transport, a customs code and installation. The process therefore has seven stages, and at each you see the result in a document or a video.',
        ],
        steps: [
          { title: 'Technical brief', text: 'What you will produce, the capacity (per hour or per day), raw materials, the power supply (380 V, 50 Hz), workshop floor area and budget. If useful, we look at a similar workshop and write the brief together.' },
          { title: 'Factory search and offers', text: 'We collect 3–5 offers from factories across China with the specification, price (EXW or FOB), production time, warranty and spare-parts terms, and put them side by side in one comparison table.' },
          { title: 'Factory verification', text: 'Business licence, export record, workshop and test floor. A video call is free; we organise a visit ourselves — you can come along, our staff interpret.' },
          { title: 'Contract and payment', text: 'A contract in Chinese and Russian: specification, acceptance-test criteria, delay penalties, warranty (usually 12 months), installation terms. We make the payment to the factory in yuan or dollars; you import in your company’s name through E-Contract.' },
          { title: 'Production and factory acceptance test', text: 'Production usually takes 30–60 days. Before loading, the equipment is tested at the factory on your raw material (FAT) and you receive the video and report. Only then the balance is paid and loading begins.' },
          { title: 'Shipping and customs', text: 'Wooden crate, moisture protection, dimension survey. Container by rail (20–35 days) or a dedicated truck (15–25 days). HS code, customs declaration, certificate — customs clearance is on us; duty and VAT are calculated in advance.' },
          { title: 'Installation and commissioning', text: 'A factory engineer comes to install and train your staff, or our partner installation crew commissions the line on a video link with the factory. The commissioning report closes the project.' },
        ],
      },
      {
        heading: 'Customs: how much duty and VAT?',
        body: [
          'Import duty in Uzbekistan follows Annex 1 to Resolution PP-3818 (June 29, 2018) as amended by PP-58 of February 11, 2026. Most industrial machinery and mechanical equipment carries a 0% rate — a deliberate policy to encourage manufacturing. The rate depends, however, on the exact 10-digit HS code: an electric motor, compressor or control unit within a line may fall under a different code.',
          'On top of duty, 12% VAT is charged on the customs value (equipment price + freight + insurance); a VAT-registered company can offset it. The customs clearance fee is set in BRV (base calculation units): 1 BRV up to $10,000, 1.5 BRV for $10–20k, 2.5 BRV for $20–40k, 4 BRV for $40–60k, 7 BRV for $60–100k (Cabinet Resolution 55/2025).',
        ],
        table: {
          caption: 'Duty rates for equipment (PP-3818 as amended by PP-58, February 11, 2026)',
          head: ['HS heading', 'What it covers', 'Duty', 'VAT'],
          rows: [
            ['8479', 'machines and mechanical appliances with individual functions (most production lines)', '0%', '12%'],
            ['8467', 'hand tools — pneumatic, hydraulic or with electric motor', '0%', '12%'],
            ['8443', 'printing and copying machinery', '0%', '12%'],
            ['8471', 'computers and control units', '0%', '12%'],
            ['8501', 'electric motors and generators', '5%', '12%'],
          ],
          note: 'Source: lex.uz/docs/3802366 (as of September 8, 2026). Rates apply with a certificate of origin (MFN); without one they double. We calculate the exact code and amount before the contract is signed.',
        },
        callout: {
          title: 'New option: instalments',
          text: 'Under Presidential Decree UP-250 of December 17, 2025, clearance under a preliminary declaration cuts the fee by 20% from March 1, 2026, and from June 1, 2026 customs payments can be deferred or split for up to 120 days. For a large line that means paying VAT after start-up.',
          tone: 'success',
        },
      },
      {
        heading: 'How do we move heavy and oversized cargo?',
        body: [
          'Equipment differs from ordinary consolidated cargo in weight, size and fragility. We choose the mode by weight and dimensions; insurance at 1% of the declared value is something we always recommend for equipment.',
        ],
        table: {
          caption: 'Equipment shipping options, China → Tashkent',
          head: ['Option', 'When it fits', 'Limits', 'Indicative price', 'Transit'],
          rows: [
            ['Consolidated cargo (space in a truck)', 'small machine, spare parts', 'up to 2 t and 2.3 m height per piece', 'per kg or m³', '15–25 days'],
            ['Dedicated truck', 'a 10–20 t line, needed fast', '20–22 t, 13.6 m length', 'quoted per route', '15–25 days'],
            ['20 ft container, rail', 'dense, heavy equipment', 'up to 28 t, 33 m³', '$2,800–5,500', '20–35 days'],
            ['40 ft container, rail', 'a complete, bulky line', 'up to 26 t, 67 m³', '$5,200–6,800', '20–35 days'],
            ['Flat rack / open platform', 'oversized unit', 'with a special permit', 'project-based', '25–40 days'],
          ],
          note: 'Estimates · Updated September 8, 2026. Wooden crate (with fumigation mark), draining of oil and water, and crane loading are charged separately.',
        },
      },
      {
        heading: 'How are installation and warranty handled?',
        body: [
          'For a large line, installation is written into the contract as a visit by the factory engineer: travel, visa and accommodation are usually at the client’s expense and the daily rate is agreed with the factory. Our staff member accompanies the engineer and interprets. For smaller equipment the factory provides a video guide and our partner installation crew does the commissioning.',
          'The warranty is usually 12 months; parts that fail within it are shipped free by the factory and we bring them by consolidated cargo or air. When the contract is drawn up we ask for the wear-parts list and a first-year spares kit — that is what keeps a line from standing idle.',
        ],
        callout: {
          title: 'Manager’s tip',
          text: 'Have the contract state explicitly that the equipment is built for the Uzbek grid — 380 V / 50 Hz. China’s own standard is the same, but for export some factories default to a 220 V or 60 Hz version, and fixing that in Tashkent is expensive.',
          tone: 'success',
        },
      },
      {
        heading: 'What is the payment schedule?',
        body: [
          'In our past projects payment usually came in two steps: 30% upfront to start production and the balance when the equipment arrived. That is our historical practice; every contract sets its own schedule depending on the amount, the timeline and the factory’s terms. Chinese factories themselves usually ask for 30% in advance and 70% before shipment; if we finance the gap, that is reflected in the service fee.',
          'We make the payment to the factory in yuan or dollars. You pay by bank transfer from your company; the contract is registered in E-Contract, and prepaid goods must arrive within 180 days (Cabinet Resolution 283/2020) — we factor that into the schedule.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is import duty on equipment from China really 0%?',
        a: 'For most industrial machinery, yes: Annex 1 to PP-3818 (as amended by PP-58 of February 11, 2026) sets 0% for headings 8479, 8467, 8443 and 8471. Electric motors (8501) are 5%, and other components may differ. VAT of 12% is always charged. We calculate the exact code in advance.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Production usually takes 30–60 days, then transit: roughly 15–25 days by dedicated or consolidated truck, 20–35 days by rail container. Customs clearance takes 2–5 days once the documents are ready.',
      },
      {
        q: 'How much is the advance payment?',
        a: 'In past projects usually 30% upfront and the balance on arrival — our historical practice; each contract sets its own schedule. Factories themselves usually ask for 30% in advance and 70% before shipment.',
      },
      {
        q: 'Who does the installation?',
        a: 'For a large line a factory engineer comes (travel and accommodation usually at the client’s expense) and our staff interpret. Smaller equipment is commissioned by our partner installation crew following the factory’s video guide.',
      },
      {
        q: 'Can I visit the factory myself?',
        a: 'Yes. We organise the visit: arrangements with the factory, pick-up, an interpreting staff member. If you do not travel, the video call is free and the pre-shipment factory test (FAT) is sent as a video.',
      },
      {
        q: 'What about warranty and spare parts?',
        a: 'Factories usually give a 12-month warranty; failed parts are shipped free and we bring them over. In the contract we ask for the wear-parts list and a first-year spares kit.',
      },
      {
        q: 'Do you import used equipment?',
        a: 'Case by case: used equipment faces stricter certification and customs requirements and has no factory warranty. New Chinese equipment often works out cheaper overall — we compare both for you.',
      },
      {
        q: 'Is a certificate required?',
        a: 'It depends on the HS code: most equipment needs a certificate of conformity, and it must be obtained before the cargo is released (Cabinet Resolution 554 of September 2, 2025). We collect the CE/ISO documents from the factory in advance, which speeds up certification.',
      },
    ],
    related: ['rail', 'customs', 'sourcing'],
    guideKeys: ['customs-2026', 'find-supplier', 'air-vs-truck-vs-rail', 'routes'],
    cta: {
      title: 'A line for your workshop. One contract.',
      text: 'Tell us what you will produce, the capacity you need and your budget. We come back with offers from several factories and a comparison table with duty and VAT worked out.',
      draft: 'Hello! I need equipment from China. Type of equipment: … Capacity: … Budget: … Workshop location: …',
    },
    updated: '2026-09-08',
  },
};

export default content;
