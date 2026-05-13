# Step 02 인증

## 목표

사용자가 안전하게 로그인하고, 서버에서 읽을 수 있는 세션을 유지하며, 보호된 대시보드 라우트에 접근할 수 있도록 My SECRETARY에 Supabase 기반 인증을 추가합니다.

## 가정

- Step 01은 이미 `develop`에 머지되어 있고, Step 02는 새로운 `step/02-auth` 브랜치에서 시작합니다.
- 이 step은 현재 공식 Next.js App Router 가이드를 따라 cookie 기반 세션의 Supabase SSR 유틸리티를 사용합니다.
- 이 step의 MVP 인증 흐름은 이메일 매직 링크만으로 충분하며, 추가 OAuth provider는 이후 구조 변경 없이 확장할 수 있습니다.
- 모든 로컬 환경에 실제 Supabase 프로젝트가 연결되어 있지는 않을 수 있으므로, 필수 환경 변수가 없으면 UI에서 명확히 드러나야 합니다.

## 범위

- browser, server, proxy 용 Supabase 클라이언트 패키지를 설치하고 설정합니다.
- `src/lib/supabase` 아래 재사용 가능한 Supabase 인증 유틸리티를 추가합니다.
- 이메일 매직 링크 제출과 pending/success/error 상태가 있는 로그인 페이지를 구현합니다.
- 인증 코드를 cookie 기반 세션으로 교환하는 콜백 라우트를 구현합니다.
- `/dashboard`와 `/assistants/[assistantId]` 라우트를 보호합니다.
- 로그인 상태에 따른 헤더와 로그아웃 액션을 추가합니다.
- 로컬 개발에 필요한 인증 환경 변수와 설정 메모를 문서화합니다.
- 이 step에서 현실적인 범위 안에서 인증 관련 검증/헬퍼 테스트를 추가합니다.

## 범위 제외

- DB 스키마, RLS 정책, 비서 소유권 조회
- 비서 CRUD 또는 실행 API
- 확장성을 위한 여지만 남기고, 실제 OAuth provider 구성은 제외
- Supabase service role 사용
- 운영 수준의 프로필 관리 UI

## 구현 단계

1. 인증 의존성과 Step 02 검증에 필요한 테스트 도구를 추가합니다.
2. Supabase 환경 변수 및 클라이언트 헬퍼를 작성합니다.
   - browser client
   - server client
   - proxy session refresh helper
   - 라우트 가드와 리다이렉트 처리용 소형 auth 유틸리티
3. 세션 갱신과 보호 라우트 리다이렉트를 위한 `proxy.ts`를 추가합니다.
4. `/login`을 실제 인증 페이지로 재구성합니다.
   - email input
   - magic link submit action
   - loading, success, failure 메시지
5. `/auth/callback`을 추가해 반환된 인증 코드를 세션으로 교환하고 안전하게 리다이렉트합니다.
6. 공용 navigation/header를 로그인 전후 상태에 맞게 업데이트하고 로그아웃을 제공합니다.
7. 보호 페이지는 서버에서 가드하고, 로그인한 사용자는 로그인 페이지에 머무르지 않도록 리다이렉트합니다.
8. 문서와 환경 변수 예시를 업데이트한 뒤 lint, typecheck, test를 실행합니다.

## 리스크

- Supabase SSR 가이드는 여전히 `@supabase/ssr` 패키지에 의존하며 문서상 unstable로 다뤄지므로, 구현을 얇고 분리된 형태로 유지해야 합니다.
- Supabase에 로컬 또는 배포 환경의 리다이렉트 URL이 설정되지 않으면 인증 리다이렉트가 깨질 수 있습니다.
- 콜백 흐름을 잘못 처리하면 로그인 직후 route prefetch 때문에 비로그인 화면이 잠깐 보일 수 있습니다.
- 필수 환경 변수가 없을 때 로그인 UI에서 명확히 드러나지 않으면 런타임 실패가 혼란스럽게 느껴질 수 있습니다.

## 검증

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- 수동 확인:
  - 비로그인 상태에서 `/dashboard` 접근 시 `/login`으로 이동
  - 로그인 상태에서 `/login` 접근 시 `/dashboard`로 이동
  - 로그아웃 후 비로그인 상태로 복귀
  - auth callback이 누락되거나 잘못된 코드를 안전하게 처리

## 결과물

- `docs/execplans/step-02-auth.md`
- `docs/steps/bootstrap-step-02-auth.md`
- `src/lib/supabase` 아래의 Supabase 인증 기반
- 로그인, 콜백, 로그아웃, 보호 라우트 흐름
- 업데이트된 인증 설정 문서
