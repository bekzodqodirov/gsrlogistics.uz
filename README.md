# GSR Logistics — gsrlogistics.uz

Xitoydan Oʻzbekistonga yuk tashish, tovar topish va sotib olish boʻyicha kompaniyaning rasmiy sayti. Olti lokal: oʻzbek lotin (asosiy, `/`), rus (`/ru/`), ingliz (`/en/`), oʻzbek kirill (`/kirill/`, lotinchadan avtomatik), xitoy — soddalashtirilgan (`/zh/`) va fors — oʻngdan chapga (`/fa/`); kirilldan boshqa beshtasi qoʻlda yoziladi. Statik, juda yengil, AI-qidiruv (ChatGPT, Claude, Gemini, Perplexity, Yandex) va Google/Yandex uchun optimallashtirilgan.

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
2. Oxirgi tugma bosilganda brauzer bitta soʻrov yuboradi: `https://gsrwms.uz/api/lead/assign?team=…&lead=GSR-…&tag=…&page=…&lang=…`. Bu yerda `team` — `cargo` (yigʻma yuk, avia, temir yoʻl, bojxona, ombor), `buying` (tovar topish, sotib olish, uskunalar, avtomobil) yoki `general`; `lead` — shu bosish uchun yaratilgan bir martalik kod.
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

## Kontentni tahrirlash

- Xizmat sahifalari: `src/data/services/<xizmat>.content.ts` (uz/ru/en bir faylda); xitoycha va forscha tarjimasi — `src/data/services/zh/<xizmat>.content.ts` va `src/data/services/fa/<xizmat>.content.ts`.
- Qoʻllanma maqolalari: `src/content/guides/<til>/<slug>.md` (Markdown, yuqorisida frontmatter); zh/fa maqola inglizcha maqola bilan **bir xil fayl nomida** (`src/content/guides/zh/<slug>.md`). Yangi maqola qoʻshsangiz `src/data/guides.ts` ga har tildagi slug'ni ham qoʻshing (hreflang uchun; zh va fa — inglizcha slug).
- Savol-javob: `src/data/faq.ts`.
- Bosh sahifa boʻlimlari matnlari: `src/i18n/*.ts`; ularning xitoycha va forscha tarjimasi — `src/i18n/zh/<modul>.ts` va `src/i18n/fa/<modul>.ts` (bir faylda bitta til).
- Oʻzbek matnida ʻ (U+02BB) va ʼ (U+02BC) belgilaridan foydalaning (oʻ, gʻ, maʼlumot), oddiy ' emas.

### Xitoy (zh) va fors (fa) tillari

- Ikkalasi ham **inglizcha** matndan tarjima qilinadi va inglizcha slug'larni ishlatadi (`/en/pricing/` → `/zh/pricing/`, `/fa/pricing/`). Fors tili — oʻngdan chapga (`<html dir="rtl">`), Eron va Afgʻoniston oʻquvchilari uchun bitta matn. Raqamlar faqat `src/lib/format.ts` orqali formatlanadi (forschada ۰–۹ raqamlari).
- **Yozilayotgan til (PendingLang).** zh va fa tarjimasi tugagan: `src/i18n/config.ts` da `type PendingLang = never;`. Shuning uchun TypeScript har bir yozuvda zh/fa ni talab qiladi, `src/data/services/load.ts` zh/ yoki fa/ dagi xizmat fayli yetishmasa build'ni toʻxtatadi, skriptlar esa har bir boʻshliqni (tarjima qilinmagan matn, yozilmagan maqola) xato deb hisoblaydi. Mexanizm keyingi til uchun saqlangan: yangi lokal tarjima qilinayotganda uni shu qatorga yozing (`type PendingLang = 'xx';`) va yonidagi `pendingLocales` da uning belgisini `true` qiling (ikkalasi mos kelmasa, `astro check` xato beradi). Shunda uning tarmogʻi ixtiyoriy boʻladi, `pick()` inglizchasini koʻrsatadi, shu qatorni `scripts/locales.mjs` orqali oʻqiydigan barcha skriptlar esa yetishmayotgan tarjimani **sanab koʻrsatadi**, build'ni toʻxtatmaydi (tarjima qilinmagan matn — ogohlantirish). Tarjima tugagach, ikkalasini qaytaring.
- `npm run test:translations` (`scripts/test-translations.mjs`) har bir zh/fa yozuvini, xizmat sahifasini va maqolani inglizchasi bilan solishtiradi: bir xil kalitlar va massiv uzunliklari (jadval qatorlari/ustunlari, sarlavhalar, roʻyxat bandlari), bir xil `{oʻrinbosar}`lar, oʻzgarmagan identifikatorlar (uz/ru/en da bir xil boʻlgan satr — kalit, ikonka, brend, kod — tarjimada ham aynan shunday), ichki havolalar va raqamlar toʻplami. Raqam farqi faqat sababi bilan `scripts/test-translations.allow.json` ga yozilsa oʻtadi.
- OG rasmlar `public/og/zh.png` va `public/og/fa.png` brauzerda (Chromium) qatʼiy belgilangan shriftlar bilan chiziladi — buyruq va oʻzgaruvchilar `scripts/generate-og.mjs` boshida. Shriftlar saytga qoʻshilmaydi; rasmlar commit qilinadi, CI ga shrift kerak emas.

### Matn tekshiruvi (avtomatik)

`npm run build` oxirida `scripts/check-content.mjs` barcha sahifalarni tekshiradi va quyidagilar topilsa build toʻxtaydi:

- tasdiqlanmagan daʼvolar: «bojsiz», «100% kafolat», «eng tez», «xalqaro», mijozlar soni, viloyat filiallari;
- Xitoydagi qabul punktlarini (Ivu, Guanchjou, Qashqar) «bizning omborimiz» deb atash — egalik tasdiqlanmagan: hamma joyda «Ivu ombori», «Guanchjou qabul punkti», «Qashqar qabul punkti»;
- egasi 2026-09-09 da almashtirgan eski kontaktlar (roʻyxati `scripts/check-content.mjs` ichida; bu yerda ataylab yozilmagan — README ochiq, qidiruv tizimlarining AI-xulosalari uni oʻqib, eski raqamlarni kompaniya kontakti deb koʻrsatgan) va Guanchjou haqidagi eskirgan «hamkorlar orqali» jumlasi;
- javob tezligini vaʼda qilish («hozir javob beramiz», «быстрее всего», «fastest reply»);
- kalka va ruscha soʻzlar: Kitay, zayavka, tomonidan, amalga oshiramiz, uzel;
- «powerbank» (toʻgʻrisi — «power bank»);
- har sahifada bitta `h1`, oddiy apostrof, raqam uslubi, tillar aralashuvi.

Xuddi shu biznes qoidalari xitoycha va forscha ham bor (`scripts/content-rules.mjs`: «bizning omborimiz», real vaqt/GPS kuzatuvi, GSR'ga biriktirilgan 15 yil, 400+ va 10+ dan boshqa raqamlar, Afgʻoniston/Eron/Qozogʻistonga yetkazish, temir yoʻlda yigʻma yuk, «fura yoki konteyner», javob tezligi va boshqalar). Har bir qoida yonida u ushlashi va oʻtkazib yuborishi kerak boʻlgan jumlalar turadi; skript sahifalarni oʻqishdan oldin ularni tekshiradi. Qoidalar barcha sahifalar matnida, `<title>`, meta/OG tavsiflari, JSON-LD va `llms.txt` da ishlaydi; fors raqamlari, bidi belgilari va xitoycha soʻzlar orasidagi boʻshliqlar oldindan normallashtiriladi. zh/fa sahifalarida qoʻshimcha ravishda: anʼanaviy xitoy ierogliflari, arabcha ي/ك va ٠–٩, fors matni yonidagi «→» va «·», `src/lib/format.ts` dan oʻtmay lotin raqamlari bilan chiqqan fors miqdorlari (masalan «20–35 روز», «مالیات 12%»), guruhlari boʻsh joy bilan ajratilgan raqamlar (oʻngdan chapga yozuvda «۵ ۰۰۰» «۰۰۰ ۵» boʻlib koʻrinadi; fors tilida ٬ bilan: ۵٬۰۰۰), hamda tarjima qilinmagan inglizcha/oʻzbekcha/ruscha matn (PendingLang paytida — ogohlantirish, keyin — xato; ofisning rasmiy koʻcha manzili — `site.address.streetAddress`, aynan shu yozuvda — tarjimasiz matn hisoblanmaydi).

Xato chiqsa, u sahifa manzili bilan koʻrsatiladi — matnni tuzatib qayta build qiling.

## SEO va AI-qidiruv

`docs/SEO-PLAYBOOK.md` — egasi uchun toʻliq reja: Google Search Console, Bing Webmaster (IndexNow), Yandex Webmaster, Google Business Profile / Yandex Business / 2GIS kartochkalari, sharhlar, oylik narx yangilash, oylik AI-soʻrov testi. Sayt tomonidan tayyor: `robots.txt` (barcha AI-kraulerlarga ruxsat), `sitemap-index.xml` (hreflang bilan), `llms.txt` + `llms-full.txt`, JSON-LD (Organization/LocalBusiness, Service, FAQPage, Article, BreadcrumbList), OG rasmlar, IndexNow kaliti.

Halollik qoidasi: saytda tasdiqlanmagan daʼvolar yoʻq (mijozlar soni, sertifikatlar, «bojsiz», «xalqaro»). Yangi fakt qoʻshishdan oldin uni isbotlash mumkinligiga ishonch hosil qiling — AI-qidiruv tizimlari ham, mijozlar ham buni tekshiradi.

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
  lib/                        site.ts (kompaniya faktlari), schema.ts, format.ts
scripts/                      xarita generatori, OG rasmlar, llms-full, IndexNow, build'dan keyingi tekshiruvlar
                              (locales.mjs — barcha skriptlar uchun yagona lokal jadvali)
functions/api/                Cloudflare Pages Functions (kuzatuv; `lead.ts` endi ishlatilmaydi — forma GSR tizimi orqali ishlaydi)
docs/                         SEO-PLAYBOOK, DEPLOY-FUNCTIONS
```
