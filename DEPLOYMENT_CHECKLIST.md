# Vertex AI Deployment Checklist

Use this checklist to ensure everything is configured correctly before and after deployment.

## Pre-Deployment Checklist

### 1. Prerequisites
- [ ] gcloud CLI is installed
- [ ] Logged in to gcloud (`gcloud auth list`)
- [ ] Project is set (`gcloud config get-value project`)

### 2. Local Testing
- [ ] Run local test: `export $(cat .env.local | grep -v '^#' | xargs) && node scripts/test-vertex-ai-deployment.js`
- [ ] Test passes with "✅ All tests passed!"
- [ ] Page 500 works in local dev server (`npm run dev`)

### 3. Google Cloud Configuration
- [ ] Vertex AI API is enabled
  ```bash
  gcloud services list --enabled | grep aiplatform
  ```
- [ ] Service account has permissions
  ```bash
  # Service account for Firebase App Hosting
  gcloud projects get-iam-policy teletext-eacd0 --flatten="bindings[].members" --filter="bindings.members:firebase-app-hosting-compute@teletext-eacd0.iam.gserviceaccount.com"
  ```

### 4. Code Changes
- [ ] `lib/adapters/AIAdapter.ts` has enhanced error handling
- [ ] `apphosting.yaml` has correct environment variables:
  - [ ] `GOOGLE_CLOUD_PROJECT`
  - [ ] `GOOGLE_CLOUD_LOCATION`
  - [ ] `VERTEX_PROJECT_ID`
  - [ ] `VERTEX_LOCATION`
- [ ] `app/api/vertex-ai-health/route.ts` exists
- [ ] All changes are committed

### 5. Ready to Deploy
- [ ] All above items checked
- [ ] No uncommitted changes (or changes are committed)
- [ ] Ready to run `git push`

## Deployment

### Deploy Command
```bash
git push
```

### Monitor Deployment
- [ ] Check Firebase Console for deployment status
- [ ] Wait for deployment to complete (usually 5-10 minutes)
- [ ] Note the deployment URL

## Post-Deployment Checklist

### 1. Health Check
- [ ] Test health endpoint:
  ```bash
  curl https://your-app-url/api/vertex-ai-health
  ```
- [ ] Response shows `"status": "healthy"`
- [ ] No error messages in response

### 2. Functional Testing
- [ ] Navigate to page 500 in browser
- [ ] Type a question (e.g., "hello")
- [ ] Press ENTER
- [ ] AI response is displayed
- [ ] No error messages shown

### 3. Verify Logs
- [ ] Check deployment logs:
  ```bash
  gcloud logging read "resource.type=cloud_run_revision" --limit 20
  ```
- [ ] Look for successful initialization:
  - [ ] `[AIAdapter] Initialized with:`
  - [ ] `[AIAdapter] Calling Vertex AI...`
  - [ ] `[AIAdapter] AI response received successfully`
- [ ] No error messages in logs

### 4. Test Different Scenarios
- [ ] Test page 500 with different questions
- [ ] Test page 511-516 (pre-set questions)
- [ ] Verify responses are different for different questions
- [ ] Check response times are reasonable (< 5 seconds)

## Troubleshooting Checklist

If health check fails:

### Check API Status
- [ ] Verify API is enabled:
  ```bash
  gcloud services list --enabled | grep aiplatform
  ```
- [ ] If not enabled, run:
  ```bash
  gcloud services enable aiplatform.googleapis.com
  ```

### Check Permissions
- [ ] Verify service account has permissions:
  ```bash
  # Service account for Firebase App Hosting
  gcloud projects get-iam-policy teletext-eacd0 --flatten="bindings[].members" --filter="bindings.members:firebase-app-hosting-compute@teletext-eacd0.iam.gserviceaccount.com AND bindings.role:roles/aiplatform.user"
  ```
- [ ] If no permissions, grant them:
  ```bash
  gcloud projects add-iam-policy-binding teletext-eacd0 \
    --member="serviceAccount:firebase-app-hosting-compute@teletext-eacd0.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"
  ```

### Check Environment Variables
- [ ] Verify apphosting.yaml has correct values
- [ ] Check deployment logs for environment variable values
- [ ] Redeploy if environment variables were changed

### Check Logs for Errors
- [ ] View recent logs:
  ```bash
  gcloud logging read "resource.type=cloud_run_revision" --limit 50
  ```
- [ ] Look for error messages
- [ ] Check for specific error codes (403, 404, etc.)

## Quick Fix Commands

If something is wrong, run these:

```bash
# 1. Enable API
gcloud services enable aiplatform.googleapis.com

# 2. Grant permissions
# Service account for Firebase App Hosting
gcloud projects add-iam-policy-binding teletext-eacd0 \
  --member="serviceAccount:firebase-app-hosting-compute@teletext-eacd0.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 3. Redeploy
git push

# 4. Wait and test
sleep 300  # Wait 5 minutes
curl https://your-app-url/api/vertex-ai-health
```

## Automated Fix

If you want to automate all of this:

```bash
./scripts/fix-vertex-ai-deployment.sh
```

This script will:
- ✅ Check all prerequisites
- ✅ Enable API if needed
- ✅ Grant permissions if needed
- ✅ Verify configuration
- ✅ Offer to deploy

## Success Criteria

All of these should be true:

- ✅ Health endpoint returns `"status": "healthy"`
- ✅ Page 500 displays AI responses
- ✅ No error messages in browser
- ✅ No error messages in logs
- ✅ Response times are reasonable (< 5 seconds)
- ✅ Different questions get different responses

## Final Verification

Run this command to verify everything:

```bash
# Test health endpoint
curl https://your-app-url/api/vertex-ai-health | jq

# Expected output:
# {
#   "status": "healthy",
#   "message": "Vertex AI is configured correctly and responding"
# }
```

If you see this, you're done! 🎉

---

**Status**: Ready to deploy
**Last Updated**: December 3, 2025
