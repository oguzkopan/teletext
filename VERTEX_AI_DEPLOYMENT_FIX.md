# Vertex AI Deployment Fix

## Problem
- ✅ Vertex AI works locally
- ❌ Vertex AI fails in production (Firebase App Hosting)
- Shows fallback messages: "AI service temporarily unavailable"
- Game pages show mock questions instead of AI-generated content

## Root Cause
Vertex AI API is not enabled for the Firebase project in production, or the service account doesn't have proper permissions.

## Solution

### Step 1: Enable Vertex AI API

Run this command to enable the Vertex AI API for your project:

```bash
gcloud services enable aiplatform.googleapis.com --project=teletext-eacd0
```

Or enable it via the Google Cloud Console:
1. Go to https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=teletext-eacd0
2. Click "ENABLE"

### Step 2: Grant Vertex AI Permissions to App Hosting Service Account

Firebase App Hosting uses a service account that needs permission to call Vertex AI:

```bash
# Get the App Hosting service account
PROJECT_ID="teletext-eacd0"
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

# Grant Vertex AI User role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/aiplatform.user"
```

Or do it manually in the Cloud Console:
1. Go to https://console.cloud.google.com/iam-admin/iam?project=teletext-eacd0
2. Find the service account ending with `@developer.gserviceaccount.com`
3. Click "Edit" (pencil icon)
4. Click "ADD ANOTHER ROLE"
5. Search for "Vertex AI User"
6. Click "SAVE"

### Step 3: Verify Configuration

Check that the environment variables are set correctly in `apphosting.yaml`:

```yaml
- variable: GOOGLE_CLOUD_PROJECT
  value: teletext-eacd0
  availability:
    - RUNTIME

- variable: GOOGLE_CLOUD_LOCATION
  value: us-central1
  availability:
    - RUNTIME
```

✅ These are already configured correctly!

### Step 4: Redeploy

After enabling the API and granting permissions, redeploy your application:

```bash
# Commit any changes
git add .
git commit -m "Enable Vertex AI for production"
git push

# Or trigger a manual deployment in Firebase Console
```

### Step 5: Test in Production

After deployment, test these pages:
- **Page 500**: AI Chat - Should generate responses
- **Page 601**: Quiz - Should generate new questions
- **Page 610**: Bamboozle - Should generate new stories
- **Page 630**: Word Game - Should generate new puzzles
- **Page 640**: Math Challenge - Should generate new problems

## Quick Enable Script

Run this script to enable everything at once:

```bash
#!/bin/bash

PROJECT_ID="teletext-eacd0"

echo "🔧 Enabling Vertex AI for $PROJECT_ID..."

# Enable Vertex AI API
echo "📡 Enabling Vertex AI API..."
gcloud services enable aiplatform.googleapis.com --project=$PROJECT_ID

# Get project number
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo "👤 Service Account: $SERVICE_ACCOUNT"

# Grant Vertex AI permissions
echo "🔐 Granting Vertex AI User role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/aiplatform.user"

echo "✅ Done! Redeploy your application to apply changes."
```

Save this as `scripts/enable-vertex-ai.sh` and run:

```bash
chmod +x scripts/enable-vertex-ai.sh
./scripts/enable-vertex-ai.sh
```

## Verification

After deployment, check the logs in Firebase Console:
1. Go to https://console.firebase.google.com/project/teletext-eacd0/apphosting
2. Click on your backend
3. Check "Logs" tab
4. Look for Vertex AI errors or success messages

## Troubleshooting

### If still not working:

1. **Check API is enabled**:
   ```bash
   gcloud services list --enabled --project=teletext-eacd0 | grep aiplatform
   ```
   Should show: `aiplatform.googleapis.com`

2. **Check service account permissions**:
   ```bash
   gcloud projects get-iam-policy teletext-eacd0 \
     --flatten="bindings[].members" \
     --filter="bindings.members:*compute@developer.gserviceaccount.com"
   ```
   Should include `roles/aiplatform.user`

3. **Check logs for specific errors**:
   - Look for "403 Forbidden" → Permissions issue
   - Look for "API not enabled" → Enable the API
   - Look for "quota exceeded" → Check Vertex AI quotas

4. **Verify model name**:
   The code uses `gemini-2.0-flash-exp`. Make sure this model is available in your region (us-central1).

## Alternative: Use Different Model

If `gemini-2.0-flash-exp` is not available, update the model name in:
- `lib/adapters/AIAdapter.ts`
- `lib/adapters/GamesAdapter.ts`

Change from:
```typescript
model: 'gemini-2.0-flash-exp'
```

To:
```typescript
model: 'gemini-1.5-flash'  // or 'gemini-1.5-pro'
```

## Cost Considerations

Vertex AI Gemini pricing (as of Dec 2024):
- **Gemini 2.0 Flash**: ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens
- **Gemini 1.5 Flash**: ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens

Estimated costs for your app:
- Average response: ~200 tokens
- 1000 AI requests/day ≈ $0.06/day ≈ $1.80/month
- Very affordable for a demo/hobby project!

## Summary

The fix is simple:
1. ✅ Enable Vertex AI API
2. ✅ Grant permissions to service account
3. ✅ Redeploy

Your local environment works because you're authenticated with your personal Google Cloud credentials. Production needs the service account to have explicit permissions.
