#!/usr/bin/env node
/**
 * One-shot (re-runnable) migration: Hangul-as-key catalogs → stable-key catalogs.
 * Reads reference/i18n (preferred) or src/i18n legacy files.
 * Writes src/i18n/messages/{ko,en,ja}.json, units.json, fragments.json, shorts.json.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const refI18n = join(root, "reference", "i18n");
const srcI18n = join(root, "src", "i18n");
const outDir = join(srcI18n, "messages");

const norm = (s) => String(s).replace(/\s+/g, " ").trim();

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function stableKey(prefix, text) {
  const h = createHash("sha256").update(norm(text), "utf8").digest("hex").slice(0, 12);
  return `${prefix}.${h}`;
}

const enPath = existsSync(join(refI18n, "en.json"))
  ? join(refI18n, "en.json")
  : join(srcI18n, "en.json");
const jaPath = existsSync(join(refI18n, "ja.json"))
  ? join(refI18n, "ja.json")
  : join(srcI18n, "ja.json");
const metaPath = existsSync(join(refI18n, "meta.json"))
  ? join(refI18n, "meta.json")
  : join(srcI18n, "meta.json");

const en = loadJson(enPath);
const ja = loadJson(jaPath);
const meta = loadJson(metaPath);

const koMsg = {};
const enMsg = {};
const jaMsg = {};
const used = new Set();

function alloc(prefix, koText) {
  let id = stableKey(prefix, koText);
  if (used.has(id) && koMsg[id] !== koText) {
    let n = 2;
    while (used.has(`${id}_${n}`)) n++;
    id = `${id}_${n}`;
  }
  used.add(id);
  return id;
}

const keys = new Set([...Object.keys(en), ...Object.keys(ja)]);
let msgCount = 0;
for (const ko of keys) {
  const e = en[ko];
  const j = ja[ko];
  if (e == null || j == null) {
    console.error(`migrate: missing en/ja for ${JSON.stringify(ko).slice(0, 80)}`);
    process.exit(1);
  }
  const id = alloc("m", ko);
  koMsg[id] = ko;
  enMsg[id] = e;
  jaMsg[id] = j;
  msgCount++;
}

const units = {};
for (const [koText, pair] of Object.entries(meta.U || {})) {
  const id = alloc("u", koText);
  units[id] = { match: koText, en: pair[0], ja: pair[1] };
}

const fragments = [];
for (const frag of meta.F || []) {
  const id = stableKey("m", frag);
  if (!koMsg[id]) {
    console.error(`migrate: fragment not in messages: ${JSON.stringify(frag).slice(0, 80)}`);
    process.exit(1);
  }
  fragments.push(id);
}

const shorts = {};
for (const [match, triple] of Object.entries(meta.S || {})) {
  const id = alloc("s", match);
  shorts[id] = { match, ko: triple[0], en: triple[1], ja: triple[2] };
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "ko.json"), JSON.stringify(koMsg, null, 2) + "\n");
writeFileSync(join(outDir, "en.json"), JSON.stringify(enMsg, null, 2) + "\n");
writeFileSync(join(outDir, "ja.json"), JSON.stringify(jaMsg, null, 2) + "\n");
writeFileSync(join(srcI18n, "units.json"), JSON.stringify(units, null, 2) + "\n");
writeFileSync(join(srcI18n, "fragments.json"), JSON.stringify(fragments, null, 2) + "\n");
writeFileSync(join(srcI18n, "shorts.json"), JSON.stringify(shorts, null, 2) + "\n");

const manifest = {
  schema: 1,
  generatedFrom: {
    en: enPath.replace(root + "/", ""),
    ja: jaPath.replace(root + "/", ""),
    meta: metaPath.replace(root + "/", ""),
  },
  counts: {
    messages: msgCount,
    units: Object.keys(units).length,
    fragments: fragments.length,
    shorts: Object.keys(shorts).length,
  },
};
writeFileSync(join(srcI18n, "catalog.manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log(
  `migrate-i18n-keys: messages=${msgCount} units=${manifest.counts.units} fragments=${manifest.counts.fragments} shorts=${manifest.counts.shorts}`
);
