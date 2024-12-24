-- First clean up existing data
DELETE FROM projects;

-- Insert sample architecture projects
INSERT INTO projects (
  name, 
  client_name, 
  description, 
  status, 
  category,
  location,
  progress,
  completed_tasks,
  total_tasks,
  start_date,
  deadline
) VALUES 
  (
    'Residência Silva',
    'João Silva',
    'Projeto residencial moderno com 3 quartos',
    'active',
    'architecture',
    'São Paulo, SP',
    30,
    3,
    10,
    now(),
    now() + interval '90 days'
  ),
  (
    'Comercial Plaza',
    'Plaza Shopping',
    'Reforma de espaço comercial',
    'active',
    'architecture',
    'Rio de Janeiro, RJ',
    45,
    5,
    12,
    now(),
    now() + interval '120 days'
  );

-- Insert sample events projects
INSERT INTO projects (
  name, 
  client_name, 
  description, 
  status, 
  category,
  location,
  progress,
  completed_tasks,
  total_tasks,
  start_date,
  deadline
) VALUES 
  (
    'Festival de Verão',
    'Prefeitura Municipal',
    'Festival de música ao ar livre',
    'active',
    'events',
    'Praia de Copacabana, RJ',
    20,
    2,
    8,
    now() + interval '30 days',
    now() + interval '45 days'
  ),
  (
    'Congresso de Medicina',
    'Associação Médica',
    'Congresso anual de medicina',
    'active',
    'events',
    'Centro de Convenções, SP',
    15,
    1,
    6,
    now() + interval '60 days',
    now() + interval '63 days'
  );