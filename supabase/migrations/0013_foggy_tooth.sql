/*
  # Fix Partner Policies and Add Missing Indexes

  1. Changes
    - Add missing policies for partners table
    - Add missing indexes for performance
    - Add missing partner policies
    - Fix potential policy conflicts

  2. Security
    - Ensures complete RLS coverage
    - Maintains data integrity
*/

-- Ensure partners have all necessary policies
DROP POLICY IF EXISTS "Public can read partners" ON partners;
DROP POLICY IF EXISTS "Public can insert partners" ON partners;
DROP POLICY IF EXISTS "Public can update partners" ON partners;
DROP POLICY IF EXISTS "Public can delete partners" ON partners;

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

-- Add missing indexes for partners
CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_partners_role ON partners(role);
CREATE INDEX IF NOT EXISTS idx_partners_created_at ON partners(created_at);

-- Add trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all relevant tables if they don't exist
DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partner_projects_updated_at ON partner_projects;
CREATE TRIGGER update_partner_projects_updated_at
    BEFORE UPDATE ON partner_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure view permissions
GRANT SELECT ON partner_projects_view TO anon;
GRANT SELECT ON partner_projects_view TO authenticated;