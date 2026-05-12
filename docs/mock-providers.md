# Mock Providers

## Current Mock Providers

- `news`
  - source: `src/mocks/news.ts`
  - adapter: `src/lib/providers/news.ts`
- `stock`
  - source: `src/mocks/stocks.ts`
  - adapter: `src/lib/providers/stock.ts`
- `baseball`
  - source: `src/mocks/baseball.ts`
  - adapter: `src/lib/providers/baseball.ts`
- `real_estate`
  - source: `src/mocks/real-estate.ts`
  - adapter: `src/lib/providers/real-estate.ts`

## Purpose

- Keep the execution flow runnable without external APIs
- Preserve source metadata for result rendering and future persistence
- Allow later provider replacement with minimal runner/UI changes
