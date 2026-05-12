alter table public.assistant_templates
  drop constraint if exists assistant_templates_type_check;

alter table public.assistant_templates
  add constraint assistant_templates_type_check
  check (type in ('news', 'stock', 'baseball', 'real_estate'));

alter table public.user_assistants
  drop constraint if exists user_assistants_type_check;

alter table public.user_assistants
  add constraint user_assistants_type_check
  check (type in ('news', 'stock', 'baseball', 'real_estate'));

alter table public.assistant_runs
  drop constraint if exists assistant_runs_type_check;

alter table public.assistant_runs
  add constraint assistant_runs_type_check
  check (type in ('news', 'stock', 'baseball', 'real_estate'));

alter table public.assistant_sources
  drop constraint if exists assistant_sources_type_check;

alter table public.assistant_sources
  add constraint assistant_sources_type_check
  check (type in ('news', 'stock', 'baseball', 'real_estate'));
