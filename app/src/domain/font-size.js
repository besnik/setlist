// Font size of the song text (product spec songs.md, "Song view (M3)", Font size):
// the limits, the step and the default, the check of a stored value, and one step
// smaller or larger. Pure logic, no browser APIs.

export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 32;
export const FONT_SIZE_STEP = 2;
export const DEFAULT_FONT_SIZE = 16;

/**
 * True for a valid size in px: a whole number from the minimum to the maximum, on a step.
 * @param {unknown} value
 * @returns {value is number}
 */
export function isFontSize(value) {
  return (
    Number.isInteger(value) &&
    value >= MIN_FONT_SIZE &&
    value <= MAX_FONT_SIZE &&
    (value - MIN_FONT_SIZE) % FONT_SIZE_STEP === 0
  );
}

/**
 * True when the size can get one step smaller (A− is enabled).
 * @param {number} size
 * @returns {boolean}
 */
export function canShrinkFontSize(size) {
  return size > MIN_FONT_SIZE;
}

/**
 * True when the size can get one step larger (A+ is enabled).
 * @param {number} size
 * @returns {boolean}
 */
export function canGrowFontSize(size) {
  return size < MAX_FONT_SIZE;
}

/**
 * The size one step smaller, or the same size at the minimum.
 * @param {number} size
 * @returns {number}
 */
export function smallerFontSize(size) {
  return Math.max(MIN_FONT_SIZE, size - FONT_SIZE_STEP);
}

/**
 * The size one step larger, or the same size at the maximum.
 * @param {number} size
 * @returns {number}
 */
export function largerFontSize(size) {
  return Math.min(MAX_FONT_SIZE, size + FONT_SIZE_STEP);
}
