import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { updateProject } from '../lib/projects';
import { ProjectStatus } from '../types/project';

interface ProjectStatusSelectProps {
  projectId: string;
  currentStatus: ProjectStatus;
  onStatusChange: () => void;
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pendente',
    icon: AlertCircle,
    bgColor: 'bg-yellow-100',
    hoverBg: 'hover:bg-yellow-200',
    textColor: 'text-yellow-800'
  },
  active: {
    label: 'Em Andamento',
    icon: Clock,
    bgColor: 'bg-blue-100',
    hoverBg: 'hover:bg-blue-200',
    textColor: 'text-blue-800'
  },
  completed: {
    label: 'Concluído',
    icon: CheckCircle,
    bgColor: 'bg-green-100',
    hoverBg: 'hover:bg-green-200',
    textColor: 'text-green-800'
  }
} as const;

export default function ProjectStatusSelect({ 
  projectId, 
  currentStatus,
  onStatusChange 
}: ProjectStatusSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleStatusChange(newStatus: ProjectStatus) {
    if (isUpdating || newStatus === currentStatus) return;

    try {
      setIsUpdating(true);
      await updateProject(projectId, { status: newStatus });
      onStatusChange();
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating project status:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  const currentConfig = STATUS_CONFIG[currentStatus];
  const StatusIcon = currentConfig.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
          ${currentConfig.bgColor} ${currentConfig.textColor} ${currentConfig.hoverBg}
          ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        disabled={isUpdating}
      >
        <StatusIcon className="w-4 h-4 mr-1.5" />
        {currentConfig.label}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 animate-scale-in">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={status}
                onClick={() => handleStatusChange(status as ProjectStatus)}
                className={`w-full flex items-center px-4 py-2 text-sm transition-colors
                  ${status === currentStatus 
                    ? `${config.textColor} font-medium ${config.bgColor}`
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                disabled={isUpdating}
              >
                <Icon className="w-4 h-4 mr-2" />
                {config.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}