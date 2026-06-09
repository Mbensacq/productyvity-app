import { describe, expect, it } from 'vitest';
import { noteInputToRow, parseNoteRow } from './noteMapping';

const validRow = {
  id: 'n1',
  user_id: 'u1',
  title: 'Title',
  body: 'Body',
  frontmatter: { status: 'todo' },
  tags: ['a', 'b'],
  is_daily: false,
  daily_date: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
};

describe('parseNoteRow', () => {
  it('maps a snake_case row to the camelCase model', () => {
    expect(parseNoteRow(validRow)).toEqual({
      id: 'n1',
      userId: 'u1',
      title: 'Title',
      body: 'Body',
      frontmatter: { status: 'todo' },
      tags: ['a', 'b'],
      isDaily: false,
      dailyDate: null,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z',
    });
  });

  it('throws on a malformed row', () => {
    expect(() => parseNoteRow({ id: 1 })).toThrow();
  });
});

describe('noteInputToRow', () => {
  it('includes only provided fields, mapping to snake_case', () => {
    expect(noteInputToRow({ title: 'T', isDaily: true, dailyDate: '2026-06-09' })).toEqual({
      title: 'T',
      is_daily: true,
      daily_date: '2026-06-09',
    });
  });

  it('returns an empty payload for an empty input', () => {
    expect(noteInputToRow({})).toEqual({});
  });
});
