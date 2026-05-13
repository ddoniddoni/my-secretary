# 부트스트랩 Step 04 비서 CRUD

## 요약

이 step에서 제품이 처음으로 실제 서비스처럼 느껴지기 시작합니다. 사용자는 seed된 비서 템플릿을 바탕으로 자신만의 대시보드 비서를 만들고 관리할 수 있으며, 루트 경로는 픽셀 OS 셸과 `/` 로그인 게이트를 포함한 단일 대시보드 흐름으로 정리됩니다.

## 브랜치 계획

- 최신 `develop`에서 시작
- 브랜치 생성: `step/04-assistant-crud`
- 이 step은 템플릿, 사용자 비서, CRUD API, 대시보드 중심 UI에 집중
- `step/05-ai-runner`를 시작하기 전에 이 브랜치를 `develop`으로 머지

## 커밋 정책

`AGENTS.md`의 Conventional Commits 규칙을 사용합니다.

이 step에서 권장하는 커밋 예시:

- `docs(planning): add step 04 assistant crud plan`
- `feat(assistants): add assistant crud api routes`
- `feat(dashboard): build assistant list and create flow`
- `feat(dashboard): redesign root dashboard shell`
- `feat(auth): restore root login gate`
- `test(assistants): cover config validation`

## 예정 작업

- `docs/execplans/step-04-assistant-crud.md` 작성
- `docs/steps` 아래에 이 부트스트랩 문서 작성
- 비서 설정 검증 헬퍼 추가
- 템플릿/사용자 비서용 Supabase repository 함수 추가
- 비서 CRUD Route Handler 구현
- 대시보드 골격을 실제 비서 관리 UI로 교체
- 루트 대시보드를 메인 화면으로 재설계
- 로그인 후 대시보드로 전환되는 루트 로그인 게이트 추가
- payload 정규화 및 검증 테스트 추가

## 작업 메모

- API 응답은 `AGENTS.md`의 `{ data: ... }` / `{ error: ... }` 형태를 유지합니다.
- RLS가 있어도 서버에서 한 번 더 소유권을 검증합니다.
- 모달 인프라를 과하게 만들기보다 단순하고 안정적인 UI를 우선합니다.
- 인증된 앱의 핵심 UI 정체성으로 픽셀 OS 셸을 유지합니다.
- 생성/수정 흐름은 공용 config 헬퍼를 우선 재사용합니다.
- 사용자는 `/` 하나의 진입점만 따라가도록 라우팅합니다.

## 종료 기준

- API를 통해 템플릿을 조회할 수 있습니다.
- 인증된 사용자가 자신의 비서를 생성, 조회, 수정, 삭제할 수 있습니다.
- 루트 대시보드에 loading, error, empty, guest, signed-in 상태가 모두 존재합니다.
- 비로그인 사용자는 OS 헤더 아래 로그인 게이트를 보고 매직 링크를 요청할 수 있습니다.
- 로그인한 사용자는 같은 루트 경로에서 개인 비서 대시보드를 봅니다.
- `lint`, `typecheck`, `test`가 통과하거나, 막히는 이유가 문서로 명확히 남아 있습니다.

## 다음 Step

이 step이 머지되면 구조화된 AI 생성, mock provider, 비서 runner 오케스트레이션, 실제 실행 결과 연결을 위해 `step/05-ai-runner`로 진행합니다.
