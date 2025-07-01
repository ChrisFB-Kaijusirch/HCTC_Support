import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// Configuration from environment
const createAWSConfig = () => {
  const accessKeyId = process.env.VITE_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.VITE_AWS_SECRET_ACCESS_KEY;
  const region = process.env.VITE_AWS_REGION || 'us-east-1';

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials not found in environment variables');
  }

  return {
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  };
};

async function setupClientTable() {
  try {
    const config = createAWSConfig();
    const client = new DynamoDBClient(config);
    const docClient = DynamoDBDocumentClient.from(client);

    console.log('Connected to DynamoDB...');
    console.log('Setting up holdings-ctc-clients table...');

    // Example test client for demonstration
    const testClient = {
      email: 'test@example.com',
      totpSecret: null,
      totpEnabled: false,
      status: 'pending', // Will become 'active' after 2FA setup
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // Put the test client
    await docClient.send(new PutCommand({
      TableName: 'holdings-ctc-clients',
      Item: testClient
    }));

    console.log('✅ Client table setup complete!');
    console.log('Test client created:', testClient.email);
    console.log('');
    console.log('To complete the setup:');
    console.log('1. Visit /qr-setup in your application');
    console.log('2. Enter the test email: test@example.com');
    console.log('3. Scan the QR code with Google Authenticator');
    console.log('4. Complete verification to activate the account');
    console.log('');
    console.log('Then you can login at /client/login with:');
    console.log('Email: test@example.com');
    console.log('6-digit code from your authenticator app');

  } catch (error) {
    console.error('❌ Error setting up client table:', error);
    process.exit(1);
  }
}

setupClientTable();
