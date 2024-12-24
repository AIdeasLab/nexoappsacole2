import { useEffect, useState } from 'react';
import { getPartnerProjects } from '../lib/partners';
import { Project } from '../types';

interface PartnerProjectStats {
  completedProjects: number;
  inProgressProjects: number;
  totalProjects: number;
}

export function usePartnerProjectStats(partnerId: string) {
  const [stats, setStats] = useState<PartnerProjectStats>({
    completedProjects: 0,
    inProgressProjects: 0,
    totalProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const projects = await getPartnerProjects(partnerId);
        
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        const inProgressProjects = projects.filter(p => p.status === 'active').length;
        
        setStats({
          completedProjects,
          inProgressProjects,
          totalProjects: projects.length,
        });
      } catch (error) {
        console.error('Error loading partner project stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [partnerId]);

  return { stats, loading };
}