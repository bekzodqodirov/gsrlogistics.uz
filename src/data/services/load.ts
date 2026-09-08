import type { ServiceKey } from '@/data/services';
import type { ServiceContentByLang } from './types';

/** Eagerly loads every `<key>.content.ts`; missing files simply yield no content (pages fall back to short copy). */
const modules = import.meta.glob<{ default: ServiceContentByLang }>('./*.content.ts', { eager: true });
const byKey = new Map<ServiceKey, ServiceContentByLang>();
for (const [path, mod] of Object.entries(modules)) {
  const key = path.replace('./', '').replace('.content.ts', '') as ServiceKey;
  byKey.set(key, mod.default);
}
export const getServiceContent = (key: ServiceKey): ServiceContentByLang | undefined => byKey.get(key);
export const loadedServiceKeys = () => [...byKey.keys()];
