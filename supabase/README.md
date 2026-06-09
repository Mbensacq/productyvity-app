# Supabase backend

Versioned database schema, Row Level Security policies, Edge Functions and
pgTAP tests for the app.

## Layout

```
config.toml     local stack configuration
migrations/     versioned SQL (applied in order)
seed.sql        demo/seed data
tests/          pgTAP tests (RLS isolation, …)
functions/      Edge Functions (Deno) — added in Phase 3
```

## Local development (requires Docker)

```bash
supabase start          # boot local Postgres + Auth + Studio
supabase db reset       # apply all migrations + seed.sql
supabase test db        # run pgTAP tests in tests/
supabase stop
```

## CI

- `db-tests.yml` boots the local stack on every change under `supabase/**` and
  runs `supabase test db` (RLS isolation tests).
- `supabase.yml` links the linked project and runs `supabase db push` (+ deploys
  Edge Functions) once the `SUPABASE_*` secrets are configured (see `SETUP.md`).

## Conventions

Every user-owned table has: `id uuid` PK, `user_id uuid` defaulting to
`auth.uid()` and referencing `auth.users`, `created_at` / `updated_at`
timestamps (with the `set_updated_at` trigger), RLS enabled, and one policy per
command scoped to `auth.uid() = user_id`.
