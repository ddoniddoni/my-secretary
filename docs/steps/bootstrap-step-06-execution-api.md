# Bootstrap Step 06 Execution API

## Summary

This step connects the saved assistant records to a public server action. It adds the authenticated run endpoint, persists pending and completed runs, and saves source metadata so the next step can focus on rendering the stored results.

## Branch Plan

- Start from the latest `develop`
- Create branch: `step/06-execution-api`
- Keep this step focused on execution persistence and the public run route
- Merge this branch back into `develop` before starting `step/07-result-ui`

## Commit Policy

Use Conventional Commits from `AGENTS.md`.

Recommended commits for this step:

- `docs(planning): add step 06 execution api plan`
- `feat(assistants): persist assistant run lifecycle`
- `feat(api): add assistant run route`
- `test(api): cover assistant execution flow`

## Planned Work

- Create `docs/execplans/step-06-execution-api.md`
- Create this bootstrap note under `docs/steps`
- Add repository helpers for assistant run and source persistence
- Add an execution service that wraps lookup, runner execution, and failure handling
- Add `POST /api/assistants/[assistantId]/run`
- Add tests for success, failure, and not-found cases
- Update README to reflect the new current step

## Working Notes

- Keep the route handler thin and move execution orchestration into `src/lib/assistants`.
- Create a pending run before the AI call so the execution history is durable.
- Store user-safe failure messages in `assistant_runs.error_message`.
- Clean up any source rows if final run completion fails after source insertion.

## Exit Criteria

- Authenticated users can execute their own assistants through the run API.
- Each execution creates a pending run and ends as either `success` or `failed`.
- Successful runs store source metadata in `assistant_sources`.
- Failure responses stay safe for the client while detailed errors are still logged on the server.
- `lint`, `typecheck`, and `test` pass, or any blocker is documented clearly.

## Next Step

After this step is merged, move to `step/07-result-ui` for assistant-specific result components, run history rendering, and detail-page execution UX.
