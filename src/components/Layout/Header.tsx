import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HelpCircle, Search, User, Settings, Shield, LogIn, LogOut, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isClientRoute = location.pathname.startsWith('/client');

  // Mock authentication state - in real app, this would come from context
  const isAuthenticated = isAdminRoute || isClientRoute;
  const userType = isAdminRoute ? 'admin' : isClientRoute ? 'client' : null;
  const userName = isAdminRoute ? 'Admin User' : isClientRoute ? 'John Doe' : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // In real app, this would clear authentication state
    setShowUserDropdown(false);
    navigate('/');
  };

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
                  to="/client/login"
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
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {userType === 'admin' ? (
                        <Shield className="w-4 h-4 text-gray-600" />
                      ) : (
                        <User className="w-4 h-4 text-primary-600" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {userName}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                      showUserDropdown ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{userType} Account</p>
                      </div>
                      
                      <Link
                        to={userType === 'admin' ? '/admin/dashboard' : '/client/dashboard'}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      
                      <button
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
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