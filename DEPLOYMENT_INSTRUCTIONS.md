# Deployment Instructions

## What Changed

I've completely redesigned the layout system to use full-width, centered pages like your page 100. Here's what was updated:

### Frontend Changes (Already Built)
- ✅ `components/TeletextScreen.tsx` - Updated to full-width layout
- ✅ `lib/news-pages.ts` - New full-width news index pages (200, 201, 202, 203)
- ✅ `lib/system-pages.ts` - New full-width system page (101)
- ✅ `lib/sports-pages.ts` - New full-width sports index (300)
- ✅ `lib/markets-pages.ts` - New full-width markets index (400)
- ✅ `lib/services-pages.ts` - New full-width service pages (500, 600, 700, 800)
- ✅ `app/api/page/[pageNumber]/route.ts` - Updated to use new index pages
- ✅ Deleted `lib/fallback-pages.ts` (replaced with dedicated index pages)

### Backend Changes (Functions - Need Deployment)
- ✅ `functions/src/adapters/StaticAdapter.ts` - Updated page 100, 101, 110, 999 to full-width layout
- ✅ Functions built successfully

## How to Deploy

### Option 1: Deploy Everything (Recommended)
```bash
# Build the frontend
npm run build

# Deploy to Firebase (hosting + functions)
firebase deploy
```

### Option 2: Deploy Only Functions (Faster)
```bash
# Build functions
cd functions
npm run build
cd ..

# Deploy only functions
firebase deploy --only functions
```

### Option 3: Deploy Only Hosting (If functions already deployed)
```bash
# Build the frontend
npm run build

# Deploy only hosting
firebase deploy --only hosting
```

## Verification

After deployment, check these pages to verify the layout:
- Page 100: Main index (should be full-width with multi-column layout)
- Page 101: System status (should be full-width)
- Page 200: News index (should be full-width)
- Page 203: Local news (should be full-width with news articles)
- Page 300: Sports index (should be full-width)
- Page 400: Markets index (should be full-width)
- Page 999: Help page (should be full-width)

## What to Expect

All pages now have:
- **Full horizontal width** - Uses every pixel of the screen
- **Centered layout** - Content is properly centered with padding
- **30 rows** of content (increased from 24)
- **Long decorative borders** spanning the full width
- **Consistent styling** matching your page 100
- **No cut-off text** - Everything is visible

## Troubleshooting

If pages still look wrong after deployment:

1. **Clear browser cache**: Hard refresh with Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Check Firebase console**: Make sure functions deployed successfully
3. **Check browser console**: Look for any errors
4. **Wait a few minutes**: Firebase CDN may take time to update

## Local Development

To test locally before deploying:
```bash
# Terminal 1: Start Firebase emulators
npm run emulators:start

# Terminal 2: Start Next.js dev server
npm run dev
```

Then visit http://localhost:3001 to see the changes.
