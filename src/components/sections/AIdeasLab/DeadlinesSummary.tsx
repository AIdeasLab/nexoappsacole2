import React from 'react';
import { Calendar } from 'lucide-react';
import { Project } from '../../../types';
import { getProjectTasks } from '../../../lib/aideasLabTasks';
import { 
  TaskWithDueDate, 
  sortTasksByDueDate, 
  filterUpcomingTasks,
  formatTaskDueDate 
} from '../../../utils/taskUtils';

interface DeadlinesSummaryProps {
  projects: Project[];
}

export default function DeadlinesSummary({ projects }: DeadlinesSummaryProps) {
  const [upcomingTasks, setUpcomingTasks] = React.useState<TaskWithDueDate[]>([]);

  React.useEffect(() => {
    async function loadTaskDeadlines() {
      const tasksPromises = projects.map(async (project) => {
        const tasks = await getProjectTasks(project.id);
        return tasks.map(task => ({
          projectId: project.id,
          projectName: project.name,
          taskTitle: task.title,
          dueDate: new Date(task.due_date)
        }));
      });

      const allTasks = (await Promise.all(tasksPromises)).flat();
      const upcoming = filterUpcomingTasks(sortTasksByDueDate(allTasks));
      setUpcomingTasks(upcoming.slice(0, 5)); // Show only next 5 deadlines
    }

    loadTaskDeadlines();
    const interval = setInterval(loadTaskDeadlines, 30000);
    return () => clearInterval(interval);
  }, [projects]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h2 className="ml-2 text-lg font-medium">Próximos Prazos</h2>
      </div>
      <div className="space-y-3">
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {task.taskTitle}
                </span>
                <span className="text-sm text-blue-600 font-medium">
                  {formatTaskDueDate(task.dueDate)}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {task.projectName}
              </span>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 text-center py-2">
            Nenhum prazo próximo
          </div>
        )}
      </div>
    </div>
  );
}