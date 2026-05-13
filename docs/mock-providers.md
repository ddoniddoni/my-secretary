# Provider 구성

## 현재 지원 Provider

- `news`
  - 기본 source: `src/mocks/news.ts`
  - adapter: `src/lib/providers/news.ts`
  - 지원 provider: `mock`, `newsapi`
- `stock`
  - 기본 source: `src/mocks/stocks.ts`
  - adapter: `src/lib/providers/stock.ts`
  - 지원 provider: `mock`, `alphavantage`
- `baseball`
  - source: `src/mocks/baseball.ts`
  - adapter: `src/lib/providers/baseball.ts`
  - 지원 provider: `mock`
- `real_estate`
  - source: `src/mocks/real-estate.ts`
  - adapter: `src/lib/providers/real-estate.ts`
  - 지원 provider: `mock`

## 환경 변수

- `NEWS_PROVIDER=mock | newsapi`
- `NEWSAPI_API_KEY=...`
- `STOCK_PROVIDER=mock | alphavantage`
- `ALPHA_VANTAGE_API_KEY=...`
- `BASEBALL_PROVIDER=mock`
- `REAL_ESTATE_PROVIDER=mock`

## 목적

- 외부 API가 없어도 실행 흐름이 동작하도록 유지
- 결과 렌더링과 저장에 필요한 source 메타데이터 보존
- runner/UI 변경 없이 provider 구현만 교체 가능하게 유지
