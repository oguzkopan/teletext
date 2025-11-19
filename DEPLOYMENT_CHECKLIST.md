# Production Deployment Checklist

Use this checklist to ensure all steps are completed before deploying to production.

## Pre-Deployment Checklist

### 1. Code Quality & Testing

- [ ] All unit tests passing (`npm test`)
- [ ] All Cloud Functions tests passing (`cd functions && npm test`)
- [ ] Firestore rules tests passing (`npm run test:firestore-rules`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Code reviewed and approved
- [ ] All TODO comments addressed or documented

### 2. Environment Configuration

- [ ] `.env.production` file created with production values
- [ ] Firebase project ID verified in `.firebaserc`
- [ ] Cloud Functions environment variables configured
  ```bash
  firebase functions:config:get
  ```
- [ ] API keys obtained and tested:
  - [ ] NewsAPI key
  - [ ] Sports API key
  - [ ] Alpha Vantage key (Markets)
  - [ ] OpenWeather API key
- [ ] Google Cloud project has Vertex AI enabled
- [ ] Service account permissions verified

### 3. Firebase Configuration

- [ ] `firebase.json` configured with production settings
- [ ] Firestore security rules reviewed and tested
- [ ] Firestore indexes created (`firestore.indexes.json`)
- [ ] Storage security rules configured
- [ ] CDN caching headers configured
- [ ] CORS settings verified

### 4. Performance Optimization

- [ ] Bundle size < 200KB initial load verified
- [ ] Code splitting implemented
- [ ] Images optimized
- [ ] Service worker configured for offline support
- [ ] Page preloading enabled for critical pages
- [ ] Request cancellation implemented
- [ ] Debouncing configured for inputs

### 5. Security

- [ ] Firestore rules restrict write access appropriately
- [ ] Storage rules prevent unauthorized uploads
- [ ] API keys not exposed in client code
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] XSS protection enabled
- [ ] HTTPS enforced
- [ ] Security headers configured (X-Frame-Options, etc.)

### 6. Monitoring & Analytics

- [ ] Firebase Analytics enabled
- [ ] Firebase Performance Monitoring enabled
- [ ] Custom performance traces implemented
- [ ] Error logging configured
- [ ] Alerts configured for:
  - [ ] Error rate > 5%
  - [ ] Response time p95 > 1000ms
  - [ ] Function failures
  - [ ] Quota limits at 80%

### 7. Documentation

- [ ] README.md updated with production URLs
- [ ] API documentation complete
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] Architecture diagrams up to date

### 8. Build Verification

- [ ] Next.js build succeeds locally
  ```bash
  npm run build
  ```
- [ ] Cloud Functions build succeeds
  ```bash
  cd functions && npm run build
  ```
- [ ] Static export generated correctly (if using)
- [ ] No build warnings that need addressing

## Deployment Steps

### Step 1: Final Testing

```bash
# Run all tests
npm test
cd functions && npm test && cd ..
npm run test:firestore-rules
```

### Step 2: Build Application

```bash
# Build Next.js
npm run build

# Build Cloud Functions
cd functions && npm run build && cd ..
```

### Step 3: Deploy Infrastructure

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage
```

### Step 4: Deploy Functions

```bash
# Deploy Cloud Functions
firebase deploy --only functions
```

### Step 5: Deploy Hosting

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Step 6: Verify Deployment

- [ ] Production URL accessible: https://teletext-eacd0.web.app/
- [ ] Functions URL accessible: https://us-central1-teletext-eacd0.cloudfunctions.net/
- [ ] Page 100 (index) loads correctly
- [ ] Navigation works (test pages: 100, 200, 300, 400, 500, 600, 700, 800)
- [ ] API endpoints respond correctly
- [ ] Firestore caching works
- [ ] Service worker registers successfully
- [ ] Offline mode works
- [ ] Performance metrics appear in Firebase Console

## Post-Deployment Checklist

### Immediate Verification (0-15 minutes)

- [ ] Homepage loads without errors
- [ ] All critical pages accessible (100, 200, 300, 400, 500)
- [ ] API endpoints responding
- [ ] No console errors in browser
- [ ] Service worker registered
- [ ] Analytics tracking events
- [ ] Performance traces appearing

### Short-term Monitoring (15 minutes - 1 hour)

- [ ] Check Firebase Console for errors
- [ ] Monitor function execution logs
- [ ] Verify Firestore read/write operations
- [ ] Check API quota usage
- [ ] Monitor response times
- [ ] Verify caching behavior

### Long-term Monitoring (1 hour - 24 hours)

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify cost projections
- [ ] Monitor user analytics
- [ ] Check for any anomalies

## Testing Checklist

### Functional Testing

- [ ] **Navigation**
  - [ ] Enter page numbers (100-899)
  - [ ] Use colored buttons (RED, GREEN, YELLOW, BLUE)
  - [ ] Back button works
  - [ ] Channel up/down works
  - [ ] Invalid page numbers show error

- [ ] **Content Pages**
  - [ ] Page 100: Main index displays
  - [ ] Page 200-299: News pages load with live data
  - [ ] Page 300-399: Sports scores display
  - [ ] Page 400-499: Market data shows
  - [ ] Page 500-599: AI Oracle responds
  - [ ] Page 600-699: Games are playable
  - [ ] Page 700-799: Settings work
  - [ ] Page 800-899: Dev tools show data

- [ ] **Features**
  - [ ] Theme switching works
  - [ ] CRT effects apply correctly
  - [ ] Keyboard shortcuts work
  - [ ] On-screen remote works
  - [ ] Offline mode functions
  - [ ] Page caching works
  - [ ] Conversation history saves

- [ ] **Easter Eggs**
  - [ ] Page 404: Error page with glitch effects
  - [ ] Page 666: Horror page displays

### Performance Testing

- [ ] Lighthouse score > 90 for Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Total Blocking Time < 300ms
- [ ] Cumulative Layout Shift < 0.1
- [ ] Largest Contentful Paint < 2.5s

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Device Testing

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## Rollback Plan

If issues are discovered after deployment:

### Quick Rollback (Hosting)

```bash
# Use Firebase Console: Hosting → Release History → Rollback
# Or clone previous version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

### Function Rollback

```bash
# Checkout previous version
git checkout PREVIOUS_COMMIT

# Redeploy functions
cd functions && firebase deploy --only functions
```

### Firestore Rules Rollback

```bash
# Use Firebase Console: Firestore → Rules → View History → Restore
```

## Emergency Contacts

- **Firebase Support**: https://firebase.google.com/support
- **Project Owner**: [Your contact info]
- **Technical Lead**: [Your contact info]

## Notes

- Deployment typically takes 5-10 minutes
- DNS propagation for custom domains takes 24-48 hours
- SSL certificates provision automatically within 24-48 hours
- Monitor Firebase Console for first 24 hours after deployment

## Sign-off

- [ ] Deployment completed by: _________________ Date: _________
- [ ] Verification completed by: _________________ Date: _________
- [ ] Approved for production by: _________________ Date: _________

---

**Last Updated**: [Date]
**Deployment Version**: 1.0.0
**Firebase Project**: teletext-eacd0
