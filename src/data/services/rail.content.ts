import type { ServiceContentByLang } from './types';

/**
 * Temir yoʻl va konteyner (FCL / LCL) — long-form page content.
 * Figures mirror src/data/tariffs.json (updated 2026-09-08): 20ft 2 800–5 500 $, 40ft 5 200–6 800 $,
 * 20–35 days; LCL in a container uses the truck m³ scale (110–190 $/m³ by density, min 0,1 m³);
 * extras 1 $/kg inspection, 1% insurance. Container capacities (20ft ≈ 33 m³, 40HC ≈ 76 m³) are
 * ISO standard values. Keep in sync when tariffs change.
 */
const content: ServiceContentByLang = {
  uz: {
    key: 'rail',
    seo: {
      title: 'Xitoydan Toshkentga temir yoʻl va konteyner tashish — 20 va 40 fut narxi',
      description:
        'Xitoydan Toshkentga temir yoʻl orqali konteyner: 20 fut 2 800 $ dan, 40 fut 5 200 $ dan, taxminan 20–35 kun. FCL — butun konteyner, LCL — konteynerdagi joy 0,1 m³ dan. Doʻstiq va Oltinkoʻl orqali, hujjatlar va bojxona bilan.',
    },
    hero: {
      eyebrow: 'Xizmat 03 — Temir yoʻl va konteyner',
      h1: 'Xitoydan Toshkentga temir yoʻl va konteyner tashish',
      intro:
        'Temir yoʻl — katta va ogʻir partiyalar uchun eng tejamli yoʻl. 20 futlik konteyner Xitoydan Toshkentgacha taxminan 2 800–5 500 $, 40 futlik — 5 200–6 800 $; yuk stansiyadan joʻnatilgach, taxminan 20–35 kunda keladi. Butun konteyner (FCL) yoki konteynerdagi joy (LCL, 0,1 m³ dan) — ikkalasi ham Doʻstiq (Dostiq) yoki Oltinkoʻl (Altinkoʻl) orqali Qozogʻiston temir yoʻli bilan Toshkentga keladi.',
      facts: [
        { label: 'Muddat, stansiyadan', value: '20–35 kun' },
        { label: '20 futlik konteyner', value: '2 800 $ dan' },
        { label: '40 futlik konteyner', value: '5 200 $ dan' },
        { label: 'LCL — konteynerdagi joy', value: '0,1 m³ dan' },
      ],
    },
    sections: [
      {
        heading: 'Temir yoʻl kimga toʻgʻri keladi?',
        body: [
          'Temir yoʻl fura bilan raqobat qilmaydi — uni toʻldiradi. Yuk 10 m³ dan oshsa, shoshilinch boʻlmasa va ogʻir boʻlsa, konteyner 1 kg yoki 1 m³ hisobida avtodan arzon chiqadi. Temir yoʻl ob-havoga bogʻliq emas, Xorgosdagi fura navbatlaridan oʻtib ketadi va bitta konteynerga 20 tonnagacha yuk sigʻadi.',
          'Odatda temir yoʻl orqali quyidagilar keladi:',
        ],
        bullets: [
          'Ishlab chiqarish uchun uskunalar, dastgohlar va ularning butlovchi qismlari — ogʻir, shoshilinch emas.',
          'Xomashyo va materiallar: gazlama, plastmassa granulalar, qogʻoz, kimyoviy mahsulotlar (ruxsat etilgan), metall buyumlar.',
          'Qurilish mollari: kafel, santexnika, eshik-derazalar, LED yoritgichlar, kabel.',
          'Mebel va uy-roʻzgʻor texnikasi — hajmli yuk, konteynerda m³ hisobida arzon.',
          'Muntazam import qiluvchi ulgurjichilar: oyiga bir konteyner — narx va muddat oldindan maʼlum.',
        ],
        callout: {
          title: 'FCL va LCL nima?',
          text: 'FCL (Full Container Load) — butun konteyner faqat yukingiz uchun; narx konteyner boʻyicha. LCL (Less than Container Load) — konteynerdagi joy: yukingiz boshqa mijozlarning yuki bilan bitta konteynerda boradi, narx m³ hisobida, 0,1 m³ dan. 10–12 m³ dan oshsa, koʻpincha FCL arzon chiqadi.',
          tone: 'info',
        },
      },
      {
        heading: 'Konteyner narxi qanday hisoblanadi?',
        body: [
          'FCL narxi konteyner turi (20 fut, 40 fut yoki 40 HC), joʻnatish stansiyasi, yukning ogʻirligi va mavsumga bogʻliq. Xitoyning sharqiy shaharlaridan (Ivu, Shanxay, Guanchjou) uzoqroq, Urumchidan yaqinroq. Narx diapazoni keng, chunki temir yoʻl stavkalari har oy oʻzgaradi — yakuniy narxni soʻrov boʻyicha 1–2 kunda aytamiz.',
          'LCL narxi avto kargodagi kabi zichlik boʻyicha m³ hisobida chiqadi: zichlik qancha yuqori boʻlsa, 1 m³ shuncha qimmat, lekin 1 kg shuncha arzon. 0,1 m³ dan qabul qilamiz.',
        ],
        table: {
          caption: 'Temir yoʻl tariflari, Xitoy → Toshkent',
          head: ['Variant', 'Sigʻimi', 'Taxminiy narx'],
          rows: [
            ['20 futlik konteyner (FCL)', '≈ 33 m³, 20 t gacha', '2 800–5 500 $'],
            ['40 futlik / 40 HC konteyner (FCL)', '≈ 67–76 m³, 26 t gacha', '5 200–6 800 $'],
            ['LCL, zichlik 100 kg/m³ gacha', 'konteynerdagi joy', '110 $/m³ dan'],
            ['LCL, zichlik 100–200 kg/m³', 'konteynerdagi joy', '130 $/m³ dan'],
            ['LCL, zichlik 200 kg/m³ dan yuqori', 'konteynerdagi joy', '150 $/m³ dan'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. FCL narxi stansiyadan Toshkent terminaligacha; bojxona toʻlovlari, terminaldan omborgacha avto va sugʻurta alohida. LCL narxiga bojxona rasmiylashtiruvi kompaniya hujjatlari bilan kiradi.',
        },
        callout: {
          title: 'Misol: 40 HC konteyner mebel',
          text: '70 m³ mebel, 9 tonna. FCL: taxminan 5 200–6 800 $ — 1 m³ uchun 75–97 $. Xuddi shu yukni avto yigʻma yuk bilan yuborsangiz, 130 $/m³ dan 9 100 $ chiqadi. Farq 2 000 $ dan ortiq; evaziga 1–2 hafta koʻproq kutasiz.',
          tone: 'info',
        },
      },
      {
        heading: 'Necha kunda keladi va qaysi yoʻldan?',
        body: [
          'Konteyner Xitoy stansiyasidan joʻnatilgach, Toshkentga taxminan 20–35 kunda keladi. Yoʻl: Ivu / Shanxay / Guanchjou → Urumchi → Alashankou–Doʻstiq yoki Xorgos–Oltinkoʻl chegara stansiyalari → Qozogʻiston temir yoʻli → Saryagash → Toshkent. Xitoy temir yoʻli izi 1 435 mm, Qozogʻiston va Oʻzbekistonda 1 520 mm — shuning uchun chegarada konteyner boshqa platformaga qayta yuklanadi; bu 2–7 kun oladi.',
        ],
        table: {
          caption: 'Temir yoʻlning bosqichlari',
          head: ['Bosqich', 'Nima boʻladi', 'Taxminiy vaqt'],
          rows: [
            ['Xitoy stansiyasi', 'konteynerga yuklash, plombalash, eksport rasmiylashtiruvi, poyezd kutish', '3–7 kun'],
            ['Xitoy ichida → Urumchi → chegara', 'temir yoʻl, 3 500–4 000 km', '5–8 kun'],
            ['Doʻstiq / Oltinkoʻl', '1435 → 1 520 mm platformaga qayta yuklash, tranzit hujjatlari', '2–7 kun'],
            ['Qozogʻiston boʻylab → Saryagash', 'tranzit', '5–8 kun'],
            ['Saryagash → Toshkent terminali', 'import bojxona rasmiylashtiruvi, tushirish', '3–5 kun'],
          ],
          note: 'Muddat konteyner stansiyadan joʻnatilgan kundan hisoblanadi. Doʻstiqdagi navbat mavsumga qarab bir haftagacha choʻzilishi mumkin.',
        },
        callout: {
          title: 'Qaysi chegara — Doʻstiq yoki Oltinkoʻl?',
          text: 'Ikkalasi ham Qozogʻiston bilan chegara: Alashankou–Doʻstiq eski va yirik oʻtish, Xorgos–Oltinkoʻl yangiroq va kengaytirilmoqda. Qaysi biri boʻsh boʻlsa, poyezd shu yerdan oʻtadi — buni temir yoʻl operatori belgilaydi. Xitoy–Qirgʻiziston–Oʻzbekiston temir yoʻli hali qurilmoqda va ishlamaydi.',
          tone: 'warn',
        },
      },
      {
        heading: 'Jarayon qanday boʻladi?',
        body: [
          'Konteyner tashishda hujjatlar avto yigʻma yukdagidan koʻproq, shuning uchun jarayon soʻrovdan boshlab menejer bilan birga yuradi.',
        ],
        steps: [
          { title: 'Soʻrov qoldirasiz', text: 'Tovar nomi, umumiy ogʻirlik va hajm, yetkazib beruvchining shahri. Shunga qarab FCL yoki LCL, 20 yoki 40 futlik konteyner tavsiya qilamiz va 1–2 kunda narx aytamiz.' },
          { title: 'Shartnoma va hujjatlar', text: 'Narx, muddat va javobgarlik shartnomada yoziladi. Oʻz firmangizga import qilsangiz, tashqi savdo shartnomasi E-Contract tizimida roʻyxatdan oʻtkaziladi.' },
          { title: 'Yuklash Xitoyda', text: 'FCL: konteyner zavodga yoki stansiyaga beriladi, yuk yuklanib plombalanadi; xohlasangiz Ivudagi xodimlarimiz yuklashni nazorat qilib, foto-hisobot yuboradi. LCL: yuk Ivu omboriga keladi va konteynerga jamlanadi.' },
          { title: 'Yoʻlda kuzatuv', text: 'Sizga konteyner raqami beriladi. Menejer poyezdning chegaradan oʻtishi va Qozogʻiston boʻylab harakatini xabar qilib boradi.' },
          { title: 'Bojxona va tushirish', text: 'Toshkent terminalida deklaratsiya beriladi, boj va QQS toʻlanadi (oʻz firmangizga import boʻlsa), konteyner ochiladi. Yukni terminaldan omboringizgacha avto bilan yetkazamiz.' },
          { title: 'Konteynerni qaytarish', text: 'Boʻsh konteyner belgilangan muddatda operatorga qaytariladi — kechiksa, kunlik toʻlov (demurrage) hisoblanadi. Tushirishni oldindan rejalashtiramiz.' },
        ],
      },
      {
        heading: 'Narxga nimalar kiradi va nimalar alohida toʻlanadi?',
        body: [
          'FCL narxi — Xitoy stansiyasidan Toshkent terminaligacha boʻlgan temir yoʻl xizmati. Unga kiradi:',
        ],
        bullets: [
          'Konteyner ijarasi va uni joʻnatish stansiyasiga berish',
          'Xitoy ichida temir yoʻl, chegarada platformaga qayta yuklash, Qozogʻiston boʻylab tranzit',
          'SMGS temir yoʻl yuk xati va tranzit hujjatlari',
          'Toshkent terminalida qabul va belgilangan muddat ichida saqlash',
          'Konteyner raqami boʻyicha holat xabarlari va menejer bilan aloqa',
        ],
        table: {
          caption: 'Alohida toʻlanadi',
          head: ['Xizmat', 'Taxminiy narx'],
          rows: [
            ['Zavoddan stansiyagacha avto (Xitoyda)', 'shahar va masofaga qarab'],
            ['Bojxona rasmiylashtiruvi oʻz firmangizga: boj, 12% QQS, yigʻim', 'TN VED kodi boʻyicha hisoblab beramiz'],
            ['Terminaldan omboringizgacha avto (Toshkent)', 'masofaga qarab'],
            ['Yuklashda tekshirish va foto-hisobot', '1 $/kg dan, kelishuv boʻyicha'],
            ['Sugʻurta', 'eʼlon qilingan qiymatning 1%'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. LCL yukda bojxona rasmiylashtiruvi kompaniya hujjatlari bilan narxga kiradi, avto yigʻma yukdagi kabi.',
        },
      },
      {
        heading: 'Nimalarni yuborib boʻlmaydi?',
        body: ['Konteynerda ham universal taqiqlar amal qiladi:'],
        bullets: [
          'Portlovchi, yonuvchi va zaharli moddalar, bosim ostidagi ballonlar (xavfli yuk sinfi alohida rasmiylashtiriladi)',
          'Oʻsimlik, urugʻ, tirik hayvon va tez buziladigan oziq-ovqat — fitosanitariya va veterinariya ruxsatisiz',
          'Pul, qimmatbaho metall va toshlar, zargarlik va antiqa buyumlar',
          'Toʻlov vositalari, qimmatli qogʻozlar, hujjatlar',
          'Dori-darmon davlat roʻyxatidan oʻtmagan, narkotik va psixotrop moddalar',
          'Dronlar, ratsiya va ruxsatnoma talab qiladigan radiouskunalar',
          'Qurol va uning qismlari, kontrafakt brend mahsulotlar',
          'Oʻzbekiston, Qozogʻiston va Xitoy qonunlari bilan taqiqlangan boshqa narsalar',
        ],
        callout: {
          title: 'Batareya va suyuqlik — konteynerda mumkin',
          text: 'Aviaga olinmaydigan litiy batareyali texnika, suyuqlik, kosmetika va magnitlar temir yoʻl konteynerida qabul qilinadi — toʻgʻri qadoqlash va hujjat bilan. Tarkibini oldindan ayting: xavfli yuk sinfiga kirsa, alohida rasmiylashtiruv kerak.',
          tone: 'info',
        },
      },
      {
        heading: 'Qanday hujjatlar kerak?',
        body: [
          'Butun konteyner odatda oʻz firmangiz yoki YaTT nomiga rasmiy import qilinadi — bu tovarni GTD bilan sotish, tender va marketpleyslarga chiqish imkonini beradi. Biz ekspeditor va deklarant sifatida hujjatlarni tayyorlaymiz, boj va QQSni oldindan hisoblab beramiz. «Bojsiz» yoki «hujjatsiz» degan vaʼda bermaymiz.',
          'Kerak boʻladigan hujjatlar:',
        ],
        bullets: [
          'E-Contract (EEISVO) tizimida roʻyxatdan oʻtgan tashqi savdo shartnomasi',
          'Invoys va qadoqlash roʻyxati (packing list)',
          'SMGS — temir yoʻl yuk xati, konteyner raqami va plomba raqami bilan',
          'Kelib chiqish sertifikati va har bir tovar uchun 10 xonali TN VED kodi',
          'Tovar turiga qarab muvofiqlik sertifikati yoki SES xulosasi; uskunalar uchun texnik pasport',
        ],
        callout: {
          title: 'Menejer maslahati',
          text: 'Konteynerni toʻldirishda ogʻir yukni pastga, yengilini ustiga joylang va 20 futlikda 20 tonnadan oshmang — ortiqcha vazn chegarada muammo chiqaradi. Aralash tovarli konteynerda har bir tovar uchun TN VED kodini oldindan aniqlab qoʻysangiz, Toshkentda bojxona bir necha kunga tezlashadi.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'Xitoydan Toshkentga 20 futlik konteyner necha pul?',
        a: 'Taxminan 2 800–5 500 $, 40 futlik — 5 200–6 800 $, stansiya va mavsumga qarab. Narxlar 2026-yil 8-sentabrda yangilangan va taxminiy; aniq narxni soʻrov boʻyicha 1–2 kunda aytamiz.',
      },
      {
        q: 'Temir yoʻl orqali yuk necha kunda keladi?',
        a: 'Taxminan 20–35 kun — konteyner Xitoy stansiyasidan joʻnatilgan kundan Toshkentgacha. Chegarada qayta yuklash va Doʻstiqdagi navbat 2–7 kun oladi; Xitoy Yangi yili va oktabr bayramlarida muddat choʻziladi.',
      },
      {
        q: 'FCL va LCL nima?',
        a: 'FCL — butun konteyner faqat yukingiz uchun, narx konteyner boʻyicha. LCL — konteynerdagi joy, boshqa mijozlar bilan birga, narx m³ hisobida 0,1 m³ dan. Yuk 10–12 m³ dan oshsa, FCL odatda arzon chiqadi.',
      },
      {
        q: 'Konteynerga qancha yuk sigʻadi?',
        a: '20 futlik konteyner — taxminan 33 m³ va 20 tonnagacha, 40 futlik — 67 m³, 40 HC — 76 m³ va 26 tonnagacha. Ogʻir yuk (kafel, metall) uchun 20 fut, hajmli yuk (mebel, texnika) uchun 40 HC maʼqul.',
      },
      {
        q: 'Qaysi chegaradan oʻtadi?',
        a: 'Qozogʻiston orqali: Alashankou–Doʻstiq yoki Xorgos–Oltinkoʻl stansiyalari, keyin Saryagash orqali Toshkent. Chegarada Xitoyning 1 435 mm izidan 1 520 mm ga qayta yuklanadi.',
      },
      {
        q: 'Xitoy–Qirgʻiziston–Oʻzbekiston temir yoʻli ishlayaptimi?',
        a: 'Yoʻq, u hali qurilmoqda va 2026-yilda yuk tashimaydi. Hozir barcha temir yoʻl yuklari Qozogʻiston orqali keladi; Qirgʻiziston orqali faqat avto yoʻl (Irkeshtam / Torugart → Oʻsh → Andijon) ishlaydi.',
      },
      {
        q: 'Temir yoʻl avtodan arzonmi?',
        a: 'Katta partiyada — ha: 40 HC konteyner mebel uchun 1 m³ taxminan 75–97 $ chiqadi, avto yigʻma yukda esa 130 $/m³ dan. Kichik partiyada (10 m³ gacha) farq kam, avto esa 1–2 hafta tezroq.',
      },
      {
        q: 'Bojxona toʻlovlari narxga kiradimi?',
        a: 'FCL narxiga kirmaydi: butun konteyner oʻz firmangiz nomiga import qilinadi, boj va 12% QQS TN VED kodi boʻyicha alohida toʻlanadi — biz oldindan hisoblab beramiz. LCL yukda esa rasmiylashtiruv kompaniya hujjatlari bilan narxga kiradi.',
      },
    ],
    related: ['truck', 'equipment', 'customs'],
    guideKeys: ['air-vs-truck-vs-rail', 'routes', 'customs-2026', 'shipping-from-china'],
    cta: {
      title: 'Keyingi konteyneringizni hisoblaymiz.',
      text: 'Tovar nomi, umumiy ogʻirlik, hajm va yetkazib beruvchining shahrini yozing — FCL yoki LCL qaysi biri arzon chiqishini va aniq narxni 1–2 kunda aytamiz.',
      draft: 'Assalomu alaykum! Temir yoʻl / konteyner boʻyicha narx kerak. Tovar: … Ogʻirlik: … t. Hajm: … m³. Yetkazib beruvchi shahri: … Konteyner: 20 / 40 fut / LCL',
    },
    updated: '2026-09-08',
  },

  ru: {
    key: 'rail',
    seo: {
      title: 'Ж/д и контейнерные перевозки из Китая в Ташкент — цена 20 и 40 футов',
      description:
        'Контейнер из Китая в Ташкент по железной дороге: 20 футов от 2 800 $, 40 футов от 5 200 $, ориентировочно 20–35 дней. FCL — целый контейнер, LCL — место в контейнере от 0,1 м³. Через Достык и Алтынколь, с документами и таможней.',
    },
    hero: {
      eyebrow: 'Услуга 03 — Ж/д и контейнеры',
      h1: 'Ж/д и контейнерные перевозки из Китая в Ташкент',
      intro:
        'Железная дорога — самый экономичный путь для крупных и тяжёлых партий. 20-футовый контейнер из Китая до Ташкента стоит ориентировочно 2 800–5 500 $, 40-футовый — 5 200–6 800 $; после отправки со станции груз идёт ориентировочно 20–35 дней. Целый контейнер (FCL) или место в контейнере (LCL, от 0,1 м³) — оба варианта идут через Достык или Алтынколь по казахстанской железной дороге в Ташкент.',
      facts: [
        { label: 'Срок от станции', value: '20–35 дней' },
        { label: 'Контейнер 20 футов', value: 'от 2 800 $' },
        { label: 'Контейнер 40 футов', value: 'от 5 200 $' },
        { label: 'LCL — место в контейнере', value: 'от 0,1 м³' },
      ],
    },
    sections: [
      {
        heading: 'Кому подходит железная дорога?',
        body: [
          'Железная дорога не конкурирует с фурой — она её дополняет. Если груза больше 10 м³, он тяжёлый и не срочный, контейнер выходит дешевле авто в расчёте на килограмм или кубометр. Ж/д не зависит от погоды, обходит очереди фур на Хоргосе, а в один контейнер помещается до 20 тонн.',
          'По железной дороге обычно везут:',
        ],
        bullets: [
          'Оборудование, станки и комплектующие для производства — тяжёлые и не срочные.',
          'Сырьё и материалы: ткани, пластиковые гранулы, бумагу, разрешённую химию, металлоизделия.',
          'Стройматериалы: плитку, сантехнику, двери и окна, LED-светильники, кабель.',
          'Мебель и бытовую технику — объёмный груз, в контейнере по кубометрам дешевле.',
          'Регулярный опт: контейнер в месяц — цена и срок известны заранее.',
        ],
        callout: {
          title: 'Что такое FCL и LCL?',
          text: 'FCL (Full Container Load) — целый контейнер только под ваш груз; цена за контейнер. LCL (Less than Container Load) — место в контейнере: ваш груз едет вместе с грузами других клиентов, цена по кубометрам, от 0,1 м³. От 10–12 м³ FCL чаще выходит дешевле.',
          tone: 'info',
        },
      },
      {
        heading: 'Как считается цена контейнера?',
        body: [
          'Цена FCL зависит от типа контейнера (20 футов, 40 футов или 40 HC), станции отправления, веса груза и сезона. Из восточных городов Китая (Иу, Шанхай, Гуанчжоу) дороже, из Урумчи — дешевле. Диапазон широкий, потому что ж/д ставки меняются каждый месяц — точную цену называем по запросу за 1–2 дня.',
          'Цена LCL считается, как в авто карго, по кубометрам в зависимости от плотности: чем выше плотность, тем дороже кубометр, но дешевле килограмм. Принимаем от 0,1 м³.',
        ],
        table: {
          caption: 'Тарифы ж/д, Китай → Ташкент',
          head: ['Вариант', 'Вместимость', 'Ориентировочная цена'],
          rows: [
            ['Контейнер 20 футов (FCL)', '≈ 33 м³, до 20 т', '2 800–5 500 $'],
            ['Контейнер 40 футов / 40 HC (FCL)', '≈ 67–76 м³, до 26 т', '5 200–6 800 $'],
            ['LCL, плотность до 100 кг/м³', 'место в контейнере', 'от 110 $/м³'],
            ['LCL, плотность 100–200 кг/м³', 'место в контейнере', 'от 130 $/м³'],
            ['LCL, плотность выше 200 кг/м³', 'место в контейнере', 'от 150 $/м³'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. Цена FCL — от станции до терминала в Ташкенте; таможенные платежи, автодоставка с терминала и страховка отдельно. В цену LCL входит таможенное оформление под документы компании.',
        },
        callout: {
          title: 'Пример: 40 HC с мебелью',
          text: '70 м³ мебели, 9 тонн. FCL: ориентировочно 5 200–6 800 $ — 75–97 $ за кубометр. Тот же груз авто сборным грузом от 130 $/м³ обойдётся в 9 100 $. Разница больше 2 000 $; взамен ждёте на 1–2 недели дольше.',
          tone: 'info',
        },
      },
      {
        heading: 'Сколько дней идёт груз и каким маршрутом?',
        body: [
          'После отправки со станции в Китае контейнер приходит в Ташкент ориентировочно за 20–35 дней. Маршрут: Иу / Шанхай / Гуанчжоу → Урумчи → пограничные станции Алашанькоу–Достык или Хоргос–Алтынколь → казахстанская железная дорога → Сарыагаш → Ташкент. В Китае колея 1 435 мм, в Казахстане и Узбекистане — 1 520 мм, поэтому на границе контейнер перегружают на другую платформу; это занимает 2–7 дней.',
        ],
        table: {
          caption: 'Этапы ж/д маршрута',
          head: ['Этап', 'Что происходит', 'Срок'],
          rows: [
            ['Станция в Китае', 'загрузка контейнера, пломбирование, экспортное оформление, ожидание поезда', '3–7 дней'],
            ['По Китаю → Урумчи → граница', 'железная дорога, 3 500–4 000 км', '5–8 дней'],
            ['Достык / Алтынколь', 'перегрузка с колеи 1435 на 1 520 мм, транзитные документы', '2–7 дней'],
            ['По Казахстану → Сарыагаш', 'транзит', '5–8 дней'],
            ['Сарыагаш → терминал в Ташкенте', 'импортное таможенное оформление, выгрузка', '3–5 дней'],
          ],
          note: 'Срок считается со дня отправки контейнера со станции. Очередь на Достыке в сезон может растянуться до недели.',
        },
        callout: {
          title: 'Какая граница — Достык или Алтынколь?',
          text: 'Обе — с Казахстаном: Алашанькоу–Достык — старый и крупный переход, Хоргос–Алтынколь — новее и расширяется. Поезд идёт через тот, что свободнее, — это решает ж/д оператор. Железная дорога Китай – Кыргызстан – Узбекистан ещё строится и не работает.',
          tone: 'warn',
        },
      },
      {
        heading: 'Как проходит процесс?',
        body: [
          'В контейнерной перевозке документов больше, чем в сборном авто грузе, поэтому процесс с самого запроса идёт вместе с менеджером.',
        ],
        steps: [
          { title: 'Оставляете заявку', text: 'Название товара, общий вес и объём, город поставщика. По этим данным рекомендуем FCL или LCL, 20 или 40 футов и за 1–2 дня называем цену.' },
          { title: 'Договор и документы', text: 'Цена, срок и ответственность прописываются в договоре. При импорте на вашу фирму внешнеторговый контракт регистрируется в E-Contract.' },
          { title: 'Загрузка в Китае', text: 'FCL: контейнер подаётся на завод или станцию, груз загружают и пломбируют; по желанию наши сотрудники в Иу контролируют загрузку и присылают фотоотчёт. LCL: груз приходит на склад в Иу и комплектуется в контейнер.' },
          { title: 'Отслеживание в пути', text: 'Вы получаете номер контейнера. Менеджер сообщает о прохождении границы и движении по Казахстану.' },
          { title: 'Таможня и выгрузка', text: 'На терминале в Ташкенте подаётся декларация, оплачиваются пошлина и НДС (при импорте на вашу фирму), контейнер вскрывается. Доставляем груз с терминала до вашего склада автотранспортом.' },
          { title: 'Возврат контейнера', text: 'Пустой контейнер возвращается оператору в установленный срок — при просрочке начисляется плата за сутки (демередж). Выгрузку планируем заранее.' },
        ],
      },
      {
        heading: 'Что входит в цену, а что оплачивается отдельно?',
        body: [
          'Цена FCL — это железнодорожная услуга от станции в Китае до терминала в Ташкенте. В неё входят:',
        ],
        bullets: [
          'Аренда контейнера и подача на станцию отправления',
          'Ж/д по Китаю, перегрузка на границе, транзит по Казахстану',
          'Накладная СМГС и транзитные документы',
          'Приём на терминале в Ташкенте и хранение в пределах установленного срока',
          'Уведомления о статусе по номеру контейнера и связь с менеджером',
        ],
        table: {
          caption: 'Оплачивается отдельно',
          head: ['Услуга', 'Ориентировочная цена'],
          rows: [
            ['Автодоставка с завода до станции (в Китае)', 'по городу и расстоянию'],
            ['Таможенное оформление на вашу фирму: пошлина, НДС 12%, сбор', 'рассчитаем по коду ТН ВЭД'],
            ['Автодоставка с терминала до вашего склада (Ташкент)', 'по расстоянию'],
            ['Проверка при загрузке и фотоотчёт', 'от 1 $/кг, по договорённости'],
            ['Страхование', '1% от заявленной стоимости'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. Для LCL таможенное оформление под документы компании включено в цену, как в сборном авто грузе.',
        },
      },
      {
        heading: 'Что нельзя отправить?',
        body: ['В контейнере тоже действуют общие запреты:'],
        bullets: [
          'Взрывчатые, горючие и ядовитые вещества, баллоны под давлением (опасные грузы оформляются отдельно)',
          'Растения, семена, живых животных и скоропортящиеся продукты — без фитосанитарного и ветеринарного разрешения',
          'Деньги, драгоценные металлы и камни, ювелирные изделия, антиквариат',
          'Платёжные средства, ценные бумаги, документы',
          'Незарегистрированные лекарства, наркотические и психотропные вещества',
          'Дроны, рации и радиооборудование, требующее разрешения',
          'Оружие и его части, контрафактную брендовую продукцию',
          'Всё, что запрещено законами Узбекистана, Казахстана и Китая',
        ],
        callout: {
          title: 'Батареи и жидкости — в контейнере можно',
          text: 'Технику с литиевыми батареями, жидкости, косметику и магниты, которые не берут на авиа, в ж/д контейнер принимаем — с правильной упаковкой и документами. Скажите состав заранее: если товар относится к опасным грузам, нужно отдельное оформление.',
          tone: 'info',
        },
      },
      {
        heading: 'Какие документы нужны?',
        body: [
          'Целый контейнер обычно ввозится официально на вашу фирму или ИП — это даёт право продавать товар с ГТД, участвовать в тендерах и выходить на маркетплейсы. Мы как экспедитор и декларант готовим документы и заранее считаем пошлину и НДС. «Без пошлин» или «без документов» мы не обещаем.',
          'Понадобятся:',
        ],
        bullets: [
          'Внешнеторговый контракт, зарегистрированный в E-Contract (ЕЭИСВО)',
          'Инвойс и упаковочный лист',
          'Накладная СМГС с номером контейнера и пломбы',
          'Сертификат происхождения и десятизначный код ТН ВЭД на каждый товар',
          'Сертификат соответствия или заключение СЭС — в зависимости от товара; для оборудования — технический паспорт',
        ],
        callout: {
          title: 'Совет менеджера',
          text: 'При загрузке тяжёлое ставьте вниз, лёгкое — сверху, и не превышайте 20 тонн в 20-футовом — перевес создаёт проблемы на границе. Если в контейнере разные товары, определите код ТН ВЭД для каждого заранее: таможня в Ташкенте пройдёт на несколько дней быстрее.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'Сколько стоит 20-футовый контейнер из Китая в Ташкент?',
        a: 'Ориентировочно 2 800–5 500 $, 40-футовый — 5 200–6 800 $, в зависимости от станции и сезона. Цены обновлены 8 сентября 2026 г. и являются ориентировочными; точную цену называем по запросу за 1–2 дня.',
      },
      {
        q: 'Сколько дней идёт груз по железной дороге?',
        a: 'Ориентировочно 20–35 дней от отправки контейнера со станции в Китае до Ташкента. Перегрузка на границе и очередь на Достыке занимают 2–7 дней; в китайский Новый год и октябрьские праздники срок растёт.',
      },
      {
        q: 'Что такое FCL и LCL?',
        a: 'FCL — целый контейнер только под ваш груз, цена за контейнер. LCL — место в контейнере вместе с другими клиентами, цена по кубометрам от 0,1 м³. Если груза больше 10–12 м³, FCL обычно выходит дешевле.',
      },
      {
        q: 'Сколько груза помещается в контейнер?',
        a: '20-футовый — около 33 м³ и до 20 тонн, 40-футовый — 67 м³, 40 HC — 76 м³ и до 26 тонн. Для тяжёлого груза (плитка, металл) подходит 20 футов, для объёмного (мебель, техника) — 40 HC.',
      },
      {
        q: 'Через какую границу идёт груз?',
        a: 'Через Казахстан: станции Алашанькоу–Достык или Хоргос–Алтынколь, дальше через Сарыагаш в Ташкент. На границе контейнер перегружают с китайской колеи 1 435 мм на 1 520 мм.',
      },
      {
        q: 'Работает ли железная дорога Китай – Кыргызстан – Узбекистан?',
        a: 'Нет, она ещё строится и в 2026 году грузы не возит. Сейчас все ж/д грузы идут через Казахстан; через Кыргызстан работает только автодорога (Иркештам / Торугарт → Ош → Андижан).',
      },
      {
        q: 'Железная дорога дешевле авто?',
        a: 'На крупной партии — да: 40 HC с мебелью обходится ориентировочно в 75–97 $ за кубометр, сборный авто груз — от 130 $/м³. На небольшой партии (до 10 м³) разница невелика, а авто на 1–2 недели быстрее.',
      },
      {
        q: 'Таможенные платежи входят в цену?',
        a: 'В цену FCL — нет: целый контейнер ввозится на вашу фирму, пошлина и НДС 12% платятся отдельно по коду ТН ВЭД, мы считаем их заранее. Для LCL таможенное оформление под документы компании включено в цену.',
      },
    ],
    related: ['truck', 'equipment', 'customs'],
    guideKeys: ['air-vs-truck-vs-rail', 'routes', 'customs-2026', 'shipping-from-china'],
    cta: {
      title: 'Посчитаем ваш следующий контейнер.',
      text: 'Напишите название товара, общий вес, объём и город поставщика — скажем, что выгоднее, FCL или LCL, и назовём точную цену за 1–2 дня.',
      draft: 'Здравствуйте! Нужна цена на ж/д / контейнер. Товар: … Вес: … т. Объём: … м³. Город поставщика: … Контейнер: 20 / 40 футов / LCL',
    },
    updated: '2026-09-08',
  },

  en: {
    key: 'rail',
    seo: {
      title: 'Rail and container shipping from China to Tashkent — 20ft and 40ft prices',
      description:
        'Containers from China to Tashkent by rail: 20ft from $2,800, 40ft from $5,200, roughly 20–35 days. FCL is a whole container, LCL is space in a container from 0.1 m³. Via Dostyk and Altynkol, with documents and customs handled.',
    },
    hero: {
      eyebrow: 'Service 03 — Rail & containers',
      h1: 'Rail and container shipping from China to Tashkent',
      intro:
        'Rail is the most economical route for large, heavy consignments. A 20ft container from China to Tashkent costs roughly $2,800–5,500 and a 40ft roughly $5,200–6,800; once dispatched from the station, it arrives in roughly 20–35 days. A whole container (FCL) or space in one (LCL, from 0.1 m³) — both travel through Dostyk or Altynkol on the Kazakh railway to Tashkent.',
      facts: [
        { label: 'Transit from the station', value: '20–35 days' },
        { label: '20ft container', value: 'from $2,800' },
        { label: '40ft container', value: 'from $5,200' },
        { label: 'LCL — space in a container', value: 'from 0.1 m³' },
      ],
    },
    sections: [
      {
        heading: 'Who is rail for?',
        body: [
          'Rail does not compete with the truck — it complements it. When the consignment exceeds 10 m³, is heavy and not urgent, a container beats road per kilogram or per cubic metre. Rail is independent of the weather, bypasses the truck queues at Khorgos, and one container carries up to 20 tonnes.',
          'Typical rail shipments:',
        ],
        bullets: [
          'Machinery, machine tools and components for production — heavy and not urgent.',
          'Raw materials: fabrics, plastic granules, paper, permitted chemicals, metal products.',
          'Building materials: tiles, sanitary ware, doors and windows, LED lighting, cable.',
          'Furniture and home appliances — bulky cargo that is cheaper per cubic metre in a container.',
          'Regular wholesale importers: one container a month, with price and timing known in advance.',
        ],
        callout: {
          title: 'What are FCL and LCL?',
          text: 'FCL (Full Container Load) is a whole container for your cargo only, priced per container. LCL (Less than Container Load) is space in a container: your cargo shares it with other clients’ goods and is priced per cubic metre from 0.1 m³. Above 10–12 m³, FCL is usually cheaper.',
          tone: 'info',
        },
      },
      {
        heading: 'How is the container price calculated?',
        body: [
          'The FCL price depends on the container type (20ft, 40ft or 40 HC), the departure station, the cargo weight and the season. Eastern Chinese cities (Yiwu, Shanghai, Guangzhou) cost more than Urumqi. The range is wide because rail rates change every month — we confirm the exact price on request within 1–2 days.',
          'LCL is priced like truck cargo — per cubic metre by density: the denser the cargo, the more a cubic metre costs but the less a kilogram costs. We accept from 0.1 m³.',
        ],
        table: {
          caption: 'Rail rates, China → Tashkent',
          head: ['Option', 'Capacity', 'Estimated price'],
          rows: [
            ['20ft container (FCL)', '≈ 33 m³, up to 20 t', '$2,800–5,500'],
            ['40ft / 40 HC container (FCL)', '≈ 67–76 m³, up to 26 t', '$5,200–6,800'],
            ['LCL, density up to 100 kg/m³', 'space in a container', 'from $110/m³'],
            ['LCL, density 100–200 kg/m³', 'space in a container', 'from $130/m³'],
            ['LCL, density above 200 kg/m³', 'space in a container', 'from $150/m³'],
          ],
          note: 'Estimates · Updated September 8, 2026. The FCL price covers station to Tashkent terminal; customs payments, trucking from the terminal and insurance are extra. LCL includes customs clearance under the company’s documents.',
        },
        callout: {
          title: 'Example: a 40 HC of furniture',
          text: '70 m³ of furniture, 9 tonnes. FCL: roughly $5,200–6,800, or $75–97 per cubic metre. The same load as consolidated truck cargo from $130/m³ comes to $9,100. That is a difference of over $2,000, in exchange for waiting 1–2 weeks longer.',
          tone: 'info',
        },
      },
      {
        heading: 'How long does it take, and which route?',
        body: [
          'Once dispatched from the station in China, a container reaches Tashkent in roughly 20–35 days. The route: Yiwu / Shanghai / Guangzhou → Urumqi → the Alashankou–Dostyk or Khorgos–Altynkol border stations → the Kazakh railway → Saryagash → Tashkent. China runs on 1 435 mm track while Kazakhstan and Uzbekistan use 1 520 mm, so the container is transferred to another flatcar at the border; that takes 2–7 days.',
        ],
        table: {
          caption: 'Stages of the rail route',
          head: ['Stage', 'What happens', 'Roughly'],
          rows: [
            ['Station in China', 'loading the container, sealing, export clearance, waiting for the train', '3–7 days'],
            ['Across China → Urumqi → border', 'rail, 3,500–4,000 km', '5–8 days'],
            ['Dostyk / Altynkol', 'transfer from 1435 to 1 520 mm gauge, transit documents', '2–7 days'],
            ['Across Kazakhstan → Saryagash', 'transit', '5–8 days'],
            ['Saryagash → Tashkent terminal', 'import customs clearance, unloading', '3–5 days'],
          ],
          note: 'Transit is counted from the day the container is dispatched from the station. In peak season the queue at Dostyk can stretch to a week.',
        },
        callout: {
          title: 'Which border — Dostyk or Altynkol?',
          text: 'Both are on the Kazakh border: Alashankou–Dostyk is the older, larger crossing; Khorgos–Altynkol is newer and being expanded. The train goes through whichever is less congested — the rail operator decides. The China–Kyrgyzstan–Uzbekistan railway is still under construction and not operating.',
          tone: 'warn',
        },
      },
      {
        heading: 'How does the process work?',
        body: [
          'Container shipping involves more paperwork than consolidated truck cargo, so your manager walks with you from the first request.',
        ],
        steps: [
          { title: 'You leave a request', text: 'Product name, total weight and volume, the supplier’s city. From that we recommend FCL or LCL, 20ft or 40ft, and quote within 1–2 days.' },
          { title: 'Contract and documents', text: 'Price, timing and liability are set out in the contract. If you import under your own company, the foreign-trade contract is registered in E-Contract.' },
          { title: 'Loading in China', text: 'FCL: the container is delivered to the factory or station, loaded and sealed; on request our staff in Yiwu supervise loading and send a photo report. LCL: your goods arrive at the Yiwu warehouse and are consolidated into a container.' },
          { title: 'Tracking in transit', text: 'You receive the container number. Your manager reports the border crossing and progress across Kazakhstan.' },
          { title: 'Customs and unloading', text: 'At the Tashkent terminal the declaration is filed, duty and VAT are paid (when importing under your company), and the container is opened. We truck the goods from the terminal to your warehouse.' },
          { title: 'Returning the container', text: 'The empty container goes back to the operator within the agreed period — late return incurs a daily charge (demurrage). We plan the unloading in advance.' },
        ],
      },
      {
        heading: 'What is included, and what costs extra?',
        body: [
          'The FCL price is the rail service from the station in China to the terminal in Tashkent. It includes:',
        ],
        bullets: [
          'Container hire and delivery to the departure station',
          'Rail across China, gauge transfer at the border, transit across Kazakhstan',
          'SMGS rail consignment note and transit documents',
          'Receiving at the Tashkent terminal and storage within the agreed period',
          'Status updates by container number and a manager you can reach',
        ],
        table: {
          caption: 'Charged separately',
          head: ['Service', 'Estimated price'],
          rows: [
            ['Trucking from the factory to the station (in China)', 'depends on city and distance'],
            ['Customs clearance under your company: duty, 12% VAT, fee', 'calculated by HS code'],
            ['Trucking from the terminal to your warehouse (Tashkent)', 'depends on distance'],
            ['Inspection at loading and photo report', 'from $1/kg, by agreement'],
            ['Insurance', '1% of declared value'],
          ],
          note: 'Estimates · Updated September 8, 2026. For LCL, customs clearance under the company’s documents is included, as with consolidated truck cargo.',
        },
      },
      {
        heading: 'What cannot be shipped?',
        body: ['The universal bans apply in containers too:'],
        bullets: [
          'Explosive, flammable and toxic substances, pressurised cylinders (dangerous goods are handled separately)',
          'Plants, seeds, live animals and perishable food — without phytosanitary and veterinary permits',
          'Cash, precious metals and stones, jewellery, antiques',
          'Means of payment, securities, documents',
          'Unregistered medicines, narcotic and psychotropic substances',
          'Drones, walkie-talkies and radio equipment that needs a permit',
          'Weapons and their parts, counterfeit branded goods',
          'Anything else prohibited by the laws of Uzbekistan, Kazakhstan or China',
        ],
        callout: {
          title: 'Batteries and liquids are fine in a container',
          text: 'Devices with lithium batteries, liquids, cosmetics and magnets that air cargo refuses are accepted in a rail container — with proper packaging and documents. Tell us the contents in advance: if the goods count as dangerous cargo, separate paperwork is needed.',
          tone: 'info',
        },
      },
      {
        heading: 'Which documents are needed?',
        body: [
          'A whole container is usually imported officially under your own company or sole proprietorship — that lets you sell the goods with a customs declaration, bid in tenders and list on marketplaces. As forwarder and declarant we prepare the documents and calculate duty and VAT in advance. We never promise “no duties” or “no paperwork”.',
          'You will need:',
        ],
        bullets: [
          'A foreign-trade contract registered in E-Contract (EEISVO)',
          'Invoice and packing list',
          'SMGS consignment note with the container and seal numbers',
          'A certificate of origin and a 10-digit HS (TN VED) code for every product',
          'A conformity certificate or SES conclusion, depending on the goods; a technical passport for machinery',
        ],
        callout: {
          title: 'Manager’s tip',
          text: 'When loading, put heavy goods at the bottom and light ones on top, and stay under 20 tonnes in a 20ft — overweight causes problems at the border. In a mixed container, decide the HS code for every product beforehand: customs in Tashkent goes several days faster.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'How much is a 20ft container from China to Tashkent?',
        a: 'Roughly $2,800–5,500; a 40ft is $5,200–6,800, depending on the station and season. Prices were updated on September 8, 2026 and are estimates; we confirm the exact price on request within 1–2 days.',
      },
      {
        q: 'How many days does rail freight take?',
        a: 'Roughly 20–35 days from dispatch at the station in China to Tashkent. The gauge transfer and the queue at Dostyk take 2–7 days; around Chinese New Year and the October holidays transit gets longer.',
      },
      {
        q: 'What are FCL and LCL?',
        a: 'FCL is a whole container for your cargo only, priced per container. LCL is space in a container shared with other clients, priced per cubic metre from 0.1 m³. Above 10–12 m³, FCL is usually cheaper.',
      },
      {
        q: 'How much fits in a container?',
        a: 'A 20ft holds about 33 m³ and up to 20 tonnes; a 40ft holds 67 m³ and a 40 HC 76 m³, up to 26 tonnes. Heavy cargo (tiles, metal) suits a 20ft; bulky cargo (furniture, appliances) suits a 40 HC.',
      },
      {
        q: 'Which border does the cargo cross?',
        a: 'Kazakhstan: the Alashankou–Dostyk or Khorgos–Altynkol stations, then via Saryagash to Tashkent. At the border the container is transferred from China’s 1 435 mm gauge to 1 520 mm.',
      },
      {
        q: 'Is the China–Kyrgyzstan–Uzbekistan railway operating?',
        a: 'No, it is still under construction and carries no freight in 2026. All rail cargo currently comes through Kazakhstan; through Kyrgyzstan only the road corridor (Irkeshtam / Torugart → Osh → Andijan) operates.',
      },
      {
        q: 'Is rail cheaper than truck?',
        a: 'For large consignments, yes: a 40 HC of furniture comes to roughly $75–97 per cubic metre, versus consolidated truck cargo from $130/m³. For small lots (up to 10 m³) the difference is small and the truck is 1–2 weeks faster.',
      },
      {
        q: 'Are customs payments included in the price?',
        a: 'Not in the FCL price: a whole container is imported under your own company, and duty and 12% VAT are paid separately by HS code — we calculate them in advance. For LCL, clearance under the company’s documents is included.',
      },
    ],
    related: ['truck', 'equipment', 'customs'],
    guideKeys: ['air-vs-truck-vs-rail', 'routes', 'customs-2026', 'shipping-from-china'],
    cta: {
      title: 'Let us price your next container.',
      text: 'Send the product name, total weight, volume and the supplier’s city — we will tell you whether FCL or LCL is cheaper and confirm the exact price within 1–2 days.',
      draft: 'Hello! I need a quote for rail / container shipping. Product: … Weight: … t. Volume: … m³. Supplier city: … Container: 20ft / 40ft / LCL',
    },
    updated: '2026-09-08',
  },
};

export default content;
