export type ProjectStatus = 'pending' | 'active' | 'completed';

export interface Project {
  id: string;
  name: string;
  clientName?: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  startDate?: string;
  deadline?: string;
  location?: string;
  completedTasks: number;
  totalTasks: number;
  category: 'architecture' | 'events' | 'aideas';
  tasks: any[];
  projectType?: string;
}