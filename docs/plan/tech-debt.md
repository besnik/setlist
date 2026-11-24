# Tech debt

Known shortcuts, workarounds and issues we chose to fix later. Add an entry whenever you take a shortcut; remove it in the PR that fixes it.

| Area | Debt | Why it exists | Added |
|---|---|---|---|
| Check (`tools/check.js`) | The "nothing from other websites" rule is checked only in JavaScript imports, not in HTML (`<script src>`, `<link href>`) or CSS (`@import`, `url()`) | No HTML or CSS references existed yet in T-013; add the check with the app shell (T-015) | 2026-11-24 |
