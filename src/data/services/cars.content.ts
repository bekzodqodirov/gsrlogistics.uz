import type { ServiceContentByLang } from './types';

/**
 * Xitoydan avtomobil va elektromobil (buyurtma asosida) — long-form page content.
 * No prices, no stock claims, no 2023 model offers (stale). Brands (BYD, Zeekr, Li Auto / Lixiang, Leapmotor)
 * are examples only. Timeline "taxminan 25–45 kun" is a working estimate the OWNER MUST CONFIRM
 * (their 2023 posts said 10–25 days for in-stock cars). Duty / excise / utilisation fee for cars depend on
 * engine volume, battery, age and change often — the page says "hisoblab beramiz", never a rate.
 */
const content: ServiceContentByLang = {
  uz: {
    key: 'cars',
    seo: {
      title: 'Xitoydan avtomobil va elektromobil buyurtma asosida — BYD, Zeekr, Li Auto, Leapmotor',
      description:
        'Xitoydan avtomobil va elektromobilni buyurtma asosida olib kelamiz: model tanlash, shartnoma, Xitoyda xarid, Xorgos orqali yetkazish, bojxona, utilizatsiya yigʻimi va roʻyxatdan oʻtkazish. Taxminan 25–45 kun. Toʻlovlarni oldindan hisoblab beramiz.',
    },
    hero: {
      eyebrow: 'Xizmat 09 — Avtomobil',
      h1: 'Xitoydan avtomobil va elektromobil buyurtma asosida',
      intro:
        'Xitoydan avtomobil olib kelish — bu tanlangan modelni Xitoydagi dilerdan yoki zavoddan sotib olib, Xorgos orqali Toshkentga yetkazish, bojxonada rasmiylashtirish va roʻyxatdan oʻtkazish. BYD, Zeekr, Li Auto (Lixiang), Leapmotor va boshqa brendlarning yangi hamda kam yurgan avtomobillarini buyurtma asosida keltiramiz. Shartnomadan kalitni topshirishgacha taxminan 25–45 kun. Boj, aksiz, QQS va utilizatsiya yigʻimi dvigatel hajmi va batareyaga bogʻliq — aniq summani buyurtmadan oldin hisoblab beramiz.',
      facts: [
        { label: 'Muddat, shartnomadan kalitgacha', value: '25–45 kun' },
        { label: 'Brendlar, masalan', value: 'BYD · Zeekr · Li Auto' },
        { label: 'Ishlash tartibi', value: 'Buyurtma asosida' },
        { label: 'Bojxona va utilizatsiya', value: 'Oldindan hisoblaymiz' },
      ],
    },
    sections: [
      {
        heading: 'Qaysi avtomobillarni olib kelamiz?',
        body: [
          'Xitoy avtomobil bozori 2020-yillarda dunyodagi eng katta va eng tez oʻzgaruvchan bozorga aylandi: elektromobil, gibrid (PHEV, EREV) va benzinli modellar har yili yangilanadi. Biz ombor saqlamaymiz va tayyor avtomobil sotmaymiz — har bir avtomobil sizning buyurtmangiz boʻyicha, siz tanlagan model, komplektatsiya va rangda sotib olinadi.',
          'Koʻp soʻraladigan brendlar: BYD (Song, Seal, Tang, Han), Zeekr (001, 7X, 009), Li Auto — Lixiang (L6, L7, L9), Leapmotor (C10, C11, C16), shuningdek Xiaomi, Geely, Chery, Changan, Haval. Buyurtma yangi avtomobilga ham, dilerning kam yurgan (probegli) avtomobiliga ham berilishi mumkin — ikkinchisida yurgan masofa va holat foto-hisobotda koʻrsatiladi.',
        ],
        bullets: [
          'Elektromobil (BEV): shahar va shahar atrofi uchun, zaryadlash imkoniyati bor mijozlarga.',
          'Gibrid (PHEV/EREV): uzoq yoʻl va viloyatlar uchun — Li Auto va BYD DM-i seriyalari.',
          'Benzinli krossover va sedanlar: Geely, Chery, Changan, Haval — ehtiyot qismlari Oʻzbekistonda topiladi.',
          'Tijorat transporti: yuk mikroavtobuslari va yengil yuk mashinalari — alohida hisoblanadi.',
        ],
      },
      {
        heading: 'Jarayon qanday boʻladi?',
        body: [
          'Avtomobil importi oddiy yukdan farq qiladi: har bir mashina VIN raqami bilan alohida rasmiylashtiriladi, bojxonada aksiz va utilizatsiya yigʻimi toʻlanadi, keyin roʻyxatdan oʻtkaziladi. Biz shu zanjirning har bir boʻgʻinini yuritamiz.',
        ],
        steps: [
          { title: 'Tanlash', text: 'Model, komplektatsiya, rang va byudjetni aytasiz. Biz Xitoydagi dilerlardan joriy narx va mavjudlikni soʻrab, 2–3 variantni foto va texnik maʼlumot bilan taqdim etamiz. Kam yurgan avtomobil boʻlsa — yurgan masofa, batareya holati va tekshiruv hisobotini olamiz.' },
          { title: 'Shartnoma', text: 'Avtomobilning aniq tavsifi, umumiy narx tarkibi (avtomobil, yetkazish, bojxona toʻlovlari, xizmat haqi), muddat va javobgarlik shartnomada yoziladi. Oldindan toʻlov ulushi va tartibi shartnomada belgilanadi.' },
          { title: 'Xarid Xitoyda', text: 'Xitoydagi xodimimiz avtomobilni dilerdan qabul qiladi, VIN va komplektatsiyani tekshiradi, foto-hisobot yuboradi. Eksport hujjatlari — sotib olish shartnomasi, invoys, Xitoy eksport deklaratsiyasi va muvofiqlik sertifikati — rasmiylashtiriladi.' },
          { title: 'Yuk tashish', text: 'Avtomobil avtovoz yoki konteynerda Urumchi va Xorgos orqali Qozogʻiston boʻylab Toshkentga keladi. Yoʻlda menejer joylashuv haqida xabar berib boradi. Yoʻl taxminan 10–20 kun.' },
          { title: 'Bojxona', text: 'Toshkentda avtomobil sizning nomingizga deklaratsiya qilinadi: boj, aksiz, QQS va utilizatsiya yigʻimi toʻlanadi. Summalar dvigatel hajmi, batareya quvvati va ishlab chiqarilgan yiliga bogʻliq — biz ularni shartnomadan oldin hisoblab, keyin faqat rasmiy kvitansiya boʻyicha toʻlaymiz.' },
          { title: 'Roʻyxatdan oʻtkazish va topshirish', text: 'Texnik pasport va davlat raqamini olishda hamrohlik qilamiz. Avtomobilni Toshkentda hujjatlar toʻplami bilan topshiramiz: shartnoma, GTD, toʻlov kvitansiyalari, texnik pasport.' },
        ],
        callout: {
          title: 'Muddat haqida',
          text: 'Taxminan 25–45 kun — bu diler omborida tayyor turgan avtomobil uchun oʻrtacha muddat: xarid va eksport hujjatlari 5–10 kun, yoʻl 10–20 kun, bojxona va roʻyxat 5–10 kun. Zavodga buyurtma qilinadigan komplektatsiya, Xitoy bayramlari (yanvar–fevral, oktabr boshi) va chegaradagi navbat muddatni uzaytirishi mumkin.',
          tone: 'info',
        },
      },
      {
        heading: 'Bojxona toʻlovlari qanday hisoblanadi?',
        body: [
          'Avtomobil uchun toʻrt xil toʻlov bor: bojxona boji, aksiz, QQS (12 %) va utilizatsiya yigʻimi. Ularning har biri avtomobil turiga bogʻliq: benzinli mashinada dvigatel hajmi va yoshi, elektromobilda batareya quvvati va motor kuchi hisobga olinadi. Elektromobillar uchun imtiyozlar bor, lekin ular muddatli va vaqti-vaqti bilan oʻzgaradi — shuning uchun biz bu sahifada stavka yozmaymiz.',
          'Buyurtmadan oldin siz tanlagan aniq model uchun barcha toʻlovlarni joriy qonunchilik boʻyicha hisoblab, shartnomaga kiritamiz. Toʻlovlar rasmiy kvitansiya boʻyicha, sizning nomingizga toʻlanadi — avtomobil sizning mulkingiz sifatida roʻyxatdan oʻtadi.',
        ],
        table: {
          caption: 'Avtomobil importida nimadan nima bogʻliq',
          head: ['Toʻlov', 'Nimaga bogʻliq', 'Kim toʻlaydi'],
          rows: [
            ['Bojxona boji', 'avtomobil turi, dvigatel hajmi, yoshi', 'siz, rasmiy kvitansiya boʻyicha'],
            ['Aksiz', 'dvigatel hajmi yoki motor quvvati', 'siz, rasmiy kvitansiya boʻyicha'],
            ['QQS', '12 % — bojxona qiymati + boj + aksiz summasidan', 'siz, rasmiy kvitansiya boʻyicha'],
            ['Utilizatsiya yigʻimi', 'avtomobil turi, dvigatel hajmi, yoshi', 'siz, rasmiy kvitansiya boʻyicha'],
            ['Rasmiylashtiruv yigʻimi', 'bojxona qiymati, BRVda', 'siz, rasmiy kvitansiya boʻyicha'],
            ['Yetkazish va xizmat haqi', 'shartnoma boʻyicha', 'narx tarkibida'],
          ],
          note: 'Stavkalar tez-tez oʻzgaradi va ushbu sahifada koʻrsatilmaydi. Aniq summani buyurtmadan oldin, siz tanlagan model uchun hisoblab beramiz. Yangilangan: 2026-yil 8-sentabr.',
        },
      },
      {
        heading: 'Narx tarkibiga nimalar kiradi?',
        body: ['Shartnomada narx toʻrt qismga ajratib yoziladi — shunda siz nima uchun toʻlayotganingizni koʻrasiz:'],
        bullets: [
          'Avtomobil narxi — Xitoy dileridagi haqiqiy narx, invoys bilan tasdiqlanadi',
          'Xitoy ichidagi xarajatlar: dilerdan olib chiqish, eksport hujjatlari, Xorgosgacha yetkazish',
          'Chegaradan Toshkentgacha yetkazish: avtovoz yoki konteyner, Xorgos → Toshkent, sugʻurta',
          'Oʻzbekistondagi toʻlovlar: boj, aksiz, QQS, utilizatsiya yigʻimi, roʻyxatdan oʻtkazish — rasmiy kvitansiyalar boʻyicha',
          'GSR xizmat haqi — alohida qator, foizda yoki qatʼiy summada',
        ],
        callout: {
          title: 'Menejer maslahati',
          text: 'Xitoy elektromobillarining koʻpi GB/T zaryadlash porti bilan chiqadi; Oʻzbekistondagi stansiyalarda GB/T ham, CCS2 ham uchraydi — port turini va adapter kerakligini tanlashda aytamiz. Mediatizim tili koʻp modellarda faqat xitoy yoki ingliz tilida boʻladi; Xitoy dilerining servis majburiyatlari Oʻzbekistonda avtomatik amal qilmaydi — servis va ehtiyot qismlar masalasini oldindan muhokama qilamiz.',
          tone: 'success',
        },
      },
      {
        heading: 'Qanday hujjatlar bilan topshiramiz?',
        body: ['Avtomobil Toshkentda quyidagi hujjatlar bilan sizga topshiriladi:'],
        bullets: [
          'GSR bilan tuzilgan xizmat shartnomasi va yakuniy hisob-kitob',
          'Xitoydagi sotib olish shartnomasi va invoys',
          'Xitoy eksport deklaratsiyasi va muvofiqlik sertifikati (ishlab chiqaruvchi maʼlumoti)',
          'Yuk deklaratsiyasi (GTD) sizning nomingizga',
          'Boj, aksiz, QQS va utilizatsiya yigʻimi toʻlangani haqida kvitansiyalar',
          'Texnik pasport va davlat raqami (roʻyxatdan oʻtgach)',
          'Zaryadlash kabeli, ikkita kalit va foydalanuvchi qoʻllanmasi — komplektatsiyaga qarab',
        ],
      },
    ],
    faq: [
      { q: 'Xitoydan avtomobil olib kelish necha kun?', a: 'Diler omborida tayyor avtomobil uchun shartnomadan kalitgacha taxminan 25–45 kun: xarid va eksport 5–10 kun, yoʻl 10–20 kun, bojxona va roʻyxat 5–10 kun. Zavodga buyurtma qilinadigan komplektatsiya va Xitoy bayramlari muddatni uzaytiradi.' },
      { q: 'Elektromobil uchun boj va utilizatsiya yigʻimi qancha?', a: 'Summalar batareya quvvati, motor kuchi va avtomobil yoshiga bogʻliq, imtiyozlar muddatli va oʻzgarib turadi — shuning uchun sahifada stavka yozmaymiz. Siz tanlagan model uchun barcha toʻlovlarni buyurtmadan oldin hisoblab, shartnomaga kiritamiz.' },
      { q: 'Tayyor avtomobillaringiz bormi?', a: 'Yoʻq, biz ombor saqlamaymiz — har bir avtomobil buyurtma asosida, siz tanlagan model, komplektatsiya va rangda sotib olinadi. Shu tufayli siz dilerning haqiqiy narxini invoys bilan koʻrasiz.' },
      { q: 'Kam yurgan (probegli) avtomobil buyurtsam boʻladimi?', a: 'Ha. Xitoyda dilerlar 1–3 yillik kam yurgan avtomobillarni sotadi. Sotib olishdan oldin yurgan masofa, batareya holati va kuzov tekshiruvi hisobotini foto bilan yuboramiz; avtomobil yoshi bojxona toʻlovlariga taʼsir qiladi — buni hisobda koʻrsatamiz.' },
      { q: 'Avtomobil kimning nomiga rasmiylashtiriladi?', a: 'Sizning nomingizga: GTD, toʻlov kvitansiyalari va texnik pasport sizga tegishli boʻladi. GSR sotib olish, yetkazish va rasmiylashtiruvni shartnoma boʻyicha yuritadi.' },
      { q: 'Toʻlov qanday tartibda boʻladi?', a: 'Shartnomada belgilanadi: avtomobil narxi va Xitoydagi xarajatlar xariddan oldin, bojxona toʻlovlari avtomobil Toshkentga kelganda rasmiy kvitansiya boʻyicha, xizmat haqi topshirishda. Aniq ulushlar shartnomada yoziladi.' },
      { q: 'Xitoy elektromobilini Oʻzbekistonda zaryadlash mumkinmi?', a: 'Ha. Xitoy modellarining koʻpi GB/T porti bilan chiqadi; Oʻzbekistondagi zaryadlash stansiyalarida GB/T keng tarqalgan, CCS2 uchun adapter kerak boʻlishi mumkin. Uy zaryadlovchisi (7 kVt) koʻp modellarga komplektda keladi — tanlashda tekshirib beramiz.' },
      { q: 'Servis va ehtiyot qismlar bilan nima boʻladi?', a: 'Xitoy dilerining servis majburiyatlari Oʻzbekistonda avtomatik amal qilmaydi. Baʼzi brendlarning Toshkentda rasmiy yoki mustaqil servislari bor, ehtiyot qismlarni Xitoydan yigʻma yuk bilan olib kelamiz. Modelni tanlashda servis holatini oldindan aytamiz.' },
    ],
    related: ['customs', 'truck', 'rail'],
    guideKeys: ['customs-2026', 'routes', 'shipping-from-china'],
    cta: {
      title: 'Modelni ayting — hisobni beramiz.',
      text: 'Brend, model va komplektatsiyani yozing: Xitoydagi joriy narx, yetkazish va barcha bojxona toʻlovlarini bitta jadvalda hisoblab beramiz.',
      draft: 'Assalomu alaykum! Xitoydan avtomobil buyurtma qilmoqchiman. Brend va model: … Komplektatsiya: … Yangi / kam yurgan: … Byudjet: … $',
    },
    updated: '2026-09-08',
  },

  ru: {
    key: 'cars',
    seo: {
      title: 'Авто и электромобили из Китая под заказ — BYD, Zeekr, Li Auto, Leapmotor',
      description:
        'Привозим автомобили и электромобили из Китая под заказ: выбор модели, договор, выкуп в Китае, доставка через Хоргос, растаможка, утилизационный сбор и постановка на учёт. Ориентировочно 25–45 дней. Платежи считаем заранее.',
    },
    hero: {
      eyebrow: 'Услуга 09 — Автомобили',
      h1: 'Автомобили и электромобили из Китая под заказ',
      intro:
        'Ввоз автомобиля из Китая — это выкуп выбранной модели у дилера или завода, доставка через Хоргос в Ташкент, таможенное оформление и постановка на учёт. Под заказ привозим новые и малопробежные автомобили BYD, Zeekr, Li Auto (Lixiang), Leapmotor и других марок. От договора до ключей — ориентировочно 25–45 дней. Пошлина, акциз, НДС и утилизационный сбор зависят от объёма двигателя и батареи — точную сумму считаем до заказа.',
      facts: [
        { label: 'Срок, от договора до ключей', value: '25–45 дней' },
        { label: 'Марки, например', value: 'BYD · Zeekr · Li Auto' },
        { label: 'Формат работы', value: 'Под заказ' },
        { label: 'Таможня и утильсбор', value: 'Считаем заранее' },
      ],
    },
    sections: [
      {
        heading: 'Какие автомобили привозим?',
        body: [
          'Китайский авторынок в 2020-е годы стал крупнейшим и самым быстро меняющимся в мире: электромобили, гибриды (PHEV, EREV) и бензиновые модели обновляются каждый год. Мы не держим склад и не продаём готовые машины — каждый автомобиль выкупается по вашему заказу, в выбранных вами модели, комплектации и цвете.',
          'Чаще всего спрашивают BYD (Song, Seal, Tang, Han), Zeekr (001, 7X, 009), Li Auto — Lixiang (L6, L7, L9), Leapmotor (C10, C11, C16), а также Xiaomi, Geely, Chery, Changan, Haval. Заказать можно как новый автомобиль, так и малопробежный из дилерского парка — во втором случае пробег и состояние показываем в фотоотчёте.',
        ],
        bullets: [
          'Электромобили (BEV): для города и пригорода, клиентам с возможностью зарядки.',
          'Гибриды (PHEV/EREV): для дальних поездок и регионов — серии Li Auto и BYD DM-i.',
          'Бензиновые кроссоверы и седаны: Geely, Chery, Changan, Haval — запчасти есть в Узбекистане.',
          'Коммерческий транспорт: грузовые микроавтобусы и лёгкие грузовики — считаем отдельно.',
        ],
      },
      {
        heading: 'Как проходит заказ?',
        body: [
          'Импорт автомобиля отличается от обычного груза: каждая машина оформляется отдельно по VIN, на таможне платятся акциз и утилизационный сбор, затем машина ставится на учёт. Мы ведём каждое звено этой цепочки.',
        ],
        steps: [
          { title: 'Выбор', text: 'Вы называете модель, комплектацию, цвет и бюджет. Мы запрашиваем у китайских дилеров текущую цену и наличие и предлагаем 2–3 варианта с фото и техническими данными. Для малопробежной машины получаем пробег, состояние батареи и отчёт об осмотре.' },
          { title: 'Договор', text: 'В договоре прописываются точное описание автомобиля, состав цены (машина, доставка, таможенные платежи, вознаграждение), срок и ответственность. Доля и порядок предоплаты закрепляются в договоре.' },
          { title: 'Выкуп в Китае', text: 'Наш сотрудник в Китае принимает автомобиль у дилера, сверяет VIN и комплектацию, присылает фотоотчёт. Оформляются экспортные документы: договор купли-продажи, инвойс, китайская экспортная декларация и сертификат соответствия.' },
          { title: 'Доставка', text: 'Автомобиль едет автовозом или в контейнере через Урумчи и Хоргос, далее по Казахстану в Ташкент. Менеджер сообщает о местоположении в пути. Дорога — ориентировочно 10–20 дней.' },
          { title: 'Таможня', text: 'В Ташкенте автомобиль декларируется на ваше имя: платятся пошлина, акциз, НДС и утилизационный сбор. Суммы зависят от объёма двигателя, ёмкости батареи и года выпуска — мы считаем их до договора, а платим строго по официальным квитанциям.' },
          { title: 'Учёт и передача', text: 'Сопровождаем получение техпаспорта и госномера. Передаём автомобиль в Ташкенте с пакетом документов: договор, ГТД, квитанции об оплате, техпаспорт.' },
        ],
        callout: {
          title: 'О сроках',
          text: 'Ориентировочно 25–45 дней — средний срок для автомобиля, который есть на складе дилера: выкуп и экспортные документы 5–10 дней, дорога 10–20 дней, таможня и учёт 5–10 дней. Комплектация под заказ на заводе, китайские праздники (январь–февраль, начало октября) и очередь на границе могут увеличить срок.',
          tone: 'info',
        },
      },
      {
        heading: 'Как считаются таможенные платежи?',
        body: [
          'На автомобиль приходится четыре платежа: таможенная пошлина, акциз, НДС (12 %) и утилизационный сбор. Каждый зависит от типа машины: для бензиновой учитываются объём двигателя и возраст, для электромобиля — ёмкость батареи и мощность мотора. Для электромобилей действуют льготы, но они срочные и периодически меняются — поэтому на этой странице мы не пишем ставки.',
          'До заказа мы рассчитываем все платежи для выбранной вами модели по действующему законодательству и вносим их в договор. Платежи вносятся по официальным квитанциям на ваше имя — автомобиль регистрируется как ваша собственность.',
        ],
        table: {
          caption: 'От чего зависят платежи при ввозе автомобиля',
          head: ['Платёж', 'От чего зависит', 'Кто платит'],
          rows: [
            ['Таможенная пошлина', 'тип автомобиля, объём двигателя, возраст', 'вы, по официальной квитанции'],
            ['Акциз', 'объём двигателя или мощность мотора', 'вы, по официальной квитанции'],
            ['НДС', '12 % от суммы таможенной стоимости, пошлины и акциза', 'вы, по официальной квитанции'],
            ['Утилизационный сбор', 'тип автомобиля, объём двигателя, возраст', 'вы, по официальной квитанции'],
            ['Сбор за оформление', 'таможенная стоимость, в БРВ', 'вы, по официальной квитанции'],
            ['Доставка и вознаграждение', 'по договору', 'в составе цены'],
          ],
          note: 'Ставки часто меняются и на этой странице не приводятся. Точную сумму для выбранной модели считаем до заказа. Обновлено: 8 сентября 2026 г.',
        },
      },
      {
        heading: 'Из чего складывается цена?',
        body: ['В договоре цена разбита на четыре части — так вы видите, за что платите:'],
        bullets: [
          'Цена автомобиля — реальная цена у китайского дилера, подтверждённая инвойсом',
          'Расходы в Китае: выкуп у дилера, экспортные документы, доставка до Хоргоса',
          'Международная доставка: автовоз или контейнер, Хоргос → Ташкент, страховка',
          'Платежи в Узбекистане: пошлина, акциз, НДС, утилизационный сбор, постановка на учёт — по официальным квитанциям',
          'Вознаграждение GSR — отдельной строкой, в процентах или фиксированной суммой',
        ],
        callout: {
          title: 'Совет менеджера',
          text: 'Большинство китайских электромобилей выпускаются с зарядным портом GB/T; на станциях в Узбекистане встречаются и GB/T, и CCS2 — при выборе скажем, какой порт у модели и нужен ли адаптер. Мультимедиа во многих моделях только на китайском или английском; сервисные обязательства китайского дилера в Узбекистане автоматически не действуют — вопрос сервиса и запчастей обсуждаем заранее.',
          tone: 'success',
        },
      },
      {
        heading: 'С какими документами передаём автомобиль?',
        body: ['В Ташкенте автомобиль передаётся вам со следующими документами:'],
        bullets: [
          'Договор с GSR и итоговый расчёт',
          'Договор купли-продажи в Китае и инвойс',
          'Китайская экспортная декларация и сертификат соответствия (данные производителя)',
          'Грузовая таможенная декларация (ГТД) на ваше имя',
          'Квитанции об оплате пошлины, акциза, НДС и утилизационного сбора',
          'Техпаспорт и госномер (после постановки на учёт)',
          'Зарядный кабель, два ключа и руководство пользователя — в зависимости от комплектации',
        ],
      },
    ],
    faq: [
      { q: 'Сколько дней занимает ввоз автомобиля из Китая?', a: 'Для машины со склада дилера — ориентировочно 25–45 дней от договора до ключей: выкуп и экспорт 5–10 дней, дорога 10–20 дней, таможня и учёт 5–10 дней. Комплектация под заказ на заводе и китайские праздники удлиняют срок.' },
      { q: 'Какая пошлина и утильсбор на электромобиль?', a: 'Суммы зависят от ёмкости батареи, мощности мотора и возраста автомобиля, льготы срочные и меняются — поэтому на странице ставок нет. Все платежи для выбранной модели считаем до заказа и вносим в договор.' },
      { q: 'Есть ли автомобили в наличии?', a: 'Нет, склад мы не держим — каждый автомобиль выкупается под заказ в выбранных вами модели, комплектации и цвете. Благодаря этому вы видите реальную дилерскую цену по инвойсу.' },
      { q: 'Можно заказать малопробежный автомобиль?', a: 'Да. Китайские дилеры продают машины с пробегом 1–3 лет. До выкупа присылаем пробег, состояние батареи и отчёт об осмотре кузова с фото; возраст автомобиля влияет на таможенные платежи — это отражаем в расчёте.' },
      { q: 'На чьё имя оформляется автомобиль?', a: 'На ваше: ГТД, платёжные квитанции и техпаспорт принадлежат вам. GSR ведёт выкуп, доставку и оформление по договору.' },
      { q: 'Как проходит оплата?', a: 'Порядок закрепляется в договоре: цена автомобиля и расходы в Китае — до выкупа, таможенные платежи — по официальным квитанциям после прибытия машины в Ташкент, вознаграждение — при передаче. Точные доли прописываются в договоре.' },
      { q: 'Можно ли заряжать китайский электромобиль в Узбекистане?', a: 'Да. Большинство китайских моделей выпускаются с портом GB/T; на станциях в Узбекистане GB/T распространён, для CCS2 может понадобиться адаптер. Домашнее зарядное устройство (7 кВт) у многих моделей идёт в комплекте — проверим при выборе.' },
      { q: 'Как быть с сервисом и запчастями?', a: 'Сервисные обязательства китайского дилера в Узбекистане автоматически не действуют. У ряда марок в Ташкенте есть официальные или независимые сервисы, запчасти привозим из Китая сборным грузом. При выборе модели заранее говорим о состоянии сервиса.' },
    ],
    related: ['customs', 'truck', 'rail'],
    guideKeys: ['customs-2026', 'routes', 'shipping-from-china'],
    cta: {
      title: 'Назовите модель — дадим расчёт.',
      text: 'Напишите марку, модель и комплектацию: посчитаем текущую цену в Китае, доставку и все таможенные платежи в одной таблице.',
      draft: 'Здравствуйте! Хочу заказать автомобиль из Китая. Марка и модель: … Комплектация: … Новый / с пробегом: … Бюджет: … $',
    },
    updated: '2026-09-08',
  },

  en: {
    key: 'cars',
    seo: {
      title: 'Cars and EVs from China to Uzbekistan, made to order — BYD, Zeekr, Li Auto, Leapmotor',
      description:
        'We import cars and electric vehicles from China to order: model selection, contract, purchase in China, delivery via Khorgos, customs clearance, recycling fee and registration. Roughly 25–45 days. Payments calculated in advance.',
    },
    hero: {
      eyebrow: 'Service 09 — Cars',
      h1: 'Cars and electric vehicles from China, made to order',
      intro:
        'Importing a car from China means buying the chosen model from a dealer or factory, shipping it via Khorgos to Tashkent, clearing customs and registering it. We bring in new and low-mileage cars from BYD, Zeekr, Li Auto (Lixiang), Leapmotor and other brands, strictly to order. From contract to keys takes roughly 25–45 days. Duty, excise, VAT and the recycling fee depend on engine size and battery — we calculate the exact amount before you order.',
      facts: [
        { label: 'Time, contract to keys', value: '25–45 days' },
        { label: 'Brands, for example', value: 'BYD · Zeekr · Li Auto' },
        { label: 'How we work', value: 'Made to order' },
        { label: 'Customs and recycling fee', value: 'Calculated upfront' },
      ],
    },
    sections: [
      {
        heading: 'Which cars do we import?',
        body: [
          'In the 2020s the Chinese car market became the largest and fastest-changing in the world: electric cars, hybrids (PHEV, EREV) and petrol models are refreshed every year. We keep no stock and sell no ready cars — every vehicle is bought to your order, in the model, trim and colour you choose.',
          'The most requested brands are BYD (Song, Seal, Tang, Han), Zeekr (001, 7X, 009), Li Auto — Lixiang (L6, L7, L9), Leapmotor (C10, C11, C16), as well as Xiaomi, Geely, Chery, Changan and Haval. You can order a new car or a low-mileage car from a dealer’s fleet — in the latter case the mileage and condition are shown in a photo report.',
        ],
        bullets: [
          'Electric cars (BEV): for city and suburban driving, for clients who can charge at home or work.',
          'Hybrids (PHEV/EREV): for long trips and the regions — the Li Auto and BYD DM-i ranges.',
          'Petrol crossovers and sedans: Geely, Chery, Changan, Haval — spare parts are available in Uzbekistan.',
          'Commercial vehicles: cargo vans and light trucks — priced separately.',
        ],
      },
      {
        heading: 'How does an order work?',
        body: [
          'Importing a car differs from ordinary freight: each vehicle is cleared individually by VIN, excise and a recycling fee are paid at customs, and the car is then registered. We handle every link in that chain.',
        ],
        steps: [
          { title: 'Selection', text: 'You name the model, trim, colour and budget. We ask Chinese dealers for current prices and availability and propose 2–3 options with photos and specifications. For a low-mileage car we obtain the mileage, battery health and an inspection report.' },
          { title: 'Contract', text: 'The contract sets out the exact description of the car, the price breakdown (vehicle, shipping, customs payments, our fee), the timeline and liability. The share and schedule of the advance payment are fixed in the contract.' },
          { title: 'Purchase in China', text: 'Our staff in China collect the car from the dealer, verify the VIN and trim and send a photo report. Export documents are prepared: the sale contract, invoice, Chinese export declaration and certificate of conformity.' },
          { title: 'Shipping', text: 'The car travels by car carrier or in a container via Urumqi and Khorgos, then across Kazakhstan to Tashkent. Your manager reports its location on the way. The journey takes roughly 10–20 days.' },
          { title: 'Customs', text: 'In Tashkent the car is declared in your name: duty, excise, VAT and the recycling fee are paid. The amounts depend on engine size, battery capacity and model year — we calculate them before the contract and pay strictly against official receipts.' },
          { title: 'Registration and handover', text: 'We accompany you through obtaining the registration certificate and plates. The car is handed over in Tashkent with its document set: contract, customs declaration, payment receipts, registration certificate.' },
        ],
        callout: {
          title: 'About the timeline',
          text: 'Roughly 25–45 days is the average for a car available at a dealer: purchase and export paperwork 5–10 days, the road 10–20 days, customs and registration 5–10 days. Factory-order trims, Chinese holidays (January–February, early October) and border queues can extend it.',
          tone: 'info',
        },
      },
      {
        heading: 'How are customs payments calculated?',
        body: [
          'A car attracts four payments: customs duty, excise, VAT (12%) and a recycling fee. Each depends on the type of vehicle: for a petrol car, engine size and age; for an electric car, battery capacity and motor power. Electric vehicles enjoy incentives, but they are time-limited and change periodically — which is why this page shows no rates.',
          'Before you order, we calculate every payment for your chosen model under current law and write it into the contract. Payments are made against official receipts in your name — the car is registered as your property.',
        ],
        table: {
          caption: 'What each payment depends on',
          head: ['Payment', 'Depends on', 'Who pays'],
          rows: [
            ['Customs duty', 'vehicle type, engine size, age', 'you, against an official receipt'],
            ['Excise', 'engine size or motor power', 'you, against an official receipt'],
            ['VAT', '12% of customs value + duty + excise', 'you, against an official receipt'],
            ['Recycling (utilisation) fee', 'vehicle type, engine size, age', 'you, against an official receipt'],
            ['Clearance fee', 'customs value, in BRV', 'you, against an official receipt'],
            ['Shipping and our fee', 'per the contract', 'part of the price'],
          ],
          note: 'Rates change often and are not listed on this page. We calculate the exact amount for your chosen model before you order. Updated September 8, 2026.',
        },
      },
      {
        heading: 'What makes up the price?',
        body: ['The contract splits the price into four parts, so you can see what you are paying for:'],
        bullets: [
          'The car — the real price at the Chinese dealer, confirmed by the invoice',
          'Costs in China: collection from the dealer, export documents, transport to Khorgos',
          'International shipping: car carrier or container, Khorgos → Tashkent, insurance',
          'Payments in Uzbekistan: duty, excise, VAT, recycling fee, registration — against official receipts',
          'GSR’s fee — a separate line, as a percentage or a fixed amount',
        ],
        callout: {
          title: 'Manager’s tip',
          text: 'Most Chinese electric cars ship with a GB/T charging port; charging stations in Uzbekistan use both GB/T and CCS2, so we tell you the port type and whether an adapter is needed when you choose. Infotainment in many models is Chinese- or English-only, and a Chinese dealer’s service obligations do not automatically apply in Uzbekistan — we discuss servicing and spare parts up front.',
          tone: 'success',
        },
      },
      {
        heading: 'Which documents come with the car?',
        body: ['The car is handed over in Tashkent with the following documents:'],
        bullets: [
          'The service contract with GSR and the final settlement',
          'The purchase contract in China and the invoice',
          'The Chinese export declaration and certificate of conformity (manufacturer data)',
          'The customs declaration (GTD) in your name',
          'Receipts for duty, excise, VAT and the recycling fee',
          'Registration certificate and plates (after registration)',
          'Charging cable, two keys and the owner’s manual — depending on the trim',
        ],
      },
    ],
    faq: [
      { q: 'How long does it take to import a car from China?', a: 'For a car available at a dealer, roughly 25–45 days from contract to keys: purchase and export 5–10 days, the road 10–20 days, customs and registration 5–10 days. Factory-order trims and Chinese holidays extend the timeline.' },
      { q: 'What are the duty and recycling fee on an electric car?', a: 'The amounts depend on battery capacity, motor power and the car’s age; incentives are time-limited and change, so this page lists no rates. We calculate every payment for your chosen model before you order and write it into the contract.' },
      { q: 'Do you have cars in stock?', a: 'No, we keep no stock — every car is bought to order in the model, trim and colour you choose. That way you see the real dealer price on the invoice.' },
      { q: 'Can I order a low-mileage used car?', a: 'Yes. Chinese dealers sell cars with 1–3 years of use. Before purchase we send the mileage, battery health and a body inspection report with photos; the car’s age affects customs payments, which we show in the calculation.' },
      { q: 'In whose name is the car registered?', a: 'Yours: the customs declaration, payment receipts and registration certificate belong to you. GSR handles the purchase, shipping and clearance under the contract.' },
      { q: 'How is payment structured?', a: 'It is fixed in the contract: the car price and costs in China before purchase, customs payments against official receipts once the car reaches Tashkent, and our fee at handover. The exact shares are written into the contract.' },
      { q: 'Can a Chinese EV be charged in Uzbekistan?', a: 'Yes. Most Chinese models come with a GB/T port; GB/T is widespread at charging stations in Uzbekistan, and an adapter may be needed for CCS2. A home charger (7 kW) is included with many models — we check this when you choose.' },
      { q: 'What about servicing and spare parts?', a: 'A Chinese dealer’s service obligations do not automatically apply in Uzbekistan. Some brands have official or independent workshops in Tashkent, and we bring spare parts from China as consolidated cargo. We tell you the servicing situation when you choose a model.' },
    ],
    related: ['customs', 'truck', 'rail'],
    guideKeys: ['customs-2026', 'routes', 'shipping-from-china'],
    cta: {
      title: 'Name the model — we will price it.',
      text: 'Send the brand, model and trim: we will work out the current price in China, shipping and every customs payment in one table.',
      draft: 'Hello! I would like to order a car from China. Brand and model: … Trim: … New / used: … Budget: $…',
    },
    updated: '2026-09-08',
  },
};

export default content;
