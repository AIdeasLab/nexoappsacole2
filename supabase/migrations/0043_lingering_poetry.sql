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
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_role ON suppliers(role);
CREATE INDEX IF NOT EXISTS idx_suppliers_created_at ON suppliers(created_at);

-- Grant permissions
GRANT ALL ON suppliers TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Insert sample data
INSERT INTO suppliers (name, role, labor_value, email, phone) VALUES 
('João Silva', 'Pedreiro', 2500, 'joao@example.com', '(11) 98765-4321'),
('Maria Santos', 'Eletricista', 3000, 'maria@example.com', '(11) 91234-5678');