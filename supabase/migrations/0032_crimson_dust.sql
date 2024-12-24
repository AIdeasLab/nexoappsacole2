/*
  # Fix Suppliers Tables

  1. New Tables
    - `suppliers`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text)
      - `phone` (text)
      - `role` (text)
      - `project_value` (numeric)
      - `rrt_value` (numeric)
      - `projects_completed` (integer)
      - `projects_in_progress` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `supplier_projects`
      - `id` (uuid, primary key)
      - `supplier_id` (uuid, foreign key)
      - `project_id` (uuid, foreign key)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS supplier_projects CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;

-- Create suppliers table
CREATE TABLE suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  role text,
  project_value numeric DEFAULT 0,
  rrt_value numeric DEFAULT 0,
  projects_completed integer DEFAULT 0,
  projects_in_progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create supplier_projects junction table
CREATE TABLE supplier_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(supplier_id, project_id)
);

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public can read suppliers"
  ON suppliers FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert suppliers"
  ON suppliers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update suppliers"
  ON suppliers FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Public can delete suppliers"
  ON suppliers FOR DELETE
  TO anon
  USING (true);

-- Supplier projects policies
CREATE POLICY "Public can read supplier_projects"
  ON supplier_projects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can manage supplier_projects"
  ON supplier_projects FOR ALL
  TO anon
  USING (true);

-- Create indexes
CREATE INDEX idx_suppliers_email ON suppliers(email);
CREATE INDEX idx_suppliers_role ON suppliers(role);
CREATE INDEX idx_supplier_projects_supplier_id ON supplier_projects(supplier_id);
CREATE INDEX idx_supplier_projects_project_id ON supplier_projects(project_id);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;