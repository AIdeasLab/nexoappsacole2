import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Project } from '../../../types';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const [showTaskForm, setShowTaskForm] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
        </div>
        <button
          onClick={() => setShowTaskForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-1" />
          Nova Task
        </button>
      </div>

      <TaskList projectId={project.id} />

      {showTaskForm && (
        <TaskForm
          projectId={project.id}
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={() => {
            setShowTaskForm(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}