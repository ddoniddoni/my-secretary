# Pixel Agents
## Codex 개발용 PRD (Next.js + Supabase + AI 비서 대시보드 버전)

## 1. 문서 목적

이 문서는 Codex가 **Pixel Agents** 프로젝트를 구현할 수 있도록 작성한 제품 요구사항 문서(PRD)이자 구현 가이드입니다.

Pixel Agents는 사용자가 로그인 후 목적별 AI 비서를 추가하고, 각 비서가 뉴스·주식 같은 정보를 정리해주는 반응형 웹 기반 AI 대시보드입니다.

이 문서는 Codex가 아래 작업을 수행할 수 있을 만큼 충분히 상세해야 합니다.

- Next.js 프로젝트 구조 초기화
- Supabase Auth 및 DB 연결
- 사용자별 AI 비서 생성/삭제/조회 구현
- AI 비서 실행 API 구현
- OpenAI API를 서버 사이드에서 안전하게 호출
- 뉴스/주식 비서의 mock provider 구현
- 구조화된 AI 응답 스키마 구현
- 비서 타입별 결과 UI 구현
- 반응형 대시보드 및 도트형 비서 아바타 구현
- README와 개발 문서 작성

---

## 2. 제품 요약

Pixel Agents는 다음을 결합한 웹 애플리케이션입니다.

- **개인화 AI 비서 대시보드**
- **목적별 AI 비서 추가/관리**
- **뉴스·주식 정보 요약**
- **비서별 전용 결과 UI**
- **도트형 AI 캐릭터 기반 브랜딩**

사용자는 로그인 후 자신의 대시보드에서 AI 비서를 추가할 수 있습니다.

MVP에서 제공하는 기본 비서는 다음 두 가지입니다.

1. **오늘 뉴스 정리 AI**
2. **주식 브리핑 AI**

중요한 제품 방향은 단순 채팅 UI를 반복하는 것이 아닙니다.

뉴스 비서는 뉴스 카드 UI를 사용하고, 주식 비서는 관심 종목 카드와 이슈 브리핑 UI를 사용합니다.

즉, 이 제품의 핵심은 다음입니다.

> AI를 호출하는 앱이 아니라, 목적별 AI 비서를 제품 UX 안에 안정적으로 녹인 개인화 대시보드.

---

## 3. 핵심 제품 가치

### 3.1 사용자 문제

사용자는 매일 필요한 정보를 빠르게 정리하고 싶지만, 다음과 같은 불편을 겪습니다.

- 뉴스가 너무 많아 핵심 이슈를 빠르게 파악하기 어렵다.
- 관심 종목의 가격 변동과 관련 뉴스를 한 번에 보기 어렵다.
- 매번 같은 프롬프트를 직접 입력해야 한다.
- AI 채팅창은 범용적이지만, 뉴스/주식/일정처럼 목적별로 최적화된 화면을 제공하지 않는다.
- 자주 쓰는 AI 작업을 대시보드 형태로 저장하고 반복 실행하기 어렵다.

### 3.2 제품 해결책

Pixel Agents는 다음 방식으로 문제를 해결합니다.

1. **AI 비서 템플릿 제공**
   - 뉴스 비서, 주식 비서 같은 목적별 템플릿을 제공한다.

2. **사용자별 비서 추가**
   - 사용자는 원하는 비서를 자신의 대시보드에 추가한다.

3. **비서별 설정 저장**
   - 뉴스 비서는 관심 카테고리와 요약 스타일을 저장한다.
   - 주식 비서는 관심 종목과 브리핑 스타일을 저장한다.

4. **서버 사이드 AI 실행**
   - 클라이언트에서 직접 OpenAI API를 호출하지 않는다.
   - Next.js Route Handler를 통해 서비스 전용 AI 실행 API를 만든다.

5. **구조화된 결과 UI**
   - AI 응답을 단순 텍스트로 렌더링하지 않는다.
   - Zod schema 기반 JSON으로 검증한 뒤, 비서 타입에 맞는 UI로 보여준다.

---

## 4. 제품 목표

### 4.1 사용자 목표

- 내가 자주 쓰는 AI 비서를 대시보드에 저장할 수 있다.
- 오늘의 주요 뉴스 이슈를 빠르게 확인할 수 있다.
- 관심 종목의 핵심 이슈를 투자 조언이 아닌 정보 요약 형태로 확인할 수 있다.
- AI 결과를 채팅 로그가 아닌 카드/리포트 UI로 쉽게 읽을 수 있다.
- 모바일과 데스크탑 모두에서 자연스럽게 사용할 수 있다.

### 4.2 포트폴리오 목표

이 프로젝트는 경력직 프론트엔드 포트폴리오로 사용될 수 있어야 합니다.

따라서 다음 역량이 드러나야 합니다.

- 제품 기획을 화면 구조로 구현하는 능력
- Next.js App Router 기반 구조 설계
- 서버/클라이언트 경계 이해
- Supabase Auth 및 RLS 기반 사용자 데이터 분리
- AI API를 안전하게 서버에서 래핑하는 구조
- AI 응답을 JSON schema로 검증하는 구현력
- 비서 타입별 UI 분기 설계
- 반응형 UI 구현
- 로딩/에러/빈 상태 처리
- 기능 단위 아키텍처
- README와 개발 문서 작성 능력

### 4.3 비즈니스 가능성 목표

MVP 이후 다음 방향으로 확장 가능해야 합니다.

- 더 많은 비서 템플릿 추가
- 비서 마켓/갤러리
- 사용자 커스텀 비서 생성
- 비서 실행 기록 분석
- 프리미엄 비서 제공
- 외부 데이터 API 연동
- 알림/예약 실행

---

## 5. 플랫폼 및 기술 방향

### 5.1 플랫폼

- Web
- Desktop responsive
- Mobile responsive

앱스토어 출시용 모바일 앱이 아니라, Vercel 배포를 전제로 한 웹 애플리케이션입니다.

### 5.2 프론트엔드 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui 선택 가능
- lucide-react 선택 가능

### 5.3 백엔드 / 데이터 스택

- Next.js Route Handlers
- Supabase Auth
- Supabase Postgres
- Supabase RLS
- OpenAI API 또는 호환 LLM API
- Zod

### 5.4 상태 관리

권장 조합:

- 서버 데이터: TanStack Query 또는 Next.js server fetch 패턴
- 간단한 클라이언트 UI 상태: React state
- 전역 UI 상태가 필요할 경우: Zustand

초기 MVP에서는 Zustand를 과하게 사용하지 않습니다.

### 5.5 패키지 매니저

- 기본값은 `npm`
- 기존 lockfile이 있으면 해당 패키지 매니저를 따릅니다.

---

## 6. 핵심 제품 원칙

- 단순 AI 채팅앱처럼 만들지 않는다.
- 비서마다 목적에 맞는 결과 UI를 제공한다.
- AI API 키는 절대 클라이언트에 노출하지 않는다.
- 최신 데이터가 필요한 영역은 mock provider로 시작하되, provider 교체가 가능하도록 설계한다.
- AI 응답은 구조화된 JSON으로 받고 Zod로 검증한다.
- 모든 주요 화면에는 loading, error, empty 상태가 있어야 한다.
- 도트형 이미지는 전체 UI에 과하게 쓰지 않고, 비서 아바타와 빈 상태에 포인트로 사용한다.
- 주식 비서는 투자 추천이 아니라 정보 요약 도구로 유지한다.
- MVP는 작게 완성하고, 확장은 명확히 분리한다.

---

## 7. 정보 구조(IA)

권장 페이지 구조:

1. Landing
2. Login
3. Dashboard
4. Assistant Detail
5. Settings 또는 Profile

### 7.1 Landing

표시 내용:

- 서비스 소개
- AI 비서 컨셉 설명
- 뉴스/주식 비서 미리보기
- 반응형 UI 강조
- 로그인 CTA

### 7.2 Login

표시 내용:

- 이메일 로그인 또는 OAuth 로그인
- 로그인 후 대시보드 이동
- 이미 로그인한 사용자의 redirect 처리

### 7.3 Dashboard

표시 내용:

- 사용자 인사말
- 내 AI 비서 목록
- 비서 추가 버튼
- 비서 카드 그리드
- 최근 실행 결과 요약
- 빈 상태

### 7.4 Assistant Detail

표시 내용:

- 비서 헤더
- 비서 설정 요약
- 실행 버튼
- 최근 실행 결과
- 실행 기록 목록
- 비서 타입별 결과 UI

### 7.5 Settings / Profile

MVP에서는 최소 구현만 합니다.

표시 내용:

- 사용자 이메일
- 로그아웃
- 향후 설정 확장 영역

---

## 8. 주요 사용자 플로우

### 8.1 첫 방문

1. 사용자가 랜딩 페이지 접속
2. 제품 컨셉 확인
3. 로그인 버튼 클릭
4. 로그인 성공
5. 대시보드 진입
6. 아직 비서가 없으면 빈 상태 표시
7. `+ 비서 추가` 버튼 클릭 유도

### 8.2 비서 추가

1. 사용자가 대시보드에서 `+ 비서 추가` 클릭
2. 비서 템플릿 선택 모달 표시
3. 뉴스 비서 또는 주식 비서 선택
4. 비서별 기본 설정 입력
5. 저장
6. 대시보드에 새 비서 카드 표시

### 8.3 뉴스 비서 실행

1. 사용자가 뉴스 비서 카드 또는 상세 페이지에서 실행 버튼 클릭
2. `/api/assistants/[assistantId]/run` 호출
3. 서버에서 사용자 소유권 확인
4. 뉴스 provider에서 데이터 수집
5. OpenAI API로 구조화된 뉴스 요약 생성
6. 실행 결과 저장
7. 뉴스 카드 UI로 결과 표시

### 8.4 주식 비서 실행

1. 사용자가 주식 비서 실행 버튼 클릭
2. 서버에서 사용자 소유권 확인
3. 관심 종목 설정 확인
4. 주식 provider에서 mock 또는 실제 데이터 수집
5. OpenAI API로 구조화된 브리핑 생성
6. 실행 결과 저장
7. 종목별 카드 UI로 결과 표시

### 8.5 비서 삭제

1. 사용자가 비서 카드의 삭제 버튼 클릭
2. 확인 모달 표시
3. 삭제 확정
4. 사용자 소유 비서인지 서버에서 검증
5. 삭제 후 대시보드 목록 갱신

---

## 9. 기능 범위

## 9.1 인증

### 요구사항

- Supabase Auth 사용
- MVP는 이메일/비밀번호 또는 OAuth 중 하나로 시작 가능
- 인증되지 않은 사용자는 `/dashboard`, `/assistants/[assistantId]` 접근 불가
- 로그인한 사용자가 `/login` 접근 시 `/dashboard`로 이동
- 로그아웃 가능

### 우선 구현

- 이메일/비밀번호 로그인 또는 GitHub OAuth 중 하나 선택
- session 복원
- 서버 라우트에서 현재 사용자 확인

---

## 9.2 대시보드

### 표시 요소

- 사용자 인사말
- 내 비서 수
- 최근 실행 시간
- 비서 카드 목록
- `+ 비서 추가` 버튼

### 비서 카드 필드

- 도트형 아바타
- 비서 이름
- 비서 설명
- 비서 타입 배지
- 최근 실행 시간
- 실행 버튼
- 상세 보기 버튼
- 삭제 버튼

### 빈 상태 문구

```txt
아직 추가한 AI 비서가 없습니다.
+ 버튼을 눌러 첫 번째 비서를 추가해보세요.
```

---

## 9.3 비서 템플릿

MVP에서 제공할 템플릿은 두 가지입니다.

### 9.3.1 오늘 뉴스 정리 AI

설명:

- 오늘의 주요 이슈를 카테고리별로 요약한다.
- 사용자가 선택한 관심 카테고리를 반영한다.
- 결과는 뉴스 카드 형태로 보여준다.

설정값:

- `categories`: 관심 카테고리 배열
- `summaryStyle`: `brief` | `balanced` | `detailed`
- `maxItems`: 5 | 7 | 10
- `language`: `ko`

카테고리 후보:

- IT
- 경제
- 국제
- 사회
- 문화
- 스포츠

### 9.3.2 주식 브리핑 AI

설명:

- 사용자가 등록한 관심 종목의 가격 변동과 관련 이슈를 요약한다.
- 투자 조언은 제공하지 않는다.
- 결과는 종목 카드와 이슈 리스트 형태로 보여준다.

설정값:

- `symbols`: 관심 종목 배열
- `market`: `US` | `KR`
- `summaryStyle`: `short` | `news-focused` | `risk-focused`
- `language`: `ko`

기본 종목 예시:

- AAPL
- NVDA
- TSLA

주의:

- `매수 추천`, `매도 추천`, `목표가`, `수익 보장` 같은 표현을 금지한다.
- 주식 비서는 정보 요약 도구로 포지셔닝한다.

---

## 9.4 비서 추가 모달

### 요구사항

- 대시보드에서 `+` 버튼 클릭 시 표시
- 비서 템플릿 목록 표시
- 템플릿 카드 클릭 시 설정 폼 표시
- 저장 시 `user_assistants`에 추가

### UI 구성

1. 템플릿 선택 단계
2. 설정 입력 단계
3. 저장 완료 후 닫기

### 뉴스 비서 설정 폼

- 비서 이름
- 관심 카테고리 다중 선택
- 요약 스타일 선택
- 뉴스 개수 선택

### 주식 비서 설정 폼

- 비서 이름
- 관심 종목 입력
- 시장 선택
- 브리핑 스타일 선택

### 검증

- 비서 이름은 필수
- 뉴스 카테고리는 최소 1개 이상
- 주식 종목은 최소 1개 이상
- 종목 코드는 공백 제거 및 대문자 정규화

---

## 9.5 비서 실행

### 공통 요구사항

비서 실행 API는 다음 엔드포인트를 사용합니다.

```txt
POST /api/assistants/[assistantId]/run
```

동작 순서:

1. 현재 로그인 사용자 확인
2. `assistantId`로 user assistant 조회
3. 현재 사용자 소유인지 확인
4. `assistant_runs`에 `pending` 상태 기록 생성
5. 비서 타입별 runner 실행
6. provider에서 필요한 데이터 수집
7. OpenAI API 호출
8. Zod schema로 결과 검증
9. 성공 시 `assistant_runs` 업데이트
10. 실패 시 `assistant_runs`에 error 저장
11. JSON 응답 반환

---

## 9.6 뉴스 비서 실행

### 동작 순서

1. 사용자 설정에서 `categories`, `summaryStyle`, `maxItems` 읽기
2. `fetchTodayNews` 호출
3. 뉴스 데이터가 없으면 사용자 친화적 에러 반환
4. AI에게 뉴스 데이터를 전달
5. `NewsBriefSchema` 형태로 결과 생성
6. 실행 결과 저장
7. 프론트에 반환

### 프롬프트 조건

- 한국어로 작성
- 중립적인 톤 유지
- 과장 금지
- 출처가 있으면 유지
- 사용자가 1분 안에 읽을 수 있게 요약
- 각 이슈마다 `whyItMatters` 포함

---

## 9.7 주식 비서 실행

### 동작 순서

1. 사용자 설정에서 `symbols`, `market`, `summaryStyle` 읽기
2. `fetchStockData` 호출
3. 관심 종목 데이터가 없으면 에러 반환
4. AI에게 종목 데이터 전달
5. `StockBriefSchema` 형태로 결과 생성
6. 실행 결과 저장
7. 프론트에 반환

### 프롬프트 조건

- 한국어로 작성
- 공개 데이터 기반 정보 요약만 제공
- 투자 조언 금지
- 매수/매도 추천 금지
- 불확실한 정보는 단정하지 않기
- 마지막에 disclaimer 포함

필수 disclaimer:

```txt
이 내용은 투자 조언이 아니라 공개 데이터 기반 정보 요약입니다.
```

---

## 10. 데이터베이스 설계

Supabase Postgres 기준으로 설계합니다.

## 10.1 assistant_templates

기본 비서 템플릿을 저장합니다.

```sql
create table assistant_templates (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('news', 'stock')),
  name text not null,
  description text not null,
  avatar_key text not null,
  system_prompt text not null,
  default_config jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 10.2 user_assistants

사용자가 자신의 대시보드에 추가한 비서를 저장합니다.

```sql
create table user_assistants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null references assistant_templates(id) on delete restrict,
  type text not null check (type in ('news', 'stock')),
  name text not null,
  config jsonb not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 10.3 assistant_runs

비서 실행 기록을 저장합니다.

```sql
create table assistant_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_assistant_id uuid not null references user_assistants(id) on delete cascade,
  type text not null check (type in ('news', 'stock')),
  status text not null check (status in ('pending', 'success', 'failed')),
  input jsonb not null default '{}',
  output jsonb,
  error_message text,
  provider_meta jsonb not null default '{}',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
```

---

## 10.4 assistant_sources

AI 결과 생성에 사용한 출처를 저장합니다.

```sql
create table assistant_sources (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references assistant_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('news', 'stock')),
  title text not null,
  source_name text,
  source_url text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
```

---

## 10.5 RLS 정책

모든 사용자 소유 테이블은 RLS를 활성화합니다.

```sql
alter table user_assistants enable row level security;
alter table assistant_runs enable row level security;
alter table assistant_sources enable row level security;
```

### user_assistants 정책

```sql
create policy "Users can read own assistants"
on user_assistants
for select
using (auth.uid() = user_id);

create policy "Users can insert own assistants"
on user_assistants
for insert
with check (auth.uid() = user_id);

create policy "Users can update own assistants"
on user_assistants
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own assistants"
on user_assistants
for delete
using (auth.uid() = user_id);
```

### assistant_runs 정책

```sql
create policy "Users can read own runs"
on assistant_runs
for select
using (auth.uid() = user_id);

create policy "Users can insert own runs"
on assistant_runs
for insert
with check (auth.uid() = user_id);

create policy "Users can update own runs"
on assistant_runs
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

### assistant_sources 정책

```sql
create policy "Users can read own assistant sources"
on assistant_sources
for select
using (auth.uid() = user_id);

create policy "Users can insert own assistant sources"
on assistant_sources
for insert
with check (auth.uid() = user_id);
```

---

## 11. Seed 데이터

초기 비서 템플릿 2개를 추가합니다.

```sql
insert into assistant_templates (
  type,
  name,
  description,
  avatar_key,
  system_prompt,
  default_config
) values
(
  'news',
  '오늘 뉴스 정리 AI',
  '오늘의 주요 뉴스 이슈를 핵심만 정리해주는 비서입니다.',
  'pixel-reporter',
  'You are a Korean news briefing assistant. Summarize news clearly, neutrally, and concisely. Do not fabricate sources.',
  '{"categories":["IT","경제","국제"],"summaryStyle":"brief","maxItems":5,"language":"ko"}'
),
(
  'stock',
  '주식 브리핑 AI',
  '관심 종목의 가격 변동과 관련 이슈를 요약해주는 비서입니다.',
  'pixel-broker',
  'You are a stock information briefing assistant. Do not provide investment advice. Summarize public information only.',
  '{"symbols":["AAPL","NVDA","TSLA"],"market":"US","summaryStyle":"news-focused","language":"ko"}'
);
```

---

## 12. TypeScript 타입

```ts
export type AssistantType = "news" | "stock";

export type AssistantRunStatus = "pending" | "success" | "failed";

export type AssistantTemplate = {
  id: string;
  type: AssistantType;
  name: string;
  description: string;
  avatarKey: string;
  systemPrompt: string;
  defaultConfig: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserAssistant = {
  id: string;
  userId: string;
  templateId: string;
  type: AssistantType;
  name: string;
  config: Record<string, unknown>;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AssistantRun = {
  id: string;
  userId: string;
  userAssistantId: string;
  type: AssistantType;
  status: AssistantRunStatus;
  input: Record<string, unknown>;
  output: unknown | null;
  errorMessage?: string | null;
  providerMeta: Record<string, unknown>;
  createdAt: string;
  completedAt?: string | null;
};
```

---

## 13. AI 결과 스키마

## 13.1 뉴스 비서 결과

```ts
import { z } from "zod";

export const NewsBriefSchema = z.object({
  title: z.string(),
  date: z.string(),
  summary: z.string(),
  issues: z.array(
    z.object({
      category: z.string(),
      title: z.string(),
      summary: z.string(),
      whyItMatters: z.string(),
      sourceName: z.string().optional(),
      sourceUrl: z.string().optional(),
    })
  ),
});

export type NewsBriefOutput = z.infer<typeof NewsBriefSchema>;
```

---

## 13.2 주식 비서 결과

```ts
import { z } from "zod";

export const StockBriefSchema = z.object({
  title: z.string(),
  marketSummary: z.string(),
  stocks: z.array(
    z.object({
      symbol: z.string(),
      name: z.string().optional(),
      priceSummary: z.string().optional(),
      changeSummary: z.string(),
      keyIssues: z.array(z.string()),
      relatedNews: z
        .array(
          z.object({
            title: z.string(),
            sourceName: z.string().optional(),
            sourceUrl: z.string().optional(),
          })
        )
        .optional(),
      caution: z.string(),
    })
  ),
  disclaimer: z.string(),
});

export type StockBriefOutput = z.infer<typeof StockBriefSchema>;
```

---

## 14. API 설계

## 14.1 GET `/api/assistants/templates`

목적:

- 활성화된 비서 템플릿 목록 조회

응답:

```json
{
  "templates": []
}
```

---

## 14.2 GET `/api/assistants`

목적:

- 현재 로그인한 사용자의 비서 목록 조회

응답:

```json
{
  "assistants": []
}
```

---

## 14.3 POST `/api/assistants`

목적:

- 사용자의 대시보드에 비서 추가

요청 예시:

```json
{
  "templateId": "uuid",
  "name": "오늘 뉴스 정리 AI",
  "config": {
    "categories": ["IT", "경제"],
    "summaryStyle": "brief",
    "maxItems": 5,
    "language": "ko"
  }
}
```

응답 예시:

```json
{
  "assistant": {}
}
```

검증:

- 로그인 필수
- `templateId` 필수
- `name` 필수
- 템플릿 타입에 따라 config 검증

---

## 14.4 GET `/api/assistants/[assistantId]`

목적:

- 특정 비서 상세 조회

응답:

```json
{
  "assistant": {},
  "latestRun": null,
  "runs": []
}
```

검증:

- 로그인 필수
- 본인 소유 비서만 조회 가능

---

## 14.5 PATCH `/api/assistants/[assistantId]`

목적:

- 비서 이름 또는 설정 수정

요청:

```json
{
  "name": "내 뉴스 비서",
  "config": {
    "categories": ["IT", "경제", "국제"],
    "summaryStyle": "balanced",
    "maxItems": 7
  }
}
```

---

## 14.6 DELETE `/api/assistants/[assistantId]`

목적:

- 비서 삭제

응답:

```json
{
  "ok": true
}
```

검증:

- 로그인 필수
- 본인 소유 비서만 삭제 가능

---

## 14.7 POST `/api/assistants/[assistantId]/run`

목적:

- 비서 실행

응답 예시:

```json
{
  "runId": "uuid",
  "type": "news",
  "output": {}
}
```

실패 응답:

```json
{
  "error": "뉴스 브리핑 생성에 실패했습니다."
}
```

서버 동작:

```txt
1. 로그인 사용자 확인
2. assistantId 소유권 확인
3. assistant_runs pending 생성
4. assistant type에 맞는 runner 선택
5. provider 데이터 수집
6. AI 구조화 응답 생성
7. assistant_runs success/failed 업데이트
8. 결과 반환
```

---

## 15. AI Runner 설계

권장 구조:

```txt
src/
  lib/
    ai/
      client.ts
      generateStructured.ts
      errors.ts
    assistants/
      runners/
        index.ts
        newsRunner.ts
        stockRunner.ts
      schemas/
        news.ts
        stock.ts
      config/
        normalizeConfig.ts
    providers/
      news/
        index.ts
        mockNewsProvider.ts
        types.ts
      stocks/
        index.ts
        mockStockProvider.ts
        types.ts
```

---

## 15.1 AI client

요구사항:

- 서버 전용 파일로 유지
- `OPENAI_API_KEY` 없으면 명확한 에러 throw
- 클라이언트 컴포넌트에서 import하지 않도록 주의
- 모델명은 `OPENAI_MODEL` 환경변수로 관리

---

## 15.2 generateStructured

목적:

- 공통 AI 호출 함수
- Zod schema를 받아 구조화된 JSON 결과 반환
- 실패 시 원인을 로깅하고 사용자에게는 안전한 메시지 반환

요구사항:

- system prompt와 user prompt를 분리
- provider input data를 명시적으로 전달
- schema validation 실패 처리
- token/비용 추적용 metadata 확장 가능성 고려

---

## 15.3 assistantRunners

```ts
import { runNewsAssistant } from "./newsRunner";
import { runStockAssistant } from "./stockRunner";

export const assistantRunners = {
  news: runNewsAssistant,
  stock: runStockAssistant,
};
```

새 비서를 추가할 때는 다음만 추가하면 되도록 설계합니다.

1. template seed
2. config schema
3. runner
4. result schema
5. result UI component

---

## 16. 데이터 Provider 설계

## 16.1 News Provider

MVP는 mock provider로 시작합니다.

환경변수:

```env
NEWS_PROVIDER=mock
```

mock 응답 예시:

```ts
export async function fetchTodayNewsMock() {
  return [
    {
      title: "AI 반도체 경쟁 심화",
      sourceName: "Mock News",
      sourceUrl: "https://example.com/news/ai-chip",
      publishedAt: new Date().toISOString(),
      category: "IT",
      content: "AI 데이터센터 수요 증가로 주요 반도체 기업들의 경쟁이 심화되고 있다.",
    },
    {
      title: "글로벌 증시 혼조세",
      sourceName: "Mock Finance",
      sourceUrl: "https://example.com/news/market",
      publishedAt: new Date().toISOString(),
      category: "경제",
      content: "금리 전망과 기업 실적 발표 영향으로 글로벌 증시가 혼조세를 보였다.",
    }
  ];
}
```

향후 확장:

- OpenAI web search provider
- 외부 뉴스 API provider
- RSS provider

원칙:

- 최신 뉴스는 모델 지식만 믿지 않는다.
- 출처가 없는 뉴스는 결과에 표시하지 않는다.
- provider는 runner와 분리하여 교체 가능하게 만든다.

---

## 16.2 Stock Provider

MVP는 mock provider로 시작합니다.

환경변수:

```env
STOCK_PROVIDER=mock
```

mock 응답 예시:

```ts
export async function fetchStockDataMock(symbols: string[]) {
  return symbols.map((symbol) => ({
    symbol,
    name: symbol,
    price: 100,
    changePercent: 1.2,
    relatedNews: [
      {
        title: `${symbol} 관련 주요 이슈`,
        sourceName: "Mock Market News",
        sourceUrl: "https://example.com/stock-news",
      },
    ],
  }));
}
```

향후 확장:

- Alpha Vantage provider
- Finnhub provider
- Polygon provider
- Yahoo Finance 비공식 provider는 안정성 문제로 MVP에서는 피한다.

원칙:

- 주식 provider는 가격/변동률/관련 뉴스 데이터를 가져오는 역할만 한다.
- 투자 판단은 제공하지 않는다.
- AI runner는 데이터를 요약만 한다.

---

## 17. UI 컴포넌트 구조

권장 구조:

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
      AppShell.tsx
      Header.tsx
      Sidebar.tsx
      MobileNav.tsx
    assistants/
      AssistantCard.tsx
      AssistantGrid.tsx
      AssistantCreateDialog.tsx
      AssistantResultRenderer.tsx
      NewsAssistantResult.tsx
      StockAssistantResult.tsx
      AssistantRunHistory.tsx
      PixelAvatar.tsx
    ui/
      Button.tsx
      Card.tsx
      Badge.tsx
      EmptyState.tsx
      LoadingState.tsx
      ErrorState.tsx
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
    ai/
    assistants/
    providers/
  types/
  mocks/
  tests/
```

---

## 18. 화면 요구사항

## 18.1 랜딩 페이지

경로:

```txt
/
```

필수 섹션:

- Hero
- AI 비서 미리보기
- 핵심 기능 카드
- 반응형 사용 예시
- CTA

문구 예시:

```txt
나만의 AI 비서들을 한 화면에서 관리하세요.
뉴스, 주식, 일정 같은 반복적인 정보 정리를 목적별 AI 비서에게 맡겨보세요.
```

디자인:

- 깔끔한 SaaS UI
- 도트형 AI 아바타 포인트
- 모바일 우선 반응형

---

## 18.2 로그인 페이지

경로:

```txt
/login
```

요구사항:

- 로그인 폼 또는 OAuth 버튼
- 로그인 중 loading 상태
- 로그인 실패 error 상태
- 이미 로그인한 사용자는 `/dashboard`로 redirect

---

## 18.3 대시보드 페이지

경로:

```txt
/dashboard
```

요구사항:

- 인증 필요
- 비서 목록 조회
- 비서 추가 모달
- 비서 실행
- 비서 삭제
- 빈 상태 표시

레이아웃:

- 모바일: 1컬럼 카드
- 태블릿: 2컬럼 카드
- 데스크탑: 사이드바 + 2~3컬럼 카드

---

## 18.4 비서 상세 페이지

경로:

```txt
/assistants/[assistantId]
```

요구사항:

- 인증 필요
- 본인 소유 비서만 조회 가능
- 비서 정보 표시
- 실행 버튼
- 최근 실행 결과 표시
- 실행 기록 목록 표시
- 비서 타입별 결과 UI 렌더링

---

## 19. AssistantResultRenderer

비서 타입에 따라 결과 UI를 다르게 렌더링합니다.

```tsx
export function AssistantResultRenderer({
  type,
  output,
}: {
  type: "news" | "stock";
  output: unknown;
}) {
  if (type === "news") {
    return <NewsAssistantResult data={output as NewsBriefOutput} />;
  }

  if (type === "stock") {
    return <StockAssistantResult data={output as StockBriefOutput} />;
  }

  return null;
}
```

중요:

- 모든 비서를 같은 채팅 UI로 보여주지 않는다.
- 뉴스는 뉴스 카드 UI로 보여준다.
- 주식은 종목 카드와 이슈 리스트 UI로 보여준다.

---

## 20. 디자인 방향

### 20.1 전체 톤

- 깔끔한 SaaS 스타일
- 충분한 여백
- 카드 중심 레이아웃
- 도트 아바타로 브랜드 포인트
- 과한 게임 UI는 피한다.

### 20.2 도트 이미지 사용 위치

- 비서 아바타
- 랜딩 페이지 Hero 일러스트
- 빈 상태 일러스트
- 로딩 상태 캐릭터

### 20.3 아바타 키

- `pixel-reporter`: 뉴스 비서
- `pixel-broker`: 주식 비서
- `pixel-helper`: 기본 비서

초기 구현에서는 실제 이미지 파일이 없어도 CSS 기반 placeholder 또는 간단한 SVG로 대체할 수 있습니다.

---

## 21. 반응형 요구사항

### 모바일

- 1컬럼 카드 레이아웃
- 상단 헤더 간소화
- 비서 추가 버튼은 floating 또는 상단 고정
- 모달은 full-screen sheet 형태 가능

### 태블릿

- 2컬럼 카드 레이아웃
- 헤더와 콘텐츠 폭 제한

### 데스크탑

- 좌측 사이드바
- 2~3컬럼 카드 그리드
- 상세 페이지는 메인 결과 영역 + 우측 실행 기록 패널 가능

---

## 22. 상태 처리

모든 주요 화면은 아래 상태를 구현해야 합니다.

- loading
- error
- empty
- success

예시:

- 비서 목록 로딩 중
- 아직 추가한 비서가 없음
- AI 응답 생성 중
- AI 응답 생성 실패
- 비서 삭제 성공
- 네트워크 오류

---

## 23. 보안 요구사항

- `OPENAI_API_KEY`는 절대 클라이언트에 노출하지 않는다.
- OpenAI 호출은 반드시 Next.js Route Handler 내부에서만 한다.
- Supabase server client와 browser client를 분리한다.
- 사용자가 다른 사용자의 `assistantId`로 접근하면 403 또는 404를 반환한다.
- Supabase RLS를 활성화한다.
- 사용자 입력은 Zod로 검증한다.
- AI 프롬프트에는 비밀키, 내부 환경변수, 민감한 시스템 정보를 포함하지 않는다.
- 실행 로그에 API key나 세션 토큰을 저장하지 않는다.

---

## 24. 환경변수

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=
NEWS_PROVIDER=mock
STOCK_PROVIDER=mock
```

주의:

- `NEXT_PUBLIC_` prefix가 붙은 값만 브라우저에 노출 가능하다.
- `OPENAI_API_KEY`, `SUPABASE_SECRET_KEY`는 서버 전용이다.
- `.env.example` 파일을 반드시 작성한다.

---

## 25. 비기능 요구사항

### 25.1 성능

- 대시보드는 빠르게 로드되어야 한다.
- 비서 목록과 실행 기록은 필요한 만큼만 조회한다.
- AI 실행 중에는 사용자가 상태를 이해할 수 있는 loading UI를 제공한다.
- 동일한 입력에 대한 AI 실행 결과는 향후 캐싱 가능하도록 구조화한다.

### 25.2 안정성

- AI 호출 실패 시 앱이 크래시 나지 않아야 한다.
- provider 실패와 AI 실패를 구분할 수 있어야 한다.
- Supabase 연결 실패 시 사용자 친화적 에러 메시지를 제공한다.
- 출력 schema validation 실패 시 failed run으로 기록한다.

### 25.3 접근성

- 버튼에는 접근 가능한 이름을 제공한다.
- 카드 클릭 영역과 버튼 클릭 영역을 명확히 분리한다.
- 색상만으로 상태를 구분하지 않는다.
- 키보드 탐색 가능한 모달을 구현한다.

### 25.4 컴플라이언스 / 포지셔닝

이 제품은 정보 요약 도구입니다.

특히 주식 비서는 다음처럼 포지셔닝해서는 안 됩니다.

- 투자 자문 서비스
- 매수/매도 추천 서비스
- 수익 보장형 서비스
- 금융 전문가 대체 서비스

---

## 26. KPI

### 제품 사용

- 회원가입 전환율
- 첫 비서 추가율
- 비서 실행률
- 주간 활성 사용자 수
- 평균 비서 보유 수

### 기능별

- 뉴스 비서 실행 수
- 주식 비서 실행 수
- 실행 성공률
- AI 응답 실패율
- 비서 삭제율

### 포트폴리오 관점

- README 이해도
- 로컬 실행 성공 여부
- 배포 URL 정상 동작
- GitHub 코드 구조 명확성
- 면접에서 설명 가능한 아키텍처 포인트

---

## 27. 완료 기준(Definition of Done)

기능은 다음을 모두 만족해야 완료입니다.

- UI가 실제로 동작한다.
- 데이터가 Supabase에 저장된다.
- 인증된 사용자만 접근 가능하다.
- 본인 데이터만 읽고 쓸 수 있다.
- 로딩/에러/빈 상태가 있다.
- 입력 검증이 있다.
- TypeScript 타입이 명확하다.
- AI API key가 클라이언트에 노출되지 않는다.
- AI 결과가 Zod schema로 검증된다.
- 주요 비즈니스 로직이 UI 컴포넌트 밖에 있다.
- README가 갱신되어 있다.

---

## 28. Codex 구현 순서

### Step 1 — 프로젝트 초기화

작업:

- Next.js App Router 프로젝트 생성
- TypeScript 설정
- Tailwind CSS 설정
- 기본 ESLint/Prettier 설정
- 경로 alias 설정
- 기본 레이아웃 구성

완료 기준:

- 로컬에서 앱이 실행된다.
- 랜딩 페이지가 표시된다.
- 기본 스타일 시스템이 적용된다.

---

### Step 2 — Supabase Auth 세팅

작업:

- Supabase client 구성
- server client 구성
- middleware 구성
- 로그인 페이지 구현
- 로그아웃 구현
- 보호 라우트 처리

완료 기준:

- 사용자가 로그인할 수 있다.
- 로그인 후 `/dashboard`로 이동한다.
- 비로그인 사용자는 보호 페이지 접근 시 `/login`으로 이동한다.

---

### Step 3 — DB schema 및 seed

작업:

- `assistant_templates` 생성
- `user_assistants` 생성
- `assistant_runs` 생성
- `assistant_sources` 생성
- RLS 정책 적용
- 뉴스/주식 템플릿 seed 추가

완료 기준:

- Supabase에서 테이블이 생성된다.
- seed 템플릿 2개가 조회된다.
- RLS가 활성화되어 있다.

---

### Step 4 — 비서 목록/추가/삭제

작업:

- `/api/assistants/templates` 구현
- `/api/assistants` GET/POST 구현
- `/api/assistants/[assistantId]` GET/PATCH/DELETE 구현
- 대시보드 비서 목록 UI 구현
- 비서 추가 모달 구현
- 삭제 확인 모달 구현

완료 기준:

- 사용자가 비서를 추가할 수 있다.
- 사용자가 자신의 비서만 볼 수 있다.
- 사용자가 비서를 삭제할 수 있다.

---

### Step 5 — AI runner와 mock provider

작업:

- AI client 파일 생성
- `generateStructured` 생성
- `NewsBriefSchema` 구현
- `StockBriefSchema` 구현
- mock news provider 구현
- mock stock provider 구현
- `runNewsAssistant` 구현
- `runStockAssistant` 구현

완료 기준:

- OpenAI API 연결 전에도 mock provider 기반 구조가 동작한다.
- runner 단위 테스트가 가능하다.

---

### Step 6 — 비서 실행 API

작업:

- `/api/assistants/[assistantId]/run` 구현
- 실행 전 pending run 저장
- 성공 시 output 저장
- 실패 시 error 저장
- 소유권 검증

완료 기준:

- 뉴스 비서를 실행하면 run이 저장된다.
- 주식 비서를 실행하면 run이 저장된다.
- 실패해도 실행 기록이 남는다.

---

### Step 7 — 결과 UI 구현

작업:

- `AssistantResultRenderer` 구현
- `NewsAssistantResult` 구현
- `StockAssistantResult` 구현
- `AssistantRunHistory` 구현
- 비서 상세 페이지 구현

완료 기준:

- 뉴스 결과가 뉴스 카드 UI로 보인다.
- 주식 결과가 종목 카드 UI로 보인다.
- 최근 실행 기록을 확인할 수 있다.

---

### Step 8 — 반응형 및 디자인 완성

작업:

- 모바일/태블릿/데스크탑 레이아웃 조정
- 도트형 비서 아바타 구현
- EmptyState/LoadingState/ErrorState 개선
- 랜딩 페이지 완성

완료 기준:

- 모바일에서 깨지지 않는다.
- 데스크탑에서 포트폴리오로 보기 좋은 완성도가 있다.
- 도트형 브랜딩이 적용되어 있다.

---

### Step 9 — 문서화 및 검증

작업:

- README 작성
- `.env.example` 작성
- 로컬 실행 방법 문서화
- DB schema 적용 방법 문서화
- AI 구조 설명 추가
- lint/typecheck/test 실행

완료 기준:

- README만 보고 로컬 실행 가능하다.
- 주요 구현 포인트가 문서화되어 있다.
- 검증 명령 결과가 기록되어 있다.

---

## 29. README 필수 내용

README에는 아래 내용을 포함합니다.

- 프로젝트 소개
- 주요 기능
- 기술 스택
- 화면 구성
- AI 비서 실행 구조
- DB schema
- RLS 설명
- 환경변수
- 로컬 실행 방법
- 개발 단계
- MVP 범위
- 향후 확장 계획

---

## 30. 첫 Codex 프롬프트

Codex에 아래 초기 프롬프트를 사용할 수 있습니다.

```text
Build a production-ready Next.js TypeScript application called "Pixel Agents".

Pixel Agents is a responsive web dashboard where authenticated users can add and run purpose-specific AI assistants.

Use:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- OpenAI API or compatible LLM provider
- Zod

Core MVP:
1. Landing page
2. Login page
3. Protected dashboard
4. User assistant list
5. Add assistant modal
6. Two assistant templates:
   - News briefing assistant
   - Stock briefing assistant
7. Run assistant API
8. Store assistant run history
9. Render different result UIs per assistant type
10. Responsive layout
11. Pixel-style assistant avatars

Important architecture:
- Do not call OpenAI from the client.
- Use Next.js Route Handlers for server-side assistant execution.
- Use `/api/assistants/[assistantId]/run` to execute assistants.
- Use assistant runner functions:
  - `runNewsAssistant`
  - `runStockAssistant`
- Use Zod schemas for structured AI output validation.
- Use mock providers first for news and stock data.
- Keep providers replaceable with real APIs later.
- Store assistant runs in Supabase.
- Apply RLS to all user-owned tables.

Implement clean, modular files.
Prioritize a working MVP over excessive abstraction.
Add clear loading, empty, and error states.
Make the UI portfolio-quality and responsive.
Document setup instructions in README.
```

---

## 31. 향후 확장 아이디어

- 일정 정리 AI
- 메일 요약 AI
- 학습 비서
- 쇼핑 비교 비서
- 비서 마켓/갤러리
- 커스텀 프롬프트 비서 생성
- 비서별 예약 실행
- 결과 공유 링크
- 웹 검색 provider 정식 연동
- 실제 주식 API provider 연동
- 실행 비용 추적
- 비서 실행 캐싱
- 프리미엄 비서 템플릿

---

## 32. 최종 MVP 정의

MVP는 다음이 가능할 때 완료입니다.

- 사용자가 로그인할 수 있다.
- 사용자가 대시보드에 접근할 수 있다.
- 사용자가 뉴스 비서를 추가할 수 있다.
- 사용자가 주식 비서를 추가할 수 있다.
- 사용자가 비서를 삭제할 수 있다.
- 뉴스 비서를 실행하면 구조화된 뉴스 브리핑이 표시된다.
- 주식 비서를 실행하면 구조화된 주식 브리핑이 표시된다.
- 실행 기록이 Supabase에 저장된다.
- 비서별 결과 UI가 다르게 렌더링된다.
- AI API key가 클라이언트에 노출되지 않는다.
- 모바일과 데스크탑에서 UI가 깨지지 않는다.
- README와 `.env.example`이 준비되어 있다.
