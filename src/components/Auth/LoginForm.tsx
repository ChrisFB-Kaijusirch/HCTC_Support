import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, User } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { dynamoDBService } from '../../services/dynamodb';

interface LoginFormProps {
  userType: 'admin' | 'client';
  onLogin: (emailOrUsername: string, password: string, twoFactorCode?: string) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ userType, onLogin }) => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('=== LOGIN ATTEMPT STARTED ===');
    console.log('User Type:', userType);
    console.log('Email/Username:', emailOrUsername);
    console.log('Password length:', password.length);

    try {
      if (userType === 'admin') {
        // Admin login - check against database users
        try {
          const adminUsers = await dynamoDBService.scan('holdings-ctc-admin-users');
          console.log('Admin users found:', adminUsers.length);
          console.log('Admin users:', adminUsers);
          console.log('Login attempt:', { emailOrUsername, password: '***', userType });
          
          // Since admin users already exist in DynamoDB, no setup needed
          if (adminUsers.length === 0) {
            setError('No admin users found in database. Please contact administrator.');
            return;
          }
          
          const validAdmin = adminUsers.find((admin: any) => {
            const usernameMatch = admin.username === emailOrUsername;
            const emailMatch = admin.email === emailOrUsername;
            const passwordMatch = admin.password === password;
            const statusMatch = admin.status === 'active';
            
            console.log('Checking admin:', {
              username: admin.username,
              email: admin.email,
              usernameMatch,
              emailMatch,
              passwordMatch,
              statusMatch,
              inputEmail: emailOrUsername,
              inputPassword: '***'
            });
            
            return (usernameMatch || emailMatch) && passwordMatch && statusMatch;
          });

          console.log('Valid admin found:', !!validAdmin);

          if (validAdmin) {
            console.log('Login successful for:', validAdmin.username);
            // Call parent onLogin function
            await onLogin(emailOrUsername, password);
            // Navigate to dashboard
            navigate('/admin/dashboard');
          } else {
            setError('Invalid username or password');
          }
        } catch (error) {
          console.error('Admin login error:', error);
          setError(`Login failed: ${error.message}`);
        }
      } else {
        // Client login flow with 2FA
        if (!showTwoFactor) {
          // First step: email and password - check against database
          try {
            const clients = await dynamoDBService.scan('holdings-ctc-clients');
            console.log('Clients found:', clients.length);
            
            const validClient = clients.find((client: any) => {
              const emailMatch = client.email === emailOrUsername;
              const statusMatch = client.status === 'active';
              const hasTOTP = client.totpEnabled === true;
              
              console.log('Checking client:', {
                email: client.email,
                emailMatch,
                statusMatch,
                hasTOTP,
                inputEmail: emailOrUsername
              });
              
              return emailMatch && statusMatch && hasTOTP;
            });

            if (validClient) {
              console.log('Valid client found, requiring 2FA:', validClient.email);
              setShowTwoFactor(true);
            } else {
              setError('Account not found or 2FA not set up. Please set up your account first.');
            }
          } catch (error) {
            console.error('Client login error:', error);
            setError(`Login failed: ${error.message}`);
          }
        } else {
          // Second step: 2FA verification for clients
          try {
            const clients = await dynamoDBService.scan('holdings-ctc-clients');
            const client = clients.find((c: any) => c.email === emailOrUsername);
            
            if (client && client.totpSecret) {
              // Import TOTP here
              const { TOTP } = await import('otpauth');
              
              const totp = new TOTP({
                issuer: 'Holdings CTC',
                label: client.email,
                algorithm: 'SHA1',
                digits: 6,
                period: 30,
                secret: client.totpSecret
              });

              const isValid = totp.validate({
                token: twoFactorCode,
                window: 1
              });

              if (isValid !== null) {
                // Update last login
                await dynamoDBService.put('holdings-ctc-clients', {
                  ...client,
                  lastLogin: new Date().toISOString()
                });
                
                await onLogin(emailOrUsername, password, twoFactorCode);
                navigate('/client/dashboard');
              } else {
                setError('Invalid authentication code. Please try again.');
              }
            } else {
              setError('2FA not configured. Please set up your account.');
            }
          } catch (error) {
            console.error('2FA verification error:', error);
            setError('Failed to verify authentication code.');
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    setIsLoading(true);
    // Simulate sending verification email
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Verification email sent! Please check your inbox.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {userType === 'admin' ? 'Admin Login' : 'Client Portal'}
          </h2>
          <p className="mt-2 text-gray-600">
            {userType === 'admin' 
              ? 'Access your admin dashboard' 
              : 'Sign in to your account or access via email verification'
            }
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!showTwoFactor ? (
              <>
                <Input
                  label={userType === 'admin' ? 'Username' : 'Email Address'}
                  type={userType === 'admin' ? 'text' : 'email'}
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder={userType === 'admin' ? 'Enter your username' : 'Enter your email'}
                  icon={userType === 'admin' ? User : Mail}
                  required
                />
                
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  icon={Lock}
                  required
                />
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>
                
                <Input
                  label="Authentication Code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTwoFactor(false)}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            )}

            {error && (
              <div className="text-error-600 text-sm text-center bg-error-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
            >
              {showTwoFactor ? 'Verify & Sign In' : 'Sign In'}
            </Button>
          </form>

          {userType === 'client' && !showTwoFactor && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Don't have a password? Access via email verification
                </p>
                <Button
                  variant="outline"
                  onClick={handleSendVerificationEmail}
                  loading={isLoading}
                  className="w-full"
                >
                  Send Verification Email
                </Button>
              </div>
            </div>
          )}

          {userType === 'admin' ? (
            <div className="mt-6 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </Card>

        {userType === 'client' && (
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                New Client?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                If you've received a QR code from Holdings CTC, scan it to set up your account with 2FA.
              </p>
              <Link to="/qr-setup">
                <Button variant="outline" className="w-full">
                  Set Up Account with QR Code
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Admin Login Info */}
        {userType === 'admin' && (
          <Card className="bg-blue-50 border-blue-200">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Admin Access
              </h3>
              <div className="text-xs text-blue-800 space-y-1">
                <p>Use your admin username/email and password</p>
                <p>Contact system administrator if you need access</p>
              </div>
              

            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoginForm;