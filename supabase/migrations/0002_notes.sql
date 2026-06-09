-- 0002_notes.sql
-- Notes (Markdown + frontmatter) and the link graph table, with RLS and a
-- generated full-text search vector.

-- ── notes ────────────────────────────────────────────────────────────────────
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null default '',
  body text not null default '',
  frontmatter jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}'::text[],
  is_daily boolean not null default false,
  daily_date date,
  search tsvector generated always as (
    setweight(to_tsvector('simple'::regconfig, coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(body, '')), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_id_idx on public.notes (user_id);
create index if not exists notes_search_idx on public.notes using gin (search);
create index if not exists notes_tags_idx on public.notes using gin (tags);
create index if not exists notes_user_title_idx on public.notes (user_id, lower(title));
create unique index if not exists notes_daily_unique_idx
  on public.notes (user_id, daily_date)
  where is_daily and daily_date is not null;

create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

alter table public.notes enable row level security;
grant select, insert, update, delete on public.notes to authenticated;

create policy "notes_select_own" on public.notes for select using (auth.uid() = user_id);
create policy "notes_insert_own" on public.notes for insert with check (auth.uid() = user_id);
create policy "notes_update_own" on public.notes for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notes_delete_own" on public.notes for delete using (auth.uid() = user_id);

-- ── note_links ───────────────────────────────────────────────────────────────
-- One row per wikilink occurrence. target_note_id is null when the link is
-- unresolved (the target note does not exist yet). Powers the graph + backlinks.
create table if not exists public.note_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  source_note_id uuid not null references public.notes (id) on delete cascade,
  target_note_id uuid references public.notes (id) on delete set null,
  target_title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists note_links_user_id_idx on public.note_links (user_id);
create index if not exists note_links_source_idx on public.note_links (source_note_id);
create index if not exists note_links_target_idx on public.note_links (target_note_id);
create index if not exists note_links_target_title_idx
  on public.note_links (user_id, lower(target_title));

create trigger note_links_set_updated_at
before update on public.note_links
for each row execute function public.set_updated_at();

alter table public.note_links enable row level security;
grant select, insert, update, delete on public.note_links to authenticated;

create policy "note_links_select_own" on public.note_links for select using (auth.uid() = user_id);
create policy "note_links_insert_own" on public.note_links for insert with check (auth.uid() = user_id);
create policy "note_links_update_own" on public.note_links for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "note_links_delete_own" on public.note_links for delete using (auth.uid() = user_id);
