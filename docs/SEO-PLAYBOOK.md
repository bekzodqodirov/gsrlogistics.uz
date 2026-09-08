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

Nom: `GSR Logistics` · Manzil: `Toshkent, Shayxontohur tumani, Alisher Navoiy koʻchasi, 27` · Telefon: `+998 95 018 33 33` · Sayt: `https://gsrlogistics.uz`

- **Google Business Profile** (business.google.com): kategoriya «Freight forwarding service» / «Logistics service»; ish vaqti; xizmatlar roʻyxati (narx bilan); ombor/yuk fotolari; haftada 1 post; savol-javob boʻlimiga javob bering. Gemini va Google AI Mode aynan shu kartochkaga tayanadi.
- **Yandex Business** (yandex.uz/business): mavjud kartochkani (org/98882247475) tasdiqlab oling, maʼlumotlarni yangilang, fotolar qoʻshing.
- **2GIS** (2gis.uz): eski kartochka oʻchirilgan — yangisini yarating.
- **Goldenpages.uz / Yellowpages.uz**: manzil «Shayxontohur» (Olmazor emas), sayt `gsrlogistics.uz` (`gsrlogistic.uz` emas).
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
