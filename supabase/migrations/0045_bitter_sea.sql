/*
  # Add AIdeas LAB projects and tasks

  1. Insert Projects
    - MindMeeting
    - Dreamer AI
    - Pixel Mapper

  2. Add initial tasks for each project
*/

-- Insert AIdeas LAB projects
INSERT INTO projects (
  name,
  client_name,
  description,
  status,
  category,
  progress,
  start_date,
  deadline,
  completed_tasks,
  total_tasks
) VALUES 
  (
    'MindMeeting',
    'StackBlitz',
    'Plataforma de reuniões inteligente com IA para otimização de produtividade em encontros remotos',
    'active',
    'aideas',
    65,
    now(),
    now() + interval '90 days',
    6,
    10
  ),
  (
    'Dreamer AI',
    'StackBlitz',
    'Sistema avançado de geração de imagens com IA utilizando técnicas de deep learning e processamento visual',
    'active',
    'aideas',
    45,
    now(),
    now() + interval '120 days',
    4,
    9
  ),
  (
    'Pixel Mapper',
    'StackBlitz',
    'Ferramenta de mapeamento de pixels para projeção em superfícies complexas com calibração automática',
    'active',
    'aideas',
    30,
    now(),
    now() + interval '150 days',
    3,
    8
  );

-- Add tasks for MindMeeting
WITH mindmeeting AS (
  SELECT id FROM projects WHERE name = 'MindMeeting' LIMIT 1
)
INSERT INTO aideas_lab_tasks (project_id, title, description, due_date, completed)
SELECT 
  mindmeeting.id,
  title,
  description,
  due_date,
  completed
FROM mindmeeting, (VALUES
  (
    'Desenvolvimento Frontend',
    'Implementar interface do usuário com React e Tailwind',
    now() + interval '2 weeks',
    true
  ),
  (
    'Integração com IA',
    'Implementar sistema de processamento de linguagem natural',
    now() + interval '4 weeks',
    false
  ),
  (
    'Sistema de Transcrição',
    'Desenvolver módulo de transcrição em tempo real',
    now() + interval '6 weeks',
    false
  )
) AS tasks(title, description, due_date, completed);

-- Add tasks for Dreamer AI
WITH dreamer AS (
  SELECT id FROM projects WHERE name = 'Dreamer AI' LIMIT 1
)
INSERT INTO aideas_lab_tasks (project_id, title, description, due_date, completed)
SELECT 
  dreamer.id,
  title,
  description,
  due_date,
  completed
FROM dreamer, (VALUES
  (
    'Arquitetura do Modelo',
    'Definir e implementar arquitetura do modelo de IA',
    now() + interval '3 weeks',
    true
  ),
  (
    'Dataset de Treinamento',
    'Preparar e processar dataset para treinamento',
    now() + interval '5 weeks',
    false
  ),
  (
    'Interface de Geração',
    'Desenvolver interface para geração de imagens',
    now() + interval '7 weeks',
    false
  )
) AS tasks(title, description, due_date, completed);

-- Add tasks for Pixel Mapper
WITH pixelmapper AS (
  SELECT id FROM projects WHERE name = 'Pixel Mapper' LIMIT 1
)
INSERT INTO aideas_lab_tasks (project_id, title, description, due_date, completed)
SELECT 
  pixelmapper.id,
  title,
  description,
  due_date,
  completed
FROM pixelmapper, (VALUES
  (
    'Algoritmo de Mapeamento',
    'Desenvolver algoritmo core de mapeamento',
    now() + interval '4 weeks',
    true
  ),
  (
    'Calibração Automática',
    'Implementar sistema de calibração automática',
    now() + interval '6 weeks',
    false
  ),
  (
    'Interface de Controle',
    'Desenvolver interface de controle de projeção',
    now() + interval '8 weeks',
    false
  )
) AS tasks(title, description, due_date, completed);