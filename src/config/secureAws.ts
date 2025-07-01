import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { 
  decryptCredentials, 
  getStoredEncryptedCredentials, 
  areCredentialsEncrypted,
  validateCredentials,
  type DecryptedCredentials,
  type EncryptedCredentials
} from '../utils/encryption';

// Encrypted credentials (can be stored in environment variables)
const ENCRYPTED_AWS_CREDENTIALS: EncryptedCredentials | null = (() => {
  try {
    // Try to get from environment first
    const envAccessKey = import.meta.env.VITE_AWS_ACCESS_KEY_ID_ENCRYPTED;
    const envSecretKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY_ENCRYPTED;
    const envRegion = import.meta.env.VITE_AWS_REGION_ENCRYPTED;
    
    if (envAccessKey && envSecretKey && envRegion) {
      return {
        accessKeyId: envAccessKey,
        secretAccessKey: envSecretKey,
        region: envRegion,
        encrypted: true
      };
    }
    
    // Fallback to localStorage
    return getStoredEncryptedCredentials();
  } catch (error) {
    console.warn('No encrypted credentials found:', error);
    return null;
  }
})();

// Fallback to plain credentials if encrypted ones aren't available
const PLAIN_AWS_CREDENTIALS = {
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
};

let cachedCredentials: DecryptedCredentials | null = null;
let cachedClient: DynamoDBDocumentClient | null = null;

/**
 * Get decrypted AWS credentials
 */
export function getAWSCredentials(encryptionKey?: string): DecryptedCredentials | null {
  // Return cached credentials if available
  if (cachedCredentials && validateCredentials(cachedCredentials)) {
    return cachedCredentials;
  }

  try {
    // Try encrypted credentials first
    if (ENCRYPTED_AWS_CREDENTIALS) {
      console.log('Using encrypted AWS credentials');
      const decrypted = decryptCredentials(ENCRYPTED_AWS_CREDENTIALS, encryptionKey);
      
      if (validateCredentials(decrypted)) {
        cachedCredentials = decrypted;
        return decrypted;
      }
    }
    
    // Fallback to plain credentials
    if (PLAIN_AWS_CREDENTIALS.accessKeyId && PLAIN_AWS_CREDENTIALS.secretAccessKey) {
      console.log('Using plain AWS credentials (fallback)');
      if (validateCredentials(PLAIN_AWS_CREDENTIALS)) {
        cachedCredentials = PLAIN_AWS_CREDENTIALS;
        return PLAIN_AWS_CREDENTIALS;
      }
    }
    
    console.warn('No valid AWS credentials available');
    return null;
  } catch (error) {
    console.error('Failed to get AWS credentials:', error);
    return null;
  }
}

/**
 * Get configured DynamoDB client
 */
export function getSecureDynamoDBClient(encryptionKey?: string): DynamoDBDocumentClient | null {
  // Return cached client if available
  if (cachedClient) {
    return cachedClient;
  }

  const credentials = getAWSCredentials(encryptionKey);
  if (!credentials) {
    return null;
  }

  try {
    const dynamoDBClient = new DynamoDBClient({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });

    cachedClient = DynamoDBDocumentClient.from(dynamoDBClient);
    return cachedClient;
  } catch (error) {
    console.error('Failed to create DynamoDB client:', error);
    return null;
  }
}

/**
 * Check if AWS is configured (either encrypted or plain)
 */
export function isSecureAWSConfigured(): boolean {
  return !!(ENCRYPTED_AWS_CREDENTIALS || 
           (PLAIN_AWS_CREDENTIALS.accessKeyId && PLAIN_AWS_CREDENTIALS.secretAccessKey));
}

/**
 * Clear cached credentials and clients
 */
export function clearAWSCache(): void {
  cachedCredentials = null;
  cachedClient = null;
}

/**
 * Test AWS connection
 */
export async function testAWSConnection(encryptionKey?: string): Promise<boolean> {
  try {
    const client = getSecureDynamoDBClient(encryptionKey);
    if (!client) return false;

    // Try a simple operation to test connection
    // This will fail gracefully if tables don't exist
    await client.send({} as any);
    return true;
  } catch (error) {
    // If error is about missing table or permissions, connection is working
    if (error instanceof Error && 
        (error.message.includes('Table') || 
         error.message.includes('ValidationException'))) {
      return true;
    }
    
    console.error('AWS connection test failed:', error);
    return false;
  }
}

// Export table names
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
