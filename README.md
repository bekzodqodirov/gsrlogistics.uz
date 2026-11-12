# GSR Logistics — gsrlogistics.uz

Xitoydan Oʻzbekistonga yuk tashish, tovar topish va sotib olish boʻyicha kompaniyaning rasmiy sayti. 2026-yil noyabridan saytda yangi yoʻnalish ham bor: Afgʻonistonga fura bilan yuk tashish (ikki nuqtagacha — Hayraton va Mozori Sharif), Oʻzbekiston orqali tranzit hujjatlari va Toshkentda bojxona nazoratidagi ombor — pastdagi «Afgʻoniston, tranzit va ombor» boʻlimiga qarang. Sayt boshqa mamlakatlarni yetkazish manzili sifatida yozmaydi. Olti lokal: oʻzbek lotin (asosiy, `/`), rus (`/ru/`), ingliz (`/en/`), oʻzbek kirill (`/kirill/`, lotinchadan avtomatik), xitoy — soddalashtirilgan (`/zh/`) va fors — oʻngdan chapga (`/fa/`); kirilldan boshqa beshtasi qoʻlda yoziladi. Statik, juda yengil, AI-qidiruv (ChatGPT, Claude, Gemini, Perplexity, Yandex) va Google/Yandex uchun optimallashtirilgan.

Texnologiya: [Astro 7](https://astro.build) (statik HTML), Onest shrifti (oʻz serverimizdan), GSAP (faqat «Yoʻl» animatsiyasi uchun, kechiktirib yuklanadi), hech qanday tashqi skript yoʻq.

## Tez boshlash

```bash
npm install        # Node 22+ kerak (.nvmrc)
npm run dev        # http://localhost:4321 — jonli koʻrish
npm run build      # dist/ papkasiga tayyor sayt
npm run preview    # dist/ ni lokal koʻrish
npm run test:pricing   # kalkulyator hisob-kitobini tekshirish (tariffs.json oʻzgarganda)
npm run test:locale    # olti lokal, pick() va format.ts shartnomasi
npm run test:cyrillic  # lotin → kirill transliteratori
npm run test:translations  # zh/fa tarjimalari inglizcha manbaga mosmi (tuzilma, {oʻrinbosarlar}, identifikatorlar, raqamlar)
npm run og         # OG rasmlarni qayta yaratish (public/og/; zh/fa uchun pastroqqa qarang)
```

## Saytni internetga chiqarish (hosting)

Sayt toʻliq statik — istalgan statik hostingda ishlaydi. Tavsiya: **Cloudflare Pages** (bepul, tez, forma/kuzatuv uchun serverless funksiyalar `functions/` papkasida tayyor).

**Cloudflare Pages:**
1. dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → shu repozitoriyni tanlang.
2. Build command: `npm run build`, Build output: `dist`, Node version: `22` (Environment variable `NODE_VERSION=22`).
3. Custom domains → `gsrlogistics.uz` va `www.gsrlogistics.uz` qoʻshing (DNS Cloudflare'da boʻlsa avtomatik).
4. Forma va kuzatuv uchun muhit oʻzgaruvchilari (Settings → Environment variables): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TRACK_SHEET_CSV_URL`, ixtiyoriy `TURNSTILE_SECRET` — batafsil: `docs/DEPLOY-FUNCTIONS.md`. Ular boʻlmasa ham sayt ishlaydi: forma va kuzatuv toʻgʻridan-toʻgʻri Telegramga yoʻnaltiradi.

**GitHub Pages (muqobil):** Settings → Pages → Source: *GitHub Actions*. `.github/workflows/deploy.yml` har `main` push'ida saytni chiqaradi; `public/CNAME` domenni belgilaydi. Domen DNS'ida GitHub Pages A/AAAA yozuvlarini qoʻying.

## Kompaniya maʼlumotlarini kiritish (MUHIM — ishga tushirishdan oldin)

Barcha kontakt va kompaniya faktlari **bitta faylda**: `src/lib/site.ts`. Undagi `TODO` belgilarini tekshiring:

| Nima | Qayerda | Hozirgi holat |
|---|---|---|
| Telefonlar | `phoneDisplay`, `phoneE164`, `phone2*` | +998 95 018 33 33 (asosiy), +998 90 175 78 00 (qoʻshimcha; WhatsApp aynan shu raqamda) — egasi tasdiqlagan |
| Telegram chat (CTA tugmalari qayerga olib boradi) | `telegramDirect` | `https://t.me/bekzodkodirov556` — menejer akkaunti, egasi tasdiqlagan |
| WhatsApp, e-mail | `whatsapp`, `email` | +998 90 175 78 00 (WhatsApp aynan shu raqamda), b.e.kodirov@gmail.com — egasi tasdiqlagan |
| Instagram, Facebook | `instagram`, `facebook` | akkauntlar jonli ekani hali tasdiqlanmagan — tekshiring |
| Manzil va xarita | `address`, `geo`, `yandexMapsUrl` | Alisher Navoiy koʻchasi 27 — tasdiqlang |
| Ish vaqti | `hours`, `openingHoursSpec` | Du–Sha 9:00–19:00 — tasdiqlang |
| Yuridik nom, STIR | `legalEntity` | «Imex services LLC» — egasi tasdiqlagan. STIR hali berilmagan: oʻzingizdan qoʻshmang, egasidan soʻrang |
| Xitoydagi qabul punktlari (Ivu, Guanchjou, Qashqar): xitoycha manzil, qabul qiluvchi, +86 | `chinaWarehouses` | egasining manzil kartochkasidan kiritilgan (2026-09-09), WeChat hali yoʻq. Egalik tasdiqlanmagan — matnda «bizning omborimiz» demang. Manzillarni sahifalardan olib tashlash uchun `publishChinaAddresses: false` qiling (shahar nomlari qoladi) |
| Komissiya, sugʻurta % | `sourcingCommissionPct`, `insurancePct` | 3 %, 1 % — tasdiqlang |

## Mijozlarni menejerlarga taqsimlash

Qaysi menejer boʻshroq ekanini **GSR tizimi** (`gsrwms.uz`) biladi. Sayt har bir mijozni oʻsha tizim tanlagan menejerga yuboradi (egasi, 2026-09-26):

1. Mijoz Telegram tugmasini bosadi. Umumiy tugmalar (sarlavha, bosh sahifa, pastki panel, footer…) avval qisqa soʻrovnoma ochadi: yuk olib kelish, tovar sotib olish, «yukim qayerda?» (botga) yoki boshqa savol. Xizmat sahifalari, «Narxlar», «Kalkulyator» va aloqa formasi hech narsa soʻramaydi, chunki jamoasi maʼlum.
2. Oxirgi tugma bosilganda brauzer bitta soʻrov yuboradi: `https://gsrwms.uz/api/lead/assign?team=…&lead=GSR-…&tag=…&page=…&lang=…`. Bu yerda `team` — `cargo` (yigʻma yuk, avia, temir yoʻl, bojxona, ombor, Afgʻonistonga yuk tashish, tranzit hujjatlari, bojxona nazoratidagi ombor), `buying` (tovar topish, sotib olish, uskunalar, avtomobil) yoki `general`; `lead` — shu bosish uchun yaratilgan bir martalik kod.
3. Tizim menejerning Telegram usernameʼini qaytaradi. Sayt «Menejer: @…», tayyor xabar, «Nusxa olish» tugmasi va «Tayyor xabarni oʻzgartirmasdan, birinchi xabar qilib yuboring» degan eslatmani koʻrsatadi, keyin Telegramni ochadi. Xabar shunday boʻladi:
   ```
   Kod: GSR-7KQ2MX9PLA
   Yuk olib kelish · 1–5 m³
   ```
4. Mijoz xabarni yuboradi va tizim oʻsha menejerga lidni oʻzi ochadi. Sayt hech narsani saqlamaydi va mijozga oʻzi yozmaydi.

Tizim javob bermasa (hali deploy qilinmagan, ishlamayapti, 1,5 soniyadan koʻp kutdi, cheklovdan oshdi) mijoz **kompaniya akkauntiga** (`@bekzodkodirov556`) oʻsha kodli xabar bilan tushadi, xato koʻrsatilmaydi. Bu zaxira `src/lib/site.ts` da:

```ts
telegramCompany: 'bekzodkodirov556',               // zaxira va JavaScriptsiz havolalar
leadAssign: 'https://gsrwms.uz/api/lead/assign',   // GSR tizimi
leadTeams: { cargo: [], buying: [], general: [] }, // ixtiyoriy: jamoa boʻyicha zaxira menejerlar
```

Menejerlarning oʻzi GSR admin panelida belgilanadi, saytda emas. `leadTeams` ga username yozilsa, tizim javob bermaganda oʻsha jamoadan tasodifiy biri tanlanadi, boʻsh boʻlsa kompaniya akkaunti. Qaysi xizmat qaysi jamoaga tegishli ekani `src/lib/leads.ts` dagi `serviceTeam` da, soʻrov kodi esa `src/lib/lead-client.ts` da.

Sinov: GSR tizimida har bir javob berilgan soʻrov real menejerga yuk sifatida hisoblanadi, test rejimi yoʻq. Shuning uchun toʻliq sinovni bir marta qiling: menejerga hech qachon yozmagan Telegram akkauntdan soʻrovnomani toʻldiring, tayyor xabarni oʻzgartirmasdan yuboring va CRMʼda «Sayt» manbali yangi lid paydo boʻlganini tekshiring.

## Narxlarni yangilash

Barcha narx va muddatlar `src/data/tariffs.json` faylida (avia $/kg, avto zinapoya, m³ boʻyicha zichlik jadvali, konteynerlar, qoʻshimcha xizmatlar, viloyatlarga yetkazish). Raqamni oʻzgartiring, `updated` sanasini yangilang, `git push` qiling — narxlar sahifasi, kalkulyator, bosh sahifa va schema.org avtomatik yangilanadi. Sayt hamma joyda «taxminiy narx · yangilangan: …» yozuvini koʻrsatadi.

**Eng kichik yuk:** `truck.minM3` — yigʻma yuk (faqat avto) qabul qilinadigan eng kichik hajm, hozir **1 m³** (egasi, 2026-11-08). Undan kichik yuk umuman qabul qilinmaydi: kalkulyator narx bermaydi va «avia bilan joʻnating» deydi. Kalkulyator, narxlar sahifasi, savol-javob, bosh sahifa va schema.org bu raqamni shu yerdan oladi; xizmat sahifalari (`src/data/services/*.content.ts`) va qoʻllanmalarda «1 m³» matnda yozilgan — raqam oʻzgarsa, ularni ham yangilang (`scripts/check-content.mjs` eski 0,1 m³ ni build vaqtida taqiqlaydi). Avia oʻz minimumi bilan qoladi (`air.minKg`, 0,5 kg). Sotib olish xizmati ham faqat umumiy hajmi 1 m³ dan boshlanadigan buyurtmalarni oladi.

**Temir yoʻl — faqat butun konteyner:** 20GP, 40GP, 40HQ va boshqa turlar (egasi, 2026-11-09). Temir yoʻlda yigʻma yuk (LCL) qilinmaydi: butun konteyner kerak boʻlmagan kichikroq partiya avto bilan, `truck.minM3` dan ketadi. `scripts/check-content.mjs` «FCL yoki LCL», «konteynerdagi joy» kabi eski temir yoʻl yigʻma yuk takliflarini build vaqtida taqiqlaydi.

**Afgʻoniston, tranzit va ombor xizmatlarida narx yoʻq:** `tariffs.json` dagi barcha narx va muddatlar, kalkulyator va eng kichik hajm faqat Xitoy → Toshkent yoʻnalishiga tegishli. Uch yangi xizmat (`src/data/services.ts` da `quote: 'request'`) uchun narx, muddat va eng kichik hajm eʼlon qilinmaydi — egasi 2026-11-11 da «soʻrov boʻyicha» degan. Bu sahifalarda kalkulyator va «taxminiy narx» yozuvi oʻrniga «Narx va muddat — soʻrov boʻyicha» yozuvi hamda Telegram va WhatsApp tugmalari chiqadi. Egasi raqamni tasdiqlamaguncha bu xizmatlar matniga kun soni ham, narx ham yozmang: `scripts/check-content.mjs` Afgʻoniston, Hayraton yoki Mozori Sharif nomi yonida turgan bunday raqamda build'ni toʻxtatadi.

## Kontentni tahrirlash

- Xizmat sahifalari: `src/data/services/<xizmat>.content.ts` (uz/ru/en bir faylda); xitoycha va forscha tarjimasi — `src/data/services/zh/<xizmat>.content.ts` va `src/data/services/fa/<xizmat>.content.ts`.
- Qoʻllanma maqolalari: `src/content/guides/<til>/<slug>.md` (Markdown, yuqorisida frontmatter); zh/fa maqola inglizcha maqola bilan **bir xil fayl nomida** (`src/content/guides/zh/<slug>.md`). Yangi maqola qoʻshsangiz `src/data/guides.ts` ga har tildagi slug'ni ham qoʻshing (hreflang uchun; zh va fa — inglizcha slug).
- Savol-javob: `src/data/faq.ts`.
- «Ishlarimizdan lavhalar» (video va suratlar): `src/content/works/<sana-nom>/` — har bir blok bitta papka, pastdagi «Yangi blok qoʻshish» boʻlimiga qarang.
- Bosh sahifa boʻlimlari matnlari: `src/i18n/*.ts`; ularning xitoycha va forscha tarjimasi — `src/i18n/zh/<modul>.ts` va `src/i18n/fa/<modul>.ts` (bir faylda bitta til).
- Oʻzbek matnida ʻ (U+02BB) va ʼ (U+02BC) belgilaridan foydalaning (oʻ, gʻ, maʼlumot), oddiy ' emas.

### Xitoy (zh) va fors (fa) tillari

- Ikkalasi ham **inglizcha** matndan tarjima qilinadi va inglizcha slug'larni ishlatadi (`/en/pricing/` → `/zh/pricing/`, `/fa/pricing/`). Fors tili — oʻngdan chapga (`<html dir="rtl">`); matn bitta — Afgʻonistondagi oʻquvchi ham, Erondagi oʻquvchi ham tushunadigan standart fors tilida. Bu til haqidagi gap, xizmat hududi haqida emas: saytda yetkazish manzili sifatida faqat Afgʻoniston (Hayraton va Mozori Sharif) yozilgan; menejerlar fors va dari tilini bilmaydi (pastdagi «Afgʻoniston, tranzit va ombor» boʻlimi). Raqamlar faqat `src/lib/format.ts` orqali formatlanadi (forschada ۰–۹ raqamlari).
- **Yozilayotgan til (PendingLang).** zh va fa tarjimasi tugagan: `src/i18n/config.ts` da `type PendingLang = never;`. Shuning uchun TypeScript har bir yozuvda zh/fa ni talab qiladi, `src/data/services/load.ts` zh/ yoki fa/ dagi xizmat fayli yetishmasa build'ni toʻxtatadi, skriptlar esa har bir boʻshliqni (tarjima qilinmagan matn, yozilmagan maqola) xato deb hisoblaydi. Mexanizm keyingi til uchun saqlangan: yangi lokal tarjima qilinayotganda uni shu qatorga yozing (`type PendingLang = 'xx';`) va yonidagi `pendingLocales` da uning belgisini `true` qiling (ikkalasi mos kelmasa, `astro check` xato beradi). Shunda uning tarmogʻi ixtiyoriy boʻladi, `pick()` inglizchasini koʻrsatadi, shu qatorni `scripts/locales.mjs` orqali oʻqiydigan barcha skriptlar esa yetishmayotgan tarjimani **sanab koʻrsatadi**, build'ni toʻxtatmaydi (tarjima qilinmagan matn — ogohlantirish). Tarjima tugagach, ikkalasini qaytaring.
- `npm run test:translations` (`scripts/test-translations.mjs`) har bir zh/fa yozuvini, xizmat sahifasini va maqolani inglizchasi bilan solishtiradi: bir xil kalitlar va massiv uzunliklari (jadval qatorlari/ustunlari, sarlavhalar, roʻyxat bandlari), bir xil `{oʻrinbosar}`lar, oʻzgarmagan identifikatorlar (uz/ru/en da bir xil boʻlgan satr — kalit, ikonka, brend, kod — tarjimada ham aynan shunday), ichki havolalar va raqamlar toʻplami. Raqam farqi faqat sababi bilan `scripts/test-translations.allow.json` ga yozilsa oʻtadi.
- OG rasmlar `public/og/zh.png` va `public/og/fa.png` brauzerda (Chromium) qatʼiy belgilangan shriftlar bilan chiziladi — buyruq va oʻzgaruvchilar `scripts/generate-og.mjs` boshida. Shriftlar saytga qoʻshilmaydi; rasmlar commit qilinadi, CI ga shrift kerak emas.

### Afgʻoniston, tranzit va ombor (yangi yoʻnalish)

Egasi 2026-11-11 da tasdiqlagan uch xizmat: `afghanistan` — Afgʻonistonga yuk tashish, `transit` — Oʻzbekiston orqali tranzit hujjatlari, `bonded` — Toshkentda bojxona nazoratidagi ombor va qayta yuklash. Matnlari: `src/data/services/{afghanistan,transit,bonded}.content.ts` (uz/ru/en) va `zh/`, `fa/` papkalaridagi tarjimalari; savol-javobdagi guruhi — `src/data/faq.ts` (`regional`). Bu sahifalar faqat tasdiqlangan narsani aytadi, pastdagi tekshiruv esa buni build vaqtida talab qiladi:

- **Qayerga:** Afgʻonistonda ikki nuqtagacha — Hayraton (chegara, mijoz yukni shu yerda oladi) va Mozori Sharif. Afgʻonistonning boshqa shaharlari ham, boshqa mamlakatlar ham saytda yetkazish manzili sifatida yozilmaydi: egasi ularni saytda eʼlon qilish uchun tasdiqlamagan.
- **Qayerdan va nimada:** Xitoydan (Oʻzbekiston orqali tranzit tartibida) va Oʻzbekistondan; faqat fura bilan — butun fura yoki yigʻma yuk. Bu yoʻnalishda temir yoʻl, vagon va avia taklif qilinmaydi.
- **Narx va muddat:** soʻrov boʻyicha. Kun soni, narx, eng kichik hajm (m³), reyslar jadvali yozilmaydi; «har hafta», «muntazam reys» kabi vaʼdalar ham. Saytdagi raqamlar Xitoy → Toshkent yoʻnalishiniki ekani alohida jumlada aytiladi.
- **Ofis:** Afgʻonistonda ofis, filial yoki vakil yoʻq — bor deb yozilsa, build toʻxtaydi (inkor jumlasi va savol oʻtadi).
- **Raqamsiz sahifalar:** bu uch xizmat sahifasida (`src/data/services.ts` da `quote: 'request'`) kun, narx, hajm, maydon yoki foiz raqami umuman yozilmaydi — joy nomi yonida turmasa ham («7–10 kun», «bir haftada», «30 kungacha saqlanadi», «2 000 m²»). Raqam Xitoy → Toshkent yoʻnalishiniki ekanini oʻsha jumlaning oʻzida aytgan gap oʻtadi («Saytdagi 1 m³ minimum Xitoydan Toshkentga keladigan yigʻma yukka tegishli»). Shu sahifalarda omborning huquqiy turi («bojxona ombori», «СВХ», «bonded») va sanksiyalar haqidagi jumla ham yozilmaydi. Toʻrtinchi shunday xizmat qoʻshilsa, uning slug'ini `scripts/check-content.mjs` dagi roʻyxatga ham qoʻshing — aks holda build toʻxtaydi.
- **Ombor:** bojxona nazoratidagi ombor hamkorniki, kompaniya undan mijozlariga joy ajratadi. «Bizning omborimiz» deyilmaydi (ombor sahifalarida bu ingliz, xitoy va fors tillarida ham tekshiriladi), saqlash muddati yozilmaydi.
- **Til:** menejerlar fors va dari tilida gaplashmaydi. Sayt shunday yozadi: fors yoki dari tilida yozgan mijozga tarjimon yordamida forscha javob beriladi; ingliz, rus va oʻzbek tillarida ham javob beriladi. «Tarjimon yordamida» soʻzlari tushib qolsa, build toʻxtaydi.
- **Joy nomlari:** oʻzbekcha — Afgʻoniston, Hayraton, Mozori Sharif, Termiz; ruscha — Афганистан, Хайратон, Мазари-Шариф, Термез; inglizcha — Afghanistan, Hairatan, Mazar-i-Sharif, Termez; xitoycha — 阿富汗, 海拉顿, 马扎里沙里夫, 铁尔梅兹; forscha — افغانستان، حیرتان، مزار شریف، ترمذ.

Egasi yangi manzilni (yoki boshqa transport turini, yoki raqamni) tasdiqlasa, avval `scripts/content-rules.mjs` dagi tegishli qoida va jadval qatorini oʻzgartiring, keyin matnni yozing — aks holda build yangi jumlani oʻtkazmaydi.

### Matn tekshiruvi (avtomatik)

`npm run build` oxirida `scripts/check-content.mjs` barcha sahifalarni tekshiradi va quyidagilar topilsa build toʻxtaydi:

- tasdiqlanmagan vaʼda va daʼvolar: «bojsiz olib kelamiz», «hujjatsiz olib kelamiz», «rastamojka kerak emas», «eng yaxshi kargo», «xalqaro kompaniya», 400+ dan boshqa mijozlar soni, oylik hajm (egasi 2026-11-11 da tasdiqlagani — oyiga 50–100 konteyner; fura soni endi yozilmaydi), kompaniya yoshi (8+ yildan boshqa «N+ yil»; 15 yil — jamoaning tajribasi, kompaniyaniki emas), viloyat filiallari, tasdiqlanmagan assotsiatsiya vakilligi. «100% kafolat» yoki «eng tez» kabi soʻzlarni skript tutmaydi — ularni baribir yozmang (pastdagi halollik qoidasi);
- kuzatuv haqidagi ortiqcha vaʼda: «real vaqt», «jonli joylashuv», GPS orqali kuzatuv, mijozga QR kodni «skanerlang» deyish (skanerlashni xodimlar qiladi);
- Xitoydagi qabul punktlarini (Ivu, Guanchjou, Qashqar) «bizning omborimiz» deb atash — egalik tasdiqlanmagan: hamma joyda «Ivu ombori», «Guanchjou qabul punkti», «Qashqar qabul punkti». Toshkentdagi bojxona nazoratidagi ombor ham hamkorniki, shuning uchun u ham «omborimiz» emas: «hamkor ombori», «bojxona nazoratidagi ombor»;
- **yetkazish manzili** (beshta tilda va kirillda): yuk yetkaziladigan joy sifatida faqat Oʻzbekiston va Afgʻonistondagi ikki nuqta — Hayraton va Mozori Sharif — yozilishi mumkin. Eron, Qozogʻiston, Rossiya yoki boshqa mamlakatga, Kobul, Hirot, Qandahor, Tehron yoki Mashhadga yuk tashish yoxud yetkazish haqidagi gap build'ni toʻxtatadi; oʻsha mamlakatni alohida yoʻnalish deb atash ham («Eron yoʻnalishi», «Yangi yoʻnalish: Eron») shunday. Shu besh shaharning nomi oʻzi ham xato: yetkazish nuqtalari roʻyxatiga qoʻshilgan uchinchi nom (masalan, «Hayraton · Mozori Sharif · Kobul») feʼlsiz ham daʼvo boʻladi. JSON-LD dagi `areaServed` kabi qiymat shu roʻyxatda yoʻq joy nomining oʻzi boʻlsa, u ham xato. Inkor («…ga yuk tashimaymiz»), savol va yoʻl tavsifi («Qozogʻiston orqali», «Qozogʻiston boʻylab», «Qozogʻiston chegarasi») oʻtadi;
- **fors tilini biladigan xodimlar haqidagi daʼvo** (beshta tilda va kirillda): xodimlar fors yoki dari tilini bilishi haqidagi har qanday gap, «forscha qoʻllab-quvvatlash» ham — xato, chunki bunday xodim yoʻq. Forscha javob haqidagi jumla faqat «tarjimon yordamida» soʻzlari bilan oʻtadi. Inkor («menejerlar fors tilida gaplashmaydi») va savol oʻtadi: sayt haqiqatni ayta olishi kerak;
- **Afgʻoniston yoʻnalishi** (beshta tilda va kirillda): Afgʻoniston, Hayraton yoki Mozori Sharif nomi bilan bitta jumlada kun, hafta yoki soat soni yoxud narx kelishi; shu nomlar yonida temir yoʻl, vagon yoki avia soʻzi kelishi (inkor va savol oʻtadi). Saytdagi raqamlar Xitoy → Toshkent yoʻnalishiniki ekanini, shuningdek «Xitoydan — avia va temir yoʻl, Afgʻonistonga — fura» kabi qiyosni alohida jumlalar bilan yozing;
- yigʻma yuk va temir yoʻl boʻyicha eskirgan takliflar: 0,1 m³ minimum, kichik buyurtmalar, «FCL yoki LCL», «konteynerdagi joy», yigʻma yuk uchun «fura yoki konteyner» («Narxlarni yangilash» boʻlimiga qarang);
- egasi 2026-09-09 da almashtirgan eski kontaktlar (roʻyxati `scripts/check-content.mjs` ichida; bu yerda ataylab yozilmagan — README ochiq, qidiruv tizimlarining AI-xulosalari uni oʻqib, eski raqamlarni kompaniya kontakti deb koʻrsatgan) va Guanchjou haqidagi eskirgan «hamkorlar orqali» jumlasi;
- javob tezligini vaʼda qilish («hozir javob beramiz», «быстрее всего», «fastest reply»);
- kalka va ruscha soʻzlar: Kitay, zayavka, tomonidan, amalga oshiramiz, «Sizning yukingiz», uzel;
- «powerbank» (toʻgʻrisi — «power bank»);
- har sahifada bitta `h1`, oddiy apostrof, raqam uslubi, tillar aralashuvi.

Sinov jumlalari bilan yozilgan qoidalar `scripts/content-rules.mjs` da turadi (`CLAIM_RULES`). U yerda ikki xil qoida bor. Birinchisi — yuqoridagi oʻzbekcha/ruscha/inglizcha qoidalarning xitoycha va forscha egizaklari: «bizning omborimiz», real vaqt/GPS kuzatuvi, GSR'ga biriktirilgan 15 yil, 400+ mijoz va oyiga 50–100 konteynerdan boshqa raqamlar, temir yoʻlda yigʻma yuk, «fura yoki konteyner», javob tezligi va boshqalar. Ikkinchisi — beshta tilda va kirillda birdan yozilgan qoidalar: yetkazish manzili, fors tilida gaplashadigan xodimlar va Afgʻoniston yoʻnalishi (raqam, hajm, jadval va tajriba yoʻq; faqat fura; u yerda ofis, vakil yoki hamkor yoʻq; Afgʻonistondan yuk olib kelish va «barcha shaharlar» yoʻq; Afgʻoniston tomonidagi bojxona zimmamizda deyilmaydi). Har bir qoida yonida u ushlashi kerak boʻlgan (`bad`) va oʻtkazib yuborishi kerak boʻlgan (`good`) jumlalar turadi; skript sahifalarni oʻqishdan oldin ularni tekshiradi. `good` jumla — sayt aytishi mumkin boʻlgan gap, shuning uchun u faqat oʻz qoidasidan emas, barcha qoidalardan oʻtishi shart (masalan, «tarjimon yordamida forscha javob beramiz» jumlasi har bir tilda shunday mahkamlangan).

Joy nomlari oʻsha faylda uchta jadvalda: yoʻl ustidagi ikki davlat (Qozogʻiston, Qirgʻiziston — marshrut tavsifida uchraydi, shuning uchun ularda faqat «oʻsha yerga yuk tashiymiz» degan gap xato), saytda yetkazish manzili sifatida yozilmaydigan qolgan joylar (ular ichida besh shahar alohida roʻyxatda turadi — nomining oʻzi xato boʻladiganlari) va saytda yoziladigan joylar. Har bir joy — bitta qator, olti ustun: oʻzbekcha, kirillcha, ruscha, inglizcha, xitoycha, forscha. Egasi yangi manzilni tasdiqlasa yoki roʻyxatga yana bir mamlakat qoʻshish kerak boʻlsa, bitta qator oʻzgaradi — olti tildagi roʻyxat bir-biridan ajralib ketmaydi; ustuni yetishmagan qator build'ni toʻxtatadi.

Qoidalar barcha sahifalar matnida, sayt sarlavhasi (menyu) va pastki qismida, `<title>`, meta/OG tavsiflari, JSON-LD, `llms.txt` va `llms-full.txt` boshida ishlaydi; fors raqamlari, bidi belgilari va xitoycha soʻzlar orasidagi boʻshliqlar oldindan normallashtiriladi. Afgʻoniston yoʻnalishining qoidalari matnni blokma-blok oʻqiydi — bitta abzas, sarlavha, roʻyxat bandi yoki jadval qatori: aks holda bosh sahifadagi qoʻshni kartochkalar matni bir-biriga ulanib, yolgʻon xato chiqardi. zh/fa sahifalarida qoʻshimcha ravishda: anʼanaviy xitoy ierogliflari, arabcha ي/ك va ٠–٩, fors matni yonidagi «→» va «·», `src/lib/format.ts` dan oʻtmay lotin raqamlari bilan chiqqan fors miqdorlari (masalan «20–35 روز», «مالیات 12%»), guruhlari boʻsh joy bilan ajratilgan raqamlar (oʻngdan chapga yozuvda «۵ ۰۰۰» «۰۰۰ ۵» boʻlib koʻrinadi; fors tilida ٬ bilan: ۵٬۰۰۰), hamda tarjima qilinmagan inglizcha/oʻzbekcha/ruscha matn (PendingLang paytida — hisobotda sanaladi, keyin — xato; ofisning rasmiy koʻcha manzili — `site.address.streetAddress` — aynan shu yozuvda va xitoycha yoki forscha matn ichida kelsa, tarjimasiz matn hisoblanmaydi, yonida oʻzbekcha yoki inglizcha soʻz boʻlsa — hisoblanadi).

Xato chiqsa, u sahifa manzili bilan koʻrsatiladi — matnni tuzatib qayta build qiling.

## Yangi blok qoʻshish (Ishlarimizdan lavhalar)

«Ishlarimizdan lavhalar» sahifasi (`/ishlarimiz/`; `/ru/nashi-raboty/`, `/en/our-work/`, `/zh/our-work/`, `/fa/our-work/`, `/kirill/ишларимиз/`) bajarilayotgan ishlarning video va suratlarini bloklar qilib koʻrsatadi — eng yangisi tepada; bosh sahifadagi shu nomli boʻlimda oxirgi uchtasi chiqadi. **Har bir blok — bitta papka:**

1. `src/content/works/` ichida papka oching: `YYYY-MM-DD-nom`, masalan `src/content/works/2026-12-01-ivuda-yuklash/` (nomida lotin harflari, raqam va chiziqcha).
2. Videoni va/yoki suratlarni shu papkaga qoʻying.
   - **Video** — MP4. Telefon yoki montajdan chiqqan faylni (iPhone'ning `.MOV` fayli ham boʻladi) avval shu buyruq bilan siqing — H.264, sayt va telefonlarda darrov ochiladi; uzun tomoni 1920 px dan oshmaydi (4K video 1080p ga tushadi), tik video tikligicha qoladi; `-refs 4` videoni eski telefonlar ham ochadigan qiladi (H.264 level 4.0; sekundiga 60 kadrli videoda 4.2):
     ```bash
     ffmpeg -i input.mp4 -vf "scale='if(gte(iw,ih),min(1920,iw),-2)':'if(gte(iw,ih),-2,min(1920,ih))'" -c:v libx264 -preset slow -refs 4 -crf 24 -profile:v high -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k -ac 2 output.mp4
     ```
     Fayl nomida faqat lotin harflari, raqam, `-` va `_` boʻlsin (masalan `ivuda-yuklash.mp4`; boʻsh joy boʻlsa build toʻxtaydi). Fayl 50 MB dan katta boʻlmasin: kattaroq chiqsa, buyruqdagi `-crf 24` ni `-crf 28` qilib qayta siqing yoki videoni qisqartiring (birinchi blokdagi 40 soniyalik film shu buyruqdan keyin ~6 MB; telefonda olingan jonli video ancha katta chiqadi). Videoga **poster** ham kerak — video ishga tushguncha koʻrinadigan rasm (JPG yoki PNG); videodan bitta kadr olish: `ffmpeg -ss 1 -i output.mp4 -frames:v 1 -q:v 2 poster.jpg`. Tik (vertikal) video ham boʻladi: sahifada u ekran balandligiga sigʻadigan qilib, torroq koʻrsatiladi.
   - **Suratlar** — JPG yoki PNG (iPhone'ning HEIC suratlarini avval JPG ga oʻgiring), asl oʻlchamda: sayt ularni oʻzi kichraytiradi, bosilganda katta surat ochiladi.
3. Birinchi blokdagi `index.md` ni (`src/content/works/2026-11-11-route-video/index.md`) yangi papkaga nusxalang va oʻzgartiring: `date` (sana), `video` va `poster` yoki `photos` (suratlar roʻyxati, har biriga ixtiyoriy `alt` — surat tavsifi), `duration` (video necha soniya, ixtiyoriy), `title` (sarlavha) va `text` (qisqa matn). Matnda `uz` majburiy, `ru`, `en`, `zh`, `fa` — ixtiyoriy: **matni yoʻq tilda blok faqat video/suratlar va sana bilan chiqadi**, boshqa tildagi matn u yerda hech qachon koʻrinmaydi (build bunday bloklarni eslatma qilib sanab beradi). Kirill sahifa uchun hech narsa yozilmaydi — u oʻzbekcha matndan avtomatik olinadi.
4. `git push` — sahifa, bosh sahifa va sitemap oʻzi yangilanadi. Push qilishdan oldin `npm run dev` bilan koʻrib chiqish (yangi blok darrov chiqadi) va `npm run build` bilan tekshirish mumkin — biror narsa notoʻgʻri boʻlsa, build nimaligini aytadi. Blokni vaqtincha yashirish uchun `draft: true` yozing: blok sahifalardan yoʻqoladi, lekin uning video va suratlari repozitoriyda qoladi va saytga havolasiz nusxalanadi — sir saqlanishi kerak boʻlgan faylni draft qilib qoʻymang. Hamma blokni olib tashlash kerak boʻlsa ham `draft: true` qoʻygan maʼqul: oxirgi papka oʻchirilsa, kompyuterdagi build Astro keshida qolgan eski blokni izlab xato berishi mumkin — unda `node_modules/.astro` papkasini oʻchirib, qayta build qiling (GitHub'dagi build har safar toza boshlanadi).

Build oxirida `scripts/check-content.mjs` (`scripts/works-blocks.mjs` orqali) tekshiradi: papka nomi (lotin harflari, raqam, chiziqcha), papkadagi har bir fayl joyida, video H.264 MP4 (iPhone'ning HEVC videosi oʻtmaydi — yuqoridagi buyruq bilan siqing) va 50 MB dan oshmaydi, videoning posteri bor, har bir blok olti tildagi sahifada (eng yangi uchtasi bosh sahifada) va hech bir sahifada boshqa tildagi matn yoʻq. Blok matnlariga ham saytning boshqa qoidalari amal qiladi (tasdiqlanmagan raqam va daʼvolar yoʻq): masalan, oylik hajm faqat «oyiga 50–100 konteyner» deb yoziladi, boshqa oylik raqam yoki «+» bilan yozilgan fura va konteyner soni build'ni toʻxtatadi; bitta yuk yoki «shu oyda» joʻnatilgan yuk haqidagi gap esa mumkin. Matnda yangi lotincha nom yoki qisqartma boʻlsa (birinchi blokdagi BARLOU, HAOMENG kabi), uni `src/lib/cyrillic.terms.ts` dagi `brands` roʻyxatiga qoʻshing — aks holda kirill sahifada u kirill harflarida chiqadi, `npm run test:cyrillic` esa xato beradi.

## SEO va AI-qidiruv

`docs/SEO-PLAYBOOK.md` — egasi uchun toʻliq reja: Google Search Console, Bing Webmaster (IndexNow), Yandex Webmaster, Google Business Profile / Yandex Business / 2GIS kartochkalari, sharhlar, oylik narx yangilash, oylik AI-soʻrov testi. Sayt tomonidan tayyor: `robots.txt` (barcha AI-kraulerlarga ruxsat), `sitemap-index.xml` (hreflang bilan), `llms.txt` + `llms-full.txt`, JSON-LD (Organization/LocalBusiness, Service, FAQPage, Article, BreadcrumbList, VideoObject), OG rasmlar, IndexNow kaliti.

Halollik qoidasi: saytda tasdiqlanmagan daʼvolar yoʻq (mijozlar soni, sertifikatlar, «bojsiz», «100% kafolat», «eng tez», «xalqaro kompaniya»; Oʻzbekiston va Afgʻonistondagi ikki nuqtadan boshqa yetkazish manzili; yangi yoʻnalishdagi narx va muddat; fors tilida gaplashadigan xodimlar). Yangi fakt qoʻshishdan oldin uni isbotlash mumkinligiga ishonch hosil qiling — AI-qidiruv tizimlari ham, mijozlar ham buni tekshiradi.

## Tuzilma

```
src/
  layouts/Base.astro          sahifa qobigʻi (head, SEO, JSON-LD, header/footer)
  components/sections/        bosh sahifa boʻlimlari
  components/journey/         «Yoʻl» — pinned scroll-animatsiya (SVG xarita + GSAP)
  components/pages/           sahifa shablonlari (barcha tillar uchun bitta)
  pages/  ru/ en/ zh/ fa/ kirill/   marshrutlar (yupqa oʻramlar)
  i18n/                       matnlar (uz/ru/en; zh/ va fa/ — tarjimalar), marshrut sluglari
  data/                       xizmatlar, tariflar, FAQ, qoʻllanma sluglari
  content/guides/             Markdown maqolalar
  content/works/              «Ishlarimizdan lavhalar»: har bir blok — bitta papka (index.md + video/suratlar)
  lib/                        site.ts (kompaniya faktlari), schema.ts, format.ts
scripts/                      xarita generatori, OG rasmlar, llms-full, IndexNow, build'dan keyingi tekshiruvlar
                              (locales.mjs — barcha skriptlar uchun yagona lokal jadvali;
                              content-rules.mjs — sinov jumlalari bilan yozilgan daʼvo qoidalari va joy nomlari jadvallari)
functions/api/                Cloudflare Pages Functions (kuzatuv; `lead.ts` endi ishlatilmaydi — forma GSR tizimi orqali ishlaydi)
docs/                         SEO-PLAYBOOK, DEPLOY-FUNCTIONS
```
