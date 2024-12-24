import { Brain, Calendar, Home, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">NEXO</span>
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            <Link
              to="/aideaslab"
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                isActive('/aideaslab')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Brain className="h-5 w-5 mr-1" />
              AIdeas LAB
            </Link>
            
            <Link
              to="/eventos"
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                isActive('/eventos')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="h-5 w-5 mr-1" />
              Eventos
            </Link>
            
            <Link
              to="/arquitetura"
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                isActive('/arquitetura')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Home className="h-5 w-5 mr-1" />
              Arquitetura
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}