# Developer Tools Adapter Setup

## Overview

The DevAdapter provides developer tools and API exploration features for pages 800-899. It allows developers to inspect the raw JSON structure of pages, view API documentation, and see example requests.

## Page Structure

### Page 800: API Explorer Index
- Main entry point for developer tools
- Lists available dev tools pages
- Provides overview of the system architecture
- Links to JSON viewer, documentation, and examples

### Page 801: Raw JSON Viewer
- Displays the raw JSON representation of any page
- Formats JSON to fit 40-character width
- Can show current page context or example page
- Useful for debugging and understanding page structure

### Page 802: API Documentation
- Documents available API endpoints
- Shows page range mappings to adapters
- Describes request/response formats
- Lists all adapter types and their page ranges

### Page 803: Example Requests
- Shows example API request formats
- Demonstrates response structure
- Provides sample code snippets
- Links to other dev tools pages

## Usage

### Accessing Developer Tools

Navigate to page 800 to access the developer tools index:
```
Enter: 800
```

### Viewing Raw JSON

To view the raw JSON of any page:
1. Navigate to the page you want to inspect
2. Navigate to page 801
3. The JSON representation will be displayed

Alternatively, you can pass the page as a parameter:
```typescript
const devAdapter = new DevAdapter();
const jsonPage = await devAdapter.getPage('801', { currentPage: somePage });
```

### Using the Static Context

The DevAdapter maintains a static context for the current page, which can be set by the router:

```typescript
import { DevAdapter } from './adapters/DevAdapter';

// Before serving page 801, set the context
DevAdapter.setCurrentPageContext(currentPage);

// Get the JSON page
const jsonPage = await devAdapter.getPage('801');

// Clear context when done
DevAdapter.setCurrentPageContext(null);
```

## Features

### JSON Formatting

The DevAdapter automatically formats JSON to fit within the 40-character teletext width:
- Long lines are split at 40 characters
- Continuation lines are indented
- Structure is preserved as much as possible
- Truncation is indicated when content exceeds available space

### No Caching

Developer tools pages are not cached (`getCacheDuration()` returns 0) to ensure:
- Always fresh content
- Real-time JSON inspection
- Up-to-date documentation
- Dynamic page context

### Metadata

All dev pages include complete metadata:
- `source`: Always "DevAdapter"
- `lastUpdated`: Current timestamp
- `cacheStatus`: Always "fresh"

## Integration with Router

The DevAdapter is integrated into the router for pages 800-899:

```typescript
case 8:
  // 800-899: Dev tools adapter
  return new DevAdapter();
```

## Testing

Run the DevAdapter tests:
```bash
cd functions
npm test -- DevAdapter.test.ts
```

## Page Navigation

From any dev tools page, you can navigate to:
- **INDEX** (100): Main teletext index
- **DEV** (800): Developer tools index
- **JSON** (801): Raw JSON viewer
- **DOCS** (802): API documentation
- **EXAMPLES** (803): Example requests

## Requirements Satisfied

This adapter satisfies the following requirements:
- **10.1**: API explorer index (page 800)
- **10.2**: Raw JSON view (page 801)
- **10.3**: JSON formatting within 40-character width
- **10.4**: Continuation pages for long JSON
- **10.5**: Complete metadata on all pages
- **24.1**: API explorer index
- **24.2**: Raw JSON display
- **24.3**: API endpoint documentation
- **24.4**: JSON syntax highlighting (using teletext formatting)
- **24.5**: Example API requests and responses

## Future Enhancements

Potential improvements for future versions:
- Syntax highlighting with teletext colors
- Interactive JSON navigation
- API request testing interface
- Performance metrics display
- Cache statistics viewer
- Real-time API monitoring
