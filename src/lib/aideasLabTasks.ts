import { supabase } from './supabase';
import { AIdeasLabTask } from '../types';

export async function getProjectTasks(projectId: string): Promise<AIdeasLabTask[]> {
  const { data, error } = await supabase
    .from('aideas_lab_tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data;
}

export async function toggleTaskCompletion(taskId: string, completed: boolean) {
  const { error } = await supabase
    .from('aideas_lab_tasks')
    .update({ completed })
    .eq('id', taskId);

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function createTask(task: Omit<AIdeasLabTask, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('aideas_lab_tasks')
    .insert([task])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return data;
}