# Koʻrinuvchanlik: AI va qidiruv tizimlarida GSR qanday koʻrinadi (audit, 2026-10-03)

Claude va Gemini (internet-qidiruv bilan) GSR Logisticsʼni Totrans va Buraqʼdan past baholadi. Olti yoʻnalish boʻyicha audit oʻtkazildi (eski domen, yangi sayt, kataloglar, raqobatchilar, indeks holati, AI oʻqiydigan qatlam), har bir topilma alohida qayta tekshirildi: 57 ta tasdiqlandi, 3 tasi rad etildi. Bu hujjat — egasi qiladigan ishlar roʻyxati. Saytdagi ishlar alohida bajarildi (pastda, 3-boʻlim).

## 1. Xulosa

- **AI tahlillari eski saytni baholagan.** Ular aytgan hamma narsa — bir sahifali landing, ruscha title/description, Instagram reelsʼga olib boradigan FAQ, «minglab mijoz» — `www.gsrlogistic.uz` (xato yozilgan eski domen) haqida. Bu sayt hali ham jonli (Vercelʼda, Next.js), 2026-yil 30-sentabrda qayta deploy qilingan, yangi saytga havola bermaydi va yangi saytga zid narsalarni yozadi: «Guanjou va yivu shaharlarida shaxsiy omborxonaga egamiz», «24/7», «10 yillik tajriba», «1000+ mijoz», boshqa telefon (+998 90 860 80 06), eski bot `@GSRLogistics_bot`.
- **Yangi sayt (`gsrlogistics.uz`) hali indekslanmagan.** Tekshirish mumkin boʻlgan qidiruv tizimlarida `site:gsrlogistics.uz` boʻsh; tashqaridan unga faqat Yandex Maps kartochkasi havola beradi. Sayt 24 kunlik — bu normal, lekin shuning uchun AIʼlar uni oʻqimagan.
- **Kataloglar eski domenga va notoʻgʻri maʼlumotga ishora qiladi.** yellowpages.uz va top.uz: sayt `gsrlogistic.uz`, tuman Olmazor, rubrika «samosvalda sochiluvchan yuk tashish», tavsifda «real-time tracking». goldenpages.uz: nom «"GSR GROUP" QK MChJ», ish vaqti 21:00 gacha, bitta raqami xato telefon.
- AI aytgan «40–50 konteyner/oy» va «4000+ mijoz» raqamlari hech qaysi saytda yoʻq — tasdiqlangan raqamlar: oyiga 10+ fura, 400+ mijoz, jamoa tajribasi 15 yil. Ularni hech qayerda eʼlon qilmang.

## 2. Yangi saytda allaqachon tuzatilgan narsalar

| AI daʼvosi | Yangi saytda |
|---|---|
| Bir sahifali landing | 116 ta sahifa, 4 til (uz / ru / en / kirill) |
| Ruscha title/description | Oʻzbekcha, har til oʻz sarlavhasi bilan, hreflang |
| FAQ — Instagram reels | 35 ta matnli savol-javob, FAQPage JSON-LD |
| «Minglab mijoz», raqam yoʻq | 400+ mijoz, oyiga 10+ fura, 2018-yildan, jamoa 15 yil |
| «Shaxsiy ombor» | «Qabul punkti» (Ivu, Guanchjou, Qashqar) |
| 24/7 | Du–Sha 9:00–19:00; faqat bot 24/7 |
| Narx yoʻq | Zichlik jadvali, avia narxi, konteynerlar, kalkulyator, JSON-LD Offer |
| Schema, sitemap yoʻq | Organization/LocalBusiness, Service, FAQPage, sitemap, llms.txt |

## 3. Shu audit boʻyicha saytda qilingan ishlar (2026-10-03)

- Bosh sahifa va «Biz haqimizda»: kompaniya nomi, yuridik shaxs (Imex services LLC), raqamlar birinchi abzatsda; «Biz haqimizda»da 6 ta fakt.
- FAQ: «Yuk qayerdaligini qanday bilaman?» javobi bot va 6 bosqich atrofida qayta yozildi; «Kompaniya haqida» guruhi (ofis va ish vaqti, hajm, Xitoydagi qabul manzillari).
- Organization JSON-LD: Google Maps va Telegram-guruh `sameAs`da, ikkala telefon, WhatsApp, `knowsLanguage`, shior; temir yoʻl konteynerlari va 3% komissiya `Offer` sifatida.
- llms.txt: brend (GSR Group), ijtimoiy tarmoqlar, ish vaqti, manzil, raqamlar, kuzatuv qanday ishlashi; llms-full.txt ichidan dasturchi izohlari va dialog matni olib tashlandi.
- Sarlavhalar: «…» bilan kesilgan 19 ta sarlavha qisqartirildi; qidiruv soʻzlari (Xitoydan yuk olib kelish, доставка грузов из Китая в Узбекистан, 1688 dan tovar olib berish) sarlavha va H2ʼlarga kiritildi.
- «GSR Logisticsning Ivu ombori» kabi egalik jumlalari olib tashlandi (va qoida tekshiruviga qoʻshildi); «har oy yangilanadi» → «muntazam yangilanadi» (oylik koʻrib chiqishga vaʼda berilmagan).
- robots.txt: AI-kraulerlarning qolgan guruhlari (Bytespider, CCBot, Amazonbot, meta-externalagent, anthropic-ai, Applebot-Extended, MistralAI-User, Google-CloudVertexBot).

## 4. Egasi qiladigan ishlar (taʼsir boʻyicha tartibda)

### 4.1. Eski domenni yoʻnaltirish — eng muhimi

Maqsad: `gsrlogistic.uz` va `www.gsrlogistic.uz` dagi har bir manzil `https://gsrlogistics.uz` dagi oʻsha manzilga 301 bilan oʻtsin.

1. 2026-yil 30-sentabrda `www.gsrlogistic.uz` ni kim qayta deploy qilganini aniqlang (oldingi dasturchi yoki sizning Vercel akkauntingiz).
2. Oʻsha Next.js loyihasining ildiziga `vercel.json` qoʻshib, production branchʼga push qiling:
   ```json
   {"$schema":"https://openapi.vercel.sh/vercel.json","redirects":[{"source":"/:path*","destination":"https://gsrlogistics.uz/:path*","statusCode":301}]}
   ```
3. vercel.com → loyiha → Settings → Domains → `gsrlogistic.uz` → «Redirect to» ni oʻchiring (apex ham toʻgʻridan-toʻgʻri 301 bersin). Ikkala hostni loyihada qoldiring — sertifikat yangilanib turadi.
4. Tekshiring: `curl -sI https://www.gsrlogistic.uz/` → `301`, `location: https://gsrlogistics.uz/`; apex uchun ham.
5. DNSʼni (ahost.uz) oʻzgartirmang.
6. Vercel loyihasiga kirib boʻlmasa: `gsrlogistic.uz` DNS zonasi `gsrlogistics.uz` bilan bitta ahost.uz akkauntida — apex A-yozuvini 301 beradigan hostga yoʻnaltiring (CNAME `gsrlogistic.uz` boʻlgan ikkinchi GitHub Pages repo yoki Cloudflare redirect rule), yoki clients.ahost.uz → Mening domenlarim → gsrlogistic.uz → «Domenni yoʻnaltirish» → gsrlogistics.uz, doimiy, wildcards yoqilgan — keyin https va sahifa yoʻllari saqlanishini tekshiring.
7. Eski saytga `noindex`/`Disallow` qoʻymang; 301 kamida 180 kun tursin (domen 09.09.2027 gacha toʻlangan).
8. Keyin: Google Search Console → `gsrlogistic.uz` ni Domain property sifatida qoʻshing (ahostʼda DNS TXT) → Settings → Change of address → gsrlogistics.uz; Yandex Webmaster → Переезд сайта.

Natija: 1–4 hafta ichida kraulerlar va AI «shaxsiy omborxona / minglab / 24/7 / 90 860 80 06» ni oʻqishni toʻxtatadi; kataloglardagi eski havolalar yangi saytga tushadi.

### 4.2. GitHub Pages manbai

Settings → Pages → Build and deployment → **Source: GitHub Actions**. Hozir «Deploy from a branch» turibdi: har pushʼda GitHubʼning oʻz Jekyll buildʼi ishga tushib xato beradi (sayt bizning Actions orqali deploy boʻlgani uchun ishlayveradi, lekin bu ortiqcha xavf). Shu yerda: repo Settings → About → Website `https://gsrlogistics.uz`, Description «GSR Logistics (Toshkent) rasmiy sayti». Men API orqali oʻzgartira olmadim — ruxsat yoʻq.

### 4.3. Search Console, Bing, Yandex

- GSC: Domain property allaqachon bor — kiring, «Verified» ekanini tasdiqlang; Sitemaps → `https://gsrlogistics.uz/sitemap-index.xml` (boʻlmasa qoʻshing); URL Inspection → Request indexing: `/`, `/ru/`, `/en/`, `/kirill/`, `/narxlar/`, `/xizmatlar/avto-kargo/`, `/ru/uslugi/avto-kargo/`, `/ru/ceny/`.
- Bing Webmaster va Yandex Webmaster: xuddi shunday — tekshiring, yangisini yaratmang.
- Oddiy brauzerdan Google, Yandex va Bingʼda `site:gsrlogistics.uz` va `site:gsrlogistic.uz` ni qidirib, skrinshotlarni saqlang — bu boshlangʻich nuqta.

### 4.4. Yellow Pages kartochkasi

Yuborish: https://t.me/yellowpages_support_bot (kartochka `/kompaniya/gsr-logistics`; «claim» tugmasi yoʻq).

- Брендовое название: **GSR Logistics**. Юридическое: **Imex services LLC** (guvohnomadagi yozilish + STIR). **INN 300616173 ni olib tashlang** — u 2007-yilda tugatilgan, Mirzo Ulugʻbek tumanidagi boshqa «GSR LOGISTICS» MChJʼga tegishli. STIRʼni keyin bersangiz ham boʻladi, qolganini hozir yuboring.
- Адрес: Узбекистан, 100011, Ташкент, Шайхантахурский район, ул. Навои, 27. Ориентир: ст. метро «Алишер Навои». Координаты: 41.3209, 69.2526 (hozirgi belgi 4,4 km narida, Olmazorda).
- Телефоны: +998 95 018 33 33; +998 90 175 78 00 (WhatsApp). E-mail: b.e.kodirov@gmail.com. Сайт: https://gsrlogistics.uz. Telegram @gsrlogistics; Instagram gsrgroup.uz; Facebook gsrlogistics.
- Режим: Пн–Сб 09:00–19:00, Вс выходной.
- Рубрики: hozirgi uchtasini olib tashlang («Перевозка сыпучих грузов самосвалами», «Автозапчасти для грузовых автомобилей», «Брокерские услуги»); qoʻshing: «Международные грузоперевозки», «Логистические компании», «Транспортно-экспедиторские услуги», «Перевозка сборных грузов», «Авиационные грузоперевозки», «Автомобильные грузоперевозки», «Контейнерные перевозки», «Таможенное оформление» («Таможенный броker» — faqat litsenziya boʻlsa).
- Описание (ru): «GSR Logistics — доставка грузов из Китая в Узбекистан с 2018 года: сборные грузы автотранспортом (15–25 дней), авиа (5–10 дней), контейнерные и ж/д перевозки, таможенное оформление. Приём грузов в Иу, Гуанчжоу и Кашгаре. Статус груза — в Telegram-боте @GSR_GROUP_AGENT_bot.»
- Tavsif (uz): «GSR Logistics — 2018-yildan Xitoydan Oʻzbekistonga yuk yetkazish: yigʻma yuk avto (15–25 kun), avia (5–10 kun), konteyner va temir yoʻl, bojxona rasmiylashtiruvi. Qabul punktlari: Ivu, Guanchjou, Qashqar. Yuk holati — @GSR_GROUP_AGENT_bot.»
- Yozmang: «в режиме реального времени», «склад», «партнёров».

### 4.5. Golden Pages kartochkasi (Id=99695)

Yuborish: info@goldenpages.uz yoki https://t.me/gpuzbot, yoki egasi kabineti (/login/).

- Название: GSR Logistics; юр. лицо Imex services LLC — «"GSR GROUP" СП ООО / QK MChJ / JV LTD» ni olib tashlang.
- Адрес: 100011, Ташкент, Шайхантахурский район, пр-т Навои, 27 (qoladi).
- Телефоны: (+99895) 0183333 (asosiy); (+99890) 1757800 (WhatsApp); **(+99895) 0183033 ni oʻchiring** (bitta raqami xato); (+99897) 3333933 — 5-boʻlimdagi javobga qarab.
- Сайт: https://gsrlogistics.uz. E-mail: b.e.kodirov@gmail.com. Telegram @gsrlogistics.
- Режим: Пн–Сб 09.00–19.00, Вс выходной (hozir 09.00–21.00).
- Виды деятельности: 1894 «Экспортно-импортные операции» oʻrniga rubrikalar 107422, 105391, 105392, 100070, 100072, 1758, 1760, 1761, 1284, 1755, 3078, 4676, 4518. Tavsif — 4.4ʼdagi matn. «Admin» qoʻygan 4/5 bahoni olib tashlashni soʻrang.
- 107422 rubrikasi («Cargo delivery … from China to Uzbekistan») inglizcha soʻrov boʻyicha 2-oʻrinda turadi — unga kirish AI javoblariga eng tez yoʻl.

### 4.6. Google Business Profile — mavjud kartochkani oling, yangisini yaratmang

Kartochka: «GSR Logistics, Navoi Avenue 27» — https://www.google.com/maps?cid=14536427051693213311 (saytimiz koʻrsatilgan). https://business.google.com da uni topib, egalik qiling va tasdiqlang. Keyin: ish vaqti Du–Sha 09:00–19:00, yakshanba yopiq (hozir 9–21, 7 kun); asosiy telefon +998 95 018 33 33 (hozir faqat WhatsApp raqami); indeks 100011 (hozir 100000); kategoriya «Logistics service», qoʻshimcha «Freight forwarding service»; «Customs broker» — faqat litsenziya boʻlsa.

### 4.7. Yandex Business (kartochka 98882247475)

Kartochkani kimdir boshqaryapti (2026-09-28 da «Представитель организации» mahsulotlar yuklagan), lekin egasi tasdiqlanmagan. Oʻsha kabinetga kiring (yoki https://yandex.com/sprav/search?permalink=98882247475 orqali kirish soʻrang) va telefon bilan tasdiqlang. Keyin: «Gsr Logistics» → «GSR Logistics»; shanba 09:00–19:00 qoʻshing (hozir Du–Ju); +998 95 018 33 33 birinchi, +998 90 175 78 00 — WhatsApp; «1 000 000 сўм / 1 см³» mahsulotini tuzating yoki oʻchiring (haqiqiy: yigʻma yuk 110 $/m³ dan, avia 9 $/kg dan); Telegram @gsrlogistics va Facebook qoʻshing; yuridik shaxs Imex services LLC; belgi Navoiy 27 da ekanini tekshiring. Botning 24/7 vaqtini kartochkaga koʻchirmang. Bu — yangi saytga havola beradigan va 4,7 bahoga ega yagona tashqi sahifa.

### 4.8. Telegram

- Kanal @gsrlogistics tavsifi: «GSR Logistics · Imex services LLC · gsrlogistics.uz · +998 95 018 33 33 (WhatsApp +998 90 175 78 00)». 97 333 39 33 / 99 093 33 33 / 99 083 33 33 / 95 019 33 33 raqamlarini olib tashlang (5-boʻlimda tasdiqlamasangiz). «Официальный представитель ассоциации «Один пояс и один путь»» — olib tashlang yoki hujjat bilan tasdiqlang. Sayt havolasi bilan post pin qiling. Oyiga kamida bitta post (narx oʻzgarishi, Xitoy bayramlari tanaffusi, joʻnatish kuni, bot qanday ishlaydi) — oxirgi post 2023-11-01.
- Guruh @gsrgroupchat bio: «13-25 kun» → «15–25 kun», sayt havolasini qoʻshing.
- @GSRLogistics_bot: tavsifini @GSR_GROUP_AGENT_botʼga yoʻnaltiring yoki hech qayerda havola bermang.

### 4.9. Boshqa kataloglar va profillar

- top.uz (`/company/gsr-logistics`): sayt → https://gsrlogistics.uz, tuman → Shayxontohur, +998 95 018 33 33 va ish vaqtini qoʻshing.
- prom.uz (`/uz/company/gsr-group/`): nom «GSR Logistics (GSR Group)», sayt va manzil.
- 2GIS: ilovada «GSR Logistics» / +998 95 018 33 33 ni qidiring; boʻlmasa «Добавить организацию» — rubrika «Международные грузоперевозки» (id 9741); «Таможенные брокеры» (844) — faqat litsenziya bilan.
- Instagram gsrgroup.uz va Facebook gsrlogistics: bioʼga sayt havolasi; +998 90 860 80 06 bor-yoʻqligini tekshiring.
- Ixtiyoriy: logistika.uz, LinkedIn kompaniya sahifasi.

### 4.10. Tariflarni koʻrib chiqish

`tariffs.json` sanasi 2026-09-08. Jadval va 11 800 soʻm kursi hali toʻgʻrimi — dasturchiga ayting; u `updated` sanasini va kerak boʻlsa `validThrough` (2026-12-31) ni yangilaydi.

### 4.11. Ijtimoiy isbot

6–10 doimiy mijozdan nom/logotip va 3–5 ta qisqa fikr uchun ruxsat; ularni Yandex Maps, yellowpages.uz va top.uzʼda baho qoldirishga undang; 3–5 ta real yuk (tovar, m³/kg, qabul punkti, usul, sanalar, narx oraligʻi, bitta surat; mijozni yashirsa boʻladi). Yandexʼdagi «bekzod kodirov» imzoli yagona sharhni mijoz fikri sifatida ishlatmang.

## 5. Eʼlon qilishdan oldin tasdiqlash kerak boʻlgan faktlar

1. **Raqamlar:** «40–50 konteyner/oy», «4000+ mijoz» — tasdiqlanmagan, ishlatilmaydi. Tasdiqlanganlari: 10+ fura/oy, 400+ mijoz.
2. **Yuridik shaxs:** «Imex services LLC» ning guvohnomadagi aniq yozilishi, STIR, shakli. orginfo.uzʼda 5 xil yozilishda topilmadi. 2007-yilgi «GSR LOGISTICS» MChJ (INN 300616173) sizniki boʻlganmi? «GSR AUTO / GSR AVTO» (2024-06-03, Navoiy 27, avtomobil savdosi) va «GSR YM LOGISTIK» bogʻliqmi?
3. **Shartnoma tomoni:** shartnomalar Imex services LLC nomidan tuziladimi?
4. **Telefonlar:** +998 97 333 39 33, 99 093 33 33, 99 083 33 33, 95 019 33 33, 98 123 39 33 — hali kompaniyanikimi? +998 90 860 80 06 Qoʻqon filialinikimi, u filial (Navbahor 46) bormi?
5. **Kiyim:** eski sayt «kiyim olib kelmaymiz» deydi, yangi FAQ «kiyim 20%» boj stavkasini yozadi — qaysi biri toʻgʻri?
6. **«The Great Silk Road Group»** (schema va Telegram bioʼlarida): qoldiramizmi? Turkmanistonlik, Toshkentda filiali bor boshqa logistika guruhi bilan nomi toʻqnashadi.
7. **@GSRLogistics_bot** — ishlatilmaydimi?
8. **Ivudagi xodimlar:** Ivu qabul punktida oʻz xodimlaringiz bormi? Boʻlmasa «Ivudagi xodimlarimiz» → «hamkorlarimiz».
9. **Xitoy tili:** kimdir xitoy tilida javob beradimi? (saytda «menejerlar xitoy tilida» yozilgan).
10. **Guanchjou → Toshkent:** yuk Ivuga olib kelinib birlashtiriladimi yoki Guanchjouda yuklanadimi; qoʻshimcha kun; narx farqi?
11. **Qashqar → Toshkent:** qaysi chegara (Irkeshtam/Torugart → Oʻsh → Andijon yoki Xorgos), muddat, narx; Toshkentgami yoki faqat Fargʻona vodiysigami?
12. **FTL (butun fura):** sotiladimi, minimal yuk, narx asosi?
13. **Alashankou/Doʻstiq:** GSR furalari ishlatadimi yoki faqat temir yoʻlmi?
14. **Yoʻl faktlari:** «5 000+ km» tekshirilganmi; Qozogʻiston–Oʻzbekiston posti Yallama yoki Gʻishtkoʻprik?
15. **Tariflar:** 2026-09-08 jadvali va 11 800 soʻm hali amaldami; har oy koʻrib chiqasizmi?
16. **Litsenziyalar:** bojxona brokeri/deklarant litsenziyasi (raqam, kim bergan, muddati) yoki ishlaydigan brokerning nomi; ekspeditorlik roʻyxati; sugʻurtalovchi.
17. **Xodimlar soni** (`numberOfEmployees` uchun).
18. **Menejerlar:** ism/rol/til eʼlon qilinadimi?
19. **Keyslar va fikrlar:** 3–5 ta real yuk, mijozlarning yozma ruxsati.
20. **FAQ:** Temu/Shein orqali xarid; Oʻzbekistondan Xitoyga eksport — javob bormi?
21. **Kim nimani boshqaradi:** gsrlogistic.uz ni 30-sentabrda deploy qilgan Vercel akkaunti; ahost.uz DNS akkaunti; Yandex Business kabineti.

## 6. Kutilayotgan natija

- **1 hafta:** eski domen 301 beradi; GSC/Bing/Yandexʼda sitemap tasdiqlangan, asosiy URLʼlar soʻralgan; kataloglarga tuzatish yuborilgan; Telegram bioʼlari tuzatilgan; Google va Yandex kartochkalari egalikka olingan. Reytingda hali oʻzgarish yoʻq — domen 24 kunlik.
- **1 oy:** `site:gsrlogistics.uz` Bing va Googleʼda sahifalarni koʻrsatadi (Yandex sekinroq); kataloglar moderatsiyadan oʻtadi; eski domen sahifalari tushib ketadi; brend soʻrovi («GSR Logistics» Toshkent) saytni yoki Google kartochkasini koʻrsatadi. Qidiruvli AIʼlar hali eski matnni keshdan keltirishi mumkin; jonli oʻqiydiganlari yangi sayt va llms.txtʼni oʻqiy boshlaydi. 30-kuni auditdagi soʻrovlarni qayta tekshirib, oʻrinlarni yozib qoʻying.
- **3 oy:** past raqobatli oʻzbekcha soʻrovlar («Xitoydan yuk olib kelish», «Ivu Toshkent kargo», «1688 dan tovar olib berish») boʻyicha 1-sahifa real; «Xitoydan Toshkentga kargo» — 1-sahifa pasti yoki 2-sahifa; «доставка грузов из Китая Узбекистан» va inglizcha soʻrovlar 2+ sahifada qoladi. AI tavsiflari faqat hamma yuzalar (sayt, kataloglar, xaritalar, Telegram) bir xil nom/manzil/telefon/vaqtni aytganda yangi faktlarga oʻtadi — «past koʻrinuvchanlik» bahosini sahifalar soni emas, aynan shu izchillik va redirect tuzatadi.

## 7. AI tahlillaridagi xatolar

- Ular eski bir sahifali saytni (gsrlogistic.uz) baholagan; sanab oʻtgan har bir kamchilik yangi saytda yoʻq. Eski sayt hech kim yoʻnaltirmagani uchun jonli — tahlillar eskirgan, lekin oʻsha sahifa haqida notoʻgʻri emas.
- «4000+ mijoz» va «40–50 konteyner/oy» hech qaysi GSR manbasida yoʻq; eski saytda «minglab / 1000+», Qirgʻizistondagi boshqa gsr.kg saytida «2000+ клиентов, 40 000+ отгрузок» bor — AI xulosalari ularni aralashtirgan.
- «GSR GROUP QK MChJ» — Golden Pagesʼning brend nomini yuridik shaklga oʻragan yozuvi; reyestrda bunday shaxs topilmadi. Yellow Pages esa tugatilgan boshqa «GSR LOGISTICS» MChJʼning INNʼini saqlaydi.
- «Turli telefonlar» rost, lekin sababi aniq: kataloglarda WhatsApp raqami, bitta raqami xato telefon, kanal bioʼdagi eski 97-raqam va eski saytdagi Qoʻqon raqami — bu kataloglar gigiyenasi, sayt muammosi emas.
- «Real-time tracking» Yellow Pages tavsifidan; saytda toʻgʻri yozilgan: QR kodlarni xodimlar skanerlaydi, mijoz botda koʻradi, «jonli joylashuv emas».
- «Xarita va kataloglarda yoʻq» qisman notoʻgʻri: Google Maps kartochkasi (CID 14536427051693213311) va Yandex Maps kartochkasi (4,7 ball, 14 baho, sayt koʻrsatilgan) bor — ularni yaratish emas, tasdiqlash va tuzatish kerak.
- Past «koʻrinuvchanlik» asosan yosh va indekslanmaganlik (24 kun, 0 indekslangan sahifa, 1 tashqi havola) hamda brendni ikkiga boʻlgan eski domen tufayli — kontent yetishmasligi emas: narxli Offerʼlar, 35 savollik FAQ, llms.txt va 4 til boʻyicha GSR Buraq va Totransʼdan oldinda.
- Raqobatchilar boʻrttirilgan: Buraqʼning litsenziya raqamlari oʻzi eʼlon qilgan va tekshirib boʻlmaydi; Totransʼda 24 ta maqola (18 emas), oxirgisi 2026-yil may, Telegramda haftasiga bir post (har kuni emas). GSRʼning haqiqiy «yangilik» kamchiligi — 2023-11-01 dan beri jim turgan oʻz kanali.
- «GSR Group» nomi gsr.kg (Bishkek) va «Great Silk Road» turkman guruhi bilan toʻqnashadi; shuning uchun hamma joyda «GSR Logistics (GSR Group), Toshkent, Navoiy 27» deb yozing.
