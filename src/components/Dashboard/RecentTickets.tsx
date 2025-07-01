import React from 'react';
import { Link } from 'react-router-dom';
import { Filter, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { Ticket, TicketStatus, App } from '../../types';
import { getStatusColor, getPriorityColor } from '../../utils/dashboard';

interface RecentTicketsProps {
  tickets: Ticket[];
  apps: App[];
  statusFilter: TicketStatus | 'all';
  onStatusFilterChange: (status: TicketStatus | 'all') => void;
}

const RecentTickets: React.FC<RecentTicketsProps> = ({
  tickets,
  apps,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Tickets</h2>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as TicketStatus | 'all')}
            className="text-sm border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {tickets.map((ticket) => {
          const app = apps.find(a => a.id === ticket.appId);
          return (
            <div
              key={ticket.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-medium text-gray-900 line-clamp-1">
                    {ticket.subject}
                  </h3>
                  <Badge variant={getStatusColor(ticket.status)} size="sm">
                    {ticket.status}
                  </Badge>
                  <Badge variant={getPriorityColor(ticket.priority)} size="sm">
                    {ticket.priority}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>#{ticket.ticketNumber}</span>
                  <span>{ticket.name}</span>
                  <span>{app?.name || 'Unknown App'}</span>
                  <span>{format(new Date(ticket.createdAt), 'MMM dd, h:mm a')}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {ticket.replies.length > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MessageSquare className="w-4 h-4" />
                    <span>{ticket.replies.length}</span>
                  </div>
                )}
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link to="/track-ticket">
          <Button variant="outline" className="w-full">
            View All Tickets
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default RecentTickets;
