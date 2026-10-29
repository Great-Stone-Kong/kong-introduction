# i18n refactor reference baseline

Frozen copy of the pre-refactor Hangul-as-key catalogs and built HTML.

- `kong-introduction.html` — release build before stable-key migration
- `i18n/en.json`, `i18n/ja.json`, `i18n/meta.json` — legacy catalogs
- `i18n-engine.js` — legacy engine
- `VERSION` — version string at freeze time

Verification: `npm run verify-i18n`

Do not edit these files; regenerate only by re-freezing from `main` if the baseline must move.
