# GSR Logistics — gsrlogistics.uz

Xitoydan Oʻzbekistonga yuk tashish, tovar topish va sotib olish boʻyicha kompaniyaning rasmiy sayti. Uch tilda (oʻzbek — asosiy, rus, ingliz), statik, juda yengil, AI-qidiruv (ChatGPT, Claude, Gemini, Perplexity, Yandex) va Google/Yandex uchun optimallashtirilgan.

Texnologiya: [Astro 7](https://astro.build) (statik HTML), Onest shrifti (oʻz serverimizdan), GSAP (faqat «Yoʻl» animatsiyasi uchun, kechiktirib yuklanadi), hech qanday tashqi skript yoʻq.

## Tez boshlash

```bash
npm install        # Node 22+ kerak (.nvmrc)
npm run dev        # http://localhost:4321 — jonli koʻrish
npm run build      # dist/ papkasiga tayyor sayt
npm run preview    # dist/ ni lokal koʻrish
```

## Saytni internetga chiqarish (hosting)

Sayt toʻliq statik — istalgan statik hostingda ishlaydi. Tavsiya: **Cloudflare Pages** (bepul, tez, forma/kuzatuv uchun serverless funksiyalar `functions/` papkasida tayyor).

**Cloudflare Pages:**
1. dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → shu repozitoriyni tanlang.
2. Build command: `npm run build`, Build output: `dist`, Node version: `22` (Environment variable `NODE_VERSION=22`).
3. Custom domains → `gsrlogistics.uz` va `www.gsrlogistics.uz` qoʻshing (DNS Cloudflare'da boʻlsa avtomatik).
4. Forma va kuzatuv uchun muhit oʻzgaruvchilari: `docs/DEPLOY-FUNCTIONS.md`.

**GitHub Pages (muqobil):** Settings → Pages → Source: *GitHub Actions*. `.github/workflows/deploy.yml` har `main` push'ida saytni chiqaradi; `public/CNAME` domenni belgilaydi. Domen DNS'ida GitHub Pages A/AAAA yozuvlarini qoʻying.

## Kompaniya maʼlumotlarini kiritish (MUHIM — ishga tushirishdan oldin)

Barcha kontakt va kompaniya faktlari **bitta faylda**: `src/lib/site.ts`. Undagi `TODO` belgilarini tekshiring:

| Nima | Qayerda | Hozirgi holat |
|---|---|---|
| Telefonlar | `phoneDisplay`, `phoneE164`, `phone2*` | +998 95 018 33 33 (Telegram kanalidan), +998 97 333 39 33 — tasdiqlang |
| Telegram chat (CTA tugmalari qayerga olib boradi) | `telegramDirect` | hozir telefon raqamiga havola; menejer @username'ini qoʻying |
| WhatsApp, e-mail, Instagram | `whatsapp`, `email`, `instagram` | tasdiqlang |
| Manzil va xarita | `address`, `geo`, `yandexMapsUrl` | Alisher Navoiy koʻchasi 27 — tasdiqlang |
| Ish vaqti | `hours`, `openingHoursSpec` | Du–Sha 9:00–19:00 — tasdiqlang |
| Yuridik nom, STIR | `legalEntity` | boʻsh — maxfiylik sahifasi va schema.org uchun kerak |
| Ivu ombori manzili (xitoycha), +86, WeChat | `chinaWarehouses` | boʻsh |
| Komissiya, sugʻurta % | `sourcingCommissionPct`, `insurancePct` | 3 %, 1 % — tasdiqlang |

## Narxlarni yangilash

Barcha narx va muddatlar `src/data/tariffs.json` faylida (avia $/kg, avto zinapoya, m³ boʻyicha zichlik jadvali, konteynerlar, qoʻshimcha xizmatlar, viloyatlarga yetkazish). Raqamni oʻzgartiring, `updated` sanasini yangilang, `git push` qiling — narxlar sahifasi, kalkulyator, bosh sahifa va schema.org avtomatik yangilanadi. Sayt hamma joyda «taxminiy narx · yangilangan: …» yozuvini koʻrsatadi.

## Kontentni tahrirlash

- Xizmat sahifalari: `src/data/services/<xizmat>.content.ts` (uz/ru/en bir faylda).
- Qoʻllanma maqolalari: `src/content/guides/<til>/<slug>.md` (Markdown, yuqorisida frontmatter). Yangi maqola qoʻshsangiz `src/data/guides.ts` ga uch tildagi slug'ni ham qoʻshing (hreflang uchun).
- Savol-javob: `src/data/faq.ts`.
- Bosh sahifa boʻlimlari matnlari: `src/i18n/*.ts`.
- Oʻzbek matnida ʻ (U+02BB) va ʼ (U+02BC) belgilaridan foydalaning (oʻ, gʻ, maʼlumot), oddiy ' emas.

## SEO va AI-qidiruv

`docs/SEO-PLAYBOOK.md` — egasi uchun toʻliq reja: Google Search Console, Bing Webmaster (IndexNow), Yandex Webmaster, Google Business Profile / Yandex Business / 2GIS kartochkalari, sharhlar, oylik narx yangilash, oylik AI-so'rov testi. Sayt tomonidan tayyor: `robots.txt` (barcha AI-kraulerlarga ruxsat), `sitemap-index.xml` (hreflang bilan), `llms.txt` + `llms-full.txt`, JSON-LD (Organization/LocalBusiness, Service, FAQPage, Article, BreadcrumbList), OG rasmlar, IndexNow kaliti.

Halollik qoidasi: saytda tasdiqlanmagan daʼvolar yoʻq (mijozlar soni, sertifikatlar, «bojsiz», «xalqaro»). Yangi fakt qoʻshishdan oldin uni isbotlash mumkinligiga ishonch hosil qiling — AI-qidiruv tizimlari ham, mijozlar ham buni tekshiradi.

## Tuzilma

```
src/
  layouts/Base.astro          sahifa qobigʻi (head, SEO, JSON-LD, header/footer)
  components/sections/        bosh sahifa boʻlimlari
  components/journey/         «Yoʻl» — pinned scroll-animatsiya (SVG xarita + GSAP)
  components/pages/           sahifa shablonlari (uch til uchun bitta)
  pages/  ru/  en/            marshrutlar (yupqa oʻramlar)
  i18n/                       matnlar (uz/ru/en), marshrut sluglari
  data/                       xizmatlar, tariflar, FAQ, qoʻllanma sluglari
  content/guides/             Markdown maqolalar
  lib/                        site.ts (kompaniya faktlari), schema.ts, format.ts
scripts/                      xarita generatori, OG rasmlar, llms-full, IndexNow
functions/api/                Cloudflare Pages Functions (forma → Telegram, kuzatuv)
docs/                         SEO-PLAYBOOK, DEPLOY-FUNCTIONS
```
