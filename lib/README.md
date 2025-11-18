# Teletext Utilities Library

This library provides core utilities for formatting and validating teletext content according to the 40×24 character grid constraints.

## Core Functions

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
