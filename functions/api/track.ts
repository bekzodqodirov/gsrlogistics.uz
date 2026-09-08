/**
 * Cloudflare Pages Function — GET /api/track?code=XXXX
 *
 * Looks a cargo code up in a published Google Sheet (CSV export) and returns ONLY the
 * non-personal columns the tracking page renders: code, stage, status, updated_at, eta.
 * Client names, phones, prices or any other column in the sheet are never sent.
 * The CSV is cached at the edge for 5 minutes, so the sheet may be edited freely and the
 * site never hammers Google. Setup: docs/DEPLOY-FUNCTIONS.md.
 *
 * Environment variables:
 *   TRACK_SHEET_CSV_URL — "Publish to web → CSV" link of the sheet (required)
 *
 * Sheet columns (header row, any order, case-insensitive):
 *   code | stage | status | updated_at | eta
 *   stage ∈ received · consolidation · transit · customs · tashkent · delivered
 *          (or the numbers 1–6 in the same order)
 *
 * Responses: 200 JSON · 400 bad code · 404 {error:'not_found'} · 503 not configured
 *            (the browser then falls back to a Telegram deep link).
 */

/* ---- Minimal local types so this file needs no @cloudflare/workers-types dependency ---- */
interface Env { TRACK_SHEET_CSV_URL?: string }
interface EventContext<E> { request: Request; env: E; waitUntil(p: Promise<unknown>): void }
type PagesFunction<E> = (ctx: EventContext<E>) => Promise<Response> | Response;
declare const caches: { default: { match(req: Request): Promise<Response | undefined>; put(req: Request, res: Response): Promise<void> } };

const STAGES = ['received', 'consolidation', 'transit', 'customs', 'tashkent', 'delivered'] as const;
const CODE_RE = /^[A-Za-z0-9][A-Za-z0-9-]{2,31}$/;
const CACHE_SECONDS = 300;

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

/** RFC 4180-ish CSV parser: handles quoted fields, doubled quotes and CRLF. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

/** Accepts the stage key or its 1-based number; anything else → 'received'. */
function normaliseStage(v: string): (typeof STAGES)[number] {
  const s = v.trim().toLowerCase();
  if ((STAGES as readonly string[]).includes(s)) return s as (typeof STAGES)[number];
  const n = Number(s);
  if (Number.isInteger(n) && n >= 1 && n <= STAGES.length) return STAGES[n - 1];
  return 'received';
}

/** Fetch the CSV through the Cache API (5-minute TTL) so edits show up quickly without load. */
async function loadSheet(url: string, waitUntil: (p: Promise<unknown>) => void): Promise<string> {
  const cacheKey = new Request(url, { method: 'GET' });
  const cache = caches.default;
  const hit = await cache.match(cacheKey);
  if (hit) return hit.text();
  const res = await fetch(url, { headers: { Accept: 'text/csv' }, redirect: 'follow' });
  if (!res.ok) throw new Error(`sheet ${res.status}`);
  const text = await res.text();
  const toCache = new Response(text, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Cache-Control': `public, max-age=${CACHE_SECONDS}` } });
  waitUntil(cache.put(cacheKey, toCache));
  return text;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  if (!env.TRACK_SHEET_CSV_URL) return json(503, { error: 'not_configured' });
  const code = (new URL(request.url).searchParams.get('code') || '').trim().toUpperCase();
  if (!CODE_RE.test(code)) return json(400, { error: 'bad_code' });

  let rows: string[][];
  try { rows = parseCsv(await loadSheet(env.TRACK_SHEET_CSV_URL, waitUntil)); } catch { return json(502, { error: 'sheet' }); }
  if (rows.length < 2) return json(404, { error: 'not_found' });

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name: string) => header.indexOf(name);
  const iCode = col('code'), iStage = col('stage'), iStatus = col('status'), iUpdated = col('updated_at'), iEta = col('eta');
  if (iCode < 0 || iStage < 0) return json(502, { error: 'sheet_columns' });

  const row = rows.slice(1).find((r) => (r[iCode] || '').trim().toUpperCase() === code);
  if (!row) return json(404, { error: 'not_found' });

  // Only these fields ever leave the sheet.
  return json(200, {
    code,
    stage: normaliseStage(row[iStage] || ''),
    status: iStatus >= 0 ? (row[iStatus] || '').trim().slice(0, 200) : '',
    updated_at: iUpdated >= 0 ? (row[iUpdated] || '').trim().slice(0, 40) : '',
    eta: iEta >= 0 ? (row[iEta] || '').trim().slice(0, 40) : '',
  });
};

export const onRequest: PagesFunction<Env> = async (ctx) => {
  if (ctx.request.method === 'GET') return onRequestGet(ctx);
  return new Response(JSON.stringify({ error: 'method' }), { status: 405, headers: { 'Content-Type': 'application/json', Allow: 'GET' } });
};
