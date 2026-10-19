#!/usr/bin/env node
/**
 * Build kong-introduction.html from src/deck.html + i18n JSON + engine.
 *
 * Local (default): mint YYYY.MM.DD.<unix-seconds hex> (UTC), write VERSION,
 * stamp Changelog + KONG_INTRO_VERSION.
 * CI (`--ci`): read VERSION only — never mint a new wall-clock stamp.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const i18nDir = join(src, "i18n");
const versionPath = join(root, "VERSION");
const ci = process.argv.includes("--ci");

const en = JSON.parse(readFileSync(join(i18nDir, "en.json"), "utf8"));
const ja = JSON.parse(readFileSync(join(i18nDir, "ja.json"), "utf8"));
const meta = JSON.parse(readFileSync(join(i18nDir, "meta.json"), "utf8"));
const engine = readFileSync(join(src, "i18n-engine.js"), "utf8");
let deck = readFileSync(join(src, "deck.html"), "utf8");

const versionRe = /^\d{4}\.\d{2}\.\d{2}\.[0-9a-f]+$/;

/** Sidebar version = YYYY.MM.DD.<unix-seconds hex> (vcmp uses parseInt(_,16) on 4th part) */
function mintVersion() {
  const pad = (n) => String(n).padStart(2, "0");
  const now = new Date();
  const day = `${now.getUTCFullYear()}.${pad(now.getUTCMonth() + 1)}.${pad(now.getUTCDate())}`;
  const tsHex = Math.floor(now.getTime() / 1000).toString(16);
  return `${day}.${tsHex}`;
}

function readVersionFile() {
  if (!existsSync(versionPath)) {
    console.error("build: VERSION missing (required with --ci)");
    process.exit(1);
  }
  const v = readFileSync(versionPath, "utf8").trim();
  if (!versionRe.test(v)) {
    console.error(`build: VERSION invalid: ${JSON.stringify(v)}`);
    process.exit(1);
  }
  return v;
}

const version = ci ? readVersionFile() : mintVersion();
if (!ci) writeFileSync(versionPath, `${version}\n`, "utf8");

if (!/const KONG_INTRO_VERSION="[^"]*";/.test(deck)) {
  console.error('build: const KONG_INTRO_VERSION="..." missing in src/deck.html');
  process.exit(1);
}
deck = deck.replace(
  /const KONG_INTRO_VERSION="[^"]*";/,
  `const KONG_INTRO_VERSION="${version}";`
);

// Keep the newest ## heading in each changelog aligned with this build stamp
const headingRe = /^##\s+\d{4}\.\d{2}\.\d{2}\.[0-9a-f]+\s*$/m;
for (const name of ["CHANGELOG.md", "CHANGELOG.en.md", "CHANGELOG.ja.md"]) {
  const p = join(root, name);
  let text = readFileSync(p, "utf8");
  if (!headingRe.test(text)) {
    console.warn(`build: no version heading in ${name}; skip`);
    continue;
  }
  writeFileSync(p, text.replace(headingRe, `## ${version}`), "utf8");
}

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
// GitHub Pages source folder (/docs) — same artifact as site root index
const docsDir = join(root, "docs");
mkdirSync(docsDir, { recursive: true });
const pagesOut = join(docsDir, "index.html");
writeFileSync(pagesOut, deck, "utf8");
console.log(
  `built ${out} + ${pagesOut} (${deck.length} bytes, version=${version}, mode=${ci ? "ci" : "local"}, T=${Object.keys(T).length}, U=${Object.keys(D.U).length}, F=${D.F.length})`
);
