# Holdings CTC Support Portal

A comprehensive client support portal for managing technical support requests, feature requests, and client relationships with AWS DynamoDB integration.

## 🔐 Login Credentials

### Admin Access
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`
- **Features**: No 2FA required for admin login

### Client Access
- **URL**: `/client/login`
- **Test Email**: `john@techcorp.com`
- **Password**: Any password
- **2FA**: Required for some clients (any 6-digit code for demo)

## 🚀 Features

### Admin Dashboard
- **Ticket Management**: View, assign, and respond to support tickets
- **Client Management**: CRM-style client database with company info and subscription details
- **App Management**: Manage supported applications and their details
- **Knowledge Base**: Create and manage help articles
- **Feature Requests**: Track and manage client feature requests

### Client Portal
- **Ticket Submission**: Submit support tickets with app-specific details
- **Ticket Tracking**: Track ticket status and view conversation history
- **Feature Requests**: Submit and vote on feature requests
- **Knowledge Base**: Search and browse help articles
- **QR Code Setup**: New client onboarding with 2FA setup

### Security Features
- **Admin**: Simple username/password authentication
- **Clients**: Email-based login with optional 2FA
- **QR Code Access**: Secure client onboarding process

## 🗄️ Database Integration

### AWS DynamoDB Setup

This application is configured to use **Amazon DynamoDB** as the primary database. DynamoDB's free tier includes:
- **25 GB** of storage
- **25 read/write capacity units**
- Perfect for getting started!

#### **Quick Setup Steps:**

1. **Create AWS Account** (if you haven't already)
   - Go to [aws.amazon.com](https://aws.amazon.com)
   - Sign up for a free account

2. **Get AWS Credentials**
   - Go to AWS Console → IAM → Users
   - Create a new user with DynamoDB permissions
   - Generate Access Key ID and Secret Access Key

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your AWS credentials:
   ```env
   VITE_AWS_REGION=us-east-1
   VITE_AWS_ACCESS_KEY_ID=your_access_key_here
   VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here
   ```

4. **Create DynamoDB Tables**
   ```bash
   node src/scripts/setup-dynamodb-tables.js
   ```

#### **Database Schema**
The application uses these DynamoDB tables:
- **holdings-ctc-clients**: Client information and subscriptions
- **holdings-ctc-tickets**: Support tickets and conversations
- **holdings-ctc-apps**: Supported applications and versions
- **holdings-ctc-feature-requests**: Client feature suggestions
- **holdings-ctc-knowledge-base**: Help articles and documentation
- **holdings-ctc-users**: User authentication and access control

#### **Development Mode**
If AWS credentials are not configured, the app automatically falls back to mock data for development.

### Alternative Database Options
- **MongoDB Atlas**: Cloud-hosted MongoDB
- **Firebase Firestore**: Google's NoSQL database
- **Supabase**: PostgreSQL with real-time features

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- AWS Account (for production)

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📱 Mobile Responsive
The portal is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Configuration

### Environment Variables
```env
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_access_key_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here

# DynamoDB Tables (optional, uses defaults if not set)
VITE_DYNAMODB_CLIENTS_TABLE=holdings-ctc-clients
VITE_DYNAMODB_TICKETS_TABLE=holdings-ctc-tickets
VITE_DYNAMODB_APPS_TABLE=holdings-ctc-apps
VITE_DYNAMODB_FEATURE_REQUESTS_TABLE=holdings-ctc-feature-requests
VITE_DYNAMODB_KNOWLEDGE_BASE_TABLE=holdings-ctc-knowledge-base
VITE_DYNAMODB_USERS_TABLE=holdings-ctc-users

# Application Settings
VITE_APP_NAME=Holdings CTC Support Portal
VITE_SUPPORT_EMAIL=support@holdingsctc.com
```

### AWS IAM Permissions
Your AWS user needs these DynamoDB permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable",
        "dynamodb:ListTables",
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/holdings-ctc-*"
    }
  ]
}
```

### Customization
- Update branding in `src/components/Layout/Header.tsx`
- Modify color scheme in `tailwind.config.js`
- Add custom business logic in respective page components

## 💰 Cost Estimation

### DynamoDB Free Tier (Monthly)
- **Storage**: 25 GB free
- **Read/Write**: 25 units each free
- **Estimated cost**: $0 for small to medium usage

### Beyond Free Tier
- **Storage**: $0.25 per GB/month
- **Read/Write**: $0.25 per million requests
- **Typical monthly cost**: $5-20 for small business

## 📞 Support
For technical support or questions about this portal, contact the development team.

## 🔒 Security Best Practices
- Store AWS credentials securely (never commit to git)
- Use IAM roles with minimal permissions
- Enable AWS CloudTrail for audit logging
- Consider using AWS Secrets Manager for production