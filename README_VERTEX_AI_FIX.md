# 🚀 Fix Vertex AI Deployment Issue

## 🎯 The Problem
```
Page 500 works locally ✅
Page 500 fails in production ❌
Error: "AI service temporarily unavailable"
```

## ⚡ The Solution (30 seconds)

### Run This One Command:
```bash
./scripts/fix-vertex-ai-deployment.sh
```

That's it! The script will:
1. ✅ Enable Vertex AI API
2. ✅ Grant permissions
3. ✅ Verify everything
4. ✅ Offer to deploy

## 📋 What Happens Next

### During the Script:
```
🔧 Vertex AI Deployment Fix
================================
✅ Vertex AI API enabled
✅ Service account permissions granted
✅ Configuration verified

Would you like to deploy now? (y/n)
```

### After Deployment:
```bash
# Test it works
curl https://your-app-url/api/vertex-ai-health
```

Expected:
```json
{
  "status": "healthy",
  "message": "Vertex AI is configured correctly"
}
```

## 🎉 Done!

Page 500 now works in production!

## 📚 More Information

- **Quick Start**: `VERTEX_AI_QUICK_START.md`
- **Quick Commands**: `FIX_VERTEX_AI_NOW.md`
- **Detailed Guide**: `VERTEX_AI_DEPLOYMENT_COMPLETE_FIX.md`
- **Summary**: `VERTEX_AI_FIX_SUMMARY.md`
- **Complete Status**: `VERTEX_AI_DEPLOYMENT_FIX_COMPLETE.md`

## 🔧 Manual Fix (If Needed)

If the automated script doesn't work:

```bash
# 1. Enable API
gcloud services enable aiplatform.googleapis.com

# 2. Grant permissions
# Service account for Firebase App Hosting
gcloud projects add-iam-policy-binding teletext-eacd0 \
  --member="serviceAccount:firebase-app-hosting-compute@teletext-eacd0.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 3. Deploy
git push
```

## 🐛 Troubleshooting

Run the verification script:
```bash
./scripts/verify-vertex-ai-setup.sh
```

Or check the health endpoint after deployment:
```bash
curl https://your-app-url/api/vertex-ai-health
```

---

**TL;DR**: Run `./scripts/fix-vertex-ai-deployment.sh` → Deploy → Done! 🎉
