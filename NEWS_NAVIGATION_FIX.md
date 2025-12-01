# News Navigation Fix - Single-Digit Article Navigation

## Problem

When users pressed single-digit keys (1-5) on news pages to read article details, they would get stuck on the news headline page without being navigated to the article detail page (e.g., `203-3`).

### Symptoms

- User presses `3` on page 203 (Local News)
- Console logs show:
  ```
  [PageRouter] Received page: 203, requested: 203-3
  ```
- User remains on page 203 instead of navigating to page 203-3
- Article content is not displayed

## Root Cause

There were TWO issues preventing article navigation:

### Issue 1: API Route (app/api/page/[pageNumber]/route.ts)
When handling hyphenated page IDs like `203-3`:
1. The route received `pageNumber = "203-3"`
2. It parsed this as an integer: `parseInt("203-3", 10)` → `203`
3. The validation logic didn't properly handle hyphenated IDs
4. The base page number extraction was missing

### Issue 2: NewsAdapter (lib/adapters/NewsAdapter.ts) - **THE MAIN ISSUE**
The `getPage` method was checking conditions in the wrong order:
1. It parsed `pageId` as integer FIRST: `parseInt("201-1", 10)` → `201`
2. Then checked `if (pageNumber === 201)` which matched!
3. So it called `getUKNewsPage()` instead of `getNewsArticleDetailPage()`
4. The hyphen check came AFTER the integer checks, so it never executed

### Code Before Fix

**API Route (app/api/page/[pageNumber]/route.ts):**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { pageNumber: string } }
) {
  const { pageNumber } = params;

  // Validate page number range (100-999)
  const pageNum = parseInt(pageNumber, 10);  // ❌ This converts "203-3" to 203
  if (isNaN(pageNum) || pageNum < 100 || pageNum > 999) {
    // ...
  }
  
  // ...
  const magazine = Math.floor(pageNum / 100);  // Uses parsed number
```

**NewsAdapter (lib/adapters/NewsAdapter.ts):**
```typescript
async getPage(pageId: string): Promise<TeletextPage> {
  const pageNumber = parseInt(pageId, 10);  // ❌ Parses "201-1" to 201 FIRST

  if (pageNumber === 200) {
    return this.getNewsIndexPage();
  } else if (pageNumber === 201) {  // ❌ This matches for "201-1"!
    return this.getUKNewsPage();     // ❌ Returns wrong page
  } else if (pageNumber === 202) {
    return this.getWorldNewsPage();
  } else if (pageNumber === 203) {
    return this.getLocalNewsPage();
  } else if (pageNumber >= 204 && pageNumber <= 209) {
    return this.getCategoryNewsPage(pageId);
  } else if (pageId.includes('-')) {  // ❌ Never reached!
    return this.getNewsArticleDetailPage(pageId);
  }
```

## Solution

### Fix 1: API Route
Extract the base page number explicitly before validation:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { pageNumber: string } }
) {
  const { pageNumber } = params;

  // Extract base page number (handle hyphenated IDs like "203-3")
  const basePageNumber = pageNumber.split('-')[0];  // ✅ "203-3" → "203"
  const pageNum = parseInt(basePageNumber, 10);     // ✅ Parse only the base
  
  // Validate page number range (100-999)
  if (isNaN(pageNum) || pageNum < 100 || pageNum > 999) {
    // ...
  }
  
  // ...
  const magazine = Math.floor(pageNum / 100);  // Uses base number for routing
  
  // But pass full pageNumber to adapter
  const newsAdapter = new NewsAdapter();
  page = await newsAdapter.getPage(pageNumber);  // ✅ Passes "203-3"
```

### Fix 2: NewsAdapter (THE CRITICAL FIX)
Check for hyphenated IDs BEFORE parsing as integer:

```typescript
async getPage(pageId: string): Promise<TeletextPage> {
  // Check for article detail pages FIRST (before parsing as integer)
  if (pageId.includes('-')) {  // ✅ Check hyphen FIRST!
    // Article detail pages like 200-1, 201-2, etc.
    return this.getNewsArticleDetailPage(pageId);  // ✅ Correct routing
  }

  // Now parse as integer for main pages
  const pageNumber = parseInt(pageId, 10);  // ✅ Only for non-hyphenated IDs

  if (pageNumber === 200) {
    return this.getNewsIndexPage();
  } else if (pageNumber === 201) {  // ✅ Won't match "201-1" anymore
    return this.getUKNewsPage();
  } else if (pageNumber === 202) {
    return this.getWorldNewsPage();
  } else if (pageNumber === 203) {
    return this.getLocalNewsPage();
  } else if (pageNumber >= 204 && pageNumber <= 209) {
    return this.getCategoryNewsPage(pageId);
  }
```

## How It Works Now

1. User presses `3` on page 203
2. PageRouter navigates to `203-3`
3. API route receives `pageNumber = "203-3"`
4. Extracts base: `basePageNumber = "203"`
5. Validates: `pageNum = 203` (valid)
6. Determines magazine: `magazine = 2` (news section)
7. Calls: `newsAdapter.getPage("203-3")` with full ID
8. NewsAdapter splits `"203-3"` into `parentPage = "203"` and `articleNum = 3`
9. Fetches the correct article from the API
10. Returns page with `id: "203-3"`
11. PageRouter displays the article content

## Files Modified

1. `app/api/page/[pageNumber]/route.ts` - Fixed page number extraction and validation
2. `lib/adapters/NewsAdapter.ts` - **Fixed routing logic to check hyphens first** (critical fix)

## Testing

### Manual Test

1. Start the development server: `npm run dev`
2. Navigate to page 203 (Local News)
3. Press `3` to read the third article
4. Verify that:
   - Page navigates to 203-3
   - Article title is displayed
   - Article content is shown
   - Navigation buttons work (BACK, INDEX, PREV, NEXT)

### Expected Console Output

```
[PageRouter] Single-digit input detected: 3
[PageRouter] No matching link, using sub-page navigation: 203-3
[PageRouter] Navigating from 203 to 203-3
[PageRouter] Received page: 203-3, requested: 203-3  ✅ IDs match!
[PageRouter] Page metadata: {source: 'NewsAdapter', ...}
```

## Impact

This fix affects all pages that use hyphenated IDs for sub-pages:

- **News articles**: 200-1, 201-2, 202-3, 203-4, etc.
- **Sports articles**: 300-1, 300-2, etc.
- **Any future pages** that use the sub-page pattern

## Related Components

- `components/PageRouter.tsx` - Handles single-digit navigation (already working correctly)
- `lib/adapters/NewsAdapter.ts` - Parses hyphenated IDs (already working correctly)
- `app/api/page/[pageNumber]/route.ts` - **Fixed** to handle hyphenated IDs

## Verification

✅ Build successful
✅ No TypeScript errors
✅ Single-digit navigation working
✅ Article detail pages loading correctly
✅ Navigation between articles working

## Status

**✅ FIXED AND VERIFIED**

Users can now successfully navigate to news article detail pages using single-digit keys (1-5).

---

*Fixed: December 1, 2025*
