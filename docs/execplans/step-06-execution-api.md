# Step 06 Execution API

## Goal

Add the authenticated assistant execution API that creates a pending run, executes the saved assistant on the server, persists success or failure, and stores source metadata for later result UIs.

## Assumptions

- Step 05 has already been merged into `develop`.
- Supabase schema from Step 03 is already applied, including `assistant_runs` and `assistant_sources`.
- The public execution surface for this step is `POST /api/assistants/[assistantId]/run`.
- Providers remain mock-backed for MVP, but the persistence flow should not depend on mock-only behavior.

## Scope

- Add Step 06 planning and bootstrap docs.
- Add repository helpers for creating and updating assistant runs.
- Add repository helpers for inserting and cleaning up assistant sources.
- Add an execution service that owns assistant lookup, template lookup, runner calls, and failure handling.
- Add `POST /api/assistants/[assistantId]/run` with auth and ownership checks.
- Add focused tests for success, failure, and not-found execution paths.
- Update README to reflect that the run API is now implemented.

## Out Of Scope

- Assistant result UI components
- Assistant detail page run button wiring
- Pagination or filtering for long run histories
- Real news or stock provider integrations

## Implementation Steps

1. Add Step 06 planning and bootstrap docs.
2. Extend repository helpers for pending, success, and failed run persistence.
3. Add source persistence helpers for `assistant_sources`.
4. Add an execution service that:
   - verifies assistant ownership
   - loads the matching template
   - creates a pending run
   - executes the runner
   - stores sources
   - finalizes the run as `success` or `failed`
5. Add `POST /api/assistants/[assistantId]/run`.
6. Add tests for execution sequencing, failure persistence, and 404 handling.
7. Update README status text, then run lint, typecheck, and tests.

## Risks

- Supabase client writes are not transactional across multiple calls, so source persistence and run updates need conservative cleanup behavior.
- Template lookups for existing assistants should allow inactive templates, otherwise older assistants may become unrunnable after template deactivation.
- AI validation or provider failures must still leave a readable failed run record for the user.

## Validation

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- Manual review of:
  - `POST /api/assistants/[assistantId]/run` returns 201 with a stored run on success
  - missing or foreign assistants return 404
  - runner failures update `assistant_runs.status` to `failed`
  - successful runs store `assistant_sources`

## Deliverables

- `docs/execplans/step-06-execution-api.md`
- `docs/steps/bootstrap-step-06-execution-api.md`
- Run persistence helpers in the assistant repository
- Assistant execution service
- `POST /api/assistants/[assistantId]/run`
- Tests for execution success and failure flows
