import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  ThumbsUp, 
  Plus, 
  Filter, 
  TrendingUp,
  Clock,
  CheckCircle,
  Pin
} from 'lucide-react';
import { format } from 'date-fns';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import { mockFeatureRequests, mockApps, mockClients } from '../../utils/mockData';
import { FeatureRequestStatus, Priority } from '../../types';

const FeatureRequestsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FeatureRequestStatus | 'all'>('all');
  const [appFilter, setAppFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'status'>('recent');

  const filteredRequests = useMemo(() => {
    let filtered = [...mockFeatureRequests];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(term) ||
        request.description.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // App filter
    if (appFilter !== 'all') {
      filtered = filtered.filter(request => request.appId === appFilter);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'status':
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    // Pinned items first
    filtered.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return filtered;
  }, [searchTerm, statusFilter, appFilter, sortBy]);

  const stats = useMemo(() => {
    const total = mockFeatureRequests.length;
    const inDevelopment = mockFeatureRequests.filter(r => r.status === 'In Development').length;
    const completed = mockFeatureRequests.filter(r => r.status === 'Completed').length;
    const planned = mockFeatureRequests.filter(r => r.status === 'Planned').length;

    return { total, inDevelopment, completed, planned };
  }, []);

  const getStatusColor = (status: FeatureRequestStatus) => {
    switch (status) {
      case 'Submitted': return 'default';
      case 'Under Review': return 'info';
      case 'Planned': return 'info';
      case 'In Development': return 'warning';
      case 'Completed': return 'success';
      case 'Rejected': return 'error';
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

  const handleUpvote = (requestId: string) => {
    // In real app, this would make an API call
    console.log('Upvoting request:', requestId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feature Requests</h1>
          <p className="text-gray-600">
            Submit new ideas and vote on existing feature requests
          </p>
        </div>
        <Link to="/feature-requests/submit">
          <Button icon={Plus}>Submit Feature Request</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Development</p>
              <p className="text-3xl font-bold text-gray-900">{stats.inDevelopment}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Planned</p>
              <p className="text-3xl font-bold text-gray-900">{stats.planned}</p>
            </div>
            <div className="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-info-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search feature requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'Submitted', label: 'Submitted' },
              { value: 'Under Review', label: 'Under Review' },
              { value: 'Planned', label: 'Planned' },
              { value: 'In Development', label: 'In Development' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
          />
          
          <Select
            value={appFilter}
            onChange={(e) => setAppFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Applications' },
              ...mockApps.map(app => ({ value: app.id, label: app.name }))
            ]}
          />
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            options={[
              { value: 'recent', label: 'Most Recent' },
              { value: 'popular', label: 'Most Popular' },
              { value: 'status', label: 'By Status' },
            ]}
          />
        </div>
      </Card>

      {/* Feature Requests List */}
      <div className="space-y-6">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => {
            const app = mockApps.find(a => a.id === request.appId);
            const client = mockClients.find(c => c.id === request.clientId);
            
            return (
              <Card key={request.id} hover>
                <div className="flex items-start space-x-4">
                  {/* Upvote Section */}
                  <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                    <button
                      onClick={() => handleUpvote(request.id)}
                      className="p-2 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <ThumbsUp className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="text-sm font-medium text-gray-900">
                      {request.upvotes}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {request.isPinned && (
                          <Pin className="w-4 h-4 text-warning-500" />
                        )}
                        <Link
                          to={`/feature-requests/${request.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {request.title}
                        </Link>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Badge variant={getStatusColor(request.status)} size="sm">
                          {request.status}
                        </Badge>
                        <Badge variant={getPriorityColor(request.priority)} size="sm">
                          {request.priority}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {request.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{app?.name}</span>
                        <span>by {client?.contactName}</span>
                        <span>{format(request.createdAt, 'MMM dd, yyyy')}</span>
                        {request.estimatedCompletion && (
                          <span className="text-primary-600">
                            ETA: {format(request.estimatedCompletion, 'MMM yyyy')}
                          </span>
                        )}
                      </div>
                      
                      <Link to={`/feature-requests/${request.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No feature requests found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or be the first to submit a feature request.
            </p>
            <Link to="/feature-requests/submit">
              <Button>Submit Feature Request</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeatureRequestsList;