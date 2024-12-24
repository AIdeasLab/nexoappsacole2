/*
  # Fix Projects Schema

  1. Changes
    - Drop and recreate projects table with correct category column
    - Recreate partner_projects_view
    - Update indexes and policies
    
  2. Security
    - Maintain RLS policies
    - Grant necessary permissions
*/

-- First drop dependent views
DROP VIEW IF EXISTS partner_projects_view;

-- Recreate projects table with correct structure
CREATE TABLE IF NOT EXISTS projects_new (
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

-- Copy data from old table if it exists
INSERT INTO projects_new (
  id, name, client_name, description, status, progress,
  start_date, deadline, location, completed_tasks, total_tasks,
  category, created_at, updated_at
)
SELECT 
  id, name, client_name, description, status, progress,
  start_date, deadline, location, completed_tasks, total_tasks,
  COALESCE(category, 'architecture') as category, created_at, updated_at
FROM projects;

-- Drop old table and rename new one
DROP TABLE IF EXISTS projects CASCADE;
ALTER TABLE projects_new RENAME TO projects;

-- Recreate the view
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

-- Recreate indexes
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow full access to projects"
  ON projects FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON partner_projects_view TO anon, authenticated;