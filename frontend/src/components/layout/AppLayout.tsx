import React from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard">
                <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
                  Locagest Pro
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link to="/properties">
                <Button variant="ghost" size="sm">
                  Propriétés
                </Button>
              </Link>
              <Link to="/tenants">
                <Button variant="ghost" size="sm">
                  Locataires
                </Button>
              </Link>
              <span className="text-sm text-gray-700">
                {user?.name}
                {user?.is_company && user?.company_name && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({user.company_name})
                  </span>
                )}
              </span>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
