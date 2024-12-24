import { supabase } from './supabase';
import { Task } from '../types';

export async function createTask(projectId: string, task: Omit<Task, 'id'>) {
  if (!projectId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
    throw new Error('Invalid project ID format');
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      project_id: projectId,
      title: task.title,
      description: task.description,
      status: task.status,
      assigned_to: task.assignedTo,
      due_date: task.dueDate
    }])
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    assignedTo: data.assigned_to,
    dueDate: data.due_date
  };
}

export async function updateTaskStatus(taskId: string, status: Task['status']) {
  if (!taskId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
    throw new Error('Invalid task ID format');
  }

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId);

  if (error) throw error;
}

export async function deleteTask(taskId: string) {
  if (!taskId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
    throw new Error('Invalid task ID format');
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
}
export async function getProjectTasks(projectId: string) {
  if (!projectId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
    throw new Error('Invalid project ID format');
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(task => ({
    ...task,
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    assignedTo: task.assigned_to,
    dueDate: task.due_date
  }));
}