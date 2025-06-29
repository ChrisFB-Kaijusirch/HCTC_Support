# Quick Start Guide - AWS DynamoDB Setup

## 🚀 Super Quick Setup (5 minutes)

### 1. AWS Account & Credentials
```bash
# 1. Go to aws.amazon.com → Create account
# 2. Go to IAM → Users → Create user → Attach DynamoDBFullAccess
# 3. Create access key → Copy credentials
```

### 2. Configure App
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your AWS credentials:
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIA...
VITE_AWS_SECRET_ACCESS_KEY=...
```

### 3. Setup Database
```bash
# Install dependencies
npm install

# Create DynamoDB tables
node src/scripts/setup-dynamodb-tables.js

# Start app
npm run dev
```

### 4. Test Login
- **Admin**: username: `admin`, password: `admin123`
- **Client**: email: `john@techcorp.com`, any password

## 🎯 That's it! Your app is now connected to AWS DynamoDB!

### 💡 Pro Tips:
- App works with mock data if AWS isn't configured
- Free tier covers most small business usage
- Set up billing alerts in AWS Console
- Never commit `.env` file to git

### 🆘 Need Help?
See the complete guide: `docs/AWS_SETUP_GUIDE.md`