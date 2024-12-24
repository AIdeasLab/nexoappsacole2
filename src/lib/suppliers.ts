import { supabase } from './supabase';
import { Supplier } from '../types';

export async function getSuppliers() {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(mapSupplierFromDB) || [];
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
}

export async function createSupplier(supplier: Omit<Supplier, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([mapSupplierToDB(supplier)])
      .select()
      .single();

    if (error) throw error;
    return mapSupplierFromDB(data);
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
}

export async function updateSupplier(id: string, updates: Partial<Supplier>) {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .update(mapSupplierToDB(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapSupplierFromDB(data);
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
}

export async function deleteSupplier(id: string) {
  try {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
}

function mapSupplierFromDB(dbSupplier: any): Supplier {
  return {
    id: dbSupplier.id,
    name: dbSupplier.name,
    email: dbSupplier.email,
    phone: dbSupplier.phone,
    role: dbSupplier.role,
    laborValue: dbSupplier.labor_value
  };
}

function mapSupplierToDB(supplier: Partial<Supplier>) {
  return {
    name: supplier.name,
    email: supplier.email,
    phone: supplier.phone,
    role: supplier.role,
    labor_value: supplier.laborValue
  };
}