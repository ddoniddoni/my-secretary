# Assistant Schemas

## Current Assistant Types

- `news`
  - config: `categories`, `summaryStyle`, `maxItems`, `language`
  - output: overall summary + issue highlights + source metadata
- `stock`
  - config: `symbols`, `market`, `summaryStyle`, `language`
  - output: market summary + symbol briefs + disclaimer
- `baseball`
  - config: `teams`, `summaryStyle`, `includeStandings`, `language`
  - output: league summary + team briefs + optional standings snapshot
- `real_estate`
  - config: `regions`, `propertyTypes`, `summaryStyle`, `language`
  - output: market summary + region briefs + notice

## Validation Rules

- All assistant config payloads are validated in `src/lib/assistants/config.ts`.
- All structured outputs are validated in `src/lib/assistants/output-schemas.ts`.
- Failed structured validation should surface as a failed assistant run.
