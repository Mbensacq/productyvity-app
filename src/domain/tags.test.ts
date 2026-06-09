import { describe, expect, it } from 'vitest';
import { extractTags } from './tags';

describe('extractTags', () => {
  it('extracts simple and nested tags', () => {
    expect(extractTags('a #project and #area/work here')).toEqual(['project', 'area/work']);
  });

  it('dedupes case-insensitively, preserving first casing', () => {
    expect(extractTags('#Todo #todo #TODO')).toEqual(['Todo']);
  });

  it('ignores numeric-only tags and mid-word hashes', () => {
    expect(extractTags('#123 site.com#frag word#nope')).toEqual([]);
  });

  it('ignores ATX markdown headings', () => {
    expect(extractTags('# Heading\n## Sub\ntext #real')).toEqual(['real']);
  });

  it('matches tags at line start', () => {
    expect(extractTags('#first\n#second')).toEqual(['first', 'second']);
  });

  it('returns empty array when there are no tags', () => {
    expect(extractTags('plain text')).toEqual([]);
  });
});
