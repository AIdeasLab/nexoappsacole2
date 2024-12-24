import React from 'react';
import ProjectDetail from '../ProjectDetail';
import ProjectCard from './ProjectCard';
import { getProjects, deleteProject } from '../../../../lib/projects';
import { Project } from '../../../../types';

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

  async function handleDelete(projectId: string) {
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
    // Auto refresh every 30 seconds
    const interval = setInterval(loadProjects, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentProject = projects.find(p => p.id === selectedProject);

  if (currentProject) {
    return (
      <ProjectDetail
        project={currentProject}
        onBack={() => setSelectedProject(null)}
        onStatusChange={loadProjects}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Projetos em Andamento</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDelete}
            onClick={() => setSelectedProject(project.id)}
            onStatusChange={loadProjects}
          />
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