# Complete AWS DynamoDB Setup Guide
## Holdings CTC Support Portal

This guide will walk you through setting up AWS DynamoDB for your Holdings CTC Support Portal from scratch.

## 📋 Prerequisites
- A computer with internet access
- An email address for AWS account creation
- A credit/debit card (for AWS account verification - you won't be charged for free tier usage)

---

## 🚀 Step 1: Create Your AWS Account

### 1.1 Sign Up for AWS
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click **"Create an AWS Account"**
3. Fill in your information:
   - **Email address**: Use a valid email you can access
   - **Password**: Create a strong password
   - **AWS account name**: Use something like "Holdings CTC Portal"

### 1.2 Contact Information
1. Choose **"Personal"** account type
2. Fill in your contact information
3. Read and accept the AWS Customer Agreement

### 1.3 Payment Information
1. Enter your credit/debit card information
2. **Don't worry**: You won't be charged if you stay within the free tier
3. AWS requires this for account verification

### 1.4 Identity Verification
1. Enter your phone number
2. AWS will call or text you with a verification code
3. Enter the code when prompted

### 1.5 Choose Support Plan
1. Select **"Basic support - Free"**
2. Click **"Complete sign up"**

---

## 🔐 Step 2: Create IAM User (Security Best Practice)

### 2.1 Access IAM Console
1. Sign in to [AWS Console](https://console.aws.amazon.com)
2. In the search bar, type **"IAM"**
3. Click on **"IAM"** service

### 2.2 Create New User
1. Click **"Users"** in the left sidebar
2. Click **"Create user"**
3. Enter username: `holdings-ctc-app-user`
4. Click **"Next"**

### 2.3 Set Permissions
1. Select **"Attach policies directly"**
2. In the search box, type: `DynamoDB`
3. Check the box for **"AmazonDynamoDBFullAccess"**
4. Click **"Next"**
5. Click **"Create user"**

### 2.4 Create Access Keys
1. Click on your newly created user (`holdings-ctc-app-user`)
2. Click the **"Security credentials"** tab
3. Scroll down to **"Access keys"**
4. Click **"Create access key"**
5. Select **"Application running outside AWS"**
6. Click **"Next"**
7. Add description: `Holdings CTC Portal App`
8. Click **"Create access key"**

### 2.5 Save Your Credentials
**⚠️ IMPORTANT**: Copy and save these credentials immediately!

```
Access Key ID: AKIA... (starts with AKIA)
Secret Access Key: ... (long random string)
```

**You won't be able to see the Secret Access Key again!**

---

## 🗄️ Step 3: Configure Your Application

### 3.1 Create Environment File
1. In your project folder, copy the example file:
```bash
cp .env.example .env
```

### 3.2 Edit Environment Variables
Open the `.env` file and add your AWS credentials:

```env
# AWS Configuration for DynamoDB
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIA... (your access key from step 2.5)
VITE_AWS_SECRET_ACCESS_KEY=... (your secret key from step 2.5)

# DynamoDB Table Names (keep these as default)
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

### 3.3 Install Dependencies
```bash
npm install
```

---

## 🏗️ Step 4: Create DynamoDB Tables

### 4.1 Run the Setup Script
```bash
node src/scripts/setup-dynamodb-tables.js
```

You should see output like:
```
🚀 Setting up DynamoDB tables for Holdings CTC Support Portal...

📋 Existing tables: None

Creating table: holdings-ctc-clients...
✅ Table holdings-ctc-clients created successfully!

Creating table: holdings-ctc-tickets...
✅ Table holdings-ctc-tickets created successfully!

... (more tables)

🎉 DynamoDB setup completed successfully!
```

### 4.2 Verify Tables in AWS Console
1. Go to [AWS Console](https://console.aws.amazon.com)
2. Search for **"DynamoDB"**
3. Click **"Tables"** in the left sidebar
4. You should see 6 tables:
   - `holdings-ctc-clients`
   - `holdings-ctc-tickets`
   - `holdings-ctc-apps`
   - `holdings-ctc-feature-requests`
   - `holdings-ctc-knowledge-base`
   - `holdings-ctc-users`

---

## 🚀 Step 5: Start Your Application

### 5.1 Start Development Server
```bash
npm run dev
```

### 5.2 Test the Application
1. Open your browser to the URL shown (usually `http://localhost:5173`)
2. Try logging in as admin:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Navigate to different sections to ensure everything works

---

## 💰 Step 6: Understanding AWS Costs

### 6.1 DynamoDB Free Tier (Monthly)
- **25 GB** of storage
- **25 read capacity units**
- **25 write capacity units**
- **2.5 million stream read requests**

### 6.2 What This Means for You
- **Small business**: Likely $0/month
- **Medium usage**: $5-15/month
- **Heavy usage**: $20-50/month

### 6.3 Monitor Your Usage
1. Go to AWS Console → **"Billing and Cost Management"**
2. Set up billing alerts for peace of mind
3. Recommended: Set alert at $5 and $20

---

## 🔒 Step 7: Security Best Practices

### 7.1 Protect Your Credentials
- ✅ Never commit `.env` file to git
- ✅ Use different credentials for production
- ✅ Regularly rotate access keys
- ❌ Never share credentials in emails/chat

### 7.2 Set Up Billing Alerts
1. Go to **"Billing and Cost Management"**
2. Click **"Billing preferences"**
3. Enable **"Receive Billing Alerts"**
4. Set up CloudWatch billing alarms

---

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### ❌ "AWS credentials not found"
**Solution**: Check your `.env` file has the correct credentials

#### ❌ "Access Denied" errors
**Solution**: Ensure your IAM user has DynamoDB permissions

#### ❌ "Table already exists"
**Solution**: This is normal if you run the setup script multiple times

#### ❌ "Region not found"
**Solution**: Make sure `VITE_AWS_REGION=us-east-1` in your `.env` file

### Getting Help
1. Check the AWS Console for error messages
2. Look at your browser's developer console (F12)
3. Verify your `.env` file matches the example exactly

---

## 🎯 Next Steps

### Production Deployment
When you're ready to deploy:
1. Create a production AWS account/user
2. Use AWS Secrets Manager for credentials
3. Set up proper IAM roles
4. Enable CloudTrail for auditing

### Scaling Up
As your app grows:
1. Monitor DynamoDB metrics
2. Consider reserved capacity for cost savings
3. Implement caching with ElastiCache
4. Add CloudFront for global distribution

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review AWS documentation
3. Contact AWS support (free tier includes basic support)

**Remember**: The app will work with mock data even if AWS isn't configured, so you can develop and test without AWS initially.

---

## ✅ Checklist

- [ ] AWS account created
- [ ] IAM user created with DynamoDB permissions
- [ ] Access keys generated and saved
- [ ] `.env` file configured with credentials
- [ ] Dependencies installed (`npm install`)
- [ ] DynamoDB tables created (`node src/scripts/setup-dynamodb-tables.js`)
- [ ] Application started (`npm run dev`)
- [ ] Admin login tested (admin/admin123)
- [ ] Billing alerts configured

**Congratulations! Your Holdings CTC Support Portal is now connected to AWS DynamoDB! 🎉**