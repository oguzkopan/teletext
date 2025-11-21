# Breadcrumb Navigation System

## Overview

The breadcrumb navigation system provides visual feedback for navigation history, allowing users to understand their current location within the site hierarchy and easily navigate back through previously visited pages.

## Requirements

This implementation satisfies the following requirements from the UX Redesign specification:

- **16.1**: Display breadcrumb trail in header for any page
- **16.2**: Truncate breadcrumbs for long histories (show last 3 with "...")
- **16.3**: Display breadcrumbs in page header
- **16.4**: Highlight breadcrumb on back button press
- **16.5**: Show "INDEX" instead of breadcrumbs on page 100

## Features

### Breadcrumb Trail Display

Breadcrumbs show the navigation path as a series of page numbers separated by " > ":

```
100 > 200 > 201
```

### Automatic Truncation

For navigation histories longer than 3 pages, the system automatically truncates to show the last 3 pages with an ellipsis:

```
... > 201 > 202 > 203
```

### Special Handling for Page 100

When on page 100 (the main index), breadcrumbs display "INDEX" instead of the page number:

```
INDEX
```

### Visual Highlighting

When the user presses the back button, the breadcrumb trail is briefly highlighted to provide visual feedback that navigation is occurring.

## Implementation

### PageRouter Component

The `PageRouter` component manages the breadcrumb state:

```typescript
const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
const [highlightBreadcrumb, setHighlightBreadcrumb] = useState(false);
```

Breadcrumbs are updated during navigation:

```typescript
// Forward navigation
const newBreadcrumbs = newHistory.filter(id => id !== '100' || newHistory.length === 1);
setBreadcrumbs(newBreadcrumbs);

// Back navigation with highlighting
setHighlightBreadcrumb(true);
// ... navigate ...
setTimeout(() => setHighlightBreadcrumb(false), 300);
```

### NavigationIndicators Component

The `NavigationIndicators` class provides breadcrumb rendering:

```typescript
renderBreadcrumbs(history: string[]): string {
  // Empty history or only page 100
  if (history.length === 0 || (history.length === 1 && history[0] === '100')) {
    return 'INDEX';
  }

  // Show all pages for 3 or fewer
  if (history.length <= 3) {
    return history.join(' > ');
  }

  // Show last 3 with ellipsis
  const last3 = history.slice(-3);
  return `... > ${last3.join(' > ')}`;
}
```

### Header Integration

Breadcrumbs are displayed in the second row of the page header:

```typescript
const header = navigationIndicators.createHeader('Page Title', '201', {
  breadcrumbs: ['100', '200', '201'],
  contentType: 'NEWS'
});

// Result:
// Row 0: "📰 PAGE TITLE                P201"
// Row 1: "100 > 200 > 201                 "
```

## Usage Examples

### Basic Navigation Flow

```typescript
// Start at index
breadcrumbs: []
display: "INDEX"

// Navigate to news section
breadcrumbs: ['100', '200']
display: "100 > 200"

// Navigate to article
breadcrumbs: ['100', '200', '201']
display: "100 > 200 > 201"

// Navigate to another article
breadcrumbs: ['100', '200', '201', '202']
display: "... > 200 > 201 > 202"
```

### Back Navigation

```typescript
// From deep navigation
breadcrumbs: ['100', '200', '201', '202', '203']
display: "... > 201 > 202 > 203"

// Press back button
highlightBreadcrumb: true (briefly)
breadcrumbs: ['100', '200', '201', '202']
display: "... > 200 > 201 > 202"
```

### Sub-page Navigation

```typescript
// Navigate to sub-page
breadcrumbs: ['100', '200', '201-1']
display: "100 > 200 > 201-1"

// Navigate to multi-page article
breadcrumbs: ['100', '200', '201-1', '201-1-2']
display: "... > 200 > 201-1 > 201-1-2"
```

## Visual Feedback

### Breadcrumb Highlighting

When the user presses the back button, the `highlightBreadcrumb` state is set to `true` for 300ms. UI components can use this to apply visual effects:

```typescript
// In a UI component
const breadcrumbStyle = {
  color: highlightBreadcrumb ? 'yellow' : 'white',
  animation: highlightBreadcrumb ? 'pulse 300ms' : 'none'
};
```

### CSS Animation Example

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.breadcrumb-highlight {
  animation: pulse 300ms ease-in-out;
}
```

## Testing

Comprehensive tests are provided in `lib/__tests__/breadcrumb-navigation.test.ts`:

- Breadcrumb trail display
- Truncation for long histories
- Display in page header
- Highlighting on back button press
- Special handling for page 100
- Integration tests for complete navigation flows
- Edge cases (sub-pages, multi-page articles, etc.)

## Integration with Other Components

### Layout Manager

The `LayoutManager` receives breadcrumbs through the `HeaderMetadata` interface:

```typescript
interface HeaderMetadata {
  pageNumber: string;
  title: string;
  breadcrumbs?: string[];
  // ... other fields
}
```

### Page Layout Processor

The `PageLayoutProcessor` passes breadcrumbs from the router to the layout manager:

```typescript
const processedPage = pageLayoutProcessor.processPage(page, {
  breadcrumbs: pageId === '100' ? [] : breadcrumbs,
  enableFullScreen: true,
  contentAlignment: 'left'
});
```

### TeletextScreen Component

The `TeletextScreen` component can access the `highlightBreadcrumb` state from the `PageRouterState` to apply visual effects.

## Performance Considerations

- Breadcrumb rendering is lightweight (simple string operations)
- Truncation is performed only when needed (histories > 3 pages)
- Highlighting timeout is automatically cleared to prevent memory leaks
- Breadcrumb state is updated only during navigation events

## Accessibility

- Breadcrumbs provide clear navigation context for all users
- Visual highlighting is brief (300ms) to avoid distraction
- Text-based breadcrumbs work with screen readers
- Keyboard navigation (back button) triggers highlighting

## Future Enhancements

Potential improvements for future versions:

1. **Clickable Breadcrumbs**: Allow users to click on breadcrumb items to jump directly to that page
2. **Breadcrumb Animations**: Add smooth transitions when breadcrumbs change
3. **Custom Separators**: Allow themes to customize the " > " separator
4. **Breadcrumb Icons**: Show content type icons in breadcrumbs
5. **Breadcrumb Tooltips**: Display page titles on hover
6. **Breadcrumb History**: Store breadcrumb trails in session storage for persistence

## Related Files

- `components/PageRouter.tsx` - Breadcrumb state management
- `lib/navigation-indicators.ts` - Breadcrumb rendering logic
- `lib/page-layout-processor.ts` - Breadcrumb integration with layout
- `lib/__tests__/breadcrumb-navigation.test.ts` - Comprehensive tests
- `.kiro/specs/teletext-ux-redesign/requirements.md` - Requirements 16.1-16.5
- `.kiro/specs/teletext-ux-redesign/design.md` - Design specifications
