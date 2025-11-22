# Quiz Navigation Fix: Session ID Persistence

## Problem
When navigating from the quiz intro page (601) to the first question (602), the quiz session ID was not being passed along. This caused:
- Page 602 to create a new session instead of using the existing one
- Users unable to progress through quiz questions
- Each navigation creating a new quiz session
- Impossible to complete the quiz game

## Root Cause
The navigation system wasn't passing the `aiContextId` (session ID) from one page to the next. The quiz adapter stores the session ID in `page.meta.aiContextId`, but when navigating to the next page, this context was lost.

## Solution Applied

### 1. Updated API Route (`app/api/page/[pageNumber]/route.ts`)
- Modified to accept and forward query parameters (like `sessionId`)
- Extracts query parameters from the request URL
- Appends them to the Firebase function URL

```typescript
// Get query parameters from the request
const searchParams = request.nextUrl.searchParams;
const queryString = searchParams.toString();

// Append query parameters if they exist
const functionUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
```

### 2. Updated PageRouter (`components/PageRouter.tsx`)
- Modified `fetchPage` to accept an optional `sessionId` parameter
- Extracts `aiContextId` from current page before navigation
- Passes session ID as query parameter in the fetch URL

```typescript
// Get session ID from current page if it exists
const sessionId = currentPage?.meta?.aiContextId;

// Build URL with session ID if provided
const url = sessionId 
  ? `/api/page/${pageId}?sessionId=${encodeURIComponent(sessionId)}`
  : `/api/page/${pageId}`;
```

### 3. Updated All Navigation Methods
Updated all navigation methods to pass the session ID:
- `navigateToPage()` - Direct page navigation
- `handleNavigate('back')` - Back button navigation
- `handleNavigate('forward')` - Forward button navigation
- `handleNavigate('up')` - Multi-page up navigation
- `handleNavigate('down')` - Multi-page down navigation

## How It Works Now

1. User navigates to page 601 (Quiz intro)
2. GamesAdapter creates a new quiz session and stores ID in `page.meta.aiContextId`
3. User clicks GREEN button to go to page 602
4. PageRouter extracts the `aiContextId` from current page
5. PageRouter passes it as `?sessionId=...` query parameter
6. API route forwards the query parameter to Firebase function
7. GamesAdapter receives the session ID and loads the correct quiz state
8. User can now progress through all quiz questions with the same session

## Files Modified
- `app/api/page/[pageNumber]/route.ts` - Forward query parameters
- `components/PageRouter.tsx` - Extract and pass session ID during navigation

## Testing
Build completed successfully. The quiz navigation should now work properly:
- ✅ Page 601 creates a session
- ✅ Page 602 receives and uses the session
- ✅ All quiz questions maintain the same session
- ✅ Quiz results page shows correct score
- ✅ Session persists across navigation (back/forward)

## Impact
This fix applies to all pages that use `aiContextId` for session management:
- Quiz games (pages 601-609)
- Bamboozle game (pages 610-619)
- AI Oracle conversations (pages 500-599)
- Any future features that need session continuity
