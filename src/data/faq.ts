import type { Lang } from '@/i18n/config';
import { fmtDate, fmtNumber, fmtUsd } from '@/lib/format';
import tariffs from './tariffs.json';

/**
 * FAQ content for /savol-javob/ (+ the six `top` items on the home page).
 * Every price, day range and percentage is read from src/data/tariffs.json at build time, so the
 * answers can never disagree with the pricing page or the calculator. Answers are plain text
 * (no HTML) because they are also emitted as FAQPage JSON-LD.
 */
export interface FaqItem { q: string; a: string; top?: boolean }
export interface FaqGroup { id: string; group: string; items: FaqItem[] }

const T = tariffs;

/** Locale-formatted numbers used inside the answers. */
function nums(lang: Lang) {
  const n = (x: number, f = 0) => fmtNumber(x, lang, f);
  const usd = (x: number) => (lang === 'en' && !Number.isInteger(x) ? `$${x.toFixed(2)}` : fmtUsd(x, lang));
  const usdRange = (a: number, b: number) => (lang === 'en' ? `$${n(a)}–${n(b)}` : `${n(a)}–${n(b)} $`);
  const som = (a: number, b: number) => (lang === 'uz' ? `${n(a)}–${n(b)} soʻm` : lang === 'ru' ? `${n(a)}–${n(b)} сум` : `UZS ${n(a)}–${n(b)}`);
  const days = (r: number[]) => `${n(r[0])}–${n(r[1])}`;
  const l = T.truck.ladderPerKg;
  const lcl = T.truck.lclPerM3ByDensity;
  return {
    t1: usd(l[0].rate), t1max: n(l[0].maxKg ?? 0), t2: usd(l[1].rate), t2max: n(l[1].maxKg ?? 0), t3: usd(l[2].rate),
    dense: usd(T.truck.densePerKg.rate), denseMin: n(T.truck.densePerKg.minKg),
    airStd: usd(T.air.perKg.standard), airBrand: usd(T.air.perKg.brand), airCom: usd(T.air.perKg.commercial), airMin: n(T.air.minKg, 1),
    lclFrom: usd(lcl[0].rate), lclTo: usd(lcl[lcl.length - 1].rate), minM3: n(T.truck.minM3, 1),
    r20: usdRange(T.rail.container20ft[0], T.rail.container20ft[1]), r40: usdRange(T.rail.container40ft[0], T.rail.container40ft[1]),
    truckDays: days(T.truck.days), airDays: days(T.air.days), railDays: days(T.rail.days), expressDays: days(T.truck.expressDays),
    threshold: n(T.truck.densityThresholdKgM3), divTruck: n(T.truck.volumetricDivisor), divAir: n(T.air.volumetricDivisor),
    photo: usd(T.extras.photoReportUsd), repack: usd(T.extras.repackPerKg), inspect: usd(T.extras.inspectionPerKg),
    ins: n(T.extras.insurancePct), comm: n(T.extras.sourcingCommissionPct),
    storeCn: n(T.extras.freeStorageDaysChina), storeTz: n(T.extras.freeStorageDaysTashkent),
    door: som(T.regions.doorDeliverySom[0], T.regions.doorDeliverySom[1]), doorFreeKg: n(T.regions.tashkentDoorFreeFromKg),
    updated: fmtDate(T.updated, lang),
  };
}

/* ------------------------------------------------------------------ UZ */
function uz(): FaqGroup[] {
  const v = nums('uz');
  return [
    {
      id: 'narxlar', group: 'Narxlar va toʻlov',
      items: [
        { top: true, q: 'Kargo narxi qanday hisoblanadi — kg yoki m³?',
          a: `Zichligi ${v.threshold} kg/m³ dan yuqori yuk kilogramm boʻyicha, undan past — yengil va hajmli — yuk kub metr boʻyicha hisoblanadi. Yigʻma yuk (avto kargo, карго) uchun taxminiy narx ${v.t3}/kg dan, hajmli yuk uchun ${v.lclFrom}/m³ dan, avia kargo ${v.airStd}/kg dan boshlanadi. Hajmiy vazn = uzunlik × en × balandlik (sm) ÷ ${v.divTruck} (avia uchun ÷ ${v.divAir}); haqiqiy va hajmiy vazndan kattasi olinadi. Masalan, 48 kg va 0,2 m³ yuk — 240 kg/m³, demak kg boʻyicha. Aniq summani kalkulyatorda hisoblang, menejer Telegramda tasdiqlaydi.` },
        { q: 'Xitoydan 1 kg yuk olib kelish qancha turadi?',
          a: `Yigʻma yuk uchun taxminan ${v.t1}/kg (${v.t1max} kg gacha), ${v.t2}/kg (${v.t1max}–${v.t2max} kg) va ${v.t3}/kg (${v.t2max} kg dan yuqori); zich ulgurji yuk — kiyim, poyabzal, ${v.denseMin} kg dan — taxminan ${v.dense}/kg. Avia kargo: oddiy tovar ${v.airStd}/kg, brend ${v.airBrand}/kg, tijorat seriyasi ${v.airCom}/kg. Narxlar taxminiy (yangilangan: ${v.updated}); yakuniy narx yukning zichligi, toifasi va partiyasiga qarab shartnomada belgilanadi.` },
        { q: 'Minimal ogʻirlik yoki hajm bormi?',
          a: `Avia kargo uchun ${v.airMin} kg dan, yigʻma yuk uchun 1 kg yoki ${v.minM3} m³ dan qabul qilamiz. Partiya ogʻirligi ${v.denseMin} kg dan oshsa, zich yuk tarifi qoʻllanadi. Kichik joylar boshqa mijozlar yuki bilan bitta furaga yigʻiladi — butun konteyner shart emas, faqat oʻz joyingiz uchun toʻlaysiz.` },
        { q: 'Narxga nimalar kiradi, nimalar alohida toʻlanadi?',
          a: `Narxga Ivu omborida qabul, tortish va oʻlchash, konsolidatsiya, Xorgos orqali Toshkentgacha tashish va Toshkent omboriga tushirish kiradi. Alohida toʻlanadi: sugʻurta (eʼlon qilingan qiymatning ${v.ins}%), boj va QQS (tovar kodi boʻyicha hisoblanadi), qayta qadoqlash (${v.repack}/kg), batafsil tekshiruv (${v.inspect}/kg) va viloyatda uygacha yetkazish. Har bir qoʻshimcha xizmat shartnomada alohida qatorda yoziladi — yashirin toʻlovlar yoʻq.` },
        { q: 'Toʻlovni qachon va qanday qilaman?',
          a: `Yuk tashish uchun toʻlov yuk Toshkentga yetib kelganda, yukni olishdan oldin soʻmda qilinadi; narx dollarda kelishiladi, kurs toʻlov kuni belgilanadi. Toʻlov usullari: karta oʻtkazmasi, Click yoki Payme, naqd, yuridik shaxslar uchun hisob-faktura boʻyicha bank oʻtkazmasi. Sotib olish xizmatida tovarning oʻzi uchun pul oldindan toʻlanadi — bu «Tovar topish va sotib olish» boʻlimida tushuntirilgan.` },
        { q: 'Viloyatlarga yetkazib berasizmi va bu qancha turadi?',
          a: `Ha, Oʻzbekistonning barcha viloyatlariga yetkazamiz. Viloyatga joʻnatish shartlarini menejer aytadi, uygacha yetkazish taxminan ${v.door}. Toshkent shahrida ${v.doorFreeKg} kg dan ogʻir yukni uygacha bepul olib boramiz. Yuk Toshkent omboriga tushgach, menejer joʻnatish sanasini xabar qiladi.` },
      ],
    },
    {
      id: 'muddatlar', group: 'Muddatlar va yoʻnalish',
      items: [
        { top: true, q: 'Xitoydan Toshkentga yuk necha kunda keladi?',
          a: `Yigʻma yuk — bozorda «avto kargo», «kitay kargo» yoki «хитой карго» deb ham qidiriladi — taxminan ${v.truckDays} kun, avia kargo ${v.airDays} kun, temir yoʻl konteyneri ${v.railDays} kun. Muddat yuk Ivu omboridan joʻnatilgandan keyin hisoblanadi; tez partiyalar ${v.expressDays} kunda kelgan. Xitoy Yangi yili (yanvar–fevral), «Oltin hafta» (oktabr boshi) va 11.11 mavsumida yana 1–2 hafta qoʻshib hisoblang.` },
        { q: 'Yuk qaysi yoʻnalish orqali keladi?',
          a: `Asosiy yoʻnalish: Ivu → Urumchi → Xorgos (Xitoy–Qozogʻiston chegarasi) → Olmaota → Shimkent → Toshkent, taxminan 5 000+ km. Fargʻona vodiysi uchun Qashqar → Irkeshtam → Oʻsh → Andijon yoʻli ham bor — Xitoyning gʻarbidan bu yoʻl yuzlab kilometr qisqa; yigʻma yukni odatda Xorgos orqali olib kelamiz. Avia yuk Guanchjou yoki Urumchidan uchadi, temir yoʻl konteynerlari Dostiq va Altinkoʻl orqali oʻtadi. Xitoy–Qirgʻiziston–Oʻzbekiston temir yoʻli hali qurilmoqda — u bizning yoʻnalishimizga kirmaydi.` },
        { q: 'Avia, avto va temir yoʻl — qaysi biri menga mos?',
          a: `Shoshilinch, yengil va qimmat tovar uchun avia (${v.airDays} kun, ${v.airStd}/kg dan); kiyim, poyabzal, maishiy tovarlar kabi hajmli yuk uchun avto yigʻma yuk (${v.truckDays} kun, ${v.t3}/kg dan); 10 m³ dan katta partiyalar uchun 20 yoki 40 futlik konteyner (${v.railDays} kun, 20 ft taxminan ${v.r20}, 40 ft ${v.r40}). Batareyali, suyuq va magnitli tovarlar faqat avto yoki temir yoʻl orqali ketadi. Menejer yukingizni koʻrib, ikki-uch variantni narxi bilan taklif qiladi.` },
        { q: 'Xorgosda kechikishlar boʻladimi?',
          a: `Ha, chegarada navbat boʻlishi mumkin — odatda 1–3 kun, bayram va mavsum oldi haftalarida koʻproq. Shuning uchun muddatni aniq kun bilan emas, oraliq bilan (${v.truckDays} kun) aytamiz. Kechikish boʻlsa, menejer sababini va yangi taxminiy sanani Telegramda yozadi.` },
        { q: 'Yuk qayerdaligini qanday bilaman?',
          a: `Har qabulda foto-hisobot, joʻnatishda partiya raqami beriladi. Kuzatuv sahifasida GS kodingizni (markirovka) kiritasiz — menejer Telegramda joriy holat (Ivu omborida · Yoʻlda · Xorgosda · Toshkent omborida · Yetkazildi) va foto bilan javob beradi. Xitoy ichidagi kuryer trek-kodi (1688, Taobao) bundan alohida — uni ombor qabulida tekshiramiz.` },
      ],
    },
    {
      id: 'buyurtma', group: 'Buyurtma va ombor',
      items: [
        { q: 'Ishni qanday boshlayman va yukni Xitoyda qayerga yuboraman?',
          a: `Telegramda yozasiz yoki qoʻngʻiroq qilasiz; transport turi, hujjatlar va qadoqlashni kelishib, shartnoma tuzamiz. Xitoyda uchta qabul manzili bor: Ivu (义乌), Guanchjou va Qashqar — qaysi biriga joʻnatish kerakligini menejer aytadi. Menejer sizga GS kodingizni (markirovka) ham beradi: yetkazib beruvchi joʻnatishdan oldin GS kodni har bir qutiga yozadi va tovarni shu manzilga joʻnatadi. Yukni faqat qabul manzili (ombor, sklad, склад) va GS kod tasdiqlangandan keyin joʻnating — tovar adashib ketmasligi uchun.` },
        { q: 'Bir nechta yetkazib beruvchidan kelgan tovarni birlashtira olasizmi?',
          a: `Ha, konsolidatsiya — asosiy ishimiz. Turli zavod va doʻkonlardan kelgan joylarni Ivu omborida bitta GS kodi ostida yigʻamiz, qayta oʻlchaymiz va bitta partiyada joʻnatamiz. Bu har joyni alohida joʻnatishdan arzon: umumiy ogʻirlik ${v.denseMin} kg dan oshsa, pastroq tarif qoʻllanadi. Kutilayotgan joylar haqida menejerga oldindan xabar bering.` },
        { q: 'Omborda yuk necha kun bepul saqlanadi?',
          a: `Ivu omborida ${v.storeCn} kun, Toshkent omborida ${v.storeTz} kun bepul. Undan keyin saqlash uchun kunlik toʻlov shartnoma boʻyicha hisoblanadi. Uzoqroq saqlash kerak boʻlsa — masalan, partiyani toʻldirish uchun — menejer bilan oldindan kelishib oling.` },
        { q: 'Tovarni tekshirib, foto yuborasizmi?',
          a: `Ha, har bir qabulda standart foto-hisobot: qadoq, yorliq, ogʻirlik va oʻlchamlar (${v.photo} har bir joy uchun). Batafsil tekshiruv — soni, rangi, oʻlchami, ishlashi — ${v.inspect}/kg dan buyurtma qilinadi. Nuqson topilsa, almashtirish yoki qaytarishni yetkazib beruvchi bilan Xitoyning oʻzida hal qilamiz — tovar Toshkentga joʻnatilmasdan turib.` },
        { q: 'Qayta qadoqlash bepulmi?',
          a: `Yoʻq, qayta qadoqlash ${v.repack}/kg. Lekin koʻp hollarda u oʻzini oqlaydi: zavod qadogʻidagi havo hajmiy vaznni oshiradi, zichroq qadoqlash esa hisobni m³ dan kg ga oʻtkazishi mumkin. Mebel va shisha kabi nozik tovarlar uchun yogʻoch ramka alohida hisoblanadi.` },
        { q: 'Yukni Toshkent omboridan oʻzim olib keta olamanmi?',
          a: `Ha, toʻlovdan keyin GS kodi bilan Toshkent omboridan oʻzingiz olib ketishingiz mumkin; ombor manzili va ish vaqtini menejer yuboradi. Istasangiz, shahar boʻylab (${v.doorFreeKg} kg dan bepul) yoki viloyatga yetkazamiz. Yuk omborda ${v.storeTz} kun bepul saqlanadi.` },
      ],
    },
    {
      id: 'bojxona', group: 'Bojxona va hujjatlar',
      items: [
        { top: true, q: 'Bojxonada nima boʻladi va kim toʻlaydi?',
          a: `Tijorat yuki rasmiy bojxona rasmiylashtiruvidan (растаможка) oʻtadi: deklaratsiya (GTD), TN VED kodi boʻyicha boj va 12% QQS. Boj va QQS qonun boʻyicha toʻlanadi — biz uni tovar kodi va qiymati boʻyicha oldindan hisoblab beramiz, «boj yoʻq» degan vaʼdani bermaymiz. Rasmiylashtiruv shartnomada kelishilgan tarzda oʻtadi: bizning hujjatlarimiz bilan yoki sizning firmangiz nomidan. Boj stavkalari PQ-3818 qaroriga (2026-yil fevraldagi PQ-58 tahriri) asosan: kiyim 20%, poyabzal 20% (kamida 3 $/juft), telefon 5%, kompyuter 0%, mebel 15%, oʻyinchoq 10%.` },
        { q: 'Jismoniy shaxs uchun 200 $ limit nima?',
          a: `2025-yil 1-maydan (VMQ-244) jismoniy shaxs kuryer joʻnatmalari orqali oyiga 200 $ gacha tovar olganda bojxona toʻlovi olinmaydi; limit bitta shaxsning oy davomidagi barcha buyurtmalari yigʻindisiga qaraladi. Oshgan qismidan yagona bojxona toʻlovi 30% (kamida 3 $/kg) olinadi; 2027-yil 1-yanvardan bu stavkani 20% va 2 $/kg qilish rejalashtirilgan (PF-174). Bir xil tovardan koʻp miqdorda buyurtma qilinsa, bojxona uni tijorat yuki deb hisoblashi mumkin. Doʻkon uchun tovar — tijorat yuki, u toʻliq rasmiylashtiruvdan oʻtadi.` },
        { q: 'Yuridik shaxs uchun qanday hujjatlar kerak?',
          a: `Tashqi savdo shartnomasi (E-Contract tizimida roʻyxatdan oʻtgan), invoys, qadoqlash roʻyxati, transport hujjati (avto uchun CMR, temir yoʻl uchun SMGS, avia uchun AWB), kelib chiqish sertifikati va 10 xonali TN VED kodi. Tovar turiga qarab muvofiqlik sertifikati yoki deklaratsiyasi va SES xulosasi ham kerak. Roʻyxatni tovar kodi boʻyicha aniqlashtirib, hujjatlarni tayyorlashda yordam beramiz; natijada siz GTD va rasmiy hisob-faktura olasiz.` },
        { q: 'Sertifikat va oʻzbekcha yorliq shartmi?',
          a: `Tovar kodiga bogʻliq: 2025-yil sentabrdagi VMQ-554 majburiy sertifikatlash roʻyxatini qisqartirdi, lekin elektr jihozlar, bolalar tovarlari, oʻyinchoq, kosmetika va oziq-ovqat uchun muvofiqlik hujjati va SES xulosasi saqlanib qolgan. Sertifikat yoki SES talab qilinadigan isteʼmol tovarlarida 2024-yil 1-yanvardan (PF-140) lotin yozuvidagi oʻzbekcha yorliq boʻlishi shart. Yorliqni zavodning oʻzida yopishtirishni yetkazib beruvchi bilan kelishib beramiz.` },
        { q: 'Bojxona rasmiylashtiruvi qancha turadi va qancha vaqt oladi?',
          a: `Davlat yigʻimi tovar qiymatiga bogʻliq: 10 000 $ gacha 1 BRV, 20 000 $ gacha 1,5 BRV va yuqoriga qarab oshadi (VMQ-55, 2025). Hujjatlar toʻliq boʻlsa, chiqarish odatda 1 ish kuni; tekshiruv yoki sertifikat kutilsa, koʻproq. Bizning rasmiylashtiruv xizmatimiz narxi yuk turiga qarab shartnomada yoziladi — oldindan hisob beramiz va keyin oʻzgartirmaymiz.` },
      ],
    },
    {
      id: 'sotib-olish', group: 'Tovar topish va sotib olish',
      items: [
        { top: true, q: 'Xitoy tilini bilishim shartmi?',
          a: `Yoʻq. Menejerlarimiz oʻzbek, rus va xitoy tillarida gaplashadi; yetkazib beruvchi bilan muzokara, narx kelishuvi va daʼvolarni biz olib boramiz. Siz tovar havolasini (1688, Taobao, Alibaba) yoki namunaning rasmini yuborasiz — qolgani bizning ishimiz. Xitoyga borish ham shart emas: namuna va zavod tekshiruvini Ivudagi xodimlarimiz qiladi.` },
        { top: true, q: 'Yetkazib beruvchi aldamasligiga qanday ishonaman?',
          a: `Toʻlovdan oldin sotuvchining biznes litsenziyasi, 1688-dagi reytingi va ish yillari tekshiriladi, katta buyurtmadan oldin namuna olinadi. Tovar toʻgʻridan-toʻgʻri Ivu omboriga (sklad) keladi: u yerda soni va sifati tekshirilib, foto-hisobot yuboriladi — muammo boʻlsa, tovar Toshkentga joʻnatilmasdan turib qaytariladi yoki almashtiriladi. Zavod buyurtmalarida toʻlovni bosqichma-bosqich qilishni taklif qilamiz: masalan, 30% oldindan, 70% tekshiruvdan keyin. 2018-yildan beri Xitoy bilan ishlaymiz va ishonchsiz sotuvchini oldindan aytamiz.` },
        { q: '1688, Taobao yoki Alibabadan qanday buyurtma beraman va toʻlayman?',
          a: `Havolani, rang-oʻlcham va sonini Telegramda yuborasiz; biz sotuvchi bilan kelishib, umumiy summani yuanda hisoblaymiz. Siz soʻmda yoki dollarda toʻlaysiz, biz yuanda toʻlaymiz — komissiya ${v.comm}% dan (taxminiy). Tovar Ivu omboriga keladi, tekshiriladi va boshqa buyurtmalaringiz bilan bitta partiyaga qoʻshiladi. Humo va Uzcard kartalari Xitoy saytlarida ishlamaydi — toʻlovni biz qilamiz.` },
        { q: 'Yuan kursi qanday belgilanadi?',
          a: `Kurs toʻlov kunidagi bozor kursi asosida olinadi va komissiya bilan birga hisob-fakturada alohida qatorda koʻrsatiladi — yashirin ustama yoʻq. Uni Markaziy bank kursi bilan solishtirishingiz mumkin: 2026-yil sentabr holatiga 1 yuan ≈ 1 750–1 800 soʻm. Katta summalarda (masalan, 10 000 yuandan) kurs alohida kelishiladi.` },
        { q: 'Zavod yoki ishlab chiqaruvchi topib berasizmi, komissiya qancha?',
          a: `Ha. Tovar tavsifi yoki namunasi boʻyicha 2–3 ta ishlab chiqaruvchini narxi, MOQ (minimal partiya) va ishlab chiqarish muddati bilan taqqoslab beramiz, namuna buyurtma qilamiz, kerak boʻlsa zavodga boramiz. Komissiya buyurtma summasining ${v.comm}% dan (taxminiy), murakkab uskunalar uchun alohida kelishiladi. Ivu va Guanchjou bozorlaridan mayda ulgurji tovar, Shenchjendan elektronika, Foshandan mebel — qayerdan nima olinishini bilamiz.` },
        { q: 'Uskunalar va avtomobillarni ham olib kelasizmi?',
          a: `Ha. Dastgoh va ishlab chiqarish liniyalarini «kalit topshirish» tartibida keltiramiz: zavod tanlash, shartnoma, toʻlov, yuklash, bojxona (koʻp sanoat uskunalari uchun boj 0%, kodga qarab) va oʻrnatishda yordam. Xitoydan avtomobil va elektromobillarni buyurtma asosida keltiramiz — narx va muddat model boʻyicha alohida hisoblanadi, boj, aksiz va boshqa toʻlovlar qonun boʻyicha hisoblanadi. Model yoki uskuna nomini yozing — hisob-kitob beramiz.` },
      ],
    },
    {
      id: 'xavfsizlik', group: 'Xavfsizlik va sugʻurta',
      items: [
        { top: true, q: 'Qaysi tovarlarni olib kelib boʻlmaydi?',
          a: `Portlovchi va yonuvchi moddalar; oʻsimlik, hayvon va tez buziladigan mahsulotlar; pul, qimmatbaho metall va toshlar, zargarlik va antiqa buyumlar; toʻlov vositalari, qimmatli qogʻozlar va hujjatlar; qonun bilan taqiqlangan barcha narsalar — narkotik, qurol, kontrafakt. Dronlar jismoniy shaxslar uchun taqiqlangan, ratsiya va radiouzatgichlar uchun ruxsatnoma kerak, dori-darmon tijorat maqsadida faqat roʻyxatdan oʻtgan boʻlsa olib kelinadi. Avia orqali litiy batareya, power bank, suyuqlik, atir va magnit yuborilmaydi — ular faqat avto yoki temir yoʻl bilan ketadi. Shubhangiz boʻlsa, tovar havolasini yuboring — tekshirib javob beramiz.` },
        { q: 'Yuk yoʻqolsa yoki shikastlansa kim javob beradi?',
          a: `Shartnoma boʻyicha biz javob beramiz: sugʻurtalangan yuk uchun eʼlon qilingan qiymat qaytariladi, sugʻurtasiz yuk uchun tovon miqdori shartnomada kg boʻyicha belgilanadi. Har qabulda tortish va foto-hisobot boʻlgani uchun yuk qaysi bosqichda shikastlanganini aniqlash oson. Daʼvo Toshkent omborida yukni olayotganda, foto bilan rasmiylashtiriladi.` },
        { q: 'Sugʻurta qancha va u shartmi?',
          a: `Sugʻurta — eʼlon qilingan qiymatning ${v.ins}% (taxminiy) va ixtiyoriy. Elektronika, shisha, mebel va 1 000 $ dan qimmat partiyalar uchun tavsiya qilamiz; arzon va mustahkam tovarlarni koʻpchilik sugʻurtasiz joʻnatadi. Sugʻurta qiymati invoys boʻyicha belgilanadi va shartnomaga yoziladi.` },
        { q: 'Shartnoma tuzasizmi va unda nima yoziladi?',
          a: `Ha, har bir mijoz bilan yozma shartnoma tuzamiz: tashish narxi va qoidasi (kg yoki m³), taxminiy muddat, qoʻshimcha xizmatlar, sugʻurta, javobgarlik va toʻlov tartibi. Yuridik shaxslarga hisob-faktura va bajarilgan ishlar dalolatnomasi beriladi; jismoniy shaxslar bilan ham shartnoma majburiy. Ofisimiz Toshkent, Alisher Navoiy koʻchasi, 27 — kelib imzolashingiz yoki masofadan tuzishingiz mumkin.` },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ RU */
function ru(): FaqGroup[] {
  const v = nums('ru');
  return [
    {
      id: 'ceny', group: 'Цены и оплата',
      items: [
        { top: true, q: 'Как считается стоимость карго — по кг или по м³?',
          a: `Груз плотностью выше ${v.threshold} кг/м³ считается по килограммам, ниже — лёгкий и объёмный — по кубометрам. Ориентировочно: сборный груз (авто карго) от ${v.t3}/кг, объёмный груз от ${v.lclFrom}/м³, авиа карго от ${v.airStd}/кг. Объёмный вес = длина × ширина × высота (см) ÷ ${v.divTruck} (для авиа ÷ ${v.divAir}); к оплате берётся больший из фактического и объёмного. Пример: 48 кг и 0,2 м³ — это 240 кг/м³, значит считаем по кг. Точную сумму посчитайте в калькуляторе, менеджер подтвердит её в Telegram.` },
        { q: 'Сколько стоит доставить 1 кг из Китая?',
          a: `Сборный груз — ориентировочно ${v.t1}/кг (до ${v.t1max} кг), ${v.t2}/кг (${v.t1max}–${v.t2max} кг) и ${v.t3}/кг (свыше ${v.t2max} кг); плотный оптовый груз — одежда, обувь, от ${v.denseMin} кг — около ${v.dense}/кг. Авиа карго: обычный товар ${v.airStd}/кг, бренд ${v.airBrand}/кг, коммерческая серия ${v.airCom}/кг. Цены ориентировочные (обновлено: ${v.updated}); итоговая ставка фиксируется в договоре с учётом плотности, категории товара и партии.` },
        { q: 'Есть ли минимальный вес или объём?',
          a: `Авиа карго принимаем от ${v.airMin} кг, сборный груз — от 1 кг или ${v.minM3} м³. Если партия тяжелее ${v.denseMin} кг, действует тариф для плотного груза. Небольшие места едут в одной фуре с грузом других клиентов — целый контейнер не нужен, вы платите только за своё место.` },
        { q: 'Что входит в цену, а что оплачивается отдельно?',
          a: `В цену входят приёмка на складе в Иу, взвешивание и обмер, консолидация, перевозка через Хоргос до Ташкента и выгрузка на ташкентском складе. Отдельно: страховка (${v.ins}% от заявленной стоимости), пошлина и НДС (считаются по коду товара), переупаковка (${v.repack}/кг), детальная проверка (${v.inspect}/кг) и доставка до двери в регионах. Каждая дополнительная услуга — отдельной строкой в договоре, скрытых платежей нет.` },
        { q: 'Когда и как я плачу?',
          a: `За перевозку вы платите, когда груз прибыл в Ташкент, перед выдачей, в сумах; цена согласовывается в долларах, курс фиксируется в день оплаты. Способы: перевод на карту, Click или Payme, наличные, для юридических лиц — банковский перевод по счёту. При выкупе стоимость самого товара оплачивается заранее — об этом в разделе «Поиск и выкуп товаров».` },
        { q: 'Доставляете ли в регионы и сколько это стоит?',
          a: `Да, доставляем во все области Узбекистана. Условия отправки в регион уточняет менеджер, до двери — ориентировочно ${v.door}. По Ташкенту груз тяжелее ${v.doorFreeKg} кг привозим до двери бесплатно. Как только груз выгружен на ташкентском складе, менеджер сообщает дату отправки в регион.` },
      ],
    },
    {
      id: 'sroki', group: 'Сроки и маршрут',
      items: [
        { top: true, q: 'Сколько дней идёт груз из Китая в Ташкент?',
          a: `Сборный груз (авто карго) — ориентировочно ${v.truckDays} дней, авиа карго — ${v.airDays} дней, контейнер по железной дороге — ${v.railDays} дней. Срок считается с момента отправки со склада в Иу; быстрые партии доходили за ${v.expressDays} дней. В китайский Новый год (январь–февраль), «золотую неделю» (начало октября) и сезон 11.11 закладывайте ещё 1–2 недели.` },
        { q: 'По какому маршруту едет груз?',
          a: `Основной маршрут: Иу → Урумчи → Хоргос (граница Китая и Казахстана) → Алматы → Шымкент → Ташкент, ориентировочно 5 000+ км. Для Ферганской долины есть путь Кашгар → Иркештам → Ош → Андижан — из западного Китая он на сотни километров короче; сборный груз мы обычно везём через Хоргос. Авиагруз летит из Гуанчжоу или Урумчи, ж/д контейнеры идут через Достык и Алтынколь. Железная дорога Китай — Кыргызстан — Узбекистан ещё строится и в наши маршруты не входит.` },
        { q: 'Авиа, авто или ж/д — что выбрать?',
          a: `Срочный, лёгкий и дорогой товар — авиа (${v.airDays} дней, от ${v.airStd}/кг); объёмный груз вроде одежды, обуви и бытовых товаров — сборный авто (${v.truckDays} дней, от ${v.t3}/кг); партии больше 10 м³ — контейнер 20 или 40 футов (${v.railDays} дней, 20 ft ориентировочно ${v.r20}, 40 ft ${v.r40}). Товары с батареями, жидкости и магниты едут только авто или по железной дороге. Менеджер посмотрит на ваш груз и предложит два-три варианта с ценой.` },
        { q: 'Бывают ли задержки на Хоргосе?',
          a: `Да, на границе бывает очередь — обычно 1–3 дня, перед праздниками и в сезон дольше. Поэтому срок мы называем интервалом (${v.truckDays} дней), а не точной датой. Если задержка случилась, менеджер пишет в Telegram причину и новую ориентировочную дату.` },
        { q: 'Как узнать, где сейчас мой груз?',
          a: `При каждой приёмке вы получаете фотоотчёт, при отправке — номер партии. На странице отслеживания вводите свой GS-код (маркировка) — менеджер отвечает в Telegram текущим статусом (На складе в Иу · В пути · На Хоргосе · На складе в Ташкенте · Доставлено) и фото. Трек-номер китайского курьера (1688, Taobao) — это отдельная вещь, его мы сверяем при приёмке на складе.` },
      ],
    },
    {
      id: 'zakaz', group: 'Заказ и склад',
      items: [
        { q: 'С чего начать и куда отправлять груз в Китае?',
          a: `Пишете в Telegram или звоните; согласуем вид транспорта, документы и упаковку, заключаем договор. В Китае три адреса приёма: Иу (义乌), Гуанчжоу и Кашгар — на какой отправлять, скажет менеджер. Он же даёт ваш GS-код (маркировка): поставщик пишет GS-код на каждой коробке до отправки и шлёт товар на этот адрес. Отправляйте товар только с подтверждённым адресом приёма (склад) и GS-кодом — чтобы груз не потерялся.` },
        { q: 'Можно ли объединить товар от нескольких поставщиков?',
          a: `Да, консолидация — наша основная работа. Места от разных фабрик и магазинов собираем на складе в Иу под одним GS-кодом, перемеряем и отправляем одной партией. Это дешевле, чем везти каждое место отдельно: если общий вес превышает ${v.denseMin} кг, действует более низкая ставка. Предупредите менеджера заранее, какие места ожидаются.` },
        { q: 'Сколько дней груз хранится на складе бесплатно?',
          a: `На складе в Иу — ${v.storeCn} дней, на складе в Ташкенте — ${v.storeTz} дня. Дальше хранение считается посуточно по договору. Если нужно держать груз дольше — например, чтобы добрать партию, — договоритесь с менеджером заранее.` },
        { q: 'Проверяете ли товар и присылаете ли фото?',
          a: `Да, при каждой приёмке — стандартный фотоотчёт: упаковка, маркировка, вес и габариты (${v.photo} за место). Детальная проверка — количество, цвет, размер, работоспособность — заказывается от ${v.inspect}/кг. Если найден брак, замену или возврат решаем с поставщиком ещё в Китае — до отправки в Ташкент.` },
        { q: 'Переупаковка бесплатная?',
          a: `Нет, переупаковка стоит ${v.repack}/кг. Но чаще всего она окупается: воздух в заводской упаковке увеличивает объёмный вес, а плотная упаковка может перевести расчёт с м³ на кг. Для хрупких товаров — мебель, стекло — деревянная обрешётка считается отдельно.` },
        { q: 'Могу ли я забрать груз со склада в Ташкенте сам?',
          a: `Да, после оплаты вы забираете груз по GS-коду со склада в Ташкенте; адрес и часы работы склада присылает менеджер. По желанию доставим по городу (от ${v.doorFreeKg} кг бесплатно) или в регион. На складе груз хранится бесплатно ${v.storeTz} дня.` },
      ],
    },
    {
      id: 'tamozhnya', group: 'Таможня и документы',
      items: [
        { top: true, q: 'Что происходит на таможне и кто платит?',
          a: `Коммерческий груз проходит официальное таможенное оформление: декларация (ГТД), пошлина по коду ТН ВЭД и НДС 12%. Пошлина и НДС платятся по закону — мы заранее считаем их по коду и стоимости товара и не обещаем, что платежей не будет. Оформление идёт так, как согласовано в договоре: под наши документы или от имени вашей фирмы. Ставки пошлин — по ПП-3818 в редакции ПП-58 от февраля 2026 г.: одежда 20%, обувь 20% (минимум 3 $/пара), телефоны 5%, компьютеры 0%, мебель 15%, игрушки 10%.` },
        { q: 'Что такое лимит 200 $ для физических лиц?',
          a: `С 1 мая 2025 г. (ПКМ-244) физическое лицо получает через курьерские отправления товары на сумму до 200 $ в месяц без таможенных платежей; лимит считается по всем заказам одного человека за месяц. С превышения берётся единый таможенный платёж 30% (минимум 3 $/кг); с 1 января 2027 г. планируется 20% и 2 $/кг (УП-174). Если заказано много одинаковых товаров, таможня может признать партию коммерческой. Товар для магазина — это коммерческий груз, он проходит полное оформление.` },
        { q: 'Какие документы нужны юридическому лицу?',
          a: `Внешнеторговый контракт, зарегистрированный в E-Contract, инвойс, упаковочный лист, транспортный документ (CMR для авто, СМГС для ж/д, AWB для авиа), сертификат происхождения и 10-значный код ТН ВЭД. В зависимости от товара — сертификат или декларация соответствия и заключение СЭС. Список уточняем по коду товара и помогаем подготовить документы; на выходе вы получаете ГТД и официальный счёт-фактуру.` },
        { q: 'Нужны ли сертификат и маркировка на узбекском?',
          a: `Зависит от кода товара: ПКМ-554 от сентября 2025 г. сократил перечень обязательной сертификации, но для электроприборов, детских товаров, игрушек, косметики и продуктов документ соответствия и заключение СЭС остались. Потребительские товары, которым нужен сертификат или СЭС, с 1 января 2024 г. (УП-140) должны иметь маркировку на узбекском языке латиницей. Нанесение этикетки на фабрике согласуем с поставщиком.` },
        { q: 'Сколько стоит и сколько длится таможенное оформление?',
          a: `Государственный сбор зависит от стоимости товара: до 10 000 $ — 1 БРВ, до 20 000 $ — 1,5 БРВ и далее по шкале (ПКМ-55, 2025 г.). При полном пакете документов выпуск обычно занимает 1 рабочий день; при досмотре или ожидании сертификата — дольше. Стоимость нашей услуги по оформлению зависит от типа груза и прописывается в договоре — считаем заранее и потом не меняем.` },
      ],
    },
    {
      id: 'vykup', group: 'Поиск и выкуп товаров',
      items: [
        { top: true, q: 'Нужно ли мне знать китайский?',
          a: `Нет. Наши менеджеры говорят на узбекском, русском и китайском; переговоры с поставщиком, торг по цене и претензии ведём мы. Вы присылаете ссылку на товар (1688, Taobao, Alibaba) или фото образца — остальное наша работа. Ехать в Китай тоже не нужно: образцы и проверку фабрики делают наши сотрудники в Иу.` },
        { top: true, q: 'Как убедиться, что поставщик не обманет?',
          a: `До оплаты проверяем бизнес-лицензию продавца, его рейтинг на 1688 и годы работы, перед крупным заказом берём образец. Товар приходит прямо на склад в Иу: там сверяем количество и качество и присылаем фотоотчёт — если есть проблема, товар возвращается или меняется до отправки в Ташкент. По заказам с фабрик предлагаем оплату частями: например, 30% авансом, 70% после проверки. Работаем с Китаем с 2018 года и заранее предупредим о ненадёжном продавце.` },
        { q: 'Как заказать и оплатить товар с 1688, Taobao или Alibaba?',
          a: `Присылаете ссылку, цвет, размер и количество в Telegram; мы согласуем условия с продавцом и считаем итог в юанях. Вы платите в сумах или долларах, мы платим в юанях — комиссия от ${v.comm}% (ориентировочно). Товар приходит на склад в Иу, проверяется и объединяется с другими вашими заказами в одну партию. Карты Humo и Uzcard на китайских площадках не работают — оплату проводим мы.` },
        { q: 'Какой курс юаня при выкупе?',
          a: `Курс берётся по рынку на день оплаты и вместе с комиссией показывается отдельной строкой в счёте — скрытых наценок нет. Его можно сверить с курсом Центрального банка: в сентябре 2026 г. 1 юань ≈ 1 750–1 800 сумов. Для крупных сумм (например, от 10 000 юаней) курс согласуем отдельно.` },
        { q: 'Найдёте ли фабрику или производителя и какая комиссия?',
          a: `Да. По описанию или образцу сравниваем 2–3 производителей по цене, MOQ (минимальной партии) и сроку производства, заказываем образцы, при необходимости выезжаем на фабрику. Комиссия — от ${v.comm}% суммы заказа (ориентировочно), для сложного оборудования обсуждается отдельно. Мелкий опт — рынки Иу и Гуанчжоу, электроника — Шэньчжэнь, мебель — Фошань: знаем, что где брать.` },
        { q: 'Привозите ли оборудование и автомобили?',
          a: `Да. Станки и производственные линии — «под ключ»: подбор фабрики, контракт, оплата, погрузка, таможня (для многих видов промышленного оборудования пошлина 0%, зависит от кода) и помощь с монтажом. Автомобили и электромобили из Китая привозим под заказ: цена и срок считаются по конкретной модели, пошлина, акциз и другие платежи — по закону. Напишите модель или название оборудования — сделаем расчёт.` },
      ],
    },
    {
      id: 'bezopasnost', group: 'Безопасность и страховка',
      items: [
        { top: true, q: 'Какие товары нельзя привезти?',
          a: `Взрывчатые и горючие вещества; растения, животных и скоропортящиеся продукты; деньги, драгоценные металлы и камни, ювелирные и антикварные изделия; платёжные средства, ценные бумаги и документы; всё, что запрещено законом, — наркотики, оружие, контрафакт. Дроны для физических лиц запрещены, рации и радиопередатчики требуют разрешения, лекарства в коммерческих объёмах — только зарегистрированные. Авиа не принимает литиевые батареи, пауэрбанки, жидкости, парфюмерию и магниты — они едут только авто или по железной дороге. Сомневаетесь — пришлите ссылку на товар, проверим и ответим.` },
        { q: 'Кто отвечает, если груз потерян или повреждён?',
          a: `По договору отвечаем мы: за застрахованный груз возвращается заявленная стоимость, для незастрахованного размер компенсации прописан в договоре из расчёта за кг. Поскольку каждое место взвешивается и фотографируется при приёмке, легко установить, на каком этапе груз пострадал. Претензия оформляется при выдаче на складе в Ташкенте, с фото.` },
        { q: 'Сколько стоит страховка и обязательна ли она?',
          a: `Страховка — ${v.ins}% от заявленной стоимости (ориентировочно), по желанию. Рекомендуем её для электроники, стекла, мебели и партий дороже 1 000 $; дешёвый и прочный товар большинство отправляет без страховки. Страховая стоимость берётся по инвойсу и фиксируется в договоре.` },
        { q: 'Вы заключаете договор и что в нём прописано?',
          a: `Да, с каждым клиентом — письменный договор: цена и правило расчёта (кг или м³), ориентировочный срок, дополнительные услуги, страховка, ответственность и порядок оплаты. Юридическим лицам выдаём счёт-фактуру и акт выполненных работ; с физическими лицами договор тоже обязателен. Офис — Ташкент, ул. Алишера Навои, 27: можно подписать лично или дистанционно.` },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ EN */
function en(): FaqGroup[] {
  const v = nums('en');
  return [
    {
      id: 'prices', group: 'Prices and payment',
      items: [
        { top: true, q: 'How is the cargo price calculated — per kg or per m³?',
          a: `Cargo denser than ${v.threshold} kg/m³ is priced per kilogram; lighter, bulkier cargo is priced per cubic metre. As a guide, consolidated truck freight starts at ${v.t3}/kg, bulky freight at ${v.lclFrom}/m³ and air cargo at ${v.airStd}/kg. Volumetric weight = length × width × height (cm) ÷ ${v.divTruck} (÷ ${v.divAir} for air); you pay for the greater of actual and volumetric weight. Example: 48 kg in 0.2 m³ is 240 kg/m³, so it is priced per kg. Run the numbers in the calculator and a manager confirms them on Telegram.` },
        { q: 'How much does it cost to ship 1 kg from China?',
          a: `Consolidated truck freight is roughly ${v.t1}/kg up to ${v.t1max} kg, ${v.t2}/kg for ${v.t1max}–${v.t2max} kg and ${v.t3}/kg above ${v.t2max} kg; dense wholesale cargo such as clothing and footwear from ${v.denseMin} kg is around ${v.dense}/kg. Air cargo: ordinary goods ${v.airStd}/kg, branded goods ${v.airBrand}/kg, commercial series ${v.airCom}/kg. These are estimates (updated ${v.updated}); the final rate is fixed in the contract based on density, goods category and batch.` },
        { q: 'Is there a minimum weight or volume?',
          a: `We accept air cargo from ${v.airMin} kg and consolidated truck freight from 1 kg or ${v.minM3} m³. Above ${v.denseMin} kg per batch the dense-cargo rate applies. Small lots share a truck with other clients’ goods — no whole container needed, you pay only for your space.` },
        { q: 'What does the price include, and what is extra?',
          a: `The price covers receiving at the Yiwu warehouse, weighing and measuring, consolidation, transport via Khorgos to Tashkent and unloading at the Tashkent warehouse. Charged separately: insurance (${v.ins}% of declared value), duty and VAT (calculated by HS code), repacking (${v.repack}/kg), detailed inspection (${v.inspect}/kg) and door delivery in the regions. Every extra appears as its own line in the contract — no hidden fees.` },
        { q: 'When and how do I pay?',
          a: `Freight is paid when the cargo arrives in Tashkent, before release, in Uzbek soums; the price is agreed in US dollars and the exchange rate is fixed on the day of payment. Options: card transfer, Click or Payme, cash, or a bank transfer against an invoice for companies. With the buying service the goods themselves are paid for in advance — see “Sourcing and buying”.` },
        { q: 'Do you deliver to the regions, and what does it cost?',
          a: `Yes, we deliver to every region of Uzbekistan. Your manager confirms the terms for forwarding to your region; door delivery is roughly ${v.door}. In Tashkent, cargo heavier than ${v.doorFreeKg} kg is delivered to the door free of charge. Once the cargo is unloaded at the Tashkent warehouse, your manager confirms the dispatch date.` },
      ],
    },
    {
      id: 'transit', group: 'Transit times and route',
      items: [
        { top: true, q: 'How many days does cargo take from China to Tashkent?',
          a: `Consolidated truck freight takes roughly ${v.truckDays} days, air cargo ${v.airDays} days and a rail container ${v.railDays} days. Transit counts from departure from the Yiwu warehouse; fast batches have arrived in ${v.expressDays} days. Around Chinese New Year (January–February), Golden Week (early October) and the 11.11 season, add another 1–2 weeks.` },
        { q: 'Which route does the cargo take?',
          a: `The main route is Yiwu → Urumqi → Khorgos (the China–Kazakhstan border) → Almaty → Shymkent → Tashkent, roughly 5,000+ km. For the Fergana Valley there is also Kashgar → Irkeshtam → Osh → Andijan, hundreds of kilometres shorter from western China; we move consolidated freight through Khorgos by default. Air cargo flies from Guangzhou or Urumqi; rail containers cross at Dostyk and Altynkol. The China–Kyrgyzstan–Uzbekistan railway is still under construction and is not part of our routes.` },
        { q: 'Air, truck or rail — which one suits me?',
          a: `Urgent, light and high-value goods: air (${v.airDays} days, from ${v.airStd}/kg). Bulky goods such as clothing, footwear and household items: consolidated truck (${v.truckDays} days, from ${v.t3}/kg). Lots above 10 m³: a 20 ft or 40 ft container (${v.railDays} days, 20 ft roughly ${v.r20}, 40 ft ${v.r40}). Goods with batteries, liquids and magnets travel only by truck or rail. A manager looks at your cargo and proposes two or three options with prices.` },
        { q: 'Are there delays at Khorgos?',
          a: `Yes, queues at the border happen — usually 1–3 days, longer before holidays and in peak season. That is why we quote transit as a range (${v.truckDays} days), not a date. If a delay occurs, your manager writes on Telegram with the reason and a new estimated date.` },
        { q: 'How do I know where my cargo is?',
          a: `You receive a photo report at every intake and a batch number at dispatch. Enter your GS code (shipping mark) on the tracking page and a manager replies on Telegram with the current status (At the Yiwu warehouse · In transit · At Khorgos · At the Tashkent warehouse · Delivered) and a photo. The Chinese courier tracking number (1688, Taobao) is a separate thing — we check it at warehouse intake.` },
      ],
    },
    {
      id: 'orders', group: 'Orders and warehouse',
      items: [
        { q: 'How do I start, and where do I send goods in China?',
          a: `Message us on Telegram or call; we agree the transport mode, documents and packing and sign a contract. There are three receiving addresses in China — Yiwu (义乌), Guangzhou and Kashgar — and your manager tells you which one applies. The manager also gives you your GS code (shipping mark): the supplier writes the GS code on every carton before dispatch and ships to that address. Send your goods only once the receiving address and the GS code are confirmed, so that nothing goes astray.` },
        { q: 'Can you combine goods from several suppliers?',
          a: `Yes — consolidation is our core service. Pieces from different factories and shops are gathered at the Yiwu warehouse under one GS code, re-measured and shipped as one batch. It is cheaper than shipping each piece alone: once the total passes ${v.denseMin} kg, a lower rate applies. Tell your manager in advance which pieces to expect.` },
        { q: 'How many days is storage free?',
          a: `${v.storeCn} days at the Yiwu warehouse and ${v.storeTz} days at the Tashkent warehouse. After that, storage is charged per day under the contract. If you need longer — for example to complete a batch — agree it with your manager in advance.` },
        { q: 'Do you inspect the goods and send photos?',
          a: `Yes, every intake comes with a standard photo report: packaging, label, weight and dimensions (${v.photo} per piece). A detailed check — quantity, colour, size, function — can be ordered from ${v.inspect}/kg. If we find a defect, we settle a replacement or return with the supplier while the goods are still in China, before dispatch to Tashkent.` },
        { q: 'Is repacking free?',
          a: `No, repacking costs ${v.repack}/kg. It usually pays for itself, though: air in factory packaging inflates the volumetric weight, and denser packing can move the calculation from m³ to kg. Wooden crating for fragile goods such as furniture or glass is quoted separately.` },
        { q: 'Can I collect the cargo from the Tashkent warehouse myself?',
          a: `Yes, after payment you can collect with your GS code; your manager sends the warehouse address and opening hours. If you prefer, we deliver within the city (free from ${v.doorFreeKg} kg) or to your region. Storage at the warehouse is free for ${v.storeTz} days.` },
      ],
    },
    {
      id: 'customs', group: 'Customs and documents',
      items: [
        { top: true, q: 'What happens at customs, and who pays?',
          a: `Commercial cargo goes through official customs clearance: a customs declaration (GTD), duty by HS code and 12% VAT. Duty and VAT are payable by law — we calculate them in advance from the HS code and value, and we never promise “no duty”. Clearance is done as agreed in the contract: under our documents or in your company’s name. Duty rates follow Resolution PP-3818 as amended by PP-58 in February 2026: clothing 20%, footwear 20% (min. $3 per pair), phones 5%, computers 0%, furniture 15%, toys 10%.` },
        { q: 'What is the $200 limit for individuals?',
          a: `Since May 1, 2025 (Cabinet Resolution PKM-244) an individual can receive up to $200 of goods per month through courier shipments before customs charges anything; the limit is cumulative across all of one person’s orders in the month. Above it, a single customs payment of 30% (min. $3/kg) applies; from January 1, 2027 the rate is planned to fall to 20% and $2/kg (Decree UP-174). If many identical items are ordered, customs may treat the shipment as commercial. Stock for a shop is commercial cargo and goes through full clearance.` },
        { q: 'Which documents does a company need?',
          a: `A foreign-trade contract registered in E-Contract, the invoice, packing list, transport document (CMR for road, SMGS for rail, AWB for air), certificate of origin and a 10-digit HS code. Depending on the goods, a certificate or declaration of conformity and a sanitary (SES) conclusion. We confirm the list by HS code and help prepare the documents; you end up with a customs declaration and an official tax invoice.` },
        { q: 'Are a certificate and Uzbek labelling required?',
          a: `It depends on the HS code: Resolution PKM-554 of September 2025 shortened the mandatory certification list, but electrical goods, children’s products, toys, cosmetics and food still need a conformity document and an SES conclusion. Consumer goods that need a certificate or SES must carry Uzbek-language labelling in Latin script since January 1, 2024 (Decree UP-140). We arrange labelling at the factory with the supplier.` },
        { q: 'How much does customs clearance cost, and how long does it take?',
          a: `The state fee depends on the value of the goods: 1 BRV up to $10,000, 1.5 BRV up to $20,000 and upward on a scale (PKM-55, 2025). With a complete file, release usually takes 1 working day; longer if there is an inspection or a certificate is pending. Our clearance fee depends on the type of cargo and is written into the contract — quoted up front and not changed afterwards.` },
      ],
    },
    {
      id: 'sourcing', group: 'Sourcing and buying',
      items: [
        { top: true, q: 'Do I need to speak Chinese?',
          a: `No. Our managers speak Uzbek, Russian and Chinese; we handle negotiation, price bargaining and claims with the supplier. You send a product link (1688, Taobao, Alibaba) or a photo of a sample — the rest is our job. You do not need to travel to China either: samples and factory checks are done by our staff in Yiwu.` },
        { top: true, q: 'How do I know the supplier will not cheat me?',
          a: `Before any payment we check the seller’s business licence, 1688 rating and years in business, and we order a sample before a large order. Goods arrive directly at the Yiwu warehouse, where quantity and quality are checked and a photo report is sent — if something is wrong, the goods are returned or replaced before they leave for Tashkent. For factory orders we suggest staged payment, for example 30% up front and 70% after inspection. We have worked with China since 2018 and will warn you about an unreliable seller.` },
        { q: 'How do I order and pay on 1688, Taobao or Alibaba?',
          a: `Send the link, colour, size and quantity on Telegram; we agree terms with the seller and calculate the total in yuan. You pay in soums or dollars, we pay in yuan — commission from ${v.comm}% (estimate). The goods arrive at the Yiwu warehouse, are checked and combined with your other orders into one batch. Uzbek Humo and Uzcard cards do not work on Chinese platforms — we make the payment.` },
        { q: 'What yuan exchange rate do you use?',
          a: `The market rate on the day of payment, shown together with the commission as a separate line on the invoice — no hidden margin. You can compare it with the Central Bank rate: in September 2026, 1 yuan was roughly 1,750–1,800 soums. For large sums (say, from 10,000 yuan) the rate is agreed individually.` },
        { q: 'Can you find a factory or manufacturer, and what is the commission?',
          a: `Yes. From a description or a sample we compare 2–3 manufacturers by price, MOQ and production lead time, order samples and, if needed, visit the factory. Commission starts at ${v.comm}% of the order value (estimate); complex equipment is quoted separately. Small wholesale from the Yiwu and Guangzhou markets, electronics from Shenzhen, furniture from Foshan — we know where each thing is bought.` },
        { q: 'Do you also import equipment and cars?',
          a: `Yes. Machinery and production lines on a turnkey basis: factory selection, contract, payment, loading, customs (many types of industrial equipment carry 0% duty, depending on the code) and help with installation. Cars and electric vehicles from China are imported to order; price and lead time are calculated per model, and duty, excise and other charges follow the law. Send us the model or the name of the equipment and we will prepare a quote.` },
      ],
    },
    {
      id: 'safety', group: 'Safety and insurance',
      items: [
        { top: true, q: 'Which goods cannot be shipped?',
          a: `Explosive and flammable substances; plants, animals and perishable goods; money, precious metals and stones, jewellery and antiques; means of payment, securities and documents; anything banned by law — narcotics, weapons, counterfeits. Drones are prohibited for individuals, two-way radios and transmitters need a permit, and medicines in commercial quantities must be registered. Air cargo does not accept lithium batteries, power banks, liquids, perfume or magnets — those go by truck or rail only. If in doubt, send the product link and we will check and reply.` },
        { q: 'Who is liable if cargo is lost or damaged?',
          a: `We are, under the contract: insured cargo is compensated at its declared value, and for uninsured cargo the compensation per kg is written into the contract. Because every piece is weighed and photographed at intake, it is easy to establish at which stage the damage occurred. A claim is filed with photos when the cargo is handed over at the Tashkent warehouse.` },
        { q: 'How much is insurance, and is it compulsory?',
          a: `Insurance is ${v.ins}% of the declared value (estimate) and optional. We recommend it for electronics, glass, furniture and lots worth more than $1,000; cheap, sturdy goods are usually shipped without it. The insured value is taken from the invoice and fixed in the contract.` },
        { q: 'Do you sign a contract, and what does it say?',
          a: `Yes, a written contract with every client: the freight rate and pricing rule (kg or m³), the estimated transit time, extra services, insurance, liability and payment terms. Companies receive a tax invoice and an act of completed work; individuals sign a contract too. Our office is at 27 Alisher Navoiy Street, Tashkent — sign in person or remotely.` },
      ],
    },
  ];
}

export const faq: Record<Lang, FaqGroup[]> = { uz: uz(), ru: ru(), en: en() };

/** Flat list of every question in one language (for JSON-LD and counts). */
export const faqItems = (lang: Lang): FaqItem[] => faq[lang].flatMap((g) => g.items);
/** The six questions flagged for the home page, in page order. */
export const faqTop = (lang: Lang): FaqItem[] => faqItems(lang).filter((i) => i.top);

