import React, { useState, useEffect } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { Shield, Key, Eye, EyeOff, Download, Upload, Trash2 } from 'lucide-react';
import {
  encryptCredentials,
  decryptCredentials,
  getStoredEncryptedCredentials,
  storeEncryptedCredentials,
  clearStoredCredentials,
  generateEncryptionKey,
  validateCredentials,
  type DecryptedCredentials,
  type EncryptedCredentials
} from '../../utils/encryption';
import { getAWSCredentials, clearAWSCache, testAWSConnection } from '../../config/secureAws';

const CredentialManager: React.FC = () => {
  const [showCredentials, setShowCredentials] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [credentials, setCredentials] = useState<DecryptedCredentials>({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'ap-southeast-2'
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');

  useEffect(() => {
    // Check if there are stored encrypted credentials
    const stored = getStoredEncryptedCredentials();
    setHasStoredCredentials(!!stored);
    
    // Try to load current credentials
    const current = getAWSCredentials();
    if (current) {
      setCredentials(current);
    }
  }, []);

  const handleEncrypt = () => {
    if (!validateCredentials(credentials)) {
      setMessage({ type: 'error', text: 'Please provide valid AWS credentials' });
      return;
    }

    if (!encryptionKey.trim()) {
      setMessage({ type: 'error', text: 'Please provide an encryption key' });
      return;
    }

    try {
      const encrypted = encryptCredentials(credentials, encryptionKey);
      storeEncryptedCredentials(encrypted);
      setHasStoredCredentials(true);
      clearAWSCache();
      setMessage({ type: 'success', text: 'Credentials encrypted and stored successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to encrypt credentials' });
    }
  };

  const handleDecrypt = () => {
    const stored = getStoredEncryptedCredentials();
    if (!stored) {
      setMessage({ type: 'error', text: 'No encrypted credentials found' });
      return;
    }

    if (!encryptionKey.trim()) {
      setMessage({ type: 'error', text: 'Please provide the encryption key' });
      return;
    }

    try {
      const decrypted = decryptCredentials(stored, encryptionKey);
      setCredentials(decrypted);
      clearAWSCache();
      setMessage({ type: 'success', text: 'Credentials decrypted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to decrypt credentials - check encryption key' });
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const isConnected = await testAWSConnection(encryptionKey);
      setConnectionStatus(isConnected ? 'connected' : 'failed');
      setMessage({ 
        type: isConnected ? 'success' : 'error', 
        text: isConnected ? 'AWS connection successful' : 'AWS connection failed' 
      });
    } catch (error) {
      setConnectionStatus('failed');
      setMessage({ type: 'error', text: 'Connection test failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKey = () => {
    const newKey = generateEncryptionKey();
    setEncryptionKey(newKey);
    setMessage({ type: 'info', text: 'New encryption key generated. Save this key securely!' });
  };

  const handleClearStored = () => {
    clearStoredCredentials();
    clearAWSCache();
    setHasStoredCredentials(false);
    setMessage({ type: 'info', text: 'Stored credentials cleared' });
  };

  const downloadEncryptedCredentials = () => {
    const stored = getStoredEncryptedCredentials();
    if (!stored) {
      setMessage({ type: 'error', text: 'No encrypted credentials to download' });
      return;
    }

    const blob = new Blob([JSON.stringify(stored, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encrypted-aws-credentials.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMessage({ type: 'success', text: 'Encrypted credentials downloaded' });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-600" />
          AWS Credential Manager
        </h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
            message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Credentials Input */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">AWS Credentials</h3>
            
            <Input
              label="AWS Access Key ID"
              type={showCredentials ? 'text' : 'password'}
              value={credentials.accessKeyId}
              onChange={(e) => setCredentials({...credentials, accessKeyId: e.target.value})}
              placeholder="AKIA..."
            />
            
            <Input
              label="AWS Secret Access Key"
              type={showCredentials ? 'text' : 'password'}
              value={credentials.secretAccessKey}
              onChange={(e) => setCredentials({...credentials, secretAccessKey: e.target.value})}
              placeholder="Secret key..."
            />
            
            <Input
              label="AWS Region"
              value={credentials.region}
              onChange={(e) => setCredentials({...credentials, region: e.target.value})}
              placeholder="ap-southeast-2"
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCredentials(!showCredentials)}
              icon={showCredentials ? EyeOff : Eye}
            >
              {showCredentials ? 'Hide' : 'Show'} Credentials
            </Button>
          </div>

          {/* Encryption Controls */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Encryption</h3>
            
            <Input
              label="Encryption Key"
              type="password"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
              placeholder="Enter encryption key..."
              helperText="Keep this key safe - you'll need it to decrypt"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateKey}
                icon={Key}
              >
                Generate Key
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleEncrypt}
                disabled={!validateCredentials(credentials) || !encryptionKey}
                size="sm"
              >
                Encrypt & Store
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDecrypt}
                disabled={!hasStoredCredentials || !encryptionKey}
                size="sm"
              >
                Decrypt & Load
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleTestConnection}
              disabled={isLoading}
              variant="outline"
              size="sm"
              icon={Shield}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </Button>

            {hasStoredCredentials && (
              <>
                <Button
                  onClick={downloadEncryptedCredentials}
                  variant="outline"
                  size="sm"
                  icon={Download}
                >
                  Download Encrypted
                </Button>
                
                <Button
                  onClick={handleClearStored}
                  variant="outline"
                  size="sm"
                  icon={Trash2}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear Stored
                </Button>
              </>
            )}
          </div>

          {/* Status Indicators */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${hasStoredCredentials ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm text-gray-600">
                {hasStoredCredentials ? 'Encrypted credentials stored' : 'No stored credentials'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'failed' ? 'bg-red-500' : 'bg-gray-300'
              }`} />
              <span className="text-sm text-gray-600">
                Connection: {connectionStatus}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${validateCredentials(credentials) ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm text-gray-600">
                {validateCredentials(credentials) ? 'Valid format' : 'Invalid format'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CredentialManager;
