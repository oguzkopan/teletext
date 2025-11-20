# Environment Variables Fix

## Problem
Next.js is not loading environment variables from `.env.local`, causing the app to show errors about missing Firebase configuration and the News API not working.

## Root Cause
- The `.env.local` file exists and has all the correct values
- Next.js caches environment variables and doesn't reload them automatically
- The `.next` build cache needs to be cleared

## Solution

### Step 1: Clear Cache and Restart

Run these commands in your terminal:

```bash
# Stop the dev server (Ctrl+C if it's running)

# Clear the Next.js cache
rm -rf .next

# Clear node modules cache
rm -rf node_modules/.cache

# Restart the dev server
npm run dev
```

Or use the provided script:

```bash
bash restart-dev.sh
npm run dev
```

### Step 2: Verify Environment Variables

After restarting, the browser console errors should disappear. You should see:
- ✅ No more "MISSING REQUIRED ENVIRONMENT VARIABLES" errors
- ✅ Firebase initializes correctly
- ✅ News pages (200-299) load with live headlines

## Your Current Configuration

Your `.env.local` file already has all the required values:

```bash
# Firebase (✅ Configured)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAaYDAX2iPyVYLuXeWjk9KN6VVCzZGaddk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=teletext-eacd0.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=teletext-eacd0
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=teletext-eacd0.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=914122197824
NEXT_PUBLIC_FIREBASE_APP_ID=1:914122197824:web:56e859f31c15891dce88a5
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-N1KQXRQ0KM

# Google Cloud (✅ Configured)
GOOGLE_CLOUD_PROJECT=teletext-eacd0
GOOGLE_CLOUD_LOCATION=us-central1

# News API (✅ Configured)
NEWS_API_KEY=44c30f5450634eaeaa9eea6e0cbde0d0
```

## About the News API

The News API is working correctly:
- ✅ API key is valid
- ✅ Returns live headlines
- ✅ Configured in both `.env.local` and `functions/.env.local`

However, the app is currently calling **deployed Firebase Functions** in production, not local emulators. This means:

### For Local Development (Current Setup)
The app calls the deployed Firebase Functions at:
`https://us-central1-teletext-eacd0.cloudfunctions.net/getPage`

**To make news work locally, you need to configure the API key in Firebase Functions:**

```bash
firebase functions:config:set news.api_key="44c30f5450634eaeaa9eea6e0cbde0d0"
firebase deploy --only functions
```

### Alternative: Use Firebase Emulators (Recommended for Development)

If you want to develop locally without deploying:

1. Start Firebase Emulators:
   ```bash
   npm run emulators:start
   ```

2. Modify `app/api/page/[pageNumber]/route.ts` to use emulators in development:
   ```typescript
   const isDevelopment = process.env.NODE_ENV === 'development';
   const functionUrl = isDevelopment
     ? 'http://localhost:5001/teletext-eacd0/us-central1/getPage'
     : `https://us-central1-${projectId}.cloudfunctions.net/getPage`;
   ```

3. The emulators will use the `NEWS_API_KEY` from `functions/.env.local`

## Quick Test

After restarting, test the News API:

1. Open http://localhost:3000
2. Navigate to page 200 (News Index)
3. Navigate to page 201 (Top Headlines)
4. You should see live news headlines

## Troubleshooting

### If errors persist after restart:

1. **Check the terminal output** when starting `npm run dev`
   - Look for "Loaded env from .env.local"
   - This confirms Next.js found the file

2. **Verify the file location**
   ```bash
   ls -la .env.local
   ```
   Should show the file in the project root

3. **Check for hidden characters**
   ```bash
   cat -A .env.local | head -5
   ```
   Should show clean lines without weird characters

4. **Try renaming and recreating**
   ```bash
   mv .env.local .env.local.backup
   cp .env.local.backup .env.local
   ```

### If News API still doesn't work:

The issue is that the app is calling deployed Firebase Functions. You have two options:

**Option A: Deploy the functions with the API key**
```bash
firebase functions:config:set news.api_key="44c30f5450634eaeaa9eea6e0cbde0d0"
firebase deploy --only functions
```

**Option B: Use local emulators** (see "Alternative" section above)

## Summary

1. ✅ Your `.env.local` file is correct
2. ✅ Your News API key is valid
3. ⚠️ Next.js needs to be restarted to load the variables
4. ⚠️ News API needs to be configured in Firebase Functions (deployed or emulators)

**Next steps:**
1. Run `bash restart-dev.sh` then `npm run dev`
2. Check if Firebase errors are gone
3. Either deploy functions with API key OR set up emulators for local development
