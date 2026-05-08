# Step 03 DB Schema

## Goal

Create the Supabase database foundation for My SECRETARY so authenticated users can own assistants, store assistant runs, and access their own data safely through RLS-backed tables.

## Assumptions

- Step 02 auth has already been merged into `develop`, and this work starts from a fresh `step/03-db-schema` branch.
- Supabase Auth is already the identity source, so all user-owned rows can reference `auth.users(id)`.
- MVP data sources remain mock-based for now, so the schema should support assistant configuration, run output, and sources without requiring provider-specific tables yet.
- We may not have the Supabase CLI initialized in this repo yet, so SQL files should still be usable through the Supabase SQL editor.

## Scope

- Add SQL migration files for the core assistant tables.
- Add RLS policies for all user-owned tables.
- Add seed SQL for the initial news and stock assistant templates.
- Add indexes and timestamp update helpers that will support upcoming CRUD and run queries.
- Expand shared TypeScript domain types to match the Step 03 schema.
- Add lightweight row-to-domain mappers for future API work.
- Document how to apply the schema and seed locally or in Supabase.

## Out Of Scope

- Assistant CRUD API routes
- Dashboard data fetching from the database
- AI runner implementation
- Provider integration
- Service-role-only admin workflows

## Implementation Steps

1. Define Step 03 planning docs and the intended schema boundaries.
2. Expand the assistant domain types to cover templates, user assistants, runs, and sources.
3. Add a Supabase migration that creates:
   - `assistant_templates`
   - `user_assistants`
   - `assistant_runs`
   - `assistant_sources`
   - updated-at trigger helper
   - useful indexes
4. Enable RLS and add owner-based policies for the user-owned tables.
5. Add seed SQL for the default news and stock templates.
6. Add mapping helpers so later route handlers can convert DB rows to camelCase domain objects consistently.
7. Update README with schema application steps and current project status.
8. Run lint, typecheck, and tests.

## Risks

- If seed rows are not idempotent, reapplying them in shared environments can create duplicates.
- If RLS is incomplete now, Step 04 CRUD can appear to work locally and then fail in real Supabase environments.
- Overfitting the schema to current mock providers could make future real provider integration awkward.

## Validation

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- Manual review of the SQL for:
  - foreign keys
  - RLS enablement
  - owner checks
  - assistant type and run status constraints

## Deliverables

- `docs/execplans/step-03-db-schema.md`
- `docs/steps/bootstrap-step-03-db-schema.md`
- Supabase migration SQL for schema and RLS
- `supabase/seed.sql` for default templates
- Updated TypeScript domain types and mappers
- README notes for applying the schema
