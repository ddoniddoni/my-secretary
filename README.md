# My SECRETARY

My SECRETARY는 저장형 AI 비서를 위한 실전 지향 Next.js MVP입니다.
일반적인 채팅 앱 대신 뉴스, 주식, KBO 야구, 부동산 신호처럼 목적이 분명한 비서를 저장해 두고,
반응형 대시보드에서 구조화된 결과를 읽기 쉽게 확인할 수 있도록 설계되었습니다.

## 주요 기능

- 사용자 소유 비서 레코드를 관리하는 인증 기반 대시보드
- 뉴스, 주식, 야구, 부동산 템플릿 기반 비서 생성 흐름
- 비서 설정 요약, 실행 버튼, 최신 결과 패널, 실행 기록을 포함한 상세 페이지
- Route Handler와 비서 runner를 통한 서버 사이드 AI 실행
- 비서 타입별 Zod 기반 구조화 응답 검증
- Supabase 자격 증명이 없어도 UI를 확인할 수 있는 데모 모드

## 핵심 기술 스택

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase Auth / Postgres
- Zod
- Vitest

## 로컬 개발

의존성을 설치한 뒤 개발 서버를 실행합니다.

```bash
npm.cmd install
npm.cmd run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

- Supabase가 설정되어 있으면 로그인 이후 루트 경로가 사용자 대시보드로 동작합니다.
- Supabase가 없고 `NEXT_PUBLIC_DEMO_MODE=true`이면 로그인 없이 데모 대시보드와 비서 상세 페이지를 확인할 수 있습니다.
- Supabase가 없고 데모 모드도 꺼져 있으면 루트 경로는 게스트 진입 화면으로 유지됩니다.

macOS 또는 Linux에서는 아래 명령을 사용합니다.

```bash
npm install
npm run dev
```

## 환경 변수

`.env.example`을 `.env.local`로 복사한 뒤 필요한 값을 채워 넣습니다.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=
NEWS_PROVIDER=mock
NEWSAPI_API_KEY=
STOCK_PROVIDER=mock
ALPHA_VANTAGE_API_KEY=
BASEBALL_PROVIDER=mock
REAL_ESTATE_PROVIDER=mock
```

메모:

- `NEXT_PUBLIC_DEMO_MODE=true`를 사용하면 Supabase 연결 전에도 앱을 바로 확인할 수 있습니다.
- `OPENAI_BASE_URL`은 선택 사항이며 OpenAI 호환 provider를 사용할 때만 필요합니다.
- 기본값은 모든 provider가 `mock`입니다.
- `NEWS_PROVIDER=newsapi`를 사용하면 `NEWSAPI_API_KEY`가 필요합니다.
- `STOCK_PROVIDER=alphavantage`를 사용하면 `ALPHA_VANTAGE_API_KEY`가 필요합니다.
- 현재 야구와 부동산 provider는 `mock`만 지원합니다.
- Supabase Auth 리다이렉트 URL에는 `http://localhost:3000/auth/callback`을 포함해야 합니다.

## Supabase 스키마 적용 방법

아래 SQL 파일을 순서대로 적용합니다.

1. `supabase/migrations/20260509_step_03_assistant_schema.sql`
2. `supabase/migrations/20260514_step_08_expand_assistant_types.sql`
3. `supabase/seed.sql`

포함되는 항목은 다음과 같습니다.

- `assistant_templates`
- `user_assistants`
- `assistant_runs`
- `assistant_sources`
- 사용자 소유 데이터용 RLS 정책
- timestamp 갱신 트리거와 기본 인덱스

## AI 비서 실행 구조

각 비서는 아래 조합으로 정의됩니다.

```txt
assistant_template
+ user_assistant.config
+ assistant_runner
+ provider_data
+ structured_output_schema
+ result_component
```

실행 흐름은 다음과 같습니다.

```txt
saved assistant config
-> provider fetch
-> assistant runner
-> OpenAI or compatible LLM call
-> Zod validation
-> assistant_runs persistence
-> assistant-specific result UI
```

중요한 가드레일:

- AI 실행은 서버에서만 일어납니다.
- 클라이언트 코드는 보호된 API 키를 import하지 않습니다.
- 구조화 응답은 schema validation을 통과한 뒤에만 렌더링됩니다.
- 주식 비서는 정보 요약 용도로만 동작하며 항상 투자 조언 아님 문구를 포함합니다.

## Provider 구성

기본 실행은 모든 비서 타입에서 `mock` provider로 시작합니다.

- `src/lib/providers/news.ts`
- `src/lib/providers/stock.ts`
- `src/lib/providers/baseball.ts`
- `src/lib/providers/real-estate.ts`

현재 지원 상태는 다음과 같습니다.

- `news`: `mock`, `newsapi`
- `stock`: `mock`, `alphavantage`
- `baseball`: `mock`
- `real_estate`: `mock`

이 구조 덕분에 runner 아키텍처는 그대로 유지하면서도, 실제 API로 교체하거나 추가할 때 UI 변경을 최소화할 수 있습니다.

## MVP 범위

현재 MVP에 포함된 범위는 다음과 같습니다.

- 게스트 진입 화면과 데모 모드 대시보드 진입
- Supabase 매직 링크 로그인 흐름
- 비서 템플릿 조회
- 사용자 비서 CRUD
- 비서 실행 기록 저장
- 뉴스 결과 카드
- 주식 결과 카드
- 야구 결과 카드
- 부동산 결과 카드
- 실행 기록과 최신 결과 렌더링

## 검증

step 브랜치를 머지하기 전 아래 검증을 실행합니다.

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
```

## 저장소 구조

```txt
src/
  app/
  components/
  lib/
  types/
  mocks/
tests/
docs/
supabase/
```

상위 레벨 역할은 다음과 같습니다.

- `src/app`: App Router 페이지와 API Route Handler
- `src/components`: 대시보드, 비서, 레이아웃, 공용 UI 컴포넌트
- `src/lib/assistants`: 비서 설정, 대시보드 헬퍼, runner, 실행, repository 로직
- `src/lib/providers`: mock 및 선택적 실데이터 provider 구현
- `src/lib/supabase`: 인증, 서버 클라이언트, 매핑 헬퍼
- `tests`: 설정 검증, runner, schema, route, 대시보드 헬퍼에 대한 단위 테스트

## 향후 확장

- mock provider를 실제 뉴스, 시세, 스포츠, 부동산 데이터로 교체
- 비서 실행 기록에 페이지네이션과 더 풍부한 타임라인 제어 추가
- 새로운 비서 타입을 추가하되 다시 범용 채팅 UI로 되돌아가지 않기
- 배포, 분석, 제품 소개 카피를 포함한 포트폴리오 완성도 강화
