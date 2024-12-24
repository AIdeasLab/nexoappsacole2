import React from 'react';
import { Calendar, CheckCircle, Circle } from 'lucide-react';
import { getProjectTasks, toggleTaskCompletion } from '../../../lib/aideasLabTasks';
import { AIdeasLabTask } from '../../../types';

interface TaskListProps {
  projectId: string;
}

export default function TaskList({ projectId }: TaskListProps) {
  const [tasks, setTasks] = React.useState<AIdeasLabTask[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function loadTasks() {
    const projectTasks = await getProjectTasks(projectId);
    setTasks(projectTasks);
    setLoading(false);
  }

  React.useEffect(() => {
    loadTasks();
  }, [projectId]);

  async function handleToggleTask(taskId: string, completed: boolean) {
    try {
      await toggleTaskCompletion(taskId, completed);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, completed } : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando tasks...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <button
              onClick={() => handleToggleTask(task.id, !task.completed)}
              className="mt-1"
            >
              {task.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </button>
            <div className="flex-1">
              <h3 className={`text-lg font-medium ${
                task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              <p className={`text-sm ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(task.due_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            Nenhuma task encontrada.
          </div>
        )}
      </div>
    </div>
  );
}