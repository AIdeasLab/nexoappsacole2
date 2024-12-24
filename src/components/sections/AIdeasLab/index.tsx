import React from 'react';
import { Plus } from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';
import ProjectForm from './ProjectForm';
import TasksSummary from './TasksSummary';
import DeadlinesSummary from './DeadlinesSummary';
import ProgressSummary from './ProgressSummary';
import { getProjects } from '../../../lib/projects';
import { Project } from '../../../types';

export default function AIdeasLab() {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [showForm, setShowForm] = React.useState(false);

  async function loadProjects() {
    const projectList = await getProjects('aideas');
    setProjects(projectList);
  }

  React.useEffect(() => {
    loadProjects();
    const interval = setInterval(loadProjects, 30000);
    return () => clearInterval(interval);
  }, []);

  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AIdeas LAB</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestão de Projetos de Desenvolvimento Tecnológico
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-1" />
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <TasksSummary projects={projects} />
        <DeadlinesSummary projects={projects} />
        <ProgressSummary projects={projects} />
      </div>

      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onProjectCreated={() => {
            loadProjects();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}