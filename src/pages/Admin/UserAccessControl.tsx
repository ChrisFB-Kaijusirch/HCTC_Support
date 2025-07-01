import React, { useState, useEffect } from 'react';
import Card from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Badge from '../../components/UI/Badge';
import { 
  Users, 
  Shield, 
  Settings, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { dynamoDBService } from '../../services/dynamodb';

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
  color: string;
}

interface UserPermission {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  clientId?: string;
}

const defaultRoles: UserRole[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    permissions: ['*'],
    description: 'Full system access',
    color: 'red'
  },
  {
    id: 'admin',
    name: 'Admin',
    permissions: ['users.manage', 'clients.manage', 'apps.manage', 'content.manage'],
    description: 'Administrative access',
    color: 'purple'
  },
  {
    id: 'client_admin',
    name: 'Client Admin',
    permissions: ['client.users.manage', 'client.tickets.manage', 'client.billing.view'],
    description: 'Client-level admin',
    color: 'blue'
  },
  {
    id: 'user',
    name: 'User',
    permissions: ['tickets.create', 'tickets.view', 'profile.edit'],
    description: 'Standard user',
    color: 'green'
  },
  {
    id: 'viewer',
    name: 'Viewer',
    permissions: ['tickets.view', 'knowledge_base.view'],
    description: 'Read-only access',
    color: 'gray'
  }
];

const defaultPermissions: UserPermission[] = [
  // Admin Permissions
  { id: 'users.manage', name: 'Manage Users', category: 'Admin', description: 'Create, edit, and delete users' },
  { id: 'clients.manage', name: 'Manage Clients', category: 'Admin', description: 'Manage client accounts' },
  { id: 'apps.manage', name: 'Manage Applications', category: 'Admin', description: 'Manage applications' },
  { id: 'content.manage', name: 'Manage Content', category: 'Admin', description: 'Manage knowledge base and content' },
  { id: 'system.settings', name: 'System Settings', category: 'Admin', description: 'Access system settings' },
  
  // Client Permissions
  { id: 'client.users.manage', name: 'Manage Client Users', category: 'Client', description: 'Manage users within client' },
  { id: 'client.tickets.manage', name: 'Manage Client Tickets', category: 'Client', description: 'Manage all client tickets' },
  { id: 'client.billing.view', name: 'View Billing', category: 'Client', description: 'View billing information' },
  { id: 'client.billing.manage', name: 'Manage Billing', category: 'Client', description: 'Manage billing and payments' },
  
  // User Permissions
  { id: 'tickets.create', name: 'Create Tickets', category: 'Tickets', description: 'Create new support tickets' },
  { id: 'tickets.view', name: 'View Tickets', category: 'Tickets', description: 'View tickets' },
  { id: 'tickets.edit', name: 'Edit Tickets', category: 'Tickets', description: 'Edit ticket details' },
  { id: 'profile.edit', name: 'Edit Profile', category: 'Profile', description: 'Edit own profile' },
  { id: 'knowledge_base.view', name: 'View Knowledge Base', category: 'Knowledge', description: 'Access knowledge base' },
  { id: 'knowledge_base.edit', name: 'Edit Knowledge Base', category: 'Knowledge', description: 'Edit knowledge base articles' }
];

export default function UserAccessControl() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [roles, setRoles] = useState<UserRole[]>(defaultRoles);
  const [permissions] = useState<UserPermission[]>(defaultPermissions);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await dynamoDBService.getAllUsers();
      const adminUsers = await dynamoDBService.scan('holdings-ctc-admin-users');
      
      const combinedUsers: ExtendedUser[] = [
        // Convert regular users
        ...allUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          permissions: getUserPermissions(user.role || 'user'),
          status: 'active' as const,
          lastLogin: user.updatedAt,
          createdAt: user.createdAt,
          clientId: user.clientId
        })),
        // Convert admin users
        ...adminUsers.map((admin: any) => ({
          id: admin.id,
          name: admin.username,
          email: admin.email,
          role: admin.role,
          permissions: getUserPermissions(admin.role),
          status: 'active' as const,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt
        }))
      ];
      
      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const getUserPermissions = (roleName: string): string[] => {
    const role = roles.find(r => r.id === roleName);
    return role ? role.permissions : [];
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: UserPermission[] } = {};
    permissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const permissionCategories = getPermissionsByCategory();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary-600" />
          User Access Control
        </h1>
        <p className="text-gray-600 mt-2">Manage user roles, permissions, and access levels</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Button onClick={() => setShowCreateUser(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create User
        </Button>
        <Button variant="outline" onClick={() => setShowEditRole(true)} className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Manage Roles
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {filteredUsers.length} users
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const role = roles.find(r => r.id === user.role);
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.clientId && (
                          <div className="text-xs text-gray-400">Client: {user.clientId}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={role?.color as any || 'default'}>
                        {role?.name || user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={user.status === 'active' ? 'success' : 
                                user.status === 'suspended' ? 'destructive' : 'secondary'}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {user.permissions.includes('*') ? 'All Permissions' : 
                         `${user.permissions.length} permissions`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Overview */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Role Permissions Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <Card key={role.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant={role.color as any}>{role.name}</Badge>
                <span className="text-sm text-gray-500">
                  {users.filter(u => u.role === role.id).length} users
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{role.description}</p>
              <div className="space-y-1">
                {role.permissions.includes('*') ? (
                  <div className="text-sm text-red-600 font-medium">All Permissions</div>
                ) : (
                  role.permissions.slice(0, 3).map(permId => {
                    const perm = permissions.find(p => p.id === permId);
                    return (
                      <div key={permId} className="text-xs text-gray-500">
                        • {perm?.name || permId}
                      </div>
                    );
                  })
                )}
                {role.permissions.length > 3 && !role.permissions.includes('*') && (
                  <div className="text-xs text-gray-400">
                    +{role.permissions.length - 3} more...
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">User Details</h3>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={roles.find(r => r.id === selectedUser.role)?.color as any || 'default'}>
                      {roles.find(r => r.id === selectedUser.role)?.name || selectedUser.role}
                    </Badge>
                    <Badge variant={selectedUser.status === 'active' ? 'success' : 'secondary'}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                  {selectedUser.permissions.includes('*') ? (
                    <div className="text-red-600 font-medium">All System Permissions</div>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(permissionCategories).map(([category, perms]) => {
                        const userCategoryPerms = perms.filter(p => selectedUser.permissions.includes(p.id));
                        if (userCategoryPerms.length === 0) return null;
                        
                        return (
                          <div key={category}>
                            <h5 className="text-sm font-medium text-gray-700">{category}</h5>
                            <div className="ml-4 space-y-1">
                              {userCategoryPerms.map(perm => (
                                <div key={perm.id} className="text-sm text-gray-600">
                                  • {perm.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
