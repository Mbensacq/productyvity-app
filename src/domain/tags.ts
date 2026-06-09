/**
 * Extract `#tags` from note text. Pure function, no I/O.
 *
 * Rules (matching Obsidian closely enough for our needs):
 * - a tag starts at line start or after whitespace / `(` (not mid-word, so URL
 *   fragments like `site#frag` are ignored);
 * - tag chars are letters, digits, `_`, `-`, `/` (nested tags);
 * - a tag must contain at least one non-digit (so `#123` is not a tag);
 * - ATX headings (`# Title`) are ignored because the space breaks the run.
 */
const TAG_RE = /(?<=^|\s|\()#([A-Za-z0-9_\-/]+)/gm;

export function extractTags(text: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const match of text.matchAll(TAG_RE)) {
    const tag = match[1];
    if (tag === undefined) {
      continue;
    }
    if (!/[A-Za-z_/-]/.test(tag)) {
      continue;
    }
    const key = tag.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      tags.push(tag);
    }
  }
  return tags;
}
