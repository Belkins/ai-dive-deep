import fs from 'node:fs';
import path from 'node:path';

const distRoot = path.join(process.cwd(), 'dist');
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

function isPageHref(href) {
  if (!href.startsWith('/') || href.startsWith('//')) return false;
  if (href === '/') return false;

  const cleanPath = href.split(/[?#]/, 1)[0];
  if (cleanPath.endsWith('/')) return false;

  const lastSegment = cleanPath.split('/').filter(Boolean).at(-1) ?? '';
  return !lastSegment.includes('.');
}

if (!fs.existsSync(distRoot)) {
  console.error('Rendered link check needs dist/. Run npm run build first.');
  process.exit(1);
}

walk(distRoot);

const failures = [];
const hrefRe = /\bhref=["']([^"']+)["']/g;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = hrefRe.exec(html))) {
    const href = match[1];
    if (isPageHref(href)) {
      failures.push({ file: path.relative(distRoot, file), href });
    }
  }
}

if (failures.length) {
  console.error(`Rendered link check failed: ${failures.length} slashless internal page hrefs.`);
  for (const { file, href } of failures.slice(0, 100)) {
    console.error(`${file}: ${href}`);
  }
  if (failures.length > 100) {
    console.error(`...and ${failures.length - 100} more.`);
  }
  process.exit(1);
}

console.log(`Rendered link check passed: ${htmlFiles.length} HTML files, no slashless internal page hrefs.`);
