/**
 * Journey client module — imported by Journey.astro once the section is within 100 % rootMargin; init() runs only
 * when the main thread is idle (requestIdleCallback, 1.5 s timeout). Setup is split over frames so no single task
 * is long: (1) element lookup, route sampling, initial states → (2) rAF: timeline build → (3) rAF: the pin
 * trigger (a pin queues ScrollTrigger's own full refresh for the next frame) → (5) rAF: the scrub trigger, so it is
 * refreshed exactly once. GSAP core + ScrollTrigger + MotionPathPlugin only.
 *
 * One gsap.timeline (0–100 "percent" units) driven by two ScrollTriggers over the same range — one pins the stage
 * (anticipatePin 1), one scrubs the timeline (scrub 0.8, invalidateOnRefresh). They are separate on purpose: a pin
 * trigger that also owns an animation renders the whole timeline to its end and back on every refresh (to check
 * whether the animation moves the pinned element), which is the single most expensive task on a slow phone.
 * start "top top", end = 5.5 × stage height (4.5 on mobile). Stage labels:
 *   s0 intro 0–8 · s1 Yiwu warehouse 8–22 · s2 loading 22–34 · s3 transit 34–60 · s4 Khorgos 60–72 ·
 *   s5 Tashkent warehouse 72–88 · s6 delivered + CTA 88–100.
 * The pin uses pinType "transform": the default fixed pin drops the stage out of flow on pin and unpin, and the
 * browser scores each flip as a full-viewport layout shift. The dark header state is owned by Header.astro's
 * IntersectionObserver over every .dark section, so it holds here even when this module never loads.
 * Camera = the HTML .cam wrapper, transform only (translate + scale). The vehicle <g> lives inside the SVG and
 * is driven along #route by MotionPathPlugin in lockstep with the route's stroke-dashoffset (pathLength="1").
 * Only transform / opacity / stroke-dashoffset are animated. will-change is set on .cam while pinned only.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

const MAP = { w: 1600, h: 923 };
/** Bounding box (map units) the intro frames: Tashkent … Yiwu with breathing room. */
const ROUTE_BOX = { x0: 100, y0: 170, x1: 1650, y1: 720 };
/** Timeline labels (percent). Sub-labels s3b/s3c switch the mode chips. */
const L = { s0: 0, s1: 8, s2: 22, s3: 34, s3b: 43, s3c: 52, s4: 60, s5: 72, s6: 88, end: 100 } as const;
const STAGE_START = [L.s1, L.s2, L.s3, L.s4, L.s5, L.s6];
/** Card i enters at stage start + 2.5 over 3 units (stage 1: +1); rail/chip jumps land after that, on a settled frame. */
const SETTLED = 6;
/** Route nodes (map units) used to find their progress along #route. */
const NODE = { khorgos: [502.7, 209.7], yiwu: [1478.9, 670.4] } as const;
/** Yiwu shed + parcel choreography (map units) — must match RouteMap.astro `A`. Shed sits on land SW of the city dot. */
const YIWU = { shed: [1450, 706], shedMobile: [1436, 716], parcelsFrom: [[1404, 732], [1420, 744], [1392, 722], [1432, 752]] } as const;
/** Tashkent delivery choreography (map units). GSAP x/y on SVG groups are absolute (they replace the transform attribute). */
const TASH = { shed: [197, 341], unload: [197, 333], vanFrom: 197, vanTo: { desktop: 160, mobile: 148 }, pin: { desktop: [122, 343], mobile: [106, 343] } } as const;

interface CamTarget { x: number; y: number; k: number; fx?: number; fy?: number }
/** Camera targets per stage (index 1–6); k is relative to the "whole map fits" scale. */
const CAMS = {
  desktop: [
    null,
    { x: 1430, y: 665, k: 1.6 },
    { x: 1400, y: 640, k: 1.6 },
    { x: 860, y: 400, k: 1.2 },
    { x: 530, y: 215, k: 2.0 },
    { x: 300, y: 300, k: 1.6 },
    { x: 215, y: 330, k: 2.4 },
  ] as Array<CamTarget | null>,
  mobile: [
    null,
    { x: 1456, y: 690, k: 2.2 },
    { x: 1440, y: 660, k: 2.2 },
    { x: 860, y: 400, k: 1.45 },
    { x: 530, y: 215, k: 2.6 },
    { x: 300, y: 300, k: 2.2 },
    { x: 190, y: 335, k: 2.8 },
  ] as Array<CamTarget | null>,
};

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
  const air = svg?.querySelector<SVGPathElement>('#j-air') ?? null;
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
  const bar = $<SVGUseElement>('bar');
  const stamp = $<SVGGElement>('stamp');
  const pin = $<SVGGElement>('pin');
  const van = $<SVGGElement>('van');
  const shedYiwu = $<SVGGElement>('shed-yiwu');
  const markL = $<SVGPathElement>('mark-l');
  const markR = $<SVGPathElement>('mark-r');
  const labels = $$<SVGTextElement>('label');
  const inners = $$<SVGGElement>('inner');
  const mapMarks = svg ? Array.from(svg.querySelectorAll<SVGUseElement>('.j-mark')) : [];

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

  const setLabelSize = () => {
    const W = mapEl.clientWidth || 1, H = mapEl.clientHeight || 1;
    const s0 = Math.min(W / MAP.w, H / MAP.h);
    svg.style.setProperty('--lbl', `${(12 / s0).toFixed(2)}px`);
  };

  const mm = gsap.matchMedia();
  mm.add({ isDesktop: '(min-width: 900px)', isMobile: '(max-width: 899px)', reduceMotion: '(prefers-reduced-motion: reduce)' }, (ctx) => {
    const cond = (ctx.conditions ?? {}) as Record<string, boolean>;
    if (cond.reduceMotion) { root.classList.remove('is-live'); root.dataset.stage = '0'; return; }
    root.classList.add('is-live');
    const desktop = !!cond.isDesktop;
    const cams = desktop ? CAMS.desktop : CAMS.mobile;
    const glyphScale = desktop ? 1 : 1.6;
    const shedPos = desktop ? YIWU.shed : YIWU.shedMobile;
    /** where the parcels gather in front of the shed door */
    const hold = [shedPos[0] - 2, shedPos[1] - 6] as const;
    const pinPos = desktop ? TASH.pin.desktop : TASH.pin.mobile;

    /* ---------- camera maths ---------- */
    const introCam = (): CamTarget => {
      const W = mapEl.clientWidth || 1, H = mapEl.clientHeight || 1;
      const s0 = Math.min(W / MAP.w, H / MAP.h);
      const bw = (ROUTE_BOX.x1 - ROUTE_BOX.x0) * s0, bh = (ROUTE_BOX.y1 - ROUTE_BOX.y0) * s0;
      // mobile: the route box may overshoot the phone width by ~12 % (only Yiwu's label is clipped, as before) so the
      // band is not a thin letterboxed strip; the frame favours the west end (Toshkent, Xorgos labels stay whole) and
      // the focal point sits mid-way between the headline and the sheet.
      const availW = W - (desktop ? 64 : -W * 0.12), availH = H * (desktop ? 0.6 : 0.5);
      const k = clamp(Math.min(availW / bw, availH / bh), 0.9, desktop ? 1.3 : 1.45);
      return { x: (ROUTE_BOX.x0 + ROUTE_BOX.x1) / 2, y: (ROUTE_BOX.y0 + ROUTE_BOX.y1) / 2 + 20, k, fx: desktop ? 0.5 : 0.55, fy: desktop ? 0.6 : 0.4 };
    };
    const stageCam = (i: number) => (): CamTarget => cams[i] as CamTarget;
    /** Translate/scale for .cam (transform-origin 0 0) so that map point (x, y) lands on the focal point. */
    const camFor = (t: CamTarget) => {
      const W = mapEl.clientWidth || 1, H = mapEl.clientHeight || 1;
      const s0 = Math.min(W / MAP.w, H / MAP.h);
      const offX = (W - MAP.w * s0) / 2, offY = (H - MAP.h * s0) / 2;
      let fx: number, fy: number;
      if (t.fx !== undefined) fx = W * t.fx;
      else if (desktop) { const free = cardsWrap.getBoundingClientRect().left - mapEl.getBoundingClientRect().left; fx = clamp(free, W * 0.4, W) * 0.5; }
      else fx = W * 0.5;
      fy = H * (t.fy ?? (desktop ? 0.5 : 0.3));
      return { x: fx - t.k * (offX + t.x * s0), y: fy - t.k * (offY + t.y * s0), scale: t.k };
    };

    /* ---------- initial states (frame 1, cheap) ---------- */
    setLabelSize();
    gsap.set(labels, { transformOrigin: (_i: number, el: SVGTextElement) => el.dataset.o || '0% 100%' });
    if (glyphScale !== 1) {
      gsap.set(inners, { scale: glyphScale, transformOrigin: (_i: number, el: SVGGElement) => { const p = el.parentElement; return p && (p.classList.contains('j-shed') || p.classList.contains('j-pin')) ? '50% 100%' : '50% 50%'; } });
    }
    gsap.set(pin, { x: pinPos[0], y: pinPos[1] });
    if (shedYiwu) gsap.set(shedYiwu, { x: shedPos[0], y: shedPos[1] });
    // mobile: the sheet and card 01 are in place from the first frame — the headline reads above the map band
    if (!desktop) gsap.set(cards[0], { autoAlpha: 1, y: 0 });
    kmEl.textContent = fmtKm(0);
    const kmProxy = { v: 0 };

    let tl: gsap.core.Timeline | null = null;
    let pinST: ScrollTrigger | null = null;
    let raf = 0;

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
      t.fromTo([title, sub], { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -16, duration: 4, ease: 'power1.in' }, 4);
      camMove(introCam, stageCam(1), L.s1, 6, true);
      if (desktop) enter(0, L.s1 + 1);
      if (parcels.length) {
        t.fromTo(parcels, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5, stagger: 0.4 }, 10);
        t.fromTo(parcels, { x: (i: number) => YIWU.parcelsFrom[i][0], y: (i: number) => YIWU.parcelsFrom[i][1] },
          { x: (i: number) => hold[0] + (i % 2 ? 3 : -3), y: (i: number) => hold[1] + (i < 2 ? 0 : -4), duration: 5, stagger: 1, ease: 'power2.inOut', immediateRender: false }, 11);
        t.fromTo(parcels, { autoAlpha: 1 }, { autoAlpha: 0, duration: 1.5, immediateRender: false }, 18.5);
      }
      t.fromTo(container, { autoAlpha: 0, scale: 0.8, x: hold[0], y: hold[1] - 4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 2 }, 19);
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
      drive(0.1, P_KHORGOS - 0.045, L.s3, L.s4 - L.s3);
      t.fromTo(railMask, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 24, autoRound: false }, L.s3);
      t.to(plane, { motionPath: { path: air, align: air, alignOrigin: [0.5, 0.5], autoRotate: 180, start: 0, end: 1 }, duration: 50 }, L.s3);
      t.fromTo(plane, { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 2 }, L.s3);
      t.fromTo(plane, { autoAlpha: 0.5 }, { autoAlpha: 0, duration: 2, immediateRender: false }, 82);
      t.to(kmProxy, { v: KM, duration: 24, snap: { v: 1 }, onUpdate: () => { kmEl.textContent = fmtKm(kmProxy.v); } }, L.s3);
      tick(2, L.s4 - 2.5);

      // s4: Khorgos — the truck stops at the barrier, barrier lifts, stamp appears, truck resumes
      exit(2, L.s4);
      enter(3, L.s4 + 2.5);
      camMove(stageCam(3), stageCam(4), L.s4, 4);
      drive(P_KHORGOS - 0.045, P_KHORGOS - 0.038, L.s4, 3, 'power1.out');
      t.fromTo(bar, { rotation: 0, transformOrigin: '100% 50%' }, { rotation: -60, duration: 3, ease: 'power2.inOut' }, 63);
      t.fromTo(stamp, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 3, ease: 'power2.out' }, 64);
      drive(P_KHORGOS - 0.038, P_KHORGOS + 0.01, 70, 2, 'power1.in');
      tick(3, L.s5 - 2.5);

      // s5: Kazakhstan → Tashkent warehouse; capsule fades at the shed, container unloads
      // The border props belong to stage 4 only — fade them out so they do not float over Tashkent.
      t.to([bar, stamp], { autoAlpha: 0, duration: 2.5, immediateRender: false }, L.s5);
      exit(3, L.s5);
      enter(4, L.s5 + 2.5);
      camMove(stageCam(4), stageCam(5), L.s5, 5);
      drive(P_KHORGOS + 0.01, 1, L.s5, 12);
      // fade the capsule out as it lands (drive ends at 84), not after: three glyphs and the node label
      // otherwise share the same ~40px on a 390px screen
      if (vehicleInner) t.fromTo(vehicleInner, { autoAlpha: 1 }, { autoAlpha: 0, duration: 2, immediateRender: false }, 82.5);
      t.fromTo(container, { autoAlpha: 0, x: TASH.shed[0], y: TASH.unload[1] - 8, scale: 1 }, { autoAlpha: 1, y: TASH.unload[1], duration: 2.5, ease: 'power2.out', immediateRender: false }, 84.5);
      tick(4, L.s6 - 2.5);

      // s6: delivered — camera settles on Tashkent, map dims, van drives to the door pin, marks lock, CTA
      exit(4, L.s6);
      enter(5, L.s6 + 2.5);
      camMove(stageCam(5), stageCam(6), L.s6, 5);
      t.fromTo(base, { opacity: 1 }, { opacity: 0.4, duration: 6 }, L.s6);
      if (mapMarks.length) t.fromTo(mapMarks, { autoAlpha: 0.7 }, { autoAlpha: 0, duration: 3 }, L.s6);
      t.fromTo(container, { autoAlpha: 1 }, { autoAlpha: 0, duration: 2, immediateRender: false }, 90);
      t.fromTo(pin, { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, 89);
      t.fromTo(van, { autoAlpha: 0, x: TASH.vanFrom, y: TASH.shed[1] + 2 }, { autoAlpha: 1, duration: 1.5 }, 90);
      t.fromTo(van, { x: TASH.vanFrom }, { x: desktop ? TASH.vanTo.desktop : TASH.vanTo.mobile, duration: 6, ease: 'power2.inOut', immediateRender: false }, 91);
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

    const end = () => `+=${Math.round(stage.offsetHeight * (desktop ? 5.5 : 4.5))}`;
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
        onToggle: (self) => { cam.style.willChange = self.isActive ? 'transform' : ''; },
        onRefresh: () => setLabelSize(),
      });
    };
    const attachScrub = () => {
      if (!tl) return;
      ScrollTrigger.create({ animation: tl, trigger: root, start: 'top top', end, scrub: 0.8, invalidateOnRefresh: true });
      sync(tl.time());
      railBtns.forEach((b) => b.addEventListener('click', onRail));
      chips.forEach((c) => c.addEventListener('click', onChip));
      root.dataset.ready = '1';
    };

    const frame = (fn: () => void) => { raf = requestAnimationFrame(() => { raf = 0; fn(); }); };
    // frames 2 → 3 → (4: ScrollTrigger's queued full refresh after the pin) → 5
    frame(() => { ctx.add(build); frame(() => { ctx.add(attachPin); frame(() => frame(() => ctx.add(attachScrub))); }); });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      railBtns.forEach((b) => b.removeEventListener('click', onRail));
      chips.forEach((c) => c.removeEventListener('click', onChip));
      pinST = null;
      tl = null;
      cam.style.willChange = '';
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
