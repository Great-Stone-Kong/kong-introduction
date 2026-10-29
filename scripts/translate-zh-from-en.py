#!/usr/bin/env python3
"""Translate EN catalog strings to Simplified Chinese (zh) via Argos Translate (offline)."""
from __future__ import annotations

import json
import re
from pathlib import Path

import argostranslate.translate

ROOT = Path(__file__).resolve().parents[1]
MSG = ROOT / "src" / "i18n" / "messages"
CACHE = ROOT / "src" / "i18n" / ".zh-cache.json"
UNITS = ROOT / "src" / "i18n" / "units.json"
SHORTS = ROOT / "src" / "i18n" / "shorts.json"

PLACEHOLDER_RE = re.compile(r"(\$\{[^}]+\}|<[^>]+>|&[a-zA-Z]+;|&#\d+;)")


def load_cache() -> dict[str, str]:
    if CACHE.exists():
        return json.loads(CACHE.read_text(encoding="utf-8"))
    return {}


def save_cache(cache: dict[str, str]) -> None:
    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def protect(text: str) -> tuple[str, list[str]]:
    parts: list[str] = []

    def repl(m: re.Match[str]) -> str:
        parts.append(m.group(0))
        return f"⟦{len(parts) - 1}⟧"

    return PLACEHOLDER_RE.sub(repl, text), parts


def unprotect(text: str, parts: list[str]) -> str:
    def repl(m: re.Match[str]) -> str:
        i = int(m.group(1))
        return parts[i] if 0 <= i < len(parts) else m.group(0)

    return re.sub(r"⟦(\d+)⟧", repl, text)


def translate_one(text: str) -> str:
    if not str(text).strip():
        return text
    protected, parts = protect(text)
    # Argos handles long text; still chunk very long HTML-ish units
    if len(protected) < 1200:
        zh = argostranslate.translate.translate(protected, "en", "zh")
    else:
        bits = []
        for sentence in re.split(r"(?<=[.!?。])\s+", protected):
            if not sentence.strip():
                continue
            bits.append(argostranslate.translate.translate(sentence, "en", "zh"))
        zh = " ".join(bits)
    return unprotect(zh, parts)


def main() -> None:
    en = json.loads((MSG / "en.json").read_text(encoding="utf-8"))
    units = json.loads(UNITS.read_text(encoding="utf-8"))
    shorts = json.loads(SHORTS.read_text(encoding="utf-8"))
    cache = load_cache()

    texts = []
    for v in en.values():
        texts.append(str(v))
    for u in units.values():
        texts.append(str(u["en"]))
    for s in shorts.values():
        texts.append(str(s["en"]))

    unique = []
    seen = set()
    for t in texts:
        if t in cache or t in seen:
            continue
        seen.add(t)
        unique.append(t)
    print(f"to translate={len(unique)} cache={len(cache)}", flush=True)

    for i, t in enumerate(unique, 1):
        cache[t] = translate_one(t)
        if i % 100 == 0:
            save_cache(cache)
            print(f"progress {i}/{len(unique)}", flush=True)

    save_cache(cache)
    zh_msg = {id_: cache[str(en[id_])] for id_ in en}
    for u in units.values():
        u["zh"] = cache[str(u["en"])]
    for s in shorts.values():
        s["zh"] = cache[str(s["en"])]

    (MSG / "zh.json").write_text(
        json.dumps(zh_msg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    UNITS.write_text(json.dumps(units, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    SHORTS.write_text(json.dumps(shorts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"done messages={len(zh_msg)} units={len(units)} shorts={len(shorts)}")


if __name__ == "__main__":
    main()
