# Bootstrap Step 02 Auth

## Summary

This step turns the Step 01 scaffold into a user-aware app shell. The main outcome is a stable Supabase SSR authentication foundation that later steps can reuse for RLS-backed assistant data and execution APIs.

## Branch Plan

- Start from the latest `develop`
- Create branch: `step/02-auth`
- Keep this step focused on auth flow, session restoration, and protected routes
- Merge this branch back into `develop` before starting `step/03-db-schema`

## Commit Policy

Use Conventional Commits from `AGENTS.md`.

Recommended commits for this step:

- `docs(planning): add step 02 auth plan`
- `feat(auth): add supabase ssr auth foundation`
- `feat(auth): implement login and logout flow`
- `test(auth): add auth helper coverage`
- `docs(readme): document supabase auth setup`

## Planned Work

- Create `docs/execplans/step-02-auth.md`
- Create this bootstrap step note under `docs/steps`
- Install Supabase SSR dependencies
- Add browser/server/proxy Supabase helpers
- Implement `/login` and `/auth/callback`
- Protect dashboard and assistant detail routes
- Add signed-in header state and logout control
- Document env vars and local auth setup

## Working Notes

- Prefer email magic link for the first complete auth flow.
- Keep route protection logic outside UI components where possible.
- Avoid introducing service role usage or database writes in this step.
- If an env-dependent behavior cannot run locally, surface it clearly in the UI and docs instead of failing silently.

## Exit Criteria

- Users can request a magic link from `/login`.
- The callback route can exchange the auth code for a session.
- `/dashboard` and `/assistants/[assistantId]` are protected.
- The header reflects whether a user is signed in and supports logout.
- `lint`, `typecheck`, and `test` pass, or any blocker is documented clearly.

## Next Step

After this step is merged, move to `step/03-db-schema` for assistant tables, RLS, seeds, and user-owned data modeling.
