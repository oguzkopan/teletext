# Layout Manager API Reference

## Overview

The Layout Manager is responsible for calculating optimal content distribution across the 40×24 character grid, managing full-screen utilization with minimal padding, and coordinating header, content, and footer positioning.

**Location**: `lib/layout-manager.ts`

## Class: LayoutManager

### Constructor

```typescript
constructor()
```

Creates a new LayoutManager instance.

**Example:**
```typescript
import { LayoutManager } from '@/lib/layout-manager';

const layoutManager = new LayoutManager();
```

## Methods

### calculateLayout

```typescript
calculateLayout(
  page: TeletextPage,
  options: LayoutOptions
): LayoutResult
```

Calculates the complete layout for a teletext page, including header, content, and footer.

**Parameters:**
- `page` (TeletextPage): The page data to layout
- `options` (LayoutOptions): Layout configuration options

**Returns:** LayoutResult - The formatted layout with header, content, and footer

**Example:**
```typescript
const layout = layoutManager.calculateLayout(page, {
  fullScreen: true,
  headerRows: 2,
  footerRows: 2,
  contentAlignment: 'left',
  showBreadcrumbs: true,
  showPageIndicator: true
});

console.log(layout.header);   // ["TITLE                            100", "100 > 200 > 201"]
console.log(layout.content);  // ["Content line 1", "Content line 2", ...]
console.log(layout.footer);   // ["100=INDEX  ↑↓=SCROLL", "🔴NEWS 🟢SPORT 🟡MARKETS 🔵AI"]
console.log(layout.totalRows); // 24
```

### optimizeSpacing

```typescript
optimizeSpacing(
  content: string[],
  maxRows: number
): string[]
```

Optimizes content spacing to fit within the specified number of rows.

**Parameters:**
- `content` (string[]): Array of content lines
- `maxRows` (number): Maximum number of rows available

**Returns:** string[] - Optimized content lines

**Example:**
```typescript
const content = [
  'Line 1',
  'Line 2',
  'Line 3',
  // ... many more lines
];

const optimized = layoutManager.optimizeSpacing(content, 20);
// Returns content fitted to 20 rows
```

### centerText

```typescript
centerText(
  text: string,
  width: number = 40
): string
```

Centers text within the specified width.

**Parameters:**
- `text` (string): Text to center
- `width` (number, optional): Width to center within (default: 40)

**Returns:** string - Centered text with padding

**Example:**
```typescript
const centered = layoutManager.centerText('TITLE', 40);
// Returns: "                 TITLE                  "
```

### justifyText

```typescript
justifyText(
  text: string,
  width: number = 40
): string
```

Justifies text to fill the specified width by adding spaces between words.

**Parameters:**
- `text` (string): Text to justify
- `width` (number, optional): Width to justify to (default: 40)

**Returns:** string - Justified text

**Example:**
```typescript
const justified = layoutManager.justifyText('This is a test', 40);
// Returns: "This        is        a        test"
```

### createHeader

```typescript
createHeader(
  title: string,
  metadata: HeaderMetadata
): string[]
```

Creates formatted header rows with title, page number, breadcrumbs, and metadata.

**Parameters:**
- `title` (string): Page title
- `metadata` (HeaderMetadata): Header metadata (page number, timestamp, etc.)

**Returns:** string[] - Array of header rows (typically 2 rows)

**Example:**
```typescript
const header = layoutManager.createHeader('Top Headlines', {
  pageNumber: '201',
  title: 'Top Headlines',
  timestamp: '2024-01-15T10:30:00.000Z',
  cacheStatus: 'LIVE',
  breadcrumbs: ['100', '200', '201'],
  pagePosition: { current: 1, total: 3 },
  contentType: 'NEWS'
});

// Returns:
// [
//   "📰 TOP HEADLINES              201",
//   "100 > 200 > 201    Page 1/3  LIVE"
// ]
```

### createFooter

```typescript
createFooter(
  navigation: NavigationOptions
): string[]
```

Creates formatted footer rows with navigation hints and colored button indicators.

**Parameters:**
- `navigation` (NavigationOptions): Navigation configuration

**Returns:** string[] - Array of footer rows (typically 2 rows)

**Example:**
```typescript
const footer = layoutManager.createFooter({
  backToIndex: true,
  coloredButtons: [
    { color: 'red', label: 'NEWS', page: '200' },
    { color: 'green', label: 'SPORT', page: '300' },
    { color: 'yellow', label: 'MARKETS', page: '400' },
    { color: 'blue', label: 'AI', page: '500' }
  ],
  arrowNavigation: {
    up: '200',
    down: '202'
  },
  customHints: ['Enter page number to navigate']
});

// Returns:
// [
//   "100=INDEX  ↑↓=SCROLL  BACK=PREVIOUS",
//   "🔴NEWS 🟢SPORT 🟡MARKETS 🔵AI"
// ]
```

## Types

### LayoutOptions

```typescript
interface LayoutOptions {
  fullScreen: boolean;           // Use all 24 rows
  headerRows: number;             // Rows reserved for header (default: 2)
  footerRows: number;             // Rows reserved for footer (default: 2)
  contentAlignment: 'left' | 'center' | 'justify';
  showBreadcrumbs: boolean;       // Show navigation breadcrumbs
  showPageIndicator: boolean;     // Show "Page X/Y" indicator
}
```

### LayoutResult

```typescript
interface LayoutResult {
  header: string[];     // Formatted header rows
  content: string[];    // Formatted content rows
  footer: string[];     // Formatted footer rows
  totalRows: number;    // Should equal 24
}
```

### HeaderMetadata

```typescript
interface HeaderMetadata {
  pageNumber: string;                           // Page number (e.g., "201")
  title: string;                                // Page title
  timestamp?: string;                           // ISO timestamp
  cacheStatus?: 'LIVE' | 'CACHED';             // Cache status
  breadcrumbs?: string[];                       // Navigation history
  pagePosition?: { current: number; total: number }; // Multi-page position
  contentType?: 'NEWS' | 'SPORT' | 'MARKETS' | 'AI' | 'GAMES'; // Content type
}
```

### NavigationOptions

```typescript
interface NavigationOptions {
  backToIndex: boolean;                         // Show "100=INDEX"
  coloredButtons?: Array<{                      // Fastext buttons
    color: string;
    label: string;
    page: string;
  }>;
  arrowNavigation?: {                           // Arrow key navigation
    up?: string;
    down?: string;
  };
  customHints?: string[];                       // Custom navigation hints
}
```

## Usage Examples

### Basic Page Layout

```typescript
import { LayoutManager } from '@/lib/layout-manager';

const layoutManager = new LayoutManager();

const page = {
  id: '201',
  title: 'Top Headlines',
  rows: [
    '1. Breaking news story...',
    '   Source: BBC News',
    '',
    '2. Another important story...',
    '   Source: Reuters'
  ],
  links: [
    { label: 'Index', targetPage: '200', color: 'red' },
    { label: 'World', targetPage: '202', color: 'green' }
  ]
};

const layout = layoutManager.calculateLayout(page, {
  fullScreen: true,
  headerRows: 2,
  footerRows: 2,
  contentAlignment: 'left',
  showBreadcrumbs: true,
  showPageIndicator: false
});

// Render the layout
layout.header.forEach(row => console.log(row));
layout.content.forEach(row => console.log(row));
layout.footer.forEach(row => console.log(row));
```

### Multi-Page Content

```typescript
const multiPageLayout = layoutManager.calculateLayout(page, {
  fullScreen: true,
  headerRows: 2,
  footerRows: 2,
  contentAlignment: 'left',
  showBreadcrumbs: true,
  showPageIndicator: true  // Show "Page 2/5"
});

// Header will include page position
// Footer will include arrow navigation hints
```

### Custom Header

```typescript
const customHeader = layoutManager.createHeader('Custom Page', {
  pageNumber: '800',
  title: 'Custom Page',
  timestamp: new Date().toISOString(),
  cacheStatus: 'LIVE',
  breadcrumbs: ['100', '800'],
  contentType: 'AI'
});

// Returns:
// [
//   "🤖 CUSTOM PAGE                   800",
//   "100 > 800                      LIVE"
// ]
```

### Custom Footer

```typescript
const customFooter = layoutManager.createFooter({
  backToIndex: true,
  coloredButtons: [
    { color: 'red', label: 'BACK', page: '100' }
  ],
  customHints: [
    'Press R to go back',
    'Enter page number to navigate'
  ]
});
```

## Best Practices

### 1. Always Use Full Screen

```typescript
// Good
const layout = layoutManager.calculateLayout(page, {
  fullScreen: true,
  // ...
});

// Avoid
const layout = layoutManager.calculateLayout(page, {
  fullScreen: false,  // Wastes screen space
  // ...
});
```

### 2. Consistent Header/Footer Sizes

```typescript
// Standard layout
const layout = layoutManager.calculateLayout(page, {
  fullScreen: true,
  headerRows: 2,  // Standard
  footerRows: 2,  // Standard
  // ...
});
```

### 3. Show Breadcrumbs Except on Index

```typescript
const showBreadcrumbs = page.id !== '100';

const layout = layoutManager.calculateLayout(page, {
  fullScreen: true,
  showBreadcrumbs,
  // ...
});
```

### 4. Show Page Indicators for Multi-Page Content

```typescript
const isMultiPage = page.meta?.continuation?.total > 1;

const layout = layoutManager.calculateLayout(page, {
  fullScreen: true,
  showPageIndicator: isMultiPage,
  // ...
});
```

## Performance Considerations

### Caching Layout Calculations

```typescript
const layoutCache = new Map<string, LayoutResult>();

function getLayout(page: TeletextPage, options: LayoutOptions): LayoutResult {
  const cacheKey = `${page.id}_${JSON.stringify(options)}`;
  
  if (layoutCache.has(cacheKey)) {
    return layoutCache.get(cacheKey)!;
  }
  
  const layout = layoutManager.calculateLayout(page, options);
  layoutCache.set(cacheKey, layout);
  return layout;
}
```

### Lazy Layout Calculation

```typescript
// Only calculate layout when needed
const [layout, setLayout] = useState<LayoutResult | null>(null);

useEffect(() => {
  if (page) {
    const newLayout = layoutManager.calculateLayout(page, options);
    setLayout(newLayout);
  }
}, [page, options]);
```

## Testing

### Unit Tests

```typescript
import { LayoutManager } from '@/lib/layout-manager';

describe('LayoutManager', () => {
  let layoutManager: LayoutManager;
  
  beforeEach(() => {
    layoutManager = new LayoutManager();
  });
  
  it('should create exactly 24 rows', () => {
    const layout = layoutManager.calculateLayout(mockPage, mockOptions);
    expect(layout.totalRows).toBe(24);
  });
  
  it('should center text correctly', () => {
    const centered = layoutManager.centerText('TEST', 40);
    expect(centered.length).toBe(40);
    expect(centered.trim()).toBe('TEST');
  });
  
  it('should create header with breadcrumbs', () => {
    const header = layoutManager.createHeader('Title', {
      pageNumber: '201',
      title: 'Title',
      breadcrumbs: ['100', '200', '201']
    });
    
    expect(header.some(row => row.includes('100 > 200 > 201'))).toBe(true);
  });
});
```

## Troubleshooting

### Layout Not Filling Screen

**Problem:** Layout has empty rows or doesn't use full 24 rows.

**Solution:**
```typescript
// Ensure fullScreen is true
const layout = layoutManager.calculateLayout(page, {
  fullScreen: true,  // Must be true
  // ...
});

// Check totalRows
console.log(layout.totalRows); // Should be 24
```

### Content Overflow

**Problem:** Content doesn't fit in available space.

**Solution:**
```typescript
// Use optimizeSpacing to fit content
const availableRows = 24 - headerRows - footerRows;
const optimized = layoutManager.optimizeSpacing(content, availableRows);
```

### Header/Footer Misalignment

**Problem:** Header or footer rows are not properly formatted.

**Solution:**
```typescript
// Ensure metadata is complete
const header = layoutManager.createHeader(title, {
  pageNumber: page.id,
  title: page.title,
  // Include all required fields
});
```

## See Also

- [ANIMATION_ENGINE_API.md](./ANIMATION_ENGINE_API.md) - Animation Engine API
- [lib/LAYOUT_MANAGER_USAGE.md](./lib/LAYOUT_MANAGER_USAGE.md) - Usage examples
- [UX_REDESIGN_OVERVIEW.md](./UX_REDESIGN_OVERVIEW.md) - UX redesign overview
