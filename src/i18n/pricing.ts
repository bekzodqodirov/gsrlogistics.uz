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
    overLimit: string;
    needVolume: string;
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
    truck: { title: string; intro: string; head: [string, string]; note: string; days: string };
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
      'truck-lcl': 'Zichlik {density} kg/m³ → {m3} m³ × {rate}',
      'truck-per-kg': 'Zichlik {density} kg/m³ ≥ {perKgDensity} → kg boʻyicha · {rate}',
      'rail-20ft': '20 futlik konteyner · {rate}, yoʻnalish va mavsumga qarab',
      'rail-40ft': '40 futlik konteyner · {rate}, yoʻnalish va mavsumga qarab',
    },
    notes: {
      'volumetric-applied': 'Hajmiy vazn ({volumetric} kg, ÷ {divisor}) haqiqiy vazndan katta — hisob hajmiy vazn boʻyicha.',
      'min-kg-applied': 'Minimal hisob vazni — {minKg} kg.',
      'min-m3-applied': 'Minimal hajm — {minM3} m³.',
      'no-volume': 'Hajm kiritilmagan — avia hisobi faqat vazn boʻyicha.',
      'switched-to-truck': '{category} avia bilan joʻnatilmaydi — avto tarifi qoʻllandi.',
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
    volumeHint: 'Avto kargo uchun majburiy, avia uchun ixtiyoriy.',
    category: 'Tovar toifasi',
    categoryHint: 'Batareyali va suyuq tovarlar faqat avto bilan yuriladi.',
    container: 'Konteyner',
    submit: 'Hisoblash',
    resultLabel: 'Taxminiy narx',
    resultEmpty: 'Vaznni kiriting — narx shu yerda chiqadi.',
    overLimit: 'Bunday hajmdagi yuk uchun kalkulyator narx bermaydi — konteyner yoki charter shartlari alohida hisoblanadi. Telegramda yozing, aniq narxni beramiz.',
    needVolume: 'Avto kargo narxi hajm boʻyicha hisoblanadi: oʻlchamlarni yoki m³ ni ham kiriting. Faqat vazn bilan aviani hisoblash mumkin.',
    ruleLabel: 'Qoʻllangan qoida',
    switchNote: 'Bu toifa avia bilan joʻnatilmaydi — kalkulyator avto tarifiga oʻtdi.',
    kursNote: 'Hisob-kitob kursi: 1 $ = {rate} soʻm (taxminiy).',
    finalNote: 'Yakuniy narx Xitoy omborida tortib-oʻlchangandan keyin tasdiqlanadi.',
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
    seoTitle: 'Xitoydan Toshkentga kargo narxlari 2026 — 1 m³ necha pul?',
    seoDescription: 'Xitoydan Toshkentga kargo: avto (yigʻma yuk) {truck}/m³ dan — narxni yuk zichligi belgilaydi; avia {air}/kg dan. Zichlik jadvali, narxga nimalar kirishi, toʻlov. Yangilangan: {date}.',
    eyebrow: 'Narxlar — {month}',
    h1: 'Xitoydan Toshkentga kargo narxlari 2026',
    intro: 'Xitoydan Toshkentga avto kargo (yigʻma yuk) hajm boʻyicha hisoblanadi — {truck}/m³ dan ({month}). Jadvaldagi bandni yuk zichligi (vazn ÷ hajm) tanlaydi: yuk qancha yengil boʻlsa, 1 m³ shuncha arzon. Avia esa kilogramm boʻyicha — {air}/kg dan. Narxga Xitoy omborida qabul, oʻlchash, konsolidatsiya va Toshkent omborigacha yetkazish kiradi; boj, QQS va sugʻurta — alohida.',
    tiles: { truck: 'Avto kargo (yigʻma yuk)', air: 'Avia kargo', lcl: 'Zich yuk', rail: 'Konteyner 20 fut', fromKg: '$/kg dan', fromM3: '$/m³ dan', fromContainer: '$ dan' },
    truck: {
      title: 'Avto kargo (yigʻma yuk) — 1 m³ necha pul?',
      intro: 'Avto kargo — Xitoydagi omborda yigʻiladigan, fura bilan Xorgos orqali Toshkentga keladigan yuk. Narx hajm boʻyicha: zichlik (vazn ÷ hajm) jadvaldagi bandni tanlaydi — yuk qancha zich boʻlsa, 1 m³ shuncha qimmat, ammo 1 kg shuncha arzon.',
      head: ['Zichlik', 'Narx'],
      note: 'Zichlik = vazn (kg) ÷ hajm (m³). Masalan, 2 m³ da 180 kg — 90 kg/m³, yaʼni jadvalning birinchi qatori: 2 × 110 $ = 220 $. Bir joyning hajmi: uzunlik × en × balandlik (metrda).',
      days: 'Muddat: taxminan {days} kun, yuk Xitoy omboridan joʻnatilgandan keyin; ekspress partiyalar {express} kun.',
    },
    lcl: {
      title: 'Zichlik jadvali — 1 m³ narxi',
      intro: 'Jadvalning har bir qatori — zichlik oraligʻi: zichlik qancha past boʻlsa, 1 m³ shuncha arzon. Zichligi {threshold} kg/m³ dan yuqori — suvdan ogʻir — yuk esa kilogramm boʻyicha hisoblanadi.',
      head: ['Zichlik', 'Narx'],
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
      note: 'Minimal hisob vazni — {minKg} kg. Muddat: taxminan {days} kun — yuk Xitoy omboridan joʻnatilgandan hisoblanadi. Batareya, magnit va suyuqlik samolyotga olinmaydi — ular avto bilan yuradi.',
    },
    rail: {
      title: 'Temir yoʻl va konteyner narxlari',
      intro: 'Katta partiyalar uchun — butun konteyner (FCL) yoki konteynerdagi joy (LCL). Narx yoʻnalish, mavsum va yuk turiga qarab oraliqda beriladi; aniq summa — soʻrov boʻyicha.',
      head: ['Konteyner', 'Narx (Xitoy → Toshkent)'],
      c20: '20 futlik konteyner (≈ 33 m³, 20 t gacha)',
      c40: '40 futlik / 40 HC konteyner (≈ 67–76 m³, 26 t gacha)',
      note: 'Muddat: taxminan {days} kun. Konteyner Xitoy ichidagi tashish, bojxona rasmiylashtiruvi va Toshkentda tushirishni oʻz ichiga olmaydi — soʻrovda alohida hisoblaymiz.',
    },
    rules: {
      title: 'Narx qanday hisoblanadi?',
      formula: 'Hajmiy vazn (avia)',
      formulaLine: 'Avia narxi hisoblangan vazn boʻyicha: hajmiy vazn (kg) = uzunlik × en × balandlik (sm) ÷ {airDivisor}, haqiqiy va hajmiy vazndan kattasi olinadi. Avto kargoda bu qoida yoʻq — u yerda haqiqiy hajm (m³) hisoblanadi.',
      density: 'Zichlik qoidasi (avto)',
      densityLine: 'Zichlik (kg/m³) = vazn ÷ hajm. U jadvaldagi bandni tanlaydi: zichlik qancha past boʻlsa, 1 m³ shuncha arzon. Zichligi {threshold} kg/m³ dan yuqori yuk esa kilogramm boʻyicha — {denseRate}/kg. Minimal hisob hajmi — {minM3} m³.',
      chargeable: 'Shuning uchun avto kargoda faqat vazn yetarli emas: kalkulyatorga oʻlchamlarni yoki m³ ni ham kiriting — zichliksiz narx chiqmaydi.',
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
      included: ['Xitoy omborida qabul, tortish va oʻlchash', 'Har qabulda foto-hisobot Telegramga', 'Konsolidatsiya — bir necha yetkazib beruvchidan bitta yuk', 'Xitoydan Toshkent omborigacha tashish', 'Menejer: joylashuv va holat haqida xabar', 'Toshkent omboridan olib ketish yoki viloyatga joʻnatish (shartlari kelishiladi)'],
      extrasTitle: 'Qoʻshimcha xizmatlar',
      head: ['Xizmat', 'Narx'],
      extras: { photo: 'Batafsil foto-hisobot (har bir joy)', repack: 'Qayta qadoqlash, hajmni kamaytirish', inspection: 'Tovarni sanash va tekshirish', insurance: 'Sugʻurta', commission: 'Tovar topish va sotib olish komissiyasi', storageChina: 'Xitoy omborida saqlash', storageTashkent: 'Toshkent omborida saqlash' },
      perReceipt: 'har qabulda',
      ofValue: 'eʼlon qilingan qiymatning {n}%',
      daysFree: '{n} {days} bepul',
      excludedTitle: 'Alohida toʻlanadi',
      excluded: ['Boj, QQS va bojxona yigʻimlari — qonun boʻyicha, TN VED kodiga qarab; oldindan hisoblab beramiz', 'Tovarning oʻzi va Xitoy ichidagi yetkazib berish (yetkazib beruvchidan qabul manziligacha)', 'Uygacha yetkazish — quyida'],
    },
    regions: {
      title: 'Viloyatlarga yetkazish',
      text: 'Toshkent omboridan olib ketish — bepul. Viloyatga joʻnatish shartlarini menejer aytadi. Uygacha yetkazish — {door} soʻm. Toshkent shahrida {kg} kg dan ortiq yuk uygacha bepul.',
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
        'Kargo narxi uchta narsadan tuziladi: Xitoy ichidagi yigʻish va omborga qabul, Xitoy — Xorgos — Toshkent yoʻlidagi transport va Toshkentdagi rasmiylashtiruv. Yigʻma yukda siz butun fura uchun emas, faqat oʻzingiz egallagan kub metr uchun toʻlaysiz — shuning uchun kichik partiya konteyner ijarasidan ancha arzon tushadi.',
        'Furada sotiladigan narsa — kub metr, va joy chegaralangan. Shuning uchun narxni zichlik belgilaydi: yengil yuk kam vaznda koʻp joy egallaydi, shuning uchun uning kub metri arzonroq; yuk zichlashgani sari 1 m³ qimmatlashadi, lekin 1 kg arzonlashadi. Zichligi {threshold} kg/m³ dan yuqori — suvdan ogʻir — yuk furaning hajmini emas, tonnajini toʻldiradi, shuning uchun u kilogramm boʻyicha, {denseRate}/kg hisoblanadi. Jadval sahifada ochiq turibdi.',
        'Tariflar mavsumga bogʻliq: 11.11 va Yangi yil oldi partiyalar zichlashadi, Xitoy Yangi yili (yanvar oxiri — fevral) omborlar ikki hafta yopiladi. Shu sababli jadvaldagi narxlar taxminiy va har oy yangilanadi — sana har jadval ostida turadi.',
        'Yakuniy narx Xitoy omborida yuk tortib-oʻlchangandan keyin tasdiqlanadi: haqiqiy vazn, hajm va foto-hisobot Telegramga keladi, shundan keyin hisob yopiladi. Yashirin toʻlovlar yoʻq — shartnomada narx qoidasi yozilgan.',
      ],
    },
    calcTitle: 'Oʻz yukingiz uchun hisoblang',
    calcIntro: 'Vazn, oʻlcham va toifani kiriting — kalkulyator shu jadvallar boʻyicha hisoblaydi va Telegramga tayyor xabar tuzadi.',
    faq: {
      title: 'Narxlar boʻyicha savollar',
      items: [
        { q: 'Xitoydan Toshkentga 1 kg kargo necha pul?', a: 'Avto kargoda 1 kg narxi yoʻq: yigʻma yuk hajm boʻyicha sotiladi — {truck}/m³ dan, bandni zichlik tanlaydi ({month}). Masalan, 1,2 m³ da 300 kg — zichlik 250 kg/m³, jami 216 $. Avia esa kilogramm boʻyicha — {air}/kg dan.' },
        { q: 'Hajmiy vazn nima va u qachon hisoblanadi?', a: 'Hajmiy vazn faqat aviada ishlaydi: uzunlik × en × balandlik (sm) ÷ {airDivisor}, soʻng haqiqiy va hajmiy vazndan kattasi olinadi — 60 × 50 × 40 sm quti aviada 24 kg deb hisoblanadi, ichida 8 kg boʻlsa ham. Avto kargoda hajmiy vazn hisoblanmaydi: shu qutining haqiqiy hajmi 0,12 m³, ichida 8 kg boʻlsa zichlik 67 kg/m³ — 110 $/m³ bandi, yaʼni 13,2 $.' },
        { q: 'Zich yuk arzonmi yoki hajmli yuk?', a: 'Ikkalasi ham bitta jadvalda. Zichlik qancha past boʻlsa, 1 m³ shuncha arzon; zich yukda 1 m³ qimmatroq, lekin oʻsha hajmda vazn koʻp yuradi, shuning uchun 1 kg arzonroq tushadi. Zichligi {threshold} kg/m³ dan yuqori yuk — masalan metall yoki plitka — kilogramm boʻyicha, {denseRate}/kg. Kalkulyator zichlikni oʻzi hisoblab, qaysi qator ishlaganini koʻrsatadi.' },
        { q: 'Minimal vazn yoki hajm bormi?', a: 'Avto kargoda minimal hisob hajmi — {minM3} m³: undan kichik joyni ham olamiz, lekin hisob {minM3} m³ dan boshlanadi. Avia — {airMin} kg dan, konteyner — 20 futdan. Kichik posilkalarni ham yigʻma yukka qoʻshamiz.' },
        { q: 'Narxga bojxona kiradimi?', a: 'Bojxona rasmiylashtiruvi — bizning zimmamizda, hujjatlarni biz tayyorlaymiz. Boj va QQS esa qonun boʻyicha, TN VED kodiga qarab alohida toʻlanadi — summani joʻnatishdan oldin hisoblab beramiz.' },
        { q: 'Sugʻurta qancha turadi?', a: 'Eʼlon qilingan qiymatning {insurance}% (taxminiy). Sugʻurtasiz yuk uchun javobgarlik shartnomada belgilanadi.' },
        { q: 'Toʻlovni qachon va qanday qilaman?', a: 'Yuk Toshkent omboriga kelganda, olishdan oldin — soʻmda, hisob-kitob kursi boʻyicha. Naqd, karta, Click/Payme; yuridik shaxslar uchun hisob-faktura. Oldindan toʻlov shart emas.' },
        { q: 'Narx nega taxminiy?', a: 'Chunki yakuniy vazn va hajm Xitoy omborida tortilgandan keyin aniq boʻladi, tariflar esa mavsumga qarab har oy yangilanadi. Sana jadval ostida — {date}. Hisobni Telegramda bir xabar bilan tasdiqlaymiz.' },
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
    intro: 'Vazn, oʻlcham va tovar toifasini kiriting — kalkulyator avto, avia yoki temir yoʻl uchun taxminiy narxni {date} tariflari boʻyicha hisoblaydi: qoʻllangan qoida, tarif, dollar va soʻmdagi summa, muddat. Avto — {truck}/m³ dan, zichlikka qarab; avia — {air}/kg dan. Aniq narx Xitoy omborida tortilgandan keyin tasdiqlanadi.',
    howTitle: 'Kalkulyator qanday hisoblaydi?',
    steps: [
      { title: 'Hajm va zichlikni topadi', text: 'Hajm = uzunlik × en × balandlik (m) yoki siz kiritgan m³. Zichlik = vazn ÷ hajm. Aviada esa hajmiy vazn = uzunlik × en × balandlik (sm) ÷ {airDivisor}, u haqiqiy vazn bilan solishtiriladi.' },
      { title: 'Qoidani tanlaydi', text: 'Avto: zichlik jadvaldagi bandni tanlaydi, summa — m³ × band tarifi; zichligi {threshold} kg/m³ dan yuqori yuk {denseRate}/kg. Avia — toifa boʻyicha 1 kg narxi.' },
      { title: 'Summani chiqaradi', text: 'Tarif × hajm yoki hisoblangan vazn. Dollar va soʻmda, {days} kun muddat bilan, Telegramga tayyor xabar bilan.' },
    ],
    notesTitle: 'Nimalarga eʼtibor bering',
    notes: [
      'Batareyali tovarlar, magnit va suyuqlik samolyotga olinmaydi — kalkulyator ularni avtomatik avto tarifiga oʻtkazadi.',
      'Avto kargo hajmsiz hisoblanmaydi — oʻlchamlarni yoki m³ ni kiriting; faqat vazn bilan aviani hisoblash mumkin.',
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
      'Avto kargo — m³ boʻyicha: zichlik (vazn ÷ hajm) 1 m³ narxini tanlaydi; {threshold} kg/m³ dan zich yuk kg boʻyicha.',
      'Avia — kg boʻyicha: hajmiy vazn = uzunlik × en × balandlik (sm) ÷ {airDivisor}, haqiqiy vazn bilan solishtiriladi.',
      'Narxga ombor qabuli, oʻlchash va foto-hisobot kiradi; sugʻurta va bojxona toʻlovlari — alohida.',
    ],
    example: 'Masalan: 48 kg, 0,2 m³ → 240 kg/m³ → 0,2 × 180 $ = 36 $.',
    allRates: 'Barcha tariflar',
    tiles: { truck: 'Avto kargo (yigʻma yuk)', air: 'Avia kargo', lcl: 'Zich yuk' },
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
      'truck-lcl': 'Плотность {density} кг/м³ → {m3} м³ × {rate}',
      'truck-per-kg': 'Плотность {density} кг/м³ ≥ {perKgDensity} → по кг · {rate}',
      'rail-20ft': '20-футовый контейнер · {rate}, зависит от маршрута и сезона',
      'rail-40ft': '40-футовый контейнер · {rate}, зависит от маршрута и сезона',
    },
    notes: {
      'volumetric-applied': 'Объёмный вес ({volumetric} кг, ÷ {divisor}) больше фактического — считаем по объёмному.',
      'min-kg-applied': 'Минимальный расчётный вес — {minKg} кг.',
      'min-m3-applied': 'Минимальный объём — {minM3} м³.',
      'no-volume': 'Объём не указан — авиарасчёт только по весу.',
      'switched-to-truck': '{category} авиа не отправляется — применён тариф авто.',
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
    volumeHint: 'Для авто обязательно, для авиа — по желанию.',
    category: 'Категория товара',
    categoryHint: 'Товары с батареями и жидкости едут только авто.',
    container: 'Контейнер',
    submit: 'Рассчитать',
    resultLabel: 'Ориентировочная цена',
    resultEmpty: 'Введите вес — цена появится здесь.',
    overLimit: 'Для такого объёма калькулятор цену не даёт — контейнер или чартер считаются отдельно. Напишите в Telegram, посчитаем точно.',
    needVolume: 'Авто карго считается по объёму: укажите ещё габариты или м³. Только по весу можно посчитать авиа.',
    ruleLabel: 'Применённое правило',
    switchNote: 'Эта категория не летит авиа — калькулятор перешёл на тариф авто.',
    kursNote: 'Расчётный курс: 1 $ = {rate} сум (ориентировочно).',
    finalNote: 'Итоговая цена подтверждается после взвешивания и обмера на складе в Китае.',
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
    seoTitle: 'Цены на карго из Китая в Ташкент 2026 — сколько стоит 1 м³?',
    seoDescription: 'Карго из Китая в Ташкент: авто (сборный груз) от {truck}/м³ — цену определяет плотность груза; авиа от {air}/кг. Таблица плотности, что входит в цену, оплата. Обновлено: {date}.',
    eyebrow: 'Цены — {month}',
    h1: 'Цены на карго из Китая в Ташкент 2026',
    intro: 'Авто карго (сборный груз) из Китая в Ташкент считается по объёму — от {truck}/м³ ({month}). Строку тарифа выбирает плотность груза (вес ÷ объём): чем легче груз, тем дешевле кубометр. Авиа считается по килограммам — от {air}/кг. В цену входят приёмка на складе в Китае, обмер, консолидация и доставка до склада в Ташкенте; пошлина, НДС и страховка — отдельно.',
    tiles: { truck: 'Авто карго (сборный груз)', air: 'Авиа карго', lcl: 'Плотный груз', rail: 'Контейнер 20 футов', fromKg: '$/кг', fromM3: '$/м³', fromContainer: '$' },
    truck: {
      title: 'Авто карго (сборный груз) — сколько стоит 1 м³?',
      intro: 'Авто карго — груз, который собирается на складе в Китае и едет фурой через Хоргос в Ташкент. Цена считается по объёму: плотность (вес ÷ объём) выбирает строку тарифа — чем плотнее груз, тем дороже кубометр, но тем дешевле килограмм.',
      head: ['Плотность', 'Цена'],
      note: 'Плотность = вес (кг) ÷ объём (м³). Например, 180 кг в 2 м³ — это 90 кг/м³, первая строка таблицы: 2 × 110 $ = 220 $. Объём места: длина × ширина × высота (в метрах).',
      days: 'Срок: ориентировочно {days} дней после отправки со склада в Китае; экспресс-партии — {express} дней.',
    },
    lcl: {
      title: 'Таблица плотности — цена за 1 м³',
      intro: 'Каждая строка сборного тарифа — это диапазон плотности: чем ниже плотность, тем дешевле кубометр. Груз плотнее {threshold} кг/м³ — тяжелее воды — считается по килограммам.',
      head: ['Плотность', 'Цена'],
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
      c20: '20-футовый контейнер (≈ 33 м³, до 20 т)',
      c40: '40-футовый / 40 HC контейнер (≈ 67–76 м³, до 26 т)',
      note: 'Срок: ориентировочно {days} дней. В цену не входят перевозка внутри Китая, таможенное оформление и выгрузка в Ташкенте — считаем отдельно в запросе.',
    },
    rules: {
      title: 'Как считается цена?',
      formula: 'Объёмный вес (авиа)',
      formulaLine: 'В авиа цена идёт от расчётного веса: объёмный вес (кг) = длина × ширина × высота (см) ÷ {airDivisor}, к оплате берётся больший из фактического и объёмного. В авто карго этого правила нет — там считается реальный объём в м³.',
      density: 'Правило плотности (авто)',
      densityLine: 'Плотность (кг/м³) = вес ÷ объём. Она выбирает строку таблицы: чем ниже плотность, тем дешевле кубометр. Груз плотнее {threshold} кг/м³ считается по килограммам — {denseRate}/кг. Минимальный расчётный объём — {minM3} м³.',
      chargeable: 'Поэтому для авто одного веса мало: вводите в калькулятор габариты или м³ — без плотности цены не будет.',
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
      included: ['Приёмка, взвешивание и обмер на складе в Китае', 'Фотоотчёт в Telegram при каждой приёмке', 'Консолидация — один груз от нескольких поставщиков', 'Перевозка из Китая до склада в Ташкенте', 'Менеджер: сообщения о местоположении и статусе', 'Самовывоз со склада в Ташкенте или отправка в регион (условия согласуются)'],
      extrasTitle: 'Дополнительные услуги',
      head: ['Услуга', 'Цена'],
      extras: { photo: 'Подробный фотоотчёт (каждое место)', repack: 'Переупаковка, уменьшение объёма', inspection: 'Пересчёт и проверка товара', insurance: 'Страховка', commission: 'Комиссия за поиск и выкуп товара', storageChina: 'Хранение на складе в Китае', storageTashkent: 'Хранение на складе в Ташкенте' },
      perReceipt: 'за приёмку',
      ofValue: '{n}% от заявленной стоимости',
      daysFree: '{n} {days} бесплатно',
      excludedTitle: 'Оплачивается отдельно',
      excluded: ['Пошлина, НДС и таможенные сборы — по закону, в зависимости от кода ТН ВЭД; считаем заранее', 'Сам товар и доставка внутри Китая (от поставщика до адреса приёма)', 'Доставка до двери — ниже'],
    },
    regions: {
      title: 'Доставка в регионы',
      text: 'Самовывоз со склада в Ташкенте — бесплатно. Условия отправки в регион уточняет менеджер. Доставка до двери — {door} сум. По Ташкенту груз от {kg} кг до двери бесплатно.',
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
        'Стоимость карго состоит из трёх частей: сбор и приёмка на складе в Китае, транспорт по маршруту Китай — Хоргос — Ташкент и оформление в Ташкенте. В сборном грузе вы платите не за всю фуру, а только за занятые кубометры — поэтому небольшая партия обходится заметно дешевле аренды контейнера.',
        'В фуре продаётся, по сути, кубометр, и места в ней немного. Поэтому цену задаёт плотность: лёгкий груз занимает много объёма при малом весе — его кубометр дешевле; чем плотнее груз, тем дороже кубометр, но тем дешевле килограмм. Груз плотнее {threshold} кг/м³ — тяжелее воды — упирается не в объём фуры, а в её тоннаж, поэтому считается по килограммам, {denseRate}/кг. Вся таблица открыто лежит на этой странице.',
        'Тарифы зависят от сезона: перед 11.11 и Новым годом партии уплотняются, на китайский Новый год (конец января — февраль) склады закрываются на две недели. Поэтому цены в таблицах ориентировочные и обновляются ежемесячно — дата стоит под каждой таблицей.',
        'Итоговая цена подтверждается после взвешивания и обмера на складе в Китае: фактический вес, объём и фотоотчёт приходят в Telegram, после чего закрывается счёт. Скрытых платежей нет — правило расчёта записано в договоре.',
      ],
    },
    calcTitle: 'Посчитайте свой груз',
    calcIntro: 'Введите вес, размеры и категорию — калькулятор считает по этим же таблицам и готовит сообщение в Telegram.',
    faq: {
      title: 'Вопросы о ценах',
      items: [
        { q: 'Сколько стоит 1 кг карго из Китая в Ташкент?', a: 'У авто карго нет цены за килограмм: сборный груз продаётся по объёму — от {truck}/м³, строку выбирает плотность ({month}). Например, 300 кг в 1,2 м³ — это 250 кг/м³, итого 216 $. Авиа считается по килограммам — от {air}/кг.' },
        { q: 'Что такое объёмный вес и когда он применяется?', a: 'Объёмный вес нужен только в авиа: длина × ширина × высота (см) ÷ {airDivisor}, дальше берётся больший из фактического и объёмного — коробка 60 × 50 × 40 см летит как 24 кг, даже если внутри 8 кг. В авто карго объёмный вес не считается: у той же коробки реальный объём 0,12 м³, при 8 кг это 67 кг/м³ — строка 110 $/м³, то есть 13,2 $.' },
        { q: 'Что дешевле — плотный груз или объёмный?', a: 'Обе цены в одной таблице. Чем ниже плотность, тем дешевле кубометр; у плотного груза кубометр дороже, но в том же объёме едет больше веса, поэтому килограмм выходит дешевле. Груз плотнее {threshold} кг/м³ — например металл или плитка — считается по килограммам, {denseRate}/кг. Калькулятор сам считает плотность и показывает сработавшую строку.' },
        { q: 'Есть ли минимальный вес или объём?', a: 'В авто карго минимальный расчётный объём — {minM3} м³: место меньше мы примем, но счёт начнётся с {minM3} м³. Авиа — от {airMin} кг, контейнер — от 20 футов. Небольшие посылки тоже добавляем в сборный груз.' },
        { q: 'Входит ли в цену таможня?', a: 'Таможенное оформление берём на себя, документы готовим мы. Пошлина и НДС платятся отдельно по закону, в зависимости от кода ТН ВЭД — сумму считаем до отправки.' },
        { q: 'Сколько стоит страховка?', a: '{insurance}% от заявленной стоимости (ориентировочно). Ответственность за незастрахованный груз определяется договором.' },
        { q: 'Когда и как платить?', a: 'Когда груз прибыл на склад в Ташкенте, перед выдачей — в сумах по расчётному курсу. Наличные, карта, Click/Payme; для юрлиц — счёт-фактура. Предоплата не требуется.' },
        { q: 'Почему цена ориентировочная?', a: 'Потому что итоговые вес и объём известны после взвешивания на складе в Китае, а тарифы обновляются ежемесячно по сезону. Дата стоит под таблицей — {date}. Расчёт подтверждаем одним сообщением в Telegram.' },
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
    intro: 'Введите вес, размеры и категорию товара — калькулятор считает ориентировочную цену для авто, авиа или ж/д по тарифам на {date}: применённое правило, тариф, сумму в долларах и сумах, срок. Авто — от {truck}/м³ по плотности, авиа — от {air}/кг. Точная цена подтверждается после взвешивания на складе в Китае.',
    howTitle: 'Как считает калькулятор?',
    steps: [
      { title: 'Находит объём и плотность', text: 'Объём = длина × ширина × высота (м) или введённые вами м³. Плотность = вес ÷ объём. Для авиа считается объёмный вес: длина × ширина × высота (см) ÷ {airDivisor} — и сравнивается с фактическим.' },
      { title: 'Выбирает правило', text: 'Авто: плотность выбирает строку таблицы, сумма — м³ × цена строки; груз плотнее {threshold} кг/м³ — {denseRate}/кг. Авиа — цена за кг по категории.' },
      { title: 'Считает сумму', text: 'Тариф × объём или расчётный вес. В долларах и сумах, со сроком {days} дней и готовым сообщением в Telegram.' },
    ],
    notesTitle: 'На что обратить внимание',
    notes: [
      'Товары с батареями, магниты и жидкости не принимаются на самолёт — калькулятор автоматически переводит их на тариф авто.',
      'Авто карго без объёма не считается — укажите габариты или м³; только по весу считается авиа.',
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
      'Авто карго — по м³: плотность (вес ÷ объём) выбирает цену кубометра; груз плотнее {threshold} кг/м³ — по кг.',
      'Авиа — по кг: объёмный вес = длина × ширина × высота (см) ÷ {airDivisor}, сравнивается с фактическим.',
      'В цену входят приёмка на складе, обмер и фотоотчёт; страховка и таможенные платежи — отдельно.',
    ],
    example: 'Например: 48 кг, 0,2 м³ → 240 кг/м³ → 0,2 × 180 $ = 36 $.',
    allRates: 'Все тарифы',
    tiles: { truck: 'Авто карго (сборный груз)', air: 'Авиа карго', lcl: 'Плотный груз' },
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
      'truck-lcl': 'Density {density} kg/m³ → {m3} m³ × {rate}',
      'truck-per-kg': 'Density {density} kg/m³ ≥ {perKgDensity} → per kg · {rate}',
      'rail-20ft': '20 ft container · {rate}, depending on route and season',
      'rail-40ft': '40 ft container · {rate}, depending on route and season',
    },
    notes: {
      'volumetric-applied': 'Volumetric weight ({volumetric} kg, ÷ {divisor}) exceeds the actual weight — priced on the volumetric figure.',
      'min-kg-applied': 'Minimum chargeable weight is {minKg} kg.',
      'min-m3-applied': 'Minimum volume is {minM3} m³.',
      'no-volume': 'No volume entered — the air estimate uses weight only.',
      'switched-to-truck': '{category} cannot fly — the truck rate was applied.',
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
    volumeHint: 'Required for truck cargo, optional for air.',
    category: 'Goods category',
    categoryHint: 'Goods with batteries and liquids travel by truck only.',
    container: 'Container',
    submit: 'Calculate',
    resultLabel: 'Estimate',
    resultEmpty: 'Enter a weight — the price appears here.',
    overLimit: 'The calculator does not price a shipment this large — container and charter loads are quoted separately. Message us on Telegram and we will price it exactly.',
    needVolume: 'Truck cargo is priced by volume: add the dimensions or the volume in m³. Weight alone can only price air cargo.',
    ruleLabel: 'Rule applied',
    switchNote: 'This category cannot fly — the calculator switched to the truck rate.',
    kursNote: 'Settlement rate: $1 = {rate} UZS (indicative).',
    finalNote: 'The final price is confirmed after weighing and measuring at the China warehouse.',
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
    seoTitle: 'China to Tashkent cargo rates 2026 — how much is 1 m³?',
    seoDescription: 'Cargo from China to Tashkent: consolidated truck from {truck} per m³, priced by cargo density; air from {air} per kg. The density table, what the price includes, payment. Updated {date}.',
    eyebrow: 'Pricing — {month}',
    h1: 'China to Tashkent cargo rates 2026',
    intro: 'Consolidated truck cargo from China to Tashkent is priced by volume — from {truck} per m³ ({month}). Density (weight ÷ volume) picks the rate band: the lighter the cargo, the cheaper the cubic metre. Air is priced by weight, from {air} per kg. The price includes receiving at the China warehouse, measuring, consolidation and delivery to the Tashkent warehouse; duty, VAT and insurance are separate.',
    tiles: { truck: 'Truck cargo (consolidated)', air: 'Air cargo', lcl: 'Dense cargo', rail: '20 ft container', fromKg: '/kg', fromM3: '/m³', fromContainer: '' },
    truck: {
      title: 'Truck cargo (consolidated) — how much per m³?',
      intro: 'Truck cargo is consolidated at the China warehouse and travels by truck through Khorgos to Tashkent. It is priced by volume: density (weight ÷ volume) picks the band — the denser the cargo, the dearer a cubic metre and the cheaper a kilogram.',
      head: ['Density', 'Price'],
      note: 'Density = weight (kg) ÷ volume (m³). For example, 180 kg in 2 m³ is 90 kg/m³ — the first row of the table: 2 × $110 = $220. Volume of a piece: length × width × height in metres.',
      days: 'Transit: roughly {days} days after departure from the China warehouse; express batches {express} days.',
    },
    lcl: {
      title: 'The density table — price per m³',
      intro: 'Every row of the consolidated tariff is a density range: the lower the density, the cheaper the cubic metre. Cargo denser than {threshold} kg/m³ — heavier than water — is billed per kilogram instead.',
      head: ['Density', 'Price'],
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
      c20: '20 ft container (≈ 33 m³, up to 20 t)',
      c40: '40 ft / 40 HC container (≈ 67–76 m³, up to 26 t)',
      note: 'Transit roughly {days} days. The price excludes trucking inside China, customs clearance and unloading in Tashkent — quoted separately.',
    },
    rules: {
      title: 'How is the price calculated?',
      formula: 'Volumetric weight (air)',
      formulaLine: 'Air is priced on chargeable weight: volumetric weight (kg) = length × width × height (cm) ÷ {airDivisor}, and you pay for the greater of actual and volumetric. Truck cargo has no such rule — it is priced on the real volume in m³.',
      density: 'The density rule (truck)',
      densityLine: 'Density (kg/m³) = weight ÷ volume. It picks the row: the lower the density, the cheaper the cubic metre. Cargo denser than {threshold} kg/m³ is billed per kilogram at {denseRate}/kg. The minimum billable volume is {minM3} m³.',
      chargeable: 'So weight alone will not do for truck cargo: give the calculator the dimensions or the volume — without density there is no price.',
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
      included: ['Receiving, weighing and measuring at the China warehouse', 'A photo report to Telegram at every receipt', 'Consolidation — one shipment from several suppliers', 'Transport from China to the Tashkent warehouse', 'A manager who reports location and status', 'Collection at the Tashkent warehouse or forwarding to your region (terms agreed)'],
      extrasTitle: 'Extra services',
      head: ['Service', 'Price'],
      extras: { photo: 'Detailed photo report (per piece)', repack: 'Repacking to reduce volume', inspection: 'Counting and inspecting goods', insurance: 'Insurance', commission: 'Sourcing and buying commission', storageChina: 'Storage at the China warehouse', storageTashkent: 'Storage at the Tashkent warehouse' },
      perReceipt: 'per receipt',
      ofValue: '{n}% of declared value',
      daysFree: '{n} {days} free',
      excludedTitle: 'Paid separately',
      excluded: ['Duty, VAT and customs fees — by law, according to the HS code; we calculate them in advance', 'The goods themselves and domestic delivery in China (supplier to the receiving address)', 'Door delivery — see below'],
    },
    regions: {
      title: 'Delivery to the regions',
      text: 'Collection at the Tashkent warehouse is free. Your manager confirms the terms for forwarding to a region. Door delivery costs {door} UZS. In Tashkent, cargo over {kg} kg is delivered to the door free of charge.',
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
        'A cargo rate has three parts: collection and receiving at the China warehouse, transport along the China — Khorgos — Tashkent route, and clearance in Tashkent. With consolidated cargo you pay for the cubic metres you take up, not the whole truck — which is why a small lot sits well below the cost of container hire.',
        'What a truck really sells is the cubic metre, and there is only so much of it. Density therefore sets the price: light cargo takes a lot of volume for little weight, so its cubic metre is cheaper; the denser the cargo, the dearer the cubic metre and the cheaper the kilogram. Cargo denser than {threshold} kg/m³ — heavier than water — runs into the truck’s payload rather than its volume, so it is billed per kilogram at {denseRate}/kg. The whole table is written openly on this page.',
        'Rates follow the season: batches fill up before 11.11 and New Year, and warehouses close for two weeks over Chinese New Year (late January to February). That is why the table prices are estimates, updated monthly — the date sits under every table.',
        'The final price is confirmed once the cargo is weighed and measured in China: actual weight, volume and the photo report arrive in Telegram, and the invoice is settled on that basis. No hidden charges — the pricing rule is written into the contract.',
      ],
    },
    calcTitle: 'Estimate your own cargo',
    calcIntro: 'Enter weight, size and category — the calculator runs on these same tables and drafts a Telegram message for you.',
    faq: {
      title: 'Pricing questions',
      items: [
        { q: 'How much is 1 kg of cargo from China to Tashkent?', a: 'Truck cargo has no per-kilogram price: consolidated freight is sold by volume, from {truck} per m³, with density picking the row ({month}). For example, 300 kg in 1.2 m³ is 250 kg/m³ and comes to $216. Air is priced per kilogram, from {air}/kg.' },
        { q: 'What is volumetric weight and when does it apply?', a: 'Volumetric weight applies to air only: length × width × height (cm) ÷ {airDivisor}, and the greater of actual and volumetric weight is charged — a 60 × 50 × 40 cm box flies as 24 kg even if it holds 8 kg. Truck cargo ignores volumetric weight: that same box is 0.12 m³, and 8 kg in it is 67 kg/m³ — the $110/m³ row, so $13.20.' },
        { q: 'Which is cheaper, dense cargo or bulky cargo?', a: 'Both come out of the same table. The lower the density, the cheaper the cubic metre; dense cargo pays more per cubic metre but carries more weight in the same space, so its kilogram costs less. Cargo denser than {threshold} kg/m³ — metal or tiles, say — is billed per kilogram at {denseRate}/kg. The calculator works out the density and shows which row applied.' },
        { q: 'Is there a minimum weight or volume?', a: 'Truck cargo has a minimum billable volume of {minM3} m³: we take a smaller piece, but billing starts at {minM3} m³. Air starts at {airMin} kg and containers at 20 ft. Small parcels join the consolidated load too.' },
        { q: 'Is customs included in the price?', a: 'Customs clearance is on us — we prepare the documents. Duty and VAT are paid separately by law, according to the HS code, and we calculate the amount before shipping.' },
        { q: 'How much is insurance?', a: '{insurance}% of the declared value (indicative). Liability for uninsured cargo is set out in the contract.' },
        { q: 'When and how do I pay?', a: 'When the cargo reaches the Tashkent warehouse, before release — in UZS at the settlement rate. Cash, card, Click/Payme; invoice for legal entities. No prepayment required.' },
        { q: 'Why is the price an estimate?', a: 'Because the final weight and volume are known after weighing in China, and rates are updated monthly with the season. The date sits under the table — {date}. We confirm the figure with one Telegram message.' },
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
    intro: 'Enter weight, dimensions and goods category — the calculator estimates the price by truck, air or rail on the {date} rates: the rule applied, the rate, the total in USD and UZS, and the transit time. Truck from {truck} per m³ by density, air from {air}/kg. The exact price is confirmed after weighing at the China warehouse.',
    howTitle: 'How does the calculator work?',
    steps: [
      { title: 'Finds the volume and density', text: 'Volume = length × width × height (m), or the m³ you type in. Density = weight ÷ volume. For air it also works out the volumetric weight — length × width × height (cm) ÷ {airDivisor} — and compares it with the actual weight.' },
      { title: 'Picks the rule', text: 'Truck: density picks the row and the total is m³ × that row’s rate; cargo denser than {threshold} kg/m³ goes at {denseRate}/kg. Air: a per-kg rate by category.' },
      { title: 'Works out the total', text: 'Rate × volume, or × chargeable weight for air. In USD and UZS, with a {days}-day transit and a ready Telegram message.' },
    ],
    notesTitle: 'Things to keep in mind',
    notes: [
      'Goods with batteries, magnets and liquids are not accepted on aircraft — the calculator switches them to the truck rate automatically.',
      'Truck cargo cannot be priced without a volume — add the dimensions or the m³; weight alone prices air only.',
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
      'Truck cargo is priced per m³: density (weight ÷ volume) picks the rate for a cubic metre; above {threshold} kg/m³ it is billed per kg.',
      'Air is priced per kg: volumetric weight = length × width × height (cm) ÷ {airDivisor}, compared with the actual weight.',
      'The price includes warehouse receiving, measuring and the photo report; insurance and customs payments are separate.',
    ],
    example: 'Example: 48 kg, 0.2 m³ → 240 kg/m³ → 0.2 × $180 = $36.',
    allRates: 'All rates',
    tiles: { truck: 'Truck cargo (consolidated)', air: 'Air cargo', lcl: 'Dense cargo' },
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
