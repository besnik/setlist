# Product specs

The **source of truth for what Setlist does.** One file per functional area, describing current and planned behavior.

- Specs describe behavior from the user's point of view, not implementation.
- Every PR that changes app behavior updates the matching spec.
- Tasks in [docs/plan/](../plan/) link to the spec sections they implement.
- New spec: copy [_template.md](_template.md).

## Specs

| Spec | Area | Status |
|---|---|---|
| [app-shell.md](app-shell.md) | Start, address, language, theme, screen sizes; later navigation, install and offline | approved |
| [songs.md](songs.md) | Song list and search; later song view, format, managing songs | approved |

Statuses: `draft` (being written) · `approved` (CEO agreed) · `implemented` (matches the app).
