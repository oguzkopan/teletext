# Quick Start Guide

## Running the Application

You have two options for running the Modern Teletext application:

### Option 1: With Fallback Pages (Quickest)

Just run the Next.js development server:

```bash
npm run dev
```

The app will start at http://localhost:3000 and use fallback pages for content that requires Firebase Functions. This is perfect for:
- Testing the UI and animations
- Working on frontend features
- Quick demos

**Available pages in fallback mode:**
- Page 100: Main Index
- Page 101-199: System pages (work without emulator)
- Page 200-899: Show helpful "emulator offline" messages

### Option 2: With Full Functionality (Recommended)

Run both the Firebase emulators and Next.js:

**Terminal 1 - Start Firebase Emulators:**
```bash
npm run emulators:start
```

Wait for the message: "All emulators ready!"

**Terminal 2 - Start Next.js:**
```bash
npm run dev
```

Now all features work:
- ✅ Live news from NewsAPI
- ✅ Sports scores and fixtures
- ✅ Cryptocurrency and stock market data
- ✅ Weather forecasts
- ✅ AI Oracle assistant
- ✅ Games and entertainment
- ✅ Settings and themes

## Recent Fixes

### TypeScript Compilation Errors (Fixed ✅)

All adapter files have been updated to:
- Use correct imports from `adapter-layout-helper.ts`
- Use correct function names from `market-trend-indicators.ts`
- Remove `this.` references for utility functions
- Fix type annotations for forEach callbacks

**Files fixed:**
- `functions/src/adapters/MarketsAdapter.ts`
- `functions/src/adapters/NewsAdapter.ts`
- `functions/src/adapters/SportsAdapter.ts`
- `functions/src/adapters/WeatherAdapter.ts`

### Connection Errors (Fixed ✅)

The API route now gracefully handles emulator connection failures:
- Detects `ECONNREFUSED` errors
- Automatically serves fallback pages in development
- Provides helpful setup instructions

## Troubleshooting

### "Error fetching page: TypeError: fetch failed"

This means the Firebase emulator is not running. Either:
1. Start the emulator: `npm run emulators:start`
2. Or use fallback mode (the app will handle this automatically now)

### Functions Build Errors

If you see TypeScript errors in the functions directory:
```bash
cd functions
npm run build
```

All errors should be resolved. If not, check that you have the latest code.

### Port Already in Use

If port 3000 or 5001 is already in use:
- For Next.js: `PORT=3001 npm run dev`
- For emulators: Stop other Firebase projects or change ports in `firebase.json`

## Next Steps

1. **Configure API Keys** (optional):
   - Copy `.env.example` to `.env.local`
   - Add your API keys for news, sports, weather services
   - See individual setup guides: `NEWS_API_SETUP.md`, `SPORTS_API_SETUP.md`, etc.

2. **Explore the App**:
   - Navigate to http://localhost:3000
   - Try entering page numbers: 100, 200, 300, 400, etc.
   - Use keyboard shortcuts: arrow keys, number keys, colored buttons

3. **Read the Documentation**:
   - `README.md` - Project overview
   - `UX_REDESIGN_OVERVIEW.md` - UI/UX features
   - `ANIMATION_LIBRARY_DOCUMENTATION.md` - Animation system
   - `FEATURE_FLAGS_USAGE.md` - Feature flags

## Development Workflow

```bash
# Terminal 1: Emulators (if needed)
npm run emulators:start

# Terminal 2: Next.js dev server
npm run dev

# Terminal 3: Run tests
npm test

# Terminal 4: Build functions
cd functions && npm run build
```

Enjoy your Modern Teletext experience! 📺✨
