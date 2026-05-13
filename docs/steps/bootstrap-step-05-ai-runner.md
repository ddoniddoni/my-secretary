# 부트스트랩 Step 05 AI 러너

## 요약

이 step은 비서 레코드를 실제로 실행 가능한 서버 사이드 워크플로로 바꿉니다. AI 클라이언트 경계, mock 데이터 provider, 구조화 응답 검증을 도입해 다음 step에서 API 저장과 실행 기록에 집중할 수 있게 만듭니다.

## 브랜치 계획

- 최신 `develop`에서 시작
- 브랜치 생성: `step/05-ai-runner`
- 이 step은 AI 오케스트레이션과 검증 기반에 집중
- `step/06-run-api`를 시작하기 전에 이 브랜치를 `develop`으로 머지

## 커밋 정책

`AGENTS.md`의 Conventional Commits 규칙을 사용합니다.

이 step에서 권장하는 커밋 예시:

- `docs(planning): add step 05 ai runner plan`
- `feat(ai): add structured generation client`
- `feat(providers): add mock news and stock providers`
- `feat(assistants): add assistant runner orchestration`
- `test(ai): cover structured outputs and runners`

## 예정 작업

- `docs/execplans/step-05-ai-runner.md` 작성
- `docs/steps` 아래에 이 부트스트랩 문서 작성
- AI 환경 변수 헬퍼와 OpenAI 호환 JSON 클라이언트 추가
- Zod 검증을 포함한 `generateStructured` 헬퍼 추가
- mock provider와 seed 데이터 어댑터 추가
- 뉴스/주식 출력 schema 추가
- 뉴스/주식 runner와 공용 dispatcher 추가
- schema validation 및 runner 결과 테스트 추가

## 작업 메모

- 모든 AI 호출은 서버 사이드에서만 처리합니다.
- source 메타데이터의 기준값은 provider 데이터로 간주합니다.
- Step 05는 외부 데이터 서비스 없이도 실행 가능해야 하므로 기본 provider는 mock으로 둡니다.
- runner 출력 형태는 Step 06에서 `assistant_runs`와 `assistant_sources`에 바로 저장할 수 있도록 설계합니다.

## 종료 기준

- 뉴스와 주식 비서를 라이브러리 코드 수준에서 의존성 주입과 함께 실행할 수 있습니다.
- 구조화된 AI 출력이 반환 전에 Zod로 검증됩니다.
- 주식 출력에는 필수 disclaimer 문구가 강제됩니다.
- mock provider가 source 메타데이터를 일관되게 반환합니다.
- `lint`, `typecheck`, `test`가 통과하거나, 막히는 이유가 문서로 명확히 남아 있습니다.

## 다음 Step

이 step이 머지되면 pending/success/failed 저장, 소유권 검증, 공개 실행 엔드포인트를 위해 `step/06-run-api`로 진행합니다.
