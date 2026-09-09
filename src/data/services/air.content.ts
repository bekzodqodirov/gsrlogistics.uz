import type { ServiceContentByLang } from './types';

/**
 * Avia kargo — long-form page content.
 * Figures mirror src/data/tariffs.json (updated 2026-09-08): air standard 9 / brand 12 / commercial 11,5 $/kg,
 * minimum 0,5 kg, ÷ 5 000 volumetric, 5–10 days; extras 1 $ photo, 0,4 $/kg repack, 1 $/kg inspection,
 * 1% insurance, 14/3 free storage days, door delivery 20 000–30 000 soʻm (free from 5 kg in Tashkent).
 * Truck figures quoted for comparison: 7,5 $/kg up to 30 kg, 15–25 days. Keep in sync when tariffs change.
 */
const content: ServiceContentByLang = {
  uz: {
    key: 'air',
    seo: {
      title: 'Xitoydan Toshkentga avia kargo — 1 kg narxi va muddati',
      description:
        'Xitoydan Toshkentga avia kargo: taxminan 5–10 kun, 9 $/kg dan, 0,5 kg dan qabul qilamiz. Ivu omborida qabul, konsolidatsiya, bojxona rasmiylashtiruvi va Toshkent omborigacha yetkazib berish narxga kiradi. Hajmiy vazn ÷ 5 000.',
    },
    hero: {
      eyebrow: 'Xizmat 02 — Avia kargo',
      h1: 'Xitoydan Toshkentga avia kargo',
      intro:
        'Avia kargo — bu shoshilinch, yengil va qimmat yuklarni Xitoydan samolyotda olib kelish. Yuk Xitoy omboridan joʻnatilgach, Toshkentga taxminan 5–10 kunda keladi. Narx kilogramm hisobida: oddiy tovar 9 $/kg dan, brend 12 $/kg, seriyali (tijorat) 11,5 $/kg; hajmiy vazn ÷ 5 000 bilan hisoblanadi. Minimal ogʻirlik — 0,5 kg. Ivu omborida qabul va bojxona rasmiylashtiruvi narxga kiradi.',
      facts: [
        { label: 'Muddat, Xitoy omboridan', value: '5–10 kun' },
        { label: 'Oddiy tovar', value: '9 $/kg dan' },
        { label: 'Minimal ogʻirlik', value: '0,5 kg' },
        { label: 'Hajmiy vazn qoidasi', value: '÷ 5 000' },
      ],
    },
    sections: [
      {
        heading: 'Avia kargo kimga toʻgʻri keladi?',
        body: [
          'Avia kargo — vaqt puldan qimmat boʻlgan holatlar uchun. Yigʻma yuk furada 15–25 kun yursa, samolyot bilan yuk 5–10 kunda keladi. Farq 2 hafta, narx farqi esa 1 kg uchun taxminan 1,5–2,5 $ — yengil va qimmat tovarda bu farq sezilmaydi, ogʻir va arzon tovarda esa avto kargo oʻzini oqlaydi.',
          'Odatda avia orqali quyidagilar yuboriladi:',
        ],
        bullets: [
          'Uzum, Yandex Market va Instagram sotuvchilarining namunalari va birinchi mayda partiyalari — 0,5–50 kg.',
          'Telefon aksessuarlari, gʻiloflar, mayda elektronika (batareyasiz), soatlar, koʻzoynaklar — 1 kg qimmat tovar.',
          'Brend kiyim va poyabzal, qutisi bilan — mavsum boshiga ulgurish kerak boʻlganda.',
          'Ishlab chiqarish uchun shoshilinch ehtiyot qismlar, uskunalarning mayda komponentlari.',
          'Ulgurji buyurtmadan oldin tekshirish uchun namunalar — 1–2 dona.',
        ],
        callout: {
          title: 'Misol: 20 kg telefon aksessuari',
          text: 'Avia: 20 kg × 9 $ = 180 $, taxminan 7 kun. Avto: 20 kg × 7,5 $ = 150 $, taxminan 20 kun. 30 $ farq uchun tovar 2 hafta oldin sotuvga chiqadi. 200 kg poyabzalda esa farq 300 $ dan oshadi — bunday yukni avto bilan yuborgan maʼqul.',
          tone: 'info',
        },
      },
      {
        heading: 'Avia kargo narxi qanday hisoblanadi?',
        body: [
          'Avia kargoda narx har doim kilogramm hisobida va tovar toifasiga bogʻliq: oddiy tovar, brend tovar (original, qutisi va yorligʻi bilan) yoki seriyali tovar — bir xil mahsulotdan 3 donadan koʻp, tijorat partiyasi. Elektronika va kosmetika ham seriyali tarif boʻyicha hisoblanadi.',
          'Hajmiy vazn qoidasi: uzunlik × en × balandlik (sm) ÷ 5 000. Samolyotda joy qimmat, shuning uchun boʻluvchi avtodagi 6000 emas, 5000. Haqiqiy va hajmiy vazndan kattasi hisobga olinadi. Qadoqni ixchamlash uchun Ivu omborida qayta qadoqlash xizmati bor — koʻpincha u oʻz narxini qoplaydi.',
        ],
        table: {
          caption: 'Avia kargo tariflari, Xitoy → Toshkent',
          head: ['Tovar toifasi', 'Nima kiradi', 'Taxminiy narx'],
          rows: [
            ['Oddiy tovar', 'kundalik tovarlar, aksessuarlar, kiyim (brendsiz), uy-roʻzgʻor mollari', '9 $/kg'],
            ['Seriyali / tijorat', 'bir xil mahsulotdan 3 donadan koʻp, batareyasiz elektronika, kosmetika (quruq)', '11,5 $/kg'],
            ['Brend tovar', 'original brend kiyim, poyabzal, sumka — qutisi va yorligʻi bilan', '12 $/kg'],
            ['Minimal ogʻirlik', 'bitta joʻnatma uchun', '0,5 kg'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. Narx har reys uchun aniqlanadi; yakuniy summa yuk Ivu omborida tortilgandan keyin maʼlum boʻladi.',
        },
        callout: {
          title: 'Misol: hajmiy vazn ÷ 5 000',
          text: '50 × 40 × 30 sm li quti — 60 000 sm³, ÷ 5 000 = 12 kg hajmiy vazn. Ichida 4 kg gʻilof boʻlsa ham, 12 kg uchun toʻlaysiz: 12 × 9 = 108 $. Qayta qadoqlab hajmni 40 × 30 × 25 sm ga tushirsak — 6 kg, yaʼni 54 $. Shuning uchun yengil tovarni zich qadoqlash muhim.',
          tone: 'info',
        },
      },
      {
        heading: 'Necha kunda keladi va qaysi yoʻldan?',
        body: [
          'Xitoy omboridan joʻnatilgan kundan Toshkentgacha taxminan 5–10 kun. Yuk Ivu omborida qabul qilinib, reysga qarab Guanchjou yoki Urumchi aeroportiga yuboriladi, u yerdan Toshkentga uchadi. Parvozning oʻzi bir necha soat; vaqtning asosiy qismi konsolidatsiya, eksport rasmiylashtiruvi va Toshkentdagi bojxonaga ketadi.',
        ],
        table: {
          caption: 'Avia yoʻlining bosqichlari',
          head: ['Bosqich', 'Nima boʻladi', 'Taxminiy vaqt'],
          rows: [
            ['Ivu ombori', 'qabul, tortish, oʻlchash, foto-hisobot, reysga jamlash', '1–3 kun'],
            ['Ivu → Guanchjou / Urumchi', 'aeroportga yetkazish, eksport rasmiylashtiruvi, xavfsizlik tekshiruvi', '1–2 kun'],
            ['Parvoz → Toshkent', 'reys va aeroportda qabul', '1–2 kun'],
            ['Toshkent aeroporti → ombor', 'import bojxona rasmiylashtiruvi, saralash', '1–3 kun'],
          ],
          note: 'Muddat Xitoy omboridan joʻnatilgan kundan hisoblanadi. Reyslar haftada bir necha marta; yuk eng yaqin reysga joylanadi.',
        },
        callout: {
          title: 'Mavsumiy kechikishlar',
          text: 'Xitoy Yangi yili (yanvar oxiri – fevral), 1–7-oktabr «Oltin hafta» va 11.11 dan keyingi haftalarda reyslar toʻlib ketadi va muddat 3–5 kunga choʻzilishi mumkin. Avia qabul avtodan kechroq — Yangi yildan taxminan 7–10 kun oldin — toʻxtaydi.',
          tone: 'warn',
        },
      },
      {
        heading: 'Jarayon qanday boʻladi?',
        body: [
          'Xitoy tilini bilish shart emas — Ivudagi xodimlarimiz sotuvchi bilan oʻzlari gaplashadi. Sizdan tovar haqida maʼlumot va reysni tanlash kerak, xolos.',
        ],
        steps: [
          { title: 'Soʻrov qoldirasiz', text: 'Telegram yoki telefon orqali tovar nomi, soni va taxminiy ogʻirligini aytasiz. Tovar toifasini (oddiy, seriyali, brend) va avia orqali yuborish mumkinligini shu yerda aniqlaymiz.' },
          { title: 'Ombor manzilini olasiz', text: 'Sizga Ivu omborining manzili va shaxsiy kodingiz beriladi. Sotuvchi yoki 1688/Taobao doʻkoni yukni shu manzilga joʻnatadi.' },
          { title: 'Yukni qabul qilamiz', text: 'Omborda har bir joyni tortamiz, oʻlchaymiz, kodingiz bilan markirovka qilamiz va foto-hisobot yuboramiz. Batareya, suyuqlik va magnit borligi tekshiriladi — bunday tovar avto kargoga oʻtkaziladi.' },
          { title: 'Reysga jamlash', text: 'Yuk eng yaqin reysga joylanadi va Guanchjou yoki Urumchi aeroportiga yoʻl oladi. Sizga reys raqami va yuk kodi beriladi; muddat hisobi shu kundan boshlanadi.' },
          { title: 'Parvoz va bojxona', text: 'Menejer yukning holatini xabar qilib boradi. Toshkentda rasmiylashtiruv kompaniya hujjatlari bilan oʻtadi.' },
          { title: 'Toshkentda qabul qilasiz', text: 'Yuk Toshkent omboriga keladi. Toʻlovni yakunlaysiz va yukni olib ketasiz yoki eshikkacha yetkazib beramiz; viloyatlarga joʻnatishni alohida kelishamiz.' },
        ],
      },
      {
        heading: 'Narxga nimalar kiradi va nimalar alohida toʻlanadi?',
        body: [
          'Kilogramm uchun koʻrsatilgan narx — Ivu omboridan Toshkent omborigacha boʻlgan toʻliq xizmat. Unga kiradi:',
        ],
        bullets: [
          'Ivu omborida qabul, tortish, oʻlchash va markirovka',
          'Reysga jamlash va aeroportgacha yetkazish',
          'Xitoydan chiqish va Oʻzbekistonga kirishdagi bojxona rasmiylashtiruvi kompaniya hujjatlari bilan',
          'Toshkent omborigacha yetkazib berish va 3 kungacha bepul saqlash',
          'Ivu omborida 14 kungacha bepul saqlash',
          'Yuk kodi boʻyicha holat xabarlari va menejer bilan aloqa',
        ],
        table: {
          caption: 'Qoʻshimcha xizmatlar',
          head: ['Xizmat', 'Taxminiy narx'],
          rows: [
            ['Foto-hisobot (qutini ochib suratga olish)', '1 $ / joy'],
            ['Qayta qadoqlash (hajmni kamaytirish)', '0,4 $/kg'],
            ['Tovarni tekshirish (soni, rangi, nuqsonlari)', '1 $/kg'],
            ['Sugʻurta', 'eʼlon qilingan qiymatning 1%'],
            ['Toshkentda eshikkacha yetkazib berish', '20 000–30 000 soʻm, 5 kg dan bepul'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. Oʻz firmangiz nomiga import qilsangiz, boj va 12% QQS TN VED kodi boʻyicha alohida hisoblanadi.',
        },
      },
      {
        heading: 'Avia orqali nimalarni yuborib boʻlmaydi?',
        body: [
          'Aviatsiya xavfsizlik qoidalari avtodagidan qattiqroq. Quyidagi tovarlar avia kargoga olinmaydi, lekin koʻpchiligini avto kargo orqali yuborish mumkin:',
        ],
        bullets: [
          'Litiy batareya va akkumulyatorlar: powerbank, batareyali telefon, noutbuk, elektr skuter va oʻyinchoqlar',
          'Magnitlar va kuchli magnitli buyumlar (dinamik, magnit ushlagichlar)',
          'Suyuqlik, aerozol, atir, suyuq kosmetika, boʻyoq va yelim',
          'Bosim ostidagi ballonlar, yonuvchi va portlovchi moddalar, zajigalka',
          'Dori-darmon, oziq-ovqat, urugʻ va oʻsimliklar',
          'Pul, qimmatbaho metall va toshlar, zargarlik va antiqa buyumlar',
          'Dronlar, ratsiya va ruxsatnoma talab qiladigan radiouskunalar, SIM-kartali smart-soatlar',
          'Kontrafakt brend mahsulotlar, qurol va uning qismlari, qonun bilan taqiqlangan boshqa narsalar',
        ],
        callout: {
          title: 'Batareyali tovar boʻlsa — avto kargo',
          text: 'Telefon, noutbuk, powerbank, elektr asboblar va batareyali oʻyinchoqlarni avto kargo bilan yuboramiz: 15–25 kun, 6,5–7,5 $/kg. Buyurtma berishdan oldin menejerga tovar tarkibini ayting — yuk omborda ushlanib qolmaydi.',
          tone: 'info',
        },
      },
      {
        heading: 'Qanday hujjatlar kerak?',
        body: [
          'Avia kargo kompaniya hujjatlari bilan rasmiylashtiriladi: sizdan bojxona uchun alohida hujjat talab qilinmaydi, lekin tovarning nomi, soni va qiymati toʻgʻri koʻrsatilishi shart. Brend tovar uchun sotuvchining invoysi va tovar haqiqiyligini tasdiqlovchi hujjat soʻralishi mumkin. Bojxona rasmiylashtiruvi — hujjatlar va deklaratsiya — tarifga kiritilgan; boj va QQS esa TN VED kodi boʻyicha alohida hisoblanadi. «Bojsiz» degan vaʼda bermaymiz.',
          'Tovarni oʻz firmangiz yoki YaTT nomiga rasmiy import qilmoqchi boʻlsangiz, ekspeditor va deklarant sifatida ishlaymiz. Bunda E-Contract tizimida roʻyxatdan oʻtgan shartnoma, invoys, qadoqlash roʻyxati, avia yuk xati (AWB), kelib chiqish sertifikati va har bir tovar uchun TN VED kodi kerak boʻladi.',
        ],
        callout: {
          title: 'Menejer maslahati',
          text: 'Sotuvchidan tovarni zich va kichik qutida joʻnatishni soʻrang: avia narxi hajmiy vazn ÷ 5 000 bilan hisoblanadi va boʻsh joy uchun ham toʻlaysiz. Namunani avia bilan, asosiy partiyani avto bilan yuborish — koʻp sotuvchilar uchun eng tejamli sxema.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'Xitoydan avia kargo 1 kg necha pul?',
        a: 'Taxminan 9 $/kg oddiy tovar uchun; seriyali (tijorat) tovar 11,5 $/kg, brend tovar 12 $/kg. Narxlar 2026-yil 8-sentabrda yangilangan va taxminiy — yakuniy summa yuk Ivu omborida tortilgandan keyin aniqlanadi.',
      },
      {
        q: 'Avia kargo necha kunda keladi?',
        a: 'Taxminan 5–10 kun — yuk Xitoy omboridan joʻnatilgan kundan Toshkent omborigacha. Xitoy Yangi yili, oktabr bayramlari va 11.11 dan keyin reyslar toʻlib, muddat 3–5 kunga choʻzilishi mumkin.',
      },
      {
        q: 'Minimal ogʻirlik bormi?',
        a: 'Ha, 0,5 kg. Undan yengil joʻnatma 0,5 kg sifatida hisoblanadi. Yuqori chegara yoʻq — 100 kg dan ortiq partiya uchun narx alohida kelishiladi.',
      },
      {
        q: 'Oddiy, seriyali va brend tovar nimasi bilan farq qiladi?',
        a: 'Oddiy tovar — brendsiz kundalik mahsulotlar (9 $/kg). Seriyali — bir xil mahsulotdan 3 donadan koʻp, tijorat partiyasi, batareyasiz elektronika va kosmetika (11,5 $/kg). Brend — original brend mahsulot qutisi va yorligʻi bilan (12 $/kg). Toifani omborda qabul paytida aniqlaymiz.',
      },
      {
        q: 'Telefon yoki powerbank avia bilan boradimi?',
        a: 'Yoʻq, litiy batareyali tovarlar avia kargoga olinmaydi — ularni avto kargo bilan 15–25 kunda olib kelamiz. Suyuqlik, atir, magnit va aerozollar ham faqat avto orqali boradi.',
      },
      {
        q: 'Hajmiy vazn avia uchun qanday hisoblanadi?',
        a: 'Uzunlik × en × balandlik (sm) ÷ 5 000. Masalan, 50 × 40 × 30 sm quti = 12 kg hajmiy vazn. Haqiqiy va hajmiy vazndan kattasi uchun toʻlaysiz; qayta qadoqlash (0,4 $/kg) koʻpincha hajmni 30–40% ga kamaytiradi.',
      },
      {
        q: 'Yukim Guanchjou yoki Shenchjenda boʻlsa-chi?',
        a: 'Qabul qilamiz: sotuvchi yukni Ivu omboriga Xitoy ichki pochtasi bilan joʻnatadi (odatda 1–3 kun), yoki hamkor ombor orqali toʻgʻridan-toʻgʻri Guanchjou aeroportiga yuboramiz. Qaysi variant tezroq — menejer aytadi.',
      },
      {
        q: 'Bojxona toʻlovlari narxga kiradimi?',
        a: 'Ha, avia kargo tarifiga kompaniya hujjatlari bilan bojxona rasmiylashtiruvi kiritilgan. Oʻz firmangiz nomiga import qilsangiz, boj va 12% QQS TN VED kodi boʻyicha alohida hisoblanadi — biz uni oldindan hisoblab beramiz.',
      },
    ],
    related: ['truck', 'warehouse', 'buying'],
    guideKeys: ['air-vs-truck-vs-rail', 'cargo-pricing', 'prohibited-goods', 'shipping-from-china'],
    cta: {
      title: 'Yukingizni eng yaqin reysga qoʻshamiz.',
      text: 'Tovar nomi, soni va taxminiy ogʻirligini yozing — toifani aniqlab, avia yoki avto qaysi biri maʼqul ekanini bir xabarda aytamiz.',
      draft: 'Assalomu alaykum! Avia kargo boʻyicha narx kerak. Tovar: … Soni: … dona. Ogʻirlik: … kg. Yuk qayerda: Ivu / Guanchjou / …',
    },
    updated: '2026-09-08',
  },

  ru: {
    key: 'air',
    seo: {
      title: 'Авиа карго из Китая в Ташкент — цена за кг и сроки',
      description:
        'Авиа карго из Китая в Ташкент: ориентировочно 5–10 дней, от 9 $/кг, принимаем от 0,5 кг. В цену входят приёмка на складе в Иу, консолидация, таможенное оформление и доставка до склада в Ташкенте. Объёмный вес ÷ 5 000.',
    },
    hero: {
      eyebrow: 'Услуга 02 — Авиа карго',
      h1: 'Авиа карго из Китая в Ташкент',
      intro:
        'Авиа карго — это доставка срочных, лёгких и дорогих грузов из Китая самолётом. После отправки со склада в Китае груз приходит в Ташкент ориентировочно за 5–10 дней. Цена считается по килограммам: обычный товар от 9 $/кг, бренд 12 $/кг, серийный (коммерческий) 11,5 $/кг; объёмный вес — по формуле ÷ 5 000. Минимальный вес — 0,5 кг. Приёмка на складе в Иу и таможенное оформление включены.',
      facts: [
        { label: 'Срок от склада в Китае', value: '5–10 дней' },
        { label: 'Обычный товар', value: 'от 9 $/кг' },
        { label: 'Минимальный вес', value: '0,5 кг' },
        { label: 'Объёмный вес', value: '÷ 5 000' },
      ],
    },
    sections: [
      {
        heading: 'Кому подходит авиа карго?',
        body: [
          'Авиа карго — для случаев, когда время дороже денег. Сборный груз в фуре идёт 15–25 дней, самолётом груз приходит за 5–10. Разница — две недели, а разница в цене — ориентировочно 1,5–2,5 $ за килограмм. На лёгком и дорогом товаре она незаметна, на тяжёлом и дешёвом выгоднее авто карго.',
          'Самолётом обычно отправляют:',
        ],
        bullets: [
          'Образцы и первые небольшие партии продавцов Uzum, Яндекс Маркета и Instagram — 0,5–50 кг.',
          'Аксессуары для телефонов, чехлы, мелкую электронику без батарей, часы, очки — дорогой товар на килограмм.',
          'Брендовую одежду и обувь в коробках — когда нужно успеть к началу сезона.',
          'Срочные запчасти для производства, мелкие комплектующие оборудования.',
          'Образцы для проверки перед оптовым заказом — 1–2 штуки.',
        ],
        callout: {
          title: 'Пример: 20 кг аксессуаров для телефонов',
          text: 'Авиа: 20 кг × 9 $ = 180 $, ориентировочно 7 дней. Авто: 20 кг × 7,5 $ = 150 $, ориентировочно 20 дней. За 30 $ разницы товар выходит в продажу на две недели раньше. А на 200 кг обуви разница превысит 300 $ — такой груз лучше отправить авто.',
          tone: 'info',
        },
      },
      {
        heading: 'Как считается цена авиа карго?',
        body: [
          'В авиа карго цена всегда считается по килограммам и зависит от категории товара: обычный товар, брендовый (оригинал, с коробкой и биркой) или серийный — больше трёх одинаковых единиц, коммерческая партия. Электроника и косметика тоже идут по серийному тарифу.',
          'Правило объёмного веса: длина × ширина × высота (см) ÷ 5 000. Место в самолёте дорогое, поэтому делитель — 5000, а не 6000, как у авто. К оплате берётся большее из фактического и объёмного веса. На складе в Иу есть переупаковка для уплотнения — чаще всего она окупает себя.',
        ],
        table: {
          caption: 'Тарифы авиа карго, Китай → Ташкент',
          head: ['Категория товара', 'Что входит', 'Ориентировочная цена'],
          rows: [
            ['Обычный товар', 'повседневные товары, аксессуары, одежда без бренда, хозтовары', '9 $/кг'],
            ['Серийный / коммерческий', 'больше 3 одинаковых единиц, электроника без батарей, сухая косметика', '11,5 $/кг'],
            ['Брендовый товар', 'оригинальная брендовая одежда, обувь, сумки — с коробкой и биркой', '12 $/кг'],
            ['Минимальный вес', 'на одно отправление', '0,5 кг'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. Цена фиксируется на каждый рейс; итоговая сумма известна после взвешивания на складе в Иу.',
        },
        callout: {
          title: 'Пример: объёмный вес ÷ 5 000',
          text: 'Коробка 50 × 40 × 30 см — это 60 000 см³, ÷ 5 000 = 12 кг объёмного веса. Даже если внутри 4 кг чехлов, платите за 12 кг: 12 × 9 = 108 $. Если переупаковать до 40 × 30 × 25 см — 6 кг, то есть 54 $. Поэтому лёгкий товар важно паковать плотно.',
          tone: 'info',
        },
      },
      {
        heading: 'Сколько дней идёт груз и каким маршрутом?',
        body: [
          'От отправки со склада в Китае до Ташкента — ориентировочно 5–10 дней. Груз принимается на складе в Иу и в зависимости от рейса едет в аэропорт Гуанчжоу или Урумчи, откуда летит в Ташкент. Сам перелёт занимает несколько часов; основное время уходит на консолидацию, экспортное оформление и таможню в Ташкенте.',
        ],
        table: {
          caption: 'Этапы авиамаршрута',
          head: ['Этап', 'Что происходит', 'Срок'],
          rows: [
            ['Склад в Иу', 'приёмка, взвешивание, обмер, фотоотчёт, комплектация рейса', '1–3 дня'],
            ['Иу → Гуанчжоу / Урумчи', 'доставка в аэропорт, экспортное оформление, досмотр', '1–2 дня'],
            ['Перелёт → Ташкент', 'рейс и приём в аэропорту', '1–2 дня'],
            ['Аэропорт Ташкента → склад', 'импортное таможенное оформление, сортировка', '1–3 дня'],
          ],
          note: 'Срок считается со дня отправки со склада в Китае. Рейсы несколько раз в неделю; груз ставится на ближайший.',
        },
        callout: {
          title: 'Сезонные задержки',
          text: 'В китайский Новый год (конец января – февраль), «золотую неделю» 1–7 октября и в недели после 11.11 рейсы переполнены, срок может вырасти на 3–5 дней. Приём на авиа закрывается позже, чем на авто, — примерно за 7–10 дней до Нового года.',
          tone: 'warn',
        },
      },
      {
        heading: 'Как проходит процесс?',
        body: [
          'Знать китайский не нужно — наши сотрудники в Иу сами общаются с продавцом. От вас нужны только данные о товаре и выбор рейса.',
        ],
        steps: [
          { title: 'Оставляете заявку', text: 'В Telegram или по телефону называете товар, количество и примерный вес. Здесь же определяем категорию (обычный, серийный, бренд) и можно ли отправить его самолётом.' },
          { title: 'Получаете адрес склада', text: 'Вы получаете адрес склада в Иу и личный код. Продавец или магазин на 1688/Taobao отправляет товар на этот адрес.' },
          { title: 'Принимаем груз', text: 'На складе взвешиваем и обмеряем каждое место, маркируем вашим кодом и отправляем фотоотчёт. Проверяем на батареи, жидкости и магниты — такой товар переводится на авто карго.' },
          { title: 'Комплектация рейса', text: 'Груз ставится на ближайший рейс и едет в аэропорт Гуанчжоу или Урумчи. Вы получаете номер рейса и код груза; с этого дня идёт отсчёт срока.' },
          { title: 'Перелёт и таможня', text: 'Менеджер сообщает статус груза. В Ташкенте оформление проходит под документы компании.' },
          { title: 'Получаете в Ташкенте', text: 'Груз приходит на склад в Ташкенте. Вы закрываете оплату и забираете его, либо мы доставляем до двери; отправку в регионы согласуем отдельно.' },
        ],
      },
      {
        heading: 'Что входит в цену, а что оплачивается отдельно?',
        body: [
          'Цена за килограмм — это полная услуга от склада в Иу до склада в Ташкенте. В неё входят:',
        ],
        bullets: [
          'Приёмка, взвешивание, обмер и маркировка на складе в Иу',
          'Комплектация рейса и доставка в аэропорт',
          'Экспортное оформление в Китае и импортное в Узбекистане под документы компании',
          'Доставка до склада в Ташкенте и бесплатное хранение до 3 дней',
          'Бесплатное хранение на складе в Иу до 14 дней',
          'Уведомления о статусе по коду груза и связь с менеджером',
        ],
        table: {
          caption: 'Дополнительные услуги',
          head: ['Услуга', 'Ориентировочная цена'],
          rows: [
            ['Фотоотчёт со вскрытием коробки', '1 $ / место'],
            ['Переупаковка (уменьшение объёма)', '0,4 $/кг'],
            ['Проверка товара (количество, цвет, дефекты)', '1 $/кг'],
            ['Страхование', '1% от заявленной стоимости'],
            ['Доставка до двери по Ташкенту', '20 000–30 000 сум, от 5 кг бесплатно'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. При импорте на вашу фирму пошлина и НДС 12% считаются отдельно по коду ТН ВЭД.',
        },
      },
      {
        heading: 'Что нельзя отправить самолётом?',
        body: [
          'Правила авиационной безопасности строже, чем на автотранспорте. Эти товары авиа карго не принимает, но большинство из них можно отправить авто карго:',
        ],
        bullets: [
          'Литиевые батареи и аккумуляторы: пауэрбанки, телефоны и ноутбуки с батареей, электросамокаты, игрушки на батарейках',
          'Магниты и товары с сильными магнитами (динамики, магнитные держатели)',
          'Жидкости, аэрозоли, духи, жидкая косметика, краски и клей',
          'Баллоны под давлением, горючие и взрывчатые вещества, зажигалки',
          'Лекарства, продукты питания, семена и растения',
          'Деньги, драгоценные металлы и камни, ювелирные изделия, антиквариат',
          'Дроны, рации и радиооборудование, требующее разрешения, смарт-часы с SIM-картой',
          'Контрафактную брендовую продукцию, оружие и его части, всё, что запрещено законом',
        ],
        callout: {
          title: 'Товар с батареей — только авто карго',
          text: 'Телефоны, ноутбуки, пауэрбанки, электроинструмент и игрушки с батареями отправляем авто карго: 15–25 дней, 6,5–7,5 $/кг. Перед заказом скажите менеджеру, что внутри, — груз не задержится на складе.',
          tone: 'info',
        },
      },
      {
        heading: 'Какие документы нужны?',
        body: [
          'Авиа карго оформляется под документы компании: отдельные документы для таможни от вас не требуются, но наименование, количество и стоимость товара должны быть указаны верно. Для брендового товара могут запросить инвойс продавца и подтверждение подлинности. Таможенное оформление — документы и декларация — входит в тариф; пошлина и НДС считаются отдельно по коду ТН ВЭД. «Без пошлин» мы не обещаем.',
          'Если хотите ввезти товар официально на свою фирму или ИП, мы работаем как экспедитор и декларант. Тогда понадобятся контракт, зарегистрированный в E-Contract, инвойс, упаковочный лист, авианакладная (AWB), сертификат происхождения и код ТН ВЭД на каждый товар.',
        ],
        callout: {
          title: 'Совет менеджера',
          text: 'Попросите продавца упаковать товар плотно и в маленькую коробку: авиа считается по объёмному весу ÷ 5 000, и за пустое место вы тоже платите. Образец — самолётом, основную партию — авто: для большинства продавцов это самая экономная схема.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'Сколько стоит 1 кг авиа карго из Китая?',
        a: 'Ориентировочно 9 $/кг за обычный товар; серийный (коммерческий) — 11,5 $/кг, брендовый — 12 $/кг. Цены обновлены 8 сентября 2026 г. и являются ориентировочными: итоговая сумма определяется после взвешивания на складе в Иу.',
      },
      {
        q: 'Сколько дней идёт авиа карго?',
        a: 'Ориентировочно 5–10 дней от отправки со склада в Китае до склада в Ташкенте. В китайский Новый год, октябрьские праздники и после 11.11 рейсы переполнены, и срок может вырасти на 3–5 дней.',
      },
      {
        q: 'Есть ли минимальный вес?',
        a: 'Да, 0,5 кг. Более лёгкое отправление считается как 0,5 кг. Верхнего предела нет — для партий свыше 100 кг цена согласуется отдельно.',
      },
      {
        q: 'Чем отличаются обычный, серийный и брендовый товар?',
        a: 'Обычный — повседневные товары без бренда (9 $/кг). Серийный — больше трёх одинаковых единиц, коммерческая партия, электроника без батарей и косметика (11,5 $/кг). Брендовый — оригинальная брендовая продукция с коробкой и биркой (12 $/кг). Категорию определяем при приёмке на складе.',
      },
      {
        q: 'Полетит ли телефон или пауэрбанк?',
        a: 'Нет, товары с литиевыми батареями авиа карго не принимает — их привозим авто карго за 15–25 дней. Жидкости, духи, магниты и аэрозоли тоже едут только авто.',
      },
      {
        q: 'Как считается объёмный вес для авиа?',
        a: 'Длина × ширина × высота (см) ÷ 5 000. Например, коробка 50 × 40 × 30 см = 12 кг объёмного веса. Платите за большее из фактического и объёмного веса; переупаковка (0,4 $/кг) обычно уменьшает объём на 30–40%.',
      },
      {
        q: 'А если мой товар в Гуанчжоу или Шэньчжэне?',
        a: 'Принимаем: продавец отправляет груз на склад в Иу внутрикитайской доставкой (обычно 1–3 дня), либо через партнёрский склад отправляем напрямую в аэропорт Гуанчжоу. Какой вариант быстрее — подскажет менеджер.',
      },
      {
        q: 'Таможенные платежи входят в цену?',
        a: 'Да, в тариф авиа карго включено таможенное оформление под документы компании. Если ввозите товар на свою фирму, пошлина и НДС 12% считаются отдельно по коду ТН ВЭД — мы рассчитаем их заранее.',
      },
    ],
    related: ['truck', 'warehouse', 'buying'],
    guideKeys: ['air-vs-truck-vs-rail', 'cargo-pricing', 'prohibited-goods', 'shipping-from-china'],
    cta: {
      title: 'Поставим ваш груз на ближайший рейс.',
      text: 'Напишите название товара, количество и примерный вес — определим категорию и одним сообщением скажем, что выгоднее: авиа или авто.',
      draft: 'Здравствуйте! Нужна цена на авиа карго. Товар: … Количество: … шт. Вес: … кг. Где груз: Иу / Гуанчжоу / …',
    },
    updated: '2026-09-08',
  },

  en: {
    key: 'air',
    seo: {
      title: 'Air cargo from China to Tashkent — price per kg and transit time',
      description:
        'Air cargo from China to Tashkent: roughly 5–10 days, from $9/kg, accepted from 0.5 kg. Receiving at the Yiwu warehouse, consolidation, customs clearance and delivery to the Tashkent warehouse are included. Volumetric weight ÷ 5 000.',
    },
    hero: {
      eyebrow: 'Service 02 — Air cargo',
      h1: 'Air cargo from China to Tashkent',
      intro:
        'Air cargo is the way to bring urgent, light and high-value goods from China by plane. Once dispatched from the warehouse in China, it reaches Tashkent in roughly 5–10 days. Pricing is per kilogram: standard goods from $9/kg, branded goods $12/kg, commercial lots $11.50/kg, with volumetric weight at ÷ 5 000. The minimum is 0.5 kg. Receiving at the Yiwu warehouse and customs clearance are included.',
      facts: [
        { label: 'Transit from the China warehouse', value: '5–10 days' },
        { label: 'Standard goods', value: 'from $9/kg' },
        { label: 'Minimum weight', value: '0.5 kg' },
        { label: 'Volumetric weight rule', value: '÷ 5 000' },
      ],
    },
    sections: [
      {
        heading: 'Who is air cargo for?',
        body: [
          'Air cargo is for when time is worth more than money. Consolidated truck cargo takes 15–25 days; by plane it arrives in 5–10. That is a two-week difference for roughly $1.50–2.50 more per kilogram. On light, expensive goods the extra cost is barely noticeable; on heavy, cheap goods the truck wins.',
          'Typical air shipments:',
        ],
        bullets: [
          'Samples and first small lots for Uzum, Yandex Market and Instagram sellers — 0.5–50 kg.',
          'Phone accessories, cases, small electronics without batteries, watches, eyewear — high value per kilogram.',
          'Branded clothing and footwear in boxes — when you need to make the start of the season.',
          'Urgent spare parts for production, small machine components.',
          'One or two samples to check before placing a wholesale order.',
        ],
        callout: {
          title: 'Example: 20 kg of phone accessories',
          text: 'Air: 20 kg × $9 = $180, roughly 7 days. Truck: 20 kg × $7.50 = $150, roughly 20 days. For a $30 difference the goods go on sale two weeks earlier. On 200 kg of footwear, though, the gap exceeds $300 — that load belongs on a truck.',
          tone: 'info',
        },
      },
      {
        heading: 'How is the air cargo price calculated?',
        body: [
          'Air cargo is always priced per kilogram, and the rate depends on the goods category: standard goods, branded goods (originals with box and label) or commercial lots — more than three identical units. Electronics and cosmetics are also billed at the commercial rate.',
          'Volumetric weight: length × width × height (cm) ÷ 5 000. Space on a plane is expensive, so the divisor is 5000 rather than the 6000 used for trucks. We charge the greater of actual and volumetric weight. The Yiwu warehouse offers repacking to compress boxes — it usually pays for itself.',
        ],
        table: {
          caption: 'Air cargo rates, China → Tashkent',
          head: ['Goods category', 'What it covers', 'Estimated price'],
          rows: [
            ['Standard goods', 'everyday products, accessories, unbranded clothing, household items', '$9/kg'],
            ['Commercial lot', 'more than 3 identical units, electronics without batteries, dry cosmetics', '$11.50/kg'],
            ['Branded goods', 'original branded clothing, footwear, bags — with box and label', '$12/kg'],
            ['Minimum weight', 'per shipment', '0.5 kg'],
          ],
          note: 'Estimates · Updated September 8, 2026. Rates are fixed per flight; the final amount is known after weighing at the Yiwu warehouse.',
        },
        callout: {
          title: 'Example: volumetric weight ÷ 5 000',
          text: 'A 50 × 40 × 30 cm box is 60,000 cm³; ÷ 5 000 = 12 kg volumetric weight. Even if it holds 4 kg of phone cases, you pay for 12 kg: 12 × $9 = $108. Repacked to 40 × 30 × 25 cm it becomes 6 kg, or $54. That is why light goods should be packed tight.',
          tone: 'info',
        },
      },
      {
        heading: 'How long does it take, and which route?',
        body: [
          'Roughly 5–10 days from dispatch at the China warehouse to Tashkent. Goods are received at the Yiwu warehouse and, depending on the flight, trucked to Guangzhou or Urumqi airport, then flown to Tashkent. The flight itself takes hours; most of the time goes on consolidation, export clearance and customs in Tashkent.',
        ],
        table: {
          caption: 'Stages of the air route',
          head: ['Stage', 'What happens', 'Roughly'],
          rows: [
            ['Yiwu warehouse', 'receiving, weighing, measuring, photo report, building the flight lot', '1–3 days'],
            ['Yiwu → Guangzhou / Urumqi', 'transfer to the airport, export clearance, security screening', '1–2 days'],
            ['Flight → Tashkent', 'the flight and airport handling', '1–2 days'],
            ['Tashkent airport → warehouse', 'import customs clearance, sorting', '1–3 days'],
          ],
          note: 'Transit is counted from the day of dispatch at the China warehouse. Flights run several times a week; your cargo joins the next one.',
        },
        callout: {
          title: 'Seasonal delays',
          text: 'Around Chinese New Year (late January – February), Golden Week on October 1–7 and the weeks after the 11.11 sales, flights fill up and transit can stretch by 3–5 days. Air receiving closes later than truck — about 7–10 days before New Year.',
          tone: 'warn',
        },
      },
      {
        heading: 'How does the process work?',
        body: [
          'You do not need Chinese — our staff in Yiwu talk to the seller themselves. All we need from you is the product details and a choice of flight.',
        ],
        steps: [
          { title: 'You leave a request', text: 'On Telegram or by phone you tell us the product, quantity and approximate weight. We confirm the category (standard, commercial, branded) and whether it can fly.' },
          { title: 'You get a warehouse address', text: 'We give you the address of the Yiwu warehouse and your personal code. Your seller or 1688/Taobao shop ships to that address.' },
          { title: 'We receive the goods', text: 'At the warehouse we weigh and measure every piece, label it with your code and send a photo report. We check for batteries, liquids and magnets — such goods are moved to truck cargo.' },
          { title: 'Flight consolidation', text: 'Your cargo joins the next flight lot and travels to Guangzhou or Urumqi airport. You receive the flight number and your cargo code; transit time counts from that day.' },
          { title: 'Flight and customs', text: 'Your manager keeps you updated on the status. Clearance in Tashkent runs under the company’s documents.' },
          { title: 'You collect in Tashkent', text: 'The cargo arrives at the Tashkent warehouse. You settle the invoice and pick it up, or we deliver to your door; delivery to the regions is arranged separately.' },
        ],
      },
      {
        heading: 'What is included, and what costs extra?',
        body: [
          'The per-kilogram price is the full service from the Yiwu warehouse to the Tashkent warehouse. It includes:',
        ],
        bullets: [
          'Receiving, weighing, measuring and labelling at the Yiwu warehouse',
          'Flight consolidation and transfer to the airport',
          'Export clearance in China and import clearance in Uzbekistan under the company’s documents',
          'Delivery to the Tashkent warehouse and free storage for up to 3 days',
          'Free storage at the Yiwu warehouse for up to 14 days',
          'Status updates by cargo code and a manager you can reach',
        ],
        table: {
          caption: 'Optional extras',
          head: ['Service', 'Estimated price'],
          rows: [
            ['Photo report with the box opened', '$1 per piece'],
            ['Repacking (reducing volume)', '$0.40/kg'],
            ['Goods inspection (quantity, colour, defects)', '$1/kg'],
            ['Insurance', '1% of declared value'],
            ['Door delivery in Tashkent', 'UZS 20,000–30,000, free from 5 kg'],
          ],
          note: 'Estimates · Updated September 8, 2026. If you import under your own company, duty and 12% VAT are calculated separately by HS code.',
        },
      },
      {
        heading: 'What cannot fly?',
        body: [
          'Aviation security rules are stricter than road rules. Air cargo refuses the following, but most of it can go by truck:',
        ],
        bullets: [
          'Lithium batteries and accumulators: power banks, phones and laptops with batteries, e-scooters, battery-powered toys',
          'Magnets and goods with strong magnets (speakers, magnetic mounts)',
          'Liquids, aerosols, perfume, liquid cosmetics, paints and glue',
          'Pressurised cylinders, flammable and explosive substances, lighters',
          'Medicines, food, seeds and plants',
          'Cash, precious metals and stones, jewellery, antiques',
          'Drones, walkie-talkies and radio equipment that needs a permit, smartwatches with a SIM card',
          'Counterfeit branded goods, weapons and their parts, anything else prohibited by law',
        ],
        callout: {
          title: 'Anything with a battery goes by truck',
          text: 'Phones, laptops, power banks, power tools and battery toys travel by truck cargo: 15–25 days, $6.50–7.50/kg. Tell your manager what is inside before you order, so the cargo is not held at the warehouse.',
          tone: 'info',
        },
      },
      {
        heading: 'Which documents are needed?',
        body: [
          'Air cargo is cleared under the company’s documents: you do not need to supply customs paperwork, but the product name, quantity and value must be stated correctly. For branded goods we may ask for the seller’s invoice and proof of authenticity. Customs clearance — documents and the declaration — is included in the rate; duty and VAT are calculated separately by HS code. We never promise “no duties”.',
          'If you want to import officially under your own company or sole proprietorship, we act as forwarder and declarant. You will then need a contract registered in E-Contract, an invoice, a packing list, the air waybill (AWB), a certificate of origin and an HS code for every product.',
        ],
        callout: {
          title: 'Manager’s tip',
          text: 'Ask the seller to pack tight and in a small box: air is billed on volumetric weight ÷ 5 000, and you pay for empty space too. Sample by air, main lot by truck — for most sellers that is the most economical setup.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'How much is 1 kg of air cargo from China?',
        a: 'Roughly $9/kg for standard goods; commercial lots $11.50/kg, branded goods $12/kg. Prices were updated on September 8, 2026 and are estimates — the final amount is fixed after weighing at the Yiwu warehouse.',
      },
      {
        q: 'How many days does air cargo take?',
        a: 'Roughly 5–10 days from dispatch at the China warehouse to the Tashkent warehouse. Around Chinese New Year, the October holidays and after 11.11, flights fill up and transit can stretch by 3–5 days.',
      },
      {
        q: 'Is there a minimum weight?',
        a: 'Yes, 0.5 kg. Lighter shipments are billed as 0.5 kg. There is no upper limit — lots over 100 kg are quoted individually.',
      },
      {
        q: 'What is the difference between standard, commercial and branded goods?',
        a: 'Standard is unbranded everyday goods ($9/kg). Commercial is more than three identical units, a trade lot, electronics without batteries and cosmetics ($11.50/kg). Branded is original branded products with box and label ($12/kg). The category is confirmed at receiving in the warehouse.',
      },
      {
        q: 'Will a phone or power bank fly?',
        a: 'No, goods with lithium batteries are refused by air cargo — we bring them by truck in 15–25 days. Liquids, perfume, magnets and aerosols also travel by truck only.',
      },
      {
        q: 'How is volumetric weight calculated for air?',
        a: 'Length × width × height (cm) ÷ 5 000. For example, a 50 × 40 × 30 cm box is 12 kg volumetric weight. You pay for the greater of actual and volumetric weight; repacking ($0.40/kg) usually cuts the volume by 30–40%.',
      },
      {
        q: 'What if my goods are in Guangzhou or Shenzhen?',
        a: 'We accept them: the seller ships to the Yiwu warehouse by domestic delivery (usually 1–3 days), or we send them straight to Guangzhou airport through a partner warehouse. Your manager will tell you which option is faster.',
      },
      {
        q: 'Are customs payments included in the price?',
        a: 'Yes, the air cargo rate includes customs clearance under the company’s documents. If you import under your own company, duty and 12% VAT are calculated separately by HS code — we work them out for you in advance.',
      },
    ],
    related: ['truck', 'warehouse', 'buying'],
    guideKeys: ['air-vs-truck-vs-rail', 'cargo-pricing', 'prohibited-goods', 'shipping-from-china'],
    cta: {
      title: 'We will put your cargo on the next flight.',
      text: 'Send the product name, quantity and approximate weight — we will confirm the category and tell you in one message whether air or truck is the better choice.',
      draft: 'Hello! I need a quote for air cargo. Product: … Quantity: … pcs. Weight: … kg. Cargo location: Yiwu / Guangzhou / …',
    },
    updated: '2026-09-08',
  },
};

export default content;
