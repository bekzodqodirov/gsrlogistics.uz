import type { ServiceContentByLang } from './types';

/**
 * Xitoydagi qabul punktlari va sifat nazorati — long-form page content.
 * Figures mirror src/data/tariffs.json (updated 2026-09-08): extras — photo report 1 $ per place,
 * inspection 1 $/kg, repack 0,4 $/kg, insurance 1% of declared value; free storage 14 days in China
 * (tariffs.json freeStorageDaysChina), 3 days in Tashkent. Keep in sync when tariffs change.
 * Ownership of each point is still unverified — write "Ivu ombori", never "omborimiz". There are
 * THREE receiving points (Ivu, Guanchjou, Qashqar), all from the owner's address card; never say
 * Guangzhou cargo comes "via partners". The carton mark is the GS code (site.cargoMark) and the
 * supplier must write it before dispatch.
 */
const content: ServiceContentByLang = {
  uz: {
    key: 'warehouse',
    seo: {
      title: 'Xitoyda ombor: qabul, sifat tekshiruvi, foto-hisobot, qadoqlash — GSR Logistics',
      description:
        'Xitoydagi uchta qabul punktida — Ivu, Guanchjou va Qashqarda — yukni qabul qilamiz, GS kodingiz bilan belgilaymiz, ochib tekshiramiz, foto-hisobot yuboramiz, bir necha yetkazib beruvchidan jamlaymiz, qadoqlaymiz va 1% sugʻurta qilamiz. 14 kun bepul saqlash.',
    },
    hero: {
      eyebrow: 'Xizmat 08 — Xitoyda ombor',
      h1: 'Xitoyda ombor: qabul, sifat nazorati va foto-hisobot',
      intro:
        'Xitoydagi uchta qabul punktidan biri — Ivu (义乌), Guanchjou (广州) yoki Qashqar (喀什) — Toshkentga ketadigan yukning birinchi bekati. Bu yerda yetkazib beruvchidan kelgan har bir joyni tortamiz, oʻlchaymiz, GS kodingiz bilan belgilaymiz va foto-hisobot yuboramiz. Xohlasangiz, qutini ochib tovarni sanaymiz va tekshiramiz (1 $/kg), qayta qadoqlaymiz (0,4 $/kg) va eʼlon qilingan qiymatning 1% evaziga sugʻurta qilamiz. Saqlash 14 kungacha bepul.',
      facts: [
        { label: 'Bepul saqlash, Xitoy', value: '14 kun' },
        { label: 'Tekshiruv, ochib sanash', value: '1 $/kg' },
        { label: 'Qayta qadoqlash', value: '0,4 $/kg' },
        { label: 'Sugʻurta — eʼlon qilingan qiymatdan', value: '1%' },
      ],
    },
    sections: [
      {
        heading: 'Ombor nima uchun kerak?',
        body: [
          'Xitoyda tovar sotib olganingizda u sizga toʻgʻridan-toʻgʻri kelmaydi — avval Xitoy ichidagi manzilga, yaʼni omborga boradi. Xitoyda uchta shunday qabul manzili bor — Ivu, Guanchjou va Qashqar: 1688 yoki Taobao sotuvchisi, Futian bozoridagi doʻkon yoki Guanchjoudagi zavod yukni eng yaqin punktga joʻnatadi. Shenchjen kabi boshqa shaharlardan yukni qaysi manzilga joʻnatish kerakligini menejer aytadi.',
          'Ombor uch vazifani bajaradi: yukni qabul qilib hisobga oladi, uni joʻnatishdan oldin tekshirish imkonini beradi va bir necha yetkazib beruvchidan kelgan qutilarni bitta partiyaga jamlaydi. Shu tufayli siz Xitoyga bormasdan, xitoy tilini bilmasdan, tovar qanday kelganini oʻz koʻzingiz bilan koʻrasiz — yuk hali Xitoyda turganda.',
        ],
        bullets: [
          'Uzum va Instagram sotuvchilari: bir necha sotuvchidan kelgan mayda buyurtmalarni bitta GS kodiga jamlaymiz.',
          'Ulgurji savdogarlar: partiyani ochib, model va oʻlchamlar boʻyicha sanaymiz, brak bor-yoʻqligini aytamiz.',
          'Ishlab chiqaruvchilar: ehtiyot qismlar va xomashyoni sertifikat uchun namunaga ajratib, oldindan Toshkentga yuboramiz.',
        ],
      },
      {
        heading: 'Yuk omborda qanday qabul qilinadi?',
        body: [
          'Shartnoma tuzilgach, sizga eng yaqin qabul punktining xitoycha manzili, qabul qiluvchining telefoni va shaxsiy GS kodingiz (markirovka) beriladi. Yetkazib beruvchi yukni joʻnatishdan oldin har bir qutiga shu kodni yozishi shart — shunda ombor qutini kelgan zahoti sizniki deb taniydi. Qabul quyidagicha kechadi:',
        ],
        steps: [
          { title: 'GS kodi bilan belgilash', text: 'Har bir joy qabul qilinadi, GS kodingiz va joy raqami yopishtiriladi. Kod qutiga joʻnatishdan oldin yozilgan boʻlishi kerak; GS kodisiz kelgan quti yetkazib beruvchining trek raqami boʻyicha aniqlanadi — buning uchun buyurtma maʼlumotini oldindan yuborasiz.' },
          { title: 'Tortish va oʻlchash', text: 'Har bir joyning ogʻirligi (kg) va uch oʻlchami (sm) yoziladi. Shu raqamlar asosida hajmiy vazn va zichlik chiqadi — kargo narxi ana shundan hisoblanadi.' },
          { title: 'Tashqi koʻrik va foto', text: 'Quti tashqaridan koʻrikdan oʻtkaziladi: ezilgan, hoʻl yoki ochilgan boʻlsa, darhol suratga olib xabar beramiz. Har qabulda tarozi va yorliq surati Telegramga keladi.' },
          { title: 'Ochib tekshirish (ixtiyoriy)', text: 'Soʻrovingiz boʻyicha qutini ochamiz: tovarni sanaymiz, model, rang va oʻlchamni buyurtma bilan solishtiramiz, koʻrinib turgan nuqsonlarni suratga olamiz. Narxi 1 $/kg, tafsilotli foto-hisobot — har bir joy uchun 1 $.' },
          { title: 'Qaror sizniki', text: 'Foto-hisobotni koʻrib, yukni joʻnatish, qayta qadoqlash yoki nuqson boʻlsa, sotuvchiga qaytarish haqida siz qaror qilasiz. Sotuvchi bilan biz oʻzimiz xitoy tilida gaplashamiz.' },
          { title: 'Konsolidatsiya', text: 'Tayyor joylar GS kodingiz ostida bitta partiyaga jamlanadi va eng yaqin fura yoki konteynerga yuklanadi. Sizga partiya raqami va joʻnatilgan sana yuboriladi.' },
        ],
      },
      {
        heading: 'Foto-hisobotda nimalar boʻladi?',
        body: [
          'Foto-hisobot — sizning Xitoydagi koʻzingiz. Oddiy qabulda tarozi koʻrsatkichi, quti va yorliq surati keladi. Tafsilotli hisobotda esa ochilgan quti, tovarning umumiy koʻrinishi, yaqindan olingan surat, mavjud brak va sanoq natijasi boʻladi. Har bir hisobot GS kodi va sana bilan Telegramga yuboriladi, shuning uchun keyin har qanday joyni topish oson.',
          'Sanoq natijasi buyurtmaga mos kelmasa — masalan, 500 dona oʻrniga 480 dona kelsa — biz sotuvchiga daʼvo yozib, yetishmayotgan qismini keyingi yukka qoʻshib yuborishini yoki pulini qaytarishini soʻraymiz. Tovar hali Xitoyda turganda bu muammo bir necha kunda hal boʻladi; Toshkentda esa deyarli hal boʻlmaydi.',
        ],
        callout: {
          title: 'Menejer maslahati',
          text: 'Birinchi marta ishlayotgan sotuvchidan kelgan yukni har doim ochib tekshirtiring — 1 $/kg xarajat 20 kg partiyada 20 $ boʻladi, brak partiya esa butun yukning narxidan qimmatga tushadi. Doimiy va ishonchli sotuvchilarda tashqi koʻrik va foto yetarli.',
          tone: 'success',
        },
      },
      {
        heading: 'Qadoqlash va sugʻurta qanday tanlanadi?',
        body: [
          'Xitoy sotuvchilari koʻpincha tovarni yupqa qutida yoki qopda joʻnatadi. Yoʻlda yuk bir necha marta qayta yuklanadi, shuning uchun qadoqlashni sizning tovaringizga qarab tanlaymiz. Qayta qadoqlash koʻpincha hajmni ham kamaytiradi — hajmli yuk uchun bu narxni tushiradi.',
        ],
        table: {
          caption: 'Qadoqlash turlari',
          head: ['Tur', 'Qaysi yukka', 'Taxminiy narx'],
          rows: [
            ['Standart: qop yoki quti + skotch', 'kiyim, gazlama, mayda buyumlar', 'narxga kiradi'],
            ['Qayta qadoqlash: yangi quti, zichlashtirish', 'bir necha sotuvchidan kelgan mayda qutilar', '0,4 $/kg'],
            ['Pufakchali plyonka + karton burchaklar', 'elektronika, chinni, shisha, chiroqlar', '0,4 $/kg dan'],
            ['Yogʻoch panjara (обрешётка)', 'uskunalar, mebel, katta oynali buyumlar', 'yuk oʻlchamiga qarab'],
            ['Pallet va streych-plyonka', '300 kg dan ortiq bir xil yuk', 'yuk oʻlchamiga qarab'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. Yogʻoch panjara va pallet narxi yukning oʻlchamiga qarab hisoblanadi.',
        },
      },
      {
        heading: 'Sugʻurta qanday ishlaydi?',
        body: [
          'Sugʻurta — eʼlon qilingan qiymatning 1%. Qiymatni siz invoys yoki buyurtma summasi boʻyicha koʻrsatasiz; yuk yoʻqolsa yoki shikastlansa, shu qiymat qoplanadi. Sugʻurtasiz yuk uchun javobgarlik shartnomada belgilangan chegarada boʻladi. Elektronika, chinni, shisha va qimmat tovarlar uchun sugʻurtani tavsiya qilamiz; kiyim va gazlama uchun koʻpchilik mijozlar sugʻurtasiz joʻnatadi.',
          'Shikast holatida qabul chogʻida olingan foto-hisobot dalil boʻlib xizmat qiladi — shuning uchun Xitoyda har bir joy suratga olinadi, Toshkentda esa yuk sizning koʻz oʻngingizda ochiladi.',
        ],
      },
      {
        heading: 'Saqlash muddati va toʻlov',
        body: [
          'Xitoydagi qabul punktida yuk 14 kungacha bepul saqlanadi — bu bir necha sotuvchidan kelayotgan qutilarni kutish uchun yetarli. Undan keyin kunlik saqlash haqi shartnoma boʻyicha hisoblanadi. Toshkent omborida yuk kelganidan keyin 3 kun bepul turadi. Ombor xizmatlari (tekshiruv, qayta qadoqlash, sugʻurta) kargo narxi bilan birga, yuk Toshkentga kelganda toʻlanadi.',
        ],
        table: {
          caption: 'Ombor xizmatlari narxi',
          head: ['Xizmat', 'Taxminiy narx'],
          rows: [
            ['Qabul, tortish, oʻlchash, GS kodi bilan belgilash', 'narxga kiradi'],
            ['Tarozi va yorliq surati har qabulda', 'narxga kiradi'],
            ['Tafsilotli foto-hisobot (ochilgan quti)', '1 $ / joy'],
            ['Ochib sanash va tekshirish', '1 $/kg'],
            ['Qayta qadoqlash', '0,4 $/kg'],
            ['Sugʻurta', 'eʼlon qilingan qiymatning 1%'],
            ['Saqlash, Xitoy', '14 kun bepul'],
            ['Saqlash, Toshkent', '3 kun bepul'],
          ],
          note: 'Taxminiy narxlar · Yangilangan: 2026-yil 8-sentabr. Yakuniy summa yuk tortilgandan keyin aniqlanadi.',
        },
      },
      {
        heading: 'Qaysi yuklarni omborga qabul qilmaymiz?',
        body: ['Quyidagi tovarlar omborga qabul qilinmaydi — sotuvchi ularni joʻnatgan boʻlsa ham, biz ularni partiyaga qoʻshmaymiz:'],
        bullets: [
          'Portlovchi, yonuvchi va zaharli moddalar, bosim ostidagi ballonlar',
          'Oʻsimlik, hayvon va tez buziladigan mahsulotlar',
          'Pul, qimmatbaho metall va toshlar, zargarlik buyumlari, antiqa buyumlar',
          'Toʻlov vositalari, qimmatli qogʻozlar, shaxsiy hujjatlar',
          'Dori vositalari (tijorat), qurol va uning qismlari, dronlar, ratsiyalar',
          'Brend nusxalari (kontrafakt) va qonun bilan taqiqlangan boshqa narsalar',
          'Avia yoʻnalishi uchun: litiy batareyalar, suyuqliklar, magnitlar — faqat avto yoʻnalishida qabul qilinadi',
        ],
        callout: {
          title: 'Shubhali tovar boʻlsa',
          text: 'Tovaringiz roʻyxatga yaqin boʻlsa (masalan, batareyali oʻyinchoq, aerozol, kimyoviy tozalash vositasi), buyurtma berishdan oldin menejerga yozing — qaysi yoʻnalishda va qanday hujjat bilan olib kelish mumkinligini aytamiz.',
          tone: 'warn',
        },
      },
    ],
    faq: [
      { q: 'Xitoydagi ombor manzilini qanday olaman?', a: 'Shartnoma tuzilgach, menejer sizga eng yaqin qabul punktining (Ivu, Guanchjou yoki Qashqar) xitoycha manzilini, qabul qiluvchi telefonini va shaxsiy GS kodingizni Telegramda yuboradi. Manzilni 1688/Taobao buyurtmasiga yoki sotuvchiga toʻgʻridan-toʻgʻri berasiz — va sotuvchidan joʻnatishdan oldin GS kodini har bir qutiga yozishni soʻrang.' },
      { q: 'Yuk omborga kelganini qanday bilaman?', a: 'Har qabulda tarozi va yorliq surati GS kodi bilan Telegramga keladi — odatda quti kelgan kuni. Kutilayotgan qutining trek raqamini oldindan yuborsangiz, ombor uni kelgan zahoti sizniki deb taniydi.' },
      { q: 'Tovarni ochib tekshirish shartmi?', a: 'Yoʻq, bu ixtiyoriy xizmat — 1 $/kg. Birinchi marta ishlayotgan sotuvchi, elektronika va brak ehtimoli yuqori tovarlar uchun tavsiya qilamiz; doimiy sotuvchilarda tashqi koʻrik va bepul foto yetarli.' },
      { q: 'Bir necha sotuvchidan yuk kelsa, bitta yukka jamlash mumkinmi?', a: 'Ha, bu konsolidatsiya — ombor asosiy vazifalaridan biri. Barcha qutilar GS kodingiz ostida 14 kungacha bepul kutadi, keyin bitta partiyaga jamlanib joʻnatiladi. Xohlasangiz, qutilarni qayta qadoqlab hajmni kamaytiramiz (0,4 $/kg).' },
      { q: 'Sugʻurta qancha turadi va nimani qoplaydi?', a: 'Eʼlon qilingan qiymatning 1%. Yuk yoʻqolsa yoki shikastlansa, eʼlon qilingan qiymat qoplanadi; qabul chogʻidagi foto-hisobot dalil boʻladi. Sugʻurtasiz yuk uchun javobgarlik shartnomada belgilangan chegarada.' },
      { q: 'Yuk omborda qancha vaqt bepul turadi?', a: 'Xitoyda 14 kun, Toshkentda 3 kun. Undan keyin kunlik saqlash haqi shartnoma boʻyicha hisoblanadi. Xitoy Yangi yili oldidan ombor bir hafta oldin qabulni toʻxtatadi — partiyani shunga qarab rejalashtiring.' },
      { q: 'Tovar buyurtmaga mos kelmasa nima boʻladi?', a: 'Foto-hisobotni koʻrib, siz qaror qilasiz: joʻnatish, sotuvchiga qaytarish yoki yetishmagan qismini talab qilish. Sotuvchi bilan biz xitoy tilida gaplashamiz; tovar hali Xitoyda turganda daʼvo koʻpincha bir necha kunda hal boʻladi.' },
    ],
    related: ['truck', 'buying', 'customs'],
    guideKeys: ['yiwu-guangzhou', 'shipping-from-china', 'prohibited-goods', 'order-from-1688'],
    cta: {
      title: 'Yukingiz Xitoyda — koʻz oʻngingizda.',
      text: 'Nechta sotuvchidan qancha yuk kutayotganingizni yozing — eng yaqin qabul punktining manzili va GS kodingizni beramiz, tekshiruv va qadoqlash variantini maslahat beramiz.',
      draft: 'Assalomu alaykum! Xitoydagi ombor xizmatlari kerak. Sotuvchilar soni: … Tovar: … Taxminiy ogʻirlik: … kg. Ochib tekshirish: kerak / kerak emas.',
    },
    updated: '2026-09-08',
  },

  ru: {
    key: 'warehouse',
    seo: {
      title: 'Склад в Китае: приёмка, проверка качества, фотоотчёт, упаковка — GSR Logistics',
      description:
        'В Китае три пункта приёма — Иу, Гуанчжоу и Кашгар: принимаем груз, маркируем вашим GS-кодом, вскрываем и проверяем, отправляем фотоотчёт, консолидируем от нескольких поставщиков, упаковываем и страхуем за 1%. 14 дней бесплатного хранения.',
    },
    hero: {
      eyebrow: 'Услуга 08 — Склад в Китае',
      h1: 'Склад в Китае: приёмка, проверка качества и фотоотчёт',
      intro:
        'Один из трёх пунктов приёма в Китае — Иу (义乌), Гуанчжоу (广州) или Кашгар (喀什) — первая остановка груза на пути в Ташкент. Здесь каждое место от поставщика взвешивают, обмеряют, маркируют вашим GS-кодом и фотографируют. По желанию вскрываем коробки, пересчитываем и проверяем товар (1 $/кг), переупаковываем (0,4 $/кг) и страхуем груз за 1% от объявленной стоимости. Хранение до 14 дней бесплатно.',
      facts: [
        { label: 'Бесплатное хранение, Китай', value: '14 дней' },
        { label: 'Проверка со вскрытием', value: '1 $/кг' },
        { label: 'Переупаковка', value: '0,4 $/кг' },
        { label: 'Страховка — от объявленной стоимости', value: '1%' },
      ],
    },
    sections: [
      {
        heading: 'Зачем нужен склад в Китае?',
        body: [
          'Купленный в Китае товар не приходит к вам напрямую — сначала он едет на адрес внутри Китая, то есть на склад. Таких адресов приёма в Китае три — Иу, Гуанчжоу и Кашгар: продавец с 1688 или Taobao, лавка на рынке Футянь или фабрика в Гуанчжоу отправляют груз в ближайший пункт. На какой адрес отправлять груз из Шэньчжэня и других городов — скажет менеджер.',
          'У склада три задачи: принять груз и поставить его на учёт, дать возможность проверить его до отправки и собрать коробки от нескольких поставщиков в одну партию. Благодаря этому вы, не выезжая в Китай и не зная китайского, своими глазами видите, что пришло, — пока груз ещё в Китае.',
        ],
        bullets: [
          'Продавцы Uzum и Instagram: собираем мелкие заказы от нескольких продавцов под одним GS-кодом.',
          'Оптовики: вскрываем партию, пересчитываем по моделям и размерам, сообщаем о браке.',
          'Производители: отделяем образец запчастей и сырья для сертификации и отправляем его в Ташкент заранее.',
        ],
      },
      {
        heading: 'Как проходит приёмка на складе?',
        body: [
          'После заключения договора вы получаете китайский адрес ближайшего пункта приёма, телефон получателя и личный GS-код (маркировку). Поставщик обязан написать этот код на каждой коробке до отправки — так склад узнаёт вашу коробку сразу при поступлении. Приёмка идёт так:',
        ],
        steps: [
          { title: 'Маркировка GS-кодом', text: 'Каждое место принимается, на него клеится GS-код и номер места. Код должен быть написан на коробке до отправки; коробку без GS-кода находим по трек-номеру поставщика — для этого вы заранее присылаете данные заказа.' },
          { title: 'Взвешивание и обмер', text: 'Записываются вес (кг) и три габарита (см) каждого места. По этим цифрам считаются объёмный вес и плотность — а из них складывается цена карго.' },
          { title: 'Внешний осмотр и фото', text: 'Коробка осматривается снаружи: если она помята, промокла или вскрыта, сразу фотографируем и сообщаем. При каждой приёмке в Telegram приходит фото весов и этикетки.' },
          { title: 'Проверка со вскрытием (по желанию)', text: 'По вашему запросу вскрываем коробку: пересчитываем товар, сверяем модель, цвет и размер с заказом, фотографируем видимые дефекты. Стоимость 1 $/кг, подробный фотоотчёт — 1 $ за место.' },
          { title: 'Решение за вами', text: 'Посмотрев фотоотчёт, вы решаете: отправлять, переупаковать или при браке вернуть продавцу. С продавцом мы говорим по-китайски сами.' },
          { title: 'Консолидация', text: 'Готовые места собираются в одну партию под вашим GS-кодом и грузятся в ближайшую фуру или контейнер. Вам приходят номер партии и дата отправки.' },
        ],
      },
      {
        heading: 'Что входит в фотоотчёт?',
        body: [
          'Фотоотчёт — ваши глаза в Китае. При обычной приёмке приходят показания весов, фото коробки и этикетки. В подробном отчёте — вскрытая коробка, общий вид товара, крупный план, найденный брак и результат пересчёта. Каждый отчёт отправляется в Telegram с GS-кодом и датой, поэтому любое место потом легко найти.',
          'Если пересчёт не совпадает с заказом — например, пришло 480 штук вместо 500, — мы пишем продавцу претензию и просим доложить недостачу в следующий груз или вернуть деньги. Пока товар в Китае, такой вопрос решается за несколько дней; в Ташкенте он почти не решается.',
        ],
        callout: {
          title: 'Совет менеджера',
          text: 'Груз от нового продавца всегда проверяйте со вскрытием: 1 $/кг на партии в 20 кг — это 20 $, а бракованная партия обойдётся дороже всей доставки. У постоянных проверенных продавцов достаточно внешнего осмотра и фото.',
          tone: 'success',
        },
      },
      {
        heading: 'Как выбираем упаковку?',
        body: [
          'Китайские продавцы часто отправляют товар в тонкой коробке или мешке. В пути груз перегружают несколько раз, поэтому упаковку подбираем под ваш товар. Переупаковка нередко уменьшает и объём — для лёгких грузов это снижает цену.',
        ],
        table: {
          caption: 'Виды упаковки',
          head: ['Вид', 'Для какого груза', 'Ориентировочная цена'],
          rows: [
            ['Стандарт: мешок или коробка + скотч', 'одежда, ткани, мелкие товары', 'входит в цену'],
            ['Переупаковка: новая коробка, уплотнение', 'мелкие коробки от нескольких продавцов', '0,4 $/кг'],
            ['Пузырчатая плёнка + картонные уголки', 'электроника, фарфор, стекло, светильники', 'от 0,4 $/кг'],
            ['Деревянная обрешётка', 'оборудование, мебель, крупные изделия со стеклом', 'по размерам груза'],
            ['Паллет и стрейч-плёнка', 'однородный груз от 300 кг', 'по размерам груза'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. Обрешётка и паллет считаются по размерам груза.',
        },
      },
      {
        heading: 'Как работает страховка?',
        body: [
          'Страховка — 1% от объявленной стоимости. Стоимость вы указываете по инвойсу или сумме заказа; при утере или повреждении груза возмещается именно она. Ответственность за незастрахованный груз ограничена пределом, прописанным в договоре. Для электроники, фарфора, стекла и дорогих товаров страховку рекомендуем; одежду и ткани большинство клиентов отправляют без неё.',
          'При повреждении доказательством служит фотоотчёт, сделанный при приёмке, — поэтому в Китае фотографируется каждое место, а в Ташкенте груз вскрывается при вас.',
        ],
      },
      {
        heading: 'Сроки хранения и оплата',
        body: [
          'В пункте приёма в Китае груз хранится бесплатно до 14 дней — этого хватает, чтобы дождаться коробок от нескольких продавцов. Дальше начисляется посуточная плата по договору. На складе в Ташкенте груз ждёт вас 3 дня бесплатно. Складские услуги (проверка, переупаковка, страховка) оплачиваются вместе с доставкой, когда груз прибыл в Ташкент.',
        ],
        table: {
          caption: 'Стоимость складских услуг',
          head: ['Услуга', 'Ориентировочная цена'],
          rows: [
            ['Приёмка, взвешивание, обмер, маркировка GS-кодом', 'входит в цену'],
            ['Фото весов и этикетки при каждой приёмке', 'входит в цену'],
            ['Подробный фотоотчёт (вскрытая коробка)', '1 $ / место'],
            ['Пересчёт и проверка со вскрытием', '1 $/кг'],
            ['Переупаковка', '0,4 $/кг'],
            ['Страховка', '1% от объявленной стоимости'],
            ['Хранение, Китай', '14 дней бесплатно'],
            ['Хранение, Ташкент', '3 дня бесплатно'],
          ],
          note: 'Ориентировочные цены · Обновлено: 8 сентября 2026 г. Итоговая сумма фиксируется после взвешивания груза.',
        },
      },
      {
        heading: 'Какие грузы на склад не принимаем?',
        body: ['Следующие товары на склад не принимаются — даже если продавец их отправил, в партию мы их не включим:'],
        bullets: [
          'Взрывчатые, горючие и ядовитые вещества, баллоны под давлением',
          'Растения, животные и скоропортящиеся продукты',
          'Деньги, драгоценные металлы и камни, ювелирные изделия, антиквариат',
          'Платёжные средства, ценные бумаги, личные документы',
          'Лекарства (коммерческие партии), оружие и его части, дроны, рации',
          'Подделки брендов (контрафакт) и всё, что запрещено законом',
          'Для авиа: литиевые аккумуляторы, жидкости, магниты — принимаются только на авто',
        ],
        callout: {
          title: 'Если товар спорный',
          text: 'Если ваш товар близок к списку (игрушка с батарейкой, аэрозоль, бытовая химия), напишите менеджеру до заказа — скажем, каким видом транспорта и с какими документами его можно привезти.',
          tone: 'warn',
        },
      },
    ],
    faq: [
      { q: 'Как получить адрес склада в Китае?', a: 'После заключения договора менеджер присылает в Telegram китайский адрес ближайшего пункта приёма — Иу, Гуанчжоу или Кашгар, — телефон получателя и ваш личный GS-код. Адрес вы указываете в заказе на 1688/Taobao или передаёте продавцу напрямую — и просите продавца написать GS-код на каждой коробке до отправки.' },
      { q: 'Как я узнаю, что груз поступил на склад?', a: 'При каждой приёмке в Telegram приходит фото весов и этикетки с GS-кодом — обычно в день поступления коробки. Если заранее прислать трек-номер ожидаемой коробки, склад опознает её сразу.' },
      { q: 'Обязательно ли вскрывать и проверять товар?', a: 'Нет, это услуга по желанию — 1 $/кг. Рекомендуем её для новых продавцов, электроники и товаров с высоким риском брака; у постоянных продавцов достаточно внешнего осмотра и бесплатного фото.' },
      { q: 'Можно ли собрать груз от нескольких продавцов в одну отправку?', a: 'Да, это консолидация — одна из главных задач склада. Все коробки ждут под вашим GS-кодом до 14 дней бесплатно, затем собираются в одну партию и отправляются. По желанию переупакуем коробки, чтобы уменьшить объём (0,4 $/кг).' },
      { q: 'Сколько стоит страховка и что она покрывает?', a: '1% от объявленной стоимости. При утере или повреждении возмещается объявленная стоимость; доказательством служит фотоотчёт при приёмке. Ответственность за незастрахованный груз ограничена договором.' },
      { q: 'Сколько груз хранится бесплатно?', a: 'В Китае — 14 дней, в Ташкенте — 3 дня. Дальше начисляется посуточная плата по договору. Перед китайским Новым годом склад прекращает приём за неделю до праздников — планируйте партию с учётом этого.' },
      { q: 'Что делать, если товар не соответствует заказу?', a: 'Посмотрев фотоотчёт, вы решаете: отправлять, возвращать продавцу или требовать недостающее. С продавцом мы общаемся по-китайски; пока товар в Китае, претензия чаще всего решается за несколько дней.' },
    ],
    related: ['truck', 'buying', 'customs'],
    guideKeys: ['yiwu-guangzhou', 'shipping-from-china', 'prohibited-goods', 'order-from-1688'],
    cta: {
      title: 'Ваш груз в Китае — как на ладони.',
      text: 'Напишите, сколько груза и от скольких продавцов вы ждёте — дадим адрес ближайшего пункта приёма и ваш GS-код, посоветуем вариант проверки и упаковки.',
      draft: 'Здравствуйте! Нужны услуги склада в Китае. Число продавцов: … Товар: … Примерный вес: … кг. Проверка со вскрытием: нужна / не нужна.',
    },
    updated: '2026-09-08',
  },

  en: {
    key: 'warehouse',
    seo: {
      title: 'China warehouse: receiving, quality control, photo reports, packing — GSR Logistics',
      description:
        'At the three receiving points in China — Yiwu, Guangzhou and Kashgar — we receive your cargo, label it with your GS code, open and inspect it, send photo reports, consolidate goods from several suppliers, repack and insure for 1%. 14 days of free storage.',
    },
    hero: {
      eyebrow: 'Service 08 — China warehouse',
      h1: 'China warehouse: receiving, quality control and photo reports',
      intro:
        'One of three receiving points in China — Yiwu (义乌), Guangzhou (广州) or Kashgar (喀什) — is the first stop for your shipment on the way to Tashkent. Here each piece from your supplier is weighed, measured, labelled with your GS code and photographed. On request we open the boxes, count and inspect the goods ($1/kg), repack them ($0.40/kg) and insure the cargo for 1% of its declared value. Storage is free for up to 14 days.',
      facts: [
        { label: 'Free storage, China', value: '14 days' },
        { label: 'Inspection with opening', value: '$1/kg' },
        { label: 'Repacking', value: '$0.40/kg' },
        { label: 'Insurance, of declared value', value: '1%' },
      ],
    },
    sections: [
      {
        heading: 'Why do you need a warehouse in China?',
        body: [
          'Goods bought in China do not come to you directly — they first go to an address inside China, which is a warehouse. There are three such receiving addresses in China — Yiwu, Guangzhou and Kashgar: a seller on 1688 or Taobao, a stall at the Futian market or a factory in Guangzhou ships the cargo to the nearest one. For Shenzhen and other cities your manager tells you which address to use.',
          'The warehouse does three jobs: it receives and records the cargo, lets you check it before dispatch, and consolidates boxes from several suppliers into one lot. That way you see with your own eyes what has arrived — without travelling to China or speaking Chinese, and while the cargo is still there.',
        ],
        bullets: [
          'Uzum and Instagram sellers: we gather small orders from several sellers under one GS code.',
          'Wholesalers: we open the lot, count it by model and size and report any defects.',
          'Manufacturers: we set aside a sample of parts or raw material for certification and send it to Tashkent ahead of the lot.',
        ],
      },
      {
        heading: 'How is cargo received at the warehouse?',
        body: [
          'Once the contract is signed you receive the Chinese address of the nearest receiving point, the receiver’s phone number and a personal GS code (shipping mark). The supplier must write this code on every carton before dispatch, so the warehouse recognises your box the moment it arrives. Receiving works like this:',
        ],
        steps: [
          { title: 'Labelling with your GS code', text: 'Every piece is accepted and labelled with your GS code and a piece number. The code must already be on the carton at dispatch; a box that arrives without a GS code is identified by the supplier’s tracking number — which is why you send the order details in advance.' },
          { title: 'Weighing and measuring', text: 'The weight (kg) and three dimensions (cm) of every piece are recorded. Volumetric weight and density are calculated from these figures — and the cargo price follows from them.' },
          { title: 'External check and photo', text: 'The box is inspected from the outside: if it is crushed, wet or opened, we photograph it and tell you at once. At every receipt a photo of the scale and the label lands in your Telegram.' },
          { title: 'Opening and inspection (optional)', text: 'On your request we open the box, count the goods, compare model, colour and size with the order, and photograph visible defects. The cost is $1/kg; a detailed photo report is $1 per piece.' },
          { title: 'The decision is yours', text: 'After viewing the photo report you decide: ship, repack, or return to the seller in case of defects. We talk to the seller in Chinese ourselves.' },
          { title: 'Consolidation', text: 'Ready pieces are gathered into one lot under your GS code and loaded onto the next truck or container. You receive the lot number and the dispatch date.' },
        ],
      },
      {
        heading: 'What does a photo report contain?',
        body: [
          'The photo report is your eyes in China. A standard receipt brings the scale reading and photos of the box and label. A detailed report shows the opened box, an overall view of the goods, a close-up, any defects found and the count result. Every report goes to Telegram with the GS code and date, so any piece is easy to find later.',
          'If the count does not match the order — 480 pieces instead of 500, say — we file a claim with the seller and ask them to add the shortfall to the next shipment or refund it. While the goods are still in China this is usually settled in a few days; in Tashkent it is almost impossible to settle.',
        ],
        callout: {
          title: 'Manager’s tip',
          text: 'Always have cargo from a first-time seller opened and inspected: $1/kg on a 20 kg lot is $20, while a defective lot costs more than the whole delivery. With regular, trusted sellers an external check and the free photo are enough.',
          tone: 'success',
        },
      },
      {
        heading: 'How is packing chosen?',
        body: [
          'Chinese sellers often ship goods in a thin box or a woven bag. Cargo is reloaded several times on the way, so we choose the packing to suit your goods. Repacking often reduces the volume as well — for bulky cargo that lowers the price.',
        ],
        table: {
          caption: 'Packing options',
          head: ['Type', 'For which cargo', 'Estimated price'],
          rows: [
            ['Standard: bag or box + tape', 'clothing, fabric, small goods', 'included'],
            ['Repacking: new box, compaction', 'small boxes from several sellers', '$0.40/kg'],
            ['Bubble wrap + cardboard corners', 'electronics, porcelain, glass, lamps', 'from $0.40/kg'],
            ['Wooden crate', 'machinery, furniture, large items with glass', 'by cargo dimensions'],
            ['Pallet and stretch film', 'uniform cargo over 300 kg', 'by cargo dimensions'],
          ],
          note: 'Estimates · Updated September 8, 2026. Crates and pallets are priced by the dimensions of the cargo.',
        },
      },
      {
        heading: 'How does insurance work?',
        body: [
          'Insurance costs 1% of the declared value. You declare the value from the invoice or the order total; if the cargo is lost or damaged, that value is reimbursed. Liability for uninsured cargo is limited to the cap written in the contract. We recommend insurance for electronics, porcelain, glass and high-value goods; most clients ship clothing and fabric without it.',
          'In case of damage the photo report taken at receipt serves as evidence — which is why every piece is photographed in China and the cargo is opened in your presence in Tashkent.',
        ],
      },
      {
        heading: 'Storage terms and payment',
        body: [
          'Cargo is stored free at the receiving point in China for up to 14 days — enough to wait for boxes from several sellers. After that a daily storage charge applies under the contract. At the Tashkent warehouse the cargo waits for you free for 3 days. Warehouse services (inspection, repacking, insurance) are paid together with the freight when the cargo arrives in Tashkent.',
        ],
        table: {
          caption: 'Warehouse service prices',
          head: ['Service', 'Estimated price'],
          rows: [
            ['Receiving, weighing, measuring, GS code labelling', 'included'],
            ['Scale and label photo at every receipt', 'included'],
            ['Detailed photo report (opened box)', '$1 per piece'],
            ['Counting and inspection with opening', '$1/kg'],
            ['Repacking', '$0.40/kg'],
            ['Insurance', '1% of declared value'],
            ['Storage, China', '14 days free'],
            ['Storage, Tashkent', '3 days free'],
          ],
          note: 'Estimates · Updated September 8, 2026. The final amount is fixed after the cargo is weighed.',
        },
      },
      {
        heading: 'Which goods does the warehouse not accept?',
        body: ['The following goods are not accepted at the warehouse — even if the seller has shipped them, we will not add them to a lot:'],
        bullets: [
          'Explosive, flammable and toxic substances, pressurised cylinders',
          'Plants, animals and perishable products',
          'Cash, precious metals and stones, jewellery, antiques',
          'Payment instruments, securities, personal documents',
          'Medicines (commercial lots), weapons and their parts, drones, two-way radios',
          'Counterfeit brands and anything else prohibited by law',
          'For air freight: lithium batteries, liquids, magnets — accepted for truck freight only',
        ],
        callout: {
          title: 'If your goods are borderline',
          text: 'If your product is close to the list (a battery-powered toy, an aerosol, a household chemical), message your manager before ordering — we will tell you by which mode and with which documents it can be shipped.',
          tone: 'warn',
        },
      },
    ],
    faq: [
      { q: 'How do I get the warehouse address in China?', a: 'Once the contract is signed, your manager sends the Chinese address of the nearest receiving point — Yiwu, Guangzhou or Kashgar — the receiver’s phone number and your personal GS code on Telegram. You enter the address in your 1688/Taobao order or give it to the seller directly — and ask the seller to write the GS code on every carton before dispatch.' },
      { q: 'How will I know my cargo has reached the warehouse?', a: 'At every receipt a photo of the scale and the label with your GS code arrives on Telegram — usually on the day the box comes in. If you send the tracking number of an expected box in advance, the warehouse identifies it immediately.' },
      { q: 'Do I have to have the goods opened and inspected?', a: 'No, it is an optional service at $1/kg. We recommend it for first-time sellers, electronics and goods with a high risk of defects; with regular sellers the external check and the free photo are enough.' },
      { q: 'Can cargo from several sellers be combined into one shipment?', a: 'Yes — that is consolidation, one of the warehouse’s main jobs. All boxes wait under your GS code free for up to 14 days, then they are gathered into one lot and shipped. If you wish, we repack the boxes to reduce the volume ($0.40/kg).' },
      { q: 'How much does insurance cost and what does it cover?', a: '1% of the declared value. If the cargo is lost or damaged, the declared value is reimbursed; the photo report taken at receipt serves as evidence. Liability for uninsured cargo is limited by the contract.' },
      { q: 'How long is storage free?', a: '14 days in China and 3 days in Tashkent. After that a daily charge applies under the contract. Before Chinese New Year the warehouse stops receiving a week ahead of the holiday — plan your lot accordingly.' },
      { q: 'What happens if the goods do not match the order?', a: 'After viewing the photo report you decide: ship, return to the seller, or claim the missing items. We deal with the seller in Chinese; while the goods are still in China a claim is usually settled within a few days.' },
    ],
    related: ['truck', 'buying', 'customs'],
    guideKeys: ['yiwu-guangzhou', 'shipping-from-china', 'prohibited-goods', 'order-from-1688'],
    cta: {
      title: 'Your cargo in China, in plain sight.',
      text: 'Tell us how much cargo you expect and from how many sellers — we will send the address of the nearest receiving point and your GS code and suggest the inspection and packing options.',
      draft: 'Hello! I need the China warehouse services. Number of sellers: … Product: … Approximate weight: … kg. Inspection with opening: yes / no.',
    },
    updated: '2026-09-08',
  },
};

export default content;
