# Design Document

## Overview

This design document outlines a complete rebuild of the Modern Teletext application's layout engine and navigation system. The current implementation has critical flaws: text is cut off mid-screen, layouts lack the professional multi-column structure of BBC Ceefax, and navigation breaks on AI and game pages. This redesign will create a new layout engine from scratch that renders text in proper columns using the full 40×24 grid, and implement a robust navigation router that handles both 1-digit and 3-digit input correctly across all page types.

The redesign follows these principles:
1. **Professional Layout**: Multi-column text rendering like BBC Ceefax with proper spacing and alignment
2. **Bulletproof Navigation**: Consistent input handling that never leaves users stuck
3. **Clear Visual Hierarchy**: Headers, content, and footers with proper page numbers and navigation hints
4. **Modular Architecture**: Separate layout logic from content generation for maintainability

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Teletext   │  │  Navigation  │  │    Input     │      │
│  │   Screen     │  │   Router     │  │   Handler    │      │
│  │  (Display)   │  │   (NEW)      │  │   (NEW)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                │                  │              │
│           └────────────────┴──────────────────┘              │
│                          │                                   │
│                   ┌──────▼──────┐                           │
│                   │   Layout    │                           │
│                   │   Engine    │                           │
│                   │   (NEW)     │                           │
│                   └──────┬──────┘                           │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Backend   │
                    │   Adapters  │
                    │  (Enhanced) │
                    └─────────────┘
```

### New Components

**Layout Engine:**
- Renders text in multi-column layouts
- Handles text wrapping and column flow
- Manages headers, footers, and content areas
- Ensures full 40×24 grid utilization

**Navigation Router:**
- Centralized navigation logic for all pages
- Handles 1-digit, 2-digit, and 3-digit input modes
- Maintains navigation history and breadcrumbs
- Validates page numbers and handles errors

**Input Handler:**
- Processes keyboard input with proper buffering
- Determines expected input length per page
- Displays input buffer to user
- Triggers navigation when complete

## Components and Interfaces

### Layout Engine

```typescript
interface LayoutEngine {
  // Core layout methods
  renderPage(content: PageContent, options: LayoutOptions): string[];
  renderMultiColumn(text: string[], columns: number): string[];
  renderHeader(title: string, pageNumber: string, timestamp?: string): string[];
  renderFooter(hints: NavigationHint[]): string[];
  
  // Text formatting
  wrapText(text: string, width: number): string[];
  alignText(text: string, width: number, align: 'left' | 'center' | 'right'): string;
  truncateText(text: string, maxLength: number): string;
  
  // Column management
  calculateColumnWidths(totalWidth: number, columns: number, gutter: number): number[];
  flowTextToColumns(text: string[], columnWidths: number[]): string[][];
}

interface PageContent {
  title: string;
  body: string | string[];
  links?: NavigationLink[];
  metadata?: PageMetadata;
}

interface LayoutOptions {
  columns: number;          // Number of columns (1-3)
  columnGutter: number;     // Space between columns
  headerRows: number;       // Rows for header (default: 2)
  footerRows: number;       // Rows for footer (default: 2)
  contentAlignment: 'left' | 'center' | 'justify';
  showTimestamp: boolean;
  showPageNumber: boolean;
}

interface PageMetadata {
  source: string;
  lastUpdated?: Date;
  contentType?: 'news' | 'sports' | 'markets' | 'ai' | 'games' | 'weather';
}

interface NavigationHint {
  text: string;
  color?: string;
}
```

**Layout Calculation Example:**

```typescript
function renderPage(content: PageContent, options: LayoutOptions): string[] {
  const rows: string[] = [];
  
  // Render header (2 rows)
  const header = renderHeader(
    content.title,
    content.metadata?.pageNumber || '100',
    options.showTimestamp ? content.metadata?.lastUpdated : undefined
  );
  rows.push(...header);
  
  // Calculate available content rows
  const contentRows = 24 - options.headerRows - options.footerRows;
  
  // Render content based on column count
  let contentLines: string[];
  if (options.columns === 1) {
    // Single column - simple wrapping
    contentLines = wrapText(content.body, 40);
  } else {
    // Multi-column layout
    const columnWidths = calculateColumnWidths(40, options.columns, options.columnGutter);
    const columns = flowTextToColumns(wrapText(content.body, 40), columnWidths);
    contentLines = mergeColumns(columns, columnWidths, options.columnGutter);
  }
  
  // Take only the rows that fit
  rows.push(...contentLines.slice(0, contentRows));
  
  // Pad if needed
  while (rows.length < 24 - options.footerRows) {
    rows.push(' '.repeat(40));
  }
  
  // Render footer
  const footer = renderFooter(generateNavigationHints(content));
  rows.push(...footer);
  
  return rows;
}
```

**Multi-Column Layout:**

```typescript
function renderMultiColumn(text: string[], columns: number): string[] {
  if (columns === 1) {
    return text.map(line => padText(line, 40));
  }
  
  // Calculate column widths with gutters
  // For 2 columns: 19 chars each + 2 char gutter = 40
  // For 3 columns: 12 chars each + 2 char gutters = 40
  const gutter = 2;
  const columnWidth = Math.floor((40 - (gutter * (columns - 1))) / columns);
  
  // Distribute text across columns
  const linesPerColumn = Math.ceil(text.length / columns);
  const columnData: string[][] = [];
  
  for (let col = 0; col < columns; col++) {
    const start = col * linesPerColumn;
    const end = Math.min(start + linesPerColumn, text.length);
    columnData.push(text.slice(start, end));
  }
  
  // Merge columns horizontally
  const maxRows = Math.max(...columnData.map(col => col.length));
  const result: string[] = [];
  
  for (let row = 0; row < maxRows; row++) {
    let line = '';
    for (let col = 0; col < columns; col++) {
      const cellText = columnData[col][row] || '';
      line += padText(cellText, columnWidth);
      if (col < columns - 1) {
        line += ' '.repeat(gutter);
      }
    }
    result.push(line);
  }
  
  return result;
}
```

### Navigation Router

```typescript
interface NavigationRouter {
  // Navigation methods
  navigateToPage(pageId: string): Promise<void>;
  navigateBack(): Promise<void>;
  navigateForward(): Promise<void>;
  navigateUp(): Promise<void>;
  navigateDown(): Promise<void>;
  
  // Input handling
  handleDigitInput(digit: number): void;
  handleEnter(): void;
  handleBackspace(): void;
  clearInputBuffer(): void;
  
  // State management
  getCurrentPage(): TeletextPage | null;
  getInputBuffer(): string;
  getExpectedInputLength(): number;
  getNavigationHistory(): string[];
  canGoBack(): boolean;
  canGoForward(): boolean;
  
  // Page validation
  isValidPageNumber(pageId: string): boolean;
  getPageInputMode(pageId: string): InputMode;
}

type InputMode = 'single' | 'double' | 'triple';

interface NavigationState {
  currentPage: TeletextPage | null;
  inputBuffer: string;
  history: string[];
  historyIndex: number;
  expectedInputLength: number;
  loading: boolean;
}
```

**Input Mode Detection:**

```typescript
function getPageInputMode(page: TeletextPage): InputMode {
  // Check page metadata first
  if (page.meta?.inputMode) {
    return page.meta.inputMode;
  }
  
  // Determine from page type
  const pageNumber = parseInt(page.id, 10);
  
  // Selection pages with numbered options use single-digit input
  if (page.links.length > 0 && page.links.length <= 9) {
    const hasNumberedOptions = page.links.every((link, index) => 
      link.label === (index + 1).toString()
    );
    if (hasNumberedOptions) {
      return 'single';
    }
  }
  
  // AI pages (500-599) and Games (600-699) often use single-digit
  if ((pageNumber >= 500 && pageNumber < 600) || (pageNumber >= 600 && pageNumber < 700)) {
    // Check if page has single-digit options
    if (page.meta?.inputOptions && page.meta.inputOptions.length <= 9) {
      return 'single';
    }
  }
  
  // Default to 3-digit input for standard page navigation
  return 'triple';
}
```

**Navigation Logic:**

```typescript
async function handleDigitInput(digit: number): Promise<void> {
  const inputMode = getPageInputMode(currentPage);
  const maxLength = inputMode === 'single' ? 1 : inputMode === 'double' ? 2 : 3;
  
  // For single-digit mode, navigate immediately
  if (inputMode === 'single') {
    const digitStr = digit.toString();
    
    // Check if this is a valid option
    if (currentPage.meta?.inputOptions?.includes(digitStr)) {
      // Find matching link
      const link = currentPage.links.find(l => l.label === digitStr);
      if (link && link.targetPage) {
        await navigateToPage(link.targetPage);
        return;
      }
      
      // No link found - use sub-page navigation
      const subPageId = `${currentPage.id}-${digitStr}`;
      await navigateToPage(subPageId);
      return;
    }
    
    // Invalid option - show error
    showError(`Invalid option: ${digitStr}`);
    return;
  }
  
  // For multi-digit mode, add to buffer
  if (inputBuffer.length < maxLength) {
    inputBuffer += digit.toString();
    
    // Auto-navigate when buffer is full
    if (inputBuffer.length === maxLength) {
      await navigateToPage(inputBuffer);
      inputBuffer = '';
    }
  }
}
```

### Input Handler

```typescript
interface InputHandler {
  // Keyboard event processing
  handleKeyPress(event: KeyboardEvent): void;
  handleKeyDown(event: KeyboardEvent): void;
  
  // Input buffer management
  getInputBuffer(): string;
  clearInputBuffer(): void;
  removeLastDigit(): void;
  
  // Visual feedback
  renderInputBuffer(): string;
  showInputHint(): string;
}

function renderInputBuffer(): string {
  const mode = getPageInputMode(currentPage);
  const maxLength = mode === 'single' ? 1 : mode === 'double' ? 2 : 3;
  
  // Show input buffer with underscores for remaining digits
  let display = inputBuffer;
  while (display.length < maxLength) {
    display += '_';
  }
  
  return `[${display}]`;
}

function showInputHint(): string {
  const mode = getPageInputMode(currentPage);
  
  if (mode === 'single') {
    return 'Enter 1-digit option';
  } else if (mode === 'double') {
    return 'Enter 2-digit page';
  } else {
    return 'Enter 3-digit page';
  }
}
```

## Data Models

### Enhanced Page Model

```typescript
interface TeletextPage {
  id: string;
  title: string;
  rows: string[];  // Exactly 24 rows of 40 characters
  links: PageLink[];
  meta?: PageMetadata;
}

interface PageMetadata {
  source: string;
  lastUpdated?: string;
  contentType?: 'news' | 'sports' | 'markets' | 'ai' | 'games' | 'weather';
  inputMode?: 'single' | 'double' | 'triple';
  inputOptions?: string[];  // Valid options for single-digit input
  layoutConfig?: LayoutConfig;
  navigationHints?: string[];
}

interface LayoutConfig {
  columns: number;
  columnGutter: number;
  contentAlignment: 'left' | 'center' | 'justify';
  showTimestamp: boolean;
}

interface PageLink {
  label: string;
  targetPage: string;
  color?: 'red' | 'green' | 'yellow' | 'blue';
}
```

### Navigation History

```typescript
interface NavigationHistory {
  pages: string[];
  currentIndex: number;
  maxSize: number;  // Limit history size
}

function addToHistory(pageId: string): void {
  // Remove any forward history
  history.pages = history.pages.slice(0, history.currentIndex + 1);
  
  // Add new page
  history.pages.push(pageId);
  history.currentIndex = history.pages.length - 1;
  
  // Trim if exceeds max size
  if (history.pages.length > history.maxSize) {
    history.pages.shift();
    history.currentIndex--;
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Full width utilization
*For any* page rendered by the layout engine, every row should be exactly 40 characters wide.
**Validates: Requirements 1.1**

### Property 2: Exact row count
*For any* page rendered by the layout engine, the output should contain exactly 24 rows.
**Validates: Requirements 1.5**

### Property 3: No text cutoff
*For any* text content, the layout engine should wrap or truncate text rather than cutting it off mid-screen.
**Validates: Requirements 1.4**

### Property 4: Header consistency
*For any* page, the header should display the page number in the top-left and title centered.
**Validates: Requirements 2.1, 2.2**

### Property 5: Page number alignment
*For any* list of navigation options, all page numbers should be left-aligned in the same column.
**Validates: Requirements 3.1, 3.4**

### Property 6: Valid page navigation
*For any* valid page number entered, the navigation router should navigate to that page.
**Validates: Requirements 4.2, 8.2**

### Property 7: Invalid page handling
*For any* invalid page number entered, the system should display an error and remain on the current page.
**Validates: Requirements 4.3, 8.3, 14.2**

### Property 8: Input mode detection
*For any* page with single-digit options, the input handler should detect single-digit mode and navigate immediately.
**Validates: Requirements 6.2**

### Property 9: Input buffer display
*For any* digit entered, the input buffer should display the digit to the user.
**Validates: Requirements 7.1, 7.2**

### Property 10: Auto-navigation
*For any* input buffer that reaches the expected length, navigation should trigger automatically.
**Validates: Requirements 7.3**

### Property 11: Navigation consistency
*For any* page type, numeric input should always be accepted for page navigation.
**Validates: Requirements 8.1**

### Property 12: Back button functionality
*For any* page with navigation history, the back button should return to the previous page.
**Validates: Requirements 8.4**

### Property 13: Selection page formatting
*For any* selection page, options should be numbered and clearly formatted.
**Validates: Requirements 9.1, 9.5**

### Property 14: AI page navigation
*For any* AI selection page, entering a valid option number should navigate to the corresponding AI page.
**Validates: Requirements 4.1, 4.2, 4.5**

### Property 15: Quiz navigation
*For any* quiz page, entering an answer number should navigate to the next question.
**Validates: Requirements 5.3, 5.4**

### Property 16: Multi-column layout
*For any* content rendered in multiple columns, columns should have consistent widths and spacing.
**Validates: Requirements 1.2, 1.3**

### Property 17: Footer hints
*For any* page, the footer should display at least one navigation hint.
**Validates: Requirements 13.1**

### Property 18: Context-specific hints
*For any* two pages of different types, the navigation hints should differ appropriately.
**Validates: Requirements 13.2, 13.3, 13.4**

### Property 19: Error recovery
*For any* navigation error, the system should provide a way to return to the index.
**Validates: Requirements 14.3, 14.4**

### Property 20: Layout modularity
*For any* page content, the layout engine should be able to render it independently of the content source.
**Validates: Requirements 15.1, 15.2**

## Error Handling

### Layout Errors

**Text Overflow:**
- If text exceeds available space, truncate with "..." indicator
- Never allow text to extend beyond 40 characters
- Log overflow for debugging

**Invalid Dimensions:**
- If row count is not 24, pad with empty rows or truncate
- If row width is not 40, pad or truncate
- Validate all output before returning

**Column Calculation Errors:**
- If column widths don't sum to 40, adjust last column
- If column count is invalid, fall back to single column
- Log calculation errors

### Navigation Errors

**Invalid Page Numbers:**
- Display "Page not found" message
- Suggest returning to index (100)
- Log invalid page attempts

**Navigation Failures:**
- If page fetch fails, show error page
- Provide back button to previous page
- Never leave user on blank page

**Input Errors:**
- If invalid digit for current mode, show error
- Clear input buffer on error
- Display expected input format

### Input Handling Errors

**Buffer Overflow:**
- Prevent buffer from exceeding expected length
- Clear buffer if user continues typing
- Provide visual feedback

**Invalid Characters:**
- Ignore non-numeric input in page navigation mode
- Only accept 0-9 for page numbers
- Log invalid input attempts

## Testing Strategy

### Unit Testing

**Layout Engine Tests:**
- Test single-column rendering
- Test multi-column rendering (2 and 3 columns)
- Test header formatting
- Test footer formatting
- Test text wrapping
- Test text alignment
- Test truncation

**Navigation Router Tests:**
- Test page number validation
- Test input mode detection
- Test navigation history
- Test back/forward navigation
- Test error handling

**Input Handler Tests:**
- Test digit input
- Test backspace
- Test enter key
- Test input buffer display
- Test auto-navigation

### Integration Testing

**End-to-End Navigation:**
- Test navigation from index to various pages
- Test AI page selection and navigation
- Test game page selection and navigation
- Test quiz flow
- Test back button across different page types

**Layout Integration:**
- Test layout rendering for all page types
- Test multi-column layouts with real content
- Test header/footer rendering with navigation
- Test responsive layout adjustments

### Property-Based Testing

**Framework:** fast-check (JavaScript/TypeScript property-based testing library)

**Configuration:** Each property test should run a minimum of 100 iterations.

**Test Tagging:** Each property-based test must include a comment: `// Feature: teletext-core-redesign, Property X: [property text]`

**Example Property Tests:**

```typescript
import fc from 'fast-check';

describe('Core Redesign Property Tests', () => {
  it('Property 1: Full width utilization', () => {
    // Feature: teletext-core-redesign, Property 1: Full width utilization
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ maxLength: 40 }),
          body: fc.array(fc.string({ maxLength: 100 }), { minLength: 1, maxLength: 50 })
        }),
        (content) => {
          const rows = layoutEngine.renderPage(content, { columns: 1 });
          
          // Every row should be exactly 40 characters
          rows.forEach(row => {
            expect(row.length).toBe(40);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 2: Exact row count', () => {
    // Feature: teletext-core-redesign, Property 2: Exact row count
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ maxLength: 40 }),
          body: fc.array(fc.string({ maxLength: 100 }))
        }),
        (content) => {
          const rows = layoutEngine.renderPage(content, { columns: 1 });
          
          // Should always be exactly 24 rows
          expect(rows.length).toBe(24);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 6: Valid page navigation', () => {
    // Feature: teletext-core-redesign, Property 6: Valid page navigation
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 899 }),
        async (pageNumber) => {
          const pageId = pageNumber.toString();
          
          await navigationRouter.navigateToPage(pageId);
          
          // Should navigate successfully
          const currentPage = navigationRouter.getCurrentPage();
          expect(currentPage).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 8: Input mode detection', () => {
    // Feature: teletext-core-redesign, Property 8: Input mode detection
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer({ min: 500, max: 599 }).map(n => n.toString()),
          links: fc.array(
            fc.record({
              label: fc.integer({ min: 1, max: 9 }).map(n => n.toString()),
              targetPage: fc.string()
            }),
            { minLength: 1, maxLength: 9 }
          )
        }),
        (pageData) => {
          const page: TeletextPage = {
            id: pageData.id,
            title: 'Test',
            rows: Array(24).fill(''),
            links: pageData.links,
            meta: {
              inputOptions: pageData.links.map(l => l.label)
            }
          };
          
          const inputMode = navigationRouter.getPageInputMode(page);
          
          // Should detect single-digit mode
          expect(inputMode).toBe('single');
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

## Implementation Plan

### Phase 1: Layout Engine (Core)
1. Implement basic text wrapping and padding functions
2. Implement single-column layout rendering
3. Implement header and footer rendering
4. Add validation for 40×24 constraint

### Phase 2: Multi-Column Layout
1. Implement column width calculation
2. Implement text flow across columns
3. Implement column merging
4. Test with various content types

### Phase 3: Navigation Router
1. Implement page number validation
2. Implement navigation history
3. Implement input mode detection
4. Implement navigation methods (back, forward, etc.)

### Phase 4: Input Handler
1. Implement digit input processing
2. Implement input buffer management
3. Implement auto-navigation logic
4. Add visual feedback for input

### Phase 5: Integration
1. Connect layout engine to page adapters
2. Connect navigation router to frontend
3. Update all page adapters to use new layout engine
4. Test end-to-end navigation flows

### Phase 6: Testing & Polish
1. Write unit tests for all components
2. Write integration tests for navigation flows
3. Write property-based tests
4. Fix bugs and polish UI

## Migration Strategy

### Backward Compatibility
- Keep existing page structure during transition
- Add feature flags to enable new layout engine per page type
- Gradually migrate page adapters to new system

### Rollout Plan
1. Enable new layout engine for static pages (100, 404, etc.)
2. Enable for news pages (200-299)
3. Enable for sports pages (300-399)
4. Enable for AI pages (500-599) with fixed navigation
5. Enable for game pages (600-699) with fixed navigation
6. Enable for all remaining pages

### Rollback Plan
- Feature flags allow instant rollback per page type
- Keep old layout code until migration is complete
- Monitor error rates and user feedback

## Performance Considerations

### Layout Engine Performance
- Cache column width calculations
- Reuse text wrapping results when possible
- Minimize string operations
- Profile rendering performance

### Navigation Performance
- Debounce rapid input
- Cancel pending page fetches on new navigation
- Cache recently visited pages
- Preload likely next pages

### Memory Management
- Limit navigation history size
- Clear old cached pages
- Avoid memory leaks in event listeners
- Monitor memory usage

## Accessibility

### Keyboard Navigation
- All navigation must work with keyboard only
- Clear visual feedback for input
- Consistent keyboard shortcuts
- Support screen readers

### Visual Clarity
- High contrast text
- Clear page numbers
- Obvious navigation hints
- Consistent layout across pages

### Error Messages
- Clear, actionable error messages
- Always provide way to recover
- Never leave user stuck
- Log errors for debugging
