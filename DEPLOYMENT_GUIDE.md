# Firebase Functions Deployment Guide

## Prerequisites

✅ Firebase CLI installed (`firebase --version`)
✅ Logged into Firebase (`firebase login`)
✅ Functions build successfully (`cd functions && npm run build`)

## Quick Deploy

Deploy everything (functions, hosting, firestore):
```bash
npm run deploy
```

Or deploy just functions:
```bash
npm run deploy:functions
```

## Step-by-Step Deployment

### 1. Verify You're Logged In

```bash
firebase login
```

If not logged in, this will open a browser for authentication.

### 2. Check Your Project

```bash
firebase projects:list
firebase use teletext-eacd0
```

### 3. Build Functions

```bash
cd functions
npm install
npm run build
cd ..
```

### 4. Configure Environment Variables (Optional)

If you want to use external APIs (News, Sports, Weather, etc.):

```bash
./scripts/configure-functions-env.sh
```

Or manually set them:

```bash
# News API
firebase functions:config:set news.api_key="YOUR_NEWS_API_KEY"

# Sports API (optional)
firebase functions:config:set sports.api_key="YOUR_SPORTS_API_KEY"

# Alpha Vantage for stocks (optional)
firebase functions:config:set markets.alpha_vantage_key="YOUR_ALPHA_VANTAGE_KEY"

# OpenWeather (optional)
firebase functions:config:set weather.api_key="YOUR_OPENWEATHER_KEY"

# CoinGecko (optional)
firebase functions:config:set coingecko.api_key="YOUR_COINGECKO_KEY"
```

View current config:
```bash
firebase functions:config:get
```

### 5. Deploy Functions

Deploy only functions:
```bash
firebase deploy --only functions
```

Or deploy everything:
```bash
firebase deploy
```

### 6. Verify Deployment

After deployment, you'll see URLs like:
```
✔  functions[getPage(us-central1)] https://getpage-xxxxx-uc.a.run.app
```

Test the function:
```bash
curl https://getpage-xxxxx-uc.a.run.app/100
```

### 7. Update Next.js API Route

Update the production URL in `app/api/page/[pageNumber]/route.ts`:

```typescript
const functionUrl = isDevelopment
  ? `http://127.0.0.1:5001/teletext-eacd0/us-central1/getPage/${pageNumber}`
  : `https://YOUR-ACTUAL-FUNCTION-URL/${pageNumber}`;
```

## Deployment Options

### Deploy Specific Services

```bash
# Functions only
firebase deploy --only functions

# Hosting only
firebase deploy --only hosting

# Firestore rules only
firebase deploy --only firestore

# Storage rules only
firebase deploy --only storage
```

### Deploy Specific Function

```bash
firebase deploy --only functions:getPage
```

## Environment Variables

### For Local Development (Emulator)

Create `functions/.env.local`:
```bash
NEWS_API_KEY=your_key_here
SPORTS_API_KEY=your_key_here
OPENWEATHER_API_KEY=your_key_here
ALPHA_VANTAGE_API_KEY=your_key_here
COINGECKO_API_KEY=your_key_here
```

### For Production (Cloud Functions)

Use Firebase config:
```bash
firebase functions:config:set service.api_key="value"
```

## Troubleshooting

### Build Errors

```bash
cd functions
npm run build
```

If you see TypeScript errors, they should all be fixed now. If not, check:
- All imports are correct
- No `this.` calls to non-existent methods
- All type annotations are present

### Deployment Fails

1. **Check billing**: Cloud Functions requires Blaze (pay-as-you-go) plan
   ```bash
   firebase projects:list
   ```

2. **Check permissions**: Ensure you have deploy permissions
   ```bash
   firebase login --reauth
   ```

3. **Check Node version**: Functions require Node 20
   ```bash
   node --version
   ```

### Function Timeout

If functions timeout, increase timeout in `functions/src/index.ts`:
```typescript
export const getPage = onRequest({
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (request, response) => {
  // ...
});
```

### CORS Issues

CORS is already configured in the functions. If you still have issues:
```typescript
response.set('Access-Control-Allow-Origin', '*');
```

## Monitoring

### View Logs

```bash
# All logs
firebase functions:log

# Specific function
firebase functions:log --only getPage

# Follow logs in real-time
firebase functions:log --follow
```

### Firebase Console

View detailed metrics at:
https://console.firebase.google.com/project/teletext-eacd0/functions

## Cost Optimization

Functions are billed based on:
- Number of invocations
- Execution time
- Memory allocated

Tips to reduce costs:
1. Use caching for API responses
2. Set appropriate timeout values
3. Use minimum required memory (256MB is usually enough)
4. Implement rate limiting

Current configuration:
- Memory: 256MB (default)
- Timeout: 60s (default)
- Region: us-central1

## CI/CD Integration

For automated deployments, use GitHub Actions:

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm ci
      - run: cd functions && npm ci && npm run build
      - uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Post-Deployment Checklist

- [ ] Functions deployed successfully
- [ ] Test function URLs work
- [ ] Update production URL in Next.js
- [ ] Deploy Next.js app
- [ ] Test end-to-end functionality
- [ ] Check Firebase Console for errors
- [ ] Monitor costs in first 24 hours

## Quick Commands Reference

```bash
# Login
firebase login

# List projects
firebase projects:list

# Switch project
firebase use teletext-eacd0

# Build functions
cd functions && npm run build && cd ..

# Deploy functions
firebase deploy --only functions

# View logs
firebase functions:log

# View config
firebase functions:config:get

# Set config
firebase functions:config:set key="value"

# Delete config
firebase functions:config:unset key
```

## Support

- Firebase Documentation: https://firebase.google.com/docs/functions
- Firebase Console: https://console.firebase.google.com
- Pricing: https://firebase.google.com/pricing

---

Ready to deploy? Run:
```bash
npm run deploy:functions
```
