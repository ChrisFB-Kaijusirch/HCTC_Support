import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Smartphone, Shield, CheckCircle, AlertCircle, Users, Plus, Trash2 } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Select from '../UI/Select';
import { parseQRCode } from '../../utils/qrCodeGenerator';
import { UserRole, UserPermission } from '../../types';

interface ClientUser {
  name: string;
  email: string;
  role: UserRole;
  permissions: UserPermission[];
}

const QRSetup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'scan' | 'validate' | 'users' | 'verify' | 'complete'>('scan');
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data for client validation
  const [validationData, setValidationData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
  });

  const handleQRSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const qrValidation = parseQRCode(qrCode);
      
      if (!qrValidation.isValid) {
        setError('Invalid QR code format. Please check the code and try again.');
        setIsLoading(false);
        return;
      }

      // Simulate API call to get client info from QR code
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock client info - in real app, this would come from database
      const mockClientInfo = {
        companyName: 'TechCorp Solutions',
        contactName: 'John Doe',
        email: 'john@techcorp.com',
        phone: '+1 (555) 123-4567',
        subscribedApps: ['Portfolio Manager', 'Analytics Dashboard'],
        qrCode: qrCode,
        isValid: true
      };

      setClientInfo(mockClientInfo);
      setValidationData({
        companyName: mockClientInfo.companyName,
        contactName: mockClientInfo.contactName,
        email: mockClientInfo.email,
        phone: mockClientInfo.phone,
      });
      setStep('validate');
    } catch (err) {
      setError('Failed to validate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate the client information
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Initialize with primary user
      setUsers([{
        name: validationData.contactName,
        email: validationData.email,
        role: 'primary',
        permissions: [
          'tickets.create', 'tickets.view', 'tickets.manage',
          'users.create', 'users.view', 'users.manage',
          'billing.view', 'billing.manage',
          'features.create', 'features.view', 'features.vote'
        ]
      }]);

      setStep('users');
    } catch (err) {
      setError('Failed to validate client information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setUsers(prev => [...prev, {
      name: '',
      email: '',
      role: 'user',
      permissions: ['tickets.create', 'tickets.view', 'features.view', 'features.vote']
    }]);
  };

  const handleRemoveUser = (index: number) => {
    if (index === 0) return; // Can't remove primary user
    setUsers(prev => prev.filter((_, i) => i !== index));
  };

  const handleUserChange = (index: number, field: keyof ClientUser, value: any) => {
    setUsers(prev => prev.map((user, i) => {
      if (i === index) {
        if (field === 'role') {
          // Update permissions based on role
          const rolePermissions = getRolePermissions(value as UserRole);
          return { ...user, [field]: value, permissions: rolePermissions };
        }
        return { ...user, [field]: value };
      }
      return user;
    }));
  };

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

  const handleUsersSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate all users have required fields
      const invalidUsers = users.filter(user => !user.name || !user.email);
      if (invalidUsers.length > 0) {
        setError('Please fill in all user details.');
        setIsLoading(false);
        return;
      }

      // Simulate API call to create users
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStep('verify');
    } catch (err) {
      setError('Failed to set up users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (verificationCode.length !== 6) {
        setError('Please enter a valid 6-digit verification code.');
        setIsLoading(false);
        return;
      }

      setStep('complete');
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    navigate('/client/dashboard');
  };

  const roleOptions = [
    { value: 'primary', label: 'Primary User (Full Access)' },
    { value: 'admin', label: 'Admin (Manage Tickets & Users)' },
    { value: 'user', label: 'User (Create & View Tickets)' },
    { value: 'viewer', label: 'Viewer (Read Only)' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Account Setup</h2>
          <p className="mt-2 text-gray-600">
            Set up your Holdings CTC client account with secure access
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            {['scan', 'validate', 'users', 'verify', 'complete'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName ? 'bg-primary-600 text-white' :
                  ['scan', 'validate', 'users', 'verify', 'complete'].indexOf(step) > index ? 'bg-success-600 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 4 && <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>

        {step === 'scan' && (
          <Card>
            <div className="text-center mb-6">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enter Your QR Code
              </h3>
              <p className="text-sm text-gray-600">
                Enter the QR code provided by Holdings CTC to begin account setup
              </p>
            </div>

            <form onSubmit={handleQRSubmit} className="space-y-6">
              <Input
                label="QR Code"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="QR_COMPANY_XXX_XXXXX_XXXXXXXXX"
                required
                helperText="Format: QR_COMPANY_XXX_XXXXX_XXXXXXXXX"
              />

              {error && (
                <div className="flex items-center space-x-2 text-error-600 bg-error-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button type="submit" loading={isLoading} className="w-full">
                Validate QR Code
              </Button>
            </form>
          </Card>
        )}

        {step === 'validate' && clientInfo && (
          <Card>
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-success-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Validate Company Information
              </h3>
              <p className="text-sm text-gray-600">
                Please verify and update your company information
              </p>
            </div>

            <form onSubmit={handleValidationSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Company Name *"
                  value={validationData.companyName}
                  onChange={(e) => setValidationData(prev => ({ ...prev, companyName: e.target.value }))}
                  required
                />
                
                <Input
                  label="Contact Name *"
                  value={validationData.contactName}
                  onChange={(e) => setValidationData(prev => ({ ...prev, contactName: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email Address *"
                  type="email"
                  value={validationData.email}
                  onChange={(e) => setValidationData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                
                <Input
                  label="Phone Number"
                  value={validationData.phone}
                  onChange={(e) => setValidationData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Subscribed Applications:</h4>
                <div className="flex flex-wrap gap-2">
                  {clientInfo.subscribedApps.map((app: string) => (
                    <span key={app} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-error-600 bg-error-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button type="submit" loading={isLoading} className="w-full">
                Confirm Information
              </Button>
            </form>
          </Card>
        )}

        {step === 'users' && (
          <Card>
            <div className="text-center mb-6">
              <Users className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Set Up User Access
              </h3>
              <p className="text-sm text-gray-600">
                Add team members who will have access to your account
              </p>
            </div>

            <form onSubmit={handleUsersSubmit} className="space-y-6">
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">
                        {index === 0 ? 'Primary User (You)' : `User ${index + 1}`}
                      </h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleRemoveUser(index)}
                          className="text-error-600 hover:text-error-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Full Name *"
                        value={user.name}
                        onChange={(e) => handleUserChange(index, 'name', e.target.value)}
                        placeholder="Enter full name"
                        required
                        disabled={index === 0} // Primary user info from validation
                      />
                      
                      <Input
                        label="Email Address *"
                        type="email"
                        value={user.email}
                        onChange={(e) => handleUserChange(index, 'email', e.target.value)}
                        placeholder="Enter email address"
                        required
                        disabled={index === 0} // Primary user info from validation
                      />
                      
                      <Select
                        label="Role"
                        value={user.role}
                        onChange={(e) => handleUserChange(index, 'role', e.target.value)}
                        options={index === 0 ? [roleOptions[0]] : roleOptions.slice(1)}
                        disabled={index === 0}
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Permissions
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {user.permissions.map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {permission.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  icon={Plus}
                  onClick={handleAddUser}
                >
                  Add Another User
                </Button>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-error-600 bg-error-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button type="submit" loading={isLoading} className="w-full">
                Continue to 2FA Setup
              </Button>
            </form>
          </Card>
        )}

        {step === 'verify' && (
          <Card>
            <div className="text-center mb-6">
              <Smartphone className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Set Up Two-Factor Authentication
              </h3>
              <p className="text-sm text-gray-600">
                Secure your account with 2FA using Google Authenticator
              </p>
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    id="google-auth"
                    name="2fa-method"
                    defaultChecked
                    className="text-primary-600"
                  />
                  <label htmlFor="google-auth" className="flex-1">
                    <div className="font-medium text-gray-900">Google Authenticator</div>
                    <div className="text-sm text-gray-600">Use your authenticator app</div>
                  </label>
                </div>
              </div>

              <Input
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                required
              />

              {error && (
                <div className="flex items-center space-x-2 text-error-600 bg-error-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button type="submit" loading={isLoading} className="w-full">
                Complete Setup
              </Button>
            </form>
          </Card>
        )}

        {step === 'complete' && (
          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Account Setup Complete!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Your account has been successfully set up with {users.length} user{users.length > 1 ? 's' : ''} and secure authentication.
              </p>

              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-primary-900">Setup Summary:</span>
                </div>
                <ul className="text-sm text-primary-800 space-y-1">
                  <li>• Company: {validationData.companyName}</li>
                  <li>• Users configured: {users.length}</li>
                  <li>• Two-factor authentication enabled</li>
                  <li>• Access to {clientInfo?.subscribedApps?.length || 0} applications</li>
                </ul>
              </div>

              <Button onClick={handleComplete} className="w-full">
                Access Client Portal
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QRSetup;