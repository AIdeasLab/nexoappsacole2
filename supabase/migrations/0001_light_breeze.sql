/*
  # Project Management Schema

  1. New Tables
    - projects
      - Basic project information
      - Status tracking
      - Client details
    - tasks
      - Task management
      - Status and assignments
    - project_documents
      - Document storage
      - File metadata
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  client_name text,
  description text,
  status text NOT NULL DEFAULT 'active',
  progress integer DEFAULT 0,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  deadline timestamptz,
  location text,
  completed_tasks integer DEFAULT 0,
  total_tasks integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'todo',
  assigned_to text[],
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_documents table
CREATE TABLE IF NOT EXISTS project_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  file_type text NOT NULL,
  file_path text NOT NULL,
  size integer,
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Task policies
CREATE POLICY "Users can read project tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = tasks.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage project tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = tasks.project_id
    AND projects.user_id = auth.uid()
  ));

-- Document policies
CREATE POLICY "Users can read project documents"
  ON project_documents FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_documents.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage project documents"
  ON project_documents FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_documents.project_id
    AND projects.user_id = auth.uid()
  ));