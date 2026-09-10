/**
 * Journey client module — imported by Journey.astro once the section is within 100 % rootMargin; init() runs only
 * when the main thread is idle (requestIdleCallback, 1.5 s timeout). Setup is split over frames so no single task
 * is long: (1) element lookup, route sampling, initial states → (2) rAF: timeline build → (3) rAF: the pin
 * trigger (a pin queues ScrollTrigger's own full refresh for the next frame) → (5) rAF: the scrub trigger, so it is
 * refreshed exactly once → (6) rAF: prime() renders the timeline end to end once, so no tween can initialise
 * (and force a layout) mid-scrub. GSAP core + ScrollTrigger + MotionPathPlugin only.
 *
 * One gsap.timeline (0–100 "percent" units) driven by two ScrollTriggers over the same range — one pins the stage
 * (anticipatePin 1), one scrubs the timeline (scrub 0.4, invalidateOnRefresh). They are separate on purpose: a pin
 * trigger that also owns an animation renders the whole timeline to its end and back on every refresh (to check
 * whether the animation moves the pinned element), which is the single most expensive task on a slow phone.
 * start "top top", end = 4 × stage height (3.5 on mobile) — the CSS reserve in Journey.astro must match. Stage labels:
 *   s0 intro 0–8 · s1 Yiwu warehouse 8–22 · s2 loading 22–34 · s3 transit 34–60 · s4 Khorgos 60–72 ·
 *   s5 Tashkent warehouse 72–88 · s6 delivered + CTA 88–100.
 * The pin uses pinType "transform": the default fixed pin drops the stage out of flow on pin and unpin, and the
 * browser scores each flip as a full-viewport layout shift. The dark header state is owned by Header.astro's
 * IntersectionObserver over every .dark section, so it holds here even when this module never loads.
 * Camera = the HTML .cam wrapper, transform only (translate + scale). The vehicle <g> lives inside the SVG and
 * is driven along #route by MotionPathPlugin in lockstep with the route's stroke-dashoffset (pathLength="1").
 * Only transform / opacity / stroke-dashoffset (+ two stroke-widths per camera move) are animated. will-change is set on .cam and .journey-stage while
 * pinned only. There is no SVG mask and no <pattern> inside the camera: both are re-rasterized on every frame of a
 * scale tween, and together they were 84 % of the raster cost of the whole scrub.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

const MAP = { w: 1600, h: 923 };
/** Bounding box (map units) the intro frames: Tashkent … Yiwu with breathing room. x0 100 = lon 64.1E, which cut
 *  the western 40 % of Uzbekistan; x1 1650 was 50 units past the map's own east edge. */
const ROUTE_BOX = { x0: -110, y0: 130, x1: 1580, y1: 800 };
/** Timeline labels (percent). Sub-labels s3b/s3c switch the mode chips. */
const L = { s0: 0, s1: 8, s2: 22, s3: 34, s3b: 43, s3c: 52, s4: 60, s5: 72, s6: 88, end: 100 } as const;
const STAGE_START = [L.s1, L.s2, L.s3, L.s4, L.s5, L.s6];
/** Card i enters at stage start + 2.5 over 3 units (stage 1: +1); rail/chip jumps land after that, on a settled frame. */
const SETTLED = 6;
/** Route nodes (map units) used to find their progress along #route. */
const NODE = { khorgos: [502.7, 209.7], yiwu: [1478.9, 670.4] } as const;
/** How far short of Khorgos the truck waits, as a fraction of the route (1 ≈ 1 420 map units): it has to
 *  stop clear of the boom, and the phone draws the truck 1.6× wide, so 0.038 left its bumper 4 units — five
 *  pixels — from the post. [approach, stop] per breakpoint. */
const WAIT = { desktop: [0.045, 0.038], mobile: [0.062, 0.055] } as const;
/** Yiwu shed + parcel choreography (map units) — must match RouteMap.astro `A`. Shed sits on land SW of the city dot. */
const YIWU = { shed: [1450, 706], shedMobile: [1436, 716], parcelsFrom: [[1404, 732], [1420, 744], [1392, 722], [1432, 752]] } as const;
/** Tashkent delivery choreography (map units) — on the city, not beside it: at 24.615 map units per degree of
 *  longitude the old pin at x 122 was 361 km west of Tashkent, out in the Kyzylkum. GSAP x/y on SVG groups are absolute (they replace the transform attribute). */
const TASH = { shed: [242, 294], unload: [242, 286], van: { from: [238, 312], to: [208, 326] }, pin: [182, 336] } as const;
/** The phone draws every glyph at 1.6×, so the van is 42 map units wide and the pin 29 against a 26-unit gap:
 *  at the desktop anchors they overlapped, and the "Toshkent" label printed through the van's roof. The phone
 *  spreads the same three actors — warehouse, van, door — over 60 units instead of 34. */
const TASH_M = { van: [212, 332] as const, pin: [168, 356] as const };

interface CamTarget { x: number; y: number; k: number; fx?: number; fy?: number }
/** Camera targets per stage (index 1–6); k is relative to the "whole map fits" scale. */
/* Each target was checked against the frame it produces, in map units, not by eye:
 *   1–2 Yiwu    fx .54 pulls the subject off the middle of an empty ocean AND clears the city's own
 *                label, "Ivu · 义乌", which at .58 was printed under the left edge of the caption card
 *   3   transit k .98 is the whole corridor — the km counter now runs over a picture that contains
 *                both Uzbekistan and China, instead of China and Mongolia
 *   4   Khorgos x 600, not 512: at 512 the Tashkent warehouse and the right-hand half-mark were sliced
 *                in half by the left edge of the frame, 700 km from anything the card is talking about
 *   5   Tashkent fy .34 lifts the drawn route above the card, which used to hide a third of it
 *   6   delivered nothing but steppe under the card */
const CAMS = {
  desktop: [
    null,
    { x: 1420, y: 662, k: 1.7, fx: 0.54, fy: 0.5 },
    { x: 1398, y: 646, k: 1.7, fx: 0.54, fy: 0.5 },
    { x: 720, y: 420, k: 0.98, fx: 0.5, fy: 0.5 },
    { x: 600, y: 214, k: 2.4, fx: 0.42, fy: 0.3 },
    { x: 250, y: 300, k: 1.9, fx: 0.42, fy: 0.34 },
    { x: 228, y: 307, k: 2.3, fx: 0.42, fy: 0.42 },
  ] as Array<CamTarget | null>,
  /* The phone's map band is 390 px wide and ~385 px tall, and s0 is bound by the width (0.244 px per map
   * unit against the desktop's 0.9). A mobile k therefore buys 3.5× less magnification than the same number
   * on a desktop, and the old set left every actor a blob: the transit truck was 6.7 px across and the whole
   * map covered 56 % of the band's height, so the section read as a letterboxed strip in flat sea. Each k
   * below is set from a measured on-screen size — glyph ≥ 20 px, land ≥ 85 % of the band. */
  mobile: [
    null,
    { x: 1430, y: 668, k: 2.9, fx: 0.62, fy: 0.32 },
    { x: 1412, y: 656, k: 2.9, fx: 0.62, fy: 0.32 },
    { x: 680, y: 430, k: 1.3, fx: 0.5, fy: 0.3 },
    { x: 530, y: 236, k: 4.5, fx: 0.5, fy: 0.3 },
    { x: 250, y: 306, k: 3.0, fx: 0.5, fy: 0.32 },
    { x: 210, y: 322, k: 3.8, fx: 0.5, fy: 0.36 },
  ] as Array<CamTarget | null>,
};

/** On-screen stroke weight (CSS px) of the two dashed paths, held constant by camMove; see the note there. */
const W_ROUTE = 2.5, W_RAIL = 1, W_LAST = 1.75;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function init(root: HTMLElement): void {
  const $ = <T extends Element = HTMLElement>(name: string) => root.querySelector<T>(`[data-j="${name}"]`);
  const $$ = <T extends Element = HTMLElement>(name: string) => Array.from(root.querySelectorAll<T>(`[data-j="${name}"]`));

  const stage = $('stage');
  const mapEl = $('map');
  const cam = $('cam');
  const svg = $<SVGSVGElement>('svg');
  const base = $<SVGGElement>('base');
  const route = $<SVGPathElement>('route');
  const railMask = $<SVGPathElement>('rail-mask');
  const lastMile = $<SVGPathElement>('last');
  const air = svg?.querySelector<SVGPathElement>('#j-air') ?? null;
  const eyebrow = $('eyebrow');
  const title = $('title');
  const sub = $('sub');
  const cardsWrap = $('cards');
  const cards = $$('card');
  const ticks = $$('tick');
  const railBtns = $$<HTMLButtonElement>('rail-btn');
  const chips = $$<HTMLButtonElement>('chip');
  const kmEl = $('km');
  const kmCap = $('kmcap');
  const vehicle = $<SVGGElement>('vehicle');
  const plane = $<SVGGElement>('plane');
  const parcels = $$<SVGGElement>('parcel');
  const container = $<SVGGElement>('container');
  const barrier = $<SVGGElement>('barrier');
  const bar = $<SVGUseElement>('bar');
  const stamp = $<SVGGElement>('stamp');
  const pin = $<SVGGElement>('pin');
  const van = $<SVGGElement>('van');
  const shedYiwu = $<SVGGElement>('shed-yiwu');
  const markL = $<SVGPathElement>('mark-l');
  const markR = $<SVGPathElement>('mark-r');
  const labels = $$<SVGTextElement>('label');
  const countries = Array.from(root.querySelectorAll<SVGTextElement>('[data-j2="country"]'));
  const inners = $$<SVGGElement>('inner');
  const mapMarks = svg ? Array.from(svg.querySelectorAll<SVGUseElement>('.j-mark')) : [];
  /** secondary geometry + minor place names: they recede at the last stage instead of the whole map going dark */
  const noise = svg ? Array.from(svg.querySelectorAll<SVGElement>('.jm-secondary, .jm-minor:not(.jm-faint)')) : [];

  if (!stage || !mapEl || !cam || !svg || !base || !route || !railMask || !air || !title || !sub || !cardsWrap || cards.length !== 6 || !kmEl || !vehicle || !plane || !container || !bar || !stamp || !pin || !van) {
    root.classList.remove('is-live');
    return;
  }
  const vehicleInner = vehicle.querySelector<SVGGElement>('[data-j="inner"]');
  const lang = root.dataset.lang ?? 'uz';
  const KM = Number(root.dataset.km) || 5000;
  const verified = root.dataset.kmVerified === '1';
  const fmtKm = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' ') + (v >= KM && !verified ? '+' : '');
  const capFor = (i: number) => chips[i]?.dataset.cap ?? '';

  /** Progress (0–1) along #route of the point nearest to (x, y): a coarse 1/120 scan refined to 1/600 (≈130 samples). */
  const progressAt = (x: number, y: number) => {
    const len = route.getTotalLength();
    const d2 = (u: number) => { const p = route.getPointAtLength(len * u); return (p.x - x) ** 2 + (p.y - y) ** 2; };
    const scan = (from: number, to: number, steps: number) => {
      let best = from, bd = Infinity;
      for (let i = 0; i <= steps; i++) { const u = from + ((to - from) * i) / steps; const d = d2(u); if (d < bd) { bd = d; best = u; } }
      return best;
    };
    const coarse = scan(0, 1, 120);
    return scan(Math.max(0, coarse - 1 / 120), Math.min(1, coarse + 1 / 120), 10);
  };
  const P_KHORGOS = progressAt(NODE.khorgos[0], NODE.khorgos[1]);
  /** where the route leaves the caption card's screen band at the transit framing (map x ≈ 985) */
  const P_OPEN = progressAt(985, 420);

  /** Layout reads live here and nowhere else. camFor()/introCam() used to call clientWidth/clientHeight and two
   *  getBoundingClientRect()s as GSAP function-based values, i.e. mid-tick: 364 forced layouts per scrub. */
  let M = { W: 1, H: 1, s0: 1, offX: 0, offY: 0, free: 0 };
  const measure = (desktop: boolean) => {
    const W = mapEl.clientWidth || 1, H = mapEl.clientHeight || 1;
    const s0 = Math.min(W / MAP.w, H / MAP.h);
    const free = desktop ? cardsWrap.getBoundingClientRect().left - mapEl.getBoundingClientRect().left : 0;
    M = { W, H, s0, offX: (W - MAP.w * s0) / 2, offY: (H - MAP.h * s0) / 2, free };
    svg.style.setProperty('--lbl', `${(12 / s0).toFixed(2)}px`);
  };

  const mm = gsap.matchMedia();
  mm.add({ isDesktop: '(min-width: 900px)', isMobile: '(max-width: 899px)', reduceMotion: '(prefers-reduced-motion: reduce)' }, (ctx) => {
    const cond = (ctx.conditions ?? {}) as Record<string, boolean>;
    if (cond.reduceMotion) { root.classList.remove('is-live'); root.dataset.stage = '0'; return; }
    root.classList.add('is-live');
    const desktop = !!cond.isDesktop;
    const cams = desktop ? CAMS.desktop : CAMS.mobile;
    // A camera k gives the same map window at every width (s0 is bound by the width, so the visible span is
    // 1600 / k map units regardless of viewport) — what changes is how many pixels that window is drawn in.
    // A flat 1.6 was therefore tuned for a 390 px phone and applied unchanged to a 768 px tablet, where the
    // same glyphs come out 52 px across and printed through the city labels. Scale by how far the viewport
    // is from that phone instead, and a tablet simply gets the desktop glyph.
    let glyphScale = 1;
    const shedPos = desktop ? YIWU.shed : YIWU.shedMobile;
    const wait = desktop ? WAIT.desktop : WAIT.mobile;
    /** where the parcels gather in front of the shed door */
    const hold = [shedPos[0] - 2, shedPos[1] - 6] as const;


    /* ---------- camera maths (pure arithmetic over M — no DOM reads) ---------- */
    const introCam = (): CamTarget => {
      const bw = (ROUTE_BOX.x1 - ROUTE_BOX.x0) * M.s0, bh = (ROUTE_BOX.y1 - ROUTE_BOX.y0) * M.s0;
      // no width overshoot on mobile: it clipped both ends of the story to keep the band tall. The taller
      // frame is bought back with availH instead (the phone's map band is only ~384 px anyway).
      const availW = M.W - (desktop ? 64 : 0), availH = M.H * (desktop ? 0.66 : 0.44);
      const k = clamp(Math.min(availW / bw, availH / bh), 0.9, desktop ? 1.3 : 1.45);
      return { x: (ROUTE_BOX.x0 + ROUTE_BOX.x1) / 2, y: (ROUTE_BOX.y0 + ROUTE_BOX.y1) / 2 + 20, k, fx: desktop ? 0.5 : 0.55, fy: desktop ? 0.52 : 0.4 };
    };
    const stageCam = (i: number) => (): CamTarget => cams[i] as CamTarget;
    /** Translate/scale for .cam (transform-origin 0 0) so that map point (x, y) lands on the focal point. */
    const camFor = (t: CamTarget) => {
      let fx: number;
      if (t.fx !== undefined) fx = M.W * t.fx;
      else if (desktop) fx = clamp(M.free, M.W * 0.4, M.W) * 0.5;
      else fx = M.W * 0.5;
      const fy = M.H * (t.fy ?? (desktop ? 0.5 : 0.3));
      return { x: fx - t.k * (M.offX + t.x * M.s0), y: fy - t.k * (M.offY + t.y * M.s0), scale: t.k };
    };

    /* ---------- initial states (frame 1, cheap) ---------- */
    measure(desktop);
    if (!desktop) glyphScale = clamp((390 / M.W) * 1.6, 1, 1.6);
    gsap.set(labels, { transformOrigin: (_i: number, el: SVGTextElement) => el.dataset.o || '0% 100%' });
    // a country name is ~50 map units tall on a phone against ~13 on desktop, so it needs its own anchors
    if (!desktop) countries.forEach((el) => { if (el.dataset.mx) el.setAttribute('x', el.dataset.mx); if (el.dataset.my) el.setAttribute('y', el.dataset.my); });
    if (glyphScale !== 1) {
      gsap.set(inners, { scale: glyphScale, transformOrigin: (_i: number, el: SVGGElement) => { const p = el.parentElement; return p && (p.classList.contains('j-shed') || p.classList.contains('j-pin')) ? '50% 100%' : '50% 50%'; } });
    }
    const vanTo = desktop ? TASH.van.to : TASH_M.van;
    const pinAt = desktop ? TASH.pin : TASH_M.pin;
    gsap.set(pin, { x: pinAt[0], y: pinAt[1] });
    // the markup carries the desktop last mile; the phone's van and door sit further out
    if (lastMile && !desktop) lastMile.setAttribute('d', `M229 307 L${vanTo[0]} ${vanTo[1]} L${pinAt[0] + 3} ${pinAt[1] - 1}`);
    if (shedYiwu) gsap.set(shedYiwu, { x: shedPos[0], y: shedPos[1] });
    // mobile: the sheet and card 01 are in place from the first frame — the headline reads above the map band
    if (!desktop) gsap.set(cards[0], { autoAlpha: 1, y: 0 });
    kmEl.textContent = fmtKm(0);
    const kmProxy = { v: 0 };

    let tl: gsap.core.Timeline | null = null;
    let pinST: ScrollTrigger | null = null;
    let raf = 0, praf = 0;

    /* ---------- state sync: progress rail, section data-stage, mode chips + km caption ---------- */
    let curStage = -1, curChip = -1;
    const sync = (t: number) => {
      let st = 0;
      for (let i = 0; i < STAGE_START.length; i++) if (t >= STAGE_START[i] - 0.001) st = i + 1;
      if (st !== curStage) {
        curStage = st;
        root.dataset.stage = String(st);
        railBtns.forEach((b, i) => {
          const n = i + 1;
          b.dataset.done = n < st ? '1' : '0';
          if (n === st) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        });
      }
      const chip = t >= L.s3c ? 2 : t >= L.s3b ? 1 : 0;
      if (chip !== curChip) {
        curChip = chip;
        chips.forEach((c, i) => c.setAttribute('aria-pressed', String(i === chip)));
        if (kmCap) kmCap.textContent = capFor(chip);
      }
    };

    /* ---------- frame 2: timeline (paused until the scrub trigger takes it over) ----------
     * immediateRender is off by default: every from-state below equals the CSS stage-0 state (Journey.astro), so
     * tweens init lazily when the playhead first reaches them instead of all ~45 re-rendering on each refresh.
     * Only the intro camera (the map must be framed at frame 0) and the card-06 half-marks opt in. */
    const build = () => {
      const t = gsap.timeline({ defaults: { ease: 'none', immediateRender: false }, paused: true, onUpdate: () => sync(t.time()) });
      tl = t;
      Object.entries(L).forEach(([k, v]) => t.addLabel(k, v));
      t.set({}, {}, L.end); // pins the duration at exactly 100

      const camMove = (from: () => CamTarget, to: () => CamTarget, at: number, dur: number, first = false) => {
        const ease = 'power2.inOut';
        t.fromTo(cam,
          { x: () => camFor(from()).x, y: () => camFor(from()).y, scale: () => camFor(from()).scale },
          { x: () => camFor(to()).x, y: () => camFor(to()).y, scale: () => camFor(to()).scale, force3D: true, ease, duration: dur, immediateRender: first }, at);
        if (labels.length) t.fromTo(labels, { scale: () => 1 / from().k }, { scale: () => 1 / to().k, ease, duration: dur, immediateRender: first }, at);
        // The route and the rail are the only two strokes that are DASHED, and a dashed stroke cannot also
        // carry vector-effect: non-scaling-stroke — Chromium then measures the dash along its own screen-space
        // flattening of the path, ~11 % short of getTotalLength(), so stroke-dashoffset 1 − p draws to 1.11 p.
        // Measured on this route: asked .3 → drew .3375, asked .5 → .56, asked .7 → .78, at every zoom. The red
        // line was a tenth of the corridor ahead of the truck: already inside Kazakhstan while the truck queued
        // at Khorgos, already at Tashkent while it was still crossing the steppe. The vector-effect is gone
        // (Journey.astro) and the constant on-screen weight is bought back here, in the tween that already
        // counter-scales the labels — two numbers per camera move, no per-frame work of its own.
        // autoRound: false is not optional here — GSAP rounds numeric CSS properties to integers by default,
        // and the rail's own width is 1 / (2.4 × 0.9) = 0.46 user units at the Khorgos zoom, which rounds to 0
        // and deletes the line. The route would step 2 → 3 → 1 user units and visibly change weight per stage.
        const wid = (el: SVGPathElement, px: number) => t.fromTo(el,
          { strokeWidth: () => px / (from().k * M.s0) },
          { strokeWidth: () => px / (to().k * M.s0), ease, duration: dur, autoRound: false, immediateRender: first }, at);
        wid(route, W_ROUTE);
        wid(railMask, W_RAIL);
        if (lastMile) wid(lastMile, W_LAST);
      };
      const enter = (i: number, at: number) => t.fromTo(cards[i], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 3, ease: 'power2.out' }, at);
      const exit = (i: number, at: number) => t.fromTo(cards[i], { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -16, duration: 2.5, ease: 'power2.in', immediateRender: false }, at);
      const tick = (i: number, at: number) => { if (ticks[i]) t.fromTo(ticks[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5 }, at); };
      const mp = (start: number, end: number) => ({ path: route, align: route, alignOrigin: [0.5, 0.5] as [number, number], autoRotate: 180, start, end });
      const drive = (from: number, to: number, at: number, dur: number, ease = 'none') => {
        t.to(vehicle, { motionPath: mp(from, to), ease, duration: dur }, at);
        t.fromTo(route, { strokeDashoffset: 1 - from }, { strokeDashoffset: 1 - to, ease, duration: dur, autoRound: false }, at);
      };

      // s0 → s1: headline out, camera to Yiwu, card 1 (desktop; mobile shows it from frame 0), parcels into the shed, container forms
      // the eyebrow goes with the headline: otherwise one orphan word holds an empty quadrant for 82 % of the pin
      t.fromTo(eyebrow ? [title, sub, eyebrow] : [title, sub], { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -16, duration: 4, ease: 'power1.in' }, 4);
      camMove(introCam, stageCam(1), L.s1, 6, true);
      if (desktop) enter(0, L.s1 + 1);
      if (parcels.length) {
        t.fromTo(parcels, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5, stagger: 0.4 }, 10);
        t.fromTo(parcels, { x: (i: number) => YIWU.parcelsFrom[i][0], y: (i: number) => YIWU.parcelsFrom[i][1] },
          { x: (i: number) => hold[0] + (i % 2 ? 3 : -3), y: (i: number) => hold[1] + (i < 2 ? 0 : -4), duration: 5, stagger: 1, ease: 'power2.inOut', immediateRender: false }, 11);
        t.fromTo(parcels, { autoAlpha: 1 }, { autoAlpha: 0, duration: 1.5, immediateRender: false }, 18.5);
      }
      // x/y are repeated on the `to` side on purpose — see the note on the stage-5 unload tween below.
      t.fromTo(container, { autoAlpha: 0, scale: 0.8, x: hold[0], y: hold[1] - 4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, x: hold[0], y: hold[1] - 4, duration: 2 }, 19);
      tick(0, L.s2 - 2.5);

      // s2: loading — container hops onto the capsule, vehicle appears and departs
      exit(0, L.s2);
      enter(1, L.s2 + 2.5);
      camMove(stageCam(1), stageCam(2), L.s2, 4);
      t.fromTo(container, { x: hold[0], y: hold[1] - 4 }, { x: NODE.yiwu[0], y: NODE.yiwu[1] - 6, duration: 3, ease: 'power2.inOut', immediateRender: false }, 23);
      t.fromTo(vehicle, { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, 25);
      t.fromTo(container, { autoAlpha: 1 }, { autoAlpha: 0, duration: 1.5, immediateRender: false }, 25);
      drive(0, 0.1, 26, L.s3 - 26);
      tick(1, L.s3 - 2.5);

      // s3: transit — long leg to the border, rail twin draws, plane flies the arc, km counter
      exit(1, L.s3);
      enter(2, L.s3 + 2.5);
      camMove(stageCam(2), stageCam(3), L.s3, 6);
      // The caption card sits over map x 992…1400 at the transit framing, which is the first sixth of this
      // leg. Linear, the truck spent 11 of the stage's 26 units invisible behind it; this clears it in 3.
      if (desktop) { drive(0.1, P_OPEN, L.s3, 3); drive(P_OPEN, P_KHORGOS - wait[0], L.s3 + 3, L.s4 - L.s3 - 3); }
      else drive(0.1, P_KHORGOS - wait[0], L.s3, L.s4 - L.s3);
      t.fromTo(railMask, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 24, autoRound: false }, L.s3);
      t.to(plane, { motionPath: { path: air, align: air, alignOrigin: [0.5, 0.5], autoRotate: 180, start: 0, end: 1 }, duration: 50 }, L.s3);
      t.fromTo(plane, { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 2 }, L.s3);
      t.fromTo(plane, { autoAlpha: 0.5 }, { autoAlpha: 0, duration: 2, immediateRender: false }, 82);
      // textContent tears the text node down and rebuilds it every frame; nodeValue does not, and most frames
      // do not change the rounded number at all (measured: 1.47 → 0.91 ms of layout per frame on a slow phone)
      let kmLast = '';
      t.to(kmProxy, { v: KM, duration: 24, snap: { v: 1 }, onUpdate: () => {
        const str = fmtKm(kmProxy.v);
        if (str === kmLast) return;
        kmLast = str;
        if (kmEl.firstChild) kmEl.firstChild.nodeValue = str; else kmEl.textContent = str;
      } }, L.s3);
      tick(2, L.s4 - 2.5);

      // s4: Khorgos — the truck stops at the barrier, barrier lifts, stamp appears, truck resumes
      exit(2, L.s4);
      enter(3, L.s4 + 2.5);
      camMove(stageCam(3), stageCam(4), L.s4, 4);
      drive(P_KHORGOS - wait[0], P_KHORGOS - wait[1], L.s4, 3, 'power1.out');
      if (barrier) t.fromTo(barrier, { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, 61);
      // +60, not −60. The pivot is the boom's right-hand end and SVG y grows downward, so a negative
      // angle swung the free end DOWN through the road: the barrier closed on the truck instead of
      // lifting for it. (It was invisible before the .j-barrier group started fading in, so nobody saw it.)
      t.fromTo(bar, { rotation: 0, transformOrigin: '100% 50%' }, { rotation: 60, duration: 3, ease: 'power2.inOut' }, 63);
      t.fromTo(stamp, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 3, ease: 'power2.out' }, 64);
      drive(P_KHORGOS - wait[1], P_KHORGOS + 0.01, 70, 2, 'power1.in');
      tick(3, L.s5 - 2.5);

      // s5: Kazakhstan → Tashkent warehouse; capsule fades at the shed, container unloads
      // The border props belong to stage 4 only — fade them out so they do not float over Tashkent.
      t.to(barrier ? [barrier, stamp] : [bar, stamp], { autoAlpha: 0, duration: 2.5, immediateRender: false }, L.s5);
      exit(3, L.s5);
      enter(4, L.s5 + 2.5);
      camMove(stageCam(4), stageCam(5), L.s5, 5);
      drive(P_KHORGOS + 0.01, 1, L.s5, 12);
      // fade the capsule out as it lands (drive ends at 84), not after: three glyphs and the node label
      // otherwise share the same ~40px on a 390px screen
      if (vehicleInner) t.fromTo(vehicleInner, { autoAlpha: 1 }, { autoAlpha: 0, duration: 2, immediateRender: false }, 82.5);
      // Every property of a fromTo that the `to` side does not also carry is a one-shot: GSAP applies it when
      // the tween INITIALISES and never again. That makes such a tween order-dependent — the container's x is
      // 242 here and 1 478.9 in the stage-2 tween above, so whichever of the two initialised last wins. It
      // used to be safe by luck (a tween initialises when the playhead first reaches it, which is in timeline
      // order); prime() renders the whole timeline before the first scroll, which breaks that luck and left
      // the container unloading at Yiwu, 1 200 map units off screen. Repeating x and scale on the `to` side
      // makes the tween state its own end state, so it lands the same however it was reached.
      t.fromTo(container, { autoAlpha: 0, x: TASH.shed[0], y: TASH.unload[1] - 8, scale: 1 }, { autoAlpha: 1, x: TASH.shed[0], y: TASH.unload[1], scale: 1, duration: 2.5, ease: 'power2.out', immediateRender: false }, 84.5);
      tick(4, L.s6 - 2.5);

      // s6: delivered — camera settles on Tashkent, map dims, van drives to the door pin, marks lock, CTA
      exit(4, L.s6);
      enter(5, L.s6 + 2.5);
      camMove(stageCam(5), stageCam(6), L.s6, 5);
      // 0.4 took the map to 1.05:1 against the page — the payoff frame was a black rectangle. At 0.72 the
      // land still reads (ΔL* 15.6 above the sea) and the recessive half of the effect is carried by the
      // secondary lines and minor names dropping further back.
      t.fromTo(base, { opacity: 1 }, { opacity: 0.72, duration: 6 }, L.s6);
      if (noise.length) t.fromTo(noise, { opacity: 1 }, { opacity: 0.3, duration: 6 }, L.s6);
      if (mapMarks.length) t.fromTo(mapMarks, { autoAlpha: 0.7 }, { autoAlpha: 0, duration: 3 }, L.s6);
      t.fromTo(container, { autoAlpha: 1 }, { autoAlpha: 0, duration: 2, immediateRender: false }, 90);
      t.fromTo(pin, { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, 89);
      t.fromTo(van, { autoAlpha: 0, x: TASH.van.from[0], y: TASH.van.from[1] }, { autoAlpha: 1, x: TASH.van.from[0], y: TASH.van.from[1], duration: 1.5 }, 90);
      // The delivery leg draws under the van over the same 6 units the van drives, and lands on the door pin
      // exactly as the van stops. It is the courier's ROUTE, not its trail — it runs from the warehouse to the
      // address, which is further than the van itself travels (the van has to stop short: at 1.6× the phone's
      // van and pin are 35 map units of glyph between two anchors 47 apart). Hence the lighter 1.75 weight
      // against the trunk haul's 2.5. Only at rest does the reading matter, and at rest the line, the van and
      // the door read as one chain from China.
      if (lastMile) t.fromTo(lastMile, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 6, autoRound: false, immediateRender: false }, 91);
      // down and to the left, warehouse → door: x alone left the van level with the shed roof
      t.fromTo(van, { x: TASH.van.from[0], y: TASH.van.from[1] }, { x: vanTo[0], y: vanTo[1], duration: 6, ease: 'power2.inOut', immediateRender: false }, 91);
      if (markL && markR) {
        t.fromTo(markL, { x: -30, y: -18, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 3, ease: 'power2.out', immediateRender: true }, 92);
        t.fromTo(markR, { x: 30, y: 18, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 3, ease: 'power2.out', immediateRender: true }, 92);
      }
      tick(5, 97);
    };

    /* ---------- frames 3–5: scroll triggers, rail/chip jumps ---------- */
    const scrollToTime = (time: number) => {
      if (!pinST || !tl) return;
      const y = pinST.start + (pinST.end - pinST.start) * (time / tl.duration());
      window.scrollTo({ top: Math.round(y) + 1, left: 0, behavior: 'auto' });
    };
    const onRail = (e: Event) => { const i = railBtns.indexOf(e.currentTarget as HTMLButtonElement); if (i >= 0) scrollToTime(STAGE_START[i] + SETTLED); };
    const onChip = (e: Event) => { const i = chips.indexOf(e.currentTarget as HTMLButtonElement); if (i >= 0) scrollToTime([L.s3 + SETTLED, L.s3b + 1, L.s3c + 1][i]); };

    // 5.5/4.5 made the section 39.6 % of the whole page and 50 wheel notches long, with the transit beat alone
    // running 1.43 viewports for one card. 4.0/3.5 keeps 0.57 viewports per beat. Mirrored in Journey.astro's CSS reserve.
    const end = () => `+=${Math.round(stage.offsetHeight * (desktop ? 4 : 3.5))}`;
    const attachPin = () => {
      pinST = ScrollTrigger.create({
        trigger: root,
        pin: stage,
        pinSpacing: false,
        // The default 'fixed' pin flips the stage out of flow on every pin and unpin, and the browser
        // scores each flip as a full-viewport layout shift (measured CLS 3.2 mobile / 4.8 desktop).
        // 'transform' keeps the stage in flow and moves it with translate3d, which never shifts layout.
        pinType: 'transform',
        start: 'top top',
        end,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onToggle: (self) => {
          // the stage is what actually moves under pinType 'transform'; promoting it too is the single
          // biggest mobile win (16.6 % → 9.9 % of frames over 33 ms at 4x CPU throttle)
          cam.style.willChange = self.isActive ? 'transform' : '';
          stage.style.willChange = self.isActive ? 'transform' : '';
        },
        onRefresh: () => measure(desktop),
      });
    };
    const attachScrub = () => {
      if (!tl) return;
      // 0.8 left the animation still moving ~580 ms after the wheel stopped, which is most of what reads as
      // "not smooth". 0.4 halves that; below 0.3 a whole 100 px wheel notch lands in a single frame.
      // invalidateOnRefresh throws every recorded start/end value away, so a refresh un-primes the timeline
      // (see prime() below) — re-prime on the next idle frame. This matters in the wild even though the
      // measurement never saw it: init() asks for one more refresh when the fonts land, and that refresh
      // usually arrives AFTER the setup chain has primed.
      ScrollTrigger.create({ animation: tl, trigger: root, start: 'top top', end, scrub: 0.4, invalidateOnRefresh: true, onRefresh: queuePrime });
      sync(tl.time());
      railBtns.forEach((b) => b.addEventListener('click', onRail));
      chips.forEach((c) => c.addEventListener('click', onChip));
      root.dataset.ready = '1';
    };

    /* ---------- frame 6: prime every tween ----------
     * immediateRender: false keeps ScrollTrigger's refresh cheap, but it moves the cost, it does not remove
     * it: each tween then initialises the first time the playhead reaches it — i.e. DURING the scrub. A GSAP
     * init reads (getComputedStyle, getBBox, getBoundingClientRect for MotionPath's align matrix) in the
     * middle of a tick that has already written transforms to the SVG, and every read flushes a full SVG
     * layout. Measured on the baseline: 560 such reads per scrub, bursting to 46 forced layouts of
     * svg.jmap inside ONE animation frame — 121 of the 158 ms of layout in the whole scrub landed in the
     * 20 slowest frames. Rendering the timeline end-to-end once, on an idle frame after setup, does all of
     * that initialisation in one task nobody is watching. */
    function prime(): void {
      if (!tl) return;
      const at = tl.progress();
      // suppressEvents on all three: the km counter's onUpdate and the timeline's own sync() must not fire
      tl.progress(1, true).progress(0, true).progress(at, true);
    }
    /** Deferred so a refresh does not re-render the whole timeline inside ScrollTrigger's own refresh pass. */
    function queuePrime(): void {
      if (praf) cancelAnimationFrame(praf);
      praf = requestAnimationFrame(() => { praf = 0; prime(); });
    }

    const frame = (fn: () => void) => { raf = requestAnimationFrame(() => { raf = 0; fn(); }); };
    // frames 2 → 3 → (4: ScrollTrigger's queued full refresh after the pin) → 5 → 6
    frame(() => { ctx.add(build); frame(() => { ctx.add(attachPin); frame(() => frame(() => { ctx.add(attachScrub); frame(() => ctx.add(prime)); })); }); });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (praf) cancelAnimationFrame(praf);
      raf = 0;
      praf = 0;
      railBtns.forEach((b) => b.removeEventListener('click', onRail));
      chips.forEach((c) => c.removeEventListener('click', onChip));
      pinST = null;
      tl = null;
      cam.style.willChange = '';
      stage.style.willChange = '';
      svg.style.removeProperty('--lbl');
      root.dataset.stage = '0';
      delete root.dataset.ready;
      kmEl.textContent = fmtKm(KM);
      if (kmCap) kmCap.textContent = capFor(0);
      railBtns.forEach((b) => { b.dataset.done = '0'; b.removeAttribute('aria-current'); });
      chips.forEach((c, i) => c.setAttribute('aria-pressed', String(i === 0)));
    };
  });

  // one extra refresh only if fonts are still loading (metrics can shift the pinned layout); none if already loaded
  if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(() => ScrollTrigger.refresh());
}
