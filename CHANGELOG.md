# Changelog

- 문의 gs.lee@konghq.com
- 경로는 **상위 메뉴 > 하위 메뉴(섹션) > 항목** 형식입니다.

---

## Unreleased

### 추가

- AI Gateway 2.0 > 신규 기능 > MCP 번들링과 1.x listener 모드 비교

### 변경

- AI Gateway > 핵심 기능
  - 제목·본문·흐름 문구에서 플러그인 표현을 정책·요청 흐름으로 정리

- 기업 소개 > 시장의 변화
  - 수치 카드 4개를 진행 링 · 한 문장 요지로 바꾸고, 화면 진입 시 링과 수치가 차오르는 애니메이션 추가

- Gateway 개요 > Gateway 필요성
  - 도식에 서비스 추가 버튼(최대 20개) · 초기화, 연결 수와 계산식 자동 갱신

- API Gateway > API 보안 예시
  - 공격 단계별 원인과 Kong 대응을 4단계 셰브론과 행 정렬 카드(미적용 원인 · 차단 지점 · Kong 대응)로 정리

- Kafka Plugins > 필요한 이유
  - 한계 카드 6개를 Before / After 대칭 비교로 정리, 자체 어댑터 비교표는 펼침으로 이동

- AI Gateway > 경쟁 제품 비교
  - 탭별 지원 항목 수 요약 막대 추가, 스크롤 시 제목과 탭 고정

- AI Gateway > AI 보안 도입 가이드
  - 권장 도입 순서(Day 1 · 30 · 90)를 단계별 성장 버블로 표현

- AI Gateway 2.0 > LLM 비용 산정
  - v2 산정식 인자(서비스 티어 · 컨텍스트 배율 · 입력 + 캐시 · 출력)를 링 체인으로 표현, 범위 카드는 펼침으로 이동

- AI Gateway 2.0 > 신규 기능 > NVIDIA NeMo Guardrails
  - 차단 흐름의 요청 · 거부 경로를 분리하고 LLM 호출 안 함 표시 위치 정렬

- Event Gateway > 필요한 이유 > 단일 Backend · Virtual Cluster
  - 클라이언트와 VC 행을 맞추고, Gateway → Backend 연결을 HA 백엔드 하나로 합침

- Insomnia > API 프로젝트 저장 옵션
  - 로컬 ↔ 클라우드 · 개인 ↔ 팀 사분면 추가, 비교표 · 전환 매트릭스 · 팀 협업 전략은 펼침으로 이동

- 인프라 구성 > 권장 사이징
  - API Gateway: Dev · Small · Medium · Large 선택과 구성 요소별 CPU · RAM 막대
  - AI Gateway: 도입 단계(POC · Lab ~ Large Enterprise) 선택과 vCPU · RAM · 노드 수 막대
  - 원본 표는 펼침으로 이동

- 보안 및 규제 매핑 > 금보원 AI 에이전트 평가기준
  - 17개 항목 대응 범위를 도넛 차트(직접 8 · 부분 8 · 범위 밖 1)로 표현, 분류별 표는 펼침으로 이동

- Kong 기업 소개 > 증명된 신뢰성
  - 카드 순서를 처리량·지연 / 고객 수·경량성으로 재배치

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
