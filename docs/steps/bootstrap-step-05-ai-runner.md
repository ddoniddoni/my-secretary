# Bootstrap Step 05 AI Runner

## Summary

This step turns assistant records into runnable server-side workflows. It introduces the AI client boundary, mock data providers, and structured output validation so the next step can focus on API persistence and execution history.

## Branch Plan

- Start from the latest `develop`
- Create branch: `step/05-ai-runner`
- Keep this step focused on AI orchestration and validation foundations
- Merge this branch back into `develop` before starting `step/06-run-api`

## Commit Policy

Use Conventional Commits from `AGENTS.md`.

Recommended commits for this step:

- `docs(planning): add step 05 ai runner plan`
- `feat(ai): add structured generation client`
- `feat(providers): add mock news and stock providers`
- `feat(assistants): add assistant runner orchestration`
- `test(ai): cover structured outputs and runners`

## Planned Work

- Create `docs/execplans/step-05-ai-runner.md`
- Create this bootstrap note under `docs/steps`
- Add AI env helpers and OpenAI-compatible JSON client
- Add `generateStructured` helper with Zod validation
- Add mock providers and seed data adapters
- Add news and stock output schemas
- Add news and stock runner functions plus shared dispatcher
- Add tests for schema validation and runner outcomes

## Working Notes

- Keep all AI calls on the server side only.
- Treat provider data as the source of truth for source metadata.
- Use mock providers by default so Step 05 stays runnable without third-party data services.
- Design runner outputs so Step 06 can save them directly into `assistant_runs` and `assistant_sources`.

## Exit Criteria

- News and stock assistants can be executed through library code with injected dependencies.
- Structured AI output is validated through Zod before being returned.
- Stock output enforces the required disclaimer text.
- Mock providers return source metadata consistently.
- `lint`, `typecheck`, and `test` pass, or any blocker is documented clearly.

## Next Step

After this step is merged, move to `step/06-run-api` for pending/success/failed persistence, ownership checks, and the public assistant run endpoint.
