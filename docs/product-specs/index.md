# Product specs

The **source of truth for what Setlist does.** One file per functional area, describing current and planned behavior.

- Specs describe behavior from the user's point of view, not implementation.
- Every PR that changes app behavior updates the matching spec.
- Tasks in [docs/plan/](../plan/) link to the spec sections they implement.
- New spec: copy [_template.md](_template.md).

## Specs

| Spec | Area | Status |
|---|---|---|
| [app-shell.md](app-shell.md) | Start, address, language, theme, screen sizes; later navigation | approved |
| [install-offline.md](install-offline.md) | Install as an app, offline use, updates | approved |
| [songs.md](songs.md) | Song list, search and song view; later format, managing songs | approved (Song view: draft) |

Statuses: `draft` (being written) · `approved` (CEO agreed) · `implemented` (matches the app).
