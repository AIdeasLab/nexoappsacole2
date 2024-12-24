import React from 'react';
import { Phone, Mail, Briefcase, Plus, Trash2, Edit2 } from 'lucide-react';
import { getSuppliers, deleteSupplier } from '../../../../lib/suppliers';
import { Supplier } from '../../../../types';
import SupplierForm from './SupplierForm';

export default function PartnerList() {
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editingSupplier, setEditingSupplier] = React.useState<Supplier | undefined>();

  async function loadSuppliers() {
    const supplierList = await getSuppliers();
    setSuppliers(supplierList);
  }

  React.useEffect(() => {
    loadSuppliers();
  }, []);

  async function handleDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await deleteSupplier(id);
        await loadSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Erro ao excluir fornecedor. Por favor, tente novamente.');
      }
    }
  }

  function handleEdit(supplier: Supplier) {
    setEditingSupplier(supplier);
    setShowForm(true);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Fornecedores</h2>
        <button
          onClick={() => {
            setEditingSupplier(undefined);
            setShowForm(true);
          }}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Fornecedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                <p className="text-sm text-gray-500">{supplier.role}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(supplier)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {supplier.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {supplier.phone}
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {supplier.email}
                </div>
              )}
              {supplier.laborValue > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <div>
                    Valor de Mão de Obra: R$ {supplier.laborValue.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <SupplierForm
          supplier={editingSupplier}
          onClose={() => {
            setShowForm(false);
            setEditingSupplier(undefined);
          }}
          onSave={loadSuppliers}
        />
      )}
    </div>
  );
}