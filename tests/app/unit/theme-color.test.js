// App shell (product spec app-shell.md, UX): the browser's own bar matches the page.
// <meta name="theme-color"> cannot use var(), so its hex values must stay in sync
// with --color-bg in styles/tokens.css for both themes.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../../../app/${path}`, import.meta.url), 'utf8');

test('theme-color matches --color-bg in light and dark', () => {
  const html = read('index.html');
  const css = read('styles/tokens.css');
  const [light, dark] = [...css.matchAll(/--color-bg:\s*(#[0-9a-f]+)/gi)].map((match) => match[1].toLowerCase());
  const meta = (scheme) =>
    new RegExp(`<meta name="theme-color" content="(#[0-9a-f]+)" media="\\(prefers-color-scheme: ${scheme}\\)">`, 'i').exec(html)?.[1].toLowerCase();

  assert.equal(meta('light'), light);
  assert.equal(meta('dark'), dark);
});
