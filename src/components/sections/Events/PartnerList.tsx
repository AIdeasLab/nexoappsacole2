import React from 'react';
import { Phone, Mail, Briefcase, ArrowRight, Trash2 } from 'lucide-react';
import { getPartners, deletePartner } from '../../../lib/partners';
import { Partner } from '../../../types';
import PartnerDetail from './PartnerDetail';

export default function PartnerList() {
  const [selectedPartner, setSelectedPartner] = React.useState<string | null>(null);
  const [partners, setPartners] = React.useState<Partner[]>([]);

  async function loadPartners() {
    try {
      const partnerList = await getPartners();
      setPartners(partnerList);
    } catch (error) {
      console.error('Error loading partners:', error);
      setPartners([]);
    }
  }

  async function handleDelete(partnerId: string, e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Tem certeza que deseja excluir este parceiro?')) {
      try {
        await deletePartner(partnerId);
        await loadPartners();
      } catch (error) {
        console.error('Error deleting partner:', error);
        alert('Erro ao excluir o parceiro. Por favor, tente novamente.');
      }
    }
  }

  React.useEffect(() => {
    loadPartners();
  }, []);

  const currentPartner = partners.find(p => p.id === selectedPartner);

  if (currentPartner) {
    return (
      <PartnerDetail
        partner={currentPartner}
        onBack={() => setSelectedPartner(null)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {partners.map((partner) => (
        <div
          key={partner.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => setSelectedPartner(partner.id)}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{partner.name}</h3>
                <p className="text-sm text-gray-500">{partner.role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleDelete(partner.id, e)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Excluir parceiro"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {partner.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {partner.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                <div>
                  <span>Projeto: R$ {partner.projectValue.toLocaleString()}</span>
                  <br />
                  <span>RRT: R$ {partner.rrtValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {partner.projectsCompleted}
                  </p>
                  <p className="text-xs text-gray-500">Concluídos</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {partner.projectsInProgress}
                  </p>
                  <p className="text-xs text-gray-500">Em Andamento</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {partner.projectsCompleted + partner.projectsInProgress}
                  </p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}