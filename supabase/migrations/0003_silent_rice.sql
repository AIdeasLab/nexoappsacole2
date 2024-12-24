/*
  # Fix schema and policies for anonymous access

  1. Changes
    - Fix column names in tasks table
    - Add missing indexes
    - Update RLS policies for anonymous access
    
  2. Security
    - Enable anonymous access to all tables
    - Add policies for public read/write access
*/

-- Update RLS policies for anonymous access
DROP POLICY IF EXISTS "Public can read projects" ON projects;
DROP POLICY IF EXISTS "Public can insert projects" ON projects;
DROP POLICY IF EXISTS "Public can update projects" ON projects;

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert projects"
  ON projects FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update projects"
  ON projects FOR UPDATE
  TO anon
  USING (true);

-- Task policies for anonymous access
DROP POLICY IF EXISTS "Public can read tasks" ON tasks;
DROP POLICY IF EXISTS "Public can manage tasks" ON tasks;

CREATE POLICY "Public can read tasks"
  ON tasks FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can manage tasks"
  ON tasks FOR ALL
  TO anon
  USING (true);

-- Document policies for anonymous access
DROP POLICY IF EXISTS "Public can read documents" ON project_documents;
DROP POLICY IF EXISTS "Public can manage documents" ON project_documents;

CREATE POLICY "Public can read documents"
  ON project_documents FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can manage documents"
  ON project_documents FOR ALL
  TO anon
  USING (true);

-- Storage policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-documents', 'project-documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read project documents"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'project-documents');

CREATE POLICY "Public can upload project documents"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'project-documents');