import { supabase, handleSupabaseError } from './supabase';
import { Partner, Project } from '../types';

// Get all partners
export async function getPartners() {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(mapPartnerFromDB) || [];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get projects for a specific partner
export async function getPartnerProjects(partnerId: string) {
  try {
    const { data, error } = await supabase
      .from('partner_projects')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('partner_id', partnerId);

    if (error) throw error;

    return data?.map(item => mapProjectFromDB(item.project)) || [];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get partners for a specific project
export async function getProjectPartners(projectId: string): Promise<Partner[]> {
  try {
    const { data, error } = await supabase
      .from('partner_projects')
      .select(`
        partner_id,
        partner:partners(*)
      `)
      .eq('project_id', projectId);

    if (error) throw error;

    return data?.map(item => mapPartnerFromDB(item.partner)) || [];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Create a new partner
export async function createPartner(partner: Omit<Partner, 'id' | 'projects'>) {
  try {
    const { data, error } = await supabase
      .from('partners')
      .insert([mapPartnerToDB(partner)])
      .select()
      .single();

    if (error) throw error;

    return mapPartnerFromDB(data);
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
}

// Update an existing partner
export async function updatePartner(id: string, updates: Partial<Partner>) {
  try {
    const { data, error } = await supabase
      .from('partners')
      .update(mapPartnerToDB(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return mapPartnerFromDB(data);
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
}

// Delete a partner
export async function deletePartner(id: string) {
  try {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
}

// Add partner to project
export async function addPartnerToProject(projectId: string, partnerId: string) {
  try {
    const { error } = await supabase
      .from('partner_projects')
      .insert([{ project_id: projectId, partner_id: partnerId }]);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
}

// Remove partner from project
export async function removePartnerFromProject(projectId: string, partnerId: string) {
  try {
    const { error } = await supabase
      .from('partner_projects')
      .delete()
      .match({ project_id: projectId, partner_id: partnerId });

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
}

// Helper functions to map between DB and application models
function mapPartnerFromDB(dbPartner: any): Partner {
  return {
    id: dbPartner.id,
    name: dbPartner.name,
    email: dbPartner.email,
    phone: dbPartner.phone,
    role: dbPartner.role,
    projectValue: dbPartner.project_value,
    rrtValue: dbPartner.rrt_value,
    projectsCompleted: dbPartner.projects_completed,
    projectsInProgress: dbPartner.projects_in_progress,
    projects: []
  };
}

function mapPartnerToDB(partner: Partial<Partner>) {
  return {
    name: partner.name,
    email: partner.email,
    phone: partner.phone,
    role: partner.role,
    project_value: partner.projectValue,
    rrt_value: partner.rrtValue,
    projects_completed: partner.projectsCompleted,
    projects_in_progress: partner.projectsInProgress
  };
}

function mapProjectFromDB(dbProject: any): Project {
  return {
    id: dbProject.id,
    name: dbProject.name,
    clientName: dbProject.client_name,
    description: dbProject.description,
    status: dbProject.status,
    progress: dbProject.progress,
    startDate: dbProject.start_date,
    deadline: dbProject.deadline,
    location: dbProject.location,
    completedTasks: dbProject.completed_tasks,
    totalTasks: dbProject.total_tasks,
    category: dbProject.category,
    tasks: []
  };
}