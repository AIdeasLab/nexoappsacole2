import React from 'react';
import { getPartnerProjects } from '../../../../lib/partners';
import { deleteProject } from '../../../../lib/projects';
import { Project } from '../../../../types';
import ProjectCard from './ProjectCard';
import ProjectDetail from '../../../sections/Architecture/ProjectDetail';

interface PartnerProjectsProps {
  partnerId: string;
}

export default function PartnerProjects({ partnerId }: PartnerProjectsProps) {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

  async function loadProjects() {
    try {
      const projectList = await getPartnerProjects(partnerId);
      setProjects(projectList);
    } catch (error) {
      console.error('Error loading partner projects:', error);
      setProjects([]);
    }
  }

  async function handleDelete(projectId: string) {
    try {
      await deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Erro ao excluir o projeto. Por favor, tente novamente.');
    }
  }

  React.useEffect(() => {
    loadProjects();
  }, [partnerId]);

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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Projetos do Parceiro</h2>
      
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDelete}
            onClick={() => setSelectedProject(project.id)}
          />
        ))}

        {projects.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            Nenhum projeto associado a este parceiro.
          </div>
        )}
      </div>
    </div>
  );
}