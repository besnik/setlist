# Idea inbox

Raw ideas go here — one line each, no filtering. The GM or Product lead turns them into tasks.

- Skill `implement-task` — approved task → branch → build → the check command and tests → QA review → PR (with the first code).
- Skill `fix-bug` — reproduce → failing test → fix → passing test → update spec if needed (with the first code).
- Skill `cleanup` — find deviations from golden principles and tech debt, open small cleanup PRs (end of a milestone).
- Quality grades per area — later.
- Bluetooth page-turner pedals in play mode (they send PageUp / PageDown or arrow keys); test with a real pedal.
- Slovak UI translation (texts are kept in one place from M1, but no translation system yet).
- Importer of songs from public song websites (e.g. supermusic.cz) as a separate part (`importer/`) reusing the app's domain code — check copyright and the websites' terms of use first.
- Transposition of songs (the format chosen in M4 must allow it).
- Linter and formatter for the code (a new development dependency — CEO decision).
- User guide screenshots generated automatically by Playwright, so they stay current.
- Signpost page at the root of the website (links to the app and the guide).
- Fuzzy search: tolerate typos and approximate matches (e.g. Levenshtein distance), on top of the accent-insensitive search from M1.
- Own domain for the app before the first public release, e.g. a free subdomain on Netlify or Vercel (`setlist.vercel.app`) or a custom domain — gives Setlist its own origin instead of sharing `besnik.github.io` (see ADR 0005). Decide before the public release: moving later means users move their data with the backup and reinstall the app.
- Choice of the accent color in the app's Settings (not everyone likes orange). Colors are already CSS custom properties in `app/styles/tokens.css`, so a setting only overrides `--color-accent` and its related tokens; the app icon stays fixed (it cannot change per user).
- Theme setting in the app's Settings: Light, Dark, Automatic (follows the system; the default). Today the app always follows the system.
- Sync of songs and setlists between the CEO's own devices (laptop, tablet, phone), at first just for the CEO. The app has no backend today (ADR 0004, app-shell.md out of scope). Steps from simple to complex: the M8 backup file moved by hand; a backup file in the user's own cloud folder (OneDrive, Google Drive); real sync through a cloud storage API or our own server (accounts, conflicts, privacy — a CEO decision and an ADR).
- Song categories or tags (e.g. folk, Christmas, Slovak & Czech), also for search and filtering of the song list. Decide whether one category or several tags per song; fits after *Manage songs* (M5).
