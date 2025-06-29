import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TicketIcon, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  Filter,
  Plus
} from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import { useTickets, useClients, useApps } from '../../hooks/useDynamoDB';
import { TicketStatus, Priority } from '../../types';

const AdminDashboard: React.FC = () => {
  const { tickets, loading: ticketsLoading } = useTickets();
  const { clients } = useClients();
  const { apps } = useApps();
  
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

  const dateRangeStart = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    return subDays(new Date(), days);
  }, [dateRange]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      const matchesDate = isAfter(ticketDate, dateRangeStart);
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      return matchesDate && matchesStatus;
    });
  }, [tickets, dateRangeStart, statusFilter]);

  const stats = useMemo(() => {
    const total = filteredTickets.length;
    const open = filteredTickets.filter(t => t.status === 'Open').length;
    const inProgress = filteredTickets.filter(t => t.status === 'In Progress').length;
    const resolved = filteredTickets.filter(t => t.status === 'Resolved').length;
    const urgent = filteredTickets.filter(t => t.priority === 'Urgent').length;
    const avgResponseTime = '1.5 hours'; // Mock data
    const satisfactionRate = '98.5%'; // Mock data

    return {
      total,
      open,
      inProgress,
      resolved,
      urgent,
      avgResponseTime,
      satisfactionRate,
    };
  }, [filteredTickets]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [tickets]);

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'Open': return 'info';
      case 'In Progress': return 'warning';
      case 'Waiting for Response': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'Low': return 'default';
      case 'Medium': return 'info';
      case 'High': return 'warning';
      case 'Urgent': return 'error';
      default: return 'default';
    }
  };

  if (ticketsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage support tickets and monitor system performance
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="rounded-lg border-gray-300 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Link to="/submit-ticket">
            <Button icon={Plus}>New Ticket</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tickets */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Tickets</h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
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
              {recentTickets.map((ticket) => {
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
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
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

          {/* Priority Breakdown */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
            <div className="space-y-3">
              {(['Urgent', 'High', 'Medium', 'Low'] as Priority[]).map((priority) => {
                const count = filteredTickets.filter(t => t.priority === priority).length;
                const percentage = filteredTickets.length > 0 ? (count / filteredTickets.length) * 100 : 0;
                
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

          {/* System Status */}
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
                <span className="text-sm font-medium text-gray-900">{apps.filter(a => a.isActive).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Sync</span>
                <span className="text-sm font-medium text-gray-900">Just now</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;