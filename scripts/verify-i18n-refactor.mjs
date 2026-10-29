#!/usr/bin/env node
/**
 * Verify stable-key catalogs preserve reference (Hangul-as-key) translations.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ref = join(root, "reference", "i18n");
const i18nDir = join(root, "src", "i18n");
const msgDir = join(i18nDir, "messages");
const norm = (s) => String(s).replace(/\s+/g, " ").trim();
const hash = (prefix, text) =>
  `${prefix}.${createHash("sha256").update(norm(text), "utf8").digest("hex").slice(0, 12)}`;

const refEn = JSON.parse(readFileSync(join(ref, "en.json"), "utf8"));
const refJa = JSON.parse(readFileSync(join(ref, "ja.json"), "utf8"));
const refMeta = JSON.parse(readFileSync(join(ref, "meta.json"), "utf8"));
const ko = JSON.parse(readFileSync(join(msgDir, "ko.json"), "utf8"));
const en = JSON.parse(readFileSync(join(msgDir, "en.json"), "utf8"));
const ja = JSON.parse(readFileSync(join(msgDir, "ja.json"), "utf8"));
const units = JSON.parse(readFileSync(join(i18nDir, "units.json"), "utf8"));
const fragments = JSON.parse(readFileSync(join(i18nDir, "fragments.json"), "utf8"));
const shorts = JSON.parse(readFileSync(join(i18nDir, "shorts.json"), "utf8"));

let errors = 0;
function fail(msg) {
  console.error("verify:", msg);
  errors++;
}

const refKeys = new Set([...Object.keys(refEn), ...Object.keys(refJa)]);
if (refKeys.size !== Object.keys(ko).length) {
  fail(`message count ref=${refKeys.size} ko=${Object.keys(ko).length}`);
}

for (const koText of refKeys) {
  const id = hash("m", koText);
  // collision suffix support: find by value
  let found = id;
  if (ko[id] !== koText) {
    found = Object.keys(ko).find((k) => ko[k] === koText);
  }
  if (!found) {
    fail(`missing migrated message for ${JSON.stringify(koText).slice(0, 60)}`);
    continue;
  }
  if (en[found] !== refEn[koText]) {
    fail(`en mismatch ${found}`);
  }
  if (ja[found] !== refJa[koText]) {
    fail(`ja mismatch ${found}`);
  }
}

const refU = refMeta.U || {};
if (Object.keys(refU).length !== Object.keys(units).length) {
  fail(`unit count ref=${Object.keys(refU).length} now=${Object.keys(units).length}`);
}
for (const [match, pair] of Object.entries(refU)) {
  const u = Object.values(units).find((x) => x.match === match);
  if (!u) {
    fail(`missing unit match ${JSON.stringify(match).slice(0, 60)}`);
    continue;
  }
  if (u.en !== pair[0] || u.ja !== pair[1]) fail(`unit html mismatch for ${JSON.stringify(match).slice(0, 40)}`);
}

const refF = refMeta.F || [];
if (refF.length !== fragments.length) fail(`fragment count ref=${refF.length} now=${fragments.length}`);
for (let i = 0; i < refF.length; i++) {
  const id = fragments[i];
  if (ko[id] !== refF[i]) fail(`fragment[${i}] KO mismatch`);
}

const refS = refMeta.S || {};
if (Object.keys(refS).length !== Object.keys(shorts).length) {
  fail(`shorts count ref=${Object.keys(refS).length} now=${Object.keys(shorts).length}`);
}
for (const [match, triple] of Object.entries(refS)) {
  const s = Object.values(shorts).find((x) => x.match === match);
  if (!s) {
    fail(`missing short ${match}`);
    continue;
  }
  if (s.ko !== triple[0] || s.en !== triple[1] || s.ja !== triple[2]) fail(`short mismatch ${match}`);
}

if (errors) {
  console.error(`verify-i18n-refactor: FAILED (${errors} issues)`);
  process.exit(1);
}
console.log(
  `verify-i18n-refactor: OK (messages=${refKeys.size}, units=${Object.keys(refU).length}, fragments=${refF.length}, shorts=${Object.keys(refS).length})`
);
