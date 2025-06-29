import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const TrackTicket: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Tickets</h1>
        <p className="text-gray-600">
          Please log in to view and track your support requests.
        </p>
      </div>

      <Card className="text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-primary-600" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Login Required
        </h2>
        
        <p className="text-gray-600 mb-6">
          Please log in to access this feature
        </p>

        <div className="space-y-4">
          <Link to="/client/login">
            <Button className="w-full">
              Client Login
            </Button>
          </Link>
          
          <Link to="/admin/login">
            <Button variant="outline" className="w-full">
              Admin Login
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Don't have an account? Contact support for access.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/knowledge-base">
              <Button variant="ghost" size="sm">
                Browse Knowledge Base
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TrackTicket;