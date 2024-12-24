/*
  # Test connection and add initial data
  
  1. Test Data
    - Add a test project
    - Add a test task
    - Add a test partner
  
  2. Security
    - Uses existing RLS policies
*/

-- Insert test project
INSERT INTO projects (
  name,
  client_name,
  description,
  status,
  progress,
  start_date,
  deadline,
  location
) VALUES (
  'Test Project',
  'Test Client',
  'This is a test project to verify the connection',
  'active',
  0,
  now(),
  now() + interval '30 days',
  'Test Location'
);

-- Insert test partner
INSERT INTO partners (
  name,
  email,
  phone,
  role,
  project_value,
  rrt_value
) VALUES (
  'Test Partner',
  'test@example.com',
  '(00) 00000-0000',
  'Test Role',
  1000,
  500
);