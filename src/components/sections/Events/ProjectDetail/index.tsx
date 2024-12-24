import React from 'react';
import { Project } from '../../../../types';
import ProjectDetailHeader from '../../../ProjectDetailHeader';
import KanbanBoard from '../../Architecture/ProjectDetail/KanbanBoard';
import ProjectInfo from '../../Architecture/ProjectDetail/ProjectInfo';
import DocumentList from '../../Architecture/ProjectDetail/DocumentList';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onStatusChange: () => void;
}

export default function ProjectDetail({ project, onBack, onStatusChange }: ProjectDetailProps) {
  return (
    <div className="space-y-6">
      <ProjectDetailHeader
        projectName={project.name}
        projectDescription={project.clientName}
        projectId={project.id}
        currentStatus={project.status}
        onBack={onBack}
        onStatusChange={onStatusChange}
      />

      <div className="space-y-6">
        {/* KanbanBoard takes full width */}
        <div className="w-full">
          <KanbanBoard project={project} />
        </div>
        
        {/* Info and Documents in two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectInfo project={project} onBack={onBack} />
          <DocumentList projectId={project.id} />
        </div>
      </div>
    </div>
  );
}