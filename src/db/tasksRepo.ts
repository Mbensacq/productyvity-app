import { getSupabase } from '@/lib/supabase';
import { parseTaskRow, TASK_COLUMNS, taskInputToRow, type Task, type TaskInput } from './taskMapping';

export async function listTasks(): Promise<Task[]> {
  const { data, error } = await getSupabase()
    .from('tasks')
    .select(TASK_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []).map(parseTaskRow);
}

export async function createTask(input: TaskInput): Promise<Task> {
  const { data, error } = await getSupabase()
    .from('tasks')
    .insert(taskInputToRow(input))
    .select(TASK_COLUMNS)
    .single();
  if (error) {
    throw error;
  }
  return parseTaskRow(data);
}

export async function updateTask(id: string, patch: TaskInput): Promise<Task> {
  const { data, error } = await getSupabase()
    .from('tasks')
    .update(taskInputToRow(patch))
    .eq('id', id)
    .select(TASK_COLUMNS)
    .single();
  if (error) {
    throw error;
  }
  return parseTaskRow(data);
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await getSupabase().from('tasks').delete().eq('id', id);
  if (error) {
    throw error;
  }
}
