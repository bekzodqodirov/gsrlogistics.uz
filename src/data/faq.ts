import { pick, type Lang, type Locale, type Localized } from '@/i18n/config';
import { fmtDate, fmtNumber, fmtNumRange, fmtSomRange, fmtUsd, fmtUsdRange, unitWord } from '@/lib/format';
import tariffs from './tariffs.json';

/**
 * FAQ content for /savol-javob/ (+ the six `top` items on the home page).
 * Every price, day range and percentage is read from src/data/tariffs.json at build time, so the
 * answers can never disagree with the pricing page or the calculator. The worked truck examples are
 * computed the same way (see `ex` below) rather than typed in, so their arithmetic cannot go stale.
 * Truck cargo is priced per m³ from the cargo's density — there is no per-kilogram truck rate, and
 * an answer must never imply one. Answers are plain text (no HTML) because they are also emitted as
 * FAQPage JSON-LD.
 */
export interface FaqItem { q: string; a: string; top?: boolean }
export interface FaqGroup { id: string; group: string; items: FaqItem[] }

const T = tariffs;

/**
 * Locale-formatted numbers used inside the answers — every form from src/lib/format.ts, so a zh or fa
 * builder gets its own digits, currency word, ranges ("X تا Y") and unit words (fa writes Persian unit
 * words, never a Latin m³ inside a Persian sentence). Exported for those builders.
 */
export function nums(lang: Lang) {
  const n = (x: number, f = 0) => fmtNumber(x, lang, f);
  const usd = (x: number) => fmtUsd(x, lang);
  const M3 = unitWord('m3', lang);
  const KG = unitWord('kg', lang);
  /** Truck is billed per m³ by density, so its figures carry the m³ unit. */
  const usdM3 = (x: number) => `${usd(x)}/${M3}`;
  const usdRange = (a: number, b: number) => fmtUsdRange(a, b, lang);
  const som = (a: number, b: number) => fmtSomRange(a, b, lang);
  const days = (r: number[]) => fmtNumRange(r[0], r[1], lang, 0);
  const lcl = T.truck.lclPerM3ByDensity;
  /** The same band lookup the calculator uses: the first band the density still fits under. */
  const rateFor = (density: number) => {
    for (const b of lcl) { const max = b.maxKgM3; if (max === null || density <= max) return b.rate; }
    return lcl[lcl.length - 1].rate;
  };
  /**
   * A worked truck example, computed from the sheet instead of typed by hand, so the arithmetic
   * printed in an answer can never drift from the calculator: kg ÷ m³ → density → rate → total.
   */
  const ex = (kg: number, m3: number) => {
    // Owner, 2026-11-08: nothing under the minimum (1 m³) is carried by truck, so no example may sit below it.
    if (m3 < T.truck.minM3) throw new Error(`FAQ truck example ${kg} kg / ${m3} m³ is under the ${T.truck.minM3} m³ minimum`);
    const density = Math.round(kg / m3);
    const perKg = density >= T.truck.perKgFromDensityKgM3;
    const total = perKg ? kg * T.truck.perKgAboveDensity : m3 * rateFor(density);
    return {
      kg: n(kg), m3: n(m3, 2), d: n(density),
      rate: perKg ? `${usd(T.truck.perKgAboveDensity)}/${KG}` : usdM3(rateFor(density)),
      total: usd(Math.round(total * 100) / 100),
    };
  };
  return {
    t1: usdM3(lcl[0].rate), t1max: n(lcl[0].maxKgM3 ?? 0), t2: usdM3(lcl[1].rate), t2max: n(lcl[1].maxKgM3 ?? 0),
    t3: usdM3(lcl[2].rate), t3max: n(lcl[2].maxKgM3 ?? 0), t4: usdM3(lcl[3].rate), t4max: n(lcl[3].maxKgM3 ?? 0),
    tTop: usdM3(lcl[lcl.length - 1].rate), tTopMin: n((lcl[lcl.length - 2].maxKgM3 ?? 0) + 1),
    dense: usd(T.truck.perKgAboveDensity),
    airStd: usd(T.air.perKg.standard), airBrand: usd(T.air.perKg.brand), airCom: usd(T.air.perKg.commercial), airMin: n(T.air.minKg, 1),
    lclFrom: usdM3(lcl[0].rate), minM3: n(T.truck.minM3, 1),
    r20: usdRange(T.rail.container20ft[0], T.rail.container20ft[1]), r40: usdRange(T.rail.container40ft[0], T.rail.container40ft[1]),
    truckDays: days(T.truck.days), airDays: days(T.air.days), railDays: days(T.rail.days), expressDays: days(T.truck.expressDays),
    threshold: n(T.truck.perKgFromDensityKgM3), divAir: n(T.air.volumetricDivisor),
    /** Worked examples, all straight from the density sheet: the smallest lot accepted, dense, light, denser-than-water. */
    exMin: ex(240, 1), exDense: ex(300, 1.2), exLight: ex(180, 2), exHeavy: ex(1200, 1),
    /** The same 300 kg loosely packed — paired with `exDense` to show what repacking is worth. */
    exBulky: ex(300, 2),
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
          a: `Avto kargo (yigʻma yuk, карго) kub metr boʻyicha hisoblanadi: yukning zichligi — umumiy ogʻirlik (kg) ÷ umumiy hajm (m³) — bir m³ narxini tanlaydi. ${v.t1max} kg/m³ gacha ${v.t1}, ${v.t2max} kg/m³ gacha ${v.t2}, ${v.t3max} kg/m³ gacha ${v.t3}, ${v.t4max} kg/m³ gacha ${v.t4} — jadval shu tartibda koʻtarilib, ${v.tTopMin} kg/m³ dan boshlab ${v.tTop} ga yetadi; zichlik ${v.threshold} kg/m³ ga yetsa (metall, plitka kabi), hisob kilogrammga oʻtadi — ${v.dense}/kg. Masalan, ${v.exMin.kg} kg yuk ${v.exMin.m3} m³ joyni egallasa, zichlik ${v.exMin.d} kg/m³, tarif ${v.exMin.rate}, jami ${v.exMin.total}. Avia kargo esa kilogramm boʻyicha: haqiqiy va hajmiy vazndan (uzunlik × en × balandlik (sm) ÷ ${v.divAir}) kattasi olinadi, ${v.airStd}/kg dan. Yigʻma yuk kamida ${v.minM3} m³ dan qabul qilinadi; narxlar taxminiy — aniq summani kalkulyatorda hisoblang, menejer Telegramda tasdiqlaydi.` },
        { q: 'Xitoydan 1 kg yuk olib kelish qancha turadi?',
          a: `Avto kargoda kilogramm narxi yoʻq: hisob kub metr boʻyicha yuritiladi, shuning uchun bitta kilogramm qancha joy egallashiga qarab turlicha turadi. Yengil va hajmli yuk (zichlik ${v.t1max} kg/m³ gacha) — ${v.t1}, ${v.t2max} kg/m³ gacha — ${v.t2}, ${v.t3max} kg/m³ gacha — ${v.t3}, undan zichroq yuk uchun jadval ${v.tTop} gacha koʻtariladi; ${v.threshold} kg/m³ va undan zich yuk esa kilogramm boʻyicha ${v.dense}/kg (${v.exHeavy.kg} kg ${v.exHeavy.m3} m³ da — ${v.exHeavy.total}). Masalan, ${v.exLight.kg} kg yengil tovar ${v.exLight.m3} m³ da ${v.exLight.total} turadi, ${v.exDense.kg} kg zichroq tovar esa ${v.exDense.m3} m³ da ${v.exDense.total} — ogʻirroq partiya arzonroq chiqdi, chunki u kamroq joy egalladi. Avia kargo aksincha, kilogramm boʻyicha: oddiy tovar ${v.airStd}/kg, brend ${v.airBrand}/kg, tijorat seriyasi ${v.airCom}/kg. Narxlar taxminiy (yangilangan: ${v.updated}); yakuniy narx yukning zichligi, toifasi va partiyasiga qarab shartnomada belgilanadi.` },
        { q: 'Minimal ogʻirlik yoki hajm bormi?',
          a: `Ha. Yigʻma yuk (avto kargo) kamida ${v.minM3} m³ dan qabul qilinadi — undan kichik yukni olib kelmaymiz. ${v.minM3} m³ — bitta partiyaning umumiy hajmi: turli sotuvchilardan kelgan joylar Ivudagi qabul punktida bitta GS kodi ostida yigʻiladi. ${v.minM3} m³ dan kichik yukni avia bilan joʻnatish mumkin — ${v.airMin} kg dan. Ogʻirlik boʻyicha alohida chegara yoʻq: avto kargoda narxni zichlik (kg/m³) belgilaydi, butun konteyner shart emas — faqat oʻz hajmingiz uchun toʻlaysiz.` },
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
          a: `Shoshilinch, yengil va qimmat tovar uchun avia (${v.airDays} kun, ${v.airStd}/kg dan); kiyim, poyabzal, maishiy tovarlar kabi hajmli yuk uchun avto yigʻma yuk (${v.truckDays} kun, ${v.lclFrom} dan); 10 m³ dan katta partiyalar uchun 20 yoki 40 futlik konteyner (${v.railDays} kun, 20 ft taxminan ${v.r20}, 40 ft ${v.r40}). Batareyali, suyuq va magnitli tovarlar faqat avto bilan yigʻma yuk sifatida (kamida ${v.minM3} m³ dan) yoki temir yoʻlda butun konteynerda ketadi. Menejer yukingizni koʻrib, ikki-uch variantni narxi bilan taklif qiladi.` },
        { q: 'Xorgosda kechikishlar boʻladimi?',
          a: `Ha, chegarada navbat boʻlishi mumkin — odatda 1–3 kun, bayram va mavsum oldi haftalarida koʻproq. Shuning uchun muddatni aniq kun bilan emas, oraliq bilan (${v.truckDays} kun) aytamiz. Kechikish boʻlsa, menejer sababini va yangi taxminiy sanani Telegramda yozadi.` },
        { q: 'Yuk qayerdaligini qanday bilaman?',
          a: `Kuzatuv botida — @GSR_GROUP_AGENT_bot — har bir qutingizning holati koʻrinadi: Xitoyda qabul qilindi · Konsolidatsiya · Yoʻlda · Chegara va bojxona · Toshkent omborida · Yetkazildi. Xitoydagi qabul punktida har qutiga QR kod yopishtiriladi, keyingi har bosqichda xodimlar uni skanerlaydi — siz oʻz akkauntingizda shu skanlarni sutkaning istalgan vaqtida koʻrasiz. Har qabulda foto-hisobot ham keladi; savol qolsa, menejer joriy holat va foto bilan javob beradi. Xitoy ichidagi kuryer trek-kodi (1688, Taobao) bundan alohida — uni qabulda tekshiramiz.` },
      ],
    },
    {
      id: 'buyurtma', group: 'Buyurtma va ombor',
      items: [
        { q: 'Ishni qanday boshlayman va yukni Xitoyda qayerga yuboraman?',
          a: `Telegramda yozasiz yoki qoʻngʻiroq qilasiz; transport turi, hujjatlar va qadoqlashni kelishib, shartnoma tuzamiz. Xitoyda uchta qabul manzili bor: Ivu (义乌), Guanchjou va Qashqar — qaysi biriga joʻnatish kerakligini menejer aytadi. Menejer sizga GS kodingizni (markirovka) ham beradi: yetkazib beruvchi joʻnatishdan oldin GS kodni har bir qutiga yozadi va tovarni shu manzilga joʻnatadi. Yukni faqat qabul manzili (ombor, sklad, склад) va GS kod tasdiqlangandan keyin joʻnating — tovar adashib ketmasligi uchun.` },
        { q: 'Bir nechta yetkazib beruvchidan kelgan tovarni birlashtira olasizmi?',
          a: `Ha, konsolidatsiya — asosiy ishimiz. Turli zavod va doʻkonlardan kelgan joylarni Ivu omborida bitta GS kodi ostida yigʻamiz, qayta oʻlchaymiz va bitta partiyada joʻnatamiz. Bu har joyni alohida joʻnatishdan arzon: joylar zich taxlanadi va partiyaning umumiy hajmi kichrayadi — avto kargo aynan hajm boʻyicha hisoblangani uchun bu summani tushiradi. Yigʻma yukning ${v.minM3} m³ minimumi ham butun partiyaga qoʻllanadi: turli sotuvchilardan kelgan kichik joylar birgalikda ${v.minM3} m³ ga yetsa, yuk qabul qilinadi. Kutilayotgan joylar haqida menejerga oldindan xabar bering.` },
        { q: 'Omborda yuk necha kun bepul saqlanadi?',
          a: `Ivu omborida ${v.storeCn} kun, Toshkent omborida ${v.storeTz} kun bepul. Undan keyin saqlash uchun kunlik toʻlov shartnoma boʻyicha hisoblanadi. Uzoqroq saqlash kerak boʻlsa — masalan, partiyani toʻldirish uchun — menejer bilan oldindan kelishib oling.` },
        { q: 'Tovarni tekshirib, foto yuborasizmi?',
          a: `Ha, har bir qabulda standart foto-hisobot: qadoq, yorliq, ogʻirlik va oʻlchamlar (${v.photo} har bir joy uchun). Batafsil tekshiruv — soni, rangi, oʻlchami, ishlashi — ${v.inspect}/kg dan buyurtma qilinadi. Nuqson topilsa, almashtirish yoki qaytarishni yetkazib beruvchi bilan Xitoyning oʻzida hal qilamiz — tovar Toshkentga joʻnatilmasdan turib.` },
        { q: 'Qayta qadoqlash bepulmi?',
          a: `Yoʻq, qayta qadoqlash ${v.repack}/kg. Lekin koʻp hollarda u oʻzini oqlaydi: zavod qadogʻidagi havo hajmni oshiradi, avto kargo hisobi esa hajmdan yuritiladi. Zichroq taxlanganda bir m³ narxi biroz koʻtariladi, lekin m³ soni kamayib umumiy summa odatda tushadi: ${v.exBulky.kg} kg tovar ${v.exBulky.m3} m³ da ${v.exBulky.rate} boʻyicha ${v.exBulky.total}, oʻsha ${v.exDense.kg} kg ${v.exDense.m3} m³ ga siqilganda ${v.exDense.rate} boʻyicha ${v.exDense.total}. Menejer qayta qadoqlashdan oldin ikkala hisobni koʻrsatadi. Mebel va shisha kabi nozik tovarlar uchun yogʻoch ramka alohida hisoblanadi.` },
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
          a: `Havolani, rang-oʻlcham va sonini Telegramda yuborasiz; biz sotuvchi bilan kelishib, umumiy summani yuanda hisoblaymiz. Siz soʻmda yoki dollarda toʻlaysiz, biz yuanda toʻlaymiz — komissiya ${v.comm}% dan (taxminiy). Buyurtmaning umumiy hajmi kamida ${v.minM3} m³ boʻlishi kerak — bitta dona yoki mayda buyurtmalarni olmaymiz; bir necha tovar, hatto turli sotuvchilardan boʻlsa ham, bitta buyurtmaga jamlanadi. Tovar Ivu omboriga keladi, tekshiriladi va boshqa buyurtmalaringiz bilan bitta partiyaga qoʻshiladi. Humo va Uzcard kartalari Xitoy saytlarida ishlamaydi — toʻlovni biz qilamiz.` },
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
          a: `Portlovchi va yonuvchi moddalar; oʻsimlik, hayvon va tez buziladigan mahsulotlar; pul, qimmatbaho metall va toshlar, zargarlik va antiqa buyumlar; toʻlov vositalari, qimmatli qogʻozlar va hujjatlar; qonun bilan taqiqlangan barcha narsalar — narkotik, qurol, kontrafakt. Dronlar jismoniy shaxslar uchun taqiqlangan, ratsiya va radiouzatgichlar uchun ruxsatnoma kerak, dori-darmon tijorat maqsadida faqat roʻyxatdan oʻtgan boʻlsa olib kelinadi. Avia orqali litiy batareya, power bank, suyuqlik, atir va magnit yuborilmaydi — ular faqat avto bilan yigʻma yuk sifatida (kamida ${v.minM3} m³ dan) yoki temir yoʻlda butun konteynerda ketadi. Shubhangiz boʻlsa, tovar havolasini yuboring — tekshirib javob beramiz.` },
        { q: 'Yuk yoʻqolsa yoki shikastlansa kim javob beradi?',
          a: `Shartnoma boʻyicha biz javob beramiz: sugʻurtalangan yuk uchun eʼlon qilingan qiymat qaytariladi, sugʻurtasiz yuk uchun tovon miqdori shartnomada kg boʻyicha belgilanadi. Har qabulda tortish va foto-hisobot boʻlgani uchun yuk qaysi bosqichda shikastlanganini aniqlash oson. Daʼvo Toshkent omborida yukni olayotganda, foto bilan rasmiylashtiriladi.` },
        { q: 'Sugʻurta qancha va u shartmi?',
          a: `Sugʻurta — eʼlon qilingan qiymatning ${v.ins}% (taxminiy) va ixtiyoriy. Elektronika, shisha, mebel va 1 000 $ dan qimmat partiyalar uchun tavsiya qilamiz; arzon va mustahkam tovarlarni koʻpchilik sugʻurtasiz joʻnatadi. Sugʻurta qiymati invoys boʻyicha belgilanadi va shartnomaga yoziladi.` },
        { q: 'Shartnoma tuzasizmi va unda nima yoziladi?',
          a: `Ha, har bir mijoz bilan yozma shartnoma tuzamiz: tashish narxi va qoidasi (kg yoki m³), taxminiy muddat, qoʻshimcha xizmatlar, sugʻurta, javobgarlik va toʻlov tartibi. Yuridik shaxslarga hisob-faktura va bajarilgan ishlar dalolatnomasi beriladi; jismoniy shaxslar bilan ham shartnoma majburiy. Ofisimiz Toshkent, Alisher Navoiy koʻchasi, 27 — kelib imzolashingiz yoki masofadan tuzishingiz mumkin.` },
      ],
    },
    {
      id: 'kompaniya', group: 'Kompaniya haqida',
      items: [
        { q: 'GSR Logistics ofisi qayerda va qachon ishlaydi?',
          a: `Ofis: Toshkent, Shayxontohur tumani, Alisher Navoiy koʻchasi, 27 (Alisher Navoiy metrosi yonida). Ish vaqti: dushanba–shanba 9:00–19:00, yakshanba — dam olish kuni. Telefon +998 95 018 33 33, qoʻshimcha +998 90 175 78 00 (WhatsApp), e-mail b.e.kodirov@gmail.com, Telegram-kanal @gsrlogistics. Yuk holatini koʻrsatadigan bot @GSR_GROUP_AGENT_bot sutkaning istalgan vaqtida ishlaydi.` },
        { q: 'Kompaniya qanchalik katta — necha mijoz, oyiga necha konteyner?',
          a: `2018-yildan beri Xitoy bilan ishlaymiz; jamoaning yuk tashish sohasidagi tajribasi — 15 yil. Oyiga 50–100 konteyner Xitoydan Toshkentga keladi, 400+ mijozga xizmat koʻrsatganmiz. Yuridik shaxs — Imex services LLC; ijtimoiy tarmoqlarda GSR Group nomi bilan ham tanilganmiz.` },
        { q: 'Xitoydagi qabul manzillari sizning omboringizmi?',
          a: `Ivu, Guanchjou va Qashqardagi manzillar — yukingiz qabul qilinadigan qabul punktlari. Qaysi biriga joʻnatishni menejer aytadi. Har qabulda yuk suratga olinadi, sanaladi, tortiladi va oʻlchanadi, har bir qutiga QR kod yopishtiriladi — foto-hisobot Telegramga keladi.` },
      ],
    },
    {
      // Afghanistan, transit documents and the warehouse under customs control in Tashkent (new, 2026-11-12).
      // Quoted on request (owner, 2026-11-11): no price and no number of days here, and no `top` item — the
      // home page's short FAQ stays as it is. The warehouse is a partner's; Persian is answered through a translator.
      id: 'regional', group: 'Afgʻoniston, tranzit va ombor',
      items: [
        { q: 'Afgʻonistonga yuk tashiysizmi va qayergacha yetkazasiz?',
          a: `Ha, endi Afgʻonistonga ham fura bilan yuk tashiymiz — Hayraton chegara postigacha yoki Mozori Sharifgacha. Yuk Xitoydan (Oʻzbekiston orqali tranzit tartibida) yoki Oʻzbekistondan joʻnatiladi. Butun fura ham, yigʻma yuk ham olamiz. Bugungi kunda yetkazish nuqtalari shu ikkita.` },
        { q: 'Afgʻonistonga yuk tashish qancha turadi va qancha vaqt oladi?',
          a: `Narx va muddat — soʻrov boʻyicha: menejer ularni yukingiz boʻyicha hisoblab beradi. Buning uchun yuk nomini, hajmi yoki ogʻirligini, qayerdan va qayerga ekanini yozing. Saytdagi tariflar, kalkulyator va muddatlar faqat Xitoy → Toshkent yoʻnalishiga tegishli.` },
        { q: 'Oʻzbekiston orqali tranzit yuk uchun qaysi hujjatlarni rasmiylashtirasiz?',
          a: `Toʻrt ishni qilamiz: tranzit deklaratsiyasini topshiramiz, CMR va TIR hujjatlarini tayyorlab tekshiramiz, xorijiy furalarga ruxsatnoma olishda yordam beramiz va tranzit yuki uchun bojxona toʻlovlari taʼminotini (kafolatni) rasmiylashtirishda yordam beramiz. Deklaratsiyani bojxonaga oʻz bojxona brokerimiz topshiradi. Furani chegarada kutib olamiz va kuzatib qoʻyamiz. Narx — soʻrov boʻyicha.` },
        { q: 'Toshkentda yukni saqlash yoki boshqa furaga qayta yuklash mumkinmi?',
          a: `Ha: Toshkentda bojxona nazoratidagi ombordan mijozlarimizga joy ajratamiz va yukni qayta yuklaymiz — furadan furaga yoki ombor orqali. Ombor hamkorimizga tegishli; yuk u yerda bojxona nazorati ostida saqlanadi. Saqlash muddati va narxini menejer yukingiz boʻyicha aytadi.` },
        { q: 'Fors yoki dari tilida yozsam boʻladimi va qayerga yozaman?',
          a: `Ha. Fors yoki dari tilida yozsangiz, tarjimon yordamida forscha javob beramiz. Ingliz, rus va oʻzbek tillarida ham javob beramiz. WhatsApp (+998 90 175 78 00) yoki Telegramga yozing.` },
        { q: 'Afgʻonistonlik tadbirkor uchun Xitoydan tovar topib, sotib olib berasizmi?',
          a: `Ha. Xitoyda tovar topish va sotib olish xizmati afgʻonistonlik tadbirkorlar uchun ham ishlaydi: tovarni topamiz, sotib olamiz va fura bilan Hayraton yoki Mozori Sharifgacha yetkazamiz. Shartlarni menejer buyurtmadan oldin aytadi.` },
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
          a: `Авто карго (сборный груз) считается по кубометрам: плотность груза — общий вес (кг) ÷ общий объём (м³) — выбирает цену за 1 м³. До ${v.t1max} кг/м³ — ${v.t1}, до ${v.t2max} кг/м³ — ${v.t2}, до ${v.t3max} кг/м³ — ${v.t3}, до ${v.t4max} кг/м³ — ${v.t4}, и дальше по шкале: от ${v.tTopMin} кг/м³ — ${v.tTop}; при плотности ${v.threshold} кг/м³ и выше (металл, плитка) расчёт переходит на килограммы — ${v.dense}/кг. Пример: ${v.exMin.kg} кг занимают ${v.exMin.m3} м³ — это ${v.exMin.d} кг/м³, значит ${v.exMin.rate}, итого ${v.exMin.total}. Авиа карго, наоборот, считается по килограммам: берётся больший из фактического и объёмного веса (длина × ширина × высота (см) ÷ ${v.divAir}), от ${v.airStd}/кг. Сборный груз принимаем от ${v.minM3} м³; цены ориентировочные — точную сумму посчитайте в калькуляторе, менеджер подтвердит её в Telegram.` },
        { q: 'Сколько стоит доставить 1 кг из Китая?',
          a: `В авто карго цены за килограмм нет: расчёт идёт по кубометрам, поэтому один и тот же килограмм стоит по-разному — всё зависит от того, сколько места он занимает. Лёгкий и объёмный груз (плотность до ${v.t1max} кг/м³) — ${v.t1}, до ${v.t2max} кг/м³ — ${v.t2}, до ${v.t3max} кг/м³ — ${v.t3}, дальше шкала поднимается до ${v.tTop}, а груз плотностью ${v.threshold} кг/м³ и выше считается по килограммам, ${v.dense}/кг (${v.exHeavy.kg} кг в ${v.exHeavy.m3} м³ — ${v.exHeavy.total}). Пример: ${v.exLight.kg} кг лёгкого товара в ${v.exLight.m3} м³ стоят ${v.exLight.total}, а ${v.exDense.kg} кг плотного товара в ${v.exDense.m3} м³ — ${v.exDense.total}: партия тяжелее, а вышла дешевле, потому что заняла меньше места. Авиа карго, наоборот, считается по килограммам: обычный товар ${v.airStd}/кг, бренд ${v.airBrand}/кг, коммерческая серия ${v.airCom}/кг. Цены ориентировочные (обновлено: ${v.updated}); итоговая ставка фиксируется в договоре с учётом плотности, категории товара и партии.` },
        { q: 'Есть ли минимальный вес или объём?',
          a: `Да. Сборный груз (авто карго) принимаем от ${v.minM3} м³ — груз меньшего объёма мы не везём. ${v.minM3} м³ — это общий объём одной партии: места от разных продавцов собираются в пункте приёма в Иу под одним GS-кодом. Груз меньше ${v.minM3} м³ можно отправить авиа — от ${v.airMin} кг. Отдельной нижней границы по весу нет: в авто карго цену определяет плотность (кг/м³), целый контейнер не нужен — вы платите только за свой объём.` },
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
          a: `Срочный, лёгкий и дорогой товар — авиа (${v.airDays} дней, от ${v.airStd}/кг); объёмный груз вроде одежды, обуви и бытовых товаров — сборный авто (${v.truckDays} дней, от ${v.lclFrom}); партии больше 10 м³ — контейнер 20 или 40 футов (${v.railDays} дней, 20 ft ориентировочно ${v.r20}, 40 ft ${v.r40}). Товары с батареями, жидкости и магниты едут только авто сборным грузом (от ${v.minM3} м³) или по железной дороге целым контейнером. Менеджер посмотрит на ваш груз и предложит два-три варианта с ценой.` },
        { q: 'Бывают ли задержки на Хоргосе?',
          a: `Да, на границе бывает очередь — обычно 1–3 дня, перед праздниками и в сезон дольше. Поэтому срок мы называем интервалом (${v.truckDays} дней), а не точной датой. Если задержка случилась, менеджер пишет в Telegram причину и новую ориентировочную дату.` },
        { q: 'Как узнать, где сейчас мой груз?',
          a: `В боте @GSR_GROUP_AGENT_bot виден статус каждой вашей коробки: Принят в Китае · Консолидация · В пути · Граница и таможня · На складе в Ташкенте · Доставлено. В пункте приёма в Китае на каждую коробку клеится QR-код, на каждом следующем этапе его сканируют сотрудники — вы видите эти сканы в своём аккаунте в любое время суток. При каждой приёмке приходит и фотоотчёт; если остался вопрос, менеджер ответит текущим статусом и фото. Трек-номер китайского курьера (1688, Taobao) — отдельная вещь, его мы сверяем при приёмке.` },
      ],
    },
    {
      id: 'zakaz', group: 'Заказ и склад',
      items: [
        { q: 'С чего начать и куда отправлять груз в Китае?',
          a: `Пишете в Telegram или звоните; согласуем вид транспорта, документы и упаковку, заключаем договор. В Китае три адреса приёма: Иу (义乌), Гуанчжоу и Кашгар — на какой отправлять, скажет менеджер. Он же даёт ваш GS-код (маркировка): поставщик пишет GS-код на каждой коробке до отправки и шлёт товар на этот адрес. Отправляйте товар только с подтверждённым адресом приёма (склад) и GS-кодом — чтобы груз не потерялся.` },
        { q: 'Можно ли объединить товар от нескольких поставщиков?',
          a: `Да, консолидация — наша основная работа. Места от разных фабрик и магазинов собираем на складе в Иу под одним GS-кодом, перемеряем и отправляем одной партией. Это дешевле, чем везти каждое место отдельно: коробки укладываются плотно и общий объём партии становится меньше — а авто карго считается именно по объёму. Минимум сборного груза (${v.minM3} м³) тоже считается на всю партию: мелкие места от разных продавцов вместе набирают ${v.minM3} м³ — и груз принимается. Предупредите менеджера заранее, какие места ожидаются.` },
        { q: 'Сколько дней груз хранится на складе бесплатно?',
          a: `На складе в Иу — ${v.storeCn} дней, на складе в Ташкенте — ${v.storeTz} дня. Дальше хранение считается посуточно по договору. Если нужно держать груз дольше — например, чтобы добрать партию, — договоритесь с менеджером заранее.` },
        { q: 'Проверяете ли товар и присылаете ли фото?',
          a: `Да, при каждой приёмке — стандартный фотоотчёт: упаковка, маркировка, вес и габариты (${v.photo} за место). Детальная проверка — количество, цвет, размер, работоспособность — заказывается от ${v.inspect}/кг. Если найден брак, замену или возврат решаем с поставщиком ещё в Китае — до отправки в Ташкент.` },
        { q: 'Переупаковка бесплатная?',
          a: `Нет, переупаковка стоит ${v.repack}/кг. Но чаще всего она окупается: воздух в заводской упаковке раздувает объём, а авто карго считается по объёму. При плотной укладке цена за 1 м³ немного растёт, но кубометров становится меньше и итог обычно падает: ${v.exBulky.kg} кг в ${v.exBulky.m3} м³ — это ${v.exBulky.rate}, то есть ${v.exBulky.total}, а те же ${v.exDense.kg} кг, ужатые в ${v.exDense.m3} м³, — ${v.exDense.rate}, то есть ${v.exDense.total}. Менеджер покажет оба расчёта до переупаковки. Для хрупких товаров — мебель, стекло — деревянная обрешётка считается отдельно.` },
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
          a: `Присылаете ссылку, цвет, размер и количество в Telegram; мы согласуем условия с продавцом и считаем итог в юанях. Вы платите в сумах или долларах, мы платим в юанях — комиссия от ${v.comm}% (ориентировочно). Общий объём заказа — от ${v.minM3} м³: единичные и мелкие заказы не берём, а несколько товаров, даже от разных продавцов, объединяются в один заказ. Товар приходит на склад в Иу, проверяется и объединяется с другими вашими заказами в одну партию. Карты Humo и Uzcard на китайских площадках не работают — оплату проводим мы.` },
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
          a: `Взрывчатые и горючие вещества; растения, животных и скоропортящиеся продукты; деньги, драгоценные металлы и камни, ювелирные и антикварные изделия; платёжные средства, ценные бумаги и документы; всё, что запрещено законом, — наркотики, оружие, контрафакт. Дроны для физических лиц запрещены, рации и радиопередатчики требуют разрешения, лекарства в коммерческих объёмах — только зарегистрированные. Авиа не принимает литиевые батареи, пауэрбанки, жидкости, парфюмерию и магниты — они едут только авто сборным грузом (от ${v.minM3} м³) или по железной дороге целым контейнером. Сомневаетесь — пришлите ссылку на товар, проверим и ответим.` },
        { q: 'Кто отвечает, если груз потерян или повреждён?',
          a: `По договору отвечаем мы: за застрахованный груз возвращается заявленная стоимость, для незастрахованного размер компенсации прописан в договоре из расчёта за кг. Поскольку каждое место взвешивается и фотографируется при приёмке, легко установить, на каком этапе груз пострадал. Претензия оформляется при выдаче на складе в Ташкенте, с фото.` },
        { q: 'Сколько стоит страховка и обязательна ли она?',
          a: `Страховка — ${v.ins}% от заявленной стоимости (ориентировочно), по желанию. Рекомендуем её для электроники, стекла, мебели и партий дороже 1 000 $; дешёвый и прочный товар большинство отправляет без страховки. Страховая стоимость берётся по инвойсу и фиксируется в договоре.` },
        { q: 'Вы заключаете договор и что в нём прописано?',
          a: `Да, с каждым клиентом — письменный договор: цена и правило расчёта (кг или м³), ориентировочный срок, дополнительные услуги, страховка, ответственность и порядок оплаты. Юридическим лицам выдаём счёт-фактуру и акт выполненных работ; с физическими лицами договор тоже обязателен. Офис — Ташкент, ул. Алишера Навои, 27: можно подписать лично или дистанционно.` },
      ],
    },
    {
      id: 'kompaniya', group: 'О компании',
      items: [
        { q: 'Где офис GSR Logistics и когда он работает?',
          a: `Офис: Ташкент, Шайхантахурский район, ул. Алишера Навои, 27 (рядом с метро «Алишер Навои»). Режим: понедельник–суббота 9:00–19:00, воскресенье — выходной. Телефон +998 95 018 33 33, дополнительный +998 90 175 78 00 (WhatsApp), e-mail b.e.kodirov@gmail.com, Telegram-канал @gsrlogistics. Бот со статусом груза @GSR_GROUP_AGENT_bot работает в любое время суток.` },
        { q: 'Насколько крупная компания — сколько клиентов, сколько контейнеров в месяц?',
          a: `Работаем с Китаем с 2018 года; опыт команды в грузоперевозках — 15 лет. В месяц из Китая в Ташкент приходит 50–100 контейнеров, обслужено 400+ клиентов. Юридическое лицо — Imex services LLC; в соцсетях мы известны и как GSR Group.` },
        { q: 'Адреса приёма в Китае — это ваши склады?',
          a: `Адреса в Иу, Гуанчжоу и Кашгаре — пункты приёма, куда поступает ваш груз. Какой из них использовать, скажет менеджер. При каждой приёмке груз фотографируют, пересчитывают, взвешивают и обмеряют, на каждую коробку клеится QR-код — фотоотчёт приходит в Telegram.` },
      ],
    },
    {
      id: 'regional', group: 'Афганистан, транзит и склад',
      items: [
        { q: 'Возите ли вы грузы в Афганистан и до какого пункта?',
          a: `Да, теперь возим грузы фурами и в Афганистан — до пограничного перехода Хайратон или до Мазари-Шарифа. Груз отправляется из Китая (транзитом через Узбекистан) или из Узбекистана. Берём и целую фуру, и сборный груз. Сегодня точек доставки две.` },
        { q: 'Сколько стоит перевозка в Афганистан и сколько времени она занимает?',
          a: `Цена и срок — по запросу: менеджер считает их под ваш груз. Для расчёта напишите, что за груз, его объём или вес, откуда и куда его везти. Тарифы, калькулятор и сроки на сайте относятся только к направлению Китай → Ташкент.` },
        { q: 'Какие документы для транзита через Узбекистан вы оформляете?',
          a: `Четыре вещи: подаём транзитную декларацию, готовим и проверяем документы CMR и TIR, помогаем получить разрешения для иностранных фур и помогаем оформить обеспечение уплаты таможенных платежей (гарантию) для транзитного груза. Декларацию подаёт в таможню наш собственный таможенный брокер. Фуру встречаем на границе и провожаем. Цена — по запросу.` },
        { q: 'Можно ли в Ташкенте оставить груз на хранение или перегрузить его в другую фуру?',
          a: `Да: в Ташкенте мы выделяем клиентам место на складе под таможенным контролем и перегружаем груз — из фуры в фуру или через склад. Склад принадлежит нашему партнёру; груз хранится там под таможенным контролем. Срок и цену хранения менеджер называет под ваш груз.` },
        { q: 'Можно ли писать на фарси или дари и куда писать?',
          a: `Да. Если напишете на фарси или дари, ответим на фарси с помощью переводчика. Отвечаем также на английском, русском и узбекском. Пишите в WhatsApp (+998 90 175 78 00) или в Telegram.` },
        { q: 'Найдёте и выкупите ли вы товар в Китае для предпринимателя из Афганистана?',
          a: `Да. Поиск и выкуп товаров в Китае доступны и предпринимателям из Афганистана: находим товар, выкупаем и доставляем фурой до Хайратона или Мазари-Шарифа. Условия менеджер называет до заказа.` },
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
          a: `Truck cargo (consolidated freight) is priced per cubic metre: the density of the load — total weight (kg) ÷ total volume (m³) — picks the rate for one m³. Up to ${v.t1max} kg/m³ that is ${v.t1}, up to ${v.t2max} kg/m³ ${v.t2}, up to ${v.t3max} kg/m³ ${v.t3}, up to ${v.t4max} kg/m³ ${v.t4}, and the table climbs on: from ${v.tTopMin} kg/m³ it is ${v.tTop}. At ${v.threshold} kg/m³ and above — metal, tiles and the like — the sheet switches to weight at ${v.dense}/kg. Example: ${v.exMin.kg} kg filling ${v.exMin.m3} m³ is ${v.exMin.d} kg/m³, so the rate is ${v.exMin.rate} and the total ${v.exMin.total}. Air cargo is the mode priced per kilogram: you pay for the greater of actual and volumetric weight (length × width × height (cm) ÷ ${v.divAir}), from ${v.airStd}/kg. Consolidated cargo is accepted from ${v.minM3} m³; every price is indicative — run the numbers in the calculator and a manager confirms them on Telegram.` },
        { q: 'How much does it cost to ship 1 kg from China?',
          a: `Truck freight has no per-kilogram price: it is billed per cubic metre, so the same kilogram costs a different amount depending on how much space it takes. Light, bulky cargo (density up to ${v.t1max} kg/m³) is ${v.t1}, up to ${v.t2max} kg/m³ it is ${v.t2}, up to ${v.t3max} kg/m³ ${v.t3}, and the table climbs to ${v.tTop} for the densest bands; cargo at ${v.threshold} kg/m³ and above is billed by weight at ${v.dense}/kg (${v.exHeavy.kg} kg in ${v.exHeavy.m3} m³ comes to ${v.exHeavy.total}). For example, ${v.exLight.kg} kg of light goods in ${v.exLight.m3} m³ costs ${v.exLight.total}, while ${v.exDense.kg} kg of denser goods in ${v.exDense.m3} m³ costs ${v.exDense.total} — the heavier lot is cheaper because it takes up less space. Air cargo is the mode priced per kilogram: ordinary goods ${v.airStd}/kg, branded goods ${v.airBrand}/kg, commercial series ${v.airCom}/kg. These are estimates (updated ${v.updated}); the final rate is fixed in the contract based on density, goods category and batch.` },
        { q: 'Is there a minimum weight or volume?',
          a: `Yes. Consolidated truck cargo is accepted from ${v.minM3} m³ — we do not carry anything smaller. The ${v.minM3} m³ counts across one shipment: pieces from different sellers are gathered at the Yiwu receiving point under one GS code. Cargo under ${v.minM3} m³ can go by air, from ${v.airMin} kg. There is no separate minimum weight: truck freight is priced by density (kg/m³), no whole container is needed, and you pay only for your volume.` },
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
          a: `Urgent, light and high-value goods: air (${v.airDays} days, from ${v.airStd}/kg). Bulky goods such as clothing, footwear and household items: consolidated truck (${v.truckDays} days, from ${v.lclFrom}). Lots above 10 m³: a 20 ft or 40 ft container (${v.railDays} days, 20 ft roughly ${v.r20}, 40 ft ${v.r40}). Goods with batteries, liquids and magnets travel only by truck as consolidated cargo (from ${v.minM3} m³) or by rail in a whole container. A manager looks at your cargo and proposes two or three options with prices.` },
        { q: 'Are there delays at Khorgos?',
          a: `Yes, queues at the border happen — usually 1–3 days, longer before holidays and in peak season. That is why we quote transit as a range (${v.truckDays} days), not a date. If a delay occurs, your manager writes on Telegram with the reason and a new estimated date.` },
        { q: 'How do I know where my cargo is?',
          a: `In the bot @GSR_GROUP_AGENT_bot you see the status of every one of your cartons: Received in China · Consolidation · In transit · Border and customs · At the Tashkent warehouse · Delivered. A QR code goes on every carton at the receiving point in China, and at every stage after that the staff scan it — you watch those scans in your own account at any hour. A photo report also arrives at every intake; if a question remains, a manager replies with the current status and a photo. The Chinese courier tracking number (1688, Taobao) is a separate thing — we check it at intake.` },
      ],
    },
    {
      id: 'orders', group: 'Orders and warehouse',
      items: [
        { q: 'How do I start, and where do I send goods in China?',
          a: `Message us on Telegram or call; we agree the transport mode, documents and packing and sign a contract. There are three receiving addresses in China — Yiwu (义乌), Guangzhou and Kashgar — and your manager tells you which one applies. The manager also gives you your GS code (shipping mark): the supplier writes the GS code on every carton before dispatch and ships to that address. Send your goods only once the receiving address and the GS code are confirmed, so that nothing goes astray.` },
        { q: 'Can you combine goods from several suppliers?',
          a: `Yes — consolidation is our core service. Pieces from different factories and shops are gathered at the Yiwu warehouse under one GS code, re-measured and shipped as one batch. It is cheaper than shipping each piece alone: the cartons stack tightly and the batch ends up occupying fewer cubic metres — and cubic metres are what truck freight is billed on. The ${v.minM3} m³ consolidated minimum also counts across the whole batch: small pieces from different sellers together make up the ${v.minM3} m³, and the cargo is accepted. Tell your manager in advance which pieces to expect.` },
        { q: 'How many days is storage free?',
          a: `${v.storeCn} days at the Yiwu warehouse and ${v.storeTz} days at the Tashkent warehouse. After that, storage is charged per day under the contract. If you need longer — for example to complete a batch — agree it with your manager in advance.` },
        { q: 'Do you inspect the goods and send photos?',
          a: `Yes, every intake comes with a standard photo report: packaging, label, weight and dimensions (${v.photo} per piece). A detailed check — quantity, colour, size, function — can be ordered from ${v.inspect}/kg. If we find a defect, we settle a replacement or return with the supplier while the goods are still in China, before dispatch to Tashkent.` },
        { q: 'Is repacking free?',
          a: `No, repacking costs ${v.repack}/kg. It usually pays for itself, though: air in factory packaging inflates the volume, and truck freight is billed on volume. Packing denser lifts the rate per m³ a little but cuts the number of m³, so the total normally falls: ${v.exBulky.kg} kg in ${v.exBulky.m3} m³ bills at ${v.exBulky.rate}, or ${v.exBulky.total}, while the same ${v.exDense.kg} kg squeezed into ${v.exDense.m3} m³ bills at ${v.exDense.rate}, or ${v.exDense.total}. Your manager shows you both calculations before repacking. Wooden crating for fragile goods such as furniture or glass is quoted separately.` },
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
          a: `Send the link, colour, size and quantity on Telegram; we agree terms with the seller and calculate the total in yuan. You pay in soums or dollars, we pay in yuan — commission from ${v.comm}% (estimate). The order must total at least ${v.minM3} m³ — we do not take single items or small orders, but several products, even from different sellers, combine into one order. The goods arrive at the Yiwu warehouse, are checked and combined with your other orders into one batch. Uzbek Humo and Uzcard cards do not work on Chinese platforms — we make the payment.` },
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
          a: `Explosive and flammable substances; plants, animals and perishable goods; money, precious metals and stones, jewellery and antiques; means of payment, securities and documents; anything banned by law — narcotics, weapons, counterfeits. Drones are prohibited for individuals, two-way radios and transmitters need a permit, and medicines in commercial quantities must be registered. Air cargo does not accept lithium batteries, power banks, liquids, perfume or magnets — those go only by truck as consolidated cargo (from ${v.minM3} m³) or by rail in a whole container. If in doubt, send the product link and we will check and reply.` },
        { q: 'Who is liable if cargo is lost or damaged?',
          a: `We are, under the contract: insured cargo is compensated at its declared value, and for uninsured cargo the compensation per kg is written into the contract. Because every piece is weighed and photographed at intake, it is easy to establish at which stage the damage occurred. A claim is filed with photos when the cargo is handed over at the Tashkent warehouse.` },
        { q: 'How much is insurance, and is it compulsory?',
          a: `Insurance is ${v.ins}% of the declared value (estimate) and optional. We recommend it for electronics, glass, furniture and lots worth more than $1,000; cheap, sturdy goods are usually shipped without it. The insured value is taken from the invoice and fixed in the contract.` },
        { q: 'Do you sign a contract, and what does it say?',
          a: `Yes, a written contract with every client: the freight rate and pricing rule (kg or m³), the estimated transit time, extra services, insurance, liability and payment terms. Companies receive a tax invoice and an act of completed work; individuals sign a contract too. Our office is at 27 Alisher Navoiy Street, Tashkent — sign in person or remotely.` },
      ],
    },
    {
      id: 'company', group: 'About the company',
      items: [
        { q: 'Where is the GSR Logistics office and when is it open?',
          a: `Office: 27 Alisher Navoiy Street, Shaykhantakhur district, Tashkent (next to the Alisher Navoiy metro station). Hours: Monday–Saturday 9:00–19:00, closed on Sunday. Phone +998 95 018 33 33, second line +998 90 175 78 00 (WhatsApp), e-mail b.e.kodirov@gmail.com, Telegram channel @gsrlogistics. The cargo-status bot @GSR_GROUP_AGENT_bot works at any hour.` },
        { q: 'How big is the company — how many clients, how many containers a month?',
          a: `We have worked with China since 2018; the team has 15 years of experience in freight. 50–100 containers a month arrive from China in Tashkent, and we have served 400+ clients. The legal entity is Imex services LLC; on social media we are also known as GSR Group.` },
        { q: 'Are the receiving addresses in China your own warehouses?',
          a: `The addresses in Yiwu, Guangzhou and Kashgar are receiving points where your cargo is accepted. Your manager tells you which one to use. At every intake the cargo is photographed, counted, weighed and measured, and a QR code goes on every carton — the photo report lands in your Telegram.` },
      ],
    },
    {
      id: 'regional', group: 'Afghanistan, transit and warehouse',
      items: [
        { q: 'Do you carry cargo to Afghanistan, and how far?',
          a: `Yes, we now also carry cargo to Afghanistan by truck — to the Hairatan border crossing or to Mazar-i-Sharif. The cargo starts in China (and crosses Uzbekistan in transit) or in Uzbekistan. We take a full truck or consolidated cargo. Today these are the two delivery points.` },
        { q: 'What does cargo to Afghanistan cost, and how long does it take?',
          a: `Price and timing are on request: the manager calculates them for your cargo. For the calculation, tell us what the cargo is, its volume or weight, and from where to where. The tariffs, the calculator and the transit times on this site apply to the China → Tashkent direction only.` },
        { q: 'Which documents do you handle for transit through Uzbekistan?',
          a: `Four things: we file the transit declaration, prepare and check the CMR and TIR documents, help foreign trucks obtain permits, and help arrange security for customs payments (a guarantee) for transit cargo. The declaration is filed at customs by our own customs broker. We meet the truck at the border and see it off. The price is on request.` },
        { q: 'Can I store cargo in Tashkent or reload it onto another truck?',
          a: `Yes: in Tashkent we allocate space for our clients in a warehouse under customs control and reload cargo — truck to truck or through the warehouse. The warehouse belongs to our partner; cargo is stored there under customs control. The manager names the storage time and the price for your cargo.` },
        { q: 'Can I write in Persian or Dari, and where?',
          a: `Yes. Write to us in Persian or Dari — we answer in Persian with the help of a translator. We also answer in English, Russian and Uzbek. Message us on WhatsApp (+998 90 175 78 00) or Telegram.` },
        { q: 'Can you find and buy goods in China for an Afghan business?',
          a: `Yes. Our sourcing and buying service in China is open to Afghan businesspeople too: we find the goods, buy them and deliver them by truck to Hairatan or Mazar-i-Sharif. The manager states the terms before the order.` },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ ZH */
/** Simplified Chinese, translated from en() item by item (GLOSSARY.md terms); figures come from nums('zh'). */
function zh(): FaqGroup[] {
  const v = nums('zh');
  return [
    {
      id: 'prices', group: '价格与付款',
      items: [
        { top: true, q: '货运价格怎么算——按公斤还是按立方米？',
          a: `汽运（拼货）按立方米计价：货物密度——总重量（kg）÷ 总体积（m³）——决定每立方米的费率。密度不超过 ${v.t1max} kg/m³ 为 ${v.t1}，不超过 ${v.t2max} kg/m³ 为 ${v.t2}，不超过 ${v.t3max} kg/m³ 为 ${v.t3}，不超过 ${v.t4max} kg/m³ 为 ${v.t4}，之后逐档上升：${v.tTopMin} kg/m³ 起为 ${v.tTop}。密度达到 ${v.threshold} kg/m³ 及以上的货物——金属、瓷砖等——改为按重量计费，${v.dense}/kg。例如：${v.exMin.kg} kg 的货物占 ${v.exMin.m3} m³，密度为 ${v.exMin.d} kg/m³，因此费率为 ${v.exMin.rate}，运费合计 ${v.exMin.total}。按公斤计价的是空运：按实际重量和体积重（长 × 宽 × 高（cm）÷ ${v.divAir}）中较大者付费，${v.airStd}/kg 起。拼货 ${v.minM3} m³ 起收；所有价格均为参考价——请用运费计算器估算，客户经理会在 Telegram 上为您确认。` },
        { q: '从中国运 1 kg 货物要多少钱？',
          a: `汽运没有按公斤的价格：它按立方米计费，所以同样重量的货物，占用的空间不同，运费也不同。轻泡货（密度不超过 ${v.t1max} kg/m³）为 ${v.t1}，不超过 ${v.t2max} kg/m³ 为 ${v.t2}，不超过 ${v.t3max} kg/m³ 为 ${v.t3}，密度最高的几档升至 ${v.tTop}；密度达到 ${v.threshold} kg/m³ 及以上的货物按重量计费，${v.dense}/kg（${v.exHeavy.m3} m³ 装 ${v.exHeavy.kg} kg，运费为 ${v.exHeavy.total}）。例如，${v.exLight.kg} kg 的轻货占 ${v.exLight.m3} m³，运费 ${v.exLight.total}；而 ${v.exDense.kg} kg 较重的货物占 ${v.exDense.m3} m³，运费 ${v.exDense.total}——更重的那批反而更便宜，因为它占用的空间更小。按公斤计价的是空运：普货 ${v.airStd}/kg，品牌货 ${v.airBrand}/kg，商业批量货 ${v.airCom}/kg。以上均为参考价（更新于 ${v.updated}）；最终运价根据密度、货物类别和批量写入合同。` },
        { q: '有最低重量或体积要求吗？',
          a: `有。汽运拼货 ${v.minM3} m³ 起收——更小的货量我们不承运。${v.minM3} m³ 按一批货物合计：来自不同卖家的货物在义乌收货点归入同一个 GS 客户代码。不足 ${v.minM3} m³ 的货物可以走空运，${v.airMin} kg 起。没有单独的最低重量：汽运按密度（kg/m³）计价，不需要包整柜，您只需按自己货物的体积付费。` },
        { q: '价格包含哪些费用？哪些另计？',
          a: `价格包含义乌仓库收货、称重和测量、集货、经霍尔果斯运至塔什干，以及在塔什干仓库卸货。另行收费的项目：保险（申报价值的 ${v.ins}%）、关税和增值税（按海关编码计算）、重新包装（${v.repack}/kg）、详细验货（${v.inspect}/kg）以及各州的送货上门。每项附加费用都在合同中单独列明——没有隐藏费用。` },
        { q: '什么时候付款？怎么付？',
          a: `运费在货物运抵塔什干后、提货前以乌兹别克斯坦苏姆支付；价格以美元商定，汇率按付款当日确定。付款方式：银行卡转账、Click 或 Payme、现金，企业客户也可凭发票银行转账。代采购服务的货款需提前支付——见“寻找货源与代采购”。` },
        { q: '能送到各州吗？费用多少？',
          a: `能，我们送往乌兹别克斯坦所有州。转运到您所在州的条件由客户经理确认；送货上门约 ${v.door}。在塔什干，超过 ${v.doorFreeKg} kg 的货物免费送货上门。货物在塔什干仓库卸货后，客户经理会确认发运日期。` },
      ],
    },
    {
      id: 'transit', group: '时效与路线',
      items: [
        { top: true, q: '从中国到塔什干货运需要多少天？',
          a: `汽运拼货约需 ${v.truckDays} 天，空运 ${v.airDays} 天，铁路集装箱 ${v.railDays} 天。时效从义乌仓库发车起算；快的批次曾在 ${v.expressDays} 天内到达。春节前后（1月至2月）、国庆黄金周（10月初）和双十一（11.11）期间，需再加 1–2 周。` },
        { q: '货物走哪条路线？',
          a: `主要路线为义乌 → 乌鲁木齐 → 霍尔果斯（中哈边境）→ 阿拉木图 → 奇姆肯特 → 塔什干，全程 5,000 多公里。前往费尔干纳盆地还有一条喀什 → 伊尔克什坦 → 奥什 → 安集延的线路，从中国西部出发要短数百公里；拼货默认经霍尔果斯运输。空运从广州或乌鲁木齐起飞；铁路集装箱经多斯特克和阿腾科里口岸过境。中吉乌铁路仍在建设中，不在我们的线路之内。` },
        { q: '空运、汽运还是铁路——哪种适合我？',
          a: `急用、轻便和高价值的货物：空运（${v.airDays} 天，${v.airStd}/kg 起）。服装、鞋类、家居用品等体积大的货物：汽运拼货（${v.truckDays} 天，${v.lclFrom} 起）。超过 10 m³ 的货物：20 英尺或 40 英尺集装箱（${v.railDays} 天，20 英尺约 ${v.r20}，40 英尺 ${v.r40}）。带电池、液体和磁铁的货物只能以拼货方式走汽运（${v.minM3} m³ 起）或整柜走铁路。客户经理会查看您的货物，提出 2–3 个方案并附上报价。` },
        { q: '霍尔果斯会有延误吗？',
          a: `会，边境排队时有发生——通常 1–3 天，节假日前和旺季会更长。因此我们给出的时效是一个区间（${v.truckDays} 天），而不是具体日期。如出现延误，客户经理会在 Telegram 上告知原因和新的预计日期。` },
        { q: '怎么知道我的货物在哪里？',
          a: `在机器人 @GSR_GROUP_AGENT_bot 中，您可以看到自己每一箱货物的状态：已在中国收货 · 集货 · 运输途中 · 边境与海关 · 已到达塔什干仓库 · 已交付。在中国收货点，每箱货物都会贴上二维码，此后的每个阶段，工作人员都会扫描——您可以随时在个人账户中查看这些扫描记录。每次收货还会发送照片报告；如仍有疑问，客户经理会回复当前状态并附上照片。中国国内快递单号（1688、淘宝）是另一回事——我们在收货时核对。` },
      ],
    },
    {
      id: 'orders', group: '下单与仓储',
      items: [
        { q: '如何开始？在中国要把货发到哪里？',
          a: `在 Telegram 上给我们留言或致电；我们商定运输方式、单证和包装，并签订合同。中国境内有 3 个收货地址——义乌、广州和喀什，具体使用哪一个由客户经理告知。客户经理还会给您 GS 客户代码（唛头）：供应商在发货前把 GS 客户代码写在每一箱上，并发往该地址。请在收货地址和 GS 客户代码都确认之后再发货，以免货物丢失。` },
        { q: '能把几家供应商的货合在一起吗？',
          a: `可以——集货是我们的核心服务。来自不同工厂和商店的货物在义乌仓库归入同一个 GS 客户代码，重新测量后作为一批发运。这比每件货单独发运更便宜：纸箱码放紧凑，整批货占用的立方米更少——而汽运正是按立方米计费的。拼货 ${v.minM3} m³ 的起收量也按整批合计：来自不同卖家的小件货物加在一起达到 ${v.minM3} m³，即可收货。请提前告知客户经理会有哪些货物到达。` },
        { q: '免费仓储多少天？',
          a: `义乌仓库 ${v.storeCn} 天，塔什干仓库 ${v.storeTz} 天。超过后按合同每天收取仓储费。如需存放更久——例如为了凑齐一批货——请提前与客户经理商定。` },
        { q: '你们会验货并发照片吗？',
          a: `会，每次收货都附带标准照片报告：包装、标签、重量和尺寸（每件 ${v.photo}）。详细验货——数量、颜色、尺码、功能——可另行委托，${v.inspect}/kg 起。如发现瑕疵，我们会在货物仍在中国、发往塔什干之前，与供应商协商换货或退货。` },
        { q: '重新包装免费吗？',
          a: `不免费，重新包装费用为 ${v.repack}/kg。不过它通常物有所值：工厂包装里的空隙会让体积变大，而汽运按体积计费。包装得更紧凑，每立方米的费率会略有上升，但立方米数减少，总价通常会下降：${v.exBulky.kg} kg 占 ${v.exBulky.m3} m³，按 ${v.exBulky.rate} 计费，合计 ${v.exBulky.total}；同样的 ${v.exDense.kg} kg 压缩到 ${v.exDense.m3} m³，按 ${v.exDense.rate} 计费，合计 ${v.exDense.total}。重新包装前，客户经理会把两种计算结果都给您看。家具、玻璃等易碎货物的木箱包装另行报价。` },
        { q: '我可以自己去塔什干仓库提货吗？',
          a: `可以，付款后凭 GS 客户代码即可提货；客户经理会把仓库地址和营业时间发给您。如果您愿意，我们也可以在市内送货（${v.doorFreeKg} kg 起免费）或送往您所在的州。塔什干仓库免费存放 ${v.storeTz} 天。` },
      ],
    },
    {
      id: 'customs', group: '清关与单证',
      items: [
        { top: true, q: '海关环节怎么走？费用由谁承担？',
          a: `商业货物需办理正规清关：报关单（GTD）、按海关编码缴纳关税以及 12% 增值税。关税和增值税依法必须缴纳——我们根据海关编码和货值提前计算，从不承诺“免关税”。清关按合同约定办理：以我司单证或以您公司的名义。关税税率依据总统决议 PP-3818（经 2026年2月 PP-58 修订）：服装 20%，鞋类 20%（每双不低于 3 美元），手机 5%，电脑 0%，家具 15%，玩具 10%。` },
        { q: '个人 200 美元限额是什么？',
          a: `自 2025年5月1日起（部长内阁第 244 号决议，PKM-244），个人每月通过快件收取不超过 200 美元的货物，无需缴纳海关税费；该限额按同一人当月所有订单累计。超出部分征收 30% 的统一海关税费（每公斤不低于 3 美元）；自 2027年1月1日起，税率计划降至 20% 和每公斤 2 美元（总统令 UP-174）。如订购大量相同商品，海关可能将该批货物视为商业货物。为商店进的货属于商业货物，需办理完整清关。` },
        { q: '企业需要哪些单证？',
          a: `在 E-Contract 系统中登记的外贸合同、发票、装箱单、运输单据（公路为 CMR，铁路为 SMGS，空运为 AWB）、原产地证书，以及 10 位海关编码。视货物而定，还需要合格证书或符合性声明，以及卫生防疫（SES）结论。我们按海关编码确认清单并协助准备单证；最终您将获得报关单和正式的税务发票。` },
        { q: '需要证书和乌兹别克语标签吗？',
          a: `取决于海关编码：2025年9月的部长内阁第 554 号决议（PKM-554）缩减了强制认证清单，但电器、儿童用品、玩具、化妆品和食品仍需要合格证明文件和 SES 结论。需要证书或 SES 结论的消费品，自 2024年1月1日起必须使用拉丁字母书写的乌兹别克语标签（总统令 UP-140）。我们会与供应商协调，在工厂完成贴标。` },
        { q: '清关费用多少？需要多长时间？',
          a: `国家规费取决于货值：10,000 美元以内为 1 个基础计算值（BRV），20,000 美元以内为 1.5 个 BRV，以上逐级递增（PKM-55，2025 年）。单证齐全时，通常 1 个工作日即可放行；如需查验或证书尚在办理，时间会更长。我们的清关服务费取决于货物类型，并写入合同——事先报价，事后不变。` },
      ],
    },
    {
      id: 'sourcing', group: '寻找货源与代采购',
      items: [
        { top: true, q: '需要自己和中国供应商沟通吗？',
          a: `不需要。我们的客户经理会说乌兹别克语、俄语和中文；与供应商的谈判、议价和索赔都由我们负责。您只需发送商品链接（1688、淘宝、阿里巴巴）或样品照片——其余的交给我们。您也不必亲自去中国：样品和验厂由我们在义乌的工作人员完成。` },
        { top: true, q: '怎么知道供应商不会骗我？',
          a: `在任何付款之前，我们都会核查卖家的营业执照、1688 评级和经营年限，下大单之前先订样品。货物直接送到义乌仓库，在那里核对数量和质量并发送照片报告——如有问题，货物在发往塔什干之前就会退货或换货。工厂订单我们建议分阶段付款，例如预付 30%，验货后付 70%。我们自 2018 年起与中国开展业务，遇到不可靠的卖家会提醒您。` },
        { q: '如何在 1688、淘宝或阿里巴巴下单和付款？',
          a: `在 Telegram 上发送链接、颜色、尺码和数量；我们与卖家商定条件，并以人民币计算总价。您以苏姆或美元付款，我们以人民币付款——佣金 ${v.comm}% 起（参考费率）。订单总体积须至少 ${v.minM3} m³——我们不接单件或小额订单，但多件商品（即使来自不同卖家）可以合并为一个订单。货物到达义乌仓库，经过检查后与您的其他订单合并为一批。乌兹别克斯坦的 Humo 和 Uzcard 银行卡无法在中国平台上使用——由我们来付款。` },
        { q: '你们按什么人民币汇率结算？',
          a: `按付款当日的市场汇率，与佣金一起在发票上单独列明——没有隐藏差价。您可以与乌兹别克斯坦中央银行的汇率对比：2026年9月，1 元人民币约合 1,750–1,800 苏姆。大额款项（比如 10,000 元人民币起）的汇率单独商定。` },
        { q: '你们能找工厂或厂家吗？佣金多少？',
          a: `能。根据描述或样品，我们按价格、起订量（MOQ）和生产周期比较 2–3 家厂家，订购样品，必要时实地验厂。佣金为订单金额的 ${v.comm}% 起（参考费率）；复杂设备单独报价。义乌和广州市场的小额批发、深圳的电子产品、佛山的家具——我们知道每样东西该去哪里买。` },
        { q: '你们也做设备和汽车进口吗？',
          a: `做。机床和生产线“交钥匙”进口：选厂、合同、付款、装运、清关（许多类型的工业设备关税为 0%，具体取决于海关编码）以及协助安装。来自中国的汽车和电动汽车按订单进口；价格和时效按车型计算，关税、消费税及其他税费依法缴纳。请把车型或设备名称发给我们，我们为您准备报价。` },
      ],
    },
    {
      id: 'safety', group: '安全与保险',
      items: [
        { top: true, q: '哪些货物不能运？',
          a: `易爆和易燃物品；植物、动物和易腐货物；货币、贵金属和宝石、珠宝和古董；支付工具、有价证券和文件；一切法律禁止的物品——毒品、武器、假冒商品。个人禁止运输无人机，对讲机和发射设备需要许可证，商业批量的药品必须经过注册。空运不接受锂电池、充电宝、液体、香水和磁铁——这些只能以拼货方式走汽运（${v.minM3} m³ 起）或整柜走铁路。如有疑问，请发送商品链接，我们核实后答复您。` },
        { q: '货物丢失或损坏由谁负责？',
          a: `由我们依照合同负责：已投保的货物按申报价值赔偿，未投保货物的每公斤赔偿标准写入合同。由于每件货物在收货时都经过称重和拍照，很容易确定损坏发生在哪个环节。索赔需在塔什干仓库交货时附照片提出。` },
        { q: '保险费多少？是强制的吗？',
          a: `保险费为申报价值的 ${v.ins}%（参考费率），自愿购买。我们建议电子产品、玻璃、家具以及价值超过 1,000 美元的货物投保；便宜、结实的货物通常不投保。投保金额按发票确定，并写入合同。` },
        { q: '你们签合同吗？合同里写什么？',
          a: `签。我们与每位客户签订书面合同，内容包括：运价和计费规则（kg 或 m³）、预计运输时间、附加服务、保险、责任和付款条件。企业客户获得税务发票和完工验收单；个人客户同样签订合同。我们的办公室位于塔什干阿利舍尔·纳沃伊街 27 号——可当面签约，也可远程签约。` },
      ],
    },
    {
      id: 'company', group: '关于公司',
      items: [
        { q: 'GSR Logistics 办公室在哪里？什么时间营业？',
          a: `办公室：塔什干沙伊汉塔胡尔区（Shaykhantakhur）阿利舍尔·纳沃伊街 27 号（紧邻阿利舍尔·纳沃伊地铁站）。工作时间：周一至周六 9:00–19:00（塔什干时间，UTC+5），周日休息。电话 +998 95 018 33 33，备用电话 +998 90 175 78 00（WhatsApp），电子邮箱 b.e.kodirov@gmail.com，Telegram 频道 @gsrlogistics。货物状态机器人 @GSR_GROUP_AGENT_bot 全天候工作。` },
        { q: '公司规模多大——有多少客户，每月多少个集装箱？',
          a: `我们自 2018 年起与中国开展业务；团队在货运领域拥有 15 年经验。每月有 50–100 个集装箱从中国运抵塔什干，我们已服务 400+ 位客户。法人实体为 Imex services LLC；在社交媒体上，我们也使用 GSR Group 这一名称。` },
        { q: '中国的收货地址是你们自己的仓库吗？',
          a: `义乌、广州和喀什的地址是接收您货物的收货点。具体使用哪一个，由客户经理告知。每次收货时，货物都会被拍照、清点、称重和测量，每箱都贴上二维码——照片报告会发到您的 Telegram。` },
      ],
    },
    {
      id: 'regional', group: '阿富汗、过境与仓储',
      items: [
        { q: '你们承运发往阿富汗的货物吗？能送到哪里？',
          a: `承运，我们现在也承接发往阿富汗的汽运货物——送至海拉顿口岸或马扎里沙里夫。货物从中国起运（经乌兹别克斯坦过境），或从乌兹别克斯坦起运。整车、拼货均可承接。目前交货地点只有这两个。` },
        { q: '发往阿富汗的运费是多少？需要多长时间？',
          a: `价格和时效按需报价：由客户经理按您的货物核算。核算时，请告知货物品名、体积或重量，以及起运地和目的地。本网站上的运价、运费计算器和时效仅适用于中国 → 塔什干方向。` },
        { q: '经乌兹别克斯坦过境，你们办理哪些单证？',
          a: `四项工作：提交过境报关单，制作并审核 CMR 和 TIR 单证，协助外籍卡车办理行车许可证，协助为过境货物办理海关税费担保（海关担保）。过境报关单由我们自有的报关行向海关申报。我们在口岸接车、送车。价格按需报价。` },
        { q: '货物可以在塔什干存放，或换装到另一辆卡车上吗？',
          a: `可以：在塔什干，我们在海关监管仓库为客户安排仓位，并办理货物换装——车对车换装，或经仓库换装。该仓库属于我们的合作方；货物在那里存放，并处于海关监管之下。存放时间和价格由客户经理根据您的货物情况告知。` },
        { q: '可以用波斯语、达里语留言吗？发到哪里？',
          a: `可以。您可以用波斯语或达里语来信，我们会借助翻译用波斯语回复。我们也用中文、英语、俄语和乌兹别克语回复。请在 WhatsApp（+998 90 175 78 00）或 Telegram 上给我们留言。` },
        { q: '你们能为阿富汗企业在中国找货并代采购吗？',
          a: `可以。我们在中国的寻找货源和代采购服务同样面向阿富汗客商：我们找货、采购，并用卡车运至海拉顿或马扎里沙里夫。具体条件由客户经理在下单前说明。` },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ FA */
/** Persian (one text for Iran and Afghanistan), translated from en() item by item (GLOSSARY.md terms); figures come from nums('fa'). */
function fa(): FaqGroup[] {
  const v = nums('fa');
  return [
    {
      id: 'prices', group: 'قیمت‌ها و پرداخت',
      items: [
        { top: true, q: 'قیمت کارگو چگونه محاسبه می‌شود — بر اساس کیلوگرم یا متر مکعب؟',
          a: `حمل زمینی (بار تجمیعی) بر اساس متر مکعب قیمت‌گذاری می‌شود: چگالی بار — وزن کل (کیلوگرم) ÷ حجم کل (متر مکعب) — نرخ هر متر مکعب را تعیین می‌کند. تا ${v.t1max} کیلوگرم بر متر مکعب نرخ ${v.t1} است، تا ${v.t2max} کیلوگرم بر متر مکعب ${v.t2}، تا ${v.t3max} کیلوگرم بر متر مکعب ${v.t3}، تا ${v.t4max} کیلوگرم بر متر مکعب ${v.t4}، و جدول به همین ترتیب بالا می‌رود: از ${v.tTopMin} کیلوگرم بر متر مکعب نرخ ${v.tTop} است. از ${v.threshold} کیلوگرم بر متر مکعب به بالا — فلز، کاشی و مانند آن‌ها — محاسبه بر اساس وزن انجام می‌شود، به نرخ ${v.dense} برای هر کیلوگرم. مثال: ${v.exMin.kg} کیلوگرم که ${v.exMin.m3} متر مکعب را پر می‌کند یعنی ${v.exMin.d} کیلوگرم بر متر مکعب، پس نرخ ${v.exMin.rate} و مبلغ کل ${v.exMin.total} است. حمل هوایی روشی است که بر اساس کیلوگرم قیمت‌گذاری می‌شود: هزینه بر اساس وزن واقعی یا وزن حجمی (طول × عرض × ارتفاع (سانتی‌متر) ÷ ${v.divAir})، هر کدام بیشتر باشد، محاسبه می‌شود، از ${v.airStd} برای هر کیلوگرم. بار تجمیعی از ${v.minM3} متر مکعب پذیرفته می‌شود؛ همهٔ قیمت‌ها تقریبی‌اند — ارقام را در ماشین‌حساب محاسبه کنید تا کارشناس آن‌ها را در تلگرام تأیید کند.` },
        { q: 'هزینهٔ حمل ۱ کیلوگرم بار از چین چقدر است؟',
          a: `حمل زمینی قیمتی برای هر کیلوگرم ندارد: هزینهٔ آن بر اساس متر مکعب محاسبه می‌شود، پس همان یک کیلوگرم بسته به فضایی که اشغال می‌کند هزینهٔ متفاوتی دارد. بار سبک و حجیم (چگالی تا ${v.t1max} کیلوگرم بر متر مکعب) ${v.t1} است، تا ${v.t2max} کیلوگرم بر متر مکعب ${v.t2}، تا ${v.t3max} کیلوگرم بر متر مکعب ${v.t3}، و جدول برای پرچگال‌ترین ردیف‌ها تا ${v.tTop} بالا می‌رود؛ باری با چگالی ${v.threshold} کیلوگرم بر متر مکعب و بیشتر بر اساس وزن محاسبه می‌شود، به نرخ ${v.dense} برای هر کیلوگرم (${v.exHeavy.kg} کیلوگرم در ${v.exHeavy.m3} متر مکعب می‌شود ${v.exHeavy.total}). برای مثال، ${v.exLight.kg} کیلوگرم کالای سبک در ${v.exLight.m3} متر مکعب ${v.exLight.total} هزینه دارد، در حالی که ${v.exDense.kg} کیلوگرم کالای پرچگال‌تر در ${v.exDense.m3} متر مکعب ${v.exDense.total} — محمولهٔ سنگین‌تر ارزان‌تر است، چون فضای کمتری می‌گیرد. حمل هوایی روشی است که بر اساس کیلوگرم قیمت‌گذاری می‌شود: کالای معمولی ${v.airStd} برای هر کیلوگرم، کالای برنددار ${v.airBrand} برای هر کیلوگرم، محمولهٔ تجاری ${v.airCom} برای هر کیلوگرم. این قیمت‌ها تقریبی‌اند (به‌روزرسانی: ${v.updated})؛ نرخ نهایی بر اساس چگالی، دستهٔ کالا و محموله در قرارداد تعیین می‌شود.` },
        { q: 'آیا حداقل وزن یا حجم وجود دارد؟',
          a: `بله. بار تجمیعی زمینی از ${v.minM3} متر مکعب پذیرفته می‌شود — بار کوچک‌تر را حمل نمی‌کنیم. این ${v.minM3} متر مکعب برای کل یک محموله حساب می‌شود: بسته‌های فروشندگان مختلف در محل تحویل بار در ییوو زیر یک کد GS جمع می‌شوند. بار کمتر از ${v.minM3} متر مکعب را می‌توان با حمل هوایی فرستاد، از ${v.airMin} کیلوگرم. حداقل وزن جداگانه‌ای وجود ندارد: حمل زمینی بر اساس چگالی (کیلوگرم بر متر مکعب) قیمت‌گذاری می‌شود، به کانتینر کامل نیازی نیست و فقط هزینهٔ حجم بار خودتان را می‌پردازید.` },
        { q: 'قیمت شامل چه مواردی است و چه چیزهایی جداگانه پرداخت می‌شود؟',
          a: `قیمت شامل تحویل گرفتن بار در انبار ییوو، وزن‌کشی و اندازه‌گیری، تجمیع بار، حمل از راه خورگوس تا تاشکند و تخلیه در انبار تاشکند است. جداگانه پرداخت می‌شود: بیمه (${v.ins}٪ ارزش اظهارشده)، حقوق گمرکی و مالیات بر ارزش افزوده (بر اساس کد تعرفهٔ HS محاسبه می‌شود)، بسته‌بندی مجدد (${v.repack} برای هر کیلوگرم)، بازرسی دقیق (${v.inspect} برای هر کیلوگرم) و تحویل تا درِ منزل در ولایت‌ها. هر هزینهٔ اضافی در قرارداد در ردیفی جداگانه می‌آید — هزینهٔ پنهانی وجود ندارد.` },
        { q: 'چه زمانی و چگونه پرداخت کنم؟',
          a: `هزینهٔ حمل زمانی پرداخت می‌شود که بار به تاشکند برسد، پیش از تحویل آن، به سوم ازبکستان؛ قیمت به دلار آمریکا توافق می‌شود و نرخ تبدیل در روز پرداخت تعیین می‌شود. روش‌ها: انتقال کارت‌به‌کارت، Click یا Payme، نقدی، یا برای شرکت‌ها حوالهٔ بانکی بر اساس فاکتور. در خدمت خرید کالا، هزینهٔ خود کالا از پیش پرداخت می‌شود — بخش «یافتن و خرید کالا» را ببینید.` },
        { q: 'آیا به ولایت‌ها هم ارسال می‌کنید و هزینهٔ آن چقدر است؟',
          a: `بله، به همهٔ ولایت‌های ازبکستان ارسال می‌کنیم. کارشناس شما شرایط ارسال به ولایت شما را تأیید می‌کند؛ هزینهٔ تحویل تا درِ منزل حدود ${v.door} است. در تاشکند، بار سنگین‌تر از ${v.doorFreeKg} کیلوگرم رایگان تا درِ منزل تحویل داده می‌شود. پس از تخلیهٔ بار در انبار تاشکند، کارشناس شما تاریخ ارسال را تأیید می‌کند.` },
      ],
    },
    {
      id: 'transit', group: 'زمان حمل و مسیر',
      items: [
        { top: true, q: 'بار از چین تا تاشکند چند روز در راه است؟',
          a: `بار تجمیعی زمینی حدود ${v.truckDays} روز، حمل هوایی ${v.airDays} روز و کانتینر ریلی ${v.railDays} روز در راه است. زمان حمل از هنگام ارسال بار از انبار ییوو حساب می‌شود؛ محموله‌های سریع در ${v.expressDays} روز رسیده‌اند. در ایام سال نو چینی (ماه‌های اول و دوم میلادی)، «هفتهٔ طلایی» (اوایل ماه دهم میلادی) و فصل حراج ۱۱/۱۱، ۱ تا ۲ هفتهٔ دیگر هم به آن اضافه کنید.` },
        { q: 'بار از چه مسیری حمل می‌شود؟',
          a: `مسیر اصلی ییوو ← ارومچی ← خورگوس (مرز چین و قزاقستان) ← آلماتی ← شیمکنت ← تاشکند است، حدود ۵٬۰۰۰ کیلومتر و بیشتر. برای درهٔ فرغانه مسیر کاشغر ← ایرکشتام ← اوش ← اندیجان هم وجود دارد که از غرب چین صدها کیلومتر کوتاه‌تر است؛ بار تجمیعی را به‌طور پیش‌فرض از راه خورگوس حمل می‌کنیم. حمل هوایی از گوانگجو یا ارومچی انجام می‌شود؛ کانتینرهای ریلی از دوستیک و آلتین‌کول از مرز می‌گذرند. راه‌آهن چین–قرقیزستان–ازبکستان هنوز در دست ساخت است و جزو مسیرهای ما نیست.` },
        { q: 'هوایی، زمینی یا ریلی — کدام برای من مناسب است؟',
          a: `کالای فوری، سبک و گران‌قیمت: حمل هوایی (${v.airDays} روز، از ${v.airStd} برای هر کیلوگرم). کالای حجیم مانند پوشاک، کفش و لوازم خانه: بار تجمیعی زمینی (${v.truckDays} روز، از ${v.lclFrom}). محموله‌های بیش از ۱۰ متر مکعب: کانتینر ۲۰ یا ۴۰ فوتی (${v.railDays} روز؛ ۲۰ فوتی حدود ${v.r20} و ۴۰ فوتی ${v.r40}). کالاهای دارای باتری، مایعات و آهن‌ربا فقط با حمل زمینی به‌صورت بار تجمیعی (از ${v.minM3} متر مکعب) یا با راه‌آهن در کانتینر کامل ارسال می‌شوند. کارشناس بار شما را بررسی می‌کند و دو یا سه گزینه همراه با قیمت پیشنهاد می‌دهد.` },
        { q: 'آیا در خورگوس تأخیر پیش می‌آید؟',
          a: `بله، در مرز صف تشکیل می‌شود — معمولاً ۱ تا ۳ روز، و پیش از تعطیلات و در فصل اوج بیشتر. به همین دلیل زمان حمل را به‌صورت بازه (${v.truckDays} روز) اعلام می‌کنیم، نه یک تاریخ مشخص. اگر تأخیری پیش بیاید، کارشناس شما در تلگرام علت آن و تاریخ تقریبی جدید را به شما اطلاع می‌دهد.` },
        { q: 'از کجا بدانم بارم کجاست؟',
          a: `در ربات @GSR_GROUP_AGENT_bot وضعیت تک‌تک کارتن‌هایتان را می‌بینید: دریافت‌شده در چین • تجمیع بار • در راه • مرز و گمرک • در انبار تاشکند • تحویل داده شد. در محل تحویل بار در چین روی هر کارتن یک کد QR چسبانده می‌شود و از آن پس در هر مرحله کارکنان آن را اسکن می‌کنند — این اسکن‌ها را در هر ساعت از شبانه‌روز در حساب کاربری خودتان می‌بینید. با هر نوبت دریافت بار، گزارش تصویری هم ارسال می‌شود؛ اگر پرسشی باقی ماند، کارشناس با وضعیت فعلی و یک عکس پاسخ می‌دهد. شمارهٔ رهگیری پیک چینی (1688، تائوبائو) موضوع جداگانه‌ای است — آن را هنگام دریافت بار بررسی می‌کنیم.` },
      ],
    },
    {
      id: 'orders', group: 'سفارش و انبار',
      items: [
        { q: 'چگونه شروع کنم و کالا را در چین به کجا بفرستم؟',
          a: `در تلگرام به ما پیام دهید یا تماس بگیرید؛ روش حمل، مدارک و بسته‌بندی را هماهنگ می‌کنیم و قرارداد می‌بندیم. در چین سه نشانی تحویل وجود دارد — ییوو (义乌)، گوانگجو و کاشغر — و کارشناس شما می‌گوید کدام‌یک برای بار شما در نظر گرفته شده است. کارشناس کد GS شما (علامت حمل) را هم اعلام می‌کند: تأمین‌کننده پیش از ارسال، کد GS را روی هر کارتن می‌نویسد و بار را به همان نشانی می‌فرستد. کالا را فقط وقتی بفرستید که نشانی تحویل و کد GS تأیید شده باشد، تا چیزی گم نشود.` },
        { q: 'آیا می‌توانید کالای چند تأمین‌کننده را در یک محموله تجمیع کنید؟',
          a: `بله — تجمیع بار خدمت اصلی ماست. بسته‌های کارخانه‌ها و فروشگاه‌های مختلف در انبار ییوو زیر یک کد GS جمع می‌شوند، دوباره اندازه‌گیری و به‌صورت یک محموله ارسال می‌شوند. این کار ارزان‌تر از ارسال جداگانهٔ هر بسته است: کارتن‌ها فشرده روی هم چیده می‌شوند و محموله در نهایت متر مکعب کمتری اشغال می‌کند — و هزینهٔ حمل زمینی بر اساس متر مکعب است. حداقل ${v.minM3} متر مکعب بار تجمیعی هم برای کل محموله حساب می‌شود: بسته‌های کوچک فروشندگان مختلف در مجموع ${v.minM3} متر مکعب را تشکیل می‌دهند و بار پذیرفته می‌شود. از پیش به کارشناس خود بگویید منتظر کدام بسته‌ها باشد.` },
        { q: 'نگهداری بار چند روز رایگان است؟',
          a: `در انبار ییوو ${v.storeCn} روز و در انبار تاشکند ${v.storeTz} روز. پس از آن، هزینهٔ نگهداری طبق قرارداد به‌صورت روزانه محاسبه می‌شود. اگر به زمان بیشتری نیاز دارید — مثلاً برای تکمیل یک محموله — از پیش با کارشناس خود هماهنگ کنید.` },
        { q: 'آیا کالا را بازرسی می‌کنید و عکس می‌فرستید؟',
          a: `بله، با هر نوبت دریافت بار یک گزارش تصویری استاندارد ارسال می‌شود: بسته‌بندی، برچسب، وزن و ابعاد (${v.photo} برای هر بسته). بررسی دقیق — تعداد، رنگ، اندازه، عملکرد — را می‌توان از ${v.inspect} برای هر کیلوگرم سفارش داد. اگر ایرادی پیدا کنیم، تا وقتی کالا هنوز در چین است و پیش از ارسال به تاشکند، تعویض یا بازگرداندن آن را با تأمین‌کننده حل‌وفصل می‌کنیم.` },
        { q: 'آیا بسته‌بندی مجدد رایگان است؟',
          a: `خیر، هزینهٔ بسته‌بندی مجدد ${v.repack} برای هر کیلوگرم است. با این حال، معمولاً هزینهٔ خود را جبران می‌کند: هوای داخل بسته‌بندی کارخانه حجم را بالا می‌برد و هزینهٔ حمل زمینی بر اساس حجم است. بسته‌بندی فشرده‌تر نرخ هر متر مکعب را کمی بالا می‌برد اما تعداد متر مکعب‌ها را کم می‌کند، پس مبلغ کل معمولاً پایین می‌آید: ${v.exBulky.kg} کیلوگرم در ${v.exBulky.m3} متر مکعب با نرخ ${v.exBulky.rate} محاسبه می‌شود، یعنی ${v.exBulky.total}، در حالی که همان ${v.exDense.kg} کیلوگرم فشرده‌شده در ${v.exDense.m3} متر مکعب با نرخ ${v.exDense.rate} محاسبه می‌شود، یعنی ${v.exDense.total}. کارشناس شما پیش از بسته‌بندی مجدد هر دو محاسبه را به شما نشان می‌دهد. جعبهٔ چوبی برای کالاهای شکستنی مانند مبلمان یا شیشه جداگانه قیمت‌گذاری می‌شود.` },
        { q: 'آیا می‌توانم بار را خودم از انبار تاشکند تحویل بگیرم؟',
          a: `بله، پس از پرداخت می‌توانید با کد GS خود بار را تحویل بگیرید؛ کارشناس شما نشانی انبار و ساعات کاری آن را می‌فرستد. اگر بخواهید، بار را در داخل شهر (از ${v.doorFreeKg} کیلوگرم به بالا رایگان) یا به ولایت شما ارسال می‌کنیم. نگهداری در انبار ${v.storeTz} روز رایگان است.` },
      ],
    },
    {
      id: 'customs', group: 'گمرک و مدارک',
      items: [
        { top: true, q: 'در گمرک چه اتفاقی می‌افتد و هزینه را چه کسی می‌پردازد؟',
          a: `بار تجاری از ترخیص گمرکی رسمی می‌گذرد: اظهارنامهٔ گمرکی (GTD)، حقوق گمرکی بر اساس کد تعرفه (HS) و مالیات بر ارزش افزودهٔ ۱۲٪. پرداخت حقوق گمرکی و مالیات بر ارزش افزوده طبق قانون الزامی است — آن‌ها را از پیش بر اساس کد HS و ارزش کالا محاسبه می‌کنیم و هرگز وعدهٔ «بدون حقوق گمرکی» نمی‌دهیم. ترخیص به شکلی که در قرارداد توافق شده انجام می‌شود: با مدارک ما یا به نام شرکت شما. نرخ‌های حقوق گمرکی طبق مصوبهٔ PP-3818 با اصلاحات مصوبهٔ PP-58 در ۲۰۲۶/۰۲ تعیین می‌شوند: پوشاک ۲۰٪، کفش ۲۰٪ (حداقل ۳ دلار برای هر جفت)، تلفن همراه ۵٪، رایانه ۰٪، مبلمان ۱۵٪، اسباب‌بازی ۱۰٪.` },
        { q: 'سقف ۲۰۰ دلار برای اشخاص حقیقی چیست؟',
          a: `از ۲۰۲۵/۰۵/۰۱ (مصوبهٔ هیئت وزیران PKM-244)، هر شخص حقیقی می‌تواند ماهانه تا ۲۰۰ دلار کالا از طریق مرسوله‌های پیک دریافت کند، بی‌آنکه گمرک پرداختی از او بگیرد؛ این سقف برای مجموع همهٔ سفارش‌های یک نفر در آن ماه حساب می‌شود. برای مبلغ بیش از این سقف، یک پرداخت گمرکی واحد ۳۰٪ (حداقل ۳ دلار برای هر کیلوگرم) اعمال می‌شود؛ قرار است از ۲۰۲۷/۰۱/۰۱ این نرخ به ۲۰٪ و ۲ دلار برای هر کیلوگرم کاهش یابد (فرمان UP-174). اگر تعداد زیادی کالای یکسان سفارش داده شود، گمرک ممکن است مرسوله را تجاری تلقی کند. کالایی که برای فروشگاه آورده می‌شود بار تجاری است و ترخیص کامل را طی می‌کند.` },
        { q: 'یک شرکت به چه مدارکی نیاز دارد؟',
          a: `قرارداد تجارت خارجی ثبت‌شده در سامانهٔ E-Contract، فاکتور (اینویس)، لیست بسته‌بندی، سند حمل (CMR برای حمل جاده‌ای، SMGS برای ریلی، AWB برای هوایی)، گواهی مبدأ و کد تعرفهٔ ۱۰ رقمی (HS). بسته به نوع کالا، گواهی یا اظهارنامهٔ انطباق و گواهی بهداشتی (SES) نیز لازم است. فهرست مدارک را بر اساس کد HS تأیید می‌کنیم و در آماده‌سازی آن‌ها کمک می‌کنیم؛ در پایان، اظهارنامهٔ گمرکی و فاکتور مالیاتی رسمی در اختیار شما خواهد بود.` },
        { q: 'آیا گواهی و برچسب‌گذاری به زبان ازبکی الزامی است؟',
          a: `به کد تعرفه (HS) بستگی دارد: مصوبهٔ PKM-554 مورخ ۲۰۲۵/۰۹ فهرست کالاهای مشمول گواهی اجباری را کوتاه‌تر کرد، اما کالاهای برقی، محصولات کودکان، اسباب‌بازی، لوازم آرایشی و مواد غذایی همچنان به سند انطباق و گواهی بهداشتی SES نیاز دارند. کالاهای مصرفی‌ای که به گواهی یا SES نیاز دارند، از ۲۰۲۴/۰۱/۰۱ باید برچسبی به زبان ازبکی و با خط لاتین داشته باشند (فرمان UP-140). برچسب‌گذاری را در کارخانه با تأمین‌کننده هماهنگ می‌کنیم.` },
        { q: 'هزینهٔ ترخیص گمرکی چقدر است و چقدر طول می‌کشد؟',
          a: `کارمزد دولتی به ارزش کالا بستگی دارد: ۱ BRV (مقدار پایهٔ محاسبه) تا ۱۰٬۰۰۰ دلار، ۱٫۵ BRV تا ۲۰٬۰۰۰ دلار و بالاتر به‌صورت پلکانی (PKM-55، ۲۰۲۵). با پروندهٔ کامل، ترخیص معمولاً ۱ روز کاری طول می‌کشد؛ اگر بازرسی انجام شود یا گواهی هنوز صادر نشده باشد، بیشتر. کارمزد ترخیص ما به نوع بار بستگی دارد و در قرارداد نوشته می‌شود — از ابتدا اعلام می‌شود و بعداً تغییر نمی‌کند.` },
      ],
    },
    {
      id: 'sourcing', group: 'یافتن و خرید کالا',
      items: [
        { top: true, q: 'آیا لازم است زبان چینی بدانم؟',
          a: `خیر. کارشناسان ما به زبان‌های ازبکی، روسی و چینی صحبت می‌کنند؛ مذاکره، چانه‌زنی بر سر قیمت و پیگیری شکایت‌ها با تأمین‌کننده بر عهدهٔ ماست. شما لینک کالا (1688، تائوبائو، علی‌بابا) یا عکس نمونه را می‌فرستید — بقیهٔ کار با ماست. لازم هم نیست به چین سفر کنید: تهیهٔ نمونه و بررسی کارخانه را کارکنان ما در ییوو انجام می‌دهند.` },
        { top: true, q: 'از کجا مطمئن شوم که تأمین‌کننده فریبم نمی‌دهد؟',
          a: `پیش از هر پرداختی، مجوز کسب‌وکار فروشنده، امتیاز او در 1688 و سابقهٔ فعالیتش را بررسی می‌کنیم و پیش از سفارش بزرگ، نمونه سفارش می‌دهیم. کالا مستقیم به انبار ییوو می‌رسد و در آنجا تعداد و کیفیت آن بررسی و گزارش تصویری ارسال می‌شود — اگر مشکلی باشد، کالا پیش از حرکت به تاشکند بازگردانده یا تعویض می‌شود. برای سفارش از کارخانه، پرداخت مرحله‌ای را پیشنهاد می‌کنیم، برای مثال ۳۰٪ پیش‌پرداخت و ۷۰٪ پس از بازرسی. از سال ۲۰۱۸ با چین کار می‌کنیم و دربارهٔ فروشندهٔ غیرقابل‌اعتماد به شما هشدار می‌دهیم.` },
        { q: 'چگونه از 1688، تائوبائو یا علی‌بابا سفارش دهم و پرداخت کنم؟',
          a: `لینک، رنگ، اندازه و تعداد را در تلگرام بفرستید؛ شرایط را با فروشنده هماهنگ می‌کنیم و مبلغ کل را به یوان محاسبه می‌کنیم. شما به سوم یا دلار پرداخت می‌کنید و ما به یوان — کارمزد از ${v.comm}٪ (تقریبی). حجم کل سفارش باید دست‌کم ${v.minM3} متر مکعب باشد — کالای تکی یا سفارش کوچک نمی‌پذیریم، اما چند کالا، حتی از فروشندگان مختلف، در یک سفارش جمع می‌شوند. کالا به انبار ییوو می‌رسد، بررسی می‌شود و با سفارش‌های دیگر شما در یک محموله تجمیع می‌شود. کارت‌های Humo و Uzcard ازبکستان در پلتفرم‌های چینی کار نمی‌کنند — پرداخت را ما انجام می‌دهیم.` },
        { q: 'از چه نرخی برای یوان استفاده می‌کنید؟',
          a: `نرخ بازار در روز پرداخت، که همراه با کارمزد در ردیفی جداگانه در فاکتور نشان داده می‌شود — بدون حاشیهٔ سود پنهان. می‌توانید آن را با نرخ بانک مرکزی ازبکستان مقایسه کنید: در ۲۰۲۶/۰۹، هر ۱ یوان حدود ۱٬۷۵۰ تا ۱٬۸۰۰ سوم بود. برای مبالغ بزرگ (مثلاً از ۱۰٬۰۰۰ یوان) نرخ به‌صورت جداگانه توافق می‌شود.` },
        { q: 'آیا می‌توانید کارخانه یا تولیدکننده پیدا کنید و کارمزد آن چقدر است؟',
          a: `بله. بر اساس توضیحات یا نمونه، ۲ تا ۳ تولیدکننده را از نظر قیمت، حداقل سفارش (MOQ) و زمان تولید مقایسه می‌کنیم، نمونه سفارش می‌دهیم و در صورت نیاز از کارخانه بازدید می‌کنیم. کارمزد از ${v.comm}٪ ارزش سفارش شروع می‌شود (تقریبی)؛ تجهیزات پیچیده جداگانه قیمت‌گذاری می‌شود. عمده‌فروشی کوچک از بازارهای ییوو و گوانگجو، لوازم الکترونیکی از شنژن، مبلمان از فوشان — می‌دانیم هر چیزی را کجا باید خرید.` },
        { q: 'آیا تجهیزات و خودرو هم وارد می‌کنید؟',
          a: `بله. ماشین‌آلات و خطوط تولید به‌صورت کلید در دست: انتخاب کارخانه، قرارداد، پرداخت، بارگیری، گمرک (حقوق گمرکی بسیاری از انواع تجهیزات صنعتی، بسته به کد، ۰٪ است) و کمک در نصب. خودرو و خودروی برقی از چین به سفارش وارد می‌شود؛ قیمت و زمان برای هر مدل جداگانه محاسبه می‌شود و حقوق گمرکی، اکسایز (مالیات ویژه) و سایر پرداخت‌ها طبق قانون است. مدل خودرو یا نام تجهیزات را برای ما بفرستید تا پیشنهاد قیمت آماده کنیم.` },
      ],
    },
    {
      id: 'safety', group: 'ایمنی و بیمه',
      items: [
        { top: true, q: 'چه کالاهایی را نمی‌توان ارسال کرد؟',
          a: `مواد منفجره و آتش‌زا؛ گیاهان، حیوانات و کالاهای فاسدشدنی؛ پول، فلزات و سنگ‌های قیمتی، جواهرات و اشیای عتیقه؛ ابزارهای پرداخت، اوراق بهادار و اسناد؛ هر چیزی که قانون ممنوع کرده است — مواد مخدر، سلاح، کالای تقلبی. پهپاد برای اشخاص حقیقی ممنوع است، بی‌سیم و فرستنده به مجوز نیاز دارند و دارو در مقادیر تجاری باید ثبت شده باشد. حمل هوایی باتری لیتیومی، پاوربانک، مایعات، عطر و آهن‌ربا را نمی‌پذیرد — این کالاها فقط با حمل زمینی به‌صورت بار تجمیعی (از ${v.minM3} متر مکعب) یا با راه‌آهن در کانتینر کامل ارسال می‌شوند. اگر مطمئن نیستید، لینک کالا را بفرستید تا بررسی کنیم و پاسخ دهیم.` },
        { q: 'اگر بار گم شود یا آسیب ببیند، چه کسی مسئول است؟',
          a: `ما، طبق قرارداد: خسارت بار بیمه‌شده بر اساس ارزش اظهارشدهٔ آن جبران می‌شود و برای بار بیمه‌نشده، مبلغ جبران خسارت برای هر کیلوگرم در قرارداد نوشته شده است. چون هر بسته هنگام دریافت وزن‌کشی و عکاسی می‌شود، به‌آسانی می‌توان مشخص کرد آسیب در کدام مرحله رخ داده است. ادعای خسارت هنگام تحویل بار در انبار تاشکند همراه با عکس ثبت می‌شود.` },
        { q: 'هزینهٔ بیمه چقدر است و آیا اجباری است؟',
          a: `بیمه ${v.ins}٪ ارزش اظهارشده است (تقریبی) و اختیاری است. آن را برای لوازم الکترونیکی، شیشه، مبلمان و محموله‌های با ارزش بیش از ۱٬۰۰۰ دلار توصیه می‌کنیم؛ کالاهای ارزان و مقاوم معمولاً بدون بیمه ارسال می‌شوند. ارزش بیمه‌شده از فاکتور گرفته و در قرارداد ثبت می‌شود.` },
        { q: 'آیا قرارداد می‌بندید و در آن چه نوشته می‌شود؟',
          a: `بله، با هر مشتری قرارداد کتبی می‌بندیم: نرخ حمل و قاعدهٔ قیمت‌گذاری (کیلوگرم یا متر مکعب)، زمان تقریبی حمل، خدمات اضافی، بیمه، مسئولیت و شرایط پرداخت. شرکت‌ها فاکتور مالیاتی و صورت‌جلسهٔ انجام کار دریافت می‌کنند؛ اشخاص حقیقی هم قرارداد امضا می‌کنند. دفتر ما در تاشکند، خیابان علیشیر نوایی، پلاک ۲۷ است — قرارداد را حضوری یا از راه دور امضا کنید.` },
      ],
    },
    {
      id: 'company', group: 'دربارهٔ شرکت',
      items: [
        { q: 'دفتر GSR Logistics کجاست و چه ساعاتی باز است؟',
          a: `دفتر: تاشکند، منطقهٔ شیخانطهور، خیابان علیشیر نوایی، پلاک ۲۷ (کنار ایستگاه مترو «علیشیر نوایی»). ساعات کاری: همه روزه به‌جز یکشنبه، ۹:۰۰ تا ۱۹:۰۰ (به وقت تاشکند، UTC+5). تلفن +998 95 018 33 33، خط دوم +998 90 175 78 00 (واتس‌اپ)، ایمیل b.e.kodirov@gmail.com، کانال تلگرام @gsrlogistics. ربات وضعیت بار @GSR_GROUP_AGENT_bot در هر ساعت از شبانه‌روز کار می‌کند.` },
        { q: 'شرکت چقدر بزرگ است — چند مشتری و چند کانتینر در ماه؟',
          a: `از سال ۲۰۱۸ با چین کار می‌کنیم؛ تیم ما ۱۵ سال تجربه در حمل بار دارد. ماهانه ۵۰ تا ۱۰۰ کانتینر از چین به تاشکند می‌رسد و تاکنون به بیش از ۴۰۰ مشتری خدمت داده‌ایم. شرکت ما با نام Imex services LLC ثبت شده است؛ در شبکه‌های اجتماعی با نام GSR Group هم شناخته می‌شویم.` },
        { q: 'آیا نشانی‌های تحویل در چین انبارهای خود شماست؟',
          a: `نشانی‌های ییوو، گوانگجو و کاشغر محل‌های تحویل بار هستند که بار شما در آن‌ها پذیرفته می‌شود. کارشناس شما می‌گوید از کدام‌یک استفاده کنید. در هر نوبت دریافت، از بار عکس گرفته می‌شود، شمارش، وزن‌کشی و اندازه‌گیری می‌شود و روی هر کارتن کد QR چسبانده می‌شود — گزارش تصویری به تلگرام شما می‌رسد.` },
      ],
    },
    {
      // Afghanistan, transit documents and the warehouse under customs control in Tashkent (new, 2026-11-12), translated
      // item by item from the `regional` group of en(). This group is read first by Afghan readers, so the Afghan word
      // stands in brackets once: کامیون (موتر باربری), انبار (گدام). The warehouse is a partner's («انبار همکار ما»), never our own.
      id: 'regional', group: 'افغانستان، ترانزیت و انبار',
      items: [
        { q: 'آیا به افغانستان بار می‌برید و تا کجا؟',
          a: `بله، اکنون با کامیون (موتر باربری) به افغانستان هم بار می‌بریم — تا گذرگاه مرزی حیرتان یا تا مزار شریف. بار از چین (به‌صورت ترانزیت از خاک ازبکستان) یا از ازبکستان فرستاده می‌شود. هم کامیون دربست داریم و هم بار تجمیعی. امروز نقاط تحویل همین دو جاست.` },
        { q: 'هزینهٔ حمل بار به افغانستان چقدر است و چقدر طول می‌کشد؟',
          a: `قیمت و زمان با استعلام اعلام می‌شود: کارشناس ما آن‌ها را برای بار شما محاسبه می‌کند. برای محاسبه بنویسید بار چیست، حجم یا وزن آن چقدر است و از کجا به کجا می‌رود. تعرفه‌ها، ماشین‌حساب و زمان‌های حمل در این سایت فقط مربوط به مسیر چین ← تاشکند است.` },
        { q: 'برای ترانزیت از خاک ازبکستان چه اسنادی را آماده می‌کنید؟',
          a: `چهار کار: اظهارنامهٔ ترانزیت را ثبت می‌کنیم، اسناد CMR و TIR را تهیه و بررسی می‌کنیم، در گرفتن مجوز تردد برای کامیون‌های خارجی کمک می‌کنیم و در فراهم کردن تضمین پرداخت‌های گمرکی (ضمانت) برای بار ترانزیتی کمک می‌کنیم. اظهارنامه را کارگزار گمرکی خودمان در گمرک ثبت می‌کند. در مرز به استقبال کامیون می‌رویم و آن را راهی می‌کنیم. قیمت با استعلام اعلام می‌شود.` },
        { q: 'آیا می‌توانم بار را در تاشکند نگه دارم یا به کامیون دیگری منتقل کنم؟',
          a: `بله: در تاشکند در انباری (گدام) تحت نظارت گمرک برای مشتریانمان جا اختصاص می‌دهیم و بار را جابه‌جا می‌کنیم — از کامیون به کامیون یا از راه انبار. این انبار متعلق به همکار ماست؛ بار در آنجا تحت نظارت گمرک نگهداری می‌شود. مدت نگهداری و قیمت را کارشناس ما برای بار شما اعلام می‌کند.` },
        { q: 'آیا می‌توانم به فارسی یا دری بنویسم، و کجا؟',
          a: `بله. اگر به فارسی یا دری بنویسید، با کمک مترجم به فارسی پاسخ می‌دهیم. به انگلیسی، روسی و ازبکی هم پاسخ می‌دهیم. در واتساپ (+998 90 175 78 00) یا تلگرام به ما پیام دهید.` },
        { q: 'آیا برای تاجری از افغانستان در چین کالا پیدا می‌کنید و می‌خرید؟',
          a: `بله. خدمت یافتن و خرید کالا در چین برای تاجران افغانستان هم ارائه می‌شود: کالا را پیدا می‌کنیم، می‌خریم و با کامیون تا حیرتان یا مزار شریف می‌رسانیم. شرایط را کارشناس ما پیش از سفارش اعلام می‌کند.` },
      ],
    },
  ];
}

export const faq: Localized<FaqGroup[]> = { uz: uz(), ru: ru(), en: en(), zh: zh(), fa: fa() };

/**
 * Flat list of every question in one locale (for JSON-LD and counts). `pick` is what makes this
 * work on /kirill/: there is no hand-written Cyrillic FAQ, so it transliterates the Uzbek one.
 */
export const faqItems = (lang: Locale): FaqItem[] => pick(lang, faq).flatMap((g) => g.items);
/** The six questions flagged for the home page, in page order. */
export const faqTop = (lang: Locale): FaqItem[] => faqItems(lang).filter((i) => i.top);

