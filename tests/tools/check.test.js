// Unit tests of the project check (tools/check.js): the rules in ARCHITECTURE.md
// that the check enforces — header comments, part isolation, app layers and the
// files HTML and CSS load, HTML written into the page only by the renderer, the
// offline file list of the service worker and a new version for every app change.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assetProblems, assetReferencesOf, headerProblem, importProblems, importsOf, offlineFilesOf, offlineListProblems,
  mainProblems, pureViewProblems, rawHtmlProblems, versionOf, versionProblems,
} from '../../tools/check.js';

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

// Only the renderer (app/src/ui/html.js) writes HTML into the page; reading it or a comment is fine.
test('app code writes HTML only through the renderer', () => {
  assert.match(rawHtmlProblems('app/src/ui/songs.js', `list.innerHTML = '<li>' + title;`)[0], /html`…` template/);
  assert.match(rawHtmlProblems('app/src/ui/songs.js', `el.insertAdjacentHTML('beforeend', x);`)[0], /insertAdjacentHTML/);
  assert.match(rawHtmlProblems('app/src/main.js', `document.write(x);`)[0], /document\.write/);
  assert.deepEqual(rawHtmlProblems('app/src/ui/html.js', `element.innerHTML = template.value;`), []);
  assert.deepEqual(rawHtmlProblems('app/src/ui/songs.js', `// never set innerHTML = x\nif (el.innerHTML === '') el.textContent = 'x';`), []);
  assert.deepEqual(rawHtmlProblems('tests/app/unit/x.test.js', `el.innerHTML = x;`), []);
});

// The offline list and the version are read from the service worker; commented-out entries do not count.
test('offline list and version are read from sw.js', () => {
  const source = `const VERSION = '2026.11.30';\nconst FILES = [\n  'index.html',\n  // 'old.js',\n  "src/main.js",\n];`;
  assert.deepEqual(offlineFilesOf(source), ['index.html', 'src/main.js']);
  assert.equal(versionOf(source), '2026.11.30');
  assert.equal(offlineFilesOf('const VERSION = "1";'), null);
  assert.equal(versionOf('const FILES = [];'), null);
});

// Rule (install-offline.md, Offline): every published app file is stored; sw.js and documentation are not.
test('offline list matches the published files of the app', () => {
  const files = ['app/index.html', 'app/sw.js', 'app/src/main.js', 'app/assets/fonts/README.md', 'app/assets/fonts/OFL-x.txt'];
  assert.deepEqual(offlineListProblems(['index.html', 'src/main.js'], files), []);
  assert.match(offlineListProblems(['index.html'], files)[0], /app\/src\/main\.js is missing from the offline file list/);
  assert.match(offlineListProblems(['index.html', 'src/main.js', 'gone.js'], files)[0], /names 'gone\.js', which is not a published file/);
  assert.match(offlineListProblems(['index.html', 'src/main.js', 'sw.js'], files)[0], /names 'sw\.js'/);
  assert.match(offlineListProblems(['index.html', 'src/main.js', 'assets/fonts/README.md'], files)[0], /names 'assets\/fonts\/README\.md'/);
  assert.match(offlineListProblems(null, files)[0], /no offline file list found/);
});

// Rule (install-offline.md, Updates): a change under app/ must come with a new version.
test('a change under app/ changes the version', () => {
  assert.deepEqual(versionProblems(['docs/a.md', 'tools/check.js'], '1', '1', 'origin/main'), []);
  assert.deepEqual(versionProblems(['app/src/main.js'], '2', '1', 'origin/main'), []);
  assert.deepEqual(versionProblems(['app/sw.js'], '1', null, 'HEAD^'), []); // the worker is new in the base
  assert.match(versionProblems(['app/src/main.js'], '1', '1', 'origin/main')[0], /changed against origin\/main \(app\/src\/main\.js\), but VERSION is still '1'/);
  assert.match(versionProblems(['app/README.md'], '1', '1', 'HEAD^')[0], /against HEAD\^/);
});

test('views and components are pure', () => {
  const view = 'app/src/ui/views/song-view.js';
  assert.deepEqual(pureViewProblems(view, [
    `import { html } from '../html.js';`,
    `import { songHash } from '../routes.js';`,
    `import { keyChip } from '../components/key-chip.js';`,
    `import { songCountLabel } from '../../domain/songs.js';`,
    `/** @param {import('../../domain/songs.js').Song} song */`,
    `// never touch document here`,
  ].join('\n')), []);
  assert.match(pureViewProblems(view, `import { getSong } from '../../data/song-repository.js';`)[0], /imports '..\/..\/data\/song-repository.js'.*pure/);
  assert.match(pureViewProblems(view, `import { render } from '../router.js';`)[0], /imports/);
  assert.match(pureViewProblems('app/src/ui/components/x.js', `const w = window.innerWidth;`)[0], /uses 'window'/);
  assert.match(pureViewProblems(view, `document.title = song.title;`)[0], /uses 'document'/);
  assert.deepEqual(pureViewProblems('app/src/ui/screens/song-screen.js', `window.scrollTo(0, 0);`), []);
});

test('main.js only wires the layers together', () => {
  const wiring = [
    `// start-up: never let state live here`,
    `const songsScreen = createSongsScreen();`,
    `await startRouter(document.getElementById('app'), { songs: songsScreen });`,
    `appVersion().then((version) => songsScreen.setVersion(version));`,
  ].join('\n');
  assert.deepEqual(mainProblems('app/src/main.js', wiring), []);
  assert.match(mainProblems('app/src/main.js', `let query = '';`)[0], /uses 'let'.*only wires/);
  assert.match(mainProblems('app/src/main.js', `window.addEventListener('hashchange', show);`)[0], /addEventListener/);
  assert.match(mainProblems('app/src/main.js', `function closeSong() { history.back(); }`).join(), /'function'.*'history'/s);
  assert.match(mainProblems('app/src/main.js', `delegate(root, 'click', {});`)[0], /uses 'delegate'/);
  assert.deepEqual(mainProblems('app/src/ui/router.js', `let latest = 0; history.back();`), []);
});
