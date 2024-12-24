import React from 'react';
import { Users } from 'lucide-react';
import { Project } from '../../../types';
import { getProjectTasks } from '../../../lib/aideasLabTasks';
import { ProjectProgress, calculateTaskProgress, calculateOverallProgress } from '../../../utils/taskProgress';

interface ProgressSummaryProps {
  projects: Project[];
}

export default function ProgressSummary({ projects }: ProgressSummaryProps) {
  const [projectsProgress, setProjectsProgress] = React.useState<ProjectProgress[]>([]);

  React.useEffect(() => {
    async function loadProjectsProgress() {
      const progressPromises = projects.map(async (project) => {
        const tasks = await getProjectTasks(project.id);
        const completedTasks = tasks.filter(task => task.completed).length;
        const progress = calculateTaskProgress(tasks);

        return {
          projectId: project.id,
          projectName: project.name,
          completedTasks,
          totalTasks: tasks.length,
          progress
        };
      });

      const progress = await Promise.all(progressPromises);
      setProjectsProgress(progress);
    }

    loadProjectsProgress();
    const interval = setInterval(loadProjectsProgress, 30000);
    return () => clearInterval(interval);
  }, [projects]);

  const overallProgress = calculateOverallProgress(projectsProgress);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover-lift animate-fade-in">
      <div className="flex items-center mb-6">
        <Users className="h-6 w-6 text-blue-600" />
        <h2 className="ml-2 text-lg font-medium">Progresso Geral</h2>
      </div>
      <div className="space-y-4">
        {projectsProgress.map((project) => (
          <div key={project.projectId} className="space-y-2 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  {project.projectName}
                </span>
                <span className="text-xs text-gray-500 block">
                  {project.completedTasks} de {project.totalTasks} tasks concluídas
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out progress-bar"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
        
        <div className="pt-6 border-t border-gray-100 animate-scale-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Progresso Total</span>
            <span className="text-sm font-medium text-blue-600">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out progress-bar"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}