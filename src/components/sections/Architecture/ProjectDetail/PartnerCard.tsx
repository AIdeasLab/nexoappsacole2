import React from 'react';
import { Phone, Mail, Trash2 } from 'lucide-react';
import { Partner } from '../../../../types';
import { removePartnerFromProject } from '../../../../lib/partners';

interface PartnerCardProps {
  partner: Partner;
  projectId: string;
  onUpdate: () => void;
}

export default function PartnerCard({ partner, projectId, onUpdate }: PartnerCardProps) {
  async function handleRemove() {
    if (window.confirm('Tem certeza que deseja remover este parceiro do projeto?')) {
      try {
        await removePartnerFromProject(projectId, partner.id);
        onUpdate();
      } catch (error) {
        console.error('Error removing partner:', error);
        alert('Erro ao remover parceiro. Por favor, tente novamente.');
      }
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{partner.name}</h3>
          <p className="text-sm text-gray-500">{partner.role}</p>
        </div>
        <button
          onClick={handleRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Remover parceiro"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          {partner.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          {partner.email}
        </div>
      </div>
    </div>
  );
}