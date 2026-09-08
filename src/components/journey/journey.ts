/**
 * Journey client module — imported dynamically by Journey.astro once the section is within 100 % rootMargin.
 * GSAP core + ScrollTrigger + MotionPathPlugin only.
 *
 * One gsap.timeline (0–100 "percent" units) with one ScrollTrigger: pin, scrub 0.8, anticipatePin 1,
 * start "top top", end = 5.5 × stage height (4.5 on mobile), invalidateOnRefresh. Stage labels:
 *   s0 intro 0–8 · s1 Yiwu warehouse 8–22 · s2 loading 22–34 · s3 transit 34–60 · s4 Khorgos 60–72 ·
 *   s5 Tashkent warehouse 72–88 · s6 delivered + CTA 88–100.
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
/** Route nodes (map units) used to find their progress along #route. */
const NODE = { khorgos: [502.7, 209.7] } as const;

interface CamTarget { x: number; y: number; k: number; fx?: number; fy?: number }
/** Camera targets per stage (index 1–6); k is relative to the "whole map fits" scale. */
const CAMS = {
  desktop: [
    null,
    { x: 1440, y: 655, k: 1.6 },
    { x: 1400, y: 640, k: 1.6 },
    { x: 860, y: 400, k: 1.2 },
    { x: 530, y: 215, k: 2.0 },
    { x: 300, y: 300, k: 1.6 },
    { x: 215, y: 330, k: 2.4 },
  ] as Array<CamTarget | null>,
  mobile: [
    null,
    { x: 1480, y: 660, k: 2.2 },
    { x: 1440, y: 650, k: 2.2 },
    { x: 860, y: 400, k: 1.45 },
    { x: 530, y: 215, k: 2.6 },
    { x: 300, y: 300, k: 2.2 },
    { x: 200, y: 335, k: 2.8 },
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
  const sheet = $('sheet');
  const cards = $$('card');
  const ticks = $$('tick');
  const railBtns = $$<HTMLButtonElement>('rail-btn');
  const chips = $$<HTMLButtonElement>('chip');
  const kmEl = $('km');
  const vehicle = $<SVGGElement>('vehicle');
  const plane = $<SVGGElement>('plane');
  const parcels = $$<SVGGElement>('parcel');
  const container = $<SVGGElement>('container');
  const bar = $<SVGUseElement>('bar');
  const stamp = $<SVGGElement>('stamp');
  const pin = $<SVGGElement>('pin');
  const van = $<SVGGElement>('van');
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
  const header = document.getElementById('site-header');
  const lang = root.dataset.lang ?? 'uz';
  const KM = Number(root.dataset.km) || 5000;
  const verified = root.dataset.kmVerified === '1';
  const fmtKm = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' ') + (v >= KM && !verified ? '+' : '');

  /** Progress (0–1) along #route of the point nearest to (x, y). Sampled once. */
  const progressAt = (() => {
    const len = route.getTotalLength();
    const N = 600;
    const pts: Array<[number, number]> = [];
    for (let i = 0; i <= N; i++) { const p = route.getPointAtLength((len * i) / N); pts.push([p.x, p.y]); }
    return (x: number, y: number) => {
      let best = 0, bd = Infinity;
      pts.forEach(([px, py], i) => { const d = (px - x) ** 2 + (py - y) ** 2; if (d < bd) { bd = d; best = i; } });
      return best / N;
    };
  })();
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
    const glyphScale = desktop ? 1 : 1.7;

    /* ---------- camera maths ---------- */
    const introCam = (): CamTarget => {
      const W = mapEl.clientWidth || 1, H = mapEl.clientHeight || 1;
      const s0 = Math.min(W / MAP.w, H / MAP.h);
      const bw = (ROUTE_BOX.x1 - ROUTE_BOX.x0) * s0, bh = (ROUTE_BOX.y1 - ROUTE_BOX.y0) * s0;
      const availW = W - (desktop ? 64 : 16), availH = H * (desktop ? 0.6 : 0.45);
      const k = clamp(Math.min(availW / bw, availH / bh), 0.9, desktop ? 1.3 : 1.45);
      return { x: (ROUTE_BOX.x0 + ROUTE_BOX.x1) / 2, y: (ROUTE_BOX.y0 + ROUTE_BOX.y1) / 2 + 20, k, fx: 0.5, fy: desktop ? 0.6 : 0.62 };
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
      fy = H * (t.fy ?? (desktop ? 0.5 : 0.5));
      return { x: fx - t.k * (offX + t.x * s0), y: fy - t.k * (offY + t.y * s0), scale: t.k };
    };

    /* ---------- initial states ---------- */
    setLabelSize();
    gsap.set(labels, { transformOrigin: (_i: number, el: SVGTextElement) => el.dataset.o || '0% 100%' });
    if (glyphScale !== 1) {
      gsap.set(inners, { scale: glyphScale, transformOrigin: (_i: number, el: SVGGElement) => { const p = el.parentElement; return p && (p.classList.contains('j-shed') || p.classList.contains('j-pin')) ? '50% 100%' : '50% 50%'; } });
    }
    kmEl.textContent = fmtKm(0);
    const kmProxy = { v: 0 };

    /* ---------- timeline ---------- */
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        pin: stage,
        pinSpacing: false,
        start: 'top top',
        end: () => `+=${Math.round(stage.offsetHeight * (desktop ? 5.5 : 4.5))}`,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onToggle: (self) => { cam.style.willChange = self.isActive ? 'transform' : ''; },
        onEnter: () => header?.setAttribute('data-over-dark', 'true'),
        onEnterBack: () => header?.setAttribute('data-over-dark', 'true'),
        onLeave: () => header?.setAttribute('data-over-dark', 'false'),
        onLeaveBack: () => header?.setAttribute('data-over-dark', 'false'),
        onRefresh: () => setLabelSize(),
      },
      onUpdate: () => sync(tl.time()),
    });
    Object.entries(L).forEach(([k, v]) => tl.addLabel(k, v));
    tl.set({}, {}, L.end); // pins the duration at exactly 100

    const camMove = (from: () => CamTarget, to: () => CamTarget, at: number, dur: number, first = false) => {
      const ease = 'power2.inOut';
      tl.fromTo(cam,
        { x: () => camFor(from()).x, y: () => camFor(from()).y, scale: () => camFor(from()).scale },
        { x: () => camFor(to()).x, y: () => camFor(to()).y, scale: () => camFor(to()).scale, force3D: true, ease, duration: dur, immediateRender: first }, at);
      if (labels.length) tl.fromTo(labels, { scale: () => 1 / from().k }, { scale: () => 1 / to().k, ease, duration: dur, immediateRender: first }, at);
    };
    const enter = (i: number, at: number) => tl.fromTo(cards[i], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 3, ease: 'power2.out' }, at);
    const exit = (i: number, at: number) => tl.fromTo(cards[i], { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -16, duration: 2.5, ease: 'power2.in', immediateRender: false }, at);
    const tick = (i: number, at: number) => { if (ticks[i]) tl.fromTo(ticks[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5 }, at); };
    const mp = (start: number, end: number) => ({ path: route, align: route, alignOrigin: [0.5, 0.5] as [number, number], autoRotate: 180, start, end });
    const drive = (from: number, to: number, at: number, dur: number, ease = 'none', first = false) => {
      tl.to(vehicle, { motionPath: mp(from, to), ease, duration: dur, immediateRender: first }, at);
      tl.fromTo(route, { strokeDashoffset: 1 - from }, { strokeDashoffset: 1 - to, ease, duration: dur, immediateRender: first }, at);
    };

    // s0 → s1: headline out, camera to Yiwu, card 1, parcels into the shed, container forms
    tl.fromTo([title, sub], { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -16, duration: 4, ease: 'power1.in' }, 4);
    if (!desktop && sheet) tl.fromTo(sheet, { yPercent: 100 }, { yPercent: 0, duration: 4, ease: 'power2.out' }, 5);
    camMove(introCam, stageCam(1), L.s1, 6, true);
    enter(0, L.s1 + 1);
    if (parcels.length) {
      tl.fromTo(parcels, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5, stagger: 0.4 }, 10);
      tl.fromTo(parcels, { x: (i: number) => [1580, 1594, 1586, 1600][i], y: (i: number) => [700, 692, 684, 706][i] },
        { x: (i: number) => 1546 + (i % 2 ? 2 : -2), y: 696, duration: 5, stagger: 1, ease: 'power2.inOut', immediateRender: false }, 11);
      tl.fromTo(parcels, { autoAlpha: 1 }, { autoAlpha: 0, duration: 1.5, immediateRender: false }, 18.5);
    }
    tl.fromTo(container, { autoAlpha: 0, scale: 0.8, x: 1548, y: 692, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 2 }, 19);
    tick(0, L.s2 - 2.5);

    // s2: loading — container hops onto the capsule, vehicle appears and departs
    exit(0, L.s2);
    enter(1, L.s2 + 2.5);
    camMove(stageCam(1), stageCam(2), L.s2, 4);
    tl.fromTo(container, { x: 1548, y: 692 }, { x: 1479, y: 664, duration: 3, ease: 'power2.inOut', immediateRender: false }, 23);
    tl.fromTo(vehicle, { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, 25);
    tl.fromTo(container, { autoAlpha: 1 }, { autoAlpha: 0, duration: 1.5, immediateRender: false }, 25);
    drive(0, 0.1, 26, L.s3 - 26, 'none', true);
    tick(1, L.s3 - 2.5);

    // s3: transit — long leg to the border, rail twin draws, plane flies the arc, km counter
    exit(1, L.s3);
    enter(2, L.s3 + 2.5);
    camMove(stageCam(2), stageCam(3), L.s3, 6);
    drive(0.1, P_KHORGOS - 0.045, L.s3, L.s4 - L.s3);
    tl.fromTo(railMask, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 24 }, L.s3);
    tl.to(plane, { motionPath: { path: air, align: air, alignOrigin: [0.5, 0.5], autoRotate: 180, start: 0, end: 1 }, duration: 50, immediateRender: true }, L.s3);
    tl.fromTo(plane, { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 2 }, L.s3);
    tl.fromTo(plane, { autoAlpha: 0.5 }, { autoAlpha: 0, duration: 2, immediateRender: false }, 82);
    tl.to(kmProxy, { v: KM, duration: 24, snap: { v: 1 }, onUpdate: () => { kmEl.textContent = fmtKm(kmProxy.v); } }, L.s3);
    tick(2, L.s4 - 2.5);

    // s4: Khorgos — the truck stops at the barrier, barrier lifts, stamp appears, truck resumes
    exit(2, L.s4);
    enter(3, L.s4 + 2.5);
    camMove(stageCam(3), stageCam(4), L.s4, 4);
    drive(P_KHORGOS - 0.045, P_KHORGOS - 0.038, L.s4, 3, 'power1.out');
    tl.fromTo(bar, { rotation: 0, transformOrigin: '100% 50%' }, { rotation: -60, duration: 3, ease: 'power2.inOut' }, 63);
    tl.fromTo(stamp, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 3, ease: 'power2.out' }, 64);
    drive(P_KHORGOS - 0.038, P_KHORGOS + 0.01, 70, 2, 'power1.in');
    tick(3, L.s5 - 2.5);

    // s5: Kazakhstan → Tashkent warehouse; capsule fades at the shed, container unloads
    exit(3, L.s5);
    enter(4, L.s5 + 2.5);
    camMove(stageCam(4), stageCam(5), L.s5, 5);
    drive(P_KHORGOS + 0.01, 1, L.s5, 12);
    if (vehicleInner) tl.fromTo(vehicleInner, { autoAlpha: 1 }, { autoAlpha: 0, duration: 2, immediateRender: false }, 85);
    tl.fromTo(container, { autoAlpha: 0, x: 197, y: 325, scale: 1 }, { autoAlpha: 1, y: 333, duration: 2.5, ease: 'power2.out', immediateRender: false }, 84.5);
    tick(4, L.s6 - 2.5);

    // s6: delivered — camera settles on Tashkent, map dims, van drives to the door pin, marks lock, CTA
    exit(4, L.s6);
    enter(5, L.s6 + 2.5);
    camMove(stageCam(5), stageCam(6), L.s6, 5);
    tl.fromTo(base, { opacity: 1 }, { opacity: 0.4, duration: 6 }, L.s6);
    if (mapMarks.length) tl.fromTo(mapMarks, { autoAlpha: 0.7 }, { autoAlpha: 0, duration: 3 }, L.s6);
    tl.fromTo(container, { autoAlpha: 1 }, { autoAlpha: 0, duration: 2, immediateRender: false }, 90);
    tl.fromTo(pin, { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, 89);
    tl.fromTo(van, { autoAlpha: 0, x: 197, y: 343 }, { autoAlpha: 1, duration: 1.5 }, 90);
    tl.fromTo(van, { x: 197 }, { x: 160, duration: 6, ease: 'power2.inOut', immediateRender: false }, 91);
    if (markL && markR) {
      tl.fromTo(markL, { x: -30, y: -18, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 3, ease: 'power2.out' }, 92);
      tl.fromTo(markR, { x: 30, y: 18, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 3, ease: 'power2.out' }, 92);
    }
    tick(5, 97);

    /* ---------- state sync: progress rail, section data-stage, mode chips ---------- */
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
      }
    };
    sync(tl.time());

    const scrollToTime = (time: number) => {
      const st = tl.scrollTrigger;
      if (!st) return;
      const y = st.start + (st.end - st.start) * (time / tl.duration());
      window.scrollTo({ top: Math.round(y) + 1, left: 0, behavior: 'auto' });
    };
    const onRail = (e: Event) => { const i = railBtns.indexOf(e.currentTarget as HTMLButtonElement); if (i >= 0) scrollToTime(STAGE_START[i] + 2); };
    const onChip = (e: Event) => { const i = chips.indexOf(e.currentTarget as HTMLButtonElement); if (i >= 0) scrollToTime([L.s3, L.s3b, L.s3c][i] + 1); };
    railBtns.forEach((b) => b.addEventListener('click', onRail));
    chips.forEach((c) => c.addEventListener('click', onChip));
    root.dataset.ready = '1';

    return () => {
      railBtns.forEach((b) => b.removeEventListener('click', onRail));
      chips.forEach((c) => c.removeEventListener('click', onChip));
      header?.removeAttribute('data-over-dark');
      cam.style.willChange = '';
      svg.style.removeProperty('--lbl');
      root.dataset.stage = '0';
      delete root.dataset.ready;
      kmEl.textContent = fmtKm(KM);
      railBtns.forEach((b) => { b.dataset.done = '0'; b.removeAttribute('aria-current'); });
      chips.forEach((c, i) => c.setAttribute('aria-pressed', String(i === 0)));
    };
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}
