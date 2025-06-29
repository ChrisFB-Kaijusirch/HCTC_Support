import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  Search, 
  MoreVertical,
  Settings,
  Users,
  TicketIcon,
  Lightbulb,
  Edit,
  Archive,
  Eye,
  Calendar,
  Code,
  Globe,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Textarea from '../../components/UI/Textarea';
import { useApps, useClients, useTickets, useFeatureRequests } from '../../hooks/useDynamoDB';
import { App } from '../../types';

const AppManagement: React.FC = () => {
  const { apps, loading, createApp, updateApp } = useApps();
  const { clients } = useClients();
  const { tickets } = useTickets();
  const { featureRequests } = useFeatureRequests();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    description: '',
    detailedDescription: '',
    category: '',
    supportUrl: '',
    documentationUrl: '',
    isActive: true,
  });

  const filteredApps = useMemo(() => {
    let filtered = [...apps];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(term) ||
        app.description.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => 
        statusFilter === 'active' ? app.isActive : !app.isActive
      );
    }

    return filtered;
  }, [apps, searchTerm, statusFilter]);

  const getAppStats = (appId: string) => {
    const subscribers = clients.filter(client => 
      client.subscribedApps.includes(appId)
    ).length;
    
    const appTickets = tickets.filter(ticket => ticket.appId === appId).length;
    const openTickets = tickets.filter(ticket => 
      ticket.appId === appId && (ticket.status === 'Open' || ticket.status === 'In Progress')
    ).length;
    
    const appFeatureRequests = featureRequests.filter(request => 
      request.appId === appId
    ).length;

    return { subscribers, tickets: appTickets, openTickets, featureRequests: appFeatureRequests };
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingApp) {
        await updateApp(editingApp.id, formData);
      } else {
        await createApp({
          ...formData,
          createdAt: new Date(),
        });
      }
      
      // Reset form
      setFormData({
        name: '',
        version: '',
        description: '',
        detailedDescription: '',
        category: '',
        supportUrl: '',
        documentationUrl: '',
        isActive: true,
      });
      setShowAddForm(false);
      setEditingApp(null);
    } catch (error) {
      console.error('Error saving app:', error);
    }
  };

  const handleEdit = (app: App) => {
    setEditingApp(app);
    setFormData({
      name: app.name,
      version: app.version,
      description: app.description,
      detailedDescription: app.description, // In real app, this would be a separate field
      category: 'Business', // Mock category
      supportUrl: '', // Mock URL
      documentationUrl: '', // Mock URL
      isActive: app.isActive,
    });
    setShowAddForm(true);
  };

  const handleToggleStatus = async (app: App) => {
    try {
      await updateApp(app.id, { isActive: !app.isActive });
    } catch (error) {
      console.error('Error toggling app status:', error);
    }
  };

  const stats = useMemo(() => {
    const total = apps.length;
    const active = apps.filter(app => app.isActive).length;
    const inactive = apps.filter(app => !app.isActive).length;
    const totalSubscribers = apps.reduce((sum, app) => 
      sum + clients.filter(client => client.subscribedApps.includes(app.id)).length, 0
    );

    return { total, active, inactive, totalSubscribers };
  }, [apps, clients]);

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Management</h1>
          <p className="text-gray-600">
            Manage your applications, versions, and support documentation
          </p>
        </div>
        <Button 
          icon={Plus} 
          onClick={() => {
            setShowAddForm(true);
            setEditingApp(null);
            setFormData({
              name: '',
              version: '',
              description: '',
              detailedDescription: '',
              category: '',
              supportUrl: '',
              documentationUrl: '',
              isActive: true,
            });
          }}
        >
          Add New Application
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Apps</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Apps</p>
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
              <p className="text-sm font-medium text-gray-600">Inactive Apps</p>
              <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Archive className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSubscribers}</p>
            </div>
            <div className="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-info-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingApp ? 'Edit Application' : 'Add New Application'}
            </h2>
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowAddForm(false);
                setEditingApp(null);
              }}
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Application Name *"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Portfolio Manager"
                required
              />
              
              <Input
                label="Version *"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder="e.g., 2.1.0"
                required
              />
            </div>

            <Input
              label="Short Description *"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description for dropdown lists"
              required
            />

            <Textarea
              label="Detailed Description"
              value={formData.detailedDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, detailedDescription: e.target.value }))}
              placeholder="Comprehensive description of the application's features and capabilities"
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                options={[
                  { value: '', label: 'Select Category' },
                  { value: 'Business', label: 'Business Management' },
                  { value: 'Finance', label: 'Financial Tools' },
                  { value: 'Analytics', label: 'Analytics & Reporting' },
                  { value: 'Productivity', label: 'Productivity' },
                  { value: 'Other', label: 'Other' },
                ]}
              />

              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Application is active and available for support
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Support URL"
                value={formData.supportUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, supportUrl: e.target.value }))}
                placeholder="https://support.example.com"
              />
              
              <Input
                label="Documentation URL"
                value={formData.documentationUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, documentationUrl: e.target.value }))}
                placeholder="https://docs.example.com"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingApp(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingApp ? 'Update Application' : 'Add Application'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Applications' },
              { value: 'active', label: 'Active Only' },
              { value: 'inactive', label: 'Inactive Only' },
            ]}
          />
          
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-500">
              {filteredApps.length} of {apps.length} applications
            </span>
          </div>
        </div>
      </Card>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApps.map((app) => {
          const stats = getAppStats(app.id);
          
          return (
            <Card key={app.id} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="info" size="sm">
                        <Code className="w-3 h-3 mr-1" />
                        v{app.version}
                      </Badge>
                      <Badge variant={app.isActive ? 'success' : 'default'} size="sm">
                        {app.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={Edit}
                    onClick={() => handleEdit(app)}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={app.isActive ? Archive : Shield}
                    onClick={() => handleToggleStatus(app)}
                  />
                </div>
              </div>

              <p className="text-gray-600 mb-4">{app.description}</p>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="font-medium text-gray-900">{stats.subscribers}</span>
                  </div>
                  <span className="text-xs text-gray-500">Subscribers</span>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TicketIcon className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="font-medium text-gray-900">{stats.tickets}</span>
                  </div>
                  <span className="text-xs text-gray-500">Total Tickets</span>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TicketIcon className="w-4 h-4 text-warning-500 mr-1" />
                    <span className="font-medium text-gray-900">{stats.openTickets}</span>
                  </div>
                  <span className="text-xs text-gray-500">Open Tickets</span>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Lightbulb className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="font-medium text-gray-900">{stats.featureRequests}</span>
                  </div>
                  <span className="text-xs text-gray-500">Features</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {format(new Date(app.createdAt), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>Support Portal</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={Settings}
                  onClick={() => handleEdit(app)}
                  className="flex-1"
                >
                  Edit
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredApps.length === 0 && (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No applications found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search criteria.' 
              : 'Get started by adding your first application.'
            }
          </p>
          <Button 
            onClick={() => {
              setShowAddForm(true);
              setEditingApp(null);
            }}
          >
            Add New Application
          </Button>
        </Card>
      )}
    </div>
  );
};

export default AppManagement;