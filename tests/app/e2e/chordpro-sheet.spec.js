// ChordPro sheet (product spec songs.md, "Song format (M4)", `chordpro` format, and
// the UX "Song sheet by format and source line (M4)") with the sample song
// A od Prešova: chords above their syllables also after a line wraps, no horizontal
// scroll, section marks in the margin, the comment, styles and the font size.

import { test, expect } from '@playwright/test';

const SONG = './#/song/sample-a-od-presova';
const larger = (page) => page.getByRole('button', { name: 'Larger text' });

async function tap(button, times) {
  for (let i = 0; i < times; i += 1) await button.click();
}

// For every piece with a chord and a syllable: the chord's left edge and the
// syllable's left edge, and whether the chord sits right above its syllable.
function chordPlaces(page) {
  return page.locator('.chordpro-piece:has(.chordpro-chord):has(.chordpro-text)').evaluateAll((pieces) =>
    pieces.map((piece) => {
      const chord = piece.querySelector('.chordpro-chord').getBoundingClientRect();
      const text = piece.querySelector('.chordpro-text').getBoundingClientRect();
      return { chord: piece.textContent, left: chord.left - text.left, gap: text.top - chord.bottom };
    }),
  );
}

// The number of lines that wrapped (their words stand in more than one row).
function wrappedLines(page) {
  return page.locator('.chordpro-line').evaluateAll((lines) =>
    lines.filter((line) => new Set([...line.querySelectorAll('.chordpro-text')].map((text) => Math.round(text.getBoundingClientRect().bottom))).size > 1).length,
  );
}

const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

// Rules (`chordpro`): a chord stays above its syllable, also when a line wraps;
// the page never scrolls horizontally (UX self-check: 320 px phone at 16 and 32 px).
test('chords stay above their syllables on a 320 px phone, also when lines wrap', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(SONG);
  await expect(page.locator('.chordpro-sheet')).toBeVisible();

  for (const size of [16, 32]) {
    if (size === 32) await tap(larger(page), 8);
    await expect(page.locator('.chordpro-sheet')).toHaveCSS('font-size', `${size}px`);
    const places = await chordPlaces(page);
    expect(places.length).toBeGreaterThan(30);
    for (const place of places) {
      expect(Math.abs(place.left), `${place.chord} starts over its syllable at ${size} px`).toBeLessThan(1);
      expect(Math.abs(place.gap), `${place.chord} sits right above its syllable at ${size} px`).toBeLessThan(1);
    }
    expect(await overflow(page)).toBe(0);
  }
  // At 32 px most lines of the song wrap.
  expect(await wrappedLines(page)).toBeGreaterThan(5);
});

// Rule (`chordpro`): a word with chords inside it is not split when a line wraps.
test('a word with a chord inside stays whole when the line wraps', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(SONG);
  await tap(larger(page), 8);
  const word = page.locator('.chordpro-word', { hasText: /^PreDšova$/ }); // Pre[D]šova
  await expect(word).toHaveCount(1);
  const [first, second] = await word.locator('.chordpro-text').evaluateAll((texts) => texts.map((text) => text.getBoundingClientRect()));
  expect(second.bottom).toBe(first.bottom);
  expect(second.left).toBeGreaterThanOrEqual(first.right - 0.5);
});

// Rules (`chordpro`, UX): verses are numbered 1., 2., 3. in a margin left of the
// lyrics, level with the lyrics of their first line; small mono, muted, not a chord.
test('verse marks stand in the margin, level with the first line', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(SONG);

  const marks = page.locator('.chordpro-mark__text');
  await expect(marks).toHaveText(['1.', '2.', '3.']);
  const style = await marks.first().evaluate((el) => {
    const css = getComputedStyle(el);
    return { size: css.fontSize, weight: css.fontWeight, family: css.fontFamily, color: css.color };
  });
  const muted = await page.locator('.song-header__artist').evaluate((el) => getComputedStyle(el).color);
  expect(style).toEqual({ size: '12.8px', weight: '700', family: expect.stringContaining('JetBrains Mono'), color: muted });

  const firstLine = page.locator('.chordpro-section').first().locator('.chordpro-line').first();
  const mark = await marks.first().boundingBox();
  const lyrics = await firstLine.locator('.chordpro-text').first().boundingBox();
  const sheet = await page.locator('.chordpro-sheet').boundingBox();
  expect(mark.x).toBeGreaterThanOrEqual(sheet.x - 0.5);
  expect(mark.x + mark.width).toBeLessThan(lyrics.x);
  // Level with the lyric row (not the chord row above it).
  expect(mark.y).toBeGreaterThan(lyrics.y);
  expect(mark.y + mark.height).toBeLessThan(lyrics.y + lyrics.height + 0.5);
  // The comment outside the verses also starts right of the margin.
  const comment = await page.locator('.chordpro-comment').boundingBox();
  expect(comment.x).toBeCloseTo(lyrics.x, 0);
});

// Rules (`chordpro`, UX): chords mono 700 in the chord color; lyrics in the body
// font, 400, ink; the comment muted, without a chord row.
test('chords, lyrics and the comment have their styles', async ({ page }) => {
  await page.goto(SONG);
  const style = (locator) =>
    locator.evaluate((el) => {
      const css = getComputedStyle(el);
      return { family: css.fontFamily, weight: css.fontWeight, color: css.color };
    });
  const colorOf = (token) =>
    page.evaluate((value) => {
      const probe = document.createElement('span');
      probe.style.color = value;
      document.body.append(probe);
      return getComputedStyle(probe).color;
    }, token);

  const chord = await style(page.locator('.chordpro-chord').first());
  expect(chord).toEqual({ family: expect.stringContaining('JetBrains Mono'), weight: '700', color: await colorOf('var(--color-chord)') });
  const lyrics = await style(page.locator('.chordpro-text').first());
  expect(lyrics).toEqual({ family: expect.stringContaining('DM Sans'), weight: '400', color: await colorOf('var(--color-ink)') });

  const comment = page.locator('.chordpro-comment');
  await expect(comment).toHaveText('/: :/ = 2×');
  expect((await style(comment)).color).toBe(await colorOf('var(--color-muted)'));
  await expect(comment.locator('.chordpro-chord')).toHaveCount(0);
});

// Rule (Font size): A+ grows lyrics, chords, marks and the comment; the title keeps its size.
test('the font size changes the whole ChordPro sheet only', async ({ page }) => {
  await page.goto(SONG);
  const sizes = () =>
    page.evaluate(() =>
      ['.chordpro-text', '.chordpro-chord', '.chordpro-mark__text', '.chordpro-comment', '.song-header h1'].map((selector) => getComputedStyle(document.querySelector(selector)).fontSize),
    );
  expect(await sizes()).toEqual(['16px', '16px', '12.8px', '16px', '28px']);
  await tap(larger(page), 2);
  expect(await sizes()).toEqual(['20px', '20px', '16px', '20px', '28px']);
});
