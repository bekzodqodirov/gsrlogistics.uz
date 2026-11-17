#!/usr/bin/env node
// The three omissions that build clean when a service is added — a test of the SOURCES, no build needed
// (npm run test:services; it also runs first in `prebuild`, so every build — local, CI, deploy — stops on them):
//   1. every service of src/data/services.ts sits in exactly one group of `serviceGroups` (src/i18n/services.ts):
//      a key in no group is missing from the services index while the menu, the footer and the ItemList carry it;
//   2. every service has its three content files (src/data/services/<key>.content.ts, zh/<key>.content.ts,
//      fa/<key>.content.ts): without them the page is the template's fallback, and no other script objects;
//   3. the hand-written eyebrow of every page carries the service's registry position («Xizmat 06 — …», «Услуга 06 — …»,
//      "Service 06 — …", 服务 06 — …, «خدمت ۰۶ — …»): the services index computes the card number, the page prints text.
// Usage: node scripts/test-services.mjs [<repository-dir>]   (default: the repository this script belongs to)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const require = createRequire(path.join(root, 'package.json'));
const esbuild = await import(pathToFileURL(require.resolve('esbuild')).href);
const load = async (rel) => {
  const out = await esbuild.build({ entryPoints: [path.join(root, rel)], bundle: true, write: false, format: 'esm', platform: 'node', absWorkingDir: root, logLevel: 'silent' });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);
};

const { services } = await load('src/data/services.ts');
const { serviceGroups } = await load('src/i18n/services.ts');
const problems = [];

// 1. groups
for (const s of services) {
  const n = serviceGroups.filter((g) => g.keys.includes(s.key)).length;
  if (n !== 1) problems.push(`service '${s.key}' is in ${n} groups of serviceGroups (src/i18n/services.ts) — it must be in exactly one, or the services index ${n ? 'shows it twice' : 'does not show it'}`);
}
for (const g of serviceGroups) for (const k of g.keys) if (!services.some((s) => s.key === k)) problems.push(`serviceGroups.${g.id} names '${k}', which is no service of src/data/services.ts`);

// 2. content files, 3. eyebrows
const ascii = (s) => s.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
let eyebrows = 0;
for (const [i, s] of services.entries()) {
  const files = { main: `src/data/services/${s.key}.content.ts`, zh: `src/data/services/zh/${s.key}.content.ts`, fa: `src/data/services/fa/${s.key}.content.ts` };
  const missing = Object.values(files).filter((rel) => !fs.existsSync(path.join(root, rel)));
  if (missing.length) { problems.push(`service '${s.key}' has no ${missing.join(', ')} — its page would be the template's fallback`); continue; }
  const main = (await load(files.main)).default;
  const pages = { uz: main.uz, ru: main.ru, en: main.en, zh: (await load(files.zh)).default, fa: (await load(files.fa)).default };
  for (const [lang, c] of Object.entries(pages)) {
    eyebrows++;
    const number = Number((/\d+/.exec(ascii(c?.hero?.eyebrow ?? '')) ?? [])[0]);
    if (number !== i + 1) problems.push(`${files[lang] ?? files.main} (${lang}): the eyebrow «${c?.hero?.eyebrow}» — the service is number ${String(i + 1).padStart(2, '0')} in src/data/services.ts (a service added in the middle of the list moves the numbers of the ones after it)`);
  }
}

if (problems.length) { console.log(`test-services: NOT OK — ${problems.length} problem(s)\n  ${problems.join('\n  ')}`); process.exit(1); }
console.log(`test-services: ok — ${services.length} services, each in one group of the services index, each with its three content files; ${eyebrows} eyebrows carry the registry number`);
