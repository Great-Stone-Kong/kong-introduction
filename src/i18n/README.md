# i18n catalogs (stable keys)

## Layout

| Path | Role |
|---|---|
| `messages/ko.json` | Stable id → Korean source string |
| `messages/en.json` | Stable id → English |
| `messages/ja.json` | Stable id → Japanese |
| `messages/zh-Hant.json` | Stable id → Traditional Chinese (TW/HK phrasing) |
| `messages/zh-Hans.json` | Stable id → Simplified Chinese (from EN) |
| `units.json` | HTML units (`match` = KO textContent, `en`/`ja`/`zh-Hant`/`zh-Hans` = innerHTML) |
| `fragments.json` | Ordered message ids for in-string fragment replace |
| `shorts.json` | Nav compression shorts |
| `catalog.manifest.json` | Migration counts / provenance |

Ids look like `m.<12-hex>`, `u.<12-hex>`, `s.<12-hex>` (SHA-256 of normalized KO at migration time).

## Edit workflow

1. Change copy in `src/deck.html` (KO remains visible source in markup).
2. Update the same string under the **same id** in `messages/ko.json`.
3. Translate `en` / `ja` / `zh-Hans` for that id when needed, then align `zh-Hant` (OpenCC `s2twp` or manual TW/HK wording).
4. For bulk Simplified Chinese refresh from EN: `npm run translate-zh` (writes `zh-Hans`).
5. Regenerate Traditional Chinese: `npm run regen-zh-hant` (OpenCC `s2twp` + `npm run postedit-zh-tw` TW/HK lexicon).
6. `npm run check-i18n && npm run build`

Do not rename ids when editing KO text — that is the point of stable keys.

## Runtime (built HTML)

Build **does not** embed id→`[ko,en,ja]` for every message. It emits a compact blob:

- `D.T`: Hangul → `[en, ja, zh-Hant, zh-Hans]`
- `D.U` / `D.F` / `D.S`: Hangul-keyed units / fragments / shorts
- `D.I`: sparse stable-id → Hangul map, only for ids referenced in the deck (`data-i18n`, `I18N_IDS`, …)
- Locales: `ko` · `en` · `ja` · `zh-Hant` · `zh-Hans` (dropdown: Hant above Hans). `?lang=zh` aliases to `zh-Hans`.

DOM walk matches unmarked Hangul via `D.T`. Prefer `data-i18n="m.…"` / `KONG_I18N.t(id)` for new UI.
