import { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  ScanCommand, 
  QueryCommand 
} from '@aws-sdk/lib-dynamodb';
import { dynamoDBDocClient, TABLE_NAMES } from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Secure DynamoDB service - server-side only
 */
class SecureDynamoDBService {
  
  /**
   * Generic create operation
   */
  async create(tableName, item) {
    try {
      // Add timestamps and ID if not provided
      const itemWithMetadata = {
        id: item.id || uuidv4(),
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const command = new PutCommand({
        TableName: tableName,
        Item: itemWithMetadata,
        // Prevent overwriting existing items
        ConditionExpression: 'attribute_not_exists(id)'
      });

      await dynamoDBDocClient.send(command);
      return itemWithMetadata;
    } catch (error) {
      console.error('DynamoDB Create Error:', error);
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Item with this ID already exists');
      }
      throw new Error(`Failed to create item: ${error.message}`);
    }
  }

  /**
   * Generic get operation
   */
  async get(tableName, key) {
    try {
      const command = new GetCommand({
        TableName: tableName,
        Key: key,
      });

      const result = await dynamoDBDocClient.send(command);
      return result.Item || null;
    } catch (error) {
      console.error('DynamoDB Get Error:', error);
      throw new Error(`Failed to get item: ${error.message}`);
    }
  }

  /**
   * Generic update operation
   */
  async update(tableName, key, updates) {
    try {
      // Remove undefined values and add updateAt timestamp
      const cleanUpdates = {
        ...Object.fromEntries(
          Object.entries(updates).filter(([_, value]) => value !== undefined)
        ),
        updatedAt: new Date().toISOString()
      };

      // Build update expression
      const updateExpression = Object.keys(cleanUpdates)
        .map(key => `#${key} = :${key}`)
        .join(', ');
      
      const expressionAttributeNames = Object.keys(cleanUpdates)
        .reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
      
      const expressionAttributeValues = Object.entries(cleanUpdates)
        .reduce((acc, [key, value]) => ({ ...acc, [`:${key}`]: value }), {});

      const command = new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
        // Ensure item exists before updating
        ConditionExpression: 'attribute_exists(id)'
      });

      const result = await dynamoDBDocClient.send(command);
      return result.Attributes;
    } catch (error) {
      console.error('DynamoDB Update Error:', error);
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Item not found');
      }
      throw new Error(`Failed to update item: ${error.message}`);
    }
  }

  /**
   * Generic delete operation
   */
  async delete(tableName, key) {
    try {
      const command = new DeleteCommand({
        TableName: tableName,
        Key: key,
        ConditionExpression: 'attribute_exists(id)'
      });

      await dynamoDBDocClient.send(command);
      return { success: true };
    } catch (error) {
      console.error('DynamoDB Delete Error:', error);
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Item not found');
      }
      throw new Error(`Failed to delete item: ${error.message}`);
    }
  }

  /**
   * Generic scan operation with pagination and filtering
   */
  async scan(tableName, options = {}) {
    try {
      const {
        limit = 50,
        lastEvaluatedKey,
        filterExpression,
        expressionAttributeNames,
        expressionAttributeValues
      } = options;

      const command = new ScanCommand({
        TableName: tableName,
        Limit: Math.min(limit, 100), // Cap at 100 for performance
        ExclusiveStartKey: lastEvaluatedKey,
        FilterExpression: filterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      });

      const result = await dynamoDBDocClient.send(command);
      
      return {
        items: result.Items || [],
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count,
        scannedCount: result.ScannedCount
      };
    } catch (error) {
      console.error('DynamoDB Scan Error:', error);
      throw new Error(`Failed to scan table: ${error.message}`);
    }
  }

  /**
   * Generic query operation
   */
  async query(tableName, keyConditionExpression, options = {}) {
    try {
      const {
        indexName,
        filterExpression,
        expressionAttributeNames,
        expressionAttributeValues,
        limit = 50,
        lastEvaluatedKey,
        scanIndexForward = true
      } = options;

      const command = new QueryCommand({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: keyConditionExpression,
        FilterExpression: filterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        Limit: Math.min(limit, 100),
        ExclusiveStartKey: lastEvaluatedKey,
        ScanIndexForward: scanIndexForward
      });

      const result = await dynamoDBDocClient.send(command);
      
      return {
        items: result.Items || [],
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count,
        scannedCount: result.ScannedCount
      };
    } catch (error) {
      console.error('DynamoDB Query Error:', error);
      throw new Error(`Failed to query table: ${error.message}`);
    }
  }

  // Specific entity operations
  
  /**
   * Client operations
   */
  async createClient(clientData) {
    return this.create(TABLE_NAMES.CLIENTS, clientData);
  }

  async getClient(clientId) {
    return this.get(TABLE_NAMES.CLIENTS, { id: clientId });
  }

  async getAllClients(options = {}) {
    return this.scan(TABLE_NAMES.CLIENTS, options);
  }

  async updateClient(clientId, updates) {
    return this.update(TABLE_NAMES.CLIENTS, { id: clientId }, updates);
  }

  async deleteClient(clientId) {
    return this.delete(TABLE_NAMES.CLIENTS, { id: clientId });
  }

  /**
   * Ticket operations
   */
  async createTicket(ticketData) {
    // Generate ticket number
    const ticketNumber = `HCTC-${Date.now().toString().slice(-8)}`;
    return this.create(TABLE_NAMES.TICKETS, {
      ...ticketData,
      ticketNumber,
      status: 'Open',
      replies: []
    });
  }

  async getTicket(ticketId) {
    return this.get(TABLE_NAMES.TICKETS, { id: ticketId });
  }

  async getAllTickets(options = {}) {
    return this.scan(TABLE_NAMES.TICKETS, options);
  }

  async updateTicket(ticketId, updates) {
    return this.update(TABLE_NAMES.TICKETS, { id: ticketId }, updates);
  }

  /**
   * App operations
   */
  async createApp(appData) {
    return this.create(TABLE_NAMES.APPS, appData);
  }

  async getApp(appId) {
    return this.get(TABLE_NAMES.APPS, { id: appId });
  }

  async getAllApps(options = {}) {
    return this.scan(TABLE_NAMES.APPS, options);
  }

  async updateApp(appId, updates) {
    return this.update(TABLE_NAMES.APPS, { id: appId }, updates);
  }

  /**
   * User operations
   */
  async createUser(userData) {
    return this.create(TABLE_NAMES.USERS, userData);
  }

  async getUser(userId) {
    return this.get(TABLE_NAMES.USERS, { id: userId });
  }

  async getAllUsers(options = {}) {
    return this.scan(TABLE_NAMES.USERS, options);
  }

  async updateUser(userId, updates) {
    return this.update(TABLE_NAMES.USERS, { id: userId }, updates);
  }

  async deleteUser(userId) {
    return this.delete(TABLE_NAMES.USERS, { id: userId });
  }

  /**
   * Feature Request operations
   */
  async createFeatureRequest(requestData) {
    return this.create(TABLE_NAMES.FEATURE_REQUESTS, requestData);
  }

  async getAllFeatureRequests(options = {}) {
    return this.scan(TABLE_NAMES.FEATURE_REQUESTS, options);
  }

  /**
   * Knowledge Base operations
   */
  async createKnowledgeBaseArticle(articleData) {
    return this.create(TABLE_NAMES.KNOWLEDGE_BASE, articleData);
  }

  async getAllKnowledgeBaseArticles(options = {}) {
    return this.scan(TABLE_NAMES.KNOWLEDGE_BASE, options);
  }

  async updateKnowledgeBaseArticle(articleId, updates) {
    return this.update(TABLE_NAMES.KNOWLEDGE_BASE, { id: articleId }, updates);
  }

  /**
   * Admin User operations
   */
  async createAdminUser(adminData) {
    return this.create(TABLE_NAMES.ADMIN_USERS, adminData);
  }

  async getAdminUser(adminId) {
    return this.get(TABLE_NAMES.ADMIN_USERS, { id: adminId });
  }

  async getAllAdminUsers(options = {}) {
    return this.scan(TABLE_NAMES.ADMIN_USERS, options);
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      // Try a simple operation on each table
      const checks = await Promise.allSettled([
        this.scan(TABLE_NAMES.CLIENTS, { limit: 1 }),
        this.scan(TABLE_NAMES.TICKETS, { limit: 1 }),
        this.scan(TABLE_NAMES.APPS, { limit: 1 })
      ]);

      const results = checks.map((check, index) => ({
        table: Object.values(TABLE_NAMES)[index],
        status: check.status === 'fulfilled' ? 'healthy' : 'error',
        error: check.status === 'rejected' ? check.reason.message : null
      }));

      return {
        overall: checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'partial',
        tables: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        overall: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const secureDynamoDBService = new SecureDynamoDBService();
