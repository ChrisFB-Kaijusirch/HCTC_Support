import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

// AWS Configuration
const awsConfig = {
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

// Validate AWS configuration
if (!awsConfig.credentials.accessKeyId || !awsConfig.credentials.secretAccessKey) {
  console.error('❌ AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
  process.exit(1);
}

// Create DynamoDB clients
const dynamoDBClient = new DynamoDBClient(awsConfig);
export const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

// Table names configuration
export const TABLE_NAMES = {
  CLIENTS: process.env.DYNAMODB_CLIENTS_TABLE || 'holdings-ctc-clients',
  TICKETS: process.env.DYNAMODB_TICKETS_TABLE || 'holdings-ctc-tickets',
  APPS: process.env.DYNAMODB_APPS_TABLE || 'holdings-ctc-apps',
  FEATURE_REQUESTS: process.env.DYNAMODB_FEATURE_REQUESTS_TABLE || 'holdings-ctc-feature-requests',
  KNOWLEDGE_BASE: process.env.DYNAMODB_KNOWLEDGE_BASE_TABLE || 'holdings-ctc-knowledge-base',
  USERS: process.env.DYNAMODB_USERS_TABLE || 'holdings-ctc-users',
  ADMIN_USERS: process.env.DYNAMODB_ADMIN_USERS_TABLE || 'holdings-ctc-admin-users',
  RECENT_UPDATES: process.env.DYNAMODB_RECENT_UPDATES_TABLE || 'holdings-ctc-recent-updates',
  POPULAR_TOPICS: process.env.DYNAMODB_POPULAR_TOPICS_TABLE || 'holdings-ctc-popular-topics',
  INVOICES: process.env.DYNAMODB_INVOICES_TABLE || 'holdings-ctc-invoices',
  QR_CODES: process.env.DYNAMODB_QR_CODES_TABLE || 'holdings-ctc-qr-codes',
};

// Test AWS connection
export async function testAWSConnection() {
  try {
    // Simple test - this will throw if credentials are invalid
    await dynamoDBDocClient.send({ 
      name: 'ListTablesCommand',
      input: {}
    });
    console.log('✅ AWS DynamoDB connection successful');
    return true;
  } catch (error) {
    console.error('❌ AWS DynamoDB connection failed:', error.message);
    return false;
  }
}

console.log('🔧 AWS Configuration loaded:');
console.log(`   Region: ${awsConfig.region}`);
console.log(`   Access Key: ${awsConfig.credentials.accessKeyId?.substring(0, 8)}...`);
console.log(`   Tables configured: ${Object.keys(TABLE_NAMES).length}`);
