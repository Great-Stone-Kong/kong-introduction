#!/usr/bin/env node
/**
 * Fail if Hangul in src/deck.html lacks a stable-key message/unit,
 * or if ko/en/ja/zh message key sets diverge.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const i18nDir = join(src, "i18n");
const msgDir = join(i18nDir, "messages");
const HG = /[가-힣]/;
const unescapeHtml = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
/* Match runtime engine: whitespace only (keep &lt; / &quot; variants distinct). */
const norm = (s) => String(s).replace(/\s+/g, " ").trim();

const ko = JSON.parse(readFileSync(join(msgDir, "ko.json"), "utf8"));
const en = JSON.parse(readFileSync(join(msgDir, "en.json"), "utf8"));
const ja = JSON.parse(readFileSync(join(msgDir, "ja.json"), "utf8"));
const zh = JSON.parse(readFileSync(join(msgDir, "zh.json"), "utf8"));
const units = JSON.parse(readFileSync(join(i18nDir, "units.json"), "utf8"));
const fragments = JSON.parse(readFileSync(join(i18nDir, "fragments.json"), "utf8"));
const shorts = JSON.parse(readFileSync(join(i18nDir, "shorts.json"), "utf8"));
const deck = readFileSync(join(src, "deck.html"), "utf8");

const errors = [];
const koIds = new Set(Object.keys(ko));
const enIds = new Set(Object.keys(en));
const jaIds = new Set(Object.keys(ja));
const zhIds = new Set(Object.keys(zh));

for (const id of koIds) {
  if (!enIds.has(id)) errors.push(`ko-only message: ${id}`);
  if (!jaIds.has(id)) errors.push(`ko-only (missing ja): ${id}`);
  if (!zhIds.has(id)) errors.push(`ko-only (missing zh): ${id}`);
  if (!String(ko[id] || "").trim()) errors.push(`empty ko: ${id}`);
}
for (const id of enIds) {
  if (!koIds.has(id)) errors.push(`en-only message: ${id}`);
  if (!String(en[id] || "").trim()) errors.push(`empty en: ${id}`);
}
for (const id of jaIds) {
  if (!koIds.has(id)) errors.push(`ja-only message: ${id}`);
  if (!String(ja[id] || "").trim()) errors.push(`empty ja: ${id}`);
}
for (const id of zhIds) {
  if (!koIds.has(id)) errors.push(`zh-only message: ${id}`);
  if (!String(zh[id] || "").trim()) errors.push(`empty zh: ${id}`);
}

const byKo = new Map();
for (const [id, text] of Object.entries(ko)) {
  const n = norm(text);
  if (byKo.has(n) && byKo.get(n) !== id) {
    const other = byKo.get(n);
    // Same KO source shared by multiple stable ids is OK when all locales match.
    if (en[other] !== en[id] || ja[other] !== ja[id] || zh[other] !== zh[id]) {
      errors.push(`duplicate KO text with divergent translations: ${JSON.stringify(n).slice(0, 80)}`);
    }
  }
  byKo.set(n, id);
}

const unitMatch = new Set();
for (const [id, u] of Object.entries(units)) {
  if (!u || u.match == null || u.en == null || u.ja == null || u.zh == null) {
    errors.push(`incomplete unit ${id}`);
    continue;
  }
  unitMatch.add(norm(u.match));
}

for (const id of fragments) {
  if (!koIds.has(id)) errors.push(`fragment missing message: ${id}`);
}

for (const [id, s] of Object.entries(shorts)) {
  if (!s || s.match == null || s.ko == null || s.en == null || s.ja == null || s.zh == null) {
    errors.push(`incomplete short ${id}`);
  }
}

let body = deck
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<template\b[\s\S]*?<\/template>/gi, " ");
body = body.replace(
  /<([a-zA-Z0-9]+)([^>]*\bdata-show-lang="ko"[^>]*)>[\s\S]*?<\/\1>/g,
  " "
);

const attrs = ["data-title", "data-label", "data-desc", "title", "aria-label", "placeholder"];
const found = new Set();
for (const a of attrs) {
  const re = new RegExp(`\\b${a}="([^"]*)"`, "g");
  let m;
  while ((m = re.exec(body))) {
    const raw = norm(m[1]);
    if (raw && HG.test(raw)) found.add(raw);
  }
}
const textRe = />([^<]+)</g;
let tm;
while ((tm = textRe.exec(body))) {
  const raw = norm(tm[1]);
  if (raw && HG.test(raw)) found.add(raw);
}

function covered(k) {
  if (byKo.has(k) || unitMatch.has(k)) return true;
  const u = norm(unescapeHtml(k));
  if (u !== k && (byKo.has(u) || unitMatch.has(u))) return true;
  const nm = k.match(/^([\d.,+~%]+)\s*(\S.*)$/);
  if (nm && (byKo.has(nm[2]) || unitMatch.has(nm[2]))) return true;
  // Child text of HTML units is covered by the full unit match string.
  for (const m of unitMatch) {
    if (m.includes(k) || m.includes(u)) return true;
  }
  return false;
}

const missing = [];
for (const k of found) {
  if (!covered(k)) missing.push(k);
}
missing.sort((a, b) => a.length - b.length);
if (missing.length) {
  console.error(`check-i18n: ${missing.length} Hangul strings not in messages/units (sample):`);
  for (const k of missing.slice(0, 40)) console.error(" -", k.slice(0, 120));
  if (missing.length > 40) console.error(` … and ${missing.length - 40} more`);
  errors.push(`${missing.length} missing translation keys`);
}

if (errors.length) {
  console.error(`check-i18n: FAILED (${errors.length} issues)`);
  for (const e of errors.slice(0, 30)) console.error(" -", e);
  process.exit(1);
}
console.log(
  `check-i18n: OK (messages=${koIds.size}, zh=${zhIds.size}, units=${Object.keys(units).length}, fragments=${fragments.length}, shorts=${Object.keys(shorts).length}, scanned=${found.size})`
);
