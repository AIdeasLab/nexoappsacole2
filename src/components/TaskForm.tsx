import React from 'react';
import { createTask } from '../lib/tasks';

interface TaskFormProps {
  projectId: string;
  onTaskCreated: () => void;
}

export default function TaskForm({ projectId, onTaskCreated }: TaskFormProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [assignedTo, setAssignedTo] = React.useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !dueDate || !assignedTo.trim()) {
      return;
    }

    try {
      await createTask(projectId, {
        title,
        description,
        status: 'todo',
        dueDate,
        assignedTo: assignedTo.split(',').map(s => s.trim()),
      });
      
      setIsOpen(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignedTo('');
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        + Nova Tarefa
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Entrega</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Responsáveis (separados por vírgula)
          </label>
          <input
            type="text"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="João, Maria"
            required
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Criar Tarefa
        </button>
      </div>
    </form>
  );
}