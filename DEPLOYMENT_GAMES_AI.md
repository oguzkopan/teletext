# Deployment Guide - Games AI Generation

## Summary of Changes

Fixed pages 600, 610, 620, 630, and 640 to use **real-time AI generation** instead of static mock data.

## Files Modified

### 1. `lib/page-registry.ts`
- **Removed** static registrations for pages 620, 630, 640
- **Removed** unused imports
- These pages now route through Firebase Functions

### 2. `functions/src/index.ts`
- **Added** query parameter extraction and passing to adapters
- Enables session state and other parameters to flow through

### 3. Documentation
- Created `GAMES_AI_GENERATION_FIX.md` - Technical details
- Created `TESTING_GAMES_AI.md` - Testing guide
- Created `DEPLOYMENT_GAMES_AI.md` - This file

## Deployment Steps

### Step 1: Verify Local Testing
```bash
# Start emulator
npm run emulator

# In another terminal, start dev server
npm run dev

# Test pages 620, 630, 640
# Verify they show different content on reload
```

### Step 2: Build and Test
```bash
# Build functions
npm run build --prefix functions

# Build Next.js app
npm run build

# Verify no errors
```

### Step 3: Deploy Functions First
```bash
# Deploy Firebase Functions
firebase deploy --only functions

# Wait for deployment to complete
# Verify functions are deployed:
# - getPage
# - processAI
# - deleteConversation
```

### Step 4: Deploy Hosting
```bash
# Deploy Next.js app to Firebase Hosting
firebase deploy --only hosting

# Or use the deployment script
npm run deploy:hosting
```

### Step 5: Verify Production
1. Visit your production URL
2. Navigate to page 620 → Reload → Should show different facts
3. Navigate to page 630 → Reload → Should show different anagrams
4. Navigate to page 640 → Reload → Should show different math problems

## Environment Variables

### Required for Production
Ensure these are set in Firebase Functions:

```bash
# Set via Firebase CLI
firebase functions:config:set vertex.location="us-central1"

# Or in Firebase Console → Functions → Configuration
VERTEX_LOCATION=us-central1
```

**Note:** `GOOGLE_CLOUD_PROJECT` is automatically set by Firebase.

### Verify Configuration
```bash
# Check current config
firebase functions:config:get
```

## Rollback Plan

If issues occur in production:

### Option 1: Quick Rollback (Restore Static Pages)
```bash
# Revert lib/page-registry.ts
git revert <commit-hash>

# Redeploy hosting only
firebase deploy --only hosting
```

### Option 2: Full Rollback
```bash
# Revert all changes
git revert <commit-hash>

# Redeploy everything
firebase deploy
```

## Monitoring

### Check Function Logs
```bash
# View real-time logs
firebase functions:log --only getPage

# Or in Firebase Console
# Functions → getPage → Logs
```

### Check for Errors
Look for:
- `Error generating AI questions`
- `No response from AI`
- `Invalid question format from AI`

### Performance Metrics
Monitor in Firebase Console:
- Function execution time (should be 1-5 seconds)
- Error rate (should be < 1%)
- Invocation count

## Cost Considerations

### Vertex AI Costs
- **Model:** Gemini 1.5 Flash (cost-effective)
- **Estimated cost per request:** ~$0.0001-0.0005
- **Monthly estimate (1000 users, 10 games each):** ~$1-5

### Firebase Functions Costs
- **Invocations:** Free tier covers most usage
- **Compute time:** Minimal (1-5 seconds per request)
- **Network egress:** Minimal

### Optimization Tips
1. Implement caching for generated content (future enhancement)
2. Use fallback mechanisms to reduce AI calls
3. Monitor usage and adjust as needed

## Success Metrics

After deployment, verify:

✅ Pages 620, 630, 640 show dynamic content
✅ No increase in error rates
✅ Function execution time < 5 seconds
✅ User engagement increases (different content each visit)
✅ No cost spikes

## Support

### If AI Generation Fails
The system has fallback mechanisms:
- **Page 601:** Falls back to Open Trivia Database
- **Page 620:** Falls back to curated facts
- **Page 630/640:** Shows error page (graceful degradation)

### Common Issues

**Issue:** "Service Unavailable" on pages 630/640
**Solution:** Check Vertex AI is enabled in Google Cloud Console

**Issue:** Same content every time
**Solution:** Clear CDN cache, verify functions are deployed

**Issue:** Slow loading
**Solution:** Normal for first request (cold start), subsequent requests faster

## Next Steps (Future Enhancements)

1. **Caching:** Cache AI-generated content for 5-10 minutes
2. **Difficulty Levels:** Allow users to select easy/medium/hard
3. **Categories:** Let users choose question categories
4. **Leaderboards:** Track high scores across users
5. **Daily Challenges:** Generate and cache one challenge per day

## Verification Commands

```bash
# Check deployment status
firebase deploy:status

# Test production endpoint
curl https://your-app.web.app/api/page/630

# Check function health
firebase functions:log --only getPage --limit 10
```

## Contact

For issues or questions:
- Check Firebase Console logs
- Review `GAMES_AI_GENERATION_FIX.md` for technical details
- Review `TESTING_GAMES_AI.md` for testing procedures
