# i18n catalogs (stable keys)

## Layout

| Path | Role |
|---|---|
| `messages/ko.json` | Stable id → Korean source string |
| `messages/en.json` | Stable id → English |
| `messages/ja.json` | Stable id → Japanese |
| `messages/zh.json` | Stable id → Simplified Chinese (from EN) |
| `units.json` | HTML units (`match` = KO textContent, `en`/`ja`/`zh` = innerHTML) |
| `fragments.json` | Ordered message ids for in-string fragment replace |
| `shorts.json` | Nav compression shorts |
| `catalog.manifest.json` | Migration counts / provenance |

Ids look like `m.<12-hex>`, `u.<12-hex>`, `s.<12-hex>` (SHA-256 of normalized KO at migration time).

## Edit workflow

1. Change copy in `src/deck.html` (KO remains visible source in markup).
2. Update the same string under the **same id** in `messages/ko.json`.
3. Translate `messages/en.json` / `messages/ja.json` / `messages/zh.json` for that id when needed.
4. For bulk ZH refresh from EN: `npm run translate-zh`
5. `npm run check-i18n && npm run build`

Do not rename ids when editing KO text — that is the point of stable keys.

## Runtime (built HTML)

Build **does not** embed id→`[ko,en,ja]` for every message. It emits a compact blob:

- `D.T`: Hangul → `[en, ja, zh]`
- `D.U` / `D.F` / `D.S`: Hangul-keyed units / fragments / shorts (`S` includes zh short)
- `D.I`: sparse stable-id → Hangul map, only for ids referenced in the deck (`data-i18n`, `I18N_IDS`, …)
- Locales: `ko` · `en` · `ja` · `zh` (Simplified Chinese)

DOM walk matches unmarked Hangul via `D.T`. Prefer `data-i18n="m.…"` / `KONG_I18N.t(id)` for new UI.
