import React from 'react';
import { Calendar, MapPin, User, Edit2, Trash2 } from 'lucide-react';
import { Project } from '../../../../types';
import { updateProject, deleteProject } from '../../../../lib/projects';

interface ProjectInfoProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectInfo({ project, onBack }: ProjectInfoProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: project.name,
    clientName: project.clientName || '',
    location: project.location || '',
    startDate: project.startDate ? project.startDate.split('T')[0] : '',
    deadline: project.deadline?.split('T')[0] || ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateProject(project.id, {
        ...project,
        ...formData,
      });
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }

  async function handleDelete() {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await deleteProject(project.id);
        onBack();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Editar Projeto</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancelar
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
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={e => setFormData({ ...formData, clientName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Localização</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prazo</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Informações do Projeto</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Cliente</p>
            <p className="text-sm text-gray-500">{project.clientName}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Local</p>
            <p className="text-sm text-gray-500">{project.location}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Prazos</p>
            <p className="text-sm text-gray-500">
              Início: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Não definido'}
            </p>
            <p className="text-sm text-gray-500">
              Entrega: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Não definido'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}