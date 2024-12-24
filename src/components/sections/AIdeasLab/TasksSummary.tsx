import React from 'react';
import { CheckSquare } from 'lucide-react';
import { Project } from '../../../types';
import { getProjectTasks } from '../../../lib/aideasLabTasks';

interface TasksSummaryProps {
  projects: Project[];
}

export default function TasksSummary({ projects }: TasksSummaryProps) {
  const [projectTasks, setProjectTasks] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    async function loadAllProjectTasks() {
      const tasksPromises = projects.map(async (project) => {
        const tasks = await getProjectTasks(project.id);
        return { 
          id: project.id, 
          pending: tasks.filter(t => !t.completed).length 
        };
      });

      const results = await Promise.all(tasksPromises);
      const tasksMap = results.reduce((acc, { id, pending }) => {
        acc[id] = pending;
        return acc;
      }, {} as Record<string, number>);

      setProjectTasks(tasksMap);
    }

    loadAllProjectTasks();
    const interval = setInterval(loadAllProjectTasks, 30000);
    return () => clearInterval(interval);
  }, [projects]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <CheckSquare className="h-6 w-6 text-blue-600" />
        <h2 className="ml-2 text-lg font-medium">Tasks Pendentes</h2>
      </div>
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{project.name}</span>
            <span className="text-sm font-medium text-gray-900">
              {projectTasks[project.id] || 0} pendentes
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}