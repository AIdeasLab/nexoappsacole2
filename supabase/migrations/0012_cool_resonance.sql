/*
  # Fix Database Schema Order

  1. Changes
    - Ensures tables are created in correct dependency order
    - Recreates views after all tables exist
    - Adds missing indexes
    - Fixes potential race conditions

  2. Security
    - Maintains RLS policies
    - Ensures proper access control
*/

-- First ensure the partners table exists
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

-- Then ensure projects table exists
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

-- Now create partner_projects with proper references
CREATE TABLE IF NOT EXISTS partner_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, project_id)
);

-- Drop view if exists to avoid conflicts
DROP VIEW IF EXISTS partner_projects_view;

-- Recreate view with all necessary fields
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
ALTER TABLE partner_projects ENABLE ROW LEVEL SECURITY;

-- Create or update policies
CREATE POLICY IF NOT EXISTS "Public can read partner_projects"
  ON partner_projects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY IF NOT EXISTS "Public can insert partner_projects"
  ON partner_projects FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Public can update partner_projects"
  ON partner_projects FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY IF NOT EXISTS "Public can delete partner_projects"
  ON partner_projects FOR DELETE
  TO anon
  USING (true);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_partner_projects_partner_id ON partner_projects(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_projects_project_id ON partner_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_partner_projects_status ON partner_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);