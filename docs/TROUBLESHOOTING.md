# Troubleshooting Guide - AWS DynamoDB Integration

## 🔧 Common Issues and Solutions

### 1. AWS Credentials Issues

#### ❌ Error: "AWS credentials not found"
```bash
# Check your .env file exists and has correct format:
VITE_AWS_ACCESS_KEY_ID=AKIA...
VITE_AWS_SECRET_ACCESS_KEY=...
VITE_AWS_REGION=us-east-1
```

#### ❌ Error: "The security token included in the request is invalid"
- **Cause**: Wrong access key or secret key
- **Solution**: Double-check credentials in AWS Console → IAM → Users → Security credentials

#### ❌ Error: "Access Denied"
- **Cause**: IAM user doesn't have DynamoDB permissions
- **Solution**: Add `AmazonDynamoDBFullAccess` policy to your IAM user

### 2. Table Creation Issues

#### ❌ Error: "Table already exists"
- **Cause**: Tables were already created
- **Solution**: This is normal! Your tables are ready to use

#### ❌ Error: "Cannot create table"
- **Cause**: Region mismatch or permissions
- **Solution**: 
  1. Check `VITE_AWS_REGION=us-east-1` in `.env`
  2. Verify IAM permissions include `dynamodb:CreateTable`

### 3. Application Issues

#### ❌ App shows mock data instead of AWS data
- **Cause**: AWS not properly configured
- **Check**: Browser console (F12) for AWS connection messages
- **Solution**: Verify all environment variables are set correctly

#### ❌ Error: "Module not found: @aws-sdk/client-dynamodb"
```bash
# Install missing dependencies
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb @aws-sdk/credential-providers
```

### 4. Development Issues

#### ❌ Environment variables not loading
- **Cause**: `.env` file not in root directory
- **Solution**: Ensure `.env` is in same folder as `package.json`

#### ❌ Changes to `.env` not taking effect
- **Solution**: Restart development server (`npm run dev`)

### 5. AWS Console Issues

#### ❌ Can't find DynamoDB in AWS Console
- **Solution**: 
  1. Check you're in the correct region (top-right corner)
  2. Search for "DynamoDB" in the services search bar

#### ❌ Tables not showing in DynamoDB console
- **Cause**: Wrong region selected
- **Solution**: Switch to `us-east-1` region in AWS Console

### 6. Cost and Billing Issues

#### ❌ Unexpected charges
- **Cause**: Exceeded free tier limits
- **Solution**: 
  1. Check AWS Billing dashboard
  2. Set up billing alerts
  3. Consider using reserved capacity for predictable costs

#### ❌ Want to stay within free tier
- **Limits**: 25 GB storage, 25 read/write units per month
- **Monitor**: AWS Console → DynamoDB → Tables → Metrics

## 🛠️ Debugging Steps

### Step 1: Check Environment
```bash
# Verify .env file exists and has correct variables
cat .env

# Should show:
# VITE_AWS_REGION=us-east-1
# VITE_AWS_ACCESS_KEY_ID=AKIA...
# VITE_AWS_SECRET_ACCESS_KEY=...
```

### Step 2: Test AWS Connection
```bash
# Run table setup script to test connection
node src/scripts/setup-dynamodb-tables.js

# Should show successful table creation or "already exists"
```

### Step 3: Check Browser Console
1. Open browser developer tools (F12)
2. Look for AWS-related error messages
3. Check if app is using mock data or AWS data

### Step 4: Verify AWS Console
1. Login to AWS Console
2. Go to DynamoDB → Tables
3. Verify 6 tables exist with names starting with "holdings-ctc-"

## 🔍 Advanced Debugging

### Enable AWS SDK Debug Logging
Add to your `.env` file:
```env
VITE_AWS_SDK_DEBUG=true
```

### Check IAM Permissions
Your IAM user needs these permissions:
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

### Test Individual Components
```javascript
// Test in browser console:
import { dynamoDBService } from './src/services/dynamodb';
dynamoDBService.getAllClients().then(console.log);
```

## 📞 Getting Help

### 1. Check Documentation
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)

### 2. AWS Support
- Free tier includes basic support
- AWS Console → Support → Create case

### 3. Community Resources
- [AWS Developer Forums](https://forums.aws.amazon.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/amazon-dynamodb)

## 🔄 Reset and Start Over

If everything is broken and you want to start fresh:

### 1. Delete Tables (Optional)
```bash
# In AWS Console → DynamoDB → Tables
# Select all "holdings-ctc-*" tables → Delete
```

### 2. Reset Environment
```bash
# Remove .env file
rm .env

# Copy fresh example
cp .env.example .env

# Add your credentials again
```

### 3. Recreate Everything
```bash
# Install dependencies
npm install

# Create tables
node src/scripts/setup-dynamodb-tables.js

# Start app
npm run dev
```

## ✅ Verification Checklist

When everything is working correctly:

- [ ] `.env` file exists with AWS credentials
- [ ] `npm install` completed without errors
- [ ] Table setup script runs successfully
- [ ] 6 tables visible in AWS DynamoDB console
- [ ] App starts without errors (`npm run dev`)
- [ ] Admin login works (admin/password_from_github_secrets)
- [ ] No AWS-related errors in browser console
- [ ] App shows real data instead of "mock data" messages

**If all items are checked, your AWS DynamoDB integration is working perfectly! 🎉**