import { describe, expect, it } from 'vitest';
import { parseTaskRow, taskInputToRow } from './taskMapping';

const validRow = {
  id: 't1',
  user_id: 'u1',
  title: 'Write tests',
  note_id: null,
  status: 'todo',
  priority: 2,
  estimate_min: 30,
  spent_min: 0,
  due: '2026-06-15',
  scheduled_event_id: null,
  implementation_intention: 'After lunch',
  defer_count: 1,
  parent_task_id: null,
  recurrence: { frequency: 'weekly', interval: 1 },
  goal_id: null,
  google_task_id: null,
  google_tasklist_id: null,
  sync_state: 'local',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
};

describe('parseTaskRow', () => {
  it('maps a row to the camelCase model and parses recurrence', () => {
    const task = parseTaskRow(validRow);
    expect(task).toMatchObject({
      id: 't1',
      userId: 'u1',
      title: 'Write tests',
      status: 'todo',
      priority: 2,
      estimateMin: 30,
      deferCount: 1,
      implementationIntention: 'After lunch',
    });
    expect(task.recurrence).toEqual({ frequency: 'weekly', interval: 1 });
  });

  it('keeps an invalid recurrence as null', () => {
    expect(parseTaskRow({ ...validRow, recurrence: { frequency: 'bad' } }).recurrence).toBeNull();
    expect(parseTaskRow({ ...validRow, recurrence: null }).recurrence).toBeNull();
  });

  it('throws on a malformed row', () => {
    expect(() => parseTaskRow({ id: 1 })).toThrow();
  });
});

describe('taskInputToRow', () => {
  it('maps only provided fields to snake_case', () => {
    expect(taskInputToRow({ title: 'X', estimateMin: 25, status: 'doing' })).toEqual({
      title: 'X',
      estimate_min: 25,
      status: 'doing',
    });
  });

  it('returns an empty payload for an empty input', () => {
    expect(taskInputToRow({})).toEqual({});
  });
});
