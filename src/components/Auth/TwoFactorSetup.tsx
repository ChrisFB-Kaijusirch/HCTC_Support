import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TOTP } from 'otpauth';
import { Shield, Copy, CheckCircle, ArrowLeft } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { dynamoDBService } from '../../services/dynamodb';

interface TwoFactorSetupProps {
  email: string;
  onComplete: (secret: string) => void;
  onBack: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ email, onComplete, onBack }) => {
  const [secret, setSecret] = useState('');
  const [qrCodeUri, setQrCodeUri] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate a new TOTP secret
    const totp = new TOTP({
      issuer: 'Holdings CTC',
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: TOTP.Secret.fromRandom()
    });

    const secretKey = totp.secret.base32;
    const uri = totp.toString();

    setSecret(secretKey);
    setQrCodeUri(uri);
  }, [email]);

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy secret:', err);
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    setError('');

    try {
      // Create TOTP instance to verify the code
      const totp = new TOTP({
        issuer: 'Holdings CTC',
        label: email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret
      });

      // Verify the code (allow 1 time step tolerance)
      const isValid = totp.validate({
        token: verificationCode,
        window: 1
      });

      if (isValid !== null) {
        // Store the secret in DynamoDB for this user
        const clientData = {
          email,
          totpSecret: secret,
          totpEnabled: true,
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: null
        };

        await dynamoDBService.put('holdings-ctc-clients', clientData);
        onComplete(secret);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatSecret = (secret: string) => {
    // Format secret in groups of 4 for easier reading
    return secret.match(/.{1,4}/g)?.join(' ') || secret;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Setup Two-Factor Authentication
          </h2>
          <p className="mt-2 text-gray-600">
            Secure your account by setting up 2FA with Google Authenticator or compatible apps
          </p>
        </div>

        <Card>
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                1. Scan this QR code with your authenticator app:
              </h3>
              
              {qrCodeUri && (
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white border rounded-lg">
                    <QRCodeSVG 
                      value={qrCodeUri} 
                      size={200}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Or manually enter this secret:
                </h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-3 bg-gray-50 border rounded-lg font-mono text-sm text-center">
                    {formatSecret(secret)}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopySecret}
                    className="flex items-center space-x-1"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  2. Enter the 6-digit code from your app to verify:
                </h4>
                <Input
                  label="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                />
              </div>

              {error && (
                <div className="text-error-600 text-sm text-center bg-error-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                
                <Button
                  onClick={handleVerifyCode}
                  loading={isVerifying}
                  disabled={verificationCode.length !== 6}
                  className="flex-1"
                >
                  Complete Setup
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Recommended Authenticator Apps
            </h3>
            <div className="text-xs text-blue-800 space-y-1">
              <p>• Google Authenticator</p>
              <p>• Microsoft Authenticator</p>
              <p>• Authy</p>
              <p>• 1Password</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TwoFactorSetup;
