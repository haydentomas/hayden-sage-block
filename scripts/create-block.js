#!/usr/bin/env node
/**
 * Hayden Blocks - block scaffold generator (classic JS + block.json handles)
 *
 * Usage:
 *   npm run make:block section
 *   npm run make:block "feature grid"
 */

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const blocksDir = path.join(rootDir, 'blocks');
const scaffoldsDir = path.join(blocksDir, 'scaffolds');

function toSlug(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function toTitle(input) {
  const s = String(input).trim();
  if (!s) return '';
  return s
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((w) => (w ? (w[0].toUpperCase() + w.slice(1)) : ''))
    .join(' ');
}

function readTemplate(name) {
  const p = path.join(scaffoldsDir, name);
  if (!fs.existsSync(p)) {
    console.error(`Missing scaffold template: ${p}`);
    process.exit(1);
  }
  return fs.readFileSync(p, 'utf8');
}

function writeFile(dest, data) {
  fs.writeFileSync(dest, data, { encoding: 'utf8' });
}

const input = process.argv.slice(2).join(' ').trim();
if (!input) {
  console.error('Usage: npm run make:block <slug-or-title>');
  process.exit(1);
}

const slug = toSlug(input);
if (!slug) {
  console.error('Invalid slug/title. Try: npm run make:block section');
  process.exit(1);
}

const title = toTitle(input);
const destDir = path.join(blocksDir, slug);

if (fs.existsSync(destDir)) {
  console.error(`Block folder already exists: blocks/${slug}`);
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });

const replacements = {
  '{{slug}}': slug,
  '{{title}}': title || toTitle(slug) || slug,
};

function applyReplacements(str) {
  let out = str;
  for (const [k, v] of Object.entries(replacements)) {
    out = out.split(k).join(v);
  }
  return out;
}

const blockJson = applyReplacements(readTemplate('block.json.tpl'));
const editorJs  = applyReplacements(readTemplate('editor.js.tpl'));
const styleCss  = applyReplacements(readTemplate('style.css.tpl'));

writeFile(path.join(destDir, 'block.json'), blockJson);
writeFile(path.join(destDir, 'editor.js'), editorJs);
writeFile(path.join(destDir, 'style.css'), styleCss);

console.log(`✅ Created block: smart/${slug}`);
console.log(`   Folder: blocks/${slug}/`);
console.log('   Next: refresh editor (or reload plugin if needed).');
