import { useState } from 'react';
import { Project } from '../../../../types';
import { getProjects, deleteProject } from '../../../../lib/projects';

export function useProjectList() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

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

  return {
    selectedProject,
    projects,
    setSelectedProject,
    handleDelete,
    loadProjects
  };
}