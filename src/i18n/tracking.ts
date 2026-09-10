import type { Lang } from './config';

/**
 * Strings for the tracking page (/kuzatuv/), the tracking form and the home tracking teaser.
 * Stage keys match `functions/api/track.ts` and the sheet's `stage` column.
 *
 * Rewritten 2026-09-10 around the QR/bot system the owner confirmed that day (scratchpad
 * facts2/TRACKING-SYSTEM.md). The page used to tell the client to ask a manager for the status;
 * the truth is better than that and the copy now says it: a QR goes on every carton at the China
 * receiving point, staff scan it at every stage, and the client watches those scans per carton in
 * @GSR_GROUP_AGENT_bot, 24/7. Two things must never creep back in — telling the client to scan
 * anything (staff scan, they do not), and calling any of it real-time or GPS (it is stage-by-stage
 * scanning). scripts/check-content.mjs fails the build on both.
 *
 * `stages[k].short` is read verbatim by ParcelFlow, TrackingForm and the teaser strip: change the
 * long `text` freely, leave `short` alone.
 *
 * ONE MORE PROMISE THAT MUST NOT CREEP BACK: nothing here may say the status appears on this page.
 * `/api/track` is a Cloudflare Pages Function that is not live (production returns the 404 page),
 * so TrackingForm falls through to `form.fallback` and opens a prepared Telegram message. Every
 * sentence about the form is therefore written to be true in BOTH states — "the answer appears
 * here or comes from your manager" — and stays true on the day the sheet is finally connected.
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
  /** The bot block on the tracking page — the primary way a client watches their cargo. */
  bot: {
    title: string;
    text: string;
    connectTitle: string;
    connect: string[];
    open: string;
    /** The honest limit: stage-by-stage scans, not a live position. */
    note: string;
  };
  stages: Record<StageKey, { name: string; short: string; text: string }>;
  sampleTag: string;
  sampleNote: string;
  glossary: { title: string; intro: string };
  whereCode: { title: string; text: string; items: string[]; note: string };
  faq: { title: string; items: Array<{ q: string; a: string }> };
  teaser: { eyebrow: string; h2: string; text: string; link: string; bot: string };
}

const uz: TrackingStrings = {
  seoTitle: 'Yuk kuzatuvi — har bir qutingiz Telegram botda, 24/7',
  seoDescription:
    'Xitoydagi qabulda har bir qutiga QR kod yopishtiriladi va har bir bosqichda skanerlanadi. @GSR_GROUP_AGENT_bot botida har bir qutingiz qayerdaligini sutkaning istalgan vaqtida koʻrasiz. GS kodi boʻyicha soʻrovni ham shu yerdan yuborasiz.',
  eyebrow: 'Kuzatuv',
  h1: 'Yukingiz hozir qayerda?',
  intro:
    'Har bir qutingizga Xitoydagi qabul punktida QR kod yopishtiriladi, keyingi har bir bosqichda esa ombor xodimlari uni skanerlaydi. Shu skanerlashlarni @GSR_GROUP_AGENT_bot botida, oʻz kabinetingizda, sutkaning istalgan vaqtida koʻrasiz — har bir quti alohida. GS kodingiz boʻyicha soʻrovni quyida yuborishingiz mumkin — javob shu yerda yoki menejerdan Telegramda keladi. Yuk oltita bosqichdan oʻtadi — ular quyida tushuntirilgan.',
  form: {
    label: 'GS kodini kiriting',
    placeholder: 'GS kod',
    hint: 'Kod foto-hisobotda va menejer xabarida koʻrsatilgan.',
    submit: 'Kuzatish',
    checking: 'Tekshirilmoqda…',
    errorEmpty: 'GS kodini kiriting — harflar va raqamlar, kamida 3 ta belgi.',
    result: { code: 'GS kod', stage: 'Bosqich', status: 'Izoh', updated: 'Yangilangan', eta: 'Taxminiy yetib kelish', etaUnknown: 'aniqlashtirilmoqda' },
    notFound: { title: 'Bu kod topilmadi.', text: 'Kodni tekshirib qayta kiriting yoki menejerga Telegramda yozing — ism va qabul sanasi boʻyicha topamiz.' },
    fallback: { title: 'Holatni menejerdan soʻrang', text: 'Bu sahifadagi avtomatik qidiruv hozir ishlamayapti. Xabar tayyor — Telegramda ochib yuboring, menejer joriy holat va foto bilan javob beradi.', open: 'Telegramda soʻrash' },
    noJs: 'Tugma Telegramni ochadi — xabarda GS kodingiz boʻladi.',
  },
  bot: {
    title: 'Botda har bir qutingiz alohida koʻrinadi',
    text: 'Telegram bot GSR tizimidan javob beradi — menejer emas. Shuning uchun u tunda ham, dam olish kunlari ham ishlaydi: kabinetingizda har bir qutingiz qaysi bosqichda ekani turadi.',
    connectTitle: 'Qanday ulanasiz',
    connect: [
      'Telefon raqamingiz bilan: raqam tizimda boʻlsa, bot sizni taniydi.',
      'Yoki menejer yuboradigan ulanish havolasi orqali.',
    ],
    open: 'Botni ochish',
    note: 'Botdagi holat bosqichlar boʻyicha yangilanadi — ombor xodimi QR ni skanerlaganda. Bu mashinaning jonli joylashuvi emas.',
  },
  stages: {
    received: { name: 'Xitoyda qabul qilindi', short: 'Xitoyda qabul', text: 'Yuk Xitoydagi qabul punktiga (Ivu, Guanchjou yoki Qashqar) keldi: suratga olindi, sanaldi, tortildi va oʻlchandi, tizimga kiritildi, har bir qutiga QR kod yopishtirildi. Foto-hisobot Telegramga yuborildi.' },
    consolidation: { name: 'Konsolidatsiya', short: 'Konsolidatsiya', text: 'Yuk boshqa mijozlar yuki bilan bitta fura yoki konteynerga yigʻilmoqda. Yuklashda har bir quti QR boʻyicha skanerlanadi — botda shu bosqich koʻrinadi.' },
    transit: { name: 'Yoʻlda', short: 'Yoʻlda', text: 'Transport Xitoydan chiqdi: Urumchi orqali Xorgosgacha, soʻng Qozogʻiston boʻylab. Avto taxminan 15–25 kun, avia 5–10 kun. Yoʻlda skanerlash boʻlmaydi, shuning uchun bosqich oʻzgarmay turadi.' },
    customs: { name: 'Chegara va bojxona', short: 'Bojxona', text: 'Yuk Xorgos chegarasida yoki Toshkentda bojxona rasmiylashtiruvidan oʻtmoqda: deklaratsiya, boj va QQS hisobi.' },
    tashkent: { name: 'Toshkent omborida', short: 'Toshkentda', text: 'Yuk Toshkentga keldi va tushirishda qaytadan skanerlandi. Menejer xabar beradi: oʻzingiz olib ketasiz yoki viloyatga joʻnatamiz.' },
    delivered: { name: 'Yetkazildi', short: 'Yetkazildi', text: 'Yuk sizga yoki vakilingizga topshirildi. Buyurtma yopildi.' },
  },
  sampleTag: 'Namuna',
  sampleNote: 'Namuna: holat chizigʻi shunday koʻrinadi. Oʻz kodingizni kiriting — javob shu yerda yoki Telegramda keladi.',
  glossary: { title: 'Holatlar nimani anglatadi?', intro: 'Har bir yuk oltita bosqichdan oʻtadi. Quyida ularning maʼnosi — botda va menejer xabarida ham shu soʻzlar ishlatiladi.' },
  whereCode: {
    title: 'GS kodi va qutidagi QR — farqi nima?',
    text: 'GS kodi (markirovka) — sizning shaxsiy belgingiz: shartnomadan keyin beriladi, yetkazib beruvchi uni joʻnatishdan oldin qutilarga yozadi, va Xitoyda qabul qilinganda yuk shu kod boʻyicha sizniki deb aniqlanadi. QR esa qabulda yopishtiriladi va u bitta qutiga tegishli: har bir bosqichda ombor xodimlari aynan shu QR ni skanerlaydi. Siz hech narsani skanerlamaysiz.',
    items: [
      'Foto-hisobot xabarida: menejer yuk qabul qilinganda GS kodni suratlar bilan birga yuboradi.',
      'Yuk yorligʻida: har bir joy ustidagi yorliqda kod va oʻlchamlar koʻrsatilgan.',
      'Shartnoma yoki hisob-fakturada: buyurtma raqami yonida.',
    ],
    note: 'Kodni topa olmasangiz, menejerga ismingiz va yuk qabul qilingan taxminiy sanani yozing — biz topamiz.',
  },
  faq: {
    title: 'Kuzatuv boʻyicha savollar',
    items: [
      { q: 'Botga qanday ulanaman?', a: 'Ikki yoʻl bor: telefon raqamingiz bilan — raqam tizimda boʻlsa, bot sizni taniydi; yoki menejer sizga ulanish havolasini yuboradi. Undan keyin kabinetingizda yuklaringiz koʻrinadi.' },
      { q: 'QR kodni oʻzim skanerlashim kerakmi?', a: 'Yoʻq. QR ni Xitoydagi qabulda biz yopishtiramiz va har bir bosqichda ombor xodimlari skanerlaydi. Sizdan hech narsa talab qilinmaydi — natijani botda koʻrasiz.' },
      { q: 'Bir nechta qutim bor — hammasini koʻra olamanmi?', a: 'Ha. QR har bir qutiga alohida yopishtiriladi, shuning uchun botda ham har bir quti alohida koʻrinadi.' },
      { q: 'Holat qanchalik tez yangilanadi?', a: 'Har bir bosqich oʻtganda: Xitoyda qabul, yuklash, chegaradan oʻtish, Toshkentga kelish. Yoʻlda ekan, bosqich oʻzgarmaydi — bu normal holat, transport 15–25 kun yurishi mumkin. Bot oxirgi skanerlashni koʻrsatadi.' },
      { q: 'Yetib kelish sanasi aniqmi?', a: 'Yoʻq, taxminiy. Muddat yuk Xitoy omboridan joʻnatilgandan keyin hisoblanadi: avto 15–25 kun, avia 5–10 kun, temir yoʻl 20–35 kun. Bayramlar va chegaradagi navbat muddatni uzaytirishi mumkin.' },
      { q: 'Yuk suratini koʻrsam boʻladimi?', a: 'Ha. Xitoyda qabul qilinganda foto-hisobot Telegramga keladi. Yoʻlda qoʻshimcha surat kerak boʻlsa, menejerdan soʻrang.' },
    ],
  },
  teaser: {
    eyebrow: '06 — Kuzatuv',
    h2: 'Yukingiz hozir qayerda?',
    text: 'Botni oching — har bir qutingiz qaysi bosqichda ekanini koʻrasiz. GS kodi boʻyicha soʻrovni shu yerdan ham yuborasiz.',
    link: 'Holatlar nimani anglatadi',
    bot: 'Botni ochish',
  },
};

const ru: TrackingStrings = {
  seoTitle: 'Отслеживание груза — каждая коробка в Telegram-боте, 24/7',
  seoDescription:
    'На приёмке в Китае на каждую коробку наклеивают QR-код, и на каждом этапе его сканируют. В боте @GSR_GROUP_AGENT_bot видно, где сейчас каждая ваша коробка, в любое время суток. Запрос по GS-коду тоже отправляется отсюда.',
  eyebrow: 'Отслеживание',
  h1: 'Где ваш груз сейчас?',
  intro:
    'На каждую вашу коробку в пункте приёма в Китае наклеивают QR-код, а на каждом следующем этапе сотрудники склада его сканируют. Эти сканирования вы видите в боте @GSR_GROUP_AGENT_bot — в своём кабинете, в любое время суток, по каждой коробке отдельно. Запрос по GS-коду можно отправить ниже — ответ придёт здесь же или от менеджера в Telegram. Груз проходит шесть этапов — они объяснены ниже.',
  form: {
    label: 'Введите GS-код',
    placeholder: 'GS-код',
    hint: 'Код есть в фотоотчёте и в сообщении менеджера.',
    submit: 'Отследить',
    checking: 'Проверяем…',
    errorEmpty: 'Введите GS-код — буквы и цифры, не менее 3 символов.',
    result: { code: 'GS-код', stage: 'Этап', status: 'Комментарий', updated: 'Обновлено', eta: 'Ориентировочное прибытие', etaUnknown: 'уточняется' },
    notFound: { title: 'Такой код не найден.', text: 'Проверьте код и введите ещё раз или напишите менеджеру в Telegram — найдём груз по имени и дате приёмки.' },
    fallback: { title: 'Спросите статус у менеджера', text: 'Автоматический поиск на этой странице сейчас недоступен. Сообщение уже готово — откройте его в Telegram, менеджер ответит со статусом и фото.', open: 'Спросить в Telegram' },
    noJs: 'Кнопка откроет Telegram — в сообщении будет ваш GS-код.',
  },
  bot: {
    title: 'В боте видно каждую коробку отдельно',
    text: 'Telegram-бот отвечает из системы GSR, а не менеджер. Поэтому он работает и ночью, и в выходные: в вашем кабинете видно, на каком этапе находится каждая коробка.',
    connectTitle: 'Как подключиться',
    connect: [
      'По номеру телефона: если номер есть в системе, бот вас узнаёт.',
      'Или по ссылке, которую пришлёт менеджер.',
    ],
    open: 'Открыть бота',
    note: 'Статус в боте обновляется по этапам — когда сотрудник склада сканирует QR. Это не живая координата машины.',
  },
  stages: {
    received: { name: 'Принят в Китае', short: 'Приёмка в Китае', text: 'Груз поступил в пункт приёма в Китае (Иу, Гуанчжоу или Кашгар): сфотографирован, пересчитан, взвешен и обмерен, занесён в систему, на каждую коробку наклеен QR-код. Фотоотчёт отправлен в Telegram.' },
    consolidation: { name: 'Консолидация', short: 'Консолидация', text: 'Груз собирается в одну фуру или контейнер вместе с грузами других клиентов. При погрузке каждую коробку сканируют по QR — этот этап и виден в боте.' },
    transit: { name: 'В пути', short: 'В пути', text: 'Транспорт вышел из Китая: через Урумчи до Хоргоса, дальше по Казахстану. Авто — ориентировочно 15–25 дней, авиа — 5–10. В пути сканирований нет, поэтому этап не меняется.' },
    customs: { name: 'Граница и таможня', short: 'Таможня', text: 'Груз проходит границу в Хоргосе или таможенное оформление в Ташкенте: декларация, расчёт пошлины и НДС.' },
    tashkent: { name: 'На складе в Ташкенте', short: 'В Ташкенте', text: 'Груз прибыл в Ташкент и при разгрузке отсканирован заново. Менеджер сообщит: забираете сами или отправляем в регион.' },
    delivered: { name: 'Доставлено', short: 'Доставлено', text: 'Груз передан вам или вашему представителю. Заказ закрыт.' },
  },
  sampleTag: 'Пример',
  sampleNote: 'Пример: так выглядит линия статусов. Введите свой код — ответ придёт здесь же или в Telegram.',
  glossary: { title: 'Что означают статусы?', intro: 'Каждый груз проходит шесть этапов. Ниже — их значение; те же слова использует бот и менеджер в сообщениях.' },
  whereCode: {
    title: 'GS-код и QR на коробке — в чём разница?',
    text: 'GS-код (маркировка) — ваша личная метка: её выдают после договора, поставщик пишет её на коробках до отправки, и при приёмке в Китае груз опознают именно по ней. QR наклеивают уже на приёмке, и он принадлежит одной коробке: именно этот QR сотрудники склада сканируют на каждом этапе. Вам сканировать ничего не нужно.',
    items: [
      'В сообщении с фотоотчётом: менеджер присылает GS-код вместе с фотографиями при приёмке.',
      'На ярлыке груза: на каждом месте указаны код и размеры.',
      'В договоре или счёте: рядом с номером заказа.',
    ],
    note: 'Не нашли код — напишите менеджеру имя и примерную дату приёмки груза, мы найдём.',
  },
  faq: {
    title: 'Вопросы об отслеживании',
    items: [
      { q: 'Как подключиться к боту?', a: 'Два способа: своим номером телефона — если номер есть в системе, бот вас узнаёт; или по ссылке, которую пришлёт менеджер. После этого в кабинете видны ваши грузы.' },
      { q: 'Нужно ли мне самому сканировать QR?', a: 'Нет. QR наклеиваем мы на приёмке в Китае, а сканируют его сотрудники склада на каждом этапе. От вас не требуется ничего — результат вы видите в боте.' },
      { q: 'У меня несколько коробок — увижу все?', a: 'Да. QR наклеивают на каждую коробку отдельно, поэтому и в боте каждая коробка видна отдельно.' },
      { q: 'Как часто обновляется статус?', a: 'При смене этапа: приёмка в Китае, погрузка, прохождение границы, прибытие в Ташкент. Пока груз в пути, этап не меняется — это нормально, транспорт может ехать 15–25 дней. Бот показывает последнее сканирование.' },
      { q: 'Дата прибытия точная?', a: 'Нет, ориентировочная. Срок считается после отправки со склада в Китае: авто 15–25 дней, авиа 5–10, ж/д 20–35. Праздники и очереди на границе могут его увеличить.' },
      { q: 'Можно увидеть фото груза?', a: 'Да. При приёмке в Китае фотоотчёт приходит в Telegram. Если нужны дополнительные фото в пути — попросите менеджера.' },
    ],
  },
  teaser: {
    eyebrow: '06 — Отслеживание',
    h2: 'Где ваш груз сейчас?',
    text: 'Откройте бота — видно, на каком этапе каждая ваша коробка. Запрос по GS-коду можно отправить отсюда.',
    link: 'Что означают статусы',
    bot: 'Открыть бота',
  },
};

const en: TrackingStrings = {
  seoTitle: 'Cargo tracking — every carton in our Telegram bot, 24/7',
  seoDescription:
    'A QR code goes on every carton at receiving in China and is scanned at every stage. See where each of your cartons is in @GSR_GROUP_AGENT_bot at any hour, or send a GS-code request from this page.',
  eyebrow: 'Tracking',
  h1: 'Where is your cargo right now?',
  intro:
    'Every one of your cartons gets a QR code at the receiving point in China, and at each stage after that our warehouse staff scan it. You watch those scans in @GSR_GROUP_AGENT_bot — in your own account, at any hour, carton by carton. You can also send a GS-code request below — the answer appears here or comes from your manager on Telegram. Every shipment passes through six stages, explained below.',
  form: {
    label: 'Enter your GS code',
    placeholder: 'GS code',
    hint: 'The code is in the photo report and in your manager’s message.',
    submit: 'Track',
    checking: 'Checking…',
    errorEmpty: 'Enter a GS code — letters and digits, at least 3 characters.',
    result: { code: 'GS code', stage: 'Stage', status: 'Note', updated: 'Updated', eta: 'Estimated arrival', etaUnknown: 'to be confirmed' },
    notFound: { title: 'That code was not found.', text: 'Check the code and try again, or message a manager on Telegram — we can find the shipment by your name and receiving date.' },
    fallback: { title: 'Ask your manager for the status', text: 'The automatic lookup on this page is unavailable right now. Your message is ready — open it in Telegram and your manager replies with the status and a photo.', open: 'Ask on Telegram' },
    noJs: 'The button opens Telegram with your GS code in the message.',
  },
  bot: {
    title: 'The bot shows every carton on its own line',
    text: 'The Telegram bot answers from the GSR system, not a manager. That is why it works at night and at weekends: your account shows which stage each carton is at.',
    connectTitle: 'How to connect',
    connect: [
      'With your phone number: if it is in the system, the bot recognises you.',
      'Or through a link your manager sends you.',
    ],
    open: 'Open the bot',
    note: 'The status in the bot moves stage by stage — when a warehouse worker scans the QR. It is not a live vehicle position.',
  },
  stages: {
    received: { name: 'Received in China', short: 'Received in China', text: 'The cargo arrived at the receiving point in China (Yiwu, Guangzhou or Kashgar): photographed, counted, weighed and measured, entered into the system, and a QR code stuck on every carton. The photo report was sent on Telegram.' },
    consolidation: { name: 'Consolidation', short: 'Consolidation', text: 'The cargo is being grouped with other clients’ goods into one truck or container. Every carton is scanned by its QR as it is loaded — that is the stage the bot shows.' },
    transit: { name: 'In transit', short: 'In transit', text: 'The vehicle has left China: via Urumqi to Khorgos, then across Kazakhstan. Truck roughly 15–25 days, air 5–10. There is nothing to scan on the road, so the stage stays put.' },
    customs: { name: 'Border and customs', short: 'Customs', text: 'The cargo is crossing the Khorgos border or clearing customs in Tashkent: declaration, duty and VAT calculation.' },
    tashkent: { name: 'At the Tashkent warehouse', short: 'In Tashkent', text: 'The cargo reached Tashkent and was scanned again as it was unloaded. Your manager lets you know: collect it yourself or we forward it to your region.' },
    delivered: { name: 'Delivered', short: 'Delivered', text: 'The cargo was handed to you or your representative. The order is closed.' },
  },
  sampleTag: 'Sample',
  sampleNote: 'Sample: this is what the status line looks like. Enter your own code — the answer appears here or arrives on Telegram.',
  glossary: { title: 'What do the statuses mean?', intro: 'Every shipment passes through six stages. Their meaning is below — the bot and your manager use the same words.' },
  whereCode: {
    title: 'The GS code and the QR on the carton — what is the difference?',
    text: 'The GS code (shipping mark) is your personal mark: it is issued after the contract, your supplier writes it on the cartons before dispatch, and at receiving in China your goods are identified by it. The QR is stuck on at receiving and belongs to one single carton: it is that QR our warehouse staff scan at every stage. There is nothing for you to scan.',
    items: [
      'In the photo-report message: your manager sends the GS code together with the photos at receiving.',
      'On the cargo tag: every piece carries the code and its dimensions.',
      'In the contract or invoice: next to the order number.',
    ],
    note: 'Cannot find the code? Send your manager your name and the approximate receiving date — we will find it.',
  },
  faq: {
    title: 'Tracking questions',
    items: [
      { q: 'How do I connect to the bot?', a: 'Two ways: with your own phone number — if it is in the system, the bot recognises you; or through a link your manager sends you. After that your shipments are in your account.' },
      { q: 'Do I have to scan the QR myself?', a: 'No. We stick the QR on at receiving in China and our warehouse staff scan it at every stage. Nothing is asked of you — you simply see the result in the bot.' },
      { q: 'I have several cartons — will I see them all?', a: 'Yes. A QR goes on each carton separately, so each carton also appears separately in the bot.' },
      { q: 'How often is the status updated?', a: 'Whenever a stage changes: receiving in China, loading, border crossing, arrival in Tashkent. While the cargo is in transit the stage stays the same — that is normal, a truck can take 15–25 days. The bot shows the last scan.' },
      { q: 'Is the arrival date exact?', a: 'No, it is an estimate. Transit counts from departure from the China warehouse: truck 15–25 days, air 5–10, rail 20–35. Holidays and border queues can add days.' },
      { q: 'Can I see photos of my cargo?', a: 'Yes. A photo report arrives on Telegram when the cargo is received in China. If you need extra photos on the way, ask your manager.' },
    ],
  },
  teaser: {
    eyebrow: '06 — Tracking',
    h2: 'Where is your cargo right now?',
    text: 'Open the bot — you see which stage each of your cartons is at. Or send a GS-code request from here.',
    link: 'What the statuses mean',
    bot: 'Open the bot',
  },
};

export const tracking: Record<Lang, TrackingStrings> = { uz, ru, en };
