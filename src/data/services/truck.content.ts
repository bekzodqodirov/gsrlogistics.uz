import type { ServiceContentByLang } from './types';

/**
 * Avto kargo (yigʻma yuk) — long-form page content.
 * Figures mirror src/data/tariffs.json (updated 2026-09-08): truck ladder 7,5 / 7 / 6,5 $/kg,
 * dense wholesale ≥100 kg 3,5 $/kg, LCL 110–190 $/m³ by density, ÷ 6 000 volumetric, 170 kg/m³ threshold,
 * extras 1 $ photo, 0,4 $/kg repack, 1 $/kg inspection, 1% insurance, 14/3 free storage days,
 * door delivery 20 000–30 000 soʻm (free from 5 kg in Tashkent). Keep them in sync when tariffs change.
 */
const content: ServiceContentByLang = {
  uz: {
    key: 'truck',
    seo: {
      title: 'Xitoydan Toshkentga avto kargo (yigʻma yuk) — narxi va muddati',
      description:
        'Xitoydan Toshkentga yigʻma yuk: taxminan 15–25 kun, 6,5 $/kg dan yoki 110 $/m³ dan. Ivu omborida qabul, konsolidatsiya, bojxona rasmiylashtiruvi va Toshkent omborigacha yetkazib berish narxga kiradi.',
    },
    hero: {
      eyebrow: 'Xizmat 01 — Yigʻma yuk',
      h1: 'Xitoydan Toshkentga avto kargo (yigʻma yuk)',
      intro:
        'Yigʻma yuk — bu bir necha mijozning yukini Ivu omborida bitta fura yoki konteynerga jamlab, Xorgos orqali Toshkentga olib kelish. Xitoy omboridan joʻnatilgach, yuk taxminan 15–25 kunda keladi. Narx zichlikka qarab kilogramm (6,5 $/kg dan) yoki kub metr (110 $/m³ dan) hisobida chiqadi, minimal partiya — 1 kg yoki 0,1 m³. Butun konteynerni ijaraga olish shart emas.',
      facts: [
        { label: 'Muddat, Xitoy omboridan', value: '15–25 kun' },
        { label: 'Narx, kg hisobida', value: '6,5 $/kg dan' },
        { label: 'Narx, m³ hisobida', value: '110 $/m³ dan' },
        { label: 'Hajmiy vazn qoidasi', value: '÷ 6 000' },
      ],
    },
    sections: [
      {
        heading: 'Yigʻma yuk kimga toʻgʻri keladi?',
        body: [
          'Yigʻma yuk (LCL, сборный груз) — Xitoydan tovar olib kelishning eng koʻp tarqalgan usuli. Yukingiz Ivu (义乌) omborida boshqa mijozlarning yuklari bilan bitta fura yoki konteynerga joylanadi, shuning uchun 1 kg yuk uchun ham, 10 m³ yuk uchun ham faqat oʻz ulushingizga toʻlaysiz. Guanchjou, Shenchjen va boshqa shaharlardan ham qabul qilamiz: yetkazib beruvchi yukni Ivu omboriga joʻnatadi yoki hamkorlarimiz olib keladi.',
          'Bu usul quyidagi holatlarda oʻzini oqlaydi:',
        ],
        bullets: [
          'Ulgurji savdo (Abu Sahiy, Chorsu, Bek Baraka): kiyim-kechak, poyabzal, gazlama — zich yuk, odatda 200–350 kg/m³, kilogramm hisobida arzon chiqadi.',
          'Uzum, Yandex Market va Instagram sotuvchilari: 20–300 kg li partiyalar har 1–2 haftada; har bir buyurtma alohida kod bilan markirovka qilinadi.',
          'Ishlab chiqaruvchilar: ehtiyot qismlar, xomashyo, mayda uskunalar — 100 kg dan boshlab zich yuk tarifi (3,5 $/kg dan) ishlaydi.',
          'Yengil va hajmli tovarlar (oʻyinchoq, plastmassa buyumlar, mebel, uy-roʻzgʻor mollari): zichlik 170 kg/m³ dan past — kub metr hisobida hisoblaymiz.',
        ],
      },
      {
        heading: 'Narx qanday hisoblanadi?',
        body: [
          'Avval yukning zichligini aniqlaymiz: umumiy ogʻirlikni (kg) umumiy hajmga (m³) boʻlamiz. Zichlik 170 kg/m³ va undan yuqori boʻlsa — kilogramm hisobida, past boʻlsa — kub metr hisobida toʻlaysiz. Ikkala holatda ham koʻrsatilgan narx Ivu omboridan Toshkent omborigacha boʻlgan toʻliq yoʻlni qamraydi.',
          'Mayda partiyalarda (100 kg gacha) hajmiy vazn qoidasi ishlaydi: uzunlik × en × balandlik (sm) ÷ 6 000. Haqiqiy va hajmiy vazndan kattasi hisobga olinadi. Kilogramm boʻyicha tarif partiya ogʻirligi oshgan sari pasayadi, kub metr boʻyicha tarif esa zichlik oshgan sari koʻtariladi — jadvalda ikkala shkala berilgan.',
        ],
        table: {
          caption: 'Avto kargo tariflari, Ivu → Toshkent',
          head: ['Yuk turi', 'Shart', 'Taxminiy narx'],
          rows: [
            ['Aralash yuk, kg hisobida', '30 kg gacha', '7,5 $/kg'],
            ['Aralash yuk, kg hisobida', '30–100 kg', '7 $/kg'],
            ['Aralash yuk, kg hisobida', '100 kg dan koʻp', '6,5 $/kg'],
            ['Zich ulgurji yuk (kiyim, gazlama, poyabzal)', '100 kg dan, zichlik ≥ 300 kg/m³', '3,5 $/kg dan'],
            ['Hajmli yuk, m³ hisobida', 'zichlik 100 kg/m³ gacha', '110 $/m³'],
            ['Hajmli yuk, m³ hisobida', '100–200 kg/m³', '130 $/m³'],
            ['Hajmli yuk, m³ hisobida', '200–300 kg/m³', '150 $/m³'],
            ['Hajmli yuk, m³ hisobida', '300–400 kg/m³', '170 $/m³'],
            ['Hajmli yuk, m³ hisobida', '400 kg/m³ dan yuqori', '190 $/m³'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. Yakuniy summa yuk Ivu omborida tortilib oʻlchangandan keyin aniqlanadi; brend va seriyali tovarlar uchun tarif alohida kelishiladi.',
        },
        callout: {
          title: 'Misol: hajmiy vazn',
          text: '60 × 40 × 40 sm li quti — 96 000 sm³, ÷ 6 000 = 16 kg hajmiy vazn. Qutining haqiqiy ogʻirligi 10 kg boʻlsa, 16 kg uchun toʻlaysiz; 25 kg boʻlsa — 25 kg uchun. Kalkulyatorda oʻlchamlarni kiritsangiz, qoida oʻzi tanlanadi.',
          tone: 'info',
        },
      },
      {
        heading: 'Necha kunda keladi va qaysi yoʻldan?',
        body: [
          'Xitoy omboridan joʻnatilgan kundan Toshkentgacha taxminan 15–25 kun. Bizning rekord partiyalarimiz 12–13 kunda yetib kelgan, lekin biz buni standart muddat sifatida vaʼda qilmaymiz. Yoʻl: Ivu → Sian → Lanchjou → Urumchi → Xorgos (Qozogʻiston chegarasi) → Olmaota → Shimkent → Yallama posti → Toshkent.',
        ],
        table: {
          caption: 'Yoʻlning bosqichlari',
          head: ['Bosqich', 'Nima boʻladi', 'Taxminiy vaqt'],
          rows: [
            ['Ivu ombori', 'qabul, tortish, markirovka, partiya toʻlguncha kutish', '2–5 kun'],
            ['Ivu → Urumchi → Xorgos', 'Xitoy ichidagi yoʻl, eksport rasmiylashtiruvi', '5–8 kun'],
            ['Xorgos → Olmaota → Shimkent', 'Qozogʻiston boʻylab tranzit', '3–5 kun'],
            ['Yallama → Toshkent ombori', 'import bojxona rasmiylashtiruvi, tushirish', '2–5 kun'],
          ],
          note: 'Muddat Xitoy omboridan joʻnatilgan kundan hisoblanadi. Chegaradagi navbat va bayramlar qoʻshimcha kun olishi mumkin.',
        },
        callout: {
          title: 'Mavsumiy kechikishlar',
          text: 'Xitoy Yangi yili (yanvar oxiri – fevral), 1–7-oktabr «Oltin hafta» va 11.11 savdolaridan keyingi haftalarda yoʻl 7–10 kunga choʻzilishi mumkin. Ivu ombori Yangi yildan bir hafta oldin qabulni toʻxtatadi — partiyani oldindan rejalashtiring.',
          tone: 'warn',
        },
      },
      {
        heading: 'Jarayon qanday boʻladi?',
        body: [
          'Xitoy tilini bilish shart emas — Ivudagi xodimlarimiz yetkazib beruvchi bilan oʻzlari gaplashadi. Sizdan faqat tovar haqida maʼlumot va qaror kerak.',
        ],
        steps: [
          { title: 'Soʻrov qoldirasiz', text: 'Telegram yoki telefon orqali tovar nomini, taxminiy ogʻirlik va hajmni aytasiz. Biz zichlikka qarab taxminiy narxni hisoblab beramiz.' },
          { title: 'Ombor manzilini olasiz', text: 'Sizga Ivu omborining manzili va shaxsiy kodingiz beriladi. Yetkazib beruvchi yoki 1688/Taobao sotuvchisi yukni shu manzilga joʻnatadi.' },
          { title: 'Yukni qabul qilamiz', text: 'Omborda har bir joyni tortamiz, oʻlchaymiz, kodingiz bilan markirovka qilamiz va foto-hisobot yuboramiz. Xohlasangiz — ichini ochib tekshiramiz va qayta qadoqlaymiz.' },
          { title: 'Konsolidatsiya va joʻnatish', text: 'Yuk eng yaqin partiyaga joylanadi. Sizga partiya raqami va yuk kodi beriladi; joʻnatilgan kundan muddat hisobi boshlanadi.' },
          { title: 'Yoʻl va bojxona', text: 'Menejer yukning qayerdaligini bosqichma-bosqich xabar qilib boradi. Xorgos va Yallamada rasmiylashtiruv kompaniya hujjatlari bilan oʻtadi.' },
          { title: 'Toshkentda qabul qilasiz', text: 'Yuk Toshkent omboriga keladi. Toʻlovni yakunlaysiz va yukni olib ketasiz yoki eshikkacha yetkazib beramiz; viloyatlarga yetkazishni alohida kelishamiz.' },
        ],
      },
      {
        heading: 'Narxga nimalar kiradi va nimalar alohida toʻlanadi?',
        body: [
          'Kilogramm yoki kub metr uchun koʻrsatilgan narx — Ivu omboridan Toshkent omborigacha boʻlgan toʻliq xizmat. Unga kiradi:',
        ],
        bullets: [
          'Ivu omborida qabul, tortish, oʻlchash va markirovka',
          'Konsolidatsiya — partiyaga joylash va yuklash',
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
            ['Qayta qadoqlash (hajmni kamaytirish, mustahkamlash)', '0,4 $/kg'],
            ['Tovarni tekshirish (soni, rangi, nuqsonlari)', '1 $/kg'],
            ['Sugʻurta', 'eʼlon qilingan qiymatning 1%'],
            ['Toshkentda eshikkacha yetkazib berish', '20 000–30 000 soʻm, 5 kg dan bepul'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. Oʻz firmangiz nomiga import qilsangiz, boj va 12% QQS TN VED kodi boʻyicha alohida hisoblanadi.',
        },
      },
      {
        heading: 'Nimalarni olib kelib boʻlmaydi?',
        body: ['Quyidagi tovarlarni yigʻma yukda qabul qilmaymiz:'],
        bullets: [
          'Portlovchi, yonuvchi va zaharli moddalar, bosim ostidagi ballonlar',
          'Oʻsimlik, urugʻ, tirik hayvon va tez buziladigan oziq-ovqat',
          'Pul, qimmatbaho metall va toshlar, zargarlik va antiqa buyumlar',
          'Toʻlov vositalari, qimmatli qogʻozlar, hujjatlar',
          'Dori-darmon tijorat miqdorida, narkotik va psixotrop moddalar',
          'Dronlar, ratsiya va ruxsatnoma talab qiladigan radiouskunalar',
          'Qurol va uning qismlari, kontrafakt brend mahsulotlar',
          'Oʻzbekiston va Xitoy qonunlari bilan taqiqlangan boshqa narsalar',
        ],
        callout: {
          title: 'Avia orqali boʻlmaydi — avto orqali boʻladi',
          text: 'Litiy batareyali texnika, powerbank, magnit, suyuqlik va kosmetika avia kargoga olinmaydi, lekin avto kargoda qabul qilinadi. Bunday tovarni oldindan aytib qoʻying — alohida qadoqlanadi.',
          tone: 'info',
        },
      },
      {
        heading: 'Qanday hujjatlar kerak?',
        body: [
          'Yigʻma yuk kompaniya hujjatlari bilan rasmiylashtiriladi: sizdan bojxona uchun alohida hujjat talab qilinmaydi, lekin tovarning nomi, soni va qiymati toʻgʻri koʻrsatilishi shart — shu maʼlumot asosida deklaratsiya toʻldiriladi. Bojxona rasmiylashtiruvi — hujjatlar va deklaratsiya — tarifga kiritilgan; boj va QQS esa TN VED kodi boʻyicha alohida hisoblanadi. «Bojsiz» degan vaʼda bermaymiz.',
          'Tovarni oʻz firmangiz yoki YaTT nomiga rasmiy import qilmoqchi boʻlsangiz, biz ekspeditor va deklarant sifatida ishlaymiz. Bu holda kerak boʻladi:',
        ],
        bullets: [
          'E-Contract (EEISVO) tizimida roʻyxatdan oʻtgan tashqi savdo shartnomasi',
          'Invoys va qadoqlash roʻyxati (packing list)',
          'CMR — avtomobil yuk xati, kelib chiqish sertifikati',
          'Har bir tovar uchun 10 xonali TN VED kodi',
          'Tovar turiga qarab muvofiqlik sertifikati yoki SES xulosasi',
        ],
        callout: {
          title: 'Menejer maslahati',
          text: 'Yetkazib beruvchidan har bir qutiga sizning kodingizni va tovar nomini yozib joʻnatishni soʻrang — omborda yuk tez topiladi va aralashib ketmaydi. Ogʻir va yengil tovarlarni bitta partiyada yuborsangiz, umumiy zichlik oshadi va koʻpincha kilogramm hisobi arzonroq chiqadi.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'Xitoydan avto kargo 1 kg necha pul?',
        a: 'Taxminan 6,5–7,5 $/kg, partiya ogʻirligiga qarab; 100 kg dan ortiq zich ulgurji yuk uchun 3,5 $/kg dan. Narxlar 2026-yil 8-sentabrda yangilangan va taxminiy — yakuniy summa yuk Ivu omborida tortilgandan keyin aniqlanadi.',
      },
      {
        q: 'Yigʻma yuk necha kunda keladi?',
        a: 'Taxminan 15–25 kun — yuk Xitoy omboridan joʻnatilgan kundan Toshkentgacha. Rekord partiyalar 12–13 kunda kelgan; Xitoy Yangi yili va oktabr bayramlarida yoʻl bir haftaga choʻzilishi mumkin.',
      },
      {
        q: 'Minimal ogʻirlik yoki hajm bormi?',
        a: 'Yoʻq, 1 kg yoki 0,1 m³ dan qabul qilamiz. Mayda partiya kilogramm hisobida, hajmli yuk esa 0,1 m³ dan kub metr hisobida hisoblanadi.',
      },
      {
        q: 'Hajmiy vazn nima va u qachon hisoblanadi?',
        a: 'Hajmiy vazn — qutining uzunligi × eni × balandligi (sm) ÷ 6 000. Haqiqiy vazn undan kichik boʻlsa, hajmiy vazn uchun toʻlaysiz. Partiya 100 kg dan oshsa, zichlik qoidasi ishlaydi: 170 kg/m³ dan zich yuk — kg, yengil yuk — m³ hisobida.',
      },
      {
        q: 'Yukim Guanchjou yoki boshqa shaharda boʻlsa-chi?',
        a: 'Qabul qilamiz: yetkazib beruvchi yukni Ivu omboriga Xitoy ichki pochtasi bilan joʻnatadi (odatda 1–3 kun), yoki hamkor ombor orqali olamiz. Xitoy ichidagi yetkazib berish narxi sotuvchi bilan kelishiladi.',
      },
      {
        q: 'Yuk yoʻqolsa yoki shikastlansa nima boʻladi?',
        a: 'Sugʻurta qilingan yuk uchun eʼlon qilingan qiymat qoplanadi; sugʻurta — qiymatning 1%. Har bir joy qabulda suratga olinadi va shartnomada javobgarlik shartlari yozib qoʻyiladi — mayda yuk uchun ham shartnoma tuzamiz.',
      },
      {
        q: 'Bojxona toʻlovlari narxga kiradimi?',
        a: 'Ha, yigʻma yuk tarifiga kompaniya hujjatlari bilan bojxona rasmiylashtiruvi kiritilgan. Oʻz firmangiz nomiga import qilsangiz, boj va 12% QQS TN VED kodi boʻyicha alohida hisoblanadi va biz uni oldindan hisoblab beramiz.',
      },
      {
        q: 'Toʻlovni qachon va qanday qilaman?',
        a: 'Hisobni yuk Toshkent omboriga kelganda, olib ketishdan oldin yopasiz; narx dollarda kelishiladi, toʻlov soʻmda naqd, karta orqali yoki yuridik shaxslar uchun hisob-faktura bilan. Aniq tartib shartnomada koʻrsatiladi.',
      },
    ],
    related: ['warehouse', 'customs', 'air'],
    guideKeys: ['shipping-from-china', 'cargo-pricing', 'routes', 'prohibited-goods'],
    cta: {
      title: 'Yukingizni keyingi partiyaga qoʻshamiz.',
      text: 'Tovar nomi, taxminiy ogʻirlik va hajmni yozing — zichlikni hisoblab, kilogramm yoki kub metr hisobidan qaysi biri arzon chiqishini aytamiz.',
      draft: 'Assalomu alaykum! Avto kargo (yigʻma yuk) boʻyicha narx kerak. Tovar: … Ogʻirlik: … kg. Hajm: … m³. Yuk qayerda: Ivu / …',
    },
    updated: '2026-09-08',
  },

  ru: {
    key: 'truck',
    seo: {
      title: 'Авто карго из Китая в Ташкент (сборный груз) — цена и сроки',
      description:
        'Сборный груз из Китая в Ташкент: ориентировочно 15–25 дней, от 6,5 $/кг или от 110 $/м³. В цену входят приёмка на складе в Иу, консолидация, таможенное оформление и доставка до склада в Ташкенте.',
    },
    hero: {
      eyebrow: 'Услуга 01 — Сборный груз',
      h1: 'Авто карго из Китая в Ташкент (сборный груз)',
      intro:
        'Сборный груз — это когда грузы нескольких клиентов собирают на складе в Иу в одну фуру или контейнер и везут через Хоргос в Ташкент. После отправки со склада в Китае груз идёт ориентировочно 15–25 дней. Цена зависит от плотности: по килограммам (от 6,5 $/кг) или по кубометрам (от 110 $/м³), минимальная партия — 1 кг или 0,1 м³. Арендовать целый контейнер не нужно.',
      facts: [
        { label: 'Срок от склада в Китае', value: '15–25 дней' },
        { label: 'Цена по килограммам', value: 'от 6,5 $/кг' },
        { label: 'Цена по кубометрам', value: 'от 110 $/м³' },
        { label: 'Объёмный вес', value: '÷ 6 000' },
      ],
    },
    sections: [
      {
        heading: 'Кому подходит сборный груз?',
        body: [
          'Сборный груз (LCL) — самый распространённый способ привезти товар из Китая. Ваш груз на складе в Иу (义乌) укладывается в одну фуру или контейнер вместе с грузами других клиентов, поэтому и за 1 кг, и за 10 м³ вы платите только за свою долю. Принимаем также из Гуанчжоу, Шэньчжэня и других городов: поставщик отправляет товар на склад в Иу или его забирают наши партнёры.',
          'Такой формат выгоден в следующих случаях:',
        ],
        bullets: [
          'Оптовая торговля (Абу Сахий, Чорсу, Бек Барака): одежда, обувь, ткани — плотный груз, обычно 200–350 кг/м³, по килограммам выходит дешевле.',
          'Продавцы Uzum, Яндекс Маркета и Instagram: партии по 20–300 кг раз в одну–две недели; каждый заказ маркируется отдельным кодом.',
          'Производители: запчасти, сырьё, мелкое оборудование — от 100 кг действует тариф для плотного груза (от 3,5 $/кг).',
          'Лёгкие и объёмные товары (игрушки, пластик, мебель, хозтовары): плотность ниже 170 кг/м³ — считаем по кубометрам.',
        ],
      },
      {
        heading: 'Как считается цена?',
        body: [
          'Сначала определяем плотность груза: общий вес (кг) делим на общий объём (м³). Если плотность 170 кг/м³ и выше — платите по килограммам, если ниже — по кубометрам. В обоих случаях цена покрывает весь путь от склада в Иу до склада в Ташкенте.',
          'Для небольших партий (до 100 кг) действует правило объёмного веса: длина × ширина × высота (см) ÷ 6 000. К оплате берётся большее из фактического и объёмного веса. Ставка за килограмм снижается с ростом партии, ставка за кубометр растёт с ростом плотности — в таблице обе шкалы.',
        ],
        table: {
          caption: 'Тарифы авто карго, Иу → Ташкент',
          head: ['Тип груза', 'Условие', 'Ориентировочная цена'],
          rows: [
            ['Смешанный груз, по кг', 'до 30 кг', '7,5 $/кг'],
            ['Смешанный груз, по кг', '30–100 кг', '7 $/кг'],
            ['Смешанный груз, по кг', 'от 100 кг', '6,5 $/кг'],
            ['Плотный оптовый груз (одежда, ткани, обувь)', 'от 100 кг, плотность ≥ 300 кг/м³', 'от 3,5 $/кг'],
            ['Объёмный груз, по м³', 'плотность до 100 кг/м³', '110 $/м³'],
            ['Объёмный груз, по м³', '100–200 кг/м³', '130 $/м³'],
            ['Объёмный груз, по м³', '200–300 кг/м³', '150 $/м³'],
            ['Объёмный груз, по м³', '300–400 кг/м³', '170 $/м³'],
            ['Объёмный груз, по м³', 'выше 400 кг/м³', '190 $/м³'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. Итоговая сумма определяется после взвешивания и обмера на складе в Иу; для брендовых и серийных товаров тариф согласуется отдельно.',
        },
        callout: {
          title: 'Пример: объёмный вес',
          text: 'Коробка 60 × 40 × 40 см — это 96 000 см³, ÷ 6 000 = 16 кг объёмного веса. Если фактический вес коробки 10 кг, платите за 16 кг; если 25 кг — за 25 кг. Введите размеры в калькулятор, и правило подберётся само.',
          tone: 'info',
        },
      },
      {
        heading: 'Сколько дней идёт груз и каким маршрутом?',
        body: [
          'От отправки со склада в Китае до Ташкента — ориентировочно 15–25 дней. Наши рекордные партии доходили за 12–13 дней, но мы не обещаем это как стандартный срок. Маршрут: Иу → Сиань → Ланьчжоу → Урумчи → Хоргос (граница с Казахстаном) → Алматы → Шымкент → пост Яллама → Ташкент.',
        ],
        table: {
          caption: 'Этапы маршрута',
          head: ['Этап', 'Что происходит', 'Срок'],
          rows: [
            ['Склад в Иу', 'приёмка, взвешивание, маркировка, ожидание комплектации партии', '2–5 дней'],
            ['Иу → Урумчи → Хоргос', 'путь по Китаю, экспортное оформление', '5–8 дней'],
            ['Хоргос → Алматы → Шымкент', 'транзит по Казахстану', '3–5 дней'],
            ['Яллама → склад в Ташкенте', 'импортное таможенное оформление, разгрузка', '2–5 дней'],
          ],
          note: 'Срок считается со дня отправки со склада в Китае. Очереди на границе и праздники могут добавить несколько дней.',
        },
        callout: {
          title: 'Сезонные задержки',
          text: 'Китайский Новый год (конец января – февраль), «золотая неделя» 1–7 октября и недели после распродажи 11.11 удлиняют путь на 7–10 дней. Склад в Иу прекращает приём за неделю до Нового года — планируйте партию заранее.',
          tone: 'warn',
        },
      },
      {
        heading: 'Как проходит процесс?',
        body: [
          'Знать китайский не нужно — наши сотрудники в Иу сами общаются с поставщиком. От вас нужны только данные о товаре и решение.',
        ],
        steps: [
          { title: 'Оставляете заявку', text: 'В Telegram или по телефону называете товар, примерный вес и объём. Мы считаем ориентировочную цену по плотности.' },
          { title: 'Получаете адрес склада', text: 'Вы получаете адрес склада в Иу и личный код. Поставщик или продавец на 1688/Taobao отправляет товар на этот адрес.' },
          { title: 'Принимаем груз', text: 'На складе взвешиваем и обмеряем каждое место, маркируем вашим кодом и отправляем фотоотчёт. По желанию вскрываем, проверяем и переупаковываем.' },
          { title: 'Консолидация и отправка', text: 'Груз идёт в ближайшую партию. Вы получаете номер партии и код груза; со дня отправки начинается отсчёт срока.' },
          { title: 'Дорога и таможня', text: 'Менеджер сообщает, где находится груз, на каждом этапе. Оформление в Хоргосе и Ялламе проходит под документы компании.' },
          { title: 'Получаете в Ташкенте', text: 'Груз приходит на склад в Ташкенте. Вы закрываете оплату и забираете груз, либо мы доставляем до двери; доставку в регионы согласуем отдельно.' },
        ],
      },
      {
        heading: 'Что входит в цену, а что оплачивается отдельно?',
        body: [
          'Цена за килограмм или кубометр — это полная услуга от склада в Иу до склада в Ташкенте. В неё входят:',
        ],
        bullets: [
          'Приёмка, взвешивание, обмер и маркировка на складе в Иу',
          'Консолидация — размещение в партии и погрузка',
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
            ['Переупаковка (уменьшение объёма, усиление)', '0,4 $/кг'],
            ['Проверка товара (количество, цвет, дефекты)', '1 $/кг'],
            ['Страхование', '1% от заявленной стоимости'],
            ['Доставка до двери по Ташкенту', '20 000–30 000 сум, от 5 кг бесплатно'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. При импорте на вашу фирму пошлина и НДС 12% считаются отдельно по коду ТН ВЭД.',
        },
      },
      {
        heading: 'Что нельзя привезти?',
        body: ['В сборном грузе не принимаем:'],
        bullets: [
          'Взрывчатые, горючие и ядовитые вещества, баллоны под давлением',
          'Растения, семена, живых животных и скоропортящиеся продукты',
          'Деньги, драгоценные металлы и камни, ювелирные изделия, антиквариат',
          'Платёжные средства, ценные бумаги, документы',
          'Лекарства в коммерческих объёмах, наркотические и психотропные вещества',
          'Дроны, рации и радиооборудование, требующее разрешения',
          'Оружие и его части, контрафактную брендовую продукцию',
          'Всё, что запрещено законами Узбекистана и Китая',
        ],
        callout: {
          title: 'Нельзя авиа — можно авто',
          text: 'Технику с литиевыми батареями, пауэрбанки, магниты, жидкости и косметику авиа карго не принимает, а авто карго — принимает. Предупредите о таком товаре заранее: его упаковывают отдельно.',
          tone: 'info',
        },
      },
      {
        heading: 'Какие документы нужны?',
        body: [
          'Сборный груз оформляется под документы компании: от вас отдельные документы для таможни не требуются, но наименование, количество и стоимость товара должны быть указаны верно — по этим данным заполняется декларация. Таможенное оформление — документы и декларация — входит в тариф; пошлина и НДС считаются отдельно по коду ТН ВЭД. «Без пошлин» мы не обещаем.',
          'Если хотите ввезти товар официально на свою фирму или ИП, мы работаем как экспедитор и декларант. Тогда понадобятся:',
        ],
        bullets: [
          'Внешнеторговый контракт, зарегистрированный в E-Contract (ЕЭИСВО)',
          'Инвойс и упаковочный лист',
          'CMR — автомобильная накладная, сертификат происхождения',
          'Десятизначный код ТН ВЭД на каждый товар',
          'Сертификат соответствия или заключение СЭС — в зависимости от товара',
        ],
        callout: {
          title: 'Совет менеджера',
          text: 'Попросите поставщика писать на каждой коробке ваш код и название товара — на складе груз найдут быстро и ничего не перепутают. Если отправлять тяжёлые и лёгкие товары одной партией, общая плотность растёт и расчёт по килограммам чаще выходит дешевле.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'Сколько стоит 1 кг авто карго из Китая?',
        a: 'Ориентировочно 6,5–7,5 $/кг в зависимости от веса партии; плотный оптовый груз от 100 кг — от 3,5 $/кг. Цены обновлены 8 сентября 2026 г. и являются ориентировочными: итоговая сумма определяется после взвешивания на складе в Иу.',
      },
      {
        q: 'Сколько дней идёт сборный груз?',
        a: 'Ориентировочно 15–25 дней от отправки со склада в Китае до Ташкента. Рекордные партии доходили за 12–13 дней; в китайский Новый год и октябрьские праздники путь может удлиниться на неделю.',
      },
      {
        q: 'Есть ли минимальный вес или объём?',
        a: 'Нет, принимаем от 1 кг или 0,1 м³. Небольшие партии считаются по килограммам, объёмный груз — по кубометрам начиная с 0,1 м³.',
      },
      {
        q: 'Что такое объёмный вес и когда он применяется?',
        a: 'Объёмный вес — это длина × ширина × высота коробки (см) ÷ 6 000. Если фактический вес меньше, платите за объёмный. Для партий свыше 100 кг действует правило плотности: груз плотнее 170 кг/м³ считается по кг, легче — по м³.',
      },
      {
        q: 'А если мой товар в Гуанчжоу или другом городе?',
        a: 'Принимаем: поставщик отправляет груз на склад в Иу внутрикитайской доставкой (обычно 1–3 дня) либо мы забираем его через партнёрский склад. Стоимость доставки внутри Китая согласуется с продавцом.',
      },
      {
        q: 'Что будет, если груз потеряется или повредится?',
        a: 'По застрахованному грузу возмещается заявленная стоимость; страховка — 1% от стоимости. Каждое место фотографируется при приёмке, а условия ответственности прописаны в договоре — договор заключаем даже на небольшой груз.',
      },
      {
        q: 'Таможенные платежи входят в цену?',
        a: 'Да, в тариф сборного груза включено таможенное оформление под документы компании. Если ввозите товар на свою фирму, пошлина и НДС 12% считаются отдельно по коду ТН ВЭД — мы рассчитаем их заранее.',
      },
      {
        q: 'Когда и как оплачивать?',
        a: 'Счёт закрывается, когда груз пришёл на склад в Ташкенте, перед выдачей; цена согласуется в долларах, оплата в сумах — наличными, картой или по счёту для юридических лиц. Точный порядок указан в договоре.',
      },
    ],
    related: ['warehouse', 'customs', 'air'],
    guideKeys: ['shipping-from-china', 'cargo-pricing', 'routes', 'prohibited-goods'],
    cta: {
      title: 'Добавим ваш груз в ближайшую партию.',
      text: 'Напишите название товара, примерный вес и объём — посчитаем плотность и скажем, что выгоднее: по килограммам или по кубометрам.',
      draft: 'Здравствуйте! Нужна цена на авто карго (сборный груз). Товар: … Вес: … кг. Объём: … м³. Где груз: Иу / …',
    },
    updated: '2026-09-08',
  },

  en: {
    key: 'truck',
    seo: {
      title: 'Truck cargo from China to Tashkent (consolidated) — price and transit time',
      description:
        'Consolidated truck cargo from China to Tashkent: roughly 15–25 days, from $6.50/kg or $110/m³. Receiving at the Yiwu warehouse, consolidation, customs clearance and delivery to the Tashkent warehouse are included.',
    },
    hero: {
      eyebrow: 'Service 01 — Consolidated cargo',
      h1: 'Truck cargo from China to Tashkent (consolidated)',
      intro:
        'Consolidated cargo means we group several clients’ goods at the Yiwu warehouse into one truck or container and drive it through Khorgos to Tashkent. Once dispatched from the warehouse in China, it arrives in roughly 15–25 days. The price depends on density: per kilogram (from $6.50/kg) or per cubic metre (from $110/m³), with a minimum lot of 1 kg or 0.1 m³. No need to rent a whole container.',
      facts: [
        { label: 'Transit from the China warehouse', value: '15–25 days' },
        { label: 'Price per kilogram', value: 'from $6.50/kg' },
        { label: 'Price per cubic metre', value: 'from $110/m³' },
        { label: 'Volumetric weight rule', value: '÷ 6 000' },
      ],
    },
    sections: [
      {
        heading: 'Who is consolidated cargo for?',
        body: [
          'Consolidated cargo (LCL, groupage) is the most common way to bring goods from China. Your shipment is loaded at our Yiwu (义乌) warehouse into one truck or container together with other clients’ goods, so whether you send 1 kg or 10 m³ you pay only for your share. We also receive from Guangzhou, Shenzhen and other cities: the supplier ships to the Yiwu warehouse, or our partners collect it.',
          'It pays off in these cases:',
        ],
        bullets: [
          'Wholesalers (Abu Sahiy, Chorsu, Bek Baraka markets): clothing, footwear, fabrics — dense cargo, usually 200–350 kg/m³, cheaper per kilogram.',
          'Uzum, Yandex Market and Instagram sellers: lots of 20–300 kg every one or two weeks; each order is labelled with its own code.',
          'Manufacturers: spare parts, raw materials, small machinery — from 100 kg the dense-cargo rate applies (from $3.50/kg).',
          'Light, bulky goods (toys, plastics, furniture, household items): density below 170 kg/m³ — billed per cubic metre.',
        ],
      },
      {
        heading: 'How is the price calculated?',
        body: [
          'First we determine the density of your cargo: total weight (kg) divided by total volume (m³). At 170 kg/m³ or more you pay per kilogram; below that, per cubic metre. Either way the quoted price covers the whole journey from the Yiwu warehouse to the Tashkent warehouse.',
          'For small lots (up to 100 kg) the volumetric-weight rule applies: length × width × height (cm) ÷ 6 000. We charge the greater of actual and volumetric weight. The per-kilogram rate falls as the lot grows; the per-cubic-metre rate rises with density — the table shows both scales.',
        ],
        table: {
          caption: 'Truck cargo rates, Yiwu → Tashkent',
          head: ['Cargo type', 'Condition', 'Estimated price'],
          rows: [
            ['Mixed cargo, per kg', 'up to 30 kg', '$7.50/kg'],
            ['Mixed cargo, per kg', '30–100 kg', '$7.00/kg'],
            ['Mixed cargo, per kg', 'over 100 kg', '$6.50/kg'],
            ['Dense wholesale cargo (clothing, fabrics, footwear)', 'from 100 kg, density ≥ 300 kg/m³', 'from $3.50/kg'],
            ['Bulky cargo, per m³', 'density up to 100 kg/m³', '$110/m³'],
            ['Bulky cargo, per m³', '100–200 kg/m³', '$130/m³'],
            ['Bulky cargo, per m³', '200–300 kg/m³', '$150/m³'],
            ['Bulky cargo, per m³', '300–400 kg/m³', '$170/m³'],
            ['Bulky cargo, per m³', 'above 400 kg/m³', '$190/m³'],
          ],
          note: 'Estimates · Updated September 8, 2026. The final amount is fixed after weighing and measuring at the Yiwu warehouse; branded and serial goods are quoted separately.',
        },
        callout: {
          title: 'Example: volumetric weight',
          text: 'A 60 × 40 × 40 cm box is 96,000 cm³; ÷ 6 000 = 16 kg volumetric weight. If the box actually weighs 10 kg, you pay for 16 kg; if it weighs 25 kg, you pay for 25 kg. Enter the dimensions in the calculator and the rule is applied automatically.',
          tone: 'info',
        },
      },
      {
        heading: 'How long does it take, and which route?',
        body: [
          'Roughly 15–25 days from dispatch at the China warehouse to Tashkent. Our fastest loads have arrived in 12–13 days, but we do not promise that as a standard. The route: Yiwu → Xiʼan → Lanzhou → Urumqi → Khorgos (Kazakhstan border) → Almaty → Shymkent → Yallama crossing → Tashkent.',
        ],
        table: {
          caption: 'Stages of the route',
          head: ['Stage', 'What happens', 'Roughly'],
          rows: [
            ['Yiwu warehouse', 'receiving, weighing, labelling, waiting for the load to fill', '2–5 days'],
            ['Yiwu → Urumqi → Khorgos', 'road leg inside China, export clearance', '5–8 days'],
            ['Khorgos → Almaty → Shymkent', 'transit across Kazakhstan', '3–5 days'],
            ['Yallama → Tashkent warehouse', 'import customs clearance, unloading', '2–5 days'],
          ],
          note: 'Transit is counted from the day of dispatch at the China warehouse. Border queues and holidays can add a few days.',
        },
        callout: {
          title: 'Seasonal delays',
          text: 'Chinese New Year (late January – February), Golden Week on October 1–7 and the weeks after the 11.11 sales can stretch the journey by 7–10 days. The Yiwu warehouse stops receiving a week before New Year — plan your load in advance.',
          tone: 'warn',
        },
      },
      {
        heading: 'How does the process work?',
        body: [
          'You do not need Chinese — our staff in Yiwu talk to the supplier themselves. All we need from you is the product details and a decision.',
        ],
        steps: [
          { title: 'You leave a request', text: 'On Telegram or by phone you tell us the product, approximate weight and volume. We estimate the price from the density.' },
          { title: 'You get a warehouse address', text: 'We give you the address of the Yiwu warehouse and your personal code. Your supplier or 1688/Taobao seller ships to that address.' },
          { title: 'We receive the goods', text: 'At the warehouse we weigh and measure every piece, label it with your code and send a photo report. On request we open, inspect and repack.' },
          { title: 'Consolidation and dispatch', text: 'Your cargo joins the next load. You receive the load number and your cargo code; transit time counts from the dispatch date.' },
          { title: 'Road and customs', text: 'Your manager reports where the cargo is at each stage. Clearance at Khorgos and Yallama runs under the company’s documents.' },
          { title: 'You collect in Tashkent', text: 'The cargo arrives at the Tashkent warehouse. You settle the invoice and pick it up, or we deliver to your door; delivery to the regions is arranged separately.' },
        ],
      },
      {
        heading: 'What is included, and what costs extra?',
        body: [
          'The per-kilogram or per-cubic-metre price is the full service from the Yiwu warehouse to the Tashkent warehouse. It includes:',
        ],
        bullets: [
          'Receiving, weighing, measuring and labelling at the Yiwu warehouse',
          'Consolidation — placing in the load and loading',
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
            ['Repacking (reducing volume, reinforcing)', '$0.40/kg'],
            ['Goods inspection (quantity, colour, defects)', '$1/kg'],
            ['Insurance', '1% of declared value'],
            ['Door delivery in Tashkent', 'UZS 20,000–30,000, free from 5 kg'],
          ],
          note: 'Estimates · Updated September 8, 2026. If you import under your own company, duty and 12% VAT are calculated separately by HS code.',
        },
      },
      {
        heading: 'What cannot be shipped?',
        body: ['We do not accept the following in consolidated cargo:'],
        bullets: [
          'Explosive, flammable and toxic substances, pressurised cylinders',
          'Plants, seeds, live animals and perishable food',
          'Cash, precious metals and stones, jewellery, antiques',
          'Means of payment, securities, documents',
          'Medicines in commercial quantities, narcotic and psychotropic substances',
          'Drones, walkie-talkies and radio equipment that needs a permit',
          'Weapons and their parts, counterfeit branded goods',
          'Anything else prohibited by the laws of Uzbekistan or China',
        ],
        callout: {
          title: 'Not by air — but fine by truck',
          text: 'Devices with lithium batteries, power banks, magnets, liquids and cosmetics are refused by air cargo but accepted by truck. Tell us about such goods in advance — they are packed separately.',
          tone: 'info',
        },
      },
      {
        heading: 'Which documents are needed?',
        body: [
          'Consolidated cargo is cleared under the company’s documents: you do not need to supply customs paperwork, but the product name, quantity and value must be stated correctly — the declaration is filled in from that data. Customs clearance — documents and the declaration — is included in the rate; duty and VAT are calculated separately by HS code. We never promise “no duties”.',
          'If you want to import officially under your own company or sole proprietorship, we act as forwarder and declarant. In that case you will need:',
        ],
        bullets: [
          'A foreign-trade contract registered in E-Contract (EEISVO)',
          'Invoice and packing list',
          'CMR road consignment note and certificate of origin',
          'A 10-digit HS (TN VED) code for every product',
          'A conformity certificate or SES conclusion, depending on the goods',
        ],
        callout: {
          title: 'Manager’s tip',
          text: 'Ask the supplier to write your code and the product name on every box — the warehouse finds your cargo fast and nothing gets mixed up. Sending heavy and light goods in the same lot raises the overall density, and per-kilogram billing often comes out cheaper.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'How much is 1 kg of truck cargo from China?',
        a: 'Roughly $6.50–7.50/kg depending on the lot weight; dense wholesale cargo over 100 kg from $3.50/kg. Prices were updated on September 8, 2026 and are estimates — the final amount is fixed after weighing at the Yiwu warehouse.',
      },
      {
        q: 'How many days does consolidated cargo take?',
        a: 'Roughly 15–25 days from dispatch at the China warehouse to Tashkent. Our fastest loads arrived in 12–13 days; around Chinese New Year and the October holidays the journey can stretch by a week.',
      },
      {
        q: 'Is there a minimum weight or volume?',
        a: 'No, we accept from 1 kg or 0.1 m³. Small lots are billed per kilogram; bulky cargo is billed per cubic metre from 0.1 m³.',
      },
      {
        q: 'What is volumetric weight and when does it apply?',
        a: 'Volumetric weight is the box’s length × width × height (cm) ÷ 6 000. If the actual weight is lower, you pay for the volumetric weight. For lots over 100 kg the density rule applies: cargo denser than 170 kg/m³ is billed per kg, lighter cargo per m³.',
      },
      {
        q: 'What if my goods are in Guangzhou or another city?',
        a: 'We accept them: the supplier ships to the Yiwu warehouse by domestic delivery (usually 1–3 days), or we collect through a partner warehouse. The cost of delivery inside China is agreed with the seller.',
      },
      {
        q: 'What happens if the cargo is lost or damaged?',
        a: 'Insured cargo is compensated at its declared value; insurance costs 1% of that value. Every piece is photographed at receiving, and liability terms are written into the contract — we sign a contract even for small shipments.',
      },
      {
        q: 'Are customs payments included in the price?',
        a: 'Yes, the consolidated-cargo rate includes customs clearance under the company’s documents. If you import under your own company, duty and 12% VAT are calculated separately by HS code — we work them out for you in advance.',
      },
      {
        q: 'When and how do I pay?',
        a: 'You settle when the cargo has arrived at the Tashkent warehouse, before pick-up; the price is agreed in US dollars and paid in soums — cash, card, or by invoice for companies. The exact terms are set out in the contract.',
      },
    ],
    related: ['warehouse', 'customs', 'air'],
    guideKeys: ['shipping-from-china', 'cargo-pricing', 'routes', 'prohibited-goods'],
    cta: {
      title: 'We will put your cargo on the next load.',
      text: 'Send the product name, approximate weight and volume — we will work out the density and tell you whether per-kilogram or per-cubic-metre billing is cheaper.',
      draft: 'Hello! I need a quote for truck cargo (consolidated). Product: … Weight: … kg. Volume: … m³. Cargo location: Yiwu / …',
    },
    updated: '2026-09-08',
  },
};

export default content;
