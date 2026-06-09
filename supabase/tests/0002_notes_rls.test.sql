-- pgTAP RLS + full-text tests for notes and note_links.
-- Run with `supabase test db`.

begin;

select plan(7);

insert into auth.users (id, email)
values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com');

set local role authenticated;

-- ── Alice ────────────────────────────────────────────────────────────────────
select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}',
  true
);

select lives_ok(
  $$ insert into public.notes (title, body)
     values ('Hello', 'hello world note about [[Other]]') $$,
  'Alice can insert her own note'
);

select is(
  (select count(*)::int from public.notes),
  1,
  'Alice sees her own note'
);

select is(
  (select count(*)::int from public.notes where search @@ to_tsquery('simple', 'hello')),
  1,
  'Generated full-text vector matches the note'
);

select lives_ok(
  $$ insert into public.note_links (source_note_id, target_title)
     values ((select id from public.notes where user_id = auth.uid() limit 1), 'Other') $$,
  'Alice can insert a note link'
);

select throws_ok(
  $$ insert into public.notes (user_id, title)
     values ('22222222-2222-2222-2222-222222222222', 'sneaky') $$,
  '42501',
  null,
  'Alice cannot insert a note owned by Bob'
);

-- ── Bob ──────────────────────────────────────────────────────────────────────
select set_config(
  'request.jwt.claims',
  '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}',
  true
);

select is(
  (select count(*)::int from public.notes),
  0,
  'Bob cannot see Alice''s notes'
);

select is(
  (select count(*)::int from public.note_links),
  0,
  'Bob cannot see Alice''s note links'
);

select * from finish();

rollback;
