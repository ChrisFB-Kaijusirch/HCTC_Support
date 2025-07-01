import React from 'react';
import { Link } from 'react-router-dom';
import { TicketIcon, MessageSquare, Users, TrendingUp } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const QuickActions: React.FC = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Link to="/track-ticket" className="block">
          <Button variant="outline" className="w-full justify-start" icon={TicketIcon}>
            Manage Tickets
          </Button>
        </Link>
        <Link to="/knowledge-base" className="block">
          <Button variant="outline" className="w-full justify-start" icon={MessageSquare}>
            Knowledge Base
          </Button>
        </Link>
        <Link to="/admin/clients" className="block">
          <Button variant="outline" className="w-full justify-start" icon={Users}>
            User Management
          </Button>
        </Link>
        <Link to="/admin/apps" className="block">
          <Button variant="outline" className="w-full justify-start" icon={TrendingUp}>
            App Management
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default QuickActions;
