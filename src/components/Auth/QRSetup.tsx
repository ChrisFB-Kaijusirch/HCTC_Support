import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Smartphone, Shield, CheckCircle } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';

const QRSetup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'scan' | 'verify' | 'complete'>('scan');
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQRSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate QR code validation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock client info based on QR code
    const mockClientInfo = {
      companyName: 'TechCorp Solutions',
      contactName: 'John Doe',
      email: 'john@techcorp.com',
      subscribedApps: ['Portfolio Manager', 'Analytics Dashboard']
    };

    setClientInfo(mockClientInfo);
    setStep('verify');
    setIsLoading(false);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate 2FA setup verification
    await new Promise(resolve => setTimeout(resolve, 1000));

    setStep('complete');
    setIsLoading(false);
  };

  const handleComplete = () => {
    navigate('/client/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Account Setup</h2>
          <p className="mt-2 text-gray-600">
            Set up your Holdings CTC client account with secure 2FA
          </p>
        </div>

        {step === 'scan' && (
          <Card>
            <div className="text-center mb-6">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enter Your QR Code
              </h3>
              <p className="text-sm text-gray-600">
                Enter the QR code provided by Holdings CTC to access your client portal
              </p>
            </div>

            <form onSubmit={handleQRSubmit} className="space-y-6">
              <Input
                label="QR Code"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="QR_COMPANY_XXX"
                required
              />

              <Button
                type="submit"
                loading={isLoading}
                className="w-full"
              >
                Validate QR Code
              </Button>
            </form>
          </Card>
        )}

        {step === 'verify' && clientInfo && (
          <Card>
            <div className="text-center mb-6">
              <Smartphone className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Set Up Two-Factor Authentication
              </h3>
              <p className="text-sm text-gray-600">
                Secure your account with 2FA using Google Authenticator or SMS
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Account Details:</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Company:</span> {clientInfo.companyName}</p>
                <p><span className="font-medium">Contact:</span> {clientInfo.contactName}</p>
                <p><span className="font-medium">Email:</span> {clientInfo.email}</p>
                <p><span className="font-medium">Apps:</span> {clientInfo.subscribedApps.join(', ')}</p>
              </div>
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

                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    id="sms-auth"
                    name="2fa-method"
                    className="text-primary-600"
                  />
                  <label htmlFor="sms-auth" className="flex-1">
                    <div className="font-medium text-gray-900">SMS Verification</div>
                    <div className="text-sm text-gray-600">Receive codes via text message</div>
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

              <Button
                type="submit"
                loading={isLoading}
                className="w-full"
              >
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
                Your account has been successfully set up with two-factor authentication. 
                You can now access your client portal.
              </p>

              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-primary-900">Security Features Enabled:</span>
                </div>
                <ul className="text-sm text-primary-800 space-y-1">
                  <li>• Two-factor authentication</li>
                  <li>• Secure ticket access</li>
                  <li>• Encrypted communications</li>
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