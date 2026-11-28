# Product specs

The **source of truth for what Setlist does.** One file per functional area, describing current and planned behavior.

- Specs describe behavior from the user's point of view, not implementation.
- Every PR that changes app behavior updates the matching spec.
- Tasks in [docs/plan/](../plan/) link to the spec sections they implement.
- New spec: copy [_template.md](_template.md).
- *Notes for Design / Engineering*, exact UX values and self-checks are working notes for the milestone being built. When it closes, they are compacted (`close-milestone` skill): the behavior rules stay; what the code, the tests and `ARCHITECTURE.md` now hold is removed.

## Specs

| Spec | Area | Status |
|---|---|---|
| [app-shell.md](app-shell.md) | Start, address, language, theme, screen sizes; later navigation | approved |
| [install-offline.md](install-offline.md) | Install as an app, offline use, updates | approved |
| [songs.md](songs.md) | Song list, search, song view, song format, managing songs | approved (Manage songs: draft) |

Statuses: `draft` (being written) · `approved` (CEO agreed) · `implemented` (matches the app).
