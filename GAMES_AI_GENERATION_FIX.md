# Games Pages AI Generation Fix

## Problem
Pages 600, 610, 620, 630, and 640 were showing **mock/static data** instead of using **real-time AI generation** via Vertex AI.

## Root Cause
The issue had two parts:

### 1. Static Page Registry Override
Pages 620, 630, and 640 were registered in the **static page registry** (`lib/page-registry.ts`), which meant they were being served as static mock pages instead of being routed to the Firebase Functions `GamesAdapter` where the AI generation happens.

### 2. Missing Query Parameters
The Firebase Functions `index.ts` was not passing query parameters from the HTTP request to the adapter's `getPage()` method, which prevented session state and other parameters from being passed through.

## Solution

### Fix 1: Remove Static Page Registrations
**File:** `lib/page-registry.ts`

Removed the following static page registrations:
- `pageRegistry.set('620', createTriviaPage)` - Random Facts
- `pageRegistry.set('630', createWordGamesPage)` - Word Games/Anagrams
- `pageRegistry.set('640', createNumberChallengesPage)` - Math Challenges
- Answer pages for 630 and 640 (631-634, 641-644)

These pages now route through Firebase Functions to the `GamesAdapter` instead.

### Fix 2: Pass Query Parameters to Adapters
**File:** `functions/src/index.ts`

Modified the GET request handler to extract and pass query parameters:

```typescript
// Extract query parameters to pass to adapter
const queryParams: Record<string, any> = {};
for (const [key, value] of Object.entries(req.query)) {
  queryParams[key] = value;
}

// Route to appropriate adapter
const adapter = routeToAdapter(pageId);
const page = await adapter.getPage(pageId, queryParams);
```

## How It Works Now

### Page 600 - Games Index
- **Status:** Static (intentional)
- **Source:** `lib/services-pages.ts` → `createGamesIndexPage()`
- **Purpose:** Navigation hub for all games

### Page 601 - Quiz of the Day
- **Status:** Dynamic with AI
- **Source:** Firebase Functions → `GamesAdapter`
- **Features:**
  - AI-generated trivia questions using Vertex AI
  - Fallback to Open Trivia Database API
  - Session management in Firestore
  - AI-generated witty commentary on results

### Page 610 - Bamboozle Quiz
- **Status:** Dynamic
- **Source:** Firebase Functions → `GamesAdapter`
- **Features:**
  - Branching story quiz game
  - Session state tracking
  - Multiple endings based on choices

### Page 620 - Random Facts
- **Status:** Dynamic with AI
- **Source:** Firebase Functions → `GamesAdapter`
- **Features:**
  - Fetches from API Ninjas Facts API
  - Fallback to curated fact database
  - Fresh content on each reload

### Page 630 - Anagram Challenge
- **Status:** Dynamic with AI ✨
- **Source:** Firebase Functions → `GamesAdapter`
- **Features:**
  - **AI-generated anagrams** using Vertex AI Gemini
  - Unique puzzles on each visit
  - 4 answer options with plausible distractors
  - Answer pages (631-634) show results

### Page 640 - Math Challenge
- **Status:** Dynamic with AI ✨
- **Source:** Firebase Functions → `GamesAdapter`
- **Features:**
  - **AI-generated math problems** using Vertex AI Gemini
  - Medium difficulty arithmetic challenges
  - Step-by-step solutions
  - Answer pages (641-644) show results

## AI Generation Details

### Vertex AI Configuration
- **Model:** `gemini-1.5-flash`
- **Project:** Configured via `GOOGLE_CLOUD_PROJECT` environment variable
- **Location:** `us-central1` (default)

### Page 630 - Word Game Generation
The AI generates:
- Interesting words (6-10 letters)
- Scrambled versions
- Helpful hints
- 4 plausible answer options

### Page 640 - Math Challenge Generation
The AI generates:
- Medium difficulty arithmetic problems
- Operations: addition, subtraction, multiplication
- Results between 10-1000
- Step-by-step solutions
- 4 plausible answer options

## Testing

### To Test Locally
1. Start Firebase emulator: `npm run emulator`
2. Start Next.js dev server: `npm run dev`
3. Navigate to pages 620, 630, 640
4. Each reload should show **different content** (AI-generated)

### To Test in Production
1. Deploy functions: `npm run deploy:functions`
2. Deploy hosting: `npm run deploy:hosting`
3. Visit the production site
4. Navigate to pages 620, 630, 640
5. Verify AI-generated content appears

## Environment Variables Required

For AI generation to work, ensure these are set:

```bash
# In functions/.env or functions/.env.local
GOOGLE_CLOUD_PROJECT=your-project-id
VERTEX_LOCATION=us-central1  # Optional, defaults to us-central1
```

## Fallback Behavior

If AI generation fails:
- **Page 601 (Quiz):** Falls back to Open Trivia Database API, then to hardcoded questions
- **Page 620 (Facts):** Falls back to curated fact database
- **Page 630 (Word Game):** Returns error page (no fallback)
- **Page 640 (Math Challenge):** Returns error page (no fallback)

## Benefits

✅ **Real-time content generation** - Fresh, unique content on every visit
✅ **Educational value** - AI generates interesting, varied questions
✅ **Scalability** - No need to maintain large question databases
✅ **User engagement** - Different experience each time
✅ **Modern tech** - Leverages Vertex AI for intelligent content

## Files Modified

1. `lib/page-registry.ts` - Removed static page registrations
2. `functions/src/index.ts` - Added query parameter passing
3. `functions/src/adapters/GamesAdapter.ts` - Already had AI generation (no changes needed)

## Notes

- Pages 601 and 610 were already using Firebase Functions (no changes needed)
- Page 600 remains static as it's just a navigation hub
- The GamesAdapter already had full AI generation implemented - it just wasn't being used!
