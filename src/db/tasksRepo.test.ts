import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const SUPABASE_URL = 'https://test.supabase.co';

const row = {
  id: 't1',
  user_id: 'u1',
  title: 'Write tests',
  note_id: null,
  status: 'todo',
  priority: null,
  estimate_min: null,
  spent_min: 0,
  due: null,
  scheduled_event_id: null,
  implementation_intention: null,
  defer_count: 0,
  parent_task_id: null,
  recurrence: null,
  goal_id: null,
  google_task_id: null,
  google_tasklist_id: null,
  sync_state: 'local',
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
  return import('./tasksRepo');
}

describe('tasksRepo (mocked network)', () => {
  it('listTasks fetches and maps rows', async () => {
    server.use(http.get(`${SUPABASE_URL}/rest/v1/tasks`, () => HttpResponse.json([row])));
    const repo = await loadRepo();
    const tasks = await repo.listTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({ id: 't1', title: 'Write tests', status: 'todo', spentMin: 0 });
  });
});
