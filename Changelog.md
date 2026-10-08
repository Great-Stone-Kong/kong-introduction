# Changelog

`KONG_INTRO_VERSION`과 동일한 버전 키로 기록합니다.  
경로는 **상위 메뉴 > 하위 메뉴(섹션) > 항목** 형식입니다.  
(상위 메뉴가 드롭다운 그룹이면 `그룹 / 페이지`로 표기합니다.)

---

## 2026.10.08.1a004

### 추가

- API Gateway > 데모 > 시나리오 **부서 인가** (Key Auth · ACL · Response Transformer Advanced)
  - Finance 전체 필드 / Sales `allow.json` 마스킹 / HR `remove.json` 급여 제외
  - Sales · HR 응답을 Finance 전체 필드와 나란히 비교
  - Response Transformer Advanced 공식 플러그인 아이콘

### 변경

- API Gateway > API 보안 예시
  - 제목·서사를 **2026년 금융권의 다발적 개인정보 유출**로 확대
  - 조회 API 남용 · 인벤토리(자산관리) · Gateway 관리 일원화 · SIEM 탐지 요지 반영
  - Kong 경계(객체 인가 1차는 앱) 표현 정리

### 삭제

- (해당 없음)

---

## 2026.10.08.1a001

### 추가

- (파일 복사 버전 관리 시점의 베이스라인. 상세 항목은 이전 스냅샷을 기준으로 함.)

### 변경

- (git 이관 전 마지막 안정본)

### 삭제

- (해당 없음)
