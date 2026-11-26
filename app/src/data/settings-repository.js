// Settings repository: the device's preferences (ARCHITECTURE.md, data layer). Today
// only the font size of the song text (songs.md, "Song view (M3)", Font size).
// Preferences live in localStorage — enough for a few small values; songs get their
// own storage (M5). What is read is validated. When the browser does not allow
// storage (e.g. private mode), the value is kept in memory while the app is open,
// so nothing ever throws.

import { DEFAULT_FONT_SIZE, isFontSize } from '../domain/font-size.js';

const FONT_SIZE_KEY = 'setlist.fontSize';

/** @type {number | null} the last size set in this run; it wins over storage, which may have refused it */
let fontSizeInMemory = null;

/**
 * The chosen font size in px, or the default when none is stored or it is not valid.
 * @returns {Promise<number>}
 */
export async function getFontSize() {
  if (fontSizeInMemory !== null) return fontSizeInMemory;
  let stored = null;
  try {
    stored = localStorage.getItem(FONT_SIZE_KEY);
  } catch {
    // Storage not allowed: the default below.
  }
  const size = Number(stored);
  return isFontSize(size) ? size : DEFAULT_FONT_SIZE;
}

/**
 * Remembers the font size on the device (in memory only when storage fails).
 * @param {number} size a valid size (domain/font-size.js)
 * @returns {Promise<void>}
 */
export async function setFontSize(size) {
  fontSizeInMemory = size;
  try {
    localStorage.setItem(FONT_SIZE_KEY, String(size));
  } catch {
    // Storage not allowed or full: the size stays in memory while the app is open.
  }
}
