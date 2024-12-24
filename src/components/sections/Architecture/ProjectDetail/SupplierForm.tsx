import React from 'react';
import { X } from 'lucide-react';
import { createSupplier, updateSupplier } from '../../../../lib/suppliers';
import { Supplier } from '../../../../types';

interface SupplierFormProps {
  supplier?: Supplier;
  onClose: () => void;
  onSave: () => void;
}

export default function SupplierForm({ supplier, onClose, onSave }: SupplierFormProps) {
  const [formData, setFormData] = React.useState({
    name: supplier?.name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    role: supplier?.role || '',
    laborValue: supplier?.laborValue?.toString() || '0'
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const supplierData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        laborValue: Number(formData.laborValue)
      };

      if (supplier) {
        await updateSupplier(supplier.id, supplierData);
      } else {
        await createSupplier(supplierData);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Erro ao salvar fornecedor. Por favor, tente novamente.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Função</label>
            <input
              type="text"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valor de Mão de Obra</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="number"
                value={formData.laborValue}
                onChange={e => setFormData({ ...formData, laborValue: e.target.value })}
                className="block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              {supplier ? 'Salvar Alterações' : 'Criar Fornecedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}