/*
  # Fix Architecture Schema Issues

  1. Changes
    - Add missing category column to projects table
    - Add proper indexes for performance
    - Update existing data to have correct category values
    - Fix partner_projects relationships
    - Add missing RLS policies

  2. Security
    - Enable RLS on all tables
    - Add proper policies for public access
*/

-- First ensure the projects table has the correct structure
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'architecture';

-- Add constraint for valid categories
ALTER TABLE projects 
DROP CONSTRAINT IF EXISTS valid_category;

ALTER TABLE projects 
ADD CONSTRAINT valid_category CHECK (category IN ('architecture', 'events'));

-- Update existing projects to have valid categories
UPDATE projects 
SET category = 'architecture' 
WHERE category IS NULL OR category NOT IN ('architecture', 'events');

-- Create or update indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_partner_projects_partner_id ON partner_projects(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_projects_project_id ON partner_projects(project_id);

-- Drop and recreate the partner_projects view for better performance
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
GRANT ALL ON partner_projects_view TO anon, authenticated;

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

-- Create or update policies for public access
CREATE POLICY "Allow full access to projects"
  ON projects FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to partners"
  ON partners FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to partner_projects"
  ON partner_projects FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to tasks"
  ON tasks FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to project_documents"
  ON project_documents FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);