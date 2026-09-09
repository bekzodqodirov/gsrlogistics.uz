// Worked-example tests for src/lib/pricing.ts. Run: node scripts/test-pricing.mjs
// Node ≥ 22.18 strips types natively; on older 22.x add --experimental-strip-types.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { estimate, estimateAir, estimateTruck, estimateRail, volumetricKg, chargeableKg, densityKgM3, formatBreakdown } from '../src/lib/pricing.ts';
import { fmtUsd, fmtNumber, withFrom, ruDays } from '../src/lib/format.ts';

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

// 2. 300 kg shoes by truck, 1.2 m³ → 250 kg/m³ ≥ 170 → per kg ladder (100+)
test('example 2: 300 kg poyabzal, avto, 1,2 m³', () => {
  const e = estimateTruck({ kg: 300, m3: 1.2 }, tariffs);
  assert.equal(e.rule, 'truck-ladder');
  assert.equal(e.densityKgM3, 250);
  assert.equal(e.rate, 6.5);
  near(e.total, 1950, 'total');
});

// 3. 2 m³ toys, 180 kg → 90 kg/m³ < 170 → per m³, band ≤100
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
  assert.equal(estimateTruck({ kg: 20 }, tariffs).rate, 7.5);
  assert.equal(estimateTruck({ kg: 30 }, tariffs).rate, 7.5);
  assert.equal(estimateTruck({ kg: 60 }, tariffs).rate, 7.0);
  assert.equal(estimateTruck({ kg: 150 }, tariffs).rate, 6.5);
  assert.ok(estimateTruck({ kg: 20 }, tariffs).notes.includes('no-volume'));
  const dense = estimateTruck({ kg: 500, m3: 1 }, tariffs);
  assert.equal(dense.rule, 'truck-dense');
  assert.equal(dense.rate, tariffs.truck.densePerKg.rate);
  near(dense.total, 500 * tariffs.truck.densePerKg.rate, 'dense total');
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
  const e = estimate({ mode: 'air', kg: 10, category: 'battery' }, tariffs);
  assert.equal(e.mode, 'truck');
  assert.equal(e.notes[0], 'switched-to-truck');
  assert.throws(() => estimateAir({ kg: 10, category: 'liquid' }, tariffs), RangeError);
});

// 9. formatBreakdown produces localized strings
test('formatBreakdown uz/en', () => {
  const s = {
    modes: { air: 'Avia', truck: 'Avto', rail: 'Temir yoʻl' },
    categories: { standard: 'Oddiy', brand: 'Brend', commercial: 'Seriya', battery: 'Batareyali', liquid: 'Suyuqlik' },
    rules: { 'air-per-kg': 'Avia · {category} · {rate}', 'truck-ladder': 'Zichlik {density} kg/m³ ≥ {threshold} → kg boʻyicha · {rate}', 'truck-dense': 'Zich yuk · {rate}', 'truck-lcl': 'Zichlik {density} kg/m³ < {threshold} → m³ boʻyicha · {rate}', 'rail-20ft': '20ft · {rate}', 'rail-40ft': '40ft · {rate}' },
    notes: { 'volumetric-applied': 'Hajmiy vazn {volumetric} kg', 'min-kg-applied': 'Minimal {minKg} kg', 'min-m3-applied': 'Minimal {minM3} m³', 'no-volume': 'Hajm kiritilmagan', 'switched-to-truck': 'Avtoga oʻtkazildi', 'dense-lot': 'Zich yuk', range: 'Oraliq' },
    units: { kg: 'kg', m3: 'm³', cm: 'sm', kgm3: 'kg/m³', perKg: '/kg', perM3: '/m³', days: 'kun', container: 'konteyner' },
    labels: { chargeable: 'Hisoblangan vazn', density: 'Zichlik', rule: 'Qoida', rate: 'Tarif', days: 'Muddat', volumetric: 'Hajmiy vazn', volume: 'Hajm', total: 'Jami', totalSom: 'Soʻmda', range: 'Konteyner' },
    approx: 'taxminan', containers: { '20ft': '20 fut', '40ft': '40 fut' },
  };
  const uz = formatBreakdown(estimateTruck({ kg: 300, m3: 1.2 }, tariffs), 'uz', s, tariffs);
  assert.equal(uz.total.replace(/\s/g, ' '), '≈ 1 950 $');
  assert.equal(uz.rule, 'Zichlik 250 kg/m³ ≥ 170 → kg boʻyicha · 6,5 $/kg');
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
  assert.equal(tariffs.truck.densePerKg.minDensityKgM3, 300);
  assert.equal(estimateTruck({ kg: 500, m3: 1 }, tariffs).rule, 'truck-dense');      // 500 kg/m³
  assert.equal(estimateTruck({ kg: 500, m3: 2 }, tariffs).rule, 'truck-ladder');     // 250 kg/m³ — not dense
  assert.equal(estimateTruck({ kg: 60, m3: 0.1 }, tariffs).rule, 'truck-ladder');    // 600 kg/m³ but < 100 kg
});

console.log(`\n${passed} test groups passed`);
