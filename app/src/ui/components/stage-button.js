// Stage button (product spec songs.md, "Song view screen (M3)"): a round 56 px
// button for stage screens, one tap on stage. Its name is the accessible name and
// the tooltip shown with a mouse.

import { html } from '../html.js';

/**
 * @param {{ name: string, action: string, content: ReturnType<typeof html> | string }} button
 *   name: e.g. 'Close'; action: the data-action of the click (ui/events.js); content: icon or text
 */
export function stageButton({ name, action, content }) {
  return html`<button class="stage-button" type="button" aria-label="${name}" title="${name}" data-action="${action}">${content}</button>`;
}

/** The close icon: an × drawn as a 24 px line icon in the text color. */
export const CLOSE_ICON = html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
