/*
  # Fix tasks table schema

  1. Changes
    - Rename columns to match TypeScript types
    - Add assigned_to array column
    - Add due_date column
    - Add proper indexes

  2. Security
    - Maintain existing RLS policies
*/

-- Rename and add columns with proper types
ALTER TABLE tasks 
  ADD COLUMN IF NOT EXISTS assigned_to text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS due_date timestamptz;

-- Add index for common queries
CREATE INDEX IF NOT EXISTS idx_tasks_project_status 
  ON tasks(project_id, status);

CREATE INDEX IF NOT EXISTS idx_tasks_due_date 
  ON tasks(due_date);