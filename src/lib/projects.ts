import { supabase, handleSupabaseRequest } from './supabase';
import { Project } from '../types';

// Get projects by category with retry logic
export async function getProjects(category: 'architecture' | 'events' | 'aideas'): Promise<Project[]> {
  return handleSupabaseRequest(async () => {
    return await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
  });
}

// Other functions with retry logic
export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  return handleSupabaseRequest(async () => {
    return await supabase
      .from('projects')
      .insert([mapProjectToDB(project)])
      .select()
      .single();
  });
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  return handleSupabaseRequest(async () => {
    return await supabase
      .from('projects')
      .update(mapProjectToDB(updates))
      .eq('id', id)
      .select()
      .single();
  });
}

export async function deleteProject(id: string): Promise<void> {
  return handleSupabaseRequest(async () => {
    return await supabase
      .from('projects')
      .delete()
      .eq('id', id);
  });
}

// Helper functions remain the same
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
    completedTasks: dbProject.completed_tasks || 0,
    totalTasks: dbProject.total_tasks || 0,
    category: dbProject.category,
    tasks: []
  };
}

function mapProjectToDB(project: Partial<Project>) {
  return {
    name: project.name,
    client_name: project.clientName,
    description: project.description,
    status: project.status,
    progress: project.progress,
    start_date: project.startDate,
    deadline: project.deadline,
    location: project.location,
    completed_tasks: project.completedTasks,
    total_tasks: project.totalTasks,
    category: project.category
  };
}