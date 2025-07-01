import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function setupAWS() {
  console.log('🚀 HCTC Support - AWS Setup Script');
  console.log('=====================================\n');

  // Get AWS credentials
  const accessKeyId = await askQuestion('Enter your AWS Access Key ID: ');
  const secretAccessKey = await askQuestion('Enter your AWS Secret Access Key: ');
  const region = await askQuestion('Enter your AWS Region (default: us-east-1): ') || 'us-east-1';

  const dynamoDBClient = new DynamoDBClient({
    region,
    credentials: { accessKeyId, secretAccessKey }
  });

  // Test connection
  console.log('\n🔗 Testing AWS connection...');
  try {
    await dynamoDBClient.send(new ListTablesCommand({}));
    console.log('✅ AWS connection successful!');
  } catch (error) {
    console.error('❌ AWS connection failed:', error.message);
    process.exit(1);
  }

  // Define tables to create
  const tables = [
    {
      name: 'holdings-ctc-clients',
      keySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      attributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }]
    },
    {
      name: 'holdings-ctc-tickets', 
      keySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      attributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }]
    },
    {
      name: 'holdings-ctc-apps',
      keySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      attributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }]
    },
    {
      name: 'holdings-ctc-feature-requests',
      keySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      attributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }]
    },
    {
      name: 'holdings-ctc-knowledge-base',
      keySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      attributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }]
    },
    {
      name: 'holdings-ctc-users',
      keySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      attributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }]
    },
    {
      name: 'holdings-ctc-recent-updates',
      keySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      attributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }]
    },
    {
      name: 'holdings-ctc-popular-topics',
      keySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      attributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }]
    },
    {
      name: 'holdings-ctc-invoices',
      keySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      attributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }]
    },
    {
      name: 'holdings-ctc-qr-codes',
      keySchema: [{ AttributeName: 'qrCode', KeyType: 'HASH' }],
      attributeDefinitions: [{ AttributeName: 'qrCode', AttributeType: 'S' }]
    },
    {
      name: 'holdings-ctc-admin-users',
      keySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      attributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }]
    }
  ];

  // Create tables
  console.log('\n📦 Creating DynamoDB tables...');
  for (const table of tables) {
    try {
      console.log(`Creating table: ${table.name}...`);
      await dynamoDBClient.send(new CreateTableCommand({
        TableName: table.name,
        KeySchema: table.keySchema,
        AttributeDefinitions: table.attributeDefinitions,
        BillingMode: 'PAY_PER_REQUEST'
      }));
      console.log(`✅ Created: ${table.name}`);
    } catch (error) {
      if (error.name === 'ResourceInUseException') {
        console.log(`⚠️  Table ${table.name} already exists`);
      } else {
        console.error(`❌ Failed to create ${table.name}:`, error.message);
      }
    }
  }

  console.log('\n🎉 Setup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Go to GitHub → Your repo → Settings → Secrets and variables → Actions');
  console.log('2. Add these secrets:');
  console.log(`   - VITE_AWS_ACCESS_KEY_ID: ${accessKeyId}`);
  console.log(`   - VITE_AWS_SECRET_ACCESS_KEY: ${secretAccessKey}`);
  console.log(`   - VITE_AWS_REGION: ${region}`);
  console.log('3. Push a commit to trigger a new build');

  rl.close();
}

setupAWS().catch(console.error);
