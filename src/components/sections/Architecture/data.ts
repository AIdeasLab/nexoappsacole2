import { Project, Partner } from '../../../types';

export const projects: Project[] = [
  {
    id: 'c0a80121-7ac0-4b1c-9d9a-b46984c3e101',
    name: 'Residência Silva',
    clientName: 'João Silva',
    status: 'active',
    progress: 65,
    startDate: '2024-02-01',
    deadline: '2024-05-01',
    location: 'São Paulo, SP',
    completedTasks: 8,
    totalTasks: 12,
    tasks: []
  },
  {
    id: 'c0a80121-7ac0-4b1c-9d9a-b46984c3e102',
    name: 'Comercial Plaza',
    clientName: 'Plaza Shopping',
    status: 'active',
    progress: 30,
    startDate: '2024-03-01',
    deadline: '2024-06-15',
    location: 'Rio de Janeiro, RJ',
    completedTasks: 3,
    totalTasks: 10,
    tasks: []
  }
];

export const partners: Partner[] = [
  {
    id: '1',
    name: 'Carlos Estruturas',
    email: 'carlos@estruturas.com',
    phone: '(11) 99999-9999',
    role: 'Engenheiro Estrutural',
    averageValue: 5000,
    projectsCompleted: 8,
    projectsInProgress: 2,
    projects: []
  },
  {
    id: '2',
    name: 'Maria Projetos',
    email: 'maria@projetos.com',
    phone: '(11) 98888-8888',
    role: 'Arquiteta Sênior',
    averageValue: 7500,
    projectsCompleted: 15,
    projectsInProgress: 3,
    projects: []
  }
];