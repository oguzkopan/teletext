# Navigation Hints System

The Navigation Hints System provides contextual navigation guidance for Modern Teletext pages. It automatically generates appropriate hints based on page type, input mode, and available navigation options.

## Requirements Coverage

This implementation satisfies the following requirements from the teletext-core-redesign spec:

- **13.1**: Display navigation hints in footer on all pages
- **13.2**: For selection pages: "Enter number to select"
- **13.3**: For content pages: "100=INDEX BACK=PREVIOUS"
- **13.4**: For pages with colored buttons: show colored button hints
- **13.5**: Update hints based on current page context

## Core Function

### `generateNavigationHints(page, canGoBack)`

The main function that generates contextual navigation hints for any page.

```typescript
import { generateNavigationHints } from '@/lib/navigation-hints';

const hints = generateNavigationHints(page, canGoBack);
```

**Parameters:**
- `page: TeletextPage` - The page to generate hints for
- `canGoBack: boolean` - Whether back navigation is available (default: false)

**Returns:** `NavigationHint[]` - Array of hints to display in footer

## Hint Generation Logic

The system uses a priority-based approach:

1. **Custom Hints** (Highest Priority)
   - If `page.meta.customHints` is set, use those exclusively
   - Useful for special pages with unique navigation

2. **Context-Specific Hints**
   - Selection pages (inputMode='single'): "Enter number to select"
   - AI pages with loading: "Generating response..."
   - Quiz pages with progress: "Question 3/10"
   - Settings pages: "Use arrows to navigate"

3. **Standard Navigation Hints**
   - "100=INDEX" (shown on all pages except page 100)
   - "BACK=PREVIOUS" (shown when canGoBack is true)

4. **Colored Button Hints**
   - Automatically generated from page.links with color attribute
   - Format: "RED=LABEL", "GREEN=LABEL", etc.

5. **Default Hint**
   - "Enter page number to navigate" (if no other hints apply)

## Specialized Functions

### Selection Pages

```typescript
import { generateSelectionHints } from '@/lib/navigation-hints';

const hints = generateSelectionHints(5); // 5 options available
// Returns: [{ text: 'Enter number to select' }, { text: '100=INDEX' }]
```

### Content Pages

```typescript
import { generateContentHints } from '@/lib/navigation-hints';

const hints = generateContentHints(true, false); // canGoBack=true, hasMorePages=false
// Returns: [{ text: '100=INDEX' }, { text: 'BACK=PREVIOUS' }]
```

### AI Pages

```typescript
import { generateAIHints } from '@/lib/navigation-hints';

const hints = generateAIHints(true, false); // isLoading=true, canGoBack=false
// Returns: [
//   { text: 'Generating response...' },
//   { text: '100=INDEX' },
//   { text: '500=AI' }
// ]
```

### Quiz Pages

```typescript
import { generateQuizHints } from '@/lib/navigation-hints';

const hints = generateQuizHints(3, 10, true); // question 3 of 10, canGoBack=true
// Returns: [
//   { text: 'Question 3/10' },
//   { text: 'Enter 1-4 to answer' },
//   { text: '100=INDEX' },
//   { text: 'BACK=PREVIOUS' }
// ]
```

### Error Pages

```typescript
import { generateErrorHints } from '@/lib/navigation-hints';

const hints = generateErrorHints();
// Returns: [{ text: '100=INDEX' }, { text: 'BACK=PREVIOUS' }]
```

### Index Page

```typescript
import { generateIndexHints } from '@/lib/navigation-hints';

const hints = generateIndexHints();
// Returns: [{ text: 'Enter page number to navigate' }]
```

## Integration with Layout Engine

The navigation hints integrate seamlessly with the layout engine:

```typescript
import { generateNavigationHints } from '@/lib/navigation-hints';
import { renderSingleColumn } from '@/lib/layout-engine';

// Generate hints based on page context
const hints = generateNavigationHints(page, canGoBack);

// Render page with hints in footer
const rows = renderSingleColumn({
  pageNumber: page.id,
  title: page.title,
  content: pageContent,
  timestamp: '12:34',
  hints: hints
});
```

## Page Metadata for Hints

The system reads several metadata fields to determine appropriate hints:

```typescript
interface PageMeta {
  // Explicit input mode
  inputMode?: 'single' | 'double' | 'triple';
  
  // Valid single-digit options
  inputOptions?: string[];
  
  // Custom hints (overrides all automatic generation)
  customHints?: string[];
  
  // AI page loading state
  loading?: boolean;
  
  // Quiz progress
  progress?: {
    current: number;
    total: number;
  };
  
  // Settings page flag
  settingsPage?: boolean;
}
```

## Examples

### Selection Page with Single-Digit Input

```typescript
const page: TeletextPage = {
  id: '500',
  title: 'AI Topics',
  rows: [...],
  links: [
    { label: '1', targetPage: '501' },
    { label: '2', targetPage: '502' },
    { label: '3', targetPage: '503' }
  ],
  meta: {
    inputMode: 'single',
    inputOptions: ['1', '2', '3']
  }
};

const hints = generateNavigationHints(page, false);
// Result: [
//   { text: 'Enter number to select' },
//   { text: '100=INDEX' }
// ]
```

### Content Page with Colored Buttons

```typescript
const page: TeletextPage = {
  id: '300',
  title: 'Sports',
  rows: [...],
  links: [
    { label: 'SCORES', targetPage: '301', color: 'red' },
    { label: 'TABLES', targetPage: '302', color: 'green' },
    { label: 'FIXTURES', targetPage: '303', color: 'yellow' }
  ]
};

const hints = generateNavigationHints(page, true);
// Result: [
//   { text: '100=INDEX' },
//   { text: 'BACK=PREVIOUS' },
//   { text: 'RED=SCORES', color: 'red' },
//   { text: 'GREEN=TABLES', color: 'green' },
//   { text: 'YELLOW=FIXTURES', color: 'yellow' }
// ]
```

### Custom Hints for Special Pages

```typescript
const page: TeletextPage = {
  id: '800',
  title: 'Settings',
  rows: [...],
  links: [],
  meta: {
    customHints: [
      'Use arrows to navigate',
      'ENTER=Select',
      'ESC=Cancel'
    ]
  }
};

const hints = generateNavigationHints(page, false);
// Result: [
//   { text: 'Use arrows to navigate' },
//   { text: 'ENTER=Select' },
//   { text: 'ESC=Cancel' }
// ]
```

## Testing

Comprehensive tests are available in:
- `lib/__tests__/navigation-hints.test.ts` - Unit tests for all functions
- `lib/__tests__/navigation-hints-integration.test.ts` - Integration tests with layout engine
- `lib/__tests__/navigation-hints-demo.html` - Visual demo of all hint types

Run tests:
```bash
npm test -- lib/__tests__/navigation-hints
```

## Design Decisions

1. **Automatic Detection**: The system automatically detects page type from metadata and page number ranges, reducing manual configuration.

2. **Priority System**: Custom hints have highest priority, allowing special pages to override automatic generation.

3. **Space Management**: Hints are joined with double spaces and truncated to fit the 40-character footer width.

4. **Color Metadata**: Colored button hints include color information for potential styling in the UI.

5. **History Awareness**: BACK hint only appears when navigation history exists, preventing confusion.

6. **Page-Specific Logic**: Special handling for AI pages (500-599), Quiz pages (600-699), and Settings pages (800-899).

## Future Enhancements

Potential improvements for future versions:

- Smart hint prioritization based on available space
- Hint abbreviation for space-constrained scenarios
- Animated hint rotation for pages with many options
- Localization support for multi-language hints
- User preference for hint verbosity
