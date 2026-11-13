import type { ServiceContentSource } from './types';

/**
 * Afgʻonistonga yuk tashish — long-form page content (service 10, a NEW direction, written 2026-11-12).
 * Every claim comes from the owner's answers of 2026-11-11 and 2026-11-12 (FACTS §12), and nothing more:
 *   - truck only: a full truck (the whole truck for one client) or consolidated cargo (small lots accepted);
 *   - two directions: China → Afghanistan in transit through Uzbekistan, and Uzbekistan → Afghanistan (export);
 *   - from China (2026-11-12): the cargo is received in Yiwu (uz Ivu, ru Иу — a receiving point, never "our
 *     warehouse") and travels by truck through Kazakhstan and Uzbekistan. Not confirmed: another receiving city,
 *     loading at the factory, the border crossings before Uzbekistan, the same truck all the way, TIR on the
 *     whole route, a time or a distance of that road;
 *   - two delivery points: Hairatan (the border, the Termez–Hairatan crossing; the client collects there) and
 *     Mazar-i-Sharif. No other Afghan place may be named;
 *   - price, transit time and the smallest lot are ON REQUEST. This page prints no price and no number of days,
 *     and no hero fact carries a digit. The only figures are the WhatsApp number and the 1 m³ minimum, named
 *     once to say that it belongs to China → Tashkent;
 *   - in Uzbekistan: the transit declaration is filed by GSR's own customs broker ("our own customs broker":
 *     its legal name and register number are never printed — owner, 2026-11-12), CMR / TIR documents are
 *     prepared and checked, help with security for customs payments;
 *   - the Afghan side (2026-11-12): customs there is cleared by GSR's partners — customs agents (declarants),
 *     always named as such in the same sentence; the page also says that the manager explains the procedure and
 *     the documents there. Never write that the partners receive, store, deliver or hand over the cargo, and
 *     never name them. Who PAYS the Afghan duties and taxes is NOT confirmed and is never said;
 *   - payment (2026-11-12): through a bank that works between Uzbekistan and Afghanistan, under a contract between
 *     the two sides (the client and GSR). Not confirmed: the bank's name, a currency, cash, prepayment, a payment
 *     schedule (when the client pays), a letter of credit;
 *   - tracking (2026-11-12): the client follows the cargo through GSR's ERP system, in Telegram — never real-time,
 *     live, GPS, satellite or "where the truck is right now"; no QR code or bot for this direction;
 *   - the warehouse under customs control in Tashkent is a PARTNER's; GSR allocates space there;
 *   - contact: WhatsApp and Telegram; Persian or Dari is answered in Persian through a translator.
 * The hero fact «Hayraton · Mozori Sharif» carries a no-break space before its dot (\u00A0): on a 360px phone the
 * Cyrillic lines otherwise began with the dot.
 * Never add: cargo from Afghanistan, rail / sea / air, a schedule, years of experience, an office, branch,
 * representative, employee, warehouse or terminal in Afghanistan; the partners' names; who pays the Afghan duties;
 * DDP; the bank's name, a currency, cash, prepayment, a payment schedule, a letter of credit; other receiving
 * cities; the broker's name. uz, ru and en keep the same structure (zh and fa are translated from en): key,
 * related, guideKeys, updated and callout tones must stay byte-identical in all three.
 */
const content: ServiceContentSource = {
  uz: {
    key: 'afghanistan',
    seo: {
      title: 'Afgʻonistonga yuk tashish: Xitoy va Oʻzbekistondan fura bilan',
      description:
        'Xitoydan va Oʻzbekistondan Afgʻonistonga fura bilan yuk tashiymiz: butun fura yoki yigʻma yuk, Hayraton va Mozori Sharifgacha. Narx va muddat — soʻrov boʻyicha.',
    },
    hero: {
      eyebrow: 'Xizmat 10 — Afgʻoniston',
      h1: 'Afgʻonistonga yuk tashish: Xitoydan va Oʻzbekistondan, fura bilan',
      intro:
        'Toshkentdagi GSR Logistics kompaniyasi endi Afgʻonistonga ham fura bilan yuk tashiydi. Xitoydagi yuk Ivuda qabul qilinadi, Qozogʻiston orqali keladi va Oʻzbekiston hududidan tranzit tartibida oʻtadi, Oʻzbekistondagi yuk esa toʻgʻridan-toʻgʻri joʻnatiladi. Butun fura ham, yigʻma yuk ham olamiz. Yukni Hayraton chegara postigacha yoki Mozori Sharifgacha yetkazamiz. Narx va muddat har bir yuk uchun alohida hisoblanadi.',
      facts: [
        { label: 'Qayerdan', value: 'Xitoy · Oʻzbekiston' },
        { label: 'Transport', value: 'Fura' },
        { label: 'Qayerga', value: 'Hayraton\u00A0· Mozori Sharif' },
        { label: 'Narx va muddat', value: 'Soʻrov boʻyicha' },
      ],
    },
    sections: [
      {
        heading: 'Qaysi yoʻnalishlarda yuk tashiymiz?',
        body: [
          'Ikki yoʻnalishda: Xitoydan Afgʻonistonga va Oʻzbekistondan Afgʻonistonga. Afgʻoniston — biz uchun yangi yoʻnalish. Ikkala holda ham yuk faqat fura bilan tashiladi.',
        ],
        table: {
          caption: 'Afgʻonistonga ikki yoʻnalish',
          head: ['Yoʻnalish', 'Yuk qanday boradi'],
          rows: [
            ['Xitoy → Afgʻoniston', 'Ivuda qabul qilinadi; fura bilan Qozogʻiston orqali, keyin Oʻzbekiston orqali tranzit tartibida'],
            ['Oʻzbekiston → Afgʻoniston', 'fura bilan, toʻgʻridan-toʻgʻri (eksport)'],
          ],
          note: 'Ikkala yoʻnalishda ham yuk Hayraton chegara postigacha yoki Mozori Sharifgacha yetkaziladi. Narx va muddat — soʻrov boʻyicha.',
        },
        callout: {
          title: 'Yuk chegaradan qayerda oʻtadi?',
          text: 'Yuk Oʻzbekiston–Afgʻoniston chegarasidan Termiz–Hayraton chegara posti orqali oʻtadi. Termiz — Oʻzbekiston tomonidagi shahar, Hayraton — Afgʻoniston tomonidagi chegara shaharchasi.',
          tone: 'info',
        },
      },
      {
        heading: 'Butun fura yoki yigʻma yuk?',
        body: [
          'Ikkalasini ham tashiymiz. Eng kichik partiya hajmi menejer bilan kelishiladi.',
        ],
        bullets: [
          'Butun fura — fura toʻliq bitta mijozning yukiga beriladi.',
          'Yigʻma yuk — bir necha mijozning yuki bitta furada ketadi; kichik partiyalar ham qabul qilinadi.',
        ],
      },
      {
        heading: 'Yuk qayergacha yetkaziladi?',
        body: [
          'Ikki nuqtadan birigacha: Hayratongacha yoki Mozori Sharifgacha. Bugungi kunda yetkazish nuqtalari shu ikkita. Aniq topshirish joyini menejer yukingiz boʻyicha aytadi.',
        ],
        bullets: [
          'Hayraton — Afgʻoniston tomonidagi chegara shaharchasi: yukni shu yerda oʻzingiz qabul qilib olasiz.',
          'Mozori Sharif — yukni shahargacha yetkazamiz.',
        ],
      },
      {
        heading: 'Qanday yuklarni tashiymiz?',
        body: [
          'Asosan uch guruh yukni tashiymiz: isteʼmol tovarlari (kiyim-kechak, uy-roʻzgʻor buyumlari, elektronika va shunga oʻxshash savdo tovarlari), qurilish va pardozlash materiallari, uskunalar va ehtiyot qismlar.',
        ],
        callout: {
          title: 'Yukingiz boshqa turda boʻlsa',
          text: 'Yukingiz bu roʻyxatda boʻlmasa, uning nomini yozing: uni olamizmi yoki yoʻqmi, menejer aytadi.',
          tone: 'info',
        },
      },
      {
        heading: 'Hujjatlar va bojxona bilan kim shugʻullanadi?',
        body: [
          'Oʻzbekiston hududidagi tranzit hujjatlarini biz rasmiylashtiramiz.',
          'Tranzit yuki Oʻzbekiston hududidan bojxona nazorati ostida oʻtadi. Bunda bizning ishimiz:',
        ],
        bullets: [
          'Tranzit deklaratsiyasi — uni bojxonaga oʻz bojxona brokerimiz topshiradi.',
          'CMR va TIR hujjatlari — xalqaro avtomobil tashuvi hujjatlarini tayyorlaymiz va tekshiramiz.',
          'Bojxona toʻlovlari taʼminoti (kafolat) — tranzit yuki uchun uni rasmiylashtirishda yordam beramiz.',
        ],
        callout: {
          title: 'Afgʻoniston tomoni va eksport',
          text: 'Afgʻoniston tomonida bojxona rasmiylashtiruvini hamkorlarimiz — deklarant agentlar bajaradi. Afgʻoniston tomonida qanday tartib va qaysi hujjatlar kerakligini menejer yukingiz boʻyicha tushuntiradi. Oʻzbekistondan joʻnatiladigan yuk (eksport) uchun kerakli hujjatlarni ham menejer aytadi.',
          tone: 'info',
        },
      },
      {
        heading: 'Yana qanday xizmatlar koʻrsatamiz?',
        body: [
          'Tashishdan tashqari yana toʻrt xizmat koʻrsatamiz: Xitoyda tovar topish va sotib olish, Toshkentda qayta yuklash va ombor, yuk sugʻurtasi, sertifikat va ruxsatnomalar olishda yordam.',
        ],
        bullets: [
          'Xitoyda tovar topish va sotib olish — afgʻonistonlik tadbirkorlar uchun ham: tovarni topamiz, sotib olamiz va yetkazamiz.',
          'Toshkentda qayta yuklash — furadan furaga yoki ombor orqali. Bojxona nazoratidagi ombordan joy ajratamiz; ombor hamkorimizga tegishli.',
          'Yuk sugʻurtasi — tashish vaqti uchun.',
          'Sertifikat va ruxsatnomalar olishda yordam — muvofiqlik sertifikati, fitosanitariya sertifikati va boshqa hujjatlar.',
        ],
      },
      {
        heading: 'Ishni qanday boshlaymiz?',
        body: [
          'WhatsApp yoki Telegramga yozing — ish shundan boshlanadi. Fors yoki dari tilida yozsangiz, tarjimon yordamida forscha javob beramiz. Ingliz, rus va oʻzbek tillarida ham javob beramiz.',
        ],
        steps: [
          { title: 'Bizga yozasiz', text: 'WhatsApp (+998 90 175 78 00) yoki Telegramga yozing: yuk nima, hajmi yoki ogʻirligi qancha, hozir qayerda va qayerga borishi kerak — Hayratongami yoki Mozori Sharifgami.' },
          { title: 'Narx va muddatni hisoblaymiz', text: 'Menejer narx va muddatni yukingiz boʻyicha hisoblab beradi va butun fura yoki yigʻma yuk variantini taklif qiladi.' },
          { title: 'Shartnoma', text: 'Toʻlov Oʻzbekiston va Afgʻoniston oʻrtasida ishlaydigan bank orqali, siz bilan biz oʻrtasidagi shartnoma asosida oʻtadi.' },
          { title: 'Hujjatlar', text: 'Sizdan qaysi hujjatlar kerakligini aytamiz. Oʻzbekiston hududidagi tranzit hujjatlarini oʻzimiz rasmiylashtiramiz.' },
          { title: 'Yuklash va joʻnatish', text: 'Xitoyda Afgʻonistonga boradigan yuk Ivuda qabul qilinadi; u yerdan fura bilan Qozogʻiston va Oʻzbekiston orqali yoʻlga chiqadi. Yuk Oʻzbekistonda boʻlsa, uni qayerda qabul qilishimizni menejer aytadi.' },
          { title: 'Yoʻlda', text: 'Yukni ERP tizimimiz orqali Telegramda kuzatib borasiz.' },
          { title: 'Yukni topshirish', text: 'Yukni Hayratonda chegarada qabul qilib olasiz yoki biz uni Mozori Sharifgacha yetkazamiz.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Afgʻonistonga yuk tashiysizmi va qayergacha?',
        a: 'Ha, fura bilan — Hayraton chegara postigacha yoki Mozori Sharifgacha. Yuk Xitoydan (Oʻzbekiston orqali tranzit tartibida) yoki Oʻzbekistondan joʻnatiladi. Bugungi kunda yetkazish nuqtalari shu ikkita.',
      },
      {
        q: 'Narxi qancha va yuk necha kunda yetib boradi?',
        a: 'Narx va muddat — soʻrov boʻyicha: menejer ularni yukingiz boʻyicha hisoblab beradi. Buning uchun yuk nomini, hajmi yoki ogʻirligini, qayerdan va qayerga ekanini yozing. Saytdagi tariflar, kalkulyator va muddatlar faqat Xitoy → Toshkent yoʻnalishiga tegishli.',
      },
      {
        q: 'Minimal hajm bormi?',
        a: 'Eng kichik partiya hajmi menejer bilan kelishiladi — bu sahifada son koʻrsatilmagan. Yigʻma yukda kichik partiyalar ham qabul qilinadi. Saytdagi 1 m³ minimum Xitoydan Toshkentga keladigan yigʻma yukka tegishli.',
      },
      {
        q: 'Tovarni Xitoydan topib, sotib olib bera olasizmi?',
        a: 'Ha. Xitoyda tovar topish va sotib olish xizmati afgʻonistonlik tadbirkorlar uchun ham ishlaydi: tovarni topamiz, sotib olamiz va Hayraton yoki Mozori Sharifgacha yetkazamiz. Shartlarni menejer buyurtmadan oldin aytadi.',
      },
      {
        q: 'Qaysi tilda va qayerga yozsam boʻladi?',
        a: 'WhatsApp (+998 90 175 78 00) yoki Telegramga yozing. Fors yoki dari tilida yozsangiz, tarjimon yordamida forscha javob beramiz. Ingliz, rus va oʻzbek tillarida ham javob beramiz.',
      },
      {
        q: 'Oʻzbekistonda qaysi hujjatlar sizning zimmangizda?',
        a: 'Oʻzbekiston hududidagi tranzit hujjatlari: tranzit deklaratsiyasini oʻz bojxona brokerimiz topshiradi, CMR va TIR hujjatlarini tayyorlaymiz va tekshiramiz, bojxona toʻlovlari taʼminotini (kafolatni) rasmiylashtirishda yordam beramiz. Afgʻoniston tomonida bojxona rasmiylashtiruvini hamkorlarimiz — deklarant agentlar bajaradi.',
      },
      {
        q: 'Afgʻonistondan qanday toʻlayman?',
        a: 'Toʻlov Oʻzbekiston va Afgʻoniston oʻrtasida ishlaydigan bank orqali, siz bilan biz oʻrtasidagi shartnoma asosida oʻtadi.',
      },
      {
        q: 'Yukimni qanday kuzatib boraman?',
        a: 'Yukni ERP tizimimiz orqali Telegramda kuzatib borasiz.',
      },
    ],
    related: ['transit', 'bonded', 'sourcing'],
    guideKeys: ['china-afghanistan', 'uzbekistan-transit'],
    cta: {
      title: 'Yukingiz haqida yozing — narx va muddatni hisoblab beramiz.',
      text: 'Yuk nomini, hajmi yoki ogʻirligini, qayerdan va qayerga ekanini WhatsApp yoki Telegramga yozing. Menejer narx va muddatni yukingiz boʻyicha hisoblab beradi.',
      draft: 'Salom! Afgʻonistonga yuk tashish boʻyicha savolim bor. Yuk: … Hajmi yoki ogʻirligi: … Qayerdan: … Qayerga: Hayraton / Mozori Sharif',
    },
    updated: '2026-11-13',
  },

  ru: {
    key: 'afghanistan',
    seo: {
      title: 'Доставка грузов в Афганистан фурой из Китая и Узбекистана',
      description:
        'Возим грузы фурами в Афганистан из Китая и из Узбекистана: целая фура или сборный груз, до Хайратона и Мазари-Шарифа. Цена и срок — по запросу.',
    },
    hero: {
      eyebrow: 'Услуга 10 — Афганистан',
      h1: 'Грузы в Афганистан: из Китая и из Узбекистана, фурой',
      intro:
        'GSR Logistics, логистическая компания из Ташкента, теперь возит грузы фурами и в Афганистан. Груз из Китая принимают в Иу, оттуда он идёт через Казахстан, затем транзитом через Узбекистан, а груз, который находится в Узбекистане, отправляется напрямую. Берём и целую фуру, и сборный груз. Довозим до пограничного перехода Хайратон или до Мазари-Шарифа. Цена и срок считаются отдельно для каждого груза.',
      facts: [
        { label: 'Откуда', value: 'Китай · Узбекистан' },
        { label: 'Транспорт', value: 'Фура' },
        { label: 'Куда', value: 'Хайратон\u00A0· Мазари-Шариф' },
        { label: 'Цена и срок', value: 'По запросу' },
      ],
    },
    sections: [
      {
        heading: 'По каким направлениям возим грузы?',
        body: [
          'По двум: из Китая в Афганистан и из Узбекистана в Афганистан. Афганистан — новое для нас направление. В обоих случаях груз едет только фурой.',
        ],
        table: {
          caption: 'Два направления в Афганистан',
          head: ['Направление', 'Как едет груз'],
          rows: [
            ['Китай → Афганистан', 'груз принимают в Иу; фурой через Казахстан, затем транзитом через Узбекистан'],
            ['Узбекистан → Афганистан', 'фурой, напрямую (экспорт)'],
          ],
          note: 'В обоих случаях груз доставляется до пограничного перехода Хайратон или до Мазари-Шарифа. Цена и срок — по запросу.',
        },
        callout: {
          title: 'Где груз пересекает границу?',
          text: 'Границу Узбекистана и Афганистана груз пересекает на пограничном переходе Термез — Хайратон. Термез — город на узбекской стороне, Хайратон — приграничный город на афганской стороне.',
          tone: 'info',
        },
      },
      {
        heading: 'Целая фура или сборный груз?',
        body: [
          'Возим и то, и другое. Минимальный размер партии согласуется с менеджером.',
        ],
        bullets: [
          'Целая фура — вся фура отдаётся под груз одного клиента.',
          'Сборный груз — грузы нескольких клиентов едут в одной фуре; принимаем и небольшие партии.',
        ],
      },
      {
        heading: 'Куда доставляем груз?',
        body: [
          'В одну из двух точек: в Хайратон или в Мазари-Шариф. Сегодня точек доставки две. Точное место передачи груза называет менеджер.',
        ],
        bullets: [
          'Хайратон — приграничный город на афганской стороне: здесь вы принимаете груз сами.',
          'Мазари-Шариф — довозим груз до города.',
        ],
      },
      {
        heading: 'Какие грузы возим?',
        body: [
          'В основном три группы грузов: потребительские товары (одежда, товары для дома, электроника и другие подобные товары), строительные и отделочные материалы, оборудование и запчасти.',
        ],
        callout: {
          title: 'Если у вас другой груз',
          text: 'Если вашего груза нет в этом списке, напишите, что это за груз: менеджер скажет, берём мы его или нет.',
          tone: 'info',
        },
      },
      {
        heading: 'Кто занимается документами и таможней?',
        body: [
          'Транзитные документы на территории Узбекистана оформляем мы.',
          'Транзитный груз идёт по территории Узбекистана под таможенным контролем. Наша часть работы:',
        ],
        bullets: [
          'Транзитная декларация — её подаёт в таможню наш собственный таможенный брокер.',
          'Документы CMR и TIR — готовим и проверяем международные автотранспортные документы.',
          'Обеспечение уплаты таможенных платежей (гарантия) — помогаем оформить его для транзитного груза.',
        ],
        callout: {
          title: 'Афганская сторона и экспорт',
          text: 'На афганской стороне таможенное оформление проводят наши партнёры — таможенные агенты (декларанты). Какой порядок и какие документы нужны на афганской стороне, менеджер объясняет под ваш груз. Для груза, который отправляется из Узбекистана (экспорт), нужные документы тоже называет менеджер.',
          tone: 'info',
        },
      },
      {
        heading: 'Что ещё мы делаем?',
        body: [
          'Кроме перевозки, оказываем ещё четыре услуги: поиск и выкуп товаров в Китае, перегрузку и склад в Ташкенте, страхование груза, помощь с сертификатами и разрешениями.',
        ],
        bullets: [
          'Поиск и выкуп товаров в Китае — в том числе для предпринимателей из Афганистана: находим товар, выкупаем и доставляем.',
          'Перегрузка в Ташкенте — из фуры в фуру или через склад. Выделяем место на складе под таможенным контролем; склад принадлежит нашему партнёру.',
          'Страхование груза — на время перевозки.',
          'Помощь в получении сертификатов и разрешений — сертификат соответствия, фитосанитарный сертификат и другие документы.',
        ],
      },
      {
        heading: 'Как начать?',
        body: [
          'Напишите нам в WhatsApp или Telegram — с этого начинается работа. Если напишете на фарси или дари, ответим на фарси с помощью переводчика. Отвечаем также на английском, русском и узбекском.',
        ],
        steps: [
          { title: 'Пишете нам', text: 'Напишите в WhatsApp (+998 90 175 78 00) или в Telegram: что за груз, какой у него объём или вес, где он сейчас и куда его везти — в Хайратон или в Мазари-Шариф.' },
          { title: 'Считаем цену и срок', text: 'Менеджер считает цену и срок под ваш груз и предлагает вариант: целая фура или сборный груз.' },
          { title: 'Договор', text: 'Оплата проходит через банк, который работает между Узбекистаном и Афганистаном, по договору между вами и нами.' },
          { title: 'Документы', text: 'Говорим, какие документы нужны от вас. Транзитные документы на территории Узбекистана оформляем сами.' },
          { title: 'Погрузка и отправка', text: 'В Китае груз для Афганистана принимают в Иу; оттуда он идёт фурой через Казахстан и Узбекистан. Если груз уже в Узбекистане, менеджер скажет, где мы его принимаем.' },
          { title: 'В пути', text: 'За грузом вы следите через нашу ERP-систему в Telegram.' },
          { title: 'Передача груза', text: 'Вы принимаете груз на границе в Хайратоне, или мы довозим его до Мазари-Шарифа.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Возите ли вы грузы в Афганистан и до какого пункта?',
        a: 'Да, фурой — до пограничного перехода Хайратон или до Мазари-Шарифа. Груз отправляется из Китая (транзитом через Узбекистан) или из Узбекистана. Сегодня точек доставки две.',
      },
      {
        q: 'Сколько это стоит и сколько дней идёт груз?',
        a: 'Цена и срок — по запросу: менеджер считает их под ваш груз. Для расчёта напишите, что за груз, его объём или вес, откуда и куда его везти. Тарифы, калькулятор и сроки на сайте относятся только к направлению Китай → Ташкент.',
      },
      {
        q: 'Есть ли минимальный объём?',
        a: 'Минимальный размер партии согласуется с менеджером — на этой странице цифры нет. В сборной фуре принимаем и небольшие партии. Минимум 1 м³, указанный на сайте, относится к сборному грузу из Китая в Ташкент.',
      },
      {
        q: 'Можете ли вы найти и выкупить товар в Китае?',
        a: 'Да. Поиск и выкуп товаров в Китае доступны и предпринимателям из Афганистана: находим товар, выкупаем и доставляем до Хайратона или Мазари-Шарифа. Условия менеджер называет до заказа.',
      },
      {
        q: 'На каком языке и куда писать?',
        a: 'Пишите в WhatsApp (+998 90 175 78 00) или в Telegram. Если напишете на фарси или дари, ответим на фарси с помощью переводчика. Отвечаем также на английском, русском и узбекском.',
      },
      {
        q: 'Какие документы в Узбекистане вы берёте на себя?',
        a: 'Транзитные документы на территории Узбекистана: транзитную декларацию подаёт наш собственный таможенный брокер, документы CMR и TIR мы готовим и проверяем, а с обеспечением уплаты таможенных платежей (гарантией) помогаем. На афганской стороне таможенное оформление проводят наши партнёры — таможенные агенты (декларанты).',
      },
      {
        q: 'Как оплатить из Афганистана?',
        a: 'Оплата проходит через банк, который работает между Узбекистаном и Афганистаном, по договору между вами и нами.',
      },
      {
        q: 'Как следить за своим грузом?',
        a: 'За грузом вы следите через нашу ERP-систему в Telegram.',
      },
    ],
    related: ['transit', 'bonded', 'sourcing'],
    guideKeys: ['china-afghanistan', 'uzbekistan-transit'],
    cta: {
      title: 'Напишите о своём грузе — посчитаем цену и срок.',
      text: 'Напишите в WhatsApp или Telegram, что за груз, его объём или вес, откуда и куда его везти. Менеджер посчитает цену и срок под ваш груз.',
      draft: 'Здравствуйте! У меня вопрос по перевозке груза в Афганистан. Груз: … Объём или вес: … Откуда: … Куда: Хайратон / Мазари-Шариф',
    },
    updated: '2026-11-13',
  },

  en: {
    key: 'afghanistan',
    seo: {
      title: 'Cargo to Afghanistan by truck from China and Uzbekistan',
      description:
        'Truck cargo to Afghanistan from China and from Uzbekistan: a full truck or consolidated cargo, to Hairatan and Mazar-i-Sharif. Price and timing on request.',
    },
    hero: {
      eyebrow: 'Service 10 — Afghanistan',
      h1: 'Cargo to Afghanistan: from China and from Uzbekistan, by truck',
      intro:
        'GSR Logistics, a logistics company in Tashkent, now also carries cargo to Afghanistan by truck. Cargo from China is received in Yiwu and travels through Kazakhstan, then crosses Uzbekistan in transit; cargo that is already in Uzbekistan leaves directly. We take a full truck or consolidated cargo. We deliver to the Hairatan border crossing or to Mazar-i-Sharif. Price and timing are calculated for each shipment separately.',
      facts: [
        { label: 'From', value: 'China · Uzbekistan' },
        { label: 'Transport', value: 'Truck' },
        { label: 'To', value: 'Hairatan\u00A0· Mazar-i-Sharif' },
        { label: 'Price and timing', value: 'On request' },
      ],
    },
    sections: [
      {
        heading: 'Which directions do we cover?',
        body: [
          'Two: from China to Afghanistan and from Uzbekistan to Afghanistan. Afghanistan is a new direction for us. In both cases the cargo travels by truck only.',
        ],
        table: {
          caption: 'Two directions to Afghanistan',
          head: ['Direction', 'How the cargo travels'],
          rows: [
            ['China → Afghanistan', 'received in Yiwu; by truck through Kazakhstan, then in transit through Uzbekistan'],
            ['Uzbekistan → Afghanistan', 'by truck, directly (export)'],
          ],
          note: 'In both cases the cargo is delivered to the Hairatan border crossing or to Mazar-i-Sharif. Price and timing on request.',
        },
        callout: {
          title: 'Where does the cargo cross the border?',
          text: 'The cargo crosses the border between Uzbekistan and Afghanistan at the Termez–Hairatan crossing. Termez is the city on the Uzbek side; Hairatan is the border town on the Afghan side.',
          tone: 'info',
        },
      },
      {
        heading: 'A full truck or consolidated cargo?',
        body: [
          'We carry both. The smallest lot is agreed with the manager.',
        ],
        bullets: [
          'A full truck — the whole truck is given to one client’s cargo.',
          'Consolidated cargo — several clients’ cargo travels in one truck; small lots are accepted.',
        ],
      },
      {
        heading: 'Where is the cargo delivered?',
        body: [
          'To one of two points: Hairatan or Mazar-i-Sharif. Today these are the two delivery points. The manager names the exact handover place for your cargo.',
        ],
        bullets: [
          'Hairatan — the border town on the Afghan side: you collect the cargo there yourself.',
          'Mazar-i-Sharif — we deliver the cargo to the city.',
        ],
      },
      {
        heading: 'Which cargo do we carry?',
        body: [
          'Mainly three groups of cargo: consumer goods (clothing, household goods, electronics and similar trade goods), construction and finishing materials, and equipment and spare parts.',
        ],
        callout: {
          title: 'If your cargo is something else',
          text: 'If your cargo is not on this list, tell us what it is: the manager will say whether we take it or not.',
          tone: 'info',
        },
      },
      {
        heading: 'Who handles the documents and customs?',
        body: [
          'We handle the transit documents inside Uzbekistan.',
          'Transit cargo crosses Uzbekistan under customs control. Our part of the work:',
        ],
        bullets: [
          'The transit declaration — our own customs broker files it at customs.',
          'CMR and TIR documents — we prepare and check the international road transport documents.',
          'Security for customs payments (a guarantee) — we help arrange it for transit cargo.',
        ],
        callout: {
          title: 'The Afghan side, and export',
          text: 'On the Afghan side, customs clearance is done by our partners — customs agents (declarants). The manager explains which procedure and which documents apply on the Afghan side for your cargo. For cargo that leaves from Uzbekistan (export), the manager also names the documents you need.',
          tone: 'info',
        },
      },
      {
        heading: 'What else do we do?',
        body: [
          'Besides carriage, we provide four more services: sourcing and buying in China, transshipment and warehouse space in Tashkent, cargo insurance, and help with certificates and permits.',
        ],
        bullets: [
          'Sourcing and buying in China — for Afghan businesspeople too: we find the goods, buy them and deliver them.',
          'Transshipment in Tashkent — truck to truck or through the warehouse. We allocate space in a warehouse under customs control; the warehouse belongs to our partner.',
          'Cargo insurance — for the duration of carriage.',
          'Help obtaining certificates and permits — a certificate of conformity, a phytosanitary certificate and other documents.',
        ],
      },
      {
        heading: 'How do I start?',
        body: [
          'Message us on WhatsApp or Telegram — that is where the work starts. Write to us in Persian or Dari — we answer in Persian with the help of a translator. We also answer in English, Russian and Uzbek.',
        ],
        steps: [
          { title: 'You write to us', text: 'Message us on WhatsApp (+998 90 175 78 00) or Telegram: what the cargo is, its volume or weight, where it is now and where it has to go — Hairatan or Mazar-i-Sharif.' },
          { title: 'We calculate the price and the time', text: 'The manager calculates the price and the time for your cargo and proposes a full truck or consolidated cargo.' },
          { title: 'Contract', text: 'Payment goes through a bank that works between Uzbekistan and Afghanistan, under a contract between you and us.' },
          { title: 'Documents', text: 'We tell you which documents we need from you. We handle the transit documents inside Uzbekistan ourselves.' },
          { title: 'Loading and departure', text: 'In China, cargo for Afghanistan is received in Yiwu; from there it travels by truck through Kazakhstan and Uzbekistan. For cargo that is already in Uzbekistan, the manager tells you where we take it over.' },
          { title: 'On the way', text: 'You follow the cargo through our ERP system, in Telegram.' },
          { title: 'Handover', text: 'You collect the cargo at the border in Hairatan, or we deliver it to Mazar-i-Sharif.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Do you carry cargo to Afghanistan, and how far?',
        a: 'Yes, by truck — to the Hairatan border crossing or to Mazar-i-Sharif. The cargo starts in China (and crosses Uzbekistan in transit) or in Uzbekistan. Today these are the two delivery points.',
      },
      {
        q: 'What does it cost, and how many days does it take?',
        a: 'Price and timing are on request: the manager calculates them for your cargo. For the calculation, tell us what the cargo is, its volume or weight, and from where to where. The tariffs, the calculator and the transit times on this site apply to the China → Tashkent direction only.',
      },
      {
        q: 'Is there a minimum volume?',
        a: 'The smallest lot is agreed with the manager — this page gives no figure. Small lots are accepted in a consolidated truck. The 1 m³ minimum published on this site applies to consolidated cargo from China to Tashkent.',
      },
      {
        q: 'Can you find and buy the goods in China for me?',
        a: 'Yes. Our sourcing and buying service in China is open to Afghan businesspeople too: we find the goods, buy them and deliver them to Hairatan or Mazar-i-Sharif. The manager states the terms before the order.',
      },
      {
        q: 'In which language can I write, and where?',
        a: 'Message us on WhatsApp (+998 90 175 78 00) or Telegram. Write to us in Persian or Dari — we answer in Persian with the help of a translator. We also answer in English, Russian and Uzbek.',
      },
      {
        q: 'Which documents are on your side in Uzbekistan?',
        a: 'The transit documents inside Uzbekistan: our own customs broker files the transit declaration, we prepare and check the CMR and TIR documents, and we help arrange security for customs payments (a guarantee). On the Afghan side, customs clearance is done by our partners — customs agents (declarants).',
      },
      {
        q: 'How do I pay from Afghanistan?',
        a: 'Payment goes through a bank that works between Uzbekistan and Afghanistan, under a contract between you and us.',
      },
      {
        q: 'How can I follow my cargo?',
        a: 'You follow the cargo through our ERP system, in Telegram.',
      },
    ],
    related: ['transit', 'bonded', 'sourcing'],
    guideKeys: ['china-afghanistan', 'uzbekistan-transit'],
    cta: {
      title: 'Tell us about your cargo — we will calculate the price and the time.',
      text: 'Tell us on WhatsApp or Telegram what the cargo is, its volume or weight, and from where to where. The manager calculates the price and the time for your cargo.',
      draft: 'Hello! I have a question about cargo to Afghanistan. Cargo: … Volume or weight: … From: … To: Hairatan / Mazar-i-Sharif',
    },
    updated: '2026-11-13',
  },
};

export default content;
