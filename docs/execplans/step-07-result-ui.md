# Step 07 결과 UI

## 목표

로그인한 사용자가 비서를 열고, UI에서 직접 실행하며, 최근 뉴스/주식 결과를 범용 채팅 로그가 아니라 비서 타입별 레이아웃으로 확인할 수 있는 상세 경험을 추가합니다.

## 가정

- Step 06은 이미 `develop`에 머지되어 있습니다.
- `POST /api/assistants/[assistantId]/run`은 이미 `assistant_runs`와 `assistant_sources`를 저장합니다.
- 첫 상세 페이지는 기존 repository 헬퍼가 제공하는 최근 10개 run에 의존해도 충분합니다.
- 결과 렌더링은 검증된 `assistant_runs.output` payload를 우선 신뢰합니다.

## 범위

- Step 07 기획 문서와 부트스트랩 문서를 추가합니다.
- 보호된 `/assistants/[assistantId]` 상세 페이지를 추가합니다.
- run API를 호출하고 UI를 갱신하는 재사용 가능한 실행 버튼 클라이언트 컴포넌트를 추가합니다.
- `news`, `stock` 결과 렌더러 컴포넌트를 추가합니다.
- loading, empty, success, failed 상태를 포함한 비서 실행 기록 UI를 추가합니다.
- 사용자가 상세 페이지를 열고 실행을 시작할 수 있도록 대시보드 카드를 갱신합니다.
- 결과 파싱과 실행 기록 요약을 위한 집중 테스트를 추가합니다.
- 결과 UI 구현 상태를 README에 반영합니다.

## 범위 제외

- 실제 provider 연동
- 기존 최근 10개 제한을 넘는 페이지네이션
- 전체 대시보드 단위의 다중 비서 activity feed
- 템플릿 자체 수정 기능

## 구현 단계

1. Step 07 기획 문서와 부트스트랩 문서를 추가합니다.
2. 비서 실행 결과 파싱과 표시용 헬퍼를 추가합니다.
3. 뉴스/주식 전용 결과 컴포넌트를 구현합니다.
4. 재사용 가능한 실행 기록 컴포넌트와 실행 버튼 컴포넌트를 구현합니다.
5. 요약, 최신 결과, 실행 기록, 설정 편집기를 포함한 `/assistants/[assistantId]` 페이지를 구현합니다.
6. 대시보드 카드를 상세 페이지 진입 및 실행 흐름과 연결합니다.
7. 테스트와 README를 갱신하고 lint, typecheck, test를 실행합니다.

## 리스크

- 이후 schema가 바뀌면 저장된 실행 출력이 더 이상 유효하지 않을 수 있으므로, UI에 안전한 fallback이 필요합니다.
- 대시보드는 이미 강한 비주얼 시스템을 가지고 있으므로, 상세 페이지도 별도 스타일 언어를 만들기보다 이를 확장해야 합니다.
- 대시보드와 상세 페이지 양쪽에서 실행할 수 있으면 성공/실패 피드백 위치가 분명하지 않을 때 혼란스러울 수 있습니다.

## 검증

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- 수동 검토:
  - 인증된 소유자로 `/assistants/[assistantId]` 열기
  - 상세 페이지에서 비서 실행하기
  - 뉴스와 주식 결과가 다르게 렌더링되는지 확인
  - empty, failed, successful run 상태 확인

## 결과물

- `docs/execplans/step-07-result-ui.md`
- `docs/steps/bootstrap-step-07-result-ui.md`
- 비서 상세 페이지 route
- 결과 렌더러와 실행 기록 컴포넌트
- 재사용 가능한 실행 버튼 컴포넌트
- 결과 파싱 및 요약 테스트
