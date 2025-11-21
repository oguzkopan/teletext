# Fix for Pages 500 and 600 Not Working

## Problem
Pages 500 (AI Oracle) and 600 (Games & Entertainment) were returning 500 Internal Server Errors and showing as "OFFLINE".

## Root Cause
Both `AIAdapter` and `GamesAdapter` were initializing Vertex AI in their constructors. When Vertex AI initialization failed (due to missing credentials, permissions, or configuration issues), the entire adapter would fail to initialize, causing all requests to those pages to return 500 errors.

## Solution Applied
Changed both adapters to use **lazy initialization** for Vertex AI:

### Changes Made:

1. **AIAdapter.ts** - Modified constructor to not initialize Vertex AI immediately
2. **GamesAdapter.ts** - Modified constructor to not initialize Vertex AI immediately  
3. Added `getVertexAI()` method to both adapters that initializes Vertex AI only when actually needed
4. Updated all methods that use Vertex AI to call `getVertexAI()` first

This means:
- The adapters can initialize successfully even if Vertex AI credentials are missing
- Vertex AI is only initialized when AI features are actually used
- Pages that don't require AI (like the index pages) will work immediately
- AI-powered features will fail gracefully with proper error messages if credentials are missing

## What You Need to Do

### 1. Rebuild the Functions
```bash
cd functions
npm run build
cd ..
```

### 2. Restart Your Development Server
If using emulators:
```bash
npm run emulators:start
```

If using Next.js dev server:
```bash
npm run dev
```

### 3. Test the Pages
- Navigate to page 500 (AI Oracle) - should now show the index page
- Navigate to page 600 (Games) - should now show the games index page

## Expected Behavior After Fix

### Page 500 (AI Oracle)
- **Index page (500)**: Should load immediately ✅
- **AI-powered features**: Will work if Vertex AI is properly configured
- **If Vertex AI not configured**: Will show error pages with setup instructions

### Page 600 (Games)
- **Index page (600)**: Should load immediately ✅
- **Quiz of the Day (601)**: Should work (uses external trivia API)
- **Bamboozle Quiz (610)**: Should work (no AI required)
- **Random Facts (620)**: Should work (uses curated facts or external API)
- **AI Commentary**: Will use fallback text if Vertex AI not configured

## Vertex AI Configuration (Optional)

If you want to enable AI-powered features, ensure these environment variables are set:

### In `functions/.env`:
```
# Note: GOOGLE_CLOUD_PROJECT is automatically set by Firebase - DO NOT add it manually!
# Only add this if you want to override the default location:
VERTEX_LOCATION=us-central1
```

### Important Notes:
- **DO NOT** set `GOOGLE_CLOUD_PROJECT` in your `.env` file - it's reserved and automatically set by Firebase
- The adapters will automatically use the Firebase project ID for Vertex AI
- You only need to set `VERTEX_LOCATION` if you want to use a different region than `us-central1`

### Additional Requirements:
1. Enable Vertex AI API in Google Cloud Console
2. Ensure your Firebase project has proper permissions
3. For local development, authenticate with: `gcloud auth application-default login`

## Verification

After applying the fix, you should see:
- ✅ Page 500 loads without errors
- ✅ Page 600 loads without errors
- ✅ No more "OFFLINE" messages
- ✅ No more 500 Internal Server Errors in console

If AI features don't work, you'll see helpful error messages explaining what's missing instead of generic 500 errors.
