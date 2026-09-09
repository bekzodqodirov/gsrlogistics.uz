import type { ServiceContentByLang } from './types';

/**
 * Tovar va ishlab chiqaruvchi topish (sourcing) — long-form page content.
 * Figures: commission "3% dan" = site.sourcingCommissionPct / tariffs.extras.sourcingCommissionPct (2026-09-08);
 * the 5% / 10% tiers mirror the Tashkent market (research wf/10 §6) and must be confirmed by the owner.
 * Transit days mirror tariffs.json (truck 15–25, air 5–10). Sample lead times are Chinese-factory norms, labelled "odatda".
 */
const content: ServiceContentByLang = {
  uz: {
    key: 'sourcing',
    seo: {
      title: 'Xitoydan tovar va ishlab chiqaruvchi topish — komissiya 3% dan',
      description:
        'Xitoyda zavod yoki yetkazib beruvchi topamiz, narx va MOQni kelishamiz, namunani tekshiramiz va partiyani Toshkentga olib kelamiz. Xodimlar xitoy tilida gaplashadi. Komissiya buyurtma summasining 3% dan.',
    },
    hero: {
      eyebrow: 'Xizmat 04 — Tovar topish',
      h1: 'Xitoydan tovar va ishlab chiqaruvchi topish',
      intro:
        'Tovar topish — bu sizning talabingiz boʻyicha Xitoyda ishlab chiqaruvchi yoki yetkazib beruvchini izlash, narx va minimal partiyani kelishish, namunani tekshirish va tayyor partiyani Toshkentga olib kelish. Xodimlarimiz xitoy tilida gaplashadi, shuning uchun zavod bilan oʻzingiz yozishishingiz shart emas. Xizmat haqi — buyurtma summasining 3% dan. Tovar Ivu (义乌) omboriga keladi va yigʻma yuk bilan taxminan 15–25 kunda Toshkentga yetadi.',
      facts: [
        { label: 'Komissiya, buyurtma summasidan', value: '3% dan' },
        { label: 'Jarayon', value: '5 bosqich' },
        { label: 'Menejer tillari: oʻzbek, rus, xitoy', value: '3 til' },
        { label: 'Toshkentgacha, avto', value: '15–25 kun' },
      ],
    },
    sections: [
      {
        heading: 'Tovar topish kimga kerak?',
        body: [
          'Xitoyda kerakli tovarni topish oson, ishonchli zavodni topish esa qiyin: 1688-da bitta mahsulotga yuzlab sotuvchi chiqadi, ularning yarmi vositachi, narxlar ikki barobar farq qiladi, sifat esa faqat tovar kelganda maʼlum boʻladi. Biz bu yoʻlni siz uchun bosib oʻtamiz — Ivudagi xodimlarimiz zavodga qoʻngʻiroq qiladi, namunani qoʻlda tekshiradi va narxni kelishadi.',
          'Xizmat quyidagi holatlarda oʻzini oqlaydi:',
        ],
        bullets: [
          'Ulgurji savdo (Abu Sahiy, Chorsu, Bek Baraka): oʻz brendingiz ostida kiyim, poyabzal, uy-roʻzgʻor mollari ishlab chiqartirmoqchisiz — zavod, narx va MOQ kerak.',
          'Uzum, Yandex Market va Instagram sotuvchilari: 1688-da topgan tovaringizning arzonroq va sifatliroq manbasini izlaysiz.',
          'Ishlab chiqaruvchilar: xomashyo, komponentlar, qadoqlash materiali yoki ehtiyot qismlar — texnik spetsifikatsiya boʻyicha aniq zavod kerak.',
          'Qurilish va sanoat (Urikzor, Qoʻyliq): plitka, santexnika, elektr mollari — sertifikatli ishlab chiqaruvchidan toʻgʻridan-toʻgʻri.',
        ],
      },
      {
        heading: 'Tovar topish xizmati qanday ishlaydi?',
        body: [
          'Jarayon besh bosqichdan iborat: qidiruv, muzokara, namuna, tekshiruv, yetkazib berish. Har bir bosqichda siz qaror qabul qilasiz, biz esa maʼlumot va variantlarni tayyorlaymiz.',
        ],
        steps: [
          { title: 'Soʻrov va texnik topshiriq', text: 'Tovarning nomi, rasmi yoki havolasi, kerakli miqdor, sifat talabi (material, oʻlcham, brend, sertifikat) va taxminiy byudjetni yozasiz. Shu asosda qidiruv mezonlarini kelishamiz.' },
          { title: 'Qidiruv va muzokara', text: 'Ivudagi xodimlarimiz zavodlar, 1688 va Alibaba sotuvchilari, Ivu Futian bozori orasidan 3–5 ta taklif yigʻadi: narx, MOQ, ishlab chiqarish muddati, qadoqlash, sertifikatlar. Muzokarani xitoy tilida oʻzimiz olib boramiz.' },
          { title: 'Namuna', text: 'Tanlagan 1–2 zavoddan namuna buyurtma qilamiz. Namuna Ivu omboriga keladi — suratga olamiz, oʻlchaymiz, video yuboramiz; xohlasangiz, avia bilan taxminan 5–10 kunda Toshkentga joʻnatamiz.' },
          { title: 'Zavod tekshiruvi va shartnoma', text: 'Zavodning biznes-litsenziyasi, ishlab chiqarish quvvati va eksport tajribasini tekshiramiz. Keyin spetsifikatsiya, sifat mezonlari, muddat va toʻlov jadvali yozilgan shartnoma tuziladi.' },
          { title: 'Ishlab chiqarish nazorati va yetkazib berish', text: 'Yuklashdan oldin partiyani tekshiramiz (soni, sifat, qadoqlash) va foto-hisobot yuboramiz. Tovar Ivu omborida konsolidatsiya qilinadi va yigʻma yuk yoki konteyner bilan Toshkentga keladi; bojxona rasmiylashtiruvi bizning zimmamizda.' },
        ],
      },
      {
        heading: 'Zavoddan toʻgʻridan-toʻgʻri yoki 1688 orqali?',
        body: [
          'Manbani tovar va miqdorga qarab tanlaymiz. 1688 — ulgurji bozor, u yerda ham zavodlar, ham vositachilar sotadi; toʻgʻridan-toʻgʻri zavod — katta va takrorlanadigan partiyalar uchun; Taobao va Pinduoduo — kichik miqdor va chakana tovar uchun. Quyidagi jadval asosiy farqlarni koʻrsatadi.',
        ],
        table: {
          caption: 'Tovar manbalarini taqqoslash',
          head: ['Manba', 'Kimga mos', 'Odatiy MOQ', 'Narx', 'Xavf va nazorat'],
          rows: [
            ['Zavod (ishlab chiqaruvchi)', 'oʻz brendi, doimiy partiyalar, texnik tovar', '300–1 000 dona yoki 1 model', 'eng past', 'shartnoma, namuna, zavod tekshiruvi shart'],
            ['1688 (ulgurji sayt)', 'doʻkon va marketpleys sotuvchilari', '2–50 dona', 'past', 'sotuvchi reytingi va qaytarish tarixi tekshiriladi'],
            ['Ivu Futian bozori', 'mayda tovarlar, aksessuar, oʻyinchoq, sovgʻa', '1 quti (odatda 100–500 dona)', 'past', 'tovarni joyida koʻrish mumkin'],
            ['Taobao / Pinduoduo', 'chakana, 1–10 dona, sinov uchun', '1 dona', 'oʻrtacha', 'sifat turlicha — Ivuda tekshiruv tavsiya etiladi'],
            ['Alibaba', 'eksport shartnomasi, USD toʻlov, katta partiya', '500 dona dan', 'oʻrtacha', 'Trade Assurance, ingliz tilida muloqot'],
          ],
          note: 'MOQ va narxlar tovar turiga qarab farq qiladi; jadvaldagi raqamlar odatiy diapazon. Aniq taklifni soʻrovingizdan keyin beramiz.',
        },
      },
      {
        heading: 'MOQ nima va uni kamaytirib boʻladimi?',
        body: [
          'MOQ (minimum order quantity) — zavod bitta buyurtmada qabul qiladigan eng kam miqdor. Kiyimda odatda bitta model uchun 300–500 dona, plastmassa buyumlarda 1 000 dona, elektronikada 100–500 dona. MOQdan kam buyurtmani zavod yo rad etadi, yo narxni 10–30% oshiradi.',
          'MOQni kamaytirishning ishlaydigan yoʻllari:',
        ],
        bullets: [
          'Bir modelning bir necha rangi yoki oʻlchamini bitta buyurtmaga jamlash — koʻp zavodlar umumiy miqdorni hisoblaydi.',
          'Zavodning tayyor (omborda turgan) tovarini olish — u koʻpincha MOQsiz sotiladi.',
          'Birinchi partiyani 1688-dagi ulgurji sotuvchidan olib, hajm oshgach zavodga oʻtish.',
          'Ikki-uch mijozning buyurtmasini birlashtirish — Ivu omborida tovar keyin ajratiladi.',
        ],
      },
      {
        heading: 'Namuna va zavod tekshiruvi nima uchun kerak?',
        body: [
          'Namuna — eng arzon sugʻurta. Zavod odatda namunani 3–10 kunda tayyorlaydi; narxi bir dona tovar narxidan 1,5–3 barobar qimmat boʻladi va buyurtma bergach koʻpincha hisobga olinadi. Namunani Ivu omborida xodimimiz tekshiradi va sizga suratga olib yuboradi; kerak boʻlsa, avia kargo bilan Toshkentga qoʻlingizga yetkazamiz.',
          'Zavod tekshiruvi ikki darajada boʻladi: hujjat boʻyicha (biznes-litsenziya, roʻyxatdan oʻtgan kapital, eksport litsenziyasi, sudlar tarixi) va joyida (ishlab chiqarish sexi, ombor, sifat nazorati, video-qoʻngʻiroq yoki tashrif). Katta buyurtmalar uchun yuklashdan oldingi tekshiruvni (PSI) tavsiya qilamiz — partiyaning 10–20% tasodifiy tanlab tekshiriladi.',
        ],
        callout: {
          title: 'Eng koʻp uchraydigan xato',
          text: 'Savdo kompaniyasi oʻzini zavod deb tanishtiradi. Buni biznes-litsenziyadagi faoliyat turi («生产» — ishlab chiqarish yoki «贸易» — savdo) va sex videosidan bilib olamiz. Vositachi yomon emas, lekin narxi 10–20% yuqori boʻladi va sifat uchun javobgarlik tarqoq boʻladi.',
          tone: 'warn',
        },
      },
      {
        heading: 'Shartnoma, toʻlov va komissiya qanday tuziladi?',
        body: [
          'Zavod bilan shartnoma xitoy va rus (yoki ingliz) tilida tuziladi va unda spetsifikatsiya, sifat mezonlari, qadoqlash, ishlab chiqarish muddati, kechikish uchun jarima va qaytarish sharti yoziladi. Xitoyda odatiy toʻlov tartibi: 30% oldindan, qolgani yuklashdan oldin; toʻlovni yuanda biz oʻtkazamiz, siz soʻmda yoki dollarda hisob-kitob qilasiz. Oʻz firmangiz nomiga import qilsangiz, shartnoma E-Contract (EEISVO) tizimida roʻyxatdan oʻtkaziladi.',
          'Bizning xizmat haqimiz — buyurtma summasidan komissiya. U qidiruvning murakkabligi va xaridni kim moliyalashtirishiga bogʻliq:',
        ],
        table: {
          caption: 'Tovar topish komissiyasi',
          head: ['Holat', 'Komissiya'],
          rows: [
            ['Standart qidiruv, siz toʻlovni oldindan qilasiz', '3% dan'],
            ['Murakkab qidiruv, muzokara va zavod tekshiruvi bilan', '5% gacha'],
            ['Xaridni biz moliyalashtiramiz (tovar kelganda toʻlaysiz)', '10% gacha'],
          ],
          note: 'Taxminiy stavkalar · Yangilangan: 2026-yil 8-sentabr. Namuna narxi, Xitoy ichidagi yetkazib berish va Ivu → Toshkent tashish alohida hisoblanadi. Aniq foiz shartnomada yoziladi.',
        },
        callout: {
          title: 'Menejer maslahati',
          text: 'Soʻrovga tovarning rasmi bilan birga «nima uchun kerak» va «qaysi narxda sotasiz» degan ikki javobni qoʻshing. Shunda biz sifat darajasini toʻgʻri tanlaymiz: Abu Sahiy uchun bir xil koʻylakni 18 yuanga, Uzum uchun 32 yuanga tikadigan zavodlar bor va ikkalasi ham toʻgʻri tanlov boʻlishi mumkin.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'Xitoydan tovar topish xizmati qancha turadi?',
        a: 'Buyurtma summasining 3% dan. Murakkab qidiruv va zavod tekshiruvi bilan 5% gacha, xaridni biz moliyalashtirsak — 10% gacha. Stavkalar taxminiy (2026-yil 8-sentabr), aniq foiz shartnomada yoziladi. Namuna, Xitoy ichidagi yetkazib berish va Toshkentgacha tashish alohida hisoblanadi.',
      },
      {
        q: 'Xitoy tilini bilishim shartmi?',
        a: 'Yoʻq. Menejerlarimiz oʻzbek, rus va xitoy tillarida gaplashadi; zavod bilan muzokara, shartnoma va daʼvolarni biz olib boramiz. Siz faqat tovar va narx boʻyicha qaror qilasiz.',
      },
      {
        q: 'Namuna qancha turadi va necha kunda keladi?',
        a: 'Zavod namunani odatda 3–10 kunda tayyorlaydi; narxi bir dona tovardan 1,5–3 barobar qimmat, koʻp zavodlar buyurtma bergach uni hisobga oladi. Ivu omboriga kelgach suratga olamiz; Toshkentga avia bilan taxminan 5–10 kunda yetadi.',
      },
      {
        q: 'Zavodning haqiqiy ekanini qanday tekshirasiz?',
        a: 'Biznes-litsenziya (faoliyat turi «ishlab chiqarish» yoki «savdo»), roʻyxatdan oʻtgan kapital, eksport litsenziyasi, sud ishlari tarixi va sex videosi yoki tashrif orqali. Katta buyurtmada yuklashdan oldingi tekshiruvni (PSI) qoʻshamiz.',
      },
      {
        q: 'Kichik partiya uchun ham izlaysizmi?',
        a: 'Ha. 1688-dagi ulgurji sotuvchilar 2–50 donadan sotadi, Ivu Futian bozorida bir qutidan olish mumkin. Zavod MOQ si (300–1 000 dona) kerak boʻlmasa, birinchi partiyani shu manbalardan olib, keyin zavodga oʻtishni tavsiya qilamiz.',
      },
      {
        q: 'Brend tovarlarni topib berasizmi?',
        a: 'Faqat rasmiy distribyutor yoki brend egasining ruxsati boʻlsa. Kontrafakt (soxta brend) tovarni qidirmaymiz va tashimaymiz — u Oʻzbekiston bojxonasida musodara qilinadi.',
      },
      {
        q: 'Toshkentga yetkazib berish komissiyaga kiradimi?',
        a: 'Yoʻq, tashish alohida: yigʻma yuk hajm boʻyicha hisoblanadi — 110 $/m³ dan, stavka yuk zichligiga qarab; taxminan 15–25 kun. Avia 9 $/kg dan, 5–10 kun. Narxlar taxminiy, 2026-yil 8-sentabrda yangilangan. Ivu omborida qabul, tekshiruv va foto-hisobot tashish narxiga kiradi.',
      },
      {
        q: 'Guanchjou yoki Shenchjendagi zavodlar bilan ham ishlaysizmi?',
        a: 'Ha. Qidiruv butun Xitoy boʻylab olib boriladi — Guanchjou (kiyim), Shenchjen (elektronika), Foshan (mebel), Keqiao (gazlama). Tovar Ivu omboriga xitoy ichki yetkazuvi bilan 1–3 kunda keladi va u yerda konsolidatsiya qilinadi.',
      },
    ],
    related: ['buying', 'warehouse', 'truck'],
    guideKeys: ['find-supplier', 'yiwu-guangzhou', 'order-from-1688', 'shipping-from-china'],
    cta: {
      title: 'Nima kerakligini yozing — qolganini topamiz.',
      text: 'Tovarning rasmi yoki havolasi, kerakli miqdor va sifat talabini yuboring. Bir necha zavoddan narx, MOQ va muddat bilan taklif tayyorlaymiz.',
      draft: 'Assalomu alaykum! Xitoydan tovar topish kerak. Tovar: … Miqdor: … Talab (sifat, material, sertifikat): … Taxminiy byudjet: …',
    },
    updated: '2026-09-08',
  },

  ru: {
    key: 'sourcing',
    seo: {
      title: 'Поиск товаров и производителей в Китае — комиссия от 3%',
      description:
        'Найдём фабрику или поставщика в Китае, договоримся о цене и MOQ, проверим образец и привезём партию в Ташкент. Сотрудники говорят по-китайски. Комиссия — от 3% суммы заказа.',
    },
    hero: {
      eyebrow: 'Услуга 04 — Поиск товаров',
      h1: 'Поиск товаров и производителей в Китае',
      intro:
        'Поиск товара — это подбор производителя или поставщика в Китае под ваше техзадание, переговоры о цене и минимальной партии, проверка образца и доставка готовой партии в Ташкент. Наши сотрудники говорят по-китайски, поэтому переписываться с фабрикой самому не нужно. Стоимость услуги — от 3% суммы заказа. Товар поступает на склад в Иу (义乌) и сборным грузом доходит до Ташкента ориентировочно за 15–25 дней.',
      facts: [
        { label: 'Комиссия от суммы заказа', value: 'от 3%' },
        { label: 'Процесс', value: '5 этапов' },
        { label: 'Языки менеджеров: узбекский, русский, китайский', value: '3 языка' },
        { label: 'До Ташкента, авто', value: '15–25 дней' },
      ],
    },
    sections: [
      {
        heading: 'Кому нужен поиск товара?',
        body: [
          'Найти товар в Китае легко, найти надёжную фабрику — сложно: на 1688 по одному запросу выходят сотни продавцов, половина из них посредники, цены отличаются вдвое, а качество становится известно только после получения. Мы проходим этот путь за вас — сотрудники в Иу звонят на фабрику, проверяют образец руками и договариваются о цене.',
          'Услуга окупается в таких случаях:',
        ],
        bullets: [
          'Оптовая торговля (Абу Сахий, Чорсу, Бек Барака): хотите производить одежду, обувь или товары для дома под своим брендом — нужны фабрика, цена и MOQ.',
          'Продавцы Uzum, Яндекс Маркета и Instagram: ищете более дешёвый и качественный источник товара, который уже нашли на 1688.',
          'Производители: сырьё, комплектующие, упаковка или запчасти — нужна конкретная фабрика по технической спецификации.',
          'Стройка и промышленность (Урикзор, Куйлюк): плитка, сантехника, электротовары — напрямую от сертифицированного производителя.',
        ],
      },
      {
        heading: 'Как работает поиск товара?',
        body: [
          'Процесс состоит из пяти этапов: поиск, переговоры, образец, проверка, доставка. На каждом этапе решение принимаете вы, а мы готовим информацию и варианты.',
        ],
        steps: [
          { title: 'Запрос и техзадание', text: 'Вы присылаете название, фото или ссылку на товар, нужное количество, требования к качеству (материал, размеры, бренд, сертификаты) и ориентировочный бюджет. По ним согласовываем критерии поиска.' },
          { title: 'Поиск и переговоры', text: 'Сотрудники в Иу собирают 3–5 предложений от фабрик, продавцов 1688 и Alibaba, рынка Футянь в Иу: цена, MOQ, срок производства, упаковка, сертификаты. Переговоры ведём сами на китайском.' },
          { title: 'Образец', text: 'Заказываем образцы у 1–2 выбранных фабрик. Образец приходит на склад в Иу — фотографируем, измеряем, снимаем видео; по желанию отправляем авиа в Ташкент ориентировочно за 5–10 дней.' },
          { title: 'Проверка фабрики и договор', text: 'Проверяем бизнес-лицензию, производственные мощности и экспортный опыт фабрики. Затем заключается договор со спецификацией, критериями качества, сроками и графиком оплаты.' },
          { title: 'Контроль производства и доставка', text: 'Перед отгрузкой проверяем партию (количество, качество, упаковка) и отправляем фотоотчёт. Товар консолидируется на складе в Иу и едет в Ташкент сборным грузом или контейнером; растаможку берём на себя.' },
        ],
      },
      {
        heading: 'Напрямую с фабрики или через 1688?',
        body: [
          'Источник выбираем под товар и объём. 1688 — оптовая площадка, где продают и фабрики, и посредники; прямая фабрика — для крупных и повторяющихся партий; Taobao и Pinduoduo — для малых количеств и розничных товаров. Основные отличия — в таблице.',
        ],
        table: {
          caption: 'Сравнение источников товара',
          head: ['Источник', 'Кому подходит', 'Обычный MOQ', 'Цена', 'Риски и контроль'],
          rows: [
            ['Фабрика (производитель)', 'свой бренд, регулярные партии, технический товар', '300–1 000 шт. или 1 модель', 'самая низкая', 'нужны договор, образец, проверка фабрики'],
            ['1688 (оптовая площадка)', 'магазины и продавцы маркетплейсов', '2–50 шт.', 'низкая', 'проверяем рейтинг продавца и историю возвратов'],
            ['Рынок Футянь в Иу', 'мелкий товар, аксессуары, игрушки, подарки', '1 коробка (обычно 100–500 шт.)', 'низкая', 'товар можно увидеть на месте'],
            ['Taobao / Pinduoduo', 'розница, 1–10 шт., для теста', '1 шт.', 'средняя', 'качество разное — рекомендуем проверку в Иу'],
            ['Alibaba', 'экспортный контракт, оплата в USD, крупная партия', 'от 500 шт.', 'средняя', 'Trade Assurance, общение на английском'],
          ],
          note: 'MOQ и цены зависят от вида товара; цифры в таблице — обычные диапазоны. Точное предложение подготовим после вашего запроса.',
        },
      },
      {
        heading: 'Что такое MOQ и можно ли его снизить?',
        body: [
          'MOQ (minimum order quantity) — минимальное количество, которое фабрика принимает в одном заказе. В одежде это обычно 300–500 шт. на модель, в пластиковых изделиях — 1 000 шт., в электронике — 100–500 шт. Заказ меньше MOQ фабрика либо отклоняет, либо поднимает цену на 10–30%.',
          'Рабочие способы снизить MOQ:',
        ],
        bullets: [
          'Объединить в один заказ несколько цветов или размеров одной модели — многие фабрики считают общее количество.',
          'Взять готовый (складской) товар фабрики — его часто продают без MOQ.',
          'Первую партию купить у оптового продавца на 1688, а с ростом объёма перейти на фабрику.',
          'Объединить заказы двух-трёх клиентов — на складе в Иу товар потом разделяется.',
        ],
      },
      {
        heading: 'Зачем нужны образец и проверка фабрики?',
        body: [
          'Образец — самая дешёвая страховка. Фабрика обычно готовит его за 3–10 дней; стоит он в 1,5–3 раза дороже единицы товара и после размещения заказа часто засчитывается в его сумму. Образец на складе в Иу проверяет наш сотрудник и присылает вам фото; при необходимости доставим его авиа карго в Ташкент.',
          'Проверка фабрики проходит на двух уровнях: по документам (бизнес-лицензия, зарегистрированный капитал, экспортная лицензия, история судебных дел) и на месте (цех, склад, контроль качества, видеозвонок или визит). Для крупных заказов рекомендуем инспекцию перед отгрузкой (PSI) — выборочно проверяется 10–20% партии.',
        ],
        callout: {
          title: 'Самая частая ошибка',
          text: 'Торговая компания представляется фабрикой. Это видно по виду деятельности в бизнес-лицензии («生产» — производство или «贸易» — торговля) и по видео из цеха. Посредник — не зло, но его цена на 10–20% выше, а ответственность за качество размыта.',
          tone: 'warn',
        },
      },
      {
        heading: 'Как оформляются договор, оплата и комиссия?',
        body: [
          'Договор с фабрикой составляется на китайском и русском (или английском) языке и содержит спецификацию, критерии качества, упаковку, срок производства, штраф за задержку и условия возврата. Обычный порядок оплаты в Китае: 30% аванс, остаток перед отгрузкой; платёж в юанях проводим мы, вы рассчитываетесь в сумах или долларах. При импорте на вашу фирму договор регистрируется в системе E-Contract (ЕЭИСВО).',
          'Наше вознаграждение — комиссия от суммы заказа. Она зависит от сложности поиска и от того, кто финансирует закупку:',
        ],
        table: {
          caption: 'Комиссия за поиск товара',
          head: ['Ситуация', 'Комиссия'],
          rows: [
            ['Стандартный поиск, вы оплачиваете закупку заранее', 'от 3%'],
            ['Сложный поиск с переговорами и проверкой фабрики', 'до 5%'],
            ['Закупку финансируем мы (платите по прибытии товара)', 'до 10%'],
          ],
          note: 'Ориентировочные ставки · Обновлено: 8 сентября 2026 г. Стоимость образца, доставка внутри Китая и перевозка Иу → Ташкент считаются отдельно. Точный процент фиксируется в договоре.',
        },
        callout: {
          title: 'Совет менеджера',
          text: 'К фото товара добавьте два ответа: «для чего нужен» и «по какой цене будете продавать». Тогда мы правильно выберем уровень качества: одну и ту же рубашку для Абу Сахий шьют за 18 юаней, а для Uzum — за 32, и оба варианта могут быть правильными.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'Сколько стоит поиск товара в Китае?',
        a: 'От 3% суммы заказа. Сложный поиск с проверкой фабрики — до 5%, если закупку финансируем мы — до 10%. Ставки ориентировочные (8 сентября 2026 г.), точный процент фиксируется в договоре. Образец, доставка внутри Китая и перевозка до Ташкента считаются отдельно.',
      },
      {
        q: 'Нужно ли мне знать китайский?',
        a: 'Нет. Наши менеджеры говорят на узбекском, русском и китайском; переговоры с фабрикой, договор и претензии ведём мы. Вы принимаете решения только по товару и цене.',
      },
      {
        q: 'Сколько стоит образец и когда он приходит?',
        a: 'Фабрика обычно готовит образец за 3–10 дней; он стоит в 1,5–3 раза дороже единицы товара, и многие фабрики засчитывают его после размещения заказа. На складе в Иу мы его фотографируем; в Ташкент авиа он доходит ориентировочно за 5–10 дней.',
      },
      {
        q: 'Как вы проверяете, что фабрика настоящая?',
        a: 'По бизнес-лицензии (вид деятельности «производство» или «торговля»), зарегистрированному капиталу, экспортной лицензии, истории судебных дел, видео из цеха или визиту. Для крупных заказов добавляем инспекцию перед отгрузкой (PSI).',
      },
      {
        q: 'Ищете ли вы товар для маленькой партии?',
        a: 'Да. Оптовые продавцы на 1688 отпускают от 2–50 шт., на рынке Футянь в Иу можно взять от одной коробки. Если фабричный MOQ (300–1 000 шт.) не нужен, советуем первую партию взять из этих источников, а затем перейти на фабрику.',
      },
      {
        q: 'Найдёте ли брендовый товар?',
        a: 'Только у официального дистрибьютора или с разрешения владельца бренда. Контрафакт (подделки брендов) не ищем и не возим — на таможне Узбекистана его конфискуют.',
      },
      {
        q: 'Входит ли доставка в Ташкент в комиссию?',
        a: 'Нет, перевозка считается отдельно: сборный груз считается по объёму — от 110 $/м³, ставка зависит от плотности груза; ориентировочно 15–25 дней. Авиа от 9 $/кг, 5–10 дней. Цены ориентировочные, обновлены 8 сентября 2026 г. Приёмка на складе в Иу, проверка и фотоотчёт входят в стоимость перевозки.',
      },
      {
        q: 'Работаете ли с фабриками в Гуанчжоу или Шэньчжэне?',
        a: 'Да. Поиск ведём по всему Китаю — Гуанчжоу (одежда), Шэньчжэнь (электроника), Фошань (мебель), Кэцяо (ткани). Товар приходит на склад в Иу внутрикитайской доставкой за 1–3 дня и там консолидируется.',
      },
    ],
    related: ['buying', 'warehouse', 'truck'],
    guideKeys: ['find-supplier', 'yiwu-guangzhou', 'order-from-1688', 'shipping-from-china'],
    cta: {
      title: 'Напишите, что нужно — остальное найдём.',
      text: 'Пришлите фото или ссылку на товар, нужное количество и требования к качеству. Подготовим предложения от нескольких фабрик с ценой, MOQ и сроками.',
      draft: 'Здравствуйте! Нужно найти товар в Китае. Товар: … Количество: … Требования (качество, материал, сертификаты): … Ориентировочный бюджет: …',
    },
    updated: '2026-09-08',
  },

  en: {
    key: 'sourcing',
    seo: {
      title: 'Product and supplier sourcing in China — commission from 3%',
      description:
        'We find the factory or supplier in China, negotiate price and MOQ, check samples and bring the batch to Tashkent. Chinese-speaking staff. Commission from 3% of the order value.',
    },
    hero: {
      eyebrow: 'Service 04 — Sourcing',
      h1: 'Product and supplier sourcing in China',
      intro:
        'Sourcing means finding a manufacturer or supplier in China against your specification, negotiating the price and minimum order, checking a sample and bringing the finished batch to Tashkent. Our staff speak Chinese, so you never have to deal with the factory yourself. The fee starts at 3% of the order value. Goods arrive at the Yiwu (义乌) warehouse and reach Tashkent by consolidated truck in roughly 15–25 days.',
      facts: [
        { label: 'Commission on order value', value: 'from 3%' },
        { label: 'Process', value: '5 stages' },
        { label: 'Manager languages: Uzbek, Russian, Chinese', value: '3 languages' },
        { label: 'To Tashkent by truck', value: '15–25 days' },
      ],
    },
    sections: [
      {
        heading: 'Who needs sourcing?',
        body: [
          'Finding a product in China is easy; finding a reliable factory is not. One search on 1688 returns hundreds of sellers, half of them middlemen, prices differ twofold, and quality only becomes clear when the goods arrive. We walk that path for you: our team in Yiwu calls the factory, handles the sample and negotiates the price.',
          'The service pays for itself when:',
        ],
        bullets: [
          'Wholesalers (Abu Sahiy, Chorsu, Bek Baraka) want clothing, footwear or household goods made under their own brand and need a factory, a price and an MOQ.',
          'Uzum, Yandex Market and Instagram sellers are looking for a cheaper, better source of a product they already found on 1688.',
          'Manufacturers need raw materials, components, packaging or spare parts from a specific factory that meets a technical specification.',
          'Construction and industrial buyers (Urikzor, Qoʻyliq) want tiles, plumbing or electrical goods straight from a certified producer.',
        ],
      },
      {
        heading: 'How does sourcing work?',
        body: [
          'The process has five stages: search, negotiation, sample, verification, delivery. You make the decision at each stage; we prepare the facts and the options.',
        ],
        steps: [
          { title: 'Request and specification', text: 'You send the product name, a photo or link, the quantity, your quality requirements (material, dimensions, brand, certificates) and a rough budget. We agree the search criteria on that basis.' },
          { title: 'Search and negotiation', text: 'Our Yiwu team collects 3–5 offers from factories, 1688 and Alibaba sellers and the Futian market in Yiwu: price, MOQ, production time, packaging, certificates. We negotiate in Chinese ourselves.' },
          { title: 'Sample', text: 'We order samples from the 1–2 factories you pick. The sample lands at the Yiwu warehouse, where we photograph, measure and film it; on request we fly it to Tashkent in roughly 5–10 days.' },
          { title: 'Factory verification and contract', text: 'We check the business licence, production capacity and export record. Then a contract is signed with the specification, quality criteria, deadlines and payment schedule.' },
          { title: 'Production control and delivery', text: 'Before loading we inspect the batch (quantity, quality, packaging) and send a photo report. The goods are consolidated in Yiwu and travel to Tashkent by consolidated truck or container; customs clearance is on us.' },
        ],
      },
      {
        heading: 'Direct from the factory or via 1688?',
        body: [
          'We choose the source to fit the product and the volume. 1688 is a wholesale marketplace where both factories and traders sell; a direct factory suits large, repeat orders; Taobao and Pinduoduo suit small quantities and retail goods. The table shows the main differences.',
        ],
        table: {
          caption: 'Comparing sourcing channels',
          head: ['Source', 'Best for', 'Typical MOQ', 'Price', 'Risk and control'],
          rows: [
            ['Factory (manufacturer)', 'own brand, repeat batches, technical goods', '300–1,000 pcs or 1 model', 'lowest', 'contract, sample and factory check required'],
            ['1688 (wholesale marketplace)', 'shops and marketplace sellers', '2–50 pcs', 'low', 'we check seller rating and return history'],
            ['Futian market, Yiwu', 'small goods, accessories, toys, gifts', '1 carton (usually 100–500 pcs)', 'low', 'goods can be seen on the spot'],
            ['Taobao / Pinduoduo', 'retail, 1–10 pcs, for testing', '1 pc', 'medium', 'quality varies — inspection in Yiwu recommended'],
            ['Alibaba', 'export contract, USD payment, large batch', 'from 500 pcs', 'medium', 'Trade Assurance, English-language communication'],
          ],
          note: 'MOQ and prices depend on the product; the figures are typical ranges. We prepare an exact offer after your request.',
        },
      },
      {
        heading: 'What is MOQ and can it be lowered?',
        body: [
          'MOQ (minimum order quantity) is the smallest quantity a factory accepts in one order. In clothing it is usually 300–500 pieces per style, in plastic goods 1,000 pieces, in electronics 100–500 pieces. An order below MOQ is either refused or priced 10–30% higher.',
          'Ways to lower the MOQ that actually work:',
        ],
        bullets: [
          'Combine several colours or sizes of one style in a single order — many factories count the total quantity.',
          'Buy the factory’s in-stock goods, which are often sold without any MOQ.',
          'Take the first batch from a wholesale seller on 1688 and move to the factory once volume grows.',
          'Pool the orders of two or three clients — the goods are split later at the Yiwu warehouse.',
        ],
      },
      {
        heading: 'Why do samples and factory checks matter?',
        body: [
          'A sample is the cheapest insurance there is. A factory usually makes one in 3–10 days; it costs 1.5–3 times the unit price and is often credited back once you place the order. Our staff inspect the sample at the Yiwu warehouse and send you photos; if you need it in hand, we fly it to Tashkent by air cargo.',
          'Factory verification works on two levels: on paper (business licence, registered capital, export licence, court history) and on site (workshop, warehouse, quality control, video call or visit). For large orders we recommend a pre-shipment inspection (PSI), where 10–20% of the batch is checked at random.',
        ],
        callout: {
          title: 'The most common mistake',
          text: 'A trading company introduces itself as a factory. We tell them apart by the business scope on the licence («生产» — production versus «贸易» — trade) and by workshop video. A middleman is not bad in itself, but the price is 10–20% higher and responsibility for quality gets blurred.',
          tone: 'warn',
        },
      },
      {
        heading: 'How are the contract, payment and commission arranged?',
        body: [
          'The contract with the factory is drawn up in Chinese and Russian (or English) and covers the specification, quality criteria, packaging, production time, penalties for delay and return terms. The usual payment pattern in China is 30% upfront and the balance before shipment; we make the payment in yuan while you settle in UZS or US dollars. If you import in your own company’s name, the contract is registered in the E-Contract (EEISVO) system.',
          'Our fee is a commission on the order value. It depends on how complex the search is and on who finances the purchase:',
        ],
        table: {
          caption: 'Sourcing commission',
          head: ['Case', 'Commission'],
          rows: [
            ['Standard search, you pay for the goods upfront', 'from 3%'],
            ['Complex search with negotiation and factory verification', 'up to 5%'],
            ['We finance the purchase (you pay on arrival)', 'up to 10%'],
          ],
          note: 'Indicative rates · Updated September 8, 2026. Sample cost, domestic shipping in China and the Yiwu → Tashkent freight are charged separately. The exact percentage is fixed in the contract.',
        },
        callout: {
          title: 'Manager’s tip',
          text: 'Along with the product photo, answer two questions: what it is for, and at what price you will sell it. That lets us pick the right quality level — the same shirt is sewn for 18 yuan for Abu Sahiy and for 32 yuan for Uzum, and both can be the right choice.',
          tone: 'success',
        },
      },
    ],
    faq: [
      {
        q: 'How much does sourcing in China cost?',
        a: 'From 3% of the order value. A complex search with factory verification is up to 5%; if we finance the purchase, up to 10%. Rates are indicative (September 8, 2026) and the exact percentage is fixed in the contract. Samples, shipping inside China and freight to Tashkent are charged separately.',
      },
      {
        q: 'Do I need to speak Chinese?',
        a: 'No. Our managers speak Uzbek, Russian and Chinese; we handle negotiations, the contract and any claims with the factory. You only decide on the product and the price.',
      },
      {
        q: 'How much does a sample cost and when does it arrive?',
        a: 'A factory usually makes a sample in 3–10 days; it costs 1.5–3 times the unit price and many factories credit it back once you order. We photograph it at the Yiwu warehouse; by air it reaches Tashkent in roughly 5–10 days.',
      },
      {
        q: 'How do you verify that a factory is genuine?',
        a: 'Through the business licence (scope “production” or “trade”), registered capital, export licence, court history and a workshop video or visit. For large orders we add a pre-shipment inspection (PSI).',
      },
      {
        q: 'Do you source small quantities too?',
        a: 'Yes. Wholesale sellers on 1688 ship from 2–50 pieces, and the Futian market in Yiwu sells by the carton. If a factory MOQ of 300–1,000 pieces is too much, we suggest taking the first batch from these sources and moving to a factory later.',
      },
      {
        q: 'Can you source branded goods?',
        a: 'Only from an official distributor or with the brand owner’s permission. We do not source or ship counterfeit goods — Uzbek customs confiscates them.',
      },
      {
        q: 'Is delivery to Tashkent included in the commission?',
        a: 'No, freight is separate: consolidated truck is priced by volume — from $110 per m³, with the rate set by cargo density — in roughly 15–25 days; air from $9/kg in 5–10 days. Prices are estimates updated September 8, 2026. Receiving, inspection and the photo report at the Yiwu warehouse are included in the freight price.',
      },
      {
        q: 'Do you work with factories in Guangzhou or Shenzhen?',
        a: 'Yes. We search across all of China — Guangzhou (clothing), Shenzhen (electronics), Foshan (furniture), Keqiao (fabrics). Goods reach the Yiwu warehouse by domestic courier in 1–3 days and are consolidated there.',
      },
    ],
    related: ['buying', 'warehouse', 'truck'],
    guideKeys: ['find-supplier', 'yiwu-guangzhou', 'order-from-1688', 'shipping-from-china'],
    cta: {
      title: 'Tell us what you need. We find the rest.',
      text: 'Send a photo or link, the quantity and your quality requirements. We come back with offers from several factories, with price, MOQ and lead time.',
      draft: 'Hello! I need to source a product in China. Product: … Quantity: … Requirements (quality, material, certificates): … Rough budget: …',
    },
    updated: '2026-09-08',
  },
};

export default content;
