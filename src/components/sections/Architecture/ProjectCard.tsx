import React from 'react';
import { Calendar, CheckSquare, MapPin } from 'lucide-react';
import { Project } from '../../../types';
import ProjectStatusSelect from '../../ProjectStatusSelect';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onClick: () => void;
  onStatusChange: () => void;
}

export default function ProjectCard({ project, onDelete, onClick, onStatusChange }: ProjectCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(project.id);
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover-lift animate-fade-in"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
          <p className="text-sm text-gray-500">{project.clientName}</p>
        </div>
        <div onClick={handleStatusClick}>
          <ProjectStatusSelect
            projectId={project.id}
            currentStatus={project.status}
            onStatusChange={onStatusChange}
          />
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
            className="bg-blue-600 rounded-full h-2 transition-all duration-500"
            style={{ width: `${(project.completedTasks || 0) / (project.totalTasks || 1) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}