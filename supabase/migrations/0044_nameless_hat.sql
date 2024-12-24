/*
  # Add task checklist system for AIdeas LAB projects

  1. New Tables
    - `aideas_lab_tasks`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `due_date` (timestamptz)
      - `completed` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `aideas_lab_tasks` table
    - Add policy for public access
*/

-- Create aideas_lab_tasks table
CREATE TABLE aideas_lab_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE aideas_lab_tasks ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Allow full access to aideas_lab_tasks"
  ON aideas_lab_tasks FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_aideas_lab_tasks_project_id ON aideas_lab_tasks(project_id);
CREATE INDEX idx_aideas_lab_tasks_completed ON aideas_lab_tasks(completed);
CREATE INDEX idx_aideas_lab_tasks_due_date ON aideas_lab_tasks(due_date);

-- Grant permissions
GRANT ALL ON aideas_lab_tasks TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Insert sample tasks for existing projects
INSERT INTO aideas_lab_tasks (project_id, title, description, due_date, completed)
SELECT 
  id as project_id,
  'Setup Development Environment' as title,
  'Install and configure all necessary development tools' as description,
  start_date + interval '1 week' as due_date,
  false as completed
FROM projects 
WHERE category = 'architecture'
UNION ALL
SELECT 
  id as project_id,
  'Design System Architecture' as title,
  'Create detailed system architecture documentation' as description,
  start_date + interval '2 weeks' as due_date,
  false as completed
FROM projects 
WHERE category = 'architecture';