# Provider 구성

## 현재 지원 Provider

- `news`
  - source: `src/mocks/news.ts`
  - adapter: `src/lib/providers/news.ts`
  - provider: `mock`, `newsapi`
- `stock`
  - source: `src/mocks/stocks.ts`
  - adapter: `src/lib/providers/stock.ts`
  - provider: `mock`, `alphavantage`
- `baseball`
  - source: `src/mocks/baseball.ts`
  - adapter: `src/lib/providers/baseball.ts`
  - provider: `mock`, `kbo`
- `real_estate`
  - source: `src/mocks/real-estate.ts`
  - adapter: `src/lib/providers/real-estate.ts`
  - provider: `mock`, `molit`

## 환경 변수

- `NEWS_PROVIDER=mock | newsapi`
- `NEWSAPI_API_KEY=...`
- `STOCK_PROVIDER=mock | alphavantage`
- `ALPHA_VANTAGE_API_KEY=...`
- `BASEBALL_PROVIDER=mock | kbo`
- `REAL_ESTATE_PROVIDER=mock | molit`
- `MOLIT_API_KEY=...`

## 목적

- 실제 API가 없어도 실행 흐름이 동작하도록 기본 mock provider를 유지합니다.
- source metadata를 공통 형태로 보존해 runner와 UI를 고정합니다.
- provider 구현만 교체해도 결과 UI와 실행 파이프라인은 그대로 유지되도록 설계합니다.

## Real Estate Note

- `REAL_ESTATE_PROVIDER=molit`는 국토교통부 실거래가 OpenAPI를 사용합니다.
- 현재는 내부 매핑 가능한 지역명 또는 5자리 `LAWD_CD` 입력을 우선 지원합니다.
- 공급 시그널은 실거래 건수와 거래된 단지 수를 바탕으로 한 보수적 요약입니다.
## Baseball Note

- `BASEBALL_PROVIDER=kbo` uses official KBO standings, daily schedule, breaking news, and leader pages.
- No extra API key is required for the current KBO adapter.
- When an exact team news match is unavailable, the adapter falls back to standings and schedule context.
