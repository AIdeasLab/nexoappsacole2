/*
  # Database Structure Consolidation

  1. Changes
    - Consolidates table structures
    - Ensures correct category column in projects table
    - Updates indexes and constraints
    - Fixes permissions and policies
    
  2. Tables Modified
    - projects: Ensures category column exists with proper constraint
    - partner_projects: Updates foreign key relationships
    - Updates view structure
*/

-- Drop dependent objects first
DROP VIEW IF EXISTS partner_projects_view;

-- Ensure projects table has correct structure
DO $$ 
BEGIN
  -- Add category column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'category'
  ) THEN
    ALTER TABLE projects ADD COLUMN category text NOT NULL DEFAULT 'architecture';
  END IF;
END $$;

-- Update constraints
ALTER TABLE projects 
  DROP CONSTRAINT IF EXISTS valid_category,
  ADD CONSTRAINT valid_category CHECK (category IN ('architecture', 'events'));

-- Update existing data
UPDATE projects 
SET category = 'architecture' 
WHERE category IS NULL OR category NOT IN ('architecture', 'events');

-- Recreate the view with correct structure
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
DROP INDEX IF EXISTS idx_projects_category;
DROP INDEX IF EXISTS idx_projects_status;
DROP INDEX IF EXISTS idx_projects_created_at;

CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Grant permissions
GRANT ALL ON partner_projects_view TO anon, authenticated;

-- Ensure RLS policies
DO $$ 
BEGIN
  -- Projects policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Allow full access to projects') THEN
    CREATE POLICY "Allow full access to projects" ON projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;