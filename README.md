# My SECRETARY

My SECRETARY is a production-minded Next.js MVP for saved AI assistants.
Instead of a generic chat app, it lets a user keep task-specific assistants for
news, stocks, KBO baseball, and housing signals, then review structured results
inside a responsive dashboard.

## What It Does

- Authenticated assistant dashboard with user-owned assistant records
- Template-based assistant creation for news, stock, baseball, and real-estate
  flows
- Assistant detail pages with config summaries, run actions, latest result
  panels, and execution history
- Server-side AI execution through Route Handlers and assistant runners
- Zod-validated structured outputs for each assistant type
- Demo mode so the UI can still be reviewed without Supabase credentials

## Core Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase Auth and Postgres
- Zod
- Vitest

## Local Development

Install dependencies and start the dev server:

```bash
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

- If Supabase is configured, the root route becomes the signed-in dashboard
  after login.
- If Supabase is missing and `NEXT_PUBLIC_DEMO_MODE=true`, the app loads the
  demo dashboard and assistant detail pages without login.
- If Supabase is missing and demo mode is disabled, the root route stays on the
  guest gate.

On macOS or Linux, use:

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` into `.env.local` and fill in the values you need.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=
NEWS_PROVIDER=mock
STOCK_PROVIDER=mock
BASEBALL_PROVIDER=mock
REAL_ESTATE_PROVIDER=mock
```

Notes:

- `NEXT_PUBLIC_DEMO_MODE=true` keeps the app usable before Supabase is wired.
- `OPENAI_BASE_URL` is optional and only needed for an OpenAI-compatible
  provider.
- The MVP keeps all providers on `mock`.
- Supabase Auth redirect URLs should include
  `http://localhost:3000/auth/callback`.

## Supabase Schema Setup

Apply the SQL files in this order:

1. `supabase/migrations/20260509_step_03_assistant_schema.sql`
2. `supabase/migrations/20260514_step_08_expand_assistant_types.sql`
3. `supabase/seed.sql`

The schema includes:

- `assistant_templates`
- `user_assistants`
- `assistant_runs`
- `assistant_sources`
- RLS policies for user-owned data
- timestamp update triggers and basic indexes

## AI Assistant Run Architecture

Each assistant is defined by the combination below:

```txt
assistant_template
+ user_assistant.config
+ assistant_runner
+ provider_data
+ structured_output_schema
+ result_component
```

The execution flow is:

```txt
saved assistant config
-> provider fetch
-> assistant runner
-> OpenAI or compatible LLM call
-> Zod validation
-> assistant_runs persistence
-> assistant-specific result UI
```

Important guardrails:

- AI execution only happens on the server.
- Client code never imports protected API keys.
- Structured outputs must pass schema validation before being rendered.
- Stock assistants stay informational and always include a non-advice
  disclaimer.

## Mock Providers

The MVP starts with mock providers for all assistant types:

- `src/lib/providers/news.ts`
- `src/lib/providers/stock.ts`
- `src/lib/providers/baseball.ts`
- `src/lib/providers/real-estate.ts`

This keeps the runner architecture stable while allowing later migration to
real APIs with minimal UI churn.

## MVP Scope

Current MVP coverage:

- Guest gate plus demo-mode dashboard entry
- Supabase magic-link login flow
- Assistant template loading
- User assistant CRUD
- Assistant run persistence
- News result cards
- Stock result cards
- Baseball result cards
- Real-estate result cards
- Execution history and recent result rendering

## Validation

Run the main checks before merging a step branch:

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
```

## Repo Structure

```txt
src/
  app/
  components/
  lib/
  types/
  mocks/
tests/
docs/
supabase/
```

High-level ownership:

- `src/app`: App Router pages and API route handlers
- `src/components`: dashboard, assistant, layout, and shared UI components
- `src/lib/assistants`: assistant config, dashboard helpers, runner, execution,
  and repository logic
- `src/lib/providers`: mock provider implementations
- `src/lib/supabase`: auth, server clients, and mapping helpers
- `tests`: unit coverage for config validation, runners, schemas, routes, and
  dashboard helpers

## Future Expansion

- Swap mock providers for real news, market, sports, and housing feeds
- Add pagination and richer timeline controls for assistant runs
- Expand assistant types without collapsing back into a generic chat UI
- Tighten the portfolio presentation with deployment, analytics, and deeper
  product copy
