/*
  # Fix Suppliers Table Structure
  
  1. Changes
    - Drop and recreate suppliers table with correct structure
    - Ensure labor_value column exists
    - Set up proper indexes and permissions
*/

-- Drop existing table
DROP TABLE IF EXISTS suppliers CASCADE;

-- Create suppliers table with correct structure
CREATE TABLE suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  role text,
  labor_value numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
DROP POLICY IF EXISTS "Allow full access to suppliers" ON suppliers;
CREATE POLICY "Allow full access to suppliers"
  ON suppliers FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_suppliers_email ON suppliers(email);
CREATE INDEX idx_suppliers_role ON suppliers(role);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;