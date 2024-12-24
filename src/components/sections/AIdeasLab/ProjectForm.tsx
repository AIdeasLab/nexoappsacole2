import React from 'react';
import { X } from 'lucide-react';
import { createProject } from '../../../lib/projects';
import { Project } from '../../../types';

interface ProjectFormProps {
  onClose: () => void;
  onProjectCreated: () => void;
}

const PROJECT_TYPES = [
  { value: 'ai_development', label: 'Desenvolvimento de IA' },
  { value: 'web_development', label: 'Desenvolvimento Web' },
  { value: 'mobile_development', label: 'Desenvolvimento Mobile' },
  { value: 'data_science', label: 'Ciência de Dados' },
  { value: 'computer_vision', label: 'Visão Computacional' }
];

export default function ProjectForm({ onClose, onProjectCreated }: ProjectFormProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    projectType: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const newProject: Omit<Project, 'id'> = {
        name: formData.name,
        description: formData.description,
        projectType: formData.projectType,
        status: 'active',
        progress: 0,
        completedTasks: 0,
        totalTasks: 0,
        category: 'aideas',
        tasks: []
      };

      await createProject(newProject);
      onProjectCreated();
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Erro ao criar projeto. Por favor, tente novamente.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Novo Projeto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Projeto</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Projeto</label>
            <select
              value={formData.projectType}
              onChange={e => setFormData({ ...formData, projectType: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um tipo</option>
              {PROJECT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
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
              Criar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}