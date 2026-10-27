# Changelog

- 문의 gs.lee@konghq.com
- 경로는 **상위 메뉴 > 하위 메뉴(섹션) > 항목** 형식입니다.

---

## 2026.10.27.9737a70
### 변경

- AI Gateway > 경쟁 제품 비교 > Pure AI Gateway(LiteLLM·Portkey·Bifrost)
  - 배포 유연성 · Throughput/Latency · 반박 블록
  - 5열 비교표 (LiteLLM Enterprise 열 제거)
  - LiteLLM 공급망 사고 유지
  - Pure AI vs Kong Agent 액션 아키텍처 토글·흐름 애니메이션
  - Pure: 에스테이마다 LiteLLM·Portkey·Bifrost 분산 / Kong: Unify
  - 요약 배지를 사이드 박스 밖으로 이동
  - 아키텍처를 슬라이드형 2×2 레이어(분산 vs 한 플랫폼)로 재구성
  - AWS/Azure/GCP/On-prem/Databricks 아이콘을 iconography SVG로 교체
  - Consumers 제거, Pure GW 간 흐름선, Kong AI/API Gateway 허브 박스
  - 토글 높이 고정, 흐름 애니 단순화, 사이드 불릿(card li::before) 제거

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
