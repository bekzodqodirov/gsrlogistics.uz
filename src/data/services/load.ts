import type { ServiceKey } from '@/data/services';
import { pendingLocales } from '@/i18n/config';
import type { ServiceContent, ServiceContentByLang, ServiceContentSource } from './types';

/**
 * Eagerly loads every `<key>.content.ts` (uz, ru and en, written together) and every translation in
 * `<lang>/<key>.content.ts` (zh/ and fa/, one language per file), and merges them into one record per
 * service.
 *
 * Every service page needs both translations. A missing zh/ or fa/ file fails the build here, naming
 * the file, instead of letting /zh/ or /fa/ quietly show the English page. Only a locale that is still
 * listed in `PendingLang` (src/i18n/config.ts — none is today) may lack files; `pick` then shows that
 * locale's fallback branch.
 */
const TRANSLATED = ['zh', 'fa'] as const;
const sources = import.meta.glob<{ default: ServiceContentSource }>('./*.content.ts', { eager: true });
const translations = import.meta.glob<{ default: ServiceContent }>('./*/*.content.ts', { eager: true });
const byKey = new Map<ServiceKey, ServiceContentByLang>();
for (const [path, mod] of Object.entries(sources)) {
  const key = path.replace('./', '').replace('.content.ts', '') as ServiceKey;
  byKey.set(key, { ...mod.default } as ServiceContentByLang);
}
for (const [path, mod] of Object.entries(translations)) {
  const m = path.match(/^\.\/(zh|fa)\/([a-z]+)\.content\.ts$/);
  if (!m) throw new Error(`Unexpected service content file ${path} — translations live in zh/ or fa/`);
  const entry = byKey.get(m[2] as ServiceKey);
  if (!entry) throw new Error(`${path} translates a service with no ${m[2]}.content.ts`);
  if (mod.default.key !== m[2]) throw new Error(`${path} declares key "${mod.default.key}"`);
  entry[m[1] as (typeof TRANSLATED)[number]] = mod.default;
}
for (const [key, entry] of byKey) {
  for (const lang of TRANSLATED) {
    if (entry[lang] !== undefined || pendingLocales[lang]) continue;
    throw new Error(
      `Missing translation src/data/services/${lang}/${key}.content.ts: the ${key} service page ` +
        `(src/data/services/${key}.content.ts) has no ${lang} translation. Write it from the English branch ` +
        `or, while it is being written, mark '${lang}' pending in src/i18n/config.ts (PendingLang and pendingLocales).`,
    );
  }
}
export const getServiceContent = (key: ServiceKey): ServiceContentByLang | undefined => byKey.get(key);
export const loadedServiceKeys = () => [...byKey.keys()];
