/*
  # Fix Suppliers Functionality

  1. Recreate Tables
    - Drop and recreate suppliers table with correct structure
    - Ensure proper constraints and defaults
    - Add necessary indexes
  
  2. Security
    - Enable RLS
    - Add permissive policies
    - Grant proper permissions
*/

-- First drop existing tables to ensure clean slate
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

-- Create permissive policies
DO $$ 
BEGIN
  -- Suppliers policies
  DROP POLICY IF EXISTS "Allow full access to suppliers" ON suppliers;
  CREATE POLICY "Allow full access to suppliers" 
    ON suppliers FOR ALL 
    TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

  -- Supplier projects policies
  DROP POLICY IF EXISTS "Allow full access to supplier_projects" ON supplier_projects;
  CREATE POLICY "Allow full access to supplier_projects" 
    ON supplier_projects FOR ALL 
    TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);
END $$;

-- Create indexes
CREATE INDEX idx_suppliers_email ON suppliers(email);
CREATE INDEX idx_suppliers_role ON suppliers(role);
CREATE INDEX idx_supplier_projects_supplier_id ON supplier_projects(supplier_id);
CREATE INDEX idx_supplier_projects_project_id ON supplier_projects(project_id);

-- Grant ALL permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;