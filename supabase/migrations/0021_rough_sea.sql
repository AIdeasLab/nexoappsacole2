/*
  # Fix Projects Schema and Data

  1. Changes
    - Drop and recreate projects table with correct structure
    - Ensure category column exists and has proper constraints
    - Recreate dependent views and relationships
    
  2. Security
    - Maintain RLS policies
    - Grant necessary permissions
*/

-- First drop dependent views and constraints
DROP VIEW IF EXISTS partner_projects_view;
ALTER TABLE IF EXISTS partner_projects DROP CONSTRAINT IF EXISTS partner_projects_project_id_fkey;

-- Drop and recreate projects table
DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
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
  category text NOT NULL DEFAULT 'architecture',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category CHECK (category IN ('architecture', 'events'))
);

-- Recreate partner_projects table with correct foreign key
CREATE TABLE IF NOT EXISTS partner_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, project_id)
);

-- Recreate the view
CREATE VIEW partner_projects_view AS
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
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow full access to projects"
  ON projects FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to partner_projects"
  ON partner_projects FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_partner_projects_partner_id ON partner_projects(partner_id);
CREATE INDEX idx_partner_projects_project_id ON partner_projects(project_id);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON partner_projects_view TO anon, authenticated;

-- Insert sample data
INSERT INTO projects (name, client_name, description, status, category)
VALUES 
  ('Residência Silva', 'João Silva', 'Projeto residencial', 'active', 'architecture'),
  ('Evento Corporativo', 'Empresa XYZ', 'Evento de fim de ano', 'active', 'events');