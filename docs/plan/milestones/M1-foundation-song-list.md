# M1 — Foundation and song list

- **Status:** done
- **Specs:** [app-shell.md](../../product-specs/app-shell.md), [songs.md](../../product-specs/songs.md)
- **Decisions:** [ADR 0004](../../decisions/0004-tech-stack-and-architecture.md), [ADR 0005](../../decisions/0005-dev-tooling-tests-and-deployment.md)

## Goal

Lay the foundation the whole MVP builds on — project skeleton, commands, tests, CI, deployment and the design foundation — and deliver the first visible feature on top of it: the list of sample songs with search.

## Try it

Open `https://besnik.github.io/setlist/app/` on the phone, the tablet and the laptop: the sample songs are listed, search filters them as you type, the colors follow the system's light or dark mode.

## Tasks

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-012 | Design foundation (Design lead): design principles for browse and stage screens, provisional tokens (colors, typography, spacing, radius) and components from the prototype, home in `docs/design/`; UX sections of the app shell and song list specs | [app-shell.md](../../product-specs/app-shell.md), [songs.md](../../product-specs/songs.md#ux-and-visual-design) | done | [#16](https://github.com/besnik/setlist/pull/16) |
| T-013 | Project skeleton and tooling: folder structure, the commands, a dev server at `/setlist/app/`, the check command, unit and e2e test setup with a smoke test, and CI on pull requests | [ADR 0005](../../decisions/0005-dev-tooling-tests-and-deployment.md) | done | [#15](https://github.com/besnik/setlist/pull/15) |
| T-014 | Deployment to GitHub Pages: every merge to `main` runs the check and tests, then publishes the app and a redirect from the site root | [app-shell.md#start-and-address](../../product-specs/app-shell.md#start-and-address) | done | [#19](https://github.com/besnik/setlist/pull/19) |
| T-015 | App shell: `index.html`, design tokens and base styles, self-hosted fonts, light and dark theme, responsive single column | [app-shell.md](../../product-specs/app-shell.md) | done | [#23](https://github.com/besnik/setlist/pull/23) |
| T-016 | Safe rendering: the auto-escaping `html` tagged template (attributes, lists, nested templates, no `javascript:` URLs) and delegated `data-action` events, with unit tests | [ADR 0004](../../decisions/0004-tech-stack-and-architecture.md) | done | [#25](https://github.com/besnik/setlist/pull/25) |
| T-017 | Song list and search: the song type, sorting and accent-insensitive search, the sample songs and the Songs screen. Unit and e2e tests | [songs.md#song-list](../../product-specs/songs.md#song-list), [#search](../../product-specs/songs.md#search), [#sample-songs](../../product-specs/songs.md#sample-songs) | done | [#27](https://github.com/besnik/setlist/pull/27) |
| T-020 | README: link to the live preview in the status line, with what it can do today | [README.md](../../../README.md) | done | [#28](https://github.com/besnik/setlist/pull/28) |

## CEO actions

- ~~Enable GitHub Pages (Settings → Pages → Source: *GitHub Actions*)~~ — done by the CEO on 2026-11-24.

## Out of scope

Install and offline (M2), opening a song (M3), editing and saving songs (M5), navigation (M6).
