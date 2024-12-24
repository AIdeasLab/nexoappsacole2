import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '../types';

interface TaskCalendarProps {
  tasks: Task[];
}

export default function TaskCalendar({ tasks }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.dueDate).toDateString();
    acc[date] = [...(acc[date] || []), task];
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Calendário de Tarefas
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ←
          </button>
          <span className="font-medium">
            {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
          const dateString = date.toDateString();
          const dayTasks = tasksByDate[dateString] || [];
          
          return (
            <div
              key={i}
              className={`h-24 p-2 border border-gray-100 rounded-lg ${
                date.toDateString() === new Date().toDateString()
                  ? 'bg-blue-50'
                  : 'bg-white'
              }`}
            >
              <div className="text-sm font-medium text-gray-900 mb-1">{i + 1}</div>
              <div className="space-y-1">
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}