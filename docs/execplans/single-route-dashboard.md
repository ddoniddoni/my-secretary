# Single Route Dashboard

## Goal

Make the dashboard the only user-facing screen so the app opens directly into the main dashboard at `/`.

## Assumptions

- The user wants to remove the current landing, login, and assistant detail screens from the UI route structure.
- API routes can remain in place for future work even if their paired UI routes are removed for now.
- The root route can host a login gate instead of a separate login page.

## Scope

- Move the dashboard page to `/`.
- Remove other App Router UI pages that are no longer part of the desired flow.
- Reintroduce authentication as a guest gate directly on `/`.
- Update navigation and card actions so they do not point to deleted screens.
- Refresh README wording so the current entry flow matches the new structure.

## Out Of Scope

- Reworking assistant CRUD APIs
- Reintroducing auth flows elsewhere
- Assistant detail replacement UX

## Validation

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
