# Bootstrap Step 04 Assistant CRUD

## Summary

This step makes the product feel real for the first time: users can take seeded assistant templates and turn them into personal dashboard items they own and manage. The branch now also consolidates the UI into a single root dashboard flow with a pixel OS shell and a login gate on `/`.

## Branch Plan

- Start from the latest `develop`
- Create branch: `step/04-assistant-crud`
- Keep this step focused on templates, user assistants, CRUD APIs, and dashboard-first UI
- Merge this branch back into `develop` before starting `step/05-ai-runner`

## Commit Policy

Use Conventional Commits from `AGENTS.md`.

Recommended commits for this step:

- `docs(planning): add step 04 assistant crud plan`
- `feat(assistants): add assistant crud api routes`
- `feat(dashboard): build assistant list and create flow`
- `feat(dashboard): redesign root dashboard shell`
- `feat(auth): restore root login gate`
- `test(assistants): cover config validation`

## Planned Work

- Create `docs/execplans/step-04-assistant-crud.md`
- Create this bootstrap step note under `docs/steps`
- Add assistant config validation helpers
- Add Supabase repository functions for templates and user assistants
- Build assistant CRUD route handlers
- Replace dashboard scaffold with live assistant management
- Redesign the dashboard as the main root screen
- Add a root login gate that switches to the dashboard after sign-in
- Add tests for payload normalization and validation

## Working Notes

- Keep API responses in the `{ data: ... }` / `{ error: ... }` shape from `AGENTS.md`.
- Use server-side ownership verification even though RLS exists.
- Keep the UI simple and dependable rather than overbuilding modal infrastructure.
- Preserve the pixel OS shell as the main UI identity for the authenticated app.
- Prefer shared config helpers between create and edit flows.
- Route the user through `/` as the only active UI entrypoint.

## Exit Criteria

- Templates can be read through the API.
- Authenticated users can create, read, update, and delete their own assistants.
- The root dashboard shows loading, error, empty, guest, and signed-in states.
- Unauthenticated users see a login gate under the OS header and can request a magic link.
- Signed-in users land on the same root route and see their personal assistant dashboard.
- `lint`, `typecheck`, and `test` pass, or any blocker is documented clearly.

## Next Step

After this step is merged, move to `step/05-ai-runner` for structured AI generation, mock providers, assistant runner orchestration, and real run results inside the dashboard shell.
