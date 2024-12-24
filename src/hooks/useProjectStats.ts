import { useEffect, useState } from 'react';
import { getProjects } from '../lib/projects';
import { Project } from '../types';

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalProgress: number;
}

export function useProjectStats(category: 'architecture' | 'events') {
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const projects = await getProjects(category);
        
        const activeProjects = projects.filter(p => p.status === 'active').length;
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        const totalProgress = projects.length > 0
          ? projects.reduce((acc, p) => acc + p.progress, 0) / projects.length
          : 0;

        setStats({
          totalProjects: projects.length,
          activeProjects,
          completedProjects,
          totalProgress,
        });
      } catch (error) {
        console.error(`Error loading ${category} stats:`, error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [category]);

  return { stats, loading };
}