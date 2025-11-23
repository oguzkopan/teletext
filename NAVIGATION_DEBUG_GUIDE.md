# Navigation Debug Guide

## Current Status

### Changes Made
1. **Added debug logging** to `PageRouter.tsx` `handleDigitPress` function
2. **Added debug logging** for `expectedInputLength` calculation
3. **Fixed duplicate page 720** (removed from StaticAdapter)
4. **Recreated** `hooks/useAITypingAnimation.ts` (was accidentally deleted)

### How to Debug

#### Step 1: Build and Run
```bash
npm run build
npm run dev
```

#### Step 2: Open Browser Console
Open Chrome DevTools (F12) and go to Console tab

#### Step 3: Navigate to Problem Pages

**Test Page 611 (Bamboozle Quiz)**:
1. Type `611` and press Enter
2. You should see in console:
   ```
   [PageRouter] Page 611 - inputMode: single, expectedInputLength: 1
   ```
3. Press `1`
4. You should see in console:
   ```
   [PageRouter] Single-digit input detected: 1
   [PageRouter] Current page: 611, Links: [...]
   [PageRouter] Matching link found: {label: "1", targetPage: "612", ...}
   [PageRouter] Navigating to link target: 612
   ```
5. Page should navigate to 612

**Test Page 203 (News Headlines)**:
1. Type `203` and press Enter
2. You should see in console:
   ```
   [PageRouter] Page 203 - inputMode: single, expectedInputLength: 1
   ```
3. Press `1`
4. You should see in console:
   ```
   [PageRouter] Single-digit input detected: 1
   [PageRouter] Current page: 203, Links: [...]
   [PageRouter] Matching link found: null (or undefined)
   [PageRouter] No matching link, using sub-page navigation: 203-1
   ```
5. Page should navigate to 203-1 (article detail)

**Test Page 510 (AI Q&A Menu)**:
1. Type `510` and press Enter
2. You should see in console:
   ```
   [PageRouter] Page 510 - inputMode: single, expectedInputLength: 1
   ```
3. Press `1`
4. You should see in console:
   ```
   [PageRouter] Single-digit input detected: 1
   [PageRouter] Current page: 510, Links: [...]
   [PageRouter] Matching link found: {label: "1", targetPage: "511", ...}
   [PageRouter] Navigating to link target: 511
   ```
5. Page should navigate to 511

### What to Look For

#### Problem 1: Input Buffer Shows Wrong Length
**Symptom**: Input buffer shows "1__" (expecting 3 digits) instead of "1" (expecting 1 digit)

**Check**:
- Console log: `[PageRouter] Page XXX - inputMode: ?, expectedInputLength: ?`
- If `expectedInputLength` is 3 when it should be 1, the page metadata is wrong
- If `expectedInputLength` is 1 but display shows "1__", there's a rendering issue

**Fix**:
- If metadata is wrong: Check the adapter (GamesAdapter, NewsAdapter, AIAdapter) and ensure `inputMode: 'single'` is set
- If rendering is wrong: Check `app/page.tsx` line 186 where underscores are rendered

#### Problem 2: Navigation Doesn't Happen
**Symptom**: Press '1' but nothing happens, stays on same page

**Check**:
- Console log: Does it show "Single-digit input detected"?
  - **NO**: The digit isn't in `inputOptions` or `inputMode` isn't 'single'
  - **YES**: Continue checking...
- Console log: Does it show "Matching link found"?
  - **NULL/UNDEFINED**: No link with that label exists, should use sub-page navigation
  - **OBJECT**: Link exists, should navigate to `targetPage`
- Console log: Does it show "Navigating to link target" or "using sub-page navigation"?
  - **NO**: Something is blocking the navigation
  - **YES**: Navigation was attempted, check if target page exists

**Fix**:
- If link not found but should exist: Check adapter's `links` array
- If navigation attempted but failed: Check if target page exists in adapter
- If nothing happens: Check `setTimeout` is working (100ms delay)

#### Problem 3: Wrong Page Loads
**Symptom**: Press '1' and goes to wrong page

**Check**:
- Console log: What does "Navigating to link target" or "using sub-page navigation" say?
- Verify the target page ID matches what you expect

**Fix**:
- If wrong target: Fix the `links` array in the adapter
- If sub-page when should be link: Add proper link to adapter

### Common Issues

#### Issue: inputMode not set
**Symptom**: All pages expect 3 digits
**Fix**: Add `inputMode: 'single'` to page metadata in adapter

#### Issue: inputOptions not set
**Symptom**: Single-digit input doesn't trigger navigation
**Fix**: Add `inputOptions: ['1', '2', '3', ...]` to page metadata

#### Issue: Links missing labels
**Symptom**: Navigation uses sub-page instead of link
**Fix**: Ensure links have `label: '1'`, `label: '2'`, etc.

#### Issue: Links missing targetPage
**Symptom**: Navigation fails silently
**Fix**: Ensure links have `targetPage: '612'`, etc.

### Expected Behavior Summary

| Page | Input Mode | Options | Link Labels | Navigation |
|------|------------|---------|-------------|------------|
| 611 | single | 1,2,3 | 1,2,3 | Link → 612,613,614 |
| 510 | single | 1-5 | 1-5 | Link → 511-515 |
| 203 | single | 1-9 | (none) | Sub-page → 203-1, etc. |

### Next Steps

1. Run the app and test each page
2. Check console logs for each test
3. If navigation works: Remove debug logs (optional)
4. If navigation fails: Share console logs for further debugging

### Files Modified

1. `components/PageRouter.tsx` - Added debug logging
2. `functions/src/adapters/StaticAdapter.ts` - Removed duplicate page 720
3. `hooks/useAITypingAnimation.ts` - Recreated file
4. `app/page.tsx` - No changes (input buffer display already correct)

### Files to Check if Issues Persist

1. `functions/src/adapters/GamesAdapter.ts` - Page 611 definition
2. `functions/src/adapters/AIAdapter.ts` - Page 510 definition
3. `functions/src/adapters/NewsAdapter.ts` - Page 203 definition
