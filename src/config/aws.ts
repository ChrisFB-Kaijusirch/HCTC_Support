import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// AWS Configuration
const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
};

// Create DynamoDB client
const dynamoDBClient = new DynamoDBClient(awsConfig);

// Create DynamoDB Document client for easier operations
export const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

// Table names from environment variables
export const TABLE_NAMES = {
  CLIENTS: import.meta.env.VITE_DYNAMODB_CLIENTS_TABLE || 'holdings-ctc-clients',
  TICKETS: import.meta.env.VITE_DYNAMODB_TICKETS_TABLE || 'holdings-ctc-tickets',
  APPS: import.meta.env.VITE_DYNAMODB_APPS_TABLE || 'holdings-ctc-apps',
  FEATURE_REQUESTS: import.meta.env.VITE_DYNAMODB_FEATURE_REQUESTS_TABLE || 'holdings-ctc-feature-requests',
  KNOWLEDGE_BASE: import.meta.env.VITE_DYNAMODB_KNOWLEDGE_BASE_TABLE || 'holdings-ctc-knowledge-base',
  USERS: import.meta.env.VITE_DYNAMODB_USERS_TABLE || 'holdings-ctc-users',
};

// Utility function to check if AWS is configured
export const isAWSConfigured = (): boolean => {
  return !!(
    import.meta.env.VITE_AWS_ACCESS_KEY_ID &&
    import.meta.env.VITE_AWS_SECRET_ACCESS_KEY &&
    import.meta.env.VITE_AWS_REGION
  );
};