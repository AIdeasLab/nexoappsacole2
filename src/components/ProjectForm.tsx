import React from 'react';
import { createProject } from '../lib/projects';
import { addPartnerToProject } from '../lib/partners';
import { Project } from '../types';

interface ProjectFormProps {
  partnerId?: string;
  category: 'architecture' | 'events';
  onClose: () => void;
  onProjectCreated: () => void;
}

export default function ProjectForm({ partnerId, category, onClose, onProjectCreated }: ProjectFormProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    clientName: '',
    description: '',
    location: '',
    startDate: '',
    deadline: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const newProject: Omit<Project, 'id'> = {
        name: formData.name,
        clientName: formData.clientName,
        description: formData.description,
        location: formData.location,
        startDate: formData.startDate,
        deadline: formData.deadline,
        status: 'active',
        progress: 0,
        completedTasks: 0,
        totalTasks: 0,
        category: category, // Set the category based on where the project is being created
        tasks: []
      };

      const project = await createProject(newProject);
      
      if (partnerId && project.id) {
        await addPartnerToProject(project.id, partnerId);
      }

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
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {category === 'events' ? 'Novo Evento' : 'Novo Projeto'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome do {category === 'events' ? 'Evento' : 'Projeto'}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={e => setFormData({ ...formData, clientName: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Localização</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prazo</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              Criar {category === 'events' ? 'Evento' : 'Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}