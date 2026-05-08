create extension if not exists pgcrypto with schema public;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.assistant_templates (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('news', 'stock')),
  name text not null,
  description text not null,
  avatar_key text not null,
  system_prompt text not null,
  default_config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint assistant_templates_default_config_object
    check (jsonb_typeof(default_config) = 'object')
);

create table if not exists public.user_assistants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null references public.assistant_templates(id) on delete restrict,
  type text not null check (type in ('news', 'stock')),
  name text not null,
  config jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint user_assistants_config_object
    check (jsonb_typeof(config) = 'object')
);

create table if not exists public.assistant_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_assistant_id uuid not null references public.user_assistants(id) on delete cascade,
  type text not null check (type in ('news', 'stock')),
  status text not null check (status in ('pending', 'success', 'failed')),
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  error_message text,
  provider_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  constraint assistant_runs_input_object
    check (jsonb_typeof(input) = 'object'),
  constraint assistant_runs_provider_meta_object
    check (jsonb_typeof(provider_meta) = 'object'),
  constraint assistant_runs_output_object_or_null
    check (output is null or jsonb_typeof(output) = 'object')
);

create table if not exists public.assistant_sources (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.assistant_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('news', 'stock')),
  title text not null,
  source_name text,
  source_url text,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_assistant_templates_updated_at on public.assistant_templates;
create trigger set_assistant_templates_updated_at
before update on public.assistant_templates
for each row
execute function public.set_updated_at();

drop trigger if exists set_user_assistants_updated_at on public.user_assistants;
create trigger set_user_assistants_updated_at
before update on public.user_assistants
for each row
execute function public.set_updated_at();

create index if not exists assistant_templates_active_type_idx
  on public.assistant_templates (is_active, type);

create index if not exists user_assistants_user_sort_idx
  on public.user_assistants (user_id, sort_order, created_at desc);

create index if not exists user_assistants_template_idx
  on public.user_assistants (template_id);

create index if not exists assistant_runs_user_created_idx
  on public.assistant_runs (user_id, created_at desc);

create index if not exists assistant_runs_assistant_created_idx
  on public.assistant_runs (user_assistant_id, created_at desc);

create index if not exists assistant_runs_status_idx
  on public.assistant_runs (status);

create index if not exists assistant_sources_run_created_idx
  on public.assistant_sources (run_id, created_at desc);

create index if not exists assistant_sources_user_created_idx
  on public.assistant_sources (user_id, created_at desc);

alter table public.assistant_templates enable row level security;
alter table public.user_assistants enable row level security;
alter table public.assistant_runs enable row level security;
alter table public.assistant_sources enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'assistant_templates'
      and policyname = 'Authenticated users can read active assistant templates'
  ) then
    create policy "Authenticated users can read active assistant templates"
      on public.assistant_templates
      for select
      to authenticated
      using (is_active = true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_assistants'
      and policyname = 'Users can read own assistants'
  ) then
    create policy "Users can read own assistants"
      on public.user_assistants
      for select
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_assistants'
      and policyname = 'Users can insert own assistants'
  ) then
    create policy "Users can insert own assistants"
      on public.user_assistants
      for insert
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_assistants'
      and policyname = 'Users can update own assistants'
  ) then
    create policy "Users can update own assistants"
      on public.user_assistants
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_assistants'
      and policyname = 'Users can delete own assistants'
  ) then
    create policy "Users can delete own assistants"
      on public.user_assistants
      for delete
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'assistant_runs'
      and policyname = 'Users can read own runs'
  ) then
    create policy "Users can read own runs"
      on public.assistant_runs
      for select
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'assistant_runs'
      and policyname = 'Users can insert own runs'
  ) then
    create policy "Users can insert own runs"
      on public.assistant_runs
      for insert
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'assistant_runs'
      and policyname = 'Users can update own runs'
  ) then
    create policy "Users can update own runs"
      on public.assistant_runs
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'assistant_sources'
      and policyname = 'Users can read own assistant sources'
  ) then
    create policy "Users can read own assistant sources"
      on public.assistant_sources
      for select
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'assistant_sources'
      and policyname = 'Users can insert own assistant sources'
  ) then
    create policy "Users can insert own assistant sources"
      on public.assistant_sources
      for insert
      with check (auth.uid() = user_id);
  end if;
end
$$;
