import type { ServiceContentByLang } from './types';

/**
 * Avto kargo (yigʻma yuk) — long-form page content.
 * Figures mirror src/data/tariffs.json (updated 2026-09-08): truck cargo is priced by volume from the
 * cargo's density — 110 $/m³ up to 100 kg/m³, rising to 320 $/m³ at 701–1 000 kg/m³, and 0,55 $/kg
 * from 1 000 kg/m³; minimum billable volume 0,1 m³. There is no per-kilogram ladder for truck cargo.
 * Extras 1 $ photo, 0,4 $/kg repack, 1 $/kg inspection, 1% insurance, 14/3 free storage days,
 * door delivery 20 000–30 000 soʻm (free from 5 kg in Tashkent). Keep them in sync when tariffs change.
 */
const content: ServiceContentByLang = {
  uz: {
    key: 'truck',
    seo: {
      title: 'Xitoydan Toshkentga avto kargo (yigʻma yuk) — narxi va muddati',
      description:
        'Xitoydan Toshkentga yigʻma yuk: taxminan 15–25 kun, narx zichlik boʻyicha 110 $/m³ dan. Ivu omborida qabul, konsolidatsiya, bojxona rasmiylashtiruvi va Toshkent omborigacha yetkazib berish narxga kiradi.',
    },
    hero: {
      eyebrow: 'Xizmat 01 — Yigʻma yuk',
      h1: 'Xitoydan Toshkentga avto kargo (yigʻma yuk)',
      intro:
        'Yigʻma yuk — bu bir necha mijozning yukini Ivu omborida bitta fura yoki konteynerga jamlab, Xorgos orqali Toshkentga olib kelish. Xitoy omboridan joʻnatilgach, yuk taxminan 15–25 kunda keladi. Narx kub metr hisobida: yukning zichligi (kg ÷ m³) tarifni tanlaydi — 110 $/m³ dan boshlanadi, minimal hisob hajmi 0,1 m³. Butun konteynerni ijaraga olish shart emas.',
      facts: [
        { label: 'Muddat, Xitoy omboridan', value: '15–25 kun' },
        { label: 'Narx, m³ hisobida', value: '110 $/m³ dan' },
        { label: 'Hisob asosi', value: 'zichlik, kg/m³' },
        { label: 'Minimal hajm', value: '0,1 m³' },
      ],
    },
    sections: [
      {
        heading: 'Yigʻma yuk kimga toʻgʻri keladi?',
        body: [
          'Yigʻma yuk (LCL, сборный груз) — Xitoydan tovar olib kelishning eng koʻp tarqalgan usuli. Yukingiz Ivu (义乌) omborida boshqa mijozlarning yuklari bilan bitta fura yoki konteynerga joylanadi, shuning uchun 0,1 m³ yuk uchun ham, 10 m³ yuk uchun ham faqat oʻz ulushingizga toʻlaysiz. Xitoyda uchta qabul manzili bor: Ivu, Guanchjou va Qashqar — qaysi biriga joʻnatish kerakligini menejer aytadi. Boshqa shaharlardan, masalan Shenchjendan, yetkazib beruvchi yukni Xitoy ichki pochtasi bilan shu manzillardan biriga joʻnatadi.',
          'Bu usul quyidagi holatlarda oʻzini oqlaydi:',
        ],
        bullets: [
          'Ulgurji savdo (Abu Sahiy, Chorsu, Bek Baraka): kiyim-kechak, poyabzal, gazlama — zich yuk, odatda 200–350 kg/m³, yaʼni 160–230 $/m³ oraligʻidagi tarif.',
          'Uzum, Yandex Market va Instagram sotuvchilari: 20–300 kg li partiyalar har 1–2 haftada; har bir buyurtma alohida kod bilan markirovka qilinadi.',
          'Ishlab chiqaruvchilar: ehtiyot qismlar, xomashyo, mayda uskunalar — zichligi 501–700 kg/m³ boʻlgan yuk 300 $/m³, 1 000 kg/m³ va undan zich metall va furnitura esa 0,55 $/kg boʻyicha hisoblanadi.',
          'Yengil va hajmli tovarlar (oʻyinchoq, plastmassa buyumlar, mebel, uy-roʻzgʻor mollari): zichlik 100 kg/m³ gacha — eng past tarif, 110 $/m³.',
        ],
      },
      {
        heading: 'Narx qanday hisoblanadi?',
        body: [
          'Avto kargoda toʻlov kub metr boʻyicha ketadi, kilogramm boʻyicha emas. Avval zichlikni topamiz: umumiy ogʻirlikni (kg) umumiy hajmga (m³) boʻlamiz. Zichlik jadvaldan tarifni tanlaydi, tarifni hajmga koʻpaytiramiz — chiqqan summa Ivu omboridan Toshkent omborigacha boʻlgan toʻliq yoʻlni qamraydi.',
          'Hajmni oʻzingiz ham hisoblashingiz mumkin: uzunlik × en × balandlik (sm) ÷ 1 000 000 = m³. Zichlik qancha yuqori boʻlsa, kub metr narxi ham shuncha yuqori — bir xil hajmdagi ogʻir yuk furada koʻproq tonnaj oladi. Faqat juda zich yuk — 1 000 kg/m³ dan boshlab — kilogramm boʻyicha, 0,55 $/kg hisoblanadi. Minimal hisob hajmi — 0,1 m³.',
        ],
        table: {
          caption: 'Avto kargo tariflari, Ivu → Toshkent',
          head: ['Zichlik, kg/m³', 'Taxminiy narx'],
          rows: [
            ['100 gacha', '110 $/m³'],
            ['101–150', '130 $/m³'],
            ['151–200', '160 $/m³'],
            ['201–250', '180 $/m³'],
            ['251–300', '200 $/m³'],
            ['301–350', '230 $/m³'],
            ['351–400', '260 $/m³'],
            ['401–450', '280 $/m³'],
            ['451–500', '290 $/m³'],
            ['501–700', '300 $/m³'],
            ['701–1 000', '320 $/m³'],
            ['1 000 va undan yuqori', '0,55 $/kg'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. Zichlik = ogʻirlik (kg) ÷ hajm (m³), minimal hisob hajmi — 0,1 m³. Yakuniy summa yuk Ivu omborida tortilib oʻlchangandan keyin aniqlanadi; brend va seriyali tovarlar uchun tarif alohida kelishiladi.',
        },
        callout: {
          title: 'Misol: narx qanday chiqadi',
          text: '48 kg yuk 0,2 m³ ni egallasa, zichlik 48 ÷ 0,2 = 240 kg/m³ — jadvaldan 180 $/m³, hisob 0,2 × 180 = 36 $. Oʻsha 48 kg yengil qadoqda 0,5 m³ ni egallasa, zichlik 96 kg/m³ — 110 $/m³, hisob 0,5 × 110 = 55 $. Shuning uchun omborda har bir joyni oʻlchaymiz.',
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
          { title: 'Qabul manzilini olasiz', text: 'Menejer qaysi qabul manziliga — Ivu, Guanchjou yoki Qashqarga — joʻnatish kerakligini aytadi va sizga shaxsiy GS kodingizni (markirovka) beradi. Yetkazib beruvchi yoki 1688/Taobao sotuvchisi joʻnatishdan oldin har bir qutiga GS kodini yozadi va yukni shu manzilga joʻnatadi.' },
          { title: 'Yukni qabul qilamiz', text: 'Omborda har bir joyni tortamiz, oʻlchaymiz, kodingiz bilan markirovka qilamiz va foto-hisobot yuboramiz. Xohlasangiz — ichini ochib tekshiramiz va qayta qadoqlaymiz.' },
          { title: 'Konsolidatsiya va joʻnatish', text: 'Yuk eng yaqin partiyaga joylanadi. Sizga partiya raqami beriladi; joʻnatilgan kundan muddat hisobi boshlanadi.' },
          { title: 'Yoʻl va bojxona', text: 'Menejer yukning qayerdaligini bosqichma-bosqich xabar qilib boradi. Xorgos va Yallamada rasmiylashtiruv kompaniya hujjatlari bilan oʻtadi.' },
          { title: 'Toshkentda qabul qilasiz', text: 'Yuk Toshkent omboriga keladi. Toʻlovni yakunlaysiz va yukni olib ketasiz yoki eshikkacha yetkazib beramiz; viloyatlarga yetkazishni alohida kelishamiz.' },
        ],
      },
      {
        heading: 'Narxga nimalar kiradi va nimalar alohida toʻlanadi?',
        body: [
          'Kub metr uchun koʻrsatilgan narx — Ivu omboridan Toshkent omborigacha boʻlgan toʻliq xizmat. Unga kiradi:',
        ],
        bullets: [
          'Ivu omborida qabul, tortish, oʻlchash va markirovka',
          'Konsolidatsiya — partiyaga joylash va yuklash',
          'Xitoydan chiqish va Oʻzbekistonga kirishdagi bojxona rasmiylashtiruvi kompaniya hujjatlari bilan',
          'Toshkent omborigacha yetkazib berish va 3 kungacha bepul saqlash',
          'Ivu omborida 14 kungacha bepul saqlash',
          'GS kod boʻyicha holat xabarlari va menejer bilan aloqa',
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
          text: 'Litiy batareyali texnika, power bank, magnit, suyuqlik va kosmetika avia kargoga olinmaydi, lekin avto kargoda qabul qilinadi. Bunday tovarni oldindan aytib qoʻying — alohida qadoqlanadi.',
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
          text: 'Yetkazib beruvchi yukni joʻnatishdan oldin har bir qutiga GS kodingizni va tovar nomini yozishi shart — omborda yuk tez topiladi va aralashib ketmaydi. Yukni zich qadoqlang: boʻsh joy kamaysa, umumiy hajm kichrayadi va hisob arzonlashadi — 300 kg yuk 3 m³ da 3 × 110 = 330 $, oʻsha yuk 1,2 m³ gacha qayta qadoqlansa 1,2 × 180 = 216 $.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'Xitoydan avto kargo 1 kg necha pul?',
        a: 'Avto kargoda narx kilogramm boʻyicha emas — yukning zichligiga qarab kub metr hisobida chiqadi, 110 $/m³ dan. Zichlik = ogʻirlik ÷ hajm: masalan, 48 kg yuk 0,2 m³ da — 240 kg/m³, tarif 180 $/m³, hisob 0,2 × 180 = 36 $. Faqat 1 000 kg/m³ va undan zich yuk kilogramm boʻyicha — 0,55 $/kg — hisoblanadi. Narxlar 2026-yil 8-sentabrda yangilangan va taxminiy: yakuniy summa yuk Ivu omborida tortilib oʻlchangandan keyin aniqlanadi.',
      },
      {
        q: 'Yigʻma yuk necha kunda keladi?',
        a: 'Taxminan 15–25 kun — yuk Xitoy omboridan joʻnatilgan kundan Toshkentgacha. Rekord partiyalar 12–13 kunda kelgan; Xitoy Yangi yili va oktabr bayramlarida yoʻl bir haftaga choʻzilishi mumkin.',
      },
      {
        q: 'Minimal hajm bormi?',
        a: 'Minimal hisob hajmi — 0,1 m³; yuqori chegara yoʻq. Undan kichik joyni ham qabul qilamiz, lekin hisob 0,1 m³ dan boshlanadi.',
      },
      {
        q: 'Zichlik nima va u narxga qanday taʼsir qiladi?',
        a: 'Zichlik — umumiy ogʻirlik (kg) boʻlingan umumiy hajm (m³); u jadvaldan kub metr narxini tanlaydi. 180 kg yuk 2 m³ da — 90 kg/m³, yaʼni 110 $/m³, hisob 2 × 110 = 220 $. 1 200 kg yuk 1 m³ da — 1 200 kg/m³, bu 1 000 dan yuqori, shuning uchun kilogramm boʻyicha: 1 200 × 0,55 = 660 $.',
      },
      {
        q: 'Yukim Guanchjou yoki boshqa shaharda boʻlsa-chi?',
        a: 'Qabul qilamiz. Xitoyda uchta qabul manzili bor — Ivu, Guanchjou va Qashqar; qaysi biriga joʻnatish kerakligini menejer aytadi. Yetkazib beruvchi yukni shu manzilga Xitoy ichki pochtasi bilan joʻnatadi (odatda 1–3 kun). Xitoy ichidagi yetkazib berish narxi sotuvchi bilan kelishiladi.',
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
      text: 'Tovar nomi, taxminiy ogʻirlik va hajmni yozing — zichlikni hisoblab, qaysi tarif tushishini va taxminiy summani aytamiz.',
      draft: 'Assalomu alaykum! Avto kargo (yigʻma yuk) boʻyicha narx kerak. Tovar: … Ogʻirlik: … kg. Hajm: … m³. Yuk qayerda: Ivu / …',
    },
    updated: '2026-09-08',
  },

  ru: {
    key: 'truck',
    seo: {
      title: 'Авто карго из Китая в Ташкент (сборный груз) — цена и сроки',
      description:
        'Сборный груз из Китая в Ташкент: ориентировочно 15–25 дней, цена по плотности — от 110 $/м³. В цену входят приёмка на складе в Иу, консолидация, таможенное оформление и доставка до склада в Ташкенте.',
    },
    hero: {
      eyebrow: 'Услуга 01 — Сборный груз',
      h1: 'Авто карго из Китая в Ташкент (сборный груз)',
      intro:
        'Сборный груз — это когда грузы нескольких клиентов собирают на складе в Иу в одну фуру или контейнер и везут через Хоргос в Ташкент. После отправки со склада в Китае груз идёт ориентировочно 15–25 дней. Цена считается за кубометры: плотность груза (кг ÷ м³) выбирает ставку — от 110 $/м³, минимальный расчётный объём — 0,1 м³. Арендовать целый контейнер не нужно.',
      facts: [
        { label: 'Срок от склада в Китае', value: '15–25 дней' },
        { label: 'Цена по кубометрам', value: 'от 110 $/м³' },
        { label: 'Основа расчёта', value: 'плотность, кг/м³' },
        { label: 'Минимальный объём', value: '0,1 м³' },
      ],
    },
    sections: [
      {
        heading: 'Кому подходит сборный груз?',
        body: [
          'Сборный груз (LCL) — самый распространённый способ привезти товар из Китая. Ваш груз на складе в Иу (义乌) укладывается в одну фуру или контейнер вместе с грузами других клиентов, поэтому и за 0,1 м³, и за 10 м³ вы платите только за свою долю. В Китае три адреса приёма: Иу, Гуанчжоу и Кашгар — на какой отправлять, скажет менеджер. Из других городов, например из Шэньчжэня, поставщик отправляет товар внутрикитайской доставкой на один из этих адресов.',
          'Такой формат выгоден в следующих случаях:',
        ],
        bullets: [
          'Оптовая торговля (Абу Сахий, Чорсу, Бек Барака): одежда, обувь, ткани — плотный груз, обычно 200–350 кг/м³, то есть ставка 160–230 $/м³.',
          'Продавцы Uzum, Яндекс Маркета и Instagram: партии по 20–300 кг раз в одну–две недели; каждый заказ маркируется отдельным кодом.',
          'Производители: запчасти, сырьё, мелкое оборудование — груз плотностью 501–700 кг/м³ считается по 300 $/м³, а металл и фурнитура плотностью от 1 000 кг/м³ — по 0,55 $/кг.',
          'Лёгкие и объёмные товары (игрушки, пластик, мебель, хозтовары): плотность до 100 кг/м³ — самая низкая ставка, 110 $/м³.',
        ],
      },
      {
        heading: 'Как считается цена?',
        body: [
          'В авто карго платят за кубометры, а не за килограммы. Сначала считаем плотность: общий вес (кг) делим на общий объём (м³). Плотность выбирает ставку из таблицы, ставку умножаем на объём — эта сумма покрывает весь путь от склада в Иу до склада в Ташкенте.',
          'Объём можно посчитать самому: длина × ширина × высота (см) ÷ 1 000 000 = м³. Чем выше плотность, тем дороже кубометр: тот же объём тяжёлого груза съедает больше тоннажа фуры. Только очень плотный груз — от 1 000 кг/м³ — считается по килограммам, по 0,55 $/кг. Минимальный расчётный объём — 0,1 м³.',
        ],
        table: {
          caption: 'Тарифы авто карго, Иу → Ташкент',
          head: ['Плотность, кг/м³', 'Ориентировочная цена'],
          rows: [
            ['до 100', '110 $/м³'],
            ['101–150', '130 $/м³'],
            ['151–200', '160 $/м³'],
            ['201–250', '180 $/м³'],
            ['251–300', '200 $/м³'],
            ['301–350', '230 $/м³'],
            ['351–400', '260 $/м³'],
            ['401–450', '280 $/м³'],
            ['451–500', '290 $/м³'],
            ['501–700', '300 $/м³'],
            ['701–1 000', '320 $/м³'],
            ['1 000 и выше', '0,55 $/кг'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. Плотность = вес (кг) ÷ объём (м³), минимальный расчётный объём — 0,1 м³. Итоговая сумма определяется после взвешивания и обмера на складе в Иу; для брендовых и серийных товаров тариф согласуется отдельно.',
        },
        callout: {
          title: 'Пример: как считается цена',
          text: '48 кг занимают 0,2 м³ — плотность 48 ÷ 0,2 = 240 кг/м³, по таблице 180 $/м³, счёт 0,2 × 180 = 36 $. Те же 48 кг в объёмной упаковке на 0,5 м³ — это 96 кг/м³, ставка 110 $/м³, счёт 0,5 × 110 = 55 $. Поэтому на складе мы обмеряем каждое место.',
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
          { title: 'Получаете адрес приёма', text: 'Менеджер говорит, на какой адрес приёма отправлять — Иу, Гуанчжоу или Кашгар, — и даёт ваш личный GS-код (маркировка). Поставщик или продавец на 1688/Taobao пишет GS-код на каждой коробке до отправки и шлёт груз на этот адрес.' },
          { title: 'Принимаем груз', text: 'На складе взвешиваем и обмеряем каждое место, маркируем вашим кодом и отправляем фотоотчёт. По желанию вскрываем, проверяем и переупаковываем.' },
          { title: 'Консолидация и отправка', text: 'Груз идёт в ближайшую партию. Вы получаете номер партии; со дня отправки начинается отсчёт срока.' },
          { title: 'Дорога и таможня', text: 'Менеджер сообщает, где находится груз, на каждом этапе. Оформление в Хоргосе и Ялламе проходит под документы компании.' },
          { title: 'Получаете в Ташкенте', text: 'Груз приходит на склад в Ташкенте. Вы закрываете оплату и забираете груз, либо мы доставляем до двери; доставку в регионы согласуем отдельно.' },
        ],
      },
      {
        heading: 'Что входит в цену, а что оплачивается отдельно?',
        body: [
          'Цена за кубометр — это полная услуга от склада в Иу до склада в Ташкенте. В неё входят:',
        ],
        bullets: [
          'Приёмка, взвешивание, обмер и маркировка на складе в Иу',
          'Консолидация — размещение в партии и погрузка',
          'Экспортное оформление в Китае и импортное в Узбекистане под документы компании',
          'Доставка до склада в Ташкенте и бесплатное хранение до 3 дней',
          'Бесплатное хранение на складе в Иу до 14 дней',
          'Уведомления о статусе по GS-коду и связь с менеджером',
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
          text: 'Поставщик обязан написать на каждой коробке ваш GS-код и название товара до отправки — на складе груз найдут быстро и ничего не перепутают. Упаковывайте плотно: меньше пустоты — меньше объём и меньше счёт: 300 кг в 3 м³ — это 3 × 110 = 330 $, а те же 300 кг, переупакованные в 1,2 м³, — 1,2 × 180 = 216 $.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'Сколько стоит 1 кг авто карго из Китая?',
        a: 'В авто карго цена считается не за килограмм, а за кубометр — по плотности груза, от 110 $/м³. Плотность = вес ÷ объём: например, 48 кг в 0,2 м³ — это 240 кг/м³, ставка 180 $/м³, счёт 0,2 × 180 = 36 $. По килограммам считается только очень плотный груз — от 1 000 кг/м³, по 0,55 $/кг. Цены обновлены 8 сентября 2026 г. и являются ориентировочными: итоговая сумма определяется после взвешивания и обмера на складе в Иу.',
      },
      {
        q: 'Сколько дней идёт сборный груз?',
        a: 'Ориентировочно 15–25 дней от отправки со склада в Китае до Ташкента. Рекордные партии доходили за 12–13 дней; в китайский Новый год и октябрьские праздники путь может удлиниться на неделю.',
      },
      {
        q: 'Есть ли минимальный объём?',
        a: 'Минимальный расчётный объём — 0,1 м³, верхней границы нет. Более мелкое место мы тоже примем, но счёт начинается с 0,1 м³.',
      },
      {
        q: 'Что такое плотность и как она влияет на цену?',
        a: 'Плотность — это общий вес (кг), делённый на общий объём (м³); она выбирает цену кубометра по таблице. 180 кг в 2 м³ — это 90 кг/м³, то есть 110 $/м³, счёт 2 × 110 = 220 $. А 1 200 кг в 1 м³ — это 1 200 кг/м³, выше 1 000, поэтому счёт идёт по килограммам: 1 200 × 0,55 = 660 $.',
      },
      {
        q: 'А если мой товар в Гуанчжоу или другом городе?',
        a: 'Принимаем. В Китае три адреса приёма — Иу, Гуанчжоу и Кашгар; на какой отправлять, скажет менеджер. Поставщик отправляет груз на этот адрес внутрикитайской доставкой (обычно 1–3 дня). Стоимость доставки внутри Китая согласуется с продавцом.',
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
      text: 'Напишите название товара, примерный вес и объём — посчитаем плотность, назовём ставку и ориентировочную сумму.',
      draft: 'Здравствуйте! Нужна цена на авто карго (сборный груз). Товар: … Вес: … кг. Объём: … м³. Где груз: Иу / …',
    },
    updated: '2026-09-08',
  },

  en: {
    key: 'truck',
    seo: {
      title: 'Truck cargo from China to Tashkent (consolidated) — price and transit time',
      description:
        'Consolidated truck cargo from China to Tashkent: roughly 15–25 days, priced by density from $110 per m³. Receiving at the Yiwu warehouse, consolidation, customs clearance and delivery to the Tashkent warehouse are included.',
    },
    hero: {
      eyebrow: 'Service 01 — Consolidated cargo',
      h1: 'Truck cargo from China to Tashkent (consolidated)',
      intro:
        'Consolidated cargo means we group several clients’ goods at the Yiwu warehouse into one truck or container and drive it through Khorgos to Tashkent. Once dispatched from the warehouse in China, it arrives in roughly 15–25 days. The price is charged per cubic metre: the density of your cargo (kg ÷ m³) picks the rate, which starts at $110/m³, with a minimum billable volume of 0.1 m³. No need to rent a whole container.',
      facts: [
        { label: 'Transit from the China warehouse', value: '15–25 days' },
        { label: 'Price per cubic metre', value: 'from $110/m³' },
        { label: 'Billing basis', value: 'density, kg/m³' },
        { label: 'Minimum volume', value: '0.1 m³' },
      ],
    },
    sections: [
      {
        heading: 'Who is consolidated cargo for?',
        body: [
          'Consolidated cargo (LCL, groupage) is the most common way to bring goods from China. Your shipment is loaded at the Yiwu (义乌) warehouse into one truck or container together with other clients’ goods, so whether you send 0.1 m³ or 10 m³ you pay only for your share. There are three receiving addresses in China: Yiwu, Guangzhou and Kashgar — your manager tells you which one applies. From other cities, Shenzhen for example, the supplier ships to one of those addresses by domestic delivery.',
          'It pays off in these cases:',
        ],
        bullets: [
          'Wholesalers (Abu Sahiy, Chorsu, Bek Baraka markets): clothing, footwear, fabrics — dense cargo, usually 200–350 kg/m³, which puts it in the $160–230 per m³ range.',
          'Uzum, Yandex Market and Instagram sellers: lots of 20–300 kg every one or two weeks; each order is labelled with its own code.',
          'Manufacturers: spare parts, raw materials, small machinery — cargo at 501–700 kg/m³ is billed at $300 per m³, while metal and fittings at 1,000 kg/m³ and above go at $0.55/kg.',
          'Light, bulky goods (toys, plastics, furniture, household items): density up to 100 kg/m³ — the lowest rate, $110 per m³.',
        ],
      },
      {
        heading: 'How is the price calculated?',
        body: [
          'Truck cargo is billed by volume, not by weight. First we determine the density of your cargo: total weight (kg) divided by total volume (m³). The density picks a rate from the table, and we multiply that rate by your volume — the result covers the whole journey from the Yiwu warehouse to the Tashkent warehouse.',
          'You can measure the volume yourself: length × width × height (cm) ÷ 1,000,000 = m³. The denser the cargo, the more a cubic metre costs, because the same volume of heavy goods eats more of the truck’s tonnage. Only very dense cargo — from 1,000 kg/m³ — is billed per kilogram instead, at $0.55/kg. The minimum billable volume is 0.1 m³.',
        ],
        table: {
          caption: 'Truck cargo rates, Yiwu → Tashkent',
          head: ['Density, kg/m³', 'Estimated price'],
          rows: [
            ['up to 100', '$110/m³'],
            ['101–150', '$130/m³'],
            ['151–200', '$160/m³'],
            ['201–250', '$180/m³'],
            ['251–300', '$200/m³'],
            ['301–350', '$230/m³'],
            ['351–400', '$260/m³'],
            ['401–450', '$280/m³'],
            ['451–500', '$290/m³'],
            ['501–700', '$300/m³'],
            ['701–1,000', '$320/m³'],
            ['1,000 and above', '$0.55/kg'],
          ],
          note: 'Estimates · Updated September 8, 2026. Density = weight (kg) ÷ volume (m³), and the minimum billable volume is 0.1 m³. The final amount is fixed after weighing and measuring at the Yiwu warehouse; branded and serial goods are quoted separately.',
        },
        callout: {
          title: 'Example: how the price comes out',
          text: '48 kg taking up 0.2 m³ is a density of 48 ÷ 0.2 = 240 kg/m³ — $180 per m³ from the table, so 0.2 × 180 = $36. The same 48 kg in bulky packaging filling 0.5 m³ is 96 kg/m³ — $110 per m³, so 0.5 × 110 = $55. That is why we measure every piece at the warehouse.',
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
          { title: 'You get the receiving address', text: 'Your manager tells you which receiving address applies — Yiwu, Guangzhou or Kashgar — and gives you your personal GS code (shipping mark). Your supplier or 1688/Taobao seller writes the GS code on every carton before dispatch and ships to that address.' },
          { title: 'We receive the goods', text: 'At the warehouse we weigh and measure every piece, label it with your code and send a photo report. On request we open, inspect and repack.' },
          { title: 'Consolidation and dispatch', text: 'Your cargo joins the next load. You receive the load number; transit time counts from the dispatch date.' },
          { title: 'Road and customs', text: 'Your manager reports where the cargo is at each stage. Clearance at Khorgos and Yallama runs under the company’s documents.' },
          { title: 'You collect in Tashkent', text: 'The cargo arrives at the Tashkent warehouse. You settle the invoice and pick it up, or we deliver to your door; delivery to the regions is arranged separately.' },
        ],
      },
      {
        heading: 'What is included, and what costs extra?',
        body: [
          'The per-cubic-metre price is the full service from the Yiwu warehouse to the Tashkent warehouse. It includes:',
        ],
        bullets: [
          'Receiving, weighing, measuring and labelling at the Yiwu warehouse',
          'Consolidation — placing in the load and loading',
          'Export clearance in China and import clearance in Uzbekistan under the company’s documents',
          'Delivery to the Tashkent warehouse and free storage for up to 3 days',
          'Free storage at the Yiwu warehouse for up to 14 days',
          'Status updates by GS code and a manager you can reach',
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
          text: 'Your supplier must write your GS code and the product name on every carton before dispatch — the warehouse finds your cargo fast and nothing gets mixed up. Pack tightly: less empty space means less volume and a smaller invoice — 300 kg spread over 3 m³ costs 3 × 110 = $330, while the same 300 kg repacked into 1.2 m³ costs 1.2 × 180 = $216.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'How much is 1 kg of truck cargo from China?',
        a: 'Truck cargo is not priced per kilogram — it is priced per cubic metre, from the density of the load, starting at $110 per m³. Density = weight ÷ volume: 48 kg in 0.2 m³ is 240 kg/m³, so the rate is $180 per m³ and the invoice is 0.2 × 180 = $36. Only very dense cargo, from 1,000 kg/m³, is billed per kilogram, at $0.55/kg. Prices were updated on September 8, 2026 and are estimates — the final amount is fixed after weighing and measuring at the Yiwu warehouse.',
      },
      {
        q: 'How many days does consolidated cargo take?',
        a: 'Roughly 15–25 days from dispatch at the China warehouse to Tashkent. Our fastest loads arrived in 12–13 days; around Chinese New Year and the October holidays the journey can stretch by a week.',
      },
      {
        q: 'Is there a minimum volume?',
        a: 'The minimum billable volume is 0.1 m³, and there is no upper limit. We accept smaller pieces too, but billing starts at 0.1 m³.',
      },
      {
        q: 'What is density and how does it affect the price?',
        a: 'Density is total weight (kg) divided by total volume (m³), and it picks the per-cubic-metre rate from the table. 180 kg in 2 m³ is 90 kg/m³, so $110 per m³ and 2 × 110 = $220. But 1,200 kg in 1 m³ is 1,200 kg/m³ — above 1,000 — so it is billed per kilogram: 1,200 × 0.55 = $660.',
      },
      {
        q: 'What if my goods are in Guangzhou or another city?',
        a: 'We accept them. There are three receiving addresses in China — Yiwu, Guangzhou and Kashgar; your manager tells you which one applies. The supplier ships to that address by domestic delivery (usually 1–3 days). The cost of delivery inside China is agreed with the seller.',
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
      text: 'Send the product name, approximate weight and volume — we will work out the density, name the rate and give you an estimate.',
      draft: 'Hello! I need a quote for truck cargo (consolidated). Product: … Weight: … kg. Volume: … m³. Cargo location: Yiwu / …',
    },
    updated: '2026-09-08',
  },
};

export default content;
