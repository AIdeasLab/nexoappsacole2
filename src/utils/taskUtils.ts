import { AIdeasLabTask } from '../types';

export interface TaskWithDueDate {
  projectId: string;
  projectName: string;
  taskTitle: string;
  dueDate: Date;
}

export function sortTasksByDueDate(tasks: TaskWithDueDate[]): TaskWithDueDate[] {
  return [...tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function filterUpcomingTasks(tasks: TaskWithDueDate[]): TaskWithDueDate[] {
  const now = new Date();
  return tasks.filter(task => 
    task.dueDate > now && !task.dueDate.toString().includes('Invalid')
  );
}

export function formatTaskDueDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Amanhã';
  }
  return date.toLocaleDateString();
}