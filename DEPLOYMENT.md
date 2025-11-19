# Modern Teletext - Production Deployment Guide

This guide covers deploying the Modern Teletext application to Firebase with production-ready configuration.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created (project ID: `your-project-id`)
- Node.js 18+ installed
- All API keys obtained (News, Sports, Markets, Weather)
- Google Cloud project with Vertex AI enabled

## Table of Contents

1. [Environment Configuration](#environment-configuration)
2. [Firebase App Hosting Setup](#firebase-app-hosting-setup)
3. [Cloud Functions Configuration](#cloud-functions-configuration)
4. [Firestore & Storage Deployment](#firestore--storage-deployment)
5. [Performance Monitoring](#performance-monitoring)
6. [Custom Domain Setup](#custom-domain-setup)
7. [CDN & Caching Configuration](#cdn--caching-configuration)
8. [Deployment Process](#deployment-process)
9. [Post-Deployment Testing](#post-deployment-testing)
10. [Rollback Procedures](#rollback-procedures)

---

## Environment Configuration

### 1. Production Environment Variables

Create a `.env.production` file (DO NOT commit to git):

```bash
# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

# Node Environment
NODE_ENV=production

# API Base URL (update after deployment)
NEXT_PUBLIC_API_BASE_URL=https://us-central1-your-project-id.cloudfunctions.net
```

### 2. Firebase Functions Environment Variables

Set Cloud Functions environment variables using Firebase CLI:

```bash
# Navigate to functions directory
cd functions

# Set production environment variables
firebase functions:config:set \
  google.project_id="your-project-id" \
  google.location="us-central1" \
  news.api_key="YOUR_NEWS_API_KEY" \
  sports.api_key="YOUR_SPORTS_API_KEY" \
  markets.alpha_vantage_key="YOUR_ALPHA_VANTAGE_KEY" \
  weather.api_key="YOUR_OPENWEATHER_KEY"

# View current configuration
firebase functions:config:get
```

### 3. Service Account Setup

For Firebase Admin SDK in Cloud Functions:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely (DO NOT commit to git)
4. The Cloud Functions will automatically use the default service account

---

## Firebase App Hosting Setup

### Option 1: Firebase Hosting (Static Export)

Update `next.config.js` to enable static export:

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // ... rest of config
}
```

Build and deploy:

```bash
# Build Next.js app for static export
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Option 2: Cloud Run (SSR Support)

For server-side rendering capabilities:

1. Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. Deploy to Cloud Run:

```bash
# Build and deploy
gcloud run deploy modern-teletext \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --project your-project-id
```

---

## Cloud Functions Configuration

### 1. Production Region Configuration

Update `functions/src/index.ts` to specify production region:

```typescript
import { setGlobalOptions } from 'firebase-functions/v2';

// Set global options for all functions
setGlobalOptions({
  region: 'us-central1',
  maxInstances: 100,
  timeoutSeconds: 60,
  memory: '512MiB',
});
```

### 2. Deploy Cloud Functions

```bash
cd functions

# Install dependencies
npm install

# Build TypeScript
npm run build

# Deploy all functions
firebase deploy --only functions

# Or deploy specific functions
firebase deploy --only functions:getPage
firebase deploy --only functions:processAI
```

### 3. Function Configuration

Ensure functions are configured for production:

- **Memory**: 512MB (AI functions may need 1GB)
- **Timeout**: 60 seconds (AI functions may need 120s)
- **Max Instances**: 100 (adjust based on expected traffic)
- **Min Instances**: 0 (set to 1-2 for critical functions to reduce cold starts)

---

## Firestore & Storage Deployment

### 1. Deploy Firestore Rules

```bash
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

### 2. Deploy Storage Rules

```bash
# Deploy Storage security rules
firebase deploy --only storage
```

### 3. Verify Rules

Test security rules using Firebase Console:
- Go to Firestore → Rules
- Use the Rules Playground to test read/write operations
- Verify that public read access works for `pages_cache`
- Verify that user-specific access works for `conversations` and `user_preferences`

---

## Performance Monitoring

### 1. Enable Firebase Performance Monitoring

Add Performance Monitoring to `lib/firebase-client.ts`:

```typescript
import { getPerformance } from 'firebase/performance';

// Initialize Performance Monitoring
if (typeof window !== 'undefined') {
  const perf = getPerformance(app);
}
```

### 2. Add Custom Traces

Create `lib/performance-traces.ts`:

```typescript
import { getPerformance, trace } from 'firebase/performance';

export async function tracePageLoad(pageId: string, fn: () => Promise<any>) {
  const perf = getPerformance();
  const pageTrace = trace(perf, `page_load_${pageId}`);
  
  pageTrace.start();
  try {
    const result = await fn();
    pageTrace.stop();
    return result;
  } catch (error) {
    pageTrace.stop();
    throw error;
  }
}

export async function traceAPICall(endpoint: string, fn: () => Promise<any>) {
  const perf = getPerformance();
  const apiTrace = trace(perf, `api_${endpoint}`);
  
  apiTrace.start();
  try {
    const result = await fn();
    apiTrace.stop();
    return result;
  } catch (error) {
    apiTrace.stop();
    throw error;
  }
}
```

### 3. Monitor in Firebase Console

- Go to Firebase Console → Performance
- View page load times, API response times, and custom traces
- Set up alerts for performance degradation

---

## Custom Domain Setup

### 1. Add Custom Domain

```bash
# Add custom domain via Firebase CLI
firebase hosting:channel:deploy production --only hosting

# Or use Firebase Console:
# 1. Go to Hosting → Add custom domain
# 2. Enter your domain (e.g., deadtext.app)
# 3. Follow DNS verification steps
```

### 2. DNS Configuration

Add these DNS records to your domain provider:

```
Type: A
Name: @
Value: 151.101.1.195
Value: 151.101.65.195

Type: AAAA
Name: @
Value: 2a04:4e42::645
Value: 2a04:4e42:200::645

Type: TXT
Name: @
Value: [Firebase verification code]
```

### 3. SSL Certificate

Firebase automatically provisions SSL certificates via Let's Encrypt.
- Certificate provisioning takes 24-48 hours
- Automatic renewal every 90 days

---

## CDN & Caching Configuration

### 1. Update `firebase.json` for Caching

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|avif)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "sw.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, must-revalidate"
          },
          {
            "key": "Service-Worker-Allowed",
            "value": "/"
          }
        ]
      },
      {
        "source": "**/*.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600, must-revalidate"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 2. Cloud Functions Caching

Implement caching headers in Cloud Functions:

```typescript
export const getPage = onRequest(async (req, res) => {
  // Set cache headers
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  
  // ... rest of function
});
```

### 3. Firestore Caching Strategy

- **Static pages (100-199)**: Cache indefinitely
- **News (200-299)**: 5 minutes TTL
- **Sports (300-399)**: 2 minutes TTL (1 minute during live events)
- **Markets (400-499)**: 1 minute TTL
- **AI responses (500-599)**: Session duration
- **Games (600-699)**: 10 minutes TTL
- **Settings (700-799)**: Cache indefinitely
- **Dev tools (800-899)**: No cache

---

## Deployment Process

### Complete Deployment Checklist

#### Pre-Deployment

- [ ] All tests passing (`npm test` and `cd functions && npm test`)
- [ ] Environment variables configured
- [ ] API keys obtained and tested
- [ ] Service account credentials secured
- [ ] Build succeeds locally (`npm run build`)
- [ ] Functions build succeeds (`cd functions && npm run build`)

#### Deployment Steps

```bash
# 1. Build the Next.js application
npm run build

# 2. Deploy Firestore rules and indexes
firebase deploy --only firestore

# 3. Deploy Storage rules
firebase deploy --only storage

# 4. Deploy Cloud Functions
firebase deploy --only functions

# 5. Deploy Hosting
firebase deploy --only hosting

# Or deploy everything at once
firebase deploy
```

#### Post-Deployment

- [ ] Verify hosting URL is accessible
- [ ] Test page navigation (100, 200, 300, etc.)
- [ ] Test API endpoints
- [ ] Verify Firestore caching works
- [ ] Check Performance Monitoring dashboard
- [ ] Test on multiple devices/browsers
- [ ] Verify service worker registration
- [ ] Test offline functionality
- [ ] Check error logging in Firebase Console

---

## Post-Deployment Testing

### 1. Smoke Tests

```bash
# Test main index page
curl https://your-project-id.web.app/

# Test API endpoint
curl https://us-central1-your-project-id.cloudfunctions.net/getPage?id=100

# Test AI endpoint
curl -X POST https://us-central1-your-project-id.cloudfunctions.net/processAI \
  -H "Content-Type: application/json" \
  -d '{"mode":"qa","parameters":{"topic":"test"}}'
```

### 2. Manual Testing Checklist

- [ ] Page 100 (index) loads correctly
- [ ] Navigation works (enter page numbers)
- [ ] Colored buttons navigate correctly
- [ ] News pages (200-299) display live data
- [ ] Sports pages (300-399) display live scores
- [ ] Markets pages (400-499) display prices
- [ ] AI Oracle (500-599) responds correctly
- [ ] Games (600-699) are playable
- [ ] Settings (700-799) persist changes
- [ ] Dev tools (800-899) show JSON data
- [ ] Easter eggs work (404, 666)
- [ ] Themes switch correctly
- [ ] CRT effects apply correctly
- [ ] Offline mode works
- [ ] Service worker caches pages

### 3. Performance Testing

Use Lighthouse to verify:
- Performance score > 90
- Accessibility score > 95
- Best Practices score > 90
- SEO score > 90

```bash
# Run Lighthouse
npx lighthouse https://your-project-id.web.app/ --view
```

### 4. Load Testing

Use Apache Bench or similar:

```bash
# Test 1000 requests with 10 concurrent connections
ab -n 1000 -c 10 https://your-project-id.web.app/
```

---

## Rollback Procedures

### 1. Rollback Hosting

```bash
# List previous releases
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live

# Or use Firebase Console:
# Hosting → Release History → Rollback
```

### 2. Rollback Functions

```bash
# Deploy previous version
firebase deploy --only functions --version PREVIOUS_VERSION

# Or redeploy from previous git commit
git checkout PREVIOUS_COMMIT
cd functions && npm run deploy
```

### 3. Rollback Firestore Rules

```bash
# Use Firebase Console:
# Firestore → Rules → View History → Restore
```

---

## Monitoring & Alerts

### 1. Set Up Alerts

Configure alerts in Firebase Console:

- **Error Rate**: Alert if error rate > 5%
- **Response Time**: Alert if p95 > 1000ms
- **Function Failures**: Alert on any function failures
- **Quota Limits**: Alert at 80% of quota

### 2. Logging

View logs:

```bash
# View function logs
firebase functions:log

# View specific function
firebase functions:log --only getPage

# View logs in Cloud Console
gcloud logging read "resource.type=cloud_function" --limit 50 --project your-project-id
```

### 3. Analytics

Monitor in Firebase Console:
- **Analytics**: User engagement, page views
- **Performance**: Page load times, API latency
- **Crashlytics**: Error tracking (if enabled)

---

## Cost Optimization

### 1. Firestore Optimization

- Use caching to reduce reads
- Implement pagination for large queries
- Use TTL policies for automatic cleanup
- Monitor read/write operations

### 2. Cloud Functions Optimization

- Set appropriate memory limits
- Use min instances sparingly (only for critical functions)
- Implement request caching
- Optimize cold start times

### 3. Hosting & CDN

- Enable compression
- Use appropriate cache headers
- Optimize images and assets
- Minimize bundle size

---

## Security Checklist

- [ ] Firestore rules restrict write access
- [ ] Storage rules prevent unauthorized uploads
- [ ] API keys are not exposed in client code
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation on all endpoints
- [ ] XSS protection enabled
- [ ] HTTPS enforced
- [ ] Service account keys secured

---

## Support & Troubleshooting

### Common Issues

**Issue**: Functions timing out
- **Solution**: Increase timeout in function config, optimize API calls

**Issue**: High Firestore costs
- **Solution**: Review caching strategy, implement pagination

**Issue**: Slow page loads
- **Solution**: Check bundle size, enable code splitting, optimize images

**Issue**: Service worker not updating
- **Solution**: Clear cache, check service worker registration

### Getting Help

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support
- Stack Overflow: Tag questions with `firebase` and `next.js`

---

## Deployment Complete! 🎉

Your Modern Teletext application is now live in production. Monitor the Firebase Console for performance metrics and user analytics.

**Production URL**: https://your-project-id.web.app/
**Functions URL**: https://us-central1-your-project-id.cloudfunctions.net/

Enjoy your retro teletext experience! 📺✨
