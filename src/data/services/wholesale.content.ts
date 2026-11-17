import type { ServiceContentSource } from './types';

/**
 * Ulgurji (optom) sotib olish (wholesale) — long-form page content.
 * The page: buying goods wholesale in China on the client's order — from a factory or from a wholesale seller — and
 * bringing them to Tashkent. Its neighbours keep their own question: sourcing FINDS a supplier against a specification,
 * buying buys BY LINK on 1688 / Taobao / Pinduoduo / Alibaba.
 * The one new fact (owner, 2026-11-17): the company has employees who know Chinese at HSK 6 level, with experience of
 * purchasing in China, who work on buying from factories and buying wholesale from sellers. Nothing more is confirmed, so
 * nothing more is said of them: no place, no number of people, no certificate — and always "employees who know Chinese at
 * HSK 6 level", never "our employees know …". Every figure is one the site already publishes, worded as published and
 * with its date note: commission "from 3%" (tariffs.extras.sourcingCommissionPct), an order of at least 1 m³, truck
 * 15–25 days, air 5–10 days, the inspection and photo-report prices of the China warehouse page.
 * The order of the facts matters: the sticky card prints the first fact whose value holds a digit — the commission, not «HSK 6».
 * The texts were generated from the reviewed drafts of this release; from now on they are edited here.
 */
const content: ServiceContentSource = {
  uz: {
    key: 'wholesale',
    seo: {
      title: 'Xitoydan ulgurji (optom) tovar sotib olish',
      description:
        'Xitoydan ulgurji (optom) tovarni zavoddan yoki sotuvchidan olib beramiz — xarid boʻyicha xitoy tilini HSK 6 darajasida biladigan xodimlarimiz ishlaydi. Toʻlov soʻmda, sotuvchiga yuanda biz toʻlaymiz; komissiya buyurtma summasining 3% dan. Oʻzbekistondagi tadbirkorlar uchun tovarni Ivu omborida tekshirib, yigʻma yuk bilan Toshkentga olib kelamiz.',
    },
    hero: {
      eyebrow: 'Xizmat 06 — Ulgurji xarid',
      h1: 'Xitoydan ulgurji (optom) tovar sotib olish: zavodlardan va sotuvchilardan',
      intro:
        'Toshkentdagi GSR Logistics logistika kompaniyasi Xitoydan ulgurji (optom) tovarni doʻkonlar, ulgurji savdogarlar, marketpleys sotuvchilari va ishlab chiqaruvchilar buyurtmasi boʻyicha zavoddan yoki ulgurji sotuvchidan sotib olib beradi va Toshkentga olib keladi. Ulgurji xaridlar boʻyicha xitoy tilini HSK 6 darajasida biladigan, Xitoyda sotib olish bilan shugʻullangan xodimlarimiz ishlaydi. Komissiya — buyurtma summasining 3% dan; buyurtmaning umumiy hajmi kamida 1 m³ boʻlishi kerak. Tovar Ivu (义乌) omboriga keladi va yigʻma yuk bilan taxminan 15–25 kunda Toshkentga yetadi.',
      facts: [
        { label: 'Komissiya, buyurtma summasidan', value: '3% dan' },
        { label: 'Buyurtmaning umumiy hajmi', value: '1 m³ dan' },
        { label: 'Toshkentgacha, avto', value: '15–25 kun' },
        { label: 'Xitoy tilini shu darajada biladigan xodimlarimiz bor', value: 'HSK 6' },
      ],
    },
    sections: [
      {
        heading: 'Xitoydan ulgurji (optom) xarid xizmati nima va kimga kerak?',
        body: [
          'Xitoydan ulgurji (optom) xarid — GSR Logistics xizmati: siz uchun tovar partiyasini zavoddan yoki ulgurji sotuvchidan sotib olamiz, sotuvchiga yuanda toʻlaymiz, siz esa bizga soʻmda toʻlaysiz; tovarni Ivu omborida qabul qilib, Toshkentga olib kelamiz. Ulgurji (optom) — tovarni donalab emas, partiya bilan sotib olish.',
          'GSR Logisticsʼdagi ulgurji xarid xizmati mijoz Xitoydan ulgurji sotib olmoqchi boʻlgan har qanday tovar uchun moʻljallangan — kontrafaktdan va taqiqlangan tovarlar roʻyxatidagi mahsulotlardan tashqari. Oʻzbekistonda bu xizmat toʻrt xil mijozga mos keladi:',
        ],
        bullets: [
          'Doʻkon egalari va ulgurji savdogarlar (Abu Sahiy, Chorsu, Bek Baraka bozorlari): sotish uchun tovarni partiya bilan oladi — masalan, kiyim, oyoq kiyim yoki uy-roʻzgʻor mollari.',
          'Uzum, Yandex Market va Instagram sotuvchilari: bitta tovardan koʻp dona oladi — masalan, telefon aksessuarlari, oʻyinchoqlar yoki mayda uy-roʻzgʻor mollari.',
          'Ishlab chiqaruvchilar: ishlab chiqarish ehtiyojlari uchun oladi — masalan, xomashyo, komponentlar, qadoqlash materiali yoki ehtiyot qismlar.',
          'Qurilish va sanoat sohasidagi xaridorlar: obyekt yoki loyiha uchun buyurtma beradi — masalan, plitka, santexnika yoki elektr mollari.',
        ],
        callout: {
          title: 'Kimga mos emas',
          text: 'Ulgurji xarid xizmati bitta dona tovar yoki umumiy hajmi 1 m³ dan kichik buyurtma uchun emas. GSR Logistics kontrafakt (soxta brend) tovarni qidirmaydi va tashimaydi — u Oʻzbekiston bojxonasida musodara qilinadi. GSR Logistics taqiqlangan tovarlar roʻyxatidagi mahsulotlarni ham sotib olmaydi.',
          tone: 'warn',
        },
      },
      {
        heading: 'Zavoddan yoki ulgurji sotuvchidan: qaysi yoʻl sizga mos?',
        body: [
          'Zavoddan sotib olishda buyurtma tovarni ishlab chiqaradigan korxonaning oʻziga beriladi. Zavod odatda buyurtma asosida ishlab chiqaradi, shuning uchun uning taklifida ishlab chiqarish muddati va oʻz minimal partiyasi (MOQ) koʻrsatiladi. Zavoddan sotib olish katta yoki takrorlanadigan buyurtmaga hamda spetsifikatsiyangiz boʻyicha tayyorlanadigan tovarga mos keladi.',
          'Sotuvchilardan ulgurji (optom) sotib olishda odatda tayyor, yaʼni allaqachon ishlab chiqarilgan tovar olinadi — ulgurji bozordagi sotuvchidan yoki 1688 ulgurji saytidagi sotuvchidan. Ulgurji sotuvchining taklifida odatda ishlab chiqarish muddati emas, joʻnatish muddati koʻrsatiladi, bir necha sotuvchining tovarini esa bitta buyurtmaga jamlash mumkin.',
        ],
        table: {
          head: ['', 'Zavoddan', 'Ulgurji sotuvchidan'],
          rows: [
            ['Bu nima', 'ishlab chiqaruvchining oʻzi; tovar odatda buyurtma asosida ishlab chiqariladi', 'odatda tayyor tovar — ulgurji bozordagi yoki ulgurji saytdagi sotuvchidan'],
            ['Qachon mos keladi', 'katta yoki takrorlanadigan buyurtma; spetsifikatsiyangiz boʻyicha yoki oʻz brendingiz ostidagi tovar', 'birinchi yoki aralash buyurtma; turli sotuvchilardan bir necha tovar bitta buyurtmada'],
            ['Minimum', 'zavodning oʻz minimumi (MOQ); biz orqali buyurtmaning umumiy hajmi esa kamida 1 m³ boʻlishi kerak', 'sotuvchining oʻz minimumi; biz orqali buyurtmaning umumiy hajmi esa kamida 1 m³ boʻlishi kerak'],
            ['Eʼtibor bering', 'avval zavod taklifida koʻrsatilgan ishlab chiqarish muddati oʻtadi, keyin yoʻl muddati boshlanadi', 'oʻzi ishlab chiqarmaydigan sotuvchining narxi odatda zavodning oʻz narxidan yuqori boʻladi'],
          ],
          note: 'Qaysi yoʻlni tanlashni takliflar asosida siz bilan kelishamiz; zavodning yoki sotuvchining oʻz minimumini biz emas, oʻsha zavod yoki sotuvchi belgilaydi.',
        },
      },
      {
        heading: 'Ulgurji xaridlar boʻyicha kim ishlaydi va «HSK 6 darajasi» nima degani?',
        body: [
          'GSR Logisticsʼda xitoy tilini HSK 6 darajasida biladigan xodimlar bor: ular Xitoyda sotib olish bilan shugʻullangan va zavodlardan sotib olish hamda sotuvchilardan ulgurji (optom) xarid qilish boʻyicha ishlaydi.',
          'HSK — xitoy tili ona tili boʻlmaganlar uchun moʻljallangan, Xitoyning standartlashtirilgan til bilish imtihoni; uning 6-darajasi 5 000 va undan ortiq soʻzni bilishni talab qiladi.',
          'Menejerlarimiz oʻzbek, rus va xitoy tillarida gaplashadi. Xitoy tilini bilishingiz ham, xitoy bank kartasi yoki Alipay hisobingiz boʻlishi ham shart emas. Zavod yoki sotuvchi bilan muzokarani GSR Logistics olib boradi; takliflar va namuna boʻyicha qarorni siz qabul qilasiz.',
        ],
      },
      {
        heading: 'Ulgurji xarid qanday bosqichlardan oʻtadi?',
        body: [
          'Ulgurji xarid olti bosqichdan iborat: har bir bosqichda qarorni siz qabul qilasiz, GSR Logistics esa takliflarni tayyorlaydi va xaridni olib boradi.',
        ],
        steps: [
          { title: 'Soʻrov', text: 'Telegramda menejerga tovarning havolasi, rasmi yoki tavsifini, miqdorini va talablaringizni yuborasiz. Zavod yoki sotuvchini oʻzingiz topgan boʻlsangiz, qaysi ekanini ayting.' },
          { title: 'Takliflar va muzokara', text: 'Sizga takliflar keladi: narx, sotuvchining minimumi va ishlab chiqarish yoki joʻnatish muddati. Muzokarani xitoy tilida oʻzimiz olib boramiz, komissiyamiz esa hisob-kitobda alohida qator sifatida koʻrsatiladi.' },
          { title: 'Namuna', text: 'Avval namunani koʻrmoqchi boʻlsangiz, partiyani sotib olishdan oldin namuna buyurtma qilamiz. Namuna Ivu omboriga keladi — suratga olamiz, oʻlchaymiz, video yuboramiz; xohlasangiz, avia bilan taxminan 5–10 kunda Toshkentga joʻnatamiz.' },
          { title: 'Shartnoma va toʻlov', text: 'Zavod buyurtmasi uchun spetsifikatsiya, sifat mezonlari, muddat va toʻlov jadvali yozilgan shartnoma tuziladi. Siz bizga soʻmda toʻlaysiz — yuridik shaxslar hisob-faktura boʻyicha bank oʻtkazmasi bilan — biz esa zavod yoki sotuvchiga yuanda toʻlaymiz.' },
          { title: 'Ivu omborida qabul', text: 'Har bir posilkani sizning GS kodingiz (markirovka) bilan qabul qilamiz. Ivu omboridagi standart qabul tashish narxiga kiradi: posilka soni, tashqi holati, ogʻirligi va oʻlchami, tashqi foto. Qutini ochib tekshirish va tafsilotli foto-hisobot — ixtiyoriy qoʻshimcha xizmatlar.' },
          { title: 'Konsolidatsiya, Toshkentga yetkazish va bojxona', text: 'Partiya yigʻma yuk (taxminan 15–25 kun) yoki avia (5–10 kun) bilan Toshkentga joʻnatiladi. Yigʻma yuk tarifiga bojxona rasmiylashtiruvi kompaniya hujjatlari bilan kiritilgan; boj va QQS qonun boʻyicha toʻlanadi. Har bir qutingizning holati Telegramdagi @GSR_GROUP_AGENT_bot kuzatuv botida bosqichma-bosqich koʻrinadi.' },
        ],
      },
      {
        heading: 'Xizmat qancha turadi va toʻlov qanday qilinadi?',
        body: [
          'Ulgurji xarid narxi uchta asosiy qismdan tuziladi: zavod yoki sotuvchi narxidagi tovar, bizning komissiyamiz va Toshkentgacha tashish haqi. Kerak boʻlsa, namuna, Xitoy ichidagi yetkazib berish va Ivu omboridagi ixtiyoriy tekshiruvlar qoʻshiladi; boj va QQS qonun boʻyicha toʻlanadi. Komissiya — buyurtma summasining 3% dan; u hisob-kitobda alohida qator sifatida koʻrsatiladi.',
          'Siz GSR Logisticsʼga soʻmda toʻlaysiz; yuridik shaxslar hisob-faktura boʻyicha bank oʻtkazmasi bilan toʻlaydi. Zavod yoki sotuvchiga yuanda biz toʻlaymiz. Tovar narxi va komissiya buyurtmadan oldin, tashish haqi esa yuk Toshkentga kelganda toʻlanadi. Zavod buyurtmasida toʻlov jadvalini zavod bilan tuzilgan shartnoma belgilaydi: Xitoyda odatiy toʻlov tartibi — 30% oldindan, qolgani yuklashdan oldin; bu toʻlovni yuanda biz oʻtkazamiz.',
        ],
        table: {
          head: ['Qism', 'Narx'],
          rows: [
            ['Komissiya', 'buyurtma summasining 3% dan'],
            ['Tovar', 'zavod yoki sotuvchi narxi, yuanda'],
            ['Namuna va Xitoy ichidagi yetkazib berish', 'alohida hisoblanadi; Xitoy ichidagi yetkazib berish — sotuvchi narxi boʻyicha'],
            ['Qutini ochib sanash va tekshirish, ixtiyoriy', '1 $/kg'],
            ['Tafsilotli foto-hisobot (ochilgan quti), ixtiyoriy', '1 $ / joy'],
            ['Toshkentgacha tashish', 'yigʻma yuk 110 $/m³ dan, stavka yuk zichligiga qarab; avia 9 $/kg dan'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. Aniq foiz shartnomada yoziladi.',
        },
      },
      {
        heading: 'Uchta xizmatdan qaysi biri sizga kerak?',
        body: [
          'GSR Logistics Xitoydan tovarni uchta xizmat orqali sotib olib beradi (uskunalar va avtomobillar uchun alohida xizmatlar bor); qaysi biri kerakligi nimadan boshlashingizga bogʻliq: ishlab chiqaruvchisi sizga nomaʼlum tovar, saytdagi tovar havolasi yoki sotib olinadigan ulgurji partiya.',
        ],
        table: {
          head: ['Sizdagi holat', 'Xizmat'],
          rows: [
            ['Tovarni bilasiz, lekin uni kim ishlab chiqarishini bilmaysiz', 'Tovar va ishlab chiqaruvchi topish'],
            ['1688, Taobao, Pinduoduo yoki Alibabadan tovar havolangiz bor', '1688 va Taobaodan sotib olish'],
            ['Ulgurji partiyani sotib olib, Toshkentga olib kelish kerak — zavoddan yoki ulgurji sotuvchidan, uni oʻzingiz topgan boʻlsangiz ham, biz topsak ham', 'Ulgurji (optom) sotib olish'],
          ],
          note: 'Qaysi xizmatni tanlamang, bitta menejer bilan bitta shartnoma asosida ishlaysiz; har birida komissiya buyurtma summasining 3% dan (taxminiy, 2026-yil 8-sentabr).',
        },
      },
    ],
    faq: [
      {
        q: 'Xitoydan optom tovar zakaz qilish uchun nimadan boshlayman?',
        a: 'GSR Logistics menejeriga Telegramda yozishdan boshlang: tovarning havolasi, rasmi yoki tavsifi, miqdori va talablaringizni yuboring. Javobda takliflar olasiz: narx, sotuvchining minimumi va alohida qatorda bizning komissiyamiz.',
      },
      {
        q: 'Xitoyga oʻzim borishim yoki tarjimon yollashim shartmi?',
        a: 'Yoʻq. GSR Logistics siz uchun tovarni izlaydi, xitoy tilida muzokara olib boradi, sotuvchiga toʻlaydi, tovarni qabul qiladi va joʻnatadi. Xitoy tilini HSK 6 darajasida biladigan xodimlarimiz bor. Takliflar va namuna boʻyicha qarorni siz qabul qilasiz.',
      },
      {
        q: 'Xitoydan vositachisiz, oʻzim optom sotib olsam boʻladimi?',
        a: 'Ha, agar toʻrt ishni oʻzingiz qila olsangiz: sotuvchi bilan xitoy tilida muzokara qilish, sotuvchiga yuanda toʻlash, Xitoyda tovarni qabul qilib tekshiradigan odam topish hamda tashish va bojxona rasmiylashtiruvini tashkil qilish. GSR Logistics shu toʻrt ishni xarid boʻyicha vositachingiz sifatida bajaradi. Komissiya oldindan aytiladi va hisob-kitobda alohida qator sifatida koʻrsatiladi; Toshkentgacha tashish alohida hisoblanadi.',
      },
      {
        q: 'Zavoddan toʻgʻridan-toʻgʻri sotib olasizmi?',
        a: 'Ha. Zavoddan sotib olish — GSR Logisticsʼdagi ulgurji xaridning ikki yoʻlidan biri: buyurtma tovarni ishlab chiqaradigan zavodning oʻziga beriladi. Zavodga buyurtma berishdan oldin uning biznes-litsenziyasi, ishlab chiqarish quvvati va eksport tajribasini tekshiramiz; keyin spetsifikatsiya, sifat mezonlari, muddat va toʻlov jadvali yozilgan shartnoma tuziladi.',
      },
      {
        q: 'Optom bozorlardagi va 1688-dagi sotuvchilardan ham olib berasizmi?',
        a: 'Ha. Sotuvchilardan ulgurji (optom) sotib olish — ulgurji xaridning ikki yoʻlidan ikkinchisi: GSR Logistics tovarni 1688-dagi ulgurji sotuvchilardan va ulgurji bozorlardagi (masalan, Ivu Futian bozoridagi) sotuvchilardan sotib oladi. Bir necha sotuvchidan kelgan tovar Ivudagi qabul punktida bitta GS kodi (markirovka) ostida yigʻiladi va 1 m³ minimum uchun birga hisoblanadi.',
      },
      {
        q: '«Xitoy tilini HSK 6 darajasida bilish» nima degani?',
        a: 'HSK — xitoy tili ona tili boʻlmaganlar uchun moʻljallangan, Xitoyning standartlashtirilgan til bilish imtihoni; uning 6-darajasi 5 000 va undan ortiq soʻzni bilishni talab qiladi. GSR Logisticsʼda xitoy tilini HSK 6 darajasida biladigan xodimlar bor: ular Xitoyda sotib olish bilan shugʻullangan va zavodlardan sotib olish hamda sotuvchilardan ulgurji (optom) xarid qilish boʻyicha ishlaydi.',
      },
      {
        q: 'Xitoydan ulgurji (optom) xarid xizmati qancha turadi?',
        a: 'GSR Logisticsʼda ulgurji xarid komissiyasi — buyurtma summasining 3% dan (taxminiy, 2026-yil 8-sentabr); u hisob-kitobda alohida qator sifatida koʻrsatiladi. Aniq foiz shartnomada yoziladi. Namuna, Xitoy ichidagi yetkazib berish va Toshkentgacha tashish alohida hisoblanadi.',
      },
      {
        q: 'Xitoydan ulgurji xarid uchun eng kam buyurtma qancha?',
        a: 'GSR Logistics orqali buyurtmaning umumiy hajmi, manba qaysi boʻlishidan qatʼi nazar, kamida 1 m³ boʻlishi kerak. Turli sotuvchilardan olingan tovar bitta GS kodi (markirovka) ostida yigʻilib, birga hisoblanadi. Zavodning yoki sotuvchining oʻz minimumini (MOQ) GSR Logistics emas, oʻsha zavod yoki sotuvchi belgilaydi. Bitta dona yoki mayda buyurtmalarni olmaymiz.',
      },
      {
        q: 'Men qanday toʻlayman va sotuvchiga kim toʻlaydi?',
        a: 'Siz GSR Logisticsʼga soʻmda toʻlaysiz; yuridik shaxslar hisob-faktura boʻyicha bank oʻtkazmasi bilan toʻlaydi. Zavod yoki sotuvchiga yuanda GSR Logistics toʻlaydi. Sizga xitoy bank kartasi ham, Alipay hisobi ham kerak emas.',
      },
      {
        q: 'Qaysi tovarlarni ulgurji (optom) olib berasiz, qaysilarini yoʻq?',
        a: 'Mijoz Xitoydan ulgurji sotib olmoqchi boʻlgan har qanday tovarni GSR Logistics sotib olib beradi — masalan, kiyim, oyoq kiyim, telefon aksessuarlari, ehtiyot qismlar (zapchastlar), mebel, uy-roʻzgʻor mollari va oʻyinchoqlar; kontrafakt va taqiqlangan tovarlar roʻyxatidagi mahsulotlar bundan mustasno. Taqiqlangan tovarlar roʻyxatiga portlovchi va yonuvchi moddalar; oʻsimlik, hayvon va tez buziladigan mahsulotlar; pul, qimmatbaho metall va toshlar kiradi. Suyuqlik, atir, aerozol, magnit va litiy batareyali tovarlar avia bilan emas, avto kargo bilan boradi.',
      },
      {
        q: 'Ulgurji partiya Toshkentga necha kunda yetadi?',
        a: 'GSR Logistics orqali sotib olingan ulgurji partiya Ivu omboridan Toshkentga yigʻma yuk bilan taxminan 15–25 kunda, avia bilan 5–10 kunda yetadi (muddatlar taxminiy, 2026-yil 8-sentabrda yangilangan). Zavodning ishlab chiqarish muddati bunga kirmaydi — u zavod taklifida koʻrsatiladi.',
      },
      {
        q: 'Afgʻonistonlik tadbirkorlar uchun ham sotib olasizmi?',
        a: 'Ha. Xitoyda tovar topish va sotib olish xizmati afgʻonistonlik tadbirkorlar uchun ham ishlaydi: tovarni topamiz, sotib olamiz va fura bilan Hayraton yoki Mozori Sharifgacha yetkazamiz. Shartlarni menejer buyurtmadan oldin aytadi.',
      },
    ],
    related: ['sourcing', 'buying', 'truck'],
    guideKeys: ['find-supplier', 'yiwu-guangzhou', 'order-from-1688', 'prohibited-goods'],
    cta: {
      title: 'Tovar va miqdorni yozing — takliflarni yuboramiz.',
      text: 'Tovarning havolasi, rasmi yoki tavsifi, miqdori va talablaringizni yuboring; zavod yoki sotuvchini topgan boʻlsangiz, uni ham yozing. Menejeringiz takliflar bilan javob beradi va komissiyamizni alohida qatorda koʻrsatadi.',
      draft: 'Assalomu alaykum! Xitoydan optom tovar sotib olmoqchiman. Tovar: … Miqdor: … Qayerdan (zavod / ulgurji sotuvchi / bilmayman): … Talablar: …',
    },
    updated: '2026-11-18',
  },

  ru: {
    key: 'wholesale',
    seo: {
      title: 'Оптом из Китая в Ташкент — закупка у фабрик и продавцов',
      description:
        'Закупаем товары в Китае оптом у фабрик и оптовых продавцов для бизнеса в Узбекистане: над закупкой работают сотрудники, знающие китайский на уровне HSK 6. Оплата в сумах, продавцу платим в юанях; проверяем товар на складе в Иу и привозим в Ташкент. Комиссия — от 3% суммы заказа.',
    },
    hero: {
      eyebrow: 'Услуга 06 — Оптовые закупки',
      h1: 'Оптовые закупки в Китае: у фабрик и у оптовых продавцов',
      intro:
        'GSR Logistics, логистическая компания в Ташкенте, по заказу клиента закупает товары в Китае оптом для магазинов, оптовиков, продавцов маркетплейсов и производителей — у фабрики или завода либо у оптового продавца — и привозит их в Ташкент. Над этими закупками работают сотрудники, которые знают китайский язык на уровне HSK 6 и занимались закупками в Китае. Комиссия — от 3% суммы заказа; общий объём заказа должен быть от 1 м³. Товар поступает на склад в Иу (义乌) и сборным грузом доходит до Ташкента ориентировочно за 15–25 дней.',
      facts: [
        { label: 'Комиссия от суммы заказа', value: 'от 3%' },
        { label: 'Общий объём заказа', value: 'от 1 м³' },
        { label: 'До Ташкента, авто', value: '15–25 дней' },
        { label: 'У нас есть сотрудники с таким уровнем китайского', value: 'HSK 6' },
      ],
    },
    sections: [
      {
        heading: 'Что такое оптовая закупка в Китае и кому она нужна?',
        body: [
          'Оптовая закупка в Китае — услуга GSR Logistics: компания закупает для клиента партию товара у фабрики или у оптового продавца, принимает её на складе в Иу и привозит в Ташкент; клиент платит в сумах, а продавцу компания платит в юанях. Покупать оптом — значит брать товар партией, а не поштучно.',
          'Оптовая закупка в GSR Logistics рассчитана на любой товар, который клиент хочет купить в Китае оптом, кроме контрафакта и товаров из списка запрещённых. В Узбекистане услуга подходит четырём типам клиентов:',
        ],
        bullets: [
          'Владельцы магазинов и оптовики (рынки Абу Сахий, Чорсу, Бек Барака), которые закупают товар партиями, например одежду, обувь или товары для дома.',
          'Продавцы Uzum, Яндекс Маркета и Instagram, которым нужен один товар в большом количестве, например аксессуары для телефонов, игрушки или мелкие товары для дома.',
          'Производители, которые закупают материалы для выпуска продукции, например сырьё, комплектующие, упаковку или запчасти.',
          'Строительные и промышленные компании, которые заказывают товар для объекта или проекта, например плитку, сантехнику или электротовары.',
        ],
        callout: {
          title: 'Кому не подойдёт',
          text: 'Оптовая закупка не подойдёт, если вам нужна одна штука или общий объём заказа меньше 1 м³. GSR Logistics не ищет и не возит контрафакт — на таможне Узбекистана его конфискуют — и не закупает товары из списка запрещённых.',
          tone: 'warn',
        },
      },
      {
        heading: 'У фабрики или у оптового продавца: что вам подойдёт?',
        body: [
          'При закупке у фабрики заказ размещается у компании, которая сама производит товар. Фабрика обычно делает товар под заказ, поэтому в её предложении указаны срок производства и минимальная партия самой фабрики (MOQ). Закупка у фабрики подходит для крупного или повторного заказа и для товара по вашей спецификации.',
          'Оптовая закупка у продавцов — это обычно покупка готового, уже произведённого товара у продавца на оптовом рынке или у оптового продавца на 1688 (это оптовая площадка). В предложении оптового продавца обычно указан не срок производства, а срок отправки; товары от нескольких продавцов можно объединить в один заказ.',
        ],
        table: {
          head: ['', 'У фабрики', 'У оптового продавца'],
          rows: [
            ['Что это', 'сам производитель; товар обычно делают под заказ', 'обычно готовый товар — у продавца на оптовом рынке или на оптовой площадке'],
            ['Когда подходит', 'крупный или повторный заказ; товар по вашей спецификации или под вашим брендом', 'первый или смешанный заказ; несколько товаров от разных продавцов в одном заказе'],
            ['Минимум', 'минимум самой фабрики (MOQ); общий объём заказа через нас всё равно от 1 м³', 'минимум самого продавца; общий объём заказа через нас всё равно от 1 м³'],
            ['Что учесть', 'сначала идёт срок производства, указанный в предложении фабрики, потом — срок перевозки', 'продавец, который сам не производит товар, обычно берёт дороже, чем сама фабрика'],
          ],
          note: 'Способ закупки согласуем с вами по полученным предложениям; минимум фабрики или продавца устанавливают они сами, а не мы.',
        },
      },
      {
        heading: 'Кто работает над оптовыми закупками и что значит «уровень HSK 6»?',
        body: [
          'В GSR Logistics есть сотрудники, которые знают китайский язык на уровне HSK 6: они занимались закупками в Китае и работают над закупками у фабрик и оптовыми закупками у продавцов.',
          'HSK (Hanyu Shuiping Kaoshi) — стандартизированный экзамен Китая по китайскому языку для тех, для кого он не родной; уровень 6 предполагает словарный запас от 5 000 слов.',
          'Наши менеджеры говорят на узбекском, русском и китайском. Знать китайский, иметь китайскую банковскую карту или аккаунт Alipay вам не нужно. Переговоры с фабрикой или продавцом ведёт GSR Logistics; вы принимаете решения по предложениям и образцу.',
        ],
      },
      {
        heading: 'Как проходит оптовая закупка: от заявки до Ташкента?',
        body: [
          'Оптовая закупка проходит в шесть этапов: на каждом этапе решение принимаете вы, а GSR Logistics готовит предложения и закупает товар.',
        ],
        steps: [
          { title: 'Заявка', text: 'Вы присылаете менеджеру в Telegram ссылку, фото или описание товара, количество и свои требования. Если вы уже нашли фабрику или продавца, назовите их.' },
          { title: 'Предложения и переговоры', text: 'Вы получаете предложения с ценой, минимумом продавца и сроком производства или отправки. Переговоры на китайском ведём сами. Нашу комиссию показываем в расчёте отдельной строкой.' },
          { title: 'Образец', text: 'Если хотите сначала увидеть образец, заказываем его до закупки партии. Образец приходит на склад в Иу — фотографируем, измеряем, снимаем видео; по желанию отправляем авиа в Ташкент ориентировочно за 5–10 дней.' },
          { title: 'Договор и оплата', text: 'При заказе у фабрики заключается договор со спецификацией, критериями качества, сроками и графиком оплаты. Вы платите нам в сумах (юридические лица — банковским переводом по счёту), а фабрике или продавцу мы платим в юанях.' },
          { title: 'Приёмка на складе в Иу', text: 'Каждую посылку принимаем под вашим GS-кодом (маркировкой). Стандартная приёмка на складе в Иу входит в стоимость перевозки: количество посылок, внешнее состояние, вес и габариты, фото снаружи. Проверка со вскрытием коробки и подробный фотоотчёт — дополнительные услуги по желанию.' },
          { title: 'Консолидация, перевозка в Ташкент и таможня', text: 'Партия едет в Ташкент сборным грузом (ориентировочно 15–25 дней) или авиа (5–10 дней). В тариф сборного груза входит таможенное оформление по документам компании; пошлина и НДС платятся по закону. В Telegram-боте @GSR_GROUP_AGENT_bot виден статус каждой коробки — по этапам.' },
        ],
      },
      {
        heading: 'Сколько стоит услуга и как платить?',
        body: [
          'Стоимость оптовой закупки складывается из трёх основных частей: товар по цене фабрики или продавца, наша комиссия и перевозка до Ташкента. Образец, доставка внутри Китая и дополнительные проверки на складе в Иу (по желанию) добавляются, если они есть в заказе; пошлина и НДС платятся по закону. Комиссия — от 3% суммы заказа; в расчёте она показана отдельной строкой.',
          'Вы платите GSR Logistics в сумах; юридические лица — банковским переводом по счёту. Фабрике или продавцу мы платим в юанях. Цену товара и комиссию вы платите до размещения заказа, перевозку — по прибытии груза в Ташкент. При заказе у фабрики график оплаты задаёт договор с фабрикой: обычный порядок оплаты в Китае — 30% аванс, остаток перед отгрузкой; платёж в юанях проводим мы.',
        ],
        table: {
          head: ['Что оплачивается', 'Цена'],
          rows: [
            ['Комиссия', 'от 3% суммы заказа'],
            ['Товар', 'цена фабрики или продавца, в юанях'],
            ['Образец и доставка внутри Китая', 'считаются отдельно; доставка внутри Китая — по тарифу продавца'],
            ['Пересчёт и проверка со вскрытием, по желанию', '1 $/кг'],
            ['Подробный фотоотчёт (вскрытая коробка), по желанию', '1 $ / место'],
            ['Перевозка до Ташкента', 'сборный груз — от 110 $/м³, ставка зависит от плотности груза; авиа — от 9 $/кг'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. Точный процент фиксируется в договоре.',
        },
      },
      {
        heading: 'Какая из трёх услуг по закупке вам нужна?',
        body: [
          'У GSR Logistics три услуги по закупке товаров в Китае (для оборудования и автомобилей есть отдельные услуги), и выбор зависит от того, с чего вы начинаете: с товара, производителя которого вы не знаете, со ссылки на товар с торговой площадки или с оптовой партии, которую нужно закупить.',
        ],
        table: {
          head: ['Ваша ситуация', 'Услуга'],
          rows: [
            ['Вы знаете товар, но не знаете, кто его производит', 'Поиск товаров и производителей'],
            ['У вас есть ссылка на товар с 1688, Taobao, Pinduoduo или Alibaba', 'Выкуп с 1688 и Taobao'],
            ['Вам нужно закупить оптовую партию — у фабрики или у оптового продавца, которых нашли вы или найдём мы, — и привезти её в Ташкент', 'Оптовые закупки в Китае'],
          ],
          note: 'Какую бы услугу вы ни выбрали, вы работаете с одним менеджером по одному договору; комиссия в каждой — от 3% суммы заказа (ориентировочно, 8 сентября 2026 г.).',
        },
      },
    ],
    faq: [
      {
        q: 'С чего начать, если я хочу заказать товар из Китая оптом?',
        a: 'Напишите менеджеру GSR Logistics в Telegram и пришлите ссылку, фото или описание товара, количество и ваши требования. Вы получите предложения с ценой, минимумом продавца и нашей комиссией отдельной строкой.',
      },
      {
        q: 'Нужно ли ехать в Китай или нанимать переводчика?',
        a: 'Нет. GSR Logistics за вас ищет товар, ведёт переговоры на китайском, платит продавцу, принимает и отправляет товар. У нас есть сотрудники, которые знают китайский язык на уровне HSK 6. Вы принимаете решения по предложениям и по образцу.',
      },
      {
        q: 'Можно ли закупать в Китае оптом без посредников?',
        a: 'Да, если вы сами можете решить четыре задачи: договориться с продавцом на китайском, заплатить ему в юанях, найти того, кто примет и проверит товар в Китае, и организовать перевозку и таможенное оформление. GSR Logistics решает эти четыре задачи как ваш посредник по закупкам. Комиссию называем заранее и показываем в расчёте отдельной строкой; перевозка до Ташкента считается отдельно.',
      },
      {
        q: 'Закупаете ли вы напрямую у фабрик?',
        a: 'Да. Закупка у фабрик — один из двух способов оптовой закупки в GSR Logistics: заказ размещается у фабрики, которая производит товар. Перед заказом у фабрики проверяем её бизнес-лицензию, производственные мощности и экспортный опыт; затем заключается договор со спецификацией, критериями качества, сроками и графиком оплаты.',
      },
      {
        q: 'Закупаете ли вы на оптовых рынках и у оптовых продавцов на 1688?',
        a: 'Да. Оптовая закупка у продавцов — второй из двух способов оптовой закупки: GSR Logistics закупает у оптовых продавцов на 1688 и у продавцов на оптовых рынках, например на рынке Футянь в Иу. Товар от нескольких продавцов собирается в пункте приёма в Иу под одним GS-кодом (маркировкой), и весь объём вместе засчитывается в минимум 1 м³.',
      },
      {
        q: 'Что значит «китайский на уровне HSK 6»?',
        a: 'HSK (Hanyu Shuiping Kaoshi) — стандартизированный экзамен Китая по китайскому языку для тех, для кого он не родной; уровень 6 предполагает словарный запас от 5 000 слов. В GSR Logistics есть сотрудники, которые знают китайский язык на уровне HSK 6: они занимались закупками в Китае и работают над закупками у фабрик и оптовыми закупками у продавцов.',
      },
      {
        q: 'Сколько стоит оптовая закупка в Китае?',
        a: 'Комиссия GSR Logistics за оптовую закупку — от 3% суммы заказа (ориентировочно, 8 сентября 2026 г.); в расчёте она показана отдельной строкой. Точный процент фиксируется в договоре. Образец, доставка внутри Китая и перевозка до Ташкента считаются отдельно.',
      },
      {
        q: 'Какая минимальная партия для оптовой закупки в Китае?',
        a: 'Общий объём заказа через GSR Logistics — из любого источника — должен быть от 1 м³. Товар от разных продавцов собирается под одним GS-кодом (маркировкой) и считается вместе. Минимум фабрики или продавца (MOQ) устанавливают они сами, а не GSR Logistics. Единичные и мелкие заказы не берём.',
      },
      {
        q: 'Как оплатить товар и кто платит продавцу?',
        a: 'Вы платите GSR Logistics в сумах; юридические лица — банковским переводом по счёту. Фабрике или продавцу GSR Logistics платит в юанях. Китайская банковская карта и аккаунт Alipay вам не нужны.',
      },
      {
        q: 'Какие товары вы закупаете оптом, а какие нет?',
        a: 'GSR Logistics закупает любой товар, который клиент хочет купить в Китае оптом (например, одежду, обувь, аксессуары для телефонов, запчасти, мебель, товары для дома и игрушки), кроме контрафакта и товаров из списка запрещённых. В список запрещённых входят взрывчатые и горючие вещества; растения, животные и скоропортящиеся продукты; деньги, драгоценные металлы и камни. Жидкости, духи, аэрозоли, магниты и товары с литиевыми батареями едут авто, а не авиа.',
      },
      {
        q: 'За сколько дней оптовая партия приезжает в Ташкент?',
        a: 'Оптовая партия, закупленная через GSR Logistics, идёт со склада в Иу до Ташкента сборным грузом 15–25 дней, авиа — 5–10 дней (сроки ориентировочные, обновлены 8 сентября 2026 г.). Срок производства на фабрике считается отдельно и указан в предложении фабрики.',
      },
      {
        q: 'Закупаете ли вы и для предпринимателей из Афганистана?',
        a: 'Да. Поиск и выкуп товаров в Китае доступны и предпринимателям из Афганистана: находим товар, выкупаем и доставляем фурой до Хайратона или Мазари-Шарифа. Условия менеджер называет до заказа.',
      },
    ],
    related: ['sourcing', 'buying', 'truck'],
    guideKeys: ['find-supplier', 'yiwu-guangzhou', 'order-from-1688', 'prohibited-goods'],
    cta: {
      title: 'Назовите товар и количество — пришлём предложения.',
      text: 'Пришлите ссылку, фото или описание товара, количество и требования — и назовите фабрику или продавца, если вы их уже нашли. Менеджер ответит предложениями и покажет нашу комиссию отдельной строкой.',
      draft: 'Здравствуйте! Хочу закупить товар в Китае оптом. Товар: … Количество: … У кого закупать (фабрика / оптовый продавец / не знаю): … Требования: …',
    },
    updated: '2026-11-18',
  },

  en: {
    key: 'wholesale',
    seo: {
      title: 'Wholesale from China to Uzbekistan: factories and markets',
      description:
        'Wholesale buying in China for businesses in Uzbekistan: employees who know Chinese at HSK 6 level work on buying from factories and wholesale sellers. You pay in UZS, the seller is paid in yuan, the goods are checked at the Yiwu warehouse and carried to Tashkent. Commission from 3% of the order value.',
    },
    hero: {
      eyebrow: 'Service 06 — Wholesale buying',
      h1: 'Buying wholesale from China: factories and wholesale sellers',
      intro:
        'GSR Logistics, a logistics company in Tashkent, buys goods wholesale in China for shops, wholesalers, marketplace sellers and manufacturers — from a factory or from a wholesale seller, on the client’s order — and brings them to Tashkent. Employees who know Chinese at HSK 6 level and have experience of purchasing in China work on these purchases. The commission starts at 3% of the order value; an order must total at least 1 m³. Goods arrive at the Yiwu (义乌) warehouse and reach Tashkent by consolidated truck in roughly 15–25 days.',
      facts: [
        { label: 'Commission on order value', value: 'from 3%' },
        { label: 'Total order volume', value: 'from 1 m³' },
        { label: 'To Tashkent by truck', value: '15–25 days' },
        { label: 'We have employees at this level of Chinese', value: 'HSK 6' },
      ],
    },
    sections: [
      {
        heading: 'What is wholesale buying in China, and who is it for?',
        body: [
          'Wholesale buying in China is a GSR Logistics service: the company buys a batch of goods for a client from a factory or from a wholesale seller, pays the seller in yuan while the client pays in UZS, receives the goods at the Yiwu warehouse and brings them to Tashkent. Wholesale means buying goods by the batch rather than as single pieces.',
          'Wholesale buying at GSR Logistics is for any kind of goods a client wants to buy wholesale from China, except counterfeit goods and goods on the prohibited list. In Uzbekistan the service suits four kinds of client:',
        ],
        bullets: [
          'Shop owners and wholesalers (Abu Sahiy, Chorsu, Bek Baraka markets) who buy stock by the batch — for example clothing, footwear or household goods.',
          'Sellers on Uzum, Yandex Market and Instagram who need many pieces of one product — for example phone accessories, toys or small household goods.',
          'Manufacturers who need supplies for production — for example raw materials, components, packaging or spare parts.',
          'Construction and industrial buyers who order for a site or a project — for example tiles, plumbing or electrical goods.',
        ],
        callout: {
          title: 'Not for',
          text: 'Wholesale buying is not for a single item or for an order under 1 m³ in total. GSR Logistics does not source or ship counterfeit goods — Uzbek customs confiscates them — and does not buy goods on the prohibited list.',
          tone: 'warn',
        },
      },
      {
        heading: 'Factory or wholesale seller: which route suits your order?',
        body: [
          'Buying from the factory means that the order goes to the company that makes the goods. A factory usually produces to order, so its offer names a production time and the factory’s own minimum order quantity (MOQ). The factory route suits a large or repeat order and goods made to your specification.',
          'Buying wholesale from sellers usually means buying ready stock — goods that are already made — from a seller at a wholesale market or from a wholesale seller on 1688, a wholesale marketplace. A wholesale seller’s offer usually names a dispatch time rather than a production time, and products from several sellers can be combined into one order.',
        ],
        table: {
          head: ['', 'From the factory', 'From a wholesale seller'],
          rows: [
            ['What it is', 'the maker itself; goods are usually made to order', 'usually ready stock, from a seller at a wholesale market or on a wholesale marketplace'],
            ['When it suits', 'a large or repeat order; goods made to your specification or under your own brand', 'a first or mixed order; several products from different sellers in one order'],
            ['Minimum', 'the factory’s own minimum (MOQ); an order through us still totals at least 1 m³', 'the seller’s own minimum; an order through us still totals at least 1 m³'],
            ['What to keep in mind', 'production time, named in the factory’s offer, comes before the transit time', 'a seller who is not the maker usually charges more than the factory itself'],
          ],
          note: 'The route is agreed with you on the basis of the offers; the factory’s or the seller’s own minimum is set by that factory or seller, not by us.',
        },
      },
      {
        heading: 'Who works on wholesale purchases, and what does “HSK 6 level” mean?',
        body: [
          'GSR Logistics has employees who know Chinese at HSK 6 level; they have experience of purchasing in China and work on buying from factories and buying wholesale from sellers.',
          'HSK (Hanyu Shuiping Kaoshi) is China’s standardised test of Chinese for people whose first language is not Chinese; level 6 expects a vocabulary of 5,000 or more words.',
          'Our managers speak Uzbek, Russian and Chinese. You do not need to speak Chinese or to have a Chinese bank card or an Alipay account. Negotiations with the factory or the seller are handled by GSR Logistics; you decide on the offers and the sample.',
        ],
      },
      {
        heading: 'How does a wholesale purchase work, step by step?',
        body: [
          'A wholesale purchase runs in six steps: you decide at each step, and GSR Logistics prepares the offers and carries out the purchase.',
        ],
        steps: [
          { title: 'Request', text: 'You write to a manager on Telegram: a link, a photo or a description of the goods, the quantity and your requirements. If you have already found a factory or a seller, tell us which one.' },
          { title: 'Offers and negotiation', text: 'You receive offers with the price, the seller’s minimum and the production or dispatch time. We negotiate in Chinese ourselves, and our commission is shown as a separate line in the quote.' },
          { title: 'Sample', text: 'If you want to see a sample first, we order one before the batch is bought. The sample lands at the Yiwu warehouse, where we photograph, measure and film it; on request we fly it to Tashkent in roughly 5–10 days.' },
          { title: 'Contract and payment', text: 'For a factory order, a contract is signed with the specification, quality criteria, deadlines and payment schedule. You pay us in UZS — legal entities by bank transfer against an invoice — and we pay the factory or the seller in yuan.' },
          { title: 'Receiving at the Yiwu warehouse', text: 'We receive each parcel under your GS code (shipping mark). Standard receiving at the Yiwu warehouse is included in the freight price: parcel count, outer condition, weight and dimensions, an outside photo. An opened-box inspection and a detailed photo report are optional extras.' },
          { title: 'Consolidation, delivery to Tashkent and customs', text: 'The batch goes to Tashkent by consolidated truck (roughly 15–25 days) or air (5–10 days). Customs clearance under the company’s documents is included in the consolidated-cargo rate; duty and VAT are paid as the law requires. The Telegram bot @GSR_GROUP_AGENT_bot shows every carton’s status, stage by stage.' },
        ],
      },
      {
        heading: 'What does it cost, and how do you pay?',
        body: [
          'The price of a wholesale purchase has three main parts: the goods at the factory’s or the seller’s price, our commission and the freight to Tashkent. A sample, shipping inside China and the optional checks at the Yiwu warehouse are added where they apply; duty and VAT are paid as the law requires. The commission starts at 3% of the order value and is shown as a separate line in the quote.',
          'You pay GSR Logistics in UZS; legal entities pay by bank transfer against an invoice. We pay the factory or the seller in yuan. The price of the goods and the commission are paid before the order is placed, and freight is paid when the cargo arrives in Tashkent. For a factory order, the contract with the factory sets the payment schedule: the usual payment pattern in China is 30% upfront and the balance before shipment, and we make that payment in yuan.',
        ],
        table: {
          head: ['Item', 'Price'],
          rows: [
            ['Commission', 'from 3% of the order value'],
            ['The goods', 'the factory’s or the seller’s price, in yuan'],
            ['Sample and shipping inside China', 'charged separately; shipping inside China at the seller’s rate'],
            ['Opened-box counting and inspection, optional', '$1/kg'],
            ['Detailed photo report (opened box), optional', '$1 per piece'],
            ['Freight to Tashkent', 'truck from $110 per m³, rate by cargo density; air from $9/kg'],
          ],
          note: 'Estimates · Updated September 8, 2026. The exact percentage is fixed in the contract.',
        },
      },
      {
        heading: 'Which of our three buying services do you need?',
        body: [
          'GSR Logistics buys goods in China through three services (equipment and cars have services of their own), and the right one depends on what you start with: a product whose maker you do not know, a marketplace link, or a wholesale batch to buy.',
        ],
        table: {
          head: ['Your situation', 'The service'],
          rows: [
            ['You know the product but not who makes it', 'Product & supplier sourcing'],
            ['You have a product link from 1688, Taobao, Pinduoduo or Alibaba', 'Buying from 1688 & Taobao'],
            ['You want a wholesale batch bought — from a factory or a wholesale seller, one you found or one we find — and brought to Tashkent', 'Wholesale buying in China'],
          ],
          note: 'Whichever service you choose, you work with one manager under one contract; the commission starts at 3% of the order value on each (estimate, September 8, 2026).',
        },
      },
    ],
    faq: [
      {
        q: 'Where do I start if I want to buy goods wholesale from China?',
        a: 'Start with a message to a GSR Logistics manager on Telegram: a link, a photo or a description of the goods, the quantity and your requirements. You receive offers with the price, the seller’s minimum and our commission as a separate line.',
      },
      {
        q: 'Do I have to travel to China or hire an interpreter?',
        a: 'No. GSR Logistics searches for the goods, negotiates in Chinese, pays the seller, receives the goods and ships them for you. We have employees who know Chinese at HSK 6 level. You decide on the offers and on the sample.',
      },
      {
        q: 'Can I buy wholesale from China myself, without an agent?',
        a: 'Yes, if you can do four things yourself: negotiate with the seller in Chinese, pay the seller in yuan, have someone receive and check the goods in China, and arrange freight and customs clearance. GSR Logistics does these four things as your buying agent. The commission is named in advance and shown as a separate line in the quote; freight to Tashkent is charged separately.',
      },
      {
        q: 'Do you buy directly from factories?',
        a: 'Yes. Buying from factories is one of the two routes of wholesale buying at GSR Logistics: the order is placed with the factory that makes the goods. Before a factory order we check the factory’s business licence, production capacity and export record; then a contract is signed with the specification, quality criteria, deadlines and payment schedule.',
      },
      {
        q: 'Do you also buy from wholesale markets and from wholesale sellers on 1688?',
        a: 'Yes. Buying wholesale from sellers is the second of the two routes of wholesale buying: GSR Logistics buys from wholesale sellers on 1688 and from sellers at wholesale markets such as the Futian market in Yiwu. Goods from several sellers are gathered at the Yiwu receiving point under one GS code (shipping mark) and counted together towards the 1 m³ minimum.',
      },
      {
        q: 'What does “Chinese at HSK 6 level” mean?',
        a: 'HSK (Hanyu Shuiping Kaoshi) is China’s standardised test of Chinese for people whose first language is not Chinese; level 6 expects a vocabulary of 5,000 or more words. GSR Logistics has employees who know Chinese at HSK 6 level; they have experience of purchasing in China and work on buying from factories and buying wholesale from sellers.',
      },
      {
        q: 'How much does wholesale buying in China cost?',
        a: 'The commission for wholesale buying at GSR Logistics starts at 3% of the order value (estimate, September 8, 2026) and is shown as a separate line in the quote. The exact percentage is fixed in the contract. Samples, shipping inside China and freight to Tashkent are charged separately.',
      },
      {
        q: 'What is the smallest order?',
        a: 'An order through GSR Logistics, from any source, must total at least 1 m³. Goods from different sellers are gathered under one GS code (shipping mark) and counted together. The factory’s or the seller’s own minimum (MOQ) is set by that factory or seller, not by GSR Logistics. We do not take single items or small orders.',
      },
      {
        q: 'How do I pay, and who pays the seller?',
        a: 'You pay GSR Logistics in UZS; legal entities pay by bank transfer against an invoice. GSR Logistics pays the factory or the seller in yuan. You need no Chinese bank card and no Alipay account.',
      },
      {
        q: 'Which goods do you buy wholesale, and which do you not?',
        a: 'GSR Logistics buys any kind of goods a client wants to buy wholesale from China — for example clothing, footwear, phone accessories, spare parts, furniture, household goods and toys — except counterfeit goods and goods on the prohibited list. The prohibited list includes explosive and flammable substances; plants, animals and perishable goods; money, precious metals and stones. Liquids, perfume, aerosols, magnets and goods with lithium batteries travel by truck, not by air.',
      },
      {
        q: 'How many days does a wholesale batch take to reach Tashkent?',
        a: 'A wholesale batch bought through GSR Logistics takes roughly 15–25 days from the Yiwu warehouse to Tashkent by consolidated truck, or 5–10 days by air (estimates updated September 8, 2026). A factory’s production time is separate and is named in the factory’s offer.',
      },
      {
        q: 'Do you buy for traders in Afghanistan too?',
        a: 'Yes. Our sourcing and buying service in China is open to Afghan businesspeople too: we find the goods, buy them and deliver them by truck to Hairatan or Mazar-i-Sharif. The manager states the terms before the order.',
      },
    ],
    related: ['sourcing', 'buying', 'truck'],
    guideKeys: ['find-supplier', 'yiwu-guangzhou', 'order-from-1688', 'prohibited-goods'],
    cta: {
      title: 'Name the goods and the quantity. We send the offers.',
      text: 'Send a link, a photo or a description of the goods, the quantity and your requirements — and the factory or the seller, if you have already found one. Your manager replies with offers and shows our commission as a separate line.',
      draft: 'Hello! I want to buy goods wholesale from China. Goods: … Quantity: … From (factory / wholesale seller / not sure): … Requirements: …',
    },
    updated: '2026-11-18',
  },
};

export default content;
