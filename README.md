# My SECRETARY

My SECRETARY는 저장형 인공지능 비서를 위한 Next.js + Supabase 기반 웹 애플리케이션입니다.
단순한 채팅창이 아니라, 목적별 비서를 저장하고 실행하고 결과를 읽기 좋은 카드 UI로 확인하는 것을 목표로 합니다.

## 핵심 개요

- 로그인 후 나만의 비서를 추가하고 관리할 수 있습니다.
- 뉴스, 주식, 야구, 부동산처럼 목적이 분명한 비서를 지원합니다.
- 비서 실행 결과는 채팅 로그가 아니라 구조화된 결과 카드로 렌더링합니다.
- AI 요청은 클라이언트가 아니라 서버 Route Handler와 runner에서만 처리합니다.
- AI 출력은 Zod schema로 검증한 뒤에만 화면과 DB에 반영합니다.
- Supabase Auth와 Postgres를 통해 사용자 소유 데이터를 안전하게 저장합니다.
- 개발 초기에는 mock provider로 동작하고, 필요하면 실제 데이터 provider로 교체할 수 있습니다.

## 제품이 어떻게 동작하는가

이 앱은 "사용자 설정 + 외부 데이터 + 서버 측 LLM + 구조화된 출력" 조합으로 동작합니다.

```txt
사용자 설정
→ provider가 원자료 수집
→ runner가 prompt 구성
→ OpenAI 호환 API 호출
→ Zod schema 검증
→ assistant_runs 저장
→ 비서 타입별 결과 UI 렌더링
```

예를 들면 News AI는 다음 순서로 실행됩니다.

1. 사용자가 News 비서의 카테고리, 언어, 최대 항목 수를 설정합니다.
2. 서버가 news provider에서 뉴스 원자료를 가져옵니다.
3. runner가 그 데이터를 system prompt와 함께 OpenAI 호환 API로 보냅니다.
4. 모델은 정해진 JSON schema에 맞는 구조화 응답을 반환합니다.
5. 서버가 응답을 Zod로 검증합니다.
6. 검증에 통과한 결과만 저장하고 화면에 표시합니다.

즉, ChatGPT가 뉴스를 "직접 찾는" 구조가 아니라,
우리 서버가 데이터를 모은 뒤 ChatGPT/OpenAI 호환 모델이 그 데이터를 읽기 좋게 정리하는 구조입니다.

## 주요 기능

- 랜딩 페이지
- 로그인 페이지
- 보호된 대시보드
- 비서 추가 및 삭제
- 비서 상세 설정 편집
- 비서 실행 버튼
- 최근 실행 결과 카드
- 실행 기록 목록
- 뉴스 결과 카드
- 주식 결과 카드
- 야구 결과 카드
- 부동산 결과 카드
- 데모 모드
- 반응형 레이아웃

## 기술 스택

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase Auth
- Supabase Postgres
- Zod
- Vitest

## 로컬 실행 방법

```bash
npm.cmd install
npm.cmd run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

macOS 또는 Linux 환경이라면 아래 명령도 사용할 수 있습니다.

```bash
npm install
npm run dev
```

## 실행 모드

### 1. Supabase 연결 모드

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

위 값이 설정되어 있으면 로그인 후 실제 사용자 대시보드로 동작합니다.

### 2. 데모 모드

- `NEXT_PUBLIC_DEMO_MODE=true`

Supabase 연결이 없어도 로그인 없이 대시보드와 비서 상세 화면을 확인할 수 있습니다.

### 3. 게스트 화면

Supabase가 없고 데모 모드도 꺼져 있으면, 루트 경로는 소개용 게스트 화면으로 열립니다.

## 환경변수

`.env.example`을 `.env.local`로 복사한 뒤 필요한 값을 채워주세요.

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
MOLIT_API_KEY=
```

### 환경변수 설명

- `NEXT_PUBLIC_DEMO_MODE=true`
  - Supabase 없이도 데모 데이터를 볼 수 있게 합니다.
- `OPENAI_API_KEY`
  - 서버에서 OpenAI 또는 호환 LLM API를 호출할 때 사용합니다.
- `OPENAI_MODEL`
  - 사용할 모델 이름입니다.
- `OPENAI_BASE_URL`
  - OpenAI 호환 provider를 붙일 때만 필요합니다.
- `NEWS_PROVIDER`
  - `mock` 또는 `newsapi`
- `STOCK_PROVIDER`
  - `mock` 또는 `alphavantage`
- `BASEBALL_PROVIDER`
  - `mock` 또는 `kbo`
- `REAL_ESTATE_PROVIDER`
  - `mock` 또는 `molit`

## AI 실행 구조

AI는 클라이언트에서 직접 호출하지 않습니다.
반드시 서버 전용 모듈과 Route Handler를 통해 실행합니다.

```txt
assistant_template
user_assistant.config
provider_data
assistant_runner
structured_output_schema
result_component
```

### 내부 흐름

1. 사용자가 비서 실행 버튼을 누릅니다.
2. `app/api/assistants/[assistantId]/run/route.ts`가 요청을 받습니다.
3. `executeAssistantRun`이 소유권과 템플릿을 확인합니다.
4. `runner`가 해당 비서 타입에 맞는 provider를 호출합니다.
5. `generateStructured`가 OpenAI 호환 API에 JSON 전용 응답을 요청합니다.
6. 응답은 Zod schema로 검증됩니다.
7. 성공 결과는 `assistant_runs`와 `assistant_sources`에 저장됩니다.
8. 비서 타입별 결과 UI가 화면에 렌더링됩니다.

## provider 설명

기본 실행은 모두 `mock` provider로 시작합니다.
이 구조는 실제 API가 없어도 앱 전체 흐름을 확인할 수 있게 해줍니다.

- `src/lib/providers/news.ts`
- `src/lib/providers/stock.ts`
- `src/lib/providers/baseball.ts`
- `src/lib/providers/real-estate.ts`

지원 조합은 다음과 같습니다.

- 뉴스: `mock`, `newsapi`
- 주식: `mock`, `alphavantage`
- 야구: `mock`, `kbo`
- 부동산: `mock`, `molit`

### provider와 LLM의 역할 분리

- provider는 원자료를 가져옵니다.
- LLM은 그 원자료를 읽기 쉬운 구조화 출력으로 정리합니다.
- runner는 두 역할을 이어주는 오케스트레이터입니다.

이렇게 분리하면 실제 API provider로 바꿔도 UI와 runner 구조를 크게 바꾸지 않아도 됩니다.

## Supabase 스키마 적용 방법

아래 SQL 파일을 순서대로 적용합니다.

1. `supabase/migrations/20260509_step_03_assistant_schema.sql`
2. `supabase/migrations/20260514_step_08_expand_assistant_types.sql`
3. `supabase/seed.sql`

포함되는 주요 테이블과 정책은 다음과 같습니다.

- `assistant_templates`
- `user_assistants`
- `assistant_runs`
- `assistant_sources`
- 사용자 소유 데이터에 대한 RLS 정책

## 화면 구성

### 랜딩

- 제품 소개
- 도트형 AI 비서 브랜딩
- 뉴스/주식/야구/부동산 비서 미리보기
- 로그인 CTA

### 대시보드

- 내 AI 비서 목록
- 비서 추가 모달
- 카드 그리드
- 최근 실행 상태
- 빈 상태 / 로딩 상태 / 에러 상태

### 비서 상세

- 비서 설정 요약
- 실행 버튼
- 최근 실행 결과
- 실행 기록 목록
- 비서 타입별 전용 결과 UI

## 테스트 및 검증

변경 후에는 아래 명령으로 검증합니다.

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
```

macOS 또는 Linux 환경이라면 `npm run`으로 실행하면 됩니다.

## 디렉터리 개요

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

- `src/app`: App Router 페이지와 API Route Handler
- `src/components`: 레이아웃, 비서 카드, 모달, 결과 UI
- `src/lib/assistants`: runner, 실행, repository, helper
- `src/lib/ai`: OpenAI 호환 JSON 클라이언트와 structured helper
- `src/lib/providers`: mock 및 실데이터 provider
- `src/lib/supabase`: Supabase 클라이언트와 인증 유틸리티
- `tests`: runner, schema, route, dashboard helper 테스트

## 앞으로 확장할 수 있는 방향

- mock provider를 실제 뉴스/주식/야구/부동산 데이터로 교체
- 비서 타입 추가
- 실행 기록 필터와 검색 강화
- 실행 결과 UI 고도화
- provider 캐싱과 재시도 전략 추가
- 이미지나 스크린샷 기반 문서화 보강

## 화면 캡처에 대해

이 환경에서는 실시간 브라우저 화면을 직접 캡처하는 도구가 따로 없어서, 지금은 README와 코드 기준으로 문서를 정리했습니다.
원하시면 다음 단계에서 실제 브라우저 스크린샷을 추가하는 방식으로도 문서를 보강할 수 있습니다.
