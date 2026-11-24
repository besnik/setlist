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

// Rule (UX, Column): side gutter --gutter is 16 px below 600 px and 24 px from 600 px.
test('the side gutter is 16 px on phones and 24 px from 600 px', async ({ page }) => {
  const gutter = () => page.locator('#app').evaluate((app) => getComputedStyle(app).paddingLeft);
  await page.setViewportSize({ width: 599, height: 800 });
  await page.goto('./');
  expect(await gutter()).toBe('16px');

  await page.setViewportSize({ width: 600, height: 800 });
  expect(await gutter()).toBe('24px');
});

// Rule (design guidelines, Fonts): every font file covers Latin Extended letters such as č, ľ, ň.
// A glyph the font has renders the same width whatever the fallback font is.
test('the fonts include Central European letters', async ({ page }) => {
  await page.goto('./');
  const missing = await page.evaluate(async () => {
    const fonts = [['Bricolage Grotesque', 700], ['DM Sans', 400], ['DM Sans', 600], ['JetBrains Mono', 700]];
    await Promise.all(fonts.map(([family, weight]) => document.fonts.load(`${weight} 40px "${family}"`, 'č')));
    const context = document.createElement('canvas').getContext('2d');
    const width = (font, text) => {
      context.font = font;
      return context.measureText(text).width;
    };
    const result = [];
    for (const [family, weight] of fonts) {
      for (const letter of 'čďľĺňŕšťžýôäČĽŠŽőłęś') {
        const serif = width(`${weight} 40px "${family}", serif`, letter);
        const mono = width(`${weight} 40px "${family}", monospace`, letter);
        if (serif !== mono) result.push(`${family} ${weight}: ${letter}`);
      }
    }
    return result;
  });
  expect(missing).toEqual([]);
});
