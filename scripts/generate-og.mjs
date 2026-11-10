// Generates 1200×630 Open Graph images into public/og/. The PNGs are committed, so nothing here runs
// in CI or in the build. Usage: node scripts/generate-og.mjs [variant …]   (no argument: all of them)
//
// default, uz, ru, en — sharp (librsvg). Fonts: Onest if installed in the system (see README),
// otherwise DejaVu Sans.
//
// zh, fa — headless Chromium, from the same drawing. librsvg takes its fonts from whatever fontconfig
// finds, which for Han is tofu on a minimal machine and for Persian a fallback face, so these two
// cards are drawn with PINNED font files embedded in the page: Onest (this repo's own dependency)
// for Latin and digits, Noto Sans SC Variable for Han, Vazirmatn Variable for Persian. Persian is
// right-aligned and laid out right to left, Chinese wraps by character; both with letter-spacing 0
// (tracking breaks Persian joining and crowds Han). Neither font is added to the site.
//   OG_CHROMIUM    a Chromium/Chrome binary, e.g. Playwright's (required for zh/fa)
//   OG_PLAYWRIGHT  a playwright-core install (default: resolve 'playwright-core')
//   OG_FONTS_SC    an unpacked @fontsource-variable/noto-sans-sc@5.2.10 (the folder with wght.css)
//   OG_FONTS_FA    an unpacked @fontsource-variable/vazirmatn@5.3.0 (default: node_modules/@fontsource-variable/vazirmatn)
// e.g. npm pack @fontsource-variable/noto-sans-sc@5.2.10 && tar xzf *.tgz && OG_FONTS_SC=$PWD/package \
//      OG_CHROMIUM=… OG_PLAYWRIGHT=… node scripts/generate-og.mjs zh fa
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
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
/** Drawn by headless Chromium with pinned fonts — see the header. */
const browserVariants = {
  zh: {
    lang: 'zh-Hans', dir: 'ltr', fonts: ['onest', 'sc'], family: "'Onest', 'Noto Sans SC', sans-serif",
    line1: '从中国到塔什干的货运。', line2: '每一公斤、每一天，都有据可查。',
    meta: '拼货 15–25 天 · 空运 5–10 天 · 塔什干 · 始于 2018 年',
  },
  fa: {
    lang: 'fa', dir: 'rtl', fonts: ['fa', 'onest'], family: "'Vazirmatn', 'Onest', sans-serif",
    line1: 'حمل بار از چین به تاشکند.', line2: 'هر کیلو، هر روز — ثبت\u{200C}شده و قابل پیگیری.',
    meta: 'بار تجمیعی ۱۵ تا ۲۵ روز • هوایی ۵ تا ۱۰ روز • تاشکند • از ۲۰۱۸',
  },
};
const wanted = process.argv.slice(2);
for (const k of wanted) if (!(k in variants) && !(k in browserVariants)) throw new Error(`unknown OG variant "${k}"`);
const want = (k) => !wanted.length || wanted.includes(k);
const wrap = (text, max) => { const words = text.split(' '); const lines = []; let cur = ''; for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; } if (cur.trim()) lines.push(cur.trim()); return lines; };
for (const [key, v] of Object.entries(variants)) {
  if (!want(key)) continue;
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

/* ── zh and fa: headless Chromium with pinned fonts ─────────────────────────────────────────── */

/** @font-face rules for one fontsource package, keeping only the files whose unicode-range `text` uses. */
function fontFaces(dir, family, text) {
  const css = fs.readFileSync(path.join(dir, fs.existsSync(path.join(dir, 'wght.css')) ? 'wght.css' : 'index.css'), 'utf8');
  const codes = new Set([...text].map((c) => c.codePointAt(0)));
  const covers = (range) => range.split(',').some((r) => {
    const [a, b] = r.trim().replace(/^U\+/i, '').split('-').map((h) => parseInt(h, 16));
    for (const c of codes) if (c >= a && c <= (b ?? a)) return true;
    return false;
  });
  const out = [];
  for (const m of css.matchAll(/@font-face\s*{([^}]*)}/g)) {
    const url = /url\(\.?\/?([^)]+\.woff2)\)/.exec(m[1])?.[1];
    const range = /unicode-range:\s*([^;]+);/.exec(m[1])?.[1];
    if (!url || (range && !covers(range))) continue;
    const data = fs.readFileSync(path.join(dir, url)).toString('base64');
    out.push(`@font-face{font-family:'${family}';font-weight:100 900;src:url(data:font/woff2;base64,${data}) format('woff2');${range ? `unicode-range:${range};` : ''}}`);
  }
  if (!out.length) throw new Error(`no font file in ${dir} covers the text`);
  return out.join('\n');
}

const browserKeys = Object.keys(browserVariants).filter(want);
if (browserKeys.length) {
  const need = (name) => { const v = process.env[name]; if (!v) throw new Error(`${name} is not set — see the header of scripts/generate-og.mjs`); return v; };
  const require = createRequire(import.meta.url);
  const { chromium } = require(process.env.OG_PLAYWRIGHT || 'playwright-core');
  const FONT_DIRS = {
    onest: ['Onest', path.resolve('node_modules/@fontsource-variable/onest')],
    sc: ['Noto Sans SC', process.env.OG_FONTS_SC],
    fa: ['Vazirmatn', process.env.OG_FONTS_FA || path.resolve('node_modules/@fontsource-variable/vazirmatn')],
  };
  const browser = await chromium.launch({ executablePath: need('OG_CHROMIUM') });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    for (const key of browserKeys) {
      const v = browserVariants[key];
      const all = `${v.line1}${v.line2}${v.meta}GSR Logistics gsrlogistics.uz`;
      const css = v.fonts.map((f) => {
        const [family, dir] = FONT_DIRS[f];
        if (!dir || !fs.existsSync(dir)) throw new Error(`${family}: font package not found (${dir ?? 'set its OG_FONTS_* variable'})`);
        return fontFaces(dir, family, all);
      }).join('\n');
      await page.setContent(`<!doctype html><html lang="${v.lang}"><head><meta charset="utf-8"><style>${css}\nhtml,body{margin:0;background:#0b0b0d}</style></head><body></body></html>`);
      // Wrap by measuring the real glyphs: Chinese by character (never opening a line with closing
      // punctuation, never splitting a run of digits or Latin), Persian by word.
      const wrapIn = (text, size, weight) => page.evaluate(async ({ text, size, weight, family, cjk }) => {
        const font = `${weight} ${size}px ${family}`;
        await document.fonts.load(font, text);
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = font;
        const units = cjk ? text.match(/[0-9A-Za-z.,–\-+%$ ]+|[\s\S]/gu) : text.split(' ');
        const glue = cjk ? '' : ' ';
        const lines = [];
        let cur = '';
        for (const u of units) {
          const next = cur ? cur + glue + u : u;
          if (cur && ctx.measureText(next).width > 1024 && !(cjk && /^[，。、；：！？）」』]/u.test(u))) { lines.push(cur); cur = u; } else cur = next;
        }
        if (cur) lines.push(cur);
        return lines.map((l) => l.trim());
      }, { text, size, weight, family: v.family, cjk: key === 'zh' });
      const l1 = await wrapIn(v.line1, 60, 700);
      const l2 = await wrapIn(v.line2, 44, 500);
      const rtl = v.dir === 'rtl';
      // Persian runs from the right margin: direction rtl with text-anchor START at x=1112 (anchoring
      // the END pushes it off the canvas). The mark, the wordmark and the route line never mirror.
      const x = rtl ? 1112 : 88;
      const textAttrs = (size, weight, fill) => `x="${x}" font-family="${esc(v.family).replace(/'/g, '&apos;')}" font-weight="${weight}" font-size="${size}" fill="${fill}" letter-spacing="0"${rtl ? ' direction="rtl" text-anchor="start"' : ''}`;
      let y = 300 - (l1.length + l2.length - 2) * 30;
      const lines = [
        ...l1.map((t) => { const s = `<text y="${y}" ${textAttrs(60, 700, '#f5f5f7')}>${esc(t)}</text>`; y += 70; return s; }),
        ...l2.map((t) => { const s = `<text y="${y}" ${textAttrs(44, 500, '#a1a1a6')}>${esc(t)}</text>`; y += 56; return s; }),
      ].join('');
      const domain = rtl
        ? `<text x="88" y="575" font-family="Onest, sans-serif" font-weight="500" font-size="22" fill="#86868b" direction="ltr">gsrlogistics.uz</text>`
        : `<text x="1112" y="575" text-anchor="end" font-family="Onest, sans-serif" font-weight="500" font-size="22" fill="#86868b">gsrlogistics.uz</text>`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" style="display:block">
  <defs><radialGradient id="g" cx="85%" cy="0%" r="70%"><stop offset="0" stop-color="#a80a0d" stop-opacity=".35"/><stop offset="1" stop-color="#0b0b0d" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ffffff" fill-opacity=".07"/></pattern></defs>
  <rect width="1200" height="630" fill="#0b0b0d"/><rect width="1200" height="630" fill="url(#dots)"/><rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(88 84) scale(0.62)" fill="#c41216"><g transform="translate(50 52)">${mark}</g></g>
  <text x="170" y="118" font-family="Onest, sans-serif" font-weight="700" font-size="34" fill="#f5f5f7" letter-spacing="-0.6" direction="ltr">GSR Logistics</text>
  ${lines}
  <path d="M88 520 C 400 470, 700 520, 1112 440" fill="none" stroke="#ff4d50" stroke-width="3" stroke-linecap="round"/>
  <circle cx="1112" cy="440" r="7" fill="#ff4d50"/><circle cx="88" cy="520" r="7" fill="#ff4d50"/>
  <text y="575" ${textAttrs(22, 500, '#86868b')}>${esc(v.meta)}</text>
  ${domain}
</svg>`;
      await page.evaluate((markup) => { document.body.innerHTML = markup; }, svg);
      await page.evaluate(() => document.fonts.ready);
      const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 }, type: 'png' });
      await sharp(png).png({ compressionLevel: 9 }).toFile(`${OUT}/${key}.png`);
      console.log('og:', key, `(Chromium, ${l1.length}+${l2.length} lines)`);
    }
  } finally {
    await browser.close();
  }
}
