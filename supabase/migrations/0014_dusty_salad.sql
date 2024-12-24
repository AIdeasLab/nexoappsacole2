/*
  # Fix Partner Projects View

  1. Changes
    - Drop and recreate partner_projects_view with proper permissions
    - Add missing view grants
    - Ensure view dependencies exist

  2. Security
    - Grant proper access to the view
    - Maintain data integrity
*/

-- First ensure all required tables exist
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
  category text CHECK (category IN ('architecture', 'events')),
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

-- Grant proper permissions
GRANT SELECT ON partner_projects_view TO anon;
GRANT SELECT ON partner_projects_view TO authenticated;

-- Ensure RLS is enabled on base tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_projects ENABLE ROW LEVEL SECURITY;

-- Add necessary indexes
CREATE INDEX IF NOT EXISTS idx_partner_projects_partner_id ON partner_projects(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_projects_project_id ON partner_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);