// Songs screen (product spec songs.md): the sample songs, the count, search and
// the empty state, and the row layout from the UX section.

import { test, expect } from '@playwright/test';

const rowTitles = (page) => page.locator('.song-row__title').allTextContents();
const search = (page) => page.getByRole('searchbox', { name: 'Search songs' });

// Rules (Song list, Sample songs): the first start lists the sample songs by title with artist, key and count.
test('the first start lists the sample songs', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('heading', { name: 'Songs' })).toBeVisible();
  await expect(page.getByText('4 songs')).toBeVisible();
  expect(await rowTitles(page)).toEqual([
    'Amazing Grace',
    'Greensleeves',
    'House of the Rising Sun',
    'When the Saints Go Marching In',
  ]);
  const first = page.locator('.song-row').first();
  await expect(first.locator('.song-row__artist')).toHaveText('Traditional');
  await expect(first.locator('.key-chip')).toHaveText('G');
  await expect(search(page)).not.toBeFocused();
});

// Rules (Search): filters as you type; the count stays; no match shows the empty state; clearing restores the list.
test('search filters the list as you type', async ({ page }) => {
  await page.goto('./');

  await search(page).pressSequentially('am');
  expect(await rowTitles(page)).toEqual(['Amazing Grace', 'House of the Rising Sun']);
  await expect(search(page)).toBeFocused();
  await expect(page.getByText('4 songs')).toBeVisible();

  await search(page).fill('xyz');
  await expect(page.getByText('No songs found.')).toBeVisible();
  await expect(page.locator('.song-row')).toHaveCount(0);

  await search(page).fill('');
  await expect(page.locator('.song-row')).toHaveCount(4);
});

// Rule (Song list): a long title ends with an ellipsis on one line; the page never scrolls horizontally.
test('a long title fits one line on a 320 px phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('./');

  const title = page.locator('.song-row__title', { hasText: 'When the Saints' });
  const { scrollWidth, clientWidth, height } = await title.evaluate((el) => ({
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
    height: el.getBoundingClientRect().height,
  }));
  expect(scrollWidth).toBeGreaterThan(clientWidth); // shortened, with the ellipsis from CSS
  expect(height).toBeLessThan(30); // one line of the 17 px row step
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});
