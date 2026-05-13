# 부트스트랩 Step 03 DB 스키마

## 요약

이 step은 인증된 앱 셸 뒤에 실제 영속 데이터 모델을 추가합니다. 이후 비서 CRUD와 실행 API가 재사용할 수 있도록, 명확한 소유권 경계를 가진 안정적인 Supabase 스키마를 만드는 것이 목표입니다.

## 브랜치 계획

- 최신 `develop`에서 시작
- 브랜치 생성: `step/03-db-schema`
- 이 step은 스키마, RLS, 시드 데이터, 보조 도메인 타입에 집중
- `step/04-assistant-crud`를 시작하기 전에 이 브랜치를 `develop`으로 머지

## 커밋 정책

`AGENTS.md`의 Conventional Commits 규칙을 사용합니다.

이 step에서 권장하는 커밋 예시:

- `docs(planning): add step 03 db schema plan`
- `feat(db): add assistant schema and rls policies`
- `feat(types): add assistant domain models and mappers`
- `docs(readme): document supabase schema setup`

## 예정 작업

- `docs/execplans/step-03-db-schema.md` 작성
- `docs/steps` 아래에 이 부트스트랩 문서 작성
- 비서 테이블과 보조 트리거를 위한 Supabase migration SQL 추가
- `user_assistants`, `assistant_runs`, `assistant_sources`용 RLS 정책 추가
- 기본 비서 템플릿용 seed SQL 추가
- 공용 비서 타입 확장
- DB row 매핑 헬퍼 추가
- README에 스키마 적용 방법 반영

## 작업 메모

- 템플릿 row는 모든 사용자가 재사용할 수 있게 유지합니다.
- SQL은 snake_case, TypeScript 모델은 camelCase를 사용합니다.
- 가능하면 seed는 반복 적용에도 안전한 형태를 우선합니다.
- 이 step에 비서 CRUD 로직을 섞지 않습니다.

## 종료 기준

- 저장소에 비서 도메인을 위한 재현 가능한 SQL 스키마가 존재합니다.
- 모든 사용자 소유 테이블에서 RLS가 활성화되고 소유자 기반 접근 규칙이 적용됩니다.
- 기본 뉴스/주식 템플릿용 seed 데이터가 존재합니다.
- 공용 타입이 Step 04 CRUD와 Step 06 실행 기록 저장을 받을 준비가 되어 있습니다.
- `lint`, `typecheck`, `test`가 통과하거나, 막히는 이유가 문서로 명확히 남아 있습니다.

## 다음 Step

이 step이 머지되면 템플릿 조회, 사용자 비서 CRUD 라우트, 대시보드 목록 UI를 위해 `step/04-assistant-crud`로 진행합니다.
