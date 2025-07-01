import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const API_KEY = process.env.API_KEY || 'hctc-api-key-2024';

/**
 * Simple API key authentication middleware
 */
export function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required',
      code: 'MISSING_API_KEY'
    });
  }
  
  if (apiKey !== API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key',
      code: 'INVALID_API_KEY'
    });
  }
  
  next();
}

/**
 * JWT authentication middleware (for future use)
 */
export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required',
      code: 'MISSING_TOKEN'
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }
}

/**
 * Admin role authorization middleware
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }
  next();
}

/**
 * Generate JWT token
 */
export function generateToken(payload, expiresIn = '24h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Simple login endpoint for demo purposes
 */
export function createAuthRoutes(router) {
  router.post('/auth/login', async (req, res) => {
    const { username, password, userType } = req.body;
    
    // Simple hardcoded auth for demo (replace with real auth)
    const validCredentials = {
      admin: { username: 'admin', password: process.env.ADMIN_PASSWORD || 'admin123' },
      client: { username: 'client', password: 'client123' }
    };
    
    const creds = validCredentials[userType];
    if (!creds || username !== creds.username || password !== creds.password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    const token = generateToken({
      username,
      role: userType,
      iat: Date.now()
    });
    
    res.json({
      success: true,
      token,
      user: {
        username,
        role: userType
      }
    });
  });
  
  router.post('/auth/verify', authenticateJWT, (req, res) => {
    res.json({
      success: true,
      user: req.user
    });
  });
}
