# HTML Sanitization and Content Parsing

## Overview

This document describes the HTML sanitization and content parsing implementation for the Modern Teletext application. The implementation ensures that content from external APIs (news, sports, etc.) is properly cleaned and formatted for display in the teletext 40×24 character grid.

## Requirements Addressed

- **Requirement 13.2**: Handle API content that is empty gracefully
- **Requirement 13.3**: Sanitize special characters to prevent display issues
- **Requirement 14.4**: Strip HTML tags from external content
- **Requirement 14.5**: Preserve whitespace for layout formatting

## Implementation

### Location

The HTML sanitization utilities are implemented in two locations:

1. **Frontend** (`lib/teletext-utils.ts`): For client-side content processing
2. **Backend** (`functions/src/utils/html-sanitizer.ts`): For Cloud Functions content processing

Both implementations provide identical functionality to ensure consistent content handling across the application.

### Core Functions

#### 1. `stripHtmlTags(html: string): string`

Removes all HTML markup from content while preserving the text.

**Features:**
- Removes `<script>` and `<style>` tags with their content
- Removes HTML comments (`<!-- -->`)
- Strips all HTML tags
- Decodes common HTML entities (`&amp;`, `&lt;`, `&quot;`, etc.)
- Decodes extended entities (`&mdash;`, `&hellip;`, `&copy;`, etc.)
- Decodes numeric entities (`&#65;`, `&#x42;`)

**Example:**
```typescript
const html = '<p>Hello <strong>world</strong> &amp; friends</p>';
const result = stripHtmlTags(html);
// Result: "Hello world & friends"
```

#### 2. `sanitizeSpecialCharacters(text: string): string`

Converts problematic Unicode characters to ASCII equivalents for teletext display.

**Features:**
- Converts smart quotes to regular quotes (`"` → `"`, `'` → `'`)
- Converts em/en dashes to hyphens (`—` → `-`, `–` → `-`)
- Converts ellipsis to three dots (`…` → `...`)
- Removes zero-width characters
- Removes control characters (except newline)
- Replaces tabs with spaces
- Normalizes excessive spaces (3+ spaces → 2 spaces)

**Example:**
```typescript
const text = '"Hello" — with smart quotes…';
const result = sanitizeSpecialCharacters(text);
// Result: '"Hello" - with smart quotes...'
```

#### 3. `preserveWhitespace(text: string): string`

Normalizes line breaks while preserving intentional spacing.

**Features:**
- Converts `\r\n` to `\n`
- Converts `\r` to `\n`
- Preserves multiple spaces for layout

**Example:**
```typescript
const text = 'Line 1\r\nLine 2\rLine 3';
const result = preserveWhitespace(text);
// Result: "Line 1\nLine 2\nLine 3"
```

#### 4. `parseHtmlContent(html: string, preserveLayout: boolean = true): string`

Complete HTML parsing pipeline that combines all sanitization steps.

**Features:**
- Strips HTML tags
- Sanitizes special characters
- Preserves whitespace (optional)
- Trims excessive whitespace at start/end
- Normalizes multiple consecutive newlines

**Example:**
```typescript
const html = '<article><h1>Breaking News</h1><p>Story with "quotes" and special chars…</p></article>';
const result = parseHtmlContent(html);
// Result: "Breaking News\nStory with \"quotes\" and special chars..."
```

#### 5. `handleEmptyContent(content: string, defaultMessage: string = 'No content available'): string`

Handles empty or invalid content gracefully.

**Features:**
- Returns original content if not empty
- Returns default message for empty strings
- Returns default message for whitespace-only strings
- Handles null/undefined gracefully

**Example:**
```typescript
const empty = '';
const result = handleEmptyContent(empty, 'No news available');
// Result: "No news available"
```

## Usage Examples

### News Adapter

```typescript
import { parseHtmlContent, handleEmptyContent } from '../utils/html-sanitizer';

// Process news article
const article = {
  title: '<h1>Breaking: Tech Company Announces New Product</h1>',
  description: '<p>The company's new AI-powered device…</p>'
};

const cleanTitle = parseHtmlContent(article.title);
const cleanDescription = parseHtmlContent(article.description);

// Handle empty content
const finalDescription = handleEmptyContent(
  cleanDescription,
  'No description available'
);
```

### Sports Adapter

```typescript
import { sanitizeSpecialCharacters } from '../utils/html-sanitizer';

// Clean team names that might have special characters
const teamName = 'Manchester United — Red Devils';
const cleanName = sanitizeSpecialCharacters(teamName);
// Result: "Manchester United - Red Devils"
```

### Markets Adapter

```typescript
import { stripHtmlTags } from '../utils/html-sanitizer';

// Clean market data that might contain HTML
const marketUpdate = '<span>Bitcoin price: $50,000</span>';
const cleanUpdate = stripHtmlTags(marketUpdate);
// Result: "Bitcoin price: $50,000"
```

## Testing

Comprehensive test suites are provided for both implementations:

- **Frontend tests**: `lib/__tests__/teletext-utils.test.ts`
- **Backend tests**: `functions/src/utils/__tests__/html-sanitizer.test.ts`

### Test Coverage

- ✅ HTML tag removal (basic, nested, self-closing)
- ✅ Script and style tag removal
- ✅ HTML comment removal
- ✅ HTML entity decoding (common, extended, numeric)
- ✅ Smart quote conversion
- ✅ Dash conversion
- ✅ Ellipsis conversion
- ✅ Zero-width character removal
- ✅ Control character removal
- ✅ Tab replacement
- ✅ Space normalization
- ✅ Whitespace preservation
- ✅ Empty content handling
- ✅ Null/undefined handling
- ✅ Real-world news content
- ✅ Edge cases and integration scenarios

### Running Tests

```bash
# Frontend tests
npm test -- lib/__tests__/teletext-utils.test.ts

# Backend tests
cd functions
npm test -- src/utils/__tests__/html-sanitizer.test.ts
```

## Edge Cases Handled

1. **Malformed HTML**: Gracefully handles unclosed tags and invalid markup
2. **Empty content**: Returns appropriate default messages
3. **Null/undefined**: Safely handles missing data
4. **Mixed content**: Handles HTML with special characters
5. **Nested tags**: Properly strips deeply nested markup
6. **Script injection**: Removes potentially dangerous script tags
7. **Excessive whitespace**: Normalizes while preserving intentional spacing
8. **Unicode characters**: Converts to ASCII equivalents for teletext display

## Performance Considerations

- All functions use efficient regex patterns
- No external dependencies required
- Minimal memory allocation
- Suitable for high-frequency API processing

## Security Considerations

- Removes script and style tags to prevent XSS
- Strips all HTML markup to prevent injection
- Sanitizes control characters
- Safe for untrusted external API content

## Future Enhancements

Potential improvements for future versions:

1. Configurable entity decoding (allow/block specific entities)
2. Custom character replacement maps
3. Language-specific character handling
4. Performance optimization for large content
5. Streaming support for very large documents

## Related Documentation

- [Teletext Utils](lib/README.md)
- [News Adapter Setup](functions/NEWS_API_SETUP.md)
- [Requirements Document](.kiro/specs/modern-teletext/requirements.md)
- [Design Document](.kiro/specs/modern-teletext/design.md)
