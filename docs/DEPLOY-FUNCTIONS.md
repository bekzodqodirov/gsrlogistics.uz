# Forma va kuzatuv funksiyalari — Cloudflare Pages sozlamalari

Sayt toʻliq statik. Ikkita kichik serverless funksiya (`functions/api/`) ixtiyoriy:

| Funksiya | Manzil | Nima qiladi | Sozlanmasa nima boʻladi |
|---|---|---|---|
| `functions/api/lead.ts` | `POST /api/lead` | Aloqa sahifasidagi formani Telegram guruhingizga yuboradi | Forma Telegram chatini ochadi (deep link) va matnni nusxalash imkonini beradi — hech narsa yoʻqolmaydi |
| `functions/api/track.ts` | `GET /api/track?code=…` | Yuk kodini Google Sheets jadvalidan topib, holatni koʻrsatadi | Kuzatuv sahifasi Telegramga «Yuk kodi: …» xabar bilan yoʻnaltiradi |

Hech qanday maʼlumot saqlanmaydi: forma faqat Telegramga yuboriladi, kuzatuv faqat jadvaldan oʻqiydi.
Cloudflare Pages `functions/` papkasini avtomatik koʻradi — qoʻshimcha build sozlamasi kerak emas.

## 1. Muhit oʻzgaruvchilari (Environment variables)

Cloudflare dashboard → **Workers & Pages** → loyihangiz → **Settings** → **Environment variables** → **Production** (va xohlasangiz Preview) → **Add variable**. Har birini **Encrypt** (Secret) qilib saqlang. Oʻzgaruvchilarni kiritgandan keyin **Deployments → Retry deployment** (yoki yangi push) kerak.

| Oʻzgaruvchi | Majburiy | Qayerdan olinadi |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | forma uchun — ha | @BotFather → `/newbot` → token (`123456789:AA…`) |
| `TELEGRAM_CHAT_ID` | forma uchun — ha | quyida «chat_id qanday topiladi» |
| `TURNSTILE_SECRET` | yoʻq | Cloudflare → Turnstile → Add site → Secret key. Faqat vidjet saytga qoʻshilgandan keyin kiriting (quyida) |
| `TRACK_SHEET_CSV_URL` | kuzatuv uchun — ha | Google Sheets → Fayl → Веб-нашр / Publish to web → CSV havolasi |

## 2. Telegram bot va `chat_id`

1. Telegramda **@BotFather** ga `/newbot` yozing, nom bering, tokenni nusxalang → `TELEGRAM_BOT_TOKEN`.
2. Soʻrovlar tushadigan guruh yarating (masalan «GSR — sayt soʻrovlari»), botni guruhga qoʻshing. Botga xabar yuborish huquqi yetarli, admin shart emas.
3. Guruhda istalgan xabar yozing (masalan `test`).
4. Brauzerda oching (tokenni oʻzingiznikiga almashtiring):
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Javobda `"chat":{"id":-1001234567890,"title":"GSR — sayt soʻrovlari"…}` boʻladi. Shu `id` (minus belgisi bilan!) → `TELEGRAM_CHAT_ID`.
   - Oddiy guruh: `-123456789`; superguruh: `-100…` bilan boshlanadi.
   - Shaxsiy chat boʻlsa: botga «Start» bosing, keyin `getUpdates` da `"from":{"id":…}` — musbat son.
   - `getUpdates` boʻsh boʻlsa: bot sozlamalarida `/setprivacy` → **Disable** qiling (guruh xabarlarini koʻrishi uchun) yoki botni guruhdan chiqarib qayta qoʻshing.
6. Tekshirish: sayt Aloqa sahifasida formani toʻldiring — guruhga «Saytdan yangi soʻrov» xabari kelishi kerak.

Xabar shakli: Ism · Telefon · Yoʻnalish · Yuk · Til · Sahifa. Telefon `+998XXXXXXXXX` formatida tekshiriladi; «website» maydoni (honeypot) toʻldirilgan boʻlsa, xabar yuborilmaydi.

## 3. Turnstile (ixtiyoriy, spam koʻpaysa)

Forma hozir tashqi skriptlarsiz ishlaydi (honeypot + server tekshiruvi). Spam koʻp boʻlsa:

1. Cloudflare → **Turnstile** → Add site → domen `gsrlogistics.uz` → Managed → Site key va Secret key.
2. `src/components/LeadForm.astro` ichiga Turnstile vidjetini qoʻshing (`<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer>` va `<div class="cf-turnstile" data-sitekey="…">`), skript esa `turnstile` maydonini JSON’ga qoʻshsin (`document.querySelector('[name=cf-turnstile-response]').value`).
3. Shundan keyin `TURNSTILE_SECRET` ni kiriting. **Diqqat:** vidjetsiz `TURNSTILE_SECRET` qoʻyilsa, har bir soʻrov 403 oladi va forma Telegram deep link’ga oʻtadi.

## 4. Kuzatuv jadvali (Google Sheets)

1. Google Sheets’da yangi jadval oching. Birinchi qator — ustun nomlari (tartib muhim emas, katta-kichik harf farqsiz):

   | code | stage | status | updated_at | eta |
   |---|---|---|---|---|
   | GSR-2409-017 | transit | Xorgosga yaqinlashmoqda | 2026-09-08 | 2026-09-16 |
   | GSR-2409-018 | 1 | | 2026-09-07 | |

   - `code` — mijozga berilgan yuk kodi (harflar, raqamlar, defis; 3–32 belgi). Katta-kichik harf farqsiz.
   - `stage` — bosqich kaliti yoki raqami:
     `received`(1) Xitoyda qabul (Ivu / Guanchjou / Qashqar) · `consolidation`(2) Konsolidatsiya · `transit`(3) Yoʻlda · `customs`(4) Chegara/bojxona · `tashkent`(5) Toshkent ombori · `delivered`(6) Topshirildi.
   - `status` — ixtiyoriy qisqa izoh (mijoz koʻradi, 200 belgigacha). Shaxsiy maʼlumot yozmang.
   - `updated_at`, `eta` — ISO sana `YYYY-MM-DD` (sayt mijoz tilida chiroyli koʻrsatadi). `eta` boʻsh boʻlsa «aniqlashtirilmoqda» chiqadi.
   - Jadvalda boshqa ustunlar (ism, telefon, summa) boʻlishi mumkin — funksiya ularni **hech qachon** yubormaydi. Lekin nashr qilingan CSV havolasini bilgan har kim jadvalning hammasini koʻrishi mumkin, shuning uchun yaxshisi alohida «tracking» varagʻini nashr qiling va unda faqat shu 5 ustun boʻlsin.
2. **Fayl → Веб-нашр (Publish to the web)** → «Havola» → faqat kerakli varaqni tanlang → format **CSV** → Publish. Havola `https://docs.google.com/spreadsheets/d/e/…/pub?gid=…&single=true&output=csv` koʻrinishida boʻladi → `TRACK_SHEET_CSV_URL`.
3. Yangilanish: sayt CSV’ni 5 daqiqa keshlaydi (`CACHE_SECONDS` in `functions/api/track.ts`). Jadvaldagi oʻzgarish saytda 5 daqiqa ichida koʻrinadi.
4. Tekshirish: `https://gsrlogistics.uz/api/track?code=GSR-2409-017` → JSON `{"code":…,"stage":"transit",…}`; notoʻgʻri kod → `404 {"error":"not_found"}`.

## 5. Lokal tekshirish (ixtiyoriy)

```bash
npm run build
npx wrangler pages dev dist --binding TELEGRAM_BOT_TOKEN=… --binding TELEGRAM_CHAT_ID=… --binding TRACK_SHEET_CSV_URL=…
# http://localhost:8788/aloqa/  va  /api/track?code=…
```

(`wrangler` loyihaga qoʻshilmagan — `npx` vaqtinchalik yuklab oladi.)

## 6. Boshqa hostingda (GitHub Pages va h.k.)

`functions/` ishlamaydi — bu normal: forma Telegram deep link bilan, kuzatuv Telegram xabar bilan ishlayveradi. Kelajakda boshqa endpoint qoʻysangiz, `LeadForm` va `TrackingForm` komponentlarida `endpoint` prop’ini (`/api/lead`, `/api/track`) oʻzgartiring — brauzer skripti `window.__LEAD_ENDPOINT` orqali ham oʻqiydi.
