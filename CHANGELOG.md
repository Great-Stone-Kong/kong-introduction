# Changelog

- 문의 gs.lee@konghq.com
- 경로는 **상위 메뉴 > 하위 메뉴(섹션) > 항목** 형식입니다.

---

## 2026.10.09.6ac851b8

### 추가

- API Gateway > Event Gateway
- API Gateway > Kafka Plugins
- API Gateway > Kafka Plugins > 관측성
- Insomnia > Postman 마이그레이션
- Insomnia > AI 연동

### 변경

- API Gateway > Event Gateway > 필요한 이유
  - 물리 다수 클러스터 vs Virtual Cluster 단일 Backend 2열 아키텍처 비교 추가
  - 거버넌스 필요성을 3행 도식(프로토콜 · 접속점 HA · 정책)으로 정리
  - 브로커 HA와 접속점 HA를 구분해 서술
  - 브로커 직결 비교표를 동일 섹션 하위로 통합
- API Gateway > Event Gateway > 효과
  - Core Use Cases & Business Outcomes 10건으로 재정리

### 추가

- API Gateway > Event Gateway > Failover
  - Partner DR 모델 · Planned Failover 5단계 애니메이션
  - 아키텍처와 5단계 타임라인 동기화 · 동선 · 단계 폭 정리

### 삭제

- API Gateway > Event Gateway > Kong 적용 전후

## 2026.10.08.1a004

### 추가

- API Gateway > 데모 > 시나리오 **부서 인가**

### 변경

- API Gateway > API 보안 예시
  - 제목·서사를 **2026년 금융권의 다발적 개인정보 유출**로 확대
  - 조회 API 남용, API 인벤토리(자산관리), Gateway 관리 일원화, 탐지 요지 반영
