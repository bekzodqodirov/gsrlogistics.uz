/**
 * Lead routing: which Telegram account a "write to us" button opens.
 *
 * GSR's CRM ingests the managers' own Telegram accounts, so sending a visitor to the right account is
 * the whole of the routing (site.leadTeams says who is in which team). Three ways in:
 *   1. a service page knows its service, so its buttons go straight to that service's team;
 *   2. every general button (header, hero, footer, mobile bar …) opens a one-question picker first —
 *      see components/ContactPicker.astro — and the answer picks the team;
 *   3. without JavaScript, a general button is still a plain link to the general team.
 * Nothing is sent by the site: Telegram opens with a draft the visitor can edit, and they press send.
 */
import { site } from './site';
import type { ServiceKey } from '@/data/services';

export type LeadTeam = keyof typeof site.leadTeams;

/** Owner, 2026-09-26: the buying team takes sourcing, buying, equipment and car import; the cargo team the rest. */
export const serviceTeam: Record<ServiceKey, LeadTeam> = {
  truck: 'cargo', air: 'cargo', rail: 'cargo', customs: 'cargo', warehouse: 'cargo',
  sourcing: 'buying', buying: 'buying', equipment: 'buying', cars: 'buying',
};

/**
 * A short label at the foot of every draft, the same in every language, so a manager sees the topic
 * at a glance and the CRM (or anyone searching the chat list) can filter on it. The page path next
 * to it says where the visitor was when they clicked.
 */
export const teamTag: Record<LeadTeam, string> = { cargo: '#yuk', buying: '#xarid', general: '#savol' };

const tgUser = (username: string, text?: string) =>
  text ? `https://t.me/${username}?text=${encodeURIComponent(text)}` : `https://t.me/${username}`;

/** The draft with its tag line: "…\n\n#yuk · /narxlar/". Paths are shown decoded (Cyrillic slugs stay readable). */
export const tagged = (text: string, team: LeadTeam, path?: string) => {
  let where = '';
  if (path) { try { where = ` · ${decodeURI(path)}`; } catch { where = ` · ${path}`; } }
  return `${text.trimEnd()}\n\n${teamTag[team]}${where}`;
};

/**
 * Server-rendered link for a team: its FIRST manager. When a team has several, the picker script
 * swaps in the visitor's own manager on every link that carries data-team (see ContactPicker).
 */
export const telegramFor = (team: LeadTeam, text?: string, path?: string) =>
  tgUser(site.leadTeams[team][0], text ? tagged(text, team, path) : undefined);
