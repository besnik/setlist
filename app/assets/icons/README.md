# Icons

Provisional app icon until the CEO chooses the logo and brand colors (product spec [install-offline.md](../../../docs/product-specs/install-offline.md#app-icon-and-install)): a white "S" in Bricolage Grotesque 700 on `--color-accent` (`#e8501f`), centered, well inside the central 80 % circle.

| File | Size | Shape | Used by |
|---|---|---|---|
| `icon-192.png` | 192 × 192 | rounded corners | browsers, Windows (manifest, `purpose: any`) |
| `icon-512.png` | 512 × 512 | rounded corners | browsers, Windows (manifest, `purpose: any`) |
| `icon-maskable-512.png` | 512 × 512 | full bleed square | Android, which cuts its own shape (manifest, `purpose: maskable`) |
| `apple-touch-icon-180.png` | 180 × 180 | full bleed square | iPhone home screen, which rounds the corners itself (`index.html`) |

Made by rendering the letter in Chromium (font size 62 % of the icon, corner radius 22 % on the rounded ones) and saving a screenshot with a transparent background.
