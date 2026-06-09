import { z } from 'zod';

/** Shape of a `notes` row as returned by Supabase (snake_case). */
export const noteRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  body: z.string(),
  frontmatter: z.record(z.unknown()),
  tags: z.array(z.string()),
  is_daily: z.boolean(),
  daily_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type NoteRow = z.infer<typeof noteRowSchema>;

/** Application-facing note model (camelCase). */
export interface Note {
  id: string;
  userId: string;
  title: string;
  body: string;
  frontmatter: Record<string, unknown>;
  tags: string[];
  isDaily: boolean;
  dailyDate: string | null;
  createdAt: string;
  updatedAt: string;
}

/** The columns to select (everything except the generated `search` vector). */
export const NOTE_COLUMNS =
  'id,user_id,title,body,frontmatter,tags,is_daily,daily_date,created_at,updated_at';

/** Validates and maps a raw Supabase row to the app model. Throws on shape mismatch. */
export function parseNoteRow(row: unknown): Note {
  const r = noteRowSchema.parse(row);
  return {
    id: r.id,
    userId: r.user_id,
    title: r.title,
    body: r.body,
    frontmatter: r.frontmatter,
    tags: r.tags,
    isDaily: r.is_daily,
    dailyDate: r.daily_date,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export interface NoteInput {
  title?: string;
  body?: string;
  frontmatter?: Record<string, unknown>;
  tags?: string[];
  isDaily?: boolean;
  dailyDate?: string | null;
}

/** Maps a partial app-model input to a snake_case row payload for insert/update. */
export function noteInputToRow(input: NoteInput): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.body !== undefined) row.body = input.body;
  if (input.frontmatter !== undefined) row.frontmatter = input.frontmatter;
  if (input.tags !== undefined) row.tags = input.tags;
  if (input.isDaily !== undefined) row.is_daily = input.isDaily;
  if (input.dailyDate !== undefined) row.daily_date = input.dailyDate;
  return row;
}
