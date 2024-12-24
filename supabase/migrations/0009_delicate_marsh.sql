/*
  # Add project categories support
  
  1. Changes
    - Add category column to projects table
    - Update existing projects with default category
    - Add category validation
    - Add indexes for performance
*/

-- Add category enum type
DO $$ BEGIN
  CREATE TYPE project_category AS ENUM ('architecture', 'events');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Update projects table
ALTER TABLE projects 
  DROP COLUMN IF EXISTS category,
  ADD COLUMN category project_category NOT NULL DEFAULT 'architecture';

-- Add index for category queries
CREATE INDEX IF NOT EXISTS idx_projects_category 
  ON projects(category);

-- Add category column to partner_projects view
CREATE OR REPLACE VIEW partner_projects_view AS
SELECT 
  pp.*,
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
  p.category
FROM partner_projects pp
JOIN projects p ON pp.project_id = p.id;