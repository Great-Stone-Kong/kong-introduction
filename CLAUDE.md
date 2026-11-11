# CLAUDE.md

이 리포의 작업 규칙 정본은 [`AGENTS.md`](AGENTS.md)다. Cursor와 같은 규칙을 쓴다.
작업 전에 반드시 읽고 따른다. 규칙 변경은 `AGENTS.md`에만 한다.

@AGENTS.md

## 빠른 요약

- 편집 소스: `src/deck.html` + `src/i18n/` (산출물 `kong-introduction.html` · `docs/index.html` · `dist/*.html`은 직접 수정 금지)
- 새 한글 문구 → `src/i18n/messages/{ko,en,ja,zh-Hans,zh-Hant}.json`에 같은 id로 추가(인라인 태그 포함 문장은 `units.json`)
- 검증 · 빌드: `npm run check-i18n && npm run build` (멀티 + `dist/` 언어 고정 HTML)
- 글이 많은 섹션 시각화: `Korean Docs of Kong Design System [v1.3]/guides/visual-elements.md`(E1–E16 카탈로그 · 도식 점검 목록)
- 애니메이션 · 연출: `Korean Docs of Kong Design System [v1.3]/guides/motion.md`(M1–M20 용어별 권장 · 조건부 · 비권장)
- 아이콘: `achive/kong-iconography/svg/{name}.svg`(회사 권고 세트)를 먼저 쓴다. 직접 그리기 · 외부 세트 금지(없을 때만 직접 그리고 보고에 명시)
- 제목 · 목차는 명사형(구어체 · 대화체 금지)
- 작업 단위 종료 시 자동 commit(영어 한 문장). push · Release · `VERSION` · Changelog는 요청 시에만
