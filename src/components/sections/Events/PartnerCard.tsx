import React from 'react';
import { Phone, Mail, Briefcase, ArrowRight } from 'lucide-react';
import { Partner } from '../../../types';

interface PartnerCardProps {
  partner: Partner;
}

export default function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{partner.name}</h3>
            <p className="text-sm text-gray-500">{partner.role}</p>
          </div>
          <button className="text-blue-600 hover:text-blue-700">
            <ArrowRight className="h-5 w-5" />
          </button>
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
            Valor Médio: R$ {partner.averageValue.toLocaleString()}
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
  );
}