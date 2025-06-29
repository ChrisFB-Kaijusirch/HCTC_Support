#!/usr/bin/env node

/**
 * DynamoDB Table Setup Script for Holdings CTC Support Portal
 * 
 * This script creates all necessary DynamoDB tables for the application.
 * Run this script after setting up your AWS credentials.
 * 
 * Usage: node src/scripts/setup-dynamodb-tables.js
 */

import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  CreateTableCommand, 
  DescribeTableCommand, 
  ListTablesCommand 
} from '@aws-sdk/client-dynamodb';

// AWS Configuration
const awsConfig = {
  region: process.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
};

const dynamoDBClient = new DynamoDBClient(awsConfig);

// Table definitions
const tables = [
  {
    TableName: 'holdings-ctc-clients',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'holdings-ctc-tickets',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'clientId', AttributeType: 'S' },
      { AttributeName: 'ticketNumber', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'ClientIndex',
        KeySchema: [
          { AttributeName: 'clientId', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      },
      {
        IndexName: 'TicketNumberIndex',
        KeySchema: [
          { AttributeName: 'ticketNumber', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'holdings-ctc-apps',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'holdings-ctc-feature-requests',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'appId', AttributeType: 'S' },
      { AttributeName: 'clientId', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'AppIndex',
        KeySchema: [
          { AttributeName: 'appId', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      },
      {
        IndexName: 'ClientIndex',
        KeySchema: [
          { AttributeName: 'clientId', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'holdings-ctc-knowledge-base',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'category', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CategoryIndex',
        KeySchema: [
          { AttributeName: 'category', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'holdings-ctc-users',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'holdings-ctc-recent-updates',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'type', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'TypeIndex',
        KeySchema: [
          { AttributeName: 'type', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'holdings-ctc-popular-topics',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'order', AttributeType: 'N' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'OrderIndex',
        KeySchema: [
          { AttributeName: 'order', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  }
];

async function checkTableExists(tableName) {
  try {
    await dynamoDBClient.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      return false;
    }
    throw error;
  }
}

async function createTable(tableConfig) {
  try {
    console.log(`Creating table: ${tableConfig.TableName}...`);
    await dynamoDBClient.send(new CreateTableCommand(tableConfig));
    console.log(`✅ Table ${tableConfig.TableName} created successfully!`);
  } catch (error) {
    console.error(`❌ Error creating table ${tableConfig.TableName}:`, error.message);
    throw error;
  }
}

async function setupTables() {
  console.log('🚀 Setting up DynamoDB tables for Holdings CTC Support Portal...\n');

  // Check AWS credentials
  if (!awsConfig.credentials.accessKeyId || !awsConfig.credentials.secretAccessKey) {
    console.error('❌ AWS credentials not found. Please set the following environment variables:');
    console.error('   - VITE_AWS_ACCESS_KEY_ID');
    console.error('   - VITE_AWS_SECRET_ACCESS_KEY');
    console.error('   - VITE_AWS_REGION (optional, defaults to us-east-1)');
    process.exit(1);
  }

  try {
    // List existing tables
    const existingTables = await dynamoDBClient.send(new ListTablesCommand({}));
    console.log('📋 Existing tables:', existingTables.TableNames?.join(', ') || 'None');
    console.log('');

    // Create tables
    for (const tableConfig of tables) {
      const exists = await checkTableExists(tableConfig.TableName);
      
      if (exists) {
        console.log(`⏭️  Table ${tableConfig.TableName} already exists, skipping...`);
      } else {
        await createTable(tableConfig);
      }
    }

    console.log('\n🎉 DynamoDB setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Add your AWS credentials to the .env file');
    console.log('3. Start your application with: npm run dev');
    console.log('\n💡 Your DynamoDB tables are ready to use!');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupTables();