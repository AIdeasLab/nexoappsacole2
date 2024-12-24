/*
  # Fix Database Permissions and Access

  1. Changes
    - Grant all necessary permissions to public and authenticated roles
    - Update RLS policies to allow full access
    - Add missing table grants
    - Fix view permissions

  2. Security
    - Enable public access for development
    - Ensure all tables and views are accessible
*/

-- Grant permissions on all tables to public roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Ensure RLS is enabled but with permissive policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

-- Update or create permissive policies for projects
DROP POLICY IF EXISTS "Allow full access to projects" ON projects;
CREATE POLICY "Allow full access to projects"
  ON projects
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Update or create permissive policies for partners
DROP POLICY IF EXISTS "Allow full access to partners" ON partners;
CREATE POLICY "Allow full access to partners"
  ON partners
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Update or create permissive policies for partner_projects
DROP POLICY IF EXISTS "Allow full access to partner_projects" ON partner_projects;
CREATE POLICY "Allow full access to partner_projects"
  ON partner_projects
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Update or create permissive policies for tasks
DROP POLICY IF EXISTS "Allow full access to tasks" ON tasks;
CREATE POLICY "Allow full access to tasks"
  ON tasks
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Update or create permissive policies for project_documents
DROP POLICY IF EXISTS "Allow full access to project_documents" ON project_documents;
CREATE POLICY "Allow full access to project_documents"
  ON project_documents
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure view permissions
GRANT ALL ON partner_projects_view TO anon, authenticated;

-- Refresh the view to ensure it's up to date
REFRESH MATERIALIZED VIEW IF EXISTS partner_projects_view;