import Joi from 'joi';

/**
 * Validation middleware factory
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const data = source === 'query' ? req.query : 
                 source === 'params' ? req.params : req.body;
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    // Replace the original data with validated/sanitized version
    if (source === 'query') req.query = value;
    else if (source === 'params') req.params = value;
    else req.body = value;
    
    next();
  };
}

// Common validation schemas
export const schemas = {
  // Generic item operations
  createItem: Joi.object({
    id: Joi.string().optional(),
    data: Joi.object().required()
  }),
  
  updateItem: Joi.object({
    id: Joi.string().required(),
    updates: Joi.object().required()
  }),
  
  // Ticket schemas
  createTicket: Joi.object({
    subject: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).max(5000).required(),
    priority: Joi.string().valid('Low', 'Medium', 'High', 'Urgent').required(),
    category: Joi.string().required(),
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    company: Joi.string().optional(),
    appId: Joi.string().required()
  }),
  
  updateTicket: Joi.object({
    status: Joi.string().valid('Open', 'In Progress', 'Waiting for Response', 'Resolved', 'Closed').optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High', 'Urgent').optional(),
    assignedTo: Joi.string().optional(),
    resolution: Joi.string().optional(),
    replies: Joi.array().items(Joi.object({
      message: Joi.string().required(),
      author: Joi.string().required(),
      isInternal: Joi.boolean().default(false),
      timestamp: Joi.string().optional()
    })).optional()
  }),
  
  // Client schemas
  createClient: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    company: Joi.string().min(2).max(100).required(),
    industry: Joi.string().optional(),
    website: Joi.string().uri().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      postalCode: Joi.string().optional()
    }).optional()
  }),
  
  // User schemas
  createUser: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'user', 'viewer').required(),
    clientId: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().default(true)
  }),
  
  // App schemas
  createApp: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    version: Joi.string().optional(),
    platform: Joi.string().optional(),
    clientId: Joi.string().required(),
    isActive: Joi.boolean().default(true),
    settings: Joi.object().optional()
  }),
  
  // Feature request schemas
  createFeatureRequest: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    priority: Joi.string().valid('Low', 'Medium', 'High').required(),
    category: Joi.string().required(),
    appId: Joi.string().required(),
    submittedBy: Joi.string().required(),
    votes: Joi.number().integer().min(0).default(0),
    status: Joi.string().valid('Submitted', 'Under Review', 'In Development', 'Completed', 'Rejected').default('Submitted')
  }),
  
  // Knowledge base schemas
  createKnowledgeBaseArticle: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    content: Joi.string().min(50).required(),
    category: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).optional(),
    author: Joi.string().required(),
    isPublished: Joi.boolean().default(false),
    difficulty: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').optional(),
    estimatedReadTime: Joi.number().integer().min(1).optional()
  }),
  
  // Query parameters
  listQuery: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(50),
    offset: Joi.number().integer().min(0).default(0),
    sort: Joi.string().optional(),
    filter: Joi.string().optional(),
    search: Joi.string().optional()
  }),
  
  // Generic ID parameter
  itemId: Joi.object({
    id: Joi.string().required()
  })
};

/**
 * Error response formatter
 */
export function formatValidationError(error) {
  return {
    success: false,
    error: 'Validation failed',
    details: error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }))
  };
}
