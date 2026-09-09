# Saytni productionga chiqarish va domainni ulash

Saytning oʻzi tayyor: `main` branchga har bir push avtomatik build qilinadi va
GitHub Pages'ga chiqariladi (`.github/workflows/deploy.yml`). Qolgani — bir marta
sozlanadigan uchta narsa: **merge**, **Pages'ni yoqish**, **DNS**.

Hozirgi holat:

| Nima | Qiymati |
|---|---|
| Repozitoriy | `github.com/bekzodqodirov/gsrlogistics.uz` (public — Pages bepul ishlaydi) |
| Domen | `gsrlogistics.uz` (`public/CNAME` faylda yozilgan) |
| Sayt manzili | `astro.config.mjs` → `site: 'https://gsrlogistics.uz'` |
| Deploy | `main` ga push → GitHub Actions build → Pages |

---

## A varianti — GitHub Pages (tavsiya etiladi, hammasi allaqachon ulangan)

### 1-qadam. PR ni `main` ga merge qiling

<https://github.com/bekzodqodirov/gsrlogistics.uz/pull/1> → **Ready for review** →
**Merge pull request**.

### 2-qadam. Default branch ni `main` qiling

Hozir repozitoriyning default branchi ish branchi (`claude/gsr-logistics-website-cd31xm`).
**Settings → General → Default branch** → qalam belgisi → `main` → **Update**.
Shundan keyin keyingi barcha ishlar `main` dan boshlanadi.

### 3-qadam. Pages'ni yoqing

**Settings → Pages** (<https://github.com/bekzodqodirov/gsrlogistics.uz/settings/pages>)
→ **Build and deployment** → **Source:** `GitHub Actions`.

Boshqa hech narsa tanlash shart emas — workflow tayyor. **Actions** boʻlimida
«Deploy to GitHub Pages» yashil boʻlishini kuting (2–3 daqiqa).

> Vaqtinchalik manzil `https://bekzodqodirov.github.io/gsrlogistics.uz/` da faqat
> **bosh sahifa** koʻrinadi, ichki havolalar va rasmlar 404 beradi. Bu xato emas:
> sayt `gsrlogistics.uz` domeni uchun qurilgan (`astro.config.mjs` da `base` yoʻq),
> shuning uchun barcha yoʻllar domen ildizidan boshlanadi. Domen ulangach hammasi
> joyiga tushadi. Deploy oʻtganini tekshirish uchun shu manzil kifoya.

### 4-qadam. Domenni qoʻshing

Oʻsha **Settings → Pages** sahifasida → **Custom domain** → `gsrlogistics.uz` →
**Save**. GitHub DNS'ni tekshira boshlaydi va «DNS check in progress» deb turadi —
bu normal, keyingi qadamdan soʻng oʻzi yashil boʻladi.

### 5-qadam. DNS yozuvlari (domen sotib olingan joyda)

Domen panelida (ahost.uz / uzinfocom / Cloudflare — qayerdan olgan boʻlsangiz)
**DNS** boʻlimini oching va quyidagilarni qoʻshing:

| Turi | Nomi (Host) | Qiymati | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 3600 |
| A | `@` | `185.199.109.153` | 3600 |
| A | `@` | `185.199.110.153` | 3600 |
| A | `@` | `185.199.111.153` | 3600 |
| AAAA | `@` | `2606:50c0:8000::153` | 3600 |
| AAAA | `@` | `2606:50c0:8001::153` | 3600 |
| AAAA | `@` | `2606:50c0:8002::153` | 3600 |
| AAAA | `@` | `2606:50c0:8003::153` | 3600 |
| CNAME | `www` | `bekzodqodirov.github.io.` | 3600 |

Muhim:
- `@` — domenning oʻzi (`gsrlogistics.uz`). Baʼzi panellarda uni boʻsh qoldirish
  yoki `gsrlogistics.uz` deb yozish kerak.
- Toʻrtta A yozuvi ham kerak — bu GitHub'ning toʻrtta serveri, biri ishlamay qolsa
  qolganlari ushlab turadi.
- Eski A/AAAA/CNAME yozuvlari boʻlsa (masalan, oldingi hosting), ularni **oʻchiring** —
  aks holda sayt goh eski, goh yangi joyga tushadi.
- AAAA (IPv6) yozuvlarini panel qoʻllab-quvvatlamasa, faqat A yozuvlari bilan ham
  ishlayveradi.
- MX (pochta) yozuvlariga tegmang.

DNS odatda 10–30 daqiqada tarqaladi (baʼzan 24 soatgacha). Tekshirish:

```bash
dig +short gsrlogistics.uz          # 185.199.10x.153 chiqishi kerak
dig +short www.gsrlogistics.uz      # bekzodqodirov.github.io chiqishi kerak
```

### 6-qadam. HTTPS

DNS tarqagach GitHub sertifikatni oʻzi oladi (10–15 daqiqa). **Settings → Pages** da
**Enforce HTTPS** katagini belgilang. Shundan keyin `http://` avtomatik `https://` ga
oʻtadi.

> Agar domen **Cloudflare** DNS'ida turgan boʻlsa: yozuvlarni **DNS only** (kulrang
> bulut) qilib qoʻying yoki **SSL/TLS → Full** rejimini tanlang. «Flexible» rejimi
> GitHub Pages bilan cheksiz redirect beradi.

### 7-qadam. Tekshirish roʻyxati

- [ ] `https://gsrlogistics.uz/` ochiladi, qulf belgisi bor
- [ ] `https://gsrlogistics.uz/ru/` va `/en/` ochiladi
- [ ] `https://gsrlogistics.uz/narxlar/` — jadval toʻgʻri
- [ ] `https://gsrlogistics.uz/sitemap-index.xml` va `/robots.txt` ochiladi
- [ ] `https://gsrlogistics.uz/llms.txt` ochiladi
- [ ] Google Search Console va Yandex Webmaster'ga domenni qoʻshib, sitemap yuboring

---

## B varianti — Cloudflare Pages

GitHub Pages'da ikkita narsa ishlamaydi:

- **`functions/api/`** — aloqa formasi Telegram chatini ochadi (deep link), kuzatuv
  esa Telegramga xabar bilan yoʻnaltiradi. Hech narsa yoʻqolmaydi, lekin avtomatik emas.
- **`public/_headers`** — bu Cloudflare/Netlify fayli, GitHub Pages uni oʻqimaydi.
  Yaʼni undagi toʻrtta xavfsizlik sarlavhasi yuborilmaydi va kesh siyosati (`immutable`)
  qoʻllanmaydi — GitHub barcha fayllarni `max-age=600` bilan beradi. Faylni oʻchirmang:
  Cloudflare Pages'ga oʻtsangiz u oʻsha holicha ishlaydi.

Forma soʻrovlari **oʻzi** Telegram guruhingizga tushishini xohlasangiz, Cloudflare
Pages'ni tanlang.

1. <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → repozitoriyni tanlang.
2. Build sozlamalari:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Production branch: `main`
3. **Settings → Environment variables** → `docs/DEPLOY-FUNCTIONS.md` dagi
   oʻzgaruvchilarni qoʻshing (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`,
   `TRACK_SHEET_CSV_URL`).
4. **Custom domains** → `gsrlogistics.uz` qoʻshing. Domen nameserver'larini
   Cloudflare'ga oʻtkazsangiz, DNS yozuvlari avtomatik yoziladi.
5. GitHub Pages'ni oʻchiring (Settings → Pages → Source: `None`) — ikki joyda bir
   vaqtda turmasin.

Ikkalasida ham `main` ga push qilish yetarli: deploy avtomatik.

---

## Keyin nima boʻladi

| Nimani oʻzgartirmoqchisiz | Qayerdan |
|---|---|
| Telefon, Telegram, manzil | `src/lib/site.ts` |
| Narxlar | `src/data/tariffs.json` (`updated` sanasini ham yangilang) |
| Matnlar | `src/i18n/`, `src/data/`, `src/content/guides/` |

Oʻzgartirdingiz → `git commit` → `git push` → 2–3 daqiqada sayt yangilanadi.
`npm run build` lokalda ham ishlaydi va kontent tekshiruvidan oʻtmasa xato beradi.
