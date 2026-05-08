# Step 02 Auth

## Goal

Add Supabase-based authentication to My SECRETARY so users can sign in, keep a server-readable session, and access protected dashboard routes safely.

## Assumptions

- Step 01 has already been merged into `develop`, and Step 02 starts from a fresh `step/02-auth` branch.
- This step will use Supabase SSR utilities with cookie-backed sessions, following the current official Next.js App Router guidance.
- Email magic link sign-in is sufficient for the MVP auth flow in this step. Additional OAuth providers can be layered on later without restructuring the auth foundation.
- A real Supabase project may not be configured yet in every local environment, so the UI should fail clearly when required environment variables are missing.

## Scope

- Install and configure Supabase client packages for browser, server, and proxy usage.
- Add reusable Supabase auth utilities under `src/lib/supabase`.
- Implement a login page with email magic link submission and clear pending/success/error states.
- Implement the auth callback route that exchanges the auth code for a cookie-backed session.
- Protect `/dashboard` and `/assistants/[assistantId]` routes.
- Add a signed-in header state and logout action.
- Document the required auth environment variables and setup notes for local development.
- Add focused tests for auth-related validation/helpers where practical in this step.

## Out Of Scope

- Database schema, RLS policies, or assistant ownership queries
- Assistant CRUD or run APIs
- OAuth provider setup beyond leaving room for it
- Supabase service role usage
- Production-ready profile management UI

## Implementation Steps

1. Add auth dependencies and any missing test tooling needed for Step 02 validation.
2. Create Supabase env and client helpers:
   - browser client
   - server client
   - proxy session refresh helper
   - small auth utilities for route guarding and redirect handling
3. Add `proxy.ts` for session refresh and protected-route redirects.
4. Rebuild `/login` into a real auth page with:
   - email input
   - magic link submit action
   - loading, success, and failure messaging
5. Add `/auth/callback` to exchange the returned auth code for a session and redirect safely.
6. Update shared navigation/header to reflect signed-out vs signed-in state and provide logout.
7. Guard protected pages on the server and redirect authenticated users away from the login page.
8. Update docs and environment examples, then run lint, typecheck, and test.

## Risks

- Supabase SSR guidance is still based on the `@supabase/ssr` package, which the docs describe as unstable; keep the implementation thin and isolated.
- Auth redirects can break if local or deployed redirect URLs are not configured in Supabase.
- Route prefetching can briefly show unauthenticated content after sign-in if the callback flow is handled incorrectly.
- Missing environment variables could cause confusing runtime failures unless surfaced clearly in the login UI.

## Validation

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- Manually verify:
  - unauthenticated access to `/dashboard` redirects to `/login`
  - authenticated access to `/login` redirects to `/dashboard`
  - logout returns the user to a signed-out state
  - auth callback handles missing or invalid codes safely

## Deliverables

- `docs/execplans/step-02-auth.md`
- `docs/steps/bootstrap-step-02-auth.md`
- Supabase auth foundation under `src/lib/supabase`
- Login, callback, logout, and protected route flow
- Updated auth setup documentation
