import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Shield, Smartphone } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface LoginFormProps {
  userType: 'admin' | 'client';
  onLogin: (email: string, password: string, twoFactorCode?: string) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ userType, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!showTwoFactor) {
        // First step: email and password
        // Simulate checking if 2FA is required
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, assume 2FA is required for admin and some clients
        if (userType === 'admin' || email === 'john@techcorp.com') {
          setShowTwoFactor(true);
        } else {
          await onLogin(email, password);
        }
      } else {
        // Second step: 2FA verification
        await onLogin(email, password, twoFactorCode);
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
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  icon={Mail}
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
                  <Smartphone className="w-12 h-12 text-primary-600 mx-auto mb-2" />
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

          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
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
      </div>
    </div>
  );
};

export default LoginForm;