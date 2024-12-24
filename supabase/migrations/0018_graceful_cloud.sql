/*
  # Fix Database Structure

  1. Changes
    - Ensure all tables exist with correct columns
    - Recreate partner_projects_view
    - Set proper permissions and policies
    - Add missing indexes

  2. Security
    - Enable RLS with permissive policies
    - Grant necessary permissions
*/

-- First ensure all required tables exist with correct structure
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  role text,
  project_value numeric DEFAULT 0,
  rrt_value numeric DEFAULT 0,
  projects_completed integer DEFAULT 0,
  projects_in_progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  client_name text,
  description text,
  status text NOT NULL DEFAULT 'active',
  progress integer DEFAULT 0,
  start_date timestamptz DEFAULT now(),
  deadline timestamptz,
  location text,
  completed_tasks integer DEFAULT 0,
  total_tasks integer DEFAULT 0,
  category text NOT NULL DEFAULT 'architecture' CHECK (category IN ('architecture', 'events')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partner_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, project_id)
);

-- Drop and recreate the view
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

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_projects ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
DO $$ 
BEGIN
  -- Partners policies
  DROP POLICY IF EXISTS "Allow full access to partners" ON partners;
  CREATE POLICY "Allow full access to partners" ON partners FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

  -- Projects policies
  DROP POLICY IF EXISTS "Allow full access to projects" ON projects;
  CREATE POLICY "Allow full access to projects" ON projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

  -- Partner_projects policies
  DROP POLICY IF EXISTS "Allow full access to partner_projects" ON partner_projects;
  CREATE POLICY "Allow full access to partner_projects" ON partner_projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
END $$;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON partner_projects_view TO anon, authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_partner_projects_partner_id ON partner_projects(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_projects_project_id ON partner_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_partner_projects_status ON partner_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_partners_role ON partners(role);

-- Update existing projects to ensure valid categories
UPDATE projects 
SET category = 'architecture' 
WHERE category IS NULL OR category NOT IN ('architecture', 'events');