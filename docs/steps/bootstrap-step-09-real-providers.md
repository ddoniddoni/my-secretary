# 부트스트랩 Step 09 실데이터 Provider 확장

## 요약

이 step은 MVP의 안정적인 `mock` 기반을 유지한 채, 뉴스와 주식 비서에 선택적 실데이터 provider를 연결하는 첫 확장 단계입니다. 핵심은 UI나 runner를 다시 쓰지 않고도 provider 구현만 교체할 수 있게 만드는 것입니다.

## 브랜치 계획

- 최신 `develop`에서 시작
- 브랜치 생성: `step/09-real-providers`
- 이 step은 뉴스/주식 provider 확장, 환경 변수, 오류 처리, 문서화에 집중
- 다음 step을 시작하기 전에 이 브랜치를 `develop`으로 머지

## 커밋 정책

`AGENTS.md`의 Conventional Commits 규칙을 사용합니다.

이 step에서 권장하는 커밋 예시:

- `docs(planning): add step 09 real providers plan`
- `feat(providers): add newsapi provider adapter`
- `feat(providers): add alphavantage stock adapter`
- `test(providers): cover provider normalization`
- `docs(readme): document real provider setup`

## 예정 작업

- `docs/execplans/step-09-real-providers.md` 작성
- `docs/steps` 아래에 이 부트스트랩 문서 작성
- 뉴스/주식 provider 선택 규칙 정리
- `newsapi`, `alphavantage` adapter 구현
- provider 오류 메시지와 환경 변수 검증 추가
- `.env.example`, README, provider 문서 갱신
- 정규화와 실패 경로 테스트 추가

## 작업 메모

- 기본 provider는 계속 `mock`으로 유지합니다.
- key가 없다고 자동으로 mock으로 내려가지 않고, 설정 오류를 명확하게 보여줍니다.
- runner와 UI는 provider 구현 세부사항을 몰라도 되도록 공통 결과 타입을 유지합니다.
- 비공식 주식 API는 추가하지 않습니다.

## 종료 기준

- `NEWS_PROVIDER=newsapi`와 `STOCK_PROVIDER=alphavantage`를 선택할 수 있습니다.
- API key 누락 또는 provider 응답 오류가 명확한 서버 오류로 드러납니다.
- `mock` provider 기본 동작이 깨지지 않습니다.
- README와 `.env.example`이 실제 설정 흐름을 설명합니다.
- `lint`, `typecheck`, `test`가 통과하거나, 막히는 이유가 문서로 명확히 남아 있습니다.

## 다음 Step

이 step이 머지되면 야구/부동산 실데이터 provider 확장, provider 캐싱, 또는 배포 환경 고도화 중 우선순위가 높은 방향으로 이어갈 수 있습니다.
