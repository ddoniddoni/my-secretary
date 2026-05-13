# Step 05 AI 러너

## 목표

저장된 비서와 provider 데이터를 받아 뉴스/주식 브리핑용 구조화 응답을 검증된 형태로 생성하는 서버 사이드 AI runner 기반을 추가합니다.

## 가정

- Step 04는 이미 `develop`에 머지되어 있습니다.
- 대상 환경에는 Step 03 Supabase 스키마가 이미 적용되어 있습니다.
- Step 05는 공개 실행 API route가 아니라 라이브러리, schema, mock, orchestration에 집중합니다.
- MVP provider는 뉴스와 주식 모두 mock 구현을 유지합니다.

## 범위

- 서버 전용 AI 환경 변수 파싱과 최소한의 OpenAI 호환 JSON 클라이언트를 추가합니다.
- 모델 출력에 Zod validation을 적용하는 공용 `generateStructured` 헬퍼를 추가합니다.
- 뉴스/주식 브리핑용 구조화 출력 schema를 추가합니다.
- source 메타데이터를 포함한 뉴스/주식 mock provider를 추가합니다.
- `news`, `stock`용 비서 runner orchestration을 추가합니다.
- 출력 schema 검증과 runner 성공/실패 경로에 대한 집중 테스트를 추가합니다.
- 새로운 실행 요구사항에 맞춰 README와 `.env.example`을 갱신합니다.

## 범위 제외

- `/api/assistants/[assistantId]/run` Route Handler
- `assistant_runs`, `assistant_sources` 저장
- 완료된 실행의 결과 UI 렌더링
- mock 이외의 실제 provider 연동

## 구현 단계

1. Step 05 기획 문서와 부트스트랩 문서를 추가합니다.
2. AI 환경 변수 파싱과 요청 오류 헬퍼를 만듭니다.
3. JSON 응답 중심의 최소 OpenAI 호환 클라이언트를 추가합니다.
4. 프롬프트 조합과 Zod 검증을 포함한 `generateStructured`를 추가합니다.
5. 뉴스/주식 provider 인터페이스와 mock 데이터 소스를 추가합니다.
6. 뉴스/주식 구조화 출력 schema를 추가합니다.
7. 입력, 출력, provider 메타데이터, source 메타데이터를 반환하는 비서 runner orchestration을 구현합니다.
8. schema validation, disclaimer 강제, runner 성공/실패 동작 테스트를 추가합니다.
9. `.env.example`과 README를 갱신한 뒤 lint, typecheck, test를 실행합니다.

## 리스크

- OpenAI 호환 provider마다 응답 shape이 조금씩 다를 수 있으므로 JSON 파싱 경로에 보수적인 가드가 필요합니다.
- 프롬프트 지시가 약하면 provider 데이터가 유효해도 schema validation 실패가 늘어날 수 있습니다.
- mock 모드에서 알 수 없는 주식 심볼이 들어와도 로컬 테스트가 계속 유용하도록 자연스러운 fallback이 필요합니다.

## 검증

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- 수동 검토:
  - AI 환경 변수가 없을 때 명확한 서버 오류가 발생하는지 확인
  - 뉴스 runner가 검증된 구조화 데이터를 반환하는지 확인
  - 주식 runner가 필수 disclaimer를 항상 포함하는지 확인
  - mock provider가 이후 `assistant_sources`에 저장할 수 있는 source 메타데이터를 포함하는지 확인

## 결과물

- `docs/execplans/step-05-ai-runner.md`
- `docs/steps/bootstrap-step-05-ai-runner.md`
- AI 클라이언트와 구조화 생성 유틸리티
- 뉴스/주식 mock provider
- 뉴스/주식 출력 schema
- 테스트를 포함한 비서 runner orchestration
