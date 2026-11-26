// Offline and updates (product spec install-offline.md, "Offline" and "Updates"),
// in Chromium. Each test runs its own small server for app/, because the browser's
// check for a new app/sw.js bypasses Playwright's request routing: the server can
// publish a new version (app/sw.js with another VERSION), fail a file, or stop.
// The worker is turned on for localhost with '?sw' (src/data/app-version.js).

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { test as base, expect } from '@playwright/test';

const APP = new URL('../../../app/', import.meta.url);
const WORKER = readFileSync(new URL('sw.js', APP), 'utf8');
const VERSION = /const VERSION = '([^']+)'/.exec(WORKER)[1];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };

/** A server for app/ at /setlist/app/ whose published version and failures the test controls. */
async function startServer() {
  const server = {
    version: VERSION,
    failing: new Set(),
    http: createServer(async (req, res) => {
      let path = new URL(req.url, 'http://localhost').pathname.replace(/^\/setlist\/app\//, '');
      if (path === '') path = 'index.html';
      try {
        if (server.failing.has(path)) throw new Error('failing on purpose');
        const body = path === 'sw.js'
          ? WORKER.replace(`'${VERSION}'`, `'${server.version}'`)
          : await readFile(new URL(path, APP));
        res.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
        res.end(body);
      } catch {
        res.writeHead(404).end();
      }
    }),
  };
  await new Promise((resolve) => server.http.listen(0, 'localhost', resolve));
  server.start = `http://localhost:${server.http.address().port}/setlist/app/?sw`;
  server.stop = () => new Promise((resolve) => server.http.close(resolve));
  return server;
}

const test = base.extend({
  server: async ({}, use) => {
    const server = await startServer();
    await use(server);
    server.http.closeAllConnections();
    await server.stop();
  },
});

test.skip(({ browserName }) => browserName !== 'chromium', 'offline and updates are tested in Chromium only');

/** Opens the app the first time and waits until the worker is active and controls the page. */
async function firstVisit(page, server) {
  await page.goto(server.start);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); // the version line shows once the worker is active
  await expect(page.locator('.version-line')).toHaveText(`Version ${VERSION}`);
}

/** Closes every page of the app and opens it again: the next start. */
async function restart(context, server) {
  await Promise.all(context.pages().map((page) => page.close()));
  const page = await context.newPage();
  await page.goto(server.start);
  return page;
}

/** Makes the browser look for a new version now; returns whether one is waiting. */
async function checkForUpdate(page) {
  return page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration.update();
    const worker = registration.installing;
    if (worker) {
      await new Promise((resolve) =>
        worker.addEventListener('statechange', () => ['installed', 'redundant'].includes(worker.state) && resolve()));
    }
    return Boolean(registration.waiting);
  });
}

/** Takes the network away: the browser is offline and the server is gone. */
async function goOffline(context, server) {
  await context.setOffline(true);
  server.http.closeAllConnections();
  await server.stop();
}

// Rule (Offline): after one visit with a network, the app starts and works without one —
// the song list, search and the fonts.
test('works offline after the first visit', async ({ context, page, server }) => {
  await firstVisit(page, server);
  await goOffline(context, server);

  const failed = [];
  context.on('requestfailed', (request) => failed.push(request.url()));
  const offline = await restart(context, server);
  await expect(offline.getByRole('heading', { name: 'Songs' })).toBeVisible();
  await offline.getByRole('searchbox', { name: 'Search songs' }).fill('greensleeves');
  await expect(offline.locator('.song-row')).toHaveCount(1);
  expect(await offline.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].filter((font) => font.status === 'loaded').map((font) => font.family);
  })).toContain('Bricolage Grotesque');
  await expect(offline.locator('.version-line')).toHaveText(`Version ${VERSION}`);
  expect(failed, 'every file comes from the stored app').toEqual([]);
});

// Rules (Updates): a new version downloads in the background and is used from the
// next start; a reload alone keeps the current version. Old versions are removed.
test('a new version is used after all pages are closed and the app opened again', async ({ context, page, server }) => {
  await firstVisit(page, server);
  server.version = '2099.01.01';

  expect(await checkForUpdate(page)).toBe(true);
  await page.reload();
  await expect(page.locator('.version-line')).toHaveText(`Version ${VERSION}`);

  const restarted = await restart(context, server);
  await expect(restarted.locator('.version-line')).toHaveText('Version 2099.01.01');
  expect(await restarted.evaluate(() => caches.keys())).toEqual(['setlist-2099.01.01']);
});

// Rule (Updates): when the download of a new version fails, the app keeps working in
// its current version, also without a network.
test('a failed update keeps the current version', async ({ context, page, server }) => {
  await firstVisit(page, server);
  server.version = '2099.01.01';
  server.failing.add('styles/base.css');

  expect(await checkForUpdate(page)).toBe(false);
  await goOffline(context, server);

  const restarted = await restart(context, server);
  await expect(restarted.getByRole('heading', { name: 'Songs' })).toBeVisible();
  await expect(restarted.locator('.version-line')).toHaveText(`Version ${VERSION}`);
  expect(await restarted.evaluate(() => caches.keys())).toEqual([`setlist-${VERSION}`]);
});

// Rule (Development): the dev server runs the app without a worker, so a reload shows
// edited files, and the version line is not shown.
test('the dev server runs without a service worker', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Songs' })).toBeVisible();
  expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
  await expect(page.locator('.version-line')).toHaveCount(0);
});
