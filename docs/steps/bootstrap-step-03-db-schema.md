# Bootstrap Step 03 DB Schema

## Summary

This step adds the persistent data model behind the authenticated shell. The result should give later assistant CRUD and execution APIs a stable Supabase schema with clear ownership boundaries.

## Branch Plan

- Start from the latest `develop`
- Create branch: `step/03-db-schema`
- Keep this step focused on schema, RLS, seed data, and supporting domain types
- Merge this branch back into `develop` before starting `step/04-assistant-crud`

## Commit Policy

Use Conventional Commits from `AGENTS.md`.

Recommended commits for this step:

- `docs(planning): add step 03 db schema plan`
- `feat(db): add assistant schema and rls policies`
- `feat(types): add assistant domain models and mappers`
- `docs(readme): document supabase schema setup`

## Planned Work

- Create `docs/execplans/step-03-db-schema.md`
- Create this bootstrap step note under `docs/steps`
- Add Supabase migration SQL for assistant tables and helper triggers
- Add RLS policies for `user_assistants`, `assistant_runs`, and `assistant_sources`
- Add seed SQL for the default assistant templates
- Expand shared assistant types
- Add DB row mapping helpers
- Update README with schema apply instructions

## Working Notes

- Keep template rows reusable across all users.
- Use snake_case in SQL and camelCase in TypeScript-facing models.
- Prefer idempotent seed behavior where practical.
- Avoid mixing assistant CRUD logic into this step.

## Exit Criteria

- The repo contains a reproducible SQL schema for the assistant domain.
- RLS is enabled for all user-owned tables with owner-based access rules.
- Seed data exists for the default news and stock templates.
- Shared types are ready for Step 04 CRUD and Step 06 run persistence.
- `lint`, `typecheck`, and `test` pass, or any blocker is documented clearly.

## Next Step

After this step is merged, move to `step/04-assistant-crud` for template queries, user assistant CRUD routes, and dashboard list UI.
