/**
 * Secure API client that communicates with the backend proxy
 * This replaces direct AWS DynamoDB calls for maximum security
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_KEY = import.meta.env.VITE_API_KEY || 'hctc-api-key-2024';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: string;
}

interface PaginatedResponse<T = any> extends ApiResponse<T> {
  data: {
    items: T[];
    lastEvaluatedKey?: any;
    count: number;
    scannedCount?: number;
  };
}

class ProxyAPIError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ProxyAPIError';
  }
}

/**
 * Secure API client for backend proxy communication
 */
class ProxyClient {
  private apiKey: string;
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.apiKey = API_KEY;
    this.baseUrl = API_BASE_URL;
    
    // Try to get stored auth token
    this.authToken = localStorage.getItem('hctc_auth_token');
    
    console.log('ProxyClient initialized:', {
      baseUrl: this.baseUrl,
      hasApiKey: !!this.apiKey,
      hasAuthToken: !!this.authToken
    });
  }

  /**
   * Make authenticated request to the proxy server
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      ...options.headers,
    };

    // Add auth token if available
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new ProxyAPIError(
          data.error || 'Request failed',
          data.code || 'REQUEST_FAILED',
          response.status
        );
      }

      if (!data.success) {
        throw new ProxyAPIError(
          data.error || 'API operation failed',
          data.code || 'OPERATION_FAILED'
        );
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof ProxyAPIError) {
        throw error;
      }
      
      console.error('API Request failed:', error);
      throw new ProxyAPIError(
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR'
      );
    }
  }

  /**
   * Authentication methods
   */
  async login(username: string, password: string, userType: 'admin' | 'client'): Promise<{ token: string; user: any }> {
    const result = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, userType }),
    });

    this.authToken = result.token;
    localStorage.setItem('hctc_auth_token', result.token);
    
    return result;
  }

  logout(): void {
    this.authToken = null;
    localStorage.removeItem('hctc_auth_token');
  }

  async verifyAuth(): Promise<{ user: any }> {
    return this.request<{ user: any }>('/auth/verify');
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    return this.request('/health');
  }

  async apiHealthCheck(): Promise<any> {
    return this.request('/api/health');
  }

  /**
   * Generic CRUD operations
   */
  async create<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async update<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string): Promise<{ success: boolean }> {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  async list<T>(endpoint: string, params: Record<string, any> = {}): Promise<{
    items: T[];
    lastEvaluatedKey?: any;
    count: number;
    scannedCount?: number;
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint;
    return this.request<any>(url);
  }

  // ============================================================================
  // ENTITY-SPECIFIC METHODS
  // ============================================================================

  /**
   * Client operations
   */
  async createClient(clientData: any) {
    return this.create('/api/clients', clientData);
  }

  async getClient(clientId: string) {
    return this.get(`/api/clients/${clientId}`);
  }

  async getAllClients(options: any = {}) {
    return this.list('/api/clients', options);
  }

  async updateClient(clientId: string, updates: any) {
    return this.update(`/api/clients/${clientId}`, updates);
  }

  async deleteClient(clientId: string) {
    return this.delete(`/api/clients/${clientId}`);
  }

  /**
   * Ticket operations
   */
  async createTicket(ticketData: any) {
    return this.create('/api/tickets', ticketData);
  }

  async getTicket(ticketId: string) {
    return this.get(`/api/tickets/${ticketId}`);
  }

  async getAllTickets(options: any = {}) {
    return this.list('/api/tickets', options);
  }

  async updateTicket(ticketId: string, updates: any) {
    return this.update(`/api/tickets/${ticketId}`, updates);
  }

  /**
   * App operations
   */
  async createApp(appData: any) {
    return this.create('/api/apps', appData);
  }

  async getApp(appId: string) {
    return this.get(`/api/apps/${appId}`);
  }

  async getAllApps(options: any = {}) {
    return this.list('/api/apps', options);
  }

  async updateApp(appId: string, updates: any) {
    return this.update(`/api/apps/${appId}`, updates);
  }

  /**
   * User operations
   */
  async createUser(userData: any) {
    return this.create('/api/users', userData);
  }

  async getUser(userId: string) {
    return this.get(`/api/users/${userId}`);
  }

  async getAllUsers(options: any = {}) {
    return this.list('/api/users', options);
  }

  async updateUser(userId: string, updates: any) {
    return this.update(`/api/users/${userId}`, updates);
  }

  async deleteUser(userId: string) {
    return this.delete(`/api/users/${userId}`);
  }

  /**
   * Feature Request operations
   */
  async createFeatureRequest(requestData: any) {
    return this.create('/api/feature-requests', requestData);
  }

  async getAllFeatureRequests(options: any = {}) {
    return this.list('/api/feature-requests', options);
  }

  /**
   * Knowledge Base operations
   */
  async createKnowledgeBaseArticle(articleData: any) {
    return this.create('/api/knowledge-base', articleData);
  }

  async getAllKnowledgeBaseArticles(options: any = {}) {
    return this.list('/api/knowledge-base', options);
  }

  async updateKnowledgeBaseArticle(articleId: string, updates: any) {
    return this.update(`/api/knowledge-base/${articleId}`, updates);
  }

  /**
   * Admin User operations
   */
  async createAdminUser(adminData: any) {
    return this.create('/api/admin-users', adminData);
  }

  async getAllAdminUsers(options: any = {}) {
    return this.list('/api/admin-users', options);
  }

  /**
   * Generic table operations (for flexibility)
   */
  async createTableItem(tableName: string, itemData: any) {
    return this.create(`/api/tables/${tableName}/items`, itemData);
  }

  async getTableItems(tableName: string, options: any = {}) {
    return this.list(`/api/tables/${tableName}/items`, options);
  }

  /**
   * Connection test
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('Proxy connection test failed:', error);
      return false;
    }
  }

  /**
   * Check if proxy is available
   */
  async isProxyAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get configuration info
   */
  getConfig() {
    return {
      baseUrl: this.baseUrl,
      hasApiKey: !!this.apiKey,
      hasAuthToken: !!this.authToken,
      isConfigured: !!(this.baseUrl && this.apiKey)
    };
  }
}

// Export singleton instance
export const proxyClient = new ProxyClient();
export { ProxyAPIError };
export type { ApiResponse, PaginatedResponse };
