import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HelpCircle, Search, User, Settings, Shield, LogIn } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isClientRoute = location.pathname.startsWith('/client');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Holdings CTC</h1>
                <p className="text-xs text-gray-500">Support Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isAdminRoute && !isClientRoute && (
              <>
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/' 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/track-ticket"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/track-ticket' 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Track Ticket
                </Link>
                <Link
                  to="/knowledge-base"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/knowledge-base') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Knowledge Base
                </Link>
                <Link
                  to="/feature-requests"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/feature-requests') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Feature Requests
                </Link>
              </>
            )}

            {isAdminRoute && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/clients"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/admin/clients') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Clients
                </Link>
                <Link
                  to="/admin/apps"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/admin/apps') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Applications
                </Link>
              </>
            )}

            {isClientRoute && (
              <>
                <Link
                  to="/client/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/client/dashboard'
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/submit-ticket"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/submit-ticket' 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Submit Ticket
                </Link>
                <Link
                  to="/feature-requests"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/feature-requests') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Feature Requests
                </Link>
              </>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            {isAdminRoute ? (
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                </div>
              </div>
            ) : isClientRoute ? (
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2 px-3 py-2 bg-primary-100 rounded-lg">
                  <User className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">John Doe</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/client/login"
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Client Login</span>
                </Link>
                <Link
                  to="/admin/login"
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors rounded-lg hover:bg-primary-50"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;