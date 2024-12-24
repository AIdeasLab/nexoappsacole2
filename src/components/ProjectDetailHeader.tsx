import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ProjectStatusSelect from './ProjectStatusSelect';

interface ProjectDetailHeaderProps {
  projectName: string;
  projectDescription?: string;
  projectId: string;
  currentStatus: string;
  onBack: () => void;
  onStatusChange: () => void;
}

export default function ProjectDetailHeader({
  projectName,
  projectDescription,
  projectId,
  currentStatus,
  onBack,
  onStatusChange
}: ProjectDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
          {projectDescription && (
            <p className="text-sm text-gray-500">{projectDescription}</p>
          )}
        </div>
      </div>
      <ProjectStatusSelect
        projectId={projectId}
        currentStatus={currentStatus}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}