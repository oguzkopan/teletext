# Teletext Utilities Library

This library provides core utilities for formatting and validating teletext content according to the 40×24 character grid constraints.

## Core Functions

### Layout Manager (NEW)

The **`LayoutManager`** class provides full-screen layout optimization for teletext pages:

- **`calculateLayout(page, options)`** - Calculates optimal layout with header, content, and footer
- **`createHeader(title, metadata)`** - Creates formatted header with page number, title, and metadata
- **`createFooter(navigation)`** - Creates footer with navigation hints and colored buttons
- **`optimizeSpacing(content, maxRows, alignment)`** - Optimizes content spacing for available rows
- **`validateLayout(layout)`** - Validates that layout produces exactly 24 rows of 40 characters

Features:
- Full-screen utilization (uses all 24 rows)
- Content type indicators (📰 NEWS, ⚽ SPORT, 📈 MARKETS, etc.)
- Page position indicators for multi-page content
- Breadcrumb support
- Colored button indicators (🔴 🟢 🟡 🔵)
- Arrow navigation hints (↑↓ for scrolling)
- Timestamp and cache status display

### Text Formatting

- **`wrapText(text, maxWidth)`** - Wraps text to fit within specified width, respecting word boundaries
- **`truncateText(text, maxLength, ellipsis)`** - Truncates text with optional ellipsis
- **`padText(text, width, align)`** - Pads text to exact width with left/right/center alignment
- **`normalizeRows(rows, targetWidth)`** - Ensures all rows are exactly the target width

### Page Management

- **`validatePage(page)`** - Validates that a page conforms to 40×24 constraints
- **`createEmptyPage(pageId, title)`** - Creates a valid empty teletext page
- **`formatContentToPages(content, maxRows)`** - Formats content into multiple pages

### Content Processing

- **`stripHtmlTags(html)`** - Removes HTML tags and decodes entities
- **`preserveWhitespace(text)`** - Normalizes line breaks while preserving spaces

## Requirements Coverage

This implementation satisfies the following requirements:

### Layout Manager
- **1.1**: Full screen utilization (at least 90% of 40×24 grid)
- **1.2**: Minimal padding on all sides
- **1.3**: Navigation options displayed within content area
- **1.4**: Headers in top row, footers in bottom row
- **1.5**: Main index uses rows 2-23 for content

### Text Utilities
- **2.1, 2.2**: 40×24 character grid constraints
- **14.1, 14.2**: Text wrapping and truncation
- **14.4**: HTML sanitization
- **14.5**: Whitespace preservation
- **11.5**: Page validation

## Testing

Run tests with:
```bash
npm test
```

All functions include comprehensive unit tests covering:
- Normal operation
- Edge cases (empty strings, long words, etc.)
- Boundary conditions
- Error handling
