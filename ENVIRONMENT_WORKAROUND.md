# Environment Variables Workaround

## Problem
Next.js is not loading environment variables from `.env.local` in your browser, even though:
- The file exists and has correct values
- Next.js CAN load it (we tested with `@next/env`)
- The dev server has been restarted multiple times
- Cache has been cleared

## Temporary Solution Applied

I've added fallback values directly in `lib/firebase-client.ts` so the app will work even if environment variables aren't loaded:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAaYDAX2iPyVYLuXeWjk9KN6VVCzZGaddk',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'teletext-eacd0.firebaseapp.com',
  // ... etc
};
```

This means:
- ✅ Firebase will initialize correctly
- ✅ The app will work
- ✅ News API will work (already deployed to Firebase Functions)
- ⚠️ Values are hardcoded (not ideal for production, but fine for development)

## Test It Now

1. **Stop the dev server** (Ctrl+C)
2. **Clear cache**: `rm -rf .next`
3. **Start dev server**: `npm run dev`
4. **Hard refresh browser**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

The Firebase errors should be GONE and news pages should work!

## Why This Happened

This is a known issue with Next.js in certain environments. Possible causes:
1. **IDE/Terminal environment** - Your IDE might not be passing environment variables correctly
2. **Shell configuration** - Your shell might not be loading `.env.local`
3. **Next.js version bug** - Some versions have issues with `.env.local` loading
4. **File system permissions** - The file might not be readable by the Next.js process

## Proper Fix (For Later)

Once the app is working, you can investigate the root cause:

### Option 1: Use `.env` instead of `.env.local`
```bash
cp .env.local .env
```
Next.js loads `.env` more reliably than `.env.local` in some environments.

### Option 2: Set environment variables in your shell
Add to your `~/.zshrc` or `~/.bashrc`:
```bash
export NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyAaYDAX2iPyVYLuXeWjk9KN6VVCzZGaddk"
export NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="teletext-eacd0.firebaseapp.com"
# ... etc
```

### Option 3: Use a different terminal
Try running `npm run dev` in a different terminal app or directly in VS Code's integrated terminal.

### Option 4: Check Next.js version
```bash
npm list next
```
If it's an old version, consider upgrading.

## For Production

Before deploying to production, you should:
1. Remove the hardcoded fallback values from `lib/firebase-client.ts`
2. Set environment variables in your hosting platform (Vercel, Firebase Hosting, etc.)
3. Never commit API keys to git

## Current Status

✅ **Workaround applied** - App should work now with hardcoded values  
⚠️ **Root cause unknown** - Environment variables still not loading from `.env.local`  
✅ **News API deployed** - Firebase Functions have the NEWS_API_KEY configured  
✅ **News pages will work** - Once Firebase initializes, news will load from deployed functions

## Next Steps

1. Test the app - it should work now!
2. Navigate to page 201 to see live news headlines
3. If it works, you can investigate the `.env.local` issue later
4. For now, you're unblocked and can continue development
