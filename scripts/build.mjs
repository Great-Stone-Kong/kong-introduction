#!/usr/bin/env node
/**
 * Build kong-introduction.html from src/deck.html + i18n JSON + engine.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const i18nDir = join(src, "i18n");

const en = JSON.parse(readFileSync(join(i18nDir, "en.json"), "utf8"));
const ja = JSON.parse(readFileSync(join(i18nDir, "ja.json"), "utf8"));
const meta = JSON.parse(readFileSync(join(i18nDir, "meta.json"), "utf8"));
const engine = readFileSync(join(src, "i18n-engine.js"), "utf8");
let deck = readFileSync(join(src, "deck.html"), "utf8");

const keys = new Set([...Object.keys(en), ...Object.keys(ja)]);
const T = {};
for (const k of keys) {
  const e = en[k];
  const j = ja[k];
  if (e == null || j == null) {
    console.error(`build: missing translation for key: ${JSON.stringify(k).slice(0, 80)}`);
    process.exit(1);
  }
  T[k] = [e, j];
}

const D = { T, U: meta.U || {}, F: meta.F || [], S: meta.S || {} };
let blob = JSON.stringify(D);
blob = blob.replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

const bundle =
  `<script id="i18n-js">\n(function(){\nconst D=${blob}, HG=/[가-힣]/, LANGS=['ko','en','ja'], IX={en:0,ja:1};\n` +
  engine.replace(/^\/\* i18n engine[^\n]*\n/, "") +
  `</script>`;

if (!deck.includes("<!-- I18N_BUNDLE -->")) {
  console.error("build: <!-- I18N_BUNDLE --> placeholder missing in src/deck.html");
  process.exit(1);
}
deck = deck.replace("<!-- I18N_BUNDLE -->", bundle);

const out = join(root, "kong-introduction.html");
writeFileSync(out, deck, "utf8");
console.log(
  `built ${out} (${deck.length} bytes, T=${Object.keys(T).length}, U=${Object.keys(D.U).length}, F=${D.F.length})`
);
