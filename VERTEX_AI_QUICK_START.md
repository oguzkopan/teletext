# Vertex AI Deployment - Quick Start

## The Problem
Page 500 works locally but shows "AI service temporarily unavailable" in production.

## The Solution (One Command)

Run this automated fix script:

```bash
./scripts/fix-vertex-ai-deployment.sh
```

This script will:
1. ✅ Enable Vertex AI API
2. ✅ Grant service account permissions
3. ✅ Verify configuration
4. ✅ Offer to deploy

## Manual Fix (If You Prefer)

### Step 1: Enable API
```bash
gcloud services enable aiplatform.googleapis.com
```

### Step 2: Grant Permissions
```bash
# Service account for Firebase App Hosting
gcloud projects add-iam-policy-binding teletext-eacd0 \
  --member="serviceAccount:firebase-app-hosting-compute@teletext-eacd0.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### Step 3: Deploy
```bash
git add .
git commit -m "Fix Vertex AI deployment"
git push
```

## Verify It Works

After deployment, check the health endpoint:

```bash
curl https://your-app-url/api/vertex-ai-health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Vertex AI is configured correctly and responding"
}
```

## What Was Changed

1. **lib/adapters/AIAdapter.ts** - Better error handling and logging
2. **apphosting.yaml** - Added proper environment variables
3. **New health check endpoint** - `/api/vertex-ai-health`
4. **New verification scripts** - Automated testing and fixing

## Need More Help?

- **Quick Reference**: `FIX_VERTEX_AI_NOW.md`
- **Detailed Guide**: `VERTEX_AI_DEPLOYMENT_COMPLETE_FIX.md`
- **Summary of Changes**: `VERTEX_AI_FIX_SUMMARY.md`

## Troubleshooting

If the automated script fails, run the verification script:

```bash
./scripts/verify-vertex-ai-setup.sh
```

This will diagnose the issue and offer to fix it.

---

**TL;DR**: Run `./scripts/fix-vertex-ai-deployment.sh` and follow the prompts. Done! 🎉
