-- 0001_init.sql
-- Base helpers + per-user `settings` table with strict RLS.
-- Convention for every user-owned table: id uuid PK, user_id default auth.uid()
-- referencing auth.users, created_at/updated_at timestamps, RLS enabled with
-- one policy per command scoped to `auth.uid() = user_id`.

-- Touch `updated_at` on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ── settings ────────────────────────────────────────────────────────────────
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  templates jsonb not null default '{}'::jsonb,
  anti_procrastination jsonb not null default '{}'::jsonb,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists settings_user_id_idx on public.settings (user_id);

create trigger settings_set_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

alter table public.settings enable row level security;

-- Authenticated users may only ever touch their own row. anon has no access.
grant select, insert, update, delete on public.settings to authenticated;

create policy "settings_select_own"
  on public.settings for select
  using (auth.uid() = user_id);

create policy "settings_insert_own"
  on public.settings for insert
  with check (auth.uid() = user_id);

create policy "settings_update_own"
  on public.settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "settings_delete_own"
  on public.settings for delete
  using (auth.uid() = user_id);
