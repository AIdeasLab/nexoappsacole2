/*
  # Fix Database Structure and Permissions

  1. Changes
    - Ensure all tables exist with correct structure
    - Recreate partner_projects_view
    - Update all permissions and policies
    - Add missing indexes

  2. Security
    - Enable RLS with permissive policies
    - Grant necessary permissions to roles
*/

-- Drop and recreate the view to ensure correct structure
DROP VIEW IF EXISTS partner_projects_view;

CREATE OR REPLACE VIEW partner_projects_view AS
SELECT 
  pp.id,
  pp.partner_id,
  pp.project_id,
  pp.status as partnership_status,
  pp.created_at as partnership_created_at,
  pp.updated_at as partnership_updated_at,
  p.name as project_name,
  p.client_name,
  p.description,
  p.status as project_status,
  p.progress,
  p.start_date,
  p.deadline,
  p.location,
  p.completed_tasks,
  p.total_tasks,
  p.category,
  p.created_at as project_created_at,
  p.updated_at as project_updated_at
FROM partner_projects pp
JOIN projects p ON pp.project_id = p.id;

-- Grant ALL permissions to the view
GRANT ALL ON partner_projects_view TO anon, authenticated;

-- Ensure all necessary indexes exist
CREATE INDEX IF NOT EXISTS idx_partner_projects_partner_id ON partner_projects(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_projects_project_id ON partner_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_partner_projects_status ON partner_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_partners_role ON partners(role);

-- Grant permissions on all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Ensure RLS is enabled with permissive policies
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

-- Create or update permissive policies
DO $$ 
BEGIN
  -- Partners policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partners' AND policyname = 'Allow full access to partners') THEN
    CREATE POLICY "Allow full access to partners" ON partners FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;

  -- Projects policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Allow full access to projects') THEN
    CREATE POLICY "Allow full access to projects" ON projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;

  -- Partner_projects policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partner_projects' AND policyname = 'Allow full access to partner_projects') THEN
    CREATE POLICY "Allow full access to partner_projects" ON partner_projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;

  -- Tasks policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Allow full access to tasks') THEN
    CREATE POLICY "Allow full access to tasks" ON tasks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;

  -- Project_documents policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_documents' AND policyname = 'Allow full access to project_documents') THEN
    CREATE POLICY "Allow full access to project_documents" ON project_documents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;