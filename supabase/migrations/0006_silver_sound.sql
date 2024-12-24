/*
  # Update partners table fields

  1. Changes
    - Add `rrt_value` column to partners table
    - Rename `average_value` to `project_value` for clarity
*/

-- First add the new column
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS rrt_value numeric DEFAULT 0;

-- Then rename the existing column
ALTER TABLE partners
  RENAME COLUMN average_value TO project_value;