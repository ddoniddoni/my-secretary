# 부트스트랩 Step 06 실행 API

## 요약

이 step은 저장된 비서 레코드를 공개 서버 실행 액션과 연결합니다. 인증된 실행 엔드포인트를 추가하고, pending 및 완료된 실행 기록을 저장하며, 다음 step에서 저장된 결과를 렌더링할 수 있도록 source 메타데이터도 함께 보관합니다.

## 브랜치 계획

- 최신 `develop`에서 시작
- 브랜치 생성: `step/06-execution-api`
- 이 step은 실행 기록 저장과 공개 실행 라우트에 집중
- `step/07-result-ui`를 시작하기 전에 이 브랜치를 `develop`으로 머지

## 커밋 정책

`AGENTS.md`의 Conventional Commits 규칙을 사용합니다.

이 step에서 권장하는 커밋 예시:

- `docs(planning): add step 06 execution api plan`
- `feat(assistants): persist assistant run lifecycle`
- `feat(api): add assistant run route`
- `test(api): cover assistant execution flow`

## 예정 작업

- `docs/execplans/step-06-execution-api.md` 작성
- `docs/steps` 아래에 이 부트스트랩 문서 작성
- 비서 실행 및 source 저장용 repository 헬퍼 추가
- 조회, runner 실행, 실패 처리를 묶는 execution service 추가
- `POST /api/assistants/[assistantId]/run` 구현
- 성공, 실패, not-found 테스트 추가
- 현재 step 상태를 README에 반영

## 작업 메모

- Route Handler는 얇게 유지하고 실행 오케스트레이션은 `src/lib/assistants`로 이동합니다.
- 실행 기록이 남도록 AI 호출 전에 pending run을 먼저 생성합니다.
- 사용자에게 보여줄 안전한 실패 메시지는 `assistant_runs.error_message`에 저장합니다.
- source row 삽입 이후 최종 완료 처리에 실패하면 관련 source 정리도 함께 수행합니다.

## 종료 기준

- 인증된 사용자가 실행 API를 통해 자신의 비서를 실행할 수 있습니다.
- 모든 실행은 pending run을 만든 뒤 `success` 또는 `failed`로 끝납니다.
- 성공한 실행은 `assistant_sources`에 source 메타데이터를 저장합니다.
- 클라이언트에는 안전한 실패 응답만 노출하고, 상세 오류는 서버 로그에 남깁니다.
- `lint`, `typecheck`, `test`가 통과하거나, 막히는 이유가 문서로 명확히 남아 있습니다.

## 다음 Step

이 step이 머지되면 비서 전용 결과 컴포넌트, 실행 기록 렌더링, 상세 페이지 실행 UX를 위해 `step/07-result-ui`로 진행합니다.
