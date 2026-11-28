# App shell

- **Status:** approved

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

### Install and offline

See [install-offline.md](install-offline.md).

## UX and visual design

Tokens and components: [design guidelines](../design/guidelines.md).

**Page**

- Light and dark colors switch with the system setting right away, without a reload; the browser's own bar matches the page background in both themes.
- Fonts are self-hosted (see the guidelines); the page is readable in the fallback fonts before they load.

**Column**

```
phone (320–599 px)                     tablet / desktop (≥ 600 px)
┌────────────────────┐                 ┌──────────────────────────────────────────┐
│16│  content    │16 │                 │        │  content, max 720 px  │        │
│  │  column     │   │                 │  auto  │  24 px gutter inside  │  auto  │
└────────────────────┘                 └──────────────────────────────────────────┘
```

- One centered column with a maximum width; a narrower side gutter on phones, a wider one from 600 px.
- The page scrolls vertically only: long words wrap or are shortened with an ellipsis, so nothing widens the page.
- On phones with a notch in landscape the browser keeps the content inside the safe area by itself.
- No top app bar: the screen heading is the top of the page. The tab bar comes in M6.

The exact values (column width, gutters, paddings, theme colors) live in `app/styles/tokens.css`, `app/styles/base.css` and `app/index.html`.

## Out of scope

- Accessibility work beyond good defaults: ARIA labels, screen reader support, high-contrast modes (CEO decision — audience is everyday musicians).
- User accounts, sync between devices, a backend.
- Translations of the UI (an idea in the inbox).
- Install, offline and updates: see [install-offline.md](install-offline.md).

## Open questions

None.
