// Worked-example tests for src/lib/pricing.ts. Run: node scripts/test-pricing.mjs
// Node ≥ 22.18 strips types natively; on older 22.x add --experimental-strip-types.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { estimate, estimateAir, estimateTruck, estimateRail, volumetricKg, chargeableKg, densityKgM3, formatBreakdown, BelowMinimumVolumeError } from '../src/lib/pricing.ts';
import {
  fmtUsd, fmtNumber, withFrom, ruDays, fmtInt, fmtDigits, fmtNumRange, fmtRange, fmtPercent, fmtUsdNumber, fmtUsdRange,
  usdMark, fmtSom, fmtSomRange, fromPosition, daysWord, unitWord, unitSymbol, sep, sepMark, arrow, endSentence,
  fmtDate, fmtMonthYear, readingMinutes, toAsciiDigits, parseNumber, decimalPattern,
} from '../src/lib/format.ts';

const tariffs = JSON.parse(readFileSync(new URL('../src/data/tariffs.json', import.meta.url), 'utf8'));
const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 0.011, `${msg}: expected ${b}, got ${a}`);
let passed = 0;
const test = (name, fn) => { fn(); passed += 1; console.log(`ok - ${name}`); };

// Primitives
test('volumetric ÷6000 and ÷5000', () => {
  near(volumetricKg({ l: 60, w: 50, h: 40 }, 6000), 20, 'truck volumetric');
  near(volumetricKg({ l: 60, w: 50, h: 40 }, 5000), 24, 'air volumetric');
  assert.equal(chargeableKg(5, 24), 24);
  assert.equal(densityKgM3(48, 0.2), 240);
});

// 1. 20 kg phone accessories by air, commercial category, 50×40×30 cm
test('example 1: 20 kg telefon aksessuarlari, avia, seriya/tijorat', () => {
  const e = estimateAir({ kg: 20, dims: { l: 50, w: 40, h: 30 }, category: 'commercial' }, tariffs);
  assert.equal(e.rule, 'air-per-kg');
  near(e.volumetricKg, 12, 'volumetric');
  assert.equal(e.chargeableKg, 20);
  assert.equal(e.rate, tariffs.air.perKg.commercial);
  near(e.total, 20 * tariffs.air.perKg.commercial, 'total');
  assert.deepEqual(e.days, tariffs.air.days);
  assert.ok(!e.notes.includes('volumetric-applied'));
});

// 2. 300 kg shoes by truck, 1.2 m³ → 250 kg/m³ → band 201–250 → $180/m³
test('example 2: 300 kg poyabzal, avto, 1,2 m³', () => {
  const e = estimateTruck({ kg: 300, m3: 1.2 }, tariffs);
  assert.equal(e.rule, 'truck-lcl');
  assert.equal(e.densityKgM3, 250);
  assert.equal(e.rate, 180);
  near(e.total, 216, 'total');
});

// 3. 2 m³ toys, 180 kg → 90 kg/m³ → band ≤100 → $110/m³
test('example 3: 2 m³ oʻyinchoq, LCL', () => {
  const e = estimateTruck({ kg: 180, m3: 2 }, tariffs);
  assert.equal(e.rule, 'truck-lcl');
  assert.equal(e.unit, 'm3');
  assert.equal(e.rate, 110);
  near(e.total, 220, 'total');
});

// 4. Air minimum weight
test('example 4: 0,3 kg avia → minimum 0,5 kg', () => {
  const e = estimateAir({ kg: 0.3, category: 'standard' }, tariffs);
  assert.equal(e.chargeableKg, tariffs.air.minKg);
  near(e.total, tariffs.air.minKg * tariffs.air.perKg.standard, 'total');
  assert.ok(e.notes.includes('min-kg-applied'));
});

// 5. Air volumetric wins: 5 kg in 60×50×40 → 24 kg
test('example 5: 5 kg, 60×50×40 sm, avia → hajmiy vazn 24 kg', () => {
  const e = estimateAir({ kg: 5, dims: { l: 60, w: 50, h: 40 } }, tariffs);
  assert.equal(e.chargeableKg, 24);
  assert.ok(e.notes.includes('volumetric-applied'));
  near(e.total, 24 * tariffs.air.perKg.standard, 'total');
});

// 6. Truck ladder steps and dense lot
test('example 6: avto ladder 20 kg / 60 kg / 500 kg zich', () => {
  // Every band of the owner's sheet, checked at the top of its range.
  const band = (kg, m3) => estimateTruck({ kg, m3 }, tariffs).rate;
  assert.equal(band(100, 1), 110);
  assert.equal(band(150, 1), 130);
  assert.equal(band(200, 1), 160);
  assert.equal(band(250, 1), 180);
  assert.equal(band(300, 1), 200);
  assert.equal(band(350, 1), 230);
  assert.equal(band(400, 1), 260);
  assert.equal(band(450, 1), 280);
  assert.equal(band(500, 1), 290);
  assert.equal(band(700, 1), 300);
  assert.equal(band(900, 1), 320);
  // Just inside a boundary still belongs to the lower band.
  assert.equal(band(101, 1), 130);
  assert.equal(band(201, 1), 180);
  // At and above 1000 kg/m³ the sheet bills per kilogram.
  const heavy = estimateTruck({ kg: 1000, m3: 1 }, tariffs);
  assert.equal(heavy.rule, 'truck-per-kg');
  assert.equal(heavy.unit, 'kg');
  assert.equal(heavy.rate, 0.55);
  near(heavy.total, 550, 'per-kg total');
  // Weight alone cannot be priced: the sheet needs a volume.
  assert.throws(() => estimateTruck({ kg: 20 }, tariffs), /volume is required/i);
});

// 6b. Owner, 2026-11-08: consolidated cargo starts at 1 m³ and nothing smaller is carried by truck.
// Below the minimum there is no price at all (the old sheet billed a 0,1 m³ floor), whatever the density.
test('example 6b: under 1 m³ the truck refuses, at 1 m³ it prices', () => {
  assert.equal(tariffs.truck.minM3, 1);
  assert.throws(() => estimateTruck({ kg: 2, m3: 0.02 }, tariffs), BelowMinimumVolumeError);
  assert.throws(() => estimateTruck({ kg: 48, dims: { l: 50, w: 40, h: 30 } }, tariffs), BelowMinimumVolumeError);
  assert.throws(() => estimateTruck({ kg: 600, m3: 0.5 }, tariffs), BelowMinimumVolumeError); // dense, still too small
  assert.throws(() => estimate({ mode: 'truck', kg: 30, m3: 0.99 }, tariffs), BelowMinimumVolumeError);
  const e = estimateTruck({ kg: 100, m3: 1 }, tariffs);
  assert.equal(e.rule, 'truck-lcl');
  assert.equal(e.chargeableM3, 1);
  assert.deepEqual(e.notes, []);
  near(e.total, 110, 'exactly the minimum');
  const d = estimateTruck({ kg: 100, dims: { l: 100, w: 100, h: 100 } }, tariffs); // 1 m³ from dimensions
  near(d.total, 110, 'dimensions at the minimum');
  // Air keeps its own small-cargo minimum, untouched by the truck rule.
  near(estimateAir({ kg: 0.3 }, tariffs).total, 0.5 * tariffs.air.perKg.standard, 'air minimum');
});

// 7. Rail
test('example 7: 20ft / 40ft konteyner', () => {
  const a = estimateRail('20ft', tariffs);
  assert.equal(a.total, tariffs.rail.container20ft[0]);
  assert.equal(a.totalMax, tariffs.rail.container20ft[1]);
  const b = estimate({ mode: 'rail', kg: 0, container: '40ft' }, tariffs);
  assert.equal(b.rule, 'rail-40ft');
});

// 8. Air-forbidden category switches to truck
test('example 8: batareyali tovar avia → avto', () => {
  // the truck sheet needs a volume of at least 1 m³, so the switched estimate has to carry one
  const e = estimate({ mode: 'air', kg: 120, m3: 1.2, category: 'battery' }, tariffs);
  assert.equal(e.mode, 'truck');
  assert.equal(e.notes[0], 'switched-to-truck');
  assert.equal(e.rule, 'truck-lcl');
  assert.throws(() => estimateAir({ kg: 10, category: 'liquid' }, tariffs), RangeError);
  // ...and a lot too small for the truck stays refused after the switch
  assert.throws(() => estimate({ mode: 'air', kg: 10, m3: 0.2, category: 'battery' }, tariffs), BelowMinimumVolumeError);
});

// 9. formatBreakdown produces localized strings
test('formatBreakdown uz/en', () => {
  const s = {
    modes: { air: 'Avia', truck: 'Avto', rail: 'Temir yoʻl' },
    categories: { standard: 'Oddiy', brand: 'Brend', commercial: 'Seriya', battery: 'Batareyali', liquid: 'Suyuqlik' },
    rules: { 'air-per-kg': 'Avia · {category} · {rate}', 'truck-lcl': 'Zichlik {density} kg/m³ → m³ boʻyicha · {rate}', 'truck-per-kg': 'Zichlik {density} kg/m³ ≥ {perKgDensity} → kg boʻyicha · {rate}', 'rail-20ft': '20ft · {rate}', 'rail-40ft': '40ft · {rate}' },
    notes: { 'volumetric-applied': 'Hajmiy vazn {volumetric} kg', 'min-kg-applied': 'Minimal {minKg} kg', 'no-volume': 'Hajm kiritilmagan', 'switched-to-truck': 'Avtoga oʻtkazildi', range: 'Oraliq' },
    units: { kg: 'kg', m3: 'm³', cm: 'sm', kgm3: 'kg/m³', perKg: '/kg', perM3: '/m³', days: 'kun', container: 'konteyner' },
    labels: { chargeable: 'Hisoblangan vazn', density: 'Zichlik', rule: 'Qoida', rate: 'Tarif', days: 'Muddat', volumetric: 'Hajmiy vazn', volume: 'Hajm', total: 'Jami', totalSom: 'Soʻmda', range: 'Konteyner' },
    approx: 'taxminan', containers: { '20ft': '20 fut', '40ft': '40 fut' },
  };
  const uz = formatBreakdown(estimateTruck({ kg: 300, m3: 1.2 }, tariffs), 'uz', s, tariffs);
  assert.equal(uz.total.replace(/\s/g, ' '), '≈ 216 $');
  assert.equal(uz.rule, 'Zichlik 250 kg/m³ → m³ boʻyicha · 180 $/m³');
  assert.ok(uz.totalSom.endsWith('soʻm'));
  const en = formatBreakdown(estimateAir({ kg: 0.3 }, tariffs), 'en', s, tariffs);
  assert.equal(en.total, '≈ $4.50');
  assert.equal(en.rate, '$9/kg');
  const rail = formatBreakdown(estimateRail('20ft', tariffs), 'uz', s, tariffs);
  assert.equal(rail.total.replace(/\s/g, ' '), '2 800–5 500 $');
  assert.ok(/soʻm$/.test(rail.totalSom) && rail.totalSom.split('soʻm').length === 2, 'som range prints the unit once');
  assert.equal(formatBreakdown(estimateRail('20ft', tariffs), 'en', s, tariffs).total, '$2,800–5,500');
});

// 10. Currency / plural / "from" formatting
test('fmtUsd, withFrom, ruDays', () => {
  assert.equal(fmtUsd(6.5, 'en'), '$6.50');
  assert.equal(fmtUsd(9, 'en'), '$9');
  assert.equal(fmtUsd(2800, 'en'), '$2,800');
  assert.equal(fmtUsd(1234.5, 'en'), '$1,234.50');
  assert.equal(fmtUsd(6.5, 'uz'), '6,5 $');
  assert.equal(fmtUsd(2800, 'ru').replace(/\s/g, ' '), '2 800 $');
  assert.equal(fmtNumber(0.4, 'ru'), '0,4');
  assert.equal(withFrom('6,5 $/kg', 'uz', 'dan'), '6,5 $/kg dan');
  assert.equal(withFrom('6,5 $/кг', 'ru', 'от'), 'от 6,5 $/кг');
  assert.equal(withFrom('$6.50/kg', 'en', 'from'), 'from $6.50/kg');
  assert.deepEqual([1, 3, 5, 11, 14, 21, 22, 25].map(ruDays), ['день', 'дня', 'дней', 'дней', 'дней', 'день', 'дня', 'дней']);
});

// 11. Dense-wholesale rule needs BOTH ≥ minKg and density ≥ minDensityKgM3
test('dense rule: ≥100 kg and ≥300 kg/m³', () => {
  assert.equal(tariffs.truck.perKgFromDensityKgM3, 1000);
  assert.equal(estimateTruck({ kg: 500, m3: 1 }, tariffs).rule, 'truck-lcl');        // 500 kg/m³ → $290/m³
  assert.equal(estimateTruck({ kg: 500, m3: 2 }, tariffs).rule, 'truck-lcl');        // 250 kg/m³ → $180/m³
  assert.equal(estimateTruck({ kg: 1200, m3: 1 }, tariffs).rule, 'truck-per-kg');    // 1200 kg/m³ → $0.55/kg
});

/* ─── src/lib/format.ts: the per-locale table, pinned in all six locales ─────────────────────────
 * Decisions of 2026-11-10 (zh/fa): zh writes ASCII digits with en separators, "110 美元", 起 after the
 * figure, 2026年9月8日; fa writes Persian digits ۰–۹ with ٬ and ٫, "۱۱۰ دلار", از before the figure,
 * "X تا Y" ranges, ٪, numeric Gregorian ۲۰۲۶/۰۹/۰۸, " • " and " ← " in code-level joins. uz, uzc, ru and
 * en must stay byte-identical to what the site printed before the table existed (group 13 below). */
const S = ' '; // the narrow no-break space uz/uzc/ru group with

// 12. Exact strings, every helper, every locale
test('format.ts: exact forms in uz, uzc, ru, en, zh, fa', () => {
  const expect = {
    uz: {
      n: [`1${S}200${S}000`, `1${S}234,5`, '0,55', `1${S}200${S}000,25`, '10'], int: ['2026', '07'],
      usd: ['110 $', '5,5 $', `1${S}234,5 $`, '0,55 $'], usdN: '5,5', usdR: [`2${S}800–5${S}500 $`, `2${S}800 $–5${S}500 $`],
      from: ['110 $/m³', 'dan', '110 $/m³ dan'], som: [`1${S}200${S}000 soʻm`, `2${S}548${S}800 soʻm`], somR: `20${S}000–30${S}000 soʻm`,
      date: ['2026-yil 8-sentabr', '2026-yil 28-noyabr', '2031-yil 1-yanvar'], my: '2026-yil sentabr',
      range: ['kun', '15–25 kun', '15–25'], pct: ['1%', '2,5%'], sep: [' · ', '·', ' → '], stop: 'Yangilangan: 2026-yil 8-sentabr.',
      unit: ['km', 'kg', 'm³'], symbol: ['km', 'kg', 'm³'], digits: ['03', '24/7'], mark: '$', fromPos: 'after',
    },
    uzc: {
      n: [`1${S}200${S}000`, `1${S}234,5`, '0,55', `1${S}200${S}000,25`, '10'], int: ['2026', '07'],
      usd: ['110 $', '5,5 $', `1${S}234,5 $`, '0,55 $'], usdN: '5,5', usdR: [`2${S}800–5${S}500 $`, `2${S}800 $–5${S}500 $`],
      from: ['110 $/m³', 'дан', '110 $/m³ дан'], som: [`1${S}200${S}000 сўм`, `2${S}548${S}800 сўм`], somR: `20${S}000–30${S}000 сўм`,
      date: ['2026-йил 8-сентябрь', '2026-йил 28-ноябрь', '2031-йил 1-январь'], my: '2026-йил сентябрь',
      range: ['кун', '15–25 кун', '15–25'], pct: ['1%', '2,5%'], sep: [' · ', '·', ' → '], stop: 'Янгиланган: 2026-йил 8-сентябрь.',
      unit: ['km', 'kg', 'm³'], symbol: ['km', 'kg', 'm³'], digits: ['03', '24/7'], mark: '$', fromPos: 'after',
    },
    ru: {
      n: [`1${S}200${S}000`, `1${S}234,5`, '0,55', `1${S}200${S}000,25`, '10'], int: ['2026', '07'],
      usd: ['110 $', '5,5 $', `1${S}234,5 $`, '0,55 $'], usdN: '5,5', usdR: [`2${S}800–5${S}500 $`, `2${S}800 $–5${S}500 $`],
      from: ['110 $/м³', 'от', 'от 110 $/м³'], som: [`1${S}200${S}000 сум`, `2${S}548${S}800 сум`], somR: `20${S}000–30${S}000 сум`,
      date: ['8 сентября 2026 г.', '28 ноября 2026 г.', '1 января 2031 г.'], my: 'сентябрь 2026',
      range: ['дней', '15–25 дней', '15–25'], pct: ['1%', '2,5%'], sep: [' · ', '·', ' → '], stop: 'Обновлено: 8 сентября 2026 г.',
      unit: ['км', 'кг', 'м³'], symbol: ['km', 'kg', 'm³'], digits: ['03', '24/7'], mark: '$', fromPos: 'before',
    },
    en: {
      n: ['1,200,000', '1,234.5', '0.55', '1,200,000.25', '10'], int: ['2026', '07'],
      usd: ['$110', '$5.50', '$1,234.50', '$0.55'], usdN: '5.50', usdR: ['$2,800–5,500', '$2,800–$5,500'],
      from: ['$110/m³', 'from', 'from $110/m³'], som: ['UZS 1,200,000', 'UZS 2,548,800'], somR: 'UZS 20,000–30,000',
      date: ['September 8, 2026', 'November 28, 2026', 'January 1, 2031'], my: 'September 2026',
      range: ['days', '15–25 days', '15–25'], pct: ['1%', '2.5%'], sep: [' · ', '·', ' → '], stop: 'Updated: September 8, 2026.',
      unit: ['km', 'kg', 'm³'], symbol: ['km', 'kg', 'm³'], digits: ['03', '24/7'], mark: '$', fromPos: 'before',
    },
    zh: {
      n: ['1,200,000', '1,234.5', '0.55', '1,200,000.25', '10'], int: ['2026', '07'],
      usd: ['110 美元', '5.50 美元', '1,234.50 美元', '0.55 美元'], usdN: '5.50', usdR: ['2,800–5,500 美元', '2,800–5,500 美元'],
      from: ['110 美元/m³', '起', '110 美元/m³ 起'], som: ['1,200,000 苏姆', '2,548,800 苏姆'], somR: '20,000–30,000 苏姆',
      date: ['2026年9月8日', '2026年11月28日', '2031年1月1日'], my: '2026年9月',
      range: ['天', '15–25 天', '15–25'], pct: ['1%', '2.5%'], sep: [' · ', '·', ' → '], stop: '更新：2026年9月8日。',
      unit: ['公里', 'kg', 'm³'], symbol: ['公里', 'kg', 'm³'], digits: ['03', '24/7'], mark: '美元', fromPos: 'after',
    },
    fa: {
      n: ['۱٬۲۰۰٬۰۰۰', '۱٬۲۳۴٫۵', '۰٫۵۵', '۱٬۲۰۰٬۰۰۰٫۲۵', '۱۰'], int: ['۲۰۲۶', '۰۷'],
      usd: ['۱۱۰ دلار', '۵٫۵ دلار', '۱٬۲۳۴٫۵ دلار', '۰٫۵۵ دلار'], usdN: '۵٫۵', usdR: ['۲٬۸۰۰ تا ۵٬۵۰۰ دلار', '۲٬۸۰۰ تا ۵٬۵۰۰ دلار'],
      from: ['۱۱۰ دلار/متر مکعب', 'از', 'از ۱۱۰ دلار/متر مکعب'], som: ['۱٬۲۰۰٬۰۰۰ سوم', '۲٬۵۴۸٬۸۰۰ سوم'], somR: '۲۰٬۰۰۰ تا ۳۰٬۰۰۰ سوم',
      date: ['۲۰۲۶/۰۹/۰۸', '۲۰۲۶/۱۱/۲۸', '۲۰۳۱/۰۱/۰۱'], my: '۲۰۲۶/۰۹',
      range: ['روز', '۱۵ تا ۲۵ روز', '۱۵ تا ۲۵'], pct: ['۱٪', '۲٫۵٪'], sep: [' • ', '•', ' ← '], stop: 'به‌روزرسانی: ۲۰۲۶/۰۹/۰۸.',
      unit: ['کیلومتر', 'کیلوگرم', 'متر مکعب'], symbol: ['کیلومتر', 'کیلوگرم', 'متر مکعب'], digits: ['۰۳', '۲۴/۷'], mark: 'دلار', fromPos: 'before',
    },
  };
  for (const [l, x] of Object.entries(expect)) {
    const at = (what) => `${l}: ${what}`;
    assert.deepEqual([fmtNumber(1200000, l), fmtNumber(1234.5, l), fmtNumber(0.55, l), fmtNumber(1200000.25, l), fmtNumber(10.4, l, 0)], x.n, at('fmtNumber'));
    assert.deepEqual([fmtInt(2026, l), fmtInt(7, l, 2)], x.int, at('fmtInt'));
    assert.deepEqual([fmtUsd(110, l), fmtUsd(5.5, l), fmtUsd(1234.5, l), fmtUsd(0.55, l)], x.usd, at('fmtUsd'));
    assert.equal(fmtUsdNumber(5.5, l), x.usdN, at('fmtUsdNumber'));
    assert.deepEqual([fmtUsdRange(2800, 5500, l), fmtUsdRange(2800, 5500, l, { each: true })], x.usdR, at('fmtUsdRange'));
    assert.equal(withFrom(x.from[0], l, x.from[1]), x.from[2], at('withFrom'));
    assert.deepEqual([fmtSom(1200000, l), fmtSom(2548800.4, l)], x.som, at('fmtSom'));
    assert.equal(fmtSomRange(20000, 30000, l), x.somR, at('fmtSomRange'));
    assert.deepEqual([fmtDate('2026-09-08', l), fmtDate(new Date(Date.UTC(2026, 10, 28)), l), fmtDate('2031-01-01', l)], x.date, at('fmtDate'));
    assert.equal(fmtMonthYear('2026-09-08', l), x.my, at('fmtMonthYear'));
    assert.deepEqual([x.range[1], x.range[2]], [fmtRange(15, 25, x.range[0], l), fmtNumRange(15, 25, l)], at('fmtRange / fmtNumRange'));
    assert.equal(fmtRange(15, 25, '', l), x.range[2], at('fmtRange without a unit'));
    assert.deepEqual([fmtPercent(1, l), fmtPercent(2.5, l)], x.pct, at('fmtPercent'));
    assert.deepEqual([sep(l), sepMark(l), arrow(l)], x.sep, at('sep / sepMark / arrow'));
    assert.equal(endSentence(x.stop.slice(0, -1), l), x.stop, at('endSentence adds the stop'));
    assert.equal(endSentence(x.stop, l), x.stop, at('endSentence never doubles it'));
    assert.deepEqual(['km', 'kg', 'm3'].map((u) => unitWord(u, l)), x.unit, at('unitWord'));
    assert.deepEqual(['km', 'kg', 'm3'].map((u) => unitSymbol(u, l)), x.symbol, at('unitSymbol'));
    assert.deepEqual([fmtDigits('03', l), fmtDigits('24/7', l)], x.digits, at('fmtDigits'));
    assert.equal(usdMark(l), x.mark, at('usdMark'));
    assert.equal(fromPosition(l), x.fromPos, at('fromPosition'));
    // Large figures and negatives keep their grouping; nothing ever groups with a plain U+0020.
    assert.ok(!/\d \d/.test(fmtNumber(123456789, l)) && !/[۰-۹] [۰-۹]/.test(fmtNumber(123456789, l)), at('no U+0020 grouping'));
  }
  // zh: no space before 起 after a Chinese character; fa digits are Persian (U+06F0–06F9), never Arabic-Indic.
  assert.equal(withFrom('110 美元', 'zh', '起'), '110 美元起');
  assert.equal(withFrom('5%', 'zh', '起'), '5% 起');
  assert.equal(fmtNumber(-1234.5, 'fa'), '-۱٬۲۳۴٫۵');
  assert.equal(fmtNumber(123456789, 'en'), '123,456,789');
  assert.equal(fmtNumber(123456789, 'ru'), `123${S}456${S}789`);
  assert.ok(!/[٠-٩]/.test(fmtNumber(1234567.89, 'fa')), 'fa never prints Arabic-Indic digits');
  // The day word: ru declines it, every other locale prints the word it is given (zh 天 / fa روز do not inflect).
  assert.deepEqual([daysWord(3, 'ru', 'дней'), daysWord(3, 'zh', '天'), daysWord(21, 'fa', 'روز')], ['дня', '天', 'روز']);
});

// 13. uz/uzc/ru/en: byte-identical to the formatters the table replaced (copied here verbatim, ternaries and all)
test('format.ts: uz, uzc, ru, en print exactly what the pre-table formatters printed', () => {
  const MONTHS = {
    uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
    uzc: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  /** i18n/pricing.ts `months` + `monthYear` templates, which built the month-and-year line before fmtMonthYear. */
  const MONTH_YEAR = { uz: (y, m) => `${y}-yil ${MONTHS.uz[m]}`, uzc: (y, m) => `${y}-йил ${MONTHS.uzc[m]}`, ru: (y, m) => `${MONTHS.uzc[m]} ${y}`, en: (y, m) => `${MONTHS.en[m]} ${y}` };
  const legacy = {
    fmtNumber(value, lang, maxFraction = 2) {
      const fixed = Number.isInteger(value) ? String(value) : value.toFixed(maxFraction).replace(/\.?0+$/, '');
      const [int, frac] = fixed.split('.');
      const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : S);
      if (!frac) return grouped;
      return lang === 'en' ? `${grouped}.${frac}` : `${grouped},${frac}`;
    },
    fmtUsdNumber(value, lang, maxFraction = 2) {
      if (lang === 'en' && !Number.isInteger(value)) { const [int, frac] = value.toFixed(2).split('.'); return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${frac}`; }
      return legacy.fmtNumber(value, lang, maxFraction);
    },
    fmtUsd(value, lang) { const n = legacy.fmtUsdNumber(value, lang); return lang === 'en' ? `$${n}` : `${n} $`; },
    withFrom: (value, lang, from) => (lang === 'uz' || lang === 'uzc' ? `${value} ${from}` : `${from} ${value}`),
    fmtSom(value, lang) { const n = legacy.fmtNumber(Math.round(value), lang, 0); return lang === 'uz' ? `${n} soʻm` : lang === 'uzc' ? `${n} сўм` : lang === 'ru' ? `${n} сум` : `UZS ${n}`; },
    fmtDate(iso, lang) {
      const d = typeof iso === 'string' ? new Date(iso) : iso;
      const y = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate();
      if (lang === 'uz') return `${y}-yil ${day}-${MONTHS.uz[m]}`;
      if (lang === 'uzc') return `${y}-йил ${day}-${MONTHS.uzc[m]}`;
      if (lang === 'ru') return `${day} ${MONTHS.ru[m]} ${y} г.`;
      return `${MONTHS.en[m]} ${day}, ${y}`;
    },
    fmtRange: (a, b, unit, lang) => `${legacy.fmtNumber(a, lang)}–${legacy.fmtNumber(b, lang)} ${unit}`,
    // the three range builders the table replaced: src/lib/pricing.ts formatBreakdown, src/data/faq.ts nums(), PricingPage's rail rows
    usdRange: (lo, hi, lang) => (lang === 'en' ? `$${legacy.fmtUsdNumber(lo, lang)}–${legacy.fmtUsdNumber(hi, lang)}` : `${legacy.fmtNumber(lo, lang)}–${legacy.fmtNumber(hi, lang)} $`),
    usdRangeEach: (lo, hi, lang) => `${legacy.fmtUsd(lo, lang)}–${legacy.fmtUsd(hi, lang)}`,
    somRange: (lo, hi, lang) => { const a = legacy.fmtSom(lo, lang), b = legacy.fmtSom(hi, lang); return lang === 'en' ? `${a}–${b.replace('UZS ', '')}` : `${a.replace(/ \S+$/, '')}–${b}`; },
    readingMinutes: (text) => Math.max(1, Math.round(text.trim().split(/\s+/).length / 180)),
  };
  const values = [0, 0.4, 0.5, 0.55, 0.8, 1, 1.2, 2.5, 5.5, 6.5, 9, 9.99, 11.5, 12, 99.995, 100, 110, 216, 999, 1000, 1234.5, 1234.567, 2800, 5000, 11800, 20000, 1200000, 1200000.4, 2548800, 33040000, 123456789.25, -1200, -0.5];
  let checked = 0;
  const same = (got, want, what) => { assert.equal(got, want, what); checked++; };
  for (const l of ['uz', 'uzc', 'ru', 'en']) {
    for (const v of values) {
      for (const f of [1, 2, 3]) same(fmtNumber(v, l, f), legacy.fmtNumber(v, l, f), `fmtNumber(${v}, ${l}, ${f})`);
      if (Number.isInteger(v)) same(fmtNumber(v, l, 0), legacy.fmtNumber(v, l, 0), `fmtNumber(${v}, ${l}, 0)`);
      same(fmtUsdNumber(v, l), legacy.fmtUsdNumber(v, l), `fmtUsdNumber(${v}, ${l})`);
      same(fmtUsd(v, l), legacy.fmtUsd(v, l), `fmtUsd(${v}, ${l})`);
      same(fmtSom(v, l), legacy.fmtSom(v, l), `fmtSom(${v}, ${l})`);
      same(fmtRange(v, v + 10, 'kun', l), legacy.fmtRange(v, v + 10, 'kun', l), `fmtRange(${v}, ${l})`);
      same(fmtUsdRange(v, v * 2 + 1, l), legacy.usdRange(v, v * 2 + 1, l), `fmtUsdRange(${v}, ${l})`);
      same(fmtUsdRange(v, v * 2 + 1, l, { each: true }), legacy.usdRangeEach(v, v * 2 + 1, l), `fmtUsdRange each (${v}, ${l})`);
      same(fmtSomRange(v * 11800, v * 23600 + 5, l), legacy.somRange(v * 11800, v * 23600 + 5, l), `fmtSomRange(${v}, ${l})`);
      same(withFrom(fmtUsd(v, l), l, 'from'), legacy.withFrom(legacy.fmtUsd(v, l), l, 'from'), `withFrom(${v}, ${l})`);
    }
    for (let m = 0; m < 12; m++) for (const day of [1, 8, 15, 28, 30]) for (const y of [2025, 2026, 2031]) {
      const d = new Date(Date.UTC(y, m, Math.min(day, 28 + (m === 1 ? 0 : 2))));
      same(fmtDate(d, l), legacy.fmtDate(d, l), `fmtDate(${d.toISOString()}, ${l})`);
      same(fmtDate(d.toISOString().slice(0, 10), l), legacy.fmtDate(d.toISOString().slice(0, 10), l), `fmtDate(iso, ${l})`);
      same(fmtMonthYear(d, l), MONTH_YEAR[l](y, m), `fmtMonthYear(${d.toISOString()}, ${l})`);
    }
    for (const n of [1, 2, 3, 4, 5, 11, 14, 21, 22, 25]) same(daysWord(n, l, 'kun'), l === 'ru' ? ruDays(n) : 'kun', `daysWord(${n}, ${l})`);
  }
  // Text without Chinese reads as it always did: words ÷ 180 (a few Han names inside it change nothing).
  for (const text of ['', 'one', 'word '.repeat(179), 'word '.repeat(271), `${'soʻz '.repeat(900)} Ivu (义乌), Guanchjou (广州)`]) same(readingMinutes(text), legacy.readingMinutes(text), 'readingMinutes');
  assert.ok(checked > 2500, `only ${checked} comparisons ran`);
});

// 14. formatBreakdown in zh and fa (the strings are shaped like the translators': units carry their own "/")
test('formatBreakdown zh/fa', () => {
  const base = {
    modes: { air: 'Air', truck: 'Truck', rail: 'Rail' },
    categories: { standard: 'S', brand: 'B', commercial: 'C', battery: 'Bt', liquid: 'L' },
    rules: { 'air-per-kg': '{category} · {kg} kg × {rate}', 'truck-lcl': '{density} kg/m³ → {m3} m³ × {rate}', 'truck-per-kg': '{density} ≥ {perKgDensity} · {rate}', 'rail-20ft': '{container} · {rate}', 'rail-40ft': '{container} · {rate}' },
    notes: { 'volumetric-applied': '{volumetric}', 'min-kg-applied': '{minKg}', 'no-volume': '-', 'switched-to-truck': '-', range: '-' },
    labels: { chargeable: 'c', density: 'd', rule: 'r', rate: 'rt', days: 'dy', volumetric: 'v', volume: 'vo', total: 't', totalSom: 'ts', range: 'rg' },
    containers: { '20ft': '20ft', '40ft': '40ft' },
  };
  const zh = { ...base, units: { kg: 'kg', m3: 'm³', cm: 'cm', kgm3: 'kg/m³', perKg: '/kg', perM3: '/m³', days: '天', container: '集装箱' }, approx: '约' };
  const fa = { ...base, units: { kg: 'کیلوگرم', m3: 'متر مکعب', cm: 'سانتی‌متر', kgm3: 'کیلوگرم بر متر مکعب', perKg: '/کیلوگرم', perM3: '/متر مکعب', days: 'روز', container: 'کانتینر' }, approx: 'حدود' };
  const truck = estimateTruck({ kg: 300, m3: 1.2 }, tariffs), air = estimateAir({ kg: 0.3 }, tariffs), rail = estimateRail('20ft', tariffs);
  const z = formatBreakdown(truck, 'zh', zh, tariffs);
  assert.equal(z.total, '≈ 216 美元');
  assert.equal(z.totalSom, '≈ 2,548,800 苏姆');
  assert.equal(z.rate, '180 美元/m³');
  assert.equal(z.rule, '250 kg/m³ → 1.2 m³ × 180 美元/m³');
  assert.equal(z.days, '15–25 天');
  assert.equal(formatBreakdown(air, 'zh', zh, tariffs).total, '≈ 4.50 美元');
  const zr = formatBreakdown(rail, 'zh', zh, tariffs);
  assert.deepEqual([zr.total, zr.totalSom], ['2,800–5,500 美元', '33,040,000–64,900,000 苏姆']);
  const f = formatBreakdown(truck, 'fa', fa, tariffs);
  assert.equal(f.total, '≈ ۲۱۶ دلار');
  assert.equal(f.totalSom, '≈ ۲٬۵۴۸٬۸۰۰ سوم');
  assert.equal(f.rate, '۱۸۰ دلار/متر مکعب');
  assert.equal(f.rule, '۲۵۰ kg/m³ → ۱٫۲ m³ × ۱۸۰ دلار/متر مکعب'); // the rule template is the translator's; the figures are Persian
  assert.equal(f.days, '۱۵ تا ۲۵ روز');
  assert.deepEqual(f.rows.map((r) => r.value), ['۱٫۲ متر مکعب', '۲۵۰ کیلوگرم بر متر مکعب', '۱۸۰ دلار/متر مکعب', 'حدود ۱۵ تا ۲۵ روز']);
  assert.equal(formatBreakdown(air, 'fa', fa, tariffs).total, '≈ ۴٫۵ دلار');
  const fr = formatBreakdown(rail, 'fa', fa, tariffs);
  assert.deepEqual([fr.total, fr.totalSom], ['۲٬۸۰۰ تا ۵٬۵۰۰ دلار', '۳۳٬۰۴۰٬۰۰۰ تا ۶۴٬۹۰۰٬۰۰۰ سوم']);
  for (const r of [z, zr, f, fr]) for (const s of [r.total, r.totalSom, r.days]) assert.ok(!/[‎‏‪-‮⁦-⁩]/.test(s), 'no bidi controls in figures');
});

// 15. Input: every digit set the visitors' keyboards type, and the separators around them
test('toAsciiDigits / parseNumber', () => {
  assert.equal(toAsciiDigits('۰۱۲۳۴۵۶۷۸۹'), '0123456789');      // Persian
  assert.equal(toAsciiDigits('٠١٢٣٤٥٦٧٨٩'), '0123456789');      // Arabic-Indic
  assert.equal(toAsciiDigits('０１２３４５６７８９'), '0123456789'); // full-width (Chinese IME)
  assert.equal(toAsciiDigits('۱٬۲۰۰٫۵'), '1200.5');              // ٬ groups (dropped), ٫ is the decimal mark
  assert.equal(toAsciiDigits('＋８６ １３８'), '+86 138');          // full-width plus and ideographic space
  assert.equal(toAsciiDigits('ＧＳ１２３４－ａ'), 'GS1234-a');       // a tracking code typed in full-width mode
  assert.equal(toAsciiDigits('+998 90 123 45 67'), '+998 90 123 45 67'); // ASCII passes through untouched
  assert.equal(toAsciiDigits('0.8 m³'), '0.8 m³', 'the superscript ³ is not a digit 3');
  const p = (raw, l) => parseNumber(raw, l);
  for (const l of ['uz', 'uzc', 'ru', 'en', 'zh', 'fa']) {
    assert.equal(p('20', l), 20, l); assert.equal(p('۲۰', l), 20, l); assert.equal(p('٢٠', l), 20, l); assert.equal(p('２０', l), 20, l);
    assert.equal(p('0.8', l), 0.8, l); assert.equal(p('0,8', l), 0.8, l); assert.equal(p('۰٫۸', l), 0.8, l); assert.equal(p('０．８', l), 0.8, l);
    assert.equal(p(' 1 200 ', l), 1200, l); assert.equal(p(`1${S}200`, l), 1200, l); assert.equal(p('۱٬۲۰۰', l), 1200, l);
    assert.equal(p('20 kg', l), 20, l);
    assert.ok(Number.isNaN(p('', l)) && Number.isNaN(p('abc', l)), l);
  }
  // uz, uzc, ru, en read EXACTLY as the calculator always did (its num(), copied here verbatim): the
  // first comma is the decimal mark, whatever else the field holds. Only the digit sets are new.
  const legacyNum = (value) => { const raw = value.trim().replace(/\s/g, '').replace(',', '.'); return parseFloat(raw.replace(/[^0-9.]/g, '')); };
  const typed = ['20', '0,8', '0.8', '1,200', '1,200.5', '1.200,5', '12,500,000', '1.2.3', '1,2,3', ' 7 ', '20kg', '0/8', "1'200", '١٢٫٥', '', 'abc', '.5', '5.', ',5'];
  let n = 0;
  for (const l of ['uz', 'uzc', 'ru', 'en']) for (const v of typed) {
    const want = legacyNum(v.replace('١٢٫٥', '12.5')), got = p(v, l);
    assert.ok(Object.is(got, want), `${l}: parseNumber(${JSON.stringify(v)}) = ${got}, the calculator always read ${want}`); n++;
  }
  assert.equal(n, 76);
  for (const l of ['uz', 'uzc', 'ru', 'en']) { assert.equal(p('1,200', l), 1.2, l); assert.equal(p('1,200.5', l), 1.2, l); assert.equal(p('۲/۵', l), 25, l); }
  // zh and fa group as their visitors write figures: a comma shaped like thousands groups, with both marks
  // the later one is the decimal; fa also reads "/" as the decimal mark (۲/۵ is 2.5).
  for (const l of ['zh', 'fa']) {
    assert.equal(p('1,200', l), 1200, l); assert.equal(p('１，２００', l), 1200, l); assert.equal(p('1,5', l), 1.5, l);
    assert.equal(p('1,200.5', l), 1200.5, l); assert.equal(p('1.200,5', l), 1200.5, l); assert.equal(p('12,500,000', l), 12500000, l);
  }
  assert.equal(p('۲/۵', 'fa'), 2.5); assert.equal(p('۰/۸', 'fa'), 0.8); assert.equal(p('۱٬۲۰۰/۵', 'fa'), 1200.5);
  assert.equal(p('2/5', 'zh'), 25, 'only fa reads "/" as a decimal mark');
});

// 15b. The decimal inputs' native `pattern`: compiles with the v flag browsers use (an invalid pattern is
// silently dropped), keeps the original shape (digits, one mark, digits), and takes every digit set read above.
test('decimalPattern', () => {
  const ok = (l, v) => new RegExp(`^(?:${decimalPattern(l)})$`, 'v').test(v);
  for (const l of ['uz', 'uzc', 'ru', 'en', 'zh', 'fa']) {
    for (const v of ['', '20', '0,8', '0.8', '۲۰', '۰٫۸', '٢٠', '２０', '０．８', '۱٬۲۰۰', '1,200', '.5']) assert.ok(ok(l, v), `${l} accepts ${JSON.stringify(v)}`);
    for (const v of ['1.2.3', '1,2,3', ' 20', '20 ', '1 200', '20kg', '-20', '..', 'abc']) assert.ok(!ok(l, v), `${l} rejects ${JSON.stringify(v)}`);
  }
  // the four older locales: what the original [0-9]*[.,]?[0-9]* accepted among ASCII input, exactly
  const original = new RegExp('^(?:[0-9]*[.,]?[0-9]*)$', 'v');
  for (const v of ['20', '0,8', '1,200', '12,500,000', '1,200.5', '1.2', '7.', '1/2', '1 2']) for (const l of ['uz', 'uzc', 'ru', 'en']) assert.equal(ok(l, v), original.test(v), `${l}: ${v}`);
  for (const l of ['zh', 'fa']) for (const v of ['12,500,000', '1,200.5', '１，２００']) assert.ok(ok(l, v), `${l} accepts ${v}`);
  assert.ok(ok('fa', '۲/۵') && ok('fa', '۱٬۲۰۰/۵') && !ok('zh', '2/5') && !ok('ru', '2/5'), 'only fa takes "/"');
});

// 16. Reading time: Chinese is counted in characters, every space-separated script in words
test('readingMinutes: Chinese by characters, Persian and the rest by words', () => {
  const han = '货物从义乌经霍尔果斯运往塔什干'.repeat(200); // 15 × 200 = 3,000 Han characters, no spaces
  assert.equal(readingMinutes(han), 8); // 3000 / 400 = 7.5
  assert.equal(readingMinutes(`${han} 1688 GSR Logistics`), 8);
  assert.equal(readingMinutes('بار از ییوو به تاشکند می‌رود '.repeat(300)), 10); // 6 words × 300 = 1800 / 180 (ZWNJ is not a space)
  assert.equal(readingMinutes('the cargo goes from Yiwu '.repeat(216)), 6);      // 1080 / 180
});

console.log(`\n${passed} test groups passed`);
