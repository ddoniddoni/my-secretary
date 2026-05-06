# Step 01 Project Bootstrap

## Goal

Establish the production-ready project foundation for My SECRETARY so the later auth, data, and assistant features can be added without reworking the app shell.

## Assumptions

- The current repository is still near the default Next.js starter state.
- We will continue from `develop` and create a feature branch named `step/01-project-bootstrap` before implementation work.
- The initial scope is limited to app structure, shared UI foundations, landing page direction, and validation scripts needed for steady iteration.
- Supabase, AI runner, and assistant CRUD work are intentionally deferred to later steps.

## Scope

- Add the baseline directory structure described in `AGENTS.md` where it helps the next steps.
- Set up styling foundations for a clean SaaS dashboard direction.
- Replace the placeholder home page with a landing page aligned to the PRD.
- Add reusable layout and basic shared UI primitives only as needed for Step 01.
- Add missing project scripts such as `typecheck` if they are required for the step validation flow.
- Keep the implementation compatible with future Supabase auth and protected dashboard work.

## Out Of Scope

- Supabase authentication and session handling
- Database schema, RLS, and seed data
- Assistant CRUD APIs
- AI execution, providers, and structured output schemas
- Protected dashboard business logic

## Implementation Steps

1. Review the current app shell, styles, dependencies, and script coverage.
2. Define the Step 01 branch and commit strategy:
   - Branch: `step/01-project-bootstrap`
   - First planning commit example: `docs(planning): add step 01 bootstrap plan`
   - Implementation commit examples:
     - `chore(repo): add project bootstrap structure`
     - `feat(landing): build step 01 landing experience`
3. Add the foundational folder structure for `components`, `lib`, `types`, and related app routes that will be used next.
4. Introduce the core visual system:
   - global CSS variables
   - typography direction
   - spacing, radius, and color tokens
   - shared container and surface patterns
5. Rebuild the landing page to match the product narrative:
   - hero
   - assistant preview section
   - value proposition section
   - login CTA
   - responsive behavior
6. Prepare minimal reusable layout/shared components needed by the landing page and future dashboard work.
7. Add or update project scripts needed for validation, especially `typecheck`.
8. Run validation commands that are available for the step and record any gaps.

## Risks

- Styling can drift into one-off page code if we skip shared tokens too early.
- Overbuilding the dashboard shell in Step 01 would slow the auth step and create dead code.
- Adding too many dependencies up front may create noise before the architecture is proven.
- Existing uncommitted local changes may overlap with the landing page and should be handled carefully.

## Validation

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- Confirm the landing page renders successfully in local development.
- Confirm the new structure remains simple enough for Step 02 auth integration.

## Deliverables

- `docs/execplans/step-01-project-bootstrap.md`
- `docs/steps/bootstrap-step-01-project-bootstrap.md`
- Updated project structure and landing page implementation
- Validation notes captured in commit/PR summary or follow-up docs if needed
