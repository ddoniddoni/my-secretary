# Step 09 실데이터 Provider 확장

## 목표

기본 `mock` 흐름은 유지하면서, 뉴스와 주식 비서가 선택적으로 실제 외부 데이터 provider를 사용할 수 있도록 provider 계층을 확장합니다.

## 가정

- Step 08은 이미 `develop`에 머지되었고, 이 작업은 `step/09-real-providers` 브랜치에서 시작합니다.
- 현재 제품은 뉴스와 주식 비서만 실데이터 provider 확장의 우선 대상입니다.
- 실제 API key가 없는 로컬 환경에서도 앱은 계속 동작해야 하므로 기본 provider는 여전히 `mock`입니다.
- Yahoo Finance 같은 비공식 provider는 피하고, 공식 문서가 있는 provider만 우선 지원합니다.

## 범위

- `news` provider에 `newsapi` 옵션을 추가합니다.
- `stock` provider에 `alphavantage` 옵션을 추가합니다.
- provider 선택을 위한 환경 변수와 API key 환경 변수를 추가합니다.
- provider 응답을 현재 runner/UI가 기대하는 공통 타입으로 정규화합니다.
- API key 누락, 응답 오류, rate limit 등 provider 실패를 명확한 서버 오류로 처리합니다.
- README, `.env.example`, provider 문서를 현재 지원 범위에 맞게 갱신합니다.
- provider 단위 테스트 또는 변환 로직 테스트를 추가합니다.

## 범위 제외

- 야구/부동산 실데이터 provider
- provider 실패 시 자동 fallback으로 `mock` 데이터 반환
- provider별 캐싱, 재시도, 백오프 전략
- 대시보드 UI에서 provider 선택 토글 제공

## 구현 단계

1. Step 09 실행 계획 문서와 부트스트랩 문서를 작성합니다.
2. 뉴스/주식 provider 선택 규칙과 필요한 환경 변수 형태를 정의합니다.
3. 공통 fetch/에러 처리 유틸리티가 필요하면 `src/lib/providers` 아래에 추가합니다.
4. `newsapi` 기반 뉴스 provider를 구현하고 현재 `NewsProviderResult`로 정규화합니다.
5. `alphavantage` 기반 주식 provider를 구현하고 현재 `StockProviderResult`로 정규화합니다.
6. 기존 `createNewsProvider`, `createStockProvider` 팩토리를 확장해 provider 이름에 따라 구현체를 선택합니다.
7. `.env.example`, README, `docs/mock-providers.md`를 갱신합니다.
8. 테스트를 추가하고 `lint`, `typecheck`, `test`를 실행합니다.

## 리스크

- 외부 provider 응답 shape가 예상과 다르면 runner까지 연쇄적으로 실패할 수 있으므로 정규화 단계 검증이 중요합니다.
- Alpha Vantage 무료 플랜은 호출 제한이 있으므로 개발 환경에서 반복 테스트 시 rate limit에 걸릴 수 있습니다.
- NewsAPI의 카테고리 체계와 현재 앱의 카테고리 체계가 완전히 일치하지 않을 수 있어 매핑 규칙이 필요합니다.

## 검증

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- 수동 검토:
  - `NEWS_PROVIDER=mock` / `STOCK_PROVIDER=mock`에서 기존 동작 유지
  - provider를 `newsapi`, `alphavantage`로 바꿨을 때 key 누락 오류가 명확한지 확인
  - 정규화된 결과가 기존 runner와 호환되는지 확인

## 결과물

- `docs/execplans/step-09-real-providers.md`
- `docs/steps/bootstrap-step-09-real-providers.md`
- 확장된 뉴스/주식 provider 구현
- 업데이트된 환경 변수 예시와 문서
- provider 정규화 및 오류 처리 테스트
