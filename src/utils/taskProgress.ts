import { AIdeasLabTask } from '../types';

export interface ProjectProgress {
  projectId: string;
  projectName: string;
  completedTasks: number;
  totalTasks: number;
  progress: number;
}

export function calculateTaskProgress(tasks: AIdeasLabTask[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(task => task.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function calculateOverallProgress(projectsProgress: ProjectProgress[]): number {
  if (projectsProgress.length === 0) return 0;
  const totalProgress = projectsProgress.reduce((sum, p) => sum + p.progress, 0);
  return Math.round(totalProgress / projectsProgress.length);
}