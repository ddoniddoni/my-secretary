# Step 01 프로젝트 초기 세팅

## 목표

이후 인증, 데이터, 비서 기능을 앱 셸 재작업 없이 추가할 수 있도록 My SECRETARY의 실전형 프로젝트 기반을 마련합니다.

## 가정

- 현재 저장소는 아직 기본 Next.js 스타터 상태에 가깝습니다.
- 구현 전 최신 `develop`에서 `step/01-project-bootstrap` 브랜치를 새로 생성해 작업합니다.
- 초기 범위는 앱 구조, 공용 UI 기반, 랜딩 페이지 방향, 반복 개발에 필요한 검증 스크립트로 제한합니다.
- Supabase, AI runner, 비서 CRUD는 이후 step으로 의도적으로 미룹니다.

## 범위

- 다음 step에 도움이 되는 범위에서 `AGENTS.md`에 정의된 기본 디렉터리 구조를 추가합니다.
- 깔끔한 SaaS 대시보드 방향의 스타일 기반을 설정합니다.
- 플레이스홀더 홈 화면을 PRD에 맞는 랜딩 페이지로 교체합니다.
- Step 01에 필요한 범위 안에서만 재사용 가능한 레이아웃과 기초 UI 프리미티브를 추가합니다.
- step 검증 흐름에 필요하다면 `typecheck` 같은 누락된 프로젝트 스크립트를 추가합니다.
- 이후 Supabase 인증과 보호 대시보드 작업과 호환되도록 구현합니다.

## 범위 제외

- Supabase 인증과 세션 처리
- DB 스키마, RLS, seed 데이터
- 비서 CRUD API
- AI 실행, provider, 구조화 출력 schema
- 보호 대시보드 비즈니스 로직

## 구현 단계

1. 현재 앱 셸, 스타일, 의존성, 스크립트 구성을 점검합니다.
2. Step 01 브랜치와 커밋 전략을 정리합니다.
   - 브랜치: `step/01-project-bootstrap`
   - 첫 기획 커밋 예시: `docs(planning): add step 01 bootstrap plan`
   - 구현 커밋 예시:
     - `chore(repo): add project bootstrap structure`
     - `feat(landing): build step 01 landing experience`
3. 이후 사용될 `components`, `lib`, `types`, 관련 app route의 기본 폴더 구조를 추가합니다.
4. 핵심 비주얼 시스템을 도입합니다.
   - global CSS 변수
   - 타이포그래피 방향
   - spacing, radius, color 토큰
   - 공용 container, surface 패턴
5. 랜딩 페이지를 제품 서사에 맞게 다시 구성합니다.
   - hero
   - 비서 미리보기 섹션
   - 가치 제안 섹션
   - 로그인 CTA
   - 반응형 동작
6. 랜딩 페이지와 이후 대시보드 작업에 필요한 최소한의 공용 레이아웃/공용 컴포넌트를 준비합니다.
7. 검증에 필요한 프로젝트 스크립트를 추가하거나 정리합니다. 특히 `typecheck`를 우선 확인합니다.
8. 이 step에서 사용할 수 있는 검증 명령을 실행하고, 부족한 점이 있으면 기록합니다.

## 리스크

- 공용 토큰을 너무 늦게 잡으면 스타일이 페이지별 일회성 코드로 흘러갈 수 있습니다.
- Step 01에서 대시보드 셸을 과하게 만들면 인증 step 속도가 느려지고 죽은 코드가 생길 수 있습니다.
- 초기에 의존성을 너무 많이 추가하면 아키텍처가 검증되기 전에 잡음이 커질 수 있습니다.
- 로컬에 커밋되지 않은 변경이 이미 랜딩 페이지와 겹칠 수 있으므로 주의가 필요합니다.

## 검증

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- 로컬 개발 환경에서 랜딩 페이지가 정상 렌더링되는지 확인합니다.
- 새 구조가 Step 02 인증 통합에 충분히 단순한지 확인합니다.

## 결과물

- `docs/execplans/step-01-project-bootstrap.md`
- `docs/steps/bootstrap-step-01-project-bootstrap.md`
- 업데이트된 프로젝트 구조와 랜딩 페이지 구현
- 필요 시 커밋/PR 요약 또는 후속 문서에 남긴 검증 메모
