/*
  # Clean up existing data and improve deletion cascade

  1. Changes
    - Delete all existing data from projects table
    - Add ON DELETE CASCADE to related tables
    - Add trigger for updating timestamps
*/

-- Delete all existing data
DELETE FROM projects;

-- Ensure proper cascading deletes
ALTER TABLE tasks
  DROP CONSTRAINT IF EXISTS tasks_project_id_fkey,
  ADD CONSTRAINT tasks_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE;

ALTER TABLE project_documents
  DROP CONSTRAINT IF EXISTS project_documents_project_id_fkey,
  ADD CONSTRAINT project_documents_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE;

-- Add trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();