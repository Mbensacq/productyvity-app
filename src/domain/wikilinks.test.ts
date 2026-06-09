import { describe, expect, it } from 'vitest';
import {
  extractLinkTargets,
  getActiveWikilinkQuery,
  parseWikilinks,
  wikilinkDisplayText,
} from './wikilinks';

describe('parseWikilinks', () => {
  it('parses a simple link', () => {
    const [link] = parseWikilinks('see [[Note A]] here');
    expect(link).toMatchObject({ target: 'Note A', heading: null, alias: null, embed: false });
    expect(link?.raw).toBe('[[Note A]]');
  });

  it('parses alias and heading', () => {
    expect(parseWikilinks('[[Target|Alias]]')[0]).toMatchObject({
      target: 'Target',
      alias: 'Alias',
      heading: null,
    });
    expect(parseWikilinks('[[Target#Heading]]')[0]).toMatchObject({
      target: 'Target',
      heading: 'Heading',
    });
    expect(parseWikilinks('[[Target#H|A]]')[0]).toMatchObject({
      target: 'Target',
      heading: 'H',
      alias: 'A',
    });
  });

  it('parses embeds and same-note heading links', () => {
    expect(parseWikilinks('![[Image]]')[0]).toMatchObject({ target: 'Image', embed: true });
    expect(parseWikilinks('[[#Section]]')[0]).toMatchObject({ target: '', heading: 'Section' });
  });

  it('parses multiple links with correct offsets', () => {
    const text = '[[A]] and [[B]]';
    const links = parseWikilinks(text);
    expect(links).toHaveLength(2);
    expect(text.slice(links[0]!.start, links[0]!.end)).toBe('[[A]]');
    expect(text.slice(links[1]!.start, links[1]!.end)).toBe('[[B]]');
  });

  it('ignores unterminated links and newlines inside brackets', () => {
    expect(parseWikilinks('[[Unterminated')).toHaveLength(0);
    expect(parseWikilinks('[[Line1\nLine2]]')).toHaveLength(0);
  });
});

describe('wikilinkDisplayText', () => {
  it('prefers alias, then heading, then target', () => {
    expect(wikilinkDisplayText(parseWikilinks('[[T|A]]')[0]!)).toBe('A');
    expect(wikilinkDisplayText(parseWikilinks('[[T#H]]')[0]!)).toBe('T#H');
    expect(wikilinkDisplayText(parseWikilinks('[[#H]]')[0]!)).toBe('#H');
    expect(wikilinkDisplayText(parseWikilinks('[[T]]')[0]!)).toBe('T');
  });
});

describe('extractLinkTargets', () => {
  it('returns distinct non-empty targets case-insensitively', () => {
    expect(extractLinkTargets('[[A]] [[a]] [[B]] [[#H]]')).toEqual(['A', 'B']);
  });
});

describe('getActiveWikilinkQuery', () => {
  it('returns the partial query inside an open link', () => {
    expect(getActiveWikilinkQuery('text [[No')).toBe('No');
    expect(getActiveWikilinkQuery('[[')).toBe('');
  });

  it('returns the part before a pipe', () => {
    expect(getActiveWikilinkQuery('[[Target|al')).toBe('Target');
  });

  it('returns null when not inside an open link', () => {
    expect(getActiveWikilinkQuery('no link here')).toBeNull();
    expect(getActiveWikilinkQuery('[[Closed]] then')).toBeNull();
    expect(getActiveWikilinkQuery('[[multi\nline')).toBeNull();
  });
});
