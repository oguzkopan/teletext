# Multi-Page Navigation Implementation

## Overview

This document describes the implementation of multi-page navigation with arrow keys for the Modern Teletext application. This feature allows users to navigate through long content that spans multiple pages using the up and down arrow keys.

## Requirements

**Requirements: 35.1, 35.2, 35.3, 35.4, 35.5**

- 35.1: Display "MORE" indicator at bottom of pages with continuation
- 35.2: Navigate to next page when down arrow is pressed
- 35.3: Navigate to previous page when up arrow is pressed
- 35.4: Display page counter showing current position (e.g., "Page 2/3")
- 35.5: Support multi-page navigation across all adapters

## Implementation Details

### 1. Data Model Changes

#### PageContinuation Interface

Added a new `PageContinuation` interface to `types/teletext.ts`:

```typescript
export interface PageContinuation {
  currentPage: string;      // Current page ID (e.g., "201")
  nextPage?: string;        // Next page in sequence (e.g., "202" or "201-2")
  previousPage?: string;    // Previous page in sequence (e.g., "200")
  totalPages: number;       // Total pages in sequence
  currentIndex: number;     // Current page index (0-based)
}
```

#### PageMeta Extension

Extended the `PageMeta` interface to include continuation metadata:

```typescript
export interface PageMeta {
  // ... existing fields ...
  continuation?: PageContinuation; // Multi-page navigation metadata
}
```

### 2. Navigation Logic

#### PageRouter Component

Updated `components/PageRouter.tsx` to handle arrow key navigation with continuation metadata:

- **Down Arrow**: 
  - If `currentPage.meta.continuation.nextPage` exists, navigate to that page
  - Otherwise, fall back to sequential navigation (current page - 1)

- **Up Arrow**:
  - If `currentPage.meta.continuation.previousPage` exists, navigate to that page
  - Otherwise, fall back to sequential navigation (current page + 1)

### 3. Visual Indicators

#### TeletextScreen Component

Updated `components/TeletextScreen.tsx` to display navigation indicators:

1. **MORE Indicator** (Requirement 35.1):
   - Displayed at the bottom of pages with continuation
   - Shows "▼ MORE" in cyan color
   - Appears on row 23 when `continuation.nextPage` exists

2. **BACK Indicator** (Requirement 35.3):
   - Displayed at the top of continuation pages
   - Shows "▲ BACK" in cyan color
   - Appears on row 0 when `continuation.previousPage` exists

3. **Page Counter** (Requirement 35.4):
   - Displayed in the center of the header
   - Shows "Page X/Y" format
   - Only visible when continuation metadata exists

### 4. Utility Functions

#### createMultiPageContent

Added to `lib/teletext-utils.ts`:

```typescript
function createMultiPageContent(
  basePageId: string,
  title: string,
  contentRows: string[],
  headerRows: number = 3,
  footerRows: number = 2,
  links: PageLink[] = [],
  meta: any = {}
): TeletextPage[]
```

This function:
- Splits long content into multiple pages
- Adds proper continuation metadata to each page
- Maintains consistent formatting (24 rows, 40 characters per row)
- Preserves navigation links across all pages

#### splitAIResponse

Added to `lib/teletext-utils.ts`:

```typescript
function splitAIResponse(
  basePageId: string,
  title: string,
  responseText: string,
  links: PageLink[] = [],
  meta: any = {}
): TeletextPage[]
```

Specialized function for splitting AI responses into multiple pages with proper wrapping and continuation metadata.

### 5. Adapter Updates

#### NewsAdapter

Updated `functions/src/adapters/NewsAdapter.ts`:

- Modified `formatNewsPage` to detect when content exceeds one page
- Added `createMultiPageNews` method to generate multi-page content
- Added `getSubPage` method to handle sub-page requests (e.g., "201-2")
- Updated `getPage` to handle sub-page routing

#### AIAdapter

Updated `functions/src/adapters/AIAdapter.ts`:

- Modified `formatAIResponse` to include continuation metadata
- Adjusted content rows per page to 19 (24 total - 3 header - 2 footer)
- Added continuation metadata to all multi-page AI responses

### 6. Sub-Page Routing

Pages with continuation use a sub-page ID format:
- Base page: `"201"`
- First continuation: `"201-2"`
- Second continuation: `"201-3"`
- And so on...

Adapters handle sub-page requests by:
1. Detecting the sub-page format (e.g., "201-2")
2. Regenerating all pages for that content
3. Returning the requested sub-page

## Usage Examples

### Creating Multi-Page Content

```typescript
import { createMultiPageContent } from '@/lib/teletext-utils';

const contentRows = [
  'Line 1',
  'Line 2',
  // ... many more lines
];

const pages = createMultiPageContent(
  '201',                    // Base page ID
  'News Headlines',         // Title
  contentRows,              // Content rows
  3,                        // Header rows
  2,                        // Footer rows
  [                         // Navigation links
    { label: 'INDEX', targetPage: '100', color: 'red' }
  ]
);

// pages[0] is the base page (201)
// pages[1] is the first continuation (201-2)
// pages[2] is the second continuation (201-3)
// etc.
```

### Navigating with Arrow Keys

Users can navigate multi-page content using:
- **Down Arrow** or **Channel Down**: Go to next page in sequence
- **Up Arrow** or **Channel Up**: Go to previous page in sequence

The system automatically detects continuation metadata and navigates accordingly.

## Testing

### Unit Tests

Created `lib/__tests__/multi-page-navigation.test.ts`:
- Tests for `createMultiPageContent` function
- Tests for `splitAIResponse` function
- Tests for proper navigation chain creation
- Tests for page formatting (24 rows, 40 characters)

### Integration Tests

Created `components/__tests__/multi-page-arrow-navigation.test.tsx`:
- Tests for arrow key navigation with continuation metadata
- Tests for fallback to sequential navigation
- Tests for proper page fetching

All tests pass successfully.

## Future Enhancements

1. **Caching**: Cache multi-page content to avoid regenerating pages on each request
2. **Lazy Loading**: Only generate pages as they're requested
3. **Progress Indicator**: Show reading progress across multi-page content
4. **Jump to Page**: Allow users to jump directly to a specific page in the sequence
5. **Bookmarking**: Remember user's position in multi-page content

## Related Files

- `types/teletext.ts` - Data model definitions
- `components/PageRouter.tsx` - Navigation logic
- `components/TeletextScreen.tsx` - Visual indicators
- `lib/teletext-utils.ts` - Utility functions
- `functions/src/adapters/NewsAdapter.ts` - News adapter with multi-page support
- `functions/src/adapters/AIAdapter.ts` - AI adapter with multi-page support

## Requirements Validation

✅ **35.1**: "MORE" indicator displayed at bottom of pages with continuation  
✅ **35.2**: Down arrow navigates to next page in multi-page sequence  
✅ **35.3**: Up arrow navigates to previous page in multi-page sequence  
✅ **35.4**: Page counter displays current position (e.g., "Page 2/3")  
✅ **35.5**: Multi-page navigation supported across adapters (News, AI)
