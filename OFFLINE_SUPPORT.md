# Offline Support and Cache Fallback

This document describes the offline support implementation for Modern Teletext.

## Overview

The application implements comprehensive offline support to ensure users can access previously viewed pages even when network connectivity is unavailable. This is achieved through a multi-layered caching strategy.

**Requirements Implemented:**
- 13.4: Display cached content with "Cached" indicator when network is unavailable
- 15.3: Remain responsive during page loading

## Architecture

### Three-Layer Caching Strategy

1. **Service Worker Cache** (Primary)
   - Intercepts network requests
   - Implements network-first strategy for API calls
   - Falls back to cache when network fails
   - Automatically caches successful API responses

2. **Browser LocalStorage** (Secondary)
   - Stores page data with TTL (Time To Live)
   - Provides fallback when service worker is unavailable
   - Survives browser restarts
   - Configurable expiration times

3. **In-Memory Cache** (Tertiary)
   - Fast access for recently viewed pages
   - Cleared on page refresh
   - Used for navigation history

## Components

### Service Worker (`public/sw.js`)

The service worker handles:
- Static asset caching on install
- API request interception
- Network-first with cache fallback strategy
- Cache management and cleanup

**Key Features:**
- Adds `X-Cache-Status: cached` header to cached responses
- Returns offline error page when no cache available
- Supports cache management commands via postMessage

### Offline Support Hook (`hooks/useOfflineSupport.ts`)

Provides two custom hooks:

#### `useOfflineSupport()`
Manages service worker registration and network status:
- `isOnline`: Boolean indicating network connectivity
- `serviceWorkerReady`: Boolean indicating SW registration status
- `cachePage()`: Manually cache a page in service worker
- `clearCache()`: Clear all service worker caches

#### `useBrowserCache()`
Manages localStorage-based caching:
- `savePage()`: Save page with TTL
- `loadPage()`: Load page if not expired
- `clearPage()`: Remove specific page
- `clearAllPages()`: Clear all cached pages

### PageRouter Updates

The PageRouter component now:
- Detects online/offline status
- Attempts network fetch first
- Falls back to browser cache on failure
- Displays offline error page when no cache available
- Tracks whether current page is from cache

### TeletextScreen Updates

The screen component displays:
- `[CACHED]` indicator when serving cached content
- `[OFFLINE]` indicator when network is unavailable
- Both indicators positioned in top-right corner

## Usage

### Automatic Caching

Pages are automatically cached when:
1. Successfully fetched from the API
2. User navigates to the page
3. Service worker intercepts the request

### Manual Cache Management

```typescript
import { useOfflineSupport, useBrowserCache } from '@/hooks/useOfflineSupport';

function MyComponent() {
  const { isOnline, cachePage, clearCache } = useOfflineSupport();
  const { savePage, loadPage } = useBrowserCache();
  
  // Check if online
  if (!isOnline) {
    console.log('Offline mode active');
  }
  
  // Manually cache a page
  cachePage('200', pageData);
  
  // Save to browser cache with 30 minute TTL
  savePage('200', page, 30);
  
  // Load from browser cache
  const cachedPage = loadPage('200');
}
```

## Cache Expiration

Different content types have different TTL values:

- **Static pages** (100-199): Indefinite (until manual clear)
- **News** (200-299): 5 minutes
- **Sports** (300-399): 2 minutes (1 minute during live events)
- **Markets** (400-499): 1 minute
- **AI responses** (500-599): Session duration
- **Games** (600-699): Session duration
- **Settings** (700-799): Indefinite
- **Dev tools** (800-899): No cache

## Offline Error Page

When a page is not available offline, the system displays a helpful error page:

```
OFFLINE                         404
════════════════════════════════════════

NO NETWORK CONNECTION

This page is not available offline.

The page has not been cached or the
cache has expired.

Please check your connection and
try again.

Press 100 to return to index
```

## Testing

### Unit Tests

Tests are provided for:
- Browser cache save/load operations
- Cache expiration logic
- Error handling
- Metadata preservation
- Offline page creation

Run tests:
```bash
npm test hooks/__tests__/useOfflineSupport.test.ts
npm test types/__tests__/teletext.test.ts
```

### Manual Testing

1. **Test Offline Mode:**
   - Open DevTools → Network tab
   - Set throttling to "Offline"
   - Navigate to previously viewed pages
   - Verify [CACHED] indicator appears

2. **Test Cache Expiration:**
   - View a page
   - Wait for TTL to expire
   - Go offline
   - Try to view the page again
   - Should see offline error page

3. **Test Service Worker:**
   - Open DevTools → Application → Service Workers
   - Verify service worker is registered
   - Check Cache Storage for cached pages

## Browser Compatibility

- **Service Workers**: Supported in all modern browsers
- **LocalStorage**: Universal support
- **Online/Offline Events**: Universal support

Fallback behavior:
- If service worker unavailable → Use localStorage only
- If localStorage full → Graceful degradation, no caching
- If both unavailable → Network-only mode

## Performance Considerations

- Service worker adds ~10-20ms overhead for cache checks
- LocalStorage operations are synchronous but fast (<1ms)
- Cache size limited by browser (typically 5-10MB for localStorage)
- Service worker cache has larger limits (50MB+)

## Security

- Only caches GET requests
- No sensitive data cached (user preferences stored separately)
- Cache cleared on logout (if authentication added)
- Service worker scope limited to application origin

## Future Enhancements

Potential improvements:
- Background sync for offline actions
- Push notifications for breaking news
- Predictive prefetching based on navigation patterns
- IndexedDB for larger cache capacity
- Cache compression for better storage efficiency
