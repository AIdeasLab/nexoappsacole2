import React from 'react';
import { X } from 'lucide-react';
import { Partner } from '../../../../types';
import { getPartners, addPartnerToProject } from '../../../../lib/partners';

interface PartnerSelectorProps {
  projectId: string;
  onClose: () => void;
  onPartnerAdded: () => void;
  existingPartners: Partner[];
}

export default function PartnerSelector({ 
  projectId, 
  onClose, 
  onPartnerAdded,
  existingPartners 
}: PartnerSelectorProps) {
  const [partners, setPartners] = React.useState<Partner[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadAvailablePartners() {
      try {
        const allPartners = await getPartners();
        const availablePartners = allPartners.filter(
          partner => !existingPartners.find(ep => ep.id === partner.id)
        );
        setPartners(availablePartners);
      } catch (error) {
        console.error('Error loading partners:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAvailablePartners();
  }, [existingPartners]);

  async function handleSelect(partnerId: string) {
    try {
      await addPartnerToProject(projectId, partnerId);
      onPartnerAdded();
      onClose();
    } catch (error) {
      console.error('Error adding partner:', error);
      alert('Erro ao adicionar parceiro. Por favor, tente novamente.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Adicionar Parceiro</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-6">Carregando parceiros...</div>
        ) : partners.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            Não há parceiros disponíveis para adicionar.
          </div>
        ) : (
          <div className="space-y-4">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(partner.id)}
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{partner.name}</h3>
                  <p className="text-sm text-gray-500">{partner.role}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Selecionar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}