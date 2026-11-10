# Changelog

- Contact: gs.lee@konghq.com
- Paths use **Top menu > Section > Item**.

---

## Unreleased

### Changed

- AI Gateway 2.0: Branch overview, architecture diagrams, and deploy accent colors by Enterprise · Konnect. Fold LLM cost estimation into the feature-changes section as a short summary. Retitle the section to “AI 2.0 feature changes and improvements”
- AI Gateway 2.0 > Feature changes · improvements > LLM cost estimation: add a chart comparing v1 vs v2 estimates against the provider invoice

## 2026.11.09.6af12729

### Added

- AI Gateway > Competitive comparison
  - Add Public Cloud
  - Diagram category coverage areas
- License model > Pricing basis: add explanation

### Changed

- Kong company intro: reorder sections to Overview → Market → Kong platform → Proven trust → Customers → History. Split history and global presence into their own section

## 2026.11.06.6aedbacb

### Added

- Security and compliance mapping > MSIT Agentic AI zero trust: add Kong coverage for the guide's 53 security functions. Mark covered items as Covered, and list remaining controls under Additional elements required

### Changed

- License model > Pricing structure:
  - Move the sizing example into Pricing structure
  - Show per-factor minimums as top-right pills on each card
- Event Gateway > Policy behavior: add tabs for request rules, record transcoding, field masking, and backend authentication

### Removed

- Event Gateway > Demo: remove the interactive demo section

## 2026.11.03.6ae9ed14

### Added

- AI Gateway 2.0 > New features > MCP bundling vs 1.x listener mode
- AI Gateway > AI GW 1.0 & 2.0: background · side-by-side comparison · selection criteria · 2.0 link
- AI Gateway > Switching approach: per-tool integration entries

### Changed

- AI Gateway > Core features: retitle copy from plugins to policies and request flow
- AI Gateway > Competitive comparison: summary bars for supported-item counts per tab
- Infrastructure > Recommended sizing: required resources by sizing choice

### Removed

- Agent Gateway > Overview > 2.0 Agent entity callout box

## 2026.11.02.6ae86a09
### Added
- AI Gateway > Competitive comparison > Data Platform (Databricks, Snowflake)
- Language: Traditional Chinese (`zh-Hant`, TW/HK phrasing) · Simplified as `zh-Hans`

### Changed

- AI Gateway > Feature overview
  - PII Sanitizer: one vertical grouped bar chart · per-type leak rates · type meanings
  - Behavior diagrams for semantic cache, guard, routing, token compression, kill switch, and virtual keys
  - Docker Hub image links for PII Sanitizer and token compression
  - Kong/OpenAI/Mozilla leak-rate comparison

- AI Gateway > Competitive comparison
  - Fold AI DLP comparison into an Endpoint AI Security tab
  - Merge API7 · IBM API Connect into a Legacy APIM tab
  - Merge FortiAIGate · Netskope · Portkey into an AI Runtime Security tab

---


## 2026.10.29.9b351b37
### Added

- AI Gateway > AI Gateway 2.0
- Locale: Simplified Chinese (`zh`, from English · formal written-tone cleanup)
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
