import express from 'express';
import { secureDynamoDBService } from '../services/dynamodb.js';
import { authenticateApiKey } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Apply API key authentication to all routes
router.use(authenticateApiKey);

/**
 * Generic response handler
 */
function handleResponse(res, operation) {
  return async (req, res, next) => {
    try {
      const result = await operation(req);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('API Error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Internal server error',
        code: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  };
}

// Health check endpoint
router.get('/health', handleResponse(async () => {
  return await secureDynamoDBService.healthCheck();
}));

// ============================================================================
// CLIENT ROUTES
// ============================================================================

router.post('/clients', 
  validate(schemas.createClient),
  handleResponse(async (req) => {
    return await secureDynamoDBService.createClient(req.body);
  })
);

router.get('/clients',
  validate(schemas.listQuery, 'query'),
  handleResponse(async (req) => {
    return await secureDynamoDBService.getAllClients(req.query);
  })
);

router.get('/clients/:id',
  validate(schemas.itemId, 'params'),
  handleResponse(async (req) => {
    const client = await secureDynamoDBService.getClient(req.params.id);
    if (!client) {
      const error = new Error('Client not found');
      error.statusCode = 404;
      throw error;
    }
    return client;
  })
);

router.put('/clients/:id',
  validate(schemas.itemId, 'params'),
  validate(schemas.createClient),
  handleResponse(async (req) => {
    return await secureDynamoDBService.updateClient(req.params.id, req.body);
  })
);

router.delete('/clients/:id',
  validate(schemas.itemId, 'params'),
  handleResponse(async (req) => {
    return await secureDynamoDBService.deleteClient(req.params.id);
  })
);

// ============================================================================
// TICKET ROUTES
// ============================================================================

router.post('/tickets',
  validate(schemas.createTicket),
  handleResponse(async (req) => {
    return await secureDynamoDBService.createTicket(req.body);
  })
);

router.get('/tickets',
  validate(schemas.listQuery, 'query'),
  handleResponse(async (req) => {
    return await secureDynamoDBService.getAllTickets(req.query);
  })
);

router.get('/tickets/:id',
  validate(schemas.itemId, 'params'),
  handleResponse(async (req) => {
    const ticket = await secureDynamoDBService.getTicket(req.params.id);
    if (!ticket) {
      const error = new Error('Ticket not found');
      error.statusCode = 404;
      throw error;
    }
    return ticket;
  })
);

router.put('/tickets/:id',
  validate(schemas.itemId, 'params'),
  validate(schemas.updateTicket),
  handleResponse(async (req) => {
    return await secureDynamoDBService.updateTicket(req.params.id, req.body);
  })
);

// ============================================================================
// APP ROUTES
// ============================================================================

router.post('/apps',
  validate(schemas.createApp),
  handleResponse(async (req) => {
    return await secureDynamoDBService.createApp(req.body);
  })
);

router.get('/apps',
  validate(schemas.listQuery, 'query'),
  handleResponse(async (req) => {
    return await secureDynamoDBService.getAllApps(req.query);
  })
);

router.get('/apps/:id',
  validate(schemas.itemId, 'params'),
  handleResponse(async (req) => {
    const app = await secureDynamoDBService.getApp(req.params.id);
    if (!app) {
      const error = new Error('App not found');
      error.statusCode = 404;
      throw error;
    }
    return app;
  })
);

router.put('/apps/:id',
  validate(schemas.itemId, 'params'),
  validate(schemas.createApp),
  handleResponse(async (req) => {
    return await secureDynamoDBService.updateApp(req.params.id, req.body);
  })
);

// ============================================================================
// USER ROUTES
// ============================================================================

router.post('/users',
  validate(schemas.createUser),
  handleResponse(async (req) => {
    return await secureDynamoDBService.createUser(req.body);
  })
);

router.get('/users',
  validate(schemas.listQuery, 'query'),
  handleResponse(async (req) => {
    return await secureDynamoDBService.getAllUsers(req.query);
  })
);

router.get('/users/:id',
  validate(schemas.itemId, 'params'),
  handleResponse(async (req) => {
    const user = await secureDynamoDBService.getUser(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  })
);

router.put('/users/:id',
  validate(schemas.itemId, 'params'),
  validate(schemas.createUser),
  handleResponse(async (req) => {
    return await secureDynamoDBService.updateUser(req.params.id, req.body);
  })
);

router.delete('/users/:id',
  validate(schemas.itemId, 'params'),
  handleResponse(async (req) => {
    return await secureDynamoDBService.deleteUser(req.params.id);
  })
);

// ============================================================================
// FEATURE REQUEST ROUTES
// ============================================================================

router.post('/feature-requests',
  validate(schemas.createFeatureRequest),
  handleResponse(async (req) => {
    return await secureDynamoDBService.createFeatureRequest(req.body);
  })
);

router.get('/feature-requests',
  validate(schemas.listQuery, 'query'),
  handleResponse(async (req) => {
    return await secureDynamoDBService.getAllFeatureRequests(req.query);
  })
);

// ============================================================================
// KNOWLEDGE BASE ROUTES
// ============================================================================

router.post('/knowledge-base',
  validate(schemas.createKnowledgeBaseArticle),
  handleResponse(async (req) => {
    return await secureDynamoDBService.createKnowledgeBaseArticle(req.body);
  })
);

router.get('/knowledge-base',
  validate(schemas.listQuery, 'query'),
  handleResponse(async (req) => {
    return await secureDynamoDBService.getAllKnowledgeBaseArticles(req.query);
  })
);

router.put('/knowledge-base/:id',
  validate(schemas.itemId, 'params'),
  validate(schemas.createKnowledgeBaseArticle),
  handleResponse(async (req) => {
    return await secureDynamoDBService.updateKnowledgeBaseArticle(req.params.id, req.body);
  })
);

// ============================================================================
// ADMIN USER ROUTES
// ============================================================================

router.post('/admin-users',
  validate(schemas.createUser), // Reuse user schema
  handleResponse(async (req) => {
    return await secureDynamoDBService.createAdminUser(req.body);
  })
);

router.get('/admin-users',
  validate(schemas.listQuery, 'query'),
  handleResponse(async (req) => {
    return await secureDynamoDBService.getAllAdminUsers(req.query);
  })
);

// ============================================================================
// GENERIC OPERATIONS (for flexibility)
// ============================================================================

router.post('/tables/:tableName/items',
  handleResponse(async (req) => {
    const { tableName } = req.params;
    // Validate table name against allowed tables
    const allowedTables = Object.values(TABLE_NAMES);
    if (!allowedTables.includes(tableName)) {
      const error = new Error('Invalid table name');
      error.statusCode = 400;
      throw error;
    }
    return await secureDynamoDBService.create(tableName, req.body);
  })
);

router.get('/tables/:tableName/items',
  handleResponse(async (req) => {
    const { tableName } = req.params;
    const allowedTables = Object.values(TABLE_NAMES);
    if (!allowedTables.includes(tableName)) {
      const error = new Error('Invalid table name');
      error.statusCode = 400;
      throw error;
    }
    return await secureDynamoDBService.scan(tableName, req.query);
  })
);

export default router;
