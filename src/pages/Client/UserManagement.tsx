import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  Calendar,
  Search,
  Filter,
  UserCheck,
  UserX,
  Crown
} from 'lucide-react';
import { format } from 'date-fns';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import { User, UserRole, UserPermission } from '../../types';

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    clientId: 'client_1',
    name: 'John Doe',
    email: 'john@techcorp.com',
    role: 'primary',
    permissions: [
      'tickets.create', 'tickets.view', 'tickets.manage',
      'users.create', 'users.view', 'users.manage',
      'billing.view', 'billing.manage',
      'features.create', 'features.view', 'features.vote'
    ],
    isActive: true,
    isPrimary: true,
    twoFactorEnabled: true,
    lastLogin: '2024-12-20T10:30:00.000Z',
    createdAt: '2024-01-15T00:00:00.000Z',
    createdBy: 'system'
  },
  {
    id: '2',
    clientId: 'client_1',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    role: 'admin',
    permissions: [
      'tickets.create', 'tickets.view', 'tickets.manage',
      'users.view', 'features.create', 'features.view', 'features.vote'
    ],
    isActive: true,
    isPrimary: false,
    twoFactorEnabled: false,
    lastLogin: '2024-12-19T15:45:00.000Z',
    createdAt: '2024-02-01T00:00:00.000Z',
    createdBy: '1'
  },
  {
    id: '3',
    clientId: 'client_1',
    name: 'Mike Wilson',
    email: 'mike@techcorp.com',
    role: 'user',
    permissions: ['tickets.create', 'tickets.view', 'features.view', 'features.vote'],
    isActive: true,
    isPrimary: false,
    twoFactorEnabled: true,
    lastLogin: '2024-12-18T09:20:00.000Z',
    createdAt: '2024-03-01T00:00:00.000Z',
    createdBy: '1'
  }
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole,
    permissions: [] as UserPermission[],
    twoFactorEnabled: false,
  });

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRolePermissions = (role: UserRole): UserPermission[] => {
    switch (role) {
      case 'primary':
        return [
          'tickets.create', 'tickets.view', 'tickets.manage',
          'users.create', 'users.view', 'users.manage',
          'billing.view', 'billing.manage',
          'features.create', 'features.view', 'features.vote'
        ];
      case 'admin':
        return [
          'tickets.create', 'tickets.view', 'tickets.manage',
          'users.view', 'features.create', 'features.view', 'features.vote'
        ];
      case 'user':
        return ['tickets.create', 'tickets.view', 'features.view', 'features.vote'];
      case 'viewer':
        return ['tickets.view', 'features.view'];
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Update existing user
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...formData, permissions: getRolePermissions(formData.role) }
            : user
        ));
      } else {
        // Create new user
        const newUser: User = {
          id: `user_${Date.now()}`,
          clientId: 'client_1',
          ...formData,
          permissions: getRolePermissions(formData.role),
          isActive: true,
          isPrimary: false,
          createdAt: new Date().toISOString(),
          createdBy: '1', // Current user ID
        };
        setUsers(prev => [...prev, newUser]);
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'user',
        permissions: [],
        twoFactorEnabled: false,
      });
      setShowAddForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      twoFactorEnabled: user.twoFactorEnabled,
    });
    setShowAddForm(true);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const handleDelete = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.isPrimary) {
      alert('Cannot delete the primary user.');
      return;
    }
    
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'primary': return 'success';
      case 'admin': return 'warning';
      case 'user': return 'info';
      case 'viewer': return 'default';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'primary': return Crown;
      case 'admin': return Shield;
      case 'user': return UserCheck;
      case 'viewer': return UserX;
      default: return Users;
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.isActive).length;
    const inactive = users.filter(u => !u.isActive).length;
    const with2FA = users.filter(u => u.twoFactorEnabled).length;

    return { total, active, inactive, with2FA };
  }, [users]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">
            Manage team members and their access permissions
          </p>
        </div>
        <Button 
          icon={Plus} 
          onClick={() => {
            setShowAddForm(true);
            setEditingUser(null);
            setFormData({
              name: '',
              email: '',
              role: 'user',
              permissions: [],
              twoFactorEnabled: false,
            });
          }}
        >
          Add New User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
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
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <UserX className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">With 2FA</p>
              <p className="text-3xl font-bold text-gray-900">{stats.with2FA}</p>
            </div>
            <div className="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-info-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowAddForm(false);
                setEditingUser(null);
              }}
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
              
              <Input
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Role"
                value={formData.role}
                onChange={(e) => {
                  const role = e.target.value as UserRole;
                  setFormData(prev => ({ 
                    ...prev, 
                    role,
                    permissions: getRolePermissions(role)
                  }));
                }}
                options={[
                  { value: 'admin', label: 'Admin (Manage Tickets & Users)' },
                  { value: 'user', label: 'User (Create & View Tickets)' },
                  { value: 'viewer', label: 'Viewer (Read Only)' },
                ]}
              />

              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="twoFactorEnabled"
                  checked={formData.twoFactorEnabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="twoFactorEnabled" className="text-sm font-medium text-gray-700">
                  Require Two-Factor Authentication
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions (Auto-assigned based on role)
              </label>
              <div className="flex flex-wrap gap-2">
                {getRolePermissions(formData.role).map((permission) => (
                  <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {permission.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
          
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'primary', label: 'Primary User' },
              { value: 'admin', label: 'Admin' },
              { value: 'user', label: 'User' },
              { value: 'viewer', label: 'Viewer' },
            ]}
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active Only' },
              { value: 'inactive', label: 'Inactive Only' },
            ]}
          />
        </div>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const RoleIcon = getRoleIcon(user.role);
            
            return (
              <Card key={user.id} hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <RoleIcon className="w-6 h-6 text-primary-600" />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <Badge variant={getRoleColor(user.role)} size="sm">
                          {user.role}
                        </Badge>
                        {user.isPrimary && (
                          <Badge variant="success" size="sm">
                            <Crown className="w-3 h-3 mr-1" />
                            Primary
                          </Badge>
                        )}
                        {user.twoFactorEnabled && (
                          <Badge variant="info" size="sm">
                            <Shield className="w-3 h-3 mr-1" />
                            2FA
                          </Badge>
                        )}
                        <Badge variant={user.isActive ? 'success' : 'default'} size="sm">
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {user.lastLogin 
                              ? `Last login: ${format(new Date(user.lastLogin), 'MMM dd, yyyy')}`
                              : 'Never logged in'
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Created: {format(new Date(user.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {user.permissions.slice(0, 3).map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {permission.split('.')[1]}
                          </span>
                        ))}
                        {user.permissions.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{user.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {!user.isPrimary && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={user.isActive ? UserX : UserCheck}
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Edit}
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Trash2}
                          onClick={() => handleDelete(user.id)}
                          className="text-error-600 hover:text-error-700"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    
                    {user.isPrimary && (
                      <span className="text-sm text-gray-500 italic">
                        Primary user cannot be modified
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or add a new user.
            </p>
            <Button onClick={() => setShowAddForm(true)}>Add New User</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserManagement;