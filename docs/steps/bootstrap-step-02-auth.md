# 부트스트랩 Step 02 인증

## 요약

이 step은 Step 01에서 만든 골격을 사용자 인지형 앱 셸로 바꿉니다. 핵심 결과물은 이후 step에서 RLS 기반 비서 데이터와 실행 API가 재사용할 수 있는 안정적인 Supabase SSR 인증 기반입니다.

## 브랜치 계획

- 최신 `develop`에서 시작
- 브랜치 생성: `step/02-auth`
- 이 step은 인증 흐름, 세션 복원, 보호 라우트에 집중
- `step/03-db-schema`를 시작하기 전에 이 브랜치를 `develop`으로 머지

## 커밋 정책

`AGENTS.md`의 Conventional Commits 규칙을 사용합니다.

이 step에서 권장하는 커밋 예시:

- `docs(planning): add step 02 auth plan`
- `feat(auth): add supabase ssr auth foundation`
- `feat(auth): implement login and logout flow`
- `test(auth): add auth helper coverage`
- `docs(readme): document supabase auth setup`

## 예정 작업

- `docs/execplans/step-02-auth.md` 작성
- `docs/steps` 아래에 이 부트스트랩 문서 작성
- Supabase SSR 의존성 설치
- browser/server/proxy Supabase 헬퍼 추가
- `/login`과 `/auth/callback` 구현
- 대시보드와 비서 상세 라우트 보호
- 로그인 상태 헤더와 로그아웃 제어 추가
- 환경 변수와 로컬 인증 설정 방법 문서화

## 작업 메모

- 첫 완성형 인증 흐름은 이메일 매직 링크를 우선합니다.
- 가능하면 라우트 보호 로직을 UI 컴포넌트 밖에 둡니다.
- 이 step에서는 service role 사용이나 데이터베이스 쓰기를 넣지 않습니다.
- 환경 변수 부족으로 로컬 실행이 어려우면 조용히 실패시키지 말고 UI와 문서에서 분명히 드러냅니다.

## 종료 기준

- 사용자가 `/login`에서 매직 링크를 요청할 수 있습니다.
- 콜백 라우트가 인증 코드를 세션으로 교환할 수 있습니다.
- `/dashboard`와 `/assistants/[assistantId]`가 보호됩니다.
- 헤더가 로그인 여부를 반영하고 로그아웃을 지원합니다.
- `lint`, `typecheck`, `test`가 통과하거나, 막히는 이유가 문서로 명확히 남아 있습니다.

## 다음 Step

이 step이 머지되면 비서 테이블, RLS, 시드 데이터, 사용자 소유 데이터 모델링을 위해 `step/03-db-schema`로 진행합니다.
