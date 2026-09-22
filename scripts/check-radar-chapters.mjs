// Postbuild: the "On the Radar" strip is on a built chapter page exactly when today's
// Radar payload links a non-demoted item to that chapter (radar-chapters.ts rule).
// Unit tests cover the filter; only the rendered page shows the empty-state guard works.
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const today = JSON.parse(readFileSync('src/data/radar/today.json', 'utf8'));
const linked = new Set((today.items ?? []).filter((it) => Array.isArray(it.chapters) && !it.demoted).flatMap((it) => it.chapters));
let bad = 0, shown = 0, pages = 0;
for (const slug of readdirSync('dist/chapters', { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
  const file = `dist/chapters/${slug}/index.html`;
  if (!existsSync(file)) continue;
  pages++;
  const has = readFileSync(file, 'utf8').includes('aria-label="On the Radar"');
  if (has) shown++;
  if (has !== linked.has(slug)) { bad++; console.error(`check:radar-chapters: ${slug} strip=${has}, payload links=${linked.has(slug)}`); }
}
if (pages === 0) { console.error('check:radar-chapters: no built chapter pages found'); process.exit(1); }
console.log(`check:radar-chapters: ${pages} chapter pages, strip on ${shown}, mismatches ${bad}`);
process.exit(bad ? 1 : 0);
