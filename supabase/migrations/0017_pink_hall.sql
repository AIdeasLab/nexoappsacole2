/*
  # Fix Database Tables and Structure

  1. Changes
    - Ensure projects table has category column
    - Recreate partner_projects_view with correct structure
    - Fix all table relationships

  2. Security
    - Update permissions for all objects
*/

-- First ensure the projects table has the category column
ALTER TABLE projects 
DROP COLUMN IF EXISTS category;

ALTER TABLE projects
ADD COLUMN category text NOT NULL DEFAULT 'architecture'
CHECK (category IN ('architecture', 'events'));

-- Drop and recreate the view with correct structure
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

-- Grant permissions
GRANT ALL ON partner_projects_view TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Recreate indexes
DROP INDEX IF EXISTS idx_projects_category;
CREATE INDEX idx_projects_category ON projects(category);

-- Update existing projects to have valid categories
UPDATE projects 
SET category = 'architecture' 
WHERE category IS NULL OR category NOT IN ('architecture', 'events');