import type { ServiceKey } from '@/data/services';
import type { ServiceContent, ServiceContentByLang, ServiceContentSource } from './types';

/**
 * Eagerly loads every `<key>.content.ts` (uz, ru and en, written together) and every translation in
 * `<lang>/<key>.content.ts` (zh/ and fa/, one language per file), and merges them into one record per
 * service. A missing file simply yields no content for that language: `pick` then falls back.
 */
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
  entry[m[1] as 'zh' | 'fa'] = mod.default;
}
export const getServiceContent = (key: ServiceKey): ServiceContentByLang | undefined => byKey.get(key);
export const loadedServiceKeys = () => [...byKey.keys()];
