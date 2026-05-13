# 부트스트랩 Step 07 결과 UI

## 요약

이 step은 실행 API를 실제 사용자 경험으로 연결합니다. 저장된 비서를 실행하고, 비서 타입별 레이아웃으로 최근 결과를 보여주며, 실행 기록을 한눈에 읽기 쉽게 만드는 비서 상세 화면이 핵심 결과물입니다.

## 브랜치 계획

- 최신 `develop`에서 시작
- 브랜치 생성: `step/07-result-ui`
- 이 step은 상세 페이지 UX, 결과 렌더링, 실행 기록에 집중
- 최종 마감 step 전에 이 브랜치를 `develop`으로 머지

## 커밋 정책

`AGENTS.md`의 Conventional Commits 규칙을 사용합니다.

이 step에서 권장하는 커밋 예시:

- `docs(planning): add step 07 result ui plan`
- `feat(assistants): add assistant detail result ui`
- `feat(dashboard): link cards to assistant detail view`
- `test(assistants): cover run result presentation helpers`

## 예정 작업

- `docs/execplans/step-07-result-ui.md` 작성
- `docs/steps` 아래에 이 부트스트랩 문서 작성
- 결과 파싱 및 요약 헬퍼 추가
- 비서 상세 페이지와 실행 버튼 UX 추가
- 뉴스/주식 결과 렌더러 컴포넌트 추가
- 실행 기록 UI와 상세 페이지 empty/error 상태 추가
- 대시보드 카드와 README 갱신

## 작업 메모

- 인증된 데이터 조회는 서버 사이드에 두고, 실행 버튼의 클라이언트 동작만 최소한으로 hydrate합니다.
- 범용 JSON 덤프 대신 비서 타입 전용 결과 컴포넌트를 사용합니다.
- 저장된 실행 출력이 기대 schema와 맞지 않아도 안전하게 fallback합니다.
- 상세 화면도 기존 픽셀 대시보드 톤을 유지해 같은 제품 경험처럼 느껴지게 합니다.

## 종료 기준

- 사용자가 저장한 비서별 상세 페이지를 열 수 있습니다.
- 사용자가 UI에서 비서 실행을 직접 시작할 수 있습니다.
- 뉴스와 주식 출력이 명확히 다른 레이아웃으로 렌더링됩니다.
- 실행 기록이 읽기 쉬운 상태와 요약 정보를 보여줍니다.
- `lint`, `typecheck`, `test`가 통과하거나, 막히는 이유가 문서로 명확히 남아 있습니다.

## 다음 Step

이 step이 머지되면 반응형 마감, README 정리, MVP 마무리 품질 개선을 위한 최종 polish step으로 진행합니다.
