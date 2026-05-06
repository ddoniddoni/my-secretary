# Bootstrap Step 01 Project Bootstrap

## Summary

This step prepares the repository for MVP delivery by replacing the starter app shell with a product-shaped foundation. The result should make Step 02 auth and Step 04 dashboard work straightforward instead of requiring another layout rewrite.

## Branch Plan

- Start from the latest `develop`
- Create branch: `step/01-project-bootstrap`
- Keep this step focused on project structure, styling foundations, and the landing page
- Merge this branch back into `develop` before starting `step/02-auth`

## Commit Policy

Use Conventional Commits from `AGENTS.md`.

Recommended commits for this step:

- `docs(planning): add step 01 bootstrap plan`
- `chore(repo): add project bootstrap structure`
- `feat(landing): build product landing page`
- `style(ui): refine shared design tokens`

## Planned Work

- Create `docs/execplans/step-01-project-bootstrap.md`
- Create this bootstrap step note under `docs/steps`
- Add foundational directories under `src`
- Establish base layout direction for public pages
- Replace starter landing content with PRD-aligned messaging
- Prepare shared UI patterns that can be reused by dashboard pages later
- Add validation scripts that are currently missing

## Working Notes

- Avoid touching auth, Supabase, assistant CRUD, or AI runner logic in this step.
- Prefer reusable layout primitives over one-off page-specific wrappers.
- Keep the public landing page polished, but do not build fake product behavior.
- If an implementation choice is uncertain, prefer the option that reduces rework for the next step.

## Exit Criteria

- The repository no longer looks like a default Next.js starter.
- The landing page communicates the My SECRETARY product clearly.
- Shared styling foundations exist for later dashboard screens.
- `lint` and `typecheck` are available and pass, or any blocker is documented clearly.
- The branch is ready for a clean review and merge into `develop`.

## Next Step

After this step is merged, move to `step/02-auth` for Supabase authentication, login flow, middleware protection, and dashboard access control.
