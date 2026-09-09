import type { Lang } from './config';
import type { BreakdownStrings } from '@/lib/pricing';

/**
 * Strings for the pricing page, the calculator (component + page) and the home pricing teaser.
 * Every figure is injected from src/data/tariffs.json at render time; templates use {name} slots.
 */
export interface PricingStrings {
  /** Fragments the pricing engine needs to print a result (also serialised into the calculator's data attribute). */
  breakdown: BreakdownStrings;
  months: string[];
  /** "{month} {year}" → "2026-yil sentabr" */
  monthYear: string;
  calc: {
    title: string;
    lead: string;
    modeLabel: string;
    modes: { air: string; truck: string; rail: string };
    weight: string;
    weightHint: string;
    volumeLabel: string;
    volumeModes: { dims: string; m3: string };
    dims: { l: string; w: string; h: string };
    m3: string;
    volumeHint: string;
    category: string;
    categoryHint: string;
    container: string;
    submit: string;
    resultLabel: string;
    resultEmpty: string;
    ruleLabel: string;
    switchNote: string;
    kursNote: string;
    finalNote: string;
    confirm: string;
    draftPreview: string;
    draft: string;
    draftRail: string;
    draftNoVolume: string;
    allRates: string;
    noJsText: string;
    noJsLink: string;
    inputsLabel: string;
  };
  page: {
    seoTitle: string;
    seoDescription: string;
    eyebrow: string;
    h1: string;
    intro: string;
    tiles: { truck: string; air: string; lcl: string; rail: string; fromKg: string; fromM3: string; fromContainer: string };
    truck: { title: string; intro: string; head: [string, string]; upTo: string; between: string; from: string; dense: string; note: string; days: string };
    lcl: { title: string; intro: string; head: [string, string]; upTo: string; between: string; from: string; note: string };
    air: { title: string; intro: string; head: [string, string]; rows: { standard: string; brand: string; commercial: string; battery: string; liquid: string }; truckOnly: string; note: string };
    rail: { title: string; intro: string; head: [string, string]; c20: string; c40: string; note: string };
    rules: { title: string; formula: string; formulaLine: string; density: string; densityLine: string; chargeable: string };
    examples: { title: string; intro: string; items: Array<{ title: string; input: string }>; inputLabel: string; resultLabel: string };
    inclusions: { title: string; includedTitle: string; included: string[]; extrasTitle: string; head: [string, string]; extras: { photo: string; repack: string; inspection: string; insurance: string; commission: string; storageChina: string; storageTashkent: string }; perReceipt: string; ofValue: string; daysFree: string; excludedTitle: string; excluded: string[] };
    regions: { title: string; text: string };
    payment: { title: string; paragraphs: string[] };
    how: { title: string; paragraphs: string[] };
    calcTitle: string;
    calcIntro: string;
    faq: { title: string; items: Array<{ q: string; a: string }> };
    cta: { eyebrow: string; title: string; text: string; draft: string };
    sources: string;
  };
  calcPage: {
    seoTitle: string;
    seoDescription: string;
    eyebrow: string;
    h1: string;
    intro: string;
    howTitle: string;
    steps: Array<{ title: string; text: string }>;
    notesTitle: string;
    notes: string[];
    ratesTitle: string;
    ratesText: string;
    ratesLink: string;
    cta: { title: string; text: string; draft: string };
  };
  teaser: {
    eyebrow: string;
    h2: string;
    rules: string[];
    example: string;
    allRates: string;
    tiles: { truck: string; air: string; lcl: string };
    perKgFrom: string;
    perM3From: string;
    cta: string;
    ctaText: string;
  };
}

const uz: PricingStrings = {
  breakdown: {
    modes: { air: 'Avia kargo', truck: 'Avto kargo (yigʻma yuk)', rail: 'Temir yoʻl (konteyner)' },
    categories: { standard: 'Oddiy tovar', brand: 'Brend (original, qutisi bilan)', commercial: 'Seriya / tijorat (bir xildan 3+ dona)', battery: 'Batareyali, elektronika', liquid: 'Suyuqlik, kosmetika, atir' },
    rules: {
      'air-per-kg': 'Avia · {category} · hisoblangan vazn {kg} kg × {rate}',
      'truck-ladder': 'Zichlik {density} kg/m³ ≥ {threshold} → kg boʻyicha · {rate}',
      'truck-dense': 'Zich yuk: {kg} kg, {density} kg/m³ ≥ {denseDensity} → {rate}',
      'truck-lcl': 'Zichlik {density} kg/m³ < {threshold} → m³ boʻyicha · {rate}',
      'rail-20ft': '20 futlik konteyner · {rate}, yoʻnalish va mavsumga qarab',
      'rail-40ft': '40 futlik konteyner · {rate}, yoʻnalish va mavsumga qarab',
    },
    notes: {
      'volumetric-applied': 'Hajmiy vazn ({volumetric} kg, ÷ {divisor}) haqiqiy vazndan katta — hisob hajmiy vazn boʻyicha.',
      'min-kg-applied': 'Minimal hisob vazni — {minKg} kg.',
      'min-m3-applied': 'Minimal hajm — {minM3} m³.',
      'no-volume': 'Hajm kiritilmagan — hisob faqat vazn boʻyicha. Hajmli yukda narx m³ qoidasiga oʻtishi mumkin.',
      'switched-to-truck': '{category} avia bilan joʻnatilmaydi — avto tarifi qoʻllandi.',
      'dense-lot': 'Zich ulgurji partiya — {denseKg} kg dan, {denseDensity} kg/m³ dan zich.',
      range: 'Narx oraliq — aniq summa soʻrov boʻyicha.',
    },
    units: { kg: 'kg', m3: 'm³', cm: 'sm', kgm3: 'kg/m³', perKg: '/kg', perM3: '/m³', days: 'kun', container: 'konteyner' },
    labels: { chargeable: 'Hisoblangan vazn', density: 'Zichlik', rule: 'Qoida', rate: 'Tarif', days: 'Muddat', volumetric: 'Hajmiy vazn', volume: 'Hajm', total: 'Taxminiy narx', totalSom: 'Soʻmda', range: 'Konteyner' },
    approx: 'taxminan',
    containers: { '20ft': '20 fut', '40ft': '40 fut' },
  },
  months: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  monthYear: '{year}-yil {month}',
  calc: {
    title: 'Narxni hisoblang',
    lead: 'Vazn va oʻlchamni kiriting — qoida, tarif va taxminiy summa darhol koʻrinadi.',
    modeLabel: 'Yoʻnalish',
    modes: { air: 'Avia', truck: 'Avto', rail: 'Temir yoʻl' },
    weight: 'Vazn',
    weightHint: 'Haqiqiy vazn, kg',
    volumeLabel: 'Hajm',
    volumeModes: { dims: 'Oʻlchamlar, sm', m3: 'Hajm, m³' },
    dims: { l: 'Uzunlik', w: 'En', h: 'Balandlik' },
    m3: 'Hajm',
    volumeHint: 'Ixtiyoriy — lekin hajmli yukda narx m³ boʻyicha chiqadi.',
    category: 'Tovar toifasi',
    categoryHint: 'Batareyali va suyuq tovarlar faqat avto bilan yuriladi.',
    container: 'Konteyner',
    submit: 'Hisoblash',
    resultLabel: 'Taxminiy narx',
    resultEmpty: 'Vaznni kiriting — narx shu yerda chiqadi.',
    ruleLabel: 'Qoʻllangan qoida',
    switchNote: 'Bu toifa avia bilan joʻnatilmaydi — kalkulyator avto tarifiga oʻtdi.',
    kursNote: 'Hisob-kitob kursi: 1 $ = {rate} soʻm (taxminiy).',
    finalNote: 'Yakuniy narx Ivu omborida tortib-oʻlchangandan keyin tasdiqlanadi.',
    confirm: 'Telegramda tasdiqlang',
    draftPreview: 'Xabar matni',
    draft: 'Assalomu alaykum! Kalkulyator boʻyicha taxminiy narxni tasdiqlab bera olasizmi? {mode}, {kg} kg, {volume}, toifa: {category}. Taxminiy: {total}.',
    draftRail: 'Assalomu alaykum! Konteyner narxini aniqlashtirmoqchi edim: {container} konteyner, Xitoy → Toshkent. Saytdagi taxminiy oraliq: {total}.',
    draftNoVolume: 'hajmi hali maʼlum emas',
    allRates: 'Barcha tariflar',
    noJsText: 'Jonli hisob uchun brauzerda JavaScript kerak. Tariflar jadvali va qoidalar narxlar sahifasida — hisobni shu yerdan qilishingiz mumkin.',
    noJsLink: 'Tariflar jadvaliga oʻtish',
    inputsLabel: 'Yuk maʼlumotlari',
  },
  page: {
    seoTitle: 'Xitoydan Toshkentga kargo narxlari 2026 — 1 kg necha pul?',
    seoDescription: 'Xitoydan Toshkentga kargo: avto (yigʻma yuk) {truck}/kg dan, avia {air}/kg dan, hajmli yuk {lcl}/m³ dan. Hajmiy vazn, zichlik qoidasi, narxga nimalar kirishi, toʻlov. Yangilangan: {date}.',
    eyebrow: 'Narxlar — {month}',
    h1: 'Xitoydan Toshkentga kargo narxlari 2026',
    intro: 'Xitoydan Toshkentga kargo 1 kg — avto (yigʻma yuk) {truck} dan, avia — {air} dan ({month}). Yengil, hajmli yuk m³ boʻyicha {lcl} dan: zichlik {threshold} kg/m³ dan past boʻlsa — m³, yuqori boʻlsa — kg hisobida. Narxga Ivu omborida qabul, oʻlchash, konsolidatsiya va Toshkent omborigacha yetkazish kiradi; boj, QQS va sugʻurta — alohida.',
    tiles: { truck: 'Avto kargo (yigʻma yuk)', air: 'Avia kargo', lcl: 'Hajmli yuk (LCL)', rail: 'Konteyner 20 fut', fromKg: '$/kg dan', fromM3: '$/m³ dan', fromContainer: '$ dan' },
    truck: {
      title: 'Avto kargo (yigʻma yuk) — 1 kg necha pul?',
      intro: 'Avto kargo — Xitoydagi omborda yigʻiladigan, fura bilan Xorgos orqali Toshkentga keladigan yuk. Narx hisoblangan vaznga qarab pogʻonali: yuk ogʻirlashgani sari 1 kg arzonlashadi.',
      head: ['Hisoblangan vazn', '1 kg narxi'],
      upTo: '{b} kg gacha',
      between: '{a}–{b} kg',
      from: '{a} kg dan',
      dense: 'Zich ulgurji yuk — {kg} kg dan, {density} kg/m³ dan zich (kiyim toylari, poyabzal, ehtiyot qismlar)',
      note: 'Hisoblangan vazn — haqiqiy va hajmiy vazndan kattasi. Hajmiy vazn: uzunlik × en × balandlik (sm) ÷ {divisor}.',
      days: 'Muddat: taxminan {days} kun, yuk Ivu omboridan joʻnatilgandan keyin; ekspress partiyalar {express} kun.',
    },
    lcl: {
      title: 'Hajmli yuk — 1 m³ necha pul?',
      intro: 'Oʻyinchoq, plastik idish, mebel, sunʼiy gul kabi yengil yuk kg boʻyicha hisoblansa qimmat chiqadi. Shuning uchun zichlik {threshold} kg/m³ dan past yukni m³ boʻyicha hisoblaymiz — zichlik qancha past boʻlsa, 1 m³ shuncha arzon.',
      head: ['Zichlik', '1 m³ narxi'],
      upTo: '{b} kg/m³ gacha',
      between: '{a}–{b} kg/m³',
      from: '{a} kg/m³ dan',
      note: 'Zichlik = vazn ÷ hajm. Minimal hajm — {minM3} m³. Bir joyning hajmi: uzunlik × en × balandlik (m).',
    },
    air: {
      title: 'Avia kargo — 1 kg necha pul?',
      intro: 'Avia — shoshilinch, yengil va qimmat tovarlar uchun: telefon aksessuarlari, kiyim namunalari, kichik elektronika. Narx tovar toifasiga qarab, hisoblangan vazn ÷ {divisor} qoidasi bilan.',
      head: ['Tovar toifasi', '1 kg narxi'],
      rows: { standard: 'Oddiy tovarlar (kundalik mahsulotlar, kiyim, aksessuar)', brand: 'Brend (original, qutisi bilan)', commercial: 'Seriya / tijorat (bir xildan 3+ dona, elektronika)', battery: 'Batareyali tovarlar (power bank, akkumulyator)', liquid: 'Suyuqlik, kosmetika, atir' },
      truckOnly: 'faqat avto',
      note: 'Minimal hisob vazni — {minKg} kg. Muddat: taxminan {days} kun, reysdan keyin. Batareya, magnit va suyuqlik samolyotga olinmaydi — ular avto bilan yuradi.',
    },
    rail: {
      title: 'Temir yoʻl va konteyner narxlari',
      intro: 'Katta partiyalar uchun — butun konteyner (FCL) yoki konteynerdagi joy (LCL). Narx yoʻnalish, mavsum va yuk turiga qarab oraliqda beriladi; aniq summa — soʻrov boʻyicha.',
      head: ['Konteyner', 'Narx (Xitoy → Toshkent)'],
      c20: '20 futlik konteyner (≈ 33 m³, 28 t gacha)',
      c40: '40 futlik / 40 HC konteyner (≈ 67–76 m³, 26 t gacha)',
      note: 'Muddat: taxminan {days} kun. Konteyner Xitoy ichidagi tashish, bojxona rasmiylashtiruvi va Toshkentda tushirishni oʻz ichiga olmaydi — soʻrovda alohida hisoblaymiz.',
    },
    rules: {
      title: 'Narx qanday hisoblanadi: kg yoki m³?',
      formula: 'Hajmiy vazn',
      formulaLine: 'Hajmiy vazn (kg) = uzunlik × en × balandlik (sm) ÷ {truckDivisor} — avto; ÷ {airDivisor} — avia. Hisoblangan vazn — haqiqiy va hajmiy vazndan kattasi.',
      density: 'Zichlik qoidasi',
      densityLine: 'Zichlik (kg/m³) = vazn ÷ hajm. {threshold} kg/m³ va undan yuqori — kg boʻyicha, past — m³ boʻyicha. 1 m³ avtoda ≈ {kgPerM3} kg ga teng.',
      chargeable: 'Shuning uchun kalkulyatorga vazn bilan birga oʻlchamlarni ham kiriting — zichlik qaysi qoida ishlashini hal qiladi.',
    },
    examples: {
      title: 'Uchta misol',
      intro: 'Uchala hisob ham quyidagi jadvallar va kalkulyator ishlatadigan qoidalar bilan qilingan.',
      items: [
        { title: 'Telefon aksessuarlari, avia', input: '20 kg · 50 × 40 × 30 sm · seriya / tijorat' },
        { title: 'Poyabzal, avto', input: '300 kg · 1,2 m³ · oddiy tovar' },
        { title: 'Oʻyinchoq, hajmli yuk', input: '180 kg · 2 m³ · oddiy tovar' },
      ],
      inputLabel: 'Kiritildi',
      resultLabel: 'Natija',
    },
    inclusions: {
      title: 'Narxga nimalar kiradi?',
      includedTitle: 'Kiradi',
      included: ['Ivu omborida qabul, tortish va oʻlchash', 'Har qabulda foto-hisobot Telegramga', 'Konsolidatsiya — bir necha yetkazib beruvchidan bitta yuk', 'Xitoydan Toshkent omborigacha tashish', 'Menejer: joylashuv va holat haqida xabar', 'Toshkent omboridan olib ketish yoki viloyat filialiga joʻnatish'],
      extrasTitle: 'Qoʻshimcha xizmatlar',
      head: ['Xizmat', 'Narx'],
      extras: { photo: 'Batafsil foto-hisobot (har bir joy)', repack: 'Qayta qadoqlash, hajmni kamaytirish', inspection: 'Tovarni sanash va tekshirish', insurance: 'Sugʻurta', commission: 'Tovar topish va sotib olish komissiyasi', storageChina: 'Ivu omborida saqlash', storageTashkent: 'Toshkent omborida saqlash' },
      perReceipt: 'har qabulda',
      ofValue: 'eʼlon qilingan qiymatning',
      daysFree: '{n} {days} bepul',
      excludedTitle: 'Alohida toʻlanadi',
      excluded: ['Boj, QQS va bojxona yigʻimlari — qonun boʻyicha, TN VED kodiga qarab; oldindan hisoblab beramiz', 'Tovarning oʻzi va Xitoy ichidagi yetkazib berish (yetkazib beruvchidan Ivu omborigacha)', 'Uygacha yetkazish — quyida'],
    },
    regions: {
      title: 'Viloyatlarga yetkazish',
      text: 'Toshkent omboridan olib ketish va viloyat filialigacha joʻnatish — bepul. Uygacha yetkazish — {door} soʻm. Toshkent shahrida {kg} kg dan ortiq yuk uygacha bepul.',
    },
    payment: {
      title: 'Toʻlov qanday?',
      paragraphs: [
        'Narx AQSH dollarida hisoblanadi, toʻlov soʻmda — hisob-kitob kursi boʻyicha (hozir 1 $ = {rate} soʻm, taxminiy). Kurs har partiya uchun eʼlon qilinadi.',
        'Toʻlov yuk Toshkent omboriga kelganda, yukni olishdan oldin. Naqd, Humo/Uzcard karta, Click yoki Payme; yuridik shaxslar uchun — shartnoma va hisob-faktura bilan bank oʻtkazmasi.',
        'Oldindan toʻlov shart emas. Toshkent omborida {free} kundan keyin saqlash uchun kunlik haq olinadi — muddatni menejer bilan kelishing.',
      ],
    },
    how: {
      title: 'Narxlar qanday shakllanadi?',
      paragraphs: [
        'Kargo narxi uchta narsadan tuziladi: Xitoy ichidagi yigʻish va omborga qabul, Xitoy — Xorgos — Toshkent yoʻlidagi transport va Toshkentdagi rasmiylashtiruv. Yigʻma yukda siz butun fura uchun emas, faqat oʻz joyingiz uchun toʻlaysiz — shuning uchun 1 kg narxi konteyner ijarasidan ancha past.',
        'Furada joy chegaralangan, shuning uchun yengil va hajmli yuk kg boʻyicha emas, m³ boʻyicha hisoblanadi. Zichlik {threshold} kg/m³ — chegara: undan zich yuk kg tarifi bilan, undan yengil yuk m³ tarifi bilan yuradi. Bu qoida bozorda umumiy qabul qilingan va bizda jadvalda ochiq yozilgan.',
        'Tariflar mavsumga bogʻliq: 11.11 va Yangi yil oldi partiyalar zichlashadi, Xitoy Yangi yili (yanvar oxiri — fevral) omborlar ikki hafta yopiladi. Shu sababli jadvaldagi narxlar taxminiy va har oy yangilanadi — sana har jadval ostida turadi.',
        'Yakuniy narx Ivu omborida yuk tortib-oʻlchangandan keyin tasdiqlanadi: haqiqiy vazn, hajm va foto-hisobot Telegramga keladi, shundan keyin hisob yopiladi. Yashirin toʻlovlar yoʻq — shartnomada narx qoidasi yozilgan.',
      ],
    },
    calcTitle: 'Oʻz yukingiz uchun hisoblang',
    calcIntro: 'Vazn, oʻlcham va toifani kiriting — kalkulyator shu jadvallar boʻyicha hisoblaydi va Telegramga tayyor xabar tuzadi.',
    faq: {
      title: 'Narxlar boʻyicha savollar',
      items: [
        { q: 'Xitoydan Toshkentga 1 kg kargo necha pul?', a: 'Avto (yigʻma yuk) — {truck} dan, avia — {air} dan, {month} holatiga koʻra. Ogʻir partiyalarda 1 kg arzonlashadi, hajmli yukda narx m³ boʻyicha chiqadi.' },
        { q: 'Hajmiy vazn nima va u qachon hisoblanadi?', a: 'Hajmiy vazn = uzunlik × en × balandlik (sm) ÷ {truckDivisor} (avia — ÷ {airDivisor}). Hisob haqiqiy va hajmiy vazndan kattasi boʻyicha. Masalan, 60 × 50 × 40 sm quti avtoda 20 kg deb hisoblanadi — ichida 8 kg boʻlsa ham.' },
        { q: 'Kg yoki m³ — qaysi biri arzon?', a: 'Zich yuk (poyabzal, kiyim, ehtiyot qismlar) — kg boʻyicha arzon; yengil yuk (oʻyinchoq, plastik, mebel) — m³ boʻyicha. Chegara — {threshold} kg/m³: kalkulyator zichlikni oʻzi hisoblab, arzon qoidani koʻrsatadi.' },
        { q: 'Minimal vazn bormi?', a: 'Avia — {airMin} kg dan, avto — 1 kg dan, hajmli yuk — {minM3} m³ dan, konteyner — 20 futdan. Kichik posilkalarni ham yigʻma yukka qoʻshamiz.' },
        { q: 'Narxga bojxona kiradimi?', a: 'Bojxona rasmiylashtiruvi — bizning zimmamizda, hujjatlarni biz tayyorlaymiz. Boj va QQS esa qonun boʻyicha, TN VED kodiga qarab alohida toʻlanadi — summani joʻnatishdan oldin hisoblab beramiz.' },
        { q: 'Sugʻurta qancha turadi?', a: 'Eʼlon qilingan qiymatning {insurance}% (taxminiy). Sugʻurtasiz yuk uchun javobgarlik shartnomada belgilanadi.' },
        { q: 'Toʻlovni qachon va qanday qilaman?', a: 'Yuk Toshkent omboriga kelganda, olishdan oldin — soʻmda, hisob-kitob kursi boʻyicha. Naqd, karta, Click/Payme; yuridik shaxslar uchun hisob-faktura. Oldindan toʻlov shart emas.' },
        { q: 'Narx nega taxminiy?', a: 'Chunki yakuniy vazn va hajm Ivu omborida tortilgandan keyin aniq boʻladi, tariflar esa mavsumga qarab har oy yangilanadi. Sana jadval ostida — {date}. Hisobni Telegramda bir xabar bilan tasdiqlaymiz.' },
      ],
    },
    cta: { eyebrow: 'Aloqa', title: 'Aniq narx — bitta xabar.', text: 'Tovar, shahar va taxminiy vaznni yozing — menejer qoida, tarif va muddatni tasdiqlaydi.', draft: 'Assalomu alaykum! Xitoydan yuk narxini bilmoqchi edim: ' },
    sources: 'Tariflar — Toshkent bozorining {month} holatidagi oʻrtacha narxlari asosida; aniq narx har partiya uchun tasdiqlanadi.',
  },
  calcPage: {
    seoTitle: 'Kargo kalkulyatori — Xitoydan Toshkentga yuk narxini hisoblang',
    seoDescription: 'Xitoydan Toshkentga yuk necha pul? Vazn, oʻlcham va toifani kiriting — avto, avia va konteyner uchun taxminiy narx, qoida, tarif va muddat. Tariflar: {date}.',
    eyebrow: 'Kalkulyator',
    h1: 'Xitoydan yuk necha pul boʻladi?',
    intro: 'Vazn, oʻlcham va tovar toifasini kiriting — kalkulyator avto, avia yoki temir yoʻl uchun taxminiy narxni {date} tariflari boʻyicha hisoblaydi: qoʻllangan qoida, tarif, dollar va soʻmdagi summa, muddat. Avto — {truck}/kg dan, avia — {air}/kg dan. Aniq narx Ivu omborida tortilgandan keyin tasdiqlanadi.',
    howTitle: 'Kalkulyator qanday hisoblaydi?',
    steps: [
      { title: 'Hisoblangan vaznni topadi', text: 'Hajmiy vazn = uzunlik × en × balandlik (sm) ÷ {truckDivisor} (avia — ÷ {airDivisor}). Haqiqiy va hajmiy vazndan kattasi olinadi.' },
      { title: 'Qoidani tanlaydi', text: 'Zichlik {threshold} kg/m³ va undan yuqori — kg tarifi (pogʻonali), past — m³ tarifi (zichlik bandi boʻyicha). Avia — toifa boʻyicha 1 kg narxi.' },
      { title: 'Summani chiqaradi', text: 'Tarif × hisoblangan vazn yoki hajm. Dollar va soʻmda, {days} kun muddat bilan, Telegramga tayyor xabar bilan.' },
    ],
    notesTitle: 'Nimalarga eʼtibor bering',
    notes: [
      'Batareyali tovarlar, magnit va suyuqlik samolyotga olinmaydi — kalkulyator ularni avtomatik avto tarifiga oʻtkazadi.',
      'Hajmni kiritmasangiz, hisob faqat vazn boʻyicha chiqadi. Hajmli yukda haqiqiy narx m³ qoidasi bilan boshqacha boʻlishi mumkin.',
      'Natija — taxminiy. Boj, QQS, sugʻurta va uygacha yetkazish alohida hisoblanadi.',
    ],
    ratesTitle: 'Toʻliq tariflar',
    ratesText: 'Barcha jadvallar, qoidalar, misollar va toʻlov shartlari — narxlar sahifasida.',
    ratesLink: 'Barcha tariflar',
    cta: { title: 'Natijani tasdiqlaymizmi?', text: 'Hisobni Telegramga yuboring — menejer tarif va muddatni tasdiqlaydi, kerak boʻlsa arzonroq yoʻnalishni taklif qiladi.', draft: 'Assalomu alaykum! Kalkulyatorda hisobladim, narxni tasdiqlab bera olasizmi? ' },
  },
  teaser: {
    eyebrow: '05 — Narxlar',
    h2: 'Narx oldindan maʼlum.',
    rules: [
      'Hajmiy vazn: uzunlik × en × balandlik (sm) ÷ {truckDivisor} (avia ÷ {airDivisor}).',
      'Zichlik {threshold} kg/m³ dan yuqori — kg boʻyicha, past — m³ boʻyicha.',
      'Narxga ombor qabuli, oʻlchash va foto-hisobot kiradi; sugʻurta va bojxona toʻlovlari — alohida.',
    ],
    example: 'Masalan: 48 kg, 0,2 m³ → 240 kg/m³ → kg boʻyicha.',
    allRates: 'Barcha tariflar',
    tiles: { truck: 'Avto kargo (yigʻma yuk)', air: 'Avia kargo', lcl: 'Hajmli yuk (LCL)' },
    perKgFrom: '$/kg dan',
    perM3From: '$/m³ dan',
    cta: 'Narxni hisoblang',
    ctaText: 'Vazn va oʻlchamni kiriting — kalkulyator qoida, tarif va summani darhol koʻrsatadi.',
  },
};

const ru: PricingStrings = {
  breakdown: {
    modes: { air: 'Авиа карго', truck: 'Авто карго (сборный груз)', rail: 'Ж/д (контейнер)' },
    categories: { standard: 'Обычный товар', brand: 'Бренд (оригинал, в коробке)', commercial: 'Серия / коммерческий (3+ одинаковых)', battery: 'С батареями, электроника', liquid: 'Жидкости, косметика, парфюм' },
    rules: {
      'air-per-kg': 'Авиа · {category} · расчётный вес {kg} кг × {rate}',
      'truck-ladder': 'Плотность {density} кг/м³ ≥ {threshold} → по кг · {rate}',
      'truck-dense': 'Плотный груз: {kg} кг, {density} кг/м³ ≥ {denseDensity} → {rate}',
      'truck-lcl': 'Плотность {density} кг/м³ < {threshold} → по м³ · {rate}',
      'rail-20ft': '20-футовый контейнер · {rate}, зависит от маршрута и сезона',
      'rail-40ft': '40-футовый контейнер · {rate}, зависит от маршрута и сезона',
    },
    notes: {
      'volumetric-applied': 'Объёмный вес ({volumetric} кг, ÷ {divisor}) больше фактического — считаем по объёмному.',
      'min-kg-applied': 'Минимальный расчётный вес — {minKg} кг.',
      'min-m3-applied': 'Минимальный объём — {minM3} м³.',
      'no-volume': 'Объём не указан — расчёт только по весу. Для объёмного груза цена может перейти на правило м³.',
      'switched-to-truck': '{category} авиа не отправляется — применён тариф авто.',
      'dense-lot': 'Плотная оптовая партия — от {denseKg} кг, плотнее {denseDensity} кг/м³.',
      range: 'Цена в диапазоне — точная сумма по запросу.',
    },
    units: { kg: 'кг', m3: 'м³', cm: 'см', kgm3: 'кг/м³', perKg: '/кг', perM3: '/м³', days: 'дней', container: 'контейнер' },
    labels: { chargeable: 'Расчётный вес', density: 'Плотность', rule: 'Правило', rate: 'Тариф', days: 'Срок', volumetric: 'Объёмный вес', volume: 'Объём', total: 'Ориентировочная цена', totalSom: 'В сумах', range: 'Контейнер' },
    approx: 'ориентировочно',
    containers: { '20ft': '20 футов', '40ft': '40 футов' },
  },
  months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  monthYear: '{month} {year}',
  calc: {
    title: 'Рассчитать стоимость',
    lead: 'Введите вес и размеры — правило, тариф и ориентировочная сумма появятся сразу.',
    modeLabel: 'Способ доставки',
    modes: { air: 'Авиа', truck: 'Авто', rail: 'Ж/д' },
    weight: 'Вес',
    weightHint: 'Фактический вес, кг',
    volumeLabel: 'Объём',
    volumeModes: { dims: 'Размеры, см', m3: 'Объём, м³' },
    dims: { l: 'Длина', w: 'Ширина', h: 'Высота' },
    m3: 'Объём',
    volumeHint: 'Необязательно — но для объёмного груза цена считается по м³.',
    category: 'Категория товара',
    categoryHint: 'Товары с батареями и жидкости едут только авто.',
    container: 'Контейнер',
    submit: 'Рассчитать',
    resultLabel: 'Ориентировочная цена',
    resultEmpty: 'Введите вес — цена появится здесь.',
    ruleLabel: 'Применённое правило',
    switchNote: 'Эта категория не летит авиа — калькулятор перешёл на тариф авто.',
    kursNote: 'Расчётный курс: 1 $ = {rate} сум (ориентировочно).',
    finalNote: 'Итоговая цена подтверждается после взвешивания и обмера на складе в Иу.',
    confirm: 'Подтвердить в Telegram',
    draftPreview: 'Текст сообщения',
    draft: 'Здравствуйте! Подтвердите, пожалуйста, ориентировочную цену из калькулятора: {mode}, {kg} кг, {volume}, категория: {category}. Ориентировочно: {total}.',
    draftRail: 'Здравствуйте! Хочу уточнить стоимость контейнера: {container}, Китай → Ташкент. Ориентировочный диапазон на сайте: {total}.',
    draftNoVolume: 'объём пока неизвестен',
    allRates: 'Все тарифы',
    noJsText: 'Для живого расчёта нужен JavaScript в браузере. Таблицы тарифов и правила — на странице цен, посчитать можно по ним.',
    noJsLink: 'Перейти к таблицам тарифов',
    inputsLabel: 'Данные груза',
  },
  page: {
    seoTitle: 'Цены на карго из Китая в Ташкент 2026 — сколько стоит 1 кг?',
    seoDescription: 'Карго из Китая в Ташкент: авто (сборный груз) от {truck}/кг, авиа от {air}/кг, объёмный груз от {lcl}/м³. Объёмный вес, правило плотности, что входит в цену, оплата. Обновлено: {date}.',
    eyebrow: 'Цены — {month}',
    h1: 'Цены на карго из Китая в Ташкент 2026',
    intro: 'Карго из Китая в Ташкент за 1 кг — авто (сборный груз) от {truck}, авиа — от {air} ({month}). Лёгкий объёмный груз считаем по м³ от {lcl}: при плотности ниже {threshold} кг/м³ — по м³, выше — по кг. В цену входят приёмка на складе в Иу, обмер, консолидация и доставка до склада в Ташкенте; пошлина, НДС и страховка — отдельно.',
    tiles: { truck: 'Авто карго (сборный груз)', air: 'Авиа карго', lcl: 'Объёмный груз (LCL)', rail: 'Контейнер 20 футов', fromKg: '$/кг', fromM3: '$/м³', fromContainer: '$' },
    truck: {
      title: 'Авто карго (сборный груз) — сколько стоит 1 кг?',
      intro: 'Авто карго — груз, который собирается на складе в Китае и едет фурой через Хоргос в Ташкент. Цена ступенчатая по расчётному весу: чем тяжелее партия, тем дешевле килограмм.',
      head: ['Расчётный вес', 'Цена за 1 кг'],
      upTo: 'до {b} кг',
      between: '{a}–{b} кг',
      from: 'от {a} кг',
      dense: 'Плотный оптовый груз — от {kg} кг, плотнее {density} кг/м³ (тюки одежды, обувь, запчасти)',
      note: 'Расчётный вес — больший из фактического и объёмного. Объёмный вес: длина × ширина × высота (см) ÷ {divisor}.',
      days: 'Срок: ориентировочно {days} дней после отправки со склада в Иу; экспресс-партии — {express} дней.',
    },
    lcl: {
      title: 'Объёмный груз — сколько стоит 1 м³?',
      intro: 'Игрушки, пластиковая посуда, мебель, искусственные цветы — лёгкий груз, который по килограммам выходит дорого. Поэтому груз плотностью ниже {threshold} кг/м³ считаем по м³: чем ниже плотность, тем дешевле кубометр.',
      head: ['Плотность', 'Цена за 1 м³'],
      upTo: 'до {b} кг/м³',
      between: '{a}–{b} кг/м³',
      from: 'от {a} кг/м³',
      note: 'Плотность = вес ÷ объём. Минимальный объём — {minM3} м³. Объём места: длина × ширина × высота (м).',
    },
    air: {
      title: 'Авиа карго — сколько стоит 1 кг?',
      intro: 'Авиа — для срочного, лёгкого и дорогого товара: аксессуары для телефонов, образцы одежды, мелкая электроника. Цена зависит от категории, расчётный вес — по правилу ÷ {divisor}.',
      head: ['Категория товара', 'Цена за 1 кг'],
      rows: { standard: 'Обычные товары (повседневные, одежда, аксессуары)', brand: 'Бренд (оригинал, в коробке)', commercial: 'Серия / коммерческий (3+ одинаковых, электроника)', battery: 'Товары с батареями (power bank, аккумуляторы)', liquid: 'Жидкости, косметика, парфюм' },
      truckOnly: 'только авто',
      note: 'Минимальный расчётный вес — {minKg} кг. Срок: ориентировочно {days} дней после рейса. Батареи, магниты и жидкости на самолёт не принимаются — едут авто.',
    },
    rail: {
      title: 'Ж/д и контейнерные перевозки',
      intro: 'Для крупных партий — целый контейнер (FCL) или место в контейнере (LCL). Цена даётся диапазоном в зависимости от маршрута, сезона и типа груза; точная сумма — по запросу.',
      head: ['Контейнер', 'Цена (Китай → Ташкент)'],
      c20: '20-футовый контейнер (≈ 33 м³, до 28 т)',
      c40: '40-футовый / 40 HC контейнер (≈ 67–76 м³, до 26 т)',
      note: 'Срок: ориентировочно {days} дней. В цену не входят перевозка внутри Китая, таможенное оформление и выгрузка в Ташкенте — считаем отдельно в запросе.',
    },
    rules: {
      title: 'Как считается цена: по кг или по м³?',
      formula: 'Объёмный вес',
      formulaLine: 'Объёмный вес (кг) = длина × ширина × высота (см) ÷ {truckDivisor} — авто; ÷ {airDivisor} — авиа. Расчётный вес — больший из фактического и объёмного.',
      density: 'Правило плотности',
      densityLine: 'Плотность (кг/м³) = вес ÷ объём. {threshold} кг/м³ и выше — по кг, ниже — по м³. 1 м³ в авто ≈ {kgPerM3} кг.',
      chargeable: 'Поэтому в калькулятор вводите не только вес, но и размеры — плотность решает, какое правило сработает.',
    },
    examples: {
      title: 'Три примера',
      intro: 'Все три расчёта сделаны по тем же таблицам и правилам, что и калькулятор.',
      items: [
        { title: 'Аксессуары для телефонов, авиа', input: '20 кг · 50 × 40 × 30 см · серия / коммерческий' },
        { title: 'Обувь, авто', input: '300 кг · 1,2 м³ · обычный товар' },
        { title: 'Игрушки, объёмный груз', input: '180 кг · 2 м³ · обычный товар' },
      ],
      inputLabel: 'Ввод',
      resultLabel: 'Результат',
    },
    inclusions: {
      title: 'Что входит в цену?',
      includedTitle: 'Входит',
      included: ['Приёмка, взвешивание и обмер на складе в Иу', 'Фотоотчёт в Telegram при каждой приёмке', 'Консолидация — один груз от нескольких поставщиков', 'Перевозка из Китая до склада в Ташкенте', 'Менеджер: сообщения о местоположении и статусе', 'Самовывоз со склада в Ташкенте или отправка в филиал региона'],
      extrasTitle: 'Дополнительные услуги',
      head: ['Услуга', 'Цена'],
      extras: { photo: 'Подробный фотоотчёт (каждое место)', repack: 'Переупаковка, уменьшение объёма', inspection: 'Пересчёт и проверка товара', insurance: 'Страховка', commission: 'Комиссия за поиск и выкуп товара', storageChina: 'Хранение на складе в Иу', storageTashkent: 'Хранение на складе в Ташкенте' },
      perReceipt: 'за приёмку',
      ofValue: 'от заявленной стоимости',
      daysFree: '{n} {days} бесплатно',
      excludedTitle: 'Оплачивается отдельно',
      excluded: ['Пошлина, НДС и таможенные сборы — по закону, в зависимости от кода ТН ВЭД; считаем заранее', 'Сам товар и доставка внутри Китая (от поставщика до склада в Иу)', 'Доставка до двери — ниже'],
    },
    regions: {
      title: 'Доставка в регионы',
      text: 'Самовывоз со склада в Ташкенте и отправка до филиала в регионе — бесплатно. Доставка до двери — {door} сум. По Ташкенту груз от {kg} кг до двери бесплатно.',
    },
    payment: {
      title: 'Как оплачивать?',
      paragraphs: [
        'Цена считается в долларах США, оплата — в сумах по расчётному курсу (сейчас 1 $ = {rate} сум, ориентировочно). Курс объявляется для каждой партии.',
        'Оплата — когда груз прибыл на склад в Ташкенте, перед выдачей. Наличные, карта Humo/Uzcard, Click или Payme; для юридических лиц — банковский перевод по договору и счёту-фактуре.',
        'Предоплата не требуется. После {free} дней хранения на складе в Ташкенте начисляется посуточная плата — срок согласуйте с менеджером.',
      ],
    },
    how: {
      title: 'Из чего складывается цена?',
      paragraphs: [
        'Стоимость карго состоит из трёх частей: сбор и приёмка на складе в Китае, транспорт по маршруту Китай — Хоргос — Ташкент и оформление в Ташкенте. В сборном грузе вы платите не за всю фуру, а только за своё место — поэтому цена за килограмм заметно ниже аренды контейнера.',
        'Место в фуре ограничено, поэтому лёгкий и объёмный груз считается не по килограммам, а по кубометрам. Граница — плотность {threshold} кг/м³: плотнее едет по тарифу за кг, легче — по тарифу за м³. Это общее правило рынка, и у нас оно открыто записано в таблице.',
        'Тарифы зависят от сезона: перед 11.11 и Новым годом партии уплотняются, на китайский Новый год (конец января — февраль) склады закрываются на две недели. Поэтому цены в таблицах ориентировочные и обновляются ежемесячно — дата стоит под каждой таблицей.',
        'Итоговая цена подтверждается после взвешивания и обмера на складе в Иу: фактический вес, объём и фотоотчёт приходят в Telegram, после чего закрывается счёт. Скрытых платежей нет — правило расчёта записано в договоре.',
      ],
    },
    calcTitle: 'Посчитайте свой груз',
    calcIntro: 'Введите вес, размеры и категорию — калькулятор считает по этим же таблицам и готовит сообщение в Telegram.',
    faq: {
      title: 'Вопросы о ценах',
      items: [
        { q: 'Сколько стоит 1 кг карго из Китая в Ташкент?', a: 'Авто (сборный груз) — от {truck}, авиа — от {air} по состоянию на {month}. В тяжёлых партиях килограмм дешевле, объёмный груз считается по м³.' },
        { q: 'Что такое объёмный вес и когда он применяется?', a: 'Объёмный вес = длина × ширина × высота (см) ÷ {truckDivisor} (авиа — ÷ {airDivisor}). Считается больший из фактического и объёмного. Например, коробка 60 × 50 × 40 см в авто считается как 20 кг — даже если внутри 8 кг.' },
        { q: 'По кг или по м³ — что дешевле?', a: 'Плотный груз (обувь, одежда, запчасти) дешевле по кг; лёгкий (игрушки, пластик, мебель) — по м³. Граница — {threshold} кг/м³: калькулятор сам считает плотность и показывает выгодное правило.' },
        { q: 'Есть ли минимальный вес?', a: 'Авиа — от {airMin} кг, авто — от 1 кг, объёмный груз — от {minM3} м³, контейнер — от 20 футов. Небольшие посылки тоже добавляем в сборный груз.' },
        { q: 'Входит ли в цену таможня?', a: 'Таможенное оформление берём на себя, документы готовим мы. Пошлина и НДС платятся отдельно по закону, в зависимости от кода ТН ВЭД — сумму считаем до отправки.' },
        { q: 'Сколько стоит страховка?', a: '{insurance}% от заявленной стоимости (ориентировочно). Ответственность за незастрахованный груз определяется договором.' },
        { q: 'Когда и как платить?', a: 'Когда груз прибыл на склад в Ташкенте, перед выдачей — в сумах по расчётному курсу. Наличные, карта, Click/Payme; для юрлиц — счёт-фактура. Предоплата не требуется.' },
        { q: 'Почему цена ориентировочная?', a: 'Потому что итоговые вес и объём известны после взвешивания на складе в Иу, а тарифы обновляются ежемесячно по сезону. Дата стоит под таблицей — {date}. Расчёт подтверждаем одним сообщением в Telegram.' },
      ],
    },
    cta: { eyebrow: 'Контакты', title: 'Точная цена — одно сообщение.', text: 'Напишите товар, город и примерный вес — менеджер подтвердит правило, тариф и срок.', draft: 'Здравствуйте! Хочу узнать стоимость доставки груза из Китая: ' },
    sources: 'Тарифы основаны на средних ценах рынка Ташкента по состоянию на {month}; точная цена подтверждается для каждой партии.',
  },
  calcPage: {
    seoTitle: 'Калькулятор карго — рассчитать стоимость доставки из Китая в Ташкент',
    seoDescription: 'Сколько стоит доставка груза из Китая в Ташкент? Введите вес, размеры и категорию — ориентировочная цена для авто, авиа и контейнера, правило, тариф и срок. Тарифы: {date}.',
    eyebrow: 'Калькулятор',
    h1: 'Сколько будет стоить груз из Китая?',
    intro: 'Введите вес, размеры и категорию товара — калькулятор считает ориентировочную цену для авто, авиа или ж/д по тарифам на {date}: применённое правило, тариф, сумму в долларах и сумах, срок. Авто — от {truck}/кг, авиа — от {air}/кг. Точная цена подтверждается после взвешивания на складе в Иу.',
    howTitle: 'Как считает калькулятор?',
    steps: [
      { title: 'Находит расчётный вес', text: 'Объёмный вес = длина × ширина × высота (см) ÷ {truckDivisor} (авиа — ÷ {airDivisor}). Берётся больший из фактического и объёмного.' },
      { title: 'Выбирает правило', text: 'Плотность {threshold} кг/м³ и выше — тариф за кг (ступенчатый), ниже — тариф за м³ (по диапазону плотности). Авиа — цена за кг по категории.' },
      { title: 'Считает сумму', text: 'Тариф × расчётный вес или объём. В долларах и сумах, со сроком {days} дней и готовым сообщением в Telegram.' },
    ],
    notesTitle: 'На что обратить внимание',
    notes: [
      'Товары с батареями, магниты и жидкости не принимаются на самолёт — калькулятор автоматически переводит их на тариф авто.',
      'Без объёма расчёт идёт только по весу. Для объёмного груза реальная цена по правилу м³ может отличаться.',
      'Результат ориентировочный. Пошлина, НДС, страховка и доставка до двери считаются отдельно.',
    ],
    ratesTitle: 'Полные тарифы',
    ratesText: 'Все таблицы, правила, примеры и условия оплаты — на странице цен.',
    ratesLink: 'Все тарифы',
    cta: { title: 'Подтвердим результат?', text: 'Отправьте расчёт в Telegram — менеджер подтвердит тариф и срок, а при необходимости предложит более выгодный способ доставки.', draft: 'Здравствуйте! Посчитал(а) в калькуляторе, подтвердите, пожалуйста, цену: ' },
  },
  teaser: {
    eyebrow: '05 — Цены',
    h2: 'Цена известна заранее.',
    rules: [
      'Объёмный вес: длина × ширина × высота (см) ÷ {truckDivisor} (авиа ÷ {airDivisor}).',
      'Плотность выше {threshold} кг/м³ — по кг, ниже — по м³.',
      'В цену входят приёмка на складе, обмер и фотоотчёт; страховка и таможенные платежи — отдельно.',
    ],
    example: 'Например: 48 кг, 0,2 м³ → 240 кг/м³ → считаем по кг.',
    allRates: 'Все тарифы',
    tiles: { truck: 'Авто карго (сборный груз)', air: 'Авиа карго', lcl: 'Объёмный груз (LCL)' },
    perKgFrom: '$/кг от',
    perM3From: '$/м³ от',
    cta: 'Рассчитать стоимость',
    ctaText: 'Введите вес и размеры — калькулятор сразу покажет правило, тариф и сумму.',
  },
};

const en: PricingStrings = {
  breakdown: {
    modes: { air: 'Air cargo', truck: 'Truck cargo (consolidated)', rail: 'Rail (container)' },
    categories: { standard: 'Standard goods', brand: 'Branded (original, boxed)', commercial: 'Commercial lot (3+ identical items)', battery: 'With batteries, electronics', liquid: 'Liquids, cosmetics, perfume' },
    rules: {
      'air-per-kg': 'Air · {category} · chargeable weight {kg} kg × {rate}',
      'truck-ladder': 'Density {density} kg/m³ ≥ {threshold} → per kg · {rate}',
      'truck-dense': 'Dense lot: {kg} kg at {density} kg/m³ ≥ {denseDensity} → {rate}',
      'truck-lcl': 'Density {density} kg/m³ < {threshold} → per m³ · {rate}',
      'rail-20ft': '20 ft container · {rate}, depending on route and season',
      'rail-40ft': '40 ft container · {rate}, depending on route and season',
    },
    notes: {
      'volumetric-applied': 'Volumetric weight ({volumetric} kg, ÷ {divisor}) exceeds the actual weight — priced on the volumetric figure.',
      'min-kg-applied': 'Minimum chargeable weight is {minKg} kg.',
      'min-m3-applied': 'Minimum volume is {minM3} m³.',
      'no-volume': 'No volume entered — priced on weight only. Bulky goods may switch to the per-m³ rule.',
      'switched-to-truck': '{category} cannot fly — the truck rate was applied.',
      'dense-lot': 'Dense wholesale lot — from {denseKg} kg, denser than {denseDensity} kg/m³.',
      range: 'Price range — the exact figure comes with a quote.',
    },
    units: { kg: 'kg', m3: 'm³', cm: 'cm', kgm3: 'kg/m³', perKg: '/kg', perM3: '/m³', days: 'days', container: 'container' },
    labels: { chargeable: 'Chargeable weight', density: 'Density', rule: 'Rule', rate: 'Rate', days: 'Transit', volumetric: 'Volumetric weight', volume: 'Volume', total: 'Estimate', totalSom: 'In UZS', range: 'Container' },
    approx: 'roughly',
    containers: { '20ft': '20 ft', '40ft': '40 ft' },
  },
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthYear: '{month} {year}',
  calc: {
    title: 'Estimate the price',
    lead: 'Enter weight and size — the rule, rate and estimate appear instantly.',
    modeLabel: 'Mode',
    modes: { air: 'Air', truck: 'Truck', rail: 'Rail' },
    weight: 'Weight',
    weightHint: 'Actual weight, kg',
    volumeLabel: 'Volume',
    volumeModes: { dims: 'Dimensions, cm', m3: 'Volume, m³' },
    dims: { l: 'Length', w: 'Width', h: 'Height' },
    m3: 'Volume',
    volumeHint: 'Optional — but bulky cargo is priced per m³.',
    category: 'Goods category',
    categoryHint: 'Goods with batteries and liquids travel by truck only.',
    container: 'Container',
    submit: 'Calculate',
    resultLabel: 'Estimate',
    resultEmpty: 'Enter a weight — the price appears here.',
    ruleLabel: 'Rule applied',
    switchNote: 'This category cannot fly — the calculator switched to the truck rate.',
    kursNote: 'Settlement rate: $1 = {rate} UZS (indicative).',
    finalNote: 'The final price is confirmed after weighing and measuring at the Yiwu warehouse.',
    confirm: 'Confirm on Telegram',
    draftPreview: 'Message text',
    draft: 'Hello! Could you confirm the calculator estimate? {mode}, {kg} kg, {volume}, category: {category}. Estimate: {total}.',
    draftRail: 'Hello! I would like to confirm a container price: {container} container, China → Tashkent. Indicative range on the site: {total}.',
    draftNoVolume: 'volume not known yet',
    allRates: 'All rates',
    noJsText: 'Live calculation needs JavaScript in your browser. The rate tables and rules on the pricing page let you work it out by hand.',
    noJsLink: 'Go to the rate tables',
    inputsLabel: 'Cargo details',
  },
  page: {
    seoTitle: 'China to Tashkent cargo rates 2026 — how much is 1 kg?',
    seoDescription: 'Cargo from China to Tashkent: consolidated truck from {truck}/kg, air from {air}/kg, bulky cargo from {lcl}/m³. Volumetric weight, the density rule, what the price includes, payment. Updated {date}.',
    eyebrow: 'Pricing — {month}',
    h1: 'China to Tashkent cargo rates 2026',
    intro: 'Cargo from China to Tashkent costs from {truck} per kg by consolidated truck and from {air} per kg by air ({month}). Light, bulky cargo is priced per m³ from {lcl}: below {threshold} kg/m³ we bill by volume, above it by weight. The price includes receiving at the Yiwu warehouse, measuring, consolidation and delivery to the Tashkent warehouse; duty, VAT and insurance are separate.',
    tiles: { truck: 'Truck cargo (consolidated)', air: 'Air cargo', lcl: 'Bulky cargo (LCL)', rail: '20 ft container', fromKg: '/kg', fromM3: '/m³', fromContainer: '' },
    truck: {
      title: 'Truck cargo (consolidated) — how much per kg?',
      intro: 'Truck cargo is consolidated at the China warehouse and travels by truck through Khorgos to Tashkent. The rate steps down with chargeable weight: the heavier the lot, the cheaper each kilogram.',
      head: ['Chargeable weight', 'Price per kg'],
      upTo: 'up to {b} kg',
      between: '{a}–{b} kg',
      from: 'from {a} kg',
      dense: 'Dense wholesale lot — from {kg} kg, denser than {density} kg/m³ (clothing bales, footwear, spare parts)',
      note: 'Chargeable weight is the greater of actual and volumetric weight. Volumetric weight: length × width × height (cm) ÷ {divisor}.',
      days: 'Transit: roughly {days} days after departure from the Yiwu warehouse; express batches {express} days.',
    },
    lcl: {
      title: 'Bulky cargo — how much per m³?',
      intro: 'Toys, plastic tableware, furniture, artificial flowers — light cargo that gets expensive per kilogram. Cargo below {threshold} kg/m³ is therefore priced per m³: the lower the density, the cheaper the cubic metre.',
      head: ['Density', 'Price per m³'],
      upTo: 'up to {b} kg/m³',
      between: '{a}–{b} kg/m³',
      from: 'from {a} kg/m³',
      note: 'Density = weight ÷ volume. Minimum volume {minM3} m³. Volume of a piece: length × width × height (m).',
    },
    air: {
      title: 'Air cargo — how much per kg?',
      intro: 'Air is for urgent, light and high-value goods: phone accessories, clothing samples, small electronics. The rate depends on the goods category; chargeable weight follows the ÷ {divisor} rule.',
      head: ['Goods category', 'Price per kg'],
      rows: { standard: 'Standard goods (everyday items, clothing, accessories)', brand: 'Branded (original, boxed)', commercial: 'Commercial lot (3+ identical items, electronics)', battery: 'Goods with batteries (power banks, cells)', liquid: 'Liquids, cosmetics, perfume' },
      truckOnly: 'truck only',
      note: 'Minimum chargeable weight {minKg} kg. Transit roughly {days} days after the flight. Batteries, magnets and liquids are not accepted on aircraft — they go by truck.',
    },
    rail: {
      title: 'Rail and container rates',
      intro: 'For large lots — a full container (FCL) or space in one (LCL). Prices are given as a range depending on route, season and cargo type; the exact figure comes with a quote.',
      head: ['Container', 'Price (China → Tashkent)'],
      c20: '20 ft container (≈ 33 m³, up to 28 t)',
      c40: '40 ft / 40 HC container (≈ 67–76 m³, up to 26 t)',
      note: 'Transit roughly {days} days. The price excludes trucking inside China, customs clearance and unloading in Tashkent — quoted separately.',
    },
    rules: {
      title: 'How is the price calculated: per kg or per m³?',
      formula: 'Volumetric weight',
      formulaLine: 'Volumetric weight (kg) = length × width × height (cm) ÷ {truckDivisor} for truck, ÷ {airDivisor} for air. Chargeable weight is the greater of actual and volumetric.',
      density: 'The density rule',
      densityLine: 'Density (kg/m³) = weight ÷ volume. {threshold} kg/m³ and above is billed per kg, below it per m³. One m³ by truck equals roughly {kgPerM3} kg.',
      chargeable: 'So enter dimensions along with the weight — density decides which rule applies.',
    },
    examples: {
      title: 'Three worked examples',
      intro: 'All three use exactly the tables and rules the calculator runs on.',
      items: [
        { title: 'Phone accessories by air', input: '20 kg · 50 × 40 × 30 cm · commercial lot' },
        { title: 'Footwear by truck', input: '300 kg · 1.2 m³ · standard goods' },
        { title: 'Toys, bulky cargo', input: '180 kg · 2 m³ · standard goods' },
      ],
      inputLabel: 'Input',
      resultLabel: 'Result',
    },
    inclusions: {
      title: 'What does the price include?',
      includedTitle: 'Included',
      included: ['Receiving, weighing and measuring at the Yiwu warehouse', 'A photo report to Telegram at every receipt', 'Consolidation — one shipment from several suppliers', 'Transport from China to the Tashkent warehouse', 'A manager who reports location and status', 'Collection at the Tashkent warehouse or forwarding to a regional branch'],
      extrasTitle: 'Extra services',
      head: ['Service', 'Price'],
      extras: { photo: 'Detailed photo report (per piece)', repack: 'Repacking to reduce volume', inspection: 'Counting and inspecting goods', insurance: 'Insurance', commission: 'Sourcing and buying commission', storageChina: 'Storage at the Yiwu warehouse', storageTashkent: 'Storage at the Tashkent warehouse' },
      perReceipt: 'per receipt',
      ofValue: 'of declared value',
      daysFree: '{n} {days} free',
      excludedTitle: 'Paid separately',
      excluded: ['Duty, VAT and customs fees — by law, according to the HS code; we calculate them in advance', 'The goods themselves and domestic delivery in China (supplier to the Yiwu warehouse)', 'Door delivery — see below'],
    },
    regions: {
      title: 'Delivery to the regions',
      text: 'Collection at the Tashkent warehouse and forwarding to a regional branch are free. Door delivery costs {door} UZS. In Tashkent, cargo over {kg} kg is delivered to the door free of charge.',
    },
    payment: {
      title: 'How do I pay?',
      paragraphs: [
        'Prices are calculated in US dollars and paid in UZS at the settlement rate (currently $1 = {rate} UZS, indicative). The rate is announced for each batch.',
        'Payment is due when the cargo reaches the Tashkent warehouse, before release. Cash, Humo/Uzcard card, Click or Payme; legal entities pay by bank transfer against a contract and invoice.',
        'No prepayment is required. After {free} days at the Tashkent warehouse a daily storage fee applies — agree the timing with your manager.',
      ],
    },
    how: {
      title: 'What makes up the price?',
      paragraphs: [
        'A cargo rate has three parts: collection and receiving at the China warehouse, transport along the China — Khorgos — Tashkent route, and clearance in Tashkent. With consolidated cargo you pay for your space only, not the whole truck — which is why the per-kilogram price sits well below container hire.',
        'Space in a truck is limited, so light, bulky cargo is billed by the cubic metre rather than the kilogram. The line is {threshold} kg/m³: denser cargo goes at the per-kg rate, lighter cargo at the per-m³ rate. This is the market’s common rule, and ours is written openly in the table.',
        'Rates follow the season: batches fill up before 11.11 and New Year, and warehouses close for two weeks over Chinese New Year (late January to February). That is why the table prices are estimates, updated monthly — the date sits under every table.',
        'The final price is confirmed once the cargo is weighed and measured in Yiwu: actual weight, volume and the photo report arrive in Telegram, and the invoice is settled on that basis. No hidden charges — the pricing rule is written into the contract.',
      ],
    },
    calcTitle: 'Estimate your own cargo',
    calcIntro: 'Enter weight, size and category — the calculator runs on these same tables and drafts a Telegram message for you.',
    faq: {
      title: 'Pricing questions',
      items: [
        { q: 'How much is 1 kg of cargo from China to Tashkent?', a: 'Consolidated truck from {truck}, air from {air}, as of {month}. Heavier lots cost less per kilogram, and bulky cargo is priced per m³.' },
        { q: 'What is volumetric weight and when does it apply?', a: 'Volumetric weight = length × width × height (cm) ÷ {truckDivisor} (air ÷ {airDivisor}). The greater of actual and volumetric weight is charged. A 60 × 50 × 40 cm box counts as 20 kg by truck even if it holds 8 kg.' },
        { q: 'Per kg or per m³ — which is cheaper?', a: 'Dense cargo (footwear, clothing, spare parts) is cheaper per kg; light cargo (toys, plastics, furniture) per m³. The line is {threshold} kg/m³ — the calculator works out the density and shows the cheaper rule.' },
        { q: 'Is there a minimum weight?', a: 'Air from {airMin} kg, truck from 1 kg, bulky cargo from {minM3} m³, containers from 20 ft. Small parcels join the consolidated load too.' },
        { q: 'Is customs included in the price?', a: 'Customs clearance is on us — we prepare the documents. Duty and VAT are paid separately by law, according to the HS code, and we calculate the amount before shipping.' },
        { q: 'How much is insurance?', a: '{insurance}% of the declared value (indicative). Liability for uninsured cargo is set out in the contract.' },
        { q: 'When and how do I pay?', a: 'When the cargo reaches the Tashkent warehouse, before release — in UZS at the settlement rate. Cash, card, Click/Payme; invoice for legal entities. No prepayment required.' },
        { q: 'Why is the price an estimate?', a: 'Because the final weight and volume are known after weighing in Yiwu, and rates are updated monthly with the season. The date sits under the table — {date}. We confirm the figure with one Telegram message.' },
      ],
    },
    cta: { eyebrow: 'Contact', title: 'An exact price is one message away.', text: 'Tell us the goods, the city and the approximate weight — your manager confirms the rule, the rate and the transit time.', draft: 'Hello! I would like a shipping quote for cargo from China: ' },
    sources: 'Rates are based on median Tashkent market prices as of {month}; the exact price is confirmed for each batch.',
  },
  calcPage: {
    seoTitle: 'Cargo calculator — estimate China to Tashkent shipping',
    seoDescription: 'How much does shipping from China to Tashkent cost? Enter weight, size and category for an estimate by truck, air or container, with the rule, rate and transit time. Rates as of {date}.',
    eyebrow: 'Calculator',
    h1: 'How much will my cargo from China cost?',
    intro: 'Enter weight, dimensions and goods category — the calculator estimates the price by truck, air or rail on the {date} rates: the rule applied, the rate, the total in USD and UZS, and the transit time. Truck from {truck}/kg, air from {air}/kg. The exact price is confirmed after weighing at the Yiwu warehouse.',
    howTitle: 'How does the calculator work?',
    steps: [
      { title: 'Finds the chargeable weight', text: 'Volumetric weight = length × width × height (cm) ÷ {truckDivisor} (air ÷ {airDivisor}). The greater of actual and volumetric weight is used.' },
      { title: 'Picks the rule', text: 'Density {threshold} kg/m³ and above — the stepped per-kg rate; below — the per-m³ rate by density band. Air — a per-kg rate by category.' },
      { title: 'Works out the total', text: 'Rate × chargeable weight or volume. In USD and UZS, with a {days}-day transit and a ready Telegram message.' },
    ],
    notesTitle: 'Things to keep in mind',
    notes: [
      'Goods with batteries, magnets and liquids are not accepted on aircraft — the calculator switches them to the truck rate automatically.',
      'Without a volume the estimate is weight-only. Bulky cargo may be priced differently under the per-m³ rule.',
      'The result is an estimate. Duty, VAT, insurance and door delivery are priced separately.',
    ],
    ratesTitle: 'Full rate tables',
    ratesText: 'Every table, rule, worked example and payment term is on the pricing page.',
    ratesLink: 'All rates',
    cta: { title: 'Shall we confirm the figure?', text: 'Send the estimate to Telegram — your manager confirms the rate and transit time, and suggests a cheaper mode if there is one.', draft: 'Hello! I used the calculator — could you confirm the price? ' },
  },
  teaser: {
    eyebrow: '05 — Pricing',
    h2: 'Know the price before you ship.',
    rules: [
      'Volumetric weight: length × width × height (cm) ÷ {truckDivisor} (air ÷ {airDivisor}).',
      'Density above {threshold} kg/m³ is billed per kg, below it per m³.',
      'The price includes warehouse receiving, measuring and the photo report; insurance and customs payments are separate.',
    ],
    example: 'Example: 48 kg, 0.2 m³ → 240 kg/m³ → priced per kg.',
    allRates: 'All rates',
    tiles: { truck: 'Truck cargo (consolidated)', air: 'Air cargo', lcl: 'Bulky cargo (LCL)' },
    perKgFrom: '$/kg from',
    perM3From: '$/m³ from',
    cta: 'Estimate the price',
    ctaText: 'Enter weight and size — the calculator shows the rule, rate and total straight away.',
  },
};

export const pricingStrings: Record<Lang, PricingStrings> = { uz, ru, en };

/** Replace {slots} in a template. */
export function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** "2026-yil sentabr" / "сентябрь 2026" / "September 2026" from an ISO date. */
export function monthYear(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const t = pricingStrings[lang];
  return tpl(t.monthYear, { month: t.months[d.getUTCMonth()], year: d.getUTCFullYear() });
}
