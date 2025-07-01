import React from 'react';
import Card from '../UI/Card';
import { Client, App } from '../../types';

interface SystemStatusProps {
  clients: Client[];
  apps: App[];
}

const SystemStatus: React.FC<SystemStatusProps> = ({ clients, apps }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Database Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">Connected</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Clients</span>
          <span className="text-sm font-medium text-gray-900">{clients.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Active Apps</span>
          <span className="text-sm font-medium text-gray-900">
            {apps.filter(a => a.isActive).length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Last Sync</span>
          <span className="text-sm font-medium text-gray-900">Just now</span>
        </div>
      </div>
    </Card>
  );
};

export default SystemStatus;
