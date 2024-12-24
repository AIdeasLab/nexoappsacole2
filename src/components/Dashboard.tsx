import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Calendar, Home, ArrowRight } from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';

export default function Dashboard() {
  const { stats, loading } = useDashboardStats();

  const categories = [
    {
      name: 'AIdeas LAB',
      icon: Brain,
      stats: stats.aideas,
      path: '/aideaslab',
      color: 'blue'
    },
    {
      name: 'Eventos',
      icon: Calendar,
      stats: stats.events,
      path: '/eventos',
      color: 'green'
    },
    {
      name: 'Arquitetura',
      icon: Home,
      stats: stats.architecture,
      path: '/arquitetura',
      color: 'purple'
    }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Carregando estatísticas...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Olá, Victor!</h1>
          <p className="mt-1 text-sm text-gray-500">
            NEXO - Seu assistente de produtividade
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                  <h2 className="ml-2 text-lg font-medium text-gray-900">
                    {category.name}
                  </h2>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Projetos Ativos</p>
                  <p className="text-xl font-bold text-gray-900">
                    {category.stats.activeProjects}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Tasks Concluídas</p>
                  <p className="text-xl font-bold text-gray-900">
                    {category.stats.completedTasks}/{category.stats.totalTasks}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Progresso Geral</p>
                  <p className="text-xl font-bold text-gray-900">
                    {Math.round(category.stats.totalProgress)}%
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${category.color}-600 rounded-full h-2`}
                    style={{ width: `${category.stats.totalProgress}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}