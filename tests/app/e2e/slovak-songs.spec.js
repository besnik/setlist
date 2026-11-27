// The Slovak sample songs (product spec songs.md, "Sample songs"): Tancuj, tancuj,
// vykrúcaj (`chordpro`, numbered verses, a chorus and its reference) and Tichá noc
// (`plain`); no horizontal scroll on a 320 px phone at 32 px.

import { test, expect } from '@playwright/test';

const TANCUJ = './#/song/sample-tancuj-tancuj-vykrucaj';
const TICHA_NOC = './#/song/sample-ticha-noc';
const larger = (page) => page.getByRole('button', { name: 'Larger text' });
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

// Rules (`chordpro`): verses 1., 2., the chorus mark R:, and the later repeat as a reference.
test('Tancuj, tancuj shows its verse numbers, the chorus and its reference', async ({ page }) => {
  await page.goto(TANCUJ);

  await expect(page.locator('.song-header h1')).toHaveText('Tancuj, tancuj, vykrúcaj');
  await expect(page.locator('.chordpro-mark__text')).toHaveText(['1.', 'R:', '2.', 'R:']);
  // The reference is the mark only: the chorus words appear once.
  await expect(page.locator('.chordpro-chorus-ref')).toHaveCount(1);
  await expect(page.getByText('Trá-la-la-la,').first()).toBeVisible();
  await expect(page.locator('.chordpro-section--chorus')).toHaveCount(1);
});

// Rule (Song view): the page never scrolls horizontally on a 320 px phone at 32 px.
for (const [name, address] of [['Tancuj, tancuj', TANCUJ], ['Tichá noc', TICHA_NOC]]) {
  test(`${name} fits a 320 px phone at 32 px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(address);
    for (let i = 0; i < 8; i += 1) await larger(page).click();
    await expect(page.locator('.song-sheet')).toHaveCSS('font-size', '32px');
    expect(await overflow(page)).toBe(0);
  });
}

// Rule (`plain`): Tichá noc is shown as chord lines and lyrics, with Slovak letters.
test('Tichá noc shows chord lines and its Slovak words', async ({ page }) => {
  await page.goto(TICHA_NOC);

  await expect(page.locator('.song-header__artist')).toHaveText('Franz X. Gruber, Joseph Mohr');
  await expect(page.locator('.chord-line')).toHaveCount(6);
  await expect(page.locator('.song-sheet')).toContainText('Anjeli zleteli,');
  await expect(page.locator('.song-sheet')).toContainText('Ježiško, Láska, Boh Syn!');
  await expect(page.getByText(/^Source:/)).toHaveCount(0);
});
