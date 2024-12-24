/*
  # Add project category

  1. Changes
    - Add category column to projects table
    - Update existing projects to have default categories
    - Add check constraint for valid categories

  2. Data Migration
    - Set existing projects to 'architecture' category
*/

-- Add category column
ALTER TABLE projects
ADD COLUMN category text NOT NULL DEFAULT 'architecture'
CHECK (category IN ('architecture', 'events'));

-- Add index for category queries
CREATE INDEX idx_projects_category ON projects(category);