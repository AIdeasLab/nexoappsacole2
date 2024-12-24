/*
  # Fix Projects Category Column

  1. Changes
    - Ensure projects table has category column
    - Add proper constraint
    - Update existing records
    
  2. Security
    - Maintain existing RLS policies
*/

-- First ensure we have the correct column
ALTER TABLE projects 
DROP COLUMN IF EXISTS category;

ALTER TABLE projects 
ADD COLUMN category text NOT NULL DEFAULT 'architecture';

-- Add constraint
ALTER TABLE projects 
DROP CONSTRAINT IF EXISTS valid_category;

ALTER TABLE projects 
ADD CONSTRAINT valid_category CHECK (category IN ('architecture', 'events'));

-- Update existing records
UPDATE projects 
SET category = 'architecture' 
WHERE category IS NULL OR category NOT IN ('architecture', 'events');

-- Recreate index
DROP INDEX IF EXISTS idx_projects_category;
CREATE INDEX idx_projects_category ON projects(category);

-- Insert sample data if none exists
INSERT INTO projects (
  name, 
  client_name, 
  description, 
  status, 
  category,
  location,
  progress
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