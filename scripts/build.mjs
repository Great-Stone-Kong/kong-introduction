#!/usr/bin/env node
/**
 * Build kong-introduction.html from src/deck.html + stable-key i18n catalogs + engine.
 *
 * Source catalogs use stable ids; the embedded runtime blob stays compact:
 *   T[ko] = [en, ja, zh], U[koMatch] = [enHtml, jaHtml, zhHtml], F = [ko, …],
 *   S[navKo] = [ko,en,ja,zh], plus sparse I (stable id → ko) for deck-referenced ids.
 *
 * Always reads VERSION (never mints, never edits Changelog).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const i18nDir = join(src, "i18n");
const msgDir = join(i18nDir, "messages");
const versionPath = join(root, "VERSION");

const ko = JSON.parse(readFileSync(join(msgDir, "ko.json"), "utf8"));
const en = JSON.parse(readFileSync(join(msgDir, "en.json"), "utf8"));
const ja = JSON.parse(readFileSync(join(msgDir, "ja.json"), "utf8"));
const zh = JSON.parse(readFileSync(join(msgDir, "zh.json"), "utf8"));
const units = JSON.parse(readFileSync(join(i18nDir, "units.json"), "utf8"));
const fragments = JSON.parse(readFileSync(join(i18nDir, "fragments.json"), "utf8"));
const shorts = JSON.parse(readFileSync(join(i18nDir, "shorts.json"), "utf8"));
const engine = readFileSync(join(src, "i18n-engine.js"), "utf8");
let deck = readFileSync(join(src, "deck.html"), "utf8");

const versionRe = /^\d{4}\.\d{2}\.\d{2}\.[0-9a-f]+$/;
const ID_RE = /\b([mus]\.[a-f0-9]{12}(?:_\d+)?)\b/g;

function readVersionFile() {
  if (!existsSync(versionPath)) {
    console.error("build: VERSION missing");
    process.exit(1);
  }
  const v = readFileSync(versionPath, "utf8").trim();
  if (!versionRe.test(v)) {
    console.error(`build: VERSION invalid: ${JSON.stringify(v)}`);
    process.exit(1);
  }
  return v;
}

const version = readVersionFile();

if (!/const KONG_INTRO_VERSION="[^"]*";/.test(deck)) {
  console.error('build: const KONG_INTRO_VERSION="..." missing in src/deck.html');
  process.exit(1);
}
deck = deck.replace(
  /const KONG_INTRO_VERSION="[^"]*";/,
  `const KONG_INTRO_VERSION="${version}";`
);

const ids = new Set([
  ...Object.keys(ko),
  ...Object.keys(en),
  ...Object.keys(ja),
  ...Object.keys(zh),
]);
const T = {};
for (const id of ids) {
  const k = ko[id];
  const e = en[id];
  const j = ja[id];
  const z = zh[id];
  if (k == null || e == null || j == null || z == null) {
    console.error(`build: incomplete message ${id}`);
    process.exit(1);
  }
  if (T[k] && (T[k][0] !== e || T[k][1] !== j || T[k][2] !== z)) {
    console.error(`build: duplicate KO key with different translations: ${JSON.stringify(k).slice(0, 80)}`);
    process.exit(1);
  }
  T[k] = [e, j, z];
}

const U = {};
for (const [id, u] of Object.entries(units)) {
  if (u.match == null || u.en == null || u.ja == null || u.zh == null) {
    console.error(`build: incomplete unit ${id}`);
    process.exit(1);
  }
  U[u.match] = [u.en, u.ja, u.zh];
}

const F = [];
for (const id of fragments) {
  if (!ko[id]) {
    console.error(`build: fragment id missing in messages: ${id}`);
    process.exit(1);
  }
  F.push(ko[id]);
}
/* Longer fragments first so short tokens do not carve up longer phrases. */
F.sort((a, b) => b.length - a.length);

const S = {};
for (const [, s] of Object.entries(shorts)) {
  if (s.match == null || s.ko == null || s.en == null || s.ja == null || s.zh == null) {
    console.error(`build: incomplete short`);
    process.exit(1);
  }
  S[s.match] = [s.ko, s.en, s.ja, s.zh];
}

/* Sparse id → KO map for data-i18n / KONG_I18N.t(stableId) only */
const I = {};
const usedIds = new Set();
let m;
while ((m = ID_RE.exec(deck))) usedIds.add(m[1]);
for (const id of usedIds) {
  if (ko[id] != null) I[id] = ko[id];
  else if (units[id]) I[id] = units[id].match;
  else console.warn(`build: deck references unknown id ${id}`);
}

const D = { T, I, U, F, S };
let blob = JSON.stringify(D);
blob = blob.replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

const bundle =
  `<script id="i18n-js">\n(function(){\nconst D=${blob}, HG=/[가-힣]/, LANGS=['ko','en','ja','zh'], IX={en:0,ja:1,zh:2};\n` +
  engine.replace(/^\/\* i18n engine[^\n]*\n/, "") +
  `</script>`;

if (!deck.includes("<!-- I18N_BUNDLE -->")) {
  console.error("build: <!-- I18N_BUNDLE --> placeholder missing in src/deck.html");
  process.exit(1);
}
deck = deck.replace("<!-- I18N_BUNDLE -->", bundle);

const out = join(root, "kong-introduction.html");
writeFileSync(out, deck, "utf8");
const docsDir = join(root, "docs");
mkdirSync(docsDir, { recursive: true });
writeFileSync(join(docsDir, ".nojekyll"), "");
const pagesOut = join(docsDir, "index.html");
writeFileSync(pagesOut, deck, "utf8");
console.log(
  `built ${out} + ${pagesOut} (${deck.length} bytes, version=${version}, T=${Object.keys(T).length}, U=${Object.keys(U).length}, F=${F.length}, S=${Object.keys(S).length}, I=${Object.keys(I).length})`
);
