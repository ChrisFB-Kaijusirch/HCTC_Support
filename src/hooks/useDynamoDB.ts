import { useState, useEffect } from 'react';
import { hybridDynamoDBService } from '../services/hybridDynamoDB';
import { Client, Ticket, App, FeatureRequest, KnowledgeBaseArticle } from '../types';

// Custom hook for clients
export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await hybridDynamoDBService.getAllClients();
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (client: Omit<Client, 'id'>) => {
    try {
      const newClient = await hybridDynamoDBService.createClient({
        ...client,
        id: `client_${Date.now()}`,
      } as Client);
      setClients(prev => [...prev, newClient]);
      return newClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client');
      throw err;
    }
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    try {
      const updatedClient = await hybridDynamoDBService.updateClient(clientId, updates);
      setClients(prev => prev.map(c => c.id === clientId ? updatedClient : c));
      return updatedClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client');
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
  };
};

// Custom hook for tickets
export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await hybridDynamoDBService.getAllTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticket: Omit<Ticket, 'id'>) => {
    try {
      const newTicket = await hybridDynamoDBService.createTicket({
        ...ticket,
        id: `ticket_${Date.now()}`,
      } as Ticket);
      setTickets(prev => [...prev, newTicket]);
      return newTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
      throw err;
    }
  };

  const updateTicket = async (ticketId: string, updates: Partial<Ticket>) => {
    try {
      const updatedTicket = await hybridDynamoDBService.updateTicket(ticketId, updates);
      setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
      return updatedTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
      throw err;
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
    createTicket,
    updateTicket,
  };
};

// Custom hook for apps
export const useApps = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const data = await hybridDynamoDBService.getAllApps();
      setApps(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch apps');
    } finally {
      setLoading(false);
    }
  };

  const createApp = async (app: Omit<App, 'id'>) => {
    try {
      const newApp = await hybridDynamoDBService.createApp({
        ...app,
        id: `app_${Date.now()}`,
      } as App);
      setApps(prev => [...prev, newApp]);
      return newApp;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create app');
      throw err;
    }
  };

  const updateApp = async (appId: string, updates: Partial<App>) => {
    try {
      const updatedApp = await hybridDynamoDBService.updateApp(appId, updates);
      setApps(prev => prev.map(a => a.id === appId ? updatedApp : a));
      return updatedApp;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update app');
      throw err;
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return {
    apps,
    loading,
    error,
    refetch: fetchApps,
    createApp,
    updateApp,
  };
};

// Custom hook for feature requests
export const useFeatureRequests = () => {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatureRequests = async () => {
    try {
      setLoading(true);
      const data = await hybridDynamoDBService.getAllFeatureRequests();
      setFeatureRequests(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch feature requests');
    } finally {
      setLoading(false);
    }
  };

  const createFeatureRequest = async (request: Omit<FeatureRequest, 'id'>) => {
    try {
      const newRequest = await hybridDynamoDBService.createFeatureRequest({
        ...request,
        id: `request_${Date.now()}`,
      } as FeatureRequest);
      setFeatureRequests(prev => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create feature request');
      throw err;
    }
  };

  useEffect(() => {
    fetchFeatureRequests();
  }, []);

  return {
    featureRequests,
    loading,
    error,
    refetch: fetchFeatureRequests,
    createFeatureRequest,
  };
};

// Custom hook for knowledge base
export const useKnowledgeBase = () => {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await hybridDynamoDBService.getAllKnowledgeBaseArticles();
      setArticles(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const createArticle = async (article: Omit<KnowledgeBaseArticle, 'id'>) => {
    try {
      const newArticle = await hybridDynamoDBService.createKnowledgeBaseArticle({
        ...article,
        id: `article_${Date.now()}`,
      } as KnowledgeBaseArticle);
      setArticles(prev => [...prev, newArticle]);
      return newArticle;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
      throw err;
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles,
    createArticle,
  };
};