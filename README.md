# Pixel Agents

Pixel Agents는 목적별 AI 비서를 추가하고 실행 결과를 대시보드에서 읽기 좋게 확인하는 반응형 웹 애플리케이션입니다. 현재 UI는 루트 경로(`/`) 하나를 중심으로 동작하며, 비로그인 상태에서는 픽셀 스타일 로그인 게이트가, 로그인 상태에서는 메인 대시보드가 표시됩니다.

## 프로젝트 개요

- 루트 경로(`/`)에서 로그인 게이트와 메인 대시보드 분기
- 로그인 후 픽셀 스타일 assistant OS 대시보드 표시
- 대시보드에서 비서 카드, 검색, 추가 UI 중심으로 작업
- 서버에서만 AI를 실행하고 구조화된 응답을 검증
- 뉴스/주식/국내야구/부동산 데이터는 우선 mock provider로 시작하고 나중에 실제 API로 교체 가능하게 설계

## 제품 원칙

- 데모보다 실제로 쓸 수 있는 MVP를 우선합니다.
- 모든 비서를 같은 채팅 UI로 처리하지 않습니다.
- AI 응답은 문자열이 아니라 Zod로 검증된 구조화 데이터로 렌더링합니다.
- provider, runner, API, UI를 분리해 유지보수 가능하게 만듭니다.
- 보호가 필요한 키는 클라이언트에 노출하지 않습니다.
- 주식 비서는 투자 추천이 아니라 공개 데이터 기반 정보 요약 도구로 유지합니다.

## 현재 상태

현재 저장소는 Step 07 결과 UI까지 연결된 상태입니다.

- Next.js App Router와 TypeScript는 설정되어 있습니다.
- Supabase Auth와 데이터 접근 구조, assistant CRUD API가 준비되어 있습니다.
- Supabase assistant 스키마, RLS, seed SQL이 저장소에 추가되어 있습니다.
- 루트 화면에서 로그인 게이트와 사용자 대시보드가 분기됩니다.
- 비서 템플릿 조회, 내 비서 CRUD API, 대시보드 추가/삭제 흐름이 연결되어 있습니다.
- 뉴스/주식/국내야구/부동산 mock provider와 구조화 AI runner 기반이 준비되어 있습니다.
- 실행 API와 run persistence가 연결되어 있고, 비서 상세 화면에서 결과 UI와 실행 기록을 확인할 수 있습니다.
- 상세한 구현 기준은 `AGENTS.md`와 `PRD.md`에 정리되어 있습니다.

## 주요 문서

- `AGENTS.md`: 개발 규칙, 아키텍처 원칙, 작업 방식, 완료 기준
- `PRD.md`: 제품 범위, 사용자 플로우, 데이터 구조, API 설계, 화면 요구사항, MVP 정의

## MVP 범위

### 사용자 화면

- 루트 로그인 게이트
- 로그인 후 메인 대시보드

### 초기 비서 타입

- 뉴스 비서: 주요 이슈, 중요 이유, 출처를 포함한 뉴스 브리핑 제공
- 주식 비서: 가격 변동, 관련 이슈, 관련 뉴스를 포함한 주식 브리핑 제공
- 국내야구 비서: 응원 팀 경기 흐름, 순위, 다음 경기 포인트 브리핑 제공
- 부동산 비서: 관심 지역과 주택 유형별 공개 지표 흐름 브리핑 제공

### 백엔드 기능

- Supabase Auth 기반 로그인
- Supabase Postgres 기반 비서 및 실행 기록 저장
- Route Handler 기반 비서 API
- 서버 전용 AI 실행
- 뉴스/주식/국내야구/부동산 mock provider
- Zod 기반 구조화 출력 검증
- 로그인 없이 화면 점검이 가능한 demo mode

## 현재 구현 범위

- 메인 대시보드 픽셀 UI
- 루트 로그인 게이트와 매직링크 로그인 진입
- 비서 템플릿 기반 비서 추가
- 내 비서 목록 조회와 삭제
- Supabase assistant schema, seed, RLS
- OpenAI 호환 JSON 생성 클라이언트
- 뉴스/주식/국내야구/부동산 mock provider
- 뉴스/주식/국내야구/부동산 assistant runner
- 구조화 출력 schema와 runner 테스트

## 기술 방향

### 현재 포함된 구성

- Next.js
- React
- TypeScript
- ESLint

### 제품 구현에 추가할 구성

- Tailwind CSS
- Supabase Auth / Postgres
- Zod
- OpenAI API 또는 호환 LLM provider

## 로컬 실행

의존성 설치 후 개발 서버를 실행합니다.

```bash
npm.cmd install
npm.cmd run dev
```

브라우저에서 `http://localhost:3000`을 열면 바로 메인 대시보드가 표시됩니다.
비로그인 상태에서는 로그인 게이트가 먼저 보이고, 로그인 후 같은 경로에서 대시보드가 열립니다.

PowerShell이 아닌 환경에서는 아래 명령도 사용할 수 있습니다.

```bash
npm install
npm run dev
```

## 환경변수

로그인과 데이터 연동을 모두 쓰려면 아래 값이 필요합니다.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=
NEWS_PROVIDER=mock
STOCK_PROVIDER=mock
BASEBALL_PROVIDER=mock
REAL_ESTATE_PROVIDER=mock
```

- Supabase Auth의 Redirect URL에 `http://localhost:3000/auth/callback`을 추가해야 합니다.
- 실제 배포 주소를 사용할 때는 `NEXT_PUBLIC_SITE_URL`과 Redirect URL을 함께 맞춰야 합니다.
- 환경변수가 없으면 로그인 게이트는 보이지만 실제 로그인 링크 발송은 비활성화됩니다.
- `NEXT_PUBLIC_DEMO_MODE=true`이거나 Supabase 환경변수가 비어 있으면 로그인 없이 demo dashboard와 detail 화면을 사용할 수 있습니다.
- `OPENAI_BASE_URL`은 OpenAI 호환 provider를 붙일 때만 선택적으로 사용합니다.
- MVP에서는 `NEWS_PROVIDER`, `STOCK_PROVIDER`, `BASEBALL_PROVIDER`, `REAL_ESTATE_PROVIDER`를 모두 `mock`으로 둡니다.

## Supabase 스키마 적용

Step 03 기준 스키마 파일은 아래 경로에 있습니다.

- `supabase/migrations/20260509_step_03_assistant_schema.sql`
- `supabase/migrations/20260514_step_08_expand_assistant_types.sql`
- `supabase/seed.sql`

적용 순서는 다음을 기준으로 합니다.

1. Supabase SQL Editor 또는 CLI에서 migration SQL을 먼저 실행합니다.
2. 이어서 `supabase/seed.sql`을 실행해 기본 뉴스/주식/국내야구/부동산 비서 템플릿을 넣습니다.
3. `assistant_templates`, `user_assistants`, `assistant_runs`, `assistant_sources` 테이블과 RLS 정책이 생성됐는지 확인합니다.

현재 migration에는 다음이 포함되어 있습니다.

- assistant template, user assistant, assistant run, assistant source 테이블
- `updated_at` 자동 갱신 trigger
- 주요 조회용 인덱스
- 사용자 소유 데이터용 RLS policy
- 인증 사용자용 활성 템플릿 조회 policy

주의:

- Step 04 CRUD 화면과 API는 위 migration/seed가 실제 Supabase 프로젝트에 적용되어 있어야 정상 동작합니다.

## 가까운 구현 순서

1. 프로젝트 세팅과 루트 대시보드 구조 정리
2. Supabase 인증 연결
3. 데이터베이스 스키마와 seed 데이터 구성
4. 비서 CRUD 흐름 구현
5. AI runner와 mock provider 구현
6. 비서 실행 API 구현
7. 비서별 결과 UI 구현
8. 반응형 마감, 문서화, 검증 정리

## 메모

- 이 프로젝트는 범용 채팅앱이 아니라 목적형 AI 비서 대시보드를 목표로 합니다.
- 현재 메인 사용자 흐름은 `/` 한 화면 안에서 로그인 게이트와 대시보드가 전환되는 구조입니다.
- 비서 실행 결과는 구조화되고 검증 가능하며 저장 가능한 형태여야 합니다.
- 구현 방향이 바뀌면 `README.md`, `AGENTS.md`, `PRD.md`를 함께 맞춰서 관리합니다.
