import React from 'react';
import { X } from 'lucide-react';
import { createTask } from '../../../lib/aideasLabTasks';

interface TaskFormProps {
  projectId: string;
  onClose: () => void;
  onTaskCreated: () => void;
}

export default function TaskForm({ projectId, onClose, onTaskCreated }: TaskFormProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    dueDate: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      await createTask({
        project_id: projectId,
        title: formData.title,
        description: formData.description,
        due_date: formData.dueDate,
        completed: false
      });
      
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Erro ao criar task. Por favor, tente novamente.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Nova Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Entrega</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Criar Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}