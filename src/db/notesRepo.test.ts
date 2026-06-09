import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const SUPABASE_URL = 'https://test.supabase.co';

const row = {
  id: 'n1',
  user_id: 'u1',
  title: 'T',
  body: 'B',
  frontmatter: {},
  tags: [],
  is_daily: false,
  daily_date: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
};

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  vi.unstubAllEnvs();
});
afterAll(() => server.close());

async function loadRepo() {
  vi.resetModules();
  vi.stubEnv('VITE_SUPABASE_URL', SUPABASE_URL);
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key');
  return import('./notesRepo');
}

describe('notesRepo (mocked network)', () => {
  it('listNotes fetches and maps rows', async () => {
    server.use(http.get(`${SUPABASE_URL}/rest/v1/notes`, () => HttpResponse.json([row])));
    const repo = await loadRepo();
    const notes = await repo.listNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0]).toMatchObject({ id: 'n1', userId: 'u1', title: 'T' });
  });

  it('searchNotesServer short-circuits a blank query without a request', async () => {
    const repo = await loadRepo();
    expect(await repo.searchNotesServer('   ')).toEqual([]);
  });

  it('searchNotesServer maps full-text results', async () => {
    server.use(http.get(`${SUPABASE_URL}/rest/v1/notes`, () => HttpResponse.json([row])));
    const repo = await loadRepo();
    const results = await repo.searchNotesServer('hello');
    expect(results[0]?.id).toBe('n1');
  });
});
