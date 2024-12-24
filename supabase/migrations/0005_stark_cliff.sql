/*
  # Create partners and partner projects tables

  1. New Tables
    - `partners`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `role` (text)
      - `average_value` (numeric)
      - `projects_completed` (integer)
      - `projects_in_progress` (integer)
      - Basic timestamps
    
    - `partner_projects`
      - Links partners to projects
      - Tracks project status and completion

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (matching existing project setup)
*/

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  role text,
  average_value numeric DEFAULT 0,
  projects_completed integer DEFAULT 0,
  projects_in_progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create partner_projects junction table
CREATE TABLE IF NOT EXISTS partner_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, project_id)
);

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public can read partners"
  ON partners FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert partners"
  ON partners FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update partners"
  ON partners FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Public can delete partners"
  ON partners FOR DELETE
  TO anon
  USING (true);

-- Partner projects policies
CREATE POLICY "Public can read partner_projects"
  ON partner_projects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can manage partner_projects"
  ON partner_projects FOR ALL
  TO anon
  USING (true);

-- Add trigger for updating timestamps
CREATE TRIGGER partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER partner_projects_updated_at
  BEFORE UPDATE ON partner_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();