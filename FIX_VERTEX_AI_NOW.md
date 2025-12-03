# Quick Fix for Vertex AI Deployment Issue

## The Problem
Page 500 works locally but shows "AI service temporarily unavailable" in production.

## The Fix (Run These Commands)

### 1. Enable Vertex AI API
```bash
gcloud config set project teletext-eacd0
gcloud services enable aiplatform.googleapis.com
```

### 2. Grant Permissions to App Hosting Service Account
```bash
# Grant Vertex AI User role
gcloud projects add-iam-policy-binding teletext-eacd0 \
  --member="serviceAccount:firebase-app-hosting-compute@teletext-eacd0.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### 3. Deploy
```bash
git add .
git commit -m "Fix Vertex AI deployment - enable API and grant permissions"
git push
```

## That's It!

After running these commands and deploying, page 500 should work in production.

## Verify It Works

### Option 1: Health Check Endpoint (Fastest)
```bash
# Replace with your actual deployment URL
curl https://teletextwebapp--teletext-eacd0.us-central1.hosted.app/api/vertex-ai-health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Vertex AI is configured correctly and responding"
}
```

### Option 2: Test Page 500
After deployment:
1. Go to your deployed app
2. Navigate to page 500
3. Type "hello" and press ENTER
4. You should see an AI response

## If It Still Doesn't Work

Run the automated verification script:
```bash
./scripts/verify-vertex-ai-setup.sh
```

This will check everything and offer to fix any issues automatically.

## What Changed

1. ✅ Updated `lib/adapters/AIAdapter.ts` with better error logging
2. ✅ Updated `apphosting.yaml` with correct environment variables
3. ✅ Created verification scripts to help diagnose issues

See `VERTEX_AI_DEPLOYMENT_COMPLETE_FIX.md` for detailed explanation.
