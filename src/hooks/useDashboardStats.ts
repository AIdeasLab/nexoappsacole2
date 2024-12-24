import { useState, useEffect } from 'react';
import { getProjects } from '../lib/projects';

interface CategoryStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalProgress: number;
  totalTasks: number;
  completedTasks: number;
}

interface DashboardStats {
  architecture: CategoryStats;
  events: CategoryStats;
  aideas: CategoryStats;
}

const initialStats: CategoryStats = {
  totalProjects: 0,
  activeProjects: 0,
  completedProjects: 0,
  totalProgress: 0,
  totalTasks: 0,
  completedTasks: 0
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    architecture: initialStats,
    events: initialStats,
    aideas: initialStats
  });
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    try {
      const [architectureProjects, eventsProjects, aideasProjects] = await Promise.all([
        getProjects('architecture'),
        getProjects('events'),
        getProjects('aideas')
      ]);

      function calculateStats(projects: any[]): CategoryStats {
        const totalProjects = projects.length;
        const activeProjects = projects.filter(p => p.status === 'active').length;
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        const totalProgress = projects.reduce((acc, p) => acc + (p.progress || 0), 0) / (totalProjects || 1);
        const totalTasks = projects.reduce((acc, p) => acc + (p.totalTasks || 0), 0);
        const completedTasks = projects.reduce((acc, p) => acc + (p.completedTasks || 0), 0);

        return {
          totalProjects,
          activeProjects,
          completedProjects,
          totalProgress,
          totalTasks,
          completedTasks
        };
      }

      setStats({
        architecture: calculateStats(architectureProjects),
        events: calculateStats(eventsProjects),
        aideas: calculateStats(aideasProjects)
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
    // Set up polling every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, refresh: loadStats };
}