import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TicketIcon, 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  ThumbsUp
} from 'lucide-react';
import { format } from 'date-fns';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import { mockTickets, mockFeatureRequests, mockClients, mockApps } from '../../utils/mockData';

const ClientDashboard: React.FC = () => {
  // Mock current client (in real app, this would come from auth context)
  const currentClient = mockClients[0]; // John Doe from TechCorp
  
  const clientTickets = useMemo(() => {
    return mockTickets
      .filter(ticket => ticket.clientId === currentClient.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [currentClient.id]);

  const clientFeatureRequests = useMemo(() => {
    return mockFeatureRequests
      .filter(request => request.clientId === currentClient.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [currentClient.id]);

  const subscribedApps = useMemo(() => {
    return mockApps.filter(app => currentClient.subscribedApps.includes(app.id));
  }, [currentClient.subscribedApps]);

  const stats = useMemo(() => {
    const openTickets = clientTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
    const resolvedTickets = clientTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const pendingFeatures = clientFeatureRequests.filter(f => f.status !== 'Completed' && f.status !== 'Rejected').length;
    const completedFeatures = clientFeatureRequests.filter(f => f.status === 'Completed').length;

    return {
      openTickets,
      resolvedTickets,
      pendingFeatures,
      completedFeatures,
    };
  }, [clientTickets, clientFeatureRequests]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'info';
      case 'In Progress': return 'warning';
      case 'Waiting for Response': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      case 'Planned': return 'info';
      case 'In Development': return 'warning';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'default';
      case 'Medium': return 'info';
      case 'High': return 'warning';
      case 'Urgent': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentClient.contactName}
        </h1>
        <p className="text-gray-600">
          {currentClient.companyName} • {subscribedApps.length} subscribed apps
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-3xl font-bold text-gray-900">{stats.openTickets}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Tickets</p>
              <p className="text-3xl font-bold text-gray-900">{stats.resolvedTickets}</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Feature Requests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingFeatures}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Features</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedFeatures}</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center" hover>
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TicketIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit New Ticket</h3>
          <p className="text-gray-600 mb-4">Report an issue or get help with your applications</p>
          <Link to="/submit-ticket">
            <Button className="w-full">Create Ticket</Button>
          </Link>
        </Card>

        <Card className="text-center" hover>
          <div className="w-16 h-16 bg-warning-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Feature</h3>
          <p className="text-gray-600 mb-4">Suggest new features or improvements</p>
          <Link to="/feature-requests">
            <Button variant="outline" className="w-full">Browse & Submit</Button>
          </Link>
        </Card>

        <Card className="text-center" hover>
          <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Knowledge Base</h3>
          <p className="text-gray-600 mb-4">Find answers and learn about your apps</p>
          <Link to="/knowledge-base">
            <Button variant="outline" className="w-full">Browse Articles</Button>
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tickets */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Tickets</h2>
            <Link to="/track-ticket">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          {clientTickets.length > 0 ? (
            <div className="space-y-4">
              {clientTickets.slice(0, 3).map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {ticket.subject}
                    </h3>
                    <Badge variant={getStatusColor(ticket.status)} size="sm">
                      {ticket.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>#{ticket.ticketNumber}</span>
                    <span>{mockApps.find(app => app.id === ticket.appId)?.name}</span>
                    <Badge variant={getPriorityColor(ticket.priority)} size="sm">
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {ticket.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {format(ticket.createdAt, 'MMM dd, yyyy')}
                    </span>
                    <Link to={`/track-ticket?ticket=${ticket.ticketNumber}`}>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TicketIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No tickets submitted yet</p>
              <Link to="/submit-ticket">
                <Button size="sm">Submit Your First Ticket</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Feature Requests */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Feature Requests</h2>
            <Link to="/feature-requests">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          {clientFeatureRequests.length > 0 ? (
            <div className="space-y-4">
              {clientFeatureRequests.slice(0, 3).map((request) => (
                <div
                  key={request.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {request.title}
                    </h3>
                    <Badge variant={getStatusColor(request.status)} size="sm">
                      {request.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>{mockApps.find(app => app.id === request.appId)?.name}</span>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{request.upvotes} votes</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {request.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {format(request.createdAt, 'MMM dd, yyyy')}
                    </span>
                    <Link to={`/feature-requests/${request.id}`}>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No feature requests yet</p>
              <Link to="/feature-requests">
                <Button size="sm">Submit Your First Request</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Subscribed Apps */}
      <Card className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Subscribed Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscribedApps.map((app) => (
            <div
              key={app.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{app.name}</h3>
                <Badge variant="success" size="sm">v{app.version}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{app.description}</p>
              <div className="flex space-x-2">
                <Link to={`/knowledge-base?app=${app.id}`}>
                  <Button variant="outline" size="sm">Help Docs</Button>
                </Link>
                <Link to={`/submit-ticket?app=${app.id}`}>
                  <Button variant="ghost" size="sm">Get Support</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ClientDashboard;