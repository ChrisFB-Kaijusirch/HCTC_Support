# HCTC Support Portal - Deployment Guide

## 🏗️ Architecture Overview

The HCTC Support Portal now uses a **secure 3-tier architecture**:

1. **Frontend (React/Vite)** - User interface
2. **Backend Proxy (Node.js/Express)** - Secure AWS operations
3. **AWS DynamoDB** - Data storage

## 🔐 Security Models

### 1. Secure Proxy Server (RECOMMENDED)
- AWS credentials stay server-side only
- Frontend communicates with backend API
- Industry-standard security approach

### 2. Encrypted Direct AWS (FALLBACK)
- Client-side encryption of AWS credentials
- Better than plain text credentials
- Automatic fallback if proxy unavailable

### 3. Mock Data (DEVELOPMENT)
- No AWS required for development
- Automatic fallback for testing

## 🚀 Deployment Options

### Option A: Full Secure Deployment (RECOMMENDED)

#### Step 1: Deploy Backend Proxy Server

1. **Server Setup** (any cloud provider):
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```

2. **Configure Server Environment** (server/.env):
   ```bash
   NODE_ENV=production
   PORT=3001
   
   # AWS Configuration (server-side only)
   AWS_REGION=ap-southeast-2
   AWS_ACCESS_KEY_ID=your_actual_aws_key
   AWS_SECRET_ACCESS_KEY=your_actual_aws_secret
   
   # Security
   JWT_SECRET=your_secure_jwt_secret
   API_KEY=your_secure_api_key
   
   # CORS
   ALLOWED_ORIGINS=https://your-domain.github.io,https://your-domain.com
   ```

3. **Start Server**:
   ```bash
   npm start
   ```

#### Step 2: Deploy Frontend

1. **Configure Frontend Environment**:
   ```bash
   # .env or GitHub Secrets
   VITE_API_BASE_URL=https://your-proxy-server.com
   VITE_API_KEY=your_secure_api_key
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   # Deploy dist/ folder to GitHub Pages, Netlify, etc.
   ```

### Option B: Encrypted Direct AWS (CURRENT)

1. **Use Credential Manager** in Admin Settings
2. **Encrypt AWS credentials** with master key
3. **Store encrypted credentials** in GitHub Secrets:
   ```
   VITE_AWS_ACCESS_KEY_ID_ENCRYPTED=encrypted_value
   VITE_AWS_SECRET_ACCESS_KEY_ENCRYPTED=encrypted_value
   VITE_AWS_REGION_ENCRYPTED=encrypted_value
   VITE_ENCRYPTION_KEY=master_encryption_key
   ```

### Option C: Development Mode

1. **No AWS required** - uses mock data
2. **Quick setup** for testing and development
3. **Automatic fallback** when AWS not configured

## 📋 Setup Instructions

### Backend Server Setup

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Test AWS Connection**:
   ```bash
   npm run dev
   # Check logs for AWS connection status
   ```

4. **Deploy Server**:
   - **Heroku**: `git push heroku main`
   - **Railway**: Connect GitHub repo
   - **AWS ECS**: Use provided Dockerfile
   - **VPS**: Use PM2 or systemd

### Frontend Setup

1. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Set VITE_API_BASE_URL to your server URL
   # Set VITE_API_KEY to match server
   ```

2. **Build Application**:
   ```bash
   npm install
   npm run build
   ```

3. **Deploy Frontend**:
   - **GitHub Pages**: Already configured in `.github/workflows/`
   - **Netlify**: Connect repo, build command: `npm run build`
   - **Vercel**: Import GitHub repo

## 🔧 Environment Variables

### Frontend (.env)
```bash
# Required for proxy mode
VITE_API_BASE_URL=https://your-server.com
VITE_API_KEY=your_api_key

# Optional: Direct AWS fallback
VITE_AWS_REGION=ap-southeast-2
VITE_AWS_ACCESS_KEY_ID=fallback_key
VITE_AWS_SECRET_ACCESS_KEY=fallback_secret

# Optional: Encrypted credentials
VITE_AWS_ACCESS_KEY_ID_ENCRYPTED=encrypted_key
VITE_AWS_SECRET_ACCESS_KEY_ENCRYPTED=encrypted_secret
VITE_ENCRYPTION_KEY=master_key
```

### Backend (server/.env)
```bash
# Server config
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# AWS (required)
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret

# Security (required)
JWT_SECRET=secure_random_string
API_KEY=secure_api_key
ADMIN_PASSWORD=secure_admin_password

# CORS
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 🎯 Testing Your Deployment

### 1. Backend Health Check
```bash
curl https://your-server.com/health
```

### 2. Frontend Connection
1. Open browser to your frontend URL
2. Go to Admin Settings → AWS Credentials tab
3. Click "Test Connection"
4. Should show proxy server status

### 3. End-to-End Test
1. Submit a test ticket
2. Check if it appears in Admin Dashboard
3. Verify data persistence

## 🔒 Security Checklist

- [ ] AWS credentials only on backend server
- [ ] Strong API keys in production
- [ ] HTTPS enabled for all connections
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Encryption keys secured
- [ ] Environment secrets not in code

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check `ALLOWED_ORIGINS` in server config
   - Ensure frontend URL matches exactly

2. **API Key Errors**:
   - Verify `VITE_API_KEY` matches server `API_KEY`
   - Check for trailing spaces in secrets

3. **AWS Connection Fails**:
   - Verify server has correct AWS credentials
   - Check DynamoDB table names and regions
   - Test with AWS CLI on server

4. **Build Errors**:
   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Verify all environment variables set

### Debug Commands

```bash
# Check server logs
pm2 logs hctc-server

# Test proxy connection
curl -H "x-api-key: your_api_key" https://your-server.com/api/health

# Check frontend build
npm run build -- --mode production

# Test encrypted credentials
# Use Credential Manager in Admin Settings
```

## 📈 Monitoring

### Server Monitoring
- Monitor `/health` endpoint
- Check AWS CloudWatch for DynamoDB metrics
- Set up error alerts for 5xx responses

### Frontend Monitoring
- Check browser console for errors
- Monitor network requests in DevTools
- Test credential manager functionality

---

## 🎉 You're Ready!

Your HCTC Support Portal is now deployed with enterprise-grade security:
- ✅ AWS credentials secured server-side
- ✅ Multiple fallback mechanisms
- ✅ Encrypted credential support
- ✅ Comprehensive error handling
- ✅ Production-ready architecture

For support, check the logs or create an issue in the repository.
