import React from 'react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import { Ticket, Priority } from '../../types';
import { getPriorityColor, calculatePriorityPercentage } from '../../utils/dashboard';

interface PriorityBreakdownProps {
  tickets: Ticket[];
}

const PriorityBreakdown: React.FC<PriorityBreakdownProps> = ({ tickets }) => {
  const priorities: Priority[] = ['Urgent', 'High', 'Medium', 'Low'];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
      <div className="space-y-3">
        {priorities.map((priority) => {
          const count = tickets.filter(t => t.priority === priority).length;
          const percentage = calculatePriorityPercentage(tickets, priority);
          
          return (
            <div key={priority} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={getPriorityColor(priority)} size="sm">
                  {priority}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      priority === 'Urgent' ? 'bg-error-500' :
                      priority === 'High' ? 'bg-warning-500' :
                      priority === 'Medium' ? 'bg-primary-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PriorityBreakdown;
