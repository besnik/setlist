// Unit tests of the project check (tools/check.js): the rules in ARCHITECTURE.md
// that the check enforces — header comments, part isolation, app layers and the
// files HTML and CSS load.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assetProblems, assetReferencesOf, headerProblem, importProblems, importsOf } from '../../tools/check.js';

const all = () => true;

// Rule: every source file starts with a header comment (a doctype may come first).
test('header comment is required', () => {
  assert.equal(headerProblem('app/src/main.js', '// Start-up.\nfoo();'), null);
  assert.equal(headerProblem('app/index.html', '<!doctype html>\n<!-- Entry page. -->'), null);
  assert.match(headerProblem('app/src/main.js', 'foo();\n'), /missing header comment/);
});

// Static imports, re-exports and dynamic imports are found; commented-out ones are not.
test('imports are found', () => {
  const source = `import { a } from './a.js';\nimport './b.js';\nexport { c } from "./c.js";\nconst d = import('./d.js');\n// import x from './x.js';`;
  assert.deepEqual(importsOf(source), ['./a.js', './b.js', './c.js', './d.js']);
});

// Layers: main.js → ui → data → domain; imports point only to the right.
test('layer imports follow main → ui → data → domain', () => {
  assert.deepEqual(importProblems('app/src/ui/songs.js', `import { x } from '../domain/song.js';`, all), []);
  assert.deepEqual(importProblems('app/src/main.js', `import { x } from './data/songs.js';`, all), []);
  assert.match(importProblems('app/src/domain/song.js', `import { x } from '../ui/songs.js';`, all)[0], /domain layer may import only: domain/);
  assert.match(importProblems('app/src/data/songs.js', `import { x } from '../ui/songs.js';`, all)[0], /from the ui layer/);
});

// The app has no runtime dependencies and no CDN; imported files must exist.
test('the app imports only existing relative files', () => {
  assert.match(importProblems('app/src/ui/a.js', `import x from 'lit-html';`, all)[0], /no runtime dependencies/);
  assert.match(importProblems('app/src/ui/a.js', `import x from 'https://cdn.example/x.js';`, all)[0], /no runtime dependencies/);
  assert.match(importProblems('app/src/ui/a.js', `import x from './b';`, () => false)[0], /does not exist/);
});

// Parts are isolated; only app/src/domain may be shared, and never with tools/.
test('parts are isolated', () => {
  assert.deepEqual(importProblems('importer/parse.js', `import x from '../app/src/domain/song.js';`, all), []);
  assert.match(importProblems('importer/parse.js', `import x from '../app/src/ui/songs.js';`, all)[0], /another part/);
  assert.match(importProblems('tools/x.js', `import x from '../app/src/domain/song.js';`, all)[0], /another part/);
  assert.match(importProblems('app/src/ui/a.js', `import x from '../../../tools/serve.js';`, all)[0], /another part/);
  assert.deepEqual(importProblems('tests/app/unit/a.test.js', `import x from '../../../app/src/ui/a.js';`, all), []);
});

// Files loaded by HTML and CSS are found; canonical links, data: URLs and comments are not.
test('HTML and CSS references are found', () => {
  const html = `<link rel="stylesheet" href="styles/a.css"><script type="module" src='src/main.js'></script>
<link rel="canonical" href="app/"><img src=icon.png><!-- <script src="old.js"></script> -->
<style>body { background: url("bg.png"); }</style><p>Text with url(not-loaded.png)</p>`;
  assert.deepEqual(assetReferencesOf('app/index.html', html), ['styles/a.css', 'src/main.js', 'icon.png', 'bg.png']);
  const css = `@import "b.css";\n@font-face { src: url(../assets/f.woff2) format("woff2"); }\n.x { background: url('data:image/png;base64,AA'); }\n/* url(old.png) */`;
  assert.deepEqual(assetReferencesOf('app/styles/a.css', css), ['b.css', '../assets/f.woff2']);
});

// Rule (app-shell.md, Start and address): the app loads nothing from other websites.
test('HTML and CSS load only existing files of their own part', () => {
  assert.deepEqual(assetProblems('app/styles/fonts.css', 'src: url("../assets/f.woff2");', all), []);
  assert.match(assetProblems('app/index.html', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2">', all)[0], /nothing comes from other websites/i);
  assert.match(assetProblems('app/index.html', '<script src="//cdn.example/x.js"></script>', all)[0], /other websites/);
  assert.match(assetProblems('app/index.html', '<script src="/src/main.js"></script>', all)[0], /root path/);
  assert.match(assetProblems('app/styles/a.css', '@import "../../site/x.css";', all)[0], /another part/);
  assert.match(assetProblems('app/styles/a.css', 'src: url(../assets/missing.woff2);', () => false)[0], /does not exist/);
});
