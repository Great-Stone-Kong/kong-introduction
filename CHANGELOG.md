# Changelog

- 문의 gs.lee@konghq.com
- 경로는 **상위 메뉴 > 하위 메뉴(섹션) > 항목** 형식입니다.

---

## Unreleased

### 변경

- AI Gateway 2.0: Enterprise · Konnect 선택에 따라 개요·아키텍처 구성도·배포 강조색을 분기. LLM 비용 산정을 기능 변경 섹션 하위로 요약 흡수. 섹션 제목을 「AI 2.0 기능 변경 및 개선 사항」으로 정리
- AI Gateway 2.0 > 기능 변경 · 개선 > LLM 비용 산정: v1·v2 추정과 제공사 실청구를 비교하는 그래프 추가
- AI Management: EE에서는 좌측 개요만 활성, 나머지 비활성. AI Cost Management · Catalog · AI Registry에만 「EE 예정」표시. Konnect에서는 배지 없이 전 섹션 활성
- AI Management > 활용 사례: 여섯 사례 도식을 원본 아키텍처(게이트웨이 · Context Mesh · Management plane)에 맞게 재구성
- AI Management > 활용 사례: 탭 pane 닫는 태그 오류로 소프트웨어 팩토리만 보이던 문제 수정. 여섯 사례 도식이 탭 전환으로 표시되도록 복구
- AI Management > 활용 사례: 공통 격자 · 화살표 · 하단 Konnect 밴드로 도식을 정돈하고, EN 등 다국어 라벨을 박스 폭에 맞게 축약
- 좌측 레일 라벨 Home → Kong. Kong 기업 소개 > 개요: AI Connectivity 슬로건과 API · AI 바로가기 가안 배치
- Kong 기업 소개 > 개요: 상단 슬로건 가운데 정렬, 좌우 손 SVG, 바로가기를 설명 패널 안으로 이동. API→Mesh→AI 체인 제거
- Kong 기업 소개 > 개요: konghq.com 원본 손·Cloud Native/Agentic AI 비주얼로 교체. API/AI Connectivity를 카드 없이 필라+플러스로 배치
- Kong 기업 소개 > 개요: API/AI Connectivity 필라를 큰 원형 흐름 도식으로 키우고 마스코트 제거
- Kong 기업 소개 > 개요: Connectivity 도식 크기 조정, 설명 문구 복구. AI 카피 톤 정리
- Kong 기업 소개 > 개요: 상단 손 이미지 좌우 교체·크기 확대
- Kong 기업 소개 > 개요: 손 이미지를 가운데 방향·반투명·하단 겹침으로 조정하고 크기 확대

## 2026.11.09.6af12729

### 추가

- AI Gateway > 경쟁 제품 비교
  - Public Cloud 추가
  - 범주별 커버 영역 도식화
- 라이선스 모델 > 가격 기준 : 설명 추가

### 변경

- Kong 기업 소개: 섹션 순서를 개요 → 시장의 변화 → Kong 플랫폼 → 증명된 신뢰성 → 고객 사례 → 연혁으로 조정. 연혁·글로벌 거점을 별도 섹션으로 분리

## 2026.11.06.6aedbacb

### 추가

- Event Gateway > 정책 동작: Event Gateway 3.0에서 추가된 요청 규칙·레코드 변환·필드 마스킹·Backend 인증 탭 설명 추가
- 보안 및 규제 매핑 > 과기부 Agentic AI 제로트러스트: 안내서 53개 보안 기능의 Kong 대응 범위 추가. Kong이 맡으면 대응으로 표기하고, 그 밖에 필요한 통제는 추가 필요 요소에 적음

### 변경

- 라이선스 모델 > 가격 구조: 
  - 기존 규모 별 구성 규모 예시를 가격 구조로 이동
  - 요소별 최소 수량을 카드 우측 상단 필로 표시

### 삭제

- Event Gateway > 데모: 인터랙티브 데모 섹션 삭제

## 2026.11.03.6ae9ed14

### 추가

- AI Gateway 2.0 > 신규 기능 > MCP 번들링과 1.x listener 모드 비교
- AI Gateway > AI GW 1.0 & 2.0: 배경 · 대칭 비교 · 선택 기준 · 2.0 링크
- AI Gateway > 전환 방식: 개별 도구 항목 추가

### 변경

- AI Gateway > 핵심 기능 : 플러그인 표현을 정책·요청 흐름으로 정리
- AI Gateway > 경쟁 제품 비교 : 탭별 지원 항목 수 요약 막대 추가
- 인프라 구성 > 권장 사이징 : 사이징 선택에 따른 필요 자원 표기

### 삭제

- Agent Gateway > 개요 > 2.0 Agent 엔티티 안내 박스

## 2026.11.02.6ae86a09
### 추가
- AI Gateway > 경쟁 제품 비교 > Data Platform(Databricks, Snowflake)
- 언어: 번체 중국어(`zh-Hant`, 대만/홍콩 표현) · 간체를 `zh-Hans`로 구분

### 변경

- AI Gateway > 대표 기능 개요
  - PII Sanitizer: 평가셋 비교를 세로 그룹 막대 차트로 통합 · 유형별 누출률 · 항목 의미 정리
  - 시맨틱 캐시·가드·라우팅·토큰 압축·킬 스위치·가상 키 동작 도식 추가
  - PII Sanitizer · 토큰 압축에 Docker Hub 이미지 링크 추가
  - Kong/OpenAI/Mozilla 누출률 비교

- AI Gateway > 경쟁 제품 비교
  - AI DLP 비교를 Endpoint AI Security 탭으로 통합
  - API7 · IBM API Connect를 Legacy APIM 탭으로 통합
  - FortiAIGate · Netskope · Portkey를 AI Runtime Security 탭으로 통합

---


## 2026.10.29.9b351b37
### 추가

- AI Gateway > AI Gateway 2.0
- 언어: 간체 중국어(`zh`, 영문 기준 · 공식 문어체 보정)
- Agent Gateway > A2A Proxy 적용 기준: Service·Route만 vs ai-a2a-proxy 판단 · 장점 · 동작 차이

### 변경

- Agent Gateway > A2A Proxy: 흐름 SVG·카피 정리
- 사이드바 다운로드·버전 박스 및 변경 이력 모달 문구에 EN·JA 적용

## 2026.10.28.63575106
### 추가

- 인프라 구성 > 권장 사이징 > API Gateway: Redis S·M·L 항목 및 용도 설명 추가

### 변경

- 인프라 구성 > 권장 사이징: 섹션 소개 문구 정리

## 2026.10.28.df84c27f
### 추가

- Agent Gateway > AI Agent 보안 사례: Cohere(Qwen3.8 무단 업로드 시도) 사례 추가
- AI Gateway > 경쟁 제품 비교 > Kong vs IBM API Connect 탭 추가

### 변경

- Agent Gateway > AI Agent 보안 사례: 각 카드 핵심 원인 아래 Kong 접근 방식 추가
- AI Gateway > 규제 · 컴플라이언스 섹션 제거 (보안 및 규제 매핑으로 통합)
- 라이선스 > 호출량 산정: Stream(TCP/TLS) 세션 산정 방식 추가
- API Gateway > 성능 · 확장성: GigaOm Benchmark 2025 수치로 갱신
- AI Gateway > 경쟁 제품 비교
  - 기존 LiteLLM 단일에서 Pure AI Gateway(LiteLLM·Portkey·Bifrost)를 대상으로 변경

## 2026.10.22.6ad99f11
### 변경

- AI Gateway > 경쟁 제품 비교 > LiteLLM 공급망 사고
  - 10월 21일 PyPI 1.107.0 사고 추가
  - 3월 24일 · 8월 11일 · 10월 21일 타임라인

## 2026.10.19.6ad5f6a0
### 변경

- 인프라 구성 > 권장 사이징 가독성 개선

## 2026.10.19.6ad56817
### 변경

- Event Gateway를 상단 메뉴 단독 항목으로 분리
- Event Gateway 필요성 및 Virtual Cluster 동작 예시 추가
- 라이선스 모델 > 가격 구조에 Event Gateway, Insomnia 추가

## 2026.10.16.6ad1ab81

### 변경

- API7 비교 설명 개선

## 2026.10.14.80c47eac

### 추가

- 다국어 지원을 메인 스트림에 포함
- Light / Dark 모드

## 2026.10.12.8b884563

### 추가

- API Gateway > Kafka Plugins
- API Gateway > Event Gateway

## 2026.10.09.6ac851b8

### 추가

- Insomnia > Postman 마이그레이션
- Insomnia > AI 연동

## 2026.10.08.1a004

### 추가

- API Gateway > 데모 > 시나리오 **부서 인가**

### 변경

- API Gateway > API 보안 예시
  - 제목·서사를 **2026년 금융권의 다발적 개인정보 유출**로 확대
  - 조회 API 남용, API 인벤토리(자산관리), Gateway 관리 일원화, 탐지 요지 반영
