import { getSupabase } from '@/lib/supabase';
import { NOTE_COLUMNS, noteInputToRow, parseNoteRow, type Note, type NoteInput } from './noteMapping';

export async function listNotes(): Promise<Note[]> {
  const { data, error } = await getSupabase()
    .from('notes')
    .select(NOTE_COLUMNS)
    .order('updated_at', { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []).map(parseNoteRow);
}

export async function getNoteById(id: string): Promise<Note | null> {
  const { data, error } = await getSupabase()
    .from('notes')
    .select(NOTE_COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data ? parseNoteRow(data) : null;
}

export async function createNote(input: NoteInput): Promise<Note> {
  const { data, error } = await getSupabase()
    .from('notes')
    .insert(noteInputToRow(input))
    .select(NOTE_COLUMNS)
    .single();
  if (error) {
    throw error;
  }
  return parseNoteRow(data);
}

export async function updateNote(id: string, patch: NoteInput): Promise<Note> {
  const { data, error } = await getSupabase()
    .from('notes')
    .update(noteInputToRow(patch))
    .eq('id', id)
    .select(NOTE_COLUMNS)
    .single();
  if (error) {
    throw error;
  }
  return parseNoteRow(data);
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await getSupabase().from('notes').delete().eq('id', id);
  if (error) {
    throw error;
  }
}

/** Server-side full-text search over the generated `search` vector. */
export async function searchNotesServer(query: string): Promise<Note[]> {
  const trimmed = query.trim();
  if (trimmed === '') {
    return [];
  }
  const { data, error } = await getSupabase()
    .from('notes')
    .select(NOTE_COLUMNS)
    .textSearch('search', trimmed, { type: 'websearch', config: 'simple' });
  if (error) {
    throw error;
  }
  return (data ?? []).map(parseNoteRow);
}
