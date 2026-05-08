# Step 04 Assistant CRUD

## Goal

Turn the authenticated shell and database schema into a working assistant management flow where users can browse templates, create assistants, view their own assistants, update settings, and delete assistants safely.

## Assumptions

- Step 03 schema and seed SQL have already been merged into `develop`.
- Supabase has the Step 03 migration and seed applied in the target environment before manual end-to-end testing.
- Only the seeded `news` and `stock` templates need to be supported in this step.
- AI execution and run history are still placeholder concerns until later steps, so dashboard cards can show creation metadata instead of real run results for now.

## Scope

- Add API routes for assistant templates and user assistant CRUD.
- Add Zod validation for assistant config payloads.
- Add Supabase repository helpers for templates and user assistants.
- Replace the dashboard scaffold with a working assistant list, empty state, create modal, and delete confirmation.
- Replace the assistant detail scaffold with real assistant data and an editable settings form.
- Add loading and error states for the dashboard route.
- Add focused tests for config validation and payload normalization.

## Out Of Scope

- Assistant run execution
- Run history rendering from real data
- News and stock result UIs
- Pagination for assistants
- Profile/settings page work

## Implementation Steps

1. Add Step 04 planning docs.
2. Create assistant domain validation and repository helpers:
   - template queries
   - user assistant list/create/read/update/delete
   - config validation by assistant type
3. Add route handlers:
   - `GET /api/assistants/templates`
   - `GET /api/assistants`
   - `POST /api/assistants`
   - `GET /api/assistants/[assistantId]`
   - `PATCH /api/assistants/[assistantId]`
   - `DELETE /api/assistants/[assistantId]`
4. Build dashboard UI:
   - real assistant cards
   - empty state
   - add assistant modal
   - delete confirm modal
   - loading/error states
5. Build assistant detail UI:
   - assistant header and template metadata
   - config summary
   - editable form that saves through the PATCH API
6. Add tests for config parsing and payload normalization.
7. Update README status and run lint, typecheck, and tests.

## Risks

- Without generated Supabase types, repository code needs careful row mapping and runtime validation to avoid shape drift.
- Config handling can become duplicated between create and edit flows unless shared helpers are introduced early.
- If the environment has not applied Step 03 SQL yet, CRUD APIs will fail at runtime even if the app typechecks locally.

## Validation

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- Manual review and, when Supabase is configured:
  - templates list loads
  - assistant can be created from a template
  - dashboard refreshes with the new assistant
  - assistant can be edited
  - assistant can be deleted
  - users cannot access another user's assistant

## Deliverables

- `docs/execplans/step-04-assistant-crud.md`
- `docs/steps/bootstrap-step-04-assistant-crud.md`
- Assistant CRUD APIs
- Working dashboard assistant management UI
- Real assistant detail page with editable settings
- Tests for config validation helpers
