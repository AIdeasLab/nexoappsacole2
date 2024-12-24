/*
  # Fix Architecture Integration

  1. Changes
    - Ensure projects table has correct category column
    - Add missing indexes
    - Update sample data
    
  2. Security
    - Maintain existing RLS policies
*/

-- First ensure the category column exists and has the correct constraint
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

-- Update the category constraint
ALTER TABLE projects 
  DROP CONSTRAINT IF EXISTS valid_category,
  ADD CONSTRAINT valid_category CHECK (category IN ('architecture', 'events'));

-- Create or update indexes
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Insert sample architecture projects if none exist
INSERT INTO projects (
  name, 
  client_name, 
  description, 
  status, 
  category,
  location,
  progress,
  completed_tasks,
  total_tasks
)
SELECT
  'Residência Silva',
  'João Silva',
  'Projeto residencial moderno com 3 quartos',
  'active',
  'architecture',
  'São Paulo, SP',
  30,
  3,
  10
WHERE NOT EXISTS (
  SELECT 1 FROM projects WHERE category = 'architecture'
);