# 부트스트랩 Step 01 프로젝트 초기 세팅

## 요약

이 step은 기본 스타터 앱 셸을 제품 형태의 기반으로 교체해 MVP 전달 준비를 마무리합니다. 결과적으로 Step 02 인증과 Step 04 대시보드 작업을 다시 레이아웃부터 뜯어고치지 않고 자연스럽게 이어갈 수 있어야 합니다.

## 브랜치 계획

- 최신 `develop`에서 시작
- 브랜치 생성: `step/01-project-bootstrap`
- 이 step은 프로젝트 구조, 스타일 기반, 랜딩 페이지에 집중
- `step/02-auth`를 시작하기 전에 이 브랜치를 `develop`으로 머지

## 커밋 정책

`AGENTS.md`의 Conventional Commits 규칙을 사용합니다.

이 step에서 권장하는 커밋 예시:

- `docs(planning): add step 01 bootstrap plan`
- `chore(repo): add project bootstrap structure`
- `feat(landing): build product landing page`
- `style(ui): refine shared design tokens`

## 예정 작업

- `docs/execplans/step-01-project-bootstrap.md` 작성
- `docs/steps` 아래에 이 부트스트랩 문서 작성
- `src` 아래 기본 디렉터리 구조 추가
- 공개 페이지용 기본 레이아웃 방향 수립
- 스타터 랜딩 콘텐츠를 PRD에 맞는 메시지로 교체
- 이후 대시보드에서도 재사용할 공용 UI 패턴 준비
- 현재 빠져 있는 검증 스크립트 추가

## 작업 메모

- 이 step에서는 auth, Supabase, 비서 CRUD, AI runner 로직을 건드리지 않습니다.
- 페이지 전용 래퍼보다 재사용 가능한 레이아웃 프리미티브를 우선합니다.
- 공개 랜딩 페이지는 완성도 있게 다듬되, 실제 동작하지 않는 가짜 기능은 만들지 않습니다.
- 구현 선택지가 애매하면 다음 step의 재작업을 줄이는 쪽을 우선합니다.

## 종료 기준

- 저장소가 더 이상 기본 Next.js 스타터처럼 보이지 않습니다.
- 랜딩 페이지가 My SECRETARY 제품을 명확하게 설명합니다.
- 이후 대시보드 화면에 쓸 공용 스타일 기반이 준비되어 있습니다.
- `lint`와 `typecheck`를 실행할 수 있고 통과하거나, 막히는 이유가 문서로 명확히 남아 있습니다.
- 브랜치가 깔끔하게 리뷰 및 `develop` 머지가 가능한 상태입니다.

## 다음 Step

이 step이 머지되면 Supabase 인증, 로그인 흐름, 미들웨어 보호, 대시보드 접근 제어를 위해 `step/02-auth`로 진행합니다.
