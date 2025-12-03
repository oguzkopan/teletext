# Vertex AI Deployment Fix - Complete Guide

## Problem
Page 500 (AI Oracle Chat) works in local development but fails in Firebase App Hosting deployment with the error:
```
"AI service temporarily unavailable. Please try again later."
```

## Root Cause
The Vertex AI API requires:
1. **API to be enabled** in Google Cloud Console
2. **Service account permissions** for the App Hosting service account
3. **Environment variables** properly configured in apphosting.yaml

## Solution

### Step 1: Enable Vertex AI API

Run the verification script to check and enable the API:

```bash
./scripts/verify-vertex-ai-setup.sh
```

Or manually enable it:

```bash
# Set your project
gcloud config set project teletext-eacd0

# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com
```

### Step 2: Grant Service Account Permissions

The App Hosting service account needs the Vertex AI User role:

```bash
# Grant Vertex AI User role to App Hosting service account
gcloud projects add-iam-policy-binding teletext-eacd0 \
  --member="serviceAccount:firebase-app-hosting-compute@teletext-eacd0.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### Step 3: Verify Environment Variables

The `apphosting.yaml` has been updated with the correct environment variables:

```yaml
# Google Cloud Configuration (for Vertex AI)
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

### Step 4: Test Locally

Before deploying, test that Vertex AI works locally:

```bash
# Test with environment variables
export $(cat .env.local | grep -v '^#' | xargs)
node scripts/test-vertex-ai-deployment.js
```

Expected output:
```
✅ All tests passed!
   Vertex AI is configured correctly
```

### Step 5: Deploy

After completing steps 1-3, deploy your application:

```bash
git add .
git commit -m "Fix Vertex AI deployment configuration"
git push
```

### Step 6: Verify in Production

After deployment completes:

1. Go to your deployed app
2. Navigate to page 500 (AI Oracle Chat)
3. Type a question and press ENTER
4. You should see an AI-generated response

### Troubleshooting

#### Check Deployment Logs

View logs in Firebase Console or via CLI:

```bash
# View recent logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50 --format json
```

Look for these log messages:
- `[AIAdapter] Initialized with:` - Shows configuration
- `[AIAdapter] Calling Vertex AI...` - Shows API call attempt
- `[AIAdapter] AI response received successfully` - Shows success

#### Common Errors

**Error: "403 Permission Denied"**
- Solution: Run step 2 to grant service account permissions

**Error: "404 Not Found"**
- Solution: Check that the project ID is correct in apphosting.yaml
- Verify the model name is correct (gemini-2.0-flash-exp)

**Error: "API not enabled"**
- Solution: Run step 1 to enable the Vertex AI API

**Error: "GOOGLE_CLOUD_PROJECT environment variable is not set"**
- Solution: Verify apphosting.yaml has the correct environment variables
- Redeploy after updating apphosting.yaml

#### Manual Verification

Check if the API is enabled:

```bash
gcloud services list --enabled --filter="name:aiplatform.googleapis.com"
```

Check service account permissions:

```bash
gcloud projects get-iam-policy teletext-eacd0 \
  --flatten="bindings[].members" \
  --filter="bindings.members:firebase-app-hosting-compute@teletext-eacd0.iam.gserviceaccount.com"
```

## Changes Made

### 1. Updated AIAdapter.ts
- Added better error logging and diagnostics
- Added environment variable validation
- Added specific error messages for different failure scenarios
- Added configuration logging on initialization

### 2. Updated apphosting.yaml
- Added GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION to both BUILD and RUNTIME
- Added VERTEX_PROJECT_ID and VERTEX_LOCATION for compatibility
- Ensured all Vertex AI environment variables are properly configured

### 3. Created Verification Scripts
- `scripts/verify-vertex-ai-setup.sh` - Automated setup verification and fixing
- `scripts/test-vertex-ai-deployment.js` - Test Vertex AI configuration locally

## Testing

### Local Testing
```bash
# Test Vertex AI configuration
export $(cat .env.local | grep -v '^#' | xargs)
node scripts/test-vertex-ai-deployment.js

# Test page 500 in development
npm run dev
# Navigate to http://localhost:3000 and go to page 500
```

### Production Testing
```bash
# After deployment, test the live endpoint
curl "https://your-app-url.web.app/api/page/500?question=Hello"
```

## Summary

The issue was caused by missing Vertex AI API enablement and service account permissions in the Firebase App Hosting environment. The fix involves:

1. ✅ Enabling the Vertex AI API
2. ✅ Granting the App Hosting service account the Vertex AI User role
3. ✅ Ensuring environment variables are properly configured
4. ✅ Adding better error logging and diagnostics

After applying these fixes, page 500 should work correctly in production.
