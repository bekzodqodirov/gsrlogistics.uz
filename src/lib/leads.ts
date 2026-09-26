/**
 * Lead routing: which Telegram account a "write to us" button opens.
 *
 * Owner, 2026-09-26: GSR's own system (gsrwms.uz) picks the least busy sales manager of the right
 * team. At the final click the browser asks it for a username, opens that manager's chat with a
 * message that carries a one-off code, and the system opens the lead when that message arrives —
 * lib/lead-client.ts does the asking, components/ContactPicker.astro shows the result. This file is
 * the build-time half: which team a page belongs to, what the code travels with, and the plain links
 * that work without JavaScript. Three ways in:
 *   1. a service page knows its service, so its buttons go straight to that service's team;
 *   2. every general button (header, hero, footer, mobile bar …) opens a one-question picker first
 *      and the answer picks the team;
 *   3. without JavaScript, every button is a plain link to the company account with a draft.
 * Nothing is sent by the site: Telegram opens with a message, and the visitor presses send.
 */
import { site } from './site';
import { sourceOf, type Locale } from '@/i18n/config';
import type { ServiceKey } from '@/data/services';

export type LeadTeam = keyof typeof site.leadTeams;

/** Owner, 2026-09-26: the buying team takes sourcing, buying, equipment and car import; the cargo team the rest. */
export const serviceTeam: Record<ServiceKey, LeadTeam> = {
  truck: 'cargo', air: 'cargo', rail: 'cargo', customs: 'cargo', warehouse: 'cargo',
  sourcing: 'buying', buying: 'buying', equipment: 'buying', cars: 'buying',
};

/**
 * The topic each click is filed under in GSR's system (its `tag` parameter): lowercase ASCII,
 * `^[a-z0-9][a-z0-9_-]{0,39}$`, the same in every language. A service page sends its Uzbek slug.
 */
export const teamTopic: Record<LeadTeam, string> = { cargo: 'yuk', buying: 'xarid', general: 'savol' };
export const TOPIC_RE = /^[a-z0-9][a-z0-9_-]{0,39}$/;

/** GSR's system speaks uz, ru, en: the Cyrillic Uzbek pages are Uzbek. */
export const assignLang = (lang: Locale) => sourceOf(lang);

/**
 * The data-* a routed button carries: the team, the topic, and the one line the manager reads on
 * the lead. Spread onto an <a> whose href is the no-JavaScript link (telegramFor).
 */
export const leadAttrs = (team: LeadTeam, topic: string, summary: string) => {
  if (!TOPIC_RE.test(topic)) throw new Error(`lead topic "${topic}" is not a valid GSR tag`);
  return { 'data-team': team, 'data-topic': topic, 'data-summary': summary };
};

/**
 * A short label at the foot of a no-JavaScript draft, so a manager still sees the topic and the page.
 * (With JavaScript the topic and page travel to GSR's system instead, and the message carries the code.)
 */
const tagged = (text: string, team: LeadTeam, path?: string) => {
  let where = '';
  if (path) { try { where = ` · ${decodeURI(path)}`; } catch { where = ` · ${path}`; } }
  return `${text.trimEnd()}\n\n#${teamTopic[team]}${where}`;
};

/** The account a no-JavaScript link opens: the team's first fallback manager, else the company. */
export const fallbackUser = (team: LeadTeam) => site.leadTeams[team][0] || site.telegramCompany;

/** Server-rendered link for a team, used without JavaScript and for "open in new tab". */
export const telegramFor = (team: LeadTeam, text?: string, path?: string) => {
  const base = `https://t.me/${fallbackUser(team)}`;
  return text ? `${base}?text=${encodeURIComponent(tagged(text, team, path))}` : base;
};
