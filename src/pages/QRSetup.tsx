import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import TwoFactorSetup from '../components/Auth/TwoFactorSetup';

const QRSetup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Here you could add additional validation, like checking if email is in a whitelist
      // For now, we'll proceed directly to 2FA setup
      setShowTwoFactorSetup(true);
    } catch (err) {
      setError('Failed to validate email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorComplete = (secret: string) => {
    // Successfully completed 2FA setup
    console.log('2FA setup completed for:', email);
    navigate('/client/login', { 
      state: { 
        message: '2FA setup completed successfully! You can now log in.',
        email 
      }
    });
  };

  const handleBack = () => {
    if (showTwoFactorSetup) {
      setShowTwoFactorSetup(false);
    } else {
      navigate('/client/login');
    }
  };

  if (showTwoFactorSetup) {
    return (
      <TwoFactorSetup
        email={email}
        onComplete={handleTwoFactorComplete}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Set Up Your Account
          </h2>
          <p className="mt-2 text-gray-600">
            Enter your email to begin setting up two-factor authentication
          </p>
        </div>

        <Card>
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              icon={Mail}
              required
            />

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
              Continue to 2FA Setup
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/client/login')}
              className="text-sm"
            >
              Already have an account? Sign in
            </Button>
          </div>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              New Client Setup
            </h3>
            <div className="text-xs text-blue-800 space-y-1">
              <p>This will set up two-factor authentication for your account</p>
              <p>You'll need an authenticator app like Google Authenticator</p>
              <p>Contact Holdings CTC if you need assistance</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QRSetup;
