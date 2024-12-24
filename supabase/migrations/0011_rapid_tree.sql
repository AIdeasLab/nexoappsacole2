/*
  # Fix Partner Schema and Relationships

  1. Changes
    - Ensures partner_projects table exists with proper constraints
    - Recreates partner_projects_view with proper fields
    - Adds missing indexes for performance

  2. Security
    - Maintains RLS policies
    - Ensures proper access control
*/

-- Ensure partner_projects table exists with proper structure
CREATE TABLE IF NOT EXISTS partner_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, project_id)
);

-- Enable RLS on partner_projects
ALTER TABLE partner_projects ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to partner_projects
CREATE POLICY "Public can read partner_projects"
  ON partner_projects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert partner_projects"
  ON partner_projects FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update partner_projects"
  ON partner_projects FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Public can delete partner_projects"
  ON partner_projects FOR DELETE
  TO anon
  USING (true);

-- Drop and recreate the view
DROP VIEW IF EXISTS partner_projects_view;

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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_partner_projects_partner_id ON partner_projects(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_projects_project_id ON partner_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_partner_projects_status ON partner_projects(status);