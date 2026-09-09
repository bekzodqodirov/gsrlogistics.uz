import type { ServiceContentByLang } from './types';

/**
 * 1688 / Taobao / Pinduoduo / Alibaba buying agent (vykup) — long-form page content.
 * Figures: commission "3% dan" = site.sourcingCommissionPct / tariffs.extras.sourcingCommissionPct;
 * freight, inspection (1 $/kg), photo (1 $), repack (0,4 $/kg), 14 free storage days — tariffs.json (2026-09-08).
 * Own vs partner warehouse is unverified — always "Ivu ombori" / "склад в Иу" / "the Yiwu warehouse",
 * never "omborimiz" / "нашего склада" / "our Yiwu warehouse".
 * FX example uses the CBU rates of 2026-09-08 (USD 11 789,33 · CNY 1 756,72 soʻm, research wf/10 §6) — illustrative only.
 * Payment channels in Uzbekistan (soʻm, card, Click/Payme, bank transfer for legal entities) are market practice — owner to confirm.
 */
const content: ServiceContentByLang = {
  uz: {
    key: 'buying',
    seo: {
      title: '1688, Taobao va Alibabadan tovar sotib olish — komissiya 3% dan',
      description:
        'Havolani yuborasiz — biz narxni dollarda hisoblaymiz, sotuvchiga yuanda toʻlaymiz, tovarni Ivu omborida tekshirib Toshkentga olib kelamiz. 1688, Taobao, Pinduoduo, Alibaba. Komissiya 3% dan, toʻlov soʻmda.',
    },
    hero: {
      eyebrow: 'Xizmat 05 — Sotib olish',
      h1: '1688, Taobao va Alibabadan tovar sotib olish',
      intro:
        'Sotib olish xizmati (выкуп) — bu siz 1688, Taobao, Pinduoduo yoki Alibabadan tovar havolasini yuborasiz, biz narxni Markaziy bank kursi boʻyicha dollarda hisoblab beramiz, sotuvchiga yuanda toʻlaymiz, tovarni Ivu (义乌) omborida qabul qilib tekshiramiz va yigʻma yuk bilan taxminan 15–25 kunda Toshkentga olib kelamiz. Xizmat haqi — buyurtma summasining 3% dan. Xitoy kartasi, Alipay yoki xitoy tili kerak emas.',
      facts: [
        { label: 'Komissiya, buyurtma summasidan', value: '3% dan' },
        { label: 'Saytlar: 1688, Taobao, Pinduoduo, Alibaba', value: '4 sayt' },
        { label: 'Yuan kursi', value: 'MB kursi' },
        { label: 'Toshkentgacha, avto', value: '15–25 kun' },
      ],
    },
    sections: [
      {
        heading: 'Sotib olish xizmati qanday ishlaydi?',
        body: [
          'Xitoy saytlari faqat xitoy bank kartasi yoki Alipay bilan toʻlovni qabul qiladi, sotuvchilar faqat xitoy tilida yozadi, tovar esa faqat Xitoy ichidagi manzilga joʻnatiladi. Biz shu uch toʻsiqni olib tashlaymiz: toʻlaymiz, yozishamiz va Ivu omborining manzilini beramiz.',
        ],
        steps: [
          { title: 'Havolani yuborasiz', text: 'Telegramda tovar havolasi, rangi, oʻlchami va sonini yozasiz. Bir xabarda 1 ta ham, 50 ta ham havola boʻlishi mumkin; sayt ilovasidagi «ulashish» tugmasi yetarli.' },
          { title: 'Hisob-kitobni olasiz', text: 'Menejer tovar narxini yuandan dollarga MB kursi boʻyicha oʻtkazadi, sotuvchining Xitoy ichidagi yetkazib berish haqi va bizning komissiyamizni qoʻshadi. Hisobda har bir qator alohida koʻrsatiladi — kurs ham, foiz ham.' },
          { title: 'Toʻlaysiz', text: 'Soʻmda hisob-kitob kunidagi kurs boʻyicha: karta oʻtkazmasi, Click yoki Payme, ofisda naqd. Yuridik shaxslar uchun hisob-faktura va bank oʻtkazmasi. Toʻlovdan keyin buyurtma shu kuni beriladi.' },
          { title: 'Sotuvchiga yuanda toʻlaymiz', text: 'Buyurtmani oʻz akkauntimizdan beramiz, sotuvchi bilan xitoy tilida yozishamiz — rang, oʻlcham, joʻnatish muddatini tasdiqlatamiz. Pul tovar Ivuga kelguncha platformada saqlanadi.' },
          { title: 'Ivu omborida qabul qilamiz', text: 'Tovar Xitoy ichida odatda 1–5 kunda omborga keladi. Har bir posilkani sizning kodingiz bilan qabul qilamiz, sonini va tashqi holatini tekshiramiz, foto-hisobot yuboramiz. Nuqsonli tovar sotuvchiga qaytariladi.' },
          { title: 'Konsolidatsiya va Toshkent', text: 'Turli sotuvchilardan kelgan posilkalar bitta yukka jamlanadi, qayta qadoqlanadi va yigʻma yuk (taxminan 15–25 kun) yoki avia (5–10 kun) bilan Toshkentga joʻnatiladi. Toshkentda olib ketasiz yoki eshikkacha yetkazamiz.' },
        ],
      },
      {
        heading: 'Narx nimadan iborat?',
        body: [
          'Yakuniy summa toʻrt qismdan tuziladi va har biri hisob-kitobda alohida koʻrinadi. Kurs ustamasi tovar narxiga yashirilmaydi — u alohida qator.',
        ],
        table: {
          caption: 'Sotib olish xizmati narxining tarkibi',
          head: ['Qism', 'Qanday hisoblanadi', 'Taxminiy qiymat'],
          rows: [
            ['Tovar narxi', 'yuan → dollar, hisob-kitob kunidagi MB kursi', 'saytdagi narx'],
            ['Komissiya', 'tovar narxidan foiz', '3% dan'],
            ['Xitoy ichidagi yetkazib berish', 'sotuvchi belgilaydi; 1688-da koʻpincha bepul yoki 5–15 yuan', 'sotuvchi narxi'],
            ['Ivu → Toshkent tashish', 'kg yoki m³ hisobida, zichlikka qarab', '6,5 $/kg dan · 110 $/m³ dan'],
            ['Qoʻshimcha (ixtiyoriy)', 'tekshiruv 1 $/kg · foto qutini ochib 1 $ · qayta qadoqlash 0,4 $/kg', 'tanlovga qarab'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. Yuan va dollar kursi Markaziy bank kursi asosida hisob-kitob kunida koʻrsatiladi.',
        },
        callout: {
          title: 'Misol: 1688-dan 50 ta sumka',
          text: '50 dona × 38 yuan = 1 900 yuan. 2026-yil 8-sentabrdagi MB kursi (1 yuan = 1 756,72 soʻm, 1 $ = 11 789,33 soʻm) boʻyicha bu ≈ 283 $; komissiya 3% ≈ 8,5 $. Tovar ≈ 3 340 000 soʻm + komissiya ≈ 100 000 soʻm. Tashish alohida: 50 sumka ≈ 20 kg, 0,15 m³ → zichlik 133 kg/m³ → hajmiy vazn boʻyicha hisoblanadi.',
          tone: 'info',
        },
      },
      {
        heading: 'Qaysi saytdan nima olgan maʼqul?',
        body: [
          'Toʻrt sayt — toʻrt xil vazifa. Bir xil tovar 1688-da Taobaodagidan 20–40% arzon turadi, lekin 1688 ulgurji sayt va sotuvchi 2–10 donadan kam sotmaydi. Pinduoduo eng arzon, sifat esa eng notekis — tekshiruvsiz olmang.',
        ],
        table: {
          caption: 'Xitoy saytlarini taqqoslash',
          head: ['Sayt', 'Nima uchun', 'Minimal buyurtma', 'Eʼtibor bering'],
          rows: [
            ['1688.com', 'ulgurji: kiyim, poyabzal, aksessuar, uy-roʻzgʻor, ehtiyot qismlar', '2–10 dona (sotuvchiga qarab)', 'sotuvchi reytingi, «回头率» (qayta xarid foizi), zavod belgisi'],
            ['Taobao / Tmall', 'chakana, brend doʻkonlar, keng tanlov, 1 dona', '1 dona', 'Tmall — rasmiy doʻkonlar; Taobaoda sotuvchi reytingi va sharhlar'],
            ['Pinduoduo', 'eng arzon mayda tovarlar, sinov uchun', '1 dona', 'sifat turlicha; Ivuda tekshiruv va foto tavsiya etiladi'],
            ['Alibaba.com', 'eksport buyurtmalari, dollarda, katta partiya, shartnoma', '100–500 dona', 'Trade Assurance; narx FOB/EXW deb koʻrsatiladi'],
          ],
          note: 'Saytlar Xitoy ichidagi manzilga joʻnatadi — Ivu ombori manzilini buyurtmadan oldin beramiz.',
        },
      },
      {
        heading: 'Toʻlovni qanday qilaman va yuan kursi qanday?',
        body: [
          'Oʻzbekistonda siz soʻmda toʻlaysiz: Humo yoki Uzcard kartadan oʻtkazma, Click va Payme, ofisimizda naqd (Toshkent, Alisher Navoiy koʻchasi, 27). Yuridik shaxslar va YaTT uchun hisob-faktura va bank oʻtkazmasi mumkin — bu holda tovar oʻz firmangiz nomiga rasmiylashtiriladi.',
          'Yuan kursi hisob-kitob kunidagi Oʻzbekiston Markaziy banki kursi asosida olinadi; ustama boʻlsa, u hisobda alohida qator sifatida yoziladi. Sotuvchiga toʻlovni biz Alipay, WeChat Pay yoki xitoy kompaniya hisobimizdan oʻtkazamiz — 1688 va Taobao tizimida pul tovar qabul qilinguncha platformada turadi, shuning uchun sotuvchi joʻnatmasa, summa qaytadi.',
        ],
        callout: {
          title: 'Toʻlov qachon?',
          text: 'Tovar narxi va komissiya — buyurtmadan oldin (sotuvchiga biz oldindan toʻlaymiz). Ivu → Toshkent tashish haqi — yuk Toshkent omboriga kelganda, soʻmda. Muntazam mijozlar uchun boshqa jadvalni shartnomada kelishamiz.',
          tone: 'info',
        },
      },
      {
        heading: 'Tovar kelganda nimani tekshirasiz?',
        body: [
          'Ivu omboridagi standart qabul tashish narxiga kiradi: posilka soni, tashqi holati, ogʻirligi va oʻlchami, kodingiz bilan markirovka, tashqi foto. Qoʻshimcha 1 $/kg evaziga qutini ochib sonini, rangini, oʻlchamini va koʻrinadigan nuqsonlarini tekshiramiz; elektronikani tokka ulab koʻramiz.',
          'Tovar tavsifga mos kelmasa, sotuvchi bilan qaytarishni oʻzimiz rasmiylashtiramiz: 1688 va Taobaoda qabuldan keyin 7 kun ichida sababsiz qaytarish huquqi bor, Xitoy ichidagi qaytarish pochtasini sotuvchi yoki siz toʻlaysiz (odatda 5–12 yuan). Shuning uchun tekshiruvni Ivuda — tovar Toshkentga chiqib ketmasdan oldin — buyurtma qiling.',
        ],
        bullets: [
          'Kiyim va poyabzal: soni, oʻlcham jadvali, tikuv, dogʻ — 1 $/kg tekshiruv bilan.',
          'Elektronika va telefon aksessuarlari: ishlashi, toʻplam butligi; litiy batareyali tovar faqat avto kargo bilan boradi.',
          'Brend tovar: faqat Tmall yoki rasmiy doʻkondan; kontrafaktni sotib olmaymiz va tashimaymiz.',
          'Suyuqlik, kosmetika, magnit: avia orqali boʻlmaydi — avto orqali alohida qadoqlab yuboramiz.',
        ],
      },
      {
        heading: 'Bojxona: jismoniy shaxsmi yoki tijorat partiyasimi?',
        body: [
          'Yigʻma yuk tarifiga bojxona rasmiylashtiruvi kompaniya hujjatlari bilan kiritilgan — «bojsiz» degan vaʼda bermaymiz, boj va QQS qonun boʻyicha toʻlanadi. Doʻkon yoki marketpleys uchun muntazam partiya olsangiz, tovarni oʻz firmangiz yoki YaTT nomiga rasmiy import qilishni tavsiya qilamiz: boj TN VED kodi boʻyicha (kiyim 20% + minimal stavka, telefon 5%, oʻyinchoq 10%), QQS 12%, bojxona yigʻimi BRV da — buni oldindan hisoblab beramiz.',
          'Jismoniy shaxs sifatida xalqaro pochta yoki kuryer orqali oyiga 200 $ gacha tovar uchun boj olinmaydi; undan ortigʻiga 30%, lekin kilogrammiga kamida 3 $ (2027-yil 1-yanvardan — 20% va 2 $). Bir xil tovardan koʻp miqdor bojxonada tijorat partiyasi deb baholanishi mumkin.',
        ],
        callout: {
          title: 'Menejer maslahati',
          text: '1688-da bir sotuvchidan 10 donadan koʻp olsangiz, yozib narxni soʻrang — koʻp sotuvchilar «拿样价» (namuna narxi) oʻrniga «批发价» (ulgurji narx) beradi, farq 10–15%. Buni biz sotuvchi bilan oʻzimiz gaplashib olamiz; siz faqat «narxni tushirib koʻring» deb yozsangiz kifoya.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: '1688-dan buyurtma bersam komissiya qancha?',
        a: 'Buyurtma summasining 3% dan; foiz hisob-kitobda alohida qator sifatida koʻrsatiladi. Xitoy ichidagi yetkazib berish va Ivu → Toshkent tashish (6,5 $/kg dan yoki 110 $/m³ dan, taxminan, 2026-yil 8-sentabr) alohida hisoblanadi.',
      },
      {
        q: 'Yuan kursi qaysi?',
        a: 'Hisob-kitob kunidagi Oʻzbekiston Markaziy banki kursi asosida; masalan, 2026-yil 8-sentabrda 1 yuan = 1 756,72 soʻm. Ustama boʻlsa, u tovar narxiga qoʻshilmaydi, alohida qatorda yoziladi.',
      },
      {
        q: 'Xitoy kartasi, Alipay yoki xitoy tili kerakmi?',
        a: 'Yoʻq. Sotuvchiga biz oʻz akkauntimizdan Alipay yoki WeChat Pay orqali yuanda toʻlaymiz va u bilan xitoy tilida yozishamiz. Siz soʻmda toʻlaysiz va Telegramda oʻzbek yoki rus tilida yozasiz.',
      },
      {
        q: 'Taobao va Pinduoduodan ham olib berasizmi?',
        a: 'Ha: 1688, Taobao, Tmall, Pinduoduo va Alibaba. Pinduoduo tovarini Ivu omborida 1 $/kg evaziga ochib tekshirishni tavsiya qilamiz — u yerda sifat notekis, qaytarish esa faqat Xitoy ichida ishlaydi.',
      },
      {
        q: 'Tovar necha kunda keladi?',
        a: 'Sotuvchi tovarni Ivu omboriga odatda 1–5 kunda joʻnatadi; keyin yigʻma yuk bilan taxminan 15–25 kun yoki avia bilan 5–10 kun. Turli sotuvchilardan kelgan posilkalarni 14 kungacha bepul saqlab, bitta yukka jamlaymiz.',
      },
      {
        q: 'Tovar nuqsonli yoki boshqa chiqsa nima boʻladi?',
        a: 'Ivuda tekshiruvda aniqlansa, sotuvchiga qaytarishni oʻzimiz rasmiylashtiramiz (1688 va Taobaoda 7 kun ichida) va pul platformadan qaytadi. Toshkentda aniqlansa, qaytarish qiyin — shuning uchun tekshiruvni Ivuda buyurtma qiling.',
      },
      {
        q: 'Bitta dona buyurtma qilsam boʻladimi?',
        a: 'Ha, Taobao va Pinduoduodan 1 donadan olamiz. 1688-da sotuvchilar odatda 2–10 donadan sotadi. Tashishda minimal ogʻirlik 1 kg (avto) yoki 0,5 kg (avia).',
      },
      {
        q: 'Toʻlovni qanday va qachon qilaman?',
        a: 'Tovar narxi va komissiya — buyurtmadan oldin, soʻmda: karta, Click, Payme yoki ofisda naqd; yuridik shaxslar uchun hisob-faktura va bank oʻtkazmasi. Tashish haqi — yuk Toshkentga kelganda.',
      },
    ],
    related: ['truck', 'warehouse', 'sourcing'],
    guideKeys: ['order-from-1688', 'cargo-pricing', 'customs-2026', 'prohibited-goods'],
    cta: {
      title: 'Havolani yuboring — hisob-kitobni olasiz.',
      text: 'Tovar havolasi, rangi, oʻlchami va sonini yozing. Menejer narxni MB kursi boʻyicha dollarda, komissiya va tashish bilan alohida qatorlarda hisoblab beradi.',
      draft: 'Assalomu alaykum! 1688 / Taobaodan tovar sotib olish kerak. Havola: … Rang/oʻlcham: … Soni: … Yetkazish: avto / avia',
    },
    updated: '2026-09-08',
  },

  ru: {
    key: 'buying',
    seo: {
      title: 'Выкуп товаров с 1688, Taobao и Alibaba — комиссия от 3%',
      description:
        'Присылаете ссылку — мы считаем цену в долларах, платим продавцу в юанях, проверяем товар на складе в Иу и привозим в Ташкент. 1688, Taobao, Pinduoduo, Alibaba. Комиссия от 3%, оплата в сумах.',
    },
    hero: {
      eyebrow: 'Услуга 05 — Выкуп',
      h1: 'Выкуп товаров с 1688, Taobao и Alibaba',
      intro:
        'Выкуп — это когда вы присылаете ссылку на товар с 1688, Taobao, Pinduoduo или Alibaba, а мы считаем цену в долларах по курсу Центрального банка, платим продавцу в юанях, принимаем и проверяем товар на складе в Иу (义乌) и привозим его в Ташкент сборным грузом ориентировочно за 15–25 дней. Стоимость услуги — от 3% суммы заказа. Китайская карта, Alipay и знание китайского не нужны.',
      facts: [
        { label: 'Комиссия от суммы заказа', value: 'от 3%' },
        { label: 'Площадки: 1688, Taobao, Pinduoduo, Alibaba', value: '4 площадки' },
        { label: 'Курс юаня', value: 'по курсу ЦБ' },
        { label: 'До Ташкента, авто', value: '15–25 дней' },
      ],
    },
    sections: [
      {
        heading: 'Как работает выкуп?',
        body: [
          'Китайские площадки принимают оплату только с китайской карты или Alipay, продавцы пишут только по-китайски, а товар отправляют только на адрес внутри Китая. Мы убираем все три барьера: платим, переписываемся и даём адрес склада в Иу.',
        ],
        steps: [
          { title: 'Вы присылаете ссылку', text: 'В Telegram пишете ссылку на товар, цвет, размер и количество. В одном сообщении может быть и одна, и пятьдесят ссылок; достаточно кнопки «поделиться» в приложении площадки.' },
          { title: 'Получаете расчёт', text: 'Менеджер переводит цену из юаней в доллары по курсу ЦБ, добавляет доставку продавца внутри Китая и нашу комиссию. В расчёте каждая строка показана отдельно — и курс, и процент.' },
          { title: 'Оплачиваете', text: 'В сумах по курсу на день расчёта: переводом на карту, через Click или Payme, наличными в офисе. Для юридических лиц — счёт-фактура и банковский перевод. После оплаты заказ размещается в тот же день.' },
          { title: 'Мы платим продавцу в юанях', text: 'Размещаем заказ со своего аккаунта, переписываемся с продавцом по-китайски — подтверждаем цвет, размер, срок отправки. Деньги удерживаются платформой, пока товар не придёт в Иу.' },
          { title: 'Принимаем на складе в Иу', text: 'Внутри Китая товар обычно доходит до склада за 1–5 дней. Каждую посылку принимаем под вашим кодом, проверяем количество и внешнее состояние, отправляем фотоотчёт. Бракованный товар возвращаем продавцу.' },
          { title: 'Консолидация и Ташкент', text: 'Посылки от разных продавцов собираются в один груз, переупаковываются и едут в Ташкент сборным грузом (ориентировочно 15–25 дней) или авиа (5–10 дней). В Ташкенте забираете сами или доставляем до двери.' },
        ],
      },
      {
        heading: 'Из чего складывается цена?',
        body: [
          'Итоговая сумма состоит из четырёх частей, и каждая видна в расчёте отдельно. Наценка на курс не прячется в цену товара — это отдельная строка.',
        ],
        table: {
          caption: 'Состав стоимости выкупа',
          head: ['Часть', 'Как считается', 'Ориентировочно'],
          rows: [
            ['Цена товара', 'юани → доллары по курсу ЦБ на день расчёта', 'цена на площадке'],
            ['Комиссия', 'процент от цены товара', 'от 3%'],
            ['Доставка внутри Китая', 'назначает продавец; на 1688 часто бесплатно или 5–15 юаней', 'тариф продавца'],
            ['Перевозка Иу → Ташкент', 'по кг или м³ в зависимости от плотности', 'от 6,5 $/кг · от 110 $/м³'],
            ['Дополнительно (по желанию)', 'проверка 1 $/кг · фото со вскрытием 1 $ · переупаковка 0,4 $/кг', 'по выбору'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. Курс юаня и доллара берётся по курсу Центрального банка и показывается в расчёте на день оплаты.',
        },
        callout: {
          title: 'Пример: 50 сумок с 1688',
          text: '50 шт. × 38 юаней = 1 900 юаней. По курсу ЦБ на 8 сентября 2026 г. (1 юань = 1 756,72 сума, 1 $ = 11 789,33 сума) это ≈ 283 $; комиссия 3% ≈ 8,5 $. Товар ≈ 3 340 000 сумов + комиссия ≈ 100 000 сумов. Перевозка отдельно: 50 сумок ≈ 20 кг, 0,15 м³ → плотность 133 кг/м³ → считаем по объёмному весу.',
          tone: 'info',
        },
      },
      {
        heading: 'На какой площадке что покупать?',
        body: [
          'Четыре площадки — четыре разные задачи. Один и тот же товар на 1688 стоит на 20–40% дешевле, чем на Taobao, но 1688 — оптовая площадка, и продавец редко отпускает меньше 2–10 шт. Pinduoduo — самая дешёвая и самая неровная по качеству; без проверки не берите.',
        ],
        table: {
          caption: 'Сравнение китайских площадок',
          head: ['Площадка', 'Для чего', 'Минимальный заказ', 'На что смотреть'],
          rows: [
            ['1688.com', 'опт: одежда, обувь, аксессуары, товары для дома, запчасти', '2–10 шт. (зависит от продавца)', 'рейтинг продавца, «回头率» (доля повторных покупок), отметка фабрики'],
            ['Taobao / Tmall', 'розница, брендовые магазины, широкий выбор, 1 шт.', '1 шт.', 'Tmall — официальные магазины; на Taobao — рейтинг и отзывы'],
            ['Pinduoduo', 'самые дешёвые мелкие товары, для теста', '1 шт.', 'качество разное; рекомендуем проверку и фото в Иу'],
            ['Alibaba.com', 'экспортные заказы, в долларах, крупные партии, договор', '100–500 шт.', 'Trade Assurance; цена указана как FOB/EXW'],
          ],
          note: 'Площадки отправляют только на адрес внутри Китая — адрес склада в Иу вы получаете до заказа.',
        },
      },
      {
        heading: 'Как платить и какой курс юаня?',
        body: [
          'В Узбекистане вы платите в сумах: переводом с карты Humo или Uzcard, через Click и Payme, наличными в офисе (Ташкент, ул. Алишера Навои, 27). Для юридических лиц и ИП возможны счёт-фактура и банковский перевод — тогда товар оформляется на вашу фирму.',
          'Курс юаня берётся по курсу Центрального банка Узбекистана на день расчёта; если есть наценка, она записывается в расчёте отдельной строкой. Продавцу платим мы — через Alipay, WeChat Pay или со счёта нашей китайской компании. На 1688 и Taobao деньги удерживаются платформой до подтверждения получения, поэтому если продавец не отправит товар, сумма возвращается.',
        ],
        callout: {
          title: 'Когда платить?',
          text: 'Цену товара и комиссию — до заказа (продавцу мы платим вперёд). Перевозку Иу → Ташкент — по прибытии груза на склад в Ташкенте, в сумах. Для постоянных клиентов другой график фиксируем в договоре.',
          tone: 'info',
        },
      },
      {
        heading: 'Что вы проверяете при получении?',
        body: [
          'Стандартная приёмка на складе в Иу входит в стоимость перевозки: количество посылок, внешнее состояние, вес и габариты, маркировка вашим кодом, фото снаружи. За дополнительный 1 $/кг вскрываем коробку и проверяем количество, цвет, размер и видимые дефекты; электронику включаем.',
          'Если товар не соответствует описанию, возврат продавцу оформляем сами: на 1688 и Taobao действует право возврата без объяснения причин в течение 7 дней после получения, обратную доставку внутри Китая оплачивает продавец или вы (обычно 5–12 юаней). Поэтому проверку заказывайте в Иу — до того, как товар уедет в Ташкент.',
        ],
        bullets: [
          'Одежда и обувь: количество, размерная сетка, швы, пятна — с проверкой 1 $/кг.',
          'Электроника и аксессуары для телефонов: работоспособность, комплектность; товар с литиевыми батареями едет только авто карго.',
          'Брендовый товар: только с Tmall или из официального магазина; контрафакт не выкупаем и не возим.',
          'Жидкости, косметика, магниты: авиа нельзя — отправляем авто в отдельной упаковке.',
        ],
      },
      {
        heading: 'Таможня: физлицо или коммерческая партия?',
        body: [
          'В тариф сборного груза входит таможенное оформление по документам компании — «без пошлин» мы не обещаем, пошлина и НДС платятся по закону. Если вы регулярно возите партии для магазина или маркетплейса, рекомендуем оформлять импорт на свою фирму или ИП: пошлина по коду ТН ВЭД (одежда 20% + минимальная ставка, телефоны 5%, игрушки 10%), НДС 12%, сбор за оформление в БРВ — всё это считаем заранее.',
          'Как физлицо через международную почту или курьера вы получаете без пошлины товар на сумму до 200 $ в месяц; сверх этого — 30%, но не менее 3 $ за кг (с 1 января 2027 г. — 20% и 2 $). Большое количество одинакового товара таможня может признать коммерческой партией.',
        ],
        callout: {
          title: 'Совет менеджера',
          text: 'Если берёте у одного продавца на 1688 больше 10 шт., стоит запросить цену в переписке — многие вместо «拿样价» (цены за образец) дают «批发价» (оптовую), разница 10–15%. Это делаем мы; вам достаточно написать «попробуйте снизить цену».',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'Какая комиссия за выкуп с 1688?',
        a: 'От 3% суммы заказа; процент показан в расчёте отдельной строкой. Доставка внутри Китая и перевозка Иу → Ташкент (от 6,5 $/кг или от 110 $/м³, ориентировочно, 8 сентября 2026 г.) считаются отдельно.',
      },
      {
        q: 'По какому курсу считаете юань?',
        a: 'По курсу Центрального банка Узбекистана на день расчёта; например, 8 сентября 2026 г. 1 юань = 1 756,72 сума. Если есть наценка, она не прячется в цену товара, а записывается отдельной строкой.',
      },
      {
        q: 'Нужны ли китайская карта, Alipay или китайский язык?',
        a: 'Нет. Продавцу платим мы со своего аккаунта через Alipay или WeChat Pay в юанях и переписываемся с ним по-китайски. Вы платите в сумах и пишете нам в Telegram на русском или узбекском.',
      },
      {
        q: 'Выкупаете ли с Taobao и Pinduoduo?',
        a: 'Да: 1688, Taobao, Tmall, Pinduoduo и Alibaba. Товар с Pinduoduo советуем вскрывать и проверять в Иу за 1 $/кг — качество там неровное, а возврат работает только внутри Китая.',
      },
      {
        q: 'Сколько дней идёт товар?',
        a: 'Продавец обычно доставляет товар на склад в Иу за 1–5 дней; дальше сборным грузом ориентировочно 15–25 дней или авиа 5–10 дней. Посылки от разных продавцов храним до 14 дней бесплатно и собираем в один груз.',
      },
      {
        q: 'Что будет, если товар бракованный или не тот?',
        a: 'Если это выявлено при проверке в Иу, возврат продавцу оформляем сами (на 1688 и Taobao — в течение 7 дней), и деньги возвращаются через платформу. В Ташкенте вернуть уже сложно — поэтому заказывайте проверку в Иу.',
      },
      {
        q: 'Можно заказать одну штуку?',
        a: 'Да, с Taobao и Pinduoduo выкупаем от 1 шт. На 1688 продавцы обычно отпускают от 2–10 шт. Минимальный вес перевозки — 1 кг (авто) или 0,5 кг (авиа).',
      },
      {
        q: 'Как и когда платить?',
        a: 'Цену товара и комиссию — до заказа, в сумах: картой, через Click, Payme или наличными в офисе; для юридических лиц — счёт-фактура и банковский перевод. Перевозку — по прибытии груза в Ташкент.',
      },
    ],
    related: ['truck', 'warehouse', 'sourcing'],
    guideKeys: ['order-from-1688', 'cargo-pricing', 'customs-2026', 'prohibited-goods'],
    cta: {
      title: 'Пришлите ссылку — получите расчёт.',
      text: 'Напишите ссылку на товар, цвет, размер и количество. Менеджер посчитает цену в долларах по курсу ЦБ, комиссию и перевозку — каждую строку отдельно.',
      draft: 'Здравствуйте! Нужен выкуп с 1688 / Taobao. Ссылка: … Цвет/размер: … Количество: … Доставка: авто / авиа',
    },
    updated: '2026-09-08',
  },

  en: {
    key: 'buying',
    seo: {
      title: 'Buying agent for 1688, Taobao and Alibaba — commission from 3%',
      description:
        'Send us a link — we quote in US dollars, pay the seller in yuan, check the goods at the Yiwu warehouse and deliver to Tashkent. 1688, Taobao, Pinduoduo, Alibaba. Commission from 3%, payment in UZS.',
    },
    hero: {
      eyebrow: 'Service 05 — Buying agent',
      h1: 'Buying from 1688, Taobao and Alibaba',
      intro:
        'Our buying service works like this: you send a product link from 1688, Taobao, Pinduoduo or Alibaba; we quote the price in US dollars at the Central Bank rate, pay the seller in yuan, receive and check the goods at our Yiwu (义乌) warehouse and bring them to Tashkent by consolidated truck in roughly 15–25 days. The fee starts at 3% of the order value. No Chinese bank card, Alipay account or Chinese language needed.',
      facts: [
        { label: 'Commission on order value', value: 'from 3%' },
        { label: 'Platforms: 1688, Taobao, Pinduoduo, Alibaba', value: '4 platforms' },
        { label: 'Yuan rate', value: 'Central Bank rate' },
        { label: 'To Tashkent by truck', value: '15–25 days' },
      ],
    },
    sections: [
      {
        heading: 'How does the buying service work?',
        body: [
          'Chinese marketplaces accept payment only from a Chinese bank card or Alipay, sellers write only in Chinese, and goods ship only to an address inside China. We remove all three barriers: we pay, we write, and we provide the Yiwu warehouse address.',
        ],
        steps: [
          { title: 'You send the link', text: 'On Telegram you send the product link, colour, size and quantity. One message can hold one link or fifty; the “share” button in the marketplace app is enough.' },
          { title: 'You get a quote', text: 'Your manager converts the price from yuan to dollars at the Central Bank rate and adds the seller’s domestic shipping and our commission. Every line is shown separately — the rate and the percentage included.' },
          { title: 'You pay', text: 'In UZS at the rate on the day of the quote: card transfer, Click or Payme, cash at the office. Legal entities get an invoice and pay by bank transfer. The order is placed the same day.' },
          { title: 'We pay the seller in yuan', text: 'We place the order from our own account and message the seller in Chinese to confirm colour, size and dispatch date. The platform holds the money until the goods reach Yiwu.' },
          { title: 'We receive in Yiwu', text: 'Inside China the goods usually reach the warehouse in 1–5 days. We receive each parcel under your code, check the count and outer condition and send a photo report. Defective goods go back to the seller.' },
          { title: 'Consolidation and Tashkent', text: 'Parcels from different sellers are combined into one shipment, repacked and sent to Tashkent by consolidated truck (roughly 15–25 days) or air (5–10 days). In Tashkent you collect or we deliver to your door.' },
        ],
      },
      {
        heading: 'What makes up the price?',
        body: [
          'The total has four parts, each shown as its own line in the quote. Any exchange-rate margin is never hidden inside the product price — it is a separate line.',
        ],
        table: {
          caption: 'Breakdown of the buying service price',
          head: ['Part', 'How it is calculated', 'Indicative'],
          rows: [
            ['Product price', 'yuan → dollars at the Central Bank rate on the day of the quote', 'marketplace price'],
            ['Commission', 'percentage of the product price', 'from 3%'],
            ['Shipping inside China', 'set by the seller; on 1688 often free or 5–15 yuan', 'seller’s rate'],
            ['Freight Yiwu → Tashkent', 'per kg or m³ depending on density', 'from $6.50/kg · from $110/m³'],
            ['Optional extras', 'inspection $1/kg · opened-box photo $1 · repacking $0.40/kg', 'as chosen'],
          ],
          note: 'Estimates · Updated September 8, 2026. Yuan and dollar rates follow the Central Bank of Uzbekistan and are shown in the quote on the day of payment.',
        },
        callout: {
          title: 'Example: 50 bags from 1688',
          text: '50 pcs × 38 yuan = 1,900 yuan. At the Central Bank rate of September 8, 2026 (1 yuan = 1,756.72 UZS, $1 = 11,789.33 UZS) that is ≈ $283; the 3% commission ≈ $8.50. Goods ≈ 3,340,000 UZS + commission ≈ 100,000 UZS. Freight is separate: 50 bags ≈ 20 kg, 0.15 m³ → density 133 kg/m³ → priced by volumetric weight.',
          tone: 'info',
        },
      },
      {
        heading: 'Which platform for what?',
        body: [
          'Four platforms, four different jobs. The same item costs 20–40% less on 1688 than on Taobao, but 1688 is wholesale and sellers rarely ship fewer than 2–10 pieces. Pinduoduo is the cheapest and the most uneven in quality — never buy there without an inspection.',
        ],
        table: {
          caption: 'Comparing Chinese marketplaces',
          head: ['Platform', 'What for', 'Minimum order', 'What to look at'],
          rows: [
            ['1688.com', 'wholesale: clothing, footwear, accessories, household goods, spare parts', '2–10 pcs (depends on seller)', 'seller rating, «回头率» (repeat-purchase rate), factory badge'],
            ['Taobao / Tmall', 'retail, brand stores, wide choice, single items', '1 pc', 'Tmall = official stores; on Taobao check rating and reviews'],
            ['Pinduoduo', 'cheapest small goods, for testing', '1 pc', 'quality varies; inspection and photos in Yiwu recommended'],
            ['Alibaba.com', 'export orders, in dollars, large batches, contract', '100–500 pcs', 'Trade Assurance; prices quoted FOB/EXW'],
          ],
          note: 'Marketplaces ship only to an address inside China — you receive the Yiwu warehouse address before ordering.',
        },
      },
      {
        heading: 'How do I pay, and which yuan rate applies?',
        body: [
          'In Uzbekistan you pay in UZS: transfer from a Humo or Uzcard card, Click and Payme, or cash at our office (27 Alisher Navoiy Street, Tashkent). Legal entities and sole traders can pay by bank transfer against an invoice — in that case the goods are imported in your company’s name.',
          'The yuan rate follows the Central Bank of Uzbekistan on the day of the quote; if a margin applies, it is written as a separate line. We pay the seller through Alipay, WeChat Pay or our Chinese company account. On 1688 and Taobao the platform holds the money until receipt is confirmed, so if the seller fails to ship, the amount comes back.',
        ],
        callout: {
          title: 'When do I pay?',
          text: 'Product price and commission — before the order (we pay the seller upfront). Freight Yiwu → Tashkent — when the cargo arrives at the Tashkent warehouse, in UZS. Regular clients can agree a different schedule in the contract.',
          tone: 'info',
        },
      },
      {
        heading: 'What do you check on arrival?',
        body: [
          'Standard receiving at the Yiwu warehouse is included in the freight price: parcel count, outer condition, weight and dimensions, labelling with your code, an outside photo. For an extra $1/kg we open the box and check quantity, colour, size and visible defects; electronics are powered on.',
          'If the goods do not match the listing, we handle the return with the seller ourselves: 1688 and Taobao allow a no-questions return within 7 days of receipt, and the return postage inside China is paid by the seller or by you (usually 5–12 yuan). That is why an inspection should be ordered in Yiwu — before the goods leave for Tashkent.',
        ],
        bullets: [
          'Clothing and footwear: count, size chart, stitching, stains — with the $1/kg inspection.',
          'Electronics and phone accessories: function and completeness; anything with lithium batteries travels by truck only.',
          'Branded goods: only from Tmall or an official store; we do not buy or ship counterfeits.',
          'Liquids, cosmetics, magnets: not by air — we send them by truck in separate packaging.',
        ],
      },
      {
        heading: 'Customs: private individual or commercial batch?',
        body: [
          'Customs clearance under the company’s documents is included in the consolidated-cargo rate — we never promise “no duty”; duty and VAT are paid as the law requires. If you regularly import batches for a shop or marketplace, we recommend importing in your own company’s or sole-trader’s name: duty by HS code (clothing 20% plus a minimum rate, phones 5%, toys 10%), VAT 12%, a clearance fee in BRV — all of which we calculate in advance.',
          'As a private individual using international post or courier you can receive up to $200 of goods per month duty-free; above that, 30% but at least $3 per kg (from January 1, 2027 — 20% and $2). A large quantity of identical goods may be treated by customs as a commercial batch.',
        ],
        callout: {
          title: 'Manager’s tip',
          text: 'When you buy more than 10 pieces from one 1688 seller, ask for a price in chat — many sellers replace the «拿样价» (sample price) with the «批发价» (wholesale price), a 10–15% difference. We do the asking; you only need to write “please try to lower the price”.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'What is the commission for buying from 1688?',
        a: 'From 3% of the order value; the percentage appears as a separate line in the quote. Shipping inside China and freight Yiwu → Tashkent (from $6.50/kg or from $110/m³, estimates as of September 8, 2026) are charged separately.',
      },
      {
        q: 'Which yuan exchange rate do you use?',
        a: 'The Central Bank of Uzbekistan rate on the day of the quote; on September 8, 2026, for example, 1 yuan = 1,756.72 UZS. Any margin is never hidden in the product price but shown as its own line.',
      },
      {
        q: 'Do I need a Chinese card, Alipay or Chinese?',
        a: 'No. We pay the seller in yuan from our own account via Alipay or WeChat Pay and message them in Chinese. You pay in UZS and write to us on Telegram in Uzbek or Russian.',
      },
      {
        q: 'Do you also buy from Taobao and Pinduoduo?',
        a: 'Yes: 1688, Taobao, Tmall, Pinduoduo and Alibaba. For Pinduoduo goods we recommend the $1/kg opened-box inspection in Yiwu — quality there is uneven and returns work only inside China.',
      },
      {
        q: 'How many days does it take?',
        a: 'The seller usually delivers to the Yiwu warehouse in 1–5 days; then roughly 15–25 days by consolidated truck or 5–10 days by air. Parcels from different sellers are stored free for up to 14 days and combined into one shipment.',
      },
      {
        q: 'What if the goods are defective or wrong?',
        a: 'If it is found during the inspection in Yiwu, we file the return with the seller ourselves (within 7 days on 1688 and Taobao) and the platform refunds the money. Once in Tashkent a return is hard — so order the inspection in Yiwu.',
      },
      {
        q: 'Can I order a single item?',
        a: 'Yes, from Taobao and Pinduoduo we buy from 1 piece. On 1688 sellers usually ship from 2–10 pieces. The minimum freight weight is 1 kg by truck or 0.5 kg by air.',
      },
      {
        q: 'How and when do I pay?',
        a: 'Product price and commission — before the order, in UZS: card, Click, Payme or cash at the office; legal entities pay by bank transfer against an invoice. Freight — when the cargo arrives in Tashkent.',
      },
    ],
    related: ['truck', 'warehouse', 'sourcing'],
    guideKeys: ['order-from-1688', 'cargo-pricing', 'customs-2026', 'prohibited-goods'],
    cta: {
      title: 'Send the link. Get the quote.',
      text: 'Send the product link, colour, size and quantity. Your manager quotes the price in dollars at the Central Bank rate, with commission and freight on separate lines.',
      draft: 'Hello! I need a purchase from 1688 / Taobao. Link: … Colour/size: … Quantity: … Delivery: truck / air',
    },
    updated: '2026-09-08',
  },
};

export default content;
