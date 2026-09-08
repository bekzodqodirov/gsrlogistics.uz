import type { Lang } from './config';

export interface AboutStrings {
  seoTitle: string; seoDescription: string;
  eyebrow: string; h1: string; intro: string;
  story: { heading: string; paragraphs: string[] };
  how: { heading: string; items: Array<{ title: string; text: string }> };
  places: { heading: string; yiwu: { title: string; text: string }; tashkent: { title: string; text: string; directions: string } };
  team: { heading: string; text: string; roles: Array<{ title: string; text: string }> };
  facts: Array<{ value: string; label: string }>;
  honesty: { heading: string; text: string };
  cta: { title: string; text: string };
}

const uz: AboutStrings = {
  seoTitle: 'Biz haqimizda — GSR Logistics, Xitoydan Oʻzbekistonga yuk tashish, 2018-yildan',
  seoDescription: 'GSR Logistics — Toshkentdagi logistika kompaniyasi: Ivu omboridan Xorgos orqali Toshkentgacha yigʻma yuk, avia va temir yoʻl kargo, tovar topish va sotib olish, bojxona rasmiylashtiruvi. Menejerlar oʻzbek, rus va xitoy tillarida. 2018-yildan beri.',
  eyebrow: 'Biz haqimizda',
  h1: 'Xitoyda oʻz odamingiz bor.',
  intro: 'GSR Logistics — Toshkentdagi logistika kompaniyasi. 2018-yildan beri Xitoy bilan ishlaymiz: Ivu omboridan Xorgos orqali Toshkentgacha yigʻma yuk taxminan 15–25 kunda, avia 5–10 kunda keladi. Tovarni topamiz, sotib olamiz, tekshiramiz, bojxonadan oʻtkazamiz — bitta shartnoma, bitta menejer.',
  story: {
    heading: 'Qanday boshlangan?',
    paragraphs: [
      '2018-yilda Xitoydan uskunalar va tovar keltirish bilan boshladik: ishlab chiqaruvchini topish, muzokara, namuna, yetkazib berish. Tez orada mijozlar bitta narsani soʻray boshladi — «butun konteyner emas, oʻz joyim uchun toʻlasam boʻladimi?». 2022-yildan yigʻma yuk xizmati asosiy yoʻnalishimizga aylandi.',
      'Bugun biz Ivu (义乌) shahridagi omborda yukni qabul qilamiz, tortamiz va oʻlchaymiz, foto-hisobot yuboramiz, bir nechta yetkazib beruvchidan kelgan partiyalarni bitta joyga yigʻamiz va Xorgos orqali Toshkentga joʻnatamiz. Toshkentda bojxona rasmiylashtiruvini oʻtkazamiz va yukni topshiramiz yoki viloyatga joʻnatamiz.',
      'Biz katta reklama vaʼdalari bermaymiz. Buning oʻrniga saytda narx qoidasi, muddatlar, manzil va jarayon ochiq yozilgan — tekshirishingiz mumkin.',
    ],
  },
  how: {
    heading: 'Qanday ishlaymiz?',
    items: [
      { title: 'Halollik', text: 'Narx, muddat va javobgarlik shartnomada. Yashirin toʻlovlar yoʻq: hajmiy vazn formulasi va zichlik qoidasi saytda ochiq.' },
      { title: 'Ochiqlik', text: 'Har qabulda foto-hisobot, yoʻlda menejer xabari, Toshkentda yuk kodi boʻyicha holat. Savolingizga «keyin» emas, hozir javob beramiz.' },
      { title: 'Sifat', text: 'Yukni Xitoyning oʻzida tekshiramiz: soni, holati, qadoqlash. Shikastlangan yoki notoʻgʻri tovar Toshkentga yetib kelmasdan oldin hal boʻladi.' },
      { title: 'Til toʻsigʻi yoʻq', text: 'Menejerlarimiz oʻzbek, rus va xitoy tillarida gaplashadi. Yetkazib beruvchi bilan muzokarani biz olib boramiz.' },
    ],
  },
  places: {
    heading: 'Qayerdamiz?',
    yiwu: { title: 'Ivu (义乌), Xitoy — ombor', text: 'Dunyodagi eng katta mayda ulgurji bozor shahri. Bu yerda yukni qabul qilamiz, konsolidatsiya qilamiz va joʻnatamiz. Guanchjou, Shenchjen va boshqa shaharlardan hamkorlar orqali qabul qilamiz. Ombor manzili va mijoz kodini menejer beradi.' },
    tashkent: { title: 'Toshkent — ofis', text: 'Shayxontohur tumani, Alisher Navoiy koʻchasi, 27. Shartnoma, hujjatlar, toʻlov va maslahat shu yerda.', directions: 'Alisher Navoiy metro bekati yonida. Kelib koʻrishingiz mumkin — oldindan Telegramda yozing.' },
  },
  team: {
    heading: 'Kim bilan ishlaysiz?',
    text: 'Kichik, lekin toʻliq jamoa: har mijozga bitta menejer biriktiriladi va u yukni boshidan oxirigacha kuzatib boradi.',
    roles: [
      { title: 'Toshkent menejerlari', text: 'Soʻrov, hisob-kitob, shartnoma, yuk holati boʻyicha xabar — Telegram va telefon orqali.' },
      { title: 'Xitoydagi xodimlar', text: 'Ivu omborida qabul, tortish, tekshiruv, foto-hisobot, qadoqlash va yuklash.' },
      { title: 'Bojxona mutaxassisi', text: 'TN VED kodi, deklaratsiya, boj va QQS hisobi, hujjatlar bilan ishlash.' },
    ],
  },
  facts: [
    { value: '2018', label: 'yildan beri Xitoy bilan ishlaymiz' },
    { value: '3', label: 'til: oʻzbek, rus, xitoy' },
    { value: '15–25', label: 'kun — yigʻma yuk, taxminan' },
    { value: '1', label: 'ombor Ivuda, 1 ofis Toshkentda' },
  ],
  honesty: { heading: 'Nimani vaʼda qilmaymiz?', text: '«Bojsiz», «100% kafolat», «eng tez» degan gaplarni aytmaymiz. Boj va QQS qonun boʻyicha toʻlanadi — biz uni oldindan hisoblab beramiz. Muddatlar taxminiy: chegara navbatlari, Xitoy bayramlari va ob-havo taʼsir qiladi. Shuning uchun har raqam yonida «taxminan» yozamiz.' },
  cta: { title: 'Tanishib olaylik.', text: 'Yukingiz, shahringiz va muddatni yozing — yoʻnalish va narxni taklif qilamiz.' },
};

const ru: AboutStrings = {
  seoTitle: 'О компании — GSR Logistics, доставка грузов из Китая в Узбекистан с 2018 года',
  seoDescription: 'GSR Logistics — логистическая компания в Ташкенте: сборный груз со склада в Иу через Хоргос до Ташкента, авиа и ж/д карго, поиск и выкуп товаров, таможенное оформление. Менеджеры говорят по-узбекски, по-русски и по-китайски. С 2018 года.',
  eyebrow: 'О компании',
  h1: 'Свой человек в Китае.',
  intro: 'GSR Logistics — логистическая компания в Ташкенте. Работаем с Китаем с 2018 года: сборный груз со склада в Иу через Хоргос приходит в Ташкент ориентировочно за 15–25 дней, авиа — за 5–10. Находим товар, выкупаем, проверяем, растамаживаем — один договор, один менеджер.',
  story: {
    heading: 'С чего всё началось?',
    paragraphs: [
      'В 2018 году мы начинали с поставок оборудования и товаров из Китая: поиск производителя, переговоры, образцы, доставка. Довольно скоро клиенты стали спрашивать одно и то же: «А можно платить не за целый контейнер, а только за своё место?». С 2022 года сборный груз стал нашим основным направлением.',
      'Сегодня мы принимаем груз на складе в Иу (义乌), взвешиваем и обмеряем его, отправляем фотоотчёт, собираем партии от нескольких поставщиков в одном месте и отправляем через Хоргос в Ташкент. В Ташкенте оформляем таможню и выдаём груз или отправляем его в регион.',
      'Мы не даём громких рекламных обещаний. Вместо этого на сайте открыто написаны правило расчёта цены, сроки, адрес и процесс — всё можно проверить.',
    ],
  },
  how: {
    heading: 'Как мы работаем?',
    items: [
      { title: 'Честность', text: 'Цена, сроки и ответственность — в договоре. Без скрытых платежей: формула объёмного веса и правило плотности опубликованы на сайте.' },
      { title: 'Открытость', text: 'Фотоотчёт при каждой приёмке, сообщения менеджера в пути, статус по коду груза в Ташкенте. На вопросы отвечаем сейчас, а не «потом».' },
      { title: 'Качество', text: 'Проверяем груз ещё в Китае: количество, состояние, упаковку. Повреждённый или не тот товар решается до отправки в Ташкент.' },
      { title: 'Без языкового барьера', text: 'Наши менеджеры говорят по-узбекски, по-русски и по-китайски. Переговоры с поставщиком ведём мы.' },
    ],
  },
  places: {
    heading: 'Где мы?',
    yiwu: { title: 'Иу (义乌), Китай — склад', text: 'Крупнейший в мире город мелкооптовой торговли. Здесь мы принимаем, консолидируем и отправляем груз. Из Гуанчжоу, Шэньчжэня и других городов принимаем через партнёров. Адрес склада и код клиента выдаёт менеджер.' },
    tashkent: { title: 'Ташкент — офис', text: 'Шайхантахурский район, ул. Алишера Навои, 27. Договор, документы, оплата и консультации — здесь.', directions: 'Рядом со станцией метро «Алишер Навои». Можно приехать — напишите заранее в Telegram.' },
  },
  team: {
    heading: 'С кем вы работаете?',
    text: 'Небольшая, но полная команда: за каждым клиентом закреплён один менеджер, который ведёт груз от начала до конца.',
    roles: [
      { title: 'Менеджеры в Ташкенте', text: 'Запрос, расчёт, договор, сообщения о статусе груза — в Telegram и по телефону.' },
      { title: 'Сотрудники в Китае', text: 'Приёмка на складе в Иу, взвешивание, проверка, фотоотчёт, упаковка и погрузка.' },
      { title: 'Специалист по таможне', text: 'Код ТН ВЭД, декларация, расчёт пошлины и НДС, работа с документами.' },
    ],
  },
  facts: [
    { value: '2018', label: 'работаем с Китаем с этого года' },
    { value: '3', label: 'языка: узбекский, русский, китайский' },
    { value: '15–25', label: 'дней — сборный груз, ориентировочно' },
    { value: '1', label: 'склад в Иу, 1 офис в Ташкенте' },
  ],
  honesty: { heading: 'Чего мы не обещаем?', text: 'Мы не говорим «без пошлин», «100% гарантия» и «самые быстрые». Пошлина и НДС платятся по закону — мы заранее их рассчитываем. Сроки ориентировочные: на них влияют очереди на границе, китайские праздники и погода. Поэтому рядом с каждой цифрой стоит слово «ориентировочно».' },
  cta: { title: 'Давайте познакомимся.', text: 'Напишите, что за груз, из какого города и к какому сроку — предложим маршрут и цену.' },
};

const en: AboutStrings = {
  seoTitle: 'About — GSR Logistics, freight from China to Uzbekistan since 2018',
  seoDescription: 'GSR Logistics is a Tashkent logistics company: consolidated truck cargo from its Yiwu warehouse via Khorgos to Tashkent, air and rail cargo, product sourcing and buying, customs clearance. Managers speak Uzbek, Russian and Chinese. Since 2018.',
  eyebrow: 'About',
  h1: 'Your people on the ground in China.',
  intro: 'GSR Logistics is a logistics company in Tashkent. We have worked with China since 2018: consolidated cargo from the Yiwu warehouse reaches Tashkent via Khorgos in roughly 15–25 days, air freight in 5–10. We find the product, buy it, inspect it and clear customs — one contract, one manager.',
  story: {
    heading: 'How it started',
    paragraphs: [
      'In 2018 we began with equipment and goods supply from China: finding the manufacturer, negotiating, sampling, delivering. Soon clients kept asking the same thing: “Can I pay for my space only, not for a whole container?” Since 2022 consolidated cargo has been our main line of work.',
      'Today we receive cargo at the warehouse in Yiwu (义乌), weigh and measure it, send a photo report, consolidate lots from several suppliers in one place and ship via Khorgos to Tashkent. In Tashkent we clear customs and hand the cargo over or forward it to the regions.',
      'We do not make loud promises. Instead the pricing rule, transit times, address and process are published on this site — you can check them.',
    ],
  },
  how: {
    heading: 'How we work',
    items: [
      { title: 'Honesty', text: 'Price, timing and liability are in the contract. No hidden fees: the volumetric-weight formula and density rule are published on the site.' },
      { title: 'Transparency', text: 'A photo report at every intake, manager updates in transit, status by cargo code in Tashkent. We answer now, not “later”.' },
      { title: 'Quality', text: 'We inspect cargo while it is still in China: quantity, condition, packaging. Damaged or wrong goods are resolved before they leave for Tashkent.' },
      { title: 'No language barrier', text: 'Our managers speak Uzbek, Russian and Chinese. We handle negotiations with the supplier.' },
    ],
  },
  places: {
    heading: 'Where we are',
    yiwu: { title: 'Yiwu (义乌), China — warehouse', text: 'The world’s largest small-commodity wholesale city. This is where we receive, consolidate and dispatch cargo. Goods from Guangzhou, Shenzhen and other cities arrive via partners. Your manager provides the warehouse address and client code.' },
    tashkent: { title: 'Tashkent — office', text: '27 Alisher Navoiy Street, Shaykhantakhur district. Contracts, documents, payments and advice happen here.', directions: 'Next to Alisher Navoiy metro station. Visits are welcome — message us on Telegram first.' },
  },
  team: {
    heading: 'Who you work with',
    text: 'A small but complete team: every client gets one manager who follows the cargo from start to finish.',
    roles: [
      { title: 'Tashkent managers', text: 'Requests, quotes, contracts and status updates — on Telegram and by phone.' },
      { title: 'Staff in China', text: 'Intake at the Yiwu warehouse, weighing, inspection, photo reports, packing and loading.' },
      { title: 'Customs specialist', text: 'HS codes, declarations, duty and VAT calculation, documents.' },
    ],
  },
  facts: [
    { value: '2018', label: 'working with China since' },
    { value: '3', label: 'languages: Uzbek, Russian, Chinese' },
    { value: '15–25', label: 'days — consolidated cargo, roughly' },
    { value: '1', label: 'warehouse in Yiwu, 1 office in Tashkent' },
  ],
  honesty: { heading: 'What we do not promise', text: 'We never say “duty-free”, “100% guaranteed” or “the fastest”. Duty and VAT are paid by law — we calculate them in advance. Transit times are indicative: border queues, Chinese holidays and weather affect them. That is why every figure comes with “roughly”.' },
  cta: { title: 'Let’s get acquainted.', text: 'Tell us the cargo, the city and the deadline — we propose a route and a price.' },
};

export const about: Record<Lang, AboutStrings> = { uz, ru, en };
