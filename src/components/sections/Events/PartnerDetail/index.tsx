import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Partner } from '../../../../types';
import PartnerInfo from './PartnerInfo';
import PartnerProjects from './PartnerProjects';
import ProjectForm from '../../../ProjectForm';

interface PartnerDetailProps {
  partner: Partner;
  onBack: () => void;
}

export default function PartnerDetail({ partner, onBack }: PartnerDetailProps) {
  const [showProjectForm, setShowProjectForm] = React.useState(false);

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
            <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
            <p className="text-sm text-gray-500">{partner.role}</p>
          </div>
        </div>
        <button
          onClick={() => setShowProjectForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-1" />
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PartnerInfo partner={partner} onBack={onBack} />
        <PartnerProjects partnerId={partner.id} />
      </div>

      {showProjectForm && (
        <ProjectForm
          partnerId={partner.id}
          category="events"
          onClose={() => setShowProjectForm(false)}
          onProjectCreated={() => {
            setShowProjectForm(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}