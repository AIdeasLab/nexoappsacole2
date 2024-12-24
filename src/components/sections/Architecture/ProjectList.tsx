import React from 'react';
import { Calendar, CheckSquare, MapPin, Trash2 } from 'lucide-react';
import ProjectDetail from './ProjectDetail';
import { getProjects, deleteProject } from '../../../lib/projects';
import { Project } from '../../../types';

export default function ProjectList() {
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);
  const [projects, setProjects] = React.useState<Project[]>([]);

  async function loadProjects() {
    try {
      const projectList = await getProjects('architecture');
      setProjects(projectList);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  }

  async function handleDelete(projectId: string, e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await deleteProject(projectId);
        await loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Erro ao excluir o projeto. Por favor, tente novamente.');
      }
    }
  }

  React.useEffect(() => {
    loadProjects();
  }, []);

  const currentProject = projects.find(p => p.id === selectedProject);

  if (currentProject) {
    return (
      <ProjectDetail
        project={currentProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Projetos em Andamento</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setSelectedProject(project.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.clientName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleDelete(project.id, e)}
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
        ))}
        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum projeto encontrado.
          </div>
        )}
      </div>
    </div>
  );
}