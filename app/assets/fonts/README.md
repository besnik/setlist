# Fonts

Self-hosted fonts of the app (see [design guidelines](../../../docs/design/guidelines.md#fonts)). All are under the SIL Open Font License 1.1; each family's license is in its `OFL-*.txt` file.

| File | Family | Weight | Source |
|---|---|---|---|
| `bricolage-grotesque-700.woff2` | Bricolage Grotesque | 700 (optical size 28, width 100) | `ofl/bricolagegrotesque/` |
| `dm-sans-400.woff2` | DM Sans | 400 (optical size 14) | `ofl/dmsans/` |
| `dm-sans-600.woff2` | DM Sans | 600 (optical size 14) | `ofl/dmsans/` |
| `jetbrains-mono-400.woff2` | JetBrains Mono | 400 | `ofl/jetbrainsmono/` |
| `jetbrains-mono-700.woff2` | JetBrains Mono | 700 | `ofl/jetbrainsmono/` |

## How they were made

From the variable fonts in [github.com/google/fonts](https://github.com/google/fonts) with [fonttools](https://github.com/fonttools/fonttools) (`pip install fonttools brotli`): one static instance per weight, subset to Latin and Latin Extended (plus general punctuation, currency signs and ♭ ♮ ♯), saved as WOFF2.

```bash
U="U+0000-024F,U+0259,U+02B0-02FF,U+0300-036F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2100-214F,U+2190-2193,U+2212,U+2215,U+266D-266F,U+FEFF,U+FFFD"
fonttools varLib.instancer --static "DMSans[opsz,wght].ttf" wght=400 opsz=14 -o tmp.ttf
pyftsubset tmp.ttf --unicodes="$U" --layout-features='*' --flavor=woff2 --output-file=dm-sans-400.woff2
```

Bricolage Grotesque uses `wght=700 wdth=100 opsz=28`, JetBrains Mono `wght=400` and `wght=700` (from version 2.211 of the variable font).
