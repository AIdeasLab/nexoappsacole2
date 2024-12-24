import { supabase } from './supabase';
import { ProjectDocument } from '../types';

export async function uploadProjectDocument(
  projectId: string,
  file: File
): Promise<string | null> {
  if (!projectId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
    throw new Error('Invalid project ID format');
  }

  // Upload to storage bucket
  const fileName = `${Date.now()}-${file.name}`;
  const { data: storageData, error: storageError } = await supabase.storage
    .from('project-documents')
    .upload(`${projectId}/${fileName}`, file);

  if (storageError) {
    console.error('Error uploading to storage:', storageError);
    return null;
  }

  // Create database record
  const { data: dbData, error: dbError } = await supabase
    .from('project_documents')
    .insert([{
      project_id: projectId,
      name: file.name,
      file_type: file.type,
      file_path: storageData.path,
      size: file.size
    }])
    .select()
    .single();

  if (dbError) {
    console.error('Error creating document record:', dbError);
    return null;
  }

  return dbData.file_path;
}

export async function getProjectDocuments(projectId: string): Promise<ProjectDocument[]> {
  if (!projectId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
    throw new Error('Invalid project ID format');
  }

  const { data, error } = await supabase
    .from('project_documents')
    .select('*')
    .eq('project_id', projectId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

  return data.map(doc => ({
    id: doc.id,
    name: doc.name,
    type: doc.file_type,
    uploadedAt: doc.uploaded_at,
    url: supabase.storage
      .from('project-documents')
      .getPublicUrl(`${projectId}/${doc.file_path}`).data.publicUrl
  }));
}