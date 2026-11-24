# Tech debt

Known shortcuts, workarounds and issues we chose to fix later. Add an entry whenever you take a shortcut; remove it in the PR that fixes it.

| Area | Debt | Why it exists | Added |
|---|---|---|---|
| Check (`tools/check.js`) | Rule 5 (files loaded by HTML and CSS) does not read `srcset` or imports inside inline `<script>` blocks | Neither is used yet; add when the first responsive image or inline module appears | 2026-11-24 |
| Search (`domain/songs.js`) | Letters with no accent to strip (ł, ø, ß, đ) do not fold, so `l` does not find `ł` | Slovak and Czech letters fold correctly; add a mapping when songs in other languages need it | 2026-11-24 |
