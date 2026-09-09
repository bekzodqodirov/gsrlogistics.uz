import type { Lang } from './config';

/**
 * Strings for the tracking page (/kuzatuv/), the tracking form and the home tracking teaser.
 * Stage keys match `functions/api/track.ts` and the sheet's `stage` column.
 */
export type StageKey = 'received' | 'consolidation' | 'transit' | 'customs' | 'tashkent' | 'delivered';
export const STAGE_KEYS: StageKey[] = ['received', 'consolidation', 'transit', 'customs', 'tashkent', 'delivered'];

export interface TrackingStrings {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  h1: string;
  /** ≤70-word answer paragraph. */
  intro: string;
  form: {
    label: string;
    placeholder: string;
    hint: string;
    submit: string;
    checking: string;
    errorEmpty: string;
    /** Result panel labels. */
    result: { code: string; stage: string; status: string; updated: string; eta: string; etaUnknown: string };
    notFound: { title: string; text: string };
    fallback: { title: string; text: string; open: string };
    noJs: string;
  };
  stages: Record<StageKey, { name: string; short: string; text: string }>;
  sampleTag: string;
  sampleNote: string;
  glossary: { title: string; intro: string };
  whereCode: { title: string; text: string; items: string[]; note: string };
  faq: { title: string; items: Array<{ q: string; a: string }> };
  teaser: { eyebrow: string; h2: string; text: string; link: string };
}

const uz: TrackingStrings = {
  seoTitle: 'Yuk kuzatuvi — Xitoydan kelayotgan yukingiz hozir qayerda?',
  seoDescription: 'GSR Logistics GS kodini kiriting — yukingizning joriy holatini bilib oling: Xitoydagi qabul punktida, yoʻlda, bojxonada yoki Toshkent omborida. Holatlar lugʻati va kod qayerdaligi haqida.',
  eyebrow: 'Kuzatuv',
  h1: 'Yukingiz hozir qayerda?',
  intro: 'GS kodini kiriting — xabar tayyor boʻladi, menejer Telegramda joriy bosqich va foto bilan javob beradi. Yuk oltita bosqichdan oʻtadi: Xitoyda qabul, konsolidatsiya, yoʻlda, Xorgos chegarasi va bojxona, Toshkent ombori, yetkazildi — ular quyida tushuntirilgan. GS kodi (markirovka) shartnomadan keyin beriladi: yetkazib beruvchi uni joʻnatishdan oldin qutilarga yozadi, u qabuldagi foto-hisobotda ham koʻrsatiladi. Avtomatik qidiruv ulangach, holat shu sahifada koʻrinadi.',
  form: {
    label: 'GS kodini kiriting',
    placeholder: 'GS kod',
    hint: 'Kod foto-hisobotda va menejer xabarida koʻrsatilgan.',
    submit: 'Kuzatish',
    checking: 'Tekshirilmoqda…',
    errorEmpty: 'GS kodini kiriting — harflar va raqamlar, kamida 3 ta belgi.',
    result: { code: 'GS kod', stage: 'Bosqich', status: 'Izoh', updated: 'Yangilangan', eta: 'Taxminiy yetib kelish', etaUnknown: 'aniqlashtirilmoqda' },
    notFound: { title: 'Bu kod topilmadi.', text: 'Kodni tekshirib qayta kiriting yoki menejerga Telegramda yozing — ism va qabul sanasi boʻyicha topamiz.' },
    fallback: { title: 'Holatni menejerdan soʻrang', text: 'Avtomatik kuzatuv hozir ishlamayapti. Xabar tayyor — Telegramda ochib yuboring, menejer joriy holat va foto bilan javob beradi.', open: 'Telegramda soʻrash' },
    noJs: 'Tugma Telegramni ochadi — xabarda GS kodingiz boʻladi.',
  },
  stages: {
    received: { name: 'Xitoyda qabul qilindi', short: 'Xitoyda qabul', text: 'Yuk Xitoydagi qabul punktiga (Ivu, Guanchjou yoki Qashqar) keldi: tortildi, oʻlchandi, raqamlandi. Foto-hisobot Telegramga yuborildi.' },
    consolidation: { name: 'Konsolidatsiya', short: 'Konsolidatsiya', text: 'Yuk boshqa mijozlar yuki bilan bitta fura yoki konteynerga yigʻilmoqda. Qadoqlash va yuklash roʻyxati shu bosqichda.' },
    transit: { name: 'Yoʻlda', short: 'Yoʻlda', text: 'Transport Xitoydan chiqdi: Urumchi orqali Xorgosgacha, soʻng Qozogʻiston boʻylab. Avto taxminan 15–25 kun, avia 5–10 kun.' },
    customs: { name: 'Chegara va bojxona', short: 'Bojxona', text: 'Yuk Xorgos chegarasida yoki Toshkentda bojxona rasmiylashtiruvidan oʻtmoqda: deklaratsiya, boj va QQS hisobi.' },
    tashkent: { name: 'Toshkent omborida', short: 'Toshkentda', text: 'Yuk Toshkentga keldi. Menejer xabar beradi: oʻzingiz olib ketasiz yoki viloyatga joʻnatamiz.' },
    delivered: { name: 'Yetkazildi', short: 'Yetkazildi', text: 'Yuk sizga yoki vakilingizga topshirildi. Buyurtma yopildi.' },
  },
  sampleTag: 'Namuna',
  sampleNote: 'Namuna: holat chizigʻi shunday koʻrinadi. Oʻz kodingizni kiriting — joriy bosqich shu yerda belgilanadi.',
  glossary: { title: 'Holatlar nimani anglatadi?', intro: 'Har bir yuk oltita bosqichdan oʻtadi. Quyida ularning maʼnosi — menejer xabarida ham shu soʻzlar ishlatiladi.' },
  whereCode: {
    title: 'GS kodi qayerda?',
    text: 'GS kodi (markirovka) — shartnomadan keyin sizga beriladigan shaxsiy belgi. Yetkazib beruvchi uni yukni joʻnatishdan oldin har bir qutiga yozadi — Xitoyda qabul qilinganda yuk shu kod boʻyicha sizniki deb aniqlanadi. Kod har bir joy ustidagi yorliqda va menejer Telegramga yuboradigan foto-hisobotda ham koʻrsatiladi.',
    items: [
      'Foto-hisobot xabarida: menejer yuk qabul qilinganda kodni suratlar bilan birga yuboradi.',
      'Yuk yorligʻida: har bir joy ustidagi yorliqda kod va oʻlchamlar koʻrsatilgan.',
      'Shartnoma yoki hisob-fakturada: buyurtma raqami yonida.',
    ],
    note: 'Kodni topa olmasangiz, menejerga ismingiz va yuk qabul qilingan taxminiy sanani yozing — biz topamiz.',
  },
  faq: {
    title: 'Kuzatuv boʻyicha savollar',
    items: [
      { q: 'Holat qanchalik tez yangilanadi?', a: 'Har bir bosqich oʻtganda: Xitoyda qabul, yuklash, chegaradan oʻtish, Toshkentga kelish. Yoʻlda ekan, bosqich oʻzgarmaydi — bu normal holat, transport 15–25 kun yurishi mumkin.' },
      { q: 'Kod topilmasa nima qilish kerak?', a: 'Kodni harf va raqamlarigacha tekshiring. Baribir topilmasa, menejerga Telegramda yozing — ism va qabul sanasi boʻyicha yukni topamiz.' },
      { q: 'Yetib kelish sanasi aniqmi?', a: 'Yoʻq, taxminiy. Muddat yuk Xitoy omboridan joʻnatilgandan keyin hisoblanadi: avto 15–25 kun, avia 5–10 kun, temir yoʻl 20–35 kun. Bayramlar va chegaradagi navbat muddatni uzaytirishi mumkin.' },
      { q: 'Yuk suratini koʻrsam boʻladimi?', a: 'Ha. Xitoyda qabul qilinganda foto-hisobot Telegramga keladi. Yoʻlda qoʻshimcha surat kerak boʻlsa, menejerdan soʻrang.' },
    ],
  },
  teaser: {
    eyebrow: '06 — Kuzatuv',
    h2: 'Yukingiz hozir qayerda?',
    text: 'Menejer Telegramda joriy holat va foto bilan javob beradi.',
    link: 'Holatlar nimani anglatadi',
  },
};

const ru: TrackingStrings = {
  seoTitle: 'Отслеживание груза — где сейчас ваш груз из Китая?',
  seoDescription: 'Введите GS-код GSR Logistics и узнайте текущий статус: в пункте приёма в Китае, в пути, на таможне или на складе в Ташкенте. Словарь статусов и где найти код.',
  eyebrow: 'Отслеживание',
  h1: 'Где ваш груз сейчас?',
  intro: 'Введите GS-код — сообщение будет готово, и менеджер ответит в Telegram с текущим этапом и фото. Груз проходит шесть этапов: приёмка в Китае, консолидация, в пути, граница Хоргос и таможня, склад в Ташкенте, доставлено — их значение объяснено ниже. GS-код (маркировка) выдаётся после договора: поставщик пишет его на коробках до отправки, и он же указан в фотоотчёте при приёмке. Когда подключим автоматический поиск, статус будет показываться прямо на этой странице.',
  form: {
    label: 'Введите GS-код',
    placeholder: 'GS-код',
    hint: 'Код есть в фотоотчёте и в сообщении менеджера.',
    submit: 'Отследить',
    checking: 'Проверяем…',
    errorEmpty: 'Введите GS-код — буквы и цифры, не менее 3 символов.',
    result: { code: 'GS-код', stage: 'Этап', status: 'Комментарий', updated: 'Обновлено', eta: 'Ориентировочное прибытие', etaUnknown: 'уточняется' },
    notFound: { title: 'Такой код не найден.', text: 'Проверьте код и введите ещё раз или напишите менеджеру в Telegram — найдём груз по имени и дате приёмки.' },
    fallback: { title: 'Спросите статус у менеджера', text: 'Автоматическое отслеживание сейчас недоступно. Сообщение уже готово — откройте его в Telegram, менеджер ответит со статусом и фото.', open: 'Спросить в Telegram' },
    noJs: 'Кнопка откроет Telegram — в сообщении будет ваш GS-код.',
  },
  stages: {
    received: { name: 'Принят в Китае', short: 'Приёмка в Китае', text: 'Груз поступил в пункт приёма в Китае (Иу, Гуанчжоу или Кашгар): взвешен, обмерен, пронумерован. Фотоотчёт отправлен в Telegram.' },
    consolidation: { name: 'Консолидация', short: 'Консолидация', text: 'Груз собирается в одну фуру или контейнер вместе с грузами других клиентов. На этом этапе — упаковка и погрузочный лист.' },
    transit: { name: 'В пути', short: 'В пути', text: 'Транспорт вышел из Китая: через Урумчи до Хоргоса, дальше по Казахстану. Авто — ориентировочно 15–25 дней, авиа — 5–10.' },
    customs: { name: 'Граница и таможня', short: 'Таможня', text: 'Груз проходит границу в Хоргосе или таможенное оформление в Ташкенте: декларация, расчёт пошлины и НДС.' },
    tashkent: { name: 'На складе в Ташкенте', short: 'В Ташкенте', text: 'Груз прибыл в Ташкент. Менеджер сообщит: забираете сами или отправляем в регион.' },
    delivered: { name: 'Доставлено', short: 'Доставлено', text: 'Груз передан вам или вашему представителю. Заказ закрыт.' },
  },
  sampleTag: 'Пример',
  sampleNote: 'Пример: так выглядит линия статусов. Введите свой код — текущий этап будет отмечен здесь.',
  glossary: { title: 'Что означают статусы?', intro: 'Каждый груз проходит шесть этапов. Ниже — их значение; те же слова менеджер использует в сообщениях.' },
  whereCode: {
    title: 'Где найти GS-код?',
    text: 'GS-код (маркировка) — ваша личная метка, которую вы получаете после договора. Поставщик пишет его на каждой коробке до отправки — при приёмке в Китае груз опознают именно по этому коду. Код указан на ярлыке каждого места и в фотоотчёте, который менеджер отправляет в Telegram.',
    items: [
      'В сообщении с фотоотчётом: менеджер присылает код вместе с фотографиями при приёмке.',
      'На ярлыке груза: на каждом месте указаны код и размеры.',
      'В договоре или счёте: рядом с номером заказа.',
    ],
    note: 'Не нашли код — напишите менеджеру имя и примерную дату приёмки груза, мы найдём.',
  },
  faq: {
    title: 'Вопросы об отслеживании',
    items: [
      { q: 'Как часто обновляется статус?', a: 'При смене этапа: приёмка в Китае, погрузка, прохождение границы, прибытие в Ташкент. Пока груз в пути, этап не меняется — это нормально, транспорт может ехать 15–25 дней.' },
      { q: 'Что делать, если код не найден?', a: 'Проверьте код до последней буквы и цифры. Если всё равно не находится, напишите менеджеру в Telegram — найдём груз по имени и дате приёмки.' },
      { q: 'Дата прибытия точная?', a: 'Нет, ориентировочная. Срок считается после отправки со склада в Китае: авто 15–25 дней, авиа 5–10, ж/д 20–35. Праздники и очереди на границе могут его увеличить.' },
      { q: 'Можно увидеть фото груза?', a: 'Да. При приёмке в Китае фотоотчёт приходит в Telegram. Если нужны дополнительные фото в пути — попросите менеджера.' },
    ],
  },
  teaser: {
    eyebrow: '06 — Отслеживание',
    h2: 'Где ваш груз сейчас?',
    text: 'Менеджер ответит в Telegram с текущим статусом и фото.',
    link: 'Что означают статусы',
  },
};

const en: TrackingStrings = {
  seoTitle: 'Cargo tracking — where is your shipment from China right now?',
  seoDescription: 'Enter your GSR Logistics GS code to see the current status: at the receiving point in China, in transit, at customs or at the Tashkent warehouse. Status glossary and where to find your code.',
  eyebrow: 'Tracking',
  h1: 'Where is your cargo right now?',
  intro: 'Enter your GS code — the message is prepared for you, and your manager replies on Telegram with the current stage and a photo. Every shipment passes through six stages: received in China, consolidation, in transit, Khorgos border and customs, Tashkent warehouse, delivered — each is explained below. Your GS code (shipping mark) is issued after the contract: your supplier marks every carton with it before dispatch, and it appears again in the photo report sent at receiving. Once automatic lookup is connected, the status will appear right on this page.',
  form: {
    label: 'Enter your GS code',
    placeholder: 'GS code',
    hint: 'The code is in the photo report and in your manager’s message.',
    submit: 'Track',
    checking: 'Checking…',
    errorEmpty: 'Enter a GS code — letters and digits, at least 3 characters.',
    result: { code: 'GS code', stage: 'Stage', status: 'Note', updated: 'Updated', eta: 'Estimated arrival', etaUnknown: 'to be confirmed' },
    notFound: { title: 'That code was not found.', text: 'Check the code and try again, or message a manager on Telegram — we can find the shipment by your name and receiving date.' },
    fallback: { title: 'Ask your manager for the status', text: 'Automatic tracking is unavailable right now. Your message is ready — open it in Telegram and your manager replies with the status and a photo.', open: 'Ask on Telegram' },
    noJs: 'The button opens Telegram with your GS code in the message.',
  },
  stages: {
    received: { name: 'Received in China', short: 'Received in China', text: 'The cargo arrived at the receiving point in China (Yiwu, Guangzhou or Kashgar): weighed, measured and numbered. The photo report was sent on Telegram.' },
    consolidation: { name: 'Consolidation', short: 'Consolidation', text: 'The cargo is being grouped with other clients’ goods into one truck or container. Packing and the loading list happen here.' },
    transit: { name: 'In transit', short: 'In transit', text: 'The vehicle has left China: via Urumqi to Khorgos, then across Kazakhstan. Truck roughly 15–25 days, air 5–10.' },
    customs: { name: 'Border and customs', short: 'Customs', text: 'The cargo is crossing the Khorgos border or clearing customs in Tashkent: declaration, duty and VAT calculation.' },
    tashkent: { name: 'At the Tashkent warehouse', short: 'In Tashkent', text: 'The cargo has arrived in Tashkent. Your manager lets you know: collect it yourself or we forward it to your region.' },
    delivered: { name: 'Delivered', short: 'Delivered', text: 'The cargo was handed to you or your representative. The order is closed.' },
  },
  sampleTag: 'Sample',
  sampleNote: 'Sample: this is what the status line looks like. Enter your own code and the current stage is marked here.',
  glossary: { title: 'What do the statuses mean?', intro: 'Every shipment passes through six stages. Their meaning is below — your manager uses the same words in messages.' },
  whereCode: {
    title: 'Where is my GS code?',
    text: 'The GS code (shipping mark) is your personal mark, issued after the contract. Your supplier writes it on every carton before dispatch, and at receiving in China your goods are identified by it. It also appears on the tag of every piece and in the photo report your manager sends on Telegram.',
    items: [
      'In the photo-report message: your manager sends the code together with the photos at receiving.',
      'On the cargo tag: every piece carries the code and its dimensions.',
      'In the contract or invoice: next to the order number.',
    ],
    note: 'Cannot find the code? Send your manager your name and the approximate receiving date — we will find it.',
  },
  faq: {
    title: 'Tracking questions',
    items: [
      { q: 'How often is the status updated?', a: 'Whenever a stage changes: receiving in China, loading, border crossing, arrival in Tashkent. While the cargo is in transit the stage stays the same — that is normal, a truck can take 15–25 days.' },
      { q: 'What if the code is not found?', a: 'Check every letter and digit. If it still does not come up, message a manager on Telegram — we find the shipment by your name and receiving date.' },
      { q: 'Is the arrival date exact?', a: 'No, it is an estimate. Transit counts from departure from the China warehouse: truck 15–25 days, air 5–10, rail 20–35. Holidays and border queues can add days.' },
      { q: 'Can I see photos of my cargo?', a: 'Yes. A photo report arrives on Telegram when the cargo is received in China. If you need extra photos on the way, ask your manager.' },
    ],
  },
  teaser: {
    eyebrow: '06 — Tracking',
    h2: 'Where is your cargo right now?',
    text: 'Your manager replies on Telegram with the current status and a photo.',
    link: 'What the statuses mean',
  },
};

export const tracking: Record<Lang, TrackingStrings> = { uz, ru, en };
