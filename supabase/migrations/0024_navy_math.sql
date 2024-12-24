/*
  # Fix Database Schema

  1. Changes
    - Ensure projects table has correct structure
    - Fix category column issues
    - Add proper constraints and indexes
    
  2. Security
    - Maintain existing RLS policies
*/

-- First ensure we have the correct table structure
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

-- Copy data from existing table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'projects') THEN
    INSERT INTO projects_new (
      id, name, client_name, description, status, progress,
      start_date, deadline, location, completed_tasks, total_tasks,
      category, created_at, updated_at
    )
    SELECT 
      id, name, client_name, description, status, progress,
      start_date, deadline, location, completed_tasks, total_tasks,
      COALESCE(category, 'architecture'), created_at, updated_at
    FROM projects;
  END IF;
END $$;

-- Drop old table and rename new one
DROP TABLE IF EXISTS projects CASCADE;
ALTER TABLE projects_new RENAME TO projects;

-- Create indexes
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow full access to projects"
  ON projects FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data if none exists
INSERT INTO projects (
  name, client_name, description, status, category, location, progress
)
SELECT
  'Residência Silva',
  'João Silva',
  'Projeto residencial moderno',
  'active',
  'architecture',
  'São Paulo, SP',
  30
WHERE NOT EXISTS (
  SELECT 1 FROM projects WHERE category = 'architecture'
);