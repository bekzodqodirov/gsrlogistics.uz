/**
 * Browser half of lead routing: ask GSR's system which sales manager gets this visitor, and build the
 * Telegram link that carries the one-off code. Owner, 2026-09-26; the contract is GSR's own
 * integration spec, summarised in README → «Mijozlarni menejerlarga taqsimlash». Its rules, which
 * every line below keeps:
 *
 *   - one call per final click, from the visitor's browser only (the server keys its limits and its
 *     CORS check on the browser's own request), never on page load, a step, or hover;
 *   - a plain fetch: no headers, no credentials, no body, no no-cors, or the CORS preflight fails;
 *   - 1.5 s, then give up, via AbortController + setTimeout (AbortSignal.timeout is missing on older
 *     iOS and in-app browsers);
 *   - ONE rule for the answer: a string of [A-Za-z0-9_] is a manager; anything else — null, 404,
 *     CORS or network error, timeout, not JSON — means the site's own list, silently, no retry;
 *   - the code is GSR- + 10 characters of a 32-letter alphabet from crypto.getRandomValues, minted
 *     once per click, the SAME string in lead= and in the message, reused (sessionStorage, 60 min)
 *     only for the same team;
 *   - the message: "Kod: GSR-…" on the first line, one summary line under it, nothing that could
 *     read as a second code.
 *
 * Until GSR deploys the endpoint every call ends in the fallback. That is expected, and there is
 * deliberately no switch and no memory of failures: routing starts the moment the endpoint answers.
 */

export type LeadTeam = 'cargo' | 'buying' | 'general';

export interface AssignConfig {
  endpoint: string;
  /** The company account: the answer when a fallback list is empty. */
  company: string;
  /** The site's own per-team lists, used when GSR's system gives no manager. */
  fallback: Partial<Record<LeadTeam, readonly string[]>>;
}

export interface LeadRequest {
  team: LeadTeam;
  /** GSR's `tag`: lowercase ASCII slug. Dropped here if it is not one. */
  topic?: string;
  /** uz | ru | en (zh, zh-CN also accepted by GSR). Anything else is left out. */
  lang?: string;
  /** The one line the manager reads on the lead. */
  summary: string;
  /** "Kod", "Код", "Code" — the word in front of the code. */
  codeWord: string;
}

export interface LeadResult {
  username: string;
  text: string;
  url: string;
  code: string;
  /** true when GSR's system chose the manager, false when the site's own list did. */
  assigned: boolean;
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 characters: no I, O, 0, 1; 256 % 32 = 0, so no bias
const CODE_RE = /^GSR-[A-HJ-NP-Z2-9]{10}$/;
const USER_RE = /^[A-Za-z0-9_]+$/;
const TOPIC_RE = /^[a-z0-9][a-z0-9_-]{0,39}$/;
const LANGS = ['uz', 'ru', 'en', 'zh', 'zh-CN'];
const TIMEOUT_MS = 1500;
const REUSE_MS = 60 * 60 * 1000;
const STORE_KEY = 'gsr_code';
/** GSR shows the summary on the lead and asks for the whole message to stay near 300 characters. */
const SUMMARY_MAX = 280;

export function mintCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return 'GSR-' + Array.from(bytes, (b) => ALPHABET[b % 32]).join('');
}

/** The same visitor pressing again within the hour for the same team keeps their code; anything else gets a new one. */
export function codeFor(team: LeadTeam): string {
  try {
    const s = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
    if (s && s.team === team && typeof s.code === 'string' && CODE_RE.test(s.code) && Date.now() - s.at < REUSE_MS) return s.code;
  } catch { /* storage refused or garbled: mint */ }
  const code = mintCode();
  try { sessionStorage.setItem(STORE_KEY, JSON.stringify({ code, team, at: Date.now() })); } catch { /* not remembered */ }
  return code;
}

export async function askManager(endpoint: string, q: { team: LeadTeam; code: string; topic?: string; lang?: string }): Promise<string | null> {
  const qs = new URLSearchParams({ team: q.team, lead: q.code, page: location.pathname });
  if (q.topic && TOPIC_RE.test(q.topic)) qs.set('tag', q.topic);
  if (q.lang && LANGS.includes(q.lang)) qs.set('lang', q.lang);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${endpoint}?${qs}`, { signal: ctrl.signal });
    const body = await res.json();
    const u = body && body.username;
    return typeof u === 'string' && USER_RE.test(u) ? u : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function fallbackUsername(cfg: AssignConfig, team: LeadTeam): string {
  const list = (cfg.fallback[team] || []).filter((u) => USER_RE.test(u));
  if (!list.length) return cfg.company;
  return list[crypto.getRandomValues(new Uint32Array(1))[0] % list.length];
}

/**
 * One line, never a second code: newlines and runs of spaces collapse (GSR shows them as spaces
 * anyway), anything shaped like "GSR-…" typed by the visitor loses its hyphen, and the line is cut
 * at a word so the whole message stays near 300 characters.
 */
export function oneLine(summary: string): string {
  let s = summary.replace(/\s+/g, ' ').trim().replace(/GSR-(?=[A-Za-z0-9])/gi, 'GSR ');
  if (s.length > SUMMARY_MAX) {
    const cut = s.slice(0, SUMMARY_MAX - 1);
    const space = cut.lastIndexOf(' ');
    s = `${(space > SUMMARY_MAX * 0.6 ? cut.slice(0, space) : cut).replace(/[\s·,;:–—-]+$/, '')}…`;
  }
  return s;
}

/** "Kod: GSR-XXXXXXXXXX" alone on the first line: a space before the code, a newline (or the end) after it. */
export function composeMessage(codeWord: string, code: string, summary: string): string {
  const line = oneLine(summary);
  return line ? `${codeWord}: ${code}\n${line}` : `${codeWord}: ${code}`;
}

export const telegramUrl = (username: string, text: string) => 'https://t.me/' + username + '?text=' + encodeURIComponent(text);

export async function assign(cfg: AssignConfig, req: LeadRequest): Promise<LeadResult> {
  const code = codeFor(req.team);
  const fromSystem = await askManager(cfg.endpoint, { team: req.team, code, topic: req.topic, lang: req.lang });
  const username = fromSystem || fallbackUsername(cfg, req.team);
  const text = composeMessage(req.codeWord, code, req.summary);
  return { username, text, url: telegramUrl(username, text), code, assigned: !!fromSystem };
}

/**
 * Open the connection to GSR's system as soon as a visitor heads for a chat button, so the one real
 * call does not also pay for DNS and TLS. A preconnect sends no request to the endpoint. crossorigin
 * because fetch() without credentials uses the anonymous connection pool.
 */
let warmed = false;
export function warm(endpoint: string): void {
  if (warmed) return;
  warmed = true;
  try {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = new URL(endpoint).origin;
    link.crossOrigin = 'anonymous';
    document.head.append(link);
  } catch { /* a hint, nothing more */ }
}
