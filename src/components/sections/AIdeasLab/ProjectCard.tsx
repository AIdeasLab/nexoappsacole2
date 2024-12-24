import React from 'react';
import { CheckSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Project } from '../../../types';
import { getProjectTasks } from '../../../lib/aideasLabTasks';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [taskStats, setTaskStats] = React.useState({
    pending: 0,
    active: 0,
    completed: 0,
    total: 0
  });

  React.useEffect(() => {
    async function loadTaskStats() {
      const tasks = await getProjectTasks(project.id);
      setTaskStats({
        pending: tasks.filter(t => !t.completed).length,
        active: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length,
        total: tasks.length
      });
    }
    loadTaskStats();
  }, [project.id]);

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover-lift animate-fade-in"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {project.name}
            </h3>
            <span className="text-sm text-gray-500">
              {PROJECT_TYPE_LABELS[project.projectType as keyof typeof PROJECT_TYPE_LABELS]}
            </span>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
            project.status === 'active'
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }`}>
            {project.status === 'active' ? 'Em Andamento' : 'Pendente'}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-6 line-clamp-2 hover:line-clamp-none transition-all duration-300">
          {project.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">Pendentes</p>
              <p className="text-sm font-medium">{taskStats.pending}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Em Andamento</p>
              <p className="text-sm font-medium">{taskStats.active}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Concluídas</p>
              <p className="text-sm font-medium">{taskStats.completed}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <CheckSquare className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-sm font-medium">{taskStats.total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PROJECT_TYPE_LABELS = {
  ai_development: 'Desenvolvimento de IA',
  web_development: 'Desenvolvimento Web',
  mobile_development: 'Desenvolvimento Mobile',
  data_science: 'Ciência de Dados',
  computer_vision: 'Visão Computacional'
};