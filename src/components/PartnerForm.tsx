import React from 'react';
import { createPartner } from '../lib/partners';
import { Partner } from '../types';

interface PartnerFormProps {
  onClose: () => void;
  onPartnerCreated: () => void;
}

export default function PartnerForm({ onClose, onPartnerCreated }: PartnerFormProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    projectValue: '',
    rrtValue: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const newPartner: Omit<Partner, 'id' | 'projects'> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        projectValue: Number(formData.projectValue) || 0,
        rrtValue: Number(formData.rrtValue) || 0,
        projectsCompleted: 0,
        projectsInProgress: 0
      };

      await createPartner(newPartner);
      onPartnerCreated();
      onClose();
    } catch (error) {
      console.error('Error creating partner:', error);
      alert('Erro ao criar parceiro. Por favor, tente novamente.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Novo Parceiro</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Função</label>
            <input
              type="text"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="block w-full pl-12 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valor RRT</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="number"
                value={formData.rrtValue}
                onChange={e => setFormData({ ...formData, rrtValue: e.target.value })}
                className="block w-full pl-12 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Criar Parceiro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}