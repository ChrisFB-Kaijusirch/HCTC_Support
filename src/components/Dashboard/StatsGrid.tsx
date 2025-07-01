import React from 'react';
import { TicketIcon, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import Card from '../UI/Card';
import { TicketStats } from '../../utils/dashboard';

interface StatsGridProps {
  stats: TicketStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Tickets</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <TicketIcon className="w-6 h-6 text-primary-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
          <span className="text-success-600">+12%</span>
          <span className="text-gray-500 ml-1">from last period</span>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Open Tickets</p>
            <p className="text-3xl font-bold text-gray-900">{stats.open}</p>
          </div>
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-warning-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-gray-500">
            {stats.inProgress} in progress
          </span>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
            <p className="text-3xl font-bold text-gray-900">{stats.avgResponseTime}</p>
          </div>
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-success-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-success-600">-15 min</span>
          <span className="text-gray-500 ml-1">from last period</span>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Satisfaction Rate</p>
            <p className="text-3xl font-bold text-gray-900">{stats.satisfactionRate}</p>
          </div>
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-primary-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-success-600">+2.1%</span>
          <span className="text-gray-500 ml-1">from last period</span>
        </div>
      </Card>
    </div>
  );
};

export default StatsGrid;
