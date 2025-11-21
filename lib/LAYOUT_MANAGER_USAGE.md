# Layout Manager Usage Guide

The Layout Manager provides full-screen utilization for teletext pages with consistent headers, footers, and navigation indicators.

## Quick Start

```typescript
import { LayoutManager } from '@/lib/layout-manager';
import { TeletextPage } from '@/types/teletext';

const layoutManager = new LayoutManager();

// Calculate layout for a page
const layout = layoutManager.calculateLayout(page, {
  fullScreen: true,
  headerRows: 2,
  footerRows: 2,
  contentAlignment: 'left',
  showBreadcrumbs: false,
  showPageIndicator: false
});

// Result contains header, content, and footer arrays
console.log(layout.header);   // 2 rows
console.log(layout.content);  // 20 rows
console.log(layout.footer);   // 2 rows
console.log(layout.totalRows); // 24
```

## Features

### 1. Full-Screen Utilization

The Layout Manager ensures all 24 rows are used efficiently:

- **Header**: 2 rows (title, page number, metadata)
- **Content**: 20 rows (optimized spacing)
- **Footer**: 2 rows (navigation hints, colored buttons)

### 2. Content Type Indicators

Automatically adds icons based on page number ranges:

- 📰 **NEWS** (200-299)
- ⚽ **SPORT** (300-399)
- 📈 **MARKETS** (400-499)
- 🤖 **AI** (500-599)
- 🎮 **GAMES** (600-699)
- ⚙️ **SETTINGS** (700-799)
- 🔧 **DEV** (800-899)

### 3. Page Position Indicators

For multi-page content, shows current position:

```
═══════════════════════════════════ 2/5
```

### 4. Navigation Hints

Automatically generates contextual navigation:

- `100=INDEX` - Return to main index
- `↑↓=SCROLL` - Arrow navigation available
- `↓=MORE` - More content below
- `↑=BACK` - Previous page available

### 5. Colored Button Indicators

Displays colored buttons with labels:

```
100=INDEX  🔴NEWS 🟢SPORT 🟡MARKETS 🔵AI
```

### 6. Timestamp and Cache Status

Shows data freshness for time-sensitive content:

```
═══════════════════════════ 🔴LIVE 14:30
═══════════════════════ ⚪CACHED 14:25
```

## API Reference

### LayoutManager.calculateLayout()

```typescript
calculateLayout(
  page: TeletextPage,
  options: LayoutOptions
): LayoutResult
```

**Options:**
- `fullScreen`: Use all 24 rows (default: true)
- `headerRows`: Rows for header (default: 2)
- `footerRows`: Rows for footer (default: 2)
- `contentAlignment`: 'left' | 'center' | 'justify'
- `showBreadcrumbs`: Show navigation history
- `showPageIndicator`: Show page position for multi-page content

**Returns:**
- `header`: Array of header rows
- `content`: Array of content rows
- `footer`: Array of footer rows
- `totalRows`: Total row count (always 24)

### LayoutManager.createHeader()

```typescript
createHeader(
  title: string,
  metadata: HeaderMetadata
): string[]
```

Creates a formatted header with:
- Page title (uppercase)
- Page number (P###)
- Content type icon
- Page position or timestamp
- Cache status

### LayoutManager.createFooter()

```typescript
createFooter(
  navigation: NavigationOptions
): string[]
```

Creates a formatted footer with:
- Navigation hints
- Colored button indicators
- Arrow navigation indicators
- Custom hints

### LayoutManager.optimizeSpacing()

```typescript
optimizeSpacing(
  content: string[],
  maxRows: number,
  alignment: 'left' | 'center' | 'justify'
): string[]
```

Optimizes content to fit available rows with proper alignment.

### LayoutManager.validateLayout()

```typescript
validateLayout(layout: LayoutResult): boolean
```

Validates that layout produces exactly 24 rows of 40 characters each.

## Examples

### Example 1: News Page

```typescript
const newsPage: TeletextPage = {
  id: '201',
  title: 'Breaking News',
  rows: [
    'MAJOR ANNOUNCEMENT',
    '',
    'Details of the announcement...',
    // ... more content
  ],
  links: [
    { label: 'INDEX', targetPage: '100', color: 'red' },
    { label: 'MORE', targetPage: '202', color: 'green' }
  ],
  meta: {
    source: 'NewsAPI',
    lastUpdated: new Date().toISOString(),
    cacheStatus: 'fresh'
  }
};

const layout = layoutManager.calculateLayout(newsPage, {
  fullScreen: true,
  headerRows: 2,
  footerRows: 2,
  contentAlignment: 'left',
  showBreadcrumbs: false,
  showPageIndicator: false
});

// Header will show: 📰 BREAKING NEWS              P201
// Footer will show: 100=INDEX  🔴INDEX 🟢MORE
```

### Example 2: Multi-Page Article

```typescript
const articlePage: TeletextPage = {
  id: '202',
  title: 'Article',
  rows: Array(20).fill('Article content...'),
  links: [{ label: 'INDEX', targetPage: '100', color: 'red' }],
  meta: {
    continuation: {
      currentPage: '202',
      nextPage: '203',
      previousPage: '201',
      totalPages: 3,
      currentIndex: 1
    }
  }
};

const layout = layoutManager.calculateLayout(articlePage, {
  fullScreen: true,
  headerRows: 2,
  footerRows: 2,
  contentAlignment: 'left',
  showBreadcrumbs: false,
  showPageIndicator: true
});

// Header will show page position: 2/3
// Footer will show: 100=INDEX  ↑↓=SCROLL
```

### Example 3: Centered Content

```typescript
const indexPage: TeletextPage = {
  id: '100',
  title: 'Main Index',
  rows: [
    'MODERN TELETEXT',
    '',
    'Welcome to the service',
    '',
    '200 - News',
    '300 - Sports',
    // ... more options
  ],
  links: [],
  meta: {}
};

const layout = layoutManager.calculateLayout(indexPage, {
  fullScreen: true,
  headerRows: 2,
  footerRows: 2,
  contentAlignment: 'center', // Center all content
  showBreadcrumbs: false,
  showPageIndicator: false
});

// All content rows will be centered
```

## Integration with Existing Code

The Layout Manager is designed to work seamlessly with existing teletext utilities:

```typescript
import { LayoutManager } from '@/lib/layout-manager';
import { wrapText, createSeparator } from '@/lib/teletext-utils';

// Wrap long text before passing to layout manager
const wrappedContent = wrapText(longText, 40);

const page: TeletextPage = {
  id: '200',
  title: 'News',
  rows: wrappedContent,
  links: [],
  meta: {}
};

const layout = layoutManager.calculateLayout(page, options);
```

## Requirements Coverage

The Layout Manager satisfies these requirements from the UX Redesign spec:

- **1.1**: Full screen utilization (at least 90% of 40×24 grid)
- **1.2**: Minimal padding on all sides
- **1.3**: Navigation options displayed within content area
- **1.4**: Headers in top row, footers in bottom row
- **1.5**: Main index uses rows 2-23 for content

## Testing

Comprehensive tests are available in:
- `lib/__tests__/layout-manager.test.ts` - Unit tests
- `lib/__tests__/layout-manager-example.test.ts` - Usage examples

Run tests:
```bash
npm test -- lib/__tests__/layout-manager
```

## Next Steps

The Layout Manager provides the foundation for:
1. Navigation Indicators component
2. Animation Engine integration
3. Theme-specific decorations
4. Enhanced page rendering

See the design document for the complete UX redesign roadmap.
