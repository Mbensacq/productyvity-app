/**
 * Obsidian-style wikilink parsing. Pure functions over strings — no I/O.
 *
 * Supported forms:
 *   [[Target]]                link
 *   [[Target|Alias]]          link with display alias
 *   [[Target#Heading]]        link to a heading
 *   [[Target#Heading|Alias]]  heading link with alias
 *   [[#Heading]]              link to a heading in the current note (empty target)
 *   ![[Target]]               embed (bang prefix)
 */
export interface Wikilink {
  /** The full matched text including brackets, e.g. `[[A|b]]`. */
  raw: string;
  /** Target note title (trimmed). Empty string for same-note heading links. */
  target: string;
  /** Heading fragment after `#`, or null. */
  heading: string | null;
  /** Display alias after `|`, or null. */
  alias: string | null;
  /** True when prefixed with `!` (embed). */
  embed: boolean;
  /** Start index of the match in the source string. */
  start: number;
  /** End index (exclusive) of the match in the source string. */
  end: number;
}

const WIKILINK_RE = /(!?)\[\[([^\]\n]+?)\]\]/g;

export function parseWikilinks(text: string): Wikilink[] {
  const links: Wikilink[] = [];
  for (const match of text.matchAll(WIKILINK_RE)) {
    const inner = match[2];
    if (inner === undefined) {
      continue;
    }
    const raw = match[0];
    const start = match.index ?? 0;

    let rest = inner;
    let alias: string | null = null;
    const pipeIdx = rest.indexOf('|');
    if (pipeIdx !== -1) {
      alias = rest.slice(pipeIdx + 1).trim() || null;
      rest = rest.slice(0, pipeIdx);
    }

    let heading: string | null = null;
    const hashIdx = rest.indexOf('#');
    if (hashIdx !== -1) {
      heading = rest.slice(hashIdx + 1).trim() || null;
      rest = rest.slice(0, hashIdx);
    }

    links.push({
      raw,
      target: rest.trim(),
      heading,
      alias,
      embed: match[1] === '!',
      start,
      end: start + raw.length,
    });
  }
  return links;
}

/** Human-readable text to display for a link. */
export function wikilinkDisplayText(link: Wikilink): string {
  if (link.alias !== null) {
    return link.alias;
  }
  if (link.target === '' && link.heading !== null) {
    return `#${link.heading}`;
  }
  if (link.heading !== null) {
    return `${link.target}#${link.heading}`;
  }
  return link.target;
}

/** Distinct, non-empty target titles referenced in the text (case-insensitive dedupe). */
export function extractLinkTargets(text: string): string[] {
  const seen = new Set<string>();
  const targets: string[] = [];
  for (const link of parseWikilinks(text)) {
    if (link.target === '') {
      continue;
    }
    const key = link.target.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      targets.push(link.target);
    }
  }
  return targets;
}

/**
 * For editor autocomplete: when the caret sits inside an unclosed `[[…`, returns
 * the partial query typed so far (before any `|`); otherwise null.
 */
export function getActiveWikilinkQuery(textBeforeCaret: string): string | null {
  const open = textBeforeCaret.lastIndexOf('[[');
  if (open === -1) {
    return null;
  }
  const after = textBeforeCaret.slice(open + 2);
  if (after.includes(']]') || after.includes('\n')) {
    return null;
  }
  const pipeIdx = after.indexOf('|');
  return pipeIdx === -1 ? after : after.slice(0, pipeIdx);
}
