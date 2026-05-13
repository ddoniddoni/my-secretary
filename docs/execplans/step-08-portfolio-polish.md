# Step 08 Portfolio Polish

## Goal

Polish the MVP into a portfolio-ready experience by tightening the guest landing/dashboard presentation, improving state handling around assistant pages, and updating docs/env guidance to match the current product flow.

## Assumptions

- Step 07 has already been merged into `develop`.
- The root route continues to act as the primary entry point for both the guest gate and the signed-in dashboard.
- Demo mode remains an important fallback when Supabase is not configured locally.
- The core CRUD, runner, and execution flows already work, so this step should avoid broad architectural churn.

## Scope

- Add Step 08 planning and bootstrap docs.
- Refine the guest landing/dashboard gate so the product pitch feels more intentional and assistant-type previews are clearer.
- Add portfolio-style summary modules to the signed-in dashboard so the main screen communicates system value quickly.
- Improve loading, empty, error, and not-found states for assistant detail flows.
- Tighten pixel-avatar branding and shared state-panel styling where it improves readability.
- Refresh `README.md` and `.env.example` so setup and MVP scope are easy to understand from the repo alone.
- Add or update focused tests for any new dashboard/state helpers introduced by the polish step.

## Out Of Scope

- New assistant domains beyond the current four types
- Real provider integrations
- Replacing the single-route guest/dashboard architecture
- Deep visual redesign that would invalidate the established pixel OS language

## Implementation Steps

1. Add Step 08 planning and bootstrap docs.
2. Introduce shared landing/dashboard presentation helpers for assistant-type copy and summary data.
3. Upgrade the guest gate with stronger landing sections, clearer template previews, and better CTA framing.
4. Add dashboard summary panels for signed-in and demo users.
5. Add assistant detail loading/error/not-found states and reuse improved shared empty/error panels where helpful.
6. Refresh repo docs and environment guidance to reflect the current MVP and demo mode workflow.
7. Run lint, typecheck, and test, then prepare the Step 08 commit.

## Risks

- Over-polishing the shell could make the dashboard feel busier instead of clearer, so new modules should stay compact and scan-friendly.
- Adding more guest marketing content must not slow down the path to login or demo use.
- New shared state components can accidentally flatten domain-specific UI if they become too generic.

## Validation

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- Manual review of:
  - guest mode landing/dashboard presentation on mobile and desktop
  - signed-in or demo dashboard summary modules
  - assistant detail loading, empty, error, and not-found states
  - README/env instructions matching the current app flow

## Deliverables

- `docs/execplans/step-08-portfolio-polish.md`
- `docs/steps/bootstrap-step-08-portfolio-polish.md`
- Guest landing/dashboard polish
- Dashboard summary and state UI improvements
- Assistant detail state routes
- Updated README and env docs
