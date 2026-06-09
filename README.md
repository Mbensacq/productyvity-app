# Productivité — notes liées & productivité

A personal, multi-device knowledge & productivity web app combining Obsidian-style
linked Markdown notes (wikilinks, graph, backlinks) with Notion-style structured
views (databases: table / kanban / calendar), anti-procrastination tooling, and
Google Calendar / Tasks sync.

Single-user per account, but built multi-user-clean: every row is isolated by
`user_id` and protected by Postgres Row Level Security.

> Status: **Phase 0 (foundations)** in progress. See [`ROADMAP.md`](./ROADMAP.md).

## Architecture

```
React SPA (GitHub Pages, static)  ──HTTPS──>  Supabase
  - UI, editor, graph                          - Auth (Google OAuth, PKCE)
  - @supabase/supabase-js (anon key)           - Postgres + RLS + Realtime + Storage
  - TanStack Query (+ IndexedDB cache)         - Edge Functions (Deno):
  - Zustand (UI state)                            google-token-refresh / -calendar-sync / -tasks-sync
  - PWA / offline queue           <──Realtime──
```

- The frontend holds **no server secret** — only the public Supabase anon key
  and the public Google client id. Security rests entirely on **RLS**.
- `GOOGLE_CLIENT_SECRET` and the `service_role` key live only in Edge
  Functions / CI.
- Postgres is the source of truth; Realtime propagates changes; the client keeps
  an offline-first local cache.

## Tech stack

Vite · React 18 + TypeScript (strict) · react-router-dom (HashRouter) ·
TanStack Query (+ IndexedDB persistence) · Zustand · Zod ·
`@supabase/supabase-js` v2 · CodeMirror 6 (editor, Phase 1) ·
react-markdown + remark (Phase 1) · graph via react-force-graph (Phase 1) ·
date-fns · minisearch · Vitest + React Testing Library + MSW · Playwright (e2e) ·
ESLint + Prettier.

### Decisions / deviations

- **HashRouter** (not BrowserRouter) — avoids GitHub Pages SPA rewrites; no
  `404.html` fallback needed.
- **Graph**: `react-force-graph-2d` (lighter than Cytoscape for force layouts).
- **Calendar view**: custom component (avoids FullCalendar's GPL/commercial
  licensing and bundle weight). Re-evaluate if requirements grow.
- **ESLint**: non-type-checked `recommended` rules + strict `tsc --noEmit` for
  type safety (faster lint, full type coverage via the compiler).

## Development

```bash
cp .env.example .env.local      # fill in public Supabase + Google values
npm install
npm run dev
```

| Script               | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Vite dev server                          |
| `npm run build`      | Type-check then production build         |
| `npm run preview`    | Preview the production build             |
| `npm run lint`       | ESLint (zero warnings allowed)           |
| `npm run typecheck`  | `tsc --noEmit` (app + node configs)      |
| `npm run test`       | Vitest (unit + component)                |
| `npm run format`     | Prettier write                           |

Full external setup (Supabase, Google Cloud, GitHub Pages): see
[`SETUP.md`](./SETUP.md).

## Known limits

- **Google refresh token**: not managed by Supabase — refreshed by a custom Edge
  Function (Phase 3). In Google "Testing" status, refresh tokens for sensitive
  scopes expire after 7 days → **publish the app to Production** in Google Cloud.
- **Notifications**: best-effort only (in-app / Pomodoro). No reliable push when
  the app is closed without a dedicated push server.
- **Anon key is public**: safe **only** because of RLS. Any table without a
  policy leaks — RLS is tested in CI.
- **Bidirectional sync**: conflicts are resolved last-write-wins by `updated_at`
  / `etag`; a `conflict` state is surfaced in the UI, never a silent overwrite.
- **GitHub Pages is public** even from a private repo — harmless here: the repo
  ships no data, and all user data lives in Supabase behind auth + RLS.

## Project layout

```
src/
  app/         router
  components/  shared UI (layout, error boundary, …)
  features/    feature modules (auth, notes, …)
  hooks/       reusable hooks
  lib/         env, supabase client, query client, i18n, logger
  store/       Zustand stores
  test/        test setup & helpers
supabase/
  migrations/  versioned SQL
  functions/   Edge Functions (Deno) — Phase 3
  tests/       pgTAP RLS tests
```
