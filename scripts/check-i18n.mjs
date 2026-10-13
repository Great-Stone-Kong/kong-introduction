#!/usr/bin/env node
/**
 * Fail if new Hangul text in src/deck.html lacks EN/JA keys,
 * or if en.json / ja.json keys diverge.
 * Skips nodes marked data-show-lang without the target lang (ko-only content).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const HG = /[가-힣]/;
const unescapeHtml = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const norm = (s) => unescapeHtml(s).replace(/\s+/g, " ").trim();

const en = JSON.parse(readFileSync(join(src, "i18n/en.json"), "utf8"));
const ja = JSON.parse(readFileSync(join(src, "i18n/ja.json"), "utf8"));
const meta = JSON.parse(readFileSync(join(src, "i18n/meta.json"), "utf8"));
const deck = readFileSync(join(src, "deck.html"), "utf8");

const errors = [];
const enKeys = new Set(Object.keys(en));
const jaKeys = new Set(Object.keys(ja));

for (const k of enKeys) {
  if (!jaKeys.has(k)) errors.push(`en-only key: ${JSON.stringify(k).slice(0, 100)}`);
  if (!String(en[k] || "").trim()) errors.push(`empty en: ${JSON.stringify(k).slice(0, 80)}`);
}
for (const k of jaKeys) {
  if (!enKeys.has(k)) errors.push(`ja-only key: ${JSON.stringify(k).slice(0, 100)}`);
  if (!String(ja[k] || "").trim()) errors.push(`empty ja: ${JSON.stringify(k).slice(0, 80)}`);
}

// Strip scripts / styles / templates / i18n-no blocks for string harvest
let body = deck
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<template\b[\s\S]*?<\/template>/gi, " ");

// Remove ko-only subtrees (approximate: tags carrying data-show-lang="ko")
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
    const k = norm(m[1]);
    if (k && HG.test(k)) found.add(k);
  }
}

// Text between tags (rough)
const textRe = />([^<]+)</g;
let tm;
while ((tm = textRe.exec(body))) {
  const k = norm(tm[1]);
  if (k && HG.test(k)) found.add(k);
}

const uKeys = new Set(Object.keys(meta.U || {}));
const missing = [];
for (const k of found) {
  if (enKeys.has(k) || uKeys.has(k)) continue;
  // numeric prefix fallback handled at runtime; require base in T for check
  const nm = k.match(/^([\d.,+~%]+)\s*(\S.*)$/);
  if (nm && (enKeys.has(nm[2]) || uKeys.has(nm[2]))) continue;
  missing.push(k);
}

missing.sort((a, b) => a.length - b.length);
if (missing.length) {
  console.error(`check-i18n: ${missing.length} Hangul strings not in en.json / meta.U (sample):`);
  for (const k of missing.slice(0, 40)) console.error(" -", k.slice(0, 120));
  if (missing.length > 40) console.error(` … and ${missing.length - 40} more`);
  errors.push(`${missing.length} missing translation keys`);
}

if (errors.length) {
  console.error(`check-i18n: FAILED (${errors.length} issues)`);
  process.exit(1);
}
console.log(
  `check-i18n: OK (en=${enKeys.size}, ja=${jaKeys.size}, scanned=${found.size}, U=${uKeys.size})`
);
