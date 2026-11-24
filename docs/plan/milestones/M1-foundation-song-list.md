# M1 — Foundation and song list

- **Status:** in-progress
- **Specs:** [app-shell.md](../../product-specs/app-shell.md), [songs.md](../../product-specs/songs.md)
- **Decisions:** [ADR 0004](../../decisions/0004-tech-stack-and-architecture.md), [ADR 0005](../../decisions/0005-dev-tooling-tests-and-deployment.md)

## Goal

Lay the foundation the whole MVP builds on — project skeleton, commands, tests, CI, deployment and the design foundation — and deliver the first visible feature on top of it: the list of sample songs with search.

## Try it

Open `https://besnik.github.io/setlist/app/` on the phone, the tablet and the laptop: the sample songs are listed, search filters them as you type, the colors follow the system's light or dark mode.

## Tasks

Order: T-012 and T-013 can run in parallel. After T-013: T-014 (deploys the empty skeleton early) and T-015. T-016 needs T-013; T-017 needs T-015 and T-016.

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-012 | Design foundation (Design lead): design principles for browse and stage screens, provisional tokens (colors, typography, spacing, radius) and components from the prototype, home in `docs/design/`; UX section of the M1 specs | [app-shell.md](../../product-specs/app-shell.md), [songs.md](../../product-specs/songs.md#ux-and-visual-design) | done | [#16](https://github.com/besnik/setlist/pull/16) |
| T-013 | Project skeleton and tooling: `app/` folder structure, `package.json` with the commands, dev server serving the app at `/setlist/app/` with correct content types, check command (layer and part imports, file header comments), unit and e2e test setup with one smoke test, CI workflow on pull requests | [ADR 0005](../../decisions/0005-dev-tooling-tests-and-deployment.md) | done | [#15](https://github.com/besnik/setlist/pull/15) |
| T-014 | Deployment to GitHub Pages: workflow that runs the check and tests, assembles the site (`app/` → `/setlist/app/`, `site/` → `/setlist/` with a redirect to the app) and publishes `main` | [app-shell.md#start-and-address](../../product-specs/app-shell.md#start-and-address) | done | [#19](https://github.com/besnik/setlist/pull/19) |
| T-015 | App shell: `index.html`, design tokens and base styles, self-hosted fonts, light and dark theme, responsive single column | [app-shell.md](../../product-specs/app-shell.md) | approved | — |
| T-016 | Safe rendering: the auto-escaping `html` tagged template (attributes, lists, nested templates, no `javascript:` URLs) and delegated `data-action` events, with unit tests | [ADR 0004](../../decisions/0004-tech-stack-and-architecture.md) | approved | — |
| T-017 | Song list and search: song type, sorting and accent-insensitive search (domain), sample songs and song repository (data), Songs screen with search (ui), unit and e2e tests | [songs.md#song-list](../../product-specs/songs.md#song-list), [#search](../../product-specs/songs.md#search), [#sample-songs](../../product-specs/songs.md#sample-songs) | approved | — |

## CEO actions

- ~~Enable GitHub Pages (Settings → Pages → Source: *GitHub Actions*)~~ — done by the CEO on 2026-11-24.

## Out of scope

Install and offline (M2), opening a song (M3), editing and saving songs (M5), navigation (M6).
