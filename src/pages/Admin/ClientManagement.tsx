import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Building,
  Mail,
  Phone,
  Calendar,
  Shield,
  Archive,
  Edit,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import { mockClients, mockApps } from '../../utils/mockData';
import { Client } from '../../types';

const ClientManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive' | 'Archived'>('all');
  const [appFilter, setAppFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'company' | 'date' | 'activity'>('name');

  const filteredClients = useMemo(() => {
    let filtered = [...mockClients];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.companyName.toLowerCase().includes(term) ||
        client.contactName.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    // App filter
    if (appFilter !== 'all') {
      filtered = filtered.filter(client => client.subscribedApps.includes(appFilter));
    }

    // Sort
    switch (sortBy) {
      case 'company':
        filtered.sort((a, b) => a.companyName.localeCompare(b.companyName));
        break;
      case 'date':
        filtered.sort((a, b) => b.registrationDate.getTime() - a.registrationDate.getTime());
        break;
      case 'activity':
        filtered.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
        break;
      default:
        filtered.sort((a, b) => a.contactName.localeCompare(b.contactName));
        break;
    }

    return filtered;
  }, [searchTerm, statusFilter, appFilter, sortBy]);

  const stats = useMemo(() => {
    const total = mockClients.length;
    const active = mockClients.filter(c => c.status === 'Active').length;
    const inactive = mockClients.filter(c => c.status === 'Inactive').length;
    const archived = mockClients.filter(c => c.status === 'Archived').length;

    return { total, active, inactive, archived };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'Archived': return 'default';
      default: return 'default';
    }
  };

  const handleClientAction = (clientId: string, action: 'edit' | 'archive' | 'activate') => {
    console.log(`${action} client:`, clientId);
    // In real app, this would make API calls
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
          <p className="text-gray-600">
            Manage your client database and subscriptions
          </p>
        </div>
        <Link to="/admin/clients/new">
          <Button icon={Plus}>Add New Client</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Archived</p>
              <p className="text-3xl font-bold text-gray-900">{stats.archived}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Archive className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Archived', label: 'Archived' },
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
              { value: 'name', label: 'Sort by Name' },
              { value: 'company', label: 'Sort by Company' },
              { value: 'date', label: 'Sort by Registration' },
              { value: 'activity', label: 'Sort by Activity' },
            ]}
          />
        </div>
      </Card>

      {/* Clients List */}
      <div className="space-y-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card key={client.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Client Avatar */}
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building className="w-6 h-6 text-primary-600" />
                  </div>

                  {/* Client Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {client.companyName}
                      </h3>
                      <Badge variant={getStatusColor(client.status)} size="sm">
                        {client.status}
                      </Badge>
                      {client.twoFactorEnabled && (
                        <Badge variant="info" size="sm">
                          <Shield className="w-3 h-3 mr-1" />
                          2FA
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{client.contactName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{client.phone}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {client.subscribedApps.map(appId => {
                        const app = mockApps.find(a => a.id === appId);
                        return app ? (
                          <Badge key={appId} variant="default" size="sm">
                            {app.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex flex-col items-center space-y-1 text-sm">
                    <span className="font-medium text-gray-900">{client.totalTickets}</span>
                    <span className="text-gray-500">Tickets</span>
                  </div>

                  <div className="hidden lg:flex flex-col items-center space-y-1 text-sm">
                    <span className="font-medium text-gray-900">{client.totalFeatureRequests}</span>
                    <span className="text-gray-500">Features</span>
                  </div>

                  <div className="hidden lg:flex flex-col items-center space-y-1 text-sm">
                    <span className="font-medium text-gray-900">
                      {format(client.lastActivity, 'MMM dd')}
                    </span>
                    <span className="text-gray-500">Last Active</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Link to={`/admin/clients/${client.id}`}>
                    <Button variant="outline" size="sm" icon={Eye}>
                      View
                    </Button>
                  </Link>
                  
                  <div className="relative">
                    <Button variant="ghost" size="sm" icon={MoreVertical} />
                    {/* Dropdown menu would go here */}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No clients found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or add a new client.
            </p>
            <Link to="/admin/clients/new">
              <Button>Add New Client</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;