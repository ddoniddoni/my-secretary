# Step 05 AI Runner

## Goal

Add the server-side AI runner foundation that turns a saved assistant plus provider data into validated structured output for news and stock briefings.

## Assumptions

- Step 04 has already been merged into `develop`.
- Supabase schema from Step 03 is already applied in the target environment.
- Step 05 focuses on libraries, schemas, mocks, and orchestration, not the public run API route yet.
- MVP providers remain mock implementations for both news and stock.

## Scope

- Add server-only AI environment parsing and a minimal OpenAI-compatible JSON client.
- Add a shared `generateStructured` helper that validates model output with Zod.
- Add news and stock output schemas for structured briefs.
- Add news and stock mock providers with source metadata.
- Add assistant runner orchestration for `news` and `stock`.
- Add focused tests for output schema validation and runner success/failure paths.
- Update README and `.env.example` for the new runtime requirements.

## Out Of Scope

- `/api/assistants/[assistantId]/run` route handler
- Persisting `assistant_runs` and `assistant_sources`
- Result UI rendering for completed runs
- Real provider integrations beyond mock mode

## Implementation Steps

1. Add Step 05 planning and bootstrap docs.
2. Create AI environment parsing and request error helpers.
3. Add a minimal JSON-oriented OpenAI-compatible client.
4. Add `generateStructured` with prompt assembly and Zod validation.
5. Add news and stock provider interfaces plus mock data sources.
6. Add news and stock structured output schemas.
7. Build assistant runner orchestration that returns input, output, provider metadata, and source metadata.
8. Add tests for schema validation, disclaimer enforcement, and runner success/failure behavior.
9. Update `.env.example` and README, then run lint, typecheck, and tests.

## Risks

- OpenAI-compatible providers can differ in response shape, so the JSON parsing path needs conservative guards.
- If prompt instructions are too weak, schema validation failures may increase even when the provider data is valid.
- Unknown stock symbols in mock mode need graceful fallback behavior so local testing stays useful.

## Validation

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- Manual review of:
  - missing AI env throws a clear server error
  - news runner returns validated structured data
  - stock runner always includes the required disclaimer
  - mock providers include source metadata that can later be stored in `assistant_sources`

## Deliverables

- `docs/execplans/step-05-ai-runner.md`
- `docs/steps/bootstrap-step-05-ai-runner.md`
- AI client and structured generation utilities
- News and stock mock providers
- News and stock output schemas
- Assistant runner orchestration with tests
