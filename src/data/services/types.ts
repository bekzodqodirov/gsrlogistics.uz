import type { Lang } from '@/i18n/config';
import type { ServiceKey } from '@/data/services';

/**
 * Long-form content of one service page, per language.
 * Files: src/data/services/<key>.content.ts  →  `export default content satisfies ServiceContentByLang`.
 */
export interface ServiceSection {
  heading: string;               // question-shaped where natural ("Yigʻma yuk qanday ishlaydi?")
  body: string[];                // paragraphs (plain text; no HTML)
  bullets?: string[];
  steps?: Array<{ title: string; text: string }>;
  table?: { caption?: string; head: string[]; rows: string[][]; note?: string };
  callout?: { title: string; text: string; tone?: 'info' | 'warn' | 'success' };
}
export interface ServiceContent {
  key: ServiceKey;
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    h1: string;
    intro: string;               // ≤ 70 words, answers the core question with a number
    facts: Array<{ label: string; value: string }>; // 3–4 e.g. { label: 'Muddat', value: '15–25 kun' }
  };
  sections: ServiceSection[];    // 4–7 sections
  faq: Array<{ q: string; a: string }>; // 4–8 questions, answered in first sentence
  related: ServiceKey[];         // 2–3 other services
  guideKeys: string[];           // translationKeys of related guides (see PROJECT_BRIEF §7 slugs in uz)
  cta: { title: string; text: string; draft: string }; // draft = prefilled Telegram message
  updated: string;               // ISO date
}
export type ServiceContentByLang = Record<Lang, ServiceContent>;
