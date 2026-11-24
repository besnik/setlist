# App shell

- **Status:** approved (UX and visual design follow in T-012)

<!-- Based on the CEO's prototype — see docs/design/prototype-reference.md. -->

## Purpose

What surrounds every screen: where the app lives, how it starts, how it adapts to the device and the light. The app must be usable on a phone, a tablet and a laptop, without installation or registration.

## Behavior

### Start and address

- Rule: the app opens at `https://besnik.github.io/setlist/app/` and shows the Songs screen.
- Rule: `https://besnik.github.io/setlist/` redirects to the app (until a signpost page exists).
- Rule: the browser tab and the page title read "Setlist".
- Rule: the app loads nothing from other websites (fonts and all assets come with the app).

### Language

- Rule: all texts of the app are in English. Song content can be in any language.

### Theme

- Rule: the app follows the system setting: light colors when the system is light, dark colors when it is dark, and it switches when the system setting changes.
- Rule: there is no theme switch in the app.

### Screen sizes

- Rule: the app works from a 320 px wide phone up to a desktop window, in portrait and landscape; the page never scrolls horizontally.
- Rule: on wide screens the content stays in one centered column.

### Navigation *(planned — M6)*

A bottom tab bar Songs / Setlists arrives with setlists. Before that the app has a single screen.

### Install and offline *(planned — M2)*

## UX and visual design

To be written in task T-012 (design foundation), based on the [prototype reference](../design/prototype-reference.md).

## Out of scope

- Accessibility work beyond good defaults: ARIA labels, screen reader support, high-contrast modes (CEO decision — audience is everyday musicians).
- User accounts, sync between devices, a backend.
- Translations of the UI (an idea in the inbox).

## Open questions

None.
