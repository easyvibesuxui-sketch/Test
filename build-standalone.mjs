/**
 * Builds standalone.html — the whole hall in one file, three.js included, no
 * network requests at all. Handy for dropping the experience onto any host, or
 * opening it straight from disk.
 *
 *   node build-standalone.mjs            (needs esbuild available)
 */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const root = import.meta.dirname;
const vendor = join(root, 'vendor/three');

// esbuild resolves the bare "three" specifier through this alias, and the addon
// imports are rewritten to absolute paths in a scratch copy of app.js
const tmp = mkdtempSync(join(tmpdir(), 'hall-'));
const entry = join(tmp, 'entry.js');
writeFileSync(entry, readFileSync(join(root, 'app.js'), 'utf8')
  .replace(/from 'three\/addons\//g, `from '${vendor}/addons/`));

const bundle = join(tmp, 'bundle.js');
execFileSync('npx', [
  '--yes', 'esbuild',
  entry, '--bundle', '--format=iife', '--minify', `--outfile=${bundle}`,
  `--alias:three=${vendor}/three.module.min.js`,
], { stdio: 'inherit' });

const code = readFileSync(bundle, 'utf8');
const html = readFileSync(join(root, 'index.html'), 'utf8')
  // no external font, no import map, no module script: everything is inline
  .replace(/\n *<link rel="preconnect"[^>]*>/g, '')
  .replace(/\n *<link href="https:\/\/fonts\.googleapis[^>]*>/g, '')
  .replace(/\n *<script type="importmap">[\s\S]*?<\/script>/, '')
  // A function replacer, never a string: minified code contains `$&&`, and in a
  // replacement string `$&` means "the matched text", which splices the script
  // tag into the middle of the bundle and truncates the page.
  .replace(/\n *<script type="module" src="\.\/app\.js"><\/script>/,
           () => `\n<script>\n${code}\n</script>`);

// the inline bundle plus the small loader fallback: exactly two script tags
const tags = html.match(/<\/script>/g) ?? [];
if (tags.length !== 2){
  throw new Error(`expected 2 script tags in the output, found ${tags.length} — the bundle leaked markup`);
}

writeFileSync(join(root, 'standalone.html'), html);
console.log(`standalone.html written — ${(html.length / 1024).toFixed(0)} KB`);
