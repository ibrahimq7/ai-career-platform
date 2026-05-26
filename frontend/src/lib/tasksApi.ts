import { supabase } from './supabase';
import { Task, TaskPriority, TaskStatus } from '../types';

export type TaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
};

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }
  return supabase;
}

export async function listTasks() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function createTask(input: TaskInput) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('tasks')
    .insert({
      title: input.title,
      description: input.description || null,
      status: input.status ?? 'todo',
      priority: input.priority ?? 'medium',
      due_date: input.due_date || null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTask(id: string, patch: Partial<TaskInput>) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('tasks')
    .update({
      ...patch,
      description: patch.description === '' ? null : patch.description,
      due_date: patch.due_date === '' ? null : patch.due_date,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string) {
  const client = requireSupabase();
  const { error } = await client.from('tasks').delete().eq('id', id);
  if (error) throw error;
}
