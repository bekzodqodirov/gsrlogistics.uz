/**
 * Pricing engine — pure TypeScript, no Astro/Vite-only imports, so `scripts/test-pricing.mjs`
 * can run it directly in Node (type stripping) and the same code is bundled for the client.
 *
 * Every figure comes from `src/data/tariffs.json`, passed in as `Tariffs`; nothing is hard-coded here.
 *
 * Truck cargo follows the company's own price sheet, which is purely volumetric: the cargo's density
 * (kg/m³) selects a price per m³, and only above `perKgFromDensityKgM3` — cargo denser than water,
 * where a truck hits its weight limit long before its volume limit — does the sheet bill per kilogram.
 * There is therefore no per-kilogram ladder for truck, and no estimate at all without a volume.
 * Every estimate returns the rule it applied, the rate, the unit, the total, the day range and note codes;
 * the UI translates codes into sentences (see `formatBreakdown` + `src/i18n/pricing.ts`).
 */
import type { Lang } from '../i18n/config.ts';
import { fmtNumber, fmtSom, fmtUsd, fmtUsdNumber } from './format.ts';

/* ---------------- Types for tariffs.json ---------------- */
export interface DensityBand { maxKgM3: number | null; rate: number }
export interface Tariffs {
  updated: string;
  validThrough: string;
  currency: string;
  estimate: boolean;
  usdToSom: number;
  air: { perKg: { standard: number; brand: number; commercial: number }; minKg: number; days: number[]; volumetricDivisor: number };
  truck: {
    days: number[];
    expressDays: number[];
    volumetricDivisor: number;
    /** density (kg/m³) → USD per m³ */
    lclPerM3ByDensity: DensityBand[];
    /** at or above this density the sheet bills per kg instead of per m³ */
    perKgFromDensityKgM3: number;
    perKgAboveDensity: number;
    minM3: number;
  };
  rail: { container20ft: number[]; container40ft: number[]; days: number[] };
  extras: { photoReportUsd: number; repackPerKg: number; inspectionPerKg: number; insurancePct: number; sourcingCommissionPct: number; freeStorageDaysChina: number; freeStorageDaysTashkent: number };
  regions: { toBranchFree: boolean; doorDeliverySom: number[]; tashkentDoorFreeFromKg: number };
}

export type Mode = 'air' | 'truck' | 'rail';
/** Goods category. `battery` and `liquid` cannot fly — the calculator switches them to truck. */
export type Category = 'standard' | 'brand' | 'commercial' | 'battery' | 'liquid';
export type Container = '20ft' | '40ft';
export type RuleCode = 'air-per-kg' | 'truck-lcl' | 'truck-per-kg' | 'rail-20ft' | 'rail-40ft';
export type NoteCode = 'volumetric-applied' | 'min-kg-applied' | 'min-m3-applied' | 'no-volume' | 'switched-to-truck' | 'range';

export interface Dims { l: number; w: number; h: number } // centimetres
export interface CargoInput { kg: number; dims?: Dims; m3?: number; category?: Category }

export interface Estimate {
  mode: Mode;
  rule: RuleCode;
  /** Rate in USD per `unit`. For rail this is the low end of the range. */
  rate: number;
  unit: 'kg' | 'm3' | 'container';
  /** USD total (low end for rail). */
  total: number;
  /** USD high end of a range (rail only). */
  totalMax?: number;
  days: [number, number];
  notes: NoteCode[];
  category?: Category;
  actualKg?: number;
  volumetricKg?: number;
  chargeableKg?: number;
  m3?: number;
  densityKgM3?: number;
  container?: Container;
}

export const CATEGORIES: Category[] = ['standard', 'brand', 'commercial', 'battery', 'liquid'];
export const AIR_FORBIDDEN: ReadonlyArray<Category> = ['battery', 'liquid'];
/** Thrown by estimateTruck when no volume was supplied — the truck sheet cannot price weight alone. */
export class VolumeRequiredError extends RangeError {
  constructor() { super('Truck cargo is priced per m³ by density; a volume is required'); this.name = 'VolumeRequiredError'; }
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const pair = (a: number[]): [number, number] => [a[0] ?? 0, a[1] ?? a[0] ?? 0];

/* ---------------- Primitives ---------------- */
export function isAirAllowed(category: Category | undefined): boolean {
  return !category || !AIR_FORBIDDEN.includes(category);
}

/** Volumetric ("hajmiy") weight: L × W × H (cm) ÷ divisor (6000 truck, 5000 air). */
export function volumetricKg(dims: Dims, divisor: number): number {
  if (!(dims.l > 0 && dims.w > 0 && dims.h > 0) || !(divisor > 0)) return 0;
  return r2((dims.l * dims.w * dims.h) / divisor);
}

/** Cubic metres from centimetre dimensions. */
export function m3FromDims(dims: Dims): number {
  if (!(dims.l > 0 && dims.w > 0 && dims.h > 0)) return 0;
  return (dims.l * dims.w * dims.h) / 1_000_000;
}

/** The larger of actual and volumetric weight. */
export function chargeableKg(actualKg: number, volumetric: number): number {
  return r2(Math.max(actualKg || 0, volumetric || 0));
}

/** kg per m³; 0 when volume is unknown. */
export function densityKgM3(kg: number, m3: number): number {
  return kg > 0 && m3 > 0 ? Math.round(kg / m3) : 0;
}

/** Resolve the volume of an input: explicit m³ wins over dimensions. */
export function resolveM3(input: { dims?: Dims; m3?: number }): number {
  if (input.m3 && input.m3 > 0) return input.m3;
  if (input.dims) return m3FromDims(input.dims);
  return 0;
}

export function densityBandRate(bands: DensityBand[], density: number): number {
  for (const band of bands) if (band.maxKgM3 === null || density <= band.maxKgM3) return band.rate;
  return bands[bands.length - 1]?.rate ?? 0;
}

/* ---------------- Estimators ---------------- */
export function estimateAir(input: CargoInput, t: Tariffs): Estimate {
  const category: Category = input.category ?? 'standard';
  if (!isAirAllowed(category)) throw new RangeError(`Category "${category}" cannot be shipped by air`);
  const notes: NoteCode[] = [];
  const m3 = resolveM3(input);
  const vol = m3 > 0 ? r2((m3 * 1_000_000) / t.air.volumetricDivisor) : 0;
  const actual = Math.max(0, input.kg || 0);
  let chargeable = chargeableKg(actual, vol);
  if (vol > actual && vol > 0) notes.push('volumetric-applied');
  if (chargeable < t.air.minKg) { chargeable = t.air.minKg; notes.push('min-kg-applied'); }
  if (m3 <= 0) notes.push('no-volume');
  const rateKey = category === 'brand' ? 'brand' : category === 'commercial' ? 'commercial' : 'standard';
  const rate = t.air.perKg[rateKey];
  return {
    mode: 'air', rule: 'air-per-kg', rate, unit: 'kg', total: r2(chargeable * rate), days: pair(t.air.days), notes, category,
    actualKg: actual, volumetricKg: vol || undefined, chargeableKg: chargeable, m3: m3 || undefined, densityKgM3: densityKgM3(actual, m3) || undefined,
  };
}

/**
 * Truck (consolidated), from the owner's own sheet: density (kg ÷ m³) picks a band and the total is
 * m³ × that band's rate, with `minM3` as the floor. At or above `perKgFromDensityKgM3` the sheet bills
 * per kilogram instead. A volume is required — weight alone cannot pick a band, so it throws.
 */
export function estimateTruck(input: CargoInput, t: Tariffs): Estimate {
  const notes: NoteCode[] = [];
  const actual = Math.max(0, input.kg || 0);
  const m3 = resolveM3(input);
  // The sheet prices a volume. Weight alone cannot pick a band, so refuse rather than invent a rate.
  if (m3 <= 0) throw new VolumeRequiredError();
  const density = densityKgM3(actual, m3);
  const days = pair(t.truck.days);
  const base = { mode: 'truck' as const, days, category: input.category, actualKg: actual, m3, densityKgM3: density || undefined };

  // Denser than water: the truck fills up by weight, so the sheet switches to a per-kilogram rate.
  if (density >= t.truck.perKgFromDensityKgM3) {
    return { ...base, rule: 'truck-per-kg', rate: t.truck.perKgAboveDensity, unit: 'kg', total: r2(actual * t.truck.perKgAboveDensity), notes, chargeableKg: actual };
  }

  let billableM3 = m3;
  if (billableM3 < t.truck.minM3) { billableM3 = t.truck.minM3; notes.push('min-m3-applied'); }
  const rate = densityBandRate(t.truck.lclPerM3ByDensity, density);
  return { ...base, rule: 'truck-lcl', rate, unit: 'm3', total: r2(billableM3 * rate), notes, chargeableKg: actual };
}

export function estimateRail(container: Container, t: Tariffs): Estimate {
  const range = container === '40ft' ? t.rail.container40ft : t.rail.container20ft;
  const [lo, hi] = pair(range);
  return { mode: 'rail', rule: container === '40ft' ? 'rail-40ft' : 'rail-20ft', rate: lo, unit: 'container', total: lo, totalMax: hi, days: pair(t.rail.days), notes: ['range'], container };
}

export interface EstimateInput extends CargoInput { mode: Mode; container?: Container }

/** Dispatcher used by the calculator: air-forbidden categories fall back to truck with a `switched-to-truck` note. */
export function estimate(input: EstimateInput, t: Tariffs): Estimate {
  if (input.mode === 'rail') return estimateRail(input.container ?? '20ft', t);
  if (input.mode === 'air') {
    if (isAirAllowed(input.category)) return estimateAir(input, t);
    const e = estimateTruck(input, t);
    return { ...e, notes: ['switched-to-truck', ...e.notes] };
  }
  return estimateTruck(input, t);
}

/* ---------------- Formatting ---------------- */
/** Localised fragments the breakdown needs; provided by src/i18n/pricing.ts. */
export interface BreakdownStrings {
  modes: Record<Mode, string>;
  categories: Record<Category, string>;
  rules: Record<RuleCode, string>;
  notes: Record<NoteCode, string>;
  units: { kg: string; m3: string; cm: string; kgm3: string; perKg: string; perM3: string; days: string; container: string };
  labels: { chargeable: string; density: string; rule: string; rate: string; days: string; volumetric: string; volume: string; total: string; totalSom: string; range: string };
  approx: string;
  containers: Record<Container, string>;
}

export interface Breakdown {
  /** "≈ 230 $" */
  total: string;
  /** "≈ 2 714 000 soʻm" */
  totalSom: string;
  /** "5–10 kun" */
  days: string;
  /** e.g. "Zichlik 250 kg/m³ → 1,2 m³ × 180 $/m³" */
  rule: string;
  rate: string;
  rows: Array<{ label: string; value: string }>;
  notes: string[];
}

const sub = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));

export function formatBreakdown(e: Estimate, lang: Lang, s: BreakdownStrings, t: Tariffs): Breakdown {
  const n = (v: number, f = 2) => fmtNumber(v, lang, f);
  const usd = (v: number) => fmtUsd(v, lang);
  const usdRange = (lo: number, hi: number) => (lang === 'en' ? `$${fmtUsdNumber(lo, lang)}–${fmtUsdNumber(hi, lang)}` : `${n(lo)}–${n(hi)} $`);
  const somRange = (lo: number, hi: number) => { const a = fmtSom(lo, lang), b = fmtSom(hi, lang); return lang === 'en' ? `${a}–${b.replace('UZS ', '')}` : `${a.replace(/ \S+$/, '')}–${b}`; };
  const rateStr = e.unit === 'kg' ? `${usd(e.rate)}${s.units.perKg}` : e.unit === 'm3' ? `${usd(e.rate)}${s.units.perM3}` : usdRange(e.rate, e.totalMax ?? e.rate);
  const vars = {
    rate: rateStr, density: n(e.densityKgM3 ?? 0, 0), kg: n(e.chargeableKg ?? 0), m3: n(e.m3 ?? 0, 2),
    minKg: n(t.air.minKg), minM3: n(t.truck.minM3), volumetric: n(e.volumetricKg ?? 0), divisor: n(e.mode === 'air' ? t.air.volumetricDivisor : t.truck.volumetricDivisor, 0),
    perKgDensity: n(t.truck.perKgFromDensityKgM3, 0), perKgRate: usd(t.truck.perKgAboveDensity),
    category: s.categories[e.category ?? 'standard'], container: s.containers[e.container ?? '20ft'],
  };
  const total = e.totalMax ? usdRange(e.total, e.totalMax) : `≈ ${usd(e.total)}`;
  const totalSom = e.totalMax ? somRange(e.total * t.usdToSom, e.totalMax * t.usdToSom) : `≈ ${fmtSom(e.total * t.usdToSom, lang)}`;
  const days = `${n(e.days[0], 0)}–${n(e.days[1], 0)} ${s.units.days}`;
  const rows: Breakdown['rows'] = [];
  if (e.mode !== 'rail') {
    if (e.volumetricKg) rows.push({ label: s.labels.volumetric, value: `${n(e.volumetricKg)} ${s.units.kg}` });
    if (e.unit === 'm3') rows.push({ label: s.labels.volume, value: `${n(e.m3 ?? 0, 2)} ${s.units.m3}` });
    else rows.push({ label: s.labels.chargeable, value: `${n(e.chargeableKg ?? 0)} ${s.units.kg}` });
    if (e.densityKgM3) rows.push({ label: s.labels.density, value: `${n(e.densityKgM3, 0)} ${s.units.kgm3}` });
  } else {
    rows.push({ label: s.labels.range, value: s.containers[e.container ?? '20ft'] });
  }
  rows.push({ label: s.labels.rate, value: rateStr });
  rows.push({ label: s.labels.days, value: `${s.approx} ${days}` });
  return {
    total, totalSom, days, rate: rateStr,
    rule: sub(s.rules[e.rule], vars),
    rows,
    notes: e.notes.map((code) => sub(s.notes[code], vars)),
  };
}
