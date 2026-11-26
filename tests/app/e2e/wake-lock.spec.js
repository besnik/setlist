// Screen stays on (product spec songs.md, "Song view (M3)", Screen stays on): the
// Song view holds a screen wake lock while it is shown, releases it on close and
// asks again when the page becomes visible; without the API it works as usual.
// Headless browsers have no real screen lock, so a fake navigator.wakeLock records
// what the app asks for. That the screen really stays on, the CEO checks on a phone.

import { test, expect } from '@playwright/test';

const SONG = './#/song/sample-house-of-the-rising-sun';

// Replaces navigator.wakeLock with a fake that counts requests and held locks.
function fakeWakeLock() {
  window.wakeLockLog = { requests: 0, held: 0 };
  const log = window.wakeLockLog;
  const locks = [];
  // The browser's own release when the page is hidden.
  window.releaseWakeLocks = () => locks.forEach((lock) => lock.release());
  Object.defineProperty(navigator, 'wakeLock', {
    configurable: true,
    value: {
      async request(type) {
        if (type !== 'screen') throw new TypeError('unexpected type');
        log.requests += 1;
        log.held += 1;
        const lock = {
          released: false,
          async release() {
            if (!lock.released) log.held -= 1;
            lock.released = true;
          },
        };
        locks.push(lock);
        return lock;
      },
    },
  });
}

// Sets the page's visibility as if the user switched apps; the browser then also
// releases the lock itself.
function setVisible(visible) {
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: visible ? 'visible' : 'hidden' });
  if (!visible) window.releaseWakeLocks();
  document.dispatchEvent(new Event('visibilitychange'));
}

const log = (page) => page.evaluate(() => ({ ...window.wakeLockLog }));

// Rules: on while the Song view is shown; off again after closing.
test('the Song view holds the screen lock until it is closed', async ({ page }) => {
  await page.addInitScript(fakeWakeLock);
  await page.goto('./');
  expect(await log(page)).toEqual({ requests: 0, held: 0 });

  await page.getByRole('link', { name: /House of the Rising Sun/ }).click();
  await expect.poll(() => log(page)).toEqual({ requests: 1, held: 1 });

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('searchbox')).toBeVisible();
  await expect.poll(() => log(page)).toEqual({ requests: 1, held: 0 });
});

// Rule: back from another app, the screen stays on again (one lock, not two).
test('the lock is requested again when the page becomes visible', async ({ page }) => {
  await page.addInitScript(fakeWakeLock);
  await page.goto(SONG);
  await expect.poll(() => log(page)).toEqual({ requests: 1, held: 1 });

  await page.evaluate(setVisible, false);
  await page.evaluate(setVisible, true);
  await expect.poll(() => log(page)).toEqual({ requests: 2, held: 1 });
  // A visibility event while the lock is still held asks for nothing more.
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(await log(page)).toEqual({ requests: 2, held: 1 });
});

// Rule: without support (or when refused) the Song view works as usual, no message.
for (const [name, setup] of [
  ['unsupported', () => Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: undefined })],
  ['refused', () => Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: () => Promise.reject(new DOMException('Not allowed', 'NotAllowedError')) } })],
]) {
  test(`the Song view works when the screen lock is ${name}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    await page.addInitScript(setup);
    await page.goto(SONG);
    await expect(page.getByRole('heading', { name: 'House of the Rising Sun' })).toBeVisible();
    await page.getByRole('button', { name: 'Larger text' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('searchbox')).toBeVisible();
    expect(errors).toEqual([]);
  });
}
