import React from 'react';
import { Phone, Mail, Briefcase } from 'lucide-react';
import { partners } from './data';

export default function PartnerList() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Parceiros</h2>
      <div className="grid grid-cols-1 gap-4">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{partner.name}</h3>
                <p className="text-sm text-gray-500">{partner.role}</p>
              </div>
            </div>

            <div className="space-y-3">
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

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {partner.projectsCompleted}
                </p>
                <p className="text-xs text-gray-500">Concluídos</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {partner.projectsInProgress}
                </p>
                <p className="text-xs text-gray-500">Em Andamento</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {partner.projectsCompleted + partner.projectsInProgress}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}