# Arrow Navigation Indicators Usage Guide

## Overview

The Arrow Navigation Indicators feature provides visual cues in page footers to indicate when multi-page content can be navigated using arrow keys. This implementation satisfies Requirements 8.3 and 11.4 from the Teletext UX Redesign specification.

## Features

- **Up Arrow (▲)**: Displayed when previous page is available
- **Down Arrow (▼)**: Displayed when next page is available
- **Both Arrows (↑↓)**: Displayed when both directions are available
- **END OF CONTENT**: Displayed when on last page with no navigation
- **Contextual Help**: Updates based on arrow navigation availability
- **Consistent Positioning**: Always displayed in footer (row 23)

## Implementation

### Automatic Integration

Arrow navigation indicators are automatically integrated into the page rendering pipeline through the `PageLayoutProcessor`. No manual configuration is required for basic usage.

### How It Works

1. **Continuation Metadata**: Pages with multi-page content include `meta.continuation` data
2. **Automatic Detection**: The `PageLayoutProcessor` detects continuation metadata
3. **Footer Generation**: Arrow indicators are added to the footer based on available navigation
4. **Contextual Help**: Help text updates to mention scrolling when arrows are available

### Page Continuation Metadata

```typescript
interface ContinuationMetadata {
  currentPage: string;      // Current page ID (e.g., "201-2")
  nextPage?: string;        // Next page ID if available
  previousPage?: string;    // Previous page ID if available
  totalPages: number;       // Total number of pages
  currentIndex: number;     // Zero-based index of current page
}
```

## Usage Examples

### Example 1: First Page of Multi-Page Content

```typescript
const page: TeletextPage = {
  id: '201',
  title: 'LONG ARTICLE',
  rows: Array(20).fill('Content'),
  links: [],
  meta: {
    continuation: {
      currentPage: '201',
      nextPage: '201-2',
      previousPage: undefined,
      totalPages: 3,
      currentIndex: 0
    }
  }
};

const processed = pageLayoutProcessor.processPage(page);

// Footer will show:
// "100=INDEX  ▼ Press ↓ for more"
```

### Example 2: Middle Page of Multi-Page Content

```typescript
const page: TeletextPage = {
  id: '201-2',
  title: 'LONG ARTICLE',
  rows: Array(20).fill('Content'),
  links: [],
  meta: {
    continuation: {
      currentPage: '201-2',
      nextPage: '201-3',
      previousPage: '201',
      totalPages: 3,
      currentIndex: 1
    }
  }
};

const processed = pageLayoutProcessor.processPage(page);

// Footer will show:
// "100=INDEX  ↑↓=SCROLL  ▲ Press ↑ for prev..."
```

### Example 3: Last Page of Multi-Page Content

```typescript
const page: TeletextPage = {
  id: '201-3',
  title: 'LONG ARTICLE',
  rows: Array(20).fill('Content'),
  links: [],
  meta: {
    continuation: {
      currentPage: '201-3',
      nextPage: undefined,
      previousPage: '201-2',
      totalPages: 3,
      currentIndex: 2
    }
  }
};

const processed = pageLayoutProcessor.processPage(page);

// Footer will show:
// "100=INDEX  ▲ Press ↑ for previous"
```

### Example 4: Single Page (No Arrows)

```typescript
const page: TeletextPage = {
  id: '200',
  title: 'NEWS',
  rows: Array(10).fill('News content'),
  links: [],
  meta: undefined // No continuation
};

const processed = pageLayoutProcessor.processPage(page);

// Footer will show:
// "100=INDEX  BACK=PREVIOUS"
// (No arrow indicators)
```

## Creating Multi-Page Content

Use the `createMultiPageContent` utility to automatically split long content into multiple pages with proper continuation metadata:

```typescript
import { createMultiPageContent } from './teletext-utils';

const contentRows = Array(60).fill('').map((_, i) => `Line ${i + 1}`);

const pages = createMultiPageContent(
  '201',                    // Base page ID
  'Long Article',           // Title
  contentRows,              // Content rows
  3,                        // Header rows
  2,                        // Footer rows
  [                         // Links
    { label: 'INDEX', targetPage: '100', color: 'red' }
  ]
);

// Returns array of pages with continuation metadata
// Each page will have proper arrow indicators in footer
```

## Arrow Indicator Behavior

### Display Rules

1. **First Page**: Shows only down arrow (▼)
2. **Middle Pages**: Shows both arrows (↑↓) with "SCROLL" hint
3. **Last Page**: Shows only up arrow (▲)
4. **Single Page**: No arrow indicators shown

### Contextual Help Updates

When arrow navigation is available, the contextual help text automatically updates:

- **Without Arrows**: `"100=INDEX  BACK=PREVIOUS"`
- **With Arrows**: `"100=INDEX  ↑↓=SCROLL  BACK=PREVIOUS"`

### Priority with Colored Buttons

When both arrow indicators and colored buttons are present, the footer prioritizes navigation hints due to the 40-character width limit:

```typescript
const page: TeletextPage = {
  id: '201-2',
  title: 'ARTICLE',
  rows: Array(20).fill('Content'),
  links: [
    { label: 'NEWS', targetPage: '200', color: 'red' },
    { label: 'SPORT', targetPage: '300', color: 'green' }
  ],
  meta: {
    continuation: {
      currentPage: '201-2',
      nextPage: '201-3',
      previousPage: '201',
      totalPages: 3,
      currentIndex: 1
    }
  }
};

// Footer will prioritize arrow indicators:
// "100=INDEX  ↑↓=SCROLL  ▲ Press ↑ for prev"
// Colored buttons may be truncated due to space constraints
```

## Testing

Comprehensive tests are available in:
- `lib/__tests__/navigation-indicators.test.ts` - Unit tests for arrow indicator rendering
- `lib/__tests__/arrow-navigation-indicators.test.ts` - Integration tests for arrow indicators in page context
- `lib/__tests__/page-rendering-integration.test.ts` - Full page rendering tests

### Running Tests

```bash
# Run all navigation indicator tests
npm test -- navigation-indicators

# Run arrow navigation specific tests
npm test -- arrow-navigation-indicators

# Run page rendering integration tests
npm test -- page-rendering-integration
```

## API Reference

### NavigationIndicators.renderArrowIndicators()

```typescript
renderArrowIndicators(up: boolean, down: boolean): string[]
```

Renders arrow indicator strings based on available navigation directions.

**Parameters:**
- `up` - Whether up/previous navigation is available
- `down` - Whether down/next navigation is available

**Returns:** Array of indicator strings

**Examples:**
```typescript
const indicators = new NavigationIndicators();

// Both directions available
indicators.renderArrowIndicators(true, true);
// Returns: ['▲ Press ↑ for previous', '▼ Press ↓ for more']

// Only down available
indicators.renderArrowIndicators(false, true);
// Returns: ['▼ Press ↓ for more']

// Only up available
indicators.renderArrowIndicators(true, false);
// Returns: ['▲ Press ↑ for previous']

// No navigation available
indicators.renderArrowIndicators(false, false);
// Returns: ['END OF CONTENT']
```

### NavigationIndicators.createFooter()

```typescript
createFooter(
  pageType: PageType,
  options?: {
    hasArrowNav?: boolean;
    arrowUp?: boolean;
    arrowDown?: boolean;
    coloredButtons?: Array<{ color: string; label: string; page?: string }>;
    customHints?: string[];
  }
): string[]
```

Creates a complete footer with navigation indicators including arrow indicators.

**Parameters:**
- `pageType` - Type of page (index, content, news, sport, etc.)
- `options.hasArrowNav` - Whether arrow navigation is available
- `options.arrowUp` - Whether up navigation is available
- `options.arrowDown` - Whether down navigation is available
- `options.coloredButtons` - Optional colored button configurations
- `options.customHints` - Optional custom hint strings

**Returns:** Array of footer rows (typically 2 rows)

## Requirements Satisfied

- **Requirement 8.3**: Display arrow symbols with descriptions in footer
- **Requirement 11.4**: Show contextual help that updates based on arrow navigation availability
- **Requirement 3.1**: Display downward arrow indicator (▼) when content continues
- **Requirement 3.2**: Display upward arrow indicator (▲) on continuation pages
- **Requirement 3.3**: Show navigation instructions with arrow indicators
- **Requirement 3.4**: Display "END" on last page (implemented as "END OF CONTENT")

## Best Practices

1. **Always Use Continuation Metadata**: Ensure pages with multi-page content include proper continuation metadata
2. **Use Utility Functions**: Use `createMultiPageContent` to automatically generate proper continuation metadata
3. **Test Arrow Navigation**: Test that arrow key handlers properly navigate between continuation pages
4. **Consider Width Limits**: Be aware that footer content is limited to 40 characters and may truncate
5. **Prioritize Navigation**: Arrow indicators take priority over colored buttons when space is limited

## Troubleshooting

### Arrow Indicators Not Showing

**Problem**: Arrow indicators don't appear in footer

**Solution**: Ensure the page has proper continuation metadata:
```typescript
meta: {
  continuation: {
    currentPage: '201-2',
    nextPage: '201-3',      // Required for down arrow
    previousPage: '201',    // Required for up arrow
    totalPages: 3,
    currentIndex: 1
  }
}
```

### Colored Buttons Not Visible

**Problem**: Colored buttons are truncated when arrow indicators are present

**Solution**: This is expected behavior due to 40-character width limit. Arrow indicators take priority. Consider:
- Using shorter hint text
- Reducing number of colored buttons
- Accepting that some content may be truncated

### Wrong Arrow Direction

**Problem**: Up arrow shows when it should be down arrow

**Solution**: Check continuation metadata:
- `nextPage` should be defined for down arrow
- `previousPage` should be defined for up arrow
- Ensure `currentIndex` is correct

## Related Documentation

- [Navigation Indicators Usage](./NAVIGATION_INDICATORS_USAGE.md)
- [Layout Manager Usage](./LAYOUT_MANAGER_USAGE.md)
- [Colored Button Indicators Usage](./COLORED_BUTTON_INDICATORS_USAGE.md)
- [Multi-Page Navigation](../FLEXIBLE_INPUT_SYSTEM.md)
