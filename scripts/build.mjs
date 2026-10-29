#!/usr/bin/env node
/**
 * Build kong-introduction.html from src/deck.html + stable-key i18n catalogs + engine.
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
const units = JSON.parse(readFileSync(join(i18nDir, "units.json"), "utf8"));
const fragments = JSON.parse(readFileSync(join(i18nDir, "fragments.json"), "utf8"));
const shorts = JSON.parse(readFileSync(join(i18nDir, "shorts.json"), "utf8"));
const engine = readFileSync(join(src, "i18n-engine.js"), "utf8");
let deck = readFileSync(join(src, "deck.html"), "utf8");

const versionRe = /^\d{4}\.\d{2}\.\d{2}\.[0-9a-f]+$/;
const norm = (s) => String(s).replace(/\s+/g, " ").trim();

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

const ids = new Set([...Object.keys(ko), ...Object.keys(en), ...Object.keys(ja)]);
const T = {};
const K = {};
for (const id of ids) {
  const k = ko[id];
  const e = en[id];
  const j = ja[id];
  if (k == null || e == null || j == null) {
    console.error(`build: incomplete message ${id}`);
    process.exit(1);
  }
  T[id] = [k, e, j];
  const nk = norm(k);
  if (K[nk] && K[nk] !== id) {
    console.error(`build: duplicate KO text for ${K[nk]} and ${id}`);
    process.exit(1);
  }
  K[nk] = id;
}

const U = {};
const UK = {};
for (const [id, u] of Object.entries(units)) {
  if (u.match == null || u.en == null || u.ja == null) {
    console.error(`build: incomplete unit ${id}`);
    process.exit(1);
  }
  U[id] = [u.en, u.ja];
  const nk = norm(u.match);
  if (UK[nk] && UK[nk] !== id) {
    console.error(`build: duplicate unit match for ${UK[nk]} and ${id}`);
    process.exit(1);
  }
  UK[nk] = id;
}

const F = [];
for (const id of fragments) {
  if (!T[id]) {
    console.error(`build: fragment id missing in messages: ${id}`);
    process.exit(1);
  }
  F.push(id);
}

const S = {};
const SK = {};
for (const [id, s] of Object.entries(shorts)) {
  if (s.match == null || s.ko == null || s.en == null || s.ja == null) {
    console.error(`build: incomplete short ${id}`);
    process.exit(1);
  }
  S[id] = [s.ko, s.en, s.ja];
  SK[norm(s.match)] = id;
}

const D = { T, K, U, UK, F, S, SK };
let blob = JSON.stringify(D);
blob = blob.replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

const bundle =
  `<script id="i18n-js">\n(function(){\nconst D=${blob}, HG=/[가-힣]/, LANGS=['ko','en','ja'], IX={ko:0,en:1,ja:2};\n` +
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
  `built ${out} + ${pagesOut} (${deck.length} bytes, version=${version}, T=${Object.keys(T).length}, U=${Object.keys(U).length}, F=${F.length}, S=${Object.keys(S).length})`
);
