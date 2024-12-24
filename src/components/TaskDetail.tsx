import React from 'react';
import { X, Calendar, Users } from 'lucide-react';
import { Task } from '../types';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetail({ task, onClose }: TaskDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Descrição</h3>
              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Data de Entrega</p>
                  <p className="text-sm text-gray-600">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Responsáveis</p>
                  <p className="text-sm text-gray-600">
                    {task.assignedTo.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Status</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                task.status === 'todo'
                  ? 'bg-yellow-100 text-yellow-800'
                  : task.status === 'in-progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {task.status === 'todo'
                  ? 'A Fazer'
                  : task.status === 'in-progress'
                  ? 'Em Andamento'
                  : 'Concluído'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}