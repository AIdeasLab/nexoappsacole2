/*
  # Create partner_projects_view

  1. Changes
    - Creates a view that joins partner_projects with projects table
    - Provides a unified view of project details for partners
    - Includes all necessary project fields and relationship data

  2. Security
    - View inherits RLS policies from underlying tables
*/

-- Drop view if it exists to avoid conflicts
DROP VIEW IF EXISTS partner_projects_view;

-- Create the view with all necessary fields
CREATE VIEW partner_projects_view AS
SELECT 
  pp.id,
  pp.partner_id,
  pp.project_id,
  pp.status as partnership_status,
  pp.created_at as partnership_created_at,
  pp.updated_at as partnership_updated_at,
  p.name as project_name,
  p.client_name,
  p.description,
  p.status as project_status,
  p.progress,
  p.start_date,
  p.deadline,
  p.location,
  p.completed_tasks,
  p.total_tasks,
  p.category,
  p.created_at as project_created_at,
  p.updated_at as project_updated_at
FROM partner_projects pp
JOIN projects p ON pp.project_id = p.id;