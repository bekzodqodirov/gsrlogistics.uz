// Generates 1200×630 Open Graph images into public/og/ with sharp (librsvg). Fonts: Onest if installed
// in the system (see README), otherwise DejaVu Sans. Usage: node scripts/generate-og.mjs
import sharp from 'sharp';
import fs from 'node:fs';
const OUT = 'public/og';
fs.mkdirSync(OUT, { recursive: true });
const mark = fs.readFileSync('src/assets/brand/mark.svg', 'utf8').match(/<path d="[^"]+"\/>/g).join('');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const variants = {
  default: { line1: 'Xitoydan Oʻzbekistonga', line2: 'yuk tashish, tovar topish, sotib olish', meta: 'Yigʻma yuk 15–25 kun · Avia 5–10 kun · Toshkent · 2018-yildan' },
  uz: { line1: 'Xitoydan Toshkentga kargo.', line2: 'Har kilo, har kun — hisobda.', meta: 'Yigʻma yuk 15–25 kun · Avia 5–10 kun · Toshkent · 2018-yildan' },
  ru: { line1: 'Карго из Китая в Ташкент.', line2: 'Каждый килограмм — на счету.', meta: 'Сборный груз 15–25 дней · Авиа 5–10 дней · Ташкент · с 2018 года' },
  en: { line1: 'Cargo from China to Tashkent.', line2: 'Every kilo, every day — accounted for.', meta: 'Consolidated 15–25 days · Air 5–10 days · Tashkent · since 2018' },
};
const wrap = (text, max) => { const words = text.split(' '); const lines = []; let cur = ''; for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; } if (cur.trim()) lines.push(cur.trim()); return lines; };
for (const [key, v] of Object.entries(variants)) {
  const l1 = wrap(v.line1, 30), l2 = wrap(v.line2, 34);
  let y = 300 - (l1.length + l2.length - 2) * 30;
  const tspans = [...l1.map((t) => { const s = `<text x="88" y="${y}" font-family="Onest, DejaVu Sans, sans-serif" font-weight="700" font-size="60" fill="#f5f5f7" letter-spacing="-1.2">${esc(t)}</text>`; y += 70; return s; }),
    ...l2.map((t) => { const s = `<text x="88" y="${y}" font-family="Onest, DejaVu Sans, sans-serif" font-weight="500" font-size="44" fill="#a1a1a6" letter-spacing="-0.6">${esc(t)}</text>`; y += 56; return s; })].join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><radialGradient id="g" cx="85%" cy="0%" r="70%"><stop offset="0" stop-color="#a80a0d" stop-opacity=".35"/><stop offset="1" stop-color="#0b0b0d" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ffffff" fill-opacity=".07"/></pattern></defs>
  <rect width="1200" height="630" fill="#0b0b0d"/><rect width="1200" height="630" fill="url(#dots)"/><rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(88 84) scale(0.62)" fill="#c41216"><g transform="translate(50 52)">${mark}</g></g>
  <text x="170" y="118" font-family="Onest, DejaVu Sans, sans-serif" font-weight="700" font-size="34" fill="#f5f5f7" letter-spacing="-0.6">GSR Logistics</text>
  ${tspans}
  <path d="M88 520 C 400 470, 700 520, 1112 440" fill="none" stroke="#ff4d50" stroke-width="3" stroke-linecap="round"/>
  <circle cx="1112" cy="440" r="7" fill="#ff4d50"/><circle cx="88" cy="520" r="7" fill="#ff4d50"/>
  <text x="88" y="575" font-family="Onest, DejaVu Sans, sans-serif" font-weight="500" font-size="22" fill="#86868b">${esc(v.meta)}</text>
  <text x="1112" y="575" text-anchor="end" font-family="Onest, DejaVu Sans, sans-serif" font-weight="500" font-size="22" fill="#86868b">gsrlogistics.uz</text>
</svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(`${OUT}/${key}.png`);
  console.log('og:', key);
}
