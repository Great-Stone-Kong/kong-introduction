#!/usr/bin/env python3
"""Regenerate zh-Hant catalogs from zh-Hans using OpenCC s2twp (TW phrasing)."""
from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    from opencc import OpenCC
except ImportError:
    print("regen-zh-hant: install opencc-python-reimplemented first", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
MSG = ROOT / "src" / "i18n" / "messages"
UNITS = ROOT / "src" / "i18n" / "units.json"
SHORTS = ROOT / "src" / "i18n" / "shorts.json"
cc = OpenCC("s2twp")


def conv(s: str) -> str:
    return cc.convert(s) if s else s


hans = json.loads((MSG / "zh-Hans.json").read_text(encoding="utf-8"))
(MSG / "zh-Hant.json").write_text(
    json.dumps({k: conv(v) for k, v in hans.items()}, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)

units = json.loads(UNITS.read_text(encoding="utf-8"))
for u in units.values():
    if "zh-Hans" in u:
        u["zh-Hant"] = conv(u["zh-Hans"])
UNITS.write_text(json.dumps(units, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

shorts = json.loads(SHORTS.read_text(encoding="utf-8"))
for s in shorts.values():
    if "zh-Hans" in s:
        s["zh-Hant"] = conv(s["zh-Hans"])
SHORTS.write_text(json.dumps(shorts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

cl = ROOT / "CHANGELOG.zh-Hans.md"
if cl.exists():
    (ROOT / "CHANGELOG.zh-Hant.md").write_text(conv(cl.read_text(encoding="utf-8")), encoding="utf-8")

print(f"regen-zh-hant: messages={len(hans)} units={len(units)} shorts={len(shorts)}")
