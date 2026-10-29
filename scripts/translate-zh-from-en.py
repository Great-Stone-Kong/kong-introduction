#!/usr/bin/env python3
"""
EN → Simplified Chinese (zh) via Argos Translate.

Strategy:
- Translate plain text only; keep HTML tags / ${vars} out of the MT input
- Post-edit toward formal written Chinese (report / official tone)
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import argostranslate.translate

ROOT = Path(__file__).resolve().parents[1]
MSG = ROOT / "src" / "i18n" / "messages"
CACHE = ROOT / "src" / "i18n" / ".zh-cache.json"
UNITS = ROOT / "src" / "i18n" / "units.json"
SHORTS = ROOT / "src" / "i18n" / "shorts.json"

SPLIT_RE = re.compile(r"(<[^>]+>|\$\{\w+\}|&(?:[a-zA-Z]+|#\d+);|‹B\d+›)")

# Longer phrases first
BRANDS = [
    "AI Gateway",
    "API Gateway",
    "Event Gateway",
    "Agent Gateway",
    "Dev Portal",
    "Control Plane",
    "Data Plane",
    "OpenTelemetry",
    "PostgreSQL",
    "Kubernetes",
    "OpenAPI",
    "GraphQL",
    "WebSocket",
    "Keycloak",
    "Prometheus",
    "Insomnia",
    "Konnect",
    "Kong",
    "Kafka",
    "gRPC",
    "OAuth 2.0",
    "OAuth2",
    "OAuth",
    "OIDC",
    "JWT",
    "mTLS",
    "TLS",
    "FIPS",
    "Redis",
    "Istio",
    "Envoy",
    "MCP",
    "LLM",
    "DLP",
    "RBAC",
    "ACL",
    "OPA",
    "SAML",
    "SCIM",
    "AWS",
    "Azure",
    "GCP",
    "Okta",
    "Jaeger",
]

FORMAL_FIXES: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"人工智能特工"), "AI 智能体"),
    (re.compile(r"AI\s*特工"), "AI 智能体"),
    (re.compile(r"特工"), "智能体"),
    (re.compile(r"AI\s*代理人"), "AI 智能体"),
    (re.compile(r"AI\s*代理(?!服务器|网关)"), "AI 智能体"),
    (re.compile(r"开发AI代理"), "面向 AI 智能体开发"),
    (re.compile(r"呼叫(?:了|到)?"), "调用"),
    (re.compile(r"打过"), "调用"),
    (re.compile(r"打电话(?:给)?"), "调用"),
    (re.compile(r"每名智能体死亡开关"), "按智能体紧急阻断"),
    (re.compile(r"每名智能体不收费"), "不按智能体计费"),
    (re.compile(r"LLM\s*型号"), "LLM 模型"),
    (re.compile(r"(\d+)\s*种型号"), r"\1 个模型"),
    (re.compile(r"第(\d+)型"), r"第\1 级"),
    (re.compile(r"正在装入\.\.\."), "加载中…"),
    (re.compile(r"正在装入"), "加载中"),
    (re.compile(r"更改日志"), "变更历史"),
    (re.compile(r"失眠云"), "Insomnia Cloud"),
    (re.compile(r"失眠症"), "Insomnia"),
    (re.compile(r"失眠"), "Insomnia"),
    (re.compile(r"邮差"), "Postman"),
    (re.compile(r"金刚"), "Kong"),
    (re.compile(r"法学硕士"), "LLM"),
    (re.compile(r"大赦国际\s*GW"), "AI GW"),
    (re.compile(r"大赦国际"), "AI"),
    (re.compile(r"AI网关"), "AI Gateway"),
    (re.compile(r"API网关"), "API Gateway"),
    (re.compile(r"金刚"), "Kong"),
    (re.compile(r"\bLM\b"), "LLM"),
    (re.compile(r"AI网关"), "AI Gateway"),
    (re.compile(r"API网关"), "API Gateway"),
    (re.compile(r"我们(?:将|会|可以|能够|要把|来)?"), ""),
    (re.compile(r"咱们"), ""),
    (re.compile(r"[吧呢啊啦哟呗](?=\s|[。．！？；：]|$)"), ""),
    (re.compile(r"请看"), "参见"),
    (re.compile(r"来看看"), "参见"),
    (re.compile(r"简单说"), "简言之"),
    (re.compile(r"也就是说"), "即"),
    (re.compile(r"搞定"), "完成"),
    (re.compile(r"挺好"), "适宜"),
    (re.compile(r"不错"), "良好"),
    (re.compile(r"破碎的"), "失效的"),
    (re.compile(r"装入"), "加载"),
    (re.compile(r"现在\s*(?=<em>)"), "随后由"),
    (re.compile(r"(</em>)\s*说"), r"\1完成连接"),
    (re.compile(r"(</em>)\s*做"), r"\1完成连接"),
    (re.compile(r"\(美国英语\)\.?"), ""),
    (re.compile(r"\(英语\)\.?"), ""),
    (re.compile(r"\s{2,}"), " "),
    (re.compile(r" +([，。！？；：])"), r"\1"),
]


def formalize(text: str) -> str:
    out = text
    for pat, rep in FORMAL_FIXES:
        out = pat.sub(rep, out)
    # cleanup empty clutter left by removing 我们
    out = re.sub(r"。{2,}", "。", out)
    out = re.sub(r"\s+。", "。", out)
    return out.strip()


def protect_brands(text: str) -> tuple[str, list[str]]:
    parts: list[str] = []
    out = text
    for brand in BRANDS:
        pat = re.compile(re.escape(brand), re.I)
        if not pat.search(out):
            continue

        def repl(m: re.Match[str], b: str = brand) -> str:
            parts.append(b if b.lower() == m.group(0).lower() else m.group(0))
            return f"‹B{len(parts) - 1}›"

        out = pat.sub(repl, out)
    return out, parts


def unprotect_brands(text: str, parts: list[str]) -> str:
    def repl(m: re.Match[str]) -> str:
        i = int(m.group(1))
        return parts[i] if 0 <= i < len(parts) else m.group(0)

    return re.sub(r"‹B(\d+)›", repl, text)


def translate_plain(text: str) -> str:
    t = text.strip()
    if not t:
        return text
    lead = re.match(r"^\s*", text).group(0)
    trail = re.search(r"\s*$", text).group(0)
    protected, brands = protect_brands(t)
    zh = argostranslate.translate.translate(protected, "en", "zh")
    zh = unprotect_brands(zh, brands)
    # If Argos ate markers, restore any leftover by best effort
    zh = re.sub(r"‹B(\d+)›", lambda m: brands[int(m.group(1))] if int(m.group(1)) < len(brands) else "", zh)
    return lead + formalize(zh) + trail


def translate_mixed(text: str) -> str:
    """Translate only non-tag / non-var segments."""
    if not text:
        return text
    parts = SPLIT_RE.split(text)
    out = []
    for p in parts:
        if not p:
            continue
        if p.startswith("‹B") or SPLIT_RE.fullmatch(p):
            out.append(p)
        else:
            out.append(translate_plain(p) if p.strip() else p)
    return formalize("".join(out))


def load_cache() -> dict[str, str]:
    if CACHE.exists():
        return json.loads(CACHE.read_text(encoding="utf-8"))
    return {}


def save_cache(cache: dict[str, str]) -> None:
    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def is_corrupt(s: str) -> bool:
    return bool(
        re.search(
            r"ZZ\d|⟦|⟧|QQ\d|HTMLTAG|XHTML|‹B\d+›|特工|死亡开关|人工智能特工|美国英语|\(英语\)|金刚",
            s,
        )
    )


def main() -> None:
    fresh = "--fresh" in sys.argv
    en = json.loads((MSG / "en.json").read_text(encoding="utf-8"))
    units = json.loads(UNITS.read_text(encoding="utf-8"))
    shorts = json.loads(SHORTS.read_text(encoding="utf-8"))
    cache: dict[str, str] = {} if fresh else load_cache()
    if not fresh:
        cache = {k: v for k, v in cache.items() if not is_corrupt(v)}

    texts = [str(v) for v in en.values()]
    texts += [str(u["en"]) for u in units.values()]
    texts += [str(s["en"]) for s in shorts.values()]

    unique, seen = [], set()
    for t in texts:
        if t in seen:
            continue
        seen.add(t)
        if t not in cache:
            unique.append(t)
    print(f"to translate={len(unique)} cache={len(cache)} fresh={fresh}", flush=True)

    for i, t in enumerate(unique, 1):
        cache[t] = translate_mixed(t)
        if i % 100 == 0:
            save_cache(cache)
            print(f"progress {i}/{len(unique)}", flush=True)
    save_cache(cache)

    # Re-apply formalize for rule updates
    for k, v in list(cache.items()):
        cache[k] = formalize(v)

    zh_msg = {id_: cache[str(en[id_])] for id_ in en}
    chrome = {
        "m.0a4ca9bc91ee": "下载",
        "m.e78d03ec8597": "变更历史",
        "m.c7b31b84e449": "查看变更历史",
        "m.b5fe570a7d09": "关闭 ✕",
        "m.8bf609c884ca": "加载中…",
        "m.9364c67bcdec": "未能加载变更历史。",
        "m.009abcbed3e1": "暂无内容。",
        "m.b46e173c2358": "新版本 v${v}",
        "m.20ae560946c7": "当前版本 v${v}",
    }
    zh_msg.update(chrome)

    for u in units.values():
        u["zh"] = cache[str(u["en"])]

    force_short = {
        "About": "简介",
        "Gateway 101": "Gateway 入门",
        "API GW": "API GW",
        "AI GW": "AI GW",
        "Insomnia": "Insomnia",
        "Infra": "基础设施",
        "Security": "安全合规",
        "Licensing": "许可",
        "Overview": "概览",
    }
    for s in shorts.values():
        s["zh"] = force_short.get(s["en"], cache[str(s["en"])])

    (MSG / "zh.json").write_text(
        json.dumps(zh_msg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    UNITS.write_text(json.dumps(units, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    SHORTS.write_text(json.dumps(shorts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    bad = sum(1 for v in zh_msg.values() if is_corrupt(v))
    ubad = sum(1 for u in units.values() if is_corrupt(u["zh"]))
    print(f"done messages={len(zh_msg)} corrupt_msg={bad} corrupt_unit={ubad}")


if __name__ == "__main__":
    main()
