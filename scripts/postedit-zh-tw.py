#!/usr/bin/env python3
"""
Post-edit Chinese catalogs for Kong introduction:

1) Fix known broken Argos/MT strings (Hans + Hant)
2) Clean —— dash artifacts
3) Apply Taiwan/Hong Kong IT lexicon on zh-Hant (and CHANGELOG.zh-Hant.md)

Run after translate-zh / OpenCC s2twp. Does not replace human review.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MSG = ROOT / "src" / "i18n" / "messages"
UNITS = ROOT / "src" / "i18n" / "units.json"
SHORTS = ROOT / "src" / "i18n" / "shorts.json"

# id → (zh-Hans, zh-Hant)
FIX: dict[str, tuple[str, str]] = {
    "m.620907568264": ("Kong 平台", "Kong 平臺"),
    "m.165244cfc40a": (
        "AI 流量的 Kong 切换方式",
        "AI 流量的 Kong 切換方式",
    ),
    "m.8b9d549c4b8b": ("运作原理", "運作原理"),
    "m.0459fea1123a": (
        "应用与智能体继续使用现有的 LLM SDK。只需将调用地址改为 Kong AI Gateway，认证、护栏、路由、成本控制与日志就会自动作用于每个请求，并由 Kong 转发到合适的模型。实际的提供商密钥由 Kong 保管，应用无需保存密钥。",
        "應用程式與代理程式繼續使用既有的 LLM SDK。只需將呼叫位址改為 Kong AI Gateway，驗證、護欄、路由、成本控管與日誌就會自動套用到每個請求，並由 Kong 轉送到合適的模型。實際的提供者金鑰由 Kong 保管，應用程式無需保存金鑰。",
    ),
    "m.a2adf6e2976d": ("只需改动一行代码。", "只需改動一行程式碼。"),
    "m.3ff0039f6d12": (
        '只需改动一行代码。将 SDK 的 <code style="font-family:var(--mono)">base_url</code> 改为 Kong AI Gateway 地址后，无需修改应用即可套用全部策略。以上示例仅供说明，并不限定特定 SDK。',
        '只需改動一行程式碼。將 SDK 的 <code style="font-family:var(--mono)">base_url</code> 改為 Kong AI Gateway 位址後，無需修改應用程式即可套用全部原則。以上範例僅供說明，並不限定特定 SDK。',
    ),
    "m.95af129659f4": ("AI 应用 · LLM SDK", "AI 應用程式 · LLM SDK"),
    "m.a127cd8c7e5e": ("Kong AI Gateway · 策略执行", "Kong AI Gateway · 原則套用"),
    "m.942a334216e0": ("LLM 提供商 · 自建模型", "LLM 供應商 · 自建模型"),
    "m.255fc956244d": ("FIPS 140-3 · 静态数据加密", "FIPS 140-3 · 靜態資料加密"),
    "m.0a68b35c4038": (
        "正常处理 · 但未留下谁调用了什么的记录",
        "正常處理 · 但未留下誰呼叫了什麼的紀錄",
    ),
    "m.4a761d308da6": (
        "能否做到 — 代码执行 · 文件访问隔离",
        "能否做到 — 程式碼執行 · 檔案存取隔離",
    ),
    "m.7a55debc4887": (
        "仅有 AI Gateway 时，环境之间容易产生碎片化。",
        "僅有 AI Gateway 時，環境之間容易產生碎片化。",
    ),
    "m.c6f580c1f8cd": ("Kong vs Pure AI Gateway", "Kong vs Pure AI Gateway"),
    "m.9eb83f31a650": (
        "通过一个网关统一 LLM · MCP · A2A",
        "透過一個閘道統一 LLM · MCP · A2A",
    ),
}

UNIT_BY_MATCH: dict[str, tuple[str, str]] = {
    "AI 트래픽의 Kong 전환 방식": FIX["m.165244cfc40a"],
    "코드는 한 줄만 바뀝니다.": (
        "<b>只需改动一行代码。</b>",
        "<b>只需改動一行程式碼。</b>",
    ),
    "코드는 한 줄만 바뀝니다. SDK의 base_url을 Kong AI Gateway 주소로 바꾸면, 앱을 고치지 않고 모든 정책이 적용됩니다. 위 예시는 이해를 돕기 위한 것으로 특정 SDK에 한정되지 않습니다.": (
        '<b>只需改动一行代码。</b>将 SDK 的 <code style="font-family:var(--mono)">base_url</code> 改为 Kong AI Gateway 地址后，无需修改应用即可套用全部策略。以上示例仅供说明，并不限定特定 SDK。',
        '<b>只需改動一行程式碼。</b>將 SDK 的 <code style="font-family:var(--mono)">base_url</code> 改為 Kong AI Gateway 位址後，無需修改應用程式即可套用全部原則。以上範例僅供說明，並不限定特定 SDK。',
    ),
}

# Longer first
TW_REPLACE: list[tuple[str, str]] = [
    ("閘道器", "閘道"),
    ("質量", "品質"),
    ("訪問", "存取"),
    ("實時", "即時"),
    ("算法", "演算法"),
    ("數字化", "數位化"),
    ("響應", "回應"),
    ("賬戶", "帳戶"),
    ("標識符", "識別碼"),
    ("異步", "非同步"),
    ("帶寬", "頻寬"),
    ("擴展性", "擴充性"),
    ("元數據", "中繼資料"),
    ("兼容", "相容"),
    ("分辨率", "解析度"),
    ("變量", "變數"),
    ("數組", "陣列"),
    ("哈希", "雜湊"),
    ("屏幕", "螢幕"),
    ("優化", "最佳化"),
    ("信息安全", "資訊安全"),
    ("硬盤", "硬碟"),
    ("默認", "預設"),
    ("支持", "支援"),
    ("登錄", "登入"),
    ("創建", "建立"),
    ("加載", "載入"),
    ("鏈接", "連結"),
    ("端口", "連接埠"),
    ("對象", "物件"),
    ("視頻", "影片"),
    ("短信", "簡訊"),
    ("博客", "部落格"),
    ("雲計算", "雲端運算"),
    ("內存", "記憶體"),
    ("線程", "執行緒"),
    ("打印", "列印"),
    ("設置", "設定"),
    ("文件夾", "資料夾"),
    ("緩存", "快取"),
    ("軟件", "軟體"),
    ("網絡", "網路"),
    ("高可用", "高可用性"),
    ("自備型號", "自建模型"),
    ("自辦模式", "自建模型"),
    ("模擬伺服器", "Mock 伺服器"),
    ("健康檢查終點", "健康檢查端點"),
    ("核對表", "檢查清單"),
    ("休息時加密", "靜態資料加密"),
    ("人類案件", "Anthropic 案例"),
]


# Argos/MT sometimes injects locale labels or ASS subtitle tags — never keep these.
MT_JUNK = [
    re.compile(r"\s*\(中文\([^)]*\)\s*\)\.?"),
    re.compile(r"\s*\(简体中文\)\.?"),
    re.compile(r"\s*\(簡體中文\)\.?"),
    re.compile(r"\s*\(中文\)\.?"),
    re.compile(r"\s*\(英語:?[^)]*\)\.?"),
    re.compile(r"\s*\(英语:?[^)]*\)\.?"),
    re.compile(r"\{\\fn[^}]+\}"),
]


def clean_dashes(s: str) -> str:
    if not s:
        return s
    for p in MT_JUNK:
        s = p.sub("", s)
    s = s.replace(" —— ", " · ").replace("——", " · ")
    s = re.sub(r"^\s*—+\s*", "", s)
    s = re.sub(r"(?:\s*—\s*){2,}", " · ", s)
    s = re.sub(r"\s+·\s+·\s+", " · ", s)
    s = re.sub(r"\s{2,}", " ", s).strip()
    return s


def tw_post(s: str) -> str:
    if not s:
        return s
    for a, b in TW_REPLACE:
        s = s.replace(a, b)
    s = s.replace("高可用性性", "高可用性")
    return s


def main() -> int:
    hans = json.loads((MSG / "zh-Hans.json").read_text(encoding="utf-8"))
    hant = json.loads((MSG / "zh-Hant.json").read_text(encoding="utf-8"))

    for d in (hans, hant):
        for k, v in list(d.items()):
            d[k] = clean_dashes(v)

    for id_, (zh_s, zh_t) in FIX.items():
        if id_ not in hans:
            print(f"postedit-zh-tw: missing id {id_}", file=sys.stderr)
            continue
        hans[id_] = zh_s
        hant[id_] = zh_t

    for k, v in list(hant.items()):
        hant[k] = tw_post(v)
    for id_, (_, zh_t) in FIX.items():
        if id_ in hant:
            hant[id_] = zh_t

    units = json.loads(UNITS.read_text(encoding="utf-8"))
    for u in units.values():
        if "zh-Hans" in u:
            u["zh-Hans"] = clean_dashes(u["zh-Hans"])
        if "zh-Hant" in u:
            u["zh-Hant"] = tw_post(clean_dashes(u["zh-Hant"]))
        m = u.get("match")
        if m in UNIT_BY_MATCH:
            u["zh-Hans"], u["zh-Hant"] = UNIT_BY_MATCH[m]

    shorts = json.loads(SHORTS.read_text(encoding="utf-8"))
    for s in shorts.values():
        if "zh-Hans" in s:
            s["zh-Hans"] = clean_dashes(s["zh-Hans"])
        if "zh-Hant" in s:
            s["zh-Hant"] = tw_post(clean_dashes(s["zh-Hant"]))

    cl = ROOT / "CHANGELOG.zh-Hant.md"
    if cl.exists():
        cl.write_text(tw_post(clean_dashes(cl.read_text(encoding="utf-8"))), encoding="utf-8")

    (MSG / "zh-Hans.json").write_text(
        json.dumps(hans, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (MSG / "zh-Hant.json").write_text(
        json.dumps(hant, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    UNITS.write_text(json.dumps(units, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    SHORTS.write_text(json.dumps(shorts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print("title:", hans["m.165244cfc40a"], "/", hant["m.165244cfc40a"])
    print(
        "left 閘道器/質量/——(hant):",
        sum("閘道器" in v for v in hant.values()),
        sum("質量" in v for v in hant.values()),
        sum("——" in v for v in hant.values()),
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
