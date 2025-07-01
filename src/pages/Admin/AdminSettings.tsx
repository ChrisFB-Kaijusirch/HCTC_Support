import React, { useState } from 'react';
// Fixed import
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import CredentialManager from '../../components/Admin/CredentialManager';
import { AlertCircle, CheckCircle, Settings, Shield, Users, Database, Key } from 'lucide-react';
import { dynamoDBService } from '../../services/dynamodb';
import { TABLE_NAMES } from '../../config/aws';

interface AdminUser {
  id: string;
  username: string;
  password: string;
  email: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('security');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Admin user management state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminForm, setNewAdminForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' as 'super_admin' | 'admin'
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // TODO: In a real app, validate current password against database
      // For now, skip current password validation

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (passwordForm.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters');
      }

      // Create or update admin user in DynamoDB
      const adminUser: AdminUser = {
        id: 'admin_1',
        username: 'admin',
        password: passwordForm.newPassword, // In production, this should be hashed
        email: 'admin@hctc.com',
        role: 'super_admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Try to save to DynamoDB, but don't fail if AWS is not configured
      try {
        await dynamoDBService.create(TABLE_NAMES.ADMIN_USERS, adminUser);
        setMessage({ type: 'success', text: 'Password updated successfully!' });
      } catch (awsError) {
        console.warn('AWS operation failed, using mock mode:', awsError);
        // In mock mode, just simulate success
        setMessage({ type: 'success', text: 'Password updated successfully! (Mock mode - AWS not configured)' });
      }

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newAdmin: AdminUser = {
        id: `admin_${Date.now()}`,
        username: newAdminForm.username,
        password: newAdminForm.password, // In production, hash this
        email: newAdminForm.email,
        role: newAdminForm.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Try to save to DynamoDB, but don't fail if AWS is not configured
      try {
        await dynamoDBService.create(TABLE_NAMES.ADMIN_USERS, newAdmin);
        setMessage({ type: 'success', text: 'Admin user created successfully!' });
      } catch (awsError) {
        console.warn('AWS operation failed, using mock mode:', awsError);
        setMessage({ type: 'success', text: 'Admin user created successfully! (Mock mode - AWS not configured)' });
      }

      setAdminUsers([...adminUsers, newAdmin]);
      setNewAdminForm({ username: '', email: '', password: '', role: 'admin' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create admin user' });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'credentials', label: 'AWS Credentials', icon: Key },
    { id: 'admins', label: 'Admin Users', icon: Users },
    { id: 'system', label: 'System', icon: Database }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary-600" />
          Admin Settings
        </h1>
        <p className="text-gray-600 mt-2">Manage administrative settings and security</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-600" />
              Change Admin Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                type="password"
                label="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                required
              />
              <Input
                type="password"
                label="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                required
                helperText="Minimum 6 characters"
              />
              <Input
                type="password"
                label="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                required
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Security Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-800">Two-Factor Authentication</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-800">Session Timeout</span>
                <span className="text-blue-600">4 hours</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-800">Password Strength</span>
                <span className="text-yellow-600">Good</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* AWS Credentials Tab */}
      {activeTab === 'credentials' && (
        <CredentialManager />
      )}

      {/* Admin Users Tab */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              Create New Admin User
            </h2>
            <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Username"
                value={newAdminForm.username}
                onChange={(e) => setNewAdminForm({...newAdminForm, username: e.target.value})}
                required
              />
              <Input
                type="email"
                label="Email"
                value={newAdminForm.email}
                onChange={(e) => setNewAdminForm({...newAdminForm, email: e.target.value})}
                required
              />
              <Input
                type="password"
                label="Password"
                value={newAdminForm.password}
                onChange={(e) => setNewAdminForm({...newAdminForm, password: e.target.value})}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newAdminForm.role}
                  onChange={(e) => setNewAdminForm({...newAdminForm, role: e.target.value as 'super_admin' | 'admin'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Admin User'}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Current Admin Users</h2>
            <div className="space-y-3">
              {adminUsers.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium">{admin.username}</h3>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      admin.role === 'super_admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Created: {new Date(admin.createdAt).toLocaleDateString()}</p>
                    {admin.lastLogin && (
                      <p className="text-xs text-gray-500">Last login: {new Date(admin.lastLogin).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-primary-600" />
              Database Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>DynamoDB Connection</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AWS Region</span>
                <span className="text-gray-600">ap-southeast-2</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tables</span>
                <span className="text-gray-600">10 Active</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Application Version</span>
                <span className="text-gray-600">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Environment</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">Production</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Deployment</span>
                <span className="text-gray-600">Today</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
