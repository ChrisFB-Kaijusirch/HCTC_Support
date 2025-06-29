import { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  ScanCommand, 
  QueryCommand 
} from '@aws-sdk/lib-dynamodb';
import { dynamoDBDocClient, TABLE_NAMES, isAWSConfigured } from '../config/aws';
import { 
  Client, 
  Ticket, 
  App, 
  FeatureRequest, 
  KnowledgeBaseArticle, 
  User,
  RecentUpdate,
  PopularTopic
} from '../types';

// Fallback to mock data if AWS is not configured
import { 
  mockClients, 
  mockTickets, 
  mockApps, 
  mockFeatureRequests, 
  mockKnowledgeBase, 
  mockUsers 
} from '../utils/mockData';

class DynamoDBService {
  private useMockData = !isAWSConfigured();

  constructor() {
    if (this.useMockData) {
      console.warn('AWS not configured. Using mock data for development.');
    }
  }

  // Generic CRUD operations
  async create<T>(tableName: string, item: T): Promise<T> {
    if (this.useMockData) {
      return item; // Mock implementation
    }

    try {
      await dynamoDBDocClient.send(new PutCommand({
        TableName: tableName,
        Item: item,
      }));
      return item;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  async get<T>(tableName: string, key: Record<string, any>): Promise<T | null> {
    if (this.useMockData) {
      return null; // Mock implementation
    }

    try {
      const result = await dynamoDBDocClient.send(new GetCommand({
        TableName: tableName,
        Key: key,
      }));
      return result.Item as T || null;
    } catch (error) {
      console.error('Error getting item:', error);
      throw error;
    }
  }

  async update<T>(tableName: string, key: Record<string, any>, updates: Partial<T>): Promise<T> {
    if (this.useMockData) {
      return updates as T; // Mock implementation
    }

    try {
      const updateExpression = Object.keys(updates)
        .map(key => `#${key} = :${key}`)
        .join(', ');
      
      const expressionAttributeNames = Object.keys(updates)
        .reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
      
      const expressionAttributeValues = Object.entries(updates)
        .reduce((acc, [key, value]) => ({ ...acc, [`:${key}`]: value }), {});

      const result = await dynamoDBDocClient.send(new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      }));

      return result.Attributes as T;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  async delete(tableName: string, key: Record<string, any>): Promise<void> {
    if (this.useMockData) {
      return; // Mock implementation
    }

    try {
      await dynamoDBDocClient.send(new DeleteCommand({
        TableName: tableName,
        Key: key,
      }));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  async scan<T>(tableName: string, filters?: Record<string, any>): Promise<T[]> {
    if (this.useMockData) {
      // Return mock data based on table name
      switch (tableName) {
        case TABLE_NAMES.CLIENTS: return mockClients as T[];
        case TABLE_NAMES.TICKETS: return mockTickets as T[];
        case TABLE_NAMES.APPS: return mockApps as T[];
        case TABLE_NAMES.FEATURE_REQUESTS: return mockFeatureRequests as T[];
        case TABLE_NAMES.KNOWLEDGE_BASE: return mockKnowledgeBase as T[];
        case TABLE_NAMES.USERS: return mockUsers as T[];
        default: return [];
      }
    }

    try {
      const result = await dynamoDBDocClient.send(new ScanCommand({
        TableName: tableName,
        FilterExpression: filters ? Object.keys(filters).map(key => `#${key} = :${key}`).join(' AND ') : undefined,
        ExpressionAttributeNames: filters ? Object.keys(filters).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}) : undefined,
        ExpressionAttributeValues: filters ? Object.entries(filters).reduce((acc, [key, value]) => ({ ...acc, [`:${key}`]: value }), {}) : undefined,
      }));
      
      return result.Items as T[] || [];
    } catch (error) {
      console.error('Error scanning table:', error);
      throw error;
    }
  }

  // Client operations
  async createClient(client: Client): Promise<Client> {
    return this.create(TABLE_NAMES.CLIENTS, {
      ...client,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async getClient(clientId: string): Promise<Client | null> {
    return this.get<Client>(TABLE_NAMES.CLIENTS, { id: clientId });
  }

  async getAllClients(): Promise<Client[]> {
    return this.scan<Client>(TABLE_NAMES.CLIENTS);
  }

  async updateClient(clientId: string, updates: Partial<Client>): Promise<Client> {
    return this.update(TABLE_NAMES.CLIENTS, { id: clientId }, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  // Ticket operations
  async createTicket(ticket: Ticket): Promise<Ticket> {
    return this.create(TABLE_NAMES.TICKETS, {
      ...ticket,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async getTicket(ticketId: string): Promise<Ticket | null> {
    return this.get<Ticket>(TABLE_NAMES.TICKETS, { id: ticketId });
  }

  async getAllTickets(): Promise<Ticket[]> {
    return this.scan<Ticket>(TABLE_NAMES.TICKETS);
  }

  async updateTicket(ticketId: string, updates: Partial<Ticket>): Promise<Ticket> {
    return this.update(TABLE_NAMES.TICKETS, { id: ticketId }, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  // App operations
  async createApp(app: App): Promise<App> {
    return this.create(TABLE_NAMES.APPS, {
      ...app,
      createdAt: new Date().toISOString(),
    });
  }

  async getApp(appId: string): Promise<App | null> {
    return this.get<App>(TABLE_NAMES.APPS, { id: appId });
  }

  async getAllApps(): Promise<App[]> {
    return this.scan<App>(TABLE_NAMES.APPS);
  }

  async updateApp(appId: string, updates: Partial<App>): Promise<App> {
    return this.update(TABLE_NAMES.APPS, { id: appId }, updates);
  }

  // Feature Request operations
  async createFeatureRequest(request: FeatureRequest): Promise<FeatureRequest> {
    return this.create(TABLE_NAMES.FEATURE_REQUESTS, {
      ...request,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async getAllFeatureRequests(): Promise<FeatureRequest[]> {
    return this.scan<FeatureRequest>(TABLE_NAMES.FEATURE_REQUESTS);
  }

  // Knowledge Base operations
  async createKnowledgeBaseArticle(article: KnowledgeBaseArticle): Promise<KnowledgeBaseArticle> {
    return this.create(TABLE_NAMES.KNOWLEDGE_BASE, {
      ...article,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async getAllKnowledgeBaseArticles(): Promise<KnowledgeBaseArticle[]> {
    return this.scan<KnowledgeBaseArticle>(TABLE_NAMES.KNOWLEDGE_BASE);
  }

  // Content Management operations
  async createRecentUpdate(update: RecentUpdate): Promise<RecentUpdate> {
    return this.create('holdings-ctc-recent-updates', {
      ...update,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async getAllRecentUpdates(): Promise<RecentUpdate[]> {
    return this.scan<RecentUpdate>('holdings-ctc-recent-updates');
  }

  async updateRecentUpdate(updateId: string, updates: Partial<RecentUpdate>): Promise<RecentUpdate> {
    return this.update('holdings-ctc-recent-updates', { id: updateId }, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteRecentUpdate(updateId: string): Promise<void> {
    return this.delete('holdings-ctc-recent-updates', { id: updateId });
  }

  async createPopularTopic(topic: PopularTopic): Promise<PopularTopic> {
    return this.create('holdings-ctc-popular-topics', {
      ...topic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async getAllPopularTopics(): Promise<PopularTopic[]> {
    return this.scan<PopularTopic>('holdings-ctc-popular-topics');
  }

  async updatePopularTopic(topicId: string, updates: Partial<PopularTopic>): Promise<PopularTopic> {
    return this.update('holdings-ctc-popular-topics', { id: topicId }, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async deletePopularTopic(topicId: string): Promise<void> {
    return this.delete('holdings-ctc-popular-topics', { id: topicId });
  }
}

export const dynamoDBService = new DynamoDBService();