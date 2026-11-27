// Song view (product spec songs.md, "Song view (M3)": Open and close, Content, and
// the Song view screen UX): opening from the list and by address, closing with ×,
// Back and Escape, and the Songs screen state kept on return.

import { test, expect } from '@playwright/test';

const search = (page) => page.getByRole('searchbox', { name: 'Search songs' });
const closeButton = (page) => page.getByRole('button', { name: 'Close' });
const songsHeading = (page) => page.getByRole('heading', { name: 'Songs' });
const hash = (page) => page.evaluate(() => location.hash);

// Rules (Open and close, Content): a tap opens the song at its own address, scrolled
// to the top, with title, artist, key chip and the text as written.
test('tapping a row opens the Song view', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: /House of the Rising Sun/ }).click();

  await expect(page.getByRole('heading', { name: 'House of the Rising Sun' })).toBeVisible();
  expect(await hash(page)).toBe('#/song/sample-house-of-the-rising-sun');
  await expect(page.locator('.song-header__artist')).toHaveText('Traditional');
  await expect(page.locator('.song-header .key-chip')).toHaveText('Am');
  const sheet = page.locator('.song-sheet');
  // Spaces are kept, so a chord stays above its word.
  expect(await sheet.evaluate((el) => el.textContent.split('\n')[0])).toBe('   Am      C        D          F');
  expect(await sheet.evaluate((el) => getComputedStyle(el).fontFamily)).toContain('JetBrains Mono');
  expect(await page.evaluate(() => document.fonts.check('400 16px "JetBrains Mono"'))).toBe(true);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(closeButton(page)).toBeVisible();
});

// Rule (Open and close): the address of a song shows its Song view, also after a reload.
test('a song address opens the Song view directly and after a reload', async ({ page }) => {
  await page.goto('./#/song/sample-greensleeves');
  await expect(page.getByRole('heading', { name: 'Greensleeves' })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Greensleeves' })).toBeVisible();
});

// Rule (Open and close): an unknown song id shows the Songs screen at its own address.
test('an unknown song id shows the Songs screen', async ({ page }) => {
  await page.goto('./#/song/no-such-song');

  await expect(songsHeading(page)).toBeVisible();
  expect(new URL(page.url()).pathname).toBe('/setlist/app/');
  expect(await hash(page)).toBe('');
});

// Rules (Open and close): ×, Back and Escape each return to the Songs screen with
// the same search text, filtered list and scroll position.
for (const [name, close] of [
  ['the close button', (page) => closeButton(page).click()],
  ['Back', (page) => page.goBack()],
  ['Escape', (page) => page.keyboard.press('Escape')],
]) {
  test(`closing with ${name} keeps the search text and the scroll position`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 300 });
    await page.goto('./');
    await search(page).fill('Traditional');
    // Scroll to the last row first: a click scrolls its target into view anyway.
    const row = page.locator('.song-row', { hasText: 'When the Saints' });
    await row.scrollIntoViewIfNeeded();
    const scrolled = await page.evaluate(() => window.scrollY);
    expect(scrolled).toBeGreaterThan(0);

    await row.click();
    await expect(closeButton(page)).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await close(page);

    await expect(songsHeading(page)).toBeVisible();
    expect(await hash(page)).toBe('');
    await expect(search(page)).toHaveValue('Traditional');
    await expect(page.locator('.song-row')).toHaveCount(5);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);
  });
}

// Rule (Open and close): opened directly by its address, × shows the Songs screen —
// the app does not go back to the previous website.
test('the close button after a direct address stays in the app', async ({ page }) => {
  await page.goto('about:blank');
  await page.goto('./#/song/sample-amazing-grace');
  await closeButton(page).click();

  await expect(songsHeading(page)).toBeVisible();
  expect(new URL(page.url()).pathname).toBe('/setlist/app/');
  expect(await hash(page)).toBe('');
});

// Rules (Content; UX self-check): on a 320 px phone the bar sits at the top, the
// title and long lines wrap, the bar stays visible while the text scrolls, and the
// page never scrolls horizontally.
test('the Song view fits a 320 px phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 400 });
  await page.goto('./#/song/sample-house-of-the-rising-sun');

  const bar = page.locator('.stage-bar');
  expect((await bar.boundingBox()).y).toBe(0);
  expect((await closeButton(page).boundingBox()).width).toBe(56);
  const titleHeight = await page.locator('.song-header h1').evaluate((el) => el.getBoundingClientRect().height);
  expect(titleHeight).toBeGreaterThan(40); // two lines of the 28 px title step

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  expect((await bar.boundingBox()).y).toBe(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});

// Rule (Chord lines) and UX (Song sheet): a chord line is bold in the chord color,
// a lyric line keeps weight 400 in ink.
test('chord lines are bold in the chord color, lyric lines are not', async ({ page }) => {
  await page.goto('./#/song/sample-house-of-the-rising-sun');
  const chordLine = page.locator('.song-sheet .chord-line').first();
  await expect(chordLine).toHaveText('   Am      C        D          F');
  const style = (locator) => locator.evaluate((el) => ({ weight: getComputedStyle(el).fontWeight, color: getComputedStyle(el).color }));
  const chord = await style(chordLine);
  const sheet = await style(page.locator('.song-sheet'));
  const chordColor = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--color-chord)';
    document.body.append(probe);
    return getComputedStyle(probe).color;
  });
  expect(chord).toEqual({ weight: '700', color: chordColor });
  // The lyric line "There is a house in New Orleans" is plain text of the sheet.
  expect(await page.locator('.song-sheet').evaluate((el) => el.childNodes[1].textContent)).toContain('There is a house in New Orleans');
  expect(sheet.weight).toBe('400');
  expect(sheet.color).not.toBe(chordColor);
});
