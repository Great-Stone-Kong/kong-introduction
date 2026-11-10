# kong-introduction — 에이전트 공통 작업 규칙

이 파일이 **Cursor · Claude(Claude Code / Cowork) 공통 정본**이다.
`.cursor/rules/*.mdc`와 `CLAUDE.md`는 이 파일을 가리키는 얇은 진입점이며, 규칙을 바꿀 때는 **이 파일만** 수정한다.

- 원격: [Great-Stone-Kong/kong-introduction](https://github.com/Great-Stone-Kong/kong-introduction)
- 문의: gs.lee@konghq.com

---

## 1. 프로젝트 개요

Kong(The AI Connectivity Company) 소개 자료를 **단일 HTML 파일**로 만든다. 오프라인에서도 열리도록 CSS·JS·이미지는 HTML 안에 둔다.

- 좌측 레일(Kong · AI · API) → 좌측 트리(현재 레일의 페이지 · 현재 페이지만 펼쳐 섹션) 구조, 상단 바는 브레드크럼(레일 › 페이지 › 섹션). 트리는 `.page[data-rail][data-rgroup][data-icon]`과 `.sec[data-title]`에서 자동 생성된다. 사이드에서 마우스가 나가면 현재 위치만 남기고 톤다운한다(`localStorage('kong-nav-dim')='0'`이면 끔). 상단 바 배율 왼쪽 `검색 ⌘K`(⌘K · Ctrl+K · `/`)로 현재 에디션 · 언어에서 보이는 페이지 · 섹션을 찾고, 페이지 끝에는 같은 레일 순서의 이전 · 다음 버튼이 자동으로 붙는다. 인쇄 범위는 현재 레일의 같은 트리 그룹(`data-rgroup`). 레일 하단에 에디션(EE / Konnect) · 언어(국기) 선택이 있다. 상세: `achive/plans/nav-rail-ia.md`
- 언어: 한국어(원문) · 영어 · 일본어 · 번체 중국어 · 간체 중국어(`ko` / `en` / `ja` / `zh-Hant` / `zh-Hans`). 드롭다운은 번체가 간체 위. `?lang=zh`는 `zh-Hans`로 매핑
- 테마: 다크(기본) · 라이트(`html[data-theme]`)
- 에디션 가시성: Enterprise / Konnect(`html[data-edition]`)

## 2. 디렉터리 구조

| 경로 | 역할 | git |
|---|---|---|
| `src/deck.html` | **편집 소스.** 한국어 원문 마크업 · CSS · JS · `<!-- I18N_BUNDLE -->` 자리 | 추적 |
| `src/i18n-engine.js` | 런타임 i18n 엔진(walk / setLang) | 추적 |
| `src/i18n/messages/{ko,en,ja,zh-Hant,zh-Hans}.json` | stable id(`m.<12hex>`) → 문구 | 추적 |
| `src/i18n/units.json` | 인라인 태그가 섞인 단위(`u.…`): `match`(KO textContent) → `en`/`ja`/`zh-Hant`/`zh-Hans` innerHTML | 추적 |
| `src/i18n/fragments.json` | 문장 일부 치환용 message id 목록 | 추적 |
| `src/i18n/shorts.json` | 상단 메뉴 축약 라벨 | 추적 |
| `src/i18n/README.md` | i18n 카탈로그 상세 | 추적 |
| `scripts/build.mjs` | `src/` → `kong-introduction.html` + `docs/index.html` | 추적 |
| `scripts/check-i18n.mjs` | 한글 키 누락 · 언어 간 키 불일치 검사 | 추적 |
| `scripts/translate-zh-from-en.py` | EN 기준 ZH 일괄 갱신(`npm run translate-zh`) | 추적 |
| `scripts/migrate-i18n-keys.mjs` · `verify-i18n-refactor.mjs` | stable-key 마이그레이션 · 검증(일상 작업에서는 사용 안 함) | 추적 |
| `kong-introduction.html` | **빌드 산출물(배포본).** 직접 수정 금지 | 추적 |
| `docs/index.html` · `docs/.nojekyll` | GitHub Pages용 사본(빌드가 함께 생성) | 추적 |
| `VERSION` | 버전 문자열. 빌드가 읽어 `KONG_INTRO_VERSION`에 주입 | 추적 |
| `CHANGELOG.md` (+ `.en` `.ja` `.zh-Hant` `.zh-Hans`) | 콘텐츠 변경 이력. KO가 정본 | 추적 |
| `reference/` | stable-key 이전 기준선(동결). **수정 금지** | 추적 |
| `.github/workflows/release.yml` | 수동 실행 Release 워크플로 | 추적 |
| `AGENTS.md` · `CLAUDE.md` · `.cursor/rules/` | 에이전트 규칙 | 추적 |
| `Korean Docs of Kong Design System [v1.3]/` | 디자인 시스템(로컬 참고) | 미추적 |
| `achive/` | 고객 요구사항 · 백데이터 · 아이콘 · 로고 등 참고 자료(로컬) | 미추적 |
| `kong-introduction-i18n.html` · `.tmp-*` | 과거 산출물 · 임시 파일 | 미추적 |

`.gitignore`는 **allowlist 방식**이다(`*` 무시 후 `!경로`로 허용). 새로 추적할 파일이 생기면 `.gitignore`에 `!경로`를 추가한다.

## 3. 빌드 · 검증

```bash
npm run check-i18n   # 한글 문구의 키 누락, ko/en/ja/zh-Hant/zh-Hans 키 불일치 검사
npm run build        # kong-introduction.html + docs/index.html 생성 (VERSION 주입)
./build.sh           # 위 두 명령을 순서대로 실행
```

- Node 20 이상. 외부 npm 의존성 없음.
- 빌드는 결정적이다. `src/`가 같으면 산출물도 같다(빌드 후 `git status`로 확인 가능).
- 빌드는 `VERSION`만 읽는다. 버전을 새로 만들거나 Changelog를 고치지 않는다.
- 확인: 브라우저에서 `kong-introduction.html` 열기 → `?lang=en` · `?lang=ja` · `?lang=zh-Hant` · `?lang=zh-Hans` · `?edition=konnect` · `?theme=light`

## 4. 편집 워크플로

1. **`src/deck.html`을 한국어로 수정한다.** `kong-introduction.html` · `docs/index.html`만 고치지 않는다.
2. 새 한글 문구는 `src/i18n/messages/ko.json`에 id를 만들고, **같은 id**로 `en.json` · `ja.json` · `zh-Hant.json` · `zh-Hans.json`에도 넣는다.
   - 인라인 태그(`<b>`, `<em>`, `<br>` 등)가 섞인 제목·문장은 `units.json`에 `match`(KO textContent)와 언어별 innerHTML로 넣는다.
   - 중국어는 간체(`zh-Hans`)를 기준으로 두고, 번체(`zh-Hant`)는 대만/홍콩 표현(OpenCC `s2twp` 등)으로 맞춘다.
   - 기존 문구를 고칠 때는 **id를 유지**하고 값만 바꾼다(stable key).
   - 번역이 빠지면 `check-i18n`·`build`가 실패한다. 사용자가 한국어만 요청해도 빌드 통과용 번역(초벌)은 함께 넣고, 응답에 초벌임을 밝힌다.
3. `npm run check-i18n && npm run build`
4. 언어 · 테마 · 에디션별로 화면을 확인한다.
5. 작업 단위가 끝나면 커밋한다(9장).

## 5. 다국어 · 에디션 · 테마

### 가시성 속성

- `data-show-lang="ko"`: 한국어에서만 표시(한국 규제 · 국내 사례 · 국내 기업명 등). 생략하면 전 언어.
- `data-show-lang="en ja"`: 지정 언어에서만 표시.
- `data-show-edition="enterprise"` / `"konnect"` / `"enterprise konnect"`: 생략하면 전 에디션.
- 런타임: `html[data-lang]` · `html[data-edition]` (`?lang=` · `?edition=` · localStorage).
- `data-rail="kong|ai|api"`(공백 구분 다중 가능): 페이지가 속한 레일. 모든 `.page`에 필수. 런타임 `html[data-rail]` · `KONG_RAIL.setRail()` · `?rail=` · 해시 `#<rail>:<page>/<sec>`(공유 페이지).
- `data-edition-lock="konnect"`: 해당 에디션이 아니면 숨기지 않고 메뉴에 비활성 + `Konnect` 배지로 남긴다(진입은 차단).
- 상단·좌측 메뉴는 숨김 대상 page/sec를 넣지 않는다(`audienceOk`). 에디션 토글은 레일 하단 세그먼트가 `KONG_EDITION.setEdition`을 호출한다.

### 테마

새 UI는 CSS 변수(`--navy`, `--lime`, `--card`, `--line`, `--heading` 등)를 쓰고, `html[data-theme="light"]`에서도 읽히는지 확인한다. SVG 색도 하드코딩보다 변수를 우선한다.

## 6. 콘텐츠 원칙

### 제목 · 헤더 작성 규칙

1. 모든 제목 · 목차 · 소제목은 구어체나 대화체(~합니다, ~셉니다, ~하는 방법)를 쓰지 않는다.
2. 명사 또는 명사구(~ 방식, ~ 기준, ~ 절차, ~ 개요) 형태로 간결하게 쓴다.
3. 번역투나 설명조 문장은 명사형 명제로 요약한다.

| (X) | (O) |
|---|---|
| 호출량은 이렇게 셉니다 | 호출량 산정 방식 |
| 요금은 얼마나 나오나요 | 요금 산출 기준 |
| 비밀번호를 바꾸는 법 | 비밀번호 변경 절차 |
| 이것만은 주의하세요 | 주요 주의사항 |
| 서비스 사용 신청하기 | 서비스 신청 안내 |

### 사실 · 출처 · 보안

- 제품 기능은 **Kong 공식 문서(developer.konghq.com)로 확인한 것만** 쓴다. 최소 버전이 있으면 표기한다(예: 3.13+).
- 외부 사건 · 통계 · 기사 인용에는 출처 링크를 단다. 확인하지 못한 수치는 쓰지 않는다.
- Kong이 할 수 없는 부분(범위 밖 · 함께 필요한 통제)을 함께 적는다. 과장하지 않는다.
- **가격 · 단가는 기밀**이다. 금액을 쓰지 않는다.
- 국내 고객 · 사고 사례는 **익명화**한다(예: "국내 A은행"). 사내 메신저의 이름 · 발언은 넣지 않는다.
- 누락된 데이터나 이미지가 필요하면 추측하지 말고 사용자에게 요청한다.

### 디자인 시스템 · 아이콘

- 기준: `Korean Docs of Kong Design System [v1.3]/README.md`(로컬). 다크 그린(`#001408`) + electric lime(`#CCFF00`), Funnel Sans, sentence case, 이모지 · 보라 테마 · 카드 남발 지양.
- 기존 소개 HTML의 CSS 변수 · 클래스와 충돌하면 **기존 패턴을 우선**하고, 새 UI는 디자인 시스템에 가깝게 맞춘다.
- 글이 많은 섹션 · 문장 속 수치를 시각화할 때는 `Korean Docs of Kong Design System [v1.3]/guides/visual-elements.md`(시각 요소 카탈로그 E1–E16)를 먼저 읽는다. 섹션당 시각 앵커 1개, 라벨 대신 요지 한 문장, 원문은 `details.vr-more` 펼침, 덱에 이미 있는 `.vr-*` 패턴 재사용, 문서의 도식 점검 목록(행 정렬 · HA 수렴 · 왕복 경로 분리 · 선택 UX · 카운트업)을 따른다.
- 애니메이션 · 전환 · 영상 연출을 넣을 때는 `Korean Docs of Kong Design System [v1.3]/guides/motion.md`(모션 용어 M1–M20)의 용어별 상태를 따른다. 기본은 이즈 아웃 · 스태거 · 카운트업 · 디졸브 · 와이프 · 매치 컷, 오버슈트 · 스쿼시 앤 스트레치 · 3D 오빗은 쓰지 않고, 글리치는 장애 · 공격 상태에만 쓴다. UI 120–420ms, 데이터 연출만 1.2–1.8s, `prefers-reduced-motion` · 인쇄는 최종 상태.
- **아이콘은 회사 권고 세트(Kong Iconography)를 반드시 먼저 쓴다. 직접 그린 아이콘 · 임의 SVG · Lucide 등 외부 세트로 대체하지 않는다.**
  - 찾는 순서: `achive/kong-iconography/`(`svg/{name}.svg`, `icons.json`, [카탈로그](https://chuca.github.io/kong-iconography/)) → 디자인 시스템 `assets/icons/` → Kong 플러그인 문서 아이콘. `-1` 접미사는 변형본이며 기본은 접미사 없는 파일.
  - 세 곳 모두에 없을 때만 직접 그리고, 작업 보고에 "권고 세트에 없어 직접 그림 · 대상 개념"을 밝힌다.
  - 인라인 방법: 원본 `path`를 그대로 옮기고 `fill="#CCFF00"`만 `fill="currentColor"`로 바꿔 테마 색을 CSS로 준다. `viewBox="0 0 24 24"` 유지, 바로 앞에 `<!-- Kong Iconography: {name} -->` 주석을 남긴다.
  - 예외: Kong 로고 · 마크(`#kong-logo` · `#kong-mark`), 클라우드 · 파트너 로고(`ic-aws` 등), 언어 선택 국기(`#f-*`, 사용자 제공 SVG · EN = 미국/영국 · 繁 = 대만/홍콩 대각선 합성), 화살표 · 체크 · 셰브론 · 검색 돋보기 같은 UI 기호(권고 세트에 없음), 도식용 도형.
  - 커밋 전 점검: 이번 변경에 새로 들어간 `<svg>`가 위 출처 중 하나인지 확인한다.
- 새 클래스는 기존과 겹치지 않게 고유 접두사를 쓴다.

## 7. 버전 · Changelog · Release

`VERSION`(= 빌드된 `KONG_INTRO_VERSION`)과 `CHANGELOG.md`의 `## …` 섹션은 **GitHub Release와 1:1**이다.

| 시점 | `VERSION` | `CHANGELOG*.md` | git |
|---|---|---|---|
| 평소 작업 | 유지 | 건드리지 않음 | 작업 단위마다 commit |
| 사용자가 **push / Release**를 요청할 때 | 필요하면 한 번 bump | 그때 해당 버전 `##` 작성 · 정리 | push · Release |

### 버전 형식

`YYYY.MM.DD.<unix_ts_hex>` (예: `2026.11.02.c92f0e46`). 날짜는 Release 시점 로컬 날짜, 접미는 Release 준비 시각 Unix epoch **초**의 소문자 hex. 순번처럼 올리지 않는다. `VERSION` · Changelog `##` · Release 태그를 같은 문자열로 맞춘다(선행 `v` 없음).

```bash
npm run bump-version   # VERSION에 YYYY.MM.DD.<unix_hex> 기록 · 표준출력으로 출력
# 또는: bash scripts/bump-version.sh
```

### Changelog 기록 범위(콘텐츠만)

- **기록한다:** 화면에 보이는 문구 · 제목 · 시나리오 · 데모 스토리 · 다이어그램 · 비교표의 추가 · 변경 · 삭제.
- 경로 형식: **상위 메뉴 > 하위 메뉴(섹션) > 항목** (예: `API Gateway > 데모 > 시나리오 부서 인가`)
- `### 추가`는 메뉴 · 섹션 경로만 한 줄로. `### 변경` / `### 삭제`는 짧은 요지를 붙여도 된다. 쓸 내용이 있는 소제목만 둔다.
- **기록하지 않는다:** HTML/CSS/JS · 리팩터 · 아이콘 교체만의 변경, 버전 · 업데이트 확인 · 다운로드, git · Release · Drive · `.gitignore` · 규칙 파일, 셸 UI(버전 배지 · 변경 이력 모달 · 다운로드 버튼), 화면에 드러나지 않는 플러그인 설정 키.
- 프로세스 안내 문구는 Changelog 상단에 넣지 않는다(문의 · 경로 형식 안내만 유지).

### 언어

정본은 `CHANGELOG.md`(한국어). 같은 버전 · 항목을 `CHANGELOG.en.md` · `.ja.md` · `.zh-Hant.md` · `.zh-Hans.md`에 번역해 둔다. 덱 모달은 언어별 파일을 읽고 없으면 KO로 폴백한다. Release notes는 항상 `CHANGELOG.md`의 `## $V`를 쓴다.

### Release 절차(사용자 요청 시에만)

1. 필요하면 `VERSION` bump → Changelog 4개 언어 정리 → `npm run check-i18n && npm run build` → commit.
2. `main`에 push.
3. GitHub Actions **Release** 워크플로(`workflow_dispatch`)를 실행한다. 워크플로가 check · build · 산출물 commit · `gh release create "$V" kong-introduction.html`(notes = `CHANGELOG.md`의 `## $V`)을 수행한다.
4. Drive 브리지: **같은** `kong-introduction.html`을 Drive 기존 파일(ID 유지)에 덮어 올려 구버전 클라이언트가 새 HTML을 받게 한다. 구 복사본이 사라질 때까지 Apps Script(`achive/version-check.gs`) 브리지를 유지한다.

### 배포용 버전 상수

```js
const VER={
  cur:KONG_INTRO_VERSION,
  check:'https://api.github.com/repos/Great-Stone-Kong/kong-introduction/releases/latest',
  dl:'https://github.com/Great-Stone-Kong/kong-introduction/releases/latest/download/kong-introduction.html',
  changelogApi:'https://api.github.com/repos/Great-Stone-Kong/kong-introduction/contents/CHANGELOG.md',
  changelogApiZhHant:'…/CHANGELOG.zh-Hant.md',
  changelogApiZhHans:'…/CHANGELOG.zh-Hans.md'
};
```

- 버전 비교(`vcmp`)는 네 번째 세그먼트를 hex로 비교한다. Release API의 `tag_name`(선행 `v` 제거)과 비교한다.
- 다운로드 에셋 이름은 `kong-introduction.html`로 고정한다. `releases/latest`는 draft · prerelease를 무시한다.
- 사이드바 Changelog 아이콘은 GitHub Contents API로 읽을 수 있을 때만 표시된다. macOS에서 파일명 대소문자만 바꿨다면 중간 이름으로 두 번 rename 후 push한다.

## 8. 금지 사항

- 빌드 산출물(`kong-introduction.html`, `docs/index.html`)만 직접 수정하기
- `reference/` 수정
- `kong-introduction.YYYY.MM.DD.*.html`처럼 **파일 복사로 버전 관리**하기(이력은 git으로)
- 요청 없이 push · Release · Drive 업로드 · `VER` 변경
- 평소 작업에서 `VERSION` · Changelog 수정
- Cowork 시절의 Python 파트 파이프라인(`part1~4.html`, `v*.py`, `ins.py`, `hdr.py`) 사용 — 현재 구조로 대체됐다

## 9. git 커밋 · 롤백

- 의미 있는 변경은 **작업 단위가 끝날 때 별도 지시 없이 commit**한다(일반 "요청 시에만 커밋" 규칙보다 이 규칙이 우선).
- 대상: 추적 파일(`src/**`, `scripts/**`, `kong-introduction.html`, `docs/**`, `CHANGELOG*.md`, `VERSION`, `package.json`, 워크플로 · 규칙 · `.gitignore`).
- 커밋 전 `git status` / `git diff` / 최근 메시지 스타일을 확인한다. 메시지는 **영어 한 문장, 명령형**, 왜 바꿨는지 드러나게 쓴다(예: `Add behavior diagrams under AI feature overview tabs.`).
- 변경이 없거나 검토용 실험뿐이면 빈 커밋을 만들지 않는다.
- **push · Release · Drive는 자동화하지 않는다.**
- 롤백은 파일 사본이 아니라 git으로 한다: 워킹트리는 `git restore`, push 전 직전 AI 커밋은 사용자 확인 후 revert/reset, push된 커밋은 `git revert`. force push 금지. 콘텐츠 롤백이면 Changelog에 한 줄 남긴다.

## 10. 도구별 참고

### Cursor

- 진입점: `.cursor/rules/kong-introduction.mdc`(`alwaysApply: true`)가 이 파일을 참조한다. Cursor는 루트 `AGENTS.md`도 직접 읽는다.

### Claude (Claude Code · Cowork)

- 진입점: 루트 `CLAUDE.md`가 이 파일을 불러온다(`@AGENTS.md`).
- Cowork에서는 리포가 샌드박스에 마운트된다. 셸 명령(`npm`, `node`, `git`)은 마운트 경로에서 실행하고, 파일 읽기 · 쓰기는 호스트 경로(`/Users/gslee/workspaces/kong-introduction/...`)를 쓴다.
- Cowork 샌드박스에는 git 사용자 정보가 없다. 커밋할 때는 최근 커밋 작성자로 지정한다: `git -c user.name="$(git log -1 --format=%an)" -c user.email="$(git log -1 --format=%ae)" commit …`
- Cowork 샌드박스에서 파일 삭제가 막히면 삭제 권한을 요청한 뒤 진행한다.
- Cowork 미리보기는 외부 URL을 불러오지 않는다. 화면 확인용 임시 HTML은 리포 밖(작업 폴더)에 만들고 확인 후 지운다.
- 사용자 기본 언어는 한국어. 응답은 한국어로 하고, 별도 요청이 없으면 콘텐츠도 한국어 기준으로 작성한다(4장 2번의 번역 동반 규칙은 유지).
