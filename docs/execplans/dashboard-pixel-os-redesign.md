# Dashboard Pixel OS Redesign

## Goal

Rework the authenticated dashboard into a pixel-styled app shell that matches the provided main-screen concept while staying honest to the current product state and assistant CRUD capabilities.

## Assumptions

- The redesign is limited to the logged-in dashboard route in this task.
- Assistant execution is not implemented yet, so any run-related UI must clearly communicate that it is not active yet.
- Existing assistant CRUD APIs and detail navigation remain the source of truth.
- Landing and login pages should keep their current visual direction for now.

## Scope

- Add a dashboard-only pixel OS theme and reusable shell layout.
- Replace the current dashboard hero/stats layout with:
  - top OS window chrome
  - left navigation rail
  - search and add-assistant controls
  - redesigned assistant cards
  - empty and filtered-empty states
- Keep delete confirmation and create flow working inside the new visual system.
- Add focused tests for dashboard helper logic used by the new UI.

## Out Of Scope

- Assistant detail page redesign
- Real assistant run execution
- Activity, templates, or settings pages
- Landing page redesign

## Implementation Steps

1. Add this execution plan.
2. Create dashboard helper functions for:
   - search filtering
   - type labels
   - assistant metadata summaries
3. Add a reusable dashboard shell component with:
   - OS title bar
   - sidebar navigation
   - profile and logout area
4. Refactor the dashboard page and client components into the new layout.
5. Redesign assistant cards to prioritize:
   - open detail
   - transparent run placeholder
   - delete action
6. Add dashboard theme classes scoped to the new shell.
7. Add tests for helper behavior and run lint, typecheck, and tests.

## Risks

- The pixel-heavy shell can reduce readability on small screens if spacing and typography are not scaled carefully.
- Strong design styling can accidentally leak into landing or auth pages unless the theme is properly scoped.
- If run actions look too active before Step 06, the UI can create false expectations about current functionality.

## Validation

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- Manual checks:
  - dashboard works with zero assistants
  - dashboard filters assistants by search text
  - create assistant dialog still opens and submits
  - delete assistant flow still works
  - dashboard remains usable on mobile and desktop widths
