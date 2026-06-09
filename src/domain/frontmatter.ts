import yaml from 'js-yaml';
import { z } from 'zod';

/**
 * YAML frontmatter parsing/serialization. The note's stored `body` excludes the
 * frontmatter fence; `frontmatter` is a plain object. Pure, no I/O.
 */
export interface ParsedNote {
  frontmatter: Record<string, unknown>;
  body: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/;
const recordSchema = z.record(z.unknown());

export function parseNoteContent(content: string): ParsedNote {
  const match = FRONTMATTER_RE.exec(content);
  if (match === null) {
    return { frontmatter: {}, body: content };
  }

  const body = content.slice(match[0].length);
  let data: unknown;
  try {
    data = yaml.load(match[1] ?? '');
  } catch {
    // Malformed YAML: keep the original content as body so nothing is lost.
    return { frontmatter: {}, body: content };
  }

  const parsed = recordSchema.safeParse(data ?? {});
  return { frontmatter: parsed.success ? parsed.data : {}, body };
}

export function serializeNoteContent(note: ParsedNote): string {
  if (Object.keys(note.frontmatter).length === 0) {
    return note.body;
  }
  const yamlText = yaml.dump(note.frontmatter, { lineWidth: -1, sortKeys: false }).trimEnd();
  return `---\n${yamlText}\n---\n${note.body}`;
}
