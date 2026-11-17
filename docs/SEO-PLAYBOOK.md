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

## 9. Xitoydan ulgurji (optom) sotib olish: saytdan tashqaridagi qadamlar va oylik tekshiruv (2026-yil noyabr)

Saytda yangi, oʻn uchinchi xizmat sahifasi bor: «Ulgurji (optom) sotib olish» — `https://gsrlogistics.uz/xizmatlar/xitoydan-optom/` (ruscha `/ru/uslugi/optom-iz-kitaya/`, inglizcha `/en/services/wholesale-from-china/`; kirill yozuvida, xitoy va fors tillarida ham bor). Firma haqidagi yangi maʼlumot — faqat siz 2026-yil 17-noyabrda aytgan gap; saytda u shunday yozilgan: «GSR Logisticsʼda xitoy tilini HSK 6 darajasida biladigan xodimlar bor: ular Xitoyda sotib olish bilan shugʻullangan va zavodlardan sotib olish hamda sotuvchilardan ulgurji (optom) xarid qilish boʻyicha ishlaydi.» Xizmat mijoz Xitoydan ulgurji sotib olmoqchi boʻlgan har qanday tovar uchun — kontrafakt va taqiqlangan tovarlardan tashqari; komissiya, eng kam hajm, toʻlov tartibi, muddat va narxlar esa saytda avvaldan eʼlon qilingan shartlarning oʻzi. HSK 6 haqidagi gap qisqa shaklda saytning yana bir necha joyida turibdi: vaziyat oʻzgarsa, oʻsha kuni dasturchiga ayting.

Sahifa saytga chiqqach (bir marta):
1. **IndexNow** (1-boʻlim, 3-band) — sizdan ish talab qilinmaydi: sayt har yangilanganda Bing va Yandexga oʻzi xabar beradi.
2. **Google Search Console** — URL Inspection → Request indexing: yuqoridagi uch manzilni (oʻzbekcha, ruscha, inglizcha) birma-bir yuboring; Google IndexNow xabarini qabul qilmaydi.
3. **Google Search Console** — «Search generative AI control» sozlamasini oching va sayt Google qidiruvidagi AI javoblaridan chiqarib qoʻyilmaganini tekshiring.
4. **Yandex Webmaster** — shu uch manzilni qayta aylanib chiqishga («переобход») yuboring.
5. **Bing Webmaster Tools** — shu uch manzilni qoʻlda ham yuboring.
6. **0-oy oʻlchovi.** Sahifa chiqqan kuni, qidiruv tizimlari uni hali bazaga olmasidan, quyidagi 12 savolni bir marta soʻrang va natijani «0-oy» deb yozing: keyingi oylar shu bilan solishtiriladi.
7. **Telegram kanal** (@gsrlogistics): yangi xizmat haqida bitta post — oʻzbek va rus tillarida, xizmat taʼrifi jumlasi va sahifa havolasi bilan.

Saytdan tashqaridagi qadamlar — dalili eng kuchlisidan boshlab: 1–4 rasmiy hujjat va oʻlchovga tayanadi, 5–8 — statistik bogʻliqlikka yoki bugungi qidiruv natijalariga. Umumiy sozlash 2–4-boʻlimlarda; bu yerda faqat shu xizmatga tegishlisi. Har bir matn — saytdagi gapning nusxasi: xizmat nomi — «Xitoydan ulgurji (optom) tovar sotib olish» (sahifa sarlavhasidagidek), ruscha «Оптовые закупки в Китае», inglizcha «Wholesale buying in China»; tavsif — sahifadagi xizmat taʼrifi (birinchi savol ostidagi birinchi jumla; ruscha matnga — ruscha sahifadan), yonida `GSR Logistics` nomi va sahifa havolasi. Hech qayerda yozilmaydi: bunday xodimlar nechta ekani, ismi yoki qayerda ishlashi; «sertifikat», «eng yuqori daraja», «tarjimon»; tajriba yillari; «hamkor zavodlarimiz», «zavod narxida», «vositachisiz» (firma oʻzi vositachi); yangi narx; «eng arzon», «kafolat».
1. **Google Business Profile — xizmatlar roʻyxati.** Xizmatni oʻzbekcha nomi bilan qoʻshing; tavsifiga taʼrif jumlasini va ruscha nomini yozing, oʻsha jumlani kartochkaning umumiy tavsifiga ham kiriting. Narx yozmang — sanali narx sahifada turadi. Sababi: Google hujjatiga koʻra, xizmatlar AI javoblariga shu kartochka orqali ham tushadi; boshqa mamlakatlardagi oʻlchovlarda, mahalliy firma soʻralganda, u — Google AI javoblarining eng katta manbalaridan biri.
2. **Google Business Profile — kategoriya.** Asosiy kategoriyaga tegmang; firma ishiga rostdan mos keladigan qoʻshimcha kategoriya qidiring (masalan, «Import export company» — roʻyxatda borligi tekshirilmagan). «Wholesaler», «Manufacturer», «Translator» va til maktabi kategoriyalarini olmang. Sababi: firma bularning hech biri emas, notoʻgʻri kategoriyani esa AI takrorlaydi.
3. **Yandex Business.** Kartochkaning tovar va xizmatlar roʻyxatiga hamda tavsifiga oʻsha nom va oʻsha jumlani qoʻying; xarid yoki importga yaqin qoʻshimcha rubrika boʻlsa, uni ham oling. Sababi: Yandexning oʻzi kartochka ochishni maslahat beradi; Alisa kartochkadagi tavsif, xizmat va sharhlarni oʻqishi aytilgan, lekin taʼsiri oʻlchanmagan.
4. **Sharhlar (3-boʻlimga qoʻshimcha).** Xarid tugagach, aynan sotib olish xizmatidan foydalangan mijozdan Google va Yandexda sharh soʻrang — oʻz soʻzlari bilan: nima olgani va ish qanday oʻtgani haqida. Sharhni oʻzingiz yozmang, matnini aytib bermang, evaziga hech narsa vaʼda qilmang. Sababi: Google mahalliy qidiruvda sharhlarni hisobga olishini oʻzi yozgan, Yandex ham mijoz sharhlarini ishonch belgilari qatorida sanaydi; sharhda xizmat tilga olinsa, AI shu xizmat boʻyicha tavsiya qilishi esa isbotlanmagan.
5. **Yellowpages.uz va Goldenpages.uz (2-boʻlim).** Firma tavsifiga xizmat nomi va taʼrif jumlasini oʻzbek va rus tillarida qoʻshing. «Xarid» nomli rubrika koʻrinmadi — bor rubrikalardan eng yaqinini oling, qolganini tavsif aytadi. Sababi: oʻzbekcha savolga qidiruv bugun firmalarning oʻz sahifalarini emas, shu kabi kataloglarni chiqaradi (2026-yil 17-noyabrdagi sinov).
6. **2GIS.** Kartochkani qayta yaratganda (2-boʻlim) xizmatni birinchi kundanoq tavsif va xizmatlar roʻyxatiga kiriting. Sababi: bu — firma nomi xizmat bilan yonma-yon turadigan yana bir tashqi sahifa; AI javoblariga taʼsiri haqida alohida dalil topilmadi.
7. **YouTube (4-boʻlimga qoʻshimcha).** 2–4 ta qisqa video; sarlavhasi — odamlar qidiruvga yozadigan savolning oʻzi: «Xitoydan optom tovar zakaz qilish: qanday qilinadi?», «HSK nima va HSK 6 nimani bildiradi?», «Как найти посредника в Китае для закупки товара оптом в Ташкент?». Videoda firma nomini ayting; tavsifiga taʼrif jumlasi, firma nomi va havolani yozing. Sababi 4-boʻlimda; bitta aniqlik: u taniqli brendlarda koʻrilgan bogʻliqlik, sabab ekani isbotlanmagan.
8. **Mahalliy biznes nashrida bitta eslatma (nashrlar — 4-boʻlimda).** Muharrir ishlata oladigan foydali material bering — masalan, «Xitoy zavodiga pul toʻlashdan oldin nimani tekshirish kerak» — firma nomi va u nima qilishi koʻrsatilgan imzo bilan; yoki nashr shunday xizmatlarni solishtirganda, oʻsha roʻyxatda boʻlishga harakat qiling. Pullik material «reklama» belgisi bilan chiqsin. Sababi: tavsiya soʻralganda AI eng koʻp keltiradigan sahifa turi — boshqalar yozgan solishtirma maqola; eng kuchli dalil shu, eng qiyin qadam ham shu.

Vaqt sarflamang: Xitoydan sotib oluvchi vositachilarning ruscha «reyting» va kataloglariga kirish (haqiqiysi topilmadi — borini firmalarning oʻzi yozgan); firmani birinchi oʻringa qoʻyadigan «eng yaxshi firmalar» roʻyxatini yozish; eslatma, havola yoki sharh sotib olish; `llms.txt` va sahifa kodidagi belgilashdan (JSON-LD) tavsiya kutish (oʻlchovda taʼsiri koʻrinmagan); Wikipedia maqolasi ochishga urinish.

Har oylik tekshiruv (taxminan 20 daqiqa). 5-boʻlimdagi AI-test yuk tashish savollari uchun qoladi; quyidagi 12 savol — shu xizmat uchun. Savollarda firma nomi yoʻq: maqsad — AI uni oʻzi aytadimi, shuni koʻrish. Har oy aynan shu matnni nusxalang, soʻzini oʻzgartirmang:

| № | Til | Savol |
|---|---|---|
| 1 | oʻzbekcha | Xitoydan optom tovar olib kelmoqchiman. Oʻzbekistonda bu ishda qaysi firmalar yordam beradi? |
| 2 | oʻzbekcha | Xitoydagi zavoddan toʻgʻridan-toʻgʻri tovar olib beradigan Toshkentdagi firmalarni tavsiya qiling. |
| 3 | oʻzbekcha | Xitoy tilini biladigan xodimlari bor, Xitoydan optom tovar sotib olib, Toshkentga yetkazib beradigan firma kerak. Kimga murojaat qilsam boʻladi? |
| 4 | oʻzbekcha | Xitoydan doʻkonim uchun optom tovar zakaz qilib beradigan xizmat qancha turadi va eng kam buyurtma qancha boʻladi? |
| 5 | ruscha | Хочу закупить товар оптом в Китае для магазина в Ташкенте. Какие компании в Узбекистане этим занимаются? |
| 6 | ruscha | Посоветуй посредника в Китае для бизнеса из Узбекистана: закупка у фабрики и доставка в Ташкент. |
| 7 | ruscha | Нужна компания в Ташкенте, у которой сотрудники знают китайский, чтобы выкупить партию товара у оптового продавца в Китае и привезти в Узбекистан. К кому обратиться? |
| 8 | ruscha | Сколько стоит услуга оптовой закупки товаров в Китае с доставкой в Ташкент и какой минимальный заказ? |
| 9 | inglizcha | Which companies in Uzbekistan can buy goods wholesale in China for my shop and deliver them to Tashkent? |
| 10 | inglizcha | Recommend a China sourcing or buying agent for a business based in Tashkent, Uzbekistan. |
| 11 | inglizcha | I need a company with Chinese-speaking staff to buy a batch of goods from a factory in China and ship it to Uzbekistan. Who does this? |
| 12 | inglizcha | What does a purchasing agent for wholesale orders from China to Uzbekistan charge, and what is the minimum order? |

- **Qayerda.** Har oy — ChatGPT (qidiruv yoqilgan holda) va Gemini (yoki google.com dagi AI rejimi — AI Mode; birini tanlab, har oy oʻshanisini ishlating): 12 savol × 2 tizim = 24 javob. Har uch oyda bir marta, umumiy manzara uchun — 5-boʻlimdagi qolgan uch tizimda ham: Yandex Alisa, Perplexity, Claude. AI javobi chiqmasa, «javob yoʻq» deb yozing.
- **Qanday.** Har oy bir xil kunda, Toshkentdan, VPNsiz. Har bir savol — yangi chatda; xotira (memory) oʻchirilgan yoki vaqtinchalik chat boʻlsin; firma haqida gaplashilgan akkauntni ishlatmang. Javobni yozib olmaguningizcha tuzatish kiritmang va qoʻshimcha savol bermang.
- **Nimani yozish.** Har bir javobga jadvalda bir qator: sana · tizim · savol raqami · firma nomi aytildimi (1/0) · saytga havola berildimi (1/0), qaysi sahifaga. Javobning skrinshotini saqlang: unda oʻrniga kimlar aytilgani va qaysi saytlarga havola berilgani qoladi. Firma haqida notoʻgʻri gap boʻlsa, oʻsha jumlani koʻchirib oling.
- **Qanday oʻqish.** Asosiy son — nechta javobda firma nomi aytilgani; roʻyxatdagi oʻrin deyarli tasodifiy, unga qaramang. Bitta javob hech narsani isbotlamaydi: bir xil savolga bir xil roʻyxat 1% dan kam hollarda qaytadi. Shuning uchun uch oyni qoʻshib oʻqing — har tizimda 36 javob (vaqtingiz boʻlsa, har bir savolni uchta yangi chatda soʻrang: 36 javob bir oyda yigʻiladi). Boshida, ehtimol, 36 tadan 0 boʻladi; bitta tizimda 36 tadan 3 ta va undan koʻp — birinchi haqiqiy belgi; ikki uch oylik orasidagi 7 tadan kam farq — tasodif. Avval tor savollar (3, 7, 11) siljiydi, umumiylari (1, 5, 9) — eng oxirida; tizimlar birga siljimaydi, yaxshi oydan keyingi pasayish — odatiy hol. Nimani oʻzgartirishni uchinchi oydan keyin hal qiling.
- **Xato chiqsa.** Firma haqida notoʻgʻri gap («sertifikatli», «eng yuqori daraja», xodimlar soni, firmaning Xitoydagi ofisi yoki ombori, saytdagidan boshqa narx) uchrasa yoki sahifaga havola berilib, firma nomi aytilmasa — jumlani dasturchiga yuboring: manbasi saytdagi, kartochkadagi yoki boshqa birovning sahifasidagi gap boʻladi.
- **Nazorat savoli** (oxirida, alohida chatda; sanalmaydi): «Toshkentdagi GSR Logistics qanday kompaniya va u mijozlar uchun Xitoydan tovar sotib olib beradimi?» — AI firmani biladimi va faktlarni toʻgʻri aytadimi, shuni koʻrsatadi.
- **4- va 8-haftada.** Google Search Console → Performance va Yandex Webmaster → «Поисковые запросы»da yangi sahifa, «Tovar va ishlab chiqaruvchi topish» va «1688 va Taobaodan sotib olish» sahifalarini solishtiring: «optom», «ulgurji», «оптом», «wholesale» soʻzli soʻrovlar yangi sahifaga tushishi kerak; boshqa sahifaga tushsa — dasturchiga ayting.
- **Hisobotlar.** 5-boʻlimning 4-bandidagi ikki hisobot yoniga Yandex Webmasterdagi «Видимость сайта в Алисе AI» hisobotini qoʻshing. Hisobotlarda uchragan, lekin saytda javobi yoʻq savol — saytdagi savol-javoblarga qoʻshiladigan keyingi savol: dasturchiga yuboring.

Nimani kutish kerak: sahifa qidiruv tizimlari bazasiga tushgach, internetdan qidiradigan AI firmani shu xizmat boʻyicha topa oladi va sahifadagi gapni toʻgʻri takrorlay oladi; bugungi qidiruv natijalarida bu mavzuda oʻzbek va ingliz tillarida boshqa firmalarning sahifalari deyarli yoʻq, shuning uchun tor savollarda firma nomi baʼzan chiqishi mumkin — bir necha hafta yoki oy ichida, qisman va beqaror. AI firmani aytishini esa hech kim vaʼda qila olmaydi: hech bir tizimda tavsiyani soʻrash yoki sotib olishning eʼlon qilingan yoʻli yoʻq, bir xil savolga har safar boshqa roʻyxat chiqadi, oʻzbekcha javoblar boʻyicha esa bitta ham oʻlchov topilmadi. Bizning qoʻlimizda — toʻgʻri sahifa, toʻldirilgan kartochkalar, mijozlardan sharh soʻrash va videolar (AI firma tavsiya qilganda manbalarining yarmidan koʻpi — kartochkalar, sharhlar va boshqalar yozgan sahifalar, firmaning oʻz sayti emas); qaysi manbani tanlash va kimni aytish — AI tizimlarining ishi.

Sahifa uchun sizdan kutilayotgan javoblar (javob kelguncha sahifada faqat avval eʼlon qilingan shartlar va siz aytgan gap turadi; javobni dasturchiga yozing):
- Xodimlar: HSK 6 sertifikati bormi; bunday xodimlar nechta; ular qayerda ishlaydi; zavod va bozorlarga oʻzlari boradimi; tajribasi necha yil; qaysi tovar turlari boʻyicha?
- Har bir ulgurji xarid ustida xitoy tilini HSK 6 darajasida biladigan xodim ishlaydimi?
- «3% dan» komissiya va «buyurtmaning umumiy hajmi kamida 1 m³» sharti ulgurji xaridga ham shundayligicha tegishlimi? «Tovar va ishlab chiqaruvchi topish» sahifasidagi «5% gacha» va «10% gacha» stavkalari amaldami?
- Toʻlov: faqat soʻmdami yoki dollarda ham; yuan kursi qaysi qoida boʻyicha olinadi; zavod buyurtmasida mijoz bizga buyurtmadan oldin toʻliq toʻlaydimi yoki zavod shartnomasidagi bosqichlar boʻyichami?
- Namuna va Xitoy ichidagi yetkazib berish haqi mijozga sotuvchi narxida, ustamasiz oʻtadimi?
- Narxlar sanasi (2026-yil 8-sentabr) va ularning amal qilish muddati (2026-yil 31-dekabr): narxlar oʻzgarmagan boʻlsa — tasdiqlang, oʻzgargan boʻlsa — yangisini ayting (5-boʻlim, 1-band). Muddat: narxlar sanasini 8-dekabrgacha tasdiqlang (3 oy toʻladi), amal qilish muddatini 31-dekabrgacha yangilang — aks holda qidiruv tizimlari koʻradigan narx maʼlumoti eskiradi.
