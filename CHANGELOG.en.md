# Changelog

- Contact: gs.lee@konghq.com
- Paths use **Top menu > Section > Item**.

---

## Unreleased

### Added

- Locale: Simplified Chinese (`zh`, from English with formal written-tone cleanup)

### Changed

- i18n: Hangul-as-key → stable-key (`m.` / `u.` / `s.`) catalogs · engine · reference baseline
- i18n: keep compact runtime blob (Hangul→EN/JA/ZH + sparse `I` map) to avoid HTML size growth
- Demo/trace mock outputs (EG Analytics JSON, KDemo summary labels, etc.): fill missing EN/JA/ZH · stop excluding `egd-out` from i18n

## 2026.10.29.fb000bae
### Added

- Agent Gateway > A2A Proxy criteria: Service·Route only vs ai-a2a-proxy — decision, benefits, behavior

### Changed

- Agent Gateway > A2A Proxy: flow SVG and copy refinements
- Sidebar download · version box and changelog modal chrome: EN · JA

## 2026.10.28.63575106
### Added

- Infrastructure > Recommended sizing > API Gateway: Redis S·M·L sizing and uses

### Changed

- Infrastructure > Recommended sizing: tightened section intro copy

## 2026.10.28.df84c27f
### Added

- Agent Gateway > AI Agent security cases: Cohere (Qwen3.8 unauthorized upload attempt)
- AI Gateway > Competitive comparison > Kong vs IBM API Connect tab

### Changed

- Agent Gateway > AI Agent security cases: Kong approach under each card's root cause
- AI Gateway > Regulation · compliance section removed (merged into Security & compliance mapping)
- Licensing > request counting: Stream (TCP/TLS) session counting method
- API Gateway > Performance · scalability: updated to GigaOm Benchmark 2025 figures
- AI Gateway > Competitive comparison
  - Target shifted from LiteLLM alone to Pure AI Gateway (LiteLLM · Portkey · Bifrost)

## 2026.10.22.6ad99f11
### Changed

- AI Gateway > Competitive comparison > LiteLLM supply chain
  - Added the October 21 PyPI 1.107.0 incident
  - Timeline for Mar 24th, Aug 11th, and Oct 21st

## 2026.10.19.6ad5f6a0
### Changed

- Infrastructure > Recommended sizing: improved readability

## 2026.10.19.6ad56817
### Changed

- Separated "Event Gateway" into a standalone item in the top menu
- Added information on the necessity of Event Gateway and examples of how Virtual Clusters operate
- License model > pricing structure: added Event Gateway and Insomnia

## 2026.10.16.6ad1ab81

### Changed

- Improved API7 comparison description

## 2026.10.14.80c47eac

### Added

- Multilingual support in the main release stream
- Light / Dark mode

## 2026.10.12.8b884563

### Added

- API Gateway > Kafka Plugins
- API Gateway > Event Gateway

## 2026.10.09.6ac851b8

### Added

- Insomnia > Postman migration
- Insomnia > AI integration

## 2026.10.08.1a004

### Added

- API Gateway > Demo > Scenario **Department authorization**

### Changed

- API Gateway > API security examples
  - Expanded the title and narrative to **multiple personal-data breaches in the 2026 financial sector**
  - Covers lookup-API abuse, API inventory (asset management), unified Gateway management, and detection takeaways
