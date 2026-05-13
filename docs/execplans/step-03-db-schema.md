# Step 03 DB 스키마

## 목표

인증된 사용자가 비서를 소유하고, 비서 실행 기록을 저장하며, RLS가 적용된 테이블을 통해 자신의 데이터만 안전하게 조회할 수 있도록 My SECRETARY의 Supabase 데이터베이스 기반을 구축합니다.

## 가정

- Step 02 인증은 이미 `develop`에 머지되어 있고, 이 작업은 새 `step/03-db-schema` 브랜치에서 시작합니다.
- 사용자 식별 기준은 이미 Supabase Auth이므로, 사용자 소유 row는 모두 `auth.users(id)`를 참조할 수 있습니다.
- 현재 MVP 데이터 소스는 mock 기반이므로, provider 전용 테이블 없이도 비서 설정, 실행 결과, source 메타데이터를 담을 수 있어야 합니다.
- 이 저장소에 Supabase CLI가 아직 초기화되지 않았더라도 SQL 파일은 Supabase SQL Editor에서 그대로 사용할 수 있어야 합니다.

## 범위

- 핵심 비서 테이블용 SQL migration 파일을 추가합니다.
- 모든 사용자 소유 테이블에 RLS 정책을 추가합니다.
- 초기 뉴스/주식 비서 템플릿용 seed SQL을 추가합니다.
- 이후 CRUD와 실행 조회를 지원할 인덱스 및 timestamp 갱신 헬퍼를 추가합니다.
- Step 03 스키마에 맞춰 공용 TypeScript 도메인 타입을 확장합니다.
- 이후 API 작업에 사용할 가벼운 row-to-domain 매퍼를 추가합니다.
- 로컬 또는 Supabase에서 스키마와 seed를 적용하는 방법을 문서화합니다.

## 범위 제외

- 비서 CRUD API route
- 대시보드의 DB 기반 데이터 조회
- AI runner 구현
- provider 연동
- service-role 전용 관리자 워크플로

## 구현 단계

1. Step 03 기획 문서와 스키마 경계를 정의합니다.
2. 템플릿, 사용자 비서, 실행 기록, source를 포괄하는 비서 도메인 타입을 확장합니다.
3. 아래 항목을 생성하는 Supabase migration을 추가합니다.
   - `assistant_templates`
   - `user_assistants`
   - `assistant_runs`
   - `assistant_sources`
   - updated-at trigger helper
   - 유용한 인덱스
4. RLS를 활성화하고 사용자 소유 테이블에 소유자 기반 정책을 추가합니다.
5. 기본 뉴스/주식 템플릿용 seed SQL을 추가합니다.
6. 이후 Route Handler에서 일관되게 camelCase 도메인 객체로 변환할 수 있도록 매핑 헬퍼를 추가합니다.
7. README에 스키마 적용 단계와 현재 프로젝트 상태를 반영합니다.
8. lint, typecheck, test를 실행합니다.

## 리스크

- seed row가 멱등적이지 않으면 공유 환경에서 재적용 시 중복이 생길 수 있습니다.
- 지금 RLS가 불완전하면 Step 04 CRUD는 로컬에서만 동작하고 실제 Supabase 환경에서는 실패할 수 있습니다.
- 현재 mock provider에 너무 맞춘 스키마는 이후 실제 provider 연동을 불편하게 만들 수 있습니다.

## 검증

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- SQL 수동 검토:
  - foreign key
  - RLS 활성화 여부
  - owner check
  - assistant type / run status 제약

## 결과물

- `docs/execplans/step-03-db-schema.md`
- `docs/steps/bootstrap-step-03-db-schema.md`
- 스키마와 RLS를 위한 Supabase migration SQL
- 기본 템플릿용 `supabase/seed.sql`
- 업데이트된 TypeScript 도메인 타입과 매퍼
- 스키마 적용 방법을 담은 README 메모
