import { Project } from '../../../types';

export const projects: Project[] = [
  {
    id: '1',
    name: 'MindMeeting',
    description: 'Plataforma de reuniões inteligente com IA',
    status: 'active',
    progress: 65,
    startDate: '2024-01-15',
    tasks: [
      {
        id: 't1',
        title: 'Desenvolvimento Frontend',
        description: 'Implementar interface do usuário',
        status: 'in-progress',
        assignedTo: ['Victor'],
        dueDate: '2024-03-30'
      }
    ],
    team: [
      { id: 'm1', name: 'Victor', role: 'Tech Lead' },
      { id: 'm2', name: 'Ana', role: 'UI/UX Designer' }
    ],
    pendingTasks: 3,
    dueDate: '2024-04-15'
  },
  {
    id: '2',
    name: 'Dreamer AI',
    description: 'Sistema de geração de imagens com IA',
    status: 'active',
    progress: 45,
    startDate: '2024-02-01',
    tasks: [
      {
        id: 't2',
        title: 'Integração com API',
        description: 'Conectar com serviços de IA',
        status: 'todo',
        assignedTo: ['Victor'],
        dueDate: '2024-03-15'
      }
    ],
    team: [
      { id: 'm1', name: 'Victor', role: 'Tech Lead' },
      { id: 'm3', name: 'Pedro', role: 'AI Engineer' }
    ],
    pendingTasks: 5,
    dueDate: '2024-05-01'
  },
  {
    id: '3',
    name: 'Pixel Mapper',
    description: 'Ferramenta de mapeamento de pixels para projeção',
    status: 'active',
    progress: 30,
    startDate: '2024-02-15',
    tasks: [
      {
        id: 't3',
        title: 'Algoritmo de Mapeamento',
        description: 'Desenvolver core do sistema',
        status: 'todo',
        assignedTo: ['Victor'],
        dueDate: '2024-04-01'
      }
    ],
    team: [
      { id: 'm1', name: 'Victor', role: 'Tech Lead' }
    ],
    pendingTasks: 4,
    dueDate: '2024-06-01'
  }
];