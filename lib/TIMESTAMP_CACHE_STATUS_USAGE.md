# Timestamp and Cache Status Indicators

This document describes the timestamp and cache status indicator system for time-sensitive content in the Modern Teletext application.

## Overview

The timestamp and cache status system provides visual indicators in page headers to show users:
- When content was last updated
- Whether content is LIVE or CACHED
- How old cached content is

This feature is specifically designed for time-sensitive content types: NEWS, SPORT, MARKETS, and WEATHER.

## Requirements

Implements requirements:
- **18.1**: Display timestamps in headers for time-sensitive content
- **18.2**: Show "LIVE" vs "CACHED" status indicators
- **18.3**: Display cache age (e.g., "CACHED 5m ago")
- **18.4**: Update timestamps every minute without page refresh
- **18.5**: Format timestamps consistently (e.g., "Updated: 13:45")

## Architecture

### Components

1. **Timestamp Utilities** (`lib/timestamp-cache-status.ts`)
   - Core logic for determining cache status
   - Timestamp formatting functions
   - Content type detection

2. **Layout Manager Integration** (`lib/layout-manager.ts`)
   - Displays timestamps in page headers
   - Applies cache status indicators

3. **Navigation Indicators Integration** (`lib/navigation-indicators.ts`)
   - Alternative header creation with timestamp support

4. **Timestamp Update Hook** (`hooks/useTimestampUpdates.ts`)
   - React hook for automatic minute-by-minute updates
   - Syncs with minute boundaries for efficiency

5. **PageRouter Integration** (`components/PageRouter.tsx`)
   - Applies timestamp updates to current page
   - Re-processes page layout every minute

## Usage

### Determining Cache Status

```typescript
import { determineCacheStatus } from '@/lib/timestamp-cache-status';

const timestamp = page.meta?.lastUpdated;
const contentType = 'NEWS';

const status = determineCacheStatus(timestamp, contentType);
// Returns: 'LIVE' or 'CACHED'
```

### Cache Thresholds

Different content types have different freshness thresholds:

- **NEWS**: 5 minutes
- **SPORT**: 2 minutes (live scores need frequent updates)
- **MARKETS**: 5 minutes
- **WEATHER**: 30 minutes
- **DEFAULT**: 10 minutes

Content older than its threshold is marked as CACHED.

### Formatting Timestamps

```typescript
import { formatTimestamp, formatTimestampWithStatus } from '@/lib/timestamp-cache-status';

// Format time only (HH:MM)
const time = formatTimestamp(timestamp, 'time');
// Result: "13:45"

// Format with date and time
const datetime = formatTimestamp(timestamp, 'datetime');
// Result: "21 Nov 13:45"

// Format relative time
const relative = formatTimestamp(timestamp, 'relative');
// Result: "5m ago"

// Format with status indicator
const withStatus = formatTimestampWithStatus(timestamp, 'LIVE');
// Result: "🔴LIVE 13:45"

const withStatusCached = formatTimestampWithStatus(timestamp, 'CACHED');
// Result: "⚪CACHED 5m ago"
```

### Display in Headers

The layout manager automatically displays timestamps for time-sensitive content:

```typescript
import { layoutManager } from '@/lib/layout-manager';

const header = layoutManager.createHeader('Breaking News', {
  pageNumber: '200',
  title: 'Breaking News',
  timestamp: new Date().toISOString(),
  contentType: 'NEWS'
});

// Header will include:
// Row 0: "📰 BREAKING NEWS              P200"
// Row 1: "═══════════════════════ 🔴LIVE 13:45"
```

### Automatic Updates

Use the `useTimestampUpdates` hook to automatically update timestamps every minute:

```typescript
import { useTimestampUpdateCheck } from '@/hooks/useTimestampUpdates';

function MyComponent({ page }) {
  const { shouldUpdate, currentTime } = useTimestampUpdateCheck(
    page.meta?.lastUpdated,
    'NEWS'
  );

  // Component re-renders every minute when shouldUpdate is true
  // Use currentTime to trigger re-processing of page layout
}
```

The hook:
- Only triggers updates for time-sensitive content types
- Syncs with minute boundaries for efficiency
- Returns current time that updates every minute

## Visual Indicators

### Status Emojis

- **🔴 LIVE**: Content is fresh (within threshold)
- **⚪ CACHED**: Content is older than threshold

### Display Formats

**LIVE Content:**
```
═══════════════════════ 🔴LIVE 13:45
```

**CACHED Content:**
```
═══════════════════ ⚪CACHED 5m ago
```

## Content Type Detection

The system automatically detects content type from page numbers:

- **200-299**: NEWS
- **300-399**: SPORT
- **400-449, 460-499**: MARKETS
- **450-459**: WEATHER

```typescript
import { getContentTypeFromPageId } from '@/lib/timestamp-cache-status';

const contentType = getContentTypeFromPageId('200');
// Returns: 'NEWS'
```

## Testing

Comprehensive tests are provided in `lib/__tests__/timestamp-cache-status.test.ts`:

```bash
npm test -- lib/__tests__/timestamp-cache-status.test.ts
```

Tests cover:
- Cache status determination
- Timestamp formatting
- Relative time calculation
- Content type detection
- Integration scenarios

## Performance Considerations

### Efficient Updates

- Timestamps update only once per minute
- Updates sync with minute boundaries to minimize re-renders
- Only time-sensitive content types trigger updates

### Minimal Re-processing

- Page layout is only re-processed when timestamp display changes
- Non-time-sensitive pages are not affected

### Memory Efficiency

- Single interval per component (not per page)
- Automatic cleanup on component unmount

## Examples

### News Page with LIVE Status

```
📰 BREAKING NEWS                    P201
═══════════════════════ 🔴LIVE 13:45
                                        
Major tech company announces new      
product launch...                     
```

### Sports Page with CACHED Status

```
⚽ LIVE SCORES                       P301
═══════════════════ ⚪CACHED 5m ago
                                        
Premier League Results:               
Manchester United 2 - 1 Liverpool     
```

### Markets Page with Timestamp

```
📈 STOCK MARKET                      P401
═══════════════════════ 🔴LIVE 14:30
                                        
FTSE 100: 7,234.56 ▲ +0.8%          
DOW JONES: 34,567.89 ▼ -0.3%        
```

## Integration with Adapters

Adapters should set the `lastUpdated` field in page metadata:

```typescript
return {
  id: '200',
  title: 'Breaking News',
  rows: [...],
  links: [...],
  meta: {
    source: 'NewsAdapter',
    lastUpdated: new Date().toISOString(), // Current timestamp
    cacheStatus: 'fresh' // Optional, will be determined automatically
  }
};
```

The system will automatically:
1. Detect content type from page number
2. Determine if timestamp should be displayed
3. Calculate cache status based on age
4. Format and display in header
5. Update display every minute

## Future Enhancements

Potential improvements:
- User-configurable cache thresholds
- Different timestamp formats per user preference
- Countdown timers for upcoming events
- Flash animation when content updates
- Cache status in footer for multi-page content
