# Vertex AI Deployment Fix - Summary

## Issue
Page 500 (AI Oracle Chat) works in local development but fails in Firebase App Hosting with:
```
"AI service temporarily unavailable. Please try again later."
```

## Root Cause
Three missing configurations in production:
1. Vertex AI API not enabled
2. App Hosting service account lacks permissions
3. Environment variables not properly configured

## Files Changed

### 1. `lib/adapters/AIAdapter.ts`
**Changes:**
- Added comprehensive error logging and diagnostics
- Added environment variable validation on initialization
- Added specific error messages for different failure types (403, 404, etc.)
- Improved error handling in `generateAIAnswer()` method
- Added configuration logging to help debug production issues

**Key improvements:**
```typescript
// Now logs configuration on initialization
console.log('[AIAdapter] Initialized with:', {
  projectId: this.projectId,
  location: this.location,
  hasGoogleCloudProject: !!process.env.GOOGLE_CLOUD_PROJECT,
  // ... more diagnostics
});

// Better error handling with specific messages
if (errorMessage.includes('403') || errorMessage.includes('permission')) {
  return 'AI service configuration error. Please contact administrator.';
}
```

### 2. `apphosting.yaml`
**Changes:**
- Added `GOOGLE_CLOUD_PROJECT` to both BUILD and RUNTIME availability
- Added `GOOGLE_CLOUD_LOCATION` to both BUILD and RUNTIME availability
- Added `VERTEX_PROJECT_ID` for compatibility
- Added `VERTEX_LOCATION` for compatibility

**Before:**
```yaml
- variable: GOOGLE_CLOUD_PROJECT
  value: teletext-eacd0
  availability:
    - RUNTIME
```

**After:**
```yaml
- variable: GOOGLE_CLOUD_PROJECT
  value: teletext-eacd0
  availability:
    - BUILD
    - RUNTIME

- variable: GOOGLE_CLOUD_LOCATION
  value: us-central1
  availability:
    - BUILD
    - RUNTIME

- variable: VERTEX_PROJECT_ID
  value: teletext-eacd0
  availability:
    - RUNTIME

- variable: VERTEX_LOCATION
  value: us-central1
  availability:
    - RUNTIME
```

### 3. New Files Created

#### `scripts/verify-vertex-ai-setup.sh`
Automated script to:
- Check if gcloud CLI is installed
- Verify Vertex AI API is enabled (offers to enable if not)
- Check service account permissions (offers to grant if missing)
- Provide step-by-step guidance

Usage:
```bash
./scripts/verify-vertex-ai-setup.sh
```

#### `scripts/test-vertex-ai-deployment.js`
Test script to verify Vertex AI configuration locally:
- Checks environment variables
- Tests Vertex AI initialization
- Makes a test API call
- Reports detailed diagnostics

Usage:
```bash
export $(cat .env.local | grep -v '^#' | xargs)
node scripts/test-vertex-ai-deployment.js
```

#### `app/api/vertex-ai-health/route.ts`
Health check endpoint for production:
- Tests Vertex AI configuration in deployed environment
- Returns detailed diagnostics
- Provides specific error messages and solutions

Usage:
```bash
curl https://your-app-url/api/vertex-ai-health
```

#### Documentation Files
- `VERTEX_AI_DEPLOYMENT_COMPLETE_FIX.md` - Comprehensive guide
- `FIX_VERTEX_AI_NOW.md` - Quick reference with commands
- `VERTEX_AI_FIX_SUMMARY.md` - This file

## Required Actions

### 1. Enable Vertex AI API
```bash
gcloud config set project teletext-eacd0
gcloud services enable aiplatform.googleapis.com
```

### 2. Grant Service Account Permissions
```bash
# Service account for Firebase App Hosting
gcloud projects add-iam-policy-binding teletext-eacd0 \
  --member="serviceAccount:firebase-app-hosting-compute@teletext-eacd0.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### 3. Deploy
```bash
git add .
git commit -m "Fix Vertex AI deployment configuration"
git push
```

## Verification

### Before Deployment (Local)
```bash
# Test Vertex AI locally
export $(cat .env.local | grep -v '^#' | xargs)
node scripts/test-vertex-ai-deployment.js
```

Expected output:
```
✅ All tests passed!
   Vertex AI is configured correctly
```

### After Deployment (Production)
```bash
# Test health endpoint
curl https://your-app-url/api/vertex-ai-health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Vertex AI is configured correctly and responding"
}
```

Or test page 500 directly in the browser.

## Troubleshooting

### Check Logs
```bash
# View deployment logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50
```

Look for:
- `[AIAdapter] Initialized with:` - Configuration info
- `[AIAdapter] Calling Vertex AI...` - API call attempt
- `[AIAdapter] AI response received successfully` - Success
- `[AIAdapter] AI generation failed:` - Error details

### Common Issues

**"403 Permission Denied"**
- Run: `./scripts/verify-vertex-ai-setup.sh`
- Or manually grant permissions (see step 2 above)

**"404 Not Found"**
- Verify project ID in apphosting.yaml
- Check model name is correct

**"API not enabled"**
- Run: `gcloud services enable aiplatform.googleapis.com`

## Testing Checklist

- [ ] Local test passes: `node scripts/test-vertex-ai-deployment.js`
- [ ] Vertex AI API is enabled
- [ ] Service account has permissions
- [ ] Environment variables in apphosting.yaml are correct
- [ ] Code changes committed and pushed
- [ ] Deployment completed successfully
- [ ] Health check endpoint returns "healthy"
- [ ] Page 500 works in production

## Summary

The fix involves three components:

1. **Code Changes** - Better error handling and logging in AIAdapter
2. **Configuration** - Proper environment variables in apphosting.yaml
3. **Infrastructure** - Enable API and grant permissions

After applying all three, page 500 will work correctly in production.

## Quick Commands Reference

```bash
# 1. Enable API
gcloud services enable aiplatform.googleapis.com

# 2. Grant permissions
# Service account for Firebase App Hosting
gcloud projects add-iam-policy-binding teletext-eacd0 \
  --member="serviceAccount:firebase-app-hosting-compute@teletext-eacd0.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 3. Deploy
git add .
git commit -m "Fix Vertex AI deployment"
git push

# 4. Verify
curl https://your-app-url/api/vertex-ai-health
```

Done! 🎉
