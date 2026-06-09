import { describe, expect, it } from 'vitest';
import { parseNoteContent, serializeNoteContent } from './frontmatter';

describe('parseNoteContent', () => {
  it('splits frontmatter from body', () => {
    const result = parseNoteContent('---\ntitle: Hello\ntags:\n  - a\n  - b\n---\nBody text');
    expect(result.frontmatter).toEqual({ title: 'Hello', tags: ['a', 'b'] });
    expect(result.body).toBe('Body text');
  });

  it('returns empty frontmatter when there is no fence', () => {
    expect(parseNoteContent('Just a body')).toEqual({ frontmatter: {}, body: 'Just a body' });
  });

  it('keeps content as body when YAML is malformed', () => {
    const content = '---\n: : bad : yaml\n---\nBody';
    const result = parseNoteContent(content);
    expect(result.frontmatter).toEqual({});
    expect(result.body).toBe(content);
  });

  it('treats non-object frontmatter as empty', () => {
    const result = parseNoteContent('---\n- just\n- a\n- list\n---\nBody');
    expect(result.frontmatter).toEqual({});
    expect(result.body).toBe('Body');
  });
});

describe('serializeNoteContent', () => {
  it('omits the fence when frontmatter is empty', () => {
    expect(serializeNoteContent({ frontmatter: {}, body: 'Body' })).toBe('Body');
  });

  it('round-trips frontmatter and body', () => {
    const original = { frontmatter: { title: 'T', status: 'todo', n: 3 }, body: 'Hello\nWorld' };
    const serialized = serializeNoteContent(original);
    expect(parseNoteContent(serialized)).toEqual(original);
  });
});
