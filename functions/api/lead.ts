/**
 * Cloudflare Pages Function — POST /api/lead
 *
 * Receives the lead form (src/components/LeadForm.astro) as JSON and forwards it to a Telegram
 * chat through the Bot API. Nothing is stored anywhere: the request is validated, sent once and
 * forgotten. Setup and environment variables: docs/DEPLOY-FUNCTIONS.md.
 *
 * Environment variables (Cloudflare Pages → Settings → Environment variables):
 *   TELEGRAM_BOT_TOKEN  — token from @BotFather (required)
 *   TELEGRAM_CHAT_ID    — chat/group id the bot posts into (required)
 *   TURNSTILE_SECRET    — optional; when set, a `turnstile` token in the body is verified first
 *
 * Responses: 200 {ok:true} · 400 invalid body · 403 origin/turnstile · 429 too large ·
 *            503 not configured (the browser then falls back to a Telegram deep link).
 */

/* ---- Minimal local types so this file needs no @cloudflare/workers-types dependency ---- */
interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TURNSTILE_SECRET?: string;
}
interface EventContext<E> { request: Request; env: E; waitUntil(p: Promise<unknown>): void }
type PagesFunction<E> = (ctx: EventContext<E>) => Promise<Response> | Response;

interface LeadBody {
  name?: string;
  phone?: string;
  route?: string;
  text?: string;
  lang?: string;
  page?: string;
  website?: string; // honeypot — must be empty
  turnstile?: string; // optional Cloudflare Turnstile token
}

const ROUTES: Record<string, string> = {
  truck: 'Avto kargo (yigʻma yuk)',
  air: 'Avia kargo',
  rail: 'Temir yoʻl / konteyner',
  sourcing: 'Tovar topish va sotib olish',
  other: 'Boshqa savol',
};
const MAX_BODY = 4096; // bytes — a lead is a few lines, never more

const json = (status: number, data: unknown, extra: HeadersInit = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra } });

/** Same-origin only: browsers send Origin on POST; anything from another site is refused. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return true; // non-browser or same-origin form post without Origin (older UAs)
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

/** Telegram MarkdownV2 is fussy; plain text with HTML escaping is safer. */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '');

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!sameOrigin(request)) return json(403, { ok: false, error: 'origin' });
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return json(503, { ok: false, error: 'not_configured' });

  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > MAX_BODY) return json(413, { ok: false, error: 'too_large' });

  let body: LeadBody;
  try { body = (await request.json()) as LeadBody; } catch { return json(400, { ok: false, error: 'bad_json' }); }

  // Honeypot: bots fill every field. Answer 200 so they learn nothing; send nothing.
  if (typeof body.website === 'string' && body.website.trim()) return json(200, { ok: true });

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20).replace(/\s/g, '');
  const text = clean(body.text, 1500);
  const route = clean(body.route, 20);
  const lang = clean(body.lang, 2) || 'uz';
  const page = clean(body.page, 200);

  if (name.length < 2) return json(400, { ok: false, error: 'name' });
  if (!/^\+998\d{9}$/.test(phone)) return json(400, { ok: false, error: 'phone' });
  if (text.length < 5) return json(400, { ok: false, error: 'text' });

  if (env.TURNSTILE_SECRET) {
    const token = clean(body.turnstile, 2048);
    const ip = request.headers.get('CF-Connecting-IP');
    if (!token || !(await verifyTurnstile(env.TURNSTILE_SECRET, token, ip))) return json(403, { ok: false, error: 'turnstile' });
  }

  const lines = [
    '<b>Saytdan yangi soʻrov</b>',
    `<b>Ism:</b> ${esc(name)}`,
    `<b>Telefon:</b> ${esc(phone)}`,
    route ? `<b>Yoʻnalish:</b> ${esc(ROUTES[route] ?? route)}` : '',
    `<b>Yuk:</b> ${esc(text)}`,
    `<b>Til:</b> ${esc(lang)}${page ? ` · <b>Sahifa:</b> ${esc(page)}` : ''}`,
  ].filter(Boolean);

  const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lines.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  if (!tg.ok) return json(502, { ok: false, error: 'telegram' });
  return json(200, { ok: true });
};

/** Anything but POST is not a lead. */
export const onRequest: PagesFunction<Env> = async (ctx) => {
  if (ctx.request.method === 'POST') return onRequestPost(ctx);
  return json(405, { ok: false, error: 'method' }, { Allow: 'POST' });
};
