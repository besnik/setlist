// App shell (product spec app-shell.md): theme, fonts, screen sizes and the
// content column.

import { test, expect } from '@playwright/test';

const LIGHT_BG = 'rgb(243, 244, 246)'; // --color-bg #f3f4f6
const DARK_BG = 'rgb(14, 16, 19)'; // --color-bg #0e1013

const background = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

// Rule (Theme): the app follows the system setting and switches when it changes.
test('the theme follows the system setting without a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('./');
  expect(await background(page)).toBe(LIGHT_BG);

  await page.emulateMedia({ colorScheme: 'dark' });
  expect(await background(page)).toBe(DARK_BG);
});

// Rule (Start and address): the app loads nothing from other websites; the fonts come with it.
test('fonts and all assets come from the app', async ({ page, baseURL }) => {
  const foreign = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL).origin) foreign.push(request.url());
  });

  await page.goto('./');
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() =>
    [...document.fonts].filter((font) => font.status === 'loaded').map((font) => `${font.family} ${font.weight}`),
  );

  expect(loaded).toContain('Bricolage Grotesque 700');
  expect(foreign).toEqual([]);
});

// Rule (Screen sizes): works from a 320 px phone; the page never scrolls horizontally.
test('a 320 px wide phone has no horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('./');
  await page.evaluate(() => {
    document.getElementById('app').insertAdjacentHTML('beforeend', `<p>${'Supercalifragilistic'.repeat(10)}</p>`);
  });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});

// Rule (Screen sizes): on wide screens the content stays in one centered column (720 px).
test('a wide screen shows one centered 720 px column', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('./');

  const box = await page.locator('#app').boundingBox();
  expect(box.width).toBe(720);
  expect(box.x).toBe((1280 - 720) / 2);
});
