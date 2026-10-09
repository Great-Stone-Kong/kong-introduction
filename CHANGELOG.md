# Changelog

- 문의 gs.lee@konghq.com
- 경로는 **상위 메뉴 > 하위 메뉴(섹션) > 항목** 형식입니다.
- `##` 버전은 GitHub Release와 맞춥니다. Release 전에는 맨 위 초안 섹션 하나만 갱신합니다.

---

## 2026.10.09.6ac845f9

### 추가

- Insomnia > Postman 마이그레이션
  - Export → Import → 완료 3단계 목업 (1:1:2)
  - Postman Export · Insomnia Preferences Data Import · 테스트 UI
  - 비교표 Insomnia 열 강조 (경쟁 제품 비교와 동일 방식)
- Insomnia > AI 연동
  - Preferences · AI Settings 목업
  - Mock · Smart Commits · MCP Client 작업 목업

## 2026.10.08.1a004

### 추가

- API Gateway > 데모 > 시나리오 **부서 인가**
  - 재무는 직원 정보 전체, 영업은 민감 필드 제외, HR은 급여만 제외한 응답 예시
  - 영업·HR 응답을 재무 전체 필드와 비교해 보여 줌

### 변경

- API Gateway > API 보안 예시
  - 제목·서사를 **2026년 금융권의 다발적 개인정보 유출**로 확대
  - 조회 API 남용, API 인벤토리(자산관리), Gateway 관리 일원화, 탐지 요지 반영
