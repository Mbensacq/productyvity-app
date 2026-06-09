import { getSupabase } from '@/lib/supabase';

export interface NoteLinkTarget {
  targetTitle: string;
  /** Resolved note id, or null for an unresolved link. */
  targetId: string | null;
}

/**
 * Replaces all outgoing links for a note: deletes existing rows then inserts the
 * current set. Called after a note is saved so the persisted graph stays in sync.
 */
export async function replaceNoteLinks(
  sourceNoteId: string,
  targets: NoteLinkTarget[],
): Promise<void> {
  const supabase = getSupabase();

  const deletion = await supabase.from('note_links').delete().eq('source_note_id', sourceNoteId);
  if (deletion.error) {
    throw deletion.error;
  }

  if (targets.length === 0) {
    return;
  }

  const rows = targets.map((target) => ({
    source_note_id: sourceNoteId,
    target_note_id: target.targetId,
    target_title: target.targetTitle,
  }));

  const insertion = await supabase.from('note_links').insert(rows);
  if (insertion.error) {
    throw insertion.error;
  }
}
