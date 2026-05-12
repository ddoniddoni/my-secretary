# Bootstrap Step 07 Result UI

## Summary

This step turns the execution API into a user-visible experience. The main outcome is an assistant detail screen that can run a saved assistant, show recent results in assistant-specific layouts, and make execution history readable at a glance.

## Branch Plan

- Start from the latest `develop`
- Create branch: `step/07-result-ui`
- Keep this step focused on detail-page UX, result rendering, and run history
- Merge this branch back into `develop` before starting the final polish step

## Commit Policy

Use Conventional Commits from `AGENTS.md`.

Recommended commits for this step:

- `docs(planning): add step 07 result ui plan`
- `feat(assistants): add assistant detail result ui`
- `feat(dashboard): link cards to assistant detail view`
- `test(assistants): cover run result presentation helpers`

## Planned Work

- Create `docs/execplans/step-07-result-ui.md`
- Create this bootstrap note under `docs/steps`
- Add result parsing and summary helpers
- Add assistant detail page and run button UX
- Add news and stock result renderer components
- Add run history UI and detail-page empty/error states
- Update dashboard cards and README

## Working Notes

- Keep authenticated data fetching on the server side and only hydrate the run button client behavior.
- Use assistant-specific result components instead of a generic JSON dump.
- Fall back safely when stored run output does not match the expected schema.
- Reuse the current pixel dashboard language so the detail screen feels like part of the same product.

## Exit Criteria

- Users can open a detail page for each saved assistant.
- Users can trigger assistant execution from the UI.
- News and stock outputs render in clearly different layouts.
- Run history shows readable status and summary information.
- `lint`, `typecheck`, and `test` pass, or any blocker is documented clearly.

## Next Step

After this step is merged, move to the final polish step for responsive refinement, README cleanup, and MVP completion details.
