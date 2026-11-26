// Errors and logging (ARCHITECTURE.md, "Errors and logging"; ADR 0007): the app
// writes to the console with the [setlist] prefix — one info line at start-up,
// errors nothing else caught, and a warning when a feature fails unexpectedly.

import { test, expect } from '@playwright/test';

function consoleOf(page) {
  const messages = [];
  page.on('console', (message) => messages.push({ type: message.type(), text: message.text() }));
  return messages;
}

const ofApp = (messages) => messages.filter(({ text }) => text.startsWith('[setlist]'));

test('start-up logs one info line with the version', async ({ page }) => {
  const messages = consoleOf(page);
  await page.goto('./');
  await expect.poll(() => ofApp(messages)).toEqual([{ type: 'info', text: expect.stringMatching(/^\[setlist\] Started, version /) }]);
});

test('an error nothing else caught is logged as an error', async ({ page }) => {
  const messages = consoleOf(page);
  await page.goto('./');
  await page.evaluate(() => {
    setTimeout(() => { throw new Error('thrown on purpose'); });
    Promise.reject(new Error('rejected on purpose'));
  });
  await expect.poll(() => ofApp(messages).filter(({ type }) => type === 'error').map(({ text }) => text.split(' ').slice(0, 3).join(' ')).sort())
    .toEqual(['[setlist] Uncaught error', '[setlist] Unhandled promise']);
});

// An unexpected failure of the screen lock (not a refusal) is not hidden.
test('an unexpected screen lock failure is logged as a warning', async ({ page }) => {
  const messages = consoleOf(page);
  await page.addInitScript(() => Object.defineProperty(navigator, 'wakeLock', {
    configurable: true,
    value: { request: () => Promise.reject(new TypeError('broken on purpose')) },
  }));
  await page.goto('./#/song/sample-house-of-the-rising-sun');
  await expect.poll(() => ofApp(messages).filter(({ type }) => type === 'warning').map(({ text }) => text))
    .toEqual([expect.stringMatching(/^\[setlist\] Screen lock not available/)]);
});
