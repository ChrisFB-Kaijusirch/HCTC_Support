import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes and middleware
import apiRoutes from './routes/api.js';
import { createAuthRoutes } from './middleware/auth.js';
import { testAWSConnection } from './config/aws.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow embedding for development
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://chrisfb-kaijusirch.github.io'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked origin ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
};

app.use(cors(corsOptions));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================================
// ROUTES
// ============================================================================

// Health check endpoint (public)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HCTC Support Proxy Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Public health endpoint
app.get('/health', async (req, res) => {
  try {
    const awsConnected = await testAWSConnection();
    res.json({
      success: true,
      status: 'healthy',
      services: {
        server: 'running',
        aws: awsConnected ? 'connected' : 'disconnected',
        database: awsConnected ? 'available' : 'unavailable'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Auth routes
const authRouter = express.Router();
createAuthRoutes(authRouter);
app.use('/auth', authRouter);

// API routes (protected)
app.use('/api', apiRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled Error:', error);
  
  // Don't send error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    code: error.code || 'INTERNAL_ERROR',
    ...(isDevelopment && { stack: error.stack }),
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function startServer() {
  try {
    console.log('🚀 Starting HCTC Support Proxy Server...');
    
    // Test AWS connection
    console.log('🔗 Testing AWS connection...');
    const awsConnected = await testAWSConnection();
    
    if (!awsConnected) {
      console.warn('⚠️  AWS connection failed - server will start but database operations may fail');
    }
    
    // Start the server
    app.listen(PORT, HOST, () => {
      console.log('✅ Server started successfully!');
      console.log(`📍 Server running at: http://${HOST}:${PORT}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 AWS Status: ${awsConnected ? 'Connected' : 'Disconnected'}`);
      console.log(`⏰ Started at: ${new Date().toISOString()}`);
      console.log('');
      console.log('📋 Available endpoints:');
      console.log(`   GET  /              - Server info`);
      console.log(`   GET  /health        - Health check`);
      console.log(`   POST /auth/login    - Authentication`);
      console.log(`   *    /api/*         - Protected API endpoints`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;
