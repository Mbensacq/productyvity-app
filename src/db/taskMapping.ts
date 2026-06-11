import { z } from 'zod';
import { parseRecurrenceRule, type RecurrenceRule } from '@/domain/recurrence';

export const TASK_STATUSES = ['inbox', 'todo', 'doing', 'done', 'someday'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type SyncState = 'local' | 'synced' | 'pending' | 'conflict';

export const taskRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  note_id: z.string().nullable(),
  status: z.enum(TASK_STATUSES),
  priority: z.number().nullable(),
  estimate_min: z.number().nullable(),
  spent_min: z.number(),
  due: z.string().nullable(),
  scheduled_event_id: z.string().nullable(),
  implementation_intention: z.string().nullable(),
  defer_count: z.number(),
  parent_task_id: z.string().nullable(),
  recurrence: z.unknown().nullable(),
  goal_id: z.string().nullable(),
  google_task_id: z.string().nullable(),
  google_tasklist_id: z.string().nullable(),
  sync_state: z.enum(['local', 'synced', 'pending', 'conflict']),
  created_at: z.string(),
  updated_at: z.string(),
});

export type TaskRow = z.infer<typeof taskRowSchema>;

export interface Task {
  id: string;
  userId: string;
  title: string;
  noteId: string | null;
  status: TaskStatus;
  priority: number | null;
  estimateMin: number | null;
  spentMin: number;
  due: string | null;
  scheduledEventId: string | null;
  implementationIntention: string | null;
  deferCount: number;
  parentTaskId: string | null;
  recurrence: RecurrenceRule | null;
  goalId: string | null;
  googleTaskId: string | null;
  googleTasklistId: string | null;
  syncState: SyncState;
  createdAt: string;
  updatedAt: string;
}

export const TASK_COLUMNS =
  'id,user_id,title,note_id,status,priority,estimate_min,spent_min,due,scheduled_event_id,' +
  'implementation_intention,defer_count,parent_task_id,recurrence,goal_id,google_task_id,' +
  'google_tasklist_id,sync_state,created_at,updated_at';

export function parseTaskRow(row: unknown): Task {
  const r = taskRowSchema.parse(row);
  return {
    id: r.id,
    userId: r.user_id,
    title: r.title,
    noteId: r.note_id,
    status: r.status,
    priority: r.priority,
    estimateMin: r.estimate_min,
    spentMin: r.spent_min,
    due: r.due,
    scheduledEventId: r.scheduled_event_id,
    implementationIntention: r.implementation_intention,
    deferCount: r.defer_count,
    parentTaskId: r.parent_task_id,
    recurrence: parseRecurrenceRule(r.recurrence),
    goalId: r.goal_id,
    googleTaskId: r.google_task_id,
    googleTasklistId: r.google_tasklist_id,
    syncState: r.sync_state,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export interface TaskInput {
  title?: string;
  noteId?: string | null;
  status?: TaskStatus;
  priority?: number | null;
  estimateMin?: number | null;
  spentMin?: number;
  due?: string | null;
  implementationIntention?: string | null;
  deferCount?: number;
  parentTaskId?: string | null;
  recurrence?: RecurrenceRule | null;
  goalId?: string | null;
}

export function taskInputToRow(input: TaskInput): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.noteId !== undefined) row.note_id = input.noteId;
  if (input.status !== undefined) row.status = input.status;
  if (input.priority !== undefined) row.priority = input.priority;
  if (input.estimateMin !== undefined) row.estimate_min = input.estimateMin;
  if (input.spentMin !== undefined) row.spent_min = input.spentMin;
  if (input.due !== undefined) row.due = input.due;
  if (input.implementationIntention !== undefined)
    row.implementation_intention = input.implementationIntention;
  if (input.deferCount !== undefined) row.defer_count = input.deferCount;
  if (input.parentTaskId !== undefined) row.parent_task_id = input.parentTaskId;
  if (input.recurrence !== undefined) row.recurrence = input.recurrence;
  if (input.goalId !== undefined) row.goal_id = input.goalId;
  return row;
}
