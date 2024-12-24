import React from 'react';
import { Plus } from 'lucide-react';
import { Project } from '../../../../types';
import PartnerCard from './PartnerCard';
import PartnerSelector from './PartnerSelector';
import { getProjectPartners } from '../../../../lib/partners';

interface ProjectPartnersProps {
  project: Project;
}

export default function ProjectPartners({ project }: ProjectPartnersProps) {
  const [partners, setPartners] = React.useState<Partner[]>([]);
  const [showSelector, setShowSelector] = React.useState(false);

  async function loadPartners() {
    try {
      const projectPartners = await getProjectPartners(project.id);
      setPartners(projectPartners);
    } catch (error) {
      console.error('Error loading project partners:', error);
      setPartners([]);
    }
  }

  React.useEffect(() => {
    loadPartners();
  }, [project.id]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Parceiros do Projeto</h2>
        <button
          onClick={() => setShowSelector(true)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Parceiro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partners.map((partner) => (
          <PartnerCard
            key={partner.id}
            partner={partner}
            projectId={project.id}
            onUpdate={loadPartners}
          />
        ))}
        {partners.length === 0 && (
          <div className="col-span-2 text-center py-6 text-gray-500">
            Nenhum parceiro associado a este projeto.
          </div>
        )}
      </div>

      {showSelector && (
        <PartnerSelector
          projectId={project.id}
          onClose={() => setShowSelector(false)}
          onPartnerAdded={loadPartners}
          existingPartners={partners}
        />
      )}
    </div>
  );
}