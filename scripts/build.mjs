#!/usr/bin/env node
/**
 * Build kong-introduction.html from src/deck.html + stable-key i18n catalogs + engine.
 *
 * Source catalogs use stable ids; the embedded runtime blob stays compact:
 *   T[ko] = [en, ja, zh-Hant, zh-Hans],
 *   U[koMatch] = [enHtml, jaHtml, zh-HantHtml, zh-HansHtml],
 *   F = [ko, …],
 *   S[navKo] = [ko, en, ja, zh-Hant, zh-Hans],
 *   plus sparse I (stable id → ko) for deck-referenced ids.
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
const zhHant = JSON.parse(readFileSync(join(msgDir, "zh-Hant.json"), "utf8"));
const zhHans = JSON.parse(readFileSync(join(msgDir, "zh-Hans.json"), "utf8"));
const units = JSON.parse(readFileSync(join(i18nDir, "units.json"), "utf8"));
const fragments = JSON.parse(readFileSync(join(i18nDir, "fragments.json"), "utf8"));
const shorts = JSON.parse(readFileSync(join(i18nDir, "shorts.json"), "utf8"));
const engine = readFileSync(join(src, "i18n-engine.js"), "utf8");
let deck = readFileSync(join(src, "deck.html"), "utf8");
const libraryPath = join(src, "library.yaml");

/** Minimal YAML for library.yaml: top-level `items:` list of scalar maps. */
function parseLibraryYaml(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const items = [];
  let cur = null;
  let seenItems = false;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.replace(/#.*$/, "").trimEnd();
    if (!line.trim()) continue;
    if (/^items:\s*$/.test(line)) {
      seenItems = true;
      continue;
    }
    if (!seenItems) {
      console.error(`build: library.yaml unexpected line ${i + 1}: ${raw}`);
      process.exit(1);
    }
    const itemStart = line.match(/^\s*-\s+(\w+):\s*(.*)$/);
    if (itemStart) {
      cur = {};
      items.push(cur);
      setYamlField(cur, itemStart[1], itemStart[2], i + 1);
      continue;
    }
    const field = line.match(/^\s+(\w+):\s*(.*)$/);
    if (field && cur) {
      setYamlField(cur, field[1], field[2], i + 1);
      continue;
    }
    console.error(`build: library.yaml parse error at line ${i + 1}: ${raw}`);
    process.exit(1);
  }
  return { items };
}

function setYamlField(obj, key, rawVal, lineNo) {
  let v = rawVal.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  obj[key] = v;
}

function loadLibrary() {
  if (!existsSync(libraryPath)) {
    console.error("build: src/library.yaml missing");
    process.exit(1);
  }
  const data = parseLibraryYaml(readFileSync(libraryPath, "utf8"));
  if (!Array.isArray(data.items) || data.items.length === 0) {
    console.error("build: library.yaml items[] empty");
    process.exit(1);
  }
  const ids = new Set();
  for (const [i, it] of data.items.entries()) {
    const where = `items[${i}]`;
    for (const k of ["id", "name", "type", "url"]) {
      if (!it[k] || typeof it[k] !== "string") {
        console.error(`build: library.yaml ${where}.${k} required`);
        process.exit(1);
      }
    }
    if (it.type !== "access" && it.type !== "download") {
      console.error(`build: library.yaml ${where}.type must be access|download`);
      process.exit(1);
    }
    const cover = it.cover || "wave";
    if (!["data", "wave", "mesh", "orb"].includes(cover)) {
      console.error(`build: library.yaml ${where}.cover must be data|wave|mesh|orb`);
      process.exit(1);
    }
    it.cover = cover;
    if (ids.has(it.id)) {
      console.error(`build: library.yaml duplicate id ${it.id}`);
      process.exit(1);
    }
    ids.add(it.id);
    try {
      new URL(it.url);
    } catch {
      console.error(`build: library.yaml ${where}.url invalid`);
      process.exit(1);
    }
  }
  return {
    items: data.items.map((it) => ({
      id: it.id,
      name: it.name,
      type: it.type,
      url: it.url,
      cover: it.cover,
      ...(it.tag ? { tag: it.tag } : {}),
    })),
  };
}

const library = loadLibrary();

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
  ...Object.keys(zhHant),
  ...Object.keys(zhHans),
]);
const T = {};
for (const id of ids) {
  const k = ko[id];
  const e = en[id];
  const j = ja[id];
  const zt = zhHant[id];
  const zs = zhHans[id];
  if (k == null || e == null || j == null || zt == null || zs == null) {
    console.error(`build: incomplete message ${id}`);
    process.exit(1);
  }
  if (
    T[k] &&
    (T[k][0] !== e || T[k][1] !== j || T[k][2] !== zt || T[k][3] !== zs)
  ) {
    console.error(
      `build: duplicate KO key with different translations: ${JSON.stringify(k).slice(0, 80)}`
    );
    process.exit(1);
  }
  T[k] = [e, j, zt, zs];
}

const U = {};
for (const [id, u] of Object.entries(units)) {
  if (
    u.match == null ||
    u.en == null ||
    u.ja == null ||
    u["zh-Hant"] == null ||
    u["zh-Hans"] == null
  ) {
    console.error(`build: incomplete unit ${id}`);
    process.exit(1);
  }
  U[u.match] = [u.en, u.ja, u["zh-Hant"], u["zh-Hans"]];
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
  if (
    s.match == null ||
    s.ko == null ||
    s.en == null ||
    s.ja == null ||
    s["zh-Hant"] == null ||
    s["zh-Hans"] == null
  ) {
    console.error(`build: incomplete short`);
    process.exit(1);
  }
  S[s.match] = [s.ko, s.en, s.ja, s["zh-Hant"], s["zh-Hans"]];
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
const LANGS = ["ko", "en", "ja", "zh-Hant", "zh-Hans"];
const IX_MULTI = { en: 0, ja: 1, "zh-Hant": 2, "zh-Hans": 3 };
const LANG_INIT_RE =
  /L=q\|\|localStorage\.getItem\('kong-lang'\)\|\|'ko';/;
const ENGINE = engine.replace(/^\/\* i18n engine[^\n]*\n/, "");

function escBlob(obj) {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function makeBundle(data, langs, ix, lockedLang) {
  let eng = ENGINE;
  if (lockedLang) {
    if (!LANG_INIT_RE.test(eng)) {
      console.error("build: lang init pattern missing in i18n engine");
      process.exit(1);
    }
    eng = eng.replace(LANG_INIT_RE, `L=q||'${lockedLang}';`);
  }
  const lock = lockedLang ? "const KONG_LANG_LOCKED=true;\n" : "";
  return (
    `<script id="i18n-js">\n(function(){\n${lock}const D=${escBlob(data)}, HG=/[가-힣]/, LANGS=${JSON.stringify(langs)}, IX=${JSON.stringify(ix)};\n` +
    eng +
    `</script>`
  );
}

/* Locked builds keep only the active locale column (KO body needs no T/U/F). */
function pruneD(lang) {
  if (lang === "ko") return { T: {}, I, U: {}, F: [], S: {} };
  const col = IX_MULTI[lang];
  if (col == null) {
    console.error(`build: unknown lock lang ${lang}`);
    process.exit(1);
  }
  const Tp = {};
  for (const [k, row] of Object.entries(T)) Tp[k] = [row[col]];
  const Up = {};
  for (const [k, row] of Object.entries(U)) Up[k] = [row[col]];
  const Sp = {};
  const sIdx = LANGS.indexOf(lang);
  for (const [k, row] of Object.entries(S)) Sp[k] = [row[sIdx]];
  return { T: Tp, I, U: Up, F, S: Sp };
}

if (!deck.includes("<!-- I18N_BUNDLE -->")) {
  console.error("build: <!-- I18N_BUNDLE --> placeholder missing in src/deck.html");
  process.exit(1);
}
deck = deck.replace(
  "<!-- I18N_BUNDLE -->",
  makeBundle(D, LANGS, IX_MULTI, null)
);

if (!deck.includes("<!-- LIBRARY_BUNDLE -->")) {
  console.error("build: <!-- LIBRARY_BUNDLE --> placeholder missing in src/deck.html");
  process.exit(1);
}
deck = deck.replace(
  "<!-- LIBRARY_BUNDLE -->",
  `<script id="library-js">window.KONG_LIBRARY=${escBlob(library)};</script>`
);

function lockLang(html, lang) {
  const pruned = pruneD(lang);
  const langs = [lang];
  const ix = lang === "ko" ? {} : { [lang]: 0 };
  const bundle = makeBundle(pruned, langs, ix, lang);
  if (!/<script id="i18n-js">[\s\S]*?<\/script>/.test(html)) {
    console.error("build: i18n script missing for lock");
    process.exit(1);
  }
  return html
    .replace(/<script id="i18n-js">[\s\S]*?<\/script>/, bundle)
    .replace(
      /<html\b([^>]*)\blang="[^"]*"/,
      `<html$1lang="${lang}" data-lang-locked="1"`
    );
}

const out = join(root, "kong-introduction.html");
writeFileSync(out, deck, "utf8");
const docsDir = join(root, "docs");
mkdirSync(docsDir, { recursive: true });
writeFileSync(join(docsDir, ".nojekyll"), "");
const pagesOut = join(docsDir, "index.html");
writeFileSync(pagesOut, deck, "utf8");

const distDir = join(root, "dist");
mkdirSync(distDir, { recursive: true });
const locked = [];
for (const lang of LANGS) {
  const path = join(distDir, `kong-introduction.${lang}.html`);
  const html = lockLang(deck, lang);
  writeFileSync(path, html, "utf8");
  locked.push(`${path} (${html.length})`);
}

console.log(
  `built ${out} + ${pagesOut} (${deck.length} bytes, version=${version}, T=${Object.keys(T).length}, U=${Object.keys(U).length}, F=${F.length}, S=${Object.keys(S).length}, I=${Object.keys(I).length}, library=${library.items.length})`
);
console.log(`locked ${locked.join(", ")}`);
