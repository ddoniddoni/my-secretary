# Step 07 Result UI

## Goal

Add the assistant detail experience that lets signed-in users open an assistant, run it from the UI, and review recent news or stock results in type-specific layouts instead of a generic chat transcript.

## Assumptions

- Step 06 has already been merged into `develop`.
- `POST /api/assistants/[assistantId]/run` already persists `assistant_runs` and `assistant_sources`.
- The first detail page can rely on the latest 10 runs from the existing repository helper.
- Result rendering should prioritize the validated `assistant_runs.output` payload.

## Scope

- Add Step 07 planning and bootstrap docs.
- Add `/assistants/[assistantId]` protected detail page.
- Add reusable run button client component that calls the run API and refreshes the UI.
- Add result renderer components for `news` and `stock`.
- Add assistant run history UI with loading, empty, success, and failed states.
- Update dashboard cards so users can open the detail page and trigger runs.
- Add focused tests for result parsing and run-history summaries.
- Update README to reflect that result UI is now implemented.

## Out Of Scope

- Real provider integrations
- Pagination beyond the existing latest-10 limit
- Multi-assistant activity feed across the whole dashboard
- Editing templates themselves

## Implementation Steps

1. Add Step 07 planning and bootstrap docs.
2. Add result parsing and presentation helpers for assistant runs.
3. Build assistant-specific result components for news and stock.
4. Build reusable run-history and run-button components.
5. Add `/assistants/[assistantId]` page with summary, latest result, history, and settings editor.
6. Update dashboard cards to navigate into the detail page and run assistants directly.
7. Add tests, update README, and run lint, typecheck, and test.

## Risks

- Stored run output may become invalid if schemas change later, so the UI needs graceful fallback handling.
- The dashboard is already a strong visual system, so the detail page should extend that system rather than introducing a separate style language.
- Running assistants from both the dashboard and detail page could create confusing feedback if success/error states are not localized clearly.

## Validation

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- Manual review of:
  - opening `/assistants/[assistantId]` as an authenticated owner
  - running an assistant from the detail page
  - seeing news and stock results render differently
  - seeing empty, failed, and successful run states

## Deliverables

- `docs/execplans/step-07-result-ui.md`
- `docs/steps/bootstrap-step-07-result-ui.md`
- Assistant detail page route
- Result renderer and run-history components
- Reusable run button component
- Tests for result parsing and summaries
