import { Project } from '../types';

export function calculateProjectStats(projects: Project[]) {
  const totalProjects = projects.length;
  if (totalProjects === 0) {
    return {
      totalProgress: 0,
      completedTasks: 0,
      totalTasks: 0,
      activeProjects: 0
    };
  }

  const totalProgress = Math.round(
    projects.reduce((sum, project) => sum + (project.progress || 0), 0) / totalProjects
  );

  const completedTasks = projects.reduce(
    (sum, project) => sum + (project.completedTasks || 0),
    0
  );

  const totalTasks = projects.reduce(
    (sum, project) => sum + (project.totalTasks || 0),
    0
  );

  const activeProjects = projects.filter(
    project => project.status === 'active'
  ).length;

  return {
    totalProgress,
    completedTasks,
    totalTasks,
    activeProjects
  };
}