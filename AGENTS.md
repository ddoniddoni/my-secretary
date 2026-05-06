# AGENTS.md

## 프로젝트 목표

이 저장소의 목표는 **My SECRETARY**라는 웹 애플리케이션을 만드는 것입니다.

Pixel Agents는 사용자가 로그인 후 목적별 AI 비서를 추가하고, 각 비서가 뉴스·주식 같은 정보를 정리해주는 반응형 AI 비서 대시보드입니다.

이 프로젝트는 단순한 AI 채팅앱이 아니라, 다음 네 가지 핵심 영역으로 구성됩니다.

- **Landing**
  - 제품 소개
  - 도트형 AI 비서 브랜딩
  - 뉴스/주식 비서 미리보기
  - 로그인 CTA

- **Dashboard**
  - 내 AI 비서 목록
  - 비서 추가 모달
  - 비서 카드 그리드
  - 최근 실행 상태
  - 빈 상태 / 로딩 상태 / 에러 상태

- **Assistant Detail**
  - 비서 설정 요약
  - 비서 실행 버튼
  - 최근 실행 결과
  - 실행 기록 목록
  - 비서 타입별 전용 결과 UI

- **Assistant API**
  - 서버 사이드 AI 실행
  - mock provider 기반 뉴스/주식 데이터 수집
  - OpenAI API 또는 호환 LLM provider 호출
  - Zod schema 기반 구조화 응답 검증
  - Supabase 실행 기록 저장

핵심 목표는 사용자가 자주 쓰는 정보 정리 작업을 목적별 AI 비서로 저장하고, 채팅창이 아닌 읽기 좋은 결과 UI로 확인할 수 있는 유지보수 가능한 Next.js 앱을 만드는 것입니다.

---

## 제품 원칙

- 화려한 데모보다 **실제로 사용할 수 있는 흐름**을 우선합니다.
- 단순 채팅 UI를 반복하지 말고, **비서 타입별 결과 UI**를 구현합니다.
- AI 응답을 그대로 문자열로 뿌리지 말고, **Zod schema로 검증된 JSON**을 렌더링합니다.
- 화면마다 일회성 구현을 하지 말고, **UI와 도메인 모듈을 재사용 가능하게 설계**합니다.
- AI API key, Supabase secret key 등 보호가 필요한 값은 절대 클라이언트에 노출하지 않습니다.
- 초기 버전은 복잡한 자율 에이전트가 아니라, **템플릿 + 설정 + runner + provider + 구조화 응답** 방식의 안정적인 AI 비서 시스템으로 유지합니다.
- 주식 비서는 투자 추천 서비스가 아니라 **공개 데이터 기반 정보 요약 도구**로 유지합니다.
- 별도 요청이 없다면 이 제품과 무관한 도메인이나 과한 기능을 추가하지 않습니다.

---

## 기본 기술 방향

- 프로젝트를 처음부터 구성한다면 **Next.js App Router + TypeScript**를 사용합니다.
- UI는 **React + Tailwind CSS**를 기본으로 합니다.
- 필요한 경우 shadcn/ui와 lucide-react를 사용할 수 있습니다.
- 데이터 저장과 인증은 **Supabase Auth + Supabase Postgres**를 사용합니다.
- AI 호출은 **Next.js Route Handler 내부에서만** 수행합니다.
- AI 응답 검증은 **Zod**를 사용합니다.
- 패키지 매니저가 정해져 있지 않다면 **npm**을 우선합니다.
- PowerShell 환경에서 스크립트 실행 이슈가 있으면 `npm` 대신 `npm.cmd`를 사용합니다.
- 이미 lockfile이 있다면 기존 패키지 매니저를 따릅니다.
- 특별한 이유 없이 여러 UI 시스템을 섞지 않습니다.

---

## 핵심 도메인

제품은 아래 엔티티를 중심으로 모델링합니다.

- user
- assistant template
- user assistant
- assistant run
- assistant source
- assistant config
- news provider result
- stock provider result
- structured AI output

---

## 필수 화면 및 기능

### 사용자 영역

- 랜딩 페이지
- 로그인 페이지
- 보호된 대시보드
- 비서 상세 페이지
- 프로필/로그아웃 영역

### 핵심 기능

- Supabase 인증
- 사용자별 비서 목록 조회
- 비서 템플릿 조회
- 뉴스 비서 추가
- 주식 비서 추가
- 비서 설정 저장
- 비서 삭제
- 비서 실행
- 실행 기록 저장
- 뉴스 결과 카드 UI
- 주식 결과 카드 UI
- 도트형 비서 아바타
- 반응형 레이아웃

---

## 권장 디렉터리 구조

저장소에 더 적절한 구조가 이미 없다면 아래 구조를 기본으로 사용합니다.

```txt
src/
  app/
    page.tsx
    login/
      page.tsx
    dashboard/
      page.tsx
    assistants/
      [assistantId]/
        page.tsx
    api/
      assistants/
        route.ts
        templates/
          route.ts
        [assistantId]/
          route.ts
          run/
            route.ts
  components/
    layout/
    assistants/
    ui/
    shared/
  lib/
    supabase/
    ai/
    assistants/
    providers/
    utils/
  types/
  mocks/
  tests/
  docs/
    execplans/
    steps/
```

### 디렉터리 역할

- `src/app/`: App Router 페이지와 API 라우트
- `src/components/layout/`: 앱 shell, header, sidebar, mobile nav
- `src/components/assistants/`: 비서 카드, 생성 모달, 결과 렌더러, 실행 기록
- `src/components/ui/`: 버튼, 카드, 배지, 입력, 상태 컴포넌트
- `src/lib/supabase/`: browser/server Supabase client
- `src/lib/ai/`: AI client, structured generation, AI 에러 처리
- `src/lib/assistants/`: runner, schema, config normalization
- `src/lib/providers/`: news/stock provider
- `src/types/`: 공통 타입
- `src/mocks/`: mock news/stock 데이터
- `tests/`: 단위 테스트와 통합 테스트
- `docs/`: 실행 계획과 아키텍처 문서

---

## 아키텍처 규칙

- 기능 단위 구조를 우선합니다.
- UI 컴포넌트에 비즈니스 로직을 직접 넣지 않습니다.
- AI 실행 로직은 Route Handler에서 직접 길게 작성하지 말고 runner로 분리합니다.
- provider는 runner와 분리하여 mock에서 실제 API로 교체 가능하게 만듭니다.
- Supabase 접근 로직은 재사용 가능한 함수로 분리합니다.
- Zod schema는 API 입력 검증과 AI 출력 검증에 사용합니다.
- `any`는 특별한 이유 없이 사용하지 않습니다.
- 상태 문자열은 enum 또는 상수로 관리합니다.
- 에러를 조용히 무시하지 않습니다.
- 죽은 코드, 주석 처리된 코드, 의미 없는 TODO는 남기지 않습니다.

---

## AI 비서 구현 규칙

AI 비서는 실제로 별도의 모델이 아닙니다.

비서의 정체성은 아래 조합으로 구성합니다.

```txt
assistant_template
+ user_assistant.config
+ assistant_runner
+ provider_data
+ structured_output_schema
+ result_component
```

### 새 비서 추가 시 필요한 작업

새로운 비서를 추가할 때는 아래 항목을 함께 추가합니다.

1. assistant template seed
2. config schema
3. provider 또는 data source
4. runner function
5. structured output schema
6. result UI component
7. API/화면 연결
8. 테스트 또는 최소 검증

### 금지사항

- 모든 비서를 같은 채팅창 UI로 처리하지 않습니다.
- 모델에게 최신 뉴스를 그냥 상상해서 말하게 하지 않습니다.
- AI가 출처를 만들어내도록 유도하지 않습니다.
- 주식 비서에서 매수/매도 추천을 생성하지 않습니다.
- AI API key를 클라이언트 컴포넌트에 import하지 않습니다.

---

## News Assistant 규칙

뉴스 비서는 오늘의 주요 이슈를 요약합니다.

### 데이터 흐름

```txt
사용자 설정
→ news provider
→ AI runner
→ NewsBriefSchema 검증
→ assistant_runs 저장
→ NewsAssistantResult 렌더링
```

### 필수 설정

- categories
- summaryStyle
- maxItems
- language

### 결과 UI

뉴스 결과는 아래 형태로 보여줍니다.

- 전체 요약
- 주요 이슈 카드
- 카테고리 배지
- 왜 중요한지 설명
- 출처 이름/링크

### 주의사항

- 출처가 없는 mock 데이터는 mock임을 명확히 관리합니다.
- 실제 provider로 전환할 때는 sourceName과 sourceUrl을 유지합니다.
- 뉴스 요약은 중립적이고 과장되지 않은 톤으로 작성합니다.

---

## Stock Assistant 규칙

주식 비서는 관심 종목의 가격 변동과 관련 이슈를 요약합니다.

### 데이터 흐름

```txt
사용자 관심 종목
→ stock provider
→ AI runner
→ StockBriefSchema 검증
→ assistant_runs 저장
→ StockAssistantResult 렌더링
```

### 필수 설정

- symbols
- market
- summaryStyle
- language

### 결과 UI

주식 결과는 아래 형태로 보여줍니다.

- 시장 요약
- 종목별 카드
- 가격/변동 요약
- 핵심 이슈 리스트
- 관련 뉴스
- 주의 문구
- 투자 조언 아님 disclaimer

### 금지 표현

아래 표현은 사용하지 않습니다.

- 매수 추천
- 매도 추천
- 목표가 제시
- 수익 보장
- 지금 사야 한다
- 반드시 오른다

필수 disclaimer:

```txt
이 내용은 투자 조언이 아니라 공개 데이터 기반 정보 요약입니다.
```

---

## Supabase 규칙

- Supabase Auth를 인증에 사용합니다.
- 사용자 소유 데이터는 반드시 `user_id`를 포함합니다.
- `user_assistants`, `assistant_runs`, `assistant_sources`에는 RLS를 적용합니다.
- 서버 코드에서도 사용자 소유권을 한 번 더 검증합니다.
- service role key가 필요한 작업은 서버 전용 파일에만 둡니다.
- 클라이언트에서 service role key를 사용할 수 없습니다.
- DB 컬럼명은 snake_case를 사용합니다.
- TypeScript 타입은 camelCase로 변환해 사용해도 됩니다.

---

## Route Handler 규칙

- App Router에서는 `app/api/**/route.ts`를 사용합니다.
- API route 내부에서 인증을 확인합니다.
- 사용자 입력은 Zod로 검증합니다.
- 본인 소유 리소스가 아니면 403 또는 404를 반환합니다.
- 외부 API 또는 AI API 에러는 사용자에게 안전한 메시지로 변환합니다.
- 내부 에러는 서버 로그에만 남깁니다.
- API 응답 형식은 일관되게 유지합니다.

성공 응답 예시:

```json
{
  "data": {}
}
```

에러 응답 예시:

```json
{
  "error": "비서 실행에 실패했습니다."
}
```

---

## OpenAI / LLM 호출 규칙

- 클라이언트에서 직접 호출하지 않습니다.
- `src/lib/ai/client.ts` 같은 서버 전용 모듈에서 관리합니다.
- `OPENAI_API_KEY`가 없으면 명확한 설정 에러를 발생시킵니다.
- 모델명은 `OPENAI_MODEL` 환경변수로 관리합니다.
- AI 결과는 반드시 schema validation을 통과해야 합니다.
- validation 실패 시 `assistant_runs.status = failed`로 기록합니다.
- prompt에는 사용자 입력과 provider 데이터를 명확히 구분해 전달합니다.
- prompt에는 비밀키, 내부 시스템 정보, 환경변수를 포함하지 않습니다.

---

## Provider 규칙

- MVP에서는 news와 stock 모두 mock provider로 시작합니다.
- provider는 인터페이스를 통해 교체 가능해야 합니다.
- runner는 provider 구현 세부사항을 몰라야 합니다.
- provider 결과에는 source metadata를 포함합니다.
- 실제 API provider로 전환할 때도 runner와 UI 변경을 최소화합니다.

환경변수 예시:

```env
NEWS_PROVIDER=mock
STOCK_PROVIDER=mock
```

---

## UX 및 접근성 기준

- 모든 비동기 화면에는 loading, error, empty, success 상태가 있어야 합니다.
- 폼은 가능한 짧고 이해하기 쉽게 유지합니다.
- 버튼/아이콘 버튼에는 접근 가능한 이름을 제공합니다.
- 모달은 닫기 버튼과 ESC/외부 클릭 정책을 명확히 합니다.
- 카드 클릭과 카드 내부 버튼 클릭이 충돌하지 않게 합니다.
- 색상만으로 상태를 전달하지 않습니다.
- 모바일에서 터치 영역이 너무 작지 않게 합니다.
- AI 실행 중에는 사용자가 현재 상태를 이해할 수 있게 합니다.

예시 loading 문구:

```txt
뉴스를 정리하고 있어요...
관심 종목 이슈를 분석하고 있어요...
AI 브리핑을 생성하고 있어요...
```

---

## 디자인 규칙

- 전체 UI는 깔끔한 SaaS 스타일로 유지합니다.
- 도트형 이미지는 비서 아바타, 빈 상태, 랜딩 히어로에 포인트로 사용합니다.
- 전체 배경이나 모든 요소를 도트 스타일로 만들지 않습니다.
- 카드에는 충분한 padding과 radius를 적용합니다.
- 모바일부터 데스크탑까지 자연스럽게 확장되는 레이아웃을 구현합니다.
- 특별한 이유가 없다면 하나의 디자인 시스템을 일관되게 사용합니다.

### 디자인 단위 규칙

- 웹 CSS에서는 Tailwind 기본 단위를 사용해도 됩니다.
- 임의의 수치가 필요한 경우 px 기준을 우선합니다.
- spacing, radius, width, height는 디자인 토큰 또는 Tailwind class로 일관되게 관리합니다.

---

## 성능 기준

- 대시보드는 빠르게 열려야 합니다.
- 비서 목록은 불필요하게 반복 요청하지 않습니다.
- AI 실행은 명시적인 사용자 액션으로만 수행합니다.
- AI 실행 결과는 DB에 저장해 다시 볼 수 있게 합니다.
- 긴 실행 기록은 페이지네이션 또는 limit을 적용합니다.
- 이미지 에셋은 최적화합니다.
- 불필요한 클라이언트 컴포넌트를 줄입니다.

---

## 테스트 및 검증

단순하지 않은 변경에는 테스트를 추가하거나 기존 테스트를 갱신합니다.

최소한 아래 항목은 핵심 테스트 범위에 포함합니다.

- assistant config validation
- news output schema validation
- stock output schema validation
- assistant runner success path
- assistant runner failure path
- user ownership guard
- assistant result renderer 분기
- stock disclaimer 포함 여부

작업을 마무리하기 전에 가능한 경우 아래 검증을 실행합니다.

```txt
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
```

macOS/Linux 환경이라면 다음도 허용합니다.

```txt
npm run lint
npm run typecheck
npm run test
```

해당 명령이 없다면 적절히 추가하거나, 실행하지 못한 이유를 문서에 남깁니다.

---

## 계획 및 작업 방식

여러 화면, 여러 기능, 또는 아키텍처 결정이 포함된 작업은 먼저 실행 계획 문서를 작성합니다.

실행 계획 문서 위치:

```txt
docs/execplans/<task-name>.md
```

실행 계획 문서에는 아래 내용을 포함합니다.

- 목표
- 가정
- 범위
- 구현 단계
- 리스크
- 검증 방법

한 번에 크게 갈아엎는 방식보다, 작고 리뷰하기 쉬운 변경을 선호합니다.

사소한 모호함 때문에 멈추지 말고, 근거 있는 가정을 세운 뒤 문서에 남깁니다.

---

## 단계별(step) 작업 규칙

이 프로젝트는 필요한 경우 `step/NN-<slug>` 브랜치 단위로 작업합니다.

- 새 step을 시작하기 전에 항상 직전 step 브랜치를 먼저 `develop`에 머지하고 원격 `develop`까지 푸시합니다.
- 새 step은 항상 최신 `develop`에서 새 브랜치를 따서 시작합니다.
- 각 step은 구현 전에 아래 두 문서를 먼저 만듭니다.
  - `docs/execplans/step-NN-<slug>.md`
  - `docs/steps/bootstrap-step-NN-<slug>.md`
- `docs/execplans` 문서와 `docs/steps` 문서는 같은 step 번호와 slug를 사용해 짝을 맞춥니다.
- step 구현이 끝나면 아래 순서대로 마무리합니다.
  - `npm.cmd run lint`
  - `npm.cmd run typecheck`
  - `npm.cmd run test`
  - Conventional Commit 메시지로 커밋
  - step 브랜치를 원격에 푸시

---

## 권장 구현 순서

### Step 1 — 프로젝트 세팅

- Next.js App Router 세팅
- TypeScript strict mode
- Tailwind CSS
- 기본 레이아웃
- 랜딩 페이지 초안

### Step 2 — 인증

- Supabase Auth
- 로그인 페이지
- 로그아웃
- 보호 라우트
- session 복원

### Step 3 — DB schema

- assistant_templates
- user_assistants
- assistant_runs
- assistant_sources
- RLS
- seed data

### Step 4 — 비서 CRUD

- template 조회
- 내 비서 조회
- 비서 추가
- 비서 수정
- 비서 삭제
- 대시보드 UI

### Step 5 — AI runner 기반

- AI client
- generateStructured
- output schemas
- mock providers
- news runner
- stock runner

### Step 6 — 실행 API

- `/api/assistants/[assistantId]/run`
- pending/success/failed 저장
- 소유권 검증
- 에러 처리

### Step 7 — 결과 UI

- NewsAssistantResult
- StockAssistantResult
- AssistantRunHistory
- AssistantResultRenderer

### Step 8 — 포트폴리오 완성도

- 반응형 polish
- 도트 아바타
- 빈/로딩/에러 상태
- README
- `.env.example`

---

## 완료 기준

아래 조건을 모두 만족해야 작업이 완료된 것으로 봅니다.

- 요청한 동작이 실제로 작동한다.
- 변경된 화면에 빈 상태 / 에러 / 로딩 상태가 포함되어 있다.
- 타입 안정성이 유지된다.
- Supabase RLS와 서버 소유권 검증이 적용되어 있다.
- AI API key가 클라이언트에 노출되지 않는다.
- AI 출력은 schema validation을 통과한다.
- 뉴스와 주식 결과 UI가 서로 다르게 렌더링된다.
- 관련 테스트와 검증이 갱신되고 실행되었다.
- 동작이나 아키텍처가 크게 바뀌었다면 README 또는 문서가 함께 업데이트되었다.

---

## 유지보수 규칙

같은 실수나 동일한 리뷰 코멘트가 두 번 이상 반복되면, 이후 작업에도 반영될 수 있도록 이 파일에 해당 내용을 추가합니다.

새 비서 타입을 추가할 때마다 아래 문서를 함께 갱신합니다.

- README
- PRD 또는 기능 문서
- schema 문서
- provider 문서
- 테스트 범위

---

## Git 커밋 메시지 규칙

커밋 메시지는 기본적으로 **Conventional Commits** 형식을 사용합니다.

기본 형식:

```txt
type(scope): summary
```

`summary`는 명령형 현재 시제로 짧고 명확하게 작성합니다.

가능하면 50~72자 안쪽으로 유지하고, 무엇을 바꿨는지 중심으로 씁니다.

이 프로젝트에서 우선 사용하는 type은 다음과 같습니다.

- `feat`: 기능 추가
- `fix`: 버그 수정
- `refactor`: 동작 변화 없는 구조 개선
- `docs`: 문서 변경
- `test`: 테스트 추가 또는 수정
- `chore`: 설정, 의존성, 보일러플레이트 정리 등 기타 작업
- `style`: 포맷팅 등 동작과 무관한 스타일 변경
- `perf`: 성능 개선

예시:

```txt
feat(assistants): add news assistant runner
feat(assistants): add stock result cards
fix(auth): protect assistant detail route
docs(planning): add step 01 execution plan
chore(repo): bootstrap next app
```

---

## README 작성 규칙

README에는 아래 내용을 포함해야 합니다.

- 프로젝트 소개
- 주요 기능
- 기술 스택
- 로컬 실행 방법
- 환경변수
- Supabase schema 적용 방법
- AI 비서 실행 구조
- mock provider 설명
- MVP 범위
- 향후 확장 계획

---

## Codex 작업 프롬프트 기본값

Codex에게 작업을 시작시킬 때는 아래 방향을 유지합니다.

```txt
Build Pixel Agents as a production-quality Next.js TypeScript web app.
Focus on a working MVP first.
Use Supabase Auth and Postgres for user-owned data.
Use server-side Route Handlers for AI execution.
Do not call OpenAI from the client.
Use mock providers for news and stock data first.
Use Zod schemas for all structured AI outputs.
Render assistant-specific result UIs instead of a generic chat UI.
Keep the code modular, typed, and easy to extend.
```
