# Add Baseball And Real Estate Assistants

## Goal

Add two new assistant types, `baseball` and `real_estate`, and make them work through the same end-to-end flow as the existing news and stock assistants: template seed, config schema, mock provider, runner, structured output validation, result UI, demo mode, and tests.

## Scope

- Widen the assistant domain types and config schemas
- Add domestic baseball and real-estate mock providers
- Add structured output schemas for both new assistants
- Extend runner, result parsing, dashboard metadata, and preview data
- Add baseball and real-estate result UIs
- Update demo mode data and execution
- Add migration/seed updates for new template types
- Update README and product/schema/provider docs
- Widen the dashboard card action layout so the run button is easier to use

## Out Of Scope

- Real sports or real-estate APIs
- Historical charts or map views
- New auth or billing flows

## Risks

- Adding assistant types touches many shared unions, so one missed branch can create runtime gaps.
- Existing DB check constraints only allow `news` and `stock`, so a migration update is required for future Supabase usage.
- Demo mode and persisted mode must stay behaviorally aligned.

## Validation

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- Manual review of:
  - dashboard card layout with wider run action
  - add/create/edit/run flow for baseball
  - add/create/edit/run flow for real estate
  - assistant-specific result rendering for all four assistant types
