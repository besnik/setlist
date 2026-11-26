// Font size (product spec songs.md, "Song view (M3)", Font size, and the Song view
// screen UX): A− and A+ change the song text in steps of 2 px from 12 to 32 px, are
// disabled at the limits, and the size is kept across songs and a reload.

import { test, expect } from '@playwright/test';

const smaller = (page) => page.getByRole('button', { name: 'Smaller text' });
const larger = (page) => page.getByRole('button', { name: 'Larger text' });
const sizeOf = (locator) => locator.evaluate((el) => getComputedStyle(el).fontSize);
const sheetSize = (page) => sizeOf(page.locator('.song-sheet'));

async function tap(button, times) {
  for (let i = 0; i < times; i += 1) await button.click();
}

// Rules: default 16 px; each tap 2 px; A− disabled at 12 px, A+ at 32 px; only the
// song text changes.
test('A− and A+ change the song text within 12–32 px', async ({ page }) => {
  await page.goto('./#/song/sample-house-of-the-rising-sun');
  expect(await sheetSize(page)).toBe('16px');
  await expect(smaller(page)).toHaveText('A−');
  const titleSize = await sizeOf(page.locator('.song-header h1'));
  const buttonSize = await sizeOf(larger(page));

  await larger(page).click();
  expect(await sheetSize(page)).toBe('18px');
  await tap(larger(page), 7);
  expect(await sheetSize(page)).toBe('32px');
  await expect(larger(page)).toBeDisabled();
  await expect(smaller(page)).toBeEnabled();
  await expect(larger(page)).toHaveCSS('opacity', '0.4');
  // A tap on a disabled button does nothing.
  await larger(page).click({ force: true });
  expect(await sheetSize(page)).toBe('32px');

  await tap(smaller(page), 10);
  expect(await sheetSize(page)).toBe('12px');
  await expect(smaller(page)).toBeDisabled();
  await expect(larger(page)).toBeEnabled();

  expect(await sizeOf(page.locator('.song-header h1'))).toBe(titleSize);
  expect(await sizeOf(larger(page))).toBe(buttonSize);
});

// Rule: the size is the same for all songs and remembered across closing and a reload.
test('the font size is kept across songs and a reload', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: /House of the Rising Sun/ }).click();
  await tap(larger(page), 3);
  expect(await sheetSize(page)).toBe('22px');

  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('link', { name: /Greensleeves/ }).click();
  expect(await sheetSize(page)).toBe('22px');

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Greensleeves' })).toBeVisible();
  expect(await sheetSize(page)).toBe('22px');
});

// Rule: a stored size that is not valid gives 16 px.
test('an invalid stored size shows 16 px', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('setlist.fontSize', '99'));
  await page.goto('./#/song/sample-greensleeves');
  expect(await sheetSize(page)).toBe('16px');
});

// Rule: without storage (e.g. private mode) the buttons still work while the app is open.
test('the buttons work when storage is not allowed', async ({ page }) => {
  await page.addInitScript(() => {
    const deny = () => {
      throw new DOMException('denied', 'SecurityError');
    };
    Object.defineProperty(window, 'localStorage', { get: deny });
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error));
  await page.goto('./#/song/sample-greensleeves');
  await larger(page).click();
  expect(await sheetSize(page)).toBe('18px');
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('link', { name: /Amazing Grace/ }).click();
  expect(await sheetSize(page)).toBe('18px');
  expect(errors).toEqual([]);
});

// UX self-check: on a 320 px phone the bar has × left and A−, A+ right, all 56 px,
// and at 32 px the longest sample line wraps without horizontal scroll.
test('the bar and the largest text fit a 320 px phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 500 });
  await page.goto('./#/song/sample-house-of-the-rising-sun');
  const close = await page.getByRole('button', { name: 'Close' }).boundingBox();
  const minus = await smaller(page).boundingBox();
  const plus = await larger(page).boundingBox();
  expect([close.width, minus.width, plus.width, plus.height]).toEqual([56, 56, 56, 56]);
  expect(minus.x - (close.x + close.width)).toBeGreaterThanOrEqual(112);
  expect(plus.x - (minus.x + minus.width)).toBe(8);
  const bar = await page.locator('.stage-bar').boundingBox();
  expect(close.x).toBe(bar.x);
  expect(plus.x + plus.width).toBe(bar.x + bar.width);

  await tap(larger(page), 8);
  expect(await sheetSize(page)).toBe('32px');
  for (const song of ['sample-house-of-the-rising-sun', 'sample-greensleeves', 'sample-amazing-grace', 'sample-when-the-saints']) {
    await page.goto(`./#/song/${song}`);
    await expect(page.locator('.song-sheet')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, song).toBe(0);
  }
});
