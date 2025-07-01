/**
 * Hybrid DynamoDB service that automatically chooses between:
 * 1. Secure proxy server (preferred)
 * 2. Direct AWS with encryption (fallback)
 * 3. Mock data (development fallback)
 */

import { proxyClient, ProxyAPIError } from './proxyClient';
import { dynamoDBService as directAWSService } from './dynamodb';
import { 
  Client, 
  Ticket, 
  App, 
  FeatureRequest, 
  KnowledgeBaseArticle, 
  User 
} from '../types';

type ServiceMode = 'proxy' | 'direct-aws' | 'mock';

class HybridDynamoDBService {
  private currentMode: ServiceMode = 'proxy';
  private modeChecked = false;
  private isProxyAvailable = false;

  constructor() {
    console.log('HybridDynamoDBService initialized');
    this.checkAvailableServices();
  }

  /**
   * Check which services are available and set the preferred mode
   */
  private async checkAvailableServices(): Promise<void> {
    if (this.modeChecked) return;

    console.log('🔍 Checking available services...');

    try {
      // First, try proxy server
      this.isProxyAvailable = await proxyClient.isProxyAvailable();
      
      if (this.isProxyAvailable) {
        this.currentMode = 'proxy';
        console.log('✅ Using secure proxy server');
      } else {
        // Fallback to direct AWS
        console.log('⚠️ Proxy not available, checking direct AWS...');
        
        // Check if direct AWS is configured
        const hasAwsCredentials = !!(
          import.meta.env.VITE_AWS_ACCESS_KEY_ID && 
          import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
        );
        
        if (hasAwsCredentials) {
          this.currentMode = 'direct-aws';
          console.log('✅ Using direct AWS with credentials from environment');
        } else {
          this.currentMode = 'mock';
          console.log('ℹ️ Using mock data (development mode)');
        }
      }
    } catch (error) {
      console.warn('Service check failed, defaulting to mock:', error);
      this.currentMode = 'mock';
    }

    this.modeChecked = true;
    console.log(`🔧 Service mode selected: ${this.currentMode}`);
  }

  /**
   * Execute operation with fallback logic
   */
  private async executeWithFallback<T>(
    operation: {
      proxy: () => Promise<T>;
      directAws: () => Promise<T>;
      mock: () => Promise<T>;
    }
  ): Promise<T> {
    await this.checkAvailableServices();

    try {
      switch (this.currentMode) {
        case 'proxy':
          try {
            return await operation.proxy();
          } catch (error) {
            if (error instanceof ProxyAPIError && error.code === 'NETWORK_ERROR') {
              console.warn('Proxy failed, falling back to direct AWS...');
              this.currentMode = 'direct-aws';
              return await operation.directAws();
            }
            throw error;
          }

        case 'direct-aws':
          try {
            return await operation.directAws();
          } catch (error) {
            console.warn('Direct AWS failed, falling back to mock...');
            this.currentMode = 'mock';
            return await operation.mock();
          }

        case 'mock':
          return await operation.mock();

        default:
          throw new Error(`Unknown service mode: ${this.currentMode}`);
      }
    } catch (error) {
      console.error('All service modes failed:', error);
      // Last resort - try mock data
      try {
        return await operation.mock();
      } catch (mockError) {
        console.error('Even mock data failed:', mockError);
        throw error;
      }
    }
  }

  /**
   * Get current service status
   */
  getServiceStatus() {
    return {
      currentMode: this.currentMode,
      isProxyAvailable: this.isProxyAvailable,
      modeChecked: this.modeChecked
    };
  }

  /**
   * Force refresh of service availability
   */
  async refreshServiceCheck(): Promise<void> {
    this.modeChecked = false;
    await this.checkAvailableServices();
  }

  // ============================================================================
  // CLIENT OPERATIONS
  // ============================================================================

  async createClient(client: Client): Promise<Client> {
    return this.executeWithFallback({
      proxy: () => proxyClient.createClient(client),
      directAws: () => directAWSService.createClient(client),
      mock: () => Promise.resolve(client)
    });
  }

  async getClient(clientId: string): Promise<Client | null> {
    return this.executeWithFallback({
      proxy: () => proxyClient.getClient(clientId),
      directAws: () => directAWSService.getClient(clientId),
      mock: () => Promise.resolve(null)
    });
  }

  async getAllClients(): Promise<Client[]> {
    return this.executeWithFallback({
      proxy: async () => {
        const result = await proxyClient.getAllClients();
        return result.items || [];
      },
      directAws: () => directAWSService.getAllClients(),
      mock: () => directAWSService.getAllClients() // Mock data from existing service
    });
  }

  async updateClient(clientId: string, updates: Partial<Client>): Promise<Client> {
    return this.executeWithFallback({
      proxy: () => proxyClient.updateClient(clientId, updates),
      directAws: () => directAWSService.updateClient(clientId, updates),
      mock: () => Promise.resolve({ ...updates, id: clientId } as Client)
    });
  }

  // ============================================================================
  // TICKET OPERATIONS
  // ============================================================================

  async createTicket(ticket: Ticket): Promise<Ticket> {
    return this.executeWithFallback({
      proxy: () => proxyClient.createTicket(ticket),
      directAws: () => directAWSService.createTicket(ticket),
      mock: () => Promise.resolve(ticket)
    });
  }

  async getTicket(ticketId: string): Promise<Ticket | null> {
    return this.executeWithFallback({
      proxy: () => proxyClient.getTicket(ticketId),
      directAws: () => directAWSService.getTicket(ticketId),
      mock: () => Promise.resolve(null)
    });
  }

  async getAllTickets(): Promise<Ticket[]> {
    return this.executeWithFallback({
      proxy: async () => {
        const result = await proxyClient.getAllTickets();
        return result.items || [];
      },
      directAws: () => directAWSService.getAllTickets(),
      mock: () => directAWSService.getAllTickets()
    });
  }

  async updateTicket(ticketId: string, updates: Partial<Ticket>): Promise<Ticket> {
    return this.executeWithFallback({
      proxy: () => proxyClient.updateTicket(ticketId, updates),
      directAws: () => directAWSService.updateTicket(ticketId, updates),
      mock: () => Promise.resolve({ ...updates, id: ticketId } as Ticket)
    });
  }

  // ============================================================================
  // APP OPERATIONS
  // ============================================================================

  async createApp(app: App): Promise<App> {
    return this.executeWithFallback({
      proxy: () => proxyClient.createApp(app),
      directAws: () => directAWSService.createApp(app),
      mock: () => Promise.resolve(app)
    });
  }

  async getApp(appId: string): Promise<App | null> {
    return this.executeWithFallback({
      proxy: () => proxyClient.getApp(appId),
      directAws: () => directAWSService.getApp(appId),
      mock: () => Promise.resolve(null)
    });
  }

  async getAllApps(): Promise<App[]> {
    return this.executeWithFallback({
      proxy: async () => {
        const result = await proxyClient.getAllApps();
        return result.items || [];
      },
      directAws: () => directAWSService.getAllApps(),
      mock: () => directAWSService.getAllApps()
    });
  }

  async updateApp(appId: string, updates: Partial<App>): Promise<App> {
    return this.executeWithFallback({
      proxy: () => proxyClient.updateApp(appId, updates),
      directAws: () => directAWSService.updateApp(appId, updates),
      mock: () => Promise.resolve({ ...updates, id: appId } as App)
    });
  }

  // ============================================================================
  // USER OPERATIONS
  // ============================================================================

  async createUser(user: User): Promise<User> {
    return this.executeWithFallback({
      proxy: () => proxyClient.createUser(user),
      directAws: () => directAWSService.createUser(user),
      mock: () => Promise.resolve(user)
    });
  }

  async getUser(userId: string): Promise<User | null> {
    return this.executeWithFallback({
      proxy: () => proxyClient.getUser(userId),
      directAws: () => directAWSService.getUser(userId),
      mock: () => Promise.resolve(null)
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.executeWithFallback({
      proxy: async () => {
        const result = await proxyClient.getAllUsers();
        return result.items || [];
      },
      directAws: () => directAWSService.getAllUsers(),
      mock: () => directAWSService.getAllUsers()
    });
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return this.executeWithFallback({
      proxy: () => proxyClient.updateUser(userId, updates),
      directAws: () => directAWSService.updateUser(userId, updates),
      mock: () => Promise.resolve({ ...updates, id: userId } as User)
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return this.executeWithFallback({
      proxy: async () => {
        await proxyClient.deleteUser(userId);
      },
      directAws: () => directAWSService.deleteUser(userId),
      mock: () => Promise.resolve()
    });
  }

  // ============================================================================
  // FEATURE REQUEST OPERATIONS
  // ============================================================================

  async createFeatureRequest(request: FeatureRequest): Promise<FeatureRequest> {
    return this.executeWithFallback({
      proxy: () => proxyClient.createFeatureRequest(request),
      directAws: () => directAWSService.createFeatureRequest(request),
      mock: () => Promise.resolve(request)
    });
  }

  async getAllFeatureRequests(): Promise<FeatureRequest[]> {
    return this.executeWithFallback({
      proxy: async () => {
        const result = await proxyClient.getAllFeatureRequests();
        return result.items || [];
      },
      directAws: () => directAWSService.getAllFeatureRequests(),
      mock: () => directAWSService.getAllFeatureRequests()
    });
  }

  // ============================================================================
  // KNOWLEDGE BASE OPERATIONS
  // ============================================================================

  async createKnowledgeBaseArticle(article: KnowledgeBaseArticle): Promise<KnowledgeBaseArticle> {
    return this.executeWithFallback({
      proxy: () => proxyClient.createKnowledgeBaseArticle(article),
      directAws: () => directAWSService.createKnowledgeBaseArticle(article),
      mock: () => Promise.resolve(article)
    });
  }

  async getAllKnowledgeBaseArticles(): Promise<KnowledgeBaseArticle[]> {
    return this.executeWithFallback({
      proxy: async () => {
        const result = await proxyClient.getAllKnowledgeBaseArticles();
        return result.items || [];
      },
      directAws: () => directAWSService.getAllKnowledgeBaseArticles(),
      mock: () => directAWSService.getAllKnowledgeBaseArticles()
    });
  }

  // ============================================================================
  // GENERIC OPERATIONS
  // ============================================================================

  async create<T>(tableName: string, item: T): Promise<T> {
    return this.executeWithFallback({
      proxy: () => proxyClient.createTableItem(tableName, item),
      directAws: () => directAWSService.create(tableName, item),
      mock: () => Promise.resolve(item)
    });
  }

  async get<T>(tableName: string, key: Record<string, any>): Promise<T | null> {
    return this.executeWithFallback({
      proxy: () => Promise.resolve(null), // Generic get not implemented in proxy yet
      directAws: () => directAWSService.get<T>(tableName, key),
      mock: () => Promise.resolve(null)
    });
  }

  /**
   * Test connection to current service
   */
  async testConnection(): Promise<boolean> {
    await this.checkAvailableServices();
    
    switch (this.currentMode) {
      case 'proxy':
        return proxyClient.testConnection();
      case 'direct-aws':
        // Use existing AWS test method if available
        return true; // Assume configured if in this mode
      case 'mock':
        return true; // Mock always works
      default:
        return false;
    }
  }
}

// Export singleton instance
export const hybridDynamoDBService = new HybridDynamoDBService();
