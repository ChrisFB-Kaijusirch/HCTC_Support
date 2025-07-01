# 🔐 SECURITY SETUP GUIDE

## ⚠️ IMPORTANT: GitGuardian Alert Resolution

This guide will help you set up secure credential management after the GitGuardian security alert.

## 🛡️ Required GitHub Secrets

You need to set up these secrets in your GitHub repository:

### AWS Credentials (Only 3 Required)
1. `VITE_AWS_ACCESS_KEY_ID` - Your AWS Access Key ID
2. `VITE_AWS_SECRET_ACCESS_KEY` - Your AWS Secret Access Key  
3. `VITE_AWS_REGION` - Your AWS region (e.g., `us-east-1`, `ap-southeast-2`)

**Note:** Admin passwords are stored in the DynamoDB admin users table, not as separate secrets.

## 📋 Step-by-Step Setup

### 1. Generate Secure Passwords
Generate strong passwords for your admin accounts. Example:
```bash
# Generate secure 16-character passwords
# Use a password manager or secure generator
```

**Recommended format**: At least 12 characters with mix of:
- Uppercase letters
- Lowercase letters  
- Numbers
- Special characters (!@#$%^&*)

### 2. Set GitHub Secrets

1. **Go to GitHub Repository**:
   - Navigate to: `https://github.com/ChrisFB-Kaijusirch/HCTC_Support`
   - Click: **Settings** → **Secrets and variables** → **Actions**

2. **Add Repository Secrets**:
   Click "New repository secret" for each:

   | Secret Name | Example Value | Description |
   |-------------|---------------|-------------|
   | `VITE_AWS_ACCESS_KEY_ID` | `AKIA...` | Your AWS Access Key |
   | `VITE_AWS_SECRET_ACCESS_KEY` | `wJalrXU...` | Your AWS Secret Key |
   | `VITE_AWS_REGION` | `us-east-1` | Your AWS Region |

### 3. AWS Setup

If you haven't set up AWS yet, run the setup script:

```bash
node setup-aws.js
```

This will:
- Test your AWS credentials
- Create all required DynamoDB tables
- Show you the exact GitHub Secrets to add

### 4. First Login Setup

After deployment with secrets configured:

1. **Visit your deployed site**
2. **Use setup credentials**: `setup` / `setup123`
3. **This creates admin users in DynamoDB**
4. **Login with your existing admin credentials** from the DynamoDB table

### 5. Test Connection

Go to **Admin Settings** → **AWS Credentials** tab and click **"Test AWS Connection"** to verify everything works.

## 🔍 Security Verification

### Check GitGuardian Status
- Monitor your GitGuardian dashboard
- The alert should resolve after secrets are removed from code
- Repository history has been cleaned

### Verify No Hardcoded Secrets
```bash
# Search for any remaining hardcoded credentials
git log --all -S "password" --oneline
git log --all -S "secret" --oneline
```

### Test Application Security
- [ ] No passwords visible in source code
- [ ] Admin login works with new passwords
- [ ] AWS connection successful
- [ ] All features working normally

## 🚨 Emergency Access

If you get locked out:
1. Check GitHub Secrets are set correctly
2. Redeploy the application (push any commit)
3. Use the **Test Connection** feature in Admin Settings
4. Contact repository owner if issues persist

## 📞 Support

If you need help:
1. **Check the logs** in browser developer tools
2. **Use the AWS Test Connection** feature
3. **Verify GitHub Secrets** are set correctly
4. **Ensure AWS credentials** have DynamoDB permissions

---

## ✅ Security Checklist

- [ ] All GitHub Secrets configured
- [ ] AWS credentials tested and working
- [ ] Strong passwords generated and set
- [ ] No hardcoded credentials in source code
- [ ] Application deployed and tested
- [ ] GitGuardian alert resolved
- [ ] Documentation updated

**Once complete, your application will be secure and GitGuardian compliant! 🎉**
