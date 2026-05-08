# Bootstrap Step 04 Assistant CRUD

## Summary

This step makes the product feel real for the first time: users can take seeded assistant templates and turn them into personal dashboard items they own and manage.

## Branch Plan

- Start from the latest `develop`
- Create branch: `step/04-assistant-crud`
- Keep this step focused on templates, user assistants, CRUD APIs, and dashboard/detail UI
- Merge this branch back into `develop` before starting `step/05-ai-runner`

## Commit Policy

Use Conventional Commits from `AGENTS.md`.

Recommended commits for this step:

- `docs(planning): add step 04 assistant crud plan`
- `feat(assistants): add assistant crud api routes`
- `feat(dashboard): build assistant list and create flow`
- `feat(assistants): add assistant detail editor`
- `test(assistants): cover config validation`

## Planned Work

- Create `docs/execplans/step-04-assistant-crud.md`
- Create this bootstrap step note under `docs/steps`
- Add assistant config validation helpers
- Add Supabase repository functions for templates and user assistants
- Build assistant CRUD route handlers
- Replace dashboard scaffold with live assistant management
- Replace assistant detail scaffold with real data and editable settings
- Add tests for payload normalization and validation

## Working Notes

- Keep API responses in the `{ data: ... }` / `{ error: ... }` shape from `AGENTS.md`.
- Use server-side ownership verification even though RLS exists.
- Keep the UI simple and dependable rather than overbuilding modal infrastructure.
- Prefer shared config helpers between create and edit flows.

## Exit Criteria

- Templates can be read through the API.
- Authenticated users can create, read, update, and delete their own assistants.
- The dashboard shows empty, loading, error, and success states.
- The assistant detail page shows real stored data and allows saving changes.
- `lint`, `typecheck`, and `test` pass, or any blocker is documented clearly.

## Next Step

After this step is merged, move to `step/05-ai-runner` for structured AI generation, mock providers, and assistant runner orchestration.
