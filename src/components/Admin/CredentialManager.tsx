import React, { useState, useEffect } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { Shield, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';

interface Credentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

const CredentialManager: React.FC = () => {
  const [showCredentials, setShowCredentials] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');
  const [envCredentials, setEnvCredentials] = useState<Credentials>({
    accessKeyId: '',
    secretAccessKey: '',
    region: ''
  });

  useEffect(() => {
    // Load current environment variables
    setEnvCredentials({
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
      region: import.meta.env.VITE_AWS_REGION || 'ap-southeast-2'
    });
  }, []);

  const validateCredentials = (creds: Credentials): boolean => {
    return !!(creds.accessKeyId && creds.secretAccessKey && creds.region);
  };

  const testAWSConnection = async (): Promise<boolean> => {
    try {
      const config = {
        region: envCredentials.region || 'ap-southeast-2',
        credentials: {
          accessKeyId: envCredentials.accessKeyId,
          secretAccessKey: envCredentials.secretAccessKey,
        },
      };

      console.log('Testing AWS connection:', { 
        region: config.region, 
        hasAccessKey: !!config.credentials.accessKeyId,
        hasSecretKey: !!config.credentials.secretAccessKey 
      });

      if (!config.credentials.accessKeyId || !config.credentials.secretAccessKey) {
        throw new Error('Missing AWS credentials in environment variables');
      }

      const client = new DynamoDBClient(config);
      const command = new ListTablesCommand({});
      const response = await client.send(command);
      
      console.log('AWS test successful:', response.TableNames?.length || 0, 'tables found');
      setMessage({ type: 'success', text: `Connection successful! Found ${response.TableNames?.length || 0} DynamoDB tables.` });
      return true;
    } catch (error) {
      console.error('AWS connection test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setMessage({ type: 'error', text: `Connection failed: ${errorMessage}` });
      return false;
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const isConnected = await testAWSConnection();
      setConnectionStatus(isConnected ? 'connected' : 'failed');
    } catch (error) {
      setConnectionStatus('failed');
      setMessage({ type: 'error', text: 'Connection test failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-600" />
          AWS Configuration Status
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
          {/* Current Environment Variables */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Current Environment Variables</h3>
            
            <Input
              label="AWS Access Key ID"
              type={showCredentials ? 'text' : 'password'}
              value={envCredentials.accessKeyId}
              readOnly
              placeholder="Not configured"
              helperText="Set via VITE_AWS_ACCESS_KEY_ID"
            />
            
            <Input
              label="AWS Secret Access Key"
              type={showCredentials ? 'text' : 'password'}
              value={envCredentials.secretAccessKey}
              readOnly
              placeholder="Not configured"
              helperText="Set via VITE_AWS_SECRET_ACCESS_KEY"
            />
            
            <Input
              label="AWS Region"
              value={envCredentials.region}
              readOnly
              placeholder="ap-southeast-2"
              helperText="Set via VITE_AWS_REGION"
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

          {/* Connection Status */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Connection Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Environment Variables</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${validateCredentials(envCredentials) ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-600">
                    {validateCredentials(envCredentials) ? 'Configured' : 'Missing'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">DynamoDB Connection</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' :
                    connectionStatus === 'failed' ? 'bg-red-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-sm text-gray-600">
                    {connectionStatus === 'connected' ? 'Connected' : 
                     connectionStatus === 'failed' ? 'Failed' : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleTestConnection}
              disabled={isLoading || !validateCredentials(envCredentials)}
              className="w-full"
              icon={isLoading ? RefreshCw : Shield}
            >
              {isLoading ? 'Testing Connection...' : 'Test AWS Connection'}
            </Button>
          </div>
        </div>

        {/* Configuration Instructions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Configuration Instructions</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">To configure AWS credentials:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Go to GitHub → Repository → Settings → Secrets and variables → Actions</li>
              <li>Add these repository secrets:</li>
              <li className="ml-4">• <code>VITE_AWS_ACCESS_KEY_ID</code>: Your AWS Access Key ID</li>
              <li className="ml-4">• <code>VITE_AWS_SECRET_ACCESS_KEY</code>: Your AWS Secret Access Key</li>
              <li className="ml-4">• <code>VITE_AWS_REGION</code>: Your AWS region (e.g., us-east-1)</li>
              <li>Redeploy the application to apply changes</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CredentialManager;
