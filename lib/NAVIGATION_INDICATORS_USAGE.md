# Navigation Indicators Usage Guide

The `NavigationIndicators` component provides visual indicators for navigation including breadcrumbs, page position, arrow indicators, input buffer display, and contextual help.

## Requirements Covered

- **2.1-2.5**: Consistent page number formatting with left-alignment
- **3.1-3.5**: Content overflow indicators and multi-page navigation
- **8.1-8.4**: Navigation hints and colored button indicators
- **11.1-11.5**: Contextual help based on page type
- **15.1**: Input visual feedback
- **16.1-16.5**: Breadcrumb navigation system

## Basic Usage

```typescript
import { navigationIndicators, NavigationIndicators } from '@/lib/navigation-indicators';

// Use the default instance
const breadcrumbs = navigationIndicators.renderBreadcrumbs(['100', '200', '201']);
// Returns: "100 > 200 > 201"

// Or create your own instance
const indicators = new NavigationIndicators();
```

## API Reference

### renderBreadcrumbs(history: string[]): string

Renders a breadcrumb trail from navigation history.

```typescript
// Short history - shows all pages
navigationIndicators.renderBreadcrumbs(['100', '200']);
// Returns: "100 > 200"

// Long history - shows last 3 with ellipsis
navigationIndicators.renderBreadcrumbs(['100', '200', '201', '202', '203']);
// Returns: "... > 201 > 202 > 203"

// Empty or index only
navigationIndicators.renderBreadcrumbs([]);
// Returns: "INDEX"
```

### renderPagePosition(current: number, total: number): string

Renders page position indicator for multi-page content.

```typescript
navigationIndicators.renderPagePosition(2, 5);
// Returns: "Page 2/5"
```

### renderArrowIndicators(up: boolean, down: boolean): string[]

Renders arrow indicators for multi-page content navigation.

```typescript
// Both directions available
navigationIndicators.renderArrowIndicators(true, true);
// Returns: ["▲ Press ↑ for previous", "▼ Press ↓ for more"]

// Only down available
navigationIndicators.renderArrowIndicators(false, true);
// Returns: ["▼ Press ↓ for more"]

// No navigation available
navigationIndicators.renderArrowIndicators(false, false);
// Returns: ["END OF CONTENT"]
```

### renderInputBuffer(digits: string, maxLength?: number): string

Renders input buffer display with cursor or format hint.

```typescript
// Empty buffer - shows hint
navigationIndicators.renderInputBuffer('', 3);
// Returns: "Enter 3-digit page"

// With digits - shows cursor
navigationIndicators.renderInputBuffer('12', 3);
// Returns: "12█"
```

### renderContextualHelp(pageType: PageType, hasArrowNav?: boolean, hasColoredButtons?: boolean): string[]

Renders contextual help based on page type.

```typescript
// Index page without colored buttons
navigationIndicators.renderContextualHelp('index', false, false);
// Returns: ["Enter page number or use colored buttons"]

// Index page with colored buttons (shorter text)
navigationIndicators.renderContextualHelp('index', false, true);
// Returns: ["Enter page number"]

// Content page with arrow navigation
navigationIndicators.renderContextualHelp('content', true);
// Returns: ["100=INDEX  ↑↓=SCROLL  BACK=PREVIOUS"]

// Quiz page
navigationIndicators.renderContextualHelp('quiz');
// Returns: ["Enter 1-4 to answer"]
```

### formatPageNumber(pageNumber: number | string, label: string, maxWidth?: number): string

Formats a page number with consistent left-alignment.

```typescript
navigationIndicators.formatPageNumber(1, 'First Option');
// Returns: "1. First Option"

navigationIndicators.formatPageNumber(100, 'Index');
// Returns: "100. Index"
```

### formatNavigationOptions(options: Array<{page, label}>, maxWidth?: number): string[]

Formats multiple navigation options with consistent alignment.

```typescript
const options = [
  { page: 1, label: 'News' },
  { page: 10, label: 'Sports' },
  { page: 100, label: 'Index' }
];

navigationIndicators.formatNavigationOptions(options);
// Returns: [
//   "1. News",
//   "10. Sports",
//   "100. Index"
// ]
```

### createNavigationHint(hints: string[], coloredButtons?, maxWidth?: number): string

Creates a navigation hint line for footer.

```typescript
const hints = ['100=INDEX', '↑↓=SCROLL'];
const buttons = [
  { color: 'red', label: 'NEWS' },
  { color: 'green', label: 'SPORT' }
];

navigationIndicators.createNavigationHint(hints, buttons);
// Returns: "100=INDEX  ↑↓=SCROLL  🔴NEWS 🟢SPORT" (padded to 40 chars)
```

### createFooter(pageType: PageType, options?): string[]

Creates a complete footer with navigation indicators.

```typescript
// Basic footer for index page
const footer = navigationIndicators.createFooter('index');
// Returns: [
//   "────────────────────────────────────────",
//   "Enter page number or use colored buttons"
// ]

// Footer with colored buttons and arrow navigation
const footer = navigationIndicators.createFooter('content', {
  hasArrowNav: true,
  arrowDown: true,
  coloredButtons: [
    { color: 'red', label: 'NEWS' },
    { color: 'green', label: 'SPORT' }
  ]
});
// Returns: [
//   "────────────────────────────────────────",
//   "100=INDEX  ↑↓=SCROLL  🔴NEWS 🟢SPORT   "
// ]
```

### createHeader(title: string, pageNumber: string, options?): string[]

Creates a header with breadcrumbs and page position.

```typescript
// Basic header
const header = navigationIndicators.createHeader('News', '200');
// Returns: [
//   "NEWS                        P200",
//   "════════════════════════════════════════"
// ]

// Header with content type icon
const header = navigationIndicators.createHeader('News', '200', {
  contentType: 'NEWS'
});
// Returns: [
//   "📰 NEWS                     P200",
//   "════════════════════════════════════════"
// ]

// Header with breadcrumbs
const header = navigationIndicators.createHeader('Article', '201', {
  breadcrumbs: ['100', '200', '201']
});
// Returns: [
//   "ARTICLE                     P201",
//   "100 > 200 > 201                         "
// ]

// Header with page position
const header = navigationIndicators.createHeader('Long Article', '201', {
  pagePosition: { current: 2, total: 5 }
});
// Returns: [
//   "LONG ARTICLE                P201",
//   "═══════════════════════════ Page 2/5"
// ]
```

## Page Types

The following page types are supported for contextual help:

- `'index'` - Main index page
- `'content'` - General content page
- `'ai-menu'` - AI interaction menu
- `'quiz'` - Quiz or question page
- `'settings'` - Settings page
- `'news'` - News content
- `'sport'` - Sports content
- `'markets'` - Market data
- `'weather'` - Weather information
- `'games'` - Games menu

## Integration Example

Here's how to integrate NavigationIndicators with a page rendering system:

```typescript
import { navigationIndicators } from '@/lib/navigation-indicators';
import { TeletextPage } from '@/types/teletext';

function renderPage(page: TeletextPage, history: string[]) {
  // Create header with breadcrumbs
  const header = navigationIndicators.createHeader(
    page.title,
    page.id,
    {
      contentType: getContentType(page.id),
      breadcrumbs: history,
      pagePosition: page.meta?.continuation ? {
        current: page.meta.continuation.currentIndex + 1,
        total: page.meta.continuation.totalPages
      } : undefined
    }
  );

  // Create footer with navigation hints
  const footer = navigationIndicators.createFooter(
    getPageType(page.id),
    {
      hasArrowNav: !!page.meta?.continuation,
      arrowUp: !!page.meta?.continuation?.previousPage,
      arrowDown: !!page.meta?.continuation?.nextPage,
      coloredButtons: page.links
        .filter(l => l.color)
        .map(l => ({ color: l.color!, label: l.label }))
    }
  );

  // Combine header, content, and footer
  return {
    header,
    content: page.rows,
    footer
  };
}
```

## Best Practices

1. **Breadcrumbs**: Always pass the full navigation history; the component will handle truncation automatically.

2. **Page Position**: Use for multi-page content to help users understand their location in a sequence.

3. **Colored Buttons**: When colored buttons are present, the component automatically adjusts help text to avoid redundancy.

4. **Arrow Indicators**: Only show arrow indicators when multi-page navigation is actually available.

5. **Contextual Help**: Choose the appropriate page type to provide relevant navigation instructions.

6. **Input Buffer**: Update the input buffer display as users type to provide immediate feedback.

## Testing

The component includes comprehensive unit tests covering all methods and edge cases. Run tests with:

```bash
npm test -- navigation-indicators.test.ts
```

## Requirements Validation

All requirements are validated through property-based tests and unit tests:

- ✅ 2.1-2.5: Page number alignment consistency
- ✅ 3.1-3.5: Content overflow and continuation indicators
- ✅ 8.1-8.4: Navigation hints and colored buttons
- ✅ 11.1-11.5: Context-sensitive help
- ✅ 15.1: Input visual feedback
- ✅ 16.1-16.5: Breadcrumb navigation
