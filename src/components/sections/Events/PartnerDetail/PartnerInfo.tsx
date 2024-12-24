import React from 'react';
import { Phone, Mail, Briefcase, Edit2 } from 'lucide-react';
import { Partner } from '../../../../types';
import { updatePartner } from '../../../../lib/partners';
import { usePartnerProjectStats } from '../../../../hooks/usePartnerProjectStats';

interface PartnerInfoProps {
  partner: Partner;
  onBack: () => void;
}

export default function PartnerInfo({ partner, onBack }: PartnerInfoProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const { stats } = usePartnerProjectStats(partner.id);
  const [formData, setFormData] = React.useState({
    name: partner.name,
    email: partner.email,
    phone: partner.phone,
    role: partner.role,
    projectValue: partner.projectValue.toString(),
    rrtValue: partner.rrtValue.toString()
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updatePartner(partner.id, {
        ...partner,
        ...formData,
        projectValue: Number(formData.projectValue),
        rrtValue: Number(formData.rrtValue)
      });
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating partner:', error);
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Editar Parceiro</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Função</label>
            <input
              type="text"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valor de Projeto</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="number"
                value={formData.projectValue}
                onChange={e => setFormData({ ...formData, projectValue: e.target.value })}
                className="block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valor RRT</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="number"
                value={formData.rrtValue}
                onChange={e => setFormData({ ...formData, rrtValue: e.target.value })}
                className="block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Informações do Parceiro</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Telefone</p>
            <p className="text-sm text-gray-500">{partner.phone}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Email</p>
            <p className="text-sm text-gray-500">{partner.email}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Briefcase className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Valores</p>
            <p className="text-sm text-gray-500">
              Projeto: R$ {partner.projectValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              RRT: R$ {partner.rrtValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.completedProjects}
            </p>
            <p className="text-xs text-gray-500">Concluídos</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.inProgressProjects}
            </p>
            <p className="text-xs text-gray-500">Em Andamento</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalProjects}
            </p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}