import type { ServiceContentByLang } from './types';

/**
 * Bojxona rasmiylashtiruvi — long-form page content.
 * Legal facts verified 2026-09-08 (research wf/12): PKM-244 (19.04.2025, in force 1 May 2025) — individuals
 * 200 $/month via courier per PINFL; PP-4508 (07.11.2019) — 30 % of the excess, min 3 $/kg; PF-174 (2026) —
 * 20 % / 2 $/kg planned from 2027-01-01; PKM-55 (31.01.2025) — clearance fee in BRV + 2 % BRV/kg courier fee;
 * PP-3818 (29.06.2018) Annex 1 as amended by PP-58 (11.02.2026) — duty rates; VAT 12 %; UP-140 (15.08.2023) —
 * Uzbek Latin-script labelling from 2024-01-01; PKM-554 (02.09.2025) — certification list; PKM-283 (14.05.2020) —
 * 180-day rule; UP-250 (17.12.2025) — preliminary declaration −20 % fee. Never print "bojsiz" / "hujjatsiz".
 */
const content: ServiceContentByLang = {
  uz: {
    key: 'customs',
    seo: {
      title: 'Xitoydan yuk uchun bojxona rasmiylashtiruvi — boj, QQS, hujjatlar 2026',
      description:
        'Xitoydan olib kelingan yuk uchun bojxona rasmiylashtiruvi: jismoniy shaxslar uchun oyiga 200 $ limit va undan oshgan qismiga 30 %, yuridik shaxslar uchun TN VED boʻyicha boj va 12 % QQS. Hujjatlar, GTD, sertifikat — oldindan hisoblab beramiz.',
    },
    hero: {
      eyebrow: 'Xizmat 07 — Bojxona',
      h1: 'Xitoydan yuk uchun bojxona rasmiylashtiruvi',
      intro:
        'Bojxona rasmiylashtiruvi — bu Xitoydan kelgan yukni Oʻzbekiston qonunlari boʻyicha deklaratsiya qilib, boj va QQSni toʻlab, erkin muomalaga chiqarish. Jismoniy shaxs kuryer orqali oyiga 200 $ gacha tovarni toʻlovsiz oladi, undan oshgan qismiga 30 % (kamida 3 $/kg) toʻlaydi. Yuridik shaxs uchun boj TN VED kodi boʻyicha (0–30 %) va 12 % QQS hisoblanadi. Biz toʻlovlarni yuk joʻnatilishidan oldin hisoblab beramiz va GTD bilan rasmiylashtiramiz.',
      facts: [
        { label: 'Jismoniy shaxs, kuryer orqali', value: '200 $/oy' },
        { label: 'Limitdan oshgan qismiga', value: '30 %' },
        { label: 'Import QQS', value: '12 %' },
        { label: 'Boj, TN VED boʻyicha', value: '0–30 %' },
      ],
    },
    sections: [
      {
        heading: 'Uchta yoʻl: kim import qiluvchi boʻladi?',
        body: [
          'Xitoydan yuk olib kelishda eng muhim savol — bojxona oldida kim import qiluvchi (deklarant) sifatida turadi. Shunga qarab toʻlovlar, hujjatlar va javobgarlik farq qiladi. Biz uchala variantda ham ishlaymiz va suhbat boshidayoq qaysi biri sizga mos kelishini aytamiz.',
        ],
        table: {
          caption: 'Rasmiylashtiruvning uch modeli',
          head: ['Model', 'Import qiluvchi', 'Toʻlovlar', 'Sizga qoladigan hujjat'],
          rows: [
            ['1. Jismoniy shaxsga posilka', 'Siz — oluvchi (PINFL boʻyicha)', 'Oyiga 200 $ gacha — 0; oshgan qismiga 30 %, kamida 3 $/kg; har kg uchun BRVning 2 % yigʻimi', 'Kuryer operatorining kvitansiyasi'],
            ['2. GSR import qiluvchi', 'GSR Logistics — oʻz shartnomasi bilan', 'Boj TN VED boʻyicha + 12 % QQS + rasmiylashtiruv yigʻimi — narxga kiritiladi', 'Ichki sotuv: elektron hisob-faktura'],
            ['3. Sizning shartnomangiz', 'Sizning firmangiz yoki YaTT', 'Boj + 12 % QQS + yigʻim — oʻz nomingizdan toʻlaysiz', 'Toʻliq import paketi: GTD, kontrakt, invoys, sertifikat'],
          ],
          note: 'Stavkalar: PKM-244 (2025-yil 19-aprel), PP-4508 (2019-yil 7-noyabr), PKM-55 (2025-yil 31-yanvar). Tekshirilgan sana: 2026-yil 8-sentabr.',
        },
        callout: {
          title: 'Muhim',
          text: 'Doʻkon yoki marketpleys uchun tovarni jismoniy shaxs posilkasi sifatida olib kelish mumkin emas: bojxona bir xil tovarning koʻpligi va takroriy buyurtmalarni tijorat deb hisoblaydi (PKM-244 mezonlari). Bunday yuk 2- yoki 3-model boʻyicha rasmiylashtiriladi. Boshqa odamlarning PINFL maʼlumotlari bilan ishlamaymiz.',
          tone: 'warn',
        },
      },
      {
        heading: 'Jismoniy shaxs uchun qoidalar qanday?',
        body: [
          '2025-yil 1-maydan boshlab xalqaro kuryer orqali keladigan tovarlar uchun shaxsiy limit — kalendar oyiga 200 $ (PKM-244, 2025-yil 19-aprel). Limit har bir posilkaga emas, oy davomidagi barcha buyurtmalarga jamlab, oluvchining PINFL raqami boʻyicha hisoblanadi. Xalqaro pochta orqali limit — 100 $.',
          'Limitdan oshgan qismiga yagona bojxona toʻlovi — 30 %, lekin har kilogramm uchun kamida 3 $ (PP-4508). Masalan, 250 $ lik posilka uchun toʻlov 50 $ dan, yaʼni 15 $ boʻladi. Bundan tashqari, har bir kuryer posilkasining har kilogrammi uchun BRVning 2 % miqdorida yigʻim olinadi (PKM-55, 2025-yil 4-maydan) — uni kuryer operatori toʻlaydi va odatda oluvchiga qoʻshib qoʻyadi.',
          'Qolgan limitni my.gov.uz portalidagi «Xalqaro kuryerlik joʻnatmalari» xizmati yoki E-Tijorat ilovasida koʻrish mumkin. Rejalashtirilgan oʻzgarish: «Yangi bojxona 2030» farmoniga (PF-174, 2026-yil avgust) koʻra 2027-yil 1-yanvardan stavka 20 %, minimal summa 2 $/kg boʻladi — bu hozircha amalda emas.',
        ],
      },
      {
        heading: 'Yuridik shaxs va YaTT uchun boj qancha?',
        body: [
          'Firma yoki yakka tartibdagi tadbirkor uchun boj tovarning 10 xonali TN VED kodi boʻyicha PP-3818 jadvalidan olinadi (2026-yil 11-fevraldagi PP-58 tahririda). Xitoy bilan erkin savdo bitimi yoʻq, shuning uchun eng qulay rejim stavkalari amal qiladi; kelib chiqish sertifikati boʻlmasa stavka ikki baravar oshadi. Bojga QQS qoʻshiladi: bojxona qiymati + boj + aksiz summasidan 12 %. Oddiy isteʼmol tovarlariga aksiz yoʻq.',
        ],
        table: {
          caption: 'Koʻp soʻraladigan tovar guruhlari boʻyicha boj',
          head: ['Tovar (TN VED)', 'Boj', 'QQS'],
          rows: [
            ['Kiyim-kechak (61, 62)', '20 % + dona uchun minimal (0,5–4 $)', '12 %'],
            ['Poyabzal (64)', '20 %, kamida 3 $/juft', '12 %'],
            ['Smartfonlar (8517)', '5 %', '12 %'],
            ['Kompyuter va noutbuklar (8471)', '0 %', '12 %'],
            ['Sanoat uskunalari (8479 va boshq.)', '0 %', '12 %'],
            ['Mebel (9403)', '15 %, kamida 0,4 $/kg', '12 %'],
            ['Oʻyinchoqlar (9503)', '10 %', '12 %'],
            ['Kosmetika (3304)', '30 %, kamida 0,5 $/kg', '12 %'],
          ],
          note: 'Manba: PP-3818 (2018-yil 29-iyun), 1-ilova, PP-58 (2026-yil 11-fevral) tahririda. Aniq stavka faqat 10 xonali kod boʻyicha aniqlanadi — biz kodni oldindan tanlab, toʻlovni hisoblab beramiz.',
        },
      },
      {
        heading: 'Rasmiylashtiruv yigʻimi va toʻlov muddati',
        body: [
          'Bojxona rasmiylashtiruvi uchun yigʻim bazaviy hisoblash miqdorida (BRV) olinadi va yukning qiymatiga bogʻliq (PKM-55, 2025-yil 31-yanvar): 10 000 $ gacha — 1 BRV, 10–20 ming $ — 1,5 BRV, 20–40 ming $ — 2,5 BRV, 40–60 ming $ — 4 BRV, 60–100 ming $ — 7 BRV, yuqorisi — 10 dan 25 BRV gacha. BRV har yili oʻzgargani uchun summani soʻmda emas, BRVda koʻrsatamiz.',
          '2026-yil 1-martdan dastlabki deklaratsiya topshirsangiz yigʻim 20 % kam boʻladi, 2026-yil 1-iyundan esa toʻlovni 120 kungacha boʻlib toʻlash mumkin (UP-250, 2025-yil 17-dekabr). Oldindan toʻlov majburiy emas, lekin toʻlangan tovar 180 kun ichida kelishi yoki pul qaytishi shart (PKM-283, 2020-yil 14-may).',
        ],
      },
      {
        heading: 'Qaysi hujjatlar kerak?',
        body: [
          'Oʻz shartnomangiz bilan import qilsangiz, quyidagi paket kerak boʻladi. Biz uni yetkazib beruvchi bilan birga tayyorlaymiz — xitoy tilidagi yozishmalarni oʻzimiz olib boramiz.',
        ],
        bullets: [
          'Tashqi savdo shartnomasi — EEISVO (E-Contract) tizimida roʻyxatdan oʻtgan; 2025-yil 19-maydan barcha tashqi savdo hujjatlari shu tizim orqali yuritiladi',
          'Invoys va qadoqlash roʻyxati (packing list) — har bir joyning ogʻirligi va tarkibi bilan',
          'Transport hujjati: CMR (avto), SMGS (temir yoʻl) yoki AWB (avia)',
          'Kelib chiqish sertifikati — eng qulay rejim stavkasini saqlab qolish uchun',
          'Har bir tovar uchun 10 xonali TN VED kodi',
          'Muvofiqlik sertifikati yoki deklaratsiyasi — roʻyxat PKM-554 (2025-yil 2-sentabr) bilan qisqartirilgan, lekin elektr buyumlar, bolalar tovarlari, kosmetika va oziq-ovqat uchun saqlanib qolgan',
          'SES xulosasi — oziq-ovqat, kosmetika, bolalar tovarlari, polimerlar uchun (PKM-379/2012)',
          'Yuk deklaratsiyasi (GTD) — elektron shaklda; bojxona uchinchi tomon kelishuvlarisiz 1 ish kuni ichida chiqaradi',
        ],
        callout: {
          title: 'Oʻzbek tilidagi yorliq',
          text: 'Sertifikat yoki SES xulosasi talab qilinadigan isteʼmol tovarlarida oʻzbek tilida lotin yozuvidagi markirovka boʻlishi shart (UP-140, 2023-yil 15-avgust, 2024-yil 1-yanvardan amalda). Yorliqda import qiluvchining nomi va manzili koʻrsatiladi. Yorliqni Ivu omborida yopishtirib beramiz — matnni oldindan kelishamiz.',
          tone: 'info',
        },
      },
      {
        heading: 'Jarayon qanday boʻladi?',
        body: ['Rasmiylashtiruv yuk Xitoydan chiqmasdan oldin boshlanadi — shunda chegarada kutish boʻlmaydi.'],
        steps: [
          { title: 'Tovar roʻyxatini yuborasiz', text: 'Nomi, soni, narxi, materiali va foto. Biz TN VED kodini tanlaymiz, boj, QQS va yigʻimni hisoblab, uchta model boʻyicha taqqoslab beramiz.' },
          { title: 'Modelni tanlaymiz', text: 'Shaxsiy foydalanish — posilka; doʻkon uchun — GSR shartnomasi yoki sizning shartnomangiz. Kerak boʻlsa, EEISVOda shartnoma roʻyxatdan oʻtishida yordam beramiz.' },
          { title: 'Hujjatlarni tayyorlaymiz', text: 'Yetkazib beruvchidan toʻgʻri invoys, qadoqlash roʻyxati va kelib chiqish sertifikatini olamiz; sertifikat va SES kerak boʻlsa, namunani oldindan yuboramiz.' },
          { title: 'Deklaratsiya topshiriladi', text: 'Yuk Xorgosdan oʻtib Yallamaga kelganda elektron GTD topshiriladi, toʻlovlar hisob-varaq boʻyicha toʻlanadi.' },
          { title: 'Yuk chiqariladi', text: 'Bojxona yukni erkin muomalaga chiqaradi; siz GTD (3-model) yoki elektron hisob-faktura (2-model) olasiz. Yuk Toshkent omboriga keladi.' },
        ],
      },
      {
        heading: 'Nimalarni rasmiylashtirmaymiz?',
        body: [
          'Baʼzi tovarlar uchun ruxsatnoma kerak yoki ular umuman taqiqlangan. Bunday yuklarni qabul qilmaymiz yoki faqat ruxsatnoma bilan ishlaymiz:',
        ],
        bullets: [
          'Dronlar — jismoniy shaxslar uchun taqiqlangan, ruxsat faqat yuridik shaxslarga rasmiy vazifalar uchun beriladi',
          'Ratsiya, uzatgich va koʻp routerlar — Elektromagnit moslik markazi ruxsatnomasisiz (PKM-801, 2020-yil 22-dekabr) olib kelib boʻlmaydi',
          'Dori vositalari tijorat maqsadida — davlat roʻyxati va Sogʻliqni saqlash vazirligi ruxsati kerak',
          'Oziq-ovqat, oʻsimlik va hayvon mahsulotlari — SES, fitosanitariya va veterinariya hujjatlarisiz',
          'Brend nusxalari (kontrafakt), qurol, portlovchi moddalar, ekstremistik materiallar — hech qanday holatda',
        ],
        callout: {
          title: 'Menejer maslahati',
          text: 'Bojxona qiymati invoysdagi narx boʻyicha qabul qilinadi, lekin bozor narxidan sezilarli past koʻrsatilsa, bojxona uni qayta baholashi mumkin. Real narxli invoys va kelib chiqish sertifikati bilan rasmiylashtiruv tezroq va arzonroq oʻtadi — biz hech qachon belgilangan bojxona qiymatini vaʼda qilmaymiz.',
          tone: 'success',
        },
      },
    ],
    faq: [
      { q: 'Xitoydan oyiga qancha summagacha toʻlovsiz buyurtma qilsam boʻladi?', a: 'Kuryer orqali kalendar oyiga 200 $, xalqaro pochta orqali 100 $ — har bir jismoniy shaxs uchun, PINFL boʻyicha jamlab (PKM-244, 2025-yil 1-maydan). Bu limit faqat shaxsiy foydalanish uchun; doʻkon tovariga amal qilmaydi.' },
      { q: 'Limitdan oshsa qancha toʻlayman?', a: 'Oshgan qismidan 30 %, lekin kamida 3 $/kg (PP-4508). 2027-yil 1-yanvardan 20 % va 2 $/kg boʻlishi rejalashtirilgan (PF-174) — hozircha eski stavka amalda.' },
      { q: 'Doʻkonim uchun tovarni qanday rasmiy olib kelaman?', a: 'Ikki yoʻl bor: GSR oʻz shartnomasi bilan import qiladi va sizga elektron hisob-faktura bilan sotadi, yoki siz YaTT/MChJ sifatida EEISVOda shartnoma roʻyxatdan oʻtkazasiz va GTD sizning nomingizga chiqadi. Ikkala holatda boj TN VED boʻyicha va 12 % QQS toʻlanadi.' },
      { q: 'Kiyim va poyabzalga boj necha foiz?', a: 'Kiyim — 20 % va dona uchun minimal summa (0,5–4 $), poyabzal — 20 %, kamida 3 $/juft, bolalar trikotaji — 10 % (PP-3818, PP-58/2026 tahririda). Ustiga 12 % QQS qoʻshiladi.' },
      { q: 'Sertifikat har doim kerakmi?', a: 'Yoʻq, TN VED kodiga bogʻliq. PKM-554 (2025-yil 2-sentabr) roʻyxatni qisqartirdi, lekin elektr buyumlar, bolalar tovarlari, kosmetika va oziq-ovqat uchun sertifikat yoki deklaratsiya kerak — u yuk chiqarilishidan oldin boʻlishi shart. Shaxsiy foydalanish tovarlariga talab qilinmaydi.' },
      { q: 'Bojxona rasmiylashtiruvi necha kun oladi?', a: 'Hujjatlar toʻliq boʻlsa, Bojxona kodeksi boʻyicha yuk 1 ish kuni ichida chiqariladi; amalda Yallamada 2–5 kun ketadi, chunki navbat va tekshiruv boʻlishi mumkin. Dastlabki deklaratsiya vaqtni qisqartiradi va yigʻimni 20 % kamaytiradi.' },
      { q: 'Bojxona toʻlovlarini kim va qachon toʻlaydi?', a: 'Import qiluvchi toʻlaydi: posilkada — siz, kuryer kvitansiyasi boʻyicha; GSR shartnomasida — biz, summa narxga kiradi; oʻz shartnomangizda — firmangiz, GTD boʻyicha yuk chiqarilishidan oldin. Summani har doim yuk joʻnatilishidan oldin hisoblab beramiz.' },
      { q: 'Yigʻma yuk narxiga bojxona kiradimi?', a: 'Ha, avto kargo tarifi kompaniya hujjatlari bilan rasmiylashtiruvni oʻz ichiga oladi. Oʻz shartnomangiz bilan import qilsangiz, boj va QQS alohida hisoblanadi — kalkulyator yoki menejer orqali oldindan bilib olasiz.' },
    ],
    related: ['truck', 'warehouse', 'equipment'],
    guideKeys: ['customs-2026', 'prohibited-goods', 'shipping-from-china', 'glossary'],
    cta: {
      title: 'Boj va QQSni oldindan hisoblab beramiz.',
      text: 'Tovar nomi, soni va taxminiy narxini yuboring — TN VED kodini tanlab, uchta model boʻyicha toʻlovlarni taqqoslab beramiz.',
      draft: 'Assalomu alaykum! Bojxona rasmiylashtiruvi boʻyicha savolim bor. Tovar: … Soni: … Taxminiy qiymati: … $. Import qiluvchi: jismoniy shaxs / GSR / oʻz firmam.',
    },
    updated: '2026-09-08',
  },

  ru: {
    key: 'customs',
    seo: {
      title: 'Таможенное оформление грузов из Китая — пошлины, НДС, документы 2026',
      description:
        'Растаможка груза из Китая в Узбекистане: для физлиц лимит 200 $ в месяц и 30 % с превышения, для юрлиц пошлина по ТН ВЭД и НДС 12 %. Документы, ГТД, сертификаты — считаем платежи заранее.',
    },
    hero: {
      eyebrow: 'Услуга 07 — Таможня',
      h1: 'Таможенное оформление грузов из Китая',
      intro:
        'Таможенное оформление — это декларирование груза из Китая по законам Узбекистана, уплата пошлины и НДС и выпуск товара в свободное обращение. Физическое лицо получает через курьера до 200 $ в месяц без платежей, с превышения платит 30 % (минимум 3 $/кг). Для юридического лица пошлина считается по коду ТН ВЭД (0–30 %) плюс НДС 12 %. Мы рассчитываем платежи до отправки груза и оформляем его с ГТД.',
      facts: [
        { label: 'Физлицо, через курьера', value: '200 $/мес' },
        { label: 'С превышения лимита', value: '30 %' },
        { label: 'НДС при импорте', value: '12 %' },
        { label: 'Пошлина по ТН ВЭД', value: '0–30 %' },
      ],
    },
    sections: [
      {
        heading: 'Три схемы: кто выступает импортёром?',
        body: [
          'Главный вопрос при ввозе из Китая — кто стоит перед таможней в роли импортёра (декларанта). От этого зависят платежи, документы и ответственность. Мы работаем по всем трём схемам и в начале разговора говорим, какая подходит именно вам.',
        ],
        table: {
          caption: 'Три модели оформления',
          head: ['Модель', 'Импортёр', 'Платежи', 'Документ на руках'],
          rows: [
            ['1. Посылка физлицу', 'Вы — получатель (по ПИНФЛ)', 'До 200 $ в месяц — 0; с превышения 30 %, минимум 3 $/кг; сбор 2 % БРВ за каждый кг', 'Квитанция курьерского оператора'],
            ['2. GSR — импортёр', 'GSR Logistics по своему контракту', 'Пошлина по ТН ВЭД + НДС 12 % + сбор за оформление — входят в цену', 'Внутренняя продажа: электронный счёт-фактура'],
            ['3. Ваш контракт', 'Ваша компания или ИП', 'Пошлина + НДС 12 % + сбор — платите от своего имени', 'Полный импортный пакет: ГТД, контракт, инвойс, сертификат'],
          ],
          note: 'Ставки: ПКМ-244 (19 апреля 2025 г.), ПП-4508 (7 ноября 2019 г.), ПКМ-55 (31 января 2025 г.). Дата проверки: 8 сентября 2026 г.',
        },
        callout: {
          title: 'Важно',
          text: 'Товар для магазина или маркетплейса нельзя ввозить как посылку физлицу: таможня считает большое количество одинаковых товаров и повторные заказы коммерческой партией (критерии ПКМ-244). Такой груз оформляется по схеме 2 или 3. С чужими данными ПИНФЛ мы не работаем.',
          tone: 'warn',
        },
      },
      {
        heading: 'Какие правила действуют для физлиц?',
        body: [
          'С 1 мая 2025 года личный лимит для товаров, поступающих через международного курьера, — 200 $ в календарный месяц (ПКМ-244 от 19 апреля 2025 г.). Лимит считается не на каждую посылку, а суммарно на все заказы за месяц по ПИНФЛ получателя. Для международной почты лимит — 100 $.',
          'С превышения взимается единый таможенный платёж — 30 %, но не менее 3 $ за килограмм (ПП-4508). Например, за посылку стоимостью 250 $ платёж считается с 50 $ и составит 15 $. Кроме того, с каждого килограмма курьерской посылки удерживается сбор 2 % от БРВ (ПКМ-55, с 4 мая 2025 г.) — его платит курьерский оператор и, как правило, включает в счёт получателю.',
          'Остаток лимита виден в сервисе «Международные курьерские отправления» на my.gov.uz и в приложении E-Tijorat. Планируемое изменение: по указу «Новая таможня 2030» (ПФ-174, август 2026 г.) с 1 января 2027 года ставка снизится до 20 %, минимум — до 2 $/кг. Пока действует прежняя ставка.',
        ],
      },
      {
        heading: 'Сколько платит юрлицо или ИП?',
        body: [
          'Для компании или индивидуального предпринимателя пошлина берётся из таблицы ПП-3818 по 10-значному коду ТН ВЭД (в редакции ПП-58 от 11 февраля 2026 г.). Соглашения о свободной торговле с Китаем нет, поэтому применяются ставки режима наибольшего благоприятствования; без сертификата происхождения ставка удваивается. К пошлине добавляется НДС — 12 % от суммы таможенной стоимости, пошлины и акциза. На обычные потребительские товары акциза нет.',
        ],
        table: {
          caption: 'Пошлины на самые частые группы товаров',
          head: ['Товар (ТН ВЭД)', 'Пошлина', 'НДС'],
          rows: [
            ['Одежда (61, 62)', '20 % + минимум за штуку (0,5–4 $)', '12 %'],
            ['Обувь (64)', '20 %, минимум 3 $/пара', '12 %'],
            ['Смартфоны (8517)', '5 %', '12 %'],
            ['Компьютеры и ноутбуки (8471)', '0 %', '12 %'],
            ['Промышленное оборудование (8479 и др.)', '0 %', '12 %'],
            ['Мебель (9403)', '15 %, минимум 0,4 $/кг', '12 %'],
            ['Игрушки (9503)', '10 %', '12 %'],
            ['Косметика (3304)', '30 %, минимум 0,5 $/кг', '12 %'],
          ],
          note: 'Источник: ПП-3818 (29 июня 2018 г.), приложение 1, в редакции ПП-58 (11 февраля 2026 г.). Точная ставка определяется только по 10-значному коду — мы подбираем код заранее и считаем платёж.',
        },
      },
      {
        heading: 'Сбор за оформление и сроки оплаты',
        body: [
          'Сбор за таможенное оформление взимается в базовых расчётных величинах (БРВ) и зависит от стоимости партии (ПКМ-55 от 31 января 2025 г.): до 10 000 $ — 1 БРВ, 10–20 тыс. $ — 1,5 БРВ, 20–40 тыс. $ — 2,5 БРВ, 40–60 тыс. $ — 4 БРВ, 60–100 тыс. $ — 7 БРВ, выше — от 10 до 25 БРВ. БРВ меняется ежегодно, поэтому мы указываем сбор в БРВ, а не в сумах.',
          'С 1 марта 2026 года при подаче предварительной декларации сбор ниже на 20 %, а с 1 июня 2026 года платежи можно вносить с рассрочкой до 120 дней (УП-250 от 17 декабря 2025 г.). Предоплата поставщику не обязательна, но оплаченный товар должен быть ввезён или деньги возвращены в течение 180 дней (ПКМ-283 от 14 мая 2020 г.).',
        ],
      },
      {
        heading: 'Какие документы нужны?',
        body: [
          'Если вы импортируете по собственному контракту, потребуется следующий пакет. Мы готовим его вместе с поставщиком — переписку на китайском ведём сами.',
        ],
        bullets: [
          'Внешнеторговый контракт, зарегистрированный в ЕЭИСВО (E-Contract); с 19 мая 2025 года все внешнеторговые документы проходят через эту систему',
          'Инвойс и упаковочный лист — с весом и содержимым каждого места',
          'Транспортный документ: CMR (авто), СМГС (ж/д) или AWB (авиа)',
          'Сертификат происхождения — чтобы сохранить ставку режима наибольшего благоприятствования',
          '10-значный код ТН ВЭД на каждый товар',
          'Сертификат или декларация соответствия — перечень сокращён ПКМ-554 (2 сентября 2025 г.), но сохранён для электротоваров, детских товаров, косметики и продуктов',
          'Заключение СЭС — для продуктов, косметики, детских товаров, полимеров (ПКМ-379/2012)',
          'Грузовая таможенная декларация (ГТД) — в электронном виде; таможня выпускает груз в течение 1 рабочего дня без учёта согласований третьих ведомств',
        ],
        callout: {
          title: 'Маркировка на узбекском языке',
          text: 'Потребительские товары, требующие сертификата или заключения СЭС, должны нести маркировку на государственном языке латиницей (УП-140 от 15 августа 2023 г., действует с 1 января 2024 г.). На этикетке указываются наименование и адрес импортёра. Этикетки клеим на складе в Иу — текст согласуем заранее.',
          tone: 'info',
        },
      },
      {
        heading: 'Как проходит оформление?',
        body: ['Оформление начинается ещё до того, как груз покинул Китай, — тогда на границе не будет простоя.'],
        steps: [
          { title: 'Вы присылаете список товаров', text: 'Наименование, количество, цена, материал и фото. Мы подбираем код ТН ВЭД, считаем пошлину, НДС и сбор и сравниваем три схемы.' },
          { title: 'Выбираем схему', text: 'Для личного пользования — посылка; для магазина — контракт GSR или ваш собственный. При необходимости помогаем зарегистрировать контракт в ЕЭИСВО.' },
          { title: 'Готовим документы', text: 'Получаем от поставщика правильный инвойс, упаковочный лист и сертификат происхождения; если нужны сертификат и СЭС, заранее отправляем образец.' },
          { title: 'Подаём декларацию', text: 'Когда груз прошёл Хоргос и прибыл на Яллама, подаётся электронная ГТД, платежи вносятся по счёту.' },
          { title: 'Груз выпущен', text: 'Таможня выпускает товар в свободное обращение; вы получаете ГТД (схема 3) или электронный счёт-фактуру (схема 2). Груз приходит на склад в Ташкенте.' },
        ],
      },
      {
        heading: 'Что мы не оформляем?',
        body: [
          'Для некоторых товаров нужно разрешение, а некоторые запрещены полностью. Такие грузы мы не принимаем или работаем с ними только при наличии разрешения:',
        ],
        bullets: [
          'Дроны — для физлиц запрещены, разрешение выдаётся только юрлицам для служебных задач',
          'Рации, передатчики и многие роутеры — без разрешения Центра электромагнитной совместимости (ПКМ-801 от 22 декабря 2020 г.) ввоз невозможен',
          'Лекарства в коммерческих целях — нужны госрегистрация и разрешение Минздрава',
          'Продукты, растения и продукция животного происхождения — без СЭС, фитосанитарных и ветеринарных документов',
          'Подделки брендов (контрафакт), оружие, взрывчатые вещества, экстремистские материалы — ни при каких условиях',
        ],
        callout: {
          title: 'Совет менеджера',
          text: 'Таможенная стоимость принимается по цене в инвойсе, но если она заметно ниже рыночной, таможня может её скорректировать. С инвойсом по реальной цене и сертификатом происхождения оформление проходит быстрее и дешевле — мы никогда не обещаем заранее зафиксированную таможенную стоимость.',
          tone: 'success',
        },
      },
    ],
    faq: [
      { q: 'На какую сумму в месяц можно заказывать из Китая без платежей?', a: 'Через курьера — 200 $ в календарный месяц, через международную почту — 100 $, на каждое физлицо суммарно по ПИНФЛ (ПКМ-244, с 1 мая 2025 г.). Лимит действует только для личного пользования и не распространяется на товар для магазина.' },
      { q: 'Сколько я заплачу при превышении лимита?', a: '30 % с суммы превышения, но не менее 3 $/кг (ПП-4508). С 1 января 2027 года планируется 20 % и 2 $/кг (ПФ-174) — пока действует прежняя ставка.' },
      { q: 'Как легально ввезти товар для магазина?', a: 'Два пути: GSR ввозит по своему контракту и продаёт вам с электронным счётом-фактурой, либо вы как ИП/ООО регистрируете контракт в ЕЭИСВО, и ГТД оформляется на ваше имя. В обоих случаях платятся пошлина по ТН ВЭД и НДС 12 %.' },
      { q: 'Какая пошлина на одежду и обувь?', a: 'Одежда — 20 % плюс минимум за штуку (0,5–4 $), обувь — 20 %, не менее 3 $/пара, детский трикотаж — 10 % (ПП-3818 в редакции ПП-58/2026). Сверху добавляется НДС 12 %.' },
      { q: 'Сертификат нужен всегда?', a: 'Нет, это зависит от кода ТН ВЭД. ПКМ-554 (2 сентября 2025 г.) сократил перечень, но для электротоваров, детских товаров, косметики и продуктов сертификат или декларация нужны — и должны быть получены до выпуска груза. Товары для личного пользования освобождены.' },
      { q: 'Сколько дней занимает растаможка?', a: 'При полном пакете документов по Таможенному кодексу груз выпускается в течение 1 рабочего дня; на практике на посту Яллама уходит 2–5 дней из-за очереди и досмотра. Предварительная декларация сокращает срок и снижает сбор на 20 %.' },
      { q: 'Кто и когда платит таможенные платежи?', a: 'Платит импортёр: при посылке — вы по квитанции курьера; по контракту GSR — мы, сумма входит в цену; по вашему контракту — ваша компания до выпуска груза по ГТД. Сумму мы всегда считаем до отправки груза.' },
      { q: 'Входит ли таможня в цену сборного груза?', a: 'Да, тариф авто карго включает оформление по документам компании. Если вы импортируете по собственному контракту, пошлина и НДС считаются отдельно — узнать их заранее можно в калькуляторе или у менеджера.' },
    ],
    related: ['truck', 'warehouse', 'equipment'],
    guideKeys: ['customs-2026', 'prohibited-goods', 'shipping-from-china', 'glossary'],
    cta: {
      title: 'Посчитаем пошлину и НДС заранее.',
      text: 'Пришлите наименование, количество и примерную цену товара — подберём код ТН ВЭД и сравним платежи по трём схемам.',
      draft: 'Здравствуйте! У меня вопрос по таможенному оформлению. Товар: … Количество: … Примерная стоимость: … $. Импортёр: физлицо / GSR / моя компания.',
    },
    updated: '2026-09-08',
  },

  en: {
    key: 'customs',
    seo: {
      title: 'Customs clearance for cargo from China to Uzbekistan — duties, VAT, documents 2026',
      description:
        'Customs clearance in Uzbekistan for goods from China: individuals get $200 per month duty-free by courier and pay 30% on the excess; companies pay duty by HS code plus 12% VAT. Documents, customs declaration, certificates — we calculate the payments in advance.',
    },
    hero: {
      eyebrow: 'Service 07 — Customs',
      h1: 'Customs clearance for cargo from China',
      intro:
        'Customs clearance means declaring goods from China under Uzbek law, paying duty and VAT, and releasing the cargo for free circulation. An individual receives up to $200 per month by courier without payments and pays 30% (minimum $3/kg) on anything above. A company pays duty by HS code (0–30%) plus 12% VAT. We calculate the payments before the cargo ships and clear it with a customs declaration (GTD).',
      facts: [
        { label: 'Individuals, by courier', value: '$200/month' },
        { label: 'On the excess', value: '30%' },
        { label: 'Import VAT', value: '12%' },
        { label: 'Duty, by HS code', value: '0–30%' },
      ],
    },
    sections: [
      {
        heading: 'Three models: who is the importer of record?',
        body: [
          'The key question when importing from China is who faces customs as the importer of record (the declarant). It determines the payments, the paperwork and the liability. We work under all three models and tell you at the start of the conversation which one fits your case.',
        ],
        table: {
          caption: 'The three clearance models',
          head: ['Model', 'Importer of record', 'Payments', 'What you receive'],
          rows: [
            ['1. Parcel to an individual', 'You, the recipient (by PINFL)', 'Up to $200/month — none; 30% on the excess, min $3/kg; a fee of 2% of BRV per kg', 'The courier operator’s receipt'],
            ['2. GSR as importer', 'GSR Logistics under its own contract', 'Duty by HS code + 12% VAT + clearance fee — built into the price', 'A domestic sale with an electronic invoice'],
            ['3. Your own contract', 'Your company or sole trader', 'Duty + 12% VAT + fee, paid in your own name', 'The full import file: GTD, contract, invoice, certificate'],
          ],
          note: 'Rates: Cabinet Resolution PKM-244 (April 19, 2025), Presidential Resolution PP-4508 (November 7, 2019), PKM-55 (January 31, 2025). Verified September 8, 2026.',
        },
        callout: {
          title: 'Important',
          text: 'Stock for a shop or marketplace cannot be imported as a personal parcel: customs treats large quantities of identical goods and repeated orders as commercial (PKM-244 criteria). Such cargo is cleared under model 2 or 3. We never use other people’s PINFL data.',
          tone: 'warn',
        },
      },
      {
        heading: 'What are the rules for individuals?',
        body: [
          'Since May 1, 2025 the personal allowance for goods arriving by international courier is $200 per calendar month (PKM-244 of April 19, 2025). The allowance applies not per parcel but to all orders in the month combined, tracked by the recipient’s PINFL. For international post the allowance is $100.',
          'Anything above the allowance is charged a single customs payment of 30%, but no less than $3 per kilogram (PP-4508). For a $250 parcel, for example, the payment is calculated on $50 and comes to $15. On top of that, every kilogram of a courier parcel carries a fee of 2% of the base calculation value (BRV) under PKM-55, in force since May 4, 2025 — the courier operator pays it and usually passes it on to the recipient.',
          'The remaining allowance is shown in the “International courier shipments” service on my.gov.uz and in the E-Tijorat app. A planned change: under the “New Customs 2030” decree (PF-174, August 2026), from January 1, 2027 the rate drops to 20% and the minimum to $2/kg. Until then the current rate applies.',
        ],
      },
      {
        heading: 'How much does a company pay?',
        body: [
          'For a company or sole trader the duty comes from the PP-3818 schedule by the 10-digit HS (TN VED) code, as amended by PP-58 of February 11, 2026. There is no free-trade agreement with China, so most-favoured-nation rates apply; without a certificate of origin the rate doubles. VAT is added at 12% of the customs value plus duty plus excise. Ordinary consumer goods carry no excise.',
        ],
        table: {
          caption: 'Duty on the most requested product groups',
          head: ['Goods (HS code)', 'Duty', 'VAT'],
          rows: [
            ['Clothing (61, 62)', '20% + a per-piece minimum ($0.50–4)', '12%'],
            ['Footwear (64)', '20%, min $3/pair', '12%'],
            ['Smartphones (8517)', '5%', '12%'],
            ['Computers and laptops (8471)', '0%', '12%'],
            ['Industrial machinery (8479 etc.)', '0%', '12%'],
            ['Furniture (9403)', '15%, min $0.40/kg', '12%'],
            ['Toys (9503)', '10%', '12%'],
            ['Cosmetics (3304)', '30%, min $0.50/kg', '12%'],
          ],
          note: 'Source: PP-3818 (June 29, 2018), Annex 1, as amended by PP-58 (February 11, 2026). The exact rate depends on the 10-digit code — we classify the goods in advance and calculate the payment.',
        },
      },
      {
        heading: 'Clearance fee and payment terms',
        body: [
          'The customs clearance fee is set in base calculation values (BRV) and depends on the value of the consignment (PKM-55 of January 31, 2025): up to $10,000 — 1 BRV, $10–20k — 1.5 BRV, $20–40k — 2.5 BRV, $40–60k — 4 BRV, $60–100k — 7 BRV, above that — 10 to 25 BRV. The BRV changes every year, so we quote the fee in BRV rather than soums.',
          'From March 1, 2026 a preliminary declaration cuts the fee by 20%, and from June 1, 2026 payments can be spread over up to 120 days (UP-250 of December 17, 2025). Prepayment to the supplier is not mandatory, but prepaid goods must be imported or the money returned within 180 days (PKM-283 of May 14, 2020).',
        ],
      },
      {
        heading: 'Which documents are needed?',
        body: [
          'If you import under your own contract, you will need the file below. We assemble it together with the supplier and handle the Chinese-language correspondence ourselves.',
        ],
        bullets: [
          'A foreign-trade contract registered in EEISVO (E-Contract); since May 19, 2025 all foreign-trade paperwork goes through this system',
          'Invoice and packing list, with the weight and contents of every piece',
          'Transport document: CMR (road), SMGS (rail) or AWB (air)',
          'Certificate of origin, to keep the most-favoured-nation rate',
          'A 10-digit HS (TN VED) code for every product',
          'Certificate or declaration of conformity — the list was cut by PKM-554 (September 2, 2025) but still covers electrical goods, children’s products, cosmetics and food',
          'SES (sanitary) conclusion for food, cosmetics, children’s goods and polymers (PKM-379/2012)',
          'The customs declaration (GTD), filed electronically; customs releases the goods within 1 working day, excluding third-party approvals',
        ],
        callout: {
          title: 'Uzbek-language labelling',
          text: 'Consumer goods that require a certificate or SES conclusion must carry labelling in the state language in Latin script (UP-140 of August 15, 2023, in force since January 1, 2024). The label states the importer’s name and address. We apply the labels at the Yiwu warehouse — the wording is agreed in advance.',
          tone: 'info',
        },
      },
      {
        heading: 'How does the process work?',
        body: ['Clearance starts before the cargo leaves China — that way nothing waits at the border.'],
        steps: [
          { title: 'You send the product list', text: 'Name, quantity, price, material and photos. We pick the HS code, calculate duty, VAT and the fee, and compare the three models.' },
          { title: 'We choose the model', text: 'Personal use — a parcel; shop stock — GSR’s contract or your own. If needed, we help register the contract in EEISVO.' },
          { title: 'We prepare the documents', text: 'We obtain a correct invoice, packing list and certificate of origin from the supplier; if a certificate and SES are required, a sample is sent ahead.' },
          { title: 'The declaration is filed', text: 'Once the cargo has passed Khorgos and reached the Yallama post, the electronic GTD is filed and payments are made against the invoice.' },
          { title: 'The cargo is released', text: 'Customs releases the goods for free circulation; you receive the GTD (model 3) or an electronic invoice (model 2). The cargo arrives at the Tashkent warehouse.' },
        ],
      },
      {
        heading: 'What we do not clear',
        body: [
          'Some goods need a permit and some are banned outright. We do not accept such cargo, or handle it only with the permit in hand:',
        ],
        bullets: [
          'Drones — banned for individuals; permits are issued only to legal entities for official tasks',
          'Radios, transmitters and many routers — no entry without a permit from the Electromagnetic Compatibility Centre (PKM-801 of December 22, 2020)',
          'Medicines for commercial purposes — state registration and a Ministry of Health permit are required',
          'Food, plants and animal products — not without SES, phytosanitary and veterinary documents',
          'Counterfeit brands, weapons, explosives, extremist material — under no circumstances',
        ],
        callout: {
          title: 'Manager’s tip',
          text: 'Customs value is taken from the invoice price, but if it is noticeably below market level customs may adjust it. A real-price invoice and a certificate of origin make clearance faster and cheaper — we never promise a pre-fixed customs value.',
          tone: 'success',
        },
      },
    ],
    faq: [
      { q: 'How much can I order from China per month without customs payments?', a: '$200 per calendar month by courier and $100 by international post, per individual, combined across all parcels by PINFL (PKM-244, since May 1, 2025). The allowance is for personal use only and does not cover shop stock.' },
      { q: 'How much do I pay above the allowance?', a: '30% of the excess, but no less than $3/kg (PP-4508). From January 1, 2027 the rate is planned to fall to 20% and $2/kg (PF-174) — until then the current rate applies.' },
      { q: 'How do I import goods for my shop legally?', a: 'Two ways: GSR imports under its own contract and sells to you with an electronic invoice, or you register a contract in EEISVO as a sole trader or LLC and the GTD is issued in your name. In both cases duty by HS code and 12% VAT are paid.' },
      { q: 'What is the duty on clothing and footwear?', a: 'Clothing — 20% plus a per-piece minimum ($0.50–4); footwear — 20%, at least $3 per pair; children’s knitwear — 10% (PP-3818 as amended by PP-58/2026). VAT of 12% is added on top.' },
      { q: 'Is a certificate always required?', a: 'No, it depends on the HS code. PKM-554 (September 2, 2025) shortened the list, but electrical goods, children’s products, cosmetics and food still need a certificate or declaration, and it must exist before release. Goods for personal use are exempt.' },
      { q: 'How many days does clearance take?', a: 'With a complete file the Customs Code requires release within 1 working day; in practice the Yallama post takes 2–5 days because of queues and inspection. A preliminary declaration shortens the wait and cuts the fee by 20%.' },
      { q: 'Who pays the customs payments, and when?', a: 'The importer of record: for a parcel — you, against the courier’s receipt; under GSR’s contract — we do, and the amount is built into the price; under your own contract — your company, before release against the GTD. We always calculate the amount before the cargo ships.' },
      { q: 'Is customs included in the consolidated-cargo price?', a: 'Yes, the truck-cargo rate includes clearance under the company’s documents. If you import under your own contract, duty and VAT are calculated separately — you can find them out in advance in the calculator or from your manager.' },
    ],
    related: ['truck', 'warehouse', 'equipment'],
    guideKeys: ['customs-2026', 'prohibited-goods', 'shipping-from-china', 'glossary'],
    cta: {
      title: 'We calculate duty and VAT before you ship.',
      text: 'Send the product name, quantity and approximate price — we will classify the goods and compare the payments under the three models.',
      draft: 'Hello! I have a question about customs clearance. Product: … Quantity: … Approximate value: $… Importer: individual / GSR / my own company.',
    },
    updated: '2026-09-08',
  },
};

export default content;
