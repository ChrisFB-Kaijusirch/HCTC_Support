# Backup Authentication Strategy

## Overview
Multiple authentication fallback methods for HCTC Support Portal.

## Authentication Hierarchy

### Primary: Encrypted Local Storage
- User stores encrypted AWS credentials locally
- Decrypted with user-provided key
- Most secure, user-controlled

### Backup: GitHub Secrets  
- AWS credentials stored in GitHub repository secrets
- Automatically deployed via GitHub Actions
- Admin-controlled, always available

### Emergency: Manual Entry
- Direct credential entry in app
- Temporary session only
- For emergency access when other methods fail

## Implementation

### GitHub Secrets Backup
```bash
# Required GitHub Secrets
VITE_AWS_REGION=ap-southeast-2
VITE_AWS_ACCESS_KEY_ID=AKIA...
VITE_AWS_SECRET_ACCESS_KEY=...

# Optional: Emergency admin credentials
EMERGENCY_ADMIN_USERNAME=emergency
EMERGENCY_ADMIN_PASSWORD=secure_generated_password
```

### Emergency Access Flow
1. **Normal**: Local encrypted credentials
2. **Backup**: GitHub Secrets credentials (current setup)
3. **Emergency**: Manual credential entry + emergency admin

### Recovery Process
1. **Lost encryption key**: Use GitHub Secrets
2. **Lost AWS access**: Create new IAM user, update GitHub Secrets
3. **Complete lockout**: Manual entry with emergency admin

## Security Considerations

### GitHub Repository Security
- Repository must be private
- Limit admin access to repository
- Use branch protection rules
- Enable two-factor authentication

### Credential Rotation
- Rotate AWS keys monthly
- Update GitHub Secrets immediately
- Log all credential changes

### Access Logging
- Track authentication method used
- Monitor GitHub Actions deployments
- Alert on emergency access usage

## Backup Verification

### Weekly Tests
- [ ] Verify GitHub Secrets work
- [ ] Test emergency admin login
- [ ] Confirm AWS credentials valid

### Monthly Actions
- [ ] Rotate AWS credentials
- [ ] Update documentation
- [ ] Review access logs

## Emergency Contacts
- **Primary Admin**: [Your Email]
- **GitHub Repository**: ChrisFB-Kaijusirch/HCTC_Support
- **AWS Account**: [Account ID]

## Quick Recovery Commands
```bash
# Update GitHub Secrets
gh secret set VITE_AWS_ACCESS_KEY_ID -b "new_key"
gh secret set VITE_AWS_SECRET_ACCESS_KEY -b "new_secret"

# Trigger emergency deployment
git commit --allow-empty -m "Emergency credential update"
git push origin main
```
