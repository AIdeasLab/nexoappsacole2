import React from 'react';
import { Plus } from 'lucide-react';
import ProjectList from './ProjectList';
import ProjectForm from '../../ProjectForm';

export default function Architecture() {
  const [showForm, setShowForm] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Arquitetura</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestão de Projetos e Parcerias
          </p>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            Novo Projeto
          </button>
        </div>
      </div>
      <ProjectList />
      {showForm && (
        <ProjectForm
          category="architecture"
          onClose={() => setShowForm(false)}
          onProjectCreated={() => {
            setShowForm(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}