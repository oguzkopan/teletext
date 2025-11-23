# Page 602 (Quiz Start) Debug Guide

## Problem
When on page 601 (Quiz intro) and pressing 'G' (green button for "START"), it navigates to page 602 but then immediately returns to page 601 instead of showing the first quiz question.

## Expected Behavior
1. User is on page 601 (Quiz intro)
2. Page 601 creates a new quiz session with sessionId
3. User presses 'G' (green button)
4. Should navigate to page 602 with the sessionId
5. Page 602 should show the first quiz question

## Debug Steps

### 1. Navigate to Page 601
```
Type: 601
Press: Enter
```

### 2. Check Console Logs
You should see:
```
[PageRouter] Page 601 - inputMode: triple, expectedInputLength: 3
```

### 3. Press Green Button ('G')
```
Press: G
```

### 4. Check Console Logs
You should see something like:
```
[PageRouter] Navigating from 601 to 602, sessionId: <some-uuid>
[PageRouter] Received page: 602, requested: 602, sessionId in response: <same-uuid>
```

### 5. What to Look For

#### Scenario A: sessionId is null/undefined
```
[PageRouter] Navigating from 601 to 602, sessionId: undefined
```
**Problem**: Page 601 didn't create or store the sessionId properly
**Fix**: Check GamesAdapter.startQuizOfTheDay() - ensure it sets `aiContextId` in meta

#### Scenario B: Received page ID doesn't match requested
```
[PageRouter] Received page: 601, requested: 602, sessionId in response: <uuid>
```
**Problem**: Backend is returning page 601 instead of 602
**Possible causes**:
- Session not found in Firestore
- Session expired
- Backend logic redirecting back to 601

#### Scenario C: Received page ID matches but shows wrong content
```
[PageRouter] Received page: 602, requested: 602, sessionId in response: <uuid>
```
**Problem**: Page 602 is being returned but with intro content instead of question
**Check**: The page content in the response

## Common Issues

### Issue 1: Session Not Persisting
**Symptom**: sessionId is different between page 601 and 602
**Cause**: Firestore write might be failing or slow
**Fix**: Check Firestore rules and ensure writes are allowed

### Issue 2: Session Not Found
**Symptom**: Page 602 creates a NEW session instead of using existing one
**Cause**: Session lookup in Firestore is failing
**Fix**: Check Firestore query in `getQuizSession()`

### Issue 3: Wrong Page Returned
**Symptom**: Requested 602 but received 601
**Cause**: Backend logic is redirecting
**Fix**: Check GamesAdapter.getQuizQuestionPage() logic

## Backend Flow

### Page 601 (startQuizOfTheDay)
1. Check if sessionId exists in params
2. If yes, try to resume quiz → return page 602
3. If no, create new session
4. Return page 601 with new sessionId in `aiContextId`

### Page 602 (getQuizQuestionPage)
1. Get sessionId from params
2. If no sessionId, create new session
3. Load session from Firestore
4. If session not found, create new session
5. Check if quiz is complete
6. If complete, return results page
7. If not complete, return question page (602)

## Potential Bug

Looking at the code, I suspect the issue is:

**In GamesAdapter.getQuizQuestionPage()** (line 240-250):
```typescript
let sessionId = params?.sessionId || params?.aiContextId;
let session = sessionId ? await this.getQuizSession(sessionId) : null;

// If no session or session expired, create a new one
if (!session) {
  const questions = await this.fetchTriviaQuestions(5);
  sessionId = await this.createQuizSession(questions);
  session = await this.getQuizSession(sessionId);
  
  if (!session) {
    return this.getErrorPage(pageId, 'Quiz Question', new Error('Failed to create session'));
  }
}
```

**Problem**: When a new session is created on page 602, it might be returning page 602 with question 1, but then something is causing it to navigate back to 601.

**OR**: The session created on page 601 is not being saved to Firestore properly, so when page 602 tries to load it, it doesn't find it and creates a NEW session.

## Next Steps

1. Run the app with `npm run dev`
2. Navigate to page 601
3. Press 'G'
4. Check console logs
5. Share the console output to identify the exact issue

## Files to Check

1. `functions/src/adapters/GamesAdapter.ts` - Quiz logic
2. `components/PageRouter.tsx` - Navigation logic
3. `app/api/page/[pageNumber]/route.ts` - API proxy
4. Firestore rules - Ensure quiz sessions can be written/read

## Expected Console Output (Success Case)

```
[PageRouter] Page 601 - inputMode: triple, expectedInputLength: 3
[PageRouter] Navigating from 601 to 602, sessionId: abc-123-def-456
[PageRouter] Received page: 602, requested: 602, sessionId in response: abc-123-def-456
[PageRouter] Page 602 - inputMode: single, expectedInputLength: 1
```

Then you should see the first quiz question on page 602.
