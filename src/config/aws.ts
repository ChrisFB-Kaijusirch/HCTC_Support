import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// AWS Configuration
const createAWSConfig = () => {
  const region = import.meta.env.VITE_AWS_REGION || 'ap-southeast-2';
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID || '';
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '';

  if (!accessKeyId || !secretAccessKey) {
    console.warn('AWS credentials not found in environment variables');
    return null;
  }

  return {
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  };
};

// Create DynamoDB client with error handling
let dynamoDBClient: DynamoDBClient | null = null;
try {
  const config = createAWSConfig();
  if (config) {
    dynamoDBClient = new DynamoDBClient(config);
  }
} catch (error) {
  console.error('Failed to create DynamoDB client:', error);
}

// Create DynamoDB Document client for easier operations
export const dynamoDBDocClient = dynamoDBClient ? DynamoDBDocumentClient.from(dynamoDBClient) : null;

// Table names from environment variables
export const TABLE_NAMES = {
  CLIENTS: import.meta.env.VITE_DYNAMODB_CLIENTS_TABLE || 'holdings-ctc-clients',
  TICKETS: import.meta.env.VITE_DYNAMODB_TICKETS_TABLE || 'holdings-ctc-tickets',
  APPS: import.meta.env.VITE_DYNAMODB_APPS_TABLE || 'holdings-ctc-apps',
  FEATURE_REQUESTS: import.meta.env.VITE_DYNAMODB_FEATURE_REQUESTS_TABLE || 'holdings-ctc-feature-requests',
  KNOWLEDGE_BASE: import.meta.env.VITE_DYNAMODB_KNOWLEDGE_BASE_TABLE || 'holdings-ctc-knowledge-base',
  USERS: import.meta.env.VITE_DYNAMODB_USERS_TABLE || 'holdings-ctc-users',
  ADMIN_USERS: import.meta.env.VITE_DYNAMODB_ADMIN_USERS_TABLE || 'holdings-ctc-admin-users',
  RECENT_UPDATES: import.meta.env.VITE_DYNAMODB_RECENT_UPDATES_TABLE || 'holdings-ctc-recent-updates',
  POPULAR_TOPICS: import.meta.env.VITE_DYNAMODB_POPULAR_TOPICS_TABLE || 'holdings-ctc-popular-topics',
  INVOICES: import.meta.env.VITE_DYNAMODB_INVOICES_TABLE || 'holdings-ctc-invoices',
  QR_CODES: import.meta.env.VITE_DYNAMODB_QR_CODES_TABLE || 'holdings-ctc-qr-codes',
};

// Utility function to check if AWS is configured
export const isAWSConfigured = (): boolean => {
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
  const region = import.meta.env.VITE_AWS_REGION;
  
  console.log('AWS Configuration Debug:', {
    accessKeyId: accessKeyId ? `SET (${accessKeyId.substring(0, 4)}...)` : 'NOT SET',
    secretAccessKey: secretAccessKey ? `SET (${secretAccessKey.length} chars)` : 'NOT SET',
    region: region || 'NOT SET',
    allEnvVars: import.meta.env
  });
  
  const isConfigured = !!(accessKeyId && secretAccessKey && region);
  console.log('isAWSConfigured result:', isConfigured);
  
  return isConfigured;
};