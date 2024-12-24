import React from 'react';
import { Trash2 } from 'lucide-react';
import { Project, Task } from '../../../../types';
import { updateTaskStatus, getProjectTasks, deleteTask } from '../../../../lib/tasks';
import TaskDetail from '../../../TaskDetail';
import TaskForm from '../../../TaskForm';

interface KanbanBoardProps {
  project: Project;
}

const columns = [
  { 
    id: 'todo',
    title: 'A Fazer',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    cardBg: 'hover:bg-red-50'
  },
  { 
    id: 'in-progress',
    title: 'Em Andamento',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    cardBg: 'hover:bg-yellow-50'
  },
  { 
    id: 'done',
    title: 'Concluído',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    cardBg: 'hover:bg-green-50'
  }
];

export default function KanbanBoard({ project }: KanbanBoardProps) {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  React.useEffect(() => {
    async function loadTasks() {
      try {
        const projectTasks = await getProjectTasks(project.id);
        setTasks(projectTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
    loadTasks();
  }, [project.id]);

  async function handleDragStart(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData('taskId', taskId);
  }

  async function handleDrop(e: React.DragEvent, status: Task['status']) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    try {
      await updateTaskStatus(taskId, status);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }

  async function handleDeleteTask(taskId: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  const getTasksByStatus = (status: Task['status']) => 
    tasks.filter(task => task.status === status);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Tarefas</h2>
      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
      <div className="mb-6">
        <TaskForm
          projectId={project.id}
          onTaskCreated={async () => {
            const updatedTasks = await getProjectTasks(project.id);
            setTasks(updatedTasks);
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-6">
        {columns.map(column => (
          <div
            key={column.id}
            className={`${column.bgColor} rounded-lg p-6 min-h-[600px]`}
            onDrop={e => handleDrop(e, column.id as Task['status'])}
            onDragOver={handleDragOver}
          >
            <h3 className="text-lg font-medium text-gray-700 mb-6">
              {column.title}
            </h3>
            <div className="space-y-4">
              {getTasksByStatus(column.id as Task['status']).map(task => (
                <div
                  key={task.id}
                  className={`bg-white p-6 rounded-lg shadow-md ${column.borderColor} border-l-4 cursor-move hover:shadow-lg transition-all ${column.cardBg}`}
                  onClick={() => setSelectedTask(task)}
                  draggable
                  onDragStart={e => handleDragStart(e, task.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-gray-900">
                    {task.title}
                    </h4>
                    <button
                      onClick={(e) => handleDeleteTask(task.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-base text-gray-600 mb-6 line-clamp-3">
                    {task.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {task.assignedTo.map((person, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center"
                        >
                          <span className="text-base font-medium text-blue-600">
                            {person.charAt(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}