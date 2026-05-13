# Step 06 실행 API

## 목표

인증된 비서 실행 API를 추가해 pending run을 만들고, 서버에서 저장된 비서를 실행한 뒤, 성공 또는 실패 상태와 source 메타데이터를 저장해 이후 결과 UI에서 활용할 수 있도록 합니다.

## 가정

- Step 05는 이미 `develop`에 머지되어 있습니다.
- Step 03 Supabase 스키마에는 `assistant_runs`와 `assistant_sources`가 포함되어 있고 이미 적용되어 있습니다.
- 이 step의 공개 실행 표면은 `POST /api/assistants/[assistantId]/run`입니다.
- MVP에서는 provider가 여전히 mock 기반이지만, 저장 흐름은 mock 전용 동작에 의존하지 않아야 합니다.

## 범위

- Step 06 기획 문서와 부트스트랩 문서를 추가합니다.
- 비서 실행 기록 생성/수정용 repository 헬퍼를 추가합니다.
- source 삽입과 정리용 repository 헬퍼를 추가합니다.
- 비서 조회, 템플릿 조회, runner 호출, 실패 처리를 담당하는 execution service를 추가합니다.
- 인증 및 소유권 검증이 포함된 `POST /api/assistants/[assistantId]/run`을 추가합니다.
- 성공, 실패, not-found 실행 경로 테스트를 추가합니다.
- 이제 run API가 구현되었음을 README에 반영합니다.

## 범위 제외

- 비서 결과 UI 컴포넌트
- 비서 상세 페이지 실행 버튼 연결
- 긴 실행 기록의 페이지네이션/필터링
- 실제 뉴스/주식 provider 연동

## 구현 단계

1. Step 06 기획 문서와 부트스트랩 문서를 추가합니다.
2. pending, success, failed run 저장을 위한 repository 헬퍼를 확장합니다.
3. `assistant_sources` 저장 헬퍼를 추가합니다.
4. 아래 흐름을 담당하는 execution service를 추가합니다.
   - 비서 소유권 검증
   - 대응하는 템플릿 조회
   - pending run 생성
   - runner 실행
   - source 저장
   - 실행 상태를 `success` 또는 `failed`로 마무리
5. `POST /api/assistants/[assistantId]/run`을 추가합니다.
6. 실행 순서, 실패 저장, 404 처리 테스트를 추가합니다.
7. README 상태 문구를 갱신하고 lint, typecheck, test를 실행합니다.

## 리스크

- Supabase 쓰기는 여러 호출에 걸쳐 트랜잭션이 아니므로, source 저장과 run 업데이트에는 보수적인 정리 로직이 필요합니다.
- 기존 비서의 템플릿 조회는 비활성 템플릿도 허용해야, 템플릿 비활성화 이후에도 예전 비서를 실행할 수 있습니다.
- AI validation 또는 provider 실패가 나더라도 사용자에게 읽을 수 있는 failed run 기록은 남아야 합니다.

## 검증

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- 수동 검토:
  - `POST /api/assistants/[assistantId]/run`이 성공 시 201과 저장된 run을 반환하는지 확인
  - 존재하지 않거나 다른 사용자의 비서는 404를 반환하는지 확인
  - runner 실패 시 `assistant_runs.status`가 `failed`로 업데이트되는지 확인
  - 성공한 실행이 `assistant_sources`를 저장하는지 확인

## 결과물

- `docs/execplans/step-06-execution-api.md`
- `docs/steps/bootstrap-step-06-execution-api.md`
- 비서 repository의 실행 저장 헬퍼
- 비서 실행 service
- `POST /api/assistants/[assistantId]/run`
- 실행 성공/실패 흐름 테스트
