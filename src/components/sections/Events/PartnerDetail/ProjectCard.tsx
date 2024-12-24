import React from 'react';
import { Calendar, MapPin, CheckSquare, Trash2 } from 'lucide-react';
import { Project } from '../../../../types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onClick: () => void;
}

export default function ProjectCard({ project, onDelete, onClick }: ProjectCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      onDelete(project.id);
    }
  };

  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
          <p className="text-sm text-gray-500">{project.clientName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Excluir projeto"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            project.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {project.status === 'active' ? 'Em Andamento' : 'Pendente'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          Prazo: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Não definido'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {project.location || 'Local não definido'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CheckSquare className="h-4 w-4 mr-2" />
          {project.completedTasks} de {project.totalTasks} tarefas concluídas
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 rounded-full h-2"
            style={{ width: `${(project.completedTasks || 0) / (project.totalTasks || 1) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}