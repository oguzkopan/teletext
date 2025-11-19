# Deployment Quick Reference

Quick commands and procedures for common deployment tasks.

## 🚀 Quick Deploy

### Full Deployment

```bash
# Deploy everything (recommended for first deployment)
npm run deploy

# Or manually:
npm run build
cd functions && npm run build && cd ..
firebase deploy
```

### Partial Deployments

```bash
# Deploy only hosting
npm run deploy:hosting

# Deploy only functions
npm run deploy:functions

# Deploy only Firestore rules
npm run deploy:firestore

# Deploy only Storage rules
npm run deploy:storage
```

---

## 🔧 Configuration

### Set Function Environment Variables

```bash
# Interactive configuration
npm run configure:functions

# Or manually:
firebase functions:config:set \
  news.api_key="YOUR_KEY" \
  sports.api_key="YOUR_KEY" \
  markets.alpha_vantage_key="YOUR_KEY" \
  weather.api_key="YOUR_KEY"

# View current config
firebase functions:config:get
```

### Update Environment Variables

```bash
# Edit .env.production
nano .env.production

# Rebuild and redeploy
npm run build
firebase deploy --only hosting
```

---

## 📊 Monitoring

### View Logs

```bash
# All function logs
firebase functions:log

# Specific function
firebase functions:log --only getPage

# Last 100 entries
firebase functions:log --limit 100

# Real-time logs
firebase functions:log --follow
```

### Check Deployment Status

```bash
# List recent deployments
firebase hosting:channel:list

# View function status
firebase functions:list
```

---

## 🧪 Testing

### Pre-Deployment Tests

```bash
# Run all tests
npm test
cd functions && npm test && cd ..

# Run Firestore rules tests
npm run test:firestore-rules

# Build verification
npm run build
cd functions && npm run build && cd ..
```

### Post-Deployment Smoke Tests

```bash
# Test homepage
curl https://teletext-eacd0.web.app/

# Test API endpoint
curl "https://us-central1-teletext-eacd0.cloudfunctions.net/getPage?id=100"

# Test with verbose output
curl -v https://teletext-eacd0.web.app/
```

---

## 🔄 Rollback

### Rollback Hosting

```bash
# Via Firebase Console:
# Hosting → Release History → Click "Rollback" on previous version

# Or via CLI (if you have the channel):
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

### Rollback Functions

```bash
# Checkout previous version
git checkout PREVIOUS_COMMIT

# Redeploy
cd functions
npm run build
firebase deploy --only functions
```

### Rollback Firestore Rules

```bash
# Via Firebase Console:
# Firestore → Rules → View History → Restore previous version
```

---

## 🐛 Debugging

### Common Issues

#### Functions Not Updating

```bash
# Clear build cache
cd functions
rm -rf lib/
npm run build
firebase deploy --only functions --force
```

#### Environment Variables Not Working

```bash
# Verify config
firebase functions:config:get

# Redeploy functions
firebase deploy --only functions
```

#### Hosting Not Updating

```bash
# Clear Next.js cache
rm -rf .next/
rm -rf out/

# Rebuild and redeploy
npm run build
firebase deploy --only hosting
```

#### CORS Errors

```bash
# Verify CORS headers in functions/src/index.ts
# Redeploy functions
firebase deploy --only functions
```

---

## 📈 Performance

### Check Bundle Size

```bash
# Build and analyze
npm run build

# Check output size
du -sh .next/
du -sh out/
```

### Run Lighthouse

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://teletext-eacd0.web.app/ --view
```

---

## 💰 Cost Management

### View Current Usage

```bash
# Firestore usage
firebase firestore:usage

# Function invocations (via Cloud Console)
gcloud logging read "resource.type=cloud_function" \
  --project teletext-eacd0 \
  --format="table(timestamp,resource.labels.function_name)" \
  --limit 100
```

### Set Budget Alerts

```bash
# Via Google Cloud Console:
# Billing → Budgets & Alerts → Create Budget
```

---

## 🔐 Security

### Update Firestore Rules

```bash
# Edit rules
nano firestore.rules

# Test rules locally
npm run test:firestore-rules

# Deploy
firebase deploy --only firestore:rules
```

### Update Storage Rules

```bash
# Edit rules
nano storage.rules

# Deploy
firebase deploy --only storage
```

---

## 🌐 Custom Domain

### Add Custom Domain

```bash
# Via Firebase Console:
# Hosting → Add custom domain → Follow instructions

# Or via CLI:
firebase hosting:channel:deploy production
```

### Verify DNS

```bash
# Check DNS records
dig yourdomain.com
dig www.yourdomain.com

# Check SSL certificate
curl -vI https://yourdomain.com
```

---

## 📦 Backup & Restore

### Backup Firestore

```bash
# Export Firestore data
gcloud firestore export gs://teletext-eacd0-backups/$(date +%Y%m%d) \
  --project teletext-eacd0
```

### Restore Firestore

```bash
# Import Firestore data
gcloud firestore import gs://teletext-eacd0-backups/BACKUP_DATE \
  --project teletext-eacd0
```

---

## 🔍 Useful Commands

### Firebase Project Info

```bash
# List projects
firebase projects:list

# Current project
firebase use

# Switch project
firebase use teletext-eacd0
```

### Function Management

```bash
# List functions
firebase functions:list

# Delete function
firebase functions:delete FUNCTION_NAME

# View function details
gcloud functions describe FUNCTION_NAME \
  --project teletext-eacd0 \
  --region us-central1
```

### Hosting Management

```bash
# List hosting sites
firebase hosting:sites:list

# View hosting usage
firebase hosting:channel:list
```

---

## 📞 Emergency Procedures

### Site Down

1. Check Firebase status: https://status.firebase.google.com/
2. View function logs: `firebase functions:log`
3. Check recent deployments
4. Rollback if needed
5. Contact Firebase support if persistent

### High Error Rate

1. View function logs: `firebase functions:log`
2. Check external API status
3. Verify environment variables
4. Check Firestore rules
5. Rollback if needed

### High Costs

1. Check billing dashboard
2. Review function invocations
3. Check Firestore operations
4. Identify runaway functions
5. Implement rate limiting if needed

---

## 📚 Resources

- **Firebase Console**: https://console.firebase.google.com/project/teletext-eacd0
- **Cloud Console**: https://console.cloud.google.com/
- **Documentation**: See DEPLOYMENT.md for detailed guide
- **Monitoring**: See MONITORING.md for monitoring setup
- **Checklist**: See DEPLOYMENT_CHECKLIST.md for full checklist

---

## 🎯 Production URLs

- **Website**: https://teletext-eacd0.web.app/
- **Functions**: https://us-central1-teletext-eacd0.cloudfunctions.net/
- **Firebase Console**: https://console.firebase.google.com/project/teletext-eacd0
- **Cloud Console**: https://console.cloud.google.com/home/dashboard?project=teletext-eacd0

---

**Last Updated**: [Date]
**Version**: 1.0.0
