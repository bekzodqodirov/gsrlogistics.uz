#!/usr/bin/env node
/**
 * build-map.mjs — builds the vector map asset for the scroll-driven
 * "cargo journey" section (src/components/journey/).
 *
 * Reproducible, dependency-free (Node >= 22 built-ins + global fetch only).
 *
 *   node scripts/build-map.mjs [--tolerance=1.2] [--preview=<png path>] [--force-download]
 *
 * What it does
 *   1. Downloads Natural Earth admin-0 countries GeoJSON (public domain), trying
 *      50m from raw.githubusercontent.com, then jsDelivr, then the 110m variant.
 *      The download is cached in MAP_CACHE_DIR (default: see CACHE_DIR below).
 *      If Node's fetch ignores your HTTPS proxy, run with NODE_USE_ENV_PROXY=1.
 *   2. Keeps only countries touching the box lon 55–125 E, lat 18–52 N and clips
 *      every ring to that box (Sutherland–Hodgman against the 4 box edges).
 *   3. Projects with Web Mercator into viewBox "0 0 1600 923":
 *
 *        mercY(lat) = ln(tan(π/4 + lat·π/360)) · 180/π        (Mercator "degrees")
 *        x = (lon − 60) · 24.62
 *        y = (mercY(50) − mercY(lat)) · 24.62                  mercY(50) ≈ 57.9079
 *
 *      Verified against 11 reference cities (Guangzhou, Yiwu, Xi'an, Lanzhou,
 *      Urumqi, Khorgos, Almaty, Shymkent, Kashgar, Tashkent, Samarkand): the
 *      maximum deviation from the target pixel coordinates is < 1 px, so the
 *      constants above are used unchanged. Box corners in this space:
 *      lon 55 → x −123.1 · lon 125 → x 1600.3 · lat 52 → y −78.3 · lat 18 → y 975.1
 *      (i.e. the clipped geometry slightly overhangs the viewBox on the left,
 *      top and bottom — useful for pan/zoom effects; the viewBox crops it).
 *   4. Simplifies every ring with Douglas–Peucker in output (pixel) space,
 *      drops rings with < 4 points (closing point included) or |area| < 30 px²,
 *      rounds coordinates to 1 decimal, normalises winding (outer rings
 *      positive, holes negative → correct under both nonzero and evenodd) and
 *      writes one <path> per country.
 *   5. Writes
 *        src/components/journey/map-paths.svg.txt   — bare <path …/> lines
 *        src/components/journey/map-meta.json       — projection, city pixel
 *          coordinates, route path data (routeD / railD / airD / kgD), sizes.
 *      Size budget: paths ≤ 60 KB raw and ≤ 12 KB gzipped. The tolerance starts
 *      at 1.2 px and is raised in 0.1 px steps (max 2.5 px) until both fit.
 *   6. Optionally (--preview=path) rasterises a dark preview PNG with the
 *      project's `sharp` so the result can be eyeballed.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'src', 'components', 'journey');
const OUT_PATHS = path.join(OUT_DIR, 'map-paths.svg.txt');
const OUT_META = path.join(OUT_DIR, 'map-meta.json');
const CACHE_DIR =
  process.env.MAP_CACHE_DIR ||
  '/tmp/claude-0/-home-user-gsrlogistics-uz/0bc60459-8107-5df1-b27c-f7b9e3cea5fc/scratchpad/map-cache';

const SOURCES = [
  {
    name: 'ne_50m_admin_0_countries',
    url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson',
  },
  {
    name: 'ne_50m_admin_0_countries',
    url: 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_admin_0_countries.geojson',
  },
  {
    name: 'ne_110m_admin_0_countries',
    url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
  },
];

const BOX = { lonMin: 55, lonMax: 125, latMin: 18, latMax: 52 };
const VIEW = { w: 1600, h: 923 };

// Projection constants (see header).
const K = 24.62;
const LON0 = 60;
const LAT0 = 50;
const mercY = (lat) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
const MERC_Y0 = mercY(LAT0);
const project = (lon, lat) => [(lon - LON0) * K, (MERC_Y0 - mercY(lat)) * K];

const MAX_RAW_BYTES = 60 * 1024;
const MAX_GZIP_BYTES = 12 * 1024;
const TOLERANCE_START = 1.2;
const TOLERANCE_MAX = 2.5;
const TOLERANCE_STEP = 0.1;
const MIN_RING_POINTS = 4; // closing point included (GeoJSON style)
const MIN_RING_AREA = 30; // px²

const CLASS_BY_ISO = { CHN: 'land-cn', UZB: 'land-uz', KAZ: 'land-kz', KGZ: 'land-kg' };

// Cities: [lon, lat, targetX?, targetY?]. Targets are the spec's reference values.
const CITIES = {
  Guangzhou: [113.26, 23.13, 1311, 840],
  Yiwu: [120.07, 29.31, 1479, 670],
  "Xi'an": [108.94, 34.34, 1205, 524],
  Lanzhou: [103.83, 36.06, 1079, 473],
  Urumqi: [87.62, 43.83, 680, 223],
  Khorgos: [80.42, 44.21, 502, 210],
  Almaty: [76.95, 43.24, 417, 243],
  Shymkent: [69.6, 42.32, 236, 274],
  Kashgar: [75.99, 39.47, 394, 366],
  Tashkent: [69.28, 41.31, 228, 307],
  Samarkand: [66.97, 39.65, 172, 361],
  Irkeshtam: [73.92, 39.68],
  Osh: [72.8, 40.53],
  Andijan: [72.34, 40.78],
  Bukhara: [64.42, 39.77],
  Dostyk: [80.5, 45.25],
  Bishkek: [74.59, 42.87],
  Beijing: [116.4, 39.9],
  Shanghai: [121.47, 31.23],
  Shenzhen: [114.06, 22.54],
  Turpan: [89.19, 42.95],
};

const ROUTE = ['Yiwu', "Xi'an", 'Lanzhou', 'Urumqi', 'Khorgos', 'Almaty', 'Shymkent', 'Tashkent'];
const RAIL = ['Yiwu', "Xi'an", 'Lanzhou', 'Urumqi', 'Dostyk', 'Almaty', 'Shymkent', 'Tashkent'];
const AIR = ['Guangzhou', 'Tashkent'];
const KG_CORRIDOR = ['Kashgar', 'Irkeshtam', 'Osh', 'Andijan', 'Tashkent'];
const AIR_LIFT_PX = 260;
const CATMULL_ROM_TENSION = 0.5;

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? true] : [a, true];
  }),
);
const toleranceArg = args.tolerance ? Number(args.tolerance) : null;
const previewPath = typeof args.preview === 'string' ? path.resolve(args.preview) : null;
const forceDownload = Boolean(args['force-download']);

// ---------------------------------------------------------------------------
// Download with fallback + cache
// ---------------------------------------------------------------------------

async function loadGeoJSON() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const errors = [];
  for (const src of SOURCES) {
    const cacheFile = path.join(CACHE_DIR, `${src.name}.geojson`);
    if (!forceDownload) {
      try {
        const txt = await fs.readFile(cacheFile, 'utf8');
        const json = JSON.parse(txt);
        if (json && json.type === 'FeatureCollection') {
          console.log(`✓ using cached ${src.name} (${fmtBytes(txt.length)})`);
          return { ...src, json };
        }
      } catch {
        /* cache miss */
      }
    }
    try {
      console.log(`↓ downloading ${src.url}`);
      const res = await fetch(src.url, { signal: AbortSignal.timeout(120_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const txt = await res.text();
      const json = JSON.parse(txt);
      if (!json || json.type !== 'FeatureCollection') throw new Error('not a FeatureCollection');
      await fs.writeFile(cacheFile, txt);
      console.log(`✓ downloaded ${src.name} (${fmtBytes(txt.length)}), cached at ${cacheFile}`);
      return { ...src, json };
    } catch (e) {
      const msg = `${src.url}: ${e.message}${e.cause ? ' (' + e.cause.message + ')' : ''}`;
      console.warn(`✗ ${msg}`);
      errors.push(msg);
    }
  }
  throw new Error('All Natural Earth sources failed:\n  ' + errors.join('\n  '));
}

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

function featureBbox(geometry) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const poly of polygonsOf(geometry)) {
    for (const ring of poly) {
      for (const [x, y] of ring) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return [minX, minY, maxX, maxY];
}

function polygonsOf(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return [geometry.coordinates];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates;
  return [];
}

/** Sutherland–Hodgman clip of one ring (array of [lon, lat]) against BOX. */
function clipRing(ring) {
  const edges = [
    { inside: (p) => p[0] >= BOX.lonMin, axis: 0, v: BOX.lonMin },
    { inside: (p) => p[0] <= BOX.lonMax, axis: 0, v: BOX.lonMax },
    { inside: (p) => p[1] >= BOX.latMin, axis: 1, v: BOX.latMin },
    { inside: (p) => p[1] <= BOX.latMax, axis: 1, v: BOX.latMax },
  ];
  let out = ring;
  if (out.length && out[0][0] === out[out.length - 1][0] && out[0][1] === out[out.length - 1][1]) {
    out = out.slice(0, -1); // work on an open ring
  }
  for (const e of edges) {
    if (!out.length) return [];
    const input = out;
    out = [];
    let prev = input[input.length - 1];
    let prevIn = e.inside(prev);
    for (const cur of input) {
      const curIn = e.inside(cur);
      if (curIn) {
        if (!prevIn) out.push(intersect(prev, cur, e));
        out.push(cur);
      } else if (prevIn) {
        out.push(intersect(prev, cur, e));
      }
      prev = cur;
      prevIn = curIn;
    }
  }
  return out;
}

function intersect(a, b, e) {
  const t = (e.v - a[e.axis]) / (b[e.axis] - a[e.axis]);
  const other = 1 - e.axis;
  const p = [0, 0];
  p[e.axis] = e.v;
  p[other] = a[other] + (b[other] - a[other]) * t;
  return p;
}

/** Perpendicular distance from p to segment a–b. */
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  let t = 0;
  if (l2 > 0) t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
  const x = a[0] + t * dx, y = a[1] + t * dy;
  return Math.hypot(p[0] - x, p[1] - y);
}

/** Iterative Douglas–Peucker on an open polyline; keeps both endpoints. */
function douglasPeucker(pts, tol) {
  const n = pts.length;
  if (n <= 2) return pts.slice();
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack = [[0, n - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let maxD = -1, idx = -1;
    for (let i = s + 1; i < e; i++) {
      const d = segDist(pts[i], pts[s], pts[e]);
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol && idx > 0) {
      keep[idx] = 1;
      stack.push([s, idx], [idx, e]);
    }
  }
  const out = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(pts[i]);
  return out;
}

/** Simplify a closed ring (open representation, no duplicate last point). */
function simplifyRing(ring, tol) {
  if (ring.length < 3) return [];
  // Anchor on the point farthest from ring[0] so the ring can't collapse to a line.
  let far = 1, farD = -1;
  for (let i = 1; i < ring.length; i++) {
    const d = Math.hypot(ring[i][0] - ring[0][0], ring[i][1] - ring[0][1]);
    if (d > farD) { farD = d; far = i; }
  }
  const a = douglasPeucker(ring.slice(0, far + 1), tol);
  const b = douglasPeucker(ring.slice(far).concat([ring[0]]), tol);
  return a.concat(b.slice(1, -1));
}

function signedArea(ring) {
  let s = 0;
  for (let i = 0, n = ring.length; i < n; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % n];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

const r1 = (v) => Math.round(v * 10) / 10;
const fmt1 = (v) => {
  const s = r1(v).toFixed(1);
  return s === '-0.0' ? '0.0' : s;
};

/** Compact path data: "M x y x y … Z" (implicit lineto), no space before '-'. */
function ringToPath(ring) {
  let d = 'M';
  for (let i = 0; i < ring.length; i++) {
    const x = fmt1(ring[i][0]), y = fmt1(ring[i][1]);
    d += (i === 0 || x.startsWith('-') ? '' : ' ') + x + (y.startsWith('-') ? '' : ' ') + y;
  }
  return d + 'Z';
}

/** Remove consecutive duplicates after rounding. */
function dedupeRounded(ring) {
  const out = [];
  for (const p of ring) {
    const q = [r1(p[0]), r1(p[1])];
    const last = out[out.length - 1];
    if (!last || last[0] !== q[0] || last[1] !== q[1]) out.push(q);
  }
  if (out.length > 1) {
    const f = out[0], l = out[out.length - 1];
    if (f[0] === l[0] && f[1] === l[1]) out.pop();
  }
  return out;
}

// ---------------------------------------------------------------------------
// Country processing
// ---------------------------------------------------------------------------

function isoOf(props) {
  const ok = (v) => typeof v === 'string' && /^[A-Z]{3}$/.test(v);
  for (const k of ['ISO_A3', 'ISO_A3_EH', 'ADM0_A3', 'ADM0_ISO', 'SOV_A3']) {
    if (ok(props[k])) return props[k];
  }
  return 'UNK';
}

/** Clip + project all rings of a feature. Returns [{outer:boolean, pts}] in px. */
function prepareFeature(feature) {
  const rings = [];
  for (const poly of polygonsOf(feature.geometry)) {
    poly.forEach((ring, i) => {
      const clipped = clipRing(ring);
      if (clipped.length < 3) return;
      rings.push({ outer: i === 0, pts: clipped.map(([lon, lat]) => project(lon, lat)) });
    });
  }
  return rings;
}

function buildCountry(prepared, tol) {
  const out = [];
  for (const { outer, pts } of prepared) {
    let ring = dedupeRounded(simplifyRing(pts, tol));
    if (ring.length + 1 < MIN_RING_POINTS) continue; // +1 = closing point
    const area = signedArea(ring);
    if (Math.abs(area) < MIN_RING_AREA) continue;
    if ((outer && area < 0) || (!outer && area > 0)) ring = ring.reverse();
    out.push(ring);
  }
  return out;
}

function pathLine(iso, rings) {
  const cls = ['land', CLASS_BY_ISO[iso]].filter(Boolean).join(' ');
  return `<path class="${cls}" data-iso="${iso}" d="${rings.map(ringToPath).join('')}"/>`;
}

// ---------------------------------------------------------------------------
// Route helpers
// ---------------------------------------------------------------------------

/** Catmull–Rom (tension τ) → cubic Bézier: cp1 = P1 + τ·(P2−P0)/3, cp2 = P2 − τ·(P3−P1)/3. */
function catmullRomToBezier(pts, tension = CATMULL_ROM_TENSION) {
  const k = tension / 3;
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    segs.push({
      p0: p1,
      c1: [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k],
      c2: [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k],
      p1: p2,
    });
  }
  return segs;
}

function bezierPathD(segs) {
  let d = `M${fmt1(segs[0].p0[0])} ${fmt1(segs[0].p0[1])}`;
  for (const s of segs) {
    d += `C${[s.c1, s.c2, s.p1].map(([x, y]) => `${fmt1(x)} ${fmt1(y)}`).join(' ')}`;
  }
  return d;
}

function bezierPoint(s, t) {
  const mt = 1 - t;
  const a = mt * mt * mt, b = 3 * mt * mt * t, c = 3 * mt * t * t, d = t * t * t;
  return [
    a * s.p0[0] + b * s.c1[0] + c * s.c2[0] + d * s.p1[0],
    a * s.p0[1] + b * s.c1[1] + c * s.c2[1] + d * s.p1[1],
  ];
}

/** Approximate spline length by sampling `samples` points evenly in parameter space. */
function splineLength(segs, samples = 200) {
  let len = 0, prev = null;
  for (let i = 0; i < samples; i++) {
    const u = (i / (samples - 1)) * segs.length;
    const si = Math.min(Math.floor(u), segs.length - 1);
    const p = bezierPoint(segs[si], u - si);
    if (prev) len += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    prev = p;
  }
  return len;
}

function polylineD(pts) {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${fmt1(x)} ${fmt1(y)}`).join('');
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

function fmtBytes(n) {
  return n >= 1024 ? `${(n / 1024).toFixed(1)} KB` : `${n} B`;
}

function gzipSize(str) {
  return zlib.gzipSync(Buffer.from(str, 'utf8'), { level: 9 }).length;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { json, name: sourceName, url: sourceUrl } = await loadGeoJSON();

  // 1. Select features intersecting the box.
  const selected = [];
  for (const f of json.features) {
    const [minX, minY, maxX, maxY] = featureBbox(f.geometry);
    if (maxX < BOX.lonMin || minX > BOX.lonMax || maxY < BOX.latMin || minY > BOX.latMax) continue;
    const prepared = prepareFeature(f);
    if (!prepared.length) continue;
    const props = f.properties || {};
    selected.push({
      iso: isoOf(props),
      name: props.NAME_EN || props.NAME || props.ADMIN || 'unknown',
      prepared,
      sourcePoints: prepared.reduce((s, r) => s + r.pts.length, 0),
    });
  }
  selected.sort((a, b) => a.iso.localeCompare(b.iso));
  console.log(`✓ ${selected.length} countries intersect the box: ${selected.map((c) => c.iso).join(' ')}`);

  // 2. Simplify + serialise, raising tolerance until the budget fits.
  let tolerance = toleranceArg ?? TOLERANCE_START;
  let result;
  for (;;) {
    const countries = selected
      .map((c) => ({ ...c, rings: buildCountry(c.prepared, tolerance) }))
      .filter((c) => c.rings.length);
    const lines = countries.map((c) => pathLine(c.iso, c.rings));
    const text = lines.join('\n') + '\n';
    const raw = Buffer.byteLength(text, 'utf8');
    const gz = gzipSize(text);
    result = { tolerance, countries, text, raw, gz };
    console.log(`  tol ${tolerance.toFixed(1)} px → ${fmtBytes(raw)} raw / ${fmtBytes(gz)} gzip, ${countries.reduce((s, c) => s + c.rings.length, 0)} rings, ${countries.reduce((s, c) => s + c.rings.reduce((t, r) => t + r.length, 0), 0)} points`);
    if (toleranceArg != null) break;
    if ((raw <= MAX_RAW_BYTES && gz <= MAX_GZIP_BYTES) || tolerance + TOLERANCE_STEP > TOLERANCE_MAX + 1e-9) break;
    tolerance = Math.round((tolerance + TOLERANCE_STEP) * 10) / 10;
  }
  if (result.raw > MAX_RAW_BYTES || result.gz > MAX_GZIP_BYTES) {
    console.warn(`! size budget not met (${fmtBytes(result.raw)} raw / ${fmtBytes(result.gz)} gzip) even at ${result.tolerance} px`);
  }

  // 3. Cities.
  const cities = {};
  let maxDev = 0;
  for (const [cityName, [lon, lat, tx, ty]] of Object.entries(CITIES)) {
    const [x, y] = project(lon, lat);
    const entry = { lon, lat, x: r1(x), y: r1(y) };
    if (tx != null) {
      entry.target = [tx, ty];
      entry.deviationPx = r1(Math.hypot(x - tx, y - ty));
      maxDev = Math.max(maxDev, entry.deviationPx);
    }
    cities[cityName] = entry;
  }
  console.log(`✓ reference cities: max deviation from spec targets ${maxDev.toFixed(1)} px`);
  if (maxDev > 15) throw new Error('Projection does not match the reference cities (> 15 px) — adjust constants.');

  const px = (n) => [cities[n].x, cities[n].y];
  const routeSegs = catmullRomToBezier(ROUTE.map(px));
  const railSegs = catmullRomToBezier(RAIL.map(px));
  const [ga, gb] = AIR.map(px);
  const airCtrl = [(ga[0] + gb[0]) / 2, (ga[1] + gb[1]) / 2 - AIR_LIFT_PX];
  const airD = `M${fmt1(ga[0])} ${fmt1(ga[1])}Q${fmt1(airCtrl[0])} ${fmt1(airCtrl[1])} ${fmt1(gb[0])} ${fmt1(gb[1])}`;

  const meta = {
    generatedBy: 'scripts/build-map.mjs',
    source: {
      dataset: sourceName,
      url: sourceUrl,
      license: 'Natural Earth — public domain',
    },
    viewBox: `0 0 ${VIEW.w} ${VIEW.h}`,
    clipBox: { ...BOX },
    projection: {
      type: 'Web Mercator (spherical), scaled to the viewBox',
      formula: 'x = (lon − 60) × 24.62 ; y = (mercY(50) − mercY(lat)) × 24.62 ; mercY(lat) = ln(tan(π/4 + lat·π/360)) × 180/π',
      js: 'const mercY=l=>Math.log(Math.tan(Math.PI/4+l*Math.PI/360))*180/Math.PI; const project=(lon,lat)=>[(lon-60)*24.62,(mercY(50)-mercY(lat))*24.62];',
      scalePxPerDegree: K,
      lon0: LON0,
      lat0: LAT0,
      mercY0: Number(MERC_Y0.toFixed(6)),
      referenceMaxDeviationPx: maxDev,
      clipBoxPx: {
        left: r1(project(BOX.lonMin, BOX.latMax)[0]),
        right: r1(project(BOX.lonMax, BOX.latMax)[0]),
        top: r1(project(BOX.lonMin, BOX.latMax)[1]),
        bottom: r1(project(BOX.lonMin, BOX.latMin)[1]),
      },
    },
    simplification: {
      algorithm: 'Douglas–Peucker per ring, output-space tolerance',
      tolerancePx: result.tolerance,
      minRingPoints: MIN_RING_POINTS,
      minRingAreaPx2: MIN_RING_AREA,
      coordinateDecimals: 1,
    },
    cities,
    routes: {
      route: { cities: ROUTE, d: bezierPathD(routeSegs), lengthPx: r1(splineLength(routeSegs, 200)) },
      rail: { cities: RAIL, d: bezierPathD(railSegs), lengthPx: r1(splineLength(railSegs, 200)) },
      air: { cities: AIR, d: airD, controlPoint: airCtrl.map(r1), liftPx: AIR_LIFT_PX },
      kg: { cities: KG_CORRIDOR, d: polylineD(KG_CORRIDOR.map(px)) },
      curve: `Catmull–Rom → cubic Bézier, tension ${CATMULL_ROM_TENSION} (cp1 = P1 + τ(P2−P0)/3, cp2 = P2 − τ(P3−P1)/3)`,
    },
    // Flat aliases requested by the spec.
    routeD: bezierPathD(routeSegs),
    routeLengthPx: r1(splineLength(routeSegs, 200)),
    railD: bezierPathD(railSegs),
    airD,
    kgD: polylineD(KG_CORRIDOR.map(px)),
    countries: result.countries.map((c) => ({
      iso: c.iso,
      name: c.name,
      class: ['land', CLASS_BY_ISO[c.iso]].filter(Boolean).join(' '),
      rings: c.rings.length,
      points: c.rings.reduce((s, r) => s + r.length, 0),
      sourcePoints: c.sourcePoints,
    })),
    sizes: {
      pathsFile: path.relative(ROOT, OUT_PATHS),
      bytes: result.raw,
      gzipBytes: result.gz,
      budgetBytes: MAX_RAW_BYTES,
      budgetGzipBytes: MAX_GZIP_BYTES,
    },
  };

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_PATHS, result.text);
  await fs.writeFile(OUT_META, JSON.stringify(meta, null, 2) + '\n');
  console.log(`✓ wrote ${path.relative(ROOT, OUT_PATHS)} (${fmtBytes(result.raw)} raw, ${fmtBytes(result.gz)} gzip, tolerance ${result.tolerance} px)`);
  console.log(`✓ wrote ${path.relative(ROOT, OUT_META)}`);

  if (previewPath) await renderPreview(result.text, meta, previewPath);
}

// ---------------------------------------------------------------------------
// Preview (optional, uses the project's sharp)
// ---------------------------------------------------------------------------

async function renderPreview(pathsText, meta, outPng) {
  const { default: sharp } = await import('sharp');
  const c = meta.cities;
  const dots = Object.entries(c)
    .map(([n, p]) => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#c41216"/><text x="${p.x + 8}" y="${p.y - 6}" font-size="14" font-family="sans-serif" fill="#f2f2f2">${n.replace("'", '&#39;')}</text>`)
    .join('');
  const routePoly = ROUTE.map((n) => `${c[n].x},${c[n].y}`).join(' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW.w} ${VIEW.h}" width="${VIEW.w}" height="${VIEW.h}">
<style>
.land{fill:#1c1c1f;stroke:#2c2c30;stroke-width:.6}
.land-cn{fill:#232327}
.land-uz{fill:#2a2224}
</style>
<rect width="${VIEW.w}" height="${VIEW.h}" fill="#0b0b0d"/>
${pathsText}
<path d="${meta.routeD}" fill="none" stroke="#ffb400" stroke-width="1.5" stroke-dasharray="6 4"/>
<path d="${meta.railD}" fill="none" stroke="#2e9df7" stroke-width="1.2" stroke-dasharray="2 4"/>
<path d="${meta.airD}" fill="none" stroke="#7a7a7a" stroke-width="1" stroke-dasharray="4 4"/>
<path d="${meta.kgD}" fill="none" stroke="#3ccf6a" stroke-width="1.2"/>
<polyline points="${routePoly}" fill="none" stroke="#c41216" stroke-width="2"/>
${dots}
</svg>`;
  await fs.mkdir(path.dirname(outPng), { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(outPng);
  console.log(`✓ preview written to ${outPng}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
