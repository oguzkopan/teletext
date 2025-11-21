/**
 * Timestamp and Cache Status Utilities
 * 
 * Provides utilities for managing timestamps and cache status indicators
 * for time-sensitive content (news, sports, markets).
 * 
 * Requirements: 18.1, 18.2, 18.3, 18.4, 18.5
 */

/**
 * Cache status type
 */
export type CacheStatus = 'LIVE' | 'CACHED';

/**
 * Time-sensitive content types that should display timestamps
 */
export const TIME_SENSITIVE_CONTENT_TYPES = ['NEWS', 'SPORT', 'MARKETS', 'WEATHER'];

/**
 * Cache duration thresholds (in milliseconds)
 * Content older than this is considered CACHED
 */
export const CACHE_THRESHOLDS = {
  NEWS: 5 * 60 * 1000,      // 5 minutes
  SPORT: 2 * 60 * 1000,     // 2 minutes (live scores)
  MARKETS: 5 * 60 * 1000,   // 5 minutes
  WEATHER: 30 * 60 * 1000,  // 30 minutes
  DEFAULT: 10 * 60 * 1000   // 10 minutes
};

/**
 * Determine if content is LIVE or CACHED based on timestamp
 * 
 * @param timestamp - ISO timestamp string
 * @param contentType - Type of content
 * @returns Cache status
 */
export function determineCacheStatus(
  timestamp: string | undefined,
  contentType?: string
): CacheStatus {
  if (!timestamp) {
    return 'LIVE';
  }

  const now = Date.now();
  const contentTime = new Date(timestamp).getTime();
  const age = now - contentTime;

  // Get threshold for content type
  const threshold = contentType && contentType in CACHE_THRESHOLDS
    ? CACHE_THRESHOLDS[contentType as keyof typeof CACHE_THRESHOLDS]
    : CACHE_THRESHOLDS.DEFAULT;

  return age > threshold ? 'CACHED' : 'LIVE';
}

/**
 * Format timestamp for display in header
 * 
 * @param timestamp - ISO timestamp string
 * @param format - Format type ('time' | 'datetime' | 'relative')
 * @returns Formatted timestamp string
 */
export function formatTimestamp(
  timestamp: string | undefined,
  format: 'time' | 'datetime' | 'relative' = 'time'
): string {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp);

  switch (format) {
    case 'time':
      // Format: "13:45"
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });

    case 'datetime':
      // Format: "21 Nov 13:45"
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short'
      }) + ' ' + date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });

    case 'relative':
      // Format: "5m ago", "2h ago", "1d ago"
      return getRelativeTime(date);

    default:
      return formatTimestamp(timestamp, 'time');
  }
}

/**
 * Get relative time string (e.g., "5m ago", "2h ago")
 * 
 * @param date - Date object
 * @returns Relative time string
 */
export function getRelativeTime(date: Date): string {
  const now = Date.now();
  const then = date.getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
}

/**
 * Get cache age display string
 * 
 * @param timestamp - ISO timestamp string
 * @returns Cache age string (e.g., "CACHED 5m ago")
 */
export function getCacheAgeDisplay(timestamp: string | undefined): string {
  if (!timestamp) {
    return '';
  }

  const relativeTime = getRelativeTime(new Date(timestamp));
  return `CACHED ${relativeTime}`;
}

/**
 * Format timestamp with cache status for header display
 * 
 * @param timestamp - ISO timestamp string
 * @param cacheStatus - Cache status
 * @returns Formatted string for header
 */
export function formatTimestampWithStatus(
  timestamp: string | undefined,
  cacheStatus: CacheStatus
): string {
  if (!timestamp) {
    return '';
  }

  const time = formatTimestamp(timestamp, 'time');
  const statusEmoji = cacheStatus === 'LIVE' ? '🔴' : '⚪';
  
  if (cacheStatus === 'CACHED') {
    const relativeTime = getRelativeTime(new Date(timestamp));
    return `${statusEmoji}${cacheStatus} ${relativeTime}`;
  }

  return `${statusEmoji}${cacheStatus} ${time}`;
}

/**
 * Check if content type should display timestamp
 * 
 * @param contentType - Content type
 * @returns True if timestamp should be displayed
 */
export function shouldDisplayTimestamp(contentType?: string): boolean {
  if (!contentType) {
    return false;
  }

  return TIME_SENSITIVE_CONTENT_TYPES.includes(contentType.toUpperCase());
}

/**
 * Get content type from page ID
 * 
 * @param pageId - Page ID
 * @returns Content type or undefined
 */
export function getContentTypeFromPageId(pageId: string): string | undefined {
  const pageNum = parseInt(pageId, 10);

  if (pageNum >= 200 && pageNum < 300) return 'NEWS';
  if (pageNum >= 300 && pageNum < 400) return 'SPORT';
  // Check for weather pages first (specific range within markets)
  if (pageNum >= 450 && pageNum < 460) return 'WEATHER';
  if (pageNum >= 400 && pageNum < 500) return 'MARKETS';

  return undefined;
}

/**
 * Create a timestamp update interval that updates every minute
 * 
 * @param callback - Function to call on each update
 * @returns Interval ID for cleanup
 */
export function createTimestampUpdateInterval(callback: () => void): NodeJS.Timeout {
  // Update every minute (60000ms)
  return setInterval(callback, 60000);
}

/**
 * Calculate next update time (next minute boundary)
 * 
 * @returns Milliseconds until next minute
 */
export function getMillisecondsUntilNextMinute(): number {
  const now = new Date();
  const nextMinute = new Date(now);
  nextMinute.setMinutes(now.getMinutes() + 1);
  nextMinute.setSeconds(0);
  nextMinute.setMilliseconds(0);
  
  return nextMinute.getTime() - now.getTime();
}
