#!/usr/bin/env node
// Keeps the shared site shell (head theme snippet, header + mobile nav, footer) identical
// across frontend/*.html. The canonical markup lives in scripts/shell.template.html; each page
// holds the same blocks between <!-- partial:NAME:start --> / <!-- partial:NAME:end --> markers.
//
//   node scripts/sync-shell.mjs          rewrite the pages from the template
//   node scripts/sync-shell.mjs --check  exit non-zero if any page has drifted (used in CI)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const frontend = join(root, 'frontend');
const checkOnly = process.argv.includes('--check');

const template = readFileSync(join(root, 'scripts', 'shell.template.html'), 'utf8');
const templateBlocks = [...template.matchAll(/<!-- partial:([\w-]+):start -->([\s\S]*?)<!-- partial:\1:end -->/g)]
  .map(([, name, inner]) => ({ name, inner }));

if (!templateBlocks.length) throw new Error('shell.template.html has no partial blocks');

const blockPattern = (name) =>
  new RegExp(String.raw`(<!-- partial:${name}:start -->)([\s\S]*?)(<!-- partial:${name}:end -->)`);

const pages = readdirSync(frontend).filter((file) => file.endsWith('.html'));
const drifted = [];

for (const page of pages) {
  const file = join(frontend, page);
  const original = readFileSync(file, 'utf8');
  // The homepage keeps in-page anchors (#projects); every other page links back to index.html#...
  const home = page === 'index.html' ? '' : 'index.html';
  // Match the page's own line endings so the file doesn't end up with mixed CRLF/LF
  const eol = original.includes('\r\n') ? '\r\n' : '\n';

  let updated = original;
  for (const { name, inner } of templateBlocks) {
    if (!blockPattern(name).test(updated)) {
      throw new Error(`${page} is missing the partial:${name} markers`);
    }
    const rendered = inner.replaceAll('{{home}}', home).replace(/\r?\n/g, eol);
    updated = updated.replace(blockPattern(name), (_, start, _old, end) => `${start}${rendered}${end}`);
  }

  if (updated === original) continue;
  if (checkOnly) drifted.push(page);
  else writeFileSync(file, updated);
}

if (checkOnly && drifted.length) {
  console.error(`Shell drift in: ${drifted.join(', ')}. Fix with: node scripts/sync-shell.mjs`);
  process.exit(1);
}
console.log(checkOnly ? 'Shell is in sync.' : `Shell synced for: ${pages.join(', ')}`);
