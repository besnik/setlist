// Font size (product spec songs.md, "Song view (M3)", Font size): the valid sizes,
// one step smaller or larger within the limits, and the settings repository that
// remembers the size, validates what it reads and never throws without storage.

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_FONT_SIZE, canGrowFontSize, canShrinkFontSize, isFontSize, largerFontSize, smallerFontSize } from '../../../app/src/domain/font-size.js';

// Rule: from 12 to 32 px in steps of 2; the default is 16.
test('valid font sizes are the even sizes from 12 to 32', () => {
  assert.equal(DEFAULT_FONT_SIZE, 16);
  for (const size of [12, 14, 16, 30, 32]) assert.equal(isFontSize(size), true, size);
  for (const value of [10, 13, 34, 16.5, '16', null, undefined, NaN]) assert.equal(isFontSize(value), false, String(value));
});

// Rule: each tap is 2 px smaller or larger; nothing beyond the limits.
test('one step smaller or larger stops at the limits', () => {
  assert.equal(smallerFontSize(16), 14);
  assert.equal(largerFontSize(16), 18);
  assert.equal(smallerFontSize(12), 12);
  assert.equal(largerFontSize(32), 32);
  assert.deepEqual([12, 14, 30, 32].map(canShrinkFontSize), [false, true, true, true]);
  assert.deepEqual([12, 14, 30, 32].map(canGrowFontSize), [true, true, true, false]);
});

// The repository keeps the size in memory once set, so each test loads a fresh copy.
let loads = 0;
const freshRepository = () => import(`../../../app/src/data/settings-repository.js?test=${loads++}`);

/** A localStorage stand-in; `fail` makes every call throw as in a private window. */
function fakeStorage({ fail = false, items = {} } = {}) {
  const deny = () => {
    throw new DOMException('denied', 'SecurityError');
  };
  return {
    items,
    getItem: (key) => (fail ? deny() : (items[key] ?? null)),
    setItem: (key, value) => (fail ? deny() : (items[key] = String(value))),
  };
}

beforeEach(() => {
  globalThis.localStorage = fakeStorage();
});
afterEach(() => {
  delete globalThis.localStorage;
});

// Rule: the size is remembered on the device.
test('the font size is stored and read back', async () => {
  const first = await freshRepository();
  assert.equal(await first.getFontSize(), 16);
  await first.setFontSize(24);
  const afterRestart = await freshRepository();
  assert.equal(await afterRestart.getFontSize(), 24);
});

// Rule: a stored size that is not valid gives 16 px.
test('an invalid stored size gives the default', async () => {
  for (const stored of ['', 'big', '17', '40', '10', '16px']) {
    globalThis.localStorage = fakeStorage({ items: { 'setlist.fontSize': stored } });
    const { getFontSize } = await freshRepository();
    assert.equal(await getFontSize(), 16, stored);
  }
});

// Rule: without storage the buttons still work while the app stays open.
test('without storage the size is kept in memory and nothing throws', async () => {
  globalThis.localStorage = fakeStorage({ fail: true });
  const { getFontSize, setFontSize } = await freshRepository();
  assert.equal(await getFontSize(), 16);
  await setFontSize(20);
  assert.equal(await getFontSize(), 20);

  delete globalThis.localStorage; // no storage at all
  const other = await freshRepository();
  assert.equal(await other.getFontSize(), 16);
});
