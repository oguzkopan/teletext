# Quiz Page Navigation Fix

## Problem
Users navigating to page 601 (Quiz of the Day) were confused about how to proceed:
- The page showed "Enter number to select game" which was misleading
- When typing "g", it would loop back to the same page
- Users didn't understand they needed to press the GREEN button or type "602" to start

## Root Cause
The navigation footer was using generic contextual help for all "games" pages (600-699), which displayed "Enter number to select game". This was confusing for intro pages like 601 and 610 where users need to press a specific colored button to start.

## Solution

### 1. Added Custom Hints Support
- Added `customHints?: string[]` to the `PageMeta` interface in both:
  - `types/teletext.ts` (frontend types)
  - `functions/src/types.ts` (backend types)

### 2. Updated Page Layout Processor
- Modified `lib/page-layout-processor.ts` to pass `customHints` from page metadata to the navigation indicators footer

### 3. Updated Games Adapter Pages
Updated the following pages in `functions/src/adapters/GamesAdapter.ts` to include clear custom hints:

**Page 600 (Games Index):**
- Custom hint: "Use colored buttons or type page number"

**Page 601 (Quiz of the Day Intro):**
- Updated instructions to be clearer
- Custom hint: "Press GREEN to start or type 602"
- Added explicit instructions in the page content:
  ```
  HOW TO START:
  • Press GREEN button, or
  • Type 602 and press Enter
  ```

**Page 610 (Bamboozle Quiz Intro):**
- Updated instructions to be clearer
- Custom hint: "Press GREEN to start or type 611"
- Added explicit instructions in the page content:
  ```
  HOW TO START:
  • Press GREEN button, or
  • Type 611 and press Enter
  ```

## Additional Fix - Session Management

### Problem
When users typed "602" to navigate directly to the first quiz question, they would be redirected back to page 601, creating a navigation loop. This happened because:
- Page 602 expected a session ID to be passed
- When navigating by typing a page number, no session ID was available
- The code would redirect back to page 601 to create a session

### Solution
Modified `getQuizQuestionPage` to automatically create a new quiz session if one doesn't exist:
- When page 602 is accessed without a session, it now creates a new session automatically
- The first question is displayed immediately
- The session ID is stored in the page metadata for subsequent questions
- This allows users to start the quiz by either:
  - Pressing GREEN on page 601
  - Typing "602" directly

## Testing
After deployment, users should now:
1. See clear instructions on how to start the quiz
2. Understand they can either press the GREEN button or type the page number
3. Not be confused by generic "Enter number to select game" text
4. Be able to type "602" and start the quiz immediately without looping back to 601

## Files Modified
- `types/teletext.ts` - Added customHints to PageMeta
- `functions/src/types.ts` - Added customHints to PageMeta
- `functions/src/adapters/GamesAdapter.ts` - Updated pages 600, 601, 610 with custom hints and clearer instructions
- `lib/page-layout-processor.ts` - Pass customHints from page metadata to footer

## Deployment
- Functions deployed: ✅
- Hosting deployed: ✅
- Live URL: https://teletext-eacd0.web.app
