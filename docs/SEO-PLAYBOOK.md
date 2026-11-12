# SEO va AI-qidiruv boʻyicha egasi uchun reja (gsrlogistics.uz)

Maqsad: «Xitoydan yuk olib kelish», «карго из Китая в Ташкент», «China cargo Uzbekistan» kabi soʻrovlarda Google/Yandex hamda ChatGPT, Claude, Gemini, Perplexity javoblarida GSR Logistics tavsiya qilinishi.

Halol eslatma: hech bir sayt AI javoblarida 1-oʻrinni **kafolatlay olmaydi** — AI tizimlari jonli qidiruv indekslariga (ChatGPT → Bing, Claude → Brave, Gemini → Google + Google Business Profile, Yandex Neuro → Yandex) tayanadi va natijalar tez oʻzgaradi. Ammo tadqiqotlar koʻrsatadiki, quyidagi 3 narsa eng koʻp taʼsir qiladi: (1) sahifa indeksda bor va savolga birinchi jumlada aniq raqam bilan javob beradi; (2) kompaniya kartochkalar/sharhlarda (Google Business, Yandex, 2GIS) izchil mavjud; (3) brend haqida boshqa saytlarda eslatmalar bor. Sayt (1)-ni bajaradi; (2) va (3) — sizning ishingiz.

## 1. Ishga tushirish kuni (bir marta)

1. **Google Search Console** — search.google.com/search-console → «Domain» turi → DNS TXT yozuvini qoʻshing → Sitemaps boʻlimiga `https://gsrlogistics.uz/sitemap-index.xml` yuboring.
2. **Bing Webmaster Tools** — bing.com/webmasters → saytni qoʻshing (Google Search Console'dan import qilsa boʻladi) → sitemap yuboring. ChatGPT qidiruvi Bing indeksiga tayanadi — bu majburiy.
3. **IndexNow** — sayt tayyor: `public/98c92c618942ec4f59a5448c62c9b486.txt` kalit fayli. Har deploy'dan keyin `npm run indexnow` (yoki Cloudflare Pages'da build buyrugʻiga `&& node scripts/indexnow.mjs dist` qoʻshing).
4. **Yandex Webmaster** — webmaster.yandex.com → sayt qoʻshing → meta-teg yoki DNS orqali tasdiqlang → sitemap yuboring. Oʻzbekistonda qidiruvning ~24% Yandex.
5. **Brave Search** — search.brave.com/submit-url ga bosh sahifani yuboring (Claude qidiruvi Brave'ga tayanadi).
6. **Cloudflare** ishlatsangiz: Security → Bots → «Block AI bots» **oʻchirilgan** boʻlsin, aks holda AI-kraulerlar saytni koʻrmaydi.

## 2. Kartochkalar (NAP — nom, manzil, telefon hamma joyda BIR XIL)

Nom: `GSR Logistics` (yuridik shaxs: `Imex services LLC`) · Manzil: `Toshkent, Shayxontohur tumani, Alisher Navoiy koʻchasi, 27` · Telefon: `+998 95 018 33 33`, `+998 90 175 78 00` (WhatsApp) · E-mail: `b.e.kodirov@gmail.com` · Telegram: `t.me/bekzodkodirov556` · Sayt: `https://gsrlogistics.uz`

- **Google Business Profile** (business.google.com): kategoriya «Freight forwarding service» / «Logistics service»; ish vaqti; xizmatlar roʻyxati (narx bilan); ombor/yuk fotolari; haftada 1 post; savol-javob boʻlimiga javob bering. Gemini va Google AI Mode aynan shu kartochkaga tayanadi.
- **Yandex Business** (yandex.uz/business): mavjud kartochkani (org/98882247475) tasdiqlab oling, maʼlumotlarni yangilang, fotolar qoʻshing.
- **2GIS** (2gis.uz): eski kartochka oʻchirilgan — yangisini yarating.
- **Yellowpages.uz / top.uz**: manzil «Shayxontohur» (Olmazor emas), sayt `https://gsrlogistics.uz` (`gsrlogistic.uz` emas), rubrika «Международные грузоперевозки» (samosval emas). **Goldenpages.uz** (Id=99695): nom «GSR Logistics» (yuridik shaxs Imex services LLC, «GSR GROUP QK MChJ» emas), ish vaqti 9:00–19:00, sayt yoʻq — qoʻshing. Toʻliq matn: `docs/KORINUVCHANLIK-2026-10.md`.
- **Bing Places, Apple Business Connect** — 10 daqiqa, bepul.

## 3. Sharhlar

Har mijozdan yuk topshirilgach Google, Yandex va 2GIS'da sharh soʻrang (Telegramga tayyor havola yuboring). Har sharhga javob yozing. AI-tizimlar (ayniqsa Claude va Perplexity) sharh va foydalanuvchi kontentini koʻp keltiradi.

## 4. Eslatmalar (backlink emas — brend eslatmasi)

- Telegram: kanalni jonlantiring (@gsrlogistics 2023-yildan jim) — har haftada 1–2 post: yetib kelgan yuk, narx yangilanishi, foydali maslahat; har postda sayt havolasi.
- YouTube: «Xitoydan yuk qanday olib kelinadi?» tipidagi 3–5 daqiqalik videolar — sarlavha aynan savol boʻlsin. YouTube eslatmalari AI-keltirishlar bilan eng kuchli korrelyatsiyaga ega.
- Spot.uz, Kun.uz, Gazeta.uz biznes boʻlimlari, Telegram biznes-jamoalar, LinkedIn kompaniya sahifasi.

## 5. Har oy (30 daqiqa)

1. `src/data/tariffs.json` — narxlarni yangilang, `updated` sanasini oʻzgartiring, push qiling. Yangilik sanasi AI-keltirishlarda oʻlchangan omillardan biri.
2. `npm run indexnow` (yoki avtomatik).
3. **AI-test jadvali**: 10 ta soʻrov × 3 til × 5 tizim (ChatGPT, Claude, Gemini, Perplexity, Yandex Alisa). Soʻrovlar: «Xitoydan Toshkentga yuk olib kelish qancha turadi?», «карго из Китая в Ташкент цена за кг», «best cargo company China to Uzbekistan», «1688 orqali buyurtma berish Oʻzbekiston», «Xitoydan tovar topib beradigan kompaniya», «растаможка товаров из Китая Узбекистан», «avia kargo Xitoy Toshkent necha kun», «yigʻma yuk Xitoydan», «Xitoy Toshkent kargo kompaniyalari», «China Uzbekistan freight forwarder Tashkent». Natijani jadvalga yozing: sayt keltirildimi, qaysi sahifa. Keltirilmagan savollar uchun qoʻllanma/FAQ'ga aniq javob qoʻshing.
4. Google Search Console → «Generative AI performance» va Bing → «AI Performance» hisobotlarini koʻring.

## 6. Nima qilmaslik kerak

- Sahifalarga «bojsiz», «kafolat», «eng yaxshi», «xalqaro» kabi isbotsiz daʼvolar qoʻshmang — AI-tizimlar va bojxona buni tekshiradi.
- Mijoz sonlari, sertifikatlar, sharhlarni oʻylab topmang.
- Kontentni JavaScript orqali yuklamang (AI-kraulerlar JS bajarmaydi) — sayt hozir toʻliq HTML.
- Bir nechta analitika skriptlarini qoʻshmang; kerak boʻlsa faqat Yandex Metrika, `load`dan keyin.
- Til yoʻnaltirishlarini IP boʻyicha qilmang — kraulerlar AQSHdan keladi va /ru/, /en/ ga toʻgʻridan-toʻgʻri kirishi kerak.

## 7. Sayt tomonidan tayyor

`robots.txt` (barcha AI-kraulerlar: OAI-SearchBot, GPTBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, YandexAdditionalBot…), `sitemap-index.xml` (hreflang bilan), `llms.txt` + `llms-full.txt`, JSON-LD (Organization/LocalBusiness, WebSite, WebPage, BreadcrumbList, Service + Offer, FAQPage, Article), har sahifada savol shaklidagi sarlavhalar va birinchi jumlada raqamli javob, uch tilda hreflang, OG rasmlar, IndexNow.

## 8. Afgʻoniston, tranzit va ombor: saytdan tashqaridagi qadamlar (2026-yil noyabr)

Saytda uchta yangi xizmat sahifasi bor, har biri olti tilda: «Afgʻonistonga yuk tashish» (`/xizmatlar/afgonistonga-yuk-tashish/`), «Oʻzbekiston orqali tranzit hujjatlari» (`/xizmatlar/tranzit-hujjatlari/`), «Toshkentda bojxona nazoratidagi ombor» (`/xizmatlar/bojxona-ombori/`). Forscha manzillari: `/fa/services/cargo-to-afghanistan/`, `/fa/services/transit-documents/`, `/fa/services/customs-warehouse-tashkent/`. Sayt oʻz ishini qildi; quyidagilar — sizning ishingiz. Yangi roʻyxatdan oʻtish shart emas: hammasi mavjud raqam va sahifalarda bajariladi.

Afgʻonistonlik savdogar qayerdan qidiradi (tadqiqot, 2026-yil noyabr; raqamlar ochiq manbalardan, taxminiy):
- **WhatsApp** — Afgʻoniston bilan ishlaydigan deyarli har bir ekspeditor aloqa uchun aynan WhatsApp raqamini koʻrsatadi. Bizda bu `+998 90 175 78 00`.
- **Facebook** — mamlakatdagi asosiy ijtimoiy tarmoq: taxminan 5 mln foydalanuvchi, Messenger — 2,3 mln, Instagram — 1,85 mln (DataReportal, «Digital 2026: Afghanistan»; WhatsApp va Telegram boʻyicha bu hisobotda raqam yoʻq).
- **Termiz** — Oʻzbekistonning oʻzida: Termizdagi xalqaro savdo markazi va Surxondaryodagi afgʻon tadbirkorlari. Afgʻoniston savdo va investitsiya palatasi (ACCI) — rasmiy muloqot joyi.

Qadamlar:
1. **WhatsApp Business** (`+998 90 175 78 00`). Profilga nom (`GSR Logistics`), manzil, ish vaqti va sayt havolasini (`https://gsrlogistics.uz/fa/services/cargo-to-afghanistan/`) kiriting. «Katalog»ga uchta xizmatni saytdagi nomi va bir jumlalik tavsifi bilan qoʻshing — narxsiz, «narx va muddat — soʻrov boʻyicha» deb. Salomlashuv xabariga saytdagi tayyor jumlani qoʻying: «اگر به فارسی یا دری بنویسید، با کمک مترجم به فارسی پاسخ می‌دهیم.» (fors yoki dari tilida yozsangiz, tarjimon yordamida forscha javob beramiz) va mijozdan uch narsani soʻrang: yuk nima, hajmi yoki vazni, qayerdan qayerga.
2. **Google Business Profile, Yandex Business, 2GIS.** Xizmatlar roʻyxatiga uchta yangi xizmatni saytdagi nomi bilan qoʻshing (oʻzbek, rus, ingliz tillarida), narx yozmang. Manzil oʻzgarmaydi: ofis faqat Toshkentda.
3. **Facebook sahifasi** (`facebook.com/gsrlogistics`). Sahifaga WhatsApp tugmasini ulang. Dari tilida (tarjimon tekshirgan) qisqa postlar yozing: nima tashiymiz, qayergacha (Hayraton, Mozori Sharif), qanday yozish kerak (WhatsApp), forscha sahifaga havola. Afgʻoniston matbuotida tijorat yuki «اموال تجارتی» deb ataladi; uchraydigan iboralar: «انتقال کالاهای تجارتی از چین به افغانستان», «کارگو و حمل بار از چین به افغانستان». Har bir postni ona tilida soʻzlashuvchi oʻqib chiqsin.
4. **Telegram kanal** (@gsrlogistics): yangi yoʻnalish haqida bitta post — oʻzbek va rus tillarida, uchta sahifaga havola bilan.
5. **Har oylik AI-test jadvaliga** (5-boʻlim) qoʻshing: «Xitoydan Afgʻonistonga yuk tashish», «Toshkentdan Afgʻonistonga fura», «грузы в Афганистан из Ташкента», «транзитная декларация Узбекистан таможенный брокер», «cargo from China to Afghanistan via Uzbekistan», «transit declaration Uzbekistan», «حمل بار از چین به افغانستان از راه ازبکستان».

Bu yoʻnalish haqida hech qayerda yozilmaydigan narsalar (saytdagi qoidalar bilan bir xil; `README.md` → «Matn tekshiruvi»):
- narx, kun soni, minimal hajm, reys jadvali yoki tajriba yillari — bu yoʻnalishda hammasi soʻrov boʻyicha, yoʻnalish yangi;
- Hayraton va Mozori Sharifdan boshqa manzil; Afgʻonistondan yuk olib kelish; temir yoʻl yoki avia;
- Afgʻonistonda ofis, vakil yoki hamkor borligi; xodimlarning fors yoki dari tilini bilishi — bu tillardagi xabarga tarjimon yordamida javob beriladi;
- «bizning omborimiz» — Toshkentdagi bojxona nazoratidagi ombor hamkorniki, biz undan joy ajratamiz;
- boshqa mamlakatlarga yetkazish haqida vaʼda.
